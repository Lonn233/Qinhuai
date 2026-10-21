(()=>{var mh=12*Math.PI/180,yc=.009,gh=i=>Math.atan2(Math.sin(i),Math.cos(i));function _h(i,e,t=0){let n=gh(t-((i+.5)*Math.PI/3+e));return{error:n,aligned:Math.abs(n)<=mh+1e-9,degrees:Math.abs(n)*180/Math.PI}}var xc=["petal_assembly","calyx_assembly","lotus_leaf_assembly"],rs=i=>["lining_upper","lining_lower",...xc].includes(i);function yh(i,e,t=0){let n=gh(t-(i+e));return{error:n,aligned:Math.abs(n)<=mh+1e-9,degrees:Math.abs(n)*180/Math.PI}}function xh({storage:i,onChange:e=()=>{}}={}){let t="qinhuai-workshop-music-v1",n=!0,s=.25,r=!1,o=!1,a=!1,l=!1;try{let g=JSON.parse(i?.getItem(t)||"null");typeof g?.enabled=="boolean"&&(n=g.enabled),Number.isFinite(g?.volume)&&(s=Math.max(0,Math.min(1,g.volume)))}catch{}let c=document.createElement("audio");c.id="workshop-music",c.src="./workshop/assets/audio/man-ye-xing.mp3",c.preload="none",c.loop=!0,c.volume=s,document.body.appendChild(c);let u=()=>({enabled:n,volume:s,started:r,playing:!c.paused,suspended:o,blocked:a,error:l}),h=()=>e(u());function d(){try{i?.setItem(t,JSON.stringify({enabled:n,volume:s}))}catch{}}function f(){if(!n||!r||o)return;a=!1,l=!1,c.play()?.catch(_=>{!n||o||_.name==="AbortError"||(a=_.name==="NotAllowedError",l=!a,h())}),h()}return c.addEventListener("play",h),c.addEventListener("pause",h),c.addEventListener("error",()=>{l=!0,h()}),{snapshot:u,start(){r=!0,o=!1,f()},pause(){o=!0,c.pause(),h()},resume(){o=!1,f()},setEnabled(g){n=!!g,n?(c.error&&c.load(),r=!0,f()):c.pause(),d(),h()},setVolume(g){s=Math.max(0,Math.min(1,g)),c.volume=s,d(),h()},toggle(){n&&(a||l)?(c.error&&c.load(),f()):this.setEnabled(!n)}}}var bt=Object.freeze({frame:{bigRingRadius:.84,mouthRingRadius:.76,waistHoopRadius:.63,bigRingHeight:.5,mouthRingHeight:1.04,waistHoopHeight:.22,verticalRibCount:12},petals:{layers:6,perLayer:6,count:36},leafCount:12,lotusLeafCount:2,podCount:2,flowerCount:6,dryDuration:3500,colors:{petalBase:"#C989C4",petalMid:"#D49BD0",petalTip:"#B879B4",petalUndyed:"#F0E8EF",calyx:"#365D3D",bamboo:"#A9A477",binding:"#E4DCCB",innerLining:"#6F1D35"}});var Cr=["\u624E\u6846\u5B50","\u6253\u5E95\u88F1\u7CCA","\u67D3\u7EB8\u9634\u5E72","\u538B\u6A21\u7B4B\u7EDC","\u5377\u66F2\u5B9A\u5F62","\u9010\u5C42\u8D34\u74E3","\u82B1\u5934\u4E0E\u8377\u53F6","\u88C5\u706F\u68C0\u67E5"],lt=[{id:"bamboo_prep",phase:0,name:"\u5907\u7BFE\u5F2F\u5708",short:"\u5907\u7BFE\u5F2F\u5708",tool:"bamboo",total:3,station:"bamboo",action:"\u5F2F\u5236\u4E00\u53EA\u5708\u6761",unit:"\u5708",hint:"\u5148\u9009\u5927\u5708\u3001\u53E3\u5708\u6216\u8170\u7B8D\uFF0C\u518D\u70B9\u51FB\u53F0\u9762\u7AF9\u6761\uFF0C\u5DE6\u952E\u6301\u7EED\u5F2F\u3001\u53F3\u952E\u6301\u7EED\u677E\uFF1B\u5408\u683C\u540E\u786E\u8BA4\u7EB8\u7247\u7ED1\u624E\u3002\u4E09\u53EA\u7AF9\u5708\u8FDE\u7EED\u5165\u680F\uFF0C\u4E0D\u5FC5\u79BB\u53F0\u3002"},{id:"frame_assembly",phase:0,name:"\u8FDE\u63A5\u5F27\u5F62\u7AF9\u9AA8",short:"\u8FDE\u63A5\u5F27\u5F62\u7AF9\u9AA8",tool:"bamboo",total:12,station:"assembly",action:"\u8FDE\u63A5\u4E00\u6839\u7EB5\u5411\u5F27\u9AA8",unit:"\u6839",hint:"\u5148\u4ECE\u7269\u54C1\u680F\u5C06\u4E09\u4E2A\u7AF9\u5708\u62D6\u5230\u5404\u81EA\u4EAE\u70B9\uFF0C\u518D\u9010\u6839\u653E\u5165\u5341\u4E8C\u6839\u7EB5\u5411\u7AF9\u6761\u3002\u6BCF\u653E\u4E00\u4EF6\u7ACB\u5373\u7F20\u7EBF\u56FA\u5B9A\uFF0C\u7ED1\u7262\u540E\u7EE7\u7EED\u653E\u4E0B\u4E00\u4EF6\u3002"},{id:"frame_binding",automatic:!0,phase:0,name:"\u4EA4\u70B9\u7ED1\u624E",short:"\u4EA4\u70B9\u7ED1\u624E",tool:"string",total:12,station:"assembly",action:"\u7ED1\u624E\u4E00\u7EC4\u4E09\u5904\u4EA4\u70B9",unit:"\u7EC4",hint:"\u653E\u7F6E\u90E8\u4EF6\u540E\u81EA\u52A8\u7F20\u7EBF\uFF0C\u9010\u6839\u56FA\u5B9A\u5F27\u9AA8\u7684\u4E09\u4E2A\u4EA4\u70B9\uFF0C\u4E0D\u518D\u96C6\u4E2D\u7ED1\u624E\u3002"},{id:"frame_short_binding",phase:0,name:"\u77ED\u7BFE\u6346\u624E\u6536\u53E3",short:"\u77ED\u7BFE\u6346\u624E\u6536\u53E3",tool:"string",total:3,station:"assembly",action:"\u6346\u624E\u4E00\u6839\u8F83\u77ED\u7AF9\u7BFE",unit:"\u6839",hint:"\u5927\u7B50\u4E3B\u4F53\u5B8C\u6210\u540E\uFF0C\u7ACB\u5373\u53D6\u4E09\u6839\u8F83\u77ED\u7AF9\u7BFE\uFF0C\u9010\u6839\u6346\u624E\u56FA\u5B9A\uFF1B\u4F4D\u7F6E\u4E0E\u64CD\u4F5C\u987A\u5E8F\u53C2\u7167\u5DE5\u827A\u9644\u56FE\u3002"},{id:"lining_lower",phase:1,name:"\u4E0B\u90E8\u88F1\u767D\u7EB8",short:"\u4E0B\u90E8\u88F1\u767D\u7EB8",tool:"paste",total:6,station:"assembly",action:"\u8D34\u5408\u4E00\u5E45\u767D\u8272\u5E95\u7EB8",unit:"\u5E45",hint:"\u767D\u8272\u88F1\u5F27\u4E3A\u4E0B\u5C42\uFF0C\u5148\u7528\u80F6\u5237\u70B9\u6D82\u6D46\u7CCA\uFF0C\u518D\u62D6\u5165\u767D\u7EB8\u5E76\u786E\u8BA4\u8D34\u5408\uFF0C\u5B8C\u6210\u4E0B\u90E8\u6253\u5E95\u3002"},{id:"lining_upper",phase:1,name:"\u4E0A\u90E8\u88F1\u7EA2\u7EB8",short:"\u4E0A\u90E8\u88F1\u7EA2\u7EB8",tool:"paste",total:6,station:"assembly",action:"\u8D34\u5408\u4E00\u5E45\u7EA2\u8272\u73BB\u7483\u7EB8",unit:"\u5E45",hint:"\u7EA2\u8272\u88F1\u5F27\u4E3A\u4E0A\u5C42\uFF0C\u767D\u8272\u88F1\u5F27\u5B8C\u6210\u540E\u518D\u8D34\u7EA2\u7EB8\uFF1B\u7EA2\u88F1\u5F27\u8986\u76D6\u5728\u767D\u88F1\u5F27\u4E4B\u4E0A\u3002"},{id:"paper_cutting",phase:2,name:"\u7B2C\u4E00\u6B21\u88C1\u7EB8 \xB7 \u65B9\u5F62\u7EB8\u6599",short:"\u7B2C\u4E00\u6B21\u88C1\u7EB8 \xB7 \u65B9\u5F62\u7EB8\u6599",tool:"dye",total:8,station:"press",action:"\u88C1\u5207\u4E00\u6279\u7D20\u7EB8",unit:"\u6279",hint:"\u5C06\u5927\u5F20\u539F\u7EB8\u88C1\u6210\u65B9\u5F62\u7EB8\u7247\uFF1A\u516D\u6279\u82B1\u74E3\u7528\u65B9\u7EB8\u3001\u4E24\u6279\u53F6\u7247\u7528\u65B9\u7EB8\u3002\u6B64\u65F6\u4E0D\u88C1\u82B1\u74E3\u8F6E\u5ED3\u3002"},{id:"paper_dye",phase:2,name:"\u65B9\u7EB8\u6D78\u67D3 \xB7 \u7C89\u7D2B",short:"\u65B9\u7EB8\u6D78\u67D3 \xB7 \u7C89\u7D2B",tool:"dye",total:6,station:"dye",action:"\u6D78\u67D3\u516D\u5F20\u82B1\u74E3\u7EB8",unit:"\u6279",hint:"\u62D6\u5230\u7C89\u7D2B\u67D3\u76D8\u65C1\u6309 E \u6D78\u6DA6\uFF0C\u518D\u6309 E \u63D0\u7EB8\uFF1B\u79FB\u5230\u9634\u5E72\u67B6\u65C1\u6309 E \u6302\u7EB8\u3002\u5EFA\u8BAE\u6A21\u62DF 1\u20142 \u5206\u949F\uFF0C20 \u500D\u901F\uFF0C\u4E0D\u662F\u901A\u7528\u5DE5\u827A\u7528\u65F6\u3002"},{id:"leaf_dye",phase:2,name:"\u65B9\u7EB8\u6D78\u67D3 \xB7 \u7EFF\u8272",short:"\u65B9\u7EB8\u6D78\u67D3 \xB7 \u7EFF\u8272",tool:"dye",total:2,station:"dye",action:"\u6D78\u67D3\u4E03\u5F20\u53F6\u7247\u7EB8",unit:"\u6279",hint:"\u5C06\u7EFF\u8272\u65B9\u7EB8\u79FB\u5230\u67D3\u76D8\u65C1\u6309 E \u6D78\u6DA6\uFF0C1\u20142 \u5206\u949F\u6A21\u62DF\u8BA1\u65F6\u540E\u6309 E \u63D0\u7EB8\uFF0C\u518D\u79FB\u5230\u9634\u5E72\u67B6\u65C1\u6309 E \u6302\u7EB8\u3002"},{id:"paper_drying",phase:2,name:"\u901A\u98CE\u9634\u5E72",short:"\u901A\u98CE\u9634\u5E72",tool:null,total:1,station:"dye",action:"\u7B49\u5F85\u4E24\u79CD\u7EB8\u6599\u9634\u5E72",unit:"\u6B21",hint:"\u82B1\u74E3\u7EB8\u548C\u53F6\u7247\u7EB8\u90FD\u8981\u5E72\u900F\u518D\u52A0\u5DE5\u3002\u7F6E\u4E8E\u901A\u98CE\u9634\u51C9\u5904\uFF0C\u907F\u514D\u66B4\u6652\uFF1B\u6E38\u620F\u7B49\u5F85\u538B\u7F29\u4E3A\u6570\u79D2\u3002"},{id:"petal_pressing",phase:3,name:"\u538B\u51FA\u82B1\u74E3\u7B4B\u7EDC",short:"\u538B\u51FA\u82B1\u74E3\u7B4B\u7EDC",tool:"press",total:6,station:"press",action:"\u538B\u7EB9\u516D\u5F20\u82B1\u74E3\u7EB8",unit:"\u6279",hint:"\u5C06\u9634\u5E72\u7684\u65B9\u7EB8\u9001\u5165\u6EDA\u8F74\u538B\u7EB9\u673A\uFF0C\u70B9\u51FB\u542F\u52A8\uFF0C\u7B49\u5F85\u5377\u7EBF\u4E0E\u8FDB\u7EB8\u5B8C\u6210\u3001\u6EDA\u8F74\u505C\u6B62\uFF0C\u518D\u53D6\u51FA\u7EB8\u7247\u3002\u6B64\u65F6\u4ECD\u662F\u65B9\u7EB8\u3002"},{id:"leaf_pressing",phase:3,name:"\u538B\u51FA\u53F6\u7247\u7B4B\u7EDC",short:"\u538B\u51FA\u53F6\u7247\u7B4B\u7EDC",tool:"press",total:2,station:"press",action:"\u538B\u7EB9\u4E03\u5F20\u53F6\u7247\u7EB8",unit:"\u6279",hint:"\u5C06\u9634\u5E72\u7684\u7EFF\u8272\u65B9\u7EB8\u9001\u5165\u6EDA\u8F74\uFF0C\u542F\u52A8\u5E76\u7B49\u5F85\u81EA\u52A8\u505C\u673A\u3002\u53D6\u51FA\u540E\u518D\u88C1\u526A\u53F6\u7247\u8F6E\u5ED3\u3002"},{id:"petal_cutting",phase:3,name:"\u7B2C\u4E8C\u6B21\u88C1\u7EB8 \xB7 \u82B1\u74E3\u8F6E\u5ED3",short:"\u88C1\u82B1\u74E3",tool:"dye",total:6,station:"press",action:"\u6CBF\u8F6E\u5ED3\u88C1\u51FA\u4E00\u6279\u82B1\u74E3",unit:"\u6279",hint:"\u538B\u7EB9\u540E\u7684\u65B9\u7EB8\u624D\u80FD\u88C1\u82B1\u74E3\u3002\u6309\u4F4F\u9F20\u6807\u6CBF\u5B8C\u6574\u8F6E\u5ED3\u9644\u8FD1\u88C1\u5207\uFF0C\u8F7B\u5FAE\u504F\u79FB\u53EF\u63A5\u53D7\uFF1B\u504F\u79BB\u6216\u677E\u624B\u53EA\u6682\u505C\uFF0C\u56DE\u5230\u4EAE\u70B9\u6309\u5DE6\u952E\u7EE7\u7EED\u3002"},{id:"leaf_cutting",phase:3,name:"\u7B2C\u4E8C\u6B21\u88C1\u7EB8 \xB7 \u53F6\u7247\u8F6E\u5ED3",short:"\u88C1\u53F6\u7247",tool:"dye",total:2,station:"press",action:"\u6CBF\u8F6E\u5ED3\u88C1\u51FA\u4E00\u6279\u53F6\u7247",unit:"\u6279",hint:"\u4ECE\u538B\u7EB9\u65B9\u7EB8\u88C1\u51FA\u53F6\u7247\u3002\u6CBF\u5F15\u5BFC\u8F6E\u5ED3\u9644\u8FD1\u8FDE\u7EED\u88C1\u5207\uFF0C\u504F\u79BB\u6216\u677E\u624B\u4FDD\u7559\u8FDB\u5EA6\uFF0C\u56DE\u5230\u4EAE\u70B9\u6309\u5DE6\u952E\u7EE7\u7EED\uFF1B\u4E0D\u518D\u62FF\u53F6\u7247\u53BB\u67D3\u8272\u3002"},{id:"petal_shaping",phase:4,name:"\u82B1\u74E3\u6210\u5F62\u3001\u634F\u8FB9\u4E0E\u94DC\u4E1D\u56FA\u5B9A",short:"\u634F\u8FB9\u4E0E\u94DC\u4E1D\u56FA\u5B9A",tool:"string",total:6,station:"press",action:"\u4F9D\u6B21\u6210\u5F62\u3001\u634F\u8FB9\u5E76\u7528\u94DC\u4E1D\u56FA\u5B9A\u82B1\u74E3",unit:"\u6279",hint:"\u5148\u5C06\u82B1\u74E3\u5236\u4F5C\u6210\u5F62\uFF0C\u518D\u634F\u8FB9\uFF0C\u6700\u540E\u7528\u94DC\u4E1D\u56FA\u5B9A\uFF1B\u4E09\u9879\u64CD\u4F5C\u4F9D\u6B21\u5B8C\u6210\u540E\u6536\u597D\u82B1\u74E3\u3002"},{id:"petal_assembly",phase:5,name:"\u9010\u5C42\u7C98\u8D34\u82B1\u74E3",short:"\u9010\u5C42\u7C98\u8D34\u82B1\u74E3",tool:"paste",total:36,station:"assembly",action:"\u7C98\u8D34\u4E0B\u4E00\u7247\u82B1\u74E3",unit:"\u7247",hint:"\u672C\u7248\u91C7\u7528\u516D\u5C42\u5171\u4E09\u5341\u516D\u7247\uFF0C\u6BCF\u5C42\u516D\u7247\u9010\u7247\u9519\u4F4D\u91CD\u53E0\u3002\u6570\u91CF\u4E3A\u6E38\u620F\u914D\u7F6E\uFF0C\u5B9E\u9645\u8377\u82B1\u706F\u6709\u4E0D\u540C\u5C42\u6570\u4E0E\u74E3\u6570\u3002"},{id:"calyx_assembly",phase:6,name:"\u88C5\u914D\u5E95\u90E8\u53F6\u6258",short:"\u88C5\u914D\u5E95\u90E8\u53F6\u6258",tool:"paste",total:12,station:"assembly",action:"\u7C98\u8D34\u4E00\u7247\u7EFF\u8272\u53F6\u6258",unit:"\u7247",hint:"\u4F7F\u7528\u5DF2\u7ECF\u67D3\u8272\u3001\u9634\u5E72\u3001\u538B\u7EB9\u7684\u7EFF\u8272\u7EB8\u6599\uFF0C\u906E\u4F4F\u82B1\u74E3\u6839\u90E8\u5E76\u8D34\u5408\u706F\u4F53\u3002"},{id:"flower_making",phase:6,name:"\u5236\u4F5C\u516D\u4E2A\u82B1\u5934",short:"\u5236\u4F5C\u516D\u4E2A\u82B1\u5934",tool:"paste",total:6,station:"press",action:"\u5377\u8D34\u4E00\u7EC4\u82B1\u5934",unit:"\u7EC4",hint:"\u7528\u53E6\u5907\u7684\u67D3\u8272\u538B\u7EB9\u5C0F\u5F20\u7EB8\u6599\u5377\u8D34\u82B1\u5934\uFF0C\u6574\u7406\u82B1\u74E3\u3001\u843C\u7247\u4E0E\u82B1\u6897\uFF0C\u5907\u597D\u516D\u7EC4\u3002"},{id:"top_flower_assembly",phase:6,name:"\u4E0A\u56DB\u4E0B\u4E8C\u63A5\u82B1\u5934",short:"\u4E0A\u56DB\u4E0B\u4E8C\u63A5\u82B1\u5934",tool:"paste",total:6,station:"assembly",action:"\u8FDE\u63A5\u4E00\u7EC4\u82B1\u5934",unit:"\u7EC4",hint:"\u672C\u7248\u91C7\u7528\u6240\u7ED9\u62A5\u9053\u4E2D\u7684\u516D\u82B1\u5934\u914D\u7F6E\uFF1A\u4E0A\u90E8\u56DB\u4E2A\u3001\u4E0B\u90E8\u4E24\u4E2A\u3002\u8C03\u6574\u82B1\u6897\u65B9\u5411\u4E0E\u8FDE\u63A5\u4F4D\u7F6E\u3002"},{id:"pod_making",phase:6,name:"\u5236\u4F5C\u83B2\u84EC",short:"\u5236\u4F5C\u83B2\u84EC",tool:"paste",total:2,station:"press",action:"\u5236\u4F5C\u4E00\u53EA\u83B2\u84EC",unit:"\u53EA",hint:"\u4EE5\u7EFF\u8272\u7EB8\u6599\u5305\u51FA\u83B2\u84EC\u5F62\u72B6\uFF0C\u6574\u7406\u84EC\u9762\u4E0E\u83B2\u5B50\u5B54\uFF0C\u518D\u8FDE\u63A5\u82B1\u6897\u3002"},{id:"pod_assembly",phase:6,name:"\u5B89\u88C5\u83B2\u84EC",short:"\u5B89\u88C5\u83B2\u84EC",tool:"paste",total:2,station:"assembly",action:"\u63A5\u5165\u4E00\u53EA\u83B2\u84EC",unit:"\u53EA",hint:"\u5C06\u505A\u597D\u7684\u83B2\u84EC\u63A5\u5165\u706F\u4F53\u4E24\u4FA7\uFF0C\u8C03\u6574\u4E0E\u82B1\u5934\u7684\u6BD4\u4F8B\u548C\u65B9\u5411\u3002"},{id:"lotus_leaf_assembly",phase:6,name:"\u5B89\u88C5\u8377\u53F6",short:"\u5B89\u88C5\u8377\u53F6",tool:"paste",total:2,station:"assembly",action:"\u5B89\u88C5\u4E00\u5F20\u8377\u53F6",unit:"\u5F20",hint:"\u7528\u5269\u4F59\u4E24\u5F20\u67D3\u8272\u538B\u7EB9\u53F6\u7247\u7EB8\u5851\u51FA\u5BBD\u9614\u8377\u53F6\uFF0C\u63A5\u5165\u82B1\u6897\u5E76\u6574\u7406\u8D77\u4F0F\u3002"},{id:"hanging_assembly",phase:7,name:"\u6536\u675F\u540A\u6302",short:"\u6536\u675F\u540A\u6302",tool:"string",total:3,station:"assembly",action:"\u56FA\u5B9A\u4E00\u7EC4\u540A\u6302\u652F\u6491",unit:"\u7EC4",hint:"\u5C06\u4E09\u5904\u652F\u6491\u6536\u675F\u5230\u540A\u70B9\uFF0C\u624E\u7262\u63D0\u6302\u8FDE\u63A5\u3002"},{id:"light_installation",phase:7,name:"\u5B89\u88C5\u6696\u8272 LED",short:"\u5B89\u88C5\u6696\u8272 LED",tool:"light",total:1,station:"assembly",action:"\u5C06 LED \u88C5\u5165\u706F\u4F53",unit:"\u53EA",hint:"\u672C\u6E38\u620F\u4F7F\u7528\u73B0\u4EE3 LED \u8868\u73B0\u3002\u4F20\u7EDF\u8721\u70DB\u4E0E\u73B0\u4EE3 LED \u662F\u4E0D\u540C\u5149\u6E90\u65B9\u6848\uFF0C\u4E0D\u628A LED \u89C6\u4E3A\u4F20\u7EDF\u539F\u59CB\u5149\u6E90\u3002"},{id:"final_inspection",phase:7,name:"\u68C0\u67E5\u5F62\u6001\u5E76\u8BD5\u706F",short:"\u68C0\u67E5\u5F62\u6001\u5E76\u8BD5\u706F",tool:"light",total:1,station:"assembly",action:"\u68C0\u67E5\u5F62\u6001 \xB7 \u70B9\u4EAE\u82B1\u706F",unit:"\u6B21",hint:"\u8F6C\u52A8\u706F\u4F53\u89C2\u5BDF\u6574\u4F53\u6BD4\u4F8B\uFF0C\u5B8C\u6210\u8BD5\u706F\uFF0C\u68C0\u67E5\u7EB8\u9762\u900F\u5149\u4E0E\u706F\u5149\u6548\u679C\u3002"}],os=Array.from({length:bt.petals.count},(i,e)=>`petal-layer-${String(Math.floor(e/bt.petals.perLayer)+1).padStart(2,"0")}-${String(e%bt.petals.perLayer+1).padStart(2,"0")}`),Ir=Array.from({length:bt.leafCount+bt.lotusLeafCount},(i,e)=>`leaf-paper-${e+1}`),vh="qinhuai-lotus-workshop-v1",Zo="qinhuai-lotus-workshop-v2";var vc=Object.freeze({bamboo_prep:"bend",frame_assembly:"place",frame_binding:"bind",frame_short_binding:"bind",lining_upper:"trace",lining_lower:"trace",paper_cutting:"trace",paper_dye:"dye",leaf_dye:"dye",petal_pressing:"press",leaf_pressing:"press",petal_shaping:"shape",petal_assembly:"place",calyx_assembly:"place",flower_making:"shape",top_flower_assembly:"place",pod_making:"shape",pod_assembly:"place",lotus_leaf_assembly:"place",hanging_assembly:"bind",light_installation:"place",final_inspection:"inspect"}),Oi=["top_flower_assembly","pod_assembly"],Pp=["flower_making","pod_making"],Lr=i=>Oi.includes(i)||Pp.includes(i),Pr=(i,e=0,t=1)=>Math.max(e,Math.min(t,i)),Fi=(i,e)=>Math.hypot(i.x-e.x,i.y-e.y),Bi={x:-1.75,y:-.35},Tt={x:.65,y:.2},hn={x:-.9,y:-.85};function Lp(i){return i==="bind"?Array.from({length:49},(e,t)=>({x:Math.sin(t/48*Math.PI*4)*.64,y:Math.cos(t/48*Math.PI*4)*.64})):i==="inspect"?[{x:-.8,y:.65},{x:.75,y:.6},{x:.85,y:-.55},{x:-.8,y:-.55}]:Array.from({length:25},(e,t)=>({x:-1.35+t/24*2.7,y:.38*Math.sin(t/24*Math.PI*2)}))}var Jo=class{constructor(e){if(this.stage=e,this.mode=vc[e],!this.mode)throw new Error("No handwork for "+e);this.reset()}reset(){this.position={...Bi},this.angle=-.4,this.curve=0,this.oval=0,this.pinned=!1,this.dragging=!1,this.distance=0,this.contact=0,this.dose=0,this.placed=!1,this.ready=!1,this.visited=new Set,this.previous=null,this.next=0,this.issue="",this.points=Lp(this.mode),this.fixed=!1,this.formed=!1,this.edgePinched=!1,this.wireFixed=!1,this.pendingShape=!1,this.inspectIndex=-1}get shapePhase(){return this.formed?this.edgePinched?this.wireFixed?"complete":"wire":"pinch":"form"}get grip(){return this.mode==="bend"?{x:2.2-3.1*this.curve,y:-.85+this.oval*2}:this.mode==="shape"?{x:.15+this.curve*1.5,y:.55}:this.position}down(e){if(this.issue="",this.mode==="bend"&&!this.pinned)return Fi(e,hn)<.28?(this.pinned=!0,!0):(this.issue="\u5148\u6309\u4F4F\u7AF9\u7BFE\u5DE6\u7AEF\uFF0C\u628A\u5B83\u56FA\u5B9A\u5728\u6728\u9489\u65C1\u3002",!1);if(["bend","shape","place","dye","press"].includes(this.mode)){let n=this.placed?Tt:this.grip;if(Fi(e,n)>(this.mode==="shape"?.45:.38))return this.issue=this.placed?"\u8BF7\u6309\u4F4F\u6750\u6599\u4E0E\u5DE5\u5177\u63A5\u89E6\u5904\u3002":"\u8BF7\u6293\u4F4F\u6750\u6599\u4E0A\u7684\u5C0F\u5706\u70B9\u3002",!1}return this.dragging=!0,this.previous={...e},this.pendingShape=!1,this.gestureDistance=0,!0}move(e,t=.016){if(!this.dragging)return!1;let n=Fi(e,this.previous),s=n/Math.max(.008,t);if(this.previous={...e},n>.6&&!Oi.includes(this.stage))return this.issue="\u52A8\u4F5C\u592A\u6025\uFF0C\u6162\u4E00\u70B9\uFF0C\u8BA9\u5DE5\u5177\u8D34\u7740\u6750\u6599\u8D70\u3002",!1;if(this.distance+=n,this.gestureDistance+=n,this.mode==="bend")this.curve=Pr((2.2-e.x)/3.1,0,1.18),this.oval=Pr((e.y+.85)/2,-.5,.5),this.ready=this.curve>=.96&&this.curve<=1.04&&Math.abs(this.oval)<.09&&this.distance>2.5,this.issue=this.curve>1.04?"\u5F2F\u8FC7\u5934\u4E86\uFF0C\u7A0D\u5FAE\u653E\u677E\u53F3\u7AEF\u3002":Math.abs(this.oval)>.09?"\u4E24\u7AEF\u9AD8\u5EA6\u4E0D\u9F50\uFF0C\u4E0A\u4E0B\u8C03\u6574\u5230\u6728\u9489\u5904\u3002":"";else if(this.mode==="shape")if(this.stage!=="petal_shaping"||!this.formed){this.curve=Pr((e.x-.15)/1.5,0,1.2);let r=this.curve>.48&&this.curve<.74&&this.distance>.6;this.ready=this.stage!=="petal_shaping"&&r,this.pendingShape=r,this.issue=this.curve>=.74?"\u5377\u5F97\u592A\u7D27\uFF0C\u5411\u5DE6\u56DE\u9000\u4E00\u70B9\u3002":r?"\u5F27\u5EA6\u5408\u9002\uFF0C\u677E\u624B\u5B8C\u6210\u6210\u5F62\u3002":""}else this.edgePinched?this.wireFixed||(this.pendingShape=this.gestureDistance>.35&&e.x>.55&&e.x<1.1&&e.y<-.15,this.issue=this.pendingShape?"\u677E\u624B\u56FA\u5B9A\u94DC\u4E1D\u3002":"\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\uFF0C\u5C06\u94DC\u4E1D\u5411\u4E0B\u6536\u62E2\u56FA\u5B9A\u3002"):(this.pendingShape=this.gestureDistance>.18&&e.x>.95&&e.y<.35&&e.y>-.1,this.issue=this.pendingShape?"\u677E\u624B\u5B8C\u6210\u634F\u8FB9\uFF0C\u518D\u56FA\u5B9A\u94DC\u4E1D\u3002":"\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\uFF0C\u5411\u4E0B\u634F\u51FA\u6298\u8FB9\u3002");else if(["place","press","dye"].includes(this.mode)&&!this.placed)this.position={...e};else if(["trace","bind"].includes(this.mode)){let r=this.points[this.next];return r&&Fi(e,r)<.24&&s<14?(this.visited.add(this.next),this.next++,this.ready=this.next>=this.points.length,n>.002):(this.issue=s>=14?"\u79FB\u52A8\u592A\u5FEB\uFF0C\u653E\u6162\u5DE5\u5177\u3002":"\u6CBF\u6D45\u8272\u5F15\u7EBF\u7EE7\u7EED\uFF0C\u504F\u79BB\u7684\u90E8\u5206\u4E0D\u4F1A\u52A0\u5DE5\u3002",!1)}else if(this.mode==="inspect")return!1;return n>.002}tick(e,t){if(!this.dragging||!t)return!1;if(e=Math.min(e,.05),this.mode==="dye"&&!this.placed){let n=Pr((this.position.x+.35)/1.2);if(Math.abs(this.position.y-.2)<.62&&this.position.x>-.35&&this.position.x<1.45)return this.dose+=e*n*.75,this.ready=!1,this.issue=this.dose>1.15?"\u989C\u8272\u8FC7\u6DF1\uFF0C\u8BF7\u6362\u7EB8\u91CD\u505A\u8FD9\u4E00\u6279\u3002":"",!0}if((this.mode==="press"||this.mode==="place")&&this.placed&&Fi(t,Tt)<.3){this.contact+=e;let n=this.mode==="press"?1.05:.55;return this.ready=this.contact>=n,!0}if(this.mode==="inspect"){let n=this.points.findIndex((s,r)=>!this.visited.has(r)&&Fi(t,s)<.28);if(n>=0)return this.inspectIndex!==n&&(this.inspectIndex=n,this.contact=0),this.contact+=e,this.contact>=.23&&(this.visited.add(n),this.contact=0),this.ready=this.visited.size===this.points.length,!0}return!1}rotate(e){!this.placed&&["place","press"].includes(this.mode)&&(this.angle+=e)}up(){if(this.dragging){if(this.dragging=!1,this.previous=null,this.stage==="petal_shaping"){this.pendingShape&&(this.formed?this.edgePinched?this.wireFixed=!0:this.edgePinched=!0:this.formed=!0),this.pendingShape=!1,this.ready=this.formed&&this.edgePinched&&this.wireFixed,this.issue=this.ready?"\u6210\u5F62\u3001\u634F\u8FB9\u548C\u94DC\u4E1D\u56FA\u5B9A\u5DF2\u5B8C\u6210\u3002":this.formed?this.edgePinched?"\u634F\u8FB9\u5B8C\u6210\uFF1B\u6293\u4F4F\u5706\u70B9\u5411\u4E0B\u6536\u62E2\u94DC\u4E1D\u56FA\u5B9A\u3002":"\u6210\u5F62\u5B8C\u6210\uFF1B\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\u5411\u4E0B\u634F\u8FB9\u3002":this.issue;return}if(Oi.includes(this.stage)&&!this.placed){Fi(this.position,Tt)<.34&&this.distance>.9?(this.position={...Tt},this.angle=0,this.placed=!0,this.ready=!0,this.issue="\u5DF2\u5BF9\u9F50\uFF0C\u677E\u624B\u8D34\u5408\u3002"):this.issue="\u5C1A\u672A\u5230\u8FBE\u9AD8\u4EAE\u4F4D\u7F6E\uFF0C\u8BF7\u7EE7\u7EED\u62D6\u52A8\u6750\u6599\u5BF9\u9F50\u540E\u677E\u624B\u3002";return}if(["place","press"].includes(this.mode)&&!this.placed){let e=Fi(this.position,Tt),t=Math.abs(Math.atan2(Math.sin(this.angle),Math.cos(this.angle)));e<.2&&t<.15&&this.distance>.9?(this.placed=!0,this.position={...Tt},this.issue="\u5DF2\u5BF9\u9F50\uFF0C\u518D\u6309\u4F4F\u63A5\u89E6\u5904\u56FA\u5B9A\u3002"):this.issue=e>=.2?"\u4F4D\u7F6E\u8FD8\u6CA1\u8D34\u5408\uFF0C\u7EE7\u7EED\u6293\u53D6\u8C03\u6574\u3002":"\u65B9\u5411\u504F\u659C\uFF0C\u7528\u6EDA\u8F6E\u6216\u65CB\u8F6C\u6309\u94AE\u5BF9\u9F50\u3002"}if(this.mode==="dye"){let e=this.position.x<-.85&&this.position.y>.5;this.ready=e&&this.dose>=.55&&this.dose<=1.15,this.issue=this.ready?"\u989C\u8272\u9002\u4E2D\uFF0C\u5DF2\u653E\u5230\u9634\u5E72\u67B6\u3002":this.dose>1.15?"\u6D78\u67D3\u8FC7\u6DF1\uFF0C\u8BF7\u6362\u7EB8\u91CD\u505A\u3002":this.dose<.55?"\u989C\u8272\u504F\u6D45\uFF0C\u53EF\u518D\u6B21\u6D78\u5165\u67D3\u6DB2\u3002":"\u79FB\u5230\u5DE6\u4E0A\u65B9\u9634\u5E72\u67B6\uFF0C\u518D\u677E\u624B\u3002"}}}cancelGesture(){this.dragging=!1,this.previous=null,this.pendingShape=!1}evidence(){return!this.ready||this.dragging?null:{mode:this.mode,quality:Pr(this.mode==="bend"?1-Math.abs(this.curve-1)-Math.abs(this.oval):this.mode==="shape"?1-Math.abs(this.curve-.61):this.mode==="dye"?1-Math.abs(this.dose-.8):1),curve:this.curve,oval:this.oval,dose:this.dose,angle:this.angle,distance:this.distance,formed:this.formed,edgePinched:this.edgePinched,wireFixed:this.wireFixed}}};var Dp={bamboo:"\u624E\u67B6\u53F0",assembly:"\u6CB3\u706F\u53F0",dye:"\u67D3\u7EB8\u53F0",press:"\u538B\u74E3\u53F0"},Up={bamboo_prep:"\u7EC6\u7AF9\u7BFE\u3001\u7EB8\u624E\u5E26\uFF5C\u53CC\u624B\u5F2F\u7BFE",frame_assembly:"\u6210\u54C1\u7AF9\u5708\u3001\u5F27\u5F62\u7AF9\u9AA8\u3001\u624E\u7EBF\uFF5C\u624B\u5DE5\u63A5\u5408",frame_binding:"\u624E\u7EBF\uFF5C\u968F\u6BCF\u6839\u7AF9\u6784\u4EF6\u81EA\u52A8\u7F20\u7ED5",frame_short_binding:"\u8F83\u77ED\u7AF9\u7BFE\u3001\u624E\u7EBF\uFF5C\u6346\u624E\u5DE5\u5177",lining_upper:"\u7EA2\u8272\u73BB\u7483\u7EB8\u3001\u6D46\u7CCA\uFF5C\u80F6\u5237",lining_lower:"\u767D\u8272\u5E95\u7EB8\u3001\u6D46\u7CCA\uFF5C\u80F6\u5237",paper_cutting:"\u5927\u5F20\u539F\u7EB8\uFF5C\u526A\u5200",paper_dye:"\u5F85\u67D3\u65B9\u7EB8\u3001\u7C89\u7D2B\u67D3\u6DB2\uFF5C\u67D3\u76D8\u3001\u9634\u5E72\u67B6\u3001\u5E9F\u6599\u6876",leaf_dye:"\u5F85\u67D3\u65B9\u7EB8\u3001\u7EFF\u8272\u67D3\u6DB2\uFF5C\u67D3\u76D8\u3001\u9634\u5E72\u67B6\u3001\u5E9F\u6599\u6876",paper_drying:"\u6E7F\u65B9\u7EB8\uFF5C\u901A\u98CE\u9634\u5E72\u67B6",petal_pressing:"\u9634\u5E72\u7C89\u7D2B\u65B9\u7EB8\uFF5C\u6EDA\u8F74\u538B\u7EB9\u673A / \u624B\u5DE5\u6A21\u5177\u3001\u68C9\u7EBF\u3001\u9524\u5B50",leaf_pressing:"\u9634\u5E72\u7EFF\u8272\u65B9\u7EB8\uFF5C\u6EDA\u8F74\u538B\u7EB9\u673A / \u624B\u5DE5\u6A21\u5177\u3001\u68C9\u7EBF\u3001\u9524\u5B50",petal_cutting:"\u538B\u7EB9\u7C89\u7D2B\u65B9\u7EB8\uFF5C\u526A\u5200\u3001\u82B1\u74E3\u8F6E\u5ED3",leaf_cutting:"\u538B\u7EB9\u7EFF\u8272\u65B9\u7EB8\uFF5C\u526A\u5200\u3001\u53F6\u7247\u8F6E\u5ED3",petal_shaping:"\u88C1\u597D\u7684\u82B1\u74E3\u3001\u94DC\u4E1D\uFF5C\u5377\u66F2\u5B9A\u5F62",petal_assembly:"\u5B9A\u5F62\u82B1\u74E3\u3001\u6D46\u7CCA\uFF5C\u53CC\u624B\u63A5\u5408",calyx_assembly:"\u7EFF\u8272\u53F6\u6258\u3001\u6D46\u7CCA\uFF5C\u53CC\u624B\u63A5\u5408",flower_making:"\u53E6\u5907\u5C0F\u5F20\u67D3\u8272\u538B\u7EB9\u7EB8\u3001\u82B1\u6897\uFF5C\u5377\u66F2\u5B9A\u5F62",top_flower_assembly:"\u516D\u7EC4\u82B1\u5934\uFF5C\u63A5\u5408\u5DE5\u5177",pod_making:"\u83B2\u84EC\u7EB8\u6599\uFF5C\u5B9A\u5F62\u5DE5\u5177",pod_assembly:"\u6210\u54C1\u83B2\u84EC\uFF5C\u63A5\u5408\u5DE5\u5177",lotus_leaf_assembly:"\u6210\u54C1\u8377\u53F6\u3001\u82B1\u6897\uFF5C\u63A5\u5408\u5DE5\u5177",hanging_assembly:"\u540A\u7EF3\u3001\u652F\u6491\uFF5C\u624E\u7EBF",light_installation:"\u6696\u8272 LED\uFF5C\u53CC\u624B\u5B89\u88C5",final_inspection:"\u6210\u54C1\u82B1\u706F\uFF5C\u89C2\u5BDF\u70B9\u4F4D\u3001\u8BD5\u706F"},Np=["\u70B9\u51FB\u684C\u9762\u5DE6\u4E0A\u89D2\u7684\u65B9\u7EB8\u5806\uFF0C\u6309\u4F4F\u7EB8\u7247\u62D6\u52A8\u3002\u677E\u5F00\u9F20\u6807\u540E\uFF0C\u7EB8\u4F1A\u7559\u5728\u539F\u5904\uFF1B\u518D\u6B21\u6293\u8D77\u53EF\u63A5\u7740\u62D6\u3002","\u62D6\u5230\u5BF9\u5E94\u67D3\u76D8\u9644\u8FD1\uFF0C\u770B\u89C1\u300CE \xB7 \u6D78\u6DA6\u65B9\u7EB8\u300D\u540E\u677E\u624B\uFF0C\u6309 E \u5F00\u59CB\u3002\u89C2\u5BDF\u65C1\u8FB9\u8BA1\u65F6\uFF0C\u5EFA\u8BAE\u6A21\u62DF\u6D78\u67D3 1\u20142 \u5206\u949F\u3002","\u6309 E \u63D0\u7EB8\u3002\u7B49\u5F85\u63D0\u8D77\u540E\uFF0C\u518D\u62D6\u5230\u9634\u5E72\u67B6\u9644\u8FD1\u6309 E \u6302\u7EB8\uFF1B\u82E5\u4E0D\u6EE1\u610F\uFF0C\u79FB\u5230\u5E9F\u6599\u6876\u9644\u8FD1\u6309 E \u4E22\u5F03\uFF0C\u518D\u53D6\u4E00\u7247\u3002"];function Fp(i){if(i.id==="bamboo_prep")return["\u5148\u9009\u62E9\u5927\u5708\u3001\u53E3\u5708\u6216\u8170\u7B8D\uFF08\u6BCF\u79CD\u4E00\u53EA\uFF0C\u5236\u4F5C\u987A\u5E8F\u81EA\u9009\uFF09\uFF0C\u518D\u70B9\u51FB\u53F0\u9762\u7EC6\u7AF9\u7BFE\uFF0C\u53CC\u624B\u62FF\u8D77\u3002","\u6301\u7EED\u6309\u5DE6\u952E\u9010\u6E10\u5F2F\u66F2\uFF1B\u6301\u7EED\u6309\u53F3\u952E\u653E\u677E\u3002\u89E6\u5C4F\u53EF\u7528\u5F2F\u66F2\uFF0F\u653E\u677E\u6309\u94AE\u3002","\u5F2F\u66F2\u8FDB\u5165\u5408\u683C\u5706\u5F62\u533A\u95F4\uFF0C\u677E\u624B\u540E\u70B9\u51FB\u786E\u8BA4\u56FA\u5B9A\u3002\u7ED1\u624E\u7ED3\u675F\u7AF9\u5708\u81EA\u52A8\u5165\u680F\uFF1B\u4E0D\u9000\u51FA\u5373\u53EF\u5236\u4F5C\u4E0B\u4E00\u6839\u3002"];if(i.id==="frame_assembly")return["\u4ECE\u5E38\u9A7B\u7269\u54C1\u680F\u9009\u53D6\u7AF9\u5708\u6216\u7AF9\u6761\uFF0C\u5FEB\u6377\u952E 1\u20144 \u5207\u6362\u3002","\u5148\u5C06\u4E09\u53EA\u7AF9\u5708\u62D6\u5230\u5BF9\u5E94\u4EAE\u70B9\uFF0C\u518D\u9010\u6839\u653E\u7F6E\u5F27\u5F62\u7AF9\u9AA8\u3002","\u6BCF\u653E\u4E00\u4EF6\u7ACB\u5373\u81EA\u52A8\u7F20\u7EBF\uFF0C\u7B49\u5F53\u524D\u8FD9\u4EF6\u56FA\u5B9A\u5B8C\u6210\uFF0C\u518D\u62FF\u4E0B\u4E00\u4EF6\u3002\u5168\u7A0B\u4E0D\u5FC5\u79BB\u53F0\u3002"];if(i.id==="frame_binding")return["\u6B64\u9879\u968F\u6846\u67B6\u88C5\u914D\u81EA\u52A8\u8FDB\u884C\uFF0C\u65E0\u987B\u5355\u72EC\u8FDB\u53F0\u3002","\u6BCF\u653E\u7F6E\u4E00\u6839\u7AF9\u6784\u4EF6\uFF0C\u7F20\u7EBF\u53EA\u56FA\u5B9A\u5F53\u524D\u8FD9\u4E00\u6839\u3002","\u52A8\u753B\u7ED3\u675F\u540E\u7EE7\u7EED\u6446\u4E0B\u4E00\u6839\uFF0C\u4E0D\u518D\u7B49\u5168\u90E8\u6446\u5B8C\u7EDF\u4E00\u7ED1\u624E\u3002"];if(i.id==="frame_short_binding")return["\u5927\u7B50\u4E3B\u4F53\u5B8C\u6210\u540E\uFF0C\u7ACB\u5373\u4ECE\u684C\u9762\u53D6\u4E09\u6839\u8F83\u77ED\u7AF9\u7BFE\uFF0C\u4E0D\u628A\u6536\u53E3\u6750\u6599\u63D0\u524D\u5168\u90E8\u505A\u597D\u3002","\u6309\u987A\u5E8F\u9010\u6839\u628A\u77ED\u7AF9\u7BFE\u653E\u5230\u5C0F\u5708\u4E0E\u6536\u53E3\u4F4D\u7F6E\uFF0C\u6BCF\u6839\u90FD\u8981\u5728\u5F53\u524D\u9AD8\u4EAE\u70B9\u5B8C\u6210\u56FA\u5B9A\u3002","\u53C2\u7167\u6587\u6863\u9644\u56FE\u91C7\u7528\u5341\u5B57\u6346\u624E\uFF1B\u4E09\u6839\u77ED\u7BFE\u5168\u90E8\u5B8C\u6210\u540E\uFF0C\u518D\u8FDB\u5165\u767D\u8272\u88F1\u5F27\u5DE5\u5E8F\u3002"];if(["petal_assembly","calyx_assembly","lotus_leaf_assembly"].includes(i.id))return["\u5728\u5408\u706F\u53F0\u5165\u5EA7\uFF0C\u4EE5\u4E0E\u88F1\u7CCA\u76F8\u540C\u7684\u504F\u5E73\u89C6\u89C6\u89D2\u64CD\u4F5C\uFF0C\u4E0D\u5207\u6362\u72EC\u7ACB\u573A\u666F\u3002\u5DE6\u952E\u6309\u4F4F\u706F\u4F53\u5DE6\u53F3\u62D6\u52A8\uFF0C\u65CB\u8F6C\u6574\u76CF\u82B1\u706F\u3002","\u5C06\u5F53\u524D\u9AD8\u4EAE\u5B89\u88C5\u4F4D\u8F6C\u5411\u81EA\u5DF1\uFF08\u5BB9\u5DEE \xB112\xB0\uFF09\u3002\u8F6C\u6B63\u540E\u5373\u53EF\u62D6\u5165\u6750\u6599\uFF1B\u88C5\u9970\u6750\u6599\u5728\u677E\u624B\u65F6\u81EA\u52A8\u4E0A\u6D46\uFF0C\u89D2\u5EA6\u4E0D\u5BF9\u6216\u4EC5\u62D6\u52A8\u65CB\u8F6C\u90FD\u4E0D\u4F1A\u5F00\u59CB\u5236\u4F5C\u3002","\u6309 2 \u6216\u4ECE\u4E0B\u65B9\u7269\u54C1\u680F\u62D6\u51FA\u82B1\u74E3\uFF0F\u53F6\u6258\uFF0F\u8377\u53F6\uFF0C\u653E\u5230\u9AD8\u4EAE\u4F4D\u7F6E\uFF0C\u51FA\u73B0\u7EFF\u8272\u63D0\u793A\u540E\u677E\u5F00\u5DE6\u952E\uFF0C\u81EA\u52A8\u4E0A\u6D46\u5E76\u7C98\u8D34\uFF08\u89E6\u5C4F\u677E\u6307\uFF09\uFF1B\u4E5F\u53EF\u76F4\u63A5\u62D6\u52A8\u624B\u4E2D\u6750\u6599\u3002\u82B1\u74E3\u6309\u516D\u5C42\u3001\u6BCF\u5C42\u516D\u7247\u9519\u4F4D\u6392\u5217\uFF1B\u5236\u4F5C\u82B1\u74E3\u65F6\u5148\u634F\u8FB9\uFF0C\u518D\u7528\u94DC\u4E1D\u56FA\u5B9A\u3002"];if(i.id.startsWith("lining"))return["\u8FDB\u5165\u5408\u706F\u53F0\u5148\u5165\u5EA7\uFF0C\u504F\u5E73\u89C6\u89C2\u5BDF\u706F\u4F53\u3002\u5DE6\u952E\u6309\u4F4F\u706F\u4F53\u5DE6\u53F3\u62D6\u52A8\u65CB\u8F6C\uFF1B\u9762\u7B7E\u53EA\u9009\u76EE\u6807\uFF0C\u4E0D\u81EA\u52A8\u8F6C\u6B63\u3002","\u5C06\u76EE\u6807\u9762\u8F6C\u5411\u81EA\u5DF1\uFF08\u5BB9\u5DEE \xB112\xB0\uFF09\uFF0C\u677E\u624B\u540E\u6309 1 \u9009\u80F6\u5237\uFF0C\u70B9\u51FB\u9AD8\u4EAE\u9762\u6D82\u6D46\u7CCA\u3002\u62D6\u52A8\u4E0D\u4F1A\u89E6\u53D1\u5236\u4F5C\uFF0C\u89D2\u5EA6\u4E0D\u5BF9\u4E0D\u80FD\u52A0\u5DE5\u3002","\u4ECE\u7269\u54C1\u680F\u62D6\u51FA\u7EA2\u7EB8 / \u767D\u7EB8\u5230\u5DF2\u6D82\u80F6\u7684\u70B9\u4F4D\uFF0C\u518D\u70B9\u51FB\u786E\u8BA4\u8D34\u5408\u3002\u672A\u6D82\u80F6\u6216\u671D\u5411\u4E0D\u7B26\u90FD\u4E0D\u80FD\u7C98\u8D34\uFF1B\u53EF\u5148\u6D82\u591A\u5E45\uFF0C\u518D\u9010\u5E45\u8D34\u7EB8\u3002"];if(i.id.includes("dye"))return Np;if(i.id==="paper_drying")return["\u5B8C\u6210\u7C89\u7D2B\u4E0E\u7EFF\u8272\u65B9\u7EB8\u6D78\u67D3\uFF0C\u5E76\u5206\u522B\u6302\u5230\u9634\u5E72\u67B6\u3002","\u7EB8\u5F20\u81EA\u52A8\u901A\u98CE\u9634\u5E72\uFF1B\u672C\u539F\u578B\u5C06\u7B49\u5F85\u7F29\u77ED\u4E3A\u6570\u79D2\u3002","\u5E72\u900F\u540E\u624D\u524D\u5F80\u538B\u74E3\u53F0\u3002\u6B64\u65F6\u7EB8\u5F20\u4ECD\u662F\u65B9\u5F62\uFF0C\u4E0D\u662F\u82B1\u74E3\u3002"];if(i.id.includes("pressing"))return["\u9762\u677F\u9876\u90E8\u9009\u62E9\u673A\u5668\u538B\u78E8\u6216\u624B\u5DE5\u538B\u78E8\uFF1B\u5207\u6362\u53EA\u6E05\u7A7A\u672C\u8F6E\u672A\u5B8C\u6210\u64CD\u4F5C\uFF0C\u5DF2\u5B8C\u6210\u6279\u6B21\u4E0D\u53D7\u5F71\u54CD\u3002","\u673A\u5668\uFF1A\u53F3\u4FA7\u662F\u9634\u5E72\u65B9\u7EB8\uFF0C\u5DE6\u4FA7\u662F\u6EDA\u8F74\u673A\u3002\u70B9\u51FB\u542F\u52A8\uFF0C\u7B49\u5F85\u5377\u7EBF\u8FDB\u7EB8\u4E0E\u538B\u7EB9\u5B8C\u6574\u8FDB\u884C\uFF0C\u81EA\u52A8\u505C\u673A\u540E\u53D6\u7EB8\u3002","\u624B\u5DE5\uFF1A\u653E\u6599 \u2192 \u70B9\u51FB\u8D34\u7D27\u6A21\u5177\u8868\u9762\uFF08\u7B49\u7EB8\u5F20\u5B8C\u5168\u8D34\u5408\uFF09\u2192 \u6309\u4F4F\u7F20\u7EBF\uFF08\u677E\u624B\u6682\u505C\uFF09\u2192 \u7ACB\u6A21 \u2192 \u70B9\u51FB\u9524\u51FB\u516B\u6B21 \u2192 \u62C9\u9AD8\u6A21\u5177\u590D\u4F4D\uFF08\u4E0D\u62C6\u5F00\uFF09\u2192 \u62BD\u51FA\u68C9\u7EBF \u2192 \u53D6\u51FA\u538B\u7EB9\u65B9\u7EB8\u3002\u6CBF\u82B1\u74E3\u9762\u7ED5\u8F74\u7F20\u7EBF\uFF0C\u7EF7\u7D27\u7EB8\u5F20\uFF1B\u9524\u51FB\u6D88\u9664\u5185\u90E8\u7A7A\u9699\u3002\u4E24\u79CD\u65B9\u5F0F\u90FD\u5148\u538B\u7EB9\uFF0C\u518D\u88C1\u82B1\u74E3\uFF0F\u53F6\u7247\u3002"];if(i.id.includes("cutting"))return["\u5728\u8F6E\u5ED3\u4EAE\u70B9\u9644\u8FD1\u8D77\u5200\uFF0C\u6309\u4F4F\u5DE6\u952E\uFF08\u89E6\u5C4F\u6309\u4F4F\uFF09\u6CBF\u5F15\u5BFC\u7EBF\u9644\u8FD1\u8FDE\u7EED\u88C1\u5207\uFF0C\u65E0\u9700\u7CBE\u786E\u538B\u5728\u7EBF\u4E0A\u3002","\u4FDD\u6301\u987A\u5E8F\uFF0C\u6CBF\u5B8C\u6574\u8F6E\u5ED3\u8D70\u4E00\u5708\u3002\u677E\u624B\u6216\u504F\u79BB\u53EA\u4F1A\u6682\u505C\uFF0C\u8FDB\u5EA6\u4FDD\u7559\u3002\u56DE\u5230\u5F53\u524D\u4EAE\u70B9\u9644\u8FD1\uFF0C\u6309\u5DE6\u952E\u5373\u53EF\u7EE7\u7EED\uFF0C\u4E5F\u53EF\u4EE5\u9010\u6BB5\u70B9\u51FB\u88C1\u526A\u3002",i.id==="paper_cutting"?"\u88C1\u51FA\u65B9\u7EB8\u540E\u70B9\u51FB\u6536\u597D\uFF0C\u9001\u53BB\u6D78\u67D3\uFF1B\u6B64\u65F6\u4E0D\u8981\u88C1\u6210\u82B1\u74E3\u3002":"\u5B8C\u6210\u540E\u70B9\u51FB\u6536\u597D\uFF0C\u83B7\u5F97\u82B1\u74E3\uFF0F\u53F6\u7247\uFF0C\u4FDD\u7559\u7EB8\u4E0A\u6E10\u53D8\u4E0E\u538B\u7EB9\u3002"];let e=vc[i.id];return i.id==="top_flower_assembly"?["\u4ECE\u4E0B\u65B9\u80CC\u5305\u6309\u4F4F\u82B1\u5934\uFF0C\u62D6\u5230\u5DE5\u4F5C\u53F0\u7684\u9AD8\u4EAE\u5B89\u88C5\u8F6E\u5ED3\u3002","\u5BF9\u51C6\u4F4D\u7F6E\u540E\u677E\u5F00\u5DE6\u952E\uFF08\u89E6\u5C4F\u677E\u6307\uFF09\uFF0C\u81EA\u52A8\u5B89\u88C5\u4E00\u7EC4\uFF0C\u80CC\u5305\u6570\u91CF\u51CF\u4E00\u3002","\u672A\u5230\u4F4D\u6216\u53D6\u6D88\u62D6\u52A8\u4E0D\u6D88\u8017\u82B1\u5934\uFF1B\u7559\u5728\u5DE5\u4F5C\u53F0\u7EE7\u7EED\u62D6\u51FA\u4E0B\u4E00\u7EC4\u3002"]:["top_flower_assembly","pod_assembly"].includes(i.id)?["\u6293\u4F4F\u6750\u6599\u4E0A\u7684\u5C0F\u5706\u70B9\uFF0C\u62D6\u5230\u9AD8\u4EAE\u8F6E\u5ED3\u3002","\u63A5\u8FD1\u76EE\u6807\u540E\u677E\u5F00\u5DE6\u952E\uFF08\u89E6\u5C4F\u677E\u6307\uFF09\uFF0C\u81EA\u52A8\u5BF9\u9F50\u5E76\u7C98\u8D34\uFF0C\u65E0\u9700\u989D\u5916\u786E\u8BA4\u3002","\u672A\u5230\u76EE\u6807\u4F4D\u7F6E\u5219\u4E0D\u6D88\u8017\u6750\u6599\uFF0C\u53EF\u4EE5\u7EE7\u7EED\u8C03\u6574\u3002"]:["flower_making","pod_making"].includes(i.id)?["\u6293\u4F4F\u64CD\u4F5C\u5706\u70B9\uFF0C\u5411\u53F3\u62D6\u52A8\u5377\u66F2\u3002","\u5377\u5F97\u8FC7\u7D27\u65F6\u5411\u5DE6\u9000\u56DE\uFF0C\u8C03\u6574\u5230\u5408\u9002\u5F27\u5EA6\u3002","\u5F27\u5EA6\u5408\u683C\u540E\u677E\u5F00\u5DE6\u952E\u81EA\u52A8\u6536\u597D\uFF0C\u65E0\u9700\u989D\u5916\u786E\u8BA4\u3002"]:e==="shape"?["\u6293\u4F4F\u6750\u6599\u4E0A\u7684\u64CD\u4F5C\u5706\u70B9\uFF0C\u5411\u53F3\u7F13\u6162\u62D6\u52A8\uFF0C\u8BA9\u6750\u6599\u9010\u6E10\u5377\u66F2\u3002","\u5377\u66F2\u8FC7\u7D27\u65F6\u5411\u5DE6\u56DE\u9000\uFF0C\u8C03\u6574\u5230\u5408\u9002\u5F27\u5EA6\u3002","\u8FBE\u5230\u8981\u6C42\u540E\u677E\u624B\uFF0C\u70B9\u51FB\u786E\u8BA4\u672C\u6B21\u624B\u4F5C\u3002"]:e==="place"?["\u6293\u4F4F\u6750\u6599\u4E0A\u7684\u5C0F\u5706\u70B9\uFF0C\u62D6\u5411\u76EE\u6807\u4F4D\u7F6E\u3002","\u6309 Q / R\u3001\u6EDA\u8F6E\u6216\u65CB\u8F6C\u6309\u94AE\u8C03\u6574\u65B9\u5411\uFF0C\u5BF9\u9F50\u4EAE\u70B9\u540E\u677E\u5F00\u3002","\u5728\u63A5\u5408\u5904\u6309\u4F4F\u7247\u523B\uFF0C\u5B8C\u6210\u56FA\u5B9A\uFF0C\u518D\u70B9\u51FB\u786E\u8BA4\u3002"]:e==="bind"?["\u4ECE\u5F15\u5BFC\u7EBF\u8D77\u70B9\u5F00\u59CB\uFF0C\u6309\u4F4F\u5DE6\u952E\u6CBF\u7EBF\u7F13\u6162\u7ED5\u884C\u3002","\u8DDF\u968F\u4EAE\u70B9\u9010\u6BB5\u5B8C\u6210\u7F20\u7ED5\uFF1B\u504F\u79BB\u65F6\u56DE\u5230\u5F15\u7EBF\u7EE7\u7EED\u3002","\u8FBE\u5230\u8981\u6C42\u540E\u70B9\u51FB\u786E\u8BA4\uFF0C\u7EE7\u7EED\u4E0B\u4E00\u5904\u540A\u6302\u652F\u6491\u3002"]:["\u6309\u4F4F\u9F20\u6807\uFF0C\u4F9D\u6B21\u79FB\u5230\u56DB\u4E2A\u89C2\u5BDF\u70B9\uFF0C\u6BCF\u5904\u505C\u7559\u7247\u523B\u3002","\u89C2\u5BDF\u7EB8\u9762\u3001\u706F\u4F53\u6BD4\u4F8B\u53CA\u70B9\u4EAE\u6548\u679C\uFF0C\u8FD9\u662F\u5168\u6D41\u7A0B\u6700\u540E\u7684\u9A8C\u706F\u73AF\u8282\u3002","\u6240\u6709\u89C2\u5BDF\u70B9\u5B8C\u6210\u540E\u70B9\u51FB\u786E\u8BA4\uFF0C\u6B23\u8D4F\u6210\u706F\u3002"]}var Ds=lt.map((i,e)=>({...i,number:e+1,location:Dp[i.station],materials:Up[i.id],steps:Fp(i),note:i.id.includes("dye")?"1\u20142 \u5206\u949F\u662F\u672C\u539F\u578B\u7684\u6A21\u62DF\u64CD\u4F5C\u533A\u95F4\uFF0C\u4E0D\u662F\u6240\u6709\u7EB8\u6750\u3001\u67D3\u6DB2\u7684\u7EDF\u4E00\u5DE5\u827A\u6807\u51C6\u3002\u8BA1\u65F6\u4E3A 20 \u500D\u901F\uFF1A\u5B9E\u9645\u7EA6 3\u20146 \u79D2\u3002\u4E0B\u7AEF\u6DF1\u3001\u4E0A\u7AEF\u6D45\u8FD1\u767D\uFF1B\u4E0D\u8DB3\u53EF\u7EED\u67D3\uFF0C\u8FC7\u6DF1\u8BF7\u5F03\u7EB8\u3002":i.hint}));function bh({getStage:i,onOpen:e}){let t=document.createElement("button");t.id="craft-book-open",t.innerHTML='<span class="book-mini">\u706F</span><span>\u505A\u706F\u4E66<small>B \xB7 \u968F\u65F6\u7FFB\u9605</small></span>',t.setAttribute("aria-haspopup","dialog"),document.body.append(t);let n=document.createElement("dialog");n.id="craft-book",n.setAttribute("aria-labelledby","craft-book-title"),n.innerHTML=`<div class="book-binding" aria-hidden="true"></div><header class="book-head"><div><span class="book-imprint">\u79E6\u6DEE\u706F\u574A \xB7 \u624B\u4F5C\u62FE\u8981</span><h2 id="craft-book-title">\u4E00\u518C\u505A\u706F\u4E66</h2></div><button id="book-close" aria-label="\u5408\u4E0A\u505A\u706F\u4E66">\u5408\u5377 \xD7</button></header><div class="book-spread"><aside class="book-index"><div class="book-index-head"><span>\u76EE \u5F55</span><button id="book-current">\u5B9A\u4F4D\u5F53\u524D\u5DE5\u5E8F \u2197</button></div><p>\u4F9D\u6B21\u9020\u7269\uFF0C\u4ECE\u7AF9\u7BFE\u5230\u4E00\u76CF\u706F\u3002</p><nav aria-label="\u505A\u706F\u5DE5\u5E8F\u76EE\u5F55">${Ds.map((h,d)=>`${d===0||h.phase!==Ds[d-1].phase?`<h3>${Cr[h.phase]}</h3>`:""}<button data-chapter="${d}"><span>${String(d+1).padStart(2,"0")}</span>${h.name}<i></i></button>`).join("")}</nav></aside><article class="book-leaf" tabindex="0" aria-label="\u5DE5\u5E8F\u64CD\u4F5C\u8BF4\u660E"><span id="book-chapter-kicker"></span><h3 id="book-chapter-title"></h3><div class="book-material"><b>\u5907\u6599 \xB7 \u7528\u5177</b><p id="book-materials"></p></div><ol id="book-steps"></ol><aside class="book-margin-note"><b>\u5320\u5FC3\u5C0F\u8BB0</b><p id="book-note"></p></aside><p class="book-order">\u7EB8\u4F5C\u6B21\u5E8F\uFF1A\u88C1\u65B9\u7EB8 \u2192 \u6D78\u67D3 \u2192 \u9634\u5E72 \u2192 \u538B\u7EB9 \u2192 \u88C1\u82B1\u74E3\uFF0F\u53F6\u7247</p></article></div><footer class="book-foot"><button id="book-toc-toggle" aria-expanded="false">\u76EE\u5F55</button><button id="book-prev">\u2190 \u524D\u4E00\u5DE5\u5E8F</button><span id="book-page" aria-live="polite"></span><button id="book-next">\u540E\u4E00\u5DE5\u5E8F \u2192</button><small>\u2190 \u2192 \u7FFB\u9875 \xB7 B / Esc \u5408\u5377 \xB7 \u9605\u8BFB\u65F6\u624B\u4F5C\u6682\u505C</small></footer>`,document.body.append(n);let s=0,r=!1,o,a=h=>document.getElementById(h);function l(h=!0){let d=Ds[s],f=i();a("book-chapter-kicker").textContent=`\u7B2C ${String(d.number).padStart(2,"0")} \u7AE0 \uFF0F ${d.location}${s===f?" \xB7 \u6B63\u5728\u5236\u4F5C":""}`,a("book-chapter-title").textContent=d.name,a("book-materials").textContent=d.materials,a("book-steps").innerHTML=d.steps.map(_=>`<li>${_}</li>`).join(""),a("book-note").textContent=d.note,a("book-page").textContent=`${d.number} / ${Ds.length}`,a("book-prev").disabled=s===0,a("book-next").disabled=s===Ds.length-1;for(let _ of n.querySelectorAll("[data-chapter]"))_.setAttribute("aria-current",String(+_.dataset.chapter===s)),_.classList.toggle("current-stage",+_.dataset.chapter===f),_.querySelector("i").textContent=+_.dataset.chapter===f?"\u6B64\u5904":"";let g=n.querySelector(".book-leaf");g.scrollTop=0,h&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&g.animate([{opacity:.35,transform:"perspective(900px) rotateY(-5deg)"},{opacity:1,transform:"none"}],{duration:260,easing:"ease-out"})}function c(){document.querySelector("dialog[open]")||(o=document.activeElement,r||(s=i()),r=!0,e(),window.dispatchEvent(new Event("craft-book-open")),l(!1),n.showModal(),a("book-close").focus())}function u(h){s=Math.max(0,Math.min(Ds.length-1,h)),n.classList.remove("show-index"),a("book-toc-toggle").setAttribute("aria-expanded","false"),l()}t.onclick=c,a("book-close").onclick=()=>n.close(),n.addEventListener("close",()=>o?.focus()),a("book-prev").onclick=()=>u(s-1),a("book-next").onclick=()=>u(s+1),a("book-current").onclick=()=>u(i());for(let h of n.querySelectorAll("[data-chapter]"))h.onclick=()=>u(+h.dataset.chapter);return a("book-toc-toggle").onclick=()=>{a("book-toc-toggle").setAttribute("aria-expanded",String(n.classList.toggle("show-index")))},window.addEventListener("keydown",h=>{if(h.code==="KeyB"&&h.repeat){h.preventDefault();return}n.open?(h.code!=="Tab"&&h.stopImmediatePropagation(),["KeyB","Escape"].includes(h.code)?(h.preventDefault(),n.close()):["ArrowLeft","ArrowRight"].includes(h.code)&&(h.preventDefault(),u(s+(h.code==="ArrowLeft"?-1:1)))):h.code==="KeyB"&&!h.repeat&&!["INPUT","TEXTAREA","SELECT"].includes(h.target.tagName)&&(h.preventDefault(),h.stopImmediatePropagation(),c())},!0),{open:c}}var ad=0,uu=1,ld=2;var hu=1,sl=2,fi=3,Ai=0,mn=1,ut=2,Ii=0,ds=1,du=2,fu=3,pu=4,cd=5,qi=100,ud=101,hd=102,dd=103,fd=104,pd=200,md=201,gd=202,_d=203,Aa=204,Ra=205,yd=206,xd=207,vd=208,bd=209,Md=210,Ed=211,Sd=212,wd=213,Td=214,rl=0,ol=1,al=2,fs=3,ll=4,cl=5,ul=6,hl=7,mu=0,Ad=1,Rd=2,Pi=0,Cd=1,Id=2,Pd=3,dl=4,Ld=5,Dd=6,Ud=7,Kc="attached",Nd="detached",gu=300,_s=301,ys=302,fl=303,pl=304,Ro=306,Ks=1e3,Xi=1001,Ca=1002,yn=1003,Fd=1004;var Co=1005;var ei=1006,ml=1007;var ji=1008;var si=1009,_u=1010,yu=1011,pr=1012,gl=1013,Qi=1014,ri=1015,mr=1016,_l=1017,yl=1018,gr=1020,xu=35902,vu=35899,bu=1021,Mu=1022,Ln=1023,js=1026,_r=1027,Eu=1028,xl=1029,Su=1030,vl=1031;var bl=1033,Io=33776,Po=33777,Lo=33778,Do=33779,Ml=35840,El=35841,Sl=35842,wl=35843,Tl=36196,Al=37492,Rl=37496,Cl=37808,Il=37809,Pl=37810,Ll=37811,Dl=37812,Ul=37813,Nl=37814,Fl=37815,Ol=37816,Bl=37817,kl=37818,Hl=37819,zl=37820,Vl=37821,Gl=36492,Wl=36494,Xl=36495,ql=36283,Yl=36284,$l=36285,Zl=36286;var Yr=2300,Ia=2301,Ta=2302,jc=2400,Qc=2401,eu=2402;var Od=3200,Bd=3201;var wu=0,kd=1,Li="",kt="srgb",ps="srgb-linear",$r="linear",xt="srgb";var hs=7680;var tu=519,Hd=512,zd=513,Vd=514,Tu=515,Gd=516,Wd=517,Xd=518,qd=519,Pa=35044;var Au="300 es",jn=2e3,Zr=2001;var Ri=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Mh=1234567,Gr=Math.PI/180,Qs=180/Math.PI;function Qn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[t&63|128]+rn[t>>8&255]+"-"+rn[t>>16&255]+rn[t>>24&255]+rn[n&255]+rn[n>>8&255]+rn[n>>16&255]+rn[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function Ru(i,e){return(i%e+e)%e}function Op(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Bp(i,e,t){return i!==e?(t-i)/(e-i):0}function Wr(i,e,t){return(1-t)*i+t*e}function kp(i,e,t,n){return Wr(i,e,1-Math.exp(-t*n))}function Hp(i,e=1){return e-Math.abs(Ru(i,e*2)-e)}function zp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Vp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Gp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Wp(i,e){return i+Math.random()*(e-i)}function Xp(i){return i*(.5-Math.random())}function qp(i){i!==void 0&&(Mh=i);let e=Mh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Yp(i){return i*Gr}function $p(i){return i*Qs}function Zp(i){return(i&i-1)===0&&i!==0}function Jp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Kp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function jp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Kn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Xt={DEG2RAD:Gr,RAD2DEG:Qs,generateUUID:Qn,clamp:st,euclideanModulo:Ru,mapLinear:Op,inverseLerp:Bp,lerp:Wr,damp:kp,pingpong:Hp,smoothstep:zp,smootherstep:Vp,randInt:Gp,randFloat:Wp,randFloatSpread:Xp,seededRandom:qp,degToRad:Yp,radToDeg:$p,isPowerOfTwo:Zp,ceilPowerOfTwo:Jp,floorPowerOfTwo:Kp,setQuaternionFromProperEuler:jp,normalize:yt,denormalize:Kn},we=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ti=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==d||c!==f||u!==g){let m=1-a,p=l*d+c*f+u*g+h*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){let D=Math.sqrt(x),w=Math.atan2(D,p*y);m=Math.sin(m*w)/D,a=Math.sin(a*w)/D}let v=a*y;if(l=l*m+d*v,c=c*m+f*v,u=u*m+g*v,h=h*m+_*v,m===1-a){let D=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=D,c*=D,u*=D,h*=D}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-a*f,e[t+2]=c*g+u*f+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>h){let f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},k=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Eh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Eh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return bc.copy(this).projectOnVector(e),this.sub(bc)}reflect(e){return this.sub(bc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},bc=new k,Eh=new ti,Qe=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],y=s[1],x=s[4],v=s[7],D=s[2],w=s[5],A=s[8];return r[0]=o*_+a*y+l*D,r[3]=o*m+a*x+l*w,r[6]=o*p+a*v+l*A,r[1]=c*_+u*y+h*D,r[4]=c*m+u*x+h*w,r[7]=c*p+u*v+h*A,r[2]=d*_+f*y+g*D,r[5]=d*m+f*x+g*w,r[8]=d*p+f*v+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,g=t*h+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(s*c-u*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Mc.makeScale(e,t)),this}rotate(e){return this.premultiply(Mc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Mc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Mc=new Qe;function Cu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yd(){let i=Jr("canvas");return i.style.display="block",i}var Sh={};function er(i){i in Sh||(Sh[i]=!0,console.warn(i))}function $d(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var wh=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Th=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Qp(){let i={enabled:!0,workingColorSpace:ps,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===xt&&(s.r=Ti(s.r),s.g=Ti(s.g),s.b=Ti(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===xt&&(s.r=Js(s.r),s.g=Js(s.g),s.b=Js(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Li?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return er("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return er("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ps]:{primaries:e,whitePoint:n,transfer:$r,toXYZ:wh,fromXYZ:Th,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:wh,fromXYZ:Th,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}}),i}var ct=Qp();function Ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Js(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Us,La=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Us===void 0&&(Us=Jr("canvas")),Us.width=e.width,Us.height=e.height;let s=Us.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Jr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ti(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ti(t[n]/255)*255):t[n]=Ti(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},em=0,tr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:em++}),this.uuid=Qn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ec(s[o].image)):r.push(Ec(s[o]))}else r=Ec(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Ec(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?La.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var tm=0,Sc=new k,fn=class i extends Ri{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Xi,s=Xi,r=ei,o=ji,a=Ln,l=si,c=i.DEFAULT_ANISOTROPY,u=Li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=Qn(),this.name="",this.source=new tr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new we(0,0),this.repeat=new we(1,1),this.center=new we(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Sc).x}get height(){return this.source.getSize(Sc).y}get depth(){return this.source.getSize(Sc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ks:e.x=e.x-Math.floor(e.x);break;case Xi:e.x=e.x<0?0:1;break;case Ca:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ks:e.y=e.y-Math.floor(e.y);break;case Xi:e.y=e.y<0?0:1;break;case Ca:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=gu;fn.DEFAULT_ANISOTROPY=1;var ft=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,v=(f+1)/2,D=(p+1)/2,w=(u+d)/4,A=(h+_)/4,B=(g+m)/4;return x>v&&x>D?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=A/n):v>D?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=w/s,r=B/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=A/r,s=B/r),this.set(n,s,r,t),this}let y=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(h-_)/y,this.z=(d-u)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Da=class extends Ri{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new fn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:ei,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new tr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},hi=class extends Da{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Kr=class extends fn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ua=class extends fn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wt=class{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint($n.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint($n.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=$n.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,$n):$n.fromBufferAttribute(r,o),$n.applyMatrix4(e.matrixWorld),this.expandByPoint($n);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ko.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ko.copy(n.boundingBox)),Ko.applyMatrix4(e.matrixWorld),this.union(Ko)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$n),$n.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dr),jo.subVectors(this.max,Dr),Ns.subVectors(e.a,Dr),Fs.subVectors(e.b,Dr),Os.subVectors(e.c,Dr),ki.subVectors(Fs,Ns),Hi.subVectors(Os,Fs),as.subVectors(Ns,Os);let t=[0,-ki.z,ki.y,0,-Hi.z,Hi.y,0,-as.z,as.y,ki.z,0,-ki.x,Hi.z,0,-Hi.x,as.z,0,-as.x,-ki.y,ki.x,0,-Hi.y,Hi.x,0,-as.y,as.x,0];return!wc(t,Ns,Fs,Os,jo)||(t=[1,0,0,0,1,0,0,0,1],!wc(t,Ns,Fs,Os,jo))?!1:(Qo.crossVectors(ki,Hi),t=[Qo.x,Qo.y,Qo.z],wc(t,Ns,Fs,Os,jo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$n).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($n).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},vi=[new k,new k,new k,new k,new k,new k,new k,new k],$n=new k,Ko=new Wt,Ns=new k,Fs=new k,Os=new k,ki=new k,Hi=new k,as=new k,Dr=new k,jo=new k,Qo=new k,ls=new k;function wc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ls.fromArray(i,r);let a=s.x*Math.abs(ls.x)+s.y*Math.abs(ls.y)+s.z*Math.abs(ls.z),l=e.dot(ls),c=t.dot(ls),u=n.dot(ls);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var nm=new Wt,Ur=new k,Tc=new k,di=class{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):nm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ur.subVectors(e,this.center);let t=Ur.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ur,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ur.copy(e.center).add(Tc)),this.expandByPoint(Ur.copy(e.center).sub(Tc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},bi=new k,Ac=new k,ea=new k,zi=new k,Rc=new k,ta=new k,Cc=new k,Yi=class{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bi.copy(this.origin).addScaledVector(this.direction,t),bi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ac.copy(e).add(t).multiplyScalar(.5),ea.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(Ac);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ea),a=zi.dot(this.direction),l=-zi.dot(ea),c=zi.lengthSq(),u=Math.abs(1-o*o),h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=r*u,h>=0)if(d>=-g)if(d<=g){let _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Ac).addScaledVector(ea,d),f}intersectSphere(e,t){bi.subVectors(e.center,this.origin);let n=bi.dot(this.direction),s=bi.dot(bi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,bi)!==null}intersectTriangle(e,t,n,s,r){Rc.subVectors(t,e),ta.subVectors(n,e),Cc.crossVectors(Rc,ta);let o=this.direction.dot(Cc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zi.subVectors(this.origin,e);let l=a*this.direction.dot(ta.crossVectors(zi,ta));if(l<0)return null;let c=a*this.direction.dot(Rc.cross(zi));if(c<0||l+c>o)return null;let u=-a*zi.dot(Cc);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},rt=class i{constructor(e,t,n,s,r,o,a,l,c,u,h,d,f,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,d,f,g,_,m)}set(e,t,n,s,r,o,a,l,c,u,h,d,f,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Bs.setFromMatrixColumn(e,0).length(),r=1/Bs.setFromMatrixColumn(e,1).length(),o=1/Bs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let d=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-_*h}else if(e.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(im,e,sm)}lookAt(e,t,n){let s=this.elements;return Tn.subVectors(e,t),Tn.lengthSq()===0&&(Tn.z=1),Tn.normalize(),Vi.crossVectors(n,Tn),Vi.lengthSq()===0&&(Math.abs(n.z)===1?Tn.x+=1e-4:Tn.z+=1e-4,Tn.normalize(),Vi.crossVectors(n,Tn)),Vi.normalize(),na.crossVectors(Tn,Vi),s[0]=Vi.x,s[4]=na.x,s[8]=Tn.x,s[1]=Vi.y,s[5]=na.y,s[9]=Tn.y,s[2]=Vi.z,s[6]=na.z,s[10]=Tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],y=n[3],x=n[7],v=n[11],D=n[15],w=s[0],A=s[4],B=s[8],M=s[12],E=s[1],O=s[5],L=s[9],H=s[13],J=s[2],Z=s[6],K=s[10],ge=s[14],G=s[3],_e=s[7],me=s[11],ye=s[15];return r[0]=o*w+a*E+l*J+c*G,r[4]=o*A+a*O+l*Z+c*_e,r[8]=o*B+a*L+l*K+c*me,r[12]=o*M+a*H+l*ge+c*ye,r[1]=u*w+h*E+d*J+f*G,r[5]=u*A+h*O+d*Z+f*_e,r[9]=u*B+h*L+d*K+f*me,r[13]=u*M+h*H+d*ge+f*ye,r[2]=g*w+_*E+m*J+p*G,r[6]=g*A+_*O+m*Z+p*_e,r[10]=g*B+_*L+m*K+p*me,r[14]=g*M+_*H+m*ge+p*ye,r[3]=y*w+x*E+v*J+D*G,r[7]=y*A+x*O+v*Z+D*_e,r[11]=y*B+x*L+v*K+D*me,r[15]=y*M+x*H+v*ge+D*ye,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*f-n*l*f)+_*(+t*l*f-t*c*d+r*o*d-s*o*f+s*c*u-r*l*u)+m*(+t*c*h-t*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+p*(-s*a*u-t*l*h+t*a*d+s*o*h-n*o*d+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],y=h*m*c-_*d*c+_*l*f-a*m*f-h*l*p+a*d*p,x=g*d*c-u*m*c-g*l*f+o*m*f+u*l*p-o*d*p,v=u*_*c-g*h*c+g*a*f-o*_*f-u*a*p+o*h*p,D=g*h*l-u*_*l-g*a*d+o*_*d+u*a*m-o*h*m,w=t*y+n*x+s*v+r*D;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/w;return e[0]=y*A,e[1]=(_*d*r-h*m*r-_*s*f+n*m*f+h*s*p-n*d*p)*A,e[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*A,e[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*f-n*l*f)*A,e[4]=x*A,e[5]=(u*m*r-g*d*r+g*s*f-t*m*f-u*s*p+t*d*p)*A,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*A,e[7]=(o*d*r-u*l*r+u*s*c-t*d*c-o*s*f+t*l*f)*A,e[8]=v*A,e[9]=(g*h*r-u*_*r-g*n*f+t*_*f+u*n*p-t*h*p)*A,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*p+t*a*p)*A,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*f-t*a*f)*A,e[12]=D*A,e[13]=(u*_*s-g*h*s+g*n*d-t*_*d-u*n*m+t*h*m)*A,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*m-t*a*m)*A,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*d+t*a*d)*A,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,g=r*h,_=o*u,m=o*h,p=a*h,y=l*c,x=l*u,v=l*h,D=n.x,w=n.y,A=n.z;return s[0]=(1-(_+p))*D,s[1]=(f+v)*D,s[2]=(g-x)*D,s[3]=0,s[4]=(f-v)*w,s[5]=(1-(d+p))*w,s[6]=(m+y)*w,s[7]=0,s[8]=(g+x)*A,s[9]=(m-y)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Bs.set(s[0],s[1],s[2]).length(),o=Bs.set(s[4],s[5],s[6]).length(),a=Bs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Zn.copy(this);let c=1/r,u=1/o,h=1/a;return Zn.elements[0]*=c,Zn.elements[1]*=c,Zn.elements[2]*=c,Zn.elements[4]*=u,Zn.elements[5]*=u,Zn.elements[6]*=u,Zn.elements[8]*=h,Zn.elements[9]*=h,Zn.elements[10]*=h,t.setFromRotationMatrix(Zn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=jn,l=!1){let c=this.elements,u=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===jn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Zr)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=jn,l=!1){let c=this.elements,u=2/(t-e),h=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===jn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Zr)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Bs=new k,Zn=new rt,im=new k(0,0,0),sm=new k(1,1,1),Vi=new k,na=new k,Tn=new k,Ah=new rt,Rh=new ti,pn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ah.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ah,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Rh.setFromEuler(this),this.setFromQuaternion(Rh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};pn.DEFAULT_ORDER="XYZ";var nr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},rm=0,Ch=new k,ks=new ti,Mi=new rt,ia=new k,Nr=new k,om=new k,am=new ti,Ih=new k(1,0,0),Ph=new k(0,1,0),Lh=new k(0,0,1),Dh={type:"added"},lm={type:"removed"},Hs={type:"childadded",child:null},Ic={type:"childremoved",child:null},zt=class i extends Ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new k,t=new pn,n=new ti,s=new k(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new rt},normalMatrix:{value:new Qe}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.multiply(ks),this}rotateOnWorldAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.premultiply(ks),this}rotateX(e){return this.rotateOnAxis(Ih,e)}rotateY(e){return this.rotateOnAxis(Ph,e)}rotateZ(e){return this.rotateOnAxis(Lh,e)}translateOnAxis(e,t){return Ch.copy(e).applyQuaternion(this.quaternion),this.position.add(Ch.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ih,e)}translateY(e){return this.translateOnAxis(Ph,e)}translateZ(e){return this.translateOnAxis(Lh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ia.copy(e):ia.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mi.lookAt(Nr,ia,this.up):Mi.lookAt(ia,Nr,this.up),this.quaternion.setFromRotationMatrix(Mi),s&&(Mi.extractRotation(s.matrixWorld),ks.setFromRotationMatrix(Mi),this.quaternion.premultiply(ks.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dh),Hs.child=e,this.dispatchEvent(Hs),Hs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(lm),Ic.child=e,this.dispatchEvent(Ic),Ic.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dh),Hs.child=e,this.dispatchEvent(Hs),Hs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,e,om),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,am,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};zt.DEFAULT_UP=new k(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Jn=new k,Ei=new k,Pc=new k,Si=new k,zs=new k,Vs=new k,Uh=new k,Lc=new k,Dc=new k,Uc=new k,Nc=new ft,Fc=new ft,Oc=new ft,wi=class i{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Jn.subVectors(e,t),s.cross(Jn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Jn.subVectors(s,t),Ei.subVectors(n,t),Pc.subVectors(e,t);let o=Jn.dot(Jn),a=Jn.dot(Ei),l=Jn.dot(Pc),c=Ei.dot(Ei),u=Ei.dot(Pc),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Si)===null?!1:Si.x>=0&&Si.y>=0&&Si.x+Si.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Si)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Si.x),l.addScaledVector(o,Si.y),l.addScaledVector(a,Si.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Nc.setScalar(0),Fc.setScalar(0),Oc.setScalar(0),Nc.fromBufferAttribute(e,t),Fc.fromBufferAttribute(e,n),Oc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Nc,r.x),o.addScaledVector(Fc,r.y),o.addScaledVector(Oc,r.z),o}static isFrontFacing(e,t,n,s){return Jn.subVectors(n,t),Ei.subVectors(e,t),Jn.cross(Ei).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),Jn.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;zs.subVectors(s,n),Vs.subVectors(r,n),Lc.subVectors(e,n);let l=zs.dot(Lc),c=Vs.dot(Lc);if(l<=0&&c<=0)return t.copy(n);Dc.subVectors(e,s);let u=zs.dot(Dc),h=Vs.dot(Dc);if(u>=0&&h<=u)return t.copy(s);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(zs,o);Uc.subVectors(e,r);let f=zs.dot(Uc),g=Vs.dot(Uc);if(g>=0&&f<=g)return t.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(Vs,a);let m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return Uh.subVectors(r,s),a=(h-u)/(h-u+(f-g)),t.copy(s).addScaledVector(Uh,a);let p=1/(m+_+d);return o=_*p,a=d*p,t.copy(n).addScaledVector(zs,o).addScaledVector(Vs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Zd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},sa={h:0,s:0,l:0};function Bc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ye=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ct.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,ct.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ct.workingColorSpace){if(e=Ru(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Bc(o,r,e+1/3),this.g=Bc(o,r,e),this.b=Bc(o,r,e-1/3)}return ct.colorSpaceToWorking(this,s),this}setStyle(e,t=kt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let n=Zd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return ct.workingToColorSpace(on.copy(this),e),Math.round(st(on.r*255,0,255))*65536+Math.round(st(on.g*255,0,255))*256+Math.round(st(on.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ct.workingColorSpace){ct.workingToColorSpace(on.copy(this),t);let n=on.r,s=on.g,r=on.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ct.workingColorSpace){return ct.workingToColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=kt){ct.workingToColorSpace(on.copy(this),e);let t=on.r,n=on.g,s=on.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+t,Gi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gi),e.getHSL(sa);let n=Wr(Gi.h,sa.h,t),s=Wr(Gi.s,sa.s,t),r=Wr(Gi.l,sa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},on=new Ye;Ye.NAMES=Zd;var cm=0,ni=class extends Ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=Qn(),this.name="",this.type="Material",this.blending=ds,this.side=Ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ra,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hs,this.stencilZFail=hs,this.stencilZPass=hs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ds&&(n.blending=this.blending),this.side!==Ai&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ra&&(n.blendDst=this.blendDst),this.blendEquation!==qi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ft=class extends ni{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.combine=mu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Bt=new k,ra=new we,um=0,Nt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:um++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Pa,this.updateRanges=[],this.gpuType=ri,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ra.fromBufferAttribute(this,t),ra.applyMatrix3(e),this.setXY(t,ra.x,ra.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix3(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Kn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Kn(t,this.array)),t}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Kn(t,this.array)),t}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Kn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Kn(t,this.array)),t}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pa&&(e.usage=this.usage),e}};var $i=class extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var jr=class extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ke=class extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}},hm=0,Vn=new rt,kc=new zt,Gs=new k,An=new Wt,Fr=new Wt,Qt=new k,et=class i extends Ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cu(e)?jr:$i)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Vn.makeRotationFromQuaternion(e),this.applyMatrix4(Vn),this}rotateX(e){return Vn.makeRotationX(e),this.applyMatrix4(Vn),this}rotateY(e){return Vn.makeRotationY(e),this.applyMatrix4(Vn),this}rotateZ(e){return Vn.makeRotationZ(e),this.applyMatrix4(Vn),this}translate(e,t,n){return Vn.makeTranslation(e,t,n),this.applyMatrix4(Vn),this}scale(e,t,n){return Vn.makeScale(e,t,n),this.applyMatrix4(Vn),this}lookAt(e){return kc.lookAt(e),kc.updateMatrix(),this.applyMatrix4(kc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gs).negate(),this.translate(Gs.x,Gs.y,Gs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ke(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];An.setFromBufferAttribute(r),this.morphTargetsRelative?(Qt.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(Qt),Qt.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(Qt)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){let n=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Fr.setFromBufferAttribute(a),this.morphTargetsRelative?(Qt.addVectors(An.min,Fr.min),An.expandByPoint(Qt),Qt.addVectors(An.max,Fr.max),An.expandByPoint(Qt)):(An.expandByPoint(Fr.min),An.expandByPoint(Fr.max))}An.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Qt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Qt.fromBufferAttribute(a,c),l&&(Gs.fromBufferAttribute(e,c),Qt.add(Gs)),s=Math.max(s,n.distanceToSquared(Qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let B=0;B<n.count;B++)a[B]=new k,l[B]=new k;let c=new k,u=new k,h=new k,d=new we,f=new we,g=new we,_=new k,m=new k;function p(B,M,E){c.fromBufferAttribute(n,B),u.fromBufferAttribute(n,M),h.fromBufferAttribute(n,E),d.fromBufferAttribute(r,B),f.fromBufferAttribute(r,M),g.fromBufferAttribute(r,E),u.sub(c),h.sub(c),f.sub(d),g.sub(d);let O=1/(f.x*g.y-g.x*f.y);isFinite(O)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(O),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(O),a[B].add(_),a[M].add(_),a[E].add(_),l[B].add(m),l[M].add(m),l[E].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let B=0,M=y.length;B<M;++B){let E=y[B],O=E.start,L=E.count;for(let H=O,J=O+L;H<J;H+=3)p(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let x=new k,v=new k,D=new k,w=new k;function A(B){D.fromBufferAttribute(s,B),w.copy(D);let M=a[B];x.copy(M),x.sub(D.multiplyScalar(D.dot(M))).normalize(),v.crossVectors(w,M);let O=v.dot(l[B])<0?-1:1;o.setXYZW(B,x.x,x.y,x.z,O)}for(let B=0,M=y.length;B<M;++B){let E=y[B],O=E.start,L=E.count;for(let H=O,J=O+L;H<J;H+=3)A(e.getX(H+0)),A(e.getX(H+1)),A(e.getX(H+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new k,r=new k,o=new k,a=new k,l=new k,c=new k,u=new k,h=new k;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Qt.fromBufferAttribute(e,t),Qt.normalize(),e.setXYZ(t,Qt.x,Qt.y,Qt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new Nt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Nh=new rt,cs=new Yi,oa=new di,Fh=new k,aa=new k,la=new k,ca=new k,Hc=new k,ua=new k,Oh=new k,ha=new k,Ue=class extends zt{constructor(e=new et,t=new Ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ua.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(Hc.fromBufferAttribute(h,e),o?ua.addScaledVector(Hc,u):ua.addScaledVector(Hc.sub(t),u))}t.add(ua)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(r),cs.copy(e.ray).recast(e.near),!(oa.containsPoint(cs.origin)===!1&&(cs.intersectSphere(oa,Fh)===null||cs.origin.distanceToSquared(Fh)>(e.far-e.near)**2))&&(Nh.copy(r).invert(),cs.copy(e.ray).applyMatrix4(Nh),!(n.boundingBox!==null&&cs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,cs)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,D=x;v<D;v+=3){let w=a.getX(v),A=a.getX(v+1),B=a.getX(v+2);s=da(this,p,e,n,c,u,h,w,A,B),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let y=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);s=da(this,o,e,n,c,u,h,y,x,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,D=x;v<D;v+=3){let w=v,A=v+1,B=v+2;s=da(this,p,e,n,c,u,h,w,A,B),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let y=m,x=m+1,v=m+2;s=da(this,o,e,n,c,u,h,y,x,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function dm(i,e,t,n,s,r,o,a){let l;if(e.side===mn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Ai,a),l===null)return null;ha.copy(a),ha.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ha);return c<t.near||c>t.far?null:{distance:c,point:ha.clone(),object:i}}function da(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,aa),i.getVertexPosition(l,la),i.getVertexPosition(c,ca);let u=dm(i,e,t,n,aa,la,ca,Oh);if(u){let h=new k;wi.getBarycoord(Oh,aa,la,ca,h),s&&(u.uv=wi.getInterpolatedAttribute(s,a,l,c,h,new we)),r&&(u.uv1=wi.getInterpolatedAttribute(r,a,l,c,h,new we)),o&&(u.normal=wi.getInterpolatedAttribute(o,a,l,c,h,new k),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new k,materialIndex:0};wi.getNormal(aa,la,ca,d.normal),u.face=d,u.barycoord=h}return u}var Mt=class i extends et{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ke(c,3)),this.setAttribute("normal",new Ke(u,3)),this.setAttribute("uv",new Ke(h,2));function g(_,m,p,y,x,v,D,w,A,B,M){let E=v/A,O=D/B,L=v/2,H=D/2,J=w/2,Z=A+1,K=B+1,ge=0,G=0,_e=new k;for(let me=0;me<K;me++){let ye=me*O-H;for(let Re=0;Re<Z;Re++){let Ae=Re*E-L;_e[_]=Ae*y,_e[m]=ye*x,_e[p]=J,c.push(_e.x,_e.y,_e.z),_e[_]=0,_e[m]=0,_e[p]=w>0?1:-1,u.push(_e.x,_e.y,_e.z),h.push(Re/A),h.push(1-me/B),ge+=1}}for(let me=0;me<B;me++)for(let ye=0;ye<A;ye++){let Re=d+ye+Z*me,Ae=d+ye+Z*(me+1),Ne=d+(ye+1)+Z*(me+1),He=d+(ye+1)+Z*me;l.push(Re,Ae,He),l.push(Ae,Ne,He),G+=6}a.addGroup(f,G,M),f+=G,d+=ge}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function xs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function an(i){let e={};for(let t=0;t<i.length;t++){let n=xs(i[t]);for(let s in n)e[s]=n[s]}return e}function fm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Iu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ct.workingColorSpace}var Jd={clone:xs,merge:an},pm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ii=class extends ni{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pm,this.fragmentShader=mm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=xs(e.uniforms),this.uniformsGroups=fm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Qr=class extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Wi=new k,Bh=new we,kh=new we,Gt=class extends Qr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Qs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Gr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qs*2*Math.atan(Math.tan(Gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z)}getViewSize(e,t){return this.getViewBounds(e,Bh,kh),t.subVectors(kh,Bh)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Gr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ws=-90,Xs=1,Na=class extends zt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gt(Ws,Xs,e,t);s.layers=this.layers,this.add(s);let r=new Gt(Ws,Xs,e,t);r.layers=this.layers,this.add(r);let o=new Gt(Ws,Xs,e,t);o.layers=this.layers,this.add(o);let a=new Gt(Ws,Xs,e,t);a.layers=this.layers,this.add(a);let l=new Gt(Ws,Xs,e,t);l.layers=this.layers,this.add(l);let c=new Gt(Ws,Xs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},eo=class extends fn{constructor(e=[],t=_s,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Fa=class extends hi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new eo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Mt(5,5,5),r=new ii({name:"CubemapFromEquirect",uniforms:xs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:mn,blending:Ii});r.uniforms.tEquirect.value=t;let o=new Ue(s,r),a=t.minFilter;return t.minFilter===ji&&(t.minFilter=ei),new Na(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},We=class extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},gm={type:"move"},ir=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new We,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new We,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new We,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(gm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new We;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var to=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ye(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},no=class extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pn,this.environmentIntensity=1,this.environmentRotation=new pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},io=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Pa,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},dn=new k,sr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Kn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Kn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Kn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Kn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Kn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},rr=class extends ni{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},qs,Or=new k,Ys=new k,$s=new k,Zs=new we,Br=new we,Kd=new rt,fa=new k,kr=new k,pa=new k,Hh=new we,zc=new we,zh=new we,so=class extends zt{constructor(e=new rr){if(super(),this.isSprite=!0,this.type="Sprite",qs===void 0){qs=new et;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new io(t,5);qs.setIndex([0,1,2,0,2,3]),qs.setAttribute("position",new sr(n,3,0,!1)),qs.setAttribute("uv",new sr(n,2,3,!1))}this.geometry=qs,this.material=e,this.center=new we(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ys.setFromMatrixScale(this.matrixWorld),Kd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),$s.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ys.multiplyScalar(-$s.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;ma(fa.set(-.5,-.5,0),$s,o,Ys,s,r),ma(kr.set(.5,-.5,0),$s,o,Ys,s,r),ma(pa.set(.5,.5,0),$s,o,Ys,s,r),Hh.set(0,0),zc.set(1,0),zh.set(1,1);let a=e.ray.intersectTriangle(fa,kr,pa,!1,Or);if(a===null&&(ma(kr.set(-.5,.5,0),$s,o,Ys,s,r),zc.set(0,1),a=e.ray.intersectTriangle(fa,pa,kr,!1,Or),a===null))return;let l=e.ray.origin.distanceTo(Or);l<e.near||l>e.far||t.push({distance:l,point:Or.clone(),uv:wi.getInterpolation(Or,fa,kr,pa,Hh,zc,zh,new we),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ma(i,e,t,n,s,r){Zs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Br.x=r*Zs.x-s*Zs.y,Br.y=s*Zs.x+r*Zs.y):Br.copy(Zs),i.copy(e),i.x+=Br.x,i.y+=Br.y,i.applyMatrix4(Kd)}var Vh=new k,Gh=new ft,Wh=new ft,_m=new k,Xh=new rt,ga=new k,Vc=new di,qh=new rt,Gc=new Yi,ro=class extends Ue{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Kc,this.bindMatrix=new rt,this.bindMatrixInverse=new rt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Wt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ga),this.boundingBox.expandByPoint(ga)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new di),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ga),this.boundingSphere.expandByPoint(ga)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vc.copy(this.boundingSphere),Vc.applyMatrix4(s),e.ray.intersectsSphere(Vc)!==!1&&(qh.copy(s).invert(),Gc.copy(e.ray).applyMatrix4(qh),!(this.boundingBox!==null&&Gc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Gc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new ft,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Kc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Nd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Gh.fromBufferAttribute(s.attributes.skinIndex,e),Wh.fromBufferAttribute(s.attributes.skinWeight,e),Vh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Wh.getComponent(r);if(o!==0){let a=Gh.getComponent(r);Xh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(_m.copy(Vh).applyMatrix4(Xh),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},or=class extends zt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Oa=class extends fn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=yn,u=yn,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yh=new rt,ym=new rt,oo=class i{constructor(e=[],t=[]){this.uuid=Qn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new rt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new rt;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:ym;Yh.multiplyMatrices(a,t[r]),Yh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Oa(t,e,e,Ln,ri);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new or),this.bones.push(o),this.boneInverses.push(new rt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}};var Wc=new k,xm=new k,vm=new Qe,Ht=class{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Wc.subVectors(n,t).cross(xm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Wc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||vm.getNormalMatrix(e),s=this.coplanarPoint(Wc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},us=new di,bm=new we(.5,.5),_a=new k,ar=class{constructor(e=new Ht,t=new Ht,n=new Ht,s=new Ht,r=new Ht,o=new Ht){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=jn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],y=r[12],x=r[13],v=r[14],D=r[15];if(s[0].setComponents(c-o,f-u,p-g,D-y).normalize(),s[1].setComponents(c+o,f+u,p+g,D+y).normalize(),s[2].setComponents(c+a,f+h,p+_,D+x).normalize(),s[3].setComponents(c-a,f-h,p-_,D-x).normalize(),n)s[4].setComponents(l,d,m,v).normalize(),s[5].setComponents(c-l,f-d,p-m,D-v).normalize();else if(s[4].setComponents(c-l,f-d,p-m,D-v).normalize(),t===jn)s[5].setComponents(c+l,f+d,p+m,D+v).normalize();else if(t===Zr)s[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),us.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),us.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(us)}intersectsSprite(e){us.center.set(0,0,0);let t=bm.distanceTo(e.center);return us.radius=.7071067811865476+t,us.applyMatrix4(e.matrixWorld),this.intersectsSphere(us)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(_a.x=s.normal.x>0?e.max.x:e.min.x,_a.y=s.normal.y>0?e.max.y:e.min.y,_a.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(_a)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xn=class extends ni{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ye(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ba=new k,ka=new k,$h=new rt,Hr=new Yi,ya=new di,Xc=new k,Zh=new k,vn=class extends zt{constructor(e=new et,t=new xn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ba.fromBufferAttribute(t,s-1),ka.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ba.distanceTo(ka);e.setAttribute("lineDistance",new Ke(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,e.ray.intersectsSphere(ya)===!1)return;$h.copy(s).invert(),Hr.copy(e.ray).applyMatrix4($h);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=u.getX(_),y=u.getX(_+1),x=xa(this,e,Hr,l,p,y,_);x&&t.push(x)}if(this.isLineLoop){let _=u.getX(g-1),m=u.getX(f),p=xa(this,e,Hr,l,_,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=xa(this,e,Hr,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=xa(this,e,Hr,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function xa(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Ba.fromBufferAttribute(a,s),ka.fromBufferAttribute(a,r),t.distanceSqToSegment(Ba,ka,Xc,Zh)>n)return;Xc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Xc);if(!(c<e.near||c>e.far))return{distance:c,point:Zh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var lr=class extends ni{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Jh=new rt,nu=new Yi,va=new di,ba=new k,ao=class extends zt{constructor(e=new et,t=new lr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(s),va.radius+=r,e.ray.intersectsSphere(va)===!1)return;Jh.copy(s).invert(),nu.copy(e.ray).applyMatrix4(Jh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);ba.fromBufferAttribute(h,m),Kh(ba,m,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let g=d,_=f;g<_;g++)ba.fromBufferAttribute(h,g),Kh(ba,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Kh(i,e,t,n,s,r,o){let a=nu.distanceSqToPoint(i);if(a<t){let l=new k;nu.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Zi=class extends fn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},lo=class extends fn{constructor(e,t,n=Qi,s,r,o,a=yn,l=yn,c,u=js,h=1){if(u!==js&&u!==_r)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new tr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},co=class extends fn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var mt=class i extends et{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],d=[],f=[],g=0,_=[],m=n/2,p=0;y(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new Ke(h,3)),this.setAttribute("normal",new Ke(d,3)),this.setAttribute("uv",new Ke(f,2));function y(){let v=new k,D=new k,w=0,A=(t-e)/n;for(let B=0;B<=r;B++){let M=[],E=B/r,O=E*(t-e)+e;for(let L=0;L<=s;L++){let H=L/s,J=H*l+a,Z=Math.sin(J),K=Math.cos(J);D.x=O*Z,D.y=-E*n+m,D.z=O*K,h.push(D.x,D.y,D.z),v.set(Z,A,K).normalize(),d.push(v.x,v.y,v.z),f.push(H,1-E),M.push(g++)}_.push(M)}for(let B=0;B<s;B++)for(let M=0;M<r;M++){let E=_[M][B],O=_[M+1][B],L=_[M+1][B+1],H=_[M][B+1];(e>0||M!==0)&&(u.push(E,O,H),w+=3),(t>0||M!==r-1)&&(u.push(O,L,H),w+=3)}c.addGroup(p,w,0),p+=w}function x(v){let D=g,w=new we,A=new k,B=0,M=v===!0?e:t,E=v===!0?1:-1;for(let L=1;L<=s;L++)h.push(0,m*E,0),d.push(0,E,0),f.push(.5,.5),g++;let O=g;for(let L=0;L<=s;L++){let J=L/s*l+a,Z=Math.cos(J),K=Math.sin(J);A.x=M*K,A.y=m*E,A.z=M*Z,h.push(A.x,A.y,A.z),d.push(0,E,0),w.x=Z*.5+.5,w.y=K*.5*E+.5,f.push(w.x,w.y),g++}for(let L=0;L<s;L++){let H=D+L,J=O+L;v===!0?u.push(J,J+1,H):u.push(J+1,J,H),B+=3}c.addGroup(p,B,v===!0?1:2),p+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Rn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let u=n[s],d=n[s+1]-u,f=(o-u)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new we:new k);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new k,s=[],r=[],o=[],a=new k,l=new rt;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new k)}r[0]=new k,o[0]=new k;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(st(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(st(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},cr=class extends Rn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new we){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ha=class extends cr{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Pu(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Ma=new k,qc=new Pu,Yc=new Pu,$c=new Pu,ur=class extends Rn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new k){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(Ma.subVectors(s[0],s[1]).add(s[0]),c=Ma);let h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(Ma.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Ma),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),qc.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,_,m),Yc.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,_,m),$c.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(qc.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Yc.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),$c.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(qc.calc(l),Yc.calc(l),$c.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new k().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function jh(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Mm(i,e){let t=1-i;return t*t*e}function Em(i,e){return 2*(1-i)*i*e}function Sm(i,e){return i*i*e}function Xr(i,e,t,n){return Mm(i,e)+Em(i,t)+Sm(i,n)}function wm(i,e){let t=1-i;return t*t*t*e}function Tm(i,e){let t=1-i;return 3*t*t*i*e}function Am(i,e){return 3*(1-i)*i*i*e}function Rm(i,e){return i*i*i*e}function qr(i,e,t,n,s){return wm(i,e)+Tm(i,t)+Am(i,n)+Rm(i,s)}var uo=class extends Rn{constructor(e=new we,t=new we,n=new we,s=new we){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new we){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qr(e,s.x,r.x,o.x,a.x),qr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},za=class extends Rn{constructor(e=new k,t=new k,n=new k,s=new k){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new k){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qr(e,s.x,r.x,o.x,a.x),qr(e,s.y,r.y,o.y,a.y),qr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ho=class extends Rn{constructor(e=new we,t=new we){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new we){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new we){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Va=class extends Rn{constructor(e=new k,t=new k){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new k){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new k){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fo=class extends Rn{constructor(e=new we,t=new we,n=new we){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new we){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(e,s.x,r.x,o.x),Xr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},po=class extends Rn{constructor(e=new k,t=new k,n=new k){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new k){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(e,s.x,r.x,o.x),Xr(e,s.y,r.y,o.y),Xr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},mo=class extends Rn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new we){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(jh(a,l.x,c.x,u.x,h.x),jh(a,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new we().fromArray(s))}return this}},Ga=Object.freeze({__proto__:null,ArcCurve:Ha,CatmullRomCurve3:ur,CubicBezierCurve:uo,CubicBezierCurve3:za,EllipseCurve:cr,LineCurve:ho,LineCurve3:Va,QuadraticBezierCurve:fo,QuadraticBezierCurve3:po,SplineCurve:mo}),Wa=class extends Rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ga[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Ga[s.type]().fromJSON(s))}return this}},go=class extends Wa{constructor(e){super(),this.type="Path",this.currentPoint=new we,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ho(this.currentPoint.clone(),new we(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new fo(this.currentPoint.clone(),new we(e,t),new we(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new uo(this.currentPoint.clone(),new we(e,t),new we(n,s),new we(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new mo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new cr(e,t,n,s,r,o,a,l);if(this.curves.length>0){let h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ci=class extends go{constructor(e){super(e),this.uuid=Qn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new go().fromJSON(s))}return this}};function Cm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=jd(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Um(i,e,r,t)),i.length>80*t){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=t;d<s;d+=t){let f=i[d],g=i[d+1];f<a&&(a=f),g<l&&(l=g),f>u&&(u=f),g>h&&(h=g)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return _o(r,o,t,a,l,c,0),o}function jd(i,e,t,n,s){let r;if(s===Xm(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Qh(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Qh(o/n|0,i[o],i[o+1],r);return r&&hr(r,r.next)&&(xo(r),r=r.next),r}function ms(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(hr(t,t.next)||Pt(t.prev,t,t.next)===0)){if(xo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function _o(i,e,t,n,s,r,o){if(!i)return;!o&&r&&km(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Pm(i,n,s,r):Im(i)){e.push(l.i,i.i,c.i),xo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Lm(ms(i),e),_o(i,e,t,n,s,r,2)):o===2&&Dm(i,e,t,n,s,r):_o(ms(i),e,t,n,s,r,1);break}}}function Im(i){let e=i.prev,t=i,n=i.next;if(Pt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,u=Math.min(s,r,o),h=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c),g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Vr(s,a,r,l,o,c,g.x,g.y)&&Pt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Pm(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Pt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,d=o.y,f=Math.min(a,l,c),g=Math.min(u,h,d),_=Math.max(a,l,c),m=Math.max(u,h,d),p=iu(f,g,e,t,n),y=iu(_,m,e,t,n),x=i.prevZ,v=i.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Vr(a,u,l,h,c,d,x.x,x.y)&&Pt(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Vr(a,u,l,h,c,d,v.x,v.y)&&Pt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Vr(a,u,l,h,c,d,x.x,x.y)&&Pt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Vr(a,u,l,h,c,d,v.x,v.y)&&Pt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Lm(i,e){let t=i;do{let n=t.prev,s=t.next.next;!hr(n,s)&&ef(n,t,t.next,s)&&yo(n,s)&&yo(s,n)&&(e.push(n.i,t.i,s.i),xo(t),xo(t.next),t=i=s),t=t.next}while(t!==i);return ms(t)}function Dm(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Vm(o,a)){let l=tf(o,a);o=ms(o,o.next),l=ms(l,l.next),_o(o,e,t,n,s,r,0),_o(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Um(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=jd(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(zm(c))}s.sort(Nm);for(let r=0;r<s.length;r++)t=Fm(s[r],t);return t}function Nm(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Fm(i,e){let t=Om(i,e);if(!t)return e;let n=tf(t,i);return ms(n,n.next),ms(t,t.next)}function Om(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(hr(i,t))return t;do{if(hr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let h=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=n&&h>r&&(r=h,o=t.x<t.next.x?t:t.next,h===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,u=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Qd(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let h=Math.abs(s-t.y)/(n-t.x);yo(t,i)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&Bm(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function Bm(i,e){return Pt(i.prev,i,e.prev)<0&&Pt(e.next,i,i.next)<0}function km(i,e,t,n){let s=i;do s.z===0&&(s.z=iu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Hm(s)}function Hm(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function iu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function zm(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Qd(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Vr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&Qd(i,e,t,n,s,r,o,a)}function Vm(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Gm(i,e)&&(yo(i,e)&&yo(e,i)&&Wm(i,e)&&(Pt(i.prev,i,e.prev)||Pt(i,e.prev,e))||hr(i,e)&&Pt(i.prev,i,i.next)>0&&Pt(e.prev,e,e.next)>0)}function Pt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function hr(i,e){return i.x===e.x&&i.y===e.y}function ef(i,e,t,n){let s=Sa(Pt(i,e,t)),r=Sa(Pt(i,e,n)),o=Sa(Pt(t,n,i)),a=Sa(Pt(t,n,e));return!!(s!==r&&o!==a||s===0&&Ea(i,t,e)||r===0&&Ea(i,n,e)||o===0&&Ea(t,i,n)||a===0&&Ea(t,e,n))}function Ea(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Sa(i){return i>0?1:i<0?-1:0}function Gm(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&ef(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function yo(i,e){return Pt(i.prev,i,i.next)<0?Pt(i,e,i.next)>=0&&Pt(i,i.prev,e)>=0:Pt(i,e,i.prev)<0||Pt(i,i.next,e)<0}function Wm(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function tf(i,e){let t=su(i.i,i.x,i.y),n=su(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Qh(i,e,t,n){let s=su(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function xo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function su(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Xm(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var ru=class{static triangulate(e,t,n=2){return Cm(e,t,n)}},ui=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];ed(e),td(n,e);let o=e.length;t.forEach(ed);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,td(n,t[l]);let a=ru.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function ed(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function td(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var vo=class i extends et{constructor(e=new Ci([new we(.5,.5),new we(-.5,.5),new we(-.5,-.5),new we(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Ke(s,3)),this.setAttribute("uv",new Ke(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:qm,x,v=!1,D,w,A,B;p&&(x=p.getSpacedPoints(u),v=!0,d=!1,D=p.computeFrenetFrames(u,!1),w=new k,A=new k,B=new k),d||(m=0,f=0,g=0,_=0);let M=a.extractPoints(c),E=M.shape,O=M.holes;if(!ui.isClockWise(E)){E=E.reverse();for(let ae=0,P=O.length;ae<P;ae++){let I=O[ae];ui.isClockWise(I)&&(O[ae]=I.reverse())}}function H(ae){let I=10000000000000001e-36,V=ae[0];for(let se=1;se<=ae.length;se++){let oe=se%ae.length,fe=ae[oe],Se=fe.x-V.x,De=fe.y-V.y,C=Se*Se+De*De,b=Math.max(Math.abs(fe.x),Math.abs(fe.y),Math.abs(V.x),Math.abs(V.y)),X=I*b*b;if(C<=X){ae.splice(oe,1),se--;continue}V=fe}}H(E),O.forEach(H);let J=O.length,Z=E;for(let ae=0;ae<J;ae++){let P=O[ae];E=E.concat(P)}function K(ae,P,I){return P||console.error("THREE.ExtrudeGeometry: vec does not exist"),ae.clone().addScaledVector(P,I)}let ge=E.length;function G(ae,P,I){let V,se,oe,fe=ae.x-P.x,Se=ae.y-P.y,De=I.x-ae.x,C=I.y-ae.y,b=fe*fe+Se*Se,X=fe*C-Se*De;if(Math.abs(X)>Number.EPSILON){let re=Math.sqrt(b),ve=Math.sqrt(De*De+C*C),he=P.x-Se/re,Y=P.y+fe/re,T=I.x-C/ve,q=I.y+De/ve,te=((T-he)*C-(q-Y)*De)/(fe*C-Se*De);V=he+fe*te-ae.x,se=Y+Se*te-ae.y;let $=V*V+se*se;if($<=2)return new we(V,se);oe=Math.sqrt($/2)}else{let re=!1;fe>Number.EPSILON?De>Number.EPSILON&&(re=!0):fe<-Number.EPSILON?De<-Number.EPSILON&&(re=!0):Math.sign(Se)===Math.sign(C)&&(re=!0),re?(V=-Se,se=fe,oe=Math.sqrt(b)):(V=fe,se=Se,oe=Math.sqrt(b/2))}return new we(V/oe,se/oe)}let _e=[];for(let ae=0,P=Z.length,I=P-1,V=ae+1;ae<P;ae++,I++,V++)I===P&&(I=0),V===P&&(V=0),_e[ae]=G(Z[ae],Z[I],Z[V]);let me=[],ye,Re=_e.concat();for(let ae=0,P=J;ae<P;ae++){let I=O[ae];ye=[];for(let V=0,se=I.length,oe=se-1,fe=V+1;V<se;V++,oe++,fe++)oe===se&&(oe=0),fe===se&&(fe=0),ye[V]=G(I[V],I[oe],I[fe]);me.push(ye),Re=Re.concat(ye)}let Ae;if(m===0)Ae=ui.triangulateShape(Z,O);else{let ae=[],P=[];for(let I=0;I<m;I++){let V=I/m,se=f*Math.cos(V*Math.PI/2),oe=g*Math.sin(V*Math.PI/2)+_;for(let fe=0,Se=Z.length;fe<Se;fe++){let De=K(Z[fe],_e[fe],oe);Le(De.x,De.y,-se),V===0&&ae.push(De)}for(let fe=0,Se=J;fe<Se;fe++){let De=O[fe];ye=me[fe];let C=[];for(let b=0,X=De.length;b<X;b++){let re=K(De[b],ye[b],oe);Le(re.x,re.y,-se),V===0&&C.push(re)}V===0&&P.push(C)}}Ae=ui.triangulateShape(ae,P)}let Ne=Ae.length,He=g+_;for(let ae=0;ae<ge;ae++){let P=d?K(E[ae],Re[ae],He):E[ae];v?(A.copy(D.normals[0]).multiplyScalar(P.x),w.copy(D.binormals[0]).multiplyScalar(P.y),B.copy(x[0]).add(A).add(w),Le(B.x,B.y,B.z)):Le(P.x,P.y,0)}for(let ae=1;ae<=u;ae++)for(let P=0;P<ge;P++){let I=d?K(E[P],Re[P],He):E[P];v?(A.copy(D.normals[ae]).multiplyScalar(I.x),w.copy(D.binormals[ae]).multiplyScalar(I.y),B.copy(x[ae]).add(A).add(w),Le(B.x,B.y,B.z)):Le(I.x,I.y,h/u*ae)}for(let ae=m-1;ae>=0;ae--){let P=ae/m,I=f*Math.cos(P*Math.PI/2),V=g*Math.sin(P*Math.PI/2)+_;for(let se=0,oe=Z.length;se<oe;se++){let fe=K(Z[se],_e[se],V);Le(fe.x,fe.y,h+I)}for(let se=0,oe=O.length;se<oe;se++){let fe=O[se];ye=me[se];for(let Se=0,De=fe.length;Se<De;Se++){let C=K(fe[Se],ye[Se],V);v?Le(C.x,C.y+x[u-1].y,x[u-1].x+I):Le(C.x,C.y,h+I)}}}ie(),de();function ie(){let ae=s.length/3;if(d){let P=0,I=ge*P;for(let V=0;V<Ne;V++){let se=Ae[V];Ce(se[2]+I,se[1]+I,se[0]+I)}P=u+m*2,I=ge*P;for(let V=0;V<Ne;V++){let se=Ae[V];Ce(se[0]+I,se[1]+I,se[2]+I)}}else{for(let P=0;P<Ne;P++){let I=Ae[P];Ce(I[2],I[1],I[0])}for(let P=0;P<Ne;P++){let I=Ae[P];Ce(I[0]+ge*u,I[1]+ge*u,I[2]+ge*u)}}n.addGroup(ae,s.length/3-ae,0)}function de(){let ae=s.length/3,P=0;Te(Z,P),P+=Z.length;for(let I=0,V=O.length;I<V;I++){let se=O[I];Te(se,P),P+=se.length}n.addGroup(ae,s.length/3-ae,1)}function Te(ae,P){let I=ae.length;for(;--I>=0;){let V=I,se=I-1;se<0&&(se=ae.length-1);for(let oe=0,fe=u+m*2;oe<fe;oe++){let Se=ge*oe,De=ge*(oe+1),C=P+V+Se,b=P+se+Se,X=P+se+De,re=P+V+De;Q(C,b,X,re)}}}function Le(ae,P,I){l.push(ae),l.push(P),l.push(I)}function Ce(ae,P,I){pe(ae),pe(P),pe(I);let V=s.length/3,se=y.generateTopUV(n,s,V-3,V-2,V-1);U(se[0]),U(se[1]),U(se[2])}function Q(ae,P,I,V){pe(ae),pe(P),pe(V),pe(P),pe(I),pe(V);let se=s.length/3,oe=y.generateSideWallUV(n,s,se-6,se-3,se-2,se-1);U(oe[0]),U(oe[1]),U(oe[3]),U(oe[1]),U(oe[2]),U(oe[3])}function pe(ae){s.push(l[ae*3+0]),s.push(l[ae*3+1]),s.push(l[ae*3+2])}function U(ae){r.push(ae.x),r.push(ae.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ym(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ga[s.type]().fromJSON(s)),new i(n,e.options)}},qm={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],u=e[s*3+1];return[new we(r,o),new we(a,l),new we(c,u)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],h=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],_=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new we(o,1-l),new we(c,1-h),new we(d,1-g),new we(_,1-p)]:[new we(a,1-l),new we(u,1-h),new we(f,1-g),new we(m,1-p)]}};function Ym(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var bo=class i extends et{constructor(e=[new we(0,-.5),new we(.5,0),new we(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=st(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],u=1/t,h=new k,d=new we,f=new k,g=new k,_=new k,m=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let y=0;y<=t;y++){let x=n+y*u*s,v=Math.sin(x),D=Math.cos(x);for(let w=0;w<=e.length-1;w++){h.x=e[w].x*v,h.y=e[w].y,h.z=e[w].x*D,o.push(h.x,h.y,h.z),d.x=y/t,d.y=w/(e.length-1),a.push(d.x,d.y);let A=l[3*w+0]*v,B=l[3*w+1],M=l[3*w+0]*D;c.push(A,B,M)}}for(let y=0;y<t;y++)for(let x=0;x<e.length-1;x++){let v=x+y*e.length,D=v,w=v+e.length,A=v+e.length+1,B=v+1;r.push(D,w,B),r.push(A,B,w)}this.setIndex(r),this.setAttribute("position",new Ke(o,3)),this.setAttribute("uv",new Ke(a,2)),this.setAttribute("normal",new Ke(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var sn=class i extends et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,d=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){let y=p*d-o;for(let x=0;x<c;x++){let v=x*h-r;g.push(v,-y,0),_.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<a;y++){let x=y+c*p,v=y+c*(p+1),D=y+1+c*(p+1),w=y+1+c*p;f.push(x,v,w),f.push(v,D,w)}this.setIndex(f),this.setAttribute("position",new Ke(g,3)),this.setAttribute("normal",new Ke(_,3)),this.setAttribute("uv",new Ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Mo=class i extends et{constructor(e=new Ci([new we(0,.5),new we(-.5,-.5),new we(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ke(s,3)),this.setAttribute("normal",new Ke(r,3)),this.setAttribute("uv",new Ke(o,2));function c(u){let h=s.length/3,d=u.extractPoints(t),f=d.shape,g=d.holes;ui.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let y=g[m];ui.isClockWise(y)===!0&&(g[m]=y.reverse())}let _=ui.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let y=g[m];f=f.concat(y)}for(let m=0,p=f.length;m<p;m++){let y=f[m];s.push(y.x,y.y,0),r.push(0,0,1),o.push(y.x,y.y)}for(let m=0,p=_.length;m<p;m++){let y=_[m],x=y[0]+h,v=y[1]+h,D=y[2]+h;n.push(x,v,D),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return $m(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function $m(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Cn=class i extends et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],h=new k,d=new k,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let y=[],x=p/n,v=0;p===0&&o===0?v=.5/t:p===n&&l===Math.PI&&(v=-.5/t);for(let D=0;D<=t;D++){let w=D/t;h.x=-e*Math.cos(s+w*r)*Math.sin(o+x*a),h.y=e*Math.cos(o+x*a),h.z=e*Math.sin(s+w*r)*Math.sin(o+x*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(w+v,1-x),y.push(c++)}u.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){let x=u[p][y+1],v=u[p][y],D=u[p+1][y],w=u[p+1][y+1];(p!==0||o>0)&&f.push(x,v,w),(p!==n-1||l<Math.PI)&&f.push(v,D,w)}this.setIndex(f),this.setAttribute("position",new Ke(g,3)),this.setAttribute("normal",new Ke(_,3)),this.setAttribute("uv",new Ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Lt=class i extends et{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],u=new k,h=new k,d=new k;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){let _=g/s*r,m=f/n*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(_),h.y=(e+t*Math.cos(m))*Math.sin(_),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){let _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,y=(s+1)*f+g;o.push(_,m,y),o.push(m,p,y)}this.setIndex(o),this.setAttribute("position",new Ke(a,3)),this.setAttribute("normal",new Ke(l,3)),this.setAttribute("uv",new Ke(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Eo=class i extends et{constructor(e=new po(new k(-1,-1,0),new k(-1,1,0),new k(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new k,l=new k,c=new we,u=new k,h=[],d=[],f=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new Ke(h,3)),this.setAttribute("normal",new Ke(d,3)),this.setAttribute("uv",new Ke(f,2));function _(){for(let x=0;x<t;x++)m(x);m(r===!1?t:0),y(),p()}function m(x){u=e.getPointAt(x/t,u);let v=o.normals[x],D=o.binormals[x];for(let w=0;w<=s;w++){let A=w/s*Math.PI*2,B=Math.sin(A),M=-Math.cos(A);l.x=M*v.x+B*D.x,l.y=M*v.y+B*D.y,l.z=M*v.z+B*D.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=t;x++)for(let v=1;v<=s;v++){let D=(s+1)*(x-1)+(v-1),w=(s+1)*x+(v-1),A=(s+1)*x+v,B=(s+1)*(x-1)+v;g.push(D,w,B),g.push(w,A,B)}}function y(){for(let x=0;x<=t;x++)for(let v=0;v<=s;v++)c.x=x/t,c.y=v/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Ga[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var ke=class extends ni{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=wu,this.normalScale=new we(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Xa=class extends ni{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Od,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},qa=class extends ni{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Zm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var gs=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ya=class extends gs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:jc,endingEnd:jc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Qc:r=e,a=2*t-n;break;case eu:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Qc:o=e,l=2*n-t;break;case eu:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,y=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-f)*m+(1.5+f)*_+.5*g,v=f*m-f*_;for(let D=0;D!==a;++D)r[D]=p*o[u+D]+y*o[c+D]+x*o[l+D]+v*o[h+D];return r}},$a=class extends gs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),h=1-u;for(let d=0;d!==a;++d)r[d]=o[c+d]*h+o[l+d]*u;return r}},Za=class extends gs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},In=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wa(t,this.TimeBufferType),this.values=wa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wa(e.times,Array),values:wa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Za(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ya(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Yr:t=this.InterpolantFactoryMethodDiscrete;break;case Ia:t=this.InterpolantFactoryMethodLinear;break;case Ta:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Yr;case this.InterpolantFactoryMethodLinear:return Ia;case this.InterpolantFactoryMethodSmooth:return Ta}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Zm(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ta,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let h=a*n,d=h-n,f=h+n;for(let g=0;g!==n;++g){let _=t[h+g];if(_!==t[d+g]||_!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};In.prototype.ValueTypeName="";In.prototype.TimeBufferType=Float32Array;In.prototype.ValueBufferType=Float32Array;In.prototype.DefaultInterpolation=Ia;var Ji=class extends In{constructor(e,t,n){super(e,t,n)}};Ji.prototype.ValueTypeName="bool";Ji.prototype.ValueBufferType=Array;Ji.prototype.DefaultInterpolation=Yr;Ji.prototype.InterpolantFactoryMethodLinear=void 0;Ji.prototype.InterpolantFactoryMethodSmooth=void 0;var Ja=class extends In{constructor(e,t,n,s){super(e,t,n,s)}};Ja.prototype.ValueTypeName="color";var Ka=class extends In{constructor(e,t,n,s){super(e,t,n,s)}};Ka.prototype.ValueTypeName="number";var ja=class extends gs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)ti.slerpFlat(r,0,o,c-a,o,c,l);return r}},So=class extends In{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new ja(this.times,this.values,this.getValueSize(),e)}};So.prototype.ValueTypeName="quaternion";So.prototype.InterpolantFactoryMethodSmooth=void 0;var Ki=class extends In{constructor(e,t,n){super(e,t,n)}};Ki.prototype.ValueTypeName="string";Ki.prototype.ValueBufferType=Array;Ki.prototype.DefaultInterpolation=Yr;Ki.prototype.InterpolantFactoryMethodLinear=void 0;Ki.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends In{constructor(e,t,n,s){super(e,t,n,s)}};Qa.prototype.ValueTypeName="vector";var el=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],g=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},nf=new el,tl=class{constructor(e){this.manager=e!==void 0?e:nf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};tl.DEFAULT_MATERIAL_NAME="__DEFAULT";var dr=class extends zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},wo=class extends dr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Zc=new rt,nd=new k,id=new k,nl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new we(512,512),this.mapType=si,this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ar,this._frameExtents=new we(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;nd.setFromMatrixPosition(e.matrixWorld),t.position.copy(nd),id.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(id),t.updateMatrixWorld(),Zc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Zc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var sd=new rt,zr=new k,Jc=new k,ou=class extends nl{constructor(){super(new Gt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new we(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new k(1,0,0),new k(-1,0,0),new k(0,0,1),new k(0,0,-1),new k(0,1,0),new k(0,-1,0)],this._cubeUps=[new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,0,1),new k(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),zr.setFromMatrixPosition(e.matrixWorld),n.position.copy(zr),Jc.copy(n.position),Jc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Jc),n.updateMatrixWorld(),s.makeTranslation(-zr.x,-zr.y,-zr.z),sd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sd,n.coordinateSystem,n.reversedDepth)}},To=class extends dr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ou}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Ao=class extends Qr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},au=class extends nl{constructor(){super(new Ao(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},fr=class extends dr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new au}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var il=class extends Gt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Lu="\\[\\]\\.:\\/",Jm=new RegExp("["+Lu+"]","g"),Du="[^"+Lu+"]",Km="[^"+Lu.replace("\\.","")+"]",jm=/((?:WC+[\/:])*)/.source.replace("WC",Du),Qm=/(WCOD+)?/.source.replace("WCOD",Km),eg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Du),tg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Du),ng=new RegExp("^"+jm+Qm+eg+tg+"$"),ig=["material","materials","bones","map"],lu=class{constructor(e,t,n){let s=n||At.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},At=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Jm,"")}static parseTrackName(e){let t=ng.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);ig.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};At.Composite=lu;At.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};At.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};At.prototype.GetterByBindingType=[At.prototype._getValue_direct,At.prototype._getValue_array,At.prototype._getValue_arrayElement,At.prototype._getValue_toArray];At.prototype.SetterByBindingTypeAndVersioning=[[At.prototype._setValue_direct,At.prototype._setValue_direct_setNeedsUpdate,At.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[At.prototype._setValue_array,At.prototype._setValue_array_setNeedsUpdate,At.prototype._setValue_array_setMatrixWorldNeedsUpdate],[At.prototype._setValue_arrayElement,At.prototype._setValue_arrayElement_setNeedsUpdate,At.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[At.prototype._setValue_fromArray,At.prototype._setValue_fromArray_setNeedsUpdate,At.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var dv=new Float32Array(1);var rd=new rt,Pn=class{constructor(e,t,n=0,s=1/0){this.ray=new Yi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new nr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rd),this}intersectObject(e,t=!0,n=[]){return cu(e,this,n,t),n.sort(od),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)cu(e[s],this,n,t);return n.sort(od),n}};function od(i,e){return i.distance-e.distance}function cu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)cu(r[o],e,t,!0)}}function Uu(i,e,t,n){let s=sg(n);switch(t){case bu:return i*e;case Eu:return i*e/s.components*s.byteLength;case xl:return i*e/s.components*s.byteLength;case Su:return i*e*2/s.components*s.byteLength;case vl:return i*e*2/s.components*s.byteLength;case Mu:return i*e*3/s.components*s.byteLength;case Ln:return i*e*4/s.components*s.byteLength;case bl:return i*e*4/s.components*s.byteLength;case Io:case Po:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Lo:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case El:case wl:return Math.max(i,16)*Math.max(e,8)/4;case Ml:case Sl:return Math.max(i,8)*Math.max(e,8)/2;case Tl:case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Il:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Hl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case zl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Gl:case Wl:case Xl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ql:case Yl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case $l:case Zl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function sg(i){switch(i){case si:case _u:return{byteLength:1,components:1};case pr:case yu:case mr:return{byteLength:2,components:1};case _l:case yl:return{byteLength:2,components:4};case Qi:case gl:case ri:return{byteLength:4,components:1};case xu:case vu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Af(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ug(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){let g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){let _=h[f];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var hg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dg=`#ifdef USE_ALPHAHASH
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
#endif`,fg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_g=`#ifdef USE_AOMAP
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
#endif`,yg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xg=`#ifdef USE_BATCHING
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
#endif`,vg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Eg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sg=`#ifdef USE_IRIDESCENCE
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
#endif`,wg=`#ifdef USE_BUMPMAP
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
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ig=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ug=`#define PI 3.141592653589793
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
} // validated`,Ng=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fg=`vec3 transformedNormal = objectNormal;
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
#endif`,Og=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gg=`#ifdef USE_ENVMAP
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
#endif`,Wg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xg=`#ifdef USE_ENVMAP
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
#endif`,qg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yg=`#ifdef USE_ENVMAP
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
#endif`,$g=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jg=`#ifdef USE_GRADIENTMAP
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
}`,Qg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,e0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,t0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,n0=`uniform bool receiveShadow;
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
#endif`,i0=`#ifdef USE_ENVMAP
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
#endif`,s0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,r0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,o0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,a0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,l0=`PhysicalMaterial material;
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
#endif`,c0=`struct PhysicalMaterial {
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
}`,u0=`
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
#endif`,h0=`#if defined( RE_IndirectDiffuse )
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
#endif`,d0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,f0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,p0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,m0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,g0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,y0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,x0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,v0=`#if defined( USE_POINTS_UV )
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
#endif`,b0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,M0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,E0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,S0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,w0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,T0=`#ifdef USE_MORPHTARGETS
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
#endif`,A0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,R0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,C0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,I0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,L0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,D0=`#ifdef USE_NORMALMAP
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
#endif`,U0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,N0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,F0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,O0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,B0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,k0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,H0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,z0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,V0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,G0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,W0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,X0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,q0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Y0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Z0=`float getShadowMask() {
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
}`,J0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,K0=`#ifdef USE_SKINNING
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
#endif`,j0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Q0=`#ifdef USE_SKINNING
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
#endif`,e_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,t_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,n_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,i_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,s_=`#ifdef USE_TRANSMISSION
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
#endif`,r_=`#ifdef USE_TRANSMISSION
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
#endif`,o_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,a_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,u_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,h_=`uniform sampler2D t2D;
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
}`,d_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,f_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,p_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g_=`#include <common>
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
}`,__=`#if DEPTH_PACKING == 3200
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
}`,y_=`#define DISTANCE
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
}`,x_=`#define DISTANCE
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
}`,v_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,b_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M_=`uniform float scale;
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
}`,E_=`uniform vec3 diffuse;
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
}`,S_=`#include <common>
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
}`,w_=`uniform vec3 diffuse;
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
}`,T_=`#define LAMBERT
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
}`,A_=`#define LAMBERT
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
}`,R_=`#define MATCAP
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
}`,C_=`#define MATCAP
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
}`,I_=`#define NORMAL
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
}`,P_=`#define NORMAL
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
}`,L_=`#define PHONG
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
}`,D_=`#define PHONG
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
}`,U_=`#define STANDARD
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
}`,N_=`#define STANDARD
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
}`,F_=`#define TOON
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
}`,O_=`#define TOON
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
}`,B_=`uniform float size;
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
}`,k_=`uniform vec3 diffuse;
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
}`,H_=`#include <common>
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
}`,z_=`uniform vec3 color;
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
}`,V_=`uniform float rotation;
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
}`,G_=`uniform vec3 diffuse;
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
}`,nt={alphahash_fragment:hg,alphahash_pars_fragment:dg,alphamap_fragment:fg,alphamap_pars_fragment:pg,alphatest_fragment:mg,alphatest_pars_fragment:gg,aomap_fragment:_g,aomap_pars_fragment:yg,batching_pars_vertex:xg,batching_vertex:vg,begin_vertex:bg,beginnormal_vertex:Mg,bsdfs:Eg,iridescence_fragment:Sg,bumpmap_pars_fragment:wg,clipping_planes_fragment:Tg,clipping_planes_pars_fragment:Ag,clipping_planes_pars_vertex:Rg,clipping_planes_vertex:Cg,color_fragment:Ig,color_pars_fragment:Pg,color_pars_vertex:Lg,color_vertex:Dg,common:Ug,cube_uv_reflection_fragment:Ng,defaultnormal_vertex:Fg,displacementmap_pars_vertex:Og,displacementmap_vertex:Bg,emissivemap_fragment:kg,emissivemap_pars_fragment:Hg,colorspace_fragment:zg,colorspace_pars_fragment:Vg,envmap_fragment:Gg,envmap_common_pars_fragment:Wg,envmap_pars_fragment:Xg,envmap_pars_vertex:qg,envmap_physical_pars_fragment:i0,envmap_vertex:Yg,fog_vertex:$g,fog_pars_vertex:Zg,fog_fragment:Jg,fog_pars_fragment:Kg,gradientmap_pars_fragment:jg,lightmap_pars_fragment:Qg,lights_lambert_fragment:e0,lights_lambert_pars_fragment:t0,lights_pars_begin:n0,lights_toon_fragment:s0,lights_toon_pars_fragment:r0,lights_phong_fragment:o0,lights_phong_pars_fragment:a0,lights_physical_fragment:l0,lights_physical_pars_fragment:c0,lights_fragment_begin:u0,lights_fragment_maps:h0,lights_fragment_end:d0,logdepthbuf_fragment:f0,logdepthbuf_pars_fragment:p0,logdepthbuf_pars_vertex:m0,logdepthbuf_vertex:g0,map_fragment:_0,map_pars_fragment:y0,map_particle_fragment:x0,map_particle_pars_fragment:v0,metalnessmap_fragment:b0,metalnessmap_pars_fragment:M0,morphinstance_vertex:E0,morphcolor_vertex:S0,morphnormal_vertex:w0,morphtarget_pars_vertex:T0,morphtarget_vertex:A0,normal_fragment_begin:R0,normal_fragment_maps:C0,normal_pars_fragment:I0,normal_pars_vertex:P0,normal_vertex:L0,normalmap_pars_fragment:D0,clearcoat_normal_fragment_begin:U0,clearcoat_normal_fragment_maps:N0,clearcoat_pars_fragment:F0,iridescence_pars_fragment:O0,opaque_fragment:B0,packing:k0,premultiplied_alpha_fragment:H0,project_vertex:z0,dithering_fragment:V0,dithering_pars_fragment:G0,roughnessmap_fragment:W0,roughnessmap_pars_fragment:X0,shadowmap_pars_fragment:q0,shadowmap_pars_vertex:Y0,shadowmap_vertex:$0,shadowmask_pars_fragment:Z0,skinbase_vertex:J0,skinning_pars_vertex:K0,skinning_vertex:j0,skinnormal_vertex:Q0,specularmap_fragment:e_,specularmap_pars_fragment:t_,tonemapping_fragment:n_,tonemapping_pars_fragment:i_,transmission_fragment:s_,transmission_pars_fragment:r_,uv_pars_fragment:o_,uv_pars_vertex:a_,uv_vertex:l_,worldpos_vertex:c_,background_vert:u_,background_frag:h_,backgroundCube_vert:d_,backgroundCube_frag:f_,cube_vert:p_,cube_frag:m_,depth_vert:g_,depth_frag:__,distanceRGBA_vert:y_,distanceRGBA_frag:x_,equirect_vert:v_,equirect_frag:b_,linedashed_vert:M_,linedashed_frag:E_,meshbasic_vert:S_,meshbasic_frag:w_,meshlambert_vert:T_,meshlambert_frag:A_,meshmatcap_vert:R_,meshmatcap_frag:C_,meshnormal_vert:I_,meshnormal_frag:P_,meshphong_vert:L_,meshphong_frag:D_,meshphysical_vert:U_,meshphysical_frag:N_,meshtoon_vert:F_,meshtoon_frag:O_,points_vert:B_,points_frag:k_,shadow_vert:H_,shadow_frag:z_,sprite_vert:V_,sprite_frag:G_},Oe={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new we(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new we(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},pi={basic:{uniforms:an([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:an([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,Oe.lights,{emissive:{value:new Ye(0)}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:an([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,Oe.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:an([Oe.common,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.roughnessmap,Oe.metalnessmap,Oe.fog,Oe.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:an([Oe.common,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.gradientmap,Oe.fog,Oe.lights,{emissive:{value:new Ye(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:an([Oe.common,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:an([Oe.points,Oe.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:an([Oe.common,Oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:an([Oe.common,Oe.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:an([Oe.common,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:an([Oe.sprite,Oe.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distanceRGBA:{uniforms:an([Oe.common,Oe.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distanceRGBA_vert,fragmentShader:nt.distanceRGBA_frag},shadow:{uniforms:an([Oe.lights,Oe.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};pi.physical={uniforms:an([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new we(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new we},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new we},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};var Jl={r:0,b:0,g:0},vs=new pn,W_=new rt;function X_(i,e,t,n,s,r,o){let a=new Ye(0),l=r===!0?0:1,c,u,h=null,d=0,f=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function _(x){let v=!1,D=g(x);D===null?p(a,l):D&&D.isColor&&(p(D,1),v=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,v){let D=g(v);D&&(D.isCubeTexture||D.mapping===Ro)?(u===void 0&&(u=new Ue(new Mt(1,1,1),new ii({name:"BackgroundCubeMaterial",uniforms:xs(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,A,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),vs.copy(v.backgroundRotation),vs.x*=-1,vs.y*=-1,vs.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(vs.y*=-1,vs.z*=-1),u.material.uniforms.envMap.value=D,u.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(W_.makeRotationFromEuler(vs)),u.material.toneMapped=ct.getTransfer(D.colorSpace)!==xt,(h!==D||d!==D.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=D,d=D.version,f=i.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):D&&D.isTexture&&(c===void 0&&(c=new Ue(new sn(2,2),new ii({name:"BackgroundMaterial",uniforms:xs(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:Ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=D,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=ct.getTransfer(D.colorSpace)!==xt,D.matrixAutoUpdate===!0&&D.updateMatrix(),c.material.uniforms.uvTransform.value.copy(D.matrix),(h!==D||d!==D.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=D,d=D.version,f=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,v){x.getRGB(Jl,Iu(i)),n.buffers.color.setClear(Jl.r,Jl.g,Jl.b,v,o)}function y(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(a,l)},render:_,addToRenderList:m,dispose:y}}function q_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(E,O,L,H,J){let Z=!1,K=h(H,L,O);r!==K&&(r=K,c(r.object)),Z=f(E,H,L,J),Z&&g(E,H,L,J),J!==null&&e.update(J,i.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,v(E,O,L,H),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function l(){return i.createVertexArray()}function c(E){return i.bindVertexArray(E)}function u(E){return i.deleteVertexArray(E)}function h(E,O,L){let H=L.wireframe===!0,J=n[E.id];J===void 0&&(J={},n[E.id]=J);let Z=J[O.id];Z===void 0&&(Z={},J[O.id]=Z);let K=Z[H];return K===void 0&&(K=d(l()),Z[H]=K),K}function d(E){let O=[],L=[],H=[];for(let J=0;J<t;J++)O[J]=0,L[J]=0,H[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:L,attributeDivisors:H,object:E,attributes:{},index:null}}function f(E,O,L,H){let J=r.attributes,Z=O.attributes,K=0,ge=L.getAttributes();for(let G in ge)if(ge[G].location>=0){let me=J[G],ye=Z[G];if(ye===void 0&&(G==="instanceMatrix"&&E.instanceMatrix&&(ye=E.instanceMatrix),G==="instanceColor"&&E.instanceColor&&(ye=E.instanceColor)),me===void 0||me.attribute!==ye||ye&&me.data!==ye.data)return!0;K++}return r.attributesNum!==K||r.index!==H}function g(E,O,L,H){let J={},Z=O.attributes,K=0,ge=L.getAttributes();for(let G in ge)if(ge[G].location>=0){let me=Z[G];me===void 0&&(G==="instanceMatrix"&&E.instanceMatrix&&(me=E.instanceMatrix),G==="instanceColor"&&E.instanceColor&&(me=E.instanceColor));let ye={};ye.attribute=me,me&&me.data&&(ye.data=me.data),J[G]=ye,K++}r.attributes=J,r.attributesNum=K,r.index=H}function _(){let E=r.newAttributes;for(let O=0,L=E.length;O<L;O++)E[O]=0}function m(E){p(E,0)}function p(E,O){let L=r.newAttributes,H=r.enabledAttributes,J=r.attributeDivisors;L[E]=1,H[E]===0&&(i.enableVertexAttribArray(E),H[E]=1),J[E]!==O&&(i.vertexAttribDivisor(E,O),J[E]=O)}function y(){let E=r.newAttributes,O=r.enabledAttributes;for(let L=0,H=O.length;L<H;L++)O[L]!==E[L]&&(i.disableVertexAttribArray(L),O[L]=0)}function x(E,O,L,H,J,Z,K){K===!0?i.vertexAttribIPointer(E,O,L,J,Z):i.vertexAttribPointer(E,O,L,H,J,Z)}function v(E,O,L,H){_();let J=H.attributes,Z=L.getAttributes(),K=O.defaultAttributeValues;for(let ge in Z){let G=Z[ge];if(G.location>=0){let _e=J[ge];if(_e===void 0&&(ge==="instanceMatrix"&&E.instanceMatrix&&(_e=E.instanceMatrix),ge==="instanceColor"&&E.instanceColor&&(_e=E.instanceColor)),_e!==void 0){let me=_e.normalized,ye=_e.itemSize,Re=e.get(_e);if(Re===void 0)continue;let Ae=Re.buffer,Ne=Re.type,He=Re.bytesPerElement,ie=Ne===i.INT||Ne===i.UNSIGNED_INT||_e.gpuType===gl;if(_e.isInterleavedBufferAttribute){let de=_e.data,Te=de.stride,Le=_e.offset;if(de.isInstancedInterleavedBuffer){for(let Ce=0;Ce<G.locationSize;Ce++)p(G.location+Ce,de.meshPerAttribute);E.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Ce=0;Ce<G.locationSize;Ce++)m(G.location+Ce);i.bindBuffer(i.ARRAY_BUFFER,Ae);for(let Ce=0;Ce<G.locationSize;Ce++)x(G.location+Ce,ye/G.locationSize,Ne,me,Te*He,(Le+ye/G.locationSize*Ce)*He,ie)}else{if(_e.isInstancedBufferAttribute){for(let de=0;de<G.locationSize;de++)p(G.location+de,_e.meshPerAttribute);E.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let de=0;de<G.locationSize;de++)m(G.location+de);i.bindBuffer(i.ARRAY_BUFFER,Ae);for(let de=0;de<G.locationSize;de++)x(G.location+de,ye/G.locationSize,Ne,me,ye*He,ye/G.locationSize*de*He,ie)}}else if(K!==void 0){let me=K[ge];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(G.location,me);break;case 3:i.vertexAttrib3fv(G.location,me);break;case 4:i.vertexAttrib4fv(G.location,me);break;default:i.vertexAttrib1fv(G.location,me)}}}}y()}function D(){B();for(let E in n){let O=n[E];for(let L in O){let H=O[L];for(let J in H)u(H[J].object),delete H[J];delete O[L]}delete n[E]}}function w(E){if(n[E.id]===void 0)return;let O=n[E.id];for(let L in O){let H=O[L];for(let J in H)u(H[J].object),delete H[J];delete O[L]}delete n[E.id]}function A(E){for(let O in n){let L=n[O];if(L[E.id]===void 0)continue;let H=L[E.id];for(let J in H)u(H[J].object),delete H[J];delete L[E.id]}}function B(){M(),o=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:B,resetDefaultState:M,dispose:D,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function Y_(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,n,1)}function l(c,u,h,d){if(h===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function $_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Ln&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let B=A===mr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==si&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ri&&!B)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:D,maxSamples:w}}function Z_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Ht,a=new Qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){let g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{let y=r?0:n,x=y*4,v=p.clippingState||null;l.value=v,v=u(g,d,x,f);for(let D=0;D!==x;++D)v[D]=t[D];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,g){let _=h!==null?h.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(h[x]).applyMatrix4(y,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function J_(i){let e=new WeakMap;function t(o,a){return a===fl?o.mapping=_s:a===pl&&(o.mapping=ys),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===fl||a===pl)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Fa(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var xr=4,sf=[.125,.215,.35,.446,.526,.582],Es=20,Nu=new Ao,rf=new Ye,Fu=null,Ou=0,Bu=0,ku=!1,Ms=(1+Math.sqrt(5))/2,yr=1/Ms,of=[new k(-Ms,yr,0),new k(Ms,yr,0),new k(-yr,0,Ms),new k(yr,0,Ms),new k(0,Ms,-yr),new k(0,Ms,yr),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)],K_=new k,Ql=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=K_}=r;Fu=this._renderer.getRenderTarget(),Ou=this._renderer.getActiveCubeFace(),Bu=this._renderer.getActiveMipmapLevel(),ku=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Fu,Ou,Bu),this._renderer.xr.enabled=ku,e.scissorTest=!1,Kl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===_s||e.mapping===ys?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fu=this._renderer.getRenderTarget(),Ou=this._renderer.getActiveCubeFace(),Bu=this._renderer.getActiveMipmapLevel(),ku=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:mr,format:Ln,colorSpace:ps,depthBuffer:!1},s=af(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=af(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=j_(r)),this._blurMaterial=Q_(r,e,t)}return s}_compileMaterial(e){let t=new Ue(this._lodPlanes[0],e);this._renderer.compile(t,Nu)}_sceneToCubeUV(e,t,n,s,r){let l=new Gt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(rf),h.toneMapping=Pi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let _=new Ft({name:"PMREM.Background",side:mn,depthWrite:!1,depthTest:!1}),m=new Ue(new Mt,_),p=!1,y=e.background;y?y.isColor&&(_.color.copy(y),e.background=null,p=!0):(_.color.copy(rf),p=!0);for(let x=0;x<6;x++){let v=x%3;v===0?(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[x],r.y,r.z)):v===1?(l.up.set(0,0,c[x]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[x],r.z)):(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[x]));let D=this._cubeSize;Kl(s,v*D,x>2?D:0,D,D),h.setRenderTarget(s),p&&h.render(m,l),h.render(e,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===_s||e.mapping===ys;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ue(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Kl(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Nu)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=of[(s-r-1)%of.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new Ue(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Es-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):Es;m>Es&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Es}`);let p=[],y=0;for(let A=0;A<Es;++A){let B=A/_,M=Math.exp(-B*B/2);p.push(M),A===0?y+=M:A<m&&(y+=2*M)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let v=this._sizeLods[s],D=3*v*(s>x-xr?s-x+xr:0),w=4*(this._cubeSize-v);Kl(t,D,w,3*v,2*v),l.setRenderTarget(t),l.render(h,Nu)}};function j_(i){let e=[],t=[],n=[],s=i,r=i-xr+1+sf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-xr?l=sf[o-i+xr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),x=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let w=0;w<f;w++){let A=w%3*2/3-1,B=w>2?0:-1,M=[A,B,0,A+2/3,B,0,A+2/3,B+1,0,A,B,0,A+2/3,B+1,0,A,B+1,0];y.set(M,_*g*w),x.set(d,m*g*w);let E=[w,w,w,w,w,w];v.set(E,p*g*w)}let D=new et;D.setAttribute("position",new Nt(y,_)),D.setAttribute("uv",new Nt(x,m)),D.setAttribute("faceIndex",new Nt(v,p)),e.push(D),s>xr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function af(i,e,t){let n=new hi(i,e,t);return n.texture.mapping=Ro,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Kl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Q_(i,e,t){let n=new Float32Array(Es),s=new k(0,1,0);return new ii({name:"SphericalGaussianBlur",defines:{n:Es,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Zu(),fragmentShader:`

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
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function lf(){return new ii({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zu(),fragmentShader:`

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
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function cf(){return new ii({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Zu(){return`

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
	`}function ey(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===fl||l===pl,u=l===_s||l===ys;if(c||u){let h=e.get(a),d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ql(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{let f=a.image;return c&&f&&f.height>0||u&&f&&s(f)?(t===null&&(t=new Ql(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function ty(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&er("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ny(i,e,t,n){let s={},r=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,g=h.attributes.position,_=0;if(f!==null){let y=f.array;_=f.version;for(let x=0,v=y.length;x<v;x+=3){let D=y[x+0],w=y[x+1],A=y[x+2];d.push(D,w,w,A,A,D)}}else if(g!==void 0){let y=g.array;_=g.version;for(let x=0,v=y.length/3-1;x<v;x+=3){let D=x+0,w=x+1,A=x+2;d.push(D,w,w,A,A,D)}}else return;let m=new(Cu(d)?jr:$i)(d,1);m.version=_;let p=r.get(h);p&&e.remove(p),r.set(h,m)}function u(h){let d=r.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function iy(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),t.update(f,n,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function h(d,f,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let y=0;y<g;y++)p+=f[y]*_[y];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function sy(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ry(i,e,t){let n=new WeakMap,s=new ft;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(a);if(d===void 0||d.count!==h){let M=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],x=0;f===!0&&(x=1),g===!0&&(x=2),_===!0&&(x=3);let v=a.attributes.position.count*x,D=1;v>e.maxTextureSize&&(D=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let w=new Float32Array(v*D*4*h),A=new Kr(w,v,D,h);A.type=ri,A.needsUpdate=!0;let B=x*4;for(let E=0;E<h;E++){let O=m[E],L=p[E],H=y[E],J=v*D*4*E;for(let Z=0;Z<O.count;Z++){let K=Z*B;f===!0&&(s.fromBufferAttribute(O,Z),w[J+K+0]=s.x,w[J+K+1]=s.y,w[J+K+2]=s.z,w[J+K+3]=0),g===!0&&(s.fromBufferAttribute(L,Z),w[J+K+4]=s.x,w[J+K+5]=s.y,w[J+K+6]=s.z,w[J+K+7]=0),_===!0&&(s.fromBufferAttribute(H,Z),w[J+K+8]=s.x,w[J+K+9]=s.y,w[J+K+10]=s.z,w[J+K+11]=H.itemSize===4?s.w:1)}}d={count:h,texture:A,size:new we(v,D)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function oy(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Rf=new fn,uf=new lo(1,1),Cf=new Kr,If=new Ua,Pf=new eo,hf=[],df=[],ff=new Float32Array(16),pf=new Float32Array(9),mf=new Float32Array(4);function br(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=hf[s];if(r===void 0&&(r=new Float32Array(s),hf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function tc(i,e){let t=df[e];t===void 0&&(t=new Int32Array(e),df[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ay(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ly(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),Yt(t,e)}}function cy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),Yt(t,e)}}function uy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),Yt(t,e)}}function hy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;mf.set(n),i.uniformMatrix2fv(this.addr,!1,mf),Yt(t,n)}}function dy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;pf.set(n),i.uniformMatrix3fv(this.addr,!1,pf),Yt(t,n)}}function fy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;ff.set(n),i.uniformMatrix4fv(this.addr,!1,ff),Yt(t,n)}}function py(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function my(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),Yt(t,e)}}function gy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),Yt(t,e)}}function _y(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),Yt(t,e)}}function yy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function xy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),Yt(t,e)}}function vy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),Yt(t,e)}}function by(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),Yt(t,e)}}function My(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(uf.compareFunction=Tu,r=uf):r=Rf,t.setTexture2D(e||r,s)}function Ey(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||If,s)}function Sy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Pf,s)}function wy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Cf,s)}function Ty(i){switch(i){case 5126:return ay;case 35664:return ly;case 35665:return cy;case 35666:return uy;case 35674:return hy;case 35675:return dy;case 35676:return fy;case 5124:case 35670:return py;case 35667:case 35671:return my;case 35668:case 35672:return gy;case 35669:case 35673:return _y;case 5125:return yy;case 36294:return xy;case 36295:return vy;case 36296:return by;case 35678:case 36198:case 36298:case 36306:case 35682:return My;case 35679:case 36299:case 36307:return Ey;case 35680:case 36300:case 36308:case 36293:return Sy;case 36289:case 36303:case 36311:case 36292:return wy}}function Ay(i,e){i.uniform1fv(this.addr,e)}function Ry(i,e){let t=br(e,this.size,2);i.uniform2fv(this.addr,t)}function Cy(i,e){let t=br(e,this.size,3);i.uniform3fv(this.addr,t)}function Iy(i,e){let t=br(e,this.size,4);i.uniform4fv(this.addr,t)}function Py(i,e){let t=br(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ly(i,e){let t=br(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Dy(i,e){let t=br(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Uy(i,e){i.uniform1iv(this.addr,e)}function Ny(i,e){i.uniform2iv(this.addr,e)}function Fy(i,e){i.uniform3iv(this.addr,e)}function Oy(i,e){i.uniform4iv(this.addr,e)}function By(i,e){i.uniform1uiv(this.addr,e)}function ky(i,e){i.uniform2uiv(this.addr,e)}function Hy(i,e){i.uniform3uiv(this.addr,e)}function zy(i,e){i.uniform4uiv(this.addr,e)}function Vy(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Rf,r[o])}function Gy(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||If,r[o])}function Wy(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Pf,r[o])}function Xy(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Cf,r[o])}function qy(i){switch(i){case 5126:return Ay;case 35664:return Ry;case 35665:return Cy;case 35666:return Iy;case 35674:return Py;case 35675:return Ly;case 35676:return Dy;case 5124:case 35670:return Uy;case 35667:case 35671:return Ny;case 35668:case 35672:return Fy;case 35669:case 35673:return Oy;case 5125:return By;case 36294:return ky;case 36295:return Hy;case 36296:return zy;case 35678:case 36198:case 36298:case 36306:case 35682:return Vy;case 35679:case 36299:case 36307:return Gy;case 35680:case 36300:case 36308:case 36293:return Wy;case 36289:case 36303:case 36311:case 36292:return Xy}}var zu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ty(t.type)}},Vu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=qy(t.type)}},Gu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Hu=/(\w+)(\])?(\[|\.)?/g;function gf(i,e){i.seq.push(e),i.map[e.id]=e}function Yy(i,e,t){let n=i.name,s=n.length;for(Hu.lastIndex=0;;){let r=Hu.exec(n),o=Hu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){gf(t,c===void 0?new zu(a,i,e):new Vu(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new Gu(a),gf(t,h)),t=h}}}var vr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Yy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function _f(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var $y=37297,Zy=0;function Jy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var yf=new Qe;function Ky(i){ct._getMatrix(yf,ct.workingColorSpace,i);let e=`mat3( ${yf.elements.map(t=>t.toFixed(4))} )`;switch(ct.getTransfer(i)){case $r:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function xf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Jy(i.getShaderSource(e),a)}else return r}function jy(i,e){let t=Ky(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Qy(i,e){let t;switch(e){case Cd:t="Linear";break;case Id:t="Reinhard";break;case Pd:t="Cineon";break;case dl:t="ACESFilmic";break;case Dd:t="AgX";break;case Ud:t="Neutral";break;case Ld:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jl=new k;function ex(){ct.getLuminanceCoefficients(jl);let i=jl.x.toFixed(4),e=jl.y.toFixed(4),t=jl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function tx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Uo).join(`
`)}function nx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ix(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Uo(i){return i!==""}function vf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var sx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wu(i){return i.replace(sx,ox)}var rx=new Map;function ox(i,e){let t=nt[e];if(t===void 0){let n=rx.get(e);if(n!==void 0)t=nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Wu(t)}var ax=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mf(i){return i.replace(ax,lx)}function lx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ef(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function cx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===hu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===sl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function ux(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case _s:case ys:e="ENVMAP_TYPE_CUBE";break;case Ro:e="ENVMAP_TYPE_CUBE_UV";break}return e}function hx(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ys:e="ENVMAP_MODE_REFRACTION";break}return e}function dx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case mu:e="ENVMAP_BLENDING_MULTIPLY";break;case Ad:e="ENVMAP_BLENDING_MIX";break;case Rd:e="ENVMAP_BLENDING_ADD";break}return e}function fx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function px(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=cx(t),c=ux(t),u=hx(t),h=dx(t),d=fx(t),f=tx(t),g=nx(r),_=s.createProgram(),m,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Uo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Uo).join(`
`),p.length>0&&(p+=`
`)):(m=[Ef(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Uo).join(`
`),p=[Ef(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pi?"#define TONE_MAPPING":"",t.toneMapping!==Pi?nt.tonemapping_pars_fragment:"",t.toneMapping!==Pi?Qy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,jy("linearToOutputTexel",t.outputColorSpace),ex(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Uo).join(`
`)),o=Wu(o),o=vf(o,t),o=bf(o,t),a=Wu(a),a=vf(a,t),a=bf(a,t),o=Mf(o),a=Mf(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Au?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Au?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=y+m+o,v=y+p+a,D=_f(s,s.VERTEX_SHADER,x),w=_f(s,s.FRAGMENT_SHADER,v);s.attachShader(_,D),s.attachShader(_,w),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(O){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(_)||"",H=s.getShaderInfoLog(D)||"",J=s.getShaderInfoLog(w)||"",Z=L.trim(),K=H.trim(),ge=J.trim(),G=!0,_e=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,D,w);else{let me=xf(s,D,"vertex"),ye=xf(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+Z+`
`+me+`
`+ye)}else Z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Z):(K===""||ge==="")&&(_e=!1);_e&&(O.diagnostics={runnable:G,programLog:Z,vertexShader:{log:K,prefix:m},fragmentShader:{log:ge,prefix:p}})}s.deleteShader(D),s.deleteShader(w),B=new vr(s,_),M=ix(s,_)}let B;this.getUniforms=function(){return B===void 0&&A(this),B};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=s.getProgramParameter(_,$y)),E},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Zy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=w,this}var mx=0,Xu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new qu(e),t.set(e,n)),n}},qu=class{constructor(e){this.id=mx++,this.code=e,this.usedTimes=0}};function gx(i,e,t,n,s,r,o){let a=new nr,l=new Xu,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,E,O,L,H){let J=L.fog,Z=H.geometry,K=M.isMeshStandardMaterial?L.environment:null,ge=(M.isMeshStandardMaterial?t:e).get(M.envMap||K),G=ge&&ge.mapping===Ro?ge.image.height:null,_e=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));let me=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,ye=me!==void 0?me.length:0,Re=0;Z.morphAttributes.position!==void 0&&(Re=1),Z.morphAttributes.normal!==void 0&&(Re=2),Z.morphAttributes.color!==void 0&&(Re=3);let Ae,Ne,He,ie;if(_e){let ht=pi[_e];Ae=ht.vertexShader,Ne=ht.fragmentShader}else Ae=M.vertexShader,Ne=M.fragmentShader,l.update(M),He=l.getVertexShaderID(M),ie=l.getFragmentShaderID(M);let de=i.getRenderTarget(),Te=i.state.buffers.depth.getReversed(),Le=H.isInstancedMesh===!0,Ce=H.isBatchedMesh===!0,Q=!!M.map,pe=!!M.matcap,U=!!ge,ae=!!M.aoMap,P=!!M.lightMap,I=!!M.bumpMap,V=!!M.normalMap,se=!!M.displacementMap,oe=!!M.emissiveMap,fe=!!M.metalnessMap,Se=!!M.roughnessMap,De=M.anisotropy>0,C=M.clearcoat>0,b=M.dispersion>0,X=M.iridescence>0,re=M.sheen>0,ve=M.transmission>0,he=De&&!!M.anisotropyMap,Y=C&&!!M.clearcoatMap,T=C&&!!M.clearcoatNormalMap,q=C&&!!M.clearcoatRoughnessMap,te=X&&!!M.iridescenceMap,$=X&&!!M.iridescenceThicknessMap,xe=re&&!!M.sheenColorMap,Ie=re&&!!M.sheenRoughnessMap,F=!!M.specularMap,W=!!M.specularColorMap,N=!!M.specularIntensityMap,S=ve&&!!M.transmissionMap,z=ve&&!!M.thicknessMap,ne=!!M.gradientMap,be=!!M.alphaMap,Me=M.alphaTest>0,ce=!!M.alphaHash,Fe=!!M.extensions,Ze=Pi;M.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Ze=i.toneMapping);let _t={shaderID:_e,shaderType:M.type,shaderName:M.name,vertexShader:Ae,fragmentShader:Ne,defines:M.defines,customVertexShaderID:He,customFragmentShaderID:ie,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Ce,batchingColor:Ce&&H._colorsTexture!==null,instancing:Le,instancingColor:Le&&H.instanceColor!==null,instancingMorph:Le&&H.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:de===null?i.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:ps,alphaToCoverage:!!M.alphaToCoverage,map:Q,matcap:pe,envMap:U,envMapMode:U&&ge.mapping,envMapCubeUVHeight:G,aoMap:ae,lightMap:P,bumpMap:I,normalMap:V,displacementMap:d&&se,emissiveMap:oe,normalMapObjectSpace:V&&M.normalMapType===kd,normalMapTangentSpace:V&&M.normalMapType===wu,metalnessMap:fe,roughnessMap:Se,anisotropy:De,anisotropyMap:he,clearcoat:C,clearcoatMap:Y,clearcoatNormalMap:T,clearcoatRoughnessMap:q,dispersion:b,iridescence:X,iridescenceMap:te,iridescenceThicknessMap:$,sheen:re,sheenColorMap:xe,sheenRoughnessMap:Ie,specularMap:F,specularColorMap:W,specularIntensityMap:N,transmission:ve,transmissionMap:S,thicknessMap:z,gradientMap:ne,opaque:M.transparent===!1&&M.blending===ds&&M.alphaToCoverage===!1,alphaMap:be,alphaTest:Me,alphaHash:ce,combine:M.combine,mapUv:Q&&_(M.map.channel),aoMapUv:ae&&_(M.aoMap.channel),lightMapUv:P&&_(M.lightMap.channel),bumpMapUv:I&&_(M.bumpMap.channel),normalMapUv:V&&_(M.normalMap.channel),displacementMapUv:se&&_(M.displacementMap.channel),emissiveMapUv:oe&&_(M.emissiveMap.channel),metalnessMapUv:fe&&_(M.metalnessMap.channel),roughnessMapUv:Se&&_(M.roughnessMap.channel),anisotropyMapUv:he&&_(M.anisotropyMap.channel),clearcoatMapUv:Y&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:T&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:$&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&_(M.sheenRoughnessMap.channel),specularMapUv:F&&_(M.specularMap.channel),specularColorMapUv:W&&_(M.specularColorMap.channel),specularIntensityMapUv:N&&_(M.specularIntensityMap.channel),transmissionMapUv:S&&_(M.transmissionMap.channel),thicknessMapUv:z&&_(M.thicknessMap.channel),alphaMapUv:be&&_(M.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(V||De),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!Z.attributes.uv&&(Q||be),fog:!!J,useFog:M.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Te,skinning:H.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Re,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ze,decodeVideoTexture:Q&&M.map.isVideoTexture===!0&&ct.getTransfer(M.map.colorSpace)===xt,decodeVideoTextureEmissive:oe&&M.emissiveMap.isVideoTexture===!0&&ct.getTransfer(M.emissiveMap.colorSpace)===xt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===ut,flipSided:M.side===mn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Fe&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Fe&&M.extensions.multiDraw===!0||Ce)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return _t.vertexUv1s=c.has(1),_t.vertexUv2s=c.has(2),_t.vertexUv3s=c.has(3),c.clear(),_t}function p(M){let E=[];if(M.shaderID?E.push(M.shaderID):(E.push(M.customVertexShaderID),E.push(M.customFragmentShaderID)),M.defines!==void 0)for(let O in M.defines)E.push(O),E.push(M.defines[O]);return M.isRawShaderMaterial===!1&&(y(E,M),x(E,M),E.push(i.outputColorSpace)),E.push(M.customProgramCacheKey),E.join()}function y(M,E){M.push(E.precision),M.push(E.outputColorSpace),M.push(E.envMapMode),M.push(E.envMapCubeUVHeight),M.push(E.mapUv),M.push(E.alphaMapUv),M.push(E.lightMapUv),M.push(E.aoMapUv),M.push(E.bumpMapUv),M.push(E.normalMapUv),M.push(E.displacementMapUv),M.push(E.emissiveMapUv),M.push(E.metalnessMapUv),M.push(E.roughnessMapUv),M.push(E.anisotropyMapUv),M.push(E.clearcoatMapUv),M.push(E.clearcoatNormalMapUv),M.push(E.clearcoatRoughnessMapUv),M.push(E.iridescenceMapUv),M.push(E.iridescenceThicknessMapUv),M.push(E.sheenColorMapUv),M.push(E.sheenRoughnessMapUv),M.push(E.specularMapUv),M.push(E.specularColorMapUv),M.push(E.specularIntensityMapUv),M.push(E.transmissionMapUv),M.push(E.thicknessMapUv),M.push(E.combine),M.push(E.fogExp2),M.push(E.sizeAttenuation),M.push(E.morphTargetsCount),M.push(E.morphAttributeCount),M.push(E.numDirLights),M.push(E.numPointLights),M.push(E.numSpotLights),M.push(E.numSpotLightMaps),M.push(E.numHemiLights),M.push(E.numRectAreaLights),M.push(E.numDirLightShadows),M.push(E.numPointLightShadows),M.push(E.numSpotLightShadows),M.push(E.numSpotLightShadowsWithMaps),M.push(E.numLightProbes),M.push(E.shadowMapType),M.push(E.toneMapping),M.push(E.numClippingPlanes),M.push(E.numClipIntersection),M.push(E.depthPacking)}function x(M,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),E.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),M.push(a.mask)}function v(M){let E=g[M.type],O;if(E){let L=pi[E];O=Jd.clone(L.uniforms)}else O=M.uniforms;return O}function D(M,E){let O;for(let L=0,H=u.length;L<H;L++){let J=u[L];if(J.cacheKey===E){O=J,++O.usedTimes;break}}return O===void 0&&(O=new px(i,E,M,r),u.push(O)),O}function w(M){if(--M.usedTimes===0){let E=u.indexOf(M);u[E]=u[u.length-1],u.pop(),M.destroy()}}function A(M){l.remove(M)}function B(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:D,releaseProgram:w,releaseShaderCache:A,programs:u,dispose:B}}function _x(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function yx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Sf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function wf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,d,f,g,_,m){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,d,f,g,_,m){let p=o(h,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(h,d,f,g,_,m){let p=o(h,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||yx),n.length>1&&n.sort(d||Sf),s.length>1&&s.sort(d||Sf)}function u(){for(let h=e,d=i.length;h<d;h++){let f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function xx(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new wf,i.set(n,[o])):s>=r.length?(o=new wf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function vx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Ye};break;case"SpotLight":t={position:new k,direction:new k,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function bx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Mx=0;function Ex(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Sx(i){let e=new vx,t=bx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new k);let s=new k,r=new rt,o=new rt;function a(c){let u=0,h=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,y=0,x=0,v=0,D=0,w=0,A=0;c.sort(Ex);for(let M=0,E=c.length;M<E;M++){let O=c[M],L=O.color,H=O.intensity,J=O.distance,Z=O.shadow&&O.shadow.map?O.shadow.map.texture:null;if(O.isAmbientLight)u+=L.r*H,h+=L.g*H,d+=L.b*H;else if(O.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(O.sh.coefficients[K],H);A++}else if(O.isDirectionalLight){let K=e.get(O);if(K.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){let ge=O.shadow,G=t.get(O);G.shadowIntensity=ge.intensity,G.shadowBias=ge.bias,G.shadowNormalBias=ge.normalBias,G.shadowRadius=ge.radius,G.shadowMapSize=ge.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=Z,n.directionalShadowMatrix[f]=O.shadow.matrix,y++}n.directional[f]=K,f++}else if(O.isSpotLight){let K=e.get(O);K.position.setFromMatrixPosition(O.matrixWorld),K.color.copy(L).multiplyScalar(H),K.distance=J,K.coneCos=Math.cos(O.angle),K.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),K.decay=O.decay,n.spot[_]=K;let ge=O.shadow;if(O.map&&(n.spotLightMap[D]=O.map,D++,ge.updateMatrices(O),O.castShadow&&w++),n.spotLightMatrix[_]=ge.matrix,O.castShadow){let G=t.get(O);G.shadowIntensity=ge.intensity,G.shadowBias=ge.bias,G.shadowNormalBias=ge.normalBias,G.shadowRadius=ge.radius,G.shadowMapSize=ge.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=Z,v++}_++}else if(O.isRectAreaLight){let K=e.get(O);K.color.copy(L).multiplyScalar(H),K.halfWidth.set(O.width*.5,0,0),K.halfHeight.set(0,O.height*.5,0),n.rectArea[m]=K,m++}else if(O.isPointLight){let K=e.get(O);if(K.color.copy(O.color).multiplyScalar(O.intensity),K.distance=O.distance,K.decay=O.decay,O.castShadow){let ge=O.shadow,G=t.get(O);G.shadowIntensity=ge.intensity,G.shadowBias=ge.bias,G.shadowNormalBias=ge.normalBias,G.shadowRadius=ge.radius,G.shadowMapSize=ge.mapSize,G.shadowCameraNear=ge.camera.near,G.shadowCameraFar=ge.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=Z,n.pointShadowMatrix[g]=O.shadow.matrix,x++}n.point[g]=K,g++}else if(O.isHemisphereLight){let K=e.get(O);K.skyColor.copy(O.color).multiplyScalar(H),K.groundColor.copy(O.groundColor).multiplyScalar(H),n.hemi[p]=K,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Oe.LTC_FLOAT_1,n.rectAreaLTC2=Oe.LTC_FLOAT_2):(n.rectAreaLTC1=Oe.LTC_HALF_1,n.rectAreaLTC2=Oe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let B=n.hash;(B.directionalLength!==f||B.pointLength!==g||B.spotLength!==_||B.rectAreaLength!==m||B.hemiLength!==p||B.numDirectionalShadows!==y||B.numPointShadows!==x||B.numSpotShadows!==v||B.numSpotMaps!==D||B.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+D-w,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,B.directionalLength=f,B.pointLength=g,B.spotLength=_,B.rectAreaLength=m,B.hemiLength=p,B.numDirectionalShadows=y,B.numPointShadows=x,B.numSpotShadows=v,B.numSpotMaps=D,B.numLightProbes=A,n.version=Mx++)}function l(c,u){let h=0,d=0,f=0,g=0,_=0,m=u.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){let x=c[p];if(x.isDirectionalLight){let v=n.directional[h];v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),h++}else if(x.isSpotLight){let v=n.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(x.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let v=n.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Tf(i){let e=new Sx(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function wx(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Tf(i),e.set(s,[a])):r>=o.length?(a=new Tf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Tx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ax=`uniform sampler2D shadow_pass;
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
}`;function Rx(i,e,t){let n=new ar,s=new we,r=new we,o=new ft,a=new Xa({depthPacking:Bd}),l=new qa,c={},u=t.maxTextureSize,h={[Ai]:mn,[mn]:Ai,[ut]:ut},d=new ii({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new we},radius:{value:4}},vertexShader:Tx,fragmentShader:Ax}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new et;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ue(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hu;let p=this.type;this.render=function(w,A,B){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let M=i.getRenderTarget(),E=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Ii),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let H=p!==fi&&this.type===fi,J=p===fi&&this.type!==fi;for(let Z=0,K=w.length;Z<K;Z++){let ge=w[Z],G=ge.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ge,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let _e=G.getFrameExtents();if(s.multiply(_e),r.copy(G.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/_e.x),s.x=r.x*_e.x,G.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/_e.y),s.y=r.y*_e.y,G.mapSize.y=r.y)),G.map===null||H===!0||J===!0){let ye=this.type!==fi?{minFilter:yn,magFilter:yn}:{};G.map!==null&&G.map.dispose(),G.map=new hi(s.x,s.y,ye),G.map.texture.name=ge.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let me=G.getViewportCount();for(let ye=0;ye<me;ye++){let Re=G.getViewport(ye);o.set(r.x*Re.x,r.y*Re.y,r.x*Re.z,r.y*Re.w),L.viewport(o),G.updateMatrices(ge,ye),n=G.getFrustum(),v(A,B,G.camera,ge,this.type)}G.isPointLightShadow!==!0&&this.type===fi&&y(G,B),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,E,O)};function y(w,A){let B=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new hi(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,B,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,B,f,_,null)}function x(w,A,B,M){let E=null,O=B.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(O!==void 0)E=O;else if(E=B.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let L=E.uuid,H=A.uuid,J=c[L];J===void 0&&(J={},c[L]=J);let Z=J[H];Z===void 0&&(Z=E.clone(),J[H]=Z,A.addEventListener("dispose",D)),E=Z}if(E.visible=A.visible,E.wireframe=A.wireframe,M===fi?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:h[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,B.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let L=i.properties.get(E);L.light=B}return E}function v(w,A,B,M,E){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===fi)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,w.matrixWorld);let H=e.update(w),J=w.material;if(Array.isArray(J)){let Z=H.groups;for(let K=0,ge=Z.length;K<ge;K++){let G=Z[K],_e=J[G.materialIndex];if(_e&&_e.visible){let me=x(w,_e,M,E);w.onBeforeShadow(i,w,A,B,H,me,G),i.renderBufferDirect(B,null,H,me,w,G),w.onAfterShadow(i,w,A,B,H,me,G)}}}else if(J.visible){let Z=x(w,J,M,E);w.onBeforeShadow(i,w,A,B,H,Z,null),i.renderBufferDirect(B,null,H,Z,w,null),w.onAfterShadow(i,w,A,B,H,Z,null)}}let L=w.children;for(let H=0,J=L.length;H<J;H++)v(L[H],A,B,M,E)}function D(w){w.target.removeEventListener("dispose",D);for(let B in c){let M=c[B],E=w.target.uuid;E in M&&(M[E].dispose(),delete M[E])}}}var Cx={[rl]:ol,[al]:ul,[ll]:hl,[fs]:cl,[ol]:rl,[ul]:al,[hl]:ll,[cl]:fs};function Ix(i,e){function t(){let S=!1,z=new ft,ne=null,be=new ft(0,0,0,0);return{setMask:function(Me){ne!==Me&&!S&&(i.colorMask(Me,Me,Me,Me),ne=Me)},setLocked:function(Me){S=Me},setClear:function(Me,ce,Fe,Ze,_t){_t===!0&&(Me*=Ze,ce*=Ze,Fe*=Ze),z.set(Me,ce,Fe,Ze),be.equals(z)===!1&&(i.clearColor(Me,ce,Fe,Ze),be.copy(z))},reset:function(){S=!1,ne=null,be.set(-1,0,0,0)}}}function n(){let S=!1,z=!1,ne=null,be=null,Me=null;return{setReversed:function(ce){if(z!==ce){let Fe=e.get("EXT_clip_control");ce?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT),z=ce;let Ze=Me;Me=null,this.setClear(Ze)}},getReversed:function(){return z},setTest:function(ce){ce?de(i.DEPTH_TEST):Te(i.DEPTH_TEST)},setMask:function(ce){ne!==ce&&!S&&(i.depthMask(ce),ne=ce)},setFunc:function(ce){if(z&&(ce=Cx[ce]),be!==ce){switch(ce){case rl:i.depthFunc(i.NEVER);break;case ol:i.depthFunc(i.ALWAYS);break;case al:i.depthFunc(i.LESS);break;case fs:i.depthFunc(i.LEQUAL);break;case ll:i.depthFunc(i.EQUAL);break;case cl:i.depthFunc(i.GEQUAL);break;case ul:i.depthFunc(i.GREATER);break;case hl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}be=ce}},setLocked:function(ce){S=ce},setClear:function(ce){Me!==ce&&(z&&(ce=1-ce),i.clearDepth(ce),Me=ce)},reset:function(){S=!1,ne=null,be=null,Me=null,z=!1}}}function s(){let S=!1,z=null,ne=null,be=null,Me=null,ce=null,Fe=null,Ze=null,_t=null;return{setTest:function(ht){S||(ht?de(i.STENCIL_TEST):Te(i.STENCIL_TEST))},setMask:function(ht){z!==ht&&!S&&(i.stencilMask(ht),z=ht)},setFunc:function(ht,kn,ci){(ne!==ht||be!==kn||Me!==ci)&&(i.stencilFunc(ht,kn,ci),ne=ht,be=kn,Me=ci)},setOp:function(ht,kn,ci){(ce!==ht||Fe!==kn||Ze!==ci)&&(i.stencilOp(ht,kn,ci),ce=ht,Fe=kn,Ze=ci)},setLocked:function(ht){S=ht},setClear:function(ht){_t!==ht&&(i.clearStencil(ht),_t=ht)},reset:function(){S=!1,z=null,ne=null,be=null,Me=null,ce=null,Fe=null,Ze=null,_t=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,D=null,w=null,A=new Ye(0,0,0),B=0,M=!1,E=null,O=null,L=null,H=null,J=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,ge=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(ge=parseFloat(/^WebGL (\d)/.exec(G)[1]),K=ge>=1):G.indexOf("OpenGL ES")!==-1&&(ge=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),K=ge>=2);let _e=null,me={},ye=i.getParameter(i.SCISSOR_BOX),Re=i.getParameter(i.VIEWPORT),Ae=new ft().fromArray(ye),Ne=new ft().fromArray(Re);function He(S,z,ne,be){let Me=new Uint8Array(4),ce=i.createTexture();i.bindTexture(S,ce),i.texParameteri(S,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(S,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Fe=0;Fe<ne;Fe++)S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY?i.texImage3D(z,0,i.RGBA,1,1,be,0,i.RGBA,i.UNSIGNED_BYTE,Me):i.texImage2D(z+Fe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Me);return ce}let ie={};ie[i.TEXTURE_2D]=He(i.TEXTURE_2D,i.TEXTURE_2D,1),ie[i.TEXTURE_CUBE_MAP]=He(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[i.TEXTURE_2D_ARRAY]=He(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ie[i.TEXTURE_3D]=He(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),de(i.DEPTH_TEST),o.setFunc(fs),I(!1),V(uu),de(i.CULL_FACE),ae(Ii);function de(S){u[S]!==!0&&(i.enable(S),u[S]=!0)}function Te(S){u[S]!==!1&&(i.disable(S),u[S]=!1)}function Le(S,z){return h[S]!==z?(i.bindFramebuffer(S,z),h[S]=z,S===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=z),S===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=z),!0):!1}function Ce(S,z){let ne=f,be=!1;if(S){ne=d.get(z),ne===void 0&&(ne=[],d.set(z,ne));let Me=S.textures;if(ne.length!==Me.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let ce=0,Fe=Me.length;ce<Fe;ce++)ne[ce]=i.COLOR_ATTACHMENT0+ce;ne.length=Me.length,be=!0}}else ne[0]!==i.BACK&&(ne[0]=i.BACK,be=!0);be&&i.drawBuffers(ne)}function Q(S){return g!==S?(i.useProgram(S),g=S,!0):!1}let pe={[qi]:i.FUNC_ADD,[ud]:i.FUNC_SUBTRACT,[hd]:i.FUNC_REVERSE_SUBTRACT};pe[dd]=i.MIN,pe[fd]=i.MAX;let U={[pd]:i.ZERO,[md]:i.ONE,[gd]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[Md]:i.SRC_ALPHA_SATURATE,[vd]:i.DST_COLOR,[yd]:i.DST_ALPHA,[_d]:i.ONE_MINUS_SRC_COLOR,[Ra]:i.ONE_MINUS_SRC_ALPHA,[bd]:i.ONE_MINUS_DST_COLOR,[xd]:i.ONE_MINUS_DST_ALPHA,[Ed]:i.CONSTANT_COLOR,[Sd]:i.ONE_MINUS_CONSTANT_COLOR,[wd]:i.CONSTANT_ALPHA,[Td]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(S,z,ne,be,Me,ce,Fe,Ze,_t,ht){if(S===Ii){_===!0&&(Te(i.BLEND),_=!1);return}if(_===!1&&(de(i.BLEND),_=!0),S!==cd){if(S!==m||ht!==M){if((p!==qi||v!==qi)&&(i.blendEquation(i.FUNC_ADD),p=qi,v=qi),ht)switch(S){case ds:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case du:i.blendFunc(i.ONE,i.ONE);break;case fu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",S);break}else switch(S){case ds:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case du:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case fu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",S);break}y=null,x=null,D=null,w=null,A.set(0,0,0),B=0,m=S,M=ht}return}Me=Me||z,ce=ce||ne,Fe=Fe||be,(z!==p||Me!==v)&&(i.blendEquationSeparate(pe[z],pe[Me]),p=z,v=Me),(ne!==y||be!==x||ce!==D||Fe!==w)&&(i.blendFuncSeparate(U[ne],U[be],U[ce],U[Fe]),y=ne,x=be,D=ce,w=Fe),(Ze.equals(A)===!1||_t!==B)&&(i.blendColor(Ze.r,Ze.g,Ze.b,_t),A.copy(Ze),B=_t),m=S,M=!1}function P(S,z){S.side===ut?Te(i.CULL_FACE):de(i.CULL_FACE);let ne=S.side===mn;z&&(ne=!ne),I(ne),S.blending===ds&&S.transparent===!1?ae(Ii):ae(S.blending,S.blendEquation,S.blendSrc,S.blendDst,S.blendEquationAlpha,S.blendSrcAlpha,S.blendDstAlpha,S.blendColor,S.blendAlpha,S.premultipliedAlpha),o.setFunc(S.depthFunc),o.setTest(S.depthTest),o.setMask(S.depthWrite),r.setMask(S.colorWrite);let be=S.stencilWrite;a.setTest(be),be&&(a.setMask(S.stencilWriteMask),a.setFunc(S.stencilFunc,S.stencilRef,S.stencilFuncMask),a.setOp(S.stencilFail,S.stencilZFail,S.stencilZPass)),oe(S.polygonOffset,S.polygonOffsetFactor,S.polygonOffsetUnits),S.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):Te(i.SAMPLE_ALPHA_TO_COVERAGE)}function I(S){E!==S&&(S?i.frontFace(i.CW):i.frontFace(i.CCW),E=S)}function V(S){S!==ad?(de(i.CULL_FACE),S!==O&&(S===uu?i.cullFace(i.BACK):S===ld?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Te(i.CULL_FACE),O=S}function se(S){S!==L&&(K&&i.lineWidth(S),L=S)}function oe(S,z,ne){S?(de(i.POLYGON_OFFSET_FILL),(H!==z||J!==ne)&&(i.polygonOffset(z,ne),H=z,J=ne)):Te(i.POLYGON_OFFSET_FILL)}function fe(S){S?de(i.SCISSOR_TEST):Te(i.SCISSOR_TEST)}function Se(S){S===void 0&&(S=i.TEXTURE0+Z-1),_e!==S&&(i.activeTexture(S),_e=S)}function De(S,z,ne){ne===void 0&&(_e===null?ne=i.TEXTURE0+Z-1:ne=_e);let be=me[ne];be===void 0&&(be={type:void 0,texture:void 0},me[ne]=be),(be.type!==S||be.texture!==z)&&(_e!==ne&&(i.activeTexture(ne),_e=ne),i.bindTexture(S,z||ie[S]),be.type=S,be.texture=z)}function C(){let S=me[_e];S!==void 0&&S.type!==void 0&&(i.bindTexture(S.type,null),S.type=void 0,S.texture=void 0)}function b(){try{i.compressedTexImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function X(){try{i.compressedTexImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function re(){try{i.texSubImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function ve(){try{i.texSubImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function he(){try{i.compressedTexSubImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function Y(){try{i.compressedTexSubImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function T(){try{i.texStorage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function q(){try{i.texStorage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function te(){try{i.texImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function $(){try{i.texImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function xe(S){Ae.equals(S)===!1&&(i.scissor(S.x,S.y,S.z,S.w),Ae.copy(S))}function Ie(S){Ne.equals(S)===!1&&(i.viewport(S.x,S.y,S.z,S.w),Ne.copy(S))}function F(S,z){let ne=c.get(z);ne===void 0&&(ne=new WeakMap,c.set(z,ne));let be=ne.get(S);be===void 0&&(be=i.getUniformBlockIndex(z,S.name),ne.set(S,be))}function W(S,z){let be=c.get(z).get(S);l.get(z)!==be&&(i.uniformBlockBinding(z,be,S.__bindingPointIndex),l.set(z,be))}function N(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},_e=null,me={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,D=null,w=null,A=new Ye(0,0,0),B=0,M=!1,E=null,O=null,L=null,H=null,J=null,Ae.set(0,0,i.canvas.width,i.canvas.height),Ne.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:de,disable:Te,bindFramebuffer:Le,drawBuffers:Ce,useProgram:Q,setBlending:ae,setMaterial:P,setFlipSided:I,setCullFace:V,setLineWidth:se,setPolygonOffset:oe,setScissorTest:fe,activeTexture:Se,bindTexture:De,unbindTexture:C,compressedTexImage2D:b,compressedTexImage3D:X,texImage2D:te,texImage3D:$,updateUBOMapping:F,uniformBlockBinding:W,texStorage2D:T,texStorage3D:q,texSubImage2D:re,texSubImage3D:ve,compressedTexSubImage2D:he,compressedTexSubImage3D:Y,scissor:xe,viewport:Ie,reset:N}}function Px(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new we,u=new WeakMap,h,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,b){return f?new OffscreenCanvas(C,b):Jr("canvas")}function _(C,b,X){let re=1,ve=De(C);if((ve.width>X||ve.height>X)&&(re=X/Math.max(ve.width,ve.height)),re<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let he=Math.floor(re*ve.width),Y=Math.floor(re*ve.height);h===void 0&&(h=g(he,Y));let T=b?g(he,Y):h;return T.width=he,T.height=Y,T.getContext("2d").drawImage(C,0,0,he,Y),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ve.width+"x"+ve.height+") to ("+he+"x"+Y+")."),T}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ve.width+"x"+ve.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){i.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(C,b,X,re,ve=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let he=b;if(b===i.RED&&(X===i.FLOAT&&(he=i.R32F),X===i.HALF_FLOAT&&(he=i.R16F),X===i.UNSIGNED_BYTE&&(he=i.R8)),b===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(he=i.R8UI),X===i.UNSIGNED_SHORT&&(he=i.R16UI),X===i.UNSIGNED_INT&&(he=i.R32UI),X===i.BYTE&&(he=i.R8I),X===i.SHORT&&(he=i.R16I),X===i.INT&&(he=i.R32I)),b===i.RG&&(X===i.FLOAT&&(he=i.RG32F),X===i.HALF_FLOAT&&(he=i.RG16F),X===i.UNSIGNED_BYTE&&(he=i.RG8)),b===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(he=i.RG8UI),X===i.UNSIGNED_SHORT&&(he=i.RG16UI),X===i.UNSIGNED_INT&&(he=i.RG32UI),X===i.BYTE&&(he=i.RG8I),X===i.SHORT&&(he=i.RG16I),X===i.INT&&(he=i.RG32I)),b===i.RGB_INTEGER&&(X===i.UNSIGNED_BYTE&&(he=i.RGB8UI),X===i.UNSIGNED_SHORT&&(he=i.RGB16UI),X===i.UNSIGNED_INT&&(he=i.RGB32UI),X===i.BYTE&&(he=i.RGB8I),X===i.SHORT&&(he=i.RGB16I),X===i.INT&&(he=i.RGB32I)),b===i.RGBA_INTEGER&&(X===i.UNSIGNED_BYTE&&(he=i.RGBA8UI),X===i.UNSIGNED_SHORT&&(he=i.RGBA16UI),X===i.UNSIGNED_INT&&(he=i.RGBA32UI),X===i.BYTE&&(he=i.RGBA8I),X===i.SHORT&&(he=i.RGBA16I),X===i.INT&&(he=i.RGBA32I)),b===i.RGB&&(X===i.UNSIGNED_INT_5_9_9_9_REV&&(he=i.RGB9_E5),X===i.UNSIGNED_INT_10F_11F_11F_REV&&(he=i.R11F_G11F_B10F)),b===i.RGBA){let Y=ve?$r:ct.getTransfer(re);X===i.FLOAT&&(he=i.RGBA32F),X===i.HALF_FLOAT&&(he=i.RGBA16F),X===i.UNSIGNED_BYTE&&(he=Y===xt?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT_4_4_4_4&&(he=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(he=i.RGB5_A1)}return(he===i.R16F||he===i.R32F||he===i.RG16F||he===i.RG32F||he===i.RGBA16F||he===i.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function v(C,b){let X;return C?b===null||b===Qi||b===gr?X=i.DEPTH24_STENCIL8:b===ri?X=i.DEPTH32F_STENCIL8:b===pr&&(X=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Qi||b===gr?X=i.DEPTH_COMPONENT24:b===ri?X=i.DEPTH_COMPONENT32F:b===pr&&(X=i.DEPTH_COMPONENT16),X}function D(C,b){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==yn&&C.minFilter!==ei?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function w(C){let b=C.target;b.removeEventListener("dispose",w),B(b),b.isVideoTexture&&u.delete(b)}function A(C){let b=C.target;b.removeEventListener("dispose",A),E(b)}function B(C){let b=n.get(C);if(b.__webglInit===void 0)return;let X=C.source,re=d.get(X);if(re){let ve=re[b.__cacheKey];ve.usedTimes--,ve.usedTimes===0&&M(C),Object.keys(re).length===0&&d.delete(X)}n.remove(C)}function M(C){let b=n.get(C);i.deleteTexture(b.__webglTexture);let X=C.source,re=d.get(X);delete re[b.__cacheKey],o.memory.textures--}function E(C){let b=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(b.__webglFramebuffer[re]))for(let ve=0;ve<b.__webglFramebuffer[re].length;ve++)i.deleteFramebuffer(b.__webglFramebuffer[re][ve]);else i.deleteFramebuffer(b.__webglFramebuffer[re]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[re])}else{if(Array.isArray(b.__webglFramebuffer))for(let re=0;re<b.__webglFramebuffer.length;re++)i.deleteFramebuffer(b.__webglFramebuffer[re]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let re=0;re<b.__webglColorRenderbuffer.length;re++)b.__webglColorRenderbuffer[re]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[re]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let X=C.textures;for(let re=0,ve=X.length;re<ve;re++){let he=n.get(X[re]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),o.memory.textures--),n.remove(X[re])}n.remove(C)}let O=0;function L(){O=0}function H(){let C=O;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),O+=1,C}function J(C){let b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function Z(C,b){let X=n.get(C);if(C.isVideoTexture&&fe(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&X.__version!==C.version){let re=C.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ie(X,C,b);return}}else C.isExternalTexture&&(X.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+b)}function K(C,b){let X=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){ie(X,C,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+b)}function ge(C,b){let X=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){ie(X,C,b);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+b)}function G(C,b){let X=n.get(C);if(C.version>0&&X.__version!==C.version){de(X,C,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+b)}let _e={[Ks]:i.REPEAT,[Xi]:i.CLAMP_TO_EDGE,[Ca]:i.MIRRORED_REPEAT},me={[yn]:i.NEAREST,[Fd]:i.NEAREST_MIPMAP_NEAREST,[Co]:i.NEAREST_MIPMAP_LINEAR,[ei]:i.LINEAR,[ml]:i.LINEAR_MIPMAP_NEAREST,[ji]:i.LINEAR_MIPMAP_LINEAR},ye={[Hd]:i.NEVER,[qd]:i.ALWAYS,[zd]:i.LESS,[Tu]:i.LEQUAL,[Vd]:i.EQUAL,[Xd]:i.GEQUAL,[Gd]:i.GREATER,[Wd]:i.NOTEQUAL};function Re(C,b){if(b.type===ri&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===ei||b.magFilter===ml||b.magFilter===Co||b.magFilter===ji||b.minFilter===ei||b.minFilter===ml||b.minFilter===Co||b.minFilter===ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,_e[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,_e[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,_e[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,me[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,me[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ye[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===yn||b.minFilter!==Co&&b.minFilter!==ji||b.type===ri&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Ae(C,b){let X=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",w));let re=b.source,ve=d.get(re);ve===void 0&&(ve={},d.set(re,ve));let he=J(b);if(he!==C.__cacheKey){ve[he]===void 0&&(ve[he]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,X=!0),ve[he].usedTimes++;let Y=ve[C.__cacheKey];Y!==void 0&&(ve[C.__cacheKey].usedTimes--,Y.usedTimes===0&&M(b)),C.__cacheKey=he,C.__webglTexture=ve[he].texture}return X}function Ne(C,b,X){return Math.floor(Math.floor(C/X)/b)}function He(C,b,X,re){let he=C.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,X,re,b.data);else{he.sort(($,xe)=>$.start-xe.start);let Y=0;for(let $=1;$<he.length;$++){let xe=he[Y],Ie=he[$],F=xe.start+xe.count,W=Ne(Ie.start,b.width,4),N=Ne(xe.start,b.width,4);Ie.start<=F+1&&W===N&&Ne(Ie.start+Ie.count-1,b.width,4)===W?xe.count=Math.max(xe.count,Ie.start+Ie.count-xe.start):(++Y,he[Y]=Ie)}he.length=Y+1;let T=i.getParameter(i.UNPACK_ROW_LENGTH),q=i.getParameter(i.UNPACK_SKIP_PIXELS),te=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let $=0,xe=he.length;$<xe;$++){let Ie=he[$],F=Math.floor(Ie.start/4),W=Math.ceil(Ie.count/4),N=F%b.width,S=Math.floor(F/b.width),z=W,ne=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,N),i.pixelStorei(i.UNPACK_SKIP_ROWS,S),t.texSubImage2D(i.TEXTURE_2D,0,N,S,z,ne,X,re,b.data)}C.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,T),i.pixelStorei(i.UNPACK_SKIP_PIXELS,q),i.pixelStorei(i.UNPACK_SKIP_ROWS,te)}}function ie(C,b,X){let re=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(re=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(re=i.TEXTURE_3D);let ve=Ae(C,b),he=b.source;t.bindTexture(re,C.__webglTexture,i.TEXTURE0+X);let Y=n.get(he);if(he.version!==Y.__version||ve===!0){t.activeTexture(i.TEXTURE0+X);let T=ct.getPrimaries(ct.workingColorSpace),q=b.colorSpace===Li?null:ct.getPrimaries(b.colorSpace),te=b.colorSpace===Li||T===q?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let $=_(b.image,!1,s.maxTextureSize);$=Se(b,$);let xe=r.convert(b.format,b.colorSpace),Ie=r.convert(b.type),F=x(b.internalFormat,xe,Ie,b.colorSpace,b.isVideoTexture);Re(re,b);let W,N=b.mipmaps,S=b.isVideoTexture!==!0,z=Y.__version===void 0||ve===!0,ne=he.dataReady,be=D(b,$);if(b.isDepthTexture)F=v(b.format===_r,b.type),z&&(S?t.texStorage2D(i.TEXTURE_2D,1,F,$.width,$.height):t.texImage2D(i.TEXTURE_2D,0,F,$.width,$.height,0,xe,Ie,null));else if(b.isDataTexture)if(N.length>0){S&&z&&t.texStorage2D(i.TEXTURE_2D,be,F,N[0].width,N[0].height);for(let Me=0,ce=N.length;Me<ce;Me++)W=N[Me],S?ne&&t.texSubImage2D(i.TEXTURE_2D,Me,0,0,W.width,W.height,xe,Ie,W.data):t.texImage2D(i.TEXTURE_2D,Me,F,W.width,W.height,0,xe,Ie,W.data);b.generateMipmaps=!1}else S?(z&&t.texStorage2D(i.TEXTURE_2D,be,F,$.width,$.height),ne&&He(b,$,xe,Ie)):t.texImage2D(i.TEXTURE_2D,0,F,$.width,$.height,0,xe,Ie,$.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){S&&z&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,F,N[0].width,N[0].height,$.depth);for(let Me=0,ce=N.length;Me<ce;Me++)if(W=N[Me],b.format!==Ln)if(xe!==null)if(S){if(ne)if(b.layerUpdates.size>0){let Fe=Uu(W.width,W.height,b.format,b.type);for(let Ze of b.layerUpdates){let _t=W.data.subarray(Ze*Fe/W.data.BYTES_PER_ELEMENT,(Ze+1)*Fe/W.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Me,0,0,Ze,W.width,W.height,1,xe,_t)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Me,0,0,0,W.width,W.height,$.depth,xe,W.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Me,F,W.width,W.height,$.depth,0,W.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else S?ne&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Me,0,0,0,W.width,W.height,$.depth,xe,Ie,W.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Me,F,W.width,W.height,$.depth,0,xe,Ie,W.data)}else{S&&z&&t.texStorage2D(i.TEXTURE_2D,be,F,N[0].width,N[0].height);for(let Me=0,ce=N.length;Me<ce;Me++)W=N[Me],b.format!==Ln?xe!==null?S?ne&&t.compressedTexSubImage2D(i.TEXTURE_2D,Me,0,0,W.width,W.height,xe,W.data):t.compressedTexImage2D(i.TEXTURE_2D,Me,F,W.width,W.height,0,W.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):S?ne&&t.texSubImage2D(i.TEXTURE_2D,Me,0,0,W.width,W.height,xe,Ie,W.data):t.texImage2D(i.TEXTURE_2D,Me,F,W.width,W.height,0,xe,Ie,W.data)}else if(b.isDataArrayTexture)if(S){if(z&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,F,$.width,$.height,$.depth),ne)if(b.layerUpdates.size>0){let Me=Uu($.width,$.height,b.format,b.type);for(let ce of b.layerUpdates){let Fe=$.data.subarray(ce*Me/$.data.BYTES_PER_ELEMENT,(ce+1)*Me/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ce,$.width,$.height,1,xe,Ie,Fe)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,xe,Ie,$.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,F,$.width,$.height,$.depth,0,xe,Ie,$.data);else if(b.isData3DTexture)S?(z&&t.texStorage3D(i.TEXTURE_3D,be,F,$.width,$.height,$.depth),ne&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,xe,Ie,$.data)):t.texImage3D(i.TEXTURE_3D,0,F,$.width,$.height,$.depth,0,xe,Ie,$.data);else if(b.isFramebufferTexture){if(z)if(S)t.texStorage2D(i.TEXTURE_2D,be,F,$.width,$.height);else{let Me=$.width,ce=$.height;for(let Fe=0;Fe<be;Fe++)t.texImage2D(i.TEXTURE_2D,Fe,F,Me,ce,0,xe,Ie,null),Me>>=1,ce>>=1}}else if(N.length>0){if(S&&z){let Me=De(N[0]);t.texStorage2D(i.TEXTURE_2D,be,F,Me.width,Me.height)}for(let Me=0,ce=N.length;Me<ce;Me++)W=N[Me],S?ne&&t.texSubImage2D(i.TEXTURE_2D,Me,0,0,xe,Ie,W):t.texImage2D(i.TEXTURE_2D,Me,F,xe,Ie,W);b.generateMipmaps=!1}else if(S){if(z){let Me=De($);t.texStorage2D(i.TEXTURE_2D,be,F,Me.width,Me.height)}ne&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,xe,Ie,$)}else t.texImage2D(i.TEXTURE_2D,0,F,xe,Ie,$);m(b)&&p(re),Y.__version=he.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function de(C,b,X){if(b.image.length!==6)return;let re=Ae(C,b),ve=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+X);let he=n.get(ve);if(ve.version!==he.__version||re===!0){t.activeTexture(i.TEXTURE0+X);let Y=ct.getPrimaries(ct.workingColorSpace),T=b.colorSpace===Li?null:ct.getPrimaries(b.colorSpace),q=b.colorSpace===Li||Y===T?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,q);let te=b.isCompressedTexture||b.image[0].isCompressedTexture,$=b.image[0]&&b.image[0].isDataTexture,xe=[];for(let ce=0;ce<6;ce++)!te&&!$?xe[ce]=_(b.image[ce],!0,s.maxCubemapSize):xe[ce]=$?b.image[ce].image:b.image[ce],xe[ce]=Se(b,xe[ce]);let Ie=xe[0],F=r.convert(b.format,b.colorSpace),W=r.convert(b.type),N=x(b.internalFormat,F,W,b.colorSpace),S=b.isVideoTexture!==!0,z=he.__version===void 0||re===!0,ne=ve.dataReady,be=D(b,Ie);Re(i.TEXTURE_CUBE_MAP,b);let Me;if(te){S&&z&&t.texStorage2D(i.TEXTURE_CUBE_MAP,be,N,Ie.width,Ie.height);for(let ce=0;ce<6;ce++){Me=xe[ce].mipmaps;for(let Fe=0;Fe<Me.length;Fe++){let Ze=Me[Fe];b.format!==Ln?F!==null?S?ne&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe,0,0,Ze.width,Ze.height,F,Ze.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe,N,Ze.width,Ze.height,0,Ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):S?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe,0,0,Ze.width,Ze.height,F,W,Ze.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe,N,Ze.width,Ze.height,0,F,W,Ze.data)}}}else{if(Me=b.mipmaps,S&&z){Me.length>0&&be++;let ce=De(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,be,N,ce.width,ce.height)}for(let ce=0;ce<6;ce++)if($){S?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,xe[ce].width,xe[ce].height,F,W,xe[ce].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,N,xe[ce].width,xe[ce].height,0,F,W,xe[ce].data);for(let Fe=0;Fe<Me.length;Fe++){let _t=Me[Fe].image[ce].image;S?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe+1,0,0,_t.width,_t.height,F,W,_t.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe+1,N,_t.width,_t.height,0,F,W,_t.data)}}else{S?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,F,W,xe[ce]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,N,F,W,xe[ce]);for(let Fe=0;Fe<Me.length;Fe++){let Ze=Me[Fe];S?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe+1,0,0,F,W,Ze.image[ce]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Fe+1,N,F,W,Ze.image[ce])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),he.__version=ve.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Te(C,b,X,re,ve,he){let Y=r.convert(X.format,X.colorSpace),T=r.convert(X.type),q=x(X.internalFormat,Y,T,X.colorSpace),te=n.get(b),$=n.get(X);if($.__renderTarget=b,!te.__hasExternalTextures){let xe=Math.max(1,b.width>>he),Ie=Math.max(1,b.height>>he);ve===i.TEXTURE_3D||ve===i.TEXTURE_2D_ARRAY?t.texImage3D(ve,he,q,xe,Ie,b.depth,0,Y,T,null):t.texImage2D(ve,he,q,xe,Ie,0,Y,T,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),oe(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ve,$.__webglTexture,0,se(b)):(ve===i.TEXTURE_2D||ve>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ve<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,re,ve,$.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Le(C,b,X){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){let re=b.depthTexture,ve=re&&re.isDepthTexture?re.type:null,he=v(b.stencilBuffer,ve),Y=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,T=se(b);oe(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,T,he,b.width,b.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,T,he,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,he,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,C)}else{let re=b.textures;for(let ve=0;ve<re.length;ve++){let he=re[ve],Y=r.convert(he.format,he.colorSpace),T=r.convert(he.type),q=x(he.internalFormat,Y,T,he.colorSpace),te=se(b);X&&oe(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,te,q,b.width,b.height):oe(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te,q,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,q,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ce(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let re=n.get(b.depthTexture);re.__renderTarget=b,(!re.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Z(b.depthTexture,0);let ve=re.__webglTexture,he=se(b);if(b.depthTexture.format===js)oe(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ve,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ve,0);else if(b.depthTexture.format===_r)oe(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ve,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function Q(C){let b=n.get(C),X=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){let re=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),re){let ve=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,re.removeEventListener("dispose",ve)};re.addEventListener("dispose",ve),b.__depthDisposeCallback=ve}b.__boundDepthTexture=re}if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");let re=C.texture.mipmaps;re&&re.length>0?Ce(b.__webglFramebuffer[0],C):Ce(b.__webglFramebuffer,C)}else if(X){b.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[re]),b.__webglDepthbuffer[re]===void 0)b.__webglDepthbuffer[re]=i.createRenderbuffer(),Le(b.__webglDepthbuffer[re],C,!1);else{let ve=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=b.__webglDepthbuffer[re];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,he)}}else{let re=C.texture.mipmaps;if(re&&re.length>0?t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),Le(b.__webglDepthbuffer,C,!1);else{let ve=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function pe(C,b,X){let re=n.get(C);b!==void 0&&Te(re.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&Q(C)}function U(C){let b=C.texture,X=n.get(C),re=n.get(b);C.addEventListener("dispose",A);let ve=C.textures,he=C.isWebGLCubeRenderTarget===!0,Y=ve.length>1;if(Y||(re.__webglTexture===void 0&&(re.__webglTexture=i.createTexture()),re.__version=b.version,o.memory.textures++),he){X.__webglFramebuffer=[];for(let T=0;T<6;T++)if(b.mipmaps&&b.mipmaps.length>0){X.__webglFramebuffer[T]=[];for(let q=0;q<b.mipmaps.length;q++)X.__webglFramebuffer[T][q]=i.createFramebuffer()}else X.__webglFramebuffer[T]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){X.__webglFramebuffer=[];for(let T=0;T<b.mipmaps.length;T++)X.__webglFramebuffer[T]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(Y)for(let T=0,q=ve.length;T<q;T++){let te=n.get(ve[T]);te.__webglTexture===void 0&&(te.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&oe(C)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let T=0;T<ve.length;T++){let q=ve[T];X.__webglColorRenderbuffer[T]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[T]);let te=r.convert(q.format,q.colorSpace),$=r.convert(q.type),xe=x(q.internalFormat,te,$,q.colorSpace,C.isXRRenderTarget===!0),Ie=se(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie,xe,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+T,i.RENDERBUFFER,X.__webglColorRenderbuffer[T])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),Le(X.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,re.__webglTexture),Re(i.TEXTURE_CUBE_MAP,b);for(let T=0;T<6;T++)if(b.mipmaps&&b.mipmaps.length>0)for(let q=0;q<b.mipmaps.length;q++)Te(X.__webglFramebuffer[T][q],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+T,q);else Te(X.__webglFramebuffer[T],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+T,0);m(b)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Y){for(let T=0,q=ve.length;T<q;T++){let te=ve[T],$=n.get(te),xe=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(xe=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,$.__webglTexture),Re(xe,te),Te(X.__webglFramebuffer,C,te,i.COLOR_ATTACHMENT0+T,xe,0),m(te)&&p(xe)}t.unbindTexture()}else{let T=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(T=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(T,re.__webglTexture),Re(T,b),b.mipmaps&&b.mipmaps.length>0)for(let q=0;q<b.mipmaps.length;q++)Te(X.__webglFramebuffer[q],C,b,i.COLOR_ATTACHMENT0,T,q);else Te(X.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,T,0);m(b)&&p(T),t.unbindTexture()}C.depthBuffer&&Q(C)}function ae(C){let b=C.textures;for(let X=0,re=b.length;X<re;X++){let ve=b[X];if(m(ve)){let he=y(C),Y=n.get(ve).__webglTexture;t.bindTexture(he,Y),p(he),t.unbindTexture()}}}let P=[],I=[];function V(C){if(C.samples>0){if(oe(C)===!1){let b=C.textures,X=C.width,re=C.height,ve=i.COLOR_BUFFER_BIT,he=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=n.get(C),T=b.length>1;if(T)for(let te=0;te<b.length;te++)t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+te,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+te,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Y.__webglMultisampledFramebuffer);let q=C.texture.mipmaps;q&&q.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Y.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Y.__webglFramebuffer);for(let te=0;te<b.length;te++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ve|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ve|=i.STENCIL_BUFFER_BIT)),T){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Y.__webglColorRenderbuffer[te]);let $=n.get(b[te]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$,0)}i.blitFramebuffer(0,0,X,re,0,0,X,re,ve,i.NEAREST),l===!0&&(P.length=0,I.length=0,P.push(i.COLOR_ATTACHMENT0+te),C.depthBuffer&&C.resolveDepthBuffer===!1&&(P.push(he),I.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,P))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),T)for(let te=0;te<b.length;te++){t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+te,i.RENDERBUFFER,Y.__webglColorRenderbuffer[te]);let $=n.get(b[te]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+te,i.TEXTURE_2D,$,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Y.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){let b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function se(C){return Math.min(s.maxSamples,C.samples)}function oe(C){let b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function fe(C){let b=o.render.frame;u.get(C)!==b&&(u.set(C,b),C.update())}function Se(C,b){let X=C.colorSpace,re=C.format,ve=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||X!==ps&&X!==Li&&(ct.getTransfer(X)===xt?(re!==Ln||ve!==si)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),b}function De(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=L,this.setTexture2D=Z,this.setTexture2DArray=K,this.setTexture3D=ge,this.setTextureCube=G,this.rebindTextures=pe,this.setupRenderTarget=U,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=V,this.setupDepthRenderbuffer=Q,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=oe}function Lx(i,e){function t(n,s=Li){let r,o=ct.getTransfer(s);if(n===si)return i.UNSIGNED_BYTE;if(n===_l)return i.UNSIGNED_SHORT_4_4_4_4;if(n===yl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===vu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===_u)return i.BYTE;if(n===yu)return i.SHORT;if(n===pr)return i.UNSIGNED_SHORT;if(n===gl)return i.INT;if(n===Qi)return i.UNSIGNED_INT;if(n===ri)return i.FLOAT;if(n===mr)return i.HALF_FLOAT;if(n===bu)return i.ALPHA;if(n===Mu)return i.RGB;if(n===Ln)return i.RGBA;if(n===js)return i.DEPTH_COMPONENT;if(n===_r)return i.DEPTH_STENCIL;if(n===Eu)return i.RED;if(n===xl)return i.RED_INTEGER;if(n===Su)return i.RG;if(n===vl)return i.RG_INTEGER;if(n===bl)return i.RGBA_INTEGER;if(n===Io||n===Po||n===Lo||n===Do)if(o===xt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Io)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Io)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ml||n===El||n===Sl||n===wl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===El)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===wl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tl||n===Al||n===Rl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Tl||n===Al)return o===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Rl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Cl||n===Il||n===Pl||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol||n===Bl||n===kl||n===Hl||n===zl||n===Vl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Cl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Il)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ll)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Dl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ul)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ol)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===kl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Hl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===zl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Gl||n===Wl||n===Xl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Gl)return o===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ql||n===Yl||n===$l||n===Zl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ql)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Yl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$l)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Zl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Dx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ux=`
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

}`,Yu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new co(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ii({vertexShader:Dx,fragmentShader:Ux,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ue(new sn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},$u=class extends Ri{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null,_=typeof XRWebGLBinding<"u",m=new Yu,p={},y=t.getContextAttributes(),x=null,v=null,D=[],w=[],A=new we,B=null,M=new Gt;M.viewport=new ft;let E=new Gt;E.viewport=new ft;let O=[M,E],L=new il,H=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ie){let de=D[ie];return de===void 0&&(de=new ir,D[ie]=de),de.getTargetRaySpace()},this.getControllerGrip=function(ie){let de=D[ie];return de===void 0&&(de=new ir,D[ie]=de),de.getGripSpace()},this.getHand=function(ie){let de=D[ie];return de===void 0&&(de=new ir,D[ie]=de),de.getHandSpace()};function Z(ie){let de=w.indexOf(ie.inputSource);if(de===-1)return;let Te=D[de];Te!==void 0&&(Te.update(ie.inputSource,ie.frame,c||o),Te.dispatchEvent({type:ie.type,data:ie.inputSource}))}function K(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",ge);for(let ie=0;ie<D.length;ie++){let de=w[ie];de!==null&&(w[ie]=null,D[ie].disconnect(de))}H=null,J=null,m.reset();for(let ie in p)delete p[ie];e.setRenderTarget(x),f=null,d=null,h=null,s=null,v=null,He.stop(),n.isPresenting=!1,e.setPixelRatio(B),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ie){r=ie,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ie){a=ie,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ie){c=ie},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ie){if(s=ie,s!==null){if(x=e.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",K),s.addEventListener("inputsourceschange",ge),y.xrCompatible!==!0&&await t.makeXRCompatible(),B=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,Le=null,Ce=null;y.depth&&(Ce=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Te=y.stencil?_r:js,Le=y.stencil?gr:Qi);let Q={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Q),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new hi(d.textureWidth,d.textureHeight,{format:Ln,type:si,depthTexture:new lo(d.textureWidth,d.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let Te={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Te),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new hi(f.framebufferWidth,f.framebufferHeight,{format:Ln,type:si,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),He.setContext(s),He.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ge(ie){for(let de=0;de<ie.removed.length;de++){let Te=ie.removed[de],Le=w.indexOf(Te);Le>=0&&(w[Le]=null,D[Le].disconnect(Te))}for(let de=0;de<ie.added.length;de++){let Te=ie.added[de],Le=w.indexOf(Te);if(Le===-1){for(let Q=0;Q<D.length;Q++)if(Q>=w.length){w.push(Te),Le=Q;break}else if(w[Q]===null){w[Q]=Te,Le=Q;break}if(Le===-1)break}let Ce=D[Le];Ce&&Ce.connect(Te)}}let G=new k,_e=new k;function me(ie,de,Te){G.setFromMatrixPosition(de.matrixWorld),_e.setFromMatrixPosition(Te.matrixWorld);let Le=G.distanceTo(_e),Ce=de.projectionMatrix.elements,Q=Te.projectionMatrix.elements,pe=Ce[14]/(Ce[10]-1),U=Ce[14]/(Ce[10]+1),ae=(Ce[9]+1)/Ce[5],P=(Ce[9]-1)/Ce[5],I=(Ce[8]-1)/Ce[0],V=(Q[8]+1)/Q[0],se=pe*I,oe=pe*V,fe=Le/(-I+V),Se=fe*-I;if(de.matrixWorld.decompose(ie.position,ie.quaternion,ie.scale),ie.translateX(Se),ie.translateZ(fe),ie.matrixWorld.compose(ie.position,ie.quaternion,ie.scale),ie.matrixWorldInverse.copy(ie.matrixWorld).invert(),Ce[10]===-1)ie.projectionMatrix.copy(de.projectionMatrix),ie.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{let De=pe+fe,C=U+fe,b=se-Se,X=oe+(Le-Se),re=ae*U/C*De,ve=P*U/C*De;ie.projectionMatrix.makePerspective(b,X,re,ve,De,C),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert()}}function ye(ie,de){de===null?ie.matrixWorld.copy(ie.matrix):ie.matrixWorld.multiplyMatrices(de.matrixWorld,ie.matrix),ie.matrixWorldInverse.copy(ie.matrixWorld).invert()}this.updateCamera=function(ie){if(s===null)return;let de=ie.near,Te=ie.far;m.texture!==null&&(m.depthNear>0&&(de=m.depthNear),m.depthFar>0&&(Te=m.depthFar)),L.near=E.near=M.near=de,L.far=E.far=M.far=Te,(H!==L.near||J!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),H=L.near,J=L.far),L.layers.mask=ie.layers.mask|6,M.layers.mask=L.layers.mask&3,E.layers.mask=L.layers.mask&5;let Le=ie.parent,Ce=L.cameras;ye(L,Le);for(let Q=0;Q<Ce.length;Q++)ye(Ce[Q],Le);Ce.length===2?me(L,M,E):L.projectionMatrix.copy(M.projectionMatrix),Re(ie,L,Le)};function Re(ie,de,Te){Te===null?ie.matrix.copy(de.matrixWorld):(ie.matrix.copy(Te.matrixWorld),ie.matrix.invert(),ie.matrix.multiply(de.matrixWorld)),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.updateMatrixWorld(!0),ie.projectionMatrix.copy(de.projectionMatrix),ie.projectionMatrixInverse.copy(de.projectionMatrixInverse),ie.isPerspectiveCamera&&(ie.fov=Qs*2*Math.atan(1/ie.projectionMatrix.elements[5]),ie.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(ie){l=ie,d!==null&&(d.fixedFoveation=ie),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ie)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(ie){return p[ie]};let Ae=null;function Ne(ie,de){if(u=de.getViewerPose(c||o),g=de,u!==null){let Te=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Le=!1;Te.length!==L.cameras.length&&(L.cameras.length=0,Le=!0);for(let U=0;U<Te.length;U++){let ae=Te[U],P=null;if(f!==null)P=f.getViewport(ae);else{let V=h.getViewSubImage(d,ae);P=V.viewport,U===0&&(e.setRenderTargetTextures(v,V.colorTexture,V.depthStencilTexture),e.setRenderTarget(v))}let I=O[U];I===void 0&&(I=new Gt,I.layers.enable(U),I.viewport=new ft,O[U]=I),I.matrix.fromArray(ae.transform.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale),I.projectionMatrix.fromArray(ae.projectionMatrix),I.projectionMatrixInverse.copy(I.projectionMatrix).invert(),I.viewport.set(P.x,P.y,P.width,P.height),U===0&&(L.matrix.copy(I.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Le===!0&&L.cameras.push(I)}let Ce=s.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let U=h.getDepthInformation(Te[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Ce&&Ce.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let U=0;U<Te.length;U++){let ae=Te[U].camera;if(ae){let P=p[ae];P||(P=new co,p[ae]=P);let I=h.getCameraImage(ae);P.sourceTexture=I}}}}for(let Te=0;Te<D.length;Te++){let Le=w[Te],Ce=D[Te];Le!==null&&Ce!==void 0&&Ce.update(Le,de,c||o)}Ae&&Ae(ie,de),de.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:de}),g=null}let He=new Af;He.setAnimationLoop(Ne),this.setAnimationLoop=function(ie){Ae=ie},this.dispose=function(){}}},bs=new pn,Nx=new rt;function Fx(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Iu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,y,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===mn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===mn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let y=e.get(p),x=y.envMap,v=y.envMapRotation;x&&(m.envMap.value=x,bs.copy(v),bs.x*=-1,bs.y*=-1,bs.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(bs.y*=-1,bs.z*=-1),m.envMapRotation.value.setFromMatrix4(Nx.makeRotationFromEuler(bs)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===mn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let y=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Ox(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){let v=x.program;n.uniformBlockBinding(y,v)}function c(y,x){let v=s[y.id];v===void 0&&(g(y),v=u(y),s[y.id]=v,y.addEventListener("dispose",m));let D=x.program;n.updateUBOMapping(y,D);let w=e.render.frame;r[y.id]!==w&&(d(y),r[y.id]=w)}function u(y){let x=h();y.__bindingPointIndex=x;let v=i.createBuffer(),D=y.__size,w=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,D,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,v),v}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let x=s[y.id],v=y.uniforms,D=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,A=v.length;w<A;w++){let B=Array.isArray(v[w])?v[w]:[v[w]];for(let M=0,E=B.length;M<E;M++){let O=B[M];if(f(O,w,M,D)===!0){let L=O.__offset,H=Array.isArray(O.value)?O.value:[O.value],J=0;for(let Z=0;Z<H.length;Z++){let K=H[Z],ge=_(K);typeof K=="number"||typeof K=="boolean"?(O.__data[0]=K,i.bufferSubData(i.UNIFORM_BUFFER,L+J,O.__data)):K.isMatrix3?(O.__data[0]=K.elements[0],O.__data[1]=K.elements[1],O.__data[2]=K.elements[2],O.__data[3]=0,O.__data[4]=K.elements[3],O.__data[5]=K.elements[4],O.__data[6]=K.elements[5],O.__data[7]=0,O.__data[8]=K.elements[6],O.__data[9]=K.elements[7],O.__data[10]=K.elements[8],O.__data[11]=0):(K.toArray(O.__data,J),J+=ge.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,O.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,x,v,D){let w=y.value,A=x+"_"+v;if(D[A]===void 0)return typeof w=="number"||typeof w=="boolean"?D[A]=w:D[A]=w.clone(),!0;{let B=D[A];if(typeof w=="number"||typeof w=="boolean"){if(B!==w)return D[A]=w,!0}else if(B.equals(w)===!1)return B.copy(w),!0}return!1}function g(y){let x=y.uniforms,v=0,D=16;for(let A=0,B=x.length;A<B;A++){let M=Array.isArray(x[A])?x[A]:[x[A]];for(let E=0,O=M.length;E<O;E++){let L=M[E],H=Array.isArray(L.value)?L.value:[L.value];for(let J=0,Z=H.length;J<Z;J++){let K=H[J],ge=_(K),G=v%D,_e=G%ge.boundary,me=G+_e;v+=_e,me!==0&&D-me<ge.storage&&(v+=D-me),L.__data=new Float32Array(ge.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=ge.storage}}}let w=v%D;return w>0&&(v+=D-w),y.__size=v,y.__cache={},this}function _(y){let x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function m(y){let x=y.target;x.removeEventListener("dispose",m);let v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(let y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var ec=class{constructor(e={}){let{canvas:t=Yd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,y=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,D=!1;this._outputColorSpace=kt;let w=0,A=0,B=null,M=-1,E=null,O=new ft,L=new ft,H=null,J=new Ye(0),Z=0,K=t.width,ge=t.height,G=1,_e=null,me=null,ye=new ft(0,0,K,ge),Re=new ft(0,0,K,ge),Ae=!1,Ne=new ar,He=!1,ie=!1,de=new rt,Te=new k,Le=new ft,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Q=!1;function pe(){return B===null?G:1}let U=n;function ae(R,j){return t.getContext(R,j)}try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ne,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",Me,!1),U===null){let j="webgl2";if(U=ae(j,R),U===null)throw ae(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let P,I,V,se,oe,fe,Se,De,C,b,X,re,ve,he,Y,T,q,te,$,xe,Ie,F,W,N;function S(){P=new ty(U),P.init(),F=new Lx(U,P),I=new $_(U,P,e,F),V=new Ix(U,P),I.reversedDepthBuffer&&d&&V.buffers.depth.setReversed(!0),se=new sy(U),oe=new _x,fe=new Px(U,P,V,oe,I,F,se),Se=new J_(v),De=new ey(v),C=new ug(U),W=new q_(U,C),b=new ny(U,C,se,W),X=new oy(U,b,C,se),$=new ry(U,I,fe),T=new Z_(oe),re=new gx(v,Se,De,P,I,W,T),ve=new Fx(v,oe),he=new xx,Y=new wx(P),te=new X_(v,Se,De,V,X,f,l),q=new Rx(v,X,I),N=new Ox(U,se,I,V),xe=new Y_(U,P,se),Ie=new iy(U,P,se),se.programs=re.programs,v.capabilities=I,v.extensions=P,v.properties=oe,v.renderLists=he,v.shadowMap=q,v.state=V,v.info=se}S();let z=new $u(v,U);this.xr=z,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let R=P.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=P.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(R){R!==void 0&&(G=R,this.setSize(K,ge,!1))},this.getSize=function(R){return R.set(K,ge)},this.setSize=function(R,j,le=!0){if(z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=R,ge=j,t.width=Math.floor(R*G),t.height=Math.floor(j*G),le===!0&&(t.style.width=R+"px",t.style.height=j+"px"),this.setViewport(0,0,R,j)},this.getDrawingBufferSize=function(R){return R.set(K*G,ge*G).floor()},this.setDrawingBufferSize=function(R,j,le){K=R,ge=j,G=le,t.width=Math.floor(R*le),t.height=Math.floor(j*le),this.setViewport(0,0,R,j)},this.getCurrentViewport=function(R){return R.copy(O)},this.getViewport=function(R){return R.copy(ye)},this.setViewport=function(R,j,le,ue){R.isVector4?ye.set(R.x,R.y,R.z,R.w):ye.set(R,j,le,ue),V.viewport(O.copy(ye).multiplyScalar(G).round())},this.getScissor=function(R){return R.copy(Re)},this.setScissor=function(R,j,le,ue){R.isVector4?Re.set(R.x,R.y,R.z,R.w):Re.set(R,j,le,ue),V.scissor(L.copy(Re).multiplyScalar(G).round())},this.getScissorTest=function(){return Ae},this.setScissorTest=function(R){V.setScissorTest(Ae=R)},this.setOpaqueSort=function(R){_e=R},this.setTransparentSort=function(R){me=R},this.getClearColor=function(R){return R.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor(...arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha(...arguments)},this.clear=function(R=!0,j=!0,le=!0){let ue=0;if(R){let ee=!1;if(B!==null){let Pe=B.texture.format;ee=Pe===bl||Pe===vl||Pe===xl}if(ee){let Pe=B.texture.type,Be=Pe===si||Pe===Qi||Pe===pr||Pe===gr||Pe===_l||Pe===yl,Ge=te.getClearColor(),ze=te.getClearAlpha(),$e=Ge.r,Je=Ge.g,Xe=Ge.b;Be?(g[0]=$e,g[1]=Je,g[2]=Xe,g[3]=ze,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=$e,_[1]=Je,_[2]=Xe,_[3]=ze,U.clearBufferiv(U.COLOR,0,_))}else ue|=U.COLOR_BUFFER_BIT}j&&(ue|=U.DEPTH_BUFFER_BIT),le&&(ue|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(ue)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ne,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",Me,!1),te.dispose(),he.dispose(),Y.dispose(),oe.dispose(),Se.dispose(),De.dispose(),X.dispose(),W.dispose(),N.dispose(),re.dispose(),z.dispose(),z.removeEventListener("sessionstart",ci),z.removeEventListener("sessionend",ch),is.stop()};function ne(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;let R=se.autoReset,j=q.enabled,le=q.autoUpdate,ue=q.needsUpdate,ee=q.type;S(),se.autoReset=R,q.enabled=j,q.autoUpdate=le,q.needsUpdate=ue,q.type=ee}function Me(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ce(R){let j=R.target;j.removeEventListener("dispose",ce),Fe(j)}function Fe(R){Ze(R),oe.remove(R)}function Ze(R){let j=oe.get(R).programs;j!==void 0&&(j.forEach(function(le){re.releaseProgram(le)}),R.isShaderMaterial&&re.releaseShaderCache(R))}this.renderBufferDirect=function(R,j,le,ue,ee,Pe){j===null&&(j=Ce);let Be=ee.isMesh&&ee.matrixWorld.determinant()<0,Ge=wp(R,j,le,ue,ee);V.setMaterial(ue,Be);let ze=le.index,$e=1;if(ue.wireframe===!0){if(ze=b.getWireframeAttribute(le),ze===void 0)return;$e=2}let Je=le.drawRange,Xe=le.attributes.position,at=Je.start*$e,vt=(Je.start+Je.count)*$e;Pe!==null&&(at=Math.max(at,Pe.start*$e),vt=Math.min(vt,(Pe.start+Pe.count)*$e)),ze!==null?(at=Math.max(at,0),vt=Math.min(vt,ze.count)):Xe!=null&&(at=Math.max(at,0),vt=Math.min(vt,Xe.count));let Ut=vt-at;if(Ut<0||Ut===1/0)return;W.setup(ee,ue,Ge,le,ze);let wt,Et=xe;if(ze!==null&&(wt=C.get(ze),Et=Ie,Et.setIndex(wt)),ee.isMesh)ue.wireframe===!0?(V.setLineWidth(ue.wireframeLinewidth*pe()),Et.setMode(U.LINES)):Et.setMode(U.TRIANGLES);else if(ee.isLine){let qe=ue.linewidth;qe===void 0&&(qe=1),V.setLineWidth(qe*pe()),ee.isLineSegments?Et.setMode(U.LINES):ee.isLineLoop?Et.setMode(U.LINE_LOOP):Et.setMode(U.LINE_STRIP)}else ee.isPoints?Et.setMode(U.POINTS):ee.isSprite&&Et.setMode(U.TRIANGLES);if(ee.isBatchedMesh)if(ee._multiDrawInstances!==null)er("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Et.renderMultiDrawInstances(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount,ee._multiDrawInstances);else if(P.get("WEBGL_multi_draw"))Et.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else{let qe=ee._multiDrawStarts,Ct=ee._multiDrawCounts,dt=ee._multiDrawCount,Sn=ze?C.get(ze).bytesPerElement:1,Ls=oe.get(ue).currentProgram.getUniforms();for(let wn=0;wn<dt;wn++)Ls.setValue(U,"_gl_DrawID",wn),Et.render(qe[wn]/Sn,Ct[wn])}else if(ee.isInstancedMesh)Et.renderInstances(at,Ut,ee.count);else if(le.isInstancedBufferGeometry){let qe=le._maxInstanceCount!==void 0?le._maxInstanceCount:1/0,Ct=Math.min(le.instanceCount,qe);Et.renderInstances(at,Ut,Ct)}else Et.render(at,Ut)};function _t(R,j,le){R.transparent===!0&&R.side===ut&&R.forceSinglePass===!1?(R.side=mn,R.needsUpdate=!0,$o(R,j,le),R.side=Ai,R.needsUpdate=!0,$o(R,j,le),R.side=ut):$o(R,j,le)}this.compile=function(R,j,le=null){le===null&&(le=R),p=Y.get(le),p.init(j),x.push(p),le.traverseVisible(function(ee){ee.isLight&&ee.layers.test(j.layers)&&(p.pushLight(ee),ee.castShadow&&p.pushShadow(ee))}),R!==le&&R.traverseVisible(function(ee){ee.isLight&&ee.layers.test(j.layers)&&(p.pushLight(ee),ee.castShadow&&p.pushShadow(ee))}),p.setupLights();let ue=new Set;return R.traverse(function(ee){if(!(ee.isMesh||ee.isPoints||ee.isLine||ee.isSprite))return;let Pe=ee.material;if(Pe)if(Array.isArray(Pe))for(let Be=0;Be<Pe.length;Be++){let Ge=Pe[Be];_t(Ge,le,ee),ue.add(Ge)}else _t(Pe,le,ee),ue.add(Pe)}),p=x.pop(),ue},this.compileAsync=function(R,j,le=null){let ue=this.compile(R,j,le);return new Promise(ee=>{function Pe(){if(ue.forEach(function(Be){oe.get(Be).currentProgram.isReady()&&ue.delete(Be)}),ue.size===0){ee(R);return}setTimeout(Pe,10)}P.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let ht=null;function kn(R){ht&&ht(R)}function ci(){is.stop()}function ch(){is.start()}let is=new Af;is.setAnimationLoop(kn),typeof self<"u"&&is.setContext(self),this.setAnimationLoop=function(R){ht=R,z.setAnimationLoop(R),R===null?is.stop():is.start()},z.addEventListener("sessionstart",ci),z.addEventListener("sessionend",ch),this.render=function(R,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),z.enabled===!0&&z.isPresenting===!0&&(z.cameraAutoUpdate===!0&&z.updateCamera(j),j=z.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,j,B),p=Y.get(R,x.length),p.init(j),x.push(p),de.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Ne.setFromProjectionMatrix(de,jn,j.reversedDepth),ie=this.localClippingEnabled,He=T.init(this.clippingPlanes,ie),m=he.get(R,y.length),m.init(),y.push(m),z.enabled===!0&&z.isPresenting===!0){let Pe=v.xr.getDepthSensingMesh();Pe!==null&&gc(Pe,j,-1/0,v.sortObjects)}gc(R,j,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(_e,me),Q=z.enabled===!1||z.isPresenting===!1||z.hasDepthSensing()===!1,Q&&te.addToRenderList(m,R),this.info.render.frame++,He===!0&&T.beginShadows();let le=p.state.shadowsArray;q.render(le,R,j),He===!0&&T.endShadows(),this.info.autoReset===!0&&this.info.reset();let ue=m.opaque,ee=m.transmissive;if(p.setupLights(),j.isArrayCamera){let Pe=j.cameras;if(ee.length>0)for(let Be=0,Ge=Pe.length;Be<Ge;Be++){let ze=Pe[Be];hh(ue,ee,R,ze)}Q&&te.render(R);for(let Be=0,Ge=Pe.length;Be<Ge;Be++){let ze=Pe[Be];uh(m,R,ze,ze.viewport)}}else ee.length>0&&hh(ue,ee,R,j),Q&&te.render(R),uh(m,R,j);B!==null&&A===0&&(fe.updateMultisampleRenderTarget(B),fe.updateRenderTargetMipmap(B)),R.isScene===!0&&R.onAfterRender(v,R,j),W.resetDefaultState(),M=-1,E=null,x.pop(),x.length>0?(p=x[x.length-1],He===!0&&T.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function gc(R,j,le,ue){if(R.visible===!1)return;if(R.layers.test(j.layers)){if(R.isGroup)le=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(j);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Ne.intersectsSprite(R)){ue&&Le.setFromMatrixPosition(R.matrixWorld).applyMatrix4(de);let Be=X.update(R),Ge=R.material;Ge.visible&&m.push(R,Be,Ge,le,Le.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Ne.intersectsObject(R))){let Be=X.update(R),Ge=R.material;if(ue&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Le.copy(R.boundingSphere.center)):(Be.boundingSphere===null&&Be.computeBoundingSphere(),Le.copy(Be.boundingSphere.center)),Le.applyMatrix4(R.matrixWorld).applyMatrix4(de)),Array.isArray(Ge)){let ze=Be.groups;for(let $e=0,Je=ze.length;$e<Je;$e++){let Xe=ze[$e],at=Ge[Xe.materialIndex];at&&at.visible&&m.push(R,Be,at,le,Le.z,Xe)}}else Ge.visible&&m.push(R,Be,Ge,le,Le.z,null)}}let Pe=R.children;for(let Be=0,Ge=Pe.length;Be<Ge;Be++)gc(Pe[Be],j,le,ue)}function uh(R,j,le,ue){let ee=R.opaque,Pe=R.transmissive,Be=R.transparent;p.setupLightsView(le),He===!0&&T.setGlobalState(v.clippingPlanes,le),ue&&V.viewport(O.copy(ue)),ee.length>0&&Yo(ee,j,le),Pe.length>0&&Yo(Pe,j,le),Be.length>0&&Yo(Be,j,le),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function hh(R,j,le,ue){if((le.isScene===!0?le.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ue.id]===void 0&&(p.state.transmissionRenderTarget[ue.id]=new hi(1,1,{generateMipmaps:!0,type:P.has("EXT_color_buffer_half_float")||P.has("EXT_color_buffer_float")?mr:si,minFilter:ji,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ct.workingColorSpace}));let Pe=p.state.transmissionRenderTarget[ue.id],Be=ue.viewport||O;Pe.setSize(Be.z*v.transmissionResolutionScale,Be.w*v.transmissionResolutionScale);let Ge=v.getRenderTarget(),ze=v.getActiveCubeFace(),$e=v.getActiveMipmapLevel();v.setRenderTarget(Pe),v.getClearColor(J),Z=v.getClearAlpha(),Z<1&&v.setClearColor(16777215,.5),v.clear(),Q&&te.render(le);let Je=v.toneMapping;v.toneMapping=Pi;let Xe=ue.viewport;if(ue.viewport!==void 0&&(ue.viewport=void 0),p.setupLightsView(ue),He===!0&&T.setGlobalState(v.clippingPlanes,ue),Yo(R,le,ue),fe.updateMultisampleRenderTarget(Pe),fe.updateRenderTargetMipmap(Pe),P.has("WEBGL_multisampled_render_to_texture")===!1){let at=!1;for(let vt=0,Ut=j.length;vt<Ut;vt++){let wt=j[vt],Et=wt.object,qe=wt.geometry,Ct=wt.material,dt=wt.group;if(Ct.side===ut&&Et.layers.test(ue.layers)){let Sn=Ct.side;Ct.side=mn,Ct.needsUpdate=!0,dh(Et,le,ue,qe,Ct,dt),Ct.side=Sn,Ct.needsUpdate=!0,at=!0}}at===!0&&(fe.updateMultisampleRenderTarget(Pe),fe.updateRenderTargetMipmap(Pe))}v.setRenderTarget(Ge,ze,$e),v.setClearColor(J,Z),Xe!==void 0&&(ue.viewport=Xe),v.toneMapping=Je}function Yo(R,j,le){let ue=j.isScene===!0?j.overrideMaterial:null;for(let ee=0,Pe=R.length;ee<Pe;ee++){let Be=R[ee],Ge=Be.object,ze=Be.geometry,$e=Be.group,Je=Be.material;Je.allowOverride===!0&&ue!==null&&(Je=ue),Ge.layers.test(le.layers)&&dh(Ge,j,le,ze,Je,$e)}}function dh(R,j,le,ue,ee,Pe){R.onBeforeRender(v,j,le,ue,ee,Pe),R.modelViewMatrix.multiplyMatrices(le.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),ee.onBeforeRender(v,j,le,ue,R,Pe),ee.transparent===!0&&ee.side===ut&&ee.forceSinglePass===!1?(ee.side=mn,ee.needsUpdate=!0,v.renderBufferDirect(le,j,ue,ee,R,Pe),ee.side=Ai,ee.needsUpdate=!0,v.renderBufferDirect(le,j,ue,ee,R,Pe),ee.side=ut):v.renderBufferDirect(le,j,ue,ee,R,Pe),R.onAfterRender(v,j,le,ue,ee,Pe)}function $o(R,j,le){j.isScene!==!0&&(j=Ce);let ue=oe.get(R),ee=p.state.lights,Pe=p.state.shadowsArray,Be=ee.state.version,Ge=re.getParameters(R,ee.state,Pe,j,le),ze=re.getProgramCacheKey(Ge),$e=ue.programs;ue.environment=R.isMeshStandardMaterial?j.environment:null,ue.fog=j.fog,ue.envMap=(R.isMeshStandardMaterial?De:Se).get(R.envMap||ue.environment),ue.envMapRotation=ue.environment!==null&&R.envMap===null?j.environmentRotation:R.envMapRotation,$e===void 0&&(R.addEventListener("dispose",ce),$e=new Map,ue.programs=$e);let Je=$e.get(ze);if(Je!==void 0){if(ue.currentProgram===Je&&ue.lightsStateVersion===Be)return ph(R,Ge),Je}else Ge.uniforms=re.getUniforms(R),R.onBeforeCompile(Ge,v),Je=re.acquireProgram(Ge,ze),$e.set(ze,Je),ue.uniforms=Ge.uniforms;let Xe=ue.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Xe.clippingPlanes=T.uniform),ph(R,Ge),ue.needsLights=Ap(R),ue.lightsStateVersion=Be,ue.needsLights&&(Xe.ambientLightColor.value=ee.state.ambient,Xe.lightProbe.value=ee.state.probe,Xe.directionalLights.value=ee.state.directional,Xe.directionalLightShadows.value=ee.state.directionalShadow,Xe.spotLights.value=ee.state.spot,Xe.spotLightShadows.value=ee.state.spotShadow,Xe.rectAreaLights.value=ee.state.rectArea,Xe.ltc_1.value=ee.state.rectAreaLTC1,Xe.ltc_2.value=ee.state.rectAreaLTC2,Xe.pointLights.value=ee.state.point,Xe.pointLightShadows.value=ee.state.pointShadow,Xe.hemisphereLights.value=ee.state.hemi,Xe.directionalShadowMap.value=ee.state.directionalShadowMap,Xe.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,Xe.spotShadowMap.value=ee.state.spotShadowMap,Xe.spotLightMatrix.value=ee.state.spotLightMatrix,Xe.spotLightMap.value=ee.state.spotLightMap,Xe.pointShadowMap.value=ee.state.pointShadowMap,Xe.pointShadowMatrix.value=ee.state.pointShadowMatrix),ue.currentProgram=Je,ue.uniformsList=null,Je}function fh(R){if(R.uniformsList===null){let j=R.currentProgram.getUniforms();R.uniformsList=vr.seqWithValue(j.seq,R.uniforms)}return R.uniformsList}function ph(R,j){let le=oe.get(R);le.outputColorSpace=j.outputColorSpace,le.batching=j.batching,le.batchingColor=j.batchingColor,le.instancing=j.instancing,le.instancingColor=j.instancingColor,le.instancingMorph=j.instancingMorph,le.skinning=j.skinning,le.morphTargets=j.morphTargets,le.morphNormals=j.morphNormals,le.morphColors=j.morphColors,le.morphTargetsCount=j.morphTargetsCount,le.numClippingPlanes=j.numClippingPlanes,le.numIntersection=j.numClipIntersection,le.vertexAlphas=j.vertexAlphas,le.vertexTangents=j.vertexTangents,le.toneMapping=j.toneMapping}function wp(R,j,le,ue,ee){j.isScene!==!0&&(j=Ce),fe.resetTextureUnits();let Pe=j.fog,Be=ue.isMeshStandardMaterial?j.environment:null,Ge=B===null?v.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:ps,ze=(ue.isMeshStandardMaterial?De:Se).get(ue.envMap||Be),$e=ue.vertexColors===!0&&!!le.attributes.color&&le.attributes.color.itemSize===4,Je=!!le.attributes.tangent&&(!!ue.normalMap||ue.anisotropy>0),Xe=!!le.morphAttributes.position,at=!!le.morphAttributes.normal,vt=!!le.morphAttributes.color,Ut=Pi;ue.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(Ut=v.toneMapping);let wt=le.morphAttributes.position||le.morphAttributes.normal||le.morphAttributes.color,Et=wt!==void 0?wt.length:0,qe=oe.get(ue),Ct=p.state.lights;if(He===!0&&(ie===!0||R!==E)){let un=R===E&&ue.id===M;T.setState(ue,R,un)}let dt=!1;ue.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Ct.state.version||qe.outputColorSpace!==Ge||ee.isBatchedMesh&&qe.batching===!1||!ee.isBatchedMesh&&qe.batching===!0||ee.isBatchedMesh&&qe.batchingColor===!0&&ee.colorTexture===null||ee.isBatchedMesh&&qe.batchingColor===!1&&ee.colorTexture!==null||ee.isInstancedMesh&&qe.instancing===!1||!ee.isInstancedMesh&&qe.instancing===!0||ee.isSkinnedMesh&&qe.skinning===!1||!ee.isSkinnedMesh&&qe.skinning===!0||ee.isInstancedMesh&&qe.instancingColor===!0&&ee.instanceColor===null||ee.isInstancedMesh&&qe.instancingColor===!1&&ee.instanceColor!==null||ee.isInstancedMesh&&qe.instancingMorph===!0&&ee.morphTexture===null||ee.isInstancedMesh&&qe.instancingMorph===!1&&ee.morphTexture!==null||qe.envMap!==ze||ue.fog===!0&&qe.fog!==Pe||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==T.numPlanes||qe.numIntersection!==T.numIntersection)||qe.vertexAlphas!==$e||qe.vertexTangents!==Je||qe.morphTargets!==Xe||qe.morphNormals!==at||qe.morphColors!==vt||qe.toneMapping!==Ut||qe.morphTargetsCount!==Et)&&(dt=!0):(dt=!0,qe.__version=ue.version);let Sn=qe.currentProgram;dt===!0&&(Sn=$o(ue,j,ee));let Ls=!1,wn=!1,Rr=!1,It=Sn.getUniforms(),Hn=qe.uniforms;if(V.useProgram(Sn.program)&&(Ls=!0,wn=!0,Rr=!0),ue.id!==M&&(M=ue.id,wn=!0),Ls||E!==R){V.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),It.setValue(U,"projectionMatrix",R.projectionMatrix),It.setValue(U,"viewMatrix",R.matrixWorldInverse);let _n=It.map.cameraPosition;_n!==void 0&&_n.setValue(U,Te.setFromMatrixPosition(R.matrixWorld)),I.logarithmicDepthBuffer&&It.setValue(U,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ue.isMeshPhongMaterial||ue.isMeshToonMaterial||ue.isMeshLambertMaterial||ue.isMeshBasicMaterial||ue.isMeshStandardMaterial||ue.isShaderMaterial)&&It.setValue(U,"isOrthographic",R.isOrthographicCamera===!0),E!==R&&(E=R,wn=!0,Rr=!0)}if(ee.isSkinnedMesh){It.setOptional(U,ee,"bindMatrix"),It.setOptional(U,ee,"bindMatrixInverse");let un=ee.skeleton;un&&(un.boneTexture===null&&un.computeBoneTexture(),It.setValue(U,"boneTexture",un.boneTexture,fe))}ee.isBatchedMesh&&(It.setOptional(U,ee,"batchingTexture"),It.setValue(U,"batchingTexture",ee._matricesTexture,fe),It.setOptional(U,ee,"batchingIdTexture"),It.setValue(U,"batchingIdTexture",ee._indirectTexture,fe),It.setOptional(U,ee,"batchingColorTexture"),ee._colorsTexture!==null&&It.setValue(U,"batchingColorTexture",ee._colorsTexture,fe));let zn=le.morphAttributes;if((zn.position!==void 0||zn.normal!==void 0||zn.color!==void 0)&&$.update(ee,le,Sn),(wn||qe.receiveShadow!==ee.receiveShadow)&&(qe.receiveShadow=ee.receiveShadow,It.setValue(U,"receiveShadow",ee.receiveShadow)),ue.isMeshGouraudMaterial&&ue.envMap!==null&&(Hn.envMap.value=ze,Hn.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),ue.isMeshStandardMaterial&&ue.envMap===null&&j.environment!==null&&(Hn.envMapIntensity.value=j.environmentIntensity),wn&&(It.setValue(U,"toneMappingExposure",v.toneMappingExposure),qe.needsLights&&Tp(Hn,Rr),Pe&&ue.fog===!0&&ve.refreshFogUniforms(Hn,Pe),ve.refreshMaterialUniforms(Hn,ue,G,ge,p.state.transmissionRenderTarget[R.id]),vr.upload(U,fh(qe),Hn,fe)),ue.isShaderMaterial&&ue.uniformsNeedUpdate===!0&&(vr.upload(U,fh(qe),Hn,fe),ue.uniformsNeedUpdate=!1),ue.isSpriteMaterial&&It.setValue(U,"center",ee.center),It.setValue(U,"modelViewMatrix",ee.modelViewMatrix),It.setValue(U,"normalMatrix",ee.normalMatrix),It.setValue(U,"modelMatrix",ee.matrixWorld),ue.isShaderMaterial||ue.isRawShaderMaterial){let un=ue.uniformsGroups;for(let _n=0,_c=un.length;_n<_c;_n++){let ss=un[_n];N.update(ss,Sn),N.bind(ss,Sn)}}return Sn}function Tp(R,j){R.ambientLightColor.needsUpdate=j,R.lightProbe.needsUpdate=j,R.directionalLights.needsUpdate=j,R.directionalLightShadows.needsUpdate=j,R.pointLights.needsUpdate=j,R.pointLightShadows.needsUpdate=j,R.spotLights.needsUpdate=j,R.spotLightShadows.needsUpdate=j,R.rectAreaLights.needsUpdate=j,R.hemisphereLights.needsUpdate=j}function Ap(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(R,j,le){let ue=oe.get(R);ue.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ue.__autoAllocateDepthBuffer===!1&&(ue.__useRenderToTexture=!1),oe.get(R.texture).__webglTexture=j,oe.get(R.depthTexture).__webglTexture=ue.__autoAllocateDepthBuffer?void 0:le,ue.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,j){let le=oe.get(R);le.__webglFramebuffer=j,le.__useDefaultFramebuffer=j===void 0};let Rp=U.createFramebuffer();this.setRenderTarget=function(R,j=0,le=0){B=R,w=j,A=le;let ue=!0,ee=null,Pe=!1,Be=!1;if(R){let ze=oe.get(R);if(ze.__useDefaultFramebuffer!==void 0)V.bindFramebuffer(U.FRAMEBUFFER,null),ue=!1;else if(ze.__webglFramebuffer===void 0)fe.setupRenderTarget(R);else if(ze.__hasExternalTextures)fe.rebindTextures(R,oe.get(R.texture).__webglTexture,oe.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let Xe=R.depthTexture;if(ze.__boundDepthTexture!==Xe){if(Xe!==null&&oe.has(Xe)&&(R.width!==Xe.image.width||R.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(R)}}let $e=R.texture;($e.isData3DTexture||$e.isDataArrayTexture||$e.isCompressedArrayTexture)&&(Be=!0);let Je=oe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Je[j])?ee=Je[j][le]:ee=Je[j],Pe=!0):R.samples>0&&fe.useMultisampledRTT(R)===!1?ee=oe.get(R).__webglMultisampledFramebuffer:Array.isArray(Je)?ee=Je[le]:ee=Je,O.copy(R.viewport),L.copy(R.scissor),H=R.scissorTest}else O.copy(ye).multiplyScalar(G).floor(),L.copy(Re).multiplyScalar(G).floor(),H=Ae;if(le!==0&&(ee=Rp),V.bindFramebuffer(U.FRAMEBUFFER,ee)&&ue&&V.drawBuffers(R,ee),V.viewport(O),V.scissor(L),V.setScissorTest(H),Pe){let ze=oe.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+j,ze.__webglTexture,le)}else if(Be){let ze=j;for(let $e=0;$e<R.textures.length;$e++){let Je=oe.get(R.textures[$e]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+$e,Je.__webglTexture,le,ze)}}else if(R!==null&&le!==0){let ze=oe.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ze.__webglTexture,le)}M=-1},this.readRenderTargetPixels=function(R,j,le,ue,ee,Pe,Be,Ge=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ze=oe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Be!==void 0&&(ze=ze[Be]),ze){V.bindFramebuffer(U.FRAMEBUFFER,ze);try{let $e=R.textures[Ge],Je=$e.format,Xe=$e.type;if(!I.textureFormatReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!I.textureTypeReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=R.width-ue&&le>=0&&le<=R.height-ee&&(R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Ge),U.readPixels(j,le,ue,ee,F.convert(Je),F.convert(Xe),Pe))}finally{let $e=B!==null?oe.get(B).__webglFramebuffer:null;V.bindFramebuffer(U.FRAMEBUFFER,$e)}}},this.readRenderTargetPixelsAsync=async function(R,j,le,ue,ee,Pe,Be,Ge=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ze=oe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Be!==void 0&&(ze=ze[Be]),ze)if(j>=0&&j<=R.width-ue&&le>=0&&le<=R.height-ee){V.bindFramebuffer(U.FRAMEBUFFER,ze);let $e=R.textures[Ge],Je=$e.format,Xe=$e.type;if(!I.textureFormatReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!I.textureTypeReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let at=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,at),U.bufferData(U.PIXEL_PACK_BUFFER,Pe.byteLength,U.STREAM_READ),R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Ge),U.readPixels(j,le,ue,ee,F.convert(Je),F.convert(Xe),0);let vt=B!==null?oe.get(B).__webglFramebuffer:null;V.bindFramebuffer(U.FRAMEBUFFER,vt);let Ut=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await $d(U,Ut,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,at),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Pe),U.deleteBuffer(at),U.deleteSync(Ut),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,j=null,le=0){let ue=Math.pow(2,-le),ee=Math.floor(R.image.width*ue),Pe=Math.floor(R.image.height*ue),Be=j!==null?j.x:0,Ge=j!==null?j.y:0;fe.setTexture2D(R,0),U.copyTexSubImage2D(U.TEXTURE_2D,le,0,0,Be,Ge,ee,Pe),V.unbindTexture()};let Cp=U.createFramebuffer(),Ip=U.createFramebuffer();this.copyTextureToTexture=function(R,j,le=null,ue=null,ee=0,Pe=null){Pe===null&&(ee!==0?(er("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Pe=ee,ee=0):Pe=0);let Be,Ge,ze,$e,Je,Xe,at,vt,Ut,wt=R.isCompressedTexture?R.mipmaps[Pe]:R.image;if(le!==null)Be=le.max.x-le.min.x,Ge=le.max.y-le.min.y,ze=le.isBox3?le.max.z-le.min.z:1,$e=le.min.x,Je=le.min.y,Xe=le.isBox3?le.min.z:0;else{let zn=Math.pow(2,-ee);Be=Math.floor(wt.width*zn),Ge=Math.floor(wt.height*zn),R.isDataArrayTexture?ze=wt.depth:R.isData3DTexture?ze=Math.floor(wt.depth*zn):ze=1,$e=0,Je=0,Xe=0}ue!==null?(at=ue.x,vt=ue.y,Ut=ue.z):(at=0,vt=0,Ut=0);let Et=F.convert(j.format),qe=F.convert(j.type),Ct;j.isData3DTexture?(fe.setTexture3D(j,0),Ct=U.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(fe.setTexture2DArray(j,0),Ct=U.TEXTURE_2D_ARRAY):(fe.setTexture2D(j,0),Ct=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,j.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,j.unpackAlignment);let dt=U.getParameter(U.UNPACK_ROW_LENGTH),Sn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ls=U.getParameter(U.UNPACK_SKIP_PIXELS),wn=U.getParameter(U.UNPACK_SKIP_ROWS),Rr=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,wt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,wt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,$e),U.pixelStorei(U.UNPACK_SKIP_ROWS,Je),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Xe);let It=R.isDataArrayTexture||R.isData3DTexture,Hn=j.isDataArrayTexture||j.isData3DTexture;if(R.isDepthTexture){let zn=oe.get(R),un=oe.get(j),_n=oe.get(zn.__renderTarget),_c=oe.get(un.__renderTarget);V.bindFramebuffer(U.READ_FRAMEBUFFER,_n.__webglFramebuffer),V.bindFramebuffer(U.DRAW_FRAMEBUFFER,_c.__webglFramebuffer);for(let ss=0;ss<ze;ss++)It&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,oe.get(R).__webglTexture,ee,Xe+ss),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,oe.get(j).__webglTexture,Pe,Ut+ss)),U.blitFramebuffer($e,Je,Be,Ge,at,vt,Be,Ge,U.DEPTH_BUFFER_BIT,U.NEAREST);V.bindFramebuffer(U.READ_FRAMEBUFFER,null),V.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(ee!==0||R.isRenderTargetTexture||oe.has(R)){let zn=oe.get(R),un=oe.get(j);V.bindFramebuffer(U.READ_FRAMEBUFFER,Cp),V.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ip);for(let _n=0;_n<ze;_n++)It?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,zn.__webglTexture,ee,Xe+_n):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,zn.__webglTexture,ee),Hn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,un.__webglTexture,Pe,Ut+_n):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,un.__webglTexture,Pe),ee!==0?U.blitFramebuffer($e,Je,Be,Ge,at,vt,Be,Ge,U.COLOR_BUFFER_BIT,U.NEAREST):Hn?U.copyTexSubImage3D(Ct,Pe,at,vt,Ut+_n,$e,Je,Be,Ge):U.copyTexSubImage2D(Ct,Pe,at,vt,$e,Je,Be,Ge);V.bindFramebuffer(U.READ_FRAMEBUFFER,null),V.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Hn?R.isDataTexture||R.isData3DTexture?U.texSubImage3D(Ct,Pe,at,vt,Ut,Be,Ge,ze,Et,qe,wt.data):j.isCompressedArrayTexture?U.compressedTexSubImage3D(Ct,Pe,at,vt,Ut,Be,Ge,ze,Et,wt.data):U.texSubImage3D(Ct,Pe,at,vt,Ut,Be,Ge,ze,Et,qe,wt):R.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Pe,at,vt,Be,Ge,Et,qe,wt.data):R.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Pe,at,vt,wt.width,wt.height,Et,wt.data):U.texSubImage2D(U.TEXTURE_2D,Pe,at,vt,Be,Ge,Et,qe,wt);U.pixelStorei(U.UNPACK_ROW_LENGTH,dt),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Sn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ls),U.pixelStorei(U.UNPACK_SKIP_ROWS,wn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Rr),Pe===0&&j.generateMipmaps&&U.generateMipmap(Ct),V.unbindTexture()},this.initRenderTarget=function(R){oe.get(R).__webglFramebuffer===void 0&&fe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?fe.setTextureCube(R,0):R.isData3DTexture?fe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?fe.setTexture2DArray(R,0):fe.setTexture2D(R,0),V.unbindTexture()},this.resetState=function(){w=0,A=0,B=null,V.reset(),W.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=ct._getUnpackColorSpace()}};var Df=["raw","cut","wet","dry","pressed","trimmed","formed","installed"],mi=["lining_upper","lining_lower"],Ju=()=>Object.fromEntries(mi.map(i=>[i,{glued:[],installed:[]}])),Lf=i=>i.map(e=>({id:e,status:"raw",readyAt:0})),Ku={lining_upper:{id:"frame_inspection",total:3},petal_shaping:{id:"vein_inspection",total:1},light_installation:{id:"connection_inspection",total:3}},Uf=lt.filter(i=>!["petal_cutting","leaf_cutting"].includes(i.id)),Nf=["bamboo_prep","frame_assembly","frame_binding","lining_upper","lining_lower",...Uf.map(i=>i.id).filter(i=>!["bamboo_prep","frame_assembly","frame_binding","frame_short_binding","lining_upper","lining_lower"].includes(i))],Bx=Nf.map(i=>lt.find(e=>e.id===i)).flatMap(i=>Ku[i.id]?[Ku[i.id],i]:[i]),kx=["bamboo_prep","frame_assembly","frame_binding","lining_upper","lining_lower",...lt.filter(i=>!["bamboo_prep","frame_assembly","frame_binding","frame_short_binding","lining_lower","lining_upper"].includes(i.id)).map(i=>i.id)];function Ff(i){return i.processRevision===1||Object.hasOwn(i.counts||{},"frame_short_binding")?i.paperRevision===2?lt:Uf:i.workflowRevision!==1?Bx:(i.paperRevision===2?kx:Nf).map(e=>lt.find(t=>t.id===e))}function Ss(){return{version:2,processRevision:1,paperRevision:2,dyeWaste:0,workflowRevision:1,craftRevision:1,lining:Ju(),stage:0,counts:Object.fromEntries(lt.map(i=>[i.id,0])),papers:Lf(os),leaves:Lf(Ir),complete:!1,lit:!1,actions:0,frameItems:{placedRings:[],usedStrips:[],madeRings:[],shortStrips:[],shortBinding:0}}}function Dn(i){return i.frameItems?.madeRings??Array.from({length:i.counts.bamboo_prep},(e,t)=>t)}function Gn(i){return JSON.parse(JSON.stringify(i))}function pt(i){return lt[Math.min(i.stage,lt.length-1)]}function Fo(i,e=Date.now()){let t=!1;for(let n of[...i.papers,...i.leaves])n.status==="wet"&&e>=n.readyAt&&(n.status="dry",t=!0);return pt(i).id==="paper_drying"&&[...i.papers,...i.leaves].every(n=>n.status==="dry")&&(i.counts.paper_drying=1,i.stage++,t=!0),t}function ju(i,e,t=Date.now(),n=null){if(Fo(i,t),i.complete)return{ok:!1,message:"\u8FD9\u76CF\u706F\u5DF2\u5B8C\u6210\u3002\u53EF\u62C6\u89E3\u67E5\u770B\uFF0C\u6216\u91CD\u65B0\u505A\u4E00\u76CF\u3002"};let s=pt(i),r=i.counts;if(s.id==="paper_drying")return{ok:!1,message:"\u4E24\u79CD\u7EB8\u6599\u90FD\u8981\u5E72\u900F\uFF0C\u8BF7\u7B49\u5F85\u901A\u98CE\u9634\u5E72\u3002"};if(e!==s.tool)return{ok:!1,message:"\u8BF7\u9009\u7528\u5F53\u524D\u5DE5\u5E8F\u9AD8\u4EAE\u63D0\u793A\u7684\u5DE5\u5177\u3002"};if(s.id==="frame_assembly"&&i.frameItems&&i.frameItems.placedRings.length!==3)return{ok:!1,message:"\u5148\u628A\u7269\u54C1\u680F\u4E2D\u7684\u4E09\u53EA\u7AF9\u5708\u653E\u5230\u5BF9\u5E94\u8F6E\u5ED3\u4E0A\u3002"};if(mi.includes(s.id)){let u=n?.panel,h=i.lining?.[s.id];if(!h||!Number.isInteger(u)||u<0||u>=s.total||!h.glued.includes(u))return{ok:!1,message:"\u9700\u8981\u5148\u6D82\u62B9\u6D46\u7CCA"};if(h.installed.includes(u))return{ok:!1,message:"\u8FD9\u5E45\u7EB8\u5DF2\u7ECF\u8D34\u597D\u3002"}}let o,a;if(s.id==="bamboo_prep"&&i.frameItems){if(a=n?.ringType??[0,1,2].find(u=>!Dn(i).includes(u)),!Number.isInteger(a)||a<0||a>2||Dn(i).includes(a))return{ok:!1,message:"\u8BF7\u9009\u62E9\u5C1A\u672A\u5236\u4F5C\u7684\u7AF9\u5708\u7C7B\u578B\u3002"};if(o=n?.strip??Array.from({length:16},(u,h)=>h).find(u=>!i.frameItems.usedStrips.includes(u)),!Number.isInteger(o)||o<0||o>=16||i.frameItems.usedStrips.includes(o))return{ok:!1,message:"\u8FD9\u6839\u7AF9\u6761\u5DF2\u7ECF\u4F7F\u7528\uFF0C\u8BF7\u9009\u62E9\u53F0\u9762\u5269\u4F59\u7AF9\u6761\u3002"}}if(s.id==="frame_short_binding"&&i.frameItems){let u=n?.strip??[16,17,18].find(h=>!i.frameItems.shortStrips.includes(h));if(!Number.isInteger(u)||u<16||u>18||i.frameItems.shortStrips.includes(u))return{ok:!1,message:"\u8BF7\u9009\u62E9\u5C1A\u672A\u4F7F\u7528\u7684\u8F83\u77ED\u7AF9\u7BFE\u3002"};o=u}let l=null;s.id==="paper_cutting"&&(l=[r.paper_cutting<6?i.papers:i.leaves,"raw","cut",r.paper_cutting<6?6:7]),s.id==="paper_dye"&&(l=[i.papers,"cut","wet",6]),s.id==="leaf_dye"&&(l=[i.leaves,"cut","wet",7]),s.id==="petal_pressing"&&(l=[i.papers,"dry","pressed",6]),s.id==="leaf_pressing"&&(l=[i.leaves,"dry","pressed",7]),s.id==="petal_cutting"&&(l=[i.papers,"pressed","trimmed",6]),s.id==="leaf_cutting"&&(l=[i.leaves,"pressed","trimmed",7]),s.id==="petal_shaping"&&(l=[i.papers,"trimmed","formed",6]),s.id==="petal_assembly"&&(l=[i.papers,"formed","installed",1]),["calyx_assembly","lotus_leaf_assembly"].includes(s.id)&&(l=[i.leaves,"trimmed","installed",1]);let c=[];if(l){let[u,h,d,f]=l,g=u.filter(_=>_.status===h).slice(0,f);if(g.length!==f)return{ok:!1,message:"\u672C\u6279\u6750\u6599\u5C1A\u672A\u51C6\u5907\u5B8C\u6210\u3002"};g.forEach(_=>{_.status=d,d==="wet"&&(_.readyAt=t+bt.dryDuration,_.dyeDose=n?.dose??.8,_.dyeDepth=n?.depth??.8)}),c=g.map(_=>_.id)}return s.id==="bamboo_prep"&&o!==void 0&&(i.frameItems.madeRings=[...Dn(i),a],i.frameItems.usedStrips.push(o)),s.id==="frame_short_binding"&&o!==void 0&&(i.frameItems.shortStrips.push(o),i.frameItems.shortBinding++),mi.includes(s.id)&&i.lining[s.id].installed.push(n.panel),r[s.id]++,i.actions++,s.id==="frame_assembly"&&(r.frame_binding=r.frame_assembly),r[s.id]===s.total&&(s.id==="final_inspection"?(i.complete=!0,i.lit=!0):(i.stage++,lt[i.stage]?.automatic&&i.stage++)),{ok:!0,stage:s.id,changedIds:c,message:i.complete?"\u4E00\u76CF\u8377\u82B1\u706F\uFF0C\u6210\u4E86\u3002":s.name+" "+r[s.id]+" / "+s.total}}function Of(i){return Math.round(lt.filter(e=>!e.automatic).reduce((e,t)=>e+i.counts[t.id]/t.total,0)/lt.filter(e=>!e.automatic).length*100)}function ic(i,e="papers"){return Object.fromEntries(Df.map(t=>[t,i[e].filter(n=>n.status===t).length]))}function th(i){let e=(t,n)=>{let s=0;for(let r=0;r<t.length;r+=n){let o=t.slice(r,r+n);o.length===n&&o.every(a=>["wet","dry","pressed"].includes(a.status))&&s++}return s};return{pink:e(i.papers,6),green:e(i.leaves,7)}}function Bf(i){let e=[...i.papers,...i.leaves],t=th(i);return{largeRing:Number(Dn(i).includes(0)&&!i.frameItems.placedRings.includes(0)),mouthRing:Number(Dn(i).includes(1)&&!i.frameItems.placedRings.includes(1)),waistRing:Number(Dn(i).includes(2)&&!i.frameItems.placedRings.includes(2)),cutPaper:e.filter(n=>["cut","trimmed","formed"].includes(n.status)).length,dyedPaper:t.pink+t.green}}function No(i){if(!i||i.workflowRevision!==void 0&&i.workflowRevision!==1||i.processRevision!==void 0&&i.processRevision!==1||i.paperRevision!==void 0&&i.paperRevision!==2||i.paperRevision===2&&(!Number.isInteger(i.dyeWaste)||i.dyeWaste<0))return!1;let e=Ff(i);if(i.version!==2||!Number.isInteger(i.stage)||i.stage<0||i.stage>=e.length||!i.counts||typeof i.complete!="boolean"||typeof i.lit!="boolean"||!Number.isInteger(i.actions)||i.actions<0)return!1;for(let n=0;n<e.length;n++){let s=e[n],r=i.counts[s.id];if(!Number.isInteger(r)||r<0||r>s.total||n<i.stage&&r!==s.total||n>i.stage&&r!==0&&!(i.craftRevision===1&&s.id==="frame_binding")||n===i.stage&&!i.complete&&r===s.total)return!1}if(i.handwork!==void 0){if(!i.handwork||typeof i.handwork!="object"||Array.isArray(i.handwork)||Object.keys(i.handwork).length>300)return!1;for(let[n,s]of Object.entries(i.handwork)){let[r,o]=n.split(":");if(!e.find(l=>l.id===r)||!Number.isInteger(Number(o))||Number(o)<0||Number(o)>=i.counts[r]||!s||!["bend","place","dye","press","shape","trace","bind","inspect","paper"].includes(s.mode)||!Number.isFinite(s.quality)||s.quality<0||s.quality>1||Object.entries(s).some(([l,c])=>["curve","oval","dose","angle","distance"].includes(l)&&!Number.isFinite(c))||s.edgePinched!==void 0&&typeof s.edgePinched!="boolean"||s.wireFixed!==void 0&&typeof s.wireFixed!="boolean")return!1}}let t=i.counts;if(i.craftRevision!==void 0&&i.craftRevision!==1)return!1;if(i.craftRevision===1){if(t.frame_binding!==t.frame_assembly||e[i.stage].automatic||!i.lining)return!1;for(let n of mi){let s=i.lining[n],r=e.findIndex(o=>o.id===n);if(!s||!["glued","installed"].every(o=>Array.isArray(s[o])&&new Set(s[o]).size===s[o].length&&s[o].every(a=>Number.isInteger(a)&&a>=0&&a<6))||s.installed.length!==t[n]||s.installed.some(o=>!s.glued.includes(o))||r>i.stage&&s.glued.length)return!1}}if(i.frameItems!==void 0){let n=i.frameItems;if(n?.madeRings!==void 0&&(!Array.isArray(n.madeRings)||n.madeRings.length!==t.bamboo_prep||new Set(n.madeRings).size!==n.madeRings.length||n.madeRings.some(s=>!Number.isInteger(s)||s<0||s>2))||!n||!Array.isArray(n.placedRings)||!Array.isArray(n.usedStrips)||n.usedStrips.length!==t.bamboo_prep||new Set(n.usedStrips).size!==n.usedStrips.length||n.usedStrips.some(s=>!Number.isInteger(s)||s<0||s>=16)||new Set(n.placedRings).size!==n.placedRings.length||n.placedRings.some(s=>!Number.isInteger(s)||!Dn(i).includes(s))||t.frame_assembly>0&&n.placedRings.length!==3)return!1}if(i.frameItems!==void 0){let n=i.frameItems,s=t.frame_short_binding??0;if(n.shortBinding!==void 0&&(!Number.isInteger(n.shortBinding)||n.shortBinding!==s)||n.shortStrips!==void 0&&(!Array.isArray(n.shortStrips)||n.shortStrips.length!==s||n.shortStrips.some(r=>!Number.isInteger(r)||r<16||r>18)||new Set(n.shortStrips).size!==n.shortStrips.length))return!1}if(i.complete!==(t.final_inspection===1)||i.lit&&!i.complete)return!1;for(let[n,s]of[["papers",os],["leaves",Ir]]){let r=i[n];if(!Array.isArray(r)||r.length!==s.length||!r.every((d,f)=>d&&d.id===s[f]&&Df.includes(d.status)&&Number.isFinite(d.readyAt)&&d.readyAt>=0))return!1;let o=ic(i,n),a=n==="leaves",l=a?Math.max(0,t.paper_cutting-6)*7:Math.min(t.paper_cutting,6)*6,c=t[a?"leaf_dye":"paper_dye"]*(a?7:6),u=t[a?"leaf_pressing":"petal_pressing"]*(a?7:6),h=a?t.calyx_assembly+t.lotus_leaf_assembly:t.petal_assembly;if(r.length-o.raw!==l||l-o.cut!==c||o.pressed+o.trimmed+o.formed+o.installed!==u||o.installed!==h||i.paperRevision===2&&o.trimmed+o.formed+o.installed!==t[a?"leaf_cutting":"petal_cutting"]*(a?7:6)||r.some(d=>["dyeDose","dyeDepth"].some(f=>d[f]!==void 0&&(!Number.isFinite(d[f])||d[f]<0||d[f]>2)))||(a?o.formed!==0:o.formed+o.installed!==t.petal_shaping*6)||t.paper_drying&&(o.raw||o.cut||o.wet))return!1}return!0}function kf(i){if(!i||i.version!==1||!Number.isInteger(i.stage)||i.stage<0||i.stage>10||!i.counts||!Array.isArray(i.papers)||i.papers.length!==36||!i.papers.every((t,n)=>t&&t.id===os[n]&&["raw","wet","dry","formed","installed"].includes(t.status)))return null;let e=Ss();for(let t=0;t<3;t++){let n=lt[t],s=i.counts[n.id];if(!Number.isInteger(s)||s<0||s>n.total||t<i.stage&&s!==n.total||t>i.stage&&s!==0)return null;e.counts[n.id]=s}return e.stage=lt.slice(0,3).findIndex(t=>e.counts[t.id]<t.total),e.stage<0&&(e.stage=3),e.frameItems={placedRings:Array.from({length:e.counts.bamboo_prep},(t,n)=>n),usedStrips:Array.from({length:e.counts.bamboo_prep},(t,n)=>n),madeRings:Array.from({length:e.counts.bamboo_prep},(t,n)=>n),shortStrips:[],shortBinding:0},e.counts.frame_binding=e.counts.frame_assembly,e.counts.frame_short_binding=0,e.stage===2&&(e.stage=e.counts.frame_assembly===12?3:2),e.actions=Object.values(e.counts).reduce((t,n)=>t+n,0),No(e)?e:null}function Hf(){let i=Ss(),e=1e4;for(;!i.complete;){if(pt(i).id==="frame_assembly")for(let t=0;t<3;t++)Qu(i,t);if(pt(i).id==="paper_drying")e+=bt.dryDuration,Fo(i,e);else{let t=pt(i),n=i.counts[t.id];mi.includes(t.id)&&eh(i,t.id,n);let s=ju(i,t.tool,e,mi.includes(t.id)?{panel:n}:null);if(!s.ok)throw new Error(s.message)}}return i.lit=!1,i}function Qu(i,e){return pt(i).id!=="frame_assembly"||!i.frameItems||!Number.isInteger(e)||e<0||!Dn(i).includes(e)||i.frameItems.placedRings.includes(e)?!1:(i.frameItems.placedRings.push(e),i.actions++,!0)}function Hx(i){if(!No(i))return null;let e=Gn(i),t=Ff(i),n=t[e.stage].id,s=Object.hasOwn(e.counts,"frame_short_binding"),r=e.processRevision!==1;for(let{id:a}of Object.values(Ku))if(delete e.counts[a],e.handwork)for(let l of Object.keys(e.handwork))l.split(":")[0]===a&&delete e.handwork[l];if(!s){let a=e.stage>=t.findIndex(l=>l.id==="lining_upper");if(e.counts.frame_short_binding=a?3:0,e.counts.lining_lower<6&&(e.counts.lining_upper=0,e.lining?.lining_upper&&(e.lining.lining_upper=Ju().lining_upper),e.handwork))for(let l of Object.keys(e.handwork))l.startsWith("lining_upper:")&&delete e.handwork[l]}if(e.craftRevision!==1){e.craftRevision=1,e.counts.frame_binding=e.counts.frame_assembly,e.lining=Ju();for(let a of mi){let l=Array.from({length:e.counts[a]},(c,u)=>u);e.lining[a]={glued:[...l],installed:[...l]}}}e.frameItems||(e.frameItems={placedRings:Array.from({length:e.counts.bamboo_prep},(a,l)=>l),usedStrips:Array.from({length:e.counts.bamboo_prep},(a,l)=>l)});let o=e.frameItems;if(o.madeRings??=Array.from({length:e.counts.bamboo_prep},(a,l)=>l),o.shortStrips??=[16,17,18].slice(0,e.counts.frame_short_binding),o.shortBinding??=e.counts.frame_short_binding,r&&e.handwork)for(let[a,l]of Object.entries(e.handwork))a.startsWith("petal_shaping:")&&l.mode==="shape"&&(l.formed??=!0,l.edgePinched??=!0,l.wireFixed??=!0);if(e.paperRevision!==2){let a=t.findIndex(l=>l.id===n)>t.findIndex(l=>l.id==="petal_shaping")||e.counts.petal_shaping>0;if(e.counts.petal_cutting=a?6:0,e.counts.leaf_cutting=a?2:0,a)for(let l of[...e.papers,...e.leaves])l.status==="pressed"&&(l.status="trimmed");e.paperRevision=2,e.dyeWaste=0}return e.processRevision=1,e.workflowRevision=1,e.stage=lt.findIndex(a=>e.counts[a.id]<a.total),e.stage<0&&(e.stage=lt.length-1),e}function nh(i){let e=Hx(i);return No(e)?e:null}function eh(i,e,t){return pt(i).id!==e||!mi.includes(e)||!Number.isInteger(t)||t<0||t>=6||!i.lining||i.lining[e].glued.includes(t)?!1:(i.lining[e].glued.push(t),i.actions++,!0)}var nc=class i{constructor(e=Ss()){this.state=nh(e)||Ss(),this.history=[],this.future=[]}discardDye(){return["paper_dye","leaf_dye"].includes(pt(this.state).id)?(this.history.push(Gn(this.state)),this.future=[],this.state.dyeWaste++,this.state.actions++,!0):!1}glue(e,t){let n=Gn(this.state);return eh(this.state,e,t)?(this.history.push(n),this.future=[],!0):!1}installRing(e){let t=Gn(this.state);return Qu(this.state,e)?(this.history.push(t),this.future=[],!0):!1}act(e,t=Date.now(),n=null){let s=Gn(this.state),r=ju(this.state,e,t,n);return r.ok&&(n&&(this.state.handwork??={},this.state.handwork[r.stage+":"+s.counts[r.stage]]={...n}),this.history.push(s),this.future=[]),r}skipStage(e=Date.now()){if(this.state.complete)return{ok:!1,message:"\u8FD9\u76CF\u706F\u5DF2\u7ECF\u5B8C\u6210\u3002"};let t=Gn(this.state),n=Gn(t),s=pt(n);if(s.id==="paper_drying")Fo(n,Math.max(e,...n.papers.map(r=>r.readyAt||0),...n.leaves.map(r=>r.readyAt||0)));else{if(s.id==="frame_assembly"){for(let r=0;r<3;r++)if(!n.frameItems.placedRings.includes(r)&&!Qu(n,r))return{ok:!1,message:"\u7AF9\u5708\u6750\u6599\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u8DF3\u8FC7\u3002"}}for(;pt(n).id===s.id&&!n.complete;){let r=null;if(mi.includes(s.id)){let a=n.lining[s.id],l=Array.from({length:s.total},(c,u)=>u).find(c=>!a.installed.includes(c));a.glued.includes(l)||eh(n,s.id,l),r={panel:l}}s.id==="frame_short_binding"&&(r={strip:[16,17,18].find(a=>!n.frameItems.shortStrips.includes(a))});let o=ju(n,s.tool,e,r);if(!o.ok)return o}}return n.stage===t.stage&&!n.complete||!No(n)?{ok:!1,message:"\u5F53\u524D\u5DE5\u5E8F\u65E0\u6CD5\u8DF3\u8FC7\uFF0C\u8FDB\u5EA6\u672A\u66F4\u6539\u3002"}:(this.history.push(t),this.future=[],this.state=n,{ok:!0,stage:s.id,message:"\u5DF2\u8DF3\u8FC7\uFF1A"+s.name})}previousStage(e=Date.now()){let t=Gn(this.state);if(t.stage===0)return{ok:!1,message:"\u5DF2\u7ECF\u662F\u7B2C\u4E00\u9053\u5DE5\u5E8F\u3002"};let n=t.complete?t.stage:t.stage-1;for(;lt[n]?.automatic;)n--;let s=new i;for(;s.state.stage<n;){let a=s.skipStage(e);if(!a.ok)return a}let r=s.state;if(r.stage!==n)return{ok:!1,message:"\u65E0\u6CD5\u8FD4\u56DE\u4E0A\u4E00\u9053\u5DE5\u5E8F\uFF0C\u8FDB\u5EA6\u672A\u66F4\u6539\u3002"};n>0&&(r.frameItems.madeRings=[...Dn(t)],r.frameItems.usedStrips=[...t.frameItems.usedStrips],n>lt.findIndex(a=>a.id==="frame_assembly")&&(r.frameItems.placedRings=[...t.frameItems.placedRings]));let o=lt.findIndex(a=>a.id==="frame_short_binding");n>o&&(r.frameItems.shortStrips=[...t.frameItems.shortStrips],r.frameItems.shortBinding=t.frameItems.shortBinding,r.counts.frame_short_binding=t.counts.frame_short_binding);for(let a of mi)lt.findIndex(l=>l.id===a)<n&&(r.lining[a]=Gn(t.lining[a]));for(let a of["papers","leaves"])for(let[l,c]of r[a].entries())if(!["raw","cut"].includes(c.status))for(let u of["dyeDose","dyeDepth"])t[a][l][u]!==void 0&&(c[u]=t[a][l][u]);return t.handwork&&(r.handwork=Object.fromEntries(Object.entries(t.handwork).filter(([a])=>lt.findIndex(l=>l.id===a.split(":")[0])<n))),r.dyeWaste=t.dyeWaste,r.actions=t.actions+1,No(r)?(this.history.push(t),this.future=[],this.state=r,{ok:!0,stage:lt[n].id,message:"\u5DF2\u8FD4\u56DE\uFF1A"+lt[n].name+" \xB7 \u4ECE\u672C\u5DE5\u5E8F\u5F00\u59CB\u91CD\u65B0\u64CD\u4F5C"}):{ok:!1,message:"\u65E0\u6CD5\u8FD4\u56DE\u4E0A\u4E00\u9053\u5DE5\u5E8F\uFF0C\u8FDB\u5EA6\u672A\u66F4\u6539\u3002"}}undo(){return this.history.length?(this.future.push(Gn(this.state)),this.state=this.history.pop(),!0):!1}redo(){return this.future.length?(this.history.push(Gn(this.state)),this.state=this.future.pop(),!0):!1}resetStage(){let e=this.state.stage,t=this.history.findIndex(n=>n.stage===e);return t<0?!1:(this.future=[],this.state=Gn(this.history[t]),this.history=this.history.slice(0,t),!0)}reset(){this.state=Ss(),this.history=[],this.future=[]}};var Un=Math.PI*2,en=(i,e,t)=>new k(i,e,t),ih=i=>.34+.57*Math.sin(Math.min(Math.max(i,0),.6)/.6*Math.PI/2)-.14*Math.max(0,(i-.6)/.5);function sc(i,e,t,n=36,s=!1){let r=new ur(i,s,"centripetal");return new Ue(new Eo(r,n,e,5,s),t)}function Di(i,e,t,n){let s=e.clone().sub(i),r=new Ue(new mt(t,t,s.length(),8),n);return r.position.copy(i).add(e).multiplyScalar(.5),r.quaternion.setFromUnitVectors(en(0,1,0),s.normalize()),r}function gi({length:i=.58,width:e=.37,bulge:t=.12,tip:n=.07,leaf:s=!1,bodyHeight:r=null,bodyRadius:o=0,layerOffset:a=0}={}){let l=[],c=[],u=[],h=[],g=new Ye(s?"#304c2a":bt.colors.petalBase),_=new Ye(s?"#537445":bt.colors.petalMid),m=new Ye(s?"#365D3D":bt.colors.petalTip);for(let y=0;y<=32;y++){let x=y/32,v=Math.pow(Math.sin(Math.PI*x),.75)*(.92+.16*x);for(let D=0;D<=40;D++){let w=D/40*2-1,A=w*e*.5*v,B=x*i,M=Math.cos(w*Math.PI*14)*.0028*Math.pow(Math.sin(Math.PI*x),.55),E=t*Math.sin(x*Math.PI)*(1-w*w*.65)+n*x*x+M+.025*w*w*Math.sin(x*Math.PI);if(r!==null){let L=ih(r+B)+a;E=L-o+.025*Math.sin(x*Math.PI)*(1-w*w)-A*A/(2*L)+M}l.push(A,B,E),u.push(D/40,x);let O=g.clone().lerp(_,Math.sin(x*Math.PI)*.67).lerp(m,Math.pow(x,5)*.65);if(O.multiplyScalar(1+Math.cos(w*Math.PI*14)*.026),c.push(O.r,O.g,O.b),D<40&&y<32){let L=y*41+D,H=L+40+1;h.push(L,H,L+1,L+1,H,H+1)}}}let p=new et;return p.setAttribute("position",new Ke(l,3)),p.setAttribute("color",new Ke(c,3)),p.setAttribute("uv",new Ke(u,2)),p.setIndex(h),p.computeVertexNormals(),p}function zf(){let i=new We;i.name="LotusLanternRoot";let e=new Map,t=new Map,n=new Map,s={},r=new ke({color:bt.colors.bamboo,roughness:.82}),o=new ke({color:bt.colors.binding,roughness:1}),a=new ke({color:"#4f7041",roughness:.88}),l=new ke({color:"#94512e",roughness:.83}),c=new ke({vertexColors:!0,side:ut,roughness:.93,metalness:0,emissive:"#6c294a",emissiveIntensity:0}),u=new ke({vertexColors:!0,side:ut,roughness:.96}),h=new Ft({color:"#efca87",transparent:!0,opacity:.25,depthWrite:!1,wireframe:!0});for(let Q of["BambooFrame","InnerSupport","PetalLayers","BottomCalyx","TopFlowerAssemblies","HangingAssembly","DebugMarkers"])s[Q]=new We,s[Q].name=Q,i.add(s[Q]);function d(Q,pe,U,ae,P,I={}){return Q.name=pe,Q.userData={partId:pe,partType:U,workflowStage:ae,materialId:U==="petal"?"MAT_PETAL_PINK_PURPLE":U.toUpperCase(),targetSocketId:`socket-${pe}`,...I},P.add(Q),Q.traverse(V=>{V.isMesh&&(V.castShadow=!0,V.receiveShadow=!0)}),e.set(pe,Q),t.set(Q.userData.targetSocketId,{partId:pe,position:Q.position.clone(),connections:I.connections||[]}),Q}let f=bt.frame,g=[["big-ring",f.bigRingRadius,f.bigRingHeight],["mouth-ring",f.mouthRingRadius,f.mouthRingHeight],["waist-hoop",f.waistHoopRadius,f.waistHoopHeight]],_=[];g.forEach(([Q,pe,U],ae)=>{let P=new Ue(new Lt(pe,.012,6,72),r);P.rotation.x=Math.PI/2,P.position.y=U,d(P,Q,"ring","bamboo_prep",s.BambooFrame,{order:ae,radius:pe,height:U});let I=new Ue(new Mt(.055,.04,.035),new ke({color:"#f4ecd9",roughness:1}));I.position.set(0,-pe,0),P.add(I),_.push(P)});let m=[],p=[];for(let Q=0;Q<12;Q++){let pe=Q/12*Un,U=[[.32,.03],[f.bigRingRadius,f.bigRingHeight],[f.waistHoopRadius,f.waistHoopHeight],[f.mouthRingRadius,f.mouthRingHeight]].sort((P,I)=>P[1]-I[1]).map(([P,I])=>en(Math.sin(pe)*P,I,Math.cos(pe)*P)),ae=d(sc(U,.009,r),`rib-${Q+1}`,"rib","frame_assembly",s.BambooFrame,{order:Q,connections:g.map(([P])=>P)});m.push(ae);for(let P=0;P<3;P++){let[I,V,se]=g[P],oe=[];for(let Se=0;Se<=44;Se++){let De=Se/44,C=De*Math.PI*8;oe.push(en(Math.cos(C)*.018,(De-.5)*.048,Math.sin(C)*.021))}let fe=new We;fe.add(sc(oe,.0035,o,44)),fe.add(sc([en(.008,.024,0),en(.032,.016,.01),en(.035,-.015,.02)],.003,o,8)),fe.position.set(Math.sin(pe)*V,se,Math.cos(pe)*V),fe.rotation.y=pe,d(fe,`binding-${Q+1}-${I}`,"binding","frame_binding",s.BambooFrame,{order:Q,connections:[I,`rib-${Q+1}`]}),p.push(fe)}}let y={lining_upper:[],lining_lower:[]};for(let[Q,pe,U,ae]of[["lining_upper",.5,1.04,bt.colors.innerLining],["lining_lower",.025,.5,"#eee8d9"]]){let P=new ke({color:ae,side:ut,roughness:.8,transparent:Q==="lining_upper",opacity:Q==="lining_upper"?.78:1});for(let I=0;I<6;I++){let V=Array.from({length:19},(oe,fe)=>{let Se=pe+(U-pe)*fe/18;return new we(ih(Se)-.018,Se)}),se=new Ue(new bo(V,16,I*Un/6,Un/6+.012),P);d(se,Q+"-"+(I+1),"lining",Q,s.InnerSupport,{order:I}),y[Q].push(se)}}let x=new Ue(new mt(.34,.29,.045,32),l);x.position.y=.04,d(x,"base-support","support","frame_assembly",s.InnerSupport);let v=[],D=[];[{y:.52,length:.74,width:.64},{y:.42,length:.72,width:.65},{y:.32,length:.7,width:.66},{y:.22,length:.68,width:.66},{y:.12,length:.65,width:.64},{y:.025,length:.61,width:.62}].map((Q,pe)=>({...Q,r:ih(Q.y)+pe*.018})).forEach((Q,pe)=>{let U=new We;U.name=`Layer_${pe+1}`,s.PetalLayers.add(U),v.push(U);let ae=gi({length:Q.length,width:Q.width,bodyHeight:Q.y,bodyRadius:Q.r,layerOffset:pe*.018,leaf:pe>=4});for(let P=0;P<bt.petals.perLayer;P++){let I=pe*bt.petals.perLayer+P,V=P/bt.petals.perLayer*Un+pe%2*Math.PI/bt.petals.perLayer/2,se=new Ue(ae,c.clone());se.position.set(Math.sin(V)*Q.r,Q.y,Math.cos(V)*Q.r),se.rotation.y=V,pe>=4&&(se.material=u),pe===5&&(se.scale.y=-1),d(se,os[I],"petal","petal_assembly",U,{order:I,layer:pe,paperId:os[I],connections:["lining_upper-1",pe===0?"waist-hoop":pe===1?"big-ring":"base-support"]}),D.push(se)}});let A=[],B=gi({length:.36,width:.51,leaf:!0,bodyHeight:0,bodyRadius:.34,layerOffset:.115});for(let Q=0;Q<12;Q++){let pe=Q/12*Un,U=new Ue(B,u);U.position.set(Math.sin(pe)*.34,0,Math.cos(pe)*.34),U.rotation.y=pe,d(U,`calyx-${Q+1}`,"leaf","calyx_assembly",s.BottomCalyx,{order:Q,connections:["base-support"]}),A.push(U)}let M=[];for(let Q=0;Q<bt.flowerCount;Q++){let pe=new We,U=Q<4,ae=U?Q/4*Un+Math.PI/4:(Q-4)*Math.PI+Math.PI/2,P=en(Math.sin(ae)*.56,U?1.03:.22,Math.cos(ae)*.56),I=en(Math.sin(ae)*(U?.79:1.02),U?1.43:.3,Math.cos(ae)*(U?.79:1.02));pe.add(sc([P,P.clone().add(en(0,.32,0)),I],.026,a,24));let V=new We;V.position.copy(I),V.rotation.z=Q===0?.28:Q===1?-.28:0,pe.add(V),(Q===3||Q===5?[{count:6,length:.34,width:.21,bulge:.12,tip:-.025,tilt:.04}]:[{count:7,length:.4,width:.25,bulge:.045,tip:.06,tilt:1.06},{count:6,length:.34,width:.22,bulge:.06,tip:.03,tilt:.62},{count:5,length:.28,width:.18,bulge:.075,tip:-.025,tilt:.14}]).forEach((Se,De)=>{let C=gi(Se);for(let b=0;b<Se.count;b++){let X=new Ue(C,c),re=b/Se.count*Un+De*.37;X.rotation.order="YXZ",X.rotation.y=re,X.rotation.x=Se.tilt,X.position.set(Math.sin(re)*.024,De*.015,Math.cos(re)*.024),X.name=`top-flower-${Q+1}-whorl-${De+1}-petal-${b+1}`,X.userData={partId:X.name,partType:"flower-petal"},V.add(X)}});let fe=gi({length:.17,width:.14,bulge:.03,tip:.03,leaf:!0});for(let Se=0;Se<5;Se++){let De=new Ue(fe,u);De.rotation.order="YXZ",De.rotation.y=Se/5*Un,De.rotation.x=1.12,De.position.y=-.025,V.add(De)}d(pe,`top-flower-${Q+1}`,"flower","top_flower_assembly",s.TopFlowerAssemblies,{order:Q,tier:U?"upper":"lower",connections:[U?"mouth-ring":"waist-hoop"]}),M.push(pe)}let E=[],O=[];for(let Q=0;Q<bt.podCount;Q++){let pe=new We,U=Q===0?-.58:.58,ae=en(U,1.28,-.45);pe.add(Di(en(U*.6,.55,-.3),ae,.015,a));let P=new Ue(new mt(.12,.055,.1,16),a);P.position.copy(ae),pe.add(P);for(let I=0;I<7;I++){let V=new Ue(new Cn(.018,6,5),l);V.position.set(U+Math.sin(I/7*Un)*.075,1.335,-.45+Math.cos(I/7*Un)*.075),pe.add(V)}d(pe,"lotus-pod-"+(Q+1),"pod","pod_assembly",s.TopFlowerAssemblies,{order:Q,connections:["waist-hoop"]}),E.push(pe)}for(let Q=0;Q<bt.lotusLeafCount;Q++){let pe=new We,U=Q===0?-1:1,ae=en(U*.92,.2,-.38);pe.add(Di(en(U*.3,.04,0),ae,.016,a));let P=[0,0,0],I=[];for(let oe=0;oe<=48;oe++){let fe=oe/48*Un,Se=.31*(1+.045*Math.cos(fe*9));P.push(Math.cos(fe)*Se,.035*Math.sin(fe*7),Math.sin(fe)*Se),oe>0&&I.push(0,oe,oe+1)}let V=new et;V.setAttribute("position",new Ke(P,3)),V.setIndex(I),V.computeVertexNormals();let se=new Ue(V,new ke({color:"#537445",side:ut,roughness:.95}));se.position.copy(ae),pe.add(se);for(let oe=0;oe<12;oe++){let fe=oe/12*Un;pe.add(Di(ae.clone().add(en(0,.004,0)),ae.clone().add(en(Math.cos(fe)*.29,.035*Math.sin(fe*7)+.006,Math.sin(fe)*.29)),.0025,a))}d(pe,"lotus-leaf-"+(Q+1),"lotus-leaf","lotus_leaf_assembly",s.BottomCalyx,{order:Q,connections:["base-support"]}),O.push(pe)}let L=[],H=en(0,2.06,0);for(let Q=0;Q<3;Q++){let pe=Q/3*Un,U=new We,ae=en(Math.sin(pe)*f.mouthRingRadius,1.04,Math.cos(pe)*f.mouthRingRadius);U.add(Di(ae,H,.009,l));let P=new Ue(new Lt(.023,.004,5,12),o);P.position.copy(ae),P.rotation.x=Math.PI/2,U.add(P),d(U,`hanging-support-${Q+1}`,"hanging","hanging_assembly",s.HangingAssembly,{order:Q,connections:["mouth-ring","center-connector"]}),L.push(U)}let J=new Ue(new mt(.025,.035,.11,8),a);J.position.copy(H),d(J,"center-connector","connector","hanging_assembly",s.HangingAssembly);let Z=new Ue(new Lt(.046,.008,6,24,Math.PI*1.7),l);Z.position.set(0,2.17,0),s.HangingAssembly.add(Z);let K=new Ue(new Cn(.055,12,8),new ke({color:"#fff4d6",emissive:"#ffb861",emissiveIntensity:0}));K.position.y=.55,d(K,"led-light","light","light_installation",s.InnerSupport);let ge=new To("#ffb76c",0,3,2);ge.position.y=.7,i.add(ge);let G=null,_e=!1,me=!1,ye=-1,Re=null,Ae=new Set;e.forEach(Q=>n.set(Q,{position:Q.position.clone(),quaternion:Q.quaternion.clone(),scale:Q.scale.clone()}));function Ne(Q){Re=Q;let pe=Q.counts;_.forEach((I,V)=>{I.visible=Q.frameItems?Q.frameItems.placedRings.includes(V):V<pe.bamboo_prep,I.scale.x=1+(Q.handwork?.["bamboo_prep:"+V]?.oval||0)*.3}),m.forEach((I,V)=>I.visible=V<pe.frame_assembly),p.forEach(I=>I.visible=I.userData.order<pe.frame_assembly);for(let[I,V]of Object.entries(y))V.forEach((se,oe)=>se.visible=(Q.lining?.[I]?Q.lining[I].installed.includes(oe):oe<pe[I])&&!me);x.visible=pe.frame_assembly>0,E.forEach((I,V)=>I.visible=V<pe.pod_assembly&&!me),O.forEach((I,V)=>I.visible=V<pe.lotus_leaf_assembly&&!me),D.forEach((I,V)=>{let se=I.userData.layer;I.visible=Q.papers[V].status==="installed"&&!me&&se!==ye;let oe=Math.floor(V/bt.petals.perLayer),fe=Q.handwork?.["petal_shaping:"+oe],Se=Q.handwork?.["paper_dye:"+oe];I.scale.y=(se===5?-1:1)*(fe?1+(fe.curve-.61)*.1:1),I.material.color&&I.material.color.setScalar(Se?1-(Se.dose-.55)*.12:1),"emissiveIntensity"in I.material&&(I.material.emissiveIntensity=Q.lit?.15:0)}),A.forEach((I,V)=>I.visible=V<pe.calyx_assembly&&!me),M.forEach((I,V)=>I.visible=V<pe.top_flower_assembly&&!me),L.forEach((I,V)=>I.visible=V<pe.hanging_assembly),J.visible=Z.visible=pe.hanging_assembly===3,K.visible=pe.light_installation===1,ge.intensity=Q.lit?1.4:0,c.emissiveIntensity=Q.lit?.15:0,K.material.emissiveIntensity=Q.lit?2:0,e.forEach(I=>{(Ae.has(I.userData.partType)||Ae.has(I.name))&&(I.visible=!1)}),G&&(s.DebugMarkers.remove(G),G=null);let U=lt[Q.stage].id,P={bamboo_prep:_,frame_assembly:m,frame_binding:p.filter((I,V)=>V%3===0),...y,petal_assembly:D,calyx_assembly:A,top_flower_assembly:M,pod_assembly:E,lotus_leaf_assembly:O,hanging_assembly:L,light_installation:[K]}[U]?.[pe[U]];P&&!Q.complete&&(G=P.clone(!0),G.position.copy(n.get(P).position),G.visible=!0,G.traverse(I=>{I.isMesh&&(I.material=h)}),s.DebugMarkers.add(G)),He(_e)}function He(Q){_e=Q,e.forEach(pe=>{if(pe.position.copy(n.get(pe).position),Q&&["petal","leaf"].includes(pe.userData.partType)){let U=en(pe.position.x,0,pe.position.z).normalize();pe.position.addScaledVector(U,.25+(pe.userData.layer||0)*.13),pe.position.y+=(pe.userData.layer||0)*.12}})}function ie(Q){me=Q,Re&&Ne(Re)}function de(Q){ye=Q,Re&&Ne(Re)}function Te(Q,pe){pe?Ae.delete(Q):Ae.add(Q),Re&&Ne(Re)}function Le(){me=!1,ye=-1,Ae.clear(),He(!1),Re&&Ne(Re)}function Ce(){let Q=new Set,pe=new Set;i.traverse(U=>{U.geometry&&Q.add(U.geometry),U.material&&pe.add(U.material)}),Q.forEach(U=>U.dispose()),pe.forEach(U=>U.dispose()),h.dispose()}return{root:i,registry:e,sockets:t,groups:s,petals:D,sync:Ne,setExploded:He,setFrame:ie,setLayer:de,setPartVisibility:Te,restore:Le,dispose:Ce,get light(){return ge}}}function rc(){let i=new We;i.name="craft-scissors";let e=new ke({color:"#c4ccd0",metalness:.82,roughness:.27}),t=new ke({color:"#eef1ec",metalness:.9,roughness:.19}),n=new ke({color:"#554635",metalness:.58,roughness:.38}),s=new ke({color:"#b29a64",metalness:.7,roughness:.34}),r=[];for(let l of[-1,1]){let c=new We;c.position.z=l*.004,i.add(c),r.push(c);let u=new Ci;u.moveTo(-.012,-.046),u.lineTo(.016,.007),u.lineTo(.008,.17),u.quadraticCurveTo(.002,.19,-.004,.195),u.lineTo(-.012,.025),u.closePath();let h=new Ue(new vo(u,{depth:.005,bevelEnabled:!0,bevelSize:.0015,bevelThickness:.001,bevelSegments:2,steps:1}),e);h.scale.x=l,h.castShadow=!0,c.add(h);let d=new Ue(new Mt(.002,.155,.001),t);d.position.set(-.009*l,.095,.007),c.add(d);let f=new Ue(new Mt(.014,.075,.009),n);f.position.set(l*.021,-.049,0),f.rotation.z=l*.38,c.add(f);let g=new Ue(new Lt(.036,.006,10,40),n);g.scale.set(1,1.3,1),g.position.set(l*.04,-.118,0),c.add(g)}let o=new Ue(new mt(.015,.015,.021,24),s);o.rotation.x=Math.PI/2,i.add(o);let a=new Ue(new Mt(.016,.002,.002),n);return a.position.z=.012,i.add(a),i.userData.setOpening=l=>{r.forEach((c,u)=>c.rotation.z=(u?1:-1)*(.04+l*.28))},i.userData.setOpening(.65),i}var Bo=Object.freeze([.94,.846,.705]),ws=.012,ko=.004,Ho=Object.freeze([.18,.82]),zx=.965,oc=1.025,Oo=class{constructor(){this.reset()}reset(){this.selected=!1,this.strip=-1,this.curve=0,this.direction=0,this.wrapping=0,this.binding=!1,this.finished=!1}select(e){return this.selected||!Number.isInteger(e)||e<0||e>=16?!1:(this.selected=!0,this.strip=e,!0)}hold(e){this.selected&&!this.binding&&(this.direction=Math.sign(e))}release(){this.direction=0}get ready(){return this.selected&&!this.binding&&this.curve>=zx&&this.curve<=oc}get issue(){return this.curve>oc?"\u5F62\u72B6\u4E0D\u5408\u9002\uFF0C\u8BF7\u6309\u4F4F\u53F3\u952E\u677E\u5F00\u7AF9\u6761\uFF0C\u51CF\u5C0F\u5F2F\u66F2\u5EA6\u3002":this.ready?"\u4E24\u7AEF\u5DF2\u5408\u62E2\uFF0C\u53EF\u4EE5\u786E\u8BA4\u56FA\u5B9A\u3002":"\u6309\u4F4F\u5DE6\u952E\u5411\u5185\u5F2F\u66F2\uFF1B\u6309\u4F4F\u53F3\u952E\u653E\u677E\u56DE\u5F39\u3002"}confirm(){return!this.ready||this.direction?!1:(this.binding=!0,!0)}tick(e){e=Math.min(.05,Math.max(0,e)),this.binding?(this.wrapping=Math.min(1,this.wrapping+e/1.4),this.finished=this.wrapping===1):this.selected&&(this.curve=Math.max(0,Math.min(1.2,this.curve+this.direction*e*.5)))}evidence(){return{mode:"bend",quality:Math.max(0,1-Math.abs(this.curve-1)*8),curve:this.curve,oval:0,dose:0,angle:0,distance:2.3,strip:this.strip}}};var Vf=["paper_cutting","paper_dye","leaf_dye","petal_pressing","leaf_pressing","petal_cutting","leaf_cutting"],Ot=(i,e=0,t=1)=>Math.max(e,Math.min(t,i)),zo=(i,e)=>Math.hypot(i.x-e.x,i.y-e.y);function sh(i="square"){if(i==="square"){let e=[[-.31,.31],[.31,.31],[.31,-.31],[-.31,-.31],[-.31,.31]],t=[];for(let n=0;n<4;n++)for(let s=0;s<16;s++)t.push({x:e[n][0]+(e[n+1][0]-e[n][0])*s/16,y:e[n][1]+(e[n+1][1]-e[n][1])*s/16});return[...t,{...t[0]}]}return Array.from({length:81},(e,t)=>{let n=t<=40?t/40:(80-t)/40;return{x:(t<=40?1:-1)*.245*Math.sin(Math.PI*n)*(i==="leaf"?.92:1.15-.35*n),y:.32-.64*n}})}var es=Object.freeze({start:.12,edge:.11,checkpoint:.1,maxStep:.35,sampleStep:.02}),ac=class{constructor(e){this.points=sh(e),this.reset()}reset(){this.next=0,this.dragging=!1,this.failed=!1,this.ready=!1,this.last=null,this.onTrack=!1}down(e){return this.ready||zo(e,this.points[Math.min(this.next,this.points.length-1)])>es.start?!1:(this.dragging=!0,this.last={...e},this.move(e),!0)}move(e){if(!this.dragging)return!1;if(!this.points.some((o,a)=>{let l=this.points[a+1]||o,c=l.x-o.x,u=l.y-o.y,h=Ot(((e.x-o.x)*c+(e.y-o.y)*u)/(c*c+u*u||1));return zo(e,{x:o.x+h*c,y:o.y+h*u})<=(this.next<=1?es.start:es.edge)}))return this.onTrack=!1,this.last=null,!1;let n=this.last,s=n?zo(e,n):0;if(!n||s>es.maxStep)return this.last=null,this.advance(e);let r=Math.max(1,Math.ceil(s/es.sampleStep));for(let o=1;o<=r&&this.dragging;o++){let a={x:n.x+(e.x-n.x)*o/r,y:n.y+(e.y-n.y)*o/r};if(!this.advance(a))return this.last=null,!1}return this.last={...e},this.onTrack}advance(e){let t=this.points[Math.max(0,this.next-1)],n=this.points[this.next];if(!n)return!1;let s=n.x-t.x,r=n.y-t.y,o=s*s+r*r,a=Ot(((e.x-t.x)*s+(e.y-t.y)*r)/(o||1));if(this.onTrack=zo(e,{x:t.x+a*s,y:t.y+a*r})<=(this.next<=1?es.start:es.edge),!this.onTrack)return!1;for(;this.next<this.points.length&&zo(e,this.points[this.next])<=es.checkpoint;)this.next++;return this.next>=this.points.length&&(this.ready=!0,this.dragging=!1),this.last={...e},!0}up(){this.dragging=!1,this.onTrack=!1,this.last=null}},Vx=20,lc=class{constructor(){this.reset()}reset(){this.phase="stock",this.dose=0,this.depth=0,this.targetDepth=0,this.maxDepth=0,this.lift=0,this.seconds=0}take(){return this.phase!=="stock"?!1:(this.phase="held",!0)}immerse(e=.8){return!["held","review"].includes(this.phase)||e<=0?!1:(this.targetDepth=Ot(e,0,.92),this.phase="dipping",!0)}release(){}liftOut(){return this.phase!=="dipping"?!1:(this.phase="lifting",this.lift=0,!0)}tick(e){e=Ot(e,0,.05),this.phase==="dipping"&&(this.seconds+=e,this.depth+=Math.sign(this.targetDepth-this.depth)*Math.min(Math.abs(this.targetDepth-this.depth),e*1.2),this.maxDepth=Math.max(this.maxDepth,this.depth),this.dose=Ot(this.simulatedSeconds/120,0,1.8)),this.phase==="lifting"&&(this.lift=Ot(this.lift+e/1.05),this.lift===1&&(this.phase="review"))}get simulatedSeconds(){return this.seconds*Vx}get ready(){return this.phase==="review"&&this.simulatedSeconds>=60&&this.simulatedSeconds<=120}},cc=class{constructor(){this.phase="idle",this.progress=0,this.rotation=0}start(){return this.phase!=="idle"?!1:(this.phase="running",!0)}tick(e){this.phase==="running"&&(e=Ot(e,0,.05),this.progress=Ot(this.progress+e/5.5),this.rotation=this.progress*Math.PI*12,this.progress===1&&(this.phase="done"))}};function Vo(i,{leaf:e=!1,dose:t=.8,depth:n=.8}={}){let s=i.attributes.position,r=i.attributes.uv,o=new Float32Array(s.count*3),a=new Ye("#f5efe4"),l=new Ye(e?"#397444":"#ab326d");for(let c=0;c<s.count;c++){let u=r?r.getY(c):(s.getY(c)+.36)/.72,h=Ot((n-u)/.2),d=Ot(t/.9)*h*(.38+.62*Math.pow(1-u,1.15)),f=a.clone().lerp(l,d);o.set([f.r,f.g,f.b],c*3)}i.setAttribute("color",new Nt(o,3))}function Wn(i={},e="square",t=.72){let n;if(e==="square")n=new sn(t,t,28,36);else{let r=sh(e),o=new Ci(r.map(c=>new we(c.x,c.y)));n=new Mo(o,32);let a=n.attributes.position,l=[];for(let c=0;c<a.count;c++)l.push((a.getX(c)+.36)/.72,(a.getY(c)+.36)/.72);n.setAttribute("uv",new Ke(l,2))}Vo(n,i);let s=new Ue(n,new ke({vertexColors:!0,side:ut,roughness:.94}));return s.castShadow=!0,s.receiveShadow=!0,s}function Go(i,e=!1,t=!1){let n=new We;n.name=t?"square-embossed-veins":"cut-paper-veins",i.add(n);for(let s=-4;s<=4;s++){let r=Array.from({length:28},(a,l)=>{let c=l/27;return new k(t?s*.068+.012*Math.sin(Math.PI*c):s*.032*Math.sin(Math.PI*c),t?-.345+.69*c:-.3+.6*c,.0025)}),o=new vn(new et().setFromPoints(r),new xn({color:e?"#56724c":"#975a79",transparent:!0,opacity:.58}));n.add(o)}return n}function uc(){let i=new We,e=[],t=new ke({color:"#715237",roughness:.9}),n=new ke({color:"#ada58b",metalness:.5,roughness:.42});function s(l,c,u,h,d,f,g=t){let _=new Ue(new Mt(l,c,u),g);return _.position.set(h,d,f),i.add(_),_.castShadow=!0,_}s(.78,.055,.55,0,.028,0);for(let l of[-.34,.34])s(.07,.48,.16,l,.26,0);for(let l of[.22,.4]){let c=new We;c.position.y=l,i.add(c);let u=new Ue(new mt(.09,.09,.62,36),n);u.rotation.z=Math.PI/2,c.add(u);let h=s(.61,.006,.008,0,0,0);i.remove(h),c.add(h),h.position.set(0,.09,0),e.push(c)}let r=Array.from({length:601},(l,c)=>{let u=c/600,h=u*Math.PI*28;return new k(-.29+u*.58,Math.cos(h)*.095,Math.sin(h)*.095)}),o=new vn(new et().setFromPoints(r),new xn({color:"#e7d3a6"}));i.add(o),o.position.y=.4,o.geometry.setDrawRange(0,0);let a=new vn(new et().setFromPoints([new k(-.3,.4,.095),new k(-.3,.08,.48)]),new xn({color:"#e7d3a6"}));return i.add(a),i.userData.machine=!0,{root:i,rollers:e,winding:o,supply:a,update(l,c){e[0].rotation.x=c,e[1].rotation.x=-c,o.rotation.x=-c,o.geometry.setDrawRange(0,Math.floor(l*601));let u=a.geometry.attributes.position;u.setXYZ(1,-.3,.4-.32*(1-l),.095+.385*(1-l)),u.needsUpdate=!0,a.visible=l<1}}}var Nn=(i,e,t)=>new k(i,e,t);function Gf(i){let e=document.createElement("canvas");e.width=e.height=512;let t=e.getContext("2d");if(i==="wood"){t.fillStyle="#76533b",t.fillRect(0,0,512,512);for(let s=0;s<450;s++){let r=s/450*512;t.strokeStyle=`rgba(${s%2?35:180},${s%2?22:133},${s%2?16:90},${.08+s%7*.018})`,t.lineWidth=.5+s%3,t.beginPath(),t.moveTo(0,r);for(let o=0;o<=512;o+=16)t.lineTo(o,r+Math.sin(o*.02+s*.7)*2.5);t.stroke()}for(let s=0;s<4;s++)t.fillStyle="rgba(20,10,5,.25)",t.fillRect(0,s*128,512,2)}else{t.fillStyle="#d8c7a7",t.fillRect(0,0,512,512);for(let s=0;s<3500;s++){let r=s*137.37%512,o=s*71.93%512;t.fillStyle=s%2?"rgba(100,75,42,.06)":"rgba(255,255,245,.13)",t.fillRect(r,o,1+s%3,1)}}let n=new Zi(e);return n.colorSpace=kt,n.wrapS=n.wrapT=Ks,n}function Wf(i){let e=new We;e.name="WorkshopEnvironment",i.add(e);let t=Gf("wood"),n=Gf("paper"),s=new ke({map:t,color:"#b18a65",roughness:.86}),r=new ke({map:t,color:"#614735",roughness:.92}),o=new ke({map:n,color:"#e0d4bd",roughness:1}),a=new ke({color:"#a99877",roughness:1}),l=new ke({color:"#624e35",metalness:.25,roughness:.75}),c=new ke({color:"#b6b185",roughness:.92}),u=new ke({color:"#b9c5b8",roughness:.35}),h=new ke({color:"#ba80b7",roughness:.93,side:ut}),d=new ke({color:"#f0e8df",roughness:.97,side:ut}),f=new ke({color:"#567a49",roughness:.95,side:ut}),g=[],_={},m=[];function p(P,I,V,se,oe,fe,Se,De=e){let C=new Ue(new Mt(P,I,V),se);return C.position.set(oe,fe,Se),C.castShadow=!0,C.receiveShadow=!0,De.add(C),C}function y(P,I,V,se,oe,fe,Se,De=e){let C=new Ue(new mt(P,I,V,24),se);return C.position.set(oe,fe,Se),C.castShadow=!0,C.receiveShadow=!0,De.add(C),C}function x(P,I,V,se){p(V,.13,se,s,P,.92,I),p(V-.12,.18,.1,r,P,.72,I+se/2-.1);for(let oe of[-1,1])for(let fe of[-1,1])p(.12,.86,.12,r,P+oe*(V/2-.16),.43,I+fe*(se/2-.14));g.push({x:P,z:I,hx:V/2+.18,hz:se/2+.18})}function v(P,I,V,se,oe=1.4){let fe=document.createElement("canvas");fe.width=512,fe.height=128;let Se=fe.getContext("2d");Se.fillStyle="#e6d8ba",Se.fillRect(0,0,512,128),Se.strokeStyle="#897657",Se.lineWidth=2,Se.strokeRect(7,7,498,114),Se.fillStyle="#45392c",Se.font='52px "KaiTi", "SimSun", serif',Se.textAlign="center",Se.textBaseline="middle",Se.fillText(P,256,66);let De=new Zi(fe);De.colorSpace=kt;let C=new Ue(new sn(oe,oe/4),new Ft({map:De}));return C.position.set(I,V,se),e.add(C),C}p(14,.15,12,new ke({color:"#a5a18e",roughness:.97}),0,-.1,0);for(let P=-7;P<7;P++)for(let I=-6;I<6;I++){let V=new Ye("#b0ac97").multiplyScalar(.94+(P*7+I*3+30)%5*.025);p(.987,.015,.987,new ke({color:V,roughness:1}),P+.5,-.012,I+.5)}p(14,4.7,.18,o,0,2.3,-5),p(.18,4.7,11,o,-6,2.3,0),p(.18,4.7,11,o,6,2.3,0);for(let P of[-5.5,-2.8,0,2.8,5.5])p(.18,4.5,.2,r,P,2.2,-4.75),p(.17,.22,10,r,P,4.35,0);p(11.5,.24,.24,r,0,3.3,-4.7),p(12,.22,.22,r,0,4.3,2.7);for(let P of[-3.7,3.7]){p(2.15,2.15,.1,new ke({color:"#efe4cb",emissive:"#e6cfa4",emissiveIntensity:.3,roughness:1}),P,2.16,-4.86);for(let I=0;I<7;I++)p(.035,2.2,.12,r,P-1.1+I*.366,2.16,-4.76);for(let I=0;I<5;I++)p(2.2,.035,.12,r,P,1.06+I*.55,-4.75)}v("\u79E6 \u6DEE \u706F \u4F5C",0,3.72,-4.63,2.4),v("\u4E00 \u7BFE \u4E00 \u7EB8 \xB7 \u4E00 \u76CF \u5FC3 \u706F",0,3.15,-4.63,2.2);for(let P of[.6,1.3,2])p(2.1,.08,.5,s,-.05,P,-4.5);for(let P=0;P<8;P++){let I=new Ue(new Lt(.21+P%3*.055,.008,5,40),c);I.position.set(-1.25+P%4*.8,2.4+Math.floor(P/4)*.35,-4.64),e.add(I)}for(let P=0;P<6;P++)y(.12,.1,.28,u,-.9+P*.35,.78,-4.5);x(0,0,3.2,1.95),p(2.48,.013,1.52,a,0,.997,0);let D=y(.82,.85,.055,r,0,1.04,0);x(-3.55,-1.35,2.15,1.5),x(3.55,-1.35,2.15,1.5),x(3.55,1.6,2.15,1.55);function w(P,I,V,se,oe,fe){let Se=new Ue(new Mt(P==="assembly"?3:2.05,1.65,P==="assembly"?1.9:1.45),new Ft({visible:!1}));Se.position.set(V,1.45,se),Se.userData.station=P,e.add(Se);let De=v(I,V,.82,se+.8,P==="assembly"?1.05:.82);_[P]={id:P,name:I,x:V,z:se,trigger:Se,label:De,position:Nn(...oe),look:Nn(...fe)}}w("assembly","\u53C1 \xB7 \u5408\u706F\u53F0",0,0,[0,1.82,2.85],[0,1.67,0]),w("bamboo","\u58F9 \xB7 \u624E\u67B6\u53F0",-3.55,-1.35,[-3.55,1.72,.65],[-3.55,1.08,-1.35]),w("dye","\u8D30 \xB7 \u67D3\u7EB8\u53F0",3.55,-1.35,[3.55,1.72,.65],[3.55,1.08,-1.35]),w("press","\u8D30 \xB7 \u538B\u74E3\u53F0",3.55,1.6,[3.55,1.72,3.65],[3.55,1.1,1.6]);let A=[];for(let P=0;P<16;P++){let I=p(ws,ko,Bo[0],c.clone(),-4.22+P*.055,1.02,-1.4);I.userData.stockIndex=P,A.push(I)}for(let P=0;P<3;P++){let I=p(ws,ko,.42,c.clone(),-4.22+P*.055,1.065,-1.02);I.userData.stockIndex=16+P,I.userData.lengthType="short",I.userData.lengthCm=42,A.push(I)}for(let P=0;P<3;P++){let I=new Ue(new Lt(.23+P*.055,.008,5,48),c);I.rotation.x=-Math.PI/2,I.position.set(-3.02,1.025+P*.017,-1.3),e.add(I)}y(.095,.095,.18,r,-3.45,1.1,-.95),y(.077,.077,.12,new ke({color:"#e4dccb",roughness:1}),-3.45,1.1,-.95);let B=[Nn(3.23,1.34,-1.08),Nn(3.89,1.34,-1.08)];for(let P=0;P<2;P++){let I=B[P];y(.29,.25,.34,u,I.x,1.17,I.z),y(.255,.255,.008,new ke({color:P?"#52794b":"#a86d9a",roughness:.25}),I.x,I.y,I.z)}for(let P of[2.7,4.4])p(.035,.97,.035,c,P,1.48,-1.97),p(.24,.03,.22,r,P,1.015,-1.97);e.add(Di(Nn(2.7,1.96,-1.97),Nn(4.4,1.96,-1.97),.017,c)),v("\u901A \u98CE \u9634 \u5E72 \u67B6",3.55,2.1,-1.98,.72);let M=Array.from({length:8},(P,I)=>Nn(2.9+I%4*.43,1.75-Math.floor(I/4)*.46,-1.96));e.add(Di(Nn(2.7,1.5,-1.97),Nn(4.4,1.5,-1.97),.012,c));let E=[];for(let P=0;P<36;P++){let I=Wn({dose:0});I.name="rack-petal-"+P,I.scale.setScalar(.56),I.position.copy(M[Math.floor(P/6)]),e.add(I),m.push(I)}for(let P=0;P<Ir.length;P++){let I=Wn({leaf:!0,dose:0});I.name="rack-leaf-"+P,I.scale.setScalar(.56),I.position.copy(M[6+Math.floor(P/7)]),e.add(I),E.push(I)}for(let P of M)p(.025,.04,.03,r,P.x,P.y+.21,P.z);let O=uc(),L=O.root;e.add(L),L.position.set(3.08,1,1.42);let H=!1,J=new Ue(gi(),new ke({vertexColors:!0,side:ut,roughness:.95}));J.rotation.x=-Math.PI/2,J.position.set(4.04,1.02,1.94),e.add(J);let Z=new ke({color:"#b97342",metalness:.5,roughness:.4});for(let P=0;P<8;P++){let I=new Ue(new Lt(.065,.004,5,24),Z);I.position.set(4.39,1.04+P*.009,1.12),I.rotation.x=Math.PI/2,e.add(I)}let K=new Ue(gi({leaf:!0,length:.36,width:.27}),new ke({vertexColors:!0,side:ut}));K.position.set(4.12,1.025,1.45),K.rotation.x=-Math.PI/2,e.add(K);let ge=gi({bulge:.18,tip:-.06}),G=gi({bulge:.015,tip:0}),_e=[],me=[];for(let P=0;P<6;P++){let I=new We;I.position.set(3.18+P%3*.25,1.04,1.26+Math.floor(P/3)*.23);for(let V=0;V<6;V++){let se=new Ue(gi({length:.18,width:.12,bulge:.035}),J.material);se.rotation.order="YXZ",se.rotation.y=V/6*Math.PI*2,se.rotation.x=.65,I.add(se)}e.add(I),_e.push(I)}for(let P=0;P<2;P++){let I=new Ue(new mt(.09,.04,.07,12),f);I.position.set(4.1,1.065,1.3+P*.25),e.add(I),me.push(I)}for(let[P,I]of[[-1.15,.48],[1.15,.4]])y(.11,.08,.17,u,P,1.1,I),e.add(Di(Nn(P,1.1,I),Nn(P+.03,1.45,I+.05),.009,c));for(let P=0;P<5;P++){let I=new Ue(new sn(.38,.45),d);I.rotation.x=-Math.PI/2,I.rotation.z=P*.06,I.position.set(-1.03,1.012+P*.002,-.18),e.add(I)}let ye=rc();ye.rotation.x=-Math.PI/2,ye.position.set(1.15,1.03,-.05),e.add(ye);let Re=new We;Re.name="dye-square-stock",Re.position.set(2.83,1.025,-1.63),e.add(Re);let Ae=new Ue(new Mt(.53,.025,.48),c);Ae.position.y=-.01,Re.add(Ae);for(let P=0;P<8;P++){let I=Wn({dose:0},"square",.39);I.rotation.x=-Math.PI/2,I.rotation.z=(P%3-1)*.025,I.position.set(P%2*.006,.008+P*.004,0),Re.add(I)}let Ne=new We;Ne.name="dye-waste-bin",Ne.position.set(4.39,1.16,-.73),e.add(Ne);let He=new Ue(new mt(.13,.105,.25,20,1,!0),new ke({color:"#5c5543",side:ut}));Ne.add(He);let ie=new Ue(new mt(.105,.105,.015,20),new ke({color:"#322d25"}));ie.position.y=-.12,Ne.add(ie),e.add(Di(Nn(4.43,1.045,-1.4),Nn(4.43,1.045,-1.76),.012,c)),p(.045,.025,.085,d,4.43,1.045,-1.79),i.add(new wo("#fff0d4","#776450",2.1));let de=new fr("#ffedcf",3);de.position.set(-3,7,4),de.castShadow=!0,de.shadow.mapSize.set(2048,2048),Object.assign(de.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:22}),de.shadow.bias=-6e-4,de.shadow.normalBias=.025,i.add(de);let Te=new fr("#d6e6ed",1.4);Te.position.set(5,4,0),i.add(Te),i.background=new Ye("#d3c6af"),i.fog=new to("#d3c6af",12,26);let Le=new et,Ce=[];for(let P=0;P<90;P++)Ce.push(Math.sin(P*79)*5,1+P%31*.1,Math.cos(P*31)*4);Le.setAttribute("position",new Ke(Ce,3));let Q=new ao(Le,new lr({color:"#fff4db",size:.014,transparent:!0,opacity:.3,depthWrite:!1}));e.add(Q);function pe(P){let I=[...P.frameItems?.usedStrips??Array.from({length:P.counts.bamboo_prep},(V,se)=>se),...P.frameItems?.shortStrips??[]];A.forEach((V,se)=>V.visible=!I.includes(V.userData.stockIndex??se));for(let[V,se,oe,fe]of[[P.papers,m,6,!1],[P.leaves,E,7,!0]])V.forEach((Se,De)=>{let C=se[De];C.userData.paperId=Se.id,C.userData.status=Se.status,C.visible=De%oe===0&&["wet","dry"].includes(Se.status);let b=[Se.dyeDose,Se.dyeDepth].join(":");C.userData.profile!==b&&(Vo(C.geometry,{leaf:fe,dose:Se.dyeDose??.8,depth:Se.dyeDepth??.8}),C.userData.profile=b)});J.visible=!H&&P.counts.petal_cutting>0&&P.counts.petal_assembly<36,J.geometry=P.counts.petal_shaping>0?ge:G,K.visible=!H&&P.counts.leaf_cutting>0&&P.counts.lotus_leaf_assembly<2,_e.forEach((V,se)=>V.visible=se<P.counts.flower_making&&se>=P.counts.top_flower_assembly),me.forEach((V,se)=>V.visible=se<P.counts.pod_making&&se>=P.counts.pod_assembly)}function U(P){Q.rotation.y=Math.sin(P*.07)*.03}function ae(P){H=P,L.visible=!P,P&&(J.visible=!1,K.visible=!1)}return{world:e,stations:_,collisions:g,sync:pe,animate:U,turntable:D,bambooStock:A,paperStock:Re,dyeBin:Ne,bathPositions:B,rackPositions:M,setPaperFocus:ae,paperMeshes:m,leafPaperMeshes:E}}var Xf="qinhuai-lotus-workshop-audio-v1",Gx=Object.freeze({bamboo_prep:"bamboo",frame_assembly:"wood",frame_binding:"binding",lining_upper:"lining",lining_lower:"lining",paper_cutting:"cut",paper_dye:"water",leaf_dye:"water",paper_drying:"dry_ready",petal_pressing:"press",leaf_pressing:"press",petal_shaping:"shape",petal_assembly:"paste",calyx_assembly:"paste",flower_making:"paper",top_flower_assembly:"assemble",pod_making:"paper",pod_assembly:"assemble",lotus_leaf_assembly:"paper",hanging_assembly:"binding",light_installation:"switch",final_inspection:"complete"}),gn=(i,e,t,n,s=0)=>({kind:"tone",hz:i,end:e,duration:t,gain:n,offset:s}),$t=(i,e,t,n=0,s=.65)=>({kind:"noise",hz:i,duration:e,gain:t,offset:n,q:s}),bn=(i=0,e=1)=>[gn(310,240,.1,.2*e,i),gn(740,670,.055,.065*e,i),$t(1200,.035,.1*e,i)],ts=(i=0,e=1)=>[$t(2200,.18,.22*e,i),$t(3400,.11,.15*e,i+.12)],ns=(i,e=0,t=1)=>[gn(i,i,.65,.12*t,e),gn(i*2.76,i*2.76,.24,.025*t,e)],qf=Object.freeze({bamboo:[$t(1250,.28,.21,0,2.4),gn(370,275,.19,.035,.02),...bn(.24,.65)],wood:bn(),binding:[$t(1800,.16,.24,0,1.4),$t(2300,.18,.17,.14,1.1),...bn(.3,.22)],lining:[...ts(0,.85),$t(750,.29,.25,.12)],cut:[$t(4200,.055,.28),gn(2100,1300,.035,.035),$t(3600,.065,.23,.14),...ts(.19,.4)],water:[$t(650,.42,.25,0,.8),gn(590,210,.095,.15,.04),gn(780,300,.075,.1,.15),gn(440,165,.11,.12,.28),$t(1800,.17,.07,.31)],dry_ready:[...ts(0,.4),...ns(880,.08,.5)],press:[...bn(0,.8),$t(650,.32,.24,.05,1.7),$t(1850,.24,.13,.13),...bn(.37,.55)],shape:[...ts(0,.8),$t(1300,.28,.19,.1,2),gn(1150,1080,.06,.025,.3)],paste:[$t(620,.12,.25),...ts(.04,.48),gn(190,130,.075,.065,.16)],paper:ts(),assemble:[...ts(0,.5),...bn(.13,.45)],check:[...bn(0,.4),...bn(.12,.22)],switch:[$t(2700,.018,.14),gn(920,450,.035,.07)],light_on:[...bn(0,.2),...ns(660,.035,.65)],light_off:[...bn(0,.25),gn(440,390,.19,.045,.025)],complete:[...ns(523.25,0,.8),...ns(659.25,.18,.8),...ns(783.99,.36,.8),...ns(1046.5,.57,.55)],phase_done:[...ns(659.25,0,.35),...ns(783.99,.14,.35)],tool:bn(0,.25),ui:bn(0,.16),undo:ts(0,.32),blocked:[gn(220,200,.1,.08),$t(800,.04,.07)],footstep:[$t(320,.13,.28,0,.6),gn(95,55,.09,.12),$t(1500,.075,.045,.035)],enter:[...bn(0,.35),...bn(.12,.22)]}),rh=new WeakMap;function Wx(i){if(!rh.has(i)){let e=i.createBuffer(1,Math.ceil(i.sampleRate*1.6),i.sampleRate),t=e.getChannelData(0),n=74123;for(let s=0;s<t.length;s++)n=Math.imul(n,1664525)+1013904223>>>0,t[s]=n/2147483648-1;rh.set(i,e)}return rh.get(i)}function Xx(i,e,t,{start:n=i.currentTime,variation:s=1,onEnded:r=()=>{}}={}){let o=qf[t];if(!o)return null;let a=i.createGain(),l=[a],c=[];a.connect(e);let u=o.length,h=!1,d=()=>{if(!h){h=!0;for(let g of c){g.onended=null;try{g.stop()}catch{}}for(let g of l)g.disconnect();r()}},f=n;for(let g of o){let _=n+g.offset,m=g.duration;f=Math.max(f,_+m+.015);let p=i.createGain();l.push(p),p.gain.setValueAtTime(0,_),p.gain.linearRampToValueAtTime(g.gain,_+Math.min(.012,m*.18)),p.gain.exponentialRampToValueAtTime(1e-4,_+m),p.gain.linearRampToValueAtTime(0,_+m+.01),p.connect(a);let y;if(g.kind==="tone")y=i.createOscillator(),y.type="sine",y.frequency.setValueAtTime(g.hz*s,_),y.frequency.exponentialRampToValueAtTime((g.end||g.hz)*s,_+m),y.connect(p);else{y=i.createBufferSource(),y.buffer=Wx(i);let x=i.createBiquadFilter();x.type="bandpass",x.frequency.value=g.hz*s,x.Q.value=g.q,l.push(x),y.connect(x),x.connect(p)}c.push(y),l.push(y),y.onended=()=>{--u===0&&d()},y.start(_),y.stop(_+m+.012)}return{end:f,dispose:d}}function Yf({storage:i,contextFactory:e,onChange:t=()=>{}}={}){let n=!0,s=.45,r=null,o=null,a=0,l=!0,c=!1,u=0,h=null,d=0,f=0,g=new Set,_=new Map;try{let A=JSON.parse(i?.getItem(Xf)||"null");A&&typeof A.enabled=="boolean"&&Number.isFinite(A.volume)&&(n=A.enabled,s=Math.max(0,Math.min(1,A.volume)))}catch{}let m=()=>({enabled:n,volume:s,available:l,paused:c,state:r?.state||"idle",activeVoices:g.size,pending:u,lastSound:h,played:d}),p=()=>t(m());function y(){try{i?.setItem(Xf,JSON.stringify({enabled:n,volume:s}))}catch{}p()}function x(){a++,f=0;for(let A of g)A.dispose();g.clear()}function v(){if(!l)return!1;if(!r)try{r=e?e():new(globalThis.AudioContext||globalThis.webkitAudioContext),o=r.createGain(),o.gain.value=s*.8;let A=r.createBiquadFilter();A.type="highpass",A.frequency.value=55;let B=r.createDynamicsCompressor();B.threshold.value=-16,B.knee.value=15,B.ratio.value=5,B.attack.value=.003,B.release.value=.12,o.connect(A),A.connect(B),B.connect(r.destination)}catch{return l=!1,x(),p(),!1}return!0}function D(A){if(!n||!s||c||r.state!=="running"||g.size>=8)return!1;let B=r.currentTime,M=A==="blocked"?.55:A==="footstep"?.23:.055;if(B-(_.get(A)??-1/0)<M)return!1;_.set(A,B);let E;return E=Xx(r,o,A,{start:B+.006,variation:["complete","phase_done","light_on","dry_ready"].includes(A)?1:.96+Math.random()*.08,onEnded:()=>g.delete(E)}),E?(g.add(E),h=A,d++,!0):!1}function w(A){let B=Gx[A]||A;if(!qf[B]||!n||!s||c||!v())return!1;if(r.state==="running")return D(B);if(u)return!1;let M=a;u++;try{Promise.resolve(r.resume()).then(()=>{M===a&&D(B)},()=>{}).finally(()=>{u--,p()})}catch{u--}return!1}return{play:w,snapshot:m,setEnabled(A){n=!!A,n||x(),y()},setVolume(A){Number.isFinite(A)&&(s=Math.max(0,Math.min(1,A)),s||x(),o&&(o.gain.cancelScheduledValues(r.currentTime),o.gain.setTargetAtTime(s*.8,r.currentTime,.025)),y())},pause(){c=!0,x(),p()},resume(){c=!1,p()},walk(A){!n||!s||c||!r||r.state!=="running"||(f+=Math.max(0,A),f>=.7&&(f%=.7,w("footstep")))},async dispose(){x(),r&&r.state!=="closed"&&await r.close()}}}var hc=class{constructor(){this.phase="idle",this.elapsed=0,this.winding=0,this.adherence=0,this.hits=0,this.compression=0,this.strike=0,this.progress=0}begin(e){this.phase=e,this.elapsed=0}place(){return this.phase!=="idle"?!1:(this.begin("loading"),!0)}fit(){return this.phase!=="loaded"?!1:(this.begin("fitting"),!0)}wind(e){return this.phase!=="winding"||!Number.isFinite(e)||e<=0?!1:(this.winding=Ot(this.winding+e),this.winding===1&&this.begin("wrapped"),!0)}stand(){return this.phase!=="wrapped"?!1:(this.begin("standing"),!0)}hammer(){return this.phase!=="hammering"||this.strike>0?!1:(this.strike=.52,!0)}restore(){return this.phase!=="compressed"?!1:(this.begin("restoring"),!0)}unthread(){return this.phase!=="restored"?!1:(this.begin("unthreading"),!0)}removePaper(){return this.phase!=="unthreaded"?!1:(this.begin("extracting"),!0)}extract(){return this.phase!=="done"?!1:(this.begin("collected"),!0)}tick(e){e=Ot(e,0,.05),this.elapsed+=e;let t={loading:[.85,"loaded"],fitting:[1.1,"winding"],standing:[1.05,"hammering"],restoring:[1,"restored"],unthreading:[1.1,"unthreaded"],extracting:[1.1,"done"]};this.phase==="fitting"&&(this.adherence=Ot(this.elapsed/1.1));let n=t[this.phase];if(n&&this.elapsed>=n[0]&&this.begin(n[1]),this.strike>0){let r=this.strike;this.strike=Math.max(0,this.strike-e),r>.24&&this.strike<=.24&&(this.hits++,this.compression=this.hits/8),this.strike===0&&this.hits>=8&&this.begin("compressed")}let s={idle:0,loading:.03,loaded:.05,fitting:.07,winding:.12,wrapped:.3,standing:.35,hammering:.42,compressed:.75,restoring:.77,restored:.81,unthreading:.84,unthreaded:.89,extracting:.93,done:1,collected:1};this.progress=(s[this.phase]??0)+(this.phase==="winding"?this.winding*.18:this.phase==="hammering"?this.compression*.3:0)}};var tn=(i=0,e=0,t=0)=>new k(i,e,t),Mr=i=>(i=Ot(i),i*i*(3-2*i));function $f(i){let e=new We;e.name="manual-press-tool",e.position.set(3.2,1.045,1.48);let t=new ke({color:"#715237",roughness:.86}),n=new ke({color:"#bc9560",roughness:.8}),s=new ke({color:"#ada58b",metalness:.5,roughness:.42}),r=new xn({color:"#f7e7bf"});function o(M,E,O,L=e){let H=new Ue(M,E);return H.position.copy(O),H.castShadow=H.receiveShadow=!0,L.add(H),H}o(new Mt(.49,.045,.48),t,tn(0,.023,0));let a=new We;a.name="manual-mold",e.add(a);let l=o(new mt(.205,.205,.065,40),n,tn(0,-.3,0),a),c=o(new mt(.205,.205,.065,40),n,tn(0,.3,0),a),u=[];for(let M of[-1,1]){let E=new We;a.add(E),u.push(E);let O=o(new mt(.144,.144,.53,40,1,!1,M<0?Math.PI:0,Math.PI),t,tn(),E);for(let L=0;L<9;L++){let H=L/8*Math.PI+(M<0?Math.PI:0);o(new mt(.002,.002,.51,6),s,tn(Math.sin(H)*.146,0,Math.cos(H)*.146),E)}}let h=[];for(let M of[-.255,.255]){let E=o(new Lt(.16,.009,8,40),s,tn(0,M,0),a);E.rotation.x=Math.PI/2,h.push(E)}let d=Array.from({length:901},(M,E)=>{let O=E/900,L=O*Math.PI*32;return tn(Math.sin(L)*.163,-.25+O*.5,-Math.cos(L)*.163)}),f=new vn(new et().setFromPoints(d),r);f.name="manual-cotton-winding",a.add(f);let g=new We;g.name="manual-cotton-spool",g.position.set(-.42,.09,.23),e.add(g),o(new mt(.052,.052,.14,20),n,tn(),g),o(new mt(.066,.066,.095,24),new ke({color:"#e8d9b6",roughness:1}),tn(),g);for(let M of[-.07,.07])o(new mt(.09,.09,.018,24),t,tn(0,M,0),g);let _=new vn(new et().setFromPoints([tn(),tn()]),r);e.add(_);let m=new We;m.name="manual-hammer",e.add(m),o(new mt(.018,.022,.39,12),t,tn(0,-.15,0),m),o(new Mt(.24,.11,.12),s,tn(),m);let p=Wn(i);p.scale.setScalar(.72),e.add(p),p.rotation.x=-Math.PI/2,p.position.set(.81,.014,.26);let y=p.geometry.attributes.position.array.slice(),x=Go(p,i.leaf,!0);x.visible=!1;let v=tn(.81,.014,.26),D=tn(.81,.014,.26),w=tn();function A(M){let E=["idle","loading","winding","wrapped","standing","hammering","compressed","restoring","restored","unthreading","unthreaded","extracting","done","collected"],O=["loaded","fitting"].includes(M.phase)?2:E.indexOf(M.phase),L=O<4?0:O===4?Mr(M.elapsed/1.05):1,H=O<11?0:O===11?Mr(M.elapsed/1.1):1,J=O<7?0:O===7?Mr(M.elapsed):1,Z=M.compression*(1-J),K=O<9?0:O===9?Mr(M.elapsed/1.1):1;a.rotation.set((1-L)*Math.PI/2,Math.PI*L,0),a.position.set(0,.19+L*.19,0),a.scale.y=1-.32*Z,a.position.y=.19+L*.19-.3*.32*Z,c.position.y=.3,l.position.y=-.3,u.forEach(me=>{me.position.x=0}),h.forEach((me,ye)=>{me.scale.setScalar(1),me.position.y=(ye?1:-1)*.255}),f.geometry.setDrawRange(0,Math.max(0,Math.floor(901*M.winding*(1-K)))),f.visible=K<1,a.updateMatrixWorld(!0),e.updateMatrixWorld(!0);let ge=d[Math.min(900,Math.floor(900*M.winding*(1-K)))].clone();a.localToWorld(ge),e.worldToLocal(ge);let G=_.geometry.attributes.position;if(G.setXYZ(0,-.42,.15,.23),G.setXYZ(1,ge.x,ge.y,ge.z),G.needsUpdate=!0,_.geometry.computeBoundingSphere(),_.visible=["winding","unthreading"].includes(M.phase),m.visible=!0,O>=5&&O<=6){let me=M.strike>0?Math.sin((.52-M.strike)/.52*Math.PI):0;m.position.set(0,.87-me*.14-.075*M.compression,0),m.rotation.set(0,0,Math.PI/2+.2-me*.2)}else m.position.set(.43,.07,-.3),m.rotation.set(Math.PI/2,0,-.65);let _e=p.geometry.attributes.position;if(O===0)v.copy(p.position);else if(O===1)a.localToWorld(w.set(0,0,-.165)),e.worldToLocal(w),p.rotation.set(-Math.PI/2,0,0),p.position.lerpVectors(v,w,Mr(M.elapsed/.85));else if(O<11){p.position.copy(a.position),p.quaternion.copy(a.quaternion);for(let me=0;me<_e.count;me++){let ye=y[me*3],Re=y[me*3+1],Ae=ye*.72/.157,Ne=Mr(M.adherence);_e.setXYZ(me,Xt.lerp(ye,Math.sin(Ae)*.157/.72,Ne),Re*(1-.32*Z),Xt.lerp(-.165/.72,-Math.cos(Ae)*.157/.72,Ne))}}else{p.quaternion.slerpQuaternions(a.quaternion,new ti().setFromEuler(new pn(-Math.PI/2,0,0)),H),p.position.lerpVectors(a.position,D,H),p.position.y+=Math.sin(H*Math.PI)*.28;for(let me=0;me<_e.count;me++){let ye=y[me*3],Re=y[me*3+1],Ae=ye*.72/.157;_e.setXYZ(me,Xt.lerp(Math.sin(Ae)*.157/.72,ye,H),Re,Xt.lerp(-Math.cos(Ae)*.157/.72,0,H))}}_e.needsUpdate=!0,p.geometry.computeVertexNormals(),p.geometry.computeBoundingSphere(),x.visible=O>=12}function B(){return e.localToWorld(tn(0,.34,0))}return{root:e,paper:p,update:A,moldTarget:B}}function Jf(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new et,c=0;for(let u=0;u<i.length;++u){let h=i[u],d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in h.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0,h=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=i[d].attributes.position.count}l.setIndex(h)}for(let u in r){let h=Zf(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(let u in o){let h=o[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<h;++d){let f=[];for(let _=0;_<o[u].length;++_)f.push(o[u][_][d]);let g=Zf(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}return l}function Zf(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let u=i[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new Nt(o,t,n),l=0;for(let c=0;c<i.length;++c){let u=i[c];if(u.isInterleavedBufferAttribute){let h=l/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){let _=u.getComponent(d,g);a.setComponent(d+h,g,_)}}else o.set(u.array,l);l+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function Dt(i){let e=new Set,t=new Set,n=new Set;i.traverse(s=>{s.geometry&&e.add(s.geometry),s.skeleton&&n.add(s.skeleton),s.material&&(Array.isArray(s.material)?s.material:[s.material]).forEach(r=>t.add(r))}),i.clear();for(let s of e)s.dispose();for(let s of n)s.dispose();for(let s of t)s.map?.dispose(),s.dispose()}var qx={relaxed:{curl:[.18,.23,.28,.36],middle:.35,tip:.22,thumb:[-.28,-.8,.3]},bamboo:{curl:[.58,.68,.78,.88],middle:1.05,tip:.55,thumb:[-.62,.18,.68]},grip:{curl:[.82,.95,1.05,1.15],middle:1.18,tip:.62,thumb:[-.6,.35,.8]},brush:{curl:[.92,1.06,1.16,1.23],middle:1.32,tip:.65,thumb:[-.65,.5,.85]},pinch:{curl:[.38,.82,.96,1.1],middle:.95,tip:.55,thumb:[-.55,.48,.7]},press:{curl:[.06,.08,.11,.16],middle:.12,tip:.08,thumb:[-.12,-.7,.15]}};function Kf(i,e=16){let t=[],n=[];for(let[o,a,l,c=0]of i)for(let u=0;u<e;u++){let h=u/e*Math.PI*2,d=Math.cos(h),f=Math.sin(h);t.push(Math.sign(d)*Math.pow(Math.abs(d),.78)*a,c+Math.sign(f)*Math.pow(Math.abs(f),.78)*l,o)}for(let o=0;o<i.length-1;o++)for(let a=0;a<e;a++){let l=o*e+a,c=o*e+(a+1)%e;n.push(l,c,l+e,c,c+e,l+e)}n.push(...Array.from({length:e-2},(o,a)=>[0,a+2,a+1]).flat());let s=(i.length-1)*e;for(let o=1;o<e-1;o++)n.push(s,s+o,s+o+1);let r=new et;return r.setAttribute("position",new Ke(t,3)),r.setIndex(n),r.computeVertexNormals(),r}function Yx(i,e="relaxed",t=1){let n=i.handRig,s=qx[e];if(!n||!s)return!1;let r=Xt.clamp(Number.isFinite(t)?t:1,0,1);return n.fingers.forEach((o,a)=>{o[0].rotation.set(-s.curl[a]*r,0,n.sign*(a-1.5)*.025),o[1].rotation.x=-s.middle*r,o[2].rotation.x=-s.tip*r}),n.thumb[0].rotation.set(s.thumb[0]*r,n.sign*s.thumb[1],n.sign*.15),n.thumb[1].rotation.x=-s.thumb[2]*r,n.thumb[2].rotation.x=-s.thumb[2]*.65*r,i.userData.pose=e,i.userData.poseAmount=r,!0}function Fn(i,e=!1,t="grip"){let n=new We;n.name=e?"artisan-hand-left":"artisan-hand-right",i.add(n);let s=e?1:-1,r=[],o=[],a=[],l=[];function c(y,x,v){let D=new or;return D.name=y,D.position.copy(v),x.add(D),r.push(D),D}let u=c("palm",n,new k);function h(y,x,v=new k){y.translate(v.x,v.y,v.z);let D=y.attributes.position.count,w=new Uint16Array(D*4),A=new Float32Array(D*4);for(let B=0;B<D;B++)w[B*4]=x,A[B*4]=1;return y.setAttribute("skinIndex",new $i(w,4)),y.setAttribute("skinWeight",new Ke(A,4)),y}o.push(h(Kf([[-.046,.045,.013],[-.027,.076,.03],[0,.088,.037],[.04,.086,.041],[.078,.073,.035],[.116,.053,.028],[.16,.046,.026]]),0)),o.push(h(new Cn(1,16,10).scale(.034,.031,.055),0,new k(s*.051,-.009,.062)));function d(y,x,v,D,w,A=!1){let B=c(y+"-base",u,new k(x,A?-.006:0,v)),M=c(y+"-middle",B,new k(0,0,-D[0])),E=c(y+"-tip",M,new k(0,0,-D[1])),O=[r.indexOf(B),r.indexOf(M),r.indexOf(E)],L=[D[0],D[0]+D[1]],H=D.reduce((Ae,Ne)=>Ae+Ne,0),J=[0,.014,L[0]-.007,L[0],L[0]+.007,L[1]-.006,L[1],L[1]+.006,H-.012,H-.007,H-.003,H].sort((Ae,Ne)=>Ae-Ne),Z=[],K=[],ge=[],G=[],_e=12;for(let Ae of J){let Ne=Ae/H,He=Ae>H-.012?Math.sqrt(Math.max(.003,1-Math.pow((Ae-H+.012)/.012,2))):1,ie=w*(1-.25*Ne)*He,de=Ae<L[0]?0:Ae<L[1]?1:2,Te=de,Le=0;for(let Ce=0;Ce<2;Ce++)Math.abs(Ae-L[Ce])<=.007&&(de=Ce,Te=Ce+1,Le=Xt.clamp((Ae-L[Ce]+.007)/.014,0,1));for(let Ce=0;Ce<_e;Ce++){let Q=Ce/_e*Math.PI*2;Z.push(x+Math.cos(Q)*ie,(A?-.006:0)+Math.sin(Q)*ie*.86,v-Ae),ge.push(O[de],O[Te],0,0),G.push(1-Le,Le,0,0)}}for(let Ae=0;Ae<J.length-1;Ae++)for(let Ne=0;Ne<_e;Ne++){let He=Ae*_e+Ne,ie=Ae*_e+(Ne+1)%_e;K.push(He,He+_e,ie,ie,He+_e,ie+_e)}let me=(J.length-1)*_e;for(let Ae=1;Ae<_e-1;Ae++)K.push(me,me+Ae+1,me+Ae);let ye=new et;ye.setAttribute("position",new Ke(Z,3)),ye.setIndex(K),ye.setAttribute("skinIndex",new $i(ge,4)),ye.setAttribute("skinWeight",new Ke(G,4)),ye.computeVertexNormals(),o.push(ye);let Re=new Cn(1,12,8).scale(w*.63,.0018,.01);return a.push(h(Re,O[2],new k(x,(A?-.006:0)+w*.7,v-H+.015))),[B,M,E]}let f=[["index",.06,-.019,[.045,.032,.024],.017],["middle",.021,-.032,[.049,.037,.028],.018],["ring",-.02,-.026,[.045,.035,.026],.0165],["little",-.057,-.01,[.034,.027,.021],.014]];for(let[y,x,v,D,w]of f)l.push(d(y,s*x,v,D,w));let g=d("thumb",s*.073,.07,[.031,.027,.024],.02,!0);n.updateMatrixWorld(!0);let _=new oo(r);function m(y,x){for(let w of y)w.deleteAttribute("uv");let v=Jf(y);for(let w of y)w.dispose();let D=new ro(v,x);return D.castShadow=!0,D.receiveShadow=!0,n.add(D),D.bind(_),D.frustumCulled=!1,D}m(o,new ke({color:"#cda787",roughness:.82})),m(a,new ke({color:"#d9bcaa",roughness:.63}));function p(y,x){let v=new Ue(Kf(y),new ke({color:x,roughness:1}));v.castShadow=!0,v.receiveShadow=!0,n.add(v)}return p([[.18,.056,.037],[.205,.06,.041],[.25,.069,.049],[.32,.078,.056],[.38,.081,.058]],"#58634d"),p([[.153,.048,.029],[.157,.057,.037],[.181,.059,.039],[.191,.055,.036]],"#73806a"),n.handRig={fingers:l,thumb:g,sign:s,skeleton:_},n.userData.left=e,n.userData.gripPoint=[s*.025,-.027,-.052],Yx(n,t),n}function Xn(i,e){let t=new k(...i.userData.gripPoint).multiply(i.scale).applyQuaternion(i.quaternion);i.position.copy(e).sub(t)}function Ui(i,e=!1){let t=i.clone(!0);return t.visible=!0,t.traverse(n=>{n.geometry&&(n.geometry=n.geometry.clone()),n.material&&(n.material=e?new Ft({color:"#d5dc9c",transparent:!0,opacity:.35,depthWrite:!1}):n.material.clone())}),t}var je=i=>document.getElementById(i),Zt=(i=0,e=0,t=0)=>new k(i,e,t);function jf({scene:i,camera:e,canvas:t,world:n,audio:s,getState:r,onComplete:o,onDiscardDye:a,canInteract:l}){let c=new We;c.name="paper-work",i.add(c),c.visible=!1;let u=je("handwork-surface"),h=new Pn,d=!1,f,g,_,m,p,y,x,v,D,w,A,B,M,E,O=null,L=null,H=0,J,Z="",K=0,ge,G,_e,me,ye="machine",Re=null,Ae=null,Ne=null,He=!1,ie=()=>_==="press"&&ye==="manual",de=Y=>{je("handwork-status").textContent=Y};function Te(Y){let T=t.getBoundingClientRect(),q=Y.clone().project(e);return{x:T.left+(q.x+1)*T.width/2,y:T.top+(1-q.y)*T.height/2}}function Le(Y,T=1.05){let q=t.getBoundingClientRect();return h.setFromCamera(new we((Y.clientX-q.left)/q.width*2-1,-(Y.clientY-q.top)/q.height*2+1),e),h.ray.intersectPlane(new Ht(Zt(0,1,0),-T),Zt())}function Ce(Y,T,q=48){let te=Te(T);return Math.hypot(te.x-Y.clientX,te.y-Y.clientY)<q}function Q(Y,T,q){let te=new Ue(new Mt(...Y),new ke({color:q,roughness:.85}));return te.position.copy(T),c.add(te),te}function pe(){return{mode:_==="cut"?"trace":_,quality:_==="dye"?Ot(1-Math.abs(y.dose-.8)):1,curve:0,oval:0,dose:_==="dye"?y.dose:p.dose,depth:_==="dye"?y.maxDepth:p.depth,angle:0,distance:1}}function U(){let Y=performance.now();Y-K>240&&(s.play(_==="cut"?"paper_cutting":f.id),K=Y)}function ae(){let Y=m?r().leaves:r().papers,T=Y[g*(m?7:6)];return{leaf:m,dose:T?.dyeDose??.8,depth:T?.dyeDepth??.8}}function P(){if(V(),He=!1,Re=null,Dt(c),x=v=D=w=A=B=M=E=null,Z="",H=0,L=null,_==="dye")y=new lc,x=Wn({leaf:m,dose:0}),x.scale.setScalar(.56),x.visible=!1,c.add(x),E=n.dyeBin.position,v=Fn(c,!1,"pinch"),v.scale.setScalar(.58),v.visible=!1;else if(ie())y=new hc,Re=$f(p),c.add(Re.root),x=Re.paper,Re.update(y);else if(_==="press")y=new cc,M=uc(),c.add(M.root),M.root.position.set(3.08,1.01,1.42),x=Wn(p),x.scale.setScalar(.72),x.rotation.x=-Math.PI/2,x.position.set(4.05,1.045,1.76),c.add(x),J=x.geometry.attributes.position.array.slice(),B=Go(x,m,!0),B.visible=!1;else{let Y=f.id==="paper_cutting"?"square":m?"leaf":"petal";y=new ac(Y),x=Wn(f.id==="paper_cutting"?{dose:0}:p,"square",f.id==="paper_cutting"?1.05:.72),c.add(x);let T=n.stations[f.station];x.rotation.x=-Math.PI/2,x.position.set(T.x,1.055,T.z+.25),Y!=="square"&&(B=Go(x,m)),D=new vn(new et().setFromPoints(y.points.map(q=>Zt(q.x,q.y,.006))),new xn({color:"#624a33",depthTest:!1})),x.add(D),D.renderOrder=15,w=new Ue(new Lt(.022,.004,6,20),new Ft({color:"#a84e35",depthTest:!1})),w.renderOrder=16,x.add(w),A=rc(),c.add(A),A.rotation.x=-Math.PI/2,A.position.copy(x.position).add(Zt(.43,.026,0))}x.name="active-paper",I()}function I(){let Y=je("handwork-confirm"),T=je("handwork-retry");if(T.hidden=_!=="cut",T.textContent="\u91CD\u65B0\u88C1\u526A",Y.hidden=_==="press"&&y.phase==="running",_==="dye"){let q=Se();je("paper-stock").disabled=y.phase!=="stock",je("paper-stock-count").textContent="\u7B2C "+(g+1)+" / "+f.total+" \u6279 \xB7 \u65B9\u7EB8\u5728\u684C\u9762\u5DE6\u4E0A\u89D2",je("paper-waste-count").textContent="\u5E9F\u7EB8 "+r().dyeWaste+" \u6279",Y.textContent=q?"E \xB7 "+q.label:H?"\u6B63\u5728\u6302\u7EB8\u2026":"\u79FB\u52A8\u7EB8\u5F20\u9760\u8FD1\u76EE\u6807",Y.disabled=!q||H>0;let te=je("dye-clock");te.hidden=y.phase==="stock";let $=Math.floor(y.simulatedSeconds);je("dye-time").textContent=String(Math.floor($/60)).padStart(2,"0")+":"+String($%60).padStart(2,"0"),je("dye-real-time").textContent="\u5B9E\u9645\u6D78\u67D3 "+y.seconds.toFixed(1)+" \u79D2 \xB7 20 \u500D\u901F",je("dye-time-note").textContent=y.simulatedSeconds>120?"\u5DF2\u8D85\u8FC7\u5EFA\u8BAE\u65F6\u95F4 \xB7 \u53EF\u63D0\u7EB8\u540E\u5F03\u7F6E":y.simulatedSeconds>=60?y.phase==="dipping"?"\u5DF2\u5230\u5EFA\u8BAE\u533A\u95F4 \xB7 \u6309 E \u63D0\u7EB8":"\u67D3\u8272\u5DF2\u5C31\u7EEA \xB7 \u79FB\u81F3\u9634\u5E72\u67B6":"\u5EFA\u8BAE\u5DE5\u827A\u65F6\u95F4 01:00\u201402:00",te.dataset.state=y.simulatedSeconds>120?"over":y.simulatedSeconds>=60?"ready":"waiting";let xe={stock:"\u70B9\u51FB\u684C\u9762\u5DE6\u4E0A\u89D2\u65B9\u7EB8\uFF0C\u62D6\u81F3\u67D3\u76D8\u9644\u8FD1\uFF0C\u518D\u6309 E \u6D78\u6DA6\u3002",held:"\u6309\u4F4F\u7EB8\u5F20\u62D6\u52A8\uFF1B\u677E\u624B\u539F\u4F4D\u505C\u7559\u3002\u9760\u8FD1\u67D3\u76D8\u3001\u9634\u5E72\u67B6\u6216\u5E9F\u6599\u6876\u540E\u6309 E\u3002",dipping:"\u6B63\u5728\u6D78\u67D3 \xB7 \u6309 E \u63D0\u7EB8\u3002\u677E\u5F00\u9F20\u6807\u4E0D\u4F1A\u79FB\u52A8\u7EB8\u5F20\u6216\u505C\u6B62\u67D3\u8272\u3002",lifting:"\u6B63\u5728\u62AC\u79BB\u67D3\u6DB2\uFF0C\u4FDD\u7559\u672C\u6B21\u6E10\u53D8\u2026",review:y.ready?"\u67D3\u8272\u5DF2\u5408\u9002\uFF1A\u62D6\u5230\u9634\u5E72\u67B6\u65C1\u6309 E \u6302\u7EB8\uFF1B\u4E0D\u6EE1\u610F\u53EF\u79FB\u81F3\u5E9F\u6599\u6876\u3002":"\u65F6\u95F4\u4E0D\u8DB3\u53EF\u79FB\u56DE\u67D3\u76D8\u7EE7\u7EED\u6D78\u67D3\uFF1B\u8FC7\u6DF1\u53EF\u79FB\u81F3\u5E9F\u6599\u6876\u5F03\u7F6E\u3002"};de(Z||(H?"\u6B63\u5728\u6302\u7EB8\uFF1B\u7EB8\u8272\u4E0E\u6D78\u67D3\u7ED3\u679C\u4FDD\u6301\u4E00\u81F4\u3002":q?"\u3010E\u3011"+q.label+" \xB7 "+(q.hint||"\u677E\u624B\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C"):xe[y.phase]));for(let[Ie,F,W]of[["bath","\u67D3\u76D8",n.bathPositions[m?1:0]],["rack","\u9634\u5E72\u67B6",fe()],["bin","\u5E9F\u6599\u6876",E]]){let N=je("dye-target-"+Ie),S=Te(W);N.style.left=S.x+"px",N.style.top=S.y+"px",N.classList.toggle("near",q?.key===Ie),N.textContent=q?.key===Ie?"E \xB7 "+q.label:F}}else ie()?se(Y):_==="press"?(Y.disabled=!1,Y.textContent=y.phase==="done"?"\u53D6\u51FA\u538B\u7EB9\u65B9\u7EB8 \u2192":"\u542F\u52A8\u6EDA\u8F74\u538B\u7EB9",de(y.phase==="running"?"\u6EDA\u8F74\u8FD0\u8F6C \xB7 \u5377\u7EBF\u8FDB\u7EB8 "+Math.round(y.progress*100)+"% \xB7 \u7B49\u5F85\u81EA\u52A8\u505C\u6B62":y.phase==="done"?"\u6EDA\u8F74\u5DF2\u505C\u6B62\uFF0C\u538B\u7EB9\u5B8C\u6210\u3002\u53F3\u4FA7\u4ECD\u662F\u65B9\u7EB8\uFF0C\u4E0B\u4E00\u6B65\u624D\u88C1\u8F6E\u5ED3\u3002":"\u53F3\u4FA7\u4E3A\u9634\u5E72\u65B9\u7EB8\uFF0C\u5DE6\u4FA7\u4E3A\u538B\u7EB9\u673A\u3002\u70B9\u51FB\u542F\u52A8\uFF0C\u7B49\u5F85\u5B8C\u6574\u8FDB\u7EB8\u4E0E\u538B\u7EB9\u3002")):(Y.disabled=!y.ready,Y.textContent=f.id==="paper_cutting"?"\u6536\u597D\u65B9\u5F62\u7EB8\u7247 \u2192":"\u6536\u597D\u88C1\u6210\u7684"+(m?"\u53F6\u7247":"\u82B1\u74E3")+" \u2192",de(y.ready?"\u8F6E\u5ED3\u88C1\u526A\u5B8C\u6210\uFF0C\u53EF\u4EE5\u6536\u597D\u672C\u6279\u7EB8\u7247\u3002":"\u6CBF\u4EAE\u70B9\u9644\u8FD1\u7684\u8F68\u8FF9\u6309\u4F4F\u6216\u70B9\u51FB\u5DE6\u952E\u7EE7\u7EED\u526A\uFF1B\u677E\u624B\u3001\u504F\u79BB\u53EA\u6682\u505C\uFF0C\u5DF2\u526A\u8FDB\u5EA6\u4F1A\u4FDD\u7559\u3002"))}function V(){for(let Y of[u,je("handwork-confirm")])for(let T of[L,Ae])T!==null&&Y.hasPointerCapture?.(T)&&Y.releasePointerCapture(T);L=null,Ae=null,Ne=null}function se(Y){let T=y.phase,q={idle:"\u653E\u5165\u65B9\u7EB8\u576F\u6599",loading:"\u6B63\u5728\u5E73\u94FA\u653E\u6599\u2026",loaded:"\u8D34\u7D27\u6A21\u5177\u8868\u9762",fitting:"\u6B63\u5728\u629A\u5E73\u8D34\u6A21\u2026",winding:"\u6309\u4F4F\u7F20\u7EBF \xB7 "+Math.round(y.winding*100)+"%",wrapped:"\u5C06\u5DE5\u88C5\u7AD6\u76F4\u7ACB\u8D77",standing:"\u6B63\u5728\u7ACB\u6A21\u2026",hammering:"\u9524\u51FB\u538B\u5B9E \xB7 "+y.hits+" / 8",compressed:"\u62C9\u9AD8\u6A21\u5177\u590D\u4F4D",restoring:"\u6B63\u5728\u62C9\u9AD8\u6A21\u5177\u2026",restored:"\u62BD\u51FA\u68C9\u7EBF",unthreading:"\u6B63\u5728\u62BD\u7EBF\u2026",unthreaded:"\u53D6\u51FA\u538B\u7EB9\u65B9\u7EB8",extracting:"\u6B63\u5728\u53D6\u51FA\u65B9\u7EB8\u2026",done:"\u6536\u597D\u538B\u7EB9\u65B9\u7EB8 \u2192"};Y.hidden=!1,Y.textContent=q[T]||"\u5DF2\u6536\u597D",Y.disabled=["loading","fitting","standing","restoring","unthreading","extracting","collected"].includes(T)||T==="hammering"&&y.strike>0;let te={idle:"\u5C06\u53F3\u4FA7\u9634\u5E72\u65B9\u7EB8\u62D6\u5230\u5DE6\u4FA7\u6A21\u5177\u578B\u8154\uFF1B\u4E5F\u53EF\u70B9\u51FB\u300C\u653E\u5165\u65B9\u7EB8\u576F\u6599\u300D\u3002",loading:"\u5C06\u65B9\u7EB8\u5E73\u94FA\u5230\u6A21\u5177\u4E0A\uFF0C\u6682\u4E0D\u7F20\u7EBF\u3002",loaded:"\u653E\u6599\u5B8C\u6210\u3002\u70B9\u51FB\u300C\u8D34\u7D27\u6A21\u5177\u8868\u9762\u300D\uFF0C\u5148\u8BA9\u7EB8\u5F20\u5B8C\u5168\u8D34\u5408\u6A21\u5177\uFF0C\u518D\u5F00\u59CB\u7F20\u7EBF\u3002",fitting:"\u6B63\u5728\u6CBF\u6A21\u5177\u8868\u9762\u629A\u5E73\u7EB8\u5F20\uFF0C\u8D34\u7D27\u5B8C\u6210\u540E\u624D\u53EF\u7F20\u7EBF\u3002",winding:"\u6CBF\u82B1\u74E3\u9762\u7ED5\u8F74\u7F20\u7EBF\uFF0C\u7EF7\u7D27\u56FA\u5B9A\u7EB8\u5F20 \xB7 \u6309\u4F4F\u6A21\u5177\u6216\u4E0B\u65B9\u6309\u94AE\u7F20\u7EBF\uFF0C\u677E\u624B\u6682\u505C\u3002",wrapped:"\u68C9\u7EBF\u5DF2\u7EF7\u7D27\uFF0C\u70B9\u51FB\u5C06\u6574\u5957\u5DE5\u88C5\u7ACB\u5230\u5E73\u53F0\u4E0A\u3002",standing:"\u6B63\u5728\u7AD6\u7ACB\u5DE5\u88C5\uFF0C\u7B49\u5F85\u5E95\u5EA7\u5C31\u7A33\u3002",hammering:"\u9524\u51FB\u4E0B\u538B\uFF0C\u6D88\u9664\u6A21\u5177\u5185\u90E8\u7A7A\u9699\uFF0C\u5B8C\u6210\u82B1\u74E3\u5851\u5F62 \xB7 \u70B9\u51FB\u6A21\u5177\u6216\u6309\u94AE\u9010\u6B21\u6572\u6253\u3002",compressed:"\u5DF2\u538B\u5B9E\u3002\u5411\u4E0A\u62C9\u9AD8\u88AB\u6572\u6241\u7684\u6A21\u5177\uFF0C\u4F7F\u5176\u6062\u590D\u539F\u9AD8\u5EA6\uFF0C\u4E0D\u9700\u8981\u62C6\u5F00\u6A21\u5177\u3002",restoring:"\u4FDD\u6301\u6A21\u5177\u5B8C\u6574\uFF0C\u6B63\u5728\u7AD6\u76F4\u62C9\u9AD8\u590D\u4F4D\u3002",restored:"\u6A21\u5177\u5DF2\u6062\u590D\u539F\u9AD8\u5EA6\uFF0C\u63A5\u4E0B\u6765\u62BD\u51FA\u7F20\u7ED5\u7684\u68C9\u7EBF\u3002",unthreading:"\u6B63\u5728\u4ECE\u6A21\u5177\u4E0A\u9010\u5708\u62BD\u51FA\u68C9\u7EBF\uFF0C\u8BF7\u7B49\u5F85\u3002",unthreaded:"\u68C9\u7EBF\u5DF2\u5168\u90E8\u53D6\u51FA\uFF0C\u53EF\u4EE5\u53D6\u51FA\u538B\u597D\u7B4B\u7EB9\u7684\u65B9\u7EB8\u3002",extracting:"\u6B63\u5728\u53D6\u51FA\u65B9\u7EB8\u3002\u6B64\u65F6\u53EA\u6709\u7B4B\u7EB9\uFF0C\u88C1\u526A\u5DE5\u5E8F\u624D\u663E\u793A\u82B1\u74E3\u8F6E\u5ED3\u3002",done:"\u5851\u5F62\u538B\u7EB9\u5B8C\u6210\u3002\u53D6\u51FA\u672C\u6279\u65B9\u7EB8\uFF0C\u540E\u7EED\u518D\u88C1\u526A\u82B1\u74E3 / \u53F6\u7247\u3002"};de(Z||te[T]),je("stage-hint").textContent=te[T];let $={idle:0,loading:0,loaded:1,fitting:1,winding:2,wrapped:3,standing:3,hammering:4,compressed:5,restoring:5,restored:6,unthreading:6,unthreaded:7,extracting:7,done:7}[T]??7;je("manual-press-guide").querySelectorAll("li").forEach((xe,Ie)=>{xe.classList.toggle("current",Ie===$),xe.classList.toggle("complete",Ie<$),Ie===$?xe.setAttribute("aria-current","step"):xe.removeAttribute("aria-current")}),je("manual-press-progress").value=y.progress}function oe(){Z="",y.phase==="idle"?y.place():y.phase==="loaded"?y.fit():y.phase==="wrapped"?y.stand():y.phase==="hammering"?y.hammer()&&s.play("petal_pressing"):y.phase==="compressed"?y.restore():y.phase==="restored"?y.unthread():y.phase==="unthreaded"?y.removePaper():y.phase==="done"&&y.extract()&&o(f.id,g,pe()),d&&I()}je("press-mode").addEventListener("change",()=>{if(!d||_!=="press"||!l()){je("press-mode").value=ye;return}ye=je("press-mode").value==="manual"?"manual":"machine",je("stage-hint").textContent=f.hint,je("manual-press-guide").hidden=!ie(),je("handwork-tool").textContent=ie()?"\u624B\u5DE5\u538B\u78E8\u5177 \xB7 \u68C9\u7EBF \xB7 \u6728\u67C4\u9524":"\u542F\u52A8 \u2192 \u5377\u7EBF\u8FDB\u7EB8 \u2192 \u81EA\u52A8\u505C\u673A \u2192 \u53D6\u7EB8",P()}),je("handwork-confirm").addEventListener("pointerdown",Y=>{!d||!ie()||!l()||y.phase!=="winding"||Y.button!==0||(He=!0,Ae=Y.pointerId,Y.currentTarget.setPointerCapture(Y.pointerId),Y.preventDefault())}),je("handwork-confirm").addEventListener("keydown",Y=>{d&&ie()&&l()&&y.phase==="winding"&&["Space","Enter"].includes(Y.code)&&(Y.preventDefault(),He=!0,Ae="keyboard")}),je("handwork-confirm").addEventListener("keyup",Y=>{d&&ie()&&["Space","Enter"].includes(Y.code)&&(Ae=null,He=!1,Y.preventDefault())}),je("handwork-confirm").addEventListener("blur",()=>{Ae=null});function fe(){return Zt(3.55,1.9,-1.96)}function Se(){if(_!=="dye"||H||y.phase==="stock"||y.phase==="lifting")return null;if(y.phase==="dipping")return{key:"bath",label:"\u63D0\u8D77\u7EB8\u5F20",hint:"\u89C2\u5BDF\u4E0B\u6DF1\u4E0A\u6D45\u7684\u6E10\u53D8"};let Y=Te(x.position),T=innerWidth<700?42:62,te=[["bath",n.bathPositions[m?1:0]],["rack",fe()],["bin",E]].map(([$,xe])=>({key:$,d:Math.hypot(Te(xe).x-Y.x,Te(xe).y-Y.y)})).sort(($,xe)=>$.d-xe.d)[0];return te.d>T?null:te.key==="bath"?{...te,label:y.seconds?"\u7EE7\u7EED\u6D78\u67D3":"\u6D78\u6DA6\u65B9\u7EB8"}:te.key==="bin"?{...te,label:"\u4E22\u5F03\u6B64\u7EB8"}:y.ready?{...te,label:"\u6302\u4E0A\u9634\u5E72\u67B6"}:{...te,label:"\u6682\u4E0D\u80FD\u6302\u7EB8",blocked:!0,hint:y.simulatedSeconds>120?"\u67D3\u8272\u8FC7\u6DF1\uFF0C\u8BF7\u79FB\u81F3\u5E9F\u6599\u6876":"\u8BF7\u5148\u5B8C\u6210 1\u20142 \u5206\u949F\u6A21\u62DF\u6D78\u67D3"}}function De(Y){L=Y.pointerId;let T=e.getWorldDirection(Zt());ge=new Ht().setFromNormalAndCoplanarPoint(T,x.position);let q=t.getBoundingClientRect();h.setFromCamera(new we((Y.clientX-q.left)/q.width*2-1,-(Y.clientY-q.top)/q.height*2+1),e),G=h.ray.intersectPlane(ge,Zt()),_e=x.position.clone(),Y.currentTarget.setPointerCapture?.(Y.pointerId)}function C(Y){!d||_!=="dye"||!l()||!y.take()||(Z="",x.visible=v.visible=!0,x.position.copy(n.paperStock.position).add(Zt(0,.23,0)),Y&&De(Y),I())}function b(Y){if(L!==Y.pointerId||!G)return;let T=t.getBoundingClientRect();h.setFromCamera(new we((Y.clientX-T.left)/T.width*2-1,-(Y.clientY-T.top)/T.height*2+1),e);let q=h.ray.intersectPlane(ge,Zt());q&&(x.position.copy(_e).add(q.sub(G)),Z="")}function X(Y){L===Y.pointerId&&(L=null,y.release(),I())}function re(){if(!d||_!=="dye"||!l()||L!==null)return;let Y=Se();if(Y){if(Z="",Y.blocked){Z=Y.hint,I();return}Y.key==="bath"?(me=x.position.clone(),y.phase==="dipping"?y.liftOut():y.immerse(.8)):Y.key==="rack"?(H=.001,L=null):Y.key==="bin"&&a()&&(y.reset(),x.visible=v.visible=!1,Z="\u5DF2\u4E22\u5F03\u3002\u8BF7\u4ECE\u684C\u9762\u5DE6\u4E0A\u89D2\u53D6\u4E00\u7247\u65B0\u7684\u65B9\u7EB8\u3002"),I()}}u.addEventListener("pointerdown",Y=>{if(!(!d||!l()||Y.button!==0)){if(ie())if(y.phase==="idle"&&Ce(Y,x.getWorldPosition(Zt()),60)){let T=Le(Y,1.06);if(!T)return;L=Y.pointerId,Ne=x.getWorldPosition(Zt()).sub(T),u.setPointerCapture(Y.pointerId)}else Ce(Y,Re.moldTarget(),80)&&(y.phase==="winding"?(Ae=Y.pointerId,u.setPointerCapture(Y.pointerId)):["loaded","hammering"].includes(y.phase)&&oe());else if(_==="dye"){if(y.phase==="stock"){Ce(Y,n.paperStock.position,innerWidth<700?35:52)&&C(Y);return}if(H||["dipping","lifting"].includes(y.phase)||!Ce(Y,x.position,innerWidth<700?55:75))return;De(Y)}else if(_==="cut"){let T=Le(Y,1.055);if(!T)return;x.updateMatrixWorld(!0);let q=x.worldToLocal(T.clone());y.down(q)&&(L=Y.pointerId,u.setPointerCapture(Y.pointerId),A.position.copy(T).add(Zt(0,.028,0)),U()),I()}}}),window.addEventListener("pointermove",Y=>{if(!(!d||!l()||L!==Y.pointerId)){if(ie()){let T=Le(Y,1.06);T&&Ne&&x.position.copy(Re.root.worldToLocal(T.add(Ne)))}else if(_==="dye")b(Y);else if(_==="cut"){let T=Le(Y,1.055);if(T){x.updateMatrixWorld(!0);let q=x.worldToLocal(T.clone());y.move(q),y.onTrack&&(A.position.copy(T).add(Zt(0,.028,0)),U()),I()}}}}),window.addEventListener("pointerup",Y=>{if(Ae===Y.pointerId&&(Ae=null),!(!d||L!==Y.pointerId)){if(ie()){V(),l()&&Ce(Y,Re.moldTarget(),85)?(Z="",y.place()):Z="\u5C06\u7EB8\u5F20\u79FB\u5230\u5DE6\u4FA7\u6A21\u5177\u4E0A\uFF0C\u518D\u677E\u624B\u653E\u6599\u3002",I();return}_==="dye"?X(Y):(y.up(),L=null,I())}});function ve(){d&&(V(),He=!1,_==="cut"&&y.up(),I())}window.addEventListener("craft-book-open",ve),window.addEventListener("pointercancel",ve),window.addEventListener("blur",ve),document.addEventListener("visibilitychange",()=>{document.hidden&&ve()}),je("paper-stock").addEventListener("pointerdown",Y=>{Y.button===0&&(Y.preventDefault(),C())}),je("paper-stock").onclick=Y=>{Y.detail===0&&C()};function he(){d&&(je("stage-hint").textContent=pt(r()).hint,V(),d=!1,je("press-mode-panel").hidden=!0,L=null,H=0,Dt(c),c.visible=!1,je("paper-supplies").hidden=!0,je("dye-context").hidden=!0,document.body.classList.remove("paper-work","press-work"),n.setPaperFocus(!1),n.sync(r()))}return{open(Y,T){he(),d=!0,f=Y,g=T,m=Y.id.includes("leaf"),_=Y.id.includes("dye")?"dye":Y.id.includes("pressing")?"press":"cut",p=ae(),c.visible=!0,n.setPaperFocus(!0),document.body.classList.add("paper-work"),je("paper-supplies").hidden=_!=="dye",je("dye-context").hidden=_!=="dye",je("handwork-title").textContent=Y.name,je("handwork-subtitle").textContent="\u88C1\u65B9\u7EB8 \u2192 \u6D78\u67D3 \u2192 \u9634\u5E72 \u2192 \u6EDA\u8F74\u538B\u7EB9 \u2192 \u88C1\u82B1\u74E3 / \u53F6\u7247 \xB7 \u7B2C "+(T+1)+" / "+Y.total+" \u6279",je("handwork-tool").textContent=_==="dye"?"\u65B9\u7EB8\u7D20\u6750\u5E93 \xB7 \u67D3\u76D8 \xB7 \u540E\u65B9\u9634\u5E72\u67B6":_==="press"?"\u542F\u52A8 \u2192 \u5377\u7EBF\u8FDB\u7EB8 \u2192 \u81EA\u52A8\u505C\u673A \u2192 \u53D6\u7EB8":"\u526A\u5200 \xB7 \u6CBF\u8F68\u8FF9\u5DE6\u952E\u7EED\u526A \xB7 \u677E\u624B\u4FDD\u7559\u8FDB\u5EA6",je("handwork-rotate-left").hidden=je("handwork-rotate-right").hidden=!0,document.body.classList.toggle("press-work",_==="press"),je("press-mode-panel").hidden=_!=="press",je("press-mode").value=ye,je("manual-press-guide").hidden=!ie(),ie()&&(je("handwork-tool").textContent="\u624B\u5DE5\u538B\u78E8\u5177 \xB7 \u68C9\u7EBF \xB7 \u6728\u67C4\u9524"),P(),je("handwork-retry").onclick=()=>{_==="cut"&&l()&&P()},je("handwork-confirm").onclick=()=>{if(l()){if(ie()){if(He){He=!1;return}oe()}else _==="press"?y.phase==="idle"?(y.start(),s.play("petal_pressing")):y.phase==="done"&&o(f.id,g,pe()):_==="cut"&&y.ready?o(f.id,g,pe()):_==="dye"&&re();d&&I()}}},close:he,interact:re,get active(){return d},update(Y){if(!(!d||!l())){if(_==="dye"){if(y.tick(Y),y.phase==="dipping"){let T=n.bathPositions[m?1:0];x.position.lerp(Zt(T.x,T.y+.2-.4*y.depth,T.z+.025),Math.min(1,Y*7))}if(Vo(x.geometry,{leaf:m,dose:y.dose,depth:y.maxDepth}),y.phase==="lifting"){let T=n.bathPositions[m?1:0];x.position.lerpVectors(me,Zt(me.x,1.8,me.z),y.lift*y.lift*(3-2*y.lift))}if(H){H=Math.min(1,H+Y/1);let T=n.rackPositions[(m?6:0)+g];if(x.position.lerp(T,Math.min(1,Y*7)),H===1){o(f.id,g,pe());return}}v.visible=x.visible&&!H,v.position.copy(x.position),Xn(v,x.position.clone().add(Zt(.15,.18,0))),y.phase==="dipping"&&U()}else if(ie())Ae!==null&&y.phase==="winding"&&(y.wind(Y/3.8),U()),y.phase!=="winding"&&(Ae=null),y.tick(Y),Re.update(y);else if(_==="press"){y.tick(Y);let T=y.progress;if(M.update(T,y.rotation),y.phase==="running"){let q=Ot(T/.22);x.position.set(Xt.lerp(4.05,3.08,q),1.32,Xt.lerp(1.76,1.68,q));let te=x.geometry.attributes.position,$=Ot((T-.22)/.66);for(let xe=0;xe<te.count;xe++){let Ie=J[xe*3],F=J[xe*3+1],W=F+$*.84,N=W,S=0;if(W>.26){let z=(W-.26)/.15;N=.26+Math.sin(z)*.15,S=(1-Math.cos(z))*.15}te.setXYZ(xe,Ie,N,S)}te.needsUpdate=!0,x.geometry.computeVertexNormals(),x.geometry.computeBoundingSphere(),x.visible=T<.9,U()}else y.phase==="done"&&(x.visible=!0,x.position.set(4.05,1.045,1.76),x.geometry.attributes.position.array.set(J),x.geometry.attributes.position.needsUpdate=!0,x.geometry.computeVertexNormals(),x.geometry.computeBoundingSphere(),B.visible=!0)}else{let T=y.points[Math.min(y.next,y.points.length-1)];if(w.position.set(T.x,T.y,.009),D.material.color.set(y.failed?"#b33128":y.ready?"#4c7248":"#624a33"),y.ready&&x.userData.cut!==!0){let q=f.id==="paper_cutting"?Wn({dose:0},"square",.62):Wn(p,m?"leaf":"petal");x.geometry.dispose(),x.geometry=q.geometry,q.material.dispose(),x.userData.cut=!0}}if(_==="cut"&&A){A.userData.setOpening(y.dragging&&y.onTrack?.5+.45*Math.sin(performance.now()*.026):.6);let T=Math.min(y.next,y.points.length-1),q=y.points[Math.max(0,T-1)],te=y.points[T];A.rotation.z=-Math.atan2(te.x-q.x,te.y-q.y)}I()}},snapshot(){return{pressMode:_==="press"?ye:null,manualTarget:Re?Te(Re.moldTarget()):null,winding:y?.winding,adherence:y?.adherence,hits:y?.hits,compression:y?.compression,strike:y?.strike,mode:ie()?"manual-press":_==="cut"?"paper-cut":_==="press"?"roller-press":"paper-dye",stage:f?.id,phase:y?.phase,seconds:y?.seconds,simulatedSeconds:y?.simulatedSeconds,context:_==="dye"?Se()?.key:null,stockTarget:_==="dye"?Te(n.paperStock.position):null,rack:_==="dye"?Te(fe()):null,ready:_==="press"?y?.phase==="done":y?.ready,failed:y?.failed,next:y?.next,dose:y?.dose,depth:y?.depth,progress:y?.progress,rotation:y?.rotation,dragging:L!==null,stock:_==="dye"&&y.phase==="stock",waste:r().dyeWaste,profile:p,shape:_==="cut"&&y.ready&&f.id!=="paper_cutting"?m?"leaf":"petal":"square",paper:x?Te(x.getWorldPosition(Zt())):null,paperPosition:x?.getWorldPosition(Zt()).toArray(),bath:_==="dye"?Te(n.bathPositions[m?1:0]):null,bin:E?Te(E):null,outline:_==="cut"?y.points.map(Y=>Te(x.localToWorld(Zt(Y.x,Y.y,0)))):[]}}}}var ot=i=>document.getElementById(i),_i=(i=0,e=0,t=0)=>new k(i,e,t),$x=Math.PI*2;function Qf({scene:i,camera:e,canvas:t,lantern:n,audio:s,getState:r,onGlue:o,onComplete:a,canInteract:l}){let c=new We,u=new We,h=new We;i.add(c,u),n.root.add(h),h.name="workbench-glue-marks";let d=ot("handwork-surface"),f=new Pn,g=document.createElement("span");g.id="decoration-drop-prompt",g.hidden=!0,g.setAttribute("role","status"),document.body.append(g);let _=!1,m,p=0,y=0,x="brush",v=null,D=null,w=null,A=null,B=null,M=null,E=null,O=null,L=!1,H=null,J=0,Z="",K=new We;n.root.add(K),K.name="lining-rotation-pick-shells";for(let N of["lining_upper","lining_lower"])for(let S=1;S<=6;S++){let z=n.registry.get(N+"-"+S),ne=new Ue(z.geometry,new Ft({side:ut,visible:!1}));K.add(ne)}let ge=[],G=()=>xc.includes(m?.id),_e=()=>m.id==="petal_assembly"?"\u82B1\u74E3":m.id==="calyx_assembly"?"\u53F6\u6258":m.id==="lotus_leaf_assembly"?"\u8377\u53F6":m.id==="lining_upper"?"\u7EA2\u7EB8\u7CCA":"\u767D\u8272\u5E95\u7EB8",me=()=>G()?(m.id==="petal_assembly"?"\u7B2C "+(Math.floor(p/bt.petals.perLayer)+1)+" \u5C42 \xB7 ":"")+"\u7B2C "+(p+1)+" "+m.unit+_e():"\u7B2C "+(y+1)+" \u5E45",ye=()=>G()?{glued:ge,installed:Array.from({length:r().counts[m.id]},(N,S)=>S)}:r().lining[m.id];function Re(N,S){N.traverse(z=>{z.material&&(Array.isArray(z.material)?z.material:[z.material]).forEach(S)})}function Ae(N,S,z){Re(N,ne=>{ne.color.set(S),Object.assign(ne,{transparent:!0,opacity:z,side:ut,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})})}function Ne(N){return G()?(ge.includes(N)||ge.push(N),!0):o(m.id,N)}let He=()=>!!H||!l();function ie(){let N=Math.atan2(e.position.x-n.root.position.x,e.position.z-n.root.position.z);if(!G())return _h(y,n.root.rotation.y,N);let S=n.root.worldToLocal(U());return yh(Math.atan2(S.x,S.z),n.root.rotation.y,N)}function de(){return ie().aligned?!0:(P("\u65B9\u4F4D\u672A\u5BF9\u51C6\uFF1A\u8BF7\u6309\u4F4F\u706F\u4F53\u5DE6\u53F3\u65CB\u8F6C\uFF0C\u5C06"+me()+(G()?"\u8F6C\u5411\u81EA\u5DF1\u540E\u518D\u62D6\u5165\u6750\u6599\u3002":"\u8F6C\u5411\u81EA\u5DF1\u540E\u518D\u70B9\u51FB\u3002")),s.play("blocked"),!1)}function Te(){for(let N of[E?.id,O?.id])if(N!==void 0)for(let S of[d,ot("lining-paper")])S.hasPointerCapture?.(N)&&S.releasePointerCapture(N);E=null,O=null}function Le(){if(!_)return;Ce();let N=ie(),S=ot("lining-facing");S.dataset.aligned=String(N.aligned);let z=N.aligned?me()+(G()?" \xB7 \u671D\u5411\u5408\u683C\uFF0C\u62D6\u5165\u6750\u6599\u540E\u677E\u624B\u7C98\u8D34":" \xB7 \u671D\u5411\u5408\u683C\uFF0C\u53EF\u4EE5\u70B9\u51FB\u52A0\u5DE5"):me()+" \xB7 "+(N.error<0?"\u5411\u5DE6":"\u5411\u53F3")+"\u62D6\u52A8\u706F\u4F53\u7EA6 "+Math.round(N.degrees)+"\xB0";S.textContent!==z&&(S.textContent=z),ot("handwork-confirm").disabled=!L||He()||!N.aligned}function Ce(){if(g.hidden=!_||!G()||x!=="paper"||!v,g.hidden)return;let N=Q(v),S=ie().aligned,z=!!E?.over&&S;g.style.left=Math.max(95,Math.min(innerWidth-95,N.x))+"px",g.style.top=Math.max(80,Math.min(innerHeight-70,N.y+42))+"px",g.dataset.ready=String(z);let ne=H?"\u6B63\u5728\u4E0A\u6D46\u8D34\u5408\u2026":S?z?"\u677E\u5F00\u5DE6\u952E \xB7 \u81EA\u52A8\u8D34\u5408":"\u62D6\u5230\u6B64\u5904\uFF0C\u677E\u624B\u7C98\u8D34":"\u5148\u8F6C\u52A8\u706F\u4F53\uFF0C\u5C06\u76EE\u6807\u8F6C\u5411\u81EA\u5DF1";g.textContent!==ne&&(g.textContent=ne)}function Q(N){let S=t.getBoundingClientRect(),z=N.clone().project(e);return{x:S.left+(z.x+1)*S.width/2,y:S.top+(1-z.y)*S.height/2}}function pe(){return G()?[...n.registry.values()].find(N=>N.userData.workflowStage===m.id&&N.userData.order===p):n.registry.get(m.id+"-"+(y+1))}function U(){let N=pe();if(N.updateWorldMatrix(!0,!0),G()&&!N.geometry){let z=new Wt,ne=N.matrixWorld.clone().invert();return N.traverse(be=>{be.geometry&&(be.geometry.computeBoundingBox(),z.union(be.geometry.boundingBox.clone().applyMatrix4(ne.clone().multiply(be.matrixWorld))))}),N.localToWorld(z.getCenter(_i()))}let S=N.geometry;return S.computeBoundingBox(),N.localToWorld(S.boundingBox.getCenter(_i()))}function ae(N,S=!1){let z=Ui(N,S);return N.updateWorldMatrix(!0,!1),N.matrixWorld.decompose(z.position,z.quaternion,z.scale),z}function P(N){Z=N,ot("handwork-status").textContent=N,ot("handwork-status").dataset.ready=String(L)}function I(){if(ot("lining-brush").classList.toggle("selected",x==="brush"),ot("lining-paper").classList.toggle("selected",x==="paper"),ot("lining-brush").setAttribute("aria-pressed",String(x==="brush")),ot("lining-paper").setAttribute("aria-pressed",String(x==="paper")),document.querySelector(".lining-inventory-caption").textContent="1 \u80F6\u5237 \xB7 2 "+_e()+(G()?" \xB7 \u5BF9\u51C6\u677E\u624B\u7C98\u8D34":" \xB7 \u62D6\u5165\u540E\u786E\u8BA4"),ot("lining-paper-name").textContent=_e(),ot("lining-paper-count").textContent=m.total-ye().installed.length,ot("lining-paper").classList.toggle("white-paper",m.id==="lining_lower"),ot("lining-paper").classList.toggle("decoration-paper",G()),ot("lining-paper").classList.toggle("leaf-paper",["calyx_assembly","lotus_leaf_assembly"].includes(m.id)),!G())for(let N=0;N<6;N++){let S=ot("lining-panel-"+N),z=ye().installed.includes(N),ne=ye().glued.includes(N);S.classList.toggle("current",y===N),S.classList.toggle("glued",ne),S.disabled=z||!!H,S.textContent=N+1+" \xB7 "+(z?"\u5DF2\u8D34":ne?"\u5DF2\u6D82":"\u5F85\u6D82"),S.setAttribute("aria-pressed",String(y===N))}ot("handwork-confirm").disabled=!L||He()||!ie().aligned,ot("handwork-retry").disabled=!!H}function V(){if(Dt(u),u.visible=!0,A=B=M=null,x==="brush"){B=new We,u.add(B);let N=new Ue(new mt(.013,.018,.24,10),new ke({color:"#997947",roughness:.85}));B.add(N);let S=new Ue(new Mt(.065,.045,.022),new ke({color:"#8f9180",metalness:.3,roughness:.5}));S.position.y=.135,B.add(S);let z=new Ue(new Mt(.067,.055,.025),new ke({color:"#e7dec0",roughness:1}));z.position.y=.18,B.add(z),B.rotation.z=-.6,M=Fn(B,!1,"brush"),M.scale.setScalar(.7),M.rotation.x=-Math.PI/2,M.rotation.y=-.18,Xn(M,_i(0,-.025,0))}else{if(A=new Ue(new sn(.32,.39,8,8),new ke({color:m.id==="lining_upper"?"#a23046":"#f0e8d4",side:ut,transparent:!0,opacity:.8,roughness:.9})),G()){A.geometry.dispose(),A.material.dispose(),A=Ui(pe()),A.position.set(0,0,0),A.quaternion.identity(),A.scale.setScalar(1);let N=new Wt().setFromObject(A).getCenter(_i());A.position.sub(N),A.scale.setScalar(.5),A.position.multiplyScalar(.5)}u.add(A),G()||(A.rotation.x=-.55,A.rotation.z=-.2),M=Fn(u,!0,"pinch"),M.scale.setScalar(.65),M.rotation.y=-.5,A.updateMatrix(),Xn(M,_i(-.14,-.12,0).applyMatrix4(A.matrix))}u.position.set(innerWidth<700?-.34:-.72,1.3,.76)}function se(){Dt(h),n.root.updateMatrixWorld(!0);for(let N of ye().glued){if(ye().installed.includes(N))continue;let S=G()?pe():n.registry.get(m.id+"-"+(N+1)),z=Ui(S,!0);S.updateWorldMatrix(!0,!1),new rt().copy(n.root.matrixWorld).invert().multiply(S.matrixWorld).decompose(z.position,z.quaternion,z.scale),Ae(z,"#dce8bd",.26),z.userData.gluePanel=N,h.add(z)}}function oe(){se(),Dt(c),D=w=null,v=null,!ye().installed.includes(y)&&(n.root.updateMatrixWorld(!0),D=ae(pe(),!0),Ae(D,ye().glued.includes(y)?"#dce8bd":"#bcc67f",ye().glued.includes(y)?.12:.14),c.add(D),v=U(),w=new Ue(new Cn(.031,12,8),new Ft({color:ye().glued.includes(y)?"#e6f2cc":"#e7d6a0",depthTest:!1})),w.position.copy(v),w.renderOrder=20,c.add(w))}function fe(N,S=!1){!_||H||!S&&!l()||ye().installed.includes(N)||(Te(),L=!1,y=N,J=n.root.rotation.y,oe(),V(),I(),Le(),P(G()||ye().glued.includes(N)?Se():"\u9009\u80F6\u5237\uFF0C\u70B9\u51FB\u706F\u4F53\u4E0A\u9AD8\u4EAE\u7684\u4E00\u5E45\uFF0C\u5148\u6D82\u6D46\u7CCA\u3002"))}function Se(){return G()?"\u62D6\u52A8\u624B\u4E2D\u6216\u4E0B\u65B9\u7269\u54C1\u680F\u7684\u6750\u6599\uFF0C\u5BF9\u51C6\u9AD8\u4EAE\u4F4D\u7F6E\u540E\u677E\u5F00\u5DE6\u952E\uFF0C\u81EA\u52A8\u4E0A\u6D46\u5E76\u7C98\u8D34\u3002":"\u5C06\u7EB8\u6599\u62D6\u5230\u5DF2\u4E0A\u80F6\u7684\u4EAE\u70B9\uFF0C\u677E\u624B\u5B9A\u4F4D\u540E\u70B9\u51FB\u300C\u786E\u8BA4\u7C98\u8D34\u300D\u3002"}function De(N){!_||H||!l()||(Te(),L=!1,x=N,oe(),V(),I(),s.play("tool"),P(N==="brush"?"\u80F6\u5237\u5728\u624B\uFF1A\u70B9\u51FB\u9AD8\u4EAE\u706F\u9762\u6D82\u6D46\u7CCA\u3002":Se()))}function C(){return A?(u.updateWorldMatrix(!0,!0),Q(new Wt().setFromObject(A).getCenter(_i()))):null}function b(N){let S=t.getBoundingClientRect();f.setFromCamera(new we((N.clientX-S.left)/S.width*2-1,-(N.clientY-S.top)/S.height*2+1),e)}function X(N){if(!v)return!1;if(b(N),D&&f.intersectObject(D).length)return!0;let S=Q(v);return Math.hypot(N.clientX-S.x,N.clientY-S.y)<(N.pointerType==="touch"?48:34)}function re(){if(de()){if(ye().glued.includes(y)){P("\u8FD9\u4E2A\u4F4D\u7F6E\u5DF2\u6D82\u597D\u6D46\u7CCA\uFF0C\u53EF\u4EE5\u5207\u6362\u7EB8\u6599\u3002");return}H={type:"glue",time:0,panel:y},s.play("lining_lower"),I(),P("\u80F6\u5237\u8F7B\u626B\u9AA8\u67B6\uFF0C\u94FA\u5F00\u4E00\u5C42\u6D46\u7CCA\u2026")}}function ve(N){!_||He()||x!=="paper"||L||(E={id:N.pointerId},N.preventDefault(),N.currentTarget.setPointerCapture?.(N.pointerId),he(N))}function he(N){if(!E||E.id!==N.pointerId)return;b(N);let S=f.ray.intersectPlane(new Ht().setFromNormalAndCoplanarPoint(e.getWorldDirection(_i()),v),_i());S&&u.position.copy(S),E.over=X(N),w&&w.material.color.set(E.over&&ie().aligned?G()||ye().glued.includes(y)?"#88c68c":"#d58b6a":"#e7d6a0"),Ce()}function Y(){if(Dt(u),A=ae(pe()),u.add(A),u.position.set(0,0,0),Re(A,S=>{S.transparent=!0,S.opacity=.58}),G()){A.userData.finalPosition=A.position.clone(),T(0),w.visible=!1;return}let N=A.geometry.attributes.position;A.userData.finalPositions=N.array.slice(),T(0),w.visible=!1}function T(N){if(G()&&A?.userData.finalPosition){let ce=v.clone().sub(n.root.position);ce.y=0,ce.normalize(),A.position.copy(A.userData.finalPosition).addScaledVector(ce,(1-N)*.16),A.position.y+=(1-N)*.045,Re(A,Fe=>Fe.opacity=.58+N*.42);return}if(!A?.userData.finalPositions)return;let S=A.geometry.attributes.position,z=A.userData.finalPositions,ne=(y+.5)*$x/6,be=Math.sin(ne),Me=Math.cos(ne);for(let ce=0;ce<S.count;ce++){let Fe=z[ce*3],Ze=z[ce*3+1],_t=z[ce*3+2],ht=Fe*be+_t*Me,kn=(1-N)*(.17+.45*(.92-ht));S.setXYZ(ce,Fe+be*kn,Ze+(1-N)*.04,_t+Me*kn)}S.needsUpdate=!0,A.geometry.computeVertexNormals(),A.geometry.computeBoundingSphere(),A.material.opacity=.58+N*.2}function q(N){if(!(!E||E.id!==N.pointerId||N.button!==0)){if(Te(),He()){V();return}if(!de()){V();return}if(!X(N)){V(),P("\u7EB8\u6599\u5C1A\u672A\u5BF9\u9F50\u3002\u8BF7\u62D6\u5230\u706F\u9762\u4E0A\u7684\u9AD8\u4EAE\u70B9\u3002");return}if(G()&&!ye().glued.includes(y)&&(Ne(y),se()),!ye().glued.includes(y)){s.play("blocked"),V(),P("\u9700\u8981\u5148\u6D82\u62B9\u6D46\u7CCA");return}if(L=!0,Y(),I(),G()){te();return}P("\u7EB8\u6599\u5DF2\u5BF9\u9F50\uFF0C\u5C1A\u672A\u6D88\u8017\u3002\u70B9\u51FB\u300C\u786E\u8BA4\u7C98\u8D34\u300D\u8BA9\u7EB8\u9762\u8D34\u5408\u9AA8\u67B6\u3002")}}function te(){!_||He()||!L||!ye().glued.includes(y)||!de()||(L=!1,H={type:"paper",time:0,panel:y},s.play(m.id),I(),P(G()?"\u81EA\u52A8\u4E0A\u6D46\uFF0C\u6B63\u5728\u8D34\u5408"+_e()+"\u2026":"\u7EB8\u6599\u6B63\u5728\u6CBF\u5F27\u9AA8\u8D34\u5408\uFF0C\u8F7B\u8F7B\u629A\u5E73\u8FB9\u7F18\u2026"))}function $(){_&&(Te(),L=!1,H=null,oe(),V(),I(),P("\u672C\u6B21\u672A\u5B8C\u6210\u64CD\u4F5C\u5DF2\u6536\u56DE\uFF1B\u5DF2\u6D82\u6D46\u7CCA\u548C\u5DF2\u8D34\u7EB8\u9762\u4FDD\u7559\u3002"))}function xe(N){if(b(N),n.root.updateMatrixWorld(!0),G()){if(X(N))return!0;let S=[];if(n.root.traverseVisible(z=>{z.isMesh&&S.push(z)}),f.intersectObjects(S,!1).length)return!0}return f.intersectObject(K,!0).length>0}function Ie(){n.root.rotation.y=J,n.root.updateMatrixWorld(!0),D&&(pe().updateWorldMatrix(!0,!1),pe().matrixWorld.decompose(D.position,D.quaternion,D.scale),v=U(),w?.position.copy(v)),Le()}d.addEventListener("pointerdown",N=>{if(!(!_||N.button!==0||He()||E||O)){if(x==="paper"&&!L&&A&&(u.updateWorldMatrix(!0,!0),b(N),f.intersectObject(A,!0).length||f.ray.intersectsBox(new Wt().setFromObject(A)))){ve(N);return}xe(N)&&(O={id:N.pointerId,x:N.clientX,y:N.clientY,angle:n.root.rotation.y,moved:!1},d.setPointerCapture(N.pointerId),N.preventDefault())}}),window.addEventListener("pointermove",N=>{if(!(!_||He()))if(O?.id===N.pointerId){let S=O,z=N.clientX-S.x;Math.hypot(z,N.clientY-S.y)>6&&(S.moved=!0),S.moved&&(L&&(L=!1,V(),w&&(w.visible=!0),I()),J=S.angle+z*yc,Ie(),P("\u6B63\u5728\u8F6C\u52A8\u706F\u4F53 \xB7 \u677E\u624B\u540E\u518D\u70B9\u51FB\u52A0\u5DE5\uFF1B\u62D6\u52A8\u672C\u8EAB\u4E0D\u4F1A\u6D82\u80F6\u6216\u8D34\u7EB8\u3002"))}else he(N)}),window.addEventListener("pointerup",N=>{if(_)if(O?.id===N.pointerId){let S=O;if(Te(),He())return;if(S.moved){Le(),P(ie().aligned?G()?"\u76EE\u6807\u5DF2\u8F6C\u6B63\uFF0C\u62D6\u5165\u6750\u6599\u540E\u677E\u624B\uFF0C\u81EA\u52A8\u4E0A\u6D46\u8D34\u5408\u3002":"\u5F53\u524D\u706F\u9762\u5DF2\u8F6C\u6B63\u3002\u70B9\u51FB\u9AD8\u4EAE\u9762\u6D82\u80F6\uFF0C\u6216\u4ECE\u7269\u54C1\u680F\u62D6\u5165\u7EB8\u6599\u3002":"\u8BF7\u7EE7\u7EED\u65CB\u8F6C\uFF0C\u5C06\u9AD8\u4EAE\u4F4D\u7F6E\u8F6C\u5411\u81EA\u5DF1\u3002");return}if(!de())return;X(N)?x==="brush"?re():L?te():P(G()?"\u62D6\u52A8\u624B\u4E2D\u6750\u6599\u6216\u4ECE\u7269\u54C1\u680F\u62D6\u51FA\u6750\u6599\uFF0C\u653E\u5230\u4EAE\u70B9\u540E\u677E\u624B\u7C98\u8D34\u3002":"\u8BF7\u4ECE\u7269\u54C1\u680F\u62D6\u51FA\u7EB8\u6599\uFF0C\u653E\u5230\u5DF2\u7ECF\u6D82\u80F6\u7684\u706F\u9762\u4EAE\u70B9\u3002"):P("\u8BF7\u70B9\u51FB"+me()+"\u7684\u9AD8\u4EAE\u4F4D\u7F6E\u3002")}else q(N)}),window.addEventListener("craft-book-open",$),window.addEventListener("pointercancel",$),window.addEventListener("blur",$),document.addEventListener("visibilitychange",()=>{document.hidden&&$()}),ot("lining-brush").onclick=()=>De("brush"),ot("lining-paper").addEventListener("pointerdown",N=>{N.button===0&&(De("paper"),ve(N))}),ot("lining-paper").onclick=N=>{N.detail===0&&De("paper")};for(let N=0;N<6;N++)ot("lining-panel-"+N).onclick=()=>fe(N);function F(N,S){_=!0,m=N,p=S,ge=[],x=G()?"paper":"brush",L=!1,H=null,E=null,O=null,J=n.root.rotation.y,c.visible=!0,n.groups.DebugMarkers.visible=!1,document.body.classList.add("lining-work"),ot("lining-panels").hidden=G(),ot("lining-facing").hidden=!1,ot("handwork-title").textContent=G()?N.name+" \xB7 "+(S+1)+" / "+N.total:N.id==="lining_upper"?"\u5148\u4E0A\u6D46\uFF0C\u518D\u88F1\u4E00\u5E45\u7EA2\u7EB8":"\u8584\u65BD\u6D46\u7CCA\uFF0C\u767D\u7EB8\u6253\u5E95",ot("handwork-subtitle").textContent=G()?"\u5408\u706F\u53F0 \xB7 \u5165\u5EA7\u5E73\u89C6 \xB7 \u62D6\u52A8\u706F\u4F53\u8F6C\u6B63 / \u62D6\u5165\u6750\u6599\u540E\u677E\u624B\u7C98\u8D34":"\u5408\u706F\u53F0 \xB7 \u5165\u5EA7\u5E73\u89C6 \xB7 \u5DE6\u952E\u62D6\u52A8\u706F\u4F53\u65CB\u8F6C / \u677E\u624B\u540E\u70B9\u51FB\u52A0\u5DE5",ot("handwork-tool").textContent=G()?"\u8F6C\u6B63\u76EE\u6807\u4F4D\u7F6E \u2192 \u62D6\u5165"+_e()+" \u2192 \u677E\u5F00\u5DE6\u952E\uFF0C\u81EA\u52A8\u4E0A\u6D46\u8D34\u5408":"\u8F6C\u6B63\u76EE\u6807\u4F4D\u7F6E \u2192 1 \u80F6\u5237\u70B9\u6D82 \u2192 2 \u4ECE\u7269\u54C1\u680F\u62D6\u5165"+_e()+" \u2192 \u786E\u8BA4\u7C98\u8D34",ot("handwork-confirm").textContent=G()?"\u786E\u8BA4\u7C98\u8D34 \xB7 \u8D34\u5408"+_e():"\u786E\u8BA4\u7C98\u8D34 \xB7 \u8D34\u5408\u7EB8\u9762",ot("handwork-confirm").hidden=G(),ot("handwork-retry").textContent="\u6536\u56DE\u7EB8\u6599",ot("handwork-retry").hidden=!1,ot("handwork-rotate-left").hidden=ot("handwork-rotate-right").hidden=!0,ot("handwork-confirm").onclick=te,ot("handwork-retry").onclick=$,fe(G()?p:Array.from({length:6},(z,ne)=>ne).find(z=>!ye().installed.includes(z))??0,!0)}function W(){_&&(Te(),_=!1,g.hidden=!0,E=null,L=!1,H=null,Dt(c),Dt(u),Dt(h),D=w=A=B=M=null,v=null,c.visible=u.visible=!1,document.body.classList.remove("lining-work"),ot("lining-panels").hidden=!0,ot("lining-facing").hidden=!0,n.groups.DebugMarkers.visible=!0)}return{open:F,close:W,selectTool:De,get active(){return _},update(N){if(!_||(Le(),!H))return;let S=H;S.time+=N;let z=Math.min(1,S.time/(S.type==="glue"?.85:.95));S.type==="glue"?(u.position.copy(v).add(_i(Math.sin(z*Math.PI*4)*.13,-.12+Math.sin(z*Math.PI)*.06,.1)),D&&Ae(D,"#dce8bd",.14+z*.24),B.rotation.z=-.6+Math.sin(z*Math.PI*4)*.3,z===1&&(H=null,Ne(S.panel)&&(s.play("tool"),oe(),V(),I(),P(G()?"\u6D46\u7CCA\u5DF2\u6D82\u597D\u3002\u4ECE\u4E0B\u65B9\u7269\u54C1\u680F\u62D6\u5165"+_e()+"\uFF0C\u6216\u62D6\u52A8\u624B\u4E2D\u6750\u6599\uFF1B\u5BF9\u51C6\u4EAE\u70B9\uFF0C\u677E\u5F00\u5DE6\u952E\u76F4\u63A5\u7C98\u8D34\u3002":"\u6D46\u7CCA\u5DF2\u6D82\u597D\u3002\u53EF\u9009\u4E0B\u4E00\u5E45\u7EE7\u7EED\u6D82\u80F6\uFF0C\u6216\u6309 2 \u53D6\u7EB8\u7C98\u8D34\u3002")))):(T(z),z===1&&(H=null,a(m.id,p,{mode:G()?"place":"paper",panel:S.panel,quality:1,curve:0,oval:0,dose:1,angle:0,distance:1})||(L=!0,I(),P("\u7EB8\u6599\u5C1A\u672A\u63D0\u4EA4\uFF0C\u8BF7\u68C0\u67E5\u8BE5\u4F4D\u7F6E\u662F\u5426\u5DF2\u4E0A\u80F6\u3002"))))},snapshot(){return{mode:G()?"decoration":"lining",stage:m?.id,panel:y,tool:x,heldTarget:C(),target:v?Q(v):null,ready:L,dragging:!!E,pending:L,animation:H?.type??null,turning:!!O?.moved,rotation:n.root.rotation.y,orientation:ie(),rotationSpeed:yc,rotationTarget:Q(n.root.localToWorld(_i(0,.68,0))),glueMarks:h.children.map(N=>N.userData.gluePanel),glued:_?[...ye().glued]:[],installed:_?[...ye().installed]:[]}}}}var Ni=.4,Rt=i=>document.getElementById(i),ln=(i=0,e=0,t=0)=>new k(i,e,t),ep={bend:["\u56FA\u5B9A\u5DE6\u7AEF\uFF0C\u518D\u62D6\u52A8\u53F3\u7AEF\u5F2F\u5708","\u5148\u70B9\u5DE6\u4FA7\u6728\u9489\uFF1B\u6293\u4F4F\u53F3\u7AEF\u5411\u5DE6\u6536\u62E2\uFF0C\u4E0A\u4E0B\u5FAE\u8C03\u8BA9\u4E24\u7AEF\u76F8\u5408\u3002"],place:["\u62FF\u8D77\u6750\u6599\uFF0C\u5BF9\u51C6\u8F6E\u5ED3\u540E\u56FA\u5B9A","\u62D6\u52A8\u6750\u6599\u5230\u6D45\u8272\u8F6E\u5ED3\uFF1B\u6EDA\u8F6E / Q R \u8C03\u6574\u65B9\u5411\u3002\u677E\u5F00\u540E\u6309\u4F4F\u63A5\u89E6\u70B9\u56FA\u5B9A\u3002"],dye:["\u6D78\u5165\u67D3\u6DB2\uFF0C\u518D\u63D0\u5230\u9634\u5E72\u67B6","\u62D6\u7EB8\u5165\u53F3\u4FA7\u67D3\u76D8\uFF0C\u6D78\u5165\u8D8A\u6DF1\u7740\u8272\u8D8A\u5FEB\uFF1B\u989C\u8272\u9002\u4E2D\u540E\u79FB\u5230\u5DE6\u4E0A\u65B9\u67B6\u5B50\u677E\u624B\u3002"],press:["\u5BF9\u9F50\u7EB8\u5F20\uFF0C\u518D\u6309\u4F4F\u6728\u6A21","\u62D6\u52A8\u7EB8\u5F20\uFF0C\u6EDA\u8F6E / Q R \u5BF9\u9F50\u8F6E\u5ED3\uFF1B\u677E\u5F00\u540E\u6309\u4F4F\u7EB8\u9762\uFF0C\u7B4B\u7EDC\u968F\u538B\u5408\u51FA\u73B0\u3002"],shape:["\u6293\u4F4F\u8FB9\u7F18\uFF0C\u6162\u6162\u5377\u8D77","\u62D6\u52A8\u53F3\u4FA7\u5706\u70B9\u5411\u53F3\u5377\u66F2\uFF1B\u8FC7\u7D27\u65F6\u5411\u5DE6\u56DE\u9000\uFF0C\u4FDD\u7559\u81EA\u7136\u5F27\u5EA6\u540E\u677E\u624B\u3002"],trace:["\u6CBF\u5F15\u7EBF\u79FB\u52A8\u5DE5\u5177","\u6309\u4F4F\u6CBF\u6D45\u8272\u7EBF\u7F13\u6162\u79FB\u52A8\uFF1B\u53EA\u6709\u5DE5\u5177\u7ECF\u8FC7\u7684\u533A\u57DF\u624D\u4F1A\u52A0\u5DE5\uFF0C\u53EF\u5206\u6B21\u8865\u9F50\u3002"],bind:["\u7ED5\u8FC7\u4EA4\u70B9\uFF0C\u9010\u5708\u6536\u7EBF","\u6309\u4F4F\u6CBF\u7EBF\u7ED5\u4E24\u5708\uFF1B\u987A\u7740\u4EAE\u70B9\u7EE7\u7EED\uFF0C\u8D70\u504F\u65F6\u53EF\u4EE5\u56DE\u5230\u672A\u5B8C\u6210\u7684\u5730\u65B9\u3002"],inspect:["\u79FB\u52A8\u9A8C\u706F\u5DE5\u5177\uFF0C\u9010\u5904\u89C2\u5BDF","\u6309\u4F4F\u62D6\u52A8\u5DE5\u5177\uFF0C\u5206\u522B\u5728\u56DB\u4E2A\u68C0\u67E5\u70B9\u7A0D\u4F5C\u505C\u7559\uFF0C\u89C2\u5BDF\u5404\u5904\u7ED3\u6784\u4E0E\u900F\u5149\u3002"]};function tp({canvas:i,lantern:e,audio:t,getState:n,onComplete:s,scene:r,camera:o,world:a,canInteract:l}){let c=new We;r.add(c),c.visible=!1;let u=null,h=null,d=null,f=null,g=0,_=!1,m=null,p=null,y=!1,x=null,v=0,D=0,w,A,B,M,E,O,L,H,J=[],Z,K,ge,G=new Pn,_e=new Ht(ln(0,0,1),0),me=ln(Tt.x,Tt.y,0),ye,Re=(T,q={})=>new ke({color:T,roughness:.87,side:ut,...q});function Ae(T,q,te=c){let $=new Ue(T,q);return te.add($),$}function Ne(T,q,te,$,xe,Ie,F,W=c){let N=Ae(new Mt($,xe,Ie),Re(F),W);return N.position.set(T,q,te),N}function He(T,q,te,$,xe=.2,Ie=c){let F=Ae(new mt(te,te,.035,28),Re($),Ie);return F.rotation.x=Math.PI/2,F.position.set(T,q,xe),F}function ie(T,q="#8b8163",te=1,$=c){let xe=new et().setFromPoints(T),Ie=new vn(xe,new xn({color:q,transparent:!0,opacity:te,depthTest:!1,depthWrite:!1}));return Ie.renderOrder=18,$.add(Ie),Ie}function de(T,q,te=.105){let $=Ae(new Lt(te,.018,6,24),Re("#fbebbb",{depthTest:!1,depthWrite:!1}));return $.renderOrder=20,$.position.set(T,q,Ni),$}function Te(T,q,te,$=1){let xe=document.createElement("canvas");xe.width=512,xe.height=80;let Ie=xe.getContext("2d");Ie.fillStyle="#594f3e",Ie.font='27px "Microsoft YaHei"',Ie.textAlign="center",Ie.fillText(T,256,47);let F=new Zi(xe);F.colorSpace=kt;let W=new rr({map:F,transparent:!0,depthTest:!1,toneMapped:!1}),N=new so(W);return N.position.set(q,te,.35),N.scale.set(2.5*$,.39*$,1),c.add(N),N}function Le(T=!1){let q=new We;c.add(q);let te={press:"press",trace:"brush",inspect:"brush",bend:"bamboo"}[d.mode]||"pinch",$=Fn(q,T,te);return $.rotation.x=Math.PI/2,$.scale.setScalar(2.4),$.position.y=-.22,q.artisanHand=$,q.position.z=1.4,q.rotation.z=T?-.28:.28,q}function Ce(T="#dca6ce",q=!1){let te=new sn(1.05,1.65,16,30),$=te.attributes.position;for(let xe=0;xe<$.count;xe++){let Ie=($.getY(xe)+.825)/1.65;$.setX(xe,$.getX(xe)*(q?Math.pow(Math.sin(Math.PI*Ie),.45):Math.pow(Math.sin(Math.PI*Ie),.65))+.001)}return te.computeVertexNormals(),Ae(te,Re(T))}function Q(){h=null,Dt(c)}function pe(){}function U(){Q(),u=null,J=[],w=null,B=null,ye=null,H=null,ge=null,K=null,Z=null,M=null;let T=d.mode,q=f.id.includes("leaf")||f.id.includes("calyx")||f.id.includes("pod");if(T==="bend"){let te=Array.from({length:97},()=>ln());B=Ae(new et,Re("#aaa36b"));let $=new Float32Array(582),xe=[];for(let Ie=0;Ie<96;Ie++){let F=Ie*2;xe.push(F,F+1,F+2,F+1,F+3,F+2)}B.geometry.setAttribute("position",new Nt($,3)),B.geometry.setIndex(xe),Z=ie(Array.from({length:97},(Ie,F)=>ln(hn.x+Math.sin(F/96*Math.PI*2)*.95,hn.y+(1-Math.cos(F/96*Math.PI*2))*.95,.01)),"#847b55",.42),He(hn.x,hn.y,.09,"#68543b",.3),J.push(de(hn.x,hn.y,.16)),M=de(2.2,-.85,.13),Te("\u56FA\u5B9A\u7AEF",hn.x,-1.25,.6),Te("\u6D3B\u52A8\u7AEF",2,-1.25,.6)}else if(["trace","bind"].includes(T)){T==="bind"?(Ne(0,0,0,2,.11,.1,"#a6a06c"),Ne(0,0,.08,.1,1.9,.1,"#aba770")):(w=Ae(new sn(3.15,1.6,40,20),Re(f.id==="lining_upper"?"#9e4559":"#eee2d0")),A=w.geometry.attributes.position.array.slice(),w.position.z=Ni);let te=d.points.map($=>ln($.x,$.y,Ni));Z=ie(te,"#8a7a61",.35),ye=ie(te,T==="bind"?"#eee0bc":f.id==="paper_cutting"?"#775842":"#f8efdf"),ye.geometry.setDrawRange(0,0),M=de(te[0].x,te[0].y)}else if(T==="inspect")J=d.points.map(te=>de(te.x,te.y,.13));else if(T==="place"){let te=[...e.registry.values()].find($=>$.userData.workflowStage===f.id&&($.userData.order??0)===g);if(te&&f.id==="top_flower_assembly"&&(te.updateWorldMatrix(!0,!0),u=new Wt().setFromObject(te).getCenter(ln()),P()),te){w=new We,c.add(w);let $=te.clone(!0);$.visible=!0,$.traverse(W=>{W.geometry&&(W.geometry=W.geometry.clone()),W.material&&(W.material=W.material.clone(),W.material.vertexColors=!!W.geometry?.attributes.color)}),w.add($),$.position.set(0,0,0),$.rotation.set(0,0,0);let xe=new Wt().setFromObject($),Ie=xe.getSize(ln()),F=xe.getCenter(ln());$.position.sub(F),$.scale.multiplyScalar(1.35/Math.max(Ie.x,Ie.y,Ie.z,.1)),$.position.multiplyScalar(1.35/Math.max(Ie.x,Ie.y,Ie.z,.1))}else w=Ce(q?"#6e8b58":"#d3a0c8",q);Z=w.clone(!0),Z.traverse($=>{$.geometry&&($.geometry=$.geometry.clone()),$.material&&($.material=new Ft({color:"#9b855d",wireframe:!0,transparent:!0,opacity:.22}))}),c.add(Z),Z.position.set(Tt.x,Tt.y,.1),Te("\u63A5\u5408\u4F4D\u7F6E",Tt.x,-1,.7),Te("\u5F85\u88C5\u90E8\u4EF6",Bi.x,-1.35,.7),u&&(Z.visible=!1,c.children.filter($=>$.isSprite).forEach($=>$.visible=!1),w.traverse($=>{$.isMesh&&($.material.depthTest=!1,$.material.depthWrite=!1,$.renderOrder=19)})),M=de(Bi.x,Bi.y)}else{if(w=Ce(T==="dye"?"#eee5d3":q?"#6d8955":"#d6a3c8",q),A=w.geometry.attributes.position.array.slice(),T==="dye"){Ne(.65,.2,-.12,1.9,1.7,.18,"#73684e"),K=Ne(.65,.2,.01,1.72,1.52,.025,q?"#5c714d":"#aa648b"),K.material.roughness=.25,Ne(-1.55,1,-.05,1.25,.95,.06,"#c7b38e");for(let te=0;te<6;te++)Ne(-2.04+te*.2,1,.015,.025,.85,.025,"#82704e");Te("\u9634\u5E72\u67B6",-1.55,1.65,.7),Te("\u67D3\u76D8",.65,-1,.7)}else T==="press"?(Ne(Tt.x,Tt.y,-.1,1.35,1.95,.16,"#97805a"),Z=Ce("#9a895f",q),Z.position.set(Tt.x,Tt.y,.025),Z.material.wireframe=!0,Z.material.transparent=!0,Z.material.opacity=.3,ae(),ge=Ne(Tt.x,Tt.y+.08,1,1.23,1.82,.16,"#9b7c51"),ge.material.transparent=!0,ge.material.opacity=.15,ge.visible=!1):(w.position.set(0,0,Ni),ae(),M=de(.15,.55),Te("\u5377\u66F2\u65B9\u5411 \u2192",.85,-1.25,.8));M||(M=de(Bi.x,Bi.y))}if(E=Le(),O=Le(!0),O.position.set(-2,-1.6,1),O.visible=["bend","shape","trace","bind"].includes(T),L=new We,E.add(L),L.position.set(-.05,.12,.05),["trace","inspect","press"].includes(T)){if(Ne(0,.1,.04,.12,.48,.1,T==="inspect"?"#e4cc7c":"#675b40",L),T==="trace"){let te=Ne(0,.4,.04,.1,.24,.035,"#bac1b6",L);te.rotation.z=-.25}T!=="press"&&Xn(E.artisanHand,L.position.clone().add(ln(0,.1,.04)))}I()}function ae(){H=new We,c.add(H);for(let T=-4;T<=4;T++){let q=ie(Array.from({length:25},(te,$)=>{let xe=$/24;return ln(Math.sin(Math.PI*xe)*T*.082,-.78+xe*1.52,.03)}),"#8c6382",.65,H);q.geometry.userData.original=Array.from(q.geometry.attributes.position.array)}}function P(){u&&(o.updateMatrixWorld(!0),o.getWorldQuaternion(c.quaternion),c.position.copy(u).sub(ln(Tt.x,Tt.y,Ni).multiplyScalar(.3).applyQuaternion(c.quaternion)),c.updateMatrixWorld(!0))}function I(){if(!d)return;P();let T=d,q=T.mode;if(B){let F=B.geometry.attributes.position;for(let W=0;W<=96;W++){let N=W/96,S=N*Math.PI*2*T.curve,z=hn.x+Math.sin(N*Math.PI*2)*.95,ne=hn.y+(1-Math.cos(N*Math.PI*2))*.95,be=Math.min(T.curve,1),Me=Xt.lerp(hn.x+N*3.1,z,be),ce=Xt.lerp(hn.y,ne,be)+T.oval*Math.sin(N*Math.PI)*1.8;T.curve>1&&(Me+=Math.sin(S)*.4*(T.curve-1),ce+=N*(T.curve-1)*1.5);for(let Fe=0;Fe<2;Fe++)F.setXYZ(W*2+Fe,Me,ce+(Fe-.5)*.055,.17)}F.needsUpdate=!0,B.geometry.computeVertexNormals(),B.geometry.computeBoundingSphere(),J[0].material.color.set(T.pinned?"#647950":"#fbebbb")}if(w&&["place","press","dye"].includes(q)&&(w.position.set(T.position.x,T.position.y,.4),w.rotation.z=T.angle*(q==="dye"?0:1)),w&&q==="dye"&&(w.material.color.set("#eee5d3").lerp(new Ye(f.id==="leaf_dye"?"#386546":"#b66097"),Math.min(1,T.dose/1.25)),w.material.roughness=T.dose>0?.45:.9),w&&q==="shape"){let F=w.geometry.attributes.position;for(let W=0;W<F.count;W++){let N=A[W*3],S=A[W*3+1],z=(S+.825)/1.65;F.setXYZ(W,N*(1-T.curve*z*.26)+T.curve*1.5*z*z,S-z*z*T.curve*.34,z*z*T.curve*.95)}F.needsUpdate=!0,w.geometry.computeVertexNormals(),w.geometry.computeBoundingSphere()}if(H)if(H.visible=q!=="press"||T.contact>0,q==="press")H.position.set(Tt.x,Tt.y,.45),H.scale.y=Math.min(1,T.contact/1.05);else if(q==="shape"){H.position.z=Ni;for(let F of H.children){let W=F.geometry.attributes.position,N=F.geometry.userData.original;for(let S=0;S<W.count;S++){let z=N[S*3],ne=N[S*3+1],be=(ne+.825)/1.65;W.setXYZ(S,z*(1-T.curve*be*.26)+T.curve*1.5*be*be,ne-be*be*T.curve*.34,be*be*T.curve*.95+.02)}W.needsUpdate=!0,F.geometry.computeBoundingSphere()}}else H.position.z=.2;if(ge&&(ge.visible=T.placed&&T.dragging,ge.position.z=.7-Math.min(.24,T.contact*.2)),ye&&ye.geometry.setDrawRange(0,T.next),q==="trace"&&w){let F=w.geometry.attributes.position,W=-1.35+T.next/25*2.7;for(let N=0;N<F.count;N++){let S=A[N*3],z=A[N*3+1],ne=S<W&&T.next>0,be=f.id==="paper_cutting",Me=.38*Math.sin((S+1.35)/2.7*Math.PI*2);F.setXYZ(N,S,z-(be&&ne&&z<Me?.055:0),be?ne&&z<Me?.045:0:ne?0:.08*Math.sin(S*10)*Math.sin(z*6))}F.needsUpdate=!0,w.geometry.computeVertexNormals()}if(M){let F=["trace","bind"].includes(q)?T.points[Math.min(T.next,T.points.length-1)]:T.placed?Tt:T.grip;M.position.set(F.x,F.y,Ni),M.material.color.set(T.ready?"#657d50":"#f2dfac")}J.forEach((F,W)=>{q==="inspect"&&F.material.color.set(T.visited.has(W)?"#5d7752":"#f2dfac")}),q==="bend"&&T.pinned&&O.position.set(hn.x+.03,hn.y-.28,1.2),q==="inspect"&&h&&f.id==="final_inspection"&&h.traverse(F=>{F.isPointLight&&(F.intensity=.3+T.visited.size*.35)});let te=m||{x:1.75,y:-1.5};E.position.set(te.x+.15,te.y-.3,1.5),E.visible=!0;let $=!T.ready||T.dragging;Rt("handwork-confirm").disabled!==$&&(Rt("handwork-confirm").disabled=$);let Ie=(f.id==="top_flower_assembly"?T.dragging?Math.hypot(T.position.x-Tt.x,T.position.y-Tt.y)<.34?"\u4F4D\u7F6E\u5408\u9002 \xB7 \u677E\u5F00\u5DE6\u952E\u5B89\u88C5\u82B1\u5934":"\u62D6\u52A8\u82B1\u5934\u5230\u9AD8\u4EAE\u8F6E\u5ED3\uFF0C\u5230\u4F4D\u540E\u677E\u5F00\u5DE6\u952E":T.issue||"\u4ECE\u4E0B\u65B9\u80CC\u5305\u62D6\u51FA\u82B1\u5934\uFF0C\u653E\u5230\u9AD8\u4EAE\u4F4D\u7F6E\u540E\u677E\u624B\u5373\u53EF\u3002":null)||(T.ready?Lr(f.id)?"\u5F27\u5EA6\u5408\u9002\uFF0C\u677E\u5F00\u5DE6\u952E\u81EA\u52A8\u6536\u597D\u3002":"\u672C\u6B21\u52A0\u5DE5\u5DF2\u5B8C\u6210\uFF0C\u53EF\u4EE5\u786E\u8BA4\u3002":T.issue||(q==="bend"?T.pinned?"\u5DE6\u7AEF\u5DF2\u56FA\u5B9A \xB7 \u6536\u62E2\u6D3B\u52A8\u7AEF\uFF0C\u5FAE\u8C03\u5706\u5EA6\u3002":"\u7AF9\u7BFE\u5C1A\u672A\u56FA\u5B9A \xB7 \u5148\u6309\u5DE6\u4FA7\u6728\u9489\u3002":q==="dye"?T.dose<.55?"\u7EB8\u8272\u5C1A\u6D45 \xB7 \u6162\u6162\u6D78\u5165\u67D3\u6DB2\u3002":T.dose<=1.15?"\u7EB8\u8272\u9002\u4E2D \xB7 \u63D0\u5230\u5DE6\u4E0A\u65B9\u9634\u5E72\u67B6\u3002":"\u7EB8\u8272\u8FC7\u6DF1 \xB7 \u6362\u7EB8\u91CD\u505A\u3002":q==="inspect"?"\u5DF2\u68C0\u67E5 "+T.visited.size+" / 4 \u5904":q==="press"&&T.placed?"\u6309\u4F4F\u6A21\u5177\u63A5\u89E6\u5904\uFF0C\u8BA9\u7EB9\u8DEF\u5B8C\u6574\u663E\u73B0\u3002":Oi.includes(f.id)?"\u62D6\u5230\u9AD8\u4EAE\u8F6E\u5ED3\u540E\u677E\u5F00\u5DE6\u952E\uFF0C\u6750\u6599\u4F1A\u81EA\u52A8\u5BF9\u9F50\u7C98\u8D34\u3002":ep[q][1]));if(f.id==="petal_shaping"){let F=T.shapePhase==="form"?"\u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\uFF0C\u6162\u6162\u5377\u8D77\u82B1\u74E3\u3002":T.shapePhase==="pinch"?"\u6210\u5F62\u5B8C\u6210 \xB7 \u6293\u4F4F\u8FB9\u7F18\u5706\u70B9\u5411\u4E0B\u634F\u8FB9\u3002":T.shapePhase==="wire"?"\u634F\u8FB9\u5B8C\u6210 \xB7 \u6293\u4F4F\u5706\u70B9\u5411\u4E0B\u6536\u62E2\u94DC\u4E1D\u56FA\u5B9A\u3002":"\u6210\u5F62\u3001\u634F\u8FB9\u548C\u94DC\u4E1D\u56FA\u5B9A\u5DF2\u5B8C\u6210\u3002";Rt("handwork-subtitle").textContent!==F&&(Rt("handwork-subtitle").textContent=F)}Rt("handwork-status").textContent!==Ie&&(Rt("handwork-status").textContent=Ie),Rt("handwork-status").dataset.ready!==String(T.ready)&&(Rt("handwork-status").dataset.ready=String(T.ready))}function V(){}function se(T){let q=i.getBoundingClientRect();G.setFromCamera(new we((T.clientX-q.left)/q.width*2-1,-(T.clientY-q.top)/q.height*2+1),o);let te=new Ht().setFromNormalAndCoplanarPoint(ln(0,0,1).applyQuaternion(c.quaternion),c.localToWorld(ln(0,0,Ni))),$=G.ray.intersectPlane(te,ln());return $?c.worldToLocal($):ln(100,100,0)}let oe=Rt("handwork-surface"),fe=Rt("inventory-flower"),Se=()=>Math.max(0,n().counts.flower_making-n().counts.top_flower_assembly);fe.addEventListener("dragstart",T=>T.preventDefault()),fe.addEventListener("pointerdown",T=>{!_||f.id!=="top_flower_assembly"||!l()||p!==null||T.button!==0||!Se()||(T.preventDefault(),d.reset(),d.down(Bi),p=T.pointerId,y=!0,x=fe,fe.setPointerCapture(T.pointerId),v=performance.now(),De(T),t.play("tool"))});function De(T){let q=se(T);m={x:q.x,y:q.y};let te=performance.now(),$=d.move(m,(te-v)/1e3);v=te,$&&re(te),I()}window.addEventListener("pointermove",T=>{if(_&&y&&T.pointerId===p){if(!l()){X();return}De(T)}}),window.addEventListener("pointerup",T=>{y&&C(T)}),window.addEventListener("pointercancel",T=>{T.pointerId===p&&X()}),fe.addEventListener("lostpointercapture",T=>{T.pointerId===p&&X()}),oe.addEventListener("pointerdown",T=>{if(!_||!l()||p!==null||T.button!==0)return;T.preventDefault();let q=se(T);m={x:q.x,y:q.y},d.down(m)&&(p=T.pointerId,x=oe,oe.setPointerCapture(T.pointerId),v=performance.now()),I()}),oe.addEventListener("pointermove",T=>{!_||y||!l()||p!==null&&p!==T.pointerId||De(T)});function C(T){if(T.pointerId!==p||T.button!==0)return;if(!l()){X();return}Oi.includes(f.id)&&De(T);let q=y;d.up(),b();let te=Lr(f.id)?d.evidence():null;q&&!te&&(d.reset(),m=null,d.issue="\u5C1A\u672A\u5230\u8FBE\u9AD8\u4EAE\u4F4D\u7F6E\uFF0C\u82B1\u5934\u5DF2\u653E\u56DE\u80CC\u5305\uFF1B\u62D6\u5230\u8F6E\u5ED3\u5904\u518D\u677E\u624B\u3002"),I(),te&&s(f.id,g,te)}function b(){let T=x,q=p;p=null,x=null,y=!1,T&&q!==null&&T.hasPointerCapture(q)&&T.releasePointerCapture(q)}oe.addEventListener("pointerup",C),oe.addEventListener("pointercancel",()=>X()),oe.addEventListener("lostpointercapture",()=>{p!==null&&X()});function X(){let T=y;b(),d?.cancelGesture(),T&&(d?.reset(),m=null),_&&I()}function re(T){T-D>220&&(t.play(f.id==="final_inspection"?"check":f.id),D=T)}function ve(T){d.rotate(T),t.play("tool"),I()}oe.addEventListener("wheel",T=>{_&&(T.preventDefault(),ve(T.deltaY>0?.1:-.1))},{passive:!1});function he(){Rt("handwork-rotate-left").onclick=()=>ve(-.1),Rt("handwork-rotate-right").onclick=()=>ve(.1),Rt("handwork-retry").onclick=()=>{X(),d.reset(),m=null,U()},Rt("handwork-confirm").onclick=()=>{if(!l())return;let T=d.evidence();T&&s(f.id,g,T)}}function Y(){_&&(X(),_=!1,fe.disabled=!0,document.body.classList.remove("flower-placement"),c.visible=!1,Q())}return window.addEventListener("keydown",T=>{_&&(T.code==="KeyQ"&&ve(-.1),T.code==="KeyR"&&ve(.1))}),window.addEventListener("blur",X),document.addEventListener("visibilitychange",()=>{document.hidden&&X()}),window.addEventListener("resize",V),{scene:r,camera:o,get active(){return _},open(T,q){let te=a.stations[T.station];c.position.set(te.x,T.station==="assembly"?1.28:1.04,te.z+(T.station==="assembly"?.6:.35)),c.rotation.x=-Math.PI/2,c.scale.setScalar(.3),c.visible=!0,he(),c.updateMatrixWorld(!0),f=T,g=q,d=new Jo(T.id),m=null,p=null,D=0,_=!0,fe.disabled=T.id!=="top_flower_assembly"||!Se(),document.body.classList.toggle("flower-placement",T.id==="top_flower_assembly"),Rt("handwork").hidden=!1,document.body.classList.add("handworking"),Rt("handwork-title").textContent=T.name,Rt("handwork-subtitle").textContent="\u7B2C "+(q+1)+" / "+T.total+" "+T.unit+" \xB7 "+ep[d.mode][0],Rt("handwork-tool").textContent={bend:"\u53CC\u624B \xB7 \u56FA\u5B9A\u6728\u9489",place:"\u53CC\u624B \xB7 \u7CE8\u7CCA / \u63A5\u5408\u5DE5\u5177",dye:"\u53CC\u624B \xB7 \u67D3\u76D8",press:"\u53CC\u624B \xB7 \u6728\u8D28\u538B\u6A21",shape:"\u53CC\u624B \xB7 \u5377\u66F2\u4E0E\u5B9A\u5F62\u4E1D",trace:T.id==="paper_cutting"?"\u88C1\u7EB8\u5200 \xB7 \u7D20\u7EB8":"\u88F1\u7CCA\u5237 \xB7 \u7EB8\u9762",bind:"\u624E\u7EBF \xB7 \u4EA4\u70B9",inspect:"\u9A8C\u706F\u5DE5\u5177 \xB7 \u7ED3\u6784\u89C2\u5BDF"}[d.mode],Rt("handwork-confirm").hidden=Lr(T.id),T.id==="top_flower_assembly"?Rt("handwork-subtitle").textContent="\u4ECE\u4E0B\u65B9\u80CC\u5305\u62D6\u51FA\u82B1\u5934 \u2192 \u5BF9\u51C6\u9AD8\u4EAE\u8F6E\u5ED3 \u2192 \u677E\u5F00\u5DE6\u952E\u5B89\u88C5":Oi.includes(T.id)?Rt("handwork-subtitle").textContent="\u62D6\u52A8\u82B1\u5934 / \u83B2\u84EC\u5230\u9AD8\u4EAE\u8F6E\u5ED3\uFF0C\u677E\u5F00\u5DE6\u952E\u76F4\u63A5\u8D34\u5408\uFF0C\u65E0\u9700\u518D\u6B21\u6309\u4F4F\u6216\u786E\u8BA4":Lr(T.id)&&(Rt("handwork-subtitle").textContent="\u62D6\u52A8\u5706\u70B9\u5377\u66F2\u5B9A\u5F62\uFF0C\u5F27\u5EA6\u5408\u683C\u540E\u677E\u5F00\u5DE6\u952E\u6536\u597D");let $=["place","press"].includes(d.mode)&&!Oi.includes(T.id);Rt("handwork-rotate-left").hidden=!$,Rt("handwork-rotate-right").hidden=!$,U(),Rt("handwork-close").focus()},update(T,q){_&&(d.tick(T,m)&&re(q),I())},snapshot(){return d?{stage:f.id,mode:d.mode,ready:d.ready,inventoryDrag:y,flowerStock:Se(),dragging:d.dragging,pinned:d.pinned,curve:d.curve,oval:d.oval,position:{...d.position},angle:d.angle,dose:d.dose,contact:d.contact,next:d.next,placed:d.placed,visited:[...d.visited],grip:{...d.grip},issue:d.issue,shapePhase:d.shapePhase,formed:d.formed,edgePinched:d.edgePinched,wireFixed:d.wireFixed}:null},project(T){let q=c.localToWorld(ln(T.x,T.y,Ni)).project(o),te=i.getBoundingClientRect();return{x:te.left+(q.x+1)*te.width/2,y:te.top+(1-q.y)*te.height/2}},close:Y}}var it=i=>document.getElementById(i),cn=(i=0,e=0,t=0)=>new k(i,e,t),np=["big-ring","mouth-ring","waist-hoop"],dc=["\u5927\u5708","\u53E3\u5708","\u8170\u7B8D","\u7EB5\u5411\u7AF9\u6761","\u8F83\u77ED\u7AF9\u7BFE"],ai=new Set(["frame_assembly","frame_short_binding"]);function ip({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:a,onInstall:l,onNext:c,canInteract:u}){let h=new We,d=new We,f=new We,g=new We;i.add(h,d,f,g);let _=!1,m,p=0,y=null,x=new Oo,v=0,D=null,w=null,A,B,M,E,O,L,H,J=null,Z=null,K=null,ge=0,G="",_e=0,me=null,ye=new Pn,Re=it("handwork-surface");function Ae(F){let W=F.clone().project(e),N=t.getBoundingClientRect();return{x:N.left+(W.x+1)*N.width/2,y:N.top+(1-W.y)*N.height/2}}function Ne(F){let W=t.getBoundingClientRect();ye.setFromCamera(new we((F.clientX-W.left)/W.width*2-1,-(F.clientY-W.top)/W.height*2+1),e)}function He(F,W=1.2){return Ne(F),ye.ray.intersectPlane(new Ht(cn(0,1,0),-W),cn())}function ie(F,W=!1){it("handwork-status").textContent!==F&&(it("handwork-status").textContent=F),it("handwork-status").dataset.ready=String(W)}function de(F){D&&D.material.emissive.set(0),D=F,F&&F.material.emissive.set("#5a6934"),Re.style.cursor=F?"pointer":"default"}function Te(F){Ne(F);let W=ye.intersectObjects(n.bambooStock.filter(z=>z.visible))[0];if(W)return W.object;let N=null,S=matchMedia("(pointer:coarse)").matches?27:13;for(let z of n.bambooStock.filter(ne=>ne.visible)){let ne=Ae(z.getWorldPosition(cn())),be=Math.hypot(ne.x-F.clientX,ne.y-F.clientY);be<S&&(S=be,N=z)}return N}function Le(F){let W=o();return F===3?12-W.counts.frame_assembly:F===4?3-(W.frameItems?.shortBinding??W.counts.frame_short_binding??0):Dn(W).includes(F)&&!W.frameItems.placedRings.includes(F)?1:0}function Ce(){Dt(f),H=O=L=null}function Q(F){!_&&document.body.classList.contains("handworking")||me||_&&!u()||!Number.isInteger(F)||F<0||F>4||(v=F,G="",pe(),ae(),_&&ai.has(m.id)&&De(),r.play("tool"))}function pe(){for(let F=0;F<5;F++){let W=it("item-"+F),N=Le(F);if(!W)continue;W.querySelector(".item-count").textContent=String(N);let S=_||!document.body.classList.contains("handworking");W.disabled=!S,W.classList.toggle("selected",S&&v===F),W.classList.toggle("empty",!N),W.setAttribute("aria-pressed",String(S&&v===F)),W.setAttribute("aria-label",dc[F]+"\uFF0C\u5269\u4F59 "+N+"\uFF0C\u5FEB\u6377\u952E "+(F+1))}H&&!Le(v)&&Ce()}function U(F){return F===4?n.bambooStock.find(W=>W.userData.stockIndex>=16):s.registry.get(F===3?"rib-"+(Math.min(11,o().counts.frame_assembly)+1):np[F])}function ae(){if(Ce(),!Le(v))return;f.position.set(0,0,0),f.quaternion.identity();let F=U(v);H=Ui(F),f.add(H),H.position.set(0,0,0),H.scale.multiplyScalar(.48);let W=new Wt().setFromObject(H),N=W.getCenter(cn());H.position.sub(N),H.updateMatrix(),O=Fn(f,!0,"bamboo"),L=Fn(f,!1,"bamboo"),O.scale.setScalar(.85),L.scale.setScalar(.85);let S=H.geometry.parameters?.path,z=F.userData.radius??.21,ne=S?v===3?[S.getPoint(.25),S.getPoint(.75)]:[cn(-z*.8,z*.6,0),cn(z*.8,z*.6,0)]:[cn(-.14,0,0),cn(.14,0,0)];O.rotation.y=-.35,L.rotation.y=.35,[O,L].forEach((be,Me)=>Xn(be,ne[Me].applyMatrix4(H.matrix))),f.position.set(_&&ai.has(m.id)?innerWidth<700?-.45:-.9:-3.35,1.2,_&&ai.has(m.id)?.55:-.78),f.visible=!_||ai.has(m.id)||m.id==="rings_ready"}function P(){for(let F=0;F<3;F++){let W=it("ring-type-"+F),N=Dn(o()).includes(F);W.disabled=N||x.selected,W.setAttribute("aria-pressed",String(y===F)),W.textContent=dc[F]+(N?" \xB7 \u5DF2\u505A\u597D":y===F?" \xB7 \u5DF2\u9009":"")}}for(let F=0;F<3;F++)it("ring-type-"+F).onclick=()=>{!_||m.id!=="bamboo_prep"||x.selected||!u()||Dn(o()).includes(F)||(y=F,G="",P(),se(),r.play("tool"))};function I(F,W=x.curve){let N=Math.PI*2*W,S=Bo[y??0];if(N<.001)return cn((F-.5)*S,0,0);let z=S/N,ne=(F-.5)*N,be=Math.sin(N/2)/(N/2);return cn(Math.sin(ne)*z,0,-z*(Math.cos(ne)-be))}function V(){Dt(h),h.position.set(-3.35,1.2,-1.35),h.visible=!0;let F=128,W=new Float32Array((F+1)*4*3),N=[];for(let ne=0;ne<F;ne++)for(let be=0;be<4;be++){let Me=ne*4+be,ce=ne*4+(be+1)%4;N.push(Me,ce,Me+4,ce,ce+4,Me+4)}let S=new et;S.setAttribute("position",new Nt(W,3)),S.setIndex(N),A=new Ue(S,new ke({color:"#b7a16a",roughness:.87,side:ut})),A.castShadow=!0,h.add(A),M=Fn(h,!0,"bamboo"),E=Fn(h,!1,"bamboo"),M.scale.setScalar(.68),E.scale.setScalar(.68),B=new We,h.add(B);for(let ne=0;ne<5;ne++){let be=new Ue(new Lt(.017,.006,5,24),new ke({color:"#f6efda",roughness:1}));be.rotation.y=Math.PI/2,be.position.x=(ne-2)*.013,B.add(be)}let z=new Ue(new sn(.07,.2),new ke({color:"#fff5df",side:ut,roughness:1}));z.rotation.x=-Math.PI/2,z.position.z=.1,B.add(z),se()}function se(){if(!A)return;A.visible=M.visible=E.visible=x.selected,B.visible=x.binding;let F=A.geometry.attributes.position;for(let z=0;z<=128;z++){let ne=z/128,be=(ne-.5)*Math.PI*2*x.curve,Me=I(ne);for(let ce=0;ce<4;ce++){let Fe=ce<2?-1:1,Ze=(ce===0||ce===3?-1:1)*ko/2;F.setXYZ(z*4+ce,Me.x-Math.sin(be)*Fe*ws/2,Ze,Me.z-Math.cos(be)*Fe*ws/2)}}F.needsUpdate=!0,A.geometry.computeVertexNormals(),A.geometry.computeBoundingSphere();let W=I(0),N=I(1);M.rotation.y=-.25-x.curve*.5,E.rotation.y=.25+x.curve*.5,Xn(M,I(Ho[0])),Xn(E,I(Ho[1])),B.position.copy(W),B.children.forEach((z,ne)=>{z.visible=ne<5?x.wrapping>ne*.15:!0,ne<5?z.scale.setScalar(Math.min(1,Math.max(.01,(x.wrapping-ne*.15)*7))):(z.scale.y=1-x.wrapping*.92,z.rotation.z=x.wrapping*Math.PI*6)});let S=x.ready&&!x.direction;it("handwork-confirm").disabled=!S,it("bend-meter").value=x.curve/1.2,it("bend-value").textContent=Math.round(x.curve*100)+"%",it("bend-gauge").dataset.state=x.curve>oc?"over":S?"ready":"bending",ie(x.binding?"\u6B63\u5728\u7528\u767D\u7EB8\u7F20\u4F4F\u63A5\u5934\u2026 \u5B8C\u6210\u540E\u7AF9\u5708\u81EA\u52A8\u5165\u680F\u3002":x.selected?x.issue:G||(y===null?"\u5148\u9009\u62E9\u7AF9\u5708\u7C7B\u578B\uFF0C\u518D\u62FF\u8D77\u7AF9\u7BFE\u5F00\u59CB\u5F2F\u66F2\u3002":"\u5DF2\u9009"+dc[y]+"\uFF1A\u70B9\u51FB\u53F0\u9762\u7AF9\u7BFE\u5F00\u59CB\u5F2F\u66F2\u3002"),S)}function oe(F){if(y===null){G="\u5148\u5728\u4E0B\u65B9\u9009\u62E9\u8981\u5236\u4F5C\u7684\u5927\u5708\u3001\u53E3\u5708\u6216\u8170\u7B8D\u3002";return}!F||x.selected||(de(null),w=F,x.select(F.userData.stockIndex),F.visible=!1,G="",r.play("tool"),se(),P())}function fe(F){if(F.updateWorldMatrix(!0,!1),F.userData.partType==="ring")return F.parent.localToWorld(cn(F.userData.radius,F.userData.height,0));let W=F.geometry.attributes.position;return F.localToWorld(cn(W.getX(Math.floor(W.count*.52)),W.getY(Math.floor(W.count*.52)),W.getZ(Math.floor(W.count*.52))))}function Se(){let F=o().frameItems?.shortBinding??0,W=[-1,1,0][F%3]*Math.PI/2;return s.root.localToWorld(cn(Math.sin(W)*.76,1.04,Math.cos(W)*.76))}function De(){if(Dt(d),J=null,Z=null,!_||!ai.has(m.id))return;s.root.updateMatrixWorld(!0);let F=o(),W=m.id==="frame_short_binding"?[4]:[0,1,2,3];for(let N of W){if(!Le(N))continue;let S=U(N),z=Ui(S,!0);N===4?(z.position.copy(Se()),z.rotation.y=Math.atan2(z.position.x,z.position.z),z.scale.multiplyScalar(.7)):(S.updateWorldMatrix(!0,!1),S.matrixWorld.decompose(z.position,z.quaternion,z.scale)),z.traverse(ne=>{ne.isMesh&&ne.material?.opacity!==void 0&&(ne.material.opacity=v===N?.68:.15)}),d.add(z),N===v&&(J=N===4?Se():fe(S),Z=new Ue(new Cn(N===4?.055:.045,12,8),new Ft({color:"#eff6b8",transparent:!0,opacity:.95,depthTest:!1})),Z.position.copy(J),Z.renderOrder=12,d.add(Z))}d.visible=!0}function C(){return _&&ai.has(m.id)&&Le(v)>0&&(m.id==="frame_short_binding"||v<3||o().frameItems.placedRings.length===3)}function b(F){if(!J)return!1;let W=Ae(J);return Math.hypot(F.clientX-W.x,F.clientY-W.y)<(F.pointerType==="touch"?54:38)}function X(F){me||!u()||!_||!ai.has(m.id)||!Le(v)||(K={id:F.pointerId,generation:_e},G="",F.currentTarget.setPointerCapture&&F.currentTarget.setPointerCapture(F.pointerId),F.preventDefault(),re(F))}function re(F){if(!K)return;let W=He(F,1.35);W&&f.position.copy(W),Z&&Z.material.color.set(b(F)&&C()?"#87d293":"#eff6b8")}function ve(){Ce(),d.visible=!1,Dt(g),g.visible=!0;let F=U(v),W=Ui(F);F.updateWorldMatrix(!0,!1),F.matrixWorld.decompose(W.position,W.quaternion,W.scale),g.add(W);let N=[];if(v===3)for(let z of np){let ne=s.registry.get("binding-"+(p+1)+"-"+z),be=Ui(ne);ne.updateWorldMatrix(!0,!1),ne.matrixWorld.decompose(be.position,be.quaternion,be.scale),g.add(be),N.push(be)}else if(v===4)for(let z=0;z<3;z++){let ne=new Ue(new Lt(.035,.005,6,20),new ke({color:"#f5ead0",roughness:1}));ne.position.copy(J),ne.position.y+=z*.012,ne.rotation.x=Math.PI/2,ne.scale.setScalar(.72),g.add(ne),N.push(ne)}else{let z=new We;z.position.copy(J),g.add(z);for(let ne=0;ne<5;ne++){let be=new Ue(new Lt(.026,.004,6,28),new ke({color:"#f5ead0",roughness:1}));be.rotation.y=Math.PI/2,be.position.x=(ne-2)*.01,z.add(be)}N.push(z)}for(let z of N)z.traverse(ne=>{ne.geometry&&ne.geometry.setDrawRange(0,0)});let S=Fn(g,!1,"pinch");S.scale.setScalar(.75),me={elapsed:0,item:v,index:p,generation:_e,joints:N,hand:S},r.play("frame_assembly"),r.play("frame_binding"),G="\u5F53\u524D\u90E8\u4EF6\u6B63\u5728\u7F20\u7EBF\u56FA\u5B9A\uFF0C\u8BF7\u7A0D\u5019\u2026"}function he(){let F=me;me=null,Dt(g),!(!F||F.generation!==_e||!(F.item<3?l(F.item):a(m.id,F.index,{mode:"place",quality:1,curve:0,oval:0,dose:0,angle:0,distance:1.5,strip:F.item===4?16+(o().frameItems.shortBinding??0):void 0}))||F.generation!==_e)&&(G="\u8FD9\u4E00\u4EF6\u5DF2\u7ED1\u7262\uFF0C\u7EE7\u7EED\u653E\u7F6E\u4E0B\u4E00\u4E2A\u90E8\u4EF6\u3002",p=o().counts.frame_assembly,Le(v)||(v=m.id==="frame_short_binding"?4:[0,1,2,3].find(N=>Le(N))??3),pe(),ae(),De())}function Y(F){if(!me)return;let W=me;W.elapsed+=F;let N=Math.min(1,W.elapsed/1.35),S=N*W.joints.length;W.joints.forEach((ne,be)=>{let Me=Math.max(0,Math.min(1,S-be));ne.traverse(ce=>{if(ce.geometry){let Fe=ce.geometry.index?.count??ce.geometry.attributes.position.count;ce.geometry.setDrawRange(0,Math.floor(Fe*Me/3)*3)}})});let z=W.joints[Math.min(W.joints.length-1,Math.floor(S))];W.hand.rotation.y=Math.sin(N*24)*.35,Xn(W.hand,z.position.clone().add(cn(Math.cos(N*24)*.035,.025,Math.sin(N*24)*.035))),N===1&&he()}function T(F){if(!K||F.pointerId!==K.id)return;let W=u()&&b(F)&&C();K=null,W?ve():(G=v===3&&o().frameItems.placedRings.length<3?"\u5148\u653E\u597D\u4E09\u4E2A\u7AF9\u5708\uFF0C\u518D\u8FDE\u63A5\u7EB5\u5411\u7AF9\u6761\u3002":"\u5C1A\u672A\u653E\u5165\u4EAE\u70B9\uFF0C\u8BF7\u62D6\u5230\u5F53\u524D\u90E8\u4EF6\u7684\u6D45\u7EFF\u8272\u8F6E\u5ED3\u5904\u3002",r.play("blocked"),ae())}function q(){x.release(),_&&m.id==="bamboo_prep"&&se()}function te(){q(),K=null,me&&(me=null,Dt(g),_&&De(),G="\u7ED1\u624E\u5DF2\u53D6\u6D88\uFF0C\u6750\u6599\u672A\u6D88\u8017\u3002"),de(null),_&&ai.has(m.id)&&ae()}Re.addEventListener("contextmenu",F=>F.preventDefault()),Re.addEventListener("pointerdown",F=>{if(!(!_||!u()))if(m.id==="bamboo_prep"){if(F.button!==0&&F.button!==2||(F.preventDefault(),x.binding))return;if(!x.selected){F.button===0&&oe(Te(F));return}x.hold(F.button===2?-1:1),Re.setPointerCapture(F.pointerId)}else ai.has(m.id)&&F.button===0&&X(F)}),Re.addEventListener("pointermove",F=>{!_||!u()||m.id==="bamboo_prep"&&!x.selected&&de(Te(F))}),window.addEventListener("pointermove",F=>{K&&u()&&F.pointerId===K.id&&re(F)}),window.addEventListener("pointerup",F=>{q(),K&&T(F)}),window.addEventListener("craft-book-open",q),window.addEventListener("pointercancel",te),window.addEventListener("blur",te),document.addEventListener("visibilitychange",()=>{document.hidden&&te()});for(let F=0;F<5;F++)it("item-"+F).addEventListener("pointerdown",W=>{W.button===0&&(Q(F),X(W))}),it("item-"+F).onclick=W=>{W.detail===0&&Q(F)};for(let[F,W]of[["bend-in",1],["bend-out",-1]]){let N=it(F);N.addEventListener("pointerdown",S=>{!_||m.id!=="bamboo_prep"||!u()||(S.preventDefault(),x.hold(W),N.setPointerCapture(S.pointerId))}),N.addEventListener("pointerup",q),N.addEventListener("lostpointercapture",q)}function $(){it("ring-choice").hidden=!0,_=!1,_e++,te(),w&&(n.sync(o()),w=null),Dt(h),Dt(d),Dt(g),me=null,Ce(),A=B=M=E=null,h.visible=d.visible=f.visible=!1,s.groups.DebugMarkers.visible=!0}function xe(F,W){$(),_=!0,m=F,p=W,y=null,x=new Oo,G="",s.groups.DebugMarkers.visible=!1,h.visible=F.id==="bamboo_prep",it("handwork-title").textContent=F.id==="bamboo_prep"?"\u4E00\u7BFE\uFF0C\u5F2F\u6210\u4E00\u53EA\u5708":"\u5148\u642D\u5927\u7B50\uFF0C\u518D\u6536\u53E3",it("handwork-subtitle").textContent=F.id==="bamboo_prep"?"\u58F9 \xB7 \u624E\u67B6\u53F0 / \u8FDE\u7EED\u5236\u5708 \xB7 \u7B2C "+(W+1)+" / 3 \u53EA \xB7 \u81EA\u9009\u5236\u4F5C\u987A\u5E8F":F.id==="frame_short_binding"?"\u8086 \xB7 \u5927\u7B50\u4E3B\u4F53\u5B8C\u6210\u540E \xB7 \u53D6\u4E09\u6839\u8F83\u77ED\u7AF9\u7BFE\u9010\u6839\u6346\u624E\u6536\u53E3":"\u53C1 \xB7 \u5408\u706F\u53F0 / \u62D6\u5165\u9AD8\u4EAE\u70B9\u4F4D \u2192 \u81EA\u52A8\u7F20\u7EBF \u2192 \u9501\u5B9A\uFF0C\u518D\u653E\u4E0B\u4E00\u4EF6",it("handwork-tool").textContent="\u539F\u5DE5\u574A\u573A\u666F \xB7 45\xB0 \u659C\u4FEF\u89C6",it("handwork-rotate-left").hidden=it("handwork-rotate-right").hidden=!0,it("bend-gauge").hidden=F.id!=="bamboo_prep",it("bend-controls").hidden=F.id!=="bamboo_prep",it("handwork-confirm").textContent="\u786E\u8BA4\u56FA\u5B9A \xB7 \u7EB8\u7247\u7ED1\u624E",it("handwork-confirm").hidden=F.id!=="bamboo_prep",it("handwork-retry").hidden=F.id!=="bamboo_prep",it("handwork-next").hidden=!0,it("handwork-retry").onclick=()=>{x.binding||(te(),n.sync(o()),w=null,x.reset(),G="",V(),P())},it("handwork-confirm").onclick=()=>{u()&&x.confirm()&&(r.play("frame_binding"),it("handwork-retry").disabled=!0)},F.id==="bamboo_prep"?(it("ring-choice").hidden=!1,P(),V()):(v=F.id==="frame_short_binding"?4:[0,1,2,3].find(N=>Le(N))??3,ae(),De()),pe()}function Ie(){$(),_=!0,m={id:"rings_ready"},it("handwork-title").textContent="\u4E09\u53EA\u7AF9\u5708\uFF0C\u6536\u597D\u5F85\u88C5",it("handwork-subtitle").textContent="\u5927\u5708 \xB7 \u53E3\u5708 \xB7 \u8170\u7B8D\u5DF2\u5165\u7269\u54C1\u680F\u3002\u7AF9\u6761\u4ECD\u7559\u5728\u53F0\u4E0A\uFF0C\u4E0D\u5FC5\u9000\u51FA\u5DE5\u4F5C\u53F0\u3002",it("bend-gauge").hidden=it("bend-controls").hidden=!0,it("handwork-confirm").hidden=it("handwork-retry").hidden=!0,it("handwork-next").hidden=!1,it("handwork-next").textContent="\u5F00\u59CB\u642D\u6846 \u2192 \u5408\u706F\u53F0",it("handwork-next").onclick=c,ie("\u7AF9\u5708\u5DF2\u6536\u8FDB\u4E0B\u65B9\u7269\u54C1\u680F\u3002\u51C6\u5907\u597D\u540E\uFF0C\u5E73\u6ED1\u79FB\u6B65\u5408\u706F\u53F0\u7EE7\u7EED\u7EC4\u88C5\u3002",!0),pe()}return{open:xe,close:$,completedRings:Ie,selectItem:Q,refreshInventory:pe,get active(){return _},update(F,W){if(!_){H&&(e.updateMatrixWorld(),f.position.copy(e.localToWorld(cn(.26,-.32,-.85))),f.quaternion.copy(e.quaternion));return}if(m.id==="bamboo_prep"){if(x.tick(F),x.direction&&W-ge>330&&(r.play("bamboo_prep"),ge=W),se(),x.finished){x.finished=!1;let N=_e,S={...x.evidence(),ringType:y};it("handwork-retry").disabled=!1,a(m.id,p,S)&&_e===N&&(G="\u7AF9\u5708\u5DF2\u5165\u680F\u3002")}}else if(ai.has(m.id)){if(Y(F),!_||!ai.has(m.id))return;Z&&Z.scale.setScalar(1+Math.sin(W*.004)*.14),ie(G||(m.id==="frame_short_binding"?"\u62D6\u52A8\u8F83\u77ED\u7AF9\u7BFE\u5230\u5C0F\u5708\u9644\u8FD1\u7684\u9AD8\u4EAE\u70B9 \xB7 \u5DF2\u6346 "+o().frameItems.shortBinding+"/3":"\u62D6\u52A8 "+dc[v]+" \u5230\u9AD8\u4EAE\u70B9 \xB7 \u7AF9\u5708 "+o().frameItems.placedRings.length+"/3 \xB7 \u7EB5\u6761 "+o().counts.frame_assembly+"/12"))}},snapshot(){return{stage:m?.id,mode:m?.id==="bamboo_prep"?"bend":"inventory-place",ringType:y,curve:x.curve,ready:x.ready,selected:x.selected,strip:x.strip,binding:x.binding||!!me,wrapping:me?me.elapsed/1.35:x.wrapping,item:v,mounting:!!me,stripLength:Bo[y??0],stripWidth:ws,gripSpacing:I(Ho[0]).distanceTo(I(Ho[1])),dragging:!!K,target:J?Ae(J):null,stock:n.bambooStock.filter(F=>F.visible).map(F=>({index:F.userData.stockIndex,...Ae(F.getWorldPosition(cn()))})),inventory:[0,1,2,3,4].map(Le)}}}}var St=i=>document.getElementById(i);function sp({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:a,onInstall:l,onGlue:c,onDiscardDye:u,onFocus:h,onSelectTool:d,onExit:f,isMoving:g}){let _=!1,m=null,p=null,y=!1,x=jf({scene:i,camera:e,canvas:t,world:n,audio:r,getState:o,onComplete:E,onDiscardDye:u,canInteract:()=>!g()&&!document.querySelector("dialog[open]")}),v=tp({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:E,canInteract:()=>!g()&&!document.querySelector("dialog[open]")}),D=Qf({scene:i,camera:e,canvas:t,lantern:s,audio:r,getState:o,onGlue:c,onComplete:E,canInteract:()=>!g()&&!document.querySelector("dialog[open]")}),w=ip({scene:i,camera:e,canvas:t,world:n,lantern:s,audio:r,getState:o,onComplete:E,onInstall:l,onNext:()=>B(pt(o()),!0),canInteract:()=>!g()&&!document.querySelector("dialog[open]")});function A(){for(let L of["handwork-confirm","handwork-retry"])St(L).hidden=!1,St(L).disabled=!1;St("handwork-confirm").textContent="\u786E\u8BA4\u672C\u6B21\u624B\u4F5C \u2192",St("handwork-retry").textContent="\u91CD\u505A\u672C\u6B21",St("bend-gauge").hidden=St("bend-controls").hidden=St("handwork-next").hidden=!0}function B(L,H=!1){let J=rs(L.id)!==rs(p?.id);v.close(),w.close(),D.close(),x.close(),A(),p=L,y=!1,_=!0,St("handwork").hidden=!1,document.body.classList.add("handworking"),(H||J||m!==L.station)&&h(L.station,L.id),m=L.station,d(L.tool),["bamboo_prep","frame_assembly","frame_short_binding"].includes(L.id)?w.open(L,o().counts[L.id]):rs(L.id)?D.open(L,o().counts[L.id]):Vf.includes(L.id)?x.open(L,o().counts[L.id]):L.tool?v.open(L,o().counts[L.id]):M(L),St("handwork-close").onclick=O,w.refreshInventory()}function M(L){v.close(),w.close(),D.close(),x.close(),y=!0,p=L,A(),St("handwork-title").textContent=L.name,St("handwork-subtitle").textContent="\u4ECD\u5728\u539F\u5DE5\u574A \xB7 \u5DF2\u5B8C\u6210\u7684\u6750\u6599\u548C\u90E8\u4EF6\u5168\u90E8\u4FDD\u7559",St("handwork-tool").textContent="\u4E0B\u4E00\u9053\u5DE5\u5E8F",St("handwork-confirm").hidden=St("handwork-retry").hidden=St("handwork-rotate-left").hidden=St("handwork-rotate-right").hidden=!0,St("handwork-next").hidden=!L.tool,St("handwork-next").textContent="\u7EE7\u7EED \u2192 "+n.stations[L.station].name,St("handwork-next").onclick=()=>B(L,!0),St("handwork-status").textContent=L.tool?"\u672C\u5DE5\u4F4D\u5DF2\u5B8C\u6210\uFF0C\u53EF\u4EE5\u524D\u5F80\u4E0B\u4E00\u5F20\u5DE5\u4F5C\u53F0\u3002":"\u7EB8\u5F20\u6B63\u5728\u901A\u98CE\u9634\u5E72\uFF0C\u5E72\u900F\u540E\u7EE7\u7EED\u538B\u6A21\u3002"}function E(L,H,J){if(!_||g()||!a(L,H,J))return!1;let Z=pt(o());return o().complete?(O(),!0):L==="bamboo_prep"&&Z.id==="frame_assembly"?(w.completedRings(),p=Z,w.refreshInventory(),!0):Z.station!==m||!Z.tool?(M(Z),w.refreshInventory(),!0):(B(Z),!0)}function O(){_&&(v.close(),w.close(),D.close(),x.close(),_=!1,y=!1,St("handwork").hidden=!0,document.body.classList.remove("handworking","workbench-moving"),f?.(m),St("craft-action").focus())}return window.addEventListener("keydown",L=>{if(document.querySelector("dialog[open]")||_&&L.target.matches?.("#press-mode, #handwork-confirm, #hint-toggle, #help-toggle")&&["Space","Enter","ArrowUp","ArrowDown"].includes(L.code))return;if(_&&x.active&&L.code==="KeyE"){L.preventDefault(),L.stopImmediatePropagation(),L.repeat||x.interact();return}if(_&&D.active&&/^Digit[1-2]$/.test(L.code)){L.preventDefault(),L.stopImmediatePropagation(),L.repeat||D.selectTool(L.code==="Digit1"?"brush":"paper");return}let H=/^Digit([1-5])$/.exec(L.code);if(H&&(_&&!v.active&&!D.active&&!x.active||L.altKey&&!D.active)){L.preventDefault(),L.stopImmediatePropagation(),L.repeat||w.selectItem(Number(H[1])-1);return}if(_&&(L.code==="Escape"&&(L.preventDefault(),L.stopImmediatePropagation(),O()),["Space","KeyE","KeyF","KeyZ","KeyY","Tab"].includes(L.code)&&(L.preventDefault(),L.stopImmediatePropagation(),L.code==="Tab"))){let J=[...St("handwork").querySelectorAll("button, select"),...St("craft-inventory").querySelectorAll("button"),St("hint-toggle"),St("help-toggle")].filter(K=>!K.hidden&&!K.disabled&&K.getClientRects().length),Z=J.indexOf(document.activeElement);J[(Z+(L.shiftKey?-1:1)+J.length)%J.length]?.focus()}},!0),{scene:i,camera:e,get active(){return _},open(L,H){B(L,!0)},close:O,refreshInventory:()=>w.refreshInventory(),update(L,H){if(!document.querySelector("dialog[open]")&&(w.update(L,H),!!_&&(document.body.classList.toggle("workbench-moving",g()),g()||(v.update(L,H),D.update(L,H),x.update(L,H)),y&&!p.tool))){let J=pt(o());J.id!==p.id&&M(J)}},snapshot(){return{active:_,station:m,moving:g(),...w.active?w.snapshot():D.active?D.snapshot():x.active?x.snapshot():v.active?v.snapshot():{stage:p?.id,mode:"waiting"}}},project:L=>v.project(L)}}function rp(i=document){let e=null;i.addEventListener("touchstart",t=>{let n=t.target.closest?.("button:not([data-key])"),s=t.touches[0];e=n&&!n.disabled&&t.touches.length===1?{button:n,id:s.identifier,x:s.clientX,y:s.clientY}:null},{passive:!0}),i.addEventListener("touchmove",t=>{if(!e)return;let n=[...t.touches].find(s=>s.identifier===e.id);(!n||t.touches.length!==1||Math.hypot(n.clientX-e.x,n.clientY-e.y)>10)&&(e=null)},{passive:!0}),i.addEventListener("touchcancel",()=>e=null,{passive:!0}),i.addEventListener("touchend",t=>{let n=e;if(e=null,!n||t.touches.length)return;let s=[...t.changedTouches].find(r=>r.identifier===n.id);!s||n.button.disabled||!n.button.contains(document.elementFromPoint(s.clientX,s.clientY))||(t.preventDefault(),n.button.focus({preventScroll:!0}),n.button.click())},{passive:!1})}rp();var Ee=i=>document.getElementById(i),Kt;try{Kt=new ec({canvas:Ee("scene"),antialias:!0,alpha:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"})}catch(i){throw Ee("loading").innerHTML="<p>\u5F53\u524D\u6D4F\u89C8\u5668\u672A\u80FD\u542F\u7528 WebGL\u3002<br>\u8BF7\u5F00\u542F\u786C\u4EF6\u52A0\u901F\u540E\u5237\u65B0\u3002</p>",i}Kt.setPixelRatio(Math.min(devicePixelRatio,1.65));Kt.setSize(innerWidth,innerHeight);Kt.shadowMap.enabled=!0;Kt.shadowMap.type=sl;Kt.outputColorSpace=kt;Kt.toneMapping=dl;Kt.toneMappingExposure=1.08;var wr=new no,tt=new Gt(48,innerWidth/innerHeight,.06,40),On=Wf(wr),jt=zf();jt.root.position.set(0,1.08,0);jt.root.scale.setScalar(.86);wr.add(jt.root);var Sr=null,fc=!0,hp=!1;try{let i=localStorage.getItem(Zo);if(i)try{Sr=nh(JSON.parse(i))}catch{}if(!Sr&&!i){let e=localStorage.getItem(vh);if(e)try{Sr=kf(JSON.parse(e)),hp=!!Sr}catch{}}}catch{fc=!1}var Ve=new nc(Sr||Ss()),Yn=!1,Mn=!1,pc="bamboo",mc="assembly",Vt=null,Xo=!1,qo=!1,As=-1,Zx=!1;var Jx=-1e4,op=null,ap="",dp=-10,Rs=!1,lp=0,cp=0,Wo=0,Jt=new Set,up=new Pn,Ts=new k,Er=new pn(0,0,0,"YXZ"),yi=null,fp=Hf();jt.sync(fp);On.sync(fp);var pp=new k(3.45,2.8,4.8),mp=new k(-.7,1.78,0);tt.position.copy(pp);tt.lookAt(mp);function nn(i){i===ap&&Ee("toast").classList.contains("visible")||(ap=i,Ee("toast").textContent=i,Ee("toast").classList.add("visible"),clearTimeout(op),op=setTimeout(()=>Ee("toast").classList.remove("visible"),2800))}function gp(){try{localStorage.setItem(Zo,JSON.stringify(Ve.state)),fc=!0}catch{fc=!1}Ee("save-status").textContent=fc?"\u8FDB\u5EA6\u5DF2\u81EA\u52A8\u4FDD\u5B58 \xB7 \u672C\u673A":"\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528 \xB7 \u672C\u6B21\u8FDB\u5EA6\u6682\u5B58\u5185\u5B58"}var ah;try{ah=localStorage}catch{}function _p(i){Ee("sound-toggle").textContent=i.available?`\u97F3\u6548\uFF1A${i.enabled&&i.volume>0?"\u5F00":"\u5173"}`:"\u97F3\u6548\u4E0D\u53EF\u7528",Ee("sound-toggle").setAttribute("aria-pressed",String(i.enabled)),Ee("sound-toggle").disabled=!i.available,Ee("sound-volume").value=String(Math.round(i.volume*100)),Ee("sound-volume-value").textContent=Math.round(i.volume*100)+"%",Ee("sound-volume").disabled=!i.available}var gt=Yf({storage:ah,onChange:_p});_p(gt.snapshot());function yp(i){for(let e of document.querySelectorAll("[data-music-toggle]"))e.textContent=i.error?"\u97F3\u4E50\uFF1A\u91CD\u8BD5":i.blocked?"\u97F3\u4E50\uFF1A\u70B9\u51FB\u64AD\u653E":`\u97F3\u4E50\uFF1A${i.enabled?"\u5F00":"\u5173"}`,e.setAttribute("aria-pressed",String(i.enabled)),e.title="\u80CC\u666F\u97F3\u4E50\uFF1A\u8D75\u5FBD\u67D4 \u2014 \u6F2B\u591C\u661F\uFF08\u72EC\u7ACB\u4E8E\u5236\u4F5C\u97F3\u6548\uFF09";Ee("music-volume").value=String(Math.round(i.volume*100)),Ee("music-volume-value").textContent=Math.round(i.volume*100)+"%"}var li=xh({storage:ah,onChange:yp});yp(li.snapshot());document.querySelectorAll("[data-music-toggle]").forEach(i=>i.onclick=()=>li.toggle());Ee("music-volume").oninput=i=>li.setVolume(Number(i.target.value)/100);var En=sp({canvas:Ee("scene"),scene:wr,camera:tt,world:On,lantern:jt,audio:gt,getState:()=>Ve.state,onComplete:ev,onInstall:i=>Ve.installRing(i)?(Bn(),!0):!1,onDiscardDye:()=>Ve.discardDye()?(Bn(),!0):!1,onGlue:(i,e)=>Ve.glue(i,e)?(Bn(),!0):!1,onFocus:jx,onSelectTool:i=>{i&&Cs(i)},isMoving:()=>!!Vt,onExit:i=>{Jt.clear(),qn(i)}});bh({getStage:()=>Ve.state.stage,onOpen:Ps});function Cs(i){Yn&&pc!==i&&gt.play("tool"),pc=i}var xp=[["largeRing","\u5927\u5708","ring ring-0","\u5DF2\u624E\u597D\u7684\u5927\u5708\uFF0C\u5B89\u88C5\u5230\u9AA8\u67B6\u540E\u6263\u9664"],["mouthRing","\u53E3\u5708","ring ring-1","\u5DF2\u624E\u597D\u7684\u53E3\u5708\uFF0C\u5B89\u88C5\u5230\u9AA8\u67B6\u540E\u6263\u9664"],["waistRing","\u8170\u7B8D","ring ring-2","\u5DF2\u624E\u597D\u7684\u8170\u7B8D\uFF0C\u5B89\u88C5\u5230\u9AA8\u67B6\u540E\u6263\u9664"],["cutPaper","\u526A\u7EB8","cut-paper","\u5F85\u67D3\u65B9\u7EB8\u53CA\u5DF2\u88C1\u6210\u5F62\u7684\u82B1\u74E3\u3001\u53F6\u7247\uFF1B\u67D3\u8272\u6216\u5B89\u88C5\u540E\u6263\u9664"],["dyedPaper","\u67D3\u7EB8","dyed-paper","\u6309\u5B9E\u9645\u64CD\u4F5C\u4EFD\u6570\u8BA1\uFF1A\u4E00\u4EFD\u7C89\u7D2B\u7EB8\u5BF9\u5E946\u7247\u82B1\u74E3\u7528\u7EB8\uFF0C\u4E00\u4EFD\u7EFF\u8272\u7EB8\u5BF9\u5E947\u7247\u53F6\u7247\u7528\u7EB8\uFF1B\u9634\u5E72\u548C\u538B\u7EB9\u4E0D\u589E\u51CF\uFF0C\u88C1\u5F62\u540E\u6263\u9664\u4E00\u4EFD"]];for(let[i,[e,t,n,s]]of xp.entries()){let r=i<3?Ee("item-"+i):document.createElement("div");i>=3&&(r.className="inventory-item stock-item",r.tabIndex=0,r.innerHTML=`<i class="item-drawing ${n}" aria-hidden="true"></i><span>${t}${e==="dyedPaper"?" / \u4EFD":""}</span><b class="item-count">0</b>`,Ee("inventory-slots").insertBefore(r,Ee("lining-brush"))),r.dataset.stock=e,r.title=s}new ResizeObserver(()=>document.documentElement.style.setProperty("--inventory-height",Ee("craft-inventory").offsetHeight+"px")).observe(Ee("craft-inventory"));function Kx(){let i=Bf(Ve.state),e=th(Ve.state),t=Math.max(0,Ve.state.counts.flower_making-Ve.state.counts.top_flower_assembly),n=Ee("inventory-flower");n.querySelector(".item-count").textContent=String(t),n.classList.toggle("empty",t===0),n.title="\u82B1\u5934\uFF0C\u5269\u4F59 "+t+" \u7EC4\u3002\u63A5\u82B1\u5934\u65F6\u4ECE\u80CC\u5305\u62D6\u5230\u9AD8\u4EAE\u8F6E\u5ED3\uFF0C\u677E\u5F00\u5DE6\u952E\u5B89\u88C5\u3002",n.setAttribute("aria-label",n.title);for(let[s,r,,o]of xp){let a=document.querySelector(`[data-stock="${s}"]`),l=i[s],c=s==="dyedPaper"?"\u4EFD":s.endsWith("Ring")?"\u4E2A":"\u5F20",u=s==="dyedPaper"?`\u7C89\u7D2B ${e.pink} \u4EFD\uFF0C\u7EFF\u8272 ${e.green} \u4EFD\u3002`:"";a.querySelector("b").textContent=String(l),a.classList.toggle("empty",l===0),a.title=`${r}\uFF0C\u5269\u4F59 ${l} ${c}\u3002${u}${o}`,a.setAttribute("aria-label",a.title)}}function Is(){let i=pt(Ve.state),e=Ve.state.counts[i.id],t=ic(Ve.state),n=Ve.state.complete;Ee("stage-number").textContent=`${String(lt.slice(0,Ve.state.stage+1).filter(r=>!r.automatic).length).padStart(2,"0")} / ${lt.filter(r=>!r.automatic).length}`,Ee("stage-title").textContent=n?"\u706F\u6210\uFF0C\u82B1\u5F00":i.name,Ee("stage-hint").textContent=n?"\u8FD9\u76CF\u706F\u5DF2\u7ECF\u5B8C\u6210\u3002\u8F6C\u52A8\u706F\u4F53\u3001\u9010\u5C42\u9690\u85CF\u82B1\u74E3\uFF0C\u6216\u5C55\u5F00\u67E5\u770B\u6BCF\u4E00\u4E2A\u8FDE\u63A5\u90E8\u4EF6\u3002":i.hint,Ee("stage-count").textContent=`${e} / ${i.total} ${i.unit}`,Ee("stage-percent").textContent=`${Math.round(e/i.total*100)}%`,Ee("stage-bar").style.width=`${e/i.total*100}%`;let s=ic(Ve.state,"leaves");Ee("inventory").textContent=`\u82B1\u74E3\uFF1A\u5F85\u88C1 ${t.raw} \xB7 \u6E7F\u7EB8 ${t.wet} \xB7 \u538B\u7EB9\u65B9\u7EB8 ${t.pressed} \xB7 \u5DF2\u88C1\u74E3 ${t.trimmed}
\u5B9A\u5F62 ${t.formed} \xB7 \u5DF2\u8D34 ${t.installed} / 36
\u53F6\u7247\uFF1A\u6E7F\u7EB8 ${s.wet} \xB7 \u538B\u7EB9\u65B9\u7EB8 ${s.pressed} \xB7 \u5DF2\u88C1\u53F6 ${s.trimmed} \xB7 \u5DF2\u88C5 ${s.installed} / 14`,Ee("inventory").style.whiteSpace="pre-line",Ee("phase-title").textContent=`\u9636\u6BB5 ${i.phase+1} / 8 \xB7 ${Cr[i.phase]}`,Ee("phase-track").innerHTML=Cr.map((r,o)=>`<span class="${n||o<i.phase?"done":o===i.phase?"current":""}" title="${o+1} \xB7 ${r}" ${!n&&o===i.phase?'aria-current="step"':""}>${o+1}. ${r}</span>`).join(""),Ee("action-location").textContent=n?"\u4F5C\u54C1 001 \xB7 \u79E6\u6DEE\u8377\u82B1\u706F":On.stations[i.station].name,Ee("action-text").textContent=n?"\u6B23\u8D4F\u6210\u54C1 \xB7 \u67E5\u770B\u5236\u4F5C\u6210\u679C":"\u52A8\u624B \xB7 "+i.action,Ee("craft-action").disabled=i.id==="paper_drying",Ee("go-station").innerHTML=`\u524D\u5F80${On.stations[i.station].name.split("\xB7")[1]} <span>\u2197</span>`,Ee("total-progress").textContent=`\u5168\u7A0B ${Of(Ve.state)}%`,Ee("undo").disabled=!Ve.history.length,Ee("redo").disabled=!Ve.future.length,Ee("light-toggle").disabled=!n,Ee("skip-stage").disabled=Ee("handwork-skip-stage").disabled=n,Ee("previous-stage").disabled=Ee("handwork-previous-stage").disabled=Ve.state.stage===0,Ee("frame-toggle").setAttribute("aria-pressed",String(Xo)),Ee("explode-toggle").setAttribute("aria-pressed",String(qo)),Ee("layer-toggle").textContent=As<0?"\u9690\u85CF\u82B1\u74E3\u5C42":`\u5DF2\u9690\u85CF\u7B2C ${As+1} \u5C42`,Kx(),Cs(i.tool),Ee("view-mode").textContent=Mn?"\u7B2C\u4E00\u4EBA\u79F0 \xB7 \u81EA\u7531\u8D70\u52A8":"\u7B2C\u4E00\u4EBA\u79F0 \xB7 \u5DE5\u4F4D\u8FD1\u666F",Ee("free-walk").innerHTML=Mn?"\u56DE\u5230\u5F53\u524D\u5DE5\u4F4D <kbd>F</kbd>":"\u81EA\u7531\u8D70\u52A8 <kbd>F</kbd>",Ee("touch-movement").hidden=!(Mn&&matchMedia("(pointer:coarse)").matches)}function Bn(){jt.sync(Ve.state),On.sync(Ve.state),Is(),En.refreshInventory(),gp()}function Tr(){Xo=!1,qo=!1,As=-1,jt.restore(),document.querySelectorAll("[data-part]").forEach(i=>i.checked=!0),Is()}function xi(){Zx=!1,Ee("hold-progress").style.width="0%"}function Ps(){document.pointerLockElement&&document.exitPointerLock(),Jt.clear(),xi()}function Ar(i){Ps();let e=Ee(i);e.open||e.showModal()}function jx(i,e){Ps(),Mn=!1,mc=i,document.body.classList.remove("freewalk"),document.body.classList.toggle("sitting-down",rs(e));let t=On.stations[i],n=rs(e),s=new k(t.x,n?1.25:i==="assembly"||i==="dye"?1.43:1.08,t.z),r=n?3.55:i==="assembly"?2.35:i==="dye"?2.2:1.75,o=n?new k(t.x,1.58,t.z+3.55):s.clone().add(new k(0,r,r)),a=new Gt;a.position.copy(o),a.lookAt(s),Vt={start:performance.now(),duration:n?1450:1100,seated:n,from:tt.position.clone(),to:o,qFrom:tt.quaternion.clone(),qTo:a.quaternion.clone()}}function qn(i){Ps(),Mn=!1,document.body.classList.remove("freewalk","sitting-down"),mc=i;let e=On.stations[i],t=e.look.clone(),n=e.position.clone();i==="assembly"&&(innerWidth<700?(n.set(0,2.35,3.4),t.set(0,2.25,0)):(n.set(0,2.08,3.13),t.set(0,1.92,0)));let s=new Gt;s.position.copy(n),s.lookAt(t),Vt={start:performance.now(),from:tt.position.clone(),to:n,qFrom:tt.quaternion.clone(),qTo:s.quaternion.clone()},Is()}function vp(i=!1){li.start(),gt.resume(),gt.play("enter"),i||(Ve.reset(),gp()),Yn=!0,Rs=Ve.state.complete,jt.root.rotation.y=0,Ee("intro").hidden=!0,Ee("hero-caption").hidden=!0,Ee("game-ui").hidden=!1,document.body.classList.add("playing"),Tr(),Bn(),qn(pt(Ve.state).station),nn(i?hp?"\u5DF2\u4FDD\u7559\u65E7\u7248\u7AF9\u9AA8\u8FDB\u5EA6\uFF0C\u8BF7\u7EE7\u7EED\u88F1\u7CCA\u4E0E\u540E\u7EED\u5236\u4F5C\u3002":"\u6B22\u8FCE\u56DE\u6765\uFF0C\u63A5\u7740\u505A\u8FD9\u76CF\u706F\u3002":"\u5148\u9009\u7AF9\u7BFE\uFF0C\u5728\u624E\u67B6\u53F0\u5F2F\u51FA\u4E09\u53EA\u5708\u6761\u3002")}Ee("begin").onclick=()=>vp(!1);Ee("resume").hidden=!Sr;Ee("resume").onclick=()=>vp(!0);Ee("hint-toggle").onclick=()=>{let i=document.body.classList.toggle("guide-minimized");Ee("guide-content").hidden=i,Ee("hint-toggle").setAttribute("aria-expanded",String(!i)),Ee("hint-toggle").textContent=i?"\u5C55\u5F00\u6307\u5BFC \uFF0B":"\u6700\u5C0F\u5316 \u2212",Ee("hint-toggle").title=i?"\u5C55\u5F00\u5DE5\u5E8F\u6307\u5BFC":"\u6700\u5C0F\u5316\u5DE5\u5E8F\u6307\u5BFC"};Ee("go-station").onclick=()=>qn(pt(Ve.state).station);Ee("home-view").onclick=()=>qn("assembly");function Qx(){let i=pt(Ve.state),e=On.stations[i.station];if(Math.hypot(tt.position.x-e.x,tt.position.z-e.z)>(i.station==="assembly"?3.45:2.65))return!1;if(Mn){tt.getWorldDirection(Ts);let n=new k(e.x,1.25,e.z).sub(tt.position).normalize();return Ts.dot(n)>.6}return mc===i.station}function lh(){if(!Yn||En.active||document.querySelector("dialog[open]"))return!1;if(Ve.state.complete)return Ar("complete-dialog"),!1;if(Vt)return nn("\u6B63\u5728\u524D\u5F80\u5DE5\u4F4D\uFF0C\u8BF7\u7A0D\u5019\u3002"),!1;if(!Qx())return gt.play("blocked"),nn(`\u8BF7\u524D\u5F80${On.stations[pt(Ve.state).station].name}\uFF0C\u9762\u5411\u5DE5\u4F5C\u53F0\u5236\u4F5C\u3002`),!1;let i=pt(Ve.state);return i.tool?(Cs(i.tool),Ps(),Tr(),En.open(i,Ve.state.counts[i.id]),!0):!1}function ev(i,e,t){let n=pt(Ve.state);if(n.id!==i||Ve.state.counts[n.id]!==e)return!1;let s=Ve.state.stage,r=Ve.act(n.tool,Date.now(),t);return r.ok?(Jx=performance.now(),dp=Wo,gt.play(r.stage),Bn(),Ve.state.stage!==s&&(lt[s].phase!==pt(Ve.state).phase&&gt.play("phase_done"),xi(),nn(`${lt[s].name}\u5B8C\u6210 \xB7 \u4E0B\u4E00\u6B65\uFF1A${pt(Ve.state).name}`)),Ve.state.complete&&!Rs&&(Rs=!0,xi(),qn("assembly"),setTimeout(()=>Ar("complete-dialog"),850)),!0):(gt.play("blocked"),nn(r.message),!1)}Ee("craft-action").addEventListener("click",lh);function tv(){if(!Yn||Ve.state.complete||document.querySelector("dialog[open]"))return;let i=Ve.skipStage();if(!i.ok){nn(i.message);return}let e=En.active;En.close(),Ps(),yi=null,Tr();let t=pt(Ve.state);t.tool&&Cs(t.tool),gt.play("ui"),Bn(),nn(i.message+(Ve.state.complete?"":" \xB7 \u4E0B\u4E00\u6B65\uFF1A"+t.name)),Ve.state.complete?(Rs=!0,qn("assembly"),Ar("complete-dialog")):e?En.open(t,Ve.state.counts[t.id]):qn(t.station)}Ee("skip-stage").onclick=Ee("handwork-skip-stage").onclick=tv;function nv(){if(!Yn||document.querySelector("dialog[open]"))return;let i=Ve.previousStage();if(!i.ok){nn(i.message);return}let e=En.active;xi(),En.close(),Ps(),yi=null,Tr(),Rs=!1;let t=pt(Ve.state);t.tool&&Cs(t.tool),gt.play("undo"),Bn(),nn(i.message),e?En.open(t,Ve.state.counts[t.id]):qn(t.station)}Ee("previous-stage").onclick=Ee("handwork-previous-stage").onclick=nv;window.addEventListener("pointerup",xi);Ee("undo").onclick=()=>{xi(),Ve.undo()&&(gt.play("undo"),Rs=!1,Bn(),nn("\u5DF2\u64A4\u9500\u4E0A\u4E00\u6B65\u3002"))};Ee("redo").onclick=()=>{Ve.redo()&&(gt.play("ui"),Bn(),nn("\u5DF2\u91CD\u505A\u4E0A\u4E00\u6B65\u3002"))};Ee("reset-stage").onclick=()=>{xi(),Ve.resetStage()?(Bn(),nn("\u672C\u5DE5\u5E8F\u5DF2\u91CD\u7F6E\u3002")):nn("\u672C\u6B21\u6253\u5F00\u540E\uFF0C\u5F53\u524D\u5DE5\u5E8F\u5C1A\u65E0\u53EF\u91CD\u7F6E\u7684\u64CD\u4F5C\u3002")};Ee("restart").onclick=()=>Ar("reset-dialog");Ee("confirm-reset").onclick=()=>{Ee("reset-dialog").close(),Ve.reset(),Rs=!1,Tr(),Bn(),qn("bamboo"),Cs("bamboo")};Ee("frame-toggle").onclick=()=>{Xo=!Xo,jt.setFrame(Xo),Is()};Ee("explode-toggle").onclick=()=>{qo=!qo,jt.setExploded(qo),Is()};Ee("layer-toggle").onclick=()=>{As=As===bt.petals.layers-1?-1:As+1,jt.setLayer(As),Is()};Ee("restore-view").onclick=Tr;Ee("light-toggle").onclick=()=>{Ve.state.complete&&(Ve.state.lit=!Ve.state.lit,gt.play(Ve.state.lit?"light_on":"light_off"),Bn())};for(let i of document.querySelectorAll("[data-part]"))i.onchange=()=>jt.setPartVisibility(i.dataset.part,i.checked);Ee("reference-open").onclick=()=>Ar("reference-dialog");Ee("help-toggle").onclick=()=>Ar("help-dialog");for(let i of document.querySelectorAll("[data-close]"))i.onclick=()=>i.closest("dialog").close();for(let i of document.querySelectorAll("[data-ref]"))i.onclick=()=>{document.querySelectorAll("[data-ref]").forEach(e=>e.classList.toggle("active",e===i)),Ee("reference-image").src=`./workshop/references/${i.dataset.ref}.png`,Ee("reference-image").alt=i.dataset.ref==="finished"?"\u7528\u6237\u63D0\u4F9B\u7684\u8377\u82B1\u706F\u6210\u54C1\u56DB\u89C6\u56FE":"\u7528\u6237\u63D0\u4F9B\u7684\u771F\u5B9E\u5236\u4F5C\u8FC7\u7A0B\u56FE\u8C31"};Ee("keep-looking").onclick=()=>{Ee("complete-dialog").close(),qn("assembly")};Ee("capture").onclick=()=>{Kt.render(wr,tt);let i=document.createElement("a");i.download="\u79E6\u6DEE\u8377\u82B1\u706F-\u6211\u7684\u4F5C\u54C1.png",i.href=Kt.domElement.toDataURL("image/png"),i.click(),nn("\u4F5C\u54C1\u7559\u5F71\u5DF2\u4FDD\u5B58\u3002")};Ee("sound-toggle").onclick=()=>{gt.setEnabled(!gt.snapshot().enabled),gt.snapshot().enabled&&gt.play("tool")};Ee("sound-volume").oninput=i=>gt.setVolume(Number(i.target.value)/100);Ee("sound-volume").onchange=()=>gt.play("check");var iv=new Set(["go-station","home-view","frame-toggle","explode-toggle","layer-toggle","restore-view","reset-stage","reference-open","help-toggle","keep-looking","capture","hint-toggle","free-walk"]);document.addEventListener("click",i=>{let e=i.target.closest("button");e&&(iv.has(e.id)||e.hasAttribute("data-close")||e.hasAttribute("data-ref"))&&gt.play("ui")});document.addEventListener("visibilitychange",()=>{document.hidden?(gt.pause(),li.pause()):(gt.resume(),li.resume())});window.addEventListener("pagehide",()=>{gt.pause(),li.pause()});window.addEventListener("pageshow",()=>{gt.resume(),li.resume()});window.addEventListener("focus",()=>{document.hidden||(gt.resume(),li.resume())});function bp(){if(Yn){if(Mn){qn(pt(Ve.state).station);return}Vt=null,Mn=!0,document.body.classList.add("freewalk"),Is(),nn("WASD \u79FB\u52A8 \xB7 \u70B9\u51FB\u573A\u666F\u540E\u7528\u9F20\u6807\u73AF\u987E \xB7 Esc \u91CA\u653E\u9F20\u6807")}}Ee("free-walk").onclick=bp;function Mp(i,e){Er.setFromQuaternion(tt.quaternion),Er.y-=i*.0024,Er.x=Xt.clamp(Er.x-e*.0024,-1.25,1.25),Er.z=0,tt.quaternion.setFromEuler(Er)}Ee("scene").addEventListener("click",()=>{Yn&&Mn&&!matchMedia("(pointer:coarse)").matches&&Ee("scene").requestPointerLock?.()?.catch?.(()=>nn("\u9F20\u6807\u9501\u5B9A\u4E0D\u53EF\u7528\uFF0C\u53EF\u6309\u4F4F\u53F3\u952E\u62D6\u52A8\u89C6\u89D2\u3002"))});Ee("scene").addEventListener("contextmenu",i=>i.preventDefault());Ee("scene").addEventListener("pointerdown",i=>{Yn&&Mn&&(i.button===2||i.pointerType==="touch")&&(yi={x:i.clientX,y:i.clientY},Ee("scene").setPointerCapture(i.pointerId))});Ee("scene").addEventListener("pointermove",i=>{yi&&(Mp(i.clientX-yi.x,i.clientY-yi.y),yi={x:i.clientX,y:i.clientY})});Ee("scene").addEventListener("pointerup",()=>yi=null);Ee("scene").addEventListener("pointercancel",()=>yi=null);document.addEventListener("mousemove",i=>{document.pointerLockElement===Ee("scene")&&Mn&&Mp(i.movementX,i.movementY)});document.addEventListener("pointerlockchange",()=>{document.pointerLockElement||(Jt.clear(),xi())});window.addEventListener("blur",()=>{gt.pause(),li.pause(),Jt.clear(),xi(),yi=null});window.addEventListener("keydown",i=>{!Yn||En.active||document.querySelector("dialog[open]")||["INPUT","SELECT","TEXTAREA"].includes(i.target.tagName)||(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","KeyE","KeyQ","KeyR"].includes(i.code)&&i.preventDefault(),Jt.add(i.code),!i.repeat&&(i.code==="KeyF"&&bp(),i.code==="KeyZ"&&Ee("undo").click(),i.code==="KeyY"&&Ee("redo").click(),(i.code==="KeyE"||i.code==="Space")&&lh()))});window.addEventListener("keyup",i=>{Jt.delete(i.code),["KeyE","Space"].includes(i.code)&&xi()});for(let i of document.querySelectorAll("[data-key]"))i.onpointerdown=e=>{e.preventDefault(),Jt.add(i.dataset.key),i.setPointerCapture(e.pointerId)},i.onpointerup=i.onpointercancel=()=>Jt.delete(i.dataset.key);function oh(i,e){return Math.abs(i)>5.65||e<-4.5||e>4.9||On.collisions.some(t=>Math.abs(i-t.x)<t.hx&&Math.abs(e-t.z)<t.hz)}function sv(i){if(En.active||!Mn||document.querySelector("dialog[open]"))return;let e=(Jt.has("KeyW")||Jt.has("ArrowUp")?1:0)-(Jt.has("KeyS")||Jt.has("ArrowDown")?1:0),t=(Jt.has("KeyD")||Jt.has("ArrowRight")?1:0)-(Jt.has("KeyA")||Jt.has("ArrowLeft")?1:0);if(!e&&!t)return;let n=tt.position.x,s=tt.position.z;tt.getWorldDirection(Ts),Ts.y=0,Ts.normalize();let r=new k().crossVectors(Ts,tt.up),o=Ts.clone().multiplyScalar(e).addScaledVector(r,t).normalize().multiplyScalar(i*(Jt.has("ShiftLeft")?3.4:2)),a=tt.position.x+o.x,l=tt.position.z+o.z;oh(a,tt.position.z)||(tt.position.x=a),oh(tt.position.x,l)||(tt.position.z=l),tt.position.y=Xt.lerp(tt.position.y,1.72,i*5),gt.walk(Math.hypot(tt.position.x-n,tt.position.z-s))}function Ep(){tt.fov=innerWidth<700?76:48,tt.aspect=innerWidth/innerHeight,tt.updateProjectionMatrix(),Kt.setPixelRatio(Math.min(devicePixelRatio,1.65)),Kt.setSize(innerWidth,innerHeight),Yn||(tt.position.copy(innerWidth<700?new k(3.4,2.7,5.2):pp),tt.lookAt(mp))}window.addEventListener("resize",Ep);Ep();function Sp(i){requestAnimationFrame(Sp);let e=Math.min((i-cp)/1e3,.05);if(cp=i,Wo+=e,Vt){let t=Math.min((i-Vt.start)/(Vt.duration||650),1),n=t*t*(3-2*t);if(Vt.seated){let s=Math.min(t/.58,1),r=s*s*(3-2*s),o=Math.max(0,(t-.35)/.65),a=o*o*(3-2*o);tt.position.lerpVectors(Vt.from,Vt.to,a),tt.position.y=Xt.lerp(Vt.from.y,Vt.to.y,r)-Math.sin(Math.PI*r)*.055,tt.quaternion.slerpQuaternions(Vt.qFrom,Vt.qTo,n)}else tt.position.lerpVectors(Vt.from,Vt.to,n),tt.quaternion.slerpQuaternions(Vt.qFrom,Vt.qTo,n);t===1&&(Vt=null,document.body.classList.remove("sitting-down"))}if(!Yn)jt.root.rotation.y=Math.sin(Wo*.17)*.14-.25;else if(sv(e),!En.active&&!document.querySelector("dialog[open]")&&(Jt.has("KeyQ")&&(jt.root.rotation.y+=e*.8),Jt.has("KeyR")&&(jt.root.rotation.y-=e*.8)),i-lp>150){if(lp=i,Fo(Ve.state)&&(Bn(),pt(Ve.state).id==="petal_pressing"&&(gt.play("paper_drying"),nn("\u7EB8\u6599\u5DF2\u5E72\u900F\uFF0C\u53EF\u4EE5\u53BB\u538B\u74E3\u53F0\u4E86\u3002"))),pt(Ve.state).id==="paper_drying"){let t=Math.max(0,...[...Ve.state.papers,...Ve.state.leaves].filter(n=>n.status==="wet").map(n=>n.readyAt-Date.now()));Ee("action-text").textContent=`\u9634\u5E72\u4E2D \xB7 ${(t/1e3).toFixed(1)} \u79D2`}if(Mn){up.setFromCamera(new we,tt);let t=up.intersectObjects(Object.values(On.stations).map(n=>n.trigger));Ee("interact-hint").textContent=t[0]&&t[0].distance<3?`${On.stations[t[0].object.userData.station].name} \xB7 E \u52A8\u624B\u64CD\u4F5C`:""}else Ee("interact-hint").textContent=""}On.animate(Wo,Math.max(0,1-(Wo-dp)*2)),En.update(e,i),Kt.render(wr,tt)}requestAnimationFrame(Sp);window.__LOTUS_WORKSHOP__={audio:gt,music:li,handwork:En,stages:lt,storageKey:Zo,get state(){return JSON.parse(JSON.stringify(Ve.state))},get ready(){return!0},get playing(){return Yn},get selectedTool(){return pc},get mode(){return Mn?"free":"station"},snapshot(){return{state:this.state,selectedTool:pc,mode:this.mode,focused:mc,camera:tt.position.toArray(),stats:{calls:Kt.info.render.calls,triangles:Kt.info.render.triangles,geometries:Kt.info.memory.geometries,textures:Kt.info.memory.textures},parts:jt.registry.size,visibleParts:[...jt.registry].filter(([,i])=>i.visible).map(([i])=>i),sockets:jt.sockets.size}},goStation:qn,selectTool:Cs,lantern:jt,workflow:Ve,scene:wr,camera:tt,renderer:Kt,craft:lh,blocked:oh};Kt.domElement.addEventListener("webglcontextlost",i=>{i.preventDefault(),nn("\u56FE\u5F62\u4E0A\u4E0B\u6587\u5DF2\u4E2D\u65AD\uFF0C\u8FDB\u5EA6\u5DF2\u4FDD\u5B58\u3002\u8BF7\u5237\u65B0\u9875\u9762\u6062\u590D\u3002")});setTimeout(()=>{Ee("loading").style.opacity=0,setTimeout(()=>Ee("loading").hidden=!0,500)},200);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
