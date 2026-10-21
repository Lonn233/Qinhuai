"""Repair only the dragon-wall materials in an already converted Qinhuai tile.
Keeps all existing binary buffers (geometry, UVs, normals, images) byte-for-byte.
Run after re-conversion; no changes to the source FBX or any other tile.
"""
import argparse, copy, hashlib, io, json, struct
from pathlib import Path
from PIL import Image


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_glb(path):
    raw = path.read_bytes()
    magic, version, length = struct.unpack_from('<III', raw)
    assert magic == 0x46546c67 and version == 2 and length == len(raw)
    size, kind = struct.unpack_from('<II', raw, 12)
    assert kind == 0x4e4f534a
    doc = json.loads(raw[20:20 + size])
    offset = 20 + size
    size, kind = struct.unpack_from('<II', raw, offset)
    assert kind == 0x004e4942
    return doc, raw[offset + 8:offset + 8 + size], raw


def write_glb(path, doc, binary):
    js = json.dumps(doc, ensure_ascii=False, separators=(',', ':')).encode('utf8')
    js += b' ' * (-len(js) % 4)
    binary += b'\0' * (-len(binary) % 4)
    raw = struct.pack('<III', 0x46546c67, 2, 28 + len(js) + len(binary))
    raw += struct.pack('<II', len(js), 0x4e4f534a) + js
    raw += struct.pack('<II', len(binary), 0x004e4942) + binary
    tmp = path.with_suffix('.glb.tmp')
    tmp.write_bytes(raw)
    tmp.replace(path)


def linear(hex_color):
    values = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    return [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values] + [1]


def main():
    args = argparse.ArgumentParser()
    args.add_argument('--textures', type=Path, required=True)
    args.add_argument('--assets', type=Path, default=Path(__file__).resolve().parents[1] / 'assets/qinhuai-modern-import')
    a = args.parse_args()
    cfg = json.loads(Path(__file__).with_name('qinhuai-dragon-wall-materials.json').read_text(encoding='utf8'))
    path = a.assets / 'tiles/tile-05.glb'
    doc, binary, before = read_glb(path)
    if any(m.get('name') == cfg['front']['name'] for m in doc.get('materials', [])):
        print('Dragon wall already repaired; no changes.')
        return
    original = copy.deepcopy(doc)
    targets = set(cfg['front']['nodes'] + cfg['edge']['nodes'])
    nodes = {n.get('name'): n for n in doc['nodes'] if n.get('name') in targets}
    assert set(nodes) == targets, 'Unexpected tile: exact dragon-wall nodes not found'
    for node in nodes.values():
        for prim in doc['meshes'][node['mesh']]['primitives']:
            assert 'material' not in prim, 'Do not replace an existing assigned material'
            assert 'TEXCOORD_0' in prim['attributes']
    source = a.textures / cfg['sourceTexture']
    image = Image.open(source).convert('RGB')
    original_size = image.size
    image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
    stream = io.BytesIO()
    image.save(stream, format='JPEG', quality=94, subsampling=0, optimize=True)
    encoded = stream.getvalue()
    binary += b'\0' * (-len(binary) % 4)
    view = len(doc['bufferViews'])
    doc['bufferViews'].append({'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(encoded)})
    binary += encoded
    binary += b'\0' * (-len(binary) % 4)
    doc['buffers'][0]['byteLength'] = len(binary)
    image_id = len(doc.setdefault('images', []))
    doc['images'].append({'name': 'DragonWall_FuziTemple0004', 'mimeType': 'image/jpeg', 'bufferView': view})
    sampler = len(doc.setdefault('samplers', []))
    doc['samplers'].append({'magFilter': 9729, 'minFilter': 9987, 'wrapS': 33071, 'wrapT': 33071})
    texture = len(doc.setdefault('textures', []))
    doc['textures'].append({'source': image_id, 'sampler': sampler})
    changes = []
    for role in ('front', 'edge'):
        spec = cfg[role]
        pbr = {'baseColorFactor': [1, 1, 1, 1] if role == 'front' else linear(spec['colorSRGB']), 'metallicFactor': spec['metallic'], 'roughnessFactor': spec['roughness']}
        if role == 'front':
            pbr['baseColorTexture'] = {'index': texture, 'texCoord': 0}
        material = len(doc['materials'])
        doc['materials'].append({'name': spec['name'], 'doubleSided': True, 'pbrMetallicRoughness': pbr, 'extensions': {'KHR_materials_specular': {'specularFactor': spec['specular']}}, 'extras': {'repair': 'dragon-wall-material-v1', 'role': role}})
        for name in spec['nodes']:
            for prim in doc['meshes'][nodes[name]['mesh']]['primitives']:
                prim['material'] = material
            changes.append({'node': name, 'material': spec['name'], 'role': role})
    used = doc.setdefault('extensionsUsed', [])
    if 'KHR_materials_specular' not in used:
        used.append('KHR_materials_specular')
    write_glb(path, doc, binary)
    actual, actual_binary, after = read_glb(path)
    assert actual_binary[:len(read_glb_bytes := read_glb_from_backup_binary(before))] == read_glb_bytes
    assert actual['nodes'] == original['nodes'] and actual['accessors'] == original['accessors']
    for i, mesh in enumerate(original['meshes']):
        cmp = copy.deepcopy(actual['meshes'][i])
        if i in {n['mesh'] for n in nodes.values()}:
            for prim in cmp['primitives']:
                prim.pop('material')
        assert cmp == mesh, f'Unexpected geometry change {i}'
    report = {'version': 1, 'tile': 'tiles/tile-05.glb', 'sourceTexture': str(source), 'sourceImageSize': original_size, 'embeddedImageSize': image.size, 'sourceTextureSHA256': digest(source.read_bytes()), 'beforeSHA256': digest(before), 'afterSHA256': digest(after), 'beforeBytes': len(before), 'afterBytes': len(after), 'addedBytes': len(after)-len(before), 'changes': changes, 'evidence': cfg['evidence'], 'note': cfg['note'], 'originalBinaryUnchanged': True, 'geometryUVTransformsUnchanged': True}
    (a.assets/'reports/dragon-wall-repair.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')
    for filename in ('manifest.json', 'reports/import-report.json'):
        file = a.assets / filename
        meta = json.loads(file.read_text(encoding='utf8'))
        tile = next(t for t in meta['tiles'] if t['id'] == 5)
        tile.update(bytes=len(after), materials=len(doc['materials']), revision=digest(after)[:12])
        meta['normalizedStats']['materials'] += 2
        meta['materialRepairs'] = [{'id': 'dragon-wall-v1', 'nodes': sorted(targets), 'report': 'reports/dragon-wall-repair.json', 'originalUVPreserved': True}]
        file.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps(report, ensure_ascii=True, indent=2))


def read_glb_from_backup_binary(raw):
    length = struct.unpack_from('<I', raw, 12)[0]
    offset = 20 + length
    size = struct.unpack_from('<I', raw, offset)[0]
    return raw[offset+8:offset+8+size]


if __name__ == '__main__':
    main()
