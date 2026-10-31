import {createNavigator} from './navigation.mjs';
import {createNavigationSurface} from './navigation-surface.mjs';
let navigator=null,token=0;
self.onmessage=({data})=>{if(data.type==='init'){navigator=createNavigator(createNavigationSurface(data.snapshot));self.postMessage({type:'ready'});return;}if(data.type==='route'&&navigator){token=data.token;navigator.request(data.start,data.goal);pump(token);}};
function pump(id){if(id!==token)return;navigator.tick(12);if(navigator.status==='searching')setTimeout(()=>pump(id),0);else self.postMessage({type:'result',token:id,status:navigator.status,path:navigator.path,checked:navigator.checked});}
