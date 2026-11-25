/* Opción D: cielo estrellado con parpadeo, estrellas fugaces y constelación que sigue al cursor (canvas, sin librerías) */
(function () {
  const c = document.createElement('canvas'); c.id = 'cielo'; c.setAttribute('aria-hidden', 'true'); document.body.prepend(c);
  const x = c.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, stars = [], shoot = null, mx = -999, my = -999, next = 4000;
  function size() {
    W = c.width = innerWidth; H = c.height = innerHeight;
    stars = Array.from({ length: Math.round(W * H / 6500) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .25, p: Math.random() * 6.28, s: Math.random() * .0025 + .0008, d: Math.random() * .6 + .1, g: Math.random() < .15 }));
  }
  function draw(t) {
    x.clearRect(0, 0, W, H);
    const sy = scrollY, near = [];
    for (const s of stars) {
      const yy = ((s.y - sy * s.d * .25) % H + H) % H, a = .45 + .55 * Math.sin(s.p + t * s.s);
      x.globalAlpha = a; x.fillStyle = s.g ? '#ffd479' : '#eaf2ff';
      x.beginPath(); x.arc(s.x, yy, s.r, 0, 6.283); x.fill();
      if (Math.hypot(s.x - mx, yy - my) < 130) near.push([s.x, yy]);
    }
    x.lineWidth = .8; x.strokeStyle = '#9cc7ff';
    near.forEach(([a, b]) => { x.globalAlpha = .35; x.beginPath(); x.moveTo(mx, my); x.lineTo(a, b); x.stroke(); });
    for (let i = 0; i < near.length - 1; i++) { x.globalAlpha = .18; x.beginPath(); x.moveTo(near[i][0], near[i][1]); x.lineTo(near[i + 1][0], near[i + 1][1]); x.stroke(); }
    if (!shoot && t > next) { shoot = { x: Math.random() * W * .8, y: Math.random() * H * .4, l: 0 }; next = t + 6000 + Math.random() * 6000; }
    if (shoot) {
      shoot.l += 14; const g = x.createLinearGradient(shoot.x + shoot.l, shoot.y + shoot.l * .45, shoot.x + shoot.l - 90, shoot.y + (shoot.l - 90) * .45);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.globalAlpha = 1; x.strokeStyle = g; x.lineWidth = 1.6; x.beginPath(); x.moveTo(shoot.x + shoot.l, shoot.y + shoot.l * .45); x.lineTo(shoot.x + shoot.l - 90, shoot.y + (shoot.l - 90) * .45); x.stroke();
      if (shoot.l > 700) shoot = null;
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); addEventListener('resize', () => { size(); if (reduce) draw(0); });
  if (!reduce) { addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true }); requestAnimationFrame(draw); } else draw(0);
})();
