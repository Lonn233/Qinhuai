// Only the lighting studio uses these physical dimensions; festival placement stays unchanged.
const SIZE_SPECS = Object.freeze({
 mountain: Object.freeze({label:'直径',axis:'footprint',initial:13,min:1,max:30,step:.1}),
 lotus: Object.freeze({label:'直径',axis:'footprint',initial:.6,min:.1,max:3,step:.01}),
 lion: Object.freeze({label:'长度',axis:'footprint',initial:2.5,min:.5,max:8,step:.05}),
 crane: Object.freeze({label:'高度',axis:'height',initial:.5,min:.1,max:3,step:.01}),
 fish: Object.freeze({label:'长度',axis:'footprint',initial:.8,min:.1,max:5,step:.01})
});
function validSize(id,value){const spec=SIZE_SPECS[id];return !!spec&&Number.isFinite(value)&&value>=spec.min&&value<=spec.max;}
function formatMeters(value){return Number(value.toFixed(2)).toString();}
function sizeLabel(id,value=SIZE_SPECS[id].initial){return SIZE_SPECS[id].label+' '+formatMeters(value)+' m';}
module.exports={SIZE_SPECS,validSize,formatMeters,sizeLabel};
