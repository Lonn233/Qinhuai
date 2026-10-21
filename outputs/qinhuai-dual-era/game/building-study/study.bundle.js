(()=>{var es=Object.freeze({eave:"\u6A90\u53E3",roof:"\u5C4B\u9762",facade:"\u5899\u67F1",window:"\u7A97\u6237",sign:"\u533E\u989D",trim:"\u5899\u9876\u538B\u8FB9"}),cc=Object.freeze({enabled:!1,intensity:1.5,distance:10,angle:120,azimuth:0,elevation:-25,softness:.8,shadows:!0}),uc=[["intensity","\u5916\u6EA2\u5F3A\u5EA6",0,8,.05,"\xD7"],["distance","\u5411\u5916\u7167\u5C04\u8DDD\u79BB",.5,30,.1,"m"],["angle","\u6295\u5C04\u5149\u675F\u89D2",20,170,1,"\xB0"],["azimuth","\u6295\u5C04\u6C34\u5E73\u504F\u8F6C",-90,90,1,"\xB0"],["elevation","\u6295\u5C04\u4E0A\u4E0B\u504F\u8F6C",-80,80,1,"\xB0"],["softness","\u5149\u6591\u8FB9\u7F18\u67D4\u5316",0,1,.01,""]];function Qi(i,e=!0){let t={...cc};if(!i||typeof i!="object")return t;for(let[n,,s,r]of uc)typeof i[n]=="number"&&Number.isFinite(i[n])&&(t[n]=Math.min(r,Math.max(s,i[n])));for(let n of["enabled","shadows"])typeof i[n]=="boolean"&&(t[n]=i[n]);return e&&i.floors&&typeof i.floors=="object"&&(t.floors=Object.fromEntries(["first","second"].map(n=>[n,Qi({...t,...i.floors[n]},!1)]))),t}function Xt(i){return Object.fromEntries(Object.keys(es).map(e=>[e,Qi(i?.[e])]))}function Nr(i,e,t){let n=i==="trim"?e.window:e[i];return Math.max(0,Number(n)||0)*Math.max(0,Number(e.brightness)||0)*(i==="window"?t.enabled?t.brightness:0:1)}function Zh(i,e,t){return i==="window"?t.color||e.windowColor:e[{eave:"color",roof:"roofColor",facade:"facadeColor",sign:"windowColor",trim:"trimColor"}[i]]||e.color}function Fr(i,e){let t=Qi(i);return Qi(t.floors?.[e]||t,!1)}function Kh(i,e,t){let n=Qi(i),s=Object.fromEntries(["first","second"].map(r=>[r,Fr(n,r)]));return s[e]=Qi({...s[e],...t},!1),Qi({...n,floors:s})}var hc=Object.freeze({enabled:!0,brightness:1,color:null,directional:!1,distance:6,sourceDistance:1.5,angle:110,azimuth:0,elevation:0,softness:.65}),dc=[["brightness","\u7A97\u6237\u4EAE\u5EA6\u500D\u7387",0,10,.05,"\xD7"],["distance","\u7A97\u5185\u5149\u7A0B",.3,15,.1,"m"],["sourceDistance","\u706F\u6E90\u8DDD\u7A97",.15,5,.05,"m"],["angle","\u5149\u675F\u89D2",15,160,1,"\xB0"],["azimuth","\u6C34\u5E73\u504F\u8F6C",-70,70,1,"\xB0"],["elevation","\u4E0A\u4E0B\u504F\u8F6C",-70,70,1,"\xB0"],["softness","\u8FB9\u7F18\u67D4\u5316",0,1,.01,""]];function ct(i={},e=!0){let t=i&&typeof i=="object"&&!Array.isArray(i)?i:{},n={...hc};for(let[s,,r,o]of dc)typeof t[s]=="number"&&Number.isFinite(t[s])&&(n[s]=Math.max(r,Math.min(o,t[s])));for(let s of["enabled","directional"])typeof t[s]=="boolean"&&(n[s]=t[s]);return typeof t.color=="string"&&/^#[0-9a-f]{6}$/i.test(t.color)&&(n.color=t.color.toLowerCase()),e&&t.floors&&typeof t.floors=="object"&&(n.floors=Object.fromEntries(["first","second"].map(s=>[s,ct({...n,...t.floors[s]},!1)]))),n}var Jp=Object.freeze({first:"\u4E00\u5C42\u7A97\u6237",second:"\u4E8C\u5C42\u7A97\u6237"});function li(i,e){let t=ct(i);return ct(t.floors?.[e]||t,!1)}function fc(i,e,t){let n=ct(i),s=Object.fromEntries(Object.keys(Jp).map(r=>[r,li(n,r)]));return s[e]=ct({...s[e],...t},!1),ct({...n,floors:s})}function Bo(i,e){let t=(e.rules||[]).filter(s=>s.role==="window"&&s.bounds).map(s=>(s.bounds.min[1]+s.bounds.max[1])/2);if(t.length<2||!i.bounds)return"first";let n=(Math.min(...t)+Math.max(...t))/2;return(i.bounds.min[1]+i.bounds.max[1])/2>n?"second":"first"}var jh=`
uniform vec4 wlState; // enabled, gain, directional, color override
uniform vec3 wlColor;
uniform vec4 wlBeam; // reach metres, lamp setback metres, half angle radians, softness
uniform vec2 wlAim;
uniform vec3 wlCenter;
float windowLightProfile(vec3 world,vec3 surfaceNormal){
 if(wlState.x<.5)return 0.;
 if(wlState.z<.5)return wlState.y;
 vec3 horizontal=vec3(surfaceNormal.x,0.,surfaceNormal.z);
 horizontal=length(horizontal)>.01?normalize(horizontal):vec3(0.,0.,1.);
 vec3 tangent=vec3(horizontal.z,0.,-horizontal.x);
 vec3 local=(world-wlCenter)/(.53/1.65);
 // Repeated interior sources along the window frontage (2.4m bays), not dots
 // or separate luminous geometry on the window surface.
 float x=mod(dot(local,tangent)+1.2,2.4)-1.2;
 vec3 ray=vec3(x,local.y,wlBeam.y);
 float d=length(ray);
 vec3 aim=normalize(vec3(tan(wlAim.x),tan(wlAim.y),1.));
 float cone=smoothstep(cos(wlBeam.z),cos(wlBeam.z*(1.-max(.01,wlBeam.w)*.85)),dot(normalize(ray),aim));
 float reach=pow(max(0.,1.-pow(d/max(.01,wlBeam.x),2.)),2.);
 return wlState.y*cone*reach/(1.+.12*d*d);
}
`;function pc(i){if(!i?.data||!i.width||!i.height)return 1;let e=i.data.length/(i.width*i.height);if(!Number.isInteger(e)||e<1)return 1;let t=0,n=0;for(let s=0;s<i.data.length;s+=e){let r=i.data[s]/255;r>.08&&(t+=r,n++)}return n?t/n:1}var mc="qinhuai.building-manual-spill.v1",Dn=8,Qh=2,Os=[{id:"eave",name:"\u6A90\u4E0B\u67D4\u91D1",description:"\u6696\u91D1\u8272\u3001\u8D34\u8FD1\u6A90\u5E95\u7684\u8FDE\u7EED\u67D4\u5149",values:{intensity:1.1,distance:4,angle:110,penumbra:1,elevation:-65,color:"#e3a659"}},{id:"wide",name:"\u5BBD\u5E45\u5916\u6EA2",description:"\u5149\u6591\u66F4\u5BBD\u3001\u67D4\u548C\u7167\u4EAE\u9644\u8FD1\u5899\u9762\u4E0E\u73AF\u5883",values:{intensity:1.8,distance:8,angle:145,penumbra:1,elevation:-55,color:"#e8b976"}},{id:"wash",name:"\u5411\u4E0B\u6D17\u5899",description:"\u5149\u7EBF\u671D\u4E0B\uFF0C\u5F62\u6210\u67D4\u548C\u7684\u7ACB\u9762\u660E\u6697\u6E10\u53D8",values:{intensity:1.5,distance:6,angle:85,penumbra:.85,elevation:-75,color:"#d99b50"}},{id:"ambient",name:"\u4F4E\u4EAE\u6C1B\u56F4",description:"\u5F31\u5149\u5927\u8303\u56F4\u5916\u6EA2\uFF0C\u4E0D\u62A2\u4E3B\u4F53\u82B1\u706F",values:{intensity:.45,distance:10,angle:150,penumbra:1,elevation:-50,color:"#b88754"}}],gc=[["intensity","\u70B9\u4F4D\u4EAE\u5EA6",0,12,.05,"cd"],["distance","\u5916\u6EA2\u7167\u5C04\u8303\u56F4",.5,30,.1,"m"],["angle","\u5149\u675F\u5168\u89D2",20,170,1,"\xB0"],["penumbra","\u8FB9\u7F18\u67D4\u5316",0,1,.01,""],["azimuth","\u6C34\u5E73\u504F\u8F6C",-180,180,1,"\xB0"],["elevation","\u4E0A\u4E0B\u504F\u8F6C",-85,85,1,"\xB0"],["offset","\u79BB\u5899\u504F\u79FB",.03,1,.01,"m"]],Qp={enabled:!0,preset:"eave",intensity:1.1,distance:4,angle:110,penumbra:1,azimuth:0,elevation:-65,offset:.12,color:"#e3a659",shadows:!1},ed=(i,e)=>typeof i=="number"&&Number.isFinite(i)?i:e;function Jh(i,e){return Array.isArray(i)&&i.length===3?i.map((t,n)=>Math.max(-1e5,Math.min(1e5,ed(t,e[n])))):[...e]}function ko(i={},e=0){(!i||typeof i!="object")&&(i={});let t={...Qp};t.id=typeof i.id=="string"&&i.id.length?i.id.slice(0,80):"point-"+e,t.name=typeof i.name=="string"?i.name.slice(0,40):"\u5916\u6EA2\u70B9 "+(e+1),t.position=Jh(i.position,[0,0,0]),t.normal=Jh(i.normal,[0,0,1]);let n=Math.hypot(...t.normal);t.normal=n>1e-5?t.normal.map(s=>s/n):[0,0,1];for(let[s,,r,o]of gc)t[s]=Math.max(r,Math.min(o,ed(i[s],t[s])));for(let s of["enabled","shadows"])typeof i[s]=="boolean"&&(t[s]=i[s]);return/^#[0-9a-f]{6}$/i.test(i.color)&&(t.color=i.color.toLowerCase()),Os.some(s=>s.id===i.preset)&&(t.preset=i.preset),t}function Pt(i){(!i||typeof i!="object")&&(i={});let e=new Set,t=(Array.isArray(i.points)?i.points:[]).slice(0,Dn).map(ko).map((n,s)=>(e.has(n.id)&&(n.id="point-"+s+"-"+n.id),e.add(n.id),n));return{enabled:i.enabled===!0,preset:Os.some(n=>n.id===i.preset)?i.preset:"eave",selectedId:t.some(n=>n.id===i.selectedId)?i.selectedId:t[0]?.id??null,points:t}}function _c(i,e){let t=Os.find(n=>n.id===e)||Os[0];return ko({...i,...t.values,preset:t.id})}function td(i,e,t="eave",n="point-"+Date.now()){return _c({id:n,position:i,normal:e,name:"\u5916\u6EA2\u70B9",enabled:!0},t)}function nd(i){let e={key:String(i.key),label:String(i.label).slice(0,40),state:Pt(i.state)};return i.surfaceSpill&&typeof i.surfaceSpill=="object"&&!Array.isArray(i.surfaceSpill)&&(e.surfaceSpill=Xt(i.surfaceSpill)),i.windowLight&&typeof i.windowLight=="object"&&!Array.isArray(i.windowLight)&&(e.windowLight=ct(i.windowLight)),e}function Ho(i,e){try{e??=globalThis.localStorage;let t=JSON.parse(e.getItem(mc)||"{}");return(Array.isArray(t[i])?t[i]:[]).slice(0,30).filter(n=>n&&typeof n.key=="string"&&typeof n.label=="string").map(nd)}catch{return[]}}function xc(i,e,t){if(!["temple","pavilion","matou"].includes(i))return!1;try{t??=globalThis.localStorage;let n;try{n=JSON.parse(t.getItem(mc)||"{}")}catch{}return(!n||typeof n!="object"||Array.isArray(n))&&(n={}),n[i]=e.slice(0,30).map(nd),t.setItem(mc,JSON.stringify(n)),!0}catch{return!1}}var Oi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},zi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Hd=0,su=1,Vd=2;var ru=1,Ia=2,ni=3,Mn=0,tn=1,pn=2,Vn=0,os=1,Bi=2,ou=3,au=4,Gd=5,Fi=100,Wd=101,Xd=102,qd=103,Yd=104,$d=200,Zd=201,Kd=202,jd=203,fa=204,pa=205,Jd=206,Qd=207,ef=208,tf=209,nf=210,sf=211,rf=212,of=213,af=214,Pa=0,La=1,Da=2,as=3,Na=4,Fa=5,Ua=6,Oa=7,lu=0,lf=1,cf=2,Si=0,za=1,Ba=2,ka=3,gr=4,Ha=5,Va=6,Ga=7,qc="attached",uf="detached",cu=300,xs=301,vs=302,Wa=303,Xa=304,yo=306,$n=1e3,cn=1001,Qs=1002,wt=1003,qa=1004;var ys=1005;var Dt=1006,_r=1007;var Gn=1008;var nn=1009,uu=1010,hu=1011,xr=1012,Ya=1013,ki=1014,sn=1015,mn=1016,$a=1017,Za=1018,vr=1020,du=35902,fu=35899,pu=1021,mu=1022,Gt=1023,er=1026,yr=1027,Hi=1028,Ka=1029,Mo=1030,ja=1031;var Ja=1033,bo=33776,So=33777,To=33778,wo=33779,Qa=35840,el=35841,tl=35842,nl=35843,il=36196,sl=37492,rl=37496,ol=37808,al=37809,ll=37810,cl=37811,ul=37812,hl=37813,dl=37814,fl=37815,pl=37816,ml=37817,gl=37818,_l=37819,xl=37820,vl=37821,yl=36492,Ml=36494,bl=36495,Sl=36283,Tl=36284,wl=36285,El=36286;var ls=2300,cs=2301,da=2302,Yc=2400,$c=2401,Zc=2402,hf=2500;var gu=0,Eo=1,Mr=2,df=3200,Al=3201;var _u=0,ff=1,Wn="",_t="srgb",Wt="srgb-linear",qr="linear",Je="srgb";var rs=7680;var Kc=519,pf=512,mf=513,gf=514,xu=515,_f=516,xf=517,vf=518,yf=519,ma=35044;var vu="300 es",zn=2e3,Yr=2001;var Zn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],id=1234567,Wr=Math.PI/180,us=180/Math.PI;function Bn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function yu(i,e){return(i%e+e)%e}function em(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function tm(i,e,t){return i!==e?(t-i)/(e-i):0}function Xr(i,e,t){return(1-t)*i+t*e}function nm(i,e,t,n){return Xr(i,e,1-Math.exp(-t*n))}function im(i,e=1){return e-Math.abs(yu(i,e*2)-e)}function sm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function rm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function om(i,e){return i+Math.floor(Math.random()*(e-i+1))}function am(i,e){return i+Math.random()*(e-i)}function lm(i){return i*(.5-Math.random())}function cm(i){i!==void 0&&(id=i);let e=id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function um(i){return i*Wr}function hm(i){return i*us}function dm(i){return(i&i-1)===0&&i!==0}function fm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function mm(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),d=o((e-n)/2),m=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*m,a*c);break;case"YXY":i.set(l*m,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*m,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function On(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function et(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var rn={DEG2RAD:Wr,RAD2DEG:us,generateUUID:Bn,clamp:qe,euclideanModulo:yu,mapLinear:em,inverseLerp:tm,lerp:Xr,damp:nm,pingpong:im,smoothstep:sm,smootherstep:rm,randInt:om,randFloat:am,randFloatSpread:lm,seededRandom:cm,degToRad:um,radToDeg:hm,isPowerOfTwo:dm,ceilPowerOfTwo:fm,floorPowerOfTwo:pm,setQuaternionFromProperEuler:mm,normalize:et,denormalize:On},me=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Nt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],d=r[o+0],m=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==d||c!==m||u!==g){let p=1-a,f=l*d+c*m+u*g+h*_,S=f>=0?1:-1,b=1-f*f;if(b>Number.EPSILON){let w=Math.sqrt(b),E=Math.atan2(w,f*S);p=Math.sin(p*E)/w,a=Math.sin(a*E)/w}let v=a*S;if(l=l*p+d*v,c=c*p+m*v,u=u*p+g*v,h=h*p+_*v,p===1-a){let w=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=w,c*=w,u*=w,h*=w}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*m-c*d,e[t+1]=l*g+u*d+c*h-a*m,e[t+2]=c*g+u*m+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),m=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*m*g,this._y=c*m*h-d*u*g,this._z=c*u*g+d*m*h,this._w=c*u*h-d*m*g;break;case"YXZ":this._x=d*u*h+c*m*g,this._y=c*m*h-d*u*g,this._z=c*u*g-d*m*h,this._w=c*u*h+d*m*g;break;case"ZXY":this._x=d*u*h-c*m*g,this._y=c*m*h+d*u*g,this._z=c*u*g+d*m*h,this._w=c*u*h-d*m*g;break;case"ZYX":this._x=d*u*h-c*m*g,this._y=c*m*h+d*u*g,this._z=c*u*g-d*m*h,this._w=c*u*h+d*m*g;break;case"YZX":this._x=d*u*h+c*m*g,this._y=c*m*h+d*u*g,this._z=c*u*g-d*m*h,this._w=c*u*h-d*m*g;break;case"XZY":this._x=d*u*h-c*m*g,this._y=c*m*h-d*u*g,this._z=c*u*g+d*m*h,this._w=c*u*h+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){let m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>h){let m=2*Math.sqrt(1+n-a-h);this._w=(u-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>h){let m=2*Math.sqrt(1+a-n-h);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+u)/m}else{let m=2*Math.sqrt(1+h-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vc.copy(this).projectOnVector(e),this.sub(vc)}reflect(e){return this.sub(vc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},vc=new A,sd=new Nt,De=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],m=n[5],g=n[8],_=s[0],p=s[3],f=s[6],S=s[1],b=s[4],v=s[7],w=s[2],E=s[5],C=s[8];return r[0]=o*_+a*S+l*w,r[3]=o*p+a*b+l*E,r[6]=o*f+a*v+l*C,r[1]=c*_+u*S+h*w,r[4]=c*p+u*b+h*E,r[7]=c*f+u*v+h*C,r[2]=d*_+m*S+g*w,r[5]=d*p+m*b+g*E,r[8]=d*f+m*v+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*r,m=c*r-o*l,g=t*h+n*d+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(s*c-u*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(yc.makeScale(e,t)),this}rotate(e){return this.premultiply(yc.makeRotation(-e)),this}translate(e,t){return this.premultiply(yc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},yc=new De;function Mu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function tr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mf(){let i=tr("canvas");return i.style.display="block",i}var rd={};function nr(i){i in rd||(rd[i]=!0,console.warn(i))}function bf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var od=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ad=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gm(){let i={enabled:!0,workingColorSpace:Wt,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Je&&(s.r=mi(s.r),s.g=mi(s.g),s.b=mi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Je&&(s.r=Js(s.r),s.g=Js(s.g),s.b=Js(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Wn?qr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return nr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return nr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Wt]:{primaries:e,whitePoint:n,transfer:qr,toXYZ:od,fromXYZ:ad,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:_t},outputColorSpaceConfig:{drawingBufferColorSpace:_t}},[_t]:{primaries:e,whitePoint:n,transfer:Je,toXYZ:od,fromXYZ:ad,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:_t}}}),i}var Ye=gm();function mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Js(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var zs,ga=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zs===void 0&&(zs=tr("canvas")),zs.width=e.width,zs.height=e.height;let s=zs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=zs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=tr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=mi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(mi(t[n]/255)*255):t[n]=mi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},_m=0,ir=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Bn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Mc(s[o].image)):r.push(Mc(s[o]))}else r=Mc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Mc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ga.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var xm=0,bc=new A,Ht=class i extends Zn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=cn,s=cn,r=Dt,o=Gn,a=Gt,l=nn,c=i.DEFAULT_ANISOTROPY,u=Wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Bn(),this.name="",this.source=new ir(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new me(0,0),this.repeat=new me(1,1),this.center=new me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(bc).x}get height(){return this.source.getSize(bc).y}get depth(){return this.source.getSize(bc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $n:e.x=e.x-Math.floor(e.x);break;case cn:e.x=e.x<0?0:1;break;case Qs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $n:e.y=e.y-Math.floor(e.y);break;case cn:e.y=e.y<0?0:1;break;case Qs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=cu;Ht.DEFAULT_ANISOTROPY=1;var We=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],m=l[5],g=l[9],_=l[2],p=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(c+1)/2,v=(m+1)/2,w=(f+1)/2,E=(u+d)/4,C=(h+_)/4,L=(g+p)/4;return b>v&&b>w?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=E/n,r=C/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=E/s,r=L/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=L/r),this.set(n,s,r,t),this}let S=Math.sqrt((p-g)*(p-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(h-_)/S,this.z=(d-u)/S,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},_a=class extends Zn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new We(0,0,e,t),this.scissorTest=!1,this.viewport=new We(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Ht(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Dt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ir(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vt=class extends _a{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},$r=class extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Kn=class extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var xt=class{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Nn):Nn.fromBufferAttribute(r,o),Nn.applyMatrix4(e.matrixWorld),this.expandByPoint(Nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vo.copy(n.boundingBox)),Vo.applyMatrix4(e.matrixWorld),this.union(Vo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Nn),Nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ur),Go.subVectors(this.max,Ur),Bs.subVectors(e.a,Ur),ks.subVectors(e.b,Ur),Hs.subVectors(e.c,Ur),Ri.subVectors(ks,Bs),Ci.subVectors(Hs,ks),ts.subVectors(Bs,Hs);let t=[0,-Ri.z,Ri.y,0,-Ci.z,Ci.y,0,-ts.z,ts.y,Ri.z,0,-Ri.x,Ci.z,0,-Ci.x,ts.z,0,-ts.x,-Ri.y,Ri.x,0,-Ci.y,Ci.x,0,-ts.y,ts.x,0];return!Sc(t,Bs,ks,Hs,Go)||(t=[1,0,0,0,1,0,0,0,1],!Sc(t,Bs,ks,Hs,Go))?!1:(Wo.crossVectors(Ri,Ci),t=[Wo.x,Wo.y,Wo.z],Sc(t,Bs,ks,Hs,Go))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ci=[new A,new A,new A,new A,new A,new A,new A,new A],Nn=new A,Vo=new xt,Bs=new A,ks=new A,Hs=new A,Ri=new A,Ci=new A,ts=new A,Ur=new A,Go=new A,Wo=new A,ns=new A;function Sc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ns.fromArray(i,r);let a=s.x*Math.abs(ns.x)+s.y*Math.abs(ns.y)+s.z*Math.abs(ns.z),l=e.dot(ns),c=t.dot(ns),u=n.dot(ns);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var vm=new xt,Or=new A,Tc=new A,un=class{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):vm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Or.subVectors(e,this.center);let t=Or.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Or,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Or.copy(e.center).add(Tc)),this.expandByPoint(Or.copy(e.center).sub(Tc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ui=new A,wc=new A,Xo=new A,Ii=new A,Ec=new A,qo=new A,Ac=new A,jn=class{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ui.copy(this.origin).addScaledVector(this.direction,t),ui.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){wc.copy(e).add(t).multiplyScalar(.5),Xo.copy(t).sub(e).normalize(),Ii.copy(this.origin).sub(wc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Xo),a=Ii.dot(this.direction),l=-Ii.dot(Xo),c=Ii.lengthSq(),u=Math.abs(1-o*o),h,d,m,g;if(u>0)if(h=o*l-a,d=o*a-l,g=r*u,h>=0)if(d>=-g)if(d<=g){let _=1/u;h*=_,d*=_,m=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(wc).addScaledVector(Xo,d),m}intersectSphere(e,t){ui.subVectors(e.center,this.origin);let n=ui.dot(this.direction),s=ui.dot(ui)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ui)!==null}intersectTriangle(e,t,n,s,r){Ec.subVectors(t,e),qo.subVectors(n,e),Ac.crossVectors(Ec,qo);let o=this.direction.dot(Ac),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ii.subVectors(this.origin,e);let l=a*this.direction.dot(qo.crossVectors(Ii,qo));if(l<0)return null;let c=a*this.direction.dot(Ec.cross(Ii));if(c<0||l+c>o)return null;let u=-a*Ii.dot(Ac);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ue=class i{constructor(e,t,n,s,r,o,a,l,c,u,h,d,m,g,_,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,d,m,g,_,p)}set(e,t,n,s,r,o,a,l,c,u,h,d,m,g,_,p){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=m,f[7]=g,f[11]=_,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Vs.setFromMatrixColumn(e,0).length(),r=1/Vs.setFromMatrixColumn(e,1).length(),o=1/Vs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let d=o*u,m=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+m*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*u,m=l*h,g=c*u,_=c*h;t[0]=d+_*a,t[4]=g*a-m,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=m*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*u,m=l*h,g=c*u,_=c*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*u,m=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=g*c-m,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=m*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,m=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-d*h,t[8]=g*h+m,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=m*h+g,t[10]=d-_*h}else if(e.order==="XZY"){let d=o*l,m=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=o*u,t[9]=m*h-g,t[2]=g*h-m,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ym,e,Mm)}lookAt(e,t,n){let s=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Pi.crossVectors(n,vn),Pi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Pi.crossVectors(n,vn)),Pi.normalize(),Yo.crossVectors(vn,Pi),s[0]=Pi.x,s[4]=Yo.x,s[8]=vn.x,s[1]=Pi.y,s[5]=Yo.y,s[9]=vn.y,s[2]=Pi.z,s[6]=Yo.z,s[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],m=n[13],g=n[2],_=n[6],p=n[10],f=n[14],S=n[3],b=n[7],v=n[11],w=n[15],E=s[0],C=s[4],L=s[8],y=s[12],x=s[1],I=s[5],D=s[9],O=s[13],N=s[2],z=s[6],B=s[10],q=s[14],F=s[3],X=s[7],j=s[11],Z=s[15];return r[0]=o*E+a*x+l*N+c*F,r[4]=o*C+a*I+l*z+c*X,r[8]=o*L+a*D+l*B+c*j,r[12]=o*y+a*O+l*q+c*Z,r[1]=u*E+h*x+d*N+m*F,r[5]=u*C+h*I+d*z+m*X,r[9]=u*L+h*D+d*B+m*j,r[13]=u*y+h*O+d*q+m*Z,r[2]=g*E+_*x+p*N+f*F,r[6]=g*C+_*I+p*z+f*X,r[10]=g*L+_*D+p*B+f*j,r[14]=g*y+_*O+p*q+f*Z,r[3]=S*E+b*x+v*N+w*F,r[7]=S*C+b*I+v*z+w*X,r[11]=S*L+b*D+v*B+w*j,r[15]=S*y+b*O+v*q+w*Z,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],m=e[14],g=e[3],_=e[7],p=e[11],f=e[15];return g*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*m-n*l*m)+_*(+t*l*m-t*c*d+r*o*d-s*o*m+s*c*u-r*l*u)+p*(+t*c*h-t*a*m-r*o*h+n*o*m+r*a*u-n*c*u)+f*(-s*a*u-t*l*h+t*a*d+s*o*h-n*o*d+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],m=e[11],g=e[12],_=e[13],p=e[14],f=e[15],S=h*p*c-_*d*c+_*l*m-a*p*m-h*l*f+a*d*f,b=g*d*c-u*p*c-g*l*m+o*p*m+u*l*f-o*d*f,v=u*_*c-g*h*c+g*a*m-o*_*m-u*a*f+o*h*f,w=g*h*l-u*_*l-g*a*d+o*_*d+u*a*p-o*h*p,E=t*S+n*b+s*v+r*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/E;return e[0]=S*C,e[1]=(_*d*r-h*p*r-_*s*m+n*p*m+h*s*f-n*d*f)*C,e[2]=(a*p*r-_*l*r+_*s*c-n*p*c-a*s*f+n*l*f)*C,e[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*m-n*l*m)*C,e[4]=b*C,e[5]=(u*p*r-g*d*r+g*s*m-t*p*m-u*s*f+t*d*f)*C,e[6]=(g*l*r-o*p*r-g*s*c+t*p*c+o*s*f-t*l*f)*C,e[7]=(o*d*r-u*l*r+u*s*c-t*d*c-o*s*m+t*l*m)*C,e[8]=v*C,e[9]=(g*h*r-u*_*r-g*n*m+t*_*m+u*n*f-t*h*f)*C,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*f+t*a*f)*C,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*m-t*a*m)*C,e[12]=w*C,e[13]=(u*_*s-g*h*s+g*n*d-t*_*d-u*n*p+t*h*p)*C,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*p-t*a*p)*C,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*d+t*a*d)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,d=r*c,m=r*u,g=r*h,_=o*u,p=o*h,f=a*h,S=l*c,b=l*u,v=l*h,w=n.x,E=n.y,C=n.z;return s[0]=(1-(_+f))*w,s[1]=(m+v)*w,s[2]=(g-b)*w,s[3]=0,s[4]=(m-v)*E,s[5]=(1-(d+f))*E,s[6]=(p+S)*E,s[7]=0,s[8]=(g+b)*C,s[9]=(p-S)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Vs.set(s[0],s[1],s[2]).length(),o=Vs.set(s[4],s[5],s[6]).length(),a=Vs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Fn.copy(this);let c=1/r,u=1/o,h=1/a;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=u,Fn.elements[5]*=u,Fn.elements[6]*=u,Fn.elements[8]*=h,Fn.elements[9]*=h,Fn.elements[10]*=h,t.setFromRotationMatrix(Fn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=zn,l=!1){let c=this.elements,u=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),m=(n+s)/(n-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===zn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Yr)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=zn,l=!1){let c=this.elements,u=2/(t-e),h=2/(n-s),d=-(t+e)/(t-e),m=-(n+s)/(n-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===zn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Yr)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Vs=new A,Fn=new Ue,ym=new A(0,0,0),Mm=new A(1,1,1),Pi=new A,Yo=new A,vn=new A,ld=new Ue,cd=new Nt,kn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ld.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ld,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cd.setFromEuler(this),this.setFromQuaternion(cd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};kn.DEFAULT_ORDER="XYZ";var sr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},bm=0,ud=new A,Gs=new Nt,hi=new Ue,$o=new A,zr=new A,Sm=new A,Tm=new Nt,hd=new A(1,0,0),dd=new A(0,1,0),fd=new A(0,0,1),pd={type:"added"},wm={type:"removed"},Ws={type:"childadded",child:null},Rc={type:"childremoved",child:null},pt=class i extends Zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bm++}),this.uuid=Bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new A,t=new kn,n=new Nt,s=new A(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ue},normalMatrix:{value:new De}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gs.setFromAxisAngle(e,t),this.quaternion.multiply(Gs),this}rotateOnWorldAxis(e,t){return Gs.setFromAxisAngle(e,t),this.quaternion.premultiply(Gs),this}rotateX(e){return this.rotateOnAxis(hd,e)}rotateY(e){return this.rotateOnAxis(dd,e)}rotateZ(e){return this.rotateOnAxis(fd,e)}translateOnAxis(e,t){return ud.copy(e).applyQuaternion(this.quaternion),this.position.add(ud.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(hd,e)}translateY(e){return this.translateOnAxis(dd,e)}translateZ(e){return this.translateOnAxis(fd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?$o.copy(e):$o.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(zr,$o,this.up):hi.lookAt($o,zr,this.up),this.quaternion.setFromRotationMatrix(hi),s&&(hi.extractRotation(s.matrixWorld),Gs.setFromRotationMatrix(hi),this.quaternion.premultiply(Gs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(pd),Ws.child=e,this.dispatchEvent(Ws),Ws.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(wm),Rc.child=e,this.dispatchEvent(Rc),Rc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(pd),Ws.child=e,this.dispatchEvent(Ws),Ws.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,e,Sm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,Tm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};pt.DEFAULT_UP=new A(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Un=new A,di=new A,Cc=new A,fi=new A,Xs=new A,qs=new A,md=new A,Ic=new A,Pc=new A,Lc=new A,Dc=new We,Nc=new We,Fc=new We,Ni=class i{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Un.subVectors(e,t),s.cross(Un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Un.subVectors(s,t),di.subVectors(n,t),Cc.subVectors(e,t);let o=Un.dot(Un),a=Un.dot(di),l=Un.dot(Cc),c=di.dot(di),u=di.dot(Cc),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let d=1/h,m=(c*l-a*u)*d,g=(o*u-a*l)*d;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,fi.x),l.addScaledVector(o,fi.y),l.addScaledVector(a,fi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Dc.setScalar(0),Nc.setScalar(0),Fc.setScalar(0),Dc.fromBufferAttribute(e,t),Nc.fromBufferAttribute(e,n),Fc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Dc,r.x),o.addScaledVector(Nc,r.y),o.addScaledVector(Fc,r.z),o}static isFrontFacing(e,t,n,s){return Un.subVectors(n,t),di.subVectors(e,t),Un.cross(di).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),di.subVectors(this.a,this.b),Un.cross(di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Xs.subVectors(s,n),qs.subVectors(r,n),Ic.subVectors(e,n);let l=Xs.dot(Ic),c=qs.dot(Ic);if(l<=0&&c<=0)return t.copy(n);Pc.subVectors(e,s);let u=Xs.dot(Pc),h=qs.dot(Pc);if(u>=0&&h<=u)return t.copy(s);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(Xs,o);Lc.subVectors(e,r);let m=Xs.dot(Lc),g=qs.dot(Lc);if(g>=0&&m<=g)return t.copy(r);let _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(qs,a);let p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return md.subVectors(r,s),a=(h-u)/(h-u+(m-g)),t.copy(s).addScaledVector(md,a);let f=1/(p+_+d);return o=_*f,a=d*f,t.copy(n).addScaledVector(Xs,o).addScaledVector(qs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Sf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},Zo={h:0,s:0,l:0};function Uc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ue=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=_t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=yu(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Uc(o,r,e+1/3),this.g=Uc(o,r,e),this.b=Uc(o,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=_t){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=_t){let n=Sf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}copyLinearToSRGB(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=_t){return Ye.workingToColorSpace(Yt.copy(this),e),Math.round(qe(Yt.r*255,0,255))*65536+Math.round(qe(Yt.g*255,0,255))*256+Math.round(qe(Yt.b*255,0,255))}getHexString(e=_t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Yt.copy(this),t);let n=Yt.r,s=Yt.g,r=Yt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=_t){Ye.workingToColorSpace(Yt.copy(this),e);let t=Yt.r,n=Yt.g,s=Yt.b;return e!==_t?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Li),this.setHSL(Li.h+e,Li.s+t,Li.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Li),e.getHSL(Zo);let n=Xr(Li.h,Zo.h,t),s=Xr(Li.s,Zo.s,t),r=Xr(Li.l,Zo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Yt=new ue;ue.NAMES=Sf;var Em=0,hn=class extends Zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=Bn(),this.name="",this.type="Material",this.blending=os,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fa,this.blendDst=pa,this.blendEquation=Fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=as,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Kc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==os&&(n.blending=this.blending),this.side!==Mn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fa&&(n.blendSrc=this.blendSrc),this.blendDst!==pa&&(n.blendDst=this.blendDst),this.blendEquation!==Fi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==as&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Kc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},en=class extends hn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=lu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var At=new A,Ko=new me,Am=0,Rt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Am++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ma,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ko.fromBufferAttribute(this,t),Ko.applyMatrix3(e),this.setXY(t,Ko.x,Ko.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=On(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=On(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=On(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=On(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=On(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array),r=et(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ma&&(e.usage=this.usage),e}};var Zr=class extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Kr=class extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ft=class extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Rm=0,Rn=new Ue,Oc=new pt,Ys=new A,yn=new xt,Br=new xt,kt=new A,Ft=class i extends Zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=Bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Mu(e)?Kr:Zr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new De().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,t,n){return Rn.makeTranslation(e,t,n),this.applyMatrix4(Rn),this}scale(e,t,n){return Rn.makeScale(e,t,n),this.applyMatrix4(Rn),this}lookAt(e){return Oc.lookAt(e),Oc.updateMatrix(),this.applyMatrix4(Oc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ys).negate(),this.translate(Ys.x,Ys.y,Ys.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ft(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Br.setFromBufferAttribute(a),this.morphTargetsRelative?(kt.addVectors(yn.min,Br.min),yn.expandByPoint(kt),kt.addVectors(yn.max,Br.max),yn.expandByPoint(kt)):(yn.expandByPoint(Br.min),yn.expandByPoint(Br.max))}yn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)kt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(kt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)kt.fromBufferAttribute(a,c),l&&(Ys.fromBufferAttribute(e,c),kt.add(Ys)),s=Math.max(s,n.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Rt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new A,l[L]=new A;let c=new A,u=new A,h=new A,d=new me,m=new me,g=new me,_=new A,p=new A;function f(L,y,x){c.fromBufferAttribute(n,L),u.fromBufferAttribute(n,y),h.fromBufferAttribute(n,x),d.fromBufferAttribute(r,L),m.fromBufferAttribute(r,y),g.fromBufferAttribute(r,x),u.sub(c),h.sub(c),m.sub(d),g.sub(d);let I=1/(m.x*g.y-g.x*m.y);isFinite(I)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(I),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(I),a[L].add(_),a[y].add(_),a[x].add(_),l[L].add(p),l[y].add(p),l[x].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let L=0,y=S.length;L<y;++L){let x=S[L],I=x.start,D=x.count;for(let O=I,N=I+D;O<N;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let b=new A,v=new A,w=new A,E=new A;function C(L){w.fromBufferAttribute(s,L),E.copy(w);let y=a[L];b.copy(y),b.sub(w.multiplyScalar(w.dot(y))).normalize(),v.crossVectors(E,y);let I=v.dot(l[L])<0?-1:1;o.setXYZW(L,b.x,b.y,b.z,I)}for(let L=0,y=S.length;L<y;++L){let x=S[L],I=x.start,D=x.count;for(let O=I,N=I+D;O<N;O+=3)C(e.getX(O+0)),C(e.getX(O+1)),C(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);let s=new A,r=new A,o=new A,a=new A,l=new A,c=new A,u=new A,h=new A;if(e)for(let d=0,m=e.count;d<m;d+=3){let g=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),m=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?m=l[_]*a.data.stride+a.offset:m=l[_]*u;for(let f=0;f<u;f++)d[g++]=c[m++]}return new Rt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],m=e(d,n);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],h=r[c];for(let d=0,m=h.length;d<m;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gd=new Ue,is=new jn,jo=new un,_d=new A,Jo=new A,Qo=new A,ea=new A,zc=new A,ta=new A,xd=new A,na=new A,ot=class extends pt{constructor(e=new Ft,t=new en){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ta.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(zc.fromBufferAttribute(h,e),o?ta.addScaledVector(zc,u):ta.addScaledVector(zc.sub(t),u))}t.add(ta)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),jo.copy(n.boundingSphere),jo.applyMatrix4(r),is.copy(e.ray).recast(e.near),!(jo.containsPoint(is.origin)===!1&&(is.intersectSphere(jo,_d)===null||is.origin.distanceToSquared(_d)>(e.far-e.near)**2))&&(gd.copy(r).invert(),is.copy(e.ray).applyMatrix4(gd),!(n.boundingBox!==null&&is.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,is)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let p=d[g],f=o[p.materialIndex],S=Math.max(p.start,m.start),b=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let v=S,w=b;v<w;v+=3){let E=a.getX(v),C=a.getX(v+1),L=a.getX(v+2);s=ia(this,f,e,n,c,u,h,E,C,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){let S=a.getX(p),b=a.getX(p+1),v=a.getX(p+2);s=ia(this,o,e,n,c,u,h,S,b,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let p=d[g],f=o[p.materialIndex],S=Math.max(p.start,m.start),b=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let v=S,w=b;v<w;v+=3){let E=v,C=v+1,L=v+2;s=ia(this,f,e,n,c,u,h,E,C,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){let S=p,b=p+1,v=p+2;s=ia(this,o,e,n,c,u,h,S,b,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Cm(i,e,t,n,s,r,o,a){let l;if(e.side===tn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Mn,a),l===null)return null;na.copy(a),na.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(na);return c<t.near||c>t.far?null:{distance:c,point:na.clone(),object:i}}function ia(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Jo),i.getVertexPosition(l,Qo),i.getVertexPosition(c,ea);let u=Cm(i,e,t,n,Jo,Qo,ea,xd);if(u){let h=new A;Ni.getBarycoord(xd,Jo,Qo,ea,h),s&&(u.uv=Ni.getInterpolatedAttribute(s,a,l,c,h,new me)),r&&(u.uv1=Ni.getInterpolatedAttribute(r,a,l,c,h,new me)),o&&(u.normal=Ni.getInterpolatedAttribute(o,a,l,c,h,new A),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new A,materialIndex:0};Ni.getNormal(Jo,Qo,ea,d.normal),u.face=d,u.barycoord=h}return u}var rr=class i extends Ft{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(h,2));function g(_,p,f,S,b,v,w,E,C,L,y){let x=v/C,I=w/L,D=v/2,O=w/2,N=E/2,z=C+1,B=L+1,q=0,F=0,X=new A;for(let j=0;j<B;j++){let Z=j*I-O;for(let te=0;te<z;te++){let Oe=te*x-D;X[_]=Oe*S,X[p]=Z*b,X[f]=N,c.push(X.x,X.y,X.z),X[_]=0,X[p]=0,X[f]=E>0?1:-1,u.push(X.x,X.y,X.z),h.push(te/C),h.push(1-j/L),q+=1}}for(let j=0;j<L;j++)for(let Z=0;Z<C;Z++){let te=d+Z+z*j,Oe=d+Z+z*(j+1),He=d+(Z+1)+z*(j+1),Re=d+(Z+1)+z*j;l.push(te,Oe,Re),l.push(Oe,He,Re),F+=6}a.addGroup(m,F,y),m+=F,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ms(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function $t(i){let e={};for(let t=0;t<i.length;t++){let n=Ms(i[t]);for(let s in n)e[s]=n[s]}return e}function Im(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function bu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}var Ti={clone:Ms,merge:$t},Pm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vt=class extends hn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pm,this.fragmentShader=Lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ms(e.uniforms),this.uniformsGroups=Im(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},jr=class extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Di=new A,vd=new me,yd=new me,bt=class extends jr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=us*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return us*2*Math.atan(Math.tan(Wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,vd,yd),t.subVectors(yd,vd)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Wr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$s=-90,Zs=1,xa=class extends pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new bt($s,Zs,e,t);s.layers=this.layers,this.add(s);let r=new bt($s,Zs,e,t);r.layers=this.layers,this.add(r);let o=new bt($s,Zs,e,t);o.layers=this.layers,this.add(o);let a=new bt($s,Zs,e,t);a.layers=this.layers,this.add(a);let l=new bt($s,Zs,e,t);l.layers=this.layers,this.add(l);let c=new bt($s,Zs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Yr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,d,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Jr=class extends Ht{constructor(e=[],t=xs,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},va=class extends Vt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Jr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new rr(5,5,5),r=new vt({name:"CubemapFromEquirect",uniforms:Ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:Vn});r.uniforms.tEquirect.value=t;let o=new ot(s,r),a=t.minFilter;return t.minFilter===Gn&&(t.minFilter=Dt),new xa(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Lt=class extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Dm={type:"move"},or=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let p=t.getJointPose(_,n),f=this._getHandJoint(c,_);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Dm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Lt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Qr=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ue(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},hs=class extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ar=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ma,this.updateRanges=[],this.version=0,this.uuid=Bn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Qt=new A,lr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix4(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyNormalMatrix(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.transformDirection(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=On(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=On(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=On(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=On(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=On(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array),r=et(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Rt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var Md=new A,bd=new We,Sd=new We,Nm=new A,Td=new Ue,sa=new A,Bc=new un,wd=new Ue,kc=new jn,eo=class extends ot{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=qc,this.bindMatrix=new Ue,this.bindMatrixInverse=new Ue,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new xt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,sa),this.boundingBox.expandByPoint(sa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,sa),this.boundingSphere.expandByPoint(sa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Bc.copy(this.boundingSphere),Bc.applyMatrix4(s),e.ray.intersectsSphere(Bc)!==!1&&(wd.copy(s).invert(),kc.copy(e.ray).applyMatrix4(wd),!(this.boundingBox!==null&&kc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,kc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new We,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===qc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===uf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;bd.fromBufferAttribute(s.attributes.skinIndex,e),Sd.fromBufferAttribute(s.attributes.skinWeight,e),Md.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Sd.getComponent(r);if(o!==0){let a=bd.getComponent(r);Td.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Nm.copy(Md).applyMatrix4(Td),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},cr=class extends pt{constructor(){super(),this.isBone=!0,this.type="Bone"}},ds=class extends Ht{constructor(e=null,t=1,n=1,s,r,o,a,l,c=wt,u=wt,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ed=new Ue,Fm=new Ue,to=class i{constructor(e=[],t=[]){this.uuid=Bn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ue)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Ue;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:Fm;Ed.multiplyMatrices(a,t[r]),Ed.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ds(t,e,e,Gt,sn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new cr),this.bones.push(o),this.boneInverses.push(new Ue().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},Ui=class extends Rt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ks=new Ue,Ad=new Ue,ra=[],Rd=new xt,Um=new Ue,kr=new ot,Hr=new un,gi=class extends ot{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ui(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Um)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new xt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ks),Rd.copy(e.boundingBox).applyMatrix4(Ks),this.boundingBox.union(Rd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ks),Hr.copy(e.boundingSphere).applyMatrix4(Ks),this.boundingSphere.union(Hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(kr.geometry=this.geometry,kr.material=this.material,kr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hr.copy(this.boundingSphere),Hr.applyMatrix4(n),e.ray.intersectsSphere(Hr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ks),Ad.multiplyMatrices(n,Ks),kr.matrixWorld=Ad,kr.raycast(e,ra);for(let o=0,a=ra.length;o<a;o++){let l=ra[o];l.instanceId=r,l.object=this,t.push(l)}ra.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ui(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ds(new Float32Array(s*this.count),s,this.count,Hi,sn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Hc=new A,Om=new A,zm=new De,Cn=class{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Hc.subVectors(n,t).cross(Om.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Hc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||zm.getNormalMatrix(e),s=this.coplanarPoint(Hc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ss=new un,Bm=new me(.5,.5),oa=new A,ur=class{constructor(e=new Cn,t=new Cn,n=new Cn,s=new Cn,r=new Cn,o=new Cn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],m=r[7],g=r[8],_=r[9],p=r[10],f=r[11],S=r[12],b=r[13],v=r[14],w=r[15];if(s[0].setComponents(c-o,m-u,f-g,w-S).normalize(),s[1].setComponents(c+o,m+u,f+g,w+S).normalize(),s[2].setComponents(c+a,m+h,f+_,w+b).normalize(),s[3].setComponents(c-a,m-h,f-_,w-b).normalize(),n)s[4].setComponents(l,d,p,v).normalize(),s[5].setComponents(c-l,m-d,f-p,w-v).normalize();else if(s[4].setComponents(c-l,m-d,f-p,w-v).normalize(),t===zn)s[5].setComponents(c+l,m+d,f+p,w+v).normalize();else if(t===Yr)s[5].setComponents(l,d,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ss.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ss.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ss)}intersectsSprite(e){ss.center.set(0,0,0);let t=Bm.distanceTo(e.center);return ss.radius=.7071067811865476+t,ss.applyMatrix4(e.matrixWorld),this.intersectsSphere(ss)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(oa.x=s.normal.x>0?e.max.x:e.min.x,oa.y=s.normal.y>0?e.max.y:e.min.y,oa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(oa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var hr=class extends hn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ya=new A,Ma=new A,Cd=new Ue,Vr=new jn,aa=new un,Vc=new A,Id=new A,fs=class extends pt{constructor(e=new Ft,t=new hr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ya.fromBufferAttribute(t,s-1),Ma.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ya.distanceTo(Ma);e.setAttribute("lineDistance",new ft(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),aa.copy(n.boundingSphere),aa.applyMatrix4(s),aa.radius+=r,e.ray.intersectsSphere(aa)===!1)return;Cd.copy(s).invert(),Vr.copy(e.ray).applyMatrix4(Cd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let m=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=m,p=g-1;_<p;_+=c){let f=u.getX(_),S=u.getX(_+1),b=la(this,e,Vr,l,f,S,_);b&&t.push(b)}if(this.isLineLoop){let _=u.getX(g-1),p=u.getX(m),f=la(this,e,Vr,l,_,p,g-1);f&&t.push(f)}}else{let m=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=m,p=g-1;_<p;_+=c){let f=la(this,e,Vr,l,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){let _=la(this,e,Vr,l,g-1,m,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function la(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(ya.fromBufferAttribute(a,s),Ma.fromBufferAttribute(a,r),t.distanceSqToSegment(ya,Ma,Vc,Id)>n)return;Vc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Vc);if(!(c<e.near||c>e.far))return{distance:c,point:Id.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Pd=new A,Ld=new A,no=class extends fs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Pd.fromBufferAttribute(t,s),Ld.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Pd.distanceTo(Ld);e.setAttribute("lineDistance",new ft(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},io=class extends fs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},dr=class extends hn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Dd=new Ue,jc=new jn,ca=new un,ua=new A,so=class extends pt{constructor(e=new Ft,t=new dr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(s),ca.radius+=r,e.ray.intersectsSphere(ca)===!1)return;Dd.copy(s).invert(),jc.copy(e.ray).applyMatrix4(Dd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let g=d,_=m;g<_;g++){let p=c.getX(g);ua.fromBufferAttribute(h,p),Nd(ua,p,l,s,e,t,this)}}else{let d=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let g=d,_=m;g<_;g++)ua.fromBufferAttribute(h,g),Nd(ua,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Nd(i,e,t,n,s,r,o){let a=jc.distanceSqToPoint(i);if(a<t){let l=new A;jc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ro=class extends Ht{constructor(e,t,n=ki,s,r,o,a=wt,l=wt,c,u=er,h=1){if(u!==er&&u!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ir(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},oo=class extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var ao=class i extends Ft{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],d=[],m=[],g=0,_=[],p=n/2,f=0;S(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new ft(h,3)),this.setAttribute("normal",new ft(d,3)),this.setAttribute("uv",new ft(m,2));function S(){let v=new A,w=new A,E=0,C=(t-e)/n;for(let L=0;L<=r;L++){let y=[],x=L/r,I=x*(t-e)+e;for(let D=0;D<=s;D++){let O=D/s,N=O*l+a,z=Math.sin(N),B=Math.cos(N);w.x=I*z,w.y=-x*n+p,w.z=I*B,h.push(w.x,w.y,w.z),v.set(z,C,B).normalize(),d.push(v.x,v.y,v.z),m.push(O,1-x),y.push(g++)}_.push(y)}for(let L=0;L<s;L++)for(let y=0;y<r;y++){let x=_[y][L],I=_[y+1][L],D=_[y+1][L+1],O=_[y][L+1];(e>0||y!==0)&&(u.push(x,I,O),E+=3),(t>0||y!==r-1)&&(u.push(I,D,O),E+=3)}c.addGroup(f,E,0),f+=E}function b(v){let w=g,E=new me,C=new A,L=0,y=v===!0?e:t,x=v===!0?1:-1;for(let D=1;D<=s;D++)h.push(0,p*x,0),d.push(0,x,0),m.push(.5,.5),g++;let I=g;for(let D=0;D<=s;D++){let N=D/s*l+a,z=Math.cos(N),B=Math.sin(N);C.x=y*B,C.y=p*x,C.z=y*z,h.push(C.x,C.y,C.z),d.push(0,x,0),E.x=z*.5+.5,E.y=B*.5*x+.5,m.push(E.x,E.y),g++}for(let D=0;D<s;D++){let O=w+D,N=I+D;v===!0?u.push(N,N+1,O):u.push(N+1,N,O),L+=3}c.addGroup(f,L,v===!0?1:2),f+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var _i=class i extends Ft{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,d=t/l,m=[],g=[],_=[],p=[];for(let f=0;f<u;f++){let S=f*d-o;for(let b=0;b<c;b++){let v=b*h-r;g.push(v,-S,0),_.push(0,0,1),p.push(b/a),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let S=0;S<a;S++){let b=S+c*f,v=S+c*(f+1),w=S+1+c*(f+1),E=S+1+c*f;m.push(b,v,E),m.push(v,w,E)}this.setIndex(m),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(_,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var lo=class i extends Ft{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],h=new A,d=new A,m=[],g=[],_=[],p=[];for(let f=0;f<=n;f++){let S=[],b=f/n,v=0;f===0&&o===0?v=.5/t:f===n&&l===Math.PI&&(v=-.5/t);for(let w=0;w<=t;w++){let E=w/t;h.x=-e*Math.cos(s+E*r)*Math.sin(o+b*a),h.y=e*Math.cos(o+b*a),h.z=e*Math.sin(s+E*r)*Math.sin(o+b*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),p.push(E+v,1-b),S.push(c++)}u.push(S)}for(let f=0;f<n;f++)for(let S=0;S<t;S++){let b=u[f][S+1],v=u[f][S],w=u[f+1][S],E=u[f+1][S+1];(f!==0||o>0)&&m.push(b,v,E),(f!==n-1||l<Math.PI)&&m.push(v,w,E)}this.setIndex(m),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(_,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var co=class extends vt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Hn=class extends hn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_u,this.normalScale=new me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},dn=class extends Hn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var fr=class extends hn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=df,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ba=class extends hn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ha(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function km(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Hm(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Fd(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function Tf(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}var xi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Sa=class extends xi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yc,endingEnd:Yc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case $c:r=e,a=2*t-n;break;case Zc:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case $c:o=e,l=2*n-t;break;case Zc:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,m=this._weightNext,g=(n-t)/(s-t),_=g*g,p=_*g,f=-d*p+2*d*_-d*g,S=(1+d)*p+(-1.5-2*d)*_+(-.5+d)*g+1,b=(-1-m)*p+(1.5+m)*_+.5*g,v=m*p-m*_;for(let w=0;w!==a;++w)r[w]=f*o[u+w]+S*o[c+w]+b*o[l+w]+v*o[h+w];return r}},Ta=class extends xi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),h=1-u;for(let d=0;d!==a;++d)r[d]=o[c+d]*h+o[l+d]*u;return r}},wa=class extends xi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},fn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ha(t,this.TimeBufferType),this.values=ha(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ha(e.times,Array),values:ha(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new wa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ta(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Sa(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ls:t=this.InterpolantFactoryMethodDiscrete;break;case cs:t=this.InterpolantFactoryMethodLinear;break;case da:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ls;case this.InterpolantFactoryMethodLinear:return cs;case this.InterpolantFactoryMethodSmooth:return da}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&km(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===da,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let h=a*n,d=h-n,m=h+n;for(let g=0;g!==n;++g){let _=t[h+g];if(_!==t[d+g]||_!==t[m+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*n,d=o*n;for(let m=0;m!==n;++m)t[d+m]=t[h+m]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};fn.prototype.ValueTypeName="";fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=cs;var vi=class extends fn{constructor(e,t,n){super(e,t,n)}};vi.prototype.ValueTypeName="bool";vi.prototype.ValueBufferType=Array;vi.prototype.DefaultInterpolation=ls;vi.prototype.InterpolantFactoryMethodLinear=void 0;vi.prototype.InterpolantFactoryMethodSmooth=void 0;var uo=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}};uo.prototype.ValueTypeName="color";var Jn=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}};Jn.prototype.ValueTypeName="number";var Ea=class extends xi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)Nt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Qn=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ea(this.times,this.values,this.getValueSize(),e)}};Qn.prototype.ValueTypeName="quaternion";Qn.prototype.InterpolantFactoryMethodSmooth=void 0;var yi=class extends fn{constructor(e,t,n){super(e,t,n)}};yi.prototype.ValueTypeName="string";yi.prototype.ValueBufferType=Array;yi.prototype.DefaultInterpolation=ls;yi.prototype.InterpolantFactoryMethodLinear=void 0;yi.prototype.InterpolantFactoryMethodSmooth=void 0;var ei=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}};ei.prototype.ValueTypeName="vector";var ho=class{constructor(e="",t=-1,n=[],s=hf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Bn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Gm(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(fn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let u=Hm(l);l=Fd(l,1,u),c=Fd(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Jn(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(r);if(u&&u.length>1){let h=u[1],d=s[h];d||(s[h]=d=[]),d.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(h,d,m,g,_){if(m.length!==0){let p=[],f=[];Tf(m,p,f,g),p.length!==0&&_.push(new h(d,p,f))}},s=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let h=0;h<c.length;h++){let d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let m={},g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)m[d[g].morphTargets[_]]=-1;for(let _ in m){let p=[],f=[];for(let S=0;S!==d[g].morphTargets.length;++S){let b=d[g];p.push(b.time),f.push(b.morphTarget===_?1:0)}s.push(new Jn(".morphTargetInfluence["+_+"]",p,f))}l=m.length*o}else{let m=".bones["+t[h].name+"]";n(ei,m+".position",d,"pos",s),n(Qn,m+".quaternion",d,"rot",s),n(ei,m+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Vm(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Jn;case"vector":case"vector2":case"vector3":case"vector4":return ei;case"color":return uo;case"quaternion":return Qn;case"bool":case"boolean":return vi;case"string":return yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Gm(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Vm(i.type);if(i.times===void 0){let t=[],n=[];Tf(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}var Yn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},Aa=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let m=c[h],g=c[h+1];if(m.global&&(m.lastIndex=0),m.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},wf=new Aa,ti=class{constructor(e){this.manager=e!==void 0?e:wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ti.DEFAULT_MATERIAL_NAME="__DEFAULT";var pi={},Jc=class extends Error{constructor(e,t){super(e),this.response=t}},pr=class extends ti{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Yn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(pi[e]!==void 0){pi[e].push({onLoad:t,onProgress:n,onError:s});return}pi[e]=[],pi[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=pi[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),m=d?parseInt(d):0,g=m!==0,_=0,p=new ReadableStream({start(f){S();function S(){h.read().then(({done:b,value:v})=>{if(b)f.close();else{_+=v.byteLength;let w=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:m});for(let E=0,C=u.length;E<C;E++){let L=u[E];L.onProgress&&L.onProgress(w)}f.enqueue(v),S()}},b=>{f.error(b)})}}});return new Response(p)}else throw new Jc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,m=new TextDecoder(d);return c.arrayBuffer().then(g=>m.decode(g))}}}).then(c=>{Yn.add(`file:${e}`,c);let u=pi[e];delete pi[e];for(let h=0,d=u.length;h<d;h++){let m=u[h];m.onLoad&&m.onLoad(c)}}).catch(c=>{let u=pi[e];if(u===void 0)throw this.manager.itemError(e),c;delete pi[e];for(let h=0,d=u.length;h<d;h++){let m=u[h];m.onError&&m.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var js=new WeakMap,Ra=class extends ti{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Yn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let h=js.get(o);h===void 0&&(h=[],js.set(o,h)),h.push({onLoad:t,onError:s})}return o}let a=tr("img");function l(){u(),t&&t(this);let h=js.get(this)||[];for(let d=0;d<h.length;d++){let m=h[d];m.onLoad&&m.onLoad(this)}js.delete(this),r.manager.itemEnd(e)}function c(h){u(),s&&s(h),Yn.remove(`image:${e}`);let d=js.get(this)||[];for(let m=0;m<d.length;m++){let g=d[m];g.onError&&g.onError(h)}js.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Yn.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var ps=class extends ti{constructor(e){super(e)}load(e,t,n,s){let r=new Ht,o=new Ra(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},ms=class extends pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},fo=class extends ms{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Gc=new Ue,Ud=new A,Od=new A,po=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new me(512,512),this.mapType=nn,this.map=null,this.mapPass=null,this.matrix=new Ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ur,this._frameExtents=new me(1,1),this._viewportCount=1,this._viewports=[new We(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ud.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ud),Od.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Od),t.updateMatrixWorld(),Gc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Gc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Qc=class extends po{constructor(){super(new bt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=us*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},gs=class extends ms{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Qc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},zd=new Ue,Gr=new A,Wc=new A,eu=class extends po{constructor(){super(new bt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new me(4,2),this._viewportCount=6,this._viewports=[new We(2,1,1,1),new We(0,1,1,1),new We(3,1,1,1),new We(1,1,1,1),new We(3,0,1,1),new We(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Gr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Gr),Wc.copy(n.position),Wc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Wc),n.updateMatrixWorld(),s.makeTranslation(-Gr.x,-Gr.y,-Gr.z),zd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zd,n.coordinateSystem,n.reversedDepth)}},mo=class extends ms{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new eu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Mi=class extends jr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},tu=class extends po{constructor(){super(new Mi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},_s=class extends ms{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new tu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var bi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Xc=new WeakMap,go=class extends ti{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Yn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{if(Xc.has(o)===!0)s&&s(Xc.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Yn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Xc.set(l,c),Yn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Yn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ca=class extends bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},_o=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var Su="\\[\\]\\.:\\/",Wm=new RegExp("["+Su+"]","g"),Tu="[^"+Su+"]",Xm="[^"+Su.replace("\\.","")+"]",qm=/((?:WC+[\/:])*)/.source.replace("WC",Tu),Ym=/(WCOD+)?/.source.replace("WCOD",Xm),$m=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Tu),Zm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Tu),Km=new RegExp("^"+qm+Ym+$m+Zm+"$"),jm=["material","materials","bones","map"],nu=class{constructor(e,t,n){let s=n||rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Wm,"")}static parseTrackName(e){let t=Km.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);jm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};rt.Composite=nu;rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};rt.prototype.GetterByBindingType=[rt.prototype._getValue_direct,rt.prototype._getValue_array,rt.prototype._getValue_arrayElement,rt.prototype._getValue_toArray];rt.prototype.SetterByBindingTypeAndVersioning=[[rt.prototype._setValue_direct,rt.prototype._setValue_direct_setNeedsUpdate,rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[rt.prototype._setValue_array,rt.prototype._setValue_array_setNeedsUpdate,rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[rt.prototype._setValue_arrayElement,rt.prototype._setValue_arrayElement_setNeedsUpdate,rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[rt.prototype._setValue_fromArray,rt.prototype._setValue_fromArray_setNeedsUpdate,rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var xy=new Float32Array(1);var Bd=new Ue,xo=class{constructor(e,t,n=0,s=1/0){this.ray=new jn(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new sr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Bd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bd),this}intersectObject(e,t=!0,n=[]){return iu(e,this,n,t),n.sort(kd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)iu(e[s],this,n,t);return n.sort(kd),n}};function kd(i,e){return i.distance-e.distance}function iu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)iu(r[o],e,t,!0)}}var mr=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(qe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var vo=class extends Zn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function wu(i,e,t,n){let s=Jm(n);switch(t){case pu:return i*e;case Hi:return i*e/s.components*s.byteLength;case Ka:return i*e/s.components*s.byteLength;case Mo:return i*e*2/s.components*s.byteLength;case ja:return i*e*2/s.components*s.byteLength;case mu:return i*e*3/s.components*s.byteLength;case Gt:return i*e*4/s.components*s.byteLength;case Ja:return i*e*4/s.components*s.byteLength;case bo:case So:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case To:case wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case el:case nl:return Math.max(i,16)*Math.max(e,8)/4;case Qa:case tl:return Math.max(i,8)*Math.max(e,8)/2;case il:case sl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ol:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case al:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ll:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case cl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ul:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case hl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case dl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case fl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case pl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ml:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case gl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case _l:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case xl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case vl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case yl:case Ml:case bl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Sl:case Tl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case wl:case El:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Jm(i){switch(i){case nn:case uu:return{byteLength:1,components:1};case xr:case hu:case mn:return{byteLength:2,components:1};case $a:case Za:return{byteLength:2,components:4};case ki:case Ya:case sn:return{byteLength:4,components:1};case du:case fu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Zf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function eg(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<h.length;m++){let g=h[d],_=h[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let m=0,g=h.length;m<g;m++){let _=h[m];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var tg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ng=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ig=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,og=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ag=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,lg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ug=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,pg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,mg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,gg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_g=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Sg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Tg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,wg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Eg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ag=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ig=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ng=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Fg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ug=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Og=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,kg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Gg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Wg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Yg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,$g=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Kg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Qg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,e0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,t0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,n0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,i0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,s0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,r0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,a0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,l0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,c0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,u0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,h0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,d0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,f0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,p0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,m0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,v0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,b0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,S0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,T0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,w0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,E0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,A0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,R0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,C0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,I0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,P0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,L0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,D0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,N0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,F0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,U0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,O0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,z0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,B0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,k0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,H0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,V0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,W0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,X0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Y0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,$0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Z0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,K0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,j0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,J0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Q0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,e_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,t_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,a_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,l_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,c_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,u_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,h_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,f_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,m_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,__=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,v_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,M_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,b_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,w_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,C_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,I_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,P_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,L_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,D_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:tg,alphahash_pars_fragment:ng,alphamap_fragment:ig,alphamap_pars_fragment:sg,alphatest_fragment:rg,alphatest_pars_fragment:og,aomap_fragment:ag,aomap_pars_fragment:lg,batching_pars_vertex:cg,batching_vertex:ug,begin_vertex:hg,beginnormal_vertex:dg,bsdfs:fg,iridescence_fragment:pg,bumpmap_pars_fragment:mg,clipping_planes_fragment:gg,clipping_planes_pars_fragment:_g,clipping_planes_pars_vertex:xg,clipping_planes_vertex:vg,color_fragment:yg,color_pars_fragment:Mg,color_pars_vertex:bg,color_vertex:Sg,common:Tg,cube_uv_reflection_fragment:wg,defaultnormal_vertex:Eg,displacementmap_pars_vertex:Ag,displacementmap_vertex:Rg,emissivemap_fragment:Cg,emissivemap_pars_fragment:Ig,colorspace_fragment:Pg,colorspace_pars_fragment:Lg,envmap_fragment:Dg,envmap_common_pars_fragment:Ng,envmap_pars_fragment:Fg,envmap_pars_vertex:Ug,envmap_physical_pars_fragment:Yg,envmap_vertex:Og,fog_vertex:zg,fog_pars_vertex:Bg,fog_fragment:kg,fog_pars_fragment:Hg,gradientmap_pars_fragment:Vg,lightmap_pars_fragment:Gg,lights_lambert_fragment:Wg,lights_lambert_pars_fragment:Xg,lights_pars_begin:qg,lights_toon_fragment:$g,lights_toon_pars_fragment:Zg,lights_phong_fragment:Kg,lights_phong_pars_fragment:jg,lights_physical_fragment:Jg,lights_physical_pars_fragment:Qg,lights_fragment_begin:e0,lights_fragment_maps:t0,lights_fragment_end:n0,logdepthbuf_fragment:i0,logdepthbuf_pars_fragment:s0,logdepthbuf_pars_vertex:r0,logdepthbuf_vertex:o0,map_fragment:a0,map_pars_fragment:l0,map_particle_fragment:c0,map_particle_pars_fragment:u0,metalnessmap_fragment:h0,metalnessmap_pars_fragment:d0,morphinstance_vertex:f0,morphcolor_vertex:p0,morphnormal_vertex:m0,morphtarget_pars_vertex:g0,morphtarget_vertex:_0,normal_fragment_begin:x0,normal_fragment_maps:v0,normal_pars_fragment:y0,normal_pars_vertex:M0,normal_vertex:b0,normalmap_pars_fragment:S0,clearcoat_normal_fragment_begin:T0,clearcoat_normal_fragment_maps:w0,clearcoat_pars_fragment:E0,iridescence_pars_fragment:A0,opaque_fragment:R0,packing:C0,premultiplied_alpha_fragment:I0,project_vertex:P0,dithering_fragment:L0,dithering_pars_fragment:D0,roughnessmap_fragment:N0,roughnessmap_pars_fragment:F0,shadowmap_pars_fragment:U0,shadowmap_pars_vertex:O0,shadowmap_vertex:z0,shadowmask_pars_fragment:B0,skinbase_vertex:k0,skinning_pars_vertex:H0,skinning_vertex:V0,skinnormal_vertex:G0,specularmap_fragment:W0,specularmap_pars_fragment:X0,tonemapping_fragment:q0,tonemapping_pars_fragment:Y0,transmission_fragment:$0,transmission_pars_fragment:Z0,uv_pars_fragment:K0,uv_pars_vertex:j0,uv_vertex:J0,worldpos_vertex:Q0,background_vert:e_,background_frag:t_,backgroundCube_vert:n_,backgroundCube_frag:i_,cube_vert:s_,cube_frag:r_,depth_vert:o_,depth_frag:a_,distanceRGBA_vert:l_,distanceRGBA_frag:c_,equirect_vert:u_,equirect_frag:h_,linedashed_vert:d_,linedashed_frag:f_,meshbasic_vert:p_,meshbasic_frag:m_,meshlambert_vert:g_,meshlambert_frag:__,meshmatcap_vert:x_,meshmatcap_frag:v_,meshnormal_vert:y_,meshnormal_frag:M_,meshphong_vert:b_,meshphong_frag:S_,meshphysical_vert:T_,meshphysical_frag:w_,meshtoon_vert:E_,meshtoon_frag:A_,points_vert:R_,points_frag:C_,shadow_vert:I_,shadow_frag:P_,sprite_vert:L_,sprite_frag:D_},he={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},ii={basic:{uniforms:$t([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:$t([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new ue(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:$t([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:$t([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:$t([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new ue(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:$t([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:$t([he.points,he.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:$t([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:$t([he.common,he.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:$t([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:$t([he.sprite,he.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:$t([he.common,he.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:$t([he.lights,he.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};ii.physical={uniforms:$t([ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var Rl={r:0,b:0,g:0},bs=new kn,N_=new Ue;function F_(i,e,t,n,s,r,o){let a=new ue(0),l=r===!0?0:1,c,u,h=null,d=0,m=null;function g(b){let v=b.isScene===!0?b.background:null;return v&&v.isTexture&&(v=(b.backgroundBlurriness>0?t:e).get(v)),v}function _(b){let v=!1,w=g(b);w===null?f(a,l):w&&w.isColor&&(f(w,1),v=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(b,v){let w=g(v);w&&(w.isCubeTexture||w.mapping===yo)?(u===void 0&&(u=new ot(new rr(1,1,1),new vt({name:"BackgroundCubeMaterial",uniforms:Ms(ii.backgroundCube.uniforms),vertexShader:ii.backgroundCube.vertexShader,fragmentShader:ii.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(E,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),bs.copy(v.backgroundRotation),bs.x*=-1,bs.y*=-1,bs.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(bs.y*=-1,bs.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(N_.makeRotationFromEuler(bs)),u.material.toneMapped=Ye.getTransfer(w.colorSpace)!==Je,(h!==w||d!==w.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=w,d=w.version,m=i.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new ot(new _i(2,2),new vt({name:"BackgroundMaterial",uniforms:Ms(ii.background.uniforms),vertexShader:ii.background.vertexShader,fragmentShader:ii.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(w.colorSpace)!==Je,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(h!==w||d!==w.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=w,d=w.version,m=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,v){b.getRGB(Rl,bu(i)),n.buffers.color.setClear(Rl.r,Rl.g,Rl.b,v,o)}function S(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,v=1){a.set(b),l=v,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(a,l)},render:_,addToRenderList:p,dispose:S}}function U_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(x,I,D,O,N){let z=!1,B=h(O,D,I);r!==B&&(r=B,c(r.object)),z=m(x,O,D,N),z&&g(x,O,D,N),N!==null&&e.update(N,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,v(x,I,D,O),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function u(x){return i.deleteVertexArray(x)}function h(x,I,D){let O=D.wireframe===!0,N=n[x.id];N===void 0&&(N={},n[x.id]=N);let z=N[I.id];z===void 0&&(z={},N[I.id]=z);let B=z[O];return B===void 0&&(B=d(l()),z[O]=B),B}function d(x){let I=[],D=[],O=[];for(let N=0;N<t;N++)I[N]=0,D[N]=0,O[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:D,attributeDivisors:O,object:x,attributes:{},index:null}}function m(x,I,D,O){let N=r.attributes,z=I.attributes,B=0,q=D.getAttributes();for(let F in q)if(q[F].location>=0){let j=N[F],Z=z[F];if(Z===void 0&&(F==="instanceMatrix"&&x.instanceMatrix&&(Z=x.instanceMatrix),F==="instanceColor"&&x.instanceColor&&(Z=x.instanceColor)),j===void 0||j.attribute!==Z||Z&&j.data!==Z.data)return!0;B++}return r.attributesNum!==B||r.index!==O}function g(x,I,D,O){let N={},z=I.attributes,B=0,q=D.getAttributes();for(let F in q)if(q[F].location>=0){let j=z[F];j===void 0&&(F==="instanceMatrix"&&x.instanceMatrix&&(j=x.instanceMatrix),F==="instanceColor"&&x.instanceColor&&(j=x.instanceColor));let Z={};Z.attribute=j,j&&j.data&&(Z.data=j.data),N[F]=Z,B++}r.attributes=N,r.attributesNum=B,r.index=O}function _(){let x=r.newAttributes;for(let I=0,D=x.length;I<D;I++)x[I]=0}function p(x){f(x,0)}function f(x,I){let D=r.newAttributes,O=r.enabledAttributes,N=r.attributeDivisors;D[x]=1,O[x]===0&&(i.enableVertexAttribArray(x),O[x]=1),N[x]!==I&&(i.vertexAttribDivisor(x,I),N[x]=I)}function S(){let x=r.newAttributes,I=r.enabledAttributes;for(let D=0,O=I.length;D<O;D++)I[D]!==x[D]&&(i.disableVertexAttribArray(D),I[D]=0)}function b(x,I,D,O,N,z,B){B===!0?i.vertexAttribIPointer(x,I,D,N,z):i.vertexAttribPointer(x,I,D,O,N,z)}function v(x,I,D,O){_();let N=O.attributes,z=D.getAttributes(),B=I.defaultAttributeValues;for(let q in z){let F=z[q];if(F.location>=0){let X=N[q];if(X===void 0&&(q==="instanceMatrix"&&x.instanceMatrix&&(X=x.instanceMatrix),q==="instanceColor"&&x.instanceColor&&(X=x.instanceColor)),X!==void 0){let j=X.normalized,Z=X.itemSize,te=e.get(X);if(te===void 0)continue;let Oe=te.buffer,He=te.type,Re=te.bytesPerElement,Y=He===i.INT||He===i.UNSIGNED_INT||X.gpuType===Ya;if(X.isInterleavedBufferAttribute){let J=X.data,le=J.stride,Me=X.offset;if(J.isInstancedInterleavedBuffer){for(let _e=0;_e<F.locationSize;_e++)f(F.location+_e,J.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let _e=0;_e<F.locationSize;_e++)p(F.location+_e);i.bindBuffer(i.ARRAY_BUFFER,Oe);for(let _e=0;_e<F.locationSize;_e++)b(F.location+_e,Z/F.locationSize,He,j,le*Re,(Me+Z/F.locationSize*_e)*Re,Y)}else{if(X.isInstancedBufferAttribute){for(let J=0;J<F.locationSize;J++)f(F.location+J,X.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let J=0;J<F.locationSize;J++)p(F.location+J);i.bindBuffer(i.ARRAY_BUFFER,Oe);for(let J=0;J<F.locationSize;J++)b(F.location+J,Z/F.locationSize,He,j,Z*Re,Z/F.locationSize*J*Re,Y)}}else if(B!==void 0){let j=B[q];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(F.location,j);break;case 3:i.vertexAttrib3fv(F.location,j);break;case 4:i.vertexAttrib4fv(F.location,j);break;default:i.vertexAttrib1fv(F.location,j)}}}}S()}function w(){L();for(let x in n){let I=n[x];for(let D in I){let O=I[D];for(let N in O)u(O[N].object),delete O[N];delete I[D]}delete n[x]}}function E(x){if(n[x.id]===void 0)return;let I=n[x.id];for(let D in I){let O=I[D];for(let N in O)u(O[N].object),delete O[N];delete I[D]}delete n[x.id]}function C(x){for(let I in n){let D=n[I];if(D[x.id]===void 0)continue;let O=D[x.id];for(let N in O)u(O[N].object),delete O[N];delete D[x.id]}}function L(){y(),o=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:y,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:p,disableUnusedAttributes:S}}function O_(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];t.update(m,n,1)}function l(c,u,h,d){if(h===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function z_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Gt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let L=C===mn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==nn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==sn&&!L)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:S,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:w,maxSamples:E}}function B_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Cn,a=new De,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let m=h.length!==0||d||n!==0||s;return s=d,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,m){let g=h.clippingPlanes,_=h.clipIntersection,p=h.clipShadows,f=i.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{let S=r?0:n,b=S*4,v=f.clippingState||null;l.value=v,v=u(g,d,b,m);for(let w=0;w!==b;++w)v[w]=t[w];f.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,m,g){let _=h!==null?h.length:0,p=null;if(_!==0){if(p=l.value,g!==!0||p===null){let f=m+_*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(p===null||p.length<f)&&(p=new Float32Array(f));for(let b=0,v=m;b!==_;++b,v+=4)o.copy(h[b]).applyMatrix4(S,a),o.normal.toArray(p,v),p[v+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function k_(i){let e=new WeakMap;function t(o,a){return a===Wa?o.mapping=xs:a===Xa&&(o.mapping=vs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Wa||a===Xa)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new va(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Sr=4,Ef=[.125,.215,.35,.446,.526,.582],ws=20,Eu=new Mi,Af=new ue,Au=null,Ru=0,Cu=0,Iu=!1,Ts=(1+Math.sqrt(5))/2,br=1/Ts,Rf=[new A(-Ts,br,0),new A(Ts,br,0),new A(-br,0,Ts),new A(br,0,Ts),new A(0,Ts,-br),new A(0,Ts,br),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)],H_=new A,Pl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=H_}=r;Au=this._renderer.getRenderTarget(),Ru=this._renderer.getActiveCubeFace(),Cu=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=If(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Au,Ru,Cu),this._renderer.xr.enabled=Iu,e.scissorTest=!1,Cl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xs||e.mapping===vs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Au=this._renderer.getRenderTarget(),Ru=this._renderer.getActiveCubeFace(),Cu=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:mn,format:Gt,colorSpace:Wt,depthBuffer:!1},s=Cf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=V_(r)),this._blurMaterial=G_(r,e,t)}return s}_compileMaterial(e){let t=new ot(this._lodPlanes[0],e);this._renderer.compile(t,Eu)}_sceneToCubeUV(e,t,n,s,r){let l=new bt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,m=h.toneMapping;h.getClearColor(Af),h.toneMapping=Si,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let _=new en({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),p=new ot(new rr,_),f=!1,S=e.background;S?S.isColor&&(_.color.copy(S),e.background=null,f=!0):(_.color.copy(Af),f=!0);for(let b=0;b<6;b++){let v=b%3;v===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[b],r.y,r.z)):v===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[b]));let w=this._cubeSize;Cl(s,v*w,b>2?w:0,w,w),h.setRenderTarget(s),f&&h.render(p,l),h.render(e,l)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=m,h.autoClear=d,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===xs||e.mapping===vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=If());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new ot(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Cl(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Eu)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Rf[(s-r-1)%Rf.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new ot(this._lodPlanes[s],c),d=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ws-1),_=r/g,p=isFinite(r)?1+Math.floor(u*_):ws;p>ws&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ws}`);let f=[],S=0;for(let C=0;C<ws;++C){let L=C/_,y=Math.exp(-L*L/2);f.push(y),C===0?S+=y:C<p&&(S+=2*y)}for(let C=0;C<f.length;C++)f[C]=f[C]/S;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;let v=this._sizeLods[s],w=3*v*(s>b-Sr?s-b+Sr:0),E=4*(this._cubeSize-v);Cl(t,w,E,3*v,2*v),l.setRenderTarget(t),l.render(h,Eu)}};function V_(i){let e=[],t=[],n=[],s=i,r=i-Sr+1+Ef.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Sr?l=Ef[o-i+Sr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,_=3,p=2,f=1,S=new Float32Array(_*g*m),b=new Float32Array(p*g*m),v=new Float32Array(f*g*m);for(let E=0;E<m;E++){let C=E%3*2/3-1,L=E>2?0:-1,y=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];S.set(y,_*g*E),b.set(d,p*g*E);let x=[E,E,E,E,E,E];v.set(x,f*g*E)}let w=new Ft;w.setAttribute("position",new Rt(S,_)),w.setAttribute("uv",new Rt(b,p)),w.setAttribute("faceIndex",new Rt(v,f)),e.push(w),s>Sr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Cf(i,e,t){let n=new Vt(i,e,t);return n.texture.mapping=yo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function G_(i,e,t){let n=new Float32Array(ws),s=new A(0,1,0);return new vt({name:"SphericalGaussianBlur",defines:{n:ws,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ku(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function If(){return new vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ku(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Pf(){return new vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ku(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function ku(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function W_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Wa||l===Xa,u=l===xs||l===vs;if(c||u){let h=e.get(a),d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Pl(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{let m=a.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new Pl(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function X_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&nr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function q_(i,e,t,n){let s={},r=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let m=r.get(d);m&&(e.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let m in d)e.update(d[m],i.ARRAY_BUFFER)}function c(h){let d=[],m=h.index,g=h.attributes.position,_=0;if(m!==null){let S=m.array;_=m.version;for(let b=0,v=S.length;b<v;b+=3){let w=S[b+0],E=S[b+1],C=S[b+2];d.push(w,E,E,C,C,w)}}else if(g!==void 0){let S=g.array;_=g.version;for(let b=0,v=S.length/3-1;b<v;b+=3){let w=b+0,E=b+1,C=b+2;d.push(w,E,E,C,C,w)}}else return;let p=new(Mu(d)?Kr:Zr)(d,1);p.version=_;let f=r.get(h);f&&e.remove(f),r.set(h,p)}function u(h){let d=r.get(h);if(d){let m=h.index;m!==null&&d.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Y_(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,m){i.drawElements(n,m,r,d*o),t.update(m,n,1)}function c(d,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,d*o,g),t.update(m,n,g))}function u(d,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,d,0,g);let p=0;for(let f=0;f<g;f++)p+=m[f];t.update(p,n,1)}function h(d,m,g,_){if(g===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<d.length;f++)c(d[f]/o,m[f],_[f]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,d,0,_,0,g);let f=0;for(let S=0;S<g;S++)f+=m[S]*_[S];t.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function $_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Z_(i,e,t){let n=new WeakMap,s=new We;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(a);if(d===void 0||d.count!==h){let y=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",y)};d!==void 0&&d.texture.dispose();let m=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],b=0;m===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let v=a.attributes.position.count*b,w=1;v>e.maxTextureSize&&(w=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let E=new Float32Array(v*w*4*h),C=new $r(E,v,w,h);C.type=sn,C.needsUpdate=!0;let L=b*4;for(let x=0;x<h;x++){let I=p[x],D=f[x],O=S[x],N=v*w*4*x;for(let z=0;z<I.count;z++){let B=z*L;m===!0&&(s.fromBufferAttribute(I,z),E[N+B+0]=s.x,E[N+B+1]=s.y,E[N+B+2]=s.z,E[N+B+3]=0),g===!0&&(s.fromBufferAttribute(D,z),E[N+B+4]=s.x,E[N+B+5]=s.y,E[N+B+6]=s.z,E[N+B+7]=0),_===!0&&(s.fromBufferAttribute(O,z),E[N+B+8]=s.x,E[N+B+9]=s.y,E[N+B+10]=s.z,E[N+B+11]=O.itemSize===4?s.w:1)}}d={count:h,texture:C,size:new me(v,w)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let m=0;for(let _=0;_<c.length;_++)m+=c[_];let g=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function K_(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Kf=new Ht,Lf=new ro(1,1),jf=new $r,Jf=new Kn,Qf=new Jr,Df=[],Nf=[],Ff=new Float32Array(16),Uf=new Float32Array(9),Of=new Float32Array(4);function wr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Df[s];if(r===void 0&&(r=new Float32Array(s),Df[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Ut(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Dl(i,e){let t=Nf[e];t===void 0&&(t=new Int32Array(e),Nf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function j_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function J_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function Q_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function ex(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function tx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Ut(t,n))return;Of.set(n),i.uniformMatrix2fv(this.addr,!1,Of),Ot(t,n)}}function nx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Ut(t,n))return;Uf.set(n),i.uniformMatrix3fv(this.addr,!1,Uf),Ot(t,n)}}function ix(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Ut(t,n))return;Ff.set(n),i.uniformMatrix4fv(this.addr,!1,Ff),Ot(t,n)}}function sx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function rx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function ax(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function lx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function cx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function ux(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function hx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function dx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Lf.compareFunction=xu,r=Lf):r=Kf,t.setTexture2D(e||r,s)}function fx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Jf,s)}function px(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Qf,s)}function mx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||jf,s)}function gx(i){switch(i){case 5126:return j_;case 35664:return J_;case 35665:return Q_;case 35666:return ex;case 35674:return tx;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return sx;case 35667:case 35671:return rx;case 35668:case 35672:return ox;case 35669:case 35673:return ax;case 5125:return lx;case 36294:return cx;case 36295:return ux;case 36296:return hx;case 35678:case 36198:case 36298:case 36306:case 35682:return dx;case 35679:case 36299:case 36307:return fx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}function _x(i,e){i.uniform1fv(this.addr,e)}function xx(i,e){let t=wr(e,this.size,2);i.uniform2fv(this.addr,t)}function vx(i,e){let t=wr(e,this.size,3);i.uniform3fv(this.addr,t)}function yx(i,e){let t=wr(e,this.size,4);i.uniform4fv(this.addr,t)}function Mx(i,e){let t=wr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function bx(i,e){let t=wr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Sx(i,e){let t=wr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Tx(i,e){i.uniform1iv(this.addr,e)}function wx(i,e){i.uniform2iv(this.addr,e)}function Ex(i,e){i.uniform3iv(this.addr,e)}function Ax(i,e){i.uniform4iv(this.addr,e)}function Rx(i,e){i.uniform1uiv(this.addr,e)}function Cx(i,e){i.uniform2uiv(this.addr,e)}function Ix(i,e){i.uniform3uiv(this.addr,e)}function Px(i,e){i.uniform4uiv(this.addr,e)}function Lx(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Kf,r[o])}function Dx(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Jf,r[o])}function Nx(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Qf,r[o])}function Fx(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||jf,r[o])}function Ux(i){switch(i){case 5126:return _x;case 35664:return xx;case 35665:return vx;case 35666:return yx;case 35674:return Mx;case 35675:return bx;case 35676:return Sx;case 5124:case 35670:return Tx;case 35667:case 35671:return wx;case 35668:case 35672:return Ex;case 35669:case 35673:return Ax;case 5125:return Rx;case 36294:return Cx;case 36295:return Ix;case 36296:return Px;case 35678:case 36198:case 36298:case 36306:case 35682:return Lx;case 35679:case 36299:case 36307:return Dx;case 35680:case 36300:case 36308:case 36293:return Nx;case 36289:case 36303:case 36311:case 36292:return Fx}}var Lu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gx(t.type)}},Du=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ux(t.type)}},Nu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Pu=/(\w+)(\])?(\[|\.)?/g;function zf(i,e){i.seq.push(e),i.map[e.id]=e}function Ox(i,e,t){let n=i.name,s=n.length;for(Pu.lastIndex=0;;){let r=Pu.exec(n),o=Pu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){zf(t,c===void 0?new Lu(a,i,e):new Du(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new Nu(a),zf(t,h)),t=h}}}var Tr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Ox(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Bf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var zx=37297,Bx=0;function kx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var kf=new De;function Hx(i){Ye._getMatrix(kf,Ye.workingColorSpace,i);let e=`mat3( ${kf.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case qr:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Hf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+kx(i.getShaderSource(e),a)}else return r}function Vx(i,e){let t=Hx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Gx(i,e){let t;switch(e){case za:t="Linear";break;case Ba:t="Reinhard";break;case ka:t="Cineon";break;case gr:t="ACESFilmic";break;case Va:t="AgX";break;case Ga:t="Neutral";break;case Ha:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Il=new A;function Wx(){Ye.getLuminanceCoefficients(Il);let i=Il.x.toFixed(4),e=Il.y.toFixed(4),t=Il.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ao).join(`
`)}function qx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Yx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Ao(i){return i!==""}function Vf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var $x=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fu(i){return i.replace($x,Kx)}var Zx=new Map;function Kx(i,e){let t=Xe[e];if(t===void 0){let n=Zx.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Fu(t)}var jx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wf(i){return i.replace(jx,Jx)}function Jx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Qx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ru?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ia?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ni&&(e="SHADOWMAP_TYPE_VSM"),e}function ev(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case xs:case vs:e="ENVMAP_TYPE_CUBE";break;case yo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tv(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case vs:e="ENVMAP_MODE_REFRACTION";break}return e}function nv(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case lu:e="ENVMAP_BLENDING_MULTIPLY";break;case lf:e="ENVMAP_BLENDING_MIX";break;case cf:e="ENVMAP_BLENDING_ADD";break}return e}function iv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function sv(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Qx(t),c=ev(t),u=tv(t),h=nv(t),d=iv(t),m=Xx(t),g=qx(r),_=s.createProgram(),p,f,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ao).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ao).join(`
`),f.length>0&&(f+=`
`)):(p=[Xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ao).join(`
`),f=[Xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Si?"#define TONE_MAPPING":"",t.toneMapping!==Si?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Si?Gx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Vx("linearToOutputTexel",t.outputColorSpace),Wx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ao).join(`
`)),o=Fu(o),o=Vf(o,t),o=Gf(o,t),a=Fu(a),a=Vf(a,t),a=Gf(a,t),o=Wf(o),a=Wf(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===vu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let b=S+p+o,v=S+f+a,w=Bf(s,s.VERTEX_SHADER,b),E=Bf(s,s.FRAGMENT_SHADER,v);s.attachShader(_,w),s.attachShader(_,E),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(I){if(i.debug.checkShaderErrors){let D=s.getProgramInfoLog(_)||"",O=s.getShaderInfoLog(w)||"",N=s.getShaderInfoLog(E)||"",z=D.trim(),B=O.trim(),q=N.trim(),F=!0,X=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,w,E);else{let j=Hf(s,w,"vertex"),Z=Hf(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+z+`
`+j+`
`+Z)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(B===""||q==="")&&(X=!1);X&&(I.diagnostics={runnable:F,programLog:z,vertexShader:{log:B,prefix:p},fragmentShader:{log:q,prefix:f}})}s.deleteShader(w),s.deleteShader(E),L=new Tr(s,_),y=Yx(s,_)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let y;this.getAttributes=function(){return y===void 0&&C(this),y};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,zx)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Bx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=E,this}var rv=0,Uu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ou(e),t.set(e,n)),n}},Ou=class{constructor(e){this.id=rv++,this.code=e,this.usedTimes=0}};function ov(i,e,t,n,s,r,o){let a=new sr,l=new Uu,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures,m=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function p(y,x,I,D,O){let N=D.fog,z=O.geometry,B=y.isMeshStandardMaterial?D.environment:null,q=(y.isMeshStandardMaterial?t:e).get(y.envMap||B),F=q&&q.mapping===yo?q.image.height:null,X=g[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));let j=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Z=j!==void 0?j.length:0,te=0;z.morphAttributes.position!==void 0&&(te=1),z.morphAttributes.normal!==void 0&&(te=2),z.morphAttributes.color!==void 0&&(te=3);let Oe,He,Re,Y;if(X){let Qe=ii[X];Oe=Qe.vertexShader,He=Qe.fragmentShader}else Oe=y.vertexShader,He=y.fragmentShader,l.update(y),Re=l.getVertexShaderID(y),Y=l.getFragmentShaderID(y);let J=i.getRenderTarget(),le=i.state.buffers.depth.getReversed(),Me=O.isInstancedMesh===!0,_e=O.isBatchedMesh===!0,ze=!!y.map,St=!!y.matcap,P=!!q,ht=!!y.aoMap,ke=!!y.lightMap,Ne=!!y.bumpMap,be=!!y.normalMap,dt=!!y.displacementMap,Se=!!y.emissiveMap,Ge=!!y.metalnessMap,Bt=!!y.roughnessMap,Tt=y.anisotropy>0,R=y.clearcoat>0,M=y.dispersion>0,V=y.iridescence>0,K=y.sheen>0,ee=y.transmission>0,$=Tt&&!!y.anisotropyMap,Ae=R&&!!y.clearcoatMap,ae=R&&!!y.clearcoatNormalMap,Te=R&&!!y.clearcoatRoughnessMap,we=V&&!!y.iridescenceMap,se=V&&!!y.iridescenceThicknessMap,pe=K&&!!y.sheenColorMap,Le=K&&!!y.sheenRoughnessMap,Ee=!!y.specularMap,de=!!y.specularColorMap,Ve=!!y.specularIntensityMap,U=ee&&!!y.transmissionMap,re=ee&&!!y.thicknessMap,ce=!!y.gradientMap,xe=!!y.alphaMap,ne=y.alphaTest>0,Q=!!y.alphaHash,ye=!!y.extensions,Be=Si;y.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Be=i.toneMapping);let at={shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:Oe,fragmentShader:He,defines:y.defines,customVertexShaderID:Re,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:_e,batchingColor:_e&&O._colorsTexture!==null,instancing:Me,instancingColor:Me&&O.instanceColor!==null,instancingMorph:Me&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Wt,alphaToCoverage:!!y.alphaToCoverage,map:ze,matcap:St,envMap:P,envMapMode:P&&q.mapping,envMapCubeUVHeight:F,aoMap:ht,lightMap:ke,bumpMap:Ne,normalMap:be,displacementMap:d&&dt,emissiveMap:Se,normalMapObjectSpace:be&&y.normalMapType===ff,normalMapTangentSpace:be&&y.normalMapType===_u,metalnessMap:Ge,roughnessMap:Bt,anisotropy:Tt,anisotropyMap:$,clearcoat:R,clearcoatMap:Ae,clearcoatNormalMap:ae,clearcoatRoughnessMap:Te,dispersion:M,iridescence:V,iridescenceMap:we,iridescenceThicknessMap:se,sheen:K,sheenColorMap:pe,sheenRoughnessMap:Le,specularMap:Ee,specularColorMap:de,specularIntensityMap:Ve,transmission:ee,transmissionMap:U,thicknessMap:re,gradientMap:ce,opaque:y.transparent===!1&&y.blending===os&&y.alphaToCoverage===!1,alphaMap:xe,alphaTest:ne,alphaHash:Q,combine:y.combine,mapUv:ze&&_(y.map.channel),aoMapUv:ht&&_(y.aoMap.channel),lightMapUv:ke&&_(y.lightMap.channel),bumpMapUv:Ne&&_(y.bumpMap.channel),normalMapUv:be&&_(y.normalMap.channel),displacementMapUv:dt&&_(y.displacementMap.channel),emissiveMapUv:Se&&_(y.emissiveMap.channel),metalnessMapUv:Ge&&_(y.metalnessMap.channel),roughnessMapUv:Bt&&_(y.roughnessMap.channel),anisotropyMapUv:$&&_(y.anisotropyMap.channel),clearcoatMapUv:Ae&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:ae&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:se&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Le&&_(y.sheenRoughnessMap.channel),specularMapUv:Ee&&_(y.specularMap.channel),specularColorMapUv:de&&_(y.specularColorMap.channel),specularIntensityMapUv:Ve&&_(y.specularIntensityMap.channel),transmissionMapUv:U&&_(y.transmissionMap.channel),thicknessMapUv:re&&_(y.thicknessMap.channel),alphaMapUv:xe&&_(y.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(be||Tt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!z.attributes.uv&&(ze||xe),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:le,skinning:O.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:te,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Be,decodeVideoTexture:ze&&y.map.isVideoTexture===!0&&Ye.getTransfer(y.map.colorSpace)===Je,decodeVideoTextureEmissive:Se&&y.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(y.emissiveMap.colorSpace)===Je,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===pn,flipSided:y.side===tn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ye&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ye&&y.extensions.multiDraw===!0||_e)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return at.vertexUv1s=c.has(1),at.vertexUv2s=c.has(2),at.vertexUv3s=c.has(3),c.clear(),at}function f(y){let x=[];if(y.shaderID?x.push(y.shaderID):(x.push(y.customVertexShaderID),x.push(y.customFragmentShaderID)),y.defines!==void 0)for(let I in y.defines)x.push(I),x.push(y.defines[I]);return y.isRawShaderMaterial===!1&&(S(x,y),b(x,y),x.push(i.outputColorSpace)),x.push(y.customProgramCacheKey),x.join()}function S(y,x){y.push(x.precision),y.push(x.outputColorSpace),y.push(x.envMapMode),y.push(x.envMapCubeUVHeight),y.push(x.mapUv),y.push(x.alphaMapUv),y.push(x.lightMapUv),y.push(x.aoMapUv),y.push(x.bumpMapUv),y.push(x.normalMapUv),y.push(x.displacementMapUv),y.push(x.emissiveMapUv),y.push(x.metalnessMapUv),y.push(x.roughnessMapUv),y.push(x.anisotropyMapUv),y.push(x.clearcoatMapUv),y.push(x.clearcoatNormalMapUv),y.push(x.clearcoatRoughnessMapUv),y.push(x.iridescenceMapUv),y.push(x.iridescenceThicknessMapUv),y.push(x.sheenColorMapUv),y.push(x.sheenRoughnessMapUv),y.push(x.specularMapUv),y.push(x.specularColorMapUv),y.push(x.specularIntensityMapUv),y.push(x.transmissionMapUv),y.push(x.thicknessMapUv),y.push(x.combine),y.push(x.fogExp2),y.push(x.sizeAttenuation),y.push(x.morphTargetsCount),y.push(x.morphAttributeCount),y.push(x.numDirLights),y.push(x.numPointLights),y.push(x.numSpotLights),y.push(x.numSpotLightMaps),y.push(x.numHemiLights),y.push(x.numRectAreaLights),y.push(x.numDirLightShadows),y.push(x.numPointLightShadows),y.push(x.numSpotLightShadows),y.push(x.numSpotLightShadowsWithMaps),y.push(x.numLightProbes),y.push(x.shadowMapType),y.push(x.toneMapping),y.push(x.numClippingPlanes),y.push(x.numClipIntersection),y.push(x.depthPacking)}function b(y,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),x.gradientMap&&a.enable(22),y.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),y.push(a.mask)}function v(y){let x=g[y.type],I;if(x){let D=ii[x];I=Ti.clone(D.uniforms)}else I=y.uniforms;return I}function w(y,x){let I;for(let D=0,O=u.length;D<O;D++){let N=u[D];if(N.cacheKey===x){I=N,++I.usedTimes;break}}return I===void 0&&(I=new sv(i,x,y,r),u.push(I)),I}function E(y){if(--y.usedTimes===0){let x=u.indexOf(y);u[x]=u[u.length-1],u.pop(),y.destroy()}}function C(y){l.remove(y)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:v,acquireProgram:w,releaseProgram:E,releaseShaderCache:C,programs:u,dispose:L}}function av(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function lv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function qf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Yf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,d,m,g,_,p){let f=i[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:m,groupOrder:g,renderOrder:h.renderOrder,z:_,group:p},i[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=_,f.group=p),e++,f}function a(h,d,m,g,_,p){let f=o(h,d,m,g,_,p);m.transmission>0?n.push(f):m.transparent===!0?s.push(f):t.push(f)}function l(h,d,m,g,_,p){let f=o(h,d,m,g,_,p);m.transmission>0?n.unshift(f):m.transparent===!0?s.unshift(f):t.unshift(f)}function c(h,d){t.length>1&&t.sort(h||lv),n.length>1&&n.sort(d||qf),s.length>1&&s.sort(d||qf)}function u(){for(let h=e,d=i.length;h<d;h++){let m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function cv(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Yf,i.set(n,[o])):s>=r.length?(o=new Yf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function uv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new ue};break;case"SpotLight":t={position:new A,direction:new A,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":t={color:new ue,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function hv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var dv=0;function fv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function pv(i){let e=new uv,t=hv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new A);let s=new A,r=new Ue,o=new Ue;function a(c){let u=0,h=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let m=0,g=0,_=0,p=0,f=0,S=0,b=0,v=0,w=0,E=0,C=0;c.sort(fv);for(let y=0,x=c.length;y<x;y++){let I=c[y],D=I.color,O=I.intensity,N=I.distance,z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=D.r*O,h+=D.g*O,d+=D.b*O;else if(I.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(I.sh.coefficients[B],O);C++}else if(I.isDirectionalLight){let B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,F=t.get(I);F.shadowIntensity=q.intensity,F.shadowBias=q.bias,F.shadowNormalBias=q.normalBias,F.shadowRadius=q.radius,F.shadowMapSize=q.mapSize,n.directionalShadow[m]=F,n.directionalShadowMap[m]=z,n.directionalShadowMatrix[m]=I.shadow.matrix,S++}n.directional[m]=B,m++}else if(I.isSpotLight){let B=e.get(I);B.position.setFromMatrixPosition(I.matrixWorld),B.color.copy(D).multiplyScalar(O),B.distance=N,B.coneCos=Math.cos(I.angle),B.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),B.decay=I.decay,n.spot[_]=B;let q=I.shadow;if(I.map&&(n.spotLightMap[w]=I.map,w++,q.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[_]=q.matrix,I.castShadow){let F=t.get(I);F.shadowIntensity=q.intensity,F.shadowBias=q.bias,F.shadowNormalBias=q.normalBias,F.shadowRadius=q.radius,F.shadowMapSize=q.mapSize,n.spotShadow[_]=F,n.spotShadowMap[_]=z,v++}_++}else if(I.isRectAreaLight){let B=e.get(I);B.color.copy(D).multiplyScalar(O),B.halfWidth.set(I.width*.5,0,0),B.halfHeight.set(0,I.height*.5,0),n.rectArea[p]=B,p++}else if(I.isPointLight){let B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),B.distance=I.distance,B.decay=I.decay,I.castShadow){let q=I.shadow,F=t.get(I);F.shadowIntensity=q.intensity,F.shadowBias=q.bias,F.shadowNormalBias=q.normalBias,F.shadowRadius=q.radius,F.shadowMapSize=q.mapSize,F.shadowCameraNear=q.camera.near,F.shadowCameraFar=q.camera.far,n.pointShadow[g]=F,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=I.shadow.matrix,b++}n.point[g]=B,g++}else if(I.isHemisphereLight){let B=e.get(I);B.skyColor.copy(I.color).multiplyScalar(O),B.groundColor.copy(I.groundColor).multiplyScalar(O),n.hemi[f]=B,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let L=n.hash;(L.directionalLength!==m||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==p||L.hemiLength!==f||L.numDirectionalShadows!==S||L.numPointShadows!==b||L.numSpotShadows!==v||L.numSpotMaps!==w||L.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,L.directionalLength=m,L.pointLength=g,L.spotLength=_,L.rectAreaLength=p,L.hemiLength=f,L.numDirectionalShadows=S,L.numPointShadows=b,L.numSpotShadows=v,L.numSpotMaps=w,L.numLightProbes=C,n.version=dv++)}function l(c,u){let h=0,d=0,m=0,g=0,_=0,p=u.matrixWorldInverse;for(let f=0,S=c.length;f<S;f++){let b=c[f];if(b.isDirectionalLight){let v=n.directional[h];v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(p),h++}else if(b.isSpotLight){let v=n.spot[m];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(p),v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(p),m++}else if(b.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(p),o.identity(),r.copy(b.matrixWorld),r.premultiply(p),o.extractRotation(r),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){let v=n.hemi[_];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(p),_++}}}return{setup:a,setupView:l,state:n}}function $f(i){let e=new pv(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function mv(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new $f(i),e.set(s,[a])):r>=o.length?(a=new $f(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_v=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function xv(i,e,t){let n=new ur,s=new me,r=new me,o=new We,a=new fr({depthPacking:Al}),l=new ba,c={},u=t.maxTextureSize,h={[Mn]:tn,[tn]:Mn,[pn]:pn},d=new vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new me},radius:{value:4}},vertexShader:gv,fragmentShader:_v}),m=d.clone();m.defines.HORIZONTAL_PASS=1;let g=new Ft;g.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ot(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ru;let f=this.type;this.render=function(E,C,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;let y=i.getRenderTarget(),x=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Vn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let O=f!==ni&&this.type===ni,N=f===ni&&this.type!==ni;for(let z=0,B=E.length;z<B;z++){let q=E[z],F=q.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);let X=F.getFrameExtents();if(s.multiply(X),r.copy(F.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/X.x),s.x=r.x*X.x,F.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/X.y),s.y=r.y*X.y,F.mapSize.y=r.y)),F.map===null||O===!0||N===!0){let Z=this.type!==ni?{minFilter:wt,magFilter:wt}:{};F.map!==null&&F.map.dispose(),F.map=new Vt(s.x,s.y,Z),F.map.texture.name=q.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();let j=F.getViewportCount();for(let Z=0;Z<j;Z++){let te=F.getViewport(Z);o.set(r.x*te.x,r.y*te.y,r.x*te.z,r.y*te.w),D.viewport(o),F.updateMatrices(q,Z),n=F.getFrustum(),v(C,L,F.camera,q,this.type)}F.isPointLightShadow!==!0&&this.type===ni&&S(F,L),F.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(y,x,I)};function S(E,C){let L=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Vt(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(C,null,L,d,_,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(C,null,L,m,_,null)}function b(E,C,L,y){let x=null,I=L.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)x=I;else if(x=L.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let D=x.uuid,O=C.uuid,N=c[D];N===void 0&&(N={},c[D]=N);let z=N[O];z===void 0&&(z=x.clone(),N[O]=z,C.addEventListener("dispose",w)),x=z}if(x.visible=C.visible,x.wireframe=C.wireframe,y===ni?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:h[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,L.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let D=i.properties.get(x);D.light=L}return x}function v(E,C,L,y,x){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&x===ni)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,E.matrixWorld);let O=e.update(E),N=E.material;if(Array.isArray(N)){let z=O.groups;for(let B=0,q=z.length;B<q;B++){let F=z[B],X=N[F.materialIndex];if(X&&X.visible){let j=b(E,X,y,x);E.onBeforeShadow(i,E,C,L,O,j,F),i.renderBufferDirect(L,null,O,j,E,F),E.onAfterShadow(i,E,C,L,O,j,F)}}}else if(N.visible){let z=b(E,N,y,x);E.onBeforeShadow(i,E,C,L,O,z,null),i.renderBufferDirect(L,null,O,z,E,null),E.onAfterShadow(i,E,C,L,O,z,null)}}let D=E.children;for(let O=0,N=D.length;O<N;O++)v(D[O],C,L,y,x)}function w(E){E.target.removeEventListener("dispose",w);for(let L in c){let y=c[L],x=E.target.uuid;x in y&&(y[x].dispose(),delete y[x])}}}var vv={[Pa]:La,[Da]:Ua,[Na]:Oa,[as]:Fa,[La]:Pa,[Ua]:Da,[Oa]:Na,[Fa]:as};function yv(i,e){function t(){let U=!1,re=new We,ce=null,xe=new We(0,0,0,0);return{setMask:function(ne){ce!==ne&&!U&&(i.colorMask(ne,ne,ne,ne),ce=ne)},setLocked:function(ne){U=ne},setClear:function(ne,Q,ye,Be,at){at===!0&&(ne*=Be,Q*=Be,ye*=Be),re.set(ne,Q,ye,Be),xe.equals(re)===!1&&(i.clearColor(ne,Q,ye,Be),xe.copy(re))},reset:function(){U=!1,ce=null,xe.set(-1,0,0,0)}}}function n(){let U=!1,re=!1,ce=null,xe=null,ne=null;return{setReversed:function(Q){if(re!==Q){let ye=e.get("EXT_clip_control");Q?ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.ZERO_TO_ONE_EXT):ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.NEGATIVE_ONE_TO_ONE_EXT),re=Q;let Be=ne;ne=null,this.setClear(Be)}},getReversed:function(){return re},setTest:function(Q){Q?J(i.DEPTH_TEST):le(i.DEPTH_TEST)},setMask:function(Q){ce!==Q&&!U&&(i.depthMask(Q),ce=Q)},setFunc:function(Q){if(re&&(Q=vv[Q]),xe!==Q){switch(Q){case Pa:i.depthFunc(i.NEVER);break;case La:i.depthFunc(i.ALWAYS);break;case Da:i.depthFunc(i.LESS);break;case as:i.depthFunc(i.LEQUAL);break;case Na:i.depthFunc(i.EQUAL);break;case Fa:i.depthFunc(i.GEQUAL);break;case Ua:i.depthFunc(i.GREATER);break;case Oa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xe=Q}},setLocked:function(Q){U=Q},setClear:function(Q){ne!==Q&&(re&&(Q=1-Q),i.clearDepth(Q),ne=Q)},reset:function(){U=!1,ce=null,xe=null,ne=null,re=!1}}}function s(){let U=!1,re=null,ce=null,xe=null,ne=null,Q=null,ye=null,Be=null,at=null;return{setTest:function(Qe){U||(Qe?J(i.STENCIL_TEST):le(i.STENCIL_TEST))},setMask:function(Qe){re!==Qe&&!U&&(i.stencilMask(Qe),re=Qe)},setFunc:function(Qe,ai,qn){(ce!==Qe||xe!==ai||ne!==qn)&&(i.stencilFunc(Qe,ai,qn),ce=Qe,xe=ai,ne=qn)},setOp:function(Qe,ai,qn){(Q!==Qe||ye!==ai||Be!==qn)&&(i.stencilOp(Qe,ai,qn),Q=Qe,ye=ai,Be=qn)},setLocked:function(Qe){U=Qe},setClear:function(Qe){at!==Qe&&(i.clearStencil(Qe),at=Qe)},reset:function(){U=!1,re=null,ce=null,xe=null,ne=null,Q=null,ye=null,Be=null,at=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,m=[],g=null,_=!1,p=null,f=null,S=null,b=null,v=null,w=null,E=null,C=new ue(0,0,0),L=0,y=!1,x=null,I=null,D=null,O=null,N=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,q=0,F=i.getParameter(i.VERSION);F.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(F)[1]),B=q>=1):F.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),B=q>=2);let X=null,j={},Z=i.getParameter(i.SCISSOR_BOX),te=i.getParameter(i.VIEWPORT),Oe=new We().fromArray(Z),He=new We().fromArray(te);function Re(U,re,ce,xe){let ne=new Uint8Array(4),Q=i.createTexture();i.bindTexture(U,Q),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ye=0;ye<ce;ye++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(re,0,i.RGBA,1,1,xe,0,i.RGBA,i.UNSIGNED_BYTE,ne):i.texImage2D(re+ye,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ne);return Q}let Y={};Y[i.TEXTURE_2D]=Re(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Re(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Re(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Re(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(i.DEPTH_TEST),o.setFunc(as),Ne(!1),be(su),J(i.CULL_FACE),ht(Vn);function J(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function le(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function Me(U,re){return h[U]!==re?(i.bindFramebuffer(U,re),h[U]=re,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=re),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=re),!0):!1}function _e(U,re){let ce=m,xe=!1;if(U){ce=d.get(re),ce===void 0&&(ce=[],d.set(re,ce));let ne=U.textures;if(ce.length!==ne.length||ce[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,ye=ne.length;Q<ye;Q++)ce[Q]=i.COLOR_ATTACHMENT0+Q;ce.length=ne.length,xe=!0}}else ce[0]!==i.BACK&&(ce[0]=i.BACK,xe=!0);xe&&i.drawBuffers(ce)}function ze(U){return g!==U?(i.useProgram(U),g=U,!0):!1}let St={[Fi]:i.FUNC_ADD,[Wd]:i.FUNC_SUBTRACT,[Xd]:i.FUNC_REVERSE_SUBTRACT};St[qd]=i.MIN,St[Yd]=i.MAX;let P={[$d]:i.ZERO,[Zd]:i.ONE,[Kd]:i.SRC_COLOR,[fa]:i.SRC_ALPHA,[nf]:i.SRC_ALPHA_SATURATE,[ef]:i.DST_COLOR,[Jd]:i.DST_ALPHA,[jd]:i.ONE_MINUS_SRC_COLOR,[pa]:i.ONE_MINUS_SRC_ALPHA,[tf]:i.ONE_MINUS_DST_COLOR,[Qd]:i.ONE_MINUS_DST_ALPHA,[sf]:i.CONSTANT_COLOR,[rf]:i.ONE_MINUS_CONSTANT_COLOR,[of]:i.CONSTANT_ALPHA,[af]:i.ONE_MINUS_CONSTANT_ALPHA};function ht(U,re,ce,xe,ne,Q,ye,Be,at,Qe){if(U===Vn){_===!0&&(le(i.BLEND),_=!1);return}if(_===!1&&(J(i.BLEND),_=!0),U!==Gd){if(U!==p||Qe!==y){if((f!==Fi||v!==Fi)&&(i.blendEquation(i.FUNC_ADD),f=Fi,v=Fi),Qe)switch(U){case os:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bi:i.blendFunc(i.ONE,i.ONE);break;case ou:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case au:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case os:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ou:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case au:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}S=null,b=null,w=null,E=null,C.set(0,0,0),L=0,p=U,y=Qe}return}ne=ne||re,Q=Q||ce,ye=ye||xe,(re!==f||ne!==v)&&(i.blendEquationSeparate(St[re],St[ne]),f=re,v=ne),(ce!==S||xe!==b||Q!==w||ye!==E)&&(i.blendFuncSeparate(P[ce],P[xe],P[Q],P[ye]),S=ce,b=xe,w=Q,E=ye),(Be.equals(C)===!1||at!==L)&&(i.blendColor(Be.r,Be.g,Be.b,at),C.copy(Be),L=at),p=U,y=!1}function ke(U,re){U.side===pn?le(i.CULL_FACE):J(i.CULL_FACE);let ce=U.side===tn;re&&(ce=!ce),Ne(ce),U.blending===os&&U.transparent===!1?ht(Vn):ht(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let xe=U.stencilWrite;a.setTest(xe),xe&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Se(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?J(i.SAMPLE_ALPHA_TO_COVERAGE):le(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(U){x!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),x=U)}function be(U){U!==Hd?(J(i.CULL_FACE),U!==I&&(U===su?i.cullFace(i.BACK):U===Vd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):le(i.CULL_FACE),I=U}function dt(U){U!==D&&(B&&i.lineWidth(U),D=U)}function Se(U,re,ce){U?(J(i.POLYGON_OFFSET_FILL),(O!==re||N!==ce)&&(i.polygonOffset(re,ce),O=re,N=ce)):le(i.POLYGON_OFFSET_FILL)}function Ge(U){U?J(i.SCISSOR_TEST):le(i.SCISSOR_TEST)}function Bt(U){U===void 0&&(U=i.TEXTURE0+z-1),X!==U&&(i.activeTexture(U),X=U)}function Tt(U,re,ce){ce===void 0&&(X===null?ce=i.TEXTURE0+z-1:ce=X);let xe=j[ce];xe===void 0&&(xe={type:void 0,texture:void 0},j[ce]=xe),(xe.type!==U||xe.texture!==re)&&(X!==ce&&(i.activeTexture(ce),X=ce),i.bindTexture(U,re||Y[U]),xe.type=U,xe.texture=re)}function R(){let U=j[X];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function M(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ee(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ae(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function we(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function pe(U){Oe.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Oe.copy(U))}function Le(U){He.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),He.copy(U))}function Ee(U,re){let ce=c.get(re);ce===void 0&&(ce=new WeakMap,c.set(re,ce));let xe=ce.get(U);xe===void 0&&(xe=i.getUniformBlockIndex(re,U.name),ce.set(U,xe))}function de(U,re){let xe=c.get(re).get(U);l.get(re)!==xe&&(i.uniformBlockBinding(re,xe,U.__bindingPointIndex),l.set(re,xe))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},X=null,j={},h={},d=new WeakMap,m=[],g=null,_=!1,p=null,f=null,S=null,b=null,v=null,w=null,E=null,C=new ue(0,0,0),L=0,y=!1,x=null,I=null,D=null,O=null,N=null,Oe.set(0,0,i.canvas.width,i.canvas.height),He.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:J,disable:le,bindFramebuffer:Me,drawBuffers:_e,useProgram:ze,setBlending:ht,setMaterial:ke,setFlipSided:Ne,setCullFace:be,setLineWidth:dt,setPolygonOffset:Se,setScissorTest:Ge,activeTexture:Bt,bindTexture:Tt,unbindTexture:R,compressedTexImage2D:M,compressedTexImage3D:V,texImage2D:we,texImage3D:se,updateUBOMapping:Ee,uniformBlockBinding:de,texStorage2D:ae,texStorage3D:Te,texSubImage2D:K,texSubImage3D:ee,compressedTexSubImage2D:$,compressedTexSubImage3D:Ae,scissor:pe,viewport:Le,reset:Ve}}function Mv(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new me,u=new WeakMap,h,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,M){return m?new OffscreenCanvas(R,M):tr("canvas")}function _(R,M,V){let K=1,ee=Tt(R);if((ee.width>V||ee.height>V)&&(K=V/Math.max(ee.width,ee.height)),K<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let $=Math.floor(K*ee.width),Ae=Math.floor(K*ee.height);h===void 0&&(h=g($,Ae));let ae=M?g($,Ae):h;return ae.width=$,ae.height=Ae,ae.getContext("2d").drawImage(R,0,0,$,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+$+"x"+Ae+")."),ae}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),R;return R}function p(R){return R.generateMipmaps}function f(R){i.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(R,M,V,K,ee=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let $=M;if(M===i.RED&&(V===i.FLOAT&&($=i.R32F),V===i.HALF_FLOAT&&($=i.R16F),V===i.UNSIGNED_BYTE&&($=i.R8)),M===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.R8UI),V===i.UNSIGNED_SHORT&&($=i.R16UI),V===i.UNSIGNED_INT&&($=i.R32UI),V===i.BYTE&&($=i.R8I),V===i.SHORT&&($=i.R16I),V===i.INT&&($=i.R32I)),M===i.RG&&(V===i.FLOAT&&($=i.RG32F),V===i.HALF_FLOAT&&($=i.RG16F),V===i.UNSIGNED_BYTE&&($=i.RG8)),M===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RG8UI),V===i.UNSIGNED_SHORT&&($=i.RG16UI),V===i.UNSIGNED_INT&&($=i.RG32UI),V===i.BYTE&&($=i.RG8I),V===i.SHORT&&($=i.RG16I),V===i.INT&&($=i.RG32I)),M===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RGB8UI),V===i.UNSIGNED_SHORT&&($=i.RGB16UI),V===i.UNSIGNED_INT&&($=i.RGB32UI),V===i.BYTE&&($=i.RGB8I),V===i.SHORT&&($=i.RGB16I),V===i.INT&&($=i.RGB32I)),M===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RGBA8UI),V===i.UNSIGNED_SHORT&&($=i.RGBA16UI),V===i.UNSIGNED_INT&&($=i.RGBA32UI),V===i.BYTE&&($=i.RGBA8I),V===i.SHORT&&($=i.RGBA16I),V===i.INT&&($=i.RGBA32I)),M===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),M===i.RGBA){let Ae=ee?qr:Ye.getTransfer(K);V===i.FLOAT&&($=i.RGBA32F),V===i.HALF_FLOAT&&($=i.RGBA16F),V===i.UNSIGNED_BYTE&&($=Ae===Je?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(R,M){let V;return R?M===null||M===ki||M===vr?V=i.DEPTH24_STENCIL8:M===sn?V=i.DEPTH32F_STENCIL8:M===xr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ki||M===vr?V=i.DEPTH_COMPONENT24:M===sn?V=i.DEPTH_COMPONENT32F:M===xr&&(V=i.DEPTH_COMPONENT16),V}function w(R,M){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==wt&&R.minFilter!==Dt?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function E(R){let M=R.target;M.removeEventListener("dispose",E),L(M),M.isVideoTexture&&u.delete(M)}function C(R){let M=R.target;M.removeEventListener("dispose",C),x(M)}function L(R){let M=n.get(R);if(M.__webglInit===void 0)return;let V=R.source,K=d.get(V);if(K){let ee=K[M.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&y(R),Object.keys(K).length===0&&d.delete(V)}n.remove(R)}function y(R){let M=n.get(R);i.deleteTexture(M.__webglTexture);let V=R.source,K=d.get(V);delete K[M.__cacheKey],o.memory.textures--}function x(R){let M=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(M.__webglFramebuffer[K]))for(let ee=0;ee<M.__webglFramebuffer[K].length;ee++)i.deleteFramebuffer(M.__webglFramebuffer[K][ee]);else i.deleteFramebuffer(M.__webglFramebuffer[K]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[K])}else{if(Array.isArray(M.__webglFramebuffer))for(let K=0;K<M.__webglFramebuffer.length;K++)i.deleteFramebuffer(M.__webglFramebuffer[K]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let K=0;K<M.__webglColorRenderbuffer.length;K++)M.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[K]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let V=R.textures;for(let K=0,ee=V.length;K<ee;K++){let $=n.get(V[K]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),o.memory.textures--),n.remove(V[K])}n.remove(R)}let I=0;function D(){I=0}function O(){let R=I;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function N(R){let M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function z(R,M){let V=n.get(R);if(R.isVideoTexture&&Ge(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&V.__version!==R.version){let K=R.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(V,R,M);return}}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+M)}function B(R,M){let V=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){Y(V,R,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+M)}function q(R,M){let V=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){Y(V,R,M);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+M)}function F(R,M){let V=n.get(R);if(R.version>0&&V.__version!==R.version){J(V,R,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+M)}let X={[$n]:i.REPEAT,[cn]:i.CLAMP_TO_EDGE,[Qs]:i.MIRRORED_REPEAT},j={[wt]:i.NEAREST,[qa]:i.NEAREST_MIPMAP_NEAREST,[ys]:i.NEAREST_MIPMAP_LINEAR,[Dt]:i.LINEAR,[_r]:i.LINEAR_MIPMAP_NEAREST,[Gn]:i.LINEAR_MIPMAP_LINEAR},Z={[pf]:i.NEVER,[yf]:i.ALWAYS,[mf]:i.LESS,[xu]:i.LEQUAL,[gf]:i.EQUAL,[vf]:i.GEQUAL,[_f]:i.GREATER,[xf]:i.NOTEQUAL};function te(R,M){if(M.type===sn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Dt||M.magFilter===_r||M.magFilter===ys||M.magFilter===Gn||M.minFilter===Dt||M.minFilter===_r||M.minFilter===ys||M.minFilter===Gn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,X[M.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,X[M.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,X[M.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,j[M.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,j[M.minFilter]),M.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Z[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===wt||M.minFilter!==ys&&M.minFilter!==Gn||M.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Oe(R,M){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",E));let K=M.source,ee=d.get(K);ee===void 0&&(ee={},d.set(K,ee));let $=N(M);if($!==R.__cacheKey){ee[$]===void 0&&(ee[$]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ee[$].usedTimes++;let Ae=ee[R.__cacheKey];Ae!==void 0&&(ee[R.__cacheKey].usedTimes--,Ae.usedTimes===0&&y(M)),R.__cacheKey=$,R.__webglTexture=ee[$].texture}return V}function He(R,M,V){return Math.floor(Math.floor(R/V)/M)}function Re(R,M,V,K){let $=R.updateRanges;if($.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,V,K,M.data);else{$.sort((se,pe)=>se.start-pe.start);let Ae=0;for(let se=1;se<$.length;se++){let pe=$[Ae],Le=$[se],Ee=pe.start+pe.count,de=He(Le.start,M.width,4),Ve=He(pe.start,M.width,4);Le.start<=Ee+1&&de===Ve&&He(Le.start+Le.count-1,M.width,4)===de?pe.count=Math.max(pe.count,Le.start+Le.count-pe.start):(++Ae,$[Ae]=Le)}$.length=Ae+1;let ae=i.getParameter(i.UNPACK_ROW_LENGTH),Te=i.getParameter(i.UNPACK_SKIP_PIXELS),we=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let se=0,pe=$.length;se<pe;se++){let Le=$[se],Ee=Math.floor(Le.start/4),de=Math.ceil(Le.count/4),Ve=Ee%M.width,U=Math.floor(Ee/M.width),re=de,ce=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Ve,U,re,ce,V,K,M.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ae),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Te),i.pixelStorei(i.UNPACK_SKIP_ROWS,we)}}function Y(R,M,V){let K=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(K=i.TEXTURE_3D);let ee=Oe(R,M),$=M.source;t.bindTexture(K,R.__webglTexture,i.TEXTURE0+V);let Ae=n.get($);if($.version!==Ae.__version||ee===!0){t.activeTexture(i.TEXTURE0+V);let ae=Ye.getPrimaries(Ye.workingColorSpace),Te=M.colorSpace===Wn?null:Ye.getPrimaries(M.colorSpace),we=M.colorSpace===Wn||ae===Te?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let se=_(M.image,!1,s.maxTextureSize);se=Bt(M,se);let pe=r.convert(M.format,M.colorSpace),Le=r.convert(M.type),Ee=b(M.internalFormat,pe,Le,M.colorSpace,M.isVideoTexture);te(K,M);let de,Ve=M.mipmaps,U=M.isVideoTexture!==!0,re=Ae.__version===void 0||ee===!0,ce=$.dataReady,xe=w(M,se);if(M.isDepthTexture)Ee=v(M.format===yr,M.type),re&&(U?t.texStorage2D(i.TEXTURE_2D,1,Ee,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Ee,se.width,se.height,0,pe,Le,null));else if(M.isDataTexture)if(Ve.length>0){U&&re&&t.texStorage2D(i.TEXTURE_2D,xe,Ee,Ve[0].width,Ve[0].height);for(let ne=0,Q=Ve.length;ne<Q;ne++)de=Ve[ne],U?ce&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,de.width,de.height,pe,Le,de.data):t.texImage2D(i.TEXTURE_2D,ne,Ee,de.width,de.height,0,pe,Le,de.data);M.generateMipmaps=!1}else U?(re&&t.texStorage2D(i.TEXTURE_2D,xe,Ee,se.width,se.height),ce&&Re(M,se,pe,Le)):t.texImage2D(i.TEXTURE_2D,0,Ee,se.width,se.height,0,pe,Le,se.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){U&&re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,xe,Ee,Ve[0].width,Ve[0].height,se.depth);for(let ne=0,Q=Ve.length;ne<Q;ne++)if(de=Ve[ne],M.format!==Gt)if(pe!==null)if(U){if(ce)if(M.layerUpdates.size>0){let ye=wu(de.width,de.height,M.format,M.type);for(let Be of M.layerUpdates){let at=de.data.subarray(Be*ye/de.data.BYTES_PER_ELEMENT,(Be+1)*ye/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,Be,de.width,de.height,1,pe,at)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,se.depth,pe,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,Ee,de.width,de.height,se.depth,0,de.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ce&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,se.depth,pe,Le,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,Ee,de.width,de.height,se.depth,0,pe,Le,de.data)}else{U&&re&&t.texStorage2D(i.TEXTURE_2D,xe,Ee,Ve[0].width,Ve[0].height);for(let ne=0,Q=Ve.length;ne<Q;ne++)de=Ve[ne],M.format!==Gt?pe!==null?U?ce&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,de.width,de.height,pe,de.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,Ee,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ce&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,de.width,de.height,pe,Le,de.data):t.texImage2D(i.TEXTURE_2D,ne,Ee,de.width,de.height,0,pe,Le,de.data)}else if(M.isDataArrayTexture)if(U){if(re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,xe,Ee,se.width,se.height,se.depth),ce)if(M.layerUpdates.size>0){let ne=wu(se.width,se.height,M.format,M.type);for(let Q of M.layerUpdates){let ye=se.data.subarray(Q*ne/se.data.BYTES_PER_ELEMENT,(Q+1)*ne/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,se.width,se.height,1,pe,Le,ye)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,pe,Le,se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,se.width,se.height,se.depth,0,pe,Le,se.data);else if(M.isData3DTexture)U?(re&&t.texStorage3D(i.TEXTURE_3D,xe,Ee,se.width,se.height,se.depth),ce&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,pe,Le,se.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,se.width,se.height,se.depth,0,pe,Le,se.data);else if(M.isFramebufferTexture){if(re)if(U)t.texStorage2D(i.TEXTURE_2D,xe,Ee,se.width,se.height);else{let ne=se.width,Q=se.height;for(let ye=0;ye<xe;ye++)t.texImage2D(i.TEXTURE_2D,ye,Ee,ne,Q,0,pe,Le,null),ne>>=1,Q>>=1}}else if(Ve.length>0){if(U&&re){let ne=Tt(Ve[0]);t.texStorage2D(i.TEXTURE_2D,xe,Ee,ne.width,ne.height)}for(let ne=0,Q=Ve.length;ne<Q;ne++)de=Ve[ne],U?ce&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,pe,Le,de):t.texImage2D(i.TEXTURE_2D,ne,Ee,pe,Le,de);M.generateMipmaps=!1}else if(U){if(re){let ne=Tt(se);t.texStorage2D(i.TEXTURE_2D,xe,Ee,ne.width,ne.height)}ce&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Le,se)}else t.texImage2D(i.TEXTURE_2D,0,Ee,pe,Le,se);p(M)&&f(K),Ae.__version=$.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function J(R,M,V){if(M.image.length!==6)return;let K=Oe(R,M),ee=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+V);let $=n.get(ee);if(ee.version!==$.__version||K===!0){t.activeTexture(i.TEXTURE0+V);let Ae=Ye.getPrimaries(Ye.workingColorSpace),ae=M.colorSpace===Wn?null:Ye.getPrimaries(M.colorSpace),Te=M.colorSpace===Wn||Ae===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);let we=M.isCompressedTexture||M.image[0].isCompressedTexture,se=M.image[0]&&M.image[0].isDataTexture,pe=[];for(let Q=0;Q<6;Q++)!we&&!se?pe[Q]=_(M.image[Q],!0,s.maxCubemapSize):pe[Q]=se?M.image[Q].image:M.image[Q],pe[Q]=Bt(M,pe[Q]);let Le=pe[0],Ee=r.convert(M.format,M.colorSpace),de=r.convert(M.type),Ve=b(M.internalFormat,Ee,de,M.colorSpace),U=M.isVideoTexture!==!0,re=$.__version===void 0||K===!0,ce=ee.dataReady,xe=w(M,Le);te(i.TEXTURE_CUBE_MAP,M);let ne;if(we){U&&re&&t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,Ve,Le.width,Le.height);for(let Q=0;Q<6;Q++){ne=pe[Q].mipmaps;for(let ye=0;ye<ne.length;ye++){let Be=ne[ye];M.format!==Gt?Ee!==null?U?ce&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,0,0,Be.width,Be.height,Ee,Be.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,Ve,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,0,0,Be.width,Be.height,Ee,de,Be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,Ve,Be.width,Be.height,0,Ee,de,Be.data)}}}else{if(ne=M.mipmaps,U&&re){ne.length>0&&xe++;let Q=Tt(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,Ve,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(se){U?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,pe[Q].width,pe[Q].height,Ee,de,pe[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,pe[Q].width,pe[Q].height,0,Ee,de,pe[Q].data);for(let ye=0;ye<ne.length;ye++){let at=ne[ye].image[Q].image;U?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,0,0,at.width,at.height,Ee,de,at.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,Ve,at.width,at.height,0,Ee,de,at.data)}}else{U?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ee,de,pe[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,Ee,de,pe[Q]);for(let ye=0;ye<ne.length;ye++){let Be=ne[ye];U?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,0,0,Ee,de,Be.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,Ve,Ee,de,Be.image[Q])}}}p(M)&&f(i.TEXTURE_CUBE_MAP),$.__version=ee.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function le(R,M,V,K,ee,$){let Ae=r.convert(V.format,V.colorSpace),ae=r.convert(V.type),Te=b(V.internalFormat,Ae,ae,V.colorSpace),we=n.get(M),se=n.get(V);if(se.__renderTarget=M,!we.__hasExternalTextures){let pe=Math.max(1,M.width>>$),Le=Math.max(1,M.height>>$);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,$,Te,pe,Le,M.depth,0,Ae,ae,null):t.texImage2D(ee,$,Te,pe,Le,0,Ae,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),Se(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,ee,se.__webglTexture,0,dt(M)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,ee,se.__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Me(R,M,V){if(i.bindRenderbuffer(i.RENDERBUFFER,R),M.depthBuffer){let K=M.depthTexture,ee=K&&K.isDepthTexture?K.type:null,$=v(M.stencilBuffer,ee),Ae=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=dt(M);Se(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,$,M.width,M.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,$,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,$,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ae,i.RENDERBUFFER,R)}else{let K=M.textures;for(let ee=0;ee<K.length;ee++){let $=K[ee],Ae=r.convert($.format,$.colorSpace),ae=r.convert($.type),Te=b($.internalFormat,Ae,ae,$.colorSpace),we=dt(M);V&&Se(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,we,Te,M.width,M.height):Se(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we,Te,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,Te,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _e(R,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=n.get(M.depthTexture);K.__renderTarget=M,(!K.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),z(M.depthTexture,0);let ee=K.__webglTexture,$=dt(M);if(M.depthTexture.format===er)Se(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(M.depthTexture.format===yr)Se(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function ze(R){let M=n.get(R),V=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){let K=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),K){let ee=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,K.removeEventListener("dispose",ee)};K.addEventListener("dispose",ee),M.__depthDisposeCallback=ee}M.__boundDepthTexture=K}if(R.depthTexture&&!M.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");let K=R.texture.mipmaps;K&&K.length>0?_e(M.__webglFramebuffer[0],R):_e(M.__webglFramebuffer,R)}else if(V){M.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[K]),M.__webglDepthbuffer[K]===void 0)M.__webglDepthbuffer[K]=i.createRenderbuffer(),Me(M.__webglDepthbuffer[K],R,!1);else{let ee=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=M.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,$)}}else{let K=R.texture.mipmaps;if(K&&K.length>0?t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),Me(M.__webglDepthbuffer,R,!1);else{let ee=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,$)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function St(R,M,V){let K=n.get(R);M!==void 0&&le(K.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&ze(R)}function P(R){let M=R.texture,V=n.get(R),K=n.get(M);R.addEventListener("dispose",C);let ee=R.textures,$=R.isWebGLCubeRenderTarget===!0,Ae=ee.length>1;if(Ae||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=M.version,o.memory.textures++),$){V.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[ae]=[];for(let Te=0;Te<M.mipmaps.length;Te++)V.__webglFramebuffer[ae][Te]=i.createFramebuffer()}else V.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let ae=0;ae<M.mipmaps.length;ae++)V.__webglFramebuffer[ae]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Ae)for(let ae=0,Te=ee.length;ae<Te;ae++){let we=n.get(ee[ae]);we.__webglTexture===void 0&&(we.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Se(R)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ae=0;ae<ee.length;ae++){let Te=ee[ae];V.__webglColorRenderbuffer[ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ae]);let we=r.convert(Te.format,Te.colorSpace),se=r.convert(Te.type),pe=b(Te.internalFormat,we,se,Te.colorSpace,R.isXRRenderTarget===!0),Le=dt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,pe,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,V.__webglColorRenderbuffer[ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),Me(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),te(i.TEXTURE_CUBE_MAP,M);for(let ae=0;ae<6;ae++)if(M.mipmaps&&M.mipmaps.length>0)for(let Te=0;Te<M.mipmaps.length;Te++)le(V.__webglFramebuffer[ae][Te],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Te);else le(V.__webglFramebuffer[ae],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);p(M)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let ae=0,Te=ee.length;ae<Te;ae++){let we=ee[ae],se=n.get(we),pe=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,se.__webglTexture),te(pe,we),le(V.__webglFramebuffer,R,we,i.COLOR_ATTACHMENT0+ae,pe,0),p(we)&&f(pe)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ae=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,K.__webglTexture),te(ae,M),M.mipmaps&&M.mipmaps.length>0)for(let Te=0;Te<M.mipmaps.length;Te++)le(V.__webglFramebuffer[Te],R,M,i.COLOR_ATTACHMENT0,ae,Te);else le(V.__webglFramebuffer,R,M,i.COLOR_ATTACHMENT0,ae,0);p(M)&&f(ae),t.unbindTexture()}R.depthBuffer&&ze(R)}function ht(R){let M=R.textures;for(let V=0,K=M.length;V<K;V++){let ee=M[V];if(p(ee)){let $=S(R),Ae=n.get(ee).__webglTexture;t.bindTexture($,Ae),f($),t.unbindTexture()}}}let ke=[],Ne=[];function be(R){if(R.samples>0){if(Se(R)===!1){let M=R.textures,V=R.width,K=R.height,ee=i.COLOR_BUFFER_BIT,$=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ae=n.get(R),ae=M.length>1;if(ae)for(let we=0;we<M.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);let Te=R.texture.mipmaps;Te&&Te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let we=0;we<M.length;we++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[we]);let se=n.get(M[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,V,K,0,0,V,K,ee,i.NEAREST),l===!0&&(ke.length=0,Ne.length=0,ke.push(i.COLOR_ATTACHMENT0+we),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ke.push($),Ne.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ne)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ke))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ae)for(let we=0;we<M.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[we]);let se=n.get(M[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,se,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let M=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function dt(R){return Math.min(s.maxSamples,R.samples)}function Se(R){let M=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ge(R){let M=o.render.frame;u.get(R)!==M&&(u.set(R,M),R.update())}function Bt(R,M){let V=R.colorSpace,K=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==Wt&&V!==Wn&&(Ye.getTransfer(V)===Je?(K!==Gt||ee!==nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),M}function Tt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=D,this.setTexture2D=z,this.setTexture2DArray=B,this.setTexture3D=q,this.setTextureCube=F,this.rebindTextures=St,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=le,this.useMultisampledRTT=Se}function bv(i,e){function t(n,s=Wn){let r,o=Ye.getTransfer(s);if(n===nn)return i.UNSIGNED_BYTE;if(n===$a)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Za)return i.UNSIGNED_SHORT_5_5_5_1;if(n===du)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===uu)return i.BYTE;if(n===hu)return i.SHORT;if(n===xr)return i.UNSIGNED_SHORT;if(n===Ya)return i.INT;if(n===ki)return i.UNSIGNED_INT;if(n===sn)return i.FLOAT;if(n===mn)return i.HALF_FLOAT;if(n===pu)return i.ALPHA;if(n===mu)return i.RGB;if(n===Gt)return i.RGBA;if(n===er)return i.DEPTH_COMPONENT;if(n===yr)return i.DEPTH_STENCIL;if(n===Hi)return i.RED;if(n===Ka)return i.RED_INTEGER;if(n===Mo)return i.RG;if(n===ja)return i.RG_INTEGER;if(n===Ja)return i.RGBA_INTEGER;if(n===bo||n===So||n===To||n===wo)if(o===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===bo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===bo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===wo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Qa||n===el||n===tl||n===nl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===el)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===tl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===nl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===il||n===sl||n===rl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===il||n===sl)return o===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===rl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ol||n===al||n===ll||n===cl||n===ul||n===hl||n===dl||n===fl||n===pl||n===ml||n===gl||n===_l||n===xl||n===vl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ol)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===al)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ll)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===cl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ul)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===hl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===dl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===fl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===pl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ml)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===gl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===_l)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===xl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===vl)return o===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===yl||n===Ml||n===bl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===yl)return o===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===bl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Sl||n===Tl||n===wl||n===El)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Sl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===wl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===El)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===vr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Sv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Tv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,zu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new oo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new vt({vertexShader:Sv,fragmentShader:Tv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ot(new _i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bu=class extends Zn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,m=null,g=null,_=typeof XRWebGLBinding<"u",p=new zu,f={},S=t.getContextAttributes(),b=null,v=null,w=[],E=[],C=new me,L=null,y=new bt;y.viewport=new We;let x=new bt;x.viewport=new We;let I=[y,x],D=new Ca,O=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let J=w[Y];return J===void 0&&(J=new or,w[Y]=J),J.getTargetRaySpace()},this.getControllerGrip=function(Y){let J=w[Y];return J===void 0&&(J=new or,w[Y]=J),J.getGripSpace()},this.getHand=function(Y){let J=w[Y];return J===void 0&&(J=new or,w[Y]=J),J.getHandSpace()};function z(Y){let J=E.indexOf(Y.inputSource);if(J===-1)return;let le=w[J];le!==void 0&&(le.update(Y.inputSource,Y.frame,c||o),le.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",q);for(let Y=0;Y<w.length;Y++){let J=E[Y];J!==null&&(E[Y]=null,w[Y].disconnect(J))}O=null,N=null,p.reset();for(let Y in f)delete f[Y];e.setRenderTarget(b),m=null,d=null,h=null,s=null,v=null,Re.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",B),s.addEventListener("inputsourceschange",q),S.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let le=null,Me=null,_e=null;S.depth&&(_e=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,le=S.stencil?yr:er,Me=S.stencil?vr:ki);let ze={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(ze),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Vt(d.textureWidth,d.textureHeight,{format:Gt,type:nn,depthTexture:new ro(d.textureWidth,d.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let le={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,le),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new Vt(m.framebufferWidth,m.framebufferHeight,{format:Gt,type:nn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Re.setContext(s),Re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function q(Y){for(let J=0;J<Y.removed.length;J++){let le=Y.removed[J],Me=E.indexOf(le);Me>=0&&(E[Me]=null,w[Me].disconnect(le))}for(let J=0;J<Y.added.length;J++){let le=Y.added[J],Me=E.indexOf(le);if(Me===-1){for(let ze=0;ze<w.length;ze++)if(ze>=E.length){E.push(le),Me=ze;break}else if(E[ze]===null){E[ze]=le,Me=ze;break}if(Me===-1)break}let _e=w[Me];_e&&_e.connect(le)}}let F=new A,X=new A;function j(Y,J,le){F.setFromMatrixPosition(J.matrixWorld),X.setFromMatrixPosition(le.matrixWorld);let Me=F.distanceTo(X),_e=J.projectionMatrix.elements,ze=le.projectionMatrix.elements,St=_e[14]/(_e[10]-1),P=_e[14]/(_e[10]+1),ht=(_e[9]+1)/_e[5],ke=(_e[9]-1)/_e[5],Ne=(_e[8]-1)/_e[0],be=(ze[8]+1)/ze[0],dt=St*Ne,Se=St*be,Ge=Me/(-Ne+be),Bt=Ge*-Ne;if(J.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Bt),Y.translateZ(Ge),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),_e[10]===-1)Y.projectionMatrix.copy(J.projectionMatrix),Y.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{let Tt=St+Ge,R=P+Ge,M=dt-Bt,V=Se+(Me-Bt),K=ht*P/R*Tt,ee=ke*P/R*Tt;Y.projectionMatrix.makePerspective(M,V,K,ee,Tt,R),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Z(Y,J){J===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(J.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let J=Y.near,le=Y.far;p.texture!==null&&(p.depthNear>0&&(J=p.depthNear),p.depthFar>0&&(le=p.depthFar)),D.near=x.near=y.near=J,D.far=x.far=y.far=le,(O!==D.near||N!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,N=D.far),D.layers.mask=Y.layers.mask|6,y.layers.mask=D.layers.mask&3,x.layers.mask=D.layers.mask&5;let Me=Y.parent,_e=D.cameras;Z(D,Me);for(let ze=0;ze<_e.length;ze++)Z(_e[ze],Me);_e.length===2?j(D,y,x):D.projectionMatrix.copy(y.projectionMatrix),te(Y,D,Me)};function te(Y,J,le){le===null?Y.matrix.copy(J.matrixWorld):(Y.matrix.copy(le.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(J.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(J.projectionMatrix),Y.projectionMatrixInverse.copy(J.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=us*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(D)},this.getCameraTexture=function(Y){return f[Y]};let Oe=null;function He(Y,J){if(u=J.getViewerPose(c||o),g=J,u!==null){let le=u.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let Me=!1;le.length!==D.cameras.length&&(D.cameras.length=0,Me=!0);for(let P=0;P<le.length;P++){let ht=le[P],ke=null;if(m!==null)ke=m.getViewport(ht);else{let be=h.getViewSubImage(d,ht);ke=be.viewport,P===0&&(e.setRenderTargetTextures(v,be.colorTexture,be.depthStencilTexture),e.setRenderTarget(v))}let Ne=I[P];Ne===void 0&&(Ne=new bt,Ne.layers.enable(P),Ne.viewport=new We,I[P]=Ne),Ne.matrix.fromArray(ht.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(ht.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(ke.x,ke.y,ke.width,ke.height),P===0&&(D.matrix.copy(Ne.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Me===!0&&D.cameras.push(Ne)}let _e=s.enabledFeatures;if(_e&&_e.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let P=h.getDepthInformation(le[0]);P&&P.isValid&&P.texture&&p.init(P,s.renderState)}if(_e&&_e.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let P=0;P<le.length;P++){let ht=le[P].camera;if(ht){let ke=f[ht];ke||(ke=new oo,f[ht]=ke);let Ne=h.getCameraImage(ht);ke.sourceTexture=Ne}}}}for(let le=0;le<w.length;le++){let Me=E[le],_e=w[le];Me!==null&&_e!==void 0&&_e.update(Me,J,c||o)}Oe&&Oe(Y,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}let Re=new Zf;Re.setAnimationLoop(He),this.setAnimationLoop=function(Y){Oe=Y},this.dispose=function(){}}},Ss=new kn,wv=new Ue;function Ev(i,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,bu(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,S,b,v){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),h(p,f)):f.isMeshPhongMaterial?(r(p,f),u(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,v)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),_(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?l(p,f,S,b):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===tn&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===tn&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let S=e.get(f),b=S.envMap,v=S.envMapRotation;b&&(p.envMap.value=b,Ss.copy(v),Ss.x*=-1,Ss.y*=-1,Ss.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ss.y*=-1,Ss.z*=-1),p.envMapRotation.value.setFromMatrix4(wv.makeRotationFromEuler(Ss)),p.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,S,b){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*S,p.scale.value=b*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function u(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function h(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,S){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===tn&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function _(p,f){let S=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Av(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,b){let v=b.program;n.uniformBlockBinding(S,v)}function c(S,b){let v=s[S.id];v===void 0&&(g(S),v=u(S),s[S.id]=v,S.addEventListener("dispose",p));let w=b.program;n.updateUBOMapping(S,w);let E=e.render.frame;r[S.id]!==E&&(d(S),r[S.id]=E)}function u(S){let b=h();S.__bindingPointIndex=b;let v=i.createBuffer(),w=S.__size,E=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,w,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,v),v}function h(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){let b=s[S.id],v=S.uniforms,w=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let E=0,C=v.length;E<C;E++){let L=Array.isArray(v[E])?v[E]:[v[E]];for(let y=0,x=L.length;y<x;y++){let I=L[y];if(m(I,E,y,w)===!0){let D=I.__offset,O=Array.isArray(I.value)?I.value:[I.value],N=0;for(let z=0;z<O.length;z++){let B=O[z],q=_(B);typeof B=="number"||typeof B=="boolean"?(I.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,D+N,I.__data)):B.isMatrix3?(I.__data[0]=B.elements[0],I.__data[1]=B.elements[1],I.__data[2]=B.elements[2],I.__data[3]=0,I.__data[4]=B.elements[3],I.__data[5]=B.elements[4],I.__data[6]=B.elements[5],I.__data[7]=0,I.__data[8]=B.elements[6],I.__data[9]=B.elements[7],I.__data[10]=B.elements[8],I.__data[11]=0):(B.toArray(I.__data,N),N+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(S,b,v,w){let E=S.value,C=b+"_"+v;if(w[C]===void 0)return typeof E=="number"||typeof E=="boolean"?w[C]=E:w[C]=E.clone(),!0;{let L=w[C];if(typeof E=="number"||typeof E=="boolean"){if(L!==E)return w[C]=E,!0}else if(L.equals(E)===!1)return L.copy(E),!0}return!1}function g(S){let b=S.uniforms,v=0,w=16;for(let C=0,L=b.length;C<L;C++){let y=Array.isArray(b[C])?b[C]:[b[C]];for(let x=0,I=y.length;x<I;x++){let D=y[x],O=Array.isArray(D.value)?D.value:[D.value];for(let N=0,z=O.length;N<z;N++){let B=O[N],q=_(B),F=v%w,X=F%q.boundary,j=F+X;v+=X,j!==0&&w-j<q.storage&&(v+=w-j),D.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=v,v+=q.storage}}}let E=v%w;return E>0&&(v+=w-E),S.__size=v,S.__cache={},this}function _(S){let b={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(b.boundary=4,b.storage=4):S.isVector2?(b.boundary=8,b.storage=8):S.isVector3||S.isColor?(b.boundary=16,b.storage=12):S.isVector4?(b.boundary=16,b.storage=16):S.isMatrix3?(b.boundary=48,b.storage=48):S.isMatrix4?(b.boundary=64,b.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),b}function p(S){let b=S.target;b.removeEventListener("dispose",p);let v=o.indexOf(b.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function f(){for(let S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Ll=class{constructor(e={}){let{canvas:t=Mf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let g=new Uint32Array(4),_=new Int32Array(4),p=null,f=null,S=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,w=!1;this._outputColorSpace=_t;let E=0,C=0,L=null,y=-1,x=null,I=new We,D=new We,O=null,N=new ue(0),z=0,B=t.width,q=t.height,F=1,X=null,j=null,Z=new We(0,0,B,q),te=new We(0,0,B,q),Oe=!1,He=new ur,Re=!1,Y=!1,J=new Ue,le=new A,Me=new We,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ze=!1;function St(){return L===null?F:1}let P=n;function ht(T,k){return t.getContext(T,k)}try{let T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ce,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",ne,!1),P===null){let k="webgl2";if(P=ht(k,T),P===null)throw ht(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let ke,Ne,be,dt,Se,Ge,Bt,Tt,R,M,V,K,ee,$,Ae,ae,Te,we,se,pe,Le,Ee,de,Ve;function U(){ke=new X_(P),ke.init(),Ee=new bv(P,ke),Ne=new z_(P,ke,e,Ee),be=new yv(P,ke),Ne.reversedDepthBuffer&&d&&be.buffers.depth.setReversed(!0),dt=new $_(P),Se=new av,Ge=new Mv(P,ke,be,Se,Ne,Ee,dt),Bt=new k_(v),Tt=new W_(v),R=new eg(P),de=new U_(P,R),M=new q_(P,R,dt,de),V=new K_(P,M,R,dt),se=new Z_(P,Ne,Ge),ae=new B_(Se),K=new ov(v,Bt,Tt,ke,Ne,de,ae),ee=new Ev(v,Se),$=new cv,Ae=new mv(ke),we=new F_(v,Bt,Tt,be,V,m,l),Te=new xv(v,V,Ne),Ve=new Av(P,dt,Ne,be),pe=new O_(P,ke,dt),Le=new Y_(P,ke,dt),dt.programs=K.programs,v.capabilities=Ne,v.extensions=ke,v.properties=Se,v.renderLists=$,v.shadowMap=Te,v.state=be,v.info=dt}U();let re=new Bu(v,P);this.xr=re,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let T=ke.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=ke.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(T){T!==void 0&&(F=T,this.setSize(B,q,!1))},this.getSize=function(T){return T.set(B,q)},this.setSize=function(T,k,G=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=T,q=k,t.width=Math.floor(T*F),t.height=Math.floor(k*F),G===!0&&(t.style.width=T+"px",t.style.height=k+"px"),this.setViewport(0,0,T,k)},this.getDrawingBufferSize=function(T){return T.set(B*F,q*F).floor()},this.setDrawingBufferSize=function(T,k,G){B=T,q=k,F=G,t.width=Math.floor(T*G),t.height=Math.floor(k*G),this.setViewport(0,0,T,k)},this.getCurrentViewport=function(T){return T.copy(I)},this.getViewport=function(T){return T.copy(Z)},this.setViewport=function(T,k,G,W){T.isVector4?Z.set(T.x,T.y,T.z,T.w):Z.set(T,k,G,W),be.viewport(I.copy(Z).multiplyScalar(F).round())},this.getScissor=function(T){return T.copy(te)},this.setScissor=function(T,k,G,W){T.isVector4?te.set(T.x,T.y,T.z,T.w):te.set(T,k,G,W),be.scissor(D.copy(te).multiplyScalar(F).round())},this.getScissorTest=function(){return Oe},this.setScissorTest=function(T){be.setScissorTest(Oe=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){j=T},this.getClearColor=function(T){return T.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(T=!0,k=!0,G=!0){let W=0;if(T){let H=!1;if(L!==null){let ie=L.texture.format;H=ie===Ja||ie===ja||ie===Ka}if(H){let ie=L.texture.type,fe=ie===nn||ie===ki||ie===xr||ie===vr||ie===$a||ie===Za,ve=we.getClearColor(),ge=we.getClearAlpha(),Pe=ve.r,Fe=ve.g,Ce=ve.b;fe?(g[0]=Pe,g[1]=Fe,g[2]=Ce,g[3]=ge,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Pe,_[1]=Fe,_[2]=Ce,_[3]=ge,P.clearBufferiv(P.COLOR,0,_))}else W|=P.COLOR_BUFFER_BIT}k&&(W|=P.DEPTH_BUFFER_BIT),G&&(W|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ce,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),we.dispose(),$.dispose(),Ae.dispose(),Se.dispose(),Bt.dispose(),Tt.dispose(),V.dispose(),de.dispose(),Ve.dispose(),K.dispose(),re.dispose(),re.removeEventListener("sessionstart",qn),re.removeEventListener("sessionend",Gh),ji.stop()};function ce(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let T=dt.autoReset,k=Te.enabled,G=Te.autoUpdate,W=Te.needsUpdate,H=Te.type;U(),dt.autoReset=T,Te.enabled=k,Te.autoUpdate=G,Te.needsUpdate=W,Te.type=H}function ne(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Q(T){let k=T.target;k.removeEventListener("dispose",Q),ye(k)}function ye(T){Be(T),Se.remove(T)}function Be(T){let k=Se.get(T).programs;k!==void 0&&(k.forEach(function(G){K.releaseProgram(G)}),T.isShaderMaterial&&K.releaseShaderCache(T))}this.renderBufferDirect=function(T,k,G,W,H,ie){k===null&&(k=_e);let fe=H.isMesh&&H.matrixWorld.determinant()<0,ve=qp(T,k,G,W,H);be.setMaterial(W,fe);let ge=G.index,Pe=1;if(W.wireframe===!0){if(ge=M.getWireframeAttribute(G),ge===void 0)return;Pe=2}let Fe=G.drawRange,Ce=G.attributes.position,Ke=Fe.start*Pe,nt=(Fe.start+Fe.count)*Pe;ie!==null&&(Ke=Math.max(Ke,ie.start*Pe),nt=Math.min(nt,(ie.start+ie.count)*Pe)),ge!==null?(Ke=Math.max(Ke,0),nt=Math.min(nt,ge.count)):Ce!=null&&(Ke=Math.max(Ke,0),nt=Math.min(nt,Ce.count));let Mt=nt-Ke;if(Mt<0||Mt===1/0)return;de.setup(H,W,ve,G,ge);let lt,st=pe;if(ge!==null&&(lt=R.get(ge),st=Le,st.setIndex(lt)),H.isMesh)W.wireframe===!0?(be.setLineWidth(W.wireframeLinewidth*St()),st.setMode(P.LINES)):st.setMode(P.TRIANGLES);else if(H.isLine){let Ie=W.linewidth;Ie===void 0&&(Ie=1),be.setLineWidth(Ie*St()),H.isLineSegments?st.setMode(P.LINES):H.isLineLoop?st.setMode(P.LINE_LOOP):st.setMode(P.LINE_STRIP)}else H.isPoints?st.setMode(P.POINTS):H.isSprite&&st.setMode(P.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)nr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),st.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(ke.get("WEBGL_multi_draw"))st.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Ie=H._multiDrawStarts,mt=H._multiDrawCounts,je=H._multiDrawCount,_n=ge?R.get(ge).bytesPerElement:1,Us=Se.get(W).currentProgram.getUniforms();for(let xn=0;xn<je;xn++)Us.setValue(P,"_gl_DrawID",xn),st.render(Ie[xn]/_n,mt[xn])}else if(H.isInstancedMesh)st.renderInstances(Ke,Mt,H.count);else if(G.isInstancedBufferGeometry){let Ie=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,mt=Math.min(G.instanceCount,Ie);st.renderInstances(Ke,Mt,mt)}else st.render(Ke,Mt)};function at(T,k,G){T.transparent===!0&&T.side===pn&&T.forceSinglePass===!1?(T.side=tn,T.needsUpdate=!0,zo(T,k,G),T.side=Mn,T.needsUpdate=!0,zo(T,k,G),T.side=pn):zo(T,k,G)}this.compile=function(T,k,G=null){G===null&&(G=T),f=Ae.get(G),f.init(k),b.push(f),G.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),T!==G&&T.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),f.setupLights();let W=new Set;return T.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ie=H.material;if(ie)if(Array.isArray(ie))for(let fe=0;fe<ie.length;fe++){let ve=ie[fe];at(ve,G,H),W.add(ve)}else at(ie,G,H),W.add(ie)}),f=b.pop(),W},this.compileAsync=function(T,k,G=null){let W=this.compile(T,k,G);return new Promise(H=>{function ie(){if(W.forEach(function(fe){Se.get(fe).currentProgram.isReady()&&W.delete(fe)}),W.size===0){H(T);return}setTimeout(ie,10)}ke.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let Qe=null;function ai(T){Qe&&Qe(T)}function qn(){ji.stop()}function Gh(){ji.start()}let ji=new Zf;ji.setAnimationLoop(ai),typeof self<"u"&&ji.setContext(self),this.setAnimationLoop=function(T){Qe=T,re.setAnimationLoop(T),T===null?ji.stop():ji.start()},re.addEventListener("sessionstart",qn),re.addEventListener("sessionend",Gh),this.render=function(T,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(k),k=re.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,k,L),f=Ae.get(T,b.length),f.init(k),b.push(f),J.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),He.setFromProjectionMatrix(J,zn,k.reversedDepth),Y=this.localClippingEnabled,Re=ae.init(this.clippingPlanes,Y),p=$.get(T,S.length),p.init(),S.push(p),re.enabled===!0&&re.isPresenting===!0){let ie=v.xr.getDepthSensingMesh();ie!==null&&ac(ie,k,-1/0,v.sortObjects)}ac(T,k,0,v.sortObjects),p.finish(),v.sortObjects===!0&&p.sort(X,j),ze=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,ze&&we.addToRenderList(p,T),this.info.render.frame++,Re===!0&&ae.beginShadows();let G=f.state.shadowsArray;Te.render(G,T,k),Re===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=p.opaque,H=p.transmissive;if(f.setupLights(),k.isArrayCamera){let ie=k.cameras;if(H.length>0)for(let fe=0,ve=ie.length;fe<ve;fe++){let ge=ie[fe];Xh(W,H,T,ge)}ze&&we.render(T);for(let fe=0,ve=ie.length;fe<ve;fe++){let ge=ie[fe];Wh(p,T,ge,ge.viewport)}}else H.length>0&&Xh(W,H,T,k),ze&&we.render(T),Wh(p,T,k);L!==null&&C===0&&(Ge.updateMultisampleRenderTarget(L),Ge.updateRenderTargetMipmap(L)),T.isScene===!0&&T.onAfterRender(v,T,k),de.resetDefaultState(),y=-1,x=null,b.pop(),b.length>0?(f=b[b.length-1],Re===!0&&ae.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?p=S[S.length-1]:p=null};function ac(T,k,G,W){if(T.visible===!1)return;if(T.layers.test(k.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(k);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||He.intersectsSprite(T)){W&&Me.setFromMatrixPosition(T.matrixWorld).applyMatrix4(J);let fe=V.update(T),ve=T.material;ve.visible&&p.push(T,fe,ve,G,Me.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||He.intersectsObject(T))){let fe=V.update(T),ve=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Me.copy(T.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Me.copy(fe.boundingSphere.center)),Me.applyMatrix4(T.matrixWorld).applyMatrix4(J)),Array.isArray(ve)){let ge=fe.groups;for(let Pe=0,Fe=ge.length;Pe<Fe;Pe++){let Ce=ge[Pe],Ke=ve[Ce.materialIndex];Ke&&Ke.visible&&p.push(T,fe,Ke,G,Me.z,Ce)}}else ve.visible&&p.push(T,fe,ve,G,Me.z,null)}}let ie=T.children;for(let fe=0,ve=ie.length;fe<ve;fe++)ac(ie[fe],k,G,W)}function Wh(T,k,G,W){let H=T.opaque,ie=T.transmissive,fe=T.transparent;f.setupLightsView(G),Re===!0&&ae.setGlobalState(v.clippingPlanes,G),W&&be.viewport(I.copy(W)),H.length>0&&Oo(H,k,G),ie.length>0&&Oo(ie,k,G),fe.length>0&&Oo(fe,k,G),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function Xh(T,k,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new Vt(1,1,{generateMipmaps:!0,type:ke.has("EXT_color_buffer_half_float")||ke.has("EXT_color_buffer_float")?mn:nn,minFilter:Gn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));let ie=f.state.transmissionRenderTarget[W.id],fe=W.viewport||I;ie.setSize(fe.z*v.transmissionResolutionScale,fe.w*v.transmissionResolutionScale);let ve=v.getRenderTarget(),ge=v.getActiveCubeFace(),Pe=v.getActiveMipmapLevel();v.setRenderTarget(ie),v.getClearColor(N),z=v.getClearAlpha(),z<1&&v.setClearColor(16777215,.5),v.clear(),ze&&we.render(G);let Fe=v.toneMapping;v.toneMapping=Si;let Ce=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),Re===!0&&ae.setGlobalState(v.clippingPlanes,W),Oo(T,G,W),Ge.updateMultisampleRenderTarget(ie),Ge.updateRenderTargetMipmap(ie),ke.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let nt=0,Mt=k.length;nt<Mt;nt++){let lt=k[nt],st=lt.object,Ie=lt.geometry,mt=lt.material,je=lt.group;if(mt.side===pn&&st.layers.test(W.layers)){let _n=mt.side;mt.side=tn,mt.needsUpdate=!0,qh(st,G,W,Ie,mt,je),mt.side=_n,mt.needsUpdate=!0,Ke=!0}}Ke===!0&&(Ge.updateMultisampleRenderTarget(ie),Ge.updateRenderTargetMipmap(ie))}v.setRenderTarget(ve,ge,Pe),v.setClearColor(N,z),Ce!==void 0&&(W.viewport=Ce),v.toneMapping=Fe}function Oo(T,k,G){let W=k.isScene===!0?k.overrideMaterial:null;for(let H=0,ie=T.length;H<ie;H++){let fe=T[H],ve=fe.object,ge=fe.geometry,Pe=fe.group,Fe=fe.material;Fe.allowOverride===!0&&W!==null&&(Fe=W),ve.layers.test(G.layers)&&qh(ve,k,G,ge,Fe,Pe)}}function qh(T,k,G,W,H,ie){T.onBeforeRender(v,k,G,W,H,ie),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(v,k,G,W,T,ie),H.transparent===!0&&H.side===pn&&H.forceSinglePass===!1?(H.side=tn,H.needsUpdate=!0,v.renderBufferDirect(G,k,W,H,T,ie),H.side=Mn,H.needsUpdate=!0,v.renderBufferDirect(G,k,W,H,T,ie),H.side=pn):v.renderBufferDirect(G,k,W,H,T,ie),T.onAfterRender(v,k,G,W,H,ie)}function zo(T,k,G){k.isScene!==!0&&(k=_e);let W=Se.get(T),H=f.state.lights,ie=f.state.shadowsArray,fe=H.state.version,ve=K.getParameters(T,H.state,ie,k,G),ge=K.getProgramCacheKey(ve),Pe=W.programs;W.environment=T.isMeshStandardMaterial?k.environment:null,W.fog=k.fog,W.envMap=(T.isMeshStandardMaterial?Tt:Bt).get(T.envMap||W.environment),W.envMapRotation=W.environment!==null&&T.envMap===null?k.environmentRotation:T.envMapRotation,Pe===void 0&&(T.addEventListener("dispose",Q),Pe=new Map,W.programs=Pe);let Fe=Pe.get(ge);if(Fe!==void 0){if(W.currentProgram===Fe&&W.lightsStateVersion===fe)return $h(T,ve),Fe}else ve.uniforms=K.getUniforms(T),T.onBeforeCompile(ve,v),Fe=K.acquireProgram(ve,ge),Pe.set(ge,Fe),W.uniforms=ve.uniforms;let Ce=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ce.clippingPlanes=ae.uniform),$h(T,ve),W.needsLights=$p(T),W.lightsStateVersion=fe,W.needsLights&&(Ce.ambientLightColor.value=H.state.ambient,Ce.lightProbe.value=H.state.probe,Ce.directionalLights.value=H.state.directional,Ce.directionalLightShadows.value=H.state.directionalShadow,Ce.spotLights.value=H.state.spot,Ce.spotLightShadows.value=H.state.spotShadow,Ce.rectAreaLights.value=H.state.rectArea,Ce.ltc_1.value=H.state.rectAreaLTC1,Ce.ltc_2.value=H.state.rectAreaLTC2,Ce.pointLights.value=H.state.point,Ce.pointLightShadows.value=H.state.pointShadow,Ce.hemisphereLights.value=H.state.hemi,Ce.directionalShadowMap.value=H.state.directionalShadowMap,Ce.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ce.spotShadowMap.value=H.state.spotShadowMap,Ce.spotLightMatrix.value=H.state.spotLightMatrix,Ce.spotLightMap.value=H.state.spotLightMap,Ce.pointShadowMap.value=H.state.pointShadowMap,Ce.pointShadowMatrix.value=H.state.pointShadowMatrix),W.currentProgram=Fe,W.uniformsList=null,Fe}function Yh(T){if(T.uniformsList===null){let k=T.currentProgram.getUniforms();T.uniformsList=Tr.seqWithValue(k.seq,T.uniforms)}return T.uniformsList}function $h(T,k){let G=Se.get(T);G.outputColorSpace=k.outputColorSpace,G.batching=k.batching,G.batchingColor=k.batchingColor,G.instancing=k.instancing,G.instancingColor=k.instancingColor,G.instancingMorph=k.instancingMorph,G.skinning=k.skinning,G.morphTargets=k.morphTargets,G.morphNormals=k.morphNormals,G.morphColors=k.morphColors,G.morphTargetsCount=k.morphTargetsCount,G.numClippingPlanes=k.numClippingPlanes,G.numIntersection=k.numClipIntersection,G.vertexAlphas=k.vertexAlphas,G.vertexTangents=k.vertexTangents,G.toneMapping=k.toneMapping}function qp(T,k,G,W,H){k.isScene!==!0&&(k=_e),Ge.resetTextureUnits();let ie=k.fog,fe=W.isMeshStandardMaterial?k.environment:null,ve=L===null?v.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Wt,ge=(W.isMeshStandardMaterial?Tt:Bt).get(W.envMap||fe),Pe=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Fe=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ce=!!G.morphAttributes.position,Ke=!!G.morphAttributes.normal,nt=!!G.morphAttributes.color,Mt=Si;W.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Mt=v.toneMapping);let lt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,st=lt!==void 0?lt.length:0,Ie=Se.get(W),mt=f.state.lights;if(Re===!0&&(Y===!0||T!==x)){let Jt=T===x&&W.id===y;ae.setState(W,T,Jt)}let je=!1;W.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==mt.state.version||Ie.outputColorSpace!==ve||H.isBatchedMesh&&Ie.batching===!1||!H.isBatchedMesh&&Ie.batching===!0||H.isBatchedMesh&&Ie.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ie.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ie.instancing===!1||!H.isInstancedMesh&&Ie.instancing===!0||H.isSkinnedMesh&&Ie.skinning===!1||!H.isSkinnedMesh&&Ie.skinning===!0||H.isInstancedMesh&&Ie.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ie.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ie.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ie.instancingMorph===!1&&H.morphTexture!==null||Ie.envMap!==ge||W.fog===!0&&Ie.fog!==ie||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==ae.numPlanes||Ie.numIntersection!==ae.numIntersection)||Ie.vertexAlphas!==Pe||Ie.vertexTangents!==Fe||Ie.morphTargets!==Ce||Ie.morphNormals!==Ke||Ie.morphColors!==nt||Ie.toneMapping!==Mt||Ie.morphTargetsCount!==st)&&(je=!0):(je=!0,Ie.__version=W.version);let _n=Ie.currentProgram;je===!0&&(_n=zo(W,k,H));let Us=!1,xn=!1,Dr=!1,gt=_n.getUniforms(),En=Ie.uniforms;if(be.useProgram(_n.program)&&(Us=!0,xn=!0,Dr=!0),W.id!==y&&(y=W.id,xn=!0),Us||x!==T){be.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),gt.setValue(P,"projectionMatrix",T.projectionMatrix),gt.setValue(P,"viewMatrix",T.matrixWorldInverse);let ln=gt.map.cameraPosition;ln!==void 0&&ln.setValue(P,le.setFromMatrixPosition(T.matrixWorld)),Ne.logarithmicDepthBuffer&&gt.setValue(P,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&gt.setValue(P,"isOrthographic",T.isOrthographicCamera===!0),x!==T&&(x=T,xn=!0,Dr=!0)}if(H.isSkinnedMesh){gt.setOptional(P,H,"bindMatrix"),gt.setOptional(P,H,"bindMatrixInverse");let Jt=H.skeleton;Jt&&(Jt.boneTexture===null&&Jt.computeBoneTexture(),gt.setValue(P,"boneTexture",Jt.boneTexture,Ge))}H.isBatchedMesh&&(gt.setOptional(P,H,"batchingTexture"),gt.setValue(P,"batchingTexture",H._matricesTexture,Ge),gt.setOptional(P,H,"batchingIdTexture"),gt.setValue(P,"batchingIdTexture",H._indirectTexture,Ge),gt.setOptional(P,H,"batchingColorTexture"),H._colorsTexture!==null&&gt.setValue(P,"batchingColorTexture",H._colorsTexture,Ge));let An=G.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&se.update(H,G,_n),(xn||Ie.receiveShadow!==H.receiveShadow)&&(Ie.receiveShadow=H.receiveShadow,gt.setValue(P,"receiveShadow",H.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(En.envMap.value=ge,En.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&k.environment!==null&&(En.envMapIntensity.value=k.environmentIntensity),xn&&(gt.setValue(P,"toneMappingExposure",v.toneMappingExposure),Ie.needsLights&&Yp(En,Dr),ie&&W.fog===!0&&ee.refreshFogUniforms(En,ie),ee.refreshMaterialUniforms(En,W,F,q,f.state.transmissionRenderTarget[T.id]),Tr.upload(P,Yh(Ie),En,Ge)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Tr.upload(P,Yh(Ie),En,Ge),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&gt.setValue(P,"center",H.center),gt.setValue(P,"modelViewMatrix",H.modelViewMatrix),gt.setValue(P,"normalMatrix",H.normalMatrix),gt.setValue(P,"modelMatrix",H.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Jt=W.uniformsGroups;for(let ln=0,lc=Jt.length;ln<lc;ln++){let Ji=Jt[ln];Ve.update(Ji,_n),Ve.bind(Ji,_n)}}return _n}function Yp(T,k){T.ambientLightColor.needsUpdate=k,T.lightProbe.needsUpdate=k,T.directionalLights.needsUpdate=k,T.directionalLightShadows.needsUpdate=k,T.pointLights.needsUpdate=k,T.pointLightShadows.needsUpdate=k,T.spotLights.needsUpdate=k,T.spotLightShadows.needsUpdate=k,T.rectAreaLights.needsUpdate=k,T.hemisphereLights.needsUpdate=k}function $p(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,k,G){let W=Se.get(T);W.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),Se.get(T.texture).__webglTexture=k,Se.get(T.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:G,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,k){let G=Se.get(T);G.__webglFramebuffer=k,G.__useDefaultFramebuffer=k===void 0};let Zp=P.createFramebuffer();this.setRenderTarget=function(T,k=0,G=0){L=T,E=k,C=G;let W=!0,H=null,ie=!1,fe=!1;if(T){let ge=Se.get(T);if(ge.__useDefaultFramebuffer!==void 0)be.bindFramebuffer(P.FRAMEBUFFER,null),W=!1;else if(ge.__webglFramebuffer===void 0)Ge.setupRenderTarget(T);else if(ge.__hasExternalTextures)Ge.rebindTextures(T,Se.get(T.texture).__webglTexture,Se.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ce=T.depthTexture;if(ge.__boundDepthTexture!==Ce){if(Ce!==null&&Se.has(Ce)&&(T.width!==Ce.image.width||T.height!==Ce.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ge.setupDepthRenderbuffer(T)}}let Pe=T.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(fe=!0);let Fe=Se.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Fe[k])?H=Fe[k][G]:H=Fe[k],ie=!0):T.samples>0&&Ge.useMultisampledRTT(T)===!1?H=Se.get(T).__webglMultisampledFramebuffer:Array.isArray(Fe)?H=Fe[G]:H=Fe,I.copy(T.viewport),D.copy(T.scissor),O=T.scissorTest}else I.copy(Z).multiplyScalar(F).floor(),D.copy(te).multiplyScalar(F).floor(),O=Oe;if(G!==0&&(H=Zp),be.bindFramebuffer(P.FRAMEBUFFER,H)&&W&&be.drawBuffers(T,H),be.viewport(I),be.scissor(D),be.setScissorTest(O),ie){let ge=Se.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+k,ge.__webglTexture,G)}else if(fe){let ge=k;for(let Pe=0;Pe<T.textures.length;Pe++){let Fe=Se.get(T.textures[Pe]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Pe,Fe.__webglTexture,G,ge)}}else if(T!==null&&G!==0){let ge=Se.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ge.__webglTexture,G)}y=-1},this.readRenderTargetPixels=function(T,k,G,W,H,ie,fe,ve=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=Se.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(ge=ge[fe]),ge){be.bindFramebuffer(P.FRAMEBUFFER,ge);try{let Pe=T.textures[ve],Fe=Pe.format,Ce=Pe.type;if(!Ne.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ne.textureTypeReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=T.width-W&&G>=0&&G<=T.height-H&&(T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ve),P.readPixels(k,G,W,H,Ee.convert(Fe),Ee.convert(Ce),ie))}finally{let Pe=L!==null?Se.get(L).__webglFramebuffer:null;be.bindFramebuffer(P.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(T,k,G,W,H,ie,fe,ve=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=Se.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(ge=ge[fe]),ge)if(k>=0&&k<=T.width-W&&G>=0&&G<=T.height-H){be.bindFramebuffer(P.FRAMEBUFFER,ge);let Pe=T.textures[ve],Fe=Pe.format,Ce=Pe.type;if(!Ne.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ne.textureTypeReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ke=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ke),P.bufferData(P.PIXEL_PACK_BUFFER,ie.byteLength,P.STREAM_READ),T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ve),P.readPixels(k,G,W,H,Ee.convert(Fe),Ee.convert(Ce),0);let nt=L!==null?Se.get(L).__webglFramebuffer:null;be.bindFramebuffer(P.FRAMEBUFFER,nt);let Mt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await bf(P,Mt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ke),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ie),P.deleteBuffer(Ke),P.deleteSync(Mt),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,k=null,G=0){let W=Math.pow(2,-G),H=Math.floor(T.image.width*W),ie=Math.floor(T.image.height*W),fe=k!==null?k.x:0,ve=k!==null?k.y:0;Ge.setTexture2D(T,0),P.copyTexSubImage2D(P.TEXTURE_2D,G,0,0,fe,ve,H,ie),be.unbindTexture()};let Kp=P.createFramebuffer(),jp=P.createFramebuffer();this.copyTextureToTexture=function(T,k,G=null,W=null,H=0,ie=null){ie===null&&(H!==0?(nr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=H,H=0):ie=0);let fe,ve,ge,Pe,Fe,Ce,Ke,nt,Mt,lt=T.isCompressedTexture?T.mipmaps[ie]:T.image;if(G!==null)fe=G.max.x-G.min.x,ve=G.max.y-G.min.y,ge=G.isBox3?G.max.z-G.min.z:1,Pe=G.min.x,Fe=G.min.y,Ce=G.isBox3?G.min.z:0;else{let An=Math.pow(2,-H);fe=Math.floor(lt.width*An),ve=Math.floor(lt.height*An),T.isDataArrayTexture?ge=lt.depth:T.isData3DTexture?ge=Math.floor(lt.depth*An):ge=1,Pe=0,Fe=0,Ce=0}W!==null?(Ke=W.x,nt=W.y,Mt=W.z):(Ke=0,nt=0,Mt=0);let st=Ee.convert(k.format),Ie=Ee.convert(k.type),mt;k.isData3DTexture?(Ge.setTexture3D(k,0),mt=P.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Ge.setTexture2DArray(k,0),mt=P.TEXTURE_2D_ARRAY):(Ge.setTexture2D(k,0),mt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,k.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,k.unpackAlignment);let je=P.getParameter(P.UNPACK_ROW_LENGTH),_n=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Us=P.getParameter(P.UNPACK_SKIP_PIXELS),xn=P.getParameter(P.UNPACK_SKIP_ROWS),Dr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,lt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,lt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Pe),P.pixelStorei(P.UNPACK_SKIP_ROWS,Fe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ce);let gt=T.isDataArrayTexture||T.isData3DTexture,En=k.isDataArrayTexture||k.isData3DTexture;if(T.isDepthTexture){let An=Se.get(T),Jt=Se.get(k),ln=Se.get(An.__renderTarget),lc=Se.get(Jt.__renderTarget);be.bindFramebuffer(P.READ_FRAMEBUFFER,ln.__webglFramebuffer),be.bindFramebuffer(P.DRAW_FRAMEBUFFER,lc.__webglFramebuffer);for(let Ji=0;Ji<ge;Ji++)gt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Se.get(T).__webglTexture,H,Ce+Ji),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Se.get(k).__webglTexture,ie,Mt+Ji)),P.blitFramebuffer(Pe,Fe,fe,ve,Ke,nt,fe,ve,P.DEPTH_BUFFER_BIT,P.NEAREST);be.bindFramebuffer(P.READ_FRAMEBUFFER,null),be.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(H!==0||T.isRenderTargetTexture||Se.has(T)){let An=Se.get(T),Jt=Se.get(k);be.bindFramebuffer(P.READ_FRAMEBUFFER,Kp),be.bindFramebuffer(P.DRAW_FRAMEBUFFER,jp);for(let ln=0;ln<ge;ln++)gt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,An.__webglTexture,H,Ce+ln):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,An.__webglTexture,H),En?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Jt.__webglTexture,ie,Mt+ln):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Jt.__webglTexture,ie),H!==0?P.blitFramebuffer(Pe,Fe,fe,ve,Ke,nt,fe,ve,P.COLOR_BUFFER_BIT,P.NEAREST):En?P.copyTexSubImage3D(mt,ie,Ke,nt,Mt+ln,Pe,Fe,fe,ve):P.copyTexSubImage2D(mt,ie,Ke,nt,Pe,Fe,fe,ve);be.bindFramebuffer(P.READ_FRAMEBUFFER,null),be.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else En?T.isDataTexture||T.isData3DTexture?P.texSubImage3D(mt,ie,Ke,nt,Mt,fe,ve,ge,st,Ie,lt.data):k.isCompressedArrayTexture?P.compressedTexSubImage3D(mt,ie,Ke,nt,Mt,fe,ve,ge,st,lt.data):P.texSubImage3D(mt,ie,Ke,nt,Mt,fe,ve,ge,st,Ie,lt):T.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ie,Ke,nt,fe,ve,st,Ie,lt.data):T.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ie,Ke,nt,lt.width,lt.height,st,lt.data):P.texSubImage2D(P.TEXTURE_2D,ie,Ke,nt,fe,ve,st,Ie,lt);P.pixelStorei(P.UNPACK_ROW_LENGTH,je),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,_n),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Us),P.pixelStorei(P.UNPACK_SKIP_ROWS,xn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Dr),ie===0&&k.generateMipmaps&&P.generateMipmap(mt),be.unbindTexture()},this.initRenderTarget=function(T){Se.get(T).__webglFramebuffer===void 0&&Ge.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Ge.setTextureCube(T,0):T.isData3DTexture?Ge.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ge.setTexture2DArray(T,0):Ge.setTexture2D(T,0),be.unbindTexture()},this.resetState=function(){E=0,C=0,L=null,be.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}};var Hu=.53/1.65;function ep(i,e,t,n,s,r,o={}){let a=new Lt;a.name="study-manual-spill";let l=new Lt;l.name="manual-spill-editor",a.add(l),i.add(a);let c=new Map,u=new Map,h=new Map,d=new xo,m=new me,g=new lo(1,10,8),_=new en({color:"#73c3bb",depthTest:!1,depthWrite:!1,toneMapped:!1}),p=_.clone();p.color.set("#ffe4aa");let f=n.shadowMap.enabled,S=n.shadowMap.type,b=Pt(),v=!0,w={placing:!1,reposition:!1,markers:!0},E=null,C=!1,L=!1;function y(F){F.isMesh&&!h.has(F)&&(h.set(F,{castShadow:F.castShadow,receiveShadow:F.receiveShadow}),F.castShadow=!0,F.receiveShadow=!0)}function x(F,X=!0){if(C)return;b=Pt(F),v=X;for(let[Z,te]of c)b.points.some(Oe=>Oe.id===Z)||(a.remove(te,te.target),te.dispose(),c.delete(Z),l.remove(u.get(Z)),u.delete(Z));let j=0;for(let Z of b.points){let te=c.get(Z.id);if(!te){te=new gs,te.name="manual-spill-"+Z.id,te.shadow.mapSize.set(512,512),te.shadow.bias=-3e-4,te.shadow.normalBias=.012,te.shadow.radius=3,a.add(te,te.target),c.set(Z.id,te);let Me=new ot(g,_);Me.userData.pointId=Z.id,Me.renderOrder=1e4,l.add(Me),u.set(Z.id,Me)}let Oe=new A(...Z.normal),He=new A(...Z.position).addScaledVector(Oe,Z.offset*Hu),Re=Math.atan2(Oe.x,Oe.z)+rn.degToRad(Z.azimuth),Y=rn.degToRad(Z.elevation),J=new A(Math.sin(Re)*Math.cos(Y),Math.sin(Y),Math.cos(Re)*Math.cos(Y));te.position.copy(He),te.target.position.copy(He).add(J),te.color.set(Z.color),te.distance=Z.distance*Hu,te.angle=rn.degToRad(Z.angle*.5),te.penumbra=Z.penumbra,te.decay=2,te.intensity=Z.intensity*Hu**2,te.visible=v&&b.enabled&&Z.enabled&&Z.intensity>0,te.castShadow=te.visible&&Z.shadows&&j<Qh,te.castShadow&&j++,te.shadow.camera.near=.01,te.shadow.camera.far=Math.max(.1,te.distance),te.shadow.needsUpdate=!0;let le=u.get(Z.id);le.position.copy(He),le.material=Z.id===b.selectedId?p:_}if(L=j>0,L)e.traverse(y),t&&y(t),n.shadowMap.enabled=!0,f||(n.shadowMap.type=Ia);else if(h.size){for(let[Z,te]of h)Object.assign(Z,te);h.clear(),n.shadowMap.enabled=f,n.shadowMap.type=S}n.shadowMap.needsUpdate=!0,I()}function I(){l.visible=w.markers;for(let[F,X]of u){let j=s.position.distanceTo(X.position);X.scale.setScalar(Math.max(.015,j*.006)),X.visible=w.markers,X.material=F===b.selectedId?p:_}a.updateMatrixWorld(!0)}function D(F){w={...w,...F},r.classList.toggle("manual-placement-active",w.placing),I()}function O(F,X){let j=r.getBoundingClientRect();return m.set((F.clientX-j.left)/j.width*2-1,-(F.clientY-j.top)/j.height*2+1),s.updateMatrixWorld(),e.updateMatrixWorld(!0),d.setFromCamera(m,s),d.intersectObjects(X,!0).find(Z=>Z.object.visible)}function N(F){if(F.button===0&&(E={x:F.clientX,y:F.clientY,id:F.pointerId},!w.placing&&w.markers)){let X=O(F,[l]);X&&(E=null,F.stopImmediatePropagation(),F.preventDefault(),o.onSelect?.(X.object.userData.pointId))}}function z(F){if(!E||F.pointerId!==E.id)return;let X=E;if(E=null,!w.placing||Math.hypot(F.clientX-X.x,F.clientY-X.y)>6)return;if(b.points.length>=Dn&&!w.reposition){o.onMessage?.("\u6700\u591A\u6DFB\u52A0 "+Dn+" \u4E2A\u70B9\uFF0C\u8BF7\u5148\u5220\u9664\u4E0D\u9700\u8981\u7684\u70B9\u3002");return}let j=O(F,[e]);if(!j||!j.face){o.onMessage?.("\u8BF7\u70B9\u51FB\u5EFA\u7B51\u8868\u9762\uFF0C\u4E0D\u80FD\u5728\u5929\u7A7A\u6216\u7A7A\u767D\u5904\u5E03\u70B9\u3002");return}let Z=j.face.normal.clone().applyMatrix3(new De().getNormalMatrix(j.object.matrixWorld)).normalize();Z.dot(d.ray.direction)>0&&Z.negate(),o.onPick?.(j.point.toArray(),Z.toArray(),w.reposition)}function B(F){F.key==="Escape"&&w.placing&&(w.placing=!1,r.classList.remove("manual-placement-active"),o.onStop?.())}r.addEventListener("pointerdown",N,!0),r.addEventListener("pointerup",z,!0);let q=()=>E=null;return r.addEventListener("pointercancel",q),window.addEventListener("keydown",B),{root:a,lights:c,markers:l,configure:x,setEditor:D,updateMarkers:I,get stats(){return{points:b.points.length,active:[...c.values()].filter(F=>F.visible).length,shadowLights:[...c.values()].filter(F=>F.castShadow).length}},dispose(){if(!C){C=!0,r.removeEventListener("pointerdown",N,!0),r.removeEventListener("pointerup",z,!0),r.removeEventListener("pointercancel",q),window.removeEventListener("keydown",B),r.classList.remove("manual-placement-active");for(let F of c.values())F.dispose();for(let[F,X]of h)Object.assign(F,X);n.shadowMap.enabled=f,n.shadowMap.type=S,n.shadowMap.needsUpdate=!0,g.dispose(),_.dispose(),p.dispose(),i.remove(a),a.clear(),c.clear(),u.clear()}}}}function Er(i){if(typeof i!="string")return null;let e=i.trim();if(/^#[0-9a-f]{6}$/i.test(e))return e.toLowerCase();if(/^#[0-9a-f]{3}$/i.test(e))return"#"+[...e.slice(1)].map(s=>s+s).join("").toLowerCase();let t=/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(e);if(!t)return null;let n=t.slice(1).map(Number);return n.some(s=>s>255)?null:"#"+n.map(s=>s.toString(16).padStart(2,"0")).join("")}function tp(i,e,t,n,s=()=>({})){let r=document.createElement("details");r.className="manual-spill-panel",r.open=!0,r.innerHTML='<summary>\u624B\u52A8\u5916\u6EA2\u70B9\u4F4D <span>4 \u79CD\u9884\u8BBE \xB7 \u542B\u7A97\u6237\u5916\u6EA2</span></summary><p class="control-help">\u5728\u5EFA\u7B51\u8868\u9762\u653E\u7F6E\u771F\u6B63\u7684\u67D4\u5149\u5C04\u706F\u3002\u6BCF\u4E2A\u70B9\u72EC\u7ACB\u8C03\u8282\uFF0C\u4E0D\u6539\u539F\u6709\u6750\u8D28\u548C\u706F\u6548\uFF1B\u6700\u591A 8 \u70B9\uFF0C\u6700\u591A 2 \u70B9\u540C\u65F6\u6295\u5F71\u3002</p><label class="manual-switch" for="manual-enabled">\u624B\u52A8\u5916\u6EA2\u603B\u5F00\u5173<input id="manual-enabled" type="checkbox" role="switch"></label><div class="manual-presets" role="group" aria-label="\u56DB\u79CD\u624B\u52A8\u5916\u6EA2\u9884\u8BBE"></div><div class="manual-actions"><button id="manual-place" type="button" aria-pressed="false">\uFF0B \u5728\u5EFA\u7B51\u4E0A\u6DFB\u52A0\u70B9\u4F4D</button><button id="manual-stop" type="button">\u7ED3\u675F\u5E03\u70B9</button></div><p class="control-help" id="manual-hint" role="status" aria-live="polite"></p><label for="manual-point">\u5F53\u524D\u70B9\u4F4D <output id="manual-count">0 / 8</output></label><select id="manual-point" aria-label="\u9009\u62E9\u5916\u6EA2\u70B9\u4F4D"></select><div class="manual-actions"><button id="manual-move" type="button">\u91CD\u65B0\u70B9\u9009\u4F4D\u7F6E</button><button id="manual-focus" type="button">\u8FD1\u770B\u6B64\u70B9</button><button id="manual-duplicate" type="button">\u590D\u5236\u6B64\u70B9</button><button id="manual-delete" type="button">\u5220\u9664\u6B64\u70B9</button></div><label class="manual-switch" for="manual-markers">\u663E\u793A\u7F16\u8F91\u6807\u8BB0<input id="manual-markers" type="checkbox" checked></label><fieldset id="manual-point-fields"><label for="manual-name">\u70B9\u4F4D\u540D\u79F0</label><input id="manual-name" type="text" maxlength="40"><label class="manual-switch" for="manual-point-enabled">\u6B64\u70B9\u5F00\u542F<input id="manual-point-enabled" type="checkbox"></label><div class="manual-ranges"></div><label for="manual-color">\u6B64\u70B9\u5149\u8272\uFF08HEX / RGB\uFF09</label><div class="color-inputs"><input type="color" id="manual-color" aria-label="\u70B9\u4F4D\u5149\u8272"><input type="text" id="manual-color-code" maxlength="40" placeholder="#e3a659 / rgb(227,166,89)" aria-label="\u70B9\u4F4D\u5149\u8272 HEX / RGB"></div><label class="manual-switch" for="manual-shadows">\u906E\u6321\u9634\u5F71\uFF08\u6700\u591A 2 \u70B9\uFF09<input type="checkbox" id="manual-shadows"></label><details class="manual-position"><summary>\u7CBE\u786E\u8C03\u6574\u4F4D\u7F6E \xB7 \u573A\u666F\u5750\u6807</summary><div class="manual-coordinates"></div><p class="control-help">\u4FEE\u6539 X / Y / Z \u53EF\u5FAE\u8C03\u6302\u70B9\uFF1B\u82E5\u79FB\u5230\u53E6\u4E00\u9762\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u201C\u91CD\u65B0\u70B9\u9009\u4F4D\u7F6E\u201D\u540C\u65F6\u66F4\u65B0\u8868\u9762\u671D\u5411\u3002</p></details></fieldset><div class="manual-save"><label for="manual-scheme-name">\u53E6\u5B58\u5916\u6EA2\u65B9\u6848</label><input id="manual-scheme-name" type="text" maxlength="40" placeholder="\u4F8B\u5982\uFF1A\u9A6C\u5934\u5899 \xB7 \u6A90\u4E0B\u6696\u91D1"><button type="button" id="manual-save">\u53E6\u5B58\u4E3A\u65B0\u5916\u6EA2\u65B9\u6848</button><p class="control-help">\u5305\u542B\u624B\u52A8\u70B9\u4F4D\u3001\u7A97\u6237\u7167\u660E\u53CA\u5404\u533A\u57DF\u5916\u6EA2\u7684\u53C2\u6570\u4E0E\u5F00\u5173\u3002\u4EC5\u4FDD\u5B58\u5728\u5F53\u524D\u6D4F\u89C8\u5668\uFF0C\u6309\u5EFA\u7B51\u5206\u5F00\uFF1B\u539F\u6709\u5EFA\u7B51\u6750\u8D28\u548C\u5176\u4ED6\u706F\u6548\u4E0D\u53D8\u3002</p><div id="manual-library"></div></div>',i.replaceChildren(r);let o=y=>r.querySelector("#"+y),a=new Map,l=[],c=Pt(),u="",h=!1,d=!0,m=!1,g=!1,_=!0,p=()=>c.points.find(y=>y.id===c.selectedId),f=y=>o("manual-hint").textContent=y;function S(y){let x=p();x&&e({...c,points:c.points.map(I=>I.id===x.id?ko({...I,...y}):I)})}function b(){t({placing:m,reposition:g,markers:_}),o("manual-place").setAttribute("aria-pressed",String(m&&!g)),o("manual-stop").disabled=!m,o("manual-move").setAttribute("aria-pressed",String(m&&g))}function v(){m=!1,g=!1,b(),f("\u5DF2\u7ED3\u675F\u5E03\u70B9\uFF1B\u62D6\u52A8\u53EF\u7EE7\u7EED\u73AF\u7ED5\uFF0C\u70B9\u6807\u8BB0\u53EF\u9009\u4E2D\u3002")}for(let y of Os){let x=document.createElement("button");x.type="button",x.dataset.manualPreset=y.id,x.textContent=y.name,x.title=y.description,x.addEventListener("click",()=>{let I=p();e({...c,preset:y.id,points:I?c.points.map(D=>D.id===I.id?_c(D,y.id):D):c.points}),f(I?"\u5DF2\u5C06\u9884\u8BBE\u5E94\u7528\u5230\u9009\u4E2D\u70B9\u4F4D\uFF0C\u5176\u4ED6\u70B9\u4E0D\u53D8\u3002":"\u5DF2\u9009\u62E9\u65B0\u589E\u70B9\u4F4D\u9884\u8BBE\uFF0C\u8BF7\u5728\u5EFA\u7B51\u4E0A\u6DFB\u52A0\u70B9\u4F4D\u3002")}),r.querySelector(".manual-presets").append(x),l.push(x)}for(let[y,x,I,D,O,N]of gc){let z=document.createElement("div");z.className="spill-control",z.innerHTML=`<label for="manual-${y}"><span>${x}</span><output></output></label><div class="control-inputs"><input id="manual-${y}" type="range" min="${I}" max="${D}" step="${O}"><input type="number" min="${I}" max="${D}" step="${O}" aria-label="${x}\u6570\u503C"></div>`,r.querySelector(".manual-ranges").append(z);let[B,q]=z.querySelectorAll("input"),F=z.querySelector("output");for(let X of[B,q])X.addEventListener(X===B?"input":"change",()=>{X.value!==""&&Number.isFinite(X.valueAsNumber)&&S({[y]:Math.min(D,Math.max(I,X.valueAsNumber))})});a.set(y,{slider:B,number:q,output:F,unit:N})}for(let[y,x]of["X","Y","Z"].entries()){let I=document.createElement("label");I.textContent=x;let D=document.createElement("input");D.type="number",D.step=".01",D.min=-1e5,D.max=1e5,D.id="manual-pos-"+x.toLowerCase(),D.setAttribute("aria-label","\u70B9\u4F4D "+x+" \u5750\u6807"),I.append(D),r.querySelector(".manual-coordinates").append(I),D.addEventListener("change",()=>{let O=p();if(!O||!Number.isFinite(D.valueAsNumber))return;let N=[...O.position];N[y]=D.valueAsNumber,S({position:N})})}o("manual-enabled").addEventListener("change",()=>e({...c,enabled:o("manual-enabled").checked})),o("manual-place").addEventListener("click",()=>{m=!m,g=!1,b(),f(m?"\u5E03\u70B9\u4E2D\uFF1A\u70B9\u51FB\u5EFA\u7B51\u8868\u9762\u6DFB\u52A0\u67D4\u5149\uFF0C\u62D6\u52A8\u4ECD\u53EF\u73AF\u7ED5\uFF1BEsc \u6216\u201C\u7ED3\u675F\u5E03\u70B9\u201D\u9000\u51FA\u3002":"\u5E03\u70B9\u5DF2\u6682\u505C\u3002")}),o("manual-stop").addEventListener("click",v),o("manual-move").addEventListener("click",()=>{m=!0,g=!0,b(),f("\u8BF7\u70B9\u51FB\u65B0\u7684\u5EFA\u7B51\u8868\u9762\uFF0C\u91CD\u65B0\u5B9A\u4F4D\u9009\u4E2D\u70B9\u4F4D\uFF1B\u53C2\u6570\u4E0D\u53D8\u3002")}),o("manual-point").addEventListener("change",()=>e({...c,selectedId:o("manual-point").value})),o("manual-name").addEventListener("change",()=>S({name:o("manual-name").value})),o("manual-point-enabled").addEventListener("change",()=>S({enabled:o("manual-point-enabled").checked})),o("manual-shadows").addEventListener("change",()=>{S({shadows:o("manual-shadows").checked}),f("\u6309\u70B9\u4F4D\u987A\u5E8F\u6700\u591A\u542F\u7528\u4E24\u76CF\u9634\u5F71\u706F\uFF1B\u53EF\u5173\u95ED\u5176\u4ED6\u70B9\u7684\u9634\u5F71\u4EE5\u91CA\u653E\u540D\u989D\u3002")}),o("manual-markers").addEventListener("change",()=>{_=o("manual-markers").checked,b()}),o("manual-delete").addEventListener("click",()=>{let y=p();y&&e({...c,points:c.points.filter(x=>x.id!==y.id),selectedId:null})}),o("manual-duplicate").addEventListener("click",()=>{let y=p();if(!y||c.points.length>=Dn)return;let x={...y,id:crypto.randomUUID(),name:y.name+" \xB7 \u526F\u672C",position:[y.position[0]+.08,y.position[1],y.position[2]]};e({...c,points:[...c.points,x],selectedId:x.id}),f("\u5DF2\u590D\u5236\u6B64\u70B9\uFF1B\u53EF\u201C\u91CD\u65B0\u70B9\u9009\u4F4D\u7F6E\u201D\u79FB\u52A8\u526F\u672C\u3002")}),o("manual-focus").addEventListener("click",()=>{let y=p();y&&n(y)}),o("manual-color").addEventListener("input",()=>S({color:o("manual-color").value}));let w=o("manual-color-code");function E(){let y=Er(w.value);w.setCustomValidity(y?"":"\u8BF7\u8F93\u5165 #RRGGBB \u6216 rgb(0, 0, 0)"),w.setAttribute("aria-invalid",String(!y)),y&&S({color:y})}w.addEventListener("change",E),w.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),E())});function C(){let y=o("manual-library");y.replaceChildren();for(let x of Ho(u)){let I=document.createElement("div");I.className="saved-row";let D=document.createElement("button"),O=document.createElement("button");D.type=O.type="button",D.textContent=x.label,D.dataset.manualSaved=x.key,D.title=x.state.points.length+" \u4E2A\u70B9\u4F4D"+(x.surfaceSpill?" \xB7 \u542B\u7A97\u6237\u53CA\u5404\u533A\u57DF\u5916\u6EA2":" \xB7 \u65E7\u7248\u70B9\u4F4D\u65B9\u6848"),D.addEventListener("click",()=>{v(),e(x.state,x),f(x.surfaceSpill?"\u5DF2\u6062\u590D\u201C"+x.label+"\u201D\u7684\u70B9\u4F4D\u3001\u7A97\u6237\u7167\u660E\u3001\u5404\u533A\u57DF\u5916\u6EA2\u53C2\u6570\u4E0E\u5F00\u5173\uFF0C\u5176\u4ED6\u5EFA\u7B51\u706F\u6548\u4E0D\u53D8\u3002":"\u5DF2\u6062\u590D\u65E7\u65B9\u6848\u201C"+x.label+"\u201D\u7684\u624B\u52A8\u70B9\u4F4D\uFF1B\u65E7\u65B9\u6848\u672A\u8BB0\u5F55\u7A97\u6237\u53CA\u533A\u57DF\u5916\u6EA2\uFF0C\u4FDD\u7559\u5F53\u524D\u8BBE\u7F6E\u3002")}),O.textContent="\u5220\u9664",O.setAttribute("aria-label","\u5220\u9664\u70B9\u4F4D\u65B9\u6848 "+x.label),O.addEventListener("click",()=>{xc(u,Ho(u).filter(N=>N.key!==x.key))?C():f("\u5220\u9664\u5931\u8D25\uFF1A\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528\u3002")}),I.append(D,O),y.append(I)}}function L(){let y=Ho(u);if(y.length>=30){f("\u672C\u5EFA\u7B51\u5DF2\u4FDD\u5B58 30 \u5957\u70B9\u4F4D\u65B9\u6848\uFF0C\u8BF7\u5148\u5220\u9664\u4E0D\u9700\u8981\u7684\u65B9\u6848\u3002");return}let x=o("manual-scheme-name").value.trim()||"\u5916\u6EA2\u70B9\u4F4D \xB7 "+new Date().toLocaleTimeString("zh-CN",{hour12:!1});xc(u,[...y,{key:crypto.randomUUID(),label:x,state:c,...s()}])?(C(),o("manual-scheme-name").value="",f("\u5DF2\u53E6\u5B58\u201C"+x+"\u201D\uFF0C\u5305\u542B "+c.points.length+" \u4E2A\u70B9\u4F4D\u53CA\u7A97\u6237\u7167\u660E\u3001\u5404\u533A\u57DF\u5916\u6EA2\u53C2\u6570\u4E0E\u5F00\u5173\uFF0C\u672A\u8986\u76D6\u5DF2\u6709\u65B9\u6848\u3002")):f("\u4FDD\u5B58\u5931\u8D25\uFF1A\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528\uFF0C\u5F53\u524D\u9884\u89C8\u4ECD\u53EF\u4F7F\u7528\u3002")}return o("manual-save").addEventListener("click",L),o("manual-scheme-name").addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),L())}),{stop:v,tell:f,get editing(){return{placing:m,reposition:g,markers:_}},sync(y,x,I,D){c=Pt(y),h=x,d=I,u!==D&&(u=D,m=!1,g=!1,C(),f("\u5148\u9009\u9884\u8BBE\uFF0C\u518D\u70B9\u201C\u6DFB\u52A0\u70B9\u4F4D\u201D\uFF0C\u7136\u540E\u70B9\u51FB\u5EFA\u7B51\u6A90\u53E3\u6216\u5899\u9762\u3002")),b();let O=p();o("manual-enabled").checked=c.enabled,o("manual-enabled").disabled=!x,o("manual-save").disabled=!x;for(let z of l)z.disabled=!x;o("manual-count").textContent=c.points.length+" / "+Dn;let N=o("manual-point");if(N.replaceChildren(),!c.points.length){let z=new Option("\u6682\u65E0\u70B9\u4F4D \xB7 \u8BF7\u70B9\u51FB\u5EFA\u7B51\u6DFB\u52A0","");N.append(z)}for(let z of c.points)N.append(new Option(z.name+(z.enabled?"":"\uFF08\u5173\u95ED\uFF09"),z.id));N.value=c.selectedId??"",o("manual-point-fields").disabled=!O||!x;for(let z of["manual-move","manual-focus","manual-delete"])o(z).disabled=!O||!x;o("manual-duplicate").disabled=!O||!x||c.points.length>=Dn,o("manual-place").disabled=!x||c.points.length>=Dn,N.disabled=!O;for(let z of l)z.setAttribute("aria-pressed",String(z.dataset.manualPreset===(O?.preset??c.preset)));if(O){o("manual-name").value=O.name,o("manual-point-enabled").checked=O.enabled,o("manual-shadows").checked=O.shadows;for(let[z,{slider:B,number:q,output:F,unit:X}]of a)B.value=O[z],q.value=O[z],F.textContent=Number(O[z]).toFixed(["angle","azimuth","elevation"].includes(z)?0:2)+(X?" "+X:"");for(let[z,B]of["x","y","z"].entries())o("manual-pos-"+B).value=Number(O.position[z].toFixed(4));o("manual-color").value=O.color,document.activeElement!==w&&(w.value=O.color,w.removeAttribute("aria-invalid"),w.setCustomValidity(""))}d?!c.enabled&&c.points.length&&f("\u624B\u52A8\u5916\u6EA2\u603B\u5F00\u5173\u5173\u95ED\uFF1B\u70B9\u4F4D\u548C\u53C2\u6570\u4ECD\u4FDD\u7559\u3002"):f("\u5EFA\u7B51\u603B\u706F\u5173\u95ED\uFF0C\u624B\u52A8\u5916\u6EA2\u6682\u4E0D\u663E\u793A\u3002")}}}function np(i,e,t,{prefix:n="ss-"+e,name:s=es[e]}={}){let r=document.createElement("details");r.className="surface-spill-panel",r.dataset.surfaceZone=e,r.innerHTML=`<summary>${s} \xB7 \u73AF\u5883\u5916\u6EA2 <span data-badge>\u5173\u95ED</span></summary><p class="control-help">${e==="window"?"\u9010\u7A97\u5747\u5300\u5E03\u70B9\uFF0C\u6309\u5F53\u524D\u7A97\u6237\u5206\u7EC4\u5411\u5916\u6295\u5149\uFF1B\u4E0E\u5176\u4ED6\u5206\u7EC4\u5206\u522B\u63A7\u5236\u3002":"\u6CBF\u672C\u533A\u57DF\u5747\u5300\u5E03\u70B9\u5411\u5916\u6295\u5149\u3002"}\u5149\u8272\u8DDF\u968F\u672C\u533A\u57DF\uFF0C\u4E0E\u753B\u9762\u5149\u6655\u5206\u5F00\u8C03\u8282\u3002</p><label class="window-switch" for="${n}-enabled">\u542F\u7528${s}\u5916\u6EA2<input type="checkbox" role="switch" id="${n}-enabled"></label><div data-controls></div><label class="window-switch" for="${n}-shadows">\u5EFA\u7B51\u906E\u6321\u9634\u5F71<input type="checkbox" id="${n}-shadows"></label><button type="button" data-reset>\u91CD\u7F6E\u672C\u533A\u57DF\u5916\u6EA2</button><p class="control-help" data-status></p>`,i.append(r);let o=[];for(let[a,l,c,u,h,d]of uc){let m=document.createElement("div");m.className="spill-control",m.innerHTML=`<label for="${n}-${a}">${l}<output></output></label><div class="control-inputs"><input type="range" id="${n}-${a}" min="${c}" max="${u}" step="${h}"><input type="number" id="${n}-${a}-number" min="${c}" max="${u}" step="${h}" aria-label="${s}${l}\u6570\u503C"></div>`,r.querySelector("[data-controls]").append(m);let g=m.querySelector("[type=range]"),_=m.querySelector("[type=number]"),p=f=>{Number.isFinite(f.target.valueAsNumber)&&t({[a]:f.target.valueAsNumber})};g.addEventListener("input",p),_.addEventListener("change",p),o.push({key:a,range:g,number:_,unit:d,output:m.querySelector("output")})}for(let a of["enabled","shadows"])r.querySelector("#"+n+"-"+a).addEventListener("change",l=>t({[a]:l.target.checked}));return r.querySelector("[data-reset]").addEventListener("click",()=>t({...cc})),{sync(a,l,c,u,h=0){for(let d of o)d.range.value=d.number.value=a[d.key],d.output.textContent=a[d.key]+d.unit;for(let d of["enabled","shadows"])r.querySelector("#"+n+"-"+d).checked=a[d];r.querySelector("#"+n+"-enabled").disabled=!l,r.querySelector("[data-badge]").textContent=a.enabled?"\u5DF2\u542F\u7528":"\u5173\u95ED",r.querySelector("[data-status]").textContent=l?c?a.enabled?!u||a.intensity===0?"\u672C\u533A\u57DF\u5149\u6E90\u6216\u5916\u6EA2\u5F3A\u5EA6\u4E3A\u96F6\uFF0C\u5916\u6EA2\u6682\u505C\u3002":e==="window"?`\u9010\u7A97\u5916\u6EA2 \xB7 \u5DF2\u8986\u76D6 ${h} \u4E2A\u7A97\u683C\u4F4D\u7F6E \xB7 \u968F\u5B8C\u6574\u65B9\u6848\u53E6\u5B58\u3002`:`\u5747\u5300\u6295\u5149 \xB7 ${h} \u4E2A\u5916\u6EA2\u4F4D\u7F6E \xB7 \u8DDF\u968F\u672C\u533A\u57DF\u5149\u8272\u3002`:"\u5916\u6EA2\u5173\u95ED\uFF0C\u4FDD\u7559\u539F\u65B9\u6848\u6548\u679C\u3002":"\u5EFA\u7B51\u603B\u706F\u5DF2\u5173\u95ED\u3002":"\u6B64\u5EFA\u7B51\u6CA1\u6709\u53EF\u8BC6\u522B\u7684"+s+"\u6295\u5149\u9762\uFF0C\u8BBE\u7F6E\u4ECD\u4FDD\u7559\u3002"}}}function Rv(i){if(!i?.data)return[{u0:0,u1:1,v0:0,v1:1}];let{data:e,width:t,height:n}=i,s=e.length/(t*n),r=new Float32Array(t);for(let c=0;c<n;c++)for(let u=0;u<t;u++)r[u]+=e[(c*t+u)*s]/255;let o=Math.max(...r)*.1,a=Array.from(r,c=>c>o);for(let c=0;c<t;){if(a[c]){c++;continue}let u=c;for(;c<t&&!a[c];)c++;if(u>0&&c<t&&c-u<t*.06)for(let h=u;h<c;h++)a[h]=!0}let l=[];for(let c=0;c<t;){if(!a[c]){c++;continue}let u=c;for(;c<t&&a[c];)c++;if(c-u<t*.06)continue;let h=n,d=0;for(let m=0;m<n;m++){let g=0;for(let _=u;_<c;_++)e[(m*t+_)*s]>40&&g++;g>(c-u)*.08&&(h=Math.min(h,m),d=Math.max(d,m))}d>=h&&l.push({u0:u/t,u1:c/t,v0:h/n,v1:(d+1)/n})}return l.length?l:[{u0:0,u1:1,v0:0,v1:1}]}function Cv(i){if(i?.image?.data)return i.image;if(typeof document>"u"||!i?.image)return null;let e=document.createElement("canvas");e.width=i.image.width,e.height=i.image.height;let t=e.getContext("2d",{willReadFrequently:!0});return t.drawImage(i.image,0,0),t.getImageData(0,0,e.width,e.height)}function Nl(i,e,t,n){let s=[];for(let r=0;r<i.length;r++){let o=i[r],a=i[(r+1)%i.length],l=n?o[e]>=t:o[e]<=t,c=n?a[e]>=t:a[e]<=t;if(l&&s.push(o),l!==c){let u=(t-o[e])/(a[e]-o[e]);s.push({u:o.u+(a.u-o.u)*u,v:o.v+(a.v-o.v)*u,p:o.p.clone().lerp(a.p,u)})}}return s}function ip(i,e,t=new Map,n=()=>!0){i.updateMatrixWorld(!0);let s=new Map,r=new Map;for(let[o,a]of t){let l;try{l=Cv(a)}catch{}let c=Rv(l);if(a.flipY)for(let u of c)[u.v0,u.v1]=[1-u.v1,1-u.v0];s.set(o,c)}return i.traverse(o=>{if(!o.isMesh)return;let a=o.geometry,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.normal,h=a.index;if(!l)return;let d=Array.isArray(o.material)?o.material:[o.material],m=new De().getNormalMatrix(o.matrixWorld);for(let g of a.groups.length?a.groups:[{start:0,count:h?.count??l.count,materialIndex:0}]){let _=d[g.materialIndex||0],p=e.rules.find(f=>f.node===o.name&&f.material===_?.name&&f.role==="window");if(p)for(let f=g.start;f<Math.min(g.start+g.count,h?.count??l.count)-2;f+=3){let S=[0,1,2].map(x=>h?h.getX(f+x):f+x),b=S.map(x=>new A().fromBufferAttribute(l,x).applyMatrix4(o.matrixWorld)),v=b[1].clone().sub(b[0]).cross(b[2].clone().sub(b[0])).normalize();if(u&&v.dot(new A().fromBufferAttribute(u,S[0]).applyMatrix3(m))<0&&v.negate(),Math.abs(v.y)>.55)continue;let w=b.map((x,I)=>({p:x,u:c?c.getX(S[I]):[0,1,0][I],v:c?c.getY(S[I]):[0,0,1][I]})),E=Math.floor(Math.min(...w.map(x=>x.u))),C=Math.ceil(Math.max(...w.map(x=>x.u))),L=Math.floor(Math.min(...w.map(x=>x.v))),y=Math.ceil(Math.max(...w.map(x=>x.v)));for(let x=E;x<C;x++)for(let I=L;I<y;I++)for(let[D,O]of(s.get(p.material)||[{u0:0,u1:1,v0:0,v1:1}]).entries()){let N=Nl(w,"u",x+O.u0,!0);if(N=Nl(N,"u",x+O.u1,!1),N=Nl(N,"v",I+O.v0,!0),N=Nl(N,"v",I+O.v1,!1),N.length<3)continue;let z=new A,B=0;for(let le=1;le<N.length-1;le++){let Me=N[0].p,_e=N[le].p,ze=N[le+1].p,St=_e.clone().sub(Me).cross(ze.clone().sub(Me)).length()*.5;z.addScaledVector(Me.clone().add(_e).add(ze).multiplyScalar(1/3),St),B+=St}if(B<1e-6||(z.divideScalar(B),!n(z)))continue;let[q,F,X]=w,j=F.u-q.u,Z=F.v-q.v,te=X.u-q.u,Oe=X.v-q.v,He=j*Oe-te*Z,Re=z;if(Math.abs(He)>1e-9){let le=b[1].clone().sub(b[0]),Me=b[2].clone().sub(b[0]),_e=le.clone().multiplyScalar(Oe).addScaledVector(Me,-Z).divideScalar(He),ze=Me.clone().multiplyScalar(j).addScaledVector(le,-te).divideScalar(He);Re=b[0].clone().addScaledVector(_e,x+(O.u0+O.u1)/2-q.u).addScaledVector(ze,I+(O.v0+O.v1)/2-q.v)}let Y=[o.name,...v.toArray().map(le=>Math.round(le*100)),...Re.toArray().map(le=>Math.round(le*100)),D].join(":"),J=r.get(Y);J||(J={position:new A,normal:v.clone(),weight:0,panel:Y,floor:Bo(p,e)},r.set(Y,J)),J.position.addScaledVector(z,B),J.weight+=B}}}}),[...r.values()].map(o=>({...o,position:o.position.divideScalar(o.weight)}))}var Vu=.53/1.65,Fl=Object.keys(es),Ul=.025,Es=30*Vu+.5,Iv=192;function Pv(i,e=64){if(i.length<=e)return i;let t=[i[0]],n=new Float64Array(i.length).fill(1/0);for(;t.length<e;){let s=t[t.length-1],r=-1,o=-1;for(let a=0;a<i.length;a++)n[a]=Math.min(n[a],i[a].position.distanceToSquared(s.position)),n[a]>o&&(o=n[a],r=a);if(r<0||o<1e-8)break;t.push(i[r])}return t}function Lv(i,e){let t=e.min.clone().addScalar(-Es),n=e.getSize(new A).addScalar(2*Es),s=[Math.min(48,Math.max(4,Math.ceil(n.x/.65))),Math.min(24,Math.max(4,Math.ceil(n.y/.65))),Math.min(48,Math.max(4,Math.ceil(n.z/.65)))],r=new Float32Array(s[0]*6*s[1]*s[2]*4),o=Fl.map((a,l)=>i.map((c,u)=>({s:c,i:u})).filter(c=>c.s.zoneIndex===l));for(let a=0;a<s[2];a++)for(let l=0;l<s[1];l++)for(let c=0;c<s[0];c++){let u=new A(t.x+(c+.5)/s[0]*n.x,t.y+(l+.5)/s[1]*n.y,t.z+(a+.5)/s[2]*n.z);for(let h=0;h<6;h++){let d=[];for(let{s:g,i:_}of o[h]){let p=u.distanceToSquared(g.position);d.length===4&&p>=d[3].d||(d.push({i:_,d:p}),d.sort((f,S)=>f.d-S.d),d.length>4&&d.pop())}let m=((a*s[1]+l)*(s[0]*6)+h*s[0]+c)*4;for(let g=0;g<d.length;g++)r[m+g]=d[g].i+1}}return{data:r,dims:s,min:t,size:n}}var Dv=`
varying vec3 vDsWorld;
uniform highp sampler3D dsClusters;
uniform sampler2D dsSources,dsShadows;
uniform vec3 dsMin,dsExtent;
uniform ivec3 dsGrid;
uniform float dsOn[6];
uniform float dsCount,dsAtlasColumns,dsAtlasTile;
vec3 dsCell(vec3 world,vec3 N,ivec3 cell,int zone){
 cell=clamp(cell,ivec3(0),dsGrid-1);
 vec3 sum=vec3(0.);
 vec4 indices=texelFetch(dsClusters,ivec3(cell.x+zone*dsGrid.x,cell.y,cell.z),0);
  for(int slot=0;slot<4;slot++){
   int id=int(indices[slot]) - 1;if(id<0)continue;
   vec4 source=texelFetch(dsSources,ivec2(id,0),0),colorRange=texelFetch(dsSources,ivec2(id,2),0);
   vec3 delta=world-source.xyz;float d=length(delta);if(d>=colorRange.w||d<.015)continue;
   vec3 ray=delta/d;float facing=max(0.,dot(N,-ray));if(facing<.001)continue;
   vec4 aim=texelFetch(dsSources,ivec2(id,1),0),shape=texelFetch(dsSources,ivec2(id,3),0);
   float cosine=dot(ray,aim.xyz),cone=smoothstep(aim.w,shape.x,cosine);if(cone<.001)continue;
   float visibility=1.;
   if(shape.y>.5){
    vec3 right=normalize(cross(aim.xyz,vec3(0.,1.,0.))),up=cross(right,aim.xyz);
    float forward=dot(delta,aim.xyz),tanHalf=sqrt(max(0.,1.-aim.w*aim.w))/max(.001,aim.w);
    vec2 projected=vec2(dot(delta,right),dot(delta,up))/(forward*tanHalf)*.5+.5;
    float depth=(${Es.toFixed(8)} / (${Es.toFixed(8)}-${Ul})) - (${Es.toFixed(8)}*${Ul})/((${Es.toFixed(8)}-${Ul})*forward);
    vec2 tile=vec2(mod(float(id),dsAtlasColumns),floor(float(id)/dsAtlasColumns));
    // Bias measured in world units; prevents the source facade from shadowing
    // itself while preserving roof/wall occlusion on the external receivers.
    float bias=.00015+.00015*(1.-facing);visibility=0.;
    for(int tap=0;tap<4;tap++){
     vec2 offset=vec2(float(tap%2)-.5,float(tap/2)-.5)/dsAtlasTile;
     vec2 local=clamp(projected+offset,vec2(.5/dsAtlasTile),vec2(1.-.5/dsAtlasTile));
     float stored=unpackRGBAToDepth(texture2D(dsShadows,(tile+local)/dsAtlasColumns));
     visibility+=step(depth-bias,stored)*.25;
    }
   }
   float fade=pow(max(0.,1.-pow(d/colorRange.w,4.)),2.);
   sum+=colorRange.rgb*source.w*cone*fade*facing*visibility/max(.20,d*d);
  }
 return sum;
}
vec3 dsIrradiance(vec3 world,vec3 N){
 vec3 uv=(world-dsMin)/dsExtent;
 if(any(lessThan(uv,vec3(0.)))||any(greaterThan(uv,vec3(1.))))return vec3(0.);
 vec3 grid=uv*vec3(dsGrid)-.5,f=fract(grid);ivec3 cell=ivec3(floor(grid));
 // Tetrahedral interpolation is continuous across grid cells, unlike choosing
 // a different four-light set abruptly at each cell boundary.
 ivec3 order=ivec3(0,1,2);
 if(f[order.x]<f[order.y]){int t=order.x;order.x=order.y;order.y=t;}
 if(f[order.y]<f[order.z]){int t=order.y;order.y=order.z;order.z=t;}
 if(f[order.x]<f[order.y]){int t=order.x;order.x=order.y;order.y=t;}
 ivec3 first=ivec3(0),second=ivec3(0);first[order.x]=1;second=first;second[order.y]=1;
 vec4 weights=vec4(1.-f[order.x],f[order.x]-f[order.y],f[order.y]-f[order.z],f[order.z]);
 vec3 sum=vec3(0.);
 for(int zone=0;zone<6;zone++){
  if(dsOn[zone]<.5)continue;
  sum+=dsCell(world,N,cell,zone)*weights.x;
  sum+=dsCell(world,N,cell+first,zone)*weights.y;
  sum+=dsCell(world,N,cell+second,zone)*weights.z;
  sum+=dsCell(world,N,cell+ivec3(1),zone)*weights.w;
 }
 return sum;
}
`;function sp(i,e,t,n,s){let r=[];for(let[z,B]of Fl.entries())for(let q of B==="window"?s[B]:Pv(s[B]))r.push({...q,position:q.position.clone().addScaledVector(q.normal,.065),zoneIndex:z,zone:B});let o=new xt().setFromObject(e),a=Lv(r,o),l=new Kn(a.data,a.dims[0]*6,a.dims[1],a.dims[2]);l.format=Gt,l.type=sn,l.minFilter=l.magFilter=wt,l.needsUpdate=!0;let c=new Float32Array(Math.max(1,r.length)*16),u=new ds(c,Math.max(1,r.length),4,Gt,sn);u.needsUpdate=!0;let h=Math.max(1,Math.ceil(Math.sqrt(r.length))),d=Math.min(Iv,Math.floor((n.capabilities?.maxTextureSize||4096)/h)),m=new Vt(h*d,h*d,{minFilter:wt,magFilter:wt,depthBuffer:!0});m.texture.colorSpace=Wn;let g={dsClusters:{value:l},dsSources:{value:u},dsShadows:{value:m.texture},dsMin:{value:a.min},dsExtent:{value:a.size},dsGrid:{value:new A(...a.dims)},dsOn:{value:new Float32Array(6)},dsCount:{value:r.length},dsAtlasColumns:{value:h},dsAtlasTile:{value:d}},_=new Map,p=[],f=new Lt;f.name="\u5EFA\u7B51\u5206\u533A\u73AF\u5883\u6295\u5149";let S=new hs,b=new fr({depthPacking:Al,side:pn}),v=!1,w=!1,E=!1,C=0,L=new Map,y=new Set;e.updateMatrixWorld(!0),e.traverse(z=>{if(!z.isMesh)return;let B=new ot(z.geometry,b);B.matrixAutoUpdate=!1,B.matrix.copy(z.matrixWorld),S.add(B)});function x(z){if(!z.isMesh)return;_.set(z,z.material);let B=q=>{if(!q.isMeshStandardMaterial)return q;let F=q.clone(),X=q.onBeforeCompile,j=q.customProgramCacheKey();return p.push(F),F.onBeforeCompile=Z=>{X.call(q,Z),Object.assign(Z.uniforms,g),Z.vertexShader=`varying vec3 vDsWorld;
`+Z.vertexShader,Z.vertexShader=Z.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vDsWorld=(modelMatrix*vec4(transformed,1.)).xyz;`),Z.fragmentShader=Z.fragmentShader.replace("void main() {",Dv+`
void main() {`),Z.fragmentShader=Z.fragmentShader.replace("#include <opaque_fragment>",`vec3 dsN=normalize(inverseTransformDirection(nonPerturbedNormal,viewMatrix));
outgoingLight+=dsIrradiance(vDsWorld,dsN)*diffuseColor.rgb*(1.-metalnessFactor)/3.14159265;
#include <opaque_fragment>`)},F.customProgramCacheKey=()=>j+"-distributed-spill-v2",F};z.material=Array.isArray(z.material)?z.material.map(B):B(z.material)}e.traverse(x),t&&x(t);let I=new ue,D=new bt(120,1,Ul,Es);function O(z,B,q,F=!0){if(w)return;let X=Xt(z);g.dsOn.value.fill(0);for(let j=0;j<r.length;j++){let Z=r[j],{zone:te,zoneIndex:Oe}=Z,Re=te==="window"&&X.window.floors&&Z.floor?Fr(X.window,Z.floor):X[te],Y=te==="window"&&q.floors&&Z.floor?li(q,Z.floor):q,J=F&&Re.enabled&&Re.intensity>0&&Nr(te,B,Y)>0;if(Z.active=!!J,!J){c[j*4+3]=0,y.delete(j);continue}g.dsOn.value[Oe]=1;let le=[Re.angle,Re.azimuth,Re.elevation].join(":");I.set(Zh(te,B,Y));let Me=rn.degToRad(Re.azimuth),_e=rn.degToRad(Re.elevation),ze=rn.degToRad(Re.angle/2),St=Math.cos(ze*(1-Re.softness)),P=Z.normal.clone().applyAxisAngle(new A(0,1,0),Me).multiplyScalar(Math.cos(_e));P.y=Math.sin(_e),P.normalize(),Z.direction=P,Z.angle=Re.angle,Z.shadow=Re.shadows,c.set([...Z.position.toArray(),Re.intensity*Nr(te,B,Y)*2.5],j*4),c.set([...P.toArray(),Math.cos(ze)],r.length*4+j*4),c.set([...I.toArray(),Re.distance*Vu],r.length*8+j*4),c.set([Math.max(Math.cos(ze)+1e-4,St),Re.shadows?1:0,0,0],r.length*12+j*4),Re.shadows&&L.get(j)!==le?(y.add(j),Z.signature=le):Re.shadows||y.delete(j)}u.needsUpdate=!0,v=r.some(j=>j.active),v?i.add(f):i.remove(f)}function N(){if(w||!v||!y.size&&E)return;let z=n.getRenderTarget(),B=n.getViewport(new We),q=n.getScissor(new We),F=n.getScissorTest(),X=n.getClearColor(new ue),j=n.getClearAlpha(),Z=n.autoClear,te=n.xr.enabled;n.xr.enabled=!1,n.autoClear=!1;try{n.setRenderTarget(m),n.setClearColor(16777215,1),E||(n.setScissorTest(!1),n.clear(),E=!0),n.setScissorTest(!0);for(let Oe of y){let He=r[Oe];!He.active||!He.shadow||(D.position.copy(He.position),D.lookAt(He.position.clone().add(He.direction)),D.fov=He.angle,D.updateProjectionMatrix(),n.setViewport(Oe%h*d,Math.floor(Oe/h)*d,d,d),n.setScissor(Oe%h*d,Math.floor(Oe/h)*d,d,d),n.clear(),n.render(S,D),L.set(Oe,He.signature),y.delete(Oe),C++)}}finally{n.setRenderTarget(z),n.setViewport(B),n.setScissor(q),n.setScissorTest(F),n.setClearColor(X,j),n.autoClear=Z,n.xr.enabled=te}}return{anchors:s,group:f,sources:r,uniforms:g,configure:O,updateShadows:N,get stats(){let z=r.filter(B=>B.active);return{active:v,lights:z.length,zones:z.map(B=>B.zone),available:Object.fromEntries(Fl.map(B=>[B,s[B].length])),coverage:Object.fromEntries(Fl.map(B=>[B,r.filter(q=>q.zone===B).length])),shadowPasses:C,shading:"clustered-tetrahedral-4-neighbors-per-zone"}},dispose(){if(!w){w=!0,i.remove(f);for(let[z,B]of _)z.material=B;p.forEach(z=>z.dispose()),l.dispose(),u.dispose(),m.dispose(),b.dispose(),S.clear(),y.clear()}}}}var op=[{x:[-19,-12.65],z:[-58,-27.65]},{x:[.75,9],z:[-58,-43.3]},{x:[2.08,9],z:[-41.2,-27.7]},{x:[2.8,9],z:[-27.7,-25.9]}],Wu=[{x:[-12.65,-10.5],z:[-36.65,-27.4],edges:[-12.44,-10.76]},{x:[0,2.08],z:[-37.8,-27.4],edges:[.22,1.9]}],rp=(i,e,t)=>i>=t.x[0]&&i<=t.x[1]&&e>=t.z[0]&&e<=t.z[1];function Xu(i,e){return op.some(t=>rp(i,e,t))?"unlit":Wu.some(t=>rp(i,e,t))?"eave-only":"normal"}var Ar=i=>Number(i).toFixed(5),Gu=i=>`(p.x>=${Ar(i.x[0])}&&p.x<=${Ar(i.x[1])}&&p.z>=${Ar(i.z[0])}&&p.z<=${Ar(i.z[1])})`,Ol=`
 float bsRegion(vec3 p){
  if(${op.map(Gu).join("||")})return 0.;
  if(${Wu.map(Gu).join("||")})return 1.;
  return 2.;
 }
 float bsCorridorEave(vec3 p){
  ${Wu.map(i=>`if(${Gu(i)})return 1.-smoothstep(.045,.24,min(abs(p.x-(${Ar(i.edges[0])})),abs(p.x-(${Ar(i.edges[1])}))));`).join(`
`)}
  return 0.;
 }
`;function Nv(i,e,t=new Map,n=new Map,s="matou"){let r=Object.fromEntries(Object.keys(es).map(g=>[g,new Map]));i.updateMatrixWorld(!0);let o=new Map;for(let[g,_]of n)if(!(typeof document>"u"||!_.image))try{let p=document.createElement("canvas");p.width=_.image.width,p.height=_.image.height;let f=p.getContext("2d",{willReadFrequently:!0});f.drawImage(_.image,0,0),o.set(g,{data:f.getImageData(0,0,p.width,p.height).data,w:p.width,h:p.height,flip:_.flipY})}catch{}let a=new A,l=new A,c=new A,u=new A,h=new A,d=new A;function m(g,_,p,f){let S=s==="temple"?Xu(_.x,_.z):"normal";if(S==="unlit"||S==="eave-only"&&g!=="eave")return;let b=[Math.floor(_.x/.65),Math.floor(_.y/.5),Math.floor(_.z/.65),Math.round(p.x*2),Math.round(p.z*2)].join(":"),v=r[g].get(b);v||(v={position:new A,normal:new A,weight:0},r[g].set(b,v)),v.position.addScaledVector(_,f),v.normal.addScaledVector(p,f),v.weight+=f}return i.traverse(g=>{if(!g.isMesh)return;let _=g.geometry,p=_.attributes.position,f=_.attributes.uv,S=_.index;if(!p)return;let b=Array.isArray(g.material)?g.material:[g.material],v=_.groups.length?_.groups:[{start:0,count:S?.count??p.count,materialIndex:0}],w=new De().getNormalMatrix(g.matrixWorld);for(let E of v){let C=b[E.materialIndex||0],L=e.rules.find(z=>z.node===g.name&&z.material===C?.name);if(!L)continue;let y=L.role,x=y==="roof"?"roof":y==="window"?"window":y==="sign"?"sign":y==="trim"?"trim":"facade",I=Math.min(E.count,(S?.count??p.count)-E.start),D=Math.max(1,Math.ceil(I/3/2e3)),O=o.get(L.material),N=t.get(g.name);for(let z=E.start;z<E.start+I-2;z+=3*D){let B=[0,1,2].map(X=>S?S.getX(z+X):z+X);a.fromBufferAttribute(p,B[0]).applyMatrix4(g.matrixWorld),l.fromBufferAttribute(p,B[1]).applyMatrix4(g.matrixWorld),c.fromBufferAttribute(p,B[2]).applyMatrix4(g.matrixWorld),u.subVectors(l,a).cross(d.subVectors(c,a));let q=u.length()*.5;if(q<1e-7||(u.normalize(),_.attributes.normal&&(d.fromBufferAttribute(_.attributes.normal,B[0]).applyMatrix3(w).normalize(),u.dot(d)<0&&u.negate()),x!=="roof"&&Math.abs(u.y)>.55))continue;if(O&&f){let X=0,j=0;for(let te of B)X+=f.getX(te)/3,j+=f.getY(te)/3;X=(X%1+1)%1,j=(j%1+1)%1,O.flip&&(j=1-j);let Z=(Math.min(O.h-1,Math.floor(j*O.h))*O.w+Math.min(O.w-1,Math.floor(X*O.w)))*4;if(O.data[Z]<80)continue}h.copy(a).add(l).add(c).multiplyScalar(1/3);let F=new A(u.x,0,u.z);if(F.lengthSq()<.02){let X=L.bounds?new A(...L.bounds.min).add(new A(...L.bounds.max)).multiplyScalar(.5):new xt().setFromObject(g).getCenter(new A);F.copy(h).sub(X),F.y=0}if(F.lengthSq()<.001&&F.set(0,0,1),F.normalize(),x==="roof"){u.y>.15&&m("roof",h,F,q);let X=0;if(N){let j=["x","y","z"].map((Z,te)=>Math.max(0,Math.min(N.info.size[te]-1,Math.round((h[Z]-N.info.min[te])/(N.info.max[te]-N.info.min[te])*(N.info.size[te]-1)))));X=N.texture.image.data[((j[2]*N.info.size[1]+j[1])*N.info.size[0]+j[0])*(N.info.channels??1)]/255}X>.12&&(!L.bounds||h.y<L.bounds.min[1]+(L.bounds.max[1]-L.bounds.min[1])*.8)&&m("eave",h,F,q*X)}else m(x,h,F,q)}}}),Object.fromEntries(Object.entries(r).map(([g,_])=>[g,[..._.values()].map(p=>({position:p.position.divideScalar(p.weight),normal:p.normal.normalize(),weight:p.weight}))]))}function ap(i,e,t,n,s,r,o,a){let l=Nv(e,s,r,o,a);return l.window=ip(e,s,o,c=>a!=="temple"||Xu(c.x,c.z)==="normal"),sp(i,e,t,n,l)}function qu(i,e,t,{prefix:n="wl",floor:s=null}={}){i.innerHTML='<details class="window-panel" open><summary>\u7A97\u6237\u7167\u660E <span id="wl-binding-label">\u72EC\u7ACB\u8C03\u5149</span></summary><p id="wl-binding-help" class="control-help">\u4FDD\u7559\u7A97\u683C\u7EB9\u7406\uFF0C\u5728\u5F53\u524D\u65B9\u6848\u57FA\u7840\u4E0A\u8C03\u8282\u3002\u53E6\u5B58\u65F6\u5305\u542B\u672C\u6A21\u5757\u5168\u90E8\u53C2\u6570\u3002</p><label class="window-switch" for="wl-enabled">\u542F\u7528\u7A97\u6237\u7167\u660E<input id="wl-enabled" type="checkbox" role="switch"></label><div id="wl-basic"></div><label for="wl-color">\u7A97\u6237\u5149\u8272</label><div class="color-inputs"><input id="wl-color" type="color"><input id="wl-color-code" type="text" placeholder="#RRGGBB / rgb(...)" aria-label="\u7A97\u6237\u5149\u8272 HEX / RGB"></div><button id="wl-follow-color" type="button">\u8DDF\u968F\u539F\u65B9\u6848\u5149\u8272</button><label class="window-switch" for="wl-directional">\u542F\u7528\u7A97\u5185\u5B9A\u5411\u7167\u660E<input id="wl-directional" type="checkbox" role="switch"></label><p class="control-help">\u7A97\u5185\u5149\u7A0B\u63A7\u5236\u7A97\u9762\u8870\u51CF\uFF1B\u706F\u6E90\u8DDD\u7A97\u3001\u5149\u675F\u89D2\u4E0E\u504F\u8F6C\u63A7\u5236\u7A97\u9762\u4E0A\u7684\u7167\u660E\u8303\u56F4\u3002\u8C03\u6574\u4E0B\u5217\u53C2\u6570\u4F1A\u5F00\u542F\u5B9A\u5411\u7167\u660E\u3002</p><details class="window-beam"><summary>\u7A97\u5185\u4EAE\u533A\u8303\u56F4\u4E0E\u89D2\u5EA6</summary><div id="wl-beam"></div></details><div id="wl-environment"></div><div class="spill-actions"><button type="button" id="wl-reset">\u6062\u590D\u7A97\u6237\u9ED8\u8BA4</button><button type="button" id="wl-save">\u53E6\u5B58\u5B8C\u6574\u65B9\u6848</button></div><p id="wl-state" class="control-help" role="status"></p></details>',n!=="wl"&&(i.innerHTML=i.innerHTML.replaceAll("wl-",n+"-"));let r=i.querySelector(".window-panel"),o=r.querySelector("summary");r.dataset.windowFloor=s||"first";let a=document.createElement("span");a.textContent=s==="second"?"\u4E8C\u5C42\u7A97\u6237\u7167\u660E ":"\u7A97\u6237\u7167\u660E ",o.firstChild.replaceWith(a);let l=d=>i.querySelector("#"+d.replace(/^wl-/,n+"-")),c=new Map,u=ct();for(let[d,m,g,_,p,f]of dc){let S=document.createElement("div");S.className="spill-control",S.innerHTML=`<label for="wl-${d}">${m}<output></output></label><div class="control-inputs"><input type="range" id="wl-${d}" min="${g}" max="${_}" step="${p}"><input type="number" id="wl-${d}-number" min="${g}" max="${_}" step="${p}" aria-label="${m}\u6570\u503C"></div>`,n!=="wl"&&(S.innerHTML=S.innerHTML.replaceAll("wl-",n+"-")),l(d==="brightness"?"wl-basic":"wl-beam").append(S);let b=S.querySelector("[type=range]"),v=S.querySelector("[type=number]"),w=S.querySelector("output"),E=C=>{C.target.value.trim()===""||!Number.isFinite(C.target.valueAsNumber)||e({[d]:Math.max(g,Math.min(_,C.target.valueAsNumber)),...d==="brightness"?{}:{directional:!0}})};b.addEventListener("input",E),v.addEventListener("change",E),c.set(d,{slider:b,number:v,output:w,unit:f})}for(let d of["enabled","directional"])l("wl-"+d).addEventListener("change",m=>e({[d]:m.target.checked}));l("wl-color").addEventListener("input",d=>e({color:d.target.value}));let h=()=>{let d=Er(l("wl-color-code").value);l("wl-color-code").setAttribute("aria-invalid",String(!d)),d&&e({color:d})};return l("wl-color-code").addEventListener("change",h),l("wl-color-code").addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),h())}),l("wl-follow-color").addEventListener("click",()=>e({color:null})),l("wl-reset").addEventListener("click",()=>e({...hc})),l("wl-save").addEventListener("click",t),{sync(d,m,g,_=!1){a.textContent=_?s==="second"?"\u4E8C\u5C42\u7A97\u6237\u7167\u660E ":"\u4E00\u5C42\u7A97\u6237\u7167\u660E ":"\u7A97\u6237\u7167\u660E ",l("wl-binding-label").textContent=_?"\u5206\u5C42\u72EC\u7ACB\u8C03\u5149":"\u72EC\u7ACB\u8C03\u5149",l("wl-binding-help").textContent=_?"\u4EC5\u8C03\u8282\u672C\u5C42\u7A97\u6237\u7684\u5F00\u5173\u3001\u5149\u8272\u3001\u4EAE\u5EA6\u3001\u7A97\u5185\u7167\u660E\u4E0E\u73AF\u5883\u5916\u6EA2\uFF0C\u4E0D\u6539\u53D8\u53E6\u4E00\u5C42\u3002\u5B8C\u6574\u65B9\u6848\u4E0E\u5916\u6EA2\u53E6\u5B58\u5747\u5305\u542B\u4E24\u5C42\u8BBE\u7F6E\u3002":"\u4FDD\u7559\u7A97\u683C\u7EB9\u7406\uFF0C\u5728\u5F53\u524D\u65B9\u6848\u57FA\u7840\u4E0A\u8C03\u8282\u3002\u53E6\u5B58\u65F6\u5305\u542B\u672C\u6A21\u5757\u5168\u90E8\u53C2\u6570\u3002",u=ct(d);for(let[p,{slider:f,number:S,output:b,unit:v}]of c)f.value=S.value=u[p],b.textContent=u[p]+v,f.setAttribute("aria-valuetext",b.textContent);for(let p of["enabled","directional"])l("wl-"+p).checked=u[p];l("wl-color").value=u.color||m,document.activeElement!==l("wl-color-code")&&(l("wl-color-code").value=u.color||m,l("wl-color-code").removeAttribute("aria-invalid")),l("wl-state").textContent=g?u.enabled?(u.directional?"\u7A97\u5185\u5B9A\u5411\u7167\u660E":"\u539F\u65B9\u6848\u5747\u5300\u900F\u5149")+" \xB7 "+(u.color?"\u72EC\u7ACB\u7A97\u8272":"\u8DDF\u968F\u539F\u65B9\u6848\u5149\u8272")+"\u3002\u8C03\u6574\u81EA\u52A8\u4FDD\u7559\uFF1B\u70B9\u51FB\u53E6\u5B58\u53EF\u6536\u85CF\u5B8C\u6574\u65B9\u6848\u3002":"\u7A97\u6237\u7167\u660E\u5DF2\u5173\u95ED\uFF1B\u5176\u4ED6\u5EFA\u7B51\u706F\u5149\u4FDD\u6301\u539F\u6837\u3002":"\u5EFA\u7B51\u603B\u706F\u5DF2\u5173\u95ED\uFF1B\u7A97\u6237\u53C2\u6570\u5DF2\u4FDD\u7559\u3002"}}}function Yu(i,e){if(e===gu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Mr||e===Eo){let t=i.getIndex();if(t===null){let o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Mr)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var Cr=class extends ti{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new eh(t)}),this.register(function(t){return new th(t)}),this.register(function(t){return new uh(t)}),this.register(function(t){return new hh(t)}),this.register(function(t){return new dh(t)}),this.register(function(t){return new ih(t)}),this.register(function(t){return new sh(t)}),this.register(function(t){return new rh(t)}),this.register(function(t){return new oh(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new ah(t)}),this.register(function(t){return new nh(t)}),this.register(function(t){return new ch(t)}),this.register(function(t){return new lh(t)}),this.register(function(t){return new ju(t)}),this.register(function(t){return new fh(t)}),this.register(function(t){return new ph(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=bi.extractUrlBase(e);o=bi.resolveURL(c,this.path)}else o=bi.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new pr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===dp){try{o[Ze.KHR_BINARY_GLTF]=new mh(e)}catch(h){s&&s(h);return}r=JSON.parse(o[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new bh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let h=r.extensionsUsed[u],d=r.extensionsRequired||[];switch(h){case Ze.KHR_MATERIALS_UNLIT:o[h]=new Ju;break;case Ze.KHR_DRACO_MESH_COMPRESSION:o[h]=new gh(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:o[h]=new _h;break;case Ze.KHR_MESH_QUANTIZATION:o[h]=new xh;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function Fv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}var Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},ju=class{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,u=new ue(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Wt);let h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new _s(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new mo(u),c.distance=h;break;case"spot":c=new gs(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),si(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},Ju=class{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return en}extendParams(e,t,n){let s=[];e.color=new ue(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Wt),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,_t))}return Promise.all(s)}},Qu=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=s.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},eh=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new me(a,a)}return Promise.all(r)}},th=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=s.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},nh=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},ih=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new ue(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=s.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Wt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,_t)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},sh=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},rh=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new ue().setRGB(a[0],a[1],a[2],Wt),Promise.all(r)}},oh=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=s.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},ah=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new ue().setRGB(a[0],a[1],a[2],Wt),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,_t)),Promise.all(r)}},lh=class{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},ch=class{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:dn}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},uh=class{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},hh=class{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},dh=class{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},fh=class{constructor(e){this.name=Ze.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,h=s.byteStride,d=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,d,s.mode,s.filter).then(function(m){return m.buffer}):o.ready.then(function(){let m=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(m),u,h,d,s.mode,s.filter),m})})}else return null}},ph=class{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==In.TRIANGLES&&c.mode!==In.TRIANGLE_STRIP&&c.mode!==In.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,m=[];for(let g of h){let _=new Ue,p=new A,f=new Nt,S=new A(1,1,1),b=new gi(g.geometry,g.material,d);for(let v=0;v<d;v++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&f.fromBufferAttribute(l.ROTATION,v),l.SCALE&&S.fromBufferAttribute(l.SCALE,v),b.setMatrixAt(v,_.compose(p,f,S));for(let v in l)if(v==="_COLOR_0"){let w=l[v];b.instanceColor=new Ui(w.array,w.itemSize,w.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,l[v]);pt.prototype.copy.call(b,g),this.parser.assignFinalMaterial(b),m.push(b)}return u.isGroup?(u.clear(),u.add(...m),u):m[0]}))}},dp="glTF",Ro=12,lp={JSON:1313821514,BIN:5130562},mh=class{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ro),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==dp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Ro,r=new DataView(e,Ro),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===lp.JSON){let c=new Uint8Array(e,Ro+o,a);this.content=n.decode(c)}else if(l===lp.BIN){let c=Ro+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},gh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let h=yh[u]||u.toLowerCase();a[h]=o[u]}for(let u in e.attributes){let h=yh[u]||u.toLowerCase();if(o[u]!==void 0){let d=n.accessors[e.attributes[u]],m=Rr[d.componentType];c[h]=m.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,d){s.decodeDracoFile(u,function(m){for(let g in m.attributes){let _=m.attributes[g],p=l[g];p!==void 0&&(_.normalized=p)}h(m)},a,c,Wt,d)})})}},_h=class{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},xh=class{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}},zl=class extends xi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-t,h=(n-t)/u,d=h*h,m=d*h,g=e*c,_=g-c,p=-2*m+3*d,f=m-d,S=1-p,b=f-d+h;for(let v=0;v!==a;v++){let w=o[_+v+a],E=o[_+v+l]*u,C=o[g+v+a],L=o[g+v]*u;r[v]=S*w+b*E+p*C+f*L}return r}},Uv=new Nt,vh=class extends zl{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return Uv.fromArray(r).normalize().toArray(r),r}},In={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Rr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},cp={9728:wt,9729:Dt,9984:qa,9985:_r,9986:ys,9987:Gn},up={33071:cn,33648:Qs,10497:$n},$u={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},yh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Gi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Ov={CUBICSPLINE:void 0,LINEAR:cs,STEP:ls},Zu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function zv(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Hn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Mn})),i.DefaultMaterial}function As(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function si(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Bv(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):i.attributes.position;o.push(d)}if(s){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):i.attributes.normal;a.push(d)}if(r){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=h),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function kv(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Hv(i){let e,t=i.extensions&&i.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ku(t.attributes):e=i.indices+":"+Ku(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Ku(i.targets[n]);return e}function Ku(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Mh(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Vv(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Gv=new Ue,bh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Fv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new ps(this.options.manager):this.textureLoader=new go(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new pr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return As(r,a,s),si(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(bi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=$u[s.type],a=Rr[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new Rt(c,o,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=$u[s.type],c=Rr[s.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=s.byteOffset||0,m=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,_,p;if(m&&m!==h){let f=Math.floor(d/m),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+f+":"+s.count,b=t.cache.get(S);b||(_=new c(a,f*m,s.count*m/u),b=new ar(_,m/u),t.cache.add(S,b)),p=new lr(b,l,d%m/u,g)}else a===null?_=new c(s.count*l):_=new c(a,d,s.count*l),p=new Rt(_,l,g);if(s.sparse!==void 0){let f=$u.SCALAR,S=Rr[s.sparse.indices.componentType],b=s.sparse.indices.byteOffset||0,v=s.sparse.values.byteOffset||0,w=new S(o[1],b,s.sparse.count*f),E=new c(o[2],v,s.sparse.count*l);a!==null&&(p=new Rt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let C=0,L=w.length;C<L;C++){let y=w[C];if(p.setX(y,E[C*l]),l>=2&&p.setY(y,E[C*l+1]),l>=3&&p.setZ(y,E[C*l+2]),l>=4&&p.setW(y,E[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return u.magFilter=cp[d.magFilter]||Dt,u.minFilter=cp[d.minFilter]||Gn,u.wrapS=up[d.wrapS]||$n,u.wrapT=up[d.wrapT]||$n,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==wt&&u.minFilter!==Dt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let o=s.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:o.mimeType});return l=a.createObjectURL(d),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(h){return new Promise(function(d,m){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){let p=new Ht(_);p.needsUpdate=!0,d(p)}),t.load(bi.resolveURL(h,r.path),g,void 0,m)})}).then(function(h){return c===!0&&a.revokeObjectURL(l),si(h,o),h.userData.mimeType=o.mimeType||Vv(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new dr,hn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new hr,hn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Hn}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[Ze.KHR_MATERIALS_UNLIT]){let h=s[Ze.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),c.push(h.extendParams(a,r,t))}else{let h=r.pbrMetallicRoughness||{};if(a.color=new ue(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Wt),a.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",h.baseColorTexture,_t)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=pn);let u=r.alphaMode||Zu.OPAQUE;if(u===Zu.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Zu.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==en&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new me(1,1),r.normalTexture.scale!==void 0)){let h=r.normalTexture.scale;a.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&o!==en&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==en){let h=r.emissiveFactor;a.emissive=new ue().setRGB(h[0],h[1],h[2],Wt)}return r.emissiveTexture!==void 0&&o!==en&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,_t)),Promise.all(c).then(function(){let h=new o(a);return r.name&&(h.name=r.name),si(h,r),t.associations.set(h,{materials:e}),r.extensions&&As(s,h,r),h})}createUniqueName(e){let t=rt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return hp(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],u=Hv(c),h=s[u];if(h)o.push(h.promise);else{let d;c.extensions&&c.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=hp(new Ft,c,t),s[u]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?zv(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let m=0,g=u.length;m<g;m++){let _=u[m],p=o[m],f,S=c[m];if(p.mode===In.TRIANGLES||p.mode===In.TRIANGLE_STRIP||p.mode===In.TRIANGLE_FAN||p.mode===void 0)f=r.isSkinnedMesh===!0?new eo(_,S):new ot(_,S),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),p.mode===In.TRIANGLE_STRIP?f.geometry=Yu(f.geometry,Eo):p.mode===In.TRIANGLE_FAN&&(f.geometry=Yu(f.geometry,Mr));else if(p.mode===In.LINES)f=new no(_,S);else if(p.mode===In.LINE_STRIP)f=new fs(_,S);else if(p.mode===In.LINE_LOOP)f=new io(_,S);else if(p.mode===In.POINTS)f=new so(_,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(f.geometry.morphAttributes).length>0&&kv(f,r),f.name=t.createUniqueName(r.name||"mesh_"+e),si(f,r),p.extensions&&As(s,f,p),t.assignFinalMaterial(f),h.push(f)}for(let m=0,g=h.length;m<g;m++)t.associations.set(h[m],{meshes:e,primitives:m});if(h.length===1)return r.extensions&&As(s,h[0],r),h[0];let d=new Lt;r.extensions&&As(s,d,r),t.associations.set(d,{meshes:e});for(let m=0,g=h.length;m<g;m++)d.add(h[m]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new bt(rn.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Mi(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),si(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let h=o[c];if(h){a.push(h);let d=new Ue;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new to(a,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let h=0,d=s.channels.length;h<d;h++){let m=s.channels[h],g=s.samplers[m.sampler],_=m.target,p=_.node,f=s.parameters!==void 0?s.parameters[g.input]:g.input,S=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",f)),l.push(this.getDependency("accessor",S)),c.push(g),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],m=h[1],g=h[2],_=h[3],p=h[4],f=[];for(let b=0,v=d.length;b<v;b++){let w=d[b],E=m[b],C=g[b],L=_[b],y=p[b];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();let x=n._createAnimationTracks(w,E,C,L,y);if(x)for(let I=0;I<x.length;I++)f.push(x[I])}let S=new ho(r,void 0,f);return si(S,s),S})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(m){m.isSkinnedMesh&&m.bind(d,Gv)});for(let m=0,g=h.length;m<g;m++)u.add(h[m]);return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new cr:c.length>1?u=new Lt:c.length===1?u=c[0]:u=new pt,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(r.name&&(u.userData.name=r.name,u.name=o),si(u,r),r.extensions&&As(n,u,r),r.matrix!==void 0){let h=new Ue;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let h=s.associations.get(u);s.associations.set(u,{...h})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Lt;n.name&&(r.name=s.createUniqueName(n.name)),si(r,n),n.extensions&&As(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,h=l.length;u<h;u++)r.add(l[u]);let c=u=>{let h=new Map;for(let[d,m]of s.associations)(d instanceof hn||d instanceof Ht)&&h.set(d,m);return u.traverse(d=>{let m=s.associations.get(d);m!=null&&h.set(d,m)}),h};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,l=[];Gi[r.path]===Gi.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(a);let c;switch(Gi[r.path]){case Gi.weights:c=Jn;break;case Gi.rotation:c=Qn;break;case Gi.translation:case Gi.scale:c=ei;break;default:switch(n.itemSize){case 1:c=Jn;break;case 2:case 3:default:c=ei;break}break}let u=s.interpolation!==void 0?Ov[s.interpolation]:cs,h=this._getArrayFromAccessor(n);for(let d=0,m=l.length;d<m;d++){let g=new c(l[d]+"."+Gi[r.path],t.array,h,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Mh(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Qn?vh:zl;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Wv(i,e,t){let n=e.attributes,s=new xt;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new A(l[0],l[1],l[2]),new A(c[0],c[1],c[2])),a.normalized){let u=Mh(Rr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new A,l=new A;for(let c=0,u=r.length;c<u;c++){let h=r[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],m=d.min,g=d.max;if(m!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(m[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(m[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(m[2]),Math.abs(g[2]))),d.normalized){let _=Mh(Rr[d.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new un;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function hp(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(let o in n){let a=yh[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return Ye.workingColorSpace!==Wt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ye.workingColorSpace}" not supported.`),si(i,e),Wv(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?Bv(i,e.targets,t):i})}var Bl={version:1,mapUnitsPerMeter:.3212121212121212,scope:"Existing audited Ma61 waterfront buildings only",placements:[{id:"north-west-001",group:"north-west",tile:9,mount:[-40.45427,12.639085,-1.736919],rotation:0,sizeMeters:.65},{id:"north-west-002",group:"north-west",tile:9,mount:[-38.77613,12.640687,-1.696481],rotation:0,sizeMeters:.65},{id:"north-west-003",group:"north-west",tile:9,mount:[-42.1762,12.647206,-1.8077],rotation:0,sizeMeters:.65},{id:"north-west-004",group:"north-west",tile:9,mount:[-43.210322,14.277947,-2.687351],rotation:0,sizeMeters:.65,eaveAnchor:[-43.210322,14.317947,-2.807351],tier:"upper"},{id:"north-west-005",group:"north-west",tile:9,mount:[-42.075761,14.280597,-2.656176],rotation:0,sizeMeters:.65,eaveAnchor:[-42.075761,14.320597,-2.776176],tier:"upper"},{id:"north-west-006",group:"north-west",tile:9,mount:[-40.9412,14.278728,-2.6275],rotation:0,sizeMeters:.65,eaveAnchor:[-40.9412,14.318728,-2.7475],tier:"upper"},{id:"north-west-007",group:"north-west",tile:9,mount:[-39.806639,14.278332,-2.556324],rotation:0,sizeMeters:.65,eaveAnchor:[-39.806639,14.318332,-2.676324],tier:"upper"},{id:"north-west-008",group:"north-west",tile:9,mount:[-38.672078,14.280984,-2.525149],rotation:0,sizeMeters:.65,eaveAnchor:[-38.672078,14.320984,-2.645149],tier:"upper"},{id:"north-west-009",group:"north-west",tile:9,mount:[-27.740264,14.48464,-4.674146],rotation:0,sizeMeters:.65},{id:"north-west-010",group:"north-west",tile:9,mount:[-26.713039,14.486531,-4.650368],rotation:0,sizeMeters:.65},{id:"north-west-011",group:"north-west",tile:9,mount:[-25.685813,14.488421,-4.626589],rotation:0,sizeMeters:.65},{id:"north-west-012",group:"north-west",tile:9,mount:[-24.658587,14.490311,-4.602811],rotation:0,sizeMeters:.65},{id:"north-west-013",group:"north-west",tile:9,mount:[-23.631361,14.48463,-4.566532],rotation:0,sizeMeters:.65},{id:"north-west-014",group:"north-west",tile:9,mount:[-22.604136,14.48652,-4.542754],rotation:0,sizeMeters:.65},{id:"north-west-015",group:"north-west",tile:9,mount:[-21.8832,14.485843,-5.7717],rotation:0,sizeMeters:.65},{id:"north-east-001",group:"north-east",tile:10,mount:[29.792535,12.641746,-2.07268],rotation:0,sizeMeters:.65},{id:"north-east-002",group:"north-east",tile:10,mount:[31.548665,12.64208,-2.10102],rotation:0,sizeMeters:.65},{id:"north-east-003",group:"north-east",tile:10,mount:[33.992616,12.643398,-2.142309],rotation:0,sizeMeters:.65},{id:"north-east-004",group:"north-east",tile:10,mount:[13.6726,13.009086,-2.2491],rotation:0,sizeMeters:.65},{id:"north-east-005",group:"north-east",tile:10,mount:[14.7586,13.009086,-2.2491],rotation:0,sizeMeters:.65},{id:"north-east-006",group:"north-east",tile:10,mount:[15.8446,13.009087,-2.2491],rotation:0,sizeMeters:.65},{id:"north-east-007",group:"north-east",tile:10,mount:[23.838578,14.487935,-3.630372],rotation:0,sizeMeters:.65},{id:"north-east-008",group:"north-east",tile:10,mount:[24.886587,14.48666,-3.644663],rotation:0,sizeMeters:.65},{id:"north-east-009",group:"north-east",tile:10,mount:[25.934596,14.485385,-3.658954],rotation:0,sizeMeters:.65},{id:"north-east-010",group:"north-east",tile:10,mount:[26.982604,14.48411,-3.673246],rotation:0,sizeMeters:.65},{id:"north-east-011",group:"north-east",tile:10,mount:[28.030613,14.490171,-3.700037],rotation:0,sizeMeters:.65},{id:"north-east-012",group:"north-east",tile:10,mount:[29.078622,14.488896,-3.714328],rotation:0,sizeMeters:.65},{id:"north-east-end-001",group:"north-east-end",tile:10,mount:[53.6626,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"north-east-end-002",group:"north-east-end",tile:10,mount:[54.683267,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"north-east-end-003",group:"north-east-end",tile:10,mount:[55.703933,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"north-east-end-004",group:"north-east-end",tile:10,mount:[56.7246,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"north-east-end-005",group:"north-east-end",tile:10,mount:[57.745267,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"north-east-end-006",group:"north-east-end",tile:10,mount:[58.765933,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"north-east-end-007",group:"north-east-end",tile:10,mount:[59.7866,14.630636,-5.8773],rotation:0,sizeMeters:.65},{id:"south-west-001",group:"south-west",tile:5,mount:[-22.5274,14.485264,2.8794],rotation:180,sizeMeters:.65},{id:"south-west-002",group:"south-west",tile:5,mount:[-23.5494,14.485323,2.8794],rotation:180,sizeMeters:.65},{id:"south-west-003",group:"south-west",tile:5,mount:[-24.5714,14.485382,2.8794],rotation:180,sizeMeters:.65},{id:"south-west-004",group:"south-west",tile:5,mount:[-25.5934,14.485441,2.8794],rotation:180,sizeMeters:.65},{id:"south-west-005",group:"south-west",tile:5,mount:[-26.6154,14.4855,2.8794],rotation:180,sizeMeters:.65},{id:"south-west-006",group:"south-west",tile:5,mount:[-27.6374,14.485559,2.8794],rotation:180,sizeMeters:.65},{id:"south-west-007",group:"south-west",tile:5,mount:[-45.8234,14.150518,4.1659],rotation:180,sizeMeters:.65},{id:"south-west-008",group:"south-west",tile:5,mount:[-46.9874,14.148814,4.1659],rotation:180,sizeMeters:.65},{id:"south-west-009",group:"south-west",tile:5,mount:[-48.1514,14.149829,4.1659],rotation:180,sizeMeters:.65},{id:"south-west-010",group:"south-west",tile:5,mount:[-33.8374,13.591622,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-011",group:"south-west",tile:5,mount:[-34.916543,13.591621,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-012",group:"south-west",tile:5,mount:[-35.995686,13.59162,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-013",group:"south-west",tile:5,mount:[-37.074829,13.59162,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-014",group:"south-west",tile:5,mount:[-38.153971,13.591619,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-015",group:"south-west",tile:5,mount:[-39.233114,13.591618,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-016",group:"south-west",tile:5,mount:[-40.312257,13.591617,4.3084],rotation:180,sizeMeters:.65},{id:"south-west-017",group:"south-west",tile:5,mount:[-41.3914,13.591616,4.3084],rotation:180,sizeMeters:.65},{id:"south-center-001",group:"south-center",tile:6,mount:[11.8983,12.639375,2.1802],rotation:180,sizeMeters:.65},{id:"south-center-002",group:"south-center",tile:6,mount:[10.8643,12.639375,2.1802],rotation:180,sizeMeters:.65},{id:"south-center-003",group:"south-center",tile:6,mount:[9.8303,12.639375,2.1802],rotation:180,sizeMeters:.65},{id:"south-center-004",group:"south-center",tile:6,mount:[8.8363,12.996802,4.1552],rotation:180,sizeMeters:.65},{id:"south-center-005",group:"south-center",tile:6,mount:[5.9183,12.996801,4.1552],rotation:180,sizeMeters:.65},{id:"south-center-006",group:"south-center",tile:6,mount:[4.8973,12.996801,4.1552],rotation:180,sizeMeters:.65},{id:"south-center-007",group:"south-center",tile:6,mount:[2.850304,13.682543,7.731155],rotation:180,sizeMeters:.65},{id:"south-center-008",group:"south-center",tile:6,mount:[1.897802,13.683044,7.736927],rotation:180,sizeMeters:.65},{id:"south-center-009",group:"south-center",tile:6,mount:[.9453,13.680805,7.7302],rotation:180,sizeMeters:.65},{id:"south-center-010",group:"south-center",tile:6,mount:[-.007202,13.67977,7.735973],rotation:180,sizeMeters:.65},{id:"south-center-011",group:"south-center",tile:6,mount:[-.959704,13.680271,7.741745],rotation:180,sizeMeters:.65},{id:"south-center-012",group:"south-center",tile:6,mount:[3.654198,14.353566,11.459608],rotation:180,sizeMeters:.65},{id:"south-east-001",group:"south-east",tile:6,mount:[30.7803,12.561778,2.023],rotation:180,sizeMeters:.65},{id:"south-east-002",group:"south-east",tile:6,mount:[29.7463,12.561777,2.023],rotation:180,sizeMeters:.65},{id:"south-east-003",group:"south-east",tile:6,mount:[28.7123,12.561777,2.023],rotation:180,sizeMeters:.65},{id:"south-east-004",group:"south-east",tile:6,mount:[28.0243,12.560639,2.543],rotation:180,sizeMeters:.65},{id:"south-east-005",group:"south-east",tile:6,mount:[26.9643,12.560639,2.543],rotation:180,sizeMeters:.65},{id:"south-east-006",group:"south-east",tile:6,mount:[25.9043,12.560639,2.543],rotation:180,sizeMeters:.65},{id:"south-east-007",group:"south-east",tile:6,mount:[23.8903,12.560478,2.8165],rotation:180,sizeMeters:.65},{id:"south-east-008",group:"south-east",tile:6,mount:[22.8563,12.560477,2.8165],rotation:180,sizeMeters:.65},{id:"south-east-009",group:"south-east",tile:6,mount:[21.8223,12.560477,2.8165],rotation:180,sizeMeters:.65},{id:"south-east-010",group:"south-east",tile:6,mount:[19.4443,12.449338,3.1535],rotation:180,sizeMeters:.65},{id:"south-east-011",group:"south-east",tile:6,mount:[18.2543,12.449338,3.1535],rotation:180,sizeMeters:.65},{id:"south-east-012",group:"south-east",tile:6,mount:[17.0643,12.449338,3.1535],rotation:180,sizeMeters:.65},{id:"south-east-013",group:"south-east",tile:6,mount:[16.2203,12.449349,3.1535],rotation:180,sizeMeters:.65},{id:"south-east-014",group:"south-east",tile:6,mount:[15.0303,12.449349,3.1535],rotation:180,sizeMeters:.65},{id:"south-east-015",group:"south-east",tile:6,mount:[13.8403,12.449349,3.1535],rotation:180,sizeMeters:.65},{id:"south-east-shop-001",group:"south-east-shop",tile:6,mount:[42.5951,14.358182,2.2766],rotation:180,sizeMeters:.65},{id:"south-east-shop-002",group:"south-east-shop",tile:6,mount:[41.4476,14.358252,2.2766],rotation:180,sizeMeters:.65},{id:"south-east-shop-003",group:"south-east-shop",tile:6,mount:[40.3001,14.358322,2.2766],rotation:180,sizeMeters:.65},{id:"south-east-shop-004",group:"south-east-shop",tile:6,mount:[39.1526,14.358392,2.2766],rotation:180,sizeMeters:.65},{id:"south-east-shop-005",group:"south-east-shop",tile:6,mount:[38.0051,14.358462,2.2766],rotation:180,sizeMeters:.65},{id:"south-east-shop-006",group:"south-east-shop",tile:6,mount:[37.4991,13.019234,3.6671],rotation:180,sizeMeters:.65},{id:"south-east-shop-007",group:"south-east-shop",tile:6,mount:[35.2691,13.019324,3.6671],rotation:180,sizeMeters:.65},{id:"south-east-shop-008",group:"south-east-shop",tile:6,mount:[34.1541,13.019319,3.6671],rotation:180,sizeMeters:.65},{id:"south-east-shop-009",group:"south-east-shop",tile:6,mount:[33.0391,13.019315,3.6671],rotation:180,sizeMeters:.65},{id:"south-east-shop-010",group:"south-east-shop",tile:6,mount:[37.4991,14.356934,6.4231],rotation:180,sizeMeters:.65},{id:"south-east-shop-011",group:"south-east-shop",tile:6,mount:[36.3481,14.356736,6.4231],rotation:180,sizeMeters:.65},{id:"south-east-shop-012",group:"south-east-shop",tile:6,mount:[35.1971,14.356538,6.4231],rotation:180,sizeMeters:.65},{id:"south-east-pair-001",group:"south-east-pair",tile:6,mount:[58.521,12.561785,1.4559],rotation:180,sizeMeters:.65},{id:"south-east-pair-002",group:"south-east-pair",tile:6,mount:[57.487,12.561785,1.4559],rotation:180,sizeMeters:.65},{id:"south-east-pair-003",group:"south-east-pair",tile:6,mount:[56.453,12.561786,1.4559],rotation:180,sizeMeters:.65},{id:"south-east-pair-004",group:"south-east-pair",tile:6,mount:[55.765,12.560639,1.9759],rotation:180,sizeMeters:.65},{id:"south-east-pair-005",group:"south-east-pair",tile:6,mount:[54.705,12.560639,1.9759],rotation:180,sizeMeters:.65},{id:"south-east-pair-006",group:"south-east-pair",tile:6,mount:[53.645,12.560639,1.9759],rotation:180,sizeMeters:.65},{id:"south-east-pair-007",group:"south-east-pair",tile:6,mount:[51.631,12.560437,2.2494],rotation:180,sizeMeters:.65},{id:"south-east-pair-008",group:"south-east-pair",tile:6,mount:[50.597,12.560438,2.2494],rotation:180,sizeMeters:.65},{id:"south-east-pair-009",group:"south-east-pair",tile:6,mount:[49.563,12.560438,2.2494],rotation:180,sizeMeters:.65},{id:"south-east-end-001",group:"south-east-end",tile:6,mount:[61.4234,12.444893,1.5832],rotation:180,sizeMeters:.65},{id:"south-east-end-002",group:"south-east-end",tile:6,mount:[60.4214,12.444893,1.5832],rotation:180,sizeMeters:.65}],groups:[{id:"north-west",tile:9,nodes:["FuziTemple0698","FuziTemple0699","FuziTemple0700","FuziTemple0701","FuziTemple0704","FuziTemple0705","FuziTemple0706","FuziTemple0707","FuziTemple0708"],rules:[{node:"FuziTemple0698",material:"FuziTemple0058",role:"roof",bounds:{min:[-33.197,14.0797,-14.1872],max:[-20.9952,17.3287,-1.5011]}},{node:"FuziTemple0699",material:"FuziTemple0058",role:"roof",bounds:{min:[-47.1336,12.9387,-14.4603],max:[-30.5615,15.8106,-1.1829]}},{node:"FuziTemple0700",material:"FuziTemple0036",role:"roof",bounds:{min:[-47.1336,12.638,-14.4602],max:[-21.2171,17.2701,-.9383]}},{node:"FuziTemple0701",material:"FuziTemple0049",role:"facade",bounds:{min:[-46.728,11.8383,-13.9689],max:[-22.3039,13.0643,-1.3389]}},{node:"FuziTemple0704",material:"FuziTemple0054",role:"facade",bounds:{min:[-46.7426,11.8383,-14.1507],max:[-22.2578,14.4126,-1.3198]}},{node:"FuziTemple0705",material:"FuziTemple0108",role:"trim",bounds:{min:[-47.0758,13.2229,-14.4021],max:[-23.5407,17.3173,-1.0557]}},{node:"FuziTemple0706",material:"FuziTemple0109",role:"window",bounds:{min:[-45.7195,13.3056,-13.7902],max:[-38.1581,14.4126,-2.7274]}},{node:"FuziTemple0707",material:"FuziTemple0110",role:"window",bounds:{min:[-46.7001,11.8383,-13.8154],max:[-22.3326,12.7346,-1.363]}},{node:"FuziTemple0708",material:"FuziTemple0035",role:"roof",bounds:{min:[-47.1235,11.8296,-14.4501],max:[-22.158,17.1771,-.9726]}}],minX:null,softSpill:"north-west/soft-spill-v2.json"},{id:"north-east",tile:10,nodes:["FuziTemple0841","FuziTemple0842","FuziTemple0843","FuziTemple0844","FuziTemple0847","FuziTemple0855","FuziTemple0856","FuziTemple0858","FuziTemple0859","FuziTemple0865","FuziTemple0866","FuziTemple0867","FuziTemple0868"],rules:[{node:"FuziTemple0841",material:"FuziTemple0035",role:"roof",bounds:{min:[4.5636,11.2233,-13.4534],max:[40.1715,17.1771,-1.3697]}},{node:"FuziTemple0842",material:"FuziTemple0049",role:"facade",bounds:{min:[5.2024,11.2233,-13.2652],max:[40.128,13.2943,-1.7544]}},{node:"FuziTemple0843",material:"FuziTemple0054",role:"facade",bounds:{min:[9.5995,11.2233,-13.2824],max:[40.18,14.3158,-1.8046]}},{node:"FuziTemple0844",material:"FuziTemple0078",role:"window",bounds:{min:[32.1108,13.4712,-12.5793],max:[39.9421,14.1501,-12.4563]}},{node:"FuziTemple0847",material:"FuziTemple0036",role:"roof",bounds:{min:[4.3273,12.4336,-13.7949],max:[40.2178,17.2701,-1.3561]}},{node:"FuziTemple0855",material:"FuziTemple0110",role:"window",bounds:{min:[13.6567,11.2233,-10.0696],max:[36.5898,12.7321,-1.9104]}},{node:"FuziTemple0856",material:"FuziTemple0101",role:"window",bounds:{min:[9.6195,13.9462,-13.1036],max:[30.4894,15.8087,-9.4407]}},{node:"FuziTemple0858",material:"FuziTemple0088",role:"window",bounds:{min:[37.9505,12.1777,-12.5686],max:[39.9421,12.7346,-12.5374]}},{node:"FuziTemple0859",material:"FuziTemple0087",role:"window",bounds:{min:[10.1958,11.878,-12.7561],max:[37.9267,12.7761,-9.974]}},{node:"FuziTemple0865",material:"FuziTemple0058",role:"roof",bounds:{min:[4.194,12.3833,-11.5032],max:[22.6029,15.5626,-1.2726]}},{node:"FuziTemple0866",material:"FuziTemple0108",role:"trim",bounds:{min:[13.1601,13.2229,-13.4049],max:[40.1571,17.3172,-1.5532]}},{node:"FuziTemple0867",material:"FuziTemple0058",role:"roof",bounds:{min:[4.9272,12.8838,-13.5654],max:[40.2193,17.3287,-1.3398]}},{node:"FuziTemple0868",material:"FuziTemple0109",role:"window",bounds:{min:[13.6139,12.059,-12.7918],max:[36.6029,14.1501,-2.8972]}}],minX:13,softSpill:"north-east/soft-spill-v2.json"},{id:"north-east-end",tile:10,nodes:["FuziTemple0895","FuziTemple0896","FuziTemple0897","FuziTemple0898","FuziTemple0899","FuziTemple0900"],rules:[{node:"FuziTemple0895",material:"FuziTemple0118",role:"window",bounds:{min:[53.5416,11.9928,-13.7651],max:[70.984,14.4518,-9.2491]}},{node:"FuziTemple0896",material:"FuziTemple0108",role:"trim",bounds:{min:[53.3019,12.7809,-14.1829],max:[71.1621,15.5511,-5.8642]}},{node:"FuziTemple0897",material:"FuziTemple0035",role:"roof",bounds:{min:[53.2826,11.8135,-14.2312],max:[71.1762,15.411,-5.8027]}},{node:"FuziTemple0898",material:"FuziTemple0058",role:"roof",bounds:{min:[53.2415,12.7063,-14.258],max:[71.2186,15.5626,-5.7854]}},{node:"FuziTemple0899",material:"FuziTemple0036",role:"roof",bounds:{min:[53.2366,12.4411,-14.2415],max:[71.2219,15.5097,-5.7969]}},{node:"FuziTemple0900",material:"FuziTemple0049",role:"facade",bounds:{min:[61.4494,12.5854,-11.0351],max:[64.2555,12.6346,-10.9965]}}],minX:null,softSpill:"north-east-end/soft-spill-v2.json"},{id:"south-west",tile:5,nodes:["FuziTemple0902","FuziTemple0903","FuziTemple0904","FuziTemple0905","FuziTemple0910","FuziTemple0913","FuziTemple0915","FuziTemple0917"],rules:[{node:"FuziTemple0902",material:"FuziTemple0036",role:"roof",bounds:{min:[-49.5654,13.0896,2.8629],max:[-22.2856,17.2676,12.1598]}},{node:"FuziTemple0903",material:"FuziTemple0035",role:"roof",bounds:{min:[-49.5129,11.6798,3.6367],max:[-26.2727,17.1688,12.1493]}},{node:"FuziTemple0904",material:"FuziTemple0108",role:"trim",bounds:{min:[-49.4901,14.2352,3.9028],max:[-33.4208,17.3089,12.1012]}},{node:"FuziTemple0905",material:"FuziTemple0058",role:"roof",bounds:{min:[-49.5574,13.3454,2.6166],max:[-22.0709,17.3204,12.1791]}},{node:"FuziTemple0910",material:"FuziTemple0054",role:"facade",bounds:{min:[-33.4211,11.8383,3.5579],max:[-23.3569,15.1356,11.5071]}},{node:"FuziTemple0913",material:"FuziTemple0049",role:"facade",bounds:{min:[-26.2635,11.8383,3.5621],max:[-23.3604,12.1473,6.4565]}},{node:"FuziTemple0915",material:"FuziTemple0110",role:"window",bounds:{min:[-33.3473,11.8383,4.5115],max:[-23.3851,14.3581,8.4453]}},{node:"FuziTemple0917",material:"FuziTemple0118",role:"window",bounds:{min:[-41.4836,12.3648,4.4219],max:[-23.859,16.2039,10.4525]}}],minX:null,softSpill:"south-west/soft-spill-v2.json"},{id:"south-center",tile:6,nodes:["FuziTemple0934","FuziTemple0938","FuziTemple0939","FuziTemple0940","FuziTemple0941","FuziTemple0943","FuziTemple0944","FuziTemple0945","FuziTemple0946"],rules:[{node:"FuziTemple0934",material:"FuziTemple0118",role:"window",bounds:{min:[-1.2338,12.5582,7.902],max:[3.1373,13.2705,7.9218]}},{node:"FuziTemple0938",material:"FuziTemple0049",role:"facade",bounds:{min:[9.454,11.8383,2.2511],max:[12.2602,11.8875,2.2896]}},{node:"FuziTemple0939",material:"FuziTemple0110",role:"window",bounds:{min:[9.5212,11.8383,2.2749],max:[12.1928,12.638,2.2749]}},{node:"FuziTemple0940",material:"FuziTemple0054",role:"facade",bounds:{min:[9.4539,11.8383,2.2323],max:[12.2601,14.3158,9.4125]}},{node:"FuziTemple0941",material:"FuziTemple0109",role:"window",bounds:{min:[9.4876,13.3056,3.2618],max:[12.2265,14.1501,9.398]}},{node:"FuziTemple0943",material:"FuziTemple0108",role:"trim",bounds:{min:[-1.3526,13.2229,1.8968],max:[12.2737,15.7991,11.6345]}},{node:"FuziTemple0944",material:"FuziTemple0058",role:"roof",bounds:{min:[-1.4258,13.1184,1.8381],max:[12.3248,15.8106,11.7387]}},{node:"FuziTemple0945",material:"FuziTemple0036",role:"roof",bounds:{min:[-1.4377,12.638,1.8382],max:[12.3335,15.7577,11.7563]}},{node:"FuziTemple0946",material:"FuziTemple0035",role:"roof",bounds:{min:[-1.3784,11.2117,1.8478],max:[12.2878,15.6589,11.6676]}}],minX:null,softSpill:"south-center/soft-spill-v2.json"},{id:"south-east",tile:6,nodes:["FuziTemple0948","FuziTemple0949","FuziTemple0951","FuziTemple0952","FuziTemple0954","FuziTemple0955"],rules:[{node:"FuziTemple0948",material:"FuziTemple0108",role:"trim",bounds:{min:[13.2977,12.7809,1.7783],max:[31.1578,15.5511,10.097]}},{node:"FuziTemple0949",material:"FuziTemple0036",role:"roof",bounds:{min:[13.2323,12.4411,1.7198],max:[31.2176,15.5097,10.1644]}},{node:"FuziTemple0951",material:"FuziTemple0049",role:"facade",bounds:{min:[21.4451,12.5854,4.9265],max:[24.2513,12.6346,4.965]}},{node:"FuziTemple0952",material:"FuziTemple0118",role:"window",bounds:{min:[13.5374,11.9928,2.1964],max:[30.9798,14.4518,6.7124]}},{node:"FuziTemple0954",material:"FuziTemple0058",role:"roof",bounds:{min:[13.2372,12.7063,1.7032],max:[31.2143,15.5626,10.1758]}},{node:"FuziTemple0955",material:"FuziTemple0035",role:"roof",bounds:{min:[13.2783,11.8135,1.73],max:[31.1719,15.411,10.1585]}}],minX:null,softSpill:"south-east/soft-spill-v2.json"},{id:"south-east-shop",tile:6,nodes:["FuziTemple0959","FuziTemple0963","FuziTemple0966","FuziTemple0967","FuziTemple0968","FuziTemple0969","FuziTemple0970"],rules:[{node:"FuziTemple0959",material:"FuziTemple0058",role:"roof",bounds:{min:[32.5715,14.0165,2.0471],max:[43.0484,15.406,10.7438]}},{node:"FuziTemple0963",material:"FuziTemple0049",role:"facade",bounds:{min:[39.2192,11.8139,2.8979],max:[41.8675,12.1107,5.5384]}},{node:"FuziTemple0966",material:"FuziTemple0054",role:"facade",bounds:{min:[32.6901,11.8139,2.8948],max:[41.8706,14.982,10.1458]}},{node:"FuziTemple0967",material:"FuziTemple0110",role:"window",bounds:{min:[32.7571,11.8139,3.7645],max:[41.8446,14.235,7.3528]}},{node:"FuziTemple0968",material:"FuziTemple0036",role:"roof",bounds:{min:[32.5611,13.0161,2.26],max:[42.8481,15.3553,10.6253]}},{node:"FuziTemple0969",material:"FuziTemple0108",role:"trim",bounds:{min:[32.6388,14.1169,3.221],max:[32.6897,15.395,10.0545]}},{node:"FuziTemple0970",material:"FuziTemple0035",role:"roof",bounds:{min:[32.6207,11.8139,2.9659],max:[39.19,15.2603,10.1106]}}],minX:null,softSpill:"south-east-shop/soft-spill-v2.json"},{id:"south-east-pair",tile:6,nodes:["FuziTemple0972","FuziTemple0975","FuziTemple0976","FuziTemple0977","FuziTemple0978","FuziTemple0980"],rules:[{node:"FuziTemple0972",material:"FuziTemple0118",role:"window",bounds:{min:[53.4675,11.9928,2.1435],max:[55.9211,14.4518,5.168]}},{node:"FuziTemple0975",material:"FuziTemple0049",role:"facade",bounds:{min:[49.1858,12.5854,4.3594],max:[51.992,12.6346,4.3979]}},{node:"FuziTemple0976",material:"FuziTemple0058",role:"roof",bounds:{min:[47.5771,12.8375,1.1537],max:[58.9494,15.4863,9.292]}},{node:"FuziTemple0977",material:"FuziTemple0108",role:"trim",bounds:{min:[47.6356,12.849,1.2121],max:[58.8984,15.4749,9.2332]}},{node:"FuziTemple0978",material:"FuziTemple0036",role:"roof",bounds:{min:[47.577,12.4411,1.1534],max:[58.9583,15.4335,9.2916]}},{node:"FuziTemple0980",material:"FuziTemple0035",role:"roof",bounds:{min:[47.5873,11.8383,1.1637],max:[58.9126,15.3347,9.2815]}}],minX:null,softSpill:"south-east-pair/soft-spill-v2.json"},{id:"south-east-end",tile:6,nodes:["FuziTemple0983","FuziTemple0984","FuziTemple0985","FuziTemple0986","FuziTemple0987"],rules:[{node:"FuziTemple0983",material:"FuziTemple0118",role:"window",bounds:{min:[60.0292,11.9928,1.8006],max:[66.2651,14.4518,8.2851]}},{node:"FuziTemple0984",material:"FuziTemple0058",role:"roof",bounds:{min:[59.5537,12.8375,1.2809],max:[66.8992,15.4863,8.5191]}},{node:"FuziTemple0985",material:"FuziTemple0036",role:"roof",bounds:{min:[59.5534,12.4411,1.2807],max:[66.8989,15.4335,8.5278]}},{node:"FuziTemple0986",material:"FuziTemple0035",role:"roof",bounds:{min:[59.5638,11.8383,1.2907],max:[66.8888,15.3347,8.4817]}},{node:"FuziTemple0987",material:"FuziTemple0108",role:"trim",bounds:{min:[59.6122,12.849,1.3394],max:[66.8405,15.4749,8.4679]}}],minX:null,softSpill:"south-east-end/soft-spill-v2.json"}]};var kl="qinhuai.red-lantern-light.v1",Sh=Object.freeze({enabled:!0,brightness:.85,temperature:2800,spillRange:1.25,halo:.35,lightEaves:!0,lightWalls:!0});function Ir(i={}){let e={...Sh};for(let t of["enabled","lightEaves","lightWalls"])typeof i[t]=="boolean"&&(e[t]=i[t]);for(let[t,n,s]of[["brightness",0,3],["temperature",1800,6500],["spillRange",.3,3],["halo",0,1.5]]){let r=Number(i[t]);i[t]!=null&&Number.isFinite(r)&&(e[t]=Math.max(n,Math.min(s,r)))}return e}function Rs(){try{return Ir(JSON.parse(localStorage.getItem(kl)||"{}"))}catch{return{...Sh}}}function qv(i){try{return localStorage.setItem(kl,JSON.stringify(Ir(i))),!0}catch{return!1}}function fp(i){let e=i/100,t=n=>Math.max(0,Math.min(255,n))/255;return[t(e<=66?255:329.698727446*(e-60)**-.1332047592),t(e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492),t(e>=66?255:e<=19?0:138.5177312231*Math.log(e-10)-305.0447927307)]}function pp(i,e){i.innerHTML='<details class="red-lantern-panel" open><summary>\u7EA2\u706F\u7B3C\u5149\u6548 <span>\u72EC\u7ACB\u53E0\u52A0</span></summary><p class="red-help">\u4EC5\u4E34\u6C34\u9A6C\u5934\u5899\u7684\u60AC\u6302\u706F\u7B3C\uFF1B\u53C2\u6570\u540C\u6B65\u5230\u4E3B\u5730\u56FE\u3002</p><label class="red-switch" for="red-enabled">\u542F\u7528\u7EA2\u706F\u7B3C\u5149\u6548<input id="red-enabled" type="checkbox" role="switch"></label><div class="red-sliders"></div><label class="red-switch" for="red-eaves">\u7167\u4EAE\u623F\u6A90<input id="red-eaves" type="checkbox" role="switch"></label><label class="red-switch" for="red-walls">\u7167\u4EAE\u5899\u9762<input id="red-walls" type="checkbox" role="switch"></label><button type="button" id="red-reset">\u6062\u590D\u7EA2\u706F\u7B3C\u9ED8\u8BA4\u6548\u679C</button><p id="red-state" role="status" class="red-help"></p></details>';let t=new Map,n=Rs(),s=!0,r=i.querySelector("#red-state"),o=l=>{n=Ir({...n,...l});let c=qv(n);a(n,s),e(n),c||(r.textContent="\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528\uFF1B\u672C\u6B21\u8C03\u6574\u4ECD\u751F\u6548\uFF0C\u4F46\u5237\u65B0\u540E\u65E0\u6CD5\u4FDD\u7559\u3002")};for(let[l,c]of[["enabled","red-enabled"],["lightEaves","red-eaves"],["lightWalls","red-walls"]]){let u=i.querySelector("#"+c);t.set(l,u),u.addEventListener("change",()=>o({[l]:u.checked}))}for(let[l,c,u,h,d,m]of[["brightness","\u706F\u4F53\u4EAE\u5EA6",0,3,.05,"\xD7"],["temperature","\u8272\u6E29",1800,6500,100," K"],["spillRange","\u5916\u6EA2\u8303\u56F4",.3,3,.05," m"],["halo","\u5149\u6655\u5F3A\u5EA6",0,1.5,.05,"\xD7"]]){let g=document.createElement("div");g.className="red-slider",g.innerHTML=`<label for="red-${l}">${c}<output></output></label><div class="red-inputs"><input id="red-${l}" type="range" min="${u}" max="${h}" step="${d}"><input type="number" aria-label="${c}\u6570\u503C" min="${u}" max="${h}" step="${d}"></div>`;let[_,p]=g.querySelectorAll("input");t.set(l,{range:_,number:p,output:g.querySelector("output"),unit:m}),_.oninput=()=>o({[l]:_.valueAsNumber}),p.onchange=()=>{Number.isFinite(p.valueAsNumber)?o({[l]:p.valueAsNumber}):a(n,s)},i.querySelector(".red-sliders").append(g)}function a(l,c=s){n=Ir(l),s=c,i.querySelector("#red-reset").disabled=!s;for(let[u,h]of t)h.range?(h.range.value=h.number.value=n[u],h.output.textContent=(u==="temperature"?n[u]:n[u].toFixed(2))+h.unit,h.range.disabled=h.number.disabled=!s||!n.enabled):(h.checked=n[u],h.disabled=!s||u!=="enabled"&&!n.enabled);r.textContent=s?n.enabled?"\u706F\u4F53\u3001\u5149\u6655\u4E0E\u6A90\u5899\u53CD\u7167\u72EC\u7ACB\u53E0\u52A0\uFF1B\u81EA\u52A8\u4FDD\u7559\u672C\u6B21\u8BBE\u7F6E\u3002":"\u5149\u6548\u5DF2\u5173\u95ED\uFF0C\u4FDD\u7559\u7EA2\u706F\u7B3C\u5B9E\u4F53\u3002":"\u9009\u62E9\u201C\u9A6C\u5934\u5899\u6C11\u5C45\u201D\u540E\u53EF\u9884\u89C8\u548C\u8C03\u8282\u3002"}return i.querySelector("#red-reset").onclick=()=>o(Sh),a(n),{sync:a,get settings(){return{...n}}}}var Wi=Bl.mapUnitsPerMeter,Yv=i=>{let[e,t,n]=fp(i);return new ue().setRGB(e,t,n,_t)};function $v(i,e){let t=i.geometry,n=t.getAttribute("position"),s=t.getAttribute("normal"),r=t.getAttribute("uv"),o=t.index,a=new Ft,l={position:[],normal:[],uv:[]},c=[new A,new A,new A],u=new xt,h=t.groups.length?t.groups:[{start:0,count:o?o.count:n.count,materialIndex:0}];for(let d of h){let m=l.position.length/3;for(let _=d.start;_<d.start+d.count;_+=3){let p=[0,1,2].map(f=>o?o.getX(_+f):_+f);if(c.forEach((f,S)=>f.fromBufferAttribute(n,p[S]).applyMatrix4(i.matrixWorld)),u.setFromPoints(c),!!e.some(f=>u.distanceToPoint(f)<=3*Wi))for(let f of p)l.position.push(n.getX(f),n.getY(f),n.getZ(f)),l.normal.push(s?.getX(f)??0,s?.getY(f)??1,s?.getZ(f)??0),l.uv.push(r?.getX(f)??0,r?.getY(f)??0)}let g=l.position.length/3-m;g&&a.addGroup(m,g,d.materialIndex)}if(!l.position.length)return null;for(let[d,m]of[["position",3],["normal",3],["uv",2]])a.setAttribute(d,new ft(l[d],m));return a.computeBoundingSphere(),a}var Hl=class{constructor(e){this.parent=e,this.root=new Lt,this.root.name="RedLanternOverlay",e.add(this.root),this.settings=Rs(),this.tiles=new Set,this.materials=[],this.batches=[],this.receivers=[],this.groups=[],this.night=!0,this.wireframe=!1,this.disposed=!1,this.stats={lamps:0,batches:0,receivers:0}}async load(){return this.promise||(this.promise=new Cr().loadAsync(new URL("./assets/red-lantern/red-lantern-pendant.glb",location.href).href).then(e=>(this.source=e.scene,this.source.updateMatrixWorld(!0),this.source)).catch(e=>{throw this.promise=null,e})),this.promise}async registerTile(e,t,{groupId:n}={}){let s=n||String(e);if(this.tiles.has(s)||this.disposed)return;let r=Bl.groups.filter(a=>a.tile===Number(e)&&(!n||a.id===n));if(!r.length)return;let o=await this.load();if(!(this.disposed||this.tiles.has(s))){t.updateMatrixWorld(!0);for(let a of r){let l=Bl.placements.filter(p=>p.group===a.id);if(!l.length)continue;let c=new Lt;c.name="RedPendants-"+a.id,this.root.add(c),o.traverse(p=>{if(!p.isMesh)return;let f=E=>{let C=E.clone();return C.metalness=E.name==="DarkBronzeRod"?.65:0,C.roughness=.72,E.name==="RedLanternFabric"&&(C.emissiveMap=C.map,C.emissive.set("#ffffff"),C.emissiveIntensity=0,C.userData.redFabric=!0),this.materials.push(C),C},S=Array.isArray(p.material)?p.material.map(f):f(p.material),b=new gi(p.geometry,S,l.length);b.name=p.name+"-"+a.id;let v=new Ue,w=new Nt;for(let E=0;E<l.length;E++){let C=l[E];w.setFromAxisAngle(new A(0,1,0),C.rotation*Math.PI/180),v.compose(new A(...C.mount),w,new A(Wi,Wi,Wi)).multiply(p.matrixWorld),b.setMatrixAt(E,v)}b.instanceMatrix.needsUpdate=!0,b.computeBoundingSphere(),c.add(b),this.batches.push(b)});let u=l.filter(p=>p.eaveAnchor);if(u.length){let p=new ao(.009*Wi,.009*Wi,1,8),f=new Hn({color:3154971,metalness:.65,roughness:.72}),S=new gi(p,f,u.length*2);S.name="UpperEaveSupports",S.userData.ownedGeometry=!0,u.forEach((b,v)=>{let w=new A(...b.eaveAnchor).add(new A(0,-.009,0)),E=new A(...b.mount),C=E.clone().sub(w),L=new Ue().compose(w.clone().add(E).multiplyScalar(.5),new Nt().setFromUnitVectors(new A(0,1,0),C.clone().normalize()),new A(1,C.length(),1));S.setMatrixAt(v*2,L);let y=new Ue().compose(new A(...b.eaveAnchor).add(new A(0,-.0045,0)),new Nt,new A(.3,.009,.3));S.setMatrixAt(v*2+1,y)}),S.instanceMatrix.needsUpdate=!0,S.computeBoundingSphere(),c.add(S),this.batches.push(S),this.materials.push(f)}let h=l.map(p=>new A(p.mount[0],p.mount[1]-.4*Wi,p.mount[2])),d=this.createHalo(h);c.add(d);let m={power:{value:0},tint:{value:new ue},reach:{value:1},eaves:{value:1},walls:{value:1},minX:{value:a.minX??-1e8},lamps:{value:h}},g=new Set(a.nodes),_=[];t.traverse(p=>{p.isMesh&&g.has(p.name)&&_.push(p)});for(let p of _){let f=$v(p,h);if(!f)continue;let b=(Array.isArray(p.material)?p.material:[p.material]).map(w=>new vt({uniforms:{...m,paint:{value:w.map||null},hasPaint:{value:w.map?1:0},baseColor:{value:w.color?.clone()||new ue("#ffffff")}},vertexShader:"varying vec3 wPos;varying vec3 wNormal;varying vec2 texUv;void main(){vec4 world=modelMatrix*vec4(position,1.);wPos=world.xyz;wNormal=normalize(mat3(modelMatrix)*normal);texUv=uv;gl_Position=projectionMatrix*viewMatrix*world;}",fragmentShader:`precision highp float;varying vec3 wPos;varying vec3 wNormal;varying vec2 texUv;uniform float power,reach,eaves,walls,minX,hasPaint;uniform vec3 tint,baseColor;uniform sampler2D paint;uniform vec3 lamps[${l.length}];void main(){if(power<=0.||wPos.x<minX)discard;vec3 n=normalize(wNormal);float underside=1.-smoothstep(-.45,-.05,n.y);float wall=1.-smoothstep(.25,.65,abs(n.y));float surface=max(underside*eaves,wall*walls);if(surface<.001)discard;float amount=0.;for(int i=0;i<${l.length};i++){vec3 delta=lamps[i]-wPos;float distance=length(delta);float facing=max(0.,dot(n,delta/max(distance,.0001)));float falloff=pow(max(0.,1.-distance/reach),2.);amount+=falloff*(.3+.7*facing);}vec3 albedo=baseColor;if(hasPaint>.5)albedo*=texture2D(paint,texUv).rgb;vec3 response=mix(vec3(.25),sqrt(max(albedo,vec3(0.))),.75);gl_FragColor=vec4(tint*response*min(amount,1.5)*surface*power,1.);}`,transparent:!0,blending:Bi,depthWrite:!1,depthTest:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:Mn,toneMapped:!1})),v=new ot(f,Array.isArray(p.material)?b:b[0]);v.name="RedLanternReceiver",v.renderOrder=3,v.frustumCulled=p.frustumCulled,p.add(v),this.receivers.push(v),this.materials.push(...b)}this.groups.push({group:c,uniforms:m,halo:d,points:l}),this.stats.lamps+=l.length}this.tiles.add(s),this.stats.batches=this.batches.length+this.groups.length,this.stats.receivers=this.receivers.length,this.configure(this.settings)}}createHalo(e){let t=new vt({uniforms:{power:{value:0},tint:{value:new ue("#ff5030")}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);center.xy+=position.xy*length(instanceMatrix[0].xyz);gl_Position=projectionMatrix*center;}",fragmentShader:"varying vec2 vUv;uniform vec3 tint;uniform float power;void main(){float r=length(vUv-.5)*2.;float glow=exp(-r*r*5.)*pow(max(0.,1.-r),2.);gl_FragColor=vec4(tint,glow*power);}",transparent:!0,depthWrite:!1,depthTest:!0,blending:Bi,toneMapped:!1}),n=new gi(new _i(1,1),t,e.length);n.name="RedLanternSoftHalos";let s=new Ue;return e.forEach((r,o)=>{s.makeScale(.65,.65,.65),s.setPosition(r),n.setMatrixAt(o,s)}),n.computeBoundingSphere(),n.renderOrder=4,this.materials.push(t),n}configure(e){this.settings=Ir(e);let t=this.settings,n=this.night&&!this.wireframe&&t.enabled,s=Yv(t.temperature),r=s.clone().multiply(new ue("#ff7950"));for(let o of this.materials)o.userData.redFabric&&(o.emissive.copy(s),o.emissiveIntensity=n?t.brightness*.85:0);for(let{uniforms:o,halo:a}of this.groups)o.power.value=n?t.brightness*.28:0,o.tint.value.copy(r),o.reach.value=t.spillRange*Wi,o.eaves.value=t.lightEaves?1:0,o.walls.value=t.lightWalls?1:0,a.material.uniforms.power.value=n?t.halo*t.brightness*.28:0,a.material.uniforms.tint.value.copy(r),a.visible=n&&t.halo>0;for(let o of this.receivers)o.visible=n&&(t.lightEaves||t.lightWalls)&&t.brightness>0;for(let o of this.batches)for(let a of Array.isArray(o.material)?o.material:[o.material])a.wireframe=this.wireframe}setState({night:e=this.night,wireframe:t=this.wireframe}={}){this.night=e,this.wireframe=t,this.configure(this.settings)}dispose(){this.disposed=!0,this.root.removeFromParent();for(let t of this.receivers)t.removeFromParent(),t.geometry.dispose();this.materials.forEach(t=>t.dispose()),this.groups.forEach(t=>t.halo.geometry.dispose()),this.batches.forEach(t=>{t.userData.ownedGeometry&&t.geometry.dispose(),t.dispose()}),this.groups.forEach(t=>t.halo.dispose());let e=()=>{let t=new Set;this.source?.traverse(n=>{if(n.isMesh){t.add(n.geometry);for(let s of Array.isArray(n.material)?n.material:[n.material])t.add(s),Object.values(s).forEach(r=>{r?.isTexture&&t.add(r)})}}),t.forEach(n=>n.dispose())};this.source?e():this.promise?.then(e).catch(()=>{})}};var mp={type:"change"},wh={type:"start"},_p={type:"end"},Vl=new jn,gp=new Cn,Zv=Math.cos(70*rn.DEG2RAD),zt=new A,gn=2*Math.PI,it={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Th=1e-6,Gl=class extends vo{constructor(e,t=null){super(e,t),this.state=it.NONE,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Oi.ROTATE,MIDDLE:Oi.DOLLY,RIGHT:Oi.PAN},this.touches={ONE:zi.ROTATE,TWO:zi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new Nt,this._lastTargetPosition=new A,this._quat=new Nt().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new mr,this._sphericalDelta=new mr,this._scale=1,this._panOffset=new A,this._rotateStart=new me,this._rotateEnd=new me,this._rotateDelta=new me,this._panStart=new me,this._panEnd=new me,this._panDelta=new me,this._dollyStart=new me,this._dollyEnd=new me,this._dollyDelta=new me,this._dollyDirection=new A,this._mouse=new me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=jv.bind(this),this._onPointerDown=Kv.bind(this),this._onPointerUp=Jv.bind(this),this._onContextMenu=ry.bind(this),this._onMouseWheel=ty.bind(this),this._onKeyDown=ny.bind(this),this._onTouchStart=iy.bind(this),this._onTouchMove=sy.bind(this),this._onMouseDown=Qv.bind(this),this._onMouseMove=ey.bind(this),this._interceptControlDown=oy.bind(this),this._interceptControlUp=ay.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(mp),this.update(),this.state=it.NONE}update(e=null){let t=this.object.position;zt.copy(t).sub(this.target),zt.applyQuaternion(this._quat),this._spherical.setFromVector3(zt),this.autoRotate&&this.state===it.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=gn:n>Math.PI&&(n-=gn),s<-Math.PI?s+=gn:s>Math.PI&&(s-=gn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(zt.setFromSpherical(this._spherical),zt.applyQuaternion(this._quatInverse),t.copy(this.target).add(zt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=zt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new A(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new A(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=zt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Vl.origin.copy(this.object.position),Vl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vl.direction))<Zv?this.object.lookAt(this.target):(gp.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vl.intersectPlane(gp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Th||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Th||this._lastTargetPosition.distanceToSquared(this.target)>Th?(this.dispatchEvent(mp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?gn/60*this.autoRotateSpeed*e:gn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){zt.setFromMatrixColumn(t,0),zt.multiplyScalar(-e),this._panOffset.add(zt)}_panUp(e,t){this.screenSpacePanning===!0?zt.setFromMatrixColumn(t,1):(zt.setFromMatrixColumn(t,0),zt.crossVectors(this.object.up,zt)),zt.multiplyScalar(e),this._panOffset.add(zt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;zt.copy(s).sub(this.target);let r=zt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/t.clientHeight),this._rotateUp(gn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/t.clientHeight),this._rotateUp(gn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new me,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Kv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function jv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Jv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_p),this.state=it.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Qv(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Oi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=it.DOLLY;break;case Oi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=it.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=it.ROTATE}break;case Oi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=it.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=it.PAN}break;default:this.state=it.NONE}this.state!==it.NONE&&this.dispatchEvent(wh)}function ey(i){switch(this.state){case it.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case it.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case it.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function ty(i){this.enabled===!1||this.enableZoom===!1||this.state!==it.NONE||(i.preventDefault(),this.dispatchEvent(wh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(_p))}function ny(i){this.enabled!==!1&&this._handleKeyDown(i)}function iy(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case zi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=it.TOUCH_ROTATE;break;case zi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=it.TOUCH_PAN;break;default:this.state=it.NONE}break;case 2:switch(this.touches.TWO){case zi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=it.TOUCH_DOLLY_PAN;break;case zi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=it.TOUCH_DOLLY_ROTATE;break;default:this.state=it.NONE}break;default:this.state=it.NONE}this.state!==it.NONE&&this.dispatchEvent(wh)}function sy(i){switch(this._trackPointer(i),this.state){case it.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case it.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case it.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case it.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=it.NONE}}function ry(i){this.enabled!==!1&&i.preventDefault()}function oy(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ay(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Pr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var bn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},ly=new Mi(-1,1,1,-1,0,1),Eh=class extends Ft{constructor(){super(),this.setAttribute("position",new ft([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ft([0,2,0,0,2,0],2))}},cy=new Eh,Xi=class{constructor(e){this._mesh=new ot(cy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ly)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Wl=class extends bn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof vt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ti.clone(e.uniforms),this.material=new vt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Xi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Co=class extends bn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Xl=class extends bn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var ql=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new me);this._width=n.width,this._height=n.height,t=new Vt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:mn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Wl(Pr),this.copyPass.material.blending=Vn,this.clock=new _o}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Co!==void 0&&(o instanceof Co?n=!0:o instanceof Xl&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new me);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Yl=class extends bn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ue}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var xp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ue(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Lr=class i extends bn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new me(e.x,e.y):new me(256,256),this.clearColor=new ue(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Vt(r,o,{type:mn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let h=new Vt(r,o,{type:mn});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);let d=new Vt(r,o,{type:mn});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=xp;this.highPassUniforms=Ti.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new vt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new me(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new A(1,1,1),new A(1,1,1),new A(1,1,1),new A(1,1,1),new A(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ti.clone(Pr.uniforms),this.blendMaterial=new vt({uniforms:this.copyUniforms,vertexShader:Pr.vertexShader,fragmentShader:Pr.fragmentShader,blending:Bi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ue,this._oldClearAlpha=1,this._basic=new en,this._fsQuad=new Xi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new me(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new vt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new me(.5,.5)},direction:{value:new me(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new vt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};Lr.BlurDirectionX=new me(1,0);Lr.BlurDirectionY=new me(0,1);var Io={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var $l=class extends bn{constructor(){super(),this.uniforms=Ti.clone(Io.uniforms),this.material=new co({name:Io.name,uniforms:this.uniforms,vertexShader:Io.vertexShader,fragmentShader:Io.fragmentShader}),this._fsQuad=new Xi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ye.getTransfer(this._outputColorSpace)===Je&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===za?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ba?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ka?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===gr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Va?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ga?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ha&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ah="qinhuai.building-light-studies.v1",Sn=Object.freeze([{id:"reference",name:"\u539F\u666F\u7425\u73C0",short:"\u5BF9\u7167\u73B0\u6709\u591C\u666F",description:"\u590D\u7528\u539F\u666F\u6A90\u53E3\u5149\u573A\uFF0C\u7425\u73C0\u8272\u6CBF\u74E6\u9762\u6E10\u9690\uFF0C\u5899\u67F1\u6536\u6697\u3002",brightness:1,color:"#e09a45",eave:1.26,roof:.084,facade:.13,window:.55,width:1.4,bloom:.12},{id:"eaves",name:"\u91D1\u6A90\u6697\u74E6",short:"\u4EAE\u6A90\u53E3 \xB7 \u6697\u5C4B\u9762",description:"\u91D1\u8272\u96C6\u4E2D\u4E8E\u98DE\u6A90\u3001\u5C4B\u810A\u548C\u8F6C\u89D2\uFF0C\u74E6\u9762\u4E2D\u90E8\u4FDD\u6301\u6697\u8272\uFF0C\u6A90\u5E95\u4E0D\u901A\u4F53\u53D1\u4EAE\u3002",brightness:1,color:"#ffb52e",eave:2.5,roof:.025,facade:.1,window:.65,width:2.6,bloom:.15},{id:"wash",name:"\u91D1\u5149\u6E10\u67D3",short:"\u67D4\u5149\u94FA\u74E6 \xB7 \u7EB9\u7406\u53EF\u89C1",description:"\u8F83\u5BBD\u7684\u91D1\u8272\u67D4\u5149\u7531\u6A90\u53E3\u94FA\u5411\u4E0A\u4FA7\u74E6\u9762\uFF0C\u4FDD\u7559\u74E6\u7F1D\u548C\u5C4B\u9762\u660E\u6697\u3002",brightness:1,color:"#ffbb48",eave:2.05,roof:.14,facade:.17,window:.7,width:1.1,bloom:.16},{id:"amber",name:"\u6C89\u91D1\u5C42\u6B21",short:"\u6D53\u91D1\u8272 \xB7 \u6DF1\u74E6\u7F1D",description:"\u504F\u6DF1\u7684\u7425\u73C0\u91D1\u52FE\u51FA\u91CD\u6A90\uFF0C\u538B\u4F4E\u5899\u9762\u4E0E\u5C4B\u9876\u4E2D\u90E8\uFF0C\u7A81\u51FA\u5C42\u53E0\u5173\u7CFB\u3002",brightness:1,color:"#ff9b26",eave:2.8,roof:.06,facade:.12,window:.65,width:1.9,bloom:.12},{id:"festival",name:"\u76DB\u5178\u91D1\u8F89",short:"\u4E3B\u4F53\u66F4\u4EAE \xB7 \u5EAD\u9662\u514B\u5236",description:"\u589E\u52A0\u4E3B\u4F53\u6A90\u53E3\u548C\u7A97\u683C\u4EAE\u5EA6\uFF0C\u5C4B\u9876\u6E10\u4EAE\u4F46\u4E0D\u6574\u4F53\u6CDB\u9EC4\uFF0C\u9002\u5408\u8FDC\u666F\u6BD4\u8F83\u3002",brightness:1,color:"#ffbc51",eave:3.4,roof:.18,facade:.21,window:1.05,width:1.35,bloom:.2},{id:"quiet",name:"\u9759\u591C\u6696\u6A90",short:"\u4F4E\u7167\u5EA6 \xB7 \u53E4\u5EFA\u8D28\u611F",description:"\u6696\u5149\u8F7B\u626B\u6A90\u53E3\uFF0C\u538B\u4F4E\u5899\u67F1\u4E0E\u7A97\u5149\uFF0C\u4FDD\u7559\u81EA\u7136\u591C\u95F4\u7684\u6697\u90E8\u3002",brightness:1,color:"#dfa05a",eave:.95,roof:.035,facade:.07,window:.38,width:2,bloom:.07}].map(i=>({...i,...vp(i)})));function vp(i={}){return{ridgeGain:1,underside:0,transition:0,textureContrast:.85,textureRetention:1,roofColor:i.color??"#e09a45",sign:(i.window??.55)*.55,facadeColor:i.color??"#e09a45",windowColor:i.color??"#e09a45",trimColor:i.windowColor??i.color??"#e09a45",bloomRadius:.48,bloomThreshold:.8,exposure:.86,ambient:.36,moon:.48}}var Zl=[{title:"01 / \u4EAE\u5EA6\u5206\u533A",open:!0,help:"\u6574\u4F53\u500D\u7387\u4FDD\u7559\u5404\u533A\u57DF\u6BD4\u4F8B\uFF1B\u533E\u989D\u73B0\u5728\u53EF\u72EC\u7ACB\u4E8E\u7A97\u683C\u8C03\u6574\u3002",controls:[["brightness","\u5EFA\u7B51\u6574\u4F53\u4EAE\u5EA6",0,2.5,.01,"%"],["eave","\u6A90\u53E3\u8F6E\u5ED3\u4EAE\u5EA6",0,5,.01],["roof","\u5C4B\u9762\u4E2D\u90E8\u67D4\u5149",0,.5,.005],["facade","\u5899\u67F1\u8F85\u5149",0,.5,.005],["window","\u7A97\u683C\u900F\u5149",0,2,.01],["sign","\u533E\u989D\u4EAE\u5EA6",0,2,.01]]},{title:"02 / \u5149\u7EBF\u5206\u5E03\u4E0E\u74E6\u9762",open:!1,help:"\u4E0A\u90E8\u52A0\u5F3A\u6309\u6BCF\u4E2A\u5C4B\u9876\u7684\u5B9E\u9645\u9AD8\u5EA6\u6E10\u53D8\u5206\u533A\uFF0C\u5E76\u975E\u5355\u72EC\u8BC6\u522B\u6BCF\u6761\u5C4B\u810A\u3002\u6A90\u5E95\u9ED8\u8BA4\u4E0D\u53D1\u5149\u3002",controls:[["ridgeGain","\u5C4B\u9876\u4E0A\u90E8\u8F6E\u5ED3\u500D\u7387",0,3,.01],["width","\u6A90\u5149\u6536\u675F\uFF08\u8D8A\u5927\u8D8A\u7A84\uFF09",.1,4,.05],["transition","\u8FB9\u7F18\u67D4\u5316",0,1,.01,"%"],["underside","\u6A90\u5E95\u5FAE\u5149",0,.25,.005],["textureContrast","\u74E6\u7F1D\u660E\u6697\u5BF9\u6BD4",.25,2,.01],["textureRetention","\u539F\u74E6\u9762\u989C\u8272\u4FDD\u7559",0,1,.01,"%"]]},{title:"03 / \u5149\u6655\u4E0E\u8FC7\u66DD\u63A7\u5236",open:!1,help:"\u9608\u503C\u8D8A\u9AD8\uFF0C\u8D8A\u53EA\u6709\u660E\u4EAE\u90E8\u4F4D\u4EA7\u751F\u5149\u6655\uFF1B\u534A\u5F84\u6539\u53D8\u5149\u6655\u6269\u6563\uFF0C\u4E0D\u6539\u53D8\u706F\u5149\u5206\u5E03\u3002",controls:[["bloom","\u5149\u6655\u5F3A\u5EA6",0,.4,.01],["bloomRadius","\u5149\u6655\u6269\u6563\u534A\u5F84",0,1,.01],["bloomThreshold","\u5149\u6655\u8D77\u4EAE\u9608\u503C",0,3,.01]]},{title:"04 / \u67E5\u770B\u73AF\u5883",open:!1,help:"\u4EC5\u5F71\u54CD\u672C\u8BD5\u706F\u9875\u3002\u66DD\u5149\u4F1A\u6539\u53D8\u6574\u5E45\u753B\u9762\uFF1B\u8865\u5149\u7528\u4E8E\u89C2\u5BDF\u6697\u90E8\uFF0C\u4E0E\u5EFA\u7B51\u53D1\u5149\u5206\u522B\u63A7\u5236\u3002",controls:[["exposure","\u753B\u9762\u66DD\u5149",.25,2,.01],["ambient","\u73AF\u5883\u8865\u5149",0,1.5,.01],["moon","\u6708\u5149\u5F3A\u5EA6",0,2,.01]]}],Kl=[["color","\u6A90\u53E3\u8F6E\u5ED3\u5149\u8272"],["roofColor","\u5C4B\u9762\u67D4\u5149\u989C\u8272"],["facadeColor","\u5899\u67F1\u5149\u8272"],["windowColor","\u7A97\u683C / \u533E\u989D\u5149\u8272"],["trimColor","\u5899\u9876\u538B\u8FB9\u5149\u8272"]],uy=Zl.flatMap(i=>i.controls);function Cs(i){if(!i||typeof i!="object")return i;let e={brightness:1,...vp(i)},t={...i};for(let[n,s]of Object.entries(e))t[n]===void 0&&(t[n]=s);return t}function Rh(i){return!!i&&Kl.every(([e])=>/^#[0-9a-f]{6}$/i.test(i[e]))&&uy.every(([e,,t,n])=>Number.isFinite(i[e])&&i[e]>=t&&i[e]<=n)&&Sn.some(e=>e.id===i.id)}function yp(i){try{let e=JSON.parse(i);if(e?.version!==1||!Array.isArray(e.items))return[];let t=new Set;return e.items.map(Cs).filter(n=>!n||typeof n.key!="string"||t.has(n.key)||typeof n.label!="string"||!n.label.trim()||n.label.length>40||!Rh(n)?!1:(t.add(n.key),!0)).slice(0,50)}catch{return[]}}function Mp(i,{renderer:e,bloom:t,ambientLight:n,moonLight:s},r=!0){e&&(e.toneMappingExposure=i.exposure),n&&(n.intensity=i.ambient),s&&(s.intensity=i.moon),t&&(t.strength=r?i.bloom:0,t.radius=i.bloomRadius,t.threshold=i.bloomThreshold)}function hy(i){let e=i?.image;if(!e)return 1;if(e.data)return pc(e);if(typeof document>"u")return 1;let t=document.createElement("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d",{willReadFrequently:!0});if(!n)return 1;try{return n.drawImage(e,0,0),pc(n.getImageData(0,0,t.width,t.height))}catch{return 1}}function bp(i,e,t,n,{regionalPolicy:s=!0,mode:r="default"}={}){let o=r==="matou",a=s?Ol:"float bsRegion(vec3 p){return 2.;} float bsCorridorEave(vec3 p){return 0.;}",l={tint:{value:new ue},roofTint:{value:new ue},levels:{value:new We},width:{value:1.4},shape:{value:new We(1,0,0,.85)},retention:{value:1},sign:{value:0},facadeTint:{value:new ue},windowTint:{value:new ue},trimTint:{value:new ue}},c=()=>({wlState:{value:new We(1,1,0,0)},wlColor:{value:new ue},wlBeam:{value:new We(6,1.5,110*Math.PI/360,.65)},wlAim:{value:new me}}),u=c(),h={first:c(),second:c()};function d(p,f){p.wlState.value.set(f.enabled?1:0,f.brightness,f.directional?1:0,f.color?1:0),p.wlColor.value.set(f.color||"#ffffff"),p.wlBeam.value.set(f.distance,f.sourceDistance,f.angle*Math.PI/360,f.softness),p.wlAim.value.set(f.azimuth*Math.PI/180,f.elevation*Math.PI/180)}let m=p=>{d(u,ct(p));for(let f of["first","second"])d(h[f],li(p,f))},g=[],_=0;return i.traverse(p=>{if(!p.isMesh)return;let f=e.rules.filter(b=>b.node===p.name),S=b=>{let v=f.find(N=>N.material===b.name);if(!v||!b.isMeshStandardMaterial)return b;let w=b.clone();o&&(w.metalness=0),g.push(w),w.emissive.set(0),w.emissiveMap=null,w.emissiveIntensity=1;let E=t.get(p.name),C=v.role==="roof",L=v.role==="window",y=v.role==="sign",x=o&&v.role==="trim",I=L?n.get(b.name):null,D=o&&L&&!!I,O=D?hy(I):1;return C&&_++,w.onBeforeCompile=N=>{if(L){Object.assign(N.uniforms,o?h[Bo(v,e)]:u);let z=v.bounds;N.uniforms.wlCenter={value:z?new A(...z.min).add(new A(...z.max)).multiplyScalar(.5):new xt().setFromObject(p).getCenter(new A)}}N.uniforms.bsTint=l.tint,N.uniforms.bsRoofTint=l.roofTint,N.uniforms.bsLevels=l.levels,N.uniforms.bsWidth=l.width,N.uniforms.bsShape=l.shape,N.uniforms.bsRetention=l.retention,N.uniforms.bsSign=l.sign,N.uniforms.bsFacadeTint=l.facadeTint,N.uniforms.bsWindowTint=l.windowTint,N.uniforms.bsTrimTint=l.trimTint,E&&(N.uniforms.bsField={value:E.texture},N.uniforms.bsMin={value:new A(...E.info.min)},N.uniforms.bsSize={value:new A(...E.info.max).sub(N.uniforms.bsMin.value)}),C&&(N.uniforms.bsRoofHeight={value:new me(v.bounds.min[1],Math.max(.001,v.bounds.max[1]-v.bounds.min[1]))}),I&&(N.uniforms.bsMask={value:I}),D&&(N.uniforms.bsWindowMaskMean={value:O}),N.vertexShader=`varying vec3 vBsWorld;
`+N.vertexShader,N.vertexShader=N.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vBsWorld=(modelMatrix * vec4(transformed,1.0)).xyz;`),N.fragmentShader=`${L?jh:""}
${a}
varying vec3 vBsWorld; uniform vec3 bsTint; uniform vec3 bsRoofTint; uniform vec4 bsLevels; uniform float bsWidth; uniform vec4 bsShape; uniform float bsRetention; uniform float bsSign; uniform vec3 bsFacadeTint; uniform vec3 bsWindowTint; uniform vec3 bsTrimTint; ${C?"uniform vec2 bsRoofHeight;":""} ${E?"uniform highp sampler3D bsField; uniform vec3 bsMin; uniform vec3 bsSize;":""} ${I?"uniform sampler2D bsMask;":""} ${D?"uniform float bsWindowMaskMean;":""}
`+N.fragmentShader,N.fragmentShader=N.fragmentShader.replace("#include <emissivemap_fragment>",`
      float bsPolicy=bsRegion(vBsWorld);
      vec3 bsAlbedo=max(diffuseColor.rgb,vec3(0.0));
      float bsLuma=dot(bsAlbedo,vec3(.2126,.7152,.0722));
      vec3 bsPigment=clamp(bsAlbedo/max(bsLuma,.025),vec3(0.),vec3(1.3));
      vec3 bsN=normalize(inverseTransformDirection(${o?"nonPerturbedNormal":"normal"},viewMatrix));
      float bsResponse=mix(.025,1.,pow(clamp(bsLuma,0.,1.),bsShape.w));
      ${o?`
       // Preserve the existing surface light on the wall-top coping, now
       // independently tinted. Windows still emit only through their masks.
       // Never add soffit glow or wall bounce, including for legacy presets.
       totalEmissiveRadiance=vec3(0.);
       ${x?"totalEmissiveRadiance=bsAlbedo*bsTrimTint*bsLevels.w*.22;":""}
       ${L?`
        float bsWindowMask=1.;
        ${I?`#ifdef USE_MAP
bsWindowMask=texture2D(bsMask,vMapUv).r;
#endif`:""}
        // Each storey has its own tint, gain, switch and directional profile.
        // Keep the lattice mask without re-tinting light by baked diffuse color.
        ${D?"bsWindowMask/=max(bsWindowMaskMean,.08);":""}
        totalEmissiveRadiance=${D?"vec3(1.)":"bsAlbedo"}*mix(bsWindowTint,wlColor,wlState.w)*bsLevels.w*bsWindowMask*.22;
       `:""}
      `:C?`
       float bsEdge=${E?"texture(bsField,clamp((vBsWorld-bsMin)/bsSize,0.,1.)).r":"0.0"};
       float bsTop=smoothstep(.02,.58,bsN.y);
       // The source volume combines ridges and eaves. Upper emphasis is a
       // soft height band, not a separately segmented ridge geometry.
       float bsUpper=${E?"smoothstep(.6,.9,clamp((vBsWorld.y-bsRoofHeight.x)/bsRoofHeight.y,0.,1.))":"0.0"};
       float bsFalloff=pow(bsEdge,max(bsWidth,.1));
       bsFalloff=mix(bsFalloff,smoothstep(0.,1.,bsFalloff),bsShape.z);
       float bsContour=bsLevels.x*bsFalloff*mix(1.,bsShape.x,bsUpper);
       float bsBottom=(1.-smoothstep(-.35,.02,bsN.y))*bsShape.y;
       // Independently colored light contributions overlap smoothly on the original roof.
       vec3 bsRoofLight=bsRoofTint*bsLevels.y*bsTop;
       vec3 bsEaveLight=bsTint*bsContour*(bsTop+bsBottom);
       // Courtyard galleries: real longitudinal eaves only. The original
       // distance field also contains ridges; do not use it in these galleries.
       if(bsPolicy==1.){
        bsRoofLight=vec3(0.);
        bsEaveLight=bsTint*bsLevels.x*bsCorridorEave(vBsWorld)*bsTop;
       }
       totalEmissiveRadiance=mix(vec3(1.),bsPigment,bsRetention)*bsResponse*(bsRoofLight+bsEaveLight);
      `:L?`
       float bsWindowMask=1.;
       ${I?`#ifdef USE_MAP
bsWindowMask=texture2D(bsMask,vMapUv).r;
#endif`:""}
       totalEmissiveRadiance=bsAlbedo*mix(bsWindowTint,wlColor,wlState.w)*bsLevels.w*bsWindowMask;
      `:y?"totalEmissiveRadiance=bsAlbedo*bsWindowTint*bsSign;":`
       float bsWall=1.-smoothstep(.55,.9,abs(bsN.y));
       totalEmissiveRadiance=bsAlbedo*bsFacadeTint*bsLevels.z*bsWall;
      `}
      ${L?"totalEmissiveRadiance*=windowLightProfile(vBsWorld,bsN);":""}
      // Permanent regional limits survive presets, brightness and saved settings.
      if(bsPolicy==0.${C?"":"||bsPolicy==1."})totalEmissiveRadiance=vec3(0.);
    `)},w.customProgramCacheKey=()=>`building-study-v12-floor-windows-${s}-${r}-${v.role}-${!!E}-${!!I}`,w};p.material=Array.isArray(p.material)?p.material.map(S):S(p.material)}),{roofCount:_,materials:g,uniforms:l,windowUniforms:u,floorWindowUniforms:h,configureWindows:m,apply(p,f=!0){p=Cs(p),l.tint.value.set(p.color),l.roofTint.value.set(p.roofColor),l.facadeTint.value.set(p.facadeColor),l.windowTint.value.set(p.windowColor),l.trimTint.value.set(p.trimColor),l.sign.value=p.sign*(f?p.brightness:0),l.shape.value.set(p.ridgeGain,p.underside,p.transition,p.textureContrast),l.retention.value=p.textureRetention,l.levels.value.set(p.eave,p.roof,p.facade,p.window).multiplyScalar(f?p.brightness??1:0),l.width.value=p.width},dispose(){g.forEach(p=>p.dispose())}}}var Is={preset:"gentle",intensity:.42,horizontal:.58,down:.72,up:.13,falloff:1,color:"#e6ad65",surface:"both",region:"all",centerX:50,centerZ:50,width:100,depth:100,minHeight:0,maxHeight:100,edge:8},Po=[{id:"gentle",name:"\u8FD1\u6A90\u67D4\u5149",description:"\u63A5\u8FD1\u539F\u5916\u6EA2\u6548\u679C\uFF0C\u67D4\u548C\u3001\u514B\u5236",values:{}},{id:"narrow",name:"\u6536\u675F\u6A90\u4E0B",description:"\u7A84\u8303\u56F4\u7167\u4EAE\u6A90\u5E95\uFF0C\u4E0D\u94FA\u6EE1\u5899\u9762",values:{horizontal:.28,down:.4,up:.06,intensity:.4,falloff:1.25}},{id:"broad",name:"\u5BBD\u5E45\u6F2B\u5C04",description:"\u6269\u5927\u6A90\u89D2\u4E0E\u5899\u9762\u7684\u67D4\u5149\u8FC7\u6E21",values:{horizontal:1.05,down:1.25,up:.15,intensity:.5,falloff:.85}},{id:"wall",name:"\u5411\u4E0B\u6D17\u5899",description:"\u66F4\u591A\u67D4\u5149\u6CBF\u7ACB\u9762\u5411\u4E0B\u5EF6\u4F38",values:{horizontal:.7,down:1.7,up:.08,intensity:.52,surface:"walls"}},{id:"background",name:"\u4F4E\u4EAE\u80CC\u666F",description:"\u4F4E\u4EAE\u5EA6\u3001\u5BBD\u8303\u56F4\u7684\u80CC\u666F\u5EFA\u7B51\u6C1B\u56F4",values:{horizontal:.85,down:1.1,up:.1,intensity:.22,falloff:.9}},{id:"local",name:"\u5C40\u90E8\u67D4\u7167",description:"\u53EA\u7167\u4E2D\u592E\u533A\u57DF\uFF0C\u53EF\u7EE7\u7EED\u4FEE\u6539\u4F4D\u7F6E\u4E0E\u5927\u5C0F",values:{horizontal:.75,down:1,up:.1,intensity:.48,region:"custom",width:45,depth:65}}],Ch=[["intensity","\u5916\u6EA2\u4EAE\u5EA6",0,1.5,.01,"\u500D","\u53EA\u63A7\u5236\u65B0\u589E\u67D4\u5149\uFF0C\u4E0D\u6539\u53D8\u539F\u6709\u5EFA\u7B51\u4EAE\u5EA6\u3002"],["horizontal","\u6A2A\u5411\u6269\u6563\u534A\u5F84",.15,1.5,.01,"\u573A\u666F\u5355\u4F4D","\u6A90\u53E3\u5411\u4E24\u4FA7\u6269\u6563\u7684\u8DDD\u79BB\uFF1B\u4E0D\u662F\u786C\u5207\u5149\u5708\u3002"],["down","\u5411\u4E0B\u7167\u5C04\u8DDD\u79BB",.15,2.2,.01,"\u573A\u666F\u5355\u4F4D","\u589E\u52A0\u540E\u7167\u4EAE\u66F4\u591A\u6A90\u4E0B\u5899\u9762\u3002"],["up","\u5411\u4E0A\u6EA2\u5149\u8DDD\u79BB",.03,.25,.01,"\u573A\u666F\u5355\u4F4D","\u4FDD\u6301\u8F83\u4F4E\u4EE5\u907F\u514D\u5C4B\u9876\u9876\u9762\u53D1\u4EAE\u3002"],["falloff","\u8FB9\u7F18\u8870\u51CF",.5,2,.05,"","\u8D8A\u5927\u8D8A\u96C6\u4E2D\uFF1B\u8D8A\u5C0F\u8FC7\u6E21\u8D8A\u5BBD\u67D4\u3002"],["edge","\u533A\u57DF\u8FB9\u7F18\u67D4\u5316",1,25,1,"%","\u4EC5\u4F5C\u7528\u4E8E\u533A\u57DF\u9650\u5236\u7684\u8FC7\u6E21\u8FB9\u7F18\u3002"]],Ih=[["centerX","\u533A\u57DF\u6A2A\u5411\u4E2D\u5FC3",0,100,1,"%"],["centerZ","\u533A\u57DF\u7EB5\u5411\u4E2D\u5FC3",0,100,1,"%"],["width","\u533A\u57DF\u5BBD\u5EA6",5,100,1,"%"],["depth","\u533A\u57DF\u6DF1\u5EA6",5,100,1,"%"],["minHeight","\u6700\u4F4E\u4F5C\u7528\u9AD8\u5EA6",0,100,1,"%"],["maxHeight","\u6700\u9AD8\u4F5C\u7528\u9AD8\u5EA6",0,100,1,"%"]],jl="qinhuai-building-soft-spill-v2";function Tn(i={}){let e={...Is,...i};for(let[t,,n,s]of[...Ch,...Ih]){let r=Number(e[t]);e[t]=Number.isFinite(r)?Math.max(n,Math.min(s,r)):Is[t]}return e.minHeight>e.maxHeight&&([e.minHeight,e.maxHeight]=[e.maxHeight,e.minHeight]),["all","front","back","left","right","custom"].includes(e.region)||(e.region="all"),["both","eaves","walls"].includes(e.surface)||(e.surface="both"),/^#[0-9a-f]{6}$/i.test(e.color)||(e.color=Is.color),Po.some(t=>t.id===e.preset)||(e.preset="gentle"),e}function Jl(i){let e=Po.find(t=>t.id===i)||Po[0];return Tn({...Is,...e.values,preset:e.id})}function Sp(i,e,t,{regionalPolicy:n=!1,baseFields:s=new Map,disposeField:r=!0}={}){let o={value:0},a={value:new ue("#e6ad65")},l=new Map,c=[],u={spread:{value:new A(.58,.13,.72)},falloff:{value:1},surface:{value:0},regionOn:{value:0},regionMin:{value:new A},regionMax:{value:new A},feather:{value:.1}},h=new A(...t.info.modelMin||t.info.min),d=new A(...t.info.modelMax||t.info.max),m=d.clone().sub(h),g=Tn();function _(f){g=Tn({...g,...f});let S=g;a.value.set(S.color),u.spread.value.set(S.horizontal,S.up,S.down),u.falloff.value=S.falloff,u.surface.value={both:0,eaves:1,walls:2}[S.surface];let b=S.centerX/100,v=S.centerZ/100,w=S.width/100,E=S.depth/100;S.region==="front"&&(b=.5,v=.75,w=1,E=.5),S.region==="back"&&(b=.5,v=.25,w=1,E=.5),S.region==="left"&&(b=.25,v=.5,w=.5,E=1),S.region==="right"&&(b=.75,v=.5,w=.5,E=1),S.region==="all"&&(b=v=.5,w=E=1),u.regionOn.value=S.region==="all"&&S.minHeight===0&&S.maxHeight===100?0:1,u.regionMin.value.copy(h).add(new A(Math.max(0,b-w/2)*m.x,S.minHeight/100*m.y,Math.max(0,v-E/2)*m.z)),u.regionMax.value.copy(h).add(new A(Math.min(1,b+w/2)*m.x,S.maxHeight/100*m.y,Math.min(1,v+E/2)*m.z)),u.feather.value=Math.max(.02,Math.min(m.x*w,m.z*E)*S.edge/100)}_(g);let p=n?Ol.replaceAll("bsRegion","ssRegion").replaceAll("bsCorridorEave","ssCorridorEave"):"float ssRegion(vec3 p){return 2.;} float ssCorridorEave(vec3 p){return 0.;}";return i.traverse(f=>{if(!f.isMesh)return;l.set(f,f.material);let S=e.rules.some(E=>E.node===f.name&&E.role==="roof"),v=s.get(f.name)?.info.channels===2,w=E=>{let C=E.clone();c.push(C);let L=E.onBeforeCompile,y=E.customProgramCacheKey();return C.onBeforeCompile=x=>{L.call(E,x),Object.assign(x.uniforms,{ssActive:o,ssTint:a,ssSpread:u.spread,ssFalloff:u.falloff,ssSurface:u.surface,ssRegionOn:u.regionOn,ssRegionMin:u.regionMin,ssRegionMax:u.regionMax,ssFeather:u.feather,ssField:{value:t.texture},ssMin:{value:new A(...t.info.min)},ssSize:{value:new A(...t.info.max).sub(new A(...t.info.min))}}),x.vertexShader=`varying vec3 vSsWorld;
`+x.vertexShader,x.vertexShader=x.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vSsWorld=(modelMatrix*vec4(transformed,1.)).xyz;`),x.fragmentShader=`varying vec3 vSsWorld; uniform float ssActive; uniform vec3 ssTint; uniform highp sampler3D ssField; uniform vec3 ssMin; uniform vec3 ssSize; uniform vec3 ssSpread; uniform float ssFalloff; uniform float ssSurface; uniform float ssRegionOn; uniform vec3 ssRegionMin; uniform vec3 ssRegionMax; uniform float ssFeather; ${p}
`+x.fragmentShader,x.fragmentShader=x.fragmentShader.replace("#include <opaque_fragment>",`
     // An additive diffuse response on the actual surface, before tone mapping.
     if(ssActive>.0){
      vec3 ssUv=(vSsWorld-ssMin)/ssSize;
      float ssInside=float(all(greaterThanEqual(ssUv,vec3(0.)))&&all(lessThanEqual(ssUv,vec3(1.))));
      vec4 ssSample=texture(ssField,clamp(ssUv,0.,1.));
      ${t.info.encoding==="offset-rgba16f"?`vec3 ssDelta=ssSample.xyz;float ssVertical=ssDelta.y/max(ssDelta.y>0.?ssSpread.y:ssSpread.z,.01);
      float ssAmount=exp(-.5*(dot(ssDelta.xz,ssDelta.xz)/(ssSpread.x*ssSpread.x)+ssVertical*ssVertical))*ssInside;`:"float ssAmount=ssSample.r*ssInside;"}
      ssAmount=pow(max(0.,ssAmount),ssFalloff);
      if(ssRegionOn>.5){
       vec3 ssLow=smoothstep(ssRegionMin-vec3(ssFeather),ssRegionMin+vec3(ssFeather),vSsWorld);
       vec3 ssHigh=vec3(1.)-smoothstep(ssRegionMax-vec3(ssFeather),ssRegionMax+vec3(ssFeather),vSsWorld);
       ssAmount*=ssLow.x*ssLow.y*ssLow.z*ssHigh.x*ssHigh.y*ssHigh.z;
      }
      ${v?"ssAmount=max(0.,ssAmount-texture(bsField,clamp((vSsWorld-bsMin)/bsSize,0.,1.)).g);":""}
      vec3 ssNormal=normalize(inverseTransformDirection(nonPerturbedNormal,viewMatrix));
      float ssFacing=1.-smoothstep(-.04,.45,ssNormal.y);
      if(ssSurface>.5&&ssSurface<1.5)ssFacing*=1.-smoothstep(-.30,-.02,ssNormal.y);
      if(ssSurface>1.5)ssFacing*=1.-smoothstep(.35,.8,abs(ssNormal.y));
      float ssPolicy=ssRegion(vSsWorld);
      if(ssPolicy==0.)ssAmount=0.;
      if(ssPolicy==1.)ssAmount*=${S?"ssCorridorEave(vSsWorld)":"0."};
      float ssLuma=dot(max(diffuseColor.rgb,vec3(0.)),vec3(.2126,.7152,.0722));
      vec3 ssResponse=mix(vec3(.55),clamp(diffuseColor.rgb,vec3(0.),vec3(1.)),.45);
      outgoingLight+=ssTint*ssResponse*ssAmount*ssFacing*ssActive*mix(.45,1.,sqrt(clamp(ssLuma,0.,1.)));
     }
     #include <opaque_fragment>
    `)},C.customProgramCacheKey=()=>y+"-soft-spill-v2-"+t.info.encoding+"-"+n+"-"+S+"-"+v,C};f.material=Array.isArray(f.material)?f.material.map(w):w(f.material)}),{materials:c,active:o,parameters:u,configure:_,get settings(){return{...g}},apply(f,S=!0){o.value=f&&S?g.intensity:0},dispose(){for(let[f,S]of l)f.material=S;c.forEach(f=>f.dispose()),l.clear(),r&&t.texture.dispose()}}}async function Tp(i){let e=await fetch(new URL("soft-spill-v2.json",i));if(!e.ok)throw new Error("\u67D4\u5149\u6E05\u5355 HTTP "+e.status);let t=await e.json();if(!Array.isArray(t.size)||t.size.length!==3||t.size.some(a=>!Number.isInteger(a)||a<1))throw new Error("\u67D4\u5149\u5C3A\u5BF8\u65E0\u6548");let n=await fetch(new URL(t.file,i));if(!n.ok)throw new Error("\u67D4\u5149\u6570\u636E HTTP "+n.status);let s=new Uint8Array(await n.arrayBuffer()),r=t.encoding==="offset-rgba16f";if(s.length!==t.size.reduce((a,l)=>a*l,1)*(r?8:1))throw new Error("\u67D4\u5149\u6570\u636E\u4E0D\u5B8C\u6574");let o=new Kn(r?new Uint16Array(s.buffer):s,...t.size);return o.format=r?Gt:Hi,o.type=r?mn:nn,o.minFilter=o.magFilter=Dt,o.wrapS=o.wrapT=o.wrapR=cn,o.unpackAlignment=1,o.generateMipmaps=!1,o.needsUpdate=!0,{texture:o,info:t}}function Ph(i){try{let e=JSON.parse(localStorage.getItem(jl)||"{}")?.[i]??{},{enabled:t,...n}=e;return{settings:Tn(n),enabled:t===!0}}catch{return{settings:{...Is},enabled:!1}}}function wp(i,e,t){try{let n=JSON.parse(localStorage.getItem(jl)||"{}");return(!n||typeof n!="object"||Array.isArray(n))&&(n={}),n[i]={...Tn(e),enabled:typeof t=="boolean"?t:n[i]?.enabled===!0},localStorage.setItem(jl,JSON.stringify(n)),!0}catch{return!1}}function Ep(i,e,t){let n=document.createElement("details");n.className="spill-panel",n.open=!0,n.innerHTML='<summary>\u67D4\u548C\u5916\u6EA2 \xB7 \u9884\u8BBE\u4E0E\u8303\u56F4</summary><p class="control-help">\u72EC\u7ACB\u53E0\u52A0\uFF0C\u4E0D\u4FEE\u6539\u4E0B\u65B9\u5EFA\u7B51\u539F\u706F\u6548\u3002\u6240\u6709\u8DDD\u79BB\u4F7F\u7528\u5F53\u524D\u573A\u666F\u5355\u4F4D\uFF0C\u4E0D\u4EE3\u8868\u5B9E\u6D4B\u7C73\u3002</p><div class="spill-presets" role="group" aria-label="\u67D4\u548C\u5916\u6EA2\u9884\u8BBE"></div><div class="spill-custom" hidden>\u5DF2\u5728\u6240\u9009\u9884\u8BBE\u4E0A\u81EA\u5B9A\u4E49\u53C2\u6570</div><div class="spill-selects"><label for="spill-surface">\u53D7\u5149\u8868\u9762</label><select id="spill-surface"><option value="both">\u6A90\u5E95 + \u90BB\u8FD1\u5899\u9762</option><option value="eaves">\u4EC5\u5C4B\u6A90\u5E95\u90E8</option><option value="walls">\u4EC5\u9644\u8FD1\u7ACB\u9762</option></select><label for="spill-region">\u4F5C\u7528\u533A\u57DF</label><select id="spill-region"><option value="all">\u6574\u4E2A\u5EFA\u7B51</option><option value="front">\u524D\u534A\u533A\uFF08+Z\uFF09</option><option value="back">\u540E\u534A\u533A\uFF08\u2212Z\uFF09</option><option value="left">\u5DE6\u534A\u533A\uFF08\u2212X\uFF09</option><option value="right">\u53F3\u534A\u533A\uFF08+X\uFF09</option><option value="custom">\u81EA\u5B9A\u4E49\u77E9\u5F62\u533A\u57DF</option></select><p class="control-help">\u65B9\u5411\u56FA\u5B9A\u5728\u5EFA\u7B51\u5750\u6807\u4E2D\uFF0C\u4E0D\u968F\u76F8\u673A\u65CB\u8F6C\u3002\u8303\u56F4\u53EA\u88C1\u526A\u539F\u6A90\u4E0B\u67D4\u5149\uFF0C\u4E0D\u4F1A\u5728\u7A7A\u767D\u5904\u65B0\u589E\u706F\u3002</p></div><div class="spill-ranges"></div><details class="spill-region-settings"><summary>\u5C40\u90E8\u533A\u57DF\u4F4D\u7F6E\u4E0E\u9AD8\u5EA6</summary><p class="control-help">0\u2013100% \u5BF9\u5E94\u5F53\u524D\u5EFA\u7B51\u8FB9\u754C\u3002\u53EF\u9650\u5236\u4E00\u4FA7\u3001\u4E00\u6BB5\u6A90\u53E3\u6216\u67D0\u4E2A\u697C\u5C42\uFF1B\u81EA\u5B9A\u4E49\u77E9\u5F62\u4F4D\u7F6E\u4EC5\u5728\u81EA\u5B9A\u4E49\u533A\u57DF\u751F\u6548\u3002</p><div class="spill-region-ranges"></div></details><label for="spill-color">\u5916\u6EA2\u5149\u8272\uFF08\u72EC\u7ACB\uFF09</label><div class="color-inputs"><input id="spill-color" type="color" aria-label="\u5916\u6EA2\u5149\u989C\u8272"><input id="spill-color-text" type="text" maxlength="7" aria-label="\u5916\u6EA2\u5149\u5341\u516D\u8FDB\u5236\u989C\u8272" placeholder="#e6ad65"></div><div class="spill-actions"><button type="button" id="spill-reset">\u6062\u590D\u5916\u6EA2\u9ED8\u8BA4</button><button type="button" id="spill-save">\u4FDD\u5B58\u5916\u6EA2\u53C2\u6570\u4E0E\u5F00\u5173</button></div><p class="control-help" id="spill-state" role="status">\u6253\u5F00\u4E0A\u65B9\u5F00\u5173\u540E\u663E\u793A\u5916\u6EA2\u5149\u3002</p>',i.replaceChildren(n);let s=new Map,r=[];for(let u of Po){let h=document.createElement("button");h.type="button",h.dataset.spillPreset=u.id,h.textContent=u.name,h.title=u.description,h.setAttribute("aria-pressed","false"),h.addEventListener("click",()=>e(Jl(u.id),!0)),n.querySelector(".spill-presets").append(h),r.push(h)}function o(u,h){let[d,m,g,_,p,f="",S=""]=u,b=document.createElement("div");b.className="spill-control";let v="spill-"+d;if(b.innerHTML=`<label for="${v}"><span>${m}</span><output id="${v}-value"></output></label><div class="control-inputs"><input id="${v}" type="range" min="${g}" max="${_}" step="${p}"><input id="${v}-number" type="number" min="${g}" max="${_}" step="${p}" aria-label="${m}\u6570\u503C"></div>`,S){let y=document.createElement("p");y.className="spill-hint",y.textContent=S,y.id=v+"-help",b.append(y),b.querySelector("input").setAttribute("aria-describedby",y.id)}h.append(b);let w=b.querySelector("input[type=range]"),E=b.querySelector("input[type=number]"),C=b.querySelector("output"),L=y=>{if(y.currentTarget.value==="")return;let x=Number(y.currentTarget.value);Number.isFinite(x)&&e({[d]:Math.max(g,Math.min(_,x))})};w.addEventListener("input",L),E.addEventListener("input",L),s.set(d,{slider:w,number:E,output:C,unit:f})}for(let u of Ch)o(u,n.querySelector(".spill-ranges"));for(let u of Ih)o(u,n.querySelector(".spill-region-ranges"));for(let u of["surface","region"])n.querySelector("#spill-"+u).addEventListener("change",h=>e({[u]:h.currentTarget.value}));let a=n.querySelector("#spill-color"),l=n.querySelector("#spill-color-text");a.addEventListener("input",()=>e({color:a.value}));function c(){let u=l.value.trim();if(!/^#[0-9a-f]{6}$/i.test(u)){l.setAttribute("aria-invalid","true"),l.setCustomValidity("\u8BF7\u8F93\u5165 #RRGGBB\uFF0C\u4F8B\u5982 #e6ad65");return}l.setCustomValidity(""),l.removeAttribute("aria-invalid"),e({color:u.toLowerCase()})}return l.addEventListener("change",c),l.addEventListener("keydown",u=>{u.key==="Enter"&&(u.preventDefault(),c())}),n.querySelector("#spill-reset").addEventListener("click",()=>e(Jl("gentle"),!0)),n.querySelector("#spill-save").addEventListener("click",t),{sync(u,h,d,m){for(let[p,{slider:f,number:S,output:b,unit:v}]of s)f.value=u[p],S.value=u[p],b.textContent=Number(u[p]).toFixed(v==="%"?0:2)+(v?" "+v:""),f.setAttribute("aria-valuetext",b.textContent);for(let p of["surface","region"])n.querySelector("#spill-"+p).value=u[p];a.value=u.color,document.activeElement!==l&&(l.value=u.color,l.removeAttribute("aria-invalid"),l.setCustomValidity(""));let g=Jl(u.preset),_=Object.keys(Is).some(p=>p!=="preset"&&u[p]!==g[p]);n.querySelector(".spill-custom").hidden=!_,r.forEach(p=>p.setAttribute("aria-pressed",String(p.dataset.spillPreset===u.preset)));for(let p of["centerX","centerZ","width","depth"]){let f=s.get(p);f.slider.disabled=f.number.disabled=u.region!=="custom"}n.querySelector("#spill-state").textContent=d?h?m?"\u5916\u6EA2\u5DF2\u5F00\u542F\uFF1B\u4EC5\u589E\u52A0\u6240\u9009\u533A\u57DF\u7684\u67D4\u5149\u3002":"\u5EFA\u7B51\u603B\u706F\u5DF2\u5173\u95ED\uFF0C\u5916\u6EA2\u6682\u4E0D\u663E\u793A\u3002":"\u5916\u6EA2\u5DF2\u5173\u95ED\uFF1B\u53EF\u5148\u8C03\u53C2\uFF0C\u6253\u5F00\u5F00\u5173\u540E\u9884\u89C8\u3002":"\u5149\u573A\u672A\u5C31\u7EEA\uFF0C\u539F\u5EFA\u7B51\u706F\u6548\u4E0D\u53D7\u5F71\u54CD\u3002"}}}var Lh="qinhuai.building-light-current.v1",Ap=new Set(["temple","pavilion","matou"]);function Rp(i,e,t,n,s,r,o,a){return{...Cs(i),manualSpill:Pt(a),windowLight:ct(r),surfaceSpill:Xt(o),building:s,lightEnabled:n!==!1,softSpill:{enabled:t===!0,settings:Tn(e)}}}function Lo(i){return!!i?.softSpill&&typeof i.softSpill.settings=="object"&&i.softSpill.settings!==null&&!Array.isArray(i.softSpill.settings)}function Cp(i,e){let{softSpill:t,lightEnabled:n,building:s,windowLight:r,surfaceSpill:o,manualSpill:a,...l}=i;return{manualSpill:Pt(e.building&&s&&e.building!==s?e.manualSpill:a??e.manualSpill),surfaceSpill:Xt(o),windowLight:ct(r),settings:Cs(l),spillSettings:Lo(i)?Tn(t.settings):{...e.spillSettings},softSpillEnabled:Lo(i)?t.enabled===!0:e.softSpillEnabled,enabled:typeof n=="boolean"?n:e.enabled}}function Dh(i,e){try{let t=JSON.parse((e??globalThis.localStorage).getItem(Lh)),n=t?.version===1?t.buildings?.[i]:null;return Ap.has(i)&&n&&Rh(Cs(n))&&Lo(n)?n:null}catch{return null}}function Nh(i,e,t){try{if(!Ap.has(i))return!1;t??=globalThis.localStorage;let n=t.getItem(Lh),s;try{s=JSON.parse(n)}catch{}(s?.version!==1||!s.buildings||typeof s.buildings!="object"||Array.isArray(s.buildings))&&(s={version:1,buildings:{}}),s.buildings[i]=e;let r=JSON.stringify(s);return r!==n&&t.setItem(Lh,r),!0}catch{return!1}}var oe=i=>document.getElementById(i),Ls=oe("viewport"),nc=new URLSearchParams(location.search),Ip=nc.get("building"),$e=["temple","pavilion","matou"].includes(Ip)?Ip:"temple",$i,Zi,Ds,ri,yt=Pt(),Ai,oi,jt=Xt(),Ki,Dp=new Map,Et=ct(),Np,Fp,Uo,Ns,ec=pp(oe("red-lantern-controls"),i=>{ri?.configure(i),an=!0});window.addEventListener("storage",i=>{if(i.key===kl){let e=Rs();ec.sync(e,$e==="matou"&&!!ri),ri?.configure(e),an=!0}});var Up=Ph($e),Pn=Up.enabled,Ln=Up.settings,Op;function dy(){return new URL("./assets/building-study/"+$e+"/",location.href)}function zp(){let i=$e==="pavilion",e=$e==="matou";Ns&&(Ns.hidden=!e,e?Ns.append(oe("region-window")):oe("wl-basic").prepend(oe("region-window"))),ec.sync(Rs(),!1),oe("red-detail").hidden=!e,oe("red-retry").hidden=!0,oe("trim-color-control").hidden=!e,document.querySelector('label[for="windowColor"]').textContent=e?"\u7A97\u6237\u900F\u5149\u989C\u8272":"\u7A97\u683C / \u533E\u989D\u5149\u8272",oe("windowColor-code").setAttribute("aria-label",(e?"\u7A97\u6237\u900F\u5149\u989C\u8272":"\u7A97\u683C / \u533E\u989D\u5149\u8272")+" HEX / RGB");let t=e?"\u9A6C\u5934\u5899\u6C11\u5C45":i?"\u9B41\u661F\u9601":"\u592B\u5B50\u5E99\u4E2D\u8F74\u9662\u843D";oe("soft-spill-toggle").disabled=!1,oe("soft-spill-help").textContent=e?"\u539F\u6709\u706F\u6548\u4FDD\u6301\u4EC5\u7A97\u5185\u900F\u5149\uFF1B\u5F00\u542F\u6B64\u9879\u624D\u989D\u5916\u53E0\u52A0\u6A90\u4E0B\u5916\u6EA2\u3002":"\u53EA\u5207\u6362\u6A90\u4E0B\u67D4\u5149\u5916\u6EA2\uFF0C\u4E0D\u6539\u53D8\u73B0\u6709\u5EFA\u7B51\u706F\u6548\u4E0E\u6750\u8D28\u3002",oe("building-select").value=$e,oe("building-name").textContent=t,oe("building-parts").textContent=e?"\u6CBF\u6CB3\u8FDE\u6392\u6C11\u5C45 \xB7 \u9636\u68AF\u6A90\u53E3 \xB7 \u767D\u5899\u9ED1\u74E6":i?"\u591A\u5C42\u98DE\u6A90 \xB7 \u5C4B\u9762 \xB7 \u5854\u8EAB\u6728\u6784":"\u5927\u6BBF \xB7 \u91CD\u6A90 \xB7 \u4E24\u4FA7\u5ECA\u623F",oe("building-caption").textContent="\u5EFA\u7B51\u706F\u5149\u7814\u7A76 / "+t,oe("reset").textContent=e?"\u5168\u666F\u89C6\u89D2":i?"\u5168\u5854\u89C6\u89D2":"\u5168\u9662\u89C6\u89D2",oe("building-note").textContent=e?"\u4FDD\u7559\u539F\u59CB\u767D\u5899\u9ED1\u74E6\u548C\u7EB9\u7406\u3002\u5899\u9876\u538B\u8FB9\u4E0E\u7A97\u6237\u5149\u8272\u53EF\u5206\u522B\u8BBE\u7F6E\uFF0C\u5404\u533A\u57DF\u53EF\u72EC\u7ACB\u5F00\u542F\u73AF\u5883\u5916\u6EA2\uFF0C\u5173\u95ED\u5373\u6062\u590D\u539F\u65B9\u6848\u3002\u4E0D\u589E\u52A0\u53D1\u5149\u5916\u58F3\uFF0C\u4E0D\u4FEE\u6539\u4E3B\u5730\u56FE\u3002":i?"\u9B41\u661F\u9601\u4F7F\u7528\u4E3B\u5730\u56FE\u539F\u59CB\u6A21\u578B\u3001\u8D34\u56FE\u548C 66 \u6BB5\u6A90\u53E3\u5149\u573A\uFF1B\u6A90\u53E3\u3001\u5C4B\u9762\u3001\u5854\u8EAB\u6728\u6784\u72EC\u7ACB\u8C03\u5149\uFF0C\u4E0D\u589E\u52A0\u53D1\u5149\u5916\u58F3\u3002\u4FDD\u5B58\u5230\u5EFA\u7B51\u65B9\u6848\u5E93\uFF0C\u4E0D\u5F71\u54CD\u82B1\u706F\u3002":"\u4E24\u4FA7\u5916\u6392\u5EFA\u7B51\u4E0D\u52A0\u53D1\u5149\uFF1B\u5185\u9662\u4E24\u6761\u957F\u5ECA\u53EA\u4EAE\u6A90\u53E3\uFF0C\u5C4B\u9762\u4E0E\u5899\u4F53\u4E0D\u53D1\u5149\u3002\u6A90\u53E3\u5149\u8272\u4ECD\u53EF\u72EC\u7ACB\u8C03\u8282\u3002"}var tt={...Sn.find(i=>i.id===new URLSearchParams(location.search).get("preset"))||Sn[0]},Zt,Yi,Kt,ut,Fh,wn,Fs,on,Uh,Ql,Oh=0,wi=!1,qi=0,Bp=!1,Do=new A(-5.6,12,-40),an=!0,Ct=!0,Ei=[];try{Ei=yp(localStorage.getItem(Ah))}catch{}$e==="matou"&&!nc.has("preset")&&(tt={...Sn[0],brightness:.85,color:"#e6ad65",roofColor:"#a86f2e",facadeColor:"#80552b",windowColor:"#b47735",trimColor:"#b47735",eave:1.75,roof:0,facade:0,window:.1,sign:.04,width:1.15,bloom:.06});if($e==="pavilion"&&!nc.has("preset")){let i=Ei.filter(e=>e.label.replace(/\s+/g,"")==="\u539F\u666F\u7425\u73C0\xB7\u81EA\u5B9A").at(-1);i&&sc(i)}function ic(){return Rp(tt,Ln,Pn,Ct,$e,Et,jt,yt)}function sc(i){let e=Cp(i,{building:$e,spillSettings:Ln,softSpillEnabled:Pn,enabled:Ct,manualSpill:yt});yt=e.manualSpill,tt=e.settings,Ln=e.spillSettings,Et=e.windowLight,jt=e.surfaceSpill,Pn=e.softSpillEnabled,Ct=e.enabled}if(!nc.has("preset")){let i=Dh($e);i&&sc(i)}var Ps=new Map,No=new Map,kp=new Map,zh=new Map,Hp=new Map,Vp=new Map,Pp=new Set(Zl.flatMap(i=>i.controls).filter(i=>i[5]==="%").map(i=>i[0])),Xn=i=>oe("message").textContent=i;function It(){let i=Sn.find(t=>t.id===tt.id);oe("number").textContent=String(Sn.indexOf(i)+1).padStart(2,"0"),oe("effect-title").textContent=tt.label||i.name,oe("effect-description").textContent=i.description,oe("tuning-base").textContent="\u57FA\u4E8E \xB7 "+i.name,oe("light-toggle").setAttribute("aria-pressed",String(Ct)),oe("light-toggle").textContent="\u5EFA\u7B51\u706F\uFF1A"+(Ct?"\u5F00":"\u5173");for(let[t,n]of kp){n.value=tt[t];let s=Pp.has(t)?Math.round(tt[t]*100)+"%":Number(tt[t]).toFixed(2);oe(t+"-value").textContent=s,n.setAttribute("aria-valuetext",s),Hp.get(t).value=Number((tt[t]*(Pp.has(t)?100:1)).toFixed(3))}for(let[t]of Kl){oe(t==="color"?"building-color":t).value=tt[t];let n=Vp.get(t);n.value=tt[t],n.removeAttribute("aria-invalid"),n.setCustomValidity("")}document.querySelectorAll("[data-preset]").forEach(t=>t.setAttribute("aria-pressed",String(t.dataset.preset===tt.id))),Fs?.apply(tt,Ct),Fs?.configureWindows(Et),Np?.sync($e==="matou"?li(Et,"first"):Et,tt.windowColor,Ct,$e==="matou"),Fp?.sync(li(Et,"second"),tt.windowColor,Ct,!0),Uo&&(Uo.hidden=$e!=="matou"),Ds?.configure(Ln),Ds?.apply(Pn,Ct),oe("soft-spill-toggle").checked=Pn,Op?.sync(Ln,Pn,!!Ds,Ct),Mp(tt,{renderer:Zt,bloom:Fh,ambientLight:Uh,moonLight:Ql},Ct),Ki?.configure(jt,tt,Et,Ct),Ai?.configure(yt,Ct),oi?.sync(yt,!!Ai,Ct,$e),Ai?.setEditor(oi?.editing??{});for(let[t,n]of Dp){let s=t==="window-second"?"window":t,r=s==="window"&&$e==="matou"?t==="window-second"?"second":"first":null,o=r?Fr(jt.window,r):jt[s],a=r?li(Et,r):Et,l=r?Ki?.anchors.window?.filter(c=>c.floor===r).length:Ki?.stats.coverage[s];n.sync(o,!!l,Ct,Nr(s,tt,a)>0,l||0)}let e=Nh($e,ic());oe("draft-status").hidden=e,an=!0}function rc(i,e,t=null){let n=t==="second"?"window-second":e;Dp.set(n,np(i,e,s=>{jt=Xt({...jt,[e]:e==="window"&&$e==="matou"?Kh(jt.window,t||"first",s):{...jt[e],...s}}),It()},t==="second"?{prefix:"ss-window-second",name:"\u4E8C\u5C42\u7A97\u6237"}:{}))}function Fo(i){tt={...tt,...i},delete tt.label,It(),Xn("\u5EFA\u7B51\u5149\u7167\u5DF2\u66F4\u65B0\u3002\u559C\u6B22\u7684\u6548\u679C\u53EF\u5355\u72EC\u4FDD\u5B58\u3002")}for(let i of Zl){let e=document.createElement("details"),t=document.createElement("summary"),n=document.createElement("p");e.className="control-group",e.open=i.open,t.textContent=i.title,n.className="control-help",n.textContent=i.help,e.append(t,n);for(let[r,o,a,l,c,u]of i.controls){let h=document.createElement("div"),d=document.createElement("label"),m=document.createElement("output"),g=document.createElement("input"),_=document.createElement("input"),p=document.createElement("div");h.id="region-"+r;let f=u==="%"?100:1;g.type="range",g.id=r,g.min=a,g.max=l,g.step=c,d.htmlFor=r,d.append(o),m.id=r+"-value",m.htmlFor=r,d.append(m),g.addEventListener("input",()=>Fo({[r]:Number(g.value)})),_.type="number",_.min=a*f,_.max=l*f,_.step=c*f,_.setAttribute("aria-label",o+(u==="%"?"\uFF08\u767E\u5206\u6BD4\uFF09":"\uFF08\u6570\u503C\uFF09")),_.addEventListener("change",()=>{let S=_.valueAsNumber;if(!Number.isFinite(S)){It();return}let b=Math.max(a,Math.min(l,S/f));Fo({[r]:Number((Math.round(b/c)*c).toFixed(4))})}),p.className="control-inputs",p.append(g,_),h.append(d,p),e.append(h),kp.set(r,g),Hp.set(r,_),["eave","roof","facade","sign"].includes(r)&&rc(h,r)}let s=document.createElement("button");s.type="button",s.className="group-reset",s.textContent="\u91CD\u7F6E\u672C\u7EC4",s.setAttribute("aria-label","\u91CD\u7F6E"+i.title),s.addEventListener("click",()=>{let r=Sn.find(o=>o.id===tt.id);Fo(Object.fromEntries(i.controls.map(([o])=>[o,r[o]])))}),e.append(s),oe("sliders").append(e)}for(let[i,e]of Kl){let t=i==="color"?oe("building-color"):null;if(!t){let a=document.createElement("label");t=document.createElement("input"),a.htmlFor=i,a.textContent=e,t.id=i,t.type="color",oe("restore").before(a,t)}let n=document.createElement("div"),s=document.createElement("input");if(n.className="color-inputs",t.before(n),n.append(t,s),i==="trimColor"){let a=document.createElement("div"),l=document.querySelector('label[for="trimColor"]');a.id="trim-color-control",a.hidden=$e!=="matou",l.before(a),a.append(l,n)}let r={color:"eave",roofColor:"roof",facadeColor:"facade",windowColor:"window"}[i];if(r){let a=oe("region-"+r),l=document.querySelector('label[for="'+t.id+'"]'),c=a.querySelector(".surface-spill-panel");a.insertBefore(l,c),a.insertBefore(n,c)}s.type="text",s.id=t.id+"-code",s.placeholder="#010203 / rgb(1, 2, 3)",s.spellcheck=!1,s.autocomplete="off",s.setAttribute("autocapitalize","off"),s.setAttribute("aria-label",e+" HEX / RGB"),s.maxLength=40,Vp.set(i,s);let o=()=>{let a=Er(s.value);if(!a){s.setAttribute("aria-invalid","true"),s.setCustomValidity("\u8BF7\u8F93\u5165 #010203 \u6216 rgb(1, 2, 3)\uFF0CRGB \u5206\u91CF\u4E3A 0 \u5230 255\u3002"),Xn(e+"\u683C\u5F0F\u4E0D\u6B63\u786E\uFF1A\u8BF7\u8F93\u5165 #010203 \u6216 rgb(1, 2, 3)\uFF0CRGB \u5206\u91CF\u4E3A 0 \u5230 255\u3002");return}Fo({[i]:a})};s.addEventListener("input",()=>{s.removeAttribute("aria-invalid"),s.setCustomValidity("")}),s.addEventListener("change",o),s.addEventListener("keydown",a=>{a.key==="Enter"?(a.preventDefault(),o()):a.key==="Escape"&&(a.preventDefault(),s.value=tt[i],s.removeAttribute("aria-invalid"),s.setCustomValidity(""))}),t.addEventListener("input",()=>Fo({[i]:t.value}))}Np=qu(oe("window-light-controls"),i=>{Et=$e==="matou"?fc(Et,"first",i):ct({...Et,...i}),It()},()=>{oe("save").requestSubmit()});rc(oe("wl-environment"),"window","first");rc(oe("trim-color-control"),"trim");Uo=document.createElement("div");oe("window-light-controls").append(Uo);Fp=qu(Uo,i=>{Et=fc(Et,"second",i),It()},()=>{oe("save").requestSubmit()},{prefix:"wl-second",floor:"second"});rc(oe("wl-second-environment"),"window","second");Ns=document.createElement("details");Ns.className="window-panel";Ns.innerHTML='<summary>\u7A97\u6237\u6574\u4F53\u57FA\u51C6\uFF08\u4E24\u5C42\u5171\u7528\uFF09</summary><p class="control-help">\u5171\u540C\u7684\u900F\u5149\u57FA\u51C6\u4E0E\u9ED8\u8BA4\u5149\u8272\u3002\u4E0B\u9762\u7684\u4E00\u5C42\u3001\u4E8C\u5C42\u9762\u677F\u5206\u522B\u8C03\u6574\u5404\u81EA\u4EAE\u5EA6\u3001\u72EC\u7ACB\u989C\u8272\u3001\u7167\u660E\u8303\u56F4\u548C\u73AF\u5883\u5916\u6EA2\uFF1B\u82E5\u9700\u8981\u5355\u72EC\u6539\u53D8\u4E00\u5C42\uFF0C\u8BF7\u4F7F\u7528\u5BF9\u5E94\u697C\u5C42\u9762\u677F\u3002</p>';oe("window-light-controls").prepend(Ns);oe("wl-basic").prepend(oe("region-window"));oe("region-sign").after(oe("trim-color-control"));var Hh=document.createElement("details");Hh.className="surface-spill-panel";var Gp=document.createElement("summary");Gp.textContent="\u6A90\u4E0B\u67D4\u5149 \xB7 \u539F\u6709\u65B9\u6848";Hh.append(Gp,document.querySelector(".spill-option"),oe("spill-controls"));oe("region-eave").append(Hh);for(let i of Sn){let e=document.createElement("button");e.type="button",e.className="preset",e.dataset.preset=i.id,e.style.setProperty("--swatch",i.color);let t=document.createElement("div");t.className="text";let n=document.createElement("strong"),s=document.createElement("small");n.textContent=i.name,s.textContent=i.short,t.append(n,s),e.append(t),e.addEventListener("click",()=>{tt={...i},Et=ct(),jt=Xt(),It(),Xn("\u5DF2\u9009\u62E9\u5EFA\u7B51\u9884\u8BBE\u300C"+i.name+"\u300D\u3002")}),oe("presets").append(e)}oe("restore").addEventListener("click",()=>{tt={...Sn.find(i=>i.id===tt.id)},Et=ct(),jt=Xt(),It()});function Wp(i){try{return localStorage.setItem(Ah,JSON.stringify({version:1,items:i})),Ei=i,Xp(),!0}catch{return Xn("\u672C\u5730\u5B58\u50A8\u4E0D\u53EF\u7528\uFF0C\u5F53\u524D\u8C03\u5149\u4ECD\u53EF\u4F7F\u7528\u3002"),!1}}function Xp(){oe("saved-count").textContent=Ei.length,oe("saved").replaceChildren(),Ei.length||(oe("saved").textContent="\u8FD8\u6CA1\u6709\u4FDD\u5B58\u7684\u5EFA\u7B51\u65B9\u6848\u3002");for(let i of Ei){let e=document.createElement("div"),t=document.createElement("button"),n=document.createElement("button");e.className="saved-row",t.textContent=i.label,t.dataset.savedKey=i.key,t.type=n.type="button",t.addEventListener("click",()=>{sc(i),It(),Xn(Lo(i)?"\u5DF2\u5B8C\u6574\u6062\u590D\u65B9\u6848\u300C"+i.label+"\u300D\u7684\u5EFA\u7B51\u706F\u5149\u3001\u7A97\u6237\u7167\u660E\u3001\u5404\u533A\u57DF\u5916\u6EA2\u3001\u67D4\u5149\u53C2\u6570\u548C\u5F00\u5173\u3002":"\u5DF2\u5E94\u7528\u65E7\u65B9\u6848\u300C"+i.label+"\u300D\uFF1B\u8BE5\u65B9\u6848\u672A\u4FDD\u5B58\u67D4\u5149\u6570\u636E\uFF0C\u4FDD\u7559\u5F53\u524D\u67D4\u5149\u8BBE\u7F6E\u3002\u8BF7\u8C03\u6574\u540E\u53E6\u5B58\u4E3A\u5B8C\u6574\u65B9\u6848\u3002")}),n.textContent="\u5220\u9664",n.setAttribute("aria-label","\u5220\u9664\u5EFA\u7B51\u65B9\u6848 "+i.label),n.addEventListener("click",()=>Wp(Ei.filter(s=>s.key!==i.key))),e.append(t,n),oe("saved").append(e)}}oe("save").addEventListener("submit",i=>{if(i.preventDefault(),!Fs)return;if(Ei.length>=50){Xn("\u5DF2\u4FDD\u5B58 50 \u4E2A\u5EFA\u7B51\u65B9\u6848\uFF0C\u8BF7\u5148\u5220\u9664\u4E0D\u9700\u8981\u7684\u65B9\u6848\u3002");return}let e=oe("save-name").value.trim()||Sn.find(t=>t.id===tt.id).name+" \xB7 \u81EA\u5B9A";Wp([...Ei,{...ic(),label:e,key:crypto.randomUUID()}])&&(Xn("\u5DF2\u4FDD\u5B58\u5B8C\u6574\u65B9\u6848\u300C"+e+"\u300D\uFF1A\u5305\u542B\u5EFA\u7B51\u706F\u5149\u3001\u7A97\u6237\u7167\u660E\u3001\u5404\u533A\u57DF\u5916\u6EA2\u3001\u73AF\u5883\u3001\u67D4\u5149\u548C\u624B\u52A8\u5916\u6EA2\u70B9\u4F4D\u5168\u90E8\u53C2\u6570\u548C\u5F00\u5173\u3002"),oe("save-name").value="")});function oc(i=!1){if(!Kt)return;if(($e==="pavilion"||$e==="matou")&&Zi){let n=Zi.getSize(new A),s=Zi.getCenter(new A),r=Math.max(n.y,n.x/Math.max(Kt.aspect,.45))/(2*Math.tan(rn.degToRad(Kt.fov/2)))*1.35;i&&(s.y=Zi.max.y-n.y*.3),ut.target.copy(s),Kt.position.copy(s).add(new A(r*(i?.18:.28),r*(i?.08:.2),r*(i?.48:1))),ut.update(),an=!0;return}let e=i?12:Math.max(49,23/Math.max(Kt.aspect,.45)),t=i?new A(-5.65,13.45,-36.7):Do.clone().add(new A(0,1,1));ut.target.copy(t),Kt.position.copy(t).add(new A(i?4:e*.11,i?3.8:e*.58,e)),ut.update(),an=!0}oe("reset").addEventListener("click",()=>oc());oe("detail").addEventListener("click",()=>oc(!0));oe("rotate").addEventListener("click",i=>{ut&&(ut.autoRotate=!ut.autoRotate,i.currentTarget.setAttribute("aria-pressed",String(ut.autoRotate)),an=!0)});oe("light-toggle").addEventListener("click",i=>{Ct=!Ct,i.currentTarget.setAttribute("aria-pressed",String(Ct)),i.currentTarget.textContent="\u5EFA\u7B51\u706F\uFF1A"+(Ct?"\u5F00":"\u5173"),It()});function Lp(i,e=[0,0,1],t=!1){let n=yt.points.find(s=>s.id===yt.selectedId);if(t&&n)yt=Pt({...yt,points:yt.points.map(s=>s.id===n.id?{...s,position:i,normal:e}:s)}),oi.stop();else{if(yt.points.length>=Dn)return oi.tell("\u6700\u591A\u6DFB\u52A0 8 \u4E2A\u70B9\u4F4D\uFF0C\u8BF7\u5148\u5220\u9664\u4E0D\u9700\u8981\u7684\u70B9\u3002"),!1;let s=td(i,e,yt.preset,crypto.randomUUID());s.name="\u5916\u6EA2\u70B9 "+(yt.points.length+1),yt=Pt({...yt,enabled:!0,points:[...yt.points,s],selectedId:s.id})}return It(),oi.tell(t?"\u5DF2\u66F4\u65B0\u70B9\u4F4D\u4F4D\u7F6E\u548C\u8868\u9762\u671D\u5411\u3002":"\u5DF2\u6DFB\u52A0\u67D4\u5149\u70B9\uFF1B\u53EF\u7EE7\u7EED\u70B9\u51FB\u6DFB\u52A0\uFF0C\u6216\u7ED3\u675F\u5E03\u70B9\u540E\u8C03\u8282\u9009\u4E2D\u70B9\u3002"),!0}oi=tp(oe("manual-spill-controls"),(i,e)=>{yt=Pt(i),e?.surfaceSpill&&(jt=Xt(e.surfaceSpill)),e?.windowLight&&(Et=ct(e.windowLight)),It()},i=>{Ai?.setEditor(i),i.placing&&ut&&(ut.autoRotate=!1,oe("rotate").setAttribute("aria-pressed","false")),an=!0},i=>{if(!Kt||!ut)return;let e=new A(...i.position),t=new A(...i.normal);Math.abs(t.y)>.8&&t.set(0,.15,1),t.y=Math.max(.15,t.y),ut.target.copy(e),Kt.position.copy(e).addScaledVector(t.normalize(),2.5),ut.update(),an=!0},()=>({surfaceSpill:jt,windowLight:Et}));Op=Ep(oe("spill-controls"),(i,e=!1)=>{Ln=Tn(e?i:{...Ln,...i}),It()},()=>{Xn(wp($e,Ln,Pn)?"\u5DF2\u4FDD\u5B58\u672C\u5EFA\u7B51\u5916\u6EA2\u53C2\u6570\u4E0E\u5F00\u5173\uFF1B\u4FDD\u5B58\u5168\u90E8\u706F\u5149\u8BF7\u4F7F\u7528\u300C\u4FDD\u5B58\u5B8C\u6574\u706F\u5149\u65B9\u6848\u300D\u3002":"\u65E0\u6CD5\u5199\u5165\u6D4F\u89C8\u5668\u5B58\u50A8\uFF0C\u8BF7\u68C0\u67E5\u5B58\u50A8\u6743\u9650\u3002")});oe("soft-spill-toggle").addEventListener("change",i=>{Pn=i.currentTarget.checked,It(),Xn(Pn?"\u67D4\u548C\u5916\u6EA2\u5C04\u706F\u5DF2\u5F00\u542F\uFF1B\u539F\u6709\u5EFA\u7B51\u706F\u6548\u4FDD\u6301\u4E0D\u53D8\u3002":"\u67D4\u548C\u5916\u6EA2\u5C04\u706F\u5DF2\u5173\u95ED\uFF1B\u4FDD\u7559\u539F\u6709\u5EFA\u7B51\u706F\u6548\u3002")});function Vh(i){if(!i)return;let e=new Set;i.traverse(t=>{if(t.isMesh){e.add(t.geometry);for(let n of Array.isArray(t.material)?t.material:[t.material])e.add(n),Object.values(n).forEach(s=>{s?.isTexture&&e.add(s)})}}),e.forEach(t=>t.dispose())}function Bh(){oi?.stop(),Ai?.dispose(),Ai=null,Ki?.dispose(),Ki=null,ri?.dispose(),ri=null,Zi=null,Ds?.dispose(),Ds=null,Fs?.dispose(),Fs=null;for(let[i,e]of zh)i.material=e;zh.clear(),on&&(wn?.remove(on),Vh(on),on=null);for(let i of new Set([...Ps.values()].map(e=>e.texture)))i.dispose();for(let i of No.values())i.dispose();Ps.clear(),No.clear()}async function tc(){if(Bp){location.reload();return}let i=++qi,e=dy();zp(),oe("building-select").disabled=!0,Ls.setAttribute("aria-busy","true"),oe("retry").hidden=!0,oe("status").hidden=!1,oe("controls").disabled=!0,Bh(),oi?.sync(yt,!1,Ct,$e);try{let t=await fetch(new URL("manifest.json",e));if(!t.ok)throw new Error("\u5EFA\u7B51\u6E05\u5355 HTTP "+t.status);let n=await t.json(),s=await new Cr().loadAsync(new URL(n.file,e).href,o=>{oe("status").textContent="\u8F7D\u5165\u5EFA\u7B51 "+Math.min(100,Math.round(o.loaded/(o.total||n.bytes)*100))+"% \xB7 \u4FDD\u7559\u539F\u59CB\u6750\u8D28"});if(wi||i!==qi){Vh(s.scene);return}on=s.scene,oe("status").textContent="\u6B63\u5728\u51C6\u5907\u6A90\u53E3\u5149\u573A\u4E0E\u7A97\u683C\u906E\u7F69\u2026";let r=new Map;for(let[o,a]of Object.entries(n.fields)){if(r.has(a.file)){Ps.set(o,{info:a,texture:r.get(a.file)});continue}let l=await fetch(new URL(a.file,e));if(!l.ok)throw new Error("\u6A90\u5149\u6570\u636E HTTP "+l.status);let c=new Uint8Array(await l.arrayBuffer()),u=a.channels??1;if(![1,2].includes(u)||c.length!==a.size.reduce((d,m)=>d*m,u))throw new Error("\u6A90\u5149\u6570\u636E\u4E0D\u5B8C\u6574");if(wi||i!==qi)return;let h=new Kn(c,...a.size);h.format=u===2?Mo:Hi,h.type=nn,h.minFilter=h.magFilter=Dt,h.wrapS=h.wrapT=h.wrapR=cn,h.unpackAlignment=1,h.generateMipmaps=!1,h.needsUpdate=!0,r.set(a.file,h),Ps.set(o,{info:a,texture:h})}for(let[o,a]of Object.entries(n.masks)){let l=await new ps().loadAsync(new URL(a,e).href);if(wi||i!==qi){l.dispose();return}l.flipY=!1,l.wrapS=l.wrapT=$n,No.set(o,l)}on.traverse(o=>{o.isMesh&&zh.set(o,o.material)}),Fs=bp(on,n,Ps,No,{regionalPolicy:$e==="temple",mode:$e});try{let o=await Tp(e);if(wi||i!==qi){o.texture.dispose();return}Ds=Sp(on,n,o,{regionalPolicy:$e==="temple",baseFields:$e==="matou"?new Map:Ps})}catch(o){console.warn("\u53EF\u9009\u67D4\u5149\u8D44\u6E90\u8F7D\u5165\u5931\u8D25\uFF0C\u4FDD\u7559\u539F\u5EFA\u7B51\u706F\u6548",o),Xn("\u5916\u6EA2\u5149\u8D44\u6E90\u6682\u4E0D\u53EF\u7528\uFF0C\u539F\u5EFA\u7B51\u4ECD\u53EF\u6B63\u5E38\u8BD5\u706F\u3002")}if(wn.add(on),on.updateMatrixWorld(!0),$e==="matou"){let o=new Hl(wn);ri=o;try{if(await o.registerTile(9,on,{groupId:"north-west"}),wi||i!==qi){o.dispose();return}ec.sync(o.settings,!0)}catch(a){o.dispose(),ri=null,ec.sync(Rs(),!1),oe("red-state").textContent="\u7EA2\u706F\u7B3C\u8F7D\u5165\u5931\u8D25\uFF0C\u70B9\u51FB\u201C\u91CD\u65B0\u8F7D\u5165\u7EA2\u706F\u7B3C\u201D\u91CD\u8BD5\u3002",oe("red-retry").hidden=!1,console.warn("\u7EA2\u706F\u7B3C\u56FE\u5C42\u8F7D\u5165\u5931\u8D25",a)}}Zi=new xt().setFromObject(on),Do.set(-5.6,12,-40),$e==="pavilion"||$e==="matou"?(Zi.getCenter(Do),$i.position.set(Do.x,Zi.min.y-.02,Do.z)):$i.position.set(-5.6,11.7,-40),Ki=ap(wn,on,$i,Zt,n,Ps,No,$e),Ai=ep(wn,on,$i,Zt,Kt,Zt.domElement,{onPick:Lp,onSelect:o=>{yt=Pt({...yt,selectedId:o}),It()},onStop:()=>{oi.stop(),an=!0},onMessage:o=>oi.tell(o)}),oc(),It(),oe("asset-info").textContent=n.meshes+" \u4E2A\u7F51\u683C \xB7 "+(n.triangles/1e4).toFixed(1)+" \u4E07\u4E09\u89D2\u9762 \xB7 \u539F\u59CB\u8D34\u56FE",oe("controls").disabled=!1,oe("status").hidden=!0,Ls.setAttribute("aria-busy","false"),an=!0,window.__BUILDING_STUDY__={manualSpillLayer:Ai,get manualSpillSettings(){return Pt(yt)},setManualSpill(o){yt=Pt(o),It()},addManualPoint:Lp,surfaceLayer:Ki,get surfaceSettings(){return Xt(jt)},building:$e,scene:wn,model:on,camera:Kt,controls:ut,renderer:Zt,lighting:Fs,softSpill:Ds,redLanterns:ri,get windowSettings(){return ct(Et)},get snapshot(){return ic()},get softSpillEnabled(){return Pn},get spillSettings(){return{...Ln}},setSpillSettings(o){Ln=Tn({...Ln,...o}),It()},setSoftSpill(o){Pn=!!o,It()},presets:Sn,get settings(){return{...tt}},select(o){let a=Sn.find(l=>l.id===o);a&&(tt={...a},Et=ct(),jt=Xt(),It())},manifest:n}}catch(t){if(wi)return;Ls.setAttribute("aria-busy","false"),Bh(),oe("status").textContent="\u5EFA\u7B51\u8F7D\u5165\u5931\u8D25\uFF1A"+t.message,oe("retry").hidden=!1,console.error(t)}finally{!wi&&i===qi&&(oe("building-select").disabled=!1)}}oe("red-retry").addEventListener("click",()=>{oe("red-retry").hidden=!0,tc()});oe("red-detail").addEventListener("click",()=>{if(!ri?.groups.length)return;let i=ri.groups[0].points[0].mount;ut.target.set(i[0],i[1]-.12,i[2]),Kt.position.set(i[0]+.8,i[1]+.3,i[2]+2),ut.update(),an=!0});oe("building-select").addEventListener("change",()=>{Nh($e,ic()),$e=oe("building-select").value;let i=Dh($e);if(i)sc(i);else{yt=Pt(),Et=ct(),jt=Xt();let t=Ph($e);Ln=t.settings,Pn=t.enabled}let e=new URL(location.href);e.searchParams.set("building",$e),history.replaceState(null,"",e),tc(),Xn(i?"\u5DF2\u6062\u590D\u672C\u5EFA\u7B51\u4E0A\u6B21\u8C03\u6574\u7684\u706F\u5149\u3001\u67D4\u5149\u53C2\u6570\u548C\u5F00\u5173\u3002":"\u5DF2\u5207\u6362\u5EFA\u7B51\uFF1B\u6CBF\u7528\u5F53\u524D\u57FA\u7840\u8C03\u5149\uFF0C\u8F7D\u5165\u672C\u5EFA\u7B51\u7684\u5916\u6EA2\u8BBE\u7F6E\u3002")});zp();var kh;try{Zt=new Ll({antialias:!0}),Zt.setPixelRatio(Math.min(devicePixelRatio,1.5)),Zt.outputColorSpace=_t,Zt.toneMapping=gr,Zt.toneMappingExposure=.86,Ls.append(Zt.domElement),wn=new hs,wn.background=new ue("#111d2c"),wn.fog=new Qr("#111d2c",110,260),Kt=new bt(36,1,.05,500),ut=new Gl(Kt,Zt.domElement),ut.enableDamping=!0,ut.minDistance=2,ut.maxDistance=140,ut.maxPolarAngle=Math.PI*.495,ut.autoRotateSpeed=.35,ut.addEventListener("change",()=>an=!0),Uh=new fo(12834541,5326133,.36),Ql=new _s(13359599,.48),Ql.position.set(-20,65,10),wn.add(Uh,Ql),$i=new ot(new _i(150,150),new Hn({color:2107690,roughness:1})),$i.rotation.x=-Math.PI/2,$i.position.set(-5.6,11.7,-40),wn.add($i),Yi=new ql(Zt),Yi.addPass(new Yl(wn,Kt)),Fh=new Lr(new me(1,1),.12,.48,.8),Yi.addPass(Fh),Yi.addPass(new $l);let i=()=>{let t=Ls.clientWidth,n=Ls.clientHeight;!t||!n||(Zt.setSize(t,n),Yi.setSize(t,n),Kt.aspect=t/n,Kt.updateProjectionMatrix(),an=!0)};kh=new ResizeObserver(i),kh.observe(Ls),i(),oc();let e=()=>{wi||(Oh=requestAnimationFrame(e),ut.update(),an&&!document.hidden&&(Ki?.updateShadows(),Ai?.updateMarkers(),Yi.render(),an=!1))};e(),Zt.domElement.addEventListener("webglcontextlost",t=>{t.preventDefault(),Bp=!0,cancelAnimationFrame(Oh),oe("status").hidden=!1,oe("status").textContent="\u663E\u5361\u4E0A\u4E0B\u6587\u5DF2\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u65B0\u8F7D\u5165\u9875\u9762\u3002",oe("retry").hidden=!1}),oe("retry").addEventListener("click",tc),tc()}catch(i){oe("status").textContent="\u65E0\u6CD5\u521D\u59CB\u5316\u4E09\u7EF4\u9884\u89C8\uFF1A"+i.message,console.error(i)}It();Xp();window.addEventListener("beforeunload",()=>{wi=!0,qi++,cancelAnimationFrame(Oh),kh?.disconnect(),ut?.dispose(),Bh(),Vh(wn),Yi?.passes.forEach(i=>i.dispose?.()),Yi?.dispose(),Zt?.dispose()});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
