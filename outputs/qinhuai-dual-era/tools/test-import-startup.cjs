const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
async function main() {
 const elements = new Map(), handlers = new Map(), events = [];
 const element = id => {if (!elements.has(id)) elements.set(id, {textContent:''}); return elements.get(id);};
 const context = {window:{addEventListener:(type,fn)=>handlers.set(type,fn),dispatchEvent:e=>events.push(e)},
  document:{querySelector:element},console:{error(){}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}}};
 const loader = fs.readFileSync(path.join(root,'import-viewer-startup.js'),'utf8');
 vm.runInNewContext(loader,context);
 const startup = context.window.__QINHUAI_STARTUP__;
 assert.equal(startup.phase,'等待进入游戏');
 assert.equal(startup.loaded,false);
 assert.equal(elements.size,0,'menu must stay idle until a game mode is selected');
 handlers.get('unhandledrejection')({reason:new Error('unrelated menu rejection')});
 assert.equal(startup.error,null,'unrelated menu errors must not mark an unstarted renderer failed');
 await assert.rejects(startup.enter('invalid'),/未知的游戏模式/);
 startup.stage('正在下载模型');
 assert.equal(element('#status').textContent,'正在下载模型');
 assert.equal(events.at(-1).detail.phase,'正在下载模型');
 startup.ready();assert.equal(startup.loaded,true);
 startup.fail(new Error('HTTP 404 fixture'));
 assert.equal(startup.error,'HTTP 404 fixture');
 assert.equal(events.at(-1).detail.error,'HTTP 404 fixture');
 const html = fs.readFileSync(path.join(root,'qinhuai-modern-import.html'),'utf8');
 const version=html.split('import-viewer-startup.js?v=')[1]?.split('"')[0];
 assert.ok(version);assert.ok(loader.includes('qinhuai-modern-import.bundle.js?v='+version));
 const viewer=fs.readFileSync(path.join(root,'qinhuai-modern-import.js'),'utf8');
 const tiles=[{id:6},{id:9},{id:10},{id:5}],loaded=[];
 const c={query:new URLSearchParams('mode=orbit&time=night&view=gateDetail'),TEMPLE_TILE_ID:9,
  allTiles:()=>tiles,sortedNearTiles:()=>tiles,manifest:{},nightLoad:null,tileObjects:new Map(),
  showProgress(){},hideProgress(){},updateProgress(){},updateTimeUI(){},
  async loadTile(tile){loaded.push(tile.id);c.tileObjects.set(tile.id,{});}};
 vm.runInNewContext(viewer.slice(viewer.indexOf('function tileListForMode('),viewer.indexOf('function updateSummary(')),c);
 assert.equal(c.tileListForMode('near')[0].id,9,'gate close view loads its source tile');
 c.query=new URLSearchParams('mode=orbit&time=night&view=courtyard');assert.equal(c.tileListForMode('near')[0].id,9);
 c.query=new URLSearchParams('time=day');assert.equal(c.tileListForMode('near')[0].id,6);
 assert.equal(c.tileListForMode('all').length,4);
 vm.runInNewContext(viewer.slice(viewer.indexOf('async function loadNightLandmarks('),viewer.indexOf('const NIGHT_VIEWS')),c);
 await Promise.all([c.loadNightLandmarks(),c.loadNightLandmarks()]);
 assert.deepEqual(loaded,[9,10,5,6],'ordinary story/night entry must include shared temple exterior and its lamps');
 await c.loadNightLandmarks();assert.equal(loaded.length,4,'already loaded landmarks are reused');
 assert.ok(fs.statSync(path.join(root,'qinhuai-modern-import.bundle.js')).size>100000);
 console.log('PASS: lazy menu startup, error signals, cache versions, story exterior loading, concurrent deduplication.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
