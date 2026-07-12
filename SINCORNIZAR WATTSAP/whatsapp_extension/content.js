let floatBtn = null;
let popupMenu = null;

// Escuchar evento mouseup para detectar selección de texto
document.addEventListener('mouseup', handleTextSelection);

function handleTextSelection(e) {
    // Pequeño retardo para dar tiempo a que se dibuje la selección
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // Eliminar botones y popups previos si existen
        removeFloatBtn();
        removePopup();

        if (selectedText.length === 0) return;

        // Evitar activar el botón si el clic fue dentro de la misma interfaz flotante
        if (e.target.closest('.wa-classifier-btn') || e.target.closest('.wa-classifier-popup')) {
            return;
        }

        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Crear el botón flotante
            floatBtn = document.createElement('button');
            floatBtn.className = 'wa-classifier-btn';
            floatBtn.innerHTML = '🏷️';
            
            // Posicionar el botón flotante justo encima de la selección
            floatBtn.style.top = `${window.scrollY + rect.top - 42}px`;
            floatBtn.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 18}px`;

            // Escuchar clic en el botón
            floatBtn.addEventListener('click', (btnEvent) => {
                btnEvent.stopPropagation();
                btnEvent.preventDefault();
                showCategoriesPopup(selectedText, range, rect);
            });

            document.body.appendChild(floatBtn);
        } catch (err) {
            console.error('Error al posicionar el botón flotante:', err);
        }
    }, 50);
}

// Remover botón flotante
function removeFloatBtn() {
    if (floatBtn) {
        floatBtn.remove();
        floatBtn = null;
    }
}

// Remover popup de categorías
function removePopup() {
    if (popupMenu) {
        popupMenu.remove();
        popupMenu = null;
    }
}

// Escuchar clics en el documento para limpiar la interfaz flotante si el usuario hace clic fuera
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.wa-classifier-btn') || e.target.closest('.wa-classifier-popup')) {
        return;
    }
    removeFloatBtn();
    removePopup();
});

// Mostrar el popup con el listado de categorías cargadas del servidor
function showCategoriesPopup(textToClassify, range, rect) {
    removeFloatBtn(); // Ocultar el botón para mostrar el popup
    removePopup();

    popupMenu = document.createElement('div');
    popupMenu.className = 'wa-classifier-popup';
    popupMenu.style.top = `${window.scrollY + rect.top - 120}px`; // Un poco más arriba
    popupMenu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 100}px`;

    const title = document.createElement('div');
    title.className = 'wa-classifier-title';
    title.textContent = 'Clasificar mensaje';
    popupMenu.appendChild(title);

    // Cargar categorías dinámicas del servidor Flask local
    fetch('http://localhost:5000/api/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const opt = document.createElement('div');
                opt.className = 'wa-classifier-option';
                opt.textContent = cat;
                opt.addEventListener('click', (optEvent) => {
                    optEvent.stopPropagation();
                    classifyMessage(textToClassify, range, cat);
                });
                popupMenu.appendChild(opt);
            });
        })
        .catch(err => {
            console.error('Error al cargar categorías en la extensión:', err);
            const errDiv = document.createElement('div');
            errDiv.style.color = '#ef4444';
            errDiv.style.padding = '8px';
            errDiv.style.fontSize = '12px';
            errDiv.textContent = 'Servidor Flask desconectado.';
            popupMenu.appendChild(errDiv);
        });

    document.body.appendChild(popupMenu);
}

// Enviar la clasificación al servidor Flask local
function classifyMessage(text, range, category) {
    removePopup();

    // Intentar encontrar el remitente y la marca de tiempo de forma dinámica en WhatsApp Web
    let sender = 'Yo (Tú)';
    let timestamp = '';

    try {
        let parent = range.startContainer.parentElement;
        while (parent && parent !== document.body) {
            if (parent.hasAttribute('data-id') || parent.classList.contains('message-in') || parent.classList.contains('message-out')) {
                const copyable = parent.querySelector('div.copyable-text');
                if (copyable) {
                    const preText = copyable.getAttribute('data-pre-plain-text');
                    if (preText) {
                        const clean = preText.replace(/^\[|\]\s*$/g, '');
                        const parts = clean.split('] ');
                        if (parts.length >= 2) {
                            timestamp = parts[0];
                            sender = parts[1].replace(':', '').trim();
                        }
                    }
                }
                break;
            }
            parent = parent.parentElement;
        }
    } catch (err) {
        console.warn('No se pudo extraer metadata del mensaje en la extensión:', err);
    }

    // Enviar POST a la API
    fetch('http://localhost:5000/api/messages/add_external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: text,
            sender: sender,
            category: category,
            timestamp: timestamp
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Mostrar retroalimentación visual exitosa
            showSuccessIndicator(range);
        } else {
            alert('Error al clasificar: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Error de red al clasificar en la extensión:', err);
        alert('Error: No se pudo conectar con la aplicación local en http://localhost:5000. Asegúrate de que el servidor Flask esté corriendo.');
    });
}

// Dibujar un pequeño check verde temporal sobre el texto clasificado con éxito
function showSuccessIndicator(range) {
    try {
        const rect = range.getBoundingClientRect();
        const check = document.createElement('div');
        check.style.position = 'absolute';
        check.style.zIndex = '100002';
        check.style.top = `${window.scrollY + rect.top - 20}px`;
        check.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 12}px`;
        check.style.background = '#10b981';
        check.style.color = 'white';
        check.style.borderRadius = '50%';
        check.style.width = '24px';
        check.style.height = '24px';
        check.style.display = 'flex';
        check.style.justifyContent = 'center';
        check.style.alignItems = 'center';
        check.style.fontSize = '12px';
        check.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.4)';
        check.innerHTML = '✓';
        
        document.body.appendChild(check);
        setTimeout(() => {
            check.style.transition = 'opacity 0.3s';
            check.style.opacity = '0';
            setTimeout(() => check.remove(), 300);
        }, 1500);
    } catch (err) {
        console.error('Error al mostrar indicador de éxito:', err);
    }
}
