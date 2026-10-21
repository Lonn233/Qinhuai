import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

export const DAY_LIGHT_PRESETS = {
  natural: { label:'自然日光', elevation:38, azimuth:145, turbidity:4.2, rayleigh:1.25, mie:.0028, mieG:.82, sun:2.75, hemi:.72, environment:.42, exposure:.94, fog:.00045, fogColor:0xa7bbc7, background:0x8ea9bd, sunColor:0xfff0cf },
  soft: { label:'柔和日光', elevation:53, azimuth:150, turbidity:7, rayleigh:1.35, mie:.0036, mieG:.78, sun:1.35, hemi:.9, environment:.52, exposure:1, fog:.00055, fogColor:0xa9b8c0, background:0x9aaeba, sunColor:0xe9eff0 },
};
export const TIME_PRESETS = {
  day: { label:'白天', clock:'14:00', lit:false },
  sunset: { label:'傍晚', clock:'18:00', lit:true, elevation:7, azimuth:205, turbidity:5, rayleigh:2, mie:.004, mieG:.82, sun:1.5, hemi:.52, environment:.38, exposure:.95, fog:.001, fogColor:0x9b8292, background:0x9b8292, sunColor:0xffbc82 },
  blueHour: { label:'蓝调时刻', clock:'18:40', lit:true, zenith:0x10284f, horizon:0x8c91aa, fogColor:0x64758e, background:0x64758e, fog:.002, hemi:.48, sun:.24, environment:.4, exposure:1, stars:.12, sunColor:0xb9cfff },
  night: { label:'灯会夜景', clock:'20:00', lit:true, zenith:0x040c20, horizon:0x263952, fogColor:0x152338, background:0x152338, fog:.0025, hemi:.32, sun:.16, environment:.28, exposure:1, stars:1, sunColor:0xadc8f5 },
};

function nightMaterial() {
  return new THREE.ShaderMaterial({
    side:THREE.BackSide, depthWrite:false,
    uniforms:{zenith:{value:new THREE.Color()}, horizon:{value:new THREE.Color()}, stars:{value:1}, moon:{value:new THREE.Vector3(1,.8,3.7).normalize()}},
    vertexShader:`varying vec3 vDirection;
      void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec3 vDirection;
      uniform vec3 zenith,horizon,moon;
      uniform float stars;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec3 d=normalize(vDirection);
        vec3 color=mix(horizon,zenith,smoothstep(-.08,.65,d.y));
        vec2 uv=vec2(atan(d.z,d.x)/6.2831853,asin(clamp(d.y,-1.,1.))/3.1415926)*vec2(720.,360.);
        float star=(1.-smoothstep(.02,.18,length(fract(uv)-.5)))*step(.996,hash(floor(uv)))*smoothstep(.06,.3,d.y)*stars;
        float m=length(d-moon);
        color+=vec3(.65,.75,1.)*star*.75;
        color+=vec3(.8,.86,1.)*((1.-smoothstep(.009,.012,m))*.9+exp(-m*70.)*.035)*stars;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

export class EnvironmentSystem {
  constructor({scene,renderer,sun,hemi,sunDir,sunTarget}) {
    Object.assign(this,{scene,renderer,sun,hemi,sunDir,sunTarget});
    this.sky=new Sky();this.sky.name='Qinhuai atmospheric sky';this.sky.scale.setScalar(1400);
    this.nightSky=new THREE.Mesh(new THREE.SphereGeometry(1400,32,16),nightMaterial());
    this.nightSky.name='Qinhuai moon and stars';this.nightSky.visible=false;
    scene.add(this.sky,this.nightSky);
    this.generator=new THREE.PMREMGenerator(renderer);this.cache=new Map();this.time='day';
  }
  apply(time='day',dayPreset='natural',exposure=1) {
    this.time=Object.hasOwn(TIME_PRESETS,time)?time:'day';
    const dayKey=Object.hasOwn(DAY_LIGHT_PRESETS,dayPreset)?dayPreset:'natural';
    const p=this.time==='day'?DAY_LIGHT_PRESETS[dayKey]:TIME_PRESETS[this.time];
    const atmospheric=p.elevation!==undefined;
    this.sky.visible=atmospheric;this.nightSky.visible=!atmospheric;
    if(atmospheric){
      this.sunDir.setFromSphericalCoords(1,THREE.MathUtils.degToRad(90-p.elevation),THREE.MathUtils.degToRad(p.azimuth));
      const u=this.sky.material.uniforms;
      u.turbidity.value=p.turbidity;u.rayleigh.value=p.rayleigh;u.mieCoefficient.value=p.mie;u.mieDirectionalG.value=p.mieG;u.sunPosition.value.copy(this.sunDir);
    }else{
      const u=this.nightSky.material.uniforms;
      u.zenith.value.setHex(p.zenith);u.horizon.value.setHex(p.horizon);u.stars.value=p.stars;
      this.sunDir.copy(u.moon.value);
    }
    this.sun.color.setHex(p.sunColor);this.sun.intensity=p.sun;this.sun.castShadow=atmospheric;
    this.sun.position.copy(this.sunTarget).addScaledVector(this.sunDir,900);
    this.sun.target.position.copy(this.sunTarget);this.sun.target.updateMatrixWorld();
    this.hemi.intensity=p.hemi;this.hemi.color.setHex(atmospheric?0xbfd8e9:0xa4c0e5);this.hemi.groundColor.setHex(atmospheric?0x514d45:0x393048);
    this.scene.background.setHex(p.background);this.scene.fog.color.setHex(p.fogColor);this.scene.fog.density=p.fog;
    this.scene.environmentIntensity=p.environment;
    this.currentPreset=p;
    this.setExposure(exposure);
    const key=this.time==='day'?'day-'+dayKey:this.time;
    if(!this.cache.has(key)){
      const source=atmospheric?this.sky:this.nightSky;
      const dome=new THREE.Mesh(source.geometry.clone(),source.material.clone());
      dome.scale.setScalar(atmospheric?500:500/1400);
      const envScene=new THREE.Scene();envScene.add(dome);
      this.cache.set(key,this.generator.fromScene(envScene,.04,.1,1200));
      dome.geometry.dispose();dome.material.dispose();
    }
    this.scene.environment=this.cache.get(key).texture;
    return this.time;
  }
  setExposure(value=1) {
    const p=this.time==='day'?(this.currentPreset||DAY_LIGHT_PRESETS.natural):TIME_PRESETS[this.time];
    this.renderer.toneMappingExposure=p.exposure*(TIME_PRESETS[this.time].lit?value:1);
  }
  update(camera) {
    this.sky.position.copy(camera.position);this.nightSky.position.copy(camera.position);
    this.sky.scale.setScalar(Math.min(1400,camera.far*.45));
    this.nightSky.scale.setScalar(Math.min(1,camera.far*.85/1400));
  }
  get stats(){return {time:this.time,environmentMaps:this.cache.size,sky:this.sky.visible?'atmosphere':'moon-stars',exposure:this.renderer.toneMappingExposure};}
  dispose(){
    if([...this.cache.values()].some(target=>target.texture===this.scene.environment))this.scene.environment=null;
    for(const target of this.cache.values())target.dispose();this.cache.clear();this.generator.dispose();
    for(const dome of [this.sky,this.nightSky]){dome.removeFromParent();dome.geometry.dispose();dome.material.dispose();}
  }
}
