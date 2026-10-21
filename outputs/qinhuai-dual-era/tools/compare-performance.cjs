const fs=require('node:fs'),path=require('node:path');
const CASES=['overview','dense_buildings','river_reflections','pavilion_close','era_switch'];
const median=a=>{a=a.filter(Number.isFinite).sort((a,b)=>a-b);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;};
function compareReports(before,after){
 for(const r of [before,after]){
  if(r.schema!=='qinhuai-performance-v1'||r.build?.auditProtocol!=='qinhuai-20261017-v2')throw new Error('Unknown report/protocol; use the supplied audit pages');
  if(r.errors?.length||r.waterReflectionFailed)throw new Error('Report contains runtime errors/reflection fallback');
  if(!r.gpuRenderer||!r.threeRevision)throw new Error('Hardware/Three.js identity unavailable; comparison needs manual review');
  if(r.runs.filter(x=>x.valid).length<3)throw new Error('At least three valid runs per report are required');
  for(const run of r.runs.filter(x=>x.valid)){
   if(run.cases.map(c=>c.id).join('|')!==CASES.join('|'))throw new Error('Incomplete or reordered scenarios');
   for(const c of run.cases)if(!c.pose||c.summary.frames<2||!(c.sampleSeconds>=9)||!Number.isFinite(c.summary.averageFps)||!(c.summary.averageFps>0))throw new Error('Invalid sample');
  }
 }
 for(const k of ['userAgent','hardwareConcurrency','deviceMemoryGiB','gpuRenderer','threeRevision'])if(before[k]!==after[k])throw new Error('Device/browser mismatch: '+k);
 const same=(a,b)=>JSON.stringify(a,(_,v)=>typeof v==='number'?Math.round(v*1e6)/1e6:v)===JSON.stringify(b,(_,v)=>typeof v==='number'?Math.round(v*1e6)/1e6:v);
 const reference=before.runs.find(r=>r.valid);
 for(const r of [...before.runs,...after.runs].filter(x=>x.valid)){
  if(!same(r.viewport,reference.viewport)||!same(r.rendererSettings,reference.rendererSettings))throw new Error('Resolution/render settings mismatch');
  for(let i=0;i<CASES.length;i++){const a=r.cases[i],b=reference.cases[i];if(a.weather!==b.weather||a.perspective!==b.perspective||!same(a.pose,b.pose))throw new Error('Camera/weather mismatch: '+a.id);}
 }
 const metrics={averageFps:s=>s.averageFps,onePercentLowFps:s=>s.onePercentLowFps,minimumFps:s=>s.minimumFps,cpuAnimationCallbackMs:s=>s.cpuAnimationCallbackMs?.mean,cpuRenderSubmissionMs:s=>s.cpuRenderSubmissionMs?.mean,gpuMs:s=>s.gpuMs?.mean,drawCalls:s=>s.drawCalls?.mean,submittedTriangles:s=>s.submittedTriangles?.mean,geometries:s=>s.geometries?.mean,textures:s=>s.textures?.mean,jsHeapUsedBytes:s=>s.jsHeapUsedBytes?.mean};
 const cases=CASES.map((id,i)=>({id,metrics:Object.fromEntries(Object.entries(metrics).map(([name,select])=>{const b=median(before.runs.filter(r=>r.valid).map(r=>select(r.cases[i].summary))),a=median(after.runs.filter(r=>r.valid).map(r=>select(r.cases[i].summary)));return [name,{before:b,after:a,changePercent:b!==null&&a!==null&&b!==0?(a-b)/b*100:null}];}))}));
 return {status:'comparison_of_user_collected_runtime_samples',generatedAt:new Date().toISOString(),beforeBuild:before.build,afterBuild:after.build,beforePilot:before.pilot,afterPilot:after.pilot,validRunCounts:[before,after].map(r=>r.runs.filter(x=>x.valid).length),gpuRenderer:before.gpuRenderer,viewport:reference.viewport,cases,notes:['Median of at least three valid runs. Positive change is higher, not always better.','GPU/heap null means unavailable, not zero. JS heap is not VRAM.','Loading times require separate cold/warm page-load repetitions; not inferred from repeated steady-state runs.','CPU animation callback excludes browser compositor and other event handlers. No visual acceptance is implied.']};
}
module.exports={compareReports};
if(require.main===module){try{const [b,a,out]=process.argv.slice(2);if(!b||!a||!out)throw new Error('Usage: node compare-performance.cjs baseline.json optimized.json comparison.json');const report=compareReports(JSON.parse(fs.readFileSync(b)),JSON.parse(fs.readFileSync(a)));fs.writeFileSync(path.resolve(out),JSON.stringify(report,null,2));console.log('Wrote verified-input comparison:',path.resolve(out));}catch(e){console.error(e.message);process.exitCode=1;}}
