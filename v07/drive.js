export const WHEEL_RADIUS=.36,VAN_LENGTH=4.97;
export function roadSpeed(r){const cruise=r.kind==='paved'?67:r.kind==='rough'?31:43;const ramp=Math.min(1,Math.max(0,r.elapsed/2.8),Math.max(0,(r.duration-r.elapsed)/2.6));return cruise*(.18+.82*ramp);}
export function advanceRoad(r,dt){r.elapsed=Math.min(r.duration,r.elapsed+dt);r.mph=roadSpeed(r);r.meters=(r.meters||0)+r.mph*.44704*dt;r.wheelAngle=r.meters/WHEEL_RADIUS;}
