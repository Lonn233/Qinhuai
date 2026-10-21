import * as THREE from 'three';

// A bounded world-space irradiance volume. Rebuilt only when lighting changes;
// two filtered samples per surface, independent of the number of window strips.
export const VOLUME_SIZE = [192, 32, 192];
export const VOLUME_ENCODING = 4;
const smooth = t => { t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
export function spatialEmitterSample(x,y,z,e,p,out={}) {
 const dx=x-e.x,dz=z-e.z,forward=dx*e.nx+dz*e.nz;
 out.weight=0;
 if(p.distance<=0||p.decayDistance<=0||forward<-.25)return out;
 const side=dx*(-e.nz)+dz*e.nx,along=Math.max(-e.halfWidth,Math.min(e.halfWidth,side));
 const sx=e.x-e.nz*along,sz=e.z+e.nx*along,sy=e.y??13.5;
 const vx=sx-x,vy=sy-y,vz=sz-z,d=Math.hypot(vx,vy,vz);
 if(d>=p.distance)return out;
 const spread=.5+Math.max(0,forward)*Math.tan((p.angle??90)*Math.PI/360);
 const lateral=Math.hypot(Math.max(0,Math.abs(side)-e.halfWidth),Math.max(0,Math.abs(vy)-(e.halfHeight??.6)));
 const f=Math.max(.02,p.feather),fade=1-smooth((d/p.distance-(1-f))/f);
 out.weight=Math.max(0,Math.min(1,(forward+.25)/.25))*Math.exp(-d/p.decayDistance)*Math.exp(-.7*(lateral/spread)**2)*fade;
 const inv=1/Math.max(.001,d);out.x=vx*inv;out.y=vy*inv;out.z=vz*inv;
 return out;
}
export class EnvironmentVolume {
 constructor(size=VOLUME_SIZE){
  this.size=size;const n=size[0]*size[1]*size[2];
  this.radiance=new Uint8Array(n*4);this.direction=new Uint8Array(n*4);
  this.accum=new Float32Array(n*7);this.weights=new Float32Array(n);this.winners=new Uint32Array(n);
  const texture=data=>{const t=new THREE.Data3DTexture(data,...size);t.format=THREE.RGBAFormat;t.type=THREE.UnsignedByteType;t.minFilter=t.magFilter=THREE.LinearFilter;t.unpackAlignment=1;t.generateMipmaps=false;t.colorSpace=THREE.NoColorSpace;return t;};
  this.texture=texture(this.radiance);this.directionTexture=texture(this.direction);
  this.origin=new THREE.Vector3();this.span=new THREE.Vector3(1,48,1);this.updates=0;
  this.cache=new Map();this.cacheBytes=0;this.cacheLimit=32*1024*1024;this.kernelBuilds=0;
 }
 begin(bounds){this.origin.set(bounds.x,8,bounds.y);this.span.set(bounds.z,48,bounds.w);this.accum.fill(0);}
 addChannel({p,color,energy,emitters,cacheKey}){
  const signature=JSON.stringify([this.origin.toArray(),this.span.toArray(),p.distance,p.decayDistance,p.feather,p.angle??90,emitters.map(e=>[e.x,e.y??13.5,e.z,e.nx,e.nz,e.halfWidth,e.halfHeight??.6])]);
  const key=cacheKey??signature;let kernel=this.cache.get(key);
  if(kernel?.signature!==signature){
   kernel=this.buildKernel(emitters,p);kernel.signature=signature;
   if(this.cache.has(key)){this.cacheBytes-=this.cache.get(key).bytes;this.cache.delete(key);}
   while(this.cacheBytes+kernel.bytes>this.cacheLimit&&this.cache.size){const first=this.cache.keys().next().value;this.cacheBytes-=this.cache.get(first).bytes;this.cache.delete(first);}
   if(kernel.bytes<=this.cacheLimit){this.cache.set(key,kernel);this.cacheBytes+=kernel.bytes;}
  }
  const luminance=color.r*.2126+color.g*.7152+color.b*.0722,a=this.accum;
  for(let j=0;j<kernel.indices.length;j++){
   const k=kernel.indices[j]*7,d=j*4,power=kernel.values[d]*energy*p.intensity,l=power*luminance;
   a[k]+=color.r*power;a[k+1]+=color.g*power;a[k+2]+=color.b*power;
   a[k+3]+=kernel.values[d+1]*l;a[k+4]+=kernel.values[d+2]*l;a[k+5]+=kernel.values[d+3]*l;a[k+6]+=l;
  }
 }
 buildKernel(emitters,p){
  this.kernelBuilds++;
  const [nx,ny,nz]=this.size,o=this.origin,s=this.span,steps=[s.x/nx,s.y/ny,s.z/nz],dims=this.size,touched=[],sample={};
  for(let ei=0;ei<emitters.length;ei++){
   const e=emitters[ei],r=p.distance,ey=e.y??13.5;
   const ext=[Math.abs(e.nz)*e.halfWidth+r,r,Math.abs(e.nx)*e.halfWidth+r],center=[e.x,ey,e.z],origin=[o.x,o.y,o.z];
   const lo=center.map((v,j)=>Math.max(0,Math.floor((v-ext[j]-origin[j])/steps[j]))),hi=center.map((v,j)=>Math.min(dims[j]-1,Math.ceil((v+ext[j]-origin[j])/steps[j])));
   for(let iz=lo[2];iz<=hi[2];iz++)for(let iy=lo[1];iy<=hi[1];iy++)for(let ix=lo[0];ix<=hi[0];ix++){
    const i=(iz*ny+iy)*nx+ix;
    spatialEmitterSample(o.x+(ix+.5)*steps[0],o.y+(iy+.5)*steps[1],o.z+(iz+.5)*steps[2],e,p,sample);
    if(sample.weight<=this.weights[i])continue;
    if(!this.weights[i])touched.push(i);
    this.weights[i]=sample.weight;this.winners[i]=ei;
   }
  }
  const indices=Uint32Array.from(touched),values=new Float32Array(touched.length*4);
  for(let j=0;j<indices.length;j++){
   const i=indices[j],ix=i%nx,iy=Math.floor(i/nx)%ny,iz=Math.floor(i/(nx*ny));
   spatialEmitterSample(o.x+(ix+.5)*steps[0],o.y+(iy+.5)*steps[1],o.z+(iz+.5)*steps[2],emitters[this.winners[i]],p,sample);
   values.set([this.weights[i],sample.x,sample.y,sample.z],j*4);this.weights[i]=0;
  }
  return {indices,values,bytes:indices.byteLength+values.byteLength};
 }

 finish(){
  for(let i=0,j=0;i<this.accum.length;i+=7,j+=4){
   for(let c=0;c<3;c++){this.radiance[j+c]=Math.min(255,Math.round(this.accum[i+c]/VOLUME_ENCODING*255));this.direction[j+c]=Math.round((this.accum[i+6]?this.accum[i+3+c]/this.accum[i+6]:0)*127+128);}
   this.radiance[j+3]=255;this.direction[j+3]=255;
  }
  this.texture.needsUpdate=true;this.directionTexture.needsUpdate=true;this.updates++;
 }
 dispose(){this.texture.dispose();this.directionTexture.dispose();this.cache.clear();this.cacheBytes=0;}
}
