// Shared step-by-step engine for every stop on the map.
// Each <section class="step"> is one screen. Its "Next" button stays disabled
// until the page calls Stop.unlock(section) — i.e. the visitor has done the thing.
const Stop = (() => {
  let steps = [], current = 0, stopId = null;

  function renderDots() {
    const el = document.getElementById('dots');
    if (!el) return;
    el.innerHTML = steps.map((_, j) =>
      `<span class="dot ${j < current ? 'done' : ''} ${j === current ? 'now' : ''}"></span>`).join('');
  }

  function show(i) {
    current = i;
    steps.forEach((s, j) => { s.hidden = j !== i; });
    renderDots();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (steps[i].classList.contains('finish')) Progress.markDone(stopId);
    steps[i].dispatchEvent(new CustomEvent('enter'));
  }

  function init(id) {
    stopId = id;
    steps = [...document.querySelectorAll('.step')];
    steps.forEach((s, j) => {
      s.querySelectorAll('.next').forEach(b => b.addEventListener('click', () => show(j + 1)));
    });
    show(0);
  }

  function unlock(section) {
    const b = section.querySelector('.next');
    if (b && b.disabled) { b.disabled = false; b.classList.add('ready'); }
  }

  function say(el, text, kind) {
    el.textContent = text;
    el.className = 'feedback' + (kind ? ' ' + kind : '');
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { init, unlock, say, shuffle };
})();
