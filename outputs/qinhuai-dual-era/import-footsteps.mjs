export function createFootsteps({
  createAudio = () => new Audio(new URL('./assets/audio/walk-loop2.mp3', import.meta.url).href),
  events = window, visibility = document,
} = {}) {
  let audio = null, moving = false, pending = false, retry = false, disposed = false;
  let focused = true, running = false;
  const allowed = () => moving && focused && !visibility.hidden && !disposed;
  function pause() {
    if (!audio) return;
    audio.pause();
    if (audio.readyState > 0) audio.currentTime = 0;
  }
  function play() {
    if (!allowed() || pending || retry) return;
    if (!audio) {
      audio = createAudio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = .38;
    }
    audio.playbackRate = running ? 1.35 : 1;
    if (!audio.paused) return;
    pending = true;
    Promise.resolve().then(() => allowed() ? audio.play() : undefined).catch(() => {
      // Autoplay restrictions or a failed load retry only on the next gesture.
      if (allowed()) retry = true;
    }).finally(() => {
      pending = false;
      if (!allowed()) pause();
      else if (!retry && audio.paused) play();
    });
  }
  const unlock = () => { retry = false; play(); };
  const blur = () => { focused = false; moving = false; pause(); };
  const focus = () => { focused = true; };
  const hidden = () => { if (visibility.hidden) { moving = false; pause(); } };
  events.addEventListener('keydown', unlock);
  events.addEventListener('pointerdown', unlock);
  events.addEventListener('blur', blur);
  events.addEventListener('focus', focus);
  visibility.addEventListener('visibilitychange', hidden);
  return {
    get audio() { return audio; },
    setMoving(value, {running: isRunning = false} = {}) {
      if (disposed) return;
      moving = !!value;
      running = isRunning;
      if (allowed()) play(); else pause();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pause();
      events.removeEventListener('keydown', unlock);
      events.removeEventListener('pointerdown', unlock);
      events.removeEventListener('blur', blur);
      events.removeEventListener('focus', focus);
      visibility.removeEventListener('visibilitychange', hidden);
      if (audio) { audio.removeAttribute('src'); audio.load(); }
    },
  };
}
