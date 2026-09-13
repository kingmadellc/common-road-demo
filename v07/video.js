const players=new Map();let active=null;
export function filmPlayer(id,elapsed,paused){
 if(active&&active!==id)players.get(active)?.pause();active=id;
 let video=players.get(id);if(!video){video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';video.src=`assets/journey-v05/film-${id}.mp4?cut=083`;video.setAttribute('aria-hidden','true');players.set(id,video);}
 if(video.readyState>=2){const target=Math.min(3.15,elapsed);if(Math.abs(video.currentTime-target)>.3)video.currentTime=target;if(paused){video.pause();}else if(video.paused)video.play().catch(()=>{});return video;}
 return null;
}
export function pauseFilms(){for(const v of players.values())if(!v.paused)v.pause();active=null;}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseFilms();});
