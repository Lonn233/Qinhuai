"""Derive four identical front sectors; never modify supplied or legacy assets."""
from pathlib import Path
import copy
import hashlib
import json
import struct
import subprocess
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('E:/soft/inspiration/灯会/model/菊水灯.glb')
WORK = ROOT / 'work/chrysanthemum-four-faces'
OUT = ROOT / 'assets/chrysanthemum-four-faces'
REVISION = 'chrysanthemum-four-faces-20261022'


def read_glb(path):
    data = path.read_bytes()
    length = struct.unpack_from('<I', data, 12)[0]
    doc = json.loads(data[20:20+length])
    binary = data[28+length:]
    primitive = doc['meshes'][0]['primitives'][0]
    assert len(doc['meshes']) == len(doc['meshes'][0]['primitives']) == 1
    def read(index):
        a = doc['accessors'][index]
        view = doc['bufferViews'][a['bufferView']]
        dtype = {5126: '<f4', 5125: '<u4', 5123: '<u2'}[a['componentType']]
        width = {'VEC3': 3, 'VEC2': 2, 'SCALAR': 1}[a['type']]
        assert view.get('byteStride', np.dtype(dtype).itemsize*width) == np.dtype(dtype).itemsize*width
        return np.frombuffer(binary, dtype=dtype, count=a['count']*width,
            offset=view.get('byteOffset', 0)+a.get('byteOffset', 0)).reshape(-1, width)
    attrs = {k: read(v) for k, v in primitive['attributes'].items()}
    return doc, binary, attrs, read(primitive['indices']).reshape(-1, 3)


def write_glb(path, attrs, indices, texture=None):
    doc = {'asset': {'version': '2.0', 'extras': {'revision': REVISION}},
        'scene': 0, 'scenes': [{'nodes': [0]}], 'nodes': [{'mesh': 0}],
        'meshes': [{'primitives': [{'attributes': {}}]}], 'accessors': [], 'bufferViews': []}
    binary = bytearray()
    def append(data):
        index = len(doc['bufferViews'])
        doc['bufferViews'].append({'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(data)})
        binary.extend(data)
        binary.extend(b'\0' * (-len(binary) % 4))
        return index
    primitive = doc['meshes'][0]['primitives'][0]
    for name, values in attrs.items():
        values = np.asarray(values, dtype='<f4')
        a = {'bufferView': append(values.tobytes()), 'componentType': 5126,
             'count': len(values), 'type': 'VEC'+str(values.shape[1])}
        if name == 'POSITION':
            a.update(min=values.min(axis=0).tolist(), max=values.max(axis=0).tolist())
        primitive['attributes'][name] = len(doc['accessors'])
        doc['accessors'].append(a)
    indices = np.asarray(indices, dtype='<u4').reshape(-1)
    primitive['indices'] = len(doc['accessors'])
    doc['accessors'].append({'bufferView': append(indices.tobytes()), 'componentType': 5125,
        'count': len(indices), 'type': 'SCALAR'})
    if texture:
        td, tb = texture
        for key in ['materials', 'textures', 'samplers', 'images']:
            if key in td: doc[key] = copy.deepcopy(td[key])
        for image in doc.get('images', []):
            view = td['bufferViews'][image['bufferView']]
            start = view.get('byteOffset', 0)
            image['bufferView'] = append(tb[start:start+view['byteLength']])
        primitive['material'] = 0
    doc['buffers'] = [{'byteLength': len(binary)}]
    text = json.dumps(doc, separators=(',', ':')).encode()
    text += b' ' * (-len(text) % 4)
    payload = struct.pack('<III', 0x46546c67, 2, 28+len(text)+len(binary))
    payload += struct.pack('<II', len(text), 0x4e4f534a)+text
    payload += struct.pack('<II', len(binary), 0x004e4942)+binary
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(payload)
    return {'triangles': len(indices)//3, 'vertices': len(attrs['POSITION']),
        'bytes': len(payload), 'sha256': hashlib.sha256(payload).hexdigest()}


def front_sector(attrs, triangles):
    # Clip against diagonal planes, retaining top/base wedges exactly once.
    position = attrs['POSITION']
    center = (position.min(axis=0)+position.max(axis=0))*.5
    local = position[:, [0, 2]]-center[[0, 2]]
    distances = np.stack([local[:, 1]-local[:, 0], local[:, 1]+local[:, 0]], axis=1)
    d = distances[triangles]
    inside = (d >= 0).all(axis=(1, 2))
    outside = (d < 0).all(axis=1).any(axis=1)
    names = list(attrs)
    widths = [attrs[name].shape[1] for name in names]
    values = np.concatenate([attrs[name] for name in names], axis=1).astype(np.float64)
    kept = triangles[inside]
    boundary = []
    for tri in triangles[~inside & ~outside]:
        polygon = [values[index].copy() for index in tri]
        for sign in [-1, 1]:
            result = []
            for i, a in enumerate(polygon):
                b = polygon[(i+1) % len(polygon)]
                da = a[2]-center[2]+sign*(a[0]-center[0])
                db = b[2]-center[2]+sign*(b[0]-center[0])
                if da >= 0: result.append(a)
                if (da >= 0) != (db >= 0): result.append(a+(b-a)*(da/(da-db)))
            polygon = result
        for i in range(1, len(polygon)-1):
            boundary.extend([polygon[0], polygon[i], polygon[i+1]])
    used, inverse = np.unique(kept.reshape(-1), return_inverse=True)
    extra = np.asarray(boundary).reshape(-1, values.shape[1])
    compact = np.concatenate([values[used], extra])
    ix = np.concatenate([inverse, np.arange(len(used), len(compact))]).reshape(-1, 3)
    result = dict(zip(names, np.split(compact, np.cumsum(widths)[:-1], axis=1)))
    normal = result['NORMAL']
    normal /= np.maximum(np.linalg.norm(normal, axis=1, keepdims=True), 1e-12)
    return result, ix, center


def four_faces(attrs, indices, center):
    indices = indices.astype(np.uint32)
    result = {name: [] for name in attrs}
    rotations = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    for cosine, sine in rotations:
        for name, values in attrs.items():
            v = values.copy()
            if name in ['POSITION', 'NORMAL']:
                offset = center[[0, 2]] if name == 'POSITION' else np.zeros(2)
                x, z = (v[:, [0, 2]]-offset).T
                v[:, 0] = cosine*x+sine*z+offset[0]
                v[:, 2] = -sine*x+cosine*z+offset[1]
            result[name].append(v)
    return {k: np.concatenate(v) for k, v in result.items()}, np.concatenate([
        indices+i*len(attrs['POSITION']) for i in range(4)])


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    sha = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    doc, binary, attrs, indices = read_glb(SOURCE)
    assert list(attrs)[:1] == ['POSITION']
    assert all('matrix' not in n or np.array_equal(np.array(n['matrix']).reshape(4, 4), np.eye(4)) for n in doc['nodes'])
    attrs, indices, center = front_sector(attrs, indices)
    quarter = WORK/'front-sector.glb'
    write_glb(quarter, attrs, indices)
    legacy, legacy_binary, _, _ = read_glb(ROOT/'assets/qinhuai-modern-import/festival/chrysanthemum-low.glb')
    report = {'revision': REVISION, 'source': str(SOURCE), 'sourceSHA256': sha,
        'front': '+Z', 'center': center.tolist(), 'method': 'Clip front 90-degree sector; rotate four exact copies', 'models': {}}
    for mode, ratio in [('original', 1), ('five', .05), ('half', .5), ('current', .013)]:
        a, ix = attrs, indices
        if ratio != 1:
            reduced = WORK/(mode+'-sector.glb')
            with (WORK/(mode+'.log')).open('w', encoding='utf8') as log:
                subprocess.run(['E:/blender/blender.exe', '--background', '--threads', '4', '--python',
                    str(ROOT/'tools/blender-chrysanthemum-sector.py'), '--', str(quarter), str(reduced), str(ratio)],
                    stdout=log, stderr=subprocess.STDOUT, check=True)
            _, _, a, ix = read_glb(reduced)
        a, ix = four_faces(a, ix, center)
        report['models'][mode] = write_glb(OUT/(mode+'.glb'), a, ix,
            (legacy, legacy_binary) if mode == 'current' else None)
        print(mode, report['models'][mode], flush=True)
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == sha
    (OUT/'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')


if __name__ == '__main__':
    main()
