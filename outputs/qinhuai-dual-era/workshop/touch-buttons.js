// Complete touch taps directly: Chrome can suppress a compatibility click
// immediately after a captured work-surface drag. Cancel the synthetic click
// so each tap still activates exactly once; mouse and keyboard keep native clicks.
export function enableTouchButtons(root=document){
 let tap=null;
 root.addEventListener('touchstart',e=>{
  const button=e.target.closest?.('button:not([data-key])');
  const t=e.touches[0];
  tap=button&&!button.disabled&&e.touches.length===1?{button,id:t.identifier,x:t.clientX,y:t.clientY}:null;
 },{passive:true});
 root.addEventListener('touchmove',e=>{
  if(!tap)return;
  const t=[...e.touches].find(t=>t.identifier===tap.id);
  if(!t||e.touches.length!==1||Math.hypot(t.clientX-tap.x,t.clientY-tap.y)>10)tap=null;
 },{passive:true});
 root.addEventListener('touchcancel',()=>tap=null,{passive:true});
 root.addEventListener('touchend',e=>{
  const pending=tap;tap=null;if(!pending||e.touches.length)return;
  const t=[...e.changedTouches].find(t=>t.identifier===pending.id);
  if(!t||pending.button.disabled||!pending.button.contains(document.elementFromPoint(t.clientX,t.clientY)))return;
  e.preventDefault();pending.button.focus({preventScroll:true});pending.button.click();
 },{passive:false});
}
