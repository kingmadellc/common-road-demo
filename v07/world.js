export const VERSION='0.7.0';
export const SAVE_KEY='signals-end-journey-v7';
export const FAMILY=[
 {id:'jack',name:'Jack',full:'Jack Mercer',role:'44 · former maintenance technician',line:'If it needs a password, hit it with something heavier.',story:'Twenty-two years keeping other people’s machines alive. Continuum suspended his account for repairing a heating unit without a licensed ticket. A family had been freezing. He would do it again. His hands shake when he is angry, so he keeps them busy.',keepsake:'His dad’s socket wrench. The ratchet slips. He knows where.'},
 {id:'sarah',name:'Sarah',full:'Sarah Mercer',role:'42 · former care coordinator',line:'The fridge laid us off. Benefits were shit anyway.',story:'She used to argue with scheduling software so actual people could get care. Then the software scheduled her out. She is tired, sharp, and the person who checks the rear-view mirror while everyone else talks about tomorrow.',keepsake:'A paper address book. Half the numbers are dead. She keeps them anyway.'},
 {id:'ben',name:'Ben',full:'Ben Mercer',role:'15 · apprentice by necessity',line:'So the old stuff works because it’s too stupid to refuse?',story:'School, friends and homework lived behind the same login. Losing it felt like disappearing. He pretends the atlas is embarrassing, but he is learning to read it. Fixing the van is the first thing he has done that cannot be deleted remotely.',keepsake:'A dead handheld. It cannot cross the Line. He is not ready to say goodbye.'},
 {id:'annie',name:'Annie',full:'Annie Mercer',role:'10 · asks the difficult questions',line:'If the house is smart, why are we sleeping in the van?',story:'She knows the adults are scared and hates being told they are just tired. She counts working lamps, shares her blanket with Rusty, and draws every home they pass. The next one gets a tree and a door she can open herself.',keepsake:'A tin of pencils, worn almost down to the paint.'},
 {id:'rusty',name:'Rusty',full:'Rusty',role:'7 · offline since birth',line:'A proven record of barking at the correct people.',story:'A scruffy terrier with one bent ear and strong opinions about uniforms. He does not understand household account suspension. He understands that Annie needs someone warm against her feet.',keepsake:'A tennis ball. No firmware updates available.'}
];
// Fictional stops along a real eastbound corridor. Miles are rounded story estimates.
export const NODES=[
 {id:'yard',name:'Bea’s East Bay yard',short:'San Francisco Bay',region:'CALIFORNIA · LEAVING THE CITY',chapter:1,art:'yard',x:.07,y:.65,desc:'The Bay Bridge is behind you. Bea, Jack’s old coworker, opens her Richmond yard. “You’ll want a fan before the Sierra. Mountains don’t accept apologies.” Frank’s stamped letter is in the glovebox.',purpose:'Recover and fit a cooling fan before climbing out of California.',fish:false,salvage:true,shop:true},
 {id:'river',name:'Truckee river camp',short:'Truckee',region:'CALIFORNIA · THE SIERRA',chapter:2,art:'fishing',x:.19,y:.43,desc:'June Haines runs a camp beside the Truckee River. She knows Frank’s handwriting. “He got through. Sent me a photo of his terrible new fence.” The rumor has a witness. The next stretch is dry country.',purpose:'Catch dinner or trade for food; carry fuel into Nevada.',fish:true,salvage:true,shop:true},
 {id:'desert',name:'Wells motor court',short:'Wells',region:'NEVADA · THE GREAT BASIN',chapter:3,art:'plateau',x:.34,y:.44,desc:'The vacancy sign works. The room locks don’t. Ruth Bell trades from the old motor court. “Executive suite comes with a bucket. The executive fills it.” Restock before crossing Utah into Wyoming.',purpose:'Replenish fuel and food before the long mountain leg.',fish:false,salvage:true,shop:true},
 {id:'divide',name:'Rawlins wind shelter',short:'Rawlins',region:'WYOMING · THE HIGH COUNTRY',chapter:4,art:'camp',x:.49,y:.34,desc:'Walt Bell, Ruth’s brother, waves you behind a snow fence. Ben repairs a loose headlamp himself. Sarah lets him keep the wrench. The van is becoming something the family understands.',purpose:'Rest and check the van before descending onto the Plains.',fish:false,salvage:true,shop:true},
 {id:'plains',name:'North Platte exchange',short:'North Platte',region:'NEBRASKA · THE PAPER NETWORK',chapter:5,art:'market',x:.63,y:.37,desc:'A courier brings Frank’s reply: “Your house is still held. Get a witness or carry the filters. Evelyn has your names.” Sarah checks the family password in the margin. It is him. South into Kansas, the trail splits.',purpose:'Choose how to activate Frank’s household reservation: repair work or a filter delivery.',fish:true,salvage:true,shop:true},
 {id:'pump',name:'Glenn’s pump station',short:'Topeka outskirts',region:'KANSAS · THE REPAIR ROAD',chapter:6,art:'garage',x:.77,y:.47,desc:'Glenn Holt, Bea’s brother, maintains the water stop used by the refuge’s supply convoy. “Last technician told me to reboot the river.” Fix his pump. He will witness your household papers and pay for the work.',purpose:'Restore the pump with a relay to activate your reservation.',fish:true,salvage:true,shop:true},
 {id:'freight',name:'Pruitt’s freight stop',short:'Salina',region:'KANSAS · THE DELIVERY ROAD',chapter:6,art:'plateau',x:.69,y:.61,desc:'Linda and Ray Pruitt need ceramic filters carried to Signals End. Their son Wes checks the manifest. “No electronics,” Linda says. “Just something clean to drink.” They can activate your reservation for a usable delivery.',purpose:'Carry three spaces of filters and deliver them at least 45% intact.',fish:false,salvage:true,shop:true},
 {id:'ridge',name:'Ava ridge camp',short:'Southern Missouri',region:'MISSOURI · THE OZARK APPROACH',chapter:7,art:'camp',x:.84,y:.68,desc:'The last convoy stages beyond Ava. Frank is here, in muddy boots, with a real key. Behind him, storm clouds gather over the basin. The crossing crew will honor the scheduled departure; after that the service bridge closes.',purpose:'Lose the pursuit, repair the van and secure your papers before the crossing.',fish:true,salvage:true,shop:true},
 {id:'line',name:'Signals End crossing',short:'Signals End',region:'MISSOURI–ARKANSAS OZARKS · THE LINE',chapter:8,art:'gate',x:.91,y:.84,desc:'Warm lights across the water. Evelyn Ward finds the Mercers on a paper list. The charter binds the council too: no digital devices, public capped dues, a deed independent of your work. Ben still has his dead handheld.',purpose:'Accept the charter, store the digital devices and bring everyone across.',fish:false,salvage:false,shop:false}
];
export const ROADS=[
 {id:'opening',from:'approach',to:'yard',name:'San Francisco → East Bay',miles:25,hours:0,fuel:0,wear:0,kind:'paved',monitored:true,text:'The escape across the Bay Bridge. Your first stop is Bea’s yard.'},
 {id:'r1',from:'yard',to:'river',name:'Climb to Truckee',via:'I-80 · Sacramento · Donner Pass',miles:185,hours:4,fuel:6,wear:7,kind:'paved',monitored:true,text:'Cool the engine, cross the Sierra, find June’s river camp.'},
 {id:'desert-road',from:'river',to:'desert',name:'Cross Nevada',via:'I-80 · Reno · Elko · Wells',miles:345,hours:7,fuel:9,wear:7,kind:'paved',text:'Long gaps between supplies. Start with at least seven hours of food.'},
 {id:'divide-road',from:'desert',to:'divide',name:'Over the high country',via:'I-80 · Salt Lake City bypass · Rawlins',miles:465,hours:9,fuel:11,wear:9,kind:'paved',text:'Avoid the Salt Lake account gates, then climb into the wind.'},
 {id:'plains-road',from:'divide',to:'plains',name:'Follow the Platte east',via:'I-80 · Cheyenne · North Platte',miles:355,hours:7,fuel:9,wear:6,kind:'paved',text:'The Plains open up. Frank’s next letter waits at the exchange.'},
 {id:'r2',from:'plains',to:'pump',name:'Help Glenn keep the water on',via:'I-80 · US-81 · US-36 · Topeka area',miles:490,hours:10,fuel:12,wear:12,kind:'rough',text:'Rough county detours. Repair a pump for a signed household reservation.'},
 {id:'r3',from:'plains',to:'freight',name:'Carry water filters with the Pruitts',via:'US-83 · US-24 · US-81 · Salina',miles:370,hours:8,fuel:11,wear:7,kind:'paved',monitored:true,text:'Paid roads have scanners. Save three locker spaces for the crate.'},
 {id:'r4',from:'pump',to:'ridge',name:'South into the Ozarks',via:'US-75 · US-54 · US-65 · Ava',miles:330,hours:7,fuel:9,wear:10,kind:'rough',text:'Bring the signed papers. Frank will meet you at the ridge camp.'},
 {id:'r5',from:'freight',to:'ridge',name:'Follow the supply convoy',via:'I-135 · US-400 · US-160 · Ava',miles:400,hours:8,fuel:10,wear:7,kind:'paved',monitored:true,text:'Protect the filters; the Collectors watch freight traffic.'},
 {id:'r6',from:'ridge',to:'line',name:'Reach Signals End',via:'Local reservoir service roads · fictional crossing',miles:85,hours:3,fuel:5,wear:8,kind:'storm',monitored:true,text:'Storm damage slows the last approach. Keep the van and your admission evidence intact.'},
 {id:'recovery',from:'ridge',to:'pump',name:'Return to Glenn’s station',via:'Retrace the Kansas repair road',miles:330,hours:7,fuel:9,wear:8,kind:'rough',text:'A long fallback if your delivery fails. A replacement crate at the ridge is quicker.'}
];
export const CAMPAIGN={origin:'San Francisco',destination:'Signals End',region:'Missouri–Arkansas Ozarks',departureWindow:120};
export function objective(s){
 if(s.mode==='home'||s.ending?.owned)return 'Turn a house into your home. The deed belongs to the Mercers.';
 if(s.mode==='ending')return s.ending.text;
 if(s.road)return 'Reach '+node(s.road.to).short+'. '+s.road.text;
 if(s.mode==='packing')return 'Pack six spaces. Cross the Bay to Bea’s yard and fix the cooling fan.';
 if(s.node==='yard'&&s.fan)return 'The fan works. Follow I-80 to June’s camp at Truckee.';
 if(s.node==='pump'&&s.sponsor)return 'Your reservation is signed. Meet Frank at Ava ridge camp.';
 if(s.node==='freight'&&s.cargo)return 'Keep the filters at least 45% intact. Meet Frank at Ava ridge camp.';
 return node(s.node)?.purpose||'Keep the family together.';
}
export function admission(s){return s.sponsor?'Reservation active · Glenn signed':s.cargo&&s.cargo.condition>=45?'Delivery aboard · protect the filters':s.cargo?'Filters damaged · find a replacement at the ridge':'Frank holds a house · earn a witness or deliver filters';}
export const PACKING=[
 {id:'cooler',name:'Insulated cooler',slots:2,icon:'◒',text:'Keeps fresh fish for 24 hours. Six extra portions fit.'},
 {id:'spare',name:'Spare tire',slots:2,icon:'◉',text:'A second chance on a rough road.'},
 {id:'chair',name:'Grandad’s chair',slots:2,icon:'⌑',text:'One familiar thing to put in your own home.'},
 {id:'provisions',name:'Extra provisions',slots:2,icon:'▥',text:'Four more household meals.'},
 {id:'battery',name:'Spare relay',slots:1,icon:'▰',text:'An electromechanical relay for Glenn’s pump. No computer.'},
 {id:'radio',name:'Frank’s radio',slots:1,icon:'▣',text:'Analog shortwave. The road network warns of scanners and quiet lanes.'}
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
