import {CORPORATIONS} from './institutions.js?v=0.7.6-origin-1';
import {BRAND} from './brand.js?v=0.7.6-origin-1';
import {INTRO_KEY,newPrologue,prologueState,readOpeningHistory,rememberOpening,shouldAutoOpen} from './prologue.js?v=0.7.6-origin-1';
import {OpeningPlayer} from './opening-player.js?v=0.7.6-origin-1';
import {VERSION,SAVE_KEY,FAMILY,NODES,ROADS,PACKING,PARTS,CAMPAIGN,objective,admission,node,roads} from './world.js?v=0.7.6-origin-1';
import {fresh,load,save,act,update,summary,slots,clamp} from './sim.js?v=0.7.6-origin-1';
import {render,ready,HAZARDS,HOME_POINTS,sources} from './art.js?v=0.7.6-origin-1';
import {castEndpoint} from './fishing.js?v=0.7.6-origin-1';
import {yardView} from './scenes.js?v=0.7.6-origin-1';
import {SITE_NAMES} from './salvage.js?v=0.7.6-origin-1';
import {collectorOptions,incidentOptions,threatLabel} from './conflict.js?v=0.7.6-origin-1';
import {hurt,shopStock,OFFERS} from './state.js?v=0.7.6-origin-1';
import {SHOTS} from './journey.js?v=0.7.6-origin-1';
import {enableAudio,soundFrame} from './sound.js?v=0.7.6-origin-1';
import {knowledge,ORIGIN,RADIO_MESSAGE} from './narrative.js?v=0.7.6-origin-1';
const $=id=>document.getElementById(id),canvas=$('scene');
let saved=null;try{saved=load(localStorage);}catch{}
let s=saved||fresh(Math.floor(Math.random()*100000)),manual=false,last=performance.now(),saveClock=0,panelKey='',statusKey='',resourceKey='';
const ui={grip:null,title:true,paused:false,dialog:null,hits:[],drag:null,wire:null,cast:null,padCursor:null,prologue:null};
let oldSave=null,openingPlayer=null;try{oldSave=localStorage.getItem('common-road-pilgrimage-v6');}catch{}
if(!saved&&matchMedia('(prefers-reduced-motion: reduce)').matches)s.settings.reducedMotion=true;
function openingSeen(){let seen=null;try{seen=readOpeningHistory(localStorage);}catch{}if(!seen)try{seen=readOpeningHistory(sessionStorage);}catch{}return seen;}
function recordOpening(status){try{rememberOpening(localStorage,status);}catch{}try{rememberOpening(sessionStorage,status);}catch{}}
function beginPrologue(replay=true){const returnTitle=ui.title;resetInput();if($('dialog').open)closeModal();ui.prologue={...newPrologue(replay),returnTitle};ui.paused=false;drawUI(true);}
function finishPrologue(status='skipped'){const p=ui.prologue;if(!p)return;recordOpening(status);openingPlayer?.destroy();openingPlayer=null;ui.prologue=null;ui.title=p.returnTitle;ui.paused=false;drawUI(true);requestAnimationFrame(()=>{const target=ui.title?$('start'):$('scene');target?.focus({preventScroll:true});});}
function prologueAction(type){openingPlayer?.action(type);}
function drawOpeningFilm(){if(!openingPlayer)openingPlayer=new OpeningPlayer($('opening'),ui.prologue,{onExit:finishPrologue,onSeen:()=>recordOpening('started'),reduced:s.settings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches});else openingPlayer.updateUI();}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(type,id,label,small='',cls='',extra='')=>`<button data-action="${type}" ${id!==undefined?`data-id="${id}"`:''} class="${cls}" ${extra}>${label}${small?`<small>${small}</small>`:''}</button>`;
const group=(title,content,wide=false)=>`<div class="actiongroup${wide?' wide':''}"><h2>${title}</h2>${content}</div>`;
const bars=(label,value,color='')=>`${label}<div class="meter ${color}"><i style="width:${clamp(value,0,1)*100}%"></i></div>`;
const count=n=>Math.max(0,Math.round(n*10)/10);
function persist(){if(ui.prologue||ui.title&&!saved)return;try{save(localStorage,s);saved=structuredClone(s);$('save-status').textContent='Saved on this device';}catch{$('save-status').textContent='Saving unavailable · keep this tab open';}}
function resetInput(){ui.drag=null;ui.wire=null;ui.cast=null;ui.grip=null;pointer=null;if(s.activity){s.activity.reel=false;s.activity.carry=null;if(s.mode==='crossing')s.activity.speed=.65;}document.querySelectorAll('.held').forEach(x=>x.classList.remove('held'));}
function dispatch(action){try{const beforeMode=s.mode;const next=structuredClone(s);act(next,action);s=next;if(!['reel','tune','steer','slow','fishAim'].includes(action.type))persist();drawUI();if(beforeMode!==s.mode&&!ui.paused)$('stage').scrollIntoView({block:'start',behavior:'instant'});}catch(e){s.message=e.message;$('notice').textContent=e.message;}}
function startNew(){finishNew();}
function finishNew(){const settings={...s.settings};resetInput();s=fresh(Math.floor(Math.random()*100000));s.settings=settings;ui.title=false;ui.dialog=null;ui.paused=false;if($('dialog').open)$('dialog').close();persist();drawUI(true);}
function resume(){s=structuredClone(saved||s);resetInput();ui.title=false;drawUI(true);}
function packCount(){return s.packed.reduce((v,id)=>v+PACKING.find(p=>p.id===id).slots,0);}
function portrait(id,cls=''){const i=FAMILY.findIndex(p=>p.id===id);return `<span class="portrait ${cls}"><img src="assets/candid-04/crew.webp" style="left:-${i*100}%" alt="${FAMILY[i]?.name||''}" loading="eager"></span>`;}
function drawFamily(){ $('family').innerHTML=FAMILY.map(p=>`<button class="person" data-action="person" data-id="${p.id}" aria-label="${p.full}, ${p.role}">${portrait(p.id)}<span><strong>${p.name}</strong><small>${p.id==='rusty'?'Good company':'Mercer'}</small></span></button>`).join('');}
function panel(){
 const g=s.activity,n=node(s.node);
 if(s.mode==='packing')return group(`Six spaces. What comes with you? <span class="pill">${packCount()} / 6</span>`,`<p>Tools, a fishing rod, blankets and Ben’s written broadcast are aboard. Choose the rest.</p><div class="packing">${PACKING.map(i=>button('pack',i.id,`${i.icon} ${i.name} · ${i.slots}`,i.text,s.packed.includes(i.id)?'selected':'',`aria-pressed="${s.packed.includes(i.id)}"`)).join('')}</div>`,true)+group('Bea first.',`<p>Jack wants to go. Sarah wants answers. After three nights of arguing, they agree to ask Bea across the Bay. Pack for the longer trip if her lead holds up.</p>`,false)+group('Keep one another going',`<div class="buttons">${button('depart',undefined,'Go ask Bea','Cross the Bay. Ask your questions. Fix the fan.','primary')}</div>`);
 if(s.mode==='stop'){
  let main;
  if(n.id==='yard')main=!s.fan?button(s.siteMemory.yard?.sealed&&!s.parts.fan.length?'shop':'activity',s.parts.fan.length?'repair':'salvage',s.parts.fan.length?'Fit the cooling fan':s.siteMemory.yard?.sealed?'Trade for a cooling fan':'Recover a cooling fan','Stop the extra fuel burn.','primary'):button('supplies',undefined,'Check the van','Running well. Pack for the road.');
  if(['desert','divide','plains'].includes(n.id))main=n.id==='plains'?button('chooseRoad',undefined,'Choose your way in','Repair work or a filter delivery.','primary'):button('supplies',undefined,n.id==='desert'?'Stock up for Wyoming':'Rest before the Plains','Fuel, food and the van.','primary');
  if(n.id==='river')main=button('activity','fishing','Fish for the family',`${count(s.meals*8)} hours of food remain.`,'primary');
  if(n.id==='pump')main=s.sponsor?button('activity','fishing','Catch something for the climb'):button(s.siteMemory.pump?.sealed&&!s.parts.relay.length?'shop':'activity',s.parts.relay.length?'repair':'salvage',s.parts.relay.length?'Restore the pump':s.siteMemory.pump?.sealed?'Trade for a pump relay':'Recover a pump relay',s.parts.relay.length?'Glenn will sponsor your household.':'The maintenance shed has a working relay.','primary',s.parts.relay.length?'data-target="pump"':'');
  if(n.id==='freight')main=s.cargo?button('activity','salvage','Recover road supplies','The filters are secured.'):button('delivery',undefined,'Carry the filters','1.5 hours · 3 spaces · a way into Signals End','primary');
  if(n.id==='ridge')main=button('prepare',undefined,'Prepare for the crossing',s.threat.heat?'A local guide can lose the pursuit.':'Check the van and your way in.','primary');
  if(n.id==='line')return group('The warm lights are real',`<p>${n.desc}</p><div class="buttons">${button('reviewCharter',undefined,'Review entry & cross',s.sponsor?'Glenn has signed for you.':s.cargo?`Filters ${Math.round(s.cargo.condition)}% · need 45%.`:'You still need a sponsor or usable delivery.','primary')}${button('gateHelp',undefined,'Other ways forward','Return for evidence, or stay outside.')}</div>`,true);
  return group(n.name,`<p>${n.desc}</p><div class="buttons stop-actions">${main}${!['desert','divide'].includes(n.id)?button('supplies',undefined,'Supplies & family',`$${s.cash} · ${slots(s)} / 7 locker spaces`):''}${n.id!=='plains'?button('chooseRoad',undefined,roads(s.node).length===1?'Next: '+node(roads(s.node)[0].to).short+' →':'Plan the next drive →',objective(s),'primary'):''}</div>`,true);
 }
 if(s.mode==='salvage'){
  const item=s.sites[s.node].find(i=>i.id===g.selected&&!i.taken);
  if(g.phase==='intercept')return group('“Your return order is active.”',`<p>${g.notice}</p><div class="buttons">${collectorOptions(s).map(o=>button('collectorChoice',o.id,o.label,o.detail,'',o.disabled?'disabled':'')).join('')}</div>`,true);
  const selection=`<div class="target-strip">${s.sites[s.node].filter(i=>!i.taken).map(i=>button('inspect',i.id,i.name,'',i.id===g.selected?'selected':'',g.working?'disabled':'')).join('')}</div>`;
  const work=g.working?button('cancelWork',undefined,'Tools down','Progress stays in place.'):item?button('extract','quiet','Work quietly',`${hurt(s)?14:11} seconds · protects your hands`,'primary')+button('extract','force','Force it loose',`${hurt(s)?7:4} seconds · ${item.hazard?'injury and alarm':'loud'}`):'';
  return group(item?.object||'Back to the van',`${selection}<p class="activity-copy">${g.notice}</p><div class="buttons">${work}${button('hide',undefined,g.player.hiding?'Stay hidden':'Take cover','The yard will be sealed.')}${button('exitSite','rear','Leave with it →',g.collected.length+' items recovered.')}</div>`,true);
 }
 if(s.mode==='repair'){
  let controls='';
  if(g.phase==='diagnose')controls=['fan','relay','tire'].map(id=>button('test',id,`Inspect ${id}`,g.tested.includes(id)?'Checked.':'Trace the fault.')).join('');
  if(g.phase==='replace')controls=button('fit',g.fault,`Fit ${PARTS[g.fault].name}`,`${s.parts[g.fault].length} spare${s.parts[g.fault].length===1?'':'s'} aboard.`,'primary',s.parts[g.fault].length?'':'disabled');
  if(g.phase==='method')controls=button('repairMethod','steady','Work carefully',`${hurt(s)?2:1.5} hours · reliable repair`,'primary')+button('repairMethod','tune','Tune it by feel','30 minutes + your tuning time');
  if(g.phase==='steady')controls='<p>Sarah holds the light. Ben watches how it works.</p>';
  if(g.phase==='tune')controls=`<label for="tune">${g.fault==='tire'?'Lug wrench':'Regulator'} · keep the needle in the brass band</label><input id="tune" type="range" min="0" max="100" value="${g.tune*100}" aria-label="${g.fault==='tire'?'Lug wrench':'Engine regulator'}">`;
  if(g.phase==='done')controls=button('leaveActivity',undefined,g.target==='pump'?'Take the signed papers':'Close the hood','The repair is complete.','primary');
  return group(g.target==='pump'?'Glenn’s settlement needs water':'Keep the old van alive',`<p>${g.notice}</p><div class="buttons">${controls}</div>`,true)+(g.phase!=='done'?group('Leave the hood open?',`<div class="buttons">${button('leaveActivity',undefined,'Return to the stop','Your repair progress stays in place.')}</div>`):'');
 }
 if(s.mode==='fishing'){
  let actions='';
  if(g.phase==='aim')actions=button('fishCastMode',undefined,s.settings.castMode==='pull'?'Try tap casting':'Try pull casting','Choose the cast that feels right.')+button('leaveActivity',undefined,'Back to the van',`${g.catch} portions kept.`);
  else if(g.phase==='empty')actions=button('fishRetry',undefined,'Try another rise','','primary')+button('leaveActivity',undefined,'Head back');
  else if(g.phase==='landed')actions=button('fishKeep',undefined,`Keep ${g.catchResult.portions} portions`,'Dinner for the family.','primary')+button('fishRelease',undefined,'Let it swim','A good fight is enough.');
  else if(['fight','wait','cast','bite'].includes(g.phase))actions=button('fishCutConfirm',undefined,g.phase==='fight'?'Bring the line in':'Cancel this cast','You can leave the bank at any time.');
  return group(g.phase==='landed'?'Ben has it.':g.phase==='fight'?'Feel the line':'Dinner is out there',`<p class="activity-copy">${g.notice}</p><div class="buttons">${actions}</div>`,true);
 }
 if(s.mode==='story'){const shot=SHOTS[s.story.id];return group(shot.title,`<p>${shot.line}</p><div class="buttons">${button('storyContinue',undefined,'Back to the journey','','primary')}</div>`,true);}
 if(s.mode==='travel'){const shot=s.road.shot&&SHOTS[s.road.shot.id];return group(shot?shot.title:s.fan?'A steady engine':'Watch the temperature',`<p>${shot?shot.line:s.threat.identified?'The Collectors recorded your plate. Keep to the county roads.':'Sarah checks the paper map. Jack listens for a new noise. Nobody checks an app.'}</p><div class="buttons">${s.road.shot?button('skipShot',undefined,'Continue the drive'):''}${button('pause',undefined,'Pause')}</div>`,true);}
 if(s.mode==='incident')return group(s.incident.title,`<p>${s.incident.body}</p><div class="buttons">${incidentOptions(s).map(o=>button('incident',o.id,o.label,o.detail,'',o.disabled?'disabled':'')).join('')}</div>`,true);
 if(s.mode==='crossing')return group('Bring everyone across',`<p>Drag across the bridge to steer around the wreckage. Slow down when the gap is tight. The warm lights are real.</p><div class="buttons">${button('nudge','left','← Steer left')}${button('holdSlow',undefined,'Hold to slow','Release to accelerate.','hold')}${button('nudge','right','Steer right →')}</div>`,true);
 if(s.mode==='home')return group('Make yourselves at home',`<p>A switch. A wall. Time to listen. Touch the numbered places and leave the work until morning.</p><div class="buttons">${HOME_POINTS.map(p=>button('homeItem',p.id,`${s.home.placed.includes(p.id)?'✓ ':''}${p.label}`,'',s.home.placed.includes(p.id)?'selected':'')).join('')}</div>`,true)+group('A place for the chair',`<p>${s.packed.includes('chair')?'Grandad’s chair made it all this way.':'The previous owner left a good armchair.'} Where does it belong?</p><div class="buttons">${button('homeSpot','window','By the window','',s.home.spot==='window'?'selected':'')}${button('homeSpot','workshop','By the workbench','',s.home.spot==='workshop'?'selected':'')}</div>`)+group('The first evening',`<div class="buttons">${button('finishHome',undefined,'Sit with the family',`${s.home.placed.length} / 4 things in place`,'primary',s.home.placed.length<4?'disabled':'')}</div>`);
 if(s.mode==='ending')return group(s.ending.title,`<p>${s.ending.text}</p>${s.ending.owned?`<div class="deed"><div class="label">SIGNALS END CHARTER · RECORDED OWNERSHIP</div><h3>JACK & SARAH MERCER</h3><p>The lights work without a login. Jack can put down his tools without losing the house. Sarah can help a neighbor without checking their eligibility.<br>Phones, computers and digital devices stayed at the Line. No rent. No employer controls the door. Shared dues are public, voted on and capped.</p><p>${s.packed.includes('chair')?'Grandad’s chair':'Your armchair'} sits ${s.home.spot==='window'?'beside the window':'by the workbench'}. Ben wants to learn the water wheel. Annie has a drawing to show them. This time nobody says “after I check in.”</p></div>`:''}<p>${s.stats.salvaged} items recovered · ${s.stats.fish} fish landed · ${s.stats.repairs} repairs completed · ${count(s.hour)} hours</p><div class="buttons">${button('newConfirm',undefined,'Another pilgrimage','Try the other road.','primary')}${button('journal',undefined,'Read the journey')}</div>`,true);
 return '';
}
function inventoryHTML(){return Object.entries(s.parts).map(([id,list])=>`<span class="pill">${PARTS[id].name}: ${list.length}${list.length?' · '+list.map(q=>q+'%').join(', '):''}</span>`).join('')+(s.cargo?`<span class="pill">Filters: ${Math.round(s.cargo.condition)}% · 3 spaces</span>`:'');}
function drawUI(force=false){
 document.body.dataset.mode=ui.prologue?'prologue':ui.title?'title':s.mode;document.body.classList.toggle('cinematic',!!ui.prologue);document.body.classList.toggle('title',ui.title||!!ui.prologue);if(ui.prologue){$('opening').hidden=false;drawOpeningFilm(force);return;}document.body.classList.toggle('reduced',s.settings.reducedMotion);
 if($('grip')){const g=s.activity,show=!ui.title&&s.mode==='fishing'&&['aim','wait','bite','fight'].includes(g?.phase);$('grip').hidden=!show; if(show){$('grip').textContent=g.phase==='aim'?(s.settings.castMode==='pull'?'PULL BACK TO CAST':'TAP A RISE TO CAST'):g.phase==='bite'?'STRIKE':g.phase==='fight'?(g.reel?'REELING · SLIDE TO ANGLE':'HOLD TO REEL'):'WAIT FOR THE BITE';$('grip').classList.toggle('strike',g.phase==='bite');}}
 document.body.classList.toggle('title',ui.title);$('opening').hidden=!ui.title;
 if(ui.title){const key='title'+!!saved+!!oldSave;if(force||panelKey!==key){$('opening').innerHTML=`<h1 class="title-wordmark${BRAND.mark?'':' title-type-pending'}">${BRAND.mark?`<img src="${BRAND.mark}" alt="${BRAND.title}">`:`<span>SIGNALS</span><span>END</span>`}</h1><p class="title-tagline">${BRAND.tagline}</p><p class="title-deck">San Francisco → somewhere free.</p><div class="buttons">${saved?button('resume',undefined,'Continue the journey','','primary'):''}${button('new',undefined,saved?'Start fresh':'Make the run','',saved?'':'primary','id="start"')}</div><div class="title-extras">${button('replayIntro',undefined,'Replay opening') }<a href="brand/">Brand kit ↗</a></div><div class="legacy"><a href="v06/">Previous demo & saved journey</a></div>`;panelKey=key;}return;}
 const res=[['FUEL',count(s.fuel),'/ 50',s.fuel<12],['FOOD',count(s.meals*8),'hours',s.meals<1],['VAN',Math.round(s.condition),'%',s.condition<35],['FAMILY',hurt(s)?'Hurt':s.meals<.1?'Hungry':s.energy<25?'Weary':'Steady','',s.health<50||s.energy<25]];
 const rk=JSON.stringify(res);if(rk!==resourceKey){$('resources').innerHTML=res.map(([label,v,u,warn])=>`<div class="resource ${warn?'warn':''}"><span>${label}</span><strong>${v}</strong><small>${u}</small></div>`).join('');resourceKey=rk;}
 const g=s.activity;const key=JSON.stringify([s.mode,s.node,g?.phase,g?.selected,g?.connections,g?.notice,g?.catch,g?.working?.id,!!g?.player?.target,g?.player?.hiding,g?.patrol?.state,s.road?.shot?.id,s.story?.id,s.settings,s.packed,s.parts,s.cargo,s.sponsor,s.home,s.flags,s.cash,Math.floor(s.hour),s.threat.permitUsed,s.threat.heat,ui.wire?.index]);
 if(force||key!==panelKey){const active=document.activeElement;const token=active?.dataset?.action?[active.dataset.action,active.dataset.id]:null;const id=active?.id;$('actions').innerHTML=panel();panelKey=key;if(token){const el=[...$('actions').querySelectorAll('button')].find(x=>x.dataset.action===token[0]&&x.dataset.id===token[1]);el?.focus({preventScroll:true});}else if(id&&$(id)&&document.activeElement===document.body)$(id).focus({preventScroll:true});}
 const notice=s.mode==='ending'||s.mode==='stop'&&s.message===node(s.node).desc?'':s.message;if($('notice').textContent!==notice)$('notice').textContent=notice;
 const title=s.mode==='story'?SHOTS[s.story.id].title:s.mode==='packing'?'Everything we can carry':s.mode==='salvage'?SITE_NAMES[s.node]:s.mode==='repair'?(g.target==='pump'?'Bring the water back':'A machine worth saving'):s.mode==='fishing'?'Dinner is out there':s.mode==='crossing'?'The last crossing':s.mode==='home'?'An evening of our own':s.mode==='ending'?s.ending.title:s.mode==='travel'||s.mode==='incident'?s.road.name:node(s.node).name;
 const region=s.mode==='home'||s.ending?.owned?'SIGNALS END · THE FIRST EVENING':s.mode==='packing'?'THE MERCER HOUSEHOLD':node(s.node).region;
 const heading=`<div class="eyebrow">${region}${s.mode==='home'||s.mode==='ending'?'':' · DAY '+(Math.floor(s.hour/24)+1)}</div><h1>${title}</h1>`;if($('sceneheading').innerHTML!==heading)$('sceneheading').innerHTML=heading;
 let status='',hint='';
 if(s.mode==='salvage'){const p=g.patrol;status=p.state==='warning'?`COLLECTORS · ${Math.max(0,Math.ceil(12-p.elapsed))}s away`:p.state==='search'?'SEARCHING THE YARD':p.state==='watch'?'FRONT GATE BLOCKED':p.state==='gone'?'YARD SEALED':'WATCH THE ROAD';if(g.working)status+=bars(g.working.type==='makeSafe'?'Making safe':'Recovering',g.working.elapsed/g.working.duration);hint=g.player.hiding?'IN COVER · OUT OF SIGHT':g.phase==='intercept'?'THE REAR LANE IS STILL AN OPTION':'';}
 if(s.mode==='repair'){status=`${g.phase==='replace'?'FIT THE PART':g.phase==='method'?'CHOOSE YOUR PACE':g.phase==='steady'?'WORKING':g.phase==='done'?'RUNNING AGAIN':'TUNE BY FEEL'}`;hint=g.phase==='connect'?'MATCH I → I, II → II, III → III':g.phase==='tune'?'KEEP THE NEEDLE INSIDE THE BRASS BAND':'';}
 if(s.mode==='fishing'){status=g.phase==='fight'?bars(g.tension>.83?'STRAIN · EASE OFF':g.slack>.8?'SLACK · REEL':'LINE STRAIN',g.tension,g.tension>.83?'red':'')+bars('TO THE BANK',g.progress):g.phase==='bite'?'FLOAT UNDER · STRIKE':g.phase==='landed'?`${g.catchResult.portions} FRESH PORTIONS`:`${g.catch} portions kept`;hint=g.phase==='fight'?(g.behavior==='run'?'LET IT RUN':g.slack>.8?'TAKE UP THE SLACK':'REEL WHILE IT RECOVERS'):g.phase==='aim'?(s.settings.castMode==='pull'?'DRAG BACK FROM THE GRIP · PREVIEW THE LANDING':'TAP THE WATER · AIM NEAR A RISE'):'';}
 if(s.mode==='travel'){status=bars(`${Math.round(s.road.mph||0)} MPH · ${threatLabel(s)}`,s.road.elapsed/s.road.duration);hint=s.road.id==='opening'?'LEAVING SAN FRANCISCO':`${s.road.miles} miles · ${s.road.hours} hours · ${s.road.fuel} fuel`;}
 if(s.mode==='crossing'){status=bars('THE FAR BANK',g.distance)+`${g.speed<.5?'SLOW':'CRUISING'} · ${g.hits.length} scrapes`;hint='DRAG TO STEER · AVOID THE BROKEN TIMBERS';}
 if(s.mode==='home'){status=`${s.home.placed.length} / 4 · MAKING IT OURS`;hint=s.home.placed.length===4?'THE FAMILY IS WAITING AT THE TABLE':'TOUCH A NUMBER TO SETTLE IN';}
 const sk=status+hint;if(sk!==statusKey){$('scenestatus').innerHTML=status;$('scenehint').textContent=hint;statusKey=sk;}
}
function modal(kind,content){resetInput();ui.paused=true;ui.dialog=kind;$('dialogbody').innerHTML=`<div class="modal-tools">${button('close',undefined,'← Back')}</div>`+content+`<div class="buttons">${button('close',undefined,'Back to the journey','','primary')}</div>`;if(!$('dialog').open)$('dialog').showModal();$('dialog').scrollTop=0;$('dialog').querySelector('button')?.focus({preventScroll:true});persist();}
function closeModal(){if($('dialog').open)$('dialog').close();ui.paused=false;ui.dialog=null;drawUI(true);}
function openPause(){modal('pause',`<div class="label">THE ROAD CAN WAIT</div><h2>Take a breath.</h2><p>Your journey is saved on this device. Time stops while this panel is open.</p><div class="buttons">${button('title',undefined,'Opening screen')}${button('replayIntro',undefined,'Replay opening')}${button('world',undefined,'What is Signals End?')}${button('help',undefined,'Controls')}${button('sound',undefined,s.settings.sound?'Mute sound':'Enable sound')}${button('settings',undefined,'Touch & accessibility')}${button('fullscreen',undefined,'Full screen')}</div>${s.mode==='stop'?`<div class="buttons">${button('aid',undefined,'Ask for emergency help','Once per journey · 4 hours, if supplies are low.')}${button('rescueConfirm',undefined,'Call relief transport','Ends this attempt safely.','danger')}</div>`:''}`);}
function showMap(){
 const current=node(s.node),complete=s.mode==='home'||s.ending?.owned;
 const chapters=[['The city','San Francisco Bay',['yard']],['The Sierra','Truckee, California',['river']],['The dry country','Wells, Nevada',['desert']],['The high country','Rawlins, Wyoming · via Utah',['divide']],['The paper network','North Platte, Nebraska',['plains']],['A way in','Kansas · Topeka or Salina',['pump','freight']],['A real key','Ava, Missouri',['ridge']],['Signals End','The Missouri–Arkansas Ozarks',['line']]];
 const chosen=ROADS.filter(r=>node(r.from)&&node(r.to)&&r.id!=='recovery');
 const map=`<svg class="journey-map" viewBox="0 0 680 235" role="img" aria-label="Eastbound trail: San Francisco, Sierra, Nevada, Utah, Wyoming, Nebraska, Kansas, Missouri, Signals End. A schematic, not a navigation map."><path d="M15 170 Q90 35 165 60 T340 40 T500 65 L640 190 L610 226 L410 203 L230 182 Z" fill="#9caa7710"/>${chosen.map(r=>{const a=node(r.from),b=node(r.to),done=s.visited.includes(r.to)&&s.visited.includes(r.from);return `<path d="M${a.x*650} ${a.y*190} L${b.x*650} ${b.y*190}" stroke="${done?'#9caa77':'#657575'}" stroke-width="${done?4:2}" fill="none" ${done?'':'stroke-dasharray="5 6"'}/>`}).join('')}${NODES.map(n=>`<circle cx="${n.x*650}" cy="${n.y*190}" r="${n.id===s.node?12:5}" fill="${n.id===s.node?'#d0b479':s.visited.includes(n.id)?'#9caa77':'#526469'}"/>${n.id===s.node?`<circle cx="${n.x*650}" cy="${n.y*190}" r="18" fill="none" stroke="#d0b479"/>`:''}`).join('')}<text x="15" y="170">SAN FRANCISCO</text><text x="510" y="206">SIGNALS END</text><text x="300" y="23">EAST →</text><text x="194" y="211" class="map-caption">Paper trail · approximate geography</text></svg>`;
 modal('map',`<div class="label">${complete?'THE MERCERS MADE IT':'DAY '+(Math.floor(s.hour/24)+1)+' · CHAPTER '+current.chapter+' OF 8'}</div><h2>${complete?'Home, at Signals End.':'Go east. Get your life back.'}</h2><p class="journey-subtitle">${s.flags.inquirySent?'San Francisco → the Missouri–Arkansas Ozarks':'San Francisco → follow the broadcast'}</p>${s.flags.inquirySent?map:'<p>First lead: Bea’s repair yard, across the Bay. The rest is still a rumor.</p>'}<section class="journey-next"><span class="label">${s.road?'ON THE ROAD TO '+node(s.road.to).short.toUpperCase():'YOU ARE HERE · '+current.short.toUpperCase()}</span><h3>${objective(s)}</h3><p>${admission(s)}</p>${s.flags.convoyKnown&&!['ending','home'].includes(s.mode)?`<p class="convoy-clock">${count(s.deadline-s.hour)} hours until the Ava convoy leaves. ${s.flags.reservationConfirmed?'Frank’s reservation is for this intake.':'Bea knows its schedule; entry is still uncertain.'}</p>`:''}${s.mode==='stop'&&s.node!=='line'?button('chooseRoad',undefined,s.node==='plains'?'Choose how to earn your way in':'Plan the next drive →','','primary'):s.node==='line'&&s.mode==='stop'?button('reviewCharter',undefined,'Review entry & cross','','primary'):''}</section><details class="whole-trail" ${s.flags.inquirySent?'':'hidden'}><summary>The whole trail · ${s.stats.miles.toLocaleString()} miles traveled</summary><ol class="chapter-list">${chapters.map(([name,place,ids],i)=>{const here=ids.includes(s.node),done=ids.some(id=>s.visited.includes(id))&&!here;return `<li class="${here?'current':done?'done':''}" ${here?'aria-current="step"':''}><span>${done?'✓':String(i+1).padStart(2,'0')}</span><div><strong>${name}</strong><p>${place}${here?' · You are here':''}</p></div></li>`;}).join('')}</ol></details><div class="buttons">${button('world',undefined,'Why Signals End?','The promise, the rules and the people keeping it alive.')}</div>`);
}
function showShop(){const stock=shopStock(s,s.node);modal('shop',`<div class="label">CASH $${s.cash} · LOCKER ${slots(s)} / 7</div><h2>Keep something in reserve.</h2><p>The traders have limited supplies. A sealed can holds 14 fuel.</p><div class="buttons">${Object.entries(OFFERS).map(([id,o])=>button('buy',id,o.label,`$${o.price} · ${stock[id]} in stock`,'',!stock[id]||s.cash<o.price?'disabled':'')).join('')}</div><h3>Trade a spare · $25 each</h3><div class="buttons">${Object.keys(PARTS).map(id=>button('sell',id,PARTS[id].name,`${s.parts[id].length} aboard`,'',s.parts[id].length?'':'disabled')).join('')}</div>`);}
function showSupplies(){const n=node(s.node);modal('supplies',`<div class="label">${count(s.deadline-s.hour)} HOURS LEFT · ${threatLabel(s)}</div><h2>Keep the family moving.</h2><p>${count(s.meals*8)} hours of food · ${Math.round(s.energy)}% rest · ${Math.round(s.health)}% health. ${hurt(s)?'Jack’s injured hand slows repairs for '+count(s.effects.handUntil-s.hour)+' more hours.':''}</p><div class="buttons">${button('activity','repair','Repair the van',s.fan?'Fit a spare tire.':'Replace the seized fan.')}${n.shop?button('shop',undefined,'Trade supplies',`$${s.cash} remaining`):n.salvage?button('activity','salvage','Recover supplies','The shuttered workshop.'):''}${button('rest',undefined,'Sleep at camp','4 hours · +40 rest · +8 health')}${button('meal',undefined,'Cook a meal','1 meal · +15 rest · +12 health')}${n.fish?button('activity','fishing','Go fishing','A short fight. Food for everyone.'):''}${n.salvage?button('activity','salvage','Search the workshop',s.siteMemory[s.node]?.sealed?'Sealed by Collectors.':'Tools, fuel, and food.','',s.siteMemory[s.node]?.sealed?'disabled':''):''}${button('inventory',undefined,'Parts locker',`${slots(s)} / 7 spaces`)}</div><h3>Out of options?</h3><div class="buttons">${!s.flags.aid?button('aid',undefined,'Ask the repair network','4 hours · one emergency fuel and food reserve'):''}${button('rescueConfirm',undefined,'Call relief transport','End the attempt with the family safe.')}</div>`);}
function showRoads(){const next=roads(s.node);modal('roads',`<div class="label">FROM ${node(s.node).short.toUpperCase()} · ${count(s.deadline-s.hour)} HOURS TO CONVOY</div><h2>${s.node==='plains'?'Same destination. Two ways to help.':'Next stop: '+node(next[0].to).short+'.'}</h2><p>${s.node==='plains'?'Frank has reserved a house. A trusted witness or useful delivery turns that promise into your way through the Line.':objective(s)}</p><div class="route-buttons">${next.map(r=>button('travel',r.id,r.name,`${r.miles} miles · ${r.hours} hours · ${r.fuel+(!s.fan?2:0)} fuel · ${r.wear+(!s.fan?6:0)}% van<br>${r.via}<br>${r.monitored?'Collector scanners. ':''}${r.text}`,'primary',s.fuel<r.fuel+(!s.fan?2:0)||s.condition<=5?'disabled':'')).join('')}</div>${!s.fan?'<p>The seized fan costs 2 extra fuel and 6% extra wear every leg.</p>':''}${s.meals*8<Math.max(...next.map(r=>r.hours))?'<p role="alert">Food may run out during this drive. Fish or trade before leaving.</p>':''}<div class="buttons">${button('supplies',undefined,'Check fuel, food & family')}</div>`);}
function showSettings(){modal('settings',`<h2>Make it feel right.</h2><p>Fishing uses the lower grip. Your thumb stays below the fish.</p><div class="buttons">${button('fishCastMode',undefined,s.settings.castMode==='pull'?'Casting: pull back':'Casting: tap water')}${[['autoHook','Automatic hook'],['toggleReel','Tap to toggle reeling'],['reducedMotion','Reduced motion']].map(([id,label])=>button('settingToggle',id,`${s.settings[id]?'✓ ':''}${label}`)).join('')}</div>`);}
function showHelp(){modal('help',`<h2>Keep the family moving.</h2><h3>Search</h3><p>Choose an object. Work quietly or force it loose. Watch the patrol countdown. Hiding keeps you safe, but the Collectors seal the yard. Leave with what you need.</p><h3>Fish</h3><p>Tap a rise to cast. You can switch to pull casting in settings. Wait for the float to sink, then strike. Hold the grip to reel, slide sideways to angle the rod, and release during a run. Take up prolonged slack.</p><h3>Controller</h3><p>Fishing: left stick aims and angles; right trigger or A casts, hooks, and reels. A keeps a landed fish; X releases it. B brings in the line. Start pauses. Menus: D-pad and A.</p><h3>Your way in</h3><p>Restore Glenn’s pump for a sponsor, or keep the Pruitts’ filters at least 45% intact. The Pruitts have one replacement crate at the ridge if your filters fall below 45%. Returning to Glenn is a longer fallback.</p>${button('settings',undefined,'Touch & accessibility')}`);}
let audioOn=false,audioCtx=null;
function sound(){if(!audioOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),gain=audioCtx.createGain();o.type='sine';o.frequency.value=s.mode==='home'?330:180;gain.gain.setValueAtTime(.022,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.16);o.connect(gain).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.18);}catch{}}
function perform(type,id,target){
 if(type.startsWith('intro')){prologueAction(type);return;}
 if(type==='replayIntro'){beginPrologue(true);return;}
 if(type==='new'){if(saved)modal('new',`<h2>Start another pilgrimage?</h2><p>This replaces this edition’s saved journey. Earlier edition saves stay separate.</p>${button('confirmNew',undefined,'Start fresh','','danger')}`);else startNew();return;}
 if(type==='newConfirm'){modal('new',`<h2>Take another road?</h2><p>The next pilgrimage replaces this local save.</p>${button('confirmNew',undefined,'Start fresh','','primary')}`);return;}
 if(type==='confirmNew'){startNew();return;}if(type==='resume'){resume();return;}
 if(type==='close'){closeModal();return;}if(type==='pause'){openPause();return;}
 if(type==='title'){closeModal();ui.title=true;persist();drawUI(true);return;}
 if(type==='fullscreen'){document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{});return;}
 if(type==='supplies'){showSupplies();return;}if(type==='chooseRoad'){showRoads();return;}if(type==='prepare'){modal('prepare',`<h2>Before the storm.</h2><p>${s.sponsor?'Your sponsorship is signed.':s.cargo?'Filters: '+Math.round(s.cargo.condition)+'%. You need 45%.':'You need a sponsor or delivery.'}</p><div class="buttons">${!s.flags.hideout?button('hideout',undefined,'Lose the pursuit',s.flags.safeContact?'Your contact · 2 hours':'Local guide · $15 · 3 hours'):''}${!s.sponsor&&(!s.cargo||s.cargo.condition<45&&!s.flags.replacementFilters)?button('delivery',undefined,s.cargo?'Replace the damaged filters':'Take a filter delivery',s.cargo?'3 hours · one spare crate · 80% intact':'1.5 hours · 3 spaces'):''}${button('activity','repair','Repair the van')}${button('chooseRoad',undefined,'Choose the road')}</div>`);return;}if(type==='gateHelp'){modal('gateHelp',`<h2>A way forward.</h2><div class="buttons">${button('returnRidge',undefined,'Return to the ridge','5 hours · 5 fuel')}${button('outer',undefined,'Stay in the outer camp','End safely outside the Line.')}${button('supplies',undefined,'Supplies & family')}</div>`);return;}
 if(type==='reviewCharter'){modal('charter',`<div class="label">EVELYN WARD · THE BORDER STOREHOUSE</div><h2>A choice you make freely.</h2><img class="lore-image" src="assets/eastbound-07/signals-end-basin.webp" alt="The reservoir refuge beyond the guarded crossing"><p>${admission(s)}.</p><ul><li>Phones, computers and all digital devices stay in a numbered box outside the Line. Even Ben’s dead handheld. They can be reclaimed if you leave.</li><li>The same ban applies to the council. Mechanical engines, electricity and analog radios are allowed.</li><li>Your deed is independent of any job. Shared dues are public, voted on and capped. You may leave freely.</li></ul><p>Ben’s friends are still behind that login. He holds the handheld before storing it. “Can we keep a radio?” “Analog. Yes.” Jack hands him the wrench. A hard goodbye, freely chosen.</p><div class="buttons">${button('gate',undefined,'Store the devices & cross','Accept the charter. Bring everyone across.','primary',s.sponsor||s.cargo?.condition>=45?'':'disabled')}${button('gateHelp',undefined,'Other ways forward')}</div>`);return;}
 if(type==='world'){const k=knowledge(s);modal('world',`<div class="label">${k.title.toUpperCase()}</div><h2>Leave the digital world behind.</h2><img class="lore-image" src="assets/brand-v2/radio-1672.webp" alt="An old shortwave receiver with a physical tuning dial"><p>${k.text}</p><details open><summary>The life we left</summary><p>${ORIGIN}</p></details><details><summary>The companies behind the cameras</summary><p>Nine firms. Shared accounts and enforcement, competing interests. San Francisco is their showcase.</p>${CORPORATIONS.map(c=>`<p><strong>${c.name} · ${c.domain}</strong><br>${c.control}</p>`).join('')}</details><details><summary>The voice Ben found</summary><p>“${RADIO_MESSAGE}”</p><p>Bea’s receiver has no account and sends no location. A camera can still see it. The Collectors follow relocation orders, household debt and plate scans.</p></details><details><summary>${s.flags.reservationConfirmed?'What Frank confirmed':'What people say about the refuge'}</summary><p>${s.flags.reservationConfirmed?'Frank confirmed':'The repair network speaks of'} a reservoir basin in the Missouri–Arkansas Ozarks. No phones, computers or digital devices, even for the council. Electricity, mechanical engines and analog radios work. Nobody can issue your home a remote account command.</p><p>Reservoir crews, farmers and clerks kept the water and power running. Their provisional council refused the corporate service compact’s takeover. Outsiders call it a shadow government. ${s.flags.reservationConfirmed?'Frank’s papers describe a charter, elections and capped public dues.':'The Mercers still need evidence that its promises hold.'}</p></details>${s.flags.reservationConfirmed?`<details><summary>A freedom we can choose</summary><p>Guarded bridges and patrols protect the basin. There is no force field. An invasion would endanger water and power that outside customers need. The council matches admission to food, water and vacant homes. Glenn’s witness or the Pruitts’ filters completes Frank’s agreement.</p><p>The homestead fund buys from willing sellers and settled estates. Your deed survives losing a job. Leaders obey the same digital ban. You may leave and reclaim stored devices. You keep responsibility for ordinary chores. The toilet, regrettably, is still your problem.</p></details>`:''}`);return;}
 if(type==='help'){showHelp();return;}if(type==='shop'){showShop();return;}
 if(type==='sound'){dispatch({type:'setting',id:'sound',value:!s.settings.sound});enableAudio(s.settings.sound);openPause();return;}
 if(type==='journal'){modal('journal',`<h2>What we carried.</h2><h3>${knowledge(s).title}</h3><p>${knowledge(s).text}</p><div class="gallery">${s.reel.gallery.map(id=>`<figure><img src="${sources[SHOTS[id].image]}" alt="${SHOTS[id].title}"><figcaption>${SHOTS[id].title}</figcaption></figure>`).join('')}</div>${s.journal.length?s.journal.map(e=>`<div class="journal-entry"><div class="label">${count(e.hour)} HOURS ON THE ROAD${e.earlierStoryDraft?' · EARLIER STORY DRAFT':''}</div><h3>${esc(e.title)}</h3><p>${esc(e.body)}</p></div>`).join(''):'<p>Ben’s broadcast is where this began.</p>'}`);return;}
 if(type==='inventory'){modal('inventory',`<h2>What’s in the van.</h2><div class="part-list">${inventoryHTML()}</div><p>${slots(s)} / 7 locker spaces. A filter delivery needs three.</p><h3>What you brought</h3><p>${s.packed.map(id=>PACKING.find(i=>i.id===id).name).join(' · ')}</p>`);return;}
 if(type==='person'){const p=FAMILY.find(p=>p.id===id);modal('person',`<h2>${p.full}</h2><div class="character-head">${portrait(id,'large')}<div><p>${p.role}</p><p>“${p.line}”</p></div></div><p>${p.story}</p><p class="keepsake"><strong>Still carries:</strong> ${p.id==='ben'&&(s.mode==='home'||s.ending?.owned)?'A paper notebook. His handheld stayed at the Line.':p.keepsake}</p>`);return;}
 if(type==='rescueConfirm'){modal('rescue',`<h2>Leave the van?</h2><p>Relief transport takes the family to safety. This ends the pilgrimage.</p>${button('rescue',undefined,'End this attempt','','danger')}`);return;}
 if(['buy','sell'].includes(type)){dispatch({type,id});const msg=s.message||$('notice').textContent;showShop();$('dialogbody').insertAdjacentHTML('afterbegin',`<p role="status">${esc(msg)}</p>`);return;}
 if(type==='chooseLead'){ui.wire={index:Number(id),x:.25,y:.44+Number(id)*.13};drawUI(true);return;}
 if(type==='socket'){if(ui.wire){dispatch({type:'connect',from:ui.wire.index,to:Number(id)});ui.wire=null;drawUI(true);}return;}
 if(type==='selectNext'){const items=s.sites[s.node].filter(i=>!i.taken);if(items.length){let ix=items.findIndex(i=>i.id===s.activity.selected);dispatch({type:'inspect',id:items[(ix+1)%items.length].id});}return;}
 if(type==='extract'){dispatch({type,id,method:id==='force'?'force':'quiet'});return;}
 if(type==='fishCastMode'){dispatch({type:'setting',id:'castMode',value:s.settings.castMode==='pull'?'tap':'pull'});if(ui.dialog==='settings')showSettings();return;}
 if(type==='fishCutConfirm'){modal('cut',`<h2>Bring the line in?</h2><p>${s.activity.phase==='fight'?'The fish gets away. You keep your tackle.':'This cast ends without a catch.'}</p>${button('confirmCut',undefined,'Bring it in','','primary')}`);return;}
 if(type==='confirmCut'){closeModal();dispatch({type:'fishCut'});return;}
 if(type==='settings'){showSettings();return;}
 if(type==='settingToggle'){dispatch({type:'setting',id,value:!s.settings[id]});showSettings();return;}
 if(type==='nudge'){dispatch({type:'steer',value:s.activity.target+(id==='left'?-.18:.18)});return;}
 if(['holdReel','holdSlow'].includes(type))return;
 if(['activity','travel','rest','meal','hideout','delivery','returnRidge','outer','aid','rescue','gate'].includes(type)&&$('dialog').open)closeModal();
 dispatch({type,id,target});sound();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)perform(b.dataset.action,b.dataset.id,b.dataset.target);});
$('pause').onclick=()=>ui.prologue?prologueAction('introPause'):openPause();$('map').onclick=showMap;$('journal').onclick=()=>perform('journal');$('help').onclick=showHelp;
$('dialog').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
document.addEventListener('input',e=>{if(e.target.id==='tune')dispatch({type:'tune',value:Number(e.target.value)/100});if(e.target.id==='rod')dispatch({type:'reel',value:s.activity.reel,x:Number(e.target.value)/100});});
function point(e){const r=canvas.getBoundingClientRect();return {x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1)};}
function at(p){return [...ui.hits].reverse().find(hit=>Math.hypot((p.x-hit.x)*canvas.clientWidth,(p.y-hit.y)*canvas.clientHeight)<hit.r);}
function sceneDown(p){if(ui.title||ui.paused)return;const h=at(p),g=s.activity;
 if(s.mode==='salvage'){if(h?.type==='item')dispatch({type:'inspect',id:h.id});else if(h?.type==='exit')dispatch({type:'exitSite',id:h.id});else if(h?.type==='cover')dispatch({type:'hide'});}
 if(s.mode==='repair'){
  if(g.phase==='diagnose'&&h?.type==='part')dispatch({type:'test',id:h.id});
  else if(g.phase==='replace'&&h?.id===g.fault)dispatch({type:'fit',id:g.fault});
  else if(g.phase==='connect'&&h?.type==='lead')ui.wire={index:h.index,...p};
  else if(g.phase==='tune'&&p.y>.42&&p.y<.7)dispatch({type:'tune',value:(p.x-.18)/.64});
 }
 if(s.mode==='fishing'){
  if(g.phase==='aim'){
   if(s.settings.castMode==='tap'&&p.y>.24&&p.y<.78)dispatch({type:'cast',x:p.x,y:p.y,method:'tap'});
   else if(s.settings.castMode==='pull'&&p.y>.71)ui.cast={...p,lastX:p.x,lastY:p.y};
  }else if(g.phase==='bite')dispatch({type:'hook'});
  else if(g.phase==='fight'&&p.y>.70){ui.grip={x:p.x,rod:g.rod};dispatch({type:'reel',value:s.settings.toggleReel?!g.reel:true});}
 }
 if(s.mode==='crossing')dispatch({type:'steer',value:p.x});
 if(s.mode==='home'&&h)dispatch({type:'homeItem',id:h.id});
}
function sceneMove(p){if(ui.title||ui.paused)return;
 if(ui.wire)ui.wire={...ui.wire,...p};
 if(ui.cast){ui.cast.lastX=p.x;ui.cast.lastY=p.y;const target=castEndpoint(ui.cast,{x:p.x,y:p.y});s.activity.aim={x:target.x,y:target.y};}
 if(ui.grip&&s.mode==='fishing'&&s.activity.phase==='fight')dispatch({type:'reel',value:s.activity.reel,x:ui.grip.rod+(p.x-ui.grip.x)*2});
 if(s.mode==='repair'&&s.activity.phase==='tune'&&p.y>.4&&p.y<.73)dispatch({type:'tune',value:(p.x-.18)/.64});
 if(s.mode==='crossing')dispatch({type:'steer',value:p.x});
}
function sceneUp(p,cancel=false){
 if(ui.wire&&s.mode==='repair'){const h=at(p);if(!cancel&&h?.type==='socket')dispatch({type:'connect',from:ui.wire.index,to:h.index});ui.wire=null;}
 if(ui.cast&&s.mode==='fishing'){
  const target=castEndpoint(ui.cast,{x:p.x,y:p.y});ui.cast=null;
  if(!cancel&&target.valid)dispatch({type:'cast',x:target.x,y:target.y,method:'pull'});
 }
 if(ui.grip&&s.mode==='fishing'&&(!s.settings.toggleReel||cancel))dispatch({type:'reel',value:false});ui.grip=null;drawUI(true);
}
let pointer=null;
canvas.addEventListener('pointerdown',e=>{if(ui.title||ui.paused||pointer!==null)return;pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);sceneDown(point(e));e.preventDefault();});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===pointer)sceneMove(point(e));});
canvas.addEventListener('pointerup',e=>{if(e.pointerId===pointer){sceneUp(point(e));pointer=null;}});
canvas.addEventListener('pointercancel',e=>{if(e.pointerId===pointer){sceneUp(point(e),true);pointer=null;}});
canvas.addEventListener('lostpointercapture',()=>{if(pointer!==null){resetInput();pointer=null;}});
let heldControl=null;
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.hold');if(!b||ui.paused)return;heldControl=b;b.setPointerCapture(e.pointerId);b.classList.add('held');dispatch({type:b.dataset.action==='holdReel'?'reel':'slow',value:true});});
function releaseHold(){if(heldControl){heldControl.classList.remove('held');dispatch({type:heldControl.dataset.action==='holdReel'?'reel':'slow',value:false});heldControl=null;}}
document.addEventListener('pointerup',releaseHold);document.addEventListener('pointercancel',releaseHold);
window.addEventListener('blur',()=>{if(ui.prologue){openingPlayer?.pause();return;}resetInput();if(!ui.title&&!ui.paused)openPause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(ui.prologue){openingPlayer?.pause();return;}resetInput();if(!ui.title&&!ui.paused)openPause();persist();}});
window.addEventListener('pagehide',()=>{openingPlayer?.pause();if(!ui.title)persist();});
function focusStep(dir){const root=$('dialog').open?$('dialog'):document;const choices=[...root.querySelectorAll('button:not(:disabled),a,input')].filter(e=>e.getClientRects().length);let i=choices.indexOf(document.activeElement);choices[(i+dir+choices.length)%choices.length]?.focus();}
const keys=new Set();
document.addEventListener('keydown',e=>{
 if(ui.prologue){if(['ArrowRight','ArrowLeft','Escape',' '].includes(e.key)){e.preventDefault();prologueAction(e.key==='Escape'?'introSkip':e.key==='ArrowRight'?'introNext':e.key==='ArrowLeft'?'introBack':'introPause');}return;}
 if(e.key==='Escape'){e.preventDefault();ui.dialog?closeModal():!ui.title&&openPause();return;}
 if(e.key.toLowerCase()==='f'&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();perform('fullscreen');return;}
 if(ui.paused||ui.title)return;
 if(['ArrowLeft','ArrowRight'].includes(e.key)&&s.mode==='crossing'){e.preventDefault();keys.add(e.key);}
 if(e.code==='Space'&&(s.mode==='fishing'&&s.activity.phase==='fight'||s.mode==='crossing')){e.preventDefault();dispatch({type:s.mode==='fishing'?'reel':'slow',value:true});}
});
document.addEventListener('keyup',e=>{keys.delete(e.key);if(e.code==='Space'){if(s.mode==='fishing')dispatch({type:'reel',value:false});if(s.mode==='crossing')dispatch({type:'slow',value:false});}});
let prevButtons=[],padWasScene=false;
function gamepad(dt){
 const pad=[...(navigator.getGamepads?.()||[])].find(p=>p?.connected);
 if(!pad){if(prevButtons.length&&s.mode==='fishing')s.activity.reel=false;prevButtons=[];return;}
 const b=pad.buttons.map(x=>x.pressed),edge=i=>b[i]&&!prevButtons[i],ax=pad.axes[0]||0,ay=pad.axes[1]||0;
 if(ui.prologue){if(edge(1))prologueAction('introSkip');if(edge(9))prologueAction('introPause');if(edge(0))prologueAction(ui.prologue.source==='stills'?'introNext':'introPause');if(edge(15))prologueAction('introNext');if(edge(14))prologueAction('introBack');prevButtons=b;return;}
 if(edge(9)){ui.dialog?closeModal():openPause();prevButtons=b;return;}
 if(!ui.title&&!ui.paused&&s.mode==='fishing'){
  const g=s.activity,trigger=b[7]||b[0],before=prevButtons[7]||prevButtons[0];
  if(g.phase==='aim'){
   g.aim.x=clamp(g.aim.x+(Math.abs(ax)>.15?ax:0)*dt*.45,.1,.9);g.aim.y=clamp(g.aim.y+(Math.abs(ay)>.15?ay:0)*dt*.3,.25,.76);
   if(trigger&&!before)dispatch({type:'cast',...g.aim,method:'controller'});
  }else if(g.phase==='bite'&&trigger&&!before)dispatch({type:'hook'});
  else if(g.phase==='fight'){g.rod=clamp(.5+ax*.45,.08,.92);g.reel=s.settings.toggleReel?(trigger&&!before?!g.reel:g.reel):trigger;}
  else if(g.phase==='landed'){if(edge(0))dispatch({type:'fishKeep'});else if(edge(2))dispatch({type:'fishRelease'});}
  else if(g.phase==='empty'&&edge(0))dispatch({type:'fishRetry'});
  if(edge(1)){if(['fight','wait','bite','cast'].includes(g.phase))perform('fishCutConfirm');else dispatch({type:'leaveActivity'});}
  prevButtons=b;return;
 }
 if(edge(1)){if(ui.dialog)closeModal();else if(s.mode==='salvage')dispatch({type:'exitSite',id:'rear'});else if(s.activity&&!['home','crossing'].includes(s.mode)){resetInput();dispatch({type:'leaveActivity'});}else openPause();}
 if(edge(12)||edge(14))focusStep(-1);if(edge(13)||edge(15))focusStep(1);
 const moving=Math.hypot(ax,ay)>.18;
 if(!ui.title&&!ui.paused&&moving){
  if(s.mode==='crossing')s.activity.target=clamp(s.activity.target+ax*dt*.6,.12,.88);
  else if(['salvage','repair'].includes(s.mode)&&document.activeElement?.tagName!=='INPUT'){ui.padCursor??={x:.5,y:.5};ui.padCursor.x=clamp(ui.padCursor.x+ax*dt*.4,.04,.96);ui.padCursor.y=clamp(ui.padCursor.y+ay*dt*.4,.2,.88);canvas.focus({preventScroll:true});if(b[0])sceneMove(ui.padCursor);}
 }
 if(edge(0)){if(document.activeElement===canvas&&ui.padCursor&&!ui.paused){sceneDown(ui.padCursor);padWasScene=true;}else{const active=document.activeElement;if(active?.tagName==='INPUT'){active.value=Number(active.value)+10;active.dispatchEvent(new Event('input',{bubbles:true}));}else active?.click();}}
 if(!b[0]&&prevButtons[0]&&padWasScene){sceneUp(ui.padCursor);padWasScene=false;}
 if(!ui.paused&&document.activeElement?.tagName==='INPUT'&&moving){const el=document.activeElement;el.value=clamp(Number(el.value)+ax*dt*50,0,100);el.dispatchEvent(new Event('input',{bubbles:true}));}
 if(!ui.paused&&s.mode==='crossing')s.activity.speed=b[6]?.36:.7;
 prevButtons=b;
}
let assetsLoaded=false;ready.then(()=>assetsLoaded=true);
function tick(dt){if(ui.prologue){if(!assetsLoaded)return;openingPlayer?.tick(dt);return;}if(!ui.title&&!ui.paused){update(s,dt);saveClock+=dt;if(saveClock>2){persist();saveClock=0;}}}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;gamepad(dt);if(!manual){if(s.mode==='crossing'&&!ui.paused){const dir=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0);s.activity.target=clamp(s.activity.target+dir*dt*.55,.12,.88);}tick(dt);}drawUI();render(canvas,s,ui);soundFrame(s,ui);requestAnimationFrame(frame);}
window.render_game_to_text=()=>JSON.stringify({...summary(s),mode:ui.prologue?'prologue':ui.title?'intro':s.mode,prologue:prologueState(ui.prologue),title:BRAND.title,storedMode:s.mode,overlay:ui.dialog,paused:ui.paused,coordinates:'Scene x and y are normalized 0..1 from the top left; r is a CSS-pixel hit radius.',hitTargets:ui.hits,weatherRadio:s.packed.includes('radio'),controls:[...document.querySelectorAll('button:not(:disabled)')].filter(x=>x.getClientRects().length).map(x=>({action:x.dataset.action||x.id,id:x.dataset.id,label:x.innerText}))});
window.advanceTime=ms=>{manual=true;if(ui.prologue){openingPlayer?.advance(ms/1000);drawUI();render(canvas,s,ui);return;}for(let t=0;t<ms;t+=1000/60)tick(Math.min(1000/60,ms-t)/1000);drawUI();render(canvas,s,ui);if(!ui.title)persist();};
window.artReady=ready;
drawFamily();drawUI(true);ready.then(()=>render(canvas,s,ui));requestAnimationFrame(frame);
const startupURL=new URL(location.href),forceOpening=startupURL.searchParams.get('film')==='1';if(forceOpening){startupURL.searchParams.delete('film');history.replaceState(null,'',startupURL);}
if(shouldAutoOpen({seen:!!openingSeen(),hasSave:!!saved||!!oldSave,reducedMotion:s.settings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches,saveData:!!navigator.connection?.saveData,force:forceOpening}))beginPrologue(true);
if('serviceWorker'in navigator&&!['localhost','127.0.0.1'].includes(location.hostname))navigator.serviceWorker.register('./sw.js').catch(()=>{$('save-status').textContent='Saved locally · offline cache unavailable';});
