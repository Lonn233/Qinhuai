import * as THREE from 'three';
import {TOWER0369_ROOFS} from './import-tower0369-config.mjs';

// Measured source-world mounts; leave the source geometry and daytime untouched.
export function createTower0369Fixtures(fixtures){
 const eaveSegments=fixtures.filter(f=>TOWER0369_ROOFS.has(f.node)).flatMap(f=>Array.from({length:f.segments.length/6},(_,i)=>f.segments.slice(i*6,i*6+6)));
 const lower=eaveSegments.flatMap(s=>[s.slice(0,3),s.slice(3)]).filter(p=>Math.abs(p[1]-13.5194)<.002);
 const unique=[...new Map(lower.map(p=>[p.join(','),p])).values()];
 const lanternMounts=unique.map(([x,y,z])=>[-12.72+(x+12.72)*.87,y-.12,-17.21+(z+17.21)*.87]);
 const layout={eaves:eaveSegments,lanternMounts};
 const root=new THREE.Group();root.name='0369 / 金檐与红灯笼';
 const tube=new THREE.CylinderGeometry(1,1,1,6,1,true);
 const globe=new THREE.SphereGeometry(1,16,10);
 const materials=[],geometries=[tube,globe],meshes=[];
 const matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
 const position=new THREE.Vector3(),scale=new THREE.Vector3(),direction=new THREE.Vector3();
 function batch(name,geometry,count,color,kind){
  const material=new THREE.MeshBasicMaterial({color,fog:true});materials.push(material);
  const mesh=new THREE.InstancedMesh(geometry,material,count);mesh.name=name;
  mesh.userData.nightFixture=true;mesh.userData.nightFixtureKind='tower0369';mesh.userData.towerPart=kind;
  root.add(mesh);meshes.push(mesh);return mesh;
 }
 function set(mesh,index,center,size,q=new THREE.Quaternion()){
  position.fromArray(center);scale.fromArray(size);matrix.compose(position,q,scale);mesh.setMatrixAt(index,matrix);
 }
 const eaves=batch('0369·细金檐',tube,layout.eaves.length,0xffbe48,'eaves');
 for(const [i,s] of layout.eaves.entries()){
  const a=new THREE.Vector3(...s.slice(0,3)),b=new THREE.Vector3(...s.slice(3));
  direction.subVectors(b,a);rotation.setFromUnitVectors(up,direction.clone().normalize());
  set(eaves,i,a.add(b).multiplyScalar(.5).add(new THREE.Vector3(0,.012,0)).toArray(),[.008,direction.length()+.006,.008],rotation);
 }
 const count=layout.lanternMounts.length;
 const bodies=batch('0369·红灯笼',globe,count,0xdd160b,'red');
 const caps=batch('0369·灯笼金盖',tube,count*2,0xd98423,'gold');
 const stems=batch('0369·吊线',tube,count,0x7c3517,'cord');
 const tassels=batch('0369·灯穗',tube,count,0xc4200b,'red');
 for(const [i,[x,y,z]] of layout.lanternMounts.entries()){
  set(bodies,i,[x,y-.13,z],[.115,.14,.115]);
  set(caps,i*2,[x,y-.005,z],[.052,.026,.052]);
  set(caps,i*2+1,[x,y-.26,z],[.044,.024,.044]);
  set(stems,i,[x,y+.095,z],[.006,.18,.006]);
  set(tassels,i,[x,y-.325,z],[.014,.11,.014]);
 }
 for(const mesh of meshes){mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}
 const eaveMatrices=Array.from({length:eaves.count},(_,i)=>{
  const initial=new THREE.Matrix4();eaves.getMatrixAt(i,initial);return initial;
 });
 return {root,apply(settings,{eaveWidth=1}={}){
  // Use the current material: per-building controls clone it during attachment.
  eaves.material.color.set(settings.color).multiplyScalar(settings.brightness*settings.eave*.8);
  eaves.scale.set(1,1,1);
  for(let i=0;i<layout.eaves.length;i++){
   eaveMatrices[i].decompose(position,rotation,scale);
   scale.x=scale.z=.008*eaveWidth;matrix.compose(position,rotation,scale);eaves.setMatrixAt(i,matrix);
  }
  eaves.instanceMatrix.needsUpdate=true;eaves.computeBoundingSphere();
  for(const mesh of meshes.slice(1)){
   const color=mesh.userData.towerPart==='red'?0xdd160b:mesh.userData.towerPart==='gold'?0xd98423:0x7c3517;
   mesh.material.color.setHex(color).multiplyScalar(settings.brightness);
  }
 },dispose(){for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();}};
}
