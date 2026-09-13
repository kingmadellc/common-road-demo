const $=id=>document.getElementById(id);
$('type-input').addEventListener('input',e=>$('type-preview').textContent=e.target.value||'A place of your own.');
document.querySelectorAll('[data-tone]').forEach(b=>b.addEventListener('click',()=>{const light=b.dataset.tone==='light';$('logo-board').classList.toggle('light',light);document.querySelectorAll('[data-tone]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('[data-logo]').forEach(im=>im.src='../assets/signals-end/signals-end-'+im.dataset.logo+'-'+(light?'dark':'light')+'.svg');}));
$('replay').addEventListener('click',()=>{const im=document.querySelector('.hero-mark');im.classList.remove('reveal');void im.offsetWidth;im.classList.add('reveal');});
const luminance=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(h=>parseInt(h,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
for(const [id,a,b] of [['contrast-paper','F1EADB','17282B'],['contrast-sage','17282B','9CAA77']]){const x=luminance(a),y=luminance(b);$(id).textContent=((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(1)+':1';}
