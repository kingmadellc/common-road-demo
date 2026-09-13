// Fixed photographic framing. Motion belongs to objects/light, never a zoomed still.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function fixedShot(c,im,w,h,focus=.5){
 if(!im?.naturalWidth)return null;
 const k=Math.max(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*k,ih=im.naturalHeight*k;
 const x=clamp(w*.5-iw*focus,w-iw,0),y=(h-ih)*.42;
 c.drawImage(im,x,y,iw,ih);return {x,y,w:iw,h:ih};
}
export function sceneMotion(c,w,h,age,kind,frame,{still=false,region}={}){
 if(still||!frame)return;
 const f=frame,box=region||[0,0,1,.65],x=f.x+f.w*box[0],y=f.y+f.h*box[1],bw=f.w*box[2],bh=f.h*box[3];
 c.save();c.beginPath();c.rect(x,y,bw,bh);c.clip();
 if(kind==='rain'||kind==='window'){
  c.strokeStyle='#d2e2ea34';c.lineWidth=Math.max(.6,w/1900);
  for(let i=0;i<70;i++){const px=x+(i*137.41)%bw,py=y+(i*53.23+age*(18+i%11))%bh;c.beginPath();c.moveTo(px,py);c.lineTo(px-1.4,py+8+i%14);c.stroke();}
 }
 if(kind==='screen'){
  // A single queued notification arrives; the light stays local to the appliance.
  const a=.035+.025*Math.sin(age*1.3),g=c.createRadialGradient(x+bw*.5,y+bh*.5,0,x+bw*.5,y+bh*.5,bw*.6);
  g.addColorStop(0,`rgba(137,196,238,${a})`);g.addColorStop(1,'#8ccaff00');c.fillStyle=g;c.fillRect(x,y,bw,bh);
  if(age>1.1&&age<2.4){c.fillStyle=`rgba(160,209,238,${.14*Math.sin((age-1.1)/1.3*Math.PI)})`;c.fillRect(x+bw*.1,y+bh*.17,bw*.7,bh*.018);}
 }
 if(kind==='radio'){
  const level=.04+.035*Math.sin(age*11)*Math.sin(age*3.2),g=c.createRadialGradient(x+bw*.6,y+bh*.52,0,x+bw*.6,y+bh*.52,bw*.5);
  g.addColorStop(0,`rgba(247,184,86,${level})`);g.addColorStop(1,'#efb05600');c.fillStyle=g;c.fillRect(x,y,bw,bh);
 }
 if(kind==='dust'||kind==='loading'){
  for(let i=0;i<25;i++){const px=x+(i*83.7+age*(3+i%6))%bw,py=y+(i*51.1-age*(1+i%4)+bh*100)%bh;
   c.fillStyle=`rgba(240,214,170,${.045+(i%4)*.015})`;c.beginPath();c.arc(px,py,.6+(i%3)*.45,0,Math.PI*2);c.fill();}
  if(kind==='loading'){const sweep=(age*.35)%1,g=c.createLinearGradient(x,y+bw*sweep-bh*.3,x,y+bw*sweep+bh*.25);g.addColorStop(0,'#ecc48a00');g.addColorStop(.5,'#ecc48a0c');g.addColorStop(1,'#ecc48a00');c.fillStyle=g;c.fillRect(x,y,bw,bh);}
 }
 if(kind==='dawn'){
  const g=c.createLinearGradient(x,y,x+bw,y+bh);g.addColorStop(0,`rgba(221,182,128,${.025+clamp(age/8)*.045})`);g.addColorStop(1,'#ddb68000');c.fillStyle=g;c.fillRect(x,y,bw,bh);
 }
 c.restore();
}

// A clean modern service screen, visibly distinct from the Mercers' later joint wallet.
export function drawCheckoutDenial(c,w,h,age,{still=false,brand='Index'}={}){
 const portrait=h>w,ww=w*(portrait?.88:.43),hh=Math.min(h*.60,ww*1.12),x=portrait?(w-ww)/2:w*.065,y=h*(portrait?.23:.16),p=ww*.075;
 c.save();c.textAlign='left';c.textBaseline='top';c.shadowColor='#0008';c.shadowBlur=ww*.09;
 c.fillStyle='#111923fa';c.beginPath();c.roundRect(x,y,ww,hh,ww*.037);c.fill();c.shadowBlur=0;c.strokeStyle='#547080';c.lineWidth=Math.max(1,w/1500);c.stroke();
 const font=(size,weight=500)=>{c.font=`${weight} ${ww*size}px Road,sans-serif`;};
 c.fillStyle='#f7f9fc';font(.055,700);c.fillText(brand,x+p,y+p);
 c.fillStyle='#8dabc1';font(.029);c.fillText('CHECKOUT · VISITOR ACCOUNT',x+p,y+hh*.18);
 const active=still||age>1.05;
 c.fillStyle=active?'#ffafa2':'#a9cfff';font(.079,650);c.fillText(active?'Payment declined':'Checking access…',x+p,y+hh*.28);
 c.fillStyle='#d6e0e9';font(.041);c.fillText(active?'Your account is restricted.':'Connecting to your account.',x+p,y+hh*.40);
 c.fillStyle='#7995a9';c.fillRect(x+p,y+hh*.50,ww-2*p,1);
 c.fillStyle='#a8bdcc';font(.032);c.fillText('Available payment methods',x+p,y+hh*.55);
 c.fillStyle=active?'#ffafa2':'#b8cad9';font(.047,650);c.fillText(active?'None available':'Verifying…',x+p,y+hh*.63);
 c.fillStyle='#283543';c.beginPath();c.roundRect(x+p,y+hh*.76,ww-2*p,hh*.105,ww*.017);c.fill();c.fillStyle='#8193a3';font(.038,600);c.fillText('Pay',x+p+ww*.04,y+hh*.786);
 c.fillStyle='#a8bdcc';font(.028);c.fillText('This store accepts digital payment only.',x+p,y+hh*.91);
 c.restore();
}

export function drawQuestionPaper(c,w,h,age,{still=false}={}){
 const portrait=h>w,pw=w*(portrait?.84:.50),ph=Math.min(h*.62,pw*.95),x=(w-pw)/2,y=h*.13;
 c.save();c.fillStyle='#cbc0a4';c.shadowColor='#0008';c.shadowBlur=40;c.fillRect(x,y,pw,ph);c.shadowBlur=0;
 c.strokeStyle='#897e6638';c.lineWidth=1;for(let j=1;j<13;j++){const yy=y+ph*(.05+j*.07);c.beginPath();c.moveTo(x+pw*.06,yy);c.lineTo(x+pw*.95,yy);c.stroke();}
 c.textAlign='left';c.textBaseline='top';c.fillStyle='#252d2b';c.font=`600 ${pw*.06}px Road,sans-serif`;c.fillText('Before we go',x+pw*.09,y+ph*.07);
 const lines=['Who has been there?','How do we find them?','What do we leave behind?'];c.font=`500 ${pw*.048}px Road,sans-serif`;
 lines.forEach((line,i)=>{const progress=still?1:clamp((age-i*1.7-.7)/1.4);c.save();c.beginPath();c.rect(x+pw*.09,y+ph*(.30+i*.18),pw*.85*progress,ph*.12);c.clip();c.fillText(line,x+pw*.09,y+ph*(.30+i*.18));c.restore();});c.restore();
}
