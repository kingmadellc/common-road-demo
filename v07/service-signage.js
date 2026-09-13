import {drawService} from './service-marks.js?v=0.8.5-safety-1';
import {APPS} from './institutions.js?v=0.8.5-safety-1';
// Positions measured against the native 1672 × 941 scene. These are physical signs,
// not screen-space UI. Each plate inherits the perspective of its existing surface.
export const SIGNAGE={
 'intro-city':[
  ['home',[[516,3],[639,0],[639,283],[516,279]],'dark'],
  ['watch',[[771,228],[820,227],[820,370],[771,370]],'dark'],
  ['power',[[1154,170],[1219,167],[1219,323],[1154,323]],'light'],
  ['food',[[1477,358],[1590,346],[1590,412],[1477,420]],'dark'],
  ['watch',[[783,82],[817,83],[817,116],[783,115]],'light'],
  ['watch',[[896,23],[931,23],[931,58],[896,58]],'light'],
  ['watch',[[311,672],[353,666],[353,750],[311,758]],'dark'],
  ['watch',[[961,753],[992,751],[992,805],[961,807]],'dark'],
  ['watch',[[1395,842],[1435,845],[1435,904],[1395,901]],'dark'],
  ['travel',[[1120,582],[1153,583],[1153,627],[1120,626]],'dark'],
  ['travel',[[1013,377],[1057,377],[1057,425],[1013,425]],'light']
 ],
 squad:[['enforcement',[[677,106],[700,104],[698,125],[675,127]],'patch'],['enforcement',[[817,337],[838,340],[840,358],[818,355]],'patch'],['enforcement',[[973,336],[995,338],[989,360],[967,357]],'patch']],
 blocked:[['enforcement',[[975,363],[1021,364],[1024,430],[976,429]],'patch']],
 'transport-body':[['enforcement',[[981,507],[1083,507],[1083,622],[981,622]],'patch']],
 campus:[['work',[[1500,83],[1581,72],[1598,345],[1510,355]],'worn']],
 plaza:[['travel',[[215,73],[421,111],[421,191],[215,161]],'worn']],
 scanner:[['enforcement',[[253,159],[389,159],[395,257],[249,258]],'patch'],['enforcement',[[657,300],[741,310],[741,402],[657,392]],'patch']]
};
function surface(c,im,q){
 c.save();c.transform((q[1][0]-q[0][0])/im.width,(q[1][1]-q[0][1])/im.width,(q[3][0]-q[0][0])/im.height,(q[3][1]-q[0][1])/im.height,q[0][0],q[0][1]);c.drawImage(im,0,0);c.restore();
}
function plate(id,kind,ratio){
 const c=document.createElement('canvas');c.width=384;c.height=Math.round(384/ratio);const g=c.getContext('2d'),w=c.width,h=c.height,light=kind==='light',fg=light?'#293a40':kind==='patch'?'#ae8849':'#b2c3c9';
 g.fillStyle=light?'#8e9c9f':kind==='patch'?'#151e1d':'#1c2c35';g.fillRect(0,0,w,h);
 const tall=h>w*1.6,size=Math.min(w,h)*.60,iconOnly=Math.max(w/h,h/w)<1.7;
 drawService(g,id,(w-size)/2,iconOnly?(h-size)/2:tall?h*.22:(h-size)/2,size,{color:fg});
 if(!iconOnly){g.fillStyle=fg;g.textAlign='center';g.textBaseline='top';g.font=`600 ${w*.17}px Road,sans-serif`;if(tall)g.fillText(APPS.find(a=>a.id===id).name,w/2,h*.62);}
 // Weathering stays fixed to the surface. No random shimmer in film exports.
 for(let i=0;i<1400;i++){g.fillStyle=i%2?'#0c171b18':'#b2c7cc0b';g.fillRect((i*97.71)%w,(i*61.43)%h,1+i%3,2+i%9);}
 const shade=g.createLinearGradient(0,0,w,h);shade.addColorStop(0,'#fff0');shade.addColorStop(1,'#0005');g.fillStyle=shade;g.fillRect(0,0,w,h);return c;
}
export function signedArtwork(id,im){
 const signs=SIGNAGE[id];if(!signs||!im?.naturalWidth)return im;
 const canvas=document.createElement('canvas');canvas.width=im.naturalWidth;canvas.height=im.naturalHeight;const c=canvas.getContext('2d');c.drawImage(im,0,0);c.scale(canvas.width/1672,canvas.height/941);
 for(const [service,q,kind] of signs){const width=Math.hypot(q[1][0]-q[0][0],q[1][1]-q[0][1]),height=Math.hypot(q[3][0]-q[0][0],q[3][1]-q[0][1]),p=plate(service,kind,width/height);c.save();if(kind==='patch'&&width<100)c.filter='blur(0.7px)';surface(c,p,q);c.restore();}
 Object.defineProperties(canvas,{naturalWidth:{value:canvas.width},naturalHeight:{value:canvas.height},complete:{value:true}});return canvas;
}
