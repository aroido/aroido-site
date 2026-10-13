import test from 'node:test';import assert from 'node:assert/strict';
import {cities,clusterMarks,makeClusters,onLand} from './cluster-data.mjs';
test('city clusters are deterministic, on rendered land, small and geographically bounded',()=>{
 assert.deepEqual(makeClusters(),clusterMarks);assert.notDeepEqual(makeClusters(42),clusterMarks);
 assert.ok(clusterMarks.length>500);
 for(const m of clusterMarks){assert.ok(onLand(m.lon,m.lat));assert.ok(m.pixels>=3.5&&m.pixels<=7.5);const c=cities.find(c=>c[0]===m.city);assert.ok(Math.hypot(m.lon-c[1],m.lat-c[2])<7);}
});
test('oceans and empty interiors remain empty; cities have deliberately different densities',()=>{
 for(const p of [[0,0],[-30,30],[-140,0],[80,-20]])assert.equal(onLand(...p),false);
 for(const [lon,lat] of [[-30,30],[-140,0],[-110,65],[20,20]])assert.ok(clusterMarks.every(m=>Math.hypot(m.lon-lon,m.lat-lat)>8));
 const count=name=>clusterMarks.filter(m=>m.city===name).length;
 assert.equal(count('Winnipeg'),1);assert.ok(count('New York')>25);assert.ok(count('Chicago')>count('Denver')*3);
});
