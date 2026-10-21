import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {EnvironmentVolume,spatialEmitterSample} from '../import-environment-volume.js';
import {ImportEnvironmentSpill} from '../import-environment-spill.js';
const e={x:0,y:14,z:0,nx:0,nz:1,halfWidth:2},p={distance:8,decayDistance:4,feather:.5,intensity:1};
test('3D spill obeys height, spherical distance, cone and surface-light direction',()=>{
 const near=spatialEmitterSample(0,14,2,e,p);assert.ok(near.weight>0);assert.equal(near.z,-1);
 assert.ok(spatialEmitterSample(0,17,2,e,p).weight<near.weight);
 assert.equal(spatialEmitterSample(0,24,2,e,p).weight,0);assert.equal(spatialEmitterSample(0,14,-2,e,p).weight,0);
 assert.ok(spatialEmitterSample(0,16,2,e,{...p,angle:30}).weight<spatialEmitterSample(0,16,2,e,{...p,angle:120}).weight);
 for(const patch of [{distance:0},{decayDistance:0}])assert.equal(spatialEmitterSample(0,14,2,e,{...p,...patch}).weight,0);
});
test('volume retains color, removes disabled light, avoids multiplying duplicate window strips',()=>{
 const v=new EnvironmentVolume([32,32,32]),b=new THREE.Vector4(-10,-10,20,20);
 const channel={p,color:new THREE.Color('#ff2200'),energy:2,emitters:[e]};
 try{
 v.begin(b);v.addChannel(channel);v.finish();const single=v.radiance.slice();assert.ok(single.some((n,i)=>i%4===0&&n>0));
 assert.ok(single.every((n,i)=>i%4!==2||n===0));
 v.begin(b);v.addChannel({...channel,emitters:[e,{...e},{...e}]});v.finish();assert.deepEqual(v.radiance,single);
 v.begin(b);v.finish();assert.ok(v.radiance.every((n,i)=>i%4===3||n===0));
 }finally{v.dispose();}
});
test('instanced foliage and existing building hooks receive live uniforms without replacing their materials',()=>{
 const r=new ImportEnvironmentSpill(),m=new THREE.MeshStandardMaterial({alphaTest:.5}),group=new THREE.Group();
 const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(),m,1);mesh.setMatrixAt(0,new THREE.Matrix4().makeTranslation(8,14,4));group.add(mesh);
 const hook=s=>{s.uniforms.existing={value:3};},key=()=> 'source-window';m.onBeforeCompile=hook;m.customProgramCacheKey=key;
 r.attachReceivers(group,{external:true});r.attachReceivers(group,{external:true});r.attachBindings([{night:m}]);
 assert.equal(mesh.material,m);assert.equal(r.patched.size,1);assert.equal(m.alphaTest,.5);
 const shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <aomap_fragment>'};m.onBeforeCompile(shader,{});
 assert.equal(shader.uniforms.existing.value,3);assert.equal(shader.uniforms.envVolume,r.uniforms.envVolume);
 assert.match(shader.vertexShader,/instanceMatrix\*envPosition/);assert.match(shader.fragmentShader,/sampler3D envVolume/);
 r.setState({night:true});assert.equal(shader.uniforms.envActive.value,1);r.setState({night:false});assert.equal(shader.uniforms.envActive.value,0);
 r.dispose();assert.equal(m.onBeforeCompile,hook);assert.equal(m.customProgramCacheKey,key);assert.equal(mesh.material,m);mesh.geometry.dispose();m.dispose();
});

test('animated character receivers preserve skinning, textures and original light hooks',()=>{
 const rig=new ImportEnvironmentSpill(),map=new THREE.Texture(),material=new THREE.MeshStandardMaterial({map,roughness:.85});
 const geometry=new THREE.BoxGeometry(),bone=new THREE.Bone(),skeleton=new THREE.Skeleton([bone]);
 const mesh=new THREE.SkinnedMesh(geometry,material);mesh.add(bone);mesh.bind(skeleton);
 const hook=shader=>{shader.uniforms.originalCharacterHook={value:1};};material.onBeforeCompile=hook;
 rig.attachReceivers(mesh,{external:true});rig.attachReceivers(mesh,{external:true});
 assert.equal(mesh.material,material);assert.equal(material.map,map);assert.equal(mesh.skeleton,skeleton);assert.equal(rig.patched.size,1);
 const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};material.onBeforeCompile(shader,{});
 assert.ok(shader.vertexShader.indexOf('vec4 envPosition')>shader.vertexShader.indexOf('#include <skinning_vertex>'));
 assert.ok(shader.fragmentShader.includes("inverseTransformDirection(normal,viewMatrix)"));
 assert.equal(shader.uniforms.originalCharacterHook.value,1);assert.equal(shader.uniforms.envVolume,rig.uniforms.envVolume);
 rig.setState({night:true});assert.equal(shader.uniforms.envActive.value,1);bone.position.x=2;mesh.updateMatrixWorld(true);
 assert.equal(shader.uniforms.envVolume,rig.uniforms.envVolume);assert.equal(mesh.skeleton,skeleton);
 rig.setState({night:false});assert.equal(shader.uniforms.envActive.value,0);assert.equal(material.emissiveIntensity,1);assert.equal(material.emissive.getHex(),0);
 rig.dispose();assert.equal(material.onBeforeCompile,hook);assert.equal(mesh.material,material);skeleton.dispose();geometry.dispose();material.dispose();map.dispose();
});

test('independently managed dragon materials retain their preset through environment mode changes',async()=>{
 const {DragonWallLighting,DRAGON_NODES}=await import('../import-dragon-lighting.js');
 const r=new ImportEnvironmentSpill(),scene=new THREE.Scene(),root=new THREE.Group();
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());mesh.name='FuziTemple0664';root.add(mesh);
 const dragon=new DragonWallLighting(scene);r.attachTile(5,root,{},new Set(Object.keys(DRAGON_NODES)));dragon.registerTile(5,root);r.attachBindings(dragon.bindings);
 dragon.setState({night:true});const material=mesh.material;r.setState({night:true});assert.equal(mesh.material,material);assert.equal(r.receivers.has(mesh),false);
 const shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <emissivemap_fragment>\n#include <aomap_fragment>'};material.onBeforeCompile(shader,{});
 assert.equal(shader.uniforms.qhDragonColor,dragon.uniforms.left.color);assert.equal(shader.uniforms.envVolume,r.uniforms.envVolume);
 r.setState({night:false});dragon.setState({night:false});assert.equal(mesh.material,dragon.bindings[0].original);
 r.dispose();dragon.dispose();mesh.geometry.dispose();mesh.material.dispose();
});

test('color/intensity changes reuse bounded kernels; distance, angle and emitter motion invalidate them',()=>{
 const v=new EnvironmentVolume([24,24,24]),bounds=new THREE.Vector4(-10,-10,20,20),channel={cacheKey:'window',p,color:new THREE.Color('#ff0000'),energy:2,emitters:[e]};
 const bake=c=>{v.begin(bounds);v.addChannel(c);v.finish();};
 try{
 bake(channel);const builds=v.kernelBuilds;
 bake({...channel,color:new THREE.Color('#0000ff'),energy:1,p:{...p,intensity:.5}});assert.equal(v.kernelBuilds,builds);assert.ok(v.radiance.every((n,i)=>i%4!==0||n===0));
 bake({...channel,p:{...p,distance:4}});assert.equal(v.kernelBuilds,builds+1);
 bake({...channel,p:{...p,distance:4},emitters:[{...e,y:16}]});assert.equal(v.kernelBuilds,builds+2);
 bake({...channel,p:{...p,angle:30}});assert.equal(v.kernelBuilds,builds+3);const narrow=v.radiance.slice();
 bake({...channel,p:{...p,angle:120}});assert.equal(v.kernelBuilds,builds+4);assert.notDeepEqual(v.radiance,narrow);
 bake({...channel,p:{...p,angle:120},color:new THREE.Color('#00ff00')});assert.equal(v.kernelBuilds,builds+4);
 assert.ok(v.cacheBytes<=v.cacheLimit);assert.equal(v.cache.size,1);
 v.cacheLimit=1;bake({...channel,p:{...p,distance:5}});assert.equal(v.cacheBytes,0);assert.equal(v.cache.size,0);
 }finally{v.dispose();}
});
