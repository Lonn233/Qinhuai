// The menu must not import the renderer until a player chooses a game mode.
(() => {
  let boot, resolveReady, rejectReady;
  const signal = () => window.dispatchEvent(new CustomEvent('qinhuai-startup', {detail: {phase: startup.phase, error: startup.error}}));
  const startup = window.__QINHUAI_STARTUP__ = {
    phase: '等待进入游戏', error: null, loaded: false,
    stage(message) { this.phase = message; document.querySelector('#status').textContent = message; signal(); },
    fail(error) {
      this.error = String(error?.message || error);
      console.error('场景启动失败', error);
      this.stage('场景加载失败，请重新加载。');
      rejectReady?.(error instanceof Error ? error : new Error(this.error));
    },
    ready() { this.loaded = true; this.stage('场景已加载'); resolveReady?.(); },
    async enter(mode, options = {}) {
      if (!['play', 'preview'].includes(mode)) throw new Error('未知的游戏模式');
      if (!boot) {
        const engineReady = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
        // Attach a rejection handler before importing the engine.
        engineReady.catch(() => {});
        boot = (async () => {
          this.stage('正在读取场景设置…');
          try {
            const {mountScenePersistence} = await import('./main-scene-persistence.mjs?v=3');
            window.__QINHUAI_SCENE_SAVE__ = mountScenePersistence();
            await window.__QINHUAI_SCENE_SAVE__.ready;
          } catch (error) {
            const label = document.querySelector('#scenePersistence');
            console.warn('场景存档未连接', error);
            if (label) label.textContent = '场景存档未连接，使用浏览器设置。';
          }
          this.stage('正在载入三维引擎…');
          await import('./qinhuai-modern-import.bundle.js?v=story-ui-hotkeys-20261023');
          await engineReady;
        })();
      }
      await boot;
      if (this.error) throw new Error(this.error);
      this.stage(mode === 'play' ? '正在准备人物与灯会旅程…' : '正在准备场景预览…');
      await window.__QINHUAI_IMPORT__.story.enter(mode, options);
      this.stage('准备完成');
    },
  };
  const nonfatal = error => /pointer.?lock|root document.*valid for pointer lock/i.test(String(error?.message || error));
  window.addEventListener('error', event => { if (boot && event.error && !nonfatal(event.error)) startup.fail(event.error); });
  window.addEventListener('unhandledrejection', event => { if (boot && !nonfatal(event.reason)) startup.fail(event.reason); });
})();
