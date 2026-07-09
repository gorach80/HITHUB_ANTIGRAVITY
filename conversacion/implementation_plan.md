# Plan de Implementación: Editor de Python e Interactividad Avanzada (Voz y Pasos)

Este plan detalla el diseño y la implementación para incorporar el **Editor de Python Interactivo** como cuarta pestaña en la plataforma local, agregar la **síntesis de voz didáctica** (Web Speech API) y estructurar las fórmulas de la pizarra en un formato de **resolución paso a paso** estilo solucionador científico premium.

---

## Cambios Propuestos

### 1. Estructura y Vistas (HTML)
#### [MODIFY] [index.html](file:///C:/Users/luisa/.gemini/antigravity/scratch/proyecto-web/index.html)
*   **Nueva Pestaña:** Añadir el botón `btn-tab-python` en la cabecera con el icono `<i class="fa-brands fa-python"></i> Editor Python`.
*   **Estructura de Pasos (Pestaña Pizarra):** Incorporar debajo de la pizarra una sección de "Resolución del Problema Paso a Paso" para el cálculo del área y perímetro del **Rotor de Reuleaux**, dividida en tarjetas estructuradas (`math-step`).
*   **Narrador por Voz:** Añadir un widget flotante o botón en el simulador 3D para activar/detener la narración explicativa del volumen del rotor.
*   **Cuarto Panel (`tab-python-content`):**
    *   **Lado Izquierdo (Editor):** Textarea con código Python precargado, numeración simulada de líneas y botones: *Ejecutar Script*, *Copiar Código* y *Restablecer*.
    *   **Lado Derecho (Visualización):** Terminal virtual interactiva (`pyConsole`) y un lienzo gráfico (`matplotCanvas`) simulando matplotlib.

---

### 2. Estilos Visuales (CSS)
#### [MODIFY] [style.css](file:///C:/Users/luisa/.gemini/antigravity/scratch/proyecto-web/style.css)
*   **Contenedor del IDE:** Estilos para simular un editor de código oscuro, con cabecera de pestañas/nombre de archivo y botones de consola verdes/rojos.
*   **Terminal Virtual:** Tipografía monospace, barra de desplazamiento personalizada e indicador de comandos `▶`.
*   **Tarjetas de Pasos:** Diseño de solucionador matemático con bordes de realce en azul/turquesa y numeraciones de pasos en badges degradados.
*   **Widget de Audio/Voz:** Controles para la narración por voz, incluyendo efectos de parpadeo cuando la voz está activa.

---

### 3. Lógica y Motores de Simulación (JS)
#### [MODIFY] [app.js](file:///C:/Users/luisa/.gemini/antigravity/scratch/proyecto-web/app.js)
*   **Intérprete Python (Simulado):** 
    *   Leerá los valores ingresados en el textarea (ancho `w`, factor `f`).
    *   Simulará la función `print()` imprimiendo líneas con estilo de terminal: `Área del Rotor`, `Perímetro`, `Volumen`, etc.
    *   Dibujará dinámicamente en el `matplotCanvas` el gráfico del rotor de Reuleaux y una comparativa de barras según los parámetros del editor.
*   **Narrador por Voz:** 
    *   Uso de `window.speechSynthesis` y `SpeechSynthesisUtterance` en español (`es-ES`).
    *   Lectura guiada de los conceptos físicos de la plataforma (Calado, Altura Metacéntrica y el Rotor de Reuleaux).
*   **Control de Navegación:** Añadir listeners para la nueva pestaña en el gestor de tabs principal.

---

## Plan de Verificación

### Pruebas Manuales
1.  **Tab Switching:** Validar que al cambiar a la pestaña "Editor Python", se desactiven las otras y cargue el espacio de trabajo de desarrollo.
2.  **Ejecución de Python:** Modificar el valor de `w` en el editor de código, hacer clic en "Ejecutar Script" y comprobar que:
    *   Los cálculos en la consola virtual se actualicen con el nuevo valor.
    *   El Canvas del gráfico de matplotlib se dibuje en pantalla mostrando el rotor redimensionado.
3.  **Narrador por Voz:** Activar el botón de voz y comprobar la salida de audio de la explicación didáctica, así como el correcto cambio de icono a Pausa/Stop.
4.  **Estructura de Pasos:** Comprobar la visualización responsiva de las tarjetas de fórmulas KaTeX en la pizarra.
