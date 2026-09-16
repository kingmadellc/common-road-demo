import {drawService} from './service-marks.js?v=0.8.7-intro-1';
import {fixedShot,sceneMotion} from './cinematic-motion.js?v=0.8.7-intro-1';
// The film supplies the possibility. This playable chapter supplies the reason to leave.
// In this fictional 2041 system, an adverse work report restricts the linked household score.
export const DEPARTURE_ID='fourth-morning-1';
export const DEPARTURE_SCENES=[
 {id:'refusal',seconds:7,image:'departure-workshop',focus:.5,motion:'screen',region:[.04,.22,.15,.22],kicker:'THE FOURTH MORNING · CONTRACTOR WORKSHOP',speaker:'Jack',line:'“The cutoff’s broken. I’m not signing that.”'},
 {id:'dismissed',seconds:6,image:'cine-dismissed',focus:.54,motion:'screen',region:[.68,.28,.09,.1],kicker:'11:42 · CONTRACTOR WORKSHOP',line:'Jack’s employer fired him before lunch.',termination:true},
 {id:'account',seconds:9,image:'cine-sarah-bank',focus:.58,motion:'screen',region:[.1,.44,.35,.3],kicker:'THAT EVENING · THE MERCER APARTMENT',speaker:'Sarah',line:'“My pay’s in there too.”',notice:true},
 {id:'appeal',seconds:7,image:null,focus:.5,motion:'deadline',kicker:'RESTORATION SHIFTS. THEN A SCORE REVIEW.',speaker:'Jack',line:'“They want me back on shifts. Our money stays held. The flat wants us out tomorrow.”'},
 {id:'decision',seconds:0,image:'cine-decision',focus:.51,motion:'dust',kicker:'BEA IS ACROSS THE BAY.',speaker:'Sarah',line:'“I don’t know if that place exists. I know we can’t stay here. Get the kids.”'},
 {id:'bag',seconds:2.4,image:'cine-stairs',focus:.5,motion:'loading',kicker:'TEN MINUTES LATER',line:'',loading:true},
 {id:'load',seconds:3.1,image:'cine-loading-night',focus:.5,motion:'loading',kicker:'',line:'',loading:true},
 {id:'children',seconds:3.5,image:'cine-boarding-night',focus:.51,motion:'loading',kicker:'',speaker:'Annie',line:'“Rusty’s coming.”',loading:true},
 {id:'last-look',seconds:2,image:'cine-van-rear',focus:.51,motion:'loading',kicker:'',speaker:'Sarah',line:'“Obviously.”',loading:true}
];
export const DECISION_INDEX=DEPARTURE_SCENES.findIndex(x=>x.id==='decision');
export const NOTICE={issuer:'Cash',title:'Household access restricted',items:[['Work report','Dismissal · adverse compliance report'],['ID social credit','Below access threshold · household linked'],['Cash wallet','Existing funds held · $0 available'],['Food order','Purchase declined · score restricted'],['Home staff flat','Return keys by 06:00 tomorrow'],['Restore access','Assigned shifts, then a score review'],['Earliest appeal','In 72 hours']],detail:'Jack’s employer reported his refusal to certify unsafe equipment. The shared household score fell below the access threshold before he could contest the report. Cash still shows their money, but none can be spent. Sarah remains employed; her pay enters the same restricted wallet. Work offers restoration shifts and a score review. Home wants the staff-flat keys before an appeal can be heard. Sarah chooses Bea first: somewhere safe to regroup, then a plan. The radio’s promise is still unverified.'};
export function startDeparture(s){s.mode='departure';s.departure={id:DEPARTURE_ID,index:0,elapsed:0,decided:false};s.flags.contractFlag=true;s.flags.accountRestricted=true;}
export function departureScene(s){return DEPARTURE_SCENES[s.departure?.index||0];}
export function finishDeparture(s){s.mode='packing';s.departure=null;s.flags.departureSeen=true;s.message='The basics are aboard. Choose what fits in the last six spaces. Bea first; then a plan.';}
export function departureAction(s,action){
 if(s.mode!=='departure'||!s.departure)return;
 const p=s.departure;
 if(action==='go'&&p.index===DECISION_INDEX){p.decided=true;p.index++;p.elapsed=0;return;}
 if(action==='skip'){if(p.index<DECISION_INDEX){p.index=DECISION_INDEX;p.elapsed=0;}else if(p.decided)finishDeparture(s);return;}
 if(action==='next'&&p.index!==DECISION_INDEX){p.index++;p.elapsed=0;if(p.index>=DEPARTURE_SCENES.length)finishDeparture(s);}
}
export function updateDeparture(s,dt,{paused=false,reduced=false}={}){
 if(s.mode!=='departure'||paused||reduced||!Number.isFinite(dt)||dt<=0)return;
 let remaining=dt;
 while(s.mode==='departure'&&remaining>0){const p=s.departure,shot=departureScene(s);if(!shot.seconds)return;const step=Math.min(remaining,Math.max(0,shot.seconds-p.elapsed));p.elapsed+=step;remaining-=step;if(p.elapsed>=shot.seconds)departureAction(s,'next');else break;}
}
export function departureSummary(s){return s.mode==='departure'?{id:DEPARTURE_ID,scene:departureScene(s).id,index:s.departure.index,elapsed:Math.round(s.departure.elapsed*10)/10,decided:s.departure.decided,caption:departureScene(s).line}:null;}

export function drawDeparture(c,w,h,s,images){
 const shot=departureScene(s),im=images[shot.image],p=s.departure;
 c.save();c.fillStyle='#0c171b';c.fillRect(0,0,w,h);
 const frame=fixedShot(c,im,w,h,shot.focus);
 sceneMotion(c,w,h,p.elapsed,shot.motion,frame,{still:s.settings.reducedMotion,region:shot.region});
 if(shot.motion==='deadline')drawDeadline(c,w,h,p.elapsed,s.settings.reducedMotion);
 const shade=c.createLinearGradient(0,h*.35,0,h);shade.addColorStop(0,'#08111400');shade.addColorStop(.5,'#08111460');shade.addColorStop(1,'#081114f5');c.fillStyle=shade;c.fillRect(0,0,w,h);
 c.restore();
}

function drawDeadline(c,w,h,age,still){
 const portrait=h>w,ww=w*(portrait?.88:.48),x=(w-ww)/2,hh=Math.min(h*.17,ww*.3),top=h*.17;
 c.save();c.textAlign='left';c.textBaseline='top';
 for(const [i,brand,title,line] of [[0,'Home · STAFF FLAT','Return keys by 06:00','Tomorrow morning'],[1,'Cash · CASE REVIEW','Review in 72 hours','Your request is in the queue']]){
  const a=still?1:Math.max(0,Math.min(1,(age-i*.7)/.35)),y=top+i*(hh+18)+(still?0:(1-a)*10);c.globalAlpha=a;
  c.fillStyle='#edf1f5';c.beginPath();c.roundRect(x,y,ww,hh,12);c.fill();c.fillStyle=i?'#354e65':'#8d3231';c.font=`650 ${ww*.036}px Road,sans-serif`;drawService(c,i?"account":"home",x+ww*.065,y+hh*.12,ww*.048,{color:"#183044"});c.fillText(brand,x+ww*.13,y+hh*.15);
  c.font=`650 ${ww*.06}px Road,sans-serif`;c.fillText(title,x+ww*.065,y+hh*.40);c.font=`400 ${ww*.038}px Road,sans-serif`;c.fillStyle='#526675';c.fillText(line,x+ww*.065,y+hh*.73);
 }
 c.restore();
}
