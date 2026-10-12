import {scroll} from 'motion';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const params=new URLSearchParams(location.search);
const opening=params.get('opening')==='out'?'out':'in';
document.documentElement.dataset.opening=opening;
for(const a of document.querySelectorAll('a[data-opening]')) a.setAttribute('aria-current',a.dataset.opening===opening?'true':'false');
let state={progress:0,reduced:reduced.matches};
window.__hobocode=state;
function update(p){
 if(state.progress!==p){state.progress=p;state.invalidate?.();}
 document.documentElement.style.setProperty('--journey',p);
 document.documentElement.style.setProperty('--approach',Math.max(0,Math.min(1,(p-.09)/.12)));
 document.documentElement.dataset.focus=p>.12&&p<.23?'note':'all';
 const phase=p<.23?0:p<.48?1:p<.73?2:3;
 document.querySelectorAll('.chapter').forEach((el,i)=>el.classList.toggle('current',i===phase));
 document.querySelector('.scene-label').textContent=document.querySelectorAll('.chapter')[phase].dataset.scene;
}
const track=document.querySelector('.journey');
scroll(p=>update(p),{target:track,offset:['start start','end end']});
reduced.addEventListener('change',()=>location.reload());
if(!reduced.matches && !params.has('flat')){
 const canvas=document.createElement('canvas');
 const gl=canvas.getContext('webgl2');
 if(gl){
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  const load=()=>import('./scene.jsx').then(m=>m.mountScene(state,opening)).catch(()=>{document.documentElement.dataset.render='fallback'});
  if('requestIdleCallback' in window) requestIdleCallback(load,{timeout:1800}); else setTimeout(load,300);
 }
}
