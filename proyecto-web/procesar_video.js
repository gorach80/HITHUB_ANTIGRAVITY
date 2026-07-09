const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// El script asume que tienes un archivo "simulacion_3d.webm" descargado en esta misma carpeta
const inputFile = path.join(__dirname, 'simulacion_3d.webm');
const outputFile = path.join(__dirname, 'simulacion_3d.mp4');

console.log('================================================');
console.log('     PROCESADOR DE VIDEO CON NODE.JS & FFMPEG   ');
console.log('================================================');
console.log(`Buscando archivo de entrada: ${inputFile}`);

// Ejecutar la conversión
ffmpeg(inputFile)
    .output(outputFile)
    .on('start', (commandLine) => {
        console.log('Iniciando proceso en FFmpeg...');
        console.log('Comando ejecutado:', commandLine);
    })
    .on('progress', (progress) => {
        console.log(`Procesando... ${progress.percent ? Math.round(progress.percent) + '%' : ''}`);
    })
    .on('end', () => {
        console.log('\n================================================');
        console.log('¡CONVERSIÓN COMPLETADA CON ÉXITO!');
        console.log('Archivo de salida creado:', outputFile);
        console.log('================================================');
    })
    .on('error', (err) => {
        console.log('\n================================================');
        console.error('ERROR AL PROCESAR EL VIDEO:', err.message);
        console.log('Nota: Para ejecutar este script, primero debes iniciar el simulador, grabar un video, guardarlo en esta carpeta con el nombre "simulacion_3d.webm", y luego ejecutar:');
        console.log('node procesar_video.js');
        console.log('================================================');
    })
    .run();
