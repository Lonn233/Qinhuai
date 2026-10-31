import {WINDOW_LIGHT_GLSL,normalizeWindowLight,windowMaskReference,windowFloorSettings,windowFloorForRule} from './window-light.mjs';
import * as THREE from 'three';
import {normalizeSettings} from './profiles.mjs';
import {REGION_GLSL} from './regions.mjs';
function maskReference(texture){
 const image=texture?.image;if(!image)return 1;
 if(image.data)return windowMaskReference(image);
 if(typeof document==='undefined')return 1;
 const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
 const context=canvas.getContext('2d',{willReadFrequently:true});
 if(!context)return 1;
 try{context.drawImage(image,0,0);return windowMaskReference(context.getImageData(0,0,canvas.width,canvas.height));}catch{return 1;}
}
// Uses the measured eave/ridge distance volumes from the imported city. All
// emission stays on source materials; no duplicate luminous roof geometry.
export function createBuildingLighting(root,manifest,fields,masks,{regionalPolicy=true,mode='default'}={}){
 const isMatou=mode==='matou',isTower=mode==='tower0369';
 const regionGLSL=regionalPolicy?REGION_GLSL:`float bsRegion(vec3 p){return 2.;} float bsCorridorEave(vec3 p){return 0.;}`;
 const uniforms={tint:{value:new THREE.Color()},roofTint:{value:new THREE.Color()},levels:{value:new THREE.Vector4()},width:{value:1.4},shape:{value:new THREE.Vector4(1,0,0,.85)},retention:{value:1},sign:{value:0},facadeTint:{value:new THREE.Color()},windowTint:{value:new THREE.Color()},trimTint:{value:new THREE.Color()}};
 const createWindowUniforms=()=>({wlState:{value:new THREE.Vector4(1,1,0,0)},wlColor:{value:new THREE.Color()},wlBeam:{value:new THREE.Vector4(6,1.5,110*Math.PI/360,.65)},wlAim:{value:new THREE.Vector2()}});
 const wl=createWindowUniforms(),floorUniforms={first:createWindowUniforms(),second:createWindowUniforms()};
 function setWindowUniforms(target,p){target.wlState.value.set(p.enabled?1:0,p.brightness,p.directional?1:0,p.color?1:0);target.wlColor.value.set(p.color||'#ffffff');target.wlBeam.value.set(p.distance,p.sourceDistance,p.angle*Math.PI/360,p.softness);target.wlAim.value.set(p.azimuth*Math.PI/180,p.elevation*Math.PI/180);}
 const configureWindows=value=>{setWindowUniforms(wl,normalizeWindowLight(value));for(const key of ['first','second'])setWindowUniforms(floorUniforms[key],windowFloorSettings(value,key));};
 const materials=[];let roofCount=0;
 root.traverse(mesh=>{
  if(!mesh.isMesh)return;
  const rules=manifest.rules.filter(r=>r.node===mesh.name);
  const convert=original=>{
   const rule=rules.find(r=>r.material===original.name);
   if(!rule||!original.isMeshStandardMaterial)return original;
   const m=original.clone();m.userData.buildingLightRole=rule.role;if(isMatou)m.metalness=0;materials.push(m);m.emissive.set(0);m.emissiveMap=null;m.emissiveIntensity=1;
   const field=fields.get(mesh.name),roof=rule.role==='roof',window=rule.role==='window',sign=rule.role==='sign',trim=isMatou&&rule.role==='trim';
   const mask=window?masks.get(original.name):null;
   const linkedWindow=isMatou&&window&&Boolean(mask),maskMean=linkedWindow?maskReference(mask):1;
   if(window)m.userData.windowSource=()=>{const state=isMatou?floorUniforms[windowFloorForRule(rule,manifest)]:wl;return {color:(state.wlState.value.w?state.wlColor.value:uniforms.windowTint.value).clone(),energy:uniforms.levels.value.w*(isMatou?.22:1)*(state.wlState.value.x?state.wlState.value.y:0)};};
   if(roof)roofCount++;
   m.onBeforeCompile=shader=>{
    if(window){Object.assign(shader.uniforms,isMatou?floorUniforms[windowFloorForRule(rule,manifest)]:wl);const bounds=rule.bounds;shader.uniforms.wlCenter={value:bounds?new THREE.Vector3(...bounds.min).add(new THREE.Vector3(...bounds.max)).multiplyScalar(.5):new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3())};}
    shader.uniforms.bsTint=uniforms.tint;shader.uniforms.bsRoofTint=uniforms.roofTint;shader.uniforms.bsLevels=uniforms.levels;shader.uniforms.bsWidth=uniforms.width;shader.uniforms.bsShape=uniforms.shape;shader.uniforms.bsRetention=uniforms.retention;shader.uniforms.bsSign=uniforms.sign;shader.uniforms.bsFacadeTint=uniforms.facadeTint;shader.uniforms.bsWindowTint=uniforms.windowTint;shader.uniforms.bsTrimTint=uniforms.trimTint;
    if(field){shader.uniforms.bsField={value:field.texture};shader.uniforms.bsMin={value:new THREE.Vector3(...field.info.min)};shader.uniforms.bsSize={value:new THREE.Vector3(...field.info.max).sub(shader.uniforms.bsMin.value)};}
    if(roof)shader.uniforms.bsRoofHeight={value:new THREE.Vector2(rule.bounds.min[1],Math.max(.001,rule.bounds.max[1]-rule.bounds.min[1]))};
    if(mask)shader.uniforms.bsMask={value:mask};
    if(linkedWindow)shader.uniforms.bsWindowMaskMean={value:maskMean};
    shader.vertexShader='varying vec3 vBsWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvBsWorld=(modelMatrix * vec4(transformed,1.0)).xyz;');
    shader.fragmentShader=`${window?WINDOW_LIGHT_GLSL:''}
${regionGLSL}
varying vec3 vBsWorld; uniform vec3 bsTint; uniform vec3 bsRoofTint; uniform vec4 bsLevels; uniform float bsWidth; uniform vec4 bsShape; uniform float bsRetention; uniform float bsSign; uniform vec3 bsFacadeTint; uniform vec3 bsWindowTint; uniform vec3 bsTrimTint; ${roof?'uniform vec2 bsRoofHeight;':''} ${field?'uniform highp sampler3D bsField; uniform vec3 bsMin; uniform vec3 bsSize;':''} ${mask?'uniform sampler2D bsMask;':''} ${linkedWindow?'uniform float bsWindowMaskMean;':''}\n`+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float bsPolicy=bsRegion(vBsWorld);
      vec3 bsAlbedo=max(diffuseColor.rgb,vec3(0.0));
      float bsLuma=dot(bsAlbedo,vec3(.2126,.7152,.0722));
      vec3 bsPigment=clamp(bsAlbedo/max(bsLuma,.025),vec3(0.),vec3(1.3));
      vec3 bsN=normalize(inverseTransformDirection(${isMatou?'nonPerturbedNormal':'normal'},viewMatrix));
      float bsResponse=mix(.025,1.,pow(clamp(bsLuma,0.,1.),bsShape.w));
      ${isMatou?`
       // Preserve the existing surface light on the wall-top coping, now
       // independently tinted. Windows still emit only through their masks.
       // Never add soffit glow or wall bounce, including for legacy presets.
       totalEmissiveRadiance=vec3(0.);
       ${trim?'totalEmissiveRadiance=bsAlbedo*bsTrimTint*bsLevels.w*.22;':''}
       ${window?`
        float bsWindowMask=1.;
        ${mask?'#ifdef USE_MAP\nbsWindowMask=texture2D(bsMask,vMapUv).r;\n#endif':''}
        // Each storey has its own tint, gain, switch and directional profile.
        // Keep the lattice mask without re-tinting light by baked diffuse color.
        ${linkedWindow?'bsWindowMask/=max(bsWindowMaskMean,.08);':''}
        totalEmissiveRadiance=${linkedWindow?'vec3(1.)':'bsAlbedo'}*mix(bsWindowTint,wlColor,wlState.w)*bsLevels.w*bsWindowMask*.22;
       `:''}
      ` : roof?`
       float bsEdge=${field?'texture(bsField,clamp((vBsWorld-bsMin)/bsSize,0.,1.)).r':'0.0'};
       float bsTop=smoothstep(.02,.58,bsN.y);
       // The source volume combines ridges and eaves. Upper emphasis is a
       // soft height band, not a separately segmented ridge geometry.
       float bsUpper=${field?'smoothstep(.6,.9,clamp((vBsWorld.y-bsRoofHeight.x)/bsRoofHeight.y,0.,1.))':'0.0'};
       float bsFalloff=pow(bsEdge,max(bsWidth${isTower?'*5.':''},.1));
       bsFalloff=mix(bsFalloff,smoothstep(0.,1.,bsFalloff),bsShape.z);
       float bsContour=bsLevels.x*bsFalloff*mix(1.,bsShape.x,bsUpper);
       float bsBottom=(1.-smoothstep(-.35,.02,bsN.y))*bsShape.y;
       // Independently colored light contributions overlap smoothly on the original roof.
       vec3 bsRoofLight=bsRoofTint*bsLevels.y*bsTop;
       vec3 bsEaveLight=bsTint*bsContour*(bsTop+bsBottom)${isTower?'*.12':''};
       // Courtyard galleries: real longitudinal eaves only. The original
       // distance field also contains ridges; do not use it in these galleries.
       if(bsPolicy==1.){
        bsRoofLight=vec3(0.);
        bsEaveLight=bsTint*bsLevels.x*bsCorridorEave(vBsWorld)*bsTop;
       }
       totalEmissiveRadiance=mix(vec3(1.),bsPigment,bsRetention)*${isTower?'max(.38,bsResponse)':'bsResponse'}*(bsRoofLight+bsEaveLight);
      `:window?`
       float bsWindowMask=1.;
       ${mask?'#ifdef USE_MAP\nbsWindowMask=texture2D(bsMask,vMapUv).r;\n#endif':''}
       totalEmissiveRadiance=bsAlbedo*mix(bsWindowTint,wlColor,wlState.w)*bsLevels.w*bsWindowMask;
      `:sign?`totalEmissiveRadiance=bsAlbedo*bsWindowTint*bsSign;`:`
       float bsWall=1.-smoothstep(.55,.9,abs(bsN.y));
       ${isTower?`
       // Warm pale plaster panels without flattening the dark timber texture.
       float bsPanel=smoothstep(.12,.65,bsLuma);
       diffuseColor.rgb*=mix(vec3(.52,.28,.12),vec3(1.,.72,.37),bsPanel);
       totalEmissiveRadiance=mix(bsAlbedo*.35,vec3(1.25),bsPanel)*bsFacadeTint*bsLevels.z*bsWall;
       `:'totalEmissiveRadiance=bsAlbedo*bsFacadeTint*bsLevels.z*bsWall;'}
      `}
      ${window?'totalEmissiveRadiance*=windowLightProfile(vBsWorld,bsN);':''}
      // Permanent regional limits survive presets, brightness and saved settings.
      if(bsPolicy==0.${roof?'':'||bsPolicy==1.'})totalEmissiveRadiance=vec3(0.);
    `);
   };
   m.customProgramCacheKey=()=>`building-study-v12-floor-windows-${regionalPolicy}-${mode}-${rule.role}-${!!field}-${!!mask}`;
   return m;
  };
  mesh.material=Array.isArray(mesh.material)?mesh.material.map(convert):convert(mesh.material);
 });
 return {roofCount,materials,uniforms,windowUniforms:wl,floorWindowUniforms:floorUniforms,configureWindows,apply(p,enabled=true){p=normalizeSettings(p);uniforms.tint.value.set(p.color);uniforms.roofTint.value.set(p.roofColor);uniforms.facadeTint.value.set(p.facadeColor);uniforms.windowTint.value.set(p.windowColor);uniforms.trimTint.value.set(p.trimColor);uniforms.sign.value=p.sign*(enabled?p.brightness:0);uniforms.shape.value.set(p.ridgeGain,p.underside,p.transition,p.textureContrast);uniforms.retention.value=p.textureRetention;uniforms.levels.value.set(p.eave,p.roof,p.facade,p.window).multiplyScalar(enabled?(p.brightness??1):0);uniforms.width.value=p.width;},dispose(){materials.forEach(m=>m.dispose());}};
}
