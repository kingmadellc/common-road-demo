// Scene-local effects share the gameplay AudioContext; this module never unlocks it.
export const DEPARTURE_AUDIO=Object.freeze(Object.fromEntries([
 ['refusal',7],['dismissed',6],['account',9],['appeal',7],['decision',8],
 ['bag',2.4],['load',3.1],['children',3.5],['last-look',2]
].map(([id,seconds])=>[id,{url:'assets/opening-087/departure-'+id+'.m4a',seconds}])));

export function createDepartureAudio(context,outputs,{loadBuffer,notify=()=>{}}){
 const cache=new Map(),pending=new Set(),failed=new Set();
 let scene=null,currentPlan=null,source=null,startedAt=0,startOffset=0,cursor=0,completed=false,lastElapsed=0;
 function position(){return source?startOffset+Math.max(0,context.currentTime-startedAt):cursor;}
 function stop(){
  if(!source)return;
  cursor=position();const old=source;source=null;
  try{old.stop();}catch{}old.disconnect();
 }
 function reset(){stop();scene=null;currentPlan=null;cursor=0;completed=false;lastElapsed=0;}
 function request(id){
  if(cache.has(id)||pending.has(id)||failed.has(id))return;
  pending.add(id);
  Promise.resolve().then(()=>loadBuffer(DEPARTURE_AUDIO[id].url)).then(buffer=>{
   cache.set(id,buffer);
  }).catch(()=>{failed.add(id);notify('unavailable:departure:'+id);}).finally(()=>pending.delete(id));
  // Never start inside a load callback. A later frame rechecks visibility, scene,
  // user activation and the current elapsed time after the decode has finished.
 }
 function update(plan){
  if(!plan||!DEPARTURE_AUDIO[plan.scene]){reset();return;}
  if(scene!==plan.scene){reset();scene=plan.scene;cursor=plan.elapsed;lastElapsed=plan.elapsed;}
  const sought=Math.abs(plan.elapsed-lastElapsed)>.35;
  currentPlan=plan;lastElapsed=plan.elapsed;
  if(sought){stop();cursor=plan.elapsed;completed=false;}
  if(!plan.audible||context.state!=='running'){stop();return;}
  request(scene);const buffer=cache.get(scene);if(!buffer)return;
  const duration=Math.min(buffer.duration,DEPARTURE_AUDIO[scene].seconds);
  if(!(duration>0))return;
  if(source&&plan.followClock&&Math.abs(position()-plan.elapsed)>.35)stop();
  if(source)return;
  let offset=plan.followClock?plan.elapsed:cursor;
  if(plan.loop)offset=((offset%duration)+duration)%duration;
  else if(completed||offset>=duration){completed=true;return;}
  const next=context.createBufferSource();next.buffer=buffer;next.loop=plan.loop;
  if(plan.loop){next.loopStart=0;next.loopEnd=duration;}
  next.connect(plan.loop?outputs.ambience:outputs.effects);
  source=next;startOffset=offset;startedAt=context.currentTime;
  next.onended=()=>{next.disconnect();if(source!==next)return;source=null;cursor=duration;completed=true;};
  if(plan.loop)next.start(context.currentTime,offset);else next.start(context.currentTime,offset,duration-offset);
  notify('departure:'+scene);
 }
 function state(){const duration=scene?DEPARTURE_AUDIO[scene].seconds:0,p=position();return {scene,playing:!!source,offset:Number((currentPlan?.loop&&duration?p%duration:p).toFixed(3)),loop:!!currentPlan?.loop,loaded:[...cache.keys()],pending:[...pending],failed:[...failed]};}
 return {update,stop,state};
}
