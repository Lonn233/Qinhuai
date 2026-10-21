import * as THREE from 'three';
import {REGION_GLSL} from './regions.mjs';
import {normalizeSpill} from './spill-profiles.mjs';

// Optional study-only surface irradiance, not a luminous shell or point-light
// array. The source material values/maps and original light shader stay intact.
export function createSoftSpill(root,manifest,field,{regionalPolicy=false,baseFields=new Map(),disposeField=true}={}){
 const active={value:0},tint={value:new THREE.Color('#e6ad65')};
 const originals=new Map(),materials=[];
 const parameters={spread:{value:new THREE.Vector3(.58,.13,.72)},falloff:{value:1},surface:{value:0},regionOn:{value:0},regionMin:{value:new THREE.Vector3()},regionMax:{value:new THREE.Vector3()},feather:{value:.1}};
 const modelMin=new THREE.Vector3(...(field.info.modelMin||field.info.min)),modelMax=new THREE.Vector3(...(field.info.modelMax||field.info.max)),extent=modelMax.clone().sub(modelMin);
 let configuration=normalizeSpill();
 function configure(value){
  configuration=normalizeSpill({...configuration,...value});const s=configuration;tint.value.set(s.color);parameters.spread.value.set(s.horizontal,s.up,s.down);parameters.falloff.value=s.falloff;parameters.surface.value={both:0,eaves:1,walls:2}[s.surface];
  let x=s.centerX/100,z=s.centerZ/100,w=s.width/100,d=s.depth/100;
  if(s.region==='front'){x=.5;z=.75;w=1;d=.5;}if(s.region==='back'){x=.5;z=.25;w=1;d=.5;}if(s.region==='left'){x=.25;z=.5;w=.5;d=1;}if(s.region==='right'){x=.75;z=.5;w=.5;d=1;}
  if(s.region==='all'){x=z=.5;w=d=1;}
  parameters.regionOn.value=(s.region==='all'&&s.minHeight===0&&s.maxHeight===100)?0:1;
  parameters.regionMin.value.copy(modelMin).add(new THREE.Vector3(Math.max(0,x-w/2)*extent.x,s.minHeight/100*extent.y,Math.max(0,z-d/2)*extent.z));
  parameters.regionMax.value.copy(modelMin).add(new THREE.Vector3(Math.min(1,x+w/2)*extent.x,s.maxHeight/100*extent.y,Math.min(1,z+d/2)*extent.z));
  parameters.feather.value=Math.max(.02,Math.min(extent.x*w,extent.z*d)*s.edge/100);
 }
 configure(configuration);
 const region=regionalPolicy?REGION_GLSL.replaceAll('bsRegion','ssRegion').replaceAll('bsCorridorEave','ssCorridorEave'):'float ssRegion(vec3 p){return 2.;} float ssCorridorEave(vec3 p){return 0.;}';
 root.traverse(mesh=>{
  if(!mesh.isMesh)return;
  originals.set(mesh,mesh.material);
  const isRoof=manifest.rules.some(r=>r.node===mesh.name&&r.role==='roof');
  const baseField=baseFields.get(mesh.name);
  const existingBounce=baseField?.info.channels===2;
  const convert=original=>{
   const material=original.clone();materials.push(material);
   const previousCompile=original.onBeforeCompile,previousKey=original.customProgramCacheKey();
   material.onBeforeCompile=shader=>{
    previousCompile.call(original,shader);
    Object.assign(shader.uniforms,{ssActive:active,ssTint:tint,ssSpread:parameters.spread,ssFalloff:parameters.falloff,ssSurface:parameters.surface,ssRegionOn:parameters.regionOn,ssRegionMin:parameters.regionMin,ssRegionMax:parameters.regionMax,ssFeather:parameters.feather,ssField:{value:field.texture},ssMin:{value:new THREE.Vector3(...field.info.min)},ssSize:{value:new THREE.Vector3(...field.info.max).sub(new THREE.Vector3(...field.info.min))}});
    // Preserve existing shaders while also illuminating unclassified wall meshes.
    shader.vertexShader='varying vec3 vSsWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvSsWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
    shader.fragmentShader=`varying vec3 vSsWorld; uniform float ssActive; uniform vec3 ssTint; uniform highp sampler3D ssField; uniform vec3 ssMin; uniform vec3 ssSize; uniform vec3 ssSpread; uniform float ssFalloff; uniform float ssSurface; uniform float ssRegionOn; uniform vec3 ssRegionMin; uniform vec3 ssRegionMax; uniform float ssFeather; ${region}\n`+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
     // An additive diffuse response on the actual surface, before tone mapping.
     if(ssActive>.0){
      vec3 ssUv=(vSsWorld-ssMin)/ssSize;
      float ssInside=float(all(greaterThanEqual(ssUv,vec3(0.)))&&all(lessThanEqual(ssUv,vec3(1.))));
      vec4 ssSample=texture(ssField,clamp(ssUv,0.,1.));
      ${field.info.encoding==='offset-rgba16f'?`vec3 ssDelta=ssSample.xyz;float ssVertical=ssDelta.y/max(ssDelta.y>0.?ssSpread.y:ssSpread.z,.01);
      float ssAmount=exp(-.5*(dot(ssDelta.xz,ssDelta.xz)/(ssSpread.x*ssSpread.x)+ssVertical*ssVertical))*ssInside;`:'float ssAmount=ssSample.r*ssInside;'}
      ssAmount=pow(max(0.,ssAmount),ssFalloff);
      if(ssRegionOn>.5){
       vec3 ssLow=smoothstep(ssRegionMin-vec3(ssFeather),ssRegionMin+vec3(ssFeather),vSsWorld);
       vec3 ssHigh=vec3(1.)-smoothstep(ssRegionMax-vec3(ssFeather),ssRegionMax+vec3(ssFeather),vSsWorld);
       ssAmount*=ssLow.x*ssLow.y*ssLow.z*ssHigh.x*ssHigh.y*ssHigh.z;
      }
      ${existingBounce?'ssAmount=max(0.,ssAmount-texture(bsField,clamp((vSsWorld-bsMin)/bsSize,0.,1.)).g);':''}
      vec3 ssNormal=normalize(inverseTransformDirection(nonPerturbedNormal,viewMatrix));
      float ssFacing=1.-smoothstep(-.04,.45,ssNormal.y);
      if(ssSurface>.5&&ssSurface<1.5)ssFacing*=1.-smoothstep(-.30,-.02,ssNormal.y);
      if(ssSurface>1.5)ssFacing*=1.-smoothstep(.35,.8,abs(ssNormal.y));
      float ssPolicy=ssRegion(vSsWorld);
      if(ssPolicy==0.)ssAmount=0.;
      if(ssPolicy==1.)ssAmount*=${isRoof?'ssCorridorEave(vSsWorld)':'0.'};
      float ssLuma=dot(max(diffuseColor.rgb,vec3(0.)),vec3(.2126,.7152,.0722));
      vec3 ssResponse=mix(vec3(.55),clamp(diffuseColor.rgb,vec3(0.),vec3(1.)),.45);
      outgoingLight+=ssTint*ssResponse*ssAmount*ssFacing*ssActive*mix(.45,1.,sqrt(clamp(ssLuma,0.,1.)));
     }
     #include <opaque_fragment>
    `);
   };
   material.customProgramCacheKey=()=>previousKey+'-soft-spill-v2-'+field.info.encoding+'-'+regionalPolicy+'-'+isRoof+'-'+existingBounce;
   return material;
  };
  mesh.material=Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material);
 });
 return {materials,active,parameters,configure,get settings(){return {...configuration};},apply(on,master=true){active.value=(on&&master)? configuration.intensity : 0;},dispose(){for(const [mesh,original] of originals)mesh.material=original;materials.forEach(m=>m.dispose());originals.clear();if(disposeField)field.texture.dispose();}};
}

export async function loadSoftSpill(base){
 const res=await fetch(new URL('soft-spill-v2.json',base));if(!res.ok)throw new Error('柔光清单 HTTP '+res.status);const info=await res.json();
 if(!Array.isArray(info.size)||info.size.length!==3||info.size.some(n=>!Number.isInteger(n)||n<1))throw new Error('柔光尺寸无效');
 const dataRes=await fetch(new URL(info.file,base));if(!dataRes.ok)throw new Error('柔光数据 HTTP '+dataRes.status);
 const bytes=new Uint8Array(await dataRes.arrayBuffer());const offset=info.encoding==='offset-rgba16f';if(bytes.length!==info.size.reduce((a,b)=>a*b,1)*(offset?8:1))throw new Error('柔光数据不完整');
 const texture=new THREE.Data3DTexture(offset?new Uint16Array(bytes.buffer):bytes,...info.size);texture.format=offset?THREE.RGBAFormat:THREE.RedFormat;texture.type=offset?THREE.HalfFloatType:THREE.UnsignedByteType;texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.wrapS=texture.wrapT=texture.wrapR=THREE.ClampToEdgeWrapping;texture.unpackAlignment=1;texture.generateMipmaps=false;texture.needsUpdate=true;
 return {texture,info};
}
