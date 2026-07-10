# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Pendiente
- Modo offline completo (Service Worker)
- Exportación a PDF de la Memoria de Cálculo
- Comparador de boyas múltiples

## [1.3.0] - 2026-07-09

### Añadido
- **Pestaña 5: Pitch Shark Tank** — Guion estructurado en 6 segmentos temporales con Web Speech API y barra de progreso animada.
- **Pestaña 6: Escenarios** — Comparativa de 4 escenarios operativos (Calma / Oleaje Normal / Tormenta / Huracán) con canvas animado y tabla comparativa.
- **Pestaña 7: Tutor IA** — Solver estilo MathosAI con 10 pasos secuenciales, barra de progreso y KaTeX.
- **Pestaña 8: GeoJSON & SIG** — Generador de capas GeoJSON con coordenadas reales, descarga .geojson/.csv y botón "Abrir en GeoJSON.io".
- **Pestaña 9: Memoria de Cálculo** — Documento técnico en 3 partes con tablas de datos, fórmulas y protocolo de seguridad.
- Indicador de seguridad en tiempo real en el Simulador 3D.
- Animación continua del agua con oleaje dinámico.

### Cambiado
- Refactorización del sistema de navegación por pestañas.
- Mejora del diseño responsivo para móviles.

## [1.2.0] - 2026-07-09

### Añadido
- Adaptación al tema "Radio de Borneo y Área de Seguridad en Anclajes de Boyas Marítimas Offshore".
- Modelo físico: r = √(L² - h²).
- Análisis de área de solapamiento mediante segmento circular.
- Cálculo de radio crítico y longitud máxima de cadena.

### Cambiado
- Reemplazo del tema "Órbitas de Kepler" por "Radio de Borneo".
- Escena 3D: sol + planeta → boya + cadena + ancla + océano.

## [1.1.0] - 2026-07-09

### Añadido
- Integración de GeoGebra mediante script local `geogebra-deploy.js`.
- Panel de comandos rápidos copiables.
- Editor Python interactivo con consola virtual y canvas matplotlib simulado.

## [1.0.0] - 2026-07-09

### Añadido
- Lanzamiento inicial del proyecto.
- Simulador 3D con Three.js, lil-gui, Stats.js.
- Grabador de video WebM con MediaRecorder API.
- Narrador por voz con Web Speech API.
- Pizarra Canvas con paleta de tizas.
- Solucionador matemático por pasos con KaTeX.
- Editor de ecuaciones con MathLive.
- Diseño premium "Space-Deep Ocean" con tipografías Orbitron e Inter.
