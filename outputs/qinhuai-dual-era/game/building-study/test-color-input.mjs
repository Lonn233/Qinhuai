import assert from 'node:assert/strict';
import {parseColorInput} from './color-input.mjs';
import {COLOR_CONTROLS,PRESETS,readSaved} from './profiles.mjs';

for(const [input,expected] of [
 ['#010203','#010203'],[' #AAbbCC ','#aabbcc'],['#abc','#aabbcc'],
 ['rgb(1, 2, 3)','#010203'],['RGB(255,0,128)','#ff0080'],
 ['rgb( 0 , 255 , 0 )','#00ff00'],['rgb(0, 0, 0)','#000000']
])assert.equal(parseColorInput(input),expected,input);
for(const input of ['',null,123,'#12','#aabbccdd','#GG0000','rgb(256,0,0)',
 'rgb(-1,0,0)','rgb(1.5,2,3)','rgb(1,2)','rgba(1,2,3,0.5)',
 'rgb(1,2,3);color:red','red','<script>','#010203rgb']){
 assert.equal(parseColorInput(input),null,String(input));
}
const settings={...PRESETS[0],key:'color-test',label:'Color test'};
for(const [key] of COLOR_CONTROLS)settings[key]=parseColorInput('rgb(1, 2, 3)');
const saved=readSaved(JSON.stringify({version:1,items:[settings]}));
assert.equal(saved.length,1);
for(const [key] of COLOR_CONTROLS)assert.equal(saved[0][key],'#010203');
console.log('Color inputs: HEX/RGB parsing, invalid values and saved scheme round-trip passed.');
