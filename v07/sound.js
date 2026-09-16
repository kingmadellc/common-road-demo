import {soundSnapshot,transitionSounds,soundMix,departureAudioPlan} from './sound-model.js?v=0.8.8-story-1';
import {createDepartureAudio} from './departure-audio.js?v=0.8.8-story-1';
const GROUPS={metal:3,cloth:3,wood:3,step:3,latch:2,paper:3,switch:3};
let ac,master,foley,ambient,music,limiter,engine,engineHarmonic,noise,meter,previous,enabled=false,loading,departureAudio;
const buffers={},layers={},voices=new Set(),recent=[],next={tool:0,reel:0,step:0},variants={};
let mix={audible:false},scoreSource;const scoreSources=new WeakMap();
const note=(id)=>{recent.push({id,time:Number(ac.currentTime.toFixed(2))});if(recent.length>32)recent.shift();};
function target(param,value,tau=.12){param.setTargetAtTime(value,ac.currentTime,tau);}
function layer(name,source,type,frequency){const filter=ac.createBiquadFilter(),gain=ac.createGain();filter.type=type;filter.frequency.value=frequency;gain.gain.value=0;source.connect(filter).connect(gain).connect(ambient);layers[name]={filter,gain};}
function init(){
 if(ac)return;
 const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
 ac=new Context();master=ac.createGain();master.gain.value=0;foley=ac.createGain();ambient=ac.createGain();music=ac.createGain();limiter=ac.createDynamicsCompressor();limiter.threshold.value=-10;limiter.knee.value=10;limiter.ratio.value=8;limiter.attack.value=.003;limiter.release.value=.16;
 foley.connect(master);ambient.connect(master);music.connect(limiter);master.connect(limiter);meter=ac.createAnalyser();meter.fftSize=2048;limiter.connect(meter).connect(ac.destination);music.gain.value=.65;
 departureAudio=createDepartureAudio(ac,{effects:foley,ambience:ambient},{loadBuffer:async url=>{const response=await fetch(url);if(!response.ok)throw Error('Departure SFX '+response.status);return ac.decodeAudioData(await response.arrayBuffer());},notify:note});
 // Uneven low combustion pulses, filtered air and tire hiss. No melodic drone.
 engine=ac.createOscillator();const real=new Float32Array(17),imag=new Float32Array(17);for(let i=1;i<17;i++)imag[i]=(i%2?1:.35)/i;engine.setPeriodicWave(ac.createPeriodicWave(real,imag));layer('engine',engine,'lowpass',210);engine.start();
 engineHarmonic=ac.createOscillator();engineHarmonic.type='triangle';layer('rattle',engineHarmonic,'lowpass',450);engineHarmonic.start();
 const b=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate),d=b.getChannelData(0);let pink=0;for(let i=0;i<d.length;i++){pink=.96*pink+(Math.random()*2-1)*.12;d[i]=pink;}
 noise=ac.createBufferSource();noise.buffer=b;noise.loop=true;for(const [name,type,hz] of [['wind','lowpass',700],['tires','highpass',1000],['water','bandpass',1400],['rain','highpass',2400]])layer(name,noise,type,hz);noise.start();
 loading=Promise.all(Object.entries(GROUPS).flatMap(([kind,count])=>Array.from({length:count},async(_,i)=>{const id=kind+'-'+(i+1);try{const r=await fetch('assets/sfx-086/'+id+'.wav');if(!r.ok)throw Error('SFX '+r.status);buffers[id]=await ac.decodeAudioData(await r.arrayBuffer());}catch{note('unavailable:'+id);}})));
}
function choose(kind){const count=GROUPS[kind];variants[kind]=(variants[kind]??-1)+1;return buffers[kind+'-'+(variants[kind]%count+1)];}
function voice(buffer,gain=.3,rate=1,delay=0){
 if(!buffer||!ac||!enabled||!mix.audible||voices.size>=12)return;
 const src=ac.createBufferSource(),g=ac.createGain();src.buffer=buffer;src.playbackRate.value=rate;g.gain.value=gain;src.connect(g).connect(foley);voices.add(src);src.onended=()=>{voices.delete(src);src.disconnect();g.disconnect();};src.start(ac.currentTime+delay);
}
function sample(kind,gain=.3,rate=1,delay=0){voice(choose(kind),gain,rate*(.97+Math.random()*.06),delay);}
function burst(duration,gain,cutoff,rate=1){
 if(!ac)return;const size=Math.floor(ac.sampleRate*duration),b=ac.createBuffer(1,size,ac.sampleRate),d=b.getChannelData(0);let last=0;
 for(let i=0;i<size;i++){last+=cutoff*((Math.random()*2-1)-last);d[i]=last*Math.sin(Math.PI*.5*Math.min(1,i/(ac.sampleRate*.007)))*Math.exp(-i/size*5);}
 voice(b,gain,rate);
}
export function playCue(id){
 if(!ac||!enabled||!mix.audible)return;note(id);
 if(['paper','switch','step','wood'].includes(id))sample(id,id==='step'?.3:.22);
 else if(id==='key'){sample('metal',.28,1.4);sample('latch',.18,.8,.12);}
 else if(id==='stow'){sample('cloth',.5,.85);sample('wood',.25,.8,.06);}
 else if(id==='bowl')sample('metal',.22,1.15);
 else if(id==='hook')sample('latch',.17,1.4);
 else if(id==='cast'){sample('cloth',.26,1.4);burst(.22,.22,.7);}
 else if(['splash','bite','net'].includes(id)){burst(id==='net'?.7:.23,id==='bite'?.48:.4,.22);if(id==='net')sample('cloth',.36,.7,.09);}
 else if(id==='safety'){sample('latch',.32,.6);burst(.28,.24,.65);}
 else if(id==='brake'){burst(.65,.38,.09);sample('latch',.3,.65,.12);}
 else if(id==='start'){sample('latch',.27,.7);sample('metal',.27,.6,.11);burst(.6,.27,.045);}
 else if(id==='shot'){burst(.38,.7,.55);sample('latch',.17,.8,.2);burst(.9,.13,.04,.82);}
 else if(id==='scrape'){sample('metal',.45,.65);burst(.38,.28,.3);}
 else if(id==='slip')sample('cloth',.25,1.7);
}
// Called only from a real click/touch/key/controller activation. Reload never autoplays.
export function enableAudio(on){enabled=!!on;if(on){init();ac?.resume().catch(()=>{});}else silence();return loading||Promise.resolve();}
export function unlockAudio(on){if(on)enableAudio(true);}
export function silence(){if(!ac)return;departureAudio?.stop();master.gain.cancelScheduledValues(ac.currentTime);master.gain.setValueAtTime(0,ac.currentTime);for(const src of voices){try{src.stop();}catch{}}mix.audible=false;}
export function soundAction(action,before,after){
 if(!ac||!enabled)return;
 if(['fit','connect','homeItem','pack','buy','sell','delivery'].includes(action.type)&&after.revision!==before.revision)playCue(action.type==='homeItem'?(action.id==='key'?'key':action.id==='lamp'?'switch':action.id==='table'?'bowl':'wood'):action.type==='fit'?'hook':'stow');
}
// Score handoff: one independent bus for the user's licensed score element.
// Its own transport controls it; SFX mute never changes its volume or playback.
export function connectScore(element){init();if(scoreSource)scoreSource.disconnect();scoreSource=scoreSources.get(element);if(!scoreSource){scoreSource=ac.createMediaElementSource(element);scoreSources.set(element,scoreSource);}const source=scoreSource;source.connect(music);return {setVolume:v=>target(music.gain,Math.max(0,Math.min(1,v))),disconnect:()=>source.disconnect()};}
export function soundFrame(s,ui){
 const snapshot=soundSnapshot(s);if(!ac){previous=snapshot;return;}
 const wasAudible=mix.audible;mix=soundMix(s,{...ui,hidden:document.hidden});mix.audible&&=enabled&&ac.state==='running';
 if(!mix.audible&&wasAudible)silence();target(master.gain,mix.audible?.7:0,.04);target(foley.gain,mix.sfx);target(ambient.gain,mix.ambience);
 const departurePlan=departureAudioPlan(s,{...ui,hidden:document.hidden});if(departurePlan)departurePlan.audible=mix.audible;departureAudio?.update(departurePlan);
 for(const name of ['engine','wind','tires','water','rain'])target(layers[name].gain.gain,mix.audible?mix[name]:0,.24);
 target(layers.rattle.gain.gain,mix.audible?mix.engine*.12:0);target(engine.frequency,mix.rpm);target(engineHarmonic.frequency,mix.rpm*2.03);target(layers.water.filter.frequency,1350+Math.sin(s.activeTime*.6)*250,.25);
 if(mix.audible&&wasAudible)for(const cue of transitionSounds(previous,snapshot))playCue(cue);
 previous=snapshot;
 if(!mix.audible)return;
 const time=ac.currentTime;
 if(mix.working&&time>=next.tool){sample('metal',.13,.82);next.tool=time+.45+Math.random()*.2;}
 if(mix.reel&&time>=next.reel){sample('switch',.09,s.activity.behavior==='run'?1.7:1.25);next.reel=time+(s.activity.behavior==='run'?.075:.15);}
 if(mix.danger&&time>=next.step){sample('step',.15,.85);next.step=time+.68;}
}
export function audioState(){const data=new Float32Array(2048);meter?.getFloatTimeDomainData(data);const rms=Math.sqrt(data.reduce((sum,x)=>sum+x*x,0)/data.length),peak=data.reduce((max,x)=>Math.max(max,Math.abs(x)),0);return {rms,peak,enabled,context:ac?.state||'locked',audible:!!mix.audible,loaded:Object.keys(buffers).length,voices:voices.size,mix:{...mix},recent:[...recent],scoreConnected:!!scoreSource,departure:departureAudio?.state()||null};}
