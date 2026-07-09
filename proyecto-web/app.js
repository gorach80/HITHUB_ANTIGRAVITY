document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. GESTIÓN DE PESTAÑAS (TAB SWITCHER)
    // =================================================================
    const btnTab3d = document.getElementById('btn-tab-3d');
    const btnTabPizarra = document.getElementById('btn-tab-pizarra');
    const btnTabGeogebra = document.getElementById('btn-tab-geogebra');
    const btnTabPython = document.getElementById('btn-tab-python');
    
    const tab3dContent = document.getElementById('tab-3d-content');
    const tabPizarraContent = document.getElementById('tab-pizarra-content');
    const tabGeogebraContent = document.getElementById('tab-geogebra-content');
    const tabPythonContent = document.getElementById('tab-python-content');

    if (btnTab3d && btnTabPizarra && btnTabGeogebra && btnTabPython &&
        tab3dContent && tabPizarraContent && tabGeogebraContent && tabPythonContent) {
        
        btnTab3d.addEventListener('click', () => {
            setActiveTab(btnTab3d, tab3dContent);
            // Forzar redimensión de Three.js
            window.dispatchEvent(new Event('resize'));
        });

        btnTabPizarra.addEventListener('click', () => {
            setActiveTab(btnTabPizarra, tabPizarraContent);
            // Forzar redimensión de la pizarra
            window.dispatchEvent(new Event('resize-canvas'));
        });

        btnTabGeogebra.addEventListener('click', () => {
            setActiveTab(btnTabGeogebra, tabGeogebraContent);
        });

        btnTabPython.addEventListener('click', () => {
            setActiveTab(btnTabPython, tabPythonContent);
            // Renderizar el gráfico de python inicial si no se ha hecho
            runPythonCode();
        });
    }

    function setActiveTab(activeBtn, activeContent) {
        [btnTab3d, btnTabPizarra, btnTabGeogebra, btnTabPython].forEach(btn => btn.classList.remove('active'));
        [tab3dContent, tabPizarraContent, tabGeogebraContent, tabPythonContent].forEach(tab => tab.classList.remove('active'));
        
        activeBtn.classList.add('active');
        activeContent.classList.add('active');
    }

    // =================================================================
    // 2. RENDERIZADO DE KATEX LOCAL (FÓRMULAS & SOLUCIONADOR)
    // =================================================================
    const formulaContainer = document.getElementById('math-formula');
    if (formulaContainer && typeof katex !== 'undefined') {
        try {
            katex.render(
                "V_{rev} = \\Delta A \\cdot L = \\frac{(3\\sqrt{3} - \\pi) \\cdot w^2 \\cdot L}{6}",
                formulaContainer,
                { throwOnError: false, displayMode: true }
            );
        } catch (error) {
            console.error("Error al renderizar KaTeX:", error);
        }
    }

    // Renderizar fórmulas paso a paso en la pizarra
    const step1El = document.getElementById('step-formula-1');
    const step2El = document.getElementById('step-formula-2');
    const step3El = document.getElementById('step-formula-3');

    if (typeof katex !== 'undefined') {
        if (step1El) katex.render("A_{triangulo} = \\frac{\\sqrt{3}}{4} w^2", step1El, { displayMode: true });
        if (step2El) katex.render("A_{segmento} = \\frac{\\pi}{6} w^2 - \\frac{\\sqrt{3}}{4} w^2", step2El, { displayMode: true });
        if (step3El) katex.render("A_{total} = A_{triangulo} + 3 A_{segmento} = \\frac{\\pi - \\sqrt{3}}{2} w^2 \\approx 0.70477 w^2", step3El, { displayMode: true });
    }

    // =================================================================
    // 3. SÍNTESIS DE VOZ DIDÁCTICA (Web Speech API)
    // =================================================================
    const btnTtsPlay = document.getElementById('btn-tts-play');
    const btnTtsStop = document.getElementById('btn-tts-stop');
    const ttsPanel = document.getElementById('tts-panel-3d');
    const ttsStatus = document.getElementById('tts-status');
    const ttsIcon = document.getElementById('tts-icon');
    
    let synth = window.speechSynthesis;
    let utterance = null;

    if (btnTtsPlay && btnTtsStop) {
        btnTtsPlay.addEventListener('click', () => {
            if (synth.speaking) {
                synth.cancel();
            }

            const lessonText = "Hola. Bienvenido a la Plataforma Científica. En el simulador 3D puedes alterar las variables geométricas de un sólido de revolución en tiempo real. Por ejemplo, la fórmula que ves en pantalla representa el volumen del sólido de revolución de un Rotor de Reuleaux, cuya área base es aproximadamente cero coma setenta por el ancho constante al cuadrado. Modificando el ancho o la longitud, el volumen cambia proporcionalmente. Puedes usar la Pizarra o GeoGebra para profundizar en el diseño.";

            utterance = new SpeechSynthesisUtterance(lessonText);
            utterance.lang = 'es-ES';
            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            utterance.onstart = () => {
                ttsPanel.classList.add('speaking');
                ttsStatus.textContent = "Reproduciendo lección de geometría en audio...";
                ttsIcon.className = "fas fa-volume-mute";
                btnTtsPlay.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            };

            utterance.onend = () => {
                resetTtsUI();
            };

            utterance.onerror = () => {
                resetTtsUI();
            };

            synth.speak(utterance);
        });

        btnTtsStop.addEventListener('click', () => {
            if (synth.speaking) {
                synth.cancel();
            }
            resetTtsUI();
        });
    }

    function resetTtsUI() {
        if (ttsPanel) ttsPanel.classList.remove('speaking');
        if (ttsStatus) ttsStatus.textContent = "Listo para reproducir la lección didáctica por voz";
        if (ttsIcon) ttsIcon.className = "fas fa-volume-up";
        if (btnTtsPlay) btnTtsPlay.innerHTML = '<i class="fas fa-play"></i> Escuchar';
    }

    // =================================================================
    // 4. SIMULADOR THREE.JS + STATS.JS + LIL-GUI
    // =================================================================
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer && typeof THREE !== 'undefined') {
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;

        // --- MONITOR DE FPS (Stats.js) ---
        const stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.position = 'absolute';
        stats.dom.style.top = '10px';
        stats.dom.style.left = '10px';
        canvasContainer.appendChild(stats.dom);

        // --- CONFIGURACIÓN DE LA ESCENA ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);

        // --- OBJETO 3D Y LUCES ---
        const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3b82f6, 
            roughness: 0.3,
            metalness: 0.4
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // --- VARIABLES DE CONTROL (lil-gui) ---
        const settings = {
            color: '#3b82f6',
            scale: 1.0,
            speedX: 0.01,
            speedY: 0.015,
            wireframe: false,
            reset: function() {
                settings.color = '#3b82f6';
                settings.scale = 1.0;
                settings.speedX = 0.01;
                settings.speedY = 0.015;
                settings.wireframe = false;
                
                colorController.setValue(settings.color);
                scaleController.setValue(settings.scale);
                speedXController.setValue(settings.speedX);
                speedYController.setValue(settings.speedY);
                wireframeController.setValue(settings.wireframe);
            }
        };

        const gui = new lil.GUI({ container: canvasContainer, title: 'Control de Variables' });
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = '10px';
        gui.domElement.style.right = '10px';
        gui.domElement.style.zIndex = '10';
        gui.domElement.style.width = '240px';

        const colorController = gui.addColor(settings, 'color').name('Color');
        const scaleController = gui.add(settings, 'scale', 0.2, 3.0, 0.1).name('Tamaño');
        const speedXController = gui.add(settings, 'speedX', 0, 0.1, 0.005).name('Giro X');
        const speedYController = gui.add(settings, 'speedY', 0, 0.1, 0.005).name('Giro Y');
        const wireframeController = gui.add(settings, 'wireframe').name('Malla');
        gui.add(settings, 'reset').name('Restablecer');

        // --- ANIMACIÓN ---
        function animate() {
            requestAnimationFrame(animate);
            stats.begin();

            cube.rotation.x += settings.speedX;
            cube.rotation.y += settings.speedY;
            cube.scale.set(settings.scale, settings.scale, settings.scale);

            material.color.set(settings.color);
            material.wireframe = settings.wireframe;

            renderer.render(scene, camera);
            stats.end();
        }
        animate();

        // --- GRABACIÓN DE VIDEO ---
        const btnRecord = document.getElementById('btn-record');
        const recordText = document.getElementById('record-text');
        const recordIcon = document.getElementById('record-icon');
        let mediaRecorder = null;
        let recordedChunks = [];
        let isRecording = false;

        if (btnRecord) {
            btnRecord.addEventListener('click', () => {
                if (!isRecording) {
                    recordedChunks = [];
                    const stream = renderer.domElement.captureStream(30);
                    
                    try {
                        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
                    } catch (e) {
                        try {
                            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                        } catch (err) {
                            mediaRecorder = new MediaRecorder(stream);
                        }
                    }

                    mediaRecorder.ondataavailable = (ev) => {
                        if (ev.data && ev.data.size > 0) recordedChunks.push(ev.data);
                    };

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'simulacion_3d.webm';
                        document.body.appendChild(a);
                        a.click();
                        
                        setTimeout(() => {
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                        }, 100);
                    };

                    mediaRecorder.start(100);
                    isRecording = true;
                    btnRecord.style.background = 'linear-gradient(135deg, #10b981, #047857)';
                    recordText.textContent = "Detener y Guardar Grabación";
                    recordIcon.className = "fas fa-stop-circle";
                } else {
                    mediaRecorder.stop();
                    isRecording = false;
                    btnRecord.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
                    recordText.textContent = "Grabar Video de Simulación";
                    recordIcon.className = "fas fa-video";
                }
            });
        }

        // --- AJUSTE DE TAMAÑO ---
        window.addEventListener('resize', () => {
            const newWidth = canvasContainer.clientWidth;
            const newHeight = canvasContainer.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });
    }

    // =================================================================
    // 5. EDITOR MATHLIVE (MATHFIELD)
    // =================================================================
    const mathInput = document.getElementById('math-input');
    const latexOutput = document.getElementById('latex-output');

    if (mathInput && latexOutput) {
        latexOutput.textContent = mathInput.value;
        mathInput.addEventListener('input', () => {
            latexOutput.textContent = mathInput.value;
        });
    }

    // =================================================================
    // 6. PIZARRA DIGITAL INTERACTIVA (HTML5 CANVAS)
    // =================================================================
    const chalkboard = document.getElementById('chalkboard-canvas');
    if (chalkboard) {
        const ctx = chalkboard.getContext('2d');
        let isDrawing = false;
        let chalkColor = '#ffffff';
        let chalkThickness = 3;

        function resizeChalkboard() {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = chalkboard.width;
            tempCanvas.height = chalkboard.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(chalkboard, 0, 0);

            chalkboard.width = chalkboard.parentElement.clientWidth;
            chalkboard.height = 320;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = chalkColor;
            ctx.lineWidth = chalkThickness;

            ctx.drawImage(tempCanvas, 0, 0);
        }

        window.addEventListener('resize-canvas', resizeChalkboard);
        window.addEventListener('resize', resizeChalkboard);
        
        setTimeout(resizeChalkboard, 100);

        function startDrawing(e) {
            isDrawing = true;
            ctx.beginPath();
            const pos = getPos(e);
            ctx.moveTo(pos.x, pos.y);
            draw(e);
        }

        function draw(e) {
            if (!isDrawing) return;
            const pos = getPos(e);
            ctx.strokeStyle = chalkColor;
            ctx.lineWidth = chalkThickness;
            ctx.stroke();
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }

        function getPos(e) {
            const rect = chalkboard.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        chalkboard.addEventListener('mousedown', startDrawing);
        chalkboard.addEventListener('mousemove', draw);
        chalkboard.addEventListener('mouseup', stopDrawing);
        chalkboard.addEventListener('mouseleave', stopDrawing);

        chalkboard.addEventListener('touchstart', (e) => {
            startDrawing(e);
            e.preventDefault();
        });
        chalkboard.addEventListener('touchmove', (e) => {
            draw(e);
            e.preventDefault();
        });
        chalkboard.addEventListener('touchend', stopDrawing);

        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => {
                    b.style.borderColor = 'transparent';
                    b.classList.remove('active');
                });
                chalkColor = btn.getAttribute('data-color');
                btn.style.borderColor = 'var(--accent-color)';
                btn.classList.add('active');
            });
        });

        const thicknessSlider = document.getElementById('chalk-thickness');
        const thicknessVal = document.getElementById('thickness-val');
        if (thicknessSlider && thicknessVal) {
            thicknessSlider.addEventListener('input', (e) => {
                chalkThickness = e.target.value;
                thicknessVal.textContent = `${chalkThickness}px`;
            });
        }

        const btnClear = document.getElementById('btn-clear-board');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                ctx.clearRect(0, 0, chalkboard.width, chalkboard.height);
            });
        }

        const btnSave = document.getElementById('btn-save-board');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const exportCanvas = document.createElement('canvas');
                exportCanvas.width = chalkboard.width;
                exportCanvas.height = chalkboard.height;
                const exportCtx = exportCanvas.getContext('2d');

                exportCtx.fillStyle = '#13221c';
                exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                exportCtx.drawImage(chalkboard, 0, 0);

                const image = exportCanvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.download = 'pizarra_matematica.png';
                link.href = image;
                link.click();
            });
        }
    }

    // =================================================================
    // 7. INTEGRACIÓN DE GEOGEBRA SUITE CALCULADORA
    // =================================================================
    const ggbElement = document.getElementById('ggb-element');
    if (ggbElement && typeof GGBApplet !== 'undefined') {
        const params = {
            "appName": "suite",
            "width": 800,
            "height": 550,
            "showToolBar": true,
            "showAlgebraInput": true,
            "showMenuBar": true,
            "enableRightClick": true,
            "enableLabelDrags": false,
            "enableShiftDragZoom": true,
            "showResetIcon": true,
            "useBrowserForJS": true,
            "language": "es"
        };
        const applet = new GGBApplet(params, true);
        applet.inject('ggb-element');
    }

    const copyCmdBtns = document.querySelectorAll('.btn-copy-cmd');
    copyCmdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeEl = btn.parentElement.querySelector('.ggb-cmd');
            if (codeEl) {
                navigator.clipboard.writeText(codeEl.textContent).then(() => {
                    const icon = btn.querySelector('i');
                    icon.className = 'fas fa-check';
                    icon.style.color = 'var(--success-color)';
                    setTimeout(() => {
                        icon.className = 'fas fa-copy';
                        icon.style.color = '';
                    }, 1500);
                });
            }
        });
    });

    // =================================================================
    // 8. IDE PYTHON CIENTÍFICO INTERACTIVO (SIMULADO)
    // =================================================================
    const btnRunPython = document.getElementById('btn-run-python');
    const btnCopyPycode = document.getElementById('btn-copy-pycode');
    const btnResetPython = document.getElementById('btn-reset-python');
    const pyCodeArea = document.getElementById('pyCode');
    const pyConsole = document.getElementById('pyConsole');
    const matplotCanvas = document.getElementById('matplotCanvas');

    const defaultPythonCode = `# Parámetros del Rotor de Reuleaux
w = 1.80  # Ancho constante (m)
L = 5.00  # Largo del sólido de revolución (m)

# Fórmulas de Geometría Plana
area_rotor = ((3.14159 - 1.73205) / 2) * (w ** 2)
perimetro = 3.14159 * w
volumen = area_rotor * L

# Imprimir resultados en consola
print("=== ROTOR DE REULEAUX ===")
print("Ancho w       :", w, "metros")
print("Área 2D       :", area_rotor, "m2")
print("Perímetro P   :", perimetro, "m")
print("Volumen Sol.  :", volumen, "m3")`;

    if (btnRunPython && pyCodeArea && pyConsole && matplotCanvas) {
        btnRunPython.addEventListener('click', runPythonCode);
        
        btnResetPython.addEventListener('click', () => {
            pyCodeArea.value = defaultPythonCode;
            pyConsole.textContent = "▶ Listo. Presiona \"Ejecutar Script\" para iniciar el análisis...";
            runPythonCode();
        });

        btnCopyPycode.addEventListener('click', () => {
            navigator.clipboard.writeText(pyCodeArea.value).then(() => {
                btnCopyPycode.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                setTimeout(() => {
                    btnCopyPycode.innerHTML = '<i class="fas fa-copy"></i> Copiar Código';
                }, 2000);
            });
        });
    }

    function runPythonCode() {
        if (!pyCodeArea || !pyConsole || !matplotCanvas) return;
        
        const code = pyCodeArea.value;
        pyConsole.textContent = "▶ Ejecutando rotor_reuleaux.py...\n";

        setTimeout(() => {
            // Parser básico para buscar variables w y L
            let wVal = 1.80;
            let LVal = 5.00;

            const wMatch = code.match(/w\s*=\s*([0-9.]+)/);
            const LMatch = code.match(/L\s*=\s*([0-9.]+)/);

            if (wMatch) wVal = parseFloat(wMatch[1]);
            if (LMatch) LVal = parseFloat(LMatch[1]);

            // Realizar los cálculos en JS
            const pi = Math.PI;
            const sqrt3 = Math.sqrt(3);
            const area_rotor = ((pi - sqrt3) / 2) * (wVal ** 2);
            const perimetro = pi * wVal;
            const volumen = area_rotor * LVal;

            // Formatear consola
            let output = "▶ Ejecutando rotor_reuleaux.py...\n";
            output += "---------------------------------------------\n";
            output += "  === ROTOR DE REULEAUX (Simulado) ===\n";
            output += "---------------------------------------------\n";
            output += `  Ancho w       : ${wVal.toFixed(2)} metros\n`;
            output += `  Largo L       : ${LVal.toFixed(2)} metros\n`;
            output += `  Área 2D       : ${area_rotor.toFixed(5)} m²\n`;
            output += `  Perímetro P   : ${perimetro.toFixed(5)} m\n`;
            output += `  Volumen Sol.  : ${volumen.toFixed(5)} m³\n`;
            output += "---------------------------------------------\n";
            output += "✓ Gráfico generado exitosamente en Canvas.\n";
            output += `✓ Script finalizado — ${new Date().toLocaleTimeString()}`;

            pyConsole.textContent = output;

            // Dibujar la simulación gráfica de matplotlib
            drawMatplotlibSimulation(wVal);
        }, 300);
    }

    function drawMatplotlibSimulation(w) {
        const ctx = matplotCanvas.getContext('2d');
        const W = matplotCanvas.width;
        const H = matplotCanvas.height;

        // Limpiar
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, W, H);

        // Dibujar Cuadrícula de Fondo (estilo matplotlib)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 50; x < W; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 50; y < H; y += 50) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Parámetros de escala
        const cx = W / 2;
        const cy = H / 2;
        const scale = 110; // escala visual de píxeles por metro

        // Puntos del triángulo equilátero
        // El rotor tiene un ancho w. El triángulo equilátero de centros tiene lados de longitud w.
        const r = w * scale; // Radio visual
        const side = r;
        const hTri = (Math.sqrt(3) / 2) * side;

        // Centrar el triángulo en cy
        const yA = cy + hTri / 3;
        const yB = cy + hTri / 3;
        const yC = cy - (2 * hTri) / 3;

        const xA = cx - side / 2;
        const xB = cx + side / 2;
        const xC = cx;

        // Dibujar triángulo base (línea punteada)
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(xA, yA);
        ctx.lineTo(xB, yB);
        ctx.lineTo(xC, yC);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        // Rellenar y dibujar el Rotor de Reuleaux (3 arcos de radio w)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;

        ctx.beginPath();
        // Arco 1: Centrado en A, desde B hasta C (ángulo de B es 0 respecto a A, C es -60)
        // Usamos atan2 para calcular ángulos exactos
        const angleA_B = Math.atan2(yB - yA, xB - xA);
        const angleA_C = Math.atan2(yC - yA, xC - xA);
        ctx.arc(xA, yA, side, angleA_B, angleA_C, true);

        // Arco 2: Centrado en C, desde A hasta B
        const angleC_A = Math.atan2(yA - yC, xA - xC);
        const angleC_B = Math.atan2(yB - yC, xB - xC);
        ctx.arc(xC, yC, side, angleC_A, angleC_B, false);

        // Arco 3: Centrado en B, desde C hasta A
        const angleB_C = Math.atan2(yC - yB, xC - xB);
        const angleB_A = Math.atan2(yA - yB, xA - xB);
        ctx.arc(xB, yB, side, angleB_C, angleB_A, false);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dibujar centros de arcos (puntos A, B, C)
        ctx.fillStyle = '#f59e0b';
        [ {x:xA, y:yA, l:'A'}, {x:xB, y:yB, l:'B'}, {x:xC, y:yC, l:'C'} ].forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '10px monospace';
            ctx.fillText(p.l, p.x + 8, p.y + 4);
            ctx.fillStyle = '#f59e0b';
        });

        // Centroide (G)
        ctx.fillStyle = '#a855f7';
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('G', cx - 12, cy - 8);

        // Ejes de coordenadas simulados
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(W - 20, cy); ctx.stroke(); // Eje X
        ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, H - 20); ctx.stroke(); // Eje Y

        // Etiquetas
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Rotor de Reuleaux (Ancho constante w = ${w.toFixed(2)}m)`, 20, 30);
        ctx.fillText('Eje Y (m)', cx - 55, 30);
        ctx.fillText('Eje X (m)', W - 75, cy + 18);
    }
});
