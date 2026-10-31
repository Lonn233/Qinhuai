import * as THREE from 'three';
import {collectEnvironmentBuildings} from './import-environment-sources.mjs';
import {environmentFocusBounds} from './import-environment-focus.mjs';
import {MATOU_GROUPS} from './import-matou-study.js';
import {TEMPLE_STUDY_NODES,PAVILION_STUDY_NODES} from './import-temple-study.js';

// Reuse the lighting catalog's names and world bounds; no extra meshes or textures.
export class ImportBuildingLabels {
  constructor(host, toggle) {
    this.host=host; this.toggle=toggle; this.entries=[]; this.enabled=toggle.checked;
    this.projected=new THREE.Vector3(); this.view=new THREE.Matrix4(); this.lastUpdate=-Infinity;
    this.disposed=false;
    this.onToggle=()=>{this.enabled=toggle.checked;host.hidden=!this.enabled;this.lastUpdate=-Infinity;};
    toggle.addEventListener('change',this.onToggle);
    this.onToggle();
  }
  async load() {
    const response=await fetch('./assets/qinhuai-modern-import/night/layout.json');
    if(!response.ok)throw new Error(`建筑名称目录 HTTP ${response.status}`);
    const layout=await response.json();
    if(this.disposed)return;
    const catalog=collectEnvironmentBuildings(layout,{matouGroups:MATOU_GROUPS,templeNodes:TEMPLE_STUDY_NODES,pavilionNodes:PAVILION_STUDY_NODES});
    const fragment=document.createDocumentFragment();
    this.entries=catalog.map(building=>{
      const bounds=environmentFocusBounds(building,layout);
      const anchor=new THREE.Vector3((bounds.min[0]+bounds.max[0])/2,bounds.max[1]+.9,(bounds.min[2]+bounds.max[2])/2);
      const element=document.createElement('span');element.className='building-name';element.textContent=building.label;
      element.dataset.buildingId=building.id;element.hidden=true;fragment.appendChild(element);
      return {element,anchor,tiles:building.tiles,x:null,y:null};
    });
    this.host.replaceChildren(fragment);this.lastUpdate=-Infinity;
    this.toggle.title=`显示或隐藏 ${this.entries.length} 处建筑名称`;
  }
  update(camera,loadedTiles,modelVisible,now,width,height) {
    if(!this.enabled||this.disposed)return;
    this.host.hidden=!modelVisible;
    if(!modelVisible||now-this.lastUpdate<50)return;
    this.lastUpdate=now;
    camera.updateWorldMatrix(true,false);
    this.view.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    for(const entry of this.entries){
      const p=this.projected.copy(entry.anchor).applyMatrix4(this.view);
      const visible=entry.tiles.some(id=>loadedTiles.has(id))&&p.z>=-1&&p.z<=1&&Math.abs(p.x)<1&&Math.abs(p.y)<1;
      entry.element.hidden=!visible;
      if(!visible)continue;
      const x=Math.round((p.x*.5+.5)*width),y=Math.round((-.5*p.y+.5)*height);
      if(x!==entry.x||y!==entry.y){entry.element.style.transform=`translate(${x}px,${y}px) translate(-50%,-100%)`;entry.x=x;entry.y=y;}
    }
  }
  dispose(){this.disposed=true;this.toggle.removeEventListener('change',this.onToggle);this.host.replaceChildren();this.entries=[];}
}
