import {huntSight} from './hunting.js?v=0.8.3-cinema-1';
export function drawHunting(ctx,w,h,s,ui,images){
 const g=s.activity;
 if(g.phase!=='field')return;
 for(const an of g.animals){
  if(!an.visible)continue;
  const im=images['hunt-'+an.id];if(!im?.naturalWidth)continue;
  const size=an.width*w;
  ctx.save();ctx.translate(an.x*w,an.y*h);ctx.scale(-an.facing,1);
  ctx.fillStyle='#1c241642';ctx.beginPath();ctx.ellipse(0,size*.44,size*.38,size*.045,0,0,Math.PI*2);ctx.fill();
  // Body center, not the transparent sprite rectangle, is the aim target.
  ctx.drawImage(im,-size*.58,-size*.51,size,size);
  ctx.restore();
  ui.hits.push({id:an.id,type:'animal',x:an.x,y:an.y,r:Math.max(12,an.rx*w),rx:an.rx,ry:an.ry,moving:an.moving});
 }
 const sight=huntSight(g),x=sight.x*w,y=sight.y*h,steady=Math.min(1,g.steady/1.2),radius=12+(1-steady)*16;
 ctx.save();ctx.lineWidth=1.6;ctx.strokeStyle=steady>.8?'#eee0ad':'#f8e9c9cc';
 ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.stroke();
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ctx.beginPath();ctx.moveTo(x+dx*(radius+4),y+dy*(radius+4));ctx.lineTo(x+dx*(radius+12),y+dy*(radius+12));ctx.stroke();}
 ctx.fillStyle='#fff0cf';ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();
 ctx.font='600 12px Road,sans-serif';ctx.textAlign='center';ctx.fillText(g.aiming?(steady>.8?'STEADY':'BREATHE'):'',x,y+radius+25);
 const px=w*.07,py=h*.82,pw=w*.86,ph=Math.min(62,h*.15);
 ctx.fillStyle=g.aiming?'#152921dd':'#132523bc';ctx.strokeStyle='#d1bc8955';ctx.beginPath();ctx.roundRect(px,py,pw,ph,10);ctx.fill();ctx.stroke();
 ctx.fillStyle='#f4e8ca';ctx.font='600 13px Road,sans-serif';ctx.fillText(g.aiming?'HOLD STILL · RELEASE TO SHOOT':'AIM PAD · DRAG, HOLD, RELEASE',w*.5,py+ph*.5+4);
 if(g.warning){ctx.fillStyle='#bd6236';ctx.fillRect(w*.1,h*.775,w*.8*Math.min(1,g.warning/16),3);}
 if(g.flash>0){ctx.fillStyle=`rgba(251,231,177,${g.flash*.5})`;ctx.fillRect(0,0,w,h);}
 ctx.restore();
}
