// Audited against tile-09 geometry: 0307 railing, 0308 fascia, 0309 deck,
// 0310 piers/abutments, 0311–0315 arch soffits and carved stone details.
export const BRIDGE_ID='bridge-riverfront';
export const BRIDGE_PARTS=[['bridgeRail','桥栏杆 · 暖金'],['bridgeBody','桥身与桥墩 · 暖白'],['bridgeArch','桥洞与石雕 · 淡粉'],['bridgeDeck','桥面 · 柔光']];
export const BRIDGE_NODES=Object.freeze(Object.fromEntries(Array.from({length:9},(_,i)=>['FuziTemple'+String(307+i).padStart(4,'0'),i===0?'bridgeRail':i===2?'bridgeDeck':i===1||i===3?'bridgeBody':'bridgeArch'])));
export const BRIDGE_PRESET=Object.freeze({
 bridgeRail:{color:'#ffd078',energy:1.65},
 bridgeBody:{color:'#ffe1bd',energy:.70},
 bridgeArch:{color:'#edc5dc',energy:.88},
 bridgeDeck:{color:'#ffdba1',energy:.20},
});
export const BRIDGE_BUILDING={id:BRIDGE_ID,label:'秦淮河 · 石桥',nodes:Object.keys(BRIDGE_NODES),rect:[-22.92,-9.53,-18.67,4.97],bounds:{min:[-22.92,10.82,-9.53],max:[-18.67,12.28,4.97]},style:'bridge',defaultEnabled:false,tiles:[9]};
