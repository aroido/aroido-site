import React,{Suspense,useRef,useMemo,useEffect,Component} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {feature} from 'topojson-client';
import world from 'world-atlas/land-110m.json';
const media='/hobocode/media/';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
function point(lon,lat,r=1.005){const a=lat*Math.PI/180,b=(lon-127)*Math.PI/180;return [r*Math.cos(a)*Math.sin(b),r*Math.sin(a),r*Math.cos(a)*Math.cos(b)]}
// Flat geographic ink on a white globe: no light-dependent gloss or coloured shadows.
function landTexture(){
 const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fafafa';ctx.fillRect(0,0,2048,1024);
 const polygons=feature(world,world.objects.land).features[0].geometry.coordinates;
 ctx.fillStyle='#dededb';ctx.strokeStyle='#b8b8b4';ctx.lineWidth=.7;
 for(const polygon of polygons){
  for(const shift of [-2048,0,2048]){
   ctx.beginPath();
   for(const ring of polygon){
    let previous;
    ring.forEach(([lon,lat],i)=>{
     let x=(lon+180)/360*2048;
     if(previous!==undefined){while(x-previous>1024)x-=2048;while(x-previous< -1024)x+=2048;}
     previous=x;const y=(90-lat)/180*1024;
     if(i===0)ctx.moveTo(x+shift,y);else ctx.lineTo(x+shift,y);
    });ctx.closePath();
   }
   ctx.fill('evenodd');ctx.stroke();
  }
 }
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 texture.wrapS=THREE.RepeatWrapping;texture.offset.x=217/360;
 return texture;
}
const vertexShader=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
// Reveal the original artwork, first around the circle, then along each X stroke.
// The source alpha remains untouched; the last frame is the complete official mark.
const fragmentShader=`uniform sampler2D artwork;uniform vec3 ink;uniform float reveal;varying vec2 vUv;
void main(){vec2 p=vUv-.5;float r=length(p);float angle=mod(atan(p.x,p.y)+6.2831853,6.2831853)/6.2831853;
float ring=step(.31,r)*step(angle,reveal/.55);
float first=step(abs(p.x+p.y),.14)*step((.5-p.y),clamp((reveal-.55)/.225,0.,1.));
float second=step(abs(p.x-p.y),.14)*step((.5-p.y),clamp((reveal-.775)/.225,0.,1.));
float visible=max(ring,max(first,second));if(reveal>=.999)visible=1.;
float alpha=texture2D(artwork,vUv).a*visible;if(alpha<.01)discard;gl_FragColor=vec4(ink,alpha);
#include <colorspace_fragment>
}`;
function Earth({state,opening}){
 const group=useRef(),marks=useRef([]),materials=useRef([]),started=useRef(null),entered=useRef(false),onScreen=useRef(false);
 const texture=useTexture(media+'chalk-mark.png');
 const land=useMemo(landTexture,[]);
 const locations=[[127,37],[108,20],[142,47],[83,33]];
 const uniforms=useMemo(()=>locations.map((_,i)=>({artwork:{value:texture},ink:{value:new THREE.Color(i===0?'#b4501f':'#111111')},reveal:{value:0}})),[texture]);
 const elements=useMemo(()=>({visual:document.querySelector('.visual'),cards:locations.map((_,i)=>document.querySelector(`.note-${i}`)),lines:locations.map((_,i)=>document.querySelector(`[data-note-link="${i}"]`))}),[]);
 useEffect(()=>{
  const visual=elements.visual;if(!visual)return;
  const observer=new IntersectionObserver(entries=>{
   onScreen.current=entries.some(entry=>entry.isIntersecting);
   if(onScreen.current){entered.current=true;state.invalidate?.();}
  },{threshold:.15});
  observer.observe(visual);return ()=>observer.disconnect();
 },[elements,state]);
 useFrame(({camera,gl,clock,invalidate})=>{
  document.documentElement.dataset.render='webgl';
  if(entered.current&&started.current===null)started.current=clock.elapsedTime;
  const elapsed=started.current===null?0:clock.elapsedTime-started.current;
  const p=state.progress,end=ease((p-.76)/.24),enter=ease(p/.31);
  let z=opening==='in'?4.05-2.7*enter:1.42+2.63*ease(p/.2)-2.7*ease((p-.2)/.2);
  z=THREE.MathUtils.lerp(z,4.05,end);camera.position.set(0,0,z);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  group.current.rotation.set(.64,(1-enter)*-.08+end*.06,0);group.current.updateWorldMatrix(true,true);
  const hide=ease((p-.32)/.12)*(1-ease((p-.74)/.15));gl.domElement.style.opacity=String(1-hide);
  const box=elements.visual?.getBoundingClientRect(),accepted=[];
  marks.current.forEach((mark,i)=>{
   if(!mark)return;
   materials.current[i].uniforms.reveal.value=ease((elapsed-i*.19)/1.05);
   const worldPosition=mark.getWorldPosition(new THREE.Vector3());
   const facing=worldPosition.clone().normalize().dot(camera.position.clone().sub(worldPosition).normalize())>.08;
   const projected=worldPosition.clone().project(camera);
   const screen={x:(projected.x+1)*.5*(box?.width||0),y:(1-projected.y)*.5*(box?.height||0)};
   const overlapping=accepted.some(other=>Math.hypot(screen.x-other.x,screen.y-other.y)<18);
   mark.visible=facing&&!overlapping;if(mark.visible)accepted.push(screen);
   const line=elements.lines[i],card=elements.cards[i];
   if(line&&card&&box){
    const rect=card.getBoundingClientRect();
    const onScreen=projected.z> -1&&projected.z<1&&Math.abs(projected.x)<.98&&Math.abs(projected.y)<.98;
    // A card can cover a front-facing mark: hide that connector too.
    const obscured=elements.cards.some(other=>{
     const bounds=other.getBoundingClientRect();const x=box.x+screen.x,y=box.y+screen.y;
     return x>=bounds.left-5&&x<=bounds.right+5&&y>=bounds.top-5&&y<=bounds.bottom+5;
    });
    line.style.visibility=mark.visible&&onScreen&&!obscured&&hide<.05?'visible':'hidden';
    line.setAttribute('x1',String((rect.x+rect.width/2-box.x)/box.width*100));line.setAttribute('y1',String((rect.y+rect.height/2-box.y)/box.height*100));
    line.setAttribute('x2',String((projected.x+1)*50));line.setAttribute('y2',String((1-projected.y)*50));
   }
  });
  if(onScreen.current&&entered.current&&elapsed<1.7)invalidate();
 });
 return <group ref={group}>
  <mesh><sphereGeometry args={[1,96,64]}/><meshBasicMaterial map={land}/></mesh>
  {locations.map(([lon,lat],i)=>{
   const pos=new THREE.Vector3(...point(lon,lat,1.009));const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),pos.clone().normalize());
   return <mesh key={i} position={pos} quaternion={q} ref={el=>marks.current[i]=el}><planeGeometry args={[i===0?.13:.10,i===0?.13:.10]}/><shaderMaterial ref={el=>materials.current[i]=el} uniforms={uniforms[i]} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} side={THREE.FrontSide}/></mesh>
  })}
 </group>
}
class Boundary extends Component{state={failed:false};static getDerivedStateFromError(){return {failed:true}}componentDidCatch(){document.documentElement.dataset.render='fallback'}render(){return this.state.failed?null:this.props.children}}
export function mountScene(state,opening){
 const root=createRoot(document.querySelector('#scene'));
 root.render(<Boundary><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,4.05],fov:38}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onCreated={({gl,invalidate})=>{state.invalidate=invalidate;gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.documentElement.dataset.render='fallback';document.querySelectorAll('[data-note-link]').forEach(line=>line.style.visibility='hidden')})}}><Suspense fallback={null}><Earth state={state} opening={opening}/></Suspense></Canvas></Boundary>);
}
