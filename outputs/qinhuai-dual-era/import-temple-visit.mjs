// Map units; doorway coordinates measured from the original temple geometry.
export const TEMPLE_PORTAL={outside:{x:-5.43,z:-23.65},inside:{x:-5.63,z:-27.05},door:{x:-5.43,z:-24.5},ground:11.864055,radius:1.6};
export function createTempleVisit({load,teleport,stop,onChange=()=>{},fade=async()=>{},setVisible=()=>{},onProgress=()=>{}}){
 let inside=false,busy=false,near=false,error=null;
 const snapshot=()=>({inside,busy,near,error});
 const notify=()=>onChange(snapshot());
 return {snapshot,
  async restore(value){
   if(busy)throw Error('庙门正在切换，请稍后重试');
   busy=true;near=false;error=null;stop();notify();
   try{if(value)await load({onProgress});await teleport(!!value);inside=!!value;setVisible(inside);}
   catch(e){error=e.message;throw e;}
   finally{busy=false;stop();notify();}
  },
  update(position,enabled){
   const p=inside?TEMPLE_PORTAL.inside:TEMPLE_PORTAL.door;
   const next=!busy&&enabled&&Math.abs(position.y-TEMPLE_PORTAL.ground)<.9&&Math.hypot(position.x-p.x,position.z-p.z)<=TEMPLE_PORTAL.radius;
   if(next!==near){near=next;notify();}
  },
  async activate(){
   if(busy||!near)return false;
   const entering=!inside;busy=true;near=false;error=null;stop();notify();
   try{
    await fade(true);
    if(entering)await load({onProgress});
    await teleport(entering);
    inside=entering;setVisible(inside);notify();
    return true;
   }catch(e){error=e.message;setVisible(inside);notify();return false;}
   finally{await fade(false);busy=false;stop();notify();}
  }
 };
}
