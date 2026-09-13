import {random} from './world.js?v=0.6.0-signals-end-02';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const FISH_PROFILES={
 small:{name:'River fish',portions:4,stamina:8,speed:.027,run:1.5,recover:3.4},
 dart:{name:'Silver runner',portions:6,stamina:17,speed:.042,run:2.3,recover:2.8},
 heavy:{name:'Deep-water fish',portions:8,stamina:25,speed:.026,run:3.2,recover:2.3}
};
export function castEndpoint(start,end){
 const dx=clamp(start.x-end.x,-.46,.46),pull=clamp(end.y-start.y,.0,.36);
 return {x:clamp(.5+dx*1.4,.10,.90),y:clamp(.76-pull*2.1,.27,.76),valid:Math.hypot(end.x-start.x,end.y-start.y)>.035};
}
export function startFishing(s){
 s.fishSites??={};
 if(!s.fishSites[s.node]){
  const r=random(s.seed+s.node.length*91);
  s.fishSites[s.node]=['small','small','dart','heavy'].map((kind,id)=>({id,kind,x:[.3,.65,.42,.76][id],y:[.61,.64,.46,.33][id],phase:r()*6.28,caught:false,spooked:0}));
 }
 s.activity={type:'fishing',phase:'aim',elapsed:0,phaseTime:0,fish:structuredClone(s.fishSites[s.node]),hook:{x:.5,y:.5},target:null,rod:.5,reel:false,tension:.28,progress:0,overload:0,slack:0,catch:0,casts:0,catchResult:null,aim:{x:.3,y:.61},notice:'Look for a rise. Cast just ahead of it.'};
 s.mode='fishing';
}
function setPhase(g,p,notice){g.phase=p;g.phaseTime=0;g.reel=false;if(notice)g.notice=notice;}
function sync(s){s.fishSites[s.node]=structuredClone(s.activity.fish);}
function lose(s,why){const g=s.activity,f=g.fish.find(f=>f.id===g.target);if(f){f.spooked=12;f.x=clamp(f.x+.09,.12,.88);}sync(s);g.losses=(g.losses||0)+1;g.target=null;g.catchResult=null;setPhase(g,'aim',why);g.tension=.25;g.progress=0;}
function hook(s){const g=s.activity,f=g.fish.find(f=>f.id===g.target);if(!f)return;const p=FISH_PROFILES[f.kind];g.fightTime=0;g.stamina=p.stamina;g.maxStamina=p.stamina;g.distance=.78;g.tension=.32;g.overload=0;g.slack=0;g.behavior='recover';g.behaviorTime=0;g.runDir=f.x>.5?-1:1;setPhase(g,'fight','Fish on. Hold the grip to reel. Ease off when it runs.');}
export function fishingAction(s,a){
 if(!['cast','hook','reel','fishKeep','fishRelease','fishCut','fishAim','fishRetry'].includes(a.type))return false;
 if(s.mode!=='fishing')throw Error('Reach the river first.');
 const g=s.activity;
 if(a.type==='cast'){
  if(g.phase!=='aim')throw Error('Finish this cast first.');
  if(g.fish.every(f=>f.caught))throw Error('This pool is fished out. There are other banks ahead.');
  g.hook={x:clamp(a.x,.10,.90),y:clamp(a.y,.25,.76)};g.casts++;g.castMode=a.method||s.settings.castMode;g.target=null;g.progress=0;
  const nearby=g.fish.filter(f=>!f.caught&&f.spooked<=0).sort((a,b)=>Math.hypot(a.x-g.hook.x,a.y-g.hook.y)-Math.hypot(b.x-g.hook.x,b.y-g.hook.y))[0];
  if(nearby&&Math.hypot(nearby.x-g.hook.x,nearby.y-g.hook.y)<.20)g.target=nearby.id;
  setPhase(g,'cast','');
 }else if(a.type==='fishAim'){g.aim={x:clamp(a.x,.1,.9),y:clamp(a.y,.25,.76)};}
 else if(a.type==='hook'){if(g.phase==='bite')hook(s);else if(g.phase==='wait')lose(s,'Too early. Wait for the float to go under.');}
 else if(a.type==='reel'){
  if(g.phase==='fight'){g.reel=!!a.value;if(Number.isFinite(a.x))g.rod=clamp(a.x,.08,.92);}
 }else if(a.type==='fishCut'){
  if(['fight','wait','bite','cast'].includes(g.phase))lose(s,'You brought the line in. Sometimes the smart catch is the next one.');
 }else if(a.type==='fishRetry'){if(g.phase==='empty')setPhase(g,'aim','Try closer to a rise.');}
 else if(['fishKeep','fishRelease'].includes(a.type)){
  if(g.phase!=='landed'||!g.catchResult)throw Error('Land a fish first.');
  const f=g.fish.find(f=>f.id===g.target),p=FISH_PROFILES[f.kind];
  if(a.type==='fishKeep'){
   const carried=s.freshFood.reduce((n,x)=>n+x.meals,0),capacity=s.packed.includes('cooler')?3:1.5;
   if(carried+p.portions/4>capacity+.001)throw Error('No room to keep it fresh. Release this one or cook what you have.');
   const amount=p.portions/4;s.meals+=amount;g.catch+=p.portions;s.stats.fish++;s.freshFood.push({meals:amount,expires:s.hour+(s.packed.includes('cooler')?24:6)});
   g.notice=`${p.portions} portions kept. ${s.packed.includes('cooler')?'The cooler keeps it fresh.':'Cook within six hours.'}`;
  }else{g.notice='Back into the river. A good fight is enough sometimes.';s.stats.released=(s.stats.released||0)+1;}
  // A landed fish leaves this pool for the rest of the journey, including on release.
  f.caught=true;sync(s);g.target=null;g.catchResult=null;setPhase(g,'aim',g.notice);
 }
 return true;
}
export function updateFishing(s,dt){
 const g=s.activity;g.elapsed+=dt;g.phaseTime+=dt;
 for(const f of g.fish){f.spooked=Math.max(0,f.spooked-dt);if(f.caught||(['fight','landing','landed'].includes(g.phase)&&f.id===g.target))continue;
  if(f.id===g.target&&['wait','bite'].includes(g.phase)){f.x+=(g.hook.x-f.x)*dt*.65;f.y+=(g.hook.y-f.y)*dt*.65;}
  else{f.x=clamp(f.x+Math.sin(g.elapsed*.45+f.phase)*dt*.010,.12,.88);f.y=clamp(f.y+Math.cos(g.elapsed*.32+f.phase)*dt*.003,.28,.70);}}
 if(g.phase==='cast'&&g.phaseTime>.65)setPhase(g,'wait','Small nibbles first. Strike when the float goes under.');
 if(g.phase==='wait'){
  if(g.target===null&&g.phaseTime>3)setPhase(g,'empty','Nothing taking here. Try a rise nearer the bank.');
  else if(g.target!==null&&g.phaseTime>2.8+(g.target%2)*.8)setPhase(g,'bite','STRIKE · the float is under!');
 }
 if(g.phase==='bite'){if(s.settings.autoHook)hook(s);else if(g.phaseTime>1.35)lose(s,'Missed the bite. Listen for the splash and watch the float sink.');}
 if(g.phase==='fight'){
  const f=g.fish.find(f=>f.id===g.target),p=FISH_PROFILES[f.kind];g.fightTime+=dt;g.behaviorTime+=dt;
  if(g.behavior==='recover'&&g.behaviorTime>p.recover){g.behavior='telegraph';g.behaviorTime=0;g.notice='It turns. A run is coming.';}
  else if(g.behavior==='telegraph'&&g.behaviorTime>.8){g.behavior='run';g.behaviorTime=0;g.runDir=f.x>.5?-1:1;g.notice='Let it run. Release the grip.';}
  else if(g.behavior==='run'&&g.behaviorTime>p.run){g.behavior='recover';g.behaviorTime=0;g.notice='It is tiring. Reel now.';}
  const run=g.behavior==='run',counter=(g.rod-.5)*g.runDir<-.08;
  f.x=clamp(f.x+(run?g.runDir*p.speed:(.5-f.x)*.08)*dt+(g.rod-.5)*dt*.015,.12,.88);
  // Every visible force has a state. Reel gains line during recovery; runs demand margin.
  const force=g.reel?(run?.34:(g.behavior==='telegraph'?.15:.065))*(counter?.76:1):-(run?.32:.19);
  g.tension=clamp(g.tension+force*dt);
  if(g.reel){g.distance-=dt*(run?.009:.073)*(g.stamina<2?1.2:1);g.stamina=Math.max(0,g.stamina-dt*(run?.3:1.0));}
  else if(run){g.distance=Math.min(.94,g.distance+dt*.022);g.stamina=Math.max(0,g.stamina-dt*.45);}
  else g.distance=Math.min(.94,g.distance+dt*.008);
  f.y=clamp(.79-g.distance*.51,.29,.80);g.progress=clamp(1-g.distance/.78);
  g.overload=g.tension>.94?g.overload+dt:Math.max(0,g.overload-dt*2);
  g.slack=g.tension<.035&&!run?g.slack+dt:Math.max(0,g.slack-dt*2);
  if(g.tension>.83)g.notice='Line tight. Release before it breaks.';
  else if(g.slack>.8)g.notice='Loose hook! Take up the slack.';
  if(g.overload>1.1){lose(s,'The line broke under strain. Ease off sooner during a run.');return;}
  if(g.slack>2.4){lose(s,'The hook came loose. Reel when it swims toward you.');return;}
  if(g.distance<.065&&g.stamina<2){g.catchResult={kind:f.kind,portions:p.portions};setPhase(g,'landing','Bring it gently to the net.');}
 }
 if(g.phase==='landing'&&g.phaseTime>1.4){setPhase(g,'landed','Ben has it. Keep dinner, or let it swim?');s.stats.landed=(s.stats.landed||0)+1;}
}
