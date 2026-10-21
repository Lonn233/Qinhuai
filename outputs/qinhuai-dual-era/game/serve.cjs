const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {createPresetStore,createPresetAPI}=require('./preset-store.cjs');
const {createSceneStore,createSceneAPI}=require('./main-scene-store.cjs');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.glb':'model/gltf-binary','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg'};
function createServer({dataDir=process.env.LANTERN_DATA_DIR||path.join(root,'.local-data'),indexPage='/lantern-festival.html'}={}){
 const privateDir=path.resolve(dataDir),api=createPresetAPI(createPresetStore(privateDir)),sceneAPI=createSceneAPI(createSceneStore(privateDir));
 return http.createServer(async(req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end('Invalid URL');return;}
  if(await sceneAPI(req,res,pathname)||await api(req,res,pathname))return;
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end('Method not allowed');return;}
  const file=path.resolve(root,'.'+(pathname==='/'?indexPage:pathname));
  if((file!==root&&!file.startsWith(root+path.sep))||pathname.split(/[\\/]/).some(part=>part.startsWith('.'))||file===privateDir||file.startsWith(privateDir+path.sep)){res.writeHead(403).end('Forbidden');return;}
  fs.stat(file,(error,stat)=>{if(error||!stat.isFile()){res.writeHead(404).end('Not found');return;}
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
  });
 });
}
if(require.main===module){
 const port=Number(process.env.PORT||4180),server=createServer();
 server.listen(port,'127.0.0.1',()=>console.log(`秦淮试灯室 http://127.0.0.1:${port}/lion-light-study.html\n配色文件：${process.env.LANTERN_DATA_DIR||path.join(root,'.local-data','lantern-presets.json')}`));
 server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`端口 ${port} 已被占用，可设置 PORT 后重试。`:error);process.exitCode=1;});
}
module.exports={createServer};