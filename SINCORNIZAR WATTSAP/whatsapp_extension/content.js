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

// Buscar burbujas usando múltiples selectores de respaldo para compatibilidad absoluta
function findMessageBubbles() {
    let elements = [];
    
    // 1. Buscar por atributo data-id (que contiene el ID del mensaje en WhatsApp Web)
    const elementsWithId = document.querySelectorAll('div[data-id]');
    elementsWithId.forEach(el => {
        const dataId = el.getAttribute('data-id');
        // Validar que sea un ID de mensaje estándar (suele tener guiones, arrobas o guiones bajos)
        if (dataId && (dataId.includes('_') || dataId.includes('@'))) {
            elements.push(el);
        }
    });

    // 2. Si no encuentra ninguno, buscar por las clases clásicas
    if (elements.length === 0) {
        const classic = document.querySelectorAll('.message-in, .message-out');
        classic.forEach(el => elements.push(el));
    }

    // 3. Fallback final: buscar cualquier div con clase que contenga la palabra "message"
    if (elements.length === 0) {
        const wildcard = document.querySelectorAll('div[class*="message-"]');
        wildcard.forEach(el => elements.push(el));
    }

    return elements;
}

// Inyectar el botón de etiqueta en cada burbuja de chat
function injectClassifyButtons() {
    const bubbles = findMessageBubbles();
    
    bubbles.forEach(bubble => {
        // Asegurarse de no inyectar dos veces
        if (bubble.querySelector('.wa-bubble-classify-btn')) return;

        // Validar que sea una burbuja con contenido real (texto/imagen/etc.)
        if (!bubble.innerText || bubble.innerText.trim().length === 0) return;

        // Evitar inyectar en paneles grandes del chat
        if (bubble.offsetWidth > 600 || bubble.offsetHeight > 400) return;

        // Asegurar que la burbuja tenga posición relativa para alinear nuestro botón
        bubble.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'wa-bubble-classify-btn';
        btn.innerHTML = '🏷️';
        btn.title = 'Clasificar este mensaje';

        // Estilos explícitos en línea para asegurar máxima prioridad sobre el CSS de WhatsApp
        btn.style.position = 'absolute';
        btn.style.top = '6px';
        btn.style.right = '32px';
        btn.style.zIndex = '9999';
        btn.style.opacity = '0'; // Oculto por defecto
        btn.style.transition = 'opacity 0.2s, background-0.2s, transform 0.2s';

        // Agregar listeners en JS para mostrar/ocultar el botón (Independiente de las clases CSS)
        bubble.addEventListener('mouseenter', () => {
            btn.style.opacity = '1';
        });
        bubble.addEventListener('mouseleave', () => {
            btn.style.opacity = '0';
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const rect = btn.getBoundingClientRect();
            const messageText = extractTextFromBubble(bubble);
            
            if (!messageText) {
                console.warn('No se pudo extraer texto de esta burbuja.');
                return;
            }

            showCategoriesPopup(messageText, rect, bubble);
        });

        bubble.appendChild(btn);
    });
}

// Extraer el texto de la burbuja
function extractTextFromBubble(bubble) {
    let text = "";
    
    const selectable = bubble.querySelector('.selectable-text');
    if (selectable) {
        text = selectable.innerText || selectable.textContent;
    }
    
    if (!text) {
        const copyable = bubble.querySelector('.copyable-text');
        if (copyable) {
            text = copyable.innerText || copyable.textContent;
        }
    }

    if (!text) {
        text = bubble.innerText || bubble.textContent;
    }

    text = text.trim();
    // Quitar la hora y estado que WhatsApp añade al final
    text = text.replace(/\d{1,2}:\d{2}\s*(?:a\.\sm\.|p\.\sm\.|AM|PM)?\s*✓*$/i, '').trim();

    return text;
}

// Escuchar evento mouseup para detectar selección de texto (Método alternativo)
function handleTextSelection(e) {
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        removeFloatBtn();
        
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

function removePopup() {
    if (popupMenu) {
        popupMenu.remove();
        popupMenu = null;
    }
}

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

    if (parseFloat(popupMenu.style.top) < 10) {
        popupMenu.style.top = `${window.scrollY + rect.bottom + 10}px`;
    }

    const title = document.createElement('div');
    title.className = 'wa-classifier-title';
    title.textContent = 'Clasificar mensaje';
    popupMenu.appendChild(title);

    // Cargar categorías dinámicas vía Service Worker de la extensión
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
                if (bubbleElement.classList.contains('message-in')) {
                    sender = 'RM';
                }
            }
        } catch (err) {
            console.warn('Error al extraer metadata de la burbuja:', err);
        }
    }

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
