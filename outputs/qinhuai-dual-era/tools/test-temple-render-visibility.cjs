const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const code=require('esbuild').buildSync({stdin:{contents:"export * from './import-temple-visibility.js';export * from './import-render-visibility.js';export * from './import-boat-lanterns.js';export * from './import-lantern-lighting.js';export * as THREE from 'three';",resolveDir:root},define:{'import.meta.url':JSON.stringify(require('node:url').pathToFileURL(path.join(root,'import-lantern-lighting.js')).href)},bundle:true,platform:'node',format:'cjs',write:false,logLevel:'silent'}).outputFiles[0].text;
const mod={exports:{}};new Function('module','exports','require',code)(mod,mod.exports,require);
const {THREE:T,TempleRenderVisibility,TEMPLE_INTERIOR_NODES,ImportRenderVisibility,ImportBoatLanterns,LanternLighting,isTempleInteriorPosition}=mod.exports;
const scene=new T.Scene(),visibility=new TempleRenderVisibility(),distance=new ImportRenderVisibility();
const mesh=(name,parent=scene)=>{const m=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial());m.name=name;parent.add(m);return m;};
const visible=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
const tile=new T.Group();scene.add(tile);const hall=mesh('FuziTemple1089',tile),gate=mesh('FuziTemple0340',tile),pavement=mesh('FuziTemple0018',tile);
visibility.registerTile(9,tile);distance.register(tile);
const exterior=new T.Group();scene.add(exterior);const lamp=mesh('outside lamp',exterior);visibility.register(exterior,'exterior');
const courtyard=new T.Group();scene.add(courtyard);const trees=mesh('CourtyardCopiedTrees',courtyard),gold=mesh('CourtyardGoldenLanterns',courtyard),halo=mesh('CourtyardLanternHalos',courtyard);
visibility.registerCourtyard(courtyard);const proxy=mesh('restored tree');proxy.userData.templeInterior=true;visibility.registerProxies(scene);
const racks=new T.Group();scene.add(racks);visibility.register(racks,'interior');
function check(inside){visibility.setInside(inside);distance.dirty=true;distance.update(new T.Vector3(),null);assert.ok(visible(hall),'temple architecture remains visible from both sides');assert.equal(visible(trees),inside);assert.equal(visible(proxy),inside);assert.equal(visible(racks),inside);assert.equal(visible(lamp),!inside);assert.ok(visible(gate)&&visible(pavement));assert.ok(visible(gold)&&visible(halo));}
check(false);check(true);check(false);check(true);
// User-hidden children must stay hidden, and asynchronous loads inherit the zone.
lamp.visible=false;visibility.setInside(false);assert.equal(visible(lamp),false);lamp.visible=true;
visibility.setInside(true);const late=mesh('late exterior');visibility.register(late,'exterior');assert.equal(visible(late),false);
const lateTile=new T.Group();scene.add(lateTile);const lateHall=mesh('FuziTemple1070',lateTile);visibility.registerTile(9,lateTile);assert.equal(visible(lateHall),true);
visibility.setInside(false);assert.equal(visible(lateHall),true);assert.equal(visible(late),true);
const count=visibility.stats.interiorGates;visibility.registerTile(9,tile);visibility.registerCourtyard(courtyard);assert.equal(visibility.stats.interiorGates,count);
assert.equal(isTempleInteriorPosition(-10,-30),true);assert.equal(isTempleInteriorPosition(-10,-13),false);assert.equal(isTempleInteriorPosition(20,-30),false);
const lighting=Object.create(LanternLighting.prototype);lighting.templeInside=false;lighting.racks={entries:new Map([['rack-red',{}]])};
assert.equal(lighting.zoneVisible('rack-red'),false);assert.equal(lighting.zoneVisible('courtyard'),true);assert.equal(lighting.zoneVisible('street'),true);
lighting.templeInside=true;for(const id of ['street','tree','red','lion','boat'])assert.equal(lighting.zoneVisible(id),false);assert.equal(lighting.zoneVisible('rack-red'),true);assert.equal(lighting.zoneVisible('courtyard'),true);
const night={bindings:[],root:new T.Group(),mapLightSettings:{},matouSelection:{settings:{}},pavilionSelection:{settings:{}},buildingAdjustments:{saved:{}},waterReflections:{apply(){}}};
const boats=new ImportBoatLanterns(night),boat=mesh('boat');boats.meshes.add(boat);
boats.setTempleHidden(true);assert.equal(boat.visible,false);boats.setPlayHidden(false);assert.equal(boat.visible,false);boats.setTempleHidden(false);assert.equal(boat.visible,true);
boats.setPlayHidden(true);boats.setTempleHidden(true);boats.setTempleHidden(false);assert.equal(boat.visible,false,'story-hidden boats stay hidden on temple exit');
// The production geometry uses the same audited nodes, not an entire tile.
const glb=fs.readFileSync(path.join(root,'assets/qinhuai-modern-import/tiles/tile-09.glb')),g=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));
const audited=g.nodes.filter(n=>TEMPLE_INTERIOR_NODES.has(n.name));assert.ok(audited.length>=50);assert.ok(!TEMPLE_INTERIOR_NODES.has('FuziTemple0340'));assert.ok(!TEMPLE_INTERIOR_NODES.has('FuziTemple0018'));
let triangles=0;for(const n of audited)for(const p of g.meshes[n.mesh]?.primitives||[])triangles+=(g.accessors[p.indices]?.count||g.accessors[p.attributes.POSITION].count)/3;
console.log('PASS: temple/outdoor isolation, tree lights, culling composition, late loads, preferences, boats, light spill; interior source nodes='+audited.length+', triangles='+triangles);

