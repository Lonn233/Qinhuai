import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {DRAGON_PARTS,normalizeDragon,saveDragon,readDragon,DRAGON_STORAGE_KEY} from '../import-dragon-controls.mjs';
import {DragonWallLighting,DRAGON_NODES} from '../import-dragon-lighting.js';
test('dragon zero values, future fields and named presets survive save without touching other keys',()=>{
 const values=new Map([['qinhuai.building-light-studies.v1','original favorites']]);const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 const s=normalizeDragon({master:0,texture:0,extension:42,parts:{left:{brightness:0,spill:0,distance:0,color:'#0055ff',extra:7},future:{x:4}}});
 assert.equal(s.parts.left.brightness,0);assert.equal(s.parts.left.distance,0);assert.equal(s.extension,42);assert.equal(s.parts.left.extra,7);assert.deepEqual(s.parts.future,{x:4});
 const preset={id:'old',name:'原方案',settings:s};assert.equal(saveDragon(storage,{version:1,settings:s,presets:[preset],futureRoot:9}),true);
 assert.deepEqual(readDragon(storage).presets,[preset]);assert.equal(readDragon(storage).futureRoot,9);assert.equal(values.get('qinhuai.building-light-studies.v1'),'original favorites');assert.equal(JSON.parse(values.get(DRAGON_STORAGE_KEY)).settings.master,0);
});
test('audited dragon nodes only, independent sections, late load, zero spill, day/wireframe and disposal restore originals',()=>{
 const scene=new THREE.Scene(),rig=new DragonWallLighting(scene),tile=new THREE.Group(),originals=new Map();
 for(const name of [...Object.keys(DRAGON_NODES),'unrelated-building']){const material=new THREE.MeshStandardMaterial({color:0xaaaaaa,map:new THREE.Texture()});const mesh=new THREE.Mesh(new THREE.BoxGeometry(),material);mesh.name=name;tile.add(mesh);originals.set(name,material);}
 rig.setState({night:true});rig.registerTile(6,tile);assert.equal(rig.bindings.length,0);rig.registerTile(5,tile);assert.equal(rig.bindings.length,9);rig.registerTile(5,tile);assert.equal(rig.bindings.length,9);
 const s=normalizeDragon();s.parts.left.color='#22bbff';s.parts.left.brightness=4;s.parts.left.spill=0;s.parts.right.distance=0;rig.setSettings(s);
 assert.equal(rig.uniforms.left.energy.value,4);assert.equal(rig.uniforms.right.energy.value,2.1);assert.equal(rig.uniforms.left.color.value.getHexString(),'22bbff');assert.equal(rig.lights.get('left').intensity,0);assert.equal(rig.lights.get('right').intensity,0);
 assert.equal(tile.getObjectByName('unrelated-building').material,originals.get('unrelated-building'));
 for(const b of rig.bindings){assert.equal(b.materials[0].map,originals.get(b.mesh.name).map);const shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <emissivemap_fragment>'};b.materials[0].onBeforeCompile(shader);assert.ok(shader.fragmentShader.includes('qhDragonTexture'));}
 for(const state of [{night:false},{night:true,wireframe:true},{wireframe:false,modelVisible:false}]){rig.setState(state);assert.equal(rig.root.visible,false);for(const b of rig.bindings)assert.equal(b.mesh.material,b.original);}
 rig.setState({night:true,wireframe:false,modelVisible:true});assert.equal(rig.root.visible,true);rig.setSettings({...s,enabled:false});for(const b of rig.bindings)assert.equal(b.mesh.material,b.original);
 rig.dispose();for(const [name,m]of originals)assert.equal(tile.getObjectByName(name).material,m);assert.equal(rig.root.parent,null);assert.equal(DRAGON_PARTS.length,7);
});
