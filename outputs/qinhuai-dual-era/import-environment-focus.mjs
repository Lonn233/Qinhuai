import * as THREE from 'three';

// Some source meshes span several buildings. Clip the horizontal focus area to
// the selected catalog region instead of framing the entire shared mesh.
export function environmentFocusBounds(building, layout) {
  if(building.bounds)return structuredClone(building.bounds);
  const r=building.rect;
  const byName=new Map(Object.values(layout?.tiles||{}).flatMap(tile=>Object.entries(tile.bounds||{})));
  const matches=(building.nodes||[]).map(name=>byName.get(name)).filter(b=>b&&b.max[0]>=r[0]&&b.min[0]<=r[2]&&b.max[2]>=r[1]&&b.min[2]<=r[3]);
  const maxY=Math.max(13,...matches.map(b=>b.max[1]).filter(Number.isFinite));
  return {min:[r[0],11.65,r[1]],max:[r[2],maxY,r[3]]};
}

// Fit the building AND its ground spill into the visible area beside the menu.
// This changes the camera only: no material, building transform or light edits.
export function environmentCameraPose(bounds, {position=[0,30,30],fov=50,width=1200,height=800,left=0,top=0,reach=4}={}) {
  const box=new THREE.Box3(new THREE.Vector3().fromArray(bounds.min),new THREE.Vector3().fromArray(bounds.max));
  const padding=Math.max(1,Math.min(30,Number.isFinite(reach)?reach:4));
  box.min.x-=padding;box.min.z-=padding;box.max.x+=padding;box.max.z+=padding;
  const center=box.getCenter(new THREE.Vector3());
  const outward=new THREE.Vector3(position[0]-center.x,0,position[2]-center.z);
  if(outward.lengthSq()<.01)outward.set(.4,0,1);
  outward.normalize();outward.y=.95;outward.normalize();
  const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),outward).normalize();
  const up=new THREE.Vector3().crossVectors(outward,right).normalize();
  const tanY=Math.tan(THREE.MathUtils.degToRad(fov/2)),tanX=tanY*Math.max(.1,width/height);
  const xLow=-1+2*Math.min(.72,Math.max(0,left/width)),xHigh=1;
  const yLow=-1,yHigh=1-2*Math.min(.72,Math.max(0,top/height));
  const cx=(xLow+xHigh)/2,cy=(yLow+yHigh)/2;
  let distance=3;
  for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
    const d=new THREE.Vector3(x,y,z).sub(center),depth=d.dot(outward);
    for(const [value,tan,lo,hi,c] of [[d.dot(right),tanX,xLow,xHigh,cx],[d.dot(up),tanY,yLow,yHigh,cy]]){
      distance=Math.max(distance,(value+depth*tan*hi)/(tan*(hi-c)),(-value-depth*tan*lo)/(tan*(c-lo)));
    }
  }
  distance*=1.12;
  const target=center.clone().addScaledVector(right,-distance*tanX*cx).addScaledVector(up,-distance*tanY*cy);
  return {position:target.clone().addScaledVector(outward,distance).toArray(),target:target.toArray(),center:center.toArray(),bounds:{min:box.min.toArray(),max:box.max.toArray()}};
}
