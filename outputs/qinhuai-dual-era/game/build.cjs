const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..');
(async()=>{
 const result=await esbuild.build({entryPoints:[path.join(__dirname,'entry.js')],bundle:true,minify:true,format:'iife',write:false,target:['chrome100','edge100','safari15'],legalComments:'eof'});
 let code=result.outputFiles[0].text;
 for(const [key,file] of [['STREET_COLOR','street-paving.jpg'],['STREET_HEIGHT','street-paving-height.png']])code=code.replace('__'+key+'__',fs.readFileSync(path.join(root,file)).toString('base64'));
 fs.writeFileSync(path.join(__dirname,'festival.bundle.js'),code);
 const ids=['capture','export','ref-perspective','ref-plan','ref-west','ref-pavilion','ref-bridge','ref-night-detail','ref-night-river','building-count','boat-count','first-person-hint','rotate','first-person','reset','era-modern','era-ming','era-status','layers-toggle','wire','night','layers-panel','reference-caption','reference-close','reference-large','reference-next','reference-match','toast'];
 const legacy=ids.map(id=>id.startsWith('ref-')||id==='reference-large'?`<img id="${id}" alt="">`:`<button id="${id}"></button>`).join('')+'<dialog id="reference-dialog"></dialog>';
 const html=fs.readFileSync(path.join(__dirname,'page.html'),'utf8').replace('__LEGACY_CONTROLS__',legacy);
 fs.writeFileSync(path.join(root,'lantern-festival.html'),html);
 console.log('Built lantern-festival.html; bundle '+Math.round(code.length/1024)+' KB. All GLB assets remain external.');
})().catch(e=>{console.error(e);process.exitCode=1;});
