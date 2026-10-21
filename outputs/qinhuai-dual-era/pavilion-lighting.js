import * as THREE from 'three';
import { eaveProfiles } from './pavilion-light-profiles.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Both eras clone the same immutable GLTF material. Share its derived night
// material/textures instead of recoloring two more 2K canvases on the second rig.
// Weak keys do not retain an unloaded source material. No fixture geometry changes.
const sharedNightCache = new WeakMap();

// Fixture paths follow the actual six-sided eaves of the supplied Meshy pavilion.
// All added fixtures and material overrides are reversible when returning to daylight.
export function installPavilionLighting({model,tower,groups,parent=model,name='11_Kuixing_night_lighting'}){
 const rig=new THREE.Group();rig.name=name;rig.userData.nightOnly=true;rig.visible=false;parent.add(rig);
 const local=new THREE.Group();local.name='Pavilion_eave_and_window_lights';local.position.copy(tower.position);local.rotation.copy(tower.rotation);local.scale.copy(tower.scale);rig.add(local);
 const gold=new THREE.MeshStandardMaterial({color:'#efb04e',emissive:'#ffaf35',emissiveIntensity:3.2,roughness:.55});gold.name='Warm_gold_eave_LED';
 const ridgeGold=gold.clone();ridgeGold.emissiveIntensity=.85;ridgeGold.name='Soft_gold_hip_ridge';
 const windowMat=new THREE.MeshStandardMaterial({color:'#b77934',emissive:'#ffb44a',emissiveIntensity:.3,roughness:.92,side:THREE.DoubleSide});windowMat.name='Warm_recessed_window_backing';
 const vertical=gold.clone();vertical.emissive.set('#ffe1a3');vertical.emissiveIntensity=2.2;vertical.name='Column_warm_white_grazers';
 const red=new THREE.MeshStandardMaterial({color:'#793e20',roughness:.8});
 const lanternMat=new THREE.MeshStandardMaterial({color:'#ffc763',emissive:'#ffd17d',emissiveIntensity:2.5,roughness:.65});lanternMat.name='Gallery_lantern_paper';
 const bins=new Map();
 function add(parent,geo,mat){const key=parent.uuid+mat.uuid;let b=bins.get(key);if(!b){b={parent,mat,geos:[]};bins.set(key,b);}b.geos.push(geo.index?geo.toNonIndexed():geo);}
 function tube(parent,points,r,mat){add(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(12,points.length*2),r,5,false),mat);}
 function sphere(parent,x,y,z,rx,ry,rz,mat){const geo=new THREE.SphereGeometry(1,12,8);geo.scale(rx,ry,rz);geo.translate(x,y,z);add(parent,geo,mat);}
 // Source coordinates are normalized by the same child offset as the original asset.
 const sourceOffset=tower.children[0].position;
 const sourcePoint=p=>new THREE.Vector3(...p).add(sourceOffset);
 for(const profile of eaveProfiles){const pts=profile.map(sourcePoint);pts.push(pts[0].clone());tube(local,pts,.0038,gold);}
 // Keep the original texture detail, using separate warm night textures.
 const overrides=[],nightCache=sharedNightCache;
 const warmMaterial=m=>{
  if(nightCache.has(m))return nightCache.get(m);
  const c=m.clone(),image=m.map?.image;
  if(image){
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
   const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),data=pixels.data;
   const emission=document.createElement('canvas');emission.width=canvas.width;emission.height=canvas.height;const ectx=emission.getContext('2d'),ep=ectx.createImageData(canvas.width,canvas.height);
   for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2],wood=r>g*1.3+12,lum=(r*.2126+g*.7152+b*.0722)/255;
    if(!wood){const v=.30+.70*Math.sqrt(lum);data[i]=215*v;data[i+1]=147*v;data[i+2]=57*v;}
    const glow=wood?.32:.82;ep.data[i]=data[i]*glow;ep.data[i+1]=data[i+1]*glow;ep.data[i+2]=data[i+2]*glow;ep.data[i+3]=255;
   }
   ctx.putImageData(pixels,0,0);ectx.putImageData(ep,0,0);
   const texture=surface=>{const t=new THREE.CanvasTexture(surface);t.flipY=m.map.flipY;t.colorSpace=THREE.SRGBColorSpace;t.wrapS=m.map.wrapS;t.wrapT=m.map.wrapT;return t;};
   c.map=texture(canvas);c.emissiveMap=texture(emission);
  }
  c.color.set('#ffffff');c.emissive.set('#ffcd82');c.emissiveIntensity=.9;c.metalness=.16;c.roughness=.72;c.name='Meshy_pavilion_warm_night';nightCache.set(m,c);return c;
 };
 tower.traverse(o=>{if(o.isMesh){const original=o.material;overrides.push({object:o,day:original,night:Array.isArray(original)?original.map(warmMaterial):warmMaterial(original)});}});
 // Four shielded uplights wash the roof and timber in amber rather than coloring the whole district.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2+Math.PI/4,l=new THREE.SpotLight('#ffc36b',190,19,.70,.8,2);l.name='Pavilion_architectural_uplight_'+i;
  l.position.set(27.5+Math.sin(a)*5.2,3.1,10.1+Math.cos(a)*5.2);l.lookAt(27.5,7.2,10.1);l.target.position.set(0,0,-1);l.add(l.target);rig.add(l);
 }
 const galleryCurve=new THREE.CatmullRomCurve3([[18.7,10],[21,13.1],[25,15],[31,15.4],[36,14.7],[40.3,12]].map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal');
 const gallery=galleryCurve.getSpacedPoints(80);
 let lanternCount=0;
 for(let i=3;i<79;i+=7){const p=gallery[i].clone(),t=gallery[i+1].clone().sub(gallery[i-1]).normalize();p.x-=t.z*.65;p.z+=t.x*.65;lanternCount++;
  sphere(rig,p.x,2.87,p.z,.19,.28,.19,lanternMat);
  sphere(rig,p.x,3.13,p.z,.13,.035,.13,red);sphere(rig,p.x,2.61,p.z,.11,.04,.11,red);
  tube(rig,[new THREE.Vector3(p.x,3.16,p.z),new THREE.Vector3(p.x,3.64,p.z)],.013,red);
  tube(rig,[new THREE.Vector3(p.x,2.59,p.z),new THREE.Vector3(p.x,2.43,p.z)],.018,gold);
 }
 for(const i of [9,29,49,69]){const p=gallery[i],l=new THREE.PointLight('#ffe2b2',8,7,2);l.name='Gallery_warm_white_wash_'+i;l.position.set(p.x,2.9,p.z);rig.add(l);}
 // Recessed ribbons light the walkway without tracing the outer bank in neon.
 for(const side of [-.7,.7]){const pts=gallery.map((p,i)=>{const t=gallery[Math.min(80,i+1)].clone().sub(gallery[Math.max(0,i-1)]).normalize();return new THREE.Vector3(p.x-t.z*side,3.47,p.z+t.x*side);});tube(rig,pts,.016,vertical);}
 for(const {parent,mat,geos} of bins.values()){const geo=mergeGeometries(geos,false),mesh=new THREE.Mesh(geo,mat);mesh.name=mat.name||'Lantern_fittings';mesh.castShadow=false;mesh.receiveShadow=true;parent.add(mesh);geos.forEach(g=>g.dispose());}
 // A translucent ripple layer is clipped by the actual river mesh; it never covers planting or quays.
 const c=document.createElement('canvas');c.width=512;c.height=512;const ctx=c.getContext('2d');
 for(let row=0;row<140;row++){const y=8+row*3.5,fade=Math.pow(1-y/512,1.6),center=256+Math.sin(row*2.31)*22,width=(35+Math.sin(row*.87)*19)*(1+row/100);
  for(let j=0;j<5;j++){const x=center+(j-2)*width*.7+Math.sin(row*3.1+j)*16;ctx.strokeStyle=`rgba(255,177,67,${fade*(.14+.22*(Math.sin(row*7+j)*.5+.5))})`;ctx.lineWidth=1+((row+j)%3);ctx.beginPath();ctx.moveTo(x-width*.35,y);ctx.quadraticCurveTo(x,y+Math.sin(row+j)*2,x+width*.35,y);ctx.stroke();}}
 const reflectionTex=new THREE.CanvasTexture(c);reflectionTex.colorSpace=THREE.SRGBColorSpace;
 const reflectionMat=new THREE.MeshBasicMaterial({map:reflectionTex,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});reflectionMat.name='Warm_broken_water_reflection';
 const reflection=new THREE.Group();reflection.name='Pavilion_reflected_light';rig.add(reflection);
 groups.water.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.clone(),p=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)-13.5)/28,1-(p.getZ(i)-17.6)/14);const m=new THREE.Mesh(geo,reflectionMat);m.position.y=.025;m.renderOrder=3;reflection.add(m);});
 return {rig,overrides,lanternCount,lightCount:8,setEnabled(enabled){rig.visible=enabled;reflection.visible=enabled&&groups.water.visible;for(const o of overrides)o.object.material=enabled?o.night:o.day;},syncWater(){reflection.visible=rig.visible&&groups.water.visible;}};
}
