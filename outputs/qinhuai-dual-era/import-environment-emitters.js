import {hasWindowFloors,windowFloorAt,setWindowFloorSplit,WINDOW_FLOOR_BUILDINGS} from './import-window-floors.mjs';
import * as THREE from 'three';

// Project actual low window / lit facade surfaces onto the existing pavement.
// These are analytic irradiance strips, never visible cards or extra shadow lights.
export function fallbackEnvironmentEmitters(rect){
 const [x0,z0,x1,z1]=rect,ix=Math.min(.65,(x1-x0)*.12),iz=Math.min(.65,(z1-z0)*.12);
 return [
  {x:(x0+x1)/2,z:z0+iz,nx:0,nz:-1,halfWidth:(x1-x0)/2-ix},
  {x:(x0+x1)/2,z:z1-iz,nx:0,nz:1,halfWidth:(x1-x0)/2-ix},
  {x:x0+ix,z:(z0+z1)/2,nx:-1,nz:0,halfWidth:(z1-z0)/2-iz},
  {x:x1-ix,z:(z0+z1)/2,nx:1,nz:0,halfWidth:(z1-z0)/2-iz},
 ];
}
export function environmentEmitterWeight(x,z,e,p,spreadScale=1){
 if(!(p.distance>0)||!(p.decayDistance>0))return 0;
 const dx=x-e.x,dz=z-e.z,forward=dx*e.nx+dz*e.nz;
 // Small inward feather prevents a dark seam at the wall base, not a roof moat.
 if(forward<-.25||forward>=p.distance)return 0;
 const d=Math.max(0,forward),side=Math.abs(dx*(-e.nz)+dz*e.nx);
 const spread=.35+d*(p.angle===undefined?.32:spreadScale*Math.tan(p.angle*Math.PI/360)),edge=Math.max(0,side-e.halfWidth);
 if(edge>spread*2.5)return 0;
 const f=Math.max(.02,p.feather),t=Math.max(0,Math.min(1,(d/p.distance-(1-f))/f));
 const wall=Math.max(0,Math.min(1,(forward+.25)/.25));
 return wall*Math.exp(-d/p.decayDistance)*Math.exp(-2*(edge/spread)**2)*(1-t*t*(3-2*t));
}

export function collectWindowEmitters(object,tile,buildings){
 const strips=new Map(),triangles=[],a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3(),v=new THREE.Vector3();
 const normalMatrix=new THREE.Matrix3();
 object.updateWorldMatrix(true,true);
 object.traverse(mesh=>{
  if(!mesh.isMesh)return;
  const rules=(tile?.materials||[]).filter(r=>r.node===mesh.name&&(/window/i.test(r.role)||r.role==='templeFacade'));
  if(!rules.length)return;
  const candidates=buildings.filter(s=>s.nodes?.includes(mesh.name));if(!candidates.length)return;
  const g=mesh.geometry,pos=g.attributes.position,norm=g.attributes.normal,index=g.index;
  if(!pos)return;
  normalMatrix.getNormalMatrix(mesh.matrixWorld);
  const count=index?index.count:pos.count,step=3;
  for(let k=0;k+2<count;k+=step){
   const ids=[0,1,2].map(j=>index?index.getX(k+j):k+j);
   a.fromBufferAttribute(pos,ids[0]).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(pos,ids[1]).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(pos,ids[2]).applyMatrix4(mesh.matrixWorld);
   v.copy(a).add(b).add(c).multiplyScalar(1/3);

   if(norm)n.fromBufferAttribute(norm,ids[0]).applyNormalMatrix(normalMatrix);else n.subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).normalize();
   if(Math.abs(n.y)>.35)continue;
   const group=g.groups.find(group=>k>=group.start&&k<group.start+group.count);
   const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material],mat=mats[group?.materialIndex||0];
   const rule=rules.find(r=>r.material===undefined||mat?.name.includes(r.material));if(!rule)continue;
   const window=rule.role==='window';if(!window&&(v.y<11.95||v.y>15.5))continue;
   const distance=s=>{const r=s.rect;return Math.hypot(Math.max(r[0]-v.x,0,v.x-r[2]),Math.max(r[1]-v.z,0,v.z-r[3]))+Math.hypot(v.x-(r[0]+r[2])/2,v.z-(r[1]+r[3])/2)*.025;};
   const source=candidates.reduce((best,s)=>!best||distance(s)<distance(best)?s:best,null);
   if(distance(source)>1.8&&!hasWindowFloors(source.id))continue;
   const angle=Math.round(Math.atan2(n.z,n.x)/(Math.PI/24))*Math.PI/24,nx=Math.cos(angle),nz=Math.sin(angle),tx=-nz,tz=nx;
   const plane=v.x*nx+v.z*nz,mid=v.x*tx+v.z*tz;
   const projections=[a,b,c].map(p=>p.x*tx+p.z*tz),lo=Math.min(...projections),hi=Math.max(...projections);
   if(hi-lo<.035)continue;
   triangles.push({source,node:mesh.name,window,y:v.y,y0:Math.min(a.y,b.y,c.y),y1:Math.max(a.y,b.y,c.y),nx,nz,angle,plane,lo,hi});
  }
 });
 // Find gaps between actual window rows; never cut through a row when a gap exists.
 // Existing 0751/0780 presets retain their audited per-node boundaries.
 for(const source of buildings){
  if(WINDOW_FLOOR_BUILDINGS.has(source.id))continue;
  const rows=triangles.filter(t=>t.source.id===source.id&&t.window),merged=[];
  for(const t of rows.slice().sort((a,b)=>a.y0-b.y0)){const last=merged.at(-1);if(last&&t.y0<=last[1]+.08)last[1]=Math.max(last[1],t.y1);else merged.push([t.y0,t.y1]);}
  if(!merged.length)continue;
  const gap=merged.findIndex((r,i)=>i>0&&r[0]-merged[i-1][1]>.15);
  const split=gap>0?(merged[gap-1][1]+merged[gap][0])/2:13.3;
  for(const node of new Set(rows.map(t=>t.node)))setWindowFloorSplit(node,split);
 }
 for(const t of triangles){
   const {source,node,window,y,nx,nz,angle,plane,lo,hi}=t;
   const floor=window&&hasWindowFloors(source.id)?windowFloorAt(node,y):null;
   const key=(floor?node+'|'+floor+'|':'')+source.id+'|'+angle.toFixed(3)+'|'+Math.round(plane/.2);
   if(!strips.has(key))strips.set(key,{id:source.id,node,floor,y,nx,nz,plane,intervals:[]});
   strips.get(key).intervals.push([lo,hi]);
  }
 const out=new Map();
 for(const strip of strips.values()){
  const merged=[];for(const interval of strip.intervals.sort((a,b)=>a[0]-b[0])){const last=merged.at(-1);if(last&&interval[0]<=last[1]+.35)last[1]=Math.max(last[1],interval[1]);else merged.push([...interval]);}
  for(const [lo,hi] of merged){const m=(lo+hi)/2,e={node:strip.node,floor:strip.floor,y:strip.y,x:strip.nx*strip.plane-strip.nz*m,z:strip.nz*strip.plane+strip.nx*m,nx:strip.nx,nz:strip.nz,halfWidth:Math.max(.15,(hi-lo)/2)};if(!out.has(strip.id))out.set(strip.id,[]);out.get(strip.id).push(e);}
 }
 return out;
}
