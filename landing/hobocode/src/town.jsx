import React,{useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';

// Original fictional geometry, in illustrative metres. Not an actual city or address.
// Every scale uses these same roads, parcels and buildings; no bitmap zoom substitute.
function blocks(){
 const buildings=[],roads=[],parks=[];
 for(let i=-15;i<=15;i++){
  if(Math.abs(i)>=2)roads.push([i*400,0,38,12400,0],[0,i*400,12400,38,0]);
  for(let j=-15;j<=15;j++){
   if(Math.abs(i)<2&&Math.abs(j)<2)continue;
   for(let a=0;a<3;a++)for(let b=0;b<3;b++){
    const x=i*400+72+a*105,y=j*400+72+b*105;
    const n=Math.abs(i*19+j*31+a*7+b*13);
    if(n%11===0)parks.push([x,y,80,72,.3]);
    else buildings.push([x,y,60+n%20,54+n%24,8+n%20]);
   }
  }
 }
 // A connected neighbourhood, then an individual parcel with rear parking access.
 for(let i=-7;i<=7;i++)roads.push([(i+.5)*90,0,12,1350,0],[0,(i+.5)*90,1350,12,0]);
 for(let i=-7;i<7;i++)for(let j=-7;j<7;j++){
  if(i===0&&j===0)continue;
  buildings.push([i*90,j*90,48+Math.abs(i)%12,44+Math.abs(j)%12,5+Math.abs(i+j)%8]);
 }
 // Selected building is precisely beneath the camera/marker anchor.
 buildings.push([0,0,42,32,6]);
 return {buildings,roads,parks};
}
function Boxes({items,color}){
 const ref=useRef();
 useLayoutEffect(()=>{
  const matrix=new THREE.Matrix4();
  items.forEach(([x,y,w,h,z,base=0],i)=>{matrix.compose(new THREE.Vector3(x,y,base+z/2),new THREE.Quaternion(),new THREE.Vector3(w,h,Math.max(z,.08)));ref.current.setMatrixAt(i,matrix)});
  ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();
 },[items]);
 return <instancedMesh ref={ref} args={[null,null,items.length]}><boxGeometry/><meshLambertMaterial color={color}/></instancedMesh>;
}
export function Town({groupRef}){
 const data=useMemo(blocks,[]);
 const parking=useMemo(()=>Array.from({length:6},(_,i)=>[-16+i*6,27,2.4,4.6,.6]),[]);
 const stripes=useMemo(()=>Array.from({length:7},(_,i)=>[-19+i*6,27,.25,7,.2]),[]);
 return <group ref={groupRef} position={[0,0,1.00002]} scale={.00001}>
  <mesh position={[0,0,-.5]}><planeGeometry args={[60000,60000]}/><meshBasicMaterial color="#f1eee7"/></mesh>
  <Boxes items={data.roads} color="#fff"/>
  <Boxes items={data.parks} color="#c9d2bf"/>
  <Boxes items={data.buildings} color="#c2bcb2"/>
  <mesh position={[0,0,6.1]}><planeGeometry args={[42,32]}/><meshBasicMaterial color="#e0d5bf"/></mesh>
  <mesh position={[0,27,.1]}><planeGeometry args={[44,17]}/><meshBasicMaterial color="#ddd9d1"/></mesh>
  <Boxes items={[[0,15.5,42,1,.5,6],[0,-15.5,42,1,.5,6],[-20.5,0,1,32,.5,6],[20.5,0,1,32,.5,6]]} color="#a99c88"/>
  <Boxes items={[[10,-7,7,5,8],[-10,6,8,5,7.5]]} color="#a8aaa5"/>
  <Boxes items={stripes} color="#fff"/><Boxes items={parking} color="#969b99"/>
  <mesh position={[19,16.5,.3]}><planeGeometry args={[5,3]}/><meshBasicMaterial color="#b4501f"/></mesh>
  <mesh position={[0,-19,.15]}><planeGeometry args={[48,3]}/><meshBasicMaterial color="#fff"/></mesh>
 </group>;
}
