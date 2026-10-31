const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname, '..');

(async () => {
  const {PERFORMANCE_PROFILES, performanceProfile} = await import(pathToFileURL(path.join(root, 'import-performance-profiles.mjs')));
  const viewer = fs.readFileSync(path.join(root, 'qinhuai-modern-import.js'), 'utf8');
  const initialization = viewer.match(/^let activePerformanceProfile = .*;$/m);
  assert.ok(initialization, 'runtime quality is initialized explicitly');
  const applied = [];
  const context = {performanceProfile, applyPerformanceProfile() { applied.push(context.getProfile()); }};
  vm.createContext(context);
  vm.runInContext(initialization[0] + '\nfunction getProfile() { return activePerformanceProfile; }', context);
  assert.equal(context.getProfile(), 'smooth', 'new visits default to smooth');
  assert.equal(PERFORMANCE_PROFILES[context.getProfile()].bloom, true);
  assert.equal(PERFORMANCE_PROFILES[context.getProfile()].shadowSize, 1024);

  const setter = viewer.slice(viewer.indexOf('function setPerformanceProfile('), viewer.indexOf('\nfunction applyMapLights('));
  vm.runInContext(setter, context);
  for (const profile of ['low', 'original', 'smooth']) {
    assert.equal(context.setPerformanceProfile(profile), profile, 'manual quality selection still works');
  }
  assert.deepEqual(applied, ['low', 'original', 'smooth']);

  const html = fs.readFileSync(path.join(root, 'qinhuai-modern-import.html'), 'utf8');
  const selector = html.match(/<select id="performanceQuality">([\s\S]*?)<\/select>/)[1];
  assert.match(selector, /<option value="smooth" selected>/);
  assert.doesNotMatch(selector, /<option value="low" selected>/);
  const version = html.match(/import-viewer-startup\.js\?v=([^"']+)/)[1];
  const startup = fs.readFileSync(path.join(root, 'import-viewer-startup.js'), 'utf8');
  assert.ok(startup.includes('qinhuai-modern-import.bundle.js?v=' + version), 'loader and bundle cache versions match');
  console.log('PASS: smooth runtime and selector defaults, unchanged quality presets, manual switching, matching cache versions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
