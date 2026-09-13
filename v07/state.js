export const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
export function log(s,title,body){s.journal.unshift({hour:Math.round(s.hour*10)/10,title,body});s.journal=s.journal.slice(0,80);s.message=body;}
export function finish(s,id,title,text){s.mode='ending';s.activity=null;s.road=null;s.ending={id,title,text,owned:id==='home',hour:s.hour};log(s,title,text);}
export function consumeFresh(s,amount){for(const food of s.freshFood){const n=Math.min(amount,food.meals);food.meals-=n;amount-=n;}s.freshFood=s.freshFood.filter(x=>x.meals>.001);}
export function spend(s,h){for(let remaining=h;remaining>1e-7;){const dt=Math.min(.125,remaining);remaining-=dt;s.hour+=dt;const used=Math.min(s.meals,dt/8);consumeFresh(s,used);s.meals=Math.max(0,s.meals-dt/8);for(const food of s.freshFood){if(food.expires<=s.hour){s.meals=Math.max(0,s.meals-food.meals);food.meals=0;s.flags.spoiled=true;}}s.freshFood=s.freshFood.filter(x=>x.meals>.001);if(s.meals<=0){s.health=clamp(s.health-dt*5);s.energy=clamp(s.energy-dt*3);s.flags.hungry=true;}if(s.health<=0){finish(s,'stranded','The family comes first.','Independent road volunteers get everyone to a county shelter. The van and this intake are lost. The family survives, with a difficult next decision ahead.');return;}}}
export const slots=s=>Object.values(s.parts).reduce((n,a)=>n+a.length,0)+(s.cargo?3:0);
export const hurt=s=>s.effects.handUntil>s.hour;
export function shopStock(s,id){s.stocks[id]??={fuel:2,food:1,fan:1,relay:1,tire:1};return s.stocks[id];}
export const OFFERS={fuel:{price:45,label:'14 fuel',amount:14},food:{price:30,label:'3 family meals',amount:3},fan:{price:55,label:'Cooling fan'},relay:{price:40,label:'Pump relay'},tire:{price:40,label:'Spare tire'}};
