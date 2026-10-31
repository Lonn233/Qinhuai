import { summarizeSamples } from './performance-audit.js';

// Opt-in diagnostics only; no scene, quality or persistence changes.
export function installImportPerformanceAudit(api) {
  const { renderer, camera } = api;
  const gl = renderer.getContext();
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const queries = [], listeners = [], errors = [], runs = [];
  let disposed = false, busy = false, invalid = null, rows = null;
  let previous = null, tickAt = 0, renderAt = 0, renderCpu = 0, currentQuery = null, gpuRow = null;
  let firstRenderMs = null, readyMs = null, ready = false;
  let collisionAtStart = null;
  const panel = document.createElement('aside');
  panel.id = 'import-performance-audit';
  panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:10000;max-width:calc(100vw - 24px);padding:10px;background:#192127ed;color:#fff;border:1px solid #657579;border-radius:6px;font:12px/1.5 system-ui';
  panel.innerHTML = '<strong>性能采样</strong><div style="display:flex;gap:8px;margin:6px 0"><button data-run>采样当前视角 × 3</button><button data-save>导出 JSON</button><button data-close aria-label="关闭性能面板" title="关闭">×</button></div><output>等待场景加载</output>';
  document.body.appendChild(panel);
  const status = panel.querySelector('output'), button = panel.querySelector('[data-run]');
  const listen = (target, name, fn) => { target.addEventListener(name, fn); listeners.push(() => target.removeEventListener(name, fn)); };
  const invalidate = reason => { if (busy && !invalid) invalid = reason; };
  listen(document, 'visibilitychange', () => { if (document.hidden) invalidate('Page hidden'); });
  listen(window, 'resize', () => invalidate('Viewport changed'));
  for (const name of ['pointerdown', 'wheel', 'keydown', 'input', 'change']) {
    listen(document, name, event => { if (!panel.contains(event.target)) invalidate('Camera/UI input during sampling'); });
  }
  listen(window, 'error', event => { errors.push(String(event.message)); invalidate('Runtime error'); });
  listen(window, 'unhandledrejection', event => { errors.push(String(event.reason)); invalidate('Unhandled rejection'); });
  listen(renderer.domElement, 'webglcontextlost', () => invalidate('WebGL context lost'));

  function drain() {
    if (!ext) return;
    if (gl.getParameter(ext.GPU_DISJOINT_EXT)) {
      for (const item of queries) gl.deleteQuery(item.query);
      queries.length = 0;
      invalidate('GPU timer disjoint');
      return;
    }
    for (let i = queries.length - 1; i >= 0; i--) {
      const item = queries[i];
      if (gl.getQueryParameter(item.query, gl.QUERY_RESULT_AVAILABLE)) {
        item.row.gpuMs = gl.getQueryParameter(item.query, gl.QUERY_RESULT) / 1e6;
        gl.deleteQuery(item.query); queries.splice(i, 1);
      }
    }
  }
  function tickStart() {
    tickAt = performance.now();
    collisionAtStart = rows ? api.collisionStats : null;
    if (busy) drain();
  }
  function renderStart() {
    renderAt = performance.now(); gpuRow = null;
    if (!rows) return;
    gpuRow = { timestampMs: tickAt, frameMs: previous === null ? null : tickAt - previous, gpuMs: null };
    previous = tickAt;
    if (ext && queries.length < 6 && !gl.getQuery(ext.TIME_ELAPSED_EXT, gl.CURRENT_QUERY)) {
      currentQuery = gl.createQuery();
      if (currentQuery) gl.beginQuery(ext.TIME_ELAPSED_EXT, currentQuery);
    }
  }
  function renderEnd() {
    const now = performance.now(); renderCpu = now - renderAt;
    if (firstRenderMs === null) firstRenderMs = now;
    if (currentQuery) {
      gl.endQuery(ext.TIME_ELAPSED_EXT);
      queries.push({ query: currentQuery, row: gpuRow }); currentQuery = null;
    }
  }
  function tickEnd() {
    if (!rows || !gpuRow) return;
    const info = renderer.info;
    Object.assign(gpuRow, { cpuMs: renderCpu, cpuAnimationFrameMs: performance.now() - tickAt,
      calls: info.render.calls, triangles: info.render.triangles,
      geometries: info.memory.geometries, textures: info.memory.textures,
      heapBytes: performance.memory?.usedJSHeapSize ?? null });
    const collision = api.collisionStats;
    if (collision && collisionAtStart) Object.assign(gpuRow, {
      collisionMs: collision.milliseconds - collisionAtStart.milliseconds,
      collisionQueries: collision.queries - collisionAtStart.queries,
      collisionCandidates: collision.candidates - collisionAtStart.candidates });
    gpuRow.visibility = api.visibilityStats;
    rows.push(gpuRow); gpuRow = null;
  }
  function snapshot() {
    return structuredClone({ viewport: [innerWidth, innerHeight], pixelRatio: renderer.getPixelRatio(),
      pose: { position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), projection: camera.projectionMatrix.toArray() },
      loadedTileIds: api.loadedTileIds, timeOfDay: api.timeOfDay, controlMode: api.controlMode,
      performanceSettings: api.performanceSettings,
      nearLanternModels: api.nearLanternStats,
      rendererSettings: { exposure: renderer.toneMappingExposure, toneMapping: renderer.toneMapping,
        shadowEnabled: renderer.shadowMap.enabled, shadowType: renderer.shadowMap.type,
        mapLights: api.mapLightSettings, bloom: api.bloomSettings } });
  }
  const same = (a, b) => JSON.stringify(a, (_, v) => typeof v === 'number' ? Math.round(v * 1e5) / 1e5 : v)
    === JSON.stringify(b, (_, v) => typeof v === 'number' ? Math.round(v * 1e5) / 1e5 : v);
  async function wait(ms) {
    const until = performance.now() + ms;
    while (performance.now() < until) {
      if (disposed || invalid) throw new Error(invalid || 'Audit disposed');
      await new Promise(resolve => setTimeout(resolve, Math.min(100, Math.max(0, until - performance.now()))));
    }
  }
  async function run({ seconds = 10, warmupSeconds = 3, repeats = 3, label = 'optimized' } = {}) {
    if (disposed || busy) throw new Error('Audit unavailable or already running');
    if (!ready || document.hidden) throw new Error('Wait for complete scene loading in foreground');
    if (!(seconds >= 1 && seconds <= 60 && warmupSeconds >= 0 && warmupSeconds <= 30
      && Number.isInteger(repeats) && repeats >= 1 && repeats <= 10)) throw new Error('Invalid sampling duration/repeat count');
    busy = true; invalid = null; button.disabled = true;
    const result = { label, startedAt: new Date().toISOString(), seconds, warmupSeconds, repeats, valid: false, samples: [] };
    runs.push(result);
    let firstSettings = null;
    try {
      for (let i = 0; i < repeats; i++) {
        status.textContent = `第 ${i + 1}/${repeats} 轮 · 预热`;
        await wait(warmupSeconds * 1000);
        if (!ready) throw new Error('Scene readiness failed');
        const settings = snapshot();
        if (firstSettings && !same(settings, firstSettings)) throw new Error('Inconsistent repeated sample setup');
        firstSettings ||= settings;
        const sample = { ...settings, rawFrames: [] };
        result.samples.push(sample);
        previous = null; rows = sample.rawFrames;
        status.textContent = `第 ${i + 1}/${repeats} 轮 · 采样`;
        await wait(seconds * 1000);
        rows = null; previous = null;
        await wait(200); drain();
        sample.summary = summarizeSamples(sample.rawFrames);
        if (sample.rawFrames.length < 2) throw new Error('Insufficient frames');
        if (!same(settings, snapshot())) throw new Error('Camera/settings/assets changed');
      }
      if (errors.length) throw new Error('Runtime errors recorded');
      result.valid = true; status.textContent = '采样完成';
    } catch (error) {
      result.invalidReason = error.message; status.textContent = '采样无效：' + error.message;
    } finally {
      rows = null; previous = null; busy = false;
      if (!disposed) button.disabled = false;
    }
    return result;
  }
  function report() {
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    return { schema: 'qinhuai-import-performance-v1', generatedAt: new Date().toISOString(),
      url: location.href, userAgent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemoryGiB: navigator.deviceMemory ?? null,
      gpuRenderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null,
      timerQueryAvailable: !!ext, vramBytes: null,
      firstRenderSinceNavigationMs: firstRenderMs, sceneReadySinceNavigationMs: readyMs,
      errors: [...errors], runs: runs.map(result => ({ ...result, samples: result.samples.map(sample => ({
        ...sample, summary: summarizeSamples(sample.rawFrames) })) })),
      coverage: { mode: 'current-camera-only', eraSwitch: 'not-supported-by-main-import-viewer' },
      notes: ['No uploads or persistence writes. Opt-in diagnostics only.',
        'CPU animation callback excludes layout/compositor; render CPU is submission time, not GPU time.',
        'GPU time uses bounded nonblocking queries; null means unavailable, not zero.',
        'VRAM is not measured; renderer.info.memory counts objects, not bytes.',
        'Submitted triangles include all renderer passes. FPS includes browser scheduling.',
        'First render may be empty; ready time includes the required startup scene and player, not all optional views.',
        'For comparison use matching hardware, camera, loaded tiles, settings and at least three valid repeats.'] };
  }
  button.onclick = () => { run().catch(error => { status.textContent = error.message; }); };
  panel.querySelector('[data-save]').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(report(), null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'qinhuai-main-performance-' + Date.now() + '.json';
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  panel.querySelector('[data-close]').onclick = () => { invalidate('Sampling cancelled'); panel.hidden = true; };
  function dispose() {
    if (disposed) return;
    disposed = true; invalid = 'Audit disposed'; rows = null;
    if (currentQuery) { gl.endQuery(ext.TIME_ELAPSED_EXT); gl.deleteQuery(currentQuery); currentQuery = null; }
    for (const item of queries) gl.deleteQuery(item.query);
    queries.length = 0; listeners.forEach(fn => fn()); panel.remove();
  }
  listen(window, 'pagehide', dispose);
  return { tickStart, renderStart, renderEnd, tickEnd, run, report, dispose,
    markReady(ok) { ready = !!ok; readyMs = ok ? performance.now() : null;
      status.textContent = ok ? '场景就绪' : '场景未完整加载'; } };
}
