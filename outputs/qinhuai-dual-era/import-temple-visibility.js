import * as THREE from 'three';
import manifest from './assets/building-study/temple/manifest.json' with {type:'json'};

// Audited building-study nodes, not tile 9: that tile also owns the gate,
// riverside pavement and boats, which must remain outside the temple.
export const TEMPLE_INTERIOR_NODES = new Set(manifest.nodes);
export function isTempleInteriorPosition(x,z,margin=0) {
  return x>=-17.7-margin && x<=8.4+margin && z>=-57.15-margin && z<=-24.5+margin;
}
export class TempleRenderVisibility {
  constructor() {
    this.inside=false;
    this.gates={interior:new Set(),exterior:new Set()};
    this.known=new WeakMap();
  }
  register(object,side) {
    if(!object?.parent || this.known.has(object))return;
    const gate=new THREE.Group();
    gate.name='Temple visibility / '+side+' / '+object.name;
    gate.userData.templeVisibilityGate=side;
    // An independent parent composes with each layer's own visibility, LOD,
    // wireframe, user preferences and distance-cell culling without resetting it.
    object.parent.add(gate);gate.add(object);
    this.known.set(object,gate);this.gates[side].add(gate);
    gate.visible=side==='interior'?this.inside:!this.inside;
  }
  registerTile(id,root) {
    // Keep the authored temple architecture visible from the riverside. The
    // manifest includes structural facade/roof pieces as well as interior
    // geometry, so gating all audited nodes makes the whole temple disappear.
    // Interior-only props are gated separately via explicit userData tags.
    if(Number(id)!==9)return;
    this.registerProxies(root);
  }
  registerCourtyard(root) {
    const trees=[];
    root.traverse(object=>{if(object.name==='CourtyardCopiedTrees')trees.push(object);});
    for(const object of trees)this.register(object,'interior');
    // CourtyardGoldenLanterns, their halos and hanging nets stay visible outside.
  }
  registerProxies(root) {
    const nodes=[];
    root.traverse(object=>{if(object.userData.templeInterior)nodes.push(object);});
    for(const object of nodes)this.register(object,'interior');
  }
  setInside(value) {
    this.inside=!!value;
    for(const gate of this.gates.interior)gate.visible=this.inside;
    for(const gate of this.gates.exterior)gate.visible=!this.inside;
  }
  get stats() {
    return {inside:this.inside,interiorGates:this.gates.interior.size,exteriorGates:this.gates.exterior.size};
  }
}
