import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import layout from './assets/red-lantern/layout.json' with {type:'json'};
import {normalizeRedLantern,readRedLantern,temperatureRGB} from './red-lantern-settings.mjs';
const SCALE=layout.mapUnitsPerMeter;
const colorAt=k=>{const [r,g,b]=temperatureRGB(k);return new THREE.Color().setRGB(r,g,b,THREE.SRGBColorSpace);};
function receiverGeometry(mesh,lamps){
 const source=mesh.geometry,position=source.getAttribute('position'),normal=source.getAttribute('normal'),uv=source.getAttribute('uv'),index=source.index;
 const out=new THREE.BufferGeometry(),arrays={position:[],normal:[],uv:[]},vertices=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()],box=new THREE.Box3();
 const groups=source.groups.length?source.groups:[{start:0,count:index?index.count:position.count,materialIndex:0}];
 for(const group of groups){const start=arrays.position.length/3;
  for(let offset=group.start;offset<group.start+group.count;offset+=3){const ids=[0,1,2].map(k=>index?index.getX(offset+k):offset+k);vertices.forEach((v,k)=>v.fromBufferAttribute(position,ids[k]).applyMatrix4(mesh.matrixWorld));box.setFromPoints(vertices);if(!lamps.some(p=>box.distanceToPoint(p)<=3*SCALE))continue;
   for(const id of ids){arrays.position.push(position.getX(id),position.getY(id),position.getZ(id));arrays.normal.push(normal?.getX(id)??0,normal?.getY(id)??1,normal?.getZ(id)??0);arrays.uv.push(uv?.getX(id)??0,uv?.getY(id)??0);}
  }
  const count=arrays.position.length/3-start;if(count)out.addGroup(start,count,group.materialIndex);
 }
 if(!arrays.position.length)return null;
 for(const [name,size] of [['position',3],['normal',3],['uv',2]])out.setAttribute(name,new THREE.Float32BufferAttribute(arrays[name],size));out.computeBoundingSphere();return out;
}
// Geometry/materials of the city are read-only. Surface response is a separate,
// depth-tested additive pass on only the explicit Ma61 receiver allowlist.
export class RedLanternLayer{
 constructor(parent){this.parent=parent;this.root=new THREE.Group();this.root.name='RedLanternOverlay';parent.add(this.root);this.settings=readRedLantern();this.tiles=new Set();this.materials=[];this.batches=[];this.receivers=[];this.groups=[];this.night=true;this.wireframe=false;this.disposed=false;this.stats={lamps:0,batches:0,receivers:0};}
 async load(){
  if(!this.promise)this.promise=new GLTFLoader().loadAsync(new URL('./assets/red-lantern/red-lantern-pendant.glb',location.href).href).then(gltf=>{this.source=gltf.scene;this.source.updateMatrixWorld(true);return this.source;}).catch(error=>{this.promise=null;throw error;});
  return this.promise;
 }
 supportsBuilding(id){return layout.groups.some(g=>'matou-'+g.id===id);}
 setBuildingSettings(id,value){this.buildingSettings??={};this.buildingSettings[id]=value?.redLanterns?.enabled!==false;this.configure(this.settings);}
 loadBuildingSettings(record={}){this.buildingSettings={};for(const [id,value] of Object.entries(record))this.buildingSettings[id]=value?.redLanterns?.enabled!==false;this.configure(this.settings);}
 async registerTile(tile,object,{groupId}={}){
  const key=groupId||String(tile);if(this.tiles.has(key)||this.disposed)return;
  const specs=layout.groups.filter(g=>g.tile===Number(tile)&&(!groupId||g.id===groupId));if(!specs.length)return;
  const source=await this.load();if(this.disposed||this.tiles.has(key))return;
  object.updateMatrixWorld(true);
  for(const spec of specs){
   const points=layout.placements.filter(p=>p.group===spec.id);if(!points.length)continue;
   const group=new THREE.Group();group.name='RedPendants-'+spec.id;this.root.add(group);const receivers=[];
   source.traverse(mesh=>{if(!mesh.isMesh)return;
    const convert=m=>{const copy=m.clone();copy.metalness=m.name==='DarkBronzeRod'?.65:0;copy.roughness=.72;
     if(m.name==='RedLanternFabric'){copy.emissiveMap=copy.map;copy.emissive.set('#ffffff');copy.emissiveIntensity=0;copy.userData.redFabric=true;}
     this.materials.push(copy);return copy;};
    const material=Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material);
    const batch=new THREE.InstancedMesh(mesh.geometry,material,points.length);batch.name=mesh.name+'-'+spec.id;const transform=new THREE.Matrix4(),rotation=new THREE.Quaternion();
    for(let i=0;i<points.length;i++){const p=points[i];rotation.setFromAxisAngle(new THREE.Vector3(0,1,0),p.rotation*Math.PI/180);transform.compose(new THREE.Vector3(...p.mount),rotation,new THREE.Vector3(SCALE,SCALE,SCALE)).multiply(mesh.matrixWorld);batch.setMatrixAt(i,transform);}
    batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();group.add(batch);this.batches.push(batch);
   });
   const supported=points.filter(p=>p.eaveAnchor);
   if(supported.length){
    const geometry=new THREE.CylinderGeometry(.009*SCALE,.009*SCALE,1,8);
    const material=new THREE.MeshStandardMaterial({color:0x30241b,metalness:.65,roughness:.72});
    const brackets=new THREE.InstancedMesh(geometry,material,supported.length*2);brackets.name='UpperEaveSupports';brackets.userData.ownedGeometry=true;
    supported.forEach((p,i)=>{const a=new THREE.Vector3(...p.eaveAnchor).add(new THREE.Vector3(0,-.009,0)),b=new THREE.Vector3(...p.mount),delta=b.clone().sub(a);const matrix=new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize()),new THREE.Vector3(1,delta.length(),1));brackets.setMatrixAt(i*2,matrix);const pin=new THREE.Matrix4().compose(new THREE.Vector3(...p.eaveAnchor).add(new THREE.Vector3(0,-.0045,0)),new THREE.Quaternion(),new THREE.Vector3(.3,.009,.3));brackets.setMatrixAt(i*2+1,pin);});
    brackets.instanceMatrix.needsUpdate=true;brackets.computeBoundingSphere();group.add(brackets);this.batches.push(brackets);this.materials.push(material);
   }
   const lampPositions=points.map(p=>new THREE.Vector3(p.mount[0],p.mount[1]-.40*SCALE,p.mount[2]));
   const halo=this.createHalo(lampPositions);group.add(halo);
   const uniforms={power:{value:0},tint:{value:new THREE.Color()},reach:{value:1},eaves:{value:1},walls:{value:1},minX:{value:spec.minX??-1e8},lamps:{value:lampPositions}};
   const allowed=new Set(spec.nodes),meshes=[];object.traverse(mesh=>{if(mesh.isMesh&&allowed.has(mesh.name))meshes.push(mesh);});
   for(const mesh of meshes){
    // Each receiver uses the exact same vertices/UVs. Offset in depth only to
    // avoid z-fighting; never mutate the base material or its shader chain.
    const geometry=receiverGeometry(mesh,lampPositions);if(!geometry)continue;
    const srcMaterials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    const converted=srcMaterials.map(base=>new THREE.ShaderMaterial({uniforms:{...uniforms,paint:{value:base.map||null},hasPaint:{value:base.map?1:0},baseColor:{value:base.color?.clone()||new THREE.Color('#ffffff')}},vertexShader:`varying vec3 wPos;varying vec3 wNormal;varying vec2 texUv;void main(){vec4 world=modelMatrix*vec4(position,1.);wPos=world.xyz;wNormal=normalize(mat3(modelMatrix)*normal);texUv=uv;gl_Position=projectionMatrix*viewMatrix*world;}`,fragmentShader:`precision highp float;varying vec3 wPos;varying vec3 wNormal;varying vec2 texUv;uniform float power,reach,eaves,walls,minX,hasPaint;uniform vec3 tint,baseColor;uniform sampler2D paint;uniform vec3 lamps[${points.length}];void main(){if(power<=0.||wPos.x<minX)discard;vec3 n=normalize(wNormal);float underside=1.-smoothstep(-.45,-.05,n.y);float wall=1.-smoothstep(.25,.65,abs(n.y));float surface=max(underside*eaves,wall*walls);if(surface<.001)discard;float amount=0.;for(int i=0;i<${points.length};i++){vec3 delta=lamps[i]-wPos;float distance=length(delta);float facing=max(0.,dot(n,delta/max(distance,.0001)));float falloff=pow(max(0.,1.-distance/reach),2.);amount+=falloff*(.3+.7*facing);}vec3 albedo=baseColor;if(hasPaint>.5)albedo*=texture2D(paint,texUv).rgb;vec3 response=mix(vec3(.25),sqrt(max(albedo,vec3(0.))),.75);gl_FragColor=vec4(tint*response*min(amount,1.5)*surface*power,1.);}`,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:THREE.FrontSide,toneMapped:false}));
    const receiver=new THREE.Mesh(geometry,Array.isArray(mesh.material)?converted:converted[0]);receiver.name='RedLanternReceiver';receiver.renderOrder=3;receiver.frustumCulled=mesh.frustumCulled;mesh.add(receiver);this.receivers.push(receiver);receivers.push(receiver);this.materials.push(...converted);
   }
   this.groups.push({group,uniforms,halo,points,receivers,buildingId:'matou-'+spec.id});this.stats.lamps+=points.length;
  }
  this.tiles.add(key);this.stats.batches=this.batches.length+this.groups.length;this.stats.receivers=this.receivers.length;this.configure(this.settings);
 }
 createHalo(positions){
  const material=new THREE.ShaderMaterial({uniforms:{power:{value:0},tint:{value:new THREE.Color('#ff5030')}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);center.xy+=position.xy*length(instanceMatrix[0].xyz);gl_Position=projectionMatrix*center;}`,fragmentShader:`varying vec2 vUv;uniform vec3 tint;uniform float power;void main(){float r=length(vUv-.5)*2.;float glow=exp(-r*r*5.)*pow(max(0.,1.-r),2.);gl_FragColor=vec4(tint,glow*power);}`,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false});
  const halo=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),material,positions.length);halo.name='RedLanternSoftHalos';const matrix=new THREE.Matrix4();positions.forEach((p,i)=>{matrix.makeScale(.65,.65,.65);matrix.setPosition(p);halo.setMatrixAt(i,matrix);});halo.computeBoundingSphere();halo.renderOrder=4;this.materials.push(material);return halo;
 }
 configure(value){this.settings=normalizeRedLantern(value);const s=this.settings,active=this.night&&!this.wireframe&&s.enabled;const white=colorAt(s.temperature),warm=white.clone().multiply(new THREE.Color('#ff7950'));
  for(const material of this.materials)if(material.userData.redFabric){material.emissive.copy(white);material.emissiveIntensity=active?s.brightness*.85:0;}
  for(const {uniforms,halo} of this.groups){uniforms.power.value=active?s.brightness*.28:0;uniforms.tint.value.copy(warm);uniforms.reach.value=s.spillRange*SCALE;uniforms.eaves.value=s.lightEaves?1:0;uniforms.walls.value=s.lightWalls?1:0;halo.material.uniforms.power.value=active?s.halo*s.brightness*.28:0;halo.material.uniforms.tint.value.copy(warm);halo.visible=active&&s.halo>0;}
  for(const {group,buildingId,receivers} of this.groups){const enabled=this.buildingSettings?.[buildingId]!==false;group.visible=enabled;for(const receiver of receivers)receiver.visible=enabled&&active&&(s.lightEaves||s.lightWalls)&&s.brightness>0;}
  for(const batch of this.batches)for(const material of Array.isArray(batch.material)?batch.material:[batch.material])material.wireframe=this.wireframe;
 }
 setState({night=this.night,wireframe=this.wireframe}={}){this.night=night;this.wireframe=wireframe;this.configure(this.settings);}
 dispose(){this.disposed=true;this.root.removeFromParent();for(const receiver of this.receivers){receiver.removeFromParent();receiver.geometry.dispose();}this.materials.forEach(m=>m.dispose());this.groups.forEach(g=>g.halo.geometry.dispose());this.batches.forEach(b=>{if(b.userData.ownedGeometry)b.geometry.dispose();b.dispose();});this.groups.forEach(g=>g.halo.dispose());const cleanup=()=>{const resources=new Set();this.source?.traverse(o=>{if(o.isMesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){resources.add(m);Object.values(m).forEach(v=>{if(v?.isTexture)resources.add(v);});}}});resources.forEach(r=>r.dispose());};if(this.source)cleanup();else this.promise?.then(cleanup).catch(()=>{});}
}
