const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, { textContent: '', style: {}, children: [],
    classList: { values: new Set(), add(v) { this.values.add(v); }, remove(v) { this.values.delete(v); } },
    appendChild(v) { this.children.push(v); } });
  return elements.get(id);
}
const frames = [], timers = new Map(), handlers = new Map();
let timerId = 0;
const context = { window: { addEventListener(type, fn) { handlers.set(type, fn); } },
  document: { querySelector: element, createElement: name => ({ name }) },
  location: { reload() {} },
  setTimeout(fn) { const id = ++timerId; timers.set(id, fn); return id; },
  clearTimeout(id) { timers.delete(id); },
  requestAnimationFrame(fn) { frames.push(fn); },
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'import-viewer-startup.js'), 'utf8'), context);
assert.ok(element('#progress').classList.values.has('show'));
assert.equal(frames.length, 1);
assert.equal(timers.size, 1, 'only watchdog runs before first paint');
frames.shift()();
assert.equal(frames.length, 1, 'engine waits for second rendering opportunity');
assert.equal(timers.size, 1);
frames.shift()();
assert.equal(timers.size, 2, 'module import now scheduled after UI painting');
const startup = context.window.__QINHUAI_STARTUP__;
startup.stage('正在下载模型');
assert.equal(element('#status').textContent, '正在下载模型');
handlers.get('unhandledrejection')({ reason: new Error('HTTP 404 fixture') });
assert.match(element('#errors').textContent, /HTTP 404 fixture/);
assert.equal(element('#errors').style.display, 'block');
assert.equal(element('#progress').classList.values.has('show'), false);
assert.equal(element('#errors').children[0].textContent, '重新加载');
const html = fs.readFileSync(path.join(root, 'qinhuai-modern-import.html'), 'utf8');
const startupVersion = html.split('import-viewer-startup.js?v=')[1]?.split('"')[0];
assert.ok(startupVersion, 'startup script has a cache version');
assert.ok(fs.readFileSync(path.join(root, 'import-viewer-startup.js'), 'utf8').includes('qinhuai-modern-import.bundle.js?v=' + startupVersion), 'loader and bundle versions agree');
const viewer = fs.readFileSync(path.join(root, 'qinhuai-modern-import.js'), 'utf8');
const context2 = { query: new URLSearchParams('time=night&view=gateDetail'),
  allTiles: () => [{ id: 6 }, { id: 9 }, { id: 10 }], sortedNearTiles: () => [{ id: 6 }, { id: 9 }, { id: 10 }] };
vm.runInNewContext(viewer.slice(viewer.indexOf('function tileListForMode('), viewer.indexOf('function updateSummary(')), context2);
assert.equal(context2.tileListForMode('near')[0].id, 9, 'gate model loads first for gate close view');
assert.equal(context2.tileListForMode('all').length, 3);
context2.query = new URLSearchParams('time=day');
assert.equal(context2.tileListForMode('near')[0].id, 6, 'day mode preserves original selection');
assert.ok(fs.statSync(path.join(root, 'qinhuai-modern-import.bundle.js')).size > 100000);
console.log('PASS: interface paint before engine, visible startup errors, gate tile priority, bundle present. No browser/GPU rendering tested.');

