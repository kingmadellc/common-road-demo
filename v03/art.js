import {node} from './world.js?v=0.3.0';
export const images={};
const sources={chair:'assets/pilgrimage/chair.png',road:'assets/atmosphere/road-v02.jpg',garage:'assets/atmosphere/garage-v02.jpg',camp:'assets/atmosphere/camp-v02.jpg',plateau:'assets/atmosphere/plateau-v02.jpg',van:'assets/atmosphere/van-v02.png',fishing:'assets/pilgrimage/fishing.jpg',gate:'assets/pilgrimage/gate.jpg',home:'assets/pilgrimage/home.jpg',family:'assets/pilgrimage/family.jpg'};
export const ready=Promise.all(Object.entries(sources).map(([id,url])=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(id);im.onerror=()=>resolve(id);im.src=url;images[id]=im;})));
export const HAZARDS=[{x:.31,y:.37,w:.17,h:.045},{x:.55,y:.56,w:.16,h:.045},{x:.28,y:.73,w:.18,h:.04}];
export const HOME_POINTS=[{id:'key',x:.13,y:.59,label:'Turn the key'},{id:'picture',x:.46,y:.37,label:'Hang our picture'},{id:'lamp',x:.7,y:.6,label:'Light the lamp'},{id:'table',x:.20,y:.63,label:'Set the table'}];
const COLORS=['#eab178','#95cbc4','#dcabbe'],SYMBOLS=['I','II','III'];
export function render(canvas,s,ui){
 const ctx=canvas.getContext('2d'),w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);
 const rect=(x,y,rw,rh,color,stroke)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x*w,y*h,rw*w,rh*h,5);ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}};
 const circle=(x,y,r,color,stroke)=>{ctx.beginPath();ctx.arc(x*w,y*h,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}};
 const line=(x1,y1,x2,y2,color,width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1*w,y1*h);ctx.lineTo(x2*w,y2*h);ctx.stroke();};
 const text=(t,x,y,size=14,color='#f7e9d0',align='center')=>{ctx.font=`500 ${size}px Road, sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(t,x*w,y*h);};
 const cover=(im)=>{if(!im?.complete||!im.naturalWidth){ctx.fillStyle='#1e343a';ctx.fillRect(0,0,w,h);return;}let k=Math.max(w/im.naturalWidth,h/im.naturalHeight);ctx.drawImage(im,(w-im.naturalWidth*k)/2,(h-im.naturalHeight*k)/2,im.naturalWidth*k,im.naturalHeight*k);};
 let art=ui.title?'road':s.mode==='home'||s.ending?.owned?'home':s.mode==='crossing'?'gate':s.mode==='fishing'?'fishing':['travel','incident'].includes(s.mode)?'road':s.mode==='salvage'||s.mode==='repair'?'garage':s.mode==='packing'?'road':node(s.node).art;
 cover(images[art]);
 const shade=ctx.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#041317a6');shade.addColorStop(.35,'#04131700');shade.addColorStop(.9,'#04131700');shade.addColorStop(1,'#0413178a');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
 ui.hits=[];
 function hit(id,x,y,r=25,data={}){ui.hits.push({id,x,y,r:Math.max(r,23),...data});}
 function badge(id,x,y,label,color='#eac185',radius=24){circle(x,y,radius,'#12282bea',color);text(label,x,y,16,color);hit(id,x,y,radius);}
 if(ui.title)return;
 if(['packing','travel','incident'].includes(s.mode)){
  const im=images.van;if(im.complete&&im.naturalWidth){const vw=Math.min(w*.49,460),vh=vw*im.naturalHeight/im.naturalWidth;const bounce=s.mode==='travel'&&!ui.paused?Math.sin(s.road.elapsed*8)*1.5:0;ctx.save();ctx.fillStyle='#030b0c99';ctx.beginPath();ctx.ellipse(w*.51,h*.88,vw*.4,13,0,0,7);ctx.fill();ctx.restore();ctx.drawImage(im,w*.5-vw*.48,h*1.01-vh+bounce,vw,vh);}
  if(s.mode==='travel'){const p=s.road.elapsed/s.road.duration;rect(.15,.88,.7,.008,'#243a3d');rect(.15,.88,.7*p,.008,'#f1c17e');}
 }
 if(s.mode==='salvage'){
  rect(.06,.215,.88,.66,'#071c20b8','#657872');
  for(const z of HAZARDS){rect(z.x,z.y,z.w,z.h,'#8e5638','#f2b27a');for(let x=z.x;x<z.x+z.w;x+=.028)line(x,z.y,x+.018,z.y+z.h,'#e6b073',2);}
  rect(.5,.765,.34,.09,'#2b544cf5','#b5d2a8');text('VAN · DROP HERE',.67,.81,w<600?12:16,'#f7e6c6');
  for(const item of s.sites[s.node]){
   if(item.taken)continue;let x=item.x,y=item.y;if(s.activity.carry===item.id&&ui.drag){x=ui.drag.x;y=ui.drag.y;}
   const selected=s.activity.selected===item.id;circle(x,y,24,selected?'#6b6145':'#152c2f','#e7bd81');
   if(item.type==='tire'){circle(x,y,14,'#17262a','#afb7a0');circle(x,y,5,'#a4ac96');}
   else if(item.type==='fan'){for(let n=0;n<4;n++){const angle=n*Math.PI/2;ctx.save();ctx.translate(x*w,y*h);ctx.rotate(angle);ctx.fillStyle='#aec0b2';ctx.beginPath();ctx.ellipse(0,-8,5,9,.4,0,7);ctx.fill();ctx.restore();}circle(x,y,4,'#e8b476');}
   else{rect(x-14/w,y-12/h,28/w,24/h,item.type==='food'?'#ac9769':item.type==='fuel'?'#a6704b':'#95b6ae');text(item.type==='food'?'▥':item.type==='fuel'?'F':'⚡',x,y,17,'#142326');}
   text(item.name,x,y+37/h,w<600?11:14,'#fff0d5');hit(item.id,x,y,29,{type:'item'});
  }
  if(ui.drag&&s.activity.carry){circle(ui.drag.x,ui.drag.y,33,'#ffffff00',s.activity.damage>25?'#f29878':'#deca93');}
 }
 if(s.mode==='repair'){
  const g=s.activity;rect(.08,.25,.84,.58,'#12262aed','#71857d');
  if(['diagnose','replace'].includes(g.phase)){
   const parts=['fan','relay','tire'];parts.forEach((id,i)=>{const x=.23+i*.27;circle(x,.47,Math.min(43,w*.085),'#284044',g.tested.includes(id)?(g.fault===id?'#edb574':'#9ec2aa'):'#6e8682');
    if(id==='fan'){for(let j=0;j<4;j++){ctx.save();ctx.translate(x*w,.47*h);ctx.rotate(j*Math.PI/2);ctx.fillStyle='#9bada0';ctx.beginPath();ctx.ellipse(0,-14,10,17,.5,0,7);ctx.fill();ctx.restore();}}
    if(id==='relay'){rect(x-.035,.405,.07,.13,'#b69a64','#edc785');line(x-.05,.46,x+.05,.46,'#12383c',4);}
    if(id==='tire'){circle(x,.47,24,'#172629','#a8ada0');circle(x,.47,10,'#9a9d89');}
    text(id==='fan'?'COOLING':id==='relay'?'POWER':'TIRE',x,.65,w<600?12:16);text(g.tested.includes(id)?(id===g.fault?'FAULT FOUND':'WORKING'):'INSPECT',x,.73,11,id===g.fault&&g.tested.includes(id)?'#edb77a':'#a8c1b8');hit(id,x,.47,Math.min(43,w*.085),{type:'part'});
   });
  }else if(g.phase==='connect'){
   text('MATCH THE TERMINALS',.5,.32,w<600?14:19);
   [0,1,2].forEach(i=>{const y=.44+i*.13;circle(.25,y,23,'#223b3c',COLORS[i]);text(SYMBOLS[i],.25,y,16,COLORS[i]);circle(.75,y,23,'#162c31',COLORS[i]);text(SYMBOLS[i],.75,y,16,COLORS[i]);hit('lead'+i,.25,y,24,{type:'lead',index:i});hit('socket'+i,.75,y,24,{type:'socket',index:i});if(g.connections.includes(i))line(.25,y,.75,y,COLORS[i],5);else if(ui.wire?.index===i)line(.25,y,ui.wire.x,ui.wire.y,COLORS[i],4);});
  }else{
   text(g.phase==='done'?'RUNNING AGAIN':g.fault==='tire'?'STEADY WRENCH PRESSURE':'FIND A STEADY IDLE',.5,.36,w<600?17:24,g.phase==='done'?'#b6d4a7':'#f7e9d0');rect(.18,.48,.64,.13,'#092027','#6a8279');rect(.18+.64*.58,.48,.64*.18,.13,'#b3925c');line(.18+g.tune*.64,.455,.18+g.tune*.64,.635,'#ffe7ad',5);text('LOW',.19,.7,12);text('HIGH',.81,.7,12);text(`${Math.min(4,g.stable).toFixed(1)} / 4 seconds`,.5,.72,16);hit('tuner',.5,.55,w*.32,{type:'tuner'});
  }
 }
 if(s.mode==='fishing'){
  const g=s.activity;for(const f of g.fish){if(f.caught)continue;const x=f.id===g.target&&g.phase==='hooked'?g.hook.x:f.x,y=f.id===g.target&&g.phase==='hooked'?g.hook.y+(g.progress*.2):f.y;
   ctx.save();ctx.translate(x*w,y*h);ctx.rotate(Math.sin(g.elapsed*.5+f.phase)*.2);ctx.fillStyle='#102323df';ctx.beginPath();ctx.ellipse(0,0,18+f.size*2,7,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(-30,-10);ctx.lineTo(-30,10);ctx.fill();ctx.strokeStyle='#d3d5ac80';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,34,12,0,0,7);ctx.stroke();ctx.restore();hit('fish'+f.id,x,y,30,{type:'fish',index:f.id});
  }
  if(g.phase==='hooked'){line(g.rod,.98,g.hook.x,g.hook.y+g.progress*.2,g.tension>.78?'#ffb19a':'#d9c89e',2);circle(g.hook.x,g.hook.y+g.progress*.2,4,'#eac186');}
  if(ui.cast){line(ui.cast.x,ui.cast.y,ui.cast.lastX,ui.cast.lastY,'#f3d49a',3);circle(ui.cast.x,ui.cast.y,27,'#dcca7d15','#efd7a1');text('RELEASE TO CAST',.5,.85,14);}
 }
 if(s.mode==='crossing'){
  const g=s.activity;
  // Perspective projection: both collision and drawing use the same lane coordinate.
  const project=(x,z)=>{const depth=Math.max(0,Math.min(1.12,1-z/.65));const width=.16+depth*.73;return {x:.5+(x-.5)*width,y:.35+depth*.5,scale:.25+depth*.9};};
  for(const ob of g.obstacles){const z=ob.z-g.distance;if(z<-.05||z>.65)continue;const p=project(ob.x,z);rect(p.x-.065*p.scale,p.y-.018,.13*p.scale,.036,g.hits.includes(ob.id)?'#805746':'#453d34','#c4a776');line(p.x-.045*p.scale,p.y-.007,p.x+.045*p.scale,p.y+.007,'#d0b891',3);}
  const p=project(g.x,0);rect(p.x-.044,.795,.088,.10,'#b7b092','#252e28');rect(p.x-.034,.805,.068,.025,'#29444a','#8fa293');line(p.x-.03,.89,p.x+.03,.89,'#bb7557',4);
  rect(.14,.91,.72,.008,'#13292e');rect(.14,.91,.72*g.distance,.008,'#eac081');
 }
 if(s.mode==='home'||s.ending?.owned){
  if(s.home.placed.includes('picture')){const im=images.family;if(im.complete&&im.naturalWidth){rect(.355,.31,.205,.14,'#87623c','#dbba82');ctx.drawImage(im,.363*w,.322*h,.19*w,.11*h);}}
  if(s.home.placed.includes('lamp')){const glow=ctx.createRadialGradient(w*.7,h*.57,0,w*.7,h*.57,w*.24);glow.addColorStop(0,'#ffcb6850');glow.addColorStop(1,'#ffcb6800');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);}
  
  if(s.home.placed.length===4){const cx=s.home.spot==='window'?.59:.8;const im=images.chair;if(im.complete&&im.naturalWidth){const ch=h*.31,cw=ch*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,cx*w-cw/2,h*.93-ch,cw,ch);}}
  if(s.mode==='home')for(const p of HOME_POINTS){const done=s.home.placed.includes(p.id);if(!done)badge(p.id,p.x,p.y,String(HOME_POINTS.indexOf(p)+1),'#eac185',23);}
 }
 if(ui.padCursor&&['salvage','fishing','repair'].includes(s.mode)){circle(ui.padCursor.x,ui.padCursor.y,9,'#ffffff00','#fff6cb');line(ui.padCursor.x-.015,ui.padCursor.y,ui.padCursor.x+.015,ui.padCursor.y,'#fff6cb');}
}
