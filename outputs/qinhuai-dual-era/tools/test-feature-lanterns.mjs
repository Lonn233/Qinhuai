import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {fishTransforms,WOMAN_PLACEMENT,FeatureLanternLayer} from '../import-feature-lanterns.js';
import {waterClearance,MAP_UNITS_PER_METER} from '../import-festival-lanterns.js';
import {RedLanternLayer} from '../red-lantern-layer.js';
import {BUILDING_LIGHT_KEY,normalizeBuilding,readBuildingLights,writeBuildingLight} from '../import-building-controls.mjs';

test('courtyard fish are center-symmetric on the front of the hall behind Tianxia Wenshu, diagonal and equally scaled',()=>{
 const [a,b]=fishTransforms(),pa=new THREE.Vector3(),pb=new THREE.Vector3(),qa=new THREE.Quaternion(),qb=new THREE.Quaternion(),sa=new THREE.Vector3(),sb=new THREE.Vector3();
 a.decompose(pa,qa,sa);b.decompose(pb,qb,sb);
 assert.ok(pa.clone().add(pb).multiplyScalar(.5).distanceTo(new THREE.Vector3(-5.5,14.55,-23.9))<1e-10);
 assert.ok(pa.x<-8.9&&pa.x>-9.1&&pb.x>-2.1&&pb.x<-1.9);assert.ok(pa.y<pb.y);assert.ok(Math.abs(pa.y-14)<1e-10);assert.ok(Math.abs(pb.y-15.1)<1e-10);assert.ok(Math.abs(pa.z+23.9)<1e-10);assert.ok(pa.z>-24.21);assert.equal(pa.z,pb.z);
 assert.ok(sa.distanceTo(sb)<1e-10);assert.ok(Math.abs(sa.x-2.8*MAP_UNITS_PER_METER)<1e-10);
 const forward=new THREE.Vector3(0,0,1).applyQuaternion(qa),opposite=new THREE.Vector3(0,0,1).applyQuaternion(qb);
 assert.ok(forward.x>0&&forward.y<0);assert.ok(forward.clone().add(opposite).length()<1e-10);
});

test('woman stays in water, faces bridge and respects water visibility',()=>{
 assert.equal(WOMAN_PLACEMENT.heightMeters,9);
 assert.ok(waterClearance(WOMAN_PLACEMENT,.5));
 const front=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),WOMAN_PLACEMENT.yaw);
 assert.ok(front.x<0&&front.z<0);
 const layer=new FeatureLanternLayer(new THREE.Group()),group=new THREE.Group();
 const reflection=new THREE.Object3D();reflection.name='feature-woman-reflection';group.add(reflection);
 layer.entries.set('woman',{group,uniforms:{uClothPower:{value:0}},tuning:{power:.65},materials:[],meshes:[reflection],reflections:[]});
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
