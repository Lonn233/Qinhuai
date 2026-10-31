import {menuSounds} from './menu-sounds.js?v=predecoded-20261023';
import {getMainMusic, mountMainMusic} from './import-main-music.js';
import {StoryState, listSaveSlots, saveSlotSummary, MAX_SAVE_SLOTS} from './story/state.mjs?v=save-slots-20261023';
import {createLanternBook} from './story/book.js';

const root = document.documentElement;
const DEMO_UI_KEY = 'qinhuai.demo-ui.v1';
const defaultDemoUi = {storyHidden:false, previewHidden:false};
function readDemoUi() {
  try {return {...defaultDemoUi, ...JSON.parse(localStorage.getItem(DEMO_UI_KEY) || '{}')};}
  catch {return {...defaultDemoUi};}
}
function applyDemoUi(settings = readDemoUi()) {
  root.dataset.storyUiHidden = String(!!settings.storyHidden);
  root.dataset.previewUiHidden = String(!!settings.previewHidden);
}
applyDemoUi();
const shell = document.createElement('main');
shell.id = 'menuShell';
const options = [['play','开始游玩'],['continue','继续游玩'],['preview','预览场景'],['catalog','图鉴'],['settings','设置'],['exit','退出']];
shell.innerHTML = `<section class="menu-home"><div class="menu-composition"><p class="menu-eyebrow"><span>上 元 · 秦 淮 · 灯 会</span></p><h1 class="menu-title"><img src="./menu-assets/title.png" alt="秦淮灯会" width="365" height="240"><img class="menu-seal" src="./menu-assets/seal.png" alt="" width="24" height="42"></h1><p class="menu-tagline">沿街寻灯，亲手留下一点光。</p><nav class="menu-options" aria-label="主菜单">${options.map(([action,label],index)=>`<button data-action="${action}" class="${index===0?'is-active':''}"><span class="menu-marker" aria-hidden="true"></span><span>${label}</span><img class="menu-chevron" src="./menu-assets/chevron.png" alt="" width="9" height="14"></button>`).join('')}</nav><p class="menu-note" role="status"></p></div><button class="menu-music" aria-label="切换背景音乐"><img src="./menu-assets/music.png" alt="" width="22" height="28"><span data-music-label>播放背景音乐</span><img class="menu-equalizer" src="./menu-assets/equalizer.png" alt="" width="18" height="24"></button></section><section class="menu-loading" hidden aria-live="polite"><h2>秦淮灯会</h2><div class="menu-track" role="progressbar" aria-label="资源加载" aria-valuemin="0" aria-valuemax="100"><i></i></div><p data-load-name>正在准备…</p><button data-retry hidden>重新加载</button></section><div class="menu-modal" hidden><section class="menu-dialog" role="dialog" aria-modal="true" aria-labelledby="menuDialogTitle"><header><h2 id="menuDialogTitle"></h2><button class="menu-close" aria-label="关闭">×</button></header><div class="menu-dialog-body"></div></section></div>`;
document.body.append(shell);
const $ = selector => shell.querySelector(selector);
const home = $('.menu-home'), loading = $('.menu-loading'), modal = $('.menu-modal'), body = $('.menu-dialog-body');
const {music, subscribe} = getMainMusic();
mountMainMusic($('.menu-music'));
let entering = false, previousFocus, cleanup = () => {}, catalogBook = null;
function showMenu() {root.dataset.shell = 'menu'; shell.hidden = false; home.hidden = false; loading.hidden = true;}
function closeModal() {catalogBook?.dispose(); catalogBook = null; modal.hidden = true; cleanup(); cleanup = () => {}; previousFocus?.focus();}
function openModal(title) {catalogBook?.dispose(); catalogBook = null; previousFocus = document.activeElement; cleanup(); cleanup = () => {}; body.replaceChildren(); $('.menu-dialog').classList.remove('catalog-dialog', 'catalog-book-dialog', 'save-dialog'); $('#menuDialogTitle').textContent = title; modal.hidden = false; $('.menu-close').focus();}
$('.menu-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => {if (event.target === modal) closeModal();});
shell.addEventListener('keydown', event => {
  if (modal.hidden) return;
  if (event.key === 'Escape') {event.preventDefault(); closeModal();}
  if (event.key === 'Tab') {
    const items = [...modal.querySelectorAll('button:not(:disabled),input,a[href]')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last?.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus();}
  }
});
function settings() {
  openModal('设置');
  body.innerHTML = `<label class="menu-setting">背景音乐<input data-setting="music" type="checkbox"></label><label class="menu-setting">音乐音量<input data-setting="musicVolume" type="range" min="0" max="1" step="0.01"></label><label class="menu-setting">交互音效<input data-setting="sounds" type="checkbox"></label><label class="menu-setting">音效音量<input data-setting="soundsVolume" type="range" min="0" max="1" step="0.01"></label><div class="menu-setting-divider" role="separator">演示画面</div><label class="menu-setting menu-setting-demo"><span><strong>剧情模式界面</strong><small>隐藏任务、地图、导航、剧情测试按钮和操作提示</small></span><input data-setting="storyUiHidden" type="checkbox"></label><label class="menu-setting menu-setting-demo"><span><strong>菜单预览界面</strong><small>隐藏场景工具、性能面板、返回菜单与视角切换工具</small></span><input data-setting="previewUiHidden" type="checkbox"></label>`;
  const input = key => body.querySelector(`[data-setting="${key}"]`);
  const demoUi = readDemoUi();
  input('storyUiHidden').checked = demoUi.storyHidden;
  input('previewUiHidden').checked = demoUi.previewHidden;
  for (const [key, field] of [['storyUiHidden','storyHidden'],['previewUiHidden','previewHidden']]) {
    input(key).addEventListener('change', event => {
      const next = {...readDemoUi(), [field]:event.target.checked};
      try {localStorage.setItem(DEMO_UI_KEY, JSON.stringify(next));} catch {}
      applyDemoUi(next);
    });
  }
  cleanup = subscribe(state => {input('music').checked = state.enabled; input('musicVolume').value = state.volume;});
  input('sounds').checked = menuSounds.snapshot().enabled;
  input('soundsVolume').value = menuSounds.snapshot().volume;
  input('music').addEventListener('change', event => {menuSounds.play('settings'); music.setEnabled(event.target.checked);});
  input('musicVolume').addEventListener('input', event => music.setVolume(Number(event.target.value)));
  input('musicVolume').addEventListener('change', () => menuSounds.play('settings'));
  input('sounds').addEventListener('change', event => {if (!event.target.checked) menuSounds.play('settings'); menuSounds.setEnabled(event.target.checked); if (event.target.checked) menuSounds.play('settings');});
  input('soundsVolume').addEventListener('input', event => menuSounds.setVolume(Number(event.target.value)));
  input('soundsVolume').addEventListener('change', () => menuSounds.play('settings'));
}
function catalog() {
  menuSounds.play('flip'); openModal('秦淮灯谱');
  let observed = [];
  try {observed = new StoryState(localStorage).data.observed;} catch {}
  $('.menu-dialog').classList.add('catalog-book-dialog');
  catalogBook = createLanternBook(observed);
  body.append(catalogBook);
}
function saveCards({fresh}) {
  let slots = []; try {slots = listSaveSlots(localStorage);} catch {}
  const byId = new Map(slots.map(slot => [slot.id, slot]));
  const grid = document.createElement('div'); grid.className = 'menu-save-slots';
  for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
    const id = `slot-${i+1}`, slot = byId.get(id), summary = slot && saveSlotSummary(slot);
    if (!fresh && !slot) continue;
    const button = document.createElement('button'); button.className = 'menu-save-slot'; button.dataset.slot = id;
    button.innerHTML = `<span class="save-slot-number">存档 ${i+1}</span><strong>${slot ? summary.title : '空存档位'}</strong><span>${slot ? `${summary.progress} · ${summary.date}` : '开始一段新的旅程'}</span><small>${slot ? (fresh ? '覆盖后重新开始' : '继续此旅程') : '新建旅程'}</small>`;
    button.addEventListener('click', () => {
      menuSounds.play('click');
      if (fresh && slot) {
        body.innerHTML = `<p class="save-confirm-copy">将覆盖“存档 ${i+1}”的剧情进度，场景和灯光设置会保留。</p><div class="save-confirm-actions"><button data-cancel>返回</button><button data-confirm>覆盖并开始</button></div>`;
        body.querySelector('[data-cancel]').onclick = () => chooseNewSave();
        body.querySelector('[data-confirm]').onclick = () => enterWithOptions('play', {saveId:id,newGame:true});
      } else enterWithOptions('play', {saveId:id,newGame:fresh});
    });
    grid.append(button);
  }
  body.append(grid);
  if (!fresh && !slots.length) {const empty=document.createElement('p');empty.className='menu-empty-saves';empty.textContent='还没有旅程存档，开始游玩后会自动保存。';body.append(empty);}
}
function chooseNewSave() {openModal('开始游玩');$('.menu-dialog').classList.add('save-dialog');body.innerHTML='<p class="menu-save-intro">选择一个位置开始新的旅程</p>';saveCards({fresh:true});}
function chooseContinueSave() {openModal('继续游玩');$('.menu-dialog').classList.add('save-dialog');saveCards({fresh:false});}
function updateLoading(detail) {
  if (!entering) return;
  const bar = document.querySelector('#progressBar');
  const value = parseFloat(bar?.style.width) || (window.__QINHUAI_STARTUP__?.loaded ? 96 : 3);
  $('.menu-track i').style.width = Math.min(98, value) + '%';
  $('.menu-track').setAttribute('aria-valuenow', String(Math.round(Math.min(98, value))));
  $('[data-load-name]').textContent = detail?.phase || document.querySelector('#progressText')?.textContent || '正在加载场景…';
}
new MutationObserver(() => updateLoading()).observe(document.querySelector('#progress'), {subtree:true, childList:true, characterData:true, attributes:true});
window.addEventListener('qinhuai-startup', event => updateLoading(event.detail));
async function enter(mode) {return enterWithOptions(mode, {});}
async function enterWithOptions(mode, options) {
  if (entering) return; entering = true; home.hidden = true; loading.hidden = false; root.dataset.shell = 'loading'; $('[data-retry]').hidden = true; updateLoading({phase:'正在准备资源…'});
  try {
    modal.hidden = true;
    await window.__QINHUAI_STARTUP__.enter(mode, options);
    $('.menu-track i').style.width = '100%';
    root.dataset.shell = 'game'; shell.hidden = true;
  } catch (error) {
    console.error('进入场景失败', error);
    $('[data-load-name]').textContent = '场景加载失败，请重新加载。'; $('[data-retry]').hidden = false;
  } finally {entering = false;}
}
$('[data-retry]').onclick = () => location.reload();
for (const button of shell.querySelectorAll('[data-action]')) {
  const activate = () => {
    shell.querySelector('.menu-options .is-active')?.classList.remove('is-active');
    button.classList.add('is-active');
    menuSounds.play('hover');
  };
  button.addEventListener('pointerenter', activate);
  button.addEventListener('focus', activate);
  button.addEventListener('click', () => {
    menuSounds.play('click');
    const action = button.dataset.action;
    if (action === 'play') chooseNewSave();
    else if (action === 'continue') chooseContinueSave();
    else if (action === 'preview') enter(action);
    else if (action === 'settings') settings();
    else if (action === 'catalog') catalog();
    else {window.close(); $('.menu-note').textContent = '浏览器不允许自动关闭此标签页，请手动关闭页面。';}
  });
}
window.addEventListener('qinhuai-story-mode', event => {if (event.detail.mode === 'menu' && !entering) showMenu();});
showMenu();
