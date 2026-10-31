import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {LANTERN_LIGHT_KEY,LANTERN_GROUPS,normalizeLantern,normalizeLanternTransforms,readLanternRecord,saveLantern,saveLanternTransforms,applyClothLight} from '../import-lantern-settings.mjs';
import {spatialEmitterSample,EnvironmentVolume} from '../import-environment-volume.js';
import {GoldenTreeLanternLayer} from '../golden-tree-lantern-layer.js';
import {CourtyardLanternLayer} from '../courtyard-lantern-layer.js';
import {meshLanternEmitters,LanternLighting} from '../import-lantern-lighting.js';

test('absent controls preserve cloth tuning, disable and restore without losing its painted tint',()=>{
 const layer={},entry={tuning:{power:.71,color:'#fffaf2'},uniforms:{uClothPower:{value:0},uClothTint:{value:new THREE.Color()}}};
 applyClothLight(layer,'lion',entry,true);assert.equal(entry.uniforms.uClothPower.value,.71);assert.equal(entry.uniforms.uClothTint.value.getHexString(),'fffaf2');
 layer.lightControls={lion:normalizeLantern({brightness:2,inheritColor:false,color:'#ff0000'})};applyClothLight(layer,'lion',entry,true);assert.equal(entry.uniforms.uClothPower.value,1.42);assert.equal(entry.uniforms.uClothTint.value.getHexString(),'ff0000');
 layer.lightControls.lion.enabled=false;applyClothLight(layer,'lion',entry,true);assert.equal(entry.uniforms.uClothPower.value,0);
 layer.lightControls.lion=normalizeLantern();applyClothLight(layer,'lion',entry,true);assert.equal(entry.uniforms.uClothTint.value.getHexString(),'fffaf2');applyClothLight(layer,'lion',entry,false);assert.equal(entry.uniforms.uClothPower.value,0);
});
test('save is additive for unrelated lamps, old presets and unknown fields; no eager default writes',()=>{
 const old={version:1,future:9,groups:{lion:{future:7,spill:{future:8}},fish:{brightness:2}},presets:[{id:'old',name:'已有方案',group:'fish',settings:{brightness:2}}]};
 const map=new Map([[LANTERN_LIGHT_KEY,JSON.stringify(old)],['other','unchanged']]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 readLanternRecord(storage);assert.equal(map.get(LANTERN_LIGHT_KEY),JSON.stringify(old));
 assert.ok(saveLantern(storage,'lion',{brightness:0,spill:{enabled:true,color:'#123456'}},{id:'new',name:'新方案'}));
 const r=readLanternRecord(storage);assert.equal(r.future,9);assert.equal(r.groups.lion.future,7);assert.equal(r.groups.lion.spill.future,8);assert.equal(r.groups.lion.brightness,0);assert.deepEqual(r.groups.fish,old.groups.fish);assert.deepEqual(r.presets[0],old.presets[0]);assert.equal(r.presets[1].settings.spill.color,'#123456');assert.equal(map.get('other'),'unchanged');
 assert.equal(normalizeLantern({brightness:NaN,spill:{distance:Infinity,color:'bad'}}).brightness,1);
});
test('doubled brightness range preserves defaults and round-trips its new maximum',()=>{
 assert.equal(normalizeLantern().brightness,1);
 assert.equal(normalizeLantern({brightness:8}).brightness,8);
 assert.equal(normalizeLantern({brightness:99}).brightness,8);
 assert.equal(normalizeLantern({brightness:-1}).brightness,0);
 const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 assert.ok(saveLantern(storage,'lion',{brightness:8},{id:'maximum',name:'Maximum'}));
 const record=readLanternRecord(storage);
 assert.equal(record.groups.lion.brightness,8);
 assert.equal(record.presets[0].settings.brightness,8);
 const entry={tuning:{power:.71,color:'#fffaf2'},uniforms:{uClothPower:{value:0},uClothTint:{value:new THREE.Color()}}};
 applyClothLight({lightControls:{lion:normalizeLantern(record.groups.lion)}},'lion',entry,true);
 assert.equal(entry.uniforms.uClothPower.value,.71*8);
});
test('tengma placements save independently without removing existing lamp settings',()=>{
 const old={version:1,future:9,groups:{tengma:{brightness:1.6}},presets:[]};
 const map=new Map([[LANTERN_LIGHT_KEY,JSON.stringify(old)]]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const transforms=normalizeLanternTransforms({'tengma-left':{x:-8,y:12,z:-13,yaw:-75},'tengma-right':{x:-2,y:12,z:-13,yaw:75}});
 assert.ok(saveLanternTransforms(storage,transforms));
 const saved=readLanternRecord(storage);
 assert.equal(saved.future,9);assert.equal(saved.groups.tengma.brightness,1.6);
 assert.deepEqual(saved.transforms,transforms);
});
test('omnidirectional spill illuminates objects above, below and behind, with finite falloff and radius',()=>{
 const e={x:0,y:14,z:0,nx:0,nz:0,halfWidth:0,omni:true,radius:.3},p={distance:4,decayDistance:2,feather:.7,intensity:1};
 const a=spatialEmitterSample(0,14,1,e,p),b=spatialEmitterSample(0,14,-1,e,p),top=spatialEmitterSample(0,15,0,e,p);
 assert.ok(a.weight>0);assert.equal(a.weight,b.weight);assert.equal(a.weight,top.weight);assert.ok(top.y<0);assert.equal(spatialEmitterSample(0,20,0,e,p).weight,0);
 const volume=new EnvironmentVolume([16,16,16]);volume.begin(new THREE.Vector4(-8,-8,16,16));volume.addChannel({p,color:new THREE.Color('#ff0000'),energy:1,emitters:[e],cacheKey:'lamp'});volume.finish();assert.ok(volume.radiance.some((v,i)=>i%4===0&&v>0));assert.ok(!volume.radiance.some((v,i)=>i%4===1&&v>0));volume.dispose();
});
test('emitter positions include instance and parent transforms',()=>{
 const geometry=new THREE.BoxGeometry(1,2,1),material=new THREE.MeshStandardMaterial(),mesh=new THREE.InstancedMesh(geometry,material,2),parent=new THREE.Group();parent.position.set(10,12,20);parent.add(mesh);mesh.setMatrixAt(0,new THREE.Matrix4().makeTranslation(1,2,3));mesh.setMatrixAt(1,new THREE.Matrix4().makeTranslation(-1,2,3));const es=meshLanternEmitters([mesh]);assert.equal(es.length,2);assert.deepEqual(es.map(e=>[e.x,e.y,e.z]),[[11,14,23],[9,14,23]]);geometry.dispose();material.dispose();mesh.dispose();
});
test('tree and courtyard independent material controls survive night/wireframe toggles',()=>{
 const root=new THREE.Group(),tree=new GoldenTreeLanternLayer(root),court=new CourtyardLanternLayer(root,{trees:{},lanterns:tree});
 const tm=new THREE.MeshStandardMaterial(),cm=tm.clone();tree.fabric.push(tm);court.fabric.push(cm);tree.materials.add(tm);court.materials.add(cm);
 tree.lightControls={tree:normalizeLantern({brightness:2,inheritColor:false,color:'#ff0000'})};court.lightControls={courtyard:normalizeLantern({brightness:.5,inheritColor:false,color:'#00ff00'})};
 tree.setState({night:true});court.setState({night:true});assert.equal(tm.emissiveIntensity,1.7);assert.equal(cm.emissiveIntensity,.425);assert.equal(cm.emissive.getHexString(),'00ff00');assert.equal(tm.emissive.getHexString(),'ff0000');
 tree.setState({wireframe:true});assert.equal(tm.emissiveIntensity,0);assert.equal(cm.emissiveIntensity,.425);tree.setState({wireframe:false});assert.equal(tm.emissiveIntensity,1.7);court.dispose();tree.dispose();
});

test('model visibility defaults on and saves independently of illumination and existing presets',()=>{
 const map=new Map([[LANTERN_LIGHT_KEY,JSON.stringify({version:1,groups:{fish:{color:'#aabbcc'}},presets:[{id:'old',group:'fish',name:'原方案'}]})]]);
 const storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 assert.equal(normalizeLantern().modelVisible,true);assert.equal(normalizeLantern({brightness:2}).modelVisible,true);
 assert.ok(saveLantern(storage,'boat',{modelVisible:false,brightness:1.5,enabled:true,color:'#ff8040'}));
 const saved=readLanternRecord(storage);assert.equal(saved.groups.boat.modelVisible,false);assert.equal(saved.groups.boat.brightness,1.5);assert.equal(saved.groups.boat.enabled,true);assert.equal(saved.groups.fish.color,'#aabbcc');assert.equal(saved.presets[0].name,'原方案');
});

test('all registered lamp groups resolve native colours before async models load',()=>{
 const lighting=new LanternLighting({festival:{entries:new Map()},feature:{entries:new Map()},racks:{entries:new Map()}});
 for(const [id] of LANTERN_GROUPS)assert.match(lighting.baseColor(id),/^#[0-9a-f]{6}$/i,id+' must resolve before GLB loading');
 assert.equal(lighting.baseColor('tengma'),'#fff0dc');
 for(const [kind,color] of Object.entries({green:'#87c950',blue:'#6aafff',gold:'#ffd16d',red:'#ff7962'}))assert.equal(lighting.baseColor('rack-'+kind),color);
 lighting.racks.entries.set('rack-green',{color:'#123456'});assert.equal(lighting.baseColor('rack-green'),'#123456');
});
