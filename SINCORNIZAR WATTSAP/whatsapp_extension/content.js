let floatBtn = null;
let popupMenu = null;

console.log("WhatsApp Classifier Extension loaded successfully!");

// Inicializar observador para inyectar botones en las burbujas de chat
initBubbleObserver();

// Escuchar evento mouseup para detectar selección de texto (Método alternativo)
document.addEventListener('mouseup', handleTextSelection);

function initBubbleObserver() {
    // Buscar e inyectar en burbujas ya presentes
    injectClassifyButtons();

    // Crear el observador para inyectar en mensajes nuevos conforme se hace scroll o llegan mensajes
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

// Inyectar el botón de etiqueta en cada burbuja de chat usando el selector data-id (100% robusto)
function injectClassifyButtons() {
    // WhatsApp Web asigna un atributo data-id único a cada burbuja de mensaje
    const bubbles = document.querySelectorAll('div[data-id]');
    
    bubbles.forEach(bubble => {
        const dataId = bubble.getAttribute('data-id');
        // Validar que sea una burbuja de mensaje estándar (suele empezar con true_ o false_)
        if (!dataId || (!dataId.startsWith('true_') && !dataId.startsWith('false_'))) return;

        // Asegurarse de no inyectar dos veces
        if (bubble.querySelector('.wa-bubble-classify-btn')) return;

        // Asegurar que la burbuja tenga posición relativa para alinear nuestro botón
        bubble.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'wa-bubble-classify-btn';
        btn.innerHTML = '🏷️';
        btn.title = 'Clasificar este mensaje';

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const rect = btn.getBoundingClientRect();
            const messageText = extractTextFromBubble(bubble);
            
            if (!messageText) {
                console.warn('No se pudo extraer texto de esta burbuja.');
                return;
            }

            // Mostrar el selector de categorías debajo del botón
            showCategoriesPopup(messageText, rect, bubble);
        });

        bubble.appendChild(btn);
    });
}

// Extraer el texto de la burbuja (removiendo elementos HTML y hora final de WhatsApp)
function extractTextFromBubble(bubble) {
    let text = "";
    
    // 1. Intentar con selectable-text (el texto oficial en WhatsApp)
    const selectable = bubble.querySelector('.selectable-text');
    if (selectable) {
        text = selectable.innerText || selectable.textContent;
    }
    
    // 2. Si no, buscar div.copyable-text o cualquier contenedor de texto
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
    text = text.replace(/\d{1,2}:\d{2}\s*(?:a\.\sm\.|p\.\sm\.|AM|PM)?\s*✓*$/i, '').trim();

    return text;
}

// Escuchar evento mouseup para detectar selección de texto (Método alternativo)
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
                    if (parentBubble.hasAttribute('data-id')) {
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

// Remover popup de categorías
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

    // Cargar categorías dinámicas vía Service Worker de la extensión (Evita CORS/CSP de WhatsApp)
    chrome.runtime.sendMessage({ action: "fetchCategories" }, (response) => {
        if (response && response.success) {
            response.categories.forEach(cat => {
                const opt = document.createElement('div');
                opt.className = 'wa-classifier-option';
                opt.textContent = cat;
                opt.addEventListener('click', (optEvent) => {
                    optEvent.stopPropagation();
                    classifyMessage(textToClassify, bubbleElement, cat);
                });
                popupMenu.appendChild(opt);
            });
        } else {
            console.error('Error loading categories:', response ? response.error : 'No response');
            const errDiv = document.createElement('div');
            errDiv.style.color = '#ef4444';
            errDiv.style.padding = '8px';
            errDiv.style.fontSize = '12px';
            errDiv.textContent = 'Servidor Flask desconectado. Inicia app.py.';
            popupMenu.appendChild(errDiv);
        }
    });

    document.body.appendChild(popupMenu);
}

// Enviar la clasificación al servidor Flask local vía Service Worker de la extensión
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
                // Si la burbuja tiene la clase message-in, es un mensaje recibido
                if (bubbleElement.classList.contains('message-in')) {
                    sender = 'RM';
                }
            }
        } catch (err) {
            console.warn('Error al extraer metadata de la burbuja:', err);
        }
    }

    // Enviar datos al Service Worker para su publicación
    chrome.runtime.sendMessage({
        action: "classifyMessage",
        data: {
            text: text,
            sender: sender,
            category: category,
            timestamp: timestamp
        }
    }, (response) => {
        if (response && response.success && response.data.success) {
            // Mostrar retroalimentación visual exitosa directamente en el botón de la burbuja
            if (bubbleElement) {
                showSuccessIndicatorInBubble(bubbleElement);
            } else {
                alert(`¡Clasificado en "${category}" con éxito!`);
            }
        } else {
            const errMsg = response ? response.error || (response.data && response.data.error) : 'Error de conexión';
            alert('Error al clasificar: ' + errMsg);
        }
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
