import * as THREE from 'three';

// Viewer-only correction, measured against the fixed gate pillar frame.
// FBX and tile-09 GLB agree within 0.0001 world units; the imported roof
// components have separate skew/offsets. Preserve full affine matrices:
// decomposing these into TRS reintroduces the skew at their remote pivots.
// Evidence + isolated Blender views: work/night-lighting-audit/gate-alignment-20261018.
export const GATE_ROOF_CORRECTIONS = Object.freeze({
  "FuziTemple0340": [
    1.0030946698042842,
    0.0,
    0.04380667411872319,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.04905951402498771,
    0.0,
    1.0033377934717649,
    0.0,
    0.7481670264715552,
    0.0,
    -0.7132118792874067,
    1.0
  ],
  "FuziTemple0341": [
    0.9800656800006741,
    0.0,
    -0.0071564049119807885,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    -0.005986955019825439,
    0.0,
    1.0250628410934213,
    0.0,
    -0.11308564210980343,
    -0.09,
    -0.19181569476330473,
    1.0
  ],
  "FuziTemple0360": [
    1.0009833919708595,
    0.0,
    -0.02621051461511378,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    -0.02446350716735661,
    0.0,
    1.0009391705333675,
    0.0,
    -0.39516894803748936,
    0.0,
    0.3582500240955717,
    1.0
  ],
  "FuziTemple0361": [
    1.0030946698042842,
    0.0,
    0.04380667411872319,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.04905951402498771,
    0.0,
    1.0033377934717649,
    0.0,
    0.7481670264715552,
    0.0,
    -0.7132118792874067,
    1.0
  ]
});
export const GATE_WOOD_TEXTURE_URL = new URL('./assets/qinhuai-modern-import/repairs/gate-FuziTemple0087.jpg', import.meta.url);
let woodPromise;
const ownedMaterials = new Set();
function loadWoodTexture() {
  if (!woodPromise) woodPromise = new THREE.TextureLoader().loadAsync(GATE_WOOD_TEXTURE_URL.href).then(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }).catch(error => { woodPromise = null; throw error; });
  return woodPromise;
}

export async function repairGateRoof(root, { loadTexture = loadWoodTexture } = {}) {
  if (root.userData.gateRoofRepair) return root.userData.gateRoofRepair;
  const backing = root.getObjectByName('FuziTemple0341');
  if (!backing?.isMesh) return null;
  const meshes = Object.keys(GATE_ROOF_CORRECTIONS).map(name => root.getObjectByName(name));
  if (meshes.some(mesh => !mesh?.isMesh)) throw new Error('天下文枢屋顶构件不完整，未应用校正');
  // Resolve the actual bitmap behind FBX texture 0754's Max ColorCorrection
  // -> texture 0755 -> FuziTemple0087.jpg. Do not invent a white fallback.
  const wood = await loadTexture();
  root.updateWorldMatrix(true, true);
  for (const mesh of meshes) {
    const correction = new THREE.Matrix4().fromArray(GATE_ROOF_CORRECTIONS[mesh.name]);
    const originalLocal = mesh.matrix.clone();
    const parentWorld = mesh.parent?.matrixWorld || new THREE.Matrix4();
    const correctedWorld = correction.clone().multiply(mesh.matrixWorld);
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(parentWorld).invert().multiply(correctedWorld);
    mesh.matrixWorldNeedsUpdate = true;
    mesh.userData.gateRoofRepair = {
      version: 1, originalLocalMatrix: originalLocal.toArray(),
      worldToSource: correction.clone().invert().toArray(),
    };
  }
  const restoreWood = material => {
    if (material.name !== 'FuziTemple0042') return material;
    const repaired = material.clone();
    repaired.map = wood;
    repaired.needsUpdate = true;
    repaired.userData.gateSourceBitmap = 'FuziTemple0087.jpg';
    ownedMaterials.add(repaired);
    return repaired;
  };
  backing.material = Array.isArray(backing.material)
    ? backing.material.map(restoreWood) : restoreWood(backing.material);
  root.updateWorldMatrix(true, true);
  root.userData.gateRoofRepair = { version: 1, nodes: meshes.map(mesh => mesh.name) };
  return root.userData.gateRoofRepair;
}

export function disposeGateRoofRepair() {
  for (const material of ownedMaterials) material.dispose();
  ownedMaterials.clear();
  const pending = woodPromise; woodPromise = null;
  pending?.then(texture => texture.dispose()).catch(() => {});
}
