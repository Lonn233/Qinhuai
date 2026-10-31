import {createWorkshopMusic} from './workshop/music.js';

export function getMainMusic() {
  if (window.__QINHUAI_MAIN_MUSIC__) return window.__QINHUAI_MAIN_MUSIC__;
  const listeners = new Set();
  const key = 'qinhuai-main-music-v1';
  const storage = {getItem: () => localStorage.getItem(key), setItem: (_, value) => localStorage.setItem(key, value)};
  const music = createWorkshopMusic({storage, onChange: state => { for (const listener of listeners) listener(state); }});
  document.querySelector('#workshop-music').id = 'main-scene-music';
  const start = () => { const s = music.snapshot(); if (!s.started || s.blocked) music.start(); };
  window.addEventListener('pointerdown', start);
  window.addEventListener('keydown', start);
  document.addEventListener('visibilitychange', () => document.hidden ? music.pause() : music.resume());
  window.__QINHUAI_MAIN_MUSIC__ = {music, subscribe(listener) { listeners.add(listener); listener(music.snapshot()); return () => listeners.delete(listener); }};
  return window.__QINHUAI_MAIN_MUSIC__;
}

export function mountMainMusic(button) {
  const {music, subscribe} = getMainMusic();
  const unsubscribe = subscribe(state => {
    const label = button.querySelector('[data-music-label]') || button;
    label.textContent = state.error ? '音乐加载失败 · 重试' : state.blocked ? '播放背景音乐' : state.enabled ? '背景音乐：开' : '背景音乐：关';
    button.setAttribute('aria-pressed', String(state.enabled));
    button.title = '赵徽柔《漫夜星》 · 点击切换背景音乐';
  });
  const toggle = () => music.toggle(); button.addEventListener('click', toggle);
  return {snapshot: music.snapshot, dispose() { unsubscribe(); button.removeEventListener('click', toggle); }};
}
