import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export function disposeGroup(group){const geometries=new Set(),materials=new Set(),skeletons=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.skeleton)skeletons.add(o.skeleton);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});group.clear();for(const g of geometries)g.dispose();for(const s of skeletons)s.dispose();for(const m of materials){m.map?.dispose();m.dispose();}}

const POSES={
 relaxed:{curl:[.18,.23,.28,.36],middle:.35,tip:.22,thumb:[-.28,-.8,.3]},
 bamboo:{curl:[.58,.68,.78,.88],middle:1.05,tip:.55,thumb:[-.62,.18,.68]},
 grip:{curl:[.82,.95,1.05,1.15],middle:1.18,tip:.62,thumb:[-.6,.35,.8]},
 brush:{curl:[.92,1.06,1.16,1.23],middle:1.32,tip:.65,thumb:[-.65,.5,.85]},
 pinch:{curl:[.38,.82,.96,1.1],middle:.95,tip:.55,thumb:[-.55,.48,.7]},
 press:{curl:[.06,.08,.11,.16],middle:.12,tip:.08,thumb:[-.12,-.7,.15]}
};

// Cross-sections give the palm and sleeve a broad, softly squared profile.
function profileGeometry(sections,sides=16){
 const positions=[],indices=[];
 for(const [z,width,depth,y=0] of sections)for(let i=0;i<sides;i++){
  const a=i/sides*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
  positions.push(Math.sign(c)*Math.pow(Math.abs(c),.78)*width,y+Math.sign(s)*Math.pow(Math.abs(s),.78)*depth,z);
 }
 for(let j=0;j<sections.length-1;j++)for(let i=0;i<sides;i++){const a=j*sides+i,b=j*sides+(i+1)%sides;indices.push(a,b,a+sides,b,b+sides,a+sides);}
 indices.push(...Array.from({length:sides-2},(_,i)=>[0,i+2,i+1]).flat());
 const last=(sections.length-1)*sides;for(let i=1;i<sides-1;i++)indices.push(last,last+i,last+i+1);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}

export function setHandPose(hand,pose='relaxed',amount=1){
 const rig=hand.handRig,p=POSES[pose];if(!rig||!p)return false;
 const t=THREE.MathUtils.clamp(Number.isFinite(amount)?amount:1,0,1);
 rig.fingers.forEach((finger,i)=>{finger[0].rotation.set(-p.curl[i]*t,0,rig.sign*(i-1.5)*.025);finger[1].rotation.x=-p.middle*t;finger[2].rotation.x=-p.tip*t;});
 rig.thumb[0].rotation.set(p.thumb[0]*t,rig.sign*p.thumb[1],rig.sign*.15);
 rig.thumb[1].rotation.x=-p.thumb[2]*t;rig.thumb[2].rotation.x=-p.thumb[2]*.65*t;
 hand.userData.pose=pose;hand.userData.poseAmount=t;return true;
}

// Local +Y is the back of the hand, -Z the fingertips, and +Z the sleeve.
export function makeHand(parent,left=false,pose='grip'){
 const hand=new THREE.Group();hand.name=left?'artisan-hand-left':'artisan-hand-right';parent.add(hand);
 const sign=left?1:-1,bones=[],skinParts=[],nailParts=[],fingers=[];
 function bone(name,parent,position){const b=new THREE.Bone();b.name=name;b.position.copy(position);parent.add(b);bones.push(b);return b;}
 const palm=bone('palm',hand,new THREE.Vector3());
 function weighted(g,index,offset=new THREE.Vector3()){
  g.translate(offset.x,offset.y,offset.z);const count=g.attributes.position.count,indices=new Uint16Array(count*4),weights=new Float32Array(count*4);
  for(let i=0;i<count;i++){indices[i*4]=index;weights[i*4]=1;}
  g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));return g;
 }
 skinParts.push(weighted(profileGeometry([[-.046,.045,.013],[-.027,.076,.030],[0,.088,.037],[.04,.086,.041],[.078,.073,.035],[.116,.053,.028],[.16,.046,.026]]),0));
 skinParts.push(weighted(new THREE.SphereGeometry(1,16,10).scale(.034,.031,.055),0,new THREE.Vector3(sign*.051,-.009,.062)));
 function digit(name,x,z,lengths,radius,isThumb=false){
  const root=bone(name+'-base',palm,new THREE.Vector3(x,isThumb?-.006:0,z));
  const mid=bone(name+'-middle',root,new THREE.Vector3(0,0,-lengths[0]));
  const tip=bone(name+'-tip',mid,new THREE.Vector3(0,0,-lengths[1]));
  const ids=[bones.indexOf(root),bones.indexOf(mid),bones.indexOf(tip)],joints=[lengths[0],lengths[0]+lengths[1]],total=lengths.reduce((a,b)=>a+b,0);
  const stops=[0,.014,joints[0]-.007,joints[0],joints[0]+.007,joints[1]-.006,joints[1],joints[1]+.006,total-.012,total-.007,total-.003,total].sort((a,b)=>a-b);
  const positions=[],indices=[],skinIndices=[],skinWeights=[],sides=12;
  for(const d of stops){
   const t=d/total,cap=d>total-.012?Math.sqrt(Math.max(.003,1-Math.pow((d-total+.012)/.012,2))):1;
   const r=radius*(1-.25*t)*cap;
   let a=d<joints[0]?0:d<joints[1]?1:2,b=a,mix=0;
   for(let j=0;j<2;j++)if(Math.abs(d-joints[j])<=.007){a=j;b=j+1;mix=THREE.MathUtils.clamp((d-joints[j]+.007)/.014,0,1);}
   for(let i=0;i<sides;i++){const angle=i/sides*Math.PI*2;positions.push(x+Math.cos(angle)*r,(isThumb?-.006:0)+Math.sin(angle)*r*.86,z-d);skinIndices.push(ids[a],ids[b],0,0);skinWeights.push(1-mix,mix,0,0);}
  }
  for(let j=0;j<stops.length-1;j++)for(let i=0;i<sides;i++){const a=j*sides+i,b=j*sides+(i+1)%sides;indices.push(a,a+sides,b,b,a+sides,b+sides);}
  const end=(stops.length-1)*sides;for(let i=1;i<sides-1;i++)indices.push(end,end+i+1,end+i);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(skinIndices,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(skinWeights,4));g.computeVertexNormals();skinParts.push(g);
  const nail=new THREE.SphereGeometry(1,12,8).scale(radius*.63,.0018,.010);
  nailParts.push(weighted(nail,ids[2],new THREE.Vector3(x,(isThumb?-.006:0)+radius*.70,z-total+.015)));
  return [root,mid,tip];
 }
 const specs=[['index',.060,-.019,[.045,.032,.024],.017],['middle',.021,-.032,[.049,.037,.028],.018],['ring',-.020,-.026,[.045,.035,.026],.0165],['little',-.057,-.010,[.034,.027,.021],.014]];
 for(const [name,x,z,lengths,r]of specs)fingers.push(digit(name,sign*x,z,lengths,r));
 const thumb=digit('thumb',sign*.073,.070,[.031,.027,.024],.020,true);
 hand.updateMatrixWorld(true);const skeleton=new THREE.Skeleton(bones);
 function skinned(parts,material){for(const p of parts)p.deleteAttribute('uv');const g=mergeGeometries(parts);for(const p of parts)p.dispose();const mesh=new THREE.SkinnedMesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;hand.add(mesh);mesh.bind(skeleton); // Animated fingertips can leave the rest-pose bounding sphere.
  mesh.frustumCulled=false;return mesh;}
 skinned(skinParts,new THREE.MeshStandardMaterial({color:'#cda787',roughness:.82}));
 skinned(nailParts,new THREE.MeshStandardMaterial({color:'#d9bcaa',roughness:.63}));
 function cloth(sections,color){const mesh=new THREE.Mesh(profileGeometry(sections),new THREE.MeshStandardMaterial({color,roughness:1}));mesh.castShadow=true;mesh.receiveShadow=true;hand.add(mesh);}
 cloth([[.18,.056,.037],[.205,.060,.041],[.25,.069,.049],[.32,.078,.056],[.38,.081,.058]],'#58634d');
 cloth([[.153,.048,.029],[.157,.057,.037],[.181,.059,.039],[.191,.055,.036]],'#73806a');
 hand.handRig={fingers,thumb,sign,skeleton};hand.userData.left=left;hand.userData.gripPoint=[sign*.025,-.027,-.052];
 setHandPose(hand,pose);return hand;
}

export function alignHandGrip(hand,point){
 const anchor=new THREE.Vector3(...hand.userData.gripPoint).multiply(hand.scale).applyQuaternion(hand.quaternion);hand.position.copy(point).sub(anchor);
}
export function clonePart(part,ghost=false){const clone=part.clone(true);clone.visible=true;clone.traverse(o=>{if(o.geometry)o.geometry=o.geometry.clone();if(o.material)o.material=ghost?new THREE.MeshBasicMaterial({color:'#d5dc9c',transparent:true,opacity:.35,depthWrite:false}):o.material.clone();});return clone;}
