export const VERSION='0.6.0';
export const SAVE_KEY='common-road-pilgrimage-v6';
export const FAMILY=[
 {id:'jack',name:'Jack',full:'Jack Mercer',role:'44 · former maintenance technician',line:'If it needs a password, hit it with something heavier.',story:'Twenty-two years keeping other people’s machines alive. Continuum suspended his account for repairing a heating unit without a licensed ticket. A family had been freezing. He would do it again. His hands shake when he is angry, so he keeps them busy.',keepsake:'His dad’s socket wrench. The ratchet slips. He knows where.'},
 {id:'sarah',name:'Sarah',full:'Sarah Mercer',role:'42 · former care coordinator',line:'The fridge laid us off. Benefits were shit anyway.',story:'She used to argue with scheduling software so actual people could get care. Then the software scheduled her out. She is tired, sharp, and the person who checks the rear-view mirror while everyone else talks about tomorrow.',keepsake:'A paper address book. Half the numbers are dead. She keeps them anyway.'},
 {id:'ben',name:'Ben',full:'Ben Mercer',role:'15 · apprentice by necessity',line:'So the old stuff works because it’s too stupid to refuse?',story:'School, friends and homework lived behind the same login. Losing it felt like disappearing. He pretends the atlas is embarrassing, but he is learning to read it. Fixing the van is the first thing he has done that cannot be deleted remotely.',keepsake:'A dead handheld. He is not ready to throw it away.'},
 {id:'annie',name:'Annie',full:'Annie Mercer',role:'10 · asks the difficult questions',line:'If the house is smart, why are we sleeping in the van?',story:'She knows the adults are scared and hates being told they are just tired. She counts working lamps, shares her blanket with Rusty, and draws every home they pass. The next one gets a tree and a door she can open herself.',keepsake:'A tin of pencils, worn almost down to the paint.'},
 {id:'rusty',name:'Rusty',full:'Rusty',role:'7 · offline since birth',line:'A proven record of barking at the correct people.',story:'A scruffy terrier with one bent ear and strong opinions about uniforms. He does not understand household account suspension. He understands that Annie needs someone warm against her feet.',keepsake:'A tennis ball. No firmware updates available.'}
];
export const NODES=[
 {id:'yard',name:'Holt’s service yard',region:'WESTERN MISSOURI',art:'yard',x:.12,y:.1,desc:'“You drove that from Everett?” Bea looks at the van. “Christ. Come in before it hears you.” A cooling fan waits in the yard. The Collectors are making their rounds.',fish:false,salvage:true,shop:true},
 {id:'river',name:'Haines River',region:'THE LAST OPEN WATER',art:'fishing',x:.3,y:.3,desc:'June cut the payment terminal off the old river gate. “Fish don’t take cards.” Dinner is under the bridge. Catch it before choosing your road.',fish:true,salvage:true,shop:false},
 {id:'pump',name:'Blackwater pump house',region:'THE REPAIR NETWORK',art:'garage',x:.25,y:.55,desc:'Glenn has water, a dead pump and very little patience. “Last technician told me to reboot the river.” Restore it and he’ll sign for your family.',fish:true,salvage:true,shop:true},
 {id:'freight',name:'Pruitt’s freight stop',region:'THE CONVOY ROAD',art:'plateau',x:.72,y:.52,desc:'Linda weighs your van with one look. “Filters for Morrow. Keep them dry. Ray’s optimism isn’t waterproof either.” Deliver the crate to earn your way in.',fish:false,salvage:true,shop:true},
 {id:'ridge',name:'Juniper Ridge',region:'THE STORM APPROACH',art:'camp',x:.53,y:.76,desc:'The shelter’s sign promises no amenities. For once, an honest advertisement. Lose the pursuit, make repairs and feed everyone before the storm.',fish:true,salvage:true,shop:true},
 {id:'line',name:'The Line',region:'MORROW BASIN',art:'gate',x:.5,y:.96,desc:'There it is. Warm lights across the reservoir. Evelyn Ward is checking the last households before the storm closes the crossing.',fish:false,salvage:false,shop:false}
];
export const ROADS=[
 {id:'opening',from:'approach',to:'yard',name:'Eighteen days from Everett',hours:0,fuel:0,wear:0,kind:'paved',monitored:true,text:'A failing cooling fan. A handwritten address.'},
 {id:'recovery',from:'ridge',to:'pump',name:'Back to Blackwater',hours:3,fuel:4,wear:3,kind:'paved',monitored:true,text:'Glenn keeps one repair route open if the delivery fails.'},
 {id:'r1',from:'yard',to:'river',name:'Follow the river',hours:7,fuel:8,wear:8,kind:'paved',monitored:true,text:'A failing cooling fan is a risk on the long climb.'},
 {id:'r2',from:'river',to:'pump',name:'The repair road',hours:8,fuel:10,wear:14,kind:'rough',text:'Rough hills. Restore the pump and earn a sponsor.'},
 {id:'r3',from:'river',to:'freight',name:'The convoy road',hours:6,fuel:12,wear:7,kind:'paved',monitored:true,text:'More fuel. Bring a filter crate through the Line.'},
 {id:'r4',from:'pump',to:'ridge',name:'Take the ridge',hours:8,fuel:11,wear:13,kind:'rough',text:'Loose gravel and cooling strain. Good tires help.'},
 {id:'r5',from:'freight',to:'ridge',name:'Follow the freight spur',hours:7,fuel:10,wear:8,kind:'paved',monitored:true,text:'Roadside storage looks exposed to the storm.'},
 {id:'r6',from:'ridge',to:'line',name:'Make for Morrow',hours:9,fuel:12,wear:11,kind:'storm',monitored:true,text:'The last approach. Your admission evidence must come with you.'}
];
export const PACKING=[
 {id:'cooler',name:'Insulated cooler',slots:2,icon:'◒',text:'Keeps fresh fish for 24 hours. Six extra portions fit.'},
 {id:'spare',name:'Spare tire',slots:2,icon:'◉',text:'A second chance on a rough road.'},
 {id:'chair',name:'Grandad’s chair',slots:2,icon:'⌑',text:'One familiar thing to put in your own home.'},
 {id:'provisions',name:'Extra provisions',slots:2,icon:'▥',text:'Four more household meals.'},
 {id:'battery',name:'Battery pack',slots:1,icon:'▰',text:'A working relay for the pump house.'},
 {id:'radio',name:'Frank’s radio',slots:1,icon:'▣',text:'Frank warns of scanners. His service lane saves time and fuel.'}
];
export const PARTS={fan:{name:'Cooling fan',color:'#b5c0ac'},relay:{name:'Power relay',color:'#d7b075'},tire:{name:'Spare tire',color:'#9faead'}};
export const node=id=>NODES.find(n=>n.id===id);
export const roads=id=>ROADS.filter(r=>r.from===id);
export function random(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export function siteItems(seed,id){const r=random(seed+id.split('').reduce((a,c)=>a+c.charCodeAt(0),0));return [
 {id:'a',type:id==='yard'?'fan':'relay',name:id==='yard'?'Cooling fan':'Power relay',x:.18,y:.28,quality:88,taken:false},
 {id:'b',type:'tire',name:'Spare tire',x:.75,y:.44,quality:65+Math.floor(r()*25),taken:false},
 {id:'c',type:'food',name:'Sealed provisions',x:.44,y:.48,quality:100,taken:false},
 {id:'d',type:'fuel',name:'Sealed fuel can',x:.8,y:.62,quality:100,taken:false},
 {id:'e',type:'relay',name:'Power relay',x:.16,y:.63,quality:55+Math.floor(r()*40),taken:false}
 ];}
