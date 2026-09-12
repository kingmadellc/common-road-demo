// Opening time is independent of campaign time. The final card waits for intent.
export const INTRO_KEY='common-road-prologue-v6';
export const BEATS=[
 {id:'terms',image:'intro-city',duration:11,eyebrow:'AMERICA · 2041',title:'Your life has terms.',body:'Work, rent, heating, the car: one account. When the old services failed, Continuum bought the pieces. Then it started charging for the buttons.',quote:'Convenience was mandatory.',speaker:'CONTINUUM · A BETTER EVERYDAY',motion:'signal',focus:.58},
 {id:'family',image:'intro-kitchen',duration:12,eyebrow:'EVERETT, WASHINGTON · EIGHTEEN DAYS AGO',title:'Then the house fired us.',body:'Jack Mercer fixed machines without permission. His work account was suspended. Sarah, Ben, Annie and Rusty lost access to the home attached to it.',quote:'“The fridge laid us off. Benefits were shit anyway.”',speaker:'SARAH MERCER',motion:'receipt',focus:.5},
 {id:'analog',image:'intro-garage',duration:12,eyebrow:'THE MERCERS · FOUR PEOPLE, ONE DOG',title:'Keep the engine. Lose the leash.',body:'Jack rebuilt Grandad’s van with parts he could repair. Sarah packed tools, cash and a paper atlas. Nothing aboard needs a company’s permission to start.',quote:'“Good news. The van’s too old to betray us.”',speaker:'JACK MERCER',motion:'unplug',focus:.52},
 {id:'collectors',image:'squad',duration:11,eyebrow:'CONTINUUM · WORKFORCE RECOVERY',title:'Leaving is bad for retention.',body:'The Collectors patrol the paid roads. They seize unlicensed parts, record plates and send indebted workers back to company housing. They call it assistance.',quote:'“If they’re here to help, why are the doors locked from outside?”',speaker:'BEN MERCER',motion:'search',focus:.54},
 {id:'morrow',image:'basin',duration:14,eyebrow:'A RUMOR IN THE OZARKS · MORROW BASIN',title:'Somewhere, a deed still means it.',body:'Reservoir towns quietly formed the Morrow Compact. Repair crews keep the power on. A few guarded crossings keep Continuum out. Inside: homes, gardens and deeds recorded on paper.',quote:'“Not paradise. You still have to fix the toilet.”',speaker:'FRANK · ON THE SHORTWAVE',motion:'map',focus:.55},
 {id:'trail',image:'intro-departure',duration:12,eyebrow:'WESTERN MISSOURI · THE FINAL TWO DAYS',title:'Same trail. Worse terms.',body:'Now the fan is failing and a storm will close the crossing in 48 hours. Fix a settlement’s pump to earn a sponsor, or deliver the water filters Morrow needs.',quote:'“Our ancestors crossed in wagons. At least the oxen didn’t need a login.”',speaker:'JACK MERCER',motion:'route',focus:.65},
 {id:'begin',image:'intro-departure',duration:0,eyebrow:'YOUR HOUSEHOLD · YOUR CALL',title:'Get them somewhere that’s theirs.',body:'Pack six spaces. Fish for dinner. Salvage what you can. Keep the van running and the Collectors guessing. Get through the Line with everyone aboard.',quote:'“I want a key. An actual bloody key.”',speaker:'SARAH MERCER',motion:'dawn',focus:.7}
];
export function newPrologue(replay=false){return {index:0,elapsed:0,paused:false,replay};}
export function progressPrologue(p,dt,reduced=false){if(!p||p.paused||reduced)return false;const beat=BEATS[p.index];p.elapsed+=dt;if(beat.duration&&p.elapsed>=beat.duration){p.index=Math.min(BEATS.length-1,p.index+1);p.elapsed=0;return true;}return false;}
export function movePrologue(p,direction){p.index=Math.max(0,Math.min(BEATS.length-1,p.index+direction));p.elapsed=0;}
export function restorePrologue(raw){try{const p=JSON.parse(raw);if(p&&Number.isInteger(p.index)&&p.index>=0&&p.index<BEATS.length&&Number.isFinite(p.elapsed)&&p.elapsed>=0)return {...p,paused:true,replay:!!p.replay};}catch{}return null;}
export const prologueState=p=>p?{...p,beat:BEATS[p.index].id,title:BEATS[p.index].title,body:BEATS[p.index].body,total:BEATS.length}:null;

export function drawPrologue(ctx,w,h,p,images,reduced){
 const b=BEATS[p.index],im=images[b.image],phase=reduced?0:Math.min(1,p.elapsed/(b.duration||12)),ease=phase*phase*(3-2*phase);
 ctx.fillStyle='#111b1c';ctx.fillRect(0,0,w,h);
 if(im?.naturalWidth){const k=Math.max(w/im.naturalWidth,h/im.naturalHeight)*(1+ease*.045),iw=im.naturalWidth*k,ih=im.naturalHeight*k;const focus=b.focus+(reduced?0:(ease-.5)*.035);ctx.drawImage(im,Math.max(w-iw,Math.min(0,w*.5-iw*focus)),(h-ih)*.35,iw,ih);}
 ctx.save();
 // Corporate signal interference gives way to a disconnected cable and a paper route.
 if(b.motion==='signal'){ctx.fillStyle=`rgba(124,195,188,${reduced?.025:.025+Math.sin(p.elapsed*.7)*.009})`;for(let y=0;y<h;y+=6)ctx.fillRect(0,y,w,1);if(!reduced){ctx.fillStyle='#bad7d21c';ctx.fillRect(0,(p.elapsed*20)%h,w,2);}}
 if(b.motion==='search'){const x=reduced?w*.65:(.25+.55*(.5+Math.sin(p.elapsed*.55)*.5))*w;const g=ctx.createLinearGradient(x-w*.2,0,x+w*.2,0);g.addColorStop(0,'#dde5c900');g.addColorStop(.5,'#eeeac826');g.addColorStop(1,'#dde5c900');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+w*.24,h);ctx.lineTo(x-w*.24,h);ctx.fill();}
 if(b.motion==='unplug'){const y=h*.18,x=w*.08;ctx.strokeStyle='#dfb374';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*.15,y);ctx.stroke();ctx.fillStyle='#dfb374';ctx.fillRect(x+w*.15,y-5,9,10);const gap=reduced?20:12+ease*24;ctx.strokeStyle='#667577';ctx.beginPath();ctx.moveTo(x+w*.15+gap,y);ctx.lineTo(x+w*.31,y);ctx.stroke();}
 if(b.motion==='map'||b.motion==='route'){
  const x=w>.9*h?w*.64:w*.09,y=h*.12,mw=w>.9*h?w*.29:w*.82,mh=h*.2;
  ctx.fillStyle='#101c1bcc';ctx.fillRect(x-12,y-14,mw+24,mh+35);ctx.strokeStyle='#d3be8a';ctx.lineWidth=2;
  const pts=[[0,.15],[.19,.36],[.39,.27],[.62,.6],[.84,.5],[1,.86]];const t=reduced?1:Math.min(1,p.elapsed/4.5);
  ctx.beginPath();ctx.moveTo(x,y+mh*.15);for(let i=1;i<pts.length;i++){const portion=Math.max(0,Math.min(1,t*5-(i-1)));const prev=pts[i-1],curr=pts[i];ctx.lineTo(x+(prev[0]+(curr[0]-prev[0])*portion)*mw,y+(prev[1]+(curr[1]-prev[1])*portion)*mh);if(portion<1)break;}ctx.stroke();
  ctx.font='500 11px Road,sans-serif';ctx.fillStyle='#f2dfb9';ctx.textAlign='left';ctx.fillText('EVERETT',x,y-1);ctx.textAlign='right';ctx.fillText('MORROW · OZARKS',x+mw,y+mh+15);
  for(const [px,py]of [pts[0],pts[5]]){ctx.beginPath();ctx.arc(x+px*mw,y+py*mh,4,0,7);ctx.fill();}
 }
 const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#080e1455');g.addColorStop(.28,'#080e1400');g.addColorStop(.52,'#0a141833');g.addColorStop(1,'#081114ed');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 // A brief film dissolve, never a flash or rapid flicker.
 if(!reduced&&p.elapsed<.5){ctx.fillStyle=`rgba(8,15,18,${(.5-p.elapsed)*1.3})`;ctx.fillRect(0,0,w,h);}
 ctx.restore();
}
