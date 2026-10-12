import React,{Suspense,useRef,useMemo,Component} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas,useFrame} from '@react-three/fiber';
import {Line,useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {feature} from 'topojson-client';
import world from 'world-atlas/land-110m.json';
const media='/hobocode/media/';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
function point(lon,lat,r=1.005){const a=lat*Math.PI/180,b=(lon-127)*Math.PI/180;return [r*Math.cos(a)*Math.sin(b),r*Math.sin(a),r*Math.cos(a)*Math.cos(b)]}
function Earth({state,opening}){
 const group=useRef(),marks=useRef([]);
 const texture=useTexture(media+'pin-selected.svg');
 const coast=useMemo(()=>{
  const coords=feature(world,world.objects.land).features[0].geometry.coordinates;
  return coords.flatMap(poly=>poly.map(ring=>ring.map(c=>point(...c))));
 },[]);
 const grid=useMemo(()=>{
  const lines=[];
  for(let lat=-60;lat<=60;lat+=30) lines.push(Array.from({length:121},(_,i)=>point(i*3-180,lat,1.002)));
  for(let lon=-180;lon<180;lon+=30) lines.push(Array.from({length:61},(_,i)=>point(lon,i*3-90,1.002)));
  return lines;
 },[]);
 const locations=[[127,37],[108,20],[142,47],[83,33],[154,-15],[56,15]];
 useFrame(({camera,gl})=>{
  document.documentElement.dataset.render='webgl';
  const p=state.progress;
  const end=ease((p-.76)/.24);
  const enter=ease(p/.31);
  let z=opening==='in'?4.05-(2.7*enter):1.42+2.63*ease(p/.2)-2.7*ease((p-.2)/.2);
  z=THREE.MathUtils.lerp(z,4.05,end);
  camera.position.set(0,0,z);camera.lookAt(0,0,0);
  group.current.rotation.set(.64,0,0);
  group.current.rotation.y=(1-enter)*-.28+end*.22;
  marks.current.forEach((mark,i)=>{if(mark) mark.visible=i===0 || p>(i*.023+.012)});
  const hide=ease((p-.32)/.12)*(1-ease((p-.74)/.15));
  gl.domElement.style.opacity=String(1-hide);
 });
 return <group ref={group}>
  <mesh><sphereGeometry args={[1,64,40]}/><meshStandardMaterial color="#e7e8e5" roughness={1}/></mesh>
  {grid.map((pts,i)=><Line key={'g'+i} points={pts} color="#c5c8c1" lineWidth={.5}/>)}
  {coast.filter(r=>r.length>5).map((pts,i)=><Line key={i} points={pts} color="#8f9689" lineWidth={1}/>)}
  {locations.map(([lon,lat],i)=>{
   const pos=new THREE.Vector3(...point(lon,lat,1.018));const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),pos.clone().normalize());
   return <mesh key={i} position={pos} quaternion={q} ref={el=>marks.current[i]=el}><planeGeometry args={[i===0?.12:.075,i===0?.12:.075]}/><meshBasicMaterial map={texture} transparent depthWrite={false} side={THREE.FrontSide}/></mesh>
  })}
 </group>
}
class Boundary extends Component{state={failed:false};static getDerivedStateFromError(){return {failed:true}}componentDidCatch(){document.documentElement.dataset.render='fallback'}render(){return this.state.failed?null:this.props.children}}
export function mountScene(state,opening){
 const root=createRoot(document.querySelector('#scene'));
 root.render(<Boundary><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,4.05],fov:38}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onCreated={({gl,invalidate})=>{state.invalidate=invalidate;gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.documentElement.dataset.render='fallback'})}}><ambientLight intensity={1.8}/><directionalLight position={[-3,5,4]} intensity={2}/><Suspense fallback={null}><Earth state={state} opening={opening}/></Suspense></Canvas></Boundary>);
}
