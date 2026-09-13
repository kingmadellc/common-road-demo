import {filmFrame} from './film.js?v=0.8.1-departure-1';
// One editorial source drives the rendered film, captions and illustrated fallback.
export const FILM_ID='run-for-it-4';
export const FILM_DURATION=116;
export const FILM_SCENES=[
 {
  "start": 0,
  "end": 7,
  "id": "city",
  "image": "intro-city",
  "focus": 0.62,
  "line": "San Francisco, 2041.\nNine companies run the city.\nWithout their services, you can’t live.",
  "motion": "rain"
 },
 {
  "start": 7,
  "end": 14,
  "id": "payday",
  "image": "intro-attention",
  "focus": 0.38,
  "line": "Rent. Food. Taxes.\nAnother shift tomorrow.",
  "motion": "ledger"
 },
 {
  "start": 14,
  "end": 22,
  "id": "still-checking",
  "image": "intro-attention",
  "focus": 0.38,
  "portraitFocus": 0.34,
  "line": "Jack was home.\nHe was still checking work.",
  "motion": "quiet"
 },
 {
  "start": 22,
  "end": 28,
  "id": "sarah-waiting",
  "image": "intro-attention",
  "focus": 0.68,
  "portraitFocus": 0.68,
  "speaker": "Sarah",
  "line": "“I’m talking to you.”",
  "motion": "quiet"
 },
 {
  "start": 28,
  "end": 36,
  "id": "smuggled",
  "image": "opening-radio",
  "focus": 0.85,
  "portraitFocus": 0.78,
  "landscapeZoom": 1.42,
  "line": "Bea smuggled a radio in with Jack’s repair parts.",
  "motion": "warm"
 },
 {
  "start": 36,
  "end": 43,
  "id": "ben-finds",
  "image": "opening-radio",
  "focus": 0.53,
  "portraitFocus": 0.55,
  "landscapeZoom": 1.2,
  "line": "Ben liked taking things apart.\nThat night, he tried the dial.",
  "motion": "radio"
 },
 {
  "start": 43,
  "end": 48,
  "id": "broadcast-awake",
  "image": "opening-radio",
  "focus": 0.85,
  "portraitFocus": 0.85,
  "landscapeZoom": 1.42,
  "speaker": "Radio",
  "line": "For anyone still awake.",
  "motion": "radio"
 },
 {
  "start": 48,
  "end": 55,
  "id": "broadcast-east",
  "image": "opening-radio",
  "focus": 0.61,
  "portraitFocus": 0.58,
  "speaker": "Radio",
  "line": "East of the plains, the old wheels are turning.",
  "motion": "warm"
 },
 {
  "start": 55,
  "end": 60,
  "id": "broadcast-accounts",
  "image": "opening-radio",
  "focus": 0.22,
  "portraitFocus": 0.28,
  "landscapeZoom": 1.3,
  "speaker": "Radio",
  "line": "No accounts. No computers.",
  "motion": "quiet"
 },
 {
  "start": 60,
  "end": 68,
  "id": "broadcast-place",
  "image": "opening-radio",
  "focus": 0.85,
  "portraitFocus": 0.78,
  "landscapeZoom": 1.35,
  "speaker": "Radio",
  "line": "Find the people who still fix things.\nAsk about Signals End.",
  "motion": "radio"
 },
 {
  "start": 68,
  "end": 77,
  "id": "jack-wants",
  "image": "intro-attention",
  "focus": 0.38,
  "portraitFocus": 0.34,
  "speaker": "Jack",
  "line": "“I’d like to come home and actually be here.”",
  "motion": "warm"
 },
 {
  "start": 77,
  "end": 85,
  "id": "sarah-doubts",
  "image": "intro-attention",
  "focus": 0.68,
  "portraitFocus": 0.68,
  "speaker": "Sarah",
  "line": "“And you believe some guy on the radio?”",
  "motion": "quiet"
 },
 {
  "start": 85,
  "end": 93,
  "id": "ben-wonders",
  "image": "opening-radio",
  "focus": 0.54,
  "portraitFocus": 0.56,
  "landscapeZoom": 1.22,
  "speaker": "Ben",
  "line": "“What if he’s telling the truth?”",
  "motion": "warm"
 },
 {
  "start": 93,
  "end": 101,
  "id": "three-nights",
  "image": "intro-attention",
  "focus": 0.53,
  "portraitFocus": 0.68,
  "line": "They argued for three nights.\nSarah started a list of questions.",
  "motion": "quiet"
 },
 {
  "start": 101,
  "end": 110,
  "id": "departure",
  "image": "intro-attention",
  "focus": 0.51,
  "portraitFocus": 0.73,
  "line": "By the fourth morning,\nthere was still no plan.",
  "motion": "dawn"
 },
 {
  "start": 110,
  "end": 116,
  "id": "title",
  "image": "intro-attention",
  "focus": 0.43,
  "line": "Signals End",
  "motion": "title"
 }
];
export const filmCaption=scene=>scene.speaker?`${scene.speaker}: ${scene.line}`:scene.line;
export const filmSceneAt=time=>FILM_SCENES.find(s=>time>=s.start&&time<s.end)||FILM_SCENES.at(-1);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function cover(c,im,w,h,focus,zoom=1){if(!im?.naturalWidth)return;const k=Math.max(w/im.naturalWidth,h/im.naturalHeight)*zoom,iw=im.naturalWidth*k,ih=im.naturalHeight*k;c.drawImage(im,clamp(w*.5-iw*focus,w-iw,0),(h-ih)*.48,iw,ih);}
function wrap(c,line,max){const lines=[];for(const paragraph of line.split('\n')){let row='';for(const word of paragraph.split(/\s+/)){const next=row?row+' '+word:word;if(row&&c.measureText(next).width>max){lines.push(row);row=word;}else row=next;}if(row)lines.push(row);}return lines;}
// Atkinson Hyperlegible Next is registered as Road by the game's brand styles.
// Return geometry as well as text so portrait and landscape safety can be checked.
export function captionLayout(c,w,h,scene){
 let font=w*(h>w?.052:.029),lines;
 do{c.font=`600 ${font}px Road,system-ui,sans-serif`;lines=wrap(c,scene.line,w*.80);if(lines.length<=4)break;font*=.94;}while(font>w*.020);
 const leading=font*1.3,labelSize=font*.43,labelGap=scene.speaker?font*.78:0,blockHeight=lines.length*leading+labelGap;
 const y=Math.min(h*(h>w?.745:.735),h*.90-blockHeight);
 return {font,lines,leading,labelSize,labelGap,x:w*.085,y,height:blockHeight,width:w*.8};
}

export function drawOpeningFrame(c,w,h,time,images,{still=false,text=true}={}){
 const scene=filmSceneAt(time),age=clamp(time-scene.start,0,scene.end-scene.start),phase=age/(scene.end-scene.start),ease=phase*phase*(3-2*phase),portrait=h>w;
 c.save();c.fillStyle='#0c171b';c.fillRect(0,0,w,h);
 const drift=still?0:(ease-.5)*.035;cover(c,images[scene.image],w,h,(portrait?(scene.portraitFocus??scene.focus):scene.focus)+drift,(portrait?1:(scene.landscapeZoom??1))*(still?1:1.035+ease*.045));
 // The city is cold and unstable; warm, repairable places gradually fill the frame.
 c.fillStyle=['warm','dawn','title'].includes(scene.motion)?'#291b0815':'#07192235';c.fillRect(0,0,w,h);
 const scale=w/1920;
 if(!still&&scene.motion==='rain'){c.strokeStyle='#ceddde27';c.lineWidth=Math.max(1,scale);for(let i=0;i<100;i++){const x=(i*137+age*37)%w,y=(i*293+age*260)%h;c.beginPath();c.moveTo(x,y);c.lineTo(x-7*scale,y+23*scale);c.stroke();}}
 if(['grid','ledger','shutdown'].includes(scene.motion)){
  const px=w*(portrait?.08:.07),py=h*(portrait&&scene.motion==='shutdown'?.4:.2),ww=w*(portrait?.84:.30),hh=h*(portrait?.24:.32);
  c.fillStyle='#071417d4';c.fillRect(px,py,ww,hh);c.strokeStyle='#92b2ac55';c.lineWidth=2*scale;c.strokeRect(px,py,ww,hh);
  c.font=`600 ${Math.max(w*.012,portrait?w*.026:0)}px Road,sans-serif`;c.fillStyle='#a9c5ba';c.textAlign='left';c.fillText('INDEX',px+ww*.08,py+hh*.16);
  const labels=scene.motion==='ledger'?['RENT','FOOD','TAX']:['HOME','WORK','HEAT'];for(let i=0;i<3;i++){const y=py+hh*(.34+i*.2),amount=scene.motion==='shutdown'?1-clamp((age-i*.42)/1.8):clamp(phase*1.6-i*.14);c.fillStyle='#e1e6d7';c.fillText(labels[i],px+ww*.08,y);c.fillStyle=scene.motion==='shutdown'?'#c88068':'#9caa77';c.fillRect(px+ww*.40,y-hh*.03,ww*.48*amount,Math.max(2,hh*.017));}
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
  const block=captionLayout(c,w,h,scene);c.textAlign='left';c.textBaseline='top';c.shadowColor='#000b';c.shadowBlur=9*scale;c.fillStyle='#f1eadb';c.globalAlpha=still?1:clamp((age-.35)/.55)*clamp((scene.end-time)/.3);
  if(scene.speaker){c.font=`600 ${block.labelSize}px Road,system-ui,sans-serif`;c.fillStyle='#d0b479';c.fillText(scene.speaker.toUpperCase(),block.x,block.y);}
  c.font=`600 ${block.font}px Road,system-ui,sans-serif`;c.fillStyle='#f1eadb';block.lines.forEach((line,i)=>c.fillText(line,block.x,block.y+block.labelGap+i*block.leading));c.globalAlpha=1;c.shadowBlur=0;
 }
 // Soft dissolves, never flashing frames. The brief cold open begins with an image.
 if(!still&&age<.35&&time>.01){c.fillStyle=`rgba(12,23,27,${(1-age/.35)*.65})`;c.fillRect(0,0,w,h);}
 c.restore();
}
