import * as THREE from 'three';
import {windowFloorSettings} from './window-light.mjs';
import {SURFACE_ZONES,normalizeSurfaceSpill,sourceLevel,sourceColor,surfaceFloorSettings} from './surface-spill-profiles.mjs';
export const WORLD_PER_METRE=.53/1.65;
const ZONES=Object.keys(SURFACE_ZONES),NEAR=.025,FAR=30*WORLD_PER_METRE+.5,TILE=192;
// Up to four nearby sources per zone per fragment, not four sources per building.
// Every window has a persistent emitter; switching other zones never removes it.
export function uniformSources(points,limit=64){
 if(points.length<=limit)return points;
 const chosen=[points[0]],distance=new Float64Array(points.length).fill(Infinity);
 while(chosen.length<limit){const last=chosen[chosen.length-1];let best=-1,max=-1;for(let i=0;i<points.length;i++){distance[i]=Math.min(distance[i],points[i].position.distanceToSquared(last.position));if(distance[i]>max){max=distance[i];best=i;}}if(best<0||max<1e-8)break;chosen.push(points[best]);}
 return chosen;
}
export function buildClusters(sources,bounds){
 const min=bounds.min.clone().addScalar(-FAR),size=bounds.getSize(new THREE.Vector3()).addScalar(2*FAR);
 const dims=[Math.min(48,Math.max(4,Math.ceil(size.x/.65))),Math.min(24,Math.max(4,Math.ceil(size.y/.65))),Math.min(48,Math.max(4,Math.ceil(size.z/.65)))];
 const data=new Float32Array(dims[0]*6*dims[1]*dims[2]*4),groups=ZONES.map((_,z)=>sources.map((s,i)=>({s,i})).filter(v=>v.s.zoneIndex===z));
 for(let z=0;z<dims[2];z++)for(let y=0;y<dims[1];y++)for(let x=0;x<dims[0];x++){
  const p=new THREE.Vector3(min.x+(x+.5)/dims[0]*size.x,min.y+(y+.5)/dims[1]*size.y,min.z+(z+.5)/dims[2]*size.z);
  for(let zone=0;zone<6;zone++){const nearest=[];for(const {s,i}of groups[zone]){const d=p.distanceToSquared(s.position);if(nearest.length===4&&d>=nearest[3].d)continue;nearest.push({i,d});nearest.sort((a,b)=>a.d-b.d);if(nearest.length>4)nearest.pop();}const at=((z*dims[1]+y)*(dims[0]*6)+zone*dims[0]+x)*4;for(let k=0;k<nearest.length;k++)data[at+k]=nearest[k].i+1;}
 }
 return {data,dims,min,size};
}
const GLSL=`
varying vec3 vDsWorld;
uniform highp sampler3D dsClusters;
uniform sampler2D dsSources,dsShadows;
uniform vec3 dsMin,dsExtent;
uniform ivec3 dsGrid;
uniform float dsOn[6];
uniform float dsCount,dsAtlasColumns,dsAtlasTile;
vec3 dsCell(vec3 world,vec3 N,ivec3 cell,int zone){
 cell=clamp(cell,ivec3(0),dsGrid-1);
 vec3 sum=vec3(0.);
 vec4 indices=texelFetch(dsClusters,ivec3(cell.x+zone*dsGrid.x,cell.y,cell.z),0);
  for(int slot=0;slot<4;slot++){
   int id=int(indices[slot]) - 1;if(id<0)continue;
   vec4 source=texelFetch(dsSources,ivec2(id,0),0),colorRange=texelFetch(dsSources,ivec2(id,2),0);
   vec3 delta=world-source.xyz;float d=length(delta);if(d>=colorRange.w||d<.015)continue;
   vec3 ray=delta/d;float facing=max(0.,dot(N,-ray));if(facing<.001)continue;
   vec4 aim=texelFetch(dsSources,ivec2(id,1),0),shape=texelFetch(dsSources,ivec2(id,3),0);
   float cosine=dot(ray,aim.xyz),cone=smoothstep(aim.w,shape.x,cosine);if(cone<.001)continue;
   float visibility=1.;
   if(shape.y>.5){
    vec3 right=normalize(cross(aim.xyz,vec3(0.,1.,0.))),up=cross(right,aim.xyz);
    float forward=dot(delta,aim.xyz),tanHalf=sqrt(max(0.,1.-aim.w*aim.w))/max(.001,aim.w);
    vec2 projected=vec2(dot(delta,right),dot(delta,up))/(forward*tanHalf)*.5+.5;
    float depth=(${FAR.toFixed(8)} / (${FAR.toFixed(8)}-${NEAR})) - (${FAR.toFixed(8)}*${NEAR})/((${FAR.toFixed(8)}-${NEAR})*forward);
    vec2 tile=vec2(mod(float(id),dsAtlasColumns),floor(float(id)/dsAtlasColumns));
    // Bias measured in world units; prevents the source facade from shadowing
    // itself while preserving roof/wall occlusion on the external receivers.
    float bias=.00015+.00015*(1.-facing);visibility=0.;
    for(int tap=0;tap<4;tap++){
     vec2 offset=vec2(float(tap%2)-.5,float(tap/2)-.5)/dsAtlasTile;
     vec2 local=clamp(projected+offset,vec2(.5/dsAtlasTile),vec2(1.-.5/dsAtlasTile));
     float stored=unpackRGBAToDepth(texture2D(dsShadows,(tile+local)/dsAtlasColumns));
     visibility+=step(depth-bias,stored)*.25;
    }
   }
   float fade=pow(max(0.,1.-pow(d/colorRange.w,4.)),2.);
   sum+=colorRange.rgb*source.w*cone*fade*facing*visibility/max(.20,d*d);
  }
 return sum;
}
vec3 dsIrradiance(vec3 world,vec3 N){
 vec3 uv=(world-dsMin)/dsExtent;
 if(any(lessThan(uv,vec3(0.)))||any(greaterThan(uv,vec3(1.))))return vec3(0.);
 vec3 grid=uv*vec3(dsGrid)-.5,f=fract(grid);ivec3 cell=ivec3(floor(grid));
 // Tetrahedral interpolation is continuous across grid cells, unlike choosing
 // a different four-light set abruptly at each cell boundary.
 ivec3 order=ivec3(0,1,2);
 if(f[order.x]<f[order.y]){int t=order.x;order.x=order.y;order.y=t;}
 if(f[order.y]<f[order.z]){int t=order.y;order.y=order.z;order.z=t;}
 if(f[order.x]<f[order.y]){int t=order.x;order.x=order.y;order.y=t;}
 ivec3 first=ivec3(0),second=ivec3(0);first[order.x]=1;second=first;second[order.y]=1;
 vec4 weights=vec4(1.-f[order.x],f[order.x]-f[order.y],f[order.y]-f[order.z],f[order.z]);
 vec3 sum=vec3(0.);
 for(int zone=0;zone<6;zone++){
  if(dsOn[zone]<.5)continue;
  sum+=dsCell(world,N,cell,zone)*weights.x;
  sum+=dsCell(world,N,cell+first,zone)*weights.y;
  sum+=dsCell(world,N,cell+second,zone)*weights.z;
  sum+=dsCell(world,N,cell+ivec3(1),zone)*weights.w;
 }
 return sum;
}
`;
export function createDistributedSpill(scene,root,floor,renderer,anchors){
 const sources=[];for(const [zoneIndex,zone]of ZONES.entries())for(const a of zone==='window'?anchors[zone]:uniformSources(anchors[zone]))sources.push({...a,position:a.position.clone().addScaledVector(a.normal,.065),zoneIndex,zone});
 const bounds=new THREE.Box3().setFromObject(root),cluster=buildClusters(sources,bounds),texture=new THREE.Data3DTexture(cluster.data,cluster.dims[0]*6,cluster.dims[1],cluster.dims[2]);texture.format=THREE.RGBAFormat;texture.type=THREE.FloatType;texture.minFilter=texture.magFilter=THREE.NearestFilter;texture.needsUpdate=true;
 const records=new Float32Array(Math.max(1,sources.length)*16),sourceTexture=new THREE.DataTexture(records,Math.max(1,sources.length),4,THREE.RGBAFormat,THREE.FloatType);sourceTexture.needsUpdate=true;
 const columns=Math.max(1,Math.ceil(Math.sqrt(sources.length))),tile=Math.min(TILE,Math.floor((renderer.capabilities?.maxTextureSize||4096)/columns)),target=new THREE.WebGLRenderTarget(columns*tile,columns*tile,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true});target.texture.colorSpace=THREE.NoColorSpace;
 const uniforms={dsClusters:{value:texture},dsSources:{value:sourceTexture},dsShadows:{value:target.texture},dsMin:{value:cluster.min},dsExtent:{value:cluster.size},dsGrid:{value:new THREE.Vector3(...cluster.dims)},dsOn:{value:new Float32Array(6)},dsCount:{value:sources.length},dsAtlasColumns:{value:columns},dsAtlasTile:{value:tile}};
 const originals=new Map(),materials=[],group=new THREE.Group();group.name='建筑分区环境投光';const shadowScene=new THREE.Scene(),depthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});let active=false,disposed=false,initialized=false,shadowPasses=0;const signatures=new Map(),pending=new Set();
 root.updateMatrixWorld(true);root.traverse(o=>{if(!o.isMesh)return;const clone=new THREE.Mesh(o.geometry,depthMaterial);clone.matrixAutoUpdate=false;clone.matrix.copy(o.matrixWorld);shadowScene.add(clone);});
 function attach(mesh){if(!mesh.isMesh)return;originals.set(mesh,mesh.material);const wrap=original=>{if(!original.isMeshStandardMaterial)return original;const m=original.clone(),compile=original.onBeforeCompile,key=original.customProgramCacheKey();materials.push(m);m.onBeforeCompile=shader=>{compile.call(original,shader);Object.assign(shader.uniforms,uniforms);shader.vertexShader='varying vec3 vDsWorld;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvDsWorld=(modelMatrix*vec4(transformed,1.)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('void main() {',GLSL+'\nvoid main() {');shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`vec3 dsN=normalize(inverseTransformDirection(nonPerturbedNormal,viewMatrix));\noutgoingLight+=dsIrradiance(vDsWorld,dsN)*diffuseColor.rgb*(1.-metalnessFactor)/3.14159265;\n#include <opaque_fragment>`);};m.customProgramCacheKey=()=>key+'-distributed-spill-v2';return m;};mesh.material=Array.isArray(mesh.material)?mesh.material.map(wrap):wrap(mesh.material);}
 root.traverse(attach);if(floor)attach(floor);
 const color=new THREE.Color(),camera=new THREE.PerspectiveCamera(120,1,NEAR,FAR);
 function configure(value,base,window,master=true){
  if(disposed)return;
  const p=normalizeSurfaceSpill(value);
  uniforms.dsOn.value.fill(0);
  for(let i=0;i<sources.length;i++){
   const source=sources[i],{zone,zoneIndex}=source;
   // Select the corresponding window storey before writing emitter color,
   // range, cone, shadows and power. Other surface zones stay unchanged.
   const split=zone==='window'&&p.window.floors&&source.floor;
   const s=split?surfaceFloorSettings(p.window,source.floor):p[zone];
   const w=zone==='window'&&window.floors&&source.floor?windowFloorSettings(window,source.floor):window;
   const on=master&&s.enabled&&s.intensity>0&&sourceLevel(zone,base,w)>0;
   source.active=Boolean(on);
   if(!on){records[i*4+3]=0;pending.delete(i);continue;}
   uniforms.dsOn.value[zoneIndex]=1;
   const signature=[s.angle,s.azimuth,s.elevation].join(':');
   color.set(sourceColor(zone,base,w));
   const yaw=THREE.MathUtils.degToRad(s.azimuth),pitch=THREE.MathUtils.degToRad(s.elevation),angle=THREE.MathUtils.degToRad(s.angle/2),inner=Math.cos(angle*(1-s.softness));
   const direction=source.normal.clone().applyAxisAngle(new THREE.Vector3(0,1,0),yaw).multiplyScalar(Math.cos(pitch));direction.y=Math.sin(pitch);direction.normalize();source.direction=direction;source.angle=s.angle;source.shadow=s.shadows;
   records.set([...source.position.toArray(),s.intensity*sourceLevel(zone,base,w)*2.5],i*4);
   records.set([...direction.toArray(),Math.cos(angle)],sources.length*4+i*4);
   records.set([...color.toArray(),s.distance*WORLD_PER_METRE],sources.length*8+i*4);
   records.set([Math.max(Math.cos(angle)+.0001,inner),s.shadows?1:0,0,0],sources.length*12+i*4);
   if(s.shadows&&signatures.get(i)!==signature){pending.add(i);source.signature=signature;}else if(!s.shadows)pending.delete(i);
  }
  sourceTexture.needsUpdate=true;active=sources.some(s=>s.active);
  if(active)scene.add(group);else scene.remove(group);
 }
 function updateShadows(){if(disposed||!active||!pending.size&&initialized)return;const previousTarget=renderer.getRenderTarget(),viewport=renderer.getViewport(new THREE.Vector4()),scissor=renderer.getScissor(new THREE.Vector4()),scissorTest=renderer.getScissorTest(),clearColor=renderer.getClearColor(new THREE.Color()),clearAlpha=renderer.getClearAlpha(),autoClear=renderer.autoClear,xr=renderer.xr.enabled;renderer.xr.enabled=false;renderer.autoClear=false;
 try{renderer.setRenderTarget(target);renderer.setClearColor(0xffffff,1);if(!initialized){renderer.setScissorTest(false);renderer.clear();initialized=true;}renderer.setScissorTest(true);
 for(const i of pending){const s=sources[i];if(!s.active||!s.shadow)continue;camera.position.copy(s.position);camera.lookAt(s.position.clone().add(s.direction));camera.fov=s.angle;camera.updateProjectionMatrix();renderer.setViewport((i%columns)*tile,Math.floor(i/columns)*tile,tile,tile);renderer.setScissor((i%columns)*tile,Math.floor(i/columns)*tile,tile,tile);renderer.clear();renderer.render(shadowScene,camera);signatures.set(i,s.signature);pending.delete(i);shadowPasses++;}
 }finally{renderer.setRenderTarget(previousTarget);renderer.setViewport(viewport);renderer.setScissor(scissor);renderer.setScissorTest(scissorTest);renderer.setClearColor(clearColor,clearAlpha);renderer.autoClear=autoClear;renderer.xr.enabled=xr;}}
 return {anchors,group,sources,uniforms,configure,updateShadows,get stats(){const enabled=sources.filter(s=>s.active);return {active,lights:enabled.length,zones:enabled.map(s=>s.zone),available:Object.fromEntries(ZONES.map(z=>[z,anchors[z].length])),coverage:Object.fromEntries(ZONES.map(z=>[z,sources.filter(s=>s.zone===z).length])),shadowPasses,shading:'clustered-tetrahedral-4-neighbors-per-zone'};},dispose(){if(disposed)return;disposed=true;scene.remove(group);for(const [mesh,material]of originals)mesh.material=material;materials.forEach(m=>m.dispose());texture.dispose();sourceTexture.dispose();target.dispose();depthMaterial.dispose();shadowScene.clear();pending.clear();}};
}
