// The journey, in order. Stops without an `href` are on the map but not built yet.
const STOPS = [
  { id: 'counting', tier: 'primary', icon: '🏡', name: 'Counting Village',
    blurb: 'Count apples, snap cubes into tens, read big numbers.', href: 'stops/counting.html' },
  { id: 'multiplication', tier: 'primary', icon: '🌼', name: 'Multiplication Meadows',
    blurb: 'Plant flowers in rows and columns.' },
  { id: 'fractions', tier: 'primary', icon: '🍕', name: 'Fraction Falls',
    blurb: 'Slice pizzas, share fairly, find halves.', href: 'stops/fractions.html' },
  { id: 'patterns', tier: 'secondary', icon: '🔺', name: 'Pattern Peaks',
    blurb: 'Spot the rule hiding in a sequence.' },
  { id: 'equations', tier: 'secondary', icon: '⚖️', name: 'Equation Bridge',
    blurb: 'Keep the scale balanced and find the mystery x.', href: 'stops/equations.html' },
  { id: 'graphs', tier: 'secondary', icon: '📈', name: 'Graph Grasslands',
    blurb: 'Drag sliders and watch lines and curves move.' },
  { id: 'geometry', tier: 'secondary', icon: '📐', name: 'Geometry Gardens',
    blurb: 'Angles, areas, and Pythagoras with squares.' },
  { id: 'trig', tier: 'advanced', icon: '🌀', name: 'Trig Tower',
    blurb: 'A point circling round draws a sine wave.' },
  { id: 'calculus', tier: 'advanced', icon: '∞', name: 'Calculus Canyon',
    blurb: 'Zoom into curves until they straighten; stack rectangles to measure area.', href: 'stops/calculus.html' },
];

const built = STOPS.filter(s => s.href);

function statusOf(stop) {
  if (!stop.href) return 'soon';
  if (Progress.isDone(stop.id)) return 'done';
  const i = built.indexOf(stop);
  return built.slice(0, i).every(s => Progress.isDone(s.id)) ? 'open' : 'locked';
}

function render() {
  document.querySelectorAll('.stops').forEach(ol => { ol.innerHTML = ''; });
  STOPS.forEach(stop => {
    const status = statusOf(stop);
    const prevBuilt = built[built.indexOf(stop) - 1];
    const chip = {
      done: '✓ Completed — play again',
      open: 'Start here →',
      locked: `🔒 After ${prevBuilt ? prevBuilt.name : 'the previous stop'}`,
      soon: 'Coming soon',
    }[status];
    const badge = { done: '<span class="badge">✓</span>', locked: '<span class="badge">🔒</span>' }[status] || '';
    const tag = stop.href ? 'a' : 'div';
    const href = stop.href ? ` href="${stop.href}"` : '';

    const li = document.createElement('li');
    li.className = `stop-row ${status}`;
    li.dataset.id = stop.id;
    li.innerHTML = `
      <${tag} class="node"${href} aria-label="${stop.name}: ${chip}">
        <span class="icon" aria-hidden="true">${stop.icon}</span>${badge}
      </${tag}>
      <div class="label">
        <h3>${stop.href ? `<a${href} tabindex="-1">${stop.name}</a>` : stop.name}</h3>
        <p>${stop.blurb}</p>
        <span class="chip">${chip}</span>
      </div>`;
    if (status === 'locked') {
      li.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('skipGo').href = stop.href;
        document.getElementById('skip').showModal();
      }));
    }
    document.querySelector(`.stops[data-tier="${stop.tier}"]`).appendChild(li);
  });

  // Continue button + footer progress
  const doneCount = built.filter(s => Progress.isDone(s.id)).length;
  const next = built.find(s => !Progress.isDone(s.id));
  const cont = document.getElementById('continue');
  if (doneCount === 0) { cont.textContent = 'Start the journey →'; cont.href = built[0].href; }
  else if (next) { cont.textContent = `Continue: ${next.name} →`; cont.href = next.href; }
  else { cont.textContent = 'Explore the map ↓'; cont.href = '#map'; }
  document.getElementById('progressText').textContent =
    `You've completed ${doneCount} of ${built.length} stops so far. More are being built.`;

  requestAnimationFrame(drawTrail);
}

function drawTrail() {
  const map = document.getElementById('map');
  const svg = document.getElementById('trail');
  const box = map.getBoundingClientRect();
  const w = map.clientWidth, h = map.scrollHeight;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const rows = [...document.querySelectorAll('.stop-row')];
  const pts = rows.map(r => {
    const b = r.querySelector('.node').getBoundingClientRect();
    return { x: b.left - box.left + b.width / 2, y: b.top - box.top + b.height / 2, id: r.dataset.id };
  });
  let base = '', walked = '';
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], dy = b.y - a.y;
    const seg = `M ${a.x} ${a.y} C ${a.x} ${a.y + dy * .55}, ${b.x} ${b.y - dy * .55}, ${b.x} ${b.y} `;
    base += seg;
    // A segment is "walked" once every built stop up to its end has been completed.
    const upTo = STOPS.slice(0, i + 1).filter(s => s.href);
    const reached = STOPS.slice(0, i).filter(s => s.href).every(s => Progress.isDone(s.id))
      && upTo.length > 0 && Progress.isDone(upTo[0].id);
    if (reached) walked += seg;
  }
  svg.innerHTML = `<path class="base" d="${base}"/><path class="walked" d="${walked}"/>`;
}

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Reset your progress on the map?')) { Progress.reset(); render(); }
});
window.addEventListener('resize', () => requestAnimationFrame(drawTrail));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(drawTrail));
window.addEventListener('pageshow', render); // refresh when coming back from a stop
render();
