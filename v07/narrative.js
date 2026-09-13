// Authoritative origin and discovery order. See Design/Signals-End-Canon.md.
export const NARRATIVE_REVISION=1;
export const RADIO_MESSAGE='For anyone still awake. East of the plains, the old wheels are turning. No accounts. No computers. Find the people who still fix things. Ask about Signals End.';
export const ORIGIN='San Francisco, 2041. Major tech firms offered the only wages close to living costs. Rent, food and taxes swallowed Jack and Sarah’s orchestration pay. Cameras watched them supervise the agents that replaced their old jobs. Bea smuggled a radio in with repair parts. Ben found the broadcast after midnight. They choose to leave before the next shift.';
export const initialNarrativeFlags=()=>({narrativeRevision:NARRATIVE_REVISION,radioHeard:true});
export function arriveNarrative(s,id){
 if(id==='yard'){s.flags.inquirySent=true;s.flags.convoyKnown=true;}
 if(id==='river')s.flags.frankWitnessed=true;
 if(id==='plains')s.flags.reservationConfirmed=true;
}
export function knowledge(s){
 if(s.mode==='home'||s.ending?.owned)return {stage:'arrived',title:'A life we can switch off',text:'The broadcast was real. Work ends. The lights stay on. Nobody is watching for the next approval.'};
 if(s.flags.reservationConfirmed)return {stage:'confirmed',title:'Frank answered',text:'At North Platte, Frank answered Sarah’s private family question. He reserved a home. A witness or the filter delivery completes the agreement.'};
 if(s.flags.frankWitnessed)return {stage:'witness',title:'The first evidence',text:'June’s photograph puts Uncle Frank inside Signals End. Sarah’s inquiry is traveling through the freight network. Any reply will wait at North Platte.'};
 if(s.flags.inquirySent)return {stage:'inquiry',title:'Someone who still fixes things',text:'Bea sent Sarah’s inquiry through the freight network. June at Truckee may know where Uncle Frank went. The next Ava convoy leaves in five days.'};
 return {stage:'rumor',title:'The voice Ben found',text:'A smuggled radio. A place called Signals End. No proof yet. Bea sent the receiver; she is the first person to ask.'};
}
export function migrateNarrative(s){
 if(s.flags.narrativeRevision===NARRATIVE_REVISION)return s;
 // Narrative-only migration: no clock, supplies, cargo, choices or save key reset.
 const passed=new Set(s.visited||[]);
 s.flags.narrativeRevision=NARRATIVE_REVISION;s.flags.radioHeard=true;
 if(s.mode!=='packing'&&s.road?.id!=='opening'){s.flags.inquirySent=true;s.flags.convoyKnown=true;}
 if(passed.has('river')||s.reel.seen.includes('sierra-letter'))s.flags.frankWitnessed=true;
 if(['plains','pump','freight','ridge','line'].some(id=>passed.has(id)||s.node===id)||s.sponsor||s.cargo)s.flags.reservationConfirmed=true;
 for(const entry of s.journal)entry.earlierStoryDraft=true;
 s.journal.unshift({hour:s.hour,title:'The story so far',body:ORIGIN+' '+knowledge(s).text});
 if(!s.reel.gallery.includes('broadcast'))s.reel.gallery.unshift('broadcast');
 return s;
}
