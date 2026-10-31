import * as THREE from 'three';
import {PLACEABLE_LANTERNS,MAX_PLACED_LANTERNS,readPlacedLanterns,savePlacedLanterns,normalizePlacedLanterns} from './import-placeable-lantern-settings.mjs';

export function mountPlaceableLanternControls(host,{layer,storage,camera,canvas,canEdit,pickGround,viewTarget,onFocus}){
 let record=readPlacedLanterns(storage),selected=null,enabled=false,placing=false,placingReady=false,step=.25,pointer=null;
 const ray=new THREE.Raycaster(),uv=new THREE.Vector2(),forward=new THREE.Vector3(),right=new THREE.Vector3();
 const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;};
 const panel=el('details',null,'map-light-group placed-lantern-panel');panel.id='placedLanternPanel';panel.append(el('summary','场景灯具 · 添加与摆位'));host.append(panel);
 const catalogLabel=el('label','灯具类型');catalogLabel.htmlFor='placed-lantern-kind';const catalog=el('select');catalog.id=catalogLabel.htmlFor;
 for(const kind of PLACEABLE_LANTERNS){const option=el('option',kind.name+' · 5%');option.value=kind.id;catalog.append(option);}panel.append(catalogLabel,catalog);
 const actions=el('div',null,'placed-lantern-actions');
 function button(parent,text,id,title,handler){const b=el('button',text);b.type='button';b.id=id;b.title=title;b.setAttribute('aria-label',title);b.onclick=handler;parent.append(b);return b;}
 const add=button(actions,'添加灯具','placed-lantern-add','选择场景落点；再次点击或 Esc 取消',()=>beginPlacement());
 button(actions,'添加到视野中心','placed-lantern-add-center','在当前视野中心添加一盏灯',()=>{if(!isEnabled())return;const point=viewTarget();if(point)addInstance(point);else message('视野中心没有可用落点',true);});panel.append(actions);
 const instanceLabel=el('label','场景中的灯具');instanceLabel.htmlFor='placed-lantern-instance';const instances=el('select');instances.id=instanceLabel.htmlFor;panel.append(instanceLabel,instances);
 const edits=el('fieldset');edits.className='placed-lantern-edits';edits.style.cssText='border:0;padding:0;margin:8px 0;min-width:0';panel.append(edits);
 const fields=new Map();
 for(const [key,title,unit] of [['x','X · 左右',.05],['y','Y · 高度',.05],['z','Z · 前后',.05],['rx','X 旋转 / °',1],['ry','Y 旋转 / °',1],['rz','Z 旋转 / °',1],['scale','整体比例',.05]]){
  const row=el('div',null,'map-light-field'),label=el('label',title),input=el('input');input.type='number';input.step=unit;input.id='placed-lantern-'+key;label.htmlFor=input.id;input.min=key==='scale'?.05:key.startsWith('r')?-36000:-10000;input.max=key==='scale'?20:key.startsWith('r')?36000:10000;
  row.append(label,input);edits.append(row);fields.set(key,input);input.onchange=()=>{if(!isEnabled())return;if(!Number.isFinite(input.valueAsNumber)){sync();return;}patch({[key]:input.valueAsNumber});};
 }
 const stepRow=el('div',null,'map-light-field'),stepLabel=el('label','移动步长'),stepInput=el('input');stepInput.id='placed-lantern-step';stepInput.type='number';stepInput.min=.01;stepInput.max=10;stepInput.step=.05;stepInput.value=step;stepLabel.htmlFor=stepInput.id;stepRow.append(stepLabel,stepInput);panel.append(stepRow);
 stepInput.onchange=()=>{step=Number.isFinite(stepInput.valueAsNumber)?Math.max(.01,Math.min(10,stepInput.valueAsNumber)):.25;stepInput.value=step;};
 const pad=el('div',null,'placed-lantern-pad');pad.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin:8px 0';
 for(const [key,icon,title] of [['ArrowLeft','←','向视野左侧移动（←）'],['ArrowUp','↑','向视野前方移动（↑）'],['KeyP','↥','升高（P）'],['ArrowRight','→','向视野右侧移动（→）'],['ArrowDown','↓','向视野后方移动（↓）'],['KeyO','↧','降低（O）']])button(pad,icon,'placed-lantern-move-'+key,title,()=>move(key));edits.append(pad);
 const selectionActions=el('div',null,'placed-lantern-actions');
 button(selectionActions,'定位','placed-lantern-focus','定位选中灯具',async()=>{if(!selected)return;try{await layer.ready;await onFocus?.(selected);}catch(error){message(error.message,true);}});
 button(selectionActions,'复制','placed-lantern-copy','复制选中灯具',()=>{const item=current();if(item&&isEnabled())addInstance(new THREE.Vector3(item.x+step,item.y,item.z+step),item);});
 button(selectionActions,'删除','placed-lantern-delete','删除选中灯具',()=>{if(!current()||!isEnabled())return;record.instances=record.instances.filter(i=>i.id!==selected);selected=null;commit();});edits.append(selectionActions);
 const status=el('p',null,'map-light-status');status.id='placed-lantern-status';status.setAttribute('role','status');panel.append(status);
 function isEnabled(){return enabled&&canEdit();}
 function current(){return record.instances.find(item=>item.id===selected);}
 function message(text,warn=false){status.textContent=text;status.classList.toggle('warn',warn);}
 function sync(){
  const count={};instances.replaceChildren();const empty=el('option',record.instances.length?'选择场景灯具':'尚未添加灯具');empty.value='';instances.append(empty);
  for(const item of record.instances){const config=PLACEABLE_LANTERNS.find(k=>k.id===item.kind);count[item.kind]=(count[item.kind]||0)+1;const o=el('option',config.name+' '+count[item.kind]);o.value=item.id;instances.append(o);}
  instances.value=selected||'';const item=current();edits.disabled=!item;
  for(const [key,input] of fields)input.value=item?Number(item[key].toFixed(4)):'';
  layer.select(selected);
 }
 function commit(){
  record=normalizePlacedLanterns(record);layer.apply(record).then(()=>layer.updateHelpers());sync();
  const ok=savePlacedLanterns(storage,record);message(ok?'已保存 · '+record.instances.length+' 盏场景灯具':'已应用，浏览器保存失败',!ok);
  if(ok)panel.dispatchEvent(new Event('change',{bubbles:true}));
 }
 function patch(values){const item=current();if(!item||!isEnabled())return;Object.assign(item,values);commit();}
 function select(id){selected=record.instances.some(i=>i.id===id)?id:null;panel.open=true;sync();}
 function cancelPlacement(){placing=false;placingReady=false;pointer=null;layer.cancelGhost();add.textContent='添加灯具';add.setAttribute('aria-pressed','false');canvas.style.cursor='';}
 async function beginPlacement(){
  if(!isEnabled())return;if(placing){cancelPlacement();message('已取消添加');return;}
  if(record.instances.length>=MAX_PLACED_LANTERNS){message('已达灯具数量上限（500）',true);return;}
  placing=true;placingReady=false;const kind=catalog.value;add.textContent='取消添加';add.setAttribute('aria-pressed','true');canvas.style.cursor='crosshair';message('正在载入'+PLACEABLE_LANTERNS.find(k=>k.id===kind).name+'…');
  try{await layer.prepareGhost(kind);if(!placing||catalog.value!==kind||!isEnabled())return;placingReady=true;message('待放置 · '+PLACEABLE_LANTERNS.find(k=>k.id===kind).name);}catch(error){cancelPlacement();message('模型载入失败：'+error.message,true);}
 }
 function addInstance(point,source=null){
  if(!isEnabled())return;if(record.instances.length>=MAX_PLACED_LANTERNS){message('已达灯具数量上限（500）',true);return;}
  const item={...(source||{}),id:crypto.randomUUID(),kind:source?.kind||catalog.value,x:point.x,y:point.y,z:point.z};
  record.instances.push(item);selected=item.id;cancelPlacement();commit();
 }
 function move(code){
  const item=current();if(!item||!isEnabled())return false;
  if(code==='KeyO'||code==='KeyP')patch({y:item.y+(code==='KeyP'?step:-step)});
  else{
   camera.getWorldDirection(forward);forward.y=0;
   if(forward.lengthSq()<.00001)forward.set(0,1,0).applyQuaternion(camera.quaternion).setY(0);
   forward.normalize();right.crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();
   const direction=code==='ArrowUp'?forward:code==='ArrowDown'?forward.clone().negate():code==='ArrowRight'?right:right.clone().negate();
   patch({x:item.x+direction.x*step,z:item.z+direction.z*step});
  }return true;
 }
 function pointerRay(event){const rect=canvas.getBoundingClientRect();uv.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);camera.updateMatrixWorld();ray.setFromCamera(uv,camera);return ray;}
 function pointerMove(event){if(!isEnabled()||!placing||!placingReady)return;pointer={clientX:event.clientX,clientY:event.clientY};}
 function pointerLeave(){pointer=null;if(layer.ghost)layer.ghost.visible=false;}
 function handleClick(event){
  if(!isEnabled())return false;
  const r=pointerRay(event);
  if(placing){if(!placingReady)return true;const point=pickGround(r);if(point)addInstance(point);else message('此处没有可用落点',true);return true;}
  const id=layer.pick(r);if(id){select(id);return true;}return false;
 }
 function keydown(event){
  if(!isEnabled()||event.ctrlKey||event.metaKey||event.altKey||event.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  if(event.code==='Escape'&&placing){cancelPlacement();event.preventDefault();event.stopImmediatePropagation();return;}
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyO','KeyP'].includes(event.code))return;
  if(move(event.code)){event.preventDefault();event.stopImmediatePropagation();}
 }
 instances.onchange=()=>select(instances.value);
 catalog.onchange=()=>{if(placing){cancelPlacement();beginPlacement();}};
 canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerleave',pointerLeave);window.addEventListener('keydown',keydown,true);
 layer.onError=(error,item)=>message(PLACEABLE_LANTERNS.find(k=>k.id===item.kind)?.name+'载入失败：'+error.message,true);
 layer.apply(record);sync();message('场景灯具 · '+record.instances.length+' 盏');
 return {
  panel,select,handleClick,get record(){return structuredClone(record);},get selected(){return selected;},
  update(preview){
   const editable=preview&&canEdit();
   if(enabled!==editable){enabled=editable;layer.setPreview(editable);if(!editable)cancelPlacement();}
   if(pointer&&placing&&placingReady&&isEnabled()){const point=pickGround(pointerRay(pointer));if(point)layer.showGhost(point);else if(layer.ghost)layer.ghost.visible=false;pointer=null;}
   layer.updateHelpers();
  },
  reload(){cancelPlacement();record=readPlacedLanterns(storage);if(!record.instances.some(i=>i.id===selected))selected=null;layer.apply(record);sync();message('已恢复 · '+record.instances.length+' 盏场景灯具');},
  dispose(){cancelPlacement();canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerleave',pointerLeave);window.removeEventListener('keydown',keydown,true);panel.remove();}
 };
}
