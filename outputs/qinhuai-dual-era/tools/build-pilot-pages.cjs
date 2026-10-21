// Builds separate, offline acceptance pages. Default always keeps the original GLB.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const {instrument}=require('./instrument-audit.cjs');
const root=path.resolve(__dirname,'..'),reports=path.join(root,'performance/2026-10-17'),snapshot=JSON.parse(fs.readFileSync(path.join(reports,'baseline-snapshot.json'))),baseline=snapshot.baselineDir,stage=path.resolve(root,'../../work/perf-baseline-instrumented-20261017');
const sha=async file=>{const h=crypto.createHash('sha256');for await(const c of fs.createReadStream(file))h.update(c);return h.digest('hex');};
(async()=>{
 for(const item of snapshot.files)if(await sha(path.join(baseline,item.file))!==item.sha256)throw new Error('Frozen baseline changed: '+item.file);
 fs.mkdirSync(stage,{recursive:true});
 for(const f of ['model-source.js','page-template.html','embedded-assets.js','pavilion-lighting.js','pavilion-light-profiles.js','ming-architecture.js'])fs.copyFileSync(path.join(baseline,f),path.join(stage,f));
 fs.writeFileSync(path.join(stage,'model-source.js'),instrument(fs.readFileSync(path.join(stage,'model-source.js'),'utf8')));
 fs.copyFileSync(path.join(root,'performance-audit.js'),path.join(stage,'performance-audit.js'));
 const jobs=[{name:'audit-baseline.html',label:'baseline',source:path.join(stage,'model-source.js'),template:path.join(stage,'page-template.html')},{name:'index.html',label:'optimized-original'},...['LOD0','LOD1','LOD2'].map(level=>({name:'pilot-'+level+'.html',label:'pilot-'+level,level}))];
 const results=[];
 for(const j of jobs){const env={...process.env,QINHUAI_OUTPUT:path.join(root,j.name),QINHUAI_BUILD_LABEL:j.label};for(const k of ['QINHUAI_SOURCE','QINHUAI_TEMPLATE','QINHUAI_PILOT_LEVEL','QINHUAI_STDOUT'])delete env[k];if(j.source)env.QINHUAI_SOURCE=j.source;if(j.template)env.QINHUAI_TEMPLATE=j.template;if(j.level)env.QINHUAI_PILOT_LEVEL=j.level;
 const start=performance.now(),result=spawnSync(process.execPath,['--max-old-space-size=512',path.join(root,'build.cjs')],{cwd:root,env,encoding:'utf8',maxBuffer:4*1024*1024,windowsHide:true});process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.status!==0)throw new Error('Build failed: '+j.name);
 results.push({file:j.name,kind:j.label,bytes:fs.statSync(env.QINHUAI_OUTPUT).size,sha256:await sha(env.QINHUAI_OUTPUT),buildSeconds:(performance.now()-start)/1000,browserVerified:false});
 }
 fs.writeFileSync(path.join(reports,'build-results.json'),JSON.stringify({createdAt:new Date().toISOString(),defaultPavilion:'original',runtimeMeasurementStatus:'blocked_by_saved_browser_permission',pages:results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
