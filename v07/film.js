import {drawRoad,drawVan} from './motion.js?v=0.8.9-sequence-1';
export const FILMS=['highway','viaduct','rain','overtake','scanner','barrier'];
const mod=(x,m)=>(x%m+m)%m;
function cover(c,im,w,h,zoom=1,x=.5,y=.5){if(!im?.naturalWidth)return;const k=Math.max(w/im.naturalWidth,h/im.naturalHeight)*zoom;c.drawImage(im,w*.5-im.naturalWidth*k*x,h*.5-im.naturalHeight*k*y,im.naturalWidth*k,im.naturalHeight*k);}
export function filmFrame(c,w,h,id,t,images){
 c.clearRect(0,0,w,h);
 if(id==='highway'){
  cover(c,images.windshield,w,h,1,.5,.5);
  const shine=c.createLinearGradient(w*(.1+t*.1),0,w*(.38+t*.1),0);shine.addColorStop(0,'#f0c37b00');shine.addColorStop(.5,'#f0c37b0d');shine.addColorStop(1,'#f0c37b00');c.fillStyle=shine;c.fillRect(0,0,w,h*.82);
  // Airborne road dust catches the sun just above the dashboard.
  for(let i=0;i<26;i++){const x=mod(i*97.4+t*(22+i),w),y=h*(.44+mod(i*.013+t*.009,.33));c.fillStyle='#efd4a218';c.fillRect(x,y,1.5,1);}
 }else if(id==='viaduct'||id==='overtake'){
  const s={mode:'travel',fan:true,settings:{reducedMotion:false},road:{kind:'paved',elapsed:t+2,meters:(t+2)*29.95,wheelAngle:(t+2)*29.95/.36,mph:67}};drawRoad(c,w,h,s,{},id==='viaduct'?{...images,highway:images.logistics,prairie:images.logistics}:images);
  if(id==='viaduct'){const beam=c.createLinearGradient(0,0,0,h*.11);beam.addColorStop(0,'#162526');beam.addColorStop(1,'#5e6253');c.fillStyle=beam;c.fillRect(0,0,w,h*.10);for(let i=0;i<5;i++){const x=mod(i*w*.61-t*w*.76,w*3.05)-w*.3;const concrete=c.createLinearGradient(x,0,x+w*.10,0);concrete.addColorStop(0,'#222f2e');concrete.addColorStop(.18,'#52594e');concrete.addColorStop(.75,'#747869');concrete.addColorStop(1,'#333f39');c.fillStyle=concrete;c.fillRect(x,0,w*.1,h);c.save();c.beginPath();c.rect(x,0,w*.1,h);c.clip();for(let j=0;j<400;j++){c.fillStyle=j%2?'#142b2744':'#b3b49b28';c.fillRect(x+mod(j*13.33,w*.1),mod(j*57.77,h),3,2+mod(j,8));}c.strokeStyle='#1d2b2959';for(let y=10;y<h;y+=h*.2){c.beginPath();c.moveTo(x,y);c.lineTo(x+w*.1,y-3);c.stroke();}c.restore();}}

  else {const tw=w*.67,x=w*(-.7+t*.7);drawVan(c,w,h,s,{}, {...images,vanBody:images['transport-body']},{x:x/w,y:.965,width:tw,time:t,moving:true,angle:t*34/.44,mph:76,transport:true});const pulse=(Math.sin(t*8)+1)*.5;c.fillStyle=`rgba(249,182,62,${pulse*.6})`;c.fillRect(x+tw*.08,h*.965-tw*.39,tw*.04,4);}

 }else if(id==='rain'){
  cover(c,images.plaza,w,h,1,.5,.5);c.fillStyle='#102c3530';c.fillRect(0,0,w,h);c.strokeStyle='#cedee755';c.lineWidth=1;
  for(let i=0;i<155;i++){const x=mod(i*73-t*175,w),y=mod(i*131+t*480,h);c.beginPath();c.moveTo(x,y);c.lineTo(x-9,y+20);c.stroke();}for(let i=0;i<18;i++){const age=mod(t+i*.19,1);c.strokeStyle=`rgba(175,200,191,${(1-age)*.18})`;c.beginPath();c.ellipse(mod(i*113,w),h*(.65+(i%5)*.06),age*35,age*6,0,0,7);c.stroke();}
 }else if(id==='scanner'){
  cover(c,images.scanner,w,h,1,.5,.5);const x=w*(.16+t*.24),beam=c.createLinearGradient(x-100,0,x+100,0);beam.addColorStop(0,'#def6ff00');beam.addColorStop(.5,'#e6f8ff55');beam.addColorStop(1,'#def6ff00');c.fillStyle=beam;c.fillRect(0,0,w,h);c.fillStyle='#bde3e311';c.fillRect(0,h*.50+Math.sin(t*.7)*h*.12,w,3);
 }else{
  cover(c,images.blocked,w,h,1,.5,.5);c.save();c.translate(w*1.02,h*.57);c.rotate(-.6+Math.min(1,t/2.5)*.6);const metal=c.createLinearGradient(0,-h*.025,0,h*.025);metal.addColorStop(0,'#d6c7a1');metal.addColorStop(.35,'#9f9d83');metal.addColorStop(1,'#383f38');c.fillStyle=metal;c.fillRect(-w*.82,-h*.025,w*.82,h*.05);c.save();c.beginPath();c.rect(-w*.82,-h*.025,w*.82,h*.05);c.clip();c.strokeStyle='#995841';c.lineWidth=w*.03;for(let x=-w;x<0;x+=w*.09){c.beginPath();c.moveTo(x,-h*.04);c.lineTo(x+w*.05,h*.04);c.stroke();}c.restore();c.strokeStyle='#26332f';c.lineWidth=2;c.strokeRect(-w*.82,-h*.025,w*.82,h*.05);for(let i=0;i<260;i++){const x=-w*.82+mod(i*63.17,w*.82),y=-h*.023+mod(i*7.71,h*.046);c.fillStyle=i%2?'#3d473860':'#d3c4a450';c.fillRect(x,y,2+mod(i,4),1);}for(let x=-w*.78;x<0;x+=w*.11){c.fillStyle='#27332d';c.beginPath();c.arc(x,0,2.3,0,7);c.fill();}c.restore();const light=c.createRadialGradient(w*.86,h*.57,0,w*.86,h*.57,75);light.addColorStop(0,'#ffd68655');light.addColorStop(1,'#ffd68600');c.fillStyle=light;c.fillRect(0,0,w,h);
 }
 const edge=c.createRadialGradient(w*.5,h*.45,h*.22,w*.5,h*.5,w*.72);edge.addColorStop(0,'#07151900');edge.addColorStop(1,'#06141788');c.fillStyle=edge;c.fillRect(0,0,w,h);
}
