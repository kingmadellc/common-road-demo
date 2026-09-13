// Fictional world reference. The opening introduces systems, not a roll call.
export const CORPORATIONS=[
 {id:'account',name:'Index',domain:'Identity & money',promise:'One account. A simpler life.',control:'Your household account clears wages, debt and access. A dispute in one service can follow you into the others.',presence:'Headquarters · Financial District',clue:'The same account mark on a payslip and a locked door.'},
 {id:'home',name:'Forma',domain:'Homes & domestic devices',promise:'Home takes care of you.',control:'Leased apartments, chipped appliances and occupancy cameras. A missed payment can make your own kitchen unavailable.',presence:'Headquarters · Mission Bay',clue:'A working stove waiting for permission.'},
 {id:'food',name:'Plenty',domain:'Food & distribution',promise:'Enough for everyone.',control:'Automated grocery stores accept authenticated digital payments only. Plenty requires an active Index account; a locked account leaves food on the shelf. Independent roadside traders still take cash, useful work and barter.',presence:'Headquarters · South of Market',clue:'A face scan between a hungry person and a full shelf.'},
 {id:'watch',name:'Halo',domain:'Surveillance & prediction',promise:'A city that understands you.',control:'Cameras, household sensors and risk scores. Private movement becomes a suspicious gap in the record.',presence:'Headquarters · Transbay',clue:'A camera above the sign promising privacy.'},
 {id:'travel',name:'Span',domain:'Roads & freight',promise:'Freedom to move.',control:'Automated transport, tolls and travel permissions. The fastest road is also the easiest place to find you.',presence:'Pacific control center · the Embarcadero',clue:'An exit lane closing after a plate scan.'},
 {id:'work',name:'Loop',domain:'Work & personal devices',promise:'Your potential. Connected.',control:'Most viable work arrives through a company device. Availability checks, short contracts and equipment charges keep households dependent.',presence:'Headquarters · South of Market',clue:'An extra shift that barely covers the day’s deductions.'},
 {id:'care',name:'Vita',domain:'Health & insurance',promise:'Care without uncertainty.',control:'Treatment and medicine depend on automated eligibility. Staff who override a denial risk their own access.',presence:'Clinical systems campus · Mission Bay',clue:'Medicine in stock, treatment declined.'},
 {id:'power',name:'Core',domain:'Power, water & machines',promise:'Always on. Always there.',control:'Licensed utilities and sealed equipment. Repairing something you already paid for becomes a contract violation.',presence:'West Coast command · Potrero Point',clue:'An intact pump with its service entitlement revoked.'},
 {id:'enforcement',name:'Civic',domain:'Enforcement & detention',promise:'Keeping everyone safe.',control:'Municipal contracts let recovery squads enforce debt and relocation orders. Its Collectors turn account penalties into physical custody.',presence:'Regional command · Hunters Point',clue:'An amber recovery truck towing a household cityward.'}
];
export const WORLD_PREMISE='San Francisco, 2041. Nine technology corporations dominate daily life. Different logos; shared accounts. Cameras watch the streets and homes. Food, rent, taxes and mandatory fees climb faster than wages. Work for their system, or lose access to the things you need.';

// Compatibility for authored text already stored in v7 saves. Never rename a
// physical relay or a legacy place name merely because it resembles a brand.
const formerNames={Continuum:'Index',Vesper:'Forma',Lattice:'Halo',Meridian:'Span',Helix:'Vita',Aster:'Core','Bastion Civic':'Civic',Bastion:'Civic'};
export function currentCompanyCopy(text){
 if(typeof text!=='string')return text;
 return text.replace(/\b(Bastion Civic|Bastion|Continuum|Vesper|Lattice|Meridian|Helix|Aster)\b/g,name=>formerNames[name])
  .replace(/\bRelay(?=[’']s| (?:depot|billboard|company|contract|device)\b)/g,'Loop')
  .replace(/\bMorrow(?= (?:food|store|distribution|contract|company)\b)/g,'Plenty')
  .replace(/\b([Aa]) Index\b/g,(_,a)=>a+'n Index')
  .replace(/\b([Aa])n Core\b/g,(_,a)=>a+' Core');
}
