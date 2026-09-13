import {RADIO_MESSAGE} from './narrative.js?v=0.8.0-hunt-1';
const shot=(image,title,line,extra={})=>({image,title,line,...extra});
export const ARRIVALS={river:'sierra-letter',desert:'nevada-room',divide:'ben-wrench',plains:'frank-letter',ridge:'frank-key'};
export const SHOTS={
 'hunt-dinner':shot('meal-family','A meal nobody can switch off','Sarah passes Jack a bowl. His hands are still shaking a little. Annie leaves room for Rusty. “Does June’s stove have an account?” Ben asks. “It has a knob,” Jack says. Nobody reaches for a screen.'),
 'bea-first':shot('intro-departure','Bea first','Sarah: “We hear her out. Then we decide.”'),
 broadcast:shot('opening-radio','Ben’s handwritten broadcast',RADIO_MESSAGE),
 'sierra-letter':shot('open-country','The first witness','June shows Sarah a recent photo of Uncle Frank beside a crooked fence. “He built that. No software could make it that bad.” Ben unfolds his radio note. Sarah checks the date twice. “He looks well.” For once, she has no next question.'),
 'nevada-room':shot('plaza','A room without permission','Ruth hands Sarah a brass key. Sarah looks for the room camera. “Just a smoke alarm,” Ruth says. Sarah sits down. She turns the brass key twice, testing whether it really is hers.'),
 'ben-wrench':shot('repair-family','Something that stays fixed','Ben gets the headlamp working. No service license required. Jack listens while he explains it. Ben grins for a moment, then tries to hide it. The skill belongs to him.'),
 'frank-letter':shot('market','It is really him','The courier transcribed Frank’s radio reply. It answers the private question Sarah sent through Bea. Four people and Rusty. A house held until the convoy leaves. Glenn can witness the papers; the Pruitts can assign a filter delivery. The rumor is now an agreement.'),
 'frank-key':shot('basin','The man from the letter','Frank is older than Sarah remembers. He puts a key in her hand, then takes it back. “Evelyn finishes the papers. I just wanted you to know it’s real.” The storm is coming. One last crossing.'),
 'desert-view':shot('plateau','Nevada has room to spare','Ben: “All this space and we rented a cupboard.” Sarah: “The cupboard had excellent connectivity.”'),
 'divide-view':shot('open-country','Over the Divide','Wyoming wind. Miles of open country. Annie falls quiet, trying to fit it all into a drawing.'),
 'plains-view':shot('prairie','The country opens up','The grain elevators have numbers painted on them. Nobody has asked the van to authenticate for an hour.'),
 cabin:shot('night-family','One room, no login','Annie: “Can they turn this room off?” Sarah: “Not with a key like this.”'),
 roadside:shot('plaza','Service suspended','Jack: “A wrench and a lamp. Best customer support we’ve had in years.”'),
 dinner:shot('meal-family','Food we caught ourselves','Ben: “Food from a river. Terms and conditions: cook it.” Sarah checks no price, no rating, no account. She asks for seconds.'),
 family:shot('open-country','Something worth keeping','Sarah: “Take that one. I want to remember there was more than the road.”'),
 wonder:shot('open-country','More sky than we remembered','Annie: “Was all this here the whole time?”'),
 collectors:shot('squad','Workforce recovery','Civic calls it household recovery. Debt and unauthorized relocation give its Collectors the paperwork. The people in the transport call it being dragged home.'),
 relief:shot('mirror','No lights behind us','Sarah: “They took the other road. Breathe.”'),
 home:shot('basin','The basin keeps its own lights on','Water turns the wheels. Mechanical switches run the lights. No phones or computers beyond the Line. Ben has carried those words since the night he found them.'),
 plaza:shot('plaza','The last service stall','Old pumps. One working lamp. Someone who knows how to fix things.'),
 toll:shot('toll','The road remembers your plate','A private gantry. Public roads, rented back by the mile.'),
 campus:shot('campus','Your future has been discontinued','Loop’s billboard promises “Your potential. Connected.” Beneath it, a Halo camera counts faces. Sarah: “Lovely. The building still remembers us.”'),
 market:shot('market','A different kind of currency','A working relay buys more respect here than a verified account.'),
 seized:shot('seized','They take the home, too','The camper is being towed back toward a company city. Its owners are in the transport behind it. Their debt has acquired a transport fee.'),
 scanner:shot('scanner','A name in the registry','The scan stays on file. It does not tell them which road you take next.'),
 inventory:shot('inventory','Property retained','Keys, papers, shoes. An entire household reduced to an inventory.'),
 blocked:shot('blocked','The exit is occupied','The truck shuts down. The white work lights stay on.'),
 mirror:shot('mirror','Sarah checks the mirror again','Amber lights, two miles back. She waits for the next county turn.'),
 repair:shot('repair-family','Something Ben can learn','Jack: “A loose belt. Finally, a problem without a help desk.”'),
 night:shot('night-family','The quiet between stops','Jack reaches for a work screen that is not there. Sarah notices. “Give it a minute.” Outside, somebody is fixing a generator by lamplight.'),
 'film-highway':shot('highway','County line','The interstate cuts across the country. Keep the van moving.',{film:'highway'}),
 'film-viaduct':shot('logistics','Under the freight viaduct','The trains stopped. The road found a way around.',{film:'viaduct'}),
 'film-rain':shot('plaza','The weather is catching up','Rain moves across the shuttered service yard.',{film:'rain'}),
 'film-overtake':shot('seized','Let them pass','An amber bar in the mirror. Sarah eases off.',{film:'overtake'}),
 'film-scanner':shot('scanner','White light across the window','Another household. Another scan. Keep looking forward.',{film:'scanner'}),
 'film-barrier':shot('blocked','A lane closes behind you','The barrier drops. Find the road that is still open.',{film:'barrier'})
};
export function showStory(s,id,returnMode='stop'){s.story={id,returnMode,elapsed:0};s.mode='story';if(!s.reel.seen.includes(id))s.reel.seen.push(id);if(!s.reel.gallery.includes(id))s.reel.gallery.push(id);}
export function roadShots(s,r){const ids=r.id==='opening'?['bea-first','film-highway']:r.id==='desert-road'?['desert-view','night']:r.id==='divide-road'?['film-scanner','divide-view']:r.id==='plains-road'?['plains-view','wonder']:r.id==='r1'?['film-viaduct',s.threat.identified?'mirror':'wonder']:r.id==='r2'?['market','repair']:r.id==='r3'?['film-scanner','campus']:r.id==='r4'?['film-rain',s.flags.fishDinner?'dinner':'night']:r.id==='r5'?['film-overtake',s.threat.identified?'inventory':'seized']:r.id==='r6'?['film-barrier','home']:['toll','family'];return ids.map((id,i)=>({id,at:i?17:5,shown:false}));}
export function updateReel(s,dt){const r=s.road;if(!r)return;if(r.shot){r.shot.elapsed+=dt;if(r.shot.elapsed>=3)r.shot=null;return;}const next=r.shots?.find(x=>!x.shown&&r.elapsed>=x.at);if(next){next.shown=true;r.shot={id:next.id,elapsed:0};if(!s.reel.gallery.includes(next.id))s.reel.gallery.push(next.id);}}
export function landscapeFor(r){const regional={'desert-road':['plateau','plateau','highway','plateau'],'divide-road':['plateau','open-country','highway','open-country'],'plains-road':['prairie','prairie','highway','prairie']};if(regional[r?.id])return regional[r.id][Math.floor((r.elapsed||0)/4)%4];const sequence=r?.kind==='storm'?['storm','highway','storm','prairie']:r?.kind==='rough'?['prairie','storm','prairie','highway']:['highway','logistics','prairie','highway'];return sequence[Math.floor((r?.elapsed||0)/4)%sequence.length];}
