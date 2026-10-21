// Paint the controls before loading/evaluating Three.js and compiling GPU programs.
(() => {
  const status = document.querySelector('#status');
  const progress = document.querySelector('#progress');
  const title = document.querySelector('#progressTitle');
  const detail = document.querySelector('#progressText');
  let timer;
  const startup = window.__QINHUAI_STARTUP__ = {
    phase: '界面已显示，正在准备三维引擎', error: null,
    stage(message) { this.phase = message; status.textContent = message; },
    fail(error) {
      clearTimeout(timer);
      this.error = String(error?.message || error);
      const panel = document.querySelector('#errors');
      panel.style.display = 'block';
      panel.textContent = '查看器启动或运行失败：' + this.error;
      const retry = document.createElement('button'); retry.textContent = '重新加载';
      retry.onclick = () => location.reload(); panel.appendChild(retry);
      progress.classList.remove('show'); status.textContent = panel.textContent;
    },
    ready() { clearTimeout(timer); if (!this.error) this.phase = '场景已加载'; },
  };
  const isNonFatalPointerLockError = error => /pointer.?lock|root document.*valid for pointer lock/i.test(String(error?.message || error));
  window.addEventListener('error', event => {
    if (event.error && !isNonFatalPointerLockError(event.error)) startup.fail(event.error);
  });
  window.addEventListener('unhandledrejection', event => {
    if (!isNonFatalPointerLockError(event.reason)) startup.fail(event.reason);
  });
  progress.classList.add('show'); title.textContent = '正在启动查看器';
  detail.textContent = '先显示操作界面，再初始化三维场景…';
  timer = setTimeout(() => {
    if (!startup.error && startup.phase !== '场景已加载') {
      status.textContent = '当前阶段：' + startup.phase + '。等待较久时，请查看加载进度；多个旧的三维页面会同时占用显存。';
    }
  }, 45000);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(async () => {
      startup.stage('正在保护并读取浏览器已保存的设置…');
      try {
        const {mountScenePersistence} = await import('./main-scene-persistence.mjs?v=3');
        window.__QINHUAI_SCENE_SAVE__ = mountScenePersistence();
        await window.__QINHUAI_SCENE_SAVE__.ready;
      } catch (error) {
        const saveStatus=document.querySelector('#scenePersistence');
        if(saveStatus)saveStatus.textContent='文件存档未连接，仍使用浏览器现有设置：'+error.message;
      }
      startup.stage('正在载入三维引擎…');
      import('./qinhuai-modern-import.bundle.js?v=performance-47-spatial').catch(error => startup.fail(error));
    }, 0);
  }));
})();
