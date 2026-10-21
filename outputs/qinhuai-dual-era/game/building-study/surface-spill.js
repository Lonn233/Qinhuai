import * as THREE from 'three';
import {SURFACE_ZONES} from './surface-spill-profiles.mjs';
import {collectWindowEmitters} from './window-emitters.js';
import {createDistributedSpill} from './distributed-spill.js';
import {buildingRegion} from './regions.mjs';
export {WORLD_PER_METRE} from './distributed-spill.js';
// Sample source surfaces once. Existing window masks reject opaque wall/frame areas.
export function collectSurfaceAnchors(root,manifest,fields=new Map(),masks=new Map(),building='matou'){
 const cells=Object.fromEntries(Object.keys(SURFACE_ZONES).map(k=>[k,new Map()]));root.updateMatrixWorld(true);
 const maskPixels=new Map();for(const [name,t] of masks){if(typeof document==='undefined'||!t.image)continue;try{const c=document.createElement('canvas');c.width=t.image.width;c.height=t.image.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(t.image,0,0);maskPixels.set(name,{data:ctx.getImageData(0,0,c.width,c.height).data,w:c.width,h:c.height,flip:t.flipY});}catch{/* Unreadable optional mask: use source geometry. */}}
 const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3(),p=new THREE.Vector3(),edge=new THREE.Vector3();
 function add(zone,position,normal,weight){const policy=building==='temple'?buildingRegion(position.x,position.z):'normal';if(policy==='unlit'||policy==='eave-only'&&zone!=='eave')return;const key=[Math.floor(position.x/.65),Math.floor(position.y/.5),Math.floor(position.z/.65),Math.round(normal.x*2),Math.round(normal.z*2)].join(':');let cell=cells[zone].get(key);if(!cell){cell={position:new THREE.Vector3(),normal:new THREE.Vector3(),weight:0};cells[zone].set(key,cell);}cell.position.addScaledVector(position,weight);cell.normal.addScaledVector(normal,weight);cell.weight+=weight;}
 root.traverse(mesh=>{if(!mesh.isMesh)return;const geometry=mesh.geometry,pos=geometry.attributes.position,uv=geometry.attributes.uv,index=geometry.index;if(!pos)return;const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material],groups=geometry.groups.length?geometry.groups:[{start:0,count:index?.count??pos.count,materialIndex:0}];const normalMatrix=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
 for(const group of groups){const material=mats[group.materialIndex||0],rule=manifest.rules.find(r=>r.node===mesh.name&&r.material===material?.name);if(!rule)continue;const role=rule.role,zone=role==='roof'?'roof':role==='window'?'window':role==='sign'?'sign':role==='trim'?'trim':'facade';const count=Math.min(group.count,(index?.count??pos.count)-group.start),stride=Math.max(1,Math.ceil(count/3/2000));const mask=maskPixels.get(rule.material),field=fields.get(mesh.name);
 for(let j=group.start;j<group.start+count-2;j+=3*stride){const ids=[0,1,2].map(k=>index?index.getX(j+k):j+k);a.fromBufferAttribute(pos,ids[0]).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(pos,ids[1]).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(pos,ids[2]).applyMatrix4(mesh.matrixWorld);n.subVectors(b,a).cross(edge.subVectors(c,a));const area=n.length()*.5;if(area<1e-7)continue;n.normalize();if(geometry.attributes.normal){edge.fromBufferAttribute(geometry.attributes.normal,ids[0]).applyMatrix3(normalMatrix).normalize();if(n.dot(edge)<0)n.negate();}if(zone!=='roof'&&Math.abs(n.y)>.55)continue;
 if(mask&&uv){let u=0,v=0;for(const i of ids){u+=uv.getX(i)/3;v+=uv.getY(i)/3;}u=((u%1)+1)%1;v=((v%1)+1)%1;if(mask.flip)v=1-v;const at=(Math.min(mask.h-1,Math.floor(v*mask.h))*mask.w+Math.min(mask.w-1,Math.floor(u*mask.w)))*4;if(mask.data[at]<80)continue;}
 p.copy(a).add(b).add(c).multiplyScalar(1/3);const horizontal=new THREE.Vector3(n.x,0,n.z);if(horizontal.lengthSq()<.02){const mid=rule.bounds?new THREE.Vector3(...rule.bounds.min).add(new THREE.Vector3(...rule.bounds.max)).multiplyScalar(.5):new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());horizontal.copy(p).sub(mid);horizontal.y=0;}if(horizontal.lengthSq()<.001)horizontal.set(0,0,1);horizontal.normalize();
 if(zone==='roof'){if(n.y>.15)add('roof',p,horizontal,area);let signal=0;if(field){const xyz=['x','y','z'].map((k,i)=>Math.max(0,Math.min(field.info.size[i]-1,Math.round((p[k]-field.info.min[i])/(field.info.max[i]-field.info.min[i])*(field.info.size[i]-1)))));signal=field.texture.image.data[((xyz[2]*field.info.size[1]+xyz[1])*field.info.size[0]+xyz[0])*(field.info.channels??1)]/255;}if(signal>.12&&(!rule.bounds||p.y<rule.bounds.min[1]+(rule.bounds.max[1]-rule.bounds.min[1])*.8))add('eave',p,horizontal,area*signal);}
 else add(zone,p,horizontal,area);
 }
 }});
 return Object.fromEntries(Object.entries(cells).map(([k,map])=>[k,[...map.values()].map(v=>({position:v.position.divideScalar(v.weight),normal:v.normal.normalize(),weight:v.weight}))]));
}
export function createSurfaceSpill(scene,root,floor,renderer,manifest,fields,masks,building){
 const anchors=collectSurfaceAnchors(root,manifest,fields,masks,building);
 anchors.window=collectWindowEmitters(root,manifest,masks,p=>building!=='temple'||buildingRegion(p.x,p.z)==='normal');
 return createDistributedSpill(scene,root,floor,renderer,anchors);
}
