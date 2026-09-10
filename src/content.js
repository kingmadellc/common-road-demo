export const VERSION='0.2.0';
export const TITLE='The Last Affordable Place';
export const ITEMS=[
 {id:'I01',name:'Tool case',short:'Tools',slots:2,color:'#d78654',tag:'repair',owner:'Rowan',desc:'Hand tools and a dog-eared service manual. Fix the van. Earn money repairing what others replace.'},
 {id:'I02',name:'Sound kit',short:'Sound',slots:2,color:'#607d91',tag:'work',owner:'Dani',desc:'Analog mixer, cables, old speakers. No license server. Unlock a $180 sound job.'},
 {id:'I03',name:'Folding table',short:'Table',slots:1,color:'#b98b66',tag:'setup',owner:'Everyone',desc:'A workbench, a dinner table, a first desk. Technically one object.'},
 {id:'I04',name:'Cooking tote',short:'Cooking',slots:1,color:'#709378',tag:'cooking',owner:'Jules',desc:'Cook at camp and make roadside groceries go further.'},
 {id:'I05',name:'Keepsake chair',short:'Chair',slots:2,color:'#cb7464',tag:'keepsake',owner:'Max',desc:'Grandma’s chair. You could sell it for $95. You could also keep it.'},
 {id:'I06',name:'Plant crate',short:'Plants',slots:1,color:'#83975b',tag:'keepsake',owner:'Jules',desc:'The basil has survived three apartments. It has earned a window.'},
 {id:'I07',name:'Drawing case',short:'Drawing',slots:1,color:'#e2b85c',tag:'creative',owner:'Max',desc:'A proper road journal. Drawing on receipts remains free.'},
 {id:'I08',name:'Comfort box',short:'Comfort',slots:1,color:'#a08ba0',tag:'comfort',owner:'Everyone',desc:'Blankets, old cards, familiar things. Better rest in the van.'},
];
export const PARTY=[
 {id:'rowan',name:'Rowan',role:'Maintenance worker · keeps things running',color:'#cc8261',line:'A place where I can fix something without requesting permission.'},
 {id:'jules',name:'Jules',role:'Editor, planner, fine-print reader',color:'#788c72',line:'I don’t need perfect. I need to know what next month costs.'},
 {id:'dani',name:'Dani',role:'Sound tech & chosen family',color:'#73869d',line:'My kit’s bulky. So is the idea of starting over.'},
 {id:'max',name:'Max',role:'13 · unofficial trip historian',color:'#d3a454',line:'I’m drawing what’s still here. Someone should.'},
];
export const NODES=[
 {id:'R00',name:'The old driveway',region:'departure',x:75,y:150,subtitle:'Pacific Northwest · access expires at noon',sign:'LEAVING / ROOM TO GROW'},
 {id:'R01',name:'Pass services',region:'mountain',x:190,y:127,subtitle:'Mountains · service unavailable',sign:'REST / SOLD SEPARATELY'},
 {id:'R02',name:'The open plateau',region:'plateau',x:335,y:93,subtitle:'The direct road · beyond the network',sign:'NOTHING AHEAD / THAT COSTS EXTRA'},
 {id:'R03',name:'Omar’s roadside diner',region:'plateau',x:335,y:245,subtitle:'Roadside detour · a working boiler',sign:'SOUP & / INFORMATION'},
 {id:'R04',name:'Bea’s service yard',region:'foothills',x:472,y:170,subtitle:'Foothills · independent repair',sign:'HONEST REPAIRS / ACTUAL PRICES'},
 {id:'R05',name:'The little festival',region:'plains',x:612,y:82,subtitle:'Work detour · the repair fair',sign:'COMMUNITY DAY / NO PREMIUM COMMUNITY'},
 {id:'R06',name:'Juniper campground',region:'camp',x:612,y:250,subtitle:'Rest route · off the service grid',sign:'COME AS YOU ARE / LEAVE BY ELEVEN'},
 {id:'R07',name:'Lake-country junction',region:'lakes',x:749,y:165,subtitle:'Lake country · dead towers, warm windows',sign:'MORROW → / FRIEND TOWN ↘'},
 {id:'R08',name:'Cal’s town',region:'friend',x:853,y:253,subtitle:'Workshop rooms · a metal key',sign:'ROOM FOR YOU / TERMS INCLUDED'},
 {id:'R09',name:'Morrow',region:'arrival',x:920,y:115,subtitle:'The Great Lakes · something worth fixing',sign:'MORROW / YOU CAN JUST LIVE HERE'},
 {id:'R10',name:'A little breathing room',region:'bridge',x:954,y:275,subtitle:'A temporary stay · time for a new plan',sign:'STAY A WHILE / THEN DECIDE'},
];
export const EDGES=[
 ['L01','R00','R01',135,3,'Cross the pass','Past the expired access gates and into the pass.'],
 ['L02','R01','R02',310,5.5,'Take the direct road','Save time and miles. Cross the quiet industrial valley.'],
 ['L03','R01','R03',340,6,'Stop at Omar’s diner','A small detour for a work notice and an actual human contact.'],
 ['L04','R02','R04',330,6,'Head for Bea’s yard','A fair mechanic at the edge of the foothills.'],
 ['L05','R03','R04',310,5.5,'Head for Bea’s yard','A fair mechanic at the edge of the foothills.'],
 ['L06','R04','R05',410,7.5,'Follow the festival lead','Keep the repair fair running. An unlocked sound kit earns more.'],
 ['L07','R04','R06',385,7,'Take the campground road','Fewer miles, a warm meal, and an inexpensive night.'],
 ['L08','R05','R07',440,8,'Drive toward the lakes','Leave the speakers behind. Take the money and the memory.'],
 ['L09','R06','R07',465,8.5,'Drive toward the lakes','One long stretch. Choose a rested driver.'],
 ['L10','R07','R09',460,8.5,'Keep going to Morrow','See the private and shared homes you called about.'],
 ['L11','R07','R08',400,7.5,'Visit Cal’s town','A friend has a spare floor, a spare key, and actual boundaries.'],
 ['L12','R08','R09',95,2,'Continue to Morrow','You can appreciate an offer and still keep looking.'],
 ['L13','R08','R10',10,.5,'Take a temporary pause','Fourteen nights and a next step. An honest bridge outcome.'],
].map(([id,from,to,miles,hours,label,desc])=>({id,from,to,miles,hours,label,desc}));
const c=(id,label,detail,effect={},extra={})=>({id,label,detail,effect,...extra});
export const EVENTS={
 departure:{id:'departure',source:'EV01',speaker:'jules',eyebrow:'2032 / YOUR ACCESS EXPIRES TODAY',title:'The lock changes at noon.',body:'Continuum calls it a lifestyle renewal. The rent doubled; the door code expires today. Rowan still owns an old van. A message from Morrow says there are homes with ordinary leases, and machines worth fixing. Four people and a dog have one last morning to pack.',quote:'“They can cancel the apartment. They can’t cancel a carburetor.”',choices:[
 c('work','Leave room for Dani’s next job','Promise to consider the festival detour. You can renegotiate it later.',{hours:.5,flags:{workPromise:'open'} }),
 c('direct','Agree to keep the route flexible','No work promise. You can still choose either route.',{hours:.5,flags:{workPromise:'none'}}),
 ]},
 phone:{id:'phone',source:'EV08',speaker:'mara',eyebrow:'A HUMAN ON THE LINE',title:'The free house has conditions.',body:'Every Continuum screen promises a home without the burden of ownership. Mara still answers a desk phone. Morrow has two independent leases: $1,000 to move into a private place, $700 for shared rooms. Both allow Miso. Viewings run through day ten. She sends the actual terms.',quote:'“The heat works. The door takes a key. I should probably lead with that.”',choices:[
 c('verify','Confirm both offers','Get the written terms and viewing window. No payment or commitment.',{hours:.5,flags:{verified:true,viewDay:10}}),
 c('later','Arrange a later viewing','Same offers. Mara agrees to hold a viewing through day fourteen.',{hours:.5,flags:{verified:true,viewDay:14}}),
 ]},
 rest:{id:'rest',source:'EV02',speaker:'jules',eyebrow:'PASS SERVICES',title:'Your sleep trial has expired.',body:'The motel’s access kiosk has been rebooting since last winter. A handwritten card directs you to the night clerk. Sixty dollars buys a room and hot water. He has bypassed the shower meter with a piece of copper wire.',quote:'“We’re buying the room. The wire is a bonus.”',choices:[
 c('room','Take the ordinary room','Pay $60 · 8 hours · everyone recovers 65 energy.',{cash:-60,hours:8,energy:65}),
 c('carry','Save the money and keep planning','No charge. Swap drivers or rest from the route screen.',{}),
 ]},
 picnic:{id:'picnic',source:'EV03',speaker:'max',eyebrow:'THE WORLD OUTSIDE THE NETWORK',title:'Five bars. No signal.',body:'Below the overlook, delivery towers blink above a valley of dark factories. The phone shows five bars and nothing loads. Max opens the drawing case—or a receipt—and asks if the van can be still. The trees have outgrown an access gate.',quote:'“I’m drawing this one without the billboard.”',choices:[
 c('picnic','Give the afternoon a little room','1 hour · everyone recovers 9 energy · keep a journal memory.',{hours:1,energy:9,flags:{picnic:true}}),
 c('brief','Take the short break','15 minutes · everyone recovers 3 energy. Keep the appointment time.',{hours:.25,energy:3}),
 ]},
 hype:{id:'hype',source:'EV09',speaker:'max',eyebrow:'CONTINUUM LIVING / A BETTER YOU, MONTHLY',title:'Own nothing. Stay happy.',body:'An old roadside screen repeats a smiling model beside an immaculate home. Half the pixels are dead. Vic’s feed calls Morrow the next unclaimed opportunity. Jules has Mara’s written terms. One is an offer; the other is trying to become a price increase.',quote:'“If the future is maintenance-free, why is everything broken?”',choices:[
 c('facts','Keep the actual offer, lose the pitch','15 minutes. Jules pins Mara’s written terms to the journal.',{hours:.25,flags:{hypeChecked:true}}),
 c('mute','Mute the feed and watch the road','You keep the lead. You do not need the livestream.',{hours:.1}),
 ]},
 bulletin:{id:'bulletin',source:'EV07',speaker:'omar',eyebrow:'OMAR’S / NO ACCOUNT REQUIRED',title:'Someone still knows how.',body:'Omar keeps the diner open with a soldered boiler and a fridge older than Rowan. Its shelf has pulled loose; the service platform offers a replacement subscription. Omar offers $70 for a repair. On the corkboard, Petra needs sound equipment that works without authorization.',quote:'“The fridge still runs. Apparently that’s no longer the business model.”',choices:[
 c('shelf','Fix the shelf with Rowan’s tools','Earn $70 · 1½ hours · Rowan uses 8 energy. One job, one payment.',{cash:70,hours:1.5,actor:'rowan',actorEnergy:-8,flags:{shelfFixed:true}},{item:'I01'}),
 c('lead','Ask for the festival contact','30 minutes. Get Petra’s actual number and a clear job description.',{hours:.5,flags:{petraLead:true}}),
 c('soup','Share a bowl and be on your way','Pay $12 · 30 minutes · everyone gains 7 energy.',{cash:-12,hours:.5,energy:7,flags:{soup:true}}),
 ]},
 repair:{id:'repair',source:'EV04',speaker:'bea',eyebrow:'BEA’S SERVICE YARD',title:'The machine is still yours.',body:'Bea’s neighbors used to service entire fleets. Now their locked diagnostic rigs gather moss. She checks a tired hose and drive belt by hand. A scoped service is $100. With Rowan’s tool case and $25 in parts, she can talk him through the work.',quote:'“People forgot how to fix them. The machines didn’t forget how to run.”',choices:[
 c('service','Pay Bea for the full service','Pay $100 · 2 hours · restore 30 van condition.',{cash:-100,hours:2,condition:30,flags:{repair:'bea'}}),
 c('tools','Buy parts and repair it with Rowan','Pay $25 · 2½ hours · restore 25 condition · Rowan uses 12 energy.',{cash:-25,hours:2.5,condition:25,actor:'rowan',actorEnergy:-12,flags:{repair:'rowan'}},{item:'I01'}),
 c('defer','Get an inspection and carry on','30 minutes. Keep the current condition; no surprise damage charge.',{hours:.5,flags:{repair:'deferred'}}),
 ]},
 favor:{id:'favor',source:'EV14',speaker:'remy',eyebrow:'A FAVOR WITH EDGES',title:'Forty-five minutes. Not forever.',body:'Remy’s trailer latch has failed outside the dead automated service bay. The official fix is a new trailer. The real fix needs two people and forty-five minutes. Remy offers a spare fuel voucher. Rowan can help without inheriting the whole breakdown.',quote:'“The app says replace it. Bea says hold this.”',choices:[
 c('help','Agree to the small, specific favor','45 minutes · Rowan uses 6 energy · receive a $30 fuel voucher.',{hours:.75,actor:'rowan',actorEnergy:-6,flags:{remyHelp:true,voucher:30}}),
 c('decline','Pass along Bea’s number','Ten minutes. A clear no; a useful contact. No new obligation.',{hours:1/6,flags:{remyHelp:false}}),
 ]},
 chair:{id:'chair',source:'EV11',speaker:'max',eyebrow:'AN OBJECT THAT CANNOT EXPIRE',title:'No serial number. No monthly fee.',body:'The secondhand shop offers $95 for Grandma’s chair. Solid wood, repairable joints, no remote lock. It would free space in the van and money in the budget. Max runs a thumb along the worn arm and waits for someone to ask.',quote:'“I know it’s just furniture. It’s also where she sat.”',choices:[
 c('keep','Keep the chair','30 minutes to repack. It will have somewhere to go at the end.',{hours:.5,flags:{chairKept:true}}),
 c('sell','Talk it through, then sell it','Receive $95 · 30 minutes · leave the chair here; keep Max’s drawing of it.',{cash:95,hours:.5,remove:'I05',flags:{chairSold:true}}),
 ]},
 job:{id:'job',source:'EV05',speaker:'petra',eyebrow:'PETRA’S REPAIR FAIR / KEEP THE LIGHTS ON',title:'The speakers need a human.',body:'The town’s little festival funds its repair benches. The leased speakers have locked themselves after a missed renewal. Dani’s analog kit can save the set: four hours, $180. Without it, a two-hour table setup job pays $80. Petra writes both scopes on paper.',quote:'“Six extension cords. No permissions server. We might actually pull this off.”',choices:[
 c('sound','Agree to Dani’s sound job','Reserve Dani and the sound kit. 4 hours of work, $180 on completion.',{hours:.25,contract:'sound'},{item:'I02',actor:'dani',minEnergy:24}),
 c('setup','Agree to the smaller setup job','Reserve Rowan. 2 hours of work, $80 on completion.',{hours:.25,contract:'setup'},{actor:'rowan',minEnergy:12}),
 c('no','Decline before making a promise','No payment and no broken contract. Petra appreciates a straight answer.',{hours:.1,flags:{workPromise:'declined'}}),
 ]},
 invoice:{id:'invoice',source:'EV06',speaker:'dani',eyebrow:'THE WORK YOU ACTUALLY AGREED TO',title:'The final invoice is final.',body:'The tables need wiring and the remaining sound system needs testing. Dani pins the agreed scope beside the mixing desk. The group has somewhere to wait. Now the promise becomes work—or an honest cancellation.',quote:'“Four hours, then we own the rest of our day.”',choices:[
 c('complete','Complete the agreed job','Use the contracted hours and energy. Receive the agreed pay exactly once.',{completeContract:true}),
 c('cancel','Cancel before starting','15 minutes · no payout. Close the commitment and explain the change.',{hours:.25,cancelContract:true}),
 ]},
 camp:{id:'camp',source:'EV10',speaker:'jean',eyebrow:'JUNIPER / THE OLD CAMPGROUND',title:'The kettle is not a service tier.',body:'The gate motor died years ago. Jean took the gate off. Thirty-five dollars buys a site and a night beside the old boiler. She feeds another split log into it. Hot water is included; the campground network has been disconnected on purpose.',quote:'“The boiler wants wood. That I can understand.”',choices:[
 c('stay','Book the site and stay the night','Pay $35 · 8 hours · everyone recovers 65 energy.',{cash:-35,hours:8,energy:65,flags:{camped:true}}),
 c('tea','Have a short cup of tea','30 minutes · everyone recovers 5 energy. Decide about sleep on the map.',{hours:.5,energy:5,flags:{tea:true}}),
 ]},
 meal:{id:'meal',source:'EV16',speaker:'jules',eyebrow:'THE FOLDING TABLE EARNS ITS KEEP',title:'This could be a kitchen.',body:'The kettle ticks beside the van. A passing couple brings tomatoes from a greenhouse with hand-cranked vents. Jules clears a space for dinner. Miso contributes the confidence of someone who has never had a payment declined.',quote:'“We’ve moved three times. This table’s been a different room each time.”',choices:[
 c('cook','Unpack the cooking tote','45 minutes · add 0.4 days of provisions from the shared meal · gain 8 energy.',{hours:.75,food:.4,energy:8,flags:{sharedMeal:true}},{item:'I04'}),
 c('table','Make a table for everyone','45 minutes · gain 10 energy · the first dinner worth remembering.',{hours:.75,energy:10,flags:{tableDinner:true}},{item:'I03'}),
 c('join','Join briefly and help clean up','30 minutes · gain 6 energy. You don’t need the right equipment to belong.',{hours:.5,energy:6,flags:{sharedMeal:true}}),
 ]},
 key:{id:'key',source:'EV20',speaker:'remy',eyebrow:'A CONTACT BEYOND THE COVERAGE MAP',title:'Not everyone disappears at the exit.',body:'At the lake junction, Remy’s patched trailer pulls up beside you. Cal’s voice finally makes it through the radio relay: there is space above the workshop. Real rooms, ordinary rent, shared repairs. Cal wants to talk about the arrangements before anyone makes promises.',quote:'“You can come look. Looking isn’t agreeing to anything.”',choices:[
 c('call','Call Cal about the spare floor','30 minutes. Verify a $650 shared-home move-in, pet terms, and next-month work.',{hours:.5,flags:{calVerified:true}}),
 c('later','Keep Cal’s number and head for Morrow','You can still visit and inspect. No offer is withdrawn.',{hours:.1}),
 ]},
 home:{id:'home',source:'EV21',speaker:'max',eyebrow:'WHAT DID WE MEAN BY HOME?',title:'Somewhere we can stay.',body:'Across the lake, the corporate towers advertise continuous living. Half their windows are dark. Below them, small workshop lights are still on. Jules asks what matters now: a door of their own, room in the budget, or people who will help keep a place running.',quote:'“Could we put up a drawing without checking the move-out rules?”',choices:[
 c('privacy','A door we can close','Record privacy as a priority. Every housing offer remains available.',{hours:.5,flags:{priority:'privacy',consulted:true}}),
 c('room','Room to breathe in the budget','Record breathing room as a priority. Every offer remains available.',{hours:.5,flags:{priority:'breathing room',consulted:true}}),
 c('people','People we can build a life with','Record belonging as a priority. Every offer remains available.',{hours:.5,flags:{priority:'belonging',consulted:true}}),
 ]},
 friend:{id:'friend',source:'EV23',speaker:'cal',eyebrow:'CAL’S / A KEY CUT FROM METAL',title:'The spare floor has boundaries.',body:'Cal shows you two bedrooms above the workshop. The shared kitchen is warm from a repaired stove. Move-in is $650; monthly housing and utilities are $780. Quiet hours are real. So is the spare key. Cal expects everyone to help keep the place running.',quote:'“I want you here. I also want us to like each other in six months.”',choices:[
 c('inspect','Inspect it together','1 hour. Verify the shared-home terms and agree to discuss routines.',{hours:1,flags:{calVerified:true,consulted:true}}),
 c('bridge','Ask about a temporary arrangement','30 minutes. Fourteen nights for $120, or a funded emergency bridge if needed.',{hours:.5,flags:{bridgeKnown:true}}),
 ]},
 arrival:{id:'arrival',source:'EV22',speaker:'mara',eyebrow:'MORROW / BEYOND THE SHOWROOM',title:'A place worth maintaining.',body:'The houses are worn. The workshop windows are warm. Mara has two metal keys and printed terms: a private place or shared rooms, both with space for Miso. The town needs people who can repair its machines. Nobody promises it will be easy to stay.',quote:'“Nothing here is maintenance-free. Including the neighbors.”',choices:[
 c('view','Inspect the ordinary offers together','1 hour. Verify the private and shared homes; then choose a next-month plan.',{hours:1,flags:{verified:true,consulted:true}}),
 ]},
};
export const NODE_EVENTS={R00:['departure'],R01:['phone','rest'],R02:['picnic','hype'],R03:['bulletin','picnic'],R04:['repair','favor','chair'],R05:['job','invoice'],R06:['camp','meal'],R07:['key','home'],R08:['friend'],R09:['arrival'],R10:[]};
export const OFFERS=[
 {id:'private',node:'R09',name:'A key of your own',type:'PRIVATE RENTAL',moveIn:1000,monthly:1050,other:950,flag:'verified',desc:'A worn two-bedroom home with a working boiler, an ordinary lease, and room for tools.',tradeoff:'More privacy; less money left over.',tone:'#c87b5b'},
 {id:'shared',node:'R09',name:'Room at the table',type:'SHARED LEASE',moveIn:700,monthly:720,other:950,flag:'verified',desc:'Private bedrooms above a shared kitchen and repair workshop. Household jobs are written into a rota.',tradeoff:'A lighter budget; more shared routines.',tone:'#708874'},
 {id:'friend',node:'R08',name:'The place we found',type:'HOME WITH CAL',moveIn:650,monthly:780,other:900,flag:'calVerified',desc:'The spare floor at Cal’s place. Two rooms and a kitchen that already smells like dinner.',tradeoff:'A familiar person; a different destination.',tone:'#b99961'},
 {id:'bridge',node:'any',name:'A bridge, not the finish',type:'FOURTEEN-NIGHT PAUSE',moveIn:120,monthly:0,other:0,desc:'Safe breathing room while you arrange work and another viewing. The long-term move is still unfinished.',tradeoff:'Time to make a new plan. This is a temporary outcome.',tone:'#8796aa'},
];
export const WORK_PLANS=[
 {id:'maintenance',name:'Repairs + editing',income:2450,desc:'Rowan: $1,550 keeping the town’s old machines running. Jules: $900 of editing work.'},
 {id:'events',name:'Events + editing',income:2300,desc:'Dani: $1,400 local venue role. Jules: $900 of editing work. Dani has agreed to share costs.',requiresJob:true},
 {id:'mixed',name:'Two modest local jobs',income:2150,desc:'Rowan and Jules: $2,150 combined from the town’s posted part-time roles.'},
];
export const nodeById=id=>NODES.find(n=>n.id===id);
export const itemById=id=>ITEMS.find(i=>i.id===id);
