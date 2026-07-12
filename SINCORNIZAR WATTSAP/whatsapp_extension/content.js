let floatBtn = null;
let popupMenu = null;

// Inicializar observador para inyectar botones en las burbujas de chat
initBubbleObserver();

// Escuchar evento mouseup para detectar selección de texto (Método alternativo)
document.addEventListener('mouseup', handleTextSelection);

// Función para inicializar MutationObserver y buscar burbujas de mensajes constantemente
function initBubbleObserver() {
    // Buscar e inyectar en burbujas ya presentes
    injectClassifyButtons();

    // Crear el observador para inyectar en mensajes nuevos conforme se hace scroll
    const observer = new MutationObserver((mutations) => {
        let shouldInject = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldInject = true;
                break;
            }
        }
        if (shouldInject) {
            injectClassifyButtons();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Inyectar el botón de etiqueta en cada burbuja de chat
function injectClassifyButtons() {
    // Buscar burbujas de mensaje (in/out) o celdas de fila de mensajes en WhatsApp Web
    const bubbles = document.querySelectorAll('div.message-in, div.message-out, div[role="row"]');
    
    bubbles.forEach(bubble => {
        // En WhatsApp Web, a veces role="row" contiene la burbuja real adentro.
        // Buscamos la burbuja real interna si es role="row"
        let targetBubble = bubble;
        if (bubble.getAttribute('role') === 'row') {
            const innerBubble = bubble.querySelector('.message-in, .message-out');
            if (innerBubble) {
                targetBubble = innerBubble;
            } else {
                return; // Si no hay burbuja interna en este row, ignorar
            }
        }

        // Asegurarse de no inyectar dos veces
        if (targetBubble.querySelector('.wa-bubble-classify-btn')) return;

        // Asegurar que la burbuja tenga posición relativa para alinear nuestro botón
        targetBubble.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'wa-bubble-classify-btn';
        btn.innerHTML = '🏷️';
        btn.title = 'Clasificar este mensaje';

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const rect = btn.getBoundingClientRect();
            const messageText = extractTextFromBubble(targetBubble);
            
            if (!messageText) {
                console.warn('No se pudo extraer texto de esta burbuja.');
                return;
            }

            // Mostrar el selector de categorías debajo del botón
            showCategoriesPopup(messageText, rect, targetBubble);
        });

        targetBubble.appendChild(btn);
    });
}

// Extraer el texto de la burbuja (removiendo elementos HTML y hora final de WhatsApp)
function extractTextFromBubble(bubble) {
    let text = "";
    
    // 1. Intentar con selectable-text (el texto oficial en WhatsApp)
    const selectable = bubble.querySelector('.selectable-text');
    if (selectable) {
        // WhatsApp a veces guarda el texto limpio en span.selectable-text
        text = selectable.innerText || selectable.textContent;
    }
    
    // 2. Si no, buscar div.copyable-text
    if (!text) {
        const copyable = bubble.querySelector('.copyable-text');
        if (copyable) {
            text = copyable.innerText || copyable.textContent;
        }
    }

    // 3. Fallback: extraer el texto crudo del contenedor y remover la hora/check de lectura
    if (!text) {
        text = bubble.innerText || bubble.textContent;
    }

    // Limpieza final
    text = text.trim();
    
    // Quitar la hora y estado que WhatsApp añade al final del texto visible de la burbuja
    // Ejemplo: "Hola cómo estás 11:04 a.m. ✓✓" -> "Hola cómo estás"
    text = text.replace(/\d{1,2}:\d{2}\s*(?:a\.\sm\.|p\.\sm\.|AM|PM)?\s*✓*$/i, '').trim();

    return text;
}

// Escuchar evento mouseup para detectar selección de texto (Fallback en caso de que hover falle)
function handleTextSelection(e) {
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // Limpiar widgets activos
        removeFloatBtn();
        
        // No borrar el popup si el usuario hace clic dentro de él
        if (e.target.closest('.wa-classifier-btn') || e.target.closest('.wa-classifier-popup')) {
            return;
        }
        removePopup();

        if (selectedText.length === 0) return;

        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            floatBtn = document.createElement('button');
            floatBtn.className = 'wa-classifier-btn';
            floatBtn.innerHTML = '🏷️';
            
            floatBtn.style.top = `${window.scrollY + rect.top - 42}px`;
            floatBtn.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 18}px`;

            floatBtn.addEventListener('click', (btnEvent) => {
                btnEvent.stopPropagation();
                btnEvent.preventDefault();
                
                // Encontrar burbuja padre para contextualizar
                let parentBubble = range.startContainer.parentElement;
                while (parentBubble && parentBubble !== document.body) {
                    if (parentBubble.classList.contains('message-in') || parentBubble.classList.contains('message-out')) {
                        break;
                    }
                    parentBubble = parentBubble.parentElement;
                }
                
                showCategoriesPopup(selectedText, rect, parentBubble);
            });

            document.body.appendChild(floatBtn);
        } catch (err) {
            console.error('Error al posicionar el botón flotante:', err);
        }
    }, 50);
}

function removeFloatBtn() {
    if (floatBtn) {
        floatBtn.remove();
        floatBtn = null;
    }
}

function removePopup() {
    if (popupMenu) {
        popupMenu.remove();
        popupMenu = null;
    }
}

// Limpiar menús si el usuario hace clic fuera de la extensión
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.wa-classifier-btn') || e.target.closest('.wa-classifier-popup') || e.target.closest('.wa-bubble-classify-btn')) {
        return;
    }
    removeFloatBtn();
    removePopup();
});

// Mostrar el popup con el listado de categorías cargadas del servidor
function showCategoriesPopup(textToClassify, rect, bubbleElement) {
    removeFloatBtn();
    removePopup();

    popupMenu = document.createElement('div');
    popupMenu.className = 'wa-classifier-popup';
    popupMenu.style.top = `${window.scrollY + rect.top - 120}px`;
    popupMenu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 100}px`;

    // Evitar que el popup se dibuje fuera de la pantalla (limite superior)
    if (parseFloat(popupMenu.style.top) < 10) {
        popupMenu.style.top = `${window.scrollY + rect.bottom + 10}px`;
    }

    const title = document.createElement('div');
    title.className = 'wa-classifier-title';
    title.textContent = 'Clasificar mensaje';
    popupMenu.appendChild(title);

    // Cargar categorías dinámicas de Flask
    fetch('http://localhost:5000/api/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const opt = document.createElement('div');
                opt.className = 'wa-classifier-option';
                opt.textContent = cat;
                opt.addEventListener('click', (optEvent) => {
                    optEvent.stopPropagation();
                    classifyMessage(textToClassify, bubbleElement, cat);
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
            errDiv.textContent = 'Servidor Flask apagado o inaccesible (http://localhost:5000).';
            popupMenu.appendChild(errDiv);
        });

    document.body.appendChild(popupMenu);
}

// Enviar la clasificación al servidor Flask local
function classifyMessage(text, bubbleElement, category) {
    removePopup();

    let sender = 'Yo (Tú)';
    let timestamp = '';

    // Extraer metadata si tenemos la burbuja asociada
    if (bubbleElement) {
        try {
            const copyable = bubbleElement.querySelector('div.copyable-text');
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
            } else {
                // Verificar si es un mensaje recibido (in) o enviado (out) para definir remitente
                if (bubbleElement.classList.contains('message-in')) {
                    sender = 'RM'; // Remitente por defecto
                }
            }
        } catch (err) {
            console.warn('Error al extraer metadata de la burbuja:', err);
        }
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
            // Mostrar retroalimentación visual exitosa directamente en el botón de la burbuja
            if (bubbleElement) {
                showSuccessIndicatorInBubble(bubbleElement);
            } else {
                alert(`¡Clasificado con éxito en "${category}"!`);
            }
        } else {
            alert('Error al clasificar: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Error de red al clasificar en la extensión:', err);
        alert('Error: No se pudo conectar con el servidor local en http://localhost:5000. Asegúrate de que el servidor Flask esté corriendo.');
    });
}

// Dibujar un check verde temporal sobre el botón de la burbuja clasificada
function showSuccessIndicatorInBubble(bubbleElement) {
    const btn = bubbleElement.querySelector('.wa-bubble-classify-btn');
    if (!btn) return;

    const originalContent = btn.innerHTML;
    btn.innerHTML = '✓';
    btn.style.background = '#10b981';
    btn.style.borderColor = '#10b981';
    btn.style.opacity = '1';

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.opacity = '';
    }, 2000);
}
