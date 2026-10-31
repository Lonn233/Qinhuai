import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {WOMAN_PLACEMENT,FeatureLanternLayer} from '../import-feature-lanterns.js';
import {waterClearance} from '../import-festival-lanterns.js';
import {bridgeLanternPlacements} from '../import-bridge-lanterns.js';
import {RedLanternLayer} from '../red-lantern-layer.js';
import {BUILDING_LIGHT_KEY,normalizeBuilding,readBuildingLights,writeBuildingLight} from '../import-building-controls.mjs';

test('the sky fish are removed and Wende Bridge lanterns alternate on both rails',()=>{
 const layer=new FeatureLanternLayer(new THREE.Group());assert.equal(layer.stats.fish,0);layer.dispose();
 const placements=bridgeLanternPlacements();assert.equal(placements.length,16);
 for(const side of [-1,1]){const row=placements.filter(p=>p.side===side);assert.equal(row.length,8);for(let i=1;i<row.length;i++)assert.notEqual(row[i].kind,row[i-1].kind);}
 assert.ok(placements.every(p=>p.x>=-22.92&&p.x<=-18.67&&p.z>=-9.53&&p.z<=4.97));
});

test('woman stays in water, faces bridge and respects water visibility',()=>{
 assert.equal(WOMAN_PLACEMENT.heightMeters,9);
 assert.ok(waterClearance(WOMAN_PLACEMENT,.5));
 const front=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),WOMAN_PLACEMENT.yaw);
 assert.ok(front.x<0&&front.z<0);
 const layer=new FeatureLanternLayer(new THREE.Group()),group=new THREE.Group();
 const reflection=new THREE.Object3D();reflection.name='feature-woman-reflection';group.add(reflection);
 layer.entries.set('woman',{group,uniforms:{uClothPower:{value:0},uClothTint:{value:new THREE.Color()}},tuning:{power:.65,color:'#fff0dc'},materials:[],meshes:[reflection],reflections:[]});
 layer.setState({night:true});assert.equal(reflection.visible,true);
 layer.setState({waterVisible:false});assert.equal(group.visible,false);assert.equal(reflection.visible,false);
 layer.entries.clear();layer.dispose();assert.equal(layer.root.parent,null);
});

test('per-building lantern switch independently hides both pendants and receivers, including late groups',()=>{
 const layer=new RedLanternLayer(new THREE.Group());
 const make=id=>({buildingId:id,group:new THREE.Group(),receivers:[new THREE.Object3D()],uniforms:{power:{value:0},tint:{value:new THREE.Color()},reach:{value:0},eaves:{value:0},walls:{value:0}},halo:{material:{uniforms:{power:{value:0},tint:{value:new THREE.Color()}}}}});
 layer.loadBuildingSettings({'matou-north-west':{redLanterns:{enabled:false}}});
 const a=make('matou-north-west'),b=make('matou-north-east');layer.groups.push(a,b);
 layer.configure({...layer.settings,enabled:true,lightEaves:true,brightness:1});
 assert.equal(a.group.visible,false);assert.equal(a.receivers[0].visible,false);assert.equal(b.group.visible,true);assert.equal(b.receivers[0].visible,true);
 layer.setBuildingSettings(a.buildingId,{redLanterns:{enabled:true}});assert.equal(a.group.visible,true);assert.equal(a.receivers[0].visible,true);
 layer.setState({night:false});assert.equal(a.receivers[0].visible,false);assert.equal(b.receivers[0].visible,false);
 assert.ok(layer.supportsBuilding('matou-north-west'));assert.equal(layer.supportsBuilding('gate'),false);
 layer.groups=[];layer.dispose();
});

test('lantern settings and named presets round-trip without removing existing records',()=>{
 const original={version:1,future:'keep',buildings:{a:{redLanterns:{enabled:false,future:7}},b:{brightness:2}},presets:[{id:'old',name:'原收藏',building:'a',settings:{brightness:.5}}]};
 const map=new Map([[BUILDING_LIGHT_KEY,JSON.stringify(original)]]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const settings=normalizeBuilding(original.buildings.a);assert.equal(settings.redLanterns.enabled,false);
 assert.equal(normalizeBuilding({}).redLanterns.enabled,true);
 assert.equal(writeBuildingLight(storage,'a',settings,{id:'new',name:'关闭灯笼'}),true);
 const record=readBuildingLights(storage);assert.equal(record.future,'keep');assert.deepEqual(record.buildings.b,original.buildings.b);assert.deepEqual(record.presets[0],original.presets[0]);assert.equal(record.buildings.a.redLanterns.future,7);assert.equal(record.presets[1].settings.redLanterns.enabled,false);
});
