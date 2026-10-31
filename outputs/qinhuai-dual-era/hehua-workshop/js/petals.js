import * as THREE from 'three';
import { buildPaperSheet } from './models.js';
import { createCraftInteraction } from './craft-interaction.js';
import { createDyeProcess, DYE_MIN, DYE_MAX, DRY_SECONDS } from './dye-process.js';

const COPY = {
  load: ['贴合花瓣纸', '将一张完全阴干的染色纸贴在压模器轴上。按 E 放纸。'],
  wrap: ['白线沿轴绕紧', '沿轴向前逐圈缠绕白线，使纸均匀包裹模轴。'],
  strike: ['竖直敲击压模', '用小锤子敲击上方平台，轴与纸同步压缩成细密褶皱。'],
  lift: ['提起并复原压模', '向上拉起平台，使模轴展开复原。'],
  collect: ['解线取下压花纸', '解开白线，小心取下压模纸。'],
  fold: ['叠纸捏角并铜丝捆扎', '将两张压模纸叠放，捏住一角，用一根铜丝扎紧，完成一片花瓣。']
};
const DYE_HINTS = {
  dye: '对准右上方花瓣纸，按 E 逐张领取。',
  paperReady: '拖动花瓣纸至左下方粉红染料容器的高亮点。',
  atDye: '按住 E 浸入染料；松开暂停，累计 02:00–03:00 为合格。',
  readyToDryAll: '全部染纸已放上阴干架，按 E 开始统一阴干。',
  dryingAll: '全部染纸正在一起阴干；完全干透后再逐张收取。',
  collectDyed: '全部纸张已干透，按 E 逐张收取粉红染纸。',
  dyeDone: '花瓣纸已全部染色并阴干。按 F 离开，前往右后方压模台。'
};
Object.assign(COPY, {
  load: ['\u8d34\u5408\u82b1\u74e3\u7eb8', '\u5c06\u4e00\u5f20\u5b8c\u5168\u9634\u5e72\u7684\u67d3\u8272\u7eb8\u8d34\u5728\u538b\u6a21\u5668\u8f74\u4e0a\u3002\u6309 E \u653e\u7eb8\u3002'],
  wrap: ['\u767d\u7ebf\u6cbf\u8f74\u7ed5\u7d27', '\u6cbf\u8f74\u5411\u524d\u9010\u5708\u7f20\u7ed5\u767d\u7ebf\uff0c\u4f7f\u7eb8\u5747\u5300\u5305\u88f9\u6a21\u8f74\u3002'],
  strike: ['\u7ad6\u76f4\u6572\u51fb\u538b\u6a21', '\u7528\u5c0f\u9524\u5b50\u6572\u51fb\u4e0a\u65b9\u5e73\u53f0\uff0c\u8f74\u4e0e\u7eb8\u540c\u6b65\u538b\u7f29\u6210\u7ec6\u5bc6\u8936\u76b1\u3002'],
  lift: ['\u63d0\u8d77\u5e76\u590d\u539f\u538b\u6a21', '\u5411\u4e0a\u62c9\u8d77\u5e73\u53f0\uff0c\u4f7f\u6a21\u8f74\u5c55\u5f00\u590d\u539f\u3002'],
  collect: ['\u89e3\u7ebf\u53d6\u4e0b\u538b\u82b1\u7eb8', '\u89e3\u5f00\u767d\u7ebf\uff0c\u5c0f\u5fc3\u53d6\u4e0b\u538b\u6a21\u7eb8\u3002'],
  fold: ['\u53e0\u7eb8\u634f\u89d2\u5e76\u94dc\u4e1d\u6346\u624e', '\u5c06\u4e24\u5f20\u538b\u6a21\u7eb8\u53e0\u653e\uff0c\u634f\u4f4f\u4e00\u89d2\uff0c\u7528\u4e00\u6839\u94dc\u4e1d\u624e\u7d27\uff0c\u5b8c\u6210\u4e00\u7247\u82b1\u74e3\u3002']
});

export function createPetalsStage({ dyeBench, pressBench, materials, camera, renderer, audio, inventory, onState, onComplete, blocked }) {
  const platform = pressBench.group.userData.pressPlatform, hammer = pressBench.group.userData.hammer;
  const wraps = pressBench.group.userData.pressWraps || [];
  const pressPaper = pressBench.group.userData.pressPaper;
  const pressShaft = pressBench.group.userData.pressShaft;
  const syncPressTools = () => {
    const loaded = ['wrap', 'strike', 'lift', 'collect'].includes(mode);
    pressPaper.visible = loaded;
    pressShaft.scale.y = mode === 'lift' ? .62 : 1;
    hammer.visible = mode === 'strike' || mode === 'lift';
    wraps.forEach((wrap, index) => { wrap.visible = ['strike', 'lift', 'collect'].includes(mode) || mode === 'wrap' && index < Math.floor(wraps.length * wrapElapsed / 1.4); });
  };
  const platformHome = platform.position.y, hammerHome = hammer.rotation.x;
  const dye = createDyeProcess(inventory);
  const group = dyeBench.group, stock = group.userData.stock, bowl = group.userData.dyeBowl, rack = group.userData.rack;
  const paper = buildPaperSheet(materials, { width: .18, height: .24, curl: .006 });
  const rackSheets = Array.from({ length: 6 }, () => buildPaperSheet(materials, { width: .11, height: .2, pink: true, curl: .006 }));
  rackSheets.forEach((sheet, index) => {
    sheet.position.set(-.31 + index * .124, .78 - .1, .045);
    sheet.rotation.set(0, 0, 0); sheet.material = sheet.material.clone(); sheet.material.transparent = true; sheet.visible = false; rack.add(sheet);
  });
  paper.material = paper.material.clone(); paper.material.transparent = true; paper.visible = false; group.add(paper);
  let lastUiSignature = null;
  let lastInteractionDrag = null;
  let bench = null, active = false, mode = 'load', wait = 0, petalsMade = 0, pressedCount = 0, strikeHits = 0, foldSheets = 0, wrapElapsed = 0, wrapAnimating = false, pressStarted = false, motion = null, visualMode = null;
  const history = [];
  const dyeActive = () => active && bench?.id === 'dye';
  const pressActive = () => active && bench?.id === 'press';
  const world = point => { group.updateWorldMatrix(true, false); return group.localToWorld(point.clone()); };
  const bowlPoint = new THREE.Vector3(bowl.position.x, bowl.position.y + .22, bowl.position.z);
  const rackPoint = new THREE.Vector3(
    rack.position.x,
    rack.position.y + (.78 - .1) * rack.scale.y,
    rack.position.z + .045 * rack.scale.z
  );
  const readyPoint = new THREE.Vector3(.55, 1.045, .2);
  function positionFor(s) {
    if (s.mode === 'paperReady') return readyPoint.clone();
    if (['atDye', 'dyeing'].includes(s.mode)) return bowlPoint.clone().add(new THREE.Vector3(0, s.holding ? -.065 : .065, 0));
    return rackPoint.clone().add(new THREE.Vector3(0, s.mode === 'readyToDryAll' ? .1 : 0, 0));
  }
  function syncVisual(animate = false) {
    const s = dye.snapshot();
    stock.visible = s.stock > 0;
    stock.children.forEach((child, i) => { child.visible = i < s.stock; });
    paper.visible = !['dye', 'dyeDone', 'readyToDryAll', 'dryingAll', 'collectDyed'].includes(s.mode);
    rackSheets.forEach((sheet, index) => {
      sheet.visible = index < s.rackCount;
      if (sheet.visible) {
        const progress = s.mode === 'dryingAll' ? 1 - s.dryRemaining / DRY_SECONDS : ['collectDyed', 'dyeDone'].includes(s.mode) ? 1 : 0;
        sheet.material.opacity = .84 + .16 * Math.min(1, progress);
      }
    });
    const next = positionFor(s);
    const angle = s.mode === 'paperReady' ? -Math.PI / 2 : ['atDye', 'dyeing'].includes(s.mode) ? -.12 : -.06;
    const visualKey = `${s.mode}:${s.holding}`;
    if (animate && paper.visible && visualMode !== visualKey) {
      motion = { from: paper.position.clone(), to: next, fromAngle: paper.rotation.x, toAngle: angle, time: 0, duration: .65 };
    } else if (!motion && !interaction?.snapshot().drag) {
      paper.position.copy(next); paper.rotation.set(angle, 0, 0);
    }
    visualMode = visualKey;
    const color = new THREE.Color(0xfff5df).lerp(new THREE.Color(0xe58fa5), Math.min(1, s.seconds / DYE_MIN));
    if (s.seconds > DYE_MAX) color.lerp(new THREE.Color(0x832f55), Math.min(1, (s.seconds - DYE_MAX) / 100));
    paper.material.color.copy(color);
    paper.material.opacity = s.mode === 'dryingAll' ? .8 + .2 * (1 - s.dryRemaining / DRY_SECONDS) : 1;
    paper.material.roughness = ['collectDyed', 'paperReady'].includes(s.mode) ? .95 : .55;
  }
  const target = () => {
    const s = dye.snapshot();
    if (!dyeActive()) return null;
    if (s.mode === 'dye') return world(stock.position.clone().add(new THREE.Vector3(0, .02, 0)));
    if (['paperReady', 'atDye'].includes(s.mode)) return world(bowlPoint);
    if (s.mode === 'dyeing') return s.quality === 'ready' && !s.holding ? world(rackPoint) : null;
    if (['readyToDryAll', 'collectDyed'].includes(s.mode)) return world(rackPoint);
    return null;
  };
  const dragKey = () => {
    const s = dye.snapshot();
    return s.mode === 'paperReady' ? 'paper' : s.mode === 'dyeing' && s.quality === 'ready' && !s.holding ? 'wetPaper' : null;
  };
  const pressDropPoint = () => pressBench.group.localToWorld(new THREE.Vector3(.08, .88, .05));
  const interaction = createCraftInteraction({ camera, renderer, parent: () => dyeActive() ? group : pressBench.group, keepTargetFixed: true,
    enabled: () => (dyeActive() && !motion || pressActive() && !wait && !wrapAnimating) && !blocked(),
    target: () => {
      if (dyeActive()) return target();
      if (!pressActive()) return null;
      if (mode === 'strike' || mode === 'lift') return platform.getWorldPosition(new THREE.Vector3());
      return mode === 'fold' ? pressDropPoint() : null;
    },
    source: () => {
      if (dyeActive() && dragKey()) return { key: dragKey(), point: paper.getWorldPosition(new THREE.Vector3()), object: paper };
      if (pressActive() && mode === 'fold') {
        const key = foldSheets < 2 && inventory.pressedPaper > 0 ? 'pressedPaper' : foldSheets === 2 && inventory.copper > 0 ? 'copper' : null;
        return key ? { key, point: pressBench.group.localToWorld(new THREE.Vector3(-.38, .82, .1)), object: null } : null;
      }
      return null;
    },
    allow: key => dyeActive() ? key === dragKey() : pressActive() && mode === 'fold' && (key === 'pressedPaper' && foldSheets < 2 || key === 'copper' && foldSheets === 2),
    createDragObject: key => {
      if (key === 'pressedPaper') return buildPaperSheet(materials, { width: .18, height: .24, pink: true, curl: .006 });
      if (key === 'copper') {
        const wire = new THREE.Mesh(new THREE.TorusGeometry(.11, .006, 8, 32), new THREE.MeshStandardMaterial({ color: 0xb87843, metalness: .62, roughness: .38 }));
        wire.rotation.x = Math.PI / 2; return wire;
      }
      return null;
    },
    onDrop: (key, draggedObject) => {
      if (dyeActive()) return perform(key === 'paper' ? 'bowl' : 'rack');
      if (!pressActive() || mode !== 'fold') return false;
      remember();
      if (key === 'pressedPaper' && foldSheets < 2 && inventory.pressedPaper > 0) {
        inventory.pressedPaper--; foldSheets++;
        if (draggedObject) {
          pressBench.group.add(draggedObject);
          draggedObject.position.copy(pressBench.group.worldToLocal(pressDropPoint()));
          draggedObject.position.y += (foldSheets - 1) * .008;
          draggedObject.rotation.set(-Math.PI / 2, 0, 0);
        }
        if (foldSheets === 2) audio.change?.();
      } else if (key === 'copper' && foldSheets === 2 && inventory.copper > 0) {
        if (draggedObject?.parent) { draggedObject.removeFromParent(); draggedObject.geometry?.dispose(); draggedObject.material?.dispose?.(); }
        inventory.copper--; inventory.petal++; petalsMade++; foldSheets = 0; audio.chime?.();
        if (petalsMade >= 3) { mode = 'done'; onComplete(); }
      } else return false;
      emit(); return true;
    },
    onClick: () => {
      if (dyeActive()) { if (dye.snapshot().mode === 'dye') perform('pick'); return; }
      if (!pressActive()) return;
      if (mode === 'strike') {
        remember(); strikeHits++;
        hammer.rotation.x = hammerHome - Math.min(.12, strikeHits * .024);
        platform.position.y = platformHome - Math.min(.035, strikeHits * .007);
        audio.change?.();
        if (strikeHits >= 5) mode = 'lift';
        syncPressTools(); emit();
      } else if (mode === 'lift') pressAction();
    }
  });
  const emit = () => { if (active) onState(snapshot()); };
  function perform(action, animate = true) {
    if (!dyeActive() || blocked() || motion) return false;
    if (action === 'pick') { paper.position.copy(stock.position); paper.rotation.x = -Math.PI / 2; }
    if (!dye.act(action)) return false;
    if (action === 'pick' || action === 'collect') audio.pick?.();
    if (action === 'dry') audio.change?.();
    syncVisual(animate); emit(); return true;
  }
  function remember() {
    history.push({ mode, petalsMade, pressedCount, strikeHits, foldSheets, inventory: Object.fromEntries(['dyedPaper', 'pressedPaper', 'copper', 'petal'].map(key => [key, inventory[key]])), platform: platform.position.y, hammer: hammer.rotation.x });
  }
  function back() {
    if (!active || wait || blocked()) return false;
    motion = null; interaction.clear();
    if (dyeActive()) { const ok = dye.back(); syncVisual(); emit(); return ok; }
    const previous = history.pop(); if (!previous) return false;
    ({ mode, petalsMade, pressedCount, strikeHits, foldSheets } = previous); Object.assign(inventory, previous.inventory);
    platform.position.y = previous.platform; hammer.rotation.x = previous.hammer; syncPressTools(); emit(); return true;
  }
  function canSkip() {
    if (!active) return false;
    if (dyeActive()) return dye.snapshot().canSkip;
    return mode !== 'done' && (mode !== 'load' || (inventory.dyedPaper > 0 && dye.snapshot().collected >= dye.snapshot().target));
  }
  function snapshot() {
    const s = dye.snapshot(), isDye = bench?.id === 'dye' || !bench;
    let hint = DYE_HINTS[s.mode];
    if (s.mode === 'dyeing') hint = s.quality === 'light' ? '颜色偏浅：按住 E 继续浸染，松开暂停。'
      : s.quality === 'ready' ? '颜色合格：松开 E，将纸拖至左上方阴干台高亮点。' : '颜色过深：按 D 丢弃这一张，再领取新纸重染。';
    const copy = mode === 'done' ? ['花瓣制作完成', '粉色花瓣已收入物品栏。'] : COPY[mode] || COPY.load;
    return {
      active, phase: 3, phaseLabel: '第三步 · 制作花瓣', benchId: bench?.id || 'dye', mode: isDye ? s.mode : mode,
      taskName: isDye ? '染色并阴干花瓣纸' : copy[0], taskHint: isDye ? `${hint} 已收 ${s.collected}/${s.target} 张。` : mode === 'load' && s.collected < s.target ? '请先将全部花瓣纸染色、阴干并逐张收齐，再开始压模。' : copy[1],
      progress: isDye ? s.collected / s.target : mode === 'fold' || mode === 'done' ? Math.min(1, petalsMade / 3) : Math.min(1, pressedCount / s.target), step: isDye ? 0 : 1,
      inventory: { ...inventory }, selected: isDye ? dragKey() : null, draggable: dyeActive() ? dragKey() : pressActive() && mode === 'fold' ? foldSheets < 2 && inventory.pressedPaper > 0 ? 'pressedPaper' : foldSheets === 2 && inventory.copper > 0 ? 'copper' : null : null,
      busy: !!wait || !!motion || wrapAnimating, canBack: active && (isDye ? s.canBack : !!history.length), canSkip: canSkip(),
      done: !isDye && mode === 'done', petalsMade, pressedCount, strikeHits, foldSheets, dye: s, ...(active ? interaction.snapshot() : {}),
      hints: isDye ? [ ...(dragKey() ? [{ icon: 'drag', text: s.mode === 'paperReady' ? '拖动花瓣纸到染料高亮点' : '拖动合格染纸到阴干高亮点' }] : []),
        { key: s.quality === 'dark' ? 'D' : 'E', text: s.quality === 'dark' ? '丢弃过深纸张' : ['atDye', 'dyeing'].includes(s.mode) ? '按住浸染 · 松开暂停' : s.mode === 'readyToDryAll' ? '开始统一阴干' : s.mode === 'collectDyed' ? '逐张收取干纸' : '逐张领取花瓣纸' }, { key: 'F', text: '退出工作台' } ] : [{ key: 'E', text: '依次操作压模工序' }]
    };
  }
  function pressAction(fast = false) {
    if (!fast && (wait || wrapAnimating || blocked())) return false;
    if (!['load', 'wrap', 'strike', 'lift', 'collect', 'fold'].includes(mode) || (mode === 'load' && (inventory.dyedPaper < 1 || dye.snapshot().collected < dye.snapshot().target)) || (mode === 'fold' && (inventory.pressedPaper < 2 || inventory.copper < 1))) return false;
    remember();
    if (mode === 'load') { inventory.dyedPaper--; mode = 'wrap'; wrapElapsed = 0; wrapAnimating = true; }
    else if (mode === 'wrap') { mode = 'strike'; hammer.visible = true; }
    else if (mode === 'strike') { if (!fast) return false; strikeHits = 5; mode = 'lift'; platform.position.y = platformHome - .035; hammer.rotation.x = hammerHome - .12; audio.change(); }
    else if (mode === 'lift') { mode = 'collect'; platform.position.y = platformHome; hammer.rotation.x = hammerHome; hammer.visible = false; }
    else if (mode === 'collect') {
      inventory.pressedPaper++; pressedCount++; wraps.forEach(wrap => { wrap.visible = false; });
      mode = pressedCount >= dye.snapshot().target ? 'fold' : 'load';
    } else if (mode === 'fold') {
      if (!fast || inventory.pressedPaper < 2 || inventory.copper < 1) return false;
      inventory.pressedPaper -= 2; inventory.copper--; inventory.petal++; petalsMade++; foldSheets = 0; audio.chime?.();
      mode = petalsMade >= 3 ? 'done' : 'fold';
      if (mode === 'done') onComplete();
    }
    else return false;
    syncPressTools();
    if (!fast) wait = .2;
    emit(); return true;
  }
  return {
    open(nextBench) {
      active = true; bench = nextBench || dyeBench;
      if (bench.id === 'press' && !pressStarted) { inventory.copper = Math.max(inventory.copper, 3); pressStarted = true; }
      syncVisual(); emit();
    },
    close() { dye.act('pause'); interaction.clear(); lastInteractionDrag = null; motion = null; active = false; wait = 0; syncVisual(); }, snapshot,
    key(code) {
      if (!active || blocked()) return false;
      if (dyeActive()) {
        if (code === 'KeyD') { perform('discard'); return true; }
        if (code !== 'KeyE') return false;
        const s = dye.snapshot();
        const action = { dye: 'pick', atDye: 'immerse', dyeing: 'immerse', readyToDryAll: 'dry', collectDyed: 'collect' }[s.mode];
        if (action) perform(action); return true;
      }
      return code === 'KeyE' && mode !== 'strike' && mode !== 'fold' && pressAction();
    },
    keyUp(code) { if (code === 'KeyE') { const wasHolding = dye.snapshot().holding; dye.act('pause'); syncVisual(wasHolding); emit(); } },
    pick() { if (dyeActive()) return dye.snapshot().mode === 'dye' && perform('pick'); return active && pressAction(); },
    beginPartDrag(key, x, y) { return interaction.begin(key, x, y); },
    update(dt, elapsed = 0) {
      interaction.update(elapsed);
      const dragNow = interaction.snapshot().drag;
      if (dragNow && !lastInteractionDrag) { motion = null; visualMode = null; }
      lastInteractionDrag = dragNow;
      if (blocked()) { dye.act('pause'); return; }
      if (dyeActive() || dye.snapshot().mode === 'dryingAll') dye.update(dt);
      if (wrapAnimating) {
        wrapElapsed = Math.min(1.4, wrapElapsed + dt);
        syncPressTools();
        if (wrapElapsed >= 1.4) wrapAnimating = false;
      }
      if (motion) {
        motion.time += dt;
        const t = Math.min(1, motion.time / motion.duration), k = t * t * (3 - 2 * t);
        paper.position.lerpVectors(motion.from, motion.to, k); paper.position.y += Math.sin(t * Math.PI) * .09;
        paper.rotation.x = motion.fromAngle + (motion.toAngle - motion.fromAngle) * k;
        if (t === 1) motion = null;
      }
      if (!interaction.snapshot().drag) syncVisual();
      if (wait) wait = Math.max(0, wait - dt);
      const s = dye.snapshot();
      const signature = `${active}:${bench?.id}:${s.mode}:${s.timer}:${s.holding}:${!!motion}:${wait > 0}:${Math.floor(wrapElapsed * 10)}`;
      if (signature !== lastUiSignature) { lastUiSignature = signature; emit(); }
    },
    back,
    skip() {
      if (!canSkip() || wait || wrapAnimating || blocked()) return false;
      interaction.clear(); lastInteractionDrag = null; motion = null;
      if (!dyeActive()) return pressAction(true);
      const ok = dye.skip(); syncVisual(); emit(); return ok;
    },
    // Large-step shortcut remains limited to the current bench, never silently consumes other materials.
    batch() {
      if (!active || blocked()) return false;
      if (dyeActive()) { let guard = 0; while (dye.snapshot().canSkip && guard++ < 64) dye.skip(); syncVisual(); emit(); return true; }
      let guard = 0; while (canSkip() && guard++ < 64) pressAction(true); return true;
    },
    reset() {
      history.length = 0; pressStarted = false; dye.reset(); wrapElapsed = 0; wrapAnimating = false;
      inventory.pressedPaper = inventory.copper = inventory.petal = 0;
      mode = 'load'; wait = petalsMade = strikeHits = foldSheets = 0; motion = null; interaction.clear(); visualMode = null;
      platform.position.y = platformHome; hammer.rotation.x = hammerHome; pressedCount = 0; syncPressTools(); syncVisual(); emit();
    },
    get busy() { return !!wait || !!motion || wrapAnimating; }
  };
}
