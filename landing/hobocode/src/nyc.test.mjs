import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../../../hobocode/data/nyc.geojson',import.meta.url)));
const target=JSON.parse(fs.readFileSync(new URL('./nyc-target.json',import.meta.url)));
test('camera anchor is inside the actual selected Flatiron footprint',()=>{
 assert.deepEqual(data.target,target);
 const f=data.features.find(f=>f.properties.osm_way_id===target.id);
 assert.equal(f.properties.name,'Flatiron Building');assert.equal(Number(f.properties.height),target.height);
 const ring=f.geometry.coordinates[0];let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [xi,yi]=ring[i],[xj,yj]=ring[j];
  if((yi>target.latitude)!==(yj>target.latitude)&&target.longitude<(xj-xi)*(target.latitude-yi)/(yj-yi)+xi)inside=!inside;
 }
 assert.ok(inside);
});
test('published dataset has attribution, closed real footprints and no contact/address tags',()=>{
 assert.match(data.license,/odbl/);assert.match(data.attribution,/OpenStreetMap/);
 assert.ok(data.features.length>1000);
 for(const f of data.features){
  assert.ok(Number.isInteger(f.properties.osm_way_id));
  assert.ok(Object.keys(f.properties).every(k=>['osm_way_id','kind','name','height','building:levels','highway'].includes(k)));
  if(f.geometry.type==='Polygon')assert.deepEqual(f.geometry.coordinates[0][0],f.geometry.coordinates[0].at(-1));
 }
});
