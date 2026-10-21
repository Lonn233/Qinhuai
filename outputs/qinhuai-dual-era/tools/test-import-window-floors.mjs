import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {normalizeWindowFloors,windowFloorAt,windowFloorSplit,hasWindowFloors} from '../import-window-floors.mjs';
import {normalizeBuilding,writeBuildingLight,readBuildingLights,BUILDING_LIGHT_KEY} from '../import-building-controls.mjs';
import {BuildingLightAdjustments} from '../import-building-lighting.js';
import {ImportEnvironmentSpill,floorWindowChannels} from '../import-environment-spill.js';
import {collectWindowEmitters,environmentEmitterWeight} from '../import-environment-emitters.js';
const id='building-FuziTemple0780',other='building-FuziTemple0751';
test('floor fields retain unknowns, zeros, other buildings and old presets; old reads do not migrate',()=>{
 const raw={future:1,first:{future:2,brightness:0,spill:{future:3,enabled:false,intensity:0,distance:0,color:'#55aaff'}},second:{color:'#ffaaff'}};
 const before=JSON.stringify(raw),r=normalizeWindowFloors(raw);assert.equal(JSON.stringify(raw),before);assert.equal(r.first.brightness,0);assert.equal(r.first.spill.future,3);assert.equal(r.first.spill.intensity,0);assert.equal(r.first.spill.enabled,false);assert.equal(r.second.color,'#ffaaff');assert.equal(normalizeBuilding({brightness:.9}).windowFloors,undefined);
 assert.equal(normalizeWindowFloors(null,{enabled:false,distance:7}).first.spill.enabled,false);assert.equal(normalizeWindowFloors(null,{distance:7}).second.spill.distance,7);
 const values=new Map([[BUILDING_LIGHT_KEY,JSON.stringify({version:1,future:8,buildings:{[other]:{brightness:.7}},presets:[{id:'old',building:id,settings:{parts:{window:{color:'#abcdef'}}}}]})]]),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 writeBuildingLight(storage,id,{windowFloors:raw},{id:'new',name:'分层窗光'});const saved=readBuildingLights(storage);assert.equal(saved.future,8);assert.equal(saved.buildings[other].brightness,.7);assert.equal(saved.presets.length,2);assert.equal(saved.presets[0].settings.windowFloors,undefined);assert.equal(saved.presets[1].settings.windowFloors.first.spill.future,3);
});
test('one mesh has independent floor uniforms composed with legacy master and window controls',()=>{
 const building={id,rect:[0,0,1,1],nodes:['FuziTemple0776']},environment={buildings:[building]},rig=new BuildingLightAdjustments(environment),m=new THREE.MeshStandardMaterial();
 rig.patch(m,[building],'window',{node:'FuziTemple0776'});rig.apply();assert.deepEqual(rig.getUniform(id,'window-first').value.toArray(),[1,1,1,0]);
 rig.setSettings(id,{brightness:2,parts:{window:{brightness:.5}},windowFloors:{first:{color:'#ff0000',inheritColor:false,brightness:2},second:{color:'#0000ff',inheritColor:false}}});
 assert.deepEqual(rig.getUniform(id,'window-first').value.toArray(),[2,0,0,1]);assert.deepEqual(rig.getUniform(id,'window-second').value.toArray(),[0,0,1,1]);
 const shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <lights_fragment_begin>'};m.onBeforeCompile(shader);assert.match(shader.fragmentShader,/vQhBuildingWorld.y<13.30000/);assert.equal(shader.uniforms.qhBuilding0Second,rig.getUniform(id,'window-second'));
 rig.setSettings(id,{windowFloors:{first:{enabled:false}}});assert.equal(rig.getUniform(id,'window-first').value.x,0);assert.equal(rig.getUniform(id,'window-second').value.x,1);
 assert.equal(windowFloorAt('FuziTemple0753',13.2),'second');assert.equal(windowFloorAt('FuziTemple0776',13.2),'first');assert.equal(hasWindowFloors('gate'),true);assert.equal(hasWindowFloors(''),false);rig.dispose();m.dispose();
});
test('floor spill colors, switches, range and cone operate separately from source window color',()=>{
 const b={id},emitters=[{node:'shared',floor:'first',x:0,z:0,y:12.5,nx:1,nz:0,halfWidth:.5},{node:'shared',floor:'second',x:0,z:2,y:14,nx:1,nz:0,halfWidth:.5}];
 const settings={windowFloors:{first:{color:'#ff0000',inheritColor:false,spill:{enabled:true,inheritColor:false,color:'#00ff00',intensity:1}},second:{color:'#0000ff',inheritColor:false,spill:{enabled:true,inheritColor:true,intensity:1}}}};
 let channels=floorWindowChannels(b,settings,{},emitters);assert.equal(channels.length,2);assert.deepEqual(channels[0].color.toArray(),[0,1,0]);assert.deepEqual(channels[1].color.toArray(),[0,0,1]);assert.equal(channels[0].emitters.length,1);
 const e=emitters[0],p=channels[0].p;assert.equal(environmentEmitterWeight(5,0,e,{...p,distance:2}),0);assert.ok(environmentEmitterWeight(2,2,e,{...p,angle:100})>environmentEmitterWeight(2,2,e,{...p,angle:15}));
 settings.windowFloors.first.spill.enabled=false;channels=floorWindowChannels(b,settings,{},emitters);assert.equal(channels.length,1);assert.equal(channels[0].floor,'second');settings.enabled=false;assert.equal(floorWindowChannels(b,settings,{},emitters).length,0);
});
test('actual tile-10 window meshes produce both floor emitters without slicing a window row',async()=>{
 const buf=fs.readFileSync('assets/qinhuai-modern-import/tiles/tile-10.glb'),jl=buf.readUInt32LE(12),doc=JSON.parse(buf.subarray(20,20+jl));
 for(const m of doc.materials||[]){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}delete doc.images;delete doc.textures;
 const j=Buffer.from(JSON.stringify(doc).padEnd(Math.ceil(JSON.stringify(doc).length/4)*4,' ')),bin=buf.subarray(20+jl),out=Buffer.alloc(20+j.length+bin.length);buf.copy(out,0,0,12);out.writeUInt32LE(out.length,8);out.writeUInt32LE(j.length,12);out.writeUInt32LE(0x4e4f534a,16);j.copy(out,20);bin.copy(out,20+j.length);
 const root=(await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'')).scene;
 const layout=JSON.parse(fs.readFileSync('assets/qinhuai-modern-import/night/layout.json')),rig=new ImportEnvironmentSpill();rig.configure(layout);const bs=rig.buildings.filter(b=>[id,other].includes(b.id)),es=collectWindowEmitters(root,layout.tiles['tile-10'],bs);
 for(const b of bs){const list=es.get(b.id)||[];assert.ok(list.some(e=>e.floor==='first'),b.id+' ground floor emitters');assert.ok(list.some(e=>e.floor==='second'),b.id+' upper floor emitters');console.log(b.id,'strips',list.filter(e=>e.floor==='first').length,list.filter(e=>e.floor==='second').length);}
 root.updateWorldMatrix(true,true);root.traverse(mesh=>{if(!bs.some(b=>b.nodes.includes(mesh.name))||!layout.tiles['tile-10'].materials.some(r=>r.node===mesh.name&&r.role==='window'))return;const g=mesh.geometry,index=g.index,pos=g.attributes.position;for(let k=0;k<(index?.count||pos.count);k+=3){const ys=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pos,index?index.getX(k+j):k+j).applyMatrix4(mesh.matrixWorld).y),split=windowFloorSplit(mesh.name);assert.ok(Math.max(...ys)<=split||Math.min(...ys)>=split,mesh.name+' row crosses storeys');}});
 rig.dispose();root.traverse(o=>{o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m?.dispose();});
});

test('general environment cone leaves legacy and explicitly saved floor angles independent',()=>{
 const legacy=normalizeWindowFloors(null,{angle:120,distance:7});
 assert.equal(legacy.first.spill.angle,35);assert.equal(legacy.second.spill.angle,35);assert.equal(legacy.first.spill.distance,7);
 const saved=normalizeWindowFloors({first:{spill:{angle:25}},second:{spill:{angle:75}}},{angle:150});
 assert.equal(saved.first.spill.angle,25);assert.equal(saved.second.spill.angle,75);
});
