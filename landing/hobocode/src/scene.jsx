import React,{Suspense,useRef,useMemo,useEffect,Component} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {feature} from 'topojson-client';
import world from 'world-atlas/land-110m.json';
const media='/hobocode/media/';
import {ease,ndcToClient,connector,cameraDistance} from './geometry.mjs';
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
function Earth({state,opening,container}){
 const group=useRef(),marks=useRef([]),materials=useRef([]),started=useRef(null),entered=useRef(false),onScreen=useRef(false);
 const texture=useTexture(media+'chalk-mark.png');
 const land=useMemo(landTexture,[]);
 const locations=[[127,37],[108,20],[142,47],[83,33]];
 const uniforms=useMemo(()=>locations.map((_,i)=>({artwork:{value:texture},ink:{value:new THREE.Color(i===0?'#b4501f':'#111111')},reveal:{value:0}})),[texture]);
 const elements=useMemo(()=>({visual:container.querySelector('.visual'),svg:container.querySelector('.note-links'),cards:locations.map((_,i)=>container.querySelector(`.note-${i}`)),lines:locations.map((_,i)=>container.querySelector(`[data-note-link="${i}"]`))}),[container]);
 useEffect(()=>{
  const visual=elements.visual;if(!visual)return;
  const observer=new IntersectionObserver(entries=>{
   onScreen.current=entries.some(entry=>entry.isIntersecting);
   if(onScreen.current){entered.current=true;state.invalidate?.();}
  },{threshold:.15});
  const resize=new ResizeObserver(()=>state.invalidate?.());
  observer.observe(visual);resize.observe(visual);elements.cards.forEach(card=>card&&resize.observe(card));
  return ()=>{observer.disconnect();resize.disconnect();land.dispose();};
 },[elements,state,land]);
 useFrame(({camera,gl,clock,invalidate})=>{
  if(state.contextLost)return;
  container.dataset.render='webgl';
  if(entered.current&&started.current===null)started.current=clock.elapsedTime;
  const elapsed=started.current===null?0:clock.elapsedTime-started.current;
  const z=cameraDistance(state.progress,state.mode,opening);
  camera.position.set(0,0,z);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  // Exactly centre the selected longitude/latitude. No yaw drift during the zoom.
  group.current.rotation.set(37*Math.PI/180,0,0);group.current.updateWorldMatrix(true,true);
  const canvasRect=gl.domElement.getBoundingClientRect(),accepted=[];
  const activeCards=elements.cards.map(card=>{
   if(!card)return null;const style=getComputedStyle(card),bounds=card.getBoundingClientRect();
   return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity)>.01&&bounds.width>0&&bounds.height>0?bounds:null;
  });
  const screenMatrix=elements.svg?.getScreenCTM();
  state.geometry=[];
  marks.current.forEach((mark,i)=>{
   if(!mark)return;
   materials.current[i].uniforms.reveal.value=ease((elapsed-i*.19)/1.05);
   const worldPosition=mark.getWorldPosition(new THREE.Vector3());
   const facing=worldPosition.clone().normalize().dot(camera.position.clone().sub(worldPosition).normalize())>.08;
   const projected=worldPosition.clone().project(camera),screen=ndcToClient(projected,canvasRect);
   const overlapping=accepted.some(other=>Math.hypot(screen.x-other.x,screen.y-other.y)<18);
   mark.visible=facing&&!overlapping;if(mark.visible)accepted.push(screen);
   const line=elements.lines[i],cardRect=activeCards[i];
   const result=cardRect?connector({projected,canvasRect,cardRect,otherCards:activeCards.filter(Boolean),screenMatrix,facing,overlapping}):{visible:false,marker:screen};
   state.geometry.push({index:i,...result,facing,overlapping,projected:{x:projected.x,y:projected.y,z:projected.z}});
   if(line){
    line.style.visibility=result.visible?'visible':'hidden';
    if(result.visible){
     line.setAttribute('x1',String(result.start.x));line.setAttribute('y1',String(result.start.y));
     line.setAttribute('x2',String(result.end.x));line.setAttribute('y2',String(result.end.y));
    }
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
class Boundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(){this.props.container.dataset.render='fallback'}
 render(){return this.state.failed?null:this.props.children}
}
export function mountScene(state,opening,container){
 const target=container.querySelector('.scene');if(!target)return ()=>{};
 const root=createRoot(target);
 root.render(<Boundary container={container}><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,4.05],fov:38}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onCreated={({gl,invalidate})=>{
  state.invalidate=invalidate;
  gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();state.contextLost=true;container.dataset.render='fallback';container.querySelectorAll('[data-note-link]').forEach(line=>line.style.visibility='hidden')});
 }}><Suspense fallback={null}><Earth state={state} opening={opening} container={container}/></Suspense></Canvas></Boundary>);
 return ()=>{state.invalidate=undefined;root.unmount();};
}
