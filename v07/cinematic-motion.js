import {drawService} from './service-marks.js?v=0.8.8-story-1';
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
 if(kind==='radio'||kind==='radio-start'){
  const power=kind==='radio-start'?clamp((age-2)/.3):1,level=power*(.052+.006*Math.sin(age*1.2)),g=c.createRadialGradient(x+bw*.6,y+bh*.52,0,x+bw*.6,y+bh*.52,bw*.5);
  g.addColorStop(0,`rgba(247,184,86,${level})`);g.addColorStop(1,'#efb05600');c.fillStyle=g;c.fillRect(x,y,bw,bh);
 }
 if(kind==='dust'||kind==='loading'){
  for(let i=0;i<25;i++){const px=x+(i*83.7+age*(3+i%6))%bw,py=y+(i*51.1-age*(1+i%4)+bh*100)%bh;
   c.fillStyle=`rgba(240,214,170,${.045+(i%4)*.015})`;c.beginPath();c.arc(px,py,.6+(i%3)*.45,0,Math.PI*2);c.fill();}
  if(kind==='loading'){const sweep=(age*.35)%1,g=c.createLinearGradient(x,y+bw*sweep-bh*.3,x,y+bw*sweep+bh*.25);g.addColorStop(0,'#ecc48a00');g.addColorStop(.5,'#ecc48a0c');g.addColorStop(1,'#ecc48a00');c.fillStyle=g;c.fillRect(x,y,bw,bh);}
 }
 if(kind==='inspection'){
  // An equipment scanner crosses the actual inspection area, not the camera.
  const progress=(age*.10)%1,yy=y+bh*progress,g=c.createLinearGradient(x,yy-bh*.09,x,yy+bh*.09);
  g.addColorStop(0,'#e4b07b00');g.addColorStop(.5,'#e4b07b15');g.addColorStop(1,'#e4b07b00');c.fillStyle=g;c.fillRect(x,y,bw,bh);
 }
 if(kind==='queue'){
  // Uneven fluorescent supply above the workers. No flashing full frames.
  c.fillStyle=`rgba(160,195,209,${.012+.007*Math.sin(age*4.3)*Math.sin(age*.7)})`;c.fillRect(x,y,bw,bh);
 }
 if(kind==='entry'){
  // The building's cold reader light recedes after the door closes.
  const level=.04*(1-clamp(age/2.4));c.fillStyle=`rgba(160,198,219,${level})`;c.fillRect(x,y,bw,bh);
 }
 if(kind==='dawn'){
  const g=c.createLinearGradient(x,y,x+bw,y+bh);g.addColorStop(0,`rgba(221,182,128,${.025+clamp(age/8)*.045})`);g.addColorStop(1,'#ddb68000');c.fillStyle=g;c.fillRect(x,y,bw,bh);
 }
 c.restore();
}

// A clean modern service screen, visibly distinct from the Mercers' later joint wallet.
export function drawCheckoutDenial(c,w,h,age,{still=false,brand='Food'}={}){
 const portrait=h>w,ww=w*(portrait?.88:.43),hh=Math.min(h*.60,ww*1.12),x=portrait?(w-ww)/2:w*.065,y=h*(portrait?.23:.16),p=ww*.075;
 c.save();c.textAlign='left';c.textBaseline='top';c.shadowColor='#0008';c.shadowBlur=ww*.09;
 c.fillStyle='#111923fa';c.beginPath();c.roundRect(x,y,ww,hh,ww*.037);c.fill();c.shadowBlur=0;c.strokeStyle='#547080';c.lineWidth=Math.max(1,w/1500);c.stroke();
 const font=(size,weight=500)=>{c.font=`${weight} ${ww*size}px Road,sans-serif`;};
 c.fillStyle='#f7f9fc';font(.055,700);drawService(c,"food",x+p,y+p,ww*.07);c.fillText(brand,x+p+ww*.10,y+p);
 c.fillStyle='#8dabc1';font(.029);c.fillText('CHECKOUT · VISITOR ACCOUNT',x+p,y+hh*.18);
 const active=still||age>1.05;
 c.fillStyle=active?'#ffafa2':'#a9cfff';font(.079,650);c.fillText(active?'Payment declined':'Checking access…',x+p,y+hh*.28);
 c.fillStyle='#d6e0e9';font(.041);c.fillText(active?'Cash has restricted this account.':'Connecting to your account.',x+p,y+hh*.40);
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

// Editorial service inserts: real interface typography and one alarming state.
// They occupy the upper picture field; spoken captions have their own safe area.
export const INTRO_SERVICE_NOTICES={
 purchase:{app:'food',brand:'Food',eyebrow:'CHECKOUT',title:'Purchase declined',detail:'Social credit: restricted.',meta:'Cash balance  $1,284.60',footer:'Restore your access through Work.'},
 cash:{app:'food',brand:'Food',eyebrow:'PAYMENT METHODS',title:'Digital payment only',detail:'Physical notes not accepted.',meta:'No alternative payment method',footer:'An active Cash account is required.'},
 transfer:{app:'account',brand:'Cash',eyebrow:'SEND MONEY',title:'Transfer blocked',detail:'Recipient restricted.',meta:'No money was transferred',footer:'Access must be restored before receiving.'},
 travel:{app:'travel',brand:'Travel',eyebrow:'JOURNEY REQUEST',title:'Journey unavailable',detail:'Social credit: restricted.',meta:'Payment cannot be authorized',footer:'Review your standing in ID.'},
 restore:{app:'work',brand:'Work',eyebrow:'A FRESH START',title:'Restore access',detail:'Complete assigned shifts.',meta:'Earnings held during review',footer:'Your score is reviewed after compliance.'}
};
export function drawIntroServiceNotice(c,w,h,age,kind,{still=false,compact=false}={}){
 const data=INTRO_SERVICE_NOTICES[kind];if(!data)return;
 const portrait=h>w,ww=w*(portrait?.88:.43),hh=Math.min(h*(compact?.273:portrait?.40:.52),ww*1.06),x=portrait?(w-ww)/2:w*.055,y=h*(compact?.445:portrait?.19:.115),p=ww*.073;
 const checking=kind==='purchase'&&!still&&age<1.2;
 c.save();c.textAlign='left';c.textBaseline='top';c.shadowColor='#0009';c.shadowBlur=ww*.06;
 c.fillStyle='#0e1825f5';c.beginPath();c.roundRect(x,y,ww,hh,ww*.028);c.fill();c.shadowBlur=0;c.strokeStyle='#7295ac70';c.lineWidth=Math.max(1,w/1500);c.stroke();
 drawService(c,data.app,x+p,y+p,ww*.065);c.fillStyle='#edf4f8';c.font=`650 ${ww*.051}px Road,sans-serif`;c.fillText(data.brand,x+p+ww*.091,y+p);
 c.fillStyle='#99b0c2';c.font=`600 ${ww*.030}px Road,sans-serif`;c.fillText(data.eyebrow,x+p,y+hh*.225);
 c.fillStyle=kind==='restore'?'#e8d4a3':checking?'#a4c9ea':'#ffac9f';c.font=`650 ${ww*.063}px Road,sans-serif`;c.fillText(checking?'Checking access…':data.title,x+p,y+hh*.34);
 c.fillStyle='#ecf1f5';c.font=`550 ${ww*.042}px Road,sans-serif`;c.fillText(checking?'Confirming your standing.':data.detail,x+p,y+hh*.49);
 c.strokeStyle='#8199ac3b';c.beginPath();c.moveTo(x+p,y+hh*.61);c.lineTo(x+ww-p,y+hh*.61);c.stroke();
 c.fillStyle='#a5bdce';c.font=`500 ${ww*.035}px Road,sans-serif`;c.fillText(data.meta,x+p,y+hh*.67);
 c.fillStyle='#849caf';c.font=`500 ${ww*.031}px Road,sans-serif`;c.fillText(data.footer,x+p,y+hh*.82);
 if(!still&&kind==='purchase'&&age>=1.2&&age<1.65){c.strokeStyle=`rgba(255,139,121,${.5*Math.sin((age-1.2)/.45*Math.PI)})`;c.lineWidth=2;c.beginPath();c.roundRect(x,y,ww,hh,ww*.028);c.stroke();}
 c.restore();
}

// Portrait retains a generous wide composition where full-height cover removes a
// listener, the receiver or the physical evidence. The single image stays still;
// clean negative space carries captions instead of a duplicated blurred image.
export function fixedFilmShot(c,im,w,h,focus=.5,{band=false,screen=false}={}){
 if(!im?.naturalWidth)return null;
 if(!band||h/w<1.45)return fixedShot(c,im,w,h,focus);
 // A fixed 4:3 picture window retains the central three quarters of a wide
 // plate while giving people and physical props enough size on a phone.
 // Service shots keep the complete 16:9 image above their separate UI card.
 const ih=screen?w*im.naturalHeight/im.naturalWidth:w*.75,iw=ih*im.naturalWidth/im.naturalHeight,y=h*(screen?.095:.18),x=(w-iw)/2;
 c.drawImage(im,x,y,iw,ih);return {x,y,w:iw,h:ih,layout:'band',window:{x:0,y,w,h:ih}};
}

// Original pencil strokes for Ben's note. Coordinates refer to the authored
// 1672x941 plate; the lettering remains attached to the paper in either format.
// The image is a held moment, so these are completed marks, not a simulated hand.
export const FILM_PENCIL_NOTE={width:1672,height:941,x:774,y:649,scale:1.36,text:'SIGNALS END'};
const PENCIL_LETTERS={
 S:[[[7,1],[5,0],[1,1],[0,3],[2,5],[5,6],[7,8],[6,11],[2,12],[0,10]]],
 I:[[[0,0],[6,0]],[[3,0],[3,12]],[[0,12],[6,12]]],
 G:[[[7,2],[5,0],[1,1],[0,5],[1,10],[4,12],[7,10],[7,7],[4,7]]],
 N:[[[0,12],[0,0],[7,12],[7,0]]],
 A:[[[0,12],[3,0],[5,0],[8,12]],[[1,8],[7,8]]],
 L:[[[0,0],[0,12],[7,12]]],
 E:[[[7,0],[0,0],[0,12],[7,12]],[[0,6],[6,6]]],
 D:[[[0,12],[0,0],[4,0],[7,3],[7,9],[4,12],[0,12]]]
};
export function drawFilmNote(c,frame){
 if(!frame)return;const note=FILM_PENCIL_NOTE;
 c.save();c.translate(frame.x,frame.y);c.scale(frame.w/note.width,frame.h/note.height);c.translate(note.x,note.y);c.rotate(-.045);c.scale(note.scale,note.scale);
 c.strokeStyle='#46392dde';c.lineWidth=1.12;c.lineJoin='round';c.lineCap='round';
 let x=0;for(const [i,letter] of [...note.text].entries()){
  if(letter===' '){x+=6;continue;}
  for(const stroke of PENCIL_LETTERS[letter]){c.beginPath();stroke.forEach(([px,py],j)=>{const xx=x+px,yy=py+(i%3-1)*.35;j?c.lineTo(xx,yy):c.moveTo(xx,yy);});c.stroke();}
  x+=10;
 }
 c.lineWidth=.85;c.beginPath();c.moveTo(-2,17);c.lineTo(x-7,18.4);c.lineTo(x-2,18);c.stroke();c.restore();
}
