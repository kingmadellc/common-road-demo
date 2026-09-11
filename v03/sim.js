import {VERSION,SAVE_KEY,PACKING,PARTS,ROADS,node,random,siteItems} from './world.js?v=0.3.0';
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function fresh(seed=42){return {version:VERSION,seed,mode:'packing',node:'yard',hour:0,deadline:72,cash:240,fuel:34,meals:8,energy:88,health:100,condition:82,fan:false,packed:['cooler','spare','chair'],parts:{fan:[],relay:[],tire:[]},cargo:null,sponsor:false,visited:['yard'],sites:{},jobs:[],activity:null,road:null,incident:null,ending:null,home:{placed:[],spot:'window'},journal:[],flags:{},stats:{fish:0,salvaged:0,repairs:0,miles:0},message:'',revision:0};}
export function load(storage){try{const s=JSON.parse(storage.getItem(SAVE_KEY));if(s?.version===VERSION&&Number.isFinite(s.hour)&&s.parts&&Array.isArray(s.journal))return s;}catch{}return null;}
export function save(storage,s){storage.setItem(SAVE_KEY,JSON.stringify(s));}
export function log(s,title,body){s.journal.unshift({hour:Math.round(s.hour*10)/10,title,body});s.journal=s.journal.slice(0,80);s.message=body;}
export function slots(s){return Object.values(s.parts).reduce((a,x)=>a+x.length,0)+(s.cargo?3:0);}
export function spend(s,h){s.hour+=h;s.meals-=h/8;if(s.meals<0){s.health=clamp(s.health+s.meals*8,0,100);s.meals=0;}if(s.health<=0)finish(s,'stranded','You stopped to save your family.','Without food or strength to continue, you took the last relief transport back. The Line will have to wait.');}
export function finish(s,id,title,text){s.mode='ending';s.activity=null;s.road=null;s.ending={id,title,text,owned:id==='home',hour:s.hour};log(s,title,text);}
export function startActivity(s,type,target='van'){
 if(s.mode!=='stop')throw Error('Finish the current activity first.');
 if(s.energy<8)throw Error('Rest with the family before working.');
 if(type==='salvage'){
  if(!node(s.node).salvage)throw Error('There is no accessible salvage here.');
  s.sites[s.node]??=siteItems(s.seed,s.node);s.activity={type,elapsed:0,duration:100,selected:null,carry:null,damage:0,noise:0,collected:[],tool:'inspect'};
 }else if(type==='fishing'){
  if(!node(s.node).fish)throw Error('There is no fishing access here.');
  const r=random(s.seed+s.stats.fish*29+s.node.length*7);s.activity={type,elapsed:0,duration:90,phase:'aim',hook:{x:.5,y:.55},fish:Array.from({length:4},(_,i)=>({id:i,x:.17+r()*.66,y:.43+r()*.3,size:i===3?3:2,phase:r()*6.28,caught:false})),target:null,tension:.23,progress:0,reel:false,rod:.5,catch:0,casts:0,notice:'Choose a fish. Pull back and release to cast.'};
 }else if(type==='repair'){
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
 if(a.type==='salvage'){s.energy-=7;log(s,'Back at the van',a.collected.length?`${a.collected.join(', ')} recovered. The yard stays picked over.`:'You left the yard. Knowing when to stop counts too.');}
 if(a.type==='fishing'){s.energy-=3;log(s,'Lines in',a.catch?`${a.catch} household meals in the cooler. Ben is already planning dinner.`:'Nothing landed this time. The river keeps its secrets.');}
 if(a.type==='repair'){
  hours=1+a.elapsed/60;s.energy-=8;
  if(a.phase==='done'){
   s.stats.repairs++;s.jobs=s.jobs.filter(job=>job.target!==a.target);
   if(a.target==='pump'){s.sponsor=true;s.flags.pumpDone=true;log(s,'Water running',"Glenn Holt signed for the Mercer household. Your place in Morrow now has a witness.");}
   else {if(a.fault==='fan')s.fan=true;s.condition=clamp(s.condition+14+(a.quality||80)*.2,0,100);log(s,'That sounds better',a.fault==='fan'?'A working fan. A steady idle. The hills look possible again.':'The van is ready for the next rough stretch.');}
  }else {s.jobs=s.jobs.filter(job=>job.target!==a.target);s.jobs.push({...structuredClone(a),elapsed:0});log(s,'Hood closed','Your repair work is still in place. Find a part, rest, or return to finish it.');}
 }
 s.energy=clamp(s.energy,0,100);s.activity=null;s.mode='stop';spend(s,hours);
}
export function act(s,a){
 s.message='';
 switch(a.type){
 case 'pack':{if(s.mode!=='packing')throw Error('Packing has finished.');const item=PACKING.find(i=>i.id===a.id);if(!item)throw Error('Unknown item.');if(s.packed.includes(a.id))s.packed=s.packed.filter(i=>i!==a.id);else if(s.packed.reduce((v,id)=>v+PACKING.find(i=>i.id===id).slots,0)+item.slots<=6)s.packed.push(a.id);else throw Error('Six spaces. Leave something to make room.');break;}
 case 'depart':if(s.mode!=='packing')throw Error('Already on the road.');if(s.packed.includes('spare'))s.parts.tire.push(95);if(s.packed.includes('battery'))s.parts.relay.push(90);if(s.packed.includes('provisions'))s.meals+=4;s.mode='stop';log(s,'Three days to Morrow','Eighteen days since leaving Everett. Frank’s last message: intake closes in 72 hours. Keep the family together.');break;
 case 'activity':startActivity(s,a.id,a.target);break;
 case 'leaveActivity':endActivity(s);break;
 case 'inspect':{const g=s.activity;if(s.mode!=='salvage'||!g)throw Error('No salvage expedition.');g.selected=a.id;break;}
 case 'take':{const g=s.activity;if(s.mode!=='salvage')throw Error('No salvage expedition.');const item=s.sites[s.node].find(i=>i.id===a.id);if(!item||item.taken)throw Error('That has already been recovered.');if(['fan','relay','tire'].includes(item.type)&&slots(s)>=7)throw Error('Parts locker full. Trade or fit a part first.');item.taken=true;g.collected.push(item.name);s.stats.salvaged++;
  if(PARTS[item.type])s.parts[item.type].push(Math.max(25,item.quality-Math.round(g.damage)));
  if(item.type==='food')s.meals+=3;if(item.type==='fuel')s.fuel=Math.min(50,s.fuel+8);
  if(g.damage>30){s.health-=5;log(s,'A rough extraction','Jack scraped his hand. The part survived, but it needs care.');}
  g.damage=0;g.carry=null;g.selected=null;s.message=`${item.name} secured.`;break;}
 case 'test':{const g=s.activity;if(s.mode!=='repair'||g.phase!=='diagnose')throw Error('Inspect before replacing.');if(!g.tested.includes(a.id)){g.tested.push(a.id);g.elapsed+=8;}g.notice=a.id===g.fault?({fan:'Fan motor seized. Replace the cooling fan.',relay:'Burnt relay. Power stops here.',tire:'Sidewall split. Fit a spare tire.'}[g.fault]):({fan:'Fan spins freely. Keep looking.',relay:'Power is reaching this connection.',tire:'Tire holds pressure. No leak here.'}[a.id]);if(a.id===g.fault)g.phase='replace';break;}
 case 'fit':{const g=s.activity;if(s.mode!=='repair'||g.phase!=='replace')throw Error('Find the fault first.');if(a.id!==g.fault){g.notice='That part does not fit this fault.';break;}if(!s.parts[a.id]?.length)throw Error(`Find or buy a ${PARTS[a.id].name.toLowerCase()} first.`);g.quality=s.parts[a.id].shift();g.installed=true;g.phase=g.fault==='tire'?'tune':'connect';g.notice=g.fault==='tire'?'Set the lug wrench in the brass band and hold steady pressure.':'Reconnect the matching terminals. Drag each loose lead to its socket.';break;}
 case 'connect':{const g=s.activity;if(s.mode!=='repair'||g.phase!=='connect')throw Error('Fit the component first.');if(a.from===a.to&&!g.connections.includes(a.from))g.connections.push(a.from);else if(a.from!==a.to){g.notice='Different markings. That lead belongs on the other socket.';g.elapsed+=5;}if(g.connections.length===3){g.phase='tune';g.notice='Slide the regulator into the brass band. Hold a steady idle.';}break;}
 case 'tune':if(s.mode==='repair'&&s.activity.phase==='tune')s.activity.tune=clamp(a.value,0,1);break;
 case 'cast':{const g=s.activity;if(s.mode!=='fishing'||g.phase==='hooked')throw Error('Finish this cast first.');g.casts++;g.hook={x:clamp(a.x,.08,.92),y:clamp(a.y,.16,.8)};const f=g.fish.filter(f=>!f.caught).sort((f,b)=>Math.hypot(f.x-g.hook.x,f.y-g.hook.y)-Math.hypot(b.x-g.hook.x,b.y-g.hook.y))[0];if(f&&Math.hypot(f.x-g.hook.x,f.y-g.hook.y)<.19){g.target=f.id;g.phase='hooked';g.progress=0;g.tension=.28;g.notice='Fish on. Hold to reel; release when the line pulls hard.';}else{g.phase='aim';g.notice='A quiet patch. Cast nearer a moving fish.';}break;}
 case 'reel':if(s.mode==='fishing'){s.activity.reel=!!a.value;if(Number.isFinite(a.x))s.activity.rod=clamp(a.x,.05,.95);}break;
 case 'rest':if(s.mode!=='stop')throw Error('Stop to rest.');spend(s,6);s.energy=Math.min(100,s.energy+42);s.health=Math.min(100,s.health+8);log(s,'Six quiet hours','The family slept. Rusty kept the warmest blanket.');break;
 case 'meal':if(s.mode!=='stop')throw Error('Stop to eat.');if(s.meals<1)throw Error('You need a household meal. Fish, buy supplies, or salvage food.');s.meals--;spend(s,.5);s.energy=Math.min(100,s.energy+15);s.health=Math.min(100,s.health+12);log(s,'Something warm','A meal together. For a little while, the road can wait.');break;
 case 'buy':{if(s.mode!=='stop'||!node(s.node).shop)throw Error('No trading here.');const offers={fuel:[50,()=>s.fuel=Math.min(50,s.fuel+14)],food:[30,()=>s.meals+=4],fan:[55,()=>s.parts.fan.push(90)],relay:[45,()=>s.parts.relay.push(95)],tire:[50,()=>s.parts.tire.push(90)]};const o=offers[a.id];if(!o)throw Error('Unknown supply.');if(s.cash<o[0])throw Error('Not enough cash. Salvage or trade a part.');if(PARTS[a.id]&&slots(s)>=7)throw Error('Parts locker full.');s.cash-=o[0];o[1]();spend(s,.25);s.message='Supplies aboard.';break;}
 case 'sell':if(s.mode!=='stop'||!node(s.node).shop)throw Error('Find a trader first.');if(!s.parts[a.id]?.length)throw Error('No spare to trade.');s.parts[a.id].shift();s.cash+=25;spend(s,.2);s.message='Part traded for $25.';break;
 case 'delivery':if(s.mode!=='stop'||!['freight','ridge'].includes(s.node))throw Error('Find the Pruitt convoy.');if(s.cargo)throw Error('The filters are already aboard.');if(slots(s)>4)throw Error('The crate needs three locker spaces. Fit or trade parts first.');s.cargo={condition:100};spend(s,1);log(s,'A place on the manifest','Wes Pruitt put the Mercers on the delivery list. Get these water filters to Morrow intact.');break;
 case 'weatherproof':if(s.mode!=='stop'||!s.cargo)throw Error('No delivery to cover.');if(s.flags.tarp)throw Error('The crate is already secured.');spend(s,1.5);s.flags.tarp=true;log(s,'Tied down','A tarp and proper lashings. The filters can weather the road.');break;
 case 'aid':if(s.mode!=='stop'||s.flags.aid)throw Error('The Haines emergency supplies are already used.');if(s.cash>20&&s.fuel>8&&s.meals>1)throw Error('Keep the emergency supplies for a household in trouble.');s.flags.aid=true;s.fuel+=8;s.meals+=2;spend(s,4);log(s,'A costly kindness','June found a little fuel and food. Four hours lost arranging it. Make this chance count.');break;
 case 'travel':{if(s.mode!=='stop')throw Error('Finish your stop first.');const r=ROADS.find(r=>r.id===a.id&&r.from===s.node);if(!r)throw Error('That road does not leave here.');if(s.fuel<1)throw Error('No fuel. Trade, salvage, or seek emergency help.');if(s.condition<=5)throw Error('The van cannot move. Repair the running gear.');s.road={...r,elapsed:0,duration:38,eventDone:false,pace:a.pace||'steady',startFuel:s.fuel};s.mode='travel';s.message='';break;}
 case 'incident':{if(s.mode!=='incident')throw Error('No road incident.');const i=s.incident;
  if(a.id==='careful'){spend(s,i.delay||2);s.energy=Math.max(0,s.energy-3);if(i.help)s.meals+=2;log(s,i.title,i.safe);}
  else {s.condition=clamp(s.condition-(i.damage??16),0,100);if(s.cargo)s.cargo.condition-=i.cargo||0;s.health=Math.max(0,s.health-(i.health||0));if(i.title==='The weather caught you'&&!s.packed.includes('cooler'))s.meals=Math.max(0,s.meals-2);log(s,i.title,i.risk);}
  if(s.condition<=0||s.health<=0)finish(s,'stranded','The road asked too much.','The family took relief transport to safety. The van and this attempt stayed behind.');if(s.mode!=='ending'){s.mode='travel';s.incident=null;}break;}
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
 if(s.mode==='travel'){
  const r=s.road;r.elapsed+=dt;
  const fraction=dt/r.duration;const used=Math.min(s.fuel,r.fuel*fraction);s.fuel-=used;
  if(s.fuel<=.001){s.node=r.from;s.mode='stop';s.road=null;spend(s,3);log(s,'Running on empty','A recovery truck pulled you back to the last stop. Three hours gone. Find fuel before another attempt.');return;}
  if(!r.eventDone&&r.elapsed>r.duration*.48){
   r.eventDone=true;
   if(!s.fan){s.incident={title:'Temperature climbing',body:'The cooling fan has stopped. Steam curls from the bonnet. Sarah is watching the gauge.',safe:'You cooled the engine and crept through. Three hours lost.',risk:'You pushed on. Heat damaged the engine.',delay:3,damage:22,health:3};}
   else if(r.kind==='rough'){s.incident={title:'The road gives way',body:'Loose stone across the bend. The van feels heavy. Ben braces the parts locker.',safe:'You took the rough section slowly. Everything stayed aboard.',risk:'The shortcut battered the tires and rattled the load.',delay:1.5,damage:14,cargo:20};}
   else if(r.kind==='storm'||s.hour>36){s.incident={title:'The weather caught you',body:'Rain turns the roadside to silver. The freight approach is beginning to flood.',safe:'You waited under a concrete overpass. The family stayed dry.',risk:s.flags.tarp?'The tied-down crate held. The van took the punishment.':'Water reached the load. Some of the filters are damaged.',delay:2,damage:12,cargo:s.flags.tarp?4:30};}
   else {s.incident={title:'Another family, another broken van',body:'The Navarros are stopped at the bend. A loose battery lead. A frightened child. You could help.',safe:'You helped the Navarros. Elena shared food for the road.',risk:'You carried on. In the mirror, their hazard lights disappeared.',delay:1,damage:0};s.incident.help=true;}
   if(s.incident){s.mode='incident';return;}
  }
  if(r.elapsed>=r.duration){s.node=r.to;s.visited.push(r.to);s.stats.miles+=Math.round(r.hours*35);s.condition=Math.max(6,s.condition-r.wear);s.energy=clamp(s.energy-r.hours*2.4,0,100);if(s.energy<15)s.health=Math.max(1,s.health-7);if(s.cargo&&r.kind==='storm')s.cargo.condition-=s.flags.tarp?3:12;s.mode='stop';s.road=null;spend(s,r.hours);if(s.mode==='stop')log(s,node(s.node).name,node(s.node).desc);}
 }
 const g=s.activity;if(!g)return;
 g.elapsed+=dt;
 if(s.mode==='salvage'){
  g.noise=Math.min(1,g.elapsed/125);
  if(g.elapsed>=g.duration){s.health=Math.max(1,s.health-(g.carry?5:0));endActivity(s);s.message='The site grew unsafe. You returned with what you had secured.';}
 }
 if(s.mode==='repair'&&g.phase==='tune'){
  if(g.tune>=.58&&g.tune<=.76)g.stable+=dt;else g.stable=Math.max(0,g.stable-dt*.7);
  if(g.stable>=4){g.phase='done';g.notice=g.target==='pump'?'Water flows. Glenn is signing the household papers.':g.fault==='tire'?'Even tension. The new tire is seated and secure.':'Listen to that. A steady engine. A road worth taking.';}
 }
 if(s.mode==='fishing'){
  for(const f of g.fish){if(!f.caught&&!(g.phase==='hooked'&&g.target===f.id)){f.x=clamp(f.x+Math.sin(g.elapsed*.75+f.phase)*dt*.018,.1,.9);f.y=clamp(f.y+Math.cos(g.elapsed*.5+f.phase)*dt*.007,.4,.78);}}
  if(g.phase==='hooked'){
   const pull=(Math.sin(g.elapsed*1.6)+1)*.5;const fish=g.fish.find(f=>f.id===g.target);const leverage=Math.abs(g.rod-fish.x)>.25?.75:1;
   g.tension=clamp(g.tension+dt*(g.reel?(.065+pull*.17)*leverage:-.2),0,1);
   if(g.reel)g.progress+=dt*(g.tension>.85?.018:.06);else g.progress=Math.max(0,g.progress-dt*.006);
   if(g.tension>=1){g.phase='aim';g.reel=false;g.notice='The line snapped. Give the next fish room to run.';g.elapsed+=5;}
   if(g.progress>=1){const f=g.fish.find(f=>f.id===g.target);f.caught=true;const amount=f.size+(s.packed.includes('cooler')?1:0);g.catch+=amount;s.meals+=amount;s.stats.fish++;g.phase='aim';g.reel=false;g.notice=`${amount} household meals landed. Another cast, or head back?`;}
  }
  if(g.elapsed>=g.duration||g.fish.every(f=>f.caught))endActivity(s);
 }
 if(s.mode==='crossing'){
  g.x+=(g.target-g.x)*Math.min(1,dt*5);g.distance+=dt*g.speed/35;
  for(const ob of g.obstacles){const z=ob.z-g.distance;if(z<.045&&z>-.02&&!g.hits.includes(ob.id)&&Math.abs(g.x-ob.x)<.13){g.hits.push(ob.id);g.damage+=g.speed>.5?16:7;s.condition=Math.max(0,s.condition-(g.speed>.5?12:5));if(s.cargo)s.cargo.condition-=g.speed>.5?9:3;g.notice='A hard scrape. Ease off and choose your line.';}}
  if(s.condition<=0){finish(s,'stranded','So close you could see the lights.','The van could go no farther. The crossing crew brought your family to safety, but you missed this intake.');return;}
  if(g.distance>=1){if(s.cargo&&s.cargo.condition<45&&!s.sponsor){finish(s,'outside','The delivery did not make it.','Your family reached the far bank safely. The ruined filters could not fulfill the delivery agreement. You have a place in the outer camp.');return;}s.mode='home';s.activity=null;spend(s,1);s.message='“Mercer household? Welcome home.”';log(s,'Across the Line','Evelyn recorded your household. A deed, a key, and a door that is yours.');}
 }
}
export function summary(s){return {version:s.version,mode:s.mode,node:s.node,hours:s.hour,remaining:Math.max(0,s.deadline-s.hour),fuel:Math.round(s.fuel*10)/10,meals:Math.round(s.meals*10)/10,energy:Math.round(s.energy),health:Math.round(s.health),condition:Math.round(s.condition),fan:s.fan,cash:s.cash,parts:s.parts,slots:slots(s),packed:s.packed,sponsor:s.sponsor,cargo:s.cargo,home:s.home,ending:s.ending,activity:s.activity,road:s.road,incident:s.incident,site:s.mode==='salvage'?s.sites[s.node]:undefined,message:s.message};}
