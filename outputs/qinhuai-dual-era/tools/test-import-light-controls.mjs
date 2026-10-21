import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {DEFAULT_MAP_LIGHTS as D,MAP_LIGHT_FIELDS,MAP_LIGHT_STORAGE_KEY,normalizeMapLights,readMapLights,saveMapLights,mountMapLightControls} from '../import-light-controls.mjs';
import {ImportNightLighting,GATE_LIGHT_PRESETS} from '../import-night-lighting.js';
import {ImportStreetlamps} from '../import-streetlamps.js';
import {ImportFestivalLanterns} from '../import-festival-lanterns.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const fixture=async()=>{const scene=new THREE.Group();scene.add(new THREE.Mesh(new THREE.BoxGeometry(2,1,2),new THREE.MeshStandardMaterial()));return {scene};};
const memory=()=>{const data=new Map([['qinhuai.building-light-studies.v1','user study must stay untouched']]);return {data,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};

test('all category defaults, validation, zero values and independent storage round trip',()=>{
 assert.equal(MAP_LIGHT_FIELDS.length,58);assert.deepEqual(normalizeMapLights(),D);
 for(const invalid of [null,[],false,'text'])assert.deepEqual(normalizeMapLights(invalid),D);
 const values={...D,bloomStrength:0,bloomRadius:1,spillHorizontal:2,washPenumbra:0,groundIntensity:0};
 const store=memory();assert.equal(saveMapLights(store,values),true);assert.deepEqual(readMapLights(store),values);
 assert.equal(store.data.get('qinhuai.building-light-studies.v1'),'user study must stay untouched');
 assert.equal(store.data.size,2);assert.equal(normalizeMapLights({exposure:Infinity}).exposure,D.exposure);
 assert.equal(normalizeMapLights({groundRadius:100}).groundRadius,2);assert.equal(normalizeMapLights({groundRadius:1.03}).groundRadius,1.05);assert.equal(normalizeMapLights({spillIntensity:-2}).spillIntensity,0);
 store.data.set(MAP_LIGHT_STORAGE_KEY,'broken json');assert.deepEqual(readMapLights(store),D);
 store.data.set(MAP_LIGHT_STORAGE_KEY,JSON.stringify({version:9,settings:values}));assert.deepEqual(readMapLights(store),D);
 assert.deepEqual(readMapLights({getItem(){throw Error('denied');}}),D);
 assert.equal(saveMapLights({setItem(){throw Error('quota');}},values),false);
 assert.equal(saveMapLights(undefined,values),false);
});

test('late-loaded wash lights, gate scheme changes, no compounding and restore',()=>{
 const rig=new ImportNightLighting(new THREE.Scene());
 const settings={...D,washIntensity:1.7,washDistance:1.4,washAngle:1.1,washPenumbra:.2};
 rig.setMapLightSettings(settings);rig.setGatePreset('amber');
 rig.layout={tiles:Object.fromEntries([9,10].map(id=>[`tile-${id.toString().padStart(2,'0')}`,{materials:[],fixtures:[],boats:[],bounds:{}}]))};
 rig.attachTile(9,new THREE.Group());rig.attachTile(10,new THREE.Group());
 const spot=rig.root.getObjectByName('天下文枢·牌匾洗亮'),east=rig.root.getObjectByName('东岸商铺暖光');
 near(spot.intensity,GATE_LIGHT_PRESETS.amber.spot*1.7);near(east.intensity,153);near(east.distance,22.4);near(east.angle,1.045);near(east.penumbra,.2);
 const pos=east.position.toArray();for(let i=0;i<5;i++)rig.setMapLightSettings(settings);
 near(east.intensity,153);near(east.distance,22.4);assert.deepEqual(east.position.toArray(),pos);
 rig.setGatePreset('gold');near(spot.intensity,GATE_LIGHT_PRESETS.gold.spot*1.7);
 rig.setMapLightSettings({...settings,washIntensity:0});assert.equal(east.intensity,0);rig.setGatePreset('soft');assert.equal(spot.intensity,0);
 rig.setMapLightSettings(D);near(east.intensity,90);near(east.distance,16);near(east.angle,.95);near(east.penumbra,.85);
 rig.dispose();
});

test('study multipliers preserve source snapshots and disabled soft spill',()=>{
 const rig=new ImportNightLighting(new THREE.Scene());
 function roof(){return {lighting:{uniforms:{width:{value:0}},apply(source){this.uniforms.width.value=source.width;}}};}
 const temple=roof(),pavilion=roof();rig.templeStudies.push(temple);rig.pavilionStudies.push(pavilion);
 const spill={active:{value:0},parameters:{spread:{value:new THREE.Vector3()},falloff:{value:0}}};
 const study={spill,apply(source){const s=source.softSpill.settings;spill.active.value=source.softSpill.enabled&&source.lightEnabled!==false?s.intensity:0;spill.parameters.spread.value.set(s.horizontal,s.up,s.down);spill.parameters.falloff.value=s.falloff;}};
 rig.matouStudies.push(study);const original=JSON.stringify(rig.matouSelection.settings);
 const p={...D,eaveWidth:2,spillIntensity:2,spillHorizontal:1.5,spillUp:.5,spillDown:1.8,spillFalloff:1.5};
 for(let i=0;i<5;i++)rig.setMapLightSettings(p);
 near(temple.lighting.uniforms.width.value,rig.templeSelection.settings.width/2);near(pavilion.lighting.uniforms.width.value,rig.pavilionSelection.settings.width/2);
 near(spill.active.value,2.28);near(spill.parameters.spread.value.x,.97*1.5);near(spill.parameters.spread.value.y,.25*.5);near(spill.parameters.spread.value.z,1.18*1.8);near(spill.parameters.falloff.value,3);
 assert.equal(JSON.stringify(rig.matouSelection.settings),original);
 rig.refreshTempleStudy();near(spill.active.value,2.28);
 rig.matouSelection={...rig.matouSelection,settings:{...rig.matouSelection.settings,softSpill:{...rig.matouSelection.settings.softSpill,enabled:false}}};
 rig.applyMapLightSettings();assert.equal(spill.active.value,0);
 rig.refreshTempleStudy();rig.setMapLightSettings(D);near(spill.active.value,1.14);near(spill.parameters.spread.value.x,.97);near(spill.parameters.falloff.value,2);
 // Stub studies have no geometry resources to dispose.
 rig.templeStudies=[];rig.pavilionStudies=[];rig.matouStudies=[];rig.dispose();
});

test('ground radii do not move lamp centers or alter bodies / river reflections',async()=>{
 const parent=new THREE.Group(),street=new ImportStreetlamps(parent,{load:fixture});
 const festival=new ImportFestivalLanterns(parent,{load:fixture,loadMask:async()=>new THREE.Texture()});
 const p={...D,groundRadius:1.8,groundIntensity:2};street.setMapLightSettings(p);festival.setMapLightSettings(p);
 await street.registerTile(9);await festival.registerTile(9);await festival.registerTile(6);
 const matrices=[];parent.traverse(o=>{if(o.isInstancedMesh)matrices.push([o,Array.from(o.instanceMatrix.array)]);});
 const reflection=Array.from(festival.entries.values()).flatMap(e=>e.reflectionMaterials);const shaders=reflection.map(m=>m.fragmentShader);
 for(let i=0;i<4;i++){street.setMapLightSettings(p);festival.setMapLightSettings(p);}
 const grounds=[];parent.traverse(o=>{if(o.userData.streetlampSpill||o.userData.festivalSpill)grounds.push(o);});
 assert.ok(grounds.length>0);
 for(const mesh of grounds){assert.equal(mesh.material.uniforms.mapGroundRadius.value,1.8);assert.equal(mesh.material.uniforms.mapGroundIntensity.value,2);assert.match(mesh.material.vertexShader,/localPosition.xz\s*\*=\s*mapGroundRadius/);assert.equal(mesh.frustumCulled,false);}
 for(const [mesh,matrix] of matrices)assert.deepEqual(Array.from(mesh.instanceMatrix.array),matrix);
 assert.deepEqual(reflection.map(m=>m.fragmentShader),shaders);assert.ok(reflection.every(m=>!m.uniforms.mapGroundRadius));
 street.setState({night:false});festival.setState({night:false});assert.ok(grounds.every(m=>!m.visible));
 street.setState({night:true});festival.setState({night:true});assert.ok(grounds.every(m=>m.visible));
 street.setMapLightSettings(D);festival.setMapLightSettings(D);assert.ok(grounds.every(m=>m.material.uniforms.mapGroundRadius.value===1));
 street.dispose();festival.dispose();
});

// Small DOM adapter exercises UI event wiring without a browser or GPU.
class Element {
 constructor(tag){this.tag=tag;this.children=[];this.events={};this.classList={toggle(){},remove(){}};}
 append(...children){this.children.push(...children);}
 setAttribute(k,v){this[k]=v;}
 addEventListener(k,v){this.events[k]=v;}
 get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
 fire(type){this.events[type]?.();}
}
test('UI keeps slider/number in sync, saves all fields and reports storage failures',()=>{
 const old=globalThis.document;globalThis.document={createElement:t=>new Element(t)};
 try{
  const store=memory(),host=new Element('div');let live,night=false;
  const ui=mountMapLightControls(host,{storage:store,onChange:p=>live=p,isNight:()=>night});
  const all=[];function walk(e){all.push(e);e.children.forEach(walk);}walk(host);const byId=id=>all.find(e=>e.id===id);
  assert.deepEqual(live,D);assert.equal(all.filter(e=>e.type==='range').length,MAP_LIGHT_FIELDS.length);assert.equal(all.filter(e=>e.type==='number').length,MAP_LIGHT_FIELDS.length);
  const number=byId('map-light-bloomStrength-value'),range=byId('map-light-bloomStrength');number.value='0.72';number.fire('input');assert.equal(live.bloomStrength,.72);assert.equal(range.value,'0.72');
  number.value='';number.fire('input');assert.equal(live.bloomStrength,.72);number.fire('change');assert.equal(number.value,'0.72');
  number.value='99';number.fire('change');assert.equal(live.bloomStrength,2);
  for(const field of MAP_LIGHT_FIELDS){const slider=byId('map-light-'+field.key);slider.value=String(field.min);slider.fire('input');assert.equal(live[field.key],field.min);}
  assert.deepEqual(readMapLights(store),ui.settings);assert.equal(store.data.get('qinhuai.building-light-studies.v1'),'user study must stay untouched');
  night=true;ui.updateMode();assert.match(byId('mapLightMode').textContent,/夜景实时/);
  byId('mapLightReset').fire('click');assert.deepEqual(live,D);assert.deepEqual(readMapLights(store),D);
  saveMapLights(store,{...D,washDistance:1.5});ui.reload();assert.equal(live.washDistance,1.5);
  store.setItem=()=>{throw Error('quota');};range.value='0.5';range.fire('input');assert.match(byId('mapLightStatus').textContent,/未允许保存/);assert.equal(live.bloomStrength,.5);
 }finally{globalThis.document=old;}
});
