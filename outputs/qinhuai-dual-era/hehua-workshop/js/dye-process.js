// Immersion time follows 交互终版.md §2.2: 20 simulated seconds per real second.
export const DYE_RATE = 20;
export const DYE_MIN = 120;
export const DYE_MAX = 180;
// The document does not prescribe drying duration; this is a gameplay duration.
export const DRY_SECONDS = 8;
export const dyeQuality = seconds => seconds < DYE_MIN ? 'light' : seconds <= DYE_MAX ? 'ready' : 'dark';
export const dyeClock = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function createDyeProcess(inventory, target = 6) {
  const keys = ['paper', 'wetPaper', 'dyedPaper'];
  let mode = 'dye', stock = target, seconds = 0, remaining = 0, holding = false, discarded = 0, collected = 0, rackCount = 0, dryRemaining = 0;
  const history = [];
  const items = () => Object.fromEntries(keys.map(key => [key, inventory[key]]));
  const capture = () => ({ mode, stock, seconds, remaining, discarded, collected, rackCount, dryRemaining, inventory: items() });
  let expected = items();
  const unchanged = () => keys.every(key => inventory[key] === expected[key]);
  const save = () => { history.push(capture()); holding = false; };
  const finish = () => { expected = items(); return true; };
  const snapshot = () => ({ ...capture(), rackCount, dryRemaining, holding, quality: dyeQuality(seconds), timer: dyeClock(seconds),
    timerVisible: mode === 'dyeing', target, canBack: !!history.length && unchanged(), canSkip: mode !== 'dyeDone' });
  function act(action) {
    if (action === 'pause') { holding = false; return true; }
    if (action === 'pick' && mode === 'dye' && stock > 0) {
      save(); stock--; inventory.paper++; seconds = remaining = 0; mode = 'paperReady'; return finish();
    }
    if (action === 'bowl' && mode === 'paperReady' && inventory.paper > 0) {
      save(); inventory.paper--; inventory.wetPaper++; mode = 'atDye'; return finish();
    }
    if (action === 'immerse' && ['atDye', 'dyeing'].includes(mode) && !holding) {
      save(); mode = 'dyeing'; holding = true; return finish();
    }
    if (action === 'rack' && mode === 'dyeing' && !holding && dyeQuality(seconds) === 'ready') {
      save(); rackCount++; seconds = 0;
      mode = rackCount >= target ? 'readyToDryAll' : 'dye'; return finish();
    }
    if (action === 'dry' && mode === 'readyToDryAll') {
      save(); dryRemaining = DRY_SECONDS; mode = 'dryingAll'; return finish();
    }
    if (action === 'collect' && mode === 'collectDyed' && inventory.wetPaper > 0) {
      save(); inventory.wetPaper--; inventory.dyedPaper++; collected++; rackCount--; seconds = remaining = 0;
      mode = collected >= target ? 'dyeDone' : 'collectDyed'; return finish();
    }
    if (action === 'discard' && mode === 'dyeing' && dyeQuality(seconds) === 'dark') {
      save(); inventory.wetPaper--; discarded++; stock++; seconds = remaining = 0; mode = 'dye'; return finish();
    }
    return false;
  }
  function update(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    if (mode === 'dyeing' && holding) seconds += dt * DYE_RATE;
    if (mode === 'dryingAll') { dryRemaining = Math.max(0, dryRemaining - dt); if (!dryRemaining) { mode = 'collectDyed'; remaining = 0; } }
  }
  function skip() {
    if (mode === 'dye') return act('pick');
    if (mode === 'paperReady') return act('bowl');
    if (['atDye', 'dyeing'].includes(mode)) { save(); mode = 'dyeing'; seconds = DYE_MIN; return finish(); }
    if (mode === 'readyToDryAll') return act('dry');
    if (mode === 'dryingAll') { save(); dryRemaining = 0; mode = 'collectDyed'; remaining = 0; return finish(); }
    if (mode === 'collectDyed') return act('collect');
    return false;
  }
  return {
    snapshot, act, update,
    skip() { if (mode === 'dyeing' && !holding && dyeQuality(seconds) === 'ready') return act('rack'); return skip(); },
    back() {
      if (!history.length || !unchanged()) return false;
      const previous = history.pop();
      ({ mode, stock, seconds, remaining, discarded, collected, rackCount, dryRemaining } = previous);
      Object.assign(inventory, previous.inventory); holding = false; return finish();
    },
    reset() {
      history.length = 0; mode = 'dye'; stock = target; seconds = remaining = discarded = collected = rackCount = dryRemaining = 0; holding = false;
      inventory.paper = inventory.wetPaper = inventory.dyedPaper = 0; expected = items();
    }
  };
}
