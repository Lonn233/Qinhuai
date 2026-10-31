import assert from 'node:assert/strict';
import {createNavigator,mapProjection} from '../story/navigation.mjs';
function finish(nav){for(let i=0;i<2000&&nav.status==='searching';i++)nav.tick(20);return nav.status;}
const area={minX:-1,maxX:8,minZ:-4,maxZ:4};
// Thin wall with a real opening: segment sampling must not jump across it.
const surface=(x,z,y)=>Math.abs(x-3)<.13&&z<1.6?null:0;
const nav=createNavigator(surface,{area});nav.request({x:0,y:0,z:0},{x:6,y:0,z:0});assert.equal(finish(nav),'ready');assert.ok(nav.path.some(p=>p.z>1.6));for(let i=1;i<nav.path.length;i++)assert.ok(nav.edge(nav.path[i-1],nav.path[i]));
const old=nav.revision;nav.follow({x:0,y:0,z:-3});assert.equal(nav.status,'searching');assert.ok(nav.revision>old);assert.equal(finish(nav),'ready');
// Water gap is passable only on the narrow elevated bridge; follow ground height.
const bridge=(x,z,y)=>{if(x>2&&x<4&&Math.abs(z)> .45)return null;const ground=Math.max(0,1-Math.abs(x-3)/2)*.3;return Math.abs(ground-y)<.12?ground:null;};
const slope=createNavigator(bridge,{area});slope.request({x:0,y:0,z:0},{x:6,y:0,z:0});assert.equal(finish(slope),'ready');assert.ok(slope.path.some(p=>p.y>.2));
const trapped=createNavigator((x,z)=>Math.abs(x-3)<.15?null:0,{area});trapped.request({x:0,y:0,z:0},{x:6,y:0,z:0});assert.equal(finish(trapped),'unreachable');assert.deepEqual(trapped.path,[]);
const projection=mapProjection(1000,760),point={x:-21,z:-33.2},roundtrip=projection.world(projection.x(point.x),projection.z(point.z));assert.ok(Math.hypot(roundtrip.x-point.x,roundtrip.z-point.z)<1e-9);
nav.request({x:0,y:0,z:0},null);assert.equal(nav.status,'idle');assert.deepEqual(nav.path,[]);
console.log('PASS navigation: wall detour, sampled collision edges, elevated bridge, deviation recalculation, unreachable handling, map coordinate roundtrip');
