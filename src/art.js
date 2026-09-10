import {ITEMS,nodeById} from './content.js';
const C={ink:'#203e3a',cream:'#f4ebd6',yellow:'#e1b965',rust:'#b9694f',sage:'#6d8774'};
function poly(c,points,fill,stroke=null,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function line(c,p,color,width=2){c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.stroke();}
function text(c,s,x,y,size,color,align='left',font='sans-serif'){c.font=`${size}px ${font}`;c.fillStyle=color;c.textAlign=align;c.fillText(s,x,y);}
function tree(c,x,y,size,color){rect(c,x-size*.045,y-size*.3,size*.09,size*.4,'#665e45');poly(c,[[x,y-size],[x-size*.3,y-size*.25],[x-size*.13,y-size*.3],[x-size*.39,y],[x+size*.39,y],[x+size*.13,y-size*.3],[x+size*.3,y-size*.25]],color);}
function cloud(c,x,y,s){ellipse(c,x,y,65*s,13*s,'#f7efd9aa');ellipse(c,x-25*s,y-8*s,29*s,14*s,'#f7efd9aa');ellipse(c,x+20*s,y-12*s,38*s,17*s,'#f7efd9aa');}
export function drawItem(c,id,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);const item=ITEMS.find(i=>i.id===id);const color=item?.color||C.sage;
 if(id==='I01'){rect(c,-19,-15,38,26,color);line(c,[[-8,-15],[-8,-23],[8,-23],[8,-15]],C.ink,4);rect(c,-19,-4,38,3,C.ink);rect(c,-3,-7,6,10,C.cream);}
 if(id==='I02'){rect(c,-19,-25,38,42,color);ellipse(c,0,3,11,11,C.ink);ellipse(c,0,3,5,5,'#809198');ellipse(c,0,-15,5,5,C.ink);}
 if(id==='I03'){poly(c,[[-24,-15],[18,-21],[27,-12],[-15,-5]],color);line(c,[[-17,-7],[13,20]],C.ink,4);line(c,[[19,-13],[-10,23]],C.ink,4);}
 if(id==='I04'){ellipse(c,0,9,22,9,C.ink);rect(c,-18,-10,36,21,color);ellipse(c,0,-10,18,6,C.cream);ellipse(c,0,-11,13,3,color);line(c,[[-19,-5],[-27,-5],[-27,5],[-18,5]],C.ink,3);}
 if(id==='I05'){rect(c,-17,-31,33,30,color);rect(c,-20,0,43,8,color);line(c,[[-15,5],[-19,29]],C.ink,4);line(c,[[16,5],[20,29]],C.ink,4);line(c,[[-10,-26],[-10,-7],[9,-7],[9,-26]],'#e6aa7f',3);}
 if(id==='I06'){poly(c,[[-17,-4],[17,-4],[12,20],[-12,20]],C.rust);line(c,[[0,0],[0,-33]],C.ink,2);ellipse(c,-9,-21,10,5,color);ellipse(c,8,-30,10,6,C.sage);ellipse(c,9,-13,11,5,C.sage);}
 if(id==='I07'){poly(c,[[-17,-25],[18,-19],[18,24],[-17,17]],color);line(c,[[-11,-21],[-11,17]],C.cream,3);line(c,[[-4,-6],[10,-2]],C.rust,2);line(c,[[23,17],[29,-24]],C.ink,3);}
 if(id==='I08'){rect(c,-23,-16,46,33,color);line(c,[[-23,-5],[23,-5]],C.cream,3);line(c,[[0,-16],[0,17]],C.cream,3);}
 c.restore();}
export function itemIcon(id){const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;drawItem(canvas.getContext('2d'),id,48,53,1.5);return canvas.toDataURL();}
export function portrait(id){const people={rowan:['#cc8261','#b67a58','#303f39','short'],jules:['#7e9279','#b78a68','#453d33','bob'],dani:['#7891a5','#795743','#222f36','curl'],max:['#d8b863','#d1a47b','#6b4c35','fringe'],mara:['#759388','#b78365','#e1d6b7','bob'],bea:['#c99060','#b18469','#493d32','cap'],omar:['#af986c','#946342','#292e29','short'],remy:['#819a98','#c48f72','#695747','cap'],petra:['#c8886d','#bf8d72','#312c2a','bob'],jean:['#94a576','#b2886c','#dfdbc4','curl'],cal:['#c4a770','#936447','#533c2c','curl']};const [bg,skin,hair,style]=people[id]||people.rowan;
 const hairshape=style==='bob'?`<path d="M23 54Q12 13 39 12Q70 10 62 60L52 60 53 27 31 30 31 59Z" fill="${hair}"/>`:style==='curl'?`<path d="M22 39Q12 29 22 25Q15 12 30 14Q38 3 47 14Q63 10 63 25Q72 36 58 43L56 27 26 28Z" fill="${hair}"/>`:style==='cap'?`<path d="M21 28Q20 10 42 11Q60 12 62 29Z" fill="${hair}"/><path d="M16 28H70V34H17Z" fill="#d8af65"/>`:`<path d="M22 35Q17 10 40 12Q64 9 61 35L49 25 28 29 25 43Z" fill="${hair}"/>`;
 return `<svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="84" height="84" rx="42" fill="${bg}"/><path d="M12 85Q12 61 35 59L48 59Q72 63 74 85" fill="#f4e7cb"/><path d="M35 51V66Q43 74 50 65V50" fill="${skin}"/>${hairshape}<ellipse cx="42" cy="40" rx="18" ry="23" fill="${skin}"/><path d="M26 31Q39 33 55 24L59 34Q63 16 44 15Q22 15 23 34" fill="${hair}"/><path d="M31 41h4m14 0h4" stroke="#29362f" stroke-width="2.5" stroke-linecap="round"/><path d="M37 52q5 4 11 0" fill="none" stroke="#754f40" stroke-width="2"/>${id==='jules'?'<path d="M25 38h14v9H25Zm19 0h14v9H44ZM39 41h5" fill="none" stroke="#344138" stroke-width="2"/>':''}</svg>`;
}
function van(c,x,y,s,t,cargo,travel){c.save();c.translate(x,y+(travel?Math.sin(t*8)*1.1:0));c.scale(s,s);ellipse(c,4,37,145,19,'#173c352a');
 poly(c,[[-124,-25],[-110,-88],[53,-88],[104,-40],[106,19],[-117,21]],C.yellow,C.ink,3);
 poly(c,[[53,-88],[84,-104],[129,-56],[104,-40]],'#e8c780',C.ink,3);poly(c,[[104,-40],[129,-56],[130,4],[106,19]],'#ca9550',C.ink,3);
 poly(c,[[-110,-88],[-80,-108],[84,-104],[53,-88]],'#f6deb0',C.ink,3);
 poly(c,[[-112,-31],[102,-30],[105,8],[-119,10]],'#6e9286',C.ink,2);
 poly(c,[[48,-79],[73,-78],[101,-45],[51,-45]],'#294e50');poly(c,[[-44,-78],[36,-78],[36,-46],[-48,-46]],'#427273');poly(c,[[-103,-78],[-60,-78],[-63,-46],[-108,-46]],'#426c68');
 line(c,[[-77,-74],[-77,-48]],'#d9cdae',3);line(c,[[-8,-74],[-8,-48]],'#d9cdae',3);line(c,[[47,-86],[48,10]],C.ink,2);rect(c,53,-33,13,4,C.ink);rect(c,-12,-34,17,4,C.ink);
 // The front window has an actual person, not an empty moving van.
 ellipse(c,69,-59,7,8,'#c99771');poly(c,[[61,-49],[70,-50],[81,-44],[57,-44]],'#eee0bd');
 for(const xx of [-76,76]){ellipse(c,xx,22,24,25,C.ink);ellipse(c,xx,22,13,14,'#e6d8b7');ellipse(c,xx,22,5,5,'#778777');if(travel)line(c,[[xx-Math.cos(t*7)*10,22-Math.sin(t*7)*10],[xx+Math.cos(t*7)*10,22+Math.sin(t*7)*10]],'#86998a',2);}
 poly(c,[[112,-39],[129,-46],[129,-32],[113,-28]],'#fff0b5');rect(c,-125,0,11,10,C.rust);line(c,[[-126,13],[-115,15]],C.ink,5);
 rect(c,-60,-14,59,14,'#f1e5c7');text(c,'COMMON ROAD',-30,-4,7,C.ink,'center');
 line(c,[[-84,-113],[68,-110]],C.ink,3);line(c,[[-71,-114],[-72,-102]],C.ink,3);line(c,[[52,-110],[51,-99]],C.ink,3);
 cargo.slice(0,6).forEach((id,i)=>drawItem(c,id,-73+i*25,-128-(i%2)*3,.48));
 c.restore();}
function house(c,x,y,s,color,ending){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[0,0],[180,0],[180,133],[0,133]],'#f1dfb5');poly(c,[[180,0],[222,-23],[222,103],[180,133]],'#c1b891');poly(c,[[-18,0],[84,-90],[200,0]],color);poly(c,[[84,-90],[127,-112],[224,-23],[200,0]],'#516c5f');rect(c,83,55,34,78,'#567b70');rect(c,22,28,40,40,'#608f91');rect(c,132,28,31,40,'#608f91');line(c,[[42,28],[42,68]],C.cream,3);line(c,[[22,48],[62,48]],C.cream,3);ellipse(c,110,96,2.5,2.5,C.yellow);rect(c,-14,132,210,9,'#b6ac88');if(ending){text(c,ending==='bridge'?'STAY A WHILE':'ROOM TO BREATHE',98,22,8,C.ink,'center');}c.restore();}
function person(c,x,y,s,color,skin){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,5,15,4,'#203e3a20');line(c,[[-5,-22],[-7,2]],C.ink,5);line(c,[[6,-22],[9,2]],C.ink,5);poly(c,[[-10,-49],[8,-49],[13,-19],[-12,-19]],color);ellipse(c,0,-61,10,12,skin);const dark=skin==='#795641'?'#2e3330':'#66503a';poly(c,[[-10,-60],[-11,-69],[-4,-74],[5,-73],[11,-67],[9,-62],[3,-68],[-6,-66]],dark);if(color===C.sage){poly(c,[[-11,-67],[-8,-67],[-8,-49],[-12,-52]],dark);poly(c,[[8,-66],[11,-65],[12,-50],[8,-49]],dark);line(c,[[-7,-60],[-2,-60],[2,-60],[7,-60]],C.ink,1.5);}ellipse(c,-3,-60,.9,1,C.ink);ellipse(c,4,-60,.9,1,C.ink);line(c,[[-2,-54],[2,-53],[5,-54]],'#805940',1);line(c,[[-9,-44],[-19,-24]],skin,4);line(c,[[9,-44],[20,-24]],skin,4);c.restore();}
export function drawScene(canvas,s,t=0,title=false){const bounds=canvas.getBoundingClientRect();if(bounds.width<2)return;const dpr=Math.min(devicePixelRatio||1,2);const pw=Math.round(bounds.width*dpr),ph=Math.round(bounds.height*dpr);if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}const c=canvas.getContext('2d');const scale=Math.max(pw/1000,ph/650);c.setTransform(scale,0,0,scale,(pw-1000*scale)/2,(ph-650*scale)/2);const n=nodeById(s.node);const r=n.region;const arrival=s.mode==='ending';const driving=s.mode==='travel';const rain=driving&&s.travel?.forecast.startsWith('Rain');
 const palettes={departure:['#b4cecb','#7eaa9d','#5d8678','#365c4b'],mountain:['#bdcfd0','#87a6a1','#6f8e85','#3e6659'],plateau:['#ddceb1','#c4b487','#b89d69','#8b9468'],foothills:['#c7d0ba','#a4b19b','#819781','#567766'],plains:['#d6d8bb','#b7bf91','#a5aa71','#7b8756'],camp:['#b8cbc0','#94ab94','#75937d','#3a654e'],lakes:['#b5cdd0','#8fb5ae','#75a3a0','#508b87'],friend:['#b8cbbb','#90ae91','#7c9e7e','#4d765b'],arrival:['#bfd4c7','#9cbaa1','#7ca591','#477b6b'],bridge:['#c4d0c7','#a2b4a2','#85a293','#4d7669']};const p=palettes[r]||palettes.departure;
 const sky=c.createLinearGradient(0,0,0,480);sky.addColorStop(0,rain?'#9daeb0':p[0]);sky.addColorStop(1,'#f1e7c9');c.fillStyle=sky;c.fillRect(0,0,1000,650);
 ellipse(c,735,95,49,49,'#f2d38a');ellipse(c,735,95,63,63,'#f2d38a30');cloud(c,230+t*(driving?1.8:.3)%650,75,.8);cloud(c,480,135,1.1);cloud(c,885,174,.7);
 const offset=driving?t*13:0;
 for(let layer=0;layer<3;layer++){const points=[[-50,520]];for(let i=0;i<15;i++){let x=-60+i*88;let h=230+layer*63+Math.sin(i*1.3+layer*.7)*33+Math.cos(i*2.4)*17;points.push([x,h]);}points.push([1050,650],[-50,650]);poly(c,points,p[layer+1]);}
 if(['lakes','arrival','friend'].includes(r)){poly(c,[[450,307],[1000,280],[1000,448],[484,430]],'#91b9b0');for(let i=0;i<12;i++)line(c,[[550+i%3*50,322+i*7],[700+i%2*270,322+i*7]],'#d8ddbd88',1.5);}
 // Rolling roadside, ochre verges, and a narrow ribbon of asphalt.
 c.beginPath();c.moveTo(-80,524);c.bezierCurveTo(300,449,633,461,1040,391);c.lineTo(1080,469);c.bezierCurveTo(605,559,315,557,-60,662);c.closePath();c.fillStyle='#ddd0a8';c.fill();
 c.beginPath();c.moveTo(-40,548);c.bezierCurveTo(310,471,630,489,1060,414);c.lineTo(1060,448);c.bezierCurveTo(630,524,315,522,-40,620);c.closePath();c.fillStyle='#60736b';c.fill();
 c.save();c.setLineDash([26,24]);c.lineDashOffset=driving?-t*42:0;c.beginPath();c.moveTo(-40,584);c.bezierCurveTo(310,494,630,506,1060,430);c.strokeStyle='#ecdfa7';c.lineWidth=3;c.stroke();c.restore();
 for(let i=0;i<10;i++){let x=(i*133-offset*.4+1600)%1350-150;tree(c,x,379+Math.sin(i*2.7)*19,35+(i%3)*16,p[3]);}
 if(r==='camp'){poly(c,[[629,392],[686,319],[744,392]],C.rust,C.ink,2);poly(c,[[662,392],[686,352],[710,392]],'#665c43');tree(c,787,393,138,'#356149');tree(c,595,404,105,'#4c755b');}
 else if(r==='foothills'){rect(c,606,317,202,83,'#d5b984');poly(c,[[592,318],[620,285],[830,302],[812,318]],C.rust);rect(c,685,335,74,65,'#3e5951');text(c,'BEA’S',637,341,17,C.ink);rect(c,771,350,20,31,'#89aaa1');}
 else if(r==='plateau'&&s.node==='R03'){rect(c,627,313,203,86,'#ecdbb2');rect(c,617,306,224,18,C.rust);rect(c,650,336,63,42,'#597f79');rect(c,752,336,49,42,'#597f79');text(c,'OMAR’S DINER',724,299,18,C.ink,'center');}
 else if(r==='plains'){for(let i=0;i<6;i++){line(c,[[580+i*49,286],[580+i*49,367]],'#64796a',2);poly(c,[[580+i*49,286],[607+i*49,293],[580+i*49,308]],i%2?C.yellow:C.rust);}rect(c,582,367,276,13,'#aa9d75');}
 else if(arrival||['arrival','friend','bridge'].includes(r)){poly(c,[[580,338],[846,310],[932,384],[834,455],[570,429]],p[2]);house(c,616,295,.8,s.ending?.tone||C.rust,s.ending?.id);}
 else {line(c,[[688,286],[688,397]],'#615d45',8);rect(c,614,275,197,61,'#305b4b');n.sign.split(' / ').forEach((v,i)=>text(c,v,711,301+i*20,i?11:15,'#e9e2bf','center'));}
 if(arrival){van(c,278,494,1.12,t,s.cargo,false);person(c,596,442,1,C.rust,'#b77a55');person(c,633,449,.96,C.sage,'#b78763');person(c,675,444,1.08,'#758699','#795641');person(c,718,450,.77,C.yellow,'#cca07a');s.cargo.slice(0,5).forEach((id,i)=>drawItem(c,id,579+i*40,506,.6));ellipse(c,764,452,19,9,'#cfb27c');ellipse(c,779,442,9,9,'#b99163');line(c,[[752,455],[750,465],[755,465]],'#66573d',3);line(c,[[773,457],[776,466]],'#66573d',3);}
 else van(c,title?400:390,driving?483:480,title?1.58:1.45,t,s.cargo,driving);
 // Small foreground grasses and stipple marks keep the art from reading as flat UI.
 for(let i=0;i<95;i++){const x=(i*83.7+31-offset*1.8+9000)%1070-35;const y=583+(i*37)%67;line(c,[[x,y],[x-2,y-4-(i%4)],[x+2,y-2]],'#37593f35',1);}
 if(rain){for(let i=0;i<72;i++){const x=(i*79+t*86)%1080;const y=(i*41+t*180)%650;line(c,[[x,y],[x-6,y+13]],'#e4ece244',1);}}
 c.globalAlpha=.055;for(let i=0;i<1000;i++){rect(c,(i*73.13)%1000,(i*47.71)%650,1.1,.65,i%2?'#ffffff':'#173931');}c.globalAlpha=1;
}
