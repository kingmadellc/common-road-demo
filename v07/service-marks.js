// Original 24-unit symbols, shared by software, signage and downloadable vectors.
// The uniform public system deliberately feels more impersonal than the game identity.
import {APPS} from './institutions.js?v=0.8.9-sequence-1';
export const SERVICE_INK='#183044',SERVICE_LIGHT='#edf3f7',SERVICE_ACCENT='#88aac4';
export const SERVICE_PATHS={
 watch:['M5 8V5H8 M16 5H19V8 M19 16V19H16 M8 19H5V16','M14.5 10A2.5 2.5 0 1 1 9.5 10A2.5 2.5 0 1 1 14.5 10','M8 16C8 12.8 16 12.8 16 16'],
 account:['M4 7H18V10 M4 7V18H20V10H4V7L16 4V7','M15 13H20V16H15Z'],
 home:['M4 11L12 4L20 11 M6 10V20H10V14H14V20H18V10'],
 food:['M4 12H20C19.5 18 16.5 20 12 20C7.5 20 4.5 18 4 12Z','M7 4V8 M12 3V8 M17 4V8'],
 work:['M4 8H20V20H4Z M9 8V4H15V8 M4 12L12 15L20 12 M12 14V17'],
 care:['M9 4H15V9H20V15H15V20H9V15H4V9H9Z'],
 power:['M12 3V11','M7 6A8 8 0 1 0 17 6'],
 travel:['M8 3L3 21 M16 3L21 21 M12 4V7 M12 11V14 M12 18V21'],
 enforcement:['M12 3L20 6V12C20 16 17 19 12 21C7 19 4 16 4 12V6Z','M9 12L11 14L15 10']
};
export function serviceSVG(id,{tile=true,label=false}={}){
 const app=APPS.find(a=>a.id===id);if(!app)throw Error('Unknown service '+id);
 const size=tile?40:24,geometry=SERVICE_PATHS[id].map(d=>`<path d="${d}"/>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" ${label?`role="img" aria-label="${app.name}"`:'aria-hidden="true"'}>${tile?`<rect width="40" height="40" rx="10" fill="${SERVICE_INK}"/>`:''}<g transform="translate(${tile?8:0} ${tile?8:0})" fill="none" stroke="${tile?SERVICE_LIGHT:'currentColor'}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${geometry}</g></svg>`;
}
export function serviceBadge(id){const app=APPS.find(a=>a.id===id);return `<span class="service-badge">${serviceSVG(id)}<strong>${app.name}</strong></span>`;}
export function drawService(c,id,x,y,size,{color=SERVICE_LIGHT,tile=false}={}){
 c.save();c.translate(x,y);if(tile){c.fillStyle=SERVICE_INK;c.beginPath();c.roundRect(0,0,size,size,size*.25);c.fill();c.translate(size*.20,size*.20);size*=.60;}
 c.scale(size/24,size/24);c.strokeStyle=color;c.lineWidth=2;c.lineCap='round';c.lineJoin='round';for(const d of SERVICE_PATHS[id])c.stroke(new Path2D(d));c.restore();
}
