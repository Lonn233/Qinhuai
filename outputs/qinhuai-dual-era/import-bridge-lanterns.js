import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const MAP_PER_METER=.3212121212121212;
const BRIDGE={xMin:-22.92,xMax:-18.67,zMin:-9.53,zMax:4.97,deckY:12.18};
const COUNT_PER_SIDE=8;
const colorFor={yellow:new THREE.Color('#ffbd43'),red:new THREE.Color('#ff3b2e')};
const sourceFor={yellow:'./assets/bridge-lanterns/yellow.glb',red:'./assets/bridge-lanterns/red.glb'};

export function bridgeLanternPlacements(){
 const result=[],z0=BRIDGE.zMin+.9,z1=BRIDGE.zMax-.9;
 for(let i=0;i<COUNT_PER_SIDE;i++)for(const side of [-1,1]){
  const red=(i+(side===1?1:0))%2===1;
  result.push({id:`bridge-${side}-${i}`,kind:red?'red':'yellow',x:side<0?BRIDGE.xMin+.45:BRIDGE.xMax-.45,z:THREE.MathUtils.lerp(z0,z1,i/(COUNT_PER_SIDE-1)),side});
 }
 return result;
}

export class BridgeLanternLayer{
 constructor(parent,{load=url=>new GLTFLoader().loadAsync(new URL(url,import.meta.url).href)}={}){
  this.root=new THREE.Group();this.root.name='Wende Bridge alternating red and yellow lanterns';parent.add(this.root);
  this.load=load;this.ready=false;this.pending=null;this.night=false;this.entries=[];this.resources=new Set();this.placements=bridgeLanternPlacements();
 }
 async registerTile(tile){if(Number(tile)!==9)return;if(this.ready)return;if(this.pending)return this.pending;this.pending=this.build().finally(()=>this.pending=null);return this.pending;}
 async build(){
  const models=await Promise.all(Object.entries(sourceFor).map(async([kind,url])=>[kind,(await this.load(url)).scene]));
  const byKind=new Map(models),dark=new THREE.MeshStandardMaterial({color:0x302018,roughness:.76,metalness:.12}),post=new THREE.CylinderGeometry(.023,.031,1.14,8),arm=new THREE.CylinderGeometry(.021,.021,.48,8);
  this.resources.add(dark);this.resources.add(post);this.resources.add(arm);
  for(const side of [-1,1]){
   const supports=new THREE.InstancedMesh(post,dark,COUNT_PER_SIDE),arms=new THREE.InstancedMesh(arm,dark,COUNT_PER_SIDE),dummy=new THREE.Object3D();
   supports.name=`WendeBridgeLampPosts-${side}`;arms.name=`WendeBridgeLampArms-${side}`;
   for(let i=0;i<COUNT_PER_SIDE;i++){
    const item=this.placements.find(p=>p.side===side&&Number(p.id.split('-').at(-1))===i);
    dummy.position.set(item.x,BRIDGE.deckY+.56,item.z);dummy.rotation.set(0,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();supports.setMatrixAt(i,dummy.matrix);
    const inward=side<0?1:-1;dummy.position.set(item.x+inward*.20,BRIDGE.deckY+1.06,item.z);dummy.rotation.set(0,0,Math.PI/2);dummy.updateMatrix();arms.setMatrixAt(i,dummy.matrix);
   }
   supports.instanceMatrix.needsUpdate=true;arms.instanceMatrix.needsUpdate=true;this.root.add(supports,arms);
  }
  for(const kind of ['yellow','red']){
   const source=byKind.get(kind);source.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(source),size=box.getSize(new THREE.Vector3());
   const normalize=new THREE.Matrix4().makeScale(1/size.y,1/size.y,1/size.y).multiply(new THREE.Matrix4().makeTranslation(-box.getCenter(new THREE.Vector3()).x,-box.min.y,-box.getCenter(new THREE.Vector3()).z));
   const items=this.placements.filter(p=>p.kind===kind),list=[];
   source.traverse(mesh=>{
    if(!mesh.isMesh)return;
    const geometry=mesh.geometry.clone().applyMatrix4(normalize.clone().multiply(mesh.matrixWorld));this.resources.add(geometry);
    const convert=original=>{const material=original.clone();material.metalness=.06;material.roughness=.85;material.emissive=colorFor[kind].clone();material.emissiveMap=original.map||null;material.emissiveIntensity=this.night?(kind==='yellow'?2.15:2.55):0;this.resources.add(material);for(const value of Object.values(original))if(value?.isTexture)this.resources.add(value);return material;};
    const material=Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material),batch=new THREE.InstancedMesh(geometry,material,items.length);
    batch.name=`WendeBridge-${kind}-lanterns`;batch.userData.bridgeLanternKind=kind;
    items.forEach((item,index)=>{const inward=item.side<0?1:-1;const position=new THREE.Vector3(item.x+inward*.40,BRIDGE.deckY+.48,item.z);const rotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),item.side<0?Math.PI/2:-Math.PI/2);const scale=new THREE.Vector3(1.75*MAP_PER_METER,1.75*MAP_PER_METER,1.75*MAP_PER_METER);dummyMatrix.compose(position,rotation,scale);batch.setMatrixAt(index,dummyMatrix);});
    batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox();batch.computeBoundingSphere();this.root.add(batch);list.push(batch);
   });
   this.entries.push({kind,meshes:list,materials:list.flatMap(m=>Array.isArray(m.material)?m.material:[m.material])});
  }
  this.ready=true;
 }
 setNight(night){this.night=!!night;for(const e of this.entries)for(const m of e.materials)m.emissiveIntensity=this.night?(e.kind==='yellow'?2.15:2.55):0;}
 dispose(){this.root.removeFromParent();for(const resource of this.resources)resource.dispose();this.resources.clear();this.entries=[];this.ready=false;}
 get stats(){return {ready:this.ready,lanterns:this.placements.length,triangles:this.entries.reduce((sum,e)=>sum+e.meshes.reduce((n,m)=>n+m.geometry.index.count/3*m.count,0),0),placements:this.placements};}
}

const dummyMatrix=new THREE.Matrix4();
