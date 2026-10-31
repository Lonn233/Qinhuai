import * as THREE from 'three';
import spec from './assets/qinhuai-modern-import/festival/lion-lods.json' with {type:'json'};
export const LION_LOD_SPEC=spec;
export async function loadLionLodData(){
 const response=await fetch(new URL('./assets/qinhuai-modern-import/festival/lion-lods.bin',import.meta.url));
 if(!response.ok)throw Error(`Lion LOD HTTP ${response.status}`);
 return decodeLionLodData(await response.arrayBuffer());
}
export function decodeLionLodData(buffer){
 if(buffer.byteLength!==spec.extraBytes)throw Error('Lion LOD byte length mismatch');
 return spec.levels.slice(1).map(l=>Object.fromEntries(Object.entries(l.attributes).map(([name,a])=>[name,new (name==='index'?Uint16Array:Float32Array)(buffer,a.byteOffset,a.count)])));
}
// Screen fraction rather than fixed world distance also respects camera zoom/FOV.
export function selectLionLod(fraction,previous=-1){
 const {medium,far,hysteresis:h}=spec.thresholds;
 if(previous<0)return fraction>=medium?0:fraction>=far?1:2;
 let level=previous;
 while(level<2&&fraction<[medium,far][level]*(1-h))level++;
 while(level>0&&fraction>[medium,far][level-1]*(1+h))level--;
 return level;
}
export class LionLodBatches {
 constructor(entry,data,parent,mapUnitsPerMeter){
  if(entry.parts.length!==1)throw Error('Lion LOD requires the audited single primitive');
  const base=entry.batches.find(b=>!b.mesh.userData.festivalSpill),geometry=base.mesh.geometry;
  if(geometry.attributes.position.count!==spec.vertices||geometry.index.count!==spec.sourceTriangles*3||data.length!==2)throw Error('Lion source geometry changed; regenerate LODs');
  data.forEach((part,i)=>{const l=spec.levels[i+1];if(part.index.length!==l.triangles*3||part.position.length!==l.vertices*3||part.normal.length!==l.vertices*3||part.uv.length!==l.vertices*2||part.index.some(n=>n>=l.vertices))throw Error('Invalid lion LOD geometry');});
  this.entry=entry;this.parent=parent;this.scale=mapUnitsPerMeter;this.batches=[base];this.nextUpdate=-Infinity;this.changes=0;
  this.matrices=base.placements.map((_,i)=>{const m=new THREE.Matrix4();base.mesh.getMatrixAt(i,m);return m;});
  // Stable full-detail emitter transforms: packed LOD instance slots must never
  // move or duplicate environment spill sources when the camera moves.
  base.mesh.userData.lanternEmitterMatrices=this.matrices;
  base.mesh.userData.festivalLod=0;base.mesh.userData.renderDynamic=true;
  for(let i=0;i<data.length;i++){
   const g=new THREE.BufferGeometry();for(const name of ['position','normal','uv'])g.setAttribute(name,new THREE.BufferAttribute(data[i][name],name==='uv'?2:3));
   g.setIndex(new THREE.BufferAttribute(data[i].index,1));g.boundingBox=geometry.boundingBox?.clone()||null;g.boundingSphere=geometry.boundingSphere?.clone()||null;
   entry.resources.add(g);
   const mesh=new THREE.InstancedMesh(g,base.mesh.material,base.placements.length);
   mesh.name=`festival-lion-lod${i+1}`;mesh.userData.festivalKind='lion';mesh.userData.festivalLod=i+1;mesh.userData.renderDynamic=true;mesh.count=0;mesh.visible=false;
   const batch={mesh,placements:base.placements};entry.batches.push(batch);this.batches.push(batch);parent.add(mesh);
  }
  this.levels=base.placements.map(()=>-1);this.cameraPosition=new THREE.Vector3();this.point=new THREE.Vector3();this.worldScale=new THREE.Vector3();
 }
 update(camera,time){
  if(!camera||time<this.nextUpdate)return;this.nextUpdate=time+.15;
  camera.getWorldPosition(this.cameraPosition);this.parent.updateWorldMatrix(true,false);this.parent.getWorldScale(this.worldScale);
  const parentScale=Math.max(...this.worldScale.toArray().map(Math.abs));let changed=false;
  this.batches[0].placements.forEach((p,i)=>{
   this.point.set(p.x,p.y+p.sizeMeters*this.scale*.35,p.z).applyMatrix4(this.parent.matrixWorld);
   const diameter=p.sizeMeters*this.scale*parentScale,distance=Math.max(.001,this.cameraPosition.distanceTo(this.point));
   const viewHeight=camera.isOrthographicCamera?(camera.top-camera.bottom)/camera.zoom:2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/camera.zoom;
   const next=selectLionLod(diameter/viewHeight,this.levels[i]);if(next!==this.levels[i]){this.levels[i]=next;changed=true;}
  });
  if(!changed)return;this.changes++;
  this.batches.forEach(({mesh},level)=>{
   let count=0;this.levels.forEach((selected,i)=>{if(selected===level)mesh.setMatrixAt(count++,this.matrices[i]);});
   mesh.count=count;mesh.visible=count>0&&mesh.userData.lanternModelVisible!==false;mesh.instanceMatrix.needsUpdate=true;
   if(count){mesh.computeBoundingBox();mesh.computeBoundingSphere();}
  });
 }
 get stats(){const counts=this.batches.map(b=>b.mesh.count);return {counts,triangles:counts.reduce((n,c,i)=>n+c*spec.levels[i].triangles,0),baselineTriangles:this.matrices.length*spec.sourceTriangles,changes:this.changes};}
}
