/* Opción C: barra de progreso y recorrido interactivo de los diagramas (sin librerías) */
(function () {
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.prepend(bar);
  addEventListener('scroll', () => { const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%'; }, { passive: true });

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Índices de .flow-node en orden de DOM; R6: A1,B1,A2,B2,decisión,NO,SÍ
  const flows = [
    { sel: '#solucion-r5 .flow-diagram', yes: [0, 1, 2, 3, 4], no: [0, 1, 2, 5, 6] },
    { sel: '#solucion-r6 .lanes', yes: [1, 0, 2, 3, 4, 6], no: [1, 0, 2, 3, 4, 5] }
  ];
  flows.forEach(f => {
    const d = document.querySelector(f.sel); if (!d) return;
    const nodes = [...d.querySelectorAll('.flow-node')];
    const bar2 = document.createElement('div'); bar2.className = 'flow-player';
    bar2.innerHTML = '<div class="seg" role="group" aria-label="Caso a recorrer"><button type="button" data-v="yes" aria-pressed="true">Cumple la condición · SÍ</button><button type="button" data-v="no" aria-pressed="false">No cumple · NO</button></div><button type="button" class="play">▶ Recorrer flujo</button><button type="button" class="reset">Reiniciar</button><p class="status" aria-live="polite">Elegí un caso y presioná «Recorrer flujo».</p>';
    d.parentNode.insertBefore(bar2, d);
    const status = bar2.querySelector('.status'); let v = 'yes', timer;
    const reset = msg => { clearTimeout(timer); d.classList.remove('playing'); nodes.forEach(n => n.classList.remove('on', 'done')); status.textContent = msg || 'Elegí un caso y presioná «Recorrer flujo».'; };
    const title = n => n.querySelector('.flow-node-title').textContent.trim();
    const step = i => {
      const path = f[v]; nodes.forEach(n => n.classList.remove('on'));
      for (let k = 0; k < i; k++) nodes[path[k]].classList.add('done');
      if (i >= path.length) { status.textContent = 'Fin del recorrido: ' + title(nodes[path[path.length - 1]]); return; }
      nodes[path[i]].classList.add('on'); nodes[path[i]].scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      status.textContent = 'Paso ' + (i + 1) + ' de ' + path.length + ': ' + title(nodes[path[i]]);
      timer = setTimeout(() => step(i + 1), 1300);
    };
    bar2.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => {
      v = b.dataset.v; bar2.querySelectorAll('[data-v]').forEach(x => x.setAttribute('aria-pressed', x === b)); reset();
    }));
    bar2.querySelector('.play').addEventListener('click', () => { reset(); d.classList.add('playing'); if (reduce) { f[v].forEach(i => nodes[i].classList.add('done')); status.textContent = 'Recorrido completo (animación reducida).'; } else step(0); });
    bar2.querySelector('.reset').addEventListener('click', () => reset());
  });
})();
