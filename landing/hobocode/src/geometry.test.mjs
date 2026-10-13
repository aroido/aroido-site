import test from 'node:test';
import assert from 'node:assert/strict';
import {connector,applyMatrix,cameraDistance,markerScale,zoomProgress} from './geometry.mjs';
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
test('line endpoints match actual canvas and card after offset, resize, scroll and nonuniform SVG scaling',()=>{
 for(const [left,top,width,height] of [[576,0,864,1000],[0,206,390,638],[22,-300,800,390],[11,100,320,568]]){
  const canvasRect=rect(left,top,width,height),cardRect=rect(left+10,top+10,100,60);
  for(const screenMatrix of [{a:width/100,b:0,c:0,d:height/100,e:left,f:top},{a:2,b:.1,c:.2,d:3,e:left+31,f:top+62}]){
   const result=connector({projected:{x:.3,y:-.2,z:.6},canvasRect,cardRect,otherCards:[cardRect],screenMatrix,facing:true});
   assert.equal(result.visible,true);
   const actual=applyMatrix(result.end,screenMatrix),start=applyMatrix(result.start,screenMatrix);
   assert.ok(Math.hypot(actual.x-result.marker.x,actual.y-result.marker.y)<1e-9);
   assert.ok(Math.hypot(start.x-result.edge.x,start.y-result.edge.y)<1e-9);
   assert.ok(Math.abs(start.x-cardRect.right)<1e-8||Math.abs(start.y-cardRect.bottom)<1e-8);
  }
 }
});
test('backside, offscreen, overlapping and card-obscured markers have no connector',()=>{
 const base={projected:{x:.3,y:-.2,z:.6},canvasRect:rect(0,0,400,600),cardRect:rect(10,10,100,60),otherCards:[],screenMatrix:{a:4,b:0,c:0,d:6,e:0,f:0},facing:true};
 for(const change of [{facing:false},{overlapping:true},{projected:{x:1.1,y:0,z:.6}},{projected:{x:0,y:0,z:2}},{otherCards:[rect(250,350,50,50)]}])assert.equal(connector({...base,...change}).visible,false);
});
test('opening zooms in, separate return zooms out, comparison opening preserves out option',()=>{
 assert.equal(cameraDistance(0,'in','in'),4.05);assert.ok(Math.abs(cameraDistance(1,'in','in')-1.0016)<1e-10);
 assert.equal(cameraDistance(0,'return','in'),1.0016);assert.equal(cameraDistance(1,'return','in'),4.05);
 assert.equal(cameraDistance(0,'in','out'),1.0016);assert.equal(cameraDistance(1,'in','out'),4.05);
});

test('zoom holds on a building, stays monotonic, and screen-size scale shrinks with depth',()=>{
 let last=Infinity;
 for(let i=0;i<=100;i++){const z=cameraDistance(i/100,'in','in');assert.ok(z<=last);last=z;}
 assert.equal(zoomProgress(.9,'in','in'),1);assert.equal(zoomProgress(1,'in','in'),1);
 assert.ok(markerScale(.001,600,38,.13)<markerScale(1,600,38,.13));
});
