Eres un Agente Autónomo de Desarrollo Web. Tu objetivo es crear e instalar localmente desde cero un proyecto web científico interactivo premium bajo el tema: "Órbitas de Kepler y Gravitación Universal". 

Debes estructurar, codificar y dejar listo el proyecto para correr localmente. Sigue las fases de desarrollo descritas a continuación utilizando tus herramientas de terminal, creación de archivos e instalación:

---

### FASE 1: INICIALIZACIÓN Y DEPENDENCIAS
1. Crea un directorio de proyecto llamado "orbita-interactiva".
2. Inicializa un proyecto de Node.js (`npm init -y`).
3. Instala localmente todas las librerías necesarias mediante npm para que el proyecto corra 100% de manera local:
   * Gráficos 3D: `npm install three lil-gui stats.js`
   * Matemáticas y fórmulas: `npm install katex mathlive`
   * Iconografía: `npm install @fortawesome/fontawesome-free`
4. Descarga el script de despliegue de GeoGebra mediante un comando curl o similar y guárdalo localmente:
   * URL: `https://www.geogebra.org/apps/deployggb.js`
   * Destino: `orbita-interactiva/geogebra-deploy.js`

---

### FASE 2: DESARROLLO DEL FRONTEND PREMIUM
Crea los archivos `index.html`, `style.css` y `app.js` dentro del directorio con un diseño ultra premium (interfaz oscura "Space-Deep Ocean", tipografías Orbitron e Inter, sombras de neón en turquesa y violeta, y diseño responsivo). Implementa una navegación por pestañas (tabs) que incluya:

1. **Pestaña 1: Simulador 3D (Three.js) y Lección por Voz:**
   * Simulación 3D del tema (ej. El Sol brillante en el centro y la Tierra orbitando en elipse con su vector de velocidad).
   * Panel lil-gui para cambiar variables físicas (Masa del sol, velocidad de rotación, excentricidad, color del planeta y activar malla).
   * Monitor de FPS (Stats.js).
   * Grabador de video integrado que capture el stream del Canvas de Three.js y permita descargar la simulación en formato WebM.
   * Narrador por Voz (Web Speech API) con botón de Play/Stop y onda de sonido CSS que explique los conceptos de la gravedad y las órbitas en español.
   * Renderizado de la fórmula de la Tercera Ley de Kepler usando KaTeX local.

2. **Pestaña 2: Pizarra y Solucionador por Pasos:**
   * Pizarra escolar oscura (Canvas) para dibujar libremente, con paleta de colores de tiza, selector de grosor, botón para limpiar pizarra y botón para guardar en PNG.
   * Editor de ecuaciones virtual usando Mathfield de MathLive.
   * Solucionador estructurado en 3 pasos (estilo MathGPTPro) que deduzca las ecuaciones de la fuerza gravitatoria y la velocidad de escape paso a paso con bloques de fórmulas KaTeX.

3. **Pestaña 3: GeoGebra Integrado:**
   * Inyecta la suite interactiva de GeoGebra utilizando el script local `geogebra-deploy.js`.
   * Agrega un panel lateral de comandos rápidos listos para copiar con un clic (ej. 'a=2', 'b=1.5', 'Elipse[(0,0), (a,0), b]') para que el usuario los pegue en el campo de entrada de GeoGebra.

4. **Pestaña 4: Editor Python Interactivo (IDE simulado):**
   * Editor de código en textarea con numeración de líneas simulada y script didáctico de simulación física orbital en Python.
   * Consola/Terminal virtual que intercepte y emule la ejecución de print() de Python con marcas de tiempo al pulsar "Ejecutar Script".
   * Lienzo de gráficos (Canvas) que dibuje la elipse orbital y un gráfico de barras comparativo simulando matplotlib según el valor del semieje mayor 'a' que modifique el usuario en el editor.
   * Botón para copiar código y botón para restablecer el script.

---

### FASE 3: VERIFICACIÓN
1. Instala una dependencia de servidor local ligero en el proyecto (ej. `npm install -D live-server` o similar).
2. Agrega un script de ejecución en el `package.json` para levantar el servidor.
3. Levanta el servidor local de desarrollo y proporciona la URL local (generalmente `http://127.0.0.1:8080`) para que pueda interactuar con la plataforma terminada.

Procede con la ejecución y avísame cuando hayas completado cada fase.