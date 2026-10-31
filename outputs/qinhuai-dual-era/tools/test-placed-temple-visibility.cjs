const assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const code=require('esbuild').buildSync({stdin:{contents:"export * from './import-placeable-lanterns.js';export * from './import-lantern-lighting.js';export * as THREE from 'three';",resolveDir:root},define:{'import.meta.url':JSON.stringify(require('node:url').pathToFileURL(path.join(root,'import-lantern-lighting.js')).href)},bundle:true,platform:'node',format:'cjs',write:false,logLevel:'silent'}).outputFiles[0].text;
const mod={exports:{}};new Function('module','exports','require',code)(mod,mod.exports,require);
const {THREE:T,PlaceableLanternLayer,LanternLighting}=mod.exports;
(async()=>{
 const scene=new T.Scene(),layer=new PlaceableLanternLayer(scene);
 const template=new T.Group();template.add(new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()));
 let release;const delayed=new Promise(resolve=>release=()=>resolve(template));layer.template=()=>delayed;
 const items=[{id:'left',kind:'column',x:-8.5,z:-28},{id:'right',kind:'rack',x:-2.6,z:-30},{id:'edge',kind:'pink',x:-18.2256,z:-34.47},{id:'outside',kind:'column',x:-8.5,z:-18},{id:'hidden',kind:'drum',x:-5.7,z:-33}].map(p=>({...p,y:11.86,rx:0,ry:0,rz:0,scale:1}));
 layer.lightControls=Object.fromEntries(['column','rack','pink','drum'].map(k=>[k,{modelVisible:k!=='drum',spill:{enabled:true}}]));
 const pending=layer.apply({version:1,instances:items});layer.setTempleInside(true);release();await pending;
 const check=inside=>{for(const item of items)assert.equal(layer.objects.get(item.id).visible,item.id!=='hidden'&&(!inside||item.id!=='outside'),item.id);};
 check(true);assert.deepEqual(layer.spillChannels().map(c=>c.cacheKey).sort(),['left','right','edge'].map(id=>'placed-lantern|'+id).sort());
 for(let i=0;i<2;i++){layer.setTempleInside(false);check(false);layer.setTempleInside(true);layer.setState();check(true);}
 // Editing a lamp's position must re-evaluate its zone without another crossing.
 await layer.apply({version:1,instances:items.map(p=>p.id==='outside'?{...p,z:-30}:p)});assert.equal(layer.objects.get('outside').visible,true);
 await layer.apply({version:1,instances:items});assert.equal(layer.objects.get('outside').visible,false);
 const stub=()=>({entries:new Map(),tiles:new Set(),root:new T.Group(),groups:[],settings:{},setState(){}}),environment={active:true,setLanternChannels(c){this.channels=c;}};
 const rig=new LanternLighting({festival:stub(),feature:stub(),tree:stub(),courtyard:stub(),racks:stub(),red:stub(),street:stub(),placed:layer,environment});
 rig.saved=layer.lightControls;rig.setTempleInside(true);
 assert.ok(environment.channels.some(c=>c.cacheKey==='placed-lantern|left'),'interior placed spill reaches environment');
 assert.ok(!environment.channels.some(c=>c.cacheKey==='placed-lantern|outside'));
 rig.setTempleInside(false);assert.ok(environment.channels.some(c=>c.cacheKey==='placed-lantern|outside'));
 layer.dispose();console.log('PASS: placed courtyard lamps, edge pivots, late loads, repeated crossings, movement, saved visibility, interior/outdoor spill.');
})().catch(e=>{console.error(e);process.exitCode=1;});
