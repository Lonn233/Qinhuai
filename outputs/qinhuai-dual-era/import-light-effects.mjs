// Uniform containers are stable across late-loaded tiles and repeated UI input.
export function groundControls(){return Object.fromEntries(['Radius','Intensity','Stretch','Falloff'].map(k=>['mapGround'+k,{value:1}]));}
export function applyGroundControls(u,p,kind){
  for(const suffix of ['Radius','Intensity','Stretch','Falloff'])
    u['mapGround'+suffix].value=p[kind+'Ground'+suffix]*(suffix==='Radius'?p.groundRadius:suffix==='Intensity'?p.groundIntensity:1);
}
export function waterControls(){return Object.fromEntries(['Intensity','Width','Length','Ripple','Speed','Fade'].map(k=>['mapWater'+k,{value:1}]));}
export function applyWaterControls(u,p,kind){for(const suffix of ['Intensity','Width','Length','Ripple','Speed','Fade'])u['mapWater'+suffix].value=p[kind+'Water'+suffix];}
export const WATER_UNIFORMS=`uniform float mapWaterIntensity; uniform float mapWaterWidth; uniform float mapWaterLength;
uniform float mapWaterRipple; uniform float mapWaterSpeed; uniform float mapWaterFade;`;
