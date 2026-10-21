const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),THREE=require('three');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qinhuai-player-unit-')),entry=path.join(dir,'player.cjs');
require('esbuild').buildSync({entryPoints:['import-player.js'],bundle:true,platform:'node',format:'cjs',outfile:entry,external:['three','three/*'],logLevel:'silent',define:{'import.meta.url':JSON.stringify('file:///player.js')}});
const Module=require('node:module'),mod=new Module(entry,module);mod.paths=module.paths;mod._compile(fs.readFileSync(entry,'utf8'),entry);
const {ImportPlayer,PLAYER_SCALE}=mod.exports;
function fixture(){
 const scene=new THREE.Group(),bone=new THREE.Bone();bone.name='hips';scene.add(bone);
 const geometry=new THREE.BoxGeometry(.4,1.7,.3),material=new THREE.MeshStandardMaterial();scene.add(new THREE.Mesh(geometry,material));
 const animations=['Walking','Running'].map(name=>new THREE.AnimationClip(name,1,[new THREE.VectorKeyframeTrack('hips.position',[0,.5,1],[0,0,0,1,.01,1,2,0,2])]));
 return {scene,animations};
}
async function create(surface=()=>0){
 const camera=new THREE.PerspectiveCamera(),data=fixture();camera.lookAt(0,0,-1);
 const player=new ImportPlayer(new THREE.Group(),camera,{load:async()=>data,surface});await player.ready();player.spawn({x:0,z:0,ground:0});player.setMode('thirdPerson');return player;
}
function tick(player,keys,frames=60){for(let i=0;i<frames;i++)player.update(1/60,new Set(keys));}
(async()=>{
 let loads=0,notified=0,fail=true;const data=fixture(),player=new ImportPlayer(new THREE.Group(),new THREE.PerspectiveCamera(),{load:async()=>{loads++;if(fail)throw Error('retry');return data;},surface:()=>0,onReady:avatar=>{
  notified++;assert.equal(avatar,data.scene);assert.equal(avatar.scale.x,PLAYER_SCALE);assert.equal(player.actions.has('Idle'),true);
  avatar.traverse(mesh=>{if(mesh.isMesh)assert.equal(mesh.receiveShadow,true);});
 }});
 await assert.rejects(player.ready(),/retry/);assert.equal(player.stats.error,'retry');assert.equal(notified,0);fail=false;
 await Promise.all([player.ready(),player.ready()]);assert.equal(loads,2);assert.equal(player.stats.error,null);
 await player.ready();assert.equal(notified,1,'receiver registration runs once after preparation, including a successful retry');
 assert.deepEqual(player.stats.clips,['Walking','Running','Idle']);assert.equal(player.avatar.scale.x,PLAYER_SCALE);
 const values=player.actions.get('Walking').getClip().tracks[0].values;assert.equal(values[3],0);assert.equal(values[5],0);assert.ok(values[4]>0);
 assert.equal(data.animations[0].tracks[0].values[3],1,'source clip remains intact');
 player.spawn({x:2,z:3,ground:4});player.setMode('thirdPerson');assert.equal(player.stats.pitchDegrees,45);assert.ok(player.root.visible);
 const position=player.position.toArray();player.setMode('firstPerson');assert.deepEqual(player.position.toArray(),position);assert.equal(player.camera.position.y,4.53);assert.equal(player.root.visible,false);
 player.setMode('thirdPerson');assert.deepEqual(player.position.toArray(),position);player.setMode('orbit');assert.equal(player.root.visible,false);
 const pausedTime=player.mixer.time;tick(player,[],30);assert.equal(player.mixer.time,pausedTime,'hidden orbit avatar does not advance mixer');
 player.setMode('firstPerson');tick(player,[],1);assert.equal(player.mixer.time,pausedTime,'hidden first-person avatar does not advance mixer');
 player.setMode('thirdPerson');tick(player,[],1);assert.ok(player.mixer.time>pausedTime,'visible third-person animation resumes');
 let idleQueries=0;const idle=await create(()=>{idleQueries++;return 0;});
 tick(idle,[],120);assert.equal(idleQueries,0,'idle frames skip ground/collision sweeps');
 tick(idle,['KeyW'],10);assert.ok(idleQueries>0,'moving frames retain precise collisions');idle.dispose();
 const walk=await create(),run=await create(),diagonal=await create();tick(walk,['KeyW']);tick(run,['KeyW','ShiftLeft']);tick(diagonal,['KeyW','KeyD']);
 assert.equal(walk.stats.animation,'Walking');assert.equal(run.stats.animation,'Running');assert.ok(run.position.length()>walk.position.length()*2.8);
 assert.ok(Math.abs(walk.position.length()-diagonal.position.length())<1e-6,'no diagonal speed boost');
 tick(walk,[],90);assert.equal(walk.stats.animation,'Idle');
 const turned=await create();turned.yaw=Math.PI/2;tick(turned,['KeyW']);assert.ok(turned.position.x<-.3);assert.ok(Math.abs(turned.position.z)<1e-6);
 const firstPersonForward=await create();firstPersonForward.setMode('firstPerson');tick(firstPersonForward,['KeyW']);assert.ok(firstPersonForward.position.z<-.3);assert.ok(Math.abs(firstPersonForward.position.x)<1e-6);
 const firstPersonRight=await create();firstPersonRight.setMode('firstPerson');tick(firstPersonRight,['KeyD']);assert.ok(firstPersonRight.position.x>.3);assert.ok(Math.abs(firstPersonRight.position.z)<1e-6);
 const firstPersonLeft=await create();firstPersonLeft.setMode('firstPerson');tick(firstPersonLeft,['KeyA']);assert.ok(firstPersonLeft.position.x<-.3);assert.ok(Math.abs(firstPersonLeft.position.z)<1e-6);
 const blocked=await create(x=>Math.abs(x)>.05?null:0);tick(blocked,['KeyD','KeyW']);assert.ok(blocked.position.x<=.05);assert.ok(blocked.position.z<-.2,'wall sliding retains clear axis');
 const cameraTest=await create(),wall=new THREE.Mesh(new THREE.BoxGeometry(3,3,.05),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));wall.position.set(0,.5,.35);wall.updateMatrixWorld(true);
 cameraTest.obstacles=()=>[wall];cameraTest.updateCamera(0,true);assert.ok(cameraTest.camera.position.distanceTo(cameraTest.target)<cameraTest.distance,'camera avoids walls');
 cameraTest.look(100,100);assert.notEqual(cameraTest.yaw,0);cameraTest.zoom(99999);assert.equal(cameraTest.distance,2.5);cameraTest.zoom(-99999);assert.equal(cameraTest.distance,.65);
 let disposed=0;data.scene.children[1].geometry.addEventListener('dispose',()=>disposed++);player.dispose();player.dispose();assert.equal(disposed,1);
 for(const item of [walk,run,diagonal,turned,firstPersonForward,firstPersonRight,firstPersonLeft,blocked,cameraTest])item.dispose();
 console.log('PASS: load retry/deduplication, source-safe root motion, idle/walk/run, camera switching, speeds, diagonal input, wall sliding and camera obstruction.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>fs.rmSync(dir,{recursive:true,force:true}));
