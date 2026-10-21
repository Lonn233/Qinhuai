// User-confirmed file-backed colour schemes, captured 2026-10-19.
// Fixed defaults: saving a new experiment does not silently replace these.
const {SIZE_SPECS}=require('./dimensions.cjs');
const DEFAULT_LIGHTS=Object.freeze({
  "lion": {
    "sourceId": "209b64fd-19c8-4930-afcc-d78fb856e55b",
    "name": "瑞狮灯 · 71%",
    "base": "柔彩透亮",
    "power": 0.71,
    "color": "#fffaf2"
  },
  "mountain": {
    "sourceId": "0bad75cc-ed41-43ec-bff0-dc7b86f00cfb",
    "name": "鳖山灯 · 112%",
    "base": "盈彩明灯",
    "power": 1.12,
    "color": "#fffbf5"
  },
  "fish": {
    "sourceId": "82af8e6d-8347-4f08-b2a4-8076f25501b1",
    "name": "金鱼灯 · 53%",
    "base": "均匀柔光",
    "power": 0.53,
    "color": "#fffcf6"
  },
  "crane": {
    "sourceId": "40b8ff4d-2aa2-45b6-9c74-ce7fcbcbcee0",
    "name": "仙鹤纹灯 · 112%",
    "base": "盈彩明灯",
    "power": 1.12,
    "color": "#fffbf5"
  },
  "lotus": {
    "sourceId": "31fb00ce-b22e-4052-942a-dd7ddcc05bc2",
    "name": "荷花灯 · 135%",
    "base": "通体彩光",
    "power": 1.35,
    "color": "#fffdf8"
  }
});
function defaultTuning(id,presets){
 const p=DEFAULT_LIGHTS[id];if(!p)throw Error('Unknown lantern: '+id);
 const index=presets.findIndex(base=>base.name===p.base);if(index<0)throw Error('Missing default lighting base: '+p.base);
 return {index,power:p.power,color:p.color,sizeMeters:SIZE_SPECS[id].initial,savedId:p.sourceId,name:p.name,custom:true,isDefault:true};
}
module.exports={DEFAULT_LIGHTS,defaultTuning};
