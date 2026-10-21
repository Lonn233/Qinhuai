import fs from 'node:fs';
import assert from 'node:assert/strict';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ImportEnvironmentSpill} from '../import-environment-spill.js';
import {collectWindowEmitters} from '../import-environment-emitters.js';
const layout=JSON.parse(fs.readFileSync('assets/qinhuai-modern-import/night/layout.json'));
const rig=new ImportEnvironmentSpill();rig.configure(layout);
const results=[];
for(const [name,tile] of Object.entries(layout.tiles)){
 const buf=fs.readFileSync('assets/qinhuai-modern-import/tiles/'+name+'.glb'),jl=buf.readUInt32LE(12),doc=JSON.parse(buf.subarray(20,20+jl));
 for(const m of doc.materials||[]){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}delete doc.images;delete doc.textures;
 const json=JSON.stringify(doc),j=Buffer.from(json.padEnd(Math.ceil(json.length/4)*4,' ')),bin=buf.subarray(20+jl),out=Buffer.alloc(20+j.length+bin.length);buf.copy(out,0,0,12);out.writeUInt32LE(out.length,8);out.writeUInt32LE(j.length,12);out.writeUInt32LE(0x4e4f534a,16);j.copy(out,20);bin.copy(out,20+j.length);
 const root=(await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'')).scene,es=collectWindowEmitters(root,tile,rig.buildings);
 const all=[...es.values()].flat().filter(e=>e.floor),nodes=new Set(all.map(e=>e.node)),windows=tile.materials.filter(r=>r.role==='window');
 results.push({tile:name,windowNodes:windows.length,covered:nodes.size,missing:windows.filter(r=>!nodes.has(r.node)).map(r=>r.node),strips:all.length,high:all.filter(e=>e.y>15.5).length,buildings:[...es].filter(([id,list])=>list.some(e=>e.floor)).map(([id,list])=>({id,first:list.filter(e=>e.floor==='first').length,second:list.filter(e=>e.floor==='second').length}))});
 root.traverse(o=>{o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m?.dispose();});
}
assert.ok(results.every(t=>!t.missing.length),'Every source window node must produce emitters');
assert.ok(results.reduce((n,t)=>n+t.high,0)>0,'Upper windows must survive extraction');
fs.writeFileSync('work/all-building-windows-20261020/coverage.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));rig.dispose();
