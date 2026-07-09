@echo off
:: Navegar a la carpeta del repositorio
cd /d "%USERPROFILE%\OneDrive\Documentos\HITHUB_ANTIGRAVITY"

:: Intentar actualizar el repositorio local con cambios remotos antes de subir
git pull origin main --rebase

:: Verificar si hay cambios locales para confirmar (nuevos, modificados o eliminados)
git status --porcelain | findstr /R "^" > nul
if %errorlevel%==0 (
    echo Detectados nuevos cambios de Antigravity. Iniciando sincronización...
    git add .
    git commit -m "Sincronizacion automatica de trabajos Antigravity - %date% %time%"
    git push origin main
    echo Respaldo completado con exito.
) else (
    echo No hay archivos nuevos para sincronizar.
)