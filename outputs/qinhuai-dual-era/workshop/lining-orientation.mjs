export const LINING_TOLERANCE = 12 * Math.PI / 180;
export const LINING_ROTATION_SPEED = .009;
export const wrapAngle = a => Math.atan2(Math.sin(a), Math.cos(a));
export function liningOrientation(panel, rotation, cameraAzimuth=0) {
 const error=wrapAngle(cameraAzimuth-((panel+.5)*Math.PI/3+rotation));
 return {error,aligned:Math.abs(error)<=LINING_TOLERANCE+1e-9,degrees:Math.abs(error)*180/Math.PI};
}

// Decoration attachment uses the same seated camera and facing tolerance as lining.
export const DECORATION_STAGES=['petal_assembly','calyx_assembly','lotus_leaf_assembly'];
export const isSeatedAssembly=id=>['lining_upper','lining_lower',...DECORATION_STAGES].includes(id);
export function attachmentOrientation(azimuth,rotation,cameraAzimuth=0){
 const error=wrapAngle(cameraAzimuth-(azimuth+rotation));
 return {error,aligned:Math.abs(error)<=LINING_TOLERANCE+1e-9,degrees:Math.abs(error)*180/Math.PI};
}
