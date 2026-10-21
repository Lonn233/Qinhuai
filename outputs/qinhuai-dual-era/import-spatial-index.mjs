// XZ broad phase only: callers retain their exact triangle tests.
export class XZSpatialIndex {
  constructor(cellSize, maxCells = 256) {
    this.cellSize = cellSize; this.maxCells = maxCells; this.clear();
  }
  clear() { this.cells = new Map(); this.overflow = []; this.stamps = new Map(); this.stamp = 0; }
  insert(item, bounds = item.bounds) {
    const s = this.cellSize;
    const x0 = Math.floor(bounds.min.x / s), x1 = Math.floor(bounds.max.x / s);
    const z0 = Math.floor(bounds.min.z / s), z1 = Math.floor(bounds.max.z / s);
    const entry = {item, bounds};
    if ((x1 - x0 + 1) * (z1 - z0 + 1) > this.maxCells) { this.overflow.push(entry); return; }
    for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) {
      const key = x + ":" + z;
      let cell = this.cells.get(key);
      if (!cell) this.cells.set(key, cell = []);
      cell.push(entry);
    }
  }
  query(minX, minZ, maxX, maxZ, result = []) {
    result.length = 0;
    if (++this.stamp >= Number.MAX_SAFE_INTEGER) { this.stamps.clear(); this.stamp = 1; }
    const visit = entry => {
      if (this.stamps.get(entry) === this.stamp) return;
      this.stamps.set(entry, this.stamp);
      const b = entry.bounds;
      if (b.max.x >= minX && b.min.x <= maxX && b.max.z >= minZ && b.min.z <= maxZ) result.push(entry.item);
    };
    const s = this.cellSize;
    for (let x = Math.floor(minX / s); x <= Math.floor(maxX / s); x++)
      for (let z = Math.floor(minZ / s); z <= Math.floor(maxZ / s); z++) {
        const cell = this.cells.get(x + ":" + z);
        if (cell) for (const entry of cell) visit(entry);
      }
    for (const entry of this.overflow) visit(entry);
    return result;
  }
}
