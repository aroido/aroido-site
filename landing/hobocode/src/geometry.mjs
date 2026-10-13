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
export function cameraDistance(progress,mode,opening){
 const p=ease(progress);
 if(mode==='return'||opening==='out')return 1.42+(4.05-1.42)*p;
 return 4.05-(4.05-1.42)*p;
}
