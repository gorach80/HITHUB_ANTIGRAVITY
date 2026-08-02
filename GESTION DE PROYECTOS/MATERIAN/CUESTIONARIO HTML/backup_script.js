/**
 * GOOGLE APPS SCRIPT - RESPALDO DE CALIFICACIONES DE ESTUDIANTES
 * 
 * Instrucciones de uso:
 * 1. Abre https://script.google.com/
 * 2. Crea un proyecto nuevo y pega este código en el archivo de script.
 * 3. Crea una hoja de Google Sheets y copia su ID de la barra de direcciones.
 * 4. Pega el ID en la variable SPREADSHEET_ID más abajo.
 * 5. Haz clic en "Implementar > Nueva implementación" en la parte superior.
 * 6. Tipo: "Aplicación web".
 * 7. Ejecutar como: "Tú" (Tu cuenta de Google).
 * 8. Quién tiene acceso: "Cualquiera" (para permitir envíos públicos sin login).
 * 9. Haz clic en "Implementar", autoriza el acceso y copia la URL de la aplicación web.
 */

// CONFIGURACIÓN 1: Google Sheets (Escribe la ID de tu hoja de cálculo)
const SPREADSHEET_ID = 'ESCRIBE_AQUI_EL_ID_DE_TU_GOOGLE_SHEETS';

// CONFIGURACIÓN 2 (Opcional): Respaldo directo en repositorio de GitHub
const HABILIATAR_GITHUB = false; // Cambiar a true si deseas guardar JSON en GitHub
const GITHUB_TOKEN = 'TU_GITHUB_PERSONAL_ACCESS_TOKEN'; // Token clásico con permisos de escritura
const REPO_OWNER = 'TU_USUARIO_GITHUB';
const REPO_NAME = 'TU_REPOSITORIO';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // ----------------------------------------------------
    // RESPALDO EN GOOGLE SHEETS
    // ----------------------------------------------------
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'ESCRIBE_AQUI_EL_ID_DE_TU_GOOGLE_SHEETS') {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
      
      // Crear encabezados si la hoja está recién creada y vacía
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Fecha y Hora', 
          'Nombre Completo', 
          'Correo Electrónico', 
          'S1: VF (5 pts)', 
          'S2: Selección (10 pts)', 
          'S3: Ordenamiento (5 pts)', 
          'S4: Completar (10 pts)', 
          'S5: Unir Columnas (10 pts)', 
          'Calificación Total (40 pts)'
        ]);
        
        // Dar formato a los encabezados
        sheet.getRange(1, 1, 1, 9)
             .setBackground('#0078d4')
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setHorizontalAlignment('center');
      }
      
      // Insertar datos de la evaluación
      sheet.appendRow([
        data.date || new Date().toISOString(),
        data.user.name,
        data.user.email,
        data.s1,
        data.s2,
        data.s3,
        data.s4,
        data.s5,
        data.total
      ]);

      // ----------------------------------------------------
      // ENVÍO AUTOMÁTICO DE REPORTE POR CORREO ELECTRÓNICO
      // ----------------------------------------------------
      try {
        if (data.user && data.user.email) {
          MailApp.sendEmail({
            to: data.user.email,
            subject: "Reporte de Calificación — Evaluación del Segundo Parcial UPSE",
            body: "Estimado(a) " + data.user.name + ",\n\nSe ha registrado satisfactoriamente tu Evaluación del Segundo Parcial en la asignatura de Gestión de Proyectos.\n\nRESULTADO OBTENIDO: " + data.total + " / 40 puntos.\n\nDetalle por Secciones:\n- Sección 1 (V/F): " + data.s1 + " / 5 pts\n- Sección 2 (Selección): " + data.s2 + " / 10 pts\n- Sección 3 (Ordenamiento): " + data.s3 + " / 5 pts\n- Sección 4 (Completamiento): " + data.s4 + " / 10 pts\n- Sección 5 (Unir Columnas): " + data.s5 + " / 10 pts\n\nDocente: Ing. Luis A Palate G. Mg\nCorreo Docente: lpalate5942@upse.edu.ec\nUniversidad Estatal Península de Santa Elena"
          });
        }
      } catch (mailErr) {
        console.warn("No se pudo enviar correo automático desde Apps Script: " + mailErr);
      }
    }
    
    // ----------------------------------------------------
    // RESPALDO EN GITHUB (Guardando un archivo .json por estudiante)
    // ----------------------------------------------------
    if (HABILIATAR_GITHUB && GITHUB_TOKEN !== 'TU_GITHUB_PERSONAL_ACCESS_TOKEN') {
      // Generar nombre de archivo único con el correo del estudiante
      const safeEmail = data.user.email.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().getTime();
      const filePath = 'respaldos_notas/' + safeEmail + '_' + timestamp + '.json';
      
      const url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + filePath;
      
      const payload = {
        message: 'Respaldo automático de notas - ' + data.user.name,
        content: Utilities.base64Encode(Utilities.newBlob(JSON.stringify(data, null, 2)).getBytes()),
        branch: 'main'
      };
      
      const response = UrlFetchApp.fetch(url, {
        method: 'put',
        muteHttpExceptions: true,
        headers: {
          'Authorization': 'token ' + GITHUB_TOKEN,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      });
      
      console.log('GitHub API Response: ' + response.getContentText());
    }
    
    // Retornar éxito
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// ----------------------------------------------------
// VERIFICACIÓN DE EXAMEN ANTERIOR (Evitar duplicados)
// ----------------------------------------------------
function doGet(e) {
  try {
    const checkEmail = e.parameter.checkEmail;
    
    if (checkEmail && SPREADSHEET_ID && SPREADSHEET_ID !== 'ESCRIBE_AQUI_EL_ID_DE_TU_GOOGLE_SHEETS') {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
      const lastRow = sheet.getLastRow();
      
      if (lastRow > 1) {
        // Obtener los correos registrados (Columna 3: Correo Electrónico)
        const emails = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
        const searchEmail = checkEmail.trim().toLowerCase();
        
        for (let i = 0; i < emails.length; i++) {
          if (emails[i][0].toString().trim().toLowerCase() === searchEmail) {
            return ContentService.createTextOutput(JSON.stringify({ exists: true }))
                                 .setMimeType(ContentService.MimeType.JSON)
                                 .setHeader('Access-Control-Allow-Origin', '*');
          }
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ exists: false }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader('Access-Control-Allow-Origin', '*');
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader('Access-Control-Allow-Origin', '*');
  }
}


// ----------------------------------------------------
// ELIMINAR TODOS LOS REGISTROS PARA PERMITIR RE-INTENTOS
// ----------------------------------------------------
function clearAllSheetData() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'ESCRIBE_AQUI_EL_ID_DE_TU_GOOGLE_SHEETS') {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
      console.log('Se eliminaron correctamente todos los registros previos de estudiantes.');
    }
  }
}
