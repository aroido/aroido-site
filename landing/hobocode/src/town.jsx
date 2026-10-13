import React,{useMemo,useRef} from 'react';
import {useTexture} from '@react-three/drei';
import {useFrame,useLoader} from '@react-three/fiber';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import target from './nyc-target.json';
import {zoomProgress,ease} from './geometry.mjs';
// Real OSM coordinates. Rendering widths are stylistic; absent heights remain flat.
export function Town({groupRef,state,opening}){
 const marks=useRef([]),texture=useTexture('/hobocode/media/chalk-mark.png');
 const raw=useLoader(THREE.FileLoader,'/hobocode/data/nyc.geojson');
 const places=useMemo(()=>JSON.parse(raw).features.filter(f=>f.properties.kind==='building'&&f.properties.osm_way_id!==target.id).filter((_,i)=>i%18===0).slice(0,70).map(f=>{const r=f.geometry.coordinates[0],lon=r.reduce((n,p)=>n+p[0],0)/r.length,lat=r.reduce((n,p)=>n+p[1],0)/r.length;return [(lon-target.longitude)*111320*Math.cos(target.latitude*Math.PI/180),(lat-target.latitude)*111320,(Number.parseFloat(f.properties.height)||0)+3]}),[raw]);
 useFrame(({camera,size})=>{const q=zoomProgress(state.progress,state.mode,opening),accepted=[];state.cityMarks=[];marks.current.forEach(m=>{if(!m)return;const world=m.getWorldPosition(new THREE.Vector3()),p=world.clone().project(camera),x=(p.x+1)*size.width/2,y=(1-p.y)*size.height/2;const visible=q>.32&&q<.88&&Math.abs(p.x)<.98&&Math.abs(p.y)<.98&&p.z<1&&accepted.every(a=>Math.hypot(a[0]-x,a[1]-y)>15);m.visible=visible;if(visible){accepted.push([x,y]);const depth=-world.applyMatrix4(camera.matrixWorldInverse).z;m.scale.setScalar(2*depth*Math.tan(camera.fov*Math.PI/360)/size.height*8/.00001);m.updateWorldMatrix(true,false);const actual=m.getWorldScale(new THREE.Vector3()).x/(2*depth*Math.tan(camera.fov*Math.PI/360)/size.height);state.cityMarks.push({pixels:actual,x,y});m.material.opacity=ease((q-.32)/.08)*(1-ease((q-.7)/.18));}})});
 const meshes=useMemo(()=>{
  const data=JSON.parse(raw),parts={roads:[],buildings:[],selected:[]};
  const project=([lon,lat])=>new THREE.Vector2((lon-target.longitude)*111320*Math.cos(target.latitude*Math.PI/180),(lat-target.latitude)*111320);
  for(const f of data.features){
   const p=f.properties;
   if(p.kind==='building'){
    const points=f.geometry.coordinates[0].map(project),shape=new THREE.Shape(points);
    const known=Number.parseFloat(p.height),height=Number.isFinite(known)&&known>0?known:.3;
    const g=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,steps:1});
    parts[p.osm_way_id===target.id?'selected':'buildings'].push(g.index?g.toNonIndexed():g);
   }else{
    const points=f.geometry.coordinates.map(project),width=p.highway==='primary'?13:8;
    for(let i=1;i<points.length;i++){
     const a=points[i-1],b=points[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);if(!len)continue;
     const g=new THREE.PlaneGeometry(width,len);g.rotateZ(-Math.atan2(dx,dy));g.translate((a.x+b.x)/2,(a.y+b.y)/2,.1);parts.roads.push(g.index?g.toNonIndexed():g);
    }
   }
  }
  return Object.fromEntries(Object.entries(parts).map(([k,gs])=>{const merged=mergeGeometries(gs,false);gs.forEach(g=>g.dispose());return [k,merged]}));
 },[raw]);
 return <group ref={groupRef} position={[0,0,1.00002]} scale={.00001}>
  <mesh position={[0,0,-.5]}><planeGeometry args={[60000,60000]}/><meshBasicMaterial color="#eeeae2"/></mesh>
  {places.map((p,i)=><sprite key={i} position={p} ref={m=>marks.current[i]=m}><spriteMaterial map={texture} color="#333333" transparent depthWrite={false}/></sprite>)}
  <mesh geometry={meshes.roads}><meshBasicMaterial color="#fff"/></mesh>
  <mesh geometry={meshes.buildings}><meshLambertMaterial color="#c4bfb5"/></mesh>
  <mesh geometry={meshes.selected}><meshLambertMaterial color="#bda889"/></mesh>
 </group>;
}
