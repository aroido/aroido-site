import {scroll} from 'motion';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const params=new URLSearchParams(location.search);
const opening=params.get('opening')==='out'?'out':'in';
for(const a of document.querySelectorAll('a[data-opening]')) a.setAttribute('aria-current',String(a.dataset.opening===opening));
const states=[...document.querySelectorAll('.journey')].map(container=>{
 const state={progress:0,reduced:reduced.matches,mode:container.classList.contains('return-journey')?'return':'in'};
 if(!reduced.matches){
  container.dataset.motion='';
  let stop;
  const observe=()=>{
   stop?.();
   stop=scroll(p=>{
   state.progress=p;
   container.style.setProperty('--journey',p);
   container.dataset.focus=state.mode==='in'&&p>.3?'note':'all';
   state.invalidate?.();
   },{target:container,offset:['start start',`end ${container.querySelector('.stage').getBoundingClientRect().height}px`]});
  };
  const resize=new ResizeObserver(observe);
  resize.observe(container.querySelector('.stage'));
  observe();
 }
 return {container,state};
});
window.__hobocode={scenes:states.map(x=>x.state)};
reduced.addEventListener('change',()=>location.reload());
if(!reduced.matches&&!params.has('flat')){
 const probe=document.createElement('canvas');
 const gl=probe.getContext('webgl2');
 if(gl){
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    observer.unobserve(entry.target);
    const {container,state}=states.find(x=>x.container===entry.target);
    import('./scene.jsx').then(m=>m.mountScene(state,opening,container)).catch(()=>{container.dataset.render='fallback'});
   }
  },{rootMargin:'300px'});
  states.forEach(({container})=>observer.observe(container));
 }
}
