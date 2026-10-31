"""Copy the intact front head onto the missing rear face, retaining UVs."""
import argparse
import copy
import json
import shutil
import struct
from pathlib import Path

import numpy as np
from import_glb_utils import accessor, read_glb

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'work/mountain-four-faces'
FILES = [
    'game/assets/mountain.glb',
    'assets/lantern-quality/five/mountain.glb',
    'assets/lantern-near-half/mountain.glb',
    'assets/qinhuai-modern-import/festival/mountain-low.glb',
    'work/large-lantern-lods/mountain-2.glb',
]
MARKER = 'qinhuaiFourthHeadRepair'


def image_bytes(doc, blob):
    result = []
    for image in doc.get('images', []):
        view = doc['bufferViews'][image['bufferView']]
        start = view.get('byteOffset', 0)
        result.append(blob[start:start + view['byteLength']])
    return result


def repair(relative, preview=False):
    path = ROOT / relative
    doc, blob, original_sha = read_glb(path)
    if doc.get('extras', {}).get(MARKER):
        return {'file': relative, 'alreadyRepaired': True}
    original_materials = copy.deepcopy(doc.get('materials', []))
    original_images = image_bytes(doc, blob)
    primitive = doc['meshes'][0]['primitives'][0]
    attributes = {key: accessor(doc, blob, value) for key, value in primitive['attributes'].items()}
    position = attributes['POSITION']
    indices = accessor(doc, blob, primitive['indices']).reshape(-1, 3)
    centers = position[indices].mean(axis=1)
    selected = ((np.abs(centers[:, 0]) < .18) & (centers[:, 1] > -.555)
                & (centers[:, 1] < -.245) & (centers[:, 2] > .71))
    heads = indices[selected]
    assert len(heads) > 40, f'No head found in {relative}'
    vertices, remapped = np.unique(heads, return_inverse=True)
    count = len(position)
    data = bytearray(blob[:doc['buffers'][0]['byteLength']])

    def append(array, target, kind):
        array = np.ascontiguousarray(array)
        data.extend(b'\0' * (-len(data) % 4))
        view = len(doc['bufferViews'])
        doc['bufferViews'].append({'buffer': 0, 'byteOffset': len(data), 'byteLength': array.nbytes, 'target': target})
        data.extend(array.tobytes())
        entry = {'bufferView': view, 'componentType': 5125 if target == 34963 else 5126,
                 'count': len(array), 'type': kind}
        if kind == 'VEC3' and target == 34962:
            entry.update(min=array.min(axis=0).tolist(), max=array.max(axis=0).tolist())
        doc['accessors'].append(entry)
        return len(doc['accessors']) - 1

    for key, original in attributes.items():
        head = original[vertices].copy()
        if not preview and key in ('POSITION', 'NORMAL', 'TANGENT'):
            head[:, [0, 2]] *= -1
        combined = head if preview else np.concatenate((original, head))
        combined = combined.astype('<f4')
        assert np.isfinite(combined).all()
        if not preview:
            assert np.array_equal(combined[:count], original)
        primitive['attributes'][key] = append(combined, 34962, {2: 'VEC2', 3: 'VEC3', 4: 'VEC4'}[combined.shape[1]])
    added = remapped.reshape(-1, 3)
    combined_indices = added if preview else np.concatenate((indices, added + count))
    combined_indices = combined_indices.astype('<u4').reshape(-1, 1)
    assert combined_indices.max() < (len(vertices) if preview else count + len(vertices))
    primitive['indices'] = append(combined_indices, 34963, 'SCALAR')
    doc['buffers'][0]['byteLength'] = len(data)
    doc.setdefault('extras', {})[MARKER] = {'version': 1, 'sourceSha256': original_sha, 'addedTriangles': len(heads)}
    encoded = json.dumps(doc, separators=(',', ':')).encode('utf-8')
    encoded += b' ' * (-len(encoded) % 4)
    data.extend(b'\0' * (-len(data) % 4))
    output = (struct.pack('<III', 0x46546C67, 2, 28 + len(encoded) + len(data))
              + struct.pack('<II', len(encoded), 0x4E4F534A) + encoded
              + struct.pack('<II', len(data), 0x004E4942) + data)
    destination = OUT / 'head-preview.glb' if preview else path
    if not preview:
        backup = OUT / 'originals' / relative
        assert not backup.exists(), f'Backup already exists: {backup}'
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup)
    destination.write_bytes(output)
    checked, checked_blob, sha = read_glb(destination)
    assert checked.get('materials', []) == original_materials
    assert image_bytes(checked, checked_blob) == original_images
    return {'file': relative, 'verticesBefore': count, 'verticesAdded': len(vertices),
            'trianglesBefore': len(indices), 'trianglesAdded': len(heads),
            'trianglesAfter': len(combined_indices) // 3, 'sha256': sha,
            'originalSha256': original_sha, 'materialsAndImagesUnchanged': True}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--preview', action='store_true')
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    reports = [repair(file, args.preview) for file in (FILES[:1] if args.preview else FILES)]
    if not args.preview:
        (OUT / 'repair-report.json').write_text(json.dumps(reports, indent=2), encoding='utf-8')
    print(json.dumps(reports, indent=2))
