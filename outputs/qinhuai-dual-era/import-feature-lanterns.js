import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clothMaterial} from './game/lion-study/cloth-material.js';
import {FESTIVAL_LAYOUT,MAP_UNITS_PER_METER as M,lightingFor,waterClearance,reflectionMaterial} from './import-festival-lanterns.js';
import {waterControls,applyWaterControls} from './import-light-effects.mjs';

// Mount a symmetric pair on the facade of the hall behind Tianxia Wenshu.
export function fishTransforms(){
 const center=new THREE.Vector3(-5.5,14.55,-23.9),offset=new THREE.Vector3(-3.5,-.55,0);
 const base=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/4)
  .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2));
 return [0,1].map(i=>new THREE.Matrix4().compose(center.clone().addScaledVector(offset,i?-1:1),
  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),i?Math.PI:0).multiply(base),new THREE.Vector3().setScalar(2.8*M)));
}
export const WOMAN_PLACEMENT=Object.freeze({x:-16.6,z:4.6,heightMeters:9,yaw:-Math.PI*3/4});

export class FeatureLanternLayer{
 constructor(parent){
  this.root=new THREE.Group();this.root.name='Gate fish and riverside woman lantern';parent.add(this.root);
  this.entries=new Map();this.pending=new Map();this.resources=new Set();this.night=false;this.wireframe=false;this.waterVisible=true;this.disposed=false;this.water=waterControls();
 }
 setMapLightSettings(settings){this.mapSettings=settings;applyWaterControls(this.water,settings,'lotus');}
 async registerTile(tile){
  const kind=Number(tile)===9?'fish':Number(tile)===6?'woman':null;if(!kind||this.disposed)return;
  if(this.entries.has(kind))return;if(this.pending.has(kind))return this.pending.get(kind);
  const task=this.load(kind).finally(()=>this.pending.delete(kind));this.pending.set(kind,task);return task;
 }
 async load(kind){
  if(kind==='woman'&&!waterClearance(WOMAN_PLACEMENT,.5))throw Error('女灯底座超出河道边界');
  const gltf=await new GLTFLoader().loadAsync(new URL(`./assets/feature-lanterns/${kind}-low.glb`,import.meta.url).href);
  const source=gltf.scene;source.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(source),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const scale=1/(kind==='fish'?Math.max(size.x,size.z):size.y);
  const normalize=new THREE.Matrix4().makeScale(scale,scale,scale).multiply(new THREE.Matrix4().makeTranslation(-center.x,kind==='fish'?-center.y:-bounds.min.y,-center.z));
  const tuning=kind==='fish'?lightingFor('fish'):{power:.65,color:'#fff0dc',shape:.35};
  const uniforms={uClothPower:{value:0},uClothTint:{value:new THREE.Color(tuning.color)},uClothShape:{value:tuning.shape}};
  const group=new THREE.Group();group.name='feature-'+kind;const meshes=[],materials=[],reflections=[];
  const resources=new Set(),original=new Set();
  const matrices=kind==='fish'?fishTransforms():[new THREE.Matrix4().compose(new THREE.Vector3(WOMAN_PLACEMENT.x,FESTIVAL_LAYOUT.water.height+.015,WOMAN_PLACEMENT.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),WOMAN_PLACEMENT.yaw),new THREE.Vector3().setScalar(WOMAN_PLACEMENT.heightMeters*M))];
  let mask;
  try{
   if(kind==='woman'){mask=await new THREE.TextureLoader().loadAsync(new URL('./assets/qinhuai-modern-import/festival/water-mask.png',import.meta.url).href);mask.colorSpace=THREE.NoColorSpace;resources.add(mask);}
   source.traverse(mesh=>{
    if(!mesh.isMesh)return;original.add(mesh.geometry);
    const geometry=mesh.geometry.clone().applyMatrix4(normalize.clone().multiply(mesh.matrixWorld));resources.add(geometry);
    const convert=base=>{original.add(base);Object.values(base).forEach(v=>{if(v?.isTexture)resources.add(v);});const mat=clothMaterial(base,uniforms);mat.envMapIntensity=.2;resources.add(mat);materials.push(mat);return mat;};
    const material=Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material);
    const batch=new THREE.InstancedMesh(geometry,material,matrices.length);batch.name='feature-'+kind+'-body';batch.userData.featureLantern=kind;matrices.forEach((m,i)=>batch.setMatrixAt(i,m));batch.computeBoundingSphere();group.add(batch);meshes.push(batch);
    if(kind==='woman'){
     const mats=[material].flat().map(m=>reflectionMaterial(m,uniforms,mask,this.water));mats.forEach(m=>resources.add(m));
     const reflected=new THREE.InstancedMesh(geometry,Array.isArray(material)?mats:mats[0],1);reflected.name='feature-woman-reflection';reflected.setMatrixAt(0,matrices[0]);reflected.frustumCulled=false;group.add(reflected);meshes.push(reflected);reflections.push(...mats);
    }
   });
   original.forEach(r=>r.dispose());
   if(this.disposed){meshes.forEach(m=>m.dispose());resources.forEach(r=>r.dispose());return;}
   this.resources=new Set([...this.resources,...resources]);this.entries.set(kind,{group,uniforms,tuning,materials,meshes,reflections});this.root.add(group);this.setState();
  }catch(error){original.forEach(r=>r.dispose());resources.forEach(r=>r.dispose());meshes.forEach(m=>m.dispose());throw error;}
 }
 setState({night=this.night,wireframe=this.wireframe,waterVisible=this.waterVisible}={}){
  Object.assign(this,{night,wireframe,waterVisible});
  for(const [kind,e] of this.entries){e.uniforms.uClothPower.value=night&&!wireframe?e.tuning.power:0;e.materials.forEach(m=>m.wireframe=wireframe);e.group.visible=kind!=='woman'||waterVisible;for(const m of e.meshes)if(m.name.endsWith('reflection'))m.visible=night&&!wireframe&&waterVisible;}
 }
 update(time){for(const e of this.entries.values())for(const m of e.reflections)m.uniforms.time.value=time;}
 get stats(){return {fish:this.entries.has('fish')?2:0,woman:this.entries.has('woman')?1:0,pending:[...this.pending.keys()],womanPlacement:WOMAN_PLACEMENT};}
 dispose(){this.disposed=true;this.root.removeFromParent();for(const e of this.entries.values())e.meshes.forEach(m=>m.dispose());this.resources.forEach(r=>r.dispose());this.resources.clear();this.entries.clear();}
}
