import * as THREE from 'three';

// A shared, quiet festival setting keeps all five lighting comparisons consistent.
export function createSurroundings(scene) {
 const group=new THREE.Group();group.name='Lion_study_festival_surroundings';scene.add(group);
 let target=group;const zones={};
 const zone=name=>{target=new THREE.Group();target.name=name;zones[name]=target;group.add(target);};
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.9,...extra});
 const wood=mat(0x433027),trim=mat(0x80513c),stone=mat(0x626867),roof=mat(0x253a3b),wall=mat(0x8d958d),cloth=mat(0x713f32);
 const warm=mat(0xe4b267,{emissive:0xe9a85d,emissiveIntensity:.34});
 const red=mat(0xc45c36,{emissive:0xd67b39,emissiveIntensity:.25});
 const add=(geo,material,x,y,z,parent=target)=>{const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);parent.add(o);return o;};
 const box=(material,x,y,z,w,h,d,parent=target)=>add(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);
 const cylinder=(material,x,y,z,r,h,parent=target)=>add(new THREE.CylinderGeometry(r,r,h,12),material,x,y,z,parent);
 // Offset stone joints and quiet colour variation make the light falloff readable.
 const paving=document.createElement('canvas');paving.width=paving.height=512;const ctx=paving.getContext('2d');ctx.fillStyle='#252d2d';ctx.fillRect(0,0,512,512);
 for(let row=0;row<8;row++)for(let col=-1;col<5;col++){const shade=68+((row*17+col*13+80)%17);ctx.fillStyle='rgb('+shade+','+(shade+6)+','+(shade+5)+')';ctx.fillRect(col*128+(row%2)*64+2,row*64+2,124,60);ctx.strokeStyle='#65706a';ctx.lineWidth=1;ctx.strokeRect(col*128+(row%2)*64+4,row*64+4,120,56);}
 const map=new THREE.CanvasTexture(paving);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(5,4);
 const pavingMesh=add(new THREE.PlaneGeometry(24,18),mat(0xb1b7ad,{map}),0,-.085,0);pavingMesh.rotation.x=-Math.PI/2;
 // A small freestanding label and low rails leave space around the lion.
 function sign(text,x,y,z,w=1.1,h=.38,parent=target){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=176;const c=canvas.getContext('2d');c.fillStyle='#38271e';c.fillRect(0,0,512,176);c.strokeStyle='#a88b5e';c.lineWidth=5;c.strokeRect(9,9,494,158);c.fillStyle='#ead7ad';c.textAlign='center';c.textBaseline='middle';c.font='52px "SimSun",serif';c.fillText(text,256,88);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;const o=add(new THREE.PlaneGeometry(w,h),mat(0xffffff,{map:t}),x,y,z,parent);o.rotation.y=Math.PI;return o;}
 function lantern(x,y,z,parent=target){const shell=add(new THREE.SphereGeometry(.20,20,14),red,x,y,z,parent);shell.scale.y=1.28;cylinder(warm,x,y+.26,z,.105,.055,parent);cylinder(trim,x,y-.26,z,.09,.05,parent);cylinder(trim,x,y-.38,z,.027,.17,parent);cylinder(wood,x,y+.43,z,.012,.3,parent);}
 function lampStand(x,z){cylinder(wood,x,1.42,z,.055,3);box(wood,x+.33,2.93,z,.76,.07,.07);lantern(x+.58,2.42,z);box(stone,x,0,z,.38,.14,.38);}
 zone('left-lamp');lampStand(-3.1,.25);zone('right-lamp');lampStand(3.1,.25);
 for(const side of [-1,1]){zone(side<0?'left-rail':'right-rail');for(let i=0;i<4;i++){box(wood,side*3.15,.44,1.1+i*.85,.09,1.04,.09);}box(wood,side*3.15,.82,2.37,.065,.075,2.7);box(wood,side*3.15,.38,2.37,.055,.07,2.7);}
 function stall(x,z,label){const g=new THREE.Group();g.position.set(x,0,z);target.add(g);box(wood,0,.44,0,2.6,.9,1.15,g);box(trim,0,.94,-.02,2.76,.12,1.3,g);for(const sx of [-1,1])for(const sz of [-1,1])box(wood,sx*1.17,1.53,sz*.46,.085,3.1,.085,g);
  const canopy=box(cloth,0,2.85,0,2.95,.13,1.65,g);canopy.rotation.x=.13;box(cloth,0,2.63,-.81,2.95,.32,.06,g);sign(label,0,2.64,-.85,1.5,.24,g);lantern(-.93,2.15,-.48,g);lantern(.93,2.15,-.48,g);
  for(let i=0;i<5;i++){const parcel=box(mat([0x8d5a42,0x9a8251,0x64735d][i%3]),-.9+i*.43,1.08,0,.31,.22,.4,g);parcel.rotation.y=(i%2-.5)*.2;}
 }
 zone('left-stall');stall(-4.9,3.2,'秦淮灯市');zone('right-stall');stall(4.9,3.2,'上元茶肆');
 zone('river');
 // Distant river rail and houses establish scale, without surrounding the lion tightly.
 for(let x=-10;x<=10;x+=1.25)box(stone,x,.4,5.4,.12,.95,.12);
 box(stone,0,.73,5.4,20,.10,.1);box(stone,0,.2,5.4,20,.08,.1);
 const water=add(new THREE.PlaneGeometry(26,4.4),mat(0x17343a,{roughness:.3,metalness:.22}),0,-.17,7.8);water.rotation.x=-Math.PI/2;
 for(let i=0;i<20;i++){const strip=box(mat(0x355355,{roughness:.4}),-10+i*1.03,-.16,6.2+(i%4)*.65,.35+(i%3)*.15,.007,.025);strip.rotation.y=.1;}
 function house(x,z,w,h){box(wall,x,h/2,z,w,h,2.0);box(wood,x,.08,z,w+.1,.16,2.15);for(const sx of [-1,1]){const slope=box(roof,x+sx*w*.25,h+.23,z,w*.55,.13,2.5);slope.rotation.z=-sx*.25;}box(roof,x,h+.46,z,.13,.13,2.65);
  for(let j=-1;j<=1;j++){box(warm,x+j*w*.28,h*.53,z-1.012,w*.18,h*.36,.035);for(let k=-1;k<=1;k++)box(wood,x+j*w*.28+k*w*.055,h*.53,z-1.04,.035,h*.4,.035);box(wood,x+j*w*.28,h*.53,z-1.05,w*.20,.045,.04);}for(const sx of [-1,1])box(wood,x+sx*(w/2-.09),h/2,z-1.07,.1,h,.1);
 }
 zone('houses');house(-6.3,10.1,4.2,2.9);house(-1.5,10.6,4.3,3.4);house(3.7,10.2,4.8,3.0);house(8.6,10.5,3.8,3.3);
 zone('sign');sign('上元试灯',-2.15,.57,-.75,.78,.3);box(wood,-2.15,.23,-.72,.05,.6,.05);
 // Move scenery outwards rather than stretching buildings when a large lantern needs clearance.
 group.userData.setFootprint=(width,depth)=>{
  const dx=Math.max(0,width/2+1.1-3.1),dz=Math.max(0,depth/2+1.8-3.2);
  for(const side of ['left','right']){
   const sign=side==='left'?-1:1;
   for(const part of ['lamp','rail','stall'])zones[side+'-'+part].position.x=sign*dx;
   zones[side+'-stall'].position.z=dz;
  }
  zones.river.position.z=dz;zones.houses.position.z=dz;
  zones.sign.position.x=-Math.max(0,width/2+.65-2.15);
  pavingMesh.scale.set((24+dx*2)/24,(18+dz*2)/18,1);
  map.repeat.set(5*(24+dx*2)/24,4*(18+dz*2)/18);
 };
 return group;
}
