const key = 'qinhuai-menu-sounds-v1';
const CLICK_START = .39;
const CLICK_DURATION = 1.3;
function createSounds() {
  let enabled = true, volume = .5, lastHover = -Infinity;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (typeof saved?.enabled === 'boolean') enabled = saved.enabled;
    if (Number.isFinite(saved?.volume)) volume = Math.max(0, Math.min(1, saved.volume));
  } catch {}
  const pools = new Map(), buffers = new Map(), voices = new Map(), fallbackTimers = new WeakMap();
  const files = {click: 'chime1', hover: 'change', flip: 'flip', settings: 'clap-click'};
  let context, gain;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({latencyHint: 'interactive'});
    gain = context.createGain();
    gain.gain.value = volume;
    gain.connect(context.destination);
  } catch {}
  const snapshot = () => ({enabled, volume});
  function save() { try { localStorage.setItem(key, JSON.stringify(snapshot())); } catch {} }
  function mediaVoice(kind) {
    let pool = pools.get(kind);
    if (!pool) { pool = []; pools.set(kind, pool); }
    let audio = pool.find(item => item.paused || item.ended);
    if (!audio && pool.length < 3) {
      audio = new Audio('./menu-assets/' + files[kind] + '.mp3');
      audio.preload = 'auto';
      audio.load();
      pool.push(audio);
    }
    return audio;
  }
  function unlock() {
    if (enabled && context?.state === 'suspended') context.resume().catch(() => {});
  }
  document.addEventListener('pointerdown', unlock, {capture: true, passive: true});
  document.addEventListener('keydown', unlock, {capture: true});
  // Decode during the menu, not on the first click. No game assets are involved.
  for (const [kind, file] of Object.entries(files)) {
    if (!context) { mediaVoice(kind); continue; }
    fetch('./menu-assets/' + file + '.mp3')
      .then(response => { if (!response.ok) throw new Error('Audio unavailable'); return response.arrayBuffer(); })
      .then(data => context.decodeAudioData(data))
      .then(buffer => {
        buffers.set(kind, {buffer, offset: kind === 'click' ? CLICK_START : 0});
      })
      .catch(() => { mediaVoice(kind); });
  }
  return {
    snapshot,
    setEnabled(value) {
      enabled = !!value;
      if (!enabled) {
        for (const pool of pools.values()) for (const audio of pool) audio.pause();
        for (const active of voices.values()) for (const source of active) { source.stop(); source.disconnect(); }
        voices.clear();
      }
      save();
    },
    setVolume(value) {
      if (Number.isFinite(value)) volume = Math.max(0, Math.min(1, value));
      if (gain) gain.gain.setValueAtTime(volume, context.currentTime);
      for (const pool of pools.values()) for (const audio of pool) audio.volume = volume;
      save();
    },
    play(kind) {
      if (!enabled || !Object.hasOwn(files, kind)) return;
      if (kind === 'hover') {
        if (context && context.state !== 'running') return;
        const now = performance.now();
        if (now - lastHover < 100) return;
        lastHover = now;
      }
      const decoded = buffers.get(kind);
      if (decoded && context.state !== 'closed') {
        unlock();
        let active = voices.get(kind);
        if (!active) { active = new Set(); voices.set(kind, active); }
        if (kind === 'click') {
          for (const previous of active) { previous.stop(); previous.disconnect(); }
          active.clear();
        }
        if (active.size >= 3) return;
        const source = context.createBufferSource();
        source.buffer = decoded.buffer;
        source.connect(gain);
        source.onended = () => { active.delete(source); source.disconnect(); };
        active.add(source);
        if (kind === 'click') source.start(0, decoded.offset, Math.min(CLICK_DURATION, decoded.buffer.duration - decoded.offset));
        else source.start(0, decoded.offset);
        return;
      }
      const audio = mediaVoice(kind);
      if (!audio) return;
      audio.volume = volume;
      if (kind === 'click') {
        const timer = fallbackTimers.get(audio);
        if (timer) clearTimeout(timer);
        audio.currentTime = CLICK_START;
      } else audio.currentTime = 0;
      try { audio.play()?.catch(() => {}); } catch {}
      if (kind === 'click') fallbackTimers.set(audio, setTimeout(() => { audio.pause(); audio.currentTime = 0; }, CLICK_DURATION * 1000));
    },
  };
}
// The shell and bundled scene share one bounded pool.
export const menuSounds = window.__QINHUAI_MENU_SOUNDS__ ||= createSounds();
