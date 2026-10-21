// Optional sidecar for an already-running static map server. It does not restart Chrome or the map.
const http=require('node:http'),path=require('node:path');
const {createSceneStore,createSceneAPI}=require('./main-scene-store.cjs');
function createStorageServer({dataDir=process.env.LANTERN_DATA_DIR||path.join(__dirname,'..','.local-data'),allowedOrigins=['http://127.0.0.1:4180','http://localhost:4180']}={}){
 const api=createSceneAPI(createSceneStore(dataDir),{allowedOrigins});
 return http.createServer(async(req,res)=>{let url;try{url=new URL(req.url,'http://127.0.0.1');}catch{res.writeHead(400).end();return;}if(!await api(req,res,url.pathname))res.writeHead(404).end('Not found');});
}
if(require.main===module){const port=Number(process.env.SCENE_STORAGE_PORT||4186);createStorageServer().listen(port,'127.0.0.1',()=>console.log(`主地图存档服务 http://127.0.0.1:${port} · 不重启现有地图`)).on('error',e=>{console.error(e);process.exitCode=1;});}
module.exports={createStorageServer};
