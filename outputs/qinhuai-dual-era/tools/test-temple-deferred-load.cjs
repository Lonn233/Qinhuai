const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'qinhuai-modern-import.js'), 'utf8');
const templeVisit = fs.readFileSync(path.join(root, 'import-temple-visit.mjs'), 'utf8');
const context = {
  TEMPLE_TILE_ID: 9,
  query: new URLSearchParams('mode=play&time=night&view=gateDetail'),
  allTiles: () => [{ id: 6 }, { id: 9 }, { id: 10 }],
  sortedNearTiles: () => [{ id: 6 }, { id: 9 }, { id: 10 }],
};
vm.runInNewContext(source.slice(source.indexOf('function tileListForMode('), source.indexOf('function updateSummary(')), context);
assert.equal(context.tileListForMode('near')[0].id, 6, 'gameplay start selects a non-temple tile');
assert.equal(context.tileListForMode('all').length, 3, 'manual full-scene load remains available');
context.query = new URLSearchParams('mode=orbit&time=night&view=courtyard');
assert.equal(context.tileListForMode('near')[0].id, 9, 'explicit courtyard preview loads the temple tile');
context.query = new URLSearchParams('mode=orbit&time=night&view=temple');
assert.equal(context.tileListForMode('near')[0].id, 9, 'explicit temple preview loads the temple tile');
assert.match(templeVisit, /load\(\{onProgress\}\)/, 'temple entry forwards the progress callback into loading');
assert.match(source, /正在加载夫子庙场景/, 'temple progress reports scene transfer');
assert.match(source, /loadGoldenTreeLanterns\(TEMPLE_TILE_ID\)/, 'tree lantern layer is requested independently');
console.log('PASS: gameplay defers the temple tile; explicit temple preview, manual full load, tree lanterns and loading progress remain available.');
