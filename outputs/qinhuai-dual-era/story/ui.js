import {LANTERNS} from './content.mjs';

// HUD only: the authored world and gameplay saves remain owned by the controller.
const bookIcon = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 8C12 4 7 4 3 5v21c5-2 9-1 13 2 4-3 8-4 13-2V5c-4-1-9-1-13 3Zm0 0v20M7 10c2 0 4 0 6 2m-6 4c2 0 4 0 6 2m6-6c2-2 4-2 6-2m-6 8c2-2 4-2 6-2"/></svg>';
const cameraIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h5l2-3h4l2 3h5v13H3Z"/><circle cx="12" cy="13" r="4"/></svg>';
const arrow = side => `<img class="story-arrow" src="./story/assets/ui/arrow-${side}.png" alt="">`;

export function createStoryUI(){
 const root=document.createElement('div');root.id='storyUI';
 root.innerHTML=`
 <section id="storyMenu" aria-labelledby="storyTitle">
  <div class="story-menu-inner"><p class="story-eyebrow">上元 · 秦淮 · 灯会</p><h1 id="storyTitle">秦淮<span>灯火</span></h1><p class="story-lead">沿街寻灯，亲手留下一点光。</p>
  <div class="story-menu-actions"><button id="storyStart" class="story-primary" disabled>开始游玩 <span>赏七盏灯，赴一场灯会</span></button><button id="storyContinue" hidden disabled>继续旅程</button><button id="storyPreview" disabled>预览场景 <span>调整你搭建的秦淮灯会</span></button></div>
  <p id="storyLoadStatus" role="status">正在准备你搭建的场景…</p><p class="story-menu-foot">预览与游玩共用场景 · 夫子庙设有十道灯谜</p></div>
 </section>
 <nav id="storyNav" hidden aria-label="模式与图鉴">
  <button id="storyCatalogButton" class="story-guide" aria-label="打开花灯图鉴">${bookIcon}<span>花 灯 图 鉴</span><small>七灯 · 一卷</small></button>
  <div class="story-nav-tools"><button id="storyTestToggle" title="剧情测试" aria-expanded="false" aria-controls="storyTestPanel">${arrow('right')}<span>剧情测试</span></button><button id="storyBack">${arrow('left')}<span>返回菜单</span></button><button id="storyCamera">${cameraIcon}<span>切换视角</span></button></div>
 </nav>
 <section id="storyTestPanel" hidden aria-label="剧情测试">
  <header><strong>剧情测试</strong><span id="storyTestCount"></span><button id="storyTestExit" title="退出测试并恢复原进度" aria-label="退出测试并恢复原进度">×</button></header>
  <label for="storyTestSelect">当前步骤</label><select id="storyTestSelect"></select>
  <div class="story-test-actions"><button id="storyTestPrev" title="上一步">${arrow('left')}<span>上一步</span></button><button id="storyTestReplay" title="重播当前步骤" aria-label="重播当前步骤">↻</button><button id="storyTestNext" title="下一步"><span>下一步</span>${arrow('right')}</button></div>
  <p id="storyTestStatus" role="status" aria-live="polite"></p>
 </section>
 <section id="storyQuest" hidden aria-label="当前任务与七灯进度">
  <p class="story-eyebrow">秦 淮 · 灯 会</p><h2 id="storyChapter">初入灯坊</h2>
  <div class="story-act-line"><img src="./story/assets/ui/diamond.png" alt=""><p id="storyAct"></p></div>
  <p id="storyObjective" aria-live="polite"></p>
  <div class="story-progress-heading"><span>赏灯手记</span><p id="storyCount"></p></div>
  <ol id="storyLampProgress" aria-label="七种花灯赏灯顺序">${LANTERNS.map(l=>`<li data-lamp="${l.id}"><span class="story-step-mark" aria-hidden="true"></span><span class="story-step-name">${l.name}</span><span class="story-step-status">待赏</span></li>`).join('')}</ol>
  <div class="story-task-note"><p class="story-note-title"><span id="storyTaskSeal">壹</span>此行 · 提示</p><p id="storyDetail"></p></div>
  <p id="storySaveWarning" role="status"></p>
 </section>
 <section id="storyMapPanel" hidden role="button" tabindex="0" aria-label="打开秦淮灯会大地图"><div class="story-map-title">秦淮游踪 <span>点击展开地图</span></div><canvas id="storyMap" width="560" height="400" aria-label="你的位置、当前任务与灯会建筑"></canvas><p id="storyRouteStatus" role="status"></p><p id="storyMapLegend">▲ 所在之处　◇ 此行目的　○ 花灯</p></section>
 <aside id="storyControls" hidden aria-label="操作提示"><p><kbd>W A S D</kbd><span>漫游灯街</span></p><p><kbd>E</kbd><span>靠近花灯后欣赏</span></p><p><img src="./story/assets/ui/mouse-look.png" alt="鼠标"><span>拖动鼠标 · 环顾四周</span></p></aside>
 <div id="storyObservationHint" hidden><kbd>E</kbd> <span id="storyObservationHintText">按E继续</span></div><div id="storyLampMarker" hidden aria-label="当前赏灯目标">◇</div>
 <div id="storyPrompt" hidden></div><div id="storyToast" role="status" aria-live="polite" hidden></div>
 <section id="storyDialogue" role="dialog" aria-modal="false" aria-labelledby="storySpeaker" hidden><p id="storySpeaker"></p><p id="storySubtitle"></p><div class="story-dialogue-actions"><span id="storyVoiceStatus"></span><button id="storyDialogueRetry" hidden>重试配音</button><button id="storyDialogueCancel">暂时离开</button><button id="storyDialogueNext"><span>继续</span>${arrow('right')}</button></div></section>
 <section id="storyRiddle" role="dialog" aria-modal="true" aria-labelledby="storyRiddleTitle" hidden><div class="story-riddle-card"><button id="storyRiddleClose" class="story-close" aria-label="关闭灯谜">×</button><p class="story-eyebrow">夫子庙 · 灯谜会</p><p id="storyRiddleNumber" class="story-riddle-number"></p><h2 id="storyRiddleTitle">灯笼谜签</h2><p id="storyRiddleText" class="story-riddle-text"></p><form id="storyRiddleForm"><label for="storyRiddleAnswer">你的答案</label><div class="story-riddle-entry"><input id="storyRiddleAnswer" name="answer" autocomplete="off" placeholder="输入谜底" maxlength="24"><button type="submit">提交答案</button></div></form><p id="storyRiddleFeedback" role="status" aria-live="polite"></p><p id="storyRiddleProgress" class="story-riddle-progress"></p><p class="story-riddle-foot">答对五题即可返回师傅；十题都可继续挑战</p></div></section>
 <section id="storyModal" role="dialog" aria-modal="true" aria-labelledby="storyModalTitle" hidden><div class="story-modal-card"><button id="storyModalClose" class="story-close" aria-label="关闭">×</button><p class="story-eyebrow">秦 淮 · 灯 火</p><h2 id="storyModalTitle"></h2><div id="storyModalContent"></div><div id="storyModalActions"></div></div></section>`;
 document.body.append(root);const el=id=>root.querySelector('#story'+id);
 let toastTimer;return {root,el,toast(text){el('Toast').textContent=text;el('Toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el('Toast').hidden=true,4200);},
 setMode(mode){document.documentElement.dataset.storyMode=mode;el('Menu').hidden=mode!=='menu';el('Nav').hidden=mode==='menu';for(const id of ['Quest','MapPanel','CatalogButton','Camera','Controls','TestToggle'])el(id).hidden=mode!=='play';window.dispatchEvent(new CustomEvent('qinhuai-story-mode',{detail:{mode}}));},
 quest(state){
  const actParts=state.act.split(' · ');el('Chapter').textContent=actParts[1]||state.act;el('Act').textContent=state.act;el('TaskSeal').textContent=({'第一幕':'壹','第二幕':'贰','第三幕':'叁','第四幕':'肆'})[actParts[0]]||'壹';
  el('Objective').textContent=state.objective;if(state.stage==='riddles'){el('Count').textContent=`${state.data.solvedRiddles.length} / ${state.data.solvedRiddles.length>=5?10:5}`;el('Count').setAttribute('aria-label',`已猜对 ${state.data.solvedRiddles.length} 道灯谜`);}else{el('Count').textContent=`${state.data.observed.length} / 7`;el('Count').setAttribute('aria-label',`已赏 ${state.data.observed.length} 种，共 7 种`);} el('SaveWarning').textContent=state.warning;el('Count').parentElement.querySelector('span').textContent=state.stage==='riddles'?'猜灯谜进度':'赏灯手记';el('LampProgress').hidden=state.stage==='riddles';
  for(const item of el('LampProgress').children){const done=state.data.observed.includes(item.dataset.lamp),active=state.stage==='observe'&&state.currentLantern?.id===item.dataset.lamp;item.classList.toggle('is-complete',done);item.classList.toggle('is-current',active);if(active)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');item.querySelector('.story-step-status').textContent=done?'已赏':active?'此行':'待赏';}
 },
 showModal(title,content,buttons=[]){el('ModalTitle').textContent=title;el('ModalContent').replaceChildren();if(typeof content==='string'){const p=document.createElement('p');p.textContent=content;el('ModalContent').append(p);}else el('ModalContent').append(content);el('ModalActions').replaceChildren();for(const {label,action} of buttons){const button=document.createElement('button');button.textContent=label;button.onclick=action;el('ModalActions').append(button);}el('Modal').hidden=false;el('ModalClose').focus();},
 dispose(){clearTimeout(toastTimer);root.remove();}};
}
