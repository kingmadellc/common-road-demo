import {STILL_ROADS,claimNarrative,mediaMemory,narrativeKey} from './media.js?v=0.8.9-sequence-1';
import {RADIO_MESSAGE} from './narrative.js?v=0.8.9-sequence-1';
const shot=(image,title,line,extra={})=>({image,title,line,...extra});
export const ARRIVALS={river:'sierra-letter',desert:'nevada-room',divide:'ben-wrench',plains:'frank-letter',ridge:'frank-key'};
export const SHOTS={
 'pump-work':shot('pump-work','The water keeps running','Glenn signs the papers. Ben leaves his hand on the pipe, feeling the water move. “You can hear when it’s working,” he says. Jack nods. No progress bar needed.'),
 'filter-load':shot('filter-delivery','Something useful to carry','Wes checks the manifest while Linda helps Ben settle the filters. “If a road looks bad, it is,” she says. Jack adds another strap.'),
 'hunt-dinner':shot('hunt-meal','A meal nobody can switch off','Sarah passes Jack a bowl. His hands are still shaking a little. Annie leaves room for Rusty. “Does June’s stove have an account?” Ben asks. “It has a knob,” Jack says. Nobody reaches for a screen.'),
 'bea-first':shot('bea-road','Back to Bea','Sarah: “She gave Ben the radio. She might know more. First, we get everyone there.”'),
 broadcast:shot('opening-radio','Ben’s handwritten broadcast',RADIO_MESSAGE),
 'sierra-letter':shot('witness','The first witness','June shows Sarah a recent photo of Uncle Frank beside a crooked fence. “He built that. No software could make it that bad.” Ben unfolds his radio note. Sarah checks the date twice. “He looks well. When did you see him?”'),
 'nevada-room':shot('room-key','A room without permission','Ruth hands Sarah a brass key. Sarah looks for the room camera. “Just a smoke alarm,” Ruth says. Sarah turns the key twice. “Could we stay?” Ruth looks toward the highway. “I own the lock. Safety still owns the road.”'),
 'ben-wrench':shot('headlamp','Something that stays fixed','Ben gets the headlamp working. No service license required. Jack listens while he explains it. Ben grins for a moment, then tries to hide it. The skill belongs to him.'),
 'frank-letter':shot('reply','It is really him','The courier transcribed Frank’s radio reply. It answers the private question Sarah sent through Bea. Four people and Rusty. The homestead fund has bought an empty house from a willing seller. Frank has reserved it for this intake. Glenn can witness the papers; the Pruitts can assign a filter delivery. The rumor is now an agreement.'),
 'frank-key':shot('reunion','The man from the letter','Frank is older than Sarah remembers. He holds out a key for her to see. “Evelyn finishes the papers. I wanted you to know it’s real.” Sarah closes the distance between them. The storm is coming. One last crossing.'),
 'desert-view':shot('plateau','Nevada has room to spare','Ben: “All this space and we rented a cupboard.” Sarah: “The cupboard had excellent connectivity.”'),
 'divide-view':shot('annie-sky','Over the Divide','Wyoming wind. Miles of open country. Annie falls quiet, trying to fit it all into a drawing.'),
 'plains-view':shot('prairie','The country opens up','The grain elevators have numbers painted on them. Nobody has asked the van to authenticate for an hour.'),
 cabin:shot('room-key','One room, no login','Annie: “Can they turn this room off?” Sarah: “Not with a key like this.”'),
 roadside:shot('plaza','Service suspended','Jack: “A wrench and a lamp. Best customer support we’ve had in years.”'),
 dinner:shot('meal-family','Food we caught ourselves','Ben: “Food from a river. Terms and conditions: cook it.” Sarah checks no price, no rating, no account. She asks for seconds.'),
 family:shot('open-country','Something worth keeping','Sarah: “Take that one. I want to remember there was more than the road.”'),
 wonder:shot('annie-sky','More sky than we remembered','Annie: “Was all this here the whole time?”'),
 collectors:shot('squad','Workforce recovery','Safety calls it household recovery. A restricted household leaving its assigned district gives the Collectors their paperwork. The people in the transport call it being dragged home.'),
 relief:shot('mirror','No lights behind us','Sarah: “They took the other road. Breathe.”'),
 home:shot('basin','The basin keeps its own lights on','Water turns the wheels. Mechanical switches run the lights. No phones or computers beyond the Line. Ben has carried those words since the night he found them.'),
 plaza:shot('plaza','The last service stall','Old pumps. One working lamp. Someone who knows how to fix things.'),
 toll:shot('toll','The road remembers your plate','A private gantry. Public roads, rented back by the mile.'),
 campus:shot('campus','Your future has been discontinued','Work’s billboard says “Your next assignment is ready.” Beneath it, an ID camera counts faces. Sarah: “Lovely. The building still remembers us.”'),
 market:shot('market','A different kind of currency','A working relay buys more respect here than a verified account.'),
 seized:shot('seized','They take the home, too','The camper is being towed back toward a company city. Its owners are in the transport behind it. Their return order has acquired a transport fee.'),
 scanner:shot('scanner','A name in the registry','The scan stays on file. It does not tell them which road you take next.'),
 inventory:shot('inventory','Property retained','Keys, papers, shoes. An entire household reduced to an inventory.'),
 blocked:shot('blocked','The exit is occupied','The truck shuts down. The white work lights stay on.'),
 mirror:shot('mirror','Sarah checks the mirror again','Amber lights, two miles back. She waits for the next county turn.'),
 repair:shot('repair-family','Something Ben can learn','Jack: “A loose belt. Finally, a problem without a help desk.”'),
 night:shot('night-watch','The quiet between stops','Jack reaches for a work screen that is not there. Sarah notices. “Give it a minute.” Outside, somebody is fixing a generator by lamplight.'),
 'film-highway':shot('highway','County line','The interstate cuts across the country. Keep the van moving.',{film:'highway'}),
 'film-viaduct':shot('logistics','Under the freight viaduct','The trains stopped. The road found a way around.',{film:'viaduct'}),
 'film-rain':shot('plaza','The weather is catching up','Rain moves across the shuttered service yard.',{film:'rain'}),
 'film-overtake':shot('seized','Let them pass','An amber bar in the mirror. Sarah eases off.',{film:'overtake'}),
 'film-scanner':shot('scanner','White light across the window','Another household. Another scan. Keep looking forward.',{film:'scanner'}),
 'film-barrier':shot('blocked','A lane closes behind you','The barrier drops. Find the road that is still open.',{film:'barrier'})
};
// Timed road cuts last three seconds. Full passages remain available in the
// journal/gallery and held story scenes, including the shared dinner scene.
const roadLines={
 'bea-first':'Sarah: “Back to Bea. She gave him the radio.”',
 'desert-view':'Ben: “We paid rent for a cupboard.”',
 'divide-view':'Annie tries to fit Wyoming into one drawing.',
 'plains-view':'An hour without a scanner.',
 wonder:'Annie: “Was all this here the whole time?”',
 night:'Sarah: “Give it a minute.”',
 mirror:'Amber lights. Wait for the county turn.',
 market:'A relay buys more than an account here.',
 repair:'Jack: “Finally. No help desk.”',
 campus:'Sarah: “The building still remembers us.”',
 dinner:'Sarah asks for seconds.',
 inventory:'Keys, papers, shoes. One household.',
 seized:'The family is in the transport behind.',
 home:'Ben: “No screens. He meant it.”',
 toll:'Public roads, rented back by the mile.',
 family:'Sarah: “Take that one. I want to remember.”',
 'film-highway':'Keep the van moving.',
 'film-viaduct':'The trains stopped. The road found a way.',
 'film-rain':'Rain reaches the shuttered yard.',
 'film-overtake':'Sarah eases off. Let them pass.',
 'film-scanner':'Another scan. Keep looking forward.',
 'film-barrier':'The barrier drops. One lane is still open.'
};
for(const [id,line] of Object.entries(roadLines)){SHOTS[id].journal=SHOTS[id].line;SHOTS[id].line=line;}
export function showStory(s,id,returnMode='stop'){
 if(!claimNarrative(s,SHOTS[id],SHOTS)){s.story=null;s.mode=returnMode;return false;}
 s.story={id,returnMode,elapsed:0};s.mode='story';if(!s.reel.seen.includes(id))s.reel.seen.push(id);if(!s.reel.gallery.includes(id))s.reel.gallery.push(id);return true;
}
export function roadShots(s,r){
 const schedule={opening:['bea-first','film-highway'],r1:['film-viaduct','mirror'],'desert-road':['seized'],'divide-road':['night','divide-view'],'plains-road':['family'],r2:['repair'],r3:['inventory'],r4:['film-rain'],r5:['film-overtake'],r6:['home'],recovery:[]};
 const seen=mediaMemory(s,SHOTS);return (schedule[r.id]||[]).filter(id=>!seen.includes(narrativeKey(SHOTS[id]))).map((id,i)=>({id,at:i?17:5,shown:false}));
}
export function updateReel(s,dt){const r=s.road;if(!r)return;if(r.shot){r.shot.elapsed+=dt;if(r.shot.elapsed>=3)r.shot=null;return;}const next=r.shots?.find(x=>!x.shown&&r.elapsed>=x.at);if(next){next.shown=true;if(!claimNarrative(s,SHOTS[next.id],SHOTS))return;r.shot={id:next.id,elapsed:0};if(!s.reel.gallery.includes(next.id))s.reel.gallery.push(next.id);}}
export function landscapeFor(r){return STILL_ROADS[r?.id]??(r?.id===undefined?'highway':null);}

export function markIncidentArt(s,incident){incident.liveRoad=!claimNarrative(s,{image:incident.image},SHOTS);return incident;}
