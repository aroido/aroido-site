import json,math,pathlib
import sys
root=pathlib.Path(__file__).resolve().parents[2]
src=json.load(open(sys.argv[1]))
target=next(e for e in src['elements'] if e['id']==264768896)
ring=[[p['lon'],p['lat']] for p in target['geometry']]
ox,oy=ring[0];v=[(x-ox,y-oy) for x,y in ring]
a=sum(x*q-y*p for (x,y),(p,q) in zip(v,v[1:]))
lon=ox+sum((x+p)*(x*q-y*p) for (x,y),(p,q) in zip(v,v[1:]))/(3*a)
lat=oy+sum((y+q)*(x*q-y*p) for (x,y),(p,q) in zip(v,v[1:]))/(3*a)
features=[]
for e in src['elements']:
 t=e.get('tags',{});coords=[[p['lon'],p['lat']] for p in e.get('geometry',[])];building='building' in t
 if len(coords)<2:continue
 if not building and t.get('highway') not in ['residential','primary','secondary','tertiary','trunk','unclassified','pedestrian','living_street']:continue
 if building and (coords[0]!=coords[-1] or min(math.hypot((x-lon)*84350,(y-lat)*111320) for x,y in coords)>700):continue
 props={'osm_way_id':e['id'],'kind':'building' if building else 'road'}
 for key in ['name','height','building:levels','highway']:
  if key in t:props[key]=t[key]
 features.append({'type':'Feature','properties':props,'geometry':{'type':'Polygon' if building else 'LineString','coordinates':[coords] if building else coords}})
data={'type':'FeatureCollection','attribution':'© OpenStreetMap contributors','license':'https://opendatacommons.org/licenses/odbl/1-0/','source':'https://www.openstreetmap.org/copyright','timestamp':src['osm3s']['timestamp_osm_base'],'target':{'id':264768896,'longitude':lon,'latitude':lat,'height':86},'features':features}
p=root/'hobocode/data';p.mkdir(exist_ok=True);(p/'nyc.geojson').write_text(json.dumps(data,separators=(',',':')))
(root/'landing/hobocode/src/nyc-target.json').write_text(json.dumps(data['target']))
print(len(features),len(json.dumps(data)),data['target'])
