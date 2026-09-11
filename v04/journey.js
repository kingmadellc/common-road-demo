export const SHOTS={
 cabin:{image:'cabin',title:'The people in the back seat',line:'Annie: “At the new place, can Rusty sleep in my room?”',speaker:'annie'},
 roadside:{image:'roadside',title:'Service suspended',line:'A light is still on in the old repair stall. Somebody stayed.',speaker:'jack'},
 dinner:{image:'dinner',title:'Something we made ourselves',line:'Ben: “I caught it. Dad only helped with the pan.”',speaker:'ben'},
 family:{image:'familyPhoto',title:'Everyone who needs to make it',line:'Sarah: “Keep this one. We’ll need something for the wall.”',speaker:'sarah'},
 collectors:{image:'collectors',title:'Household continuity',line:'Frank: “Amber lights. Don’t let them scan your plate.”',speaker:'jack'},
 relief:{image:'cabin',title:'The engine holds its note',line:'Sarah: “They’re gone. Everybody breathe.”',speaker:'sarah'},
 home:{image:'home',title:'Beyond the Line',line:'A door, a garden, and work you get to choose.',speaker:'jack'}
};
export function showStory(s,id,returnMode='stop'){
 s.story={id,returnMode,elapsed:0};s.mode='story';s.reel.seen.includes(id)||s.reel.seen.push(id);s.reel.gallery.includes(id)||s.reel.gallery.push(id);
}
export function roadShots(s,r){
 const ids=r.id==='opening'?['cabin']:r.id==='r1'?[s.threat.firstEncounter?'relief':'cabin','roadside']:r.id==='r6'?['home','family']:[s.flags.fishDinner?'dinner':'family','roadside'];
 return ids.map((id,i)=>({id,at:9+i*23,shown:false}));
}
export function updateReel(s,dt){
 const r=s.road;if(!r)return;
 if(r.shot){r.shot.elapsed+=dt;if(r.shot.elapsed>=4.8)r.shot=null;return;}
 const next=r.shots?.find(x=>!x.shown&&r.elapsed>=x.at);
 if(next){next.shown=true;r.shot={id:next.id,elapsed:0};if(!s.reel.gallery.includes(next.id))s.reel.gallery.push(next.id);}
}
