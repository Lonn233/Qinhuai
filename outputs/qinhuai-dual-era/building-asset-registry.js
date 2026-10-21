/** Opt-in static-building toolkit; never activates unapproved candidates in the game. */
import * as THREE from 'three';
export function disposeAsset(gltf){
 const geometry=new Set(),materials=new Set(),textures=new Set();
 for(const scene of gltf.scenes||[gltf.scene])scene?.traverse(o=>{if(!o.isMesh)return;if(o.geometry)geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!m)continue;materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});
 geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
}
export class BuildingAssetRegistry{
 constructor(loader,manifest){this.loader=loader;this.manifest=manifest;this.cache=new Map();this.closed=false;}
 async acquire(building,level,{allowCandidate=false}={}){
  if(this.closed)throw new Error('Registry disposed');const entry=this.manifest[building]?.levels[level];if(!entry)throw new Error('Unknown building/level');
  if(entry.approved!==true&&!allowCandidate)throw new Error('Asset has not passed visual/performance acceptance');
  const key=building+':'+level;let record=this.cache.get(key);
  if(!record){record={refs:0,asset:null,promise:null};record.promise=Promise.resolve().then(()=>this.loader.loadAsync(entry.url)).then(asset=>{if(this.closed){disposeAsset(asset);throw new Error('Registry disposed during loading');}let animated=false;asset.scene.traverse(o=>{if(o.isSkinnedMesh)animated=true;});if(animated){disposeAsset(asset);throw new Error('Static buildings only; skinned assets need SkeletonUtils and a separate lifecycle');}record.asset=asset;return asset;});this.cache.set(key,record);}
  record.refs++;let asset;try{asset=await record.promise;}catch(e){record.refs--;if(this.cache.get(key)===record)this.cache.delete(key);throw e;}
  let released=false;
  return {asset,entry,clone:()=>{if(released||this.closed)throw new Error('Lease released or registry disposed');return asset.scene.clone(true);},release:()=>{if(released)return;released=true;record.refs--;if(record.refs===0&&this.cache.get(key)===record){this.cache.delete(key);disposeAsset(asset);}}};
 }
 /** Remove all leased clones from the scene BEFORE disposing the registry. */
 dispose(){if(this.closed)return;this.closed=true;for(const record of this.cache.values())if(record.asset)disposeAsset(record.asset);this.cache.clear();}
}
export function createBuildingLOD(leases,{sourceBounds,height=9.6,pixelThresholds=[350,120],hysteresis=.12}={}){
 if(!leases?.length||leases.length!==pixelThresholds.length+1)throw new Error('One threshold is required per LOD boundary');
 if(!Number.isFinite(height)||height<=0||!Number.isFinite(hysteresis)||hysteresis<0||hysteresis>=.5)throw new Error('Invalid height/hysteresis');
 if(!sourceBounds||!['min','max'].every(k=>Array.isArray(sourceBounds[k])&&sourceBounds[k].length===3&&sourceBounds[k].every(Number.isFinite))||sourceBounds.max.some((x,i)=>x<=sourceBounds.min[i]))throw new Error('Invalid source bounds');
 if(pixelThresholds.some((x,i)=>!Number.isFinite(x)||x<=0||(i>0&&x>=pixelThresholds[i-1])))throw new Error('Thresholds must be positive and strictly descending');
 // A custom Group avoids THREE.LOD's distance-based raycast selecting a level
 // different from the projected-pixel renderer selection. Do not use autoUpdate.
 const lod=new THREE.Group();lod.name='Candidate_Building_ScreenLOD';lod.levels=[];
 const min=new THREE.Vector3().fromArray(sourceBounds.min),max=new THREE.Vector3().fromArray(sourceBounds.max),center=min.clone().add(max).multiplyScalar(.5),scale=height/(max.y-min.y);
 leases.forEach((lease,i)=>{const holder=new THREE.Group(),asset=lease.clone();asset.position.set(-center.x,-min.y,-center.z);holder.scale.setScalar(scale);holder.add(asset);lod.add(holder);lod.levels.push({object:holder});holder.visible=i===0;});
 let selected=0,disposed=false;const world=new THREE.Vector3(),scaleV=new THREE.Vector3(),localMid=new THREE.Vector3(0,height*.5,0);
 lod.userData.buildingLOD={sourceBounds,height,pixelThresholds:[...pixelThresholds],hysteresis};
 lod.getCurrentLevel=()=>selected;
 lod.raycast=(raycaster,hits)=>{if(!disposed&&lod.visible)raycaster.intersectObject(lod.levels[selected].object,true,hits);return false;};
 const update=(camera,viewportHeight)=>{
  if(disposed)throw new Error('LOD disposed');if(!Number.isFinite(viewportHeight)||viewportHeight<=0||(!camera.isOrthographicCamera&&!camera.isPerspectiveCamera))throw new Error('Invalid camera/viewport');
  lod.updateWorldMatrix(true,false);camera.updateWorldMatrix(true,false);world.copy(localMid).applyMatrix4(lod.matrixWorld).applyMatrix4(camera.matrixWorldInverse);lod.getWorldScale(scaleV);const h=height*Math.abs(scaleV.y);
  const px=camera.isOrthographicCamera?h*viewportHeight*camera.zoom/(camera.top-camera.bottom):h*viewportHeight*Math.abs(camera.projectionMatrix.elements[5])/(2*Math.max(.001,-world.z));
  while(selected<pixelThresholds.length&&px<pixelThresholds[selected]*(1-hysteresis))selected++;
  while(selected>0&&px>pixelThresholds[selected-1]*(1+hysteresis))selected--;
  lod.levels.forEach((l,i)=>{l.object.visible=i===selected;});return {level:selected,projectedHeightPx:px};
 };
 return {object:lod,update,dispose(){if(disposed)return;disposed=true;lod.removeFromParent();lod.clear();leases.forEach(l=>l.release());}};
}
