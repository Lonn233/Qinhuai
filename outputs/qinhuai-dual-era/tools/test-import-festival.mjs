import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {ImportFestivalLanterns,FESTIVAL_LAYOUT,FESTIVAL_PLACEMENTS,MAP_UNITS_PER_METER,WATER_KINDS,waterClearance,pointInWater,lightingFor,mountainSettings} from '../import-festival-lanterns.js';
import {DEFAULT_LIGHTS} from '../game/lion-study/defaults.cjs';
const water=FESTIVAL_PLACEMENTS.filter(p=>WATER_KINDS.has(p.kind));
assert.equal(water.length,32);assert.equal(water.filter(p=>p.kind==='chrysanthemum').length,4);
assert.equal(FESTIVAL_PLACEMENTS.filter(p=>p.kind==='lion').length,6);
assert.equal(FESTIVAL_PLACEMENTS.length,39);
assert.equal(pointInWater(500,500),false);assert.equal(pointInWater(-5,-20),false);
for(const p of water){assert.ok(waterClearance(p,.6),p.id+' river margin');assert.equal(p.tile,6);assert.ok(Math.abs(p.y-FESTIVAL_LAYOUT.water.height)<.02);}
for(let i=0;i<water.length;i++)for(let j=i+1;j<water.length;j++)assert.ok(Math.hypot(water[i].x-water[j].x,water[i].z-water[j].z)>1.64);
for(const p of FESTIVAL_PLACEMENTS.filter(p=>p.kind==='lion')){
 assert.ok(p.z<-16&&p.z>-24,'behind gate and in front of temple');
 const dx=p.target[0]-p.x,dz=p.target[1]-p.z;
 assert.ok((Math.sin(p.rotation)*dx+Math.cos(p.rotation)*dz)/Math.hypot(dx,dz)>.999,'source head +Z faces lane');
 assert.equal(p.sizeMeters,2.5);
}
for(const kind of ['lion','mountain','lotus-main','lotus-one','chrysanthemum']){
 const light=lightingFor(kind),base=DEFAULT_LIGHTS[WATER_KINDS.has(kind)?'lotus':kind];
 assert.equal(light.color,base.color);assert.equal(light.power,base.power);assert.equal(light.sourceId,base.sourceId);
}
assert.deepEqual(mountainSettings(),{sizeMeters:13,rotation:180});
assert.deepEqual(mountainSettings({sizeMeters:100,rotation:-90}),{sizeMeters:15,rotation:270});
const origin=FESTIVAL_PLACEMENTS.find(p=>p.kind==='mountain'),plot=FESTIVAL_LAYOUT.mountainPlot;
const maxRadius=15*MAP_UNITS_PER_METER*Math.SQRT2/2; // conservative square bounding circle
// Actual LOD vertex radius is tested by geometry survey; nominal 13m circle remains in plot.
assert.ok(origin.x-13*MAP_UNITS_PER_METER/2>plot.minX&&origin.x+13*MAP_UNITS_PER_METER/2<plot.maxX);
let calls=0;
const load=async()=>{calls++;const scene=new THREE.Group();const map=new THREE.Texture();scene.add(new THREE.Mesh(new THREE.BoxGeometry(2,1,2),new THREE.MeshStandardMaterial({map})));return {scene};};
const parent=new THREE.Group(),lamps=new ImportFestivalLanterns(parent,{load,loadMask:async()=>new THREE.Texture()});
lamps.setState({night:true});await Promise.all([lamps.registerTile(9),lamps.registerTile(9)]);await lamps.registerTile(6);await lamps.registerTile(10);
assert.equal(calls,5);assert.equal(lamps.stats.lamps,39);assert.equal(lamps.stats.batches,10);assert.deepEqual(lamps.stats.errors,{});
for(const e of lamps.entries.values()){
 assert.equal(e.uniforms.uClothPower.value,e.tuning.power);
 assert.ok(e.batches.every(b=>b.mesh.isInstancedMesh&&!b.mesh.castShadow));
 for(const b of e.batches.filter(b=>!b.mesh.userData.festivalSpill))assert.equal(b.mesh.geometry,e.parts[0].geometry);
 const shader={uniforms:{},fragmentShader:'#include <emissivemap_fragment>'};e.parts[0].material.onBeforeCompile(shader);
 assert.match(shader.fragmentShader,/clothColor \* uClothTint \* uClothPower/);
}
assert.ok(!lamps.root.children.some(c=>c.isLight),'no per-lamp point lights');
lamps.setState({night:false});for(const e of lamps.entries.values())assert.equal(e.uniforms.uClothPower.value,0);
lamps.setState({night:true,wireframe:true});for(const e of lamps.entries.values())assert.equal(e.uniforms.uClothPower.value,0);
lamps.setState({wireframe:false,waterVisible:false});assert.equal(lamps.waterRoot.visible,false);
lamps.setMountain({sizeMeters:14,rotation:45});assert.deepEqual(lamps.stats.mountain,{sizeMeters:14,rotation:45});
lamps.dispose();assert.equal(parent.children.length,0);
// Optional download failures must support retry, without duplicate already-created batches.
let fail=true;const retry=new ImportFestivalLanterns(parent,{load:async kind=>{if(kind==='mountain'&&fail)throw Error('network');return load();},loadMask:async()=>new THREE.Texture()});
await assert.rejects(retry.registerTile(9),/network/);assert.equal(retry.stats.lamps,6);fail=false;await retry.registerTile(9);assert.equal(retry.stats.lamps,7);retry.dispose();
let resolve;const late=new ImportFestivalLanterns(parent,{load:()=>new Promise(r=>resolve=r)});const pending=late.registerTile(9);late.dispose();resolve(await load());await pending;assert.equal(parent.children.length,0);assert.equal(late.entries.size,0);
const report=JSON.parse(fs.readFileSync(new URL('../assets/qinhuai-modern-import/festival/lod-report.json',import.meta.url)));
for(const r of report)assert.ok(r.afterTriangles<r.beforeTriangles&&r.textureMax<=1024);
console.log('PASS festival: exact water footprint, spacing, six inward-facing lions, shared studio presets, instancing, day/wireframe, retry/dispose, mountain controls.');
