import * as THREE from 'three';
import {clamp,cutOutline} from './paper-process.mjs';
// The exact same per-vertex dye profile is used in the bath, rack and press.
export function colorPaper(geometry,{leaf=false,dose=.8,depth=.8}={}){
 const p=geometry.attributes.position,uv=geometry.attributes.uv,colors=new Float32Array(p.count*3);
 const raw=new THREE.Color('#f5efe4'),pigment=new THREE.Color(leaf?'#397444':'#ab326d');
 for(let i=0;i<p.count;i++){
  const t=uv?uv.getY(i):(p.getY(i)+.36)/.72;
  const wet=clamp((depth-t)/.20),tone=clamp(dose/.9)*wet*(.38+.62*Math.pow(1-t,1.15));
  const color=raw.clone().lerp(pigment,tone);colors.set([color.r,color.g,color.b],i*3);
 }
 geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
}
export function makePaper(profile={},shape='square',size=.72){
 let geometry;
 if(shape==='square')geometry=new THREE.PlaneGeometry(size,size,28,36);
 else {const points=cutOutline(shape),outline=new THREE.Shape(points.map(p=>new THREE.Vector2(p.x,p.y)));geometry=new THREE.ShapeGeometry(outline,32);const p=geometry.attributes.position,uv=[];for(let i=0;i<p.count;i++)uv.push((p.getX(i)+.36)/.72,(p.getY(i)+.36)/.72);geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));}
 colorPaper(geometry,profile);
 const paper=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.94}));paper.castShadow=true;paper.receiveShadow=true;return paper;
}
export function addVeins(paper,leaf=false,square=false){
 const group=new THREE.Group();group.name=square?'square-embossed-veins':'cut-paper-veins';paper.add(group);
 for(let i=-4;i<=4;i++){
  const points=Array.from({length:28},(_,j)=>{const t=j/27;return new THREE.Vector3(square?i*.068+.012*Math.sin(Math.PI*t):i*.032*Math.sin(Math.PI*t),square?-.345+.69*t:-.30+.60*t,.0025);});
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:leaf?'#56724c':'#975a79',transparent:true,opacity:.58}));group.add(line);
 }return group;
}
export function makePress(){
 const root=new THREE.Group(),rollers=[];
 const wood=new THREE.MeshStandardMaterial({color:'#715237',roughness:.9}),metal=new THREE.MeshStandardMaterial({color:'#ada58b',metalness:.5,roughness:.42});
 function box(w,h,d,x,y,z,material=wood){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);root.add(m);m.castShadow=true;return m;}
 box(.78,.055,.55,0,.028,0);for(const x of [-.34,.34])box(.07,.48,.16,x,.26,0);
 for(const y of [.22,.40]){const pivot=new THREE.Group();pivot.position.y=y;root.add(pivot);const roll=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.62,36),metal);roll.rotation.z=Math.PI/2;pivot.add(roll);const stripe=box(.61,.006,.008,0,0,0);root.remove(stripe);pivot.add(stripe);stripe.position.set(0,.09,0);rollers.push(pivot);}
 const points=Array.from({length:601},(_,i)=>{const t=i/600,a=t*Math.PI*28;return new THREE.Vector3(-.29+t*.58,Math.cos(a)*.095,Math.sin(a)*.095);});
 const winding=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#e7d3a6'}));root.add(winding);winding.position.y=.40;winding.geometry.setDrawRange(0,0);
 const supply=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.30,.40,.095),new THREE.Vector3(-.30,.08,.48)]),new THREE.LineBasicMaterial({color:'#e7d3a6'}));root.add(supply);
 root.userData.machine=true;
 return {root,rollers,winding,supply,update(t,rotation){rollers[0].rotation.x=rotation;rollers[1].rotation.x=-rotation;winding.rotation.x=-rotation;winding.geometry.setDrawRange(0,Math.floor(t*601));const p=supply.geometry.attributes.position;p.setXYZ(1,-.30,.40-.32*(1-t),.095+.385*(1-t));p.needsUpdate=true;supply.visible=t<1;}};
}
