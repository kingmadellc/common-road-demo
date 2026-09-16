import {fixedFilmShot,sceneMotion,drawCheckoutDenial,drawIntroServiceNotice,drawFilmNote} from './cinematic-motion.js?v=0.8.7-intro-1';

// The 22 approved storyboard shots are the edit. Caption segments do not move
// the camera or restart a physical shot; they also make every line available
// in the reduced-motion, step-through version.
export const FILM_ID='run-for-it-8';
export const FILM_DURATION=232;
const cue=(at,line='',speaker,extra={})=>({at,line,...(speaker?{speaker}:{}),...extra});
const shot=(number,id,start,end,image,motion,cues,extra={})=>({number,id,start,end,image:image&&'film087-'+image,motion,focus:.5,portraitBand:true,cues,...extra});
export const FILM_SHOTS=[
 shot(1,'city',0,8,'city','rain',[
  cue(0,'San Francisco, 2041.')
 ],{description:'A stocked grocery beneath a city of screens. Cameras watch the evening queue.',region:[0,0,1,.78]}),
 shot(2,'payday',8,20,'checkout','screen',[
  cue(0,'“There’s money in there.”','Customer'),
  cue(4,'“It’s your score.”','Attendant'),
  cue(7.5)
 ],{screen:'purchase',description:'Food refuses a stocked grocery purchase. The customer’s money exists; their score blocks spending.',region:[.12,.25,.34,.25]}),
 shot(3,'cash-refused',20,32,'cash-refused','screen',[
  cue(0,'“We can’t take that.”','Attendant'),
  cue(5,'',undefined,{screen:'transfer'}),
  cue(8,'',undefined,{image:'film087-travel-denied',screen:'travel',motion:'rain',region:[0,0,1,.7]})
 ],{screen:'cash',description:'Physical notes cannot buy dinner. A friend cannot transfer money to a restricted account. Travel refuses the journey home.',region:[.1,.25,.25,.28]}),
 shot(4,'restore-access',32,45,'restore-queue','queue',[
  cue(0,'“Complete the shifts.\nThen they review your score.”','Clerk'),
  cue(7)
 ],{screen:'restore',description:'Ordinary workers queue under cameras for remedial shifts and an access review.',region:[0,.05,1,.22]}),
 shot(5,'still-checking',45,56,'dinner','screen',[
  cue(0,'“Jack. You’ve been home an hour.”','Sarah'),
  cue(6,'“I know.”','Jack')
 ],{description:'Jack checks Work at dinner. Annie lowers the drawing he has not noticed.',region:[.23,.35,.24,.22]}),
 shot(6,'smuggled',56,68,'bea-reveal','dust',[
  cue(0,'“Where’s its computer?”','Ben'),
  cue(6,'“It hasn’t got one.”','Bea')
 ],{description:'Bea reveals a shortwave receiver among rejected repair parts, checking the doorway before she speaks.',region:[.12,.24,.7,.45]}),
 shot(7,'concealed',68,80,'bea-conceals','dust',[
  cue(0,'“Can it work like that?”','Ben'),
  cue(5,'“It used to.\nDon’t let them see it.”','Bea')
 ],{description:'Bea conceals the radio beneath cables and scrap, leaving a diagram beside its corroded battery contact.',region:[.12,.3,.7,.42]}),
 shot(8,'inspection',80,92,'ben-walkway','rain',[
  cue(0),
  cue(5,'“Stay here for review.”','Inspector',{image:'film087-inspection',motion:'inspection',region:[.06,.18,.87,.62]})
 ],{description:'Ben passes an equipment inspection with the closed parts bag held close. Another resident’s unregistered machine is confiscated.',region:[0,0,1,.7]}),
 shot(9,'radio-home',92,102,'ben-home','entry',[
  cue(0)
 ],{description:'Ben has brought the concealed radio home. Behind the closed apartment door, he finally loosens his grip.',region:[.07,.08,.4,.38]}),
 shot(10,'ben-finds',102,112,'radio-dead','dust',[
  cue(0),
  cue(5,'“Come on.”','Ben')
 ],{description:'After midnight, Ben tries the switch. Nothing happens. He turns the receiver over beside Bea’s diagram.',region:[.12,.27,.75,.36]}),
 shot(11,'repair-contact',112,125,'radio-contact','dust',[
  cue(0),
  cue(6,'',undefined,{image:'film087-radio-aerial',motion:'radio-start',portraitBand:true,region:[.2,.33,.6,.26]})
 ],{portraitBand:false,description:'Ben cleans a corroded contact and secures the loose aerial lead. The dial light and sudden static make him hurry for the volume knob.',region:[.2,.25,.6,.4]}),
 shot(12,'finding-voice',125,134,'ben-tuning','radio',[
  cue(0)
 ],{description:'Ben searches the dial, losing and carefully finding a fragment of a human voice.',region:[.2,.4,.6,.27]}),
 shot(13,'broadcast-awake',134,142,'sarah-doorway','radio',[
  cue(0,'Ozark relay.\nFor anyone still awake.','Radio'),
  cue(5.2,'“Ben—”','Sarah')
 ],{description:'A voice claims to be broadcasting from the Ozarks. Sarah appears in the doorway and starts toward the forbidden receiver.',region:[.2,.4,.6,.24]}),
 shot(14,'broadcast-score',142,153,'sarah-switch','radio',[
  cue(0,'Your score doesn’t follow you here.','Radio'),
  cue(4,'You can work, buy, and sell\nwithout a screen saying yes.','Radio')
 ],{description:'Sarah’s hand stops above the switch. She lets the voice continue.',region:[.2,.37,.6,.24]}),
 shot(15,'broadcast-work',153,166,'listeners-side','radio',[
  cue(0,'Fix a pump. Grow something.\nTeach a kid.','Radio'),
  cue(4.5,'Take cash, trade,\ncharge for your work.','Radio'),
  cue(9,'What you know is worth something here.','Radio')
 ],{description:'Sarah notices Jack’s tools and her clinic badge. Ben pulls a chair beside her.',region:[.18,.38,.55,.25]}),
 shot(16,'broadcast-land',166,178,'atlas','dust',[
  cue(0,'Taxes are low.\nThey’re posted at the hall.','Radio'),
  cue(5.5,'There’s land to buy or lease,\nand lots you can build on.','Radio')
 ],{description:'Ben finds the Ozarks in an old school atlas. Sarah follows the distance from San Francisco.',region:[.1,.26,.8,.4]}),
 shot(17,'broadcast-place',178,189,'note','radio',[
  cue(0,'No phones. No computers.\nBring what you know.','Radio'),
  cue(4.5,'Ask the people who still fix things\nabout Signals End.','Radio')
 ],{description:'Ben writes Signals End on scrap paper as the distant signal begins to fade.',region:[.15,.25,.64,.4]}),
 shot(18,'sarah-doubts',189,197,'sarah-doubt','dust',[
  cue(0,'“Anyone can say that.”','Sarah'),
  cue(2.9,'“From that far away?”','Ben'),
  cue(5.7,'“Keep listening.”','Sarah')
 ],{description:'The voice is gone. Ben’s wonder and Sarah’s skepticism share the same quiet room.',region:[.15,.28,.7,.4]}),
 shot(19,'jack-wants',197,209,'jack-listening','radio',[
  cue(0,'“We could fix things.\nBuild something.”','Jack'),
  cue(5.5,'“We don’t know who’s talking.\nIt could be a trap.”','Sarah')
 ],{description:'The next evening Jack listens with his family, his Work screen facedown.',region:[.2,.4,.6,.25]}),
 shot(20,'three-nights',209,223,'argument','window',[
  cue(0,'“So we stay?”','Jack',{heading:'For three nights.'}),
  cue(3,'“I didn’t say that.\nWe get somewhere safe.”','Sarah',{image:'film087-sarah-list',motion:'dust',heading:'',region:[.17,.26,.65,.42]}),
  cue(9,'“Then we make a plan.”','Sarah',{image:'film087-ben-friends',motion:'screen',portraitBand:false,region:[.29,.33,.26,.2]})
 ],{description:'Three nights of quiet argument. Sarah lists immediate needs. Ben looks at his friends’ messages. Their first destination is somewhere safe.',region:[0,0,.38,.6]}),
 shot(21,'departure',223,228,'fourth-morning','dawn',[
  cue(0,'The fourth morning.')
 ],{description:'Jack leaves for work. The radio, Ben’s note and Sarah’s list remain on the table. The van is not packed.',region:[0,0,1,.8]}),
 shot(22,'title',228,232,null,'title',[
  cue(0,'Signals End')
 ],{description:'Signals End.'})
];

export const FILM_SCENES=FILM_SHOTS.flatMap(shot=>{
 let view={image:shot.image,focus:shot.focus,motion:shot.motion,region:shot.region,screen:shot.screen,portraitBand:shot.portraitBand,heading:undefined},cutStart=shot.start;
 return shot.cues.map((cue,index)=>{
  if(cue.image!==undefined&&cue.image!==view.image)cutStart=shot.start+cue.at;
  for(const key of ['image','focus','motion','region','screen','portraitBand','heading'])if(key in cue)view[key]=cue[key];
  return {id:index?`${shot.id}-${index+1}`:shot.id,shot:shot.number,shotId:shot.id,shotStart:shot.start,cutStart,start:shot.start+cue.at,end:shot.start+(shot.cues[index+1]?.at??shot.end-shot.start),...view,line:cue.line,speaker:cue.speaker,description:shot.description};
 });
});
export const filmCaption=scene=>scene.speaker?`${scene.speaker}: ${scene.line}`:scene.line||scene.description||'';
export const filmSceneAt=time=>FILM_SCENES.find(s=>Math.max(0,Number.isFinite(time)?time:0)>=s.start&&time<s.end)||(time>=FILM_DURATION?FILM_SCENES.at(-1):FILM_SCENES[0]);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function wrap(c,line,max){const lines=[];for(const paragraph of line.split('\n')){let row='';for(const word of paragraph.split(/\s+/)){const next=row?row+' '+word:word;if(row&&c.measureText(next).width>max){lines.push(row);row=word;}else row=next;}if(row)lines.push(row);}return lines;}
// Atkinson Hyperlegible Next (Road), distinct from the approved title wordmark.
export function captionLayout(c,w,h,scene){
 let font=w*(h>w?.052:.029),lines;
 do{c.font=`600 ${font}px Road,system-ui,sans-serif`;lines=wrap(c,scene.line||'',w*.80);if(lines.length<=4)break;font*=.94;}while(font>w*.020);
 const leading=font*1.3,labelSize=font*.43,labelGap=scene.speaker?font*.78:0,blockHeight=lines.length*leading+labelGap;
 const band=h/w>=1.45&&scene.portraitBand,y=Math.min(h*(band?(scene.screen?.81:.63):h>w?.745:.735),h*.90-blockHeight);
 return {font,lines,leading,labelSize,labelGap,x:w*.085,y,height:blockHeight,width:w*.8};
}

export const drawAccountNotice=drawCheckoutDenial;
export function drawOpeningFrame(c,w,h,time,images,{still=false,text=true}={}){
 const scene=filmSceneAt(time),age=clamp(time-scene.start,0,scene.end-scene.start),shotAge=Math.max(0,time-scene.shotStart),cutAge=Math.max(0,time-scene.cutStart),portrait=h>w;
 c.save();c.fillStyle='#0c171b';c.fillRect(0,0,w,h);
 const frame=fixedFilmShot(c,images[scene.image],w,h,scene.focus,{band:scene.portraitBand,screen:!!scene.screen});
 sceneMotion(c,w,h,cutAge,scene.motion,frame,{still,region:scene.region});
 if(scene.image==='film087-note')drawFilmNote(c,frame);
 const scale=w/1920;
 const shade=c.createLinearGradient(0,h*.52,0,h);shade.addColorStop(0,'#08111400');shade.addColorStop(.68,'#081114a6');shade.addColorStop(1,'#081114ec');c.fillStyle=shade;c.fillRect(0,0,w,h);
 if(scene.screen)drawIntroServiceNotice(c,w,h,shotAge,scene.screen,{still,compact:frame?.layout==='band'});
 if(scene.motion==='title'){
  c.fillStyle='#0c171b';c.fillRect(0,0,w,h);const mark=images['opening-mark'];if(mark?.naturalWidth){const mw=w*(portrait?.8:.49),mh=mw*mark.naturalHeight/mark.naturalWidth;c.globalAlpha=still?1:clamp(shotAge/.65);c.drawImage(mark,(w-mw)/2,(h-mh)/2,mw,mh);c.globalAlpha=1;}
 }else if(text&&scene.line){
  const block=captionLayout(c,w,h,scene);c.textAlign='left';c.textBaseline='top';c.shadowColor='#000b';c.shadowBlur=9*scale;c.fillStyle='#f1eadb';c.globalAlpha=still?1:clamp((age-.12)/.20)*clamp((scene.end-time)/.16);
  if(scene.speaker){c.font=`600 ${block.labelSize}px Road,system-ui,sans-serif`;c.fillStyle='#d0b479';c.fillText(scene.speaker.toUpperCase(),block.x,block.y);}
  c.font=`600 ${block.font}px Road,system-ui,sans-serif`;c.fillStyle='#f1eadb';block.lines.forEach((line,i)=>c.fillText(line,block.x,block.y+block.labelGap+i*block.leading));c.globalAlpha=1;c.shadowBlur=0;
 }
 if(text&&scene.heading){c.textAlign='left';c.textBaseline='top';c.font=`600 ${w*(portrait?.029:.017)}px Road,sans-serif`;c.fillStyle='#f1eadb';c.fillText(scene.heading,w*.085,h*.105);}
 // Only actual picture cuts get a soft dark transition. New dialogue retains
 // continuous light/particles and the exact same frame, without a Ken Burns move.
 if(!still&&cutAge<.28&&time>.01){c.fillStyle=`rgba(12,23,27,${(1-cutAge/.28)*.60})`;c.fillRect(0,0,w,h);}
 c.restore();
}
