import * as THREE from 'three';
import {makePaper,addVeins} from './paper-visuals.js';
import {clamp} from './paper-process.mjs';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};

export function makeManualPress(profile){
 const root=new THREE.Group();root.name='manual-press-tool';root.position.set(3.20,1.045,1.48);
 const wood=new THREE.MeshStandardMaterial({color:'#715237',roughness:.86});
 const endWood=new THREE.MeshStandardMaterial({color:'#bc9560',roughness:.8});
 const brass=new THREE.MeshStandardMaterial({color:'#ada58b',metalness:.5,roughness:.42});
 const cotton=new THREE.LineBasicMaterial({color:'#f7e7bf'});
 function mesh(g,m,p,parent=root){const o=new THREE.Mesh(g,m);o.position.copy(p);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 // This is the removable tool's foot, not a replacement workstation/platform.
 mesh(new THREE.BoxGeometry(.49,.045,.48),wood,V(0,.023,0));
 const rig=new THREE.Group();rig.name='manual-mold';root.add(rig);
 const lower=mesh(new THREE.CylinderGeometry(.205,.205,.065,40),endWood,V(0,-.30,0),rig);
 const cap=mesh(new THREE.CylinderGeometry(.205,.205,.065,40),endWood,V(0,.30,0),rig);
 const halves=[];
 for(const side of [-1,1]){
  const half=new THREE.Group();rig.add(half);halves.push(half);
  const shell=mesh(new THREE.CylinderGeometry(.144,.144,.53,40,1,false,side<0?Math.PI:0,Math.PI),wood,V(),half);
  for(let i=0;i<9;i++){const a=(i/8)*Math.PI+(side<0?Math.PI:0);mesh(new THREE.CylinderGeometry(.002,.002,.51,6),brass,V(Math.sin(a)*.146,0,Math.cos(a)*.146),half);}
 }
 const locks=[];
 for(const y of [-.255,.255]){const lock=mesh(new THREE.TorusGeometry(.16,.009,8,40),brass,V(0,y,0),rig);lock.rotation.x=Math.PI/2;locks.push(lock);}
 const points=Array.from({length:901},(_,i)=>{const t=i/900,a=t*Math.PI*32;return V(Math.sin(a)*.163,-.25+t*.50,-Math.cos(a)*.163);});
 const thread=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),cotton);thread.name='manual-cotton-winding';rig.add(thread);
 const spool=new THREE.Group();spool.name='manual-cotton-spool';spool.position.set(-.42,.09,.23);root.add(spool);
 mesh(new THREE.CylinderGeometry(.052,.052,.14,20),endWood,V(),spool);
 mesh(new THREE.CylinderGeometry(.066,.066,.095,24),new THREE.MeshStandardMaterial({color:'#e8d9b6',roughness:1}),V(),spool);
 for(const y of [-.07,.07])mesh(new THREE.CylinderGeometry(.09,.09,.018,24),wood,V(0,y,0),spool);
 const supply=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(),V()]),cotton);root.add(supply);
 const hammer=new THREE.Group();hammer.name='manual-hammer';root.add(hammer);
 mesh(new THREE.CylinderGeometry(.018,.022,.39,12),wood,V(0,-.15,0),hammer);
 mesh(new THREE.BoxGeometry(.24,.11,.12),brass,V(),hammer);
 const paper=makePaper(profile);paper.scale.setScalar(.72);root.add(paper);
 paper.rotation.x=-Math.PI/2;paper.position.set(.81,.014,.26);
 const base=paper.geometry.attributes.position.array.slice(),veins=addVeins(paper,profile.leaf,true);veins.visible=false;
 const start=V(.81,.014,.26),finish=V(.81,.014,.26),target=V();
 function update(p){
  const phases=['idle','loading','winding','wrapped','standing','hammering','compressed','restoring','restored','unthreading','unthreaded','extracting','done','collected'];
  const n=['loaded','fitting'].includes(p.phase)?2:phases.indexOf(p.phase),stand=n<4?0:n===4?smooth(p.elapsed/1.05):1,opening=n<11?0:n===11?smooth(p.elapsed/1.1):1,restore=n<7?0:n===7?smooth(p.elapsed):1,compression=p.compression*(1-restore),unwind=n<9?0:n===9?smooth(p.elapsed/1.1):1;
  rig.rotation.set((1-stand)*Math.PI/2,Math.PI*stand,0);rig.position.set(0,.19+stand*.19,0);
  // The mold stays whole: hammer it shorter, then pull it vertically back up.
  rig.scale.y=1-.32*compression;rig.position.y=.19+stand*.19-.30*.32*compression;
  cap.position.y=.30;lower.position.y=-.30;
  halves.forEach(h=>{h.position.x=0;});
  locks.forEach((l,i)=>{l.scale.setScalar(1);l.position.y=(i?1:-1)*.255;});
  thread.geometry.setDrawRange(0,Math.max(0,Math.floor(901*p.winding*(1-unwind))));thread.visible=unwind<1;
  rig.updateMatrixWorld(true);root.updateMatrixWorld(true);
  const end=points[Math.min(900,Math.floor(900*p.winding*(1-unwind)))].clone();rig.localToWorld(end);root.worldToLocal(end);
  const attr=supply.geometry.attributes.position;attr.setXYZ(0,-.42,.15,.23);attr.setXYZ(1,end.x,end.y,end.z);attr.needsUpdate=true;supply.geometry.computeBoundingSphere();supply.visible=['winding','unthreading'].includes(p.phase);
  hammer.visible=true;
  if(n>=5&&n<=6){const swing=p.strike>0?Math.sin((.52-p.strike)/.52*Math.PI):0;hammer.position.set(0,.87-swing*.14-.075*p.compression,0);hammer.rotation.set(0,0,Math.PI/2+.20-swing*.20);}
  else{hammer.position.set(.43,.07,-.30);hammer.rotation.set(Math.PI/2,0,-.65);}
  const attrP=paper.geometry.attributes.position;
  if(n===0){start.copy(paper.position);}
  else if(n===1){rig.localToWorld(target.set(0,0,-.165));root.worldToLocal(target);paper.rotation.set(-Math.PI/2,0,0);paper.position.lerpVectors(start,target,smooth(p.elapsed/.85));}
  else if(n<11){
   paper.position.copy(rig.position);paper.quaternion.copy(rig.quaternion);
   for(let i=0;i<attrP.count;i++){const x=base[i*3],y=base[i*3+1],a=x*.72/.157,wrap=smooth(p.adherence);attrP.setXYZ(i,THREE.MathUtils.lerp(x,Math.sin(a)*.157/.72,wrap),y*(1-.32*compression),THREE.MathUtils.lerp(-.165/.72,-Math.cos(a)*.157/.72,wrap));}
  }else{
   paper.quaternion.slerpQuaternions(rig.quaternion,new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0)),opening);
   paper.position.lerpVectors(rig.position,finish,opening);paper.position.y+=Math.sin(opening*Math.PI)*.28;
   for(let i=0;i<attrP.count;i++){const x=base[i*3],y=base[i*3+1],a=x*.72/.157;attrP.setXYZ(i,THREE.MathUtils.lerp(Math.sin(a)*.157/.72,x,opening),y,THREE.MathUtils.lerp(-Math.cos(a)*.157/.72,0,opening));}
  }
  attrP.needsUpdate=true;paper.geometry.computeVertexNormals();paper.geometry.computeBoundingSphere();veins.visible=n>=12;
 }
 function moldTarget(){return root.localToWorld(V(0,.34,0));}
 return {root,paper,update,moldTarget};
}
