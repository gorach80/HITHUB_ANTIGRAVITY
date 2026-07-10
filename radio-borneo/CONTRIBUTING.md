# Contribuir al proyecto Radio de Borneo

¡Gracias por tu interés en contribuir! Este es un proyecto educativo abierto para la enseñanza de la geometría plana aplicada a la ingeniería offshore.

## 🚀 Cómo contribuir

### Reportar problemas
1. Verifica que el problema no haya sido reportado antes en [Issues](../../issues).
2. Abre un nuevo issue con:
   - Título descriptivo
   - Pasos para reproducir el problema
   - Comportamiento esperado vs. actual
   - Capturas de pantalla (si aplica)
   - Navegador y sistema operativo

### Proponer mejoras
1. Abre un issue con la etiqueta `enhancement` describiendo la mejora.
2. Discute la propuesta con los mantenedores.
3. Una vez aprobado, sigue el flujo de Pull Request.

### Enviar código

```bash
# 1. Fork el repositorio
# 2. Clona tu fork
git clone https://github.com/TU_USUARIO/radio-borneo.git
cd radio-borneo

# 3. Crea una rama para tu feature
git checkout -b feature/mi-nueva-funcionalidad

# 4. Instala dependencias
npm install

# 5. Haz tus cambios y prueba localmente
npm start
# Abre http://127.0.0.1:8080

# 6. Commit tus cambios siguiendo Conventional Commits
git commit -m "feat: añade nuevo escenario de oleaje extremo"

# 7. Push a tu fork
git push origin feature/mi-nueva-funcionalidad

# 8. Abre un Pull Request
```

## 📋 Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Descripción |
|------|-------------|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Formato, no afecta código |
| `refactor:` | Refactorización de código |
| `test:` | Añadir o modificar tests |
| `chore:` | Tareas de mantenimiento |

## 🎨 Guías de estilo

### HTML
- Indentación: 2 espacios
- Etiquetas y atributos en minúsculas
- Atributos con comillas dobles

### CSS
- Variables CSS en `:root`
- BEM para nombres de clases cuando aplique
- Mobile-first responsive

### JavaScript
- ES Modules (`import`/`export`)
- Funciones arrow cuando sea posible
- JSDoc para funciones públicas
- `const` por defecto, `let` si se reasigna

## 🌿 Estructura de ramas

- `main` — versión estable, deploy automático a GitHub Pages
- `develop` — integración de features
- `feature/*` — nuevas funcionalidades
- `fix/*` — corrección de bugs
- `release/*` — preparación de release

## ✅ Checklist antes de PR

- [ ] El código sigue las guías de estilo
- [ ] Se probó localmente en Chrome y Firefox
- [ ] No se incluyen `console.log` de depuración
- [ ] La documentación se actualizó si fue necesario
- [ ] Los commits siguen Conventional Commits
- [ ] No se incluyen archivos de `node_modules/`

## 🧪 Testing manual

Antes de enviar un PR, verifica:

1. **Simulador 3D**: la boya orbita correctamente y el indicador de seguridad cambia de estado.
2. **Pizarra**: se puede dibujar y descargar el PNG.
3. **Solver**: las fórmulas KaTeX se renderizan correctamente.
4. **GeoGebra**: la suite carga al hacer clic en la pestaña.
5. **IDE Python**: la consola imprime resultados al pulsar "Ejecutar".
6. **Pitch Shark Tank**: la narración por voz funciona segmento a segmento.
7. **Escenarios**: las 4 sub-pestañas cambian el canvas animado.
8. **Tutor IA**: el solver genera los 10 pasos.
9. **GeoJSON**: la descarga .geojson produce un archivo válido.
10. **Memoria de Cálculo**: las 3 sub-pestañas renderizan fórmulas y tablas.

## 📞 Contacto

- Issues: [GitHub Issues](../../issues)
- Discusiones: [GitHub Discussions](../../discussions)

¡Feliz hacking! 🚀
