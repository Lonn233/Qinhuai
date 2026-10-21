import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import layout from '../assets/qinhuai-modern-import/night/layout.json' with {type:'json'};
import {ENVIRONMENT_FIELDS,ENVIRONMENT_STORAGE_KEY,normalizeEnvironment,readEnvironment,saveEnvironment,environmentFalloff,mountEnvironmentControls} from '../import-environment-controls.mjs';
import {collectEnvironmentBuildings} from '../import-environment-sources.mjs';
import {ENVIRONMENT_ATLAS_SIZE,ImportEnvironmentSpill,environmentSourceLight,installEnvironmentReceiver} from '../import-environment-spill.js';
import {collectWindowEmitters,environmentEmitterWeight} from '../import-environment-emitters.js';
import {MATOU_GROUPS} from '../import-matou-study.js';
import {TEMPLE_STUDY_NODES,PAVILION_STUDY_NODES} from '../import-temple-study.js';
const options={matouGroups:MATOU_GROUPS,templeNodes:TEMPLE_STUDY_NODES,pavilionNodes:PAVILION_STUDY_NODES};
const memory=()=>{const data=new Map([['qinhuai.map-light-controls.v1','map-sentinel'],['qinhuai.building-light-studies.v1','study-sentinel']]);return {data,getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};};
const sourceState={temple:{color:'#ffaa00',roofColor:'#ff9900',windowColor:'#ffaa00',eave:1,roof:1,window:.5,brightness:2}};

test('distance is independent, defaults migrate and limits preserve zero',()=>{
 assert.deepEqual(normalizeEnvironment({},true),{enabled:true,inheritColor:true,color:'#ffecd4',intensity:.2,distance:4,angle:90,decayDistance:4,feather:.7});
 assert.equal(normalizeEnvironment({intensity:.65,decayDistance:9}).distance,4);
 assert.equal(normalizeEnvironment({distance:0}).distance,0);
 assert.equal(normalizeEnvironment({distance:99}).distance,30);
 assert.equal(normalizeEnvironment({distance:6.34,decayDistance:1.2}).distance,6.3);
 assert.equal(normalizeEnvironment({distance:NaN}).distance,4);
});
test('environment angle defaults migrate without writes and clamp to the supported range',()=>{
 assert.equal(normalizeEnvironment({distance:7}).angle,90);
 assert.equal(normalizeEnvironment({angle:NaN}).angle,90);
 assert.equal(normalizeEnvironment({angle:0}).angle,10);
 assert.equal(normalizeEnvironment({angle:200}).angle,160);
 assert.equal(normalizeEnvironment({angle:42.7}).angle,43);
 const store=memory(),legacy={version:1,future:'keep',buildings:{a:{distance:7,custom:'keep'},b:{angle:25}}};
 store.setItem(ENVIRONMENT_STORAGE_KEY,JSON.stringify(legacy));const before=store.getItem(ENVIRONMENT_STORAGE_KEY);
 const rig=new ImportEnvironmentSpill();rig.buildings=[{id:'a',defaultEnabled:true},{id:'b',defaultEnabled:true}];
 try{rig.loadSettings(readEnvironment(store));assert.equal(rig.getSettings('a').angle,90);assert.equal(rig.getSettings('b').angle,25);assert.equal(store.getItem(ENVIRONMENT_STORAGE_KEY),before);}finally{rig.dispose();}
});
test('all eight fields persist per building without touching map/study storage',()=>{
 const store=memory(),a=normalizeEnvironment({enabled:true,distance:12.3,angle:120,decayDistance:2.7,feather:.32,intensity:.65,inheritColor:false});
 const b=normalizeEnvironment({enabled:false,distance:1.5,angle:25,decayDistance:8.1});
 assert.equal(saveEnvironment(store,{a,b}),true);assert.deepEqual(readEnvironment(store),{a,b});
 assert.equal(store.data.get('qinhuai.map-light-controls.v1'),'map-sentinel');assert.equal(store.data.get('qinhuai.building-light-studies.v1'),'study-sentinel');
 assert.equal(saveEnvironment({setItem(){throw Error('quota');}},{a}),false);assert.deepEqual(readEnvironment({getItem(){throw Error('blocked');}}),{});
});
test('maximum reach differs from fading length, and zero stops spill',()=>{
 const p=normalizeEnvironment({enabled:true,distance:12,decayDistance:4,feather:.7});
 assert.ok(environmentFalloff(7,p)>0);assert.equal(environmentFalloff(12,p),0);
 assert.equal(environmentFalloff(7,{...p,distance:4}),0);
 assert.ok(environmentFalloff(2,{...p,decayDistance:1})<environmentFalloff(2,p));
 for(const change of [{enabled:false},{intensity:0},{distance:0},{decayDistance:0}])assert.equal(environmentFalloff(1,{...p,...change}),0);
});
test('source catalog uses stable unique IDs with temple default enabled and boats excluded',()=>{
 const a=collectEnvironmentBuildings(layout,options),b=collectEnvironmentBuildings({...layout,tiles:Object.fromEntries(Object.entries(layout.tiles).reverse())},options);
 assert.equal(new Set(a.map(s=>s.id)).size,a.length);
 assert.deepEqual(a.map(s=>s.id).sort(),b.map(s=>s.id).sort());
 assert.ok(a.filter(s=>s.id.startsWith('temple-')).every(s=>s.defaultEnabled));
 assert.equal(a.find(s=>s.id==='pavilion').defaultEnabled,false);
 assert.equal(a.filter(s=>s.id.startsWith('matou-')).length,9);
 const boats=new Set(Object.values(layout.tiles).flatMap(t=>t.materials.filter(r=>r.role.startsWith('boat')).map(r=>r.node)));
 assert.ok(a.every(s=>!s.nodes.some(n=>boats.has(n))));
});
test('source color and brightness follow original settings without mutating them',()=>{
 const before=JSON.stringify(sourceState),a=environmentSourceLight({style:'temple'},sourceState);
 assert.ok(a.color.isColor&&a.energy>0&&a.color.r>a.color.b);
 const b=environmentSourceLight({style:'temple'},{temple:{...sourceState.temple,brightness:4}});assert.equal(b.energy,a.energy*2);
 assert.equal(environmentSourceLight({style:'temple'},{temple:{...sourceState.temple,lightEnabled:false}}).energy,0);
 assert.equal(JSON.stringify(sourceState),before);
});
function makeRig(){
 const r=new ImportEnvironmentSpill();r.buildings=[{id:'test',rect:[-5,-5,5,5],nodes:['window'],style:'temple',tiles:[9],defaultEnabled:true}];r.configured=true;r.uniforms.envAtlasBounds.value.set(-20,-20,40,40);r.loaded.add(9);r.setSources(sourceState);r.setState({night:true});return r;
}
function pixel(r,x,z){const size=ENVIRONMENT_ATLAS_SIZE,b=r.uniforms.envAtlasBounds.value,ix=Math.floor((x-b.x)/b.z*size),iz=Math.floor((z-b.y)/b.w*size);return Array.from(r.data.slice((iz*size+ix)*4,(iz*size+ix)*4+3));}
const countLit=r=>r.data.filter((v,i)=>i%4!==3&&v>0).length;
test('distance rebakes wider atlas only on changes and lights pavement under eaves',()=>{
 const r=makeRig();
 try{
 r.setSettings('test',{enabled:true,intensity:1,distance:2,decayDistance:10});r.update();const short=countLit(r);assert.ok(short>0);
 const updates=r.stats.atlasUpdates;r.update();assert.equal(r.stats.atlasUpdates,updates);
 assert.ok(pixel(r,0,4.7).some(v=>v>0),'pavement inside roof edge receives window light');
 assert.deepEqual(pixel(r,0,0),[0,0,0],'building center is not illuminated');assert.deepEqual(pixel(r,0,8),[0,0,0]);
 r.setSettings('test',{enabled:true,intensity:1,distance:12,decayDistance:10});r.update();assert.ok(countLit(r)>short*3);assert.ok(pixel(r,0,8).some(v=>v>0));
 for(const change of [{enabled:false},{intensity:0},{distance:0},{decayDistance:0}]){r.setSettings('test',{enabled:true,intensity:1,distance:4,decayDistance:4,...change});r.update();assert.equal(countLit(r),0);}
 }finally{r.dispose();}
});
test('receiver keeps metallic pavement and original hooks but adds diffuse after baked AO',()=>{
 const map=new THREE.Texture(),original=new THREE.MeshStandardMaterial({map,metalness:1});let calls=0;original.onBeforeCompile=s=>{calls++;s.fragmentShader+='\n// original-hook';};original.customProgramCacheKey=()=>'original';
 const m=installEnvironmentReceiver(original,{}),shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <aomap_fragment>'};m.onBeforeCompile(shader,{});
 try{
 assert.equal(calls,1);assert.equal(m.map,map);assert.equal(m.metalness,1);assert.equal(original.metalness,1);assert.equal(original.userData.environmentReceiver,undefined);assert.match(shader.fragmentShader,/original-hook/);
 const diffuse='reflectedLight.directDiffuse+=envAlbedo*envLight*envHeight*envFacing*RECIPROCAL_PI;';assert.ok(shader.fragmentShader.includes(diffuse));assert.ok(shader.fragmentShader.indexOf(diffuse)>shader.fragmentShader.indexOf('#include <aomap_fragment>'));assert.doesNotMatch(shader.fragmentShader,/1\.\s*-\s*metalnessFactor/);assert.match(m.customProgramCacheKey(),/^original\|/);
 }finally{m.dispose();original.dispose();map.dispose();}
});
test('window strips merge triangles, reject horizontal surfaces and retain high windows',()=>{
 const root=new THREE.Group(),mat=new THREE.MeshStandardMaterial();const window=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);window.name='window';window.position.set(0,13,4.4);root.add(window);
 const horizontal=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);horizontal.name='floor';horizontal.rotation.x=-Math.PI/2;horizontal.position.set(0,12,0);root.add(horizontal);
 const high=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);high.name='high';high.position.set(0,20,4.4);root.add(high);
 const sources=[{id:'test',rect:[-5,-5,5,5],nodes:['window','floor','high']}],tile={materials:['window','floor','high'].map(node=>({node,role:'window'}))};
 try{const result=collectWindowEmitters(root,tile,sources);assert.equal(result.size,1);const strips=result.get('test');assert.equal(strips.length,2);assert.ok(strips.some(e=>e.floor==='first'));assert.ok(strips.some(e=>e.floor==='second'&&e.y>18));assert.equal(strips[0].halfWidth,1);assert.ok(Math.abs(strips[0].nz-1)<1e-6);assert.ok(Math.abs(strips[0].z-4.4)<1e-6);}finally{root.traverse(m=>m.geometry?.dispose());mat.dispose();}
});
test('window irradiance spreads outward, fades, feathers and obeys hard reach',()=>{
 const e={x:0,z:0,nx:0,nz:1,halfWidth:1},p={distance:8,decayDistance:4,feather:.7},w=(x,z,extra={})=>environmentEmitterWeight(x,z,e,{...p,...extra});
 assert.equal(w(0,-1),0);assert.ok(w(0,-.1)>0);assert.ok(w(0,.1)>w(0,2));assert.ok(w(0,2)>w(0,6));assert.equal(w(0,8),0);assert.equal(w(0,9),0);
 assert.ok(w(0,6,{feather:.9})<w(0,6,{feather:.1}));assert.ok(w(1.3,2)>0);assert.ok(w(1.3,2)<w(0,2));assert.equal(w(20,2),0);
 assert.equal(w(0,1,{distance:0}),0);assert.equal(w(0,1,{decayDistance:0}),0);
});
test('general angle changes widen ground spill while 90 degrees preserves its legacy footprint',()=>{
 const e={x:0,z:0,nx:0,nz:1,halfWidth:1},p={distance:8,decayDistance:4,feather:.7};
 for(const [x,z] of [[0,2],[2,2],[3,4],[5,6]])assert.ok(Math.abs(environmentEmitterWeight(x,z,e,p)-environmentEmitterWeight(x,z,e,{...p,angle:90},.32))<1e-12);
 const narrow=environmentEmitterWeight(2,3,e,{...p,angle:20},.32),wide=environmentEmitterWeight(2,3,e,{...p,angle:140},.32);
 assert.ok(wide>narrow);
 assert.equal(environmentEmitterWeight(0,3,e,{...p,angle:20},.32),environmentEmitterWeight(0,3,e,{...p,angle:140},.32));
 const rig=makeRig();
 try{rig.emitters.set('test',[{...e,z:4.4}]);rig.setSettings('test',{enabled:true,intensity:1,distance:8,decayDistance:6,angle:20});rig.update();const lit=countLit(rig),updates=rig.stats.atlasUpdates;rig.setSettings('test',{...rig.getSettings('test'),angle:140});rig.update();assert.ok(countLit(rig)>lit);assert.equal(rig.stats.atlasUpdates,updates+1);}finally{rig.dispose();}
});
test('overlapping window triangles cannot multiply building spill brightness',()=>{
 const r=makeRig(),e={x:0,z:4.4,nx:0,nz:1,halfWidth:2};
 try{r.emitters.set('test',[e]);r.setSettings('test',{enabled:true,intensity:1,distance:4});r.update();const single=r.data.slice();r.emitters.set('test',[e,{...e},{...e}]);r.dirty=true;r.update();assert.deepEqual(r.data,single);}finally{r.dispose();}
});
test('ground and buildings receive spill; water remains independent; day/hide/wireframe/dispose work',()=>{
 const r=new ImportEnvironmentSpill(),root=new THREE.Group(),mat=new THREE.MeshStandardMaterial({map:new THREE.Texture()});
 const mesh=(name,y,h=.1)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(4,h,4),mat);m.position.y=y;m.name=name;root.add(m);return m;};
 const ground=mesh('ground',11.9),water=mesh('FuziTemple0038',11.9),building=mesh('building',14,5),lit=mesh('lit',11.9);
 r.setState({night:true});r.attachTile(9,root,{},new Set(['lit']));assert.equal(r.stats.receivers,2);assert.notEqual(ground.material,mat);assert.equal(water.material,mat);assert.notEqual(building.material,mat);assert.equal(lit.material,mat);
 assert.equal(ground.material.map,mat.map);r.setState({night:false});assert.equal(ground.material,mat);
 r.setState({night:true,wireframe:true});assert.equal(r.uniforms.envActive.value,0);
 r.setState({night:true,modelVisible:false});assert.equal(r.uniforms.envActive.value,0);
 r.setState({night:true});assert.equal(r.uniforms.envActive.value,1);r.dispose();assert.equal(ground.material,mat);assert.equal(building.material,mat);
});
class Element {constructor(tag){this.tag=tag;this.children=[];this.events={};this.classList={toggle(){}};}append(...a){this.children.push(...a);}replaceChildren(...a){this.children=a;}setAttribute(k,v){this[k]=v;}addEventListener(k,v){this.events[k]=v;}get valueAsNumber(){return this.value===''?NaN:Number(this.value);}fire(t){this.events[t]?.();}}
test('UI switches and reloads per-building angle while preserving legacy and unrelated saved data',()=>{
 const old=globalThis.document;globalThis.document={createElement:t=>new Element(t),createTextNode:t=>Object.assign(new Element('text'),{textContent:t})};
 const r=new ImportEnvironmentSpill();r.buildings=[{id:'a',label:'A',defaultEnabled:true},{id:'b',label:'B',defaultEnabled:false}];
 try{const store=memory();store.setItem(ENVIRONMENT_STORAGE_KEY,JSON.stringify({version:1,future:'keep',buildings:{a:{custom:'preserve'},other:{angle:55,custom:'unloaded'}}}));const before=store.getItem(ENVIRONMENT_STORAGE_KEY),host=new Element('div'),ui=mountEnvironmentControls(host,{rig:r,storage:store,isNight:()=>true});assert.equal(store.getItem(ENVIRONMENT_STORAGE_KEY),before);const all=[];const walk=e=>{all.push(e);e.children.forEach(walk);};walk(host);const el=id=>all.find(e=>e.id===id),select=el('environment-building');
 const n=el('environment-distance-value');n.value='12.3';n.fire('input');assert.equal(r.getSettings('a').distance,12.3);assert.equal(el('environment-distance').value,'12.3');
 for(const f of ENVIRONMENT_FIELDS.filter(f=>f.key!=='distance')){const e=el('environment-'+f.key);e.value=String(f.max);e.fire('input');}
 el('environment-inheritColor').checked=false;el('environment-inheritColor').fire('change');const a=r.getSettings('a');
 select.value='b';select.fire('change');assert.equal(n.value,'4');assert.equal(el('environment-angle').value,'90');el('environment-angle-value').value='35';el('environment-angle-value').fire('input');assert.equal(el('environment-angle').value,'35');n.value='7';n.fire('input');select.value='a';select.fire('change');assert.deepEqual(r.getSettings('a'),a);assert.equal(n.value,'12.3');
 ui.reload();assert.deepEqual(r.getSettings('a'),a);assert.equal(r.getSettings('b').distance,7);assert.equal(r.getSettings('a').angle,160);assert.equal(r.getSettings('b').angle,35);assert.equal(readEnvironment(store).a.custom,'preserve');assert.deepEqual(readEnvironment(store).other,{angle:55,custom:'unloaded'});assert.equal(JSON.parse(store.getItem(ENVIRONMENT_STORAGE_KEY)).future,'keep');
 store.setItem=()=>{throw Error('quota');};n.value='8';n.fire('input');assert.match(el('environment-status').textContent,/未允许保存/);
 }finally{globalThis.document=old;r.dispose();}
});
