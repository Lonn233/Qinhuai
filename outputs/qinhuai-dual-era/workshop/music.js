// Background music is independent of the synthesized craft sound effects.
export function createWorkshopMusic({storage,onChange=()=>{}}={}){
 const key='qinhuai-workshop-music-v1';let enabled=true,volume=.25,started=false,suspended=false,blocked=false,error=false;
 try{const saved=JSON.parse(storage?.getItem(key)||'null');if(typeof saved?.enabled==='boolean')enabled=saved.enabled;if(Number.isFinite(saved?.volume))volume=Math.max(0,Math.min(1,saved.volume));}catch{}
 const media=document.createElement('audio');media.id='workshop-music';media.src='./workshop/assets/audio/man-ye-xing.mp3';media.preload='none';media.loop=true;media.volume=volume;document.body.appendChild(media);
 const snapshot=()=>({enabled,volume,started,playing:!media.paused,suspended,blocked,error});
 const notify=()=>onChange(snapshot());
 function save(){try{storage?.setItem(key,JSON.stringify({enabled,volume}));}catch{}}
 function play(){if(!enabled||!started||suspended)return;blocked=false;error=false;const attempt=media.play();attempt?.catch(e=>{if(!enabled||suspended||e.name==='AbortError')return;blocked=e.name==='NotAllowedError';error=!blocked;notify();});notify();}
 media.addEventListener('play',notify);media.addEventListener('pause',notify);media.addEventListener('error',()=>{error=true;notify();});
 return {snapshot,start(){started=true;suspended=false;play();},pause(){suspended=true;media.pause();notify();},resume(){suspended=false;play();},setEnabled(value){enabled=!!value;if(enabled){if(media.error)media.load();started=true;play();}else media.pause();save();notify();},setVolume(value){volume=Math.max(0,Math.min(1,value));media.volume=volume;save();notify();},toggle(){if(enabled&&(blocked||error)){if(media.error)media.load();play();}else this.setEnabled(!enabled);}};
}
