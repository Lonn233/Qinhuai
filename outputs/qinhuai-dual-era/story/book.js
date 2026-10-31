import {LANTERNS} from './content.mjs';
import {BOOK_ENTRIES,BOOK_SOURCES} from './book-content.mjs';
import {createBookViewer} from './book-viewer.js';
import {menuSounds} from '../menu-sounds.js';
const numerals=['壹','贰','叁','肆','伍','陆','柒'];
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function button(text,action,cls=''){const el=node('button',cls,text);el.type='button';el.onclick=action;return el;}
export function createLanternBook(observed){
 const unlocked=new Set(observed),book=node('div','story-book'),unlockedLamps=LANTERNS.filter(l=>unlocked.has(l.id));let viewer=null,disposed=false;
 function clear(){viewer?.dispose();viewer=null;book.replaceChildren();}
 function overview(focusId){
  if(disposed)return;clear();book.dataset.view='index';
  const front=node('section','story-book-front');front.append(node('p','story-book-number','金陵夜游 · 花灯七记'),node('h3','','一城灯火\n七盏心意'),node('p','story-book-preface','灯彩入卷，留住一夜秦淮。\n循灯而行，把每一次驻足，\n收作书中的一页。'));
  const drawing=node('div','story-book-drawing');drawing.setAttribute('aria-hidden','true');drawing.innerHTML='<svg viewBox="0 0 240 200" fill="none"><g stroke="currentColor" stroke-width="1.15"><path d="M120 5v27m-25 0h50m-57 9h64M90 46C26 70 26 131 90 155h60c64-24 64-85 0-109H90Z"/><path d="M100 46c-30 30-30 79 0 109m40-109c30 30 30 79 0 109M120 46v109M50 100h140M88 161h64m-55 7h46m-23 0v24m-8-15v18m16-18v18"/><path d="m120 72 16 28-16 28-16-28Z"/><circle cx="120" cy="100" r="46" stroke-opacity=".25"/></g></svg>';front.append(drawing,node('p','story-book-folio',`已收录 ${unlockedLamps.length} / 7 · 尚待探访 ${7-unlockedLamps.length}`));
  const index=node('nav','story-book-index');index.setAttribute('aria-label','花灯卷目');index.append(node('p','story-book-number','卷目'),node('h3','','寻灯 · 入谱'));
  const hint=node('p','story-book-index-hint','点击已解锁花灯，展开三维灯影与文化札记。');hint.setAttribute('aria-live','polite');
  LANTERNS.forEach((lamp,i)=>{const done=unlocked.has(lamp.id),row=button('',()=>{if(done)detail(i);else hint.textContent=`${lamp.name}尚未解锁。按主线顺序靠近赏灯，待对白结束后收录。`;});row.dataset.lamp=lamp.id;row.setAttribute('aria-disabled',String(!done));row.setAttribute('aria-label',lamp.name+'，'+(done?'已解锁，查看详情':'待解锁'));row.className=done?'is-unlocked':'is-locked';row.append(node('span','story-book-entry-number',numerals[i]),node('span','story-book-entry-title',lamp.name),node('span','story-book-entry-state',done?'已解锁  ›':'待解锁'));index.append(row);});index.append(hint);
  book.append(front,index);if(focusId)index.querySelector(`[data-lamp="${focusId}"]`)?.focus();
 }
 function detail(i){
  if(disposed||!unlocked.has(LANTERNS[i].id))return;menuSounds.play('flip');clear();book.dataset.view='detail';
  const lamp=LANTERNS[i],entry=BOOK_ENTRIES[lamp.id];
  const left=node('section','story-book-model-page');left.append(button('← 返回卷目',()=>{menuSounds.play('flip');overview(lamp.id);},'story-book-back'),node('p','story-book-number','卷'+numerals[i]+' · '+entry.category));
  const host=node('div','story-book-model');left.append(host,node('p','story-book-caption',entry.caption),node('p','story-book-gesture','拖动赏灯 · 滚轮缩放 · 方向键亦可转动'));
  const actions=node('div','story-book-model-actions');actions.append(button('视角复位',()=>viewer?.reset()),button('重新载入',()=>{viewer?.dispose();viewer=createBookViewer(host,lamp.id,lamp.name);}));left.append(actions);
  const right=node('article','story-book-page');right.setAttribute('aria-label',lamp.name+'文化札记');right.append(node('span','story-book-seal','已收录'),node('p','story-book-number','秦淮灯彩 · 文化札记'));
  const title=node('h3','',lamp.name);title.tabIndex=-1;right.append(title);
  const text=node('div','story-book-reading');text.tabIndex=0;text.setAttribute('aria-label','滚动阅读花灯介绍');for(const [heading,body] of entry.sections){const section=node('section');section.append(node('h4','',heading),node('p','',body));text.append(section);}
  const refs=node('details','story-book-sources');refs.append(node('summary','','资料出处与说明'));refs.append(node('p','','传统文化背景据下列资料整理；造型描述与寄望为本作赏灯解读。'));
  for(const key of entry.sources){const source=BOOK_SOURCES[key],a=node('a','',source.label);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';refs.append(a);}text.append(refs);right.append(text);
  const turn=node('div','story-book-turn'),position=unlockedLamps.findIndex(l=>l.id===lamp.id);for(const [label,delta] of [['← 前一盏',-1],['后一盏 →',1]]){const next=unlockedLamps[position+delta],b=button(label,()=>{if(next)detail(LANTERNS.indexOf(next));});b.disabled=!next;turn.append(b);}right.append(turn);book.append(left,right);viewer=createBookViewer(host,lamp.id,lamp.name);title.focus();
 }
 book.dispose=()=>{if(disposed)return;disposed=true;clear();};overview();return book;
}
