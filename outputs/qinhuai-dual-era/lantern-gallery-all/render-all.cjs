const { chromium } = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const out = path.resolve('outputs/qinhuai-dual-era/lantern-gallery-all');
const m='/inspiration/灯会/model/';
const items=[
 ['瑞狮灯',m+'lion/Meshy_AI_Golden_Lion_Dance_Mas_1017092614_texture.glb'],['鳖山灯',m+'鳖山灯/鳖山灯.glb'],['大荷花灯',m+'hehua-main.glb'],['小荷花灯',m+'hehua_1.glb'],['菊水延龄灯',m+'菊水灯.glb'],['路灯',m+'普通灯/路灯1.glb'],['吊灯',m+'普通灯/吊灯1.glb'],['仙鹤灯',m+'灯笼/Meshy_AI_Golden_Crane_Lantern_1017122124_texture.glb'],['金鱼灯',m+'fish/golden_fish.glb'],['女灯',m+'女灯.glb'],['贡院题名灯',m+'贡名灯.glb'],['天马灯',m+'腾马灯.glb'],['绿灯',m+'绿灯.glb'],['蓝灯',m+'蓝灯.glb'],['金灯笼',m+'金灯笼.glb'],['红灯笼',m+'红灯笼.glb'],
 ['庭院灯架-蓝',m+'蓝灯.glb'],['庭院灯架-金',m+'金灯笼.glb'],['庭院灯架-绿',m+'绿灯.glb'],['庭院灯架-红',m+'红灯笼.glb'],
 ['石座立式宫灯',m+'柱台灯.glb'],['盘鼓灯',m+'鼓灯.glb'],['粉彩立式宫灯',m+'粉花灯.glb'],['宫灯灯架',m+'灯架灯.glb'],['特色鱼灯',m+'fish/golden_fish.glb'],['秦淮花神',m+'女灯.glb'],['金色树灯',m+'金灯笼.glb']
];
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Lonn/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--max-old-space-size=8192']});
 const page=await browser.newPage({viewport:{width:720,height:720},deviceScaleFactor:1});
 page.on('pageerror',e=>console.error('PAGEERROR',e.message));
 await page.goto('http://127.0.0.1:8765/project/codex-Qinhuai/outputs/qinhuai-dual-era/lantern-gallery-all/render.html'); await page.waitForFunction(()=>window.ready===true);
 for(let i=0;i<items.length;i++){const [label,url]=items[i];console.log(`[${i+1}/${items.length}] ${label}`);await page.evaluate(url=>window.renderAsset(url),enc(url));await page.locator('canvas').screenshot({path:path.join(out,String(i+1).padStart(2,'0')+'-'+label.replaceAll('/','／')+'.png'),timeout:120000});}
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
