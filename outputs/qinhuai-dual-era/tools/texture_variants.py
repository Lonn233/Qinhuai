from pathlib import Path
import json,struct,io,hashlib
import numpy as np
from PIL import Image
r=Path(__file__).resolve().parents[1];out=r/'assets/kuixing-pilot'
def read(file):
 raw=file.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+jl]);b=memoryview(raw)[28+jl:];return j,[bytes(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]) for v in j['bufferViews']]
def save(file,j,views):
 data=bytearray()
 for v,b in zip(j['bufferViews'],views):
  v['byteOffset']=len(data);v['byteLength']=len(b);data.extend(b);data.extend(b'\0'*((-len(data))%4))
 j['buffers']=[{'byteLength':len(data)}];s=json.dumps(j,separators=(',',':')).encode();s+=b' '*((-len(s))%4)
 file.write_bytes(struct.pack('<III',0x46546c67,2,28+len(s)+len(data))+struct.pack('<II',len(s),0x4e4f534a)+s+struct.pack('<II',len(data),0x004e4942)+data)
def resize_array(array,size):
 return np.stack([np.asarray(Image.fromarray(array[:,:,c].astype('f4')).resize((size,size),Image.Resampling.LANCZOS)) for c in range(array.shape[2])],axis=2)
reports=[]
for level,size in [('LOD1',1024),('LOD2',512)]:
 j,views=read(out/'export'/('kuixing_'+level+'.glb'));material=j['materials'][0];roles={material['pbrMetallicRoughness']['baseColorTexture']['index']:'sRGB_color',material['pbrMetallicRoughness']['metallicRoughnessTexture']['index']:'linear_metallic_roughness',material['normalTexture']['index']:'linear_normal'};items=[]
 for texture_index,role in roles.items():
  image=j['images'][j['textures'][texture_index]['source']];v=image['bufferView'];source=views[v];im=Image.open(io.BytesIO(source)).convert('RGB');arr=np.asarray(im,dtype=np.float32)/255
  if role=='sRGB_color':
   linear=np.where(arr<=.04045,arr/12.92,((arr+.055)/1.055)**2.4);small=np.clip(resize_array(linear,size),0,1);small=np.where(small<=.0031308,small*12.92,1.055*small**(1/2.4)-.055)
  elif role=='linear_normal':
   small=resize_array(arr*2-1,size);small=small/np.maximum(np.linalg.norm(small,axis=2,keepdims=True),1e-8);small=small*.5+.5
  else:small=resize_array(arr,size)
  img=Image.fromarray(np.uint8(np.clip(small,0,1)*255+.5));buffer=io.BytesIO();img.save(buffer,format='PNG',optimize=True);views[v]=buffer.getvalue();image['mimeType']='image/png';items.append({'role':role,'before_size':im.size,'after_size':[size,size],'before_bytes':len(source),'after_bytes':len(views[v]),'lossless_after_resize':True})
 file=out/'export'/('kuixing_'+level+'_tex'+str(size)+'.glb');save(file,j,views)
 report={'level':level,'output':str(file),'bytes':file.stat().st_size,'images':items,'approved':False,'new_normal_bake':False,'texture_memory_note':'RGBA8 + full mip-chain arithmetic only; not measured browser VRAM. PNG reduces no GPU memory by itself, resizing does.','estimated_RGBA8_with_mips_before_bytes':3*4*sum(4**i for i in range(12)),'estimated_RGBA8_with_mips_after_bytes':3*4*sum(4**i for i in range(int(np.log2(size))+1))};reports.append(report)
(out/'reports/texture-variants.json').write_text(json.dumps(reports,indent=2),encoding='utf8');print(json.dumps(reports,indent=2))
