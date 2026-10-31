import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export function curveFromPoints(points, closed = false) {
  return new THREE.CatmullRomCurve3(points, closed, 'centripetal', 0.5);
}

export function circlePoints(radius, y = 0, count = 48, from = 0, to = Math.PI * 2, cx = 0, cz = 0) {
  const result = [];
  for (let i = 0; i <= count; i++) {
    const a = from + (to - from) * (i / count);
    result.push(V(cx + Math.cos(a) * radius, y, cz + Math.sin(a) * radius));
  }
  return result;
}

/* Rectangular-section ribbon following a curve. */
export function flatStripGeometry(points, width, thickness, closed = false, uvScale = 1, widthAxis = null) {
  const count = points.length;
  const positions = [], normals = [], uvs = [], indices = [];
  const tangent = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3();
  let total = 0;
  const lengths = [0];
  for (let i = 1; i < count; i++) { total += points[i].distanceTo(points[i - 1]); lengths.push(total); }
  for (let i = 0; i < count; i++) {
    const prev = points[closed ? (i - 1 + count) % count : Math.max(0, i - 1)], next = points[closed ? (i + 1) % count : Math.min(count - 1, i + 1)];
    tangent.copy(next).sub(prev).normalize();
    if (widthAxis) side.copy(widthAxis).addScaledVector(tangent, -widthAxis.dot(tangent));
    else side.crossVectors(tangent, UP);
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0); else side.normalize();
    up.crossVectors(side, tangent).normalize();
    const p = points[i];
    const hw = width * 0.5, ht = thickness * 0.5;
    const corners = [
      [p.clone().addScaledVector(side, -hw).addScaledVector(up, -ht), -1, -1],
      [p.clone().addScaledVector(side, hw).addScaledVector(up, -ht), 1, -1],
      [p.clone().addScaledVector(side, hw).addScaledVector(up, ht), 1, 1],
      [p.clone().addScaledVector(side, -hw).addScaledVector(up, ht), -1, 1]
    ];
    for (const [point, su, sv] of corners) {
      positions.push(point.x, point.y, point.z);
      normals.push(0, 1, 0);
      uvs.push(lengths[i] * uvScale, (su + 1) * 0.5);
    }
    if (i < count - 1) {
      const a = i * 4, b = (i + 1) * 4;
      for (let k = 0; k < 4; k++) {
        const k2 = (k + 1) % 4;
        indices.push(a + k, b + k, a + k2, a + k2, b + k, b + k2);
      }
    }
  }
  if (!closed) {
    const start = 0, end = (count - 1) * 4;
    indices.push(start, start + 2, start + 1, start, start + 3, start + 2);
    indices.push(end, end + 1, end + 2, end, end + 2, end + 3);
  } else {
    const end = (count - 1) * 4;
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      indices.push(end + k, k, end + k2, end + k2, k, k2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function applyStripUV(geometry, lengthMeters, widthMeters) {
  const pos = geometry.attributes.position, uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i);
    uv.setXY(i, u * lengthMeters * 3.2, uv.getY(i) * widthMeters * 18);
  }
  uv.needsUpdate = true;
}

export function replaceGeometry(mesh, geometry) {
  if (mesh.geometry) mesh.geometry.dispose();
  mesh.geometry = geometry;
}

/* Horizontal ribbon ring (bamboo hoop). */
export function ribbonRingGeometry(radius, width, thickness, segments = 96) {
  const positions = [], uvs = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    const a = i / segments * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    for (let k = 0; k < 4; k++) {
      const radial = k === 0 || k === 3 ? 1 : -1;
      const vertical = k < 2 ? -1 : 1;
      const r = radius + radial * width * 0.5;
      positions.push(c * r, vertical * thickness * 0.5, s * r);
      uvs.push(i / segments * 18, k < 2 ? 0 : 1);
    }
    if (i < segments) {
      const a0 = i * 4, b0 = (i + 1) * 4;
      for (let k = 0; k < 4; k++) {
        const k2 = (k + 1) % 4;
        indices.push(a0 + k, b0 + k, a0 + k2, a0 + k2, b0 + k, b0 + k2);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function tubeGeometry(points, radius, closed = false, segments = 64, radial = 8) {
  const curve = points.isCurve ? points : curveFromPoints(points, closed);
  return new THREE.TubeGeometry(curve, segments, radius, radial, closed);
}

// Keep the same centerline and material grain as bamboo changes from stock to frame.
export function bambooRodGeometry(points, width = .0095, closed = false) {
  const path = closed && points[0].distanceToSquared(points.at(-1)) < 1e-12
    ? points.slice(0, -1) : points;
  const geometry = tubeGeometry(path, width * .22, closed, Math.max(48, path.length - 1), 12);
  applyStripUV(geometry, geometry.parameters.path.getLength(), width);
  return geometry;
}

export function roundedBoxGeometry(w, h, d, radius = 0.01) {
  const r = Math.min(radius, w / 2 - 0.001, d / 2 - 0.001);
  const shape = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + d - r);
  shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  shape.lineTo(x + r, y + d);
  shape.quadraticCurveTo(x, y + d, x, y + d - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: h, bevelEnabled: true, bevelThickness: Math.min(0.004, h * .12),
    bevelSize: Math.min(0.004, r * .4), bevelSegments: 2, curveSegments: 5, steps: 1
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -h / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

export function latheGeometry(profile, segments = 32) {
  const points = profile.map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(points, segments);
}

export function cylinderBetween(a, b, radius, material, radial = 8) {
  const dir = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dir.length(), radial), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
  return mesh;
}

export function taperBetween(a, b, r1, r2, material, radial = 8) {
  const dir = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, dir.length(), radial), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
  return mesh;
}

export function helixPoints(radius, height, turns, count = 180, phase = 0, cx = 0, cz = 0) {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count, a = phase + t * Math.PI * 2 * turns;
    points.push(V(cx + Math.cos(a) * radius, t * height, cz + Math.sin(a) * radius));
  }
  return points;
}

export function petalGeometry({ width = 0.055, length = 0.10, curl = 0.012, tip = 0.88, rows = 20, cols = 18 } = {}) {
  const positions = [], uvs = [], indices = [];
  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const silhouette = Math.pow(Math.sin(Math.PI * Math.pow(v, 0.72)), 0.82) * (1 - Math.pow(v, 6) * 0.18);
    for (let c = 0; c <= cols; c++) {
      const u = c / cols * 2 - 1;
      const x = u * width * 0.5 * silhouette;
      const z = Math.sin(v * Math.PI) * curl * (1 - u * u * 0.7) + u * u * width * 0.08 * silhouette;
      let y = v * length;
      y += Math.sin(v * Math.PI) * length * 0.035;
      if (v > tip) y -= (v - tip) * length * 0.42;
      positions.push(x, y, z);
      uvs.push((u + 1) * 0.5, v);
      if (r < rows && c < cols) {
        const a = r * (cols + 1) + c, b = a + cols + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function leafGeometry({ width = 0.075, length = 0.13, rows = 18, cols = 16, curl = 0.018 } = {}) {
  const positions = [], uvs = [], indices = [];
  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const silhouette = Math.sin(Math.PI * Math.pow(v, 0.55)) * (1 - v * 0.18);
    for (let c = 0; c <= cols; c++) {
      const u = c / cols * 2 - 1;
      const x = u * width * .5 * silhouette;
      const y = v * length;
      const z = Math.sin(v * Math.PI) * curl * (1 - u * u * 0.55);
      positions.push(x, y, z);
      uvs.push((u + 1) * .5, v);
      if (r < rows && c < cols) {
        const a = r * (cols + 1) + c, b = a + cols + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function arcCurve(radius, start, end, segments = 48, y = 0, cx = 0, cz = 0) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = start + (end - start) * (i / segments);
    pts.push(V(cx + Math.cos(a) * radius, y, cz + Math.sin(a) * radius));
  }
  return pts;
}
