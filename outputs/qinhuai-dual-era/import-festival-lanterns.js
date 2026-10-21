import * as THREE from 'three';
import {groundControls,applyGroundControls,waterControls,applyWaterControls,WATER_UNIFORMS} from './import-light-effects.mjs';
import {normalizeMapLights} from './import-light-controls.mjs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clothMaterial} from './game/lion-study/cloth-material.js';
import {presets} from './game/lion-study/lighting-presets.js';
import {DEFAULT_LIGHTS} from './game/lion-study/defaults.cjs';
import layout from './assets/qinhuai-modern-import/festival/layout.json' with {type:'json'};

export const FESTIVAL_LAYOUT = layout;
export const MAP_UNITS_PER_METER = layout.mapUnitsPerMeter;
export const FESTIVAL_PLACEMENTS = layout.placements;
const ASSETS = new URL('./assets/qinhuai-modern-import/festival/', import.meta.url);
export const WATER_KINDS = new Set(['lotus-main','lotus-one','chrysanthemum']);
export function lightingFor(kind) {
  // Both lotus shapes use the confirmed lotus tuning. The new chrysanthemum has
  // no saved studio preset yet; explicitly inherit lotus rather than invent one.
  const key = WATER_KINDS.has(kind) ? 'lotus' : kind;
  const light = DEFAULT_LIGHTS[key];
  return {...light, shape: presets.find(p => p.name === light.base).shape, inherited: kind === 'chrysanthemum'};
}
export function pointInWater(x,z) {
  return layout.water.triangles.some(([a,b,c]) => {
    const cross=(p,q)=>(q[0]-p[0])*(z-p[1])-(q[1]-p[1])*(x-p[0]);
    if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))<1e-9)return false;
    const u=cross(a,b),v=cross(b,c),w=cross(c,a);
    return !((u < -1e-7 || v < -1e-7 || w < -1e-7) && (u > 1e-7 || v > 1e-7 || w > 1e-7));
  });
}
export function waterClearance(p, radius=.6) {
  return pointInWater(p.x,p.z) && Array.from({length:32},(_,i)=>i*Math.PI/16)
    .every(a=>pointInWater(p.x+Math.cos(a)*radius,p.z+Math.sin(a)*radius));
}
export function mountainSettings(input={}) {
  const finite=(value,fallback)=>Number.isFinite(Number(value)) ? Number(value) : fallback;
  // Even at 15 m, its bounding circle remains inside the surveyed vacant plot.
  return {sizeMeters:THREE.MathUtils.clamp(finite(input.sizeMeters,13),8,15),
    rotation:THREE.MathUtils.euclideanModulo(finite(input.rotation,180),360)};
}
export function reflectionMaterial(source, uniforms, mask, water) {
  return new THREE.ShaderMaterial({
    uniforms: {map:{value:source.map}, tint:uniforms.uClothTint, power:uniforms.uClothPower,
      ...water, waterY:{value:layout.water.height+.009}, waterMask:{value:mask}, time:{value:0}},
    vertexShader: `${WATER_UNIFORMS}
varying vec2 vUv; varying vec2 vWater; varying float vHeight;
      uniform float waterY; uniform float time;
      void main(){
        vUv=uv;
        vec4 world=modelMatrix*instanceMatrix*vec4(position,1.);
        vHeight=max(0.,world.y-waterY);
        vec3 mirrored=world.xyz; mirrored.y=2.*waterY-world.y;
        float denominator=mirrored.y-cameraPosition.y;
        float t=(waterY-cameraPosition.y)/min(denominator,-.0001);
        vec3 projected=mix(cameraPosition,mirrored,clamp(t,0.,1.));
        vec4 center=modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
        vec3 mirrorCenter=vec3(center.x,2.*waterY-center.y,center.z);
        float centerT=(waterY-cameraPosition.y)/min(mirrorCenter.y-cameraPosition.y,-.0001);
        vec3 anchor=mix(cameraPosition,mirrorCenter,clamp(centerT,0.,1.));
        vec2 ray=cameraPosition.xz-center.xz; ray=length(ray)>.0001?normalize(ray):vec2(0.,1.);
        vec2 side=vec2(ray.y,-ray.x),delta=projected.xz-anchor.xz;
        projected.xz=anchor.xz+side*dot(delta,side)*mapWaterWidth+ray*dot(delta,ray)*mapWaterLength;
        projected.x+=sin(projected.z*62.+time*1.6*mapWaterSpeed)*.008*mapWaterRipple;
        projected.y=waterY;
        vWater=projected.xz;
        gl_Position=projectionMatrix*viewMatrix*vec4(projected,1.);
      }`,
    fragmentShader: `${WATER_UNIFORMS}
uniform sampler2D map; uniform sampler2D waterMask;
      uniform vec3 tint; uniform float power; uniform float time;
      varying vec2 vUv; varying vec2 vWater; varying float vHeight;
      void main(){
        vec2 maskUv=(vWater-vec2(-21.,-12.))/vec2(63.,19.);
        if(any(lessThan(maskUv,vec2(0.)))||any(greaterThan(maskUv,vec2(1.))))discard;
        if(texture2D(waterMask,maskUv).r<.9)discard;
        vec4 paint=texture2D(map,vUv);
        float wave=sin(vWater.y*95.+sin(vWater.x*28.)+time*1.2*mapWaterSpeed);
        float ripple=1.-min(.95,.35*mapWaterRipple)*(1.-wave);
        float fade=exp(-vHeight*5.*mapWaterFade)*ripple*.22*min(power,1.4)*mapWaterIntensity;
        gl_FragColor=vec4(paint.rgb*tint*.8,min(.95,fade*paint.a));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent:true,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,
    polygonOffsetFactor:-1,polygonOffsetUnits:-1,
  });
}

// Broad, soft ground bounce: two instanced draws, no added real-time lights.
function groundSpillMaterial(uniforms, ground) {
  return new THREE.ShaderMaterial({
    uniforms:{power:uniforms.uClothPower,tint:uniforms.uClothTint,...ground},
    vertexShader:`varying vec2 vUv; uniform float mapGroundRadius; uniform float mapGroundStretch;
      void main(){vUv=uv;vec3 localPosition=position;localPosition.xz*=mapGroundRadius;localPosition.z*=mapGroundStretch;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(localPosition,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float power;uniform vec3 tint;uniform float mapGroundIntensity;uniform float mapGroundFalloff;
      void main(){float r=length(vUv-.5)*2.;float fade=exp(-r*r*4.*mapGroundFalloff)*(1.-smoothstep(.6,1.,r));
        gl_FragColor=vec4(vec3(.8,.47,.16)*tint,fade*.17*power*mapGroundIntensity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,
  });
}

export class ImportFestivalLanterns {
  constructor(parent,{load=kind=>new GLTFLoader().loadAsync(new URL(`${kind}-low.glb`,ASSETS).href),
    loadMask=()=>new THREE.TextureLoader().loadAsync(new URL('water-mask.png',ASSETS).href)}={}) {
    this.root=new THREE.Group();this.root.name='Festival lanterns - study defaults';parent.add(this.root);
    this.waterRoot=new THREE.Group();this.waterRoot.name='River-only floating lanterns';this.root.add(this.waterRoot);
    this.load=load;this.loadMask=loadMask;this.entries=new Map();this.pending=new Map();this.tiles=new Map();
    this.mapLightSettings=normalizeMapLights();
    this.groundLights={lion:groundControls(),mountain:groundControls()};
    this.waterLights={lotus:waterControls(),chrysanthemum:waterControls()};
    this.night=false;this.wireframe=false;this.disposed=false;this.waterVisible=true;
    this.mountain=mountainSettings();this.errors=new Map();
  }
  setMapLightSettings(settings) {
    const p=normalizeMapLights(settings);
    this.mapLightSettings=p;
    for(const [kind,u] of Object.entries(this.groundLights))applyGroundControls(u,p,kind);
    for(const [kind,u] of Object.entries(this.waterLights))applyWaterControls(u,p,kind);
  }
  async prepare(kind) {
    if(this.entries.has(kind))return this.entries.get(kind);
    if(this.pending.has(kind))return this.pending.get(kind);
    const promise=(async()=>{
      const gltf=await this.load(kind);const object=gltf.scene;object.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(object),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
      const scale=1/Math.max(size.x,size.z);
      const normalization=new THREE.Matrix4().makeScale(scale,scale,scale)
        .multiply(new THREE.Matrix4().makeTranslation(-center.x,-box.min.y,-center.z));
      const tuning=lightingFor(kind),uniforms={uClothPower:{value:this.night&&!this.wireframe?tuning.power:0},
        uClothTint:{value:new THREE.Color(tuning.color)},uClothShape:{value:tuning.shape}};
      const resources=new Set(),parts=[],materials=new Map();
      object.traverse(mesh=>{
        if(!mesh.isMesh)return;
        const geometry=mesh.geometry.clone().applyMatrix4(normalization.clone().multiply(mesh.matrixWorld));resources.add(geometry);
        const convert=source=>{
          if(materials.has(source))return materials.get(source);
          const mat=clothMaterial(source,uniforms);mat.wireframe=this.wireframe;
          mat.envMapIntensity=.2;resources.add(mat);
          Object.values(source).forEach(v=>{if(v?.isTexture)resources.add(v);});
          materials.set(source,mat);return mat;
        };
        parts.push({geometry,material:Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material)});
      });
      const sourceResources=new Set();object.traverse(mesh=>{if(mesh.isMesh){sourceResources.add(mesh.geometry);[mesh.material].flat().forEach(m=>sourceResources.add(m));}});
      sourceResources.forEach(r=>r.dispose());
      const entry={kind,parts,resources,uniforms,tuning,batches:[],reflectionMaterials:[]};
      if(this.disposed){this.disposeEntry(entry);return null;}
      this.entries.set(kind,entry);return entry;
    })().finally(()=>this.pending.delete(kind));
    this.pending.set(kind,promise);return promise;
  }
  async registerTile(tile) {
    const plans=FESTIVAL_PLACEMENTS.filter(p=>p.tile===tile);if(!plans.length||this.disposed)return;
    if(this.tiles.has(tile))return this.tiles.get(tile);
    const task=(async()=>{
      // Only load water assets after the source water tile is present.
      if(plans.some(p=>WATER_KINDS.has(p.kind))&&!this.mask){
        const mask=await this.loadMask();if(this.disposed){mask.dispose();return;}
        mask.colorSpace=THREE.NoColorSpace;this.mask=mask;
      }
      for(const kind of new Set(plans.map(p=>p.kind))){
        if(this.disposed)return;
        const entry=await this.prepare(kind);if(!entry||entry.batches.length)continue;
        const placements=plans.filter(p=>p.kind===kind);
        if(WATER_KINDS.has(kind)&&placements.some(p=>!waterClearance(p)))throw Error('水灯超出真实河道边界');
        for(const part of entry.parts){
          const mesh=new THREE.InstancedMesh(part.geometry,part.material,placements.length);
          mesh.name=`festival-${kind}`;mesh.castShadow=false;mesh.receiveShadow=false;
          mesh.userData.festivalKind=kind;entry.batches.push({mesh,placements});
          (WATER_KINDS.has(kind)?this.waterRoot:this.root).add(mesh);
          if(WATER_KINDS.has(kind)){
            const mats=[part.material].flat().map(m=>reflectionMaterial(m,entry.uniforms,this.mask,this.waterLights[kind==='chrysanthemum'?'chrysanthemum':'lotus']));
            entry.reflectionMaterials.push(...mats);mats.forEach(m=>entry.resources.add(m));
            const reflection=new THREE.InstancedMesh(part.geometry,Array.isArray(part.material)?mats:mats[0],placements.length);
            reflection.name=`water-reflection-${kind}`;reflection.userData.festivalReflection=true;
            // Projected reflections extend beyond the original GLB bounds.
            reflection.frustumCulled=false;entry.batches.push({mesh:reflection,placements});this.waterRoot.add(reflection);
          }
        }
        if(!WATER_KINDS.has(kind)){
          const geometry=new THREE.PlaneGeometry(1.7,1.7);geometry.rotateX(-Math.PI/2);
          const material=groundSpillMaterial(entry.uniforms,this.groundLights[kind]);
          entry.resources.add(geometry);entry.resources.add(material);
          const mesh=new THREE.InstancedMesh(geometry,material,placements.length);
          mesh.name=`festival-ground-bounce-${kind}`;mesh.userData.festivalSpill=true;mesh.frustumCulled=false;
          entry.batches.push({mesh,placements});this.root.add(mesh);
        }
        this.updateMatrices(entry);
      }
      this.errors.delete(tile);this.setState();
    })().catch(error=>{this.tiles.delete(tile);this.errors.set(tile,String(error.message||error));throw error;});
    this.tiles.set(tile,task);return task;
  }
  updateMatrices(entry) {
    const dummy=new THREE.Object3D();
    for(const {mesh,placements} of entry.batches){
      placements.forEach((p,i)=>{
        const size=entry.kind==='mountain'?this.mountain.sizeMeters:p.sizeMeters;
        const rotation=entry.kind==='mountain'?THREE.MathUtils.degToRad(this.mountain.rotation):p.rotation;
        dummy.position.set(p.x,p.y+(mesh.userData.festivalSpill ? .008 : 0),p.z);dummy.rotation.set(0,rotation,0);
        dummy.scale.setScalar(size*MAP_UNITS_PER_METER);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();
    }
  }
  setMountain(input) {this.mountain=mountainSettings(input);const entry=this.entries.get('mountain');if(entry)this.updateMatrices(entry);return {...this.mountain};}
  setState({night=this.night,wireframe=this.wireframe,waterVisible=this.waterVisible}={}) {
    this.night=night;this.wireframe=wireframe;this.waterVisible=waterVisible;this.waterRoot.visible=waterVisible;
    for(const entry of this.entries.values()){
      entry.uniforms.uClothPower.value=night&&!wireframe?entry.tuning.power:0;
      for(const part of entry.parts)for(const m of [part.material].flat())m.wireframe=wireframe;
      for(const {mesh} of entry.batches)if(mesh.userData.festivalReflection||mesh.userData.festivalSpill)mesh.visible=night&&!wireframe;
    }
  }
  update(time) {if(this.night&&this.waterVisible)for(const e of this.entries.values())for(const m of e.reflectionMaterials)m.uniforms.time.value=time;}
  get stats(){return {lamps:[...this.entries.values()].reduce((n,e)=>n+(e.batches[0]?.placements.length||0),0),
    batches:[...this.entries.values()].reduce((n,e)=>n+e.batches.length,0),
    kinds:[...this.entries.keys()],errors:Object.fromEntries(this.errors),mountain:{...this.mountain},night:this.night};}
  disposeEntry(entry){for(const {mesh} of entry.batches){mesh.removeFromParent();mesh.dispose();}for(const r of entry.resources){r.dispose();if(r.isTexture)r.source?.data?.close?.();}}
  dispose(){this.disposed=true;this.root.removeFromParent();for(const e of this.entries.values())this.disposeEntry(e);this.entries.clear();this.mask?.dispose();this.root.clear();this.tiles.clear();}
}
