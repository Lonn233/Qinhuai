import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import layout from '../assets/qinhuai-modern-import/night/layout.json' with {type:'json'};
import {environmentFocusBounds,environmentCameraPose} from '../import-environment-focus.mjs';
import {ENVIRONMENT_STORAGE_KEY,DEFAULT_ENVIRONMENT_COLOR,normalizeEnvironmentColor,normalizeEnvironment,readEnvironment,mountEnvironmentControls} from '../import-environment-controls.mjs';
import {ImportEnvironmentSpill} from '../import-environment-spill.js';

test('legacy independent colors keep warm white; new colors validate without changing the v1 schema',()=>{
  assert.equal(normalizeEnvironment({inheritColor:false}).color,'#ffecd4');
  assert.equal(normalizeEnvironmentColor(' #AbC '),'#aabbcc');
  assert.equal(normalizeEnvironmentColor('#38AADD'),'#38aadd');
  for(const color of [null,0,{},'red','#abcde','<script>'])assert.equal(normalizeEnvironmentColor(color),DEFAULT_ENVIRONMENT_COLOR);
});

test('every catalog entry has finite regional bounds, not the whole merged temple model',()=>{
  const rig=new ImportEnvironmentSpill();rig.configure(layout);
  try{
    for(const b of rig.buildings){const t=rig.getFocusTarget(b.id);assert.ok(t.tiles.length);assert.deepEqual([t.bounds.min[0],t.bounds.min[2],t.bounds.max[0],t.bounds.max[2]],b.rect);assert.ok([...t.bounds.min,...t.bounds.max].every(Number.isFinite));assert.ok(t.bounds.max[1]>=t.bounds.min[1]);}
    assert.equal(rig.getFocusTarget('unknown'),null);
    const a=rig.getFocusTarget('temple-front-hall'),b=rig.getFocusTarget('temple-rear-hall');assert.notDeepEqual(a.bounds,b.bounds);
    assert.deepEqual(environmentFocusBounds({rect:[1,2,3,4],nodes:[]},null),{min:[1,11.65,2],max:[3,13,4]});
  }finally{rig.dispose();}
});

test('camera frames buildings and their spill beyond desktop or mobile menus',()=>{
  const rig=new ImportEnvironmentSpill();rig.configure(layout);
  try{
    for(const b of rig.buildings)for(const view of [{width:1200,height:820,left:380},{width:390,height:844,top:470},{width:1920,height:1080,left:0}]){
      const pose=environmentCameraPose(rig.getFocusTarget(b.id).bounds,{...view,position:[45,40,35],reach:8,fov:50});
      const camera=new THREE.PerspectiveCamera(50,view.width/view.height,.03,3000);camera.position.fromArray(pose.position);camera.lookAt(new THREE.Vector3().fromArray(pose.target));camera.updateMatrixWorld();
      for(const x of [pose.bounds.min[0],pose.bounds.max[0]])for(const y of [pose.bounds.min[1],pose.bounds.max[1]])for(const z of [pose.bounds.min[2],pose.bounds.max[2]]){
        const v=new THREE.Vector3(x,y,z).project(camera);
        assert.ok(v.x>=-1+2*(view.left||0)/view.width-1e-6&&v.x<=1+1e-6, b.id+' horizontal fit');
        assert.ok(v.y>=-1-1e-6&&v.y<=1-2*(view.top||0)/view.height+1e-6,b.id+' vertical fit');
        assert.ok(v.z>0&&v.z<1);
      }
    }
  }finally{rig.dispose();}
});

test('custom color changes actual ground irradiance, preserves source color and obeys inheritance and off',()=>{
  const r=new ImportEnvironmentSpill();
  r.buildings=[{id:'one',rect:[-2,-2,2,2],tiles:[9],style:'gate',defaultEnabled:true}];r.configured=true;r.loaded.add(9);r.uniforms.envAtlasBounds.value.set(-12,-12,24,24);r.setState({night:true});
  const original={gate:{roof:{color:'#ff6600',edge:2}}};r.setSources(original);
  const totals=()=>{const n=[0,0,0];for(let i=0;i<r.data.length;i+=4)for(let j=0;j<3;j++)n[j]+=r.data[i+j];return n;};
  try{
    r.setSettings('one',{enabled:true,inheritColor:false,color:'#ff0000',intensity:1});r.update();let n=totals();assert.ok(n[0]>0);assert.equal(n[1]+n[2],0);
    r.setSettings('one',{...r.getSettings('one'),color:'#0000ff'});r.update();n=totals();assert.ok(n[2]>0);assert.equal(n[0]+n[1],0);
    r.setSettings('one',{...r.getSettings('one'),inheritColor:true});r.update();n=totals();assert.ok(n[0]>n[1]&&n[1]>0);assert.equal(n[2],0);assert.equal(r.getSettings('one').color,'#0000ff');
    assert.deepEqual(original,{gate:{roof:{color:'#ff6600',edge:2}}});
    r.setSettings('one',{...r.getSettings('one'),enabled:false});r.update();assert.deepEqual(totals(),[0,0,0]);
  }finally{r.dispose();}
});

class Element{constructor(tag){this.tag=tag;this.children=[];this.events={};this.classList={toggle(){}};}append(...a){this.children.push(...a);}replaceChildren(...a){this.children=a;}setAttribute(k,v){this[k]=v;}addEventListener(k,v){this.events[k]=v;}get valueAsNumber(){return this.value===''?NaN:Number(this.value);}fire(t){return this.events[t]?.();}}
test('UI auto/manual focus, per-building color saving and unknown legacy fields survive',async()=>{
  const old=globalThis.document;globalThis.document={createElement:t=>new Element(t),createTextNode:t=>Object.assign(new Element('text'),{textContent:t})};
  const r=new ImportEnvironmentSpill();r.buildings=[{id:'a',label:'A',defaultEnabled:true},{id:'b',label:'B',defaultEnabled:false}];
  const oldB={enabled:false,distance:11,inheritColor:false,extension:'keep me'};
  const data=new Map([[ENVIRONMENT_STORAGE_KEY,JSON.stringify({version:1,buildings:{a:{enabled:true,extension:'keep a'},b:oldB}})],['qinhuai.building-light-studies.v1','original presets']]);
  const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
  const calls=[];
  try{
    const host=new Element('div'),ui=mountEnvironmentControls(host,{rig:r,storage,isNight:()=>true,onFocus:async id=>calls.push(id)});
    const all=[];const walk=e=>{all.push(e);e.children.forEach(walk);};walk(host);const el=id=>all.find(e=>e.id===id);
    assert.deepEqual(calls,[],'do not move the camera on initial mount');
    el('environment-color').value='#23aaff';el('environment-color').fire('input');
    assert.equal(r.getSettings('a').inheritColor,false);assert.equal(el('environment-color-hex').value,'#23aaff');
    assert.deepEqual(readEnvironment(storage).b,oldB);assert.equal(readEnvironment(storage).a.extension,'keep a');
    el('environment-building').value='b';await el('environment-building').fire('change');assert.deepEqual(calls,['b']);assert.equal(el('environment-color').value,'#ffecd4');
    el('environment-color-hex').value='#a53';el('environment-color-hex').fire('change');assert.equal(r.getSettings('b').color,'#aa5533');assert.equal(readEnvironment(storage).b.extension,'keep me');
    el('environment-auto-focus').checked=false;el('environment-building').value='a';await el('environment-building').fire('change');assert.deepEqual(calls,['b']);
    await el('environment-focus').fire('click');assert.deepEqual(calls,['b','a']);
    el('environment-inheritColor').checked=true;el('environment-inheritColor').fire('change');assert.equal(r.getSettings('a').color,'#23aaff');
    ui.reload();assert.equal(r.getSettings('a').inheritColor,true);assert.equal(r.getSettings('a').color,'#23aaff');assert.equal(r.getSettings('b').color,'#aa5533');
    assert.equal(data.get('qinhuai.building-light-studies.v1'),'original presets');
  }finally{globalThis.document=old;r.dispose();}
});

test('late focus callbacks are invalidated even if auto-focus was disabled before selecting another building',async()=>{
  const old=globalThis.document;globalThis.document={createElement:t=>new Element(t),createTextNode:t=>Object.assign(new Element('text'),{textContent:t})};
  const r=new ImportEnvironmentSpill();r.buildings=[{id:'a',label:'A',defaultEnabled:true},{id:'b',label:'B'}];let complete,isCurrent;
  try{
    const host=new Element('div');mountEnvironmentControls(host,{rig:r,isNight:()=>true,onFocus:(_id,options)=>{isCurrent=options.isCurrent;return new Promise(resolve=>{complete=resolve;});}});
    const all=[];const walk=e=>{all.push(e);e.children.forEach(walk);};walk(host);const el=id=>all.find(e=>e.id===id);
    const pending=el('environment-focus').fire('click');assert.equal(isCurrent(),true);
    el('environment-auto-focus').checked=false;el('environment-building').value='b';await el('environment-building').fire('change');assert.equal(isCurrent(),false);
    complete({cancelled:true});await pending;assert.doesNotMatch(el('environment-focus-status').textContent,/已定位 A/);assert.equal(el('environment-focus')['aria-busy'],'false');
  }finally{globalThis.document=old;r.dispose();}
});
