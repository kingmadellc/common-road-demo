import {clamp,log,spend} from './state.js?v=0.8.5-safety-1';
import {showStory} from './journey.js?v=0.8.5-safety-1';

export const HUNT_SITE='river';
export const HUNT_SECONDS=75;
export const HUNT_ANIMALS={deer:{name:'Mule deer',portions:16,rx:.070,ry:.045},hare:{name:'Jackrabbit',portions:4,rx:.045,ry:.032}};
export function migrateHunting(s){
 s.hunting??={outfitted:false,ammo:0,taken:[],shots:0,outings:0,shared:false};
 s.stats.hunts??=0;
 if(s.mode==='hunting'&&s.activity){s.activity.aiming=false;s.activity.steady=0;}
 return s;
}
export function freshCapacity(s){return Math.max(0,(s.packed.includes('cooler')?3:1.5)-s.freshFood.reduce((n,f)=>n+f.meals,0));}
export function startHunting(s){
 if(s.node!==HUNT_SITE||s.mode!=='stop')throw Error('June’s clearing is outside Truckee.');
 if(s.energy<8)throw Error('Rest before going into the woods.');
 migrateHunting(s);
 if(s.hunting.outfitted&&(!s.hunting.ammo||s.hunting.taken.length>=2))throw Error('The clearing is spent. Try the river or trade for food.');
 s.mode='hunting';s.message='';
 s.activity={type:'hunting',phase:s.hunting.outfitted?'field':'brief',elapsed:0,left:HUNT_SECONDS,aim:{x:.5,y:.54},aiming:false,steady:0,shots:0,flash:0,scared:0,patrol:!!s.threat.identified||s.threat.heat>1,warning:0,animals:[],pending:0,harvested:0,cooked:false,kept:0,preserved:0,shared:0,notice:s.hunting.outfitted?'Take only what you can use.':'Food’s shelves are full. Your Cash account is locked. June’s camp takes work instead.'};
 if(s.activity.phase==='field')s.hunting.outings++;
 placeAnimals(s);
}
export function animalSize(an,aspect=1.5){
 // One scene scale keeps the species in proportion as the viewport changes.
 // The nearer jackrabbit is still only a third of the doe's full silhouette.
 const deerWidth=Math.min(.24,.34/aspect),width=deerWidth*(an.id==='deer'?1:.33);
 return {width,height:width*aspect,rx:width*.28,ry:width*aspect*.14};
}
export function placeAnimals(s){
 const g=s.activity,t=g.elapsed,offset=(s.seed%13)*.11;
 g.animals=Object.entries(HUNT_ANIMALS).filter(([id])=>!s.hunting.taken.includes(id)).map(([id,p])=>{
  const period=id==='deer'?18:10,wait=id==='deer'?11:5.7,cycle=(t+offset)%(period*2),local=cycle%period,forward=cycle<period,moving=local>wait;
  const walk=clamp((local-wait)/(period-wait),0,1),ease=walk*walk*(3-2*walk),start=id==='deer'?.36:.76,end=id==='deer'?.67:.22;
  const x=forward?start+(end-start)*ease:end+(start-end)*ease,y=id==='deer'?.51:.66;
  const size=animalSize({id},g.aspect||1.5);
  return {id,...p,...size,x,y:y-(moving&&id==='hare'?Math.abs(Math.sin(g.elapsed*11))*size.height*.10:0),moving,visible:g.scared<=0,facing:(forward?end-start:start-end)<0?-1:1};
 });
}
export function huntSight(g){const sway=(1-clamp(g.steady/1.2,0,1))*.012;return {x:g.aim.x+Math.sin(g.elapsed*4.4)*sway,y:g.aim.y+Math.cos(g.elapsed*3.1)*sway*.6};}
function done(s,notice){const g=s.activity;g.phase='done';g.aiming=false;g.steady=0;g.notice=notice;}
function settlePortions(s){const g=s.activity;if(g.pending<=0){g.pending=0;done(s,'Nothing wasted. Time to get back to the family.');}}
function leave(s){const g=s.activity;if(g.pending>0)throw Error('Choose what to do with the remaining food first.');s.energy=clamp(s.energy-4);log(s,'Back from the clearing',g.harvested?`${g.harvested} portions recovered. ${g.kept} packed fresh, ${g.preserved} preserved, ${g.cooked?4:0} cooked and ${g.shared} shared.`:'No food this time. You kept everyone out of trouble.');s.activity=null;s.mode='stop';if(g.cooked&&!s.flags.huntDinner){s.flags.huntDinner=true;showStory(s,'hunt-dinner');}}
export function huntingAction(s,a){
 if(!a.type.startsWith('hunt'))return false;
 if(s.mode!=='hunting')throw Error('You are not at the clearing.');
 const g=s.activity,h=s.hunting;
 if(a.type==='huntOutfit'){
  if(g.phase!=='brief'||h.outfitted)throw Error('June has already lent you the rifle.');
  spend(s,1);if(s.mode==='ending')return true;
  h.outfitted=true;h.ammo=3;h.outings++;s.energy=clamp(s.energy-5);g.phase='field';
  g.notice='Three rounds. Drag the lower pad to aim. Hold still, then release.';
  log(s,'Work for supper','Jack repairs June’s stove. She lends him an old rifle, three rounds and a lesson in the clearing. Sarah stays at camp with the children. The Food checkout wanted a Cash account. June wanted a stove that worked.');
 }else if(a.type==='huntViewport'){
  if(Number.isFinite(a.aspect)&&a.aspect>0){g.aspect=clamp(a.aspect,.4,5);placeAnimals(s);}
 }else if(a.type==='huntAim'){
  if(g.phase!=='field')return true;
  if(Number.isFinite(a.x)&&Number.isFinite(a.y)){const x=clamp(a.x,.06,.94),y=clamp(a.y,.30,.73),distance=Math.hypot(x-g.aim.x,y-g.aim.y);g.steady=Math.max(0,g.steady-distance*4);g.aim={x,y};}
  if(a.value!==undefined){g.aiming=!!a.value;if(!g.aiming)g.steady=0;}
 }else if(a.type==='huntFire'){
  if(g.phase!=='field'||!g.aiming)return true;
  const steady=g.steady;g.aiming=false;g.steady=0;
  if(steady<.30){g.notice='A quick tap lowers the rifle. Hold a moment before releasing.';return true;}
  if(!h.ammo)return true;
  const sight=huntSight({...g,steady});h.ammo--;h.shots++;g.shots++;g.flash=.18;
  const target=g.animals.find(an=>an.visible&&((sight.x-an.x)/an.rx)**2+((sight.y-an.y)/an.ry)**2<=1);
  if(target){h.taken.push(target.id);s.stats.hunts++;g.pending=target.portions;g.harvested=target.portions;g.animal=target.id;g.phase='harvest';g.animals=[];g.notice=`${target.portions} portions. Four feed the household. Decide what comes back.`;spend(s,.5);if(s.mode!=='ending')log(s,'Food beyond the checkout',`${target.name.toLowerCase()} recovered in June’s clearing. Half an hour to dress and carry it out. No payment reader; still real work.`);}
  else {g.scared=5;g.notice=h.ammo?'Missed. The clearing goes quiet. Wait for movement.':'Last round gone. The river is still an option.';if(!h.ammo)done(s,g.notice);}
  if(g.patrol&&g.phase==='field'&&g.shots>=2&&!g.warning){g.warning=16;g.notice='The patrol on the highway heard that. An engine slows. Leave before it turns in.';}
 }else if(a.type==='huntFood'){
  if(g.phase!=='harvest'||g.pending<=0)throw Error('There is no food left to divide.');
  if(a.id==='cook'){
   if(g.cooked||g.pending<4)throw Error('There is only time for one family dinner.');
   g.pending-=4;g.cooked=true;spend(s,.5);if(s.mode==='ending')return true;s.energy=clamp(s.energy+15);s.health=clamp(s.health+12);g.notice='One hot meal. Rusty licks every bowl twice.';
  }else if(a.id==='pack'){
   const portions=Math.min(g.pending,Math.floor((freshCapacity(s)+1e-8)*4));if(!portions)throw Error('No fresh storage left. Preserve or share the rest.');
   g.pending-=portions;g.kept+=portions;s.meals+=portions/4;s.freshFood.push({meals:portions/4,expires:s.hour+(s.packed.includes('cooler')?24:6),source:'hunt'});g.notice=`${portions} portions packed. Use within ${s.packed.includes('cooler')?24:6} hours.`;
  }else if(a.id==='preserve'){
   const portions=g.pending;spend(s,2);if(s.mode==='ending')return true;g.pending=0;g.preserved+=portions;s.meals+=portions/4;g.notice='June’s smoker turns the rest into trail rations. Two hours gone; no ice needed.';
  }else if(a.id==='share'){
   const portions=g.pending;g.pending=0;g.shared+=portions;
   if(portions>=4&&!h.shared){h.shared=true;s.flags.safeContact=true;g.notice='June packs supper for the road crew. Her cousin in Ava will guide you past the patrol road without charging.';log(s,'June puts in a word','You shared at least a household meal. June adds her cousin’s covered approach to the paper route. At Ava, the guide will help for free and save an hour. This is help on the road, not permission to enter Signals End.');}
   else g.notice='June divides the extra food among the travelers. There is nothing to throw away.';
  }else throw Error('Choose cook, pack, preserve or share.');
  settlePortions(s);
 }else if(a.type==='huntLeave')leave(s);
 else throw Error('Unknown hunting action.');
 return true;
}
export function updateHunting(s,dt){
 const g=s.activity;if(g.phase!=='field')return;
 const step=Math.min(dt,g.left);spend(s,step*.02);if(s.mode!=='hunting')return;
 g.elapsed+=step;g.left=Math.max(0,g.left-step);g.flash=Math.max(0,g.flash-dt);g.scared=Math.max(0,g.scared-dt);
 if(g.aiming)g.steady=Math.min(1.2,g.steady+step);else g.steady=0;
 if(g.warning>0){g.warning=Math.max(0,g.warning-step);if(!g.warning){s.threat.heat=Math.min(5,s.threat.heat+1);s.fuel=Math.max(0,s.fuel-2);spend(s,1);if(s.mode!=='hunting')return;done(s,'June flags you down before the patrol turns in. A long way back costs 1 hour and 2 fuel.');return;}}
 placeAnimals(s);
 if(!g.left)done(s,'The light is going. Head back while the path is clear.');
}
