const $ = id => document.getElementById(id);

const ORDINALS = ['壹', '贰', '叁', '肆'];

const STEPS = [
  {
    name: '收竹篾',
    tips: ['长篾短篾，尽数收入栏中', '竹篾备齐，再往合成台']
  },
  {
    name: '制作大小竹圈',
    tips: ['大小竹圈，分别弯制扎口', '成圈收好，再开始搭架']
  },
  {
    name: '搭建荷花骨架',
    tips: ['先取大圈，逐根安装弧骨', '再取小圈，三处连接扎牢']
  },
  {
    name: '安装三点吊挂',
    tips: ['竹圈弧骨，接点已扎紧', '金丝接红线，三点向上汇聚']
  }
];

const ITEMS = [
  { key: 'twist', name: '棉花纸捻', full: '棉花纸捻', kind: 'material' },
  { key: 'wire', name: '金丝红线', full: '金丝红线三点吊挂', kind: 'material' },
  { key: 'longBamboo', name: '长竹篾', full: '62 厘米长竹篾', kind: 'material' },
  { key: 'arcBamboo', name: '弧骨篾', full: '40 厘米竹篾 ×3', kind: 'material' },
  { key: 'smallBamboo', name: '圈篾', full: '小圈竹篾', kind: 'material' },
  { key: 'bigHoop', name: '大竹圈', full: '已扎口的大竹圈', kind: 'material' },
  { key: 'smallHoop', name: '小竹圈', full: '已扎口的小竹圈', kind: 'material' },
  { key: 'frame', name: '灯骨架', full: '荷花灯骨架', kind: 'crafted' },
  { key: 'nonwoven', name: '白色无纺布', full: '半圆形白色无纺布', kind: 'material' },
  { key: 'lining', name: '红色裱布', full: '红色内衬裱布', kind: 'material' },
  { key: 'paper', name: '染纸', full: '待染色纸张', kind: 'material' },
  { key: 'wetPaper', name: '湿纸', full: '刚染好的湿纸', kind: 'material' },
  { key: 'dyedPaper', name: '粉红染纸', full: '阴干后的粉红色纸张', kind: 'material' },
  { key: 'pressedPaper', name: '压花纸', full: '压模成形的花瓣纸', kind: 'material' },
  { key: 'copper', name: '铜丝', full: '制作花瓣的铜丝', kind: 'material' },
  { key: 'petal', name: '粉色花瓣', full: '已制作完成的粉色花瓣', kind: 'crafted' }
];

const TASK_HINTS = {
  pickLong: '台面竹篾均可收取，对准任意一根，高亮后按 E 收入物品栏。',
  pickArc: '台面竹篾均可收取，备齐三根 40 厘米弧骨篾。',
  pickSmall: '台面竹篾均可收取，还需备齐小圈用篾。',
  toAssembly: '竹篾已收齐。按 F 离开竹篾台，走到合成台开始弯制搭框。',
  waitingParts: '竹篾未齐。先回竹篾操作台收齐长篾、三根 40 厘米竹篾与圈篾。',
  toBendBig: '在合成台把 62 厘米长竹篾从物品栏拖到台面亮点，随后按住左键弯成大圈。',
  bendBig: '按住左键匀力慢弯，弧度落入金带后松手；右键可松劲回弹。',
  bindBig: '大圈首尾已搭接。从物品栏拖出棉花纸捻，落到搭接处扎紧。',
  collectBig: '大圈已扎口。按 E 或点击台面大圈，将成品收入物品栏，再制作小圈。',
  collectSmall: '小圈已扎口。按 E 或点击台面小圈，将成品收入物品栏，随后开始搭架。',
  placeBig: '大小竹圈已备齐。从物品栏拖出大竹圈，放到悬空亮点，开始搭建荷花骨架。',
  toBendArc: '从物品栏取一根 40 厘米竹篾，拖到台面亮点，弯成底部圆弯、两端朝上的 U 形弧骨。',
  bendArc: '弯出宽圆的弧线，落入金带后松手，再拖动弧骨安装。',
  toBendSmall: '大圈已收入物品栏。取圈篾拖到台面亮点，弯成小竹圈。',
  bendSmall: '小圈弧度更急，慢慢加力，别一次弯过。',
  bindSmall: '小圈首尾搭接。拖出棉花纸捻，扎紧收口。',
  assembleWire: '拖出金丝红线，连接主大圈上的三个落点，向上汇成三棱锥吊挂。',
  placeArc: '拖动已弯好的弧骨到大圈亮点，让弧骨两端对齐。',
  bindArc: '将棉花纸捻拖到亮点，分别扎紧当前弧骨两端，再制作下一根。',
  placeSmall: '三根弧骨已扎牢。从物品栏拖出小竹圈，放到弧骨顶端亮点。',
  bindTop: '将棉花纸捻依次拖到小圈的三处亮点，交叉扎牢后再安装三点吊挂。',
  done: '骨架已成。按 F 退出工作台，或再扎一只。'
};

const MODE_LABEL = {
  pick: '待取', toBend: '待弯', bend: '弯制', bindBig: '扎口', place: '放圈', bindSmall: '扎口',
  toAssembly: '待合', assemble: '立架', bind: '捆扎', waiting: '待料', done: '已成'
};

function itemName(key) {
  return (ITEMS.find(item => item.key === key) || {}).name || '构件';
}

const MOUSE = {
  left: '<span class="mouse-icon"><svg viewBox="0 0 24 34"><rect x="3" y="2" width="18" height="30" rx="9"/><path class="key active" d="M3 12h8V2H12A9 9 0 0 0 3 11v1Z"/><path class="wheel" d="M12 8v7"/></svg></span>',
  right: '<span class="mouse-icon"><svg viewBox="0 0 24 34"><rect x="3" y="2" width="18" height="30" rx="9"/><path class="key active" d="M21 12h-8V2h-1a9 9 0 0 1 9 9v1Z"/><path class="wheel" d="M12 8v7"/></svg></span>',
  drag: '<span class="mouse-icon drag"><svg viewBox="0 0 24 34"><rect x="3" y="2" width="18" height="30" rx="9"/><path class="wheel" d="M12 8v9"/><path d="m12 20 2 2-2 2-2-2 2-2Z"/></svg></span>'
};

const STORAGE_KEY = 'hehua-workbench-settings-v1';
const DEFAULT_SETTINGS = { music: true, musicVolume: .42, sfxVolume: .58, sensitivity: 1 };

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      music: parsed.music !== false,
      musicVolume: Number.isFinite(parsed.musicVolume) ? clamp(parsed.musicVolume, 0, 1) : .42,
      sfxVolume: Number.isFinite(parsed.sfxVolume) ? clamp(parsed.sfxVolume, 0, 1) : .58,
      sensitivity: Number.isFinite(parsed.sensitivity) ? clamp(parsed.sensitivity, .4, 1.8) : 1
    };
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (error) {}
}

function fallbackThumb(key) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.translate(80, 80);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const bamboo = ctx.createLinearGradient(-60, -20, 60, 20);
  bamboo.addColorStop(0, '#b99a63');
  bamboo.addColorStop(.5, '#f0dcaa');
  bamboo.addColorStop(1, '#a98751');
  ctx.strokeStyle = bamboo;
  ctx.fillStyle = bamboo;
  if (key === 'longBamboo' || key === 'arcBamboo' || key === 'smallBamboo') {
    const len = key === 'longBamboo' ? 116 : key === 'arcBamboo' ? 104 : 82;
    ctx.save();
    ctx.rotate(-.24);
    ctx.lineWidth = key === 'longBamboo' ? 12 : 10;
    ctx.beginPath();
    ctx.moveTo(-len / 2, 0);
    ctx.lineTo(len / 2, 0);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(117,83,40,.42)';
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * len / 6, -5.5);
      ctx.lineTo(i * len / 6, 5.5);
      ctx.stroke();
    }
    ctx.restore();
  } else if (key === 'bigHoop' || key === 'smallHoop') {
    const radius = key === 'bigHoop' ? 49 : 27;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * .58, -.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#f1e7d1';
    ctx.lineWidth = 3;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(radius - 5 + i * 2, -13);
      ctx.lineTo(radius - 4 + i * 2, -3);
      ctx.stroke();
    }
  } else if (['nonwoven', 'lining'].includes(key)) {
    ctx.save(); ctx.rotate(-.2);
    ctx.fillStyle = key === 'lining' ? '#a92732' : '#f3efe4';
    ctx.strokeStyle = key === 'lining' ? '#e36b68' : '#c9c2b4';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-48, 36); ctx.lineTo(-48, 2); ctx.quadraticCurveTo(0, -55, 48, 2); ctx.lineTo(48, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.setLineDash([4, 5]); ctx.strokeStyle = key === 'lining' ? '#f2b1a1' : '#bcb4a5';
    ctx.beginPath(); ctx.moveTo(-42, 29); ctx.quadraticCurveTo(0, -22, 42, 29); ctx.stroke(); ctx.restore();
  } else if (['paper', 'wetPaper', 'dyedPaper', 'pressedPaper'].includes(key)) {
    const colors = { paper: '#f6edcf', wetPaper: '#e2bac3', dyedPaper: '#e899aa', pressedPaper: '#e89aaa' };
    ctx.save(); ctx.rotate(-.18); ctx.fillStyle = colors[key]; ctx.strokeStyle = '#b9a987'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-38, -45); ctx.lineTo(30, -45); ctx.lineTo(42, -32); ctx.lineTo(42, 45); ctx.lineTo(-38, 45); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (key === 'pressedPaper') { ctx.strokeStyle = '#c96d84'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2, 30); ctx.quadraticCurveTo(-18, 0, 0, -25); ctx.quadraticCurveTo(19, 0, 2, 30); ctx.stroke(); }
    ctx.restore();
  } else if (key === 'copper') {
    ctx.strokeStyle = '#c68b4d'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 45); ctx.bezierCurveTo(-42, 2, 42, -5, 0, -45); ctx.stroke();
  } else if (key === 'petal') {
    ctx.fillStyle = '#e98fa7'; ctx.strokeStyle = '#b85472'; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { ctx.save(); ctx.rotate(i * Math.PI * 2 / 5); ctx.beginPath(); ctx.ellipse(0, -24, 12, 28, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = '#f0cf7c'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
  } else if (key === 'twist') {
    ctx.strokeStyle = '#f1e7d1';
    ctx.lineWidth = 7;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, 42 - i * 6, i * .8, i * .8 + 4.6);
      ctx.stroke();
    }
  } else if (key === 'wire') {
    ctx.lineWidth = 4;
    for (const [x, y] of [[-42, 28], [0, 43], [42, 28]]) {
      const tx = x * .72, ty = y + (-44 - y) * .28;
      ctx.strokeStyle = '#d9b26f';
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.strokeStyle = '#c52c30';
      ctx.beginPath();
      ctx.moveTo(tx, ty); ctx.lineTo(0, -44);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = bamboo;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(0, 24, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, -46, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#e8dcc2';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const a = Math.PI / 6 + i * Math.PI * 2 / 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 40, 24 + Math.sin(a) * 40);
      ctx.lineTo(Math.cos(a) * 20, -46 + Math.sin(a) * 20);
      ctx.stroke();
    }
  }
  return canvas.toDataURL('image/png');
}

export function createUI({ audio, thumbnails = {}, onStart, onResetStep, onBackToStart, onCraftAgain, onInventoryDragStart, onStageSkip, onStageBack }) {
  const settings = loadSettings();
  const els = {
    loading: $('loading'),
    hud: $('hud'),
    start: $('start-screen'),
    startButton: $('start-button'),
    phaseLabel: $('phase-label'),
    phaseCount: $('phase-count'),
    phaseTips: $('phase-tips'),
    substeps: $('substeps'),
    substepItems: Array.from(document.querySelectorAll('#substeps li')),
    taskOrdinal: $('task-ordinal'),
    taskName: $('task-name'),
    taskHint: $('task-hint'),
    taskBar: $('task-progress-bar'),
    stepBack: $('step-back'),
    stepSkip: $('step-skip'),
    stationFoot: $('station-foot'),
    tipsToggle: $('tips-toggle'),
    guideButton: $('guide-button'),
    musicButton: $('music-button'),
    settingsButton: $('settings-button'),
    stationPrompt: $('station-prompt'),
    promptText: $('prompt-text'),
    toast: $('toast'),
    bendPanel: $('bend-panel'),
    bendBand: $('bend-band'),
    bendFill: $('bend-fill'),
    bendMarker: $('bend-marker'),
    bendReadout: $('bend-readout'),
    bendTip: $('bend-tip'),
    hints: document.querySelector('.hint-stack'),
    invTrack: $('inv-track'),
    invWindow: document.querySelector('.inv-window'),
    invLeft: $('inv-left'),
    invRight: $('inv-right'),
    invCaption: $('inv-caption'),
    crosshair: $('crosshair'),
    guide: $('guide-dialog'),
    settingsDialog: $('settings-dialog'),
    complete: $('complete-dialog'),
    locked: $('locked-dialog'),
    lockedTitle: $('locked-title'),
    lockedText: $('locked-text'),
    musicToggle: $('music-toggle'),
    musicVolume: $('music-volume'),
    musicVolumeValue: $('music-volume-value'),
    sfxVolume: $('sfx-volume'),
    sfxVolumeValue: $('sfx-volume-value'),
    sensitivity: $('sensitivity'),
    sensValue: $('sens-value'),
    resetStep: $('reset-step'),
    backToStart: $('back-to-start'),
    keepLooking: $('keep-looking'),
    craftAgain: $('craft-again')
  };

  const slots = new Map();
  let started = false;
  let stageState = null;
  let selectedIndex = 0;
  let activeBench = false;
  let nearBench = null;
  let hintSignature = '';
  let promptSignature = '';
  let toastTimer = 0;
  let crosshairOn = false;

  function iconFor(key) {
    return thumbnails[key] || fallbackThumb(key);
  }

  function buildInventory() {
    els.invTrack.innerHTML = '';
    ITEMS.forEach((item, index) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'inv-slot';
      slot.dataset.key = item.key;
      slot.title = item.full;
      slot.innerHTML = `
        <span class="icon-wrap"><img class="item-img" src="${iconFor(item.key)}" alt="${item.full}"></span>
        <span class="name">${item.name}</span>
        <span class="count">×0</span>
        <span class="lock" hidden>待制</span>
        <img class="gold-frame" src="./assets/ui/07_下方方形徽章.png" alt="">
      `;
      slot.addEventListener('click', () => {
        selectInventory(index);
      });
      slot.addEventListener('pointerdown', event => {
        if (event.button !== 0 || !activeBench || !stageState || stageState.busy) return;
        if (stageState.draggable !== item.key) return;
        selectInventory(index);
        if (!onInventoryDragStart?.(item.key, event)) return;
        event.preventDefault();
        slot.classList.add('dragging');
        const clear = () => {
          slot.classList.remove('dragging');
          window.removeEventListener('pointerup', clear);
          window.removeEventListener('pointercancel', clear);
        };
        window.addEventListener('pointerup', clear);
        window.addEventListener('pointercancel', clear);
      });
      els.invTrack.appendChild(slot);
      slots.set(item.key, slot);
    });
    syncInventory();
  }

  function syncInventory() {
    const inv = stageState?.inventory || {};
    const available = ITEMS.filter(item => (inv[item.key] || 0) > 0);
    if (!available.some(item => item.key === ITEMS[selectedIndex]?.key)) {
      selectedIndex = ITEMS.findIndex(item => item.key === available[0]?.key);
      if (selectedIndex < 0) selectedIndex = 0;
    }
    const focusedItem = ITEMS[selectedIndex] || ITEMS[0];
    els.invTrack.querySelectorAll('.inv-slot').forEach(slot => {
      const visible = (inv[slot.dataset.key] || 0) > 0;
      slot.hidden = !visible;
      slot.classList.toggle('selected', visible && slot.dataset.key === focusedItem.key);
    });
    const slot = slots.get(focusedItem.key);
    if (slot) {
      const windowRect = els.invWindow.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      if (slotRect.left < windowRect.left) els.invWindow.scrollLeft -= windowRect.left - slotRect.left;
      else if (slotRect.right > windowRect.right) els.invWindow.scrollLeft += slotRect.right - windowRect.right;
    }
    if (!stageState) {
      els.invCaption.textContent = `滚轮切换 · ${focusedItem.name}`;
      return;
    }
    const counts = { ...inv };
    const mode = stageState.mode || '';
    const suppressSelection = activeBench
      && (mode.startsWith('pick') || mode.startsWith('bend') || mode === 'toAssembly'
        || mode === 'waitingParts' || mode.startsWith('collect'));
    for (const item of ITEMS) {
      const slot = slots.get(item.key);
      if (!slot) continue;
      const count = counts[item.key] || 0;
      const dragReady = activeBench && !stageState.busy && stageState.draggable === item.key;
      slot.classList.toggle('selected', !suppressSelection && count > 0 && item.key === focusedItem.key);
      slot.classList.toggle('empty', count <= 0);
      slot.classList.remove('locked');
      slot.classList.toggle('drag-ready', dragReady);
      slot.title = dragReady ? `按住拖出${item.name} · 移到黄白亮点` : item.full;
      slot.querySelector('.count').textContent = `×${count}`;
      slot.querySelector('.lock').hidden = true;
    }
    let caption;
    if (!available.length) caption = '物品栏暂无物品';
    else if (!activeBench) caption = `滚轮切换 · ${focusedItem.name}`;
    else if (mode.startsWith('pick')) caption = '台面拾取 · 鼠标对准材料后按 E';
    else if (mode === 'toAssembly') caption = '竹篾已齐 · 按 F 前往合成台';
    else if (mode === 'waitingParts') caption = '竹篾未齐 · 先回竹篾台收篾';
    else if (mode.startsWith('toBend')) caption = `拖出${itemName(stageState.draggable)} · 放到台面亮点`;
    else if (mode.startsWith('bend')) caption = '竹篾在手 · 按住左键弯制';
    else if (mode === 'bindBig') caption = '拖出棉花纸捻 · 扎紧大圈搭接';
    else if (mode === 'collectBig' || mode === 'collectSmall') caption = '竹圈已扎好 · 按 E 或点击竹圈收入物品栏';
    else if (mode === 'placeBig') caption = '拖出大竹圈 · 放到悬空亮点开始搭架';
    else if (mode === 'bindSmall') caption = '拖出棉花纸捻 · 扎紧小圈收口';
    else if (mode === 'assembleWire') caption = '拖出金丝红线 · 安装三点吊挂';
    else if (mode === 'bindArc') caption = `拖出棉花纸捻 · 扎第 ${(stageState.arcsPlaced || 0) + 1} 根弧骨第 ${(stageState.arcEnd || 0) + 1} 端`;
    else if (mode === 'bindTop') caption = `拖出棉花纸捻 · 固定小圈 ${(stageState.smallTies || 0) + 1} / 3`;
    else if (mode === 'placeArc') caption = '拖动已弯好的弧骨 · 对准骨架亮点';
    else if (mode === 'placeSmall') caption = '拖出小竹圈 · 放到弧骨顶端亮点';
    else if (stageState.phase > 1) caption = stageState.draggable ? `拖出${itemName(stageState.draggable)} · 放到亮点` : '按 E 确认当前工序';
    else if (stageState.done) caption = `架上成品 · ${focusedItem.name}`;
    else caption = `滚轮切换 · ${focusedItem.name}`;
    els.invCaption.textContent = caption;
  }

  function selectionKey() {
    return (ITEMS[selectedIndex] || ITEMS[0]).key;
  }

  function cycleSelection(dir) {
    const inv = stageState?.inventory || {};
    const available = ITEMS.map((item, index) => ({ item, index })).filter(({ item }) => (inv[item.key] || 0) > 0);
    if (!available.length) return;
    const current = available.findIndex(({ index }) => index === selectedIndex);
    const next = (current + dir + available.length) % available.length;
    selectInventory(available[next].index);
  }

  function selectInventory(index) {
    const inv = stageState?.inventory || {};
    if ((inv[ITEMS[index]?.key] || 0) <= 0) return;
    const changed = selectedIndex !== index;
    selectedIndex = index;
    syncInventory();
    if (changed) audio.change?.();
  }

  function focusInventory(key) {
    const index = ITEMS.findIndex(item => item.key === key);
    if (index >= 0) selectedIndex = index;
    syncInventory();
  }

  function renderHints(rows) {
    const signature = rows.map(row => `${row.icon || 'key'}:${row.key}:${row.text}`).join('|');
    if (signature === hintSignature) return;
    hintSignature = signature;
    els.hints.innerHTML = rows.slice(0, 3).map(row => {
      const icon = row.icon ? MOUSE[row.icon] : `<span class="keycap${row.wide ? ' wide' : ''}">${row.key}</span>`;
      return `<div class="hint-row">${icon}<span class="hint-text">${row.text}</span></div>`;
    }).join('');
  }

  function hintsForState() {
    if (!started) return [];
    if (!activeBench) {
      if (nearBench) {
        return [
          { key: 'F', text: nearBench.locked ? `查看 · ${nearBench.name}` : `进入 · ${nearBench.name}` },
          { key: 'W A S D', wide: true, text: '走近工作台' },
          { icon: 'drag', text: '按住拖动 · 环视灯坊' }
        ];
      }
      return [
        { key: 'W A S D', wide: true, text: '漫游灯坊' },
        { key: 'F', text: '靠近工作台时进入' },
        { icon: 'drag', text: '按住拖动 · 环视四周' }
      ];
    }
    if (!stageState) return [{ key: 'F', text: '退出工作台' }];
    const mode = stageState.mode;
    if (stageState.phase === 3 && stageState.hints) return stageState.hints;
    if (stageState.phase > 1) {
      return stageState.draggable
        ? [{ icon: 'drag', text: `从物品栏拖出${itemName(stageState.draggable)} · 至黄白亮点` }, { key: 'E', text: '确认当前工序' }, { key: 'F', text: '退出工作台' }]
        : [{ key: 'E', text: '确认当前工序' }, { key: 'F', text: '退出工作台' }];
    }
    if (stageState.done) {
      return [
        { key: 'F', text: '退出工作台' },
        { key: 'J', text: '翻阅指导书' }
      ];
    }
    if (mode.startsWith('bend')) {
      return [
        { icon: 'left', key: '左键', text: '按住 · 弯曲竹篾' },
        { icon: 'right', key: '右键', text: '松劲 · 竹篾回弹' },
        { key: 'F', text: '退出工作台' }
      ];
    }
    if (mode === 'collectBig' || mode === 'collectSmall') {
      return [
        { key: 'E', text: '收起竹圈 · 收入物品栏' },
        { icon: 'left', text: '点击台面竹圈 · 收起' },
        { key: 'F', text: '退出工作台' }
      ];
    }
    if (stageState.draggable) {
      return [
        { icon: 'drag', text: `从物品栏拖出${itemName(stageState.draggable)} · 至黄白亮点` },
        { key: 'F', text: '退出工作台' }
      ];
    }
    if (mode === 'toAssembly') {
      return [
        { key: 'F', text: '离开竹篾台 · 前往合成台' },
        { key: 'J', text: '翻阅指导书' }
      ];
    }
    if (mode === 'waitingParts') {
      return [
        { key: 'F', text: '退出 · 回竹篾台收篾' },
        { key: 'J', text: '翻阅指导书' }
      ];
    }
    if (mode.startsWith('pick')) {
      return [
        { key: '鼠标', text: '对准材料 · 待其高亮' },
        { key: 'E', text: '收入物品栏' },
        { key: 'F', text: '退出工作台' }
      ];
    }
    return [
      { key: 'F', text: '退出工作台' },
      { key: 'J', text: '翻阅指导书' }
    ];
  }

  function refreshHints() {
    renderHints(hintsForState());
  }

  function updateTask(state) {
    if (!state) return;
    stageState = state;
    const dyeTimer = $('dye-timer');
    if (dyeTimer) {
      dyeTimer.hidden = !(state.active && state.benchId === 'dye' && state.dye?.timerVisible);
      if (!dyeTimer.hidden) {
        dyeTimer.dataset.quality = state.dye.quality;
        $('dye-time').textContent = state.dye.timer;
        $('dye-quality').textContent = { light: '颜色偏浅 · 未足两分钟', ready: '颜色合格 · 可以阴干', dark: '颜色过深 · 按 D 丢弃' }[state.dye.quality];
        $('dye-timer-state').textContent = state.dye.holding ? '浸染中 · 松开 E 暂停' : '已暂停 · 按住 E 继续';
      }
    }
    els.stepBack.closest('.step-controls').hidden = !state.active;
    els.stepBack.hidden = false;
    els.stepSkip.hidden = false;
    els.stepBack.disabled = !state.canBack || !!state.busy;
    els.stepSkip.disabled = !state.canSkip || (!!state.busy && !state.binding);
    if (state.phase > 1) {
      const phaseName = state.phase === 2 ? '第二步 · 裱糊' : '第三步 · 制作花瓣';
      const step = state.step || 0;
      els.phaseLabel.textContent = phaseName;
      els.phaseCount.textContent = state.done ? '已 成' : `${state.phase === 2 ? '贰' : '叁'} / 肆`;
      els.phaseTips.innerHTML = (state.phase === 2
        ? ['下半贴白布，上半贴红布', '蘸浆、贴布、裁边逐步完成']
        : ['先染色阴干，再压模成形', '两张压花纸加铜丝，制成粉色花瓣'])
        .map(text => `<p><i></i>${text}</p>`).join('');
      els.taskOrdinal.textContent = state.phase === 2 ? '贰' : '叁';
      els.taskName.textContent = state.taskName || (state.phase === 2 ? '裱糊' : '制作花瓣');
      els.taskHint.textContent = state.taskHint || '';
      els.taskBar.style.width = `${Math.round((state.progress || 0) * 100)}%`;
      els.hud.classList.remove('suspension-stage');
      const names = state.phase === 3 ? ['染色并阴干花瓣纸', '压模花瓣纸', '用铜丝折扎花瓣'] : ['下半骨架涂浆', '粘贴白色无纺布', '上半骨架涂浆', '粘贴红色裱布'];
      els.substepItems.forEach((li, index) => {
        li.hidden = !names[index];
        li.querySelector('span').textContent = names[index] || '';
        li.classList.toggle('active', index === step);
        li.classList.toggle('done', index < step);
        const em = li.querySelector('em');
        if (em) em.textContent = index < step ? '已成' : index === step ? '进行' : '待作';
      });
      syncInventory();
      refreshHints();
      return;
    }
    const done = !!state.done;
    const stepIndex = clamp(state.step ?? 0, 0, 3);
    const step = STEPS[stepIndex];
    els.phaseLabel.textContent = '第一步 · 扎框子';
    els.phaseCount.textContent = done ? '已 成' : `${ORDINALS[stepIndex]} / 肆`;
    els.phaseTips.innerHTML = (done ? ['一篾一纸，一灯一心', '骨架已成，静候裱糊'] : step.tips)
      .map(text => `<p><i></i>${text}</p>`).join('');
    els.taskOrdinal.textContent = done ? '成' : ORDINALS[stepIndex];
    els.taskName.textContent = done ? '扎框已成' : step.name;

    const mode = state.mode || 'pickLong';
    els.hud.classList.toggle('suspension-stage', mode === 'assembleWire' || mode === 'done');
    let hint = TASK_HINTS[mode] || TASK_HINTS.pickLong;
    if (mode.startsWith('pick')) hint = `任意竹篾均可收取 · 长篾 ${Math.min(1, state.inventory.longBamboo || 0)}/1 · 弧骨篾 ${Math.min(3, state.inventory.arcBamboo || 0)}/3 · 圈篾 ${Math.min(1, state.inventory.smallBamboo || 0)}/1`;
    if (mode === 'toBendArc') hint = `从物品栏取 40 厘米竹篾拖到台面亮点 · 已合 ${Math.min(3, state.arcsPlaced || 0)} / 3 根`;
    if (mode === 'bendArc') hint = `弯出均匀弧线，落入金带后松手 · 已合 ${Math.min(3, state.arcsPlaced || 0)} / 3 根`;
    if (done) hint = TASK_HINTS.done;
    els.taskHint.textContent = hint;

    els.substepItems.forEach((li, index) => {
      li.hidden = false; li.querySelector('span').textContent = STEPS[index].name;
      li.classList.remove('active', 'done');
      const em = li.querySelector('em');
      if (done) {
        li.classList.add('done');
        em.textContent = '已成';
      } else if (index < stepIndex) {
        li.classList.add('done');
        em.textContent = '已成';
      } else if (index === stepIndex) {
        if (mode === 'toAssembly' && index === 0) {
          li.classList.add('done');
          em.textContent = '已成';
          return;
        }
        li.classList.add('active');
        if (index === 0) em.textContent = '收篾';
        else if (index === 1) {
          if (mode === 'bindBig' || mode === 'bindSmall') em.textContent = '扎口';
          else if (mode.startsWith('collect')) em.textContent = '收起';
          else if (mode.startsWith('bend')) em.textContent = '弯制';
          else em.textContent = MODE_LABEL.toBend;
        } else if (index === 2) {
          if (mode === 'toBendArc' || mode === 'bendArc') em.textContent = `${Math.min(3, state.arcsPlaced || 0)} / 3`;
          else if (mode === 'placeBig' || mode === 'placeArc' || mode === 'placeSmall') em.textContent = '放置';
          else if (mode === 'bindArc') em.textContent = `扎端 ${(state.arcEnd || 0) + 1}/2`;
          else if (mode === 'bindTop') em.textContent = `扎点 ${(state.smallTies || 0) + 1}/3`;
          else em.textContent = '弧骨';
        } else if (index === 3) {
          if (mode === 'assembleWire') em.textContent = MODE_LABEL.assemble;
          else em.textContent = '待合';
        } else em.textContent = '进行';
      } else {
        em.textContent = '待作';
      }
    });

    const fractions = {
      pickLong: .12, pickArc: .36, pickSmall: .12, toAssembly: .92,
      toBendBig: .02, bendBig: .12, bindBig: .3, collectBig: .42,
      toBendSmall: .5, bendSmall: .6, bindSmall: .78, collectSmall: .92, placeBig: .02,
      toBendArc: .1, bendArc: .5,
      placeArc: .3, bindArc: .4, placeSmall: .85, bindTop: .92, assembleWire: .5, waitingParts: 0
    };
    let within = fractions[mode] ?? .05;
    if (mode === 'pickArc') within = .1 + Math.min(3, state.arcs || 0) / 3 * .82;
    if (['toBendArc', 'bendArc', 'placeArc', 'bindArc'].includes(mode)) within = .08 + ((state.arcsPlaced || 0) + (mode === 'bindArc' ? .6 + (state.arcEnd || 0) * .2 : mode === 'placeArc' ? .5 : mode === 'bendArc' ? .2 : 0)) / 3 * .57;
    if (mode === 'bindTop') within = .88 + (state.smallTies || 0) * .035;
    const overall = done ? 1 : clamp((stepIndex + within) / 4, 0, .98);
    els.taskBar.style.width = `${(overall * 100).toFixed(1)}%`;

    const focus = state.activeStock || state.selected;
    if (focus && focus !== selectionKey()) focusInventory(focus);
    else syncInventory();

    refreshHints();
  }

  function setBend(data) {
    if (!data || !data.visible) {
      els.bendPanel.hidden = true;
      els.bendPanel.classList.remove('ready', 'over');
      return;
    }
    els.bendPanel.hidden = false;
    const max = data.max || 1.16;
    const value = clamp(data.value || 0, 0, max);
    const left = clamp((data.lo / max) * 100, 0, 100);
    const width = clamp(((data.hi - data.lo) / max) * 100, 2, 100 - left);
    els.bendBand.style.left = `${left}%`;
    els.bendBand.style.width = `${width}%`;
    els.bendFill.style.width = `${(value / max * 100).toFixed(1)}%`;
    els.bendMarker.style.left = `${(value / max * 100).toFixed(1)}%`;
    els.bendReadout.textContent = `${Math.round(value / max * 100)}%`;
    const over = !!data.over || value > data.hi;
    const ready = !!data.ready && !over;
    els.bendPanel.classList.toggle('ready', ready);
    els.bendPanel.classList.toggle('over', over);
    els.bendTip.textContent = over ? '略过一点 · 右键回弹' : ready ? '力道正好 · 松手成形' : '均匀用力 · 慢弯';
  }

  function toast(message, kind = '') {
    if (!message) return;
    els.toast.textContent = message;
    els.toast.className = `toast visible ${kind}`.trim();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('visible');
    }, 2800);
  }

  function setNear(bench, active) {
    activeBench = !!active;
    if (!activeBench && $('dye-timer')) $('dye-timer').hidden = true;
    nearBench = bench || null;
    const promptSignatureNext = activeBench ? 'active' : nearBench ? `${nearBench.id}:${nearBench.locked}` : 'none';
    if (promptSignature !== promptSignatureNext) {
      promptSignature = promptSignatureNext;
      if (activeBench) {
        els.stationPrompt.hidden = true;
      } else if (nearBench) {
        els.stationPrompt.hidden = false;
        els.promptText.textContent = `${nearBench.locked ? '查看' : '进入'} · ${nearBench.name}`;
      } else {
        els.stationPrompt.hidden = true;
      }
    }
    if (activeBench && nearBench) els.stationFoot.textContent = `${nearBench.name} · 操作中`;
    else if (nearBench) els.stationFoot.textContent = `${nearBench.name} · 近前`;
    else els.stationFoot.textContent = '灯坊 · 自由行走';
    refreshHints();
  }

  function setCrosshair(on) {
    const next = !!on;
    if (next === crosshairOn) return;
    crosshairOn = next;
    els.crosshair.classList.toggle('on', next);
  }

  function isDialogOpen() {
    return !!document.querySelector('dialog[open]');
  }

  function openGuide() {
    if (isDialogOpen()) return;
    setCrosshair(false);
    els.guide.showModal();
    audio.flip?.();
  }

  function openSettings() {
    if (isDialogOpen()) return;
    audio.soft?.();
    syncSettingsControls();
    setCrosshair(false);
    els.settingsDialog.showModal();
  }

  function showLocked(bench) {
    if (!bench) return;
    els.lockedTitle.textContent = bench.id === 'assembly' ? '合成台 · 待料' : `${bench.name} · 未启`;
    const later = {
      assembly: '先到竹篾操作台收齐 62 厘米长篾、三根 40 厘米竹篾与小圈用篾。竹篾备齐后，合成台自会点亮。',
      dye: '这一道工序将在后续版本开放。染缸里的颜色，正等着第一片花瓣。',
      press: '这一道工序将在后续版本开放。花瓣的细密褶皱，要在压模上慢慢成形。'
    };
    els.lockedText.textContent = later[bench.id] || '这一道工序将在后续版本开放。';
    audio.lock?.();
    if (!isDialogOpen()) els.locked.showModal();
  }

  function showComplete() {
    setBend(null);
    setCrosshair(false);
    if (isDialogOpen()) return;
    audio.soft?.();
    els.complete.showModal();
  }

  function syncMusicButton() {
    els.musicButton.classList.toggle('is-on', settings.music);
    els.musicButton.classList.toggle('paused', !settings.music);
    els.musicToggle.checked = settings.music;
  }

  function syncSettingsControls() {
    els.musicToggle.checked = settings.music;
    els.musicVolume.value = String(Math.round(settings.musicVolume * 100));
    els.musicVolumeValue.textContent = `${Math.round(settings.musicVolume * 100)}%`;
    els.sfxVolume.value = String(Math.round(settings.sfxVolume * 100));
    els.sfxVolumeValue.textContent = `${Math.round(settings.sfxVolume * 100)}%`;
    els.sensitivity.value = String(Math.round(settings.sensitivity * 100));
    els.sensValue.textContent = settings.sensitivity.toFixed(1);
    syncMusicButton();
  }

  function setMusic(enabled) {
    settings.music = !!enabled;
    audio.setMusicEnabled(settings.music);
    syncMusicButton();
    saveSettings(settings);
  }

  function applySettings() {
    audio.setMusicVolume(settings.musicVolume);
    audio.setSfxVolume(settings.sfxVolume);
    audio.setMusicEnabled(settings.music);
    syncSettingsControls();
  }

  function mountInventory() {
    buildInventory();
    els.invLeft.addEventListener('click', () => cycleSelection(-1));
    els.invRight.addEventListener('click', () => cycleSelection(1));
  }

  els.startButton.addEventListener('click', () => {
    if (started) return;
    started = true;
    audio.start();
    onStart?.();
    els.start.classList.add('hide');
    els.hud.hidden = false;
    els.loading.classList.add('hide');
    setTimeout(() => { els.loading.hidden = true; }, 900);
    refreshHints();
    audio.soft?.();
  });

  els.stepBack.addEventListener('click', () => onStageBack?.());
  els.stepSkip.addEventListener('click', () => onStageSkip?.());

  els.tipsToggle.addEventListener('click', () => {
    const panel = document.querySelector('.task-panel');
    const collapsed = panel.classList.toggle('collapsed');
    els.tipsToggle.textContent = collapsed ? '展开' : '收起';
    audio.soft?.();
  });

  els.guideButton.addEventListener('click', openGuide);
  els.guide.addEventListener('close', () => audio.flip?.());
  els.settingsButton.addEventListener('click', openSettings);
  els.musicButton.addEventListener('click', () => setMusic(!settings.music));

  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
      const dialog = $(button.dataset.close);
      dialog?.close();
      if (dialog !== els.guide) audio.soft?.();
    });
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });

  els.musicToggle.addEventListener('change', () => setMusic(els.musicToggle.checked));
  els.musicVolume.addEventListener('input', () => {
    settings.musicVolume = Number(els.musicVolume.value) / 100;
    els.musicVolumeValue.textContent = `${els.musicVolume.value}%`;
    audio.setMusicVolume(settings.musicVolume);
    saveSettings(settings);
  });
  els.sfxVolume.addEventListener('input', () => {
    settings.sfxVolume = Number(els.sfxVolume.value) / 100;
    els.sfxVolumeValue.textContent = `${els.sfxVolume.value}%`;
    audio.setSfxVolume(settings.sfxVolume);
    audio.soft?.();
    saveSettings(settings);
  });
  els.sensitivity.addEventListener('input', () => {
    settings.sensitivity = Number(els.sensitivity.value) / 100;
    els.sensValue.textContent = settings.sensitivity.toFixed(1);
    saveSettings(settings);
  });

  els.resetStep.addEventListener('click', () => {
    els.settingsDialog.close();
    onResetStep?.();
  });
  els.backToStart.addEventListener('click', () => {
    els.settingsDialog.close();
    onBackToStart?.();
  });
  els.keepLooking.addEventListener('click', () => {
    els.complete.close();
    audio.soft?.();
  });
  els.craftAgain.addEventListener('click', () => {
    els.complete.close();
    onCraftAgain?.();
  });

  mountInventory();
  applySettings();
  els.hud.hidden = true;

  return {
    ready() {
      els.loading.classList.add('hide');
      setTimeout(() => { els.loading.hidden = true; }, 900);
    },
    update: updateTask,
    setBend,
    setNear,
    setCrosshair,
    toast,
    openGuide,
    openSettings,
    showLocked,
    showComplete,
    cycleSelection,
    isDialogOpen,
    get started() { return started; },
    get settings() { return { ...settings }; },
    get selectedKey() { return selectionKey(); },
    closeDialogs() {
      document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    }
  };
}
