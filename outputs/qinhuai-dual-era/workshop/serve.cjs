const {createServer}=require('../game/serve.cjs');
const port=Number(process.env.PORT||4182);
createServer({indexPage:'/lotus-workshop.html'}).listen(port,'127.0.0.1',()=>console.log(`秦淮灯作 / 主地图 http://127.0.0.1:${port}/qinhuai-modern-import.html\n主场景保存：.local-data/main-scene-settings.json`)).on('error',error=>{console.error(error);process.exitCode=1;});
