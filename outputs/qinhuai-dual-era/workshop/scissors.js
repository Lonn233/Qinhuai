import * as THREE from 'three';
// Two pivoting forged-steel blades, beveled edges, oval finger loops and a rivet.
// Local +Y is the cutting direction; the pivot is the tracking point on the paper.
export function makeScissors(){
 const root=new THREE.Group();root.name='craft-scissors';
 const steel=new THREE.MeshStandardMaterial({color:'#c4ccd0',metalness:.82,roughness:.27});
 const edge=new THREE.MeshStandardMaterial({color:'#eef1ec',metalness:.9,roughness:.19});
 const handle=new THREE.MeshStandardMaterial({color:'#554635',metalness:.58,roughness:.38});
 const brass=new THREE.MeshStandardMaterial({color:'#b29a64',metalness:.7,roughness:.34});
 const arms=[];
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.z=side*.004;root.add(arm);arms.push(arm);
  const shape=new THREE.Shape();shape.moveTo(-.012,-.046);shape.lineTo(.016,.007);shape.lineTo(.008,.17);shape.quadraticCurveTo(.002,.19,-.004,.195);shape.lineTo(-.012,.025);shape.closePath();
  const blade=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.005,bevelEnabled:true,bevelSize:.0015,bevelThickness:.001,bevelSegments:2,steps:1}),steel);blade.scale.x=side;blade.castShadow=true;arm.add(blade);
  const bevel=new THREE.Mesh(new THREE.BoxGeometry(.002,.155,.001),edge);bevel.position.set(-.009*side,.095,.007);arm.add(bevel);
  const neck=new THREE.Mesh(new THREE.BoxGeometry(.014,.075,.009),handle);neck.position.set(side*.021,-.049,0);neck.rotation.z=side*.38;arm.add(neck);
  const loop=new THREE.Mesh(new THREE.TorusGeometry(.036,.006,10,40),handle);loop.scale.set(1,1.3,1);loop.position.set(side*.04,-.118,0);arm.add(loop);
 }
 const pivot=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.021,24),brass);pivot.rotation.x=Math.PI/2;root.add(pivot);
 const screw=new THREE.Mesh(new THREE.BoxGeometry(.016,.002,.002),handle);screw.position.z=.012;root.add(screw);
 root.userData.setOpening=amount=>{arms.forEach((arm,i)=>arm.rotation.z=(i?1:-1)*(.04+amount*.28));};
 root.userData.setOpening(.65);return root;
}
