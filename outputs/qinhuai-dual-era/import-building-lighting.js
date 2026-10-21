import {hasWindowFloors,WINDOW_FLOORS,normalizeWindowFloors,windowFloorSplit} from './import-window-floors.mjs';
import {BRIDGE_PARTS} from './import-bridge-config.mjs';
import * as THREE from 'three';
import {normalizeBuilding,BUILDING_PARTS} from './import-building-controls.mjs';
export const rolePart=role=>role?.startsWith('bridge')?role:role==='roof'?'roof':role==='window'?'window':role==='sign'?'sign':/trim/i.test(role||'')?'trim':'facade';
// Multipliers are an independent layer on the existing night shaders. Identity
// values reproduce the saved study, including its masks and unlit regions.
export class BuildingLightAdjustments {
 constructor(environment){this.environment=environment;this.saved={};this.uniforms=new Map();this.patched=new Map();this.fixtureMaterials=[];this.environment.windowLightMaterials=new Map();}
 get buildings(){return this.environment.buildings;}
 getWindowAvailability(id){const b=this.buildings.find(b=>b.id===id),es=(this.environment.emitters.get(id)||[]).filter(e=>e.floor);return {loaded:!!b&&b.tiles.every(t=>this.environment.loaded.has(t)),total:es.length,first:es.filter(e=>e.floor==='first').length,second:es.filter(e=>e.floor==='second').length};}
 getParts(id){const b=this.buildings.find(b=>b.id===id);if(!b)return [];if(b.style==='bridge')return BRIDGE_PARTS.map(p=>p[0]);const roles=new Set();for(const tile of Object.values(this.environment.layout?.tiles||{}))for(const r of tile.materials)if(b.nodes.includes(r.node))roles.add(rolePart(r.role));if(roles.has('roof'))roles.add('eave');if(b.style==='matou')return ['window','trim'];return BUILDING_PARTS.map(p=>p[0]).filter(p=>roles.has(p));}
 loadSettings(saved){this.saved={...saved};this.apply();this.onChange?.();}
 setSettings(id,value){this.saved[id]=normalizeBuilding(value);this.apply();this.onChange?.();}
 getUniform(id,part){const key=id+':'+part;if(!this.uniforms.has(key))this.uniforms.set(key,{value:new THREE.Vector4(1,1,1,0)});return this.uniforms.get(key);}
 apply(){for(const b of this.buildings){
  const s=normalizeBuilding(this.saved[b.id]);
  for(const [part] of BUILDING_PARTS){const p=s.parts[part],gain=s.enabled&&p.enabled?s.brightness*p.brightness:0;const c=new THREE.Color(p.inheritColor?'#ffffff':p.color);this.getUniform(b.id,part).value.set(c.r*gain,c.g*gain,c.b*gain,p.inheritColor?0:1);}
  if(hasWindowFloors(b.id))for(const [floor] of WINDOW_FLOORS){
   const p=s.parts.window,f=normalizeWindowFloors(s.windowFloors)[floor],gain=s.enabled&&p.enabled&&f.enabled?s.brightness*p.brightness*f.brightness:0;
   const inherit=f.inheritColor&&p.inheritColor,c=new THREE.Color(inherit?'#ffffff':f.inheritColor?p.color:f.color);
   this.getUniform(b.id,'window-'+floor).value.set(c.r*gain,c.g*gain,c.b*gain,inherit?0:1);
  }
 }this.environment.buildingAdjustments=this.saved;this.environment.dirty=true;}

 patch(material,buildings,part,{fixture=false,node=''}={}){
  if(!buildings.length||this.patched.has(material)||(!material.isMeshStandardMaterial&&!fixture))return;
  const compile=material.onBeforeCompile,key=material.customProgramCacheKey.bind(material),rows=[];
  for(const b of buildings){const i=rows.length;rows.push({b,name:'qhBuilding'+i,uniform:this.getUniform(b.id,part),eave:this.getUniform(b.id,'eave')});}
  this.patched.set(material,{compile,key});
  material.onBeforeCompile=(shader,renderer)=>{
   compile.call(material,shader,renderer);
   let declarations='varying vec3 vQhBuildingWorld;\n',body='vec3 qhBuildingAdjust(vec3 light, bool eave){\n';
   for(const row of rows){const {b,name,uniform,eave}=row;
    if(part==='window'&&hasWindowFloors(b.id)){
     shader.uniforms[name+'First']=this.getUniform(b.id,'window-first');shader.uniforms[name+'Second']=this.getUniform(b.id,'window-second');
     declarations+=`uniform vec4 ${name}First; uniform vec4 ${name}Second;\n`;
     const r=b.rect.map(n=>Number(n).toFixed(5));
     body+=`if(vQhBuildingWorld.x>=${r[0]} && vQhBuildingWorld.z>=${r[1]} && vQhBuildingWorld.x<=${r[2]} && vQhBuildingWorld.z<=${r[3]}){vec4 setting=vQhBuildingWorld.y<${windowFloorSplit(node).toFixed(5)}?${name}First:${name}Second;return mix(light,vec3(dot(light,vec3(.2126,.7152,.0722))),setting.w)*setting.rgb;}\n`;continue;
    }
    shader.uniforms[name]=uniform;shader.uniforms[name+'Eave']=eave;declarations+=`uniform vec4 ${name}; uniform vec4 ${name}Eave;\n`;const r=b.rect.map(n=>Number(n).toFixed(5));body+=`if(vQhBuildingWorld.x>=${r[0]} && vQhBuildingWorld.z>=${r[1]} && vQhBuildingWorld.x<=${r[2]} && vQhBuildingWorld.z<=${r[3]}){vec4 setting=eave?${name}Eave:${name}; return mix(light,vec3(dot(light,vec3(.2126,.7152,.0722))),setting.w)*setting.rgb;}\n`;}
   body+='return light; }\n';
   shader.vertexShader='varying vec3 vQhBuildingWorld;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`#include <project_vertex>
    vec4 qhBuildingPosition=vec4(transformed,1.);
    #ifdef USE_INSTANCING
    qhBuildingPosition=instanceMatrix*qhBuildingPosition;
    #endif
    vQhBuildingWorld=(modelMatrix*qhBuildingPosition).xyz;`);
   shader.fragmentShader=declarations+body+shader.fragmentShader;
   if(fixture)shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','outgoingLight=qhBuildingAdjust(outgoingLight,true);\n#include <opaque_fragment>');
   else if(part==='roof'&&shader.fragmentShader.includes('(bsRoofLight+bsEaveLight)'))shader.fragmentShader=shader.fragmentShader.replace('(bsRoofLight+bsEaveLight)','(qhBuildingAdjust(bsRoofLight,false)+qhBuildingAdjust(bsEaveLight,true))');
   else {
    const adjustment=part==='roof'&&shader.fragmentShader.includes('float qhWrap =')?'mix(qhBuildingAdjust(totalEmissiveRadiance,false),qhBuildingAdjust(totalEmissiveRadiance,true),clamp(qhWrap,0.,1.))':'qhBuildingAdjust(totalEmissiveRadiance,false)';
    shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_begin>',`totalEmissiveRadiance=${adjustment};\n#include <lights_fragment_begin>`);
   }
  };
  material.customProgramCacheKey=()=>key()+'-building-local-v2-floors-'+(part==='window'&&buildings.some(b=>hasWindowFloors(b.id))?windowFloorSplit(node):'')+'-'+part+'-'+buildings.map(b=>b.id).join('_');material.needsUpdate=true;
 }
 applyWashLight(light){
  if(!light?.isSpotLight)return;
  const x=light.target.position.x,z=light.target.position.z;
  const b=light.name==='天下文枢·牌匾洗亮'?this.buildings.find(b=>b.id==='gate'):this.buildings.find(b=>x>=b.rect[0]&&x<=b.rect[2]&&z>=b.rect[1]&&z<=b.rect[3]);
  if(!light.userData.buildingOriginalColor)light.userData.buildingOriginalColor=light.color.clone();
  light.color.copy(light.userData.buildingOriginalColor);
  if(!b)return;
  const s=normalizeBuilding(this.saved[b.id]),p=s.parts[b.id==='gate'?'sign':'facade'];
  light.intensity*=s.enabled&&p.enabled?s.brightness*p.brightness:0;
  if(!p.inheritColor)light.color.set(p.color);
 }
 attach(bindings,group,tileId){
  for(const binding of bindings){const buildings=this.buildings.filter(b=>b.nodes.includes(binding.mesh.name));if(!buildings.length)continue;for(const mat of Array.isArray(binding.night)?binding.night:[binding.night]){if(mat===binding.day||(Array.isArray(binding.day)&&binding.day.includes(mat)))continue;const role=mat.userData.buildingLightRole;if(role==='window'&&buildings.some(b=>hasWindowFloors(b.id)))this.environment.windowLightMaterials.set(binding.mesh.name,mat);if(role)this.patch(mat,buildings,rolePart(role),{node:binding.mesh.name});}}
  const buildings=this.buildings.filter(b=>b.tiles.includes(Number(tileId)));
  group.traverse(mesh=>{if(!mesh.isInstancedMesh||!mesh.userData.nightFixture)return;const original=mesh.material,material=original.clone();mesh.material=material;this.fixtureMaterials.push(material);this.patch(material,buildings,'eave',{fixture:true});});this.apply();
 }
 dispose(){for(const [m,p] of this.patched){m.onBeforeCompile=p.compile;m.customProgramCacheKey=p.key;m.needsUpdate=true;}for(const m of this.fixtureMaterials)m.dispose();this.environment.windowLightMaterials.clear();this.patched.clear();}
}
