"""Standalone native OpenGL asset preview, NOT a browser or game benchmark.
Lower-memory fallback after Blender source rendering exhausted available memory.
Same cameras/material preview for source + candidates; visual acceptance still
requires actual in-game daylight/night/reflection screenshots.
"""
import sys,json,struct,io,time,argparse
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent/'pydeps'))
import moderngl as gl
import numpy as np
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--asset',default='source');a=p.parse_args();root=Path(a.root);out=root/'assets/kuixing-pilot';label=a.asset
file=root/'Meshy_AI_kuixingge_1016044736_texture.glb' if label=='source' else out/'export'/('kuixing_'+label+'.glb')
raw=file.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+jl]);binary=memoryview(raw)[28+jl:];prim=j['meshes'][0]['primitives'][0]
def data(i):
 ac=j['accessors'][i];v=j['bufferViews'][ac['bufferView']];start=v.get('byteOffset',0)+ac.get('byteOffset',0);n=ac['count']*{'SCALAR':1,'VEC2':2,'VEC3':3}[ac['type']]*4;return binary[start:start+n]
ctx=gl.create_standalone_context(require=330);print(json.dumps({'renderer':ctx.info['GL_RENDERER'],'asset':label}),flush=True)
program=ctx.program(vertex_shader='''#version 330
in vec3 position;in vec3 normal;in vec2 uv;uniform mat4 mvp;out vec3 P;out vec3 N;out vec2 U;
void main(){P=position;N=normal;U=uv;gl_Position=mvp*vec4(position,1.0);}
''',fragment_shader='''#version 330
in vec3 P;in vec3 N;in vec2 U;uniform sampler2D colorMap;uniform sampler2D normalMap;uniform vec3 eye;out vec4 color;
void main(){
 vec3 n=normalize(N)*(gl_FrontFacing?1.0:-1.0);vec3 dp1=dFdx(P),dp2=dFdy(P);vec2 du1=dFdx(U),du2=dFdy(U);
 vec3 dp2p=cross(dp2,n),dp1p=cross(n,dp1);vec3 t=dp2p*du1.x+dp1p*du2.x,b=dp2p*du1.y+dp1p*du2.y;
 float scale=inversesqrt(max(max(dot(t,t),dot(b,b)),1e-16));vec3 nm=texture(normalMap,U).xyz*2.0-1.0;
 n=normalize(mat3(t*scale,b*scale,n)*nm);vec3 c=pow(texture(colorMap,U).rgb,vec3(2.2));
 vec3 light=vec3(.35)+vec3(.78,.73,.65)*max(dot(n,normalize(vec3(3,5,4))),0.0)+vec3(.28,.34,.43)*max(dot(n,normalize(vec3(-4,3,1))),0.0)+vec3(.15)*max(dot(n,normalize(vec3(1,4,-4))),0.0);
 color=vec4(pow(clamp(c*light,0.,1.),vec3(1./2.2)),1.0);
}
''')
# Three separate attribute buffers avoid a large expanded/interleaved mesh copy.
bufs=[ctx.buffer(data(prim['attributes'][n])) for n in ['POSITION','NORMAL','TEXCOORD_0']];ibo=ctx.buffer(data(prim['indices']));vao=ctx.vertex_array(program,[(bufs[0],'3f','position'),(bufs[1],'3f','normal'),(bufs[2],'2f','uv')],ibo,index_element_size=4)
mat=j['materials'][prim.get('material',0)];textures=[]
for unit,(uniform,texidx) in enumerate([('colorMap',mat['pbrMetallicRoughness']['baseColorTexture']['index']),('normalMap',mat['normalTexture']['index'])]):
 im=j['images'][j['textures'][texidx]['source']];v=j['bufferViews'][im['bufferView']];b=binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];image=Image.open(io.BytesIO(b)).convert('RGB');tex=ctx.texture(image.size,3,image.tobytes());tex.build_mipmaps();tex.filter=(gl.LINEAR_MIPMAP_LINEAR,gl.LINEAR);tex.use(unit);program[uniform].value=unit;textures.append(tex)
ref=json.loads((out/'reports/LOD0.json').read_text());lo=np.array(ref['source_bounds']['min']);hi=np.array(ref['source_bounds']['max']);center=(lo+hi)*.5;height=max(hi-lo);size=640
fbo=ctx.simple_framebuffer((size,size),components=4,samples=4);resolved=ctx.simple_framebuffer((size,size),components=4);ctx.enable(gl.DEPTH_TEST);ctx.disable(gl.CULL_FACE)
def norm(x):return x/np.linalg.norm(x)
def matrix(eye,up):
 f=norm(center-eye);s=norm(np.cross(f,up));u=np.cross(s,f);v=np.eye(4);v[0,:3]=s;v[1,:3]=u;v[2,:3]=-f;v[:3,3]=-v[:3,:3]@eye
 half=height*1.22/2;near=.001;far=height*20;o=np.diag([1/half,1/half,-2/(far-near),1]);o[2,3]=-(far+near)/(far-near);return o@v
folder=out/'renders'/('native-'+label);folder.mkdir(exist_ok=True);poses=[]
for name,direction in {'front':(0,.08,3),'left':(-3,.08,0),'right':(3,.08,0),'top':(0,3,.001),'game_iso':(1.75,1.8,1.35)}.items():
 eye=center+np.array(direction)*height;program['mvp'].write(np.asarray(matrix(eye,np.array([0,1,0])),dtype='f4').T.tobytes());fbo.use();fbo.clear(0,0,0,0,depth=1);t=time.perf_counter();vao.render();ctx.copy_framebuffer(resolved,fbo);im=Image.frombytes('RGBA',(size,size),resolved.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM);im.save(folder/(name+'.png'));poses.append({'view':name,'eye':eye.tolist(),'source_center':center.tolist(),'ortho_scale':height*1.22});print('SAVED '+label+' '+name,flush=True)
report={'asset':label,'renderer':ctx.info['GL_RENDERER'],'resolution':size,'poses':poses,'scope':'Standalone native OpenGL fixed asset preview. Simplified diffuse+normal material, no game lighting, shadows, ACES, water, weather or Bloom. NOT a browser benchmark or visual signoff.'};(out/'reports'/('native-'+label+'-renders.json')).write_text(json.dumps(report,indent=2),encoding='utf8')
vao.release();ibo.release();[b.release() for b in bufs];[t.release() for t in textures];fbo.release();resolved.release();program.release();ctx.release()
