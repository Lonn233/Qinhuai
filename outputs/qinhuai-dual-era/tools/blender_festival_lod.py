"""Create map-only LOD assets; never modify study/source models."""
import bpy, json, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/qinhuai-modern-import/festival';OUT.mkdir(exist_ok=True)
specs=[('mountain',ROOT/'game/assets/mountain.glb',26000),('lion',ROOT/'game/assets/lion.glb',9000),('lotus-main',ROOT/'game/assets/lotus-main.glb',4500),('lotus-one',ROOT/'game/assets/lotus-one.glb',4500),('chrysanthemum',Path('E:/soft/inspiration/灯会/model/菊水灯.glb'),6500)]
report=[]
for key,src,budget in specs:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=str(src));objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
 before=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
 for o in objects:
  bpy.context.view_layer.objects.active=o
  mod=o.modifiers.new('Map silhouette LOD','DECIMATE');mod.ratio=min(1,budget/before);mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
  assert o.data.uv_layers,'Painted UVs must survive'
 # Map copies use <=1024px embedded texture; keep painted artwork, not just tint.
 for image in bpy.data.images:
  w,h=image.size
  if max(w,h)>1024:
   r=1024/max(w,h);image.scale(round(w*r),round(h*r));image.pack()
 after=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
 dst=OUT/f'{key}-low.glb'
 bpy.ops.export_scene.gltf(filepath=str(dst),export_format='GLB',export_yup=True,export_animations=False)
 report.append({'id':key,'source':str(src),'sourceHash':hashlib.sha256(src.read_bytes()).hexdigest(),'beforeTriangles':before,'afterTriangles':after,'bytes':dst.stat().st_size,'textureMax':1024})
 print('MAP_LOD',key,before,after,flush=True)
(OUT/'lod-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
