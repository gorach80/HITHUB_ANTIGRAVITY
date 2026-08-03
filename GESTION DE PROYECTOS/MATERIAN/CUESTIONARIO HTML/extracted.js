async function generateBlankPDF() {
    toast('Generando PDF en blanco...', 'info');
    
    // Abrimos ventana de carga
    const w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html><head><title>Cargando Documento UPSE...</title></head><body style="font-family:sans-serif; text-align:center; padding-top:80px; color:#002749;"><h2>Generando evaluación física UPSE...</h2><p>Por favor espera un momento...</p></body></html>');
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ format: 'a4', unit: 'mm' });
        
        let y = 15;
        
        function cleanLaTeX(str) {
            if (typeof str !== 'string') return str;
            return str
                .replace(/\\\(\s*/g, '')
                .replace(/\s*\\\)/g, '')
                .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, 'SUM($1...$2)')
                .replace(/\\sum_\{([^}]+)\}