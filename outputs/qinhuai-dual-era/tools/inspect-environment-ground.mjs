import fs from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import layout from '../assets/qinhuai-modern-import/night/layout.json' with {type:'json'};
import {ImportEnvironmentSpill} from '../import-environment-spill.js';
const buf=fs.readFileSync('assets/qinhuai-modern-import/tiles/tile-09.glb');
const jl=buf.readUInt32LE(12),json=JSON.parse(buf.subarray(20,20+jl).toString());
for(const m of json.materials||[]){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}
delete json.textures;delete json.images;
const j=Buffer.from(JSON.stringify(json).padEnd(Math.ceil(JSON.stringify(json).length/4)*4,' '));
const bin=buf.subarray(20+jl);const out=Buffer.alloc(20+j.length+bin.length);buf.copy(out,0,0,12);out.writeUInt32LE(out.length,8);out.writeUInt32LE(j.length,12);out.writeUInt32LE(0x4e4f534a,16);j.copy(out,20);bin.copy(out,20+j.length);
const gltf=await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
const root=gltf.scene;root.updateWorldMatrix(true,true);const tile=layout.tiles['tile-09'];
const rig=new ImportEnvironmentSpill();rig.configure(layout);rig.setState({night:true});rig.attachTile(9,root,tile,new Set(tile.materials.map(r=>r.node)));rig.setSources({temple:{color:'#ffaa00',windowColor:'#ffaa00',brightness:2,eave:5,roof:.42,window:1.78,facade:.07}});rig.setSettings('temple-front-hall',{enabled:true,intensity:1,distance:10,decayDistance:4});rig.update();
console.log('source',rig.buildings.find(b=>b.label.includes('前殿')));
console.log('strips', [...rig.emitters].map(([id,es])=>[id,es.length,es.slice(0,2)]));
for(const name of ['FuziTemple1082','FuziTemple1110','FuziTemple0019']){const m=root.getObjectByName(name);if(!m)continue;const mats=Array.isArray(m.material)?m.material:[m.material];const n=m.geometry.attributes.normal,p=m.geometry.attributes.position;const nm=new THREE.Matrix3().getNormalMatrix(m.matrixWorld),v=new THREE.Vector3();let up=0,down=0;for(let i=0;i<n.count;i++){v.fromBufferAttribute(n,i).applyNormalMatrix(nm);if(v.y>.5)up++;if(v.y<-.5)down++;}console.log(name,'receives',rig.receivers.has(m),'normals',up,down,n.count,'materials',mats.map(x=>({name:x.name,color:x.color.toArray(),metalness:x.metalness,roughness:x.roughness,side:x.side})));}
for(const z of [-36,-35,-34,-32,-30]){const b=rig.uniforms.envAtlasBounds.value;const x=-5,i=(Math.floor((z-b.y)/b.w*1024)*1024+Math.floor((x-b.x)/b.z*1024))*4;console.log('atlas',x,z,[...rig.data.slice(i,i+4)]);}
