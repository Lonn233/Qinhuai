const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const viewer = read('qinhuai-modern-import.js');
const menu = read('main-menu.js');
const filename = 'private-scene-tile-07.glb';
const error = new Error('Failed to fetch /assets/' + filename);
const diagnostics = [];
const node = () => ({textContent: '', style: {}, dataset: {}, children: [], appendChild(child) { this.children.push(child); }});
const elements = new Map();
const get = selector => {
  if (!elements.has(selector)) elements.set(selector, node());
  return elements.get(selector);
};
const context = {
  console: {warn: (...args) => diagnostics.push(args), error: (...args) => diagnostics.push(args)},
  document: {querySelector: get, createElement: node},
  window: {dispatchEvent() {}, addEventListener() {}},
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  Error,
};
vm.createContext(context);
vm.runInContext(read('import-viewer-startup.js'), context);
context.window.__QINHUAI_STARTUP__.fail(error);
assert.equal(context.window.__QINHUAI_STARTUP__.error, error.message, 'raw diagnostics remain available');
assert.equal(get('#status').textContent, '场景加载失败，请重新加载。');

let transfer;
Object.assign(context, {
  loadedTiles: new Map(), failedTiles: new Map(),
  progressText: get('#progressText'), progressBar: get('#progressBar'), statusEl: get('#status'),
  errorsEl: get('#errors'), fmtBytes: bytes => bytes + ' B',
  GLTFLoader: class { load(url, resolve, onProgress, reject) { transfer = {url, resolve, onProgress, reject}; } },
});
const loadStart = viewer.slice(viewer.indexOf('function loadTile('), viewer.indexOf('  const ready = promise.then('));
vm.runInContext(loadStart + '\nreturn promise;\n}', context);
const pending = context.loadTile({id: 7, file: filename, bytes: 100});
assert.ok(transfer.url.includes(filename), 'asset request URL is unchanged');
assert.equal(context.window.__QINHUAI_STARTUP__.phase, '正在加载场景资源…');
transfer.onProgress({loaded: 25, total: 100});
assert.equal(get('#progressText').textContent, '正在加载场景资源 · 25 B / 100 B');
assert.equal(get('#progressBar').style.width, '25%');
transfer.onProgress({loaded: 100, total: 100});
assert.equal(get('#progressText').textContent, '正在准备场景与贴图…');
transfer.resolve({});

vm.runInContext(viewer.slice(viewer.indexOf('function updateProgress('), viewer.indexOf('function removeError(')), context);
context.updateProgress(2, 8, '场景区域 2/8');
assert.equal(get('#progressText').textContent, '25% · 场景区域 2/8');
context.addError({id: 7, file: filename}, error);
const row = get('#errors').children[0];
assert.equal(row.textContent, '部分场景资源加载失败，请重试。');
assert.equal(row.children[0].textContent, '重试');
let retry;
context.loadTile = (...args) => { retry = args; };
row.children[0].onclick();
assert.equal(retry[0].file, filename);
assert.equal(retry[1], true);

Object.assign(context, {$: get, entering: false, home: node(), loading: node(), root: node(), shell: node(), updateLoading() {}});
context.window.__QINHUAI_STARTUP__.enter = async () => { throw error; };
vm.runInContext(menu.slice(menu.indexOf('async function enter(mode)'), menu.indexOf("$('[data-retry]').onclick")), context);
(async () => {
  await pending;
  await context.enter('play');
  assert.equal(get('[data-load-name]').textContent, '场景加载失败，请重新加载。');
  assert.equal(get('[data-retry]').hidden, false);
  for (const element of [...elements.values(), row]) assert.ok(!element.textContent.includes(filename), 'UI never displays the asset filename');
  assert.ok(diagnostics.some(args => args.includes(error)), 'original errors are logged');
  assert.doesNotMatch(viewer, /(?:progressText\.textContent|setStatus\()[^\n]*(?:tile\.file|error\.message|state\.error\s*\+)/);
  console.log('PASS: filename-free download, parsing, progress and failure labels; original URLs, diagnostics and retry preserved.');
})().catch(error => { console.error(error); process.exitCode = 1; });
