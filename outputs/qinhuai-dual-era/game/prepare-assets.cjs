// Creates game-only runtime copies. Originals and embedded texture bytes stay intact.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { MeshoptSimplifier: S } = require('../tools/asset-deps/node_modules/meshoptimizer');
const root = path.resolve(__dirname, '..');
const sources = [
 ['mountain', 'E:/soft/inspiration/灯会/model/鳖山灯/鳖山灯.glb', 110000],
 ['lion', 'E:/soft/inspiration/灯会/model/lion/Meshy_AI_Golden_Lion_Dance_Mas_1017092614_texture.glb', 90000],
 ['fish', 'E:/soft/inspiration/灯会/model/fish/golden_fish.glb', 80000],
 ['crane', 'E:/soft/inspiration/灯会/model/灯笼/Meshy_AI_Golden_Crane_Lantern_1017122124_texture.glb', 80000],
 ['lotus-one', path.join(root, 'hehua_1.glb'), 35000],
 ['lotus-main', path.join(root, 'hehua-main.glb'), 50000],
 ['pavilion', path.join(root, 'Meshy_AI_kuixingge_1016044736_texture.glb'), 150000],
 ['bridge', path.join(root, 'qiao.glb'), 100000],
];
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
async function optimize(id, file, triangles) {
 const raw = fs.readFileSync(file), size = raw.readUInt32LE(12);
 const json = JSON.parse(raw.toString('utf8', 20, 20 + size));
 const bin = raw.subarray(28 + size);
 if (json.meshes.length !== 1 || json.meshes[0].primitives.length !== 1 || json.animations?.length || json.skins?.length) throw Error('Unsupported model structure: ' + file);
 const p = json.meshes[0].primitives[0];
 if (Object.keys(p.attributes).sort().join() !== 'NORMAL,POSITION,TEXCOORD_0') throw Error('Unexpected attributes: ' + id);
 const read = (i, Type) => {
  const a=json.accessors[i], v=json.bufferViews[a.bufferView];
  if(v.byteStride || a.sparse) throw Error('Unexpected buffer layout');
  return new Type(bin.buffer, bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0), a.count*({VEC3:3,VEC2:2,SCALAR:1}[a.type]));
 };
 const pos=read(p.attributes.POSITION,Float32Array), norm=read(p.attributes.NORMAL,Float32Array), uv=read(p.attributes.TEXCOORD_0,Float32Array);
 const index=read(p.indices,json.accessors[p.indices].componentType===5125?Uint32Array:Uint16Array);
 const attrs = new Float32Array(pos.length/3*5);
 for(let i=0;i<pos.length/3;i++){attrs.set(norm.subarray(i*3,i*3+3),i*5);attrs[i*5+3]=uv[i*2];attrs[i*5+4]=uv[i*2+1];}
 const [indices,error]=S.simplifyWithAttributes(index,pos,3,attrs,5,[.2,.2,.2,1,1],null,Math.min(triangles*3,index.length),.015,[]);
 const [remap,count]=S.compactMesh(indices);
 const positions=new Float32Array(count*3), normals=new Float32Array(count*3), uvs=new Float32Array(count*2), min=[Infinity,Infinity,Infinity], max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<pos.length/3;i++){const j=remap[i];if(j===undefined||j===0xffffffff)continue;positions.set(pos.subarray(i*3,i*3+3),j*3);normals.set(norm.subarray(i*3,i*3+3),j*3);uvs.set(uv.subarray(i*2,i*2+2),j*2);for(let k=0;k<3;k++){min[k]=Math.min(min[k],pos[i*3+k]);max[k]=Math.max(max[k],pos[i*3+k]);}}
 const out=structuredClone(json), parts=[];out.bufferViews=[];out.accessors=[];let offset=0;
 function append(a,target){const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),i=out.bufferViews.length;out.bufferViews.push({buffer:0,byteOffset:offset,byteLength:b.length,...(target?{target}:{})});parts.push(b);offset+=b.length;const pad=(4-offset%4)%4;if(pad){parts.push(Buffer.alloc(pad));offset+=pad;}return i;}
 function accessor(a,type,componentType,target){const i=out.accessors.length;out.accessors.push({bufferView:append(a,target),componentType,count:a.length/({VEC3:3,VEC2:2,SCALAR:1}[type]),type,...(a===positions?{min,max}:{})});return i;}
 const primitive=out.meshes[0].primitives[0];primitive.attributes={POSITION:accessor(positions,'VEC3',5126,34962),NORMAL:accessor(normals,'VEC3',5126,34962),TEXCOORD_0:accessor(uvs,'VEC2',5126,34962)};primitive.indices=accessor(indices,'SCALAR',5125,34963);
 const imageHashes=[];
 for(let i=0;i<(json.images||[]).length;i++){const v=json.bufferViews[json.images[i].bufferView], b=bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);out.images[i].bufferView=append(b);imageHashes.push(hash(b));}
 out.buffers=[{byteLength:offset}];out.asset.generator='Qinhuai game runtime copy / meshoptimizer; original textures preserved';
 const j=Buffer.from(JSON.stringify(out)), pad=Buffer.alloc((4-j.length%4)%4,32), body=Buffer.concat(parts);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+j.length+pad.length+body.length,8);header.writeUInt32LE(j.length+pad.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(body.length);bh.writeUInt32LE(0x004e4942,4);
 const bytes=Buffer.concat([header,j,pad,bh,body]);fs.writeFileSync(path.join(__dirname,'assets',id+'.glb'),bytes);
 const info={id,source:file,sourceSha256:hash(raw),sourceTriangles:index.length/3,triangles:indices.length/3,error,sourceBytes:raw.length,bytes:bytes.length,textureSha256:imageHashes};
 console.log(`${id}: ${info.sourceTriangles} -> ${info.triangles} triangles, ${(bytes.length/1e6).toFixed(1)} MB`);return info;
}
(async()=>{await S.ready;const manifest=[];for(const args of sources)manifest.push(await optimize(...args));fs.writeFileSync(path.join(__dirname,'assets','manifest.json'),JSON.stringify({note:'Game-specific derivatives; all originals untouched. Embedded texture bytes preserved.',models:manifest},null,2));})().catch(e=>{console.error(e);process.exitCode=1;});
