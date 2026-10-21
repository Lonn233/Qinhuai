import * as THREE from 'three';

// Interpretive architecture, not a surveyed reconstruction. See research-notes.md.
// No terrain, shoreline, road, bridge or planting is created or edited here.
export function createMingArchitecture({parent,frame,roof,box,pole,beam,instance,geometries,addGeo,M,tex,mat,courtY}){
 const districts={};
 for(const key of ['temple','west','east','south','pavilion']){
  const group=new THREE.Group();group.name='Ming_'+key;parent.add(group);districts[key]=group;
 }
 const wood=mat('#51402f'), lightWood=mat('#806347'), lime=mat('#d4cbbb',{map:tex.wall});
 const brick=mat('#8b8880'), paper=mat('#c8bba0',{emissive:'#ffb45e',emissiveIntensity:0});
 const roofMat=mat('#9eaaa8',{map:tex.roof,side:THREE.DoubleSide});
 const redPaper=mat('#ad3926',{emissive:'#ff792e',emissiveIntensity:0});
 const creamPaper=mat('#e6c589',{emissive:'#ffd58c',emissiveIntensity:0});
 const red=mat('#793e2c'), signMat=mat('#e3cf9d');
 let count=0,lanternCount=0;
 function lantern(f,x,y,z,type=0,scale=1){
  const m=type%3===0?redPaper:creamPaper;
  const p=f.p(x,y,z);
  if(type%3===1){
   instance(f.g,geometries.cylinder,m,p,[.24*scale,.55*scale,.24*scale]);
   for(let i=0;i<6;i++){
    const a=i*Math.PI/3;f.b(lightWood,x+Math.cos(a)*.225*scale,y,z+Math.sin(a)*.225*scale,.022*scale,.56*scale,.022*scale);
   }
  }else{
   instance(f.g,geometries.sphere,m,p,[.25*scale,.31*scale,.25*scale]);
   if(type%3===2)instance(f.g,geometries.sphere,m,f.p(x,y+.3*scale,z),[.14*scale,.18*scale,.14*scale]);
  }
  f.b(red,x,y+.3*scale,z,.23*scale,.065*scale,.23*scale);
  f.b(red,x,y-.3*scale,z,.18*scale,.06*scale,.18*scale);
  f.b(lightWood,x,y+.54*scale,z,.02*scale,.4*scale,.02*scale);
  f.b(red,x,y-.47*scale,z,.024*scale,.29*scale,.024*scale);
  lanternCount++;
 }
 function house(g,x,z,w,d,h=3.2,{angle=0,base=.5,shop=false,floors=1,hall=false,label='',variant=0}={}){
  count++;const f=frame(g,x,z,angle,base),fh=h/floors,rise=Math.min(d*.28,hall?2.7:1.9);
  f.b(M.stone,0,.18,0,w+.2,.36,d+.15);
  // Recessed wall infill and visible timber bays, without modern glass.
  f.b(lime,0,h/2+.25,0,w,h,d);
  f.b(brick,0,.5,0,w+.05,.5,d+.05);
  const bays=Math.max(3,Math.round(w/(hall?3:2.3)));
  for(const side of [-1,1]){
   const zf=side*(d/2+.06);
   for(let floor=0;floor<floors;floor++){
    const y=floor*fh+.3;
    f.b(wood,0,y+fh-.12,zf,w+.2,.17,.16);
    for(let j=0;j<bays;j++){
     const xx=-w/2+(j+.5)*w/bays,ww=w/bays*.7,hh=fh*.55;
     f.b(wood,xx,y+fh*.5,zf,ww+.14,hh+.14,.12);
     f.b(paper,xx,y+fh*.5,zf+side*.075,ww,hh,.045);
     for(let k=-2;k<=2;k++)f.b(wood,xx+k*ww/5,y+fh*.5,zf+side*.105,.035,hh,.035);
     for(const dy of [-hh*.25,hh*.25])f.b(wood,xx,y+fh*.5+dy,zf+side*.12,ww,.045,.04);
     f.b(wood,-w/2+j*w/bays,y+fh/2,zf+.03*side,.12,fh,.15);
     if(shop&&floor===0){
      f.b(wood,xx,y+.35,zf+side*.1,ww,.56,.12);
      for(let k=-2;k<=2;k++)f.b(lightWood,xx+k*ww/5,y+.35,zf+side*.17,.02,.5,.02);
     }
    }
    if(floor>0&&shop){
     f.b(wood,0,y-.05,side*(d/2+.5),w+.35,.17,1.1);
     f.b(wood,0,y+.75,side*(d/2+1),w+.35,.10,.10);
     for(let j=0;j<=bays*3;j++)f.b(wood,-w/2+j*w/(bays*3),y+.4,side*(d/2+1),.05,.7,.05);
    }
   }
   if(shop||hall){
    for(let i=0;i<=bays;i++){
     const xx=-w/2+i*w/bays;
     f.b(wood,xx,h/2+.25,side*(d/2+.65),.15,h,.15);
     f.b(M.stone,xx,.16,side*(d/2+.65),.28,.32,.28);
     f.beam(wood,[xx,h-.6,side*(d/2+.65)],[xx,h+.08,side*(d/2+.16)],.05);
    }
    f.b(wood,0,h-.1,side*(d/2+.65),w+.2,.22,.18);
    for(let j=0;j<bays;j+=2)lantern(f,-w/2+(j+.5)*w/bays,h-.8,side*(d/2+.74),j+variant);
   }
  }
  roof(f,w,d,h+.35,rise,{hip:hall,over:shop||hall?.86:.48,material:roofMat});
  if(!hall){
   for(const side of [-1,1]){
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([side*w/2,h+.35,-d/2,side*w/2,h+.35,d/2,side*w/2,h+.35+rise,0],3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));geo.setIndex(side===1?[0,2,1]:[0,1,2]);geo.computeVertexNormals();f.geo(lime,geo);
   }
  }
  if(shop){
   // A small timber counter and paper/book bundles, confined to the building frontage.
   f.b(wood,-w*.28,.95,d/2+.38,w*.28,.65,.5);
   for(let j=0;j<3;j++)f.b(signMat,-w*.35+j*.24,1.31,d/2+.4,.17,.09+j*.02,.25);
  }
  if(label){
   const c=document.createElement('canvas');c.width=256;c.height=96;const ctx=c.getContext('2d');
   ctx.fillStyle='#423127';ctx.fillRect(0,0,256,96);ctx.strokeStyle='#b49963';ctx.lineWidth=3;ctx.strokeRect(7,7,242,82);
   ctx.fillStyle='#dac699';ctx.font='42px "KaiTi", "STKaiti", serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,128,50);
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=mat('#ffffff',{map:t});
   const geo=new THREE.PlaneGeometry(Math.min(w*.5,3.1),.9);geo.translate(0,h-.6,d/2+.19);f.geo(m,geo);
  }
  return f;
 }
 function court(g,x,z,w,d,{h=3.2,angle=0}={}){
  const f=frame(g,x,z,angle,.5),dep=Math.min(3,d*.28);
  const place=(a,b,ww,dd,hh,extra={})=>{const p=f.p(a,0,b);return house(g,p[0],p[2],ww,dd,hh,{angle,...extra});};
  place(0,-d/2+dep/2,w,dep,h+.25);place(0,d/2-dep/2,w,dep,h);
  if(w>9){for(const side of [-1,1])place(side*(w/2-1.25),0,d-2*dep,2.5,h-.2,{angle:angle+Math.PI/2});}
  else for(const side of [-1,1]){
   f.b(lime,side*(w/2-.12),h*.45,0,.24,h*.9,d-2*dep);
   f.b(M.ridge,side*(w/2-.12),h*.9,0,.36,.15,d-2*dep+.2);
  }
 }
 const {temple,west,east,south,pavilion}=districts;
 // Building footprints follow the modern project's blocks. No bridge entrance is filled.
 house(temple,3,-33,24,8,5,{hall:true,label:'文庙'});
 house(temple,3,-15,25,4,3.6,{hall:true});
 for(const x of [-11.7,17.7])house(temple,x,-24,17,3.5,3.3,{angle:Math.PI/2,hall:true});
 house(temple,3,-51,24,7.2,4.8,{hall:true});
 for(const x of [-11.7,17.7])house(temple,x,-43.8,13.4,3.1,3.2,{angle:Math.PI/2,hall:true});
 house(temple,3,-62,22,6,4.1,{hall:true});
 for(const x of [-10.6,16.6])house(temple,x,-57.2,5.3,3.2,3,{angle:Math.PI/2});
 for(let i=0;i<7;i++)court(temple,-11+i*5.8,-75,5.1,10.4,{h:2.8+(i%3)*.2});
 court(temple,29,-61.3,8.5,12.5);court(temple,28,-44.3,8.5,13);
 // Replace high commercial slabs with modest enclosed timber inns and shop rows.
 for(let i=0;i<3;i++)house(west,-34.4+i*8.4,-47,7.5,4.2,3.5,{shop:true,variant:i});
 house(west,-15,-36,18,3.8,3.3,{angle:Math.PI/2,shop:true});
 court(west,-47,-28,18,12,{h:3.4});court(west,-32,-38,8,9,{h:3});
 court(west,-57,-10,13,13);court(west,-42,-10,13,13,{h:3.4});
 house(west,-30,-5.5,14,7,5.5,{shop:true,floors:2,label:'灯市楼'});
 house(west,-22,-16,13,9,3.8,{shop:true,label:'书肆'});court(west,-66,-19,8,12);
 house(west,-62,2,8,5,3.4,{shop:true,label:'画坊'});
 house(west,-41,0,7,5,5.3,{shop:true,floors:2,label:'观灯楼'});
 house(east,24,-16.75,17.5,5.7,3.5,{angle:Math.PI/2,shop:true});
 court(east,42,-11,18,18,{h:3.7});
 for(let i=0;i<4;i++)court(east,57,-23+i*7.1,10,6.1,{angle:Math.PI/2,h:2.9+(i%2)*.25});
 court(east,41,-33.6,8,13);house(east,37,-44,10,5,3.5,{angle:Math.PI/2});
 court(east,48,6.8,13.4,12);court(east,62,5.7,10,12,{h:3.4});
 house(east,72,4,7,5,3.3,{angle:Math.PI/2,shop:true});
 court(south,-66,25.5,10,13,{h:3.3});court(south,-53,24.5,12,12);
 house(south,-39.6,25,14,8.7,4.7,{shop:true,floors:2,label:'水阁'});
 house(south,-15,33.8,13,4.4,3,{shop:true,label:'灯彩铺'});
 house(south,-1,33.7,11,4.3,2.9,{shop:true});
 for(let i=0;i<6;i++)court(south,12+i*7.1,32,6.2,9.7,{h:3+(i%3)*.2});
 court(south,61,30,11.5,12,{h:3.4});house(south,72,26.7,6,6.5,3.6,{shop:true,angle:Math.PI/2});
 for(let i=0;i<21;i++){
  const x=-69+i*6.85;
  house(south,x,45.6,5.9,4.6,2.9+(i%4)*.18,{shop:true,variant:i,label:i%5===0?['灯坊','书肆','画坊','花市'][Math.floor(i/5)%4]:''});
 }
 // Preserve the exact shared pavilion platform and tower placement. Buildings only.
 house(pavilion,25,.3,14.6,7.4,3.5,{base:courtY,shop:true,hall:true,label:'临水堂'});
 house(pavilion,37.1,6,10.6,5.4,3.8,{base:courtY,angle:Math.PI/2,shop:true});
 house(pavilion,16.9,6.5,4.5,5.7,2.8,{base:courtY});
 // Curved timber gallery follows the pre-existing shared podium and original lighting paths.
 const curve=new THREE.CatmullRomCurve3([[18.7,10],[21,13.1],[25,15],[31,15.4],[36,14.7],[40.3,12]].map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal');
 const stations=curve.getSpacedPoints(80),normals=stations.map((p,i)=>{const t=stations[Math.min(80,i+1)].clone().sub(stations[Math.max(0,i-1)]).normalize();return new THREE.Vector3(-t.z,0,t.x);});
 for(let i=0;i<=80;i+=5){
  const p=stations[i],n=normals[i];
  for(const side of [-1,1]){const x=p.x+n.x*.85*side,z=p.z+n.z*.85*side;pole(pavilion,wood,x,courtY+1.23,z,.075,2.46);box(pavilion,M.stone,x,courtY+.13,z,.24,.26,.24);}
  if(i<80)for(const side of [-1,1])for(const y of [courtY+.65,courtY+2.28]){
   beam(pavilion,wood,[p.x+n.x*.85*side,y,p.z+n.z*.85*side],[stations[i+5].x+normals[i+5].x*.85*side,y,stations[i+5].z+normals[i+5].z*.85*side],.055);
  }
 }
 const cross=[-1.16,-.95,-.6,0,.6,.95,1.16],ys=[3.64,3.59,3.8,4.32,3.8,3.59,3.64],pos=[],uv=[],indices=[];
 for(let i=0;i<=80;i++)for(let j=0;j<7;j++){pos.push(stations[i].x+normals[i].x*cross[j],ys[j],stations[i].z+normals[i].z*cross[j]);uv.push(i*.22,cross[j]*.8);}
 for(let i=0;i<80;i++)for(let j=0;j<6;j++){const q=i*7+j;indices.push(q,q+1,q+7,q+1,q+8,q+7);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();addGeo(pavilion,roofMat,geo);
 count++;
 parent.userData={period:'Early Ming interpretation',evidence:'research-notes.md',notice:'基于《上元灯彩图》与明代建筑特征的推定复原。',sharedTerrain:true};
 return {districts,count,lanternCount,setNight(enabled){paper.emissiveIntensity=enabled?.6:0;redPaper.emissiveIntensity=enabled?2.1:0;creamPaper.emissiveIntensity=enabled?2.3:0;}};
}
