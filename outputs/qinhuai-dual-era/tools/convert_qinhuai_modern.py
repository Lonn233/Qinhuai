"""Convert the Qinhuai modern FBX source into independently loadable Three.js tiles.

The source scene is never modified. Blender imports it into memory, repairs image
paths by basename, normalizes the site around its horizontal center, and exports
spatial GLB tiles plus a manifest and audit report.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import shutil
import sys
import time
from pathlib import Path
from collections import defaultdict

import bpy
from mathutils import Matrix, Vector

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".tga", ".tif", ".tiff", ".bmp", ".psd", ".webp"}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--textures", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--grid", type=int, default=4)
    parser.add_argument("--max-texture", type=int, default=2048)
    parser.add_argument("--scale-span", type=float, default=1000.0)
    parser.add_argument("--report-only", action="store_true")
    parser.add_argument("--clean", action="store_true")
    return parser.parse_args(sys.argv[sys.argv.index("--") + 1 :])


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def image_key(value: str) -> str:
    value = Path(value or "").name.lower()
    value = re.sub(r"\.\d{3}$", "", value)
    return value


def build_image_index(root: Path):
    index = defaultdict(list)
    for file in root.rglob("*"):
        if file.is_file() and file.suffix.lower() in IMAGE_EXTS:
            index[file.name.lower()].append(file)
            index[file.stem.lower()].append(file)
    return index


def find_image(image, index):
    candidates = [image_key(image.filepath), image_key(image.name)]
    for key in candidates:
        if not key:
            continue
        files = index.get(key, [])
        if files:
            # Prefer the compact texture staging directory when duplicate names exist.
            return sorted(files, key=lambda p: (len(str(p)), str(p).lower()))[0]
    return None


def repair_images(index, max_texture):
    repaired = []
    missing = []
    resized = []
    for image in list(bpy.data.images):
        if image.source == "GENERATED":
            continue
        path = find_image(image, index)
        if path is None:
            missing.append(image.name)
            continue
        try:
            image.filepath = str(path)
            image.reload()
            if max(image.size) > max_texture:
                ratio = max_texture / float(max(image.size))
                w = max(1, int(round(image.size[0] * ratio)))
                h = max(1, int(round(image.size[1] * ratio)))
                image.scale(w, h)
                resized.append({"name": image.name, "source": str(path), "size": [w, h]})
            repaired.append({"name": image.name, "path": str(path), "size": list(image.size)})
        except Exception as error:
            missing.append(f"{image.name}: {error}")
    return repaired, missing, resized


def world_bounds(objects):
    min_v = Vector((float("inf"), float("inf"), float("inf")))
    max_v = Vector((float("-inf"), float("-inf"), float("-inf")))
    for obj in objects:
        for corner in obj.bound_box:
            point = obj.matrix_world @ Vector(corner)
            min_v.x = min(min_v.x, point.x)
            min_v.y = min(min_v.y, point.y)
            min_v.z = min(min_v.z, point.z)
            max_v.x = max(max_v.x, point.x)
            max_v.y = max(max_v.y, point.y)
            max_v.z = max(max_v.z, point.z)
    return min_v, max_v


def transform_scene(objects, min_v, max_v, scale_span):
    horizontal = max(max_v.x - min_v.x, max_v.y - min_v.y)
    scale = scale_span / horizontal if horizontal else 1.0
    center_x = (min_v.x + max_v.x) * 0.5
    center_y = (min_v.y + max_v.y) * 0.5
    base_z = min_v.z
    transform = Matrix.Translation(Vector((-center_x, -center_y, -base_z)))
    transform = Matrix.Diagonal((scale, scale, scale, 1.0)) @ transform
    for obj in objects:
        obj.matrix_world = transform @ obj.matrix_world
    return scale, Vector((center_x, center_y, base_z)), Vector((horizontal * scale, horizontal * scale, (max_v.z - min_v.z) * scale))


def tile_id(ix, iy, grid):
    return iy * grid + ix


def assign_tiles(objects, bounds_min, bounds_max, grid):
    span_x = max(bounds_max.x - bounds_min.x, 1e-6)
    span_y = max(bounds_max.y - bounds_min.y, 1e-6)
    tiles = defaultdict(list)
    for obj in objects:
        corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
        cx = sum(point.x for point in corners) / len(corners)
        cy = sum(point.y for point in corners) / len(corners)
        ix = min(grid - 1, max(0, int((cx - bounds_min.x) / span_x * grid)))
        iy = min(grid - 1, max(0, int((cy - bounds_min.y) / span_y * grid)))
        tiles[tile_id(ix, iy, grid)].append(obj)
    return tiles


def object_stats(objects):
    vertices = 0
    polygons = 0
    triangles = 0
    materials = set()
    for obj in objects:
        data = obj.data
        vertices += len(data.vertices)
        polygons += len(data.polygons)
        triangles += sum(max(0, len(poly.vertices) - 2) for poly in data.polygons)
        materials.update(mat.name for mat in data.materials if mat)
    return {
        "objects": len(objects),
        "vertices": vertices,
        "polygons": polygons,
        "triangles": triangles,
        "materials": len(materials),
    }


def select_objects(objects):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    if objects:
        bpy.context.view_layer.objects.active = objects[0]


def export_tile(path: Path, objects):
    select_objects(objects)
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_keep_originals=False,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )
    return path.stat().st_size


def write_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    args = parse_args()
    source = Path(args.input).resolve()
    textures = Path(args.textures).resolve()
    output = Path(args.output).resolve()
    if not source.is_file():
        raise SystemExit(f"FBX not found: {source}")
    if not textures.is_dir():
        raise SystemExit(f"Texture directory not found: {textures}")
    if args.clean and output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True, exist_ok=True)
    started = time.perf_counter()
    reset_scene()
    print(f"IMPORT_START {source} ({source.stat().st_size} bytes)", flush=True)
    result = bpy.ops.import_scene.fbx(filepath=str(source), use_image_search=True, automatic_bone_orientation=False)
    objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not objects:
        raise RuntimeError("FBX imported without mesh objects")
    source_min, source_max = world_bounds(objects)
    source_stats = object_stats(objects)
    print("IMPORT_RESULT", result, source_stats, flush=True)
    print("SOURCE_BOUNDS", list(source_min), list(source_max), flush=True)
    image_index = build_image_index(textures)
    repaired, missing, resized = repair_images(image_index, args.max_texture)
    print(f"TEXTURES repaired={len(repaired)} missing={len(missing)} resized={len(resized)}", flush=True)
    scale, source_origin, normalized_size = transform_scene(objects, source_min, source_max, args.scale_span)
    normalized_min, normalized_max = world_bounds(objects)
    tiles = assign_tiles(objects, normalized_min, normalized_max, args.grid)
    normalized_stats = object_stats(objects)
    report = {
        "version": 1,
        "source": str(source),
        "sourceBytes": source.stat().st_size,
        "blenderVersion": bpy.app.version_string,
        "sourceStats": source_stats,
        "normalizedStats": normalized_stats,
        "sourceBounds": {"min": list(source_min), "max": list(source_max)},
        "normalizedBounds": {"min": list(normalized_min), "max": list(normalized_max)},
        "normalizedSize": list(normalized_size),
        "normalization": {"scale": scale, "sourceOrigin": list(source_origin), "scaleSpan": args.scale_span},
        "grid": args.grid,
        "textureMaxDimension": args.max_texture,
        "textures": {"repaired": repaired, "missing": missing, "resized": resized},
        "tiles": [],
        "elapsedSeconds": round(time.perf_counter() - started, 3),
    }
    write_json(output / "reports" / "import-report.json", report)
    if missing:
        print(f"WARNING_MISSING_TEXTURES {len(missing)}", flush=True)
    if args.report_only:
        print("REPORT_ONLY", flush=True)
        return
    tiles_dir = output / "tiles"
    tiles_dir.mkdir(parents=True, exist_ok=True)
    span_x = normalized_max.x - normalized_min.x
    span_y = normalized_max.y - normalized_min.y
    for tid in sorted(tiles):
        ix = tid % args.grid
        iy = tid // args.grid
        tile_objects = tiles[tid]
        filename = f"tile-{tid:02d}.glb"
        path = tiles_dir / filename
        print(f"EXPORT_TILE {filename} objects={len(tile_objects)}", flush=True)
        size = export_tile(path, tile_objects)
        tile_stats = object_stats(tile_objects)
        tile_bounds_min, tile_bounds_max = world_bounds(tile_objects)
        report["tiles"].append({
            "id": tid,
            "file": f"tiles/{filename}",
            "ix": ix,
            "iy": iy,
            "objects": tile_stats["objects"],
            "vertices": tile_stats["vertices"],
            "polygons": tile_stats["polygons"],
            "triangles": tile_stats["triangles"],
            "materials": tile_stats["materials"],
            "bytes": size,
            "bounds": {"min": list(tile_bounds_min), "max": list(tile_bounds_max)},
            "center": [
                (tile_bounds_min.x + tile_bounds_max.x) * 0.5,
                (tile_bounds_min.z + tile_bounds_max.z) * 0.5,
                (tile_bounds_min.y + tile_bounds_max.y) * 0.5,
            ],
            "radius": math.sqrt(
                ((tile_bounds_max.x - tile_bounds_min.x) * 0.5) ** 2
                + ((tile_bounds_max.y - tile_bounds_min.y) * 0.5) ** 2
            ),
        })
    report["elapsedSeconds"] = round(time.perf_counter() - started, 3)
    write_json(output / "manifest.json", {
        "version": 1,
        "coordinateSystem": "Three.js Y-up after Blender glTF export",
        "source": report["source"],
        "sourceBytes": report["sourceBytes"],
        "sourceStats": report["sourceStats"],
        "normalizedStats": report["normalizedStats"],
        "sourceBounds": report["sourceBounds"],
        "normalizedBounds": report["normalizedBounds"],
        "normalizedSize": report["normalizedSize"],
        "normalization": report["normalization"],
        "grid": args.grid,
        "tiles": report["tiles"],
        "textureReport": {"repaired": len(repaired), "missing": len(missing), "missingNames": missing, "resized": len(resized)},
    })
    write_json(output / "reports" / "import-report.json", report)
    print(f"DONE tiles={len(report['tiles'])} seconds={report['elapsedSeconds']}", flush=True)


if __name__ == "__main__":
    main()
