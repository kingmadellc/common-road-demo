import {currentCompanyCopy} from './institutions.js?v=0.8.9-sequence-1';
// Authoritative origin and discovery order. See Design/Signals-End-Canon.md.
export const NARRATIVE_REVISION=8;
export const RADIO_LINES=Object.freeze([
 'Ozark relay. For anyone still awake.',
 'Your score doesn’t follow you here. You can work, buy, and sell without a screen saying yes.',
 'Fix a pump. Grow something. Teach a kid. Take cash, trade, charge for your work. What you know is worth something here.',
 'Taxes are low. They’re posted at the hall. There’s land to buy or lease, and lots you can build on.',
 'No phones. No computers. Bring what you know. Ask the people who still fix things about Signals End.'
]);
export const RADIO_MESSAGE=RADIO_LINES.join(' ');
// The contractor pays physical cash; a corporate wage deposit would stay frozen.
export const DEPOT_OFFER='An independent freight contractor at a Travel depot needs help to sort damaged freight. Four hours, $60 in cash, off the books. The depot’s sign-in camera still records your face and the van’s plate.';
export const ORIGIN='San Francisco, 2041. Nine mandatory apps put pay, food and housing behind one ID and a social credit score. Private companies built them; the government made them compulsory and handed more decisions to AI. A low score can stop someone buying dinner even with money in the account. On Ben’s routine parts pickup for Jack, Bea hid an unconnected shortwave radio among the scrap. Ben smuggled it past inspections and building cameras, then cleaned a battery contact and secured its aerial lead. After midnight, he and Sarah heard a voice claiming to come from the Ozarks: work, trade and land without a screen deciding who was allowed. For three nights, Jack saw a future and Sarah questioned the promise. She wanted somewhere safe first; they could make a plan once they were there. After three nights of debate, Jack refused to certify a machine with a broken safety cutoff. His employer fired him and filed an adverse compliance report through Work. The shared household score fell below the access threshold. Cash held their joint funds. Sarah still had her job, but could not spend her wages. Food declined their groceries. Home demanded the staff-flat keys by 06:00; an appeal would take at least 72 hours. Work offered restoration shifts and a score review. Sarah chose to leave: get the children and return to Bea across the Bay. She supplied the receiver and might know more. Ten minutes to load the basics. They had $240 from Jack’s parts tin, an old workshop van that could run mechanically, and no proof that Signals End existed.';
export const initialNarrativeFlags=()=>({narrativeRevision:NARRATIVE_REVISION,radioHeard:true,contractFlag:true,accountRestricted:true});
export function arriveNarrative(s,id){
 if(id==='yard'){s.flags.inquirySent=true;s.flags.convoyKnown=true;if(!s.flags.permitExplained){s.flags.permitExplained=true;s.journal.unshift({hour:s.hour,title:'Bea’s paper permit',body:'Bea signs a county repair-transfer permit. Older county rules still allow one passage to a repair stop, even with a relocation order. Present it and the scanner records the plate; use a side road and keep it. “Paper buys you one argument,” she says. “Not two.”'});}}
 if(id==='river')s.flags.frankWitnessed=true;
 if(id==='plains')s.flags.reservationConfirmed=true;
}
export function knowledge(s){
 if(s.mode==='home'||s.ending?.owned)return {stage:'arrived',title:'A life we can switch off',text:'The broadcast was real. Work ends. The lights stay on. Nobody is checking whether the household is still eligible.'};
 if(s.flags.reservationConfirmed)return {stage:'confirmed',title:'Frank answered',text:'At North Platte, Frank answered Sarah’s private family question. He reserved a home. A witness or the filter delivery completes the agreement.'};
 if(s.flags.frankWitnessed)return {stage:'witness',title:'The first evidence',text:'June’s photograph puts Uncle Frank inside Signals End. Freight-radio relays carry Sarah’s question. A courier will record any answer at North Platte.'};
 if(s.flags.inquirySent)return {stage:'inquiry',title:'Someone who still fixes things',text:'Bea’s freight contacts radioed Sarah’s private question. June at Truckee may know where Uncle Frank went. The next Ava convoy leaves in five days.'};
 return {stage:'rumor',title:'Back to Bea',text:'Ben smuggled Bea’s radio home and got it working. He and Sarah heard a voice claiming there was work, trade and land in the Ozarks without a score deciding who could take part. Sarah is not convinced. Jack’s employer report has now pushed their household score below the access threshold: money held, groceries refused, a flat to leave before an appeal. They are returning to Bea, who supplied the receiver, to get safe and make a plan. The broadcast still needs proof.'};
}
export function migrateNarrative(s){
 if(s.flags.narrativeRevision===NARRATIVE_REVISION)return refreshCompanyCopy(s);
 // The origin and evidence gates are retained. Revisions six and seven need contextual copy only;
 // do not archive its correct origin or infer new progress from visited nodes.
 if([6,7].includes(s.flags.narrativeRevision)){s.flags.narrativeRevision=NARRATIVE_REVISION;return refreshCompanyCopy(s);}
 // These revisions already have the correct evidence order. Preserve progress.
 if([2,3,4,5].includes(s.flags.narrativeRevision)){
  s.flags.narrativeRevision=NARRATIVE_REVISION;s.flags.contractFlag=true;s.flags.accountRestricted=true;
  let replacedBroadcast=false;
  for(const entry of s.journal||[]){
   if(entry.earlierStoryDraft)continue;
   if(['The night the radio came on','Three nights before the road'].includes(entry.title)){entry.earlierStoryDraft=true;}
   if(entry.title==='Why we left'){entry.earlierStoryDraft=true;}
   if(entry.title==='Ben’s handwritten broadcast'&&entry.body!==RADIO_MESSAGE){entry.earlierStoryDraft=true;replacedBroadcast=true;}
   if(entry.title==='The story so far')entry.body=ORIGIN+' '+knowledge(s).text;
  }
  if(replacedBroadcast)s.journal.unshift({hour:s.hour,title:'Ben’s handwritten broadcast',body:RADIO_MESSAGE});
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
 if(s.incident?.collectors)s.incident.body='Safety checks restricted standing and relocation orders. A recovery truck blocks the exit. A recorded plate can follow you; a county road may still get you clear.';
 if(s.activity?.phase==='intercept'&&s.mode==='salvage')s.activity.notice='“Mercer household. Your return order is active.” The plate scan matched a relocation order. Safety wants the family back in its assigned district.';
 for(const entry of s.journal)entry.earlierStoryDraft=true;
 s.journal.unshift({hour:s.hour,title:'The story so far',body:ORIGIN+' '+knowledge(s).text});
 if(!s.reel.gallery.includes('broadcast'))s.reel.gallery.unshift('broadcast');
 return refreshCompanyCopy(s);
}

// Exact authored phrases only. Never alter a choice, its costs, a timestamp or
// an archived earlier draft while bringing a suspended journey up to date.
const JOURNEY_COPY=[
 ['On the fourth morning,','After three nights of debate,'],
 ['Bea hid an unconnected shortwave radio among repair parts.','On Ben’s routine parts pickup for Jack, Bea hid an unconnected shortwave radio among the scrap.'],
 ['Sarah chose to leave: get the children and ask Bea across the Bay.','Sarah chose to leave: get the children and return to Bea across the Bay. She supplied the receiver and might know more.'],
 ['Bea first; then a plan.','Back to Bea, who gave Ben the radio; then a plan.'],
 ['Debt and unauthorized relocation give its Collectors the paperwork.','A restricted household leaving its assigned district gives the Collectors their paperwork.'],
 ['Their debt has acquired a transport fee.','Their return order has acquired a transport fee.'],
 ['unauthorized relocation, debt outstanding','restricted standing, unauthorized relocation'],
 ['Rent arrears are the return warrant.','Restricted standing and unauthorized relocation are enough for a return order.'],
 ['Safety checks household debt and relocation orders.','Safety checks restricted standing and relocation orders.'],
 ['Housing debt becomes a compulsory company contract. Everyone survives; the cameras are waiting.','Restoration shifts come before another access review. Everyone survives; the cameras are waiting.'],
 ['Evelyn releases their household reservation.','Evelyn records their agreement and clears them to cross.'],
 ['Ben recognizes the old water wheels from the broadcast. This time he is here.','Ben reads his paper note: “What you know is worth something here.” Jack puts his wrench on the kitchen shelf. Tomorrow someone will need it. Tonight can wait.'],
 ['Ben: “The old wheels. He said that.”','Ben: “No screens. He meant it.”'],
 ['Sarah checks the family password in the margin.','Sarah checks his answer to the private family question she sent through Bea.'],
 ['Four hours of sleep; nobody docked their pay.','Four hours of sleep; nobody asked them to account for it.']
];
function refreshCompanyCopy(s){
 const rewrite=(record,fields)=>{if(record)for(const key of fields)if(typeof record[key]==='string')record[key]=JOURNEY_COPY.reduce((text,[before,after])=>text.replaceAll(before,after),currentCompanyCopy(record[key]));};
 rewrite(s,['message']);rewrite(s.incident,['title','body']);rewrite(s.activity,['notice']);
 rewrite(s.ending,['title','text']);
 if(s.incident?.id==='orchestration-offer')s.incident.body=DEPOT_OFFER;
 for(const entry of s.journal||[])if(!entry.earlierStoryDraft)rewrite(entry,['title','body']);
 return s;
}
