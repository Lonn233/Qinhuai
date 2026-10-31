"""Publish source-faithful original / 5%-retained geometry, never edit source files.
Run with normal Python. Each reduction runs in a fresh Blender process.
"""
from pathlib import Path
import argparse, hashlib, json, struct, subprocess, sys, time
ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'work/lantern-quality-five'
MANIFEST = ROOT / 'work/all-lanterns-half-preview/manifest.json'
BLENDER = Path(r'E:\blender\blender.exe')
REVISION = 'lantern-five-20261022'


def publish_geometry(source, destination):
    data = source.read_bytes()
    length = struct.unpack_from('<I', data, 12)[0]
    gltf = json.loads(data[20:20+length])
    binary = data[28+length:]
    assert len(gltf['meshes']) == len(gltf['meshes'][0]['primitives']) == 1
    assert not gltf.get('skins') and not gltf.get('animations')
    p = gltf['meshes'][0]['primitives'][0]
    assert {'POSITION', 'NORMAL', 'TEXCOORD_0'} <= p['attributes'].keys()
    triangles = gltf['accessors'][p['indices']]['count'] // 3
    used = set()
    for a in gltf['accessors']:
        assert 'sparse' not in a
        if 'bufferView' in a: used.add(a['bufferView'])
    out, views, lookup = bytearray(), [], {}
    for old in sorted(used):
        view = gltf['bufferViews'][old].copy()
        start, size = view.get('byteOffset', 0), view['byteLength']
        lookup[old] = len(views)
        view.update(buffer=0, byteOffset=len(out))
        out.extend(binary[start:start+size]); out.extend(b'\0' * (-len(out) % 4))
        views.append(view)
    for a in gltf['accessors']:
        if 'bufferView' in a: a['bufferView'] = lookup[a['bufferView']]
    p.pop('material', None)
    for key in ['materials', 'images', 'textures', 'samplers', 'extensionsUsed', 'extensionsRequired']:
        gltf.pop(key, None)
    gltf['bufferViews'] = views
    gltf['buffers'] = [{'byteLength': len(out)}]
    gltf['asset']['extras'] = {'geometryOnly': True, 'revision': REVISION,
        'note': 'Original UVs; reuse production textures, material colors and emissive lighting.'}
    text = json.dumps(gltf, separators=(',', ':')).encode()
    text += b' ' * (-len(text) % 4)
    payload = (struct.pack('<III', 0x46546c67, 2, 28+len(text)+len(out))
        + struct.pack('<II', len(text), 0x4e4f534a) + text
        + struct.pack('<II', len(out), 0x004e4942) + out)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(payload)
    return {'triangles': triangles, 'bytes': len(payload), 'geometrySHA256': hashlib.sha256(payload).hexdigest()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--kind')
    parser.add_argument('--blender', default=str(BLENDER))
    args = parser.parse_args()
    WORK.mkdir(exist_ok=True)
    final = ROOT / 'assets/lantern-quality'
    final.mkdir(exist_ok=True)
    path = final / 'manifest.json'
    manifest = json.loads(path.read_text(encoding='utf8')) if path.exists() else {'revision': REVISION, 'models': {}}
    sources = json.loads(MANIFEST.read_text(encoding='utf8'))
    for item in sources:
        kind = item['id']
        if args.kind and kind != args.kind: continue
        source = Path(item['source'])
        sha = hashlib.sha256(source.read_bytes()).hexdigest()
        old = manifest['models'].get(kind)
        if old and old.get('sourceSHA256') == sha and all((final/mode/(kind+'.glb')).exists() for mode in ['five','original']):
            print('CACHED', kind, flush=True); continue
        started = time.time()
        original = publish_geometry(source, final/'original'/(kind+'.glb'))
        # Reuse the already rendered and verified direct-original lion candidate.
        reduced = ROOT / 'work/lion-five-percent-preview/lion-five-percent.glb' if kind == 'lion' else WORK/(kind+'-five.glb')
        if kind != 'lion':
            with (WORK/(kind+'.log')).open('w', encoding='utf8') as log:
                result = subprocess.run([args.blender, '--background', '--threads', '4', '--python', str(ROOT/'tools/blender-lantern-five.py'), '--', str(source), str(reduced)], stdout=log, stderr=subprocess.STDOUT)
            if result.returncode: raise RuntimeError(f'Blender failed: {kind}, see {WORK/(kind+".log")}')
        five = publish_geometry(reduced, final/'five'/(kind+'.glb'))
        ratio = five['triangles']/original['triangles']
        assert .049 <= ratio <= .051, (kind, ratio)
        assert hashlib.sha256(source.read_bytes()).hexdigest() == sha, 'Source changed'
        manifest['models'][kind] = {**item, 'sourceSHA256': sha, 'original': original, 'five': five,
            'retainedRatio': ratio, 'placed': kind not in ['hanging','crane'], 'method': 'Original -> Blender Decimate COLLAPSE 0.05',
            'seconds': round(time.time()-started, 1)}
        path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf8')
        print('DONE', kind, original['triangles'], '->', five['triangles'], flush=True)
    print('All requested quality assets published; source files unchanged.', flush=True)

if __name__ == '__main__': main()
