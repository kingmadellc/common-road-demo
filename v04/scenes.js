import {YARD,layoutFor} from './salvage.js?v=0.4.0';
import {FISH_PROFILES,castEndpoint} from './fishing.js?v=0.4.0';
export function yardView(w,h){const vw=Math.min(w,h*.78*16/9),vh=vw*9/16;return{x:(w-vw)/2,y:Math.max(h*.14,(h-vh)*.46),w:vw,h:vh};}
function imageCover(c,im,x,y,w,h){if(!im?.naturalWidth)return;const k=Math.max(w/im.naturalWidth,h/im.naturalHeight);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(im,x+(w-im.naturalWidth*k)/2,y+(h-im.naturalHeight*k)/2,im.naturalWidth*k,im.naturalHeight*k);c.restore();}
export function drawSalvage(c,w,h,s,ui,images){
 const g=s.activity,layout=layoutFor(s.node),v=yardView(w,h),pt=p=>({x:v.x+p.x*v.w,y:v.y+p.y*v.h});
 if(g.phase==='intercept'||g.patrol.state==='warning'&&g.patrol.elapsed<2.6){imageCover(c,images.collectors,0,0,w,h);return;}
 c.fillStyle='#102426';c.fillRect(0,0,w,h);imageCover(c,s.node==='yard'?images.yard:images.fuelYard,v.x,v.y,v.w,v.h);
 const top=c.createLinearGradient(0,0,0,h);top.addColorStop(0,'#08191b');top.addColorStop(.24,'#08191b00');top.addColorStop(.75,'#08191b00');top.addColorStop(1,'#08191b');c.fillStyle=top;c.fillRect(0,0,w,h);
 c.save();c.beginPath();c.rect(v.x,v.y,v.w,v.h);c.clip();
 function hit(id,p,type,r=25){const q=pt(p);ui.hits.push({id,x:q.x/w,y:q.y/h,r,type,worldX:p.x,worldY:p.y});}
 function label(t,p,color='#f1d6a6',size=12){const q=pt(p);c.font=`500 ${size}px Road`;c.textAlign='center';c.fillStyle='#09191cdc';const tw=c.measureText(t).width;c.fillRect(q.x-tw/2-7,q.y-10,tw+14,22);c.fillStyle=color;c.fillText(t,q.x,q.y+5);}
 for(const item of s.sites[s.node]){
  const q=pt(item);if(item.taken){c.fillStyle='#182421';if(item.type==='fan'){c.beginPath();c.ellipse(q.x,q.y,v.w*.039,v.h*.075,0,0,7);c.fill();c.strokeStyle='#535d50';c.lineWidth=1;c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(q.x+Math.cos(a)*v.w*.037,q.y+Math.sin(a)*v.h*.07);c.lineTo(q.x+Math.cos(a)*v.w*.028,q.y+Math.sin(a)*v.h*.055);c.stroke();}c.fillStyle='#090f0e';c.beginPath();c.ellipse(q.x,q.y,v.w*.014,v.h*.032,0,0,7);c.fill();}else{c.fillRect(q.x-v.w*.012,q.y-v.h*.023,v.w*.025,v.h*.04);}continue;}
  c.strokeStyle=g.selected===item.id?'#ffcf83':'#ded3ad';c.lineWidth=g.selected===item.id?2.5:1;c.beginPath();c.arc(q.x,q.y,Math.max(15,w*.014),0,Math.PI*2);c.stroke();
  c.fillStyle='#f6d9a0';c.beginPath();c.arc(q.x,q.y,3,0,Math.PI*2);c.fill();hit(item.id,item,'item',26);
  if(g.selected===item.id)label(item.object,{x:item.x,y:item.y-.07},'#f7dfb4',w<500?11:14);
 }
 for(const [id,p]of [['rear',layout.rear],['front',layout.front]]){hit(id,p,'exit',27);label(id==='rear'?'REAR LANE ↗':'VAN ↙',p,'#b7d0a7',11);}
 hit('bus',layout.hide,'cover',28);label(g.player.hiding?'IN COVER':(s.node==='yard'?'BUS · COVER':'TRUCK · COVER'),{x:layout.hide.x,y:layout.hide.y+.05},'#c8c9a4',11);
 const p=g.patrol;
 if(p.state!=='absent'&&p.state!=='gone'){
  const truck=pt({x:-.03+(p.state==='warning'?Math.min(1,p.elapsed/10)*.08:.08),y:.94});
  const tw=v.w*.23,th=tw*images.collectorTruck.naturalHeight/images.collectorTruck.naturalWidth;
  if(images.collectorTruck.naturalWidth)c.drawImage(images.collectorTruck,truck.x-tw*.48,truck.y-th*.87,tw,th);
  const pulse=s.settings.reducedMotion?.7:(Math.sin(s.activeTime*7)+1)*.5;c.fillStyle=`rgba(255,185,65,${.3+pulse*.7})`;c.beginPath();c.ellipse(truck.x+tw*.11,truck.y-th*.69,tw*.025,3,0,0,7);c.fill();
  if(p.state==='warning'){const glow=c.createRadialGradient(truck.x,truck.y,0,truck.x,truck.y,130);glow.addColorStop(0,`rgba(244,160,59,${pulse*.22})`);glow.addColorStop(1,'#e9b55900');c.fillStyle=glow;c.fillRect(v.x,v.y,v.w,v.h);}
  if(['watch','search'].includes(p.state)){
   const officer=pt(p),target=pt(p.target||{x:.5,y:.6}),a=Math.atan2(target.y-officer.y,target.x-officer.x);
   c.save();c.beginPath();c.rect(v.x,v.y,v.w,v.h);c.clip();c.fillStyle='#efd37b18';c.beginPath();c.moveTo(officer.x,officer.y);c.arc(officer.x,officer.y,v.w*.25,a-.55,a+.55);c.closePath();c.fill();c.restore();person(c,images.collectorSprite,officer.x,officer.y,v.h*(.105+.11*p.y),false,s.activeTime,!!p.target&&!s.settings.reducedMotion);
   if(p.seen>.1){c.strokeStyle='#efaa6b';c.lineWidth=3;c.beginPath();c.arc(officer.x,officer.y-29,10,-Math.PI/2,-Math.PI/2+p.seen*Math.PI*2);c.stroke();}
  }
 }
 const player=pt(g.player);c.save();if(g.player.hiding){c.beginPath();c.rect(v.x,v.y,v.w,layout.cover.y*v.h);c.clip();}person(c,images.jackSprite,player.x,player.y+(g.player.hiding?v.h*.05:0),v.h*(.105+.12*g.player.y),g.player.hiding,s.activeTime,!!g.player.target&&!s.settings.reducedMotion);c.restore();
 if(g.working){const progress=g.working.elapsed/g.working.duration;c.strokeStyle='#e8bd76';c.lineWidth=4;c.beginPath();c.arc(player.x,player.y-34,15,-Math.PI/2,-Math.PI/2+progress*Math.PI*2);c.stroke();}
 if(g.noiseAt&&g.noiseAt.age<2&&!s.settings.reducedMotion){const q=pt(g.noiseAt);c.strokeStyle=`rgba(236,189,120,${1-g.noiseAt.age/2})`;c.beginPath();c.arc(q.x,q.y,15+g.noiseAt.age*50,0,7);c.stroke();}
 c.restore();
}
function person(c,im,x,y,size,hidden,time,walking){
 if(!im?.naturalWidth)return;
 c.save();c.translate(x,y);const bob=walking?Math.sin(time*11)*size*.015:0;
 c.fillStyle='#06101366';c.beginPath();c.ellipse(0,0,size*.15,size*.03,0,0,7);c.fill();
 const width=size*im.naturalWidth/im.naturalHeight;c.globalAlpha=hidden?.7:1;
 c.rotate(walking?Math.sin(time*5.5)*.012:0);c.drawImage(im,-width/2,-size+bob,width,size);c.restore();
}
export function drawFishing(c,w,h,s,ui,images){
 const g=s.activity;if(g.phase==='landed'&&images.catchPhoto?.naturalWidth){imageCover(c,images.catchPhoto,0,0,w,h);return;}imageCover(c,images.fishing,0,0,w,h);
 const shade=c.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#041319b9');shade.addColorStop(.25,'#0b202700');shade.addColorStop(.75,'#081b2240');shade.addColorStop(1,'#091a20');c.fillStyle=shade;c.fillRect(0,0,w,h);
 // Subtle surface currents; fish and line stay coupled to the simulation.
 if(!s.settings.reducedMotion){c.strokeStyle='#d8d7ac17';c.lineWidth=1;for(let i=0;i<19;i++){const yy=h*(.25+i*.026),xx=(i*97+s.activeTime*3)%w;c.beginPath();c.moveTo(xx-40,yy);c.quadraticCurveTo(xx,yy+Math.sin(i+s.activeTime)*3,xx+35,yy);c.stroke();}}
 for(const f of g.fish){if(f.caught)continue;const active=f.id===g.target&&['fight','landing','landed'].includes(g.phase),x=f.x*w,y=f.y*h,angle=active?g.runDir*.2:Math.sin(g.elapsed*.45+f.phase)*.22;
  c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=active?'#122b2ade':'#152e2db0';const size=f.kind==='heavy'?22:f.kind==='dart'?18:13;c.beginPath();c.ellipse(0,0,size,5,0,0,7);c.fill();c.beginPath();c.moveTo(-size+3,0);c.lineTo(-size-7,-5);c.lineTo(-size-7,5);c.fill();c.strokeStyle=active&&g.behavior==='run'?'#e7dec69c':'#b1c5af55';c.lineWidth=1;c.beginPath();c.ellipse(0,1,size+8,7,0,0,7);c.stroke();c.restore();
  if(g.phase==='aim')ui.hits.push({id:'fish'+f.id,x:f.x,y:f.y,r:25,type:'fish'});
 }
 const ox=.5*w,oy=.97*h,rodX=(.5+(g.rod-.5)*.40)*w,rodY=.73*h;
 c.strokeStyle='#967143';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(ox,oy);c.quadraticCurveTo(ox+(rodX-ox)*.6,oy-h*.15,rodX,rodY+g.tension*12);c.stroke();c.strokeStyle='#d7c392';c.lineWidth=1.5;c.beginPath();c.moveTo(ox,oy);c.quadraticCurveTo(ox+(rodX-ox)*.6-2,oy-h*.15,rodX-2,rodY+g.tension*12);c.stroke();
 if(['cast','wait','bite','fight','landing','landed'].includes(g.phase)){
  const fish=g.fish.find(f=>f.id===g.target),target=['fight','landing','landed'].includes(g.phase)?fish:g.hook;
  const flight=g.phase==='cast'?Math.min(1,g.phaseTime/.65):1;
  const x=rodX+(target.x*w-rodX)*flight,y=rodY+(target.y*h-rodY)*flight-Math.sin(flight*Math.PI)*h*.24;
  c.strokeStyle=g.tension>.83&&g.phase==='fight'?'#f7a37a':'#eee2bc';c.lineWidth=1.2;c.beginPath();c.moveTo(rodX,rodY+g.tension*12);c.quadraticCurveTo((rodX+x)/2,(rodY+y)/2+(g.phase==='fight'?(1-g.tension)*25:9),x,y);c.stroke();
  if(!['fight','landed','landing'].includes(g.phase)){const nibble=g.phase==='wait'&&g.phaseTime>1.2?Math.sin(g.phaseTime*10)*2:0;c.fillStyle=g.phase==='bite'?'#efb261':'#e8ddd0';c.beginPath();c.ellipse(x,y+nibble,g.phase==='bite'?3:4,g.phase==='bite'?2:7,0,0,7);c.fill();c.fillStyle='#ce6b43';c.fillRect(x-3,y-5+nibble,6,4);}
  if(g.phase==='bite'){c.strokeStyle='#f6ce81';c.lineWidth=2;c.beginPath();c.ellipse(x,y,23,9,0,0,7);c.stroke();}
 }
 if(g.phase==='aim'){
  let target=g.aim;if(ui.cast&&s.settings.castMode==='pull')target=castEndpoint(ui.cast,{x:ui.cast.lastX,y:ui.cast.lastY});
  const x=target.x*w,y=target.y*h;c.setLineDash([4,5]);c.strokeStyle='#f2d59f';c.lineWidth=1.5;c.beginPath();c.moveTo(rodX,rodY);c.quadraticCurveTo((rodX+x)/2,y-h*.16,x,y);c.stroke();c.setLineDash([]);c.beginPath();c.ellipse(x,y,17,7,0,0,7);c.stroke();
 }
 if(['landing','landed'].includes(g.phase)){
  const nx=w*.52,ny=h*.62;c.strokeStyle='#a09072';c.lineWidth=4;c.beginPath();c.ellipse(nx,ny,w*.12,h*.075,-.2,0,7);c.stroke();c.lineWidth=1;c.strokeStyle='#d2c5a170';for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(nx+i*w*.025,ny-h*.057);c.lineTo(nx+i*w*.025,ny+h*.057);c.stroke();}
  c.fillStyle='#aeb9a0';c.beginPath();c.ellipse(nx,ny,w*.075,h*.022,-.2,0,7);c.fill();c.fillStyle='#b77c50';c.beginPath();c.moveTo(nx-w*.072,ny);c.lineTo(nx-w*.1,ny-h*.02);c.lineTo(nx-w*.098,ny+h*.027);c.fill();
 }
}
