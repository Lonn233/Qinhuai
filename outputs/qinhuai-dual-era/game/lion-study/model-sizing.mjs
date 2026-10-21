import * as THREE from 'three';
import dimensions from './dimensions.cjs';
const {SIZE_SPECS,validSize}=dimensions;

// Measure the rotated model's full bounding box. All dimensions use metres.
export function initializeModelSize(group,id){
 const nativeSize=new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
 const axis=SIZE_SPECS[id].axis;
 const nativeMeasure=axis==='height'?nativeSize.y:Math.max(nativeSize.x,nativeSize.z);
 if(!Number.isFinite(nativeMeasure)||nativeMeasure<=0)throw Error('模型没有有效尺寸');
 const entry={group,id,nativeSize,nativeMeasure,size:nativeSize.clone(),sizeMeters:null};
 applyModelSize(entry,SIZE_SPECS[id].initial);
 return entry;
}
export function applyModelSize(entry,metres){
 if(!validSize(entry.id,metres))throw Error('模型尺寸超出可调范围');
 const factor=metres/entry.nativeMeasure;
 entry.group.scale.setScalar(factor);
 entry.size.copy(entry.nativeSize).multiplyScalar(factor);
 entry.sizeMeters=metres;
}
