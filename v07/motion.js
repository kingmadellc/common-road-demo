import {VAN_LENGTH,WHEEL_RADIUS} from './drive.js?v=0.8.7-intro-1';
import {landscapeFor} from './journey.js?v=0.8.7-intro-1';
const TAU=Math.PI*2,mod=(x,m)=>(x%m+m)%m;
export function drawRoad(c,w,h,s,ui,images){
 const r=s.road,moving=s.mode==='travel'&&!s.settings.reducedMotion,t=s.settings.reducedMotion?0:r?.elapsed||0,width=Math.min(w*.7,h*1.12,730),ppm=width/VAN_LENGTH,distance=s.settings.reducedMotion?0:(r?.meters||0)*ppm;
 const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#172e38');sky.addColorStop(.55,'#ae936c');sky.addColorStop(1,'#263b3b');c.fillStyle=sky;c.fillRect(0,0,w,h);
 const landscape=images[landscapeFor(r)];
 if(landscape?.naturalWidth){const dh=h*.755,k=Math.max(w/landscape.naturalWidth,dh/landscape.naturalHeight);c.save();c.beginPath();c.rect(0,0,w,dh);c.clip();c.drawImage(landscape,(w-landscape.naturalWidth*k)/2,(dh-landscape.naturalHeight*k)/2,landscape.naturalWidth*k,landscape.naturalHeight*k);c.restore();}
 else {for(let row=0;row<3;row++){c.fillStyle=['#5c7068','#344e49','#263e36'][row];c.beginPath();c.moveTo(0,h*.76);for(let x=0;x<=w+20;x+=20)c.lineTo(x,h*(.48+row*.075)+Math.sin(x/w*9+(s.seed||0)+row)*h*.035);c.lineTo(w,h*.76);c.fill();}}
 // The camera stays fixed. Wind and nearby roadside objects provide depth.
 const shoulder=h*.74;c.fillStyle='#475441';c.fillRect(0,shoulder,w,h*.015);
 if(moving){for(let i=0;i<36;i++){const x=mod(i*71-distance*.36,w+70)-35,y=h*(.721+(i%4)*.006);c.strokeStyle=i%3?'#72826a88':'#ac9e7366';c.lineWidth=1;c.beginPath();c.moveTo(x,y+12);c.quadraticCurveTo(x-8,y+5,x-13+Math.sin(t*3+i)*3,y-5);c.stroke();}}
 const road=c.createLinearGradient(0,h*.74,0,h);road.addColorStop(0,'#454b48');road.addColorStop(1,'#202b2d');c.fillStyle=road;c.fillRect(0,h*.748,w,h*.252);
 c.fillStyle='#b1ad96';c.fillRect(0,h*.755,w,2);c.fillStyle='#ac9a72';c.fillRect(0,h*.96,w,3);
 const gap=12*ppm,dash=3*ppm,shift=mod(distance,gap);c.save();c.fillStyle='#c7bda078';for(let x=-gap-shift;x<w+gap;x+=gap)c.fillRect(x,h*.913,dash,4);
 // Exposure-length streaks avoid per-mark Canvas filters, which stall software-backed browsers.
 // Aggregate and seams use the same road distance as tire rotation.
 c.fillStyle='#bbc0aa20';for(let i=0;i<85;i++){const x=mod(i*97.13-distance,w+120)-60,y=h*(.765+(Math.sin(i*193)*.5+.5)*.235);c.fillRect(x,y,moving?24:2,1);}c.restore();
 const seam=mod(distance,21*ppm);c.strokeStyle='#18242650';c.lineWidth=2;for(let x=-seam;x<w;x+=21*ppm){c.beginPath();c.moveTo(x,h*.76);c.lineTo(x+19,h);c.stroke();}
 // Fixed rail and approaching posts form a second depth plane.
 c.fillStyle='#a7ad9b';c.fillRect(0,h*.714,w,3);c.fillStyle='#52615a';c.fillRect(0,h*.721,w,3);for(let i=-1;i<w/(ppm*3)+2;i++){const x=i*ppm*3-mod(distance*.25,ppm*3);c.fillStyle='#8c968a';c.fillRect(x,h*.715,3,h*.035);}
 drawVan(c,w,h,s,ui,images,{x:.5,y:.855,width,time:t,moving,angle:s.settings.reducedMotion?0:r?.wheelAngle||0,mph:r?.mph||0});
 if(r?.kind==='storm'){c.fillStyle='#102d4138';c.fillRect(0,0,w,h);if(!s.settings.reducedMotion){c.strokeStyle='#aac5cb44';for(let i=0;i<50;i++){const x=mod(i*81-t*240,w),y=mod(i*37+t*280,h);c.beginPath();c.moveTo(x,y);c.lineTo(x-18,y+16);c.stroke();}}}
}
export function drawVan(c,w,h,s,ui,images,{x=.5,y=.82,width=600,time=0,moving=false,angle=0,mph=0,transport=false}={}){
 const im=images.vanBody;if(!im?.naturalWidth)return;const height=width*im.naturalHeight/im.naturalWidth,left=x*w-width/2,top=y*h-height,r=transport?width*.083:width*WHEEL_RADIUS/VAN_LENGTH;
 c.save();c.fillStyle='#030b0ca3';c.beginPath();c.ellipse(x*w,top+height*.994,width*.45,height*.035,0,0,TAU);c.fill();
 const joint=moving?Math.exp(-Math.pow((time%4.7)-.15,2)*80)*1.1:0,bounce=moving?Math.sin(time*1.8)*.22+joint:0;
 const tailX=left+width*.018,tailY=top+height*.875+bounce;
 c.strokeStyle='#69756e';c.lineWidth=Math.max(1.2,width*.005);c.lineCap='round';c.beginPath();c.moveTo(left+width*.074,top+height*.815+bounce);c.lineTo(left+width*.037,tailY);c.lineTo(tailX,tailY);c.stroke();
 c.fillStyle='#142022';c.beginPath();c.ellipse(tailX,tailY,width*.0027,width*.004,0,0,TAU);c.fill();
 c.drawImage(im,left,top+bounce,width,height);
 for(const wx of [.200,.813]){c.save();c.translate(left+wx*width,top+height*(transport?.83:.849));c.fillStyle='#101719';c.beginPath();c.arc(0,0,r,0,TAU);c.fill();c.strokeStyle='#303836';c.lineWidth=r*.15;c.beginPath();c.arc(0,0,r*.89,0,TAU);c.stroke();
 c.fillStyle='#788075';c.beginPath();c.arc(0,0,r*.64,0,TAU);c.fill();
 // Exposure samples blur rotating slots at road speed. The lighting stays fixed.
 const fast=mph>24&&!s.settings.reducedMotion,samples=fast?16:1,exposure=mph*.44704/WHEEL_RADIUS/45;
 c.save();c.rotate(angle);c.strokeStyle=fast?'#25303012':'#263233';c.lineWidth=r*.10;for(let j=0;j<samples;j++){c.save();c.rotate(-exposure*j/samples);for(let k=0;k<6;k++){c.rotate(TAU/6);c.beginPath();c.moveTo(r*.21,0);c.lineTo(r*.52,0);c.stroke();}c.restore();}c.restore();
 const hub=c.createRadialGradient(-r*.24,-r*.3,0,0,0,r*.68);hub.addColorStop(0,'#eeebc82c');hub.addColorStop(.7,'#69736b00');hub.addColorStop(1,'#0616188a');c.fillStyle=hub;c.beginPath();c.arc(0,0,r*.68,0,TAU);c.fill();c.strokeStyle='#a9ae9877';c.lineWidth=r*.025;c.beginPath();c.arc(0,0,r*.57,0,TAU);c.stroke();c.fillStyle='#abb19b';c.beginPath();c.arc(0,0,r*.17,0,TAU);c.fill();c.restore();}
 // The sprite faces right. Exhaust leaves below the rear bumper at the left,
 // then the slipstream carries it backward, close to road level.
 if(moving&&mph>0&&!s.settings.reducedMotion){
  const speed=Math.min(1,mph/67);
  for(let i=0;i<7;i++){const age=mod(time*1.35+i/7,1),px=tailX-age*width*(.08+speed*.15),py=tailY-age*height*.028+Math.sin(age*5+i)*height*.002,rx=width*(.0025+age*.017),ry=width*(.0015+age*.005);
   c.globalAlpha=.16*(1-age)*(1-age);c.fillStyle='#bac5bf';c.beginPath();c.ellipse(px,py,rx,ry,0,0,TAU);c.fill();
  }
 }
 c.restore();
}
