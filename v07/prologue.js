import {FILM_ID,FILM_DURATION,FILM_SCENES,filmCaption,filmSceneAt,drawOpeningFrame} from './opening-film.js?v=0.8.9-sequence-1';
export const INTRO_KEY='signals-end-opening-history';
export const BEATS=FILM_SCENES;
export function readOpeningHistory(storage){try{const value=JSON.parse(storage.getItem(INTRO_KEY));return [FILM_ID,'run-for-it-8','run-for-it-7','run-for-it-6','run-for-it-5','run-for-it-4','run-for-it-3','run-for-it-2','run-for-it-1'].includes(value?.id)&&['started','skipped','watched'].includes(value.status)?value:null;}catch{return null;}}
export function rememberOpening(storage,status){try{const old=readOpeningHistory(storage),rank={started:1,skipped:2,watched:3};if(old?.id===FILM_ID&&rank[old.status]>rank[status])return;storage.setItem(INTRO_KEY,JSON.stringify({id:FILM_ID,status,at:Date.now()}));}catch{}}
export function shouldAutoOpen({seen=false,hasSave=false,reducedMotion=false,saveData=false,force=false}){return force||(!seen&&!hasSave&&!reducedMotion&&!saveData);}
export function newPrologue(replay=false){return {id:FILM_ID,time:0,index:0,elapsed:0,paused:false,replay,muted:true,source:'loading',blocked:false};}
export function setFilmTime(p,time){p.time=Math.max(0,Math.min(FILM_DURATION,Number.isFinite(time)?time:0));p.index=FILM_SCENES.indexOf(filmSceneAt(p.time));p.elapsed=p.time-FILM_SCENES[p.index].start;}
export function movePrologue(p,direction){const index=Math.max(0,Math.min(FILM_SCENES.length-1,p.index+direction));setFilmTime(p,FILM_SCENES[index].start+.8);}
export function prologueState(p){return p?{id:p.id,time:Math.round(p.time*10)/10,duration:FILM_DURATION,index:p.index,paused:p.paused,muted:p.muted,source:p.source,blocked:p.blocked,caption:filmCaption(filmSceneAt(p.time)),replay:p.replay}:null;}
export function drawPrologue(ctx,w,h,p,images,reduced){drawOpeningFrame(ctx,w,h,p.time,images,{still:reduced||p.source==='stills'});}
export {FILM_ID,FILM_DURATION,FILM_SCENES,filmCaption};
