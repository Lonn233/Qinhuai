"""Validate derived geometry, texture preservation and the untouched source."""
import hashlib
import json
import importlib.util
from pathlib import Path
import numpy as np

spec = importlib.util.spec_from_file_location('prepare_faces',
    Path(__file__).with_name('prepare-chrysanthemum-faces.py'))
prepare = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)
ROOT, SOURCE, read_glb = prepare.ROOT, prepare.SOURCE, prepare.read_glb


def image_bytes(doc, binary):
    result = []
    for image in doc.get('images', []):
        view = doc['bufferViews'][image['bufferView']]
        start = view.get('byteOffset', 0)
        result.append(binary[start:start + view['byteLength']])
    return result


def main():
    folder = ROOT / 'assets/chrysanthemum-four-faces'
    manifest = json.loads((folder / 'manifest.json').read_text(encoding='utf8'))
    source_sha = '6b3bf88b4d55bb2170116672fd8522ea2c7df0947601abd97ac698ea21ababe6'
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == source_sha
    assert manifest['sourceSHA256'] == source_sha
    center = np.array(manifest['center'])
    legacy, legacy_binary, _, _ = read_glb(
        ROOT / 'assets/qinhuai-modern-import/festival/chrysanthemum-low.glb')
    for mode, info in manifest['models'].items():
        path = folder / (mode + '.glb')
        assert path.stat().st_size == info['bytes']
        assert hashlib.sha256(path.read_bytes()).hexdigest() == info['sha256']
        doc, binary, attrs, indices = read_glb(path)
        assert set(attrs) == {'POSITION', 'NORMAL', 'TEXCOORD_0'}
        assert all(np.isfinite(value).all() for value in attrs.values())
        vertices = len(attrs['POSITION'])
        assert vertices == info['vertices'] and len(indices) == info['triangles']
        assert indices.min() >= 0 and indices.max() < vertices
        assert vertices % 4 == 0 and len(indices) % 4 == 0
        count, faces = vertices // 4, len(indices) // 4
        for side, (cosine, sine) in enumerate([(1, 0), (0, 1), (-1, 0), (0, -1)]):
            np.testing.assert_array_equal(indices[side * faces:(side + 1) * faces],
                                          indices[:faces] + side * count)
            for name, values in attrs.items():
                expected = values[:count].astype(np.float64).copy()
                if name in ['POSITION', 'NORMAL']:
                    offset = center[[0, 2]] if name == 'POSITION' else np.zeros(2)
                    x, z = (expected[:, [0, 2]] - offset).T
                    expected[:, 0] = cosine * x + sine * z + offset[0]
                    expected[:, 2] = -sine * x + cosine * z + offset[1]
                np.testing.assert_allclose(values[side * count:(side + 1) * count],
                                           expected, atol=2e-7, rtol=2e-6)
        if mode == 'current':
            assert doc['materials'] == legacy['materials']
            assert image_bytes(doc, binary) == image_bytes(legacy, legacy_binary)
        else:
            assert not doc.get('images')
        print('PASS', mode, info['triangles'], 'triangles; all four front sectors match')
    original = manifest['models']['original']['triangles']
    assert abs(manifest['models']['five']['triangles'] / original - .05) < .001
    assert abs(manifest['models']['half']['triangles'] / original - .5) < .001
    print('PASS original source SHA256 and production texture bytes unchanged')


if __name__ == '__main__':
    main()
