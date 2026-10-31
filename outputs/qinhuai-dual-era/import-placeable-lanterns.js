import * as THREE from 'three';
import {isTempleInteriorPosition} from './import-temple-visibility.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {PLACEABLE_LANTERNS,normalizePlacedLanterns} from './import-placeable-lantern-settings.mjs';
import {normalizeLantern} from './import-lantern-settings.mjs';

export class PlaceableLanternLayer{
 constructor(parent){
  this.root=new THREE.Group();this.root.name='preview-placed-lanterns';parent.add(this.root);
  this.helpers=new THREE.Group();this.helpers.name='lantern-placement-guides';parent.add(this.helpers);
  this.objects=new Map();this.templates=new Map();this.pending=new Map();this.record=normalizePlacedLanterns(null);
  this.selected=null;this.preview=false;this.disposed=false;this.version=0;this.lightControls={};this.night=true;
  this.box=new THREE.Box3();this.outline=new THREE.Box3Helper(this.box,0xffdc72);this.helpers.add(this.outline);
  this.axes=new THREE.Group();this.helpers.add(this.axes);
  for(const [direction,color] of [[new THREE.Vector3(1,0,0),0xff6767],[new THREE.Vector3(0,1,0),0x68dc9a],[new THREE.Vector3(0,0,1),0x6eb8ff]])this.axes.add(new THREE.ArrowHelper(direction,new THREE.Vector3(),1,color,.17,.09));
  this.helpers.visible=false;this.loader=new GLTFLoader();
 }
 async template(kind){
  if(!this.templates.has(kind)){
   const config=PLACEABLE_LANTERNS.find(v=>v.id===kind);if(!config)throw Error('未知灯具');
   const task=this.loader.loadAsync(config.url).then(async({scene})=>{
    try{
    if(this.disposed)throw Error('灯具层已关闭');
    if(kind==='fish')await this.restoreFishMaterials(scene);
    if(this.disposed)throw Error('灯具层已关闭');
    scene.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(scene);
    if(config.size){const size=b.getSize(new THREE.Vector3()),extent=config.axis==='xz'?Math.max(size.x,size.z):size[config.axis];if(extent>0)scene.scale.multiplyScalar(config.size/extent);scene.updateMatrixWorld(true);b.setFromObject(scene);}
    const center=b.getCenter(new THREE.Vector3());
    // Keep the authored materials, but give each instance a ground-level pivot.
    const template=new THREE.Group();scene.position.sub(new THREE.Vector3(center.x,b.min.y,center.z));template.add(scene);
    return template;
    }catch(error){this.release(scene);throw error;}
   }).catch(error=>{this.templates.delete(kind);throw error;});
   this.templates.set(kind,task);
  }
  return this.templates.get(kind);
 }
 async restoreFishMaterials(scene){
  // The reduced fish retains UVs; its authored materials live in the source GLB.
  const {scene:source}=await this.loader.loadAsync('./assets/feature-lanterns/fish-low.glb');
  const targets=[],donors=[];
  scene.traverse(o=>{if(o.isMesh)targets.push(o);});
  source.traverse(o=>{if(o.isMesh)donors.push(o);});
  if(targets.length!==1||donors.length!==1){this.release(source);throw Error('金鱼灯原始材质与优化网格不匹配');}
  const previous=Array.isArray(targets[0].material)?targets[0].material:[targets[0].material];
  targets[0].material=donors[0].material;
  for(const material of new Set(previous))material.dispose();
  // The cached template owns the transferred materials, but not the source geometry.
  for(const geometry of new Set(donors.map(mesh=>mesh.geometry)))geometry.dispose();
 }
 transform(object,item){object.position.set(item.x,item.y,item.z);object.rotation.set(...['rx','ry','rz'].map(k=>THREE.MathUtils.degToRad(item[k])));object.scale.setScalar(item.scale);object.updateMatrixWorld(true);}
 cloneMaterials(object){
  const copies=new Map();
  object.traverse(mesh=>{if(!mesh.isMesh)return;const clone=source=>{if(!copies.has(source))copies.set(source,source.clone());return copies.get(source);};mesh.material=Array.isArray(mesh.material)?mesh.material.map(clone):clone(mesh.material);});
 }
 // A placed lamp belongs to its location, regardless of its catalog kind.
 // Include edge-mounted lamps whose pivots sit just outside the courtyard wall.
 zoneVisible(item){return !this.templeInside||isTempleInteriorPosition(item.x,item.z,1);}
 setTempleInside(value){this.templeInside=!!value;this.setState();this.version++;}
 applyLighting(object,item){
  const s=normalizeLantern(this.lightControls[item.kind]);object.visible=s.modelVisible&&this.zoneVisible(item);
  object.traverse(mesh=>{if(!mesh.isMesh)return;for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
   if(!material.emissive)continue;
   // Reuse the authored color texture so the added glow preserves the painted patterns.
   const map=material.map||null;if(material.emissiveMap!==map){material.emissiveMap=map;material.needsUpdate=true;}
   material.emissive.set(s.inheritColor?'#ffffff':s.color);material.emissiveIntensity=this.night&&s.enabled?s.brightness*.65:0;
  }});
 }
 releaseInstance(object){const materials=new Set();object.traverse(mesh=>{if(mesh.isMesh)for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])materials.add(material);});for(const material of materials)material.dispose();object.removeFromParent();}
 setState(night=this.night){this.night=night;for(const item of this.record.instances){const object=this.objects.get(item.id);if(object)this.applyLighting(object,item);}this.updateHelpers();}
 spillChannels(baseColor=()=>'#ffcf87'){
  const channels=[];if(!this.night)return channels;
  for(const item of this.record.instances){
   const s=normalizeLantern(this.lightControls[item.kind]),object=this.objects.get(item.id);
   if(!object||!this.zoneVisible(item)||!object.visible||!s.modelVisible||!s.enabled||!s.brightness||!s.spill.enabled)continue;
   object.updateWorldMatrix(true,true);const box=new THREE.Box3().setFromObject(object);if(box.isEmpty())continue;
   const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
   channels.push({p:s.spill,color:new THREE.Color(s.spill.inheritColor?(s.inheritColor?baseColor(item.kind):s.color):s.spill.color),energy:s.brightness*.65,cacheKey:'placed-lantern|'+item.id,emitters:[{x:center.x,y:center.y,z:center.z,nx:0,nz:0,halfWidth:0,omni:true,radius:Math.min(2.5,Math.max(size.x,size.y,size.z)*.25)}]});
  }
  return channels;
 }
 async loadInstance(item){
  const token={kind:item.kind};this.pending.set(item.id,token);
  try{
   const template=await this.template(item.kind);
   const current=this.record.instances.find(v=>v.id===item.id);
   if(this.disposed||this.pending.get(item.id)!==token||!current||current.kind!==item.kind)return;
   const object=template.clone(true);object.name='placed-'+item.id;object.userData.placedLanternId=item.id;object.userData.kind=item.kind;
   this.cloneMaterials(object);this.transform(object,current);this.applyLighting(object,current);this.objects.set(item.id,object);this.root.add(object);this.version++;
  }finally{if(this.pending.get(item.id)===token)this.pending.delete(item.id);}
 }
 apply(record){
  this.record=normalizePlacedLanterns(record);this.version++;
  const wanted=new Map(this.record.instances.map(v=>[v.id,v]));
  for(const [id,object] of this.objects)if(!wanted.has(id)||object.userData.kind!==wanted.get(id).kind){this.releaseInstance(object);this.objects.delete(id);}
  for(const [id,token] of this.pending)if(!wanted.has(id)||wanted.get(id).kind!==token.kind)this.pending.delete(id);
  for(const item of this.record.instances){
   const existing=this.objects.get(item.id);
   if(existing){this.transform(existing,item);this.applyLighting(existing,item);}
   else if(!this.pending.has(item.id)){
    const promise=this.loadInstance(item).catch(error=>{this.onError?.(error,item);});
    this.pending.get(item.id).promise=promise;
   }
  }
  this.ready=Promise.all([...this.pending.values()].map(token=>token.promise));this.updateHelpers();return this.ready;
 }
 setPreview(enabled){this.preview=enabled;this.updateHelpers();if(!enabled)this.hideGhost();}
 select(id){this.selected=id;this.updateHelpers();}
 updateHelpers(){
  const object=this.objects.get(this.selected);this.helpers.visible=!!object&&this.preview;
  if(this.helpers.visible){object.updateWorldMatrix(true,true);this.box.setFromObject(object);this.axes.position.copy(object.position);}
 }
 pick(ray){
  const hit=ray.intersectObjects([...this.objects.values()],true)[0];if(!hit)return null;
  let object=hit.object;while(object&&!object.userData.placedLanternId)object=object.parent;
  return object?.userData.placedLanternId||null;
 }
 async prepareGhost(kind){
  const token={};this.ghostToken=token;this.hideGhost();
  const template=await this.template(kind);if(this.disposed||token!==this.ghostToken)return;
  this.ghost=template.clone(true);this.ghost.name='lantern-placement-ghost';
  this.ghost.traverse(obj=>{if(!obj.isMesh)return;const clone=m=>{const material=m.clone();material.transparent=true;material.opacity=.48;material.depthWrite=false;return material;};obj.material=Array.isArray(obj.material)?obj.material.map(clone):clone(obj.material);});
  this.ghost.visible=false;this.root.add(this.ghost);
 }
 showGhost(point){if(this.ghost){this.ghost.position.copy(point);this.ghost.visible=this.preview;}}
 hideGhost(){if(!this.ghost)return;this.ghost.removeFromParent();this.ghost.traverse(obj=>{if(obj.isMesh)for(const m of Array.isArray(obj.material)?obj.material:[obj.material])m.dispose();});this.ghost=null;}
 cancelGhost(){this.ghostToken=null;this.hideGhost();}
 bounds(id){const object=this.objects.get(id);return object?new THREE.Box3().setFromObject(object):null;}
 release(root){const geometries=new Set(),materials=new Set(),textures=new Set();root.traverse(o=>{if(!o.isMesh)return;geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometries)g.dispose();}
 dispose(){this.disposed=true;this.cancelGhost();for(const object of this.objects.values())this.releaseInstance(object);this.root.removeFromParent();this.helpers.removeFromParent();this.helpers.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});for(const task of this.templates.values())task.then(t=>this.release(t)).catch(()=>{});this.objects.clear();}
}
