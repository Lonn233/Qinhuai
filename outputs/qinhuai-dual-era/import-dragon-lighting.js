import * as THREE from 'three';
import {DRAGON_PARTS,normalizeDragon} from './import-dragon-controls.mjs';
export const DRAGON_NODES={FuziTemple0664:'left',FuziTemple0670:'left',FuziTemple0667:'right',FuziTemple0668:'right',FuziTemple0665:'pearl',FuziTemple0666:'pearl',FuziTemple0671:'base',FuziTemple0672:'roof',FuziTemple0673:'wall'};
// Exact audited meshes only. Each clone keeps its original UVs, albedo and depth offset.
export class DragonWallLighting {
 constructor(scene){this.settings=normalizeDragon();this.bindings=[];this.night=false;this.modelVisible=true;this.wireframe=false;this.root=new THREE.Group();this.root.name='龙墙分区外溢';scene.add(this.root);this.lights=new Map();for(const def of DRAGON_PARTS){const light=new THREE.PointLight(def.color,0,def.distance,2);light.position.fromArray(def.position);light.castShadow=false;this.root.add(light);this.lights.set(def.id,light);}this.uniforms=Object.fromEntries(DRAGON_PARTS.map(p=>[p.id,{color:{value:new THREE.Color(p.color)},energy:{value:0}}]));this.texture={value:.8};}
 registerTile(id,object){if(Number(id)!==5||this.bindings.length)return;object.traverse(mesh=>{const part=DRAGON_NODES[mesh.name];if(!mesh.isMesh||!part)return;const original=mesh.material;const source=Array.isArray(original)?original:[original];const materials=source.map(old=>{const m=old.clone();m.name=old.name+' / dragon '+part;m.emissive.set(0xffffff);m.emissiveIntensity=1;m.emissiveMap=null;const u=this.uniforms[part],accent=this.uniforms.accent;
 m.onBeforeCompile=shader=>{shader.uniforms.qhDragonColor=u.color;shader.uniforms.qhDragonEnergy=u.energy;shader.uniforms.qhDragonTexture=this.texture;shader.uniforms.qhDragonAccent=accent.color;shader.uniforms.qhDragonAccentEnergy=accent.energy;
 shader.vertexShader='varying vec3 vQhDragonWorld;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvQhDragonWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
 shader.fragmentShader='varying vec3 vQhDragonWorld; uniform vec3 qhDragonColor; uniform float qhDragonEnergy; uniform float qhDragonTexture; uniform vec3 qhDragonAccent; uniform float qhDragonAccentEnergy;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 float detail=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
 vec3 cloth=mix(vec3(1.0),mix(vec3(max(detail,.025)),diffuseColor.rgb,.7),qhDragonTexture);
 float shape=${part==='base'?'(1.0-smoothstep(11.62,11.95,vQhDragonWorld.y))':part==='roof'?'mix(.3,1.0,1.0-smoothstep(13.24,13.34,vQhDragonWorld.y))':part==='wall'?'mix(.5,1.15,smoothstep(11.55,12.8,vQhDragonWorld.y))':'1.0'};
 totalEmissiveRadiance=cloth*qhDragonColor*qhDragonEnergy*shape;
 ${['left','right','pearl'].includes(part)?'float accentMask=(1.0-smoothstep(12.0,12.27,vQhDragonWorld.y))*exp(-pow((vQhDragonWorld.x+9.43)/2.0,2.0)); totalEmissiveRadiance=mix(totalEmissiveRadiance,cloth*qhDragonAccent*qhDragonAccentEnergy,accentMask*step(.001,qhDragonAccentEnergy));':''}
 `);};m.customProgramCacheKey=()=> 'dragon-wall-v1-'+part;return m;});this.bindings.push({mesh,original,night:Array.isArray(original)?materials:materials[0],materials,part});});this.apply();}
 setSettings(value){this.settings=normalizeDragon(value);this.apply();}
 setState(next){Object.assign(this,next);this.apply();}
 apply(){const s=this.settings,active=this.night&&this.modelVisible&&!this.wireframe&&s.enabled;this.texture.value=s.texture;this.root.visible=active&&this.bindings.length>0;for(const part of DRAGON_PARTS){const p=s.parts[part.id],u=this.uniforms[part.id];u.color.value.set(p.color);u.energy.value=p.enabled?p.brightness*s.master:0;const light=this.lights.get(part.id);light.color.set(p.color);light.intensity=active&&p.enabled&&p.distance>0?p.spill*s.master*p.brightness*2:0;light.distance=Math.max(.001,p.distance);}
 for(const b of this.bindings)b.mesh.material=active?b.night:b.original;
 }
 dispose(){for(const b of this.bindings){b.mesh.material=b.original;for(const m of b.materials)m.dispose();}this.bindings=[];this.root.removeFromParent();this.root.clear();}
}
