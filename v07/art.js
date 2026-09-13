import {drawPrologue} from './prologue.js?v=0.7.1-van-1';
import {node} from './world.js?v=0.7.1-opening-1';
import {drawRoad} from './motion.js?v=0.7.1-opening-1';
import {drawSalvage,drawFishing} from './scenes.js?v=0.7.1-opening-1';
import {filmPlayer,pauseFilms} from './video.js?v=0.7.1-opening-1';
import {SHOTS} from './journey.js?v=0.7.1-opening-1';
export const images={};
export const sources={jackSprite:'assets/journey/jack-sprite.webp',collectorSprite:'assets/journey/collector-sprite.webp',collectorTruck:'assets/journey/collector-truck.webp',landscape:'assets/journey/road-landscape.webp',fuelYard:'assets/journey/fuel-yard.webp',catchPhoto:'assets/journey/catch.webp',yard:'assets/journey/yard.webp',cabin:'assets/journey/cabin.webp',familyPhoto:'assets/journey/family-photo.webp',dinner:'assets/journey/dinner.webp',roadside:'assets/journey/roadside.webp',collectors:'assets/journey/collectors.webp',vanBody:'assets/journey/van-body.webp',chair:'assets/pilgrimage/chair.png',road:'assets/atmosphere/road-v02.jpg',garage:'assets/atmosphere/garage-v02.jpg',camp:'assets/atmosphere/camp-v02.jpg',plateau:'assets/atmosphere/plateau-v02.jpg',van:'assets/atmosphere/van-v02.png',fishing:'assets/pilgrimage/fishing.jpg',gate:'assets/pilgrimage/gate.jpg',home:'assets/pilgrimage/home.jpg',family:'assets/pilgrimage/family.jpg'};
for(const id of ['highway','logistics','prairie','storm','plaza','toll','campus','market','seized','basin','squad','scanner','inventory','blocked','mirror','repair-family','night-family','meal-family','transport-body','windshield'])sources[id]='assets/journey-v05/'+id+'.webp';
sources.collectors=sources.squad;
for(const id of ['city','kitchen','garage','crew','departure'])sources['intro-'+id]='assets/intro-v06/'+id+'.webp';
for(const id of ['crew','departure','kitchen','garage'])sources['intro-'+id]='assets/family-02/'+id+'.webp';
for(const id of ['meal-family','repair-family'])sources[id]='assets/family-02/'+id+'.webp';
for(const id of ['departure','kitchen'])sources['intro-'+id]='assets/disconnection/'+id+'.webp';
for(const id of ['departure','crew'])sources['intro-'+id]='assets/candid-04/'+id+'.webp';
for(const id of ['meal-family','repair-family','open-country'])sources[id]='assets/candid-04/'+id+'.webp';
sources.basin='assets/eastbound-07/signals-end-basin.webp';
sources['intro-departure']='assets/van-09/departure.webp';
sources['opening-radio']='assets/opening-08/radio.webp';
sources['opening-mark']='assets/signals-end/signals-end-stacked-light.svg';
sources.familyPhoto=sources['open-country'];
for(const id of ['highway','viaduct','rain','overtake','scanner','barrier'])sources['poster-'+id]='assets/journey-v05/film-'+id+'-poster.webp';
export const ready=Promise.all(Object.entries(sources).map(([id,url])=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(id);im.onerror=()=>resolve(id);im.src=url;images[id]=im;})));
export const HAZARDS=[{x:.31,y:.37,w:.17,h:.045},{x:.55,y:.56,w:.16,h:.045},{x:.28,y:.73,w:.18,h:.04}];
export const HOME_POINTS=[{id:'key',x:.13,y:.59,label:'Turn the key'},{id:'picture',x:.46,y:.37,label:'Hang our picture'},{id:'lamp',x:.7,y:.6,label:'Light the lamp'},{id:'table',x:.20,y:.63,label:'Set the table'}];
const COLORS=['#eab178','#95cbc4','#dcabbe'],SYMBOLS=['I','II','III'];
export function render(canvas,s,ui){
 const ctx=canvas.getContext('2d'),w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);
 if(ui.prologue){ui.hits=[];pauseFilms();drawPrologue(ctx,w,h,ui.prologue,images,s.settings.reducedMotion);return;}
 const rect=(x,y,rw,rh,color,stroke)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x*w,y*h,rw*w,rh*h,5);ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}};
 const circle=(x,y,r,color,stroke)=>{ctx.beginPath();ctx.arc(x*w,y*h,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}};
 const line=(x1,y1,x2,y2,color,width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1*w,y1*h);ctx.lineTo(x2*w,y2*h);ctx.stroke();};
 const text=(t,x,y,size=14,color='#f7e9d0',align='center')=>{ctx.font=`500 ${size}px Road, sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(t,x*w,y*h);};
 const cover=(im,focus=.5)=>{if(!im?.complete||!im.naturalWidth){ctx.fillStyle='#1e343a';ctx.fillRect(0,0,w,h);return;}let k=Math.max(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*k;ctx.drawImage(im,Math.max(w-iw,Math.min(0,w*.5-iw*focus)),(h-im.naturalHeight*k)/2,iw,im.naturalHeight*k);};
 let art=ui.title?'intro-departure':s.mode==='home'||s.ending?.owned?'home':s.mode==='crossing'?'gate':s.mode==='fishing'?'fishing':['travel','incident'].includes(s.mode)?'road':s.mode==='salvage'||s.mode==='repair'?'garage':s.mode==='packing'?'road':node(s.node).art;
 const shot=s.mode==='story'?SHOTS[s.story.id]:s.mode==='travel'&&s.road.shot?SHOTS[s.road.shot.id]:s.mode==='incident'?{image:s.incident.image||'collectors'}:null;
 if(shot)art=shot.film?'poster-'+shot.film:shot.image;
 const movie=shot?.film&&!s.settings.reducedMotion&&!ui.title?filmPlayer(shot.film,s.road?.shot?.elapsed||0,ui.paused||document.hidden):null;if(!shot?.film||s.settings.reducedMotion||ui.title)pauseFilms();
 if(shot&&images[art]?.naturalWidth&&w<h*1.2){
  const im=images[art],k=h/im.naturalHeight,iw=im.naturalWidth*k,elapsed=s.mode==='story'?s.story.elapsed:s.road.shot?.elapsed||0;
  if(s.settings.reducedMotion){ctx.fillStyle='#102225';ctx.fillRect(0,0,w,h);const ch=w*im.naturalHeight/im.naturalWidth;ctx.drawImage(im,0,(h-ch)/2,w,ch);}
  else if(art==='open-country'){ctx.fillStyle='#102225';ctx.fillRect(0,0,w,h);const ch=Math.min(h,w),scale=Math.max(w/im.naturalWidth,ch/im.naturalHeight),sw=w/scale,phase=Math.min(1,elapsed/(s.mode==='story'?9:3)),focus=.49+.13*phase,sx=Math.max(0,Math.min(im.naturalWidth-sw,im.naturalWidth*focus-sw/2));ctx.drawImage(im,sx,0,sw,im.naturalHeight,0,(h-ch)/2,w,ch);}
  else {const ranges={'night-family':[.40,.56],'meal-family':[.36,.58],'repair-family':[.38,.62],mirror:[.42,.56]};const range=ranges[art]||[.30,.57],phase=Math.min(1,elapsed/(s.mode==='story'?9:4.6)),focus=range[0]+(range[1]-range[0])*(phase*phase*(3-2*phase));ctx.drawImage(im,Math.min(0,Math.max(w-iw,w*.5-iw*focus)),0,iw,h);}
 }else cover(images[art],ui.title&&w<h*1.2?.72:.5);
 if(movie){const k=Math.max(w/movie.videoWidth,h/movie.videoHeight);ctx.drawImage(movie,(w-movie.videoWidth*k)/2,(h-movie.videoHeight*k)/2,movie.videoWidth*k,movie.videoHeight*k);}
 const shade=ctx.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#041317a6');shade.addColorStop(.35,'#04131700');shade.addColorStop(.9,'#04131700');shade.addColorStop(1,'#0413178a');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
 ui.hits=[];
 function hit(id,x,y,r=25,data={}){ui.hits.push({id,x,y,r:Math.max(r,23),...data});}
 function badge(id,x,y,label,color='#eac185',radius=24){circle(x,y,radius,'#12282bea',color);text(label,x,y,16,color);hit(id,x,y,radius);}
 if(ui.title)return;
 if(['packing','travel','incident'].includes(s.mode)&&!shot){drawRoad(ctx,w,h,s,ui,images);}
 if(s.mode==='salvage'){drawSalvage(ctx,w,h,s,ui,images);}
 if(s.mode==='repair'){
  const g=s.activity;if(['method','steady','done'].includes(g.phase))cover(images['repair-family']);rect(.08,.25,.84,.58,'#12262aed','#71857d');
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
  }else if(g.phase==='tune'||g.phase==='done'){
   text(g.phase==='done'?'RUNNING AGAIN':g.fault==='tire'?'STEADY WRENCH PRESSURE':'FIND A STEADY IDLE',.5,.36,w<600?17:24,g.phase==='done'?'#b6d4a7':'#f7e9d0');rect(.18,.48,.64,.13,'#092027','#6a8279');rect(.18+.64*((g.tuneCenter||.67)-(s.effects.handUntil>s.hour?.055:.09)),.48,.64*(s.effects.handUntil>s.hour?.11:.18),.13,'#b3925c');line(.18+g.tune*.64,.455,.18+g.tune*.64,.635,'#ffe7ad',5);text('LOW',.19,.7,12);text('HIGH',.81,.7,12);text(`${Math.min(4,g.stable).toFixed(1)} / 4 seconds`,.5,.72,16);hit('tuner',.5,.55,w*.32,{type:'tuner'});
  }
 }
 if(s.mode==='fishing')drawFishing(ctx,w,h,s,ui,images);
 if(s.mode==='crossing'){
  const g=s.activity;
  // Perspective projection: both collision and drawing use the same lane coordinate.
  const project=(x,z)=>{const depth=Math.max(0,Math.min(1.12,1-z/.65));const width=.16+depth*.73;return {x:.5+(x-.5)*width,y:.35+depth*.5,scale:.25+depth*.9};};
  for(const ob of g.obstacles){const z=ob.z-g.distance;if(z<-.05||z>.65)continue;const p=project(ob.x,z);rect(p.x-.065*p.scale,p.y-.018,.13*p.scale,.036,g.hits.includes(ob.id)?'#805746':'#453d34','#c4a776');line(p.x-.045*p.scale,p.y-.007,p.x+.045*p.scale,p.y+.007,'#d0b891',3);}
  const p=project(g.x,0);rect(p.x-.044,.795,.088,.10,'#b7b092','#252e28');rect(p.x-.034,.805,.068,.025,'#29444a','#8fa293');line(p.x-.03,.89,p.x+.03,.89,'#bb7557',4);
  rect(.14,.91,.72,.008,'#13292e');rect(.14,.91,.72*g.distance,.008,'#eac081');
 }
 if(s.mode==='home'||s.ending?.owned){
  if(s.home.placed.includes('picture')){const im=images.familyPhoto;if(im?.naturalWidth){const room=images.home,k=Math.max(w/room.naturalWidth,h/room.naturalHeight),iw=room.naturalWidth*k,ih=room.naturalHeight*k,pw=iw*.11,ph=pw*im.naturalHeight/im.naturalWidth,px=(w-iw)/2+iw*.51-pw/2,py=(h-ih)/2+ih*.235;ctx.fillStyle='#8a6643';ctx.fillRect(px-5,py-5,pw+10,ph+10);ctx.drawImage(im,px,py,pw,ph);}}
  if(s.home.placed.includes('lamp')){const glow=ctx.createRadialGradient(w*.7,h*.57,0,w*.7,h*.57,w*.24);glow.addColorStop(0,'#ffcb6850');glow.addColorStop(1,'#ffcb6800');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);}

  if(s.home.placed.length===4){const cx=s.home.spot==='window'?.59:.8;const im=images.chair;if(im.complete&&im.naturalWidth){const ch=h*.31,cw=ch*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,cx*w-cw/2,h*.93-ch,cw,ch);}}
  if(s.mode==='home')for(const p of HOME_POINTS){const done=s.home.placed.includes(p.id);if(!done)badge(p.id,p.x,p.y,String(HOME_POINTS.indexOf(p)+1),'#eac185',23);}
 }
 if(ui.padCursor&&['salvage','fishing','repair'].includes(s.mode)){circle(ui.padCursor.x,ui.padCursor.y,9,'#ffffff00','#fff6cb');line(ui.padCursor.x-.015,ui.padCursor.y,ui.padCursor.x+.015,ui.padCursor.y,'#fff6cb');}
}
