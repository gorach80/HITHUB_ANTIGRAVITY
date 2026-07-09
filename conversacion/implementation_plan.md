# Plan de Implementación: Instalación de LaTeX y KaTeX

A petición del usuario, instalaremos todo el ecosistema de **LaTeX** y **KaTeX**, incluyendo librerías de desarrollo, programas del sistema y herramientas de edición.

---

## 1. Librerías de Python

Instalaremos los siguientes paquetes de Python usando el intérprete instalado en el sistema:
- **PyLaTeX:** Para crear y compilar documentos PDF de LaTeX programáticamente desde Python.
- **markdown-katex:** Una extensión de Markdown para renderizar fórmulas matemáticas usando KaTeX.

**Comando a ejecutar:**
```powershell
python -m pip install pylatex markdown-katex
```

---

## 2. Programas del Sistema

Para el correcto funcionamiento de LaTeX y KaTeX a nivel de sistema operativo:
- **MiKTeX:** Distribución ligera y moderna de LaTeX para Windows. Se encargará de compilar los archivos `.tex` y descargar paquetes de LaTeX bajo demanda.
- **Node.js:** El motor de Javascript requerido para instalar y ejecutar KaTeX (que es una librería de JS).
- **KaTeX CLI:** Instalación global de KaTeX a través del manejador de paquetes de Node.js (`npm`), permitiendo compilar fórmulas desde la terminal.

**Comandos a ejecutar:**
```powershell
# Instalar MiKTeX
winget install --id ChristianSchenk.MiKTeX -e --source winget

# Instalar Node.js
winget install --id OpenJS.NodeJS -e --source winget

# Instalar KaTeX globalmente (requiere reiniciar terminal después de instalar Node.js)
npm install -g katex
```

---

## 3. Integración con Editor (Visual Studio Code)

Dado que no se detectó Visual Studio Code en tu PATH, instalaremos el editor y agregaremos las extensiones clave para trabajar de manera profesional:
- **VS Code:** El editor de código.
- **LaTeX Workshop:** Extensión líder en VS Code para editar, previsualizar y compilar LaTeX con MiKTeX.
- **Markdown+Math:** Extensión que añade soporte de KaTeX en la visualización previa de tus archivos de Markdown.

**Comandos a ejecutar:**
```powershell
# Instalar VS Code
winget install --id Microsoft.VisualStudioCode -e --source winget

# Instalar extensiones (después de reiniciar terminal)
code --install-extension James-Yu.latex-workshop
code --install-extension goessner.mdmath
```

---

## Plan de Verificación

1. **Python:** Verificar la instalación de librerías con `python -c "import pylatex, markdown_katex; print('Librerías listas')"`
2. **LaTeX (MiKTeX):** Abrir terminal nueva y comprobar el compilador ejecutando `pdflatex --version`
3. **KaTeX:** Probar el CLI ejecutando `katex --version`
4. **Editor:** Abrir VS Code y validar que las extensiones estén cargadas.
