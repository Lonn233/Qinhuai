const fs=require('fs'),path=require('path');
const { once }=require('events');
const { createGzip }=require('zlib');
const deps=process.env.QINHUAI_DEPS||__dirname;
const esbuild=require(path.join(deps,'node_modules/esbuild'));
(async()=>{
 const plugin={name:'source-loader',setup(build){
  build.onResolve({filter:/.*/},args=>{
   let target;
   if(args.path==='three')target=path.join(deps,'node_modules/three/build/three.module.js');
   else if(args.path.startsWith('three/addons/'))target=path.join(deps,'node_modules/three/examples/jsm',args.path.slice(13));
   else target=path.resolve(args.importer?path.dirname(args.importer):__dirname,args.path);
   return {path:target,namespace:'source'};
  });
  build.onLoad({filter:/.*/,namespace:'source'},args=>({contents:fs.readFileSync(args.path,'utf8'),loader:'js'}));
 }};
 const sourceFile=process.env.QINHUAI_SOURCE?path.resolve(process.env.QINHUAI_SOURCE):path.join(__dirname,'model-source.js');
 const pilotLevel=process.env.QINHUAI_PILOT_LEVEL;let pilot=null;
 if(pilotLevel){const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/kuixing-pilot/manifest.json'),'utf8'));if(!manifest.levels[pilotLevel])throw new Error('Unknown pilot level');pilot={...manifest.levels[pilotLevel],level:pilotLevel};const override=process.env.QINHUAI_PILOT_ASSET;if(override)pilot.url=override;}
 const buildInfo={auditProtocol:'qinhuai-20261017-v2',kind:process.env.QINHUAI_BUILD_LABEL||(pilot?'pilot-'+pilotLevel:'optimized-original'),sourceSha256:require('crypto').createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex'),auditSha256:require('crypto').createHash('sha256').update(fs.readFileSync(path.join(path.dirname(sourceFile),'performance-audit.js'))).digest('hex')};
 const buildPrelude='window.__QINHUAI_BUILD__='+JSON.stringify(buildInfo)+';\n';
 const prelude=pilot?'window.__QINHUAI_PAVILION_PILOT__='+JSON.stringify(pilot)+';\n':'';
 const result=await esbuild.build({stdin:{contents:buildPrelude+prelude+fs.readFileSync(sourceFile,'utf8'),loader:'js',sourcefile:sourceFile,resolveDir:path.dirname(sourceFile)},plugins:[plugin],bundle:true,minify:true,format:'iife',write:false,legalComments:'eof',target:['chrome100','edge100','safari15']});
 let bundled=result.outputFiles[0].text;
 for(const [key,file] of [['STREET_COLOR','street-paving.jpg'],['STREET_HEIGHT','street-paving-height.png']])bundled=bundled.replace('__'+key+'__',fs.readFileSync(path.join(__dirname,file)).toString('base64'));
 let html=fs.readFileSync(process.env.QINHUAI_TEMPLATE||path.join(__dirname,'page-template.html'),'utf8');
 if(pilot)html=html.replace('<title>','<title>[魁星阁 '+pilotLevel+' 未验收候选] ');
 for(const [key,file,mime] of [['PLAN','reference-plan.png','png'],['PERSPECTIVE','reference-perspective.webp','webp'],['WEST','reference-west.png','png'],['PAVILION','reference-pavilion.png','png'],['BRIDGE','reference-bridge.png','png'],['NIGHT_DETAIL','reference-night-detail.png','png'],['NIGHT_RIVER','reference-night-river.png','png']])html=html.replaceAll('__'+key+'__','data:image/'+mime+';base64,'+fs.readFileSync(path.join(__dirname,file)).toString('base64'));
 // Model bytes are inert data, never giant JavaScript string literals. Keeping
 // executable code small avoids V8 compilation OOM before startup can run.
 html=html.replace('__SCRIPT__',()=>bundled.replace(/<\/script/gi,'<\\/script'));
 const sections=html.split('__ASSETS__');
 if(sections.length!==2)throw new Error('Expected one __ASSETS__ slot');
 const outputFile=process.env.QINHUAI_OUTPUT||path.join(__dirname,'index.html');
 const stdout=process.env.QINHUAI_STDOUT==='1';
 const temporaryFile=outputFile+'.tmp';
 const stream=stdout?process.stdout:fs.createWriteStream(temporaryFile,{encoding:'utf8'});
 let bytesWritten=0;
 const write=async text=>{
  bytesWritten+=Buffer.byteLength(text);
  await new Promise((resolve,reject)=>stream.write(text,error=>error?reject(error):resolve()));
 };
 stream.on('error',()=>{}); // Failed writes never replace the last good HTML.
 await write(sections[0]);
 const assets=[['BRIDGE','qiao.glb','raw'],['PAVILION',pilot?.url||'Meshy_AI_kuixingge_1016044736_texture.glb','gzip'],['LOTUS_ONE','hehua_1.glb','gzip'],['LOTUS_MAIN','hehua-main.glb','gzip']];
 for(const [id,file,encoding] of assets){
  const assetPath=path.join(__dirname,file),size=fs.statSync(assetPath).size;
  await write(`<div hidden id="asset-${id}" data-encoding="${encoding}" data-bytes="${size}">\n`);
  const input=fs.createReadStream(assetPath,{highWaterMark:192*1024});
  const chunks=encoding==='gzip'?input.pipe(createGzip({level:6,chunkSize:192*1024})):input;
  input.on('error',error=>{if(chunks!==input)chunks.destroy(error);});
  for await(const chunk of chunks){
   // Padding is decoded per block, not after concatenating encoded strings.
   await write(`<script type="application/octet-stream">${chunk.toString('base64')}</script>\n`);
  }
  await write('</div>\n');
 }
 await write(sections[1]);
 if(!stdout){stream.end();await once(stream,'close');fs.renameSync(temporaryFile,outputFile);}
 (stdout?console.error:console.log)('Built offline HTML',stdout?'stdout':outputFile,bytesWritten,'bytes; executable bundle',Buffer.byteLength(bundled),'bytes');
})().catch(e=>{console.error(e);process.exitCode=1});

