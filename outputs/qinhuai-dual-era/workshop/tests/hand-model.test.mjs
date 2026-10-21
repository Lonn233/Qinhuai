import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import * as THREE from 'three';
const require=createRequire(import.meta.url);
const {buildSync}=require('esbuild');
const compiled=buildSync({entryPoints:[fileURLToPath(new URL('../workbench-visuals.js',import.meta.url))],bundle:true,platform:'node',format:'cjs',external:['three'],write:false}).outputFiles[0].text;
const mod={exports:{}};new Function('require','module','exports',compiled)(require,mod,mod.exports);
const {makeHand,setHandPose,alignHandGrip,disposeGroup}=mod.exports;

test('hands have five articulated digits, mirrored anatomy and bounded draw calls',()=>{
 const group=new THREE.Group(),left=makeHand(group,true),right=makeHand(group,false);
 for(const hand of [left,right]){
  const rig=hand.handRig,meshes=[];hand.traverse(o=>{if(o.isMesh)meshes.push(o);});
  assert.equal(rig.skeleton.bones.length,16);assert.equal(meshes.length,4);
  assert.equal(meshes.filter(m=>m.isSkinnedMesh).length,2);
  assert.ok(Math.abs(rig.fingers[1][1].position.z)>Math.abs(rig.fingers[3][1].position.z));
  for(const mesh of meshes){
   for(const attr of Object.values(mesh.geometry.attributes))assert.ok([...attr.array].every(Number.isFinite));
   if(!mesh.isSkinnedMesh)continue;
   const weights=mesh.geometry.attributes.skinWeight,indices=mesh.geometry.attributes.skinIndex;
   for(let i=0;i<weights.count;i++){
    assert.ok(Math.abs(weights.getX(i)+weights.getY(i)+weights.getZ(i)+weights.getW(i)-1)<1e-6);
    assert.ok(indices.getX(i)<16&&indices.getY(i)<16);
   }
  }
 }
 left.handRig.skeleton.bones.forEach((bone,i)=>{
  const b=right.handRig.skeleton.bones[i];assert.ok(Math.abs(bone.position.x+b.position.x)<1e-8);
  assert.equal(bone.position.y,b.position.y);assert.equal(bone.position.z,b.position.z);
 });
 disposeGroup(group);
});

test('poses deform the same geometry and rotated grips keep contact with the tool',()=>{
 const parent=new THREE.Group(),hand=makeHand(parent,false,'press');
 const mesh=hand.children.find(o=>o.isSkinnedMesh),geometry=mesh.geometry;
 hand.updateMatrixWorld(true);const vertex=new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,300);
 const before=mesh.applyBoneTransform(300,vertex.clone());
 for(const pose of ['bamboo','brush','pinch','relaxed','grip']){
  assert.ok(setHandPose(hand,pose));hand.updateMatrixWorld(true);
  assert.equal(mesh.geometry,geometry);assert.ok(mesh.applyBoneTransform(300,vertex.clone()).distanceTo(before)>1e-5);
 }
 assert.equal(setHandPose(hand,'unknown'),false);
 hand.scale.set(.7,.8,.9);hand.rotation.set(.3,-.6,.2);
 const target=new THREE.Vector3(.4,1.2,-.3);alignHandGrip(hand,target);hand.updateMatrixWorld(true);
 assert.ok(hand.localToWorld(new THREE.Vector3(...hand.userData.gripPoint)).distanceTo(target)<1e-8);
 disposeGroup(parent);
});

test('palm and sleeve surfaces have outward normals',()=>{
 const parent=new THREE.Group(),hand=makeHand(parent),skin=hand.children.find(o=>o.isSkinnedMesh);
 const p=skin.geometry.attributes.position,n=skin.geometry.attributes.normal;
 for(const i of [2*16,2*16+4,2*16+8,2*16+12])assert.ok(p.getX(i)*n.getX(i)+p.getY(i)*n.getY(i)>0);
 for(const sleeve of hand.children.filter(o=>o.isMesh&&!o.isSkinnedMesh)){
  const p=sleeve.geometry.attributes.position,n=sleeve.geometry.attributes.normal;
  for(let i=16;i<32;i++)assert.ok(p.getX(i)*n.getX(i)+p.getY(i)*n.getY(i)>0);
 }
 disposeGroup(parent);
});

test('shared skeletons and geometry are disposed once when leaving the workbench',()=>{
 const parent=new THREE.Group(),hand=makeHand(parent);let skeletonDisposals=0,geometryDisposals=0;
 hand.handRig.skeleton.dispose=()=>skeletonDisposals++;
 hand.traverse(o=>{if(o.geometry)o.geometry.addEventListener('dispose',()=>geometryDisposals++);});
 disposeGroup(parent);assert.equal(parent.children.length,0);assert.equal(skeletonDisposals,1);assert.equal(geometryDisposals,4);
});
