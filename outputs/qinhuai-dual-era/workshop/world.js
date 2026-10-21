import {makeScissors} from './scissors.js';
import * as THREE from 'three';
import { BAMBOO_LENGTHS, BAMBOO_WIDTH, BAMBOO_THICKNESS } from './ring-model.mjs';
import {makePaper,colorPaper,makePress} from './paper-visuals.js';
import { LEAF_IDS } from './config.mjs';
import { rod, tube, petalGeometry } from './lantern.js';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function canvasTexture(kind){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');
 if(kind==='wood'){
  c.fillStyle='#76533b';c.fillRect(0,0,512,512);
  for(let i=0;i<450;i++){const y=i/450*512;c.strokeStyle=`rgba(${i%2?35:180},${i%2?22:133},${i%2?16:90},${.08+(i%7)*.018})`;c.lineWidth=.5+i%3;c.beginPath();c.moveTo(0,y);for(let x=0;x<=512;x+=16)c.lineTo(x,y+Math.sin(x*.02+i*.7)*2.5);c.stroke();}
  for(let i=0;i<4;i++){c.fillStyle='rgba(20,10,5,.25)';c.fillRect(0,i*128,512,2);}
 }else{
  c.fillStyle='#d8c7a7';c.fillRect(0,0,512,512);
  for(let i=0;i<3500;i++){const x=(i*137.37)%512,y=(i*71.93)%512;c.fillStyle=i%2?'rgba(100,75,42,.06)':'rgba(255,255,245,.13)';c.fillRect(x,y,1+i%3,1);}
 }
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
export function createWorld(scene){
 const world=new THREE.Group();world.name='WorkshopEnvironment';scene.add(world);
 const woodTex=canvasTexture('wood'),paperTex=canvasTexture('paper');
 const wood=new THREE.MeshStandardMaterial({map:woodTex,color:'#b18a65',roughness:.86});
 const darkWood=new THREE.MeshStandardMaterial({map:woodTex,color:'#614735',roughness:.92});
 const plaster=new THREE.MeshStandardMaterial({map:paperTex,color:'#e0d4bd',roughness:1});
 const fabric=new THREE.MeshStandardMaterial({color:'#a99877',roughness:1});
 const metal=new THREE.MeshStandardMaterial({color:'#624e35',metalness:.25,roughness:.75});
 const bamboo=new THREE.MeshStandardMaterial({color:'#b6b185',roughness:.92});
 const ceramic=new THREE.MeshStandardMaterial({color:'#b9c5b8',roughness:.35});
 const pink=new THREE.MeshStandardMaterial({color:'#ba80b7',roughness:.93,side:THREE.DoubleSide});
 const raw=new THREE.MeshStandardMaterial({color:'#f0e8df',roughness:.97,side:THREE.DoubleSide});
 const green=new THREE.MeshStandardMaterial({color:'#567a49',roughness:.95,side:THREE.DoubleSide});
 const collisions=[],stations={},paperMeshes=[];
 function box(w,h,d,mat,x,y,z,parent=world){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function cylinder(r1,r2,h,mat,x,y,z,parent=world){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,24),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function table(x,z,w,d){box(w,.13,d,wood,x,.92,z);box(w-.12,.18,.1,darkWood,x,.72,z+d/2-.1);for(const dx of [-1,1])for(const dz of [-1,1])box(.12,.86,.12,darkWood,x+dx*(w/2-.16),.43,z+dz*(d/2-.14));collisions.push({x,z,hx:w/2+.18,hz:d/2+.18});}
 function textPlaque(text,x,y,z,width=1.4){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const c=cv.getContext('2d');c.fillStyle='#e6d8ba';c.fillRect(0,0,512,128);c.strokeStyle='#897657';c.lineWidth=2;c.strokeRect(7,7,498,114);c.fillStyle='#45392c';c.font='52px "KaiTi", "SimSun", serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,256,66);const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;const p=new THREE.Mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicMaterial({map:tx}));p.position.set(x,y,z);world.add(p);return p;}
 box(14,.15,12,new THREE.MeshStandardMaterial({color:'#a5a18e',roughness:.97}),0,-.1,0);
 for(let ix=-7;ix<7;ix++)for(let iz=-6;iz<6;iz++){const tone=new THREE.Color('#b0ac97').multiplyScalar(.94+((ix*7+iz*3+30)%5)*.025);box(.987,.015,.987,new THREE.MeshStandardMaterial({color:tone,roughness:1}),ix+.5,-.012,iz+.5);}
 box(14,4.7,.18,plaster,0,2.3,-5);box(.18,4.7,11,plaster,-6,2.3,0);box(.18,4.7,11,plaster,6,2.3,0);
 for(const x of [-5.5,-2.8,0,2.8,5.5]){box(.18,4.5,.20,darkWood,x,2.2,-4.75);box(.17,.22,10,darkWood,x,4.35,0);}
 box(11.5,.24,.24,darkWood,0,3.3,-4.7);box(12,.22,.22,darkWood,0,4.3,2.7);
 // Luminous paper lattice windows. No downloaded environment or remote textures.
 for(const x of [-3.7,3.7]){
  box(2.15,2.15,.10,new THREE.MeshStandardMaterial({color:'#efe4cb',emissive:'#e6cfa4',emissiveIntensity:.3,roughness:1}),x,2.16,-4.86);
  for(let j=0;j<7;j++)box(.035,2.2,.12,darkWood,x-1.1+j*.366,2.16,-4.76);
  for(let j=0;j<5;j++)box(2.2,.035,.12,darkWood,x,1.06+j*.55,-4.75);
 }
 textPlaque('秦 淮 灯 作',0,3.72,-4.63,2.4);
 textPlaque('一 篾 一 纸 · 一 盏 心 灯',0,3.15,-4.63,2.2);
 // Wall display shelves and bamboo stock.
 for(const y of [.6,1.3,2])box(2.1,.08,.5,wood,-.05,y,-4.5);
 for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.21+(i%3)*.055,.008,5,40),bamboo);m.position.set(-1.25+(i%4)*.8,2.4+Math.floor(i/4)*.35,-4.64);world.add(m);}
 for(let i=0;i<6;i++)cylinder(.12,.10,.28,ceramic,-.9+i*.35,.78,-4.5);
 table(0,0,3.2,1.95);box(2.48,.013,1.52,fabric,0,.997,0);
 const turntable=cylinder(.82,.85,.055,darkWood,0,1.04,0);
 table(-3.55,-1.35,2.15,1.5);table(3.55,-1.35,2.15,1.5);table(3.55,1.6,2.15,1.55);
 function station(id,name,x,z,position,look){
  const trigger=new THREE.Mesh(new THREE.BoxGeometry(id==='assembly'?3:2.05,1.65,id==='assembly'?1.9:1.45),new THREE.MeshBasicMaterial({visible:false}));trigger.position.set(x,1.45,z);trigger.userData.station=id;world.add(trigger);
  const label=textPlaque(name,x,.82,z+.80,id==='assembly'?1.05:.82);
  stations[id]={id,name,x,z,trigger,label,position:V(...position),look:V(...look)};
 }
 station('assembly','叁 · 合灯台',0,0,[0,1.82,2.85],[0,1.67,0]);
 station('bamboo','壹 · 扎架台',-3.55,-1.35,[-3.55,1.72,.65],[-3.55,1.08,-1.35]);
 station('dye','贰 · 染纸台',3.55,-1.35,[3.55,1.72,.65],[3.55,1.08,-1.35]);
 station('press','贰 · 压瓣台',3.55,1.6,[3.55,1.72,3.65],[3.55,1.1,1.6]);
 const bambooStock=[];
 for(let i=0;i<16;i++){const strip=box(BAMBOO_WIDTH,BAMBOO_THICKNESS,BAMBOO_LENGTHS[0],bamboo.clone(),-4.22+i*.055,1.02,-1.4);strip.userData.stockIndex=i;bambooStock.push(strip);}
 for(let i=0;i<3;i++){const strip=box(BAMBOO_WIDTH,BAMBOO_THICKNESS,.42,bamboo.clone(),-4.22+i*.055,1.065,-1.02);strip.userData.stockIndex=16+i;strip.userData.lengthType='short';strip.userData.lengthCm=42;bambooStock.push(strip);}
 for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.23+i*.055,.008,5,48),bamboo);m.rotation.x=-Math.PI/2;m.position.set(-3.02,1.025+i*.017,-1.3);world.add(m);}
 cylinder(.095,.095,.18,darkWood,-3.45,1.1,-.95);cylinder(.077,.077,.12,new THREE.MeshStandardMaterial({color:'#e4dccb',roughness:1}),-3.45,1.1,-.95);
 // Separate the front dye baths from the elevated rear drying rack.
 const bathPositions=[V(3.23,1.34,-1.08),V(3.89,1.34,-1.08)];
 for(let i=0;i<2;i++){const p=bathPositions[i];cylinder(.29,.25,.34,ceramic,p.x,1.17,p.z);cylinder(.255,.255,.008,new THREE.MeshStandardMaterial({color:i?'#52794b':'#a86d9a',roughness:.25}),p.x,p.y,p.z);}
 for(const x of [2.7,4.4]){box(.035,.97,.035,bamboo,x,1.48,-1.97);box(.24,.03,.22,darkWood,x,1.015,-1.97);}
 world.add(rod(V(2.7,1.96,-1.97),V(4.4,1.96,-1.97),.017,bamboo));
 textPlaque('通 风 阴 干 架',3.55,2.10,-1.98,.72);
 const rackPositions=Array.from({length:8},(_,i)=>V(2.90+(i%4)*.43,1.75-Math.floor(i/4)*.46,-1.96));
 world.add(rod(V(2.7,1.50,-1.97),V(4.4,1.50,-1.97),.012,bamboo));
 const leafPaperMeshes=[];
 for(let i=0;i<36;i++){const sheet=makePaper({dose:0});sheet.name='rack-petal-'+i;sheet.scale.setScalar(.56);sheet.position.copy(rackPositions[Math.floor(i/6)]);world.add(sheet);paperMeshes.push(sheet);}
 for(let i=0;i<LEAF_IDS.length;i++){const sheet=makePaper({leaf:true,dose:0});sheet.name='rack-leaf-'+i;sheet.scale.setScalar(.56);sheet.position.copy(rackPositions[6+Math.floor(i/7)]);world.add(sheet);leafPaperMeshes.push(sheet);}
 for(const p of rackPositions)box(.025,.04,.03,darkWood,p.x,p.y+.21,p.z);
 const pressMachine=makePress(),press=pressMachine.root;world.add(press);press.position.set(3.08,1,1.42);
 let paperFocus=false;
 const pressedPetal=new THREE.Mesh(petalGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.95}));pressedPetal.rotation.x=-Math.PI/2;pressedPetal.position.set(4.04,1.02,1.94);world.add(pressedPetal);
 const copper=new THREE.MeshStandardMaterial({color:'#b97342',metalness:.5,roughness:.4});
 for(let i=0;i<8;i++){const loop=new THREE.Mesh(new THREE.TorusGeometry(.065,.004,5,24),copper);loop.position.set(4.39,1.04+i*.009,1.12);loop.rotation.x=Math.PI/2;world.add(loop);}
 const pressedLeaf=new THREE.Mesh(petalGeometry({leaf:true,length:.36,width:.27}),new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide}));pressedLeaf.position.set(4.12,1.025,1.45);pressedLeaf.rotation.x=-Math.PI/2;world.add(pressedLeaf);
 const shapedGeometry=petalGeometry({bulge:.18,tip:-.06});const flatPressedGeometry=petalGeometry({bulge:.015,tip:0});
 const flowerSamples=[],podSamples=[];
 for(let i=0;i<6;i++){const group=new THREE.Group();group.position.set(3.18+(i%3)*.25,1.04,1.26+Math.floor(i/3)*.23);for(let j=0;j<6;j++){const petal=new THREE.Mesh(petalGeometry({length:.18,width:.12,bulge:.035}),pressedPetal.material);petal.rotation.order='YXZ';petal.rotation.y=j/6*Math.PI*2;petal.rotation.x=.65;group.add(petal);}world.add(group);flowerSamples.push(group);}
 for(let i=0;i<2;i++){const pod=new THREE.Mesh(new THREE.CylinderGeometry(.09,.04,.07,12),green);pod.position.set(4.1,1.065,1.3+i*.25);world.add(pod);podSamples.push(pod);}
 // Material notes, hand tools, jars: a functional place rather than a bare showroom.
 for(const [x,z] of [[-1.15,.48],[1.15,.4]]){cylinder(.11,.08,.17,ceramic,x,1.1,z);world.add(rod(V(x,1.1,z),V(x+.03,1.45,z+.05),.009,bamboo));}
 for(let i=0;i<5;i++){const sheet=new THREE.Mesh(new THREE.PlaneGeometry(.38,.45),raw);sheet.rotation.x=-Math.PI/2;sheet.rotation.z=i*.06;sheet.position.set(-1.03,1.012+i*.002,-.18);world.add(sheet);}
 const scissors=makeScissors();scissors.rotation.x=-Math.PI/2;scissors.position.set(1.15,1.03,-.05);world.add(scissors);
 // A real stock tray at the upper-left of the dye tabletop; sheets stay visible in close-up.
 const paperStock=new THREE.Group();paperStock.name='dye-square-stock';paperStock.position.set(2.83,1.025,-1.63);world.add(paperStock);
 const tray=new THREE.Mesh(new THREE.BoxGeometry(.53,.025,.48),bamboo);tray.position.y=-.01;paperStock.add(tray);
 for(let i=0;i<8;i++){const sheet=makePaper({dose:0},'square',.39);sheet.rotation.x=-Math.PI/2;sheet.rotation.z=(i%3-1)*.025;sheet.position.set((i%2)*.006,.008+i*.004,0);paperStock.add(sheet);}
 const dyeBin=new THREE.Group();dyeBin.name='dye-waste-bin';dyeBin.position.set(4.39,1.16,-.73);world.add(dyeBin);
 const bucket=new THREE.Mesh(new THREE.CylinderGeometry(.13,.105,.25,20,1,true),new THREE.MeshStandardMaterial({color:'#5c5543',side:THREE.DoubleSide}));dyeBin.add(bucket);
 const bucketFloor=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.015,20),new THREE.MeshStandardMaterial({color:'#322d25'}));bucketFloor.position.y=-.12;dyeBin.add(bucketFloor);
 // Resting brush and pigment pots belong to the dye station, clear of the working basins.
 world.add(rod(V(4.43,1.045,-1.40),V(4.43,1.045,-1.76),.012,bamboo));
 box(.045,.025,.085,raw,4.43,1.045,-1.79);
 // Single soft key shadow; the rest are cheap fill lights.
 scene.add(new THREE.HemisphereLight('#fff0d4','#776450',2.1));
 const sun=new THREE.DirectionalLight('#ffedcf',3);sun.position.set(-3,7,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:22});sun.shadow.bias=-.0006;sun.shadow.normalBias=.025;scene.add(sun);
 const fill=new THREE.DirectionalLight('#d6e6ed',1.4);fill.position.set(5,4,0);scene.add(fill);
 scene.background=new THREE.Color('#d3c6af');scene.fog=new THREE.Fog('#d3c6af',12,26);
 const dustGeo=new THREE.BufferGeometry(),dustPos=[];for(let i=0;i<90;i++)dustPos.push(Math.sin(i*79)*5,1+(i%31)*.10,Math.cos(i*31)*4);
 dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPos,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:'#fff4db',size:.014,transparent:true,opacity:.3,depthWrite:false}));world.add(dust);
 function sync(state){
  const used=[...(state.frameItems?.usedStrips??Array.from({length:state.counts.bamboo_prep},(_,j)=>j)),...(state.frameItems?.shortStrips??[])];
  bambooStock.forEach((m,i)=>m.visible=!used.includes(m.userData.stockIndex??i));
  for(const [items,meshes,batch,leaf] of [[state.papers,paperMeshes,6,false],[state.leaves,leafPaperMeshes,7,true]])items.forEach((p,i)=>{const m=meshes[i];m.userData.paperId=p.id;m.userData.status=p.status;m.visible=i%batch===0&&['wet','dry'].includes(p.status);const key=[p.dyeDose,p.dyeDepth].join(':');if(m.userData.profile!==key){colorPaper(m.geometry,{leaf,dose:p.dyeDose??.8,depth:p.dyeDepth??.8});m.userData.profile=key;}});
  pressedPetal.visible=!paperFocus&&state.counts.petal_cutting>0&&state.counts.petal_assembly<36;pressedPetal.geometry=state.counts.petal_shaping>0?shapedGeometry:flatPressedGeometry;
  pressedLeaf.visible=!paperFocus&&state.counts.leaf_cutting>0&&state.counts.lotus_leaf_assembly<2;
  flowerSamples.forEach((m,i)=>m.visible=i<state.counts.flower_making&&i>=state.counts.top_flower_assembly);
  podSamples.forEach((m,i)=>m.visible=i<state.counts.pod_making&&i>=state.counts.pod_assembly);
 }
 function animate(t){dust.rotation.y=Math.sin(t*.07)*.03;}
 function setPaperFocus(value){paperFocus=value;press.visible=!value;if(value){pressedPetal.visible=false;pressedLeaf.visible=false;}}
 return {world,stations,collisions,sync,animate,turntable,bambooStock,paperStock,dyeBin,bathPositions,rackPositions,setPaperFocus,paperMeshes,leafPaperMeshes};
}
