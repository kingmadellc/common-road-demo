import {VERSION,SAVE_KEY,FAMILY,NODES,ROADS,PACKING,PARTS,node,roads} from './world.js?v=0.3.0';
import {fresh,load,save,act,update,summary,slots,clamp} from './sim.js?v=0.3.0';
import {render,ready,HAZARDS,HOME_POINTS} from './art.js?v=0.3.0';
const $=id=>document.getElementById(id),canvas=$('scene');
let saved=load(localStorage),s=saved||fresh(Math.floor(Math.random()*100000)),manual=false,last=performance.now(),saveClock=0,panelKey='',statusKey='',resourceKey='';
const ui={title:true,paused:false,dialog:null,hits:[],drag:null,wire:null,cast:null,padCursor:null};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(type,id,label,small='',cls='',extra='')=>`<button data-action="${type}" ${id!==undefined?`data-id="${id}"`:''} class="${cls}" ${extra}>${label}${small?`<small>${small}</small>`:''}</button>`;
const group=(title,content,wide=false)=>`<div class="actiongroup${wide?' wide':''}"><h2>${title}</h2>${content}</div>`;
const bars=(label,value,color='')=>`${label}<div class="meter ${color}"><i style="width:${clamp(value,0,1)*100}%"></i></div>`;
const count=n=>Math.max(0,Math.round(n*10)/10);
function persist(){try{save(localStorage,s);saved=structuredClone(s);$('save-status').textContent='Saved on this device';}catch{$('save-status').textContent='Saving unavailable · keep this tab open';}}
function resetInput(){ui.drag=null;ui.wire=null;ui.cast=null;if(s.activity){s.activity.reel=false;s.activity.carry=null;if(s.mode==='crossing')s.activity.speed=.65;}document.querySelectorAll('.held').forEach(x=>x.classList.remove('held'));}
function dispatch(action){try{const beforeMode=s.mode;const next=structuredClone(s);act(next,action);s=next;if(!['reel','tune','steer','slow','inspect'].includes(action.type))persist();drawUI();if(beforeMode!==s.mode&&!ui.paused)$('stage').scrollIntoView({block:'start',behavior:'instant'});}catch(e){s.message=e.message;$('notice').textContent=e.message;}}
function startNew(){resetInput();s=fresh(Math.floor(Math.random()*100000));ui.title=false;ui.dialog=null;ui.paused=false;if($('dialog').open)$('dialog').close();persist();drawUI(true);}
function resume(){s=structuredClone(saved||s);resetInput();ui.title=false;drawUI(true);}
function packCount(){return s.packed.reduce((v,id)=>v+PACKING.find(p=>p.id===id).slots,0);}
function drawFamily(){ $('family').innerHTML=FAMILY.map((p,i)=>`<button class="person" data-action="person" data-id="${p.id}" aria-label="${p.full}, ${p.role}"><span class="portrait" style="background-position:${i*25}% 0"></span><span><strong>${p.name}</strong><small>${p.id==='rusty'?'Good company':'Mercer'}</small></span></button>`).join('');}
function panel(){
 const g=s.activity,n=node(s.node);
 if(s.mode==='packing')return group(`Six spaces. What comes with you? <span class="pill">${packCount()} / 6</span>`,`<p>Tools, a fishing rod, blankets, and basic food are aboard. Choose the rest.</p><div class="packing">${PACKING.map(i=>button('pack',i.id,`${i.icon} ${i.name} · ${i.slots}`,i.text,s.packed.includes(i.id)?'selected':'',`aria-pressed="${s.packed.includes(i.id)}"`)).join('')}</div>`,true)+group('The last three days',`<p>The Mercers left Everett after their home and work became subscriptions. Frank says there’s a place across the Line where a deed still means something.</p>`,false)+group('Keep one another going',`<div class="buttons">${button('depart',undefined,'Begin the pilgrimage','Reach Morrow before intake closes.','primary')}</div>`);
 if(s.mode==='stop'){
  let primary=button('activity','repair','▧ Repair van',s.fan?'Tire work restores condition.':'Cooling fan is failing.');
  if(n.salvage)primary=button('activity','salvage','▣ Salvage','Search, carry, keep what you recover.')+primary;
  if(n.fish)primary+=button('activity','fishing','⌁ Go fishing','Cast, reel, feed the family.');
  if(n.id==='pump'&&!s.sponsor)primary+=button('activity','repair','⚡ Restore the pump','Earn Glenn’s sponsorship.','primary','data-target="pump"');
  if(['freight','ridge'].includes(n.id)&&!s.cargo)primary+=button('delivery',undefined,'Take the delivery','Three spaces. Keep the filters above 45%.',!s.sponsor?'primary':'');
  if(s.cargo&&!s.flags.tarp)primary+=button('weatherproof',undefined,'Secure the filters','1.5 hours · protects against the storm.');
  if(n.id==='line')primary=button('gate',undefined,'Approach the crossing',s.hour>72?'Intake has closed.':s.sponsor?'Glenn has vouched for the Mercers.':s.cargo?`Filter delivery: ${Math.round(s.cargo.condition)}% · need 45%.`:'You still need a sponsor or delivery.','primary')+button('returnRidge',undefined,'Return to the ridge','5 hours · 5 fuel · find the convoy.')+button('outer',undefined,'Stay in the outer camp','End the journey safely outside Morrow.');
  return group(n.id==='line'?'Your place across the water':'Make this stop count',`<p>${n.desc}</p><div class="buttons">${primary}</div>`)+group('The road ahead',roads(s.node).length?`<div class="route-buttons">${roads(s.node).map(r=>button('travel',r.id,`<strong>${r.name} →</strong>`,`${r.hours} hours · ${r.fuel} fuel · ${r.wear} van wear<br>${r.text}`,'primary')).join('')}</div>`:`<p>The Morrow Compact protects this basin’s water, roads, and workshops. Admission is a written agreement. It isn’t a lottery.</p>`)+group('Family & supplies',`<div class="buttons">${button('meal',undefined,'Cook a meal','1 meal · +15 rest · +12 health')}${button('rest',undefined,'Sleep at camp','6 hours · +42 rest · +8 health')}${n.shop?button('shop',undefined,'Trade','Fuel, food, spare parts.'):''}${button('inventory',undefined,'Parts locker',`${slots(s)} / 7 spaces`)}</div>`)+group('Admission',`<p>${s.sponsor?'✓ Glenn Holt’s sponsorship is signed.':s.cargo?`✓ On the delivery manifest. Filters: ${Math.round(s.cargo.condition)}%. ${s.flags.tarp?'Covered and tied down.':'The crate is exposed.'}`:'Restore the Blackwater pump, or deliver filters for the Pruitts. Either gives your household a way in.'}</p>${s.packed.includes('radio')?'<p class="label">Frank’s radio: storm closure in '+count(72-s.hour)+' hours.</p>':''}`);
 }
 if(s.mode==='salvage'){
  const item=s.sites[s.node].find(i=>i.id===g.selected);
  return group(item?item.name:'Search the old machines',`<p>${item?`Condition: ${Math.max(25,item.quality-Math.round(g.damage))}%. Drag it to the van. Avoid the striped hazards.`:'Drag a marked item into the van. Every recovered part is real stock. Leave before the yard becomes unsafe.'}</p><div class="buttons">${item?button('carefulCarry',item.id,'Carry carefully','18 seconds · slower, safe extraction.'):button('selectNext',undefined,'Inspect next item','Tap a part in the scene, or select it here.')}${button('leaveActivity',undefined,'Back to the family',`${g.collected.length} items secured.`)}</div>`)+group('Parts aboard',`<div class="part-list">${inventoryHTML()}</div><p>Locker: ${slots(s)} / 7. A filter crate needs three spaces. Food and fuel go straight into supplies.</p>`);
 }
 if(s.mode==='repair'){
  let controls='';
  if(g.phase==='diagnose')controls=['fan','relay','tire'].map(id=>button('test',id,`Inspect ${id}`,g.tested.includes(id)?'Checked.':'Trace the fault.')).join('');
  if(g.phase==='replace')controls=button('fit',g.fault,`Fit ${PARTS[g.fault].name}`,`${s.parts[g.fault].length} spare${s.parts[g.fault].length===1?'':'s'} aboard.`,'primary',s.parts[g.fault].length?'':'disabled');
  if(g.phase==='connect')controls=[0,1,2].filter(i=>!g.connections.includes(i)).map(i=>button('chooseLead',String(i),`Lead ${['I','II','III'][i]}`,ui.wire?.index===i?'Selected · choose a socket.':'Pick up this loose lead.')).join('')+(ui.wire?[0,1,2].map(i=>button('socket',String(i),`Socket ${['I','II','III'][i]}`)).join(''):'');
  if(g.phase==='tune')controls=`<label for="tune">${g.fault==='tire'?'Lug wrench':'Regulator'} · aim between 58 and 76</label><input id="tune" type="range" min="0" max="100" value="${g.tune*100}" aria-label="${g.fault==='tire'?'Lug wrench':'Engine regulator'}">`;
  if(g.phase==='done')controls=button('leaveActivity',undefined,g.target==='pump'?'Take the signed papers':'Close the hood','The repair is complete.','primary');
  return group(g.target==='pump'?'Blackwater needs water':'Keep the old van alive',`<p>${g.notice}</p><div class="buttons">${controls}</div>`,true)+(g.phase!=='done'?group('Leave the hood open?',`<div class="buttons">${button('leaveActivity',undefined,'Return to the stop','Your repair progress stays in place.')}</div>`):'');
 }
 if(s.mode==='fishing')return group(g.phase==='hooked'?'Feel the line':'Read the water',`<p>${g.notice} ${g.phase==='hooked'?'Pull the rod away from the fish to reduce strain.':'Touch a fish, pull back, then release. You can also tap a ripple to cast.'}</p><div class="buttons">${g.phase==='hooked'?button('holdReel',undefined,'Hold to reel','Release below the red line.','primary hold'):button('castNearest',undefined,'Cast to a ripple','An accessible cast to the next visible fish.','primary')}${button('leaveActivity',undefined,'Head back',`${g.catch} meals landed.`)}</div>`)+group('One more for dinner',`<label for="rod">Rod position</label><input id="rod" type="range" min="0" max="100" value="${g.rod*100}" aria-label="Rod position"><p>The line needs slack when the fish runs. Keep reeling through too much strain and it will snap.</p>`);
 if(s.mode==='travel')return group('A little farther',`<p>${s.fan?'The old engine holds its note.':'The temperature gauge is climbing. A cooling fan would make these hills kinder.'} ${s.energy<25?'Everyone is tired. Rest at the next stop.':'Sarah unfolds the map. Ben watches the verge.'}</p><div class="buttons">${button('pause',undefined,'Pause the drive','The road will wait.')}</div>`,true);
 if(s.mode==='incident')return group(s.incident.title,`<p>${s.incident.body}</p><div class="buttons">${button('incident','careful',s.incident.help?'Stop and help':'Take care',`${s.incident.delay} hours · ${s.incident.help?'+2 meals':'avoid damage'}`,'primary')}${button('incident','push',s.incident.help?'Keep going':'Risk it',s.incident.help?'No delay. Leave the Navarros behind.':`${s.incident.damage} van damage${s.cargo?` · ${s.incident.cargo||0} filter damage`:''}${s.incident.health?' · family health cost':''}`)}</div>`,true);
 if(s.mode==='crossing')return group('Bring everyone across',`<p>Drag across the bridge to steer around the wreckage. Slow down when the gap is tight. The warm lights are real.</p><div class="buttons">${button('nudge','left','← Steer left')}${button('holdSlow',undefined,'Hold to slow','Release to accelerate.','hold')}${button('nudge','right','Steer right →')}</div>`,true);
 if(s.mode==='home')return group('Make yourselves at home',`<p>Four small things you never had permission to do. Touch the numbered places in the room.</p><div class="buttons">${HOME_POINTS.map(p=>button('homeItem',p.id,`${s.home.placed.includes(p.id)?'✓ ':''}${p.label}`,'',s.home.placed.includes(p.id)?'selected':'')).join('')}</div>`,true)+group('A place for the chair',`<p>${s.packed.includes('chair')?'Grandad’s chair made it all this way.':'The previous owner left a good armchair.'} Where does it belong?</p><div class="buttons">${button('homeSpot','window','By the window','',s.home.spot==='window'?'selected':'')}${button('homeSpot','workshop','By the workbench','',s.home.spot==='workshop'?'selected':'')}</div>`)+group('The first evening',`<div class="buttons">${button('finishHome',undefined,'Sit with the family',`${s.home.placed.length} / 4 things in place`,'primary',s.home.placed.length<4?'disabled':'')}</div>`);
 if(s.mode==='ending')return group(s.ending.title,`<p>${s.ending.text}</p>${s.ending.owned?`<div class="deed"><div class="label">MORROW COMPACT · RECORDED OWNERSHIP</div><h3>JACK & SARAH MERCER</h3><p>One home. A garden. A place to work with your hands.<br>No rent. No employer tied to your door. Local dues are public, voted on, and capped by the charter.</p><p>${s.packed.includes('chair')?'Grandad’s chair':'Your armchair'} sits ${s.home.spot==='window'?'beside the window':'by the workbench'}. Ben wants to learn the pump. Annie and Rusty are choosing a room.</p></div>`:''}<p>${s.stats.salvaged} items recovered · ${s.stats.fish} fish landed · ${s.stats.repairs} repairs completed · ${count(s.hour)} hours</p><div class="buttons">${button('newConfirm',undefined,'Another pilgrimage','Try the other road.','primary')}${button('journal',undefined,'Read the journey')}</div>`,true);
 return '';
}
function inventoryHTML(){return Object.entries(s.parts).map(([id,list])=>`<span class="pill">${PARTS[id].name}: ${list.length}${list.length?' · '+list.map(q=>q+'%').join(', '):''}</span>`).join('')+(s.cargo?`<span class="pill">Filters: ${Math.round(s.cargo.condition)}% · 3 spaces</span>`:'');}
function drawUI(force=false){
 document.body.classList.toggle('title',ui.title);$('opening').hidden=!ui.title;
 if(ui.title){const key='title'+!!saved;if(force||panelKey!==key){$('opening').innerHTML=`<div class="label">A SURVIVAL PILGRIMAGE</div><h1>Somewhere,<br><em>still ours.</em></h1><p>A family. A failing van. Three days to a place where you can own a home, fix what breaks, and choose your own life.</p><div class="buttons">${saved?button('resume',undefined,'Continue the journey','','primary'):''}${button('new',undefined,saved?'Start fresh':'Play Common Road','',saved?'':'primary','id="start"')}</div><div class="legacy">THE LINE · PLAYABLE CHAPTER 03<br><a href="v02/">Open the earlier journey / v0.2 save</a></div>`;panelKey=key;}return;}
 const res=[['INTAKE',count(72-s.hour),'hrs',s.hour>60],['FUEL',count(s.fuel),'/ 50',s.fuel<10],['MEALS',count(s.meals),'family',s.meals<2],['REST',Math.round(s.energy),'%',s.energy<25],['HEALTH',Math.round(s.health),'%',s.health<35],['VAN',Math.round(s.condition),'%',s.condition<30],['CASH','$'+s.cash,'',s.cash<30]];
 const rk=JSON.stringify(res);if(rk!==resourceKey){$('resources').innerHTML=res.map(([label,v,u,warn])=>`<div class="resource ${warn?'warn':''}"><span>${label}</span><strong>${v}</strong><small>${u}</small></div>`).join('');resourceKey=rk;}
 const g=s.activity;const key=JSON.stringify([s.mode,s.node,g?.phase,g?.selected,g?.connections,g?.notice,g?.catch,s.packed,s.parts,s.cargo,s.sponsor,s.home,s.flags,s.cash,ui.wire?.index]);
 if(force||key!==panelKey){const active=document.activeElement;const token=active?.dataset?.action?[active.dataset.action,active.dataset.id]:null;const id=active?.id;$('actions').innerHTML=panel();panelKey=key;if(token){const el=[...$('actions').querySelectorAll('button')].find(x=>x.dataset.action===token[0]&&x.dataset.id===token[1]);el?.focus({preventScroll:true});}else if(id&&$(id)&&document.activeElement===document.body)$(id).focus({preventScroll:true});}
 if($('notice').textContent!==s.message)$('notice').textContent=s.message;
 const title=s.mode==='packing'?'Everything we can carry':s.mode==='salvage'?'Nothing here is useless':s.mode==='repair'?(g.target==='pump'?'Bring the water back':'A machine worth saving'):s.mode==='fishing'?'Dinner is out there':s.mode==='crossing'?'The last crossing':s.mode==='home'?'A door of our own':s.mode==='ending'?s.ending.title:s.mode==='travel'||s.mode==='incident'?s.road.name:node(s.node).name;
 const region=s.mode==='home'||s.ending?.owned?'MORROW · THE FIRST EVENING':s.mode==='packing'?'THE MERCER HOUSEHOLD':node(s.node).region;
 const heading=`<div class="eyebrow">${region}</div><h1>${title}</h1>`;if($('sceneheading').innerHTML!==heading)$('sceneheading').innerHTML=heading;
 let status='',hint='';
 if(s.mode==='salvage'){status=bars(`${Math.ceil(100-g.elapsed)} seconds of daylight`,1-g.elapsed/100)+`Part damage: ${Math.round(g.damage)}%`;hint='DRAG A PART → AVOID THE STRIPES → DROP AT THE VAN';}
 if(s.mode==='repair'){status=`${['diagnose','replace','connect','tune','done'].indexOf(g.phase)+1} / 5 · ${g.phase.toUpperCase()}`;hint=g.phase==='connect'?'MATCH I → I, II → II, III → III':g.phase==='tune'?'KEEP THE NEEDLE INSIDE THE BRASS BAND':'';}
 if(s.mode==='fishing'){status=bars(`LINE STRAIN · ${Math.round(g.tension*100)}%`,g.tension,g.tension>.78?'red':'')+bars(`LANDED · ${Math.round(g.progress*100)}%`,g.phase==='hooked'?g.progress:0)+`${Math.ceil(90-g.elapsed)} seconds · ${g.catch} meals`;hint=g.phase==='hooked'?(g.tension>.78?'LET IT RUN · RELEASE TO GIVE SLACK':'HOLD TO REEL · RELEASE TO EASE THE LINE'):'TOUCH A RIPPLE · PULL BACK · RELEASE';}
 if(s.mode==='travel'){status=bars('ON THE ROAD',s.road.elapsed/s.road.duration);hint=`${s.road.hours} hours of travel · ${s.road.fuel} fuel`;}
 if(s.mode==='crossing'){status=bars('THE FAR BANK',g.distance)+`${g.speed<.5?'SLOW':'CRUISING'} · ${g.hits.length} scrapes`;hint='DRAG TO STEER · AVOID THE BROKEN TIMBERS';}
 if(s.mode==='home'){status=`${s.home.placed.length} / 4 · MAKING IT OURS`;hint=s.home.placed.length===4?'THE FAMILY IS WAITING AT THE TABLE':'TOUCH A NUMBER TO SETTLE IN';}
 const sk=status+hint;if(sk!==statusKey){$('scenestatus').innerHTML=status;$('scenehint').textContent=hint;statusKey=sk;}
}
function modal(kind,content){resetInput();ui.paused=true;ui.dialog=kind;$('dialogbody').innerHTML=content+`<div class="buttons">${button('close',undefined,'Back to the journey','','primary')}</div>`;if(!$('dialog').open)$('dialog').showModal();$('dialog').querySelector('button')?.focus();persist();}
function closeModal(){if($('dialog').open)$('dialog').close();ui.paused=false;ui.dialog=null;drawUI(true);}
function openPause(){modal('pause',`<div class="label">THE ROAD CAN WAIT</div><h2>Take a breath.</h2><p>Your journey is saved on this device. Time stops while this panel is open.</p><div class="buttons">${button('title',undefined,'Opening screen')}${button('help',undefined,'Controls')}${button('sound',undefined,audioOn?'Mute sound':'Enable quiet sound')}${button('fullscreen',undefined,'Full screen')}</div>${s.mode==='stop'?`<div class="buttons">${button('aid',undefined,'Ask for emergency help','Once per journey · 4 hours, if supplies are low.')}${button('rescueConfirm',undefined,'Call relief transport','Ends this attempt safely.','danger')}</div>`:''}`);}
function showMap(){const map=`<svg class="route-map" viewBox="0 0 650 320" role="img" aria-label="Two roads to Morrow: pump sponsorship or freight delivery">${ROADS.map(r=>{const a=node(r.from),b=node(r.to);return `<line x1="${60+a.x*530}" y1="${15+a.y*270}" x2="${60+b.x*530}" y2="${15+b.y*270}" stroke="#647870" stroke-width="3"/>`;}).join('')}${NODES.map(n=>`<circle cx="${60+n.x*530}" cy="${15+n.y*270}" r="${n.id===s.node?9:5}" fill="${n.id===s.node?'#f6c77c':'#8aaa9e'}"/><text x="${60+n.x*530+13}" y="${15+n.y*270+4}">${n.id==='pump'?'Pump house':n.id==='freight'?'Freight stop':n.id==='yard'?'Service yard':n.name}</text>`).join('')}</svg>`;modal('map',`<div class="label">THE FINAL LEG · FICTIONAL OZARK ROUTE</div><h2>All roads ask something.</h2>${map}<p><strong>Repair road:</strong> restore Glenn’s pump with a relay. His household sponsorship follows you.</p><p><strong>Convoy road:</strong> carry the Pruitts’ filters in three locker spaces. Deliver at least 45% intact.</p><p><strong>The Line:</strong> a controlled reservoir crossing, backed by a network of towns and repair crews. Storm intake closes after 72 hours.</p>`);}
function showShop(){modal('shop',`<div class="label">CASH $${s.cash} · LOCKER ${slots(s)} / 7</div><h2>Keep something in reserve.</h2><div class="buttons">${[['fuel','14 fuel','$50'],['food','4 family meals','$30'],['fan','Cooling fan','$55'],['relay','Power relay','$45'],['tire','Spare tire','$50']].map(([id,t,c])=>button('buy',id,t,c)).join('')}</div><h3>Trade a spare · $25 each</h3><div class="buttons">${Object.keys(PARTS).map(id=>button('sell',id,PARTS[id].name,`${s.parts[id].length} aboard`,'',s.parts[id].length?'':'disabled')).join('')}</div>`);}
function showHelp(){modal('help',`<div class="label">COMMON ROAD · THE LINE</div><h2>Get your family home.</h2><p>Repair or resupply at each stop, then choose a road. Travel consumes fuel, food, rest, and van condition. Red supplies need attention.</p><h3>Hands on</h3><p><strong>Salvage:</strong> drag a marked item around striped hazards into the van. A careful carry is slower but safe. Each yard has finite stock.</p><p><strong>Repair:</strong> inspect a fault, fit a spare, connect matching terminals, then slide into the brass band for four seconds.</p><p><strong>Fishing:</strong> pull back from a fish and release to cast. Hold to reel; release near red strain. Move the rod away from the fish to ease its pull.</p><p><strong>Crossing:</strong> steer around broken timbers. Slow down for tight gaps.</p><h3>Touch, controller, keyboard</h3><p>Every scene also has large controls below it. Controller D-pad moves focus, A selects, B goes back, Start pauses. Left stick moves the scene cursor or steers; hold A to carry/reel. Keyboard Tab/Enter selects, arrows steer, Space reels, Escape pauses, F opens full screen.</p><p>Progress saves in this browser. This playtest has no cloud saves. The older v0.2 journey is preserved from the opening screen.</p>`);}
let audioOn=false,audioCtx=null;
function sound(){if(!audioOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),gain=audioCtx.createGain();o.type='sine';o.frequency.value=s.mode==='home'?330:180;gain.gain.setValueAtTime(.022,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.16);o.connect(gain).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.18);}catch{}}
function perform(type,id,target){
 if(type==='new'){if(saved)modal('new',`<h2>Start another pilgrimage?</h2><p>This replaces the v0.3 journey saved in this browser. Your older v0.2 save is separate.</p>${button('confirmNew',undefined,'Start fresh','','danger')}`);else startNew();return;}
 if(type==='newConfirm'){modal('new',`<h2>Take another road?</h2><p>The next pilgrimage replaces this local save.</p>${button('confirmNew',undefined,'Start fresh','','primary')}`);return;}
 if(type==='confirmNew'){startNew();return;}if(type==='resume'){resume();return;}
 if(type==='close'){closeModal();return;}if(type==='pause'){openPause();return;}
 if(type==='title'){closeModal();ui.title=true;persist();drawUI(true);return;}
 if(type==='fullscreen'){document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{});return;}
 if(type==='help'){showHelp();return;}if(type==='shop'){showShop();return;}
 if(type==='sound'){audioOn=!audioOn;sound();openPause();return;}
 if(type==='journal'){modal('journal',`<h2>What we carried.</h2>${s.journal.length?s.journal.map(e=>`<div class="journal-entry"><div class="label">${e.hour} HOURS INTO THE FINAL LEG</div><h3>${esc(e.title)}</h3><p>${esc(e.body)}</p></div>`).join(''):'<p>The final leg is still ahead.</p>'}`);return;}
 if(type==='inventory'){modal('inventory',`<h2>What’s in the van.</h2><div class="part-list">${inventoryHTML()}</div><p>${slots(s)} / 7 locker spaces. A filter delivery needs three.</p><h3>What you brought</h3><p>${s.packed.map(id=>PACKING.find(i=>i.id===id).name).join(' · ')}</p>`);return;}
 if(type==='person'){const p=FAMILY.find(p=>p.id===id);modal('person',`<h2>${p.full}</h2><div class="portrait" style="width:110px;height:150px;background-position:${FAMILY.indexOf(p)*25}% 0"></div><p>${p.role}</p><p>“${p.line}”</p>`);return;}
 if(type==='rescueConfirm'){modal('rescue',`<h2>Leave the van?</h2><p>Relief transport takes the family to safety. This ends the pilgrimage.</p>${button('rescue',undefined,'End this attempt','','danger')}`);return;}
 if(['buy','sell'].includes(type)){dispatch({type,id});const msg=s.message||$('notice').textContent;showShop();$('dialogbody').insertAdjacentHTML('afterbegin',`<p role="status">${esc(msg)}</p>`);return;}
 if(type==='chooseLead'){ui.wire={index:Number(id),x:.25,y:.44+Number(id)*.13};drawUI(true);return;}
 if(type==='socket'){if(ui.wire){dispatch({type:'connect',from:ui.wire.index,to:Number(id)});ui.wire=null;drawUI(true);}return;}
 if(type==='selectNext'){const items=s.sites[s.node].filter(i=>!i.taken);if(items.length){let ix=items.findIndex(i=>i.id===s.activity.selected);dispatch({type:'inspect',id:items[(ix+1)%items.length].id});}return;}
 if(type==='carefulCarry'){if(s.activity.elapsed+18>=s.activity.duration){s.message='Not enough daylight for a careful carry. Bring it out yourself or head back.';drawUI();return;}s.activity.elapsed+=18;dispatch({type:'take',id});return;}
 if(type==='castNearest'){const f=s.activity.fish.find(f=>!f.caught);if(f)dispatch({type:'cast',x:f.x,y:f.y});return;}
 if(type==='nudge'){dispatch({type:'steer',value:s.activity.target+(id==='left'?-.18:.18)});return;}
 if(['holdReel','holdSlow'].includes(type))return;
 if(['aid','rescue'].includes(type))closeModal();
 dispatch({type,id,target});sound();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)perform(b.dataset.action,b.dataset.id,b.dataset.target);});
$('pause').onclick=openPause;$('map').onclick=showMap;$('journal').onclick=()=>perform('journal');$('help').onclick=showHelp;
$('dialog').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
document.addEventListener('input',e=>{if(e.target.id==='tune')dispatch({type:'tune',value:Number(e.target.value)/100});if(e.target.id==='rod')dispatch({type:'reel',value:s.activity.reel,x:Number(e.target.value)/100});});
function point(e){const r=canvas.getBoundingClientRect();return {x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1)};}
function at(p){return [...ui.hits].reverse().find(hit=>Math.hypot((p.x-hit.x)*canvas.clientWidth,(p.y-hit.y)*canvas.clientHeight)<hit.r);}
function sceneDown(p){if(ui.title||ui.paused)return;const h=at(p),g=s.activity;
 if(s.mode==='salvage'&&h?.type==='item'){dispatch({type:'inspect',id:h.id});s.activity.carry=h.id;ui.drag={...p,lastX:p.x,lastY:p.y};}
 if(s.mode==='repair'){
  if(g.phase==='diagnose'&&h?.type==='part')dispatch({type:'test',id:h.id});
  else if(g.phase==='replace'&&h?.id===g.fault)dispatch({type:'fit',id:g.fault});
  else if(g.phase==='connect'&&h?.type==='lead')ui.wire={index:h.index,...p};
  else if(g.phase==='tune'&&p.y>.42&&p.y<.7)dispatch({type:'tune',value:(p.x-.18)/.64});
 }
 if(s.mode==='fishing'){if(g.phase==='hooked')dispatch({type:'reel',value:true,x:p.x});else ui.cast={...p,lastX:p.x,lastY:p.y};}
 if(s.mode==='crossing')dispatch({type:'steer',value:p.x});
 if(s.mode==='home'&&h)dispatch({type:'homeItem',id:h.id});
}
function sceneMove(p){if(ui.title||ui.paused)return;
 if(ui.drag&&s.mode==='salvage'){
  const old={x:ui.drag.x,y:ui.drag.y},distance=Math.hypot(p.x-old.x,p.y-old.y);let hazardous=0;
  for(let i=1;i<=12;i++){const x=old.x+(p.x-old.x)*i/12,y=old.y+(p.y-old.y)*i/12;if(HAZARDS.some(z=>x>z.x-.02&&x<z.x+z.w+.02&&y>z.y-.035&&y<z.y+z.h+.035))hazardous++;}
  s.activity.damage=clamp(s.activity.damage+hazardous*distance*18,0,75);ui.drag={...ui.drag,...p};
 }
 if(ui.wire){ui.wire={...ui.wire,...p};}
 if(ui.cast){ui.cast.lastX=p.x;ui.cast.lastY=p.y;}
 if(s.mode==='fishing'&&s.activity.reel)s.activity.rod=p.x;
 if(s.mode==='repair'&&s.activity.phase==='tune'&&p.y>.4&&p.y<.73)dispatch({type:'tune',value:(p.x-.18)/.64});
 if(s.mode==='crossing')dispatch({type:'steer',value:p.x});
}
function sceneUp(p,cancel=false){
 if(ui.drag&&s.mode==='salvage'){const id=s.activity.carry;if(!cancel&&p.x>=.5&&p.x<=.84&&p.y>=.765&&p.y<=.875)dispatch({type:'take',id});else{s.activity.carry=null;s.message=cancel?'Carry canceled. The part is still in the yard.':'Drop inside the green van bay. The part stays here until secured.';}ui.drag=null;}
 if(ui.wire&&s.mode==='repair'){const h=at(p);if(!cancel&&h?.type==='socket')dispatch({type:'connect',from:ui.wire.index,to:h.index});ui.wire=null;}
 if(ui.cast&&s.mode==='fishing'){if(!cancel)dispatch({type:'cast',x:ui.cast.x,y:ui.cast.y});ui.cast=null;}
 if(s.mode==='fishing')dispatch({type:'reel',value:false});drawUI(true);
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
window.addEventListener('blur',()=>{resetInput();if(!ui.title&&!ui.paused)openPause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();if(!ui.title&&!ui.paused)openPause();persist();}});
window.addEventListener('pagehide',()=>{if(!ui.title)persist();});
function focusStep(dir){const root=$('dialog').open?$('dialog'):document;const choices=[...root.querySelectorAll('button:not(:disabled),a,input')].filter(e=>e.getClientRects().length);let i=choices.indexOf(document.activeElement);choices[(i+dir+choices.length)%choices.length]?.focus();}
const keys=new Set();
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();ui.dialog?closeModal():!ui.title&&openPause();return;}
 if(e.key.toLowerCase()==='f'&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();perform('fullscreen');return;}
 if(ui.paused||ui.title)return;
 if(['ArrowLeft','ArrowRight'].includes(e.key)&&s.mode==='crossing'){e.preventDefault();keys.add(e.key);}
 if(e.code==='Space'&&(s.mode==='fishing'&&s.activity.phase==='hooked'||s.mode==='crossing')){e.preventDefault();dispatch({type:s.mode==='fishing'?'reel':'slow',value:true});}
});
document.addEventListener('keyup',e=>{keys.delete(e.key);if(e.code==='Space'){if(s.mode==='fishing')dispatch({type:'reel',value:false});if(s.mode==='crossing')dispatch({type:'slow',value:false});}});
let prevButtons=[],padWasScene=false;
function gamepad(dt){const pad=[...(navigator.getGamepads?.()||[])].find(p=>p?.connected);if(!pad){prevButtons=[];return;}const b=pad.buttons.map(x=>x.pressed);const edge=i=>b[i]&&!prevButtons[i];
 if(edge(9))ui.dialog?closeModal():openPause();
 if(edge(1)){if(ui.dialog)closeModal();else if(s.activity&&!['home','crossing'].includes(s.mode)){resetInput();dispatch({type:'leaveActivity'});}else openPause();}
 if(edge(12)||edge(14))focusStep(-1);if(edge(13)||edge(15))focusStep(1);
 const ax=pad.axes[0]||0,ay=pad.axes[1]||0,moving=Math.hypot(ax,ay)>.18;
 if(!ui.title&&!ui.paused&&moving){
  if(s.mode==='crossing')s.activity.target=clamp(s.activity.target+ax*dt*.6,.12,.88);
  else if(['salvage','repair','fishing'].includes(s.mode)&&document.activeElement?.tagName!=='INPUT'){ui.padCursor??={x:.5,y:.5};ui.padCursor.x=clamp(ui.padCursor.x+ax*dt*.4,.04,.96);ui.padCursor.y=clamp(ui.padCursor.y+ay*dt*.4,.2,.88);canvas.focus({preventScroll:true});if(b[0])sceneMove(ui.padCursor);}
 }
 if(edge(0)){if(document.activeElement===canvas&&ui.padCursor&&!ui.paused){sceneDown(ui.padCursor);padWasScene=true;}else{const active=document.activeElement;if(active?.dataset.action==='holdReel'||active?.dataset.action==='holdSlow'){dispatch({type:active.dataset.action==='holdReel'?'reel':'slow',value:true});}else if(active?.tagName==='INPUT'){active.value=Number(active.value)+10;active.dispatchEvent(new Event('input',{bubbles:true}));}else active?.click();}}
 if(!b[0]&&prevButtons[0]){if(padWasScene){sceneUp(ui.padCursor);padWasScene=false;}else{if(s.mode==='fishing')dispatch({type:'reel',value:false});if(s.mode==='crossing')dispatch({type:'slow',value:false});}}
 if(!ui.paused&&document.activeElement?.tagName==='INPUT'&&moving){const el=document.activeElement;el.value=clamp(Number(el.value)+ax*dt*50,0,100);el.dispatchEvent(new Event('input',{bubbles:true}));}
 prevButtons=b;
}
function tick(dt){if(!ui.title&&!ui.paused){update(s,dt);saveClock+=dt;if(saveClock>2){persist();saveClock=0;}}}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;gamepad(dt);if(!manual){if(s.mode==='crossing'&&!ui.paused){const dir=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0);s.activity.target=clamp(s.activity.target+dir*dt*.55,.12,.88);}tick(dt);}drawUI();render(canvas,s,ui);requestAnimationFrame(frame);}
window.render_game_to_text=()=>JSON.stringify({...summary(s),mode:ui.title?'intro':s.mode,storedMode:s.mode,overlay:ui.dialog,paused:ui.paused,coordinates:'Scene x and y are normalized 0..1 from the top left; r is a CSS-pixel hit radius.',hitTargets:ui.hits,weatherRadio:s.packed.includes('radio'),controls:[...document.querySelectorAll('button:not(:disabled)')].filter(x=>x.getClientRects().length).map(x=>({action:x.dataset.action||x.id,id:x.dataset.id,label:x.innerText}))});
window.advanceTime=ms=>{manual=true;for(let t=0;t<ms;t+=1000/60)tick(Math.min(1000/60,ms-t)/1000);drawUI();render(canvas,s,ui);if(!ui.title)persist();};
window.artReady=ready;
drawFamily();drawUI(true);ready.then(()=>render(canvas,s,ui));requestAnimationFrame(frame);
if('serviceWorker'in navigator&&!['localhost','127.0.0.1'].includes(location.hostname))navigator.serviceWorker.register('./sw.js').catch(()=>{$('save-status').textContent='Saved locally · offline cache unavailable';});
