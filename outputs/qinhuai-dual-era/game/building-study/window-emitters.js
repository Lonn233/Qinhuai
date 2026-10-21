import * as THREE from 'three';
import {windowFloorForRule} from './window-light.mjs';

// Find window panels, not individual holes in the decorative lattice. Several
// facade strips reuse one UV tile: a triangle centroid misses almost all repeats.
export function maskPanels(image) {
 if (!image?.data) return [{u0:0,u1:1,v0:0,v1:1}];
 const {data,width:w,height:h}=image,channels=data.length/(w*h),columns=new Float32Array(w);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)columns[x]+=data[(y*w+x)*channels]/255;
 const threshold=Math.max(...columns)*.10,active=Array.from(columns,v=>v>threshold);
 // Close small decorative gaps but keep the broad posts between window panels.
 for(let x=0;x<w;){if(active[x]){x++;continue;}const start=x;while(x<w&&!active[x])x++;if(start>0&&x<w&&x-start<w*.06)for(let i=start;i<x;i++)active[i]=true;}
 const panels=[];
 for(let x=0;x<w;){if(!active[x]){x++;continue;}const start=x;while(x<w&&active[x])x++;if(x-start<w*.06)continue;let y0=h,y1=0;for(let y=0;y<h;y++){let lit=0;for(let xx=start;xx<x;xx++)if(data[(y*w+xx)*channels]>40)lit++;if(lit>(x-start)*.08){y0=Math.min(y0,y);y1=Math.max(y1,y);}}if(y1>=y0)panels.push({u0:start/w,u1:x/w,v0:y0/h,v1:(y1+1)/h});}
 return panels.length?panels:[{u0:0,u1:1,v0:0,v1:1}];
}
function pixels(texture){
 if(texture?.image?.data)return texture.image;
 if(typeof document==='undefined'||!texture?.image)return null;
 const c=document.createElement('canvas');c.width=texture.image.width;c.height=texture.image.height;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(texture.image,0,0);return ctx.getImageData(0,0,c.width,c.height);
}
function clip(poly,axis,bound,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],insideA=greater?a[axis]>=bound:a[axis]<=bound,insideB=greater?b[axis]>=bound:b[axis]<=bound;if(insideA)out.push(a);if(insideA!==insideB){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push({u:a.u+(b.u-a.u)*t,v:a.v+(b.v-a.v)*t,p:a.p.clone().lerp(b.p,t)});}}return out;}
export function collectWindowEmitters(root,manifest,masks=new Map(),allowed=()=>true){
 root.updateMatrixWorld(true);const panels=new Map(),cells=new Map();
 for(const [name,texture]of masks){let image;try{image=pixels(texture);}catch{}const rows=maskPanels(image);if(texture.flipY)for(const p of rows)[p.v0,p.v1]=[1-p.v1,1-p.v0];panels.set(name,rows);}
 root.traverse(mesh=>{if(!mesh.isMesh)return;const g=mesh.geometry,pos=g.attributes.position,uv=g.attributes.uv,normal=g.attributes.normal,index=g.index;if(!pos)return;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material],normalMatrix=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
 for(const group of g.groups.length?g.groups:[{start:0,count:index?.count??pos.count,materialIndex:0}]){
  const material=materials[group.materialIndex||0],rule=manifest.rules.find(r=>r.node===mesh.name&&r.material===material?.name&&r.role==='window');if(!rule)continue;
  for(let j=group.start;j<Math.min(group.start+group.count,index?.count??pos.count)-2;j+=3){const ids=[0,1,2].map(k=>index?index.getX(j+k):j+k),points=ids.map(i=>new THREE.Vector3().fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld)),n=points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).normalize();if(normal&&n.dot(new THREE.Vector3().fromBufferAttribute(normal,ids[0]).applyMatrix3(normalMatrix))<0)n.negate();if(Math.abs(n.y)>.55)continue;
   const triangle=points.map((p,k)=>({p,u:uv?uv.getX(ids[k]):[0,1,0][k],v:uv?uv.getY(ids[k]):[0,0,1][k]})),minU=Math.floor(Math.min(...triangle.map(v=>v.u))),maxU=Math.ceil(Math.max(...triangle.map(v=>v.u))),minV=Math.floor(Math.min(...triangle.map(v=>v.v))),maxV=Math.ceil(Math.max(...triangle.map(v=>v.v)));
   for(let u=minU;u<maxU;u++)for(let v=minV;v<maxV;v++)for(const [panelIndex,panel]of (panels.get(rule.material)||[{u0:0,u1:1,v0:0,v1:1}]).entries()){
    let poly=clip(triangle,'u',u+panel.u0,true);poly=clip(poly,'u',u+panel.u1,false);poly=clip(poly,'v',v+panel.v0,true);poly=clip(poly,'v',v+panel.v1,false);if(poly.length<3)continue;
    const center=new THREE.Vector3();let area=0;for(let k=1;k<poly.length-1;k++){const a=poly[0].p,b=poly[k].p,c=poly[k+1].p,w=b.clone().sub(a).cross(c.clone().sub(a)).length()*.5;center.addScaledVector(a.clone().add(b).add(c).multiplyScalar(1/3),w);area+=w;}if(area<1e-6)continue;center.divideScalar(area);if(!allowed(center))continue;
    // Coplanar triangles of a repeated panel merge. Opposite facades and floors
    // never merge even if their UVs repeat identically.
    const [t0,t1,t2]=triangle,du1=t1.u-t0.u,dv1=t1.v-t0.v,du2=t2.u-t0.u,dv2=t2.v-t0.v,det=du1*dv2-du2*dv1;let tileCenter=center;if(Math.abs(det)>1e-9){const e1=points[1].clone().sub(points[0]),e2=points[2].clone().sub(points[0]),dpdu=e1.clone().multiplyScalar(dv2).addScaledVector(e2,-dv1).divideScalar(det),dpdv=e2.clone().multiplyScalar(du1).addScaledVector(e1,-du2).divideScalar(det);tileCenter=points[0].clone().addScaledVector(dpdu,u+(panel.u0+panel.u1)/2-t0.u).addScaledVector(dpdv,v+(panel.v0+panel.v1)/2-t0.v);}const key=[mesh.name,...n.toArray().map(x=>Math.round(x*100)),...tileCenter.toArray().map(x=>Math.round(x*100)),panelIndex].join(':');let cell=cells.get(key);if(!cell){cell={position:new THREE.Vector3(),normal:n.clone(),weight:0,panel:key,floor:windowFloorForRule(rule,manifest)};cells.set(key,cell);}cell.position.addScaledVector(center,area);cell.weight+=area;
   }
  }
 }
 });
 return [...cells.values()].map(c=>({...c,position:c.position.divideScalar(c.weight)}));
}
