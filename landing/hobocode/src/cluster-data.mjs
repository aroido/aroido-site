import {feature} from 'topojson-client';
import world from 'world-atlas/land-110m.json' with {type:'json'};
const polygons=feature(world,world.objects.land).features[0].geometry.coordinates;
function inRing(lon,lat,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [x,y]=ring[i],[a,b]=ring[j];if((y>lat)!==(b>lat)&&lon<(a-x)*(lat-y)/(b-y)+x)inside=!inside;}return inside;}
export function onLand(lon,lat){return polygons.some(p=>inRing(lon,lat,p[0])&&!p.slice(1).some(r=>inRing(lon,lat,r)));}
// Named real city anchors; counts, radii and sizes are illustrative art direction,
// never a distribution of users. No uniform sphere/grid sampling is used.
export const cities=[
 ['New York',-73.99,40.74,32,3.2,1.1],['Boston',-71.06,42.36,13,1.8,.8],['Washington',-77.04,38.91,19,2.1,1.2],
 ['Chicago',-87.63,41.88,28,2.6,1.8],['Atlanta',-84.39,33.75,16,2.1,1.5],['Dallas',-96.80,32.78,23,2.8,1.7],
 ['Denver',-104.99,39.74,7,1.6,1.1],['Los Angeles',-118.24,34.05,29,3,1.6],['San Francisco',-122.42,37.77,15,1.6,1.3],
 ['Seattle',-122.33,47.61,12,1.7,1.4],['Toronto',-79.38,43.65,17,2.3,1.1],['Montreal',-73.57,45.50,9,1.9,1],
 ['Mexico City',-99.13,19.43,25,2,1.7],['Bogota',-74.07,4.71,9,1.4,2],['Lima',-77.04,-12.05,7,1.6,2.2],
 ['Sao Paulo',-46.63,-23.55,31,3,1.7],['Buenos Aires',-58.38,-34.60,14,2.1,1.7],['Santiago',-70.67,-33.45,6,.9,2.1],
 ['London',-.13,51.51,19,1.6,.8],['Paris',2.35,48.86,26,2.3,1.5],['Berlin',13.41,52.52,18,2.2,1.3],
 ['Madrid',-3.70,40.42,9,1.7,1.2],['Rome',12.50,41.90,8,1.6,1.6],['Istanbul',28.98,41.01,11,2,1.4],
 ['Cairo',31.24,30.04,12,2,1.3],['Nairobi',36.82,-1.29,6,1.5,1.7],['Johannesburg',28.05,-26.20,10,2.4,1.4],
 ['Delhi',77.21,28.61,26,2.4,1.8],['Mumbai',72.88,19.08,16,1.7,2],['Bangkok',100.50,13.76,14,1.8,1.4],
 ['Beijing',116.41,39.90,23,2.8,1.5],['Seoul',126.98,37.57,17,1.4,1],['Tokyo',139.69,35.69,21,1.6,1],
 ['Sydney',151.21,-33.87,12,1.7,1.8],['Melbourne',144.96,-37.81,8,2,1.2],
 // Occasional isolated places leave large regions deliberately empty.
 ['Calgary',-114.07,51.05,2,.3,.3],['Winnipeg',-97.14,49.90,1,.2,.2],['Salt Lake City',-111.89,40.76,2,.5,.3],
 ['Manaus',-60.02,-3.12,2,.4,.3],['Perth',115.86,-31.95,2,.5,.4]
];
export function makeClusters(seed=0x484f424f){
 const random=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
 const marks=[];
 for(const [city,lon,lat,count,rx,ry] of cities){
  const rotation=random()*Math.PI,skew=random()*.7-.35;
  for(let n=0,attempts=0;n<count&&attempts<count*40;attempts++){
   const angle=random()*Math.PI*2,r=Math.pow(random(),.7),lobe=random()<.7?0:.65;
   const x=(Math.cos(angle)*r+lobe)*rx,y=(Math.sin(angle)*r+skew)*ry;
   const lng=lon+x*Math.cos(rotation)-y*Math.sin(rotation),lt=lat+x*Math.sin(rotation)+y*Math.cos(rotation);
   if(!onLand(lng,lt))continue;
   if(marks.some(m=>Math.hypot((m.lon-lng)*Math.cos(lt*Math.PI/180),m.lat-lt)<.12))continue;
   marks.push({lon:lng,lat:lt,pixels:3.5+random()*4,city});n++;
  }
 }
 return marks;
}
export const clusterMarks=makeClusters();
