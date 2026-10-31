import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clothMaterial} from './game/lion-study/cloth-material.js';
import {lampSetting,lampGain} from './import-lantern-settings.mjs';
import {rackLayout,RACK_KINDS,RACK_COLORS,RACK_PAVING_REGIONS,RACK_GROUND_Y} from './courtyard-rack-layout.mjs';
const Y=new THREE.Vector3(0,1,0),X=new THREE.Vector3(1,0,0);
export class CourtyardRackLanterns {
 constructor(parent,{load}={}){
  this.root=new THREE.Group();this.root.name='CourtyardFourColorRacks';parent.add(this.root);
  this.load=load||((kind)=>new GLTFLoader().loadAsync('./assets/courtyard-rack-lanterns/'+kind+'-low.glb?v=uv-seams-20261022'));
  this.entries=new Map();this.resources=new Set();this.ready=false;this.disposed=false;this.pending=null;this.night=true;this.wireframe=false;this.error=null;
 }
 registerTile(id){
  if(id!==9||this.ready||this.disposed)return Promise.resolve();if(this.pending)return this.pending;
  this.pending=this.build().catch(e=>{this.clear();this.error=e.message;throw e;}).finally(()=>{this.pending=null;});return this.pending;
 }
 own(resource){this.resources.add(resource);return resource;}
 batch(geometry,material,matrices,name,region){
  const mesh=new THREE.InstancedMesh(geometry,material,matrices.length);mesh.name=name;
  matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();mesh.receiveShadow=true;
  mesh.userData.rackRegion=region;this.root.add(mesh);return mesh;
 }
 async build(){
  const layouts=rackLayout();this.root.userData.layouts=layouts;
  // Keep the existing side paving infills; the central road needs no overlay.
  const paving=this.own(new THREE.PlaneGeometry(1,1));
  const pavingMaterial=this.own(new THREE.MeshStandardMaterial({color:'#d4c7ab',roughness:1}));
  for(const r of RACK_PAVING_REGIONS){
   const matrix=new THREE.Matrix4().compose(new THREE.Vector3((r.minX+r.maxX)/2,RACK_GROUND_Y,(r.minZ+r.maxZ)/2),new THREE.Quaternion().setFromAxisAngle(X,-Math.PI/2),new THREE.Vector3(r.maxX-r.minX-.002,r.maxZ-r.minZ-.002,1));
   this.batch(paving,pavingMaterial,[matrix],'CourtyardPavingInfill',r.id).userData.walkSurface=true;
  }
  const cylinder=this.own(new THREE.CylinderGeometry(1,1,1,8));
  const wood=this.own(new THREE.MeshStandardMaterial({color:'#684629',roughness:.94}));
  const rope=this.own(new THREE.MeshStandardMaterial({color:'#ab9164',roughness:1}));
  for(const l of layouts)for(const [segments,material,name] of [[l.wood,wood,'RackWood'],[l.ropes,rope,'RackRopes']]){
   const matrices=segments.map(s=>{const a=new THREE.Vector3(...s.a),b=new THREE.Vector3(...s.b),v=b.clone().sub(a);return new THREE.Matrix4().compose(a.add(b).multiplyScalar(.5),new THREE.Quaternion().setFromUnitVectors(Y,v.clone().normalize()),new THREE.Vector3(s.r,v.length(),s.r));});
   this.batch(cylinder,material,matrices,name,l.region.id);
  }
  for(const kind of RACK_KINDS){
   const gltf=await this.load(kind),source=gltf.scene;source.updateMatrixWorld(true);
   // Adopt all source resources, including textures shared by cloned cloth materials.
   source.traverse(o=>{if(!o.isMesh)return;this.own(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){this.own(m);for(const value of Object.values(m))if(value?.isTexture)this.own(value);}});
   if(this.disposed){this.clear();return;}
   const bounds=new THREE.Box3().setFromObject(source),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
   const uniforms={uClothPower:{value:0},uClothTint:{value:new THREE.Color('white')},uClothShape:{value:.7}};
   const entry={meshes:[],materials:[],uniforms,color:RACK_COLORS[kind]};this.entries.set('rack-'+kind,entry);
   for(const l of layouts){
    const transforms=l.mounts.filter(m=>m.kind===kind).map(m=>{
     const scale=m.height/size.y;
     return new THREE.Matrix4().compose(new THREE.Vector3(...m.center),new THREE.Quaternion().setFromAxisAngle(X,m.rotation),new THREE.Vector3().setScalar(scale)).multiply(new THREE.Matrix4().makeTranslation(-center.x,-center.y,-center.z));
    });
    source.traverse(part=>{if(!part.isMesh)return;
     const clone=m=>{const c=this.own(clothMaterial(m,uniforms));entry.materials.push(c);return c;};
     const material=Array.isArray(part.material)?part.material.map(clone):clone(part.material);
     const mesh=this.batch(part.geometry,material,transforms.map(t=>t.clone().multiply(part.matrixWorld)),'RackLantern-'+kind,l.region.id);mesh.userData.rackKind=kind;entry.meshes.push(mesh);
    });
   }
  }
  this.ready=true;this.error=null;this.setState();
 }
 setState({night=this.night,wireframe=this.wireframe}={}){
  this.night=night;this.wireframe=wireframe;
  for(const [id,e] of this.entries){const p=lampSetting(this,id);for(const mesh of e.meshes)mesh.visible=p.modelVisible;e.uniforms.uClothPower.value=night&&!wireframe?.72*lampGain(p):0;e.uniforms.uClothTint.value.set(p.inheritColor?'#ffffff':p.color);}
  for(const m of this.resources)if(m.isMaterial)m.wireframe=wireframe;
 }
 get stats(){let drawCalls=0;this.root.traverse(o=>{if(o.isMesh)drawCalls++;});return {ready:this.ready,racks:this.ready?(this.root.userData.layouts||[]).length:0,lamps:this.ready?(this.root.userData.layouts||[]).reduce((n,l)=>n+l.mounts.length,0):0,drawCalls,error:this.error};}
 clear(){this.root.traverse(m=>{if(m.isInstancedMesh)m.dispose();});this.root.clear();for(const r of this.resources)r.dispose();this.resources.clear();this.entries.clear();this.ready=false;}
 dispose(){this.disposed=true;this.clear();this.root.removeFromParent();}
}
