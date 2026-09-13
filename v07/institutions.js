// Public services in the fiction. Stable role IDs also support earlier saved journeys.
export const APPS=[
 {id:'watch',name:'ID',domain:'Identity & access',promise:'You, verified.',control:'One government record links your face, household and service access. Cameras check who is present; missing data can start a review. Its coverage has gaps.',presence:'Identity administration · Transbay',clue:'The same face check at a front door and a station gate.'},
 {id:'account',name:'Cash',domain:'Money & payments',promise:'Everything in one place.',control:'Wages, payments and deductions pass through a joint wallet. An employer’s disputed charge, filed through Work, can automatically hold household funds before a person reviews it.',presence:'Payments administration · Financial District',clue:'The balance is still there. Available to spend: $0.00.'},
 {id:'home',name:'Home',domain:'Housing & domestic devices',promise:'Welcome home.',control:'Occupancy, rent and chipped appliances share the household record. A job-linked flat can expire before the appeal about that job is heard.',presence:'Housing administration · Mission Bay',clue:'Return keys by 06:00. Appeal available in 72 hours.'},
 {id:'food',name:'Food',domain:'Groceries & distribution',promise:'Your daily essentials.',control:'Stocked stores accept Cash payments authenticated through ID. A held wallet means no groceries. Independent traders outside the system still accept paper money, work and barter.',presence:'Distribution administration · South of Market',clue:'A full shelf beyond a checkout that cannot take your money.'},
 {id:'work',name:'Work',domain:'Jobs, assignments & wages',promise:'Your next assignment is ready.',control:'Private employers report jobs, hours and disputes here. Government rules turn those reports into service decisions. The supervisor has gone home; the consequences keep arriving.',presence:'Employment administration · South of Market',clue:'Employment ended. Other services have been notified.'},
 {id:'care',name:'Health',domain:'Care & prescriptions',promise:'Care, coordinated.',control:'Contracted clinics must check automated eligibility before treatment. Sarah can see what a patient needs and still be unable to authorize it.',presence:'Care administration · Mission Bay',clue:'The medicine is in stock. The person is not eligible.'},
 {id:'power',name:'Power',domain:'Utilities & machine permissions',promise:'Ready when you are.',control:'Utilities and licensed machinery require active permissions. A repairable pump can be disabled because its service contract expired.',presence:'Utilities administration · Potrero Point',clue:'An intact machine waiting for an account to say yes.'},
 {id:'travel',name:'Travel',domain:'Transport & district access',promise:'Keep moving.',control:'Transit, tolls and travel permissions use ID. A camera can close the fast lane to your van; an unmonitored county road may still be open.',presence:'Transport administration · Embarcadero',clue:'Your exit disappears after a plate scan.'},
 {id:'enforcement',name:'Safety',domain:'Enforcement & recovery',promise:'For your protection.',control:'Automated debt and relocation orders are enforced by contracted Collector crews. Human contractors put people in vehicles; the order arrives through an app.',presence:'Recovery administration · Hunters Point',clue:'A clean shield on a truck taking a family back to compulsory work.'}
];
// Compatibility export for older tooling; these are now mandatory public apps.
export const CORPORATIONS=APPS;
export const WORLD_PREMISE='San Francisco, 2041. Nine mandatory apps control daily life. Private companies built the system and still collect its fees. The government made it compulsory, then handed more decisions to AI. Jobs, food, housing and money depend on one shared ID. A disputed flag spreads in seconds. A human appeal takes days.';

// Only branded, capitalized names are rewritten; physical relays and place names survive.
const formerNames={Index:'Cash',Forma:'Home',Plenty:'Food',Halo:'ID',Span:'Travel',Loop:'Work',Vita:'Health',Core:'Power',Civic:'Safety',Continuum:'Cash',Vesper:'Home',Lattice:'ID',Meridian:'Travel',Helix:'Health',Aster:'Power','Bastion Civic':'Safety',Bastion:'Safety'};
export function currentCompanyCopy(text){
 if(typeof text!=='string')return text;
 return text
  .replace(/\b(?:Core|Aster) (?:fires|fired) Jack\b/g,'Jack’s employer dismissed him')
  .replace(/\b(?:Core|Aster)([’']s) work queues\b/g,'Work$1 queues')
  .replace(/\b(Bastion Civic|Bastion|Continuum|Vesper|Lattice|Meridian|Helix|Aster|Index|Forma|Plenty|Halo|Span|Loop|Vita|Core|Civic)\b/g,name=>formerNames[name])
  .replace(/\bRelay(?=[’']s| (?:depot|billboard|company|contract|device)\b)/g,'Work')
  .replace(/\bMorrow(?= (?:food|store|distribution|contract|company)\b)/g,'Food')
  .replace(/\bWork depot\b/g,'Travel depot')
  .replace(/\bFood food contract\b/g,'Food distribution contract')
  .replace(/\b([Aa])n (Cash|Power|Home|Work|Food|Health|Travel|Safety)\b/g,'$1 $2')
  .replace(/\b([Aa]) ID\b/g,'$1n ID');
}
