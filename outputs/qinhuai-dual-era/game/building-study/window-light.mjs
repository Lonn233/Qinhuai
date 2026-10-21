export const WINDOW_LIGHT_DEFAULTS=Object.freeze({enabled:true,brightness:1,color:null,directional:false,distance:6,sourceDistance:1.5,angle:110,azimuth:0,elevation:0,softness:.65});
export const WINDOW_LIGHT_CONTROLS=[
 ['brightness','窗户亮度倍率',0,10,.05,'×'],
 ['distance','窗内光程',.3,15,.1,'m'],
 ['sourceDistance','灯源距窗',.15,5,.05,'m'],
 ['angle','光束角',15,160,1,'°'],
 ['azimuth','水平偏转',-70,70,1,'°'],
 ['elevation','上下偏转',-70,70,1,'°'],
 ['softness','边缘柔化',0,1,.01,'']
];
export function normalizeWindowLight(value={},includeFloors=true){
 const input=value&&typeof value==='object'&&!Array.isArray(value)?value:{},out={...WINDOW_LIGHT_DEFAULTS};
 for(const [key,,min,max] of WINDOW_LIGHT_CONTROLS)if(typeof input[key]==='number'&&Number.isFinite(input[key]))out[key]=Math.max(min,Math.min(max,input[key]));
 for(const key of ['enabled','directional'])if(typeof input[key]==='boolean')out[key]=input[key];
 if(typeof input.color==='string'&&/^#[0-9a-f]{6}$/i.test(input.color))out.color=input.color.toLowerCase();
 if(includeFloors&&input.floors&&typeof input.floors==='object')out.floors=Object.fromEntries(['first','second'].map(floor=>[floor,normalizeWindowLight({...out,...input.floors[floor]},false)]));
 return out;
}
export const WINDOW_FLOORS=Object.freeze({first:'一层窗户',second:'二层窗户'});
export function windowFloorSettings(value,floor){
 const state=normalizeWindowLight(value);
 return normalizeWindowLight(state.floors?.[floor]||state,false);
}
export function updateWindowFloor(value,floor,patch){
 const state=normalizeWindowLight(value);
 const floors=Object.fromEntries(Object.keys(WINDOW_FLOORS).map(key=>[key,windowFloorSettings(state,key)]));
 floors[floor]=normalizeWindowLight({...floors[floor],...patch},false);
 return normalizeWindowLight({...state,floors});
}
// Group real window material bounds by height, never by a mesh-name suffix.
// Only Matou opts into the two-storey UI; other building modes remain shared.
export function windowFloorForRule(rule,manifest){
 const centers=(manifest.rules||[]).filter(r=>r.role==='window'&&r.bounds).map(r=>(r.bounds.min[1]+r.bounds.max[1])/2);
 if(centers.length<2||!rule.bounds)return 'first';
 const split=(Math.min(...centers)+Math.max(...centers))/2;
 return (rule.bounds.min[1]+rule.bounds.max[1])/2>split?'second':'first';
}
// World-space virtual interior lamps. Only the existing window mask receives
// this light; no roof, sign, wall, global bloom or environment changes.
export const WINDOW_LIGHT_GLSL=`
uniform vec4 wlState; // enabled, gain, directional, color override
uniform vec3 wlColor;
uniform vec4 wlBeam; // reach metres, lamp setback metres, half angle radians, softness
uniform vec2 wlAim;
uniform vec3 wlCenter;
float windowLightProfile(vec3 world,vec3 surfaceNormal){
 if(wlState.x<.5)return 0.;
 if(wlState.z<.5)return wlState.y;
 vec3 horizontal=vec3(surfaceNormal.x,0.,surfaceNormal.z);
 horizontal=length(horizontal)>.01?normalize(horizontal):vec3(0.,0.,1.);
 vec3 tangent=vec3(horizontal.z,0.,-horizontal.x);
 vec3 local=(world-wlCenter)/(.53/1.65);
 // Repeated interior sources along the window frontage (2.4m bays), not dots
 // or separate luminous geometry on the window surface.
 float x=mod(dot(local,tangent)+1.2,2.4)-1.2;
 vec3 ray=vec3(x,local.y,wlBeam.y);
 float d=length(ray);
 vec3 aim=normalize(vec3(tan(wlAim.x),tan(wlAim.y),1.));
 float cone=smoothstep(cos(wlBeam.z),cos(wlBeam.z*(1.-max(.01,wlBeam.w)*.85)),dot(normalize(ray),aim));
 float reach=pow(max(0.,1.-pow(d/max(.01,wlBeam.x),2.)),2.);
 return wlState.y*cone*reach/(1.+.12*d*d);
}
`;

// Normalize lit panes, not frame coverage. Different baked tints and mask greys
// on the two Matou floors must not override their chosen color or brightness.
export function windowMaskReference(image){
 if(!image?.data||!image.width||!image.height)return 1;
 const channels=image.data.length/(image.width*image.height);
 if(!Number.isInteger(channels)||channels<1)return 1;
 let sum=0,count=0;
 for(let i=0;i<image.data.length;i+=channels){const v=image.data[i]/255;if(v>.08){sum+=v;count++;}}
 return count?sum/count:1;
}
