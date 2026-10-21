import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {maskPanels,collectWindowEmitters} from './window-emitters.js';
import {buildClusters,uniformSources} from './distributed-spill.js';
function fixture(repeats=10,offset=0){const material=new THREE.MeshStandardMaterial();material.name='window';const geometry=new THREE.PlaneGeometry(repeats,1);const uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*repeats+offset);const mesh=new THREE.Mesh(geometry,material);mesh.name='strip';const root=new THREE.Group();root.add(mesh);return {root,mesh,rules:[{node:'strip',material:'window',role:'window'}]};}
test('a long two-triangle UV strip gives one emitter for each repeated window, including cropped ends',()=>{
 for(const [repeats,offset,expected]of [[10,0,10],[10,-5,10],[3.5,.1,4]]){const {root,rules}=fixture(repeats,offset);const sources=collectWindowEmitters(root,{rules});assert.equal(sources.length,expected);assert.ok(sources.every(s=>Math.abs(s.position.y)<.00001&&s.normal.z===1));}
});
test('two panels per texture are independently covered, not merged into the triangle centroid',()=>{
 const {root,rules}=fixture(4);const data=new Uint8Array(100*50);for(let y=5;y<45;y++)for(let x=5;x<95;x++)if(x<45||x>=55)data[y*100+x]=255;
 const texture=new THREE.DataTexture(data,100,50,THREE.RedFormat);texture.flipY=false;assert.equal(maskPanels(texture.image).length,2);
 const sources=collectWindowEmitters(root,{rules},new Map([['window',texture]]));assert.equal(sources.length,8);assert.ok(sources.every(s=>s.weight>0));
});
test('adjacent strips that reuse identical UVs, both floors and opposite faces retain independent emitters',()=>{
 const {root,mesh,rules}=fixture(5);for(const [i,x,y,angle]of [[1,5,0,0],[2,0,2,0],[3,0,0,Math.PI]]){const m=mesh.clone();m.name='strip'+i;m.position.set(x,y,i===3?2:0);m.rotation.y=angle;root.add(m);rules.push({...rules[0],node:m.name});}const sources=collectWindowEmitters(root,{rules});assert.equal(sources.length,20);assert.equal(sources.filter(s=>s.position.y>1).length,5);assert.equal(sources.filter(s=>s.normal.z<0).length,5);
});
test('all window sources participate in clusters; each source keeps its own region and direction',()=>{
 const {root,rules}=fixture(12);const sources=collectWindowEmitters(root,{rules}).map(s=>({...s,zoneIndex:3}));const grid=buildClusters(sources,new THREE.Box3().setFromObject(root));const used=new Set(grid.data);for(let i=0;i<sources.length;i++)assert.ok(used.has(i+1));assert.equal(grid.data.length,grid.dims[0]*6*grid.dims[1]*grid.dims[2]*4);
});
test('uniform surface sampling covers ends and no longer weights large triangles over distant regions',()=>{
 const sources=Array.from({length:100},(_,i)=>({position:new THREE.Vector3(i,0,0),weight:i===0?10000:.01}));const selected=uniformSources(sources,16);assert.equal(selected.length,16);assert.equal(selected[0],sources[0]);assert.ok(selected.includes(sources[99]));let gap=0;const xs=selected.map(s=>s.position.x).sort((a,b)=>a-b);for(let i=1;i<xs.length;i++)gap=Math.max(gap,xs[i]-xs[i-1]);assert.ok(gap<=13);
});
