import * as THREE from 'three';
import { FRAME } from './frame-profile.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

// Two diagonal passes encircle both crossing rods, rather than one upright.
export function buildCrossBinding(M, position) {
  const group = new THREE.Group();
  group.name = 'CottonBinding';
  const pointAt = t => {
    const wind = (pass, local) => {
      const angle = local * 3 * TAU;
      const diagonal = V(1, pass ? -1 : 1, 0).normalize();
      const offset = V(-diagonal.y, diagonal.x, 0).multiplyScalar((local - .5) * .0024);
      return diagonal.multiplyScalar(Math.cos(angle) * .0078)
        .add(V(0, 0, Math.sin(angle) * .0048)).add(offset);
    };
    if (t <= .46) return wind(0, t / .46);
    if (t >= .54) return wind(1, (t - .54) / .46);
    // Cross in front of the rods, never straight through the hoop centerline.
    const u = (t - .46) / .08;
    return wind(0, 1).lerp(wind(1, 0), u).add(V(0, 0, Math.sin(u * Math.PI) * .007));
  };
  // Retain an explicit crossover between the two diagonal winding passes.
  const points = Array.from({ length: 241 }, (_, i) => pointAt(i / 240));
  const cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 240, .00095, 6), M.twine);
  cord.name = 'WindingCord'; cord.castShadow = true;
  const knotPoints = [pointAt(1), ...Array.from({ length: 65 }, (_, i) => {
    const a = i / 64 * TAU * 2;
    return V(.005 + Math.sin(a) * .002, -.005 + Math.sin(a * .5) * .0015, .0045 + Math.cos(a) * .0018);
  })];
  const knot = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(knotPoints), 64, .001, 6), M.twine);
  knot.name = 'BindingKnot';
  const tip = pointAt(1);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([tip, tip.clone().add(V(.003, -.002, .002)), tip.clone().add(V(.005, -.004, .002))]), 16, .0009, 6), M.twine);
  tail.name = 'LoosePaperCord';
  group.add(cord, knot, tail);
  // Local X follows the hoop; local Y follows the upward U-rib arm.
  const radial = V(position.x, 0, position.z).normalize();
  const tangent = V(-radial.z, 0, radial.x);
  const rise = FRAME.smallY - FRAME.bigY;
  const upright = V(0, 1, 0).addScaledVector(radial, (FRAME.smallRadius - FRAME.bigRadius) / rise).normalize();
  const normal = tangent.clone().cross(upright).normalize();
  group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tangent, upright, normal));
  group.position.copy(position);
  group.userData.restScale = 1;
  group.userData.crossing = true;
  group.userData.binding = { cord, knot, tail, pointAt };
  group.userData.progress = 1;
  group.userData.phase = 'complete';
  return group;
}
