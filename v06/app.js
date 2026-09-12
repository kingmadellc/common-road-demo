import {BRAND} from './brand.js?v=0.6.0';
import {BEATS,INTRO_KEY,newPrologue,progressPrologue,movePrologue,restorePrologue,prologueState} from './prologue.js?v=0.6.0';
import {VERSION,SAVE_KEY,FAMILY,NODES,ROADS,PACKING,PARTS,node,roads} from './world.js?v=0.6.0';
import {fresh,load,save,act,update,summary,slots,clamp} from './sim.js?v=0.6.0';
import {render,ready,HAZARDS,HOME_POINTS,sources} from './art.js?v=0.6.0';
import {castEndpoint} from './fishing.js?v=0.6.0';
import {yardView} from './scenes.js?v=0.6.0';
import {SITE_NAMES} from './salvage.js?v=0.6.0';
import {collectorOptions,incidentOptions,threatLabel} from './conflict.js?v=0.6.0';
import {hurt,shopStock,OFFERS} from './state.js?v=0.6.0';
import {SHOTS} from './journey.js?v=0.6.0';
import {enableAudio,soundFrame} from './sound.js?v=0.6.0';
const $=id=>document.getElementById(id),canvas=$('scene');
let saved=load(localStorage),s=saved||fresh(Math.floor(Math.random()*100000)),manual=false,last=performance.now(),saveClock=0,panelKey='',statusKey='',resourceKey='';
const ui={grip:null,title:true,paused:false,dialog:null,hits:[],drag:null,wire:null,cast:null,padCursor:null,prologue:null};
let oldSave=null;try{const old=JSON.parse(localStorage.getItem('common-road-pilgrimage-v5'));if(old?.version==='0.5.0'&&old.parts&&old.threat)oldSave=old;ui.prologue=restorePrologue(localStorage.getItem(INTRO_KEY));}catch{}
if(ui.prologue?.settings)s.settings={...s.settings,...ui.prologue.settings};
if(!saved&&!ui.prologue?.settings&&matchMedia('(prefers-reduced-motion: reduce)').matches)s.settings.reducedMotion=true;
function savePrologue(){if(ui.prologue)ui.prologue.settings={...s.settings};try{ui.prologue?localStorage.setItem(INTRO_KEY,JSON.stringify(ui.prologue)):localStorage.removeItem(INTRO_KEY);}catch{}}
function beginPrologue(replay=false){const returnTitle=ui.title;resetInput();if($('dialog').open)closeModal();ui.prologue={...newPrologue(replay),returnTitle};ui.paused=false;savePrologue();drawUI(true);requestAnimationFrame(()=>$('intro-next')?.focus({preventScroll:true}));}
function finishPrologue(){const p=ui.prologue;ui.prologue=null;savePrologue();if(!p.replay)finishNew();else{ui.title=p.returnTitle;drawUI(true);}}
function prologueAction(type){const p=ui.prologue;if(!p)return;
 if(type==='introSkip'||type==='introFinish'){finishPrologue();return;}
 if(type==='introNext'){if(p.index===BEATS.length-1){finishPrologue();return;}movePrologue(p,1);}
 if(type==='introBack')movePrologue(p,-1);
 if(type==='introPause')p.paused=!p.paused;
 if(type==='introMotion'){s.settings.reducedMotion=!s.settings.reducedMotion;p.paused=s.settings.reducedMotion;}
 if(type==='introSound'){s.settings.sound=!s.settings.sound;enableAudio(s.settings.sound);}
 savePrologue();drawUI(true);
}
function drawOpeningFilm(force){const p=ui.prologue,b=BEATS[p.index];const key='prologue'+JSON.stringify([p.index,p.paused,s.settings.sound,s.settings.reducedMotion]);
 if(force||panelKey!==key){$('opening').innerHTML=`<div class="film-top"><span class="film-number">FIELD RECORDING / 0${p.index+1}</span><button data-action="introSkip">${p.replay?'Close film':'Skip intro'}</button></div><div class="film-copy"><div class="label">${b.eyebrow}</div><h1>${b.title}</h1><p>${b.body}</p><blockquote>${b.quote}<cite>${b.speaker}</cite></blockquote></div><div class="film-bottom"><div class="film-progress" aria-label="Opening chapter ${p.index+1} of ${BEATS.length}">${BEATS.map((_,i)=>`<i class="${i<p.index?'done':i===p.index?'current':''}"><b></b></i>`).join('')}</div><div class="film-controls"><button data-action="introBack" aria-label="Previous scene" ${p.index===0?'disabled':''}>←</button><button data-action="introPause" aria-pressed="${p.paused}">${p.paused?'Play':'Pause'}</button><button class="primary" id="intro-next" data-action="introNext">${p.index===BEATS.length-1?(p.replay?'Back to the journey':'Pack the van'):'Next →'}</button></div><div class="film-options"><button data-action="introSound" aria-pressed="${s.settings.sound}">Sound ${s.settings.sound?'on':'off'}</button><button data-action="introMotion" aria-pressed="${s.settings.reducedMotion}">${s.settings.reducedMotion?'Still frames · manual advance':'Motion on'}</button></div></div>`;panelKey=key;}
 const bar=$('opening').querySelector('.current b');if(bar)bar.style.width=(b.duration?Math.min(1,p.elapsed/b.duration)*100:100)+'%';
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(type,id,label,small='',cls='',extra='')=>`<button data-action="${type}" ${id!==undefined?`data-id="${id}"`:''} class="${cls}" ${extra}>${label}${small?`<small>${small}</small>`:''}</button>`;
const group=(title,content,wide=false)=>`<div class="actiongroup${wide?' wide':''}"><h2>${title}</h2>${content}</div>`;
const bars=(label,value,color='')=>`${label}<div class="meter ${color}"><i style="width:${clamp(value,0,1)*100}%"></i></div>`;
const count=n=>Math.max(0,Math.round(n*10)/10);
function persist(){if(ui.prologue||ui.title&&!saved)return;try{save(localStorage,s);saved=structuredClone(s);$('save-status').textContent='Saved on this device';}catch{$('save-status').textContent='Saving unavailable · keep this tab open';}}
function resetInput(){ui.drag=null;ui.wire=null;ui.cast=null;ui.grip=null;pointer=null;if(s.activity){s.activity.reel=false;s.activity.carry=null;if(s.mode==='crossing')s.activity.speed=.65;}document.querySelectorAll('.held').forEach(x=>x.classList.remove('held'));}
function dispatch(action){try{const beforeMode=s.mode;const next=structuredClone(s);act(next,action);s=next;if(!['reel','tune','steer','slow','fishAim'].includes(action.type))persist();drawUI();if(beforeMode!==s.mode&&!ui.paused)$('stage').scrollIntoView({block:'start',behavior:'instant'});}catch(e){s.message=e.message;$('notice').textContent=e.message;}}
function startNew(){beginPrologue(false);}
function finishNew(){const settings={...s.settings};resetInput();s=fresh(Math.floor(Math.random()*100000));s.settings=settings;ui.title=false;ui.dialog=null;ui.paused=false;if($('dialog').open)$('dialog').close();persist();drawUI(true);}
function resume(){s=structuredClone(saved||s);resetInput();ui.title=false;drawUI(true);}
function packCount(){return s.packed.reduce((v,id)=>v+PACKING.find(p=>p.id===id).slots,0);}
function portrait(id,cls=''){const i=FAMILY.findIndex(p=>p.id===id);return `<span class="portrait ${cls}"><img src="assets/intro-v06/crew.webp" style="left:-${i*100}%" alt="${FAMILY[i]?.name||''}" loading="eager"></span>`;}
function drawFamily(){ $('family').innerHTML=FAMILY.map(p=>`<button class="person" data-action="person" data-id="${p.id}" aria-label="${p.full}, ${p.role}">${portrait(p.id)}<span><strong>${p.name}</strong><small>${p.id==='rusty'?'Good company':'Mercer'}</small></span></button>`).join('');}
function panel(){
 const g=s.activity,n=node(s.node);
 if(s.mode==='packing')return group(`Six spaces. What comes with you? <span class="pill">${packCount()} / 6</span>`,`<p>Tools, a fishing rod, blankets, and basic food are aboard. Choose the rest.</p><div class="packing">${PACKING.map(i=>button('pack',i.id,`${i.icon} ${i.name} · ${i.slots}`,i.text,s.packed.includes(i.id)?'selected':'',`aria-pressed="${s.packed.includes(i.id)}"`)).join('')}</div>`,true)+group('The last two days',`<p>Everett is eighteen days behind you. The storm is two days ahead. Frank’s paper directions end at a place where the front door answers to a key.</p>`,false)+group('Keep one another going',`<div class="buttons">${button('depart',undefined,'Begin the pilgrimage','Reach Morrow before intake closes.','primary')}</div>`);
 if(s.mode==='stop'){
  let main;
  if(n.id==='yard')main=!s.fan?button(s.siteMemory.yard?.sealed&&!s.parts.fan.length?'shop':'activity',s.parts.fan.length?'repair':'salvage',s.parts.fan.length?'Fit the cooling fan':s.siteMemory.yard?.sealed?'Trade for a cooling fan':'Recover a cooling fan','Stop the extra fuel burn.','primary'):button('supplies',undefined,'Check the van','Running well. Pack for the road.');
  if(n.id==='river')main=button('activity','fishing','Fish for the family',`${count(s.meals*8)} hours of food remain.`,'primary');
  if(n.id==='pump')main=s.sponsor?button('activity','fishing','Catch something for the climb'):button(s.siteMemory.pump?.sealed&&!s.parts.relay.length?'shop':'activity',s.parts.relay.length?'repair':'salvage',s.parts.relay.length?'Restore the pump':s.siteMemory.pump?.sealed?'Trade for a pump relay':'Recover a pump relay',s.parts.relay.length?'Glenn will sponsor your household.':'The maintenance shed has a working relay.','primary',s.parts.relay.length?'data-target="pump"':'');
  if(n.id==='freight')main=s.cargo?button('activity','salvage','Recover road supplies','The filters are secured.'):button('delivery',undefined,'Carry the filters','1.5 hours · 3 spaces · a way into Morrow','primary');
  if(n.id==='ridge')main=button('prepare',undefined,'Prepare for the crossing',s.threat.heat?'A local guide can lose the pursuit.':'Check the van and your way in.','primary');
  if(n.id==='line')return group('The warm lights are real',`<p>${n.desc}</p><div class="buttons">${button('gate',undefined,'Cross the Line',s.sponsor?'Glenn has signed for you.':s.cargo?`Filters ${Math.round(s.cargo.condition)}% · need 45%.`:'You still need a sponsor or usable delivery.','primary')}${button('gateHelp',undefined,'Other ways forward','Return for evidence, or stay outside.')}</div>`,true);
  return group(n.name,`<p>${n.desc}</p><div class="buttons stop-actions">${main}${button('supplies',undefined,'Supplies & family',`$${s.cash} · ${slots(s)} / 7 locker spaces`)}${button('chooseRoad',undefined,'Get back on the road →',s.sponsor?'Sponsorship signed.':s.cargo?'Delivery aboard.':'A sponsor or delivery gets you in.','primary')}</div>`,true);
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
  return group(g.target==='pump'?'Blackwater needs water':'Keep the old van alive',`<p>${g.notice}</p><div class="buttons">${controls}</div>`,true)+(g.phase!=='done'?group('Leave the hood open?',`<div class="buttons">${button('leaveActivity',undefined,'Return to the stop','Your repair progress stays in place.')}</div>`):'');
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
 if(s.mode==='home')return group('Make yourselves at home',`<p>Four small things you never had permission to do. Touch the numbered places in the room.</p><div class="buttons">${HOME_POINTS.map(p=>button('homeItem',p.id,`${s.home.placed.includes(p.id)?'✓ ':''}${p.label}`,'',s.home.placed.includes(p.id)?'selected':'')).join('')}</div>`,true)+group('A place for the chair',`<p>${s.packed.includes('chair')?'Grandad’s chair made it all this way.':'The previous owner left a good armchair.'} Where does it belong?</p><div class="buttons">${button('homeSpot','window','By the window','',s.home.spot==='window'?'selected':'')}${button('homeSpot','workshop','By the workbench','',s.home.spot==='workshop'?'selected':'')}</div>`)+group('The first evening',`<div class="buttons">${button('finishHome',undefined,'Sit with the family',`${s.home.placed.length} / 4 things in place`,'primary',s.home.placed.length<4?'disabled':'')}</div>`);
 if(s.mode==='ending')return group(s.ending.title,`<p>${s.ending.text}</p>${s.ending.owned?`<div class="deed"><div class="label">MORROW COMPACT · RECORDED OWNERSHIP</div><h3>JACK & SARAH MERCER</h3><p>One home. A garden. A place to work with your hands.<br>No rent. No employer tied to your door. Local dues are public, voted on, and capped by the charter.</p><p>${s.packed.includes('chair')?'Grandad’s chair':'Your armchair'} sits ${s.home.spot==='window'?'beside the window':'by the workbench'}. Ben wants to learn the pump. Annie and Rusty are choosing a room.</p></div>`:''}<p>${s.stats.salvaged} items recovered · ${s.stats.fish} fish landed · ${s.stats.repairs} repairs completed · ${count(s.hour)} hours</p><div class="buttons">${button('newConfirm',undefined,'Another pilgrimage','Try the other road.','primary')}${button('journal',undefined,'Read the journey')}</div>`,true);
 return '';
}
function inventoryHTML(){return Object.entries(s.parts).map(([id,list])=>`<span class="pill">${PARTS[id].name}: ${list.length}${list.length?' · '+list.map(q=>q+'%').join(', '):''}</span>`).join('')+(s.cargo?`<span class="pill">Filters: ${Math.round(s.cargo.condition)}% · 3 spaces</span>`:'');}
function drawUI(force=false){
 document.body.dataset.mode=ui.prologue?'prologue':ui.title?'title':s.mode;document.body.classList.toggle('cinematic',!!ui.prologue);document.body.classList.toggle('title',ui.title||!!ui.prologue);if(ui.prologue){$('opening').hidden=false;drawOpeningFilm(force);return;}document.body.classList.toggle('reduced',s.settings.reducedMotion);
 if($('grip')){const g=s.activity,show=!ui.title&&s.mode==='fishing'&&['aim','wait','bite','fight'].includes(g?.phase);$('grip').hidden=!show; if(show){$('grip').textContent=g.phase==='aim'?(s.settings.castMode==='pull'?'PULL BACK TO CAST':'TAP A RISE TO CAST'):g.phase==='bite'?'STRIKE':g.phase==='fight'?(g.reel?'REELING · SLIDE TO ANGLE':'HOLD TO REEL'):'WAIT FOR THE BITE';$('grip').classList.toggle('strike',g.phase==='bite');}}
 document.body.classList.toggle('title',ui.title);$('opening').hidden=!ui.title;
 if(ui.title){const key='title'+!!saved+!!oldSave;if(force||panelKey!==key){$('opening').innerHTML=`<div class="label">A MODERN SURVIVAL TRAIL</div><h1 class="title-wordmark"><img src="${BRAND.mark}" alt="${BRAND.title}"></h1><p class="title-tagline">${BRAND.tagline}</p><p class="title-deck">Four people. One dog. A van too old to snitch.<br>Forty-eight hours to a place of your own.</p><div class="buttons">${saved?button('resume',undefined,'Continue the journey','','primary'):oldSave?button('importV5',undefined,'Continue your v0.5 journey','Copies your save into this edition.','primary'):''}${button('new',undefined,saved?'Start fresh':'Start the story','',saved||oldSave?'':'primary','id="start"')}</div><div class="title-extras">${button('replayIntro',undefined,'Watch the opening') }<a href="names/">Names & wordmarks ↗</a></div><div class="legacy">PLAYTEST 06 · WORKING TITLE<br><a href="v05/">Earlier edition & original v0.5 save</a></div>`;panelKey=key;}return;}
 const res=[['FUEL',count(s.fuel),'/ 50',s.fuel<12],['FOOD',count(s.meals*8),'hours',s.meals<1],['VAN',Math.round(s.condition),'%',s.condition<35],['FAMILY',hurt(s)?'Hurt':s.meals<.1?'Hungry':s.energy<25?'Weary':'Steady','',s.health<50||s.energy<25]];
 const rk=JSON.stringify(res);if(rk!==resourceKey){$('resources').innerHTML=res.map(([label,v,u,warn])=>`<div class="resource ${warn?'warn':''}"><span>${label}</span><strong>${v}</strong><small>${u}</small></div>`).join('');resourceKey=rk;}
 const g=s.activity;const key=JSON.stringify([s.mode,s.node,g?.phase,g?.selected,g?.connections,g?.notice,g?.catch,g?.working?.id,!!g?.player?.target,g?.player?.hiding,g?.patrol?.state,s.road?.shot?.id,s.story?.id,s.settings,s.packed,s.parts,s.cargo,s.sponsor,s.home,s.flags,s.cash,Math.floor(s.hour),s.threat.permitUsed,s.threat.heat,ui.wire?.index]);
 if(force||key!==panelKey){const active=document.activeElement;const token=active?.dataset?.action?[active.dataset.action,active.dataset.id]:null;const id=active?.id;$('actions').innerHTML=panel();panelKey=key;if(token){const el=[...$('actions').querySelectorAll('button')].find(x=>x.dataset.action===token[0]&&x.dataset.id===token[1]);el?.focus({preventScroll:true});}else if(id&&$(id)&&document.activeElement===document.body)$(id).focus({preventScroll:true});}
 if($('notice').textContent!==s.message)$('notice').textContent=s.message;
 const title=s.mode==='story'?SHOTS[s.story.id].title:s.mode==='packing'?'Everything we can carry':s.mode==='salvage'?SITE_NAMES[s.node]:s.mode==='repair'?(g.target==='pump'?'Bring the water back':'A machine worth saving'):s.mode==='fishing'?'Dinner is out there':s.mode==='crossing'?'The last crossing':s.mode==='home'?'A door of our own':s.mode==='ending'?s.ending.title:s.mode==='travel'||s.mode==='incident'?s.road.name:node(s.node).name;
 const region=s.mode==='home'||s.ending?.owned?'MORROW · THE FIRST EVENING':s.mode==='packing'?'THE MERCER HOUSEHOLD':node(s.node).region;
 const heading=`<div class="eyebrow">${region} · ${count(s.deadline-s.hour)} HOURS LEFT</div><h1>${title}</h1>`;if($('sceneheading').innerHTML!==heading)$('sceneheading').innerHTML=heading;
 let status='',hint='';
 if(s.mode==='salvage'){const p=g.patrol;status=p.state==='warning'?`COLLECTORS · ${Math.max(0,Math.ceil(12-p.elapsed))}s away`:p.state==='search'?'SEARCHING THE YARD':p.state==='watch'?'FRONT GATE BLOCKED':p.state==='gone'?'YARD SEALED':'WATCH THE ROAD';if(g.working)status+=bars(g.working.type==='makeSafe'?'Making safe':'Recovering',g.working.elapsed/g.working.duration);hint=g.player.hiding?'IN COVER · OUT OF SIGHT':g.phase==='intercept'?'THE REAR LANE IS STILL AN OPTION':'';}
 if(s.mode==='repair'){status=`${g.phase==='replace'?'FIT THE PART':g.phase==='method'?'CHOOSE YOUR PACE':g.phase==='steady'?'WORKING':g.phase==='done'?'RUNNING AGAIN':'TUNE BY FEEL'}`;hint=g.phase==='connect'?'MATCH I → I, II → II, III → III':g.phase==='tune'?'KEEP THE NEEDLE INSIDE THE BRASS BAND':'';}
 if(s.mode==='fishing'){status=g.phase==='fight'?bars(g.tension>.83?'STRAIN · EASE OFF':g.slack>.8?'SLACK · REEL':'LINE STRAIN',g.tension,g.tension>.83?'red':'')+bars('TO THE BANK',g.progress):g.phase==='bite'?'FLOAT UNDER · STRIKE':g.phase==='landed'?`${g.catchResult.portions} FRESH PORTIONS`:`${g.catch} portions kept`;hint=g.phase==='fight'?(g.behavior==='run'?'LET IT RUN':g.slack>.8?'TAKE UP THE SLACK':'REEL WHILE IT RECOVERS'):g.phase==='aim'?(s.settings.castMode==='pull'?'DRAG BACK FROM THE GRIP · PREVIEW THE LANDING':'TAP THE WATER · AIM NEAR A RISE'):'';}
 if(s.mode==='travel'){status=bars(`${Math.round(s.road.mph||0)} MPH · ${threatLabel(s)}`,s.road.elapsed/s.road.duration);hint=s.road.id==='opening'?'THE FINAL TWO DAYS':`${s.road.hours} hours of travel · ${s.road.fuel} fuel`;}
 if(s.mode==='crossing'){status=bars('THE FAR BANK',g.distance)+`${g.speed<.5?'SLOW':'CRUISING'} · ${g.hits.length} scrapes`;hint='DRAG TO STEER · AVOID THE BROKEN TIMBERS';}
 if(s.mode==='home'){status=`${s.home.placed.length} / 4 · MAKING IT OURS`;hint=s.home.placed.length===4?'THE FAMILY IS WAITING AT THE TABLE':'TOUCH A NUMBER TO SETTLE IN';}
 const sk=status+hint;if(sk!==statusKey){$('scenestatus').innerHTML=status;$('scenehint').textContent=hint;statusKey=sk;}
}
function modal(kind,content){resetInput();ui.paused=true;ui.dialog=kind;$('dialogbody').innerHTML=content+`<div class="buttons">${button('close',undefined,'Back to the journey','','primary')}</div>`;if(!$('dialog').open)$('dialog').showModal();$('dialog').querySelector('button')?.focus();persist();}
function closeModal(){if($('dialog').open)$('dialog').close();ui.paused=false;ui.dialog=null;drawUI(true);}
function openPause(){modal('pause',`<div class="label">THE ROAD CAN WAIT</div><h2>Take a breath.</h2><p>Your journey is saved on this device. Time stops while this panel is open.</p><div class="buttons">${button('title',undefined,'Opening screen')}${button('replayIntro',undefined,'Watch the opening')}${button('world',undefined,'What is Morrow?')}${button('help',undefined,'Controls')}${button('sound',undefined,s.settings.sound?'Mute sound':'Enable sound')}${button('settings',undefined,'Touch & accessibility')}${button('fullscreen',undefined,'Full screen')}</div>${s.mode==='stop'?`<div class="buttons">${button('aid',undefined,'Ask for emergency help','Once per journey · 4 hours, if supplies are low.')}${button('rescueConfirm',undefined,'Call relief transport','Ends this attempt safely.','danger')}</div>`:''}`);}
function showMap(){const map=`<svg class="route-map" viewBox="0 0 650 320" role="img" aria-label="Two roads to Morrow: pump sponsorship or freight delivery">${ROADS.filter(r=>node(r.from)&&node(r.to)).map(r=>{const a=node(r.from),b=node(r.to);return `<line x1="${60+a.x*530}" y1="${15+a.y*270}" x2="${60+b.x*530}" y2="${15+b.y*270}" stroke="#647870" stroke-width="3"/>`;}).join('')}${NODES.map(n=>`<circle cx="${60+n.x*530}" cy="${15+n.y*270}" r="${n.id===s.node?9:5}" fill="${n.id===s.node?'#f6c77c':'#8aaa9e'}"/><text x="${60+n.x*530+13}" y="${15+n.y*270+4}">${n.id==='pump'?'Pump house':n.id==='freight'?'Freight stop':n.id==='yard'?'Service yard':n.name}</text>`).join('')}</svg>`;modal('map',`<div class="label">THE FINAL LEG · FICTIONAL OZARK ROUTE</div><h2>All roads ask something.</h2>${map}<p><strong>Repair road:</strong> restore Glenn’s pump with a relay. His household sponsorship follows you.</p><p><strong>Convoy road:</strong> carry the Pruitts’ filters in three locker spaces. Deliver at least 45% intact.</p><p><strong>The Line:</strong> a controlled reservoir crossing, backed by a network of towns and repair crews. Storm intake closes after 48 hours.</p>`);}
function showShop(){const stock=shopStock(s,s.node);modal('shop',`<div class="label">CASH $${s.cash} · LOCKER ${slots(s)} / 7</div><h2>Keep something in reserve.</h2><p>The traders have limited supplies. A sealed can holds 14 fuel.</p><div class="buttons">${Object.entries(OFFERS).map(([id,o])=>button('buy',id,o.label,`$${o.price} · ${stock[id]} in stock`,'',!stock[id]||s.cash<o.price?'disabled':'')).join('')}</div><h3>Trade a spare · $25 each</h3><div class="buttons">${Object.keys(PARTS).map(id=>button('sell',id,PARTS[id].name,`${s.parts[id].length} aboard`,'',s.parts[id].length?'':'disabled')).join('')}</div>`);}
function showSupplies(){const n=node(s.node);modal('supplies',`<div class="label">${count(s.deadline-s.hour)} HOURS LEFT · ${threatLabel(s)}</div><h2>Keep the family moving.</h2><p>${count(s.meals*8)} hours of food · ${Math.round(s.energy)}% rest · ${Math.round(s.health)}% health. ${hurt(s)?'Jack’s injured hand slows repairs for '+count(s.effects.handUntil-s.hour)+' more hours.':''}</p><div class="buttons">${button('activity','repair','Repair the van',s.fan?'Fit a spare tire.':'Replace the seized fan.')}${n.shop?button('shop',undefined,'Trade supplies',`$${s.cash} remaining`):n.salvage?button('activity','salvage','Recover supplies','The shuttered workshop.'):''}${button('rest',undefined,'Sleep at camp','4 hours · +40 rest · +8 health')}${button('meal',undefined,'Cook a meal','1 meal · +15 rest · +12 health')}${n.fish?button('activity','fishing','Go fishing','A short fight. Food for everyone.'):''}${n.salvage?button('activity','salvage','Search the workshop',s.siteMemory[s.node]?.sealed?'Sealed by Collectors.':'Tools, fuel, and food.','',s.siteMemory[s.node]?.sealed?'disabled':''):''}${button('inventory',undefined,'Parts locker',`${slots(s)} / 7 spaces`)}</div><h3>Out of options?</h3><div class="buttons">${!s.flags.aid?button('aid',undefined,'Ask the repair network','4 hours · one emergency fuel and food reserve'):''}${button('rescueConfirm',undefined,'Call relief transport','End the attempt with the family safe.')}</div>`);}
function showRoads(){modal('roads',`<div class="label">${count(s.deadline-s.hour)} HOURS LEFT</div><h2>Choose the next leg.</h2><div class="route-buttons">${roads(s.node).map(r=>button('travel',r.id,r.name,`${r.hours} hours · ${r.fuel+(!s.fan?2:0)} fuel · ${r.wear+(!s.fan?6:0)}% van<br>${r.monitored?'Scanner route. ':''}${r.text}`,'primary',s.fuel<r.fuel+(!s.fan?2:0)||s.condition<=5?'disabled':'')).join('')}</div>${!s.fan?'<p>The seized fan costs 2 extra fuel and 6% extra wear every leg.</p>':''}`);}
function showSettings(){modal('settings',`<h2>Make it feel right.</h2><p>Fishing uses the lower grip. Your thumb stays below the fish.</p><div class="buttons">${button('fishCastMode',undefined,s.settings.castMode==='pull'?'Casting: pull back':'Casting: tap water')}${[['autoHook','Automatic hook'],['toggleReel','Tap to toggle reeling'],['reducedMotion','Reduced motion']].map(([id,label])=>button('settingToggle',id,`${s.settings[id]?'✓ ':''}${label}`)).join('')}</div>`);}
function showHelp(){modal('help',`<h2>Keep the family moving.</h2><h3>Search</h3><p>Choose an object. Work quietly or force it loose. Watch the patrol countdown. Hiding keeps you safe, but the Collectors seal the yard. Leave with what you need.</p><h3>Fish</h3><p>Tap a rise to cast. You can switch to pull casting in settings. Wait for the float to sink, then strike. Hold the grip to reel, slide sideways to angle the rod, and release during a run. Take up prolonged slack.</p><h3>Controller</h3><p>Fishing: left stick aims and angles; right trigger or A casts, hooks, and reels. A keeps a landed fish; X releases it. B brings in the line. Start pauses. Menus: D-pad and A.</p><h3>Your way in</h3><p>Restore Glenn’s pump for a sponsor, or keep the Pruitts’ filters at least 45% intact. The ridge has a return road to the pump if the delivery fails.</p>${button('settings',undefined,'Touch & accessibility')}`);}
let audioOn=false,audioCtx=null;
function sound(){if(!audioOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),gain=audioCtx.createGain();o.type='sine';o.frequency.value=s.mode==='home'?330:180;gain.gain.setValueAtTime(.022,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.16);o.connect(gain).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.18);}catch{}}
function perform(type,id,target){
 if(type.startsWith('intro')){prologueAction(type);return;}
 if(type==='replayIntro'){beginPrologue(true);return;}
 if(type==='importV5'&&oldSave){s=structuredClone(oldSave);s.version=VERSION;ui.title=false;persist();drawUI(true);beginPrologue(true);return;}
 if(type==='new'){if(saved)modal('new',`<h2>Start another pilgrimage?</h2><p>This replaces this edition’s journey after the opening. Earlier edition saves stay separate.</p>${button('confirmNew',undefined,'Start fresh','','danger')}`);else startNew();return;}
 if(type==='newConfirm'){modal('new',`<h2>Take another road?</h2><p>The next pilgrimage replaces this local save.</p>${button('confirmNew',undefined,'Start fresh','','primary')}`);return;}
 if(type==='confirmNew'){startNew();return;}if(type==='resume'){resume();return;}
 if(type==='close'){closeModal();return;}if(type==='pause'){openPause();return;}
 if(type==='title'){closeModal();ui.title=true;persist();drawUI(true);return;}
 if(type==='fullscreen'){document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{});return;}
 if(type==='supplies'){showSupplies();return;}if(type==='chooseRoad'){showRoads();return;}if(type==='prepare'){modal('prepare',`<h2>Before the storm.</h2><p>${s.sponsor?'Your sponsorship is signed.':s.cargo?'Filters: '+Math.round(s.cargo.condition)+'%. You need 45%.':'You need a sponsor or delivery.'}</p><div class="buttons">${!s.flags.hideout?button('hideout',undefined,'Lose the pursuit',s.flags.safeContact?'Your contact · 2 hours':'Local guide · $15 · 3 hours'):''}${!s.sponsor&&!s.cargo?button('delivery',undefined,'Take a filter delivery','1.5 hours · 3 spaces'):''}${button('activity','repair','Repair the van')}${button('chooseRoad',undefined,'Choose the road')}</div>`);return;}if(type==='gateHelp'){modal('gateHelp',`<h2>A way forward.</h2><div class="buttons">${button('returnRidge',undefined,'Return to the ridge','5 hours · 5 fuel')}${button('outer',undefined,'Stay in the outer camp','End safely outside the Line.')}${button('supplies',undefined,'Supplies & family')}</div>`);return;}
 if(type==='world'){modal('world',`<div class="label">FRANK’S PAPER NOTES</div><h2>Freedom needs maintenance.</h2><img class="lore-image" src="assets/journey-v05/basin.webp" alt="Reservoir towns and the Morrow crossing"><p>Morrow is a fictional basin in the Missouri–Arkansas Ozarks. After the service collapses, reservoir crews, farmers and town clerks quietly formed a compact. They kept the pumps running, copied the land records and refused Continuum’s rescue contract.</p><p>The Line is a set of guarded causeways and service roads around the reservoir, not a magic wall. The Compact can defend a few crossings. It cannot feed everyone who arrives. A sponsor or a useful delivery earns this household a place before the storm shuts intake.</p><p>A deed belongs to the household. It is not tied to a job or an account. Local dues are public, voted on and capped. Computers still exist here; essential machines have local controls and paper backups. Nobody can remotely cancel your kettle.</p><p>It is a fragile agreement between tired people. The toilet, regrettably, is still your problem.</p>`);return;}
 if(type==='help'){showHelp();return;}if(type==='shop'){showShop();return;}
 if(type==='sound'){dispatch({type:'setting',id:'sound',value:!s.settings.sound});enableAudio(s.settings.sound);openPause();return;}
 if(type==='journal'){modal('journal',`<h2>What we carried.</h2><div class="gallery">${s.reel.gallery.map(id=>`<figure><img src="${sources[SHOTS[id].image]}" alt="${SHOTS[id].title}"><figcaption>${SHOTS[id].title}</figcaption></figure>`).join('')}</div>${s.journal.length?s.journal.map(e=>`<div class="journal-entry"><div class="label">${e.hour} HOURS INTO THE FINAL LEG</div><h3>${esc(e.title)}</h3><p>${esc(e.body)}</p></div>`).join(''):'<p>The final leg is still ahead.</p>'}`);return;}
 if(type==='inventory'){modal('inventory',`<h2>What’s in the van.</h2><div class="part-list">${inventoryHTML()}</div><p>${slots(s)} / 7 locker spaces. A filter delivery needs three.</p><h3>What you brought</h3><p>${s.packed.map(id=>PACKING.find(i=>i.id===id).name).join(' · ')}</p>`);return;}
 if(type==='person'){const p=FAMILY.find(p=>p.id===id);modal('person',`<h2>${p.full}</h2><div class="character-head">${portrait(id,'large')}<div><p>${p.role}</p><p>“${p.line}”</p></div></div><p>${p.story}</p><p class="keepsake"><strong>Still carries:</strong> ${p.keepsake}</p>`);return;}
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
 if(['activity','travel','rest','meal','hideout','delivery','returnRidge','outer','aid','rescue'].includes(type)&&$('dialog').open)closeModal();
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
window.addEventListener('blur',()=>{if(ui.prologue){ui.prologue.paused=true;savePrologue();drawUI(true);return;}resetInput();if(!ui.title&&!ui.paused)openPause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(ui.prologue){ui.prologue.paused=true;savePrologue();drawUI(true);return;}resetInput();if(!ui.title&&!ui.paused)openPause();persist();}});
window.addEventListener('pagehide',()=>{savePrologue();if(!ui.title)persist();});
function focusStep(dir){const root=$('dialog').open?$('dialog'):document;const choices=[...root.querySelectorAll('button:not(:disabled),a,input')].filter(e=>e.getClientRects().length);let i=choices.indexOf(document.activeElement);choices[(i+dir+choices.length)%choices.length]?.focus();}
const keys=new Set();
document.addEventListener('keydown',e=>{
 if(ui.prologue){if(['ArrowRight','ArrowLeft','Escape',' '].includes(e.key)){e.preventDefault();prologueAction(e.key==='ArrowRight'?'introNext':e.key==='ArrowLeft'?'introBack':'introPause');}return;}
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
 if(ui.prologue){if(edge(9)||edge(1))prologueAction('introPause');if(edge(0)||edge(15))prologueAction('introNext');if(edge(14))prologueAction('introBack');prevButtons=b;return;}
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
function tick(dt){if(ui.prologue){if(!assetsLoaded)return;if(progressPrologue(ui.prologue,dt,s.settings.reducedMotion))savePrologue();return;}if(!ui.title&&!ui.paused){update(s,dt);saveClock+=dt;if(saveClock>2){persist();saveClock=0;}}}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;gamepad(dt);if(!manual){if(s.mode==='crossing'&&!ui.paused){const dir=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0);s.activity.target=clamp(s.activity.target+dir*dt*.55,.12,.88);}tick(dt);}drawUI();render(canvas,s,ui);soundFrame(s,ui);requestAnimationFrame(frame);}
window.render_game_to_text=()=>JSON.stringify({...summary(s),mode:ui.prologue?'prologue':ui.title?'intro':s.mode,prologue:prologueState(ui.prologue),title:BRAND.title,storedMode:s.mode,overlay:ui.dialog,paused:ui.paused,coordinates:'Scene x and y are normalized 0..1 from the top left; r is a CSS-pixel hit radius.',hitTargets:ui.hits,weatherRadio:s.packed.includes('radio'),controls:[...document.querySelectorAll('button:not(:disabled)')].filter(x=>x.getClientRects().length).map(x=>({action:x.dataset.action||x.id,id:x.dataset.id,label:x.innerText}))});
window.advanceTime=ms=>{manual=true;for(let t=0;t<ms;t+=1000/60)tick(Math.min(1000/60,ms-t)/1000);drawUI();render(canvas,s,ui);if(!ui.title)persist();};
window.artReady=ready;
drawFamily();drawUI(true);ready.then(()=>render(canvas,s,ui));requestAnimationFrame(frame);
if('serviceWorker'in navigator&&!['localhost','127.0.0.1'].includes(location.hostname))navigator.serviceWorker.register('./sw.js').catch(()=>{$('save-status').textContent='Saved locally · offline cache unavailable';});
