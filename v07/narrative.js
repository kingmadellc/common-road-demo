import {currentCompanyCopy} from './institutions.js?v=0.8.0-hunt-1';
// Authoritative origin and discovery order. See Design/Signals-End-Canon.md.
export const NARRATIVE_REVISION=3;
export const RADIO_MESSAGE='For anyone still awake. East of the plains, the old wheels are turning. No accounts. No computers. Find the people who still fix things. Ask about Signals End.';
export const ORIGIN='San Francisco, 2041. Nine corporations keep daily life behind screens, cameras and accounts. Rent, food and taxes swallow Jack and Sarah’s pay. Jack keeps checking work after his shift; at home he misses whole conversations. He wants a simpler life, but neither of them believes one is still possible. Bea smuggled a radio in among repair parts. Ben tried the dial after midnight and heard about Signals End. Jack wants to find it. Sarah is angry at the years they have lost, intrigued, and unwilling to gamble the children on a stranger’s word. They argue for three nights and make a list of questions. Their first agreement: go across the Bay and ask Bea. They pack for a longer journey in case her answers hold up.';
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
 return {stage:'rumor',title:'Bea first',text:'Ben heard a place called Signals End on Bea’s smuggled radio. Jack wants to go. Sarah wants answers. After three nights of arguing, they agree to ask Bea in person. Nothing is confirmed.'};
}
export function migrateNarrative(s){
 if(s.flags.narrativeRevision===NARRATIVE_REVISION)return refreshCompanyCopy(s);
 // Revision 2 already has the correct evidence order. Update only its origin entries.
 if(s.flags.narrativeRevision===2){
  s.flags.narrativeRevision=NARRATIVE_REVISION;
  for(const entry of s.journal||[]){
   if(entry.earlierStoryDraft)continue;
   if(entry.title==='The night the radio came on'){entry.title='Three nights before the road';entry.body=ORIGIN;}
   if(entry.title==='The story so far')entry.body=ORIGIN+' '+knowledge(s).text;
  }
  return refreshCompanyCopy(s);
 }
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
