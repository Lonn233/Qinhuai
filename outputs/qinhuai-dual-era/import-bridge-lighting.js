import * as THREE from 'three';
import {BRIDGE_NODES,BRIDGE_PRESET} from './import-bridge-config.mjs';
// A texture-sensitive wash on the original bridge only. No replacement mesh,
// floating luminous lines, added shadow lights, or scene exposure changes.
export function bridgeNightMaterial(original,part){
 const m=original.clone(),preset=BRIDGE_PRESET[part];
 m.emissive.set(preset.color);m.emissiveIntensity=preset.energy;
 m.emissiveMap=null;m.userData.buildingLightRole=part;m.userData.bridgePhotoPreset=true;
 const compile=original.onBeforeCompile,key=original.customProgramCacheKey.bind(original);
 m.onBeforeCompile=(s,r)=>{
  compile.call(m,s,r);
  s.vertexShader='varying vec3 vBridgeWorld;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvBridgeWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
  s.fragmentShader='varying vec3 vBridgeWorld;\n'+s.fragmentShader;
  const profile=part==='bridgeRail'?'(.35+.65*exp(-pow((vBridgeWorld.y-11.94)/.18,2.)))':part==='bridgeBody'?'(.48+.52*exp(-pow((vBridgeWorld.y-11.58)/.46,2.)))':part==='bridgeArch'?'(.65+.35*exp(-pow((vBridgeWorld.y-11.40)/.40,2.)))':'1.';
  s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
   float bridgeStone=clamp(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),0.,1.);
   float bridgeRelief=.80+.20*abs(normal.y);
   totalEmissiveRadiance*=(${profile})*(.13+.87*sqrt(bridgeStone))*bridgeRelief;
  `);
 };
 m.customProgramCacheKey=()=>key()+'-bridge-photo-v1-'+part;m.needsUpdate=true;return m;
}
export function attachBridgeLighting(byName,bindings,enabled){
 const materials=[];
 for(const [name,part] of Object.entries(BRIDGE_NODES)){
  const mesh=byName.get(name);if(!mesh)continue;
  const day=mesh.material,night=(Array.isArray(day)?day:[day]).map(m=>bridgeNightMaterial(m,part));
  const binding={mesh,day,night:Array.isArray(day)?night:night[0]};bindings.push(binding);materials.push(...night);
  if(enabled)mesh.material=binding.night;
 }
 return materials;
}
