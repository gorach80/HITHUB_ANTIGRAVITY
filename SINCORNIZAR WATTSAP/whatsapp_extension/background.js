chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchCategories") {
        fetch('http://localhost:5000/api/categories')
            .then(res => res.json())
            .then(categories => {
                sendResponse({ success: true, categories: categories });
            })
            .catch(err => {
                console.error('Error fetching categories in background:', err);
                sendResponse({ success: false, error: err.toString() });
            });
        return true; // Mantener canal abierto para respuesta asíncrona
    }
    
    if (request.action === "classifyMessage") {
        fetch('http://localhost:5000/api/messages/add_external', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.data)
        })
        .then(res => res.json())
        .then(data => {
            sendResponse({ success: true, data: data });
        })
        .catch(err => {
            console.error('Error classifying message in background:', err);
            sendResponse({ success: false, error: err.toString() });
        });
        return true; // Mantener canal abierto
    }
});
