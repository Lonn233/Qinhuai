export function parseColorInput(value){
 if(typeof value!=='string')return null;
 const text=value.trim();
 if(/^#[0-9a-f]{6}$/i.test(text))return text.toLowerCase();
 if(/^#[0-9a-f]{3}$/i.test(text))return '#'+[...text.slice(1)].map(c=>c+c).join('').toLowerCase();
 const rgb=/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(text);
 if(!rgb)return null;
 const channels=rgb.slice(1).map(Number);
 if(channels.some(c=>c>255))return null;
 return '#'+channels.map(c=>c.toString(16).padStart(2,'0')).join('');
}
