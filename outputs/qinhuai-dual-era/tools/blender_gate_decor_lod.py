import bpy, json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=root/'assets/qinhuai-modern-import/decor'
out.mkdir(exist_ok=True)
report=[]
for key,src,budget in [('woman',Path('E:/soft/inspiration/灯会/model/女灯.glb'),30000),('fish',root/'game/assets/fish.glb',16000)]:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=str(src))
 objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
 before=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
 for o in objects:
  bpy.context.view_layer.objects.active=o
  mod=o.modifiers.new('Map silhouette LOD','DECIMATE');mod.ratio=min(1,budget/before);mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
  assert o.data.uv_layers,'Painted UVs must survive'
 for image in bpy.data.images:
  w,h=image.size
  if max(w,h)>1024:
   r=1024/max(w,h);image.scale(round(w*r),round(h*r));image.pack()
 after=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
 dst=out/f'{key}-low.glb'
 bpy.ops.export_scene.gltf(filepath=str(dst),export_format='GLB',export_yup=True,export_animations=False)
 report.append({'id':key,'source':str(src),'beforeTriangles':before,'afterTriangles':after,'bytes':dst.stat().st_size})
 print('MAP_DECOR_LOD',key,before,after,flush=True)
(out/'lod-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
