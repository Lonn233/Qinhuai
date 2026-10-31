(()=>{var oh=12*Math.PI/180,gc=.009,ah=i=>Math.atan2(Math.sin(i),Math.cos(i));function lh(i,e,t=0){let n=ah(t-((i+.5)*Math.PI/3+e));return{error:n,aligned:Math.abs(n)<=oh+1e-9,degrees:Math.abs(n)*180/Math.PI}}var _c=["petal_assembly","calyx_assembly","lotus_leaf_assembly"],ts=i=>["lining_upper","lining_lower",..._c].includes(i);function ch(i,e,t=0){let n=ah(t-(i+e));return{error:n,aligned:Math.abs(n)<=oh+1e-9,degrees:Math.abs(n)*180/Math.PI}}function uh({storage:i,onChange:e=()=>{}}={}){let t="qinhuai-workshop-music-v1",n=!0,s=.25,r=!1,o=!1,a=!1,c=!1;try{let g=JSON.parse(i?.getItem(t)||"null");typeof g?.enabled=="boolean"&&(n=g.enabled),Number.isFinite(g?.volume)&&(s=Math.max(0,Math.min(1,g.volume)))}catch{}let l=document.createElement("audio");l.id="workshop-music",l.src="./workshop/assets/audio/man-ye-xing.mp3",l.preload="none",l.loop=!0,l.volume=s,document.body.appendChild(l);let u=()=>({enabled:n,volume:s,started:r,playing:!l.paused,suspended:o,blocked:a,error:c}),f=()=>e(u());function d(){try{i?.setItem(t,JSON.stringify({enabled:n,volume:s}))}catch{}}function p(){if(!n||!r||o)return;a=!1,c=!1,l.play()?.catch(y=>{!n||o||y.name==="AbortError"||(a=y.name==="NotAllowedError",c=!a,f())}),f()}return l.addEventListener("play",f),l.addEventListener("pause",f),l.addEventListener("error",()=>{c=!0,f()}),{snapshot:u,start(){r=!0,o=!1,p()},pause(){o=!0,l.pause(),f()},resume(){o=!1,p()},setEnabled(g){n=!!g,n?(l.error&&l.load(),r=!0,p()):l.pause(),d(),f()},setVolume(g){s=Math.max(0,Math.min(1,g)),l.volume=s,d(),f()},toggle(){n&&(a||c)?(l.error&&l.load(),p()):this.setEnabled(!n)}}}var dt=Object.freeze({frame:{bigRingRadius:.84,mouthRingRadius:.38,bigRingHeight:.56,mouthRingHeight:1.08,verticalRibCount:3},petals:{layers:4,perLayer:6,count:24},leafCount:12,flowerCount:5,dryDuration:3500,colors:{petalBase:"#D98FAC",petalMid:"#EEB0C5",petalTip:"#C97193",petalUndyed:"#F5E9ED",calyx:"#3D6A43",bamboo:"#A9A477",binding:"#E4DCCB",innerLining:"#8B293E"}});var Ps=["\u624E\u6846\u5B50","\u88F1\u7CCA","\u5236\u4F5C\u82B1\u74E3","\u7C98\u8D34\u82B1\u74E3","\u88C5\u82B1\u5934\u4E0E\u8721\u70DB"],It=[{id:"bamboo_prep",phase:0,name:"\u5236\u4F5C\u5927\u5708\u548C\u5C0F\u5708",short:"\u5F2F\u5236\u5927\u5C0F\u5708",tool:"bamboo",total:2,station:"bamboo",action:"\u5F2F\u5236\u5E76\u7528\u68C9\u82B1\u7EB8\u637B\u6346\u624E\u4E00\u53EA\u7AF9\u5708",unit:"\u53EA",hint:"\u7528 62 \u5398\u7C73\u957F\u6761\u5F2F\u5236\u5927\u5708\uFF0C\u518D\u7528\u9002\u5F53\u957F\u5EA6\u7684\u957F\u6761\u5F2F\u5236\u5C0F\u5708\u3002\u9996\u5C3E\u9884\u7559\u7EA6 1 \u5398\u7C73\u642D\u63A5\uFF0C\u5E76\u7528\u68C9\u82B1\u7EB8\u637B\u6346\u624E\u3002\u53E6\u5907\u9F50\u4E09\u6839 40 \u5398\u7C73\u957F\u6761\u3002"},{id:"frame_assembly",phase:0,name:"\u56FA\u5B9A\u4E09\u6839\u5F27\u5F62\u9AA8\u67B6",short:"\u56FA\u5B9A\u5F27\u5F62\u9AA8\u67B6",tool:"bamboo",total:3,station:"assembly",action:"\u5F2F\u597D\u5E76\u6346\u624E\u4E00\u6839 40 \u5398\u7C73\u5F27\u5F62\u9AA8\u67B6",unit:"\u6839",hint:"\u5C06\u4E09\u6839 40 \u5398\u7C73\u957F\u6761\u5206\u522B\u5F2F\u6210\u5F27\u5F62\uFF1B\u6BCF\u6839\u4E24\u7AEF\u5747\u7528\u68C9\u82B1\u7EB8\u637B\u6346\u624E\u3002\u5927\u5708\u56FA\u5B9A\u5728\u5F27\u5F62\u957F\u6761\u9760\u4E0A\u7684\u4F4D\u7F6E\u3002"},{id:"frame_short_binding",phase:0,name:"\u56FA\u5B9A\u5C0F\u5708\u548C\u82B1\u5934\u652F\u67B6",short:"\u56FA\u5B9A\u5C0F\u5708\u4E0E\u652F\u67B6",tool:"string",total:2,station:"assembly",action:"\u56FA\u5B9A\u5C0F\u5708\u6216\u94C1\u4E1D\u82B1\u5934\u652F\u67B6",unit:"\u9879",hint:"\u5C06\u5C0F\u5708\u56FA\u5B9A\u5728\u4E09\u6839\u5F27\u5F62\u957F\u6761\u7684\u9876\u7AEF\uFF1B\u518D\u7528\u94C1\u4E1D\u5236\u4F5C\u5E76\u56FA\u5B9A\u540E\u7EED\u5B89\u88C5\u6210\u54C1\u82B1\u5934\u7684\u652F\u67B6\u3002"},{id:"lining_lower",phase:1,name:"\u8D34\u534A\u5706\u5F62\u65E0\u7EBA\u5E03",short:"\u8D34\u65E0\u7EBA\u5E03",tool:"paste",total:6,station:"assembly",action:"\u7528\u6D46\u7CCA\u8D34\u5408\u4E00\u7247\u534A\u5706\u5F62\u65E0\u7EBA\u5E03",unit:"\u7247",hint:"\u5148\u5747\u5300\u6D82\u6D46\u7CCA\uFF0C\u518D\u6309\u9AA8\u67B6\u5F62\u72B6\u5206\u7247\u8D34\u534A\u5706\u5F62\u65E0\u7EBA\u5E03\u3002\u5E03\u7247\u9700\u8981\u987A\u7740\u9AA8\u67B6\u8C03\u6574\u65B9\u5411\uFF0C\u4E0D\u80FD\u53EA\u5411\u540C\u4E00\u65B9\u5411\u7C98\u8D34\u3002"},{id:"lining_upper",phase:1,name:"\u8D34\u88F1\u5E03\u5E76\u4FEE\u8FB9",short:"\u8D34\u88F1\u5E03",tool:"paste",total:6,station:"assembly",action:"\u7528\u6D46\u7CCA\u8D34\u5408\u4E00\u7247\u88F1\u5E03",unit:"\u7247",hint:"\u65E0\u7EBA\u5E03\u8D34\u7262\u5E76\u4FEE\u526A\u591A\u4F59\u8FB9\u7F18\u540E\uFF0C\u7EE7\u7EED\u8D34\u4E0A\u5C42\u88F1\u5E03\uFF0C\u4F7F\u706F\u4F53\u8986\u76D6\u5E73\u6574\u5B8C\u6574\u3002"},{id:"paper_dye",phase:2,name:"\u67D3\u82B1\u74E3\u7EB8",short:"\u67D3\u82B1\u74E3\u7EB8",tool:"dye",total:4,station:"dye",action:"\u5C06\u4E00\u6279\u82B1\u74E3\u7EB8\u67D3\u6210\u7C89\u7EA2\u8272",unit:"\u6279",hint:"\u5C06\u82B1\u74E3\u7EB8\u6D78\u5165\u7C89\u7EA2\u8272\u67D3\u6599\uFF0C\u901A\u5E38\u6D78\u6CE1 2 \u81F3 3 \u5206\u949F\uFF1B\u672C\u539F\u578B\u5C06\u7B49\u5F85\u65F6\u95F4\u7F29\u77ED\u4E3A\u6570\u79D2\u3002"},{id:"paper_drying",phase:2,name:"\u9634\u5E72\u82B1\u74E3\u7EB8",short:"\u9634\u5E72",tool:null,total:1,station:"dye",action:"\u7B49\u5F85\u82B1\u74E3\u7EB8\u5B8C\u5168\u9634\u5E72",unit:"\u6B21",hint:"\u628A\u67D3\u597D\u7684\u82B1\u74E3\u7EB8\u653E\u5728\u9634\u51C9\u901A\u98CE\u5904\u81EA\u7136\u9634\u5E72\uFF0C\u4E0D\u76F4\u63A5\u66B4\u6652\u3002\u5B8C\u5168\u5E72\u900F\u540E\u624D\u80FD\u538B\u6A21\u3002"},{id:"petal_pressing",phase:2,name:"\u538B\u6A21\u82B1\u74E3\u7EB8",short:"\u538B\u6A21",tool:"press",total:4,station:"press",action:"\u7528\u538B\u6A21\u5668\u538B\u51FA\u4E00\u6279\u82B1\u74E3\u7EB9\u7406",unit:"\u6279",hint:"\u7EB8\u8D34\u5408\u5728\u538B\u6A21\u5668\u8F74\u4E0A\uFF0C\u7528\u767D\u7EBF\u6CBF\u8F74\u4E00\u5708\u5708\u7F20\u7ED5\u3002\u7AD6\u76F4\u6446\u653E\u540E\u7528\u5C0F\u9524\u6572\u51FB\u4E0A\u65B9\u5E73\u53F0\u538B\u7F29\uFF0C\u518D\u5411\u4E0A\u62C9\u8D77\u5E73\u53F0\uFF0C\u89E3\u7EBF\u53D6\u51FA\u7EB8\u5F20\u3002"},{id:"petal_shaping",phase:2,name:"\u6298\u624E\u6210\u82B1\u74E3",short:"\u6298\u624E\u82B1\u74E3",tool:"string",total:4,station:"press",action:"\u5C06\u4E24\u5F20\u538B\u6A21\u7EB8\u53E0\u653E\u5E76\u7528\u94DC\u4E1D\u6298\u624E\u6210\u82B1\u74E3",unit:"\u6279",hint:"\u6BCF\u7247\u82B1\u74E3\u7531\u4E24\u5F20\u538B\u6A21\u540E\u7684\u82B1\u74E3\u7EB8\u53E0\u5728\u4E00\u8D77\uFF0C\u634F\u4F4F\u4E00\u89D2\u540E\u7528\u94DC\u4E1D\u6346\u624E\u56FA\u5B9A\u3002\u7EFF\u8272\u53F6\u7247\u76F4\u63A5\u4F7F\u7528\u6210\u54C1\u3002"},{id:"petal_assembly",phase:3,name:"\u7C98\u8D34\u56DB\u5C42\u7C89\u8272\u82B1\u74E3",short:"\u8D34\u7C89\u8272\u82B1\u74E3",tool:"paste",total:24,station:"assembly",action:"\u7528\u6D46\u7CCA\u7C98\u8D34\u4E0B\u4E00\u7247\u7C89\u8272\u82B1\u74E3",unit:"\u7247",hint:"\u7B2C\u4E00\u5C42\u8D34 6 \u7247\uFF1B\u968F\u540E\u4ECE\u4E0A\u5C42\u4E24\u7247\u82B1\u74E3\u4E4B\u95F4\u504F\u4E0B\u7684\u4F4D\u7F6E\u9519\u5F00\u7C98\u8D34\u3002\u5171\u56DB\u5C42\uFF0C\u6BCF\u5C42\u516D\u7247\u3002"},{id:"calyx_assembly",phase:3,name:"\u7C98\u8D34\u4E24\u5C42\u6210\u54C1\u7EFF\u53F6",short:"\u8D34\u6210\u54C1\u7EFF\u53F6",tool:"paste",total:12,station:"assembly",action:"\u7528\u6D46\u7CCA\u7C98\u8D34\u4E00\u7247\u6210\u54C1\u7EFF\u8272\u53F6\u7247",unit:"\u7247",hint:"\u5C06\u6210\u54C1\u7EFF\u8272\u53F6\u7247\u7C98\u8D34\u5728\u82B1\u706F\u4E0B\u90E8\uFF0C\u5171\u4E24\u5C42\uFF1B\u6700\u5E95\u5C42\u53CD\u5411\u7C98\u8D34\uFF0C\u4F7F\u5E95\u90E8\u81EA\u7136\u6536\u62E2\u3002"},{id:"top_flower_assembly",phase:4,name:"\u5B89\u88C5\u4E94\u4E2A\u6210\u54C1\u82B1\u5934",short:"\u88C5\u6210\u54C1\u82B1\u5934",tool:"paste",total:5,station:"assembly",action:"\u5C06\u4E00\u7EC4\u82B1\u830E\u548C\u6210\u54C1\u82B1\u5934\u56FA\u5B9A\u5230\u94C1\u4E1D\u652F\u67B6",unit:"\u7EC4",hint:"\u5C06\u82B1\u830E\u6839\u90E8\u63D2\u5165\u9884\u7559\u94C1\u4E1D\u652F\u67B6\uFF0C\u518D\u56FA\u5B9A\u6210\u54C1\u82B1\u5934\u3002\u6309\u4E0A\u4E09\u3001\u4E0B\u4E8C\u5E03\u7F6E\u4E94\u4E2A\u82B1\u5934\uFF0C\u5E76\u6574\u7406\u82B1\u5934\u3001\u82B1\u74E3\u4E0E\u53F6\u7247\u3002"},{id:"candle_installation",phase:4,name:"\u653E\u5165\u5E76\u56FA\u5B9A\u8721\u70DB",short:"\u653E\u8721\u70DB",tool:"light",total:1,station:"assembly",action:"\u5C06\u8721\u70DB\u653E\u5165\u82B1\u706F\u5185\u90E8",unit:"\u652F",hint:"\u5C06\u8721\u70DB\u653E\u5165\u706F\u4F53\u5185\u90E8\u5E76\u56FA\u5B9A\uFF0C\u5B8C\u6210\u8377\u82B1\u706F\u3002\u6E38\u620F\u5185\u8BD5\u706F\u4EC5\u4F5C\u89C6\u89C9\u6F14\u793A\u3002"},{id:"final_inspection",phase:4,name:"\u6574\u7406\u5E76\u8BD5\u706F",short:"\u6574\u7406\u8BD5\u706F",tool:"light",total:1,station:"assembly",action:"\u68C0\u67E5\u82B1\u706F\u5F62\u6001\u5E76\u8BD5\u706F",unit:"\u6B21",hint:"\u68C0\u67E5\u82B1\u5934\u3001\u82B1\u74E3\u4E0E\u7EFF\u8272\u53F6\u7247\u7684\u4F4D\u7F6E\uFF0C\u8C03\u6574\u6574\u4F53\u9020\u578B\u540E\u8BD5\u706F\u3002"}],ns=Array.from({length:dt.petals.count},(i,e)=>`petal-layer-${String(Math.floor(e/dt.petals.perLayer)+1).padStart(2,"0")}-${String(e%dt.petals.perLayer+1).padStart(2,"0")}`),Ls=Array.from({length:dt.leafCount},(i,e)=>`finished-leaf-${e+1}`),hh="qinhuai-lotus-workshop-v1",Jo="qinhuai-lotus-workshop-v3";var Ap={bamboo:"\u624E\u67B6\u53F0",assembly:"\u6CB3\u706F\u53F0",dye:"\u67D3\u7EB8\u53F0",press:"\u538B\u74E3\u53F0"},Rp={bamboo_prep:"62cm \u957F\u6761\u3001\u9002\u5F53\u957F\u5EA6\u957F\u6761\u3001\u68C9\u82B1\u7EB8\u637B",frame_assembly:"3 \u6839 40cm \u957F\u6761\u3001\u68C9\u82B1\u7EB8\u637B\u3001\u5927\u5708",frame_short_binding:"\u5C0F\u5708\u3001\u94C1\u4E1D\u3001\u68C9\u82B1\u7EB8\u637B",lining_lower:"\u6D46\u7CCA\u3001\u534A\u5706\u5F62\u65E0\u7EBA\u5E03\u3001\u526A\u5200",lining_upper:"\u6D46\u7CCA\u3001\u88F1\u5E03\u3001\u526A\u5200",paper_dye:"\u82B1\u74E3\u7EB8\u3001\u7C89\u7EA2\u8272\u67D3\u6599",paper_drying:"\u67D3\u597D\u7684\u82B1\u74E3\u7EB8\u3001\u9634\u5E72\u67B6",petal_pressing:"\u9634\u5E72\u82B1\u74E3\u7EB8\u3001\u767D\u7EBF\u3001\u538B\u6A21\u5668\u3001\u5C0F\u9524\u5B50",petal_shaping:"\u4E24\u5F20\u538B\u6A21\u82B1\u74E3\u7EB8\u3001\u94DC\u4E1D",petal_assembly:"\u7C89\u8272\u82B1\u74E3\u3001\u6D46\u7CCA\u3001\u88F1\u7CCA\u706F\u4F53",calyx_assembly:"\u6210\u54C1\u7EFF\u8272\u53F6\u7247\u3001\u6D46\u7CCA\u3001\u706F\u4F53",top_flower_assembly:"\u6210\u54C1\u82B1\u5934\u3001\u82B1\u830E\u3001\u94C1\u4E1D\u652F\u67B6",candle_installation:"\u8721\u70DB",final_inspection:"\u5B8C\u6210\u7684\u8377\u82B1\u706F"},Cp={bamboo_prep:["\u5C06 62cm \u957F\u6761\u53CC\u624B\u5F2F\u6210\u5927\u5708\uFF0C\u9996\u5C3E\u7559\u7EA6 1cm \u642D\u63A5\u3002","\u7528\u68C9\u82B1\u7EB8\u637B\u7F20\u7ED5\u642D\u63A5\u5904\uFF0C\u518D\u5F2F\u5236\u5E76\u6346\u624E\u5C0F\u5708\u3002","\u51C6\u5907\u4E09\u6839 40cm \u957F\u6761\uFF0C\u8FDB\u5165\u9AA8\u67B6\u56FA\u5B9A\u3002"],frame_assembly:["\u5C06\u6BCF\u6839 40cm \u957F\u6761\u5F2F\u6210\u5F27\u5F62\u3002","\u628A\u5927\u5708\u56FA\u5B9A\u5728\u4E09\u6839\u5F27\u5F62\u957F\u6761\u9760\u4E0A\u7684\u4F4D\u7F6E\u3002","\u5206\u522B\u5C06\u6BCF\u6839\u5F27\u5F62\u957F\u6761\u7684\u4E24\u7AEF\u7528\u68C9\u82B1\u7EB8\u637B\u6346\u624E\u3002"],frame_short_binding:["\u5C06\u5C0F\u5708\u56FA\u5B9A\u5728\u4E09\u6839\u5F27\u5F62\u957F\u6761\u9876\u7AEF\u3002","\u7528\u68C9\u82B1\u7EB8\u637B\u624E\u7D27\u6240\u6709\u8FDE\u63A5\u5904\u3002","\u7528\u94C1\u4E1D\u5236\u4F5C\u5E76\u56FA\u5B9A\u4E94\u4E2A\u82B1\u5934\u7684\u5B89\u88C5\u652F\u67B6\u3002"],lining_lower:["\u5728\u9AA8\u67B6\u8986\u76D6\u4F4D\u7F6E\u5747\u5300\u6D82\u6D46\u7CCA\u3002","\u6309\u9AA8\u67B6\u5F62\u72B6\u5206\u7247\u8D34\u534A\u5706\u5F62\u65E0\u7EBA\u5E03\u3002","\u4FEE\u526A\u8FB9\u7F18\u591A\u4F59\u5E03\u6599\uFF0C\u8BA9\u706F\u4F53\u8F6E\u5ED3\u6574\u9F50\u3002"],lining_upper:["\u7EE7\u7EED\u4E3A\u4E0A\u5C42\u9AA8\u67B6\u6D82\u6D46\u7CCA\u3002","\u8D34\u4E0A\u88F1\u5E03\uFF0C\u4FDD\u8BC1\u706F\u4F53\u8868\u9762\u5E73\u6574\u5B8C\u6574\u3002","\u68C0\u67E5\u8FB9\u7F18\u8D34\u5408\u5E76\u4FEE\u6574\u3002"],paper_dye:["\u5C06\u82B1\u74E3\u7EB8\u6D78\u5165\u7C89\u7EA2\u8272\u67D3\u6599\u3002","\u901A\u5E38\u6D78\u6CE1 2 \u81F3 3 \u5206\u949F\uFF0C\u6839\u636E\u989C\u8272\u6DF1\u6D45\u8C03\u6574\u3002","\u53D6\u51FA\u7EB8\u5F20\uFF0C\u51C6\u5907\u653E\u5230\u9634\u51C9\u5904\u9634\u5E72\u3002"],paper_drying:["\u5C06\u67D3\u597D\u7684\u82B1\u74E3\u7EB8\u653E\u5728\u9634\u51C9\u901A\u98CE\u5904\u3002","\u4E0D\u76F4\u63A5\u66B4\u6652\uFF0C\u7B49\u5F85\u7EB8\u5F20\u5B8C\u5168\u5E72\u900F\u3002","\u5E72\u900F\u540E\u8FDB\u5165\u538B\u6A21\u5DE5\u5E8F\u3002"],petal_pressing:["\u628A\u5E72\u7EB8\u8D34\u5728\u538B\u6A21\u5668\u8F74\u4E0A\uFF0C\u7528\u767D\u7EBF\u6CBF\u8F74\u4E00\u5708\u5708\u7F20\u7ED5\u3002","\u5C06\u538B\u6A21\u5668\u7AD6\u76F4\u6446\u653E\uFF0C\u7528\u5C0F\u9524\u6572\u4E0A\u65B9\u5E73\u53F0\u538B\u7F29\u8F74\u548C\u7EB8\u5F20\u3002","\u5411\u4E0A\u62C9\u8D77\u5E73\u53F0\uFF0C\u89E3\u5F00\u767D\u7EBF\u5E76\u53D6\u51FA\u538B\u597D\u7EB9\u7406\u7684\u7EB8\u3002"],petal_shaping:["\u53D6\u4E24\u5F20\u538B\u6A21\u540E\u7684\u82B1\u74E3\u7EB8\u53E0\u5728\u4E00\u8D77\u3002","\u8F7B\u634F\u7EB8\u5F20\u7684\u4E00\u89D2\u5F62\u6210\u82B1\u74E3\u6839\u90E8\u3002","\u7528\u94DC\u4E1D\u5C06\u8FD9\u4E00\u89D2\u6346\u624E\u56FA\u5B9A\u3002"],petal_assembly:["\u6700\u4E0A\u5C42\u7528\u6D46\u7CCA\u8D34 6 \u7247\u7C89\u8272\u82B1\u74E3\u3002","\u4E0B\u5C42\u4ECE\u4E0A\u5C42\u4E24\u7247\u82B1\u74E3\u4E4B\u95F4\u504F\u4E0B\u7684\u4F4D\u7F6E\u4EA4\u9519\u8D34\u3002","\u5171\u5B8C\u6210 4 \u5C42\u7C89\u8272\u82B1\u74E3\u3002"],calyx_assembly:["\u4F7F\u7528\u76F4\u63A5\u5907\u597D\u7684\u6210\u54C1\u7EFF\u8272\u53F6\u7247\u3002","\u5728\u706F\u4F53\u4E0B\u90E8\u7528\u6D46\u7CCA\u8D34\u4E24\u5C42\u7EFF\u53F6\u3002","\u6700\u5E95\u5C42\u7EFF\u53F6\u53CD\u5411\u7C98\u8D34\uFF0C\u6536\u62E2\u5E95\u90E8\u3002"],top_flower_assembly:["\u5C06\u82B1\u830E\u6839\u90E8\u63D2\u5165\u7B2C\u4E00\u6B65\u7684\u94C1\u4E1D\u652F\u67B6\u3002","\u56FA\u5B9A\u4E94\u4E2A\u6210\u54C1\u82B1\u5934\u3002","\u6309\u4E0A\u4E09\u3001\u4E0B\u4E8C\u5E03\u7F6E\u5E76\u8C03\u6574\u82B1\u5934\u3001\u82B1\u74E3\u548C\u53F6\u7247\u3002"],candle_installation:["\u5C06\u8721\u70DB\u653E\u5165\u706F\u4F53\u5185\u90E8\u3002","\u8C03\u6574\u4F4D\u7F6E\uFF0C\u786E\u4FDD\u8721\u70DB\u56FA\u5B9A\u7A33\u59A5\u3002","\u51C6\u5907\u6574\u7406\u6210\u54C1\u5E76\u8BD5\u706F\u3002"],final_inspection:["\u68C0\u67E5\u82B1\u5934\u3001\u82B1\u74E3\u548C\u53F6\u7247\u662F\u5426\u5206\u5E03\u5747\u5300\u3002","\u6574\u7406\u706F\u4F53\u6574\u4F53\u9020\u578B\u3002","\u8FDB\u884C\u8BD5\u706F\u89C2\u5BDF\u3002"]},Ds=It.map((i,e)=>({...i,number:e+1,location:Ap[i.station],materials:Rp[i.id],steps:Cp[i.id],note:i.hint}));function dh({getStage:i,onOpen:e}){let t=document.createElement("button");t.id="craft-book-open",t.innerHTML='<span class="book-mini">\u706F</span><span>\u505A\u706F\u4E66<small>B \xB7 \u968F\u65F6\u7FFB\u9605</small></span>',document.body.append(t);let n=document.createElement("dialog");n.id="craft-book",n.innerHTML=`<header class="book-head"><div><span class="book-imprint">\u79E6\u6DEE\u706F\u574A \xB7 \u624B\u4F5C\u62FE\u8981</span><h2>\u4E00\u518C\u505A\u706F\u4E66</h2></div><button id="book-close">\u5408\u5377 \xD7</button></header><div class="book-spread"><aside class="book-index"><div class="book-index-head"><span>\u76EE\u5F55</span><button id="book-current">\u5B9A\u4F4D\u5F53\u524D\u5DE5\u5E8F</button></div><nav>${Ds.map((l,u)=>`${u===0||l.phase!==Ds[u-1].phase?`<h3>${Ps[l.phase]}</h3>`:""}<button data-chapter="${u}"><span>${String(u+1).padStart(2,"0")}</span>${l.name}<i></i></button>`).join("")}</nav></aside><article class="book-leaf"><span id="book-chapter-kicker"></span><h3 id="book-chapter-title"></h3><div class="book-material"><b>\u672C\u6B65\u9AA4\u6750\u6599</b><p id="book-materials"></p></div><ol id="book-steps"></ol><aside class="book-margin-note"><b>\u5236\u4F5C\u8981\u70B9</b><p id="book-note"></p></aside></article></div><footer class="book-foot"><button id="book-prev">\u2190 \u524D\u4E00\u5DE5\u5E8F</button><span id="book-page"></span><button id="book-next">\u540E\u4E00\u5DE5\u5E8F \u2192</button></footer>`,document.body.append(n);let s=0,r=l=>document.getElementById(l);function o(){let l=Ds[s],u=i();r("book-chapter-kicker").textContent=`\u7B2C ${String(l.number).padStart(2,"0")} \u7AE0 \uFF0F ${l.location}${u===s?" \xB7 \u6B63\u5728\u5236\u4F5C":""}`,r("book-chapter-title").textContent=l.name,r("book-materials").textContent=l.materials,r("book-steps").innerHTML=l.steps.map(f=>`<li>${f}</li>`).join(""),r("book-note").textContent=l.note,r("book-page").textContent=`${l.number} / ${Ds.length}`,r("book-prev").disabled=s===0,r("book-next").disabled=s===Ds.length-1;for(let f of n.querySelectorAll("[data-chapter]"))f.toggleAttribute("aria-current",+f.dataset.chapter===s)}function a(){n.open||(s=i(),e(),o(),n.showModal())}function c(l){s=Math.max(0,Math.min(Ds.length-1,l)),o()}t.onclick=a,r("book-close").onclick=()=>n.close(),r("book-current").onclick=()=>c(i()),r("book-prev").onclick=()=>c(s-1),r("book-next").onclick=()=>c(s+1);for(let l of n.querySelectorAll("[data-chapter]"))l.onclick=()=>c(+l.dataset.chapter);return window.addEventListener("keydown",l=>{l.code==="KeyB"&&!l.repeat&&!["INPUT","TEXTAREA","SELECT"].includes(l.target.tagName)&&(l.preventDefault(),n.open?n.close():a()),n.open&&["ArrowLeft","ArrowRight"].includes(l.code)&&(l.preventDefault(),c(s+(l.code==="ArrowLeft"?-1:1)))}),{open:a}}var jh=0,au=1,Qh=2;var lu=1,sl=2,hi=3,Ei=0,pn=1,pt=2,Ai=0,ls=1,cu=2,uu=3,hu=4,ed=5,ki=100,td=101,nd=102,id=103,sd=104,rd=200,od=201,ad=202,ld=203,Aa=204,Ra=205,cd=206,ud=207,hd=208,dd=209,fd=210,pd=211,md=212,gd=213,_d=214,rl=0,ol=1,al=2,cs=3,ll=4,cl=5,ul=6,hl=7,du=0,yd=1,xd=2,Ri=0,vd=1,Md=2,bd=3,dl=4,Sd=5,Ed=6,wd=7,$c="attached",Td="detached",fu=300,fs=301,ps=302,fl=303,pl=304,Ao=306,Ks=1e3,Bi=1001,Ca=1002,vn=1003,Ad=1004;var Ro=1005;var jn=1006,ml=1007;var Xi=1008;var ni=1009,pu=1010,mu=1011,pr=1012,gl=1013,qi=1014,ii=1015,mr=1016,_l=1017,yl=1018,gr=1020,gu=35902,_u=35899,yu=1021,xu=1022,Dn=1023,js=1026,_r=1027,vu=1028,xl=1029,Mu=1030,vl=1031;var Ml=1033,Co=33776,Io=33777,Po=33778,Lo=33779,bl=35840,Sl=35841,El=35842,wl=35843,Tl=36196,Al=37492,Rl=37496,Cl=37808,Il=37809,Pl=37810,Ll=37811,Dl=37812,Ul=37813,Nl=37814,Fl=37815,Ol=37816,Bl=37817,kl=37818,Hl=37819,zl=37820,Vl=37821,Gl=36492,Wl=36494,Xl=36495,ql=36283,Yl=36284,$l=36285,Zl=36286;var Yr=2300,Ia=2301,Ta=2302,Zc=2400,Jc=2401,Kc=2402;var Rd=3200,Cd=3201;var bu=0,Id=1,Ci="",kt="srgb",us="srgb-linear",$r="linear",xt="srgb";var as=7680;var jc=519,Pd=512,Ld=513,Dd=514,Su=515,Ud=516,Nd=517,Fd=518,Od=519,Pa=35044;var Eu="300 es",Jn=2e3,Zr=2001;var wi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fh=1234567,Gr=Math.PI/180,Qs=180/Math.PI;function Kn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[i&255]+sn[i>>8&255]+sn[i>>16&255]+sn[i>>24&255]+"-"+sn[e&255]+sn[e>>8&255]+"-"+sn[e>>16&15|64]+sn[e>>24&255]+"-"+sn[t&63|128]+sn[t>>8&255]+"-"+sn[t>>16&255]+sn[t>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function ot(i,e,t){return Math.max(e,Math.min(t,i))}function wu(i,e){return(i%e+e)%e}function Ip(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Pp(i,e,t){return i!==e?(t-i)/(e-i):0}function Wr(i,e,t){return(1-t)*i+t*e}function Lp(i,e,t,n){return Wr(i,e,1-Math.exp(-t*n))}function Dp(i,e=1){return e-Math.abs(wu(i,e*2)-e)}function Up(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Np(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Fp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Op(i,e){return i+Math.random()*(e-i)}function Bp(i){return i*(.5-Math.random())}function kp(i){i!==void 0&&(fh=i);let e=fh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Hp(i){return i*Gr}function zp(i){return i*Qs}function Vp(i){return(i&i-1)===0&&i!==0}function Gp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),f=r((e-n)/2),d=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,c*f,c*d,a*l);break;case"YZY":i.set(c*d,a*u,c*f,a*l);break;case"ZXZ":i.set(c*f,c*d,a*u,a*l);break;case"XZX":i.set(a*u,c*g,c*p,a*l);break;case"YXY":i.set(c*p,a*u,c*g,a*l);break;case"ZYZ":i.set(c*g,c*p,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Xt={DEG2RAD:Gr,RAD2DEG:Qs,generateUUID:Kn,clamp:ot,euclideanModulo:wu,mapLinear:Ip,inverseLerp:Pp,lerp:Wr,damp:Lp,pingpong:Dp,smoothstep:Up,smootherstep:Np,randInt:Fp,randFloat:Op,randFloatSpread:Bp,seededRandom:kp,degToRad:Hp,radToDeg:zp,isPowerOfTwo:Vp,ceilPowerOfTwo:Gp,floorPowerOfTwo:Wp,setQuaternionFromProperEuler:Xp,normalize:yt,denormalize:Zn},Ce=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Qn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],f=n[s+3],d=r[o+0],p=r[o+1],g=r[o+2],y=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=f;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=y;return}if(f!==y||c!==d||l!==p||u!==g){let m=1-a,h=c*d+l*p+u*g+f*y,_=h>=0?1:-1,x=1-h*h;if(x>Number.EPSILON){let T=Math.sqrt(x),E=Math.atan2(T,h*_);m=Math.sin(m*E)/T,a=Math.sin(a*E)/T}let v=a*_;if(c=c*m+d*v,l=l*m+p*v,u=u*m+g*v,f=f*m+y*v,m===1-a){let T=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=T,l*=T,u*=T,f*=T}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],f=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*f+c*p-l*d,e[t+1]=c*g+u*d+l*f-a*p,e[t+2]=l*g+u*p+a*d-c*f,e[t+3]=u*g-a*f-c*d-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),f=a(r/2),d=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*u*f+l*p*g,this._y=l*p*f-d*u*g,this._z=l*u*g+d*p*f,this._w=l*u*f-d*p*g;break;case"YXZ":this._x=d*u*f+l*p*g,this._y=l*p*f-d*u*g,this._z=l*u*g-d*p*f,this._w=l*u*f+d*p*g;break;case"ZXY":this._x=d*u*f-l*p*g,this._y=l*p*f+d*u*g,this._z=l*u*g+d*p*f,this._w=l*u*f-d*p*g;break;case"ZYX":this._x=d*u*f-l*p*g,this._y=l*p*f+d*u*g,this._z=l*u*g-d*p*f,this._w=l*u*f+d*p*g;break;case"YZX":this._x=d*u*f+l*p*g,this._y=l*p*f+d*u*g,this._z=l*u*g-d*p*f,this._w=l*u*f-d*p*g;break;case"XZY":this._x=d*u*f-l*p*g,this._y=l*p*f-d*u*g,this._z=l*u*g+d*p*f,this._w=l*u*f+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],f=t[10],d=n+a+f;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>f){let p=2*Math.sqrt(1+n-a-f);this._w=(u-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>f){let p=2*Math.sqrt(1+a-n-f);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+f-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ot(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,a),f=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=o*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ph.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ph.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),f=2*(r*n-o*t);return this.x=t+c*l+o*f-a*u,this.y=n+c*u+a*l-r*f,this.z=s+c*f+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return yc.copy(this).projectOnVector(e),this.sub(yc)}reflect(e){return this.sub(yc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},yc=new O,ph=new Qn,et=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],f=n[7],d=n[2],p=n[5],g=n[8],y=s[0],m=s[3],h=s[6],_=s[1],x=s[4],v=s[7],T=s[2],E=s[5],C=s[8];return r[0]=o*y+a*_+c*T,r[3]=o*m+a*x+c*E,r[6]=o*h+a*v+c*C,r[1]=l*y+u*_+f*T,r[4]=l*m+u*x+f*E,r[7]=l*h+u*v+f*C,r[2]=d*y+p*_+g*T,r[5]=d*m+p*x+g*E,r[8]=d*h+p*v+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=u*o-a*l,d=a*c-u*r,p=l*r-o*c,g=t*f+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=f*y,e[1]=(s*l-u*n)*y,e[2]=(a*n-s*o)*y,e[3]=d*y,e[4]=(u*t-s*c)*y,e[5]=(s*r-a*t)*y,e[6]=p*y,e[7]=(n*c-l*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(xc.makeScale(e,t)),this}rotate(e){return this.premultiply(xc.makeRotation(-e)),this}translate(e,t){return this.premultiply(xc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},xc=new et;function Tu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Bd(){let i=Jr("canvas");return i.style.display="block",i}var mh={};function er(i){i in mh||(mh[i]=!0,console.warn(i))}function kd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var gh=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_h=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qp(){let i={enabled:!0,workingColorSpace:us,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===xt&&(s.r=Si(s.r),s.g=Si(s.g),s.b=Si(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===xt&&(s.r=Js(s.r),s.g=Js(s.g),s.b=Js(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ci?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return er("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return er("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[us]:{primaries:e,whitePoint:n,transfer:$r,toXYZ:gh,fromXYZ:_h,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:gh,fromXYZ:_h,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}}),i}var ut=qp();function Si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Js(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Us,La=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Us===void 0&&(Us=Jr("canvas")),Us.width=e.width,Us.height=e.height;let s=Us.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Jr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Si(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Si(t[n]/255)*255):t[n]=Si(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Yp=0,tr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=Kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(vc(s[o].image)):r.push(vc(s[o]))}else r=vc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function vc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?La.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var $p=0,Mc=new O,dn=class i extends wi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Bi,s=Bi,r=jn,o=Xi,a=Dn,c=ni,l=i.DEFAULT_ANISOTROPY,u=Ci){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$p++}),this.uuid=Kn(),this.name="",this.source=new tr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ce(0,0),this.repeat=new Ce(1,1),this.center=new Ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Mc).x}get height(){return this.source.getSize(Mc).y}get depth(){return this.source.getSize(Mc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ks:e.x=e.x-Math.floor(e.x);break;case Bi:e.x=e.x<0?0:1;break;case Ca:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ks:e.y=e.y-Math.floor(e.y);break;case Bi:e.y=e.y<0?0:1;break;case Ca:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=fu;dn.DEFAULT_ANISOTROPY=1;var ft=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],u=c[4],f=c[8],d=c[1],p=c[5],g=c[9],y=c[2],m=c[6],h=c[10];if(Math.abs(u-d)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(l+1)/2,v=(p+1)/2,T=(h+1)/2,E=(u+d)/4,C=(f+y)/4,U=(g+m)/4;return x>v&&x>T?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=E/n,r=C/n):v>T?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=E/s,r=U/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=U/r),this.set(n,s,r,t),this}let _=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(d-u)*(d-u));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(f-y)/_,this.z=(d-u)/_,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this.w=ot(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this.w=ot(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Da=class extends wi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new dn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:jn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new tr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ci=class extends Da{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Kr=class extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=vn,this.minFilter=vn,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ua=class extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=vn,this.minFilter=vn,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var zt=class{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(r,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ko.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ko.copy(n.boundingBox)),Ko.applyMatrix4(e.matrixWorld),this.union(Ko)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dr),jo.subVectors(this.max,Dr),Ns.subVectors(e.a,Dr),Fs.subVectors(e.b,Dr),Os.subVectors(e.c,Dr),Li.subVectors(Fs,Ns),Di.subVectors(Os,Fs),is.subVectors(Ns,Os);let t=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-is.z,is.y,Li.z,0,-Li.x,Di.z,0,-Di.x,is.z,0,-is.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-is.y,is.x,0];return!bc(t,Ns,Fs,Os,jo)||(t=[1,0,0,0,1,0,0,0,1],!bc(t,Ns,Fs,Os,jo))?!1:(Qo.crossVectors(Li,Di),t=[Qo.x,Qo.y,Qo.z],bc(t,Ns,Fs,Os,jo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},_i=[new O,new O,new O,new O,new O,new O,new O,new O],qn=new O,Ko=new zt,Ns=new O,Fs=new O,Os=new O,Li=new O,Di=new O,is=new O,Dr=new O,jo=new O,Qo=new O,ss=new O;function bc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ss.fromArray(i,r);let a=s.x*Math.abs(ss.x)+s.y*Math.abs(ss.y)+s.z*Math.abs(ss.z),c=e.dot(ss),l=t.dot(ss),u=n.dot(ss);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var Zp=new zt,Ur=new O,Sc=new O,ui=class{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Zp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ur.subVectors(e,this.center);let t=Ur.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ur,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ur.copy(e.center).add(Sc)),this.expandByPoint(Ur.copy(e.center).sub(Sc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},yi=new O,Ec=new O,ea=new O,Ui=new O,wc=new O,ta=new O,Tc=new O,Hi=class{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=yi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yi.copy(this.origin).addScaledVector(this.direction,t),yi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ec.copy(e).add(t).multiplyScalar(.5),ea.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(Ec);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ea),a=Ui.dot(this.direction),c=-Ui.dot(ea),l=Ui.lengthSq(),u=Math.abs(1-o*o),f,d,p,g;if(u>0)if(f=o*c-a,d=o*a-c,g=r*u,f>=0)if(d>=-g)if(d<=g){let y=1/u;f*=y,d*=y,p=f*(f+o*d+2*a)+d*(o*f+d+2*c)+l}else d=r,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*c)+l;else d=-r,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*c)+l;else d<=-g?(f=Math.max(0,-(-o*r+a)),d=f>0?-r:Math.min(Math.max(-r,-c),r),p=-f*f+d*(d+2*c)+l):d<=g?(f=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(f=Math.max(0,-(o*r+a)),d=f>0?r:Math.min(Math.max(-r,-c),r),p=-f*f+d*(d+2*c)+l);else d=o>0?-r:r,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ec).addScaledVector(ea,d),p}intersectSphere(e,t){yi.subVectors(e.center,this.origin);let n=yi.dot(this.direction),s=yi.dot(yi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-d.z)*f,c=(e.max.z-d.z)*f):(a=(e.max.z-d.z)*f,c=(e.min.z-d.z)*f),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,yi)!==null}intersectTriangle(e,t,n,s,r){wc.subVectors(t,e),ta.subVectors(n,e),Tc.crossVectors(wc,ta);let o=this.direction.dot(Tc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ui.subVectors(this.origin,e);let c=a*this.direction.dot(ta.crossVectors(Ui,ta));if(c<0)return null;let l=a*this.direction.dot(wc.cross(Ui));if(l<0||c+l>o)return null;let u=-a*Ui.dot(Tc);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},at=class i{constructor(e,t,n,s,r,o,a,c,l,u,f,d,p,g,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,f,d,p,g,y,m)}set(e,t,n,s,r,o,a,c,l,u,f,d,p,g,y,m){let h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=s,h[1]=r,h[5]=o,h[9]=a,h[13]=c,h[2]=l,h[6]=u,h[10]=f,h[14]=d,h[3]=p,h[7]=g,h[11]=y,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Bs.setFromMatrixColumn(e,0).length(),r=1/Bs.setFromMatrixColumn(e,1).length(),o=1/Bs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let d=o*u,p=o*f,g=a*u,y=a*f;t[0]=c*u,t[4]=-c*f,t[8]=l,t[1]=p+g*l,t[5]=d-y*l,t[9]=-a*c,t[2]=y-d*l,t[6]=g+p*l,t[10]=o*c}else if(e.order==="YXZ"){let d=c*u,p=c*f,g=l*u,y=l*f;t[0]=d+y*a,t[4]=g*a-p,t[8]=o*l,t[1]=o*f,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=y+d*a,t[10]=o*c}else if(e.order==="ZXY"){let d=c*u,p=c*f,g=l*u,y=l*f;t[0]=d-y*a,t[4]=-o*f,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=y-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let d=o*u,p=o*f,g=a*u,y=a*f;t[0]=c*u,t[4]=g*l-p,t[8]=d*l+y,t[1]=c*f,t[5]=y*l+d,t[9]=p*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let d=o*c,p=o*l,g=a*c,y=a*l;t[0]=c*u,t[4]=y-d*f,t[8]=g*f+p,t[1]=f,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=p*f+g,t[10]=d-y*f}else if(e.order==="XZY"){let d=o*c,p=o*l,g=a*c,y=a*l;t[0]=c*u,t[4]=-f,t[8]=l*u,t[1]=d*f+y,t[5]=o*u,t[9]=p*f-g,t[2]=g*f-p,t[6]=a*u,t[10]=y*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jp,e,Kp)}lookAt(e,t,n){let s=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),Ni.crossVectors(n,An),Ni.lengthSq()===0&&(Math.abs(n.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),Ni.crossVectors(n,An)),Ni.normalize(),na.crossVectors(An,Ni),s[0]=Ni.x,s[4]=na.x,s[8]=An.x,s[1]=Ni.y,s[5]=na.y,s[9]=An.y,s[2]=Ni.z,s[6]=na.z,s[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],f=n[5],d=n[9],p=n[13],g=n[2],y=n[6],m=n[10],h=n[14],_=n[3],x=n[7],v=n[11],T=n[15],E=s[0],C=s[4],U=s[8],M=s[12],S=s[1],D=s[5],H=s[9],G=s[13],F=s[2],W=s[6],K=s[10],he=s[14],ee=s[3],be=s[7],te=s[11],Ee=s[15];return r[0]=o*E+a*S+c*F+l*ee,r[4]=o*C+a*D+c*W+l*be,r[8]=o*U+a*H+c*K+l*te,r[12]=o*M+a*G+c*he+l*Ee,r[1]=u*E+f*S+d*F+p*ee,r[5]=u*C+f*D+d*W+p*be,r[9]=u*U+f*H+d*K+p*te,r[13]=u*M+f*G+d*he+p*Ee,r[2]=g*E+y*S+m*F+h*ee,r[6]=g*C+y*D+m*W+h*be,r[10]=g*U+y*H+m*K+h*te,r[14]=g*M+y*G+m*he+h*Ee,r[3]=_*E+x*S+v*F+T*ee,r[7]=_*C+x*D+v*W+T*be,r[11]=_*U+x*H+v*K+T*te,r[15]=_*M+x*G+v*he+T*Ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],f=e[6],d=e[10],p=e[14],g=e[3],y=e[7],m=e[11],h=e[15];return g*(+r*c*f-s*l*f-r*a*d+n*l*d+s*a*p-n*c*p)+y*(+t*c*p-t*l*d+r*o*d-s*o*p+s*l*u-r*c*u)+m*(+t*l*f-t*a*p-r*o*f+n*o*p+r*a*u-n*l*u)+h*(-s*a*u-t*c*f+t*a*d+s*o*f-n*o*d+n*c*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=e[9],d=e[10],p=e[11],g=e[12],y=e[13],m=e[14],h=e[15],_=f*m*l-y*d*l+y*c*p-a*m*p-f*c*h+a*d*h,x=g*d*l-u*m*l-g*c*p+o*m*p+u*c*h-o*d*h,v=u*y*l-g*f*l+g*a*p-o*y*p-u*a*h+o*f*h,T=g*f*c-u*y*c-g*a*d+o*y*d+u*a*m-o*f*m,E=t*_+n*x+s*v+r*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/E;return e[0]=_*C,e[1]=(y*d*r-f*m*r-y*s*p+n*m*p+f*s*h-n*d*h)*C,e[2]=(a*m*r-y*c*r+y*s*l-n*m*l-a*s*h+n*c*h)*C,e[3]=(f*c*r-a*d*r-f*s*l+n*d*l+a*s*p-n*c*p)*C,e[4]=x*C,e[5]=(u*m*r-g*d*r+g*s*p-t*m*p-u*s*h+t*d*h)*C,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*h-t*c*h)*C,e[7]=(o*d*r-u*c*r+u*s*l-t*d*l-o*s*p+t*c*p)*C,e[8]=v*C,e[9]=(g*f*r-u*y*r-g*n*p+t*y*p+u*n*h-t*f*h)*C,e[10]=(o*y*r-g*a*r+g*n*l-t*y*l-o*n*h+t*a*h)*C,e[11]=(u*a*r-o*f*r-u*n*l+t*f*l+o*n*p-t*a*p)*C,e[12]=T*C,e[13]=(u*y*s-g*f*s+g*n*d-t*y*d-u*n*m+t*f*m)*C,e[14]=(g*a*s-o*y*s-g*n*c+t*y*c+o*n*m-t*a*m)*C,e[15]=(o*f*s-u*a*s+u*n*c-t*f*c-o*n*d+t*a*d)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,f=a+a,d=r*l,p=r*u,g=r*f,y=o*u,m=o*f,h=a*f,_=c*l,x=c*u,v=c*f,T=n.x,E=n.y,C=n.z;return s[0]=(1-(y+h))*T,s[1]=(p+v)*T,s[2]=(g-x)*T,s[3]=0,s[4]=(p-v)*E,s[5]=(1-(d+h))*E,s[6]=(m+_)*E,s[7]=0,s[8]=(g+x)*C,s[9]=(m-_)*C,s[10]=(1-(d+y))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Bs.set(s[0],s[1],s[2]).length(),o=Bs.set(s[4],s[5],s[6]).length(),a=Bs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Yn.copy(this);let l=1/r,u=1/o,f=1/a;return Yn.elements[0]*=l,Yn.elements[1]*=l,Yn.elements[2]*=l,Yn.elements[4]*=u,Yn.elements[5]*=u,Yn.elements[6]*=u,Yn.elements[8]*=f,Yn.elements[9]*=f,Yn.elements[10]*=f,t.setFromRotationMatrix(Yn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Jn,c=!1){let l=this.elements,u=2*r/(t-e),f=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s),g,y;if(c)g=r/(o-r),y=o*r/(o-r);else if(a===Jn)g=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Zr)g=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=f,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Jn,c=!1){let l=this.elements,u=2/(t-e),f=2/(n-s),d=-(t+e)/(t-e),p=-(n+s)/(n-s),g,y;if(c)g=1/(o-r),y=o/(o-r);else if(a===Jn)g=-2/(o-r),y=-(o+r)/(o-r);else if(a===Zr)g=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=f,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Bs=new O,Yn=new at,Jp=new O(0,0,0),Kp=new O(1,1,1),Ni=new O,na=new O,An=new O,yh=new at,xh=new Qn,fn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],f=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ot(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ot(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ot(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ot(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return yh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(yh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xh.setFromEuler(this),this.setFromQuaternion(xh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fn.DEFAULT_ORDER="XYZ";var nr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},jp=0,vh=new O,ks=new Qn,xi=new at,ia=new O,Nr=new O,Qp=new O,em=new Qn,Mh=new O(1,0,0),bh=new O(0,1,0),Sh=new O(0,0,1),Eh={type:"added"},tm={type:"removed"},Hs={type:"childadded",child:null},Ac={type:"childremoved",child:null},Vt=class i extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new O,t=new fn,n=new Qn,s=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new at},normalMatrix:{value:new et}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.multiply(ks),this}rotateOnWorldAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.premultiply(ks),this}rotateX(e){return this.rotateOnAxis(Mh,e)}rotateY(e){return this.rotateOnAxis(bh,e)}rotateZ(e){return this.rotateOnAxis(Sh,e)}translateOnAxis(e,t){return vh.copy(e).applyQuaternion(this.quaternion),this.position.add(vh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mh,e)}translateY(e){return this.translateOnAxis(bh,e)}translateZ(e){return this.translateOnAxis(Sh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ia.copy(e):ia.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(Nr,ia,this.up):xi.lookAt(ia,Nr,this.up),this.quaternion.setFromRotationMatrix(xi),s&&(xi.extractRotation(s.matrixWorld),ks.setFromRotationMatrix(xi),this.quaternion.premultiply(ks.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Eh),Hs.child=e,this.dispatchEvent(Hs),Hs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tm),Ac.child=e,this.dispatchEvent(Ac),Ac.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Eh),Hs.child=e,this.dispatchEvent(Hs),Hs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,e,Qp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,em,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let f=c[l];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),f=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Vt.DEFAULT_UP=new O(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $n=new O,vi=new O,Rc=new O,Mi=new O,zs=new O,Vs=new O,wh=new O,Cc=new O,Ic=new O,Pc=new O,Lc=new ft,Dc=new ft,Uc=new ft,bi=class i{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),$n.subVectors(e,t),s.cross($n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){$n.subVectors(s,t),vi.subVectors(n,t),Rc.subVectors(e,t);let o=$n.dot($n),a=$n.dot(vi),c=$n.dot(Rc),l=vi.dot(vi),u=vi.dot(Rc),f=o*l-a*a;if(f===0)return r.set(0,0,0),null;let d=1/f,p=(l*c-a*u)*d,g=(o*u-a*c)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Mi.x),c.addScaledVector(o,Mi.y),c.addScaledVector(a,Mi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return Lc.setScalar(0),Dc.setScalar(0),Uc.setScalar(0),Lc.fromBufferAttribute(e,t),Dc.fromBufferAttribute(e,n),Uc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Lc,r.x),o.addScaledVector(Dc,r.y),o.addScaledVector(Uc,r.z),o}static isFrontFacing(e,t,n,s){return $n.subVectors(n,t),vi.subVectors(e,t),$n.cross(vi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $n.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),$n.cross(vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;zs.subVectors(s,n),Vs.subVectors(r,n),Cc.subVectors(e,n);let c=zs.dot(Cc),l=Vs.dot(Cc);if(c<=0&&l<=0)return t.copy(n);Ic.subVectors(e,s);let u=zs.dot(Ic),f=Vs.dot(Ic);if(u>=0&&f<=u)return t.copy(s);let d=c*f-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(zs,o);Pc.subVectors(e,r);let p=zs.dot(Pc),g=Vs.dot(Pc);if(g>=0&&p<=g)return t.copy(r);let y=p*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Vs,a);let m=u*g-p*f;if(m<=0&&f-u>=0&&p-g>=0)return wh.subVectors(r,s),a=(f-u)/(f-u+(p-g)),t.copy(s).addScaledVector(wh,a);let h=1/(m+y+d);return o=y*h,a=d*h,t.copy(n).addScaledVector(zs,o).addScaledVector(Vs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Hd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},sa={h:0,s:0,l:0};function Nc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ye=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,ut.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ut.workingColorSpace){if(e=wu(e,1),t=ot(t,0,1),n=ot(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Nc(o,r,e+1/3),this.g=Nc(o,r,e),this.b=Nc(o,r,e-1/3)}return ut.colorSpaceToWorking(this,s),this}setStyle(e,t=kt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let n=Hd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return ut.workingToColorSpace(rn.copy(this),e),Math.round(ot(rn.r*255,0,255))*65536+Math.round(ot(rn.g*255,0,255))*256+Math.round(ot(rn.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.workingToColorSpace(rn.copy(this),t);let n=rn.r,s=rn.g,r=rn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let f=o-a;switch(l=u<=.5?f/(o+a):f/(2-o-a),o){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=ut.workingColorSpace){return ut.workingToColorSpace(rn.copy(this),t),e.r=rn.r,e.g=rn.g,e.b=rn.b,e}getStyle(e=kt){ut.workingToColorSpace(rn.copy(this),e);let t=rn.r,n=rn.g,s=rn.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+t,Fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fi),e.getHSL(sa);let n=Wr(Fi.h,sa.h,t),s=Wr(Fi.s,sa.s,t),r=Wr(Fi.l,sa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},rn=new Ye;Ye.NAMES=Hd;var nm=0,ei=class extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=Kn(),this.name="",this.type="Material",this.blending=ls,this.side=Ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ra,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=as,this.stencilZFail=as,this.stencilZPass=as,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ls&&(n.blending=this.blending),this.side!==Ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ra&&(n.blendDst=this.blendDst),this.blendEquation!==ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==as&&(n.stencilFail=this.stencilFail),this.stencilZFail!==as&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==as&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ft=class extends ei{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=du,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Bt=new O,ra=new Ce,im=0,Nt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:im++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Pa,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ra.fromBufferAttribute(this,t),ra.applyMatrix3(e),this.setXY(t,ra.x,ra.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix3(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pa&&(e.usage=this.usage),e}};var zi=class extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var jr=class extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var it=class extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}},sm=0,zn=new at,Fc=new Vt,Gs=new O,Rn=new zt,Fr=new zt,en=new O,st=class i extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Tu(e)?jr:zi)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,t,n){return zn.makeTranslation(e,t,n),this.applyMatrix4(zn),this}scale(e,t,n){return zn.makeScale(e,t,n),this.applyMatrix4(zn),this}lookAt(e){return Fc.lookAt(e),Fc.updateMatrix(),this.applyMatrix4(Fc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gs).negate(),this.translate(Gs.x,Gs.y,Gs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new it(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Fr.setFromBufferAttribute(a),this.morphTargetsRelative?(en.addVectors(Rn.min,Fr.min),Rn.expandByPoint(en),en.addVectors(Rn.max,Fr.max),Rn.expandByPoint(en)):(Rn.expandByPoint(Fr.min),Rn.expandByPoint(Fr.max))}Rn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)en.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(en));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)en.fromBufferAttribute(a,l),c&&(Gs.fromBufferAttribute(e,l),en.add(Gs)),s=Math.max(s,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let U=0;U<n.count;U++)a[U]=new O,c[U]=new O;let l=new O,u=new O,f=new O,d=new Ce,p=new Ce,g=new Ce,y=new O,m=new O;function h(U,M,S){l.fromBufferAttribute(n,U),u.fromBufferAttribute(n,M),f.fromBufferAttribute(n,S),d.fromBufferAttribute(r,U),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,S),u.sub(l),f.sub(l),p.sub(d),g.sub(d);let D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(f,-p.y).multiplyScalar(D),m.copy(f).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(D),a[U].add(y),a[M].add(y),a[S].add(y),c[U].add(m),c[M].add(m),c[S].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let U=0,M=_.length;U<M;++U){let S=_[U],D=S.start,H=S.count;for(let G=D,F=D+H;G<F;G+=3)h(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let x=new O,v=new O,T=new O,E=new O;function C(U){T.fromBufferAttribute(s,U),E.copy(T);let M=a[U];x.copy(M),x.sub(T.multiplyScalar(T.dot(M))).normalize(),v.crossVectors(E,M);let D=v.dot(c[U])<0?-1:1;o.setXYZW(U,x.x,x.y,x.z,D)}for(let U=0,M=_.length;U<M;++U){let S=_[U],D=S.start,H=S.count;for(let G=D,F=D+H;G<F;G+=3)C(e.getX(G+0)),C(e.getX(G+1)),C(e.getX(G+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new O,r=new O,o=new O,a=new O,c=new O,l=new O,u=new O,f=new O;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),y=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,f=a.normalized,d=new l.constructor(c.length*u),p=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?p=c[y]*a.data.stride+a.offset:p=c[y]*u;for(let h=0;h<u;h++)d[g++]=l[p++]}return new Nt(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,f=l.length;u<f;u++){let d=l[u],p=e(d,n);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let f=0,d=l.length;f<d;f++){let p=l[f];u.push(p.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],f=r[l];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Th=new at,rs=new Hi,oa=new ui,Ah=new O,aa=new O,la=new O,ca=new O,Oc=new O,ua=new O,Rh=new O,ha=new O,Ue=class extends Vt{constructor(e=new st,t=new Ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ua.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],f=r[c];u!==0&&(Oc.fromBufferAttribute(f,e),o?ua.addScaledVector(Oc,u):ua.addScaledVector(Oc.sub(t),u))}t.add(ua)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(r),rs.copy(e.ray).recast(e.near),!(oa.containsPoint(rs.origin)===!1&&(rs.intersectSphere(oa,Ah)===null||rs.origin.distanceToSquared(Ah)>(e.far-e.near)**2))&&(Th.copy(r).invert(),rs.copy(e.ray).applyMatrix4(Th),!(n.boundingBox!==null&&rs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,rs)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){let m=d[g],h=o[m.materialIndex],_=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let v=_,T=x;v<T;v+=3){let E=a.getX(v),C=a.getX(v+1),U=a.getX(v+2);s=da(this,h,e,n,l,u,f,E,C,U),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let m=g,h=y;m<h;m+=3){let _=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);s=da(this,o,e,n,l,u,f,_,x,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){let m=d[g],h=o[m.materialIndex],_=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let v=_,T=x;v<T;v+=3){let E=v,C=v+1,U=v+2;s=da(this,h,e,n,l,u,f,E,C,U),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(c.count,p.start+p.count);for(let m=g,h=y;m<h;m+=3){let _=m,x=m+1,v=m+2;s=da(this,o,e,n,l,u,f,_,x,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function rm(i,e,t,n,s,r,o,a){let c;if(e.side===pn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Ei,a),c===null)return null;ha.copy(a),ha.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ha);return l<t.near||l>t.far?null:{distance:l,point:ha.clone(),object:i}}function da(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,aa),i.getVertexPosition(c,la),i.getVertexPosition(l,ca);let u=rm(i,e,t,n,aa,la,ca,Rh);if(u){let f=new O;bi.getBarycoord(Rh,aa,la,ca,f),s&&(u.uv=bi.getInterpolatedAttribute(s,a,c,l,f,new Ce)),r&&(u.uv1=bi.getInterpolatedAttribute(r,a,c,l,f,new Ce)),o&&(u.normal=bi.getInterpolatedAttribute(o,a,c,l,f,new O),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new O,materialIndex:0};bi.getNormal(aa,la,ca,d.normal),u.face=d,u.barycoord=f}return u}var bt=class i extends st{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],f=[],d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new it(l,3)),this.setAttribute("normal",new it(u,3)),this.setAttribute("uv",new it(f,2));function g(y,m,h,_,x,v,T,E,C,U,M){let S=v/C,D=T/U,H=v/2,G=T/2,F=E/2,W=C+1,K=U+1,he=0,ee=0,be=new O;for(let te=0;te<K;te++){let Ee=te*D-G;for(let Ie=0;Ie<W;Ie++){let V=Ie*S-H;be[y]=V*_,be[m]=Ee*x,be[h]=F,l.push(be.x,be.y,be.z),be[y]=0,be[m]=0,be[h]=E>0?1:-1,u.push(be.x,be.y,be.z),f.push(Ie/C),f.push(1-te/U),he+=1}}for(let te=0;te<U;te++)for(let Ee=0;Ee<C;Ee++){let Ie=d+Ee+W*te,V=d+Ee+W*(te+1),ue=d+(Ee+1)+W*(te+1),Re=d+(Ee+1)+W*te;c.push(Ie,V,Re),c.push(V,ue,Re),ee+=6}a.addGroup(p,ee,M),p+=ee,d+=he}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ms(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function on(i){let e={};for(let t=0;t<i.length;t++){let n=ms(i[t]);for(let s in n)e[s]=n[s]}return e}function om(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Au(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}var zd={clone:ms,merge:on},am=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ti=class extends ei{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=am,this.fragmentShader=lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ms(e.uniforms),this.uniformsGroups=om(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Qr=class extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=Jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Oi=new O,Ch=new Ce,Ih=new Ce,Wt=class extends Qr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Qs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Gr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qs*2*Math.atan(Math.tan(Gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z)}getViewSize(e,t){return this.getViewBounds(e,Ch,Ih),t.subVectors(Ih,Ch)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Gr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ws=-90,Xs=1,Na=class extends Vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Wt(Ws,Xs,e,t);s.layers=this.layers,this.add(s);let r=new Wt(Ws,Xs,e,t);r.layers=this.layers,this.add(r);let o=new Wt(Ws,Xs,e,t);o.layers=this.layers,this.add(o);let a=new Wt(Ws,Xs,e,t);a.layers=this.layers,this.add(a);let c=new Wt(Ws,Xs,e,t);c.layers=this.layers,this.add(c);let l=new Wt(Ws,Xs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===Jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(f,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},eo=class extends dn{constructor(e=[],t=fs,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Fa=class extends ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new eo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new bt(5,5,5),r=new ti({name:"CubemapFromEquirect",uniforms:ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:pn,blending:Ai});r.uniforms.tEquirect.value=t;let o=new Ue(s,r),a=t.minFilter;return t.minFilter===Xi&&(t.minFilter=jn),new Na(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},We=class extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},cm={type:"move"},ir=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new We,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new We,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new We,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),h=this._getHandJoint(l,y);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}let u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(cm)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new We;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var to=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ye(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},no=class extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},io=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Pa,this.updateRanges=[],this.version=0,this.uuid=Kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},hn=new O,sr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Zn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Zn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Zn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Zn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},rr=class extends ei{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},qs,Or=new O,Ys=new O,$s=new O,Zs=new Ce,Br=new Ce,Vd=new at,fa=new O,kr=new O,pa=new O,Ph=new Ce,Bc=new Ce,Lh=new Ce,so=class extends Vt{constructor(e=new rr){if(super(),this.isSprite=!0,this.type="Sprite",qs===void 0){qs=new st;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new io(t,5);qs.setIndex([0,1,2,0,2,3]),qs.setAttribute("position",new sr(n,3,0,!1)),qs.setAttribute("uv",new sr(n,2,3,!1))}this.geometry=qs,this.material=e,this.center=new Ce(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ys.setFromMatrixScale(this.matrixWorld),Vd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),$s.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ys.multiplyScalar(-$s.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;ma(fa.set(-.5,-.5,0),$s,o,Ys,s,r),ma(kr.set(.5,-.5,0),$s,o,Ys,s,r),ma(pa.set(.5,.5,0),$s,o,Ys,s,r),Ph.set(0,0),Bc.set(1,0),Lh.set(1,1);let a=e.ray.intersectTriangle(fa,kr,pa,!1,Or);if(a===null&&(ma(kr.set(-.5,.5,0),$s,o,Ys,s,r),Bc.set(0,1),a=e.ray.intersectTriangle(fa,pa,kr,!1,Or),a===null))return;let c=e.ray.origin.distanceTo(Or);c<e.near||c>e.far||t.push({distance:c,point:Or.clone(),uv:bi.getInterpolation(Or,fa,kr,pa,Ph,Bc,Lh,new Ce),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ma(i,e,t,n,s,r){Zs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Br.x=r*Zs.x-s*Zs.y,Br.y=s*Zs.x+r*Zs.y):Br.copy(Zs),i.copy(e),i.x+=Br.x,i.y+=Br.y,i.applyMatrix4(Vd)}var Dh=new O,Uh=new ft,Nh=new ft,um=new O,Fh=new at,ga=new O,kc=new ui,Oh=new at,Hc=new Hi,ro=class extends Ue{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=$c,this.bindMatrix=new at,this.bindMatrixInverse=new at,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new zt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ga),this.boundingBox.expandByPoint(ga)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ui),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ga),this.boundingSphere.expandByPoint(ga)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),kc.copy(this.boundingSphere),kc.applyMatrix4(s),e.ray.intersectsSphere(kc)!==!1&&(Oh.copy(s).invert(),Hc.copy(e.ray).applyMatrix4(Oh),!(this.boundingBox!==null&&Hc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Hc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new ft,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===$c?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Td?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Uh.fromBufferAttribute(s.attributes.skinIndex,e),Nh.fromBufferAttribute(s.attributes.skinWeight,e),Dh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Nh.getComponent(r);if(o!==0){let a=Uh.getComponent(r);Fh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(um.copy(Dh).applyMatrix4(Fh),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},or=class extends Vt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Oa=class extends dn{constructor(e=null,t=1,n=1,s,r,o,a,c,l=vn,u=vn,f,d){super(null,o,a,c,l,u,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Bh=new at,hm=new at,oo=class i{constructor(e=[],t=[]){this.uuid=Kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new at)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new at;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:hm;Bh.multiplyMatrices(a,t[r]),Bh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Oa(t,e,e,Dn,ii);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new or),this.bones.push(o),this.boneInverses.push(new at().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}};var zc=new O,dm=new O,fm=new et,Ht=class{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=zc.subVectors(n,t).cross(dm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(zc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fm.getNormalMatrix(e),s=this.coplanarPoint(zc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},os=new ui,pm=new Ce(.5,.5),_a=new O,ar=class{constructor(e=new Ht,t=new Ht,n=new Ht,s=new Ht,r=new Ht,o=new Ht){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Jn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],f=r[5],d=r[6],p=r[7],g=r[8],y=r[9],m=r[10],h=r[11],_=r[12],x=r[13],v=r[14],T=r[15];if(s[0].setComponents(l-o,p-u,h-g,T-_).normalize(),s[1].setComponents(l+o,p+u,h+g,T+_).normalize(),s[2].setComponents(l+a,p+f,h+y,T+x).normalize(),s[3].setComponents(l-a,p-f,h-y,T-x).normalize(),n)s[4].setComponents(c,d,m,v).normalize(),s[5].setComponents(l-c,p-d,h-m,T-v).normalize();else if(s[4].setComponents(l-c,p-d,h-m,T-v).normalize(),t===Jn)s[5].setComponents(l+c,p+d,h+m,T+v).normalize();else if(t===Zr)s[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),os.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),os.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(os)}intersectsSprite(e){os.center.set(0,0,0);let t=pm.distanceTo(e.center);return os.radius=.7071067811865476+t,os.applyMatrix4(e.matrixWorld),this.intersectsSphere(os)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(_a.x=s.normal.x>0?e.max.x:e.min.x,_a.y=s.normal.y>0?e.max.y:e.min.y,_a.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(_a)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Mn=class extends ei{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ye(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ba=new O,ka=new O,kh=new at,Hr=new Hi,ya=new ui,Vc=new O,Hh=new O,bn=class extends Vt{constructor(e=new st,t=new Mn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ba.fromBufferAttribute(t,s-1),ka.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ba.distanceTo(ka);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,e.ray.intersectsSphere(ya)===!1)return;kh.copy(s).invert(),Hr.copy(e.ray).applyMatrix4(kh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let y=p,m=g-1;y<m;y+=l){let h=u.getX(y),_=u.getX(y+1),x=xa(this,e,Hr,c,h,_,y);x&&t.push(x)}if(this.isLineLoop){let y=u.getX(g-1),m=u.getX(p),h=xa(this,e,Hr,c,y,m,g-1);h&&t.push(h)}}else{let p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let y=p,m=g-1;y<m;y+=l){let h=xa(this,e,Hr,c,y,y+1,y);h&&t.push(h)}if(this.isLineLoop){let y=xa(this,e,Hr,c,g-1,p,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function xa(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Ba.fromBufferAttribute(a,s),ka.fromBufferAttribute(a,r),t.distanceSqToSegment(Ba,ka,Vc,Hh)>n)return;Vc.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Vc);if(!(l<e.near||l>e.far))return{distance:l,point:Hh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var lr=class extends ei{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},zh=new at,Qc=new Hi,va=new ui,Ma=new O,ao=class extends Vt{constructor(e=new st,t=new lr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(s),va.radius+=r,e.ray.intersectsSphere(va)===!1)return;zh.copy(s).invert(),Qc.copy(e.ray).applyMatrix4(zh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=d,y=p;g<y;g++){let m=l.getX(g);Ma.fromBufferAttribute(f,m),Vh(Ma,m,c,s,e,t,this)}}else{let d=Math.max(0,o.start),p=Math.min(f.count,o.start+o.count);for(let g=d,y=p;g<y;g++)Ma.fromBufferAttribute(f,g),Vh(Ma,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Vh(i,e,t,n,s,r,o){let a=Qc.distanceSqToPoint(i);if(a<t){let c=new O;Qc.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Vi=class extends dn{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},lo=class extends dn{constructor(e,t,n=qi,s,r,o,a=vn,c=vn,l,u=js,f=1){if(u!==js&&u!==_r)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:f};super(d,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new tr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},co=class extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var gt=class i extends st{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],d=[],p=[],g=0,y=[],m=n/2,h=0;_(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new it(f,3)),this.setAttribute("normal",new it(d,3)),this.setAttribute("uv",new it(p,2));function _(){let v=new O,T=new O,E=0,C=(t-e)/n;for(let U=0;U<=r;U++){let M=[],S=U/r,D=S*(t-e)+e;for(let H=0;H<=s;H++){let G=H/s,F=G*c+a,W=Math.sin(F),K=Math.cos(F);T.x=D*W,T.y=-S*n+m,T.z=D*K,f.push(T.x,T.y,T.z),v.set(W,C,K).normalize(),d.push(v.x,v.y,v.z),p.push(G,1-S),M.push(g++)}y.push(M)}for(let U=0;U<s;U++)for(let M=0;M<r;M++){let S=y[M][U],D=y[M+1][U],H=y[M+1][U+1],G=y[M][U+1];(e>0||M!==0)&&(u.push(S,D,G),E+=3),(t>0||M!==r-1)&&(u.push(D,H,G),E+=3)}l.addGroup(h,E,0),h+=E}function x(v){let T=g,E=new Ce,C=new O,U=0,M=v===!0?e:t,S=v===!0?1:-1;for(let H=1;H<=s;H++)f.push(0,m*S,0),d.push(0,S,0),p.push(.5,.5),g++;let D=g;for(let H=0;H<=s;H++){let F=H/s*c+a,W=Math.cos(F),K=Math.sin(F);C.x=M*K,C.y=m*S,C.z=M*W,f.push(C.x,C.y,C.z),d.push(0,S,0),E.x=W*.5+.5,E.y=K*.5*S+.5,p.push(E.x,E.y),g++}for(let H=0;H<s;H++){let G=T+H,F=D+H;v===!0?u.push(F,F+1,G):u.push(F+1,F,G),U+=3}l.addGroup(h,U,v===!0?1:2),h+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Cn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let u=n[s],d=n[s+1]-u,p=(o-u)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new Ce:new O);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new O,s=[],r=[],o=[],a=new O,c=new at;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new O)}r[0]=new O,o[0]=new O;let l=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),f<=l&&(l=f,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ot(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(ot(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},cr=class extends Cn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new Ce){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*u-p*f+this.aX,l=d*f+p*u+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ha=class extends cr{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ru(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,u,f){let d=(o-r)/l-(a-r)/(l+u)+(a-o)/u,p=(a-o)/u-(c-o)/(u+f)+(c-a)/f;d*=u,p*=u,s(o,a,d,p)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var ba=new O,Gc=new Ru,Wc=new Ru,Xc=new Ru,ur=class extends Cn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new O){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%r]:(ba.subVectors(s[0],s[1]).add(s[0]),l=ba);let f=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(ba.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ba),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(f),p),y=Math.pow(f.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(u),p);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Gc.initNonuniformCatmullRom(l.x,f.x,d.x,u.x,g,y,m),Wc.initNonuniformCatmullRom(l.y,f.y,d.y,u.y,g,y,m),Xc.initNonuniformCatmullRom(l.z,f.z,d.z,u.z,g,y,m)}else this.curveType==="catmullrom"&&(Gc.initCatmullRom(l.x,f.x,d.x,u.x,this.tension),Wc.initCatmullRom(l.y,f.y,d.y,u.y,this.tension),Xc.initCatmullRom(l.z,f.z,d.z,u.z,this.tension));return n.set(Gc.calc(c),Wc.calc(c),Xc.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new O().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Gh(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function mm(i,e){let t=1-i;return t*t*e}function gm(i,e){return 2*(1-i)*i*e}function _m(i,e){return i*i*e}function Xr(i,e,t,n){return mm(i,e)+gm(i,t)+_m(i,n)}function ym(i,e){let t=1-i;return t*t*t*e}function xm(i,e){let t=1-i;return 3*t*t*i*e}function vm(i,e){return 3*(1-i)*i*i*e}function Mm(i,e){return i*i*i*e}function qr(i,e,t,n,s){return ym(i,e)+xm(i,t)+vm(i,n)+Mm(i,s)}var uo=class extends Cn{constructor(e=new Ce,t=new Ce,n=new Ce,s=new Ce){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Ce){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qr(e,s.x,r.x,o.x,a.x),qr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},za=class extends Cn{constructor(e=new O,t=new O,n=new O,s=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new O){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qr(e,s.x,r.x,o.x,a.x),qr(e,s.y,r.y,o.y,a.y),qr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ho=class extends Cn{constructor(e=new Ce,t=new Ce){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ce){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ce){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Va=class extends Cn{constructor(e=new O,t=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new O){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new O){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fo=class extends Cn{constructor(e=new Ce,t=new Ce,n=new Ce){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ce){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(e,s.x,r.x,o.x),Xr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},po=class extends Cn{constructor(e=new O,t=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new O){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(e,s.x,r.x,o.x),Xr(e,s.y,r.y,o.y),Xr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},mo=class extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ce){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],u=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return n.set(Gh(a,c.x,l.x,u.x,f.x),Gh(a,c.y,l.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Ce().fromArray(s))}return this}},Ga=Object.freeze({__proto__:null,ArcCurve:Ha,CatmullRomCurve3:ur,CubicBezierCurve:uo,CubicBezierCurve3:za,EllipseCurve:cr,LineCurve:ho,LineCurve3:Va,QuadraticBezierCurve:fo,QuadraticBezierCurve3:po,SplineCurve:mo}),Wa=class extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ga[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let u=c[l];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Ga[s.type]().fromJSON(s))}return this}},go=class extends Wa{constructor(e){super(),this.type="Path",this.currentPoint=new Ce,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ho(this.currentPoint.clone(),new Ce(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new fo(this.currentPoint.clone(),new Ce(e,t),new Ce(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new uo(this.currentPoint.clone(),new Ce(e,t),new Ce(n,s),new Ce(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new mo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){let l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){let l=new cr(e,t,n,s,r,o,a,c);if(this.curves.length>0){let f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);let u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ti=class extends go{constructor(e){super(e),this.uuid=Kn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new go().fromJSON(s))}return this}};function bm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Gd(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=Am(i,e,r,t)),i.length>80*t){a=1/0,c=1/0;let u=-1/0,f=-1/0;for(let d=t;d<s;d+=t){let p=i[d],g=i[d+1];p<a&&(a=p),g<c&&(c=g),p>u&&(u=p),g>f&&(f=g)}l=Math.max(u-a,f-c),l=l!==0?32767/l:0}return _o(r,o,t,a,c,l,0),o}function Gd(i,e,t,n,s){let r;if(s===Bm(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Wh(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Wh(o/n|0,i[o],i[o+1],r);return r&&hr(r,r.next)&&(xo(r),r=r.next),r}function hs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(hr(t,t.next)||Pt(t.prev,t,t.next)===0)){if(xo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function _o(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Lm(i,n,s,r);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Em(i,n,s,r):Sm(i)){e.push(c.i,i.i,l.i),xo(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=wm(hs(i),e),_o(i,e,t,n,s,r,2)):o===2&&Tm(i,e,t,n,s,r):_o(hs(i),e,t,n,s,r,1);break}}}function Sm(i){let e=i.prev,t=i,n=i.next;if(Pt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,u=Math.min(s,r,o),f=Math.min(a,c,l),d=Math.max(s,r,o),p=Math.max(a,c,l),g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=f&&g.y<=p&&Vr(s,a,r,c,o,l,g.x,g.y)&&Pt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Em(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Pt(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,u=s.y,f=r.y,d=o.y,p=Math.min(a,c,l),g=Math.min(u,f,d),y=Math.max(a,c,l),m=Math.max(u,f,d),h=eu(p,g,e,t,n),_=eu(y,m,e,t,n),x=i.prevZ,v=i.nextZ;for(;x&&x.z>=h&&v&&v.z<=_;){if(x.x>=p&&x.x<=y&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Vr(a,u,c,f,l,d,x.x,x.y)&&Pt(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=p&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Vr(a,u,c,f,l,d,v.x,v.y)&&Pt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=h;){if(x.x>=p&&x.x<=y&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Vr(a,u,c,f,l,d,x.x,x.y)&&Pt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=_;){if(v.x>=p&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Vr(a,u,c,f,l,d,v.x,v.y)&&Pt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function wm(i,e){let t=i;do{let n=t.prev,s=t.next.next;!hr(n,s)&&Xd(n,t,t.next,s)&&yo(n,s)&&yo(s,n)&&(e.push(n.i,t.i,s.i),xo(t),xo(t.next),t=i=s),t=t.next}while(t!==i);return hs(t)}function Tm(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Nm(o,a)){let c=qd(o,a);o=hs(o,o.next),c=hs(c,c.next),_o(o,e,t,n,s,r,0),_o(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Am(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=Gd(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Um(l))}s.sort(Rm);for(let r=0;r<s.length;r++)t=Cm(s[r],t);return t}function Rm(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Cm(i,e){let t=Im(i,e);if(!t)return e;let n=qd(t,i);return hs(n,n.next),hs(t,t.next)}function Im(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(hr(i,t))return t;do{if(hr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,o=t.x<t.next.x?t:t.next,f===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,c=o.x,l=o.y,u=1/0;t=o;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Wd(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let f=Math.abs(s-t.y)/(n-t.x);yo(t,i)&&(f<u||f===u&&(t.x>o.x||t.x===o.x&&Pm(o,t)))&&(o=t,u=f)}t=t.next}while(t!==a);return o}function Pm(i,e){return Pt(i.prev,i,e.prev)<0&&Pt(e.next,i,i.next)<0}function Lm(i,e,t,n){let s=i;do s.z===0&&(s.z=eu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Dm(s)}function Dm(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function eu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Um(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Wd(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Vr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&Wd(i,e,t,n,s,r,o,a)}function Nm(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Fm(i,e)&&(yo(i,e)&&yo(e,i)&&Om(i,e)&&(Pt(i.prev,i,e.prev)||Pt(i,e.prev,e))||hr(i,e)&&Pt(i.prev,i,i.next)>0&&Pt(e.prev,e,e.next)>0)}function Pt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function hr(i,e){return i.x===e.x&&i.y===e.y}function Xd(i,e,t,n){let s=Ea(Pt(i,e,t)),r=Ea(Pt(i,e,n)),o=Ea(Pt(t,n,i)),a=Ea(Pt(t,n,e));return!!(s!==r&&o!==a||s===0&&Sa(i,t,e)||r===0&&Sa(i,n,e)||o===0&&Sa(t,i,n)||a===0&&Sa(t,e,n))}function Sa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ea(i){return i>0?1:i<0?-1:0}function Fm(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Xd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function yo(i,e){return Pt(i.prev,i,i.next)<0?Pt(i,e,i.next)>=0&&Pt(i,i.prev,e)>=0:Pt(i,e,i.prev)<0||Pt(i,i.next,e)<0}function Om(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function qd(i,e){let t=tu(i.i,i.x,i.y),n=tu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Wh(i,e,t,n){let s=tu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function xo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function tu(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Bm(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var nu=class{static triangulate(e,t,n=2){return bm(e,t,n)}},li=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Xh(e),qh(n,e);let o=e.length;t.forEach(Xh);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,qh(n,t[c]);let a=nu.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Xh(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function qh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var vo=class i extends st{constructor(e=new Ti([new Ce(.5,.5),new Ce(-.5,.5),new Ce(-.5,-.5),new Ce(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new it(s,3)),this.setAttribute("uv",new it(r,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,h=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:km,x,v=!1,T,E,C,U;h&&(x=h.getSpacedPoints(u),v=!0,d=!1,T=h.computeFrenetFrames(u,!1),E=new O,C=new O,U=new O),d||(m=0,p=0,g=0,y=0);let M=a.extractPoints(l),S=M.shape,D=M.holes;if(!li.isClockWise(S)){S=S.reverse();for(let Me=0,N=D.length;Me<N;Me++){let k=D[Me];li.isClockWise(k)&&(D[Me]=k.reverse())}}function G(Me){let k=10000000000000001e-36,ne=Me[0];for(let me=1;me<=Me.length;me++){let ce=me%Me.length,ge=Me[ce],Le=ge.x-ne.x,Be=ge.y-ne.y,R=Le*Le+Be*Be,b=Math.max(Math.abs(ge.x),Math.abs(ge.y),Math.abs(ne.x),Math.abs(ne.y)),J=k*b*b;if(R<=J){Me.splice(ce,1),me--;continue}ne=ge}}G(S),D.forEach(G);let F=D.length,W=S;for(let Me=0;Me<F;Me++){let N=D[Me];S=S.concat(N)}function K(Me,N,k){return N||console.error("THREE.ExtrudeGeometry: vec does not exist"),Me.clone().addScaledVector(N,k)}let he=S.length;function ee(Me,N,k){let ne,me,ce,ge=Me.x-N.x,Le=Me.y-N.y,Be=k.x-Me.x,R=k.y-Me.y,b=ge*ge+Le*Le,J=ge*R-Le*Be;if(Math.abs(J)>Number.EPSILON){let ae=Math.sqrt(b),ve=Math.sqrt(Be*Be+R*R),fe=N.x-Le/ae,X=N.y+ge/ae,w=k.x-R/ve,q=k.y+Be/ve,ie=((w-fe)*R-(q-X)*Be)/(ge*R-Le*Be);ne=fe+ge*ie-Me.x,me=X+Le*ie-Me.y;let $=ne*ne+me*me;if($<=2)return new Ce(ne,me);ce=Math.sqrt($/2)}else{let ae=!1;ge>Number.EPSILON?Be>Number.EPSILON&&(ae=!0):ge<-Number.EPSILON?Be<-Number.EPSILON&&(ae=!0):Math.sign(Le)===Math.sign(R)&&(ae=!0),ae?(ne=-Le,me=ge,ce=Math.sqrt(b)):(ne=ge,me=Le,ce=Math.sqrt(b/2))}return new Ce(ne/ce,me/ce)}let be=[];for(let Me=0,N=W.length,k=N-1,ne=Me+1;Me<N;Me++,k++,ne++)k===N&&(k=0),ne===N&&(ne=0),be[Me]=ee(W[Me],W[k],W[ne]);let te=[],Ee,Ie=be.concat();for(let Me=0,N=F;Me<N;Me++){let k=D[Me];Ee=[];for(let ne=0,me=k.length,ce=me-1,ge=ne+1;ne<me;ne++,ce++,ge++)ce===me&&(ce=0),ge===me&&(ge=0),Ee[ne]=ee(k[ne],k[ce],k[ge]);te.push(Ee),Ie=Ie.concat(Ee)}let V;if(m===0)V=li.triangulateShape(W,D);else{let Me=[],N=[];for(let k=0;k<m;k++){let ne=k/m,me=p*Math.cos(ne*Math.PI/2),ce=g*Math.sin(ne*Math.PI/2)+y;for(let ge=0,Le=W.length;ge<Le;ge++){let Be=K(W[ge],be[ge],ce);xe(Be.x,Be.y,-me),ne===0&&Me.push(Be)}for(let ge=0,Le=F;ge<Le;ge++){let Be=D[ge];Ee=te[ge];let R=[];for(let b=0,J=Be.length;b<J;b++){let ae=K(Be[b],Ee[b],ce);xe(ae.x,ae.y,-me),ne===0&&R.push(ae)}ne===0&&N.push(R)}}V=li.triangulateShape(Me,N)}let ue=V.length,Re=g+y;for(let Me=0;Me<he;Me++){let N=d?K(S[Me],Ie[Me],Re):S[Me];v?(C.copy(T.normals[0]).multiplyScalar(N.x),E.copy(T.binormals[0]).multiplyScalar(N.y),U.copy(x[0]).add(C).add(E),xe(U.x,U.y,U.z)):xe(N.x,N.y,0)}for(let Me=1;Me<=u;Me++)for(let N=0;N<he;N++){let k=d?K(S[N],Ie[N],Re):S[N];v?(C.copy(T.normals[Me]).multiplyScalar(k.x),E.copy(T.binormals[Me]).multiplyScalar(k.y),U.copy(x[Me]).add(C).add(E),xe(U.x,U.y,U.z)):xe(k.x,k.y,f/u*Me)}for(let Me=m-1;Me>=0;Me--){let N=Me/m,k=p*Math.cos(N*Math.PI/2),ne=g*Math.sin(N*Math.PI/2)+y;for(let me=0,ce=W.length;me<ce;me++){let ge=K(W[me],be[me],ne);xe(ge.x,ge.y,f+k)}for(let me=0,ce=D.length;me<ce;me++){let ge=D[me];Ee=te[me];for(let Le=0,Be=ge.length;Le<Be;Le++){let R=K(ge[Le],Ee[Le],ne);v?xe(R.x,R.y+x[u-1].y,x[u-1].x+k):xe(R.x,R.y,f+k)}}}Z(),re();function Z(){let Me=s.length/3;if(d){let N=0,k=he*N;for(let ne=0;ne<ue;ne++){let me=V[ne];Te(me[2]+k,me[1]+k,me[0]+k)}N=u+m*2,k=he*N;for(let ne=0;ne<ue;ne++){let me=V[ne];Te(me[0]+k,me[1]+k,me[2]+k)}}else{for(let N=0;N<ue;N++){let k=V[N];Te(k[2],k[1],k[0])}for(let N=0;N<ue;N++){let k=V[N];Te(k[0]+he*u,k[1]+he*u,k[2]+he*u)}}n.addGroup(Me,s.length/3-Me,0)}function re(){let Me=s.length/3,N=0;_e(W,N),N+=W.length;for(let k=0,ne=D.length;k<ne;k++){let me=D[k];_e(me,N),N+=me.length}n.addGroup(Me,s.length/3-Me,1)}function _e(Me,N){let k=Me.length;for(;--k>=0;){let ne=k,me=k-1;me<0&&(me=Me.length-1);for(let ce=0,ge=u+m*2;ce<ge;ce++){let Le=he*ce,Be=he*(ce+1),R=N+ne+Le,b=N+me+Le,J=N+me+Be,ae=N+ne+Be;ze(R,b,J,ae)}}}function xe(Me,N,k){c.push(Me),c.push(N),c.push(k)}function Te(Me,N,k){Ze(Me),Ze(N),Ze(k);let ne=s.length/3,me=_.generateTopUV(n,s,ne-3,ne-2,ne-1);B(me[0]),B(me[1]),B(me[2])}function ze(Me,N,k,ne){Ze(Me),Ze(N),Ze(ne),Ze(N),Ze(k),Ze(ne);let me=s.length/3,ce=_.generateSideWallUV(n,s,me-6,me-3,me-2,me-1);B(ce[0]),B(ce[1]),B(ce[3]),B(ce[1]),B(ce[2]),B(ce[3])}function Ze(Me){s.push(c[Me*3+0]),s.push(c[Me*3+1]),s.push(c[Me*3+2])}function B(Me){r.push(Me.x),r.push(Me.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Hm(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ga[s.type]().fromJSON(s)),new i(n,e.options)}},km={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[s*3],u=e[s*3+1];return[new Ce(r,o),new Ce(a,c),new Ce(l,u)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],u=e[n*3+1],f=e[n*3+2],d=e[s*3],p=e[s*3+1],g=e[s*3+2],y=e[r*3],m=e[r*3+1],h=e[r*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new Ce(o,1-c),new Ce(l,1-f),new Ce(d,1-g),new Ce(y,1-h)]:[new Ce(a,1-c),new Ce(u,1-f),new Ce(p,1-g),new Ce(m,1-h)]}};function Hm(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var nn=class i extends st{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,f=e/a,d=t/c,p=[],g=[],y=[],m=[];for(let h=0;h<u;h++){let _=h*d-o;for(let x=0;x<l;x++){let v=x*f-r;g.push(v,-_,0),y.push(0,0,1),m.push(x/a),m.push(1-h/c)}}for(let h=0;h<c;h++)for(let _=0;_<a;_++){let x=_+l*h,v=_+l*(h+1),T=_+1+l*(h+1),E=_+1+l*h;p.push(x,v,E),p.push(v,T,E)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(y,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Mo=class i extends st{constructor(e=new Ti([new Ce(0,.5),new Ce(-.5,-.5),new Ce(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let u=0;u<e.length;u++)l(e[u]),this.addGroup(a,c,u),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new it(s,3)),this.setAttribute("normal",new it(r,3)),this.setAttribute("uv",new it(o,2));function l(u){let f=s.length/3,d=u.extractPoints(t),p=d.shape,g=d.holes;li.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,h=g.length;m<h;m++){let _=g[m];li.isClockWise(_)===!0&&(g[m]=_.reverse())}let y=li.triangulateShape(p,g);for(let m=0,h=g.length;m<h;m++){let _=g[m];p=p.concat(_)}for(let m=0,h=p.length;m<h;m++){let _=p[m];s.push(_.x,_.y,0),r.push(0,0,1),o.push(_.x,_.y)}for(let m=0,h=y.length;m<h;m++){let _=y[m],x=_[0]+f,v=_[1]+f,T=_[2]+f;n.push(x,v,T),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return zm(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function zm(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var In=class i extends st{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,u=[],f=new O,d=new O,p=[],g=[],y=[],m=[];for(let h=0;h<=n;h++){let _=[],x=h/n,v=0;h===0&&o===0?v=.5/t:h===n&&c===Math.PI&&(v=-.5/t);for(let T=0;T<=t;T++){let E=T/t;f.x=-e*Math.cos(s+E*r)*Math.sin(o+x*a),f.y=e*Math.cos(o+x*a),f.z=e*Math.sin(s+E*r)*Math.sin(o+x*a),g.push(f.x,f.y,f.z),d.copy(f).normalize(),y.push(d.x,d.y,d.z),m.push(E+v,1-x),_.push(l++)}u.push(_)}for(let h=0;h<n;h++)for(let _=0;_<t;_++){let x=u[h][_+1],v=u[h][_],T=u[h+1][_],E=u[h+1][_+1];(h!==0||o>0)&&p.push(x,v,E),(h!==n-1||c<Math.PI)&&p.push(v,T,E)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(y,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Lt=class i extends st{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],u=new O,f=new O,d=new O;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){let y=g/s*r,m=p/n*Math.PI*2;f.x=(e+t*Math.cos(m))*Math.cos(y),f.y=(e+t*Math.cos(m))*Math.sin(y),f.z=t*Math.sin(m),a.push(f.x,f.y,f.z),u.x=e*Math.cos(y),u.y=e*Math.sin(y),d.subVectors(f,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){let y=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,h=(s+1)*(p-1)+g,_=(s+1)*p+g;o.push(y,m,_),o.push(m,h,_)}this.setIndex(o),this.setAttribute("position",new it(a,3)),this.setAttribute("normal",new it(c,3)),this.setAttribute("uv",new it(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var bo=class i extends st{constructor(e=new po(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new O,c=new O,l=new Ce,u=new O,f=[],d=[],p=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new it(f,3)),this.setAttribute("normal",new it(d,3)),this.setAttribute("uv",new it(p,2));function y(){for(let x=0;x<t;x++)m(x);m(r===!1?t:0),_(),h()}function m(x){u=e.getPointAt(x/t,u);let v=o.normals[x],T=o.binormals[x];for(let E=0;E<=s;E++){let C=E/s*Math.PI*2,U=Math.sin(C),M=-Math.cos(C);c.x=M*v.x+U*T.x,c.y=M*v.y+U*T.y,c.z=M*v.z+U*T.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+n*c.x,a.y=u.y+n*c.y,a.z=u.z+n*c.z,f.push(a.x,a.y,a.z)}}function h(){for(let x=1;x<=t;x++)for(let v=1;v<=s;v++){let T=(s+1)*(x-1)+(v-1),E=(s+1)*x+(v-1),C=(s+1)*x+v,U=(s+1)*(x-1)+v;g.push(T,E,U),g.push(E,C,U)}}function _(){for(let x=0;x<=t;x++)for(let v=0;v<=s;v++)l.x=x/t,l.y=v/s,p.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Ga[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var ke=class extends ei{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bu,this.normalScale=new Ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Xa=class extends ei{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Rd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},qa=class extends ei{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Vm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ds=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ya=class extends ds{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Zc,endingEnd:Zc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Jc:r=e,a=2*t-n;break;case Kc:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Jc:o=e,c=2*n-t;break;case Kc:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,h=-d*m+2*d*y-d*g,_=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*y+.5*g,v=p*m-p*y;for(let T=0;T!==a;++T)r[T]=h*o[u+T]+_*o[l+T]+x*o[c+T]+v*o[f+T];return r}},$a=class extends ds{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(n-t)/(s-t),f=1-u;for(let d=0;d!==a;++d)r[d]=o[l+d]*f+o[c+d]*u;return r}},Za=class extends ds{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Pn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wa(t,this.TimeBufferType),this.values=wa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wa(e.times,Array),values:wa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Za(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ya(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Yr:t=this.InterpolantFactoryMethodDiscrete;break;case Ia:t=this.InterpolantFactoryMethodLinear;break;case Ta:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Yr;case this.InterpolantFactoryMethodLinear:return Ia;case this.InterpolantFactoryMethodSmooth:return Ta}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Vm(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ta,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{let f=a*n,d=f-n,p=f+n;for(let g=0;g!==n;++g){let y=t[f+g];if(y!==t[d+g]||y!==t[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let f=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[f+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Pn.prototype.ValueTypeName="";Pn.prototype.TimeBufferType=Float32Array;Pn.prototype.ValueBufferType=Float32Array;Pn.prototype.DefaultInterpolation=Ia;var Gi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Gi.prototype.ValueTypeName="bool";Gi.prototype.ValueBufferType=Array;Gi.prototype.DefaultInterpolation=Yr;Gi.prototype.InterpolantFactoryMethodLinear=void 0;Gi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ja=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Ja.prototype.ValueTypeName="color";var Ka=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Ka.prototype.ValueTypeName="number";var ja=class extends ds{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let u=l+a;l!==u;l+=4)Qn.slerpFlat(r,0,o,l-a,o,l,c);return r}},So=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new ja(this.times,this.values,this.getValueSize(),e)}};So.prototype.ValueTypeName="quaternion";So.prototype.InterpolantFactoryMethodSmooth=void 0;var Wi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Wi.prototype.ValueTypeName="string";Wi.prototype.ValueBufferType=Array;Wi.prototype.DefaultInterpolation=Yr;Wi.prototype.InterpolantFactoryMethodLinear=void 0;Wi.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Qa.prototype.ValueTypeName="vector";var el=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,f){return l.push(u,f),this},this.removeHandler=function(u){let f=l.indexOf(u);return f!==-1&&l.splice(f,2),this},this.getHandler=function(u){for(let f=0,d=l.length;f<d;f+=2){let p=l[f],g=l[f+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Yd=new el,tl=class{constructor(e){this.manager=e!==void 0?e:Yd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};tl.DEFAULT_MATERIAL_NAME="__DEFAULT";var dr=class extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Eo=class extends dr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},qc=new at,Yh=new O,$h=new O,nl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ce(512,512),this.mapType=ni,this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ar,this._frameExtents=new Ce(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Yh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yh),$h.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($h),t.updateMatrixWorld(),qc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Zh=new at,zr=new O,Yc=new O,iu=class extends nl{constructor(){super(new Wt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ce(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new O(1,0,0),new O(-1,0,0),new O(0,0,1),new O(0,0,-1),new O(0,1,0),new O(0,-1,0)],this._cubeUps=[new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,0,1),new O(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),zr.setFromMatrixPosition(e.matrixWorld),n.position.copy(zr),Yc.copy(n.position),Yc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Yc),n.updateMatrixWorld(),s.makeTranslation(-zr.x,-zr.y,-zr.z),Zh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zh,n.coordinateSystem,n.reversedDepth)}},wo=class extends dr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new iu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},To=class extends Qr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},su=class extends nl{constructor(){super(new To(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},fr=class extends dr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new su}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var il=class extends Wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Cu="\\[\\]\\.:\\/",Gm=new RegExp("["+Cu+"]","g"),Iu="[^"+Cu+"]",Wm="[^"+Cu.replace("\\.","")+"]",Xm=/((?:WC+[\/:])*)/.source.replace("WC",Iu),qm=/(WCOD+)?/.source.replace("WCOD",Wm),Ym=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Iu),$m=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Iu),Zm=new RegExp("^"+Xm+qm+Ym+$m+"$"),Jm=["material","materials","bones","map"],ru=class{constructor(e,t,n){let s=n||wt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},wt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Gm,"")}static parseTrackName(e){let t=Zm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Jm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};wt.Composite=ru;wt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};wt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};wt.prototype.GetterByBindingType=[wt.prototype._getValue_direct,wt.prototype._getValue_array,wt.prototype._getValue_arrayElement,wt.prototype._getValue_toArray];wt.prototype.SetterByBindingTypeAndVersioning=[[wt.prototype._setValue_direct,wt.prototype._setValue_direct_setNeedsUpdate,wt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_array,wt.prototype._setValue_array_setNeedsUpdate,wt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_arrayElement,wt.prototype._setValue_arrayElement_setNeedsUpdate,wt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_fromArray,wt.prototype._setValue_fromArray_setNeedsUpdate,wt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var lv=new Float32Array(1);var Jh=new at,Ln=class{constructor(e,t,n=0,s=1/0){this.ray=new Hi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new nr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Jh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jh),this}intersectObject(e,t=!0,n=[]){return ou(e,this,n,t),n.sort(Kh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ou(e[s],this,n,t);return n.sort(Kh),n}};function Kh(i,e){return i.distance-e.distance}function ou(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)ou(r[o],e,t,!0)}}function Pu(i,e,t,n){let s=Km(n);switch(t){case yu:return i*e;case vu:return i*e/s.components*s.byteLength;case xl:return i*e/s.components*s.byteLength;case Mu:return i*e*2/s.components*s.byteLength;case vl:return i*e*2/s.components*s.byteLength;case xu:return i*e*3/s.components*s.byteLength;case Dn:return i*e*4/s.components*s.byteLength;case Ml:return i*e*4/s.components*s.byteLength;case Co:case Io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Po:case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Sl:case wl:return Math.max(i,16)*Math.max(e,8)/4;case bl:case El:return Math.max(i,8)*Math.max(e,8)/2;case Tl:case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Il:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Hl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case zl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Gl:case Wl:case Xl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ql:case Yl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case $l:case Zl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Km(i){switch(i){case ni:case pu:return{byteLength:1,components:1};case pr:case mu:case mr:return{byteLength:2,components:1};case _l:case yl:return{byteLength:2,components:4};case qi:case gl:case ii:return{byteLength:4,components:1};case gu:case _u:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function yf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ig(i){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,f=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){let u=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,u);else{f.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<f.length;p++){let g=f[d],y=f[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,f[d]=y)}f.length=d+1;for(let p=0,g=f.length;p<g;p++){let y=f[p];i.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var sg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,rg=`#ifdef USE_ALPHAHASH
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
#endif`,og=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ag=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ug=`#ifdef USE_AOMAP
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
#endif`,hg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dg=`#ifdef USE_BATCHING
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
#endif`,fg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,pg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_g=`#ifdef USE_IRIDESCENCE
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
#endif`,yg=`#ifdef USE_BUMPMAP
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
#endif`,xg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Eg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Tg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ag=`#define PI 3.141592653589793
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
} // validated`,Rg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Cg=`vec3 transformedNormal = objectNormal;
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
#endif`,Ig=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Dg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ug="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ng=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fg=`#ifdef USE_ENVMAP
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
#endif`,Og=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bg=`#ifdef USE_ENVMAP
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
#endif`,kg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hg=`#ifdef USE_ENVMAP
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
#endif`,Vg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Gg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Wg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Xg=`#ifdef USE_GRADIENTMAP
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
}`,qg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Yg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$g=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zg=`uniform bool receiveShadow;
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
#endif`,Jg=`#ifdef USE_ENVMAP
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
#endif`,Kg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Qg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,e0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,t0=`PhysicalMaterial material;
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
#endif`,n0=`struct PhysicalMaterial {
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
}`,i0=`
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
#endif`,s0=`#if defined( RE_IndirectDiffuse )
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
#endif`,r0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,o0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,a0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,l0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,c0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,u0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,h0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,d0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,f0=`#if defined( USE_POINTS_UV )
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
#endif`,p0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,m0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,g0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,y0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x0=`#ifdef USE_MORPHTARGETS
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
#endif`,v0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,M0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,b0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,S0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,E0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,T0=`#ifdef USE_NORMALMAP
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
#endif`,A0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,R0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,C0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,I0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,P0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,L0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,D0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,U0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,N0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,F0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,O0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,B0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,k0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,H0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,V0=`float getShadowMask() {
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
}`,G0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,W0=`#ifdef USE_SKINNING
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
#endif`,X0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,q0=`#ifdef USE_SKINNING
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
#endif`,Y0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Z0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,J0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,K0=`#ifdef USE_TRANSMISSION
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
#endif`,j0=`#ifdef USE_TRANSMISSION
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
#endif`,Q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,e_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,t_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,n_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,i_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,s_=`uniform sampler2D t2D;
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
}`,r_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,o_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,a_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c_=`#include <common>
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
}`,u_=`#if DEPTH_PACKING == 3200
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
}`,h_=`#define DISTANCE
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
}`,d_=`#define DISTANCE
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
}`,f_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,p_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m_=`uniform float scale;
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
}`,g_=`uniform vec3 diffuse;
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
}`,__=`#include <common>
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
}`,y_=`uniform vec3 diffuse;
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
}`,x_=`#define LAMBERT
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
}`,v_=`#define LAMBERT
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
}`,M_=`#define MATCAP
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
}`,b_=`#define MATCAP
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
}`,S_=`#define NORMAL
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
}`,E_=`#define NORMAL
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
}`,w_=`#define PHONG
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
}`,T_=`#define PHONG
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
}`,A_=`#define STANDARD
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
}`,R_=`#define STANDARD
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
}`,C_=`#define TOON
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
}`,I_=`#define TOON
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
}`,P_=`uniform float size;
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
}`,L_=`uniform vec3 diffuse;
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
}`,D_=`#include <common>
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
}`,U_=`uniform vec3 color;
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
}`,N_=`uniform float rotation;
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
}`,F_=`uniform vec3 diffuse;
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
}`,rt={alphahash_fragment:sg,alphahash_pars_fragment:rg,alphamap_fragment:og,alphamap_pars_fragment:ag,alphatest_fragment:lg,alphatest_pars_fragment:cg,aomap_fragment:ug,aomap_pars_fragment:hg,batching_pars_vertex:dg,batching_vertex:fg,begin_vertex:pg,beginnormal_vertex:mg,bsdfs:gg,iridescence_fragment:_g,bumpmap_pars_fragment:yg,clipping_planes_fragment:xg,clipping_planes_pars_fragment:vg,clipping_planes_pars_vertex:Mg,clipping_planes_vertex:bg,color_fragment:Sg,color_pars_fragment:Eg,color_pars_vertex:wg,color_vertex:Tg,common:Ag,cube_uv_reflection_fragment:Rg,defaultnormal_vertex:Cg,displacementmap_pars_vertex:Ig,displacementmap_vertex:Pg,emissivemap_fragment:Lg,emissivemap_pars_fragment:Dg,colorspace_fragment:Ug,colorspace_pars_fragment:Ng,envmap_fragment:Fg,envmap_common_pars_fragment:Og,envmap_pars_fragment:Bg,envmap_pars_vertex:kg,envmap_physical_pars_fragment:Jg,envmap_vertex:Hg,fog_vertex:zg,fog_pars_vertex:Vg,fog_fragment:Gg,fog_pars_fragment:Wg,gradientmap_pars_fragment:Xg,lightmap_pars_fragment:qg,lights_lambert_fragment:Yg,lights_lambert_pars_fragment:$g,lights_pars_begin:Zg,lights_toon_fragment:Kg,lights_toon_pars_fragment:jg,lights_phong_fragment:Qg,lights_phong_pars_fragment:e0,lights_physical_fragment:t0,lights_physical_pars_fragment:n0,lights_fragment_begin:i0,lights_fragment_maps:s0,lights_fragment_end:r0,logdepthbuf_fragment:o0,logdepthbuf_pars_fragment:a0,logdepthbuf_pars_vertex:l0,logdepthbuf_vertex:c0,map_fragment:u0,map_pars_fragment:h0,map_particle_fragment:d0,map_particle_pars_fragment:f0,metalnessmap_fragment:p0,metalnessmap_pars_fragment:m0,morphinstance_vertex:g0,morphcolor_vertex:_0,morphnormal_vertex:y0,morphtarget_pars_vertex:x0,morphtarget_vertex:v0,normal_fragment_begin:M0,normal_fragment_maps:b0,normal_pars_fragment:S0,normal_pars_vertex:E0,normal_vertex:w0,normalmap_pars_fragment:T0,clearcoat_normal_fragment_begin:A0,clearcoat_normal_fragment_maps:R0,clearcoat_pars_fragment:C0,iridescence_pars_fragment:I0,opaque_fragment:P0,packing:L0,premultiplied_alpha_fragment:D0,project_vertex:U0,dithering_fragment:N0,dithering_pars_fragment:F0,roughnessmap_fragment:O0,roughnessmap_pars_fragment:B0,shadowmap_pars_fragment:k0,shadowmap_pars_vertex:H0,shadowmap_vertex:z0,shadowmask_pars_fragment:V0,skinbase_vertex:G0,skinning_pars_vertex:W0,skinning_vertex:X0,skinnormal_vertex:q0,specularmap_fragment:Y0,specularmap_pars_fragment:$0,tonemapping_fragment:Z0,tonemapping_pars_fragment:J0,transmission_fragment:K0,transmission_pars_fragment:j0,uv_pars_fragment:Q0,uv_pars_vertex:e_,uv_vertex:t_,worldpos_vertex:n_,background_vert:i_,background_frag:s_,backgroundCube_vert:r_,backgroundCube_frag:o_,cube_vert:a_,cube_frag:l_,depth_vert:c_,depth_frag:u_,distanceRGBA_vert:h_,distanceRGBA_frag:d_,equirect_vert:f_,equirect_frag:p_,linedashed_vert:m_,linedashed_frag:g_,meshbasic_vert:__,meshbasic_frag:y_,meshlambert_vert:x_,meshlambert_frag:v_,meshmatcap_vert:M_,meshmatcap_frag:b_,meshnormal_vert:S_,meshnormal_frag:E_,meshphong_vert:w_,meshphong_frag:T_,meshphysical_vert:A_,meshphysical_frag:R_,meshtoon_vert:C_,meshtoon_frag:I_,points_vert:P_,points_frag:L_,shadow_vert:D_,shadow_frag:U_,sprite_vert:N_,sprite_frag:F_},Ne={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new Ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new Ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},di={basic:{uniforms:on([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:on([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:on([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:on([Ne.common,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.roughnessmap,Ne.metalnessmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:on([Ne.common,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.gradientmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:on([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:on([Ne.points,Ne.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:on([Ne.common,Ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:on([Ne.common,Ne.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:on([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:on([Ne.sprite,Ne.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distanceRGBA:{uniforms:on([Ne.common,Ne.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distanceRGBA_vert,fragmentShader:rt.distanceRGBA_frag},shadow:{uniforms:on([Ne.lights,Ne.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};di.physical={uniforms:on([di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new Ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new Ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new Ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};var Jl={r:0,b:0,g:0},gs=new fn,O_=new at;function B_(i,e,t,n,s,r,o){let a=new Ye(0),c=r===!0?0:1,l,u,f=null,d=0,p=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function y(x){let v=!1,T=g(x);T===null?h(a,c):T&&T.isColor&&(h(T,1),v=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,v){let T=g(v);T&&(T.isCubeTexture||T.mapping===Ao)?(u===void 0&&(u=new Ue(new bt(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:ms(di.backgroundCube.uniforms),vertexShader:di.backgroundCube.vertexShader,fragmentShader:di.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(E,C,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),gs.copy(v.backgroundRotation),gs.x*=-1,gs.y*=-1,gs.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(gs.y*=-1,gs.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(O_.makeRotationFromEuler(gs)),u.material.toneMapped=ut.getTransfer(T.colorSpace)!==xt,(f!==T||d!==T.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,f=T,d=T.version,p=i.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new Ue(new nn(2,2),new ti({name:"BackgroundMaterial",uniforms:ms(di.background.uniforms),vertexShader:di.background.vertexShader,fragmentShader:di.background.fragmentShader,side:Ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ut.getTransfer(T.colorSpace)!==xt,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(f!==T||d!==T.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,f=T,d=T.version,p=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function h(x,v){x.getRGB(Jl,Au(i)),n.buffers.color.setClear(Jl.r,Jl.g,Jl.b,v,o)}function _(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),c=v,h(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,h(a,c)},render:y,addToRenderList:m,dispose:_}}function k_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(S,D,H,G,F){let W=!1,K=f(G,H,D);r!==K&&(r=K,l(r.object)),W=p(S,G,H,F),W&&g(S,G,H,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,v(S,D,H,G),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function u(S){return i.deleteVertexArray(S)}function f(S,D,H){let G=H.wireframe===!0,F=n[S.id];F===void 0&&(F={},n[S.id]=F);let W=F[D.id];W===void 0&&(W={},F[D.id]=W);let K=W[G];return K===void 0&&(K=d(c()),W[G]=K),K}function d(S){let D=[],H=[],G=[];for(let F=0;F<t;F++)D[F]=0,H[F]=0,G[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:G,object:S,attributes:{},index:null}}function p(S,D,H,G){let F=r.attributes,W=D.attributes,K=0,he=H.getAttributes();for(let ee in he)if(he[ee].location>=0){let te=F[ee],Ee=W[ee];if(Ee===void 0&&(ee==="instanceMatrix"&&S.instanceMatrix&&(Ee=S.instanceMatrix),ee==="instanceColor"&&S.instanceColor&&(Ee=S.instanceColor)),te===void 0||te.attribute!==Ee||Ee&&te.data!==Ee.data)return!0;K++}return r.attributesNum!==K||r.index!==G}function g(S,D,H,G){let F={},W=D.attributes,K=0,he=H.getAttributes();for(let ee in he)if(he[ee].location>=0){let te=W[ee];te===void 0&&(ee==="instanceMatrix"&&S.instanceMatrix&&(te=S.instanceMatrix),ee==="instanceColor"&&S.instanceColor&&(te=S.instanceColor));let Ee={};Ee.attribute=te,te&&te.data&&(Ee.data=te.data),F[ee]=Ee,K++}r.attributes=F,r.attributesNum=K,r.index=G}function y(){let S=r.newAttributes;for(let D=0,H=S.length;D<H;D++)S[D]=0}function m(S){h(S,0)}function h(S,D){let H=r.newAttributes,G=r.enabledAttributes,F=r.attributeDivisors;H[S]=1,G[S]===0&&(i.enableVertexAttribArray(S),G[S]=1),F[S]!==D&&(i.vertexAttribDivisor(S,D),F[S]=D)}function _(){let S=r.newAttributes,D=r.enabledAttributes;for(let H=0,G=D.length;H<G;H++)D[H]!==S[H]&&(i.disableVertexAttribArray(H),D[H]=0)}function x(S,D,H,G,F,W,K){K===!0?i.vertexAttribIPointer(S,D,H,F,W):i.vertexAttribPointer(S,D,H,G,F,W)}function v(S,D,H,G){y();let F=G.attributes,W=H.getAttributes(),K=D.defaultAttributeValues;for(let he in W){let ee=W[he];if(ee.location>=0){let be=F[he];if(be===void 0&&(he==="instanceMatrix"&&S.instanceMatrix&&(be=S.instanceMatrix),he==="instanceColor"&&S.instanceColor&&(be=S.instanceColor)),be!==void 0){let te=be.normalized,Ee=be.itemSize,Ie=e.get(be);if(Ie===void 0)continue;let V=Ie.buffer,ue=Ie.type,Re=Ie.bytesPerElement,Z=ue===i.INT||ue===i.UNSIGNED_INT||be.gpuType===gl;if(be.isInterleavedBufferAttribute){let re=be.data,_e=re.stride,xe=be.offset;if(re.isInstancedInterleavedBuffer){for(let Te=0;Te<ee.locationSize;Te++)h(ee.location+Te,re.meshPerAttribute);S.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Te=0;Te<ee.locationSize;Te++)m(ee.location+Te);i.bindBuffer(i.ARRAY_BUFFER,V);for(let Te=0;Te<ee.locationSize;Te++)x(ee.location+Te,Ee/ee.locationSize,ue,te,_e*Re,(xe+Ee/ee.locationSize*Te)*Re,Z)}else{if(be.isInstancedBufferAttribute){for(let re=0;re<ee.locationSize;re++)h(ee.location+re,be.meshPerAttribute);S.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=be.meshPerAttribute*be.count)}else for(let re=0;re<ee.locationSize;re++)m(ee.location+re);i.bindBuffer(i.ARRAY_BUFFER,V);for(let re=0;re<ee.locationSize;re++)x(ee.location+re,Ee/ee.locationSize,ue,te,Ee*Re,Ee/ee.locationSize*re*Re,Z)}}else if(K!==void 0){let te=K[he];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(ee.location,te);break;case 3:i.vertexAttrib3fv(ee.location,te);break;case 4:i.vertexAttrib4fv(ee.location,te);break;default:i.vertexAttrib1fv(ee.location,te)}}}}_()}function T(){U();for(let S in n){let D=n[S];for(let H in D){let G=D[H];for(let F in G)u(G[F].object),delete G[F];delete D[H]}delete n[S]}}function E(S){if(n[S.id]===void 0)return;let D=n[S.id];for(let H in D){let G=D[H];for(let F in G)u(G[F].object),delete G[F];delete D[H]}delete n[S.id]}function C(S){for(let D in n){let H=n[D];if(H[S.id]===void 0)continue;let G=H[S.id];for(let F in G)u(G[F].object),delete G[F];delete H[S.id]}}function U(){M(),o=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:U,resetDefaultState:M,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:_}}function H_(i,e,t){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function o(l,u,f){f!==0&&(i.drawArraysInstanced(n,l,u,f),t.update(u,n,f))}function a(l,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,f);let p=0;for(let g=0;g<f;g++)p+=u[g];t.update(p,n,1)}function c(l,u,f,d){if(f===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,f);let g=0;for(let y=0;y<f;y++)g+=u[y]*d[y];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function z_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Dn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let U=C===mr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==ni&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ii&&!U)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:T,maxSamples:E}}function V_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Ht,a=new et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){let p=f.length!==0||d||n!==0||s;return s=d,n=f.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=u(f,d,0)},this.setState=function(f,d,p){let g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,h=i.get(f);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{let _=r?0:n,x=_*4,v=h.clippingState||null;c.value=v,v=u(g,d,x,p);for(let T=0;T!==x;++T)v[T]=t[T];h.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,d,p,g){let y=f!==null?f.length:0,m=null;if(y!==0){if(m=c.value,g!==!0||m===null){let h=p+y*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<h)&&(m=new Float32Array(h));for(let x=0,v=p;x!==y;++x,v+=4)o.copy(f[x]).applyMatrix4(_,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function G_(i){let e=new WeakMap;function t(o,a){return a===fl?o.mapping=fs:a===pl&&(o.mapping=ps),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===fl||a===pl)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Fa(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var xr=4,$d=[.125,.215,.35,.446,.526,.582],xs=20,Lu=new To,Zd=new Ye,Du=null,Uu=0,Nu=0,Fu=!1,ys=(1+Math.sqrt(5))/2,yr=1/ys,Jd=[new O(-ys,yr,0),new O(ys,yr,0),new O(-yr,0,ys),new O(yr,0,ys),new O(0,ys,-yr),new O(0,ys,yr),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],W_=new O,Ql=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=W_}=r;Du=this._renderer.getRenderTarget(),Uu=this._renderer.getActiveCubeFace(),Nu=this._renderer.getActiveMipmapLevel(),Fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Du,Uu,Nu),this._renderer.xr.enabled=Fu,e.scissorTest=!1,Kl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fs||e.mapping===ps?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Du=this._renderer.getRenderTarget(),Uu=this._renderer.getActiveCubeFace(),Nu=this._renderer.getActiveMipmapLevel(),Fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:jn,minFilter:jn,generateMipmaps:!1,type:mr,format:Dn,colorSpace:us,depthBuffer:!1},s=Kd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kd(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=X_(r)),this._blurMaterial=q_(r,e,t)}return s}_compileMaterial(e){let t=new Ue(this._lodPlanes[0],e);this._renderer.compile(t,Lu)}_sceneToCubeUV(e,t,n,s,r){let c=new Wt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,p=f.toneMapping;f.getClearColor(Zd),f.toneMapping=Ri,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));let y=new Ft({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),m=new Ue(new bt,y),h=!1,_=e.background;_?_.isColor&&(y.color.copy(_),e.background=null,h=!0):(y.color.copy(Zd),h=!0);for(let x=0;x<6;x++){let v=x%3;v===0?(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[x],r.y,r.z)):v===1?(c.up.set(0,0,l[x]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[x],r.z)):(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[x]));let T=this._cubeSize;Kl(s,v*T,x>2?T:0,T,T),f.setRenderTarget(s),h&&f.render(m,c),f.render(e,c)}m.geometry.dispose(),m.material.dispose(),f.toneMapping=p,f.autoClear=d,e.background=_}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===fs||e.mapping===ps;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jd());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ue(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Kl(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Lu)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Jd[(s-r-1)%Jd.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new Ue(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*xs-1),y=r/g,m=isFinite(r)?1+Math.floor(u*y):xs;m>xs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xs}`);let h=[],_=0;for(let C=0;C<xs;++C){let U=C/y,M=Math.exp(-U*U/2);h.push(M),C===0?_+=M:C<m&&(_+=2*M)}for(let C=0;C<h.length;C++)h[C]=h[C]/_;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=h,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let v=this._sizeLods[s],T=3*v*(s>x-xr?s-x+xr:0),E=4*(this._cubeSize-v);Kl(t,T,E,3*v,2*v),c.setRenderTarget(t),c.render(f,Lu)}};function X_(i){let e=[],t=[],n=[],s=i,r=i-xr+1+$d.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-xr?c=$d[o-i+xr-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),u=-l,f=1+l,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,g=6,y=3,m=2,h=1,_=new Float32Array(y*g*p),x=new Float32Array(m*g*p),v=new Float32Array(h*g*p);for(let E=0;E<p;E++){let C=E%3*2/3-1,U=E>2?0:-1,M=[C,U,0,C+2/3,U,0,C+2/3,U+1,0,C,U,0,C+2/3,U+1,0,C,U+1,0];_.set(M,y*g*E),x.set(d,m*g*E);let S=[E,E,E,E,E,E];v.set(S,h*g*E)}let T=new st;T.setAttribute("position",new Nt(_,y)),T.setAttribute("uv",new Nt(x,m)),T.setAttribute("faceIndex",new Nt(v,h)),e.push(T),s>xr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Kd(i,e,t){let n=new ci(i,e,t);return n.texture.mapping=Ao,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Kl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function q_(i,e,t){let n=new Float32Array(xs),s=new O(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:xs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:qu(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function jd(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qu(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Qd(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function qu(){return`

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
	`}function Y_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===fl||c===pl,u=c===fs||c===ps;if(l||u){let f=e.get(a),d=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ql(i)),f=l?t.fromEquirectangular(a,f):t.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),f.texture;if(f!==void 0)return f.texture;{let p=a.image;return l&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new Ql(i)),f=l?t.fromEquirectangular(a):t.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),a.addEventListener("dispose",r),f.texture):null}}}return a}function s(a){let c=0,l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function $_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&er("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Z_(i,e,t,n){let s={},r=new WeakMap;function o(f){let d=f.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(f){let d=f.attributes;for(let p in d)e.update(d[p],i.ARRAY_BUFFER)}function l(f){let d=[],p=f.index,g=f.attributes.position,y=0;if(p!==null){let _=p.array;y=p.version;for(let x=0,v=_.length;x<v;x+=3){let T=_[x+0],E=_[x+1],C=_[x+2];d.push(T,E,E,C,C,T)}}else if(g!==void 0){let _=g.array;y=g.version;for(let x=0,v=_.length/3-1;x<v;x+=3){let T=x+0,E=x+1,C=x+2;d.push(T,E,E,C,C,T)}}else return;let m=new(Tu(d)?jr:zi)(d,1);m.version=y;let h=r.get(f);h&&e.remove(h),r.set(f,m)}function u(f){let d=r.get(f);if(d){let p=f.index;p!==null&&d.version<p.version&&l(f)}else l(f);return r.get(f)}return{get:a,update:c,getWireframeAttribute:u}}function J_(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,p){i.drawElements(n,p,r,d*o),t.update(p,n,1)}function l(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*o,g),t.update(p,n,g))}function u(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let h=0;h<g;h++)m+=p[h];t.update(m,n,1)}function f(d,p,g,y){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<d.length;h++)l(d[h]/o,p[h],y[h]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,y,0,g);let h=0;for(let _=0;_<g;_++)h+=p[_]*y[_];t.update(h,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function K_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function j_(i,e,t){let n=new WeakMap,s=new ft;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0,d=n.get(a);if(d===void 0||d.count!==f){let M=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],h=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],x=0;p===!0&&(x=1),g===!0&&(x=2),y===!0&&(x=3);let v=a.attributes.position.count*x,T=1;v>e.maxTextureSize&&(T=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let E=new Float32Array(v*T*4*f),C=new Kr(E,v,T,f);C.type=ii,C.needsUpdate=!0;let U=x*4;for(let S=0;S<f;S++){let D=m[S],H=h[S],G=_[S],F=v*T*4*S;for(let W=0;W<D.count;W++){let K=W*U;p===!0&&(s.fromBufferAttribute(D,W),E[F+K+0]=s.x,E[F+K+1]=s.y,E[F+K+2]=s.z,E[F+K+3]=0),g===!0&&(s.fromBufferAttribute(H,W),E[F+K+4]=s.x,E[F+K+5]=s.y,E[F+K+6]=s.z,E[F+K+7]=0),y===!0&&(s.fromBufferAttribute(G,W),E[F+K+8]=s.x,E[F+K+9]=s.y,E[F+K+10]=s.z,E[F+K+11]=G.itemSize===4?s.w:1)}}d={count:f,texture:C,size:new Ce(v,T)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let y=0;y<l.length;y++)p+=l[y];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Q_(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,u=c.geometry,f=e.get(c,u);if(s.get(f)!==l&&(e.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return f}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var xf=new dn,ef=new lo(1,1),vf=new Kr,Mf=new Ua,bf=new eo,tf=[],nf=[],sf=new Float32Array(16),rf=new Float32Array(9),of=new Float32Array(4);function Mr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=tf[s];if(r===void 0&&(r=new Float32Array(s),tf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function tc(i,e){let t=nf[e];t===void 0&&(t=new Int32Array(e),nf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ey(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ty(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),Yt(t,e)}}function ny(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),Yt(t,e)}}function iy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),Yt(t,e)}}function sy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;of.set(n),i.uniformMatrix2fv(this.addr,!1,of),Yt(t,n)}}function ry(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;rf.set(n),i.uniformMatrix3fv(this.addr,!1,rf),Yt(t,n)}}function oy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;sf.set(n),i.uniformMatrix4fv(this.addr,!1,sf),Yt(t,n)}}function ay(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ly(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),Yt(t,e)}}function cy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),Yt(t,e)}}function uy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),Yt(t,e)}}function hy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function dy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),Yt(t,e)}}function fy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),Yt(t,e)}}function py(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),Yt(t,e)}}function my(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ef.compareFunction=Su,r=ef):r=xf,t.setTexture2D(e||r,s)}function gy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Mf,s)}function _y(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||bf,s)}function yy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||vf,s)}function xy(i){switch(i){case 5126:return ey;case 35664:return ty;case 35665:return ny;case 35666:return iy;case 35674:return sy;case 35675:return ry;case 35676:return oy;case 5124:case 35670:return ay;case 35667:case 35671:return ly;case 35668:case 35672:return cy;case 35669:case 35673:return uy;case 5125:return hy;case 36294:return dy;case 36295:return fy;case 36296:return py;case 35678:case 36198:case 36298:case 36306:case 35682:return my;case 35679:case 36299:case 36307:return gy;case 35680:case 36300:case 36308:case 36293:return _y;case 36289:case 36303:case 36311:case 36292:return yy}}function vy(i,e){i.uniform1fv(this.addr,e)}function My(i,e){let t=Mr(e,this.size,2);i.uniform2fv(this.addr,t)}function by(i,e){let t=Mr(e,this.size,3);i.uniform3fv(this.addr,t)}function Sy(i,e){let t=Mr(e,this.size,4);i.uniform4fv(this.addr,t)}function Ey(i,e){let t=Mr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function wy(i,e){let t=Mr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ty(i,e){let t=Mr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ay(i,e){i.uniform1iv(this.addr,e)}function Ry(i,e){i.uniform2iv(this.addr,e)}function Cy(i,e){i.uniform3iv(this.addr,e)}function Iy(i,e){i.uniform4iv(this.addr,e)}function Py(i,e){i.uniform1uiv(this.addr,e)}function Ly(i,e){i.uniform2uiv(this.addr,e)}function Dy(i,e){i.uniform3uiv(this.addr,e)}function Uy(i,e){i.uniform4uiv(this.addr,e)}function Ny(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||xf,r[o])}function Fy(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Mf,r[o])}function Oy(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||bf,r[o])}function By(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||vf,r[o])}function ky(i){switch(i){case 5126:return vy;case 35664:return My;case 35665:return by;case 35666:return Sy;case 35674:return Ey;case 35675:return wy;case 35676:return Ty;case 5124:case 35670:return Ay;case 35667:case 35671:return Ry;case 35668:case 35672:return Cy;case 35669:case 35673:return Iy;case 5125:return Py;case 36294:return Ly;case 36295:return Dy;case 36296:return Uy;case 35678:case 36198:case 36298:case 36306:case 35682:return Ny;case 35679:case 36299:case 36307:return Fy;case 35680:case 36300:case 36308:case 36293:return Oy;case 36289:case 36303:case 36311:case 36292:return By}}var Bu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=xy(t.type)}},ku=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ky(t.type)}},Hu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Ou=/(\w+)(\])?(\[|\.)?/g;function af(i,e){i.seq.push(e),i.map[e.id]=e}function Hy(i,e,t){let n=i.name,s=n.length;for(Ou.lastIndex=0;;){let r=Ou.exec(n),o=Ou.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){af(t,l===void 0?new Bu(a,i,e):new ku(a,i,e));break}else{let f=t.map[a];f===void 0&&(f=new Hu(a),af(t,f)),t=f}}}var vr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Hy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function lf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var zy=37297,Vy=0;function Gy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var cf=new et;function Wy(i){ut._getMatrix(cf,ut.workingColorSpace,i);let e=`mat3( ${cf.elements.map(t=>t.toFixed(4))} )`;switch(ut.getTransfer(i)){case $r:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function uf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Gy(i.getShaderSource(e),a)}else return r}function Xy(i,e){let t=Wy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function qy(i,e){let t;switch(e){case vd:t="Linear";break;case Md:t="Reinhard";break;case bd:t="Cineon";break;case dl:t="ACESFilmic";break;case Ed:t="AgX";break;case wd:t="Neutral";break;case Sd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jl=new O;function Yy(){ut.getLuminanceCoefficients(jl);let i=jl.x.toFixed(4),e=jl.y.toFixed(4),t=jl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $y(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Do).join(`
`)}function Zy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Do(i){return i!==""}function hf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function df(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ky=/^[ \t]*#include +<([\w\d./]+)>/gm;function zu(i){return i.replace(Ky,Qy)}var jy=new Map;function Qy(i,e){let t=rt[e];if(t===void 0){let n=jy.get(e);if(n!==void 0)t=rt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return zu(t)}var ex=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ff(i){return i.replace(ex,tx)}function tx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function pf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function nx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===lu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===sl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===hi&&(e="SHADOWMAP_TYPE_VSM"),e}function ix(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case fs:case ps:e="ENVMAP_TYPE_CUBE";break;case Ao:e="ENVMAP_TYPE_CUBE_UV";break}return e}function sx(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ps:e="ENVMAP_MODE_REFRACTION";break}return e}function rx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case du:e="ENVMAP_BLENDING_MULTIPLY";break;case yd:e="ENVMAP_BLENDING_MIX";break;case xd:e="ENVMAP_BLENDING_ADD";break}return e}function ox(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function ax(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=nx(t),l=ix(t),u=sx(t),f=rx(t),d=ox(t),p=$y(t),g=Zy(r),y=s.createProgram(),m,h,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Do).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Do).join(`
`),h.length>0&&(h+=`
`)):(m=[pf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Do).join(`
`),h=[pf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ri?"#define TONE_MAPPING":"",t.toneMapping!==Ri?rt.tonemapping_pars_fragment:"",t.toneMapping!==Ri?qy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,Xy("linearToOutputTexel",t.outputColorSpace),Yy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Do).join(`
`)),o=zu(o),o=hf(o,t),o=df(o,t),a=zu(a),a=hf(a,t),a=df(a,t),o=ff(o),a=ff(a),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",t.glslVersion===Eu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Eu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);let x=_+m+o,v=_+h+a,T=lf(s,s.VERTEX_SHADER,x),E=lf(s,s.FRAGMENT_SHADER,v);s.attachShader(y,T),s.attachShader(y,E),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(D){if(i.debug.checkShaderErrors){let H=s.getProgramInfoLog(y)||"",G=s.getShaderInfoLog(T)||"",F=s.getShaderInfoLog(E)||"",W=H.trim(),K=G.trim(),he=F.trim(),ee=!0,be=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(ee=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,T,E);else{let te=uf(s,T,"vertex"),Ee=uf(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+W+`
`+te+`
`+Ee)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(K===""||he==="")&&(be=!1);be&&(D.diagnostics={runnable:ee,programLog:W,vertexShader:{log:K,prefix:m},fragmentShader:{log:he,prefix:h}})}s.deleteShader(T),s.deleteShader(E),U=new vr(s,y),M=Jy(s,y)}let U;this.getUniforms=function(){return U===void 0&&C(this),U};let M;this.getAttributes=function(){return M===void 0&&C(this),M};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(y,zy)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Vy++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=E,this}var lx=0,Vu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Gu(e),t.set(e,n)),n}},Gu=class{constructor(e){this.id=lx++,this.code=e,this.usedTimes=0}};function cx(i,e,t,n,s,r,o){let a=new nr,c=new Vu,l=new Set,u=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,S,D,H,G){let F=H.fog,W=G.geometry,K=M.isMeshStandardMaterial?H.environment:null,he=(M.isMeshStandardMaterial?t:e).get(M.envMap||K),ee=he&&he.mapping===Ao?he.image.height:null,be=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let te=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ee=te!==void 0?te.length:0,Ie=0;W.morphAttributes.position!==void 0&&(Ie=1),W.morphAttributes.normal!==void 0&&(Ie=2),W.morphAttributes.color!==void 0&&(Ie=3);let V,ue,Re,Z;if(be){let nt=di[be];V=nt.vertexShader,ue=nt.fragmentShader}else V=M.vertexShader,ue=M.fragmentShader,c.update(M),Re=c.getVertexShaderID(M),Z=c.getFragmentShaderID(M);let re=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),xe=G.isInstancedMesh===!0,Te=G.isBatchedMesh===!0,ze=!!M.map,Ze=!!M.matcap,B=!!he,Me=!!M.aoMap,N=!!M.lightMap,k=!!M.bumpMap,ne=!!M.normalMap,me=!!M.displacementMap,ce=!!M.emissiveMap,ge=!!M.metalnessMap,Le=!!M.roughnessMap,Be=M.anisotropy>0,R=M.clearcoat>0,b=M.dispersion>0,J=M.iridescence>0,ae=M.sheen>0,ve=M.transmission>0,fe=Be&&!!M.anisotropyMap,X=R&&!!M.clearcoatMap,w=R&&!!M.clearcoatNormalMap,q=R&&!!M.clearcoatRoughnessMap,ie=J&&!!M.iridescenceMap,$=J&&!!M.iridescenceThicknessMap,ye=ae&&!!M.sheenColorMap,Pe=ae&&!!M.sheenRoughnessMap,Se=!!M.specularMap,P=!!M.specularColorMap,se=!!M.specularIntensityMap,L=ve&&!!M.transmissionMap,oe=ve&&!!M.thicknessMap,le=!!M.gradientMap,I=!!M.alphaMap,z=M.alphaTest>0,Y=!!M.alphaHash,Ae=!!M.extensions,Ve=Ri;M.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(Ve=i.toneMapping);let mt={shaderID:be,shaderType:M.type,shaderName:M.name,vertexShader:V,fragmentShader:ue,defines:M.defines,customVertexShaderID:Re,customFragmentShaderID:Z,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Te,batchingColor:Te&&G._colorsTexture!==null,instancing:xe,instancingColor:xe&&G.instanceColor!==null,instancingMorph:xe&&G.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:re===null?i.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:us,alphaToCoverage:!!M.alphaToCoverage,map:ze,matcap:Ze,envMap:B,envMapMode:B&&he.mapping,envMapCubeUVHeight:ee,aoMap:Me,lightMap:N,bumpMap:k,normalMap:ne,displacementMap:d&&me,emissiveMap:ce,normalMapObjectSpace:ne&&M.normalMapType===Id,normalMapTangentSpace:ne&&M.normalMapType===bu,metalnessMap:ge,roughnessMap:Le,anisotropy:Be,anisotropyMap:fe,clearcoat:R,clearcoatMap:X,clearcoatNormalMap:w,clearcoatRoughnessMap:q,dispersion:b,iridescence:J,iridescenceMap:ie,iridescenceThicknessMap:$,sheen:ae,sheenColorMap:ye,sheenRoughnessMap:Pe,specularMap:Se,specularColorMap:P,specularIntensityMap:se,transmission:ve,transmissionMap:L,thicknessMap:oe,gradientMap:le,opaque:M.transparent===!1&&M.blending===ls&&M.alphaToCoverage===!1,alphaMap:I,alphaTest:z,alphaHash:Y,combine:M.combine,mapUv:ze&&y(M.map.channel),aoMapUv:Me&&y(M.aoMap.channel),lightMapUv:N&&y(M.lightMap.channel),bumpMapUv:k&&y(M.bumpMap.channel),normalMapUv:ne&&y(M.normalMap.channel),displacementMapUv:me&&y(M.displacementMap.channel),emissiveMapUv:ce&&y(M.emissiveMap.channel),metalnessMapUv:ge&&y(M.metalnessMap.channel),roughnessMapUv:Le&&y(M.roughnessMap.channel),anisotropyMapUv:fe&&y(M.anisotropyMap.channel),clearcoatMapUv:X&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:w&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:$&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&y(M.sheenRoughnessMap.channel),specularMapUv:Se&&y(M.specularMap.channel),specularColorMapUv:P&&y(M.specularColorMap.channel),specularIntensityMapUv:se&&y(M.specularIntensityMap.channel),transmissionMapUv:L&&y(M.transmissionMap.channel),thicknessMapUv:oe&&y(M.thicknessMap.channel),alphaMapUv:I&&y(M.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ne||Be),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!W.attributes.uv&&(ze||I),fog:!!F,useFog:M.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:_e,skinning:G.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:Ie,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ve,decodeVideoTexture:ze&&M.map.isVideoTexture===!0&&ut.getTransfer(M.map.colorSpace)===xt,decodeVideoTextureEmissive:ce&&M.emissiveMap.isVideoTexture===!0&&ut.getTransfer(M.emissiveMap.colorSpace)===xt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===pt,flipSided:M.side===pn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ae&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&M.extensions.multiDraw===!0||Te)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return mt.vertexUv1s=l.has(1),mt.vertexUv2s=l.has(2),mt.vertexUv3s=l.has(3),l.clear(),mt}function h(M){let S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(let D in M.defines)S.push(D),S.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(_(S,M),x(S,M),S.push(i.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function _(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function x(M,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),M.push(a.mask)}function v(M){let S=g[M.type],D;if(S){let H=di[S];D=zd.clone(H.uniforms)}else D=M.uniforms;return D}function T(M,S){let D;for(let H=0,G=u.length;H<G;H++){let F=u[H];if(F.cacheKey===S){D=F,++D.usedTimes;break}}return D===void 0&&(D=new ax(i,S,M,r),u.push(D)),D}function E(M){if(--M.usedTimes===0){let S=u.indexOf(M);u[S]=u[u.length-1],u.pop(),M.destroy()}}function C(M){c.remove(M)}function U(){c.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:T,releaseProgram:E,releaseShaderCache:C,programs:u,dispose:U}}function ux(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function hx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function mf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function gf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(f,d,p,g,y,m){let h=i[e];return h===void 0?(h={id:f.id,object:f,geometry:d,material:p,groupOrder:g,renderOrder:f.renderOrder,z:y,group:m},i[e]=h):(h.id=f.id,h.object=f,h.geometry=d,h.material=p,h.groupOrder=g,h.renderOrder=f.renderOrder,h.z=y,h.group=m),e++,h}function a(f,d,p,g,y,m){let h=o(f,d,p,g,y,m);p.transmission>0?n.push(h):p.transparent===!0?s.push(h):t.push(h)}function c(f,d,p,g,y,m){let h=o(f,d,p,g,y,m);p.transmission>0?n.unshift(h):p.transparent===!0?s.unshift(h):t.unshift(h)}function l(f,d){t.length>1&&t.sort(f||hx),n.length>1&&n.sort(d||mf),s.length>1&&s.sort(d||mf)}function u(){for(let f=e,d=i.length;f<d;f++){let p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function dx(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new gf,i.set(n,[o])):s>=r.length?(o=new gf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function fx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new Ye};break;case"SpotLight":t={position:new O,direction:new O,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function px(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var mx=0;function gx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function _x(i){let e=new fx,t=px(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);let s=new O,r=new at,o=new at;function a(l){let u=0,f=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,g=0,y=0,m=0,h=0,_=0,x=0,v=0,T=0,E=0,C=0;l.sort(gx);for(let M=0,S=l.length;M<S;M++){let D=l[M],H=D.color,G=D.intensity,F=D.distance,W=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=H.r*G,f+=H.g*G,d+=H.b*G;else if(D.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(D.sh.coefficients[K],G);C++}else if(D.isDirectionalLight){let K=e.get(D);if(K.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let he=D.shadow,ee=t.get(D);ee.shadowIntensity=he.intensity,ee.shadowBias=he.bias,ee.shadowNormalBias=he.normalBias,ee.shadowRadius=he.radius,ee.shadowMapSize=he.mapSize,n.directionalShadow[p]=ee,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=D.shadow.matrix,_++}n.directional[p]=K,p++}else if(D.isSpotLight){let K=e.get(D);K.position.setFromMatrixPosition(D.matrixWorld),K.color.copy(H).multiplyScalar(G),K.distance=F,K.coneCos=Math.cos(D.angle),K.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),K.decay=D.decay,n.spot[y]=K;let he=D.shadow;if(D.map&&(n.spotLightMap[T]=D.map,T++,he.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[y]=he.matrix,D.castShadow){let ee=t.get(D);ee.shadowIntensity=he.intensity,ee.shadowBias=he.bias,ee.shadowNormalBias=he.normalBias,ee.shadowRadius=he.radius,ee.shadowMapSize=he.mapSize,n.spotShadow[y]=ee,n.spotShadowMap[y]=W,v++}y++}else if(D.isRectAreaLight){let K=e.get(D);K.color.copy(H).multiplyScalar(G),K.halfWidth.set(D.width*.5,0,0),K.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=K,m++}else if(D.isPointLight){let K=e.get(D);if(K.color.copy(D.color).multiplyScalar(D.intensity),K.distance=D.distance,K.decay=D.decay,D.castShadow){let he=D.shadow,ee=t.get(D);ee.shadowIntensity=he.intensity,ee.shadowBias=he.bias,ee.shadowNormalBias=he.normalBias,ee.shadowRadius=he.radius,ee.shadowMapSize=he.mapSize,ee.shadowCameraNear=he.camera.near,ee.shadowCameraFar=he.camera.far,n.pointShadow[g]=ee,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=D.shadow.matrix,x++}n.point[g]=K,g++}else if(D.isHemisphereLight){let K=e.get(D);K.skyColor.copy(D.color).multiplyScalar(G),K.groundColor.copy(D.groundColor).multiplyScalar(G),n.hemi[h]=K,h++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ne.LTC_FLOAT_1,n.rectAreaLTC2=Ne.LTC_FLOAT_2):(n.rectAreaLTC1=Ne.LTC_HALF_1,n.rectAreaLTC2=Ne.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=d;let U=n.hash;(U.directionalLength!==p||U.pointLength!==g||U.spotLength!==y||U.rectAreaLength!==m||U.hemiLength!==h||U.numDirectionalShadows!==_||U.numPointShadows!==x||U.numSpotShadows!==v||U.numSpotMaps!==T||U.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,U.directionalLength=p,U.pointLength=g,U.spotLength=y,U.rectAreaLength=m,U.hemiLength=h,U.numDirectionalShadows=_,U.numPointShadows=x,U.numSpotShadows=v,U.numSpotMaps=T,U.numLightProbes=C,n.version=mx++)}function c(l,u){let f=0,d=0,p=0,g=0,y=0,m=u.matrixWorldInverse;for(let h=0,_=l.length;h<_;h++){let x=l[h];if(x.isDirectionalLight){let v=n.directional[f];v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(x.isSpotLight){let v=n.spot[p];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),p++}else if(x.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function _f(i){let e=new _x(i),t=[],n=[];function s(u){l.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function yx(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new _f(i),e.set(s,[a])):r>=o.length?(a=new _f(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var xx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vx=`uniform sampler2D shadow_pass;
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
}`;function Mx(i,e,t){let n=new ar,s=new Ce,r=new Ce,o=new ft,a=new Xa({depthPacking:Cd}),c=new qa,l={},u=t.maxTextureSize,f={[Ei]:pn,[pn]:Ei,[pt]:pt},d=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ce},radius:{value:4}},vertexShader:xx,fragmentShader:vx}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new st;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Ue(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lu;let h=this.type;this.render=function(E,C,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let M=i.getRenderTarget(),S=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),H=i.state;H.setBlending(Ai),H.buffers.depth.getReversed()===!0?H.buffers.color.setClear(0,0,0,0):H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);let G=h!==hi&&this.type===hi,F=h===hi&&this.type!==hi;for(let W=0,K=E.length;W<K;W++){let he=E[W],ee=he.shadow;if(ee===void 0){console.warn("THREE.WebGLShadowMap:",he,"has no shadow.");continue}if(ee.autoUpdate===!1&&ee.needsUpdate===!1)continue;s.copy(ee.mapSize);let be=ee.getFrameExtents();if(s.multiply(be),r.copy(ee.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/be.x),s.x=r.x*be.x,ee.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/be.y),s.y=r.y*be.y,ee.mapSize.y=r.y)),ee.map===null||G===!0||F===!0){let Ee=this.type!==hi?{minFilter:vn,magFilter:vn}:{};ee.map!==null&&ee.map.dispose(),ee.map=new ci(s.x,s.y,Ee),ee.map.texture.name=he.name+".shadowMap",ee.camera.updateProjectionMatrix()}i.setRenderTarget(ee.map),i.clear();let te=ee.getViewportCount();for(let Ee=0;Ee<te;Ee++){let Ie=ee.getViewport(Ee);o.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),H.viewport(o),ee.updateMatrices(he,Ee),n=ee.getFrustum(),v(C,U,ee.camera,he,this.type)}ee.isPointLightShadow!==!0&&this.type===hi&&_(ee,U),ee.needsUpdate=!1}h=this.type,m.needsUpdate=!1,i.setRenderTarget(M,S,D)};function _(E,C){let U=e.update(y);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new ci(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(C,null,U,d,y,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(C,null,U,p,y,null)}function x(E,C,U,M){let S=null,D=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)S=D;else if(S=U.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let H=S.uuid,G=C.uuid,F=l[H];F===void 0&&(F={},l[H]=F);let W=F[G];W===void 0&&(W=S.clone(),F[G]=W,C.addEventListener("dispose",T)),S=W}if(S.visible=C.visible,S.wireframe=C.wireframe,M===hi?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:f[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,U.isPointLight===!0&&S.isMeshDistanceMaterial===!0){let H=i.properties.get(S);H.light=U}return S}function v(E,C,U,M,S){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===hi)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);let G=e.update(E),F=E.material;if(Array.isArray(F)){let W=G.groups;for(let K=0,he=W.length;K<he;K++){let ee=W[K],be=F[ee.materialIndex];if(be&&be.visible){let te=x(E,be,M,S);E.onBeforeShadow(i,E,C,U,G,te,ee),i.renderBufferDirect(U,null,G,te,E,ee),E.onAfterShadow(i,E,C,U,G,te,ee)}}}else if(F.visible){let W=x(E,F,M,S);E.onBeforeShadow(i,E,C,U,G,W,null),i.renderBufferDirect(U,null,G,W,E,null),E.onAfterShadow(i,E,C,U,G,W,null)}}let H=E.children;for(let G=0,F=H.length;G<F;G++)v(H[G],C,U,M,S)}function T(E){E.target.removeEventListener("dispose",T);for(let U in l){let M=l[U],S=E.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}var bx={[rl]:ol,[al]:ul,[ll]:hl,[cs]:cl,[ol]:rl,[ul]:al,[hl]:ll,[cl]:cs};function Sx(i,e){function t(){let L=!1,oe=new ft,le=null,I=new ft(0,0,0,0);return{setMask:function(z){le!==z&&!L&&(i.colorMask(z,z,z,z),le=z)},setLocked:function(z){L=z},setClear:function(z,Y,Ae,Ve,mt){mt===!0&&(z*=Ve,Y*=Ve,Ae*=Ve),oe.set(z,Y,Ae,Ve),I.equals(oe)===!1&&(i.clearColor(z,Y,Ae,Ve),I.copy(oe))},reset:function(){L=!1,le=null,I.set(-1,0,0,0)}}}function n(){let L=!1,oe=!1,le=null,I=null,z=null;return{setReversed:function(Y){if(oe!==Y){let Ae=e.get("EXT_clip_control");Y?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),oe=Y;let Ve=z;z=null,this.setClear(Ve)}},getReversed:function(){return oe},setTest:function(Y){Y?re(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(Y){le!==Y&&!L&&(i.depthMask(Y),le=Y)},setFunc:function(Y){if(oe&&(Y=bx[Y]),I!==Y){switch(Y){case rl:i.depthFunc(i.NEVER);break;case ol:i.depthFunc(i.ALWAYS);break;case al:i.depthFunc(i.LESS);break;case cs:i.depthFunc(i.LEQUAL);break;case ll:i.depthFunc(i.EQUAL);break;case cl:i.depthFunc(i.GEQUAL);break;case ul:i.depthFunc(i.GREATER);break;case hl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}I=Y}},setLocked:function(Y){L=Y},setClear:function(Y){z!==Y&&(oe&&(Y=1-Y),i.clearDepth(Y),z=Y)},reset:function(){L=!1,le=null,I=null,z=null,oe=!1}}}function s(){let L=!1,oe=null,le=null,I=null,z=null,Y=null,Ae=null,Ve=null,mt=null;return{setTest:function(nt){L||(nt?re(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(nt){oe!==nt&&!L&&(i.stencilMask(nt),oe=nt)},setFunc:function(nt,yn,Bn){(le!==nt||I!==yn||z!==Bn)&&(i.stencilFunc(nt,yn,Bn),le=nt,I=yn,z=Bn)},setOp:function(nt,yn,Bn){(Y!==nt||Ae!==yn||Ve!==Bn)&&(i.stencilOp(nt,yn,Bn),Y=nt,Ae=yn,Ve=Bn)},setLocked:function(nt){L=nt},setClear:function(nt){mt!==nt&&(i.clearStencil(nt),mt=nt)},reset:function(){L=!1,oe=null,le=null,I=null,z=null,Y=null,Ae=null,Ve=null,mt=null}}}let r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap,u={},f={},d=new WeakMap,p=[],g=null,y=!1,m=null,h=null,_=null,x=null,v=null,T=null,E=null,C=new Ye(0,0,0),U=0,M=!1,S=null,D=null,H=null,G=null,F=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,he=0,ee=i.getParameter(i.VERSION);ee.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(ee)[1]),K=he>=1):ee.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),K=he>=2);let be=null,te={},Ee=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),V=new ft().fromArray(Ee),ue=new ft().fromArray(Ie);function Re(L,oe,le,I){let z=new Uint8Array(4),Y=i.createTexture();i.bindTexture(L,Y),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<le;Ae++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(oe,0,i.RGBA,1,1,I,0,i.RGBA,i.UNSIGNED_BYTE,z):i.texImage2D(oe+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,z);return Y}let Z={};Z[i.TEXTURE_2D]=Re(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=Re(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=Re(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=Re(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(i.DEPTH_TEST),o.setFunc(cs),k(!1),ne(au),re(i.CULL_FACE),Me(Ai);function re(L){u[L]!==!0&&(i.enable(L),u[L]=!0)}function _e(L){u[L]!==!1&&(i.disable(L),u[L]=!1)}function xe(L,oe){return f[L]!==oe?(i.bindFramebuffer(L,oe),f[L]=oe,L===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=oe),L===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=oe),!0):!1}function Te(L,oe){let le=p,I=!1;if(L){le=d.get(oe),le===void 0&&(le=[],d.set(oe,le));let z=L.textures;if(le.length!==z.length||le[0]!==i.COLOR_ATTACHMENT0){for(let Y=0,Ae=z.length;Y<Ae;Y++)le[Y]=i.COLOR_ATTACHMENT0+Y;le.length=z.length,I=!0}}else le[0]!==i.BACK&&(le[0]=i.BACK,I=!0);I&&i.drawBuffers(le)}function ze(L){return g!==L?(i.useProgram(L),g=L,!0):!1}let Ze={[ki]:i.FUNC_ADD,[td]:i.FUNC_SUBTRACT,[nd]:i.FUNC_REVERSE_SUBTRACT};Ze[id]=i.MIN,Ze[sd]=i.MAX;let B={[rd]:i.ZERO,[od]:i.ONE,[ad]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[fd]:i.SRC_ALPHA_SATURATE,[hd]:i.DST_COLOR,[cd]:i.DST_ALPHA,[ld]:i.ONE_MINUS_SRC_COLOR,[Ra]:i.ONE_MINUS_SRC_ALPHA,[dd]:i.ONE_MINUS_DST_COLOR,[ud]:i.ONE_MINUS_DST_ALPHA,[pd]:i.CONSTANT_COLOR,[md]:i.ONE_MINUS_CONSTANT_COLOR,[gd]:i.CONSTANT_ALPHA,[_d]:i.ONE_MINUS_CONSTANT_ALPHA};function Me(L,oe,le,I,z,Y,Ae,Ve,mt,nt){if(L===Ai){y===!0&&(_e(i.BLEND),y=!1);return}if(y===!1&&(re(i.BLEND),y=!0),L!==ed){if(L!==m||nt!==M){if((h!==ki||v!==ki)&&(i.blendEquation(i.FUNC_ADD),h=ki,v=ki),nt)switch(L){case ls:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cu:i.blendFunc(i.ONE,i.ONE);break;case uu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ls:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cu:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case uu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}_=null,x=null,T=null,E=null,C.set(0,0,0),U=0,m=L,M=nt}return}z=z||oe,Y=Y||le,Ae=Ae||I,(oe!==h||z!==v)&&(i.blendEquationSeparate(Ze[oe],Ze[z]),h=oe,v=z),(le!==_||I!==x||Y!==T||Ae!==E)&&(i.blendFuncSeparate(B[le],B[I],B[Y],B[Ae]),_=le,x=I,T=Y,E=Ae),(Ve.equals(C)===!1||mt!==U)&&(i.blendColor(Ve.r,Ve.g,Ve.b,mt),C.copy(Ve),U=mt),m=L,M=!1}function N(L,oe){L.side===pt?_e(i.CULL_FACE):re(i.CULL_FACE);let le=L.side===pn;oe&&(le=!le),k(le),L.blending===ls&&L.transparent===!1?Me(Ai):Me(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);let I=L.stencilWrite;a.setTest(I),I&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ce(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?re(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function k(L){S!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),S=L)}function ne(L){L!==jh?(re(i.CULL_FACE),L!==D&&(L===au?i.cullFace(i.BACK):L===Qh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),D=L}function me(L){L!==H&&(K&&i.lineWidth(L),H=L)}function ce(L,oe,le){L?(re(i.POLYGON_OFFSET_FILL),(G!==oe||F!==le)&&(i.polygonOffset(oe,le),G=oe,F=le)):_e(i.POLYGON_OFFSET_FILL)}function ge(L){L?re(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function Le(L){L===void 0&&(L=i.TEXTURE0+W-1),be!==L&&(i.activeTexture(L),be=L)}function Be(L,oe,le){le===void 0&&(be===null?le=i.TEXTURE0+W-1:le=be);let I=te[le];I===void 0&&(I={type:void 0,texture:void 0},te[le]=I),(I.type!==L||I.texture!==oe)&&(be!==le&&(i.activeTexture(le),be=le),i.bindTexture(L,oe||Z[L]),I.type=L,I.texture=oe)}function R(){let L=te[be];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function b(){try{i.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{i.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ae(){try{i.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ve(){try{i.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function fe(){try{i.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{i.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function w(){try{i.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{i.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function $(){try{i.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(L){V.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),V.copy(L))}function Pe(L){ue.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),ue.copy(L))}function Se(L,oe){let le=l.get(oe);le===void 0&&(le=new WeakMap,l.set(oe,le));let I=le.get(L);I===void 0&&(I=i.getUniformBlockIndex(oe,L.name),le.set(L,I))}function P(L,oe){let I=l.get(oe).get(L);c.get(oe)!==I&&(i.uniformBlockBinding(oe,I,L.__bindingPointIndex),c.set(oe,I))}function se(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},be=null,te={},f={},d=new WeakMap,p=[],g=null,y=!1,m=null,h=null,_=null,x=null,v=null,T=null,E=null,C=new Ye(0,0,0),U=0,M=!1,S=null,D=null,H=null,G=null,F=null,V.set(0,0,i.canvas.width,i.canvas.height),ue.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:re,disable:_e,bindFramebuffer:xe,drawBuffers:Te,useProgram:ze,setBlending:Me,setMaterial:N,setFlipSided:k,setCullFace:ne,setLineWidth:me,setPolygonOffset:ce,setScissorTest:ge,activeTexture:Le,bindTexture:Be,unbindTexture:R,compressedTexImage2D:b,compressedTexImage3D:J,texImage2D:ie,texImage3D:$,updateUBOMapping:Se,uniformBlockBinding:P,texStorage2D:w,texStorage3D:q,texSubImage2D:ae,texSubImage3D:ve,compressedTexSubImage2D:fe,compressedTexSubImage3D:X,scissor:ye,viewport:Pe,reset:se}}function Ex(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ce,u=new WeakMap,f,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,b){return p?new OffscreenCanvas(R,b):Jr("canvas")}function y(R,b,J){let ae=1,ve=Be(R);if((ve.width>J||ve.height>J)&&(ae=J/Math.max(ve.width,ve.height)),ae<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let fe=Math.floor(ae*ve.width),X=Math.floor(ae*ve.height);f===void 0&&(f=g(fe,X));let w=b?g(fe,X):f;return w.width=fe,w.height=X,w.getContext("2d").drawImage(R,0,0,fe,X),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ve.width+"x"+ve.height+") to ("+fe+"x"+X+")."),w}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ve.width+"x"+ve.height+")."),R;return R}function m(R){return R.generateMipmaps}function h(R){i.generateMipmap(R)}function _(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(R,b,J,ae,ve=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let fe=b;if(b===i.RED&&(J===i.FLOAT&&(fe=i.R32F),J===i.HALF_FLOAT&&(fe=i.R16F),J===i.UNSIGNED_BYTE&&(fe=i.R8)),b===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(fe=i.R8UI),J===i.UNSIGNED_SHORT&&(fe=i.R16UI),J===i.UNSIGNED_INT&&(fe=i.R32UI),J===i.BYTE&&(fe=i.R8I),J===i.SHORT&&(fe=i.R16I),J===i.INT&&(fe=i.R32I)),b===i.RG&&(J===i.FLOAT&&(fe=i.RG32F),J===i.HALF_FLOAT&&(fe=i.RG16F),J===i.UNSIGNED_BYTE&&(fe=i.RG8)),b===i.RG_INTEGER&&(J===i.UNSIGNED_BYTE&&(fe=i.RG8UI),J===i.UNSIGNED_SHORT&&(fe=i.RG16UI),J===i.UNSIGNED_INT&&(fe=i.RG32UI),J===i.BYTE&&(fe=i.RG8I),J===i.SHORT&&(fe=i.RG16I),J===i.INT&&(fe=i.RG32I)),b===i.RGB_INTEGER&&(J===i.UNSIGNED_BYTE&&(fe=i.RGB8UI),J===i.UNSIGNED_SHORT&&(fe=i.RGB16UI),J===i.UNSIGNED_INT&&(fe=i.RGB32UI),J===i.BYTE&&(fe=i.RGB8I),J===i.SHORT&&(fe=i.RGB16I),J===i.INT&&(fe=i.RGB32I)),b===i.RGBA_INTEGER&&(J===i.UNSIGNED_BYTE&&(fe=i.RGBA8UI),J===i.UNSIGNED_SHORT&&(fe=i.RGBA16UI),J===i.UNSIGNED_INT&&(fe=i.RGBA32UI),J===i.BYTE&&(fe=i.RGBA8I),J===i.SHORT&&(fe=i.RGBA16I),J===i.INT&&(fe=i.RGBA32I)),b===i.RGB&&(J===i.UNSIGNED_INT_5_9_9_9_REV&&(fe=i.RGB9_E5),J===i.UNSIGNED_INT_10F_11F_11F_REV&&(fe=i.R11F_G11F_B10F)),b===i.RGBA){let X=ve?$r:ut.getTransfer(ae);J===i.FLOAT&&(fe=i.RGBA32F),J===i.HALF_FLOAT&&(fe=i.RGBA16F),J===i.UNSIGNED_BYTE&&(fe=X===xt?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT_4_4_4_4&&(fe=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(fe=i.RGB5_A1)}return(fe===i.R16F||fe===i.R32F||fe===i.RG16F||fe===i.RG32F||fe===i.RGBA16F||fe===i.RGBA32F)&&e.get("EXT_color_buffer_float"),fe}function v(R,b){let J;return R?b===null||b===qi||b===gr?J=i.DEPTH24_STENCIL8:b===ii?J=i.DEPTH32F_STENCIL8:b===pr&&(J=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===qi||b===gr?J=i.DEPTH_COMPONENT24:b===ii?J=i.DEPTH_COMPONENT32F:b===pr&&(J=i.DEPTH_COMPONENT16),J}function T(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==vn&&R.minFilter!==jn?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function E(R){let b=R.target;b.removeEventListener("dispose",E),U(b),b.isVideoTexture&&u.delete(b)}function C(R){let b=R.target;b.removeEventListener("dispose",C),S(b)}function U(R){let b=n.get(R);if(b.__webglInit===void 0)return;let J=R.source,ae=d.get(J);if(ae){let ve=ae[b.__cacheKey];ve.usedTimes--,ve.usedTimes===0&&M(R),Object.keys(ae).length===0&&d.delete(J)}n.remove(R)}function M(R){let b=n.get(R);i.deleteTexture(b.__webglTexture);let J=R.source,ae=d.get(J);delete ae[b.__cacheKey],o.memory.textures--}function S(R){let b=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let ae=0;ae<6;ae++){if(Array.isArray(b.__webglFramebuffer[ae]))for(let ve=0;ve<b.__webglFramebuffer[ae].length;ve++)i.deleteFramebuffer(b.__webglFramebuffer[ae][ve]);else i.deleteFramebuffer(b.__webglFramebuffer[ae]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[ae])}else{if(Array.isArray(b.__webglFramebuffer))for(let ae=0;ae<b.__webglFramebuffer.length;ae++)i.deleteFramebuffer(b.__webglFramebuffer[ae]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ae=0;ae<b.__webglColorRenderbuffer.length;ae++)b.__webglColorRenderbuffer[ae]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[ae]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let J=R.textures;for(let ae=0,ve=J.length;ae<ve;ae++){let fe=n.get(J[ae]);fe.__webglTexture&&(i.deleteTexture(fe.__webglTexture),o.memory.textures--),n.remove(J[ae])}n.remove(R)}let D=0;function H(){D=0}function G(){let R=D;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),D+=1,R}function F(R){let b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function W(R,b){let J=n.get(R);if(R.isVideoTexture&&ge(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&J.__version!==R.version){let ae=R.image;if(ae===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(J,R,b);return}}else R.isExternalTexture&&(J.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+b)}function K(R,b){let J=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&J.__version!==R.version){Z(J,R,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+b)}function he(R,b){let J=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&J.__version!==R.version){Z(J,R,b);return}t.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+b)}function ee(R,b){let J=n.get(R);if(R.version>0&&J.__version!==R.version){re(J,R,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+b)}let be={[Ks]:i.REPEAT,[Bi]:i.CLAMP_TO_EDGE,[Ca]:i.MIRRORED_REPEAT},te={[vn]:i.NEAREST,[Ad]:i.NEAREST_MIPMAP_NEAREST,[Ro]:i.NEAREST_MIPMAP_LINEAR,[jn]:i.LINEAR,[ml]:i.LINEAR_MIPMAP_NEAREST,[Xi]:i.LINEAR_MIPMAP_LINEAR},Ee={[Pd]:i.NEVER,[Od]:i.ALWAYS,[Ld]:i.LESS,[Su]:i.LEQUAL,[Dd]:i.EQUAL,[Fd]:i.GEQUAL,[Ud]:i.GREATER,[Nd]:i.NOTEQUAL};function Ie(R,b){if(b.type===ii&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===jn||b.magFilter===ml||b.magFilter===Ro||b.magFilter===Xi||b.minFilter===jn||b.minFilter===ml||b.minFilter===Ro||b.minFilter===Xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,be[b.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,be[b.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,be[b.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,te[b.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,te[b.minFilter]),b.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ee[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===vn||b.minFilter!==Ro&&b.minFilter!==Xi||b.type===ii&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let J=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function V(R,b){let J=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",E));let ae=b.source,ve=d.get(ae);ve===void 0&&(ve={},d.set(ae,ve));let fe=F(b);if(fe!==R.__cacheKey){ve[fe]===void 0&&(ve[fe]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,J=!0),ve[fe].usedTimes++;let X=ve[R.__cacheKey];X!==void 0&&(ve[R.__cacheKey].usedTimes--,X.usedTimes===0&&M(b)),R.__cacheKey=fe,R.__webglTexture=ve[fe].texture}return J}function ue(R,b,J){return Math.floor(Math.floor(R/J)/b)}function Re(R,b,J,ae){let fe=R.updateRanges;if(fe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,J,ae,b.data);else{fe.sort(($,ye)=>$.start-ye.start);let X=0;for(let $=1;$<fe.length;$++){let ye=fe[X],Pe=fe[$],Se=ye.start+ye.count,P=ue(Pe.start,b.width,4),se=ue(ye.start,b.width,4);Pe.start<=Se+1&&P===se&&ue(Pe.start+Pe.count-1,b.width,4)===P?ye.count=Math.max(ye.count,Pe.start+Pe.count-ye.start):(++X,fe[X]=Pe)}fe.length=X+1;let w=i.getParameter(i.UNPACK_ROW_LENGTH),q=i.getParameter(i.UNPACK_SKIP_PIXELS),ie=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let $=0,ye=fe.length;$<ye;$++){let Pe=fe[$],Se=Math.floor(Pe.start/4),P=Math.ceil(Pe.count/4),se=Se%b.width,L=Math.floor(Se/b.width),oe=P,le=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,se),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,se,L,oe,le,J,ae,b.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,w),i.pixelStorei(i.UNPACK_SKIP_PIXELS,q),i.pixelStorei(i.UNPACK_SKIP_ROWS,ie)}}function Z(R,b,J){let ae=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(ae=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(ae=i.TEXTURE_3D);let ve=V(R,b),fe=b.source;t.bindTexture(ae,R.__webglTexture,i.TEXTURE0+J);let X=n.get(fe);if(fe.version!==X.__version||ve===!0){t.activeTexture(i.TEXTURE0+J);let w=ut.getPrimaries(ut.workingColorSpace),q=b.colorSpace===Ci?null:ut.getPrimaries(b.colorSpace),ie=b.colorSpace===Ci||w===q?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let $=y(b.image,!1,s.maxTextureSize);$=Le(b,$);let ye=r.convert(b.format,b.colorSpace),Pe=r.convert(b.type),Se=x(b.internalFormat,ye,Pe,b.colorSpace,b.isVideoTexture);Ie(ae,b);let P,se=b.mipmaps,L=b.isVideoTexture!==!0,oe=X.__version===void 0||ve===!0,le=fe.dataReady,I=T(b,$);if(b.isDepthTexture)Se=v(b.format===_r,b.type),oe&&(L?t.texStorage2D(i.TEXTURE_2D,1,Se,$.width,$.height):t.texImage2D(i.TEXTURE_2D,0,Se,$.width,$.height,0,ye,Pe,null));else if(b.isDataTexture)if(se.length>0){L&&oe&&t.texStorage2D(i.TEXTURE_2D,I,Se,se[0].width,se[0].height);for(let z=0,Y=se.length;z<Y;z++)P=se[z],L?le&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,P.width,P.height,ye,Pe,P.data):t.texImage2D(i.TEXTURE_2D,z,Se,P.width,P.height,0,ye,Pe,P.data);b.generateMipmaps=!1}else L?(oe&&t.texStorage2D(i.TEXTURE_2D,I,Se,$.width,$.height),le&&Re(b,$,ye,Pe)):t.texImage2D(i.TEXTURE_2D,0,Se,$.width,$.height,0,ye,Pe,$.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){L&&oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,I,Se,se[0].width,se[0].height,$.depth);for(let z=0,Y=se.length;z<Y;z++)if(P=se[z],b.format!==Dn)if(ye!==null)if(L){if(le)if(b.layerUpdates.size>0){let Ae=Pu(P.width,P.height,b.format,b.type);for(let Ve of b.layerUpdates){let mt=P.data.subarray(Ve*Ae/P.data.BYTES_PER_ELEMENT,(Ve+1)*Ae/P.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,Ve,P.width,P.height,1,ye,mt)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,0,P.width,P.height,$.depth,ye,P.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,z,Se,P.width,P.height,$.depth,0,P.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?le&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,0,P.width,P.height,$.depth,ye,Pe,P.data):t.texImage3D(i.TEXTURE_2D_ARRAY,z,Se,P.width,P.height,$.depth,0,ye,Pe,P.data)}else{L&&oe&&t.texStorage2D(i.TEXTURE_2D,I,Se,se[0].width,se[0].height);for(let z=0,Y=se.length;z<Y;z++)P=se[z],b.format!==Dn?ye!==null?L?le&&t.compressedTexSubImage2D(i.TEXTURE_2D,z,0,0,P.width,P.height,ye,P.data):t.compressedTexImage2D(i.TEXTURE_2D,z,Se,P.width,P.height,0,P.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?le&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,P.width,P.height,ye,Pe,P.data):t.texImage2D(i.TEXTURE_2D,z,Se,P.width,P.height,0,ye,Pe,P.data)}else if(b.isDataArrayTexture)if(L){if(oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,I,Se,$.width,$.height,$.depth),le)if(b.layerUpdates.size>0){let z=Pu($.width,$.height,b.format,b.type);for(let Y of b.layerUpdates){let Ae=$.data.subarray(Y*z/$.data.BYTES_PER_ELEMENT,(Y+1)*z/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Y,$.width,$.height,1,ye,Pe,Ae)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,ye,Pe,$.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,$.width,$.height,$.depth,0,ye,Pe,$.data);else if(b.isData3DTexture)L?(oe&&t.texStorage3D(i.TEXTURE_3D,I,Se,$.width,$.height,$.depth),le&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,ye,Pe,$.data)):t.texImage3D(i.TEXTURE_3D,0,Se,$.width,$.height,$.depth,0,ye,Pe,$.data);else if(b.isFramebufferTexture){if(oe)if(L)t.texStorage2D(i.TEXTURE_2D,I,Se,$.width,$.height);else{let z=$.width,Y=$.height;for(let Ae=0;Ae<I;Ae++)t.texImage2D(i.TEXTURE_2D,Ae,Se,z,Y,0,ye,Pe,null),z>>=1,Y>>=1}}else if(se.length>0){if(L&&oe){let z=Be(se[0]);t.texStorage2D(i.TEXTURE_2D,I,Se,z.width,z.height)}for(let z=0,Y=se.length;z<Y;z++)P=se[z],L?le&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,ye,Pe,P):t.texImage2D(i.TEXTURE_2D,z,Se,ye,Pe,P);b.generateMipmaps=!1}else if(L){if(oe){let z=Be($);t.texStorage2D(i.TEXTURE_2D,I,Se,z.width,z.height)}le&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ye,Pe,$)}else t.texImage2D(i.TEXTURE_2D,0,Se,ye,Pe,$);m(b)&&h(ae),X.__version=fe.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function re(R,b,J){if(b.image.length!==6)return;let ae=V(R,b),ve=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+J);let fe=n.get(ve);if(ve.version!==fe.__version||ae===!0){t.activeTexture(i.TEXTURE0+J);let X=ut.getPrimaries(ut.workingColorSpace),w=b.colorSpace===Ci?null:ut.getPrimaries(b.colorSpace),q=b.colorSpace===Ci||X===w?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,q);let ie=b.isCompressedTexture||b.image[0].isCompressedTexture,$=b.image[0]&&b.image[0].isDataTexture,ye=[];for(let Y=0;Y<6;Y++)!ie&&!$?ye[Y]=y(b.image[Y],!0,s.maxCubemapSize):ye[Y]=$?b.image[Y].image:b.image[Y],ye[Y]=Le(b,ye[Y]);let Pe=ye[0],Se=r.convert(b.format,b.colorSpace),P=r.convert(b.type),se=x(b.internalFormat,Se,P,b.colorSpace),L=b.isVideoTexture!==!0,oe=fe.__version===void 0||ae===!0,le=ve.dataReady,I=T(b,Pe);Ie(i.TEXTURE_CUBE_MAP,b);let z;if(ie){L&&oe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,I,se,Pe.width,Pe.height);for(let Y=0;Y<6;Y++){z=ye[Y].mipmaps;for(let Ae=0;Ae<z.length;Ae++){let Ve=z[Ae];b.format!==Dn?Se!==null?L?le&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,0,0,Ve.width,Ve.height,Se,Ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,se,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,0,0,Ve.width,Ve.height,Se,P,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,se,Ve.width,Ve.height,0,Se,P,Ve.data)}}}else{if(z=b.mipmaps,L&&oe){z.length>0&&I++;let Y=Be(ye[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,I,se,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if($){L?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ye[Y].width,ye[Y].height,Se,P,ye[Y].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,se,ye[Y].width,ye[Y].height,0,Se,P,ye[Y].data);for(let Ae=0;Ae<z.length;Ae++){let mt=z[Ae].image[Y].image;L?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,0,0,mt.width,mt.height,Se,P,mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,se,mt.width,mt.height,0,Se,P,mt.data)}}else{L?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Se,P,ye[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,se,Se,P,ye[Y]);for(let Ae=0;Ae<z.length;Ae++){let Ve=z[Ae];L?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,0,0,Se,P,Ve.image[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,se,Se,P,Ve.image[Y])}}}m(b)&&h(i.TEXTURE_CUBE_MAP),fe.__version=ve.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function _e(R,b,J,ae,ve,fe){let X=r.convert(J.format,J.colorSpace),w=r.convert(J.type),q=x(J.internalFormat,X,w,J.colorSpace),ie=n.get(b),$=n.get(J);if($.__renderTarget=b,!ie.__hasExternalTextures){let ye=Math.max(1,b.width>>fe),Pe=Math.max(1,b.height>>fe);ve===i.TEXTURE_3D||ve===i.TEXTURE_2D_ARRAY?t.texImage3D(ve,fe,q,ye,Pe,b.depth,0,X,w,null):t.texImage2D(ve,fe,q,ye,Pe,0,X,w,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ce(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ae,ve,$.__webglTexture,0,me(b)):(ve===i.TEXTURE_2D||ve>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ve<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ae,ve,$.__webglTexture,fe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function xe(R,b,J){if(i.bindRenderbuffer(i.RENDERBUFFER,R),b.depthBuffer){let ae=b.depthTexture,ve=ae&&ae.isDepthTexture?ae.type:null,fe=v(b.stencilBuffer,ve),X=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,w=me(b);ce(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,w,fe,b.width,b.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,w,fe,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,fe,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,R)}else{let ae=b.textures;for(let ve=0;ve<ae.length;ve++){let fe=ae[ve],X=r.convert(fe.format,fe.colorSpace),w=r.convert(fe.type),q=x(fe.internalFormat,X,w,fe.colorSpace),ie=me(b);J&&ce(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,q,b.width,b.height):ce(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie,q,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,q,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ae=n.get(b.depthTexture);ae.__renderTarget=b,(!ae.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),W(b.depthTexture,0);let ve=ae.__webglTexture,fe=me(b);if(b.depthTexture.format===js)ce(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ve,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ve,0);else if(b.depthTexture.format===_r)ce(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ve,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function ze(R){let b=n.get(R),J=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){let ae=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),ae){let ve=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,ae.removeEventListener("dispose",ve)};ae.addEventListener("dispose",ve),b.__depthDisposeCallback=ve}b.__boundDepthTexture=ae}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");let ae=R.texture.mipmaps;ae&&ae.length>0?Te(b.__webglFramebuffer[0],R):Te(b.__webglFramebuffer,R)}else if(J){b.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[ae]),b.__webglDepthbuffer[ae]===void 0)b.__webglDepthbuffer[ae]=i.createRenderbuffer(),xe(b.__webglDepthbuffer[ae],R,!1);else{let ve=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=b.__webglDepthbuffer[ae];i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,fe)}}else{let ae=R.texture.mipmaps;if(ae&&ae.length>0?t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),xe(b.__webglDepthbuffer,R,!1);else{let ve=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,fe)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ze(R,b,J){let ae=n.get(R);b!==void 0&&_e(ae.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&ze(R)}function B(R){let b=R.texture,J=n.get(R),ae=n.get(b);R.addEventListener("dispose",C);let ve=R.textures,fe=R.isWebGLCubeRenderTarget===!0,X=ve.length>1;if(X||(ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture()),ae.__version=b.version,o.memory.textures++),fe){J.__webglFramebuffer=[];for(let w=0;w<6;w++)if(b.mipmaps&&b.mipmaps.length>0){J.__webglFramebuffer[w]=[];for(let q=0;q<b.mipmaps.length;q++)J.__webglFramebuffer[w][q]=i.createFramebuffer()}else J.__webglFramebuffer[w]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){J.__webglFramebuffer=[];for(let w=0;w<b.mipmaps.length;w++)J.__webglFramebuffer[w]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(X)for(let w=0,q=ve.length;w<q;w++){let ie=n.get(ve[w]);ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ce(R)===!1){J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let w=0;w<ve.length;w++){let q=ve[w];J.__webglColorRenderbuffer[w]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[w]);let ie=r.convert(q.format,q.colorSpace),$=r.convert(q.type),ye=x(q.internalFormat,ie,$,q.colorSpace,R.isXRRenderTarget===!0),Pe=me(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,ye,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+w,i.RENDERBUFFER,J.__webglColorRenderbuffer[w])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),xe(J.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(fe){t.bindTexture(i.TEXTURE_CUBE_MAP,ae.__webglTexture),Ie(i.TEXTURE_CUBE_MAP,b);for(let w=0;w<6;w++)if(b.mipmaps&&b.mipmaps.length>0)for(let q=0;q<b.mipmaps.length;q++)_e(J.__webglFramebuffer[w][q],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+w,q);else _e(J.__webglFramebuffer[w],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+w,0);m(b)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(X){for(let w=0,q=ve.length;w<q;w++){let ie=ve[w],$=n.get(ie),ye=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ye=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ye,$.__webglTexture),Ie(ye,ie),_e(J.__webglFramebuffer,R,ie,i.COLOR_ATTACHMENT0+w,ye,0),m(ie)&&h(ye)}t.unbindTexture()}else{let w=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(w=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(w,ae.__webglTexture),Ie(w,b),b.mipmaps&&b.mipmaps.length>0)for(let q=0;q<b.mipmaps.length;q++)_e(J.__webglFramebuffer[q],R,b,i.COLOR_ATTACHMENT0,w,q);else _e(J.__webglFramebuffer,R,b,i.COLOR_ATTACHMENT0,w,0);m(b)&&h(w),t.unbindTexture()}R.depthBuffer&&ze(R)}function Me(R){let b=R.textures;for(let J=0,ae=b.length;J<ae;J++){let ve=b[J];if(m(ve)){let fe=_(R),X=n.get(ve).__webglTexture;t.bindTexture(fe,X),h(fe),t.unbindTexture()}}}let N=[],k=[];function ne(R){if(R.samples>0){if(ce(R)===!1){let b=R.textures,J=R.width,ae=R.height,ve=i.COLOR_BUFFER_BIT,fe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=n.get(R),w=b.length>1;if(w)for(let ie=0;ie<b.length;ie++)t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,X.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,X.__webglMultisampledFramebuffer);let q=R.texture.mipmaps;q&&q.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglFramebuffer);for(let ie=0;ie<b.length;ie++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ve|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ve|=i.STENCIL_BUFFER_BIT)),w){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,X.__webglColorRenderbuffer[ie]);let $=n.get(b[ie]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$,0)}i.blitFramebuffer(0,0,J,ae,0,0,J,ae,ve,i.NEAREST),c===!0&&(N.length=0,k.length=0,N.push(i.COLOR_ATTACHMENT0+ie),R.depthBuffer&&R.resolveDepthBuffer===!1&&(N.push(fe),k.push(fe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,N))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),w)for(let ie=0;ie<b.length;ie++){t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,X.__webglColorRenderbuffer[ie]);let $=n.get(b[ie]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,X.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,$,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let b=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function me(R){return Math.min(s.maxSamples,R.samples)}function ce(R){let b=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ge(R){let b=o.render.frame;u.get(R)!==b&&(u.set(R,b),R.update())}function Le(R,b){let J=R.colorSpace,ae=R.format,ve=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||J!==us&&J!==Ci&&(ut.getTransfer(J)===xt?(ae!==Dn||ve!==ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",J)),b}function Be(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=H,this.setTexture2D=W,this.setTexture2DArray=K,this.setTexture3D=he,this.setTextureCube=ee,this.rebindTextures=Ze,this.setupRenderTarget=B,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=ne,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=ce}function wx(i,e){function t(n,s=Ci){let r,o=ut.getTransfer(s);if(n===ni)return i.UNSIGNED_BYTE;if(n===_l)return i.UNSIGNED_SHORT_4_4_4_4;if(n===yl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===gu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===_u)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===pu)return i.BYTE;if(n===mu)return i.SHORT;if(n===pr)return i.UNSIGNED_SHORT;if(n===gl)return i.INT;if(n===qi)return i.UNSIGNED_INT;if(n===ii)return i.FLOAT;if(n===mr)return i.HALF_FLOAT;if(n===yu)return i.ALPHA;if(n===xu)return i.RGB;if(n===Dn)return i.RGBA;if(n===js)return i.DEPTH_COMPONENT;if(n===_r)return i.DEPTH_STENCIL;if(n===vu)return i.RED;if(n===xl)return i.RED_INTEGER;if(n===Mu)return i.RG;if(n===vl)return i.RG_INTEGER;if(n===Ml)return i.RGBA_INTEGER;if(n===Co||n===Io||n===Po||n===Lo)if(o===xt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Co)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Co)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Lo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===bl||n===Sl||n===El||n===wl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===bl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===wl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tl||n===Al||n===Rl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Tl||n===Al)return o===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Rl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Cl||n===Il||n===Pl||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol||n===Bl||n===kl||n===Hl||n===zl||n===Vl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Cl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Il)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ll)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Dl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ul)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ol)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===kl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Hl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===zl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Gl||n===Wl||n===Xl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Gl)return o===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ql||n===Yl||n===$l||n===Zl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ql)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Yl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$l)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Zl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Tx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ax=`
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

}`,Wu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new co(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ti({vertexShader:Tx,fragmentShader:Ax,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ue(new nn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xu=class extends wi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,f=null,d=null,p=null,g=null,y=typeof XRWebGLBinding<"u",m=new Wu,h={},_=t.getContextAttributes(),x=null,v=null,T=[],E=[],C=new Ce,U=null,M=new Wt;M.viewport=new ft;let S=new Wt;S.viewport=new ft;let D=[M,S],H=new il,G=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let re=T[Z];return re===void 0&&(re=new ir,T[Z]=re),re.getTargetRaySpace()},this.getControllerGrip=function(Z){let re=T[Z];return re===void 0&&(re=new ir,T[Z]=re),re.getGripSpace()},this.getHand=function(Z){let re=T[Z];return re===void 0&&(re=new ir,T[Z]=re),re.getHandSpace()};function W(Z){let re=E.indexOf(Z.inputSource);if(re===-1)return;let _e=T[re];_e!==void 0&&(_e.update(Z.inputSource,Z.frame,l||o),_e.dispatchEvent({type:Z.type,data:Z.inputSource}))}function K(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",he);for(let Z=0;Z<T.length;Z++){let re=E[Z];re!==null&&(E[Z]=null,T[Z].disconnect(re))}G=null,F=null,m.reset();for(let Z in h)delete h[Z];e.setRenderTarget(x),p=null,d=null,f=null,s=null,v=null,Re.stop(),n.isPresenting=!1,e.setPixelRatio(U),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(x=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",K),s.addEventListener("inputsourceschange",he),_.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,xe=null,Te=null;_.depth&&(Te=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=_.stencil?_r:js,xe=_.stencil?gr:qi);let ze={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(ze),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new ci(d.textureWidth,d.textureHeight,{format:Dn,type:ni,depthTexture:new lo(d.textureWidth,d.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let _e={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new ci(p.framebufferWidth,p.framebufferHeight,{format:Dn,type:ni,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Re.setContext(s),Re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function he(Z){for(let re=0;re<Z.removed.length;re++){let _e=Z.removed[re],xe=E.indexOf(_e);xe>=0&&(E[xe]=null,T[xe].disconnect(_e))}for(let re=0;re<Z.added.length;re++){let _e=Z.added[re],xe=E.indexOf(_e);if(xe===-1){for(let ze=0;ze<T.length;ze++)if(ze>=E.length){E.push(_e),xe=ze;break}else if(E[ze]===null){E[ze]=_e,xe=ze;break}if(xe===-1)break}let Te=T[xe];Te&&Te.connect(_e)}}let ee=new O,be=new O;function te(Z,re,_e){ee.setFromMatrixPosition(re.matrixWorld),be.setFromMatrixPosition(_e.matrixWorld);let xe=ee.distanceTo(be),Te=re.projectionMatrix.elements,ze=_e.projectionMatrix.elements,Ze=Te[14]/(Te[10]-1),B=Te[14]/(Te[10]+1),Me=(Te[9]+1)/Te[5],N=(Te[9]-1)/Te[5],k=(Te[8]-1)/Te[0],ne=(ze[8]+1)/ze[0],me=Ze*k,ce=Ze*ne,ge=xe/(-k+ne),Le=ge*-k;if(re.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Le),Z.translateZ(ge),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Te[10]===-1)Z.projectionMatrix.copy(re.projectionMatrix),Z.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{let Be=Ze+ge,R=B+ge,b=me-Le,J=ce+(xe-Le),ae=Me*B/R*Be,ve=N*B/R*Be;Z.projectionMatrix.makePerspective(b,J,ae,ve,Be,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Ee(Z,re){re===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(re.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let re=Z.near,_e=Z.far;m.texture!==null&&(m.depthNear>0&&(re=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),H.near=S.near=M.near=re,H.far=S.far=M.far=_e,(G!==H.near||F!==H.far)&&(s.updateRenderState({depthNear:H.near,depthFar:H.far}),G=H.near,F=H.far),H.layers.mask=Z.layers.mask|6,M.layers.mask=H.layers.mask&3,S.layers.mask=H.layers.mask&5;let xe=Z.parent,Te=H.cameras;Ee(H,xe);for(let ze=0;ze<Te.length;ze++)Ee(Te[ze],xe);Te.length===2?te(H,M,S):H.projectionMatrix.copy(M.projectionMatrix),Ie(Z,H,xe)};function Ie(Z,re,_e){_e===null?Z.matrix.copy(re.matrixWorld):(Z.matrix.copy(_e.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(re.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(re.projectionMatrix),Z.projectionMatrixInverse.copy(re.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Qs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(H)},this.getCameraTexture=function(Z){return h[Z]};let V=null;function ue(Z,re){if(u=re.getViewerPose(l||o),g=re,u!==null){let _e=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let xe=!1;_e.length!==H.cameras.length&&(H.cameras.length=0,xe=!0);for(let B=0;B<_e.length;B++){let Me=_e[B],N=null;if(p!==null)N=p.getViewport(Me);else{let ne=f.getViewSubImage(d,Me);N=ne.viewport,B===0&&(e.setRenderTargetTextures(v,ne.colorTexture,ne.depthStencilTexture),e.setRenderTarget(v))}let k=D[B];k===void 0&&(k=new Wt,k.layers.enable(B),k.viewport=new ft,D[B]=k),k.matrix.fromArray(Me.transform.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale),k.projectionMatrix.fromArray(Me.projectionMatrix),k.projectionMatrixInverse.copy(k.projectionMatrix).invert(),k.viewport.set(N.x,N.y,N.width,N.height),B===0&&(H.matrix.copy(k.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),xe===!0&&H.cameras.push(k)}let Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){f=n.getBinding();let B=f.getDepthInformation(_e[0]);B&&B.isValid&&B.texture&&m.init(B,s.renderState)}if(Te&&Te.includes("camera-access")&&y){e.state.unbindTexture(),f=n.getBinding();for(let B=0;B<_e.length;B++){let Me=_e[B].camera;if(Me){let N=h[Me];N||(N=new co,h[Me]=N);let k=f.getCameraImage(Me);N.sourceTexture=k}}}}for(let _e=0;_e<T.length;_e++){let xe=E[_e],Te=T[_e];xe!==null&&Te!==void 0&&Te.update(xe,re,l||o)}V&&V(Z,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),g=null}let Re=new yf;Re.setAnimationLoop(ue),this.setAnimationLoop=function(Z){V=Z},this.dispose=function(){}}},_s=new fn,Rx=new at;function Cx(i,e){function t(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,Au(i)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function s(m,h,_,x,v){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(m,h):h.isMeshToonMaterial?(r(m,h),f(m,h)):h.isMeshPhongMaterial?(r(m,h),u(m,h)):h.isMeshStandardMaterial?(r(m,h),d(m,h),h.isMeshPhysicalMaterial&&p(m,h,v)):h.isMeshMatcapMaterial?(r(m,h),g(m,h)):h.isMeshDepthMaterial?r(m,h):h.isMeshDistanceMaterial?(r(m,h),y(m,h)):h.isMeshNormalMaterial?r(m,h):h.isLineBasicMaterial?(o(m,h),h.isLineDashedMaterial&&a(m,h)):h.isPointsMaterial?c(m,h,_,x):h.isSpriteMaterial?l(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,t(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===pn&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,t(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===pn&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,t(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,t(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);let _=e.get(h),x=_.envMap,v=_.envMapRotation;x&&(m.envMap.value=x,_s.copy(v),_s.x*=-1,_s.y*=-1,_s.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(_s.y*=-1,_s.z*=-1),m.envMapRotation.value.setFromMatrix4(Rx.makeRotationFromEuler(_s)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,m.aoMapTransform))}function o(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform))}function a(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function c(m,h,_,x){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*_,m.scale.value=x*.5,h.map&&(m.map.value=h.map,t(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function l(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function f(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function d(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,_){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===pn&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function y(m,h){let _=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Ix(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){let v=x.program;n.uniformBlockBinding(_,v)}function l(_,x){let v=s[_.id];v===void 0&&(g(_),v=u(_),s[_.id]=v,_.addEventListener("dispose",m));let T=x.program;n.updateUBOMapping(_,T);let E=e.render.frame;r[_.id]!==E&&(d(_),r[_.id]=E)}function u(_){let x=f();_.__bindingPointIndex=x;let v=i.createBuffer(),T=_.__size,E=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,T,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,v),v}function f(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){let x=s[_.id],v=_.uniforms,T=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let E=0,C=v.length;E<C;E++){let U=Array.isArray(v[E])?v[E]:[v[E]];for(let M=0,S=U.length;M<S;M++){let D=U[M];if(p(D,E,M,T)===!0){let H=D.__offset,G=Array.isArray(D.value)?D.value:[D.value],F=0;for(let W=0;W<G.length;W++){let K=G[W],he=y(K);typeof K=="number"||typeof K=="boolean"?(D.__data[0]=K,i.bufferSubData(i.UNIFORM_BUFFER,H+F,D.__data)):K.isMatrix3?(D.__data[0]=K.elements[0],D.__data[1]=K.elements[1],D.__data[2]=K.elements[2],D.__data[3]=0,D.__data[4]=K.elements[3],D.__data[5]=K.elements[4],D.__data[6]=K.elements[5],D.__data[7]=0,D.__data[8]=K.elements[6],D.__data[9]=K.elements[7],D.__data[10]=K.elements[8],D.__data[11]=0):(K.toArray(D.__data,F),F+=he.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,H,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(_,x,v,T){let E=_.value,C=x+"_"+v;if(T[C]===void 0)return typeof E=="number"||typeof E=="boolean"?T[C]=E:T[C]=E.clone(),!0;{let U=T[C];if(typeof E=="number"||typeof E=="boolean"){if(U!==E)return T[C]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function g(_){let x=_.uniforms,v=0,T=16;for(let C=0,U=x.length;C<U;C++){let M=Array.isArray(x[C])?x[C]:[x[C]];for(let S=0,D=M.length;S<D;S++){let H=M[S],G=Array.isArray(H.value)?H.value:[H.value];for(let F=0,W=G.length;F<W;F++){let K=G[F],he=y(K),ee=v%T,be=ee%he.boundary,te=ee+be;v+=be,te!==0&&T-te<he.storage&&(v+=T-te),H.__data=new Float32Array(he.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=v,v+=he.storage}}}let E=v%T;return E>0&&(v+=T-E),_.__size=v,_.__cache={},this}function y(_){let x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function m(_){let x=_.target;x.removeEventListener("dispose",m);let v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function h(){for(let _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:c,update:l,dispose:h}}var ec=class{constructor(e={}){let{canvas:t=Bd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),y=new Int32Array(4),m=null,h=null,_=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=kt;let E=0,C=0,U=null,M=-1,S=null,D=new ft,H=new ft,G=null,F=new Ye(0),W=0,K=t.width,he=t.height,ee=1,be=null,te=null,Ee=new ft(0,0,K,he),Ie=new ft(0,0,K,he),V=!1,ue=new ar,Re=!1,Z=!1,re=new at,_e=new O,xe=new ft,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ze=!1;function Ze(){return U===null?ee:1}let B=n;function Me(A,j){return t.getContext(A,j)}try{let A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",le,!1),t.addEventListener("webglcontextrestored",I,!1),t.addEventListener("webglcontextcreationerror",z,!1),B===null){let j="webgl2";if(B=Me(j,A),B===null)throw Me(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let N,k,ne,me,ce,ge,Le,Be,R,b,J,ae,ve,fe,X,w,q,ie,$,ye,Pe,Se,P,se;function L(){N=new $_(B),N.init(),Se=new wx(B,N),k=new z_(B,N,e,Se),ne=new Sx(B,N),k.reversedDepthBuffer&&d&&ne.buffers.depth.setReversed(!0),me=new K_(B),ce=new ux,ge=new Ex(B,N,ne,ce,k,Se,me),Le=new G_(v),Be=new Y_(v),R=new ig(B),P=new k_(B,R),b=new Z_(B,R,me,P),J=new Q_(B,b,R,me),$=new j_(B,k,ge),w=new V_(ce),ae=new cx(v,Le,Be,N,k,P,w),ve=new Cx(v,ce),fe=new dx,X=new yx(N),ie=new B_(v,Le,Be,ne,J,p,c),q=new Mx(v,J,k),se=new Ix(B,me,k,ne),ye=new H_(B,N,me),Pe=new J_(B,N,me),me.programs=ae.programs,v.capabilities=k,v.extensions=N,v.properties=ce,v.renderLists=fe,v.shadowMap=q,v.state=ne,v.info=me}L();let oe=new Xu(v,B);this.xr=oe,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let A=N.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=N.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(A){A!==void 0&&(ee=A,this.setSize(K,he,!1))},this.getSize=function(A){return A.set(K,he)},this.setSize=function(A,j,de=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=A,he=j,t.width=Math.floor(A*ee),t.height=Math.floor(j*ee),de===!0&&(t.style.width=A+"px",t.style.height=j+"px"),this.setViewport(0,0,A,j)},this.getDrawingBufferSize=function(A){return A.set(K*ee,he*ee).floor()},this.setDrawingBufferSize=function(A,j,de){K=A,he=j,ee=de,t.width=Math.floor(A*de),t.height=Math.floor(j*de),this.setViewport(0,0,A,j)},this.getCurrentViewport=function(A){return A.copy(D)},this.getViewport=function(A){return A.copy(Ee)},this.setViewport=function(A,j,de,pe){A.isVector4?Ee.set(A.x,A.y,A.z,A.w):Ee.set(A,j,de,pe),ne.viewport(D.copy(Ee).multiplyScalar(ee).round())},this.getScissor=function(A){return A.copy(Ie)},this.setScissor=function(A,j,de,pe){A.isVector4?Ie.set(A.x,A.y,A.z,A.w):Ie.set(A,j,de,pe),ne.scissor(H.copy(Ie).multiplyScalar(ee).round())},this.getScissorTest=function(){return V},this.setScissorTest=function(A){ne.setScissorTest(V=A)},this.setOpaqueSort=function(A){be=A},this.setTransparentSort=function(A){te=A},this.getClearColor=function(A){return A.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(A=!0,j=!0,de=!0){let pe=0;if(A){let Q=!1;if(U!==null){let De=U.texture.format;Q=De===Ml||De===vl||De===xl}if(Q){let De=U.texture.type,Fe=De===ni||De===qi||De===pr||De===gr||De===_l||De===yl,Ge=ie.getClearColor(),He=ie.getClearAlpha(),$e=Ge.r,Je=Ge.g,Xe=Ge.b;Fe?(g[0]=$e,g[1]=Je,g[2]=Xe,g[3]=He,B.clearBufferuiv(B.COLOR,0,g)):(y[0]=$e,y[1]=Je,y[2]=Xe,y[3]=He,B.clearBufferiv(B.COLOR,0,y))}else pe|=B.COLOR_BUFFER_BIT}j&&(pe|=B.DEPTH_BUFFER_BIT),de&&(pe|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(pe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",le,!1),t.removeEventListener("webglcontextrestored",I,!1),t.removeEventListener("webglcontextcreationerror",z,!1),ie.dispose(),fe.dispose(),X.dispose(),ce.dispose(),Le.dispose(),Be.dispose(),J.dispose(),P.dispose(),se.dispose(),ae.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Bn),oe.removeEventListener("sessionend",Pr),gi.stop()};function le(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let A=me.autoReset,j=q.enabled,de=q.autoUpdate,pe=q.needsUpdate,Q=q.type;L(),me.autoReset=A,q.enabled=j,q.autoUpdate=de,q.needsUpdate=pe,q.type=Q}function z(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Y(A){let j=A.target;j.removeEventListener("dispose",Y),Ae(j)}function Ae(A){Ve(A),ce.remove(A)}function Ve(A){let j=ce.get(A).programs;j!==void 0&&(j.forEach(function(de){ae.releaseProgram(de)}),A.isShaderMaterial&&ae.releaseShaderCache(A))}this.renderBufferDirect=function(A,j,de,pe,Q,De){j===null&&(j=Te);let Fe=Q.isMesh&&Q.matrixWorld.determinant()<0,Ge=Mp(A,j,de,pe,Q);ne.setMaterial(pe,Fe);let He=de.index,$e=1;if(pe.wireframe===!0){if(He=b.getWireframeAttribute(de),He===void 0)return;$e=2}let Je=de.drawRange,Xe=de.attributes.position,ct=Je.start*$e,vt=(Je.start+Je.count)*$e;De!==null&&(ct=Math.max(ct,De.start*$e),vt=Math.min(vt,(De.start+De.count)*$e)),He!==null?(ct=Math.max(ct,0),vt=Math.min(vt,He.count)):Xe!=null&&(ct=Math.max(ct,0),vt=Math.min(vt,Xe.count));let Ut=vt-ct;if(Ut<0||Ut===1/0)return;P.setup(Q,pe,Ge,de,He);let Et,Mt=ye;if(He!==null&&(Et=R.get(He),Mt=Pe,Mt.setIndex(Et)),Q.isMesh)pe.wireframe===!0?(ne.setLineWidth(pe.wireframeLinewidth*Ze()),Mt.setMode(B.LINES)):Mt.setMode(B.TRIANGLES);else if(Q.isLine){let qe=pe.linewidth;qe===void 0&&(qe=1),ne.setLineWidth(qe*Ze()),Q.isLineSegments?Mt.setMode(B.LINES):Q.isLineLoop?Mt.setMode(B.LINE_LOOP):Mt.setMode(B.LINE_STRIP)}else Q.isPoints?Mt.setMode(B.POINTS):Q.isSprite&&Mt.setMode(B.TRIANGLES);if(Q.isBatchedMesh)if(Q._multiDrawInstances!==null)er("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Mt.renderMultiDrawInstances(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount,Q._multiDrawInstances);else if(N.get("WEBGL_multi_draw"))Mt.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{let qe=Q._multiDrawStarts,Rt=Q._multiDrawCounts,ht=Q._multiDrawCount,wn=He?R.get(He).bytesPerElement:1,Is=ce.get(pe).currentProgram.getUniforms();for(let Tn=0;Tn<ht;Tn++)Is.setValue(B,"_gl_DrawID",Tn),Mt.render(qe[Tn]/wn,Rt[Tn])}else if(Q.isInstancedMesh)Mt.renderInstances(ct,Ut,Q.count);else if(de.isInstancedBufferGeometry){let qe=de._maxInstanceCount!==void 0?de._maxInstanceCount:1/0,Rt=Math.min(de.instanceCount,qe);Mt.renderInstances(ct,Ut,Rt)}else Mt.render(ct,Ut)};function mt(A,j,de){A.transparent===!0&&A.side===pt&&A.forceSinglePass===!1?(A.side=pn,A.needsUpdate=!0,Zo(A,j,de),A.side=Ei,A.needsUpdate=!0,Zo(A,j,de),A.side=pt):Zo(A,j,de)}this.compile=function(A,j,de=null){de===null&&(de=A),h=X.get(de),h.init(j),x.push(h),de.traverseVisible(function(Q){Q.isLight&&Q.layers.test(j.layers)&&(h.pushLight(Q),Q.castShadow&&h.pushShadow(Q))}),A!==de&&A.traverseVisible(function(Q){Q.isLight&&Q.layers.test(j.layers)&&(h.pushLight(Q),Q.castShadow&&h.pushShadow(Q))}),h.setupLights();let pe=new Set;return A.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;let De=Q.material;if(De)if(Array.isArray(De))for(let Fe=0;Fe<De.length;Fe++){let Ge=De[Fe];mt(Ge,de,Q),pe.add(Ge)}else mt(De,de,Q),pe.add(De)}),h=x.pop(),pe},this.compileAsync=function(A,j,de=null){let pe=this.compile(A,j,de);return new Promise(Q=>{function De(){if(pe.forEach(function(Fe){ce.get(Fe).currentProgram.isReady()&&pe.delete(Fe)}),pe.size===0){Q(A);return}setTimeout(De,10)}N.get("KHR_parallel_shader_compile")!==null?De():setTimeout(De,10)})};let nt=null;function yn(A){nt&&nt(A)}function Bn(){gi.stop()}function Pr(){gi.start()}let gi=new yf;gi.setAnimationLoop(yn),typeof self<"u"&&gi.setContext(self),this.setAnimationLoop=function(A){nt=A,oe.setAnimationLoop(A),A===null?gi.stop():gi.start()},oe.addEventListener("sessionstart",Bn),oe.addEventListener("sessionend",Pr),this.render=function(A,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(j),j=oe.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,j,U),h=X.get(A,x.length),h.init(j),x.push(h),re.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),ue.setFromProjectionMatrix(re,Jn,j.reversedDepth),Z=this.localClippingEnabled,Re=w.init(this.clippingPlanes,Z),m=fe.get(A,_.length),m.init(),_.push(m),oe.enabled===!0&&oe.isPresenting===!0){let De=v.xr.getDepthSensingMesh();De!==null&&Cs(De,j,-1/0,v.sortObjects)}Cs(A,j,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(be,te),ze=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,ze&&ie.addToRenderList(m,A),this.info.render.frame++,Re===!0&&w.beginShadows();let de=h.state.shadowsArray;q.render(de,A,j),Re===!0&&w.endShadows(),this.info.autoReset===!0&&this.info.reset();let pe=m.opaque,Q=m.transmissive;if(h.setupLights(),j.isArrayCamera){let De=j.cameras;if(Q.length>0)for(let Fe=0,Ge=De.length;Fe<Ge;Fe++){let He=De[Fe];nh(pe,Q,A,He)}ze&&ie.render(A);for(let Fe=0,Ge=De.length;Fe<Ge;Fe++){let He=De[Fe];th(m,A,He,He.viewport)}}else Q.length>0&&nh(pe,Q,A,j),ze&&ie.render(A),th(m,A,j);U!==null&&C===0&&(ge.updateMultisampleRenderTarget(U),ge.updateRenderTargetMipmap(U)),A.isScene===!0&&A.onAfterRender(v,A,j),P.resetDefaultState(),M=-1,S=null,x.pop(),x.length>0?(h=x[x.length-1],Re===!0&&w.setGlobalState(v.clippingPlanes,h.state.camera)):h=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function Cs(A,j,de,pe){if(A.visible===!1)return;if(A.layers.test(j.layers)){if(A.isGroup)de=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(j);else if(A.isLight)h.pushLight(A),A.castShadow&&h.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ue.intersectsSprite(A)){pe&&xe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(re);let Fe=J.update(A),Ge=A.material;Ge.visible&&m.push(A,Fe,Ge,de,xe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ue.intersectsObject(A))){let Fe=J.update(A),Ge=A.material;if(pe&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),xe.copy(A.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),xe.copy(Fe.boundingSphere.center)),xe.applyMatrix4(A.matrixWorld).applyMatrix4(re)),Array.isArray(Ge)){let He=Fe.groups;for(let $e=0,Je=He.length;$e<Je;$e++){let Xe=He[$e],ct=Ge[Xe.materialIndex];ct&&ct.visible&&m.push(A,Fe,ct,de,xe.z,Xe)}}else Ge.visible&&m.push(A,Fe,Ge,de,xe.z,null)}}let De=A.children;for(let Fe=0,Ge=De.length;Fe<Ge;Fe++)Cs(De[Fe],j,de,pe)}function th(A,j,de,pe){let Q=A.opaque,De=A.transmissive,Fe=A.transparent;h.setupLightsView(de),Re===!0&&w.setGlobalState(v.clippingPlanes,de),pe&&ne.viewport(D.copy(pe)),Q.length>0&&$o(Q,j,de),De.length>0&&$o(De,j,de),Fe.length>0&&$o(Fe,j,de),ne.buffers.depth.setTest(!0),ne.buffers.depth.setMask(!0),ne.buffers.color.setMask(!0),ne.setPolygonOffset(!1)}function nh(A,j,de,pe){if((de.isScene===!0?de.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[pe.id]===void 0&&(h.state.transmissionRenderTarget[pe.id]=new ci(1,1,{generateMipmaps:!0,type:N.has("EXT_color_buffer_half_float")||N.has("EXT_color_buffer_float")?mr:ni,minFilter:Xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ut.workingColorSpace}));let De=h.state.transmissionRenderTarget[pe.id],Fe=pe.viewport||D;De.setSize(Fe.z*v.transmissionResolutionScale,Fe.w*v.transmissionResolutionScale);let Ge=v.getRenderTarget(),He=v.getActiveCubeFace(),$e=v.getActiveMipmapLevel();v.setRenderTarget(De),v.getClearColor(F),W=v.getClearAlpha(),W<1&&v.setClearColor(16777215,.5),v.clear(),ze&&ie.render(de);let Je=v.toneMapping;v.toneMapping=Ri;let Xe=pe.viewport;if(pe.viewport!==void 0&&(pe.viewport=void 0),h.setupLightsView(pe),Re===!0&&w.setGlobalState(v.clippingPlanes,pe),$o(A,de,pe),ge.updateMultisampleRenderTarget(De),ge.updateRenderTargetMipmap(De),N.has("WEBGL_multisampled_render_to_texture")===!1){let ct=!1;for(let vt=0,Ut=j.length;vt<Ut;vt++){let Et=j[vt],Mt=Et.object,qe=Et.geometry,Rt=Et.material,ht=Et.group;if(Rt.side===pt&&Mt.layers.test(pe.layers)){let wn=Rt.side;Rt.side=pn,Rt.needsUpdate=!0,ih(Mt,de,pe,qe,Rt,ht),Rt.side=wn,Rt.needsUpdate=!0,ct=!0}}ct===!0&&(ge.updateMultisampleRenderTarget(De),ge.updateRenderTargetMipmap(De))}v.setRenderTarget(Ge,He,$e),v.setClearColor(F,W),Xe!==void 0&&(pe.viewport=Xe),v.toneMapping=Je}function $o(A,j,de){let pe=j.isScene===!0?j.overrideMaterial:null;for(let Q=0,De=A.length;Q<De;Q++){let Fe=A[Q],Ge=Fe.object,He=Fe.geometry,$e=Fe.group,Je=Fe.material;Je.allowOverride===!0&&pe!==null&&(Je=pe),Ge.layers.test(de.layers)&&ih(Ge,j,de,He,Je,$e)}}function ih(A,j,de,pe,Q,De){A.onBeforeRender(v,j,de,pe,Q,De),A.modelViewMatrix.multiplyMatrices(de.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Q.onBeforeRender(v,j,de,pe,A,De),Q.transparent===!0&&Q.side===pt&&Q.forceSinglePass===!1?(Q.side=pn,Q.needsUpdate=!0,v.renderBufferDirect(de,j,pe,Q,A,De),Q.side=Ei,Q.needsUpdate=!0,v.renderBufferDirect(de,j,pe,Q,A,De),Q.side=pt):v.renderBufferDirect(de,j,pe,Q,A,De),A.onAfterRender(v,j,de,pe,Q,De)}function Zo(A,j,de){j.isScene!==!0&&(j=Te);let pe=ce.get(A),Q=h.state.lights,De=h.state.shadowsArray,Fe=Q.state.version,Ge=ae.getParameters(A,Q.state,De,j,de),He=ae.getProgramCacheKey(Ge),$e=pe.programs;pe.environment=A.isMeshStandardMaterial?j.environment:null,pe.fog=j.fog,pe.envMap=(A.isMeshStandardMaterial?Be:Le).get(A.envMap||pe.environment),pe.envMapRotation=pe.environment!==null&&A.envMap===null?j.environmentRotation:A.envMapRotation,$e===void 0&&(A.addEventListener("dispose",Y),$e=new Map,pe.programs=$e);let Je=$e.get(He);if(Je!==void 0){if(pe.currentProgram===Je&&pe.lightsStateVersion===Fe)return rh(A,Ge),Je}else Ge.uniforms=ae.getUniforms(A),A.onBeforeCompile(Ge,v),Je=ae.acquireProgram(Ge,He),$e.set(He,Je),pe.uniforms=Ge.uniforms;let Xe=pe.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Xe.clippingPlanes=w.uniform),rh(A,Ge),pe.needsLights=Sp(A),pe.lightsStateVersion=Fe,pe.needsLights&&(Xe.ambientLightColor.value=Q.state.ambient,Xe.lightProbe.value=Q.state.probe,Xe.directionalLights.value=Q.state.directional,Xe.directionalLightShadows.value=Q.state.directionalShadow,Xe.spotLights.value=Q.state.spot,Xe.spotLightShadows.value=Q.state.spotShadow,Xe.rectAreaLights.value=Q.state.rectArea,Xe.ltc_1.value=Q.state.rectAreaLTC1,Xe.ltc_2.value=Q.state.rectAreaLTC2,Xe.pointLights.value=Q.state.point,Xe.pointLightShadows.value=Q.state.pointShadow,Xe.hemisphereLights.value=Q.state.hemi,Xe.directionalShadowMap.value=Q.state.directionalShadowMap,Xe.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,Xe.spotShadowMap.value=Q.state.spotShadowMap,Xe.spotLightMatrix.value=Q.state.spotLightMatrix,Xe.spotLightMap.value=Q.state.spotLightMap,Xe.pointShadowMap.value=Q.state.pointShadowMap,Xe.pointShadowMatrix.value=Q.state.pointShadowMatrix),pe.currentProgram=Je,pe.uniformsList=null,Je}function sh(A){if(A.uniformsList===null){let j=A.currentProgram.getUniforms();A.uniformsList=vr.seqWithValue(j.seq,A.uniforms)}return A.uniformsList}function rh(A,j){let de=ce.get(A);de.outputColorSpace=j.outputColorSpace,de.batching=j.batching,de.batchingColor=j.batchingColor,de.instancing=j.instancing,de.instancingColor=j.instancingColor,de.instancingMorph=j.instancingMorph,de.skinning=j.skinning,de.morphTargets=j.morphTargets,de.morphNormals=j.morphNormals,de.morphColors=j.morphColors,de.morphTargetsCount=j.morphTargetsCount,de.numClippingPlanes=j.numClippingPlanes,de.numIntersection=j.numClipIntersection,de.vertexAlphas=j.vertexAlphas,de.vertexTangents=j.vertexTangents,de.toneMapping=j.toneMapping}function Mp(A,j,de,pe,Q){j.isScene!==!0&&(j=Te),ge.resetTextureUnits();let De=j.fog,Fe=pe.isMeshStandardMaterial?j.environment:null,Ge=U===null?v.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:us,He=(pe.isMeshStandardMaterial?Be:Le).get(pe.envMap||Fe),$e=pe.vertexColors===!0&&!!de.attributes.color&&de.attributes.color.itemSize===4,Je=!!de.attributes.tangent&&(!!pe.normalMap||pe.anisotropy>0),Xe=!!de.morphAttributes.position,ct=!!de.morphAttributes.normal,vt=!!de.morphAttributes.color,Ut=Ri;pe.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Ut=v.toneMapping);let Et=de.morphAttributes.position||de.morphAttributes.normal||de.morphAttributes.color,Mt=Et!==void 0?Et.length:0,qe=ce.get(pe),Rt=h.state.lights;if(Re===!0&&(Z===!0||A!==S)){let un=A===S&&pe.id===M;w.setState(pe,A,un)}let ht=!1;pe.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Rt.state.version||qe.outputColorSpace!==Ge||Q.isBatchedMesh&&qe.batching===!1||!Q.isBatchedMesh&&qe.batching===!0||Q.isBatchedMesh&&qe.batchingColor===!0&&Q.colorTexture===null||Q.isBatchedMesh&&qe.batchingColor===!1&&Q.colorTexture!==null||Q.isInstancedMesh&&qe.instancing===!1||!Q.isInstancedMesh&&qe.instancing===!0||Q.isSkinnedMesh&&qe.skinning===!1||!Q.isSkinnedMesh&&qe.skinning===!0||Q.isInstancedMesh&&qe.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&qe.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&qe.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&qe.instancingMorph===!1&&Q.morphTexture!==null||qe.envMap!==He||pe.fog===!0&&qe.fog!==De||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==w.numPlanes||qe.numIntersection!==w.numIntersection)||qe.vertexAlphas!==$e||qe.vertexTangents!==Je||qe.morphTargets!==Xe||qe.morphNormals!==ct||qe.morphColors!==vt||qe.toneMapping!==Ut||qe.morphTargetsCount!==Mt)&&(ht=!0):(ht=!0,qe.__version=pe.version);let wn=qe.currentProgram;ht===!0&&(wn=Zo(pe,j,Q));let Is=!1,Tn=!1,Lr=!1,Ct=wn.getUniforms(),kn=qe.uniforms;if(ne.useProgram(wn.program)&&(Is=!0,Tn=!0,Lr=!0),pe.id!==M&&(M=pe.id,Tn=!0),Is||S!==A){ne.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Ct.setValue(B,"projectionMatrix",A.projectionMatrix),Ct.setValue(B,"viewMatrix",A.matrixWorldInverse);let xn=Ct.map.cameraPosition;xn!==void 0&&xn.setValue(B,_e.setFromMatrixPosition(A.matrixWorld)),k.logarithmicDepthBuffer&&Ct.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(pe.isMeshPhongMaterial||pe.isMeshToonMaterial||pe.isMeshLambertMaterial||pe.isMeshBasicMaterial||pe.isMeshStandardMaterial||pe.isShaderMaterial)&&Ct.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,Tn=!0,Lr=!0)}if(Q.isSkinnedMesh){Ct.setOptional(B,Q,"bindMatrix"),Ct.setOptional(B,Q,"bindMatrixInverse");let un=Q.skeleton;un&&(un.boneTexture===null&&un.computeBoneTexture(),Ct.setValue(B,"boneTexture",un.boneTexture,ge))}Q.isBatchedMesh&&(Ct.setOptional(B,Q,"batchingTexture"),Ct.setValue(B,"batchingTexture",Q._matricesTexture,ge),Ct.setOptional(B,Q,"batchingIdTexture"),Ct.setValue(B,"batchingIdTexture",Q._indirectTexture,ge),Ct.setOptional(B,Q,"batchingColorTexture"),Q._colorsTexture!==null&&Ct.setValue(B,"batchingColorTexture",Q._colorsTexture,ge));let Hn=de.morphAttributes;if((Hn.position!==void 0||Hn.normal!==void 0||Hn.color!==void 0)&&$.update(Q,de,wn),(Tn||qe.receiveShadow!==Q.receiveShadow)&&(qe.receiveShadow=Q.receiveShadow,Ct.setValue(B,"receiveShadow",Q.receiveShadow)),pe.isMeshGouraudMaterial&&pe.envMap!==null&&(kn.envMap.value=He,kn.flipEnvMap.value=He.isCubeTexture&&He.isRenderTargetTexture===!1?-1:1),pe.isMeshStandardMaterial&&pe.envMap===null&&j.environment!==null&&(kn.envMapIntensity.value=j.environmentIntensity),Tn&&(Ct.setValue(B,"toneMappingExposure",v.toneMappingExposure),qe.needsLights&&bp(kn,Lr),De&&pe.fog===!0&&ve.refreshFogUniforms(kn,De),ve.refreshMaterialUniforms(kn,pe,ee,he,h.state.transmissionRenderTarget[A.id]),vr.upload(B,sh(qe),kn,ge)),pe.isShaderMaterial&&pe.uniformsNeedUpdate===!0&&(vr.upload(B,sh(qe),kn,ge),pe.uniformsNeedUpdate=!1),pe.isSpriteMaterial&&Ct.setValue(B,"center",Q.center),Ct.setValue(B,"modelViewMatrix",Q.modelViewMatrix),Ct.setValue(B,"normalMatrix",Q.normalMatrix),Ct.setValue(B,"modelMatrix",Q.matrixWorld),pe.isShaderMaterial||pe.isRawShaderMaterial){let un=pe.uniformsGroups;for(let xn=0,mc=un.length;xn<mc;xn++){let es=un[xn];se.update(es,wn),se.bind(es,wn)}}return wn}function bp(A,j){A.ambientLightColor.needsUpdate=j,A.lightProbe.needsUpdate=j,A.directionalLights.needsUpdate=j,A.directionalLightShadows.needsUpdate=j,A.pointLights.needsUpdate=j,A.pointLightShadows.needsUpdate=j,A.spotLights.needsUpdate=j,A.spotLightShadows.needsUpdate=j,A.rectAreaLights.needsUpdate=j,A.hemisphereLights.needsUpdate=j}function Sp(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(A,j,de){let pe=ce.get(A);pe.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,pe.__autoAllocateDepthBuffer===!1&&(pe.__useRenderToTexture=!1),ce.get(A.texture).__webglTexture=j,ce.get(A.depthTexture).__webglTexture=pe.__autoAllocateDepthBuffer?void 0:de,pe.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,j){let de=ce.get(A);de.__webglFramebuffer=j,de.__useDefaultFramebuffer=j===void 0};let Ep=B.createFramebuffer();this.setRenderTarget=function(A,j=0,de=0){U=A,E=j,C=de;let pe=!0,Q=null,De=!1,Fe=!1;if(A){let He=ce.get(A);if(He.__useDefaultFramebuffer!==void 0)ne.bindFramebuffer(B.FRAMEBUFFER,null),pe=!1;else if(He.__webglFramebuffer===void 0)ge.setupRenderTarget(A);else if(He.__hasExternalTextures)ge.rebindTextures(A,ce.get(A.texture).__webglTexture,ce.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Xe=A.depthTexture;if(He.__boundDepthTexture!==Xe){if(Xe!==null&&ce.has(Xe)&&(A.width!==Xe.image.width||A.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ge.setupDepthRenderbuffer(A)}}let $e=A.texture;($e.isData3DTexture||$e.isDataArrayTexture||$e.isCompressedArrayTexture)&&(Fe=!0);let Je=ce.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Je[j])?Q=Je[j][de]:Q=Je[j],De=!0):A.samples>0&&ge.useMultisampledRTT(A)===!1?Q=ce.get(A).__webglMultisampledFramebuffer:Array.isArray(Je)?Q=Je[de]:Q=Je,D.copy(A.viewport),H.copy(A.scissor),G=A.scissorTest}else D.copy(Ee).multiplyScalar(ee).floor(),H.copy(Ie).multiplyScalar(ee).floor(),G=V;if(de!==0&&(Q=Ep),ne.bindFramebuffer(B.FRAMEBUFFER,Q)&&pe&&ne.drawBuffers(A,Q),ne.viewport(D),ne.scissor(H),ne.setScissorTest(G),De){let He=ce.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+j,He.__webglTexture,de)}else if(Fe){let He=j;for(let $e=0;$e<A.textures.length;$e++){let Je=ce.get(A.textures[$e]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+$e,Je.__webglTexture,de,He)}}else if(A!==null&&de!==0){let He=ce.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,He.__webglTexture,de)}M=-1},this.readRenderTargetPixels=function(A,j,de,pe,Q,De,Fe,Ge=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let He=ce.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Fe!==void 0&&(He=He[Fe]),He){ne.bindFramebuffer(B.FRAMEBUFFER,He);try{let $e=A.textures[Ge],Je=$e.format,Xe=$e.type;if(!k.textureFormatReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!k.textureTypeReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=A.width-pe&&de>=0&&de<=A.height-Q&&(A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Ge),B.readPixels(j,de,pe,Q,Se.convert(Je),Se.convert(Xe),De))}finally{let $e=U!==null?ce.get(U).__webglFramebuffer:null;ne.bindFramebuffer(B.FRAMEBUFFER,$e)}}},this.readRenderTargetPixelsAsync=async function(A,j,de,pe,Q,De,Fe,Ge=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let He=ce.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Fe!==void 0&&(He=He[Fe]),He)if(j>=0&&j<=A.width-pe&&de>=0&&de<=A.height-Q){ne.bindFramebuffer(B.FRAMEBUFFER,He);let $e=A.textures[Ge],Je=$e.format,Xe=$e.type;if(!k.textureFormatReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!k.textureTypeReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ct=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,ct),B.bufferData(B.PIXEL_PACK_BUFFER,De.byteLength,B.STREAM_READ),A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Ge),B.readPixels(j,de,pe,Q,Se.convert(Je),Se.convert(Xe),0);let vt=U!==null?ce.get(U).__webglFramebuffer:null;ne.bindFramebuffer(B.FRAMEBUFFER,vt);let Ut=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await kd(B,Ut,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,ct),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,De),B.deleteBuffer(ct),B.deleteSync(Ut),De}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,j=null,de=0){let pe=Math.pow(2,-de),Q=Math.floor(A.image.width*pe),De=Math.floor(A.image.height*pe),Fe=j!==null?j.x:0,Ge=j!==null?j.y:0;ge.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,de,0,0,Fe,Ge,Q,De),ne.unbindTexture()};let wp=B.createFramebuffer(),Tp=B.createFramebuffer();this.copyTextureToTexture=function(A,j,de=null,pe=null,Q=0,De=null){De===null&&(Q!==0?(er("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),De=Q,Q=0):De=0);let Fe,Ge,He,$e,Je,Xe,ct,vt,Ut,Et=A.isCompressedTexture?A.mipmaps[De]:A.image;if(de!==null)Fe=de.max.x-de.min.x,Ge=de.max.y-de.min.y,He=de.isBox3?de.max.z-de.min.z:1,$e=de.min.x,Je=de.min.y,Xe=de.isBox3?de.min.z:0;else{let Hn=Math.pow(2,-Q);Fe=Math.floor(Et.width*Hn),Ge=Math.floor(Et.height*Hn),A.isDataArrayTexture?He=Et.depth:A.isData3DTexture?He=Math.floor(Et.depth*Hn):He=1,$e=0,Je=0,Xe=0}pe!==null?(ct=pe.x,vt=pe.y,Ut=pe.z):(ct=0,vt=0,Ut=0);let Mt=Se.convert(j.format),qe=Se.convert(j.type),Rt;j.isData3DTexture?(ge.setTexture3D(j,0),Rt=B.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(ge.setTexture2DArray(j,0),Rt=B.TEXTURE_2D_ARRAY):(ge.setTexture2D(j,0),Rt=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,j.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,j.unpackAlignment);let ht=B.getParameter(B.UNPACK_ROW_LENGTH),wn=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Is=B.getParameter(B.UNPACK_SKIP_PIXELS),Tn=B.getParameter(B.UNPACK_SKIP_ROWS),Lr=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Et.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Et.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,$e),B.pixelStorei(B.UNPACK_SKIP_ROWS,Je),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Xe);let Ct=A.isDataArrayTexture||A.isData3DTexture,kn=j.isDataArrayTexture||j.isData3DTexture;if(A.isDepthTexture){let Hn=ce.get(A),un=ce.get(j),xn=ce.get(Hn.__renderTarget),mc=ce.get(un.__renderTarget);ne.bindFramebuffer(B.READ_FRAMEBUFFER,xn.__webglFramebuffer),ne.bindFramebuffer(B.DRAW_FRAMEBUFFER,mc.__webglFramebuffer);for(let es=0;es<He;es++)Ct&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ce.get(A).__webglTexture,Q,Xe+es),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ce.get(j).__webglTexture,De,Ut+es)),B.blitFramebuffer($e,Je,Fe,Ge,ct,vt,Fe,Ge,B.DEPTH_BUFFER_BIT,B.NEAREST);ne.bindFramebuffer(B.READ_FRAMEBUFFER,null),ne.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(Q!==0||A.isRenderTargetTexture||ce.has(A)){let Hn=ce.get(A),un=ce.get(j);ne.bindFramebuffer(B.READ_FRAMEBUFFER,wp),ne.bindFramebuffer(B.DRAW_FRAMEBUFFER,Tp);for(let xn=0;xn<He;xn++)Ct?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Hn.__webglTexture,Q,Xe+xn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Hn.__webglTexture,Q),kn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,un.__webglTexture,De,Ut+xn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,un.__webglTexture,De),Q!==0?B.blitFramebuffer($e,Je,Fe,Ge,ct,vt,Fe,Ge,B.COLOR_BUFFER_BIT,B.NEAREST):kn?B.copyTexSubImage3D(Rt,De,ct,vt,Ut+xn,$e,Je,Fe,Ge):B.copyTexSubImage2D(Rt,De,ct,vt,$e,Je,Fe,Ge);ne.bindFramebuffer(B.READ_FRAMEBUFFER,null),ne.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else kn?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(Rt,De,ct,vt,Ut,Fe,Ge,He,Mt,qe,Et.data):j.isCompressedArrayTexture?B.compressedTexSubImage3D(Rt,De,ct,vt,Ut,Fe,Ge,He,Mt,Et.data):B.texSubImage3D(Rt,De,ct,vt,Ut,Fe,Ge,He,Mt,qe,Et):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,De,ct,vt,Fe,Ge,Mt,qe,Et.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,De,ct,vt,Et.width,Et.height,Mt,Et.data):B.texSubImage2D(B.TEXTURE_2D,De,ct,vt,Fe,Ge,Mt,qe,Et);B.pixelStorei(B.UNPACK_ROW_LENGTH,ht),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,wn),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Is),B.pixelStorei(B.UNPACK_SKIP_ROWS,Tn),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Lr),De===0&&j.generateMipmaps&&B.generateMipmap(Rt),ne.unbindTexture()},this.initRenderTarget=function(A){ce.get(A).__webglFramebuffer===void 0&&ge.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?ge.setTextureCube(A,0):A.isData3DTexture?ge.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?ge.setTexture2DArray(A,0):ge.setTexture2D(A,0),ne.unbindTexture()},this.resetState=function(){E=0,C=0,U=null,ne.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ut._getDrawingBufferColorSpace(e),t.unpackColorSpace=ut._getUnpackColorSpace()}};var $u=["raw","wet","dry","pressed","formed","installed"],Sr=["lining_lower","lining_upper"],Px=i=>JSON.parse(JSON.stringify(i)),Sf=i=>i.map(e=>({id:e,status:"raw",readyAt:0})),Rf=()=>Object.fromEntries(Sr.map(i=>[i,{soaked:[],glued:[],installed:[],trimmed:[]}]));function Cf(i){i.lining??=Rf();for(let e of Sr){let t=i.lining[e]??(i.lining[e]={glued:[],installed:[]});t.soaked??=[...t.glued],t.trimmed??=e==="lining_lower"?[...t.installed]:[]}}function br(){return{version:3,processRevision:3,dyeWaste:0,stage:0,counts:Object.fromEntries(It.map(i=>[i.id,0])),papers:Sf(ns),leaves:Sf(Ls),lining:Rf(),complete:!1,lit:!1,actions:0,frameItems:{placedRings:[],usedStrips:[],madeRings:[],collectedStrips:[16,17,18],shortStrips:[],shortBinding:0}}}function Un(i){return Px(i)}function lt(i){return It[Math.min(Math.max(0,i.stage||0),It.length-1)]}function vs(i){return i.frameItems?.madeRings??[]}function nc(i){i.stage++,i.stage>=It.length&&(i.stage=It.length-1,i.complete=!0,i.lit=!0)}function Uo(i,e,t,n,s=0){let r=i.filter(o=>o.status===e).slice(0,n);return r.length!==n?!1:(r.forEach(o=>{o.status=t,t==="wet"&&(o.readyAt=s+dt.dryDuration)}),!0)}function ic(i,e=Date.now()){let t=!1;for(let n of i.papers)n.status==="wet"&&e>=n.readyAt&&(n.status="dry",t=!0);return!i.complete&&lt(i).id==="paper_drying"&&i.papers.every(n=>n.status==="dry")&&(i.counts.paper_drying=1,nc(i),t=!0),t}function Ef(i,e,t=Date.now(),n=null){if(ic(i,t),i.complete)return{ok:!1,message:"\u8FD9\u76CF\u706F\u5DF2\u5B8C\u6210\u3002"};let s=lt(i),r=i.counts;if(s.id==="paper_drying")return{ok:!1,message:"\u82B1\u74E3\u7EB8\u4ECD\u5728\u9634\u5E72\uFF0C\u8BF7\u7B49\u5F85\u5B8C\u5168\u5E72\u900F\u3002"};if(e!==s.tool)return{ok:!1,message:"\u8BF7\u4F7F\u7528\u5F53\u524D\u5DE5\u5E8F\u6307\u5B9A\u7684\u5DE5\u5177\u3002"};if(Sr.includes(s.id)){let o=n?.panel,a=i.lining[s.id];return!Number.isInteger(o)||o<0||o>=s.total||!a.soaked.includes(o)?{ok:!1,message:"\u8BF7\u5148\u8638\u6D46\uFF0C\u518D\u5237\u80F6\u3002"}:a.glued.includes(o)?a.installed.includes(o)?{ok:!1,message:"\u8FD9\u7247\u6750\u6599\u5DF2\u7ECF\u8D34\u597D\u3002"}:(a.installed.push(o),i.actions++,s.id==="lining_lower"?{ok:!0,stage:s.id,message:"\u767D\u5E03\u5DF2\u8D34\u5408\uFF0C\u8BF7\u88C1\u53BB\u8FB9\u7F18\u591A\u4F59\u90E8\u5206\u3002",needsTrim:!0}:(r[s.id]++,r[s.id]>=s.total&&nc(i),{ok:!0,stage:s.id,message:r[s.id]>=s.total?"\u7EA2\u8272\u5185\u886C\u5B8C\u6210\u3002":"\u7EA2\u8272\u5185\u886C\u5DF2\u8D34\u597D "+r[s.id]+" / "+s.total})):{ok:!1,message:"\u8BF7\u5148\u5728\u8BE5\u4F4D\u7F6E\u5237\u80F6\u3002"}}if(s.id==="bamboo_prep"){let o=n?.ringType??r.bamboo_prep;if(![0,1].includes(o)||i.frameItems.madeRings.includes(o))return{ok:!1,message:"\u8BF7\u5206\u522B\u5B8C\u6210\u4E00\u53EA\u5927\u5708\u548C\u4E00\u53EA\u5C0F\u5708\u3002"};i.frameItems.madeRings.push(o)}return s.id==="frame_assembly"&&!i.frameItems.placedRings.includes(0)?{ok:!1,message:"\u5148\u628A\u5927\u5708\u56FA\u5B9A\u5728\u5F27\u5F62\u957F\u6761\u9760\u4E0A\u7684\u4F4D\u7F6E\u3002"}:s.id==="frame_short_binding"&&!i.frameItems.placedRings.includes(1)?{ok:!1,message:"\u5148\u628A\u5C0F\u5708\u56FA\u5B9A\u5728\u4E09\u6839\u5F27\u5F62\u957F\u6761\u9876\u7AEF\u3002"}:s.id==="paper_dye"&&!Uo(i.papers,"raw","wet",dt.petals.perLayer,t)?{ok:!1,message:"\u6CA1\u6709\u53EF\u67D3\u7684\u82B1\u74E3\u7EB8\u3002"}:s.id==="petal_pressing"&&!Uo(i.papers,"dry","pressed",dt.petals.perLayer)?{ok:!1,message:"\u82B1\u74E3\u7EB8\u5FC5\u987B\u5B8C\u5168\u9634\u5E72\u540E\u624D\u80FD\u538B\u6A21\u3002"}:s.id==="petal_shaping"&&!Uo(i.papers,"pressed","formed",dt.petals.perLayer)?{ok:!1,message:"\u8BF7\u5148\u5B8C\u6210\u82B1\u74E3\u7EB8\u538B\u6A21\u3002"}:s.id==="petal_assembly"&&!Uo(i.papers,"formed","installed",1)?{ok:!1,message:"\u8BF7\u5148\u6298\u624E\u597D\u4E0B\u4E00\u7247\u7C89\u8272\u82B1\u74E3\u3002"}:s.id==="calyx_assembly"&&!Uo(i.leaves,"raw","installed",1)?{ok:!1,message:"\u6210\u54C1\u7EFF\u8272\u53F6\u7247\u4E0D\u8DB3\u3002"}:(r[s.id]++,i.actions++,r[s.id]>=s.total&&nc(i),{ok:!0,stage:s.id,message:r[s.id]>=s.total?"\u672C\u5DE5\u5E8F\u5B8C\u6210\u3002":"\u5DF2\u5B8C\u6210 "+r[s.id]+" / "+s.total})}function wf(i,e,t){if(!Sr.includes(e)||lt(i).id!==e||!Number.isInteger(t)||t<0||t>=lt(i).total)return!1;let n=i.lining[e];return n.installed.includes(t)||n.glued.includes(t)?!1:(n.glued.push(t),i.actions++,!0)}function Tf(i,e,t){if(!Sr.includes(e)||lt(i).id!==e||!Number.isInteger(t)||t<0||t>=lt(i).total)return!1;let n=i.lining[e];return n.installed.includes(t)||n.soaked.includes(t)?!1:(n.soaked.push(t),i.actions++,!0)}function Af(i,e,t){if(e!=="lining_lower"||lt(i).id!==e||!Number.isInteger(t)||t<0||t>=lt(i).total)return!1;let n=i.lining[e];return!n.installed.includes(t)||n.trimmed.includes(t)?!1:(n.trimmed.push(t),i.counts[e]++,i.actions++,i.counts[e]>=lt(i).total&&nc(i),!0)}function Yu(i,e){let t=lt(i);return!i.frameItems||!vs(i).includes(e)||i.frameItems.placedRings.includes(e)||!(t.id==="frame_assembly"&&e===0||t.id==="frame_short_binding"&&e===1)?!1:(i.frameItems.placedRings.push(e),i.actions++,!0)}function Lx(i,e){return!Number.isInteger(e)||e<16||e>18||i.frameItems.collectedStrips.includes(e)?!1:(i.frameItems.collectedStrips.push(e),i.actions++,!0)}function Dx(i){return lt(i).id==="bamboo_prep"&&i.counts.bamboo_prep===2}function Zu(i,e="papers"){return Object.fromEntries($u.map(t=>[t,i[e].filter(n=>n.status===t).length]))}function If(i){return{petal:i.papers.filter(e=>["wet","dry","pressed","formed"].includes(e.status)).length,leaf:0}}function Pf(i){return{bigRing:vs(i).includes(0)?1:0,smallRing:vs(i).includes(1)?1:0,arcStrip:Math.max(0,3-i.counts.frame_assembly),flowerHead:Math.max(0,dt.flowerCount-i.counts.top_flower_assembly),candle:Math.max(0,1-i.counts.candle_installation)}}function Lf(i){return Math.round(It.reduce((e,t)=>e+i.counts[t.id]/t.total,0)/It.length*100)}function Df(i){return!(!i||i.version!==3||!Number.isInteger(i.stage)||i.stage<0||i.stage>=It.length||!i.counts||!Array.isArray(i.papers)||i.papers.length!==ns.length||!Array.isArray(i.leaves)||i.leaves.length!==Ls.length||!It.every(e=>Number.isInteger(i.counts[e.id])&&i.counts[e.id]>=0&&i.counts[e.id]<=e.total)||!i.papers.every((e,t)=>e&&e.id===ns[t]&&$u.includes(e.status))||!i.leaves.every((e,t)=>e&&e.id===Ls[t]&&$u.includes(e.status)))}function Uf(){return null}function Nf(i){if(!Df(i))return br();let e=Un(i);return Cf(e),e}function Ff(){let i=new No;for(;!i.state.complete;)i.skipStage(Date.now()+dt.dryDuration);return i.state.lit=!1,i.state}var No=class i{constructor(e=br()){this.state=Df(e)?Un(e):br(),Cf(this.state),this.history=[],this.future=[]}act(e,t=Date.now(),n=null){let s=Un(this.state),r=Ef(this.state,e,t,n);return r.ok&&(this.history.push(s),this.future=[]),r}glue(e,t){let n=Un(this.state);return wf(this.state,e,t)?(this.history.push(n),this.future=[],!0):!1}soak(e,t){let n=Un(this.state);return Tf(this.state,e,t)?(this.history.push(n),this.future=[],!0):!1}trim(e,t){let n=Un(this.state);return Af(this.state,e,t)?(this.history.push(n),this.future=[],!0):!1}installRing(e){let t=Un(this.state);return Yu(this.state,e)?(this.history.push(t),this.future=[],!0):!1}collectStrip(e){let t=Un(this.state);return Lx(this.state,e)?(this.history.push(t),this.future=[],!0):!1}finishPreparation(){return Dx(this.state)}discardDye(){return!1}skipStage(e=Date.now()){if(this.state.complete)return{ok:!1,message:"\u8FD9\u76CF\u706F\u5DF2\u7ECF\u5B8C\u6210\u3002"};let t=Un(this.state),n=lt(this.state);if(n.id==="paper_drying")this.state.papers.forEach(s=>{s.status==="wet"&&(s.status="dry",s.readyAt=e)}),ic(this.state,e);else{n.id==="frame_assembly"&&Yu(this.state,0),n.id==="frame_short_binding"&&Yu(this.state,1);let s=0;for(;!this.state.complete&&lt(this.state).id===n.id&&s++<=n.total;){let r=null;if(Sr.includes(n.id)){let a=Array.from({length:n.total},(c,l)=>l).find(c=>!this.state.lining[n.id].installed.includes(c));Tf(this.state,n.id,a),wf(this.state,n.id,a),r={panel:a}}n.id==="bamboo_prep"&&(r={ringType:this.state.counts.bamboo_prep});let o=Ef(this.state,n.tool,e,r);if(!o.ok)return this.state=t,o;n.id==="lining_lower"&&Af(this.state,n.id,r.panel)}}return this.history.push(t),this.future=[],{ok:!0,stage:n.id,message:"\u5DF2\u8DF3\u8FC7\uFF1A"+n.name}}previousStage(){if(this.state.stage===0)return{ok:!1,message:"\u5DF2\u7ECF\u662F\u7B2C\u4E00\u9053\u5DE5\u5E8F\u3002"};let e=Un(this.state),t=this.state.complete?It.length-1:this.state.stage-1,n=new i;for(;n.state.stage<t&&!n.state.complete;)n.skipStage();return this.state=n.state,this.history.push(e),this.future=[],{ok:!0,stage:lt(this.state).id,message:"\u5DF2\u8FD4\u56DE\u4E0A\u4E00\u9053\u5DE5\u5E8F\u3002"}}undo(){return this.history.length?(this.future.push(Un(this.state)),this.state=this.history.pop(),!0):!1}redo(){return this.future.length?(this.history.push(Un(this.state)),this.state=this.future.pop(),!0):!1}resetStage(){let e=this.state.stage,t=this.history.findIndex(n=>n.stage===e);return t<0?!1:(this.future=[],this.state=Un(this.history[t]),this.history=this.history.slice(0,t),!0)}reset(){this.state=br(),this.history=[],this.future=[]}};var Er=Math.PI*2,ri=(i=0,e=0,t=0)=>new O(i,e,t);function Ux(i,e,t,n=28,s=!1){return new Ue(new bo(new ur(i,s,"centripetal"),n,e,5,s),t)}function Ms(i,e,t,n){let s=e.clone().sub(i),r=new Ue(new gt(t,t,s.length(),8),n);return r.position.copy(i).add(e).multiplyScalar(.5),r.quaternion.setFromUnitVectors(ri(0,1,0),s.normalize()),r}function Yi({length:i=.5,width:e=.34,bulge:t=.11,leaf:n=!1}={}){let s=[],r=[],o=[],l=new Ye(n?"#3c643e":dt.colors.petalBase),u=new Ye(n?"#6b9654":dt.colors.petalMid),f=new Ye(n?dt.colors.calyx:dt.colors.petalTip);for(let p=0;p<=18;p++)for(let g=0;g<=22;g++){let y=p/18,m=g/22*2-1,h=Math.pow(Math.sin(Math.PI*y),.72);s.push(m*e*.5*h,y*i,t*Math.sin(Math.PI*y)*(1-m*m*.56)+.02*m*m);let _=l.clone().lerp(u,Math.sin(Math.PI*y)*.68).lerp(f,Math.pow(y,4)*.6);if(r.push(_.r,_.g,_.b),p<18&&g<22){let x=p*23+g,v=x+22+1;o.push(x,v,x+1,x+1,v,v+1)}}let d=new st;return d.setAttribute("position",new it(s,3)),d.setAttribute("color",new it(r,3)),d.setIndex(o),d.computeVertexNormals(),d}function Of(){let i=new We;i.name="LotusLanternRoot";let e=new Map,t=new Map,n=new Map,s={};for(let V of["BambooFrame","InnerSupport","PetalLayers","BottomCalyx","TopFlowerAssemblies","HangingAssembly","DebugMarkers"])s[V]=new We,s[V].name=V,i.add(s[V]);let r=new ke({color:dt.colors.bamboo,roughness:.84}),o=new ke({color:dt.colors.binding,roughness:1}),a=new ke({color:"#8a694b",roughness:.7,metalness:.25}),c=new ke({vertexColors:!0,side:pt,roughness:.9,emissive:"#62243c",emissiveIntensity:0}),l=new ke({vertexColors:!0,side:pt,roughness:.94}),u=new Ft({color:"#f4c977",transparent:!0,opacity:.28,wireframe:!0,depthWrite:!1});function f(V,ue,Re,Z,re,_e={}){return V.name=ue,V.userData={partId:ue,partType:Re,workflowStage:Z,targetSocketId:"socket-"+ue,..._e},re.add(V),V.traverse(xe=>{xe.isMesh&&(xe.castShadow=!0,xe.receiveShadow=!0)}),e.set(ue,V),t.set(V.userData.targetSocketId,{partId:ue,position:V.position.clone(),connections:_e.connections||[]}),V}let d=dt.frame,p=[];[["big-ring",d.bigRingRadius,d.bigRingHeight],["mouth-ring",d.mouthRingRadius,d.mouthRingHeight]].forEach(([V,ue,Re],Z)=>{let re=new Ue(new Lt(ue,.012,6,64),r);re.rotation.x=Math.PI/2,re.position.y=Re,f(re,V,"ring",Z===0?"bamboo_prep":"frame_short_binding",s.BambooFrame,{order:Z,radius:ue,height:Re});let _e=new Ue(new Lt(.025,.005,5,12),o);_e.position.set(0,-ue,0),_e.rotation.x=Math.PI/2,re.add(_e),p.push(re)});let g=[],y=[];for(let V=0;V<3;V++){let ue=V/3*Er,Re=[ri(Math.sin(ue)*.15,.04,Math.cos(ue)*.15),ri(Math.sin(ue)*d.bigRingRadius,d.bigRingHeight,Math.cos(ue)*d.bigRingRadius),ri(Math.sin(ue)*d.mouthRingRadius,d.mouthRingHeight,Math.cos(ue)*d.mouthRingRadius)],Z=f(Ux(Re,.01,r),`rib-${V+1}`,"arc-rib","frame_assembly",s.BambooFrame,{order:V,connections:["big-ring","mouth-ring"]});g.push(Z);for(let[re,_e]of[[0,Re[1]],[1,Re[2]]]){let xe=new Ue(new Lt(.027,.006,5,14),o);xe.position.copy(_e),xe.rotation.x=Math.PI/2,f(xe,`arc-binding-${V+1}-${re+1}`,"binding","frame_assembly",s.BambooFrame,{order:V,connections:[`rib-${V+1}`]}),y.push(xe)}}let m=[];for(let V=0;V<5;V++){let ue=V<3?V/3*Er+.3:(V-3)/2*Math.PI+.2,Re=V<3?ri(Math.sin(ue)*.17,1.34,Math.cos(ue)*.17):ri(Math.sin(ue)*.32,.93,Math.cos(ue)*.32),Z=ri(Math.sin(ue)*.16,.48,Math.cos(ue)*.16),re=new We;re.add(Ms(Z,Re,.008,a)),f(re,`flower-support-${V+1}`,"flower-support","frame_short_binding",s.InnerSupport,{order:V}),m.push(re)}let h={lining_lower:[],lining_upper:[]};for(let[V,ue,Re]of[["lining_lower","#f3eee0",.55],["lining_upper",dt.colors.innerLining,.58]])for(let Z=0;Z<6;Z++){let re=Z/6*Er,_e=new Ue(new gt(.56,.25,.52,3,1,!0),new ke({color:ue,transparent:!0,opacity:V==="lining_lower"?.75:.85,side:pt,roughness:.92}));_e.rotation.y=re,_e.position.y=Re,f(_e,`${V}-${Z+1}`,"lining",V,s.InnerSupport,{order:Z}),h[V].push(_e)}let _=[];for(let V=0;V<dt.petals.layers;V++)for(let ue=0;ue<dt.petals.perLayer;ue++){let Re=V*dt.petals.perLayer+ue,Z=ue/dt.petals.perLayer*Er+(V%2?.31:0),re=.34+V*.075,_e=new Ue(Yi({length:.44,width:.34,bulge:.1}),c.clone());_e.position.set(Math.sin(Z)*re,.76-V*.16,Math.cos(Z)*re),_e.rotation.set(Math.PI*.16,Z,0),f(_e,ns[Re],"petal","petal_assembly",s.PetalLayers,{order:Re,layer:V,paperId:ns[Re],connections:["lining_upper-"+(ue%6+1)]}),_.push(_e)}let x=[];for(let V=0;V<2;V++)for(let ue=0;ue<6;ue++){let Re=V*6+ue,Z=ue/6*Er+(V?.28:0),re=new Ue(Yi({length:.46,width:.4,bulge:.07,leaf:!0}),l);re.position.set(Math.sin(Z)*(.48+V*.06),.18-V*.1,Math.cos(Z)*(.48+V*.06)),re.rotation.set(V?Math.PI*.72:Math.PI*.34,Z,0),f(re,`finished-leaf-${Re+1}`,"leaf","calyx_assembly",s.BottomCalyx,{order:Re,layer:V,connections:["big-ring"]}),x.push(re)}let v=[];for(let V=0;V<dt.flowerCount;V++){let ue=V<3,Re=ue?V/3*Er+.3:(V-3)/2*Math.PI+.25,Z=new We,re=ue?ri(Math.sin(Re)*.2,1.38,Math.cos(Re)*.2):ri(Math.sin(Re)*.34,.98,Math.cos(Re)*.34);Z.add(Ms(ri(Math.sin(Re)*.12,.57,Math.cos(Re)*.12),re,.012,new ke({color:"#497347",roughness:.85})));let _e=new Ue(new In(ue?.1:.115,14,10),new ke({color:"#e9a0bb",roughness:.84}));_e.scale.set(1,.72,1),_e.position.copy(re),Z.add(_e),f(Z,`finished-flower-head-${V+1}`,"flower","top_flower_assembly",s.TopFlowerAssemblies,{order:V,tier:ue?"upper":"lower",connections:[`flower-support-${V+1}`]}),v.push(Z)}let T=new We,E=new Ue(new gt(.065,.072,.28,16),new ke({color:"#fff1d0",roughness:.75,emissive:"#6e3a16",emissiveIntensity:0}));E.position.y=.53,T.add(E);let C=new Ue(new gt(.008,.008,.055,6),new ke({color:"#37271c"}));C.position.y=.7,T.add(C);let U=new Ue(new In(.035,10,8),new ke({color:"#ffd484",emissive:"#ff8d2d",emissiveIntensity:0}));U.position.y=.75,U.scale.y=1.6,T.add(U),f(T,"candle","candle","candle_installation",s.InnerSupport);let M=new wo("#ffb76c",0,3,2);M.position.y=.78,i.add(M);let S=null,D=!1,H=!1,G=-1,F=null,W=new Set;e.forEach(V=>n.set(V,{position:V.position.clone(),quaternion:V.quaternion.clone(),scale:V.scale.clone()}));function K(V){F=V;let ue=V.counts,Re=V.frameItems||{placedRings:[]};p.forEach((xe,Te)=>xe.visible=Re.placedRings.includes(Te)),g.forEach((xe,Te)=>xe.visible=Te<ue.frame_assembly),y.forEach(xe=>xe.visible=xe.userData.order<ue.frame_assembly),m.forEach(xe=>xe.visible=ue.frame_short_binding>=2);for(let[xe,Te]of Object.entries(h))Te.forEach((ze,Ze)=>ze.visible=V.lining?.[xe]?.installed.includes(Ze)&&!H);_.forEach((xe,Te)=>{xe.visible=V.papers[Te]?.status==="installed"&&!H&&xe.userData.layer!==G,xe.material.emissiveIntensity=V.lit?.16:0}),x.forEach((xe,Te)=>xe.visible=Te<ue.calyx_assembly&&!H),v.forEach((xe,Te)=>xe.visible=Te<ue.top_flower_assembly&&!H),T.visible=ue.candle_installation===1,M.intensity=V.lit?1.25:0,E.material.emissiveIntensity=V.lit?1.1:0,U.material.emissiveIntensity=V.lit?2.8:0,e.forEach(xe=>{(W.has(xe.name)||W.has(xe.userData.partType))&&(xe.visible=!1)}),S&&(s.DebugMarkers.remove(S),S=null);let Z=It[V.stage]?.id,_e={bamboo_prep:p,frame_assembly:g,frame_short_binding:m,lining_lower:h.lining_lower,lining_upper:h.lining_upper,petal_assembly:_,calyx_assembly:x,top_flower_assembly:v,candle_installation:[T]}[Z]?.[ue[Z]];_e&&!V.complete&&(S=_e.clone(!0),S.position.copy(n.get(_e).position),S.visible=!0,S.traverse(xe=>{xe.isMesh&&(xe.material=u)}),s.DebugMarkers.add(S)),he(D)}function he(V){D=V,e.forEach(ue=>{let Re=n.get(ue);if(ue.position.copy(Re.position),ue.quaternion.copy(Re.quaternion),ue.scale.copy(Re.scale),V&&["petal","leaf"].includes(ue.userData.partType)){let Z=ri(ue.position.x,0,ue.position.z).normalize();ue.position.addScaledVector(Z,.22+(ue.userData.layer||0)*.1),ue.position.y+=(ue.userData.layer||0)*.09}})}function ee(V){H=V,F&&K(F)}function be(V){G=V,F&&K(F)}function te(V,ue){ue?W.delete(V):W.add(V),F&&K(F)}function Ee(){H=!1,G=-1,W.clear(),he(!1),F&&K(F)}function Ie(){let V=new Set,ue=new Set;i.traverse(Re=>{Re.geometry&&V.add(Re.geometry),Re.material&&ue.add(Re.material)}),V.forEach(Re=>Re.dispose()),ue.forEach(Re=>Re.dispose()),u.dispose()}return{root:i,registry:e,sockets:t,groups:s,petals:_,sync:K,setExploded:he,setFrame:ee,setLayer:be,setPartVisibility:te,restore:Ee,dispose:Ie,get light(){return M}}}function sc(){let i=new We;i.name="craft-scissors";let e=new ke({color:"#c4ccd0",metalness:.82,roughness:.27}),t=new ke({color:"#eef1ec",metalness:.9,roughness:.19}),n=new ke({color:"#554635",metalness:.58,roughness:.38}),s=new ke({color:"#b29a64",metalness:.7,roughness:.34}),r=[];for(let c of[-1,1]){let l=new We;l.position.z=c*.004,i.add(l),r.push(l);let u=new Ti;u.moveTo(-.012,-.046),u.lineTo(.016,.007),u.lineTo(.008,.17),u.quadraticCurveTo(.002,.19,-.004,.195),u.lineTo(-.012,.025),u.closePath();let f=new Ue(new vo(u,{depth:.005,bevelEnabled:!0,bevelSize:.0015,bevelThickness:.001,bevelSegments:2,steps:1}),e);f.scale.x=c,f.castShadow=!0,l.add(f);let d=new Ue(new bt(.002,.155,.001),t);d.position.set(-.009*c,.095,.007),l.add(d);let p=new Ue(new bt(.014,.075,.009),n);p.position.set(c*.021,-.049,0),p.rotation.z=c*.38,l.add(p);let g=new Ue(new Lt(.036,.006,10,40),n);g.scale.set(1,1.3,1),g.position.set(c*.04,-.118,0),l.add(g)}let o=new Ue(new gt(.015,.015,.021,24),s);o.rotation.x=Math.PI/2,i.add(o);let a=new Ue(new bt(.016,.002,.002),n);return a.position.z=.012,i.add(a),i.userData.setOpening=c=>{r.forEach((l,u)=>l.rotation.z=(u?1:-1)*(.04+c*.28))},i.userData.setOpening(.65),i}var Oo=Object.freeze([.94,.42]),bs=.012,Bo=.004,ko=Object.freeze([.18,.82]),Nx=.965,rc=1.025,Fo=class{constructor(){this.reset()}reset(){this.selected=!1,this.strip=-1,this.curve=0,this.direction=0,this.wrapping=0,this.binding=!1,this.finished=!1}select(e){return this.selected||!Number.isInteger(e)||e<0||e>=16?!1:(this.selected=!0,this.strip=e,!0)}hold(e){this.selected&&!this.binding&&(this.direction=Math.sign(e))}release(){this.direction=0}get ready(){return this.selected&&!this.binding&&this.curve>=Nx&&this.curve<=rc}get issue(){return this.curve>rc?"\u5F62\u72B6\u4E0D\u5408\u9002\uFF0C\u8BF7\u6309\u4F4F\u53F3\u952E\u677E\u5F00\u7AF9\u6761\uFF0C\u51CF\u5C0F\u5F2F\u66F2\u5EA6\u3002":this.ready?"\u4E24\u7AEF\u5DF2\u5408\u62E2\uFF0C\u53EF\u4EE5\u786E\u8BA4\u56FA\u5B9A\u3002":"\u6309\u4F4F\u5DE6\u952E\u5411\u5185\u5F2F\u66F2\uFF1B\u6309\u4F4F\u53F3\u952E\u653E\u677E\u56DE\u5F39\u3002"}confirm(){return!this.ready||this.direction?!1:(this.binding=!0,!0)}tick(e){e=Math.min(.05,Math.max(0,e)),this.binding?(this.wrapping=Math.min(1,this.wrapping+e/1.4),this.finished=this.wrapping===1):this.selected&&(this.curve=Math.max(0,Math.min(1.2,this.curve+this.direction*e*.5)))}evidence(){return{mode:"bend",quality:Math.max(0,1-Math.abs(this.curve-1)*8),curve:this.curve,oval:0,dose:0,angle:0,distance:2.3,strip:this.strip}}};var Bf=["paper_dye","petal_pressing"],Ot=(i,e=0,t=1)=>Math.max(e,Math.min(t,i)),Ho=(i,e)=>Math.hypot(i.x-e.x,i.y-e.y);function Ju(i="square"){if(i==="square"){let e=[[-.31,.31],[.31,.31],[.31,-.31],[-.31,-.31],[-.31,.31]],t=[];for(let n=0;n<4;n++)for(let s=0;s<16;s++)t.push({x:e[n][0]+(e[n+1][0]-e[n][0])*s/16,y:e[n][1]+(e[n+1][1]-e[n][1])*s/16});return[...t,{...t[0]}]}return Array.from({length:81},(e,t)=>{let n=t<=40?t/40:(80-t)/40;return{x:(t<=40?1:-1)*.245*Math.sin(Math.PI*n)*(i==="leaf"?.92:1.15-.35*n),y:.32-.64*n}})}var $i=Object.freeze({start:.12,edge:.11,checkpoint:.1,maxStep:.35,sampleStep:.02}),oc=class{constructor(e){this.points=Ju(e),this.reset()}reset(){this.next=0,this.dragging=!1,this.failed=!1,this.ready=!1,this.last=null,this.onTrack=!1}down(e){return this.ready||Ho(e,this.points[Math.min(this.next,this.points.length-1)])>$i.start?!1:(this.dragging=!0,this.last={...e},this.move(e),!0)}move(e){if(!this.dragging)return!1;if(!this.points.some((o,a)=>{let c=this.points[a+1]||o,l=c.x-o.x,u=c.y-o.y,f=Ot(((e.x-o.x)*l+(e.y-o.y)*u)/(l*l+u*u||1));return Ho(e,{x:o.x+f*l,y:o.y+f*u})<=(this.next<=1?$i.start:$i.edge)}))return this.onTrack=!1,this.last=null,!1;let n=this.last,s=n?Ho(e,n):0;if(!n||s>$i.maxStep)return this.last=null,this.advance(e);let r=Math.max(1,Math.ceil(s/$i.sampleStep));for(let o=1;o<=r&&this.dragging;o++){let a={x:n.x+(e.x-n.x)*o/r,y:n.y+(e.y-n.y)*o/r};if(!this.advance(a))return this.last=null,!1}return this.last={...e},this.onTrack}advance(e){let t=this.points[Math.max(0,this.next-1)],n=this.points[this.next];if(!n)return!1;let s=n.x-t.x,r=n.y-t.y,o=s*s+r*r,a=Ot(((e.x-t.x)*s+(e.y-t.y)*r)/(o||1));if(this.onTrack=Ho(e,{x:t.x+a*s,y:t.y+a*r})<=(this.next<=1?$i.start:$i.edge),!this.onTrack)return!1;for(;this.next<this.points.length&&Ho(e,this.points[this.next])<=$i.checkpoint;)this.next++;return this.next>=this.points.length&&(this.ready=!0,this.dragging=!1),this.last={...e},!0}up(){this.dragging=!1,this.onTrack=!1,this.last=null}},Fx=20,ac=class{constructor(){this.reset()}reset(){this.phase="stock",this.dose=0,this.depth=0,this.targetDepth=0,this.maxDepth=0,this.lift=0,this.seconds=0}take(){return this.phase!=="stock"?!1:(this.phase="held",!0)}immerse(e=.8){return!["held","review"].includes(this.phase)||e<=0?!1:(this.targetDepth=Ot(e,0,.92),this.phase="dipping",!0)}release(){}liftOut(){return this.phase!=="dipping"?!1:(this.phase="lifting",this.lift=0,!0)}tick(e){e=Ot(e,0,.05),this.phase==="dipping"&&(this.seconds+=e,this.depth+=Math.sign(this.targetDepth-this.depth)*Math.min(Math.abs(this.targetDepth-this.depth),e*1.2),this.maxDepth=Math.max(this.maxDepth,this.depth),this.dose=Ot(this.simulatedSeconds/120,0,1.8)),this.phase==="lifting"&&(this.lift=Ot(this.lift+e/1.05),this.lift===1&&(this.phase="review"))}get simulatedSeconds(){return this.seconds*Fx}get ready(){return this.phase==="review"&&this.simulatedSeconds>=60&&this.simulatedSeconds<=120}},lc=class{constructor(){this.phase="idle",this.progress=0,this.rotation=0}start(){return this.phase!=="idle"?!1:(this.phase="running",!0)}tick(e){this.phase==="running"&&(e=Ot(e,0,.05),this.progress=Ot(this.progress+e/5.5),this.rotation=this.progress*Math.PI*12,this.progress===1&&(this.phase="done"))}};function zo(i,{leaf:e=!1,dose:t=.8,depth:n=.8}={}){let s=i.attributes.position,r=i.attributes.uv,o=new Float32Array(s.count*3),a=new Ye("#f5efe4"),c=new Ye(e?"#397444":"#ab326d");for(let l=0;l<s.count;l++){let u=r?r.getY(l):(s.getY(l)+.36)/.72,f=Ot((n-u)/.2),d=Ot(t/.9)*f*(.38+.62*Math.pow(1-u,1.15)),p=a.clone().lerp(c,d);o.set([p.r,p.g,p.b],l*3)}i.setAttribute("color",new Nt(o,3))}function Vn(i={},e="square",t=.72){let n;if(e==="square")n=new nn(t,t,28,36);else{let r=Ju(e),o=new Ti(r.map(l=>new Ce(l.x,l.y)));n=new Mo(o,32);let a=n.attributes.position,c=[];for(let l=0;l<a.count;l++)c.push((a.getX(l)+.36)/.72,(a.getY(l)+.36)/.72);n.setAttribute("uv",new it(c,2))}zo(n,i);let s=new Ue(n,new ke({vertexColors:!0,side:pt,roughness:.94}));return s.castShadow=!0,s.receiveShadow=!0,s}function Vo(i,e=!1,t=!1){let n=new We;n.name=t?"square-embossed-veins":"cut-paper-veins",i.add(n);for(let s=-4;s<=4;s++){let r=Array.from({length:28},(a,c)=>{let l=c/27;return new O(t?s*.068+.012*Math.sin(Math.PI*l):s*.032*Math.sin(Math.PI*l),t?-.345+.69*l:-.3+.6*l,.0025)}),o=new bn(new st().setFromPoints(r),new Mn({color:e?"#56724c":"#975a79",transparent:!0,opacity:.58}));n.add(o)}return n}function cc(){let i=new We,e=[],t=new ke({color:"#715237",roughness:.9}),n=new ke({color:"#ada58b",metalness:.5,roughness:.42});function s(c,l,u,f,d,p,g=t){let y=new Ue(new bt(c,l,u),g);return y.position.set(f,d,p),i.add(y),y.castShadow=!0,y}s(.78,.055,.55,0,.028,0);for(let c of[-.34,.34])s(.07,.48,.16,c,.26,0);for(let c of[.22,.4]){let l=new We;l.position.y=c,i.add(l);let u=new Ue(new gt(.09,.09,.62,36),n);u.rotation.z=Math.PI/2,l.add(u);let f=s(.61,.006,.008,0,0,0);i.remove(f),l.add(f),f.position.set(0,.09,0),e.push(l)}let r=Array.from({length:601},(c,l)=>{let u=l/600,f=u*Math.PI*28;return new O(-.29+u*.58,Math.cos(f)*.095,Math.sin(f)*.095)}),o=new bn(new st().setFromPoints(r),new Mn({color:"#e7d3a6"}));i.add(o),o.position.y=.4,o.geometry.setDrawRange(0,0);let a=new bn(new st().setFromPoints([new O(-.3,.4,.095),new O(-.3,.08,.48)]),new Mn({color:"#e7d3a6"}));return i.add(a),i.userData.machine=!0,{root:i,rollers:e,winding:o,supply:a,update(c,l){e[0].rotation.x=l,e[1].rotation.x=-l,o.rotation.x=-l,o.geometry.setDrawRange(0,Math.floor(c*601));let u=a.geometry.attributes.position;u.setXYZ(1,-.3,.4-.32*(1-c),.095+.385*(1-c)),u.needsUpdate=!0,a.visible=c<1}}}var Nn=(i,e,t)=>new O(i,e,t);function kf(i){let e=document.createElement("canvas");e.width=e.height=512;let t=e.getContext("2d");if(i==="wood"){t.fillStyle="#76533b",t.fillRect(0,0,512,512);for(let s=0;s<450;s++){let r=s/450*512;t.strokeStyle=`rgba(${s%2?35:180},${s%2?22:133},${s%2?16:90},${.08+s%7*.018})`,t.lineWidth=.5+s%3,t.beginPath(),t.moveTo(0,r);for(let o=0;o<=512;o+=16)t.lineTo(o,r+Math.sin(o*.02+s*.7)*2.5);t.stroke()}for(let s=0;s<4;s++)t.fillStyle="rgba(20,10,5,.25)",t.fillRect(0,s*128,512,2)}else{t.fillStyle="#d8c7a7",t.fillRect(0,0,512,512);for(let s=0;s<3500;s++){let r=s*137.37%512,o=s*71.93%512;t.fillStyle=s%2?"rgba(100,75,42,.06)":"rgba(255,255,245,.13)",t.fillRect(r,o,1+s%3,1)}}let n=new Vi(e);return n.colorSpace=kt,n.wrapS=n.wrapT=Ks,n}function Hf(i){let e=new We;e.name="WorkshopEnvironment",i.add(e);let t=kf("wood"),n=kf("paper"),s=new ke({map:t,color:"#b18a65",roughness:.86}),r=new ke({map:t,color:"#614735",roughness:.92}),o=new ke({map:n,color:"#e0d4bd",roughness:1}),a=new ke({color:"#a99877",roughness:1}),c=new ke({color:"#624e35",metalness:.25,roughness:.75}),l=new ke({color:"#b6b185",roughness:.92}),u=new ke({color:"#b9c5b8",roughness:.35}),f=new ke({color:"#ba80b7",roughness:.93,side:pt}),d=new ke({color:"#f0e8df",roughness:.97,side:pt}),p=new ke({color:"#567a49",roughness:.95,side:pt}),g=[],y={},m=[];function h(N,k,ne,me,ce,ge,Le,Be=e){let R=new Ue(new bt(N,k,ne),me);return R.position.set(ce,ge,Le),R.castShadow=!0,R.receiveShadow=!0,Be.add(R),R}function _(N,k,ne,me,ce,ge,Le,Be=e){let R=new Ue(new gt(N,k,ne,24),me);return R.position.set(ce,ge,Le),R.castShadow=!0,R.receiveShadow=!0,Be.add(R),R}function x(N,k,ne,me){h(ne,.13,me,s,N,.92,k),h(ne-.12,.18,.1,r,N,.72,k+me/2-.1);for(let ce of[-1,1])for(let ge of[-1,1])h(.12,.86,.12,r,N+ce*(ne/2-.16),.43,k+ge*(me/2-.14));g.push({x:N,z:k,hx:ne/2+.18,hz:me/2+.18})}function v(N,k,ne,me,ce=1.4){let ge=document.createElement("canvas");ge.width=512,ge.height=128;let Le=ge.getContext("2d");Le.fillStyle="#e6d8ba",Le.fillRect(0,0,512,128),Le.strokeStyle="#897657",Le.lineWidth=2,Le.strokeRect(7,7,498,114),Le.fillStyle="#45392c",Le.font='52px "KaiTi", "SimSun", serif',Le.textAlign="center",Le.textBaseline="middle",Le.fillText(N,256,66);let Be=new Vi(ge);Be.colorSpace=kt;let R=new Ue(new nn(ce,ce/4),new Ft({map:Be}));return R.position.set(k,ne,me),e.add(R),R}h(14,.15,12,new ke({color:"#a5a18e",roughness:.97}),0,-.1,0);for(let N=-7;N<7;N++)for(let k=-6;k<6;k++){let ne=new Ye("#b0ac97").multiplyScalar(.94+(N*7+k*3+30)%5*.025);h(.987,.015,.987,new ke({color:ne,roughness:1}),N+.5,-.012,k+.5)}h(14,4.7,.18,o,0,2.3,-5),h(.18,4.7,11,o,-6,2.3,0),h(.18,4.7,11,o,6,2.3,0);for(let N of[-5.5,-2.8,0,2.8,5.5])h(.18,4.5,.2,r,N,2.2,-4.75),h(.17,.22,10,r,N,4.35,0);h(11.5,.24,.24,r,0,3.3,-4.7),h(12,.22,.22,r,0,4.3,2.7);for(let N of[-3.7,3.7]){h(2.15,2.15,.1,new ke({color:"#efe4cb",emissive:"#e6cfa4",emissiveIntensity:.3,roughness:1}),N,2.16,-4.86);for(let k=0;k<7;k++)h(.035,2.2,.12,r,N-1.1+k*.366,2.16,-4.76);for(let k=0;k<5;k++)h(2.2,.035,.12,r,N,1.06+k*.55,-4.75)}v("\u79E6 \u6DEE \u706F \u4F5C",0,3.72,-4.63,2.4),v("\u4E00 \u7BFE \u4E00 \u7EB8 \xB7 \u4E00 \u76CF \u5FC3 \u706F",0,3.15,-4.63,2.2);for(let N of[.6,1.3,2])h(2.1,.08,.5,s,-.05,N,-4.5);for(let N=0;N<8;N++){let k=new Ue(new Lt(.21+N%3*.055,.008,5,40),l);k.position.set(-1.25+N%4*.8,2.4+Math.floor(N/4)*.35,-4.64),e.add(k)}for(let N=0;N<6;N++)_(.12,.1,.28,u,-.9+N*.35,.78,-4.5);x(0,0,3.2,1.95),h(2.48,.013,1.52,a,0,.997,0);let T=_(.82,.85,.055,r,0,1.04,0);x(-3.55,-1.35,2.15,1.5),x(3.55,-1.35,2.15,1.5),x(3.55,1.6,2.15,1.55);function E(N,k,ne,me,ce,ge){let Le=new Ue(new bt(N==="assembly"?3:2.05,1.65,N==="assembly"?1.9:1.45),new Ft({visible:!1}));Le.position.set(ne,1.45,me),Le.userData.station=N,e.add(Le);let Be=v(k,ne,.82,me+.8,N==="assembly"?1.05:.82);y[N]={id:N,name:k,x:ne,z:me,trigger:Le,label:Be,position:Nn(...ce),look:Nn(...ge)}}E("assembly","\u53C1 \xB7 \u5408\u706F\u53F0",0,0,[0,1.82,2.85],[0,1.67,0]),E("bamboo","\u58F9 \xB7 \u624E\u67B6\u53F0",-3.55,-1.35,[-3.55,1.72,.65],[-3.55,1.08,-1.35]),E("dye","\u8D30 \xB7 \u67D3\u7EB8\u53F0",3.55,-1.35,[3.55,1.72,.65],[3.55,1.08,-1.35]),E("press","\u8D30 \xB7 \u538B\u74E3\u53F0",3.55,1.6,[3.55,1.72,3.65],[3.55,1.1,1.6]);let C=[];for(let N=0;N<16;N++){let k=h(bs,Bo,Oo[0],l.clone(),-4.22+N*.055,1.02,-1.4);k.userData.stockIndex=N,C.push(k)}for(let N=0;N<3;N++){let k=h(bs,Bo,.42,l.clone(),-4.22+N*.055,1.065,-1.02);k.userData.stockIndex=16+N,k.userData.lengthType="short",k.userData.lengthCm=42,C.push(k)}for(let N=0;N<3;N++){let k=new Ue(new Lt(.23+N*.055,.008,5,48),l);k.rotation.x=-Math.PI/2,k.position.set(-3.02,1.025+N*.017,-1.3),e.add(k)}_(.095,.095,.18,r,-3.45,1.1,-.95),_(.077,.077,.12,new ke({color:"#e4dccb",roughness:1}),-3.45,1.1,-.95);let U=[Nn(3.23,1.34,-1.08),Nn(3.89,1.34,-1.08)];for(let N=0;N<2;N++){let k=U[N];_(.29,.25,.34,u,k.x,1.17,k.z),_(.255,.255,.008,new ke({color:N?"#52794b":"#a86d9a",roughness:.25}),k.x,k.y,k.z)}for(let N of[2.7,4.4])h(.035,.97,.035,l,N,1.48,-1.97),h(.24,.03,.22,r,N,1.015,-1.97);e.add(Ms(Nn(2.7,1.96,-1.97),Nn(4.4,1.96,-1.97),.017,l)),v("\u901A \u98CE \u9634 \u5E72 \u67B6",3.55,2.1,-1.98,.72);let M=Array.from({length:8},(N,k)=>Nn(2.9+k%4*.43,1.75-Math.floor(k/4)*.46,-1.96));e.add(Ms(Nn(2.7,1.5,-1.97),Nn(4.4,1.5,-1.97),.012,l));let S=[];for(let N=0;N<36;N++){let k=Vn({dose:0});k.name="rack-petal-"+N,k.scale.setScalar(.56),k.position.copy(M[Math.floor(N/6)]),e.add(k),m.push(k)}for(let N=0;N<Ls.length;N++){let k=Vn({leaf:!0,dose:0});k.name="rack-leaf-"+N,k.scale.setScalar(.56),k.position.copy(M[6+Math.floor(N/7)]),e.add(k),S.push(k)}for(let N of M)h(.025,.04,.03,r,N.x,N.y+.21,N.z);let D=cc(),H=D.root;e.add(H),H.position.set(3.08,1,1.42);let G=!1,F=new Ue(Yi(),new ke({vertexColors:!0,side:pt,roughness:.95}));F.rotation.x=-Math.PI/2,F.position.set(4.04,1.02,1.94),e.add(F);let W=new ke({color:"#b97342",metalness:.5,roughness:.4});for(let N=0;N<8;N++){let k=new Ue(new Lt(.065,.004,5,24),W);k.position.set(4.39,1.04+N*.009,1.12),k.rotation.x=Math.PI/2,e.add(k)}let K=new Ue(Yi({leaf:!0,length:.36,width:.27}),new ke({vertexColors:!0,side:pt}));K.position.set(4.12,1.025,1.45),K.rotation.x=-Math.PI/2,e.add(K);let he=Yi({bulge:.18,tip:-.06}),ee=Yi({bulge:.015,tip:0}),be=[],te=[];for(let N=0;N<6;N++){let k=new We;k.position.set(3.18+N%3*.25,1.04,1.26+Math.floor(N/3)*.23);for(let ne=0;ne<6;ne++){let me=new Ue(Yi({length:.18,width:.12,bulge:.035}),F.material);me.rotation.order="YXZ",me.rotation.y=ne/6*Math.PI*2,me.rotation.x=.65,k.add(me)}e.add(k),be.push(k)}for(let N=0;N<2;N++){let k=new Ue(new gt(.09,.04,.07,12),p);k.position.set(4.1,1.065,1.3+N*.25),e.add(k),te.push(k)}for(let[N,k]of[[-1.15,.48],[1.15,.4]])_(.11,.08,.17,u,N,1.1,k),e.add(Ms(Nn(N,1.1,k),Nn(N+.03,1.45,k+.05),.009,l));for(let N=0;N<5;N++){let k=new Ue(new nn(.38,.45),d);k.rotation.x=-Math.PI/2,k.rotation.z=N*.06,k.position.set(-1.03,1.012+N*.002,-.18),e.add(k)}let Ee=sc();Ee.rotation.x=-Math.PI/2,Ee.position.set(1.15,1.03,-.05),e.add(Ee);let Ie=new We;Ie.name="dye-square-stock",Ie.position.set(2.83,1.025,-1.63),e.add(Ie);let V=new Ue(new bt(.53,.025,.48),l);V.position.y=-.01,Ie.add(V);for(let N=0;N<8;N++){let k=Vn({dose:0},"square",.39);k.rotation.x=-Math.PI/2,k.rotation.z=(N%3-1)*.025,k.position.set(N%2*.006,.008+N*.004,0),Ie.add(k)}let ue=new We;ue.name="dye-waste-bin",ue.position.set(4.39,1.16,-.73),e.add(ue);let Re=new Ue(new gt(.13,.105,.25,20,1,!0),new ke({color:"#5c5543",side:pt}));ue.add(Re);let Z=new Ue(new gt(.105,.105,.015,20),new ke({color:"#322d25"}));Z.position.y=-.12,ue.add(Z),e.add(Ms(Nn(4.43,1.045,-1.4),Nn(4.43,1.045,-1.76),.012,l)),h(.045,.025,.085,d,4.43,1.045,-1.79),i.add(new Eo("#fff0d4","#776450",2.1));let re=new fr("#ffedcf",3);re.position.set(-3,7,4),re.castShadow=!0,re.shadow.mapSize.set(2048,2048),Object.assign(re.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:22}),re.shadow.bias=-6e-4,re.shadow.normalBias=.025,i.add(re);let _e=new fr("#d6e6ed",1.4);_e.position.set(5,4,0),i.add(_e),i.background=new Ye("#d3c6af"),i.fog=new to("#d3c6af",12,26);let xe=new st,Te=[];for(let N=0;N<90;N++)Te.push(Math.sin(N*79)*5,1+N%31*.1,Math.cos(N*31)*4);xe.setAttribute("position",new it(Te,3));let ze=new ao(xe,new lr({color:"#fff4db",size:.014,transparent:!0,opacity:.3,depthWrite:!1}));e.add(ze);function Ze(N){let k=[...N.frameItems?.usedStrips??Array.from({length:N.counts.bamboo_prep},(ne,me)=>me),...N.frameItems?.shortStrips??[]];C.forEach((ne,me)=>ne.visible=!k.includes(ne.userData.stockIndex??me));for(let[ne,me,ce,ge]of[[N.papers,m,6,!1],[N.leaves,S,7,!0]])ne.forEach((Le,Be)=>{let R=me[Be];R.userData.paperId=Le.id,R.userData.status=Le.status,R.visible=Be%ce===0&&["wet","dry"].includes(Le.status);let b=[Le.dyeDose,Le.dyeDepth].join(":");R.userData.profile!==b&&(zo(R.geometry,{leaf:ge,dose:Le.dyeDose??.8,depth:Le.dyeDepth??.8}),R.userData.profile=b)});F.visible=!G&&N.counts.petal_cutting>0&&N.counts.petal_assembly<36,F.geometry=N.counts.petal_shaping>0?he:ee,K.visible=!G&&N.counts.leaf_cutting>0&&N.counts.lotus_leaf_assembly<2,be.forEach((ne,me)=>ne.visible=me<N.counts.flower_making&&me>=N.counts.top_flower_assembly),te.forEach((ne,me)=>ne.visible=me<N.counts.pod_making&&me>=N.counts.pod_assembly)}function B(N){ze.rotation.y=Math.sin(N*.07)*.03}function Me(N){G=N,H.visible=!N,N&&(F.visible=!1,K.visible=!1)}return{world:e,stations:y,collisions:g,sync:Ze,animate:B,turntable:T,bambooStock:C,paperStock:Ie,dyeBin:ue,bathPositions:U,rackPositions:M,setPaperFocus:Me,paperMeshes:m,leafPaperMeshes:S}}var zf="qinhuai-lotus-workshop-audio-v1",Ox=Object.freeze({bamboo_prep:"bamboo",frame_assembly:"wood",frame_binding:"binding",lining_upper:"lining",lining_lower:"lining",paper_cutting:"cut",paper_dye:"water",leaf_dye:"water",paper_drying:"dry_ready",petal_pressing:"press",leaf_pressing:"press",petal_shaping:"shape",petal_assembly:"paste",calyx_assembly:"paste",flower_making:"paper",top_flower_assembly:"assemble",pod_making:"paper",pod_assembly:"assemble",lotus_leaf_assembly:"paper",hanging_assembly:"binding",light_installation:"switch",final_inspection:"complete"}),mn=(i,e,t,n,s=0)=>({kind:"tone",hz:i,end:e,duration:t,gain:n,offset:s}),$t=(i,e,t,n=0,s=.65)=>({kind:"noise",hz:i,duration:e,gain:t,offset:n,q:s}),Sn=(i=0,e=1)=>[mn(310,240,.1,.2*e,i),mn(740,670,.055,.065*e,i),$t(1200,.035,.1*e,i)],Zi=(i=0,e=1)=>[$t(2200,.18,.22*e,i),$t(3400,.11,.15*e,i+.12)],Ji=(i,e=0,t=1)=>[mn(i,i,.65,.12*t,e),mn(i*2.76,i*2.76,.24,.025*t,e)],Vf=Object.freeze({bamboo:[$t(1250,.28,.21,0,2.4),mn(370,275,.19,.035,.02),...Sn(.24,.65)],wood:Sn(),binding:[$t(1800,.16,.24,0,1.4),$t(2300,.18,.17,.14,1.1),...Sn(.3,.22)],lining:[...Zi(0,.85),$t(750,.29,.25,.12)],cut:[$t(4200,.055,.28),mn(2100,1300,.035,.035),$t(3600,.065,.23,.14),...Zi(.19,.4)],water:[$t(650,.42,.25,0,.8),mn(590,210,.095,.15,.04),mn(780,300,.075,.1,.15),mn(440,165,.11,.12,.28),$t(1800,.17,.07,.31)],dry_ready:[...Zi(0,.4),...Ji(880,.08,.5)],press:[...Sn(0,.8),$t(650,.32,.24,.05,1.7),$t(1850,.24,.13,.13),...Sn(.37,.55)],shape:[...Zi(0,.8),$t(1300,.28,.19,.1,2),mn(1150,1080,.06,.025,.3)],paste:[$t(620,.12,.25),...Zi(.04,.48),mn(190,130,.075,.065,.16)],paper:Zi(),assemble:[...Zi(0,.5),...Sn(.13,.45)],check:[...Sn(0,.4),...Sn(.12,.22)],switch:[$t(2700,.018,.14),mn(920,450,.035,.07)],light_on:[...Sn(0,.2),...Ji(660,.035,.65)],light_off:[...Sn(0,.25),mn(440,390,.19,.045,.025)],complete:[...Ji(523.25,0,.8),...Ji(659.25,.18,.8),...Ji(783.99,.36,.8),...Ji(1046.5,.57,.55)],phase_done:[...Ji(659.25,0,.35),...Ji(783.99,.14,.35)],tool:Sn(0,.25),ui:Sn(0,.16),undo:Zi(0,.32),blocked:[mn(220,200,.1,.08),$t(800,.04,.07)],footstep:[$t(320,.13,.28,0,.6),mn(95,55,.09,.12),$t(1500,.075,.045,.035)],enter:[...Sn(0,.35),...Sn(.12,.22)]}),Ku=new WeakMap;function Bx(i){if(!Ku.has(i)){let e=i.createBuffer(1,Math.ceil(i.sampleRate*1.6),i.sampleRate),t=e.getChannelData(0),n=74123;for(let s=0;s<t.length;s++)n=Math.imul(n,1664525)+1013904223>>>0,t[s]=n/2147483648-1;Ku.set(i,e)}return Ku.get(i)}function kx(i,e,t,{start:n=i.currentTime,variation:s=1,onEnded:r=()=>{}}={}){let o=Vf[t];if(!o)return null;let a=i.createGain(),c=[a],l=[];a.connect(e);let u=o.length,f=!1,d=()=>{if(!f){f=!0;for(let g of l){g.onended=null;try{g.stop()}catch{}}for(let g of c)g.disconnect();r()}},p=n;for(let g of o){let y=n+g.offset,m=g.duration;p=Math.max(p,y+m+.015);let h=i.createGain();c.push(h),h.gain.setValueAtTime(0,y),h.gain.linearRampToValueAtTime(g.gain,y+Math.min(.012,m*.18)),h.gain.exponentialRampToValueAtTime(1e-4,y+m),h.gain.linearRampToValueAtTime(0,y+m+.01),h.connect(a);let _;if(g.kind==="tone")_=i.createOscillator(),_.type="sine",_.frequency.setValueAtTime(g.hz*s,y),_.frequency.exponentialRampToValueAtTime((g.end||g.hz)*s,y+m),_.connect(h);else{_=i.createBufferSource(),_.buffer=Bx(i);let x=i.createBiquadFilter();x.type="bandpass",x.frequency.value=g.hz*s,x.Q.value=g.q,c.push(x),_.connect(x),x.connect(h)}l.push(_),c.push(_),_.onended=()=>{--u===0&&d()},_.start(y),_.stop(y+m+.012)}return{end:p,dispose:d}}function Gf({storage:i,contextFactory:e,onChange:t=()=>{}}={}){let n=!0,s=.45,r=null,o=null,a=0,c=!0,l=!1,u=0,f=null,d=0,p=0,g=new Set,y=new Map;try{let C=JSON.parse(i?.getItem(zf)||"null");C&&typeof C.enabled=="boolean"&&Number.isFinite(C.volume)&&(n=C.enabled,s=Math.max(0,Math.min(1,C.volume)))}catch{}let m=()=>({enabled:n,volume:s,available:c,paused:l,state:r?.state||"idle",activeVoices:g.size,pending:u,lastSound:f,played:d}),h=()=>t(m());function _(){try{i?.setItem(zf,JSON.stringify({enabled:n,volume:s}))}catch{}h()}function x(){a++,p=0;for(let C of g)C.dispose();g.clear()}function v(){if(!c)return!1;if(!r)try{r=e?e():new(globalThis.AudioContext||globalThis.webkitAudioContext),o=r.createGain(),o.gain.value=s*.8;let C=r.createBiquadFilter();C.type="highpass",C.frequency.value=55;let U=r.createDynamicsCompressor();U.threshold.value=-16,U.knee.value=15,U.ratio.value=5,U.attack.value=.003,U.release.value=.12,o.connect(C),C.connect(U),U.connect(r.destination)}catch{return c=!1,x(),h(),!1}return!0}function T(C){if(!n||!s||l||r.state!=="running"||g.size>=8)return!1;let U=r.currentTime,M=C==="blocked"?.55:C==="footstep"?.23:.055;if(U-(y.get(C)??-1/0)<M)return!1;y.set(C,U);let S;return S=kx(r,o,C,{start:U+.006,variation:["complete","phase_done","light_on","dry_ready"].includes(C)?1:.96+Math.random()*.08,onEnded:()=>g.delete(S)}),S?(g.add(S),f=C,d++,!0):!1}function E(C){let U=Ox[C]||C;if(!Vf[U]||!n||!s||l||!v())return!1;if(r.state==="running")return T(U);if(u)return!1;let M=a;u++;try{Promise.resolve(r.resume()).then(()=>{M===a&&T(U)},()=>{}).finally(()=>{u--,h()})}catch{u--}return!1}return{play:E,snapshot:m,setEnabled(C){n=!!C,n||x(),_()},setVolume(C){Number.isFinite(C)&&(s=Math.max(0,Math.min(1,C)),s||x(),o&&(o.gain.cancelScheduledValues(r.currentTime),o.gain.setTargetAtTime(s*.8,r.currentTime,.025)),_())},pause(){l=!0,x(),h()},resume(){l=!1,h()},walk(C){!n||!s||l||!r||r.state!=="running"||(p+=Math.max(0,C),p>=.7&&(p%=.7,E("footstep")))},async dispose(){x(),r&&r.state!=="closed"&&await r.close()}}}var uc=class{constructor(){this.phase="idle",this.elapsed=0,this.winding=0,this.adherence=0,this.hits=0,this.compression=0,this.strike=0,this.progress=0}begin(e){this.phase=e,this.elapsed=0}place(){return this.phase!=="idle"?!1:(this.begin("loading"),!0)}fit(){return this.phase!=="loaded"?!1:(this.begin("fitting"),!0)}wind(e){return this.phase!=="winding"||!Number.isFinite(e)||e<=0?!1:(this.winding=Ot(this.winding+e),this.winding===1&&this.begin("wrapped"),!0)}stand(){return this.phase!=="wrapped"?!1:(this.begin("standing"),!0)}hammer(){return this.phase!=="hammering"||this.strike>0?!1:(this.strike=.52,!0)}restore(){return this.phase!=="compressed"?!1:(this.begin("restoring"),!0)}unthread(){return this.phase!=="restored"?!1:(this.begin("unthreading"),!0)}removePaper(){return this.phase!=="unthreaded"?!1:(this.begin("extracting"),!0)}extract(){return this.phase!=="done"?!1:(this.begin("collected"),!0)}tick(e){e=Ot(e,0,.05),this.elapsed+=e;let t={loading:[.85,"loaded"],fitting:[1.1,"winding"],standing:[1.05,"hammering"],restoring:[1,"restored"],unthreading:[1.1,"unthreaded"],extracting:[1.1,"done"]};this.phase==="fitting"&&(this.adherence=Ot(this.elapsed/1.1));let n=t[this.phase];if(n&&this.elapsed>=n[0]&&this.begin(n[1]),this.strike>0){let r=this.strike;this.strike=Math.max(0,this.strike-e),r>.24&&this.strike<=.24&&(this.hits++,this.compression=this.hits/8),this.strike===0&&this.hits>=8&&this.begin("compressed")}let s={idle:0,loading:.03,loaded:.05,fitting:.07,winding:.12,wrapped:.3,standing:.35,hammering:.42,compressed:.75,restoring:.77,restored:.81,unthreading:.84,unthreaded:.89,extracting:.93,done:1,collected:1};this.progress=(s[this.phase]??0)+(this.phase==="winding"?this.winding*.18:this.phase==="hammering"?this.compression*.3:0)}};var tn=(i=0,e=0,t=0)=>new O(i,e,t),wr=i=>(i=Ot(i),i*i*(3-2*i));function Wf(i){let e=new We;e.name="manual-press-tool",e.position.set(3.2,1.045,1.48);let t=new ke({color:"#715237",roughness:.86}),n=new ke({color:"#bc9560",roughness:.8}),s=new ke({color:"#ada58b",metalness:.5,roughness:.42}),r=new Mn({color:"#f7e7bf"});function o(M,S,D,H=e){let G=new Ue(M,S);return G.position.copy(D),G.castShadow=G.receiveShadow=!0,H.add(G),G}o(new bt(.49,.045,.48),t,tn(0,.023,0));let a=new We;a.name="manual-mold",e.add(a);let c=o(new gt(.205,.205,.065,40),n,tn(0,-.3,0),a),l=o(new gt(.205,.205,.065,40),n,tn(0,.3,0),a),u=[];for(let M of[-1,1]){let S=new We;a.add(S),u.push(S);let D=o(new gt(.144,.144,.53,40,1,!1,M<0?Math.PI:0,Math.PI),t,tn(),S);for(let H=0;H<9;H++){let G=H/8*Math.PI+(M<0?Math.PI:0);o(new gt(.002,.002,.51,6),s,tn(Math.sin(G)*.146,0,Math.cos(G)*.146),S)}}let f=[];for(let M of[-.255,.255]){let S=o(new Lt(.16,.009,8,40),s,tn(0,M,0),a);S.rotation.x=Math.PI/2,f.push(S)}let d=Array.from({length:901},(M,S)=>{let D=S/900,H=D*Math.PI*32;return tn(Math.sin(H)*.163,-.25+D*.5,-Math.cos(H)*.163)}),p=new bn(new st().setFromPoints(d),r);p.name="manual-cotton-winding",a.add(p);let g=new We;g.name="manual-cotton-spool",g.position.set(-.42,.09,.23),e.add(g),o(new gt(.052,.052,.14,20),n,tn(),g),o(new gt(.066,.066,.095,24),new ke({color:"#e8d9b6",roughness:1}),tn(),g);for(let M of[-.07,.07])o(new gt(.09,.09,.018,24),t,tn(0,M,0),g);let y=new bn(new st().setFromPoints([tn(),tn()]),r);e.add(y);let m=new We;m.name="manual-hammer",e.add(m),o(new gt(.018,.022,.39,12),t,tn(0,-.15,0),m),o(new bt(.24,.11,.12),s,tn(),m);let h=Vn(i);h.scale.setScalar(.72),e.add(h),h.rotation.x=-Math.PI/2,h.position.set(.81,.014,.26);let _=h.geometry.attributes.position.array.slice(),x=Vo(h,i.leaf,!0);x.visible=!1;let v=tn(.81,.014,.26),T=tn(.81,.014,.26),E=tn();function C(M){let S=["idle","loading","winding","wrapped","standing","hammering","compressed","restoring","restored","unthreading","unthreaded","extracting","done","collected"],D=["loaded","fitting"].includes(M.phase)?2:S.indexOf(M.phase),H=D<4?0:D===4?wr(M.elapsed/1.05):1,G=D<11?0:D===11?wr(M.elapsed/1.1):1,F=D<7?0:D===7?wr(M.elapsed):1,W=M.compression*(1-F),K=D<9?0:D===9?wr(M.elapsed/1.1):1;a.rotation.set((1-H)*Math.PI/2,Math.PI*H,0),a.position.set(0,.19+H*.19,0),a.scale.y=1-.32*W,a.position.y=.19+H*.19-.3*.32*W,l.position.y=.3,c.position.y=-.3,u.forEach(te=>{te.position.x=0}),f.forEach((te,Ee)=>{te.scale.setScalar(1),te.position.y=(Ee?1:-1)*.255}),p.geometry.setDrawRange(0,Math.max(0,Math.floor(901*M.winding*(1-K)))),p.visible=K<1,a.updateMatrixWorld(!0),e.updateMatrixWorld(!0);let he=d[Math.min(900,Math.floor(900*M.winding*(1-K)))].clone();a.localToWorld(he),e.worldToLocal(he);let ee=y.geometry.attributes.position;if(ee.setXYZ(0,-.42,.15,.23),ee.setXYZ(1,he.x,he.y,he.z),ee.needsUpdate=!0,y.geometry.computeBoundingSphere(),y.visible=["winding","unthreading"].includes(M.phase),m.visible=!0,D>=5&&D<=6){let te=M.strike>0?Math.sin((.52-M.strike)/.52*Math.PI):0;m.position.set(0,.87-te*.14-.075*M.compression,0),m.rotation.set(0,0,Math.PI/2+.2-te*.2)}else m.position.set(.43,.07,-.3),m.rotation.set(Math.PI/2,0,-.65);let be=h.geometry.attributes.position;if(D===0)v.copy(h.position);else if(D===1)a.localToWorld(E.set(0,0,-.165)),e.worldToLocal(E),h.rotation.set(-Math.PI/2,0,0),h.position.lerpVectors(v,E,wr(M.elapsed/.85));else if(D<11){h.position.copy(a.position),h.quaternion.copy(a.quaternion);for(let te=0;te<be.count;te++){let Ee=_[te*3],Ie=_[te*3+1],V=Ee*.72/.157,ue=wr(M.adherence);be.setXYZ(te,Xt.lerp(Ee,Math.sin(V)*.157/.72,ue),Ie*(1-.32*W),Xt.lerp(-.165/.72,-Math.cos(V)*.157/.72,ue))}}else{h.quaternion.slerpQuaternions(a.quaternion,new Qn().setFromEuler(new fn(-Math.PI/2,0,0)),G),h.position.lerpVectors(a.position,T,G),h.position.y+=Math.sin(G*Math.PI)*.28;for(let te=0;te<be.count;te++){let Ee=_[te*3],Ie=_[te*3+1],V=Ee*.72/.157;be.setXYZ(te,Xt.lerp(Math.sin(V)*.157/.72,Ee,G),Ie,Xt.lerp(-Math.cos(V)*.157/.72,0,G))}}be.needsUpdate=!0,h.geometry.computeVertexNormals(),h.geometry.computeBoundingSphere(),x.visible=D>=12}function U(){return e.localToWorld(tn(0,.34,0))}return{root:e,paper:h,update:C,moldTarget:U}}function qf(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new st,l=0;for(let u=0;u<i.length;++u){let f=i[u],d=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in f.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(f.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in f.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(f.morphAttributes[p])}if(e){let p;if(t)p=f.index.count;else if(f.attributes.position!==void 0)p=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,u),l+=p}}if(t){let u=0,f=[];for(let d=0;d<i.length;++d){let p=i[d].index;for(let g=0;g<p.count;++g)f.push(p.getX(g)+u);u+=i[d].attributes.position.count}c.setIndex(f)}for(let u in r){let f=Xf(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,f)}for(let u in o){let f=o[u][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<f;++d){let p=[];for(let y=0;y<o[u].length;++y)p.push(o[u][y][d]);let g=Xf(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function Xf(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new Nt(o,t,n),c=0;for(let l=0;l<i.length;++l){let u=i[l];if(u.isInterleavedBufferAttribute){let f=c/t;for(let d=0,p=u.count;d<p;d++)for(let g=0;g<t;g++){let y=u.getComponent(d,g);a.setComponent(d+f,g,y)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function Dt(i){let e=new Set,t=new Set,n=new Set;i.traverse(s=>{s.geometry&&e.add(s.geometry),s.skeleton&&n.add(s.skeleton),s.material&&(Array.isArray(s.material)?s.material:[s.material]).forEach(r=>t.add(r))}),i.clear();for(let s of e)s.dispose();for(let s of n)s.dispose();for(let s of t)s.map?.dispose(),s.dispose()}var Hx={relaxed:{curl:[.18,.23,.28,.36],middle:.35,tip:.22,thumb:[-.28,-.8,.3]},bamboo:{curl:[.58,.68,.78,.88],middle:1.05,tip:.55,thumb:[-.62,.18,.68]},grip:{curl:[.82,.95,1.05,1.15],middle:1.18,tip:.62,thumb:[-.6,.35,.8]},brush:{curl:[.92,1.06,1.16,1.23],middle:1.32,tip:.65,thumb:[-.65,.5,.85]},pinch:{curl:[.38,.82,.96,1.1],middle:.95,tip:.55,thumb:[-.55,.48,.7]},press:{curl:[.06,.08,.11,.16],middle:.12,tip:.08,thumb:[-.12,-.7,.15]}};function Yf(i,e=16){let t=[],n=[];for(let[o,a,c,l=0]of i)for(let u=0;u<e;u++){let f=u/e*Math.PI*2,d=Math.cos(f),p=Math.sin(f);t.push(Math.sign(d)*Math.pow(Math.abs(d),.78)*a,l+Math.sign(p)*Math.pow(Math.abs(p),.78)*c,o)}for(let o=0;o<i.length-1;o++)for(let a=0;a<e;a++){let c=o*e+a,l=o*e+(a+1)%e;n.push(c,l,c+e,l,l+e,c+e)}n.push(...Array.from({length:e-2},(o,a)=>[0,a+2,a+1]).flat());let s=(i.length-1)*e;for(let o=1;o<e-1;o++)n.push(s,s+o,s+o+1);let r=new st;return r.setAttribute("position",new it(t,3)),r.setIndex(n),r.computeVertexNormals(),r}function zx(i,e="relaxed",t=1){let n=i.handRig,s=Hx[e];if(!n||!s)return!1;let r=Xt.clamp(Number.isFinite(t)?t:1,0,1);return n.fingers.forEach((o,a)=>{o[0].rotation.set(-s.curl[a]*r,0,n.sign*(a-1.5)*.025),o[1].rotation.x=-s.middle*r,o[2].rotation.x=-s.tip*r}),n.thumb[0].rotation.set(s.thumb[0]*r,n.sign*s.thumb[1],n.sign*.15),n.thumb[1].rotation.x=-s.thumb[2]*r,n.thumb[2].rotation.x=-s.thumb[2]*.65*r,i.userData.pose=e,i.userData.poseAmount=r,!0}function Fn(i,e=!1,t="grip"){let n=new We;n.name=e?"artisan-hand-left":"artisan-hand-right",i.add(n);let s=e?1:-1,r=[],o=[],a=[],c=[];function l(_,x,v){let T=new or;return T.name=_,T.position.copy(v),x.add(T),r.push(T),T}let u=l("palm",n,new O);function f(_,x,v=new O){_.translate(v.x,v.y,v.z);let T=_.attributes.position.count,E=new Uint16Array(T*4),C=new Float32Array(T*4);for(let U=0;U<T;U++)E[U*4]=x,C[U*4]=1;return _.setAttribute("skinIndex",new zi(E,4)),_.setAttribute("skinWeight",new it(C,4)),_}o.push(f(Yf([[-.046,.045,.013],[-.027,.076,.03],[0,.088,.037],[.04,.086,.041],[.078,.073,.035],[.116,.053,.028],[.16,.046,.026]]),0)),o.push(f(new In(1,16,10).scale(.034,.031,.055),0,new O(s*.051,-.009,.062)));function d(_,x,v,T,E,C=!1){let U=l(_+"-base",u,new O(x,C?-.006:0,v)),M=l(_+"-middle",U,new O(0,0,-T[0])),S=l(_+"-tip",M,new O(0,0,-T[1])),D=[r.indexOf(U),r.indexOf(M),r.indexOf(S)],H=[T[0],T[0]+T[1]],G=T.reduce((V,ue)=>V+ue,0),F=[0,.014,H[0]-.007,H[0],H[0]+.007,H[1]-.006,H[1],H[1]+.006,G-.012,G-.007,G-.003,G].sort((V,ue)=>V-ue),W=[],K=[],he=[],ee=[],be=12;for(let V of F){let ue=V/G,Re=V>G-.012?Math.sqrt(Math.max(.003,1-Math.pow((V-G+.012)/.012,2))):1,Z=E*(1-.25*ue)*Re,re=V<H[0]?0:V<H[1]?1:2,_e=re,xe=0;for(let Te=0;Te<2;Te++)Math.abs(V-H[Te])<=.007&&(re=Te,_e=Te+1,xe=Xt.clamp((V-H[Te]+.007)/.014,0,1));for(let Te=0;Te<be;Te++){let ze=Te/be*Math.PI*2;W.push(x+Math.cos(ze)*Z,(C?-.006:0)+Math.sin(ze)*Z*.86,v-V),he.push(D[re],D[_e],0,0),ee.push(1-xe,xe,0,0)}}for(let V=0;V<F.length-1;V++)for(let ue=0;ue<be;ue++){let Re=V*be+ue,Z=V*be+(ue+1)%be;K.push(Re,Re+be,Z,Z,Re+be,Z+be)}let te=(F.length-1)*be;for(let V=1;V<be-1;V++)K.push(te,te+V+1,te+V);let Ee=new st;Ee.setAttribute("position",new it(W,3)),Ee.setIndex(K),Ee.setAttribute("skinIndex",new zi(he,4)),Ee.setAttribute("skinWeight",new it(ee,4)),Ee.computeVertexNormals(),o.push(Ee);let Ie=new In(1,12,8).scale(E*.63,.0018,.01);return a.push(f(Ie,D[2],new O(x,(C?-.006:0)+E*.7,v-G+.015))),[U,M,S]}let p=[["index",.06,-.019,[.045,.032,.024],.017],["middle",.021,-.032,[.049,.037,.028],.018],["ring",-.02,-.026,[.045,.035,.026],.0165],["little",-.057,-.01,[.034,.027,.021],.014]];for(let[_,x,v,T,E]of p)c.push(d(_,s*x,v,T,E));let g=d("thumb",s*.073,.07,[.031,.027,.024],.02,!0);n.updateMatrixWorld(!0);let y=new oo(r);function m(_,x){for(let E of _)E.deleteAttribute("uv");let v=qf(_);for(let E of _)E.dispose();let T=new ro(v,x);return T.castShadow=!0,T.receiveShadow=!0,n.add(T),T.bind(y),T.frustumCulled=!1,T}m(o,new ke({color:"#cda787",roughness:.82})),m(a,new ke({color:"#d9bcaa",roughness:.63}));function h(_,x){let v=new Ue(Yf(_),new ke({color:x,roughness:1}));v.castShadow=!0,v.receiveShadow=!0,n.add(v)}return h([[.18,.056,.037],[.205,.06,.041],[.25,.069,.049],[.32,.078,.056],[.38,.081,.058]],"#58634d"),h([[.153,.048,.029],[.157,.057,.037],[.181,.059,.039],[.191,.055,.036]],"#73806a"),n.handRig={fingers:c,thumb:g,sign:s,skeleton:y},n.userData.left=e,n.userData.gripPoint=[s*.025,-.027,-.052],zx(n,t),n}function Gn(i,e){let t=new O(...i.userData.gripPoint).multiply(i.scale).applyQuaternion(i.quaternion);i.position.copy(e).sub(t)}function Ii(i,e=!1){let t=i.clone(!0);return t.visible=!0,t.traverse(n=>{n.geometry&&(n.geometry=n.geometry.clone()),n.material&&(n.material=e?new Ft({color:"#d5dc9c",transparent:!0,opacity:.35,depthWrite:!1}):n.material.clone())}),t}var Ke=i=>document.getElementById(i),Zt=(i=0,e=0,t=0)=>new O(i,e,t);function $f({scene:i,camera:e,canvas:t,world:n,audio:s,getState:r,onComplete:o,onDiscardDye:a,canInteract:c}){let l=new We;l.name="paper-work",i.add(l),l.visible=!1;let u=Ke("handwork-surface"),f=new Ln,d=!1,p,g,y,m,h,_,x,v,T,E,C,U,M,S,D=null,H=null,G=0,F,W="",K=0,he,ee,be,te,Ee="machine",Ie=null,V=null,ue=null,Re=!1,Z=()=>y==="press"&&Ee==="manual",re=X=>{Ke("handwork-status").textContent=X};function _e(X){let w=t.getBoundingClientRect(),q=X.clone().project(e);return{x:w.left+(q.x+1)*w.width/2,y:w.top+(1-q.y)*w.height/2}}function xe(X,w=1.05){let q=t.getBoundingClientRect();return f.setFromCamera(new Ce((X.clientX-q.left)/q.width*2-1,-(X.clientY-q.top)/q.height*2+1),e),f.ray.intersectPlane(new Ht(Zt(0,1,0),-w),Zt())}function Te(X,w,q=48){let ie=_e(w);return Math.hypot(ie.x-X.clientX,ie.y-X.clientY)<q}function ze(X,w,q){let ie=new Ue(new bt(...X),new ke({color:q,roughness:.85}));return ie.position.copy(w),l.add(ie),ie}function Ze(){return{mode:y==="cut"?"trace":y,quality:y==="dye"?Ot(1-Math.abs(_.dose-.8)):1,curve:0,oval:0,dose:y==="dye"?_.dose:h.dose,depth:y==="dye"?_.maxDepth:h.depth,angle:0,distance:1}}function B(){let X=performance.now();X-K>240&&(s.play(y==="cut"?"paper_cutting":p.id),K=X)}function Me(){let X=m?r().leaves:r().papers,w=X[g*(m?7:6)];return{leaf:m,dose:w?.dyeDose??.8,depth:w?.dyeDepth??.8}}function N(){if(ne(),Re=!1,Ie=null,Dt(l),x=v=T=E=C=U=M=S=null,W="",G=0,H=null,y==="dye")_=new ac,x=Vn({leaf:m,dose:0}),x.scale.setScalar(.56),x.visible=!1,l.add(x),S=n.dyeBin.position,v=Fn(l,!1,"pinch"),v.scale.setScalar(.58),v.visible=!1;else if(Z())_=new uc,Ie=Wf(h),l.add(Ie.root),x=Ie.paper,Ie.update(_);else if(y==="press")_=new lc,M=cc(),l.add(M.root),M.root.position.set(3.08,1.01,1.42),x=Vn(h),x.scale.setScalar(.72),x.rotation.x=-Math.PI/2,x.position.set(4.05,1.045,1.76),l.add(x),F=x.geometry.attributes.position.array.slice(),U=Vo(x,m,!0),U.visible=!1;else{let X=p.id==="paper_cutting"?"square":m?"leaf":"petal";_=new oc(X),x=Vn(p.id==="paper_cutting"?{dose:0}:h,"square",p.id==="paper_cutting"?1.05:.72),l.add(x);let w=n.stations[p.station];x.rotation.x=-Math.PI/2,x.position.set(w.x,1.055,w.z+.25),X!=="square"&&(U=Vo(x,m)),T=new bn(new st().setFromPoints(_.points.map(q=>Zt(q.x,q.y,.006))),new Mn({color:"#624a33",depthTest:!1})),x.add(T),T.renderOrder=15,E=new Ue(new Lt(.022,.004,6,20),new Ft({color:"#a84e35",depthTest:!1})),E.renderOrder=16,x.add(E),C=sc(),l.add(C),C.rotation.x=-Math.PI/2,C.position.copy(x.position).add(Zt(.43,.026,0))}x.name="active-paper",k()}function k(){let X=Ke("handwork-confirm"),w=Ke("handwork-retry");if(w.hidden=y!=="cut",w.textContent="\u91CD\u65B0\u88C1\u526A",X.hidden=y==="press"&&_.phase==="running",y==="dye"){let q=Le();Ke("paper-stock").disabled=_.phase!=="stock",Ke("paper-stock-count").textContent="\u7B2C "+(g+1)+" / "+p.total+" \u6279 \xB7 \u65B9\u7EB8\u5728\u684C\u9762\u5DE6\u4E0A\u89D2",Ke("paper-waste-count").textContent="\u5E9F\u7EB8 "+r().dyeWaste+" \u6279",X.textContent=q?"E \xB7 "+q.label:G?"\u6B63\u5728\u6302\u7EB8\u2026":"\u79FB\u52A8\u7EB8\u5F20\u9760\u8FD1\u76EE\u6807",X.disabled=!q||G>0;let ie=Ke("dye-clock");ie.hidden=_.phase==="stock";let $=Math.floor(_.simulatedSeconds);Ke("dye-time").textContent=String(Math.floor($/60)).padStart(2,"0")+":"+String($%60).padStart(2,"0"),Ke("dye-real-time").textContent="\u5B9E\u9645\u6D78\u67D3 "+_.seconds.toFixed(1)+" \u79D2 \xB7 20 \u500D\u901F",Ke("dye-time-note").textContent=_.simulatedSeconds>120?"\u5DF2\u8D85\u8FC7\u5EFA\u8BAE\u65F6\u95F4 \xB7 \u53EF\u63D0\u7EB8\u540E\u5F03\u7F6E":_.simulatedSeconds>=60?_.phase==="dipping"?"\u5DF2\u5230\u5EFA\u8BAE\u533A\u95F4 \xB7 \u6309 E \u63D0\u7EB8":"\u67D3\u8272\u5DF2\u5C31\u7EEA \xB7 \u79FB\u81F3\u9634\u5E72\u67B6":"\u5EFA\u8BAE\u5DE5\u827A\u65F6\u95F4 01:00\u201402:00",ie.dataset.state=_.simulatedSeconds>120?"over":_.simulatedSeconds>=60?"ready":"waiting";let ye={stock:"\u70B9\u51FB\u684C\u9762\u5DE6\u4E0A\u89D2\u65B9\u7EB8\uFF0C\u62D6\u81F3\u67D3\u76D8\u9644\u8FD1\uFF0C\u518D\u6309 E \u6D78\u6DA6\u3002",held:"\u6309\u4F4F\u7EB8\u5F20\u62D6\u52A8\uFF1B\u677E\u624B\u539F\u4F4D\u505C\u7559\u3002\u9760\u8FD1\u67D3\u76D8\u3001\u9634\u5E72\u67B6\u6216\u5E9F\u6599\u6876\u540E\u6309 E\u3002",dipping:"\u6B63\u5728\u6D78\u67D3 \xB7 \u6309 E \u63D0\u7EB8\u3002\u677E\u5F00\u9F20\u6807\u4E0D\u4F1A\u79FB\u52A8\u7EB8\u5F20\u6216\u505C\u6B62\u67D3\u8272\u3002",lifting:"\u6B63\u5728\u62AC\u79BB\u67D3\u6DB2\uFF0C\u4FDD\u7559\u672C\u6B21\u6E10\u53D8\u2026",review:_.ready?"\u67D3\u8272\u5DF2\u5408\u9002\uFF1A\u62D6\u5230\u9634\u5E72\u67B6\u65C1\u6309 E \u6302\u7EB8\uFF1B\u4E0D\u6EE1\u610F\u53EF\u79FB\u81F3\u5E9F\u6599\u6876\u3002":"\u65F6\u95F4\u4E0D\u8DB3\u53EF\u79FB\u56DE\u67D3\u76D8\u7EE7\u7EED\u6D78\u67D3\uFF1B\u8FC7\u6DF1\u53EF\u79FB\u81F3\u5E9F\u6599\u6876\u5F03\u7F6E\u3002"};re(W||(G?"\u6B63\u5728\u6302\u7EB8\uFF1B\u7EB8\u8272\u4E0E\u6D78\u67D3\u7ED3\u679C\u4FDD\u6301\u4E00\u81F4\u3002":q?"\u3010E\u3011"+q.label+" \xB7 "+(q.hint||"\u677E\u624B\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C"):ye[_.phase]));for(let[Pe,Se,P]of[["bath","\u67D3\u76D8",n.bathPositions[m?1:0]],["rack","\u9634\u5E72\u67B6",ge()],["bin","\u5E9F\u6599\u6876",S]]){let se=Ke("dye-target-"+Pe),L=_e(P);se.style.left=L.x+"px",se.style.top=L.y+"px",se.classList.toggle("near",q?.key===Pe),se.textContent=q?.key===Pe?"E \xB7 "+q.label:Se}}else Z()?me(X):y==="press"?(X.disabled=!1,X.textContent=_.phase==="done"?"\u53D6\u51FA\u538B\u7EB9\u65B9\u7EB8 \u2192":"\u542F\u52A8\u6EDA\u8F74\u538B\u7EB9",re(_.phase==="running"?"\u6EDA\u8F74\u8FD0\u8F6C \xB7 \u5377\u7EBF\u8FDB\u7EB8 "+Math.round(_.progress*100)+"% \xB7 \u7B49\u5F85\u81EA\u52A8\u505C\u6B62":_.phase==="done"?"\u6EDA\u8F74\u5DF2\u505C\u6B62\uFF0C\u538B\u7EB9\u5B8C\u6210\u3002\u53F3\u4FA7\u4ECD\u662F\u65B9\u7EB8\uFF0C\u4E0B\u4E00\u6B65\u624D\u88C1\u8F6E\u5ED3\u3002":"\u53F3\u4FA7\u4E3A\u9634\u5E72\u65B9\u7EB8\uFF0C\u5DE6\u4FA7\u4E3A\u538B\u7EB9\u673A\u3002\u70B9\u51FB\u542F\u52A8\uFF0C\u7B49\u5F85\u5B8C\u6574\u8FDB\u7EB8\u4E0E\u538B\u7EB9\u3002")):(X.disabled=!_.ready,X.textContent=p.id==="paper_cutting"?"\u6536\u597D\u65B9\u5F62\u7EB8\u7247 \u2192":"\u6536\u597D\u88C1\u6210\u7684"+(m?"\u53F6\u7247":"\u82B1\u74E3")+" \u2192",re(_.ready?"\u8F6E\u5ED3\u88C1\u526A\u5B8C\u6210\uFF0C\u53EF\u4EE5\u6536\u597D\u672C\u6279\u7EB8\u7247\u3002":"\u6CBF\u4EAE\u70B9\u9644\u8FD1\u7684\u8F68\u8FF9\u6309\u4F4F\u6216\u70B9\u51FB\u5DE6\u952E\u7EE7\u7EED\u526A\uFF1B\u677E\u624B\u3001\u504F\u79BB\u53EA\u6682\u505C\uFF0C\u5DF2\u526A\u8FDB\u5EA6\u4F1A\u4FDD\u7559\u3002"))}function ne(){for(let X of[u,Ke("handwork-confirm")])for(let w of[H,V])w!==null&&X.hasPointerCapture?.(w)&&X.releasePointerCapture(w);H=null,V=null,ue=null}function me(X){let w=_.phase,q={idle:"\u653E\u5165\u65B9\u7EB8\u576F\u6599",loading:"\u6B63\u5728\u5E73\u94FA\u653E\u6599\u2026",loaded:"\u8D34\u7D27\u6A21\u5177\u8868\u9762",fitting:"\u6B63\u5728\u629A\u5E73\u8D34\u6A21\u2026",winding:"\u6309\u4F4F\u7F20\u7EBF \xB7 "+Math.round(_.winding*100)+"%",wrapped:"\u5C06\u5DE5\u88C5\u7AD6\u76F4\u7ACB\u8D77",standing:"\u6B63\u5728\u7ACB\u6A21\u2026",hammering:"\u9524\u51FB\u538B\u5B9E \xB7 "+_.hits+" / 8",compressed:"\u62C9\u9AD8\u6A21\u5177\u590D\u4F4D",restoring:"\u6B63\u5728\u62C9\u9AD8\u6A21\u5177\u2026",restored:"\u62BD\u51FA\u68C9\u7EBF",unthreading:"\u6B63\u5728\u62BD\u7EBF\u2026",unthreaded:"\u53D6\u51FA\u538B\u7EB9\u65B9\u7EB8",extracting:"\u6B63\u5728\u53D6\u51FA\u65B9\u7EB8\u2026",done:"\u6536\u597D\u538B\u7EB9\u65B9\u7EB8 \u2192"};X.hidden=!1,X.textContent=q[w]||"\u5DF2\u6536\u597D",X.disabled=["loading","fitting","standing","restoring","unthreading","extracting","collected"].includes(w)||w==="hammering"&&_.strike>0;let ie={idle:"\u5C06\u53F3\u4FA7\u9634\u5E72\u65B9\u7EB8\u62D6\u5230\u5DE6\u4FA7\u6A21\u5177\u578B\u8154\uFF1B\u4E5F\u53EF\u70B9\u51FB\u300C\u653E\u5165\u65B9\u7EB8\u576F\u6599\u300D\u3002",loading:"\u5C06\u65B9\u7EB8\u5E73\u94FA\u5230\u6A21\u5177\u4E0A\uFF0C\u6682\u4E0D\u7F20\u7EBF\u3002",loaded:"\u653E\u6599\u5B8C\u6210\u3002\u70B9\u51FB\u300C\u8D34\u7D27\u6A21\u5177\u8868\u9762\u300D\uFF0C\u5148\u8BA9\u7EB8\u5F20\u5B8C\u5168\u8D34\u5408\u6A21\u5177\uFF0C\u518D\u5F00\u59CB\u7F20\u7EBF\u3002",fitting:"\u6B63\u5728\u6CBF\u6A21\u5177\u8868\u9762\u629A\u5E73\u7EB8\u5F20\uFF0C\u8D34\u7D27\u5B8C\u6210\u540E\u624D\u53EF\u7F20\u7EBF\u3002",winding:"\u6CBF\u82B1\u74E3\u9762\u7ED5\u8F74\u7F20\u7EBF\uFF0C\u7EF7\u7D27\u56FA\u5B9A\u7EB8\u5F20 \xB7 \u6309\u4F4F\u6A21\u5177\u6216\u4E0B\u65B9\u6309\u94AE\u7F20\u7EBF\uFF0C\u677E\u624B\u6682\u505C\u3002",wrapped:"\u68C9\u7EBF\u5DF2\u7EF7\u7D27\uFF0C\u70B9\u51FB\u5C06\u6574\u5957\u5DE5\u88C5\u7ACB\u5230\u5E73\u53F0\u4E0A\u3002",standing:"\u6B63\u5728\u7AD6\u7ACB\u5DE5\u88C5\uFF0C\u7B49\u5F85\u5E95\u5EA7\u5C31\u7A33\u3002",hammering:"\u9524\u51FB\u4E0B\u538B\uFF0C\u6D88\u9664\u6A21\u5177\u5185\u90E8\u7A7A\u9699\uFF0C\u5B8C\u6210\u82B1\u74E3\u5851\u5F62 \xB7 \u70B9\u51FB\u6A21\u5177\u6216\u6309\u94AE\u9010\u6B21\u6572\u6253\u3002",compressed:"\u5DF2\u538B\u5B9E\u3002\u5411\u4E0A\u62C9\u9AD8\u88AB\u6572\u6241\u7684\u6A21\u5177\uFF0C\u4F7F\u5176\u6062\u590D\u539F\u9AD8\u5EA6\uFF0C\u4E0D\u9700\u8981\u62C6\u5F00\u6A21\u5177\u3002",restoring:"\u4FDD\u6301\u6A21\u5177\u5B8C\u6574\uFF0C\u6B63\u5728\u7AD6\u76F4\u62C9\u9AD8\u590D\u4F4D\u3002",restored:"\u6A21\u5177\u5DF2\u6062\u590D\u539F\u9AD8\u5EA6\uFF0C\u63A5\u4E0B\u6765\u62BD\u51FA\u7F20\u7ED5\u7684\u68C9\u7EBF\u3002",unthreading:"\u6B63\u5728\u4ECE\u6A21\u5177\u4E0A\u9010\u5708\u62BD\u51FA\u68C9\u7EBF\uFF0C\u8BF7\u7B49\u5F85\u3002",unthreaded:"\u68C9\u7EBF\u5DF2\u5168\u90E8\u53D6\u51FA\uFF0C\u53EF\u4EE5\u53D6\u51FA\u538B\u597D\u7B4B\u7EB9\u7684\u65B9\u7EB8\u3002",extracting:"\u6B63\u5728\u53D6\u51FA\u65B9\u7EB8\u3002\u6B64\u65F6\u53EA\u6709\u7B4B\u7EB9\uFF0C\u88C1\u526A\u5DE5\u5E8F\u624D\u663E\u793A\u82B1\u74E3\u8F6E\u5ED3\u3002",done:"\u5851\u5F62\u538B\u7EB9\u5B8C\u6210\u3002\u53D6\u51FA\u672C\u6279\u65B9\u7EB8\uFF0C\u540E\u7EED\u518D\u88C1\u526A\u82B1\u74E3 / \u53F6\u7247\u3002"};re(W||ie[w]),Ke("stage-hint").textContent=ie[w];let $={idle:0,loading:0,loaded:1,fitting:1,winding:2,wrapped:3,standing:3,hammering:4,compressed:5,restoring:5,restored:6,unthreading:6,unthreaded:7,extracting:7,done:7}[w]??7;Ke("manual-press-guide").querySelectorAll("li").forEach((ye,Pe)=>{ye.classList.toggle("current",Pe===$),ye.classList.toggle("complete",Pe<$),Pe===$?ye.setAttribute("aria-current","step"):ye.removeAttribute("aria-current")}),Ke("manual-press-progress").value=_.progress}function ce(){W="",_.phase==="idle"?_.place():_.phase==="loaded"?_.fit():_.phase==="wrapped"?_.stand():_.phase==="hammering"?_.hammer()&&s.play("petal_pressing"):_.phase==="compressed"?_.restore():_.phase==="restored"?_.unthread():_.phase==="unthreaded"?_.removePaper():_.phase==="done"&&_.extract()&&o(p.id,g,Ze()),d&&k()}Ke("press-mode").addEventListener("change",()=>{if(!d||y!=="press"||!c()){Ke("press-mode").value=Ee;return}Ee=Ke("press-mode").value==="manual"?"manual":"machine",Ke("stage-hint").textContent=p.hint,Ke("manual-press-guide").hidden=!Z(),Ke("handwork-tool").textContent=Z()?"\u624B\u5DE5\u538B\u78E8\u5177 \xB7 \u68C9\u7EBF \xB7 \u6728\u67C4\u9524":"\u542F\u52A8 \u2192 \u5377\u7EBF\u8FDB\u7EB8 \u2192 \u81EA\u52A8\u505C\u673A \u2192 \u53D6\u7EB8",N()}),Ke("handwork-confirm").addEventListener("pointerdown",X=>{!d||!Z()||!c()||_.phase!=="winding"||X.button!==0||(Re=!0,V=X.pointerId,X.currentTarget.setPointerCapture(X.pointerId),X.preventDefault())}),Ke("handwork-confirm").addEventListener("keydown",X=>{d&&Z()&&c()&&_.phase==="winding"&&["Space","Enter"].includes(X.code)&&(X.preventDefault(),Re=!0,V="keyboard")}),Ke("handwork-confirm").addEventListener("keyup",X=>{d&&Z()&&["Space","Enter"].includes(X.code)&&(V=null,Re=!1,X.preventDefault())}),Ke("handwork-confirm").addEventListener("blur",()=>{V=null});function ge(){return Zt(3.55,1.9,-1.96)}function Le(){if(y!=="dye"||G||_.phase==="stock"||_.phase==="lifting")return null;if(_.phase==="dipping")return{key:"bath",label:"\u63D0\u8D77\u7EB8\u5F20",hint:"\u89C2\u5BDF\u4E0B\u6DF1\u4E0A\u6D45\u7684\u6E10\u53D8"};let X=_e(x.position),w=innerWidth<700?42:62,ie=[["bath",n.bathPositions[m?1:0]],["rack",ge()],["bin",S]].map(([$,ye])=>({key:$,d:Math.hypot(_e(ye).x-X.x,_e(ye).y-X.y)})).sort(($,ye)=>$.d-ye.d)[0];return ie.d>w?null:ie.key==="bath"?{...ie,label:_.seconds?"\u7EE7\u7EED\u6D78\u67D3":"\u6D78\u6DA6\u65B9\u7EB8"}:ie.key==="bin"?{...ie,label:"\u4E22\u5F03\u6B64\u7EB8"}:_.ready?{...ie,label:"\u6302\u4E0A\u9634\u5E72\u67B6"}:{...ie,label:"\u6682\u4E0D\u80FD\u6302\u7EB8",blocked:!0,hint:_.simulatedSeconds>120?"\u67D3\u8272\u8FC7\u6DF1\uFF0C\u8BF7\u79FB\u81F3\u5E9F\u6599\u6876":"\u8BF7\u5148\u5B8C\u6210 1\u20142 \u5206\u949F\u6A21\u62DF\u6D78\u67D3"}}function Be(X){H=X.pointerId;let w=e.getWorldDirection(Zt());he=new Ht().setFromNormalAndCoplanarPoint(w,x.position);let q=t.getBoundingClientRect();f.setFromCamera(new Ce((X.clientX-q.left)/q.width*2-1,-(X.clientY-q.top)/q.height*2+1),e),ee=f.ray.intersectPlane(he,Zt()),be=x.position.clone(),X.currentTarget.setPointerCapture?.(X.pointerId)}function R(X){!d||y!=="dye"||!c()||!_.take()||(W="",x.visible=v.visible=!0,x.position.copy(n.paperStock.position).add(Zt(0,.23,0)),X&&Be(X),k())}function b(X){if(H!==X.pointerId||!ee)return;let w=t.getBoundingClientRect();f.setFromCamera(new Ce((X.clientX-w.left)/w.width*2-1,-(X.clientY-w.top)/w.height*2+1),e);let q=f.ray.intersectPlane(he,Zt());q&&(x.position.copy(be).add(q.sub(ee)),W="")}function J(X){H===X.pointerId&&(H=null,_.release(),k())}function ae(){if(!d||y!=="dye"||!c()||H!==null)return;let X=Le();if(X){if(W="",X.blocked){W=X.hint,k();return}X.key==="bath"?(te=x.position.clone(),_.phase==="dipping"?_.liftOut():_.immerse(.8)):X.key==="rack"?(G=.001,H=null):X.key==="bin"&&a()&&(_.reset(),x.visible=v.visible=!1,W="\u5DF2\u4E22\u5F03\u3002\u8BF7\u4ECE\u684C\u9762\u5DE6\u4E0A\u89D2\u53D6\u4E00\u7247\u65B0\u7684\u65B9\u7EB8\u3002"),k()}}u.addEventListener("pointerdown",X=>{if(!(!d||!c()||X.button!==0)){if(Z())if(_.phase==="idle"&&Te(X,x.getWorldPosition(Zt()),60)){let w=xe(X,1.06);if(!w)return;H=X.pointerId,ue=x.getWorldPosition(Zt()).sub(w),u.setPointerCapture(X.pointerId)}else Te(X,Ie.moldTarget(),80)&&(_.phase==="winding"?(V=X.pointerId,u.setPointerCapture(X.pointerId)):["loaded","hammering"].includes(_.phase)&&ce());else if(y==="dye"){if(_.phase==="stock"){Te(X,n.paperStock.position,innerWidth<700?35:52)&&R(X);return}if(G||["dipping","lifting"].includes(_.phase)||!Te(X,x.position,innerWidth<700?55:75))return;Be(X)}else if(y==="cut"){let w=xe(X,1.055);if(!w)return;x.updateMatrixWorld(!0);let q=x.worldToLocal(w.clone());_.down(q)&&(H=X.pointerId,u.setPointerCapture(X.pointerId),C.position.copy(w).add(Zt(0,.028,0)),B()),k()}}}),window.addEventListener("pointermove",X=>{if(!(!d||!c()||H!==X.pointerId)){if(Z()){let w=xe(X,1.06);w&&ue&&x.position.copy(Ie.root.worldToLocal(w.add(ue)))}else if(y==="dye")b(X);else if(y==="cut"){let w=xe(X,1.055);if(w){x.updateMatrixWorld(!0);let q=x.worldToLocal(w.clone());_.move(q),_.onTrack&&(C.position.copy(w).add(Zt(0,.028,0)),B()),k()}}}}),window.addEventListener("pointerup",X=>{if(V===X.pointerId&&(V=null),!(!d||H!==X.pointerId)){if(Z()){ne(),c()&&Te(X,Ie.moldTarget(),85)?(W="",_.place()):W="\u5C06\u7EB8\u5F20\u79FB\u5230\u5DE6\u4FA7\u6A21\u5177\u4E0A\uFF0C\u518D\u677E\u624B\u653E\u6599\u3002",k();return}y==="dye"?J(X):(_.up(),H=null,k())}});function ve(){d&&(ne(),Re=!1,y==="cut"&&_.up(),k())}window.addEventListener("craft-book-open",ve),window.addEventListener("pointercancel",ve),window.addEventListener("blur",ve),document.addEventListener("visibilitychange",()=>{document.hidden&&ve()}),Ke("paper-stock").addEventListener("pointerdown",X=>{X.button===0&&(X.preventDefault(),R())}),Ke("paper-stock").onclick=X=>{X.detail===0&&R()};function fe(){d&&(Ke("stage-hint").textContent=lt(r()).hint,ne(),d=!1,Ke("press-mode-panel").hidden=!0,H=null,G=0,Dt(l),l.visible=!1,Ke("paper-supplies").hidden=!0,Ke("dye-context").hidden=!0,document.body.classList.remove("paper-work","press-work"),n.setPaperFocus(!1),n.sync(r()))}return{open(X,w){fe(),d=!0,p=X,g=w,m=X.id.includes("leaf"),y=X.id.includes("dye")?"dye":X.id.includes("pressing")?"press":"cut",h=Me(),l.visible=!0,n.setPaperFocus(!0),document.body.classList.add("paper-work"),Ke("paper-supplies").hidden=y!=="dye",Ke("dye-context").hidden=y!=="dye",Ke("handwork-title").textContent=X.name,Ke("handwork-subtitle").textContent="\u88C1\u65B9\u7EB8 \u2192 \u6D78\u67D3 \u2192 \u9634\u5E72 \u2192 \u6EDA\u8F74\u538B\u7EB9 \u2192 \u88C1\u82B1\u74E3 / \u53F6\u7247 \xB7 \u7B2C "+(w+1)+" / "+X.total+" \u6279",Ke("handwork-tool").textContent=y==="dye"?"\u65B9\u7EB8\u7D20\u6750\u5E93 \xB7 \u67D3\u76D8 \xB7 \u540E\u65B9\u9634\u5E72\u67B6":y==="press"?"\u542F\u52A8 \u2192 \u5377\u7EBF\u8FDB\u7EB8 \u2192 \u81EA\u52A8\u505C\u673A \u2192 \u53D6\u7EB8":"\u526A\u5200 \xB7 \u6CBF\u8F68\u8FF9\u5DE6\u952E\u7EED\u526A \xB7 \u677E\u624B\u4FDD\u7559\u8FDB\u5EA6",Ke("handwork-rotate-left").hidden=Ke("handwork-rotate-right").hidden=!0,document.body.classList.toggle("press-work",y==="press"),Ke("press-mode-panel").hidden=y!=="press",Ke("press-mode").value=Ee,Ke("manual-press-guide").hidden=!Z(),Z()&&(Ke("handwork-tool").textContent="\u624B\u5DE5\u538B\u78E8\u5177 \xB7 \u68C9\u7EBF \xB7 \u6728\u67C4\u9524"),N(),Ke("handwork-retry").onclick=()=>{y==="cut"&&c()&&N()},Ke("handwork-confirm").onclick=()=>{if(c()){if(Z()){if(Re){Re=!1;return}ce()}else y==="press"?_.phase==="idle"?(_.start(),s.play("petal_pressing")):_.phase==="done"&&o(p.id,g,Ze()):y==="cut"&&_.ready?o(p.id,g,Ze()):y==="dye"&&ae();d&&k()}}},close:fe,interact:ae,get active(){return d},update(X){if(!(!d||!c())){if(y==="dye"){if(_.tick(X),_.phase==="dipping"){let w=n.bathPositions[m?1:0];x.position.lerp(Zt(w.x,w.y+.2-.4*_.depth,w.z+.025),Math.min(1,X*7))}if(zo(x.geometry,{leaf:m,dose:_.dose,depth:_.maxDepth}),_.phase==="lifting"){let w=n.bathPositions[m?1:0];x.position.lerpVectors(te,Zt(te.x,1.8,te.z),_.lift*_.lift*(3-2*_.lift))}if(G){G=Math.min(1,G+X/1);let w=n.rackPositions[(m?6:0)+g];if(x.position.lerp(w,Math.min(1,X*7)),G===1){o(p.id,g,Ze());return}}v.visible=x.visible&&!G,v.position.copy(x.position),Gn(v,x.position.clone().add(Zt(.15,.18,0))),_.phase==="dipping"&&B()}else if(Z())V!==null&&_.phase==="winding"&&(_.wind(X/3.8),B()),_.phase!=="winding"&&(V=null),_.tick(X),Ie.update(_);else if(y==="press"){_.tick(X);let w=_.progress;if(M.update(w,_.rotation),_.phase==="running"){let q=Ot(w/.22);x.position.set(Xt.lerp(4.05,3.08,q),1.32,Xt.lerp(1.76,1.68,q));let ie=x.geometry.attributes.position,$=Ot((w-.22)/.66);for(let ye=0;ye<ie.count;ye++){let Pe=F[ye*3],Se=F[ye*3+1],P=Se+$*.84,se=P,L=0;if(P>.26){let oe=(P-.26)/.15;se=.26+Math.sin(oe)*.15,L=(1-Math.cos(oe))*.15}ie.setXYZ(ye,Pe,se,L)}ie.needsUpdate=!0,x.geometry.computeVertexNormals(),x.geometry.computeBoundingSphere(),x.visible=w<.9,B()}else _.phase==="done"&&(x.visible=!0,x.position.set(4.05,1.045,1.76),x.geometry.attributes.position.array.set(F),x.geometry.attributes.position.needsUpdate=!0,x.geometry.computeVertexNormals(),x.geometry.computeBoundingSphere(),U.visible=!0)}else{let w=_.points[Math.min(_.next,_.points.length-1)];if(E.position.set(w.x,w.y,.009),T.material.color.set(_.failed?"#b33128":_.ready?"#4c7248":"#624a33"),_.ready&&x.userData.cut!==!0){let q=p.id==="paper_cutting"?Vn({dose:0},"square",.62):Vn(h,m?"leaf":"petal");x.geometry.dispose(),x.geometry=q.geometry,q.material.dispose(),x.userData.cut=!0}}if(y==="cut"&&C){C.userData.setOpening(_.dragging&&_.onTrack?.5+.45*Math.sin(performance.now()*.026):.6);let w=Math.min(_.next,_.points.length-1),q=_.points[Math.max(0,w-1)],ie=_.points[w];C.rotation.z=-Math.atan2(ie.x-q.x,ie.y-q.y)}k()}},snapshot(){return{pressMode:y==="press"?Ee:null,manualTarget:Ie?_e(Ie.moldTarget()):null,winding:_?.winding,adherence:_?.adherence,hits:_?.hits,compression:_?.compression,strike:_?.strike,mode:Z()?"manual-press":y==="cut"?"paper-cut":y==="press"?"roller-press":"paper-dye",stage:p?.id,phase:_?.phase,seconds:_?.seconds,simulatedSeconds:_?.simulatedSeconds,context:y==="dye"?Le()?.key:null,stockTarget:y==="dye"?_e(n.paperStock.position):null,rack:y==="dye"?_e(ge()):null,ready:y==="press"?_?.phase==="done":_?.ready,failed:_?.failed,next:_?.next,dose:_?.dose,depth:_?.depth,progress:_?.progress,rotation:_?.rotation,dragging:H!==null,stock:y==="dye"&&_.phase==="stock",waste:r().dyeWaste,profile:h,shape:y==="cut"&&_.ready&&p.id!=="paper_cutting"?m?"leaf":"petal":"square",paper:x?_e(x.getWorldPosition(Zt())):null,paperPosition:x?.getWorldPosition(Zt()).toArray(),bath:y==="dye"?_e(n.bathPositions[m?1:0]):null,bin:S?_e(S):null,outline:y==="cut"?_.points.map(X=>_e(x.localToWorld(Zt(X.x,X.y,0)))):[]}}}}var Qe=i=>document.getElementById(i),fi=(i=0,e=0,t=0)=>new O(i,e,t),Vx=Math.PI*2;function Zf({scene:i,camera:e,canvas:t,lantern:n,audio:s,getState:r,onGlue:o,onSoak:a,onTrim:c,onComplete:l,canInteract:u}){let f=new We,d=new We,p=new We;i.add(f,d),n.root.add(p),p.name="workbench-glue-marks";let g=Qe("handwork-surface"),y=new Ln,m=document.createElement("span");m.id="decoration-drop-prompt",m.hidden=!0,m.setAttribute("role","status"),document.body.append(m);let h=!1,_,x=0,v=0,T="brush",E=null,C=null,U=null,M=null,S=null,D=null,H=null,G=null,F=!1,W=null,K=0,he="",ee=new We;n.root.add(ee),ee.name="lining-rotation-pick-shells";for(let I of["lining_upper","lining_lower"])for(let z=1;z<=6;z++){let Y=n.registry.get(I+"-"+z),Ae=new Ue(Y.geometry,new Ft({side:pt,visible:!1}));ee.add(Ae)}let be=[],te=()=>_c.includes(_?.id),Ee=()=>_.id==="petal_assembly"?"\u82B1\u74E3":_.id==="calyx_assembly"?"\u53F6\u6258":_.id==="lotus_leaf_assembly"?"\u8377\u53F6":_.id==="lining_upper"?"\u7EA2\u7EB8\u7CCA":"\u767D\u8272\u5E95\u7EB8",Ie=()=>te()?(_.id==="petal_assembly"?"\u7B2C "+(Math.floor(x/dt.petals.perLayer)+1)+" \u5C42 \xB7 ":"")+"\u7B2C "+(x+1)+" "+_.unit+Ee():"\u7B2C "+(v+1)+" \u5E45",V=()=>te()?{glued:be,installed:Array.from({length:r().counts[_.id]},(I,z)=>z)}:r().lining[_.id];function ue(I,z){I.traverse(Y=>{Y.material&&(Array.isArray(Y.material)?Y.material:[Y.material]).forEach(z)})}function Re(I,z,Y){ue(I,Ae=>{Ae.color.set(z),Object.assign(Ae,{transparent:!0,opacity:Y,side:pt,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})})}function Z(I){return It.findIndex(z=>z.id===I)}function re(I){return te()?!0:a(_.id,I)}function _e(I){return te()?(be.includes(I)||be.push(I),!0):o(_.id,I)}let xe=()=>!!W||!u();function Te(){let I=Math.atan2(e.position.x-n.root.position.x,e.position.z-n.root.position.z);if(!te())return lh(v,n.root.rotation.y,I);let z=n.root.worldToLocal(ne());return ch(Math.atan2(z.x,z.z),n.root.rotation.y,I)}function ze(){return Te().aligned?!0:(ce("\u65B9\u4F4D\u672A\u5BF9\u51C6\uFF1A\u8BF7\u6309\u4F4F\u706F\u4F53\u5DE6\u53F3\u65CB\u8F6C\uFF0C\u5C06"+Ie()+(te()?"\u8F6C\u5411\u81EA\u5DF1\u540E\u518D\u62D6\u5165\u6750\u6599\u3002":"\u8F6C\u5411\u81EA\u5DF1\u540E\u518D\u70B9\u51FB\u3002")),s.play("blocked"),!1)}function Ze(){for(let I of[H?.id,G?.id])if(I!==void 0)for(let z of[g,Qe("lining-paper")])z.hasPointerCapture?.(I)&&z.releasePointerCapture(I);H=null,G=null}function B(){if(!h)return;Me();let I=Te(),z=Qe("lining-facing");z.dataset.aligned=String(I.aligned);let Y=I.aligned?Ie()+(te()?" \xB7 \u671D\u5411\u5408\u683C\uFF0C\u62D6\u5165\u6750\u6599\u540E\u677E\u624B\u7C98\u8D34":" \xB7 \u671D\u5411\u5408\u683C\uFF0C\u53EF\u4EE5\u70B9\u51FB\u52A0\u5DE5"):Ie()+" \xB7 "+(I.error<0?"\u5411\u5DE6":"\u5411\u53F3")+"\u62D6\u52A8\u706F\u4F53\u7EA6 "+Math.round(I.degrees)+"\xB0";z.textContent!==Y&&(z.textContent=Y),Qe("handwork-confirm").disabled=!F||xe()||!I.aligned}function Me(){if(m.hidden=!h||!te()||T!=="paper"||!E,m.hidden)return;let I=N(E),z=Te().aligned,Y=!!H?.over&&z;m.style.left=Math.max(95,Math.min(innerWidth-95,I.x))+"px",m.style.top=Math.max(80,Math.min(innerHeight-70,I.y+42))+"px",m.dataset.ready=String(Y);let Ae=W?"\u6B63\u5728\u4E0A\u6D46\u8D34\u5408\u2026":z?Y?"\u677E\u5F00\u5DE6\u952E \xB7 \u81EA\u52A8\u8D34\u5408":"\u62D6\u5230\u6B64\u5904\uFF0C\u677E\u624B\u7C98\u8D34":"\u5148\u8F6C\u52A8\u706F\u4F53\uFF0C\u5C06\u76EE\u6807\u8F6C\u5411\u81EA\u5DF1";m.textContent!==Ae&&(m.textContent=Ae)}function N(I){let z=t.getBoundingClientRect(),Y=I.clone().project(e);return{x:z.left+(Y.x+1)*z.width/2,y:z.top+(1-Y.y)*z.height/2}}function k(){return te()?[...n.registry.values()].find(I=>I.userData.workflowStage===_.id&&I.userData.order===x):n.registry.get(_.id+"-"+(v+1))}function ne(){let I=k();if(I.updateWorldMatrix(!0,!0),te()&&!I.geometry){let Y=new zt,Ae=I.matrixWorld.clone().invert();return I.traverse(Ve=>{Ve.geometry&&(Ve.geometry.computeBoundingBox(),Y.union(Ve.geometry.boundingBox.clone().applyMatrix4(Ae.clone().multiply(Ve.matrixWorld))))}),I.localToWorld(Y.getCenter(fi()))}let z=I.geometry;return z.computeBoundingBox(),I.localToWorld(z.boundingBox.getCenter(fi()))}function me(I,z=!1){let Y=Ii(I,z);return I.updateWorldMatrix(!0,!1),I.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y}function ce(I){he=I,Qe("handwork-status").textContent=I,Qe("handwork-status").dataset.ready=String(F)}function ge(){if(Qe("lining-brush").classList.toggle("selected",T==="brush"),Qe("lining-paper").classList.toggle("selected",T==="paper"),Qe("lining-soak").hidden=te(),Qe("lining-trim").hidden=te()||_.id!=="lining_lower",Qe("lining-soak").disabled=!!W||V().soaked.includes(v),Qe("lining-trim").disabled=!!W||!V().installed.includes(v)||V().trimmed.includes(v),Qe("lining-brush").setAttribute("aria-pressed",String(T==="brush")),Qe("lining-paper").setAttribute("aria-pressed",String(T==="paper")),document.querySelector(".lining-inventory-caption").textContent="1 \u80F6\u5237 \xB7 2 "+Ee()+(te()?" \xB7 \u5BF9\u51C6\u677E\u624B\u7C98\u8D34":" \xB7 \u62D6\u5165\u540E\u786E\u8BA4"),Qe("lining-paper-name").textContent=Ee(),Qe("lining-paper-count").textContent=_.total-V().installed.length,Qe("lining-paper").classList.toggle("white-paper",_.id==="lining_lower"),Qe("lining-paper").classList.toggle("decoration-paper",te()),Qe("lining-paper").classList.toggle("leaf-paper",["calyx_assembly","lotus_leaf_assembly"].includes(_.id)),!te())for(let I=0;I<6;I++){let z=Qe("lining-panel-"+I),Y=V().installed.includes(I),Ae=_.id==="lining_lower"&&Y&&!V().trimmed.includes(I),Ve=V().glued.includes(I);z.classList.toggle("current",v===I),z.classList.toggle("glued",Ve),z.disabled=Y&&!Ae||!!W,z.textContent=I+1+" \xB7 "+(Ae?"\u5F85\u88C1\u8FB9":Y?"\u5DF2\u5B8C\u6210":Ve?"\u5DF2\u6D82":"\u5F85\u6D82"),z.setAttribute("aria-pressed",String(v===I))}Qe("handwork-confirm").disabled=!F||xe()||!Te().aligned,Qe("handwork-retry").disabled=!!W}function Le(){if(Dt(d),d.visible=!0,M=S=D=null,T==="brush"){S=new We,d.add(S);let I=new Ue(new gt(.013,.018,.24,10),new ke({color:"#997947",roughness:.85}));S.add(I);let z=new Ue(new bt(.065,.045,.022),new ke({color:"#8f9180",metalness:.3,roughness:.5}));z.position.y=.135,S.add(z);let Y=new Ue(new bt(.067,.055,.025),new ke({color:"#e7dec0",roughness:1}));Y.position.y=.18,S.add(Y),S.rotation.z=-.6,D=Fn(S,!1,"brush"),D.scale.setScalar(.7),D.rotation.x=-Math.PI/2,D.rotation.y=-.18,Gn(D,fi(0,-.025,0))}else{if(M=new Ue(new nn(.32,.39,8,8),new ke({color:_.id==="lining_upper"?"#a23046":"#f0e8d4",side:pt,transparent:!0,opacity:.8,roughness:.9})),te()){M.geometry.dispose(),M.material.dispose(),M=Ii(k()),M.position.set(0,0,0),M.quaternion.identity(),M.scale.setScalar(1);let I=new zt().setFromObject(M).getCenter(fi());M.position.sub(I),M.scale.setScalar(.5),M.position.multiplyScalar(.5)}d.add(M),te()||(M.rotation.x=-.55,M.rotation.z=-.2),D=Fn(d,!0,"pinch"),D.scale.setScalar(.65),D.rotation.y=-.5,M.updateMatrix(),Gn(D,fi(-.14,-.12,0).applyMatrix4(M.matrix))}d.position.set(innerWidth<700?-.34:-.72,1.3,.76)}function Be(){Dt(p),n.root.updateMatrixWorld(!0);for(let I of V().glued){if(V().installed.includes(I))continue;let z=te()?k():n.registry.get(_.id+"-"+(I+1)),Y=Ii(z,!0);z.updateWorldMatrix(!0,!1),new at().copy(n.root.matrixWorld).invert().multiply(z.matrixWorld).decompose(Y.position,Y.quaternion,Y.scale),Re(Y,"#dce8bd",.26),Y.userData.gluePanel=I,p.add(Y)}}function R(){Be(),Dt(f),C=U=null,E=null,!V().installed.includes(v)&&(n.root.updateMatrixWorld(!0),C=me(k(),!0),Re(C,V().glued.includes(v)?"#dce8bd":"#bcc67f",V().glued.includes(v)?.12:.14),f.add(C),E=ne(),U=new Ue(new In(.031,12,8),new Ft({color:V().glued.includes(v)?"#e6f2cc":"#e7d6a0",depthTest:!1})),U.position.copy(E),U.renderOrder=20,f.add(U))}function b(I,z=!1){let Y=_?.id==="lining_lower"&&V().installed.includes(I)&&!V().trimmed.includes(I);!h||W||!z&&!u()||V().installed.includes(I)&&!Y||(Ze(),F=!1,v=I,K=n.root.rotation.y,R(),Le(),ge(),B(),ce(Y?"\u767D\u5E03\u5DF2\u8D34\u5408\uFF0C\u8BF7\u70B9\u51FB\u201C\u88C1\u8FB9\u201D\u4FEE\u53BB\u8FD9\u9762\u7684\u591A\u4F59\u8FB9\u7F18\u3002":te()||V().glued.includes(I)?J():"\u9009\u80F6\u5237\uFF0C\u70B9\u51FB\u706F\u4F53\u4E0A\u9AD8\u4EAE\u7684\u4E00\u5E45\uFF0C\u5148\u6D82\u6D46\u7CCA\u3002"))}function J(){return te()?"\u62D6\u52A8\u624B\u4E2D\u6216\u4E0B\u65B9\u7269\u54C1\u680F\u7684\u6750\u6599\uFF0C\u5BF9\u51C6\u9AD8\u4EAE\u4F4D\u7F6E\u540E\u677E\u5F00\u5DE6\u952E\uFF0C\u81EA\u52A8\u4E0A\u6D46\u5E76\u7C98\u8D34\u3002":"\u5C06\u7EB8\u6599\u62D6\u5230\u5DF2\u4E0A\u80F6\u7684\u4EAE\u70B9\uFF0C\u677E\u624B\u5B9A\u4F4D\u540E\u70B9\u51FB\u300C\u786E\u8BA4\u7C98\u8D34\u300D\u3002"}function ae(I){!h||W||!u()||(Ze(),F=!1,T=I,R(),Le(),ge(),s.play("tool"),ce(I==="brush"?"\u80F6\u5237\u5728\u624B\uFF1A\u70B9\u51FB\u9AD8\u4EAE\u706F\u9762\u6D82\u6D46\u7CCA\u3002":J()))}function ve(){return M?(d.updateWorldMatrix(!0,!0),N(new zt().setFromObject(M).getCenter(fi()))):null}function fe(I){let z=t.getBoundingClientRect();y.setFromCamera(new Ce((I.clientX-z.left)/z.width*2-1,-(I.clientY-z.top)/z.height*2+1),e)}function X(I){if(!E)return!1;if(fe(I),C&&y.intersectObject(C).length)return!0;let z=N(E);return Math.hypot(I.clientX-z.x,I.clientY-z.y)<(I.pointerType==="touch"?48:34)}function w(){if(ze()){if(!te()&&!V().soaked.includes(v)){ce("\u5148\u70B9\u51FB\u201C\u8638\u6D46\u201D\uFF0C\u518D\u7528\u80F6\u5237\u3002");return}if(V().glued.includes(v)){ce("\u8FD9\u4E2A\u4F4D\u7F6E\u5DF2\u6D82\u597D\u6D46\u7CCA\uFF0C\u53EF\u4EE5\u5207\u6362\u7EB8\u6599\u3002");return}W={type:"glue",time:0,panel:v},s.play("lining_lower"),ge(),ce("\u80F6\u5237\u8F7B\u626B\u9AA8\u67B6\uFF0C\u94FA\u5F00\u4E00\u5C42\u6D46\u7CCA\u2026")}}function q(I){!h||xe()||T!=="paper"||F||(H={id:I.pointerId},I.preventDefault(),I.currentTarget.setPointerCapture?.(I.pointerId),ie(I))}function ie(I){if(!H||H.id!==I.pointerId)return;fe(I);let z=y.ray.intersectPlane(new Ht().setFromNormalAndCoplanarPoint(e.getWorldDirection(fi()),E),fi());z&&d.position.copy(z),H.over=X(I),U&&U.material.color.set(H.over&&Te().aligned?te()||V().glued.includes(v)?"#88c68c":"#d58b6a":"#e7d6a0"),Me()}function $(){if(Dt(d),M=me(k()),d.add(M),d.position.set(0,0,0),ue(M,z=>{z.transparent=!0,z.opacity=.58}),te()){M.userData.finalPosition=M.position.clone(),ye(0),U.visible=!1;return}let I=M.geometry.attributes.position;M.userData.finalPositions=I.array.slice(),ye(0),U.visible=!1}function ye(I){if(te()&&M?.userData.finalPosition){let nt=E.clone().sub(n.root.position);nt.y=0,nt.normalize(),M.position.copy(M.userData.finalPosition).addScaledVector(nt,(1-I)*.16),M.position.y+=(1-I)*.045,ue(M,yn=>yn.opacity=.58+I*.42);return}if(!M?.userData.finalPositions)return;let z=M.geometry.attributes.position,Y=M.userData.finalPositions,Ae=(v+.5)*Vx/6,Ve=Math.sin(Ae),mt=Math.cos(Ae);for(let nt=0;nt<z.count;nt++){let yn=Y[nt*3],Bn=Y[nt*3+1],Pr=Y[nt*3+2],gi=yn*Ve+Pr*mt,Cs=(1-I)*(.17+.45*(.92-gi));z.setXYZ(nt,yn+Ve*Cs,Bn+(1-I)*.04,Pr+mt*Cs)}z.needsUpdate=!0,M.geometry.computeVertexNormals(),M.geometry.computeBoundingSphere(),M.material.opacity=.58+I*.2}function Pe(I){if(!(!H||H.id!==I.pointerId||I.button!==0)){if(Ze(),xe()){Le();return}if(!ze()){Le();return}if(!X(I)){Le(),ce("\u7EB8\u6599\u5C1A\u672A\u5BF9\u9F50\u3002\u8BF7\u62D6\u5230\u706F\u9762\u4E0A\u7684\u9AD8\u4EAE\u70B9\u3002");return}if(te()&&!V().glued.includes(v)&&(_e(v),Be()),!V().glued.includes(v)){s.play("blocked"),Le(),ce("\u9700\u8981\u5148\u6D82\u62B9\u6D46\u7CCA");return}if(F=!0,$(),ge(),te()){Se();return}ce("\u7EB8\u6599\u5DF2\u5BF9\u9F50\uFF0C\u5C1A\u672A\u6D88\u8017\u3002\u70B9\u51FB\u300C\u786E\u8BA4\u7C98\u8D34\u300D\u8BA9\u7EB8\u9762\u8D34\u5408\u9AA8\u67B6\u3002")}}function Se(){!h||xe()||!F||!V().glued.includes(v)||!ze()||(F=!1,W={type:"paper",time:0,panel:v},s.play(_.id),ge(),ce(te()?"\u81EA\u52A8\u4E0A\u6D46\uFF0C\u6B63\u5728\u8D34\u5408"+Ee()+"\u2026":"\u7EB8\u6599\u6B63\u5728\u6CBF\u5F27\u9AA8\u8D34\u5408\uFF0C\u8F7B\u8F7B\u629A\u5E73\u8FB9\u7F18\u2026"))}function P(){h&&(Ze(),F=!1,W=null,R(),Le(),ge(),ce("\u672C\u6B21\u672A\u5B8C\u6210\u64CD\u4F5C\u5DF2\u6536\u56DE\uFF1B\u5DF2\u6D82\u6D46\u7CCA\u548C\u5DF2\u8D34\u7EB8\u9762\u4FDD\u7559\u3002"))}function se(I){if(fe(I),n.root.updateMatrixWorld(!0),te()){if(X(I))return!0;let z=[];if(n.root.traverseVisible(Y=>{Y.isMesh&&z.push(Y)}),y.intersectObjects(z,!1).length)return!0}return y.intersectObject(ee,!0).length>0}function L(){n.root.rotation.y=K,n.root.updateMatrixWorld(!0),C&&(k().updateWorldMatrix(!0,!1),k().matrixWorld.decompose(C.position,C.quaternion,C.scale),E=ne(),U?.position.copy(E)),B()}g.addEventListener("pointerdown",I=>{if(!(!h||I.button!==0||xe()||H||G)){if(T==="paper"&&!F&&M&&(d.updateWorldMatrix(!0,!0),fe(I),y.intersectObject(M,!0).length||y.ray.intersectsBox(new zt().setFromObject(M)))){q(I);return}se(I)&&(G={id:I.pointerId,x:I.clientX,y:I.clientY,angle:n.root.rotation.y,moved:!1},g.setPointerCapture(I.pointerId),I.preventDefault())}}),window.addEventListener("pointermove",I=>{if(!(!h||xe()))if(G?.id===I.pointerId){let z=G,Y=I.clientX-z.x;Math.hypot(Y,I.clientY-z.y)>6&&(z.moved=!0),z.moved&&(F&&(F=!1,Le(),U&&(U.visible=!0),ge()),K=z.angle+Y*gc,L(),ce("\u6B63\u5728\u8F6C\u52A8\u706F\u4F53 \xB7 \u677E\u624B\u540E\u518D\u70B9\u51FB\u52A0\u5DE5\uFF1B\u62D6\u52A8\u672C\u8EAB\u4E0D\u4F1A\u6D82\u80F6\u6216\u8D34\u7EB8\u3002"))}else ie(I)}),window.addEventListener("pointerup",I=>{if(h)if(G?.id===I.pointerId){let z=G;if(Ze(),xe())return;if(z.moved){B(),ce(Te().aligned?te()?"\u76EE\u6807\u5DF2\u8F6C\u6B63\uFF0C\u62D6\u5165\u6750\u6599\u540E\u677E\u624B\uFF0C\u81EA\u52A8\u4E0A\u6D46\u8D34\u5408\u3002":"\u5F53\u524D\u706F\u9762\u5DF2\u8F6C\u6B63\u3002\u70B9\u51FB\u9AD8\u4EAE\u9762\u6D82\u80F6\uFF0C\u6216\u4ECE\u7269\u54C1\u680F\u62D6\u5165\u7EB8\u6599\u3002":"\u8BF7\u7EE7\u7EED\u65CB\u8F6C\uFF0C\u5C06\u9AD8\u4EAE\u4F4D\u7F6E\u8F6C\u5411\u81EA\u5DF1\u3002");return}if(!ze())return;X(I)?T==="brush"?w():F?Se():ce(te()?"\u62D6\u52A8\u624B\u4E2D\u6750\u6599\u6216\u4ECE\u7269\u54C1\u680F\u62D6\u51FA\u6750\u6599\uFF0C\u653E\u5230\u4EAE\u70B9\u540E\u677E\u624B\u7C98\u8D34\u3002":"\u8BF7\u4ECE\u7269\u54C1\u680F\u62D6\u51FA\u7EB8\u6599\uFF0C\u653E\u5230\u5DF2\u7ECF\u6D82\u80F6\u7684\u706F\u9762\u4EAE\u70B9\u3002"):ce("\u8BF7\u70B9\u51FB"+Ie()+"\u7684\u9AD8\u4EAE\u4F4D\u7F6E\u3002")}else Pe(I)}),window.addEventListener("craft-book-open",P),window.addEventListener("pointercancel",P),window.addEventListener("blur",P),document.addEventListener("visibilitychange",()=>{document.hidden&&P()}),Qe("lining-soak").onclick=()=>{if(!(!h||te()||xe())){if(!re(v)){ce("\u8FD9\u4E2A\u4F4D\u7F6E\u5DF2\u7ECF\u8638\u8FC7\u6D46\uFF0C\u7EE7\u7EED\u5237\u80F6\u5373\u53EF\u3002");return}s.play("lining_lower"),ge(),ce("\u8638\u6D46\u5B8C\u6210\u3002\u53D6\u80F6\u5237\uFF0C\u5728\u540C\u4E00\u9762\u5747\u5300\u5237\u80F6\u3002"),ae("brush")}},Qe("lining-trim").onclick=()=>{if(!h||te()||xe()||_.id!=="lining_lower")return;let I=c(_.id,v);if(!I){ce("\u8BF7\u5148\u8D34\u597D\u767D\u5E03\uFF0C\u518D\u88C1\u8FB9\u3002");return}if(s.play("tool"),I==="next"||I==="done")return;let z=Array.from({length:_.total},(Y,Ae)=>Ae).find(Y=>!V().trimmed.includes(Y));z!==void 0&&b(z,!0),ge(),ce(z===void 0?"\u767D\u5E03\u516D\u9762\u5DF2\u5168\u90E8\u88C1\u8FB9\u3002":"\u88C1\u8FB9\u5B8C\u6210\u3002\u7EE7\u7EED\u5904\u7406\u4E0B\u4E00\u9762\uFF1A\u5148\u8638\u6D46\uFF0C\u518D\u5237\u80F6\u3002")},Qe("lining-brush").onclick=()=>ae("brush"),Qe("lining-paper").addEventListener("pointerdown",I=>{I.button===0&&(ae("paper"),q(I))}),Qe("lining-paper").onclick=I=>{I.detail===0&&ae("paper")};for(let I=0;I<6;I++)Qe("lining-panel-"+I).onclick=()=>b(I);function oe(I,z){h=!0,_=I,x=z,be=[],T=te()?"paper":"brush",F=!1,W=null,H=null,G=null,K=n.root.rotation.y,f.visible=!0,n.groups.DebugMarkers.visible=!1,document.body.classList.add("lining-work"),Qe("lining-panels").hidden=te(),Qe("lining-facing").hidden=!1,Qe("handwork-title").textContent=te()?I.name+" \xB7 "+(z+1)+" / "+I.total:I.id==="lining_upper"?"\u5148\u4E0A\u6D46\uFF0C\u518D\u88F1\u4E00\u5E45\u7EA2\u7EB8":"\u8584\u65BD\u6D46\u7CCA\uFF0C\u767D\u7EB8\u6253\u5E95",Qe("handwork-subtitle").textContent=te()?"\u5408\u706F\u53F0 \xB7 \u5165\u5EA7\u5E73\u89C6 \xB7 \u62D6\u52A8\u706F\u4F53\u8F6C\u6B63 / \u62D6\u5165\u6750\u6599\u540E\u677E\u624B\u7C98\u8D34":"\u5408\u706F\u53F0 \xB7 \u5165\u5EA7\u5E73\u89C6 \xB7 \u5DE6\u952E\u62D6\u52A8\u706F\u4F53\u65CB\u8F6C / \u677E\u624B\u540E\u70B9\u51FB\u52A0\u5DE5",Qe("handwork-tool").textContent=te()?"\u8F6C\u6B63\u76EE\u6807\u4F4D\u7F6E \u2192 \u62D6\u5165"+Ee()+" \u2192 \u677E\u5F00\u5DE6\u952E\uFF0C\u81EA\u52A8\u4E0A\u6D46\u8D34\u5408":"\u88F1\u7CCA\u987A\u5E8F\uFF1A\u8638\u6D46 \u2192 \u5237\u80F6 \u2192 \u8D34"+(I.id==="lining_lower"?"\u767D\u5E03":"\u7EA2\u8272\u5185\u886C")+(I.id==="lining_lower"?" \u2192 \u88C1\u8FB9":""),Qe("handwork-confirm").textContent=te()?"\u786E\u8BA4\u7C98\u8D34 \xB7 \u8D34\u5408"+Ee():"\u786E\u8BA4\u7C98\u8D34 \xB7 \u8D34\u5408\u7EB8\u9762",Qe("handwork-confirm").hidden=te(),Qe("handwork-retry").textContent="\u6536\u56DE\u7EB8\u6599",Qe("handwork-retry").hidden=!1,Qe("handwork-rotate-left").hidden=Qe("handwork-rotate-right").hidden=!0,Qe("handwork-confirm").onclick=Se,Qe("handwork-retry").onclick=P;let Y=Array.from({length:6},(Ae,Ve)=>Ve).find(Ae=>!V().installed.includes(Ae)||_.id==="lining_lower"&&!V().trimmed.includes(Ae))??0;ge(),b(te()?x:Y,!0),!te()&&V().installed.includes(v)&&ce("\u767D\u5E03\u5DF2\u8D34\u5408\uFF0C\u8BF7\u70B9\u51FB\u201C\u88C1\u8FB9\u201D\u4FEE\u53BB\u591A\u4F59\u8FB9\u7F18\u3002")}function le(){h&&(Ze(),h=!1,m.hidden=!0,H=null,F=!1,W=null,Dt(f),Dt(d),Dt(p),C=U=M=S=D=null,E=null,f.visible=d.visible=!1,document.body.classList.remove("lining-work"),Qe("lining-panels").hidden=!0,Qe("lining-facing").hidden=!0,n.groups.DebugMarkers.visible=!0)}return{open:oe,close:le,selectTool:ae,get active(){return h},update(I){if(!h||(B(),!W))return;let z=W;z.time+=I;let Y=Math.min(1,z.time/(z.type==="glue"?.85:.95));z.type==="glue"?(d.position.copy(E).add(fi(Math.sin(Y*Math.PI*4)*.13,-.12+Math.sin(Y*Math.PI)*.06,.1)),C&&Re(C,"#dce8bd",.14+Y*.24),S.rotation.z=-.6+Math.sin(Y*Math.PI*4)*.3,Y===1&&(W=null,_e(z.panel)&&(s.play("tool"),R(),Le(),ge(),ce(te()?"\u6D46\u7CCA\u5DF2\u6D82\u597D\u3002\u4ECE\u4E0B\u65B9\u7269\u54C1\u680F\u62D6\u5165"+Ee()+"\uFF0C\u6216\u62D6\u52A8\u624B\u4E2D\u6750\u6599\uFF1B\u5BF9\u51C6\u4EAE\u70B9\uFF0C\u677E\u5F00\u5DE6\u952E\u76F4\u63A5\u7C98\u8D34\u3002":"\u6D46\u7CCA\u5DF2\u6D82\u597D\u3002\u53EF\u9009\u4E0B\u4E00\u5E45\u7EE7\u7EED\u6D82\u80F6\uFF0C\u6216\u6309 2 \u53D6\u7EB8\u7C98\u8D34\u3002")))):(ye(Y),Y===1&&(W=null,l(_.id,x,{mode:te()?"place":"paper",panel:z.panel,quality:1,curve:0,oval:0,dose:1,angle:0,distance:1})?te()||(ge(),ce(_.id==="lining_lower"?"\u767D\u5E03\u8D34\u5408\u5B8C\u6210\u3002\u70B9\u51FB\u201C\u88C1\u8FB9\u201D\u4FEE\u53BB\u8FB9\u7F18\u591A\u4F59\u90E8\u5206\u3002":"\u7EA2\u8272\u5185\u886C\u8D34\u5408\u5B8C\u6210\u3002"),_.id==="lining_upper"&&r().stage!==Z(_.id)&&le()):(F=!0,ge(),ce("\u7EB8\u6599\u5C1A\u672A\u63D0\u4EA4\uFF0C\u8BF7\u68C0\u67E5\u8BE5\u4F4D\u7F6E\u662F\u5426\u5DF2\u4E0A\u80F6\u3002"))))},snapshot(){return{mode:te()?"decoration":"lining",stage:_?.id,panel:v,tool:T,heldTarget:ve(),target:E?N(E):null,ready:F,dragging:!!H,pending:F,animation:W?.type??null,turning:!!G?.moved,rotation:n.root.rotation.y,orientation:Te(),rotationSpeed:gc,rotationTarget:N(n.root.localToWorld(fi(0,.68,0))),glueMarks:p.children.map(I=>I.userData.gluePanel),glued:h?[...V().glued]:[],installed:h?[...V().installed]:[]}}}}var Gx=Object.freeze({bamboo_prep:"bend",frame_assembly:"place",frame_short_binding:"bind",lining_upper:"trace",lining_lower:"trace",paper_dye:"dye",petal_pressing:"press",petal_shaping:"shape",petal_assembly:"place",calyx_assembly:"place",top_flower_assembly:"place",candle_installation:"place",final_inspection:"inspect"}),ji=["top_flower_assembly","candle_installation"],Wx=[],Wo=i=>ji.includes(i)||Wx.includes(i),Go=(i,e=0,t=1)=>Math.max(e,Math.min(t,i)),Ki=(i,e)=>Math.hypot(i.x-e.x,i.y-e.y),Qi={x:-1.75,y:-.35},Tt={x:.65,y:.2},gn={x:-.9,y:-.85};function Xx(i){return i==="bind"?Array.from({length:49},(e,t)=>({x:Math.sin(t/48*Math.PI*4)*.64,y:Math.cos(t/48*Math.PI*4)*.64})):i==="inspect"?[{x:-.8,y:.65},{x:.75,y:.6},{x:.85,y:-.55},{x:-.8,y:-.55}]:Array.from({length:25},(e,t)=>({x:-1.35+t/24*2.7,y:.38*Math.sin(t/24*Math.PI*2)}))}var hc=class{constructor(e){if(this.stage=e,this.mode=Gx[e],!this.mode)throw new Error("No handwork for "+e);this.reset()}reset(){this.position={...Qi},this.angle=-.4,this.curve=0,this.oval=0,this.pinned=!1,this.dragging=!1,this.distance=0,this.contact=0,this.dose=0,this.placed=!1,this.ready=!1,this.visited=new Set,this.previous=null,this.next=0,this.issue="",this.points=Xx(this.mode),this.fixed=!1,this.formed=!1,this.edgePinched=!1,this.wireFixed=!1,this.pendingShape=!1,this.inspectIndex=-1}get shapePhase(){return this.formed?this.edgePinched?this.wireFixed?"complete":"wire":"pinch":"form"}get grip(){return this.mode==="bend"?{x:2.2-3.1*this.curve,y:-.85+this.oval*2}:this.mode==="shape"?{x:.15+this.curve*1.5,y:.55}:this.position}down(e){if(this.issue="",this.mode==="bend"&&!this.pinned)return Ki(e,gn)<.28?(this.pinned=!0,!0):(this.issue="\u5148\u6309\u4F4F\u7AF9\u7BFE\u5DE6\u7AEF\uFF0C\u628A\u5B83\u56FA\u5B9A\u5728\u6728\u9489\u65C1\u3002",!1);if(["bend","shape","place","dye","press"].includes(this.mode)){let n=this.placed?Tt:this.grip;if(Ki(e,n)>(this.mode==="shape"?.45:.38))return this.issue=this.placed?"\u8BF7\u6309\u4F4F\u6750\u6599\u4E0E\u5DE5\u5177\u63A5\u89E6\u5904\u3002":"\u8BF7\u6293\u4F4F\u6750\u6599\u4E0A\u7684\u5C0F\u5706\u70B9\u3002",!1}return this.dragging=!0,this.previous={...e},this.pendingShape=!1,this.gestureDistance=0,!0}move(e,t=.016){if(!this.dragging)return!1;let n=Ki(e,this.previous),s=n/Math.max(.008,t);if(this.previous={...e},n>.6&&!ji.includes(this.stage))return this.issue="\u52A8\u4F5C\u592A\u6025\uFF0C\u6162\u4E00\u70B9\uFF0C\u8BA9\u5DE5\u5177\u8D34\u7740\u6750\u6599\u8D70\u3002",!1;if(this.distance+=n,this.gestureDistance+=n,this.mode==="bend")this.curve=Go((2.2-e.x)/3.1,0,1.18),this.oval=Go((e.y+.85)/2,-.5,.5),this.ready=this.curve>=.96&&this.curve<=1.04&&Math.abs(this.oval)<.09&&this.distance>2.5,this.issue=this.curve>1.04?"\u5F2F\u8FC7\u5934\u4E86\uFF0C\u7A0D\u5FAE\u653E\u677E\u53F3\u7AEF\u3002":Math.abs(this.oval)>.09?"\u4E24\u7AEF\u9AD8\u5EA6\u4E0D\u9F50\uFF0C\u4E0A\u4E0B\u8C03\u6574\u5230\u6728\u9489\u5904\u3002":"";else if(this.mode==="shape")if(this.stage!=="petal_shaping"||!this.formed){this.curve=Go((e.x-.15)/1.5,0,1.2);let r=this.curve>.48&&this.curve<.74&&this.distance>.6;this.ready=this.stage!=="petal_shaping"&&r,this.pendingShape=r,this.issue=this.curve>=.74?"\u5377\u5F97\u592A\u7D27\uFF0C\u5411\u5DE6\u56DE\u9000\u4E00\u70B9\u3002":r?"\u5F27\u5EA6\u5408\u9002\uFF0C\u677E\u624B\u5B8C\u6210\u6210\u5F62\u3002":""}else this.edgePinched?this.wireFixed||(this.pendingShape=this.gestureDistance>.35&&e.x>.55&&e.x<1.1&&e.y<-.15,this.issue=this.pendingShape?"\u677E\u624B\u56FA\u5B9A\u94DC\u4E1D\u3002":"\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\uFF0C\u5C06\u94DC\u4E1D\u5411\u4E0B\u6536\u62E2\u56FA\u5B9A\u3002"):(this.pendingShape=this.gestureDistance>.18&&e.x>.95&&e.y<.35&&e.y>-.1,this.issue=this.pendingShape?"\u677E\u624B\u5B8C\u6210\u634F\u8FB9\uFF0C\u518D\u56FA\u5B9A\u94DC\u4E1D\u3002":"\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\uFF0C\u5411\u4E0B\u634F\u51FA\u6298\u8FB9\u3002");else if(["place","press","dye"].includes(this.mode)&&!this.placed)this.position={...e};else if(["trace","bind"].includes(this.mode)){let r=this.points[this.next];return r&&Ki(e,r)<.24&&s<14?(this.visited.add(this.next),this.next++,this.ready=this.next>=this.points.length,n>.002):(this.issue=s>=14?"\u79FB\u52A8\u592A\u5FEB\uFF0C\u653E\u6162\u5DE5\u5177\u3002":"\u6CBF\u6D45\u8272\u5F15\u7EBF\u7EE7\u7EED\uFF0C\u504F\u79BB\u7684\u90E8\u5206\u4E0D\u4F1A\u52A0\u5DE5\u3002",!1)}else if(this.mode==="inspect")return!1;return n>.002}tick(e,t){if(!this.dragging||!t)return!1;if(e=Math.min(e,.05),this.mode==="dye"&&!this.placed){let n=Go((this.position.x+.35)/1.2);if(Math.abs(this.position.y-.2)<.62&&this.position.x>-.35&&this.position.x<1.45)return this.dose+=e*n*.75,this.ready=!1,this.issue=this.dose>1.15?"\u989C\u8272\u8FC7\u6DF1\uFF0C\u8BF7\u6362\u7EB8\u91CD\u505A\u8FD9\u4E00\u6279\u3002":"",!0}if((this.mode==="press"||this.mode==="place")&&this.placed&&Ki(t,Tt)<.3){this.contact+=e;let n=this.mode==="press"?1.05:.55;return this.ready=this.contact>=n,!0}if(this.mode==="inspect"){let n=this.points.findIndex((s,r)=>!this.visited.has(r)&&Ki(t,s)<.28);if(n>=0)return this.inspectIndex!==n&&(this.inspectIndex=n,this.contact=0),this.contact+=e,this.contact>=.23&&(this.visited.add(n),this.contact=0),this.ready=this.visited.size===this.points.length,!0}return!1}rotate(e){!this.placed&&["place","press"].includes(this.mode)&&(this.angle+=e)}up(){if(this.dragging){if(this.dragging=!1,this.previous=null,this.stage==="petal_shaping"){this.pendingShape&&(this.formed?this.edgePinched?this.wireFixed=!0:this.edgePinched=!0:this.formed=!0),this.pendingShape=!1,this.ready=this.formed&&this.edgePinched&&this.wireFixed,this.issue=this.ready?"\u6210\u5F62\u3001\u634F\u8FB9\u548C\u94DC\u4E1D\u56FA\u5B9A\u5DF2\u5B8C\u6210\u3002":this.formed?this.edgePinched?"\u634F\u8FB9\u5B8C\u6210\uFF1B\u6293\u4F4F\u5706\u70B9\u5411\u4E0B\u6536\u62E2\u94DC\u4E1D\u56FA\u5B9A\u3002":"\u6210\u5F62\u5B8C\u6210\uFF1B\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\u5411\u4E0B\u634F\u8FB9\u3002":this.issue;return}if(ji.includes(this.stage)&&!this.placed){Ki(this.position,Tt)<.34&&this.distance>.9?(this.position={...Tt},this.angle=0,this.placed=!0,this.ready=!0,this.issue="\u5DF2\u5BF9\u9F50\uFF0C\u677E\u624B\u8D34\u5408\u3002"):this.issue="\u5C1A\u672A\u5230\u8FBE\u9AD8\u4EAE\u4F4D\u7F6E\uFF0C\u8BF7\u7EE7\u7EED\u62D6\u52A8\u6750\u6599\u5BF9\u9F50\u540E\u677E\u624B\u3002";return}if(["place","press"].includes(this.mode)&&!this.placed){let e=Ki(this.position,Tt),t=Math.abs(Math.atan2(Math.sin(this.angle),Math.cos(this.angle)));e<.2&&t<.15&&this.distance>.9?(this.placed=!0,this.position={...Tt},this.issue="\u5DF2\u5BF9\u9F50\uFF0C\u518D\u6309\u4F4F\u63A5\u89E6\u5904\u56FA\u5B9A\u3002"):this.issue=e>=.2?"\u4F4D\u7F6E\u8FD8\u6CA1\u8D34\u5408\uFF0C\u7EE7\u7EED\u6293\u53D6\u8C03\u6574\u3002":"\u65B9\u5411\u504F\u659C\uFF0C\u7528\u6EDA\u8F6E\u6216\u65CB\u8F6C\u6309\u94AE\u5BF9\u9F50\u3002"}if(this.mode==="dye"){let e=this.position.x<-.85&&this.position.y>.5;this.ready=e&&this.dose>=.55&&this.dose<=1.15,this.issue=this.ready?"\u989C\u8272\u9002\u4E2D\uFF0C\u5DF2\u653E\u5230\u9634\u5E72\u67B6\u3002":this.dose>1.15?"\u6D78\u67D3\u8FC7\u6DF1\uFF0C\u8BF7\u6362\u7EB8\u91CD\u505A\u3002":this.dose<.55?"\u989C\u8272\u504F\u6D45\uFF0C\u53EF\u518D\u6B21\u6D78\u5165\u67D3\u6DB2\u3002":"\u79FB\u5230\u5DE6\u4E0A\u65B9\u9634\u5E72\u67B6\uFF0C\u518D\u677E\u624B\u3002"}}}cancelGesture(){this.dragging=!1,this.previous=null,this.pendingShape=!1}evidence(){return!this.ready||this.dragging?null:{mode:this.mode,quality:Go(this.mode==="bend"?1-Math.abs(this.curve-1)-Math.abs(this.oval):this.mode==="shape"?1-Math.abs(this.curve-.61):this.mode==="dye"?1-Math.abs(this.dose-.8):1),curve:this.curve,oval:this.oval,dose:this.dose,angle:this.angle,distance:this.distance,formed:this.formed,edgePinched:this.edgePinched,wireFixed:this.wireFixed}}};var Pi=.4,At=i=>document.getElementById(i),an=(i=0,e=0,t=0)=>new O(i,e,t),Jf={bend:["\u56FA\u5B9A\u5DE6\u7AEF\uFF0C\u518D\u62D6\u52A8\u53F3\u7AEF\u5F2F\u5708","\u5148\u70B9\u5DE6\u4FA7\u6728\u9489\uFF1B\u6293\u4F4F\u53F3\u7AEF\u5411\u5DE6\u6536\u62E2\uFF0C\u4E0A\u4E0B\u5FAE\u8C03\u8BA9\u4E24\u7AEF\u76F8\u5408\u3002"],place:["\u62FF\u8D77\u6750\u6599\uFF0C\u5BF9\u51C6\u8F6E\u5ED3\u540E\u56FA\u5B9A","\u62D6\u52A8\u6750\u6599\u5230\u6D45\u8272\u8F6E\u5ED3\uFF1B\u6EDA\u8F6E / Q R \u8C03\u6574\u65B9\u5411\u3002\u677E\u5F00\u540E\u6309\u4F4F\u63A5\u89E6\u70B9\u56FA\u5B9A\u3002"],dye:["\u6D78\u5165\u67D3\u6DB2\uFF0C\u518D\u63D0\u5230\u9634\u5E72\u67B6","\u62D6\u7EB8\u5165\u53F3\u4FA7\u67D3\u76D8\uFF0C\u6D78\u5165\u8D8A\u6DF1\u7740\u8272\u8D8A\u5FEB\uFF1B\u989C\u8272\u9002\u4E2D\u540E\u79FB\u5230\u5DE6\u4E0A\u65B9\u67B6\u5B50\u677E\u624B\u3002"],press:["\u5BF9\u9F50\u7EB8\u5F20\uFF0C\u518D\u6309\u4F4F\u6728\u6A21","\u62D6\u52A8\u7EB8\u5F20\uFF0C\u6EDA\u8F6E / Q R \u5BF9\u9F50\u8F6E\u5ED3\uFF1B\u677E\u5F00\u540E\u6309\u4F4F\u7EB8\u9762\uFF0C\u7B4B\u7EDC\u968F\u538B\u5408\u51FA\u73B0\u3002"],shape:["\u6293\u4F4F\u8FB9\u7F18\uFF0C\u6162\u6162\u5377\u8D77","\u62D6\u52A8\u53F3\u4FA7\u5706\u70B9\u5411\u53F3\u5377\u66F2\uFF1B\u8FC7\u7D27\u65F6\u5411\u5DE6\u56DE\u9000\uFF0C\u4FDD\u7559\u81EA\u7136\u5F27\u5EA6\u540E\u677E\u624B\u3002"],trace:["\u6CBF\u5F15\u7EBF\u79FB\u52A8\u5DE5\u5177","\u6309\u4F4F\u6CBF\u6D45\u8272\u7EBF\u7F13\u6162\u79FB\u52A8\uFF1B\u53EA\u6709\u5DE5\u5177\u7ECF\u8FC7\u7684\u533A\u57DF\u624D\u4F1A\u52A0\u5DE5\uFF0C\u53EF\u5206\u6B21\u8865\u9F50\u3002"],bind:["\u7ED5\u8FC7\u4EA4\u70B9\uFF0C\u9010\u5708\u6536\u7EBF","\u6309\u4F4F\u6CBF\u7EBF\u7ED5\u4E24\u5708\uFF1B\u987A\u7740\u4EAE\u70B9\u7EE7\u7EED\uFF0C\u8D70\u504F\u65F6\u53EF\u4EE5\u56DE\u5230\u672A\u5B8C\u6210\u7684\u5730\u65B9\u3002"],inspect:["\u79FB\u52A8\u9A8C\u706F\u5DE5\u5177\uFF0C\u9010\u5904\u89C2\u5BDF","\u6309\u4F4F\u62D6\u52A8\u5DE5\u5177\uFF0C\u5206\u522B\u5728\u56DB\u4E2A\u68C0\u67E5\u70B9\u7A0D\u4F5C\u505C\u7559\uFF0C\u89C2\u5BDF\u5404\u5904\u7ED3\u6784\u4E0E\u900F\u5149\u3002"]};function Kf({canvas:i,lantern:e,audio:t,getState:n,onComplete:s,scene:r,camera:o,world:a,canInteract:c}){let l=new We;r.add(l),l.visible=!1;let u=null,f=null,d=null,p=null,g=0,y=!1,m=null,h=null,_=!1,x=null,v=0,T=0,E,C,U,M,S,D,H,G,F=[],W,K,he,ee=new Ln,be=new Ht(an(0,0,1),0),te=an(Tt.x,Tt.y,0),Ee,Ie=(w,q={})=>new ke({color:w,roughness:.87,side:pt,...q});function V(w,q,ie=l){let $=new Ue(w,q);return ie.add($),$}function ue(w,q,ie,$,ye,Pe,Se,P=l){let se=V(new bt($,ye,Pe),Ie(Se),P);return se.position.set(w,q,ie),se}function Re(w,q,ie,$,ye=.2,Pe=l){let Se=V(new gt(ie,ie,.035,28),Ie($),Pe);return Se.rotation.x=Math.PI/2,Se.position.set(w,q,ye),Se}function Z(w,q="#8b8163",ie=1,$=l){let ye=new st().setFromPoints(w),Pe=new bn(ye,new Mn({color:q,transparent:!0,opacity:ie,depthTest:!1,depthWrite:!1}));return Pe.renderOrder=18,$.add(Pe),Pe}function re(w,q,ie=.105){let $=V(new Lt(ie,.018,6,24),Ie("#fbebbb",{depthTest:!1,depthWrite:!1}));return $.renderOrder=20,$.position.set(w,q,Pi),$}function _e(w,q,ie,$=1){let ye=document.createElement("canvas");ye.width=512,ye.height=80;let Pe=ye.getContext("2d");Pe.fillStyle="#594f3e",Pe.font='27px "Microsoft YaHei"',Pe.textAlign="center",Pe.fillText(w,256,47);let Se=new Vi(ye);Se.colorSpace=kt;let P=new rr({map:Se,transparent:!0,depthTest:!1,toneMapped:!1}),se=new so(P);return se.position.set(q,ie,.35),se.scale.set(2.5*$,.39*$,1),l.add(se),se}function xe(w=!1){let q=new We;l.add(q);let ie={press:"press",trace:"brush",inspect:"brush",bend:"bamboo"}[d.mode]||"pinch",$=Fn(q,w,ie);return $.rotation.x=Math.PI/2,$.scale.setScalar(2.4),$.position.y=-.22,q.artisanHand=$,q.position.z=1.4,q.rotation.z=w?-.28:.28,q}function Te(w="#dca6ce",q=!1){let ie=new nn(1.05,1.65,16,30),$=ie.attributes.position;for(let ye=0;ye<$.count;ye++){let Pe=($.getY(ye)+.825)/1.65;$.setX(ye,$.getX(ye)*(q?Math.pow(Math.sin(Math.PI*Pe),.45):Math.pow(Math.sin(Math.PI*Pe),.65))+.001)}return ie.computeVertexNormals(),V(ie,Ie(w))}function ze(){f=null,Dt(l)}function Ze(){}function B(){ze(),u=null,F=[],E=null,U=null,Ee=null,G=null,he=null,K=null,W=null,M=null;let w=d.mode,q=p.id.includes("leaf")||p.id.includes("calyx")||p.id.includes("pod");if(w==="bend"){let ie=Array.from({length:97},()=>an());U=V(new st,Ie("#aaa36b"));let $=new Float32Array(582),ye=[];for(let Pe=0;Pe<96;Pe++){let Se=Pe*2;ye.push(Se,Se+1,Se+2,Se+1,Se+3,Se+2)}U.geometry.setAttribute("position",new Nt($,3)),U.geometry.setIndex(ye),W=Z(Array.from({length:97},(Pe,Se)=>an(gn.x+Math.sin(Se/96*Math.PI*2)*.95,gn.y+(1-Math.cos(Se/96*Math.PI*2))*.95,.01)),"#847b55",.42),Re(gn.x,gn.y,.09,"#68543b",.3),F.push(re(gn.x,gn.y,.16)),M=re(2.2,-.85,.13),_e("\u56FA\u5B9A\u7AEF",gn.x,-1.25,.6),_e("\u6D3B\u52A8\u7AEF",2,-1.25,.6)}else if(["trace","bind"].includes(w)){w==="bind"?(ue(0,0,0,2,.11,.1,"#a6a06c"),ue(0,0,.08,.1,1.9,.1,"#aba770")):(E=V(new nn(3.15,1.6,40,20),Ie(p.id==="lining_upper"?"#9e4559":"#eee2d0")),C=E.geometry.attributes.position.array.slice(),E.position.z=Pi);let ie=d.points.map($=>an($.x,$.y,Pi));W=Z(ie,"#8a7a61",.35),Ee=Z(ie,w==="bind"?"#eee0bc":p.id==="paper_cutting"?"#775842":"#f8efdf"),Ee.geometry.setDrawRange(0,0),M=re(ie[0].x,ie[0].y)}else if(w==="inspect")F=d.points.map(ie=>re(ie.x,ie.y,.13));else if(w==="place"){let ie=[...e.registry.values()].find($=>$.userData.workflowStage===p.id&&($.userData.order??0)===g);if(ie&&p.id==="top_flower_assembly"&&(ie.updateWorldMatrix(!0,!0),u=new zt().setFromObject(ie).getCenter(an()),N()),ie){E=new We,l.add(E);let $=ie.clone(!0);$.visible=!0,$.traverse(P=>{P.geometry&&(P.geometry=P.geometry.clone()),P.material&&(P.material=P.material.clone(),P.material.vertexColors=!!P.geometry?.attributes.color)}),E.add($),$.position.set(0,0,0),$.rotation.set(0,0,0);let ye=new zt().setFromObject($),Pe=ye.getSize(an()),Se=ye.getCenter(an());$.position.sub(Se),$.scale.multiplyScalar(1.35/Math.max(Pe.x,Pe.y,Pe.z,.1)),$.position.multiplyScalar(1.35/Math.max(Pe.x,Pe.y,Pe.z,.1))}else E=Te(q?"#6e8b58":"#d3a0c8",q);W=E.clone(!0),W.traverse($=>{$.geometry&&($.geometry=$.geometry.clone()),$.material&&($.material=new Ft({color:"#9b855d",wireframe:!0,transparent:!0,opacity:.22}))}),l.add(W),W.position.set(Tt.x,Tt.y,.1),_e("\u63A5\u5408\u4F4D\u7F6E",Tt.x,-1,.7),_e("\u5F85\u88C5\u90E8\u4EF6",Qi.x,-1.35,.7),u&&(W.visible=!1,l.children.filter($=>$.isSprite).forEach($=>$.visible=!1),E.traverse($=>{$.isMesh&&($.material.depthTest=!1,$.material.depthWrite=!1,$.renderOrder=19)})),M=re(Qi.x,Qi.y)}else{if(E=Te(w==="dye"?"#eee5d3":q?"#6d8955":"#d6a3c8",q),C=E.geometry.attributes.position.array.slice(),w==="dye"){ue(.65,.2,-.12,1.9,1.7,.18,"#73684e"),K=ue(.65,.2,.01,1.72,1.52,.025,q?"#5c714d":"#aa648b"),K.material.roughness=.25,ue(-1.55,1,-.05,1.25,.95,.06,"#c7b38e");for(let ie=0;ie<6;ie++)ue(-2.04+ie*.2,1,.015,.025,.85,.025,"#82704e");_e("\u9634\u5E72\u67B6",-1.55,1.65,.7),_e("\u67D3\u76D8",.65,-1,.7)}else w==="press"?(ue(Tt.x,Tt.y,-.1,1.35,1.95,.16,"#97805a"),W=Te("#9a895f",q),W.position.set(Tt.x,Tt.y,.025),W.material.wireframe=!0,W.material.transparent=!0,W.material.opacity=.3,Me(),he=ue(Tt.x,Tt.y+.08,1,1.23,1.82,.16,"#9b7c51"),he.material.transparent=!0,he.material.opacity=.15,he.visible=!1):(E.position.set(0,0,Pi),Me(),M=re(.15,.55),_e("\u5377\u66F2\u65B9\u5411 \u2192",.85,-1.25,.8));M||(M=re(Qi.x,Qi.y))}if(S=xe(),D=xe(!0),D.position.set(-2,-1.6,1),D.visible=["bend","shape","trace","bind"].includes(w),H=new We,S.add(H),H.position.set(-.05,.12,.05),["trace","inspect","press"].includes(w)){if(ue(0,.1,.04,.12,.48,.1,w==="inspect"?"#e4cc7c":"#675b40",H),w==="trace"){let ie=ue(0,.4,.04,.1,.24,.035,"#bac1b6",H);ie.rotation.z=-.25}w!=="press"&&Gn(S.artisanHand,H.position.clone().add(an(0,.1,.04)))}k()}function Me(){G=new We,l.add(G);for(let w=-4;w<=4;w++){let q=Z(Array.from({length:25},(ie,$)=>{let ye=$/24;return an(Math.sin(Math.PI*ye)*w*.082,-.78+ye*1.52,.03)}),"#8c6382",.65,G);q.geometry.userData.original=Array.from(q.geometry.attributes.position.array)}}function N(){u&&(o.updateMatrixWorld(!0),o.getWorldQuaternion(l.quaternion),l.position.copy(u).sub(an(Tt.x,Tt.y,Pi).multiplyScalar(.3).applyQuaternion(l.quaternion)),l.updateMatrixWorld(!0))}function k(){if(!d)return;N();let w=d,q=w.mode;if(U){let Se=U.geometry.attributes.position;for(let P=0;P<=96;P++){let se=P/96,L=se*Math.PI*2*w.curve,oe=gn.x+Math.sin(se*Math.PI*2)*.95,le=gn.y+(1-Math.cos(se*Math.PI*2))*.95,I=Math.min(w.curve,1),z=Xt.lerp(gn.x+se*3.1,oe,I),Y=Xt.lerp(gn.y,le,I)+w.oval*Math.sin(se*Math.PI)*1.8;w.curve>1&&(z+=Math.sin(L)*.4*(w.curve-1),Y+=se*(w.curve-1)*1.5);for(let Ae=0;Ae<2;Ae++)Se.setXYZ(P*2+Ae,z,Y+(Ae-.5)*.055,.17)}Se.needsUpdate=!0,U.geometry.computeVertexNormals(),U.geometry.computeBoundingSphere(),F[0].material.color.set(w.pinned?"#647950":"#fbebbb")}if(E&&["place","press","dye"].includes(q)&&(E.position.set(w.position.x,w.position.y,.4),E.rotation.z=w.angle*(q==="dye"?0:1)),E&&q==="dye"&&(E.material.color.set("#eee5d3").lerp(new Ye(p.id==="leaf_dye"?"#386546":"#b66097"),Math.min(1,w.dose/1.25)),E.material.roughness=w.dose>0?.45:.9),E&&q==="shape"){let Se=E.geometry.attributes.position;for(let P=0;P<Se.count;P++){let se=C[P*3],L=C[P*3+1],oe=(L+.825)/1.65;Se.setXYZ(P,se*(1-w.curve*oe*.26)+w.curve*1.5*oe*oe,L-oe*oe*w.curve*.34,oe*oe*w.curve*.95)}Se.needsUpdate=!0,E.geometry.computeVertexNormals(),E.geometry.computeBoundingSphere()}if(G)if(G.visible=q!=="press"||w.contact>0,q==="press")G.position.set(Tt.x,Tt.y,.45),G.scale.y=Math.min(1,w.contact/1.05);else if(q==="shape"){G.position.z=Pi;for(let Se of G.children){let P=Se.geometry.attributes.position,se=Se.geometry.userData.original;for(let L=0;L<P.count;L++){let oe=se[L*3],le=se[L*3+1],I=(le+.825)/1.65;P.setXYZ(L,oe*(1-w.curve*I*.26)+w.curve*1.5*I*I,le-I*I*w.curve*.34,I*I*w.curve*.95+.02)}P.needsUpdate=!0,Se.geometry.computeBoundingSphere()}}else G.position.z=.2;if(he&&(he.visible=w.placed&&w.dragging,he.position.z=.7-Math.min(.24,w.contact*.2)),Ee&&Ee.geometry.setDrawRange(0,w.next),q==="trace"&&E){let Se=E.geometry.attributes.position,P=-1.35+w.next/25*2.7;for(let se=0;se<Se.count;se++){let L=C[se*3],oe=C[se*3+1],le=L<P&&w.next>0,I=p.id==="paper_cutting",z=.38*Math.sin((L+1.35)/2.7*Math.PI*2);Se.setXYZ(se,L,oe-(I&&le&&oe<z?.055:0),I?le&&oe<z?.045:0:le?0:.08*Math.sin(L*10)*Math.sin(oe*6))}Se.needsUpdate=!0,E.geometry.computeVertexNormals()}if(M){let Se=["trace","bind"].includes(q)?w.points[Math.min(w.next,w.points.length-1)]:w.placed?Tt:w.grip;M.position.set(Se.x,Se.y,Pi),M.material.color.set(w.ready?"#657d50":"#f2dfac")}F.forEach((Se,P)=>{q==="inspect"&&Se.material.color.set(w.visited.has(P)?"#5d7752":"#f2dfac")}),q==="bend"&&w.pinned&&D.position.set(gn.x+.03,gn.y-.28,1.2),q==="inspect"&&f&&p.id==="final_inspection"&&f.traverse(Se=>{Se.isPointLight&&(Se.intensity=.3+w.visited.size*.35)});let ie=m||{x:1.75,y:-1.5};S.position.set(ie.x+.15,ie.y-.3,1.5),S.visible=!0;let $=!w.ready||w.dragging;At("handwork-confirm").disabled!==$&&(At("handwork-confirm").disabled=$);let Pe=(p.id==="top_flower_assembly"?w.dragging?Math.hypot(w.position.x-Tt.x,w.position.y-Tt.y)<.34?"\u4F4D\u7F6E\u5408\u9002 \xB7 \u677E\u5F00\u5DE6\u952E\u5B89\u88C5\u82B1\u5934":"\u62D6\u52A8\u82B1\u5934\u5230\u9AD8\u4EAE\u8F6E\u5ED3\uFF0C\u5230\u4F4D\u540E\u677E\u5F00\u5DE6\u952E":w.issue||"\u4ECE\u4E0B\u65B9\u80CC\u5305\u62D6\u51FA\u82B1\u5934\uFF0C\u653E\u5230\u9AD8\u4EAE\u4F4D\u7F6E\u540E\u677E\u624B\u5373\u53EF\u3002":null)||(w.ready?Wo(p.id)?"\u5F27\u5EA6\u5408\u9002\uFF0C\u677E\u5F00\u5DE6\u952E\u81EA\u52A8\u6536\u597D\u3002":"\u672C\u6B21\u52A0\u5DE5\u5DF2\u5B8C\u6210\uFF0C\u53EF\u4EE5\u786E\u8BA4\u3002":w.issue||(q==="bend"?w.pinned?"\u5DE6\u7AEF\u5DF2\u56FA\u5B9A \xB7 \u6536\u62E2\u6D3B\u52A8\u7AEF\uFF0C\u5FAE\u8C03\u5706\u5EA6\u3002":"\u7AF9\u7BFE\u5C1A\u672A\u56FA\u5B9A \xB7 \u5148\u6309\u5DE6\u4FA7\u6728\u9489\u3002":q==="dye"?w.dose<.55?"\u7EB8\u8272\u5C1A\u6D45 \xB7 \u6162\u6162\u6D78\u5165\u67D3\u6DB2\u3002":w.dose<=1.15?"\u7EB8\u8272\u9002\u4E2D \xB7 \u63D0\u5230\u5DE6\u4E0A\u65B9\u9634\u5E72\u67B6\u3002":"\u7EB8\u8272\u8FC7\u6DF1 \xB7 \u6362\u7EB8\u91CD\u505A\u3002":q==="inspect"?"\u5DF2\u68C0\u67E5 "+w.visited.size+" / 4 \u5904":q==="press"&&w.placed?"\u6309\u4F4F\u6A21\u5177\u63A5\u89E6\u5904\uFF0C\u8BA9\u7EB9\u8DEF\u5B8C\u6574\u663E\u73B0\u3002":ji.includes(p.id)?"\u62D6\u5230\u9AD8\u4EAE\u8F6E\u5ED3\u540E\u677E\u5F00\u5DE6\u952E\uFF0C\u6750\u6599\u4F1A\u81EA\u52A8\u5BF9\u9F50\u7C98\u8D34\u3002":Jf[q][1]));if(p.id==="petal_shaping"){let Se=w.shapePhase==="form"?"\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\uFF0C\u6162\u6162\u5377\u8D77\u82B1\u74E3\u3002":w.shapePhase==="pinch"?"\u6210\u5F62\u5B8C\u6210 \xB7 \u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\u5411\u4E0B\u634F\u8FB9\u3002":w.shapePhase==="wire"?"\u634F\u8FB9\u5B8C\u6210 \xB7 \u6293\u4F4F\u5706\u70B9\u5411\u4E0B\u6536\u62E2\u94DC\u4E1D\u56FA\u5B9A\u3002":"\u6210\u5F62\u3001\u634F\u8FB9\u548C\u94DC\u4E1D\u56FA\u5B9A\u5DF2\u5B8C\u6210\u3002";At("handwork-subtitle").textContent!==Se&&(At("handwork-subtitle").textContent=Se)}At("handwork-status").textContent!==Pe&&(At("handwork-status").textContent=Pe),At("handwork-status").dataset.ready!==String(w.ready)&&(At("handwork-status").dataset.ready=String(w.ready))}function ne(){}function me(w){let q=i.getBoundingClientRect();ee.setFromCamera(new Ce((w.clientX-q.left)/q.width*2-1,-(w.clientY-q.top)/q.height*2+1),o);let ie=new Ht().setFromNormalAndCoplanarPoint(an(0,0,1).applyQuaternion(l.quaternion),l.localToWorld(an(0,0,Pi))),$=ee.ray.intersectPlane(ie,an());return $?l.worldToLocal($):an(100,100,0)}let ce=At("handwork-surface"),ge=At("inventory-flower"),Le=()=>Math.max(0,n().counts.flower_making-n().counts.top_flower_assembly);ge.addEventListener("dragstart",w=>w.preventDefault()),ge.addEventListener("pointerdown",w=>{!y||p.id!=="top_flower_assembly"||!c()||h!==null||w.button!==0||!Le()||(w.preventDefault(),d.reset(),d.down(Qi),h=w.pointerId,_=!0,x=ge,ge.setPointerCapture(w.pointerId),v=performance.now(),Be(w),t.play("tool"))});function Be(w){let q=me(w);m={x:q.x,y:q.y};let ie=performance.now(),$=d.move(m,(ie-v)/1e3);v=ie,$&&ae(ie),k()}window.addEventListener("pointermove",w=>{if(y&&_&&w.pointerId===h){if(!c()){J();return}Be(w)}}),window.addEventListener("pointerup",w=>{_&&R(w)}),window.addEventListener("pointercancel",w=>{w.pointerId===h&&J()}),ge.addEventListener("lostpointercapture",w=>{w.pointerId===h&&J()}),ce.addEventListener("pointerdown",w=>{if(!y||!c()||h!==null||w.button!==0)return;w.preventDefault();let q=me(w);m={x:q.x,y:q.y},d.down(m)&&(h=w.pointerId,x=ce,ce.setPointerCapture(w.pointerId),v=performance.now()),k()}),ce.addEventListener("pointermove",w=>{!y||_||!c()||h!==null&&h!==w.pointerId||Be(w)});function R(w){if(w.pointerId!==h||w.button!==0)return;if(!c()){J();return}ji.includes(p.id)&&Be(w);let q=_;d.up(),b();let ie=Wo(p.id)?d.evidence():null;q&&!ie&&(d.reset(),m=null,d.issue="\u5C1A\u672A\u5230\u8FBE\u9AD8\u4EAE\u4F4D\u7F6E\uFF0C\u82B1\u5934\u5DF2\u653E\u56DE\u80CC\u5305\uFF1B\u62D6\u5230\u8F6E\u5ED3\u5904\u518D\u677E\u624B\u3002"),k(),ie&&s(p.id,g,ie)}function b(){let w=x,q=h;h=null,x=null,_=!1,w&&q!==null&&w.hasPointerCapture(q)&&w.releasePointerCapture(q)}ce.addEventListener("pointerup",R),ce.addEventListener("pointercancel",()=>J()),ce.addEventListener("lostpointercapture",()=>{h!==null&&J()});function J(){let w=_;b(),d?.cancelGesture(),w&&(d?.reset(),m=null),y&&k()}function ae(w){w-T>220&&(t.play(p.id==="final_inspection"?"check":p.id),T=w)}function ve(w){d.rotate(w),t.play("tool"),k()}ce.addEventListener("wheel",w=>{y&&(w.preventDefault(),ve(w.deltaY>0?.1:-.1))},{passive:!1});function fe(){At("handwork-rotate-left").onclick=()=>ve(-.1),At("handwork-rotate-right").onclick=()=>ve(.1),At("handwork-retry").onclick=()=>{J(),d.reset(),m=null,B()},At("handwork-confirm").onclick=()=>{if(!c())return;let w=d.evidence();w&&s(p.id,g,w)}}function X(){y&&(J(),y=!1,ge.disabled=!0,document.body.classList.remove("flower-placement"),l.visible=!1,ze())}return window.addEventListener("keydown",w=>{y&&(w.code==="KeyQ"&&ve(-.1),w.code==="KeyR"&&ve(.1))}),window.addEventListener("blur",J),document.addEventListener("visibilitychange",()=>{document.hidden&&J()}),window.addEventListener("resize",ne),{scene:r,camera:o,get active(){return y},open(w,q){let ie=a.stations[w.station];l.position.set(ie.x,w.station==="assembly"?1.28:1.04,ie.z+(w.station==="assembly"?.6:.35)),l.rotation.x=-Math.PI/2,l.scale.setScalar(.3),l.visible=!0,fe(),l.updateMatrixWorld(!0),p=w,g=q,d=new hc(w.id),m=null,h=null,T=0,y=!0,ge.disabled=w.id!=="top_flower_assembly"||!Le(),document.body.classList.toggle("flower-placement",w.id==="top_flower_assembly"),At("handwork").hidden=!1,document.body.classList.add("handworking"),At("handwork-title").textContent=w.name,At("handwork-subtitle").textContent="\u7B2C "+(q+1)+" / "+w.total+" "+w.unit+" \xB7 "+Jf[d.mode][0],At("handwork-tool").textContent={bend:"\u53CC\u624B \xB7 \u56FA\u5B9A\u6728\u9489",place:"\u53CC\u624B \xB7 \u7CE8\u7CCA / \u63A5\u5408\u5DE5\u5177",dye:"\u53CC\u624B \xB7 \u67D3\u76D8",press:"\u53CC\u624B \xB7 \u6728\u8D28\u538B\u6A21",shape:"\u53CC\u624B \xB7 \u5377\u66F2\u4E0E\u5B9A\u5F62\u4E1D",trace:w.id==="paper_cutting"?"\u88C1\u7EB8\u5200 \xB7 \u7D20\u7EB8":"\u88F1\u7CCA\u5237 \xB7 \u7EB8\u9762",bind:"\u624E\u7EBF \xB7 \u4EA4\u70B9",inspect:"\u9A8C\u706F\u5DE5\u5177 \xB7 \u7ED3\u6784\u89C2\u5BDF"}[d.mode],At("handwork-confirm").hidden=Wo(w.id),w.id==="top_flower_assembly"?At("handwork-subtitle").textContent="\u4ECE\u4E0B\u65B9\u80CC\u5305\u62D6\u51FA\u82B1\u5934 \u2192 \u5BF9\u51C6\u9AD8\u4EAE\u8F6E\u5ED3 \u2192 \u677E\u5F00\u5DE6\u952E\u5B89\u88C5":ji.includes(w.id)?At("handwork-subtitle").textContent="\u62D6\u52A8\u82B1\u5934 / \u83B2\u84EC\u5230\u9AD8\u4EAE\u8F6E\u5ED3\uFF0C\u677E\u5F00\u5DE6\u952E\u76F4\u63A5\u8D34\u5408\uFF0C\u65E0\u9700\u518D\u6B21\u6309\u4F4F\u6216\u786E\u8BA4":Wo(w.id)&&(At("handwork-subtitle").textContent="\u62D6\u52A8\u5706\u70B9\u5377\u66F2\u5B9A\u5F62\uFF0C\u5F27\u5EA6\u5408\u683C\u540E\u677E\u5F00\u5DE6\u952E\u6536\u597D");let $=["place","press"].includes(d.mode)&&!ji.includes(w.id);At("handwork-rotate-left").hidden=!$,At("handwork-rotate-right").hidden=!$,B(),At("handwork-close").focus()},update(w,q){y&&(d.tick(w,m)&&ae(q),k())},snapshot(){return d?{stage:p.id,mode:d.mode,ready:d.ready,inventoryDrag:_,flowerStock:Le(),dragging:d.dragging,pinned:d.pinned,curve:d.curve,oval:d.oval,position:{...d.position},angle:d.angle,dose:d.dose,contact:d.contact,next:d.next,placed:d.placed,visited:[...d.visited],grip:{...d.grip},issue:d.issue,shapePhase:d.shapePhase,formed:d.formed,edgePinched:d.edgePinched,wireFixed:d.wireFixed}:null},project(w){let q=l.localToWorld(an(w.x,w.y,Pi)).project(o),ie=i.getBoundingClientRect();return{x:ie.left+(q.x+1)*ie.width/2,y:ie.top+(1-q.y)*ie.height/2}},close:X}}var je=i=>document.getElementById(i),_n=(i=0,e=0,t=0)=>new O(i,e,t),qx=["big-ring","mouth-ring"],jf=["\u5927\u7AF9\u5708","\u5C0F\u7AF9\u5708","40cm\u957F\u6761","\u68C9\u82B1\u7EB8\u637B","\u82B1\u5934\u94C1\u4E1D"],oi=new Set(["frame_assembly","frame_short_binding"]);function Qf({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:a,onInstall:c,onCollect:l,onFinish:u,onNext:f,canInteract:d}){let p=new We,g=new We,y=new We,m=new We;i.add(p,g,y,m);let h=!1,_,x=0,v=null,T=new Fo,E=0,C=null,U=null,M,S,D,H,G,F,W,K=null,he=null,ee=null,be=0,te="",Ee=0,Ie=null,V=new Ln,ue=je("handwork-surface");function Re(P){let se=P.clone().project(e),L=t.getBoundingClientRect();return{x:L.left+(se.x+1)*L.width/2,y:L.top+(1-se.y)*L.height/2}}function Z(P){let se=t.getBoundingClientRect();V.setFromCamera(new Ce((P.clientX-se.left)/se.width*2-1,-(P.clientY-se.top)/se.height*2+1),e)}function re(P,se=1.2){return Z(P),V.ray.intersectPlane(new Ht(_n(0,1,0),-se),_n())}function _e(P,se=!1){je("handwork-status").textContent!==P&&(je("handwork-status").textContent=P),je("handwork-status").dataset.ready=String(se)}function xe(P){C&&C.material.emissive.set(0),C=P,P&&P.material.emissive.set("#5a6934"),ue.style.cursor=P?"pointer":"default"}function Te(P){Z(P);let se=V.intersectObjects(n.bambooStock.filter(le=>le.visible))[0];if(se)return se.object;let L=null,oe=matchMedia("(pointer:coarse)").matches?27:13;for(let le of n.bambooStock.filter(I=>I.visible)){let I=Re(le.getWorldPosition(_n())),z=Math.hypot(I.x-P.clientX,I.y-P.clientY);z<oe&&(oe=z,L=le)}return L}function ze(P){let se=o();return P===2?Math.max(0,se.frameItems.collectedStrips.length-se.counts.frame_assembly):P===3?0:P===4?se.frameItems.placedRings.includes(1)&&se.counts.frame_short_binding<2?1:0:vs(se).filter(L=>L===P).length-Number(se.frameItems.placedRings.includes(P))}function Ze(){Dt(y),W=G=F=null}function B(P){!h&&document.body.classList.contains("handworking")||Ie||h&&!d()||!Number.isInteger(P)||P<0||P>4||(E=P,te="",Me(),k(),h&&oi.has(_.id)&&R(),r.play("tool"))}function Me(){for(let P=0;P<5;P++){let se=je("item-"+P),L=ze(P);if(!se)continue;se.querySelector(".item-count").textContent=String(L);let oe=h||!document.body.classList.contains("handworking");se.disabled=!oe,se.classList.toggle("selected",oe&&E===P),se.classList.toggle("empty",!L),se.setAttribute("aria-pressed",String(oe&&E===P)),se.setAttribute("aria-label",jf[P]+"\uFF0C\u5269\u4F59 "+L+"\uFF0C\u5FEB\u6377\u952E "+(P+1))}W&&!ze(E)&&Ze()}function N(P){return P===4?s.registry.get("flower-support-1"):s.registry.get(P===2?"rib-"+(Math.min(2,o().counts.frame_assembly)+1):qx[P])}function k(){if(Ze(),!ze(E))return;y.position.set(0,0,0),y.quaternion.identity();let P=N(E);W=Ii(P),y.add(W),W.position.set(0,0,0),W.scale.multiplyScalar(.48);let se=new zt().setFromObject(W),L=se.getCenter(_n());W.position.sub(L),W.updateMatrix(),G=Fn(y,!0,"bamboo"),F=Fn(y,!1,"bamboo"),G.scale.setScalar(.85),F.scale.setScalar(.85);let oe=W.geometry?.parameters?.path,le=P.userData.radius??.21,I=oe?E===2?[oe.getPoint(.25),oe.getPoint(.75)]:[_n(-le*.8,le*.6,0),_n(le*.8,le*.6,0)]:[_n(-.14,0,0),_n(.14,0,0)];G.rotation.y=-.35,F.rotation.y=.35,[G,F].forEach((z,Y)=>Gn(z,I[Y].applyMatrix4(W.matrix))),y.position.set(h&&oi.has(_.id)?innerWidth<700?-.45:-.9:-3.35,1.2,h&&oi.has(_.id)?.55:-.78),y.visible=!h||oi.has(_.id)||_.id==="rings_ready"}function ne(){je("ring-choice").hidden=!0;let P=vs(o()).includes(0)&&vs(o()).includes(1)&&o().frameItems.collectedStrips.length===3;je("handwork-next").hidden=!1,je("handwork-next").disabled=!P||T.selected,je("handwork-next").textContent="\u6750\u6599\u9F50\u5907 \xB7 \u5F00\u59CB\u642D\u67B6",je("handwork-next").onclick=()=>{d()&&u()}}for(let P=0;P<3;P++)je("ring-type-"+P).hidden=!0;function me(P,se=T.curve){let L=Math.PI*2*se,oe=Oo[v??0];if(L<.001)return _n((P-.5)*oe,0,0);let le=oe/L,I=(P-.5)*L,z=Math.sin(L/2)/(L/2);return _n(Math.sin(I)*le,0,-le*(Math.cos(I)-z))}function ce(){Dt(p),p.position.set(-3.35,1.2,-1.35),p.visible=!0;let P=128,se=new Float32Array((P+1)*4*3),L=[];for(let I=0;I<P;I++)for(let z=0;z<4;z++){let Y=I*4+z,Ae=I*4+(z+1)%4;L.push(Y,Ae,Y+4,Ae,Ae+4,Y+4)}let oe=new st;oe.setAttribute("position",new Nt(se,3)),oe.setIndex(L),M=new Ue(oe,new ke({color:"#b7a16a",roughness:.87,side:pt})),M.castShadow=!0,p.add(M),D=Fn(p,!0,"bamboo"),H=Fn(p,!1,"bamboo"),D.scale.setScalar(.68),H.scale.setScalar(.68),S=new We,p.add(S);for(let I=0;I<5;I++){let z=new Ue(new Lt(.017,.006,5,24),new ke({color:"#f6efda",roughness:1}));z.rotation.y=Math.PI/2,z.position.x=(I-2)*.013,S.add(z)}let le=new Ue(new nn(.07,.2),new ke({color:"#fff5df",side:pt,roughness:1}));le.rotation.x=-Math.PI/2,le.position.z=.1,S.add(le),ge()}function ge(){if(!M)return;M.visible=D.visible=H.visible=T.selected,S.visible=T.binding;let P=M.geometry.attributes.position;for(let le=0;le<=128;le++){let I=le/128,z=(I-.5)*Math.PI*2*T.curve,Y=me(I);for(let Ae=0;Ae<4;Ae++){let Ve=Ae<2?-1:1,mt=(Ae===0||Ae===3?-1:1)*Bo/2;P.setXYZ(le*4+Ae,Y.x-Math.sin(z)*Ve*bs/2,mt,Y.z-Math.cos(z)*Ve*bs/2)}}P.needsUpdate=!0,M.geometry.computeVertexNormals(),M.geometry.computeBoundingSphere();let se=me(0),L=me(1);D.rotation.y=-.25-T.curve*.5,H.rotation.y=.25+T.curve*.5,Gn(D,me(ko[0])),Gn(H,me(ko[1])),S.position.copy(se),S.children.forEach((le,I)=>{le.visible=I<5?T.wrapping>I*.15:!0,I<5?le.scale.setScalar(Math.min(1,Math.max(.01,(T.wrapping-I*.15)*7))):(le.scale.y=1-T.wrapping*.92,le.rotation.z=T.wrapping*Math.PI*6)});let oe=T.ready&&!T.direction;je("handwork-confirm").disabled=!oe,je("bend-meter").value=T.curve/1.2,je("bend-value").textContent=Math.round(T.curve*100)+"%",je("bend-gauge").dataset.state=T.curve>rc?"over":oe?"ready":"bending",_e(T.binding?"\u6B63\u5728\u7528\u767D\u7EB8\u7F20\u4F4F\u63A5\u5934\u2026 \u5B8C\u6210\u540E\u7AF9\u5708\u81EA\u52A8\u5165\u680F\u3002":T.selected?T.issue:te||"\u70B9\u51FB\u957F\u7AF9\u7BFE\u5236\u4F5C\u5927\u5708\uFF0C42cm\u7AF9\u7BFE\u5236\u4F5C\u5C0F\u5708\uFF1B\u53E6\u53D6\u4E09\u683940cm\u7AF9\u7BFE\u3002",oe)}function Le(P){if(!P||T.selected)return;let se=P.userData.stockIndex;if(xe(null),se>=16){l(se)&&(te="\u5DF2\u6536\u96C640cm\u7AF9\u7BFE "+o().frameItems.collectedStrips.length+"/3",r.play("tool"),ne(),ge());return}v=se<8?0:1,U=P,T.select(se),P.visible=!1,te="",r.play("tool"),ge(),ne()}function Be(P){return P.updateWorldMatrix(!0,!1),P.userData.partType==="ring"?P.parent.localToWorld(_n(P.userData.radius,P.userData.height,0)):new zt().setFromObject(P).getCenter(_n())}function R(){if(Dt(g),K=null,he=null,!h||!oi.has(_.id))return;s.root.updateMatrixWorld(!0);let P=o(),se=_.id==="frame_short_binding"?[4]:[0,1,2,3];for(let L of se){if(!ze(L))continue;let oe=N(L),le=Ii(oe,!0);L===4?(le.position.copy(shortTarget()),le.rotation.y=Math.atan2(le.position.x,le.position.z),le.scale.multiplyScalar(.7)):(oe.updateWorldMatrix(!0,!1),oe.matrixWorld.decompose(le.position,le.quaternion,le.scale)),le.traverse(I=>{I.isMesh&&I.material?.opacity!==void 0&&(I.material.opacity=E===L?.68:.15)}),g.add(le),L===E&&(K=L===4?shortTarget():Be(oe),he=new Ue(new In(L===4?.055:.045,12,8),new Ft({color:"#eff6b8",transparent:!0,opacity:.95,depthTest:!1})),he.position.copy(K),he.renderOrder=12,g.add(he))}g.visible=!0}function b(){let P=o();return h&&oi.has(_.id)&&ze(E)>0&&(_.id==="frame_assembly"?E===0&&!P.frameItems.placedRings.includes(0)||E===3&&P.frameItems.placedRings.includes(0):E===1&&!P.frameItems.placedRings.includes(1)||E===4&&P.frameItems.placedRings.includes(1))}function J(P){if(!K)return!1;let se=Re(K);return Math.hypot(P.clientX-se.x,P.clientY-se.y)<(P.pointerType==="touch"?54:38)}function ae(P){Ie||!d()||!h||!oi.has(_.id)||!ze(E)||(ee={id:P.pointerId,generation:Ee},te="",P.currentTarget.setPointerCapture&&P.currentTarget.setPointerCapture(P.pointerId),P.preventDefault(),ve(P))}function ve(P){if(!ee)return;let se=re(P,1.35);se&&y.position.copy(se),he&&he.material.color.set(J(P)&&b()?"#87d293":"#eff6b8")}function fe(){Ze(),g.visible=!1,Dt(m),m.visible=!0;let P=N(E),se=Ii(P);P.updateWorldMatrix(!0,!1),P.matrixWorld.decompose(se.position,se.quaternion,se.scale),m.add(se);let L=[];if(E===3)for(let le=0;le<2;le++){let I=s.registry.get("binding-"+(x+1)+"-"+le),z=Ii(I);I.updateWorldMatrix(!0,!1),I.matrixWorld.decompose(z.position,z.quaternion,z.scale),m.add(z),L.push(z)}else if(E===4)for(let le=0;le<3;le++){let I=new Ue(new Lt(.035,.005,6,20),new ke({color:"#f5ead0",roughness:1}));I.position.copy(K),I.position.y+=le*.012,I.rotation.x=Math.PI/2,I.scale.setScalar(.72),m.add(I),L.push(I)}else{let le=new We;le.position.copy(K),m.add(le);for(let I=0;I<5;I++){let z=new Ue(new Lt(.026,.004,6,28),new ke({color:"#f5ead0",roughness:1}));z.rotation.y=Math.PI/2,z.position.x=(I-2)*.01,le.add(z)}L.push(le)}for(let le of L)le.traverse(I=>{I.geometry&&I.geometry.setDrawRange(0,0)});let oe=Fn(m,!1,"pinch");oe.scale.setScalar(.75),Ie={elapsed:0,item:E,index:x,generation:Ee,joints:L,hand:oe},r.play("frame_assembly"),r.play("frame_binding"),te="\u5F53\u524D\u90E8\u4EF6\u6B63\u5728\u7F20\u7EBF\u56FA\u5B9A\uFF0C\u8BF7\u7A0D\u5019\u2026"}function X(){let P=Ie;Ie=null,Dt(m),!(!P||P.generation!==Ee||!(P.item<3?c(P.item):a(_.id,P.index,{mode:"place",quality:1,curve:0,oval:0,dose:0,angle:0,distance:1.5,strip:P.item===4?16+(o().frameItems.shortBinding??0):void 0}))||P.generation!==Ee)&&(te="\u8FD9\u4E00\u4EF6\u5DF2\u7ED1\u7262\uFF0C\u7EE7\u7EED\u653E\u7F6E\u4E0B\u4E00\u4E2A\u90E8\u4EF6\u3002",x=o().counts.frame_assembly,ze(E)||(E=_.id==="frame_short_binding"?4:[0,1,2,3].find(L=>ze(L))??3),Me(),k(),R())}function w(P){if(!Ie)return;let se=Ie;se.elapsed+=P;let L=Math.min(1,se.elapsed/1.35),oe=L*se.joints.length;se.joints.forEach((I,z)=>{let Y=Math.max(0,Math.min(1,oe-z));I.traverse(Ae=>{if(Ae.geometry){let Ve=Ae.geometry.index?.count??Ae.geometry.attributes.position.count;Ae.geometry.setDrawRange(0,Math.floor(Ve*Y/3)*3)}})});let le=se.joints[Math.min(se.joints.length-1,Math.floor(oe))];se.hand.rotation.y=Math.sin(L*24)*.35,Gn(se.hand,le.position.clone().add(_n(Math.cos(L*24)*.035,.025,Math.sin(L*24)*.035))),L===1&&X()}function q(P){if(!ee||P.pointerId!==ee.id)return;let se=d()&&J(P)&&b();ee=null,se?fe():(te=E===3&&o().frameItems.placedRings.length<3?"\u5148\u653E\u597D\u4E09\u4E2A\u7AF9\u5708\uFF0C\u518D\u8FDE\u63A5\u7EB5\u5411\u7AF9\u6761\u3002":"\u5C1A\u672A\u653E\u5165\u4EAE\u70B9\uFF0C\u8BF7\u62D6\u5230\u5F53\u524D\u90E8\u4EF6\u7684\u6D45\u7EFF\u8272\u8F6E\u5ED3\u5904\u3002",r.play("blocked"),k())}function ie(){T.release(),h&&_.id==="bamboo_prep"&&ge()}function $(){ie(),ee=null,Ie&&(Ie=null,Dt(m),h&&R(),te="\u7ED1\u624E\u5DF2\u53D6\u6D88\uFF0C\u6750\u6599\u672A\u6D88\u8017\u3002"),xe(null),h&&oi.has(_.id)&&k()}ue.addEventListener("contextmenu",P=>P.preventDefault()),ue.addEventListener("pointerdown",P=>{if(!(!h||!d()))if(_.id==="bamboo_prep"){if(P.button!==0&&P.button!==2||(P.preventDefault(),T.binding))return;if(!T.selected){P.button===0&&Le(Te(P));return}T.hold(P.button===2?-1:1),ue.setPointerCapture(P.pointerId)}else oi.has(_.id)&&P.button===0&&ae(P)}),ue.addEventListener("pointermove",P=>{!h||!d()||_.id==="bamboo_prep"&&!T.selected&&xe(Te(P))}),window.addEventListener("pointermove",P=>{ee&&d()&&P.pointerId===ee.id&&ve(P)}),window.addEventListener("pointerup",P=>{ie(),ee&&q(P)}),window.addEventListener("craft-book-open",ie),window.addEventListener("pointercancel",$),window.addEventListener("blur",$),document.addEventListener("visibilitychange",()=>{document.hidden&&$()});for(let P=0;P<5;P++)je("item-"+P).addEventListener("pointerdown",se=>{se.button===0&&(B(P),ae(se))}),je("item-"+P).onclick=se=>{se.detail===0&&B(P)};for(let[P,se]of[["bend-in",1],["bend-out",-1]]){let L=je(P);L.addEventListener("pointerdown",oe=>{!h||_.id!=="bamboo_prep"||!d()||(oe.preventDefault(),T.hold(se),L.setPointerCapture(oe.pointerId))}),L.addEventListener("pointerup",ie),L.addEventListener("lostpointercapture",ie)}function ye(){je("ring-choice").hidden=!0,h=!1,Ee++,$(),U&&(n.sync(o()),U=null),Dt(p),Dt(g),Dt(m),Ie=null,Ze(),M=S=D=H=null,p.visible=g.visible=y.visible=!1,s.groups.DebugMarkers.visible=!0}function Pe(P,se){ye(),h=!0,_=P,x=se,v=null,T=new Fo,te="",s.groups.DebugMarkers.visible=!1,p.visible=P.id==="bamboo_prep",je("handwork-title").textContent=P.id==="bamboo_prep"?"\u4E00\u7BFE\uFF0C\u5F2F\u6210\u4E00\u53EA\u5708":"\u5148\u642D\u5927\u7B50\uFF0C\u518D\u6536\u53E3",je("handwork-subtitle").textContent=P.id==="bamboo_prep"?"\u58F9 \xB7 \u624E\u67B6\u53F0 / \u8FDE\u7EED\u5236\u5708 \xB7 \u7B2C "+(se+1)+" / 3 \u53EA \xB7 \u81EA\u9009\u5236\u4F5C\u987A\u5E8F":P.id==="frame_short_binding"?"\u8086 \xB7 \u5927\u7B50\u4E3B\u4F53\u5B8C\u6210\u540E \xB7 \u53D6\u4E09\u6839\u8F83\u77ED\u7AF9\u7BFE\u9010\u6839\u6346\u624E\u6536\u53E3":"\u53C1 \xB7 \u5408\u706F\u53F0 / \u62D6\u5165\u9AD8\u4EAE\u70B9\u4F4D \u2192 \u81EA\u52A8\u7F20\u7EBF \u2192 \u9501\u5B9A\uFF0C\u518D\u653E\u4E0B\u4E00\u4EF6",je("handwork-tool").textContent="\u539F\u5DE5\u574A\u573A\u666F \xB7 45\xB0 \u659C\u4FEF\u89C6",je("handwork-rotate-left").hidden=je("handwork-rotate-right").hidden=!0,je("bend-gauge").hidden=P.id!=="bamboo_prep",je("bend-controls").hidden=P.id!=="bamboo_prep",je("handwork-confirm").textContent="\u786E\u8BA4\u56FA\u5B9A \xB7 \u7EB8\u7247\u7ED1\u624E",je("handwork-confirm").hidden=P.id!=="bamboo_prep",je("handwork-retry").hidden=P.id!=="bamboo_prep",je("handwork-next").hidden=!0,je("handwork-retry").onclick=()=>{T.binding||($(),n.sync(o()),U=null,T.reset(),te="",ce(),ne())},je("handwork-confirm").onclick=()=>{d()&&T.confirm()&&(r.play("frame_binding"),je("handwork-retry").disabled=!0)},P.id==="bamboo_prep"?(je("ring-choice").hidden=!1,ne(),ce()):(E=P.id==="frame_short_binding"?4:[0,1,2,3].find(L=>ze(L))??3,k(),R()),Me()}function Se(){ye(),h=!0,_={id:"rings_ready"},je("handwork-title").textContent="\u4E09\u53EA\u7AF9\u5708\uFF0C\u6536\u597D\u5F85\u88C5",je("handwork-subtitle").textContent="\u5927\u5708 \xB7 \u53E3\u5708 \xB7 \u8170\u7B8D\u5DF2\u5165\u7269\u54C1\u680F\u3002\u7AF9\u6761\u4ECD\u7559\u5728\u53F0\u4E0A\uFF0C\u4E0D\u5FC5\u9000\u51FA\u5DE5\u4F5C\u53F0\u3002",je("bend-gauge").hidden=je("bend-controls").hidden=!0,je("handwork-confirm").hidden=je("handwork-retry").hidden=!0,je("handwork-next").hidden=!1,je("handwork-next").textContent="\u5F00\u59CB\u642D\u6846 \u2192 \u5408\u706F\u53F0",je("handwork-next").onclick=f,_e("\u7AF9\u5708\u5DF2\u6536\u8FDB\u4E0B\u65B9\u7269\u54C1\u680F\u3002\u51C6\u5907\u597D\u540E\uFF0C\u5E73\u6ED1\u79FB\u6B65\u5408\u706F\u53F0\u7EE7\u7EED\u7EC4\u88C5\u3002",!0),Me()}return{open:Pe,close:ye,completedRings:Se,selectItem:B,refreshInventory:Me,get active(){return h},update(P,se){if(!h){W&&(e.updateMatrixWorld(),y.position.copy(e.localToWorld(_n(.26,-.32,-.85))),y.quaternion.copy(e.quaternion));return}if(_.id==="bamboo_prep"){if(T.tick(P),T.direction&&se-be>330&&(r.play("bamboo_prep"),be=se),ge(),T.finished){T.finished=!1;let L=Ee,oe={...T.evidence(),ringType:v};je("handwork-retry").disabled=!1,a(_.id,x,oe)&&Ee===L&&(te="\u7AF9\u5708\u5DF2\u5165\u680F\u3002")}}else if(oi.has(_.id)){if(w(P),!h||!oi.has(_.id))return;he&&he.scale.setScalar(1+Math.sin(se*.004)*.14),_e(te||(_.id==="frame_short_binding"?"\u62D6\u52A8\u8F83\u77ED\u7AF9\u7BFE\u5230\u5C0F\u5708\u9644\u8FD1\u7684\u9AD8\u4EAE\u70B9 \xB7 \u5DF2\u6346 "+o().frameItems.shortBinding+"/3":"\u62D6\u52A8 "+jf[E]+" \u5230\u9AD8\u4EAE\u70B9 \xB7 \u7AF9\u5708 "+o().frameItems.placedRings.length+"/3 \xB7 \u7EB5\u6761 "+o().counts.frame_assembly+"/12"))}},snapshot(){return{stage:_?.id,mode:_?.id==="bamboo_prep"?"bend":"inventory-place",ringType:v,curve:T.curve,ready:T.ready,selected:T.selected,strip:T.strip,binding:T.binding||!!Ie,wrapping:Ie?Ie.elapsed/1.35:T.wrapping,item:E,mounting:!!Ie,stripLength:Oo[v??0],stripWidth:bs,gripSpacing:me(ko[0]).distanceTo(me(ko[1])),dragging:!!ee,target:K?Re(K):null,stock:n.bambooStock.filter(P=>P.visible).map(P=>({index:P.userData.stockIndex,...Re(P.getWorldPosition(_n()))})),inventory:[0,1,2,3,4].map(ze)}}}}var St=i=>document.getElementById(i);function ep({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:a,onInstall:c,onCollect:l,onFinish:u,onGlue:f,onDiscardDye:d,onFocus:p,onSelectTool:g,onExit:y,isMoving:m}){let h=!1,_=null,x=null,v=!1,T=$f({scene:i,camera:e,canvas:t,world:n,audio:r,getState:o,onComplete:H,onDiscardDye:d,canInteract:()=>!m()&&!document.querySelector("dialog[open]")}),E=Kf({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:H,canInteract:()=>!m()&&!document.querySelector("dialog[open]")}),C=Zf({scene:i,camera:e,canvas:t,lantern:s,audio:r,getState:o,onGlue:f,onComplete:H,canInteract:()=>!m()&&!document.querySelector("dialog[open]")}),U=Qf({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:H,onInstall:c,onCollect:l,onFinish:()=>{u()&&S(lt(o()),!0)},canInteract:()=>!m()&&!document.querySelector("dialog[open]")});function M(){for(let F of["handwork-confirm","handwork-retry"])St(F).hidden=!1,St(F).disabled=!1;St("handwork-confirm").textContent="\u786E\u8BA4\u672C\u6B21\u624B\u4F5C \u2192",St("handwork-retry").textContent="\u91CD\u505A\u672C\u6B21",St("bend-gauge").hidden=St("bend-controls").hidden=St("handwork-next").hidden=!0}function S(F,W=!1){let K=ts(F.id)!==ts(x?.id);E.close(),U.close(),C.close(),T.close(),M(),x=F,v=!1,h=!0,St("handwork").hidden=!1,document.body.classList.add("handworking"),(W||K||_!==F.station)&&p(F.station,F.id),_=F.station,g(F.tool),["bamboo_prep","frame_assembly","frame_short_binding"].includes(F.id)?U.open(F,o().counts[F.id]):ts(F.id)?C.open(F,o().counts[F.id]):Bf.includes(F.id)?T.open(F,o().counts[F.id]):F.tool?E.open(F,o().counts[F.id]):D(F),St("handwork-close").onclick=G,U.refreshInventory()}function D(F){E.close(),U.close(),C.close(),T.close(),v=!0,x=F,M(),St("handwork-title").textContent=F.name,St("handwork-subtitle").textContent="\u4ECD\u5728\u539F\u5DE5\u574A \xB7 \u5DF2\u5B8C\u6210\u7684\u6750\u6599\u548C\u90E8\u4EF6\u5168\u90E8\u4FDD\u7559",St("handwork-tool").textContent="\u4E0B\u4E00\u9053\u5DE5\u5E8F",St("handwork-confirm").hidden=St("handwork-retry").hidden=St("handwork-rotate-left").hidden=St("handwork-rotate-right").hidden=!0,St("handwork-next").hidden=!F.tool,St("handwork-next").textContent="\u7EE7\u7EED \u2192 "+n.stations[F.station].name,St("handwork-next").onclick=()=>S(F,!0),St("handwork-status").textContent=F.tool?"\u672C\u5DE5\u4F4D\u5DF2\u5B8C\u6210\uFF0C\u53EF\u4EE5\u524D\u5F80\u4E0B\u4E00\u5F20\u5DE5\u4F5C\u53F0\u3002":"\u7EB8\u5F20\u6B63\u5728\u901A\u98CE\u9634\u5E72\uFF0C\u5E72\u900F\u540E\u7EE7\u7EED\u538B\u6A21\u3002"}function H(F,W,K){if(!h||m()||!a(F,W,K))return!1;let he=lt(o());return o().complete?(G(),!0):he.station!==_||!he.tool?(D(he),U.refreshInventory(),!0):(S(he),!0)}function G(){h&&(E.close(),U.close(),C.close(),T.close(),h=!1,v=!1,St("handwork").hidden=!0,document.body.classList.remove("handworking","workbench-moving"),y?.(_),St("craft-action").focus())}return window.addEventListener("keydown",F=>{if(document.querySelector("dialog[open]")||h&&F.target.matches?.("#press-mode, #handwork-confirm, #hint-toggle, #help-toggle")&&["Space","Enter","ArrowUp","ArrowDown"].includes(F.code))return;if(h&&T.active&&F.code==="KeyE"){F.preventDefault(),F.stopImmediatePropagation(),F.repeat||T.interact();return}if(h&&C.active&&/^Digit[1-2]$/.test(F.code)){F.preventDefault(),F.stopImmediatePropagation(),F.repeat||C.selectTool(F.code==="Digit1"?"brush":"paper");return}let W=/^Digit([1-5])$/.exec(F.code);if(W&&(h&&!E.active&&!C.active&&!T.active||F.altKey&&!C.active)){F.preventDefault(),F.stopImmediatePropagation(),F.repeat||U.selectItem(Number(W[1])-1);return}if(h&&(F.code==="Escape"&&(F.preventDefault(),F.stopImmediatePropagation(),G()),["Space","KeyE","KeyF","KeyZ","KeyY","Tab"].includes(F.code)&&(F.preventDefault(),F.stopImmediatePropagation(),F.code==="Tab"))){let K=[...St("handwork").querySelectorAll("button, select"),...St("craft-inventory").querySelectorAll("button"),St("hint-toggle"),St("help-toggle")].filter(ee=>!ee.hidden&&!ee.disabled&&ee.getClientRects().length),he=K.indexOf(document.activeElement);K[(he+(F.shiftKey?-1:1)+K.length)%K.length]?.focus()}},!0),{scene:i,camera:e,get active(){return h},open(F,W){S(F,!0)},close:G,refreshInventory:()=>U.refreshInventory(),update(F,W){if(!document.querySelector("dialog[open]")&&(U.update(F,W),!!h&&(document.body.classList.toggle("workbench-moving",m()),m()||(E.update(F,W),C.update(F,W),T.update(F,W)),v&&!x.tool))){let K=lt(o());K.id!==x.id&&D(K)}},snapshot(){return{active:h,station:_,moving:m(),...U.active?U.snapshot():C.active?C.snapshot():T.active?T.snapshot():E.active?E.snapshot():{stage:x?.id,mode:"waiting"}}},project:F=>E.project(F)}}function tp(i=document){let e=null;i.addEventListener("touchstart",t=>{let n=t.target.closest?.("button:not([data-key])"),s=t.touches[0];e=n&&!n.disabled&&t.touches.length===1?{button:n,id:s.identifier,x:s.clientX,y:s.clientY}:null},{passive:!0}),i.addEventListener("touchmove",t=>{if(!e)return;let n=[...t.touches].find(s=>s.identifier===e.id);(!n||t.touches.length!==1||Math.hypot(n.clientX-e.x,n.clientY-e.y)>10)&&(e=null)},{passive:!0}),i.addEventListener("touchcancel",()=>e=null,{passive:!0}),i.addEventListener("touchend",t=>{let n=e;if(e=null,!n||t.touches.length)return;let s=[...t.changedTouches].find(r=>r.identifier===n.id);!s||n.button.disabled||!n.button.contains(document.elementFromPoint(s.clientX,s.clientY))||(t.preventDefault(),n.button.focus({preventScroll:!0}),n.button.click())},{passive:!1})}tp();var we=i=>document.getElementById(i),Kt;try{Kt=new ec({canvas:we("scene"),antialias:!0,alpha:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"})}catch(i){throw we("loading").innerHTML="<p>\u5F53\u524D\u6D4F\u89C8\u5668\u672A\u80FD\u542F\u7528 WebGL\u3002<br>\u8BF7\u5F00\u542F\u786C\u4EF6\u52A0\u901F\u540E\u5237\u65B0\u3002</p>",i}Kt.setPixelRatio(Math.min(devicePixelRatio,1.65));Kt.setSize(innerWidth,innerHeight);Kt.shadowMap.enabled=!0;Kt.shadowMap.type=sl;Kt.outputColorSpace=kt;Kt.toneMapping=dl;Kt.toneMappingExposure=1.08;var Rr=new no,tt=new Wt(48,innerWidth/innerHeight,.06,40),On=Hf(Rr),jt=Of();jt.root.position.set(0,1.08,0);jt.root.scale.setScalar(.86);Rr.add(jt.root);var Ar=null,dc=!0,ap=!1;try{let i=localStorage.getItem(Jo);if(i)try{Ar=Nf(JSON.parse(i))}catch{}if(!Ar&&!i){let e=localStorage.getItem(hh);if(e)try{Ar=Uf(JSON.parse(e)),ap=!!Ar}catch{}}}catch{dc=!1}var Oe=new No(Ar||br()),Xn=!1,En=!1,fc="bamboo",pc="assembly",Gt=null,qo=!1,Yo=!1,Es=-1,Yx=!1;var $x=-1e4,np=null,ip="",lp=-10,ws=!1,sp=0,rp=0,Xo=0,Jt=new Set,op=new Ln,Ss=new O,Tr=new fn(0,0,0,"YXZ"),pi=null,cp=Ff();jt.sync(cp);On.sync(cp);var up=new O(3.45,2.8,4.8),hp=new O(-.7,1.78,0);tt.position.copy(up);tt.lookAt(hp);function Qt(i){i===ip&&we("toast").classList.contains("visible")||(ip=i,we("toast").textContent=i,we("toast").classList.add("visible"),clearTimeout(np),np=setTimeout(()=>we("toast").classList.remove("visible"),2800))}function dp(){try{localStorage.setItem(Jo,JSON.stringify(Oe.state)),dc=!0}catch{dc=!1}we("save-status").textContent=dc?"\u8FDB\u5EA6\u5DF2\u81EA\u52A8\u4FDD\u5B58 \xB7 \u672C\u673A":"\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528 \xB7 \u672C\u6B21\u8FDB\u5EA6\u6682\u5B58\u5185\u5B58"}var Qu;try{Qu=localStorage}catch{}function fp(i){we("sound-toggle").textContent=i.available?`\u97F3\u6548\uFF1A${i.enabled&&i.volume>0?"\u5F00":"\u5173"}`:"\u97F3\u6548\u4E0D\u53EF\u7528",we("sound-toggle").setAttribute("aria-pressed",String(i.enabled)),we("sound-toggle").disabled=!i.available,we("sound-volume").value=String(Math.round(i.volume*100)),we("sound-volume-value").textContent=Math.round(i.volume*100)+"%",we("sound-volume").disabled=!i.available}var _t=Gf({storage:Qu,onChange:fp});fp(_t.snapshot());function pp(i){for(let e of document.querySelectorAll("[data-music-toggle]"))e.textContent=i.error?"\u97F3\u4E50\uFF1A\u91CD\u8BD5":i.blocked?"\u97F3\u4E50\uFF1A\u70B9\u51FB\u64AD\u653E":`\u97F3\u4E50\uFF1A${i.enabled?"\u5F00":"\u5173"}`,e.setAttribute("aria-pressed",String(i.enabled)),e.title="\u80CC\u666F\u97F3\u4E50\uFF1A\u8D75\u5FBD\u67D4 \u2014 \u6F2B\u591C\u661F\uFF08\u72EC\u7ACB\u4E8E\u5236\u4F5C\u97F3\u6548\uFF09";we("music-volume").value=String(Math.round(i.volume*100)),we("music-volume-value").textContent=Math.round(i.volume*100)+"%"}var ai=uh({storage:Qu,onChange:pp});pp(ai.snapshot());document.querySelectorAll("[data-music-toggle]").forEach(i=>i.onclick=()=>ai.toggle());we("music-volume").oninput=i=>ai.setVolume(Number(i.target.value)/100);var cn=ep({canvas:we("scene"),scene:Rr,camera:tt,world:On,lantern:jt,audio:_t,getState:()=>Oe.state,onComplete:jx,onInstall:i=>Oe.installRing(i)?(ln(),!0):!1,onCollect:i=>Oe.collectStrip(i)?(ln(),!0):!1,onFinish:()=>Oe.finishPreparation(),onDiscardDye:()=>Oe.discardDye()?(ln(),!0):!1,onGlue:(i,e)=>Oe.glue(i,e)?(ln(),!0):!1,onSoak:(i,e)=>Oe.soak(i,e)?(ln(),!0):!1,onTrim:(i,e)=>Oe.trim(i,e)?(ln(),lt(Oe.state).id==="lining_upper"?(cn.open(lt(Oe.state),Oe.state.counts.lining_upper),"next"):lt(Oe.state).id!=="lining_lower"?(cn.close(),Qt("\u767D\u5E03\u88C1\u8FB9\u5B8C\u6210\uFF0C\u8FDB\u5165\u4E0B\u4E00\u9053\u5DE5\u5E8F\u3002"),"done"):!0):!1,onFocus:Jx,onSelectTool:i=>{i&&Ts(i)},isMoving:()=>!!Gt,onExit:i=>{Jt.clear(),Wn(i)}});dh({getStage:()=>Oe.state.stage,onOpen:Rs});function Ts(i){Xn&&fc!==i&&_t.play("tool"),fc=i}var mp=[["largeRing","\u5927\u5708","ring ring-0","\u5DF2\u624E\u597D\u7684\u5927\u5708\uFF0C\u5B89\u88C5\u5230\u9AA8\u67B6\u540E\u6263\u9664"],["mouthRing","\u53E3\u5708","ring ring-1","\u5DF2\u624E\u597D\u7684\u53E3\u5708\uFF0C\u5B89\u88C5\u5230\u9AA8\u67B6\u540E\u6263\u9664"],["waistRing","\u8170\u7B8D","ring ring-2","\u5DF2\u624E\u597D\u7684\u8170\u7B8D\uFF0C\u5B89\u88C5\u5230\u9AA8\u67B6\u540E\u6263\u9664"],["cutPaper","\u526A\u7EB8","cut-paper","\u5F85\u67D3\u65B9\u7EB8\u53CA\u5DF2\u88C1\u6210\u5F62\u7684\u82B1\u74E3\u3001\u53F6\u7247\uFF1B\u67D3\u8272\u6216\u5B89\u88C5\u540E\u6263\u9664"],["dyedPaper","\u67D3\u7EB8","dyed-paper","\u6309\u5B9E\u9645\u64CD\u4F5C\u4EFD\u6570\u8BA1\uFF1A\u4E00\u4EFD\u7C89\u7D2B\u7EB8\u5BF9\u5E946\u7247\u82B1\u74E3\u7528\u7EB8\uFF0C\u4E00\u4EFD\u7EFF\u8272\u7EB8\u5BF9\u5E947\u7247\u53F6\u7247\u7528\u7EB8\uFF1B\u9634\u5E72\u548C\u538B\u7EB9\u4E0D\u589E\u51CF\uFF0C\u88C1\u5F62\u540E\u6263\u9664\u4E00\u4EFD"]];for(let[i,[e,t,n,s]]of mp.entries()){let r=i<3?we("item-"+i):document.createElement("div");i>=3&&(r.className="inventory-item stock-item",r.tabIndex=0,r.innerHTML=`<i class="item-drawing ${n}" aria-hidden="true"></i><span>${t}${e==="dyedPaper"?" / \u4EFD":""}</span><b class="item-count">0</b>`,we("inventory-slots").insertBefore(r,we("lining-brush"))),r.dataset.stock=e,r.title=s}new ResizeObserver(()=>document.documentElement.style.setProperty("--inventory-height",we("craft-inventory").offsetHeight+"px")).observe(we("craft-inventory"));function Zx(){let i=Pf(Oe.state),e=If(Oe.state),t=Math.max(0,dt.flowerCount-Oe.state.counts.top_flower_assembly),n=we("inventory-flower");n.querySelector(".item-count").textContent=String(t),n.classList.toggle("empty",t===0),n.title="\u82B1\u5934\uFF0C\u5269\u4F59 "+t+" \u7EC4\u3002\u63A5\u82B1\u5934\u65F6\u4ECE\u80CC\u5305\u62D6\u5230\u9AD8\u4EAE\u8F6E\u5ED3\uFF0C\u677E\u5F00\u5DE6\u952E\u5B89\u88C5\u3002",n.setAttribute("aria-label",n.title);for(let[s,r,,o]of mp){let a=document.querySelector(`[data-stock="${s}"]`),c=i[s],l=s==="dyedPaper"?"\u4EFD":s.endsWith("Ring")?"\u4E2A":"\u5F20",u=s==="dyedPaper"?`\u7C89\u7EA2\u8272\u82B1\u74E3\u7EB8 ${e.petal} \u4EFD\u3002`:"";a.querySelector("b").textContent=String(c),a.classList.toggle("empty",c===0),a.title=`${r}\uFF0C\u5269\u4F59 ${c} ${l}\u3002${u}${o}`,a.setAttribute("aria-label",a.title)}}function As(){let i=lt(Oe.state),e=Oe.state.counts[i.id],t=Zu(Oe.state),n=Oe.state.complete;we("stage-number").textContent=`${String(It.slice(0,Oe.state.stage+1).filter(r=>!r.automatic).length).padStart(2,"0")} / ${It.filter(r=>!r.automatic).length}`,we("stage-title").textContent=n?"\u706F\u6210\uFF0C\u82B1\u5F00":i.name,we("stage-hint").textContent=n?"\u8FD9\u76CF\u706F\u5DF2\u7ECF\u5B8C\u6210\u3002\u8F6C\u52A8\u706F\u4F53\u3001\u9010\u5C42\u9690\u85CF\u82B1\u74E3\uFF0C\u6216\u5C55\u5F00\u67E5\u770B\u6BCF\u4E00\u4E2A\u8FDE\u63A5\u90E8\u4EF6\u3002":i.hint,we("stage-count").textContent=`${e} / ${i.total} ${i.unit}`,we("stage-percent").textContent=`${Math.round(e/i.total*100)}%`,we("stage-bar").style.width=`${e/i.total*100}%`;let s=Zu(Oe.state,"leaves");we("inventory").textContent=`\u82B1\u74E3\u7EB8\uFF1A\u672A\u67D3 ${t.raw} \xB7 \u9634\u5E72\u4E2D ${t.wet} \xB7 \u5DF2\u538B\u6A21 ${t.pressed} \xB7 \u5DF2\u6298\u624E ${t.formed}
\u5DF2\u8D34\u7C89\u8272\u82B1\u74E3 ${t.installed} / ${dt.petals.count}
\u6210\u54C1\u7EFF\u8272\u53F6\u7247\uFF1A\u5F85\u8D34 ${s.raw} \xB7 \u5DF2\u8D34 ${s.installed} / ${dt.leafCount}`,we("inventory").style.whiteSpace="pre-line",we("phase-title").textContent=`\u9636\u6BB5 ${i.phase+1} / ${Ps.length} \xB7 ${Ps[i.phase]}`,we("phase-track").innerHTML=Ps.map((r,o)=>`<span class="${n||o<i.phase?"done":o===i.phase?"current":""}" title="${o+1} \xB7 ${r}" ${!n&&o===i.phase?'aria-current="step"':""}>${o+1}. ${r}</span>`).join(""),we("action-location").textContent=n?"\u4F5C\u54C1 001 \xB7 \u79E6\u6DEE\u8377\u82B1\u706F":On.stations[i.station].name,we("action-text").textContent=n?"\u6B23\u8D4F\u6210\u54C1 \xB7 \u67E5\u770B\u5236\u4F5C\u6210\u679C":"\u52A8\u624B \xB7 "+i.action,we("craft-action").disabled=i.id==="paper_drying",we("go-station").innerHTML=`\u524D\u5F80${On.stations[i.station].name.split("\xB7")[1]} <span>\u2197</span>`,we("total-progress").textContent=`\u5168\u7A0B ${Lf(Oe.state)}%`,we("undo").disabled=!Oe.history.length,we("redo").disabled=!Oe.future.length,we("light-toggle").disabled=!n,we("skip-stage").disabled=we("handwork-skip-stage").disabled=n,we("previous-stage").disabled=we("handwork-previous-stage").disabled=Oe.state.stage===0,we("frame-toggle").setAttribute("aria-pressed",String(qo)),we("explode-toggle").setAttribute("aria-pressed",String(Yo)),we("layer-toggle").textContent=Es<0?"\u9690\u85CF\u82B1\u74E3\u5C42":`\u5DF2\u9690\u85CF\u7B2C ${Es+1} \u5C42`,Zx(),Ts(i.tool),we("view-mode").textContent=En?"\u7B2C\u4E00\u4EBA\u79F0 \xB7 \u81EA\u7531\u8D70\u52A8":"\u7B2C\u4E00\u4EBA\u79F0 \xB7 \u5DE5\u4F4D\u8FD1\u666F",we("free-walk").innerHTML=En?"\u56DE\u5230\u5F53\u524D\u5DE5\u4F4D <kbd>F</kbd>":"\u81EA\u7531\u8D70\u52A8 <kbd>F</kbd>",we("touch-movement").hidden=!(En&&matchMedia("(pointer:coarse)").matches)}function ln(){jt.sync(Oe.state),On.sync(Oe.state),As(),cn.refreshInventory(),dp()}function Cr(){qo=!1,Yo=!1,Es=-1,jt.restore(),document.querySelectorAll("[data-part]").forEach(i=>i.checked=!0),As()}function mi(){Yx=!1,we("hold-progress").style.width="0%"}function Rs(){document.pointerLockElement&&document.exitPointerLock(),Jt.clear(),mi()}function Ir(i){Rs();let e=we(i);e.open||e.showModal()}function Jx(i,e){Rs(),En=!1,pc=i,document.body.classList.remove("freewalk"),document.body.classList.toggle("sitting-down",ts(e));let t=On.stations[i],n=ts(e),s=new O(t.x,n?1.25:i==="assembly"||i==="dye"?1.43:1.08,t.z),r=n?3.55:i==="assembly"?2.35:i==="dye"?2.2:1.75,o=n?new O(t.x,1.58,t.z+3.55):s.clone().add(new O(0,r,r)),a=new Wt;a.position.copy(o),a.lookAt(s),Gt={start:performance.now(),duration:n?1450:1100,seated:n,from:tt.position.clone(),to:o,qFrom:tt.quaternion.clone(),qTo:a.quaternion.clone()}}function Wn(i){Rs(),En=!1,document.body.classList.remove("freewalk","sitting-down"),pc=i;let e=On.stations[i],t=e.look.clone(),n=e.position.clone();i==="assembly"&&(innerWidth<700?(n.set(0,2.35,3.4),t.set(0,2.25,0)):(n.set(0,2.08,3.13),t.set(0,1.92,0)));let s=new Wt;s.position.copy(n),s.lookAt(t),Gt={start:performance.now(),from:tt.position.clone(),to:n,qFrom:tt.quaternion.clone(),qTo:s.quaternion.clone()},As()}function gp(i=!1){ai.start(),_t.resume(),_t.play("enter"),i||(Oe.reset(),dp()),Xn=!0,ws=Oe.state.complete,jt.root.rotation.y=0,we("intro").hidden=!0,we("hero-caption").hidden=!0,we("game-ui").hidden=!1,document.body.classList.add("playing"),Cr(),ln(),Wn(lt(Oe.state).station),Qt(i?ap?"\u5DF2\u4FDD\u7559\u65E7\u7248\u7AF9\u9AA8\u8FDB\u5EA6\uFF0C\u8BF7\u7EE7\u7EED\u88F1\u7CCA\u4E0E\u540E\u7EED\u5236\u4F5C\u3002":"\u6B22\u8FCE\u56DE\u6765\uFF0C\u63A5\u7740\u505A\u8FD9\u76CF\u706F\u3002":"\u5148\u9009\u7AF9\u7BFE\uFF0C\u5728\u624E\u67B6\u53F0\u5F2F\u51FA\u4E09\u53EA\u5708\u6761\u3002")}we("begin").onclick=()=>gp(!1);we("resume").hidden=!Ar;we("resume").onclick=()=>gp(!0);we("hint-toggle").onclick=()=>{let i=document.body.classList.toggle("guide-minimized");we("guide-content").hidden=i,we("hint-toggle").setAttribute("aria-expanded",String(!i)),we("hint-toggle").textContent=i?"\u5C55\u5F00\u6307\u5BFC \uFF0B":"\u6700\u5C0F\u5316 \u2212",we("hint-toggle").title=i?"\u5C55\u5F00\u5DE5\u5E8F\u6307\u5BFC":"\u6700\u5C0F\u5316\u5DE5\u5E8F\u6307\u5BFC"};we("go-station").onclick=()=>Wn(lt(Oe.state).station);we("home-view").onclick=()=>Wn("assembly");function Kx(){let i=lt(Oe.state),e=On.stations[i.station];if(Math.hypot(tt.position.x-e.x,tt.position.z-e.z)>(i.station==="assembly"?3.45:2.65))return!1;if(En){tt.getWorldDirection(Ss);let n=new O(e.x,1.25,e.z).sub(tt.position).normalize();return Ss.dot(n)>.6}return pc===i.station}function eh(){if(!Xn||cn.active||document.querySelector("dialog[open]"))return!1;if(Oe.state.complete)return Ir("complete-dialog"),!1;if(Gt)return Qt("\u6B63\u5728\u524D\u5F80\u5DE5\u4F4D\uFF0C\u8BF7\u7A0D\u5019\u3002"),!1;if(!Kx())return _t.play("blocked"),Qt(`\u8BF7\u524D\u5F80${On.stations[lt(Oe.state).station].name}\uFF0C\u9762\u5411\u5DE5\u4F5C\u53F0\u5236\u4F5C\u3002`),!1;let i=lt(Oe.state);return i.tool?(Ts(i.tool),Rs(),Cr(),cn.open(i,Oe.state.counts[i.id]),!0):!1}function jx(i,e,t){let n=lt(Oe.state);if(n.id!==i||Oe.state.counts[n.id]!==e)return!1;let s=Oe.state.stage,r=Oe.act(n.tool,Date.now(),t);return r.ok?($x=performance.now(),lp=Xo,_t.play(r.stage),ln(),Oe.state.stage!==s&&(It[s].phase!==lt(Oe.state).phase&&_t.play("phase_done"),mi(),Qt(`${It[s].name}\u5B8C\u6210 \xB7 \u4E0B\u4E00\u6B65\uFF1A${lt(Oe.state).name}`)),Oe.state.complete&&!ws&&(ws=!0,mi(),Wn("assembly"),setTimeout(()=>Ir("complete-dialog"),850)),!0):(_t.play("blocked"),Qt(r.message),!1)}we("craft-action").addEventListener("click",eh);function Qx(){if(!Xn||Oe.state.complete||document.querySelector("dialog[open]"))return;let i=Oe.skipStage();if(!i.ok){Qt(i.message);return}let e=cn.active;cn.close(),Rs(),pi=null,Cr();let t=lt(Oe.state);t.tool&&Ts(t.tool),_t.play("ui"),ln(),Qt(i.message+(Oe.state.complete?"":" \xB7 \u4E0B\u4E00\u6B65\uFF1A"+t.name)),Oe.state.complete?(ws=!0,Wn("assembly"),Ir("complete-dialog")):e?cn.open(t,Oe.state.counts[t.id]):Wn(t.station)}we("skip-stage").onclick=we("handwork-skip-stage").onclick=Qx;function ev(){if(!Xn||document.querySelector("dialog[open]"))return;let i=Oe.previousStage();if(!i.ok){Qt(i.message);return}let e=cn.active;mi(),cn.close(),Rs(),pi=null,Cr(),ws=!1;let t=lt(Oe.state);t.tool&&Ts(t.tool),_t.play("undo"),ln(),Qt(i.message),e?cn.open(t,Oe.state.counts[t.id]):Wn(t.station)}we("previous-stage").onclick=we("handwork-previous-stage").onclick=ev;window.addEventListener("pointerup",mi);we("undo").onclick=()=>{mi(),Oe.undo()&&(_t.play("undo"),ws=!1,ln(),Qt("\u5DF2\u64A4\u9500\u4E0A\u4E00\u6B65\u3002"))};we("redo").onclick=()=>{Oe.redo()&&(_t.play("ui"),ln(),Qt("\u5DF2\u91CD\u505A\u4E0A\u4E00\u6B65\u3002"))};we("reset-stage").onclick=()=>{mi(),Oe.resetStage()?(ln(),Qt("\u672C\u5DE5\u5E8F\u5DF2\u91CD\u7F6E\u3002")):Qt("\u672C\u6B21\u6253\u5F00\u540E\uFF0C\u5F53\u524D\u5DE5\u5E8F\u5C1A\u65E0\u53EF\u91CD\u7F6E\u7684\u64CD\u4F5C\u3002")};we("restart").onclick=()=>Ir("reset-dialog");we("confirm-reset").onclick=()=>{we("reset-dialog").close(),Oe.reset(),ws=!1,Cr(),ln(),Wn("bamboo"),Ts("bamboo")};we("frame-toggle").onclick=()=>{qo=!qo,jt.setFrame(qo),As()};we("explode-toggle").onclick=()=>{Yo=!Yo,jt.setExploded(Yo),As()};we("layer-toggle").onclick=()=>{Es=Es===dt.petals.layers-1?-1:Es+1,jt.setLayer(Es),As()};we("restore-view").onclick=Cr;we("light-toggle").onclick=()=>{Oe.state.complete&&(Oe.state.lit=!Oe.state.lit,_t.play(Oe.state.lit?"light_on":"light_off"),ln())};for(let i of document.querySelectorAll("[data-part]"))i.onchange=()=>jt.setPartVisibility(i.dataset.part,i.checked);we("reference-open").onclick=()=>Ir("reference-dialog");we("help-toggle").onclick=()=>Ir("help-dialog");for(let i of document.querySelectorAll("[data-close]"))i.onclick=()=>i.closest("dialog").close();for(let i of document.querySelectorAll("[data-ref]"))i.onclick=()=>{document.querySelectorAll("[data-ref]").forEach(e=>e.classList.toggle("active",e===i)),we("reference-image").src=`./workshop/references/${i.dataset.ref}.png`,we("reference-image").alt=i.dataset.ref==="finished"?"\u7528\u6237\u63D0\u4F9B\u7684\u8377\u82B1\u706F\u6210\u54C1\u56DB\u89C6\u56FE":"\u7528\u6237\u63D0\u4F9B\u7684\u771F\u5B9E\u5236\u4F5C\u8FC7\u7A0B\u56FE\u8C31"};we("keep-looking").onclick=()=>{we("complete-dialog").close(),Wn("assembly")};we("capture").onclick=()=>{Kt.render(Rr,tt);let i=document.createElement("a");i.download="\u79E6\u6DEE\u8377\u82B1\u706F-\u6211\u7684\u4F5C\u54C1.png",i.href=Kt.domElement.toDataURL("image/png"),i.click(),Qt("\u4F5C\u54C1\u7559\u5F71\u5DF2\u4FDD\u5B58\u3002")};we("sound-toggle").onclick=()=>{_t.setEnabled(!_t.snapshot().enabled),_t.snapshot().enabled&&_t.play("tool")};we("sound-volume").oninput=i=>_t.setVolume(Number(i.target.value)/100);we("sound-volume").onchange=()=>_t.play("check");var tv=new Set(["go-station","home-view","frame-toggle","explode-toggle","layer-toggle","restore-view","reset-stage","reference-open","help-toggle","keep-looking","capture","hint-toggle","free-walk"]);document.addEventListener("click",i=>{let e=i.target.closest("button");e&&(tv.has(e.id)||e.hasAttribute("data-close")||e.hasAttribute("data-ref"))&&_t.play("ui")});document.addEventListener("visibilitychange",()=>{document.hidden?(_t.pause(),ai.pause()):(_t.resume(),ai.resume())});window.addEventListener("pagehide",()=>{_t.pause(),ai.pause()});window.addEventListener("pageshow",()=>{_t.resume(),ai.resume()});window.addEventListener("focus",()=>{document.hidden||(_t.resume(),ai.resume())});function _p(){if(Xn){if(En){Wn(lt(Oe.state).station);return}Gt=null,En=!0,document.body.classList.add("freewalk"),As(),Qt("WASD \u79FB\u52A8 \xB7 \u70B9\u51FB\u573A\u666F\u540E\u7528\u9F20\u6807\u73AF\u987E \xB7 Esc \u91CA\u653E\u9F20\u6807")}}we("free-walk").onclick=_p;function yp(i,e){Tr.setFromQuaternion(tt.quaternion),Tr.y-=i*.0024,Tr.x=Xt.clamp(Tr.x-e*.0024,-1.25,1.25),Tr.z=0,tt.quaternion.setFromEuler(Tr)}we("scene").addEventListener("click",()=>{Xn&&En&&!matchMedia("(pointer:coarse)").matches&&we("scene").requestPointerLock?.()?.catch?.(()=>Qt("\u9F20\u6807\u9501\u5B9A\u4E0D\u53EF\u7528\uFF0C\u53EF\u6309\u4F4F\u53F3\u952E\u62D6\u52A8\u89C6\u89D2\u3002"))});we("scene").addEventListener("contextmenu",i=>i.preventDefault());we("scene").addEventListener("pointerdown",i=>{Xn&&En&&(i.button===2||i.pointerType==="touch")&&(pi={x:i.clientX,y:i.clientY},we("scene").setPointerCapture(i.pointerId))});we("scene").addEventListener("pointermove",i=>{pi&&(yp(i.clientX-pi.x,i.clientY-pi.y),pi={x:i.clientX,y:i.clientY})});we("scene").addEventListener("pointerup",()=>pi=null);we("scene").addEventListener("pointercancel",()=>pi=null);document.addEventListener("mousemove",i=>{document.pointerLockElement===we("scene")&&En&&yp(i.movementX,i.movementY)});document.addEventListener("pointerlockchange",()=>{document.pointerLockElement||(Jt.clear(),mi())});window.addEventListener("blur",()=>{_t.pause(),ai.pause(),Jt.clear(),mi(),pi=null});window.addEventListener("keydown",i=>{!Xn||cn.active||document.querySelector("dialog[open]")||["INPUT","SELECT","TEXTAREA"].includes(i.target.tagName)||(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","KeyE","KeyQ","KeyR"].includes(i.code)&&i.preventDefault(),Jt.add(i.code),!i.repeat&&(i.code==="KeyF"&&_p(),i.code==="KeyZ"&&we("undo").click(),i.code==="KeyY"&&we("redo").click(),(i.code==="KeyE"||i.code==="Space")&&eh()))});window.addEventListener("keyup",i=>{Jt.delete(i.code),["KeyE","Space"].includes(i.code)&&mi()});for(let i of document.querySelectorAll("[data-key]"))i.onpointerdown=e=>{e.preventDefault(),Jt.add(i.dataset.key),i.setPointerCapture(e.pointerId)},i.onpointerup=i.onpointercancel=()=>Jt.delete(i.dataset.key);function ju(i,e){return Math.abs(i)>5.65||e<-4.5||e>4.9||On.collisions.some(t=>Math.abs(i-t.x)<t.hx&&Math.abs(e-t.z)<t.hz)}function nv(i){if(cn.active||!En||document.querySelector("dialog[open]"))return;let e=(Jt.has("KeyW")||Jt.has("ArrowUp")?1:0)-(Jt.has("KeyS")||Jt.has("ArrowDown")?1:0),t=(Jt.has("KeyD")||Jt.has("ArrowRight")?1:0)-(Jt.has("KeyA")||Jt.has("ArrowLeft")?1:0);if(!e&&!t)return;let n=tt.position.x,s=tt.position.z;tt.getWorldDirection(Ss),Ss.y=0,Ss.normalize();let r=new O().crossVectors(Ss,tt.up),o=Ss.clone().multiplyScalar(e).addScaledVector(r,t).normalize().multiplyScalar(i*(Jt.has("ShiftLeft")?3.4:2)),a=tt.position.x+o.x,c=tt.position.z+o.z;ju(a,tt.position.z)||(tt.position.x=a),ju(tt.position.x,c)||(tt.position.z=c),tt.position.y=Xt.lerp(tt.position.y,1.72,i*5),_t.walk(Math.hypot(tt.position.x-n,tt.position.z-s))}function xp(){tt.fov=innerWidth<700?76:48,tt.aspect=innerWidth/innerHeight,tt.updateProjectionMatrix(),Kt.setPixelRatio(Math.min(devicePixelRatio,1.65)),Kt.setSize(innerWidth,innerHeight),Xn||(tt.position.copy(innerWidth<700?new O(3.4,2.7,5.2):up),tt.lookAt(hp))}window.addEventListener("resize",xp);xp();function vp(i){requestAnimationFrame(vp);let e=Math.min((i-rp)/1e3,.05);if(rp=i,Xo+=e,Gt){let t=Math.min((i-Gt.start)/(Gt.duration||650),1),n=t*t*(3-2*t);if(Gt.seated){let s=Math.min(t/.58,1),r=s*s*(3-2*s),o=Math.max(0,(t-.35)/.65),a=o*o*(3-2*o);tt.position.lerpVectors(Gt.from,Gt.to,a),tt.position.y=Xt.lerp(Gt.from.y,Gt.to.y,r)-Math.sin(Math.PI*r)*.055,tt.quaternion.slerpQuaternions(Gt.qFrom,Gt.qTo,n)}else tt.position.lerpVectors(Gt.from,Gt.to,n),tt.quaternion.slerpQuaternions(Gt.qFrom,Gt.qTo,n);t===1&&(Gt=null,document.body.classList.remove("sitting-down"))}if(!Xn)jt.root.rotation.y=Math.sin(Xo*.17)*.14-.25;else if(nv(e),!cn.active&&!document.querySelector("dialog[open]")&&(Jt.has("KeyQ")&&(jt.root.rotation.y+=e*.8),Jt.has("KeyR")&&(jt.root.rotation.y-=e*.8)),i-sp>150){if(sp=i,ic(Oe.state)&&(ln(),lt(Oe.state).id==="petal_pressing"&&(_t.play("paper_drying"),Qt("\u7EB8\u6599\u5DF2\u5E72\u900F\uFF0C\u53EF\u4EE5\u53BB\u538B\u74E3\u53F0\u4E86\u3002"))),lt(Oe.state).id==="paper_drying"){let t=Math.max(0,...[...Oe.state.papers,...Oe.state.leaves].filter(n=>n.status==="wet").map(n=>n.readyAt-Date.now()));we("action-text").textContent=`\u9634\u5E72\u4E2D \xB7 ${(t/1e3).toFixed(1)} \u79D2`}if(En){op.setFromCamera(new Ce,tt);let t=op.intersectObjects(Object.values(On.stations).map(n=>n.trigger));we("interact-hint").textContent=t[0]&&t[0].distance<3?`${On.stations[t[0].object.userData.station].name} \xB7 E \u52A8\u624B\u64CD\u4F5C`:""}else we("interact-hint").textContent=""}On.animate(Xo,Math.max(0,1-(Xo-lp)*2)),cn.update(e,i),Kt.render(Rr,tt)}requestAnimationFrame(vp);window.__LOTUS_WORKSHOP__={audio:_t,music:ai,handwork:cn,stages:It,storageKey:Jo,get state(){return JSON.parse(JSON.stringify(Oe.state))},get ready(){return!0},get playing(){return Xn},get selectedTool(){return fc},get mode(){return En?"free":"station"},snapshot(){return{state:this.state,selectedTool:fc,mode:this.mode,focused:pc,camera:tt.position.toArray(),stats:{calls:Kt.info.render.calls,triangles:Kt.info.render.triangles,geometries:Kt.info.memory.geometries,textures:Kt.info.memory.textures},parts:jt.registry.size,visibleParts:[...jt.registry].filter(([,i])=>i.visible).map(([i])=>i),sockets:jt.sockets.size}},goStation:Wn,selectTool:Ts,lantern:jt,workflow:Oe,scene:Rr,camera:tt,renderer:Kt,craft:eh,blocked:ju};Kt.domElement.addEventListener("webglcontextlost",i=>{i.preventDefault(),Qt("\u56FE\u5F62\u4E0A\u4E0B\u6587\u5DF2\u4E2D\u65AD\uFF0C\u8FDB\u5EA6\u5DF2\u4FDD\u5B58\u3002\u8BF7\u5237\u65B0\u9875\u9762\u6062\u590D\u3002")});setTimeout(()=>{we("loading").style.opacity=0,setTimeout(()=>we("loading").hidden=!0,500)},200);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
