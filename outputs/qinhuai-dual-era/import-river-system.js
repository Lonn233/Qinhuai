import * as THREE from 'three';
import {Water} from 'three/addons/objects/Water2.js';
import layout from './assets/qinhuai-modern-import/festival/layout.json' with {type:'json'};

const LEVELS={balanced:{size:512,hz:12},low:{size:256,hz:6}};
const COLORS={day:0x789b9b,sunset:0x9b8b88,blueHour:0x718299,night:0x566e83};

function shorelineGeometry(){
  const positions=[],uvs=[],points=layout.water.triangles.flat();
  const xs=points.map(p=>p[0]),zs=points.map(p=>p[1]);
  const x0=Math.min(...xs),z0=Math.min(...zs),width=Math.max(...xs)-x0,depth=Math.max(...zs)-z0;
  for(const [a,b,c] of layout.water.triangles){
    const cross=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    for(const p of cross>0?[a,c,b]:[a,b,c]){positions.push(p[0],-p[1],0);uvs.push((p[0]-x0)/width,(p[1]-z0)/depth);}
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
}

function waterTexture(flow=false,phase=0){
  const size=128,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=2*Math.PI*x/size,v=2*Math.PI*y/size,i=(y*size+x)*4;
    if(flow){const angle=.13*Math.sin(v)+.06*Math.sin(u+v);data[i]=(Math.cos(angle)*.85+1)*127.5;data[i+1]=(Math.sin(angle)*.85+1)*127.5;data[i+2]=128;}
    else{const nx=.13*Math.sin(u*4+v*3+phase)+.06*Math.cos(u*9-v*5),nz=.11*Math.cos(v*6-u*2+phase)+.05*Math.sin(v*11+u*7);data[i]=(nx+1)*127.5;data[i+1]=(nz+1)*127.5;data[i+2]=(Math.sqrt(1-nx*nx-nz*nz)+1)*127.5;}
    data[i+3]=255;
  }
  const texture=new THREE.DataTexture(data,size,size);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
}

export class RiverSystem{
  constructor({scene,parent,renderer,onActiveChange=()=>{}}){
    Object.assign(this,{scene,parent,renderer,onActiveChange});
    this.sources=[];this.enabled=true;this.visible=true;this.wireframe=false;this.failed=false;
    this.quality='auto';this.level='balanced';this.slowFrames=0;this.seconds=0;this.lastCapture=-Infinity;this.captures=0;
    this.maps=[waterTexture(true),waterTexture(false),waterTexture(false,1.7)];
    const shader={...Water.WaterShader,fragmentShader:Water.WaterShader.fragmentShader.replace('coord.z * normal.xz * 0.05','coord.z * normal.xz * 0.022')};
    this.mesh=new Water(shorelineGeometry(),{textureWidth:512,textureHeight:512,flowMap:this.maps[0],normalMap0:this.maps[1],normalMap1:this.maps[2],flowSpeed:.012,reflectivity:.35,scale:2,color:COLORS.day,shader});
    this.mesh.name='Qinhuai flowing river';this.mesh.rotation.x=-Math.PI/2;this.mesh.position.y=layout.water.height+.018;
    this.mesh.visible=false;parent.add(this.mesh);
    this.targets=['tReflectionMap','tRefractionMap'].map(key=>this.mesh.material.uniforms[key].value.renderTarget);
    for(const target of this.targets)if(target)target.samples=0;
    const capture=this.mesh.onBeforeRender;
    this.mesh.onBeforeRender=(r,s,c)=>this.capture(r,s,c,capture);
    this.setQuality('auto');
  }
  get active(){return this.enabled&&!this.failed&&this.sources.length>0&&this.visible&&!this.wireframe;}
  registerTile(id,object){
    if(id!==layout.water.tile)return;
    object.traverse(mesh=>{if(mesh.isMesh&&mesh.name===layout.water.node&&!this.sources.includes(mesh))this.sources.push(mesh);});
    this.sync();this.invalidate();
  }
  sync(){
    const active=this.active;this.mesh.visible=active;
    for(const source of this.sources)source.visible=this.visible&&!active;
    this.onActiveChange(active);
  }
  setTime(time){this.mesh.material.uniforms.color.value.setHex(COLORS[time]??COLORS.day);this.invalidate();}
  setEnabled(value){this.enabled=!!value;this.sync();this.invalidate();}
  setVisible(value){this.visible=!!value;this.sync();this.invalidate();}
  setWireframe(value){this.wireframe=!!value;this.sync();this.invalidate();}
  setQuality(value){
    this.quality=['auto','balanced','low'].includes(value)?value:'auto';
    this.setLevel(this.quality==='low'||(this.quality==='auto'&&innerWidth<700)?'low':'balanced');
  }
  setLevel(value){
    this.level=value;this.resizeTargets();
  }
  get captureSettings(){return this.performanceOverride||LEVELS[this.level];}
  setPerformanceOverride(value){
    this.performanceOverride=value?{size:value.size,hz:value.hz}:null;
    this.resizeTargets();
  }
  resizeTargets(){
    const {size}=this.captureSettings;
    for(const target of this.targets)if(target){target.samples=0;if(target.width!==size||target.height!==size)target.setSize(size,size);}
    this.invalidate();
  }
  invalidate(){this.lastCapture=-Infinity;}
  update(seconds,delta){
    this.seconds=seconds;
    const config=this.mesh.material.uniforms.config.value;config.x=(seconds*.012)%.15;config.y=(config.x+.075)%.15;
    if(this.quality==='auto'&&this.level!=='low'){
      this.slowFrames=delta>.08?this.slowFrames+1:0;
      if(innerWidth<700||this.slowFrames>=45)this.setLevel('low');
    }
  }
  capture(renderer,scene,camera,officialCapture){
    const matrix=this.mesh.material.uniforms.textureMatrix.value;
    matrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(camera.projectionMatrix).multiply(camera.matrixWorldInverse).multiply(this.mesh.matrixWorld);
    if(!this.active||this.capturing||camera.position.y<=this.mesh.position.y||this.seconds-this.lastCapture<1/this.captureSettings.hz)return;
    const state={target:renderer.getRenderTarget(),face:renderer.getActiveCubeFace(),mip:renderer.getActiveMipmapLevel(),viewport:renderer.getViewport(new THREE.Vector4()),scissor:renderer.getScissor(new THREE.Vector4()),test:renderer.getScissorTest(),xr:renderer.xr.enabled,shadow:renderer.shadowMap.autoUpdate,needs:renderer.shadowMap.needsUpdate};
    const flow=this.mesh.material.uniforms.config.value.clone();
    this.capturing=true;
    try{
      renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=false;
      officialCapture(renderer,scene,camera);this.lastCapture=this.seconds;this.captures++;
    }catch(error){this.failed=true;console.warn('River reflection unavailable; using original water.',error);this.sync();}
    finally{
      renderer.setRenderTarget(state.target,state.face,state.mip);renderer.setViewport(state.viewport);renderer.setScissor(state.scissor);renderer.setScissorTest(state.test);
      renderer.xr.enabled=state.xr;renderer.shadowMap.autoUpdate=state.shadow;renderer.shadowMap.needsUpdate=state.needs;
      this.mesh.material.uniforms.config.value.copy(flow);this.mesh.visible=this.active;this.capturing=false;
    }
  }
  get stats(){return {mode:this.enabled?'flow':'original',active:this.active,quality:this.quality,level:this.level,captures:this.captures,flow:this.mesh.material.uniforms.config.value.x,sources:this.sources.length,failed:this.failed,resolution:this.captureSettings.size,captureHz:this.captureSettings.hz};}
  dispose(){this.enabled=false;this.sync();this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();for(const target of this.targets)target?.dispose();for(const map of this.maps)map.dispose();}
}
