import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

function release(object) {
 const geometries=new Set(),materials=new Set(),textures=new Set();
 object?.traverse(node=>{if(!node.isMesh)return;geometries.add(node.geometry);if(node.isSkinnedMesh)node.skeleton.dispose();for(const material of [node.material].flat()){materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});
 geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>{t.dispose();t.source?.data?.close?.();});
}

// Full-resolution book assets own geometry and original materials independently of the world.
// Render only on load, resize or input, not on a second perpetual animation loop.
export function createBookViewer(host, id, name) {
 let disposed=false,model=null,renderer=null,controls=null,observer=null;
 const abort=new AbortController();
 const status=document.createElement('p');status.className='story-book-model-status';status.setAttribute('role','status');status.textContent='正在请灯入卷…';host.append(status);host.dataset.state='loading';
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,100);
 function render(){if(disposed||!renderer)return;renderer.render(scene,camera);}
 const home=new THREE.Vector3();
 function reset(){if(!controls)return;camera.position.copy(home);controls.target.set(0,0,0);controls.update();render();}
 function resize(){if(disposed||!renderer)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(model){const fov=2*Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.min(1,camera.aspect));const distance=1.18/Math.sin(fov/2);home.set(.5,.3,1).normalize().multiplyScalar(distance);controls.minDistance=distance*.5;controls.maxDistance=distance*2;reset();}else render();}
 function key(event){if(!controls)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);if(event.key==='ArrowLeft')spherical.theta-=.12;if(event.key==='ArrowRight')spherical.theta+=.12;if(event.key==='ArrowUp')spherical.phi-=.12;if(event.key==='ArrowDown')spherical.phi+=.12;spherical.phi=THREE.MathUtils.clamp(spherical.phi,.08,Math.PI-.08);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));controls.update();}else if(event.key==='+'||event.key==='='||event.key==='-'){event.preventDefault();camera.position.sub(controls.target).multiplyScalar(event.key==='-'?1.1:1/1.1).add(controls.target);controls.update();}else if(event.key==='Home'){event.preventDefault();reset();}}
 const ready=(async()=>{
  try{
   renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
   const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',name+'三维模型，拖动旋转，滚轮缩放；方向键旋转，加减键缩放，Home复位。');canvas.addEventListener('keydown',key);host.prepend(canvas);
   controls=new OrbitControls(camera,canvas);controls.enablePan=false;controls.enableDamping=false;controls.minPolarAngle=.08;controls.maxPolarAngle=Math.PI-.08;controls.addEventListener('change',render);
   scene.add(new THREE.HemisphereLight(0xfff1d9,0x756450,1.6));const keyLight=new THREE.DirectionalLight(0xffecd0,2);keyLight.position.set(3,4,5);scene.add(keyLight);const rim=new THREE.DirectionalLight(0xc7ddff,1.3);rim.position.set(-4,2,-3);scene.add(rim);
   observer=new ResizeObserver(resize);observer.observe(host);resize();
   const url=new URL('./assets/story-book/'+id+'.glb',document.baseURI);
   const response=await fetch(url,{signal:abort.signal});if(!response.ok)throw Error('模型载入失败');const bytes=await response.arrayBuffer();if(disposed)return;
   const gltf=await new GLTFLoader().parseAsync(bytes,new URL('.',url).href);if(disposed){release(gltf.scene);return;}
   model=gltf.scene;
   let triangles=0;model.traverse(mesh=>{if(mesh.isMesh)triangles+=(mesh.geometry.index?.count??mesh.geometry.attributes.position.count)/3;});host.dataset.triangles=String(triangles);
   const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());const scale=2/Math.max(size.x,size.y,size.z,.001);
   const pedestal=new THREE.Group();pedestal.scale.setScalar(scale);pedestal.add(model);model.position.sub(center);scene.add(pedestal);
   status.hidden=true;host.dataset.state='ready';resize();
  }catch(error){if(disposed||error.name==='AbortError')return;host.dataset.state='error';status.textContent='灯影暂未载入，请点击“重新载入”；文字仍可阅读。';}
 })();
 return {ready,reset,dispose(){if(disposed)return;disposed=true;abort.abort();observer?.disconnect();controls?.dispose();release(model);if(renderer){renderer.domElement.removeEventListener('keydown',key);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}status.remove();host.dataset.state='disposed';}};
}
