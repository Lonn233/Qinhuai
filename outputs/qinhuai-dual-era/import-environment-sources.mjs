import {BRIDGE_BUILDING} from './import-bridge-config.mjs';
import {TOWER0369_NODES} from './import-tower0369-config.mjs';
// Stable source IDs, independent of asynchronous tile arrival order.
// The imported FBX merges some terrace roofs. They remain explicit architectural
// blocks rather than pretending material names identify individual houses.
export const TEMPLE_ENVIRONMENT_REGIONS = [
  ['front-hall','前殿',[-10.8,-41.5,-.45,-36.2]],
  ['entrance','院落门殿',[-10.5,-27.4,2.1,-24.2]],
  ['west-corridor','西侧廊檐',[-12.65,-36.65,-10.5,-27.4]],
  ['east-corridor','东侧廊檐',[0,-37.8,2.08,-27.4]],
  ['rear-hall','后院正殿',[-10.2,-55.8,-.8,-50.15]],
  ['rear-west','后院西廊',[-12.1,-52.2,-10.25,-44.1]],
  ['rear-east','后院东廊',[-1.05,-52.2,.7,-44.1]],
  ['rear-front','后院前廊',[-12.1,-45.3,.7,-43.75]],
];
const rect=b=>[b.min[0],b.min[2],b.max[0],b.max[2]];
const area=r=>Math.max(.001,(r[2]-r[0])*(r[3]-r[1]));
export function rectDistance(x,z,r){return Math.hypot(Math.max(r[0]-x,0,x-r[2]),Math.max(r[1]-z,0,z-r[3]));}
const overlap=(a,b)=>Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0]))*Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]));
const union=rs=>[Math.min(...rs.map(r=>r[0])),Math.min(...rs.map(r=>r[1])),Math.max(...rs.map(r=>r[2])),Math.max(...rs.map(r=>r[3]))];
export function collectEnvironmentBuildings(layout,{matouGroups=[],templeNodes=new Set(),pavilionNodes=new Set()}={}){
  const sources=[{...BRIDGE_BUILDING}],claimed=new Set(BRIDGE_BUILDING.nodes);
  const bounds=new Map(Object.values(layout.tiles).flatMap(t=>Object.entries(t.bounds)));
  for(const [id,label,r] of TEMPLE_ENVIRONMENT_REGIONS)sources.push({id:'temple-'+id,label:'夫子庙 · '+label,rect:r,style:'temple',defaultEnabled:true,tiles:[9,10],nodes:[...templeNodes]});
  for(const n of templeNodes)claimed.add(n);
  const add=(id,label,nodes,style,defaultEnabled,tiles,minX)=>{
    const rs=nodes.map(n=>bounds.get(n)).filter(Boolean).map(rect);if(!rs.length)return;
    let r=union(rs);if(minX!=null)r[0]=Math.max(minX,r[0]);
    if(r[2]<=r[0]||r[3]<=r[1])return;
    sources.push({id,label,nodes,rect:r,style,defaultEnabled,tiles});nodes.forEach(n=>claimed.add(n));
  };
  const directions={'north-west':'北岸西段','north-east':'北岸东段','north-east-end':'北岸东端','south-west':'南岸西段','south-center':'南岸中段','south-east':'南岸东段','south-east-shop':'南岸东侧商铺','south-east-pair':'南岸东侧双栋','south-east-end':'南岸东端'};
  for(const g of matouGroups)add('matou-'+g.id,'马头墙 · '+(directions[g.id]||g.id),g.nodes,'matou',false,[g.tile],g.minX);
  add('pavilion','魁星阁',[...pavilionNodes],'pavilion',false,[10]);
  const gate=['FuziTemple0336','FuziTemple0338','FuziTemple0339','FuziTemple0340','FuziTemple0341','FuziTemple0360','FuziTemple0361','FuziTemple0362'];
  add('gate','夫子庙 · 天下文枢牌坊',gate,'gate',true,[9]);
  add('building-FuziTemple0369','沿河建筑 · 0369号',[...TOWER0369_NODES],'eave',false,[9]);
  for(const [tileName,tile] of Object.entries(layout.tiles)){
    const tileId=Number(tileName.split('-').at(-1)),candidates=tile.materials.filter(r=>!r.role.startsWith('boat')&&!claimed.has(r.node)&&bounds.has(r.node));
    const roofs=[...new Set(candidates.filter(r=>r.role==='roof').map(r=>r.node))].sort();
    const groups=[];
    for(const n of roofs){const r=rect(bounds.get(n));const group=groups.find(g=>overlap(g.rect,r)/Math.min(area(g.rect),area(r))>.72);if(group){group.nodes.push(n);group.rect=union([group.rect,r]);}else groups.push({nodes:[n],rect:r});}
    for(const rule of candidates){if(roofs.includes(rule.node))continue;const b=rect(bounds.get(rule.node)),x=(b[0]+b[2])/2,z=(b[1]+b[3])/2;const nearest=groups.map(g=>({g,d:rectDistance(x,z,g.rect)})).sort((a,b)=>a.d-b.d)[0];if(nearest&&nearest.d<2){if(!nearest.g.nodes.includes(rule.node))nearest.g.nodes.push(rule.node);}else if(!groups.some(g=>g.nodes.includes(rule.node)))groups.push({nodes:[rule.node],rect:b});}
    for(const g of groups){const zone=candidates.some(r=>g.nodes.includes(r.node)&&r.zone==='temple')?'temple':candidates.some(r=>g.nodes.includes(r.node)&&r.zone==='waterfront')?'eave':'distant';const anchor=g.nodes[0];sources.push({id:'building-'+anchor,label:(zone==='temple'?'夫子庙周边':zone==='eave'?'沿河建筑':'街区建筑')+' · '+anchor.replace('FuziTemple','')+'号',rect:g.rect,nodes:g.nodes,style:zone,defaultEnabled:zone==='temple',tiles:[tileId]});}
  }
  return sources;
}
