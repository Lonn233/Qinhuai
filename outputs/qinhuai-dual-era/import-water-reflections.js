import {BRIDGE_ID,BRIDGE_NODES,BRIDGE_PRESET} from './import-bridge-config.mjs';
import {normalizeBuilding} from './import-building-controls.mjs';
import * as THREE from 'three';
import layout from './assets/qinhuai-modern-import/festival/layout.json' with {type:'json'};
import {normalizeMapLights} from './import-light-controls.mjs';
import {waterControls,applyWaterControls,WATER_UNIFORMS} from './import-light-effects.mjs';
import {MATOU_GROUPS,matouGroupForNode,retainedMatouFixtureSegments} from './import-matou-study.js';
import {PAVILION_STUDY_NODES,TEMPLE_STUDY_NODES} from './import-temple-study.js';
import {STREETLAMP_PLACEMENTS,STREETLAMP_HEIGHT} from './import-streetlamps.js';

// Lightweight light-only reflections, not a second rendering of the city.
// Sources are sampled from the existing light installation / lit source meshes.
export const REFLECTION_WATER_BOUNDS=[-21,-12,63,19];
export const REFLECTION_WATER_Y=layout.water.height+.014;
const triangles=layout.water.triangles;
function inside(x,z,t){
 const cross=(a,b)=>(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0]);
 const [a,b,c]=t;
 if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))<1e-9)return false;
 const u=cross(a,b),v=cross(b,c),w=cross(c,a);
 return !((u<0||v<0||w<0)&&(u>0||v>0||w>0));
}
export function waterDistance(x,z){
 let best=Infinity;
 for(const t of triangles){
  if(inside(x,z,t))return 0;
  for(let i=0;i<3;i++){
   const a=t[i],b=t[(i+1)%3],dx=b[0]-a[0],dz=b[1]-a[1];
   const u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));
   best=Math.min(best,Math.hypot(x-a[0]-u*dx,z-a[1]-u*dz));
  }
 }
 return best;
}
export function createRiverMask(){
 const width=512,height=192,data=new Uint8Array(width*height);
 const [x0,z0,w,h]=REFLECTION_WATER_BOUNDS;
 // Rasterize only each triangle's bounding rectangle; no image load or CORS dependency.
 for(const t of triangles){
  const minX=Math.max(0,Math.floor((Math.min(...t.map(p=>p[0]))-x0)/w*width));
  const maxX=Math.min(width-1,Math.ceil((Math.max(...t.map(p=>p[0]))-x0)/w*width));
  const minZ=Math.max(0,Math.floor((Math.min(...t.map(p=>p[1]))-z0)/h*height));
  const maxZ=Math.min(height-1,Math.ceil((Math.max(...t.map(p=>p[1]))-z0)/h*height));
  for(let y=minZ;y<=maxZ;y++)for(let x=minX;x<=maxX;x++)
   if(inside(x0+(x+.5)/width*w,z0+(y+.5)/height*h,t))data[y*width+x]=255;
 }
 const mask=new THREE.DataTexture(data,width,height,THREE.RedFormat);
 mask.minFilter=mask.magFilter=THREE.LinearFilter;mask.colorSpace=THREE.NoColorSpace;
 mask.generateMipmaps=false;mask.needsUpdate=true;return mask;
}
export function collectReflectionSources(tile,id,byName){
 const result={building:[],boat:[],street:[]},seen=new Set();
 function add(kind,position,style='eave',role='eave',width=.48,length=1.35){
  if(position.some(v=>!Number.isFinite(v))||position[1]<layout.water.height||waterDistance(position[0],position[2])>4)return;
  const key=[kind,style,role,...position.map(v=>Math.round(v/.65))].join(':');if(seen.has(key))return;seen.add(key);
  result[kind].push({position,style,role,width,length});
 }
 for(const f of tile.fixtures){
  if(!byName.has(f.node)||f.kind==='distant'||TEMPLE_STUDY_NODES.has(f.node)||PAVILION_STUDY_NODES.has(f.node))continue;
  const a=retainedMatouFixtureSegments(f),kind=f.kind==='boat'?'boat':'building';
  for(let i=0;i<a.length;i+=6){
   const start=a.slice(i,i+3),end=a.slice(i+3,i+6),n=Math.max(1,Math.ceil(Math.hypot(...start.map((v,k)=>end[k]-v))/.9));
   for(let j=0;j<n;j++)add(kind,start.map((v,k)=>v+(end[k]-v)*(j+.5)/n),f.kind,'eave',kind==='boat'?.38:.48,kind==='boat'?1.1:1.65);
  }
 }
 const rules=[...tile.materials,...MATOU_GROUPS.filter(g=>g.tile===Number(id)).flatMap(g=>g.rules)];
 const visited=new Set(),point=new THREE.Vector3();
 for(const rule of rules){
  const group=matouGroupForNode(rule.node),pavilion=PAVILION_STUDY_NODES.has(rule.node);
  const relevant=rule.role==='window'||(group&&rule.role==='trim')||(pavilion&&rule.role==='roof');
  if(!relevant||visited.has(rule.node)||TEMPLE_STUDY_NODES.has(rule.node))continue;
  const mesh=byName.get(rule.node),pos=mesh?.geometry?.getAttribute('position');if(!pos)continue;
  visited.add(rule.node);mesh.updateWorldMatrix(true,false);
  // Bounded sampling of actual source vertices, not synthetic façade/window positions.
  const stride=Math.max(1,Math.ceil(pos.count/160));
  for(let i=0;i<pos.count;i+=stride){
   point.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);
   const isMatou=group&&(group.minX===null||point.x>=group.minX);
   const style=isMatou?'matou':pavilion?'pavilion':'window';
   add('building',point.toArray(),style,rule.role,rule.role==='window'?.5:.42,1.6);
  }
 }
 // Sample the actual railing/stone geometry; the existing river mask clips
 // these broad, rippled reflections to water and excludes the land.
 if(Number(id)===9)for(const name of ['FuziTemple0307','FuziTemple0310','FuziTemple0314']){
  const mesh=byName.get(name),pos=mesh?.geometry?.attributes.position;if(!pos)continue;
  mesh.updateWorldMatrix(true,false);const step=Math.max(1,Math.ceil(pos.count/80));
  for(let i=0;i<pos.count;i+=step){point.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);add('building',point.toArray(),'bridge',BRIDGE_NODES[name],.55,1.5);}
 }
 for(const p of STREETLAMP_PLACEMENTS.filter(p=>p.tile===Number(id)))
  add('street',[p.x,p.y+STREETLAMP_HEIGHT*.78,p.z],'street','lamp',.65,1.7);
 return result;
}
function reflectionMaterial(controls,mask,time){
 return new THREE.ShaderMaterial({
  uniforms:{...controls,waterMask:{value:mask},waterY:{value:REFLECTION_WATER_Y},time},
  vertexShader:`${WATER_UNIFORMS}
   attribute vec3 sourcePosition; attribute vec2 sourceSize; attribute vec3 sourceColor; attribute float sourcePower;
   uniform float waterY; uniform float time;
   varying vec2 vUv; varying vec2 vWater; varying vec3 vColor; varying float vPower;
   void main(){
    vUv=uv;vColor=sourceColor;vPower=sourcePower;
    vec3 mirrored=vec3(sourcePosition.x,2.*waterY-sourcePosition.y,sourcePosition.z);
    float t=(waterY-cameraPosition.y)/min(mirrored.y-cameraPosition.y,-.0001);
    vec3 anchor=mix(cameraPosition,mirrored,clamp(t,0.,1.));
    vec2 ray=cameraPosition.xz-sourcePosition.xz;ray=length(ray)>.0001?normalize(ray):vec2(0.,1.);
    vec2 side=vec2(ray.y,-ray.x);
    vec2 offset=side*position.x*sourceSize.x*mapWaterWidth+ray*position.y*sourceSize.y*mapWaterLength;
    vec2 world=anchor.xz+offset;
    world+=side*sin(world.y*24.+time*1.6*mapWaterSpeed)*.025*mapWaterRipple;
    vWater=world;
    gl_Position=projectionMatrix*viewMatrix*vec4(world.x,waterY,world.y,1.);
   }`,
  fragmentShader:`${WATER_UNIFORMS}
   uniform sampler2D waterMask;uniform float time;
   varying vec2 vUv;varying vec2 vWater;varying vec3 vColor;varying float vPower;
   void main(){
    vec2 maskUv=(vWater-vec2(-21.,-12.))/vec2(63.,19.);
    if(any(lessThan(maskUv,vec2(0.)))||any(greaterThan(maskUv,vec2(1.))))discard;
    if(texture2D(waterMask,maskUv).r<.99)discard;
    vec2 p=abs(vUv-.5)*2.;
    float edge=(1.-smoothstep(.72,1.,p.x))*(1.-smoothstep(.72,1.,p.y));
    float envelope=exp(-(p.x*p.x*3.+p.y*p.y*1.8)*mapWaterFade)*edge;
    float phase=time*1.5*mapWaterSpeed;
    float wave=.7*sin(vWater.y*21.+sin(vWater.x*6.+phase*.2)+phase)+.3*sin(vWater.y*34.+vWater.x*3.-phase*.7);
    float ripple=1.-min(.95,.34*mapWaterRipple)*(1.-wave);
    float alpha=envelope*ripple*vPower*mapWaterIntensity;
    gl_FragColor=vec4(vColor,min(.8,alpha));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`,
  transparent:true,depthWrite:false,side:THREE.DoubleSide,
  blending:THREE.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,
 });
}
export class ImportWaterReflections {
 constructor(parent){
  this.root=new THREE.Group();this.root.name='River light reflections / buildings boats roadside';parent.add(this.root);
  this.controls=Object.fromEntries(['building','boat','street'].map(k=>[k,waterControls()]));
  this.time={value:0};this.batches=[];this.tiles=new Set();this.mask=null;this.materials=new Map();
  this.streetTiles=new Set();this.waterVisible=true;this.waterLoaded=false;this.root.visible=false;
 }
 setStreetTileReady(id){this.streetTiles.add(Number(id));for(const b of this.batches)if(b.kind==='street'&&b.tile===Number(id))b.mesh.visible=true;}
 registerWaterTile(id){if(Number(id)===layout.water.tile){this.waterLoaded=true;this.syncVisibility();}}
 attachTile(id,tile,byName){
  if(this.tiles.has(id))return;this.tiles.add(id);
  const groups=collectReflectionSources(tile,id,byName);
  for(const [kind,sources] of Object.entries(groups)){
   if(!sources.length)continue;
   if(!this.mask)this.mask=createRiverMask();
   if(!this.materials.has(kind))this.materials.set(kind,reflectionMaterial(this.controls[kind],this.mask,this.time));
   const plane=new THREE.PlaneGeometry(2,2),geometry=new THREE.InstancedBufferGeometry();
   geometry.index=plane.index;geometry.attributes={...plane.attributes};geometry.instanceCount=sources.length;
   geometry.setAttribute('sourcePosition',new THREE.InstancedBufferAttribute(new Float32Array(sources.flatMap(s=>s.position)),3));
   geometry.setAttribute('sourceSize',new THREE.InstancedBufferAttribute(new Float32Array(sources.flatMap(s=>[s.width,s.length])),2));
   geometry.setAttribute('sourceColor',new THREE.InstancedBufferAttribute(new Float32Array(sources.length*3),3));
   geometry.setAttribute('sourcePower',new THREE.InstancedBufferAttribute(new Float32Array(sources.length),1));
   const mesh=new THREE.Mesh(geometry,this.materials.get(kind));mesh.frustumCulled=false;mesh.name=`river-reflection-${kind}-tile-${id}`;
   mesh.userData.waterReflectionKind=kind;mesh.visible=kind!=='street'||this.streetTiles.has(Number(id));this.root.add(mesh);this.batches.push({kind,mesh,sources,tile:Number(id)});
   plane.dispose();
  }
 }
 apply(settings,{matou,pavilion,styles,buildingAdjustments={}}){
  const p=normalizeMapLights(settings);for(const [k,u] of Object.entries(this.controls))applyWaterControls(u,p,k);
  const color=new THREE.Color();
  for(const {kind,mesh,sources} of this.batches){
   const colors=mesh.geometry.getAttribute('sourceColor'),powers=mesh.geometry.getAttribute('sourcePower');
   sources.forEach((source,i)=>{
    const study=source.style==='matou'?matou:source.style==='pavilion'?pavilion:null;
    let power=kind==='boat'?.14:kind==='street'?.15:.065;
    if(study){
     const role=source.role==='trim'?'eave':source.role;
     color.set(source.role==='trim'?(study.trimColor||study.color):source.role==='window'?(study.windowColor||study.color):study.color);
     power*=study.lightEnabled===false?0:Math.max(0,study.brightness??1)*Math.max(0,study[role]??1)/2.5;
    }else color.set(source.style==='window'?0xffaa50:source.style==='street'?0xffc264:styles[source.style]?.color??0xffba6a);
    if(source.style==='bridge'){
     const setting=normalizeBuilding(buildingAdjustments[BRIDGE_ID]),part=setting.parts[source.role],base=BRIDGE_PRESET[source.role];
     color.set(part.inheritColor?base.color:part.color);power=.055*base.energy*(setting.enabled&&part.enabled?setting.brightness*part.brightness:0);
    }
    colors.setXYZ(i,color.r,color.g,color.b);powers.setX(i,power);
   });colors.needsUpdate=powers.needsUpdate=true;
  }
 }
 setWaterVisible(value){this.waterVisible=!!value;this.syncVisibility();}
 setSceneReflectionEnabled(value){this.sceneReflectionEnabled=!!value;this.syncVisibility();}
 syncVisibility(){this.root.visible=this.waterVisible&&this.waterLoaded&&!this.sceneReflectionEnabled;}
 update(time){this.time.value=time;}
 get stats(){return Object.fromEntries(['building','boat','street'].map(k=>[k,this.batches.filter(b=>b.kind===k).reduce((n,b)=>n+b.sources.length,0)]));}
 dispose(){this.root.removeFromParent();for(const b of this.batches)b.mesh.geometry.dispose();for(const m of this.materials.values())m.dispose();this.mask?.dispose();this.batches=[];this.tiles.clear();this.root.clear();}
}
