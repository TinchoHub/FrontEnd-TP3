# 🚀 Trabajo Práctico N.º 3: Dos sentencias, dos soluciones

**Materia:** Desarrollo de Sistemas Web · Front End (Ciclo Lectivo 2026 · 2do Cuatrimestre)  
**Institución:** Instituto de Formación Técnica Superior N.º 29 (IFTS 29)  
**Equipo:** `<EquipoDev/>` (Grupo 08)  
**Startup Asignada:** **StudyMatch.** (Origen: IFTS 16)  
**Bloque Asignado:** **S13-C · Organización y cambios**  
**Docente:** Prof. Luciano Ariel Martinez  
**Fecha de Entrega:** 26/11/2026  

---

## 🌐 Enlaces del Proyecto
* **Landing Page Publicada:** [https://tp3-frontend-grupal-grupo08.vercel.app/](https://tp3-frontend-grupal-grupo08.vercel.app/) *(Accesible públicamente sin sesión)*
* **Repositorio en GitHub:** [https://github.com/LuisUnix2100/tp3-frontend-grupal](https://github.com/LuisUnix2100/tp3-frontend-grupal)

---

## 📑 Índice de Contenidos
1. [Presentación de la Startup Asignada y Contexto](#1-presentación-de-la-startup-asignada-y-contexto)
2. [Desglose Lógico de las Sentencias Asignadas (Bloque S13-C)](#2-desglose-lógico-de-las-sentencias-asignadas-bloque-s13-c)
3. [Propuestas de Solución Agéntica y Diagramas de Flujo](#3-propuestas-de-solución-agéntica-y-diagramas-de-flujo)
4. [Integrantes del Grupo y Aportes Individuales](#4-integrantes-del-grupo-y-aportes-individuales)
5. [Revisión Colaborativa y Mejora Concreta (Nivel Propone)](#5-revisión-colaborativa-y-mejora-concreta-nivel-propone)
6. [Registro del Proceso de Construcción 100% Agéntico con IA](#6-registro-del-proceso-de-construcción-100-agéntico-con-ia)
7. [Guía de Reproducción y Verificación Local](#7-guía-de-reproducción-y-verificación-local)
8. [Autoevaluación según Rúbrica Oficial](#8-autoevaluación-según-rúbrica-oficial)

---

## 1. Presentación de la Startup Asignada y Contexto

* **Nombre de la Startup:** **StudyMatch.**
* **Logo Oficial:** Incluido y exhibido de forma nítida y completa (`assets/S13.webp`, archivo original del sorteo docente).
* **Rubro:** Educación y colaboración académica.
* **Objetivo de la Startup:** Red social y colaborativa que conecta a estudiantes de nivel superior según materias en común, intereses académicos, necesidades de estudio y franjas horarias de disponibilidad.
* **Problemática que Resuelve:** La coordinación manual de grupos de estudio suele generar fricción comunicacional: largas cadenas de mensajes en chats grupales, superposiciones de horarios, incertidumbre sobre la modalidad (presencial vs. virtual) y desarticulación del grupo cuando un solo integrante propone reprogramar una fecha previamente fijada.
* **Reconocimiento Institucional (IFTS 16 ➔ IFTS 29):** Las condiciones operativas y las reglas del negocio de StudyMatch. fueron diseñadas y modeladas formalmente mediante lógica proposicional por estudiantes del **IFTS 16**. Nuestro equipo en el **IFTS 29** recibe este material como punto de partida para diseñar la comunicación visual, los flujos agénticos de solución y la experiencia de usuario interactiva en la web.

---

## 2. Desglose Lógico de las Sentencias Asignadas (Bloque S13-C)

### Sentencia 1 · Regla R5
> **Redacción Original:**  
> *“Si todas las personas participantes aceptaron la conexión y confirman la misma fecha, horario y modalidad para la versión vigente de una propuesta, el sistema registra esa versión del encuentro como acordada.”*

* **Datos Necesarios (Inputs):** Identificador de la propuesta de encuentro, listado de participantes, estado de aceptación de conexión mutua entre todos, y registros de confirmación individual de fecha, horario y modalidad.
* **Condición Lógica:** Conjunción unánime:  
  $$\forall p \in Participantes: (ConexionAceptada(p) \land Confirma(p, Fecha, Horario, Modalidad))$$
* **Consecuencia Estricta:** El sistema registra atómicamente esa versión del encuentro en estado **"Acordada"**.
* **Supuestos Agregados por el Grupo:** Monitoreo de tiempo límite de votación, generación automática de sala virtual/reserva física e intervención humana si hay rechazo o falta de respuesta.

### Sentencia 2 · Regla R6
> **Redacción Original:**  
> *“Si alguien propone cambiar un encuentro acordado y todavía no todas las personas aceptaron esa nueva versión, el sistema solicita la conformidad pendiente y conserva el acuerdo anterior; la nueva versión solo reemplaza a la anterior cuando se cumple R5.”*

* **Datos Necesarios (Inputs):** ID del encuentro ya acordado (Versión $N$), payload del participante solicitante con los nuevos parámetros (Versión $N+1$), y estado de conformidades recibidas de los demás participantes.
* **Condición Lógica:** Encuentro en estado Acordado $\land$ Existe solicitud de cambio $\land$ $\exists p \in Participantes: \neg AceptoNuevaVersion(p)$.
* **Consecuencia Estricta:** El sistema solicita la conformidad pendiente a los restantes miembros Y **conserva inmutable el acuerdo anterior (Versión $N$)**. La Versión $N+1$ **únicamente reemplaza** a la Versión $N$ cuando cumple todas las condiciones de la regla **R5**.
* **Supuestos Agregados por el Grupo:** Implementación del *Carril Dual de Versiones* y ventana crítica de seguridad (a menos de 2 horas del horario original, si no hay consenso total, se desestima la nueva versión para garantizar la realización del encuentro original).

---

## 3. Propuestas de Solución Agéntica y Diagramas de Flujo

### Propuesta 1 (Regla R5): StudySync Agent · Conciliación Automática de Agenda y Consenso Unánime
* **Beneficio Principal:** Reduce a cero los tiempos muertos de coordinación de sesiones de estudio al centralizar las confirmaciones individuales de forma asincrónica. Garantiza que ningún encuentro se confirme sin la aprobación unánime de fecha, horario y modalidad de todos los miembros conectados. Brinda certeza total tanto a estudiantes presenciales como virtuales, reservando automáticamente el espacio una vez alcanzado el acuerdo.
* **Qué hace el Agente:** Recibe la propuesta, consulta el padrón de conexiones y monitorea la votación en tiempo real. Cuando se verifica el 100% de coincidencia, cambia el estado a "Acordada" y sincroniza los calendarios.
* **Herramientas que Consulta:**
  * `StudentsRegistryAPI`: Valida conexiones mutuas aceptadas.
  * `ScheduleConsensusTool`: Audita los votos de fecha, hora y modalidad.
  * `CalendarIntegrationService`: Genera la sala virtual (ej. Google Meet/Discord) o reserva el aula física.
* **Intervención Humana (Caso Límite / Excepción - Nivel Propone):** Si un estudiante manifiesta incompatibilidad o transcurren 48 horas sin respuesta, el agente no fuerza el acuerdo ni cancela arbitrariamente: presenta a los participantes las franjas horarias con mayor solapamiento de disponibilidad para que una persona redefina manualmente la propuesta.

### Propuesta 2 (Regla R6): RescheduleGuard Agent · Control de Versiones de Encuentros y Transición No Destructiva
* **Beneficio Principal:** Protege la estabilidad del grupo de estudio frente a pedidos imprevistos de reprogramación, evitando que una sesión confirmada quede en el limbo. Gestiona de manera no disruptiva la votación de la nueva propuesta mientras blinda y mantiene vigente el encuentro ya pactado hasta alcanzar la unanimidad requerida por R5. Provee trazabilidad total entre versiones de agenda y previene cancelaciones accidentales o unilaterales.
* **Qué hace el Agente:** Administra un flujo dual: mantiene la Versión $N$ original activa y calendarizada, mientras emite solicitudes de conformidad push/email para la Versión $N+1$. Solo cuando R5 se satisface por completo sobre la Versión $N+1$, ejecuta el reemplazo atómico.
* **Herramientas que Consulta:**
  * `VersionedMeetingStore`: Administra versiones activas ($N$) y borradores concurrentes ($N+1$).
  * `NotificationDispatcher`: Emite notificaciones con botones accionables de 1 clic para aprobar/rechazar.
  * `ConflictResolverTool`: Monitorea plazos críticos de anticipación.
* **Intervención Humana (Caso Límite / Conflicto - Nivel Propone):** Si un integrante rechaza la nueva propuesta o faltan menos de 2 horas para el inicio pactado en la Versión $N$ y la Versión $N+1$ sigue incompleta, el agente aborta automáticamente el borrador de cambio, ratifica la vigencia inmutable de la Versión $N$ y alerta a los estudiantes para asegurar que nadie falte al encuentro.

---

## 4. Integrantes del Grupo y Aportes Individuales

| Integrante | Usuario de GitHub | Rol en el Proyecto | Aporte Concreto al TP3 |
| :--- | :--- | :--- | :--- |
| **Martina Bistagnino** | [@Martina-bistagnino](https://github.com/Martina-bistagnino) | UX/UI & Accesibilidad | Diseño de la paleta institucional de StudyMatch., tokens de diseño CSS, accesibilidad semántica (`<details>` y `<summary>` con teclado), contraste de colores y legibilidad en desktop. |
| **Gabriela Dalila Contrera** | [@DalilaContrera](https://github.com/DalilaContrera) | Lógica Proposicional & Datos | Desarme formal de las sentencias R5 y R6, análisis de operadores lógicos (unanimidad, conjunciones), definición de inputs/outputs y formulación de los casos de prueba positivos y negativos. |
| **Jorge Gabriel Caliz** | [@JorgeGabrielCaliz](https://github.com/JorgeGabrielCaliz) | Documentación & Bitácora IA | Redacción de la documentación técnica en este README, registro exhaustivo de prompts, aplicaciones y modelos de IA, y fundamentación de los criterios de la rúbrica oficial. |
| **Francisco Luis Bronzi** | [@LuisUnix2100](https://github.com/LuisUnix2100) | Arquitectura Web & Rendimiento | Estructuración semántica en HTML5, modularización de las hojas de estilo (`styles.css`, `flowcharts.css`, `components.css`), optimización de assets (`S13.webp`) y script de consola interactiva. |
| **Martín Roige** | [@TinchoHub](https://github.com/TinchoHub) | Coordinación & Flujos Agénticos | Dirección y coordinación de las instrucciones entregadas a la IA, modelado técnico y visual de los dos diagramas de flujo agénticos, testing integral en desktop y validación de las sentencias. |

---

## 5. Revisión Colaborativa y Mejora Concreta (Nivel Propone)

En cumplimiento con el criterio de excelencia de la rúbrica oficial (*"documentan una revisión entre integrantes y una mejora concreta surgida de esa colaboración"*):

* **Problema Detectado en la Revisión Interna:**  
  Durante la sesión de revisión entre Martina, Jorge y Martín, se analizó el primer borrador de la solución para la regla R6. Martina advirtió que la representación gráfica inicial resultaba ambigua respecto a la vigencia del acuerdo anterior: un usuario desprevenido podía interpretar que al proponer un cambio, la reunión pactada previamente quedaba cancelada de inmediato o en estado de suspensión temporal en el calendario.
* **Mejora Concreta Implementada:**  
  A partir de esta observación, el equipo diseñó formalmente la arquitectura de **"Carril Dual de Versiones"**:
  1. En el diagrama gráfico del Flujo 2 se separó visualmente el estado del sistema en dos carriles paralelos: el **Carril A (Protegido)**, que mantiene activa y bloqueada la Versión $N$ acordada, y el **Carril B (Borrador en Votación)**, donde corre la solicitud de la Versión $N+1$.
  2. Se incorporó en la landing un **Simulador Interactivo de Consola** (Sección 05) que permite a los evaluadores ejecutar el caso de éxito y el caso límite de conflicto, verificando cómo el sistema protege la Versión $N$ hasta que se cumpla R5 de manera fehaciente.

---

## 6. Registro del Proceso de Construcción 100% Agéntico con IA

El desafío central de este Trabajo Práctico consistió en **no editar código manualmente**, dirigiendo al agente mediante instrucciones iterativas, análisis crítico de las respuestas y pedidos de ajuste sucesivos.

### Ficha Técnica de las Herramientas
* **Entorno de Trabajo / Aplicación 1:** **Antigravity IDE** (Google DeepMind) · **Modelo:** **Gemini 3.8 Flash (High)** *(reportado exactamente como figura en el selector del entorno)*.
* **Entorno de Trabajo / Aplicación 2:** **Claude** (claude.ai) · **Modelo:** **[COMPLETAR MODELO DE CLAUDE]**.

### Ciclo de Iteración Documentado
1. **Iteración 1 — Enunciado y Desarme Lógico:**
   * *Instrucción inicial:* Se le entregó al agente la consigna completa (`TP3 · Dos sentencias, dos soluciones · IFTS 29.html`), se le especificó la asignación docente del **Grupo 08 (StudyMatch., bloque S13-C, sentencias R5 y R6)** y se solicitó la descomposición lógica rigurosa (entradas, condiciones, consecuencias) respetando la redacción original.
   * *Resultado:* El agente identificó correctamente las fórmulas de lógica proposicional y propuso los conceptos de *StudySync Agent* y *RescheduleGuard Agent*.
2. **Iteración 2 — Modelado Gráfico y Detección de Ambigüedad en R6:**
   * *Problema detectado:* El primer diagrama generado para R6 mostraba una transición lineal que no distinguía claramente que el acuerdo anterior sigue vivo mientras se vota la nueva propuesta.
   * *Pedido de mejora:* Se le instruyó al agente modificar la estructura visual para crear un carril dual de versiones, incorporar etiquetas que distingan lo que proviene de la sentencia vs. supuestos del grupo, y modelar el caso límite con intervención humana cuando hay rechazo de un participante.
   * *Resultado:* El agente rediseñó el diagrama en `flowcharts.css`, agregando los bloques de estado protegido e intervención humana.
3. **Iteración 3 — Accesibilidad, Simulador y Verificación Desktop:**
   * *Pedido de mejora:* Se solicitó la creación de un simulador interactivo en JavaScript puro para recorrer los 4 escenarios de prueba (éxito y excepción de R5 y R6), botones accesibles para expandir/colapsar desplegables con soporte de teclado, y optimización de layout en desktop para asegurar cero desbordes horizontales.
   * *Resultado:* Se crearon `js/app.js` y `components.css`, completando una interfaz fluida, accesible y navegable.

4. **Iteración 4 — Pulido gráfico y carril dual real (herramienta adicional):**
   * *Aplicación / modelo:* Claude (claude.ai) · modelo **[COMPLETAR MODELO DE CLAUDE]**.
   * *Problema detectado:* el diagrama de R6 era lineal: no mostraba el «Carril Dual de Versiones» que describe la sección 5; el hero no tenía gráfico y los diagramas no tenían conectores en codo.
   * *Pedido de mejora:* rehacer el diagrama de R6 con dos carriles (A: Versión N protegida · B: Versión N+1 en votación), sumar una ilustración SVG en el hero, numerar pasos y mejorar conectores, resaltar la sección activa en la navegación y aparición suave de secciones; todo sin librerías.
   * *Resultado:* nuevo `css/mejoras.css`, SVG inline en el hero, diagrama R6 en carriles y un bloque al final de `js/app.js` (scrollspy y reveal, respetando `prefers-reduced-motion`).

---

## 7. Guía de Reproducción y Verificación Local

El proyecto fue desarrollado con tecnologías web estándar modernas (HTML5 semántico, CSS3 modular y JavaScript Vanilla ES6+), por lo que **no requiere instalación previa de paquetes pesados ni procesos de transpilación**.

### Pasos para Ejecutar Localmente:
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/LuisUnix2100/tp3-frontend-grupal.git
   cd tp3-frontend-grupal
   ```
2. Opción A — Abrir directamente:
   * Hacer doble clic en el archivo `index.html` para abrirlo en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
3. Opción B — Servidor local con Node.js / npx:
   ```bash
   npx serve .
   ```
   Abrir la URL indicada (usualmente `http://localhost:3000`).

### Puntos de Comprobación en Desktop:
* [x] **Lectura y Jerarquía:** La tipografía Inter y JetBrains Mono cargan correctamente con alto contraste y sin desbordes.
* [x] **Logo de StudyMatch.:** El logo original (`S13.webp`) se visualiza completo, nítido y con dimensiones de 220x220 px.
* [x] **Desplegables Accesibles:** Los bloques `<details>` de R5 y R6 se abren y cierran con clic y con las teclas `Enter` o `Espacio`.
* [x] **Simulador Interactivo:** Las 4 pestañas del simulador ejecutan los logs en tiempo real demostrando el cumplimiento lógico y la derivación humana.

---

## 8. Autoevaluación según Rúbrica Oficial

| Criterio | Nivel Cumple | Nivel Propone (Nuestro Proyecto) | Justificación del Nivel Alcanzado |
| :--- | :--- | :--- | :--- |
| **01 · Participación del Grupo** | Todos participan y registran aportes en el README. | Documentan una revisión entre integrantes y una mejora concreta surgida de esa colaboración. | **Propone:** Se documenta la revisión entre Martina, Jorge y Martín, dando origen al *Carril Dual de Versiones* y al simulador de pruebas. |
| **02 · Repositorio y Landing** | Repositorio y sitio accesibles sin sesión; README con enlaces. | El README permite reproducir el proyecto e incluye comprobación clara de enlaces y funcionamiento. | **Propone:** Guía de ejecución local con `npx serve`, validación paso a paso y despliegue público en Vercel y GitHub. |
| **03 · Landing según Consigna** | Presenta startup, logo, sentencias, propuestas y desplegables funcionales en desktop. | Organiza la información con especial claridad y agrega recursos de navegación que ayudan a comprender la propuesta. | **Propone:** Barra sticky accesible, tokens de diseño CSS, botón de toggle global de detalles y simulador dinámico en tiempo real. |
| **04 · Dos Flujos Agénticos** | Dos diagramas legibles con datos, decisiones, acciones y resultados; distingue supuestos agregados. | Explica un caso límite o excepción en cada flujo y muestra cómo se resolvería, incluyendo intervención humana. | **Propone:** Se modelan casos límite en R5 (incompatibilidad/demora) y R6 (rechazo/ventana crítica de 2 hs) con derivación a personas. |
| **05 · Herramientas de IA** | Identifica aplicación y modelo, usos y aportes; describe la construcción agéntica. | Presenta evidencia documentada de iteración: instrucción inicial, problema detectado, pedido de mejora y cambios. | **Propone:** Detalle de 4 ciclos de iteración alternando Antigravity IDE (Gemini 3.8 Flash High) y Claude ([COMPLETAR MODELO DE CLAUDE]), explicando el razonamiento de cada corrección y pulido visual. |

---

*Desarrollado con dedicación y rigurosidad técnica por `<EquipoDev/>` — IFTS 29.*
