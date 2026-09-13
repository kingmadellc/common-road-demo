import {filmFrame} from './film.js?v=0.7.1-opening-1';
// One editorial source drives the rendered film, captions and illustrated fallback.
export const FILM_ID='run-for-it-1';
export const FILM_DURATION=96;
export const FILM_SCENES=[
 {start:0,end:5,id:'revoked',image:'intro-kitchen',focus:.58,line:'ACCESS REVOKED.',motion:'shutdown'},
 {start:5,end:11,id:'city',image:'intro-city',focus:.53,line:'San Francisco. 2041.',motion:'rain'},
 {start:11,end:17,id:'convenience',image:'campus',focus:.54,line:'They made everything convenient.',motion:'grid'},
 {start:17,end:23,id:'mandatory',image:'toll',focus:.61,line:'Then they made it mandatory.',motion:'ledger'},
 {start:23,end:30,id:'penalty',image:'squad',focus:.54,line:'Even leaving had a penalty.',motion:'search'},
 {start:30,end:36,id:'few',image:'intro-departure',focus:.42,portraitFocus:.74,line:'A few stopped asking permission.',motion:'rain'},
 {start:36,end:42,id:'engines',image:'repair-family',focus:.49,line:'Old engines. Real keys.',motion:'warm'},
 {start:42,end:48,id:'repair',image:'intro-garage',focus:.46,line:'Things you can fix.',motion:'warm'},
 {start:48,end:54,id:'off',image:'plaza',focus:.50,line:'Things they can’t switch off.',motion:'unplug'},
 {start:54,end:60,id:'rumor',image:'opening-radio',focus:.50,line:'Then a rumor crossed the country.',motion:'radio'},
 {start:60,end:67,id:'ozarks',image:'open-country',focus:.53,line:'Somewhere in the Ozarks.',motion:'paper'},
 {start:67,end:74,id:'analog',image:'basin',focus:.67,line:'No phones. No computers.',motion:'warm'},
 {start:74,end:81,id:'home',image:'home',focus:.45,line:'A home nobody can log you out of.',motion:'warm'},
 {start:81,end:87,id:'maybe',image:'intro-departure',focus:.43,portraitFocus:.74,line:'If the place is real…',motion:'dawn'},
 {start:87,end:92,id:'run',image:'highway',focus:.55,line:'…we could still make a run for it.',motion:'road'},
 {start:92,end:96,id:'title',image:'intro-departure',focus:.43,line:'Signals End',motion:'title'}
];
export const filmSceneAt=time=>FILM_SCENES.find(s=>time>=s.start&&time<s.end)||FILM_SCENES.at(-1);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function cover(c,im,w,h,focus,zoom=1){if(!im?.naturalWidth)return;const k=Math.max(w/im.naturalWidth,h/im.naturalHeight)*zoom,iw=im.naturalWidth*k,ih=im.naturalHeight*k;c.drawImage(im,clamp(w*.5-iw*focus,w-iw,0),(h-ih)*.48,iw,ih);}
function wrap(c,line,max){const words=line.split(' '),lines=[];let row='';for(const word of words){const next=row?row+' '+word:word;if(row&&c.measureText(next).width>max){lines.push(row);row=word;}else row=next;}if(row)lines.push(row);return lines;}
export function drawOpeningFrame(c,w,h,time,images,{still=false,text=true}={}){
 const scene=filmSceneAt(time),age=clamp(time-scene.start,0,scene.end-scene.start),phase=age/(scene.end-scene.start),ease=phase*phase*(3-2*phase),portrait=h>w;
 c.save();c.fillStyle='#0c171b';c.fillRect(0,0,w,h);
 const drift=still?0:(ease-.5)*.035;cover(c,images[scene.image],w,h,(portrait?(scene.portraitFocus??scene.focus):scene.focus)+drift,still?1:1.035+ease*.045);
 // The city is cold and unstable; warm, repairable places gradually fill the frame.
 c.fillStyle=['warm','dawn','title'].includes(scene.motion)?'#291b0815':'#07192235';c.fillRect(0,0,w,h);
 const scale=w/1920;
 if(!still&&scene.motion==='rain'){c.strokeStyle='#ceddde27';c.lineWidth=Math.max(1,scale);for(let i=0;i<100;i++){const x=(i*137+age*37)%w,y=(i*293+age*260)%h;c.beginPath();c.moveTo(x,y);c.lineTo(x-7*scale,y+23*scale);c.stroke();}}
 if(['grid','ledger','shutdown'].includes(scene.motion)){
  const px=w*(portrait?.08:.07),py=h*(portrait&&scene.motion==='shutdown'?.4:.2),ww=w*(portrait?.84:.30),hh=h*(portrait?.24:.32);
  c.fillStyle='#071417d4';c.fillRect(px,py,ww,hh);c.strokeStyle='#92b2ac55';c.lineWidth=2*scale;c.strokeRect(px,py,ww,hh);
  c.font=`600 ${Math.max(w*.012,portrait?w*.026:0)}px Road,sans-serif`;c.fillStyle='#a9c5ba';c.textAlign='left';c.fillText('CONTINUUM',px+ww*.08,py+hh*.16);
  const labels=['HOME','WORK','HEAT'];for(let i=0;i<3;i++){const y=py+hh*(.34+i*.2),amount=scene.motion==='shutdown'?1-clamp((age-i*.42)/1.8):clamp(phase*1.6-i*.14);c.fillStyle='#e1e6d7';c.fillText(labels[i],px+ww*.08,y);c.fillStyle=scene.motion==='shutdown'?'#c88068':'#9caa77';c.fillRect(px+ww*.40,y-hh*.03,ww*.48*amount,Math.max(2,hh*.017));}
  if(scene.motion==='shutdown'&&age>2.2){c.fillStyle='#0a131acc';c.fillRect(px,py,ww,hh);c.strokeStyle='#c88068';c.lineWidth=3*scale;c.beginPath();c.moveTo(px+ww*.40,py+hh*.37);c.lineTo(px+ww*.60,py+hh*.64);c.moveTo(px+ww*.60,py+hh*.37);c.lineTo(px+ww*.40,py+hh*.64);c.stroke();}
 }
 if(scene.motion==='search'){
  const x=w*(.2+.65*(still?.5:phase)),g=c.createLinearGradient(x-w*.2,0,x+w*.2,0);g.addColorStop(0,'#d5e5ce00');g.addColorStop(.5,'#d5e5ce36');g.addColorStop(1,'#d5e5ce00');c.fillStyle=g;c.beginPath();c.moveTo(x-w*.035,h*.13);c.lineTo(x+w*.3,h*.78);c.lineTo(x-w*.32,h*.78);c.fill();
 }
 if(scene.motion==='radio'){c.fillStyle='#d0b4790a';c.fillRect(0,0,w,h);}
 if(scene.motion==='unplug'){
  const y=h*.28,x=w*.22,gap=still?w*.055:clamp(phase*2)*w*.065;c.strokeStyle='#d0b479';c.lineWidth=w*.004;c.beginPath();c.moveTo(w*.07,y);c.lineTo(x,y);c.stroke();c.fillStyle='#d0b479';c.fillRect(x,y-w*.018,w*.045,w*.036);c.strokeStyle='#b4bba3';c.beginPath();c.moveTo(x+w*.045+gap,y);c.lineTo(w*.66,y);c.stroke();
 }
 if(scene.motion==='paper'){
  const x=w*.1,y=h*.24,mw=w*.8;c.strokeStyle='#d0b479';c.lineWidth=w*.003;c.setLineDash([w*.006,w*.008]);c.beginPath();c.moveTo(x,y+h*.14);const points=[[.2,.02],[.43,.04],[.61,-.015],[.79,.09],[1,.17]],n=still?points.length:Math.min(points.length,Math.ceil(phase*points.length));for(let i=0;i<n;i++)c.lineTo(x+points[i][0]*mw,y+points[i][1]*h);c.stroke();c.setLineDash([]);
 }
 if(scene.motion==='road')filmFrame(c,w,h,'highway',still?1:age,images);
 const shade=c.createLinearGradient(0,h*.48,0,h);shade.addColorStop(0,'#08111400');shade.addColorStop(.68,'#081114a6');shade.addColorStop(1,'#081114ec');c.fillStyle=shade;c.fillRect(0,0,w,h);
 if(scene.motion==='title'){
  c.fillStyle='#0c171b9c';c.fillRect(0,0,w,h);const mark=images['opening-mark'];if(mark?.naturalWidth){const mw=w*(portrait?.8:.49),mh=mw*mark.naturalHeight/mark.naturalWidth,appear=still?1:clamp(age/.7);c.globalAlpha=appear;c.drawImage(mark,(w-mw)/2,(h-mh)/2,mw,mh);c.globalAlpha=1;}
 }else if(text){
  const font=portrait?w*.058:w*.035;c.font=`900 ${font}px Signals,Georgia,serif`;c.textAlign='left';c.textBaseline='top';const lines=wrap(c,scene.line,w*.83),y=h*(portrait?.74:.73),leading=font*1.18;c.shadowColor='#000b';c.shadowBlur=20*scale;c.fillStyle='#f1eadb';c.globalAlpha=still?1:clamp((age-.45)/.7)*clamp((scene.end-time)/.35);lines.forEach((line,i)=>c.fillText(line,w*.085,y+i*leading));c.globalAlpha=1;c.shadowBlur=0;
 }
 // Soft dissolves, never flashing frames. The brief cold open begins with an image.
 if(!still&&age<.35&&time>.01){c.fillStyle=`rgba(12,23,27,${(1-age/.35)*.65})`;c.fillRect(0,0,w,h);}
 c.restore();
}
