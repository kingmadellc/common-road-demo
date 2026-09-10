export const VERSION='0.1.0';
export const TITLE='The Last Affordable Place';
export const ITEMS=[
 {id:'I01',name:'Tool case',short:'Tools',slots:2,color:'#d78654',tag:'repair',owner:'Rowan',desc:'Fix the van. Take a small repair job. Make useful things again.'},
 {id:'I02',name:'Sound kit',short:'Sound',slots:2,color:'#607d91',tag:'work',owner:'Dani',desc:'Unlock a $180 sound job. Two slots for a possible next chapter.'},
 {id:'I03',name:'Folding table',short:'Table',slots:1,color:'#b98b66',tag:'setup',owner:'Everyone',desc:'A workbench, a dinner table, a first desk. Technically one object.'},
 {id:'I04',name:'Cooking tote',short:'Cooking',slots:1,color:'#709378',tag:'cooking',owner:'Jules',desc:'Cook at camp and make roadside groceries go further.'},
 {id:'I05',name:'Keepsake chair',short:'Chair',slots:2,color:'#cb7464',tag:'keepsake',owner:'Max',desc:'Grandma’s chair. You could sell it for $95. You could also keep it.'},
 {id:'I06',name:'Plant crate',short:'Plants',slots:1,color:'#83975b',tag:'keepsake',owner:'Jules',desc:'The basil has survived three apartments. It has earned a window.'},
 {id:'I07',name:'Drawing case',short:'Drawing',slots:1,color:'#e2b85c',tag:'creative',owner:'Max',desc:'A proper road journal. Drawing on receipts remains free.'},
 {id:'I08',name:'Comfort box',short:'Comfort',slots:1,color:'#a08ba0',tag:'comfort',owner:'Everyone',desc:'Blankets, old cards, familiar things. Better rest in the van.'},
];
export const PARTY=[
 {id:'rowan',name:'Rowan',role:'Repairs & unreasonable optimism',color:'#cc8261',line:'A place where I can fix something without asking the landlord.'},
 {id:'jules',name:'Jules',role:'Editor, planner, fine-print reader',color:'#788c72',line:'I don’t need perfect. I need to know what next month costs.'},
 {id:'dani',name:'Dani',role:'Sound tech & chosen family',color:'#73869d',line:'My kit’s bulky. So is the idea of starting over.'},
 {id:'max',name:'Max',role:'13 · unofficial trip historian',color:'#d3a454',line:'I’m drawing the good bits. Someone should.'},
];
export const NODES=[
 {id:'R00',name:'The old driveway',region:'departure',x:75,y:150,subtitle:'Pacific Northwest · the last morning',sign:'LEAVING / ROOM TO GROW'},
 {id:'R01',name:'Pass services',region:'mountain',x:190,y:127,subtitle:'Mountains · ordinary coffee, extraordinary view',sign:'REST / SOLD SEPARATELY'},
 {id:'R02',name:'The open plateau',region:'plateau',x:335,y:93,subtitle:'The direct road · fewer stops, wider skies',sign:'NOTHING AHEAD / THAT COSTS EXTRA'},
 {id:'R03',name:'Omar’s roadside diner',region:'plateau',x:335,y:245,subtitle:'Market detour · useful people, good soup',sign:'SOUP & / INFORMATION'},
 {id:'R04',name:'Bea’s service yard',region:'foothills',x:472,y:170,subtitle:'Foothills · reliable or inspirational',sign:'HONEST REPAIRS / ACTUAL PRICES'},
 {id:'R05',name:'The little festival',region:'plains',x:612,y:82,subtitle:'Work detour · the budget has a budget',sign:'COMMUNITY DAY / NO PREMIUM COMMUNITY'},
 {id:'R06',name:'Juniper campground',region:'camp',x:612,y:250,subtitle:'Rest route · the only subscription is washing up',sign:'COME AS YOU ARE / LEAVE BY ELEVEN'},
 {id:'R07',name:'Lake-country junction',region:'lakes',x:749,y:165,subtitle:'Two possible futures · neither in a brochure',sign:'MORROW → / FRIEND TOWN ↘'},
 {id:'R08',name:'Cal’s town',region:'friend',x:853,y:253,subtitle:'A familiar voice · a different destination',sign:'ROOM FOR YOU / TERMS INCLUDED'},
 {id:'R09',name:'Morrow',region:'arrival',x:920,y:115,subtitle:'The Great Lakes · a place, not a pitch',sign:'MORROW / YOU CAN JUST LIVE HERE'},
 {id:'R10',name:'A little breathing room',region:'bridge',x:954,y:275,subtitle:'A temporary stay · time for a new plan',sign:'STAY A WHILE / THEN DECIDE'},
];
export const EDGES=[
 ['L01','R00','R01',135,3,'Cross the pass','A first small stretch. Find your rhythm.'],
 ['L02','R01','R02',310,5.5,'Take the direct road','Save time and miles. A picnic under a very large sky.'],
 ['L03','R01','R03',340,6,'Stop at Omar’s diner','A small detour for a work notice and an actual human contact.'],
 ['L04','R02','R04',330,6,'Head for Bea’s yard','A fair mechanic at the edge of the foothills.'],
 ['L05','R03','R04',310,5.5,'Head for Bea’s yard','A fair mechanic at the edge of the foothills.'],
 ['L06','R04','R05',410,7.5,'Follow the festival lead','Paid setup work. Your sound kit can make this stop worth more.'],
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
 departure:{id:'departure',source:'EV01',speaker:'jules',eyebrow:'ONE LAST LOOK BACK',title:'We can’t take everything.',body:'The lease ends today. A video says Morrow is the last affordable place in the country. Jules has doubts about the “last” part. Dani has a sound kit. Max has a notebook. Miso has already chosen his seat.',quote:'“Let’s at least arrive with a plan. And the dog.”',choices:[
 c('work','Leave room for Dani’s next job','Promise to consider the festival detour. You can renegotiate it later.',{hours:.5,flags:{workPromise:'open'} }),
 c('direct','Agree to keep the route flexible','No work promise. You can still choose either route.',{hours:.5,flags:{workPromise:'none'}}),
 ]},
 phone:{id:'phone',source:'EV08',speaker:'mara',eyebrow:'A CALL THAT SAVES YOU A LOT OF GUESSING',title:'Please watch the second video.',body:'Mara at the Morrow office answers on the third ring. The town is real. The free house is not. She emails two ordinary offers: $1,000 to move into a private place, or $700 for a shared lease. Both allow Miso. Viewings run through day ten.',quote:'“The price includes the room. I know. We put it in bold.”',choices:[
 c('verify','Confirm both offers','Get the written terms and viewing window. No payment or commitment.',{hours:.5,flags:{verified:true,viewDay:10}}),
 c('later','Arrange a later viewing','Same offers. Mara agrees to hold a viewing through day fourteen.',{hours:.5,flags:{verified:true,viewDay:14}}),
 ]},
 rest:{id:'rest',source:'EV02',speaker:'jules',eyebrow:'PASS SERVICES',title:'Rest sold separately.',body:'The motel advertises “sleep-adjacent experiences.” A small sign under that says: clean room, hot shower, sixty dollars. The receptionist looks embarrassed by the large sign.',quote:'“We’re buying the small sign.”',choices:[
 c('room','Take the ordinary room','Pay $60 · 8 hours · everyone recovers 65 energy.',{cash:-60,hours:8,energy:65}),
 c('carry','Save the money and keep planning','No charge. Swap drivers or rest from the route screen.',{}),
 ]},
 picnic:{id:'picnic',source:'EV03',speaker:'max',eyebrow:'NOT EVERYTHING IS AN OBSTACLE',title:'Five bars. No signal.',body:'At the overlook, the phone has nothing to say. The valley manages. Max opens the drawing case—or a perfectly serviceable receipt—and asks if the van can be still for a bit.',quote:'“I’m drawing this one without the billboard.”',choices:[
 c('picnic','Give the afternoon a little room','1 hour · everyone recovers 9 energy · keep a journal memory.',{hours:1,energy:9,flags:{picnic:true}}),
 c('brief','Take the short break','15 minutes · everyone recovers 3 energy. Keep the appointment time.',{hours:.25,energy:3}),
 ]},
 hype:{id:'hype',source:'EV09',speaker:'max',eyebrow:'YOUR FUTURE HAS 48,000 OTHER VIEWERS',title:'Be early. Like everybody else.',body:'Vic posts another video from Morrow. “Undiscovered,” he says, under a live viewer count larger than the town. The windows behind him are quite nice. The claim that every room has a lake view is doing some work.',quote:'“Maybe the lake is a mindset.”',choices:[
 c('facts','Keep the actual offer, lose the pitch','15 minutes. Jules pins Mara’s written terms to the journal.',{hours:.25,flags:{hypeChecked:true}}),
 c('mute','Mute the feed and watch the road','You keep the lead. You do not need the livestream.',{hours:.1}),
 ]},
 bulletin:{id:'bulletin',source:'EV07',speaker:'omar',eyebrow:'THE ALGORITHM IS A CORKBOARD',title:'The bulletin board knows a guy.',body:'Omar needs a wobbly shelf repaired. There is also a notice for Dani’s kind of work at a plains festival. The soup is good enough that nobody needs to call it an experience.',quote:'“The Wi-Fi password is on the board. So is the soup. Only one is reliable.”',choices:[
 c('shelf','Fix the shelf with Rowan’s tools','Earn $70 · 1½ hours · Rowan uses 8 energy. One job, one payment.',{cash:70,hours:1.5,actor:'rowan',actorEnergy:-8,flags:{shelfFixed:true}},{item:'I01'}),
 c('lead','Ask for the festival contact','30 minutes. Get Petra’s actual number and a clear job description.',{hours:.5,flags:{petraLead:true}}),
 c('soup','Share a bowl and be on your way','Pay $12 · 30 minutes · everyone gains 7 energy.',{cash:-12,hours:.5,energy:7,flags:{soup:true}}),
 ]},
 repair:{id:'repair',source:'EV04',speaker:'bea',eyebrow:'BEA’S SERVICE YARD',title:'Reliable or inspirational.',body:'Bea checks the belt and a tired hose. “Nothing catastrophic,” she says, which is unusually soothing from someone holding a wrench. A scoped service is $100. Your tool case gives Rowan another option.',quote:'“I can make it reliable or inspirational. Reliable’s quicker.”',choices:[
 c('service','Pay Bea for the full service','Pay $100 · 2 hours · restore 30 van condition.',{cash:-100,hours:2,condition:30,flags:{repair:'bea'}}),
 c('tools','Buy parts and repair it with Rowan','Pay $25 · 2½ hours · restore 25 condition · Rowan uses 12 energy.',{cash:-25,hours:2.5,condition:25,actor:'rowan',actorEnergy:-12,flags:{repair:'rowan'}},{item:'I01'}),
 c('defer','Get an inspection and carry on','30 minutes. Keep the current condition; no surprise damage charge.',{hours:.5,flags:{repair:'deferred'}}),
 ]},
 favor:{id:'favor',source:'EV14',speaker:'remy',eyebrow:'A FAVOR WITH EDGES',title:'Forty-five minutes. Not forever.',body:'Remy is moving too. Their cargo latch needs another pair of hands. They offer a spare fuel voucher in return. Rowan can help without volunteering to rebuild the trailer.',quote:'“I need a hand, not a rescue story.”',choices:[
 c('help','Agree to the small, specific favor','45 minutes · Rowan uses 6 energy · receive a $30 fuel voucher.',{hours:.75,actor:'rowan',actorEnergy:-6,flags:{remyHelp:true,voucher:30}}),
 c('decline','Pass along Bea’s number','Ten minutes. A clear no; a useful contact. No new obligation.',{hours:1/6,flags:{remyHelp:false}}),
 ]},
 chair:{id:'chair',source:'EV11',speaker:'max',eyebrow:'THE CHAIR IS STILL A CHAIR',title:'Premium storage, ordinary memories.',body:'A shop beside Bea’s yard offers $95 for the keepsake chair. It would make a little room in the van and a little more in the budget. Max waits for someone to ask.',quote:'“I know it’s just furniture. It’s also where she sat.”',choices:[
 c('keep','Keep the chair','30 minutes to repack. It will have somewhere to go at the end.',{hours:.5,flags:{chairKept:true}}),
 c('sell','Talk it through, then sell it','Receive $95 · 30 minutes · leave the chair here; keep Max’s drawing of it.',{cash:95,hours:.5,remove:'I05',flags:{chairSold:true}}),
 ]},
 job:{id:'job',source:'EV05',speaker:'petra',eyebrow:'LIMITLESS POTENTIAL. LIMITED CABLE.',title:'A gig with an actual end time.',body:'Petra’s community festival needs sound setup. Dani reads the contract out loud. Four hours, $180, no unpaid “exposure.” Without the kit, a two-hour table setup task pays $80.',quote:'“The platform added the word limitless. We have six extension cords.”',choices:[
 c('sound','Agree to Dani’s sound job','Reserve Dani and the sound kit. 4 hours of work, $180 on completion.',{hours:.25,contract:'sound'},{item:'I02',actor:'dani',minEnergy:24}),
 c('setup','Agree to the smaller setup job','Reserve Rowan. 2 hours of work, $80 on completion.',{hours:.25,contract:'setup'},{actor:'rowan',minEnergy:12}),
 c('no','Decline before making a promise','No payment and no broken contract. Petra appreciates a straight answer.',{hours:.1,flags:{workPromise:'declined'}}),
 ]},
 invoice:{id:'invoice',source:'EV06',speaker:'dani',eyebrow:'THE WORK YOU ACTUALLY AGREED TO',title:'The final invoice is final.',body:'The scope is written down. The group has a place to wait. This is the point where a promising lead becomes real work—or an honest cancellation.',quote:'“It’s weirdly nice when four hours means four hours.”',choices:[
 c('complete','Complete the agreed job','Use the contracted hours and energy. Receive the agreed pay exactly once.',{completeContract:true}),
 c('cancel','Cancel before starting','15 minutes · no payout. Close the commitment and explain the change.',{hours:.25,cancelContract:true}),
 ]},
 camp:{id:'camp',source:'EV10',speaker:'jean',eyebrow:'JUNIPER CAMPGROUND',title:'The kettle is not a service tier.',body:'Jean points to a real campsite under real trees. Thirty-five dollars for the night. Hot water is included. So is a strict policy against inspirational speakers after ten.',quote:'“You look like you could all use a sit.”',choices:[
 c('stay','Book the site and stay the night','Pay $35 · 8 hours · everyone recovers 65 energy.',{cash:-35,hours:8,energy:65,flags:{camped:true}}),
 c('tea','Have a short cup of tea','30 minutes · everyone recovers 5 energy. Decide about sleep on the map.',{hours:.5,energy:5,flags:{tea:true}}),
 ]},
 meal:{id:'meal',source:'EV16',speaker:'jules',eyebrow:'THE FOLDING TABLE EARNS ITS KEEP',title:'This could be a kitchen.',body:'There is room beside the van for a meal. A passing couple brings tomatoes. Miso contributes the confidence of someone who has never paid for tomatoes.',quote:'“We’ve moved three times. This table’s been a different room each time.”',choices:[
 c('cook','Unpack the cooking tote','45 minutes · add 0.4 days of provisions from the shared meal · gain 8 energy.',{hours:.75,food:.4,energy:8,flags:{sharedMeal:true}},{item:'I04'}),
 c('table','Make a table for everyone','45 minutes · gain 10 energy · the first dinner worth remembering.',{hours:.75,energy:10,flags:{tableDinner:true}},{item:'I03'}),
 c('join','Join briefly and help clean up','30 minutes · gain 6 energy. You don’t need the right equipment to belong.',{hours:.5,energy:6,flags:{sharedMeal:true}}),
 ]},
 key:{id:'key',source:'EV20',speaker:'remy',eyebrow:'THE ROAD REMEMBERS',title:'Not everyone disappears at the exit.',body:'At the lake junction, a familiar trailer pulls up. Remy recognizes your van. A voice message from Cal arrives at the same time: there is space at the house, if you want to talk about actual arrangements.',quote:'“You can come look. Looking isn’t agreeing to anything.”',choices:[
 c('call','Call Cal about the spare floor','30 minutes. Verify a $650 shared-home move-in, pet terms, and next-month work.',{hours:.5,flags:{calVerified:true}}),
 c('later','Keep Cal’s number and head for Morrow','You can still visit and inspect. No offer is withdrawn.',{hours:.1}),
 ]},
 home:{id:'home',source:'EV21',speaker:'max',eyebrow:'WHAT DID WE MEAN BY HOME?',title:'Somewhere we can stay.',body:'The lakes appear between the trees. Nobody checks the feed. Jules asks what matters most when they get there: a door of their own, more room in the budget, or people they already know.',quote:'“Could we put up a drawing without checking the move-out rules?”',choices:[
 c('privacy','A door we can close','Record privacy as a priority. Every housing offer remains available.',{hours:.5,flags:{priority:'privacy',consulted:true}}),
 c('room','Room to breathe in the budget','Record breathing room as a priority. Every offer remains available.',{hours:.5,flags:{priority:'breathing room',consulted:true}}),
 c('people','People we can build a life with','Record belonging as a priority. Every offer remains available.',{hours:.5,flags:{priority:'belonging',consulted:true}}),
 ]},
 friend:{id:'friend',source:'EV23',speaker:'cal',eyebrow:'A KEY WITH A RIDICULOUS KEYRING',title:'The spare floor has boundaries.',body:'Cal shows you two bedrooms and a bright shared kitchen. $650 covers the move-in. Monthly housing and utilities are $780. Quiet hours are real. So is the spare key.',quote:'“I want you here. I also want us to like each other in six months.”',choices:[
 c('inspect','Inspect it together','1 hour. Verify the shared-home terms and agree to discuss routines.',{hours:1,flags:{calVerified:true,consulted:true}}),
 c('bridge','Ask about a temporary arrangement','30 minutes. Fourteen nights for $120, or a funded emergency bridge if needed.',{hours:.5,flags:{bridgeKnown:true}}),
 ]},
 arrival:{id:'arrival',source:'EV22',speaker:'mara',eyebrow:'MORROW · END OF THE ADVERT',title:'A place, not a pitch.',body:'The houses are smaller than the video made them look. The rooms are larger than the van. Mara has two keys, printed terms, and no ring light. Both offers permit the dog. Neither requires you to become a brand.',quote:'“Take your time. Read the second page. We did.”',choices:[
 c('view','Inspect the ordinary offers together','1 hour. Verify the private and shared homes; then choose a next-month plan.',{hours:1,flags:{verified:true,consulted:true}}),
 ]},
};
export const NODE_EVENTS={R00:['departure'],R01:['phone','rest'],R02:['picnic','hype'],R03:['bulletin','picnic'],R04:['repair','favor','chair'],R05:['job','invoice'],R06:['camp','meal'],R07:['key','home'],R08:['friend'],R09:['arrival'],R10:[]};
export const OFFERS=[
 {id:'private',node:'R09',name:'A key of your own',type:'PRIVATE RENTAL',moveIn:1000,monthly:1050,other:950,flag:'verified',desc:'A modest two-bedroom home. A door you can close. A small room for equipment.',tradeoff:'More privacy; less money left over.',tone:'#c87b5b'},
 {id:'shared',node:'R09',name:'Room at the table',type:'SHARED LEASE',moveIn:700,monthly:720,other:950,flag:'verified',desc:'Private bedrooms, a shared kitchen and workshop, and an agreed household rota.',tradeoff:'A lighter budget; more shared routines.',tone:'#708874'},
 {id:'friend',node:'R08',name:'The place we found',type:'HOME WITH CAL',moveIn:650,monthly:780,other:900,flag:'calVerified',desc:'The spare floor at Cal’s place. Two rooms and a kitchen that already smells like dinner.',tradeoff:'A familiar person; a different destination.',tone:'#b99961'},
 {id:'bridge',node:'any',name:'A bridge, not the finish',type:'FOURTEEN-NIGHT PAUSE',moveIn:120,monthly:0,other:0,desc:'Safe breathing room while you arrange work and another viewing. The long-term move is still unfinished.',tradeoff:'Time to make a new plan. This is a temporary outcome.',tone:'#8796aa'},
];
export const WORK_PLANS=[
 {id:'maintenance',name:'Repairs + editing',income:2450,desc:'Rowan: $1,550 maintenance role. Jules: $900 of existing editing work.'},
 {id:'events',name:'Events + editing',income:2300,desc:'Dani: $1,400 local venue role. Jules: $900 of editing work. Dani has agreed to share costs.',requiresJob:true},
 {id:'mixed',name:'Two modest local jobs',income:2150,desc:'Rowan and Jules: $2,150 combined from the town’s posted part-time roles.'},
];
export const nodeById=id=>NODES.find(n=>n.id===id);
export const itemById=id=>ITEMS.find(i=>i.id===id);
