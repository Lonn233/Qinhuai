import {createBuildingLighting} from './game/building-study/lighting.js';
import {TOWER0369_NODES,TOWER0369_ROOFS} from './import-tower0369-config.mjs';

export function attachTower0369Study(mesh,bounds,settings){
 if(!TOWER0369_NODES.has(mesh.name))throw new Error('Not a 0369 tower node');
 const day=mesh.material;
 const originals=Array.isArray(day)?day:[day];
 const rules=originals.map(material=>({node:mesh.name,material:material.name,bounds,
  role:TOWER0369_ROOFS.has(mesh.name)?'roof':'templeFacade',zone:'waterfront'}));
 const lighting=createBuildingLighting(mesh,{rules},new Map(),new Map(),{regionalPolicy:false,mode:'tower0369'});
 lighting.apply(settings);
 const night=mesh.material;mesh.material=day;
 return {day,night,lighting,dispose(){lighting.dispose();}};
}
