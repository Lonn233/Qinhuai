import * as THREE from 'three';
import layout from './assets/golden-tree-lanterns/courtyard-layout.json' with { type: 'json' };
import lantern from './assets/golden-tree-lanterns/layout.json' with { type: 'json' };

const UP = new THREE.Vector3(0, 1, 0);
const REFLECT_X = new THREE.Matrix4().makeScale(-1, 1, 1);

// Only the new courtyard copies are owned here; prototype resources stay with their loaders.
export class CourtyardLanternLayer {
  constructor(parent, { trees, lanterns }) {
    this.trees = trees; this.lanterns = lanterns;
    this.root = new THREE.Group(); this.root.name = 'DachengHall-TreeLanternNets'; parent.add(this.root);
    this.geometries = new Set(); this.materials = new Set();
    this.night = true; this.wireframe = false; this.disposed = false; this.ready = false; this.error = null;
  }
  registerTile(id) {
    if (Number(id) !== layout.tile || this.disposed || this.ready) return Promise.resolve();
    if (this.pending) return this.pending;
    this.pending = (async () => {
      await this.trees.manifestReady();
      const [treeParts, lampParts] = await Promise.all([this.trees.prototypeReady(layout.treePrototype), this.lanterns.modelReady()]);
      if (this.disposed) return;
      const trees = [], mounts = [], lines = [];
      const ground = layout.groundY, rows = layout.rows;
      const addLine = points => { for (let i = 1; i < points.length; i++) lines.push(...points[i-1].toArray(), ...points[i].toArray()); };
      for (const side of layout.sides) {
        rows.forEach((z, index) => {
          const scale = layout.treeScale * [1, .97, 1.035, .98][index];
          const base = new THREE.Vector3(side.treeX, ground + scale * .50000006, z);
          const quaternion = new THREE.Quaternion().setFromAxisAngle(UP, index * 1.8 + side.outward * .45);
          trees.push(new THREE.Matrix4().compose(base, quaternion, new THREE.Vector3(scale, scale, scale)));
          for (let j = 0; j < layout.treeLanterns; j++) {
            const angle = j * 2.39996 + index;
            const branch = new THREE.Vector3(side.treeX + Math.cos(angle) * .65, ground + 2.55 + (j % 3) * .23, z + Math.sin(angle) * .7);
            mounts.push({ side: side.name, kind: 'tree', branch, top: branch.clone().addScaledVector(UP, -.13), rotation: angle });
          }
        });
        for (let span = 0; span < rows.length - 1; span++) {
          const point = (t, across) => new THREE.Vector3(
            side.treeX + side.outward * (.12 + across * layout.netWidth),
            ground + layout.netHeight - across * layout.netDrop - Math.sin(Math.PI * t) * layout.sag,
            THREE.MathUtils.lerp(rows[span], rows[span+1], t)
          );
          for (let row = 0; row < layout.netRows; row++) {
            const across = row / (layout.netRows - 1);
            addLine(Array.from({length:25}, (_, i) => point(i / 24, across)));
            for (let column = 0; column < layout.columnsPerSpan; column++) {
              const t = (column + .38 + (row % 2) * .2) / layout.columnsPerSpan;
              const branch = point(t, across);
              const drop = .055 + .025 * ((column + row + span) % 3);
              mounts.push({ side: side.name, kind: 'net', branch, top: branch.clone().addScaledVector(UP, -drop), rotation: column * 2.4 + row });
            }
          }
          for (let column = 0; column <= layout.columnsPerSpan; column++) {
            addLine([point(column / layout.columnsPerSpan, 0), point(column / layout.columnsPerSpan, 1)]);
          }
          // Tie the inner edge to each tree, with a gently sloped outer suspension edge.
          for (const t of [0, 1]) {
            const branch = point(t, 0); branch.y = ground + 2.85;
            addLine([branch, point(t, 0), point(t, 1)]);
          }
        }
      }
      for (const part of treeParts) {
        const buckets = [[], []];
        for (const tree of trees) {
          const matrix = tree.clone().multiply(part.matrix), mirrored = matrix.determinant() < 0;
          if (mirrored) matrix.multiply(REFLECT_X);
          buckets[Number(mirrored)].push(matrix);
        }
        buckets.forEach((matrices, mirrored) => {
          if (!matrices.length) return;
          this.batch(mirrored ? this.trees.mirrored(part) : part.geometry, part.material, matrices, 'CourtyardCopiedTrees');
        });
      }
      const height = layout.lanternHeightMeters * lantern.mapUnitsPerMeter;
      const min = lantern.sourceBounds.min, max = lantern.sourceBounds.max;
      const scale = height / (max[1] - min[1]);
      const origin = new THREE.Matrix4().makeTranslation(-(min[0]+max[0])/2, -max[1], -(min[2]+max[2])/2);
      for (const part of lampParts) {
        const matrices = mounts.map(mount => new THREE.Matrix4().compose(mount.top,
          new THREE.Quaternion().setFromAxisAngle(UP, mount.rotation), new THREE.Vector3(scale, scale, scale)).multiply(origin).multiply(part.matrix));
        this.batch(part.geometry, part.material, matrices, 'CourtyardGoldenLanterns');
      }
      for (const mount of mounts) addLine([mount.branch, mount.top]);
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
      const material = new THREE.LineBasicMaterial({color:'#725532', transparent:true, opacity:.68});
      this.geometries.add(geometry); this.materials.add(material);
      const net = new THREE.LineSegments(geometry, material); net.name = 'CourtyardSaggingSupportNets'; this.root.add(net);
      const haloGeometry = new THREE.PlaneGeometry(1, 1);
      const haloMaterial = new THREE.ShaderMaterial({
        uniforms: { power:{value:0}, tint:{value:new THREE.Color('#ffc65c')} },
        vertexShader:'varying vec2 vUv;void main(){vUv=uv;vec4 c=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);c.xy+=position.xy*length(instanceMatrix[0].xyz);gl_Position=projectionMatrix*c;}',
        fragmentShader:'varying vec2 vUv;uniform float power;uniform vec3 tint;void main(){float r=length(vUv-.5)*2.;float g=exp(-r*r*5.)*pow(max(0.,1.-r),2.);gl_FragColor=vec4(tint,g*power);}',
        transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false
      });
      this.geometries.add(haloGeometry); this.materials.add(haloMaterial);
      this.halo = this.batch(haloGeometry, haloMaterial, mounts.map(m => new THREE.Matrix4().makeScale(height*1.7,height*1.7,height*1.7).setPosition(m.top.clone().addScaledVector(UP,-height*.36))), 'CourtyardLanternHalos');
      this.halo.renderOrder = 4;
      this.root.userData.mounts = mounts; this.root.userData.treeMatrices = trees;
      this.ready = true; this.error = null; this.setState();
    })().catch(error => { this.error = error.message; throw error; }).finally(() => { this.pending = null; });
    return this.pending;
  }
  batch(geometry, material, matrices, name) {
    const mesh = new THREE.InstancedMesh(geometry, material, matrices.length); mesh.name = name;
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingBox(); mesh.computeBoundingSphere();
    mesh.receiveShadow = true; this.root.add(mesh); return mesh;
  }
  setState({night=this.night,wireframe=this.wireframe}={}) {
    this.night=night; this.wireframe=wireframe;
    if (this.halo) { this.halo.visible = night && !wireframe; this.halo.material.uniforms.power.value = night && !wireframe ? .15 : 0; }
    for (const material of this.materials) if (material.isLineBasicMaterial) material.opacity = wireframe ? .35 : .68;
  }
  get stats() {
    return {trees:this.root.userData.treeMatrices?.length||0, lamps:this.root.userData.mounts?.length||0,
      nets:this.ready?layout.sides.length:0, drawCalls:this.root.children.length, ready:this.ready, error:this.error};
  }
  dispose() {
    if (this.disposed) return; this.disposed=true;
    this.root.traverse(mesh=>{if(mesh.isInstancedMesh)mesh.dispose();});
    this.root.removeFromParent(); this.root.clear(); this.root.userData={};
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of this.materials) material.dispose();
    this.geometries.clear(); this.materials.clear(); this.halo=null; this.ready=false;
  }
}
