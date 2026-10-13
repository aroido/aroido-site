import React,{Suspense,useRef,useMemo,useEffect,Component} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {feature} from 'topojson-client';
import world from 'world-atlas/land-110m.json' with {type:'json'};
const media='/hobocode/media/';
function showFallback(container){
 container.dataset.render='fallback';delete container.dataset.zoom;
 const label=container.querySelector('.scene-label');if(label)label.textContent=label.dataset.earth;
 container.querySelectorAll('[data-note-link]').forEach(line=>line.style.visibility='hidden');
}
import {ease,ndcToClient,connector,cameraDistance,zoomProgress,markerScale} from './geometry.mjs';
import {Town} from './town.jsx';
import target from './nyc-target.json';
import {clusterMarks} from './cluster-data.mjs';
function point(lon,lat,r=1.005){const a=lat*Math.PI/180,b=(lon-target.longitude)*Math.PI/180;return [r*Math.cos(a)*Math.sin(b),r*Math.sin(a),r*Math.cos(a)*Math.cos(b)]}
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
 texture.wrapS=THREE.RepeatWrapping;texture.offset.x=(90+target.longitude)/360;
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
function ManyMarks({state,opening}){
 const texture=useTexture(media+'chalk-mark.png'),mesh=useRef();
 const positions=useMemo(()=>clusterMarks.map(m=>new THREE.Vector3(...point(m.lon,m.lat,1.004)).applyAxisAngle(new THREE.Vector3(1,0,0),target.latitude*Math.PI/180)),[]);
 useFrame(({camera,size})=>{
  const q=zoomProgress(state.progress,state.mode,opening),accepted=[],matrix=new THREE.Matrix4();state.globeMarks=[];
  const main=state.geometry?.filter(g=>g.markerVisible).map(g=>g.marker)||[];
  positions.forEach((p,i)=>{
   const projected=p.clone().project(camera),screen={x:(projected.x+1)*size.width/2,y:(1-projected.y)*size.height/2};
   const pixels=clusterMarks[i].pixels;
   const visible=q<.33&&main.every(a=>Math.hypot(a.x-screen.x-(state.canvasOffset?.x||0),a.y-screen.y-(state.canvasOffset?.y||0))>22)&&p.clone().normalize().dot(camera.position.clone().sub(p).normalize())>.15&&Math.abs(projected.x)<.98&&Math.abs(projected.y)<.98&&accepted.every(a=>Math.hypot(a.x-screen.x,a.y-screen.y)>(a.pixels+pixels)/2+1.5);
   const scale=visible?markerScale(-p.clone().applyMatrix4(camera.matrixWorldInverse).z,size.height,camera.fov,.04,pixels):0;
   matrix.compose(p,new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),p.clone().normalize()),new THREE.Vector3(scale,scale,scale));
   if(visible){
    const bounds=()=>{const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,y])=>new THREE.Vector3(x*.02,y*.02,0).applyMatrix4(matrix).project(camera));
    const width=(Math.max(...corners.map(p=>p.x))-Math.min(...corners.map(p=>p.x)))*size.width/2,height=(Math.max(...corners.map(p=>p.y))-Math.min(...corners.map(p=>p.y)))*size.height/2;return {width,height}};
    let {width,height}=bounds();if(Math.max(width,height)>pixels){matrix.scale(new THREE.Vector3().setScalar(pixels/Math.max(width,height)*.999));({width,height}=bounds());}
    accepted.push({...screen,pixels});state.globeMarks.push({...screen,pixels,width,height,cap:8,lon:clusterMarks[i].lon,lat:clusterMarks[i].lat,city:clusterMarks[i].city});
   }
   mesh.current.setMatrixAt(i,matrix);
  });mesh.current.instanceMatrix.needsUpdate=true;
 });
 return <instancedMesh ref={mesh} args={[null,null,positions.length]} frustumCulled={false}><planeGeometry args={[.04,.04]}/><meshBasicMaterial map={texture} transparent depthWrite={false} color="#333333"/></instancedMesh>;
}
function Earth({state,opening,container}){
 const group=useRef(),earth=useRef(),town=useRef(),marks=useRef([]),materials=useRef([]),started=useRef(null),entered=useRef(false),onScreen=useRef(false);
 const texture=useTexture(media+'chalk-mark.png');
 const land=useMemo(landTexture,[]);
 const locations=[[target.longitude,target.latitude],[-96.80,32.78],[-79.38,43.65],[-118.24,34.05]];
 const uniforms=useMemo(()=>locations.map((_,i)=>({artwork:{value:texture},ink:{value:new THREE.Color(i===0?'#b4501f':'#111111')},reveal:{value:0}})),[texture]);
 const elements=useMemo(()=>({visual:container.querySelector('.visual'),svg:container.querySelector('.note-links'),cards:locations.map((_,i)=>container.querySelector(`.note-${i}`)),lines:locations.map((_,i)=>container.querySelector(`[data-note-link="${i}"]`))}),[container]);
 useEffect(()=>{
  const visual=elements.visual;if(!visual)return;
  const observer=new IntersectionObserver(entries=>{
   onScreen.current=entries.some(entry=>entry.isIntersecting);
   if(onScreen.current){entered.current=true;state.invalidate?.();}
  },{threshold:.15});
  const resize=new ResizeObserver(()=>state.invalidate?.());
  observer.observe(visual);resize.observe(visual);
  elements.cards.forEach(card=>card&&resize.observe(card));
  return ()=>{observer.disconnect();resize.disconnect();land.dispose();};
 },[elements,state,land]);
 useFrame(({camera,gl,clock,invalidate})=>{
  if(state.contextLost)return;
  container.dataset.render='webgl';
  if(entered.current&&started.current===null)started.current=clock.elapsedTime;
  const elapsed=started.current===null?0:clock.elapsedTime-started.current;state.revealDone=elapsed>=1.7;
  const canvasRect=gl.domElement.getBoundingClientRect();state.canvasOffset={x:canvasRect.left,y:canvasRect.top};
  const fit=Math.sqrt(1+(canvasRect.height/(canvasRect.width*.84*Math.tan(camera.fov*Math.PI/360)))**2);
  const z=cameraDistance(state.progress,state.mode,opening,Math.max(4.05,fit));
  const q=zoomProgress(state.progress,state.mode,opening);
  const townVisible=q>.27;
  earth.current.visible=q<.4;town.current.visible=townVisible;
  const blend=ease((q-.27)/.08);
  town.current.traverse(object=>{if(object.material&&!object.isSprite){object.material.transparent=blend<1;object.material.opacity=blend;object.material.depthWrite=blend>=1;}});
  // Globe overview transitions to self-hosted real OSM street/building geometry.
  container.dataset.zoom=q>.89?'building':q>.65?'street':q>.3?'city':'earth';
  container.style.setProperty('--memo-open',q>.89?1:0);
  const label=container.querySelector('.scene-label');
  if(label)label.textContent=label.dataset[container.dataset.zoom]||label.dataset.earth;
  state.zoom={q,level:container.dataset.zoom,distance:z-1};
  camera.near=Math.max(.000001,(z-1)*.04);camera.far=10;camera.updateProjectionMatrix();
  const roof=(.00002+target.height*.00001)*ease((q-.3)/.5);
  camera.position.set(0,-(z-1)*.55*ease((q-.55)/.35),z+roof);camera.lookAt(0,0,1+roof);camera.updateMatrixWorld();
  // Exactly centre the selected longitude/latitude. No yaw drift during the zoom.
  group.current.rotation.set(target.latitude*Math.PI/180,0,0);group.current.updateWorldMatrix(true,true);
  const accepted=[];
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
   const size=i===0?.13:.10;
   mark.scale.setScalar(markerScale(-worldPosition.clone().applyMatrix4(camera.matrixWorldInverse).z,canvasRect.height,camera.fov,size,i===0?28:22));
   mark.updateWorldMatrix(true,false);
   const bounds=()=>{
    const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,y])=>ndcToClient(new THREE.Vector3(x*size/2,y*size/2,0).applyMatrix4(mark.matrixWorld).project(camera),canvasRect));
    return {width:Math.max(...corners.map(p=>p.x))-Math.min(...corners.map(p=>p.x)),height:Math.max(...corners.map(p=>p.y))-Math.min(...corners.map(p=>p.y))};
   };
   let pixelBounds=bounds();const cap=i===0?28:22;
   for(let attempt=0;attempt<2&&Math.max(pixelBounds.width,pixelBounds.height)>cap;attempt++){
    mark.scale.multiplyScalar(cap/Math.max(pixelBounds.width,pixelBounds.height)*.999);
    mark.updateWorldMatrix(true,false);pixelBounds=bounds();
   }
   const facing=worldPosition.clone().normalize().dot(camera.position.clone().sub(worldPosition).normalize())>.08;
   const projected=worldPosition.clone().project(camera),screen=ndcToClient(projected,canvasRect);
   const overlapping=accepted.some(other=>Math.hypot(screen.x-other.x,screen.y-other.y)<18);
   mark.visible=facing&&!overlapping&&(i===0||(state.mode==='return'&&q<.3));if(mark.visible)accepted.push(screen);
   const line=elements.lines[i],cardRect=activeCards[i];
   const result=cardRect?connector({projected,canvasRect,cardRect,otherCards:activeCards.filter(Boolean),screenMatrix,facing:mark.visible,overlapping}):{visible:false,marker:screen};
   state.geometry.push({index:i,pixelBounds,markerVisible:mark.visible,pixelCap:i===0?28:22,scale:mark.scale.x,...result,facing,overlapping,projected:{x:projected.x,y:projected.y,z:projected.z}});
   if(line){
    line.style.visibility=result.visible?'visible':'hidden';
    if(result.visible){
     line.setAttribute('x1',String(result.start.x));line.setAttribute('y1',String(result.start.y));
     line.setAttribute('x2',String(result.end.x));line.setAttribute('y2',String(result.end.y));
    }
   }
  });
  if(onScreen.current&&entered.current&&elapsed<1.7)invalidate();
 },-2);
 return <><ManyMarks state={state} opening={opening}/><ambientLight intensity={1.3}/><directionalLight position={[-2,-3,5]} intensity={1.3}/><Town groupRef={town} state={state} opening={opening}/><group ref={group}>
  <mesh ref={earth}><sphereGeometry args={[1,96,64]}/><meshBasicMaterial map={land}/></mesh>
  {locations.map(([lon,lat],i)=>{
   const pos=new THREE.Vector3(...point(lon,lat,i===0?1.00002+target.height*.00001+.00003:1.009));const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),pos.clone().normalize());
   return <mesh key={i} position={pos} quaternion={q} ref={el=>marks.current[i]=el}><planeGeometry args={[i===0?.13:.10,i===0?.13:.10]}/><shaderMaterial ref={el=>materials.current[i]=el} uniforms={uniforms[i]} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} side={THREE.FrontSide}/></mesh>
  })}
 </group></>
}
class Boundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(){showFallback(this.props.container)}
 render(){return this.state.failed?null:this.props.children}
}
export function mountScene(state,opening,container){
 const target=container.querySelector('.scene');if(!target)return ()=>{};
 const root=createRoot(target);
 root.render(<Boundary container={container}><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,4.05],fov:38,near:.00001,far:100}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onCreated={({gl,invalidate})=>{
  state.invalidate=invalidate;
  gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();state.contextLost=true;showFallback(container)});
 }}><Suspense fallback={null}><Earth state={state} opening={opening} container={container}/></Suspense></Canvas></Boundary>);
 return ()=>{state.invalidate=undefined;root.unmount();};
}
