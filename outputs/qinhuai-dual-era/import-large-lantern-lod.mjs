import * as THREE from 'three';
import mountain from './assets/large-lantern-lods/mountain-lods.json' with {type:'json'};
import gongming from './assets/large-lantern-lods/gongming-lods.json' with {type:'json'};
export const LARGE_LANTERN_LODS=Object.freeze({mountain,gongming});
export function decodeLargeLanternLods(kind,buffer){
 const spec=LARGE_LANTERN_LODS[kind];if(!spec||buffer.byteLength!==spec.extraBytes)throw Error('Lantern LOD payload mismatch');
 return spec.levels.slice(1).map(l=>{
  const part=Object.fromEntries(Object.entries(l.attributes).map(([name,a])=>[name,new (name==='index'?(l.indexType==='uint32'?Uint32Array:Uint16Array):Float32Array)(buffer,a.byteOffset,a.count)]));
  if(part.index.length!==l.triangles*3||part.position.length!==l.vertices*3||part.normal.length!==l.vertices*3||part.uv.length!==l.vertices*2||part.index.some(i=>i>=l.vertices)||['position','normal','uv'].some(k=>part[k].some(v=>!Number.isFinite(v))))throw Error('Invalid lantern geometry');
  return part;
 });
}
export async function loadLargeLanternLods(kind){
 const spec=LARGE_LANTERN_LODS[kind];if(!spec)throw Error('Unsupported lantern LOD');
 const r=await fetch(new URL('./assets/large-lantern-lods/'+spec.geometryFile,import.meta.url));
 if(!r.ok)throw Error('Lantern LOD HTTP '+r.status);return decodeLargeLanternLods(kind,await r.arrayBuffer());
}
export function selectLargeLanternLod(fraction,previous,spec){
 const {medium,far,hysteresis:h}=spec.thresholds;
 if(previous<0)return fraction>=medium?0:fraction>=far?1:2;
 let level=previous;while(level<2&&fraction<[medium,far][level]*(1-h))level++;while(level>0&&fraction>[medium,far][level-1]*(1+h))level--;return level;
}
// These landmarks have one instance each: swap geometry on the existing mesh.
// Material, placement, visibility wrappers, lighting and saved settings keep their identity.
export class SingleLanternLod {
 constructor(kind,mesh,data,resources){
  this.spec=LARGE_LANTERN_LODS[kind];this.mesh=mesh;this.level=-1;this.nextUpdate=-Infinity;this.changes=0;
  const base=mesh.geometry;
  if(mesh.count!==1||base.attributes.position.count!==this.spec.vertices||base.index.count!==this.spec.levels[0].triangles*3||data.length!==2)throw Error('Lantern source changed; regenerate LODs');
  base.computeBoundingBox();this.sourceBounds=base.boundingBox.clone();mesh.userData.lanternEmitterBounds=this.sourceBounds;
  this.geometries=[base,...data.map(part=>{const g=new THREE.BufferGeometry();for(const name of ['position','normal','uv'])g.setAttribute(name,new THREE.BufferAttribute(part[name],name==='uv'?2:3));g.setIndex(new THREE.BufferAttribute(part.index,1));resources.add(g);g.computeBoundingBox();return g;})];
  const union=new THREE.Box3();this.geometries.forEach(g=>union.union(g.boundingBox));const sphere=union.getBoundingSphere(new THREE.Sphere());
  this.geometries.forEach(g=>{g.boundingBox=union.clone();g.boundingSphere=sphere.clone();});mesh.computeBoundingBox();mesh.computeBoundingSphere();
  this.instance=new THREE.Matrix4();this.world=new THREE.Matrix4();this.center=new THREE.Vector3();this.cameraPosition=new THREE.Vector3();this.scale=new THREE.Vector3();
  this.width=Math.max(this.sourceBounds.max.x-this.sourceBounds.min.x,this.sourceBounds.max.z-this.sourceBounds.min.z);
 }
 update(camera,time){
  if(!camera||time<this.nextUpdate)return;this.nextUpdate=time+.15;
  this.mesh.updateWorldMatrix(true,false);this.mesh.getMatrixAt(0,this.instance);this.world.multiplyMatrices(this.mesh.matrixWorld,this.instance);
  this.sourceBounds.getCenter(this.center).applyMatrix4(this.world);this.scale.setFromMatrixScale(this.world);camera.getWorldPosition(this.cameraPosition);
  const diameter=this.width*Math.max(...this.scale.toArray().map(Math.abs)),distance=Math.max(.001,this.center.distanceTo(this.cameraPosition));
  const height=camera.isOrthographicCamera?(camera.top-camera.bottom)/camera.zoom:2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/camera.zoom;
  const next=selectLargeLanternLod(diameter/height,this.level,this.spec);
  if(next===this.level)return;this.level=next;this.mesh.geometry=this.geometries[next];this.changes++;
 }
 get stats(){return {level:this.level,triangles:this.spec.levels[Math.max(0,this.level)].triangles,baselineTriangles:this.spec.levels[0].triangles,changes:this.changes};}
}
