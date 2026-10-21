import * as THREE from 'three';
import {normalizeManualSpill,MAX_MANUAL_POINTS,MAX_MANUAL_SHADOWS} from './manual-spill-profiles.mjs';
export const MANUAL_WORLD_PER_METRE=.53/1.65;
// Native PBR SpotLights illuminate the existing surfaces. No luminous shells.
export function createManualSpillLayer(scene,model,floor,renderer,camera,canvas,callbacks={}){
 const root=new THREE.Group();root.name='study-manual-spill';const markers=new THREE.Group();markers.name='manual-spill-editor';root.add(markers);scene.add(root);
 const lights=new Map(),dots=new Map(),previous=new Map(),ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
 const geometry=new THREE.SphereGeometry(1,10,8),markerMaterial=new THREE.MeshBasicMaterial({color:'#73c3bb',depthTest:false,depthWrite:false,toneMapped:false}),selectedMaterial=markerMaterial.clone();selectedMaterial.color.set('#ffe4aa');
 const oldShadow=renderer.shadowMap.enabled,oldType=renderer.shadowMap.type;
 let state=normalizeManualSpill(),master=true,editor={placing:false,reposition:false,markers:true},down=null,disposed=false,shadowEnabled=false;
 function remember(mesh){if(mesh.isMesh&&!previous.has(mesh)){previous.set(mesh,{castShadow:mesh.castShadow,receiveShadow:mesh.receiveShadow});mesh.castShadow=true;mesh.receiveShadow=true;}}
 function configure(value,enabled=true){if(disposed)return;state=normalizeManualSpill(value);master=enabled;
  for(const [id,light]of lights)if(!state.points.some(p=>p.id===id)){root.remove(light,light.target);light.dispose();lights.delete(id);markers.remove(dots.get(id));dots.delete(id);}
  let shadowCount=0;for(const p of state.points){let light=lights.get(p.id);if(!light){light=new THREE.SpotLight();light.name='manual-spill-'+p.id;light.shadow.mapSize.set(512,512);light.shadow.bias=-.0003;light.shadow.normalBias=.012;light.shadow.radius=3;root.add(light,light.target);lights.set(p.id,light);const dot=new THREE.Mesh(geometry,markerMaterial);dot.userData.pointId=p.id;dot.renderOrder=10000;markers.add(dot);dots.set(p.id,dot);}
   const normal=new THREE.Vector3(...p.normal),position=new THREE.Vector3(...p.position).addScaledVector(normal,p.offset*MANUAL_WORLD_PER_METRE);
   const yaw=Math.atan2(normal.x,normal.z)+THREE.MathUtils.degToRad(p.azimuth),pitch=THREE.MathUtils.degToRad(p.elevation);
   const aim=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));
   light.position.copy(position);light.target.position.copy(position).add(aim);light.color.set(p.color);light.distance=p.distance*MANUAL_WORLD_PER_METRE;light.angle=THREE.MathUtils.degToRad(p.angle*.5);light.penumbra=p.penumbra;light.decay=2;
   light.intensity=p.intensity*MANUAL_WORLD_PER_METRE**2;light.visible=master&&state.enabled&&p.enabled&&p.intensity>0;
   light.castShadow=light.visible&&p.shadows&&shadowCount<MAX_MANUAL_SHADOWS;if(light.castShadow)shadowCount++;light.shadow.camera.near=.01;light.shadow.camera.far=Math.max(.1,light.distance);light.shadow.needsUpdate=true;
   const dot=dots.get(p.id);dot.position.copy(position);dot.material=p.id===state.selectedId?selectedMaterial:markerMaterial;
  }
  shadowEnabled=shadowCount>0;if(shadowEnabled){model.traverse(remember);if(floor)remember(floor);renderer.shadowMap.enabled=true;if(!oldShadow)renderer.shadowMap.type=THREE.PCFSoftShadowMap;}
  else if(previous.size){for(const [mesh,flags]of previous)Object.assign(mesh,flags);previous.clear();renderer.shadowMap.enabled=oldShadow;renderer.shadowMap.type=oldType;}
  renderer.shadowMap.needsUpdate=true;updateMarkers();
 }
 function updateMarkers(){markers.visible=editor.markers;for(const [id,dot]of dots){const d=camera.position.distanceTo(dot.position);dot.scale.setScalar(Math.max(.015,d*.006));dot.visible=editor.markers;dot.material=id===state.selectedId?selectedMaterial:markerMaterial;}root.updateMatrixWorld(true);}
 function setEditor(value){editor={...editor,...value};canvas.classList.toggle('manual-placement-active',editor.placing);updateMarkers();}
 function hitAt(event,objects){const rect=canvas.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);camera.updateMatrixWorld();model.updateMatrixWorld(true);ray.setFromCamera(mouse,camera);return ray.intersectObjects(objects,true).find(h=>h.object.visible);}
 function pointerDown(e){if(e.button!==0)return;down={x:e.clientX,y:e.clientY,id:e.pointerId};if(!editor.placing&&editor.markers){const hit=hitAt(e,[markers]);if(hit){down=null;e.stopImmediatePropagation();e.preventDefault();callbacks.onSelect?.(hit.object.userData.pointId);}}}
 function pointerUp(e){if(!down||e.pointerId!==down.id)return;const start=down;down=null;if(!editor.placing||Math.hypot(e.clientX-start.x,e.clientY-start.y)>6)return;
  if(state.points.length>=MAX_MANUAL_POINTS&&!editor.reposition){callbacks.onMessage?.('最多添加 '+MAX_MANUAL_POINTS+' 个点，请先删除不需要的点。');return;}
  const hit=hitAt(e,[model]);if(!hit||!hit.face){callbacks.onMessage?.('请点击建筑表面，不能在天空或空白处布点。');return;}
  const normal=hit.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)).normalize();
  // Double-sided interiors: place on the face visible to the user.
  if(normal.dot(ray.ray.direction)>0)normal.negate();callbacks.onPick?.(hit.point.toArray(),normal.toArray(),editor.reposition);
 }
 function escape(e){if(e.key==='Escape'&&editor.placing){editor.placing=false;canvas.classList.remove('manual-placement-active');callbacks.onStop?.();}}
 canvas.addEventListener('pointerdown',pointerDown,true);canvas.addEventListener('pointerup',pointerUp,true);const cancel=()=>down=null;canvas.addEventListener('pointercancel',cancel);window.addEventListener('keydown',escape);
 return {root,lights,markers,configure,setEditor,updateMarkers,get stats(){return {points:state.points.length,active:[...lights.values()].filter(l=>l.visible).length,shadowLights:[...lights.values()].filter(l=>l.castShadow).length};},dispose(){if(disposed)return;disposed=true;canvas.removeEventListener('pointerdown',pointerDown,true);canvas.removeEventListener('pointerup',pointerUp,true);canvas.removeEventListener('pointercancel',cancel);window.removeEventListener('keydown',escape);canvas.classList.remove('manual-placement-active');for(const light of lights.values())light.dispose();for(const [mesh,flags]of previous)Object.assign(mesh,flags);renderer.shadowMap.enabled=oldShadow;renderer.shadowMap.type=oldType;renderer.shadowMap.needsUpdate=true;geometry.dispose();markerMaterial.dispose();selectedMaterial.dispose();scene.remove(root);root.clear();lights.clear();dots.clear();}};
}
