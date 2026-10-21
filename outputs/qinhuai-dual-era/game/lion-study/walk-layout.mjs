export const EYE_HEIGHT=1.65;
export const WALK_RADIUS=.28;
// Full-model footprints, in metres. Large exhibits retain a generous perimeter.
export function arrangeExhibits(models){
 const mountain=models.find(m=>m.id==='mountain');
 const radius=Math.max(mountain.size.x,mountain.size.z)/2;
 const small=['lion','fish','crane','lotus'].map(id=>models.find(m=>m.id===id));
 const widths=small.map(m=>Math.max(2.4,m.size.x+1.2));
 const total=widths.reduce((a,b)=>a+b,0)+3*2.2;
 let cursor=-total/2;
 const stations=small.map((m,i)=>{const x=cursor+widths[i]/2;cursor+=widths[i]+2.2;return {id:m.id,x,z:i===0||i===3?-3:-6,lift:m.id==='lion'?0:m.id==='crane'?1:.65,halfX:m.size.x/2+.25,halfZ:m.size.z/2+.25};});
 stations.unshift({id:'mountain',x:0,z:radius+3,lift:0,halfX:mountain.size.x/2+.8,halfZ:mountain.size.z/2+.8});
 const extent=Math.max(radius+5,total/2+3);
 return {stations,bounds:{minX:-extent,maxX:extent,minZ:-20,maxZ:2*radius+11},spawn:{x:0,z:-16},colliders:stations.map(s=>({minX:s.x-s.halfX,maxX:s.x+s.halfX,minZ:s.z-s.halfZ,maxZ:s.z+s.halfZ}))};
}
export function walkStep(position,dx,dz,bounds,colliders){
 const p={x:position.x,z:position.z};
 const blocked=(x,z)=>colliders.some(b=>x>b.minX-WALK_RADIUS&&x<b.maxX+WALK_RADIUS&&z>b.minZ-WALK_RADIUS&&z<b.maxZ+WALK_RADIUS);
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));
 for(let i=0;i<steps;i++){
  const x=Math.max(bounds.minX+WALK_RADIUS,Math.min(bounds.maxX-WALK_RADIUS,p.x+dx/steps));if(!blocked(x,p.z))p.x=x;
  const z=Math.max(bounds.minZ+WALK_RADIUS,Math.min(bounds.maxZ-WALK_RADIUS,p.z+dz/steps));if(!blocked(p.x,z))p.z=z;
 }
 return p;
}
