import * as THREE from 'three';
import {
  bambooRodGeometry, ribbonRingGeometry, curveFromPoints, tubeGeometry,
  roundedBoxGeometry, latheGeometry, cylinderBetween, taperBetween, helixPoints,
  petalGeometry, leafGeometry, circlePoints
} from './geometry.js';

import { FRAME, frameArcPoints, frameJoint, topJoint } from './frame-profile.js';
import { buildCrossBinding } from './bindings.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

function mesh(geo, mat, cast = true, receive = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast; m.receiveShadow = receive;
  return m;
}

function nodeBand(M, width, thickness, x, length = 0.005) {
  const radius = width * .22 * 1.06;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), M.bambooNode);
  band.rotation.z = Math.PI / 2;
  band.position.set(x, 0, 0);
  band.castShadow = true;
  return band;
}

export function buildBambooStrip(M, { length = 0.62, width = 0.0095, thickness = 0.0026, marks = false, tone = 'bamboo' } = {}) {
  const group = new THREE.Group();
  const points = [];
  const count = 28;
  for (let i = 0; i <= count; i++) points.push(V(-length / 2 + length * i / count, 0, 0));
  const geo = bambooRodGeometry(points, width);
  const strip = mesh(geo, tone === 'green' ? M.bambooGreen : M.bamboo);
  group.add(strip);
  for (let d = 0.12; d < length - 0.02; d += 0.125 + Math.random() * .02) {
    group.add(nodeBand(M, width, thickness, -length / 2 + d));
  }
  if (marks) {
    for (let i = 1; i < 6; i++) {
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.0022, 0.0004, width * 0.78), new THREE.MeshStandardMaterial({ color: '#9a2f2a', roughness: 0.8 }));
      mark.position.set(-length / 2 + length * i / 6, thickness / 2 + 0.0004, 0);
      group.add(mark);
    }
  }
  group.userData.kind = 'strip';
  return group;
}

export function buildHoop(M, { radius = 0.098, width = 0.009, thickness = 0.0035, knot = true } = {}) {
  const group = new THREE.Group();
  const hoop = mesh(bambooRodGeometry(circlePoints(radius, 0, 112), width, true), M.bamboo);
  group.add(hoop);
  if (knot) {
    const knotGroup = buildKnot(M, radius, width);
    group.add(knotGroup);
  }
  group.userData.kind = 'hoop';
  group.userData.radius = radius;
  return group;
}

export function buildKnot(M, radius = 0.098, width = 0.009) {
  const group = new THREE.Group();
  group.position.set(radius, 0, 0);
  for (let i = 0; i < 5; i++) {
    const wrap = mesh(new THREE.TorusGeometry(width * .62, .0012, 6, 20), M.twine);
    wrap.scale.x = .55; wrap.position.z = (i - 2) * .0025;
    group.add(wrap);
  }
  const tail = mesh(new THREE.TubeGeometry(curveFromPoints([V(0, 0, .006), V(.006, -.004, .012), V(.009, -.008, .01)]), 12, .0012, 5), M.twine);
  group.add(tail);
  return group;
}

export function buildArc(M, points, { width = 0.0075, thickness = 0.0023 } = {}) {
  const geo = bambooRodGeometry(points, width);
  const arc = mesh(geo, M.bamboo);
  arc.userData.kind = 'arc';
  return arc;
}

/* ---------- cotton paper twist ---------- */
export function buildTwistCoil(M, scale = 1) {
  const group = new THREE.Group();
  for (let c = 0; c < 3; c++) {
    const coil = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints(0.032 + c * 0.004, 0.006, 1.5, 90, c * 2)), 160, 0.0032, 6, false), M.cotton);
    coil.rotation.z = c * .25;
    group.add(coil);
  }
  const ends = mesh(new THREE.TubeGeometry(curveFromPoints([V(0.03, 0.003, 0.02), V(0.07, 0.002, 0.05), V(0.09, 0.001, 0.03)]), 16, 0.0031, 6), M.cotton);
  group.add(ends);
  group.scale.setScalar(scale);
  group.userData.kind = 'twist';
  return group;
}

export function buildTwistStrand(M) {
  const group = new THREE.Group();
  const path = [V(-.08, .002, 0), V(-.04, .003, .012), V(0, .002, -.006), V(.045, .003, .01), V(.085, .002, 0)];
  const cordMesh = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path), 48, 0.0035, 7), M.cotton);
  group.add(cordMesh);
  for (let i = 0; i < 7; i++) {
    const ridge = mesh(new THREE.TorusGeometry(0.0037, 0.0009, 4, 12), M.twine);
    ridge.position.copy(path[0]).lerp(path[4], i / 6);
    ridge.rotation.y = Math.PI / 2;
    group.add(ridge);
  }
  const loose = mesh(new THREE.TubeGeometry(curveFromPoints([V(.08, .002, 0), V(.1, .003, .015), V(.115, .002, -.004)]), 10, 0.0022, 5), M.cotton);
  group.add(loose);
  group.userData.kind = 'twist-strand';
  return group;
}

/* ---------- iron wire ---------- */
export function buildWireCoil(M) {
  const group = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const loop = mesh(new THREE.TorusGeometry(0.034 + i * .0012, 0.0011, 5, 32), M.wire);
    loop.rotation.x = Math.PI / 2;
    loop.position.y = i * 0.0025;
    loop.rotation.z = i * .16;
    group.add(loop);
  }
  const end = mesh(new THREE.TubeGeometry(curveFromPoints([V(.035, .012, 0), V(.075, .02, .02), V(.09, .012, .05)]), 14, 0.0011, 5), M.wire);
  group.add(end);
  group.userData.kind = 'wire';
  return group;
}

export function buildWireBracket(M) {
  const group = new THREE.Group();
  group.name = 'ThreePointSuspension';
  const apex = V(0, FRAME.smallY + .157 - FRAME.wireY, 0);
  const anchors = [0, 1, 2].map(i => frameJoint(i).add(V(0, -FRAME.wireY, 0)));
  const transitions = [];
  for (const [i, anchor] of anchors.entries()) {
    const transition = anchor.clone().lerp(apex, .28);
    transitions.push(transition);
    const gold = mesh(new THREE.TubeGeometry(new THREE.LineCurve3(anchor, transition), 1, .0011, 8), M.gold);
    gold.name = `GoldSuspensionFoot${i}`;
    const thread = mesh(new THREE.TubeGeometry(new THREE.LineCurve3(transition, apex), 1, .00125, 8), M.redThread);
    thread.name = `RedSuspensionCord${i}`;
    group.add(gold, thread);
    const fastening = mesh(new THREE.TorusGeometry(.0032, .00065, 6, 20), M.gold);
    fastening.name = `GoldHoopFastening${i}`;
    fastening.quaternion.setFromUnitVectors(V(0, 0, 1), V(-anchor.z, 0, anchor.x).normalize());
    fastening.position.copy(anchor); group.add(fastening);
  }
  const knot = mesh(new THREE.SphereGeometry(.0023, 12, 8), M.redThread);
  knot.name = 'SuspensionApexKnot'; knot.position.copy(apex); group.add(knot);
  // A small textile eye, not a rigid central handle or decorative wire sculpture.
  const eye = mesh(new THREE.TorusGeometry(.006, .0011, 6, 28), M.redThread);
  eye.name = 'RedThreadHangingEye'; eye.position.copy(apex).add(V(0, .006, 0)); group.add(eye);
  group.userData.suspension = { anchors: anchors.map(p => p.toArray()), transitions: transitions.map(p => p.toArray()), apex: apex.toArray() };
  group.userData.kind = 'bracket';
  return group;
}

/* ---------- tools ---------- */
export function buildBrush(M) {
  const group = new THREE.Group();
  const handle = mesh(new THREE.CylinderGeometry(0.0035, 0.0055, 0.20, 10), M.bambooWarm);
  handle.rotation.z = Math.PI / 2;
  group.add(handle);
  const ferrule = mesh(new THREE.CylinderGeometry(0.0058, 0.006, 0.018, 12), M.brass);
  ferrule.rotation.z = Math.PI / 2; ferrule.position.x = 0.105;
  group.add(ferrule);
  const bristle = mesh(new THREE.CylinderGeometry(0.0068, 0.0028, 0.045, 12), new THREE.MeshStandardMaterial({ color: '#4d3722', roughness: .95 }));
  bristle.rotation.z = Math.PI / 2; bristle.position.x = 0.135;
  group.add(bristle);
  const tip = mesh(new THREE.CylinderGeometry(0.0028, 0.001, 0.012, 8), M.pasteDry);
  tip.rotation.z = Math.PI / 2; tip.position.x = 0.162;
  group.add(tip);
  group.userData.kind = 'brush';
  return group;
}

export function buildPasteJar(M) {
  const group = new THREE.Group();
  const jar = mesh(latheGeometry([[.001, 0], [.055, .003], [.07, .02], [.073, .075], [.066, .095], [.06, .1], [.058, .104], [.05, .106]]), M.ceramicCeladon);
  group.add(jar);
  const pasteSurface = mesh(new THREE.CircleGeometry(0.058, 32), M.paste);
  pasteSurface.rotation.x = -Math.PI / 2; pasteSurface.position.y = .098;
  group.add(pasteSurface);
  const lid = mesh(new THREE.CylinderGeometry(.061, .064, .012, 32), M.ceramicCeladon);
  lid.position.y = .118; lid.rotation.z = .15; lid.position.x = .035;
  group.add(lid);
  group.userData.kind = 'paste-jar';
  return group;
}

export function buildScissors(M) {
  const group = new THREE.Group();
  for (const side of [-1, 1]) {
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.008, 0.075);
    bladeShape.lineTo(0.016, 0.078);
    bladeShape.lineTo(0.021, 0.002);
    bladeShape.closePath();
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.0022, bevelEnabled: true, bevelThickness: .0005, bevelSize: .0005, bevelSegments: 1 });
    const blade = mesh(bladeGeo, M.steel);
    blade.rotation.x = -Math.PI / 2;
    blade.rotation.z = side * 0.045;
    group.add(blade);
    const handle = mesh(new THREE.TorusGeometry(.026, .0045, 6, 22, Math.PI * 1.55), M.brass);
    handle.position.set(side * .008, .003, .098);
    handle.rotation.set(-Math.PI / 2, 0, side * .3);
    group.add(handle);
  }
  const pivot = mesh(new THREE.CylinderGeometry(.005, .005, .005, 16), M.steel);
  pivot.position.set(0, .004, .012);
  group.add(pivot);
  group.userData.kind = 'scissors';
  return group;
}

export function buildHammer(M) {
  const group = new THREE.Group();
  const handle = mesh(new THREE.CylinderGeometry(.0045, .0055, .2, 10), M.woodLight);
  handle.rotation.z = Math.PI / 2;
  group.add(handle);
  const head = mesh(roundedBoxGeometry(.055, .018, .018, .004), M.steel);
  head.position.x = -.1;
  group.add(head);
  const cap = mesh(new THREE.CylinderGeometry(.0055, .0055, .006, 10), M.brass);
  cap.rotation.z = Math.PI / 2; cap.position.x = .1;
  group.add(cap);
  group.userData.kind = 'hammer';
  return group;
}

export function buildThreadSpool(M) {
  const group = new THREE.Group();
  const core = mesh(new THREE.CylinderGeometry(.016, .016, .055, 18), M.woodLight);
  group.add(core);
  for (let i = 0; i < 9; i++) {
    const thread = mesh(new THREE.TorusGeometry(.0185, .0011, 5, 24), M.cotton);
    thread.rotation.x = Math.PI / 2;
    thread.position.y = -.022 + i * .0055;
    group.add(thread);
  }
  const loose = mesh(new THREE.TubeGeometry(curveFromPoints([V(.018, .01, 0), V(.07, .002, .02), V(.11, .001, -.01)]), 20, .0011, 5), M.cotton);
  group.add(loose);
  group.userData.kind = 'spool';
  return group;
}

export function buildDyeBowl(M, { color = 'pink' } = {}) {
  const group = new THREE.Group();
  const bowl = mesh(latheGeometry([[.001, 0], [.055, .002], [.075, .018], [.082, .06], [.078, .067], [.073, .066], [.068, .02], [.001, .012]], 36), M.ceramicCream);
  group.add(bowl);
  const liquid = mesh(new THREE.CircleGeometry(.072, 36), color === 'pink' ? M.dyePink : M.dyeGreen);
  liquid.rotation.x = -Math.PI / 2; liquid.position.y = .058;
  group.add(liquid);
  group.userData.kind = 'bowl';
  return group;
}

export function buildPaperSheet(M, { width = .16, height = .22, pink = false, curl = .008 } = {}) {
  const geo = new THREE.PlaneGeometry(width, height, 10, 14);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i, Math.sin((x / width + .5) * Math.PI) * curl + Math.sin((y / height + .5) * Math.PI * 1.2) * curl * .3);
  }
  geo.computeVertexNormals();
  const sheet = mesh(geo, pink ? M.paperPink : M.paper);
  sheet.rotation.x = -Math.PI / 2;
  sheet.userData.kind = 'sheet';
  return sheet;
}

export function buildPaperPile(M, { count = 6, width = .16, height = .22, pink = false } = {}) {
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const sheet = buildPaperSheet(M, { width, height, pink, curl: .004 + i * .0008 });
    sheet.position.y = i * .0007;
    sheet.rotation.z = (i % 3 - 1) * .018;
    group.add(sheet);
  }
  group.userData.kind = 'paper-pile';
  return group;
}

export function buildPress(M) {
  const group = new THREE.Group();
  const base = mesh(roundedBoxGeometry(.5, .05, .32, .015), M.woodDark);
  base.position.y = .025;
  group.add(base);
  const deck = mesh(roundedBoxGeometry(.34, .025, .25, .01), M.woodPolished);
  deck.position.y = .063;
  group.add(deck);
  for (const x of [-.18, .18]) {
    const post = mesh(new THREE.BoxGeometry(.045, .52, .065), M.wood);
    post.position.set(x, .31, 0);
    group.add(post);
    const foot = mesh(new THREE.BoxGeometry(.075, .03, .1), M.woodDark);
    foot.position.set(x, .06, 0);
    group.add(foot);
  }
  const crossbar = mesh(roundedBoxGeometry(.45, .045, .085, .012), M.wood);
  crossbar.position.y = .57;
  group.add(crossbar);
  group.userData.platform = crossbar;
  const shaft = new THREE.Group();
  shaft.position.y = .145;
  group.add(shaft);
  group.userData.shaft = shaft;
  const screw = mesh(new THREE.CylinderGeometry(.018, .018, .43, 18), M.bronze);
  screw.position.y = .36 - shaft.position.y;
  shaft.add(screw);
  for (let i = 0; i < 14; i++) {
    const thread = mesh(new THREE.TorusGeometry(.019, .0018, 5, 22), M.bronze);
    thread.rotation.x = Math.PI / 2;
    thread.position.y = .19 - shaft.position.y + i * .024;
    shaft.add(thread);
  }
  const handle = mesh(new THREE.CylinderGeometry(.008, .008, .34, 10), M.woodLight);
  handle.rotation.z = Math.PI / 2; handle.position.y = .585;
  group.add(handle);
  for (const x of [-.17, .17]) {
    const knob = mesh(new THREE.SphereGeometry(.018, 12, 8), M.bronze);
    knob.position.set(x, .585, 0);
    group.add(knob);
  }
  const platen = mesh(roundedBoxGeometry(.29, .028, .22, .008), M.woodPolished);
  platen.position.y = .19 - shaft.position.y;
  shaft.add(platen);
  const spindle = mesh(new THREE.CylinderGeometry(.021, .021, .11, 18), M.woodLight);
  spindle.position.y = 0;
  shaft.add(spindle);
  const paperSleeve = mesh(new THREE.CylinderGeometry(.024, .024, .082, 24, 8, true), M.paperPink);
  paperSleeve.position.y = 0;
  paperSleeve.visible = false;
  shaft.add(paperSleeve);
  group.userData.paperSleeve = paperSleeve;
  for (let i = 0; i < 9; i++) {
    const wrap = mesh(new THREE.TorusGeometry(.022, .0021, 5, 22), M.cotton);
    wrap.rotation.x = Math.PI / 2; wrap.position.y = .108 - shaft.position.y + i * .0095;
    shaft.add(wrap);
    (group.userData.wraps ||= []).push(wrap);
  }
  group.userData.kind = 'press';
  return group;
}

export function buildFrameModel(M, { bracket = true } = {}) {
  const group = new THREE.Group();
  group.name = 'LotusBambooFrame';
  for (const [radius, y] of [[FRAME.bigRadius, FRAME.bigY], [FRAME.smallRadius, FRAME.smallY]]) {
    const hoop = buildHoop(M, { radius, width: .0078, thickness: .0025 });
    hoop.position.y = y; group.add(hoop);
  }
  const tie = p => group.add(buildCrossBinding(M, p));
  for (let i = 0; i < 3; i++) {
    const geometry = bambooRodGeometry(frameArcPoints(i), .0078);
    group.add(mesh(geometry, M.bamboo));
    tie(frameJoint(i, 0)); tie(frameJoint(i, 1)); tie(topJoint(i));
  }
  if (bracket) { const wire = buildWireBracket(M); wire.position.y = FRAME.wireY; group.add(wire); }
  return group;
}

/* ---------- lotus assembly ---------- */
// Petals follow the rounded lantern wall instead of projecting like flat paddles.
function lanternRadius(y) {
  const t = THREE.MathUtils.clamp((y - FRAME.bottomY) / FRAME.height, 0, 1);
  return .045 + .066 * Math.sin(Math.pow(t, .65) * Math.PI * .68);
}
function lanternPetalGeometry(base, height, spread, offset, rows = 24) {
  const positions = [], uvs = [], indices = [], cols = 16;
  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const silhouette = Math.pow(Math.sin(Math.PI * v), 1.05);
    for (let c = 0; c <= cols; c++) {
      const u = c / cols * 2 - 1;
      const a = u * spread * silhouette;
      const y = base + v * height;
      const radius = lanternRadius(y) + offset + .003 * Math.sin(Math.PI * v) * (1-u*u);
      positions.push(Math.sin(a)*radius, y, Math.cos(a)*radius);
      uvs.push((u+1)/2, v);
      if (r < rows && c < cols) { const n = r*(cols+1)+c; indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1); }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.setIndex(indices); geo.computeVertexNormals(); return geo;
}

export function buildLotusFlower(M, { scale = 1, closed = false, pink = true } = {}) {
  const group = new THREE.Group();
  group.name = closed ? 'LotusBud' : 'OpenLotusFlower';
  const material = pink ? M.flowerPink : M.petalDeep;
  if (closed) {
    // Six curved sectors meet at the pointed tip of a single closed bud.
    for (let k = 0; k < 6; k++) {
      const positions=[], uvs=[], indices=[], rows=28, cols=10;
      for (let r=0;r<=rows;r++) {
        const v=r/rows, radius=.023*Math.pow(Math.sin(Math.PI*v),.8)*(1-.18*v);
        for (let c=0;c<=cols;c++) {
          const u=c/cols, a=(k+u)/6*TAU;
          const rr=radius*(1-.035*Math.pow(Math.abs(u*2-1),5));
          positions.push(Math.sin(a)*rr,v*.067,Math.cos(a)*rr);uvs.push(u,v);
          if(r<rows&&c<cols){const n=r*(cols+1)+c;indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1);}
        }
      }
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();group.add(mesh(geo,material));
    }
  } else {
    const core = mesh(new THREE.SphereGeometry(.011, 16, 10), M.flowerCore);
    core.scale.y=.45;core.position.y=.019;group.add(core);
    for(let i=0;i<18;i++){
      const a=i/18*TAU, stamen=mesh(new THREE.SphereGeometry(.0014,6,4),M.flowerCore);
      stamen.position.set(Math.sin(a)*.013,.023+Math.sin(i*2)*.002,Math.cos(a)*.013);group.add(stamen);
    }
    for (let layer = 0; layer < 2; layer++) {
      const count=layer ? 4 : 6;
      const geo=petalGeometry({width:layer?.043:.050,length:layer?.068:.076,curl:layer?.014:.011,rows:24,cols:20});
      for(let i=0;i<count;i++){
        const pivot=new THREE.Group();pivot.rotation.y=i/count*TAU+layer*.55;
        const petal=mesh(geo,material);petal.position.set(0,.005,.005);
        petal.rotation.x=layer?.30:(.92+.14*Math.sin(i*2.1));pivot.add(petal);group.add(pivot);
      }
    }
  }
  const sepalGeo=leafGeometry({width:.032,length:closed?.031:.040,curl:.008});
  for(let i=0;i<5;i++){
    const pivot=new THREE.Group();pivot.rotation.y=i/5*TAU;
    const sepal=mesh(sepalGeo,M.leaf);sepal.position.set(0,-.004,.004);sepal.rotation.x=closed?.65:1.12;
    pivot.add(sepal);group.add(pivot);
  }
  group.scale.setScalar(scale);group.userData.kind=closed?'bud':'flower';return group;
}

export function buildLotusLantern(M, { scale = 1, detailed = true } = {}) {
  const root=new THREE.Group();root.name='ReferenceLotusLantern';
  const body=new THREE.Group();body.name='LayeredLotusBody';root.add(body);
  const lining=[];
  for(let i=0;i<=32;i++){const y=FRAME.bottomY+FRAME.height*i/32;lining.push(new THREE.Vector2(lanternRadius(y)-.003,y));}
  const liningMaterial=new THREE.MeshStandardMaterial({map:M.textures.petalMap,color:'#dca8c3',roughness:.85,side:THREE.DoubleSide});
  body.add(mesh(new THREE.LatheGeometry(lining,detailed?64:40),liningMaterial));
  const base=mesh(new THREE.CircleGeometry(.044,32),liningMaterial);base.rotation.x=-Math.PI/2;base.position.y=FRAME.bottomY;body.add(base);
  // Upper row first; lower rows overlap its roots like the reference paper scales.
  for(let layer=2;layer>=0;layer--){
    const count=detailed?14:12, baseY=FRAME.bottomY+.015+layer*.033;
    const geo=lanternPetalGeometry(baseY,.076,Math.PI/count*1.10,.003+(2-layer)*.006,detailed?28:18);
    for(let i=0;i<count;i++){
      const petal=mesh(geo,M.petal);petal.name='BodyPetal';petal.rotation.y=i/count*TAU+(layer%2?Math.PI/count:0);body.add(petal);
    }
  }
  const basal=mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.044,FRAME.bottomY),new THREE.Vector2(.062,FRAME.bottomY+.002),new THREE.Vector2(.086,FRAME.bottomY+.014),new THREE.Vector2(.099,FRAME.bottomY+.024)
  ],48),M.leaf);body.add(basal);
  const leafCount=detailed?14:12;
  const leafGeo=lanternPetalGeometry(FRAME.bottomY,.052,Math.PI/leafCount*1.12,.020);
  for(let i=0;i<leafCount;i++){
    const leaf=mesh(leafGeo,M.leaf);leaf.name='BaseLeaf';leaf.rotation.y=i/leafCount*TAU;body.add(leaf);
  }
  // The finished upper rim is wrapped in reddish cloth; the construction U frame stays unchanged.
  const rim=buildHoop(M,{radius:FRAME.smallRadius+.005,width:.007,thickness:.002,knot:false});
  rim.traverse(o=>{if(o.isMesh)o.material=M.redLacquer;});rim.position.y=FRAME.smallY+.003;body.add(rim);
  for(let i=0;i<14;i++){
    const a=i/14*TAU, pin=mesh(new THREE.SphereGeometry(.0015,6,5),M.brass);
    pin.position.set(Math.sin(a)*.095,FRAME.smallY+.007,Math.cos(a)*.095);body.add(pin);
  }
  const flowers=new THREE.Group();flowers.name='TwoFlowersAndBud';flowers.position.y=FRAME.smallY;root.add(flowers);
  const heads=[{x:-.083,y:.048,z:-.008,tilt:.27,scale:.9},{x:.082,y:.052,z:-.016,tilt:-.32,scale:.88}];
  for(const head of heads){
    const foot=V(head.x*.65,-.018,head.z),tip=V(head.x,head.y,head.z);
    const stem=curveFromPoints([foot,V(head.x*.52,.012,head.z-.008),tip]);
    flowers.add(mesh(new THREE.TubeGeometry(stem,28,.0042,9),M.stem));
    const flower=buildLotusFlower(M,{scale:head.scale});flower.position.copy(tip);flower.rotation.z=head.tilt;flower.rotation.y=head.x<0?-.3:.8;flowers.add(flower);
    const sideStem=curveFromPoints([foot.clone().add(V(head.x<0?-.014:.014,0,.005)),V(head.x*.90,.022,head.z+.007),tip]);
    flowers.add(mesh(new THREE.TubeGeometry(sideStem,24,.0032,8),M.stem));
  }
  const bud=buildLotusFlower(M,{closed:true,scale:.88});bud.position.set(0,.029,.044);flowers.add(bud);
  flowers.add(mesh(new THREE.TubeGeometry(curveFromPoints([V(0,-.012,.042),V(.003,.012,.044),bud.position.clone()]),16,.0035,8),M.stem));
  const suspension = buildWireBracket(M); suspension.position.y = FRAME.wireY; root.add(suspension);
  root.userData.kind='lotus-lantern';root.scale.setScalar(scale);return root;
}

/* ---------- props ---------- */
export function buildPlumBranch(M, { height = .7, seedOffset = 0 } = {}) {
  const group = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#4c3525', roughness: .84 });
  const branch = (start, end, radius, bend = .05) => {
    const mid = start.clone().lerp(end, .5).add(V(bend, .01, -bend * .6));
    const curve = curveFromPoints([start, mid, end]);
    group.add(mesh(new THREE.TubeGeometry(curve, 16, radius, 6), trunkMat));
    return curve;
  };
  const main = branch(V(0, 0, 0), V(0.04, height, 0.05), .012, .07);
  const tips = [];
  for (let b = 0; b < 5; b++) {
    const t = .28 + b * .14;
    const p = main.getPoint(t);
    const dir = b % 2 ? -1 : 1;
    const end = p.clone().add(V(dir * (.13 + b * .018), .1 + .05 * Math.sin(b + seedOffset), (b % 3 - 1) * .06));
    branch(p, end, .005 - b * .0004, .015);
    tips.push(end.clone());
    for (let tw = 0; tw < 2; tw++) {
      const q = p.clone().lerp(end, .55 + tw * .18);
      const tip = q.clone().add(V(dir * .04, .06 + tw * .03, (tw ? .04 : -.04)));
      branch(q, tip, .0022, .008);
      tips.push(tip);
    }
  }
  const blossomPositions = tips.slice(0, 16);
  const petalGeo = petalGeometry({ width: .024, length: .016, curl: .004 });
  const petalMat = new THREE.MeshPhysicalMaterial({ color: '#f6e6ea', roughness: .65, side: THREE.DoubleSide, sheen: .4, sheenColor: '#ffdbe4' });
  const centerMat = new THREE.MeshStandardMaterial({ color: '#d9b25f', roughness: .7 });
  for (let i = 0; i < blossomPositions.length; i++) {
    const p = blossomPositions[i];
    const blossom = new THREE.Group();
    blossom.position.copy(p);
    blossom.rotation.set(Math.random() * 1.4, Math.random() * TAU, Math.random() * 1.4);
    for (let k = 0; k < 5; k++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.rotation.z = k / 5 * TAU;
      petal.rotation.x = .95;
      petal.position.z = .008;
      blossom.add(petal);
    }
    const core = new THREE.Mesh(new THREE.SphereGeometry(.004, 8, 6), centerMat);
    blossom.add(core);
    group.add(blossom);
  }
  return group;
}

export function buildBambooBundle(M, { count = 10, length = 1.2 } = {}) {
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const strip = buildBambooStrip(M, { length, width: .011, thickness: .0032 });
    strip.rotation.x = Math.PI / 2;
    strip.rotation.z = (Math.random() - .5) * .08;
    strip.position.set((i % 5 - 2) * .02, .006 * Math.floor(i / 5), (Math.random() - .5) * .03);
    group.add(strip);
  }
  return group;
}

export function buildDryingRack(M, { withSheets = true } = {}) {
  const group = new THREE.Group();
  for (const x of [-.42, .42]) {
    group.add(mesh(new THREE.BoxGeometry(.035, 1.05, .035), M.wood, true, true).translateX(x).translateY(.525));
    group.add(mesh(new THREE.BoxGeometry(.09, .03, .22), M.woodDark).translateX(x).translateY(.015));
  }
  for (const y of [.42, .78, 1.04]) {
    const bar = mesh(new THREE.CylinderGeometry(.012, .012, .86, 10), M.bambooWarm);
    bar.rotation.z = Math.PI / 2;
    bar.position.y = y;
    group.add(bar);
  }
  for (let i = 0; withSheets && i < 7; i++) {
    const sheet = buildPaperSheet(M, { width: .15, height: .23, pink: i % 3 === 0, curl: .01 });
    sheet.position.set(-.36 + i * .12, .775, .03);
    sheet.rotation.x = -Math.PI / 2;
    sheet.rotation.z = (i % 2 ? 1 : -1) * .03;
    group.add(sheet);
    const peg = mesh(new THREE.CylinderGeometry(.004, .004, .03, 6), M.bambooNode);
    peg.position.set(-.36 + i * .12, .79, .03);
    group.add(peg);
  }
  group.userData.kind = 'rack';
  return group;
}

export function buildTeaSet(M) {
  const group = new THREE.Group();
  const pot = mesh(latheGeometry([[.001, 0], [.045, .003], [.06, .03], [.055, .07], [.03, .085], [.025, .09], [.034, .096]], 24), M.ceramicRed);
  pot.position.y = .0;
  group.add(pot);
  const lid = mesh(new THREE.CylinderGeometry(.03, .032, .008, 24), M.ceramicRed);
  lid.position.y = .096; group.add(lid);
  const knob = mesh(new THREE.SphereGeometry(.008, 10, 8), M.ceramicRed);
  knob.position.y = .108; group.add(knob);
  const spout = mesh(new THREE.CylinderGeometry(.006, .009, .075, 10), M.ceramicRed);
  spout.rotation.z = -.9; spout.position.set(.06, .06, 0);
  group.add(spout);
  for (let i = 0; i < 3; i++) {
    const cup = mesh(latheGeometry([[.001, 0], [.018, .003], [.022, .022], [.025, .035], [.023, .036], [.019, .024], [.001, .015]], 18), M.ceramicCream);
    cup.position.set(.13 + (i % 2) * .07, 0, -.04 + i * .055);
    group.add(cup);
  }
  return group;
}

export function buildIncenseBurner(M) {
  const group = new THREE.Group();
  const bowl = mesh(latheGeometry([[.001, 0], [.04, .003], [.05, .022], [.052, .04], [.047, .045], [.042, .04], [.04, .02], [.001, .015]], 24), M.bronze);
  group.add(bowl);
  const lid = mesh(new THREE.ConeGeometry(.048, .04, 24, 1, true), M.bronze);
  lid.position.y = .06; group.add(lid);
  const knob = mesh(new THREE.SphereGeometry(.008, 10, 8), M.brass);
  knob.position.y = .085; group.add(knob);
  for (let i = 0; i < 3; i++) {
    const leg = mesh(new THREE.CylinderGeometry(.004, .005, .03, 6), M.bronze);
    leg.position.set(Math.cos(i / 3 * TAU) * .03, -.012, Math.sin(i / 3 * TAU) * .03);
    group.add(leg);
  }
  return group;
}
