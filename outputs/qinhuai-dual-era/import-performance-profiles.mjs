export const MAP_SCALE = .3212121212121212;
export const PERFORMANCE_PROFILES = Object.freeze({
  smooth: Object.freeze({label:'流畅',farMeters:180,pixelRatio:1,bloom:true,shadowSize:1024,waterSize:256,waterHz:6}),
  low: Object.freeze({label:'低性能',farMeters:120,pixelRatio:.8,bloom:false,shadowSize:0,waterSize:256,waterHz:3}),
  original: Object.freeze({label:'原效果',farMeters:null,pixelRatio:1.6,bloom:true,shadowSize:2048,waterSize:null,waterHz:null}),
});
export function performanceProfile(value) { return Object.hasOwn(PERFORMANCE_PROFILES,value) ? value : 'smooth'; }
export function personFar(profile,original=3000) {
  const meters=PERFORMANCE_PROFILES[performanceProfile(profile)].farMeters;
  return meters===null ? original : meters*MAP_SCALE;
}
export function lampLevel(distanceMeters,previous=-1) {
  const limits=[8,25,90];
  if(previous<0)return distanceMeters<8?0:distanceMeters<25?1:distanceMeters<90?2:3;
  let level=previous;
  while(level<3&&distanceMeters>limits[level]*1.15)level++;
  while(level>0&&distanceMeters<limits[level-1]*.85)level--;
  return level;
}
