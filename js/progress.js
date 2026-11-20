// Remembers which stops a visitor has finished (in their own browser only).
const Progress = (() => {
  const KEY = 'mathmap-progress-v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* storage blocked: progress just isn't kept */ }
  }
  return {
    isDone: (id) => !!load()[id],
    markDone: (id) => { const p = load(); p[id] = Date.now(); save(p); },
    reset: () => save({}),
  };
})();
