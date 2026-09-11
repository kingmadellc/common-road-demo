import {VERSION,SAVE_KEY,PACKING,PARTS,ROADS,node,random,siteItems} from './world.js?v=0.4.0';
import {startFishing,fishingAction,updateFishing} from './fishing.js?v=0.4.0';
import {startSalvage,salvageAction,updateSalvage,saveSite} from './salvage.js?v=0.4.0';
import {showStory,roadShots,updateReel} from './journey.js?v=0.4.0';
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function fresh(seed=42){return {version:VERSION,seed,mode:'packing',node:'yard',hour:0,deadline:72,cash:240,fuel:34,meals:8,energy:88,health:100,condition:82,fan:false,packed:['cooler','spare','chair'],parts:{fan:[],relay:[],tire:[]},cargo:null,sponsor:false,visited:['yard'],sites:{},jobs:[],activity:null,road:null,incident:null,ending:null,home:{placed:[],spot:'window'},journal:[],flags:{},settings:{castMode:'pull',autoHook:false,toggleReel:false,reducedMotion:false,sound:false,mirror:false},freshFood:[],fishSites:{},siteMemory:{},threat:{firstEncounter:false,identified:false,heat:0,encounters:0,relief:0},reel:{seen:[],gallery:[]},story:null,activeTime:0,stats:{fish:0,salvaged:0,repairs:0,miles:0,encounters:0},message:'',revision:0};}
export function load(storage){try{const s=JSON.parse(storage.getItem(SAVE_KEY));if(s?.version===VERSION&&Number.isFinite(s.hour)&&s.parts&&Array.isArray(s.journal))return s;}catch{}return null;}
export function save(storage,s){storage.setItem(SAVE_KEY,JSON.stringify(s));}
export function log(s,title,body){s.journal.unshift({hour:Math.round(s.hour*10)/10,title,body});s.journal=s.journal.slice(0,80);s.message=body;}
export function slots(s){return Object.values(s.parts).reduce((a,x)=>a+x.length,0)+(s.cargo?3:0);}
export function consumeFresh(s,amount){for(const food of s.freshFood){const n=Math.min(amount,food.meals);food.meals-=n;amount-=n;}s.freshFood=s.freshFood.filter(x=>x.meals>.001);}
export function spend(s,h){
 for(let remaining=h;remaining>.000001;){
  const dt=Math.min(.25,remaining);remaining-=dt;s.hour+=dt;consumeFresh(s,dt/8);s.meals-=dt/8;
  for(const food of s.freshFood){if(food.expires<=s.hour){s.meals=Math.max(0,s.meals-food.meals);food.meals=0;s.flags.spoiled=true;}}
  s.freshFood=s.freshFood.filter(x=>x.meals>.001);
  if(s.meals<0){s.health=clamp(s.health+s.meals*8,0,100);s.meals=0;}
  if(s.health<=0){finish(s,'stranded','You stopped to save your family.','Without food or strength to continue, you took relief transport back. The Line will have to wait.');break;}
 }
}
export function finish(s,id,title,text){s.mode='ending';s.activity=null;s.road=null;s.ending={id,title,text,owned:id==='home',hour:s.hour};log(s,title,text);}
export function startActivity(s,type,target='van'){
 if(s.mode!=='stop')throw Error('Finish the current activity first.');
 if(s.energy<8)throw Error('Rest with the family before working.');
 if(type==='salvage'){if(!node(s.node).salvage)throw Error('No accessible site here.');startSalvage(s);return;}else if(type==='fishing'){if(!node(s.node).fish)throw Error('There is no fishing access here.');startFishing(s);return; }else if(type==='repair'){
  if(target==='van'&&s.fan&&s.condition>=95)throw Error('The van is running well.');
  if(target==='pump'&&s.node!=='pump')throw Error('Reach the pump house first.');
  if(target==='pump'&&s.sponsor)throw Error('The pump is already restored.');
  s.activity=s.jobs.find(job=>job.target===target)||{type,target,elapsed:0,duration:0,phase:'diagnose',tested:[],fault:target==='pump'?'relay':!s.fan?'fan':'tire',selected:null,installed:false,connections:[],tune:.3,running:false,stable:0,notice:target==='pump'?'The pump is silent. Find where the power stops.':!s.fan?'The engine gets hot. The fan stays still.':'A tire is losing pressure. Inspect the running gear.'};
 }else throw Error('Unknown activity.');
 s.mode=type;
}
export function endActivity(s){
 const a=s.activity;if(!a)return;
 let hours=.3+a.elapsed/55;
 if(a.type==='salvage'){saveSite(s);s.energy-=7;log(s,'Back at the van',a.collected.length?`${a.collected.join(', ')} recovered. ${s.threat.identified?'They recorded the plate. Be careful at checkpoints.':'Everyone is back in the van.'}`:'You left the yard. Knowing when to stop counts too.');}
 if(a.type==='fishing'){s.energy-=3;log(s,'Lines in',a.catch?`${a.catch} portions kept. Ben is already planning dinner.`:'Nothing landed this time. The river keeps its secrets.');}
 if(a.type==='repair'){
  hours=1+a.elapsed/60;s.energy-=8;
  if(a.phase==='done'){
   s.stats.repairs++;s.jobs=s.jobs.filter(job=>job.target!==a.target);
   if(a.target==='pump'){s.sponsor=true;s.flags.pumpDone=true;log(s,'Water running',"Glenn Holt signed for the Mercer household. Your place in Morrow now has a witness.");}
   else {if(a.fault==='fan')s.fan=true;s.condition=clamp(s.condition+14+(a.quality||80)*.2,0,100);log(s,'That sounds better',a.fault==='fan'?'A working fan. A steady idle. The hills look possible again.':'The van is ready for the next rough stretch.');}
  }else {s.jobs=s.jobs.filter(job=>job.target!==a.target);s.jobs.push({...structuredClone(a),elapsed:0});log(s,'Hood closed','Your repair work is still in place. Find a part, rest, or return to finish it.');}
 }
 s.energy=clamp(s.energy,0,100);s.activity=null;s.mode='stop';spend(s,hours);if(a.type==='fishing'&&a.catch>0&&s.mode==='stop'){if(s.meals>=1){consumeFresh(s,1);s.meals-=1;s.energy=clamp(s.energy+8,0,100);s.health=clamp(s.health+6,0,100);}showStory(s,'dinner');s.flags.fishDinner=true;}
}
export function act(s,a){
 s.message='';
 if(fishingAction(s,a)||salvageAction(s,a)){s.revision++;return s;}
 switch(a.type){
 case 'pack':{if(s.mode!=='packing')throw Error('Packing has finished.');const item=PACKING.find(i=>i.id===a.id);if(!item)throw Error('Unknown item.');if(s.packed.includes(a.id))s.packed=s.packed.filter(i=>i!==a.id);else if(s.packed.reduce((v,id)=>v+PACKING.find(i=>i.id===id).slots,0)+item.slots<=6)s.packed.push(a.id);else throw Error('Six spaces. Leave something to make room.');break;}
 case 'depart':if(s.mode!=='packing')throw Error('Already on the road.');if(s.packed.includes('spare'))s.parts.tire.push(95);if(s.packed.includes('battery'))s.parts.relay.push(90);if(s.packed.includes('provisions'))s.meals+=4;s.mode='travel';s.road={...ROADS.find(r=>r.id==='opening'),elapsed:0,duration:21,eventDone:true,shots:[],shot:null};s.road.shots=roadShots(s,s.road);log(s,'Three days to Morrow','Eighteen days since leaving Everett. Frank’s last message: intake closes in 72 hours. Keep the family together.');break;
 case 'activity':startActivity(s,a.id,a.target);break;
 case 'leaveActivity':if(s.mode==='salvage'&&s.activity.phase!=='exit')throw Error('Use the rear gate or the front driveway to leave.');endActivity(s);break;
 case 'test':{const g=s.activity;if(s.mode!=='repair'||g.phase!=='diagnose')throw Error('Inspect before replacing.');if(!g.tested.includes(a.id)){g.tested.push(a.id);g.elapsed+=8;}g.notice=a.id===g.fault?({fan:'Fan motor seized. Replace the cooling fan.',relay:'Burnt relay. Power stops here.',tire:'Sidewall split. Fit a spare tire.'}[g.fault]):({fan:'Fan spins freely. Keep looking.',relay:'Power is reaching this connection.',tire:'Tire holds pressure. No leak here.'}[a.id]);if(a.id===g.fault)g.phase='replace';break;}
 case 'fit':{const g=s.activity;if(s.mode!=='repair'||g.phase!=='replace')throw Error('Find the fault first.');if(a.id!==g.fault){g.notice='That part does not fit this fault.';break;}if(!s.parts[a.id]?.length)throw Error(`Find or buy a ${PARTS[a.id].name.toLowerCase()} first.`);g.quality=s.parts[a.id].shift();g.installed=true;g.phase=g.fault==='tire'?'tune':'connect';g.notice=g.fault==='tire'?'Set the lug wrench in the brass band and hold steady pressure.':'Reconnect the matching terminals. Drag each loose lead to its socket.';break;}
 case 'connect':{const g=s.activity;if(s.mode!=='repair'||g.phase!=='connect')throw Error('Fit the component first.');if(a.from===a.to&&!g.connections.includes(a.from))g.connections.push(a.from);else if(a.from!==a.to){g.notice='Different markings. That lead belongs on the other socket.';g.elapsed+=5;}if(g.connections.length===3){g.phase='tune';g.notice='Slide the regulator into the brass band. Hold a steady idle.';}break;}
 case 'tune':if(s.mode==='repair'&&s.activity.phase==='tune')s.activity.tune=clamp(a.value,0,1);break;
 case 'rest':if(s.mode!=='stop')throw Error('Stop to rest.');spend(s,6);s.energy=Math.min(100,s.energy+42);s.health=Math.min(100,s.health+8);log(s,'Six quiet hours','The family slept. Rusty kept the warmest blanket.');break;
 case 'meal':if(s.mode!=='stop')throw Error('Stop to eat.');if(s.meals<1)throw Error('You need a household meal. Fish, buy supplies, or salvage food.');s.meals--;consumeFresh(s,1);spend(s,.5);s.energy=Math.min(100,s.energy+15);s.health=Math.min(100,s.health+12);log(s,'Something warm','A meal together. For a little while, the road can wait.');showStory(s,s.flags.fishDinner?'dinner':'cabin');break;
 case 'buy':{if(s.mode!=='stop'||!node(s.node).shop)throw Error('No trading here.');const offers={fuel:[50,()=>s.fuel=Math.min(50,s.fuel+14)],food:[30,()=>s.meals+=4],fan:[55,()=>s.parts.fan.push(90)],relay:[45,()=>s.parts.relay.push(95)],tire:[50,()=>s.parts.tire.push(90)]};const o=offers[a.id];if(!o)throw Error('Unknown supply.');if(s.cash<o[0])throw Error('Not enough cash. Salvage or trade a part.');if(PARTS[a.id]&&slots(s)>=7)throw Error('Parts locker full.');s.cash-=o[0];o[1]();spend(s,.25);s.message='Supplies aboard.';break;}
 case 'sell':if(s.mode!=='stop'||!node(s.node).shop)throw Error('Find a trader first.');if(!s.parts[a.id]?.length)throw Error('No spare to trade.');s.parts[a.id].shift();s.cash+=25;spend(s,.2);s.message='Part traded for $25.';break;
 case 'delivery':if(s.mode!=='stop'||!['freight','ridge'].includes(s.node))throw Error('Find the Pruitt convoy.');if(s.cargo)throw Error('The filters are already aboard.');if(slots(s)>4)throw Error('The crate needs three locker spaces. Fit or trade parts first.');s.cargo={condition:100};spend(s,1);log(s,'A place on the manifest','Wes Pruitt put the Mercers on the delivery list. Get these water filters to Morrow intact.');break;
 case 'weatherproof':if(s.mode!=='stop'||!s.cargo)throw Error('No delivery to cover.');if(s.flags.tarp)throw Error('The crate is already secured.');spend(s,1.5);s.flags.tarp=true;log(s,'Tied down','A tarp and proper lashings. The filters can weather the road.');break;
 case 'aid':if(s.mode!=='stop'||s.flags.aid)throw Error('The Haines emergency supplies are already used.');if(s.cash>20&&s.fuel>8&&s.meals>1)throw Error('Keep the emergency supplies for a household in trouble.');s.flags.aid=true;s.fuel+=8;s.meals+=2;spend(s,4);log(s,'A costly kindness','June found a little fuel and food. Four hours lost arranging it. Make this chance count.');break;
 case 'travel':{if(s.mode!=='stop')throw Error('Finish your stop first.');const r=ROADS.find(r=>r.id===a.id&&r.from===s.node);if(!r)throw Error('That road does not leave here.');if(s.fuel<1)throw Error('No fuel. Trade, salvage, or seek emergency help.');if(s.condition<=5)throw Error('The van cannot move. Repair the running gear.');s.road={...r,elapsed:0,duration:58,eventDone:false,pace:a.pace||'steady',startFuel:s.fuel};s.road.shots=roadShots(s,r);s.road.shot=null;s.mode='travel';s.message='';break;}
 case 'incident':{
  if(s.mode!=='incident')throw Error('No road encounter.');const i=s.incident;
  if(i.collectors){
   if(a.id==='detour'){spend(s,2);s.condition=Math.max(12,s.condition-5);log(s,'The county lane','Sarah took the unmarked lane. The Collectors never saw your plate.');}
   else if(a.id==='papers'){spend(s,1);s.threat.identified=true;s.threat.heat=1;log(s,'A name in the registry','The county permit let you through. The scanner recorded the van.');}
   else throw Error('Choose the lane or show your permit.');
   s.threat.firstEncounter=true;s.threat.relief=90;s.threat.encounters++;s.stats.encounters++;
  }else if(a.id==='careful'){spend(s,i.delay||2);s.energy=Math.max(0,s.energy-3);if(i.help)s.meals+=2;log(s,i.title,i.safe);}
  else if(a.id==='push'){s.condition=clamp(s.condition-(i.damage??16),0,100);if(s.cargo)s.cargo.condition-=i.cargo||0;s.health=Math.max(0,s.health-(i.health||0));log(s,i.title,i.risk);}
  else throw Error('Choose how to continue.');
  if(s.condition<=0||s.health<=0)finish(s,'stranded','The road asked too much.','The family took relief transport to safety.');
  if(s.mode!=='ending'){s.mode='travel';s.incident=null;s.road.shot=null;}break;
 }
 case 'storyContinue':if(s.mode!=='story')throw Error('No story to continue.');s.mode=s.story.returnMode;s.story=null;break;
 case 'skipShot':if(s.mode==='travel')s.road.shot=null;break;
 case 'setting':if(!['castMode','autoHook','toggleReel','reducedMotion','sound','mirror'].includes(a.id))throw Error('Unknown setting.');s.settings[a.id]=a.id==='castMode'?(a.value==='tap'?'tap':'pull'):!!a.value;break;
 case 'gate':{if(s.mode!=='stop'||s.node!=='line')throw Error('Reach the Line first.');if(s.hour>s.deadline){finish(s,'outside','The lights went out before you crossed.','The storm closed this intake. Your family is safe in the outer camp, but the home you came for is still beyond the Line.');break;}if(!s.sponsor&&!(s.cargo&&s.cargo.condition>=45)){s.message='Evelyn needs a sponsor or a usable filter delivery. You can seek the ridge convoy, or accept a place in the outer camp.';break;}s.mode='crossing';s.activity={type:'crossing',elapsed:0,duration:50,x:.5,target:.5,speed:.65,distance:0,damage:0,hits:[],obstacles:Array.from({length:8},(_,i)=>({id:i,z:.16+i*.105,x:[.27,.7,.5,.25,.73,.48][(i+s.seed)%6],size:.1})),notice:'Drag to steer. Hold Slow for more room. Reach the warm lights.'};break;}
 case 'returnRidge':if(s.node!=='line'||s.mode!=='stop')throw Error('You are not at the Line.');if(s.fuel<5)throw Error('You need 5 fuel to return. Emergency aid may help.');spend(s,5);s.fuel-=5;s.node='ridge';s.message='Back to the ridge. The Pruitts may still have a filter crate.';break;
 case 'outer':if(s.mode!=='stop'||s.node!=='line')throw Error('Reach the Line first.');finish(s,'outside','Together, outside the Line.','You chose the outer settlement. The family survived the pilgrimage. Ownership is still a promise across the water.');break;
 case 'rescue':if(s.mode!=='stop')throw Error('Stop before calling relief transport.');finish(s,'stranded','You kept the family together.','You left the van and took relief transport back. This attempt is over, but everyone made it out.');break;
 case 'steer':if(s.mode==='crossing')s.activity.target=clamp(a.value,.12,.88);break;
 case 'slow':if(s.mode==='crossing')s.activity.speed=a.value?.36:.7;break;
 case 'homeItem':if(s.mode!=='home')throw Error('You have not arrived.');if(!['key','picture','lamp','table'].includes(a.id))throw Error('Unknown keepsake.');if(!s.home.placed.includes(a.id))s.home.placed.push(a.id);if(a.id==='key')s.message='The key turns. This door belongs to the Mercers.';if(a.id==='picture')s.message='“Can we put holes in the wall?” “It’s our wall.”';if(a.id==='lamp')s.message='A warm light, and no login screen.';if(a.id==='table')s.message='Four places. One dog under the table. A life of your own.';break;
 case 'homeSpot':if(s.mode!=='home'||!['window','workshop'].includes(a.id))throw Error('Choose a place at home.');s.home.spot=a.id;break;
 case 'finishHome':if(s.mode!=='home'||s.home.placed.length<4)throw Error('Make yourselves at home first.');finish(s,'home','The Mercers. Homeowners.','The deed is yours. The work is your choice. Tonight, nothing needs renewing.');break;
 default:throw Error('Unknown action.');
 }
 s.revision++;
 return s;
}
export function update(s,dt){
 if(!Number.isFinite(dt)||dt<0)return;
 s.activeTime+=dt;s.threat.relief=Math.max(0,s.threat.relief-dt);
 if(s.mode==='story'){s.story.elapsed+=dt;return;}
 if(s.mode==='fishing'){updateFishing(s,dt);return;}
 if(s.mode==='salvage'){updateSalvage(s,dt);if(s.activity.phase==='exit'){endActivity(s);}return;}
 if(s.mode==='travel'){
  const r=s.road;r.elapsed+=Math.min(dt,Math.max(0,r.duration-r.elapsed));updateReel(s,dt);
  const fraction=dt/r.duration;const used=Math.min(s.fuel,r.fuel*fraction);s.fuel-=used;
  if(s.fuel<=.001&&r.fuel>0){s.node=r.from;s.mode='stop';s.road=null;spend(s,3);log(s,'Running on empty','A recovery truck pulled you back to the last stop. Three hours gone. Find fuel before another attempt.');return;}
  if(!r.eventDone&&r.elapsed>r.duration*.48){
   r.eventDone=true;
   if(!s.threat.firstEncounter||(s.threat.identified&&s.threat.relief<=0&&s.threat.encounters<2)){
    s.incident={collectors:true,title:s.threat.identified?'They have your plate':'Amber lights ahead',body:s.threat.identified?'The scanner flags the Mercer van. Continuum’s recovery truck blocks the main lane. Sarah knows a county road around it.':'A recovery squad is stopping travelers. Their scanner is aimed at the main lane. A narrow county road branches away before it.',delay:2};
   }else if(!s.fan){s.incident={title:'Temperature climbing',body:'Steam curls from the bonnet. Sarah points to a sheltered turnout.',safe:'You cooled the engine and crept through.',risk:'The hot engine took damage.',delay:2,damage:16};}
   else if(r.kind==='rough'&&s.threat.relief<=0){s.incident={title:'Loose stone at the bend',body:'The loaded van leans toward a washout. A slower line stays on firm ground.',safe:'You picked a careful line. The load stayed aboard.',risk:'The shortcut shook the load and scraped the tires.',delay:1,damage:12,cargo:15};}
   else if(r.kind==='storm'){s.incident={title:'Water over the road',body:'A storm-fed creek is over the low road. The bridge upstream is still clear.',safe:'You took the bridge and kept the family dry.',risk:'Water struck the van and its load.',delay:1.5,damage:10,cargo:s.flags.tarp?3:24};}
   if(s.incident){s.mode='incident';return;}
  }
  if(r.elapsed>=r.duration){s.node=r.to;s.visited.push(r.to);s.stats.miles+=Math.round(r.hours*35);s.condition=Math.max(6,s.condition-r.wear);s.energy=clamp(s.energy-r.hours*2.4,0,100);if(s.energy<15)s.health=Math.max(1,s.health-7);if(s.cargo&&r.kind==='storm')s.cargo.condition-=s.flags.tarp?3:12;s.mode='stop';s.road=null;spend(s,r.hours);if(s.mode==='stop')log(s,node(s.node).name,node(s.node).desc);}
 }
 const g=s.activity;if(!g)return;
 g.elapsed+=dt;
 if(s.mode==='repair'&&g.phase==='tune'){
  if(g.tune>=.58&&g.tune<=.76)g.stable+=dt;else g.stable=Math.max(0,g.stable-dt*.7);
  if(g.stable>=4){g.phase='done';g.notice=g.target==='pump'?'Water flows. Glenn is signing the household papers.':g.fault==='tire'?'Even tension. The new tire is seated and secure.':'Listen to that. A steady engine. A road worth taking.';}
 }
 if(s.mode==='crossing'){
  g.x+=(g.target-g.x)*Math.min(1,dt*5);g.distance+=dt*g.speed/35;
  for(const ob of g.obstacles){const z=ob.z-g.distance;if(z<.045&&z>-.02&&!g.hits.includes(ob.id)&&Math.abs(g.x-ob.x)<.13){g.hits.push(ob.id);g.damage+=g.speed>.5?16:7;s.condition=Math.max(0,s.condition-(g.speed>.5?12:5));if(s.cargo)s.cargo.condition-=g.speed>.5?9:3;g.notice='A hard scrape. Ease off and choose your line.';}}
  if(s.condition<=0){finish(s,'stranded','So close you could see the lights.','The van could go no farther. The crossing crew brought your family to safety, but you missed this intake.');return;}
  if(g.distance>=1){if(s.cargo&&s.cargo.condition<45&&!s.sponsor){finish(s,'outside','The delivery did not make it.','Your family reached the far bank safely. The ruined filters could not fulfill the delivery agreement. You have a place in the outer camp.');return;}s.mode='home';s.activity=null;spend(s,1);s.message='“Mercer household? Welcome home.”';log(s,'Across the Line','Evelyn recorded your household. A deed, a key, and a door that is yours.');}
 }
}
export function summary(s){return {version:s.version,mode:s.mode,node:s.node,hours:s.hour,remaining:Math.max(0,s.deadline-s.hour),fuel:Math.round(s.fuel*10)/10,meals:Math.round(s.meals*10)/10,energy:Math.round(s.energy),health:Math.round(s.health),condition:Math.round(s.condition),fan:s.fan,cash:s.cash,parts:s.parts,slots:slots(s),packed:s.packed,sponsor:s.sponsor,cargo:s.cargo,home:s.home,ending:s.ending,activity:s.activity,road:s.road,incident:s.incident,site:s.mode==='salvage'?s.sites[s.node]:undefined,message:s.message,threat:s.threat,stats:s.stats,settings:s.settings,reel:s.reel,story:s.story,fishSites:s.fishSites,freshFood:s.freshFood,activeTime:s.activeTime};}
