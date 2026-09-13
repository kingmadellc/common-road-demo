// The film supplies the possibility. This playable chapter supplies the reason to leave.
// A contract flag is fictional corporate coercion, not a universal real-world social score.
export const DEPARTURE_ID='fourth-morning-1';
export const DEPARTURE_SCENES=[
 {id:'refusal',seconds:7,image:'departure-workshop',focus:.5,kicker:'THE FOURTH MORNING · CORE WORKSHOP',speaker:'Jack',line:'“The cutoff’s broken. I’m not signing that.”'},
 {id:'dismissed',seconds:6,image:'departure-workshop',focus:.43,kicker:'11:42 · ACCESS WITHDRAWN',line:'By lunch, his pass no longer opened the door.'},
 {id:'account',seconds:9,image:'intro-attention',focus:.68,kicker:'THAT EVENING · THE MERCER APARTMENT',speaker:'Sarah',line:'“My pay’s in there too. They’ve frozen all of it.”',notice:true},
 {id:'appeal',seconds:7,image:'intro-attention',focus:.38,kicker:'ONE FLAG. EVERY LINKED ACCOUNT.',speaker:'Jack',line:'“Three days for an appeal. The flat wants us out tomorrow.”'},
 {id:'decision',seconds:0,image:'intro-attention',focus:.68,kicker:'BEA IS ACROSS THE BAY.',speaker:'Sarah',line:'“I’m still not trusting that radio. But we’re not waiting here. Get the kids.”'},
 {id:'bag',seconds:2.4,image:'departure-loading',focus:.5,zoom:1.23,kicker:'TEN MINUTES LATER',line:'',loading:true},
 {id:'load',seconds:3.1,image:'departure-loading',focus:.5,kicker:'',line:'',loading:true},
 {id:'children',seconds:3.5,image:'departure-boarding',focus:.51,kicker:'',speaker:'Annie',line:'“Rusty’s coming.”',loading:true},
 {id:'last-look',seconds:2,image:'departure-boarding',focus:.51,zoom:1.12,kicker:'',speaker:'Sarah',line:'“Obviously.”',loading:true}
];
export const DECISION_INDEX=DEPARTURE_SCENES.findIndex(x=>x.id==='decision');
export const NOTICE={issuer:'INDEX',title:'Household account restricted',items:[['Core report','Employment ended · refusal to certify'],['Index wallet','Joint funds held · contract charge disputed'],['Plenty order','Payment declined'],['Forma staff flat','Return keys by 06:00 tomorrow'],['Earliest appeal','In 72 hours']],detail:'Core has charged the household for ending its work contract. Index has frozen the joint wage wallet while that charge is disputed. Forma’s flat came with the job. Sarah is still employed; her pay enters the same frozen wallet. The family can appeal, but the housing deadline comes first. None of this proves the radio is telling the truth.'};
export function startDeparture(s){s.mode='departure';s.departure={id:DEPARTURE_ID,index:0,elapsed:0,decided:false};s.flags.contractFlag=true;s.flags.accountRestricted=true;}
export function departureScene(s){return DEPARTURE_SCENES[s.departure?.index||0];}
export function finishDeparture(s){s.mode='packing';s.departure=null;s.flags.departureSeen=true;s.message='The basics are aboard. Six spaces left. Bea first.';}
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
 if(im?.naturalWidth){const phase=shot.seconds?Math.min(1,p.elapsed/shot.seconds):0,zoom=(shot.zoom||1)*(s.settings.reducedMotion?1:1+phase*.025),k=Math.max(w/im.naturalWidth,h/im.naturalHeight)*zoom,iw=im.naturalWidth*k,ih=im.naturalHeight*k;
  c.drawImage(im,Math.max(w-iw,Math.min(0,w*.5-iw*shot.focus)),(h-ih)*.42,iw,ih);
 }
 const shade=c.createLinearGradient(0,h*.35,0,h);shade.addColorStop(0,'#08111400');shade.addColorStop(.5,'#08111460');shade.addColorStop(1,'#081114f5');c.fillStyle=shade;c.fillRect(0,0,w,h);
 c.restore();
}
