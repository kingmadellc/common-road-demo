import {YARD,layoutFor} from './salvage.js?v=0.6.0-candid-04';
import {FISH_PROFILES,castEndpoint} from './fishing.js?v=0.6.0-candid-04';
export function yardView(w,h){const vw=Math.min(w,h*.78*16/9),vh=vw*9/16;return{x:(w-vw)/2,y:Math.max(h*.14,(h-vh)*.46),w:vw,h:vh};}
function imageCover(c,im,x,y,w,h){if(!im?.naturalWidth)return;const k=Math.max(w/im.naturalWidth,h/im.naturalHeight);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(im,x+(w-im.naturalWidth*k)/2,y+(h-im.naturalHeight*k)/2,im.naturalWidth*k,im.naturalHeight*k);c.restore();}
export function drawSalvage(c,w,h,s,ui,images){
 const g=s.activity,p=g.patrol,item=s.sites[s.node].find(i=>i.id===g.selected&&!i.taken);
 if(g.phase==='intercept'){imageCover(c,images.squad,0,0,w,h);return;}
 const im=s.node==='yard'?images.yard:images.fuelYard;
 if(im?.naturalWidth){const focus=item||{x:.42,y:.42},scale=Math.max(w/im.naturalWidth,h/im.naturalHeight)*1.8,iw=im.naturalWidth*scale,ih=im.naturalHeight*scale;c.drawImage(im,Math.min(0,Math.max(w-iw,w*.5-focus.x*iw)),Math.min(0,Math.max(h-ih,h*.53-focus.y*ih)),iw,ih);}
 if(g.player.hiding){c.fillStyle='#081719b5';c.fillRect(0,0,w,h);imageCover(c,images.collectorTruck,w*.16,h*.38,w*.68,h*.36);}
 const shade=c.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#07191bdc');shade.addColorStop(.38,'#07191b00');shade.addColorStop(1,'#07191b85');c.fillStyle=shade;c.fillRect(0,0,w,h);
 if(item&&!g.player.hiding){c.strokeStyle='#edc88a';c.lineWidth=2;c.beginPath();c.arc(w*.5,h*.53,Math.min(w*.16,75),0,Math.PI*2);c.stroke();if(g.working){c.lineWidth=6;c.beginPath();c.arc(w*.5,h*.53,Math.min(w*.16,75)+7,-Math.PI/2,-Math.PI/2+g.working.elapsed/g.working.duration*Math.PI*2);c.stroke();}}
 if(['warning','watch','search'].includes(p.state)){const pulse=s.settings.reducedMotion?.3:(Math.sin(s.activeTime*5)+1)*.14;c.fillStyle=`rgba(249,178,62,${pulse})`;c.fillRect(0,0,12,h);c.fillRect(w-12,0,12,h);const size=Math.min(w*.3,220);imageCover(c,images.squad,w-size-12,h*.46,size,size*.65);}
 c.textAlign='center';c.font='500 '+Math.min(22,w*.047)+'px Road';c.fillStyle='#f3debc';c.fillText(g.player.hiding?'HIDDEN · THEY WILL SEAL THE YARD':item?.object.toUpperCase()||'SUPPLIES RECOVERED',w*.5,h*.83);
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
