import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import dimensions from '../lion-study/dimensions.cjs';
import {initializeModelSize,applyModelSize} from '../lion-study/model-sizing.mjs';
const {SIZE_SPECS}=dimensions;
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
for(const [id,expected] of Object.entries({mountain:13,lotus:.6,lion:2.5,crane:.5,fish:.8})){
 test(`${id}: exact physical default, uniform proportions, stable repeated resizing`,()=>{
  const group=new THREE.Group(),mesh=new THREE.Mesh(new THREE.BoxGeometry(4,3,2));
  mesh.position.y=1.5;group.add(mesh);group.rotation.y=Math.PI;
  const entry=initializeModelSize(group,id),actual=new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
  close(SIZE_SPECS[id].axis==='height'?actual.y:Math.max(actual.x,actual.z),expected);
  close(actual.x/actual.y,4/3);close(actual.z/actual.y,2/3);
  for(const factor of [1.2,1.4,1])applyModelSize(entry,expected*factor);
  const restored=new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
  close(restored.x,actual.x);close(restored.y,actual.y);close(restored.z,actual.z);
  assert.throws(()=>applyModelSize(entry,-1));assert.throws(()=>applyModelSize(entry,Infinity));
  mesh.geometry.dispose();mesh.material.dispose();
 });
}
