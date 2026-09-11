import {PARTS,random} from './world.js?v=0.4.0';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const YARD={cover:{x:.71,y:.34,w:.28,h:.39},rear:{x:.80,y:.255},front:{x:.12,y:.83},hide:{x:.76,y:.29}};
export const DEPOT={cover:{x:.61,y:.27,w:.38,h:.43},rear:{x:.86,y:.22},front:{x:.12,y:.83},hide:{x:.70,y:.22}};
export const layoutFor=id=>id==='yard'?YARD:DEPOT;
export const SITE_NAMES={yard:'Bea’s service yard',river:'The shuttered fuel stop',pump:'Flooded maintenance shed',freight:'Roadside freight depot',ridge:'The abandoned county workshop'};
export function itemsFor(s){
 const r=random(s.seed+s.node.length*39),yard=s.node==='yard';
 const items=[
  {id:'a',type:yard?'fan':'relay',name:yard?'Engine cooling fan':'Pump control relay',object:yard?'Irrigation engine':'Control cabinet',x:.255,y:.397,stand:{x:.28,y:.56},quality:88,taken:false,progress:0,inspected:false,hazard:yard?'bracket':'alarm',safe:false},
  {id:'e',type:'relay',name:'Power relay',object:'Locked electrical cabinet',x:.527,y:.328,stand:{x:.535,y:.435},quality:80+Math.floor(r()*14),taken:false,progress:0,inspected:false,hazard:'alarm',safe:false},
  {id:'b',type:'tire',name:'Spare tire',object:'Tire stack',x:.44,y:.375,stand:{x:.435,y:.48},quality:78,taken:false,progress:0,inspected:false,hazard:'shelf',safe:false},
  {id:'d',type:'fuel',name:'Sealed fuel can',object:'Fuel store',x:.468,y:.384,stand:{x:.49,y:.46},quality:100,taken:false,progress:0,inspected:false,hazard:null,safe:true}
 ];
 if(!yard){Object.assign(items[0],{x:.29,y:.41,stand:{x:.30,y:.53}});Object.assign(items[1],{x:.54,y:.32,stand:{x:.54,y:.42}});Object.assign(items[2],{x:.49,y:.49,stand:{x:.46,y:.60}});Object.assign(items[3],{object:'Reserve fuel pump',x:.105,y:.27,stand:{x:.14,y:.36}});}
 return items;
}
export function startSalvage(s){
 s.sites[s.node]??=itemsFor(s);s.siteMemory??={};
 const memory=s.siteMemory[s.node]||{};
 s.activity={type:'salvage',elapsed:0,phase:'explore',selected:null,working:null,collected:[],player:{x:.14,y:.8,target:null,hiding:false},noise:0,noiseAt:null,patrol:structuredClone(memory.patrol||{state:'absent',elapsed:0,x:.06,y:.87,target:null,seen:0,searchTime:0}),notice:s.node==='yard'?'Bea: “Fan’s in the irrigation engine. Rear gate is open. Watch the road.”':'Inspect the machinery. Power cables and loose shelves can still hurt you.'};
 s.mode='salvage';
}
export function saveSite(s){if(s.activity?.type==='salvage')s.siteMemory[s.node]={patrol:structuredClone(s.activity.patrol)};}
function noise(s,amount,x,y){const g=s.activity;if(amount>.6&&s.node!=='yard'&&g.patrol.state==='absent')schedulePatrol(s);g.noise=clamp(g.noise+amount);g.noiseAt={x,y,age:0};const p=g.patrol;if(['watch','search'].includes(p.state)){p.state='search';p.target={x,y};p.searchTime=0;g.notice='They heard that. The officer is checking the sound.';}}
export function schedulePatrol(s){
 const g=s.activity;if(g.patrol.state!=='absent'||s.threat.relief>0)return;
 if(s.threat.firstEncounter&&s.node==='yard')return;
 if(s.threat.firstEncounter&&s.threat.encounters>=2)return;
 g.patrol={state:'warning',elapsed:0,x:.05,y:.86,target:null,seen:0,searchTime:0};s.threat.firstEncounter=true;s.threat.encounters++;g.notice=s.node==='yard'?'Bea: “Continuum’s Collectors. They take debtors back to city work contracts. Rear gate. Now.”':'The alarm brings a recovery truck. The service lane is still open.';s.stats.encounters++;if(!s.reel.gallery.includes('collectors'))s.reel.gallery.push('collectors');
}
function segmentIntersects(a,b,r){for(let i=1;i<=24;i++){const t=i/24,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h)return true;}return false;}
export function canSee(p,player,cover=YARD.cover){
 const dx=player.x-p.x,dy=player.y-p.y,angle=Math.atan2(dy,dx),facing=p.heading??-.5;
 return Math.hypot(dx,dy)<.38&&Math.cos(angle-facing)>.55&&!segmentIntersects(p,player,cover);
}
function walkTo(player,goal,r=YARD.cover){
 const m=.035,points=[{x:player.x,y:player.y},goal,{x:r.x-m,y:r.y-m},{x:r.x+r.w+m,y:r.y-m},{x:r.x-m,y:r.y+r.h+m},{x:r.x+r.w+m,y:r.y+r.h+m}];
 const dist=points.map(()=>Infinity),prev=[],done=new Set();dist[0]=0;
 for(let n=0;n<points.length;n++){let u=-1;for(let i=0;i<points.length;i++)if(!done.has(i)&&(u<0||dist[i]<dist[u]))u=i;if(u===1||u<0)break;done.add(u);for(let v=0;v<points.length;v++){if(v===u||done.has(v)||segmentIntersects(points[u],points[v],r))continue;const d=dist[u]+Math.hypot(points[u].x-points[v].x,points[u].y-points[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u;}}}
 let path=[],u=1;while(u!==0&&u!==undefined){path.unshift(points[u]);u=prev[u];}if(u!==0)path=[goal];player.target=path.shift();player.waypoints=path;
}

function move(player,dt,speed){if(!player.target)return true;const dx=player.target.x-player.x,dy=player.target.y-player.y,d=Math.hypot(dx,dy);if(d<speed*dt){player.x=player.target.x;player.y=player.target.y;player.target=null;return true;}player.heading=Math.atan2(dy,dx);player.x+=dx/d*speed*dt;player.y+=dy/d*speed*dt;return false;}
function countParts(s){return Object.values(s.parts).reduce((n,a)=>n+a.length,0)+(s.cargo?3:0);}
function extract(s,item,method){
 const g=s.activity;
 if(PARTS[item.type]&&countParts(s)>=7){g.notice='Locker full. Fit or trade a spare first.';g.working=null;g.phase='explore';return;}
 let damage=0;
 if(method==='force'&&!item.safe){damage=item.hazard==='bracket'?24:12;s.health=Math.max(1,s.health-3);g.notice=item.hazard==='alarm'?'The live alarm sounds. They know which shed.':'The rusted bracket gives way. The part is scraped, but usable.';noise(s,.8,item.x,item.y);}
 else g.notice=`${item.name} secured. Leave with it, or try for something more?`;
 if(PARTS[item.type])s.parts[item.type].push(Math.max(35,item.quality-damage));else if(item.type==='fuel')s.fuel=Math.min(50,s.fuel+8);
 item.taken=true;item.progress=1;g.collected.push(item.name);s.stats.salvaged++;g.working=null;g.phase='explore';
 if(s.node==='yard'&&item.type==='fan'){s.flags.recoveredFan=true;schedulePatrol(s);}
 if(!s.threat.firstEncounter&&g.elapsed>28)schedulePatrol(s);
}
export function salvageAction(s,a){
 if(!['inspect','salvageMove','extract','makeSafe','hide','exitSite','cancelWork','collectorChoice'].includes(a.type))return false;
 if(s.mode!=='salvage')throw Error('Enter a site first.');
 const g=s.activity;
 if(a.type==='collectorChoice'){
  if(g.phase!=='intercept')throw Error('No officer is stopping you.');
  if(a.id==='permit'){s.hour+=1.5;s.threat.identified=true;s.threat.heat=Math.max(1,s.threat.heat);g.notice=s.node==='yard'?'Bea backs the yard permit. They release you after recording the plate.':'The county work permit checks out. They release you after recording the plate.';}
  else if(a.id==='escape'){s.condition=Math.max(12,s.condition-8);s.threat.identified=true;s.threat.heat=Math.max(1,s.threat.heat);g.notice='Sarah takes the rear lane. The van scrapes the gate, but everyone is aboard.';}
  else throw Error('Choose a way out.');
  g.patrol.state='gone';g.phase='exit';g.exit='rear';s.threat.relief=90;saveSite(s);return true;
 }
 if(g.phase==='intercept')throw Error('Deal with the officer first.');
 if(a.type==='inspect'){
  const item=s.sites[s.node].find(x=>x.id===a.id&&!x.taken);if(!item)throw Error('That machine is picked over.');
  g.selected=item.id;g.player.hiding=false;g.working=null;g.phase='explore';walkTo(g.player,item.stand||{x:item.x,y:item.y+.065},layoutFor(s.node).cover);
  item.inspected=true;
  g.notice=item.hazard==='bracket'?'A seized bracket. Free it with the wrench, or force it and risk the blades.':item.hazard==='alarm'?'A powered alarm cable runs into the cabinet. Disconnect it before removing the relay.':item.hazard==='shelf'?'The rack leans when touched. Brace it before lifting the tire.':'A sealed can. Check the cap, then bring it out.';
 }else if(a.type==='salvageMove'){g.player.hiding=false;g.working=null;g.phase='explore';walkTo(g.player,{x:clamp(a.x,.09,.91),y:clamp(a.y,.20,.85)},layoutFor(s.node).cover);}
 else if(a.type==='cancelWork'){g.working=null;g.phase='explore';g.notice='Tools down. The unfinished work stays here.';}
 else if(a.type==='hide'){g.working=null;g.phase='explore';walkTo(g.player,{...layoutFor(s.node).hide,hide:true},layoutFor(s.node).cover);g.player.hiding=false;g.notice=`Go behind the ${s.node==='yard'?'bus':'truck'}. Stay still until the search moves on.`;}
 else if(a.type==='makeSafe'||a.type==='extract'){
  const item=s.sites[s.node].find(x=>x.id===g.selected&&!x.taken);if(!item)throw Error('Choose a machine first.');
  if(g.player.target)throw Error('Reach the machine first.');
  if(a.type==='makeSafe'&&item.safe)throw Error('Already made safe.');
  g.player.hiding=false;g.phase='working';g.working={type:a.type,method:a.method||'quiet',elapsed:a.type==='extract'?item.progress*(a.method==='force'?3:9):0,duration:a.type==='makeSafe'?4:a.method==='force'?3:9,id:item.id};
  if(a.method==='force')noise(s,.65,item.x,item.y);
  g.notice=a.type==='makeSafe'?(item.hazard==='alarm'?'Disconnecting the alarm power…':item.hazard==='shelf'?'Bracing the rack…':'Freeing the seized bracket…'):a.method==='force'?'Fast and loud. Keep an eye on the road.':'Steady hands. Watch the approach while you work.';
 }else if(a.type==='exitSite'){
  const route=a.id==='front'?'front':'rear';
  if(route==='front'&&['watch','search'].includes(g.patrol.state)){g.phase='intercept';g.working=null;g.notice='The tow truck blocks the front gate. “Household continuity check.”';return true;}
  g.working=null;g.player.hiding=false;walkTo(g.player,{...layoutFor(s.node)[route],exit:route},layoutFor(s.node).cover);g.phase='leaving';g.notice='Back to the family. Leave the extra parts.';
 }
 return true;
}
export function updateSalvage(s,dt){
 const g=s.activity;if(g.phase==='intercept'||g.phase==='exit')return;g.elapsed+=dt;
 const destination=g.player.target;if(destination&&move(g.player,dt,.23)){
  if(g.player.waypoints?.length){g.player.target=g.player.waypoints.shift();}
  if(destination.hide){g.player.hiding=true;g.notice='Out of sight. Listen for their engine.';}
  if(destination.exit){g.phase='exit';g.exit=destination.exit;if(g.patrol.state!=='absent'){s.threat.relief=90;g.patrol.state='gone';}saveSite(s);return;}
 }
 if(g.working){const work=g.working,item=s.sites[s.node].find(x=>x.id===work.id);work.elapsed+=dt;
  item.progress=work.type==='extract'?clamp(work.elapsed/work.duration):item.progress;
  if(work.elapsed>=work.duration){if(work.type==='makeSafe'){item.safe=true;g.working=null;g.phase='explore';g.notice='Made safe. Now recover the part quietly.';}else extract(s,item,work.method);}}
 g.noise=Math.max(0,g.noise-dt*.07);if(g.noiseAt)g.noiseAt.age+=dt;
 if(g.elapsed>36&&!s.threat.firstEncounter)schedulePatrol(s);
 if(s.node!=='yard'&&g.elapsed>28&&s.threat.firstEncounter&&s.threat.relief<=0&&s.threat.heat>0&&g.patrol.state==='absent')schedulePatrol(s);
 const p=g.patrol;p.elapsed+=dt;
 if(p.state==='warning'&&p.elapsed>=12){p.state='watch';p.elapsed=0;p.target={x:.23,y:.78};g.notice='Collectors at the front gate. The rear lane is still open.';}
 if(['watch','search'].includes(p.state)){
  if(p.target)move(p,dt,.07);
  if(p.state==='watch'&&p.elapsed>7){p.state='search';p.target={x:.48,y:.62};p.searchTime=0;g.notice=`The officer comes into the yard. Get behind the ${s.node==='yard'?'bus':'truck'}, or leave.`;}
  if(p.state==='search'){p.searchTime+=dt;if(!p.target&&p.searchTime>12){p.target={x:.22,y:.73};}}
  const visible=canSee(p,g.player,layoutFor(s.node).cover);p.seen=clamp(p.seen+(visible?dt*.45:-dt*.65));
  if(visible&&p.seen>.35)g.notice='He is looking this way. Break the line of sight.';
  if(p.seen>=1){s.threat.identified=true;s.threat.heat=Math.max(1,s.threat.heat);p.identity=true;g.phase='intercept';g.working=null;g.notice='“Mercer household. Your employer filed a return order.” Show the county work permit, or make a run for it.';}
  if(p.elapsed>34&&g.phase!=='intercept'){p.state='gone';s.threat.relief=90;g.notice='The truck leaves. The yard is quiet again.';}
 }
 saveSite(s);
}
