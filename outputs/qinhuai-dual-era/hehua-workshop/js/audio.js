const DEFAULT_SETTINGS = { music: true, musicVolume: .42, sfxVolume: .58 };

export function createAudio(settings = {}) {
  const state = { ...DEFAULT_SETTINGS, ...settings };
  const bgm = document.getElementById('bgm');
  let ctx = null;
  let master = null;
  let noiseBuffer = null;
  let started = false;
  let fadeToken = 0;
  const samples = new Map(['change', 'chime', 'flip', 'pick-item'].map(name => [name, {
      bytes: fetch(new URL(`../assets/audio/${name === 'chime' ? 'chime1' : name}.mp3`, import.meta.url))
      .then(response => {
        if (!response.ok) throw new Error(`Audio ${name}: HTTP ${response.status}`);
        return response.arrayBuffer();
      }).catch(() => null),
    loading: null, request: 0
  }]));

  bgm.loop = true;
  bgm.volume = 0;

  function ensureContext() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = state.sfxVolume * .75;
    master.connect(ctx.destination);
    const length = Math.floor(ctx.sampleRate * .6);
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function fadeBgm(to, duration = .9) {
    const token = ++fadeToken;
    const from = bgm.volume;
    const start = performance.now();
    const step = now => {
      if (token !== fadeToken) return;
      const k = Math.min(1, (now - start) / (duration * 1000));
      bgm.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function playMusic() {
    if (!started || !state.music) return;
    const promise = bgm.play();
    if (promise?.catch) promise.catch(() => {});
    fadeBgm(state.musicVolume, 1.4);
  }

  function start() {
    started = true;
    ensureContext();
    if (ctx) for (const name of samples.keys()) loadSample(name);
    if (state.music) playMusic();
  }

  function loadSample(name) {
    const sample = samples.get(name);
    if (!sample.loading) {
      sample.loading = sample.bytes.then(bytes => bytes ? ctx.decodeAudioData(bytes) : null)
        .catch(() => null);
    }
    return sample.loading;
  }

  async function playSample(name, gain = 1) {
    if (!started || !ensureContext() || state.sfxVolume <= 0) return;
    const sample = samples.get(name);
    const request = ++sample.request;
    const requestedAt = performance.now();
    const buffer = await loadSample(name);
    // Do not replay stale input if loading took longer than the interaction.
    if (!buffer || request !== sample.request || state.sfxVolume <= 0
      || performance.now() - requestedAt > (name === 'change' ? 250 : 1500)) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const boost = gain === 1 ? null : ctx.createGain();
    if (boost) {
      boost.gain.value = gain;
      boost.connect(master);
    }
    source.connect(boost || master);
    source.onended = () => {
      source.disconnect();
      boost?.disconnect();
    };
    source.start();
  }

  function setMusicEnabled(enabled) {
    state.music = !!enabled;
    if (!started) return;
    if (state.music) playMusic();
    else {
      fadeBgm(0, .5);
      setTimeout(() => {
        if (!state.music) bgm.pause();
      }, 560);
    }
  }

  function setMusicVolume(value) {
    state.musicVolume = Math.max(0, Math.min(1, value));
    if (state.music && started && !bgm.paused) fadeBgm(state.musicVolume, .2);
  }

  function setSfxVolume(value) {
    state.sfxVolume = Math.max(0, Math.min(1, value));
    if (master) master.gain.value = state.sfxVolume * .75;
  }

  function tone({
    freq = 440, endFreq = freq, duration = .2, type = 'sine',
    gain = .12, attack = .005, delay = 0
  } = {}) {
    if (!ctx || !master || state.sfxVolume <= 0) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + duration);
    env.gain.setValueAtTime(.0001, t0);
    env.gain.exponentialRampToValueAtTime(Math.max(.0002, gain), t0 + attack);
    env.gain.exponentialRampToValueAtTime(.0001, t0 + duration);
    osc.connect(env);
    env.connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + .03);
  }

  function noise({
    duration = .16, gain = .08, filter = 1200, type = 'bandpass',
    q = .8, delay = 0, sweepTo = null
  } = {}) {
    if (!ctx || !master || !noiseBuffer || state.sfxVolume <= 0) return;
    const t0 = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.setValueAtTime(filter, t0);
    filt.Q.value = q;
    if (sweepTo) filt.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), t0 + duration);
    const env = ctx.createGain();
    env.gain.setValueAtTime(.0001, t0);
    env.gain.exponentialRampToValueAtTime(Math.max(.0002, gain), t0 + Math.min(.03, duration * .25));
    env.gain.exponentialRampToValueAtTime(.0001, t0 + duration);
    src.connect(filt);
    filt.connect(env);
    env.connect(master);
    src.start(t0);
    src.stop(t0 + duration + .04);
  }

  const sfx = {
    change() { void playSample('change'); },
    chime() { void playSample('chime'); },
    flip() { void playSample('flip', 2); },
    pick() { void playSample('pick-item'); },
    bend(level = .3) {
      noise({ duration: .11, gain: .028 + level * .014, filter: 520 + level * 260, sweepTo: 340, q: 1.4 });
      tone({ freq: 138 + level * 34, endFreq: 120 + level * 20, duration: .13, type: 'sine', gain: .022 });
    },
    ready() {
      tone({ freq: 587.33, duration: .28, gain: .06 });
      tone({ freq: 880, duration: .38, gain: .05, delay: .09 });
    },
    bind() {
      noise({ duration: .2, gain: .07, filter: 900, sweepTo: 420, q: .7 });
      tone({ freq: 190, endFreq: 146, duration: .16, type: 'triangle', gain: .035 });
    },
    place() {
      tone({ freq: 240, endFreq: 168, duration: .16, type: 'triangle', gain: .08 });
      noise({ duration: .07, gain: .045, filter: 600, q: .6 });
    },
    success() {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((f, i) => tone({ freq: f, duration: .5, gain: .055, delay: i * .11 }));
    },
    complete() {
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        tone({ freq: f, duration: .8, gain: .06, delay: i * .16 });
        tone({ freq: f * 2, duration: .5, gain: .014, delay: i * .16 });
      });
    },
    soft() {
      tone({ freq: 330, endFreq: 250, duration: .08, type: 'triangle', gain: .026 });
    },
    lock() {
      tone({ freq: 214, endFreq: 176, duration: .22, type: 'triangle', gain: .045 });
      tone({ freq: 142, duration: .25, type: 'sine', gain: .03, delay: .06 });
    }
  };

  return {
    start, setMusicEnabled, setMusicVolume, setSfxVolume,
    get settings() { return { ...state }; },
    get musicPlaying() { return started && state.music && !bgm.paused; },
    ...sfx
  };
}
