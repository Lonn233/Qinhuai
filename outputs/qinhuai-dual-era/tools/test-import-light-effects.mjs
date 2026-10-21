import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import layout from '../assets/qinhuai-modern-import/night/layout.json' with {type:'json'};
import water from '../assets/qinhuai-modern-import/festival/layout.json' with {type:'json'};
import {DEFAULT_MAP_LIGHTS as D,MAP_LIGHT_FIELDS,MAP_LIGHT_STORAGE_KEY,readMapLights,saveMapLights} from '../import-light-controls.mjs';
import {ImportStreetlamps} from '../import-streetlamps.js';
import {ImportFestivalLanterns,pointInWater} from '../import-festival-lanterns.js';
import {ImportWaterReflections,createRiverMask,REFLECTION_WATER_BOUNDS,collectReflectionSources,waterDistance} from '../import-water-reflections.js';
import {ImportNightLighting,NIGHT_STYLE} from '../import-night-lighting.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const fixture=async()=>{const scene=new THREE.Group();scene.add(new THREE.Mesh(new THREE.BoxGeometry(2,1,2),new THREE.MeshStandardMaterial()));return {scene};};
const selections={matou:{brightness:2.5,window:2,windowColor:'#ffaa00',trimColor:'#ffffff',color:'#ffdd77'},pavilion:{brightness:2,roof:1,color:'#ffcc33'},styles:NIGHT_STYLE};

test('old 16-field saves migrate without dropping user settings; all 58 fields persist',()=>{
 const old=Object.fromEntries(MAP_LIGHT_FIELDS.slice(0,16).map(f=>[f.key,f.min]));let raw=JSON.stringify({version:1,settings:old});
 const storage={getItem:()=>raw,setItem:(key,value)=>{assert.equal(key,MAP_LIGHT_STORAGE_KEY);raw=value;}};
 const restored=readMapLights(storage);for(const [k,v] of Object.entries(old))assert.equal(restored[k],v);
 for(const f of MAP_LIGHT_FIELDS.slice(16))assert.equal(restored[f.key],f.value);
 const all=Object.fromEntries(MAP_LIGHT_FIELDS.map(f=>[f.key,f.max]));assert.ok(saveMapLights(storage,all));assert.deepEqual(readMapLights(storage),all);
});

test('three ground categories stay independent before/after loading and never resize lamp bodies',async()=>{
 const parent=new THREE.Group(),street=new ImportStreetlamps(parent,{load:fixture}),festival=new ImportFestivalLanterns(parent,{load:fixture});
 const p={...D,groundRadius:1.5,groundIntensity:2,streetGroundRadius:2,streetGroundIntensity:0,streetGroundStretch:1.4,streetGroundFalloff:2,lionGroundRadius:.5,lionGroundIntensity:1.2,lionGroundStretch:2,lionGroundFalloff:.5,mountainGroundRadius:3,mountainGroundIntensity:.4,mountainGroundStretch:1.5,mountainGroundFalloff:1.5};
 street.setMapLightSettings(p);festival.setMapLightSettings(p);await street.registerTile(9);await festival.registerTile(9);
 const matrices=[];parent.traverse(m=>{if(m.isInstancedMesh)matrices.push([m,Array.from(m.instanceMatrix.array)]);});
 for(let i=0;i<4;i++){street.setMapLightSettings(p);festival.setMapLightSettings(p);}
 for(const [kind,u] of [['street',street.groundLight],...Object.entries(festival.groundLights)]){
  near(u.mapGroundRadius.value,p[kind+'GroundRadius']*1.5);near(u.mapGroundIntensity.value,p[kind+'GroundIntensity']*2);
  near(u.mapGroundStretch.value,p[kind+'GroundStretch']);near(u.mapGroundFalloff.value,p[kind+'GroundFalloff']);
 }
 for(const [m,array] of matrices)assert.deepEqual(Array.from(m.instanceMatrix.array),array);
 street.dispose();festival.dispose();
});

test('lotus and chrysanthemum reflection uniforms are independent and preserve default appearance',async()=>{
 const f=new ImportFestivalLanterns(new THREE.Group(),{load:fixture,loadMask:async()=>new THREE.Texture()});
 f.setMapLightSettings({...D,lotusWaterIntensity:0,lotusWaterLength:2,lotusWaterWidth:.5,lotusWaterRipple:0,lotusWaterSpeed:0,lotusWaterFade:2,chrysanthemumWaterIntensity:2,chrysanthemumWaterLength:1.5});
 await f.registerTile(6);f.setState({night:true});f.update(17);
 for(const [kind,e] of f.entries){
  const expected=kind==='chrysanthemum'?2:0;
  for(const m of e.reflectionMaterials){assert.equal(m.uniforms.mapWaterIntensity.value,expected);assert.equal(m.uniforms.time.value,17);assert.match(m.fragmentShader,/waterMask/);assert.match(m.vertexShader,/mapWaterWidth/);}
 }
 f.setState({waterVisible:false});assert.equal(f.waterRoot.visible,false);
 f.setState({waterVisible:true,wireframe:true});assert.ok([...f.entries.values()].flatMap(e=>e.batches).filter(b=>b.mesh.userData.festivalReflection).every(b=>!b.mesh.visible));
 f.setMapLightSettings(D);for(const u of Object.values(f.waterLights))for(const v of Object.values(u))assert.equal(v.value,1);f.dispose();
});

test('river mask exactly follows source triangles; distant/back-row sources are excluded',()=>{
 const mask=createRiverMask(),{width,height,data}=mask.image,[x0,z0,w,h]=REFLECTION_WATER_BOUNDS;
 let waterPixels=0;
 for(let y=0;y<height;y+=3)for(let x=0;x<width;x+=3){const inside=pointInWater(x0+(x+.5)/width*w,z0+(y+.5)/height*h);assert.equal(data[y*width+x]===255,inside);waterPixels+=inside?1:0;}
 assert.ok(waterPixels>100);assert.ok(waterDistance(400,400)>100);assert.equal(waterDistance(water.placements?.[0]?.x||0,0),0);
 mask.dispose();
});

test('real night layout yields source-linked building, 14-boat and near-water street reflection batches',()=>{
 const parent=new THREE.Group(),rig=new ImportWaterReflections(parent);let boatSources=0;
 for(const [name,tile] of Object.entries(layout.tiles)){
  const id=Number(name.slice(-2)),byName=new Map(tile.fixtures.map(f=>[f.node,{}]));
  const result=collectReflectionSources(tile,id,byName);
  for(const kind of Object.keys(result))for(const s of result[kind])assert.ok(waterDistance(s.position[0],s.position[2])<=4);
  if(tile.boats.length){assert.ok(result.boat.length>=tile.boats.length);boatSources+=result.boat.length;}
  rig.attachTile(id,tile,byName);
 }
 assert.ok(rig.stats.building>0);assert.equal(rig.stats.boat,boatSources);assert.ok(rig.stats.street>0);
 const streetBatches=rig.batches.filter(b=>b.kind==='street');assert.ok(streetBatches.every(b=>!b.mesh.visible));
 for(const b of streetBatches)rig.setStreetTileReady(b.tile);assert.ok(streetBatches.every(b=>b.mesh.visible));
 assert.equal(rig.root.visible,false);rig.registerWaterTile(6);assert.equal(rig.root.visible,true);
 rig.apply({...D,buildingWaterIntensity:0,boatWaterIntensity:2,streetWaterIntensity:.5,boatWaterWidth:2,boatWaterLength:3,boatWaterRipple:0,boatWaterSpeed:0,boatWaterFade:2},selections);
 assert.equal(rig.controls.building.mapWaterIntensity.value,0);assert.equal(rig.controls.boat.mapWaterIntensity.value,2);assert.equal(rig.controls.street.mapWaterIntensity.value,.5);
 for(const {mesh,sources} of rig.batches){assert.equal(mesh.geometry.instanceCount,sources.length);assert.equal(mesh.frustumCulled,false);assert.ok(mesh.geometry.getAttribute('sourcePower').array.every(v=>v>0));}
 rig.update(9);assert.equal(rig.time.value,9);rig.setWaterVisible(false);assert.equal(rig.root.visible,false);rig.setWaterVisible(true);assert.equal(rig.root.visible,true);
 rig.dispose();assert.equal(parent.children.length,0);
});

test('Matou reflections follow trim/window colors and light-off without mutating saved studies',()=>{
 const rig=new ImportWaterReflections(new THREE.Group()),node='FuziTemple0707';
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([-18,12,-5,-17,12,-5,-18,13,-5],3));
 const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial()),byName=new Map([[node,mesh]]);
 rig.attachTile(9,{fixtures:[],materials:[{node,role:'window'}]},byName);const json=JSON.stringify(selections);
 rig.apply(D,selections);assert.equal(JSON.stringify(selections),json);assert.ok(rig.stats.building>0);
 const batch=rig.batches[0];near(batch.mesh.geometry.getAttribute('sourceColor').getX(0),1);
 const positions=Array.from(batch.mesh.geometry.getAttribute('sourcePosition').array);
 rig.apply(D,{...selections,matou:{...selections.matou,lightEnabled:false}});
 assert.ok(batch.mesh.geometry.getAttribute('sourcePower').array.every(v=>v===0));assert.deepEqual(Array.from(batch.mesh.geometry.getAttribute('sourcePosition').array),positions);
 rig.dispose();geometry.dispose();mesh.material.dispose();
});

test('day/wireframe/model/water visibility and late tiles respect the night rig',()=>{
 const rig=new ImportNightLighting(new THREE.Scene());rig.registerTile(6,new THREE.Group());
 assert.equal(rig.root.visible,false);rig.setEnabled(true);assert.equal(rig.root.visible,true);
 rig.setWaterVisible(false);assert.equal(rig.waterReflections.root.visible,false);rig.setWaterVisible(true);assert.equal(rig.waterReflections.root.visible,true);
 rig.setVisibility({wireframe:true});assert.equal(rig.root.visible,false);rig.setVisibility({wireframe:false,modelVisible:false});assert.equal(rig.root.visible,false);
 rig.setVisibility({modelVisible:true});rig.setEnabled(false);assert.equal(rig.root.visible,false);rig.dispose();
});
