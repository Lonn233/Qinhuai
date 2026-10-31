import * as THREE from 'three';

let seed = 20261022;
function random() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function resetRandom(value = 20261022) { seed = value; }

function canvas(size = 512) {
  const node = document.createElement('canvas');
  node.width = node.height = size;
  return [node, node.getContext('2d')];
}

function finish(node, repeat = [1, 1], srgb = true) {
  const texture = new THREE.CanvasTexture(node);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.anisotropy = 8;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function mottle(ctx, size, count, alpha, light = false) {
  for (let i = 0; i < count; i++) {
    const x = random() * size, y = random() * size, r = 0.4 + random() * 2.4;
    ctx.fillStyle = light ? `rgba(255,244,219,${alpha * random()})` : `rgba(34,20,10,${alpha * random()})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
}

export function woodTexture({ base = '#3d2517', light = '#7c4c2d', dark = '#1d1009', repeat = [2, 1], planks = 4 } = {}) {
  const size = 1024, [node, ctx] = canvas(size);
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
  const plank = size / planks;
  for (let p = 0; p < planks; p++) {
    const y0 = p * plank;
    const shade = 0.82 + random() * 0.34;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = p % 2 ? light : dark;
    ctx.fillRect(0, y0, size, plank);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.09;
    ctx.fillStyle = '#000';
    for (let i = 0; i < 46; i++) {
      const sy = y0 + random() * plank;
      ctx.beginPath();
      ctx.lineWidth = 0.5 + random() * 2.2;
      ctx.strokeStyle = i % 3 ? light : '#0b0603';
      ctx.moveTo(-20, sy);
      for (let x = 0; x <= size + 24; x += 24) {
        const drift = Math.sin(x * 0.013 + p * 2.4 + i) * (2 + random() * 3) + Math.sin(x * 0.05 + i * 1.7) * 0.8;
        ctx.lineTo(x, sy + drift);
      }
      ctx.stroke();
    }
    ctx.restore();
    for (let i = 0; i < 5; i++) {
      const x = random() * size, y = y0 + random() * plank;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 10 + random() * 22);
      grad.addColorStop(0, 'rgba(24,12,6,.3)'); grad.addColorStop(1, 'rgba(24,12,6,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(8,4,2,.45)'; ctx.fillRect(0, y0, size, 2);
    ctx.fillStyle = `rgba(255,210,150,${0.035 * shade})`; ctx.fillRect(0, y0 + 2, size, 1);
  }
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = i % 2 ? '#f0c795' : '#160b05';
    ctx.fillRect(0, random() * size, size, 0.5 + random() * 1.5);
  }
  ctx.globalAlpha = 1;
  mottle(ctx, size, 2000, 0.05, true);
  return finish(node, repeat);
}

export function stoneTexture() {
  const size = 1024, [node, ctx] = canvas(size);
  ctx.fillStyle = '#9d9586'; ctx.fillRect(0, 0, size, size);
  const tile = 256;
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const tone = 148 + Math.floor(random() * 25);
    ctx.fillStyle = `rgb(${tone},${tone - 5},${tone - 17})`;
    ctx.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);
    const grad = ctx.createLinearGradient(x * tile, y * tile, (x + 1) * tile, (y + 1) * tile);
    grad.addColorStop(0, 'rgba(255,248,233,.1)'); grad.addColorStop(0.6, 'rgba(80,70,55,.02)'); grad.addColorStop(1, 'rgba(60,50,38,.12)');
    ctx.fillStyle = grad; ctx.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = i % 4 ? 'rgba(73,64,51,.05)' : 'rgba(255,250,238,.08)';
      const rx = x * tile + 8 + random() * (tile - 16), ry = y * tile + 8 + random() * (tile - 16);
      ctx.beginPath(); ctx.ellipse(rx, ry, 1 + random() * 9, 0.5 + random() * 3, random() * 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(72,63,50,.35)'; ctx.lineWidth = 2; ctx.strokeRect(x * tile + 1, y * tile + 1, tile - 2, tile - 2);
  }
  mottle(ctx, size, 3000, 0.04, true);
  return finish(node, [4, 3.4]);
}

export function plasterTexture() {
  const size = 512, [node, ctx] = canvas(size);
  ctx.fillStyle = '#d8c9ae'; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 5200; i++) {
    ctx.fillStyle = i % 3 ? `rgba(112,93,68,${0.015 + random() * 0.03})` : `rgba(255,250,235,${0.03 + random() * 0.05})`;
    ctx.beginPath(); ctx.arc(random() * size, random() * size, 0.4 + random() * 2.8, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(92,72,48,${0.025 + random() * 0.02})`; ctx.lineWidth = 1 + random() * 2;
    ctx.beginPath();
    let x = random() * size, y = random() * size;
    ctx.moveTo(x, y);
    for (let j = 0; j < 7; j++) { x += (random() - 0.5) * 55; y += random() * 20; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  return finish(node, [3, 2]);
}

export function linenTexture({ tint = '#ded2bb' } = {}) {
  const size = 512, [node, ctx] = canvas(size);
  ctx.fillStyle = tint; ctx.fillRect(0, 0, size, size);
  for (let x = 0; x < size; x += 3) {
    ctx.fillStyle = x % 6 ? 'rgba(255,252,242,.14)' : 'rgba(130,112,84,.05)';
    ctx.fillRect(x, 0, 1.4, size);
  }
  for (let y = 0; y < size; y += 3) {
    ctx.fillStyle = y % 6 ? 'rgba(98,81,57,.035)' : 'rgba(255,250,236,.1)';
    ctx.fillRect(0, y, size, 1.2);
  }
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(120,98,68,${0.02 + random() * 0.05})`;
    ctx.fillRect(random() * size, random() * size, 2 + random() * 8, 0.5 + random() * 1.4);
  }
  return finish(node, [2, 2]);
}

export function clothTexture({ base = '#2f1c14', pattern = '#b64c3c' } = {}) {
  const size = 512, [node, ctx] = canvas(size);
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(255,220,180,.05)'; ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke(); }
  ctx.fillStyle = pattern; ctx.globalAlpha = 0.24;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    ctx.beginPath(); ctx.arc(32 + i * 64, 32 + j * 64, 9, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  return finish(node, [1, 1]);
}

export function bambooTexture({ base = '#d9c18b', dark = '#9c7a42' } = {}) {
  const size = 512, [node, ctx] = canvas(size);
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 420; i++) {
    const y = random() * size;
    ctx.strokeStyle = `rgba(${i % 3 ? '110,80,40' : '255,242,200'},${0.025 + random() * 0.075})`;
    ctx.lineWidth = 0.5 + random() * 1.5;
    ctx.beginPath(); ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 0.9);
    ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    const y = (i + 0.35) * size / 7;
    ctx.fillStyle = 'rgba(122,88,42,.18)'; ctx.fillRect(0, y, size, 2);
    ctx.fillStyle = 'rgba(255,248,218,.22)'; ctx.fillRect(0, y + 2, size, 1);
  }
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = `rgba(98,71,36,${0.03 + random() * 0.04})`;
    ctx.fillRect(random() * size, random() * size, 1 + random() * 2, 6 + random() * 34);
  }
  return finish(node, [1, 2]);
}

export function paperTexture({ base = '#f4ecdd', fiber = '170,143,105' } = {}) {
  const size = 512, [node, ctx] = canvas(size);
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1600; i++) {
    const x = random() * size, y = random() * size, len = 2 + random() * 14, a = random() * Math.PI;
    ctx.strokeStyle = `rgba(${fiber},${0.02 + random() * 0.06})`; ctx.lineWidth = 0.4 + random() * 0.8;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
  }
  const grad = ctx.createRadialGradient(size * 0.35, size * 0.25, 30, size * 0.5, size * 0.5, size * 0.8);
  grad.addColorStop(0, 'rgba(255,252,242,.28)'); grad.addColorStop(1, 'rgba(160,130,92,.07)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size);
  return finish(node, [1, 1]);
}

export function radialShadowTexture() {
  const size = 256, [node, ctx] = canvas(size);
  const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0,0,0,.44)');
  grad.addColorStop(0.45, 'rgba(0,0,0,.26)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size);
  return finish(node, [1, 1]);
}

export function dustTexture() {
  const size = 64, [node, ctx] = canvas(size);
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,242,214,1)');
  grad.addColorStop(0.35, 'rgba(255,236,197,.65)');
  grad.addColorStop(1, 'rgba(255,230,190,0)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size);
  return finish(node, [1, 1]);
}

export function glowTexture() {
  const size = 256, [node, ctx] = canvas(size);
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,246,224,.95)');
  grad.addColorStop(0.18, 'rgba(255,224,174,.6)');
  grad.addColorStop(0.55, 'rgba(255,183,102,.15)');
  grad.addColorStop(1, 'rgba(255,160,70,0)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size);
  return finish(node, [1, 1]);
}

export function latticeTexture() {
  const size = 512, [node, ctx] = canvas(size);
  ctx.fillStyle = '#e7d4b1'; ctx.fillRect(0, 0, size, size);
  const glow = ctx.createLinearGradient(0, 0, 0, size);
  glow.addColorStop(0, 'rgba(255,243,213,.75)'); glow.addColorStop(0.55, 'rgba(240,210,164,.25)'); glow.addColorStop(1, 'rgba(212,173,119,.25)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(92,58,30,.72)'; ctx.lineWidth = 7;
  for (let i = 0; i <= 8; i++) {
    ctx.beginPath(); ctx.moveTo(i * size / 8, 0); ctx.lineTo(i * size / 8, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * size / 8); ctx.lineTo(size, i * size / 8); ctx.stroke();
  }
  ctx.lineWidth = 13;
  ctx.strokeRect(8, 8, size - 16, size - 16);
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,233,193,.22)';
  for (let i = 0; i <= 8; i++) {
    ctx.beginPath(); ctx.moveTo(i * size / 8 + 4, 0); ctx.lineTo(i * size / 8 + 4, size); ctx.stroke();
  }
  return finish(node, [1, 1]);
}

export function skyTexture() {
  const size = 256, [node, ctx] = canvas(size);
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#f6e5c2'); grad.addColorStop(0.45, '#f1d7ad'); grad.addColorStop(0.7, '#d8b98c'); grad.addColorStop(1, '#b99770');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 18; i++) {
    const x = random() * size, y = 70 + random() * 160, r = 18 + random() * 60;
    const fog = ctx.createRadialGradient(x, y, 0, x, y, r);
    fog.addColorStop(0, 'rgba(255,248,232,.34)'); fog.addColorStop(1, 'rgba(255,248,232,0)');
    ctx.fillStyle = fog; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  return finish(node, [1, 1]);
}

export function plaqueTexture(text, sub = '') {
  const w = 1024, h = 320, node = document.createElement('canvas');
  node.width = w; node.height = h;
  const ctx = node.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#4a2b18'); grad.addColorStop(0.5, '#2a160c'); grad.addColorStop(1, '#3b2112');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 200; i++) {
    ctx.strokeStyle = `rgba(255,196,120,${0.008 + random() * 0.02})`;
    ctx.beginPath(); const y = random() * h; ctx.moveTo(0, y); ctx.lineTo(w, y + (random() - 0.5) * 6); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(205,159,89,.55)'; ctx.lineWidth = 4; ctx.strokeRect(17, 17, w - 34, h - 34);
  ctx.strokeStyle = 'rgba(205,159,89,.17)'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, w - 60, h - 60);
  ctx.fillStyle = '#e7c07c';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '500 150px "Songti SC","STSong","SimSun",serif';
  ctx.fillText(text, w / 2, sub ? h / 2 - 22 : h / 2 - 4);
  if (sub) {
    ctx.font = '36px "Songti SC","STSong","SimSun",serif';
    ctx.fillStyle = 'rgba(228,190,126,.7)';
    ctx.fillText(sub, w / 2, h / 2 + 92);
  }
  return finish(node, [1, 1]);
}

export function labelTexture(title, sub) {
  const w = 512, h = 192, node = document.createElement('canvas');
  node.width = w; node.height = h;
  const ctx = node.getContext('2d');
  ctx.fillStyle = '#2c1a10'; ctx.fillRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, 'rgba(140,92,48,.24)'); grad.addColorStop(0.5, 'rgba(30,18,10,.1)'); grad.addColorStop(1, 'rgba(150,98,50,.18)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(212,167,100,.42)'; ctx.lineWidth = 4; ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#e8c88d';
  ctx.font = '500 67px "Songti SC","STSong","SimSun",serif';
  ctx.fillText(title, w / 2, 80);
  ctx.font = '31px "Songti SC","STSong","SimSun",serif'; ctx.fillStyle = 'rgba(218,183,128,.62)';
  ctx.fillText(sub, w / 2, 139);
  return finish(node, [1, 1]);
}

export function scrollTexture() {
  const w = 512, h = 1024, node = document.createElement('canvas');
  node.width = w; node.height = h;
  const ctx = node.getContext('2d');
  ctx.fillStyle = '#eadfc8'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(106,78,46,.22)';
  for (let i = 0; i < 600; i++) ctx.fillRect(random() * w, random() * h, 1 + random() * 2, 2 + random() * 20);
  ctx.strokeStyle = 'rgba(62,48,31,.68)'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(170, 180);
  for (let i = 0; i < 11; i++) ctx.lineTo(170 + Math.sin(i * 1.7) * 60 + i * 4, 180 + i * 46);
  ctx.stroke();
  for (let i = 0; i < 28; i++) {
    const t = random(), y = 130 + random() * 560, x = 115 + random() * 240;
    ctx.fillStyle = `rgba(74,56,33,${0.25 + random() * 0.4})`;
    ctx.beginPath(); ctx.ellipse(x, y, 4 + random() * 13, 2 + random() * 5, random() * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(112,41,32,.7)';
  ctx.font = '42px "Songti SC","STSong","SimSun",serif';
  ctx.textAlign = 'center';
  ctx.fillText('荷 风', 256, 860);
  ctx.fillStyle = 'rgba(112,41,32,.55)'; ctx.fillRect(234, 900, 44, 44);
  ctx.fillStyle = '#e8dcc2'; ctx.font = '22px serif'; ctx.fillText('灯', 256, 930);
  return finish(node, [1, 1]);
}

export function petalGradientTexture() {
  const size=512,[node,ctx]=canvas(size);
  const grad=ctx.createLinearGradient(0,size,0,0);
  grad.addColorStop(0,'#f5ebd9');grad.addColorStop(.22,'#f3dce7');grad.addColorStop(.62,'#eca8d5');grad.addColorStop(1,'#c967b0');
  ctx.fillStyle=grad;ctx.fillRect(0,0,size,size);
  // Fine pressed-paper veins fan from the base and converge near the pointed tip.
  for(let i=0;i<110;i++){
    const t=i/109, x=t*size;
    ctx.strokeStyle='rgba(153,65,130,'+(.14+(i%3)*.025)+')';ctx.lineWidth=.65;
    ctx.beginPath();ctx.moveTo(size*.5+(x-size*.5)*.12,size);
    ctx.bezierCurveTo(x,size*.78,x,size*.30,size*.5+(x-size*.5)*.10,0);ctx.stroke();
  }
  return finish(node,[1,1]);
}

export function leafTexture() {
  const size = 512, [node, ctx] = canvas(size);
  const grad = ctx.createLinearGradient(0, size, 0, 0);
  grad.addColorStop(0, '#1f452e'); grad.addColorStop(0.5, '#2e5d38'); grad.addColorStop(1, '#4d7d46');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(180,206,142,.16)'; ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const x = random() * size;
    ctx.beginPath(); ctx.moveTo(size / 2, size); ctx.quadraticCurveTo(x, size * .5, x, 0); ctx.stroke();
  }
  return finish(node, [1, 1]);
}
