let floatBtn = null;
let popupMenu = null;

console.log("WhatsApp Classifier Extension loaded successfully!");

// Log periódico para depuración en la consola del usuario
setInterval(() => {
    const textConts = document.querySelectorAll('.selectable-text, .copyable-text').length;
    const dataIds = document.querySelectorAll('div[data-id]').length;
    console.log(`[Classifier Debug] Contenedores de texto: ${textConts}, Elementos con data-id: ${dataIds}`);
}, 5000);

// Inicializar observador para inyectar botones en las burbujas de chat
initBubbleObserver();

// Escuchar evento mouseup para detectar selección de texto (Método alternativo)
document.addEventListener('mouseup', handleTextSelection);

function initBubbleObserver() {
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

// Buscar burbujas reales utilizando selectores basados en el texto (súper preciso)
function findMessageBubbles() {
    const bubbles = new Set();
    
    // Método 1: Encontrar las burbujas de texto/enlaces directamente desde sus spans de texto seleccionable
    const textContainers = document.querySelectorAll('.selectable-text, .copyable-text');
    textContainers.forEach(container => {
        const bubble = container.closest('div');
        if (bubble && bubble.innerText && bubble.innerText.trim().length > 0) {
            // Evitar seleccionar contenedores gigantescos
            if (bubble.offsetWidth > 50 && bubble.offsetWidth < 650) {
                bubbles.add(bubble);
            }
        }
    });

    // Método 2: Analizar los rows con data-id de WhatsApp
    const rows = document.querySelectorAll('div[data-id]');
    rows.forEach(row => {
        const dataId = row.getAttribute('data-id');
        if (dataId && (dataId.startsWith('true_') || dataId.startsWith('false_'))) {
            // La burbuja real es un contenedor interno del row que tiene fondo verde o gris
            const innerDivs = row.querySelectorAll('div');
            for (const div of innerDivs) {
                if (div.offsetWidth > 40 && div.offsetWidth < row.offsetWidth * 0.85) {
                    if (div.innerText && div.innerText.trim().length > 0) {
                        bubbles.add(div);
                        break;
                    }
                }
            }
        }
    });

    return Array.from(bubbles);
}

// Inyectar el botón de etiqueta en cada burbuja de chat
function injectClassifyButtons() {
    const bubbles = findMessageBubbles();
    
    bubbles.forEach(bubble => {
        if (bubble.querySelector('.wa-bubble-classify-btn')) return;

        bubble.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'wa-bubble-classify-btn';
        btn.innerHTML = '🏷️';
        btn.title = 'Clasificar este mensaje';

        // Estilos en línea explícitos para posicionar sobre la burbuja real de texto
        btn.style.position = 'absolute';
        btn.style.top = '4px';
        btn.style.right = '6px';
        btn.style.zIndex = '99999';
        btn.style.opacity = '0'; // Invisible por defecto
        btn.style.transition = 'opacity 0.15s ease-in-out';

        // Eventos hover en JS
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
            // Extraer texto con fallbacks en cascada
            const messageText = extractTextFromBubble(bubble) || "[Imagen / Sticker / Archivo]";
            
            showCategoriesPopup(messageText, rect, bubble);
        });

        bubble.appendChild(btn);
    });
}

// Extraer el texto de la burbuja (con soporte de fila para galerías de imágenes y previews)
function extractTextFromBubble(bubble) {
    let text = "";
    
    // 1. Intentar buscar en la burbuja actual
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

    // 2. Si no hay texto, subir al contenedor de la fila (row) y buscar texto allí
    if (!text) {
        const row = bubble.closest('div[data-id]') || bubble.closest('[role="row"]');
        if (row) {
            const rowSelectable = row.querySelector('.selectable-text');
            if (rowSelectable) {
                text = rowSelectable.innerText || rowSelectable.textContent;
            }
            if (!text) {
                const rowCopyable = row.querySelector('.copyable-text');
                if (rowCopyable) {
                    text = rowCopyable.innerText || rowCopyable.textContent;
                }
            }
        }
    }

    // 3. Fallback final: innerText de la burbuja
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
                    if (parentBubble.hasAttribute('data-id') || parentBubble.classList.contains('selectable-text')) {
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
                const row = bubbleElement.closest('div[data-id]');
                if (row) {
                    const dataId = row.getAttribute('data-id');
                    if (dataId && dataId.startsWith('false_')) {
                        sender = 'RM';
                    }
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
