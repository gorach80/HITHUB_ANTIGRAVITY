<div align="center">

# 🌊 Radio de Borneo y Área de Seguridad

### Laboratorio Científico Interactivo — Anclajes de Boyas Marítimas Offshore

**Puerto de La Libertad · Operaciones de Transferencia de Hidrocarburos**

[![Deploy to GitHub Pages](https://github.com/gorach80/radio-borneo/actions/workflows/deploy.yml/badge.svg)](https://github.com/gorach80/radio-borneo/actions/workflows/deploy.yml)
[![CI](https://github.com/gorach80/radio-borneo/actions/workflows/ci.yml/badge.svg)](https://github.com/gorach80/radio-borneo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r185-black.svg)](https://threejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📖 Descripción

Plataforma educativa interactiva que modela geométricamente el **radio de Borneo** de boyas marítimas offshore y su relación con la zona de exclusión portuaria, aplicando teoremas clásicos de la geometría plana euclidiana al diseño de operaciones seguras de transferencia de hidrocarburos.

> **Pregunta central:** *¿Cuál es la razón métrica del área de solapamiento crítica entre el círculo de Borneo y la zona de exclusión rectangular, y cómo se calcula el radio del círculo de Borneo mínimo para evitar la colisión de buques cisterna?*

### Fórmulas clave

| Concepto | Fórmula |
|----------|---------|
| **Radio de Borneo** | `r = √(L² - h²)` |
| **Área de solapamiento** | `A = r²·arccos(D/r) − D·√(r² − D²)` |
| **Razón métrica** | `η = A / (π·r²)` |
| **Radio crítico** | `r_crít = D` |
| **Longitud máx. cadena** | `L_max = √(h² + D²)` |

---

## ✨ Características

El proyecto cuenta con **9 pestañas interactivas**:

| # | Pestaña | Descripción |
|---|---------|-------------|
| 1 | 🌊 **Simulador 3D** | Three.js + lil-gui + Stats.js + grabador WebM + narrador por voz |
| 2 | 📋 **Pizarra & Solver** | Canvas para dibujo + MathLive + Solver KaTeX por pasos |
| 3 | 📐 **GeoGebra** | Suite integrada con comandos rápidos copiables |
| 4 | 🐍 **IDE Python** | Editor + consola virtual + canvas matplotlib simulado |
| 5 | 🎤 **Pitch Shark Tank** | Guion oral estructurado en 6 segmentos con Web Speech API |
| 6 | ⛈️ **Escenarios** | Comparativa Calma/Oleaje/Tormenta/Huracán con canvas animado |
| 7 | 🤖 **Tutor IA** | Solver MathosAI-style con 10 pasos y KaTeX |
| 8 | 🗺️ **GeoJSON & SIG** | Generador de capas GeoJSON reales + descarga .geojson/.csv |
| 9 | 📄 **Memoria de Cálculo** | Documento técnico imprimible en 3 partes |

---

## 🚀 Demo en vivo

Una vez activado GitHub Pages, el sitio estará disponible en:

**🔗 https://gorach80.github.io/radio-borneo/**

> Reemplaza `gorach80` con tu usuario de GitHub si haces fork.

---

## 🛠️ Stack tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Gráficos 3D** | [Three.js](https://threejs.org/) r185 |
| **UI de control** | [lil-gui](https://lil-gui.georgealways.com/) |
| **FPS monitor** | [stats.js](https://github.com/mrdoob/stats.js) |
| **Matemáticas** | [KaTeX](https://katex.org/) |
| **Editor ecuaciones** | [MathLive](https://mathlive.io/) |
| **Iconografía** | [Font Awesome](https://fontawesome.com/) |
| **Geometría dinámica** | [GeoGebra](https://www.geogebra.org/) |
| **Voz** | Web Speech API (nativa del navegador) |
| **Grabación** | MediaRecorder API (nativa) |
| **Tipografías** | Orbitron + Inter (Google Fonts) |
| **Servidor local** | [live-server](https://github.com/tapio/live-server) |

---

## 📦 Instalación local

### Requisitos previos
- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/gorach80/radio-borneo.git
cd radio-borneo

# 2. Instala las dependencias
npm install

# 3. Levanta el servidor local
npm start

# 4. Abre el navegador
# http://127.0.0.1:8080
```

---

## 🌐 Publicación en GitHub Pages

### Método automático (recomendado)

El workflow de GitHub Actions (`.github/workflows/deploy.yml`) se ejecuta automáticamente al hacer push a `main`:

1. Ve a **Settings → Pages** del repositorio.
2. En **Source**, selecciona **GitHub Actions**.
3. Haz un push a `main`:
   ```bash
   git add .
   git commit -m "feat: publica en GitHub Pages"
   git push origin main
   ```
4. Espera a que termine el workflow en la pestaña **Actions**.
5. El sitio estará en `https://TU_USUARIO.github.io/radio-borneo/`.

### Método manual (GitHub Pages desde rama)

Si prefieres no usar Actions:

1. Ve a **Settings → Pages**.
2. En **Source**, selecciona **Deploy from a branch**.
3. Elige la rama `main` y carpeta `/root`.
4. Guarda y espera 1-2 minutos.

---

## 📁 Estructura del proyecto

```
radio-borneo/
├── index.html              # Estructura HTML de las 9 pestañas
├── style.css               # Diseño premium "Space-Deep Ocean"
├── app.js                  # Lógica principal (ES module)
├── geogebra-deploy.js      # Script de GeoGebra (local)
├── start-server.js         # Servidor local robusto
├── package.json            # Dependencias y scripts
├── _config.yml             # Configuración GitHub Pages
├── .github/
│   └── workflows/
│       ├── deploy.yml      # Deploy automático a Pages
│       └── ci.yml          # CI: lint + smoke test
├── .gitignore
├── LICENSE                 # MIT
├── CONTRIBUTING.md         # Guía para contribuir
├── CHANGELOG.md            # Historial de versiones
└── README.md               # Este archivo
```

---

## 🎯 Contexto pedagógico

### Aplicación
- **Asignatura:** Geometría Plana
- **Nivel:** Universitario (Ingeniería / Geometría aplicada)
- **Contexto geográfico:** Puerto de La Libertad, Ecuador

### Conceptos geométricos cubiertos
- Teorema de Pitágoras aplicado al triángulo del anclaje
- Segmento circular y área de solapamiento
- Condición de tangencia entre círculo y recta
- Razones métricas adimensionales (η)
- Diseño con factor de seguridad (FS = 1.2)

### Competencias desarrolladas
- Modelado geométrico de sistemas físicos
- Análisis de seguridad portuaria
- Visualización científica interactiva
- Comunicación técnica (Pitch Shark Tank)

---

## 📊 Parámetros de referencia

| Parámetro | Símbolo | Valor típico |
|-----------|---------|--------------|
| Profundidad del mar | `h` | 15 m |
| Longitud de cadena | `L` | 20 m |
| Distancia a zona exclusión | `D` | 12 m |
| Radio de Borneo | `r` | 13.23 m |
| Radio crítico | `r_crít` | 12 m |
| Longitud máx. cadena | `L_max` | 19.21 m |
| Estado del sistema | — | ⚠ PELIGRO |

---

## 🔧 Scripts npm

| Comando | Descripción |
|---------|-------------|
| `npm start` | Levanta servidor local en `http://127.0.0.1:8080` |
| `npm run dev` | Servidor con apertura automática del navegador |

---

## 🌍 Navegadores compatibles

| Navegador | Versión mínima |
|-----------|----------------|
| Chrome / Edge | ≥ 90 |
| Firefox | ≥ 88 |
| Safari | ≥ 14 |
| Opera | ≥ 76 |

> **Nota:** La API de voz (Web Speech) y la grabación (MediaRecorder) requieren permisos del usuario.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles del flujo de trabajo.

---

## 📝 Licencia

- **Código del proyecto:** [MIT License](LICENSE)
- **GeoGebra:** [GeoGebra Non-Commercial License](https://www.geogebra.org/license)
- **Three.js, KaTeX, MathLive, Font Awesome:** Sus respectivas licencias open source

---

## 🙏 Agradecimientos

- [Buckminster Fuller](https://es.wikipedia.org/wiki/Richard_Buckminster_Fuller) por inspirar la geometría aplicada a la ingeniería.
- [Three.js](https://threejs.org/) por la librería 3D que hace posible la visualización.
- La comunidad open source por hacer accesibles herramientas de calidad educativa.

---

## 📬 Contacto

- **Issues:** [GitHub Issues](https://github.com/gorach80/radio-borneo/issues)
- **Discusiones:** [GitHub Discussions](https://github.com/gorach80/radio-borneo/discussions)

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella ⭐**

[Reportar bug](https://github.com/gorach80/radio-borneo/issues) · [Solicitar feature](https://github.com/gorach80/radio-borneo/issues) · [Ver demo](https://gorach80.github.io/radio-borneo/)

</div>
