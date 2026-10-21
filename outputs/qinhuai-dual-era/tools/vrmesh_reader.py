"""Read the original static V-Ray proxy channels. No original assets are modified.
Supports package vray / vrmesh headers and zlib-compressed channel blocks.
Validates table offsets, decompressed sizes and triangle indices before conversion.
"""
import struct,zlib
import numpy as np
from pathlib import Path

def read_proxy(path):
 b=Path(path).read_bytes()
 if b.startswith(b'vrmesh\0'):ptr=11
 elif b.startswith(b'vray'):ptr=4
 else:raise ValueError('Unsupported proxy header')
 table=struct.unpack_from('<Q',b,ptr)[0]
 assert ptr+8<=table<len(b)-4
 n=struct.unpack_from('<I',b,table)[0]
 assert 0<n<10000 and table+4+n*36<=len(b)
 chunks=[]
 for i in range(n):
  row=struct.unpack_from('<Q6fI',b,table+4+i*36)
  if row[-1]!=1:continue # Render geometry only; do not duplicate the viewport preview.
  pos=row[0];nc=struct.unpack_from('<I',b,pos)[0];pos+=4
  assert 0<nc<256
  headers=[struct.unpack_from('<IIHHI',b,pos+k*16) for k in range(nc)];pos+=nc*16
  channels={}
  for stride,count,cid,dep,flags in headers:
   size=stride*count
   if flags&16:
    length=struct.unpack_from('<I',b,pos)[0];pos+=4
    data=zlib.decompress(b[pos:pos+length]);pos+=length
   else:data=b[pos:pos+size];pos+=size
   assert len(data)==size,(path,cid,len(data),size)
   channels[cid]=(stride,count,data)
  v=np.frombuffer(channels[0][2],'<f4').reshape(-1,3)
  f=np.frombuffer(channels[1][2],'<u4').reshape(-1,3)
  assert np.isfinite(v).all() and f.max()<len(v)
  ids=np.frombuffer(channels[6][2],'<u4').reshape(-1,3)[:,2] if 6 in channels else np.zeros(len(f),dtype=np.uint32)
  uv=None
  if 1001 in channels and 2001 in channels:
   uvv=np.frombuffer(channels[1001][2],'<f4').reshape(-1,3)
   uvf=np.frombuffer(channels[2001][2],'<u4').reshape(-1,3)
   assert uvf.max()<len(uvv)
   uv=uvv[uvf,:2].copy()
  chunks.append((v.copy(),f.copy(),ids.copy(),uv))
 return chunks
