import {currentCompanyCopy} from './institutions.js?v=0.8.4-apps-1';
// Authoritative origin and discovery order. See Design/Signals-End-Canon.md.
export const NARRATIVE_REVISION=5;
export const RADIO_MESSAGE='For anyone still awake. East of the plains, the old wheels are turning. No accounts. No computers. Find the people who still fix things. Ask about Signals End.';
// The contractor pays physical cash; a corporate wage deposit would stay frozen.
export const DEPOT_OFFER='An independent freight contractor at a Travel depot needs help to sort damaged freight. Four hours, $60 in cash, off the books. The depot’s sign-in camera still records your face and the van’s plate.';
export const ORIGIN='San Francisco, 2041. Nine mandatory apps put pay, food and housing behind one ID. Private companies built them; the government made them compulsory and handed more decisions to AI. Bea smuggled a radio in with repair parts. Ben heard about Signals End after midnight. For three nights, Jack and Sarah argued over whether a simpler life could be real. On the fourth morning, his workshop supervisor ordered Jack to certify a machine with a broken safety cutoff. He refused. His employer fired him and filed a disputed charge through Work. Cash automatically froze their joint wage wallet under the shared government rules. Sarah still had her job, but could not use her pay. Food declined their groceries. Home said their job-linked flat had to be surrendered by 06:00; the earliest appeal was in 72 hours. That evening Sarah made the decision: get the children and ask Bea across the Bay. Ten minutes to load the basics. They had $240 from Jack’s parts tin, an old mechanical van, and no promise that the radio was telling the truth.';
export const initialNarrativeFlags=()=>({narrativeRevision:NARRATIVE_REVISION,radioHeard:true,contractFlag:true,accountRestricted:true});
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
 return {stage:'rumor',title:'Bea first',text:'Ben heard a place called Signals End on Bea’s smuggled radio. Jack wants to go. Sarah wants answers. After three nights of arguing, Jack’s employer fires him and Cash freezes their joint wallet. Their housing deadline comes before an appeal. They load the van and go to Bea. Nothing beyond that is confirmed.'};
}
export function migrateNarrative(s){
 if(s.flags.narrativeRevision===NARRATIVE_REVISION)return refreshCompanyCopy(s);
 // These revisions already have the correct evidence order. Preserve progress.
 if([2,3,4].includes(s.flags.narrativeRevision)){
  s.flags.narrativeRevision=NARRATIVE_REVISION;s.flags.contractFlag=true;s.flags.accountRestricted=true;
  for(const entry of s.journal||[]){
   if(entry.earlierStoryDraft)continue;
   if(['The night the radio came on','Three nights before the road'].includes(entry.title)){entry.earlierStoryDraft=true;}
   if(entry.title==='Why we left'){entry.earlierStoryDraft=true;}
   if(entry.title==='The story so far')entry.body=ORIGIN+' '+knowledge(s).text;
  }
  s.journal.unshift({hour:s.hour,title:'Why we left',body:ORIGIN});
  return refreshCompanyCopy(s);
 }
 // Narrative-only migration: no clock, supplies, cargo, choices or save key reset.
 const passed=new Set(s.visited||[]);
 s.flags.narrativeRevision=NARRATIVE_REVISION;s.flags.radioHeard=true;s.flags.contractFlag=true;s.flags.accountRestricted=true;
 if(s.mode!=='packing'&&s.road?.id!=='opening'){s.flags.inquirySent=true;s.flags.convoyKnown=true;}
 if(passed.has('river')||s.reel.seen.includes('sierra-letter'))s.flags.frankWitnessed=true;
 if(['plains','pump','freight','ridge','line'].some(id=>passed.has(id)||s.node===id)||s.sponsor||s.cargo)s.flags.reservationConfirmed=true;
 // A saved incident may still carry authored copy from the older origin.
 if(s.incident?.id==='orchestration-offer'){
  s.incident.title='Good pay. Small print.';
  s.incident.body=DEPOT_OFFER;
  for(const o of s.incident.options||[])o.label=o.id==='careful'?'Take the depot shift':'Keep driving';
 }
 if(s.incident?.collectors)s.incident.body='Safety checks household debt and relocation orders. A recovery truck blocks the exit. A recorded plate can follow you; a county road may still get you clear.';
 if(s.activity?.phase==='intercept'&&s.mode==='salvage')s.activity.notice='“Mercer household. Your return order is active.” The plate scan matched a relocation order. Safety wants the family back in its assigned district.';
 for(const entry of s.journal)entry.earlierStoryDraft=true;
 s.journal.unshift({hour:s.hour,title:'The story so far',body:ORIGIN+' '+knowledge(s).text});
 if(!s.reel.gallery.includes('broadcast'))s.reel.gallery.unshift('broadcast');
 return refreshCompanyCopy(s);
}

function refreshCompanyCopy(s){
 const rewrite=(record,fields)=>{if(record)for(const key of fields)if(typeof record[key]==='string')record[key]=currentCompanyCopy(record[key]);};
 rewrite(s,['message']);rewrite(s.incident,['title','body']);rewrite(s.activity,['notice']);
 if(s.incident?.id==='orchestration-offer')s.incident.body=DEPOT_OFFER;
 for(const entry of s.journal||[])if(!entry.earlierStoryDraft)rewrite(entry,['title','body']);
 return s;
}
