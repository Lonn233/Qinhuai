// World-space architectural restrictions for this extracted temple only.
// Measured against temple.glb: roof-map/roof-section in work/building-region-fix-20261018.
// Source meshes span multiple buildings, so mesh-name exclusions are unsafe.
export const UNLIT_REGIONS = [
 {x:[-19,-12.65],z:[-58,-27.65]}, // left outer annexes
 {x:[.75,9],z:[-58,-43.3]},      // right rear annexes
 {x:[2.08,9],z:[-41.2,-27.7]},   // right front annexes
 {x:[2.8,9],z:[-27.7,-25.9]},
];
export const EAVE_ONLY_REGIONS = [
 {x:[-12.65,-10.5],z:[-36.65,-27.4],edges:[-12.44,-10.76]},
 {x:[0,2.08],z:[-37.8,-27.4],edges:[.22,1.9]},
];
const inside=(x,z,r)=>x>=r.x[0]&&x<=r.x[1]&&z>=r.z[0]&&z<=r.z[1];
export function buildingRegion(x,z){
 if(UNLIT_REGIONS.some(r=>inside(x,z,r)))return 'unlit';
 if(EAVE_ONLY_REGIONS.some(r=>inside(x,z,r)))return 'eave-only';
 return 'normal';
}
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function corridorEaveMask(x,z){
 const r=EAVE_ONLY_REGIONS.find(r=>inside(x,z,r));
 return r?1-smooth(.045,.24,Math.min(...r.edges.map(e=>Math.abs(x-e)))):0;
}
const f=n=>Number(n).toFixed(5);
const box=r=>`(p.x>=${f(r.x[0])}&&p.x<=${f(r.x[1])}&&p.z>=${f(r.z[0])}&&p.z<=${f(r.z[1])})`;
// CPU diagnostics and GPU restrictions share the same measured bounds.
export const REGION_GLSL=`
 float bsRegion(vec3 p){
  if(${UNLIT_REGIONS.map(box).join('||')})return 0.;
  if(${EAVE_ONLY_REGIONS.map(box).join('||')})return 1.;
  return 2.;
 }
 float bsCorridorEave(vec3 p){
  ${EAVE_ONLY_REGIONS.map(r=>`if(${box(r)})return 1.-smoothstep(.045,.24,min(abs(p.x-(${f(r.edges[0])})),abs(p.x-(${f(r.edges[1])}))));`).join('\n')}
  return 0.;
 }
`;
