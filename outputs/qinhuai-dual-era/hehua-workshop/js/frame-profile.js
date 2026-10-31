import * as THREE from 'three';
// One planar U profile shared by bending, installed ribs and finished lanterns.
const TAU = Math.PI * 2;
export const FRAME = { bigRadius: .60 / TAU, smallRadius: .09, bottomY: .022, ribLength: .40, segments: 96 };
export const SMALL_STRIP_LENGTH = TAU * FRAME.smallRadius + .02;
const bottomLength = Math.PI * FRAME.bigRadius;
const armLength = (FRAME.ribLength - bottomLength) / 2;
const armRise = Math.sqrt(armLength ** 2 - (FRAME.bigRadius - FRAME.smallRadius) ** 2);
FRAME.height = FRAME.bigRadius + armRise;
FRAME.bigY = FRAME.bottomY + FRAME.bigRadius;
FRAME.smallY = FRAME.bottomY + FRAME.height;
FRAME.wireY = FRAME.smallY;
Object.freeze(FRAME);

// Both ends point up. The lower half-circle and nearly vertical arms stay in
// one plane; never twist the tips sideways to force shared top junctions.
export function frameArcPoints(index) {
  const a = index * TAU / 3 - Math.PI / 6;
  const points = [];
  for (let i = 0; i <= FRAME.segments; i++) {
    const distance = FRAME.ribLength * i / FRAME.segments;
    let x, y;
    if (distance < armLength) {
      const t = distance / armLength;
      x = THREE.MathUtils.lerp(FRAME.smallRadius, FRAME.bigRadius, t);
      y = FRAME.height - armRise * t;
    } else if (distance <= armLength + bottomLength) {
      const angle = (distance - armLength) / FRAME.bigRadius;
      x = FRAME.bigRadius * Math.cos(angle);
      y = FRAME.bigRadius * (1 - Math.sin(angle));
    } else {
      const t = (distance - armLength - bottomLength) / armLength;
      x = -THREE.MathUtils.lerp(FRAME.bigRadius, FRAME.smallRadius, t);
      y = FRAME.bigRadius + armRise * t;
    }
    points.push(new THREE.Vector3(x * Math.cos(a), FRAME.bottomY + y, x * Math.sin(a)));
  }
  return points;
}
export function frameJoint(index, end = 0) {
  const a = index * TAU / 3 - Math.PI / 6 + end * Math.PI;
  return new THREE.Vector3(Math.cos(a) * FRAME.bigRadius, FRAME.bigY, Math.sin(a) * FRAME.bigRadius);
}
// Three evenly spaced fastening stations, each on a real U-rib tip.
export function topJoint(index) { return frameArcPoints(index)[0]; }
export function frameWidthAxis(index) { const a = index * TAU / 3 - Math.PI / 6; return new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)); }
