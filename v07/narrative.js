import {currentCompanyCopy} from './institutions.js?v=0.7.5-names-1';
// Authoritative origin and discovery order. See Design/Signals-End-Canon.md.
export const NARRATIVE_REVISION=2;
export const RADIO_MESSAGE='For anyone still awake. East of the plains, the old wheels are turning. No accounts. No computers. Find the people who still fix things. Ask about Signals End.';
export const ORIGIN='San Francisco, 2041. Nine technology corporations control the services people need. Screens, cameras and chipped machines watch daily life. Jack and Sarah work their contracts, but rent, food, taxes and fees keep rising. One disputed bill can lock the household out. Bea smuggled in an analog radio among repair parts. After midnight, Ben heard a voice speaking about Signals End. The family leaves with his handwritten clue, an old van and no promise of safety.';
export const initialNarrativeFlags=()=>({narrativeRevision:NARRATIVE_REVISION,radioHeard:true});
export function arriveNarrative(s,id){
 if(id==='yard'){s.flags.inquirySent=true;s.flags.convoyKnown=true;}
 if(id==='river')s.flags.frankWitnessed=true;
 if(id==='plains')s.flags.reservationConfirmed=true;
}
export function knowledge(s){
 if(s.mode==='home'||s.ending?.owned)return {stage:'arrived',title:'A life we can switch off',text:'The broadcast was real. Work ends. The lights stay on. Nobody is checking whether the household is still eligible.'};
 if(s.flags.reservationConfirmed)return {stage:'confirmed',title:'Frank answered',text:'At North Platte, Frank answered Sarah’s private family question. He reserved a home. A witness or the filter delivery completes the agreement.'};
 if(s.flags.frankWitnessed)return {stage:'witness',title:'The first evidence',text:'June’s photograph puts Uncle Frank inside Signals End. Freight-radio relays carry Sarah’s question. A courier will record any answer at North Platte.'};
 if(s.flags.inquirySent)return {stage:'inquiry',title:'Someone who still fixes things',text:'Bea’s freight contacts radioed Sarah’s private question. June at Truckee may know where Uncle Frank went. The next Ava convoy leaves in five days.'};
 return {stage:'rumor',title:'The voice Ben found',text:'A smuggled radio. A place called Signals End. No proof yet. Bea sent the receiver; she is the first person to ask.'};
}
export function migrateNarrative(s){
 if(s.flags.narrativeRevision===NARRATIVE_REVISION)return refreshCompanyCopy(s);
 // Narrative-only migration: no clock, supplies, cargo, choices or save key reset.
 const passed=new Set(s.visited||[]);
 s.flags.narrativeRevision=NARRATIVE_REVISION;s.flags.radioHeard=true;
 if(s.mode!=='packing'&&s.road?.id!=='opening'){s.flags.inquirySent=true;s.flags.convoyKnown=true;}
 if(passed.has('river')||s.reel.seen.includes('sierra-letter'))s.flags.frankWitnessed=true;
 if(['plains','pump','freight','ridge','line'].some(id=>passed.has(id)||s.node===id)||s.sponsor||s.cargo)s.flags.reservationConfirmed=true;
 // A saved incident may still carry authored copy from the older origin.
 if(s.incident?.id==='orchestration-offer'){
  s.incident.title='Good pay. Small print.';
  s.incident.body='A Loop depot needs workers to sort damaged freight the machines rejected. Four hours could buy fuel and food. Sign-in requires a face scan and the van’s plate.';
  for(const o of s.incident.options||[])o.label=o.id==='careful'?'Take the depot shift':'Keep driving';
 }
 if(s.incident?.collectors)s.incident.body='Civic checks household debt and relocation orders. A recovery truck blocks the exit. A recorded plate can follow you; a county road may still get you clear.';
 if(s.activity?.phase==='intercept'&&s.mode==='salvage')s.activity.notice='“Mercer household. Your return order is active.” The plate scan matched a relocation order. Civic wants the family back in its assigned district.';
 for(const entry of s.journal)entry.earlierStoryDraft=true;
 s.journal.unshift({hour:s.hour,title:'The story so far',body:ORIGIN+' '+knowledge(s).text});
 if(!s.reel.gallery.includes('broadcast'))s.reel.gallery.unshift('broadcast');
 return refreshCompanyCopy(s);
}

function refreshCompanyCopy(s){
 const rewrite=(record,fields)=>{if(record)for(const key of fields)if(typeof record[key]==='string')record[key]=currentCompanyCopy(record[key]);};
 rewrite(s,['message']);rewrite(s.incident,['title','body']);rewrite(s.activity,['notice']);
 for(const entry of s.journal||[])if(!entry.earlierStoryDraft)rewrite(entry,['title','body']);
 return s;
}
