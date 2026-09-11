import {ITEMS,nodeById} from './content.js?v=0.2.0';
const C={ink:'#142023',cream:'#c8c3af',yellow:'#b89a58',rust:'#986249',sage:'#627d70'};
function poly(c,points,fill,stroke=null,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function line(c,p,color,width=2){c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.stroke();}
export function drawItem(c,id,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);const item=ITEMS.find(i=>i.id===id);const color=item?.color||C.sage;
 if(id==='I01'){rect(c,-19,-15,38,26,color);line(c,[[-8,-15],[-8,-23],[8,-23],[8,-15]],C.ink,4);rect(c,-19,-4,38,3,C.ink);rect(c,-3,-7,6,10,C.cream);}
 if(id==='I02'){rect(c,-19,-25,38,42,color);ellipse(c,0,3,11,11,C.ink);ellipse(c,0,3,5,5,'#809198');ellipse(c,0,-15,5,5,C.ink);}
 if(id==='I03'){poly(c,[[-24,-15],[18,-21],[27,-12],[-15,-5]],color);line(c,[[-17,-7],[13,20]],C.ink,4);line(c,[[19,-13],[-10,23]],C.ink,4);}
 if(id==='I04'){ellipse(c,0,9,22,9,C.ink);rect(c,-18,-10,36,21,color);ellipse(c,0,-10,18,6,C.cream);ellipse(c,0,-11,13,3,color);line(c,[[-19,-5],[-27,-5],[-27,5],[-18,5]],C.ink,3);}
 if(id==='I05'){rect(c,-17,-31,33,30,color);rect(c,-20,0,43,8,color);line(c,[[-15,5],[-19,29]],C.ink,4);line(c,[[16,5],[20,29]],C.ink,4);line(c,[[-10,-26],[-10,-7],[9,-7],[9,-26]],'#e6aa7f',3);}
 if(id==='I06'){poly(c,[[-17,-4],[17,-4],[12,20],[-12,20]],C.rust);line(c,[[0,0],[0,-33]],C.ink,2);ellipse(c,-9,-21,10,5,color);ellipse(c,8,-30,10,6,C.sage);ellipse(c,9,-13,11,5,C.sage);}
 if(id==='I07'){poly(c,[[-17,-25],[18,-19],[18,24],[-17,17]],color);line(c,[[-11,-21],[-11,17]],C.cream,3);line(c,[[-4,-6],[10,-2]],C.rust,2);line(c,[[23,17],[29,-24]],C.ink,3);}
 if(id==='I08'){rect(c,-23,-16,46,33,color);line(c,[[-23,-5],[23,-5]],C.cream,3);line(c,[[0,-16],[0,17]],C.cream,3);}
 c.restore();}
export function itemIcon(id){const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;drawItem(canvas.getContext('2d'),id,48,53,1.5);return canvas.toDataURL();}

const assetNames=['road','garage','home','plateau','camp','van','portraits'];
const images={};
const failed=[];
export const artReady=Promise.all(assetNames.map(name=>new Promise(resolve=>{
 const img=new Image();images[name]=img;
 img.onload=()=>resolve();img.onerror=()=>{failed.push(name);resolve();};
 img.src=new URL(`../assets/atmosphere/${name}-v02.${name==='van'?'png':'jpg'}`,import.meta.url).href;
})));
export function artStatus(){return {ready:assetNames.every(n=>images[n].complete&&images[n].naturalWidth>0),failed:[...failed],style:'Worn machines / copper light / forest shadows'};}
const faces=['rowan','jules','dani','max','mara','bea','omar','remy','petra','jean','cal','miso'];
export function portrait(id){const i=Math.max(0,faces.indexOf(id));return `<span class="portrait" aria-hidden="true" style="--portrait-x:${(i%3)*50}%;--portrait-y:${Math.floor(i/3)*100/3}%"></span>`;}
export function sceneName(s){if(s.mode==='ending'||['friend','arrival','bridge','lakes'].includes(nodeById(s.node).region))return 'home';if(['R03','R04','R05'].includes(s.node))return 'garage';if(s.node==='R02')return 'plateau';if(s.node==='R06')return 'camp';return 'road';}
function cover(c,img,w,h,pan=0){const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);const iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;c.drawImage(img,(w-iw)/2+pan,(h-ih)*.55,iw,ih);}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
export function drawScene(canvas,s,t=0,title=false){
 const bounds=canvas.getBoundingClientRect();if(bounds.width<2||bounds.height<2)return;
 const dpr=Math.min(devicePixelRatio||1,2),pw=Math.round(bounds.width*dpr),ph=Math.round(bounds.height*dpr);
 if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
 const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);const w=bounds.width,h=bounds.height;
 const scene=sceneName(s),plate=images[scene],driving=s.mode==='travel'&&!title;
 const motion=reduced.matches?0:t;
 c.fillStyle='#172528';c.fillRect(0,0,w,h);
 if(plate.complete&&plate.naturalWidth)cover(c,plate,w,h);
 // A low mist band moves across the painted environment. Vehicles and weather remain live layers.
 const fog=c.createLinearGradient(0,h*.45,0,h*.9);fog.addColorStop(0,'#abc4b700');fog.addColorStop(.4,driving?'#91b7ab19':'#91b7ab09');fog.addColorStop(1,'#abc4b700');c.fillStyle=fog;c.fillRect(0,0,w,h);
 const top=c.createLinearGradient(0,0,0,h*.65);top.addColorStop(0,'#060f13c9');top.addColorStop(.6,'#060f1355');top.addColorStop(1,'#060f1300');c.fillStyle=top;c.fillRect(0,0,w,h*.65);
 const van=images.van;
 if(van.complete&&van.naturalWidth){
  // Screen-space placement preserves the van's proportions on a narrow phone and a wide tablet.
  const vw=Math.min(w*.86,h*1.16,750),vh=vw*van.naturalHeight/van.naturalWidth;
  const vx=w*.46-vw*.5,vy=h*.91-vh*.84+(driving?Math.sin(motion*13)*.6:Math.sin(motion*2)*.2);
  c.save();c.translate(vx+vw*.5,vy+vh*.86);c.scale(vw*.49,vh*.10);
  const shadow=c.createRadialGradient(0,0,0,0,0,1);shadow.addColorStop(0,'#040b0ef0');shadow.addColorStop(1,'#040b0e00');c.fillStyle=shadow;c.fillRect(-1,-1,2,2);c.restore();
  // A restrained practical headlight pool on the wet apron, never a neon bloom.
  const light=c.createRadialGradient(vx+vw*.91,vy+vh*.74,0,vx+vw*.91,vy+vh*.74,vw*.34);light.addColorStop(0,'#ffd99a27');light.addColorStop(1,'#e5c28200');c.fillStyle=light;c.fillRect(vx+vw*.65,vy+vh*.55,vw*.6,vh*.5);
  c.drawImage(van,vx,vy,vw,vh);
 }
 // Rain belongs to the authored road forecast. Still scenes have sparse drips rather than a storm.
 const rain=driving&&s.travel?.forecast.startsWith('Rain');
 if(!reduced.matches){c.lineWidth=.7;c.strokeStyle=rain?'#b6d5cd3b':'#b6d5cd1c';c.beginPath();for(let i=0;i<(rain?85:20);i++){const x=(i*83.1+motion*29)%(w+24),y=(i*57.3+motion*(rain?190:95))%(h+20);c.moveTo(x,y);c.lineTo(x-3,y+9);}c.stroke();}
 const bottom=c.createLinearGradient(0,h*.84,0,h);bottom.addColorStop(0,'#06101300');bottom.addColorStop(1,'#061013bf');c.fillStyle=bottom;c.fillRect(0,h*.84,w,h*.16);
 if(!artStatus().ready){c.font='500 13px "Chakra Petch", sans-serif';c.fillStyle='#d8c29b';c.textAlign='left';c.fillText(failed.length?'Artwork unavailable. You can still play.':'Loading the road…',20,h-18);}

}
