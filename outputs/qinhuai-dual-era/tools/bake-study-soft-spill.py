"""Study-only broad under-eave irradiance. Reuses measured silhouette extraction.
Never runs the city baker or modifies any original GLB / lighting manifest.
"""
from pathlib import Path
import ast,json,hashlib
import numpy as np
from scipy.spatial import cKDTree
ROOT=Path(__file__).resolve().parents[1]
# Import ONLY pure helper definitions: executing the city baker would overwrite
# main-map resources. Its top-level filesystem operations are intentionally omitted.
source=ROOT/'tools/build_import_night_layout.py'
tree=ast.parse(source.read_text(encoding='utf8'))
names={'read_glb','local_matrix','accessor','fixture_edges'}
module=ast.Module(body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom)) or isinstance(n,ast.FunctionDef) and n.name in names],type_ignores=[])
helpers={};exec(compile(module,str(source),'exec'),helpers)

def bake(kind):
 base=ROOT/'assets/building-study'/kind
 manifest=json.loads((base/'manifest.json').read_text(encoding='utf8'))
 doc,blob,digest=helpers['read_glb'](base/manifest['file'])
 parents={c:i for i,n in enumerate(doc['nodes']) for c in n.get('children',[])}
 worlds={}
 def world(i):
  if i not in worlds:worlds[i]=(world(parents[i]) if i in parents else np.eye(4))@helpers['local_matrix'](doc['nodes'][i])
  return worlds[i]
 roofs={r['node'] for r in manifest['rules'] if r['role']=='roof'}
 all_positions=[];paths=[]
 for i,n in enumerate(doc['nodes']):
  if 'mesh' not in n:continue
  for prim in doc['meshes'][n['mesh']]['primitives']:
   vertices=helpers['accessor'](doc,blob,prim['attributes']['POSITION']);vertices=(np.c_[vertices,np.ones(len(vertices))]@world(i).T)[:,:3];all_positions.append(vertices)
   if kind=='matou' or n.get('name') not in roofs:continue
   tri=helpers['accessor'](doc,blob,prim['indices']).ravel().reshape(-1,3) if 'indices' in prim else np.arange(len(vertices)).reshape(-1,3)
   edges,_=helpers['fixture_edges'](vertices,tri,'roof',n['name']);paths.extend(edges)
 if kind=='matou':paths=np.asarray(json.loads((base/'eave-path-audit.json').read_text())['accepted'])
 if not len(paths):raise RuntimeError('No eaves: '+kind)
 # Shift continuous emitters beneath the eave, never onto roof ridges.
 samples=np.concatenate([np.linspace(p,q,max(2,int(np.linalg.norm(q-p)/.045)+1)) for p,q in paths]);samples[:,1]-=.12
 positions=np.concatenate(all_positions);lo=positions.min(0)-[.75,.8,.75];hi=positions.max(0)+[.75,.3,.75]
 size=np.maximum(2,np.ceil((hi-lo)/.14).astype(int));step=(hi-lo)/size
 # Highest precision axis can stay modest: this is low-frequency diffuse spill.
 grid=np.meshgrid(lo[0]+(np.arange(size[0])+.5)*step[0],lo[1]+(np.arange(size[1])+.5)*step[1],indexing='xy')
 field=np.empty((size[2],size[1],size[0],4),dtype="<f2");lookup=cKDTree(samples)
 for z in range(size[2]):
  queries=np.c_[grid[0].ravel(),grid[1].ravel(),np.full(grid[0].size,lo[2]+(z+.5)*step[2])]
  # Evaluate several nearest points in anisotropic distance; a point overhead
  # should not lose its wall wash to another roof level nearby.
  _,ids=lookup.query(queries,k=min(8,len(samples)),workers=2);delta=queries[:,None,:]-samples[ids]
  horizontal=np.linalg.norm(delta[:,:,[0,2]],axis=2);vertical=delta[:,:,1]
  # Store nearest recessed emitter offset, not fixed brightness. The GPU can
  # change anisotropic spread live without rebuilding geometry or textures.
  score=(horizontal/.8)**2+(vertical/np.where(vertical>0,.17,1.2))**2
  chosen=delta[np.arange(len(queries)),np.argmin(score,axis=1)]
  field[z,:,:,:3]=chosen.reshape(size[1],size[0],3)
  field[z,:,:,3]=1
 file='soft-spill-offset-rgba16f-v2.bin';(base/file).write_bytes(field.tobytes())
 info={'version':2,'encoding':'offset-rgba16f','file':file,'size':size.tolist(),'min':lo.tolist(),'max':hi.tolist(),'modelMin':positions.min(0).tolist(),'modelMax':positions.max(0).tolist(),'bytes':field.nbytes,'sourceSha256':digest,'eaveSegments':len(paths),'placement':'Continuous recessed eaves only; no ridge sources','method':'Baked nearest emitter offsets; live directional diffuse approximation, not realtime GI','sigma':{'horizontal':.58,'up':.13,'down':.72},'recess':.12}
 (base/'soft-spill-v2.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({'building':kind,'bytes':field.nbytes,'size':size.tolist(),'segments':len(paths)}),flush=True)

if __name__=='__main__':
 for kind in ['temple','pavilion','matou']:bake(kind)
