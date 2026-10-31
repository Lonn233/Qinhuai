"""Publish geometry-only near assets: half-face previews plus approved overrides.
No further decimation, texture rebaking, axis rotation or source mutation.
Run from any directory: python tools/prepare-near-lantern-half.py
"""
from pathlib import Path
import argparse
import hashlib
import json
import struct

ROOT = Path(__file__).resolve().parents[1]
PREVIEW = ROOT / 'work/all-lanterns-half-preview'
DEST = ROOT / 'assets/lantern-near-half'
# These two previews have no matching authored bodies in this map. Never replace
# another lantern type or add new placements just to use a preview model.
UNPLACED = {'hanging', 'crane'}
# User-approved near-detail override; keep all other lanterns at half source.
APPROVED_OVERRIDES = {
    'woman': {
        'path': ROOT / 'work/woman-decimation-study/woman-250k.glb',
        'triangles': 250000,
        'selection': 'User selected the 250,000-triangle comparison, 2026-10-22',
    }
}


def publish(only_kind=None):
    DEST.mkdir(exist_ok=True)
    manifest_path = DEST / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf8')) if only_kind and manifest_path.exists() else {}
    published = 0
    for report in json.loads((PREVIEW / 'report.json').read_text(encoding='utf8')):
        kind = report['id']
        if kind in UNPLACED or (only_kind and kind != only_kind):
            continue
        override = APPROVED_OVERRIDES.get(kind)
        source = override['path'] if override else PREVIEW / kind / f'{kind}-half.glb'
        triangles = override['triangles'] if override else report['afterTriangles']
        data = source.read_bytes()
        size = struct.unpack_from('<I', data, 12)[0]
        gltf = json.loads(data[20:20+size])
        binary = data[28+size:]
        assert len(gltf['meshes']) == len(gltf['meshes'][0]['primitives']) == 1
        assert not gltf.get('skins') and not gltf.get('animations')
        primitive = gltf['meshes'][0]['primitives'][0]
        assert gltf['accessors'][primitive['indices']]['count'] == triangles * 3
        assert {'POSITION', 'NORMAL', 'TEXCOORD_0'} <= primitive['attributes'].keys()
        views = set()
        for accessor in gltf['accessors']:
            assert 'sparse' not in accessor
            if 'bufferView' in accessor:
                views.add(accessor['bufferView'])
        output_binary, output_views, lookup = bytearray(), [], {}
        for old in sorted(views):
            view = gltf['bufferViews'][old].copy()
            start, length = view.get('byteOffset', 0), view['byteLength']
            lookup[old] = len(output_views)
            view.update(byteOffset=len(output_binary), buffer=0)
            output_binary.extend(binary[start:start+length])
            output_binary.extend(b'\0' * (-len(output_binary) % 4))
            output_views.append(view)
        for accessor in gltf['accessors']:
            if 'bufferView' in accessor:
                accessor['bufferView'] = lookup[accessor['bufferView']]
        primitive.pop('material', None)
        for key in ['materials', 'images', 'textures', 'samplers', 'extensionsUsed', 'extensionsRequired']:
            gltf.pop(key, None)
        gltf['bufferViews'] = output_views
        gltf['buffers'] = [{'byteLength': len(output_binary)}]
        gltf['asset']['extras'] = {'source': source.name, 'geometryOnly': True,
            'note': 'Reuse the main scene fabric materials, maps and lighting controls.'}
        text = json.dumps(gltf, separators=(',', ':')).encode()
        text += b' ' * (-len(text) % 4)
        output = (struct.pack('<III', 0x46546c67, 2, 28+len(text)+len(output_binary))
            + struct.pack('<II', len(text), 0x4e4f534a) + text
            + struct.pack('<II', len(output_binary), 0x004e4942) + output_binary)
        (DEST / f'{kind}.glb').write_bytes(output)
        manifest[kind] = {'triangles': triangles,
            'originalTriangles': report['beforeTriangles'],
            'previewSHA256': hashlib.sha256(data).hexdigest(),
            'geometrySHA256': hashlib.sha256(output).hexdigest(), 'bytes': len(output)}
        if override:
            manifest[kind].update(source=str(source.relative_to(ROOT)).replace('\\', '/'), selection=override['selection'], retainedRatio=triangles/report['beforeTriangles'])
        published += 1
    (DEST / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf8')
    print(f'Published {published} near-detail geometry assets; source previews unchanged.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--kind', help='Publish only this kind, preserving other manifest entries')
    publish(parser.parse_args().kind)
