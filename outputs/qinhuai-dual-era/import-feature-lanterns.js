import {loadLargeLanternLods,SingleLanternLod} from './import-large-lantern-lod.mjs';
import * as THREE from 'three';
import {applyClothLight} from './import-lantern-settings.mjs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clothMaterial} from './game/lion-study/cloth-material.js';
import {FESTIVAL_LAYOUT,MAP_UNITS_PER_METER as M,lightingFor,waterClearance,reflectionMaterial} from './import-festival-lanterns.js';
import {waterControls,applyWaterControls} from './import-light-effects.mjs';

export const WOMAN_PLACEMENT=Object.freeze({x:-16.6,z:4.6,heightMeters:9,yaw:-Math.PI*3/4});

// Freestanding arch on the plaza axis, facing +Z toward Tianxia Wenshu.
export const GONGMING_PLACEMENT=Object.freeze({x:-5.3,y:11.8644,z:-17.6,widthMeters:9,yaw:0});
export function gongmingTransform(){
 const p=GONGMING_PLACEMENT;
 return new THREE.Matrix4().compose(new THREE.Vector3(p.x,p.y,p.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),p.yaw),new THREE.Vector3().setScalar(p.widthMeters*M));
}

// Pair of 腾马灯s on the visitor side of the 贡名灯. The source model is
// forward-facing along Z, so the opposing ±90° yaws turn both horse heads to
// the central axis while leaving the entrance clear.
export const TENGMA_PLACEMENTS=Object.freeze([
 {x:-7.2,y:11.8644,z:-13.7,heightMeters:2.2,yaw:-Math.PI/2},
 {x:-3.4,y:11.8644,z:-13.7,heightMeters:2.2,yaw: Math.PI/2},
]);
export function tengmaTransforms(placements=TENGMA_PLACEMENTS){
 return placements.map(p=>new THREE.Matrix4().compose(
  new THREE.Vector3(p.x,p.y,p.z),
  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),p.yaw),
  new THREE.Vector3().setScalar(p.heightMeters*M),
 ));
}

export class FeatureLanternLayer{
 constructor(parent,{loadLods=loadLargeLanternLods}={}){
  this.loadLods=loadLods;
  this.root=new THREE.Group();this.root.name='Gate fish, gongming arch, tengma pair and riverside woman lantern';parent.add(this.root);
  this.entries=new Map();this.pending=new Map();this.resources=new Set();this.tengmaPlacements=TENGMA_PLACEMENTS.map(p=>({...p}));this.night=false;this.wireframe=false;this.waterVisible=true;this.disposed=false;this.water=waterControls();
 }
 getTengmaPlacements(){return this.tengmaPlacements.map(p=>({...p}));}
 setTengmaPlacements(placements){
  if(!Array.isArray(placements)||placements.length!==TENGMA_PLACEMENTS.length)return this.getTengmaPlacements();
  this.tengmaPlacements=placements.map((p,index)=>({...TENGMA_PLACEMENTS[index],x:Number.isFinite(p?.x)?p.x:TENGMA_PLACEMENTS[index].x,y:Number.isFinite(p?.y)?p.y:TENGMA_PLACEMENTS[index].y,z:Number.isFinite(p?.z)?p.z:TENGMA_PLACEMENTS[index].z,yaw:Number.isFinite(p?.yaw)?p.yaw:TENGMA_PLACEMENTS[index].yaw}));
  const entry=this.entries.get('tengma'),matrices=tengmaTransforms(this.tengmaPlacements);
  for(const mesh of entry?.meshes||[]){
   if(mesh.userData.featureLantern!=='tengma')continue;
   matrices.forEach((matrix,index)=>mesh.setMatrixAt(index,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();
  }
  return this.getTengmaPlacements();
 }
 setMapLightSettings(settings){this.mapSettings=settings;applyWaterControls(this.water,settings,'lotus');}
 async registerTile(tile){
  const kinds=Number(tile)===9?['gongming','tengma']:Number(tile)===6?['woman']:[];
  const errors=[];
  for(const kind of kinds){try{await this.ensure(kind);}catch(error){errors.push(error);}}
  if(errors.length)throw new AggregateError(errors,'Feature lantern loading failed');
 }
 async ensure(kind){
  if(this.disposed)return;
  if(this.entries.has(kind))return;if(this.pending.has(kind))return this.pending.get(kind);
  const task=this.load(kind).finally(()=>this.pending.delete(kind));this.pending.set(kind,task);return task;
 }
 async load(kind){
  if(kind==='woman'&&!waterClearance(WOMAN_PLACEMENT,.5))throw Error('女灯底座超出河道边界');
  const asset=kind==='gongming'?'./assets/gongming-lantern/gongming-high.glb':kind==='tengma'?'./assets/gongming-lantern/tengma-low.glb':`./assets/feature-lanterns/${kind}-low.glb`;
  const gltf=await new GLTFLoader().loadAsync(new URL(asset,import.meta.url).href);
  const source=gltf.scene;source.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(source),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const scale=1/(kind==='gongming'?size.x:size.y);
  const normalize=new THREE.Matrix4().makeScale(scale,scale,scale).multiply(new THREE.Matrix4().makeTranslation(-center.x,-bounds.min.y,-center.z));
  const tuning=kind==='gongming'?{power:.55,color:'#fff0dc',shape:.55}:kind==='tengma'?{power:.62,color:'#fff0dc',shape:.5}:{power:.65,color:'#fff0dc',shape:.35};
  const uniforms={uClothPower:{value:0},uClothTint:{value:new THREE.Color(tuning.color)},uClothShape:{value:tuning.shape}};
  const group=new THREE.Group();group.name='feature-'+kind;const meshes=[],materials=[],reflections=[];
  const resources=new Set(),original=new Set();
  const matrices=kind==='gongming'?[gongmingTransform()]:kind==='tengma'?tengmaTransforms(this.tengmaPlacements):[new THREE.Matrix4().compose(new THREE.Vector3(WOMAN_PLACEMENT.x,FESTIVAL_LAYOUT.water.height+.015,WOMAN_PLACEMENT.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),WOMAN_PLACEMENT.yaw),new THREE.Vector3().setScalar(WOMAN_PLACEMENT.heightMeters*M))];
  let mask,lod,lodError;
  try{
   if(kind==='woman'){mask=await new THREE.TextureLoader().loadAsync(new URL('./assets/qinhuai-modern-import/festival/water-mask.png',import.meta.url).href);mask.colorSpace=THREE.NoColorSpace;resources.add(mask);}
   source.traverse(mesh=>{
    if(!mesh.isMesh)return;original.add(mesh.geometry);
    const geometry=mesh.geometry.clone().applyMatrix4(normalize.clone().multiply(mesh.matrixWorld));resources.add(geometry);
    const convert=base=>{original.add(base);Object.values(base).forEach(v=>{if(v?.isTexture)resources.add(v);});const mat=clothMaterial(base,uniforms);mat.envMapIntensity=.2;resources.add(mat);materials.push(mat);return mat;};
    const material=Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material);
    const batch=new THREE.InstancedMesh(geometry,material,matrices.length);batch.name='feature-'+kind+'-body';batch.userData.featureLantern=kind;matrices.forEach((m,i)=>batch.setMatrixAt(i,m));batch.computeBoundingBox();batch.computeBoundingSphere();group.add(batch);meshes.push(batch);
    if(kind==='woman'){
     const mats=[material].flat().map(m=>reflectionMaterial(m,uniforms,mask,this.water));mats.forEach(m=>resources.add(m));
     const reflected=new THREE.InstancedMesh(geometry,Array.isArray(material)?mats:mats[0],1);reflected.name='feature-woman-reflection';reflected.setMatrixAt(0,matrices[0]);reflected.frustumCulled=false;group.add(reflected);meshes.push(reflected);reflections.push(...mats);
    }
   });
   original.forEach(r=>r.dispose());
   if(kind==='gongming'&&this.loadLods){
    try{const data=await this.loadLods(kind);if(!this.disposed){if(meshes.length!==1)throw Error('Expected one gongming mesh');lod=new SingleLanternLod(kind,meshes[0],data,resources);}}catch(error){lodError=String(error.message||error);console.warn('Gongming LOD fallback',error);}
   }
   if(this.disposed){meshes.forEach(m=>m.dispose());resources.forEach(r=>r.dispose());return;}
   this.resources=new Set([...this.resources,...resources]);this.entries.set(kind,{group,uniforms,tuning,materials,meshes,reflections,lod,lodError});this.root.add(group);this.setState();
  }catch(error){original.forEach(r=>r.dispose());resources.forEach(r=>r.dispose());meshes.forEach(m=>m.dispose());throw error;}
 }
 setState({night=this.night,wireframe=this.wireframe,waterVisible=this.waterVisible}={}){
  Object.assign(this,{night,wireframe,waterVisible});
  for(const [kind,e] of this.entries){applyClothLight(this,kind,e,night&&!wireframe);e.materials.forEach(m=>m.wireframe=wireframe);e.group.visible=this.lightControls?.[kind]?.modelVisible!==false&&(kind!=='woman'||waterVisible);for(const m of e.meshes)if(m.name.endsWith('reflection'))m.visible=night&&!wireframe&&waterVisible;}
 }
 update(time,camera){for(const e of this.entries.values()){e.lod?.update(camera,time);for(const m of e.reflections)m.uniforms.time.value=time;}}
 get stats(){return {gongmingLod:this.entries.get('gongming')?.lod?.stats??null,gongmingLodError:this.entries.get('gongming')?.lodError??null,fish:0,woman:this.entries.has('woman')?1:0,gongming:this.entries.has('gongming')?1:0,tengma:this.entries.has('tengma')?2:0,pending:[...this.pending.keys()],womanPlacement:WOMAN_PLACEMENT,gongmingPlacement:GONGMING_PLACEMENT,tengmaPlacements:this.getTengmaPlacements()};}
 dispose(){this.disposed=true;this.root.removeFromParent();for(const e of this.entries.values())e.meshes.forEach(m=>m.dispose());this.resources.forEach(r=>r.dispose());this.resources.clear();this.entries.clear();}
}
