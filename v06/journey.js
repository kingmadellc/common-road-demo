const shot=(image,title,line,extra={})=>({image,title,line,...extra});
export const SHOTS={
 cabin:shot('night-family','One room, no login','Annie: “At the new place, can the house kick us out?”'),
 roadside:shot('plaza','Service suspended','Jack: “A wrench and a lamp. Best customer support we’ve had in years.”'),
 dinner:shot('meal-family','Food we caught ourselves','Ben: “Food from a river. Terms and conditions: cook it.”'),
 family:shot('familyPhoto','Everyone who needs to make it','Sarah: “We look like hell. Keep it. We earned this one.”'),
 collectors:shot('squad','Workforce recovery','The city calls it a return to stability. The families call it being taken back.'),
 relief:shot('night-family','No lights behind us','Sarah: “They took the other road. Breathe.”'),
 home:shot('basin','The basin keeps its own lights on','A reservoir. Local switches. Paper deeds. The right to fix your own mistakes.'),
 plaza:shot('plaza','The last service stall','Old pumps. One working lamp. Someone who knows how to fix things.'),
 toll:shot('toll','The road remembers your plate','A private gantry. Public roads, rented back by the mile.'),
 campus:shot('campus','Your future has been discontinued','The shuttle still arrives. The doors stopped opening last winter. Excellent attendance figures.'),
 market:shot('market','A different kind of currency','A working relay buys more respect here than a verified account.'),
 seized:shot('seized','They take the home, too','The camper is headed east. Its owners are in the transport behind it.'),
 scanner:shot('scanner','A name in the registry','The scan stays on file. It does not tell them which road you take next.'),
 inventory:shot('inventory','Property retained','Keys, papers, shoes. An entire household reduced to an inventory.'),
 blocked:shot('blocked','The exit is occupied','The truck shuts down. The white work lights stay on.'),
 mirror:shot('mirror','Sarah checks the mirror again','Amber lights, two miles back. She waits for the next county turn.'),
 repair:shot('repair-family','Something Ben can learn','Jack: “A broken wire. Finally, a problem without a help desk.”'),
 night:shot('night-family','The quiet in the back seat','Annie: “If we get there, can we leave the lights on because we want to?”'),
 'film-highway':shot('highway','County line','The interstate cuts across the country. Keep the van moving.',{film:'highway'}),
 'film-viaduct':shot('logistics','Under the freight viaduct','The trains stopped. The road found a way around.',{film:'viaduct'}),
 'film-rain':shot('plaza','The weather is catching up','Rain moves across the shuttered service yard.',{film:'rain'}),
 'film-overtake':shot('seized','Let them pass','An amber bar in the mirror. Sarah eases off.',{film:'overtake'}),
 'film-scanner':shot('scanner','White light across the window','Another household. Another scan. Keep looking forward.',{film:'scanner'}),
 'film-barrier':shot('blocked','A lane closes behind you','The barrier drops. Find the road that is still open.',{film:'barrier'})
};
export function showStory(s,id,returnMode='stop'){s.story={id,returnMode,elapsed:0};s.mode='story';if(!s.reel.seen.includes(id))s.reel.seen.push(id);if(!s.reel.gallery.includes(id))s.reel.gallery.push(id);}
export function roadShots(s,r){const ids=r.id==='opening'?['film-highway','cabin']:r.id==='r1'?['film-viaduct',s.threat.identified?'mirror':'plaza']:r.id==='r2'?['market','repair']:r.id==='r3'?['film-scanner','campus']:r.id==='r4'?['film-rain',s.flags.fishDinner?'dinner':'night']:r.id==='r5'?['film-overtake',s.threat.identified?'inventory':'seized']:r.id==='r6'?['film-barrier','home']:['toll','family'];return ids.map((id,i)=>({id,at:i?17:5,shown:false}));}
export function updateReel(s,dt){const r=s.road;if(!r)return;if(r.shot){r.shot.elapsed+=dt;if(r.shot.elapsed>=3)r.shot=null;return;}const next=r.shots?.find(x=>!x.shown&&r.elapsed>=x.at);if(next){next.shown=true;r.shot={id:next.id,elapsed:0};if(!s.reel.gallery.includes(next.id))s.reel.gallery.push(next.id);}}
export function landscapeFor(r){const sequence=r?.kind==='storm'?['storm','highway','storm','prairie']:r?.kind==='rough'?['prairie','storm','prairie','highway']:['highway','logistics','prairie','highway'];return sequence[Math.floor((r?.elapsed||0)/4)%sequence.length];}
