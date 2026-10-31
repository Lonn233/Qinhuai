import {EnvironmentVolume,VOLUME_ENCODING,spatialEmitterSample} from './import-environment-volume.js';
import {hasWindowFloors,normalizeWindowFloors,WINDOW_FLOORS} from './import-window-floors.mjs';
import {normalizeGateGround,gateGroundWeight} from './import-gate-ground.mjs';
import {BRIDGE_PRESET} from './import-bridge-config.mjs';
import {normalizeBuilding} from './import-building-controls.mjs';
import * as THREE from 'three';
import {normalizeEnvironment} from './import-environment-controls.mjs';
import {environmentFocusBounds} from './import-environment-focus.mjs';
import {collectEnvironmentBuildings} from './import-environment-sources.mjs';
import {fallbackEnvironmentEmitters,environmentEmitterWeight,collectWindowEmitters} from './import-environment-emitters.js';
import {MATOU_GROUPS} from './import-matou-study.js';
import {TEMPLE_STUDY_NODES,PAVILION_STUDY_NODES} from './import-temple-study.js';

// Preserve the ground atlas and add a spatial irradiance volume for surroundings.
// No screen-space glow, floating window cards, point lights or shadow passes.
// Fixed texture sampling cost per fragment, independent of source count.
export const ENVIRONMENT_ATLAS_SIZE=1024;
const ENCODING=4;
const color=new THREE.Color();
export function environmentSourceLight(source,{temple={},pavilion={},matou={},gate={},styles={}}={},adjustment){
 const a=adjustment?normalizeBuilding(adjustment):null;
 const gain=part=>a?(a.enabled&&a.parts[part].enabled?a.brightness*a.parts[part].brightness:0):1;
 const tint=(part,original)=>a&&!a.parts[part].inheritColor?a.parts[part].color:original;
 const p=source.style==='temple'?temple:source.style==='pavilion'?pavilion:source.style==='matou'?matou:null;
 if(p){
  const rgb=new THREE.Color(0,0,0);let total=0;
  const components=source.style==='matou'?[['trimColor',p.window??0],['windowColor',(p.window??0)*.22],['color',p.eave??0]]:[['color',p.eave??0],['roofColor',p.roof??0],['facadeColor',p.facade??0],['windowColor',p.window??0]];
  for(const [key,baseWeight] of components){const part={trimColor:'trim',windowColor:'window',color:'eave',roofColor:'roof',facadeColor:'facade'}[key],weight=baseWeight*gain(part);if(weight<=0)continue;color.set(tint(part,p[key]||p.color||'#ffbc5f'));rgb.r+=color.r*weight;rgb.g+=color.g*weight;rgb.b+=color.b*weight;total+=weight;}
  const brightness=p.lightEnabled===false?0:Math.max(0,p.brightness??1);
  return {color:total?rgb.multiplyScalar(1/total):rgb,energy:total*brightness};
 }
 if(source.style==='bridge'){const rgb=new THREE.Color(0,0,0);let energy=0;for(const [part,p] of Object.entries(BRIDGE_PRESET)){const weight=p.energy*gain(part);color.set(tint(part,p.color));rgb.add(color.clone().multiplyScalar(weight));energy+=weight;}if(energy)rgb.multiplyScalar(1/energy);return {color:rgb,energy};}
 if(source.style==='gate')return {color:new THREE.Color(tint('eave',gate.roof?.color??0xffbc5f)),energy:Math.max(0,gate.roof?.edge??1)*gain('eave')};
 const style=styles[source.style]||styles.eave||{color:0xffba6a,energy:1};
 return {color:new THREE.Color(tint('eave',style.color)),energy:Math.max(0,style.energy)*gain('eave')};
}
// Floor windows use their actual facade strips and original emissive materials.
// Each floor has its own tint and falloff; the old roof / perimeter layer remains.
export function floorWindowChannels(building,adjustment,environment,emitters,materials=new Map()){
 if(!hasWindowFloors(building.id)||!adjustment?.windowFloors)return [];
 const a=normalizeBuilding(adjustment),parent=a.parts.window;
 if(!a.enabled||!parent.enabled)return [];
 const floors=normalizeWindowFloors(a.windowFloors,environment),channels=[];
 for(const [floor] of WINDOW_FLOORS){
  const f=floors[floor],p=f.spill;if(!f.enabled||!p.enabled||!f.brightness||!p.intensity||!p.distance||!p.decayDistance)continue;
  const strips=emitters.filter(e=>e.floor===floor);
  // Per-node channels preserve the source material's different brightnesses.
  for(const node of new Set(strips.map(e=>e.node))){
   const material=materials.get(node),study=material?.userData?.windowSource?.(),original=study?.color||material?.emissive?.clone()||new THREE.Color('#ffba70');
   const tint=!p.inheritColor?p.color:!f.inheritColor?f.color:!parent.inheritColor?parent.color:null;
   const c=tint?new THREE.Color(tint):original;
   const scope=material?.userData?.templeFocus;
   const gain=a.brightness*parent.brightness*f.brightness*(study?.energy??material?.emissiveIntensity??.576)*(scope?.peripheral?scope.outside:1);
   channels.push({p,color:c,energy:gain,emitters:strips.filter(e=>e.node===node),floor});
  }
 }
 return channels;
}
export function installEnvironmentReceiver(original,uniforms,{clone=true}={}){
 const material=clone?original.clone():original,compile=original.onBeforeCompile,cacheKey=original.customProgramCacheKey.bind(original);
 material.userData.environmentReceiver=true;
 material.onBeforeCompile=function(shader,renderer){
  compile.call(this,shader,renderer);
  Object.assign(shader.uniforms,uniforms);
  shader.vertexShader='varying vec3 vEnvWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`#include <project_vertex>
   vec4 envPosition=vec4(transformed,1.);
   #ifdef USE_INSTANCING
    envPosition=instanceMatrix*envPosition;
   #endif
   vEnvWorld=(modelMatrix*envPosition).xyz;
  `);
  shader.fragmentShader=`varying vec3 vEnvWorld;
   uniform sampler2D envIrradiance;
   uniform highp sampler3D envVolume;
   uniform highp sampler3D envVolumeDirection;
   uniform vec3 envVolumeOrigin;
   uniform vec3 envVolumeSpan;
   uniform vec4 envAtlasBounds;
   uniform float envActive;
  `+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <aomap_fragment>',`#include <aomap_fragment>
   if(envActive>.5){
    vec2 envUV=(vEnvWorld.xz-envAtlasBounds.xy)/envAtlasBounds.zw;
    if(all(greaterThanEqual(envUV,vec2(0.)))&&all(lessThanEqual(envUV,vec2(1.)))){
     // Water level 11.07 is excluded. Only low street / pavement surfaces
     // receive this independent layer; roofs and emitting facades are untouched.
     float envHeight=smoothstep(11.3,11.65,vEnvWorld.y)*(1.-smoothstep(12.25,12.65,vEnvWorld.y));
     vec3 envNormal=inverseTransformDirection(normal,viewMatrix);
     float envFacing=smoothstep(-.05,.65,envNormal.y);
     vec3 envLight=texture2D(envIrradiance,envUV).rgb*${ENCODING.toFixed(1)};
     // Imported diffuse maps contain baked darkness. Do not multiply this new
     // illumination by baked AO a second time; retain pavement texture contrast.
     vec3 envAlbedo=max(diffuseColor.rgb,vec3(.10));
     // FBX-exported pavement has metallicFactor=1 despite being baked stone.
     // This additional diffuse bounce must not be zeroed by that metadata.
     // Leave the original material / original lighting response unchanged.
     reflectedLight.directDiffuse+=envAlbedo*envLight*envHeight*envFacing*RECIPROCAL_PI;
     vec3 envUVW=(vEnvWorld-envVolumeOrigin)/envVolumeSpan;
     if(all(greaterThanEqual(envUVW,vec3(0.)))&&all(lessThanEqual(envUVW,vec3(1.)))){
      vec3 envSpatial=texture(envVolume,envUVW).rgb*${VOLUME_ENCODING.toFixed(1)};
      vec3 envDirection=(texture(envVolumeDirection,envUVW).rgb*255.-128.)/127.;
      // A directional moment gives a soft diffuse response without N real lights.
      float envDiffuse=.18+.82*max(0.,dot(envNormal,envDirection));
      // Pavement retains its existing pool; vertical / elevated surfaces use 3D spill.
      reflectedLight.directDiffuse+=envAlbedo*envSpatial*envDiffuse*(1.-envHeight*envFacing)*RECIPROCAL_PI;
     }
    }
   }
  `);
 };
 material.customProgramCacheKey=()=>cacheKey()+'|environment-receiver-v4-spatial';
 return material;
}
export class ImportEnvironmentSpill {
 constructor(){
  this.lanternChannels=[];this.buildings=[];this.emitters=new Map();this.saved={};this.loaded=new Set();this.receivers=new Map();this.materials=new Map();this.sourceState={};this.onCatalogChange=null;this.onDiagnostics=null;
  this.patched=new Map();this.installed=new WeakSet();this.volume=new EnvironmentVolume();this.night=false;
  this.active=false;this.dirty=true;this.configured=false;this.disposed=false;
  this.data=new Uint8Array(ENVIRONMENT_ATLAS_SIZE**2*4);this.accum=new Float32Array(ENVIRONMENT_ATLAS_SIZE**2*3);
  this.texture=new THREE.DataTexture(this.data,ENVIRONMENT_ATLAS_SIZE,ENVIRONMENT_ATLAS_SIZE,THREE.RGBAFormat,THREE.UnsignedByteType);
  this.texture.minFilter=this.texture.magFilter=THREE.LinearFilter;this.texture.generateMipmaps=false;this.texture.colorSpace=THREE.NoColorSpace;
  this.uniforms={envIrradiance:{value:this.texture},envAtlasBounds:{value:new THREE.Vector4()},envActive:{value:0},envVolume:{value:this.volume.texture},envVolumeDirection:{value:this.volume.directionTexture},envVolumeOrigin:{value:this.volume.origin},envVolumeSpan:{value:this.volume.span}};
  this.stats={buildings:0,receivers:0,activeSources:0,atlasUpdates:0,windowStrips:0};
 }
 configure(layout){
  if(this.configured||this.disposed)return;
  this.layout=layout;
  this.buildings=collectEnvironmentBuildings(layout,{matouGroups:MATOU_GROUPS,templeNodes:TEMPLE_STUDY_NODES,pavilionNodes:PAVILION_STUDY_NODES});
  const rs=this.buildings.map(b=>b.rect);if(!rs.length)return;
  const x=Math.min(...rs.map(r=>r[0]))-31,z=Math.min(...rs.map(r=>r[1]))-31;
  this.uniforms.envAtlasBounds.value.set(x,z,Math.max(...rs.map(r=>r[2]))+31-x,Math.max(...rs.map(r=>r[3]))+31-z);
  this.configured=true;this.stats.buildings=this.buildings.length;this.dirty=true;this.onCatalogChange?.();
 }
 setLanternChannels(channels){this.lanternChannels=channels;this.dirty=true;}
 getCatalog(){return this.buildings.map(b=>({id:b.id,label:b.label,defaultEnabled:b.defaultEnabled}));}
 getFocusTarget(id){const b=this.buildings.find(b=>b.id===id);return b?{id:b.id,label:b.label,tiles:[...b.tiles],bounds:environmentFocusBounds(b,this.layout)}:null;}
 getSettings(id){const b=this.buildings.find(b=>b.id===id);return normalizeEnvironment(this.saved[id],b?.defaultEnabled??false);}
 loadSettings(saved){this.saved={...saved};this.dirty=true;}
 setSettings(id,p){if(!this.buildings.some(b=>b.id===id))return;this.saved[id]=normalizeEnvironment(p,this.buildings.find(b=>b.id===id).defaultEnabled);this.dirty=true;}
 setSources(state){this.sourceState=state;this.dirty=true;}
 attachTile(id,object,tile,litNodes=new Set()){
  if(this.disposed||this.loaded.has(Number(id)))return;
  this.loaded.add(Number(id));object.updateWorldMatrix(true,true);
  for(const [key,emitters] of collectWindowEmitters(object,tile,this.buildings))this.emitters.set(key,[...(this.emitters.get(key)||[]),...emitters]);
  this.stats.windowStrips=[...this.emitters.values()].reduce((n,es)=>n+es.length,0);
  this.attachReceivers(object,{skip:litNodes});this.dirty=true;this.onWindowSourcesChange?.();
 }
 // Materials owned by the building rigs keep their existing day/night bindings
 // and live shader uniforms. Patch them in place, after the source-light hooks.
 patchMaterial(material){
  if(!material?.isMeshStandardMaterial||this.installed.has(material))return;
  this.patched.set(material,{compile:material.onBeforeCompile,key:material.customProgramCacheKey});
  installEnvironmentReceiver(material,this.uniforms,{clone:false});this.installed.add(material);material.needsUpdate=true;
 }
 attachBindings(bindings){
  for(const b of bindings)for(const m of Array.isArray(b.night)?b.night:[b.night])this.patchMaterial(m);
 }
 attachReceivers(object,{skip=new Set(),external=false}={}){
  object.traverse(mesh=>{
   if(!mesh.isMesh||skip.has(mesh.name)||mesh.name==='FuziTemple0038'||this.receivers.has(mesh))return;
   const day=mesh.material,list=Array.isArray(day)?day:[day];
   if(!list.every(m=>m?.isMeshStandardMaterial)||/water|river|水面/i.test(mesh.name+' '+list.map(m=>m.name).join(' ')))return;
   if(external){for(const m of list)this.patchMaterial(m);return;}
   const night=list.map(original=>{if(!this.materials.has(original)){const m=installEnvironmentReceiver(original,this.uniforms);this.installed.add(m);this.materials.set(original,m);}return this.materials.get(original);});
   this.receivers.set(mesh,{day,night:Array.isArray(day)?night:night[0]});if(this.night)mesh.material=Array.isArray(day)?night:night[0];
  });
  this.stats.receivers=this.receivers.size;this.stats.spatialMaterials=this.patched.size;
 }
 setState({night=false,modelVisible=true,wireframe=false}={}){
  this.night=night;this.active=night&&modelVisible&&!wireframe;this.uniforms.envActive.value=this.active?1:0;
  // Keep night clones during wireframe mode so the viewer's wireframe setting
  // is not lost by replacing its material after it was toggled.
  for(const [mesh,b] of this.receivers)mesh.material=night?b.night:b.day;
 }
 update(){
  if(!this.active||!this.dirty||!this.configured||this.disposed)return;
  const size=ENVIRONMENT_ATLAS_SIZE,{x:x0,y:z0,z:width,w:height}=this.uniforms.envAtlasBounds.value;
  this.accum.fill(0);this.volume.begin(this.uniforms.envAtlasBounds.value);let activeSources=0;
  for(const b of this.buildings){
   if(!b.tiles.some(id=>this.loaded.has(id)))continue;
   const p=this.getSettings(b.id),adjustment=this.buildingAdjustments?.[b.id],split=hasWindowFloors(b.id)&&!!adjustment?.windowFloors;
   const emitters=this.emitters.get(b.id)||fallbackEnvironmentEmitters(b.rect);
   const legacy=split?{...adjustment,parts:{...adjustment.parts,window:{...adjustment.parts?.window,enabled:false}}}:adjustment;
   const source=environmentSourceLight(b,this.sourceState,legacy),channels=[];
   if(!p.inheritColor)source.color.set(p.color);
   // At the new 90° default, preserve the original general layer's .32 ground spread.
   // Floor channels retain their independently configured cone angles.
   if(p.enabled&&p.intensity&&p.distance&&p.decayDistance&&source.energy>0)channels.push({p,...source,emitters,groundSpreadScale:.32});
   channels.push(...floorWindowChannels(b,adjustment,p,emitters,this.windowLightMaterials));
   for(const channel of channels){
    const {p,color,energy:power,emitters:es,groundSpreadScale=1}=channel;if(!es.length||power<=0)continue;
    this.volume.addChannel({...channel,cacheKey:b.id+'|'+(channel.floor?channel.floor+'|'+es[0].node:'source')});
    const reach=p.distance;
    const r=channel.floor?[Math.min(b.rect[0],...es.map(e=>e.x-e.halfWidth)),Math.min(b.rect[1],...es.map(e=>e.z-e.halfWidth)),Math.max(b.rect[2],...es.map(e=>e.x+e.halfWidth)),Math.max(b.rect[3],...es.map(e=>e.z+e.halfWidth))]:b.rect;
    const ix0=Math.max(0,Math.floor((r[0]-reach-x0)/width*size)),ix1=Math.min(size-1,Math.ceil((r[2]+reach-x0)/width*size));
    const iz0=Math.max(0,Math.floor((r[1]-reach-z0)/height*size)),iz1=Math.min(size-1,Math.ceil((r[3]+reach-z0)/height*size));
    for(let iz=iz0;iz<=iz1;iz++){const z=z0+(iz+.5)/size*height;for(let ix=ix0;ix<=ix1;ix++){
     const x=x0+(ix+.5)/size*width;
     // Max avoids doubling light from triangulated strips. Upper windows spread
     // over the same real ground, with attenuation for their additional height.
     let weight=0;for(const e of es)weight=Math.max(weight,environmentEmitterWeight(x,z,e,p,groundSpreadScale)/(channel.floor?1+Math.max(0,(e.y??12)-12)*.2:1));
     const energy=power*p.intensity*weight;if(!energy)continue;
     const i=(iz*size+ix)*3;this.accum[i]+=color.r*energy;this.accum[i+1]+=color.g*energy;this.accum[i+2]+=color.b*energy;
    }}
   }
   if(channels.length)activeSources++;
  }

  // Actual lantern positions illuminate both ground and elevated receivers.
  // Group maxima avoid over-bright accumulation from multipart GLBs / dense nets.
  for(const channel of this.lanternChannels){
   const {p,color,energy,emitters}=channel;
   if(!p.enabled||!p.intensity||!p.distance||!p.decayDistance||!energy||!emitters.length)continue;
   this.volume.addChannel(channel);
   const weights=new Map(),sample={};
   for(const e of emitters){
    const r=p.distance+(e.radius||0),xMin=Math.max(0,Math.floor((e.x-r-x0)/width*size)),xMax=Math.min(size-1,Math.ceil((e.x+r-x0)/width*size));
    const zMin=Math.max(0,Math.floor((e.z-r-z0)/height*size)),zMax=Math.min(size-1,Math.ceil((e.z+r-z0)/height*size));
    for(let iz=zMin;iz<=zMax;iz++)for(let ix=xMin;ix<=xMax;ix++){
     const weight=spatialEmitterSample(x0+(ix+.5)/size*width,11.9,z0+(iz+.5)/size*height,e,p,sample).weight;
     const index=iz*size+ix;if(weight>(weights.get(index)||0))weights.set(index,weight);
    }
   }
   for(const [index,weight] of weights){const k=index*3,power=weight*energy*p.intensity;this.accum[k]+=color.r*power;this.accum[k+1]+=color.g*power;this.accum[k+2]+=color.b*power;}
  }
  this.stats.lanternSources=this.lanternChannels.reduce((n,c)=>n+c.emitters.length,0);

  // The gate has an open passage. Perimeter emitters intentionally point
  // outward, so a separate center wash is needed beneath its three openings.
  const gate=this.buildings.find(b=>b.id==='gate');
  if(gate&&gate.tiles.some(id=>this.loaded.has(id))){
   const setting=normalizeBuilding(this.buildingAdjustments?.gate),p=normalizeGateGround(setting.groundProjection);
   if(setting.enabled&&setting.brightness>0&&p.enabled&&p.intensity>0&&p.width>0&&p.depth>0){
    const cx=-5.24+p.offsetX,cz=-13.46+p.offsetZ,reach=Math.hypot(p.width,p.depth)/2;
    const loX=Math.max(0,Math.floor((cx-reach-x0)/width*size)),hiX=Math.min(size-1,Math.ceil((cx+reach-x0)/width*size));
    const loZ=Math.max(0,Math.floor((cz-reach-z0)/height*size)),hiZ=Math.min(size-1,Math.ceil((cz+reach-z0)/height*size));
    const tint=new THREE.Color(p.color);
    for(let iz=loZ;iz<=hiZ;iz++)for(let ix=loX;ix<=hiX;ix++){
     const weight=gateGroundWeight(x0+(ix+.5)/size*width,z0+(iz+.5)/size*height,p)*p.intensity*setting.brightness;
     const i=(iz*size+ix)*3;this.accum[i]+=tint.r*weight;this.accum[i+1]+=tint.g*weight;this.accum[i+2]+=tint.b*weight;
    }
   }
  }
  for(let i=0,j=0;i<this.accum.length;i+=3,j+=4){this.data[j]=Math.min(255,Math.round(this.accum[i]/ENCODING*255));this.data[j+1]=Math.min(255,Math.round(this.accum[i+1]/ENCODING*255));this.data[j+2]=Math.min(255,Math.round(this.accum[i+2]/ENCODING*255));this.data[j+3]=255;}
  this.volume.finish();this.stats.volumeUpdates=this.volume.updates;
  this.texture.needsUpdate=true;this.dirty=false;this.stats.activeSources=activeSources;this.stats.atlasUpdates++;this.onDiagnostics?.(this.stats);
 }
 dispose(){if(this.disposed)return;for(const [mesh,b] of this.receivers)mesh.material=b.day;for(const m of this.materials.values())m.dispose();this.texture.dispose();this.volume.dispose();for(const [m,p] of this.patched){m.onBeforeCompile=p.compile;m.customProgramCacheKey=p.key;delete m.userData.environmentReceiver;m.needsUpdate=true;}this.patched.clear();this.materials.clear();this.receivers.clear();this.loaded.clear();this.emitters.clear();this.onCatalogChange=null;this.onDiagnostics=null;this.disposed=true;}
}
