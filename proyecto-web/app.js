document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. GESTIÓN DE PESTAÑAS (TAB SWITCHER)
    // =================================================================
    const btnTab3d = document.getElementById('btn-tab-3d');
    const btnTabPizarra = document.getElementById('btn-tab-pizarra');
    const btnTabGeogebra = document.getElementById('btn-tab-geogebra');
    const tab3dContent = document.getElementById('tab-3d-content');
    const tabPizarraContent = document.getElementById('tab-pizarra-content');
    const tabGeogebraContent = document.getElementById('tab-geogebra-content');

    if (btnTab3d && btnTabPizarra && btnTabGeogebra && tab3dContent && tabPizarraContent && tabGeogebraContent) {
        btnTab3d.addEventListener('click', () => {
            btnTab3d.classList.add('active');
            btnTabPizarra.classList.remove('active');
            btnTabGeogebra.classList.remove('active');
            tab3dContent.classList.add('active');
            tabPizarraContent.classList.remove('active');
            tabGeogebraContent.classList.remove('active');
            
            // Forzar redimensión de Three.js
            window.dispatchEvent(new Event('resize'));
        });

        btnTabPizarra.addEventListener('click', () => {
            btnTabPizarra.classList.add('active');
            btnTab3d.classList.remove('active');
            btnTabGeogebra.classList.remove('active');
            tabPizarraContent.classList.add('active');
            tab3dContent.classList.remove('active');
            tabGeogebraContent.classList.remove('active');
            
            // Forzar redimensión de la pizarra
            window.dispatchEvent(new Event('resize-canvas'));
        });

        btnTabGeogebra.addEventListener('click', () => {
            btnTabGeogebra.classList.add('active');
            btnTab3d.classList.remove('active');
            btnTabPizarra.classList.remove('active');
            tabGeogebraContent.classList.add('active');
            tab3dContent.classList.remove('active');
            tabPizarraContent.classList.remove('active');
        });
    }

    // =================================================================
    // 2. RENDERIZADO DE KATEX LOCAL (FÓRMULA 3D)
    // =================================================================
    const formulaContainer = document.getElementById('math-formula');
    if (formulaContainer && typeof katex !== 'undefined') {
        try {
            katex.render(
                "V_{rev} = \\Delta A \\cdot L = \\frac{(3\\sqrt{3} - \\pi) \\cdot w^2 \\cdot L}{6}",
                formulaContainer,
                {
                    throwOnError: false,
                    displayMode: true
                }
            );
        } catch (error) {
            console.error("Error al renderizar KaTeX:", error);
            formulaContainer.textContent = "Error al cargar la fórmula.";
        }
    }

    // =================================================================
    // 3. SIMULADOR THREE.JS + STATS.JS + LIL-GUI
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
    // 4. EDITOR MATHLIVE (MATHFIELD)
    // =================================================================
    const mathInput = document.getElementById('math-input');
    const latexOutput = document.getElementById('latex-output');

    if (mathInput && latexOutput) {
        // Inicializar texto
        latexOutput.textContent = mathInput.value;

        // Escuchar cambios de fórmula matemática en tiempo real
        mathInput.addEventListener('input', () => {
            latexOutput.textContent = mathInput.value;
        });
    }

    // =================================================================
    // 5. PIZARRA DIGITAL INTERACTIVA (HTML5 CANVAS)
    // =================================================================
    const chalkboard = document.getElementById('chalkboard-canvas');
    if (chalkboard) {
        const ctx = chalkboard.getContext('2d');
        let isDrawing = false;
        let chalkColor = '#ffffff';
        let chalkThickness = 3;

        // Configuración de resolución interna del Canvas
        function resizeChalkboard() {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = chalkboard.width;
            tempCanvas.height = chalkboard.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(chalkboard, 0, 0);

            chalkboard.width = chalkboard.parentElement.clientWidth;
            chalkboard.height = 400;

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
    // 6. INTEGRACIÓN DE GEOGEBRA SUITE CALCULADORA
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
        
        // Inyectar el entorno de GeoGebra
        applet.inject('ggb-element');
    }

    // Lógica para botones de copiado de comandos de GeoGebra
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
});
