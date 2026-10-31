import {lampSetting,lampGain} from './import-lantern-settings.mjs';

// Audited imported boat materials: cabin, fittings, glazing, roof, and hull.
// Include non-emissive roofs/glazing so hiding a boat never leaves floating parts.
export function isBoatMaterial(material){return /^FuziTemple006[3-7](?:$| \/)/.test(material?.name||'');}
export class ImportBoatLanterns {
 constructor(night){this.night=night;this.meshes=new Set();this.hulls=new Set();this.materials=new Map();this.fixtures=new Map();}
 registerObject(object){const meshes=new Map();object.traverse(mesh=>{if(mesh.isMesh)meshes.set(mesh.uuid,mesh);});this.registerTile(meshes);this.setState();}
 registerTile(byName){
  for(const mesh of byName.values()){
   const materials=[mesh.material].flat();
   if(materials.length&&materials.every(isBoatMaterial))this.meshes.add(mesh);
   if(materials.some(m=>/^FuziTemple0067(?:$| \/)/.test(m.name||'')))this.hulls.add(mesh);
  }
 }
 setPlayHidden(value){this.playHidden=!!value;this.night.waterReflections.playBoatsHidden=this.playHidden||!!this.templeHidden;this.setState();}
 setTempleHidden(value){this.templeHidden=!!value;this.night.waterReflections.playBoatsHidden=!!this.playHidden||this.templeHidden;this.setState();}
 setState(){
  const p=lampSetting(this,'boat'),gain=lampGain(p),night=this.night;
  for(const mesh of this.meshes)mesh.visible=!this.playHidden&&!this.templeHidden&&p.modelVisible;
  for(const binding of night.bindings){
   if(!this.meshes.has(binding.mesh))continue;
   for(const material of [binding.night].flat()){
    if(!material.emissive||!/^boat/.test(material.userData.buildingLightRole||''))continue;
    if(!this.materials.has(material))this.materials.set(material,{color:material.emissive.clone(),power:material.emissiveIntensity});
   }
  }
  for(const [material,base] of this.materials){material.emissiveIntensity=base.power*gain;material.emissive.copy(base.color);if(!p.inheritColor)material.emissive.set(p.color);}
  night.root.traverse(mesh=>{
   if(mesh.userData.nightFixtureKind!=='boat')return;
   mesh.visible=!this.playHidden&&!this.templeHidden&&p.modelVisible&&p.enabled&&p.brightness>0;
   if(!this.fixtures.has(mesh.material))this.fixtures.set(mesh.material,mesh.material.color.clone());
  });
  for(const [material,color] of this.fixtures){material.color.copy(color);if(!p.inheritColor)material.color.set(p.color).multiplyScalar(4.7);material.color.multiplyScalar(gain);}
  night.waterReflections.lightControls=this.lightControls;
  night.waterReflections.apply(night.mapLightSettings,{matou:night.matouSelection.settings,pavilion:night.pavilionSelection.settings,styles:night.boatReflectionStyles,buildingAdjustments:night.buildingAdjustments.saved});
 }
}
