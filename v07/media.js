// A location is a continuous environment. Narrative photographs have their own
// compositions, and the reel may present each photograph only once per run.
export const JOURNEY_ART=['witness','reply','headlamp','reunion','room-key','pump-work','filter-delivery','annie-sky','hunt-meal','bea-road','night-watch','plains-water','ozark-water','pump-water','road-high-country','road-repair-country','road-freight-country','road-ozark-woods','glenn-station','freight-stop','road-convoy','truckee-camp','wells-court','rawlins-shelter','ava-camp'];
export const STILL_ROADS={opening:'logistics',r1:'highway','desert-road':'plateau','divide-road':'road-high-country','plains-road':'prairie',r2:'road-repair-country',r3:'road-freight-country',r4:'road-ozark-woods',r5:'road-convoy',r6:'storm',recovery:null};
export const STOP_ART={yard:'yard',river:'truckee-camp',desert:'wells-court',divide:'rawlins-shelter',plains:'market',pump:'glenn-station',freight:'freight-stop',ridge:'ava-camp',line:'gate'};
export const WATER_ART={river:'fishing',plains:'plains-water',pump:'pump-water',ridge:'ozark-water'};
export const SITE_ART={...STOP_ART,river:'fuelYard'};
export function narrativeKey(shot){return shot?.film&&!['rain','scanner','barrier'].includes(shot.film)?'film:'+shot.film:shot?.image?'still:'+shot.image:null;}
export function mediaMemory(s,shots){
 if(!Array.isArray(s.reel.presented))s.reel.presented=[...new Set(s.reel.gallery.filter(id=>id!=='broadcast').map(id=>narrativeKey(shots[id])).filter(Boolean))];
 return s.reel.presented;
}
export function claimNarrative(s,shot,shots){const key=narrativeKey(shot),seen=mediaMemory(s,shots);if(!key||seen.includes(key))return false;seen.push(key);return true;}
export function roadEnvironment(s){const r=s.road;return {image:STILL_ROADS[r?.id]??null,region:r?.id||s.node,weather:r?.kind==='storm'?'rain':s.node==='divide'?'wind':'clear',seed:s.seed+(r?.id||'').split('').reduce((n,c)=>n+c.charCodeAt(0),0)};}
