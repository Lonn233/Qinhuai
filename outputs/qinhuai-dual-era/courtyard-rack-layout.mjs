// Coordinates measured from FuziTemple0114's paving edges, not the tile centre.
export const RACK_GROUND_Y=11.864055;
export const RIDDLE_HOST_POSITION={x:-5.63,z:-29.7};
export const RACK_KINDS=['green','blue','gold','red'];
export const RACK_COLORS={green:'#87c950',blue:'#6aafff',gold:'#ffd16d',red:'#ff7962'};
// Width and depth relative to height, measured from the four source GLBs.
const RACK_FOOTPRINTS={green:[.38544556,.38551495],blue:[.56319911,.56308248],gold:[.57352275,.55638823],red:[.68525631,.68143546]};
export const RACK_REGIONS=[
 {id:'center',minX:-6.725,maxX:-4.532,minZ:-30.50,maxZ:-26.60,x0:-6.68,x1:-4.58}
];
// Retain the pre-existing paving infills after relocating the side racks.
export const RACK_PAVING_REGIONS=[
 {id:'paving-left',minX:-9.9946,maxX:-7.0952,minZ:-31.9407,maxZ:-27.5124},
 {id:'paving-right',minX:-4.0704,maxX:-1.1710,minZ:-31.9407,maxZ:-27.5124}
];
export function rackLayout(){return RACK_REGIONS.map(region=>{
 const {x0,x1}=region,z0=-30.40,z1=-26.70,y=RACK_GROUND_Y,shelf=y+1.90;
 const wood=[],ropes=[],mounts=[];
 const line=(list,a,b,r,role)=>list.push({a,b,r,role});
 for(const x of [x0,x1])for(const z of [z0,z1])line(wood,[x,y,z],[x,shelf+.04,z],.032,'corner-post');
 // Keep the walkway clear beneath the canopy; no ankle-height crossbars.
 for(const h of [shelf]){
  for(const z of [z0,z1])line(wood,[x0,h,z],[x1,h,z],.025,'crossbar');
  for(const x of [x0,x1])line(wood,[x,h,z0],[x,h,z1],.025,'side-rail');
 }
 // Longitudinal and transverse rope grid supports upright lanterns on short suspension strings.
 for(let i=1;i<9;i++){const x=x0+(x1-x0)*i/9;line(ropes,[x,shelf,z0],[x,shelf,z1],.006,'net');}
 for(let i=1;i<22;i++){const z=z0+(z1-z0)*i/22;line(ropes,[x0,shelf,z],[x1,shelf,z],.006,'net');}
 // Fixed seed keeps the staggered arrangement stable across reloads.
 let seed=region.id==='left'?417:829;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const gap=.008,rows=[];
 for(let row=0;row<12;row++){
  const lamps=Array.from({length:9},(_,col)=>{
   const kind=RACK_KINDS[(row*9+col)%4],[widthRatio,depthRatio]=RACK_FOOTPRINTS[kind];
   return {kind,widthRatio,depthRatio,weight:(.30+random()*.28)*widthRatio,maxWidth:Math.min(.58,.29/depthRatio)*widthRatio};
  });
  // Fit actual model footprints edge to edge, retaining a small nonzero gap.
  let remaining=x1-x0-.11-gap*(lamps.length-1),active=[...lamps];
  while(active.length){
   const weight=active.reduce((sum,lamp)=>sum+lamp.weight,0);
   const capped=active.filter(lamp=>remaining*lamp.weight/weight>lamp.maxWidth);
   if(!capped.length){for(const lamp of active)lamp.width=remaining*lamp.weight/weight;break;}
   for(const lamp of capped){lamp.width=lamp.maxWidth;remaining-=lamp.width;}
   active=active.filter(lamp=>!capped.includes(lamp));
  }
  for(const lamp of lamps)lamp.height=lamp.width/lamp.widthRatio;
  rows.push({lamps,depth:Math.max(...lamps.map(lamp=>lamp.height*lamp.depthRatio))});
 }
 const packedDepth=rows.reduce((sum,row)=>sum+row.depth,0)+gap*(rows.length-1);
 let nextZ=(z0+z1-packedDepth)/2;
 for(const row of rows){
  const rowZ=nextZ+row.depth/2;
  nextZ+=row.depth+gap;
  line(ropes,[x0,shelf,rowZ],[x1,shelf,rowZ],.006,'net-support');
  let nextX=x0+.055;
  for(const lamp of row.lamps){
  const {kind,height,width}=lamp,x=nextX+width/2,z=rowZ;
  nextX+=width+gap;
  const drop=.14+random()*.14;
  // Every offset suspension has a real cross-rope attachment on the one net.
  line(ropes,[x,shelf,rowZ],[x,shelf-drop,z],.006,'net-hanger');
  mounts.push({kind,mode:'net',center:[x,shelf-drop-height/2,z],height,rotation:0});
 }
 }
 return {region,shelf,wood,ropes,mounts};
});}
export function riddlePaperAnchors(){
 const mounts=rackLayout()[0].mounts;
 return [1,3,5,8,10].flatMap(row=>[1,7].map(col=>{
  const mountIndex=row*9+col,mount=mounts[mountIndex];
  const [x,y,z]=mount.center,width=.32,height=.24,cordLength=.07;
  const top=y-mount.height/2;
  return {mountIndex,x,z,width,height,cordLength,top,y:top-cordLength-height/2};
 }));
}
