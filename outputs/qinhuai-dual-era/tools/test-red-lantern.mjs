import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {normalizeRedLantern,temperatureRGB,RED_LANTERN_DEFAULTS} from '../red-lantern-settings.mjs';
const read=name=>JSON.parse(fs.readFileSync(new URL('../assets/red-lantern/'+name,import.meta.url)));
const layout=read('layout.json'),report=read('model-report.json'),audit=read('placement-audit.json');
const manifest=JSON.parse(fs.readFileSync(new URL('../assets/qinhuai-modern-import/night/matou-ma61/manifest.json',import.meta.url)));
assert.deepEqual(layout.groups,manifest.groups);
assert.equal(layout.placements.length,audit.count);assert.ok(audit.bodyBoundingBoxClear&&audit.rodBoundingBoxClear);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(report.source)).digest('hex'),report.sourceHash);
assert.ok(report.afterTriangles<5000);assert.deepEqual(report.mountPoint,[0,0,0]);
for(const p of layout.placements){const group=layout.groups.find(g=>g.id===p.group);assert.equal(group.tile,p.tile);if(group.minX!==null)assert.ok(p.mount[0]>=group.minX);assert.ok(p.mount.every(Number.isFinite));}
for(let i=0;i<layout.placements.length;i++)for(let j=0;j<i;j++){const a=layout.placements[i].mount,b=layout.placements[j].mount;assert.ok(Math.hypot(a[0]-b[0],a[2]-b[2])>=.69999,'mount spacing');}
assert.deepEqual(normalizeRedLantern({brightness:Infinity,temperature:'bad',enabled:'false'}),RED_LANTERN_DEFAULTS);
assert.equal(normalizeRedLantern({brightness:-1,temperature:9000,halo:8}).brightness,0);
assert.equal(normalizeRedLantern({temperature:9000}).temperature,6500);
assert.ok(temperatureRGB(1800)[2]<temperatureRGB(6500)[2]);
console.log('Red lantern assets, scope, spacing, source integrity and settings: PASS',layout.placements.length,'lamps');
