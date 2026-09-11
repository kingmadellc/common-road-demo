const TAU=Math.PI*2;
export function drawRoad(ctx,w,h,s,ui,images){
 const r=s.road,moving=s.mode==='travel'&&!s.settings.reducedMotion,t=moving?r.elapsed:s.mode==='incident'?r.elapsed:0;
 const distance=s.settings.reducedMotion?0:(r?.elapsed||0)*125;
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#172e38');sky.addColorStop(.55,'#ae936c');sky.addColorStop(1,'#263b3b');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 const landscape=images.landscape;
 if(landscape?.naturalWidth){
  const dh=h*.755,dw=dh*landscape.naturalWidth/landscape.naturalHeight,offset=distance*.10;
  ctx.save();ctx.beginPath();ctx.rect(0,0,w,dh);ctx.clip();
  for(let i=Math.floor(offset/dw)-1;i<Math.ceil((w+offset)/dw)+1;i++){const x=i*dw-offset;ctx.save();if(i%2){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(landscape,0,0,dw,dh);}else ctx.drawImage(landscape,x,0,dw,dh);ctx.restore();}ctx.restore();
  // The nearby verge travels faster than the hills, without distorting the horizon.
  const sw=landscape.naturalWidth,sh=landscape.naturalHeight*.13,gh=h*.035,gw=gh*sw/sh,goff=distance*.55;
  ctx.save();ctx.beginPath();ctx.rect(0,h*.725,w,h*.035);ctx.clip();for(let i=Math.floor(goff/gw)-1;i<Math.ceil((w+goff)/gw)+1;i++)ctx.drawImage(landscape,0,landscape.naturalHeight-sh,sw,sh,i*gw-goff,h*.725,gw,gh);ctx.restore();
 }else{ctx.fillStyle='#40534b';ctx.fillRect(0,h*.45,w,h*.32);}
 const road=ctx.createLinearGradient(0,h*.72,0,h);road.addColorStop(0,'#3a4442');road.addColorStop(.5,'#303736');road.addColorStop(1,'#1c282b');ctx.fillStyle=road;ctx.fillRect(0,h*.73,w,h*.27);
 ctx.fillStyle='#a9a68a';ctx.fillRect(0,h*.745,w,2);ctx.fillStyle='#b3a47b';ctx.fillRect(0,h*.95,w,3);
 const dash=w*.18,shift=(distance*1.45)%(dash*2);ctx.fillStyle='#b59c68';for(let x=-2*dash-shift;x<w+dash;x+=dash*2)ctx.fillRect(x,h*.895,dash,3);
 // Repaired seams and fine aggregate make the road move even between lane marks.
 ctx.strokeStyle='#232d2d';ctx.lineWidth=1;for(let i=0;i<13;i++){let x=((i*131-distance*1.45)%(w+140)+w+140)%(w+140)-70;ctx.beginPath();ctx.moveTo(x,h*.76);ctx.lineTo(x+16,h*.80);ctx.lineTo(x+3,h*.94);ctx.stroke();}
 ctx.fillStyle='#ccc1a033';for(let i=0;i<180;i++){let x=((i*67.13-distance*1.45)%(w+10)+w+10)%(w+10);let y=h*(.76+(Math.sin(i*193)*.5+.5)*.24);ctx.fillRect(x,y,1.2,1);}
 for(let i=0;i<7;i++){const x=((i*w*.26-distance*.5)%(w*1.8)+w*1.8)%(w*1.8)-w*.3;ctx.fillStyle='#c7c0a1';ctx.fillRect(x,h*.68,4,h*.055);ctx.fillStyle='#b18b48';ctx.fillRect(x,h*.69,4,5);}
 drawVan(ctx,w,h,s,ui,images,{x:.50,y:.83,width:Math.min(w*.68,h*1.10,730),time:t,moving});
 if(r?.kind==='storm'){ctx.fillStyle='#102d4138';ctx.fillRect(0,0,w,h);if(!s.settings.reducedMotion){ctx.strokeStyle='#aac5cb44';ctx.lineWidth=1;for(let i=0;i<50;i++){const rx=((i*81-timeSafe(r)*145)%w+w)%w,ry=((i*37+timeSafe(r)*210)%h+h)%h;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-10,ry+17);ctx.stroke();}}}
 if(s.settings.reducedMotion){ctx.fillStyle='#f0dab0';ctx.font='12px Road';ctx.fillText('TRAVEL · REDUCED MOTION',18,h-18);}
}
export function drawVan(ctx,w,h,s,ui,images,{x=.5,y=.82,width=600,time=0,moving=false}={}){
 const im=images.vanBody,old=images.van;
 if(!im?.naturalWidth){if(old?.naturalWidth){const height=width*old.naturalHeight/old.naturalWidth;ctx.drawImage(old,x*w-width/2,y*h-height,width,height);}return;}
 const height=width*im.naturalHeight/im.naturalWidth,left=x*w-width/2,top=y*h-height;
 // Pivots use the body sprite's normalized source space and remain fixed to the road.
 const wheels=[{x:.200,y:.849,r:.145},{x:.813,y:.849,r:.145}];
 ctx.save();ctx.fillStyle='#030b0ca3';ctx.beginPath();ctx.ellipse(x*w,top+height*.994,width*.45,height*.047,0,0,TAU);ctx.fill();
 const bounce=moving?Math.sin(time*7)*1.3+Math.sin(time*13)*.5:0;ctx.drawImage(im,left,top+bounce,width,height);
 for(const wheel of wheels){const wx=left+wheel.x*width,wy=top+wheel.y*height,rad=height*wheel.r;
  ctx.save();ctx.translate(wx,wy);ctx.fillStyle='#111a1b';ctx.beginPath();ctx.arc(0,0,rad*1.03,0,TAU);ctx.fill();ctx.strokeStyle='#2c3230';ctx.lineWidth=rad*.18;ctx.beginPath();ctx.arc(0,0,rad*.89,0,TAU);ctx.stroke();ctx.rotate(moving?time*12:s.settings.reducedMotion?0:time*12);
  const hub=ctx.createRadialGradient(-rad*.2,-rad*.2,0,0,0,rad*.67);hub.addColorStop(0,'#b6b19b');hub.addColorStop(.65,'#767a6e');hub.addColorStop(.84,'#3f4a47');hub.addColorStop(1,'#a09c84');ctx.fillStyle=hub;ctx.beginPath();ctx.arc(0,0,rad*.67,0,TAU);ctx.fill();ctx.strokeStyle='#242f30';ctx.lineWidth=rad*.11;
  for(let k=0;k<6;k++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(rad*.21,0);ctx.lineTo(rad*.51,0);ctx.stroke();}
  ctx.strokeStyle='#95917c';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,rad*.85,0,TAU);ctx.stroke();ctx.fillStyle='#b2a58c';ctx.beginPath();ctx.arc(0,0,rad*.20,0,TAU);ctx.fill();ctx.restore();}
 if(!s.fan){ctx.globalAlpha=.25;ctx.fillStyle='#c3d0c8';for(let i=0;i<5;i++){const k=((time*.4+i*.19)%1);ctx.beginPath();ctx.ellipse(left+width*.80+k*20,top+height*.43-k*height*.20,7+k*11,4+k*7,0,0,TAU);ctx.fill();}}
 ctx.restore();
}

function timeSafe(r){return r?.elapsed||0;}
