import { installPerformanceAudit } from './performance-audit.js';
import * as THREE from 'three';
import { createMingArchitecture } from './ming-architecture.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { installPavilionLighting } from './pavilion-lighting.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { readEmbeddedAsset, runAssetQueue, yieldToBrowser } from './embedded-assets.js';

// Coordinates are inferred from the three supplied views. North = -Z; one unit is a nominal metre.
const $=id=>document.getElementById(id), scene=new THREE.Scene();
const gameConfig=window.__QINHUAI_GAME_CONFIG__||null;
scene.background=new THREE.Color('#c9ccc6');
const weatherRoot=new THREE.Group();weatherRoot.name='Weather_System';scene.add(weatherRoot);
const lotusLightRoot=new THREE.Group();lotusLightRoot.name='Floating_Lotus_Lantern_Lights';weatherRoot.add(lotusLightRoot);
const camera=new THREE.OrthographicCamera(-110,110,80,-80,.1,850);
const firstPersonCamera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,850);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.info.autoReset=false;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.13;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
$('viewport').prepend(renderer.domElement);renderer.domElement.setAttribute('aria-label','秦淮灯会街区三维模型，拖动旋转，滚轮缩放，右键平移');
const sky=new Sky();sky.name='Physical_Sky';sky.scale.setScalar(450000);sky.renderOrder=-1000;sky.material.depthWrite=false;weatherRoot.add(sky);
const cloudRoot=new THREE.Group();cloudRoot.name='Procedural_Cloud_Layer';cloudRoot.renderOrder=-900;weatherRoot.add(cloudRoot);
const celestialRoot=new THREE.Group();celestialRoot.name='Sun_Moon_Details';celestialRoot.renderOrder=-880;weatherRoot.add(celestialRoot);
const waterReflectionRoot=new THREE.Group();waterReflectionRoot.name='Water_Reflection_FX';waterReflectionRoot.renderOrder=2;weatherRoot.add(waterReflectionRoot);
const waterLightRoot=new THREE.Group();waterLightRoot.name='Water_Lantern_Reflections';waterLightRoot.renderOrder=4;weatherRoot.add(waterLightRoot);
const waterLightRipples=[];
const pmremGenerator=new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();
const skyAnimationActive=true;
let waterSurface=null,waterNormalTexture=null;
const cloudSprites=[];
const cloudMotion={worldSpan:520,windX:.42,windZ:.065,quality:'high'};
const skyQuery=typeof location!=='undefined'&&typeof location.search==='string'?(location.search.match(/[?&]sky=(standard|high)/)||[])[1]:'';let skyQuality=skyQuery||((typeof innerWidth==='number'&&innerWidth<900)?'standard':'high');
function makeRadialTexture(inner,outer,stops=5){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
 const g=ctx.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,inner);g.addColorStop(.34,inner);g.addColorStop(.72,outer);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
 return new THREE.CanvasTexture(c);
}
function makeCloudTexture(seed=1,kind='cumulus'){
 const size=512,c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');ctx.clearRect(0,0,size,size);
 let n=seed|0;const rnd=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};
 const count=kind==='wispy'?26:42;
 for(let i=0;i<count;i++){
  const x=kind==='wispy'?28+rnd()*456:62+rnd()*388,y=kind==='wispy'?205+rnd()*92:142+rnd()*192;
  const rx=kind==='wispy'?42+rnd()*108:28+rnd()*88,ry=kind==='wispy'?10+rnd()*24:18+rnd()*58;
  const alpha=kind==='wispy'?.035+rnd()*.08:.07+rnd()*.17;
  const g=ctx.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));
   g.addColorStop(0,'rgba(255,255,255,'+alpha+')');g.addColorStop(.58,'rgba(245,249,247,'+(alpha*.54)+')');g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rnd()*.18-.09,0,Math.PI*2);ctx.fill();
 }
 const texture=new THREE.CanvasTexture(c);texture.name=kind==='wispy'?'Qinhuai_Cloud_Wispy':'Qinhuai_Cloud_Cumulus';texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;return texture;
}
const cloudTextures=[makeCloudTexture(17,'cumulus'),makeCloudTexture(41,'cumulus'),makeCloudTexture(73,'wispy')];
for(let i=0;i<13;i++){
 const wispy=i%5===0,material=new THREE.SpriteMaterial({map:cloudTextures[i%cloudTextures.length],color:0xf6f8f3,transparent:true,opacity:wispy?.28:.46,depthWrite:false,depthTest:false,fog:false,toneMapped:false});
 const sprite=new THREE.Sprite(material);sprite.name='Cloud_'+String(i+1).padStart(2,'0');sprite.position.set(-220+(i%5)*88+(i%2)*13,72+(i%4)*10,-205+Math.floor(i/5)*92+(i%3)*18);sprite.scale.set(wispy?70+(i%3)*18:42+(i%4)*18,wispy?15+(i%3)*5:22+(i%3)*11,1);sprite.rotation.z=(i%5-.5)*.08;
 sprite.userData={baseX:sprite.position.x,baseY:sprite.position.y,baseZ:sprite.position.z,phase:i*1.73,velocityX:.28+(i%4)*.075,velocityZ:.018+(i%3)*.009};cloudRoot.add(sprite);cloudSprites.push(sprite);
}
function setSkyQuality(value){
 skyQuality=value==='high'?'high':'standard';
 const visibleCount=skyQuality==='high'?cloudSprites.length:7;
 cloudSprites.forEach((sprite,index)=>{sprite.visible=index<visibleCount;});
 cloudMotion.quality=skyQuality;cloudMotion.windX=skyQuality==='high'?.42:.32;cloudMotion.windZ=skyQuality==='high'?.065:.045;
 if(typeof needsRender!=='undefined')needsRender=true;
}
const sunSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:makeRadialTexture('rgba(255,250,213,1)','rgba(255,199,94,.1)'),color:0xffedbd,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));sunSprite.name='Sun_Disc';sunSprite.scale.set(24,24,1);celestialRoot.add(sunSprite);
const sunGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:makeRadialTexture('rgba(255,241,190,.72)','rgba(255,176,70,0)'),color:0xffd980,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));sunGlow.name='Sun_Glow';sunGlow.scale.set(68,68,1);celestialRoot.add(sunGlow);
const moonSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:makeRadialTexture('rgba(245,248,255,1)','rgba(167,198,242,.06)'),color:0xddeaff,transparent:true,depthWrite:false,depthTest:false}));moonSprite.name='Moon_Disc';moonSprite.scale.set(15,15,1);celestialRoot.add(moonSprite);
const moonGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:makeRadialTexture('rgba(173,205,255,.22)','rgba(66,126,213,0)'),color:0x8bb8ff,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));moonGlow.name='Moon_Glow';moonGlow.scale.set(44,44,1);celestialRoot.add(moonGlow);
const moonDirection=new THREE.Vector3();
function updateCelestials(preset){
 const sunDistance=320;sunSprite.position.copy(skySun).multiplyScalar(sunDistance);sunGlow.position.copy(sunSprite.position);
 moonDirection.setFromSphericalCoords(1,THREE.MathUtils.degToRad(90-38),THREE.MathUtils.degToRad((preset.azimuth||148)+188));moonSprite.position.copy(moonDirection).multiplyScalar(280);moonGlow.position.copy(moonSprite.position);
 sunSprite.visible=sunGlow.visible=weather!=='night';moonSprite.visible=moonGlow.visible=weather==='night';
}
function updateSkyAnimation(now){
 const t=now*.001,span=cloudMotion.worldSpan;for(const sprite of cloudSprites){const d=sprite.userData;const wrapped=((d.baseX+d.velocityX*cloudMotion.windX/.42*t+span*.5)%span+span)%span-span*.5;sprite.position.x=wrapped;sprite.position.z=d.baseZ+Math.sin(t*d.velocityZ+d.phase)*2.8;sprite.position.y=d.baseY+Math.sin(t*.012+d.phase)*.35;}
}
function makeWaterNormalTexture(){
 const size=512,c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');
 ctx.fillStyle='rgb(128,128,255)';ctx.fillRect(0,0,size,size);
 let seed=918273645;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const drawStroke=(x,y,length,width,angle,color,alpha)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-length*.5,0);ctx.quadraticCurveTo(0,(rnd()-.5)*width*2,length*.5,0);ctx.stroke();ctx.restore();};
 for(let i=0;i<1050;i++){
  const angle=(rnd()>.5?.08:-.08)+(rnd()-.5)*.55;
  drawStroke(rnd()*size,rnd()*size,8+rnd()*40,.7+rnd()*2.8,angle,rnd()>.5?'#9c72ff':'#6b9fff',.12+rnd()*.16);
 }
 for(let i=0;i<180;i++)drawStroke(rnd()*size,rnd()*size,28+rnd()*70,.5+rnd()*1.4,(rnd()-.5)*.22,'#a58cff',.08+rnd()*.08);
 ctx.globalAlpha=1;
 const texture=new THREE.CanvasTexture(c);texture.name='Qinhuai_Water_Procedural_Normal';texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.RepeatWrapping;texture.colorSpace=THREE.NoColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());texture.needsUpdate=true;return texture;
}
function installWaterReflection(points){
 const shape=new THREE.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
 const geometry=new THREE.ShapeGeometry(shape);geometry.translate(0,-.184,0);
 waterNormalTexture=makeWaterNormalTexture();
 waterSurface=new Water(geometry,{textureWidth:Math.min(768,Math.max(384,Math.floor(innerWidth*.62))),textureHeight:Math.min(512,Math.max(256,Math.floor(innerHeight*.42))),waterNormals:waterNormalTexture,sunDirection:new THREE.Vector3(.45,.82,.34),sunColor:0xfff0d8,waterColor:0x527c7e,distortionScale:1.45,alpha:.92,fog:true});
 waterSurface.name='Qinhuai_Water_Official_WaterJS';waterSurface.rotation.x=-Math.PI/2;waterSurface.renderOrder=3;waterSurface.material.depthWrite=true;waterSurface.material.transparent=false;waterSurface.material.uniforms.size.value=5.2;
 waterSurface.userData={weatherFX:true,reflectionOnly:false,officialWater:true,normalTexture:waterNormalTexture};waterReflectionRoot.add(waterSurface);
}

const environmentCache=new Map();
const skySun=new THREE.Vector3();const waterSunDirection=new THREE.Vector3();
const WEATHER_NAMES=new Set(['clear','overcast','mist','night']);
const WEATHER_PRESETS={
 clear:{background:'#c9ccc6',turbidity:2.5,rayleigh:2.35,mieCoefficient:.003,mieDirectionalG:.8,elevation:35,azimuth:148,hemi:1.9,sun:2.65,fill:.55,sunColor:'#fff0d2',exposure:.96,fog:null,water:'#3f6264',waterDistortion:1.45,waterAlpha:.92,waterSize:5.2},
 overcast:{background:'#aeb9bd',turbidity:10,rayleigh:.7,mieCoefficient:.012,mieDirectionalG:.76,elevation:48,azimuth:155,hemi:2.35,sun:.78,fill:.86,sunColor:'#d7e3eb',exposure:.98,fog:null,water:'#38575a',waterDistortion:1.05,waterAlpha:.94,waterSize:5.8},
 mist:{background:'#b8c3c0',turbidity:7.5,rayleigh:.9,mieCoefficient:.009,mieDirectionalG:.74,elevation:22,azimuth:160,hemi:2.2,sun:1.1,fill:.68,sunColor:'#e5edf2',exposure:1.0,fog:{color:'#c1cbc7',density:.0036},water:'#4b6b6d',waterDistortion:.82,waterAlpha:.95,waterSize:6.2},
 night:{background:'#081629',hemi:.24,sun:.12,fill:.18,sunColor:'#adc8ff',exposure:1.05,fog:null,water:'#10272d',waterDistortion:.72,waterAlpha:.96,waterSize:6.4}
};
function applySkyParameters(target,preset){
 if(!target?.material?.uniforms?.turbidity)return;
 const u=target.material.uniforms;
 u.turbidity.value=preset.turbidity;u.rayleigh.value=preset.rayleigh;u.mieCoefficient.value=preset.mieCoefficient;u.mieDirectionalG.value=preset.mieDirectionalG;
 const phi=THREE.MathUtils.degToRad(90-preset.elevation),theta=THREE.MathUtils.degToRad(preset.azimuth);
 skySun.setFromSphericalCoords(1,phi,theta);u.sunPosition.value.copy(skySun);
}
function buildEnvironment(weatherName){
 if(weatherName==='night'){scene.environment=null;return;}
 let target=environmentCache.get(weatherName);
 if(!target){
  const preset=WEATHER_PRESETS[weatherName],envScene=new THREE.Scene(),envSky=new Sky();
  envSky.scale.setScalar(450000);envSky.material.depthWrite=false;applySkyParameters(envSky,preset);envScene.add(envSky);
  target=pmremGenerator.fromScene(envScene);envSky.geometry.dispose();envSky.material.dispose();environmentCache.set(weatherName,target);
 }
 scene.environment=target.texture;
}
function disposeWeatherResources(){
 for(const target of environmentCache.values())target.dispose();
 environmentCache.clear();pmremGenerator.dispose();sky.geometry.dispose();sky.material.dispose();
 for(const texture of cloudTextures)texture.dispose();
 for(const object of [sunSprite,sunGlow,moonSprite,moonGlow]){object.material.map?.dispose();object.material.dispose();}
 waterSurface?.material?.uniforms?.mirrorSampler?.value?.dispose?.();waterSurface?.geometry?.dispose();waterSurface?.material?.dispose();waterNormalTexture?.dispose();
}
addEventListener('beforeunload',disposeWeatherResources);
renderer.domElement.tabIndex=0;
const controls=new OrbitControls(camera,renderer.domElement);
const firstPersonControls=new PointerLockControls(firstPersonCamera,renderer.domElement);firstPersonControls.pointerSpeed=.72;
controls.enableDamping=true;controls.dampingFactor=.095;controls.minZoom=.65;controls.maxZoom=10;controls.maxPolarAngle=Math.PI*.485;controls.minPolarAngle=.01;controls.autoRotateSpeed=.32;
const hemi=new THREE.HemisphereLight(0xe8f0f4,0x6d7165,2.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff2dc,3.3);sun.position.set(-80,140,30);sun.castShadow=true;
sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-115,right:115,top:115,bottom:-115,near:1,far:400});sun.shadow.bias=-.0002;sun.shadow.normalBias=.12;
sun.target.position.set(0,0,-12);scene.add(sun,sun.target);
const fill=new THREE.DirectionalLight(0xcbdde8,.65);fill.position.set(80,45,-65);scene.add(fill);
const model=new THREE.Group();model.name='Qinhuai_Reference_District';scene.add(model);
const lotusRoot=new THREE.Group();lotusRoot.name='Floating_Lotus_Lanterns';model.add(lotusRoot);
const groups={};for(const [id,name] of Object.entries({ground:'00_Quays_and_paving',water:'01_Qinhuai_river',temple:'02_Temple_courtyard_axis',west:'03_West_commercial_quarter',east:'04_East_courtyard_quarter',south:'05_South_riverside_street',boats:'06_Yellow_tourist_boats',trees:'07_Trees_and_planting',details:'08_Railings_street_furniture',pavilion:'09_Riverside_pavilion',bridge:'10_Original_bridge_and_approaches'})){const g=new THREE.Group();g.name=name;groups[id]=g;model.add(g);}
const modernBuildings=new THREE.Group();modernBuildings.name='Modern_Qinhuai_Buildings';
const mingBuildings=new THREE.Group();mingBuildings.name='Ming_Early_Qinhuai_Buildings';
model.add(modernBuildings,mingBuildings);
modernBuildings.add(groups.temple,groups.west,groups.east,groups.south,groups.pavilion);
modernBuildings.visible=true;mingBuildings.visible=false;
groups.pavilionSite=new THREE.Group();groups.pavilionSite.name='Shared_Pavilion_Podium_Planting_and_Steps';model.add(groups.pavilionSite);
let seed=33821;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}const range=(a,b)=>a+(b-a)*rand();
function canvasTexture(kind){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
 if(kind==='roof'){
  ctx.fillStyle='#53595a';ctx.fillRect(0,0,512,512);
  for(let x=0;x<512;x+=16){const g=ctx.createLinearGradient(x,0,x+16,0);g.addColorStop(0,'#343c3d');g.addColorStop(.28,'#7e8583');g.addColorStop(.55,'#636c6b');g.addColorStop(1,'#414b4b');ctx.fillStyle=g;ctx.fillRect(x,0,16,512);
   for(let y=0;y<512;y+=28){ctx.strokeStyle='rgba(13,26,24,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+8,y+5,x+16,y);ctx.stroke();ctx.fillStyle='rgba(207,216,192,.23)';ctx.fillRect(x+2,y+3,11,1);}}
 }else if(kind==='paving'){
  ctx.fillStyle='#bdbcb4';ctx.fillRect(0,0,512,512);
  for(let y=0;y<512;y+=64)for(let x=-64;x<512;x+=128){ctx.fillStyle=['#c2c1b9','#b7bab4','#babdb6','#c6c5bc'][Math.floor(rand()*4)];ctx.fillRect(x+(y%128?64:0)+2,y+2,124,60);}
 }else if(kind==='wall'){
  ctx.fillStyle='#d7d4c6';ctx.fillRect(0,0,512,512);
 }else if(kind==='water'){
  ctx.fillStyle='#315b5d';ctx.fillRect(0,0,512,512);
  for(let i=0;i<760;i++){const x=rand()*512,y=rand()*512;ctx.strokeStyle=rand()>.54?'rgba(177,217,205,.022)':'rgba(8,35,39,.026)';ctx.lineWidth=.35+rand()*.55;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+range(8,24),y+range(-1.2,1.2),x+range(18,52),y+range(-1.5,1.5));ctx.stroke();}
 }
 if(kind!=='water')for(let i=0;i<17000;i++){ctx.fillStyle=rand()>.5?'rgba(255,255,238,.05)':'rgba(31,44,35,.045)';ctx.fillRect(rand()*512,rand()*512,range(.3,2),range(.3,2));}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=8;return tex;
}
const tex={roof:canvasTexture('roof'),paving:canvasTexture('paving'),wall:canvasTexture('wall'),water:canvasTexture('water')};tex.water.repeat.set(.042,.052);
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.9,...extra});
const M={
 plaster:mat('#e0e0da',{map:tex.wall}),plaster2:mat('#c5c6ba'),stone:mat('#b5b7ae'),stoneLight:mat('#d8d4c8'),paving:mat('#ffffff',{map:tex.paving}),soil:mat('#676c5d'),grass:mat('#7f9563'),darkGrass:mat('#647a53'),wood:mat('#423c31'),woodLight:mat('#655447'),redwood:mat('#674439'),glass:mat('#3b4943',{roughness:.6}),roof:mat('#b8bcc0',{map:tex.roof,side:THREE.DoubleSide}),ridge:mat('#626b68'),roofEdge:mat('#434e4c'),water:new THREE.MeshPhysicalMaterial({color:'#40696c',map:tex.water,roughness:.34,metalness:.025,envMapIntensity:1.05,clearcoat:.28,clearcoatRoughness:.3}),boat:mat('#5e3b22'),boatTrim:mat('#b58035'),yellow:mat('#efbd19'),yellowShade:mat('#cb9311'),black:mat('#272e27'),red:mat('#a44e30'),gold:mat('#c89b38'),lamp:mat('#f0d591',{emissive:'#e8ba51',emissiveIntensity:.05}),white:mat('#e3ded0')};
// Animated river surface. The geometry remains unchanged; moving normals and reflection glints create the flow.
let waterAnimationActive=true;
function installWaterShader(){
 M.water.onBeforeCompile=shader=>{
  shader.uniforms.uWaterTime={value:0};
  shader.vertexShader=shader.vertexShader.replace('void main() {','varying vec3 vWaterWorldPos;\nvoid main() {');
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n vWaterWorldPos=(modelMatrix*vec4(transformed,1.0)).xyz;');
  shader.fragmentShader=shader.fragmentShader.replace('void main() {','uniform float uWaterTime;\nvarying vec3 vWaterWorldPos;\nfloat waterHeight(vec2 p){\n float t=uWaterTime;\n vec2 flow=p+vec2(t*.26,t*.045);\n float longWave=sin(dot(flow,vec2(.92,.12))*.72)*.024;\n float crossWave=sin(dot(flow,vec2(.72,-.28))*1.52+t*.24)*.010;\n float fineWave=sin(dot(p,vec2(-.22,.98))*5.8-t*.55)*.005;\n return longWave+crossWave+fineWave;\n}\nvec3 waterWaveNormal(vec2 p){\n float e=.08;\n float h=waterHeight(p);\n float hx=(waterHeight(p+vec2(e,0.0))-h)/e;\n float hz=(waterHeight(p+vec2(0.0,e))-h)/e;\n return normalize(vec3(-hx*.42,1.0,-hz*.42));\n}\nvoid main() {');
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\n vec3 waterNormalView=normalize(waterWaveNormal(vWaterWorldPos.xz));\n normal=normalize(mix(normal,waterNormalView,.2));');
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n float softFlow=.5+.5*sin(dot(vWaterWorldPos.xz,vec2(.9,.12))*.72+uWaterTime*.26);\n diffuseColor.rgb*=mix(.994,1.006,softFlow);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <output_fragment>','float waterViewFresnel=pow(1.0-max(dot(normal,normalize(-vViewPosition)),0.0),3.0);\n float waterGlintA=smoothstep(.88,.995,sin(dot(vWaterWorldPos.xz,vec2(.86,.14))*3.8+uWaterTime*.42));\n float waterGlintB=smoothstep(.91,.998,sin(dot(vWaterWorldPos.xz,vec2(-.16,.99))*7.4-uWaterTime*.58));\n outgoingLight+=vec3(.035,.075,.072)*(waterGlintA*.12+waterGlintB*.08)*(0.35+waterViewFresnel*.7);\n #include <output_fragment>');

  M.water.userData.waterUniforms=shader.uniforms;
 };
 M.water.needsUpdate=true;
}
installWaterShader();
function updateWaterAnimation(now){
 const uniforms=M.water.userData.waterUniforms;
 if(uniforms?.uWaterTime)uniforms.uWaterTime.value=now*.001;
 if(waterSurface?.material?.uniforms?.time)waterSurface.material.uniforms.time.value=now*.001;
 const t=now*.001;for(const ripple of waterLightRipples){if(ripple.material.uniforms){ripple.material.uniforms.uTime.value=t;ripple.material.uniforms.uLanternIntensity.value=night?1:0;}}
}
// Street-only material. Preserve the legacy paving on bridges, stairs and building terraces.
const streetLoader=new THREE.TextureLoader();
let streetLoadError=null;
const streetReady=Promise.all([
 streetLoader.loadAsync('data:image/jpeg;base64,__STREET_COLOR__'),
 streetLoader.loadAsync('data:image/png;base64,__STREET_HEIGHT__')
]).then(([color,height])=>{
 for(const t of [color,height]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());}
 color.colorSpace=THREE.SRGBColorSpace;color.name='Street_reference_staggered_stone';height.name='Street_stone_recessed_joints';
 M.street.map=color;M.street.bumpMap=height;M.street.needsUpdate=true;
}).catch(error=>{streetLoadError=error;console.error('Street textures',error);});
M.street=mat('#ffffff',{roughness:.96,bumpScale:.018});M.street.name='Street_only_reference_stone';
M.street.userData={source:'street-reference.png',tileMetres:[2.4,1.8],stoneMetres:[.6,.45],scope:'ground street and plaza top faces only'};
// World-aligned UVs keep the same stone size on narrow lanes and large squares.
function streetSurface(g,geometry){
 const geo=geometry.index?geometry.toNonIndexed():geometry, p=geo.attributes.position,n=geo.attributes.normal,uv=geo.attributes.uv;
 const top={position:[],normal:[],uv:[]},other={position:[],normal:[],uv:[]};
 for(let i=0;i<p.count;i+=3){const isTop=n.getY(i)>.9,target=isTop?top:other;
  for(let j=i;j<i+3;j++){target.position.push(p.getX(j),p.getY(j),p.getZ(j));target.normal.push(n.getX(j),n.getY(j),n.getZ(j));target.uv.push(...(isTop?[p.getX(j)/2.4,-p.getZ(j)/1.8]:[uv.getX(j),uv.getY(j)]));}
 }
 for(const [data,material] of [[top,M.street],[other,M.paving]]){if(!data.position.length)continue;const part=new THREE.BufferGeometry();for(const [name,size] of [['position',3],['normal',3],['uv',2]])part.setAttribute(name,new THREE.Float32BufferAttribute(data[name],size));addGeo(g,material,part);}
 geo.dispose();if(geo!==geometry)geometry.dispose();
}
const leafTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const t=c.getContext('2d');t.fillStyle='#a9b596';t.fillRect(0,0,256,256);for(let i=0;i<11000;i++){t.fillStyle=rand()>.5?'rgba(28,53,19,.3)':'rgba(227,233,191,.32)';t.beginPath();t.ellipse(rand()*256,rand()*256,range(.5,2.2),range(.5,1.4),rand()*3.14,0,Math.PI*2);t.fill();}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;})();
const leafMats=['#71844e','#81935b','#8c9d62','#667d50','#96a56a'].map(c=>mat(c,{map:leafTex}));
const geometries={box:new THREE.BoxGeometry(1,1,1),cylinder:new THREE.CylinderGeometry(1,1,1,8),sphere:new THREE.IcosahedronGeometry(1,1),leaf:new THREE.IcosahedronGeometry(1,2)};
const leafPos=geometries.leaf.attributes.position;for(let i=0;i<leafPos.count;i++){const x=leafPos.getX(i),y=leafPos.getY(i),z=leafPos.getZ(i),r=1+.09*Math.sin(x*24+y*17+z*29)+.04*Math.cos(x*33-z*37);leafPos.setXYZ(i,x*r,y*r,z*r);}geometries.leaf.computeVertexNormals();
const batches=new Map(), custom=new Map(), dummy=new THREE.Object3D();let buildingCount=0,treeCount=0,boatCount=0;
function instance(group,geo,material,pos,scale,rotation=[0,0,0]){
 const key=group.uuid+geo.uuid+material.uuid;let b=batches.get(key);if(!b){b={group,geo,material,matrices:[]};batches.set(key,b)}
 dummy.position.set(...pos);dummy.scale.set(...scale);dummy.rotation.set(...rotation);dummy.updateMatrix();b.matrices.push(dummy.matrix.clone());
}
function box(g,m,x,y,z,w,h,d,ry=0){if(g===groups.ground&&m===M.paving){const geo=new THREE.BoxGeometry(w,h,d);geo.rotateY(ry);geo.translate(x,y,z);streetSurface(g,geo);return;}instance(g,geometries.box,m,[x,y,z],[w,h,d],[0,ry,0])}
function pole(g,m,x,y,z,r,h){instance(g,geometries.cylinder,m,[x,y,z],[r,h,r])}
function beam(g,m,a,b,r=.08){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av);dummy.position.copy(av.add(bv).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(r,v.length(),r);dummy.updateMatrix();const key=g.uuid+geometries.cylinder.uuid+m.uuid;let ba=batches.get(key);if(!ba){ba={group:g,geo:geometries.cylinder,material:m,matrices:[]};batches.set(key,ba)}ba.matrices.push(dummy.matrix.clone());}
function addGeo(g,material,geo,matrix){if(matrix)geo.applyMatrix4(matrix);if(!geo.index)geo=geo.toNonIndexed();if(!geo.attributes.normal)geo.computeVertexNormals();const key=g.uuid+material.uuid+Object.keys(geo.attributes).join(',');let b=custom.get(key);if(!b){b={g,material,geos:[]};custom.set(key,b)}b.geos.push(geo);}
function polygon(g,pts,y,depth,material){const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);geo.translate(0,y-depth,0);const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/5,uv.getY(i)/5);if(g===groups.ground&&material===M.paving)streetSurface(g,geo);else addGeo(g,material,geo);}
function strip(g,pts,y,width,height,material){for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);box(g,material,(a[0]+b[0])/2,y,(a[1]+b[1])/2,width,height,l+.08,Math.atan2(dx,dz));}}
function railing(pts,y=1.1,spacing=1.55,material=M.stoneLight,g=groups.details){
 for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/spacing));for(let j=0;j<=n;j++){const t=j/n,x=THREE.MathUtils.lerp(a[0],b[0],t),z=THREE.MathUtils.lerp(a[1],b[1],t);box(g,material,x,y+.52,z,.2,1.12,.2);box(g,material,x,y+1.12,z,.27,.13,.27);}strip(g,[a,b],y+.9,.14,.16,material);strip(g,[a,b],y+.33,.12,.13,material);}}
function frame(g,x,z,angle=0,base=0){const ca=Math.cos(angle),sa=Math.sin(angle);return {g,x,z,angle,base,p:(a,y,b)=>[x+a*ca+b*sa,y+base,z-a*sa+b*ca],b(m,a,y,b,w,h,d){const p=this.p(a,y,b);box(g,m,...p,w,h,d,angle)},beam(m,a,b,r){beam(g,m,this.p(...a),this.p(...b),r)},geo(m,geo){const matrix=new THREE.Matrix4().makeRotationY(angle);matrix.setPosition(x,base,z);addGeo(g,m,geo,matrix)}};}

// Continuous embankments, with the large mooring basin and the curved east peninsula traced by hand.
const northBank=[[-74,10],[-57,10],[-43,9],[-35,7.5],[-32,6.8],[-31.32,6.5],[-25.7,6.5],[-24.8,6.4],[-24,5.95],[-23.35,5.2],[-22.9,4.3],[-22.2,3.55],[-20.8,3.1],[-18,3],[10,3],[14,4],[14.5,9],[17,13],[21,16.2],[26,18],[32,18.5],[38,17.5],[44,15.8],[54,15],[66,13],[74,10]];
// The west bank recedes behind the bridge, keeping all three openings over water.
const southBank=[[-74,16],[-57,16],[-44,15],[-37,15.5],[-35.5,16],[-34.4,17],[-33.9,18.5],[-33.5,21],[-32.8,23.4],[-31.32,24.8],[-25.7,24.8],[-24.7,25.7],[-23.9,27],[-23.1,28.5],[-22,29.5],[-20,30.5],[-18,31],[-10,32],[2,31],[12,28],[22,23],[35,22],[49,22],[63,20],[74,17]];
const northOutline=[[-74,10],[-72,-24],[-61,-24],[-61,-44],[-35,-44],[-35,-60],[-16,-60],[-16,-83],[29,-83],[29,-70],[36,-70],[36,-46],[46,-46],[46,-31],[65,-31],[65,-7],[74,-7],...northBank.slice().reverse()];
const southOutline=[...southBank,[74,48],[-74,48]];
polygon(groups.ground,northOutline,.3,1.1,M.paving);polygon(groups.ground,southOutline,.3,1.1,M.paving);
const waterBoundary=[...northBank,...southBank.slice().reverse()];polygon(groups.water,waterBoundary,-.2,.15,M.water);installWaterReflection(waterBoundary);
strip(groups.ground,northBank,.05,.65,1.2,M.stone);strip(groups.ground,southBank,.05,.6,1.2,M.stone);
strip(groups.ground,northBank,.69,.9,.16,M.stoneLight);strip(groups.ground,southBank,.66,.8,.15,M.stoneLight);
// Dark waterline courses and joints make the retaining wall readable in close views.
strip(groups.ground,northBank,-.15,.69,.15,M.plaster2);strip(groups.ground,southBank,-.15,.65,.15,M.plaster2);
// Leave openings in the quay parapets at the bridge and at the pavilion gallery.
for(let i=0;i<northBank.length-1;i++){
 const a=northBank[i],b=northBank[i+1],mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;
 if((mx>-31.35&&mx<-25.65&&mz>5)||(mx>14&&mx<44))continue;
 railing([a,b],.7,1.7);
}
railing(southBank.slice(southBank.findIndex(p=>p[0]===-22&&p[1]===29.5)),.7,1.8);
polygon(groups.ground,[[-71,5],[-44,5],[-32,1],[-33,3],[-44,7.6],[-72,8]],.45,.18,M.grass);
polygon(groups.ground,[[44,13],[61,10],[67,11],[54,14],[44,15]],.47,.18,M.grass);
polygon(groups.ground,[[-22,32],[-11,33],[2,32],[13,29],[23,24],[63,22],[64,25],[25,27],[13,32],[0,35],[-22,35]],.44,.17,M.grass);
// Paved south street is deliberately kept clear from one end of the model to the other.
box(groups.ground,M.stoneLight,0,.42,38.5,148,.08,.28);
box(groups.ground,M.stoneLight,0,.42,42.7,148,.08,.25);
// Boat landing below the public plaza.
polygon(groups.ground,[[-19,3.5],[13,3.9],[13,6.8],[-19,6.8]],.25,.55,M.redwood);
for(let i=0;i<7;i++)box(groups.details,M.wood,-17+i*4.7,.34,5.1,.09,.05,2.8);

function roof(f,w,d,eave,rise,{hip=false,over=.55,material=M.roof}={}){
 const ridgeMat=material===M.yellow?M.yellowShade:M.ridge,edgeMat=material===M.yellow?M.boatTrim:M.roofEdge;
 const W=w/2+over,D=d/2+over,nu=Math.max(12,Math.ceil(W*3)),nv=10;
 const slope=(u,v)=>eave+rise*Math.pow(1-v,1.6)+.19*Math.pow(v,8)+.23*Math.pow(Math.abs(u),10)*Math.pow(v,5);
 for(const sign of [-1,1]){
  const p=[],uv=[],idx=[];
  for(let j=0;j<=nv;j++){const v=j/nv;const width=hip?W-(1-v)*Math.min(D*.72,W*.45):W;
   for(let i=0;i<=nu;i++){const u=i/nu*2-1;p.push(u*width,slope(u,v),sign*v*D);uv.push((u*width+W)/9,v*D/9);}}
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,e=c+1;if(sign===1)idx.push(a,c,b,b,c,e);else idx.push(a,b,c,b,e,c);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();f.geo(material,geo);
  // Scalloped eaves: real end caps plus a strong timber fascia under each slope.
  f.b(edgeMat,0,eave+.03,sign*D,W*2,.23,.2);
  for(let x=-W+.15;x<W;x+=.36)f.b(ridgeMat,x,eave+.2+.23*Math.pow(Math.abs(x/W),10),sign*(D+.025),.22,.12,.23);
 }
 if(hip){
  const inner=W-Math.min(D*.72,W*.45);
  for(const s of [-1,1]){
   const p=[],uv=[],idx=[],n=10;
   for(let j=0;j<=n;j++){const v=j/n;for(let i=0;i<=n;i++){const u=i/n*2-1;p.push(s*(inner+(W-inner)*v),slope(u,v),u*v*D);uv.push((u*v*D+D)/9,v*(W-inner)/9);}}
   for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i;idx.push(a,a+1,a+n+1,a+1,a+n+2,a+n+1)}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();f.geo(material,geo);
   for(const zsign of [-1,1])for(let j=0;j<12;j++){const t=j/12,u=(j+1)/12;f.beam(ridgeMat,[s*(inner+(W-inner)*t),slope(1,t)+.12,zsign*t*D],[s*(inner+(W-inner)*u),slope(1,u)+.12,zsign*u*D],.12);}
  }
 }
 const ridgeLength=hip?2*(W-Math.min(D*.72,W*.45)):2*W;
 f.b(ridgeMat,0,eave+rise+.14,0,ridgeLength,.25,.3);
 for(const s of [-1,1]){
  const edge=hip?ridgeLength/2:W;
  f.beam(ridgeMat,[s*(edge-.45),eave+rise+.18,0],[s*(edge+.16),eave+rise+(hip?.45:.23),0],.12);
  if(!hip){for(const zsign of [-1,1])for(let j=0;j<10;j++){const a=j/10,b=(j+1)/10;f.beam(ridgeMat,[s*W,slope(1,a)+.08,zsign*a*D],[s*W,slope(1,b)+.08,zsign*b*D],.1);}}
 }
}
function gableWall(f,w,d,eave,rise,stepped=false){
 for(const sign of [-1,1]){
  if(stepped){
   const len=d/5;for(let i=0;i<5;i++){const yy=eave+rise*(1-Math.abs(i-2)/3)+.55;f.b(M.plaster,sign*(w/2+.05),yy/2,i*len-d/2+len/2,.3,yy,len+.04);f.b(M.ridge,sign*(w/2+.05),yy+.06,i*len-d/2+len/2,.46,.18,len+.18);}
  }else{
   const p=[sign*w/2,eave,-d/2,sign*w/2,eave,d/2,sign*w/2,eave+rise,0];const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));geo.setIndex(sign===1?[0,2,1]:[0,1,2]);geo.computeVertexNormals();f.geo(M.plaster,geo);
  }
 }
}
function building(g,x,z,w,d,h=4,{angle=0,floors=1,hip=false,horse=false,shop=false,double=false,base=.5,roofRise,wood=false}={}){
 buildingCount++;const f=frame(g,x,z,angle,base),wall=wood?M.wood:M.plaster;const rise=roofRise??Math.min(d*.27,2.1);
 f.b(M.stone,0,.21,0,w+.25,.42,d+.24);f.b(wall,0,h/2+.3,0,w,h,d);
 for(const side of [-1,1]){
  f.b(M.stone,0,.63,side*(d/2+.025),w,.55,.12);
  for(let floor=0;floor<floors;floor++){
   const fh=h/floors,y=.45+floor*fh;
   f.b(M.wood,0,y+fh-.1,side*(d/2+.08),w,.18,.15);
   const n=Math.max(2,Math.floor(w/(shop?1.55:2.2)));
   for(let j=0;j<n;j++){
    const xx=-w/2+(j+.5)*w/n,winW=w/n*.62,winH=fh*.5;
    f.b(M.woodLight,xx,y+fh*.52,side*(d/2+.065),winW+.16,winH+.17,.12);
    f.b(M.glass,xx,y+fh*.52,side*(d/2+.14),winW,winH,.035);
    for(let k=-1;k<=1;k++)f.b(M.wood,xx+k*winW/3,y+fh*.52,side*(d/2+.18),.055,winH,.06);
    f.b(M.wood,xx,y+fh*.52,side*(d/2+.19),winW,.055,.06);
    if(shop)f.b(M.redwood,-w/2+j*w/n,y+fh/2,side*(d/2+.22),.16,fh,.18);
   }
  }
  if(shop){
   f.b(M.wood,0,.4,side*(d/2+.7),w+1,.22,1.65);
   for(let i=0;i<=Math.round(w/2.3);i++){const a=-w/2+i*w/Math.round(w/2.3);f.b(M.redwood,a,h/2+.2,side*(d/2+.65),.2,h,.2);}
  }
 }
 // Side windows on large exposed ends.
 if(w>7&&!horse)for(const s of [-1,1])for(let k=0;k<3;k++)f.b(M.glass,s*(w/2+.03),h*.6,(k-1)*d*.25,.04,h*.25,d*.14);
 roof(f,w,d,h+.35,rise,{hip,over:shop?.85:.48});
 if(!hip)gableWall(f,w,d,h+.35,rise,horse);
 if(double){roof(f,w+.65,d+.6,h*.52,Math.min(1.2,rise*.6),{hip,over:.8});}
 return f;
}
function courtyard(g,x,z,w,d,{angle=0,h=4.2,grand=false,horse=true}={}){
 const f=frame(g,x,z,angle,.35);f.b(M.plaster2,0,.05,0,w,.1,d);f.b(M.paving,0,.12,0,w-1,.1,d-1);
 const frontDepth=grand?4.5:Math.min(3.1,d*.28),sideWidth=grand?3.6:Math.min(2.8,w*.23);
 const place=(lx,lz,ww,dd,hh,opt={})=>{const p=f.p(lx,0,lz);return building(g,p[0],p[2],ww,dd,hh,{angle,...opt})};
 place(0,-d/2+frontDepth/2,w,frontDepth,h+.8,{hip:grand,horse:!grand&&horse,shop:grand});
 place(0,d/2-frontDepth/2,w,frontDepth,h,{horse});
 for(const side of [-1,1]){
  if(w<8.2){
   f.b(M.plaster,side*(w/2-.12),h*.5,0,.26,h,d-frontDepth);
   f.b(M.ridge,side*(w/2-.12),h+.06,0,.38,.14,d-frontDepth);
   f.b(M.plaster,side*(w/2-.12),h+.3,-d*.13,.26,.6,d*.23);
   f.b(M.ridge,side*(w/2-.12),h+.65,-d*.13,.4,.15,d*.23+.15);
  }else{const p=f.p(side*(w/2-sideWidth/2),0,0);building(g,p[0],p[2],d-2*frontDepth,sideWidth,h-.25,{angle:angle+Math.PI/2,horse});}
 }
 f.b(M.stoneLight,0,.2,0,w-sideWidth*2,.06,.8);
 if(grand){for(const sx of [-1,1])for(const sz of [-1,1])f.b(M.grass,sx*w*.22,.24,sz*d*.16,w*.18,.12,d*.15);}
}

// NORTH: three nested temple courts aligned behind the broad waterfront square.
polygon(groups.ground,[[-15,-60],[22,-60],[22,-13],[-15,-13]],.48,.2,M.plaster2);
box(groups.ground,M.paving,3,.63,-25,27,.12,23);
for(const x of [-4,9])for(const z of [-23,-28]){box(groups.ground,M.stoneLight,x,.73,z,5,.15,3.3);box(groups.ground,M.grass,x,.83,z,4.6,.12,2.9);}
building(groups.temple,3,-33,24,8,5.4,{hip:true,shop:true,double:true,roofRise:3});
building(groups.temple,3,-15,25,4,3.8,{hip:true,shop:true,roofRise:1.5});
for(const x of [-11.7,17.7])building(groups.temple,x,-24,17,3.5,3.5,{angle:Math.PI/2,shop:true});
box(groups.ground,M.paving,3,.59,-44,25,.08,12);
building(groups.temple,3,-51,24,7.2,5.8,{hip:true,shop:true,roofRise:2.5});
for(const x of [-11.7,17.7])building(groups.temple,x,-43.8,13.4,3.1,3.7,{angle:Math.PI/2,shop:true});
building(groups.temple,3,-62,22,6,5.1,{hip:true,shop:true});
for(const x of [-10.6,16.6])building(groups.temple,x,-57.2,5.3,3.2,3.5,{angle:Math.PI/2});
// The northern cross street and its compact houses.
for(let i=0;i<7;i++)courtyard(groups.temple,-11+i*5.8,-75,5.1,10.4,{h:3.3+(i%3)*.55,horse:true});
courtyard(groups.temple,29,-61.3,8.5,12.5,{h:4.9});
courtyard(groups.temple,28,-44.3,8.5,13,{h:5.8});
// Red ceremonial towers inside the second courtyard.
for(const x of [-7,13]){
 const f=frame(groups.temple,x,-38.5,0,.65);
 for(let j=0;j<3;j++){f.b(M.redwood,0,1.3+j*1.25,0,1.1,1.2,1.1);roof(f,1.8-j*.2,1.8-j*.2,1.65+j*1.25,.55,{hip:true,over:.35});}
}
// WEST: commercial blocks surround a large open forecourt.
polygon(groups.ground,[[-39,-44],[-15,-44],[-15,-17],[-38,-17]],.43,.1,M.paving);
building(groups.west,-26,-47,25,4.2,6.8,{shop:true,floors:2});
building(groups.west,-15,-36,18,3.8,6,{angle:Math.PI/2,horse:true,floors:2});
function commercial(x,z,w,d,h){
 const f=frame(groups.west,x,z,0,.55);buildingCount++;
 f.b(M.plaster,0,h/2,0,w,h,d);f.b(M.wood,0,2.1,d/2+.07,w,4.1,.2);
 for(let floor=0;floor<Math.floor(h/2.7);floor++)for(const s of [-1,1]){
  f.b(M.stoneLight,0,2.7+floor*2.7,s*(d/2+.08),w+.25,.22,.2);
  for(let xx=-w/2+1;xx<w/2-.4;xx+=1.65){f.b(M.glass,xx,1.4+floor*2.7,s*(d/2+.12),1.02,1.45,.1);f.b(M.wood,xx,1.4+floor*2.7,s*(d/2+.19),.08,1.45,.06);}
 }
 f.b(M.stoneLight,0,h+.12,0,w+.4,.3,d+.3);
 for(const s of [-1,1]){f.b(M.plaster,0,h+.65,s*(d/2-.1),w,1,.22);f.b(M.plaster,s*(w/2-.1),h+.65,0,.22,1,d);}
 roof(f,w+1,d+1,3.5,1.2,{hip:true,over:.2});
 building(groups.west,x,z-1,w*.75,d*.6,2.1,{base:h+.6,hip:false});
}
commercial(-47,-28,18,12,10.2);
commercial(-32,-38,8,9,9.5);
courtyard(groups.west,-57,-10,13,13,{h:4.2});
courtyard(groups.west,-42,-10,13,13,{h:4.5});
building(groups.west,-30,-5.5,14,7,6.7,{shop:true,floors:2,hip:true});
building(groups.west,-22,-16,13,9,6.4,{shop:true,floors:2});
courtyard(groups.west,-66,-19,8,12,{h:5});
// Small layered towers mark the west riverside shops.
building(groups.west,-62,2,8,5,4.2,{shop:true,hip:true});
building(groups.west,-41,0,7,5,5.8,{shop:true,hip:true,double:true,floors:2});
// EAST: long outer hall, square courtyard blocks and densely spaced residential yards.
building(groups.east,24,-16.75,17.5,5.7,6.1,{angle:Math.PI/2,shop:true,floors:2});
courtyard(groups.east,42,-11,18,18,{h:4.7,grand:true});
for(let i=0;i<4;i++)courtyard(groups.east,57,-23+i*7.1,10,6.1,{angle:Math.PI/2,h:3.6+(i%2)*.65});
courtyard(groups.east,41,-33.6,8,13,{h:4.8});
building(groups.east,37,-44,10,5,6.5,{angle:Math.PI/2,horse:true,floors:2});
// Curved peninsula: a long rear hall, waterside pavilion, then repeating courtyard houses.
// The local rear hall is built with the pavilion courtyard below.
courtyard(groups.east,48,6.8,13.4,12,{h:4.1});
courtyard(groups.east,62,5.7,10,12,{h:4.6});
building(groups.east,72,4,7,5,4.1,{angle:Math.PI/2,shop:true,hip:true});
// SOUTH: waterfront warehouse roofs, the tree-lined river walk and the uninterrupted shopping street.
courtyard(groups.south,-66,25.5,10,13,{h:4.8});
courtyard(groups.south,-53,24.5,12,12,{h:4.5});
building(groups.south,-39.6,25,14,8.7,5.6,{hip:true,shop:true,double:true,floors:2});
building(groups.south,-15,33.8,13,4.4,3.3,{shop:true});
building(groups.south,-1,33.7,11,4.3,3.1,{shop:true});
for(let i=0;i<6;i++)courtyard(groups.south,12+i*7.1,32,6.2,9.7,{h:3.9+(i%3)*.25,horse:true});
courtyard(groups.south,61,30,11.5,12,{h:4.9});
building(groups.south,72,26.7,6,6.5,4.8,{hip:true,shop:true,angle:Math.PI/2});
for(let i=0;i<21;i++){
 const x=-69+i*6.85,w=5.9;
 if(i===5||i===16){building(groups.south,x,45,w,5.1,3.7,{horse:true,shop:true});continue;}
 courtyard(groups.south,x,44.6,w,6.5,{h:2.9+(i%4)*.25,horse:true});
}
// The supplied bridge has a flat deck; its steps and landings are independent meshes.
const bridgePlacement={x:-28.5,z:15.5,scale:10.5,y:1.2,deck:1.2+.0599*10.5,north:15.5-.950768*10.5,south:15.5+.951909*10.5};
function bridgeApproaches(){
 const g=groups.bridge,b=bridgePlacement,base=.3,steps=9,run=.35,width=5.0;
 const limestone=mat('#b7bbb2',{map:tex.paving}),cheekStone=mat('#aeb5ad');
 for(const [end,sign] of [[b.north,-1],[b.south,1]]){
  const rail=[];
  for(let i=0;i<steps;i++){
   const y=b.deck-(b.deck-base)*i/steps,z=end+sign*(i+.5)*run;
   box(g,M.paving,b.x,(base+y)/2,z,width,y-base,run+.015);
   box(g,limestone,b.x,y-.035,z,width+.1,.07,run+.02);
   for(const side of [-1,1])box(g,cheekStone,b.x+side*(width/2+.18),(base+y)/2,z,.34,y-base,run+.02);
   rail.push([z,y]);
  }
  // Guardrails meet the original model's corner posts, then follow the stair pitch.
  for(const side of [-1,1]){
   const xx=b.x+side*(width/2+.18);
   for(let i=0;i<rail.length;i+=2){const [z,y]=rail[i];box(g,limestone,xx,y+.5,z,.17,1,.17);box(g,limestone,xx,y+1.03,z,.26,.13,.26);}
   const first=[xx,b.deck+.84,end],last=[xx,rail.at(-1)[1]+.84,rail.at(-1)[0]];
   beam(g,limestone,first,last,.075);beam(g,limestone,[xx,b.deck+.35,end],[xx,rail.at(-1)[1]+.35,rail.at(-1)[0]],.055);
  }
  const z=end+sign*steps*run;
  polygon(g,[[b.x-3.15,z-sign*.1],[b.x+3.15,z-sign*.1],[b.x+3.8,z+sign*1.7],[b.x-3.8,z+sign*1.7]],.32,.12,M.paving);
 }
 // Chamfered landing corners and low planting bed soften the recessed west-bank turn.
 polygon(g,[[-35.5,16.5],[-34.3,17.5],[-34,20],[-34.7,20.3],[-36.5,18.5]],.43,.18,M.grass);
 strip(g,[[-35.5,16.5],[-34.3,17.5],[-34,20]],.48,.22,.25,M.stone);
}
bridgeApproaches();
// Riverside complex traced from the user's local reference: enclosed court, continuous
// curved gallery, western terrace, tall eastern fire wall and two planted retaining tiers.
const courtY=1.22;
function pavilionCourtyard(){
 const g=groups.pavilion,site=groups.pavilionSite,quayStone=mat('#78847f'),quayCap=mat('#a4ada3'),hedge=mat('#49643c');
 const curve=new THREE.CatmullRomCurve3([[18.7,10],[21,13.1],[25,15],[31,15.4],[36,14.7],[40.3,12]].map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal');
 const count=80,stations=curve.getSpacedPoints(count);
 const normals=stations.map((p,i)=>{const t=stations[Math.min(count,i+1)].clone().sub(stations[Math.max(0,i-1)]).normalize();return new THREE.Vector3(-t.z,0,t.x)});
 const path=offset=>stations.map((p,i)=>[p.x+normals[i].x*offset,p.z+normals[i].z*offset]);
 const apron=path(1.15),outer=path(2.65),lower=path(3.55);
 polygon(site,[[14.7,1.5],[40.3,1.5],[41,10.7],...apron.slice().reverse(),[14.7,10]],courtY,.95,M.paving);
 // Narrow planting strips sit below the gallery, not in the court.
 polygon(site,[...apron,...outer.slice().reverse()],.83,.5,M.darkGrass);
 polygon(site,[...outer,...lower.slice().reverse()],.42,.35,M.grass);
 strip(site,outer,.52,.26,.9,quayStone);strip(site,outer,1,.34,.12,quayCap);
 strip(site,lower,.06,.28,.78,quayStone);strip(site,lower,.47,.37,.12,quayCap);
 strip(site,path(1.45),1.02,.4,.38,hedge);strip(site,path(2.9),.59,.25,.28,hedge);
 for(let i=4;i<stations.length-3;i+=7){const p=stations[i],n=normals[i];instance(site,geometries.leaf,leafMats[i%5],[p.x+n.x*3.05,.8,p.z+n.z*3.05],[.43,.5,.4]);}
 // Broad rear hall and perpendicular, two-storey wing form the L behind the tower.
 building(g,25,.3,14.6,7.4,4.05,{base:courtY,shop:true,hip:true,roofRise:3.15,wood:true});
 building(g,37.1,6,10.6,5.4,5.65,{base:courtY,angle:Math.PI/2,floors:2,horse:true,double:true,roofRise:1.65});
 // A projecting, flat-topped stepped fire wall screens the front ends of both roofs.
 for(let i=0;i<5;i++){
  const h=[5.9,7,8.1,7,5.9][i],x=37.1+(i-2)*1.22;
  box(g,M.plaster,x,courtY+h/2,12.55,1.24,h,.28);
  box(g,M.ridge,x,courtY+h+.09,12.55,1.33,.18,.48);
 }
 // Blank white outer face and a pronounced five-step front fire gable.
 box(g,M.plaster,39.84,4.13,6,.16,5.8,10.65);
 // Left annex has an accessible flat terrace and an adjoining tiled gateway.
 const f=frame(g,16.9,6.5,0,courtY);
 f.b(M.plaster,0,1.1,0,4.5,2.2,5.7);f.b(M.stoneLight,0,2.24,0,4.8,.24,6);
 for(const side of [-1,1]){f.b(M.glass,side*2.27,1.25,0,.035,.85,3.3);f.b(M.ridge,side*2.4,2.5,0,.16,.35,6);}
 f.b(M.paving,0,2.4,0,4.5,.08,5.7);railing([[14.6,3.6],[19.2,3.6],[19.2,7.5]],courtY+2.45,1.1,M.wood,g);
 const gate=frame(g,18.2,10,Math.PI/2,courtY);
 gate.b(M.plaster,0,1.3,-1.2,2.7,2.6,.24);gate.b(M.plaster,0,1.3,1.2,2.7,2.6,.24);
 roof(gate,3,2.8,2.6,1.15,{over:.35});gableWall(gate,3,2.8,2.6,1.15,true);
 buildingCount+=2;
 // Gallery: one continuous curved tiled roof, open upper bays and solid lower panels.
 const half=.85;strip(site,path(0),courtY+.04,1.9,.15,M.stoneLight);
 for(let i=0;i<stations.length;i+=5){const p=stations[i],n=normals[i];
  for(const side of [-1,1]){const x=p.x+n.x*half*side,z=p.z+n.z*half*side;pole(g,M.wood,x,courtY+1.23,z,.085,2.46);box(g,M.stone,x,courtY+.13,z,.26,.26,.26);}
  if(i+5<stations.length){for(const side of [-1,1]){const pts=[i,i+5].map(k=>[stations[k].x+normals[k].x*half*side,stations[k].z+normals[k].z*half*side]);strip(g,pts,courtY+.44,.13,.68,M.plaster);strip(g,pts,courtY+.82,.16,.1,M.wood);strip(g,pts,courtY+2.33,.14,.16,M.wood);}}
 }
 const cross=[-1.16,-.95,-.6,0,.6,.95,1.16],ys=[3.64,3.59,3.8,4.32,3.8,3.59,3.64],pos=[],uv=[],indices=[];
 for(let i=0;i<=count;i++)for(let j=0;j<cross.length;j++){pos.push(stations[i].x+normals[i].x*cross[j],ys[j],stations[i].z+normals[i].z*cross[j]);uv.push(i*.22,cross[j]*.8);}
 for(let i=0;i<count;i++)for(let j=0;j<cross.length-1;j++){const q=i*cross.length+j;indices.push(q,q+1,q+cross.length,q+1,q+cross.length+1,q+cross.length);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();addGeo(g,M.roof,geo);
 strip(g,path(0),4.35,.16,.15,M.ridge);for(const side of [-1,1])strip(g,path(side*1.16),3.63,.12,.14,M.roofEdge);
 // Individual tile seams follow the changing normal of the curved roof.
 for(let i=0;i<=count;i++)for(const side of [-1,1])for(let j=3;j<6;j++){
  const a=j,b=j+1,pa=stations[i],n=normals[i];beam(g,M.ridge,[pa.x+n.x*cross[a]*side,ys[a]+.025,pa.z+n.z*cross[a]*side],[pa.x+n.x*cross[b]*side,ys[b]+.025,pa.z+n.z*cross[b]*side],.026);
 }
 // Short stair from the public waterfront to the left entrance.
 for(let i=0;i<5;i++)box(site,M.stoneLight,15.5,.36+i*.19,11.3-i*.42,2.3,.19,.48);
}
pavilionCourtyard();
// The distinctive yellow tourist launches are tied perpendicular to the straight quay.
function boat(x,z,angle=0){
 boatCount++;const f=frame(groups.boats,x,z,angle,-.08),w=1.65,l=5.2;
 const s=new THREE.Shape();s.moveTo(-w/2,-l/2+.6);s.lineTo(-w/2,l/2-.5);s.quadraticCurveTo(0,l/2+.7,w/2,l/2-.5);s.lineTo(w/2,-l/2+.6);s.quadraticCurveTo(0,-l/2-.4,-w/2,-l/2+.6);
 const geo=new THREE.ExtrudeGeometry(s,{depth:.48,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.08,bevelThickness:.08});geo.rotateX(-Math.PI/2);f.geo(M.boat,geo);
 f.b(M.boatTrim,0,.54,0,1.5,.12,4.4);f.b(M.wood,0,.63,0,1.3,.1,3.8);
 for(const a of [-.66,.66])for(const b of [-1.55,1.55])f.b(M.boatTrim,a,1.16,b,.09,1.15,.09);
 for(let i=-1;i<=1;i++)f.b(M.boatTrim,0,.92,i*1.1,1.2,.14,.3);
 roof(f,1.7,3.5,1.65,.45,{hip:true,over:.13,material:M.yellow});
 f.b(M.yellow,0,1.66,-1.8,1.85,.2,.12);f.b(M.yellowShade,0,1.66,1.8,1.85,.2,.12);
 for(const sx of [-1,1])for(const zz of [-1.4,1.4]){const p=f.p(sx*.84,.47,zz);instance(groups.boats,geometries.sphere,M.black,p,[.16,.16,.1]);}
 const a=f.p(0,.6,-2.3),b=f.p(0,.25,-3.1);beam(groups.boats,M.woodLight,a,b,.025);
}
for(let i=0;i<12;i++)boat(-17.3+i*2.55,9.45+(i>9?.35:0),(i-5)*.007);
// Trees: clustered foliage with broad, irregular canopies, placed in the same streets and banks as the drawings.
function tree(x,z,s=1){
 if(gameConfig && x>-22 && x<19 && z>-13 && z<4)return; // Clear only the festival forecourt.
 treeCount++;const h=range(3.5,4.6)*s;
 pole(groups.trees,M.woodLight,x,h/2+.4,z,.16*s,h);
 for(let k=0;k<3;k++){const a=k*Math.PI*2/3+rand();beam(groups.trees,M.woodLight,[x,h*.5,z],[x+Math.cos(a)*1.05*s,h*.9,z+Math.sin(a)*1.05*s],.09*s);}
 for(let k=0;k<17;k++){const a=rand()*Math.PI*2,r=Math.sqrt(rand())*1.5*s;instance(groups.trees,geometries.leaf,leafMats[Math.floor(rand()*leafMats.length)],[x+Math.cos(a)*r,h+range(-.3,1.4)*s,z+Math.sin(a)*r],[range(.65,1.15)*s,range(.75,1.35)*s,range(.65,1.15)*s],[rand(),rand(),rand()]);}
}
for(const [x,z,s] of [[-16,-.5,1.15],[-12,-.6,1.2],[-9,-.4,1.15],[7,-.5,1],[11,-.5,.95],[-19,-9,.8],[-13,-11,.8],[14,-10,.7],[-34,-1,.8],[-51,3,.9],[-57,4,.85],[43.6,13.7,.9],[46,13.3,1.1],[54,12,1.1],[62,10,1.1],[69,10,1.1],[-5,29,.9],[5,28,1.0],[12,25,1.05],[18,22,1],[27,24.5,1.05],[34,24,1.1],[41,24,.9],[48,23.5,1.05],[57,23,1.0],[65,22.2,1.0],[68,21,1],[-17,-58,.75],[20,-57,.8],[34,-27,.85],[36,-22,.8]])tree(x,z,s);
for(let i=0;i<18;i++){const x=range(27,67),z=range(16.8,19.8);if(z<20-(x-27)*.06)tree(x<42?43+(x-27)*.18:x,x<42?14.2:14.5-(x-42)*.14,.55);}
// Plaza paving grid, planted beds, ceremonial arch and small pedestrian details.
for(let i=0;i<9;i++)box(groups.details,M.stoneLight,-20+i*4,.5,-5,.09,.045,12);
for(let i=0;i<4;i++)box(groups.details,M.stoneLight,-3,.5,-11+i*3.5,35,.045,.09);
for(const x of (gameConfig?[]:[-13,10])){box(groups.ground,M.stoneLight,x,.65,-.5,9,.55,3.3);box(groups.ground,M.darkGrass,x,.96,-.5,8.5,.12,2.8);}
const arch=frame(groups.details,-1,-10.6,0,.5);
for(const x of [-4,0,4]){arch.b(M.stoneLight,x,2.35,0,.35,4.7,.35);arch.b(M.stoneLight,x,.25,0,.8,.5,.8);}
arch.b(M.stoneLight,0,3.45,0,9,.36,.45);arch.b(M.stoneLight,0,4.35,0,9.4,.22,.6);
roof(arch,9,.8,4.45,.65,{over:.25});arch.b(M.wood,0,3.92,.27,2.2,.62,.12);
// Lantern poles stay small and follow the architectural reference; no invented giant festival decorations.
for(const x of (gameConfig?[]:[-19,-12,-5,2,9,16])){
 pole(groups.details,M.wood,x,2.1,-4,.055,3.4);box(groups.details,M.wood,x,3.6,-4,1.2,.08,.08);
 for(const dx of [-.46,.46]){box(groups.details,M.gold,x+dx,3.27,-4,.22,.42,.22);box(groups.details,M.red,x+dx,3.55,-4,.28,.1,.28);}
}
for(let i=0;i<16;i++){const x=-66+i*8.5;pole(groups.details,M.black,x,2.2,37.4,.045,3.6);box(groups.details,M.lamp,x,4.1,37.4,.26,.38,.26);}
// Scaled people make the pedestrian plaza legible without obscuring its geometry.
const coats=[mat('#a29d83'),mat('#48585b'),mat('#8f705b'),mat('#d2cbbb')];
for(let i=0;i<(gameConfig?0:48);i++){
 const x=range(-22,15),z=range(-9.5,1.2);if((x>-18&&x<-8&&z>-2)||(x>6&&z>-2))continue;
 const h=range(.72,.95);pole(groups.details,coats[i%4],x,.5+h*.55,z,.12,h);instance(groups.details,geometries.sphere,M.woodLight,[x,.5+h*1.17,z],[.13,.14,.13]);
}
const modernBuildingCount=buildingCount+1;
const mingArchitecture=createMingArchitecture({parent:mingBuildings,frame,roof,box,pole,beam,instance,geometries,addGeo,M,tex,mat,courtY});
const mingBuildingCount=mingArchitecture.count+1;
// Merge static surfaces and instance repeated parts, preserving semantic layers for export and visibility.
for(const {group,geo,material,matrices} of batches.values()){
 const mesh=new THREE.InstancedMesh(geo,material,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=material!==M.water;mesh.receiveShadow=true;mesh.name=group.name+'_instances';mesh.computeBoundingSphere();group.add(mesh);
}
for(const {g,material,geos} of custom.values()){
 const uniform=geos.map(geo=>geo.index?geo.toNonIndexed():geo);const geo=mergeGeometries(uniform,false);if(!geo)throw new Error('Geometry merging failed');
 const mesh=new THREE.Mesh(geo,material);mesh.castShadow=material!==M.water;mesh.receiveShadow=true;mesh.name=g.name+'_surfaces';g.add(mesh);geos.forEach(o=>o.dispose());uniform.forEach(o=>o.dispose());
}
batches.clear();custom.clear();

// Viewer controls. Camera presets correspond to the source perspective, overhead and opposite view.
const views={'pavilion-night':{pos:[16,18,28],target:[27.5,5.2,10],zoom:8.2},bridge:{pos:[9,32,47],target:[-28.5,1.8,15.5],zoom:5.1},pavilion:{pos:[-11,38,53],target:[28,3.7,7],zoom:5.2},perspective:{pos:[175,180,135],target:[0,0,-13],zoom:1.09},plan:{pos:[0,220,111],target:[0,0,-17],zoom:1.03},west:{pos:[-124,142,154],target:[0,0,-14],zoom:1.09},top:{pos:[0,260,.01],target:[0,0,-16],zoom:.97}};
let currentView='perspective',weather='clear',night=false,wire=false,needsRender=true,rotation=false,era='modern';
let waterReflectionFailed=false;
function syncWaterVisibility(){if(waterSurface)waterSurface.visible=groups.water.visible&&!wire&&!activeCamera.isOrthographicCamera&&!waterReflectionFailed;}
let lotusLanterns=[],lotusAnimationActive=false;
const lotusWaterY=-.17;
let firstPerson=false,activeCamera=camera,firstPersonSavedOrbit=null,renderPass=null;
const firstPersonKeys={forward:false,backward:false,left:false,right:false,boost:false};
const firstPersonHeight=3.15,firstPersonSpeed=13;
let modernLighting=null,mingLighting=null,composer=null;
let performanceAudit=null;
function renderScene(){
 performanceAudit?.frameStart();
 syncWaterVisibility();
 renderer.info.reset();
 const draw=()=>{
  if(night&&!wire){
   if(!composer){composer=new EffectComposer(renderer);renderPass=new RenderPass(scene,activeCamera);composer.addPass(renderPass);composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.38,.45,1.05));composer.addPass(new OutputPass());}
   renderPass.camera=activeCamera;composer.render();
  }else renderer.render(scene,activeCamera);
 };
 try{draw();}
 catch(error){
  if(!waterSurface?.visible)throw error;
  console.error('Qinhuai water render fallback',error);
  waterReflectionFailed=true;waterSurface.visible=false;
  renderer.setRenderTarget(null);
  try{draw();}catch(retryError){renderer.setRenderTarget(null);renderer.render(scene,activeCamera);}
 }finally{performanceAudit?.frameEnd();}
}
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);if(composer)composer.setSize(w,h);firstPersonCamera.aspect=w/h;firstPersonCamera.updateProjectionMatrix();const aspect=w/h,height=aspect<.9?225:157;camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;if(aspect<.9){camera.left=-110;camera.right=110;camera.top=110/aspect;camera.bottom=-110/aspect;}camera.updateProjectionMatrix();needsRender=true;}
function setView(id){if(firstPerson)setFirstPerson(false);const v=views[id];if(id==='pavilion-night')setWeather('night');controls.autoRotate=false;controls.enableDamping=false;controls.update();controls.enableDamping=true;rotation=false;$('rotate').setAttribute('aria-pressed','false');camera.position.set(...v.pos);controls.target.set(...v.target);camera.zoom=v.zoom;camera.updateProjectionMatrix();controls.update();currentView=id;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===id)));needsRender=true;}
function syncFirstPersonFromOrbit(){
 const direction=new THREE.Vector3().subVectors(controls.target,camera.position);direction.y=0;
 if(direction.lengthSq()<.0001)direction.set(0,0,-1);direction.normalize();
 const start=controls.target.clone().addScaledVector(direction,-16);start.y=firstPersonHeight;
 firstPersonCamera.position.copy(start);firstPersonCamera.lookAt(start.x+direction.x*20,firstPersonHeight,start.z+direction.z*20);
}
function setFirstPerson(value,{requestLock=true}={}){
 const next=Boolean(value);if(next===firstPerson){if(next&&requestLock&&!firstPersonControls.isLocked)firstPersonControls.lock();return;}
 if(next){
  firstPersonSavedOrbit={position:camera.position.clone(),target:controls.target.clone(),zoom:camera.zoom,currentView};
  syncFirstPersonFromOrbit();activeCamera=firstPersonCamera;firstPerson=true;controls.enabled=false;
  $('first-person')?.setAttribute('aria-pressed','true');$('first-person-hint')?.classList.add('show');
  if(requestLock)firstPersonControls.lock();
 }else{
  firstPersonControls.unlock();activeCamera=camera;firstPerson=false;controls.enabled=true;
  if(firstPersonSavedOrbit){camera.position.copy(firstPersonSavedOrbit.position);controls.target.copy(firstPersonSavedOrbit.target);camera.zoom=firstPersonSavedOrbit.zoom;camera.updateProjectionMatrix();currentView=firstPersonSavedOrbit.currentView;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===currentView)));controls.update();}
  firstPersonSavedOrbit=null;$('first-person')?.setAttribute('aria-pressed','false');$('first-person-hint')?.classList.remove('show');
 }
 if(renderPass)renderPass.camera=activeCamera;needsRender=true;
}
function updateFirstPerson(delta){
 if(window.__QINHUAI_GAME__)return; // The festival owns collision-aware locomotion, using this same camera.
 if(!firstPerson)return;let forward=(firstPersonKeys.forward?1:0)-(firstPersonKeys.backward?1:0),right=(firstPersonKeys.right?1:0)-(firstPersonKeys.left?1:0);if(!forward&&!right)return;
 const length=Math.hypot(forward,right);forward/=length;right/=length;const distance=firstPersonSpeed*(firstPersonKeys.boost?1.9:1)*delta;
 firstPersonControls.moveForward(forward*distance);firstPersonControls.moveRight(right*distance);firstPersonCamera.position.y=firstPersonHeight;
 firstPersonCamera.position.x=THREE.MathUtils.clamp(firstPersonCamera.position.x,-72,72);firstPersonCamera.position.z=THREE.MathUtils.clamp(firstPersonCamera.position.z,-62,42);needsRender=true;
}
function setLotusNight(enabled){
 for(const ripple of waterLightRipples)if(ripple.material.uniforms)ripple.material.uniforms.uLanternIntensity.value=enabled?1:0;
 for(const item of lotusLanterns){
  const glow=item.kind==='main'?'#ffad42':'#ffd36f';
  for(const material of item.materials){
   if(material.emissive){material.emissive.set(enabled?glow:'#000000');material.emissiveIntensity=enabled?(item.kind==='main'?.42:.3):0;}
  }
  if(item.light)item.light.visible=enabled;
 }
}
function updateLotusLanterns(now){
 if(!lotusLanterns.length||!lotusRoot.visible)return;
 const t=now*.001;
 for(const item of lotusLanterns){
  const wave=Math.sin(t*(.72+item.phaseSpeed)+item.phase);
  const cross=Math.cos(t*(.49+item.phaseSpeed*.6)+item.phase*.8);
  item.group.position.y=lotusWaterY+item.floatHeight+wave*item.bob;
  item.group.position.x=item.x+cross*item.drift;
  item.group.position.z=item.z+Math.sin(t*.37+item.phase)*item.drift*.72;
  item.group.rotation.y=item.rotation+Math.sin(t*.41+item.phase)*.035;
  item.group.rotation.x=Math.sin(t*.58+item.phase)*.018;
  item.group.rotation.z=Math.cos(t*.53+item.phase)*.022;
  if(item.light)item.light.position.set(item.group.position.x,item.group.position.y+.48,item.group.position.z);
  if(item.ripple)item.ripple.position.set(item.group.position.x,lotusWaterY+.012,item.group.position.z);
 }
}
function addLotusLanterns(oneGLTF,mainGLTF){
 lotusRoot.clear();lotusLightRoot.clear();waterLightRoot.clear();waterLightRipples.length=0;lotusLanterns=[];
 const templates={one:oneGLTF.scene,main:mainGLTF.scene};
 const placements=[
  {kind:'one',x:-55,z:12.1,rotation:.28},{kind:'main',x:-47,z:13.1,rotation:-.42},
  {kind:'one',x:-39,z:11.7,rotation:.12},{kind:'main',x:-31.5,z:17.4,rotation:.54},
  {kind:'one',x:-18,z:16.8,rotation:-.2},{kind:'main',x:-8.5,z:19.3,rotation:.35},
  {kind:'one',x:2.5,z:22.2,rotation:-.5},{kind:'main',x:12.8,z:17.2,rotation:.18},
  {kind:'one',x:23.5,z:19.1,rotation:-.32},{kind:'main',x:34.5,z:19.4,rotation:.48},
  {kind:'one',x:47,z:17.8,rotation:-.15},{kind:'main',x:59,z:16.2,rotation:.3}
 ];
 placements.forEach((placement,index)=>{
  const source=templates[placement.kind],bounds=new THREE.Box3().setFromObject(source),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const targetDiameter=placement.kind==='main'?2.15:1.72,fitScale=targetDiameter/Math.max(size.x,size.z);
  const modelScene=source.clone(true);const materials=[];const materialCopies=new Map();
  modelScene.position.set(-center.x,-bounds.min.y,-center.z);modelScene.scale.setScalar(fitScale);if(gameConfig)modelScene.position.multiplyScalar(fitScale);
  modelScene.traverse(object=>{
   if(!object.isMesh)return;
   object.castShadow=false;object.receiveShadow=true;
   const cloneMaterial=material=>{if(!materialCopies.has(material))materialCopies.set(material,material.clone());return materialCopies.get(material)};
   object.material=Array.isArray(object.material)?object.material.map(cloneMaterial):cloneMaterial(object.material);
   for(const material of Array.isArray(object.material)?object.material:[object.material])if(material&&!materials.includes(material))materials.push(material);
  });
  const group=new THREE.Group();group.name=`Lotus_Lantern_${String(index+1).padStart(2,'0')}_${placement.kind}`;group.add(modelScene);
  group.position.set(placement.x,lotusWaterY+(placement.kind==='main'?.045:.03),placement.z);group.rotation.y=placement.rotation;
  group.userData={source:placement.kind==='main'?'hehua-main.glb':'hehua_1.glb',uniformScale:fitScale,waterSurfaceY:lotusWaterY};lotusRoot.add(group);
  const light=(placement.kind==='main'||index%3===0)?new THREE.PointLight(0xffb94e,placement.kind==='main'?1.1:.65,placement.kind==='main'?7:5.5,2):null;
  if(light){light.name=`Lotus_Lantern_Light_${String(index+1).padStart(2,'0')}`;light.position.set(placement.x,group.position.y+.48,placement.z);lotusLightRoot.add(light);}
  const rippleMaterial=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uPhase:{value:index*1.37},uLanternIntensity:{value:night?1:0},uColor:{value:new THREE.Color(placement.kind==='main'?0xffa83e:0xffc968)}},vertexShader:'varying vec2 vRippleUv;void main(){vRippleUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform float uTime;uniform float uPhase;uniform float uLanternIntensity;uniform vec3 uColor;varying vec2 vRippleUv;void main(){vec2 p=vRippleUv*2.0-1.0;float d=length(p);float wave=fract(uTime*.12+uPhase*.071);float ring=exp(-pow((d-(.18+wave*.78))/.035,2.0));float ring2=exp(-pow((d-(.32+fract(wave+.38)*.55))/.045,2.0));float mask=1.0-smoothstep(.82,1.0,d);float alpha=(ring*.8+ring2*.38)*mask*uLanternIntensity;gl_FragColor=vec4(uColor*alpha,alpha);}',transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending});
  const ripple=new THREE.Mesh(new THREE.PlaneGeometry(4.2,4.2),rippleMaterial);ripple.name=`Lantern_Water_Ripple_${String(index+1).padStart(2,'0')}`;ripple.rotation.x=-Math.PI/2;ripple.position.set(placement.x,lotusWaterY+.012,placement.z);ripple.scale.setScalar(placement.kind==='main'?1.1:.78);waterLightRoot.add(ripple);waterLightRipples.push(ripple);
  lotusLanterns.push({group,ripple,kind:placement.kind,materials,light,x:placement.x,z:placement.z,rotation:placement.rotation,floatHeight:placement.kind==='main'?.045:.03,bob:placement.kind==='main'?.035:.025,drift:placement.kind==='main'?.045:.032,phase:index*1.37,phaseSpeed:(index%4)*.035});
 });
 lotusAnimationActive=lotusLanterns.length>0;setLotusNight(night);lotusRoot.visible=groups.water.visible;model.updateMatrixWorld(true);needsRender=true;
}
function setWeather(value){
 weather=WEATHER_NAMES.has(value)?value:'clear';night=weather==='night';const preset=WEATHER_PRESETS[weather];
 $('night')?.setAttribute('aria-pressed',String(night));document.body.classList.toggle('night-mode',night);
 document.querySelectorAll('[data-weather]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.weather===weather)));
 if(night){sky.visible=false;scene.background=new THREE.Color(preset.background);scene.fog=null;}
 else{sky.visible=true;scene.background=null;applySkyParameters(sky,preset);scene.fog=preset.fog?new THREE.FogExp2(preset.fog.color,preset.fog.density):null;}
 updateCelestials(preset);cloudRoot.visible=true;const cloudTone=night?0x31445d:weather==='overcast'?0xb9c5c7:weather==='mist'?0xd1d9d5:0xf5f8f2;for(const cloud of cloudSprites){cloud.material.color.setHex(cloudTone);cloud.material.opacity=night?.24:weather==='overcast'?.62:weather==='mist'?.42:.48;}
 buildEnvironment(weather);
 hemi.intensity=preset.hemi;sun.intensity=preset.sun;fill.intensity=preset.fill;sun.color.set(preset.sunColor);renderer.toneMappingExposure=preset.exposure;
 const sunDistance=night?110:180;sun.position.copy(skySun).multiplyScalar(sunDistance);sun.target.position.set(0,0,-12);
 M.glass.emissive.set(night?'#d39d49':'#000000');M.glass.emissiveIntensity=night?.18:0;
 M.lamp.emissiveIntensity=night?2.5:.05;M.yellow.emissive.set(night?'#b58911':'#000000');M.yellow.emissiveIntensity=night?.20:0;
 setLotusNight(night);
 mingArchitecture.setNight(night&&era==='ming');M.water.color.set(preset.water);M.water.envMapIntensity=night?1.9:weather==='overcast'?1.15:1.45;M.water.roughness=night?.16:weather==='mist'?.28:.2;
 if(waterSurface){const wu=waterSurface.material.uniforms;wu.waterColor.value.set(preset.water);wu.sunColor.value.set(preset.sunColor);waterSunDirection.set(night?-0.36:skySun.x,night?0.48:skySun.y,night?0.8:skySun.z).normalize();wu.sunDirection.value.copy(waterSunDirection);wu.distortionScale.value=preset.waterDistortion;wu.alpha.value=preset.waterAlpha;wu.size.value=preset.waterSize;syncWaterVisibility();}
 modernLighting?.setEnabled(night&&era==='modern');mingLighting?.setEnabled(night&&era==='ming');setWire(wire);renderer.shadowMap.needsUpdate=true;needsRender=true;
}
function setNight(value){setWeather(value?'night':'clear');}
function setWire(value){wire=value;$('wire').setAttribute('aria-pressed',String(wire));model.traverse(o=>{if(o.isMesh){for(const m of Array.isArray(o.material)?o.material:[o.material])m.wireframe=wire}});if(waterSurface)syncWaterVisibility();needsRender=true;}
function setEra(value){
 era=value==='ming'?'ming':'modern';
 modernBuildings.visible=era==='modern';mingBuildings.visible=era==='ming';
 modernLighting?.setEnabled(night&&era==='modern');mingLighting?.setEnabled(night&&era==='ming');
 $('era-modern')?.setAttribute('aria-pressed',String(era==='modern'));
 $('era-ming')?.setAttribute('aria-pressed',String(era==='ming'));
 if($('era-status'))$('era-status').textContent=era==='modern'?'当前：现代秦淮':'当前：明初秦淮';
 mingArchitecture.setNight(night&&era==='ming');
 modernLighting?.syncWater();mingLighting?.syncWater();
 $('building-count').textContent=String(era==='modern'?modernBuildingCount:mingBuildingCount);
 setWire(wire);renderer.shadowMap.needsUpdate=true;needsRender=true;
}
$('era-modern')?.addEventListener('click',()=>setEra('modern'));
$('era-ming')?.addEventListener('click',()=>setEra('ming'));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$('rotate').onclick=()=>{rotation=!rotation;controls.autoRotate=rotation;$('rotate').setAttribute('aria-pressed',String(rotation));needsRender=true;};
$('first-person').onclick=()=>setFirstPerson(!firstPerson);
firstPersonControls.addEventListener('lock',()=>{$('first-person-hint')?.classList.add('show');if($('first-person-hint'))$('first-person-hint').textContent='WASD 移动 · 鼠标转向 · Shift 加速 · Esc 释放鼠标';needsRender=true;});
firstPersonControls.addEventListener('unlock',()=>{if(firstPerson&&$('first-person-hint'))$('first-person-hint').textContent='点击画面捕获鼠标 · WASD 移动 · Esc 释放';needsRender=true;});
renderer.domElement.addEventListener('click',()=>{if(firstPerson&&!window.__QINHUAI_GAME__&&!firstPersonControls.isLocked)firstPersonControls.lock();});
addEventListener('keydown',event=>{if(!firstPerson||window.__QINHUAI_GAME__)return;const key=event.code;if(key==='KeyW')firstPersonKeys.forward=true;else if(key==='KeyS')firstPersonKeys.backward=true;else if(key==='KeyA')firstPersonKeys.left=true;else if(key==='KeyD')firstPersonKeys.right=true;else if(key==='ShiftLeft'||key==='ShiftRight')firstPersonKeys.boost=true;else return;event.preventDefault();});
addEventListener('keyup',event=>{const key=event.code;if(key==='KeyW')firstPersonKeys.forward=false;else if(key==='KeyS')firstPersonKeys.backward=false;else if(key==='KeyA')firstPersonKeys.left=false;else if(key==='KeyD')firstPersonKeys.right=false;else if(key==='ShiftLeft'||key==='ShiftRight')firstPersonKeys.boost=false;});
document.querySelectorAll('[data-weather]').forEach(button=>button.addEventListener('click',()=>setWeather(button.dataset.weather)));
$('night').onclick=()=>setWeather(night?'clear':'night');$('wire').onclick=()=>setWire(!wire);
$('reset').onclick=()=>{setFirstPerson(false);setWeather('clear');setWire(false);document.querySelectorAll('[data-layer]').forEach(input=>{input.checked=true;groups[input.dataset.layer].visible=true;});lotusRoot.visible=true;setEra('modern');renderer.shadowMap.needsUpdate=true;setView('perspective');};
document.querySelectorAll('[data-layer]').forEach(input=>input.addEventListener('change',()=>{groups[input.dataset.layer].visible=input.checked;if(input.dataset.layer==='water'){lotusRoot.visible=input.checked;syncWaterVisibility();}modernLighting?.syncWater();mingLighting?.syncWater();renderer.shadowMap.needsUpdate=true;needsRender=true;}));
$('layers-toggle').onclick=()=>{const p=$('layers-panel');p.hidden=!p.hidden;$('layers-toggle').setAttribute('aria-expanded',String(!p.hidden));};
const sourceIDs=['perspective','plan','west','pavilion','bridge','night-detail','night-river'];let sourceIndex=0;
function openReference(index){sourceIndex=index;const id=sourceIDs[index];$('reference-large').src=$('ref-'+id).src;$('reference-caption').textContent=['原始设计稿 · 东南向透视','原始设计稿 · 俯视总图','原始设计稿 · 西南向透视','局部设计稿 · 魁星阁院落','局部设计稿 · 桥与河岸衔接','夜景参考 · 金色飞檐与暖光木窗','夜景参考 · 沿河廊道与灯影'][index];if(!$('reference-dialog').open)$('reference-dialog').showModal();}
document.querySelectorAll('[data-reference]').forEach(b=>b.onclick=()=>openReference(sourceIDs.indexOf(b.dataset.reference)));
$('reference-close').onclick=()=>$('reference-dialog').close();$('reference-next').onclick=()=>openReference((sourceIndex+1)%sourceIDs.length);
$('reference-match').onclick=()=>{setView(sourceIndex>=5?'pavilion-night':sourceIDs[sourceIndex]);$('reference-dialog').close();};
$('reference-dialog').addEventListener('click',e=>{if(e.target===$('reference-dialog'))$('reference-dialog').close();});
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);}
$('capture').onclick=()=>{renderScene();renderer.domElement.toBlob(blob=>{if(blob){download(blob,'qinhuai-'+era+'-'+currentView+(night?'-night':'')+'.png');toast('当前视角已导出为 PNG');}},'image/png');};
function createExportSnapshot(){
 const copy=model.clone(true);
 const prune=parent=>{for(const child of [...parent.children]){if(!child.visible)parent.remove(child);else prune(child);}};
 prune(copy);return copy;
}
$('export').onclick=async()=>{
 const b=$('export');if(b.disabled)return;b.disabled=true;b.textContent='正在生成模型…';
 const materials=new Map();
 try{
  await new Promise(r=>setTimeout(r,30));const copy=createExportSnapshot();
  copy.traverse(o=>{if(o.isMesh){const cloneMat=m=>{if(!materials.has(m)){const c=m.clone();c.wireframe=false;materials.set(m,c);}return materials.get(m)};o.material=Array.isArray(o.material)?o.material.map(cloneMat):cloneMat(o.material);}});
  copy.userData={era,night,pavilionPilot:window.__QINHUAI_PAVILION_PILOT__?.level||null,description:era==='ming'?'Interpretive Ming architecture on unchanged modern terrain, not a historical survey.':'Original modern district.',north:'-Z',units:'nominal metres'};
  const data=await new GLTFExporter().parseAsync(copy,{binary:true,onlyVisible:true,maxTextureSize:1024});download(new Blob([data],{type:'model/gltf-binary'}),'qinhuai-'+era+(night?'-night':'')+'.glb');toast(night?'夜景灯光 GLB 已导出':'完整街区 GLB 已导出');
 }catch(e){console.error(e);toast('导出失败：'+e.message);}finally{materials.forEach(m=>m.dispose());b.disabled=false;b.textContent='导出模型 ↗';}
};
$('building-count').textContent=String(era==='modern'?modernBuildingCount:mingBuildingCount);$('boat-count').textContent=String(boatCount);setSkyQuality(skyQuality);setWeather('clear');
addEventListener('resize',resize);controls.addEventListener('change',()=>{needsRender=true});
renderer.domElement.addEventListener('keydown',e=>{if(window.__QINHUAI_GAME__)return;if(e.key.toLowerCase()==='r')$('reset').click();if(e.key.toLowerCase()==='t')setView('top');});
resize();setView(views[location.hash.slice(1)]?location.hash.slice(1):'perspective');renderer.shadowMap.needsUpdate=true;
let last=performance.now(),idleFrames=0;
function tick(now){
 performanceAudit?.tickStart();
 try{
  const dt=Math.min((now-last)/1000,.25);last=now;updateFirstPerson(dt);window.__QINHUAI_GAME__?.update(dt,now);updateLotusLanterns(now);updateWaterAnimation(now);updateSkyAnimation(now);
  const changed=firstPerson?false:controls.update(dt);
  if(needsRender||changed||controls.autoRotate||firstPerson||waterAnimationActive&&groups.water.visible||lotusAnimationActive&&lotusRoot.visible||skyAnimationActive||idleFrames<3){renderScene();needsRender=false;idleFrames++;}
 }catch(error){window.__QINHUAI_BOOT__?.fail(error);return;}finally{performanceAudit?.tickEnd();}
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
// Show the existing map first. User models remain byte-for-byte intact and
// offline, but decode/parse one at a time rather than blocking first paint.
$('export').disabled=true;
const boot=window.__QINHUAI_BOOT__;
const assetState={phase:'initializing',completed:0,total:5,failures:[]};
let towerModern=null,towerMing=null,bridge=null;

function attachPavilion(gltf){
 const pilot=window.__QINHUAI_PAVILION_PILOT__;
 const sourceBounds=pilot?new THREE.Box3(new THREE.Vector3().fromArray(pilot.sourceBounds.min),new THREE.Vector3().fromArray(pilot.sourceBounds.max)):new THREE.Box3().setFromObject(gltf.scene),sourceSize=sourceBounds.getSize(new THREE.Vector3()),sourceCenter=sourceBounds.getCenter(new THREE.Vector3());
 const fittedScale=9.6/sourceSize.y;
 const makeTower=(name,parent)=>{
  const tower=new THREE.Group();tower.name=name;
  const modelScene=gltf.scene.clone(true);modelScene.position.set(-sourceCenter.x,-sourceBounds.min.y,-sourceCenter.z);tower.add(modelScene);
  tower.scale.setScalar(fittedScale);tower.position.set(27.5,courtY,10.1);
  tower.userData={source:pilot?.url||'Meshy_AI_kuixingge_1016044736_texture.glb',pilot:pilot?.level||null,approved:!pilot,uniformScale:fittedScale,sourceMin:sourceBounds.min.toArray(),sourceMax:sourceBounds.max.toArray(),reference:'User-supplied textured mesh, original geometry and textures'};
  tower.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});parent.add(tower);return tower;
 };
 towerModern=makeTower('Kuixing_Meshy_User_Model_Modern',groups.pavilion);
 towerMing=makeTower('Kuixing_Meshy_User_Model_Ming',mingArchitecture.districts.pavilion);
 // Parent groups alone control visibility, including switches made before asset loading.
 modernLighting=installPavilionLighting({model,tower:towerModern,groups,parent:modernBuildings,name:'Modern_Kuixing_night_lighting'});
 mingLighting=installPavilionLighting({model,tower:towerMing,groups,parent:mingBuildings,name:'Ming_Kuixing_night_lighting'});
}
function attachBridge(gltf){
 bridge=gltf.scene;bridge.name='Qiao_Original_User_Model';bridge.scale.setScalar(bridgePlacement.scale);bridge.rotation.y=Math.PI/2;bridge.position.set(bridgePlacement.x,bridgePlacement.y,bridgePlacement.z);
 bridge.userData={source:'qiao.glb',uniformScale:bridgePlacement.scale,deckHeight:bridgePlacement.deck};
 bridge.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});groups.bridge.add(bridge);
}
function refreshLoadedModels(){
 // Honor changes the user made while the background queue was working.
 setEra(era);setWeather(weather);model.updateMatrixWorld(true);
 renderer.shadowMap.needsUpdate=true;needsRender=true;
}
async function loadModel(id,label){
 const auditStarted=performance.now();
 let lastProgress=-1;
 const externalUrl=gameConfig?.externalAssets?.[id];
 const buffer=externalUrl?await fetch(externalUrl).then(response=>{if(!response.ok)throw new Error(label+'加载失败：HTTP '+response.status);return response.arrayBuffer();}):await readEmbeddedAsset(id,fraction=>{
  const percent=Math.floor(fraction*100);
  if(percent!==lastProgress){lastProgress=percent;boot?.update(`正在读取${label} ${percent}% · 可先浏览地图`);}
 });
 boot?.update(`正在解析${label}的网格与贴图…`);
 await yieldToBrowser();
 const gltf=await new GLTFLoader().parseAsync(buffer,'');
 performanceAudit?.assetLoaded(id,performance.now()-auditStarted,buffer.byteLength);
 return gltf;
}
async function loadSceneAssets(){
 boot?.update('基础地图已就绪，正在读取离线模型数据…');
 renderScene();boot?.ready();
 // The executable bundle intentionally precedes inert asset blocks in HTML.
 if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
 await yieldToBrowser();
 let lotusOneGLTF=null,lotusMainGLTF=null;
 const tasks=[
  {id:'STREET',label:'街道贴图',run:async()=>{await streetReady;if(streetLoadError)throw streetLoadError;needsRender=true;}},
  {id:'BRIDGE',label:'桥梁',run:async()=>{attachBridge(await loadModel('BRIDGE','桥梁'));refreshLoadedModels();}},
  {id:'PAVILION',label:'魁星阁',run:async()=>{attachPavilion(await loadModel('PAVILION','魁星阁'));refreshLoadedModels();}},
  {id:'LOTUS_ONE',label:'第一种荷花灯',run:async()=>{lotusOneGLTF=await loadModel('LOTUS_ONE','第一种荷花灯');}},
  {id:'LOTUS_MAIN',label:'第二种荷花灯',run:async()=>{
   lotusMainGLTF=await loadModel('LOTUS_MAIN','第二种荷花灯');
  }}
 ];
 const failures=await runAssetQueue(tasks.map(task=>({...task,run:async()=>{await task.run();assetState.completed++;}})),{
  onProgress(label,index,total){assetState.phase='loading';boot?.update(`正在加载${label}（${index+1}/${total}）`);},
  onError(task,error){console.error('Qinhuai asset '+task.id,error);}
 });
 if(lotusOneGLTF&&lotusMainGLTF){
  try{addLotusLanterns(lotusOneGLTF,lotusMainGLTF);refreshLoadedModels();}
  catch(error){failures.push({id:'LOTUS_SETUP',message:error.message});}
 }
 lotusOneGLTF=null;lotusMainGLTF=null;
 assetState.failures=failures;assetState.phase=failures.length?'partial':'ready';
 // Never label an incomplete model export as a complete scene.
 $('export').disabled=failures.length>0;
 if(failures.length){
  $('export').title='部分模型尚未加载，请重新加载后再导出';
  boot?.fail(new Error('地图可继续浏览；部分资源未加载：'+failures.map(item=>item.id+' — '+item.message).join('；')));
 }else boot?.complete();
 return {ok:failures.length===0,failures};
}
window.__QINHUAI__={get waterReflectionFailed(){return waterReflectionFailed;},threeRevision:THREE.REVISION,pavilionPilot:window.__QINHUAI_PAVILION_PILOT__||null,model,scene,camera,firstPersonCamera,renderer,controls,firstPersonControls,groups,weatherRoot,lotusRoot,modernBuildings,mingBuildings,setView,setNight,setWeather,setSkyQuality,setFirstPerson,setEra,setWire,renderScene,createExportSnapshot,assetState,get era(){return era;},get firstPerson(){return firstPerson;},get weather(){return weather;},get night(){return weather==='night';},get skyQuality(){return skyQuality;},skyPresets:WEATHER_PRESETS,get wire(){return wire;},mingArchitecture,get lighting(){return era==='modern'?modernLighting:mingLighting;},get modernLighting(){return modernLighting;},get mingLighting(){return mingLighting;},get tower(){return towerModern;},get towerModern(){return towerModern;},get towerMing(){return towerMing;},get bridge(){return bridge;},bridgePlacement,get lotusLanterns(){return lotusLanterns;},stats:()=>{let instances=0,meshes=0;model.traverseVisible(o=>{if(o.isMesh)meshes++;if(o.isInstancedMesh)instances+=o.count;});return {era,buildings:era==='modern'?modernBuildingCount:mingBuildingCount,trees:treeCount,boats:boatCount,instances,meshes,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,bounds:new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).toArray()};}};
performanceAudit=installPerformanceAudit(window.__QINHUAI__);
window.__QINHUAI__.performanceAudit=performanceAudit;
window.__QINHUAI__.assetsReady=loadSceneAssets().catch(error=>{
 assetState.phase='failed';assetState.failures.push({id:'STARTUP',message:error.message});
 boot?.fail(error);return {ok:false,failures:assetState.failures};
});







