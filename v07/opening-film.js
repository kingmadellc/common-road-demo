import {fixedShot,sceneMotion,drawCheckoutDenial,drawQuestionPaper} from './cinematic-motion.js?v=0.8.3-cinema-1';
// One editorial source drives the rendered film, captions and illustrated fallback.
export const FILM_ID='run-for-it-6';
export const FILM_DURATION=116;
export const FILM_SCENES=[
 {
  "start": 0,
  "end": 7,
  "id": "city",
  "image": "intro-city",
  "focus": 0.62,
  "line": "San Francisco, 2041.\nNine companies run the city.\nWithout their services, you can’t live.",
  "motion": "rain",
  "region": [
   0,
   0,
   1,
   1
  ]
 },
 {
  "start": 7,
  "end": 14,
  "id": "payday",
  "image": "cine-checkout",
  "focus": 0.62,
  "line": "A full shelf.\nA locked account.\nNo other way to pay.",
  "motion": "account"
 },
 {
  "start": 14,
  "end": 22,
  "id": "still-checking",
  "image": "intro-attention",
  "focus": 0.38,
  "line": "Jack was home.\nHe was still checking work.",
  "motion": "screen",
  "region": [
   0,
   0.2,
   0.29,
   0.4
  ]
 },
 {
  "start": 22,
  "end": 28,
  "id": "sarah-waiting",
  "image": "cine-sarah-waiting",
  "focus": 0.43,
  "speaker": "Sarah",
  "line": "“I’m talking to you.”",
  "motion": "screen",
  "region": [
   0.16,
   0.23,
   0.09,
   0.12
  ]
 },
 {
  "start": 28,
  "end": 36,
  "id": "smuggled",
  "image": "cine-radio-package",
  "focus": 0.51,
  "line": "Bea smuggled a radio in with Jack’s repair parts.",
  "motion": "dust",
  "region": [
   0.24,
   0.23,
   0.58,
   0.5
  ]
 },
 {
  "start": 36,
  "end": 43,
  "id": "ben-finds",
  "image": "cine-ben-tuning",
  "focus": 0.53,
  "line": "Ben liked taking things apart.\nThat night, he tried the dial.",
  "motion": "radio",
  "region": [
   0.27,
   0.48,
   0.2,
   0.14
  ]
 },
 {
  "start": 43,
  "end": 48,
  "id": "broadcast-awake",
  "image": "cine-radio-detail",
  "focus": 0.57,
  "speaker": "Radio",
  "line": "For anyone still awake.",
  "motion": "radio",
  "region": [
   0.4,
   0.34,
   0.27,
   0.17
  ]
 },
 {
  "start": 48,
  "end": 55,
  "id": "broadcast-east",
  "image": "cine-radio-detail",
  "focus": 0.57,
  "speaker": "Radio",
  "line": "East of the plains, the old wheels are turning.",
  "motion": "radio",
  "region": [
   0.4,
   0.34,
   0.27,
   0.17
  ]
 },
 {
  "start": 55,
  "end": 60,
  "id": "broadcast-accounts",
  "image": "cine-radio-listening",
  "focus": 0.51,
  "speaker": "Radio",
  "line": "No accounts. No computers.",
  "motion": "radio",
  "region": [
   0.2,
   0.55,
   0.55,
   0.18
  ]
 },
 {
  "start": 60,
  "end": 68,
  "id": "broadcast-place",
  "image": "cine-radio-note",
  "focus": 0.5,
  "speaker": "Radio",
  "line": "Find the people who still fix things.\nAsk about Signals End.",
  "motion": "dust",
  "region": [
   0.2,
   0.2,
   0.6,
   0.5
  ]
 },
 {
  "start": 68,
  "end": 77,
  "id": "jack-wants",
  "image": "cine-family-debate",
  "focus": 0.38,
  "speaker": "Jack",
  "line": "“I’d like to come home and actually be here.”",
  "motion": "window",
  "region": [
   0.7,
   0,
   0.29,
   0.45
  ]
 },
 {
  "start": 77,
  "end": 85,
  "id": "sarah-doubts",
  "image": "cine-sarah-questions",
  "focus": 0.51,
  "speaker": "Sarah",
  "line": "“Who’s actually been there?”",
  "motion": "dust",
  "region": [
   0.18,
   0.5,
   0.65,
   0.24
  ]
 },
 {
  "start": 85,
  "end": 93,
  "id": "ben-wonders",
  "image": "cine-ben-window",
  "focus": 0.5,
  "speaker": "Ben",
  "line": "“What if he’s telling the truth?”",
  "motion": "window",
  "region": [
   0,
   0,
   0.35,
   0.55
  ]
 },
 {
  "start": 93,
  "end": 101,
  "id": "three-nights",
  "image": null,
  "focus": 0.5,
  "line": "They argued for three nights.\nSarah started a list of questions.",
  "motion": "paper"
 },
 {
  "start": 101,
  "end": 110,
  "id": "departure",
  "image": "cine-dawn",
  "focus": 0.5,
  "line": "By the fourth morning,\nthere was still no plan.",
  "motion": "dawn",
  "region": [
   0,
   0,
   1,
   1
  ]
 },
 {
  "start": 110,
  "end": 116,
  "id": "title",
  "image": null,
  "focus": 0.5,
  "line": "Signals End",
  "motion": "title"
 }
];
export const filmCaption=scene=>scene.speaker?`${scene.speaker}: ${scene.line}`:scene.line;
export const filmSceneAt=time=>FILM_SCENES.find(s=>time>=s.start&&time<s.end)||FILM_SCENES.at(-1);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
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

export const drawAccountNotice=drawCheckoutDenial;

export function drawOpeningFrame(c,w,h,time,images,{still=false,text=true}={}){
 const scene=filmSceneAt(time),age=clamp(time-scene.start,0,scene.end-scene.start),portrait=h>w;
 c.save();c.fillStyle='#0c171b';c.fillRect(0,0,w,h);
 const frame=fixedShot(c,images[scene.image],w,h,scene.focus);
 // Keep the same physical view through the two phrases of the radio broadcast.
 const shotAge=scene.id==='broadcast-east'?time-43:age;
 sceneMotion(c,w,h,shotAge,scene.motion,frame,{still,region:scene.region});
 if(scene.motion==='account')drawCheckoutDenial(c,w,h,age,{still});
 if(scene.motion==='paper')drawQuestionPaper(c,w,h,age,{still});
 const scale=w/1920;
 const shade=c.createLinearGradient(0,h*.48,0,h);shade.addColorStop(0,'#08111400');shade.addColorStop(.68,'#081114a6');shade.addColorStop(1,'#081114ec');c.fillStyle=shade;c.fillRect(0,0,w,h);
 if(scene.motion==='title'){
  c.fillStyle='#0c171b9c';c.fillRect(0,0,w,h);const mark=images['opening-mark'];if(mark?.naturalWidth){const mw=w*(portrait?.8:.49),mh=mw*mark.naturalHeight/mark.naturalWidth,appear=still?1:clamp(age/.7);c.globalAlpha=appear;c.drawImage(mark,(w-mw)/2,(h-mh)/2,mw,mh);c.globalAlpha=1;}
 }else if(text&&scene.motion!=='account'){
  const block=captionLayout(c,w,h,scene);c.textAlign='left';c.textBaseline='top';c.shadowColor='#000b';c.shadowBlur=9*scale;c.fillStyle='#f1eadb';c.globalAlpha=still?1:clamp((age-.35)/.55)*clamp((scene.end-time)/.3);
  if(scene.speaker){c.font=`600 ${block.labelSize}px Road,system-ui,sans-serif`;c.fillStyle='#d0b479';c.fillText(scene.speaker.toUpperCase(),block.x,block.y);}
  c.font=`600 ${block.font}px Road,system-ui,sans-serif`;c.fillStyle='#f1eadb';block.lines.forEach((line,i)=>c.fillText(line,block.x,block.y+block.labelGap+i*block.leading));c.globalAlpha=1;c.shadowBlur=0;
 }
 // Soft dissolves, never flashing frames. The brief cold open begins with an image.
 if(!still&&scene.id!=='broadcast-east'&&age<.35&&time>.01){c.fillStyle=`rgba(12,23,27,${(1-age/.35)*.65})`;c.fillRect(0,0,w,h);}
 c.restore();
}
