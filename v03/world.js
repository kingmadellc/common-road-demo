export const VERSION='0.3.0';
export const SAVE_KEY='common-road-pilgrimage-v3';
export const FAMILY=[
 {id:'jack',name:'Jack',full:'Jack Mercer',role:'Dad · maintenance technician',line:'I can keep it running. Just give me a minute.'},
 {id:'sarah',name:'Sarah',full:'Sarah Mercer',role:'Mom · care coordinator',line:'We need a plan that still works when something breaks.'},
 {id:'ben',name:'Ben',full:'Ben Mercer',role:'Son · 15',line:'Show me how. I’m tired of just watching.'},
 {id:'annie',name:'Annie',full:'Annie Mercer',role:'Daughter · 10',line:'At the new place, can Rusty sleep in my room?'},
 {id:'rusty',name:'Rusty',full:'Rusty',role:'Family dog · 7',line:'The last warm seat in America.'}
];
export const NODES=[
 {id:'yard',name:'Holt’s service yard',region:'WESTERN MISSOURI',art:'garage',x:.12,y:.1,desc:'The fan is failing. Bea Holt has a yard full of old machines. Somewhere in there is a second chance.',fish:false,salvage:true,shop:true},
 {id:'river',name:'Haines River',region:'THE LAST OPEN WATER',art:'fishing',x:.3,y:.3,desc:'June Haines keeps the river access open. Fish beneath the old bridge before choosing your road.',fish:true,salvage:true,shop:false},
 {id:'pump',name:'Blackwater pump house',region:'THE REPAIR NETWORK',art:'garage',x:.25,y:.55,desc:'The feeder settlement needs its pump restored. Bea’s brother Glenn can vouch for your household if you get the water running.',fish:true,salvage:true,shop:true},
 {id:'freight',name:'Pruitt’s freight stop',region:'THE CONVOY ROAD',art:'plateau',x:.72,y:.52,desc:'Ray and Linda Pruitt are sending a crate of water filters to Morrow. Their son Wes needs someone who can deliver it intact.',fish:false,salvage:true,shop:true},
 {id:'ridge',name:'Juniper Ridge',region:'THE STORM APPROACH',art:'camp',x:.53,y:.76,desc:'The last sheltered stop. Make repairs, feed the family, and decide what you can afford to leave behind.',fish:true,salvage:true,shop:true},
 {id:'line',name:'The Line',region:'MORROW BASIN',art:'gate',x:.5,y:.96,desc:'There it is. Warm lights across the reservoir. Evelyn Ward is checking the last households before the storm closes the crossing.',fish:false,salvage:false,shop:false}
];
export const ROADS=[
 {id:'r1',from:'yard',to:'river',name:'Follow the river',hours:7,fuel:8,wear:8,kind:'paved',text:'A failing cooling fan is a risk on the long climb.'},
 {id:'r2',from:'river',to:'pump',name:'The repair road',hours:8,fuel:10,wear:14,kind:'rough',text:'Rough hills. Restore the pump and earn a sponsor.'},
 {id:'r3',from:'river',to:'freight',name:'The convoy road',hours:6,fuel:12,wear:7,kind:'paved',text:'More fuel. Bring a filter crate through the Line.'},
 {id:'r4',from:'pump',to:'ridge',name:'Take the ridge',hours:8,fuel:11,wear:13,kind:'rough',text:'Loose gravel and cooling strain. Good tires help.'},
 {id:'r5',from:'freight',to:'ridge',name:'Follow the freight spur',hours:7,fuel:10,wear:8,kind:'paved',text:'Roadside storage looks exposed to the storm.'},
 {id:'r6',from:'ridge',to:'line',name:'Make for Morrow',hours:9,fuel:12,wear:11,kind:'storm',text:'The last approach. Your admission evidence must come with you.'}
];
export const PACKING=[
 {id:'cooler',name:'Insulated cooler',slots:2,icon:'◒',text:'Food stays good through the storm. Fish yield +1 meal.'},
 {id:'spare',name:'Spare tire',slots:2,icon:'◉',text:'A second chance on a rough road.'},
 {id:'chair',name:'Grandad’s chair',slots:2,icon:'⌑',text:'One familiar thing to put in your own home.'},
 {id:'provisions',name:'Extra provisions',slots:2,icon:'▥',text:'Four more household meals.'},
 {id:'battery',name:'Battery pack',slots:1,icon:'▰',text:'A working relay for the pump house.'},
 {id:'radio',name:'Frank’s radio',slots:1,icon:'▣',text:'An earlier weather warning. A voice from the other side.'}
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
