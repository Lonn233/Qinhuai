import * as THREE from 'three';
import {chrysanthemumAssetUrl} from './chrysanthemum-model.mjs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MAP_SCALE} from './import-performance-profiles.mjs';

export const NEAR_LANTERN_MODES = Object.freeze({
  five:'流畅精细 · 原模5%（默认）',
  half:'之前版本 · 半面数（女灯25万面）',
  original:'原始模型 · 100%面数（高开销）',
  current:'旧轻量模型',
});
export const DEFAULT_NEAR_LANTERN_MODE='five';
export const NEAR_LANTERN_STORAGE_KEY='qinhuai-near-lantern-quality-v2';
export function normalizeNearLanternMode(value) {
  return Object.hasOwn(NEAR_LANTERN_MODES,value)?value:DEFAULT_NEAR_LANTERN_MODE;
}
export function nearLanternAssetUrl(kind,mode) {
  if(kind==='chrysanthemum')return chrysanthemumAssetUrl(mode);
  const url=mode==='half'?`./assets/lantern-near-half/${kind}.glb${kind==='woman'?'?v=woman-250k-20261022':''}`:
    `./assets/lantern-quality/${mode}/${kind}.glb?v=lantern-five-20261022`;
  return new URL(url,import.meta.url).href;
}
const NEAR_METERS=8, MAX_INSTANCES=12, MAX_CACHED_KINDS=8;
const visible = mesh => {for(let p=mesh;p;p=p.parent)if(!p.visible)return false;return true;};

// Only real lantern bodies participate. Reflections, spill meshes, ropes and
// procedural red pendants retain their own rendering and resource ownership.
export function collectNearLanternBatches({festival,feature,street,racks,tree,courtyard}) {
  const batches=[];
  const add=(mesh,kind,reference=mesh.geometry)=>{
    if(!reference.boundingBox)reference.computeBoundingBox();
    batches.push({mesh,kind,bounds:reference.boundingBox});
  };
  for(const [kind,e] of festival?.entries||[])for(const {mesh} of e.batches)
    if(mesh.userData.festivalKind)add(mesh,kind,e.parts[0].geometry);
  for(const [kind,e] of feature?.entries||[])for(const mesh of e.meshes)
    if(mesh.userData.featureLantern)add(mesh,kind,e.lod?.geometries[0]||mesh.geometry);
  street?.root.traverse(mesh=>{if(mesh.isInstancedMesh&&mesh.name==='Original four-lantern streetlamp')add(mesh,'streetlamp');});
  for(const e of racks?.entries.values()||[])for(const mesh of e.meshes)add(mesh,mesh.userData.rackKind);
  for(const layer of [tree,courtyard])layer?.root.traverse(mesh=>{
    if(mesh.isInstancedMesh&&['GoldenLanternBodies','CourtyardGoldenLanterns'].includes(mesh.name))add(mesh,'gold');
  });
  return batches;
}

export class NearLanternQuality {
  constructor({getBatches,load=(kind,mode)=>new GLTFLoader().loadAsync(nearLanternAssetUrl(kind,mode)),onChange=()=>{}}) {
    Object.assign(this,{getBatches,load,onChange});
    this.mode=DEFAULT_NEAR_LANTERN_MODE;this.generation=0;this.cache=new Map();this.failures=new Map();this.records=new Map();
    this.previous=new Set();this.changed=[];this.pending=null;this.disposed=false;this.active=0;
    this.triangles=0;this.replacedTriangles=0;this.lastScan=-Infinity;this.descriptors=[];this.wanted=new Set();
    this.instance=new THREE.Matrix4();this.world=new THREE.Matrix4();this.box=new THREE.Box3();
    this.cameraPosition=new THREE.Vector3();this.center=new THREE.Vector3();
  }
  setMode(value) {
    this.afterRender();const next=normalizeNearLanternMode(value);
    if(next!==this.mode){
      this.generation++;
      // Never retain multi-million-triangle original buffers after switching down.
      for(const kind of [...this.cache.keys()])this.release(kind);
    }
    this.mode=next;this.lastScan=-Infinity;this.wanted.clear();
    this.active=0;this.triangles=0;this.replacedTriangles=0;this.previous.clear();
    for(const r of this.records.values())r.mesh.visible=false;
    // A deliberate re-selection retries failures; render loops never retry endlessly.
    this.failures.clear();this.notify();return this.mode;
  }
  async loadKind(kind) {
    if(this.pending||this.cache.has(kind)||this.failures.has(kind)||this.disposed)return;
    const mode=this.mode,generation=this.generation;this.pending=kind;this.notify();let geometry;
    try {
      const gltf=await this.load(kind,mode),parts=[],resources=new Set();gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse(m=>{if(!m.isMesh)return;parts.push(m);resources.add(m.geometry);
        for(const mat of [m.material].flat()){resources.add(mat);for(const v of Object.values(mat))if(v?.isTexture)resources.add(v);}
      });
      try {
        if(parts.length!==1)throw Error('近景资源应为单个灯具网格');
        geometry=parts[0].geometry.clone().applyMatrix4(parts[0].matrixWorld);
        geometry.computeBoundingBox();geometry.computeBoundingSphere();
        if(geometry.boundingBox.isEmpty())throw Error('近景资源为空');
      } finally {for(const r of resources){r.dispose();if(r.isTexture)r.source?.data?.close?.();}}
      if(this.disposed||generation!==this.generation){geometry.dispose();return;}
      this.cache.set(kind,{geometry,mode,variants:new Map(),used:performance.now()});
      this.evict();
    } catch(error) {geometry?.dispose();if(generation===this.generation&&!this.disposed)this.failures.set(kind,String(error.message||error));}
    finally {this.pending=null;if(!this.disposed)this.notify();}
  }
  variant(kind,bounds) {
    const asset=this.cache.get(kind);asset.used=performance.now();
    const key=[...bounds.min.toArray(),...bounds.max.toArray()].map(v=>v.toPrecision(9)).join(',');
    if(!asset.variants.has(key)) {
      const source=asset.geometry.boundingBox,from=source.getSize(new THREE.Vector3()),to=bounds.getSize(new THREE.Vector3());
      // Uniform scale preserves proportions. Align the center and ground contact;
      // production and preview meshes keep the same source axes and UVs.
      const scale=Math.max(to.x,to.y,to.z)/Math.max(from.x,from.y,from.z);
      const a=source.getCenter(new THREE.Vector3()),b=bounds.getCenter(new THREE.Vector3());
      const matrix=new THREE.Matrix4().makeTranslation(b.x-scale*a.x,bounds.min.y-scale*source.min.y,b.z-scale*a.z)
        .multiply(new THREE.Matrix4().makeScale(scale,scale,scale));
      const geometry=asset.geometry.clone().applyMatrix4(matrix);geometry.computeBoundingBox();geometry.computeBoundingSphere();
      asset.variants.set(key,geometry);
    }
    return asset.variants.get(key);
  }
  recordFor(candidate) {
    const {mesh:source,kind,bounds}=candidate;
    let record=this.records.get(source);
    if(!record) {
      const mesh=new THREE.InstancedMesh(this.variant(kind,bounds),source.material,MAX_INSTANCES);
      mesh.name='NearLantern-'+this.mode+'-'+kind;mesh.userData.renderDynamic=true;mesh.userData.nearHalfKind=kind;mesh.userData.nearLanternMode=this.mode;
      mesh.castShadow=source.castShadow;mesh.receiveShadow=source.receiveShadow;mesh.renderOrder=source.renderOrder;
      mesh.layers.mask=source.layers.mask;mesh.count=0;mesh.visible=false;
      mesh.raycast=()=>{}; // Existing authored geometry remains the interaction target.
      source.add(mesh);record={mesh,source,kind,mode:this.mode,backup:new Float32Array(source.instanceMatrix.array.length)};
      this.records.set(source,record);
    }
    record.mesh.material=source.material;
    return record;
  }
  beforeRender(camera,now=performance.now()) {
    this.afterRender();for(const r of this.records.values())r.mesh.visible=false;
    this.active=0;this.triangles=0;this.replacedTriangles=0;
    if(this.mode==='current'||this.disposed)return;
    if(now-this.lastScan>500){this.descriptors=this.getBatches();this.lastScan=now;}
    camera.getWorldPosition(this.cameraPosition);const candidates=[];
    for(const item of this.descriptors) {
      const {mesh,bounds,kind}=item;if(!mesh.parent||!mesh.count||!visible(mesh))continue;
      mesh.updateWorldMatrix(true,false);
      for(let index=0;index<mesh.count;index++) {
        mesh.getMatrixAt(index,this.instance);this.world.multiplyMatrices(mesh.matrixWorld,this.instance);
        this.center.setFromMatrixPosition(this.world);
        const key=kind+':'+this.center.toArray().map(n=>n.toFixed(5)).join(',');
        this.box.copy(bounds).applyMatrix4(this.world);
        const distance=this.box.distanceToPoint(this.cameraPosition)/MAP_SCALE;
        if(distance<=NEAR_METERS*(this.previous.has(key)?1.15:1))candidates.push({...item,index,key,distance});
      }
    }
    candidates.sort((a,b)=>(a.distance*(this.previous.has(a.key)?.85:1))-(b.distance*(this.previous.has(b.key)?.85:1)));
    const chosen=candidates.slice(0,MAX_INSTANCES);this.wanted=new Set(chosen.map(c=>c.kind));
    const loading=chosen.find(c=>!this.cache.has(c.kind)&&!this.failures.has(c.kind));
    if(loading)void this.loadKind(loading.kind);
    this.previous=new Set(chosen.map(c=>c.key));const groups=new Map();
    for(const c of chosen)if(this.cache.has(c.kind)){
      if(!groups.has(c.mesh))groups.set(c.mesh,[]);groups.get(c.mesh).push(c);
    }
    for(const [source,items] of groups) {
      const r=this.recordFor(items[0]),mesh=r.mesh,excluded=new Set(items.map(c=>c.index));
      r.count=source.count;r.backup.set(source.instanceMatrix.array);
      items.forEach((c,i)=>{source.getMatrixAt(c.index,this.instance);mesh.setMatrixAt(i,this.instance);});
      mesh.count=items.length;mesh.visible=true;mesh.instanceMatrix.needsUpdate=true;
      mesh.computeBoundingBox();mesh.computeBoundingSphere();
      // Pack only this render's remaining light instances. Restore before any
      // animation, picking, LOD, statistics or lighting code runs again.
      let count=0;
      for(let i=0;i<r.count;i++)if(!excluded.has(i)){
        source.instanceMatrix.array.set(r.backup.subarray(i*16,i*16+16),count++*16);
      }
      source.count=count;source.instanceMatrix.needsUpdate=true;this.changed.push(r);
      this.active+=items.length;this.triangles+=items.length*(mesh.geometry.index?.count||mesh.geometry.attributes.position.count)/3;
      this.replacedTriangles+=items.length*(source.geometry.index?.count||source.geometry.attributes.position.count)/3;
    }
    this.evict();
    if(now-(this.lastNotify||0)>500){this.lastNotify=now;this.notify();}
  }
  afterRender() {
    for(const r of this.changed){r.source.count=r.count;r.source.instanceMatrix.array.set(r.backup);r.source.instanceMatrix.needsUpdate=true;}
    this.changed.length=0;
  }
  evict() {
    for(const [kind] of [...this.cache].sort((a,b)=>a[1].used-b[1].used)){
      if(this.cache.size<=(this.mode==='original'?2:MAX_CACHED_KINDS))break;
      if(this.wanted.has(kind))continue;
      this.release(kind);
    }
  }
  release(kind) {
    for(const [source,r] of this.records)if(r.kind===kind){r.mesh.removeFromParent();r.mesh.dispose();this.records.delete(source);}
    const entry=this.cache.get(kind);if(entry){entry.geometry.dispose();for(const g of entry.variants.values())g.dispose();this.cache.delete(kind);}
  }
  get stats() {return {mode:this.mode,nearMeters:NEAR_METERS,maxInstances:MAX_INSTANCES,active:this.active,
    triangles:this.triangles,replacedTriangles:this.replacedTriangles,retainedRatio:this.mode==='five'?.05:this.mode==='original'?1:null,cachedKinds:[...this.cache.keys()],loading:this.pending,errors:Object.fromEntries(this.failures)};}
  notify(){this.onChange(this.stats);}
  dispose(){this.afterRender();this.disposed=true;for(const kind of [...this.cache.keys()])this.release(kind);this.descriptors=[];this.previous.clear();}
}
