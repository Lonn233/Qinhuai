import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ImportNightLighting} from '../import-night-lighting.js';
import {TOWER0369_NODES,TOWER0369_PRESET} from '../import-tower0369-config.mjs';

const root=new URL('../',import.meta.url);
const layout=JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/night/layout.json',root),'utf8'));
const bytes=fs.readFileSync(new URL('assets/qinhuai-modern-import/tiles/tile-09.glb',root));
const size=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+size));
for(const m of doc.materials){const name=m.name;Object.keys(m).forEach(k=>delete m[k]);m.name=name;}
delete doc.images;delete doc.textures;delete doc.samplers;
const indices=doc.nodes.map((n,i)=>/^FuziTemple0(36[4-9]|37\d|38[0-8])$/.test(n.name)?i:-1).filter(i=>i>=0);
doc.scenes=[{nodes:indices}];doc.scene=0;
const j=Buffer.from(JSON.stringify(doc)),n=Math.ceil(j.length/4)*4;
const data=Buffer.alloc(20+n+bytes.length-20-size,0x20);bytes.copy(data,0,0,12);data.writeUInt32LE(data.length,8);data.writeUInt32LE(n,12);data.writeUInt32LE(0x4e4f534a,16);j.copy(data,20);bytes.copy(data,20+n,20+size);
const {scene}=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');scene.updateMatrixWorld(true);
const before=new Map();scene.traverse(m=>{if(m.isMesh)before.set(m,{geometry:m.geometry,matrix:m.matrixWorld.clone(),material:m.material});});
const rig=new ImportNightLighting(new THREE.Scene());rig.layout=layout;
try{
 rig.registerTile(9,scene);
 assert.equal(rig.tower0369Studies.length,TOWER0369_NODES.size);assert.equal(rig.pavilionStudies.length,0);
 assert.equal(rig.tower0369Fixtures.length,1);
 const eaves=rig.root.getObjectByName('0369·细金檐'),lanterns=rig.root.getObjectByName('0369·红灯笼');
 assert.equal(eaves.count,40);assert.equal(lanterns.count,6);
 assert.ok(!rig.root.getObjectByName('魁星阁·红灯笼'));
 for(const study of rig.tower0369Studies){
  assert.ok(study.lighting.materials.length>0);
  assert.ok(study.lighting.uniforms.tint.value.equals(new THREE.Color(TOWER0369_PRESET.color)));
  for(const material of study.lighting.materials){const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};material.onBeforeCompile(shader);assert.ok(shader.fragmentShader.includes('float bsRegion(vec3 p){return 2.;}'));if(material.userData.buildingLightRole==='roof')assert.ok(shader.fragmentShader.includes('(qhBuildingAdjust(bsRoofLight,false)+qhBuildingAdjust(bsEaveLight,true))'));}
 }
 for(const night of [true,false,true,false]){rig.setEnabled(night);for(const b of rig.bindings)assert.equal(b.mesh.material,night?b.night:b.day);}
 rig.registerTile(9,scene);assert.equal(rig.tower0369Studies.length,16);assert.equal(rig.tower0369Fixtures.length,1);
 rig.setMapLightSettings({eaveWidth:1.5});const color=eaves.material.color.clone(),matrix=new THREE.Matrix4();eaves.getMatrixAt(0,matrix);
 rig.setMapLightSettings({eaveWidth:1.5});const again=new THREE.Matrix4();eaves.getMatrixAt(0,again);assert.ok(matrix.equals(again));assert.ok(eaves.material.color.equals(color));
}finally{rig.dispose();}
for(const [mesh,old] of before){assert.equal(mesh.material,old.material);assert.equal(mesh.geometry,old.geometry);assert.ok(mesh.matrixWorld.equals(old.matrix));}
console.log(JSON.stringify({towerNodes:16,eaveSegments:40,redLanterns:6,registrationIdempotent:true,dayNightAndDisposeRestore:true,geometryUnchanged:true},null,2));
