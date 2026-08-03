// Elements
const video = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const scanOverlay = document.getElementById("scanOverlay");
const resultText = document.getElementById("resultText");
const btnCopy = document.getElementById("btnCopy");
const btnExportCSV = document.getElementById("btnExportCSV");
const historyList = document.getElementById("historyList");

const btnCameraMode = document.getElementById("btnCameraMode");
const btnImageMode = document.getElementById("btnImageMode");
const cameraSection = document.getElementById("cameraSection");
const imageSection = document.getElementById("imageSection");

const fileInput = document.getElementById("fileInput");
const imageCanvasElement = document.getElementById("imageCanvas");
const imageCanvas = imageCanvasElement.getContext("2d");

// State
let scanning = false;
let stream = null;
let scanHistory = [];
let lastScannedData = null;

// Audio beep
const beep = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqPb3J1e4SMkZiip62yub3Dxs3S1tvc3uHi5efp6+3v8fL19/n7/P3+/wEDBQcJCwwNDg8REhMUFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAEC");
beep.volume = 0.5;

function playBeep() {
    beep.currentTime = 0;
    beep.play().catch(e=>console.log(e));
}

// Mode Switching
btnCameraMode.addEventListener("click", () => {
    btnCameraMode.classList.add("btn-active");
    btnImageMode.classList.remove("btn-active");
    cameraSection.classList.add("active");
    imageSection.classList.remove("active");
    startCamera();
});

btnImageMode.addEventListener("click", () => {
    btnImageMode.classList.add("btn-active");
    btnCameraMode.classList.remove("btn-active");
    imageSection.classList.add("active");
    cameraSection.classList.remove("active");
    stopCamera();
});

// Camera Logic
function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(s) {
            stream = s;
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            scanning = true;
            requestAnimationFrame(tick);
        }).catch(err => {
            alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos o usa el modo 'Imagen'.");
            console.error(err);
        });
    } else {
        alert("Tu navegador no soporta el acceso a la cámara.");
    }
}

function stopCamera() {
    scanning = false;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

function tick() {
    if (!scanning) return;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        if (code) {
            handleSuccessfulScan(code.data);
            scanOverlay.classList.add("found");
            setTimeout(() => scanOverlay.classList.remove("found"), 1000);
        } else {
            scanOverlay.classList.remove("found");
        }
    }
    requestAnimationFrame(tick);
}

// Image File Logic
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Resize if too big, max width/height 1000 for performance
            let w = img.width;
            let h = img.height;
            if (w > 1000 || h > 1000) {
                const ratio = Math.min(1000 / w, 1000 / h);
                w *= ratio;
                h *= ratio;
            }

            imageCanvasElement.width = w;
            imageCanvasElement.height = h;
            imageCanvasElement.style.display = "block";
            imageCanvas.drawImage(img, 0, 0, w, h);

            const imageData = imageCanvas.getImageData(0, 0, w, h);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "attemptBoth",
            });

            if (code) {
                handleSuccessfulScan(code.data);
            } else {
                alert("No se encontró ningún código QR en la imagen. Intenta con una imagen más nítida o recorta la imagen para que el QR sea más grande.");
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Result Handling
function handleSuccessfulScan(data) {
    if (data === lastScannedData) return; // debounce
    lastScannedData = data;
    
    playBeep();
    resultText.value = data;
    
    const timestamp = new Date().toISOString();
    scanHistory.push({ time: timestamp, data: data });
    
    renderHistory();
    
    // reset debounce after 3 seconds
    setTimeout(() => { lastScannedData = null; }, 3000);
}

function renderHistory() {
    historyList.innerHTML = "";
    // Show newest first
    [...scanHistory].reverse().forEach(item => {
        const li = document.createElement("li");
        
        const d = new Date(item.time);
        const timeStr = d.toLocaleTimeString() + " " + d.toLocaleDateString();
        
        li.innerHTML = `<span class="time">${timeStr}</span><span class="data">${item.data}</span>`;
        historyList.appendChild(li);
    });
}

// Buttons
btnCopy.addEventListener("click", () => {
    if (resultText.value) {
        navigator.clipboard.writeText(resultText.value).then(() => {
            const orig = btnCopy.innerHTML;
            btnCopy.innerHTML = `<i class="fas fa-check"></i> Copiado`;
            setTimeout(() => btnCopy.innerHTML = orig, 2000);
        });
    }
});

btnExportCSV.addEventListener("click", () => {
    if (scanHistory.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,Fecha,Hora,Datos\n";
    scanHistory.forEach(item => {
        const d = new Date(item.time);
        const row = `"${d.toLocaleDateString()}","${d.toLocaleTimeString()}","${item.data.replace(/"/g, '""')}"`;
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `qr_lecturas_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Init
startCamera();
