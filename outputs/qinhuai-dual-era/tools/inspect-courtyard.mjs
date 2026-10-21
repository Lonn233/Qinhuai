import fs from "node:fs";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
async function bare(file) {
 const b=fs.readFileSync(file),l=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+l));
 for(const m of j.materials||[]){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}
 delete j.textures;delete j.images;
 const text=JSON.stringify(j),chunk=Buffer.from(text.padEnd(Math.ceil(Buffer.byteLength(text)/4)*4," ")),out=Buffer.concat([b.subarray(0,20),chunk,b.subarray(20+l)]);
 out.writeUInt32LE(out.length,8);out.writeUInt32LE(chunk.length,12);
 const gltf=await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),"");gltf.scene.updateMatrixWorld(true);return gltf.scene;
}
const tree=await bare("assets/qinhuai-modern-import/restored/79106538a618.glb");console.log("TREE",new THREE.Box3().setFromObject(tree));
const root=await bare("assets/building-study/temple/temple.glb");
root.traverse(m=>{if(m.isMesh){m.material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});const b=new THREE.Box3().setFromObject(m);console.log(m.name,b.min.toArray().map(v=>+v.toFixed(3)),b.max.toArray().map(v=>+v.toFixed(3)));}});
const ray=new THREE.Raycaster();
for(const z of [-30,-32,-34,-36,-38,-40,-42,-44,-46,-48,-50]){const row=[];for(const x of [-12,-10,-8,-5.3,-2,0,2]){ray.set(new THREE.Vector3(x,22,z),new THREE.Vector3(0,-1,0));row.push([x,ray.intersectObject(root,true).slice(0,2).map(h=>[h.object.name,+h.point.y.toFixed(3)])]);}console.log("RAY",z,JSON.stringify(row));}
