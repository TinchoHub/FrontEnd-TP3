/* ==========================================================================
   app.js - Interactions, Accessible Controls & Scenario Simulator
   Proyecto: TP3 · Dos sentencias, dos soluciones · IFTS 29
   Startup: StudyMatch. | Grupo: Grupo 08 (<EquipoDev/>)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDetailsControls();
  initSimulator();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Accessible Details / Summary Helpers
   -------------------------------------------------------------------------- */
function initDetailsControls() {
  const toggleAllBtn = document.getElementById('btn-toggle-all-details');
  if (toggleAllBtn) {
    let allExpanded = false;
    toggleAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      const allDetails = document.querySelectorAll('details.custom-details');
      allDetails.forEach(d => {
        d.open = allExpanded;
      });
      toggleAllBtn.textContent = allExpanded 
        ? 'Colapsar todos los detalles ↑' 
        : 'Expandir todos los detalles ↓';
    });
  }

  // Soporte de navegación por teclado en summaries
  const summaries = document.querySelectorAll('.custom-summary');
  summaries.forEach(summary => {
    summary.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        // Nativo de <summary>, aseguramos aria-expanded si aplica
        const parent = summary.parentElement;
        summary.setAttribute('aria-expanded', !parent.open);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Simulador Interactivo de Flujos Agénticos (Test Scenarios)
   -------------------------------------------------------------------------- */
const scenariosData = {
  r5_success: {
    title: 'R5 · Escenario Exitoso (Consenso Unánime)',
    rule: 'Regla R5 (StudySync Agent)',
    logs: [
      { tag: 'EVENTO', type: 'info', text: 'Propuesta de Encuentro #EM-402 emitida por Usuario A para "Álgebra Lineal".' },
      { tag: 'TOOL', type: 'tool', text: 'Agente consulta StudentsRegistryAPI: 3 de 3 alumnos registran conexión aceptada mutua.' },
      { tag: 'VOTACIÓN', type: 'info', text: 'Parámetros propuestos: [Viernes 18:00 hs | Virtual Discord | 90 min].' },
      { tag: 'EVAL', type: 'eval', text: 'Confirmaciones recibidas: Usuario A (SÍ), Usuario B (SÍ), Usuario C (SÍ).' },
      { tag: 'DECISIÓN', type: 'eval', text: '¿Todos aceptaron conexión Y confirmaron misma fecha, hora y modalidad? -> SÍ (100% Consenso).' },
      { tag: 'TOOL', type: 'tool', text: 'Disparando CalendarIntegrationService: Sala virtual generada y sincronizada.' },
      { tag: 'ACCIÓN', type: 'success', text: 'Estado actualizado en StudyMatch DB: "ACORDADA".' },
      { tag: 'RESULTADO', type: 'success', text: 'Notificaciones push enviadas a los 3 participantes con el enlace y fecha inmutable.' }
    ]
  },
  r5_exception: {
    title: 'R5 · Caso Límite / Excepción (Falta de Consenso)',
    rule: 'Regla R5 (StudySync Agent)',
    logs: [
      { tag: 'EVENTO', type: 'info', text: 'Propuesta de Encuentro #EM-403 emitida para "Base de Datos I".' },
      { tag: 'TOOL', type: 'tool', text: 'StudentsRegistryAPI: Conexión aprobada entre 4 participantes.' },
      { tag: 'VOTACIÓN', type: 'info', text: 'Parámetros propuestos: [Sábado 10:00 hs | Presencial Sede Central].' },
      { tag: 'EVAL', type: 'eval', text: 'Respuestas: Alumno 1 (SÍ), Alumno 2 (SÍ), Alumno 3 (RECHAZO: incompatibilidad horaria), Alumno 4 (SIN RESPUESTA).' },
      { tag: 'DECISIÓN', type: 'eval', text: '¿Todos confirmaron misma terna? -> NO (Falta unanimidad).' },
      { tag: 'REGLA', type: 'warn', text: 'Consecuencia lógica: El sistema NO registra el encuentro como acordado.' },
      { tag: 'SUPUESTO', type: 'warn', text: 'Decisión del Grupo: Monitoreo de ventana de tiempo y pase a intervención humana.' },
      { tag: 'HUMAN', type: 'human', text: 'INTERVENCIÓN HUMANA: Agente notifica al grupo sugiriendo franjas de coincidencia alternativa para renegociación manual.' }
    ]
  },
  r6_success: {
    title: 'R6 · Escenario de Reprogramación Aceptada (Cumple R5)',
    rule: 'Regla R6 (RescheduleGuard Agent)',
    logs: [
      { tag: 'EVENTO', type: 'info', text: 'Encuentro #EM-301 actualmente en estado "ACORDADO" (Versión 1: Martes 19 hs).' },
      { tag: 'SOLICITUD', type: 'info', text: 'Participante Carlos solicita cambio: Nueva Versión 2 [Miércoles 20 hs | Virtual].' },
      { tag: 'CARRIL A', type: 'warn', text: 'ACUERDO ANTERIOR CONSERVADO: La Versión 1 sigue activa y bloqueada en agendas.' },
      { tag: 'CARRIL B', type: 'tool', text: 'NotificationDispatcher: Agente solicita conformidad pendiente a los otros 2 miembros para Versión 2.' },
      { tag: 'EVAL', type: 'eval', text: 'Votos recibidos para Versión 2: Miembro 1 (ACEPTA), Miembro 2 (ACEPTA).' },
      { tag: 'DECISIÓN', type: 'eval', text: '¿Se cumple la regla R5 para la Versión 2? -> SÍ (Todos conformes con la nueva fecha).' },
      { tag: 'REEMPLAZO', type: 'success', text: 'Versión 2 REEMPLAZA formalmente a Versión 1. Reserva previa liberada.' },
      { tag: 'RESULTADO', type: 'success', text: 'Encuentro actualizado a Versión 2 "ACORDADA". Agendas re-sincronizadas con éxito.' }
    ]
  },
  r6_exception: {
    title: 'R6 · Caso Límite / Conflicto (Retención del Acuerdo Previo)',
    rule: 'Regla R6 (RescheduleGuard Agent)',
    logs: [
      { tag: 'EVENTO', type: 'info', text: 'Encuentro #EM-302 "ACORDADO" (Versión 1: Jueves 17 hs presencial).' },
      { tag: 'SOLICITUD', type: 'info', text: 'Participante Elena propone cambiar a: Versión 2 [Viernes 21 hs].' },
      { tag: 'PROTECCIÓN', type: 'warn', text: 'SISTEMA: Mantiene intacta la Versión 1 del Jueves. Sala de estudio sigue reservada.' },
      { tag: 'ESTADO', type: 'info', text: 'Solicitud de conformidad pendiente enviada a los 3 integrantes restantes.' },
      { tag: 'RESPUESTA', type: 'eval', text: '1 integrante rechaza la Versión 2 por superposición de cursada laboral.' },
      { tag: 'DECISIÓN', type: 'eval', text: '¿Se cumple R5 para Versión 2? -> NO (No hubo unanimidad).' },
      { tag: 'REGLA', type: 'warn', text: 'CONSECUENCIA ESTRICTA: Versión 2 NO reemplaza a la Versión 1. El acuerdo anterior se preserva.' },
      { tag: 'HUMAN', type: 'human', text: 'INTERVENCIÓN HUMANA (Supuesto del Grupo): El agente cierra el borrador de cambio y alerta a Elena: "Cambio no aprobado. Tu sesión original del Jueves sigue 100% en pie".' }
    ]
  }
};

function initSimulator() {
  const consoleLog = document.getElementById('sim-console-output');
  const scenarioTitle = document.getElementById('sim-scenario-title');
  const simButtons = document.querySelectorAll('.sim-tab-btn');

  if (!consoleLog) return;

  function runScenario(key) {
    const data = scenariosData[key];
    if (!data) return;

    if (scenarioTitle) {
      scenarioTitle.textContent = `${data.title} — [${data.rule}]`;
    }

    consoleLog.innerHTML = '';
    
    // Animación de salida línea por línea
    data.logs.forEach((item, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'console-line';
        
        let tagClass = 'console-tag';
        if (item.type === 'eval') tagClass += ' tag-eval';
        if (item.type === 'success') tagClass += ' tag-success';
        if (item.type === 'warn') tagClass += ' tag-warn';
        if (item.type === 'human') tagClass += ' tag-human';

        line.innerHTML = `<span class="${tagClass}">[${item.tag}]</span><span class="console-text">${item.text}</span>`;
        consoleLog.appendChild(line);
      }, index * 120);
    });
  }

  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      simButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scenarioKey = btn.getAttribute('data-scenario');
      runScenario(scenarioKey);
    });
  });

  // Correr el primero por defecto
  runScenario('r5_success');
}

/* --------------------------------------------------------------------------
   Smooth Scroll para enlaces internos
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
        // Manejo accesible del foco
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

/* Iteración 4: scrollspy en la navegación y aparición suave de secciones */
(function () {
  const links = [...document.querySelectorAll('.main-nav .nav-link')];
  const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
  if (!('IntersectionObserver' in window)) { document.documentElement.classList.remove('js'); return; }
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { links.forEach(l => l.classList.remove('is-active')); const l = map.get(e.target.id); if (l) l.classList.add('is-active'); }
  }), { rootMargin: '-40% 0px -55% 0px' });
  map.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.sentence-card,.solution-box,.flowchart-wrapper,.team-member-card,.simulator-panel,.rubric-table-wrapper').forEach(el => { el.classList.add('reveal'); rev.observe(el); });
})();
