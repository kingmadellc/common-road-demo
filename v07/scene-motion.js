const TAU=Math.PI*2,mod=(n,m)=>(n%m+m)%m;
// Motion belongs to the environment, never to a zoomed or panned photograph.
export function drawSceneMotion(c,w,h,s,art,images){
 if(s.settings.reducedMotion)return;
 const t=s.activeTime||0,im=images[art];if(!im?.naturalWidth)return;
 const scale=Math.max(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*scale,ih=im.naturalHeight*scale;
 const point=(x,y)=>({x:(w-iw)/2+iw*x,y:(h-ih)/2+ih*y});
 const glow=(x,y,r,alpha)=>{const p=point(x,y),g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r*Math.min(w,h));g.addColorStop(0,`rgba(241,182,86,${alpha})`);g.addColorStop(1,'rgba(241,182,86,0)');c.fillStyle=g;c.fillRect(0,0,w,h);};
 if(['night-watch','room-key','wells-court','hunt-meal','pump-work'].includes(art)){const positions={'night-watch':[.53,.81],'room-key':[.75,.35],'wells-court':[.51,.46],'hunt-meal':[.48,.63],'pump-work':[.59,.42]},p=positions[art];glow(...p,.18,.06+Math.sin(t*2.7)*.013+Math.sin(t*7.1)*.005);}
 if(['hunt-meal','meal-family'].includes(art)){const p=point(.51,.67);c.lineWidth=1.2;for(let i=0;i<9;i++){const age=mod(t*.12+i/9,1);c.strokeStyle=`rgba(227,224,204,${(1-age)*.08})`;c.beginPath();c.moveTo(p.x+i*2,p.y-age*h*.17);c.bezierCurveTo(p.x+8+Math.sin(t+i)*4,p.y-age*h*.17-14,p.x-7,p.y-age*h*.17-23,p.x+Math.sin(t+i)*10,p.y-age*h*.17-35);c.stroke();}}
 if(art==='pump-work'){const p=point(.97,.75);c.strokeStyle='#dceee544';c.lineWidth=1.3;for(let i=0;i<18;i++){const age=mod(t*1.7+i/18,1);c.beginPath();c.moveTo(p.x+i%4*2,p.y+age*h*.2);c.lineTo(p.x+i%4*2+2,p.y+age*h*.2+8);c.stroke();}}
 if(['witness','reply','headlamp','filter-delivery','truckee-camp','garage','yard','rawlins-shelter'].includes(art)){for(let i=0;i<24;i++){const x=mod(i*107.7+t*(2+i%4),w),y=mod(i*59.31-t*1.8,h);c.fillStyle=`rgba(228,217,181,${.04+(i%4)*.014})`;c.fillRect(x,y,i%3?1:1.7,1);}}
 if(['ava-camp','ozark-water','gate','blocked'].includes(art)){c.strokeStyle='#b2c4c02e';c.lineWidth=1;for(let i=0;i<45;i++){const x=mod(i*79.4-t*100,w),y=mod(i*117.7+t*280,h);c.beginPath();c.moveTo(x,y);c.lineTo(x-4,y+13);c.stroke();}}
 if(['annie-sky','road-ozark-woods','reunion','truckee-camp'].includes(art)){for(let i=0;i<5;i++){const x=mod(i*199+t*17,w+30)-15,y=h*(.23+mod(i*.193+t*.016,.65));c.save();c.translate(x,y);c.rotate(t*.7+i);c.fillStyle='#b0a27d42';c.beginPath();c.ellipse(0,0,3,1.2,0,0,TAU);c.fill();c.restore();}}
}
export function drawSearchLight(c,w,h,s){
 const g=s.activity,p=g?.patrol;if(!p||!['warning','watch','search'].includes(p.state))return;
 const t=s.settings.reducedMotion?1:s.activeTime,sweep=.5+Math.sin(t*.45)*.32;
 c.save();const light=c.createLinearGradient(w*.9,h*.25,w*sweep,h*.9);light.addColorStop(0,'#fff1bf38');light.addColorStop(1,'#fff1bf00');c.fillStyle=light;c.beginPath();c.moveTo(w*.94,h*.18);c.lineTo(w*(sweep-.22),h);c.lineTo(w*(sweep+.22),h);c.closePath();c.fill();
 const amber=.10+(s.settings.reducedMotion?0:(Math.sin(t*TAU)+1)*.035);c.fillStyle=`rgba(241,172,66,${amber})`;c.fillRect(0,h*.96,w,h*.04);c.restore();
}
export function drawRecoveredPart(c,w,h,item,s){
 if(!item)return;const x=w*.5,y=h*.58,size=Math.min(w*.32,h*.22,150),working=!!s.activity?.working,t=s.settings.reducedMotion?0:s.activeTime;
 c.save();c.translate(x,y);const mat=c.createRadialGradient(0,0,5,0,0,size*1.5);mat.addColorStop(0,'#091a21e8');mat.addColorStop(1,'#091a2100');c.fillStyle=mat;c.fillRect(-size*1.5,-size*1.5,size*3,size*3);
 const metal=c.createLinearGradient(-size,-size,size,size);metal.addColorStop(0,'#dae0c6');metal.addColorStop(.25,'#7b8a81');metal.addColorStop(.5,'#384e4c');metal.addColorStop(.8,'#98a69a');metal.addColorStop(1,'#2b3f3d');c.fillStyle=metal;c.strokeStyle='#b7ba96';c.lineWidth=2;
 if(item.type==='fan'||item.type==='tire'){c.beginPath();c.arc(0,0,size*.7,0,TAU);c.fill();c.fillStyle='#142527';c.beginPath();c.arc(0,0,size*.57,0,TAU);c.fill();c.fillStyle=metal;if(item.type==='fan'){c.rotate(working?Math.sin(t*2)*.08:0);for(let i=0;i<5;i++){c.rotate(TAU/5);c.beginPath();c.ellipse(size*.28,0,size*.28,size*.12,.5,0,TAU);c.fill();}}else{c.strokeStyle='#758077';c.lineWidth=size*.18;c.beginPath();c.arc(0,0,size*.43,0,TAU);c.stroke();}c.fillStyle='#bec4ae';c.beginPath();c.arc(0,0,size*.13,0,TAU);c.fill();}
 else {const pw=size*(item.type==='relay'?.72:1),ph=size*(item.type==='fuel'?1.3:.85);c.beginPath();c.roundRect(-pw/2,-ph/2,pw,ph,6);c.fill();c.stroke();if(item.type==='relay'){c.fillStyle='#b69763';for(let i=-1;i<=1;i++)c.fillRect(i*pw*.28-3,ph/2,6,14);c.strokeStyle='#d0ae78';for(let i=0;i<7;i++){c.beginPath();c.ellipse(0,-ph*.17+i*5,pw*.29,7,0,0,TAU);c.stroke();}}else if(item.type==='fuel'){c.lineWidth=6;c.strokeRect(-pw*.2,-ph*.68,pw*.4,ph*.15);c.lineWidth=3;c.beginPath();c.moveTo(-pw*.33,-ph*.3);c.lineTo(pw*.33,ph*.3);c.moveTo(pw*.33,-ph*.3);c.lineTo(-pw*.33,ph*.3);c.stroke();}else{c.strokeStyle='#b6aa83';for(let i=0;i<3;i++)c.strokeRect(-pw*.4,-ph*.3+i*ph*.25,pw*.8,ph*.18);}}
 if(working){const progress=s.activity.working.elapsed/s.activity.working.duration;c.strokeStyle='#cfb579';c.lineWidth=3;c.beginPath();c.arc(0,0,size*.9,-Math.PI/2,-Math.PI/2+progress*TAU);c.stroke();}c.restore();
}
