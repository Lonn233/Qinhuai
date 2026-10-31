import {PRESETS} from './game/building-study/profiles.mjs';

// Source-node ownership, not a material-wide override of neighboring buildings.
export const TOWER0369_ROOFS=new Set(['FuziTemple0369','FuziTemple0388']);
export const TOWER0369_NODES=new Set([364,365,367,368,369,370,371,378,379,380,381,382,383,384,387,388].map(n=>'FuziTemple'+String(n).padStart(4,'0')));
export const TOWER0369_PRESET=Object.freeze({...PRESETS[0],
 color:'#ffbe48',roofColor:'#d68b38',facadeColor:'#ffc777',
 eave:2.8,roof:.012,facade:.78,width:3.6,textureRetention:.65,underside:.08,
});
