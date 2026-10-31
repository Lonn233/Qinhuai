import assert from 'node:assert/strict';
import fs from 'node:fs';
import {test} from 'node:test';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FeatureLanternLayer,GONGMING_PLACEMENT as P,TENGMA_PLACEMENTS} from '../import-feature-lanterns.js';
import {ImportRenderVisibility} from '../import-render-visibility.js';
function stripTextures(buffer) {
  const jsonLength = buffer.readUInt32LE(12);
  const document = JSON.parse(buffer.subarray(20, 20 + jsonLength));
  for (const material of document.materials || []) {
    delete material.normalTexture;
    delete material.occlusionTexture;
    delete material.emissiveTexture;
    if (material.pbrMetallicRoughness) {
      delete material.pbrMetallicRoughness.baseColorTexture;
      delete material.pbrMetallicRoughness.metallicRoughnessTexture;
    }
  }
  delete document.textures;
  delete document.images;
  delete document.samplers;
  const json = Buffer.from(JSON.stringify(document));
  const paddedJson = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
  json.copy(paddedJson);
  const binary = buffer.subarray(20 + jsonLength);
  const output = Buffer.alloc(20 + paddedJson.length + binary.length);
  buffer.copy(output, 0, 0, 12);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(paddedJson.length, 12);
  output.writeUInt32LE(0x4e4f534a, 16);
  paddedJson.copy(output, 20);
  binary.copy(output, 20 + paddedJson.length);
  return output;
}


test('gongming arch loads once, stands between the gate and 0490, preserves the passage and follows light/visibility state',async()=>{
 const loader=GLTFLoader.prototype.loadAsync;let loads=0;
 GLTFLoader.prototype.loadAsync=async function(url){assert.ok(url.endsWith('/gongming-high.glb'));loads++;const b=stripTextures(fs.readFileSync(new URL('../assets/gongming-lantern/gongming-high.glb',import.meta.url)));return this.parseAsync(b.buffer,'');};
 const parent=new THREE.Group(),layer=new FeatureLanternLayer(parent,{loadLods:null}),visibility=new ImportRenderVisibility();
 try{
  layer.setState({night:true});await Promise.all([layer.ensure('gongming'),layer.ensure('gongming')]);assert.equal(loads,1);
  const e=layer.entries.get('gongming');assert.equal(e.meshes.length,1);const mesh=e.meshes[0];
  parent.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(mesh);
  assert.ok(Math.abs(box.min.y-P.y)<.00001);assert.ok(box.min.z>-20.85&&box.max.z<-14.7);
  assert.ok(box.min.x>-7&&box.max.x<-3.7,'leaves the side lion rows clear');
  assert.ok(mesh.geometry.index.count/3===180216);assert.ok(e.uniforms.uClothPower.value>0);
  const ray=new THREE.Raycaster(new THREE.Vector3(P.x,P.y+.55,P.z+2),new THREE.Vector3(0,0,-1),0,4);
  assert.equal(ray.intersectObject(mesh).length,0,'central arch remains physically open at eye height');
  assert.equal(visibility.register(e.group),1);visibility.update(new THREE.Vector3(100,12,100),10);assert.equal(visibility.stats.visibleCells,0);
  visibility.update(new THREE.Vector3(P.x,P.y,P.z),10);assert.equal(visibility.stats.visibleCells,1);
  layer.setState({night:false});assert.equal(e.uniforms.uClothPower.value,0);
  layer.setState({night:true,wireframe:true});assert.equal(e.uniforms.uClothPower.value,0);assert.equal(e.materials[0].wireframe,true);
  layer.setState({wireframe:false,waterVisible:false});assert.equal(e.group.visible,true);
  assert.equal(layer.stats.gongming,1);console.log('Gongming world bounds:',box.min.toArray(),box.max.toArray());
 }finally{GLTFLoader.prototype.loadAsync=loader;visibility.dispose();layer.dispose();}
 assert.equal(parent.children.length,0);
});

test('tengma lantern pair stands in front of gongming and faces inward across the central axis',async()=>{
 const loader=GLTFLoader.prototype.loadAsync;let loads=0;
 GLTFLoader.prototype.loadAsync=async function(url){assert.ok(url.endsWith('/tengma-low.glb'));loads++;const b=stripTextures(fs.readFileSync(new URL('../assets/gongming-lantern/tengma-low.glb',import.meta.url)));return this.parseAsync(b.buffer,'');};
 const parent=new THREE.Group(),layer=new FeatureLanternLayer(parent,{loadLods:null});
 try{
  layer.setState({night:true});await Promise.all([layer.ensure('tengma'),layer.ensure('tengma')]);assert.equal(loads,1);
  const e=layer.entries.get('tengma');assert.equal(e.meshes.length,1);const mesh=e.meshes[0];assert.equal(mesh.count,2);
  const left=new THREE.Matrix4(),right=new THREE.Matrix4(),leftPosition=new THREE.Vector3(),rightPosition=new THREE.Vector3(),leftRotation=new THREE.Quaternion(),rightRotation=new THREE.Quaternion();
  mesh.getMatrixAt(0,left);mesh.getMatrixAt(1,right);left.decompose(leftPosition,leftRotation,new THREE.Vector3());right.decompose(rightPosition,rightRotation,new THREE.Vector3());
  for(const [actual,expected] of [[leftPosition,TENGMA_PLACEMENTS[0]],[rightPosition,TENGMA_PLACEMENTS[1]]]){
   assert.ok(Math.abs(actual.x-expected.x)<1e-5);assert.ok(Math.abs(actual.y-expected.y)<1e-5);assert.ok(Math.abs(actual.z-expected.z)<1e-5);
  }
  assert.ok(leftPosition.x<P.x&&rightPosition.x>P.x,'pair leaves the entrance axis open');
  assert.ok(leftPosition.z>P.z&&rightPosition.z>P.z,'pair remains on the visitor side of gongming');
  assert.ok(leftRotation.angleTo(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/2))<1e-6);
  assert.ok(rightRotation.angleTo(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2))<1e-6);
  assert.equal(layer.stats.tengma,2);assert.ok(e.uniforms.uClothPower.value>0);
   const moved=[{x:-8.1,y:12.1,z:-12.8,yaw:-1.2},{x:-2.5,y:12.3,z:-12.8,yaw:1.2}];
   assert.deepEqual(layer.setTengmaPlacements(moved).map(({x,y,z,yaw})=>({x,y,z,yaw})),moved);
   mesh.getMatrixAt(0,left);mesh.getMatrixAt(1,right);left.decompose(leftPosition,leftRotation,new THREE.Vector3());right.decompose(rightPosition,rightRotation,new THREE.Vector3());
   assert.ok(leftPosition.distanceTo(new THREE.Vector3(moved[0].x,moved[0].y,moved[0].z))<1e-6);
   assert.ok(rightPosition.distanceTo(new THREE.Vector3(moved[1].x,moved[1].y,moved[1].z))<1e-6);
   assert.ok(leftRotation.angleTo(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),moved[0].yaw))<1e-6);
   assert.ok(rightRotation.angleTo(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),moved[1].yaw))<1e-6);
   assert.equal(layer.stats.tengmaPlacements[0].x,moved[0].x);
  layer.setState({night:false});assert.equal(e.uniforms.uClothPower.value,0);
 }finally{GLTFLoader.prototype.loadAsync=loader;layer.dispose();}
 assert.equal(parent.children.length,0);
});
