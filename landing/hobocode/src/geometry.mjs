export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
export function ndcToClient(point,rect){return {x:rect.left+(point.x+1)*rect.width/2,y:rect.top+(1-point.y)*rect.height/2};}
export function contains(rect,point,padding=0){return point.x>=rect.left-padding&&point.x<=rect.right+padding&&point.y>=rect.top-padding&&point.y<=rect.bottom+padding;}
export function insideClip(point){return point.z>=-1&&point.z<=1&&Math.abs(point.x)<.98&&Math.abs(point.y)<.98;}
// Intersection of the card-to-marker ray with the card border, not its centre.
export function cardEdge(rect,point){
 const center={x:(rect.left+rect.right)/2,y:(rect.top+rect.bottom)/2};
 const dx=point.x-center.x,dy=point.y-center.y;
 const t=Math.min(dx===0?Infinity:rect.width/2/Math.abs(dx),dy===0?Infinity:rect.height/2/Math.abs(dy));
 return Number.isFinite(t)?{x:center.x+dx*t,y:center.y+dy*t}:center;
}
export function applyMatrix(point,matrix){return {x:matrix.a*point.x+matrix.c*point.y+matrix.e,y:matrix.b*point.x+matrix.d*point.y+matrix.f};}
export function inverseMatrix(m){const det=m.a*m.d-m.b*m.c;if(!det)return null;return {a:m.d/det,b:-m.b/det,c:-m.c/det,d:m.a/det,e:(m.c*m.f-m.d*m.e)/det,f:(m.b*m.e-m.a*m.f)/det};}
export function connector({projected,canvasRect,cardRect,otherCards,screenMatrix,facing,overlapping=false}){
 const marker=ndcToClient(projected,canvasRect),inverse=screenMatrix&&inverseMatrix(screenMatrix);
 if(!inverse||!facing||overlapping||!insideClip(projected)||otherCards.some(rect=>contains(rect,marker,5)))return {visible:false,marker};
 const edge=cardEdge(cardRect,marker);
 if(!contains(canvasRect,edge))return {visible:false,marker};
 return {visible:true,marker,edge,start:applyMatrix(edge,inverse),end:applyMatrix(marker,inverse)};
}
export function zoomProgress(progress,mode,opening){
 const p=clamp(progress/.9);
 return mode==='return'||opening==='out'?1-p:p;
}
export function cameraDistance(progress,mode,opening){
 const q=zoomProgress(progress,mode,opening);
 return 1+3.05*Math.exp(-Math.log(3.05/.0016)*q);
}
export function markerScale(depth,viewportHeight,fov,size,pixels=28){
 return Math.min(1,2*Math.max(depth,.00001)*Math.tan(fov*Math.PI/360)/viewportHeight*pixels/size);
}
