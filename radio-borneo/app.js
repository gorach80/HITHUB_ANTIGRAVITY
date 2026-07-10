/* =====================================================
   RADIO DE BORNEO y ÁREA DE SEGURIDAD
   Anclajes de Boyas Marítimas Offshore
   Puerto de La Libertad — Transferencia de Hidrocarburos

   Módulos: Three.js · lil-gui · Stats.js · KaTeX
            · Web Speech · MediaRecorder · MathLive
            · GeoGebra · IDE Python simulado
   ===================================================== */

import * as THREE from 'three';
import { GUI } from 'lil-gui';
import Stats from 'stats.js';

/* =====================================================
   NAVEGACIÓN POR PESTAÑAS
   ===================================================== */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`panel-${target}`).classList.add('active');
    if (target === 'sim' && typeof resizeRenderer === 'function') {
      setTimeout(resizeRenderer, 50);
    }
    if (target === 'python') {
      setTimeout(drawPythonCanvas, 50);
    }
    if (target === 'geogebra' && !ggbInjected) {
      injectGeoGebra();
      ggbInjected = true;
    }
  });
});

/* =====================================================
   PESTAÑA 1 — SIMULADOR 3D: Boya, cadena, ancla, océano
   ===================================================== */
let scene, camera, renderer, stats;
let buoy, chain, anchor, borneoCircle, exclusionZone, waterMesh, seafloor;
let starField, buoyLight, velocityArrow;
let waterGeo;

const simParams = {
  profundidad: 15.0,        // h (m)
  longitudCadena: 20.0,     // L (m)
  velocidadOscilacion: 1.0,
  amplitudOleaje: 0.3,
  colorBoya: '#ff5e94',
  distanciaZona: 12.0,      // D (m) — distancia ancla a zona exclusión
  mostrarMalla: true,
  mostrarBorneo: true,
  mostrarZona: true,
};

// Dimensiones de la zona de exclusión rectangular (m)
const ZONA_LARGO = 16.0;
const ZONA_ANCHO = 10.0;

function initThree() {
  const container = document.getElementById('three-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03060f);
  scene.fog = new THREE.FogExp2(0x061029, 0.018);

  camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 500);
  camera.position.set(22, 14, 26);
  camera.lookAt(0, -2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // ===== Luces =====
  const ambient = new THREE.AmbientLight(0x3a5a8a, 0.6);
  scene.add(ambient);

  const sunLight = new THREE.DirectionalLight(0xaad4ff, 1.2);
  sunLight.position.set(15, 30, 10);
  scene.add(sunLight);

  const moonLight = new THREE.DirectionalLight(0xb388ff, 0.4);
  moonLight.position.set(-15, 20, -10);
  scene.add(moonLight);

  // ===== Superficie del agua (plano animado) =====
  waterGeo = new THREE.PlaneGeometry(80, 80, 80, 80);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x0a2a55,
    transparent: true,
    opacity: 0.55,
    shininess: 80,
    specular: 0x39e0ff,
    side: THREE.DoubleSide,
  });
  waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = 0;
  scene.add(waterMesh);

  // Línea de flotación (contorno del agua)
  const waterLineGeo = new THREE.RingGeometry(0.1, 35, 64, 1);
  waterLineGeo.rotateX(-Math.PI / 2);
  const waterLineMat = new THREE.MeshBasicMaterial({
    color: 0x39e0ff, transparent: true, opacity: 0.06, side: THREE.DoubleSide
  });
  const waterGlow = new THREE.Mesh(waterLineGeo, waterLineMat);
  waterGlow.position.y = 0.01;
  scene.add(waterGlow);

  // ===== Fondo del mar =====
  const seafloorGeo = new THREE.PlaneGeometry(80, 80);
  seafloorGeo.rotateX(-Math.PI / 2);
  const seafloorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1208, roughness: 0.95, metalness: 0.1
  });
  seafloor = new THREE.Mesh(seafloorGeo, seafloorMat);
  seafloor.position.y = -simParams.profundidad;
  scene.add(seafloor);

  // ===== Boya (grupo: cuerpo + cono + luz) =====
  buoy = new THREE.Group();

  const bodyGeo = new THREE.CylinderGeometry(0.7, 0.9, 1.8, 24);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: simParams.colorBoya, emissive: simParams.colorBoya,
    emissiveIntensity: 0.15, roughness: 0.5, metalness: 0.3
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.9;
  buoy.add(body);

  const coneGeo = new THREE.ConeGeometry(0.7, 1.2, 24);
  const coneMat = new THREE.MeshStandardMaterial({
    color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.2,
    roughness: 0.4, metalness: 0.4
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = 2.4;
  buoy.add(cone);

  // Luz de navegación
  const lightGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0x7cffb0 });
  const navLight = new THREE.Mesh(lightGeo, lightMat);
  navLight.position.y = 3.2;
  navLight.name = 'navLight';
  buoy.add(navLight);

  // Halo de la luz
  const haloTex = createGlowTexture('#7cffb0');
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex, color: 0x7cffb0, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(2.5, 2.5, 1);
  halo.position.y = 3.2;
  buoy.add(halo);

  // Punto de luz en la boya
  buoyLight = new THREE.PointLight(0x7cffb0, 1.5, 15, 2);
  buoyLight.position.y = 3.2;
  buoy.add(buoyLight);

  scene.add(buoy);

  // ===== Cadena (línea de boya a ancla) =====
  const chainMat = new THREE.LineBasicMaterial({
    color: 0x9fb4d8, transparent: true, opacity: 0.7
  });
  const chainGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -simParams.profundidad, 0)
  ]);
  chain = new THREE.Line(chainGeo, chainMat);
  scene.add(chain);

  // ===== Ancla =====
  const anchorGroup = new THREE.Group();
  const anchorBaseGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
  const anchorMat = new THREE.MeshStandardMaterial({
    color: 0x4a3a2a, roughness: 0.9, metalness: 0.2
  });
  const anchorBase = new THREE.Mesh(anchorBaseGeo, anchorMat);
  anchorGroup.add(anchorBase);

  // Pico del ancla
  const spikeGeo = new THREE.ConeGeometry(0.3, 1.0, 4);
  const spike = new THREE.Mesh(spikeGeo, anchorMat);
  spike.position.y = -0.5;
  spike.rotation.x = Math.PI;
  anchorGroup.add(spike);

  anchorGroup.position.y = -simParams.profundidad + 0.25;
  anchor = anchorGroup;
  scene.add(anchor);

  // ===== Círculo de Borneo (toro en la superficie) =====
  const borneoGeo = new THREE.TorusGeometry(1, 0.05, 8, 96);
  borneoGeo.rotateX(-Math.PI / 2);
  const borneoMat = new THREE.MeshBasicMaterial({
    color: 0x39e0ff, transparent: true, opacity: 0.7
  });
  borneoCircle = new THREE.Mesh(borneoGeo, borneoMat);
  borneoCircle.position.y = 0.02;
  scene.add(borneoCircle);

  // ===== Zona de exclusión (rectángulo en superficie) =====
  const zonePoints = [];
  const zL = ZONA_LARGO, zW = ZONA_ANCHO;
  const cx = simParams.distanciaZona + zL / 2;
  zonePoints.push(new THREE.Vector3(cx - zL/2, 0.05, -zW/2));
  zonePoints.push(new THREE.Vector3(cx + zL/2, 0.05, -zW/2));
  zonePoints.push(new THREE.Vector3(cx + zL/2, 0.05,  zW/2));
  zonePoints.push(new THREE.Vector3(cx - zL/2, 0.05,  zW/2));
  zonePoints.push(new THREE.Vector3(cx - zL/2, 0.05, -zW/2));
  const zoneGeo = new THREE.BufferGeometry().setFromPoints(zonePoints);
  const zoneMat = new THREE.LineBasicMaterial({
    color: 0xff5e94, transparent: true, opacity: 0.85
  });
  exclusionZone = new THREE.Line(zoneGeo, zoneMat);
  scene.add(exclusionZone);

  // Relleno semitransparente de la zona
  const zoneFillGeo = new THREE.BufferGeometry().setFromPoints([
    zonePoints[0], zonePoints[1], zonePoints[2], zonePoints[3]
  ]);
  const zoneFillMat = new THREE.MeshBasicMaterial({
    color: 0xff5e94, transparent: true, opacity: 0.08, side: THREE.DoubleSide
  });
  const zoneFill = new THREE.Mesh(zoneFillGeo, zoneFillMat);
  zoneFill.position.y = 0.04;
  exclusionZone.add(zoneFill);

  // ===== Vector de velocidad (tangente a la órbita) =====
  velocityArrow = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    2, 0xffd166, 0.5, 0.25
  );
  scene.add(velocityArrow);

  // ===== Malla polar en el fondo =====
  const grid = new THREE.PolarGridHelper(20, 8, 6, 64, 0x1a3a6a, 0x122457);
  grid.position.y = -simParams.profundidad + 0.1;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);
  window.__simGrid = grid;

  // ===== Estrellas / partículas de rocío =====
  buildStarField();

  // ===== Stats =====
  stats = new Stats();
  stats.showPanel(0);
  document.getElementById('stats-container').appendChild(stats.dom);

  // ===== Resize =====
  window.addEventListener('resize', resizeRenderer);

  // Recalcular geometría inicial
  updateBorneoGeometry();

  animate();
}

function createGlowTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(124,255,176,1)');
  grad.addColorStop(0.25, 'rgba(124,255,176,0.7)');
  grad.addColorStop(0.5, 'rgba(124,255,176,0.3)');
  grad.addColorStop(1, 'rgba(124,255,176,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function buildStarField() {
  const starCount = 800;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 80 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.5; // hemisferio superior
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) + 10;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const tint = Math.random();
    if (tint > 0.8) { colors[i*3] = 0.7; colors[i*3+1] = 0.85; colors[i*3+2] = 1.0; }
    else { colors[i*3] = 1.0; colors[i*3+1] = 1.0; colors[i*3+2] = 1.0; }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.35, vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false
  });
  starField = new THREE.Points(geo, mat);
  scene.add(starField);
}

/* =====================================================
   GEOMETRÍA DEL BORNEO
   r = sqrt(L^2 - h^2)
   ===================================================== */
function calcularRadioBorneo() {
  const L = simParams.longitudCadena;
  const h = simParams.profundidad;
  if (L <= h) return 0;
  return Math.sqrt(L * L - h * h);
}

function updateBorneoGeometry() {
  const r = calcularRadioBorneo();
  borneoCircle.scale.set(r, r, r);
  borneoCircle.visible = simParams.mostrarBorneo && r > 0;

  // Actualizar seafloor y ancla según profundidad
  seafloor.position.y = -simParams.profundidad;
  anchor.position.y = -simParams.profundidad + 0.25;
  if (window.__simGrid) {
    window.__simGrid.position.y = -simParams.profundidad + 0.1;
  }

  // Actualizar zona de exclusión
  const zL = ZONA_LARGO, zW = ZONA_ANCHO;
  const cx = simParams.distanciaZona + zL / 2;
  const zonePoints = [
    new THREE.Vector3(cx - zL/2, 0.05, -zW/2),
    new THREE.Vector3(cx + zL/2, 0.05, -zW/2),
    new THREE.Vector3(cx + zL/2, 0.05,  zW/2),
    new THREE.Vector3(cx - zL/2, 0.05,  zW/2),
    new THREE.Vector3(cx - zL/2, 0.05, -zW/2),
  ];
  exclusionZone.geometry.dispose();
  exclusionZone.geometry = new THREE.BufferGeometry().setFromPoints(zonePoints);
  exclusionZone.visible = simParams.mostrarZona;

  // Actualizar fórmulas KaTeX
  renderKeplerFormula();
}

let oscillationAngle = 0;
const clock = new THREE.Clock();

function animate() {
  stats.begin();
  const dt = clock.getDelta();
  const time = clock.elapsedTime;

  // Oscilación de la boya
  oscillationAngle += dt * simParams.velocidadOscilacion * 0.8;
  const r = calcularRadioBorneo();
  const x = r * Math.cos(oscillationAngle);
  const z = r * Math.sin(oscillationAngle);
  buoy.position.set(x, 0, z);

  // Oleaje vertical sutil de la boya
  const wave = Math.sin(time * 2) * simParams.amplitudOleaje;
  buoy.position.y = wave;
  buoy.rotation.z = Math.sin(time * 1.5) * 0.08;
  buoy.rotation.x = Math.cos(time * 1.3) * 0.05;

  // Cadena de boya a ancla
  const chainPoints = [
    new THREE.Vector3(x, wave, z),
    new THREE.Vector3(0, -simParams.profundidad, 0)
  ];
  chain.geometry.dispose();
  chain.geometry = new THREE.BufferGeometry().setFromPoints(chainPoints);

  // Vector de velocidad (tangente a la órbita)
  const vx = -r * Math.sin(oscillationAngle);
  const vz =  r * Math.cos(oscillationAngle);
  const vDir = new THREE.Vector3(vx, 0, vz).normalize();
  const speed = Math.sqrt(vx*vx + vz*vz);
  velocityArrow.position.copy(buoy.position);
  velocityArrow.position.y = 1.5;
  velocityArrow.setDirection(vDir);
  velocityArrow.setLength(Math.max(1.5, speed * 0.5), 0.5, 0.25);

  // Animación del agua
  const positions = waterGeo.attributes.position;
  const amp = simParams.amplitudOleaje;
  for (let i = 0; i < positions.count; i++) {
    const px = positions.getX(i);
    const pz = positions.getZ(i);
    const py = Math.sin(px * 0.25 + time * 1.2) * amp +
               Math.cos(pz * 0.25 + time * 0.9) * amp * 0.7 +
               Math.sin((px + pz) * 0.15 + time * 0.6) * amp * 0.4;
    positions.setY(i, py);
  }
  positions.needsUpdate = true;
  waterGeo.computeVertexNormals();

  // Parpadeo de la luz de navegación
  const navLight = buoy.getObjectByName('navLight');
  if (navLight) {
    const blink = (Math.sin(time * 4) > 0.6) ? 1.0 : 0.2;
    navLight.material.opacity = blink;
    buoyLight.intensity = 1.0 + blink * 1.5;
  }

  // Comprobar seguridad
  checkSafetyStatus(r);

  // Estrellas rotan
  starField.rotation.y += 0.0002;

  // Malla visible
  if (window.__simGrid) window.__simGrid.visible = simParams.mostrarMalla;

  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
}

/* =====================================================
   INDICADOR DE SEGURIDAD
   ===================================================== */
function checkSafetyStatus(r) {
  const indicator = document.getElementById('safety-indicator');
  const text = document.getElementById('safety-text');
  if (!indicator) return;

  const D = simParams.distanciaZona;
  if (r > D) {
    indicator.className = 'safety-indicator danger';
    text.textContent = `PELIGRO: r=${r.toFixed(1)}m > D=${D}m`;
  } else if (r > D * 0.85) {
    indicator.className = 'safety-indicator danger';
    text.textContent = `ALERTA: r=${r.toFixed(1)}m ≈ D=${D}m`;
  } else {
    indicator.className = 'safety-indicator safe';
    text.textContent = `SEGURO: r=${r.toFixed(1)}m ≤ D=${D}m`;
  }
}

function resizeRenderer() {
  const container = document.getElementById('three-container');
  if (!container || !renderer) return;
  const w = container.clientWidth, h = container.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/* =====================================================
   LIL-GUI
   ===================================================== */
function initGUI() {
  const gui = new GUI({
    container: document.getElementById('lil-gui-container'),
    title: 'Parámetros de Anclaje'
  });

  gui.add(simParams, 'profundidad', 5.0, 30.0, 0.5).name('Profundidad h (m)').onChange(updateBorneoGeometry);
  gui.add(simParams, 'longitudCadena', 6.0, 40.0, 0.5).name('Cadena L (m)').onChange(updateBorneoGeometry);
  gui.add(simParams, 'distanciaZona', 5.0, 30.0, 0.5).name('Distancia zona D (m)').onChange(updateBorneoGeometry);
  gui.add(simParams, 'velocidadOscilacion', 0.0, 3.0, 0.05).name('Velocidad Borneo');
  gui.add(simParams, 'amplitudOleaje', 0.0, 1.0, 0.05).name('Amplitud Oleaje');
  gui.addColor(simParams, 'colorBoya').name('Color de Boya').onChange(v => {
    buoy.children.forEach(c => {
      if (c.isMesh && c.geometry.type === 'CylinderGeometry') {
        c.material.color.set(v);
        c.material.emissive.set(v);
      }
    });
  });
  gui.add(simParams, 'mostrarMalla').name('Mostrar Malla');
  gui.add(simParams, 'mostrarBorneo').name('Mostrar Borneo').onChange(v => borneoCircle.visible = v);
  gui.add(simParams, 'mostrarZona').name('Mostrar Zona').onChange(updateBorneoGeometry);
}

/* =====================================================
   GRABADOR DE VIDEO (MediaRecorder)
   ===================================================== */
let mediaRecorder, recordedChunks = [], recordTimer, recordSeconds = 0;
const btnRecord = document.getElementById('btn-record');
const btnDownload = document.getElementById('btn-download');
const recordTime = document.getElementById('record-time');

btnRecord.addEventListener('click', () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') startRecording();
  else stopRecording();
});

function startRecording() {
  const canvas = renderer.domElement;
  const stream = canvas.captureStream(60);
  recordedChunks = [];
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

  mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
  mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    btnDownload.href = url;
    btnDownload.classList.remove('hidden');
  };
  mediaRecorder.start();
  btnRecord.classList.add('recording');
  btnRecord.querySelector('span').textContent = 'Detener';
  btnRecord.querySelector('i').className = 'fa-solid fa-stop';
  recordSeconds = 0;
  recordTimer = setInterval(() => {
    recordSeconds++;
    const m = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
    const s = String(recordSeconds % 60).padStart(2, '0');
    recordTime.textContent = `${m}:${s}`;
  }, 1000);
}
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  clearInterval(recordTimer);
  btnRecord.classList.remove('recording');
  btnRecord.querySelector('span').textContent = 'Grabar';
  btnRecord.querySelector('i').className = 'fa-solid fa-circle';
}

/* =====================================================
   NARRADOR POR VOZ (Web Speech API)
   ===================================================== */
const voiceText = `
Bienvenido al laboratorio interactivo de Radio de Borneo y Áreas de Seguridad para anclajes de boyas marítimas offshore en el Puerto de La Libertad.
En las operaciones de transferencia de hidrocarburos y fondeo portuario, las boyas flotantes describen una trayectoria circular de oscilación conocida como círculo de Borneo, generada por la acción combinada del oleaje, las corrientes marinas y el viento.
El radio máximo de este círculo depende de la geometría del sistema de fondeo. Aplicando el teorema de Pitágoras al triángulo rectángulo formado por la profundidad del mar como cateto vertical, el radio horizontal como cateto horizontal y la longitud de la cadena como hipotenusa, obtenemos que el radio de Borneo es igual a la raíz cuadrada de la diferencia entre el cuadrado de la longitud de la cadena y el cuadrado de la profundidad.
Este radio define la zona de movimiento de la boya sobre la superficie del mar. Para garantizar la seguridad de los buques cisterna, se establece una zona de exclusión rectangular portuaria.
El análisis del solapamiento entre el círculo de Borneo y esta zona permite determinar el radio crítico, que corresponde a la condición de tangencia entre el círculo y el borde de la zona de exclusión.
Cuando el radio de Borneo excede la distancia desde el ancla hasta la zona, existe riesgo de colisión. Observe en la simulación cómo la boya oscila describiendo un círculo sobre el agua, mientras la cadena se mantiene anclada al fondo marino.
`.trim();

const voicePlay  = document.getElementById('voice-play');
const voiceStop  = document.getElementById('voice-stop');
const soundWave  = document.getElementById('sound-wave');
const voiceTextBox = document.getElementById('voice-text');

voicePlay.addEventListener('click', () => {
  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no soporta la API de voz.');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(voiceText);
  utter.lang = 'es-ES';
  utter.rate = 0.95;
  utter.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es'));
  if (esVoice) utter.voice = esVoice;
  utter.onstart = () => {
    soundWave.classList.add('active');
    voiceTextBox.textContent = voiceText;
  };
  utter.onend = () => soundWave.classList.remove('active');
  window.speechSynthesis.speak(utter);
});
voiceStop.addEventListener('click', () => {
  window.speechSynthesis.cancel();
  soundWave.classList.remove('active');
});

/* =====================================================
   KATEX — Fórmulas del Radio de Borneo y Radio Crítico
   ===================================================== */
function renderKeplerFormula() {
  const el = document.getElementById('katex-kepler');
  const h = simParams.profundidad;
  const L = simParams.longitudCadena;
  const tex = String.raw`r = \sqrt{L^2 - h^2} = \sqrt{${L}^2 - ${h}^2}`;
  if (window.katex) {
    katex.render(tex, el, { throwOnError: false, displayMode: true });
  }

  const elC = document.getElementById('katex-critical');
  const D = simParams.distanciaZona;
  const texC = String.raw`r_{\text{crit}} = D = ${D}\ \text{m}`;
  if (window.katex) {
    katex.render(texC, elC, { throwOnError: false, displayMode: true });
  }
}

/* =====================================================
   PESTAÑA 2 — PIZARRA CANVAS
   ===================================================== */
const blackboard = document.getElementById('blackboard');
const bbCtx = blackboard.getContext('2d');
let drawing = false, lastX = 0, lastY = 0;
let chalkColor = '#ffffff';
let chalkSize = 3;

function setupBlackboard() {
  const ratio = window.devicePixelRatio || 1;
  const rect = blackboard.getBoundingClientRect();
  blackboard.width  = rect.width * ratio;
  blackboard.height = rect.height * ratio;
  bbCtx.scale(ratio, ratio);
  bbCtx.lineCap = 'round';
  bbCtx.lineJoin = 'round';

  blackboard.addEventListener('pointerdown', startDraw);
  blackboard.addEventListener('pointermove', moveDraw);
  blackboard.addEventListener('pointerup', endDraw);
  blackboard.addEventListener('pointerleave', endDraw);
}

function getPos(e) {
  const rect = blackboard.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
function startDraw(e) {
  drawing = true;
  const p = getPos(e);
  lastX = p.x; lastY = p.y;
  bbCtx.beginPath();
  bbCtx.moveTo(lastX, lastY);
}
function moveDraw(e) {
  if (!drawing) return;
  const p = getPos(e);
  bbCtx.strokeStyle = chalkColor;
  bbCtx.lineWidth = chalkSize;
  bbCtx.shadowColor = chalkColor;
  bbCtx.shadowBlur = 4;
  bbCtx.lineTo(p.x, p.y);
  bbCtx.stroke();
  lastX = p.x; lastY = p.y;
}
function endDraw() {
  drawing = false;
  bbCtx.shadowBlur = 0;
}

document.getElementById('chalk-color').addEventListener('input', e => chalkColor = e.target.value);
document.querySelectorAll('.chalk-preset').forEach(b => {
  b.addEventListener('click', () => {
    chalkColor = b.dataset.color;
    document.getElementById('chalk-color').value = chalkColor;
  });
});
const sizeSlider = document.getElementById('chalk-size');
const sizeVal = document.getElementById('chalk-size-val');
sizeSlider.addEventListener('input', e => {
  chalkSize = parseInt(e.target.value, 10);
  sizeVal.textContent = chalkSize;
});
document.getElementById('board-clear').addEventListener('click', () => {
  bbCtx.clearRect(0, 0, blackboard.width, blackboard.height);
});
document.getElementById('board-save').addEventListener('click', () => {
  const tmp = document.createElement('canvas');
  tmp.width = blackboard.width; tmp.height = blackboard.height;
  const tctx = tmp.getContext('2d');
  tctx.fillStyle = '#050b1f';
  tctx.fillRect(0, 0, tmp.width, tmp.height);
  tctx.drawImage(blackboard, 0, 0);
  const link = document.createElement('a');
  link.download = 'pizarra-borneo.png';
  link.href = tmp.toDataURL('image/png');
  link.click();
});

/* =====================================================
   SOLUCIONADOR POR PASOS (KaTeX)
   ===================================================== */
const solverContent = document.getElementById('solver-content');
const solverTabs = document.querySelectorAll('.solver-tab');
let currentSolver = 'borneo';

const solvers = {
  borneo: [
    {
      label: 'Paso 1 · Sistema de anclaje',
      text: 'Una boya marítima offshore se fondea mediante una cadena de longitud L que desciende desde la boya en la superficie hasta el ancla en el fondo marino, a una profundidad h. Cuando el oleaje y las corrientes desplazan la boya, la cadena forma un triángulo rectángulo en el plano vertical.',
      formula: String.raw`\text{Hipotenusa} = L,\quad \text{Cateto vertical} = h,\quad \text{Cateto horizontal} = r`
    },
    {
      label: 'Paso 2 · Teorema de Pitágoras',
      text: 'Aplicando el teorema de Pitágoras al triángulo rectángulo formado por la cadena (hipotenusa), la profundidad (cateto vertical) y el desplazamiento horizontal (cateto horizontal):',
      formula: String.raw`L^2 = h^2 + r^2`
    },
    {
      label: 'Paso 3 · Despeje del radio r',
      text: 'Despejando el radio horizontal r de la ecuación pitagórica obtenemos la fórmula del radio de Borneo:',
      formula: String.raw`r = \sqrt{L^2 - h^2}`
    },
    {
      label: 'Paso 4 · Restricción física',
      text: 'Para que la fórmula tenga sentido físico, la cadena debe ser más larga que la profundidad (L > h). Si L = h, la cadena queda vertical y r = 0 (boya directamente sobre el ancla). Si L < h, el sistema es inviable.',
      formula: String.raw`L > h \;\Longleftrightarrow\; r > 0`
    },
    {
      label: 'Paso 5 · Ejemplo numérico',
      text: 'Para el Puerto de La Libertad: profundidad h = 15 m, cadena L = 20 m. El radio de Borneo resulta:',
      formula: String.raw`r = \sqrt{20^2 - 15^2} = \sqrt{400 - 225} = \sqrt{175} \approx 13.23\ \text{m}`
    }
  ],
  solapamiento: [
    {
      label: 'Paso 1 · Zona de exclusión',
      text: 'Se define una zona de exclusión rectangular portuaria para proteger a los buques cisterna. El borde más cercano de esta zona se encuentra a una distancia D del punto de anclaje. La boya describe un círculo de Borneo de radio r centrado en el ancla.',
      formula: String.raw`\text{Círculo: } x^2 + z^2 = r^2 \qquad \text{Zona: } x \geq D`
    },
    {
      label: 'Paso 2 · Condición de solapamiento',
      text: 'Existe solapamiento cuando el círculo de Borneo invade la zona de exclusión, es decir, cuando el radio r supera la distancia D al borde más cercano:',
      formula: String.raw`r > D \;\Longrightarrow\; \text{solapamiento crítico}`
    },
    {
      label: 'Paso 3 · Área de solapamiento',
      text: 'El área de solapamiento entre el círculo y el semiplano definido por la zona se calcula como el segmento circular. Donde d = D es la distancia del centro al borde:',
      formula: String.raw`A_{\text{solap}} = r^2 \arccos\!\left(\frac{D}{r}\right) - D\,\sqrt{r^2 - D^2}`
    },
    {
      label: 'Paso 4 · Razón métrica crítica',
      text: 'La razón métrica del área de solapamiento respecto al área total del círculo de Borneo cuantifica la fracción de la zona de movimiento que invade la zona de exclusión:',
      formula: String.raw`\eta = \frac{A_{\text{solap}}}{\pi r^2} = \frac{\arccos(D/r)}{\pi} - \frac{D\,\sqrt{r^2 - D^2}}{\pi r^2}`
    },
    {
      label: 'Paso 5 · Radio crítico mínimo',
      text: 'El radio crítico se define por la condición de tangencia: el círculo toca el borde de la zona sin invadirla. Para evitar la colisión de buques cisterna se debe cumplir:',
      formula: String.raw`r_{\text{crit}} = D \qquad \Longrightarrow \qquad L_{\text{max}} = \sqrt{h^2 + D^2}`
    },
    {
      label: 'Paso 6 · Criterio de seguridad',
      text: 'La condición de seguridad portuaria exige que el radio de Borneo sea menor o igual que la distancia a la zona de exclusión. Si se conoce h y D fijos, la longitud máxima de cadena admisible es:',
      formula: String.raw`r \leq D \;\Longleftrightarrow\; L \leq \sqrt{h^2 + D^2}`
    }
  ]
};

function renderSolver() {
  solverContent.innerHTML = '';
  const steps = solvers[currentSolver];
  steps.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'solver-step';
    div.style.opacity = '0';
    div.style.transform = 'translateX(-10px)';
    div.style.transition = 'all 0.4s ease';
    div.innerHTML = `<span class="step-label">${s.label}</span>`;
    if (s.text) {
      const p = document.createElement('p');
      p.className = 'step-text';
      p.textContent = s.text;
      div.appendChild(p);
    }
    if (s.formula) {
      const f = document.createElement('div');
      f.className = 'step-formula';
      div.appendChild(f);
      setTimeout(() => {
        katex.render(s.formula, f, { throwOnError: false, displayMode: true });
      }, 50);
    }
    solverContent.appendChild(div);
    setTimeout(() => {
      div.style.opacity = '1';
      div.style.transform = 'translateX(0)';
    }, 80 + i * 120);
  });
}

solverTabs.forEach(t => {
  t.addEventListener('click', () => {
    solverTabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentSolver = t.dataset.solver;
    renderSolver();
  });
});
document.getElementById('solver-run').addEventListener('click', renderSolver);

/* =====================================================
   PESTAÑA 3 — GEOGEBRA
   ===================================================== */
let ggbInjected = false;
const ggbCommands = [
  { label: 'h = 15  (profundidad)',     cmd: 'h=15' },
  { label: 'L = 20  (cadena)',          cmd: 'L=20' },
  { label: 'r = sqrt(L² - h²)',         cmd: 'r=sqrt(L^2-h^2)' },
  { label: 'Círculo de Borneo',         cmd: 'Circulo[(0,0), r]' },
  { label: 'Ancla en el origen',        cmd: 'A=(0,0)' },
  { label: 'D = 12  (distancia zona)',  cmd: 'D=12' },
  { label: 'Borde zona exclusión',      cmd: 'B=(D,0)' },
  { label: 'Rectángulo exclusión',      cmd: 'Poligono[(D,-5),(D+16,-5),(D+16,5),(D,5)]' },
  { label: 'Punto de tangencia',        cmd: 'T=(D, sqrt(r^2-D^2))' },
  { label: 'Distancia ancla-zona',      cmd: 'd=Distancia[A, Segmento[(D,-5),(D,5)]]' },
  { label: 'Área solapamiento',         cmd: 'a=r^2*arccos(D/r)-D*sqrt(r^2-D^2)' },
  { label: 'Razón métrica η',           cmd: 'eta=a/(pi*r^2)' },
  { label: 'Radio crítico',             cmd: 'r_crit=D' },
  { label: 'Longitud máx. cadena',      cmd: 'L_max=sqrt(h^2+D^2)' },
];

function renderGgbCommands() {
  const wrap = document.getElementById('ggb-commands');
  wrap.innerHTML = '';
  ggbCommands.forEach(item => {
    const div = document.createElement('div');
    div.className = 'ggb-command';
    div.innerHTML = `<span>${item.label}</span><i class="fa-regular fa-copy"></i>`;
    div.addEventListener('click', () => {
      navigator.clipboard.writeText(item.cmd).then(() => {
        div.classList.add('copied');
        const status = document.getElementById('ggb-status');
        status.textContent = '✓ Copiado: ' + item.cmd;
        setTimeout(() => {
          div.classList.remove('copied');
          status.textContent = '';
        }, 1800);
      });
    });
    wrap.appendChild(div);
  });
}

function injectGeoGebra() {
  const params = {
    'appName': 'classic',
    'width': window.innerWidth - 320,
    'height': Math.max(600, window.innerHeight - 140),
    'showToolBar': true,
    'showAlgebraInput': true,
    'showMenuBar': true,
    'enableRightClick': true,
    'enableShiftDragZoom': true,
    'appletOnLoad': () => {
      const status = document.getElementById('ggb-status');
      if (status) status.textContent = 'GeoGebra listo';
    }
  };
  if (window.GGBApplet) {
    const applet = new GGBApplet(params, true);
    applet.inject('geogebra-container');
  } else {
    document.getElementById('geogebra-container').innerHTML =
      '<div style="padding:20px;color:#03060f;font-family:Inter;">Cargando GeoGebra…</div>';
  }
}

/* =====================================================
   PESTAÑA 4 — IDE PYTHON SIMULADO
   ===================================================== */
const defaultPython = `# =====================================================
# Analisis de Radio de Borneo y Area de Seguridad
# Puerto de La Libertad - Operaciones Offshore
# =====================================================
import math

# Parametros de configuracion del fondeo
h = 15.0        # >>> Profundidad del mar (m)
L = 20.0        # >>> Longitud de cadena (m)
D = 12.0        # >>> Distancia ancla a zona de exclusion (m)

def radio_borneo(L, h):
    # Radio maximo de borneo: r = sqrt(L^2 - h^2)
    if L <= h:
        return 0.0
    return math.sqrt(L**2 - h**2)

def area_solapamiento(r, D):
    # Area de solapamiento entre circulo y semiplano x >= D
    if r <= D:
        return 0.0   # Sin solapamiento
    if D <= -r:
        return math.pi * r**2  # Contenido total
    # Segmento circular
    return r**2 * math.acos(D/r) - D * math.sqrt(r**2 - D**2)

def razon_metrica(r, D):
    # Razon del area de solapamiento respecto al circulo
    A_circ = math.pi * r**2
    A_overlap = area_solapamiento(r, D)
    return A_overlap / A_circ if A_circ > 0 else 0.0

r = radio_borneo(L, h)
A_overlap = area_solapamiento(r, D)
razon = razon_metrica(r, D)
r_critico = D
L_max = math.sqrt(h**2 + D**2)

print("=== ANALISIS DE SEGURIDAD - PUERTO DE LA LIBERTAD ===")
print(f"Profundidad h          = {h} m")
print(f"Longitud cadena L      = {L} m")
print(f"Radio de borneo r      = {r:.4f} m")
print(f"Distancia exclusión D  = {D} m")
print(f"Area solapamiento A    = {A_overlap:.4f} m^2")
print(f"Razon metrica eta      = {razon:.4f}")
print(f"Radio critico r_c      = {r_critico:.4f} m")
print(f"Cadena maxima L_max    = {L_max:.4f} m")
print(f"Estado: {'PELIGRO' if r > D else 'SEGURO'}")
`;

const codeArea = document.getElementById('python-code');
const lineNumbers = document.getElementById('line-numbers');
const pyConsole = document.getElementById('python-console');

codeArea.value = defaultPython;

function updateLineNumbers() {
  const lines = codeArea.value.split('\n').length;
  let html = '';
  for (let i = 1; i <= lines; i++) html += i + '<br>';
  lineNumbers.innerHTML = html;
}
codeArea.addEventListener('input', updateLineNumbers);
codeArea.addEventListener('scroll', () => {
  lineNumbers.scrollTop = codeArea.scrollTop;
});
codeArea.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = codeArea.selectionStart;
    const en = codeArea.selectionEnd;
    codeArea.value = codeArea.value.substring(0, s) + '    ' + codeArea.value.substring(en);
    codeArea.selectionStart = codeArea.selectionEnd = s + 4;
    updateLineNumbers();
  }
});

function ts() {
  const d = new Date();
  return d.toTimeString().substring(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0');
}
function consolePrint(text, type = 'info') {
  const line = document.createElement('div');
  line.className = 'console-line ' + type;
  line.innerHTML = `<span class="ts">[${ts()}]</span>${text}`;
  pyConsole.appendChild(line);
  pyConsole.scrollTop = pyConsole.scrollHeight;
}

document.getElementById('py-run').addEventListener('click', () => {
  pyConsole.innerHTML = '';
  consolePrint('>>> python borneo_seguridad.py', 'info');

  const code = codeArea.value;
  let hVal = 15, LVal = 20, DVal = 12;
  const mh = code.match(/^h\s*=\s*([0-9.]+)/m);
  if (mh) hVal = parseFloat(mh[1]);
  const mL = code.match(/^L\s*=\s*([0-9.]+)/m);
  if (mL) LVal = parseFloat(mL[1]);
  const mD = code.match(/^D\s*=\s*([0-9.]+)/m);
  if (mD) DVal = parseFloat(mD[1]);

  const r = (LVal > hVal) ? Math.sqrt(LVal*LVal - hVal*hVal) : 0;
  const A = (r > DVal) ? r*r*Math.acos(DVal/r) - DVal*Math.sqrt(r*r - DVal*DVal) : 0;
  const eta = (r > 0) ? A / (Math.PI * r * r) : 0;
  const Lmax = Math.sqrt(hVal*hVal + DVal*DVal);
  const estado = r > DVal ? 'PELIGRO' : 'SEGURO';

  setTimeout(() => consolePrint('=== ANALISIS DE SEGURIDAD - PUERTO DE LA LIBERTAD ===', 'info'), 200);
  setTimeout(() => consolePrint(`Profundidad h          = ${hVal} m`), 400);
  setTimeout(() => consolePrint(`Longitud cadena L      = ${LVal} m`), 550);
  setTimeout(() => consolePrint(`Radio de borneo r      = ${r.toFixed(4)} m`), 700);
  setTimeout(() => consolePrint(`Distancia exclusión D  = ${DVal} m`), 850);
  setTimeout(() => consolePrint(`Area solapamiento A    = ${A.toFixed(4)} m^2`), 1000);
  setTimeout(() => consolePrint(`Razon metrica eta      = ${eta.toFixed(4)}`), 1150);
  setTimeout(() => consolePrint(`Radio critico r_c      = ${DVal.toFixed(4)} m`), 1300);
  setTimeout(() => consolePrint(`Cadena maxima L_max    = ${Lmax.toFixed(4)} m`), 1450);
  setTimeout(() => consolePrint(`Estado: ${estado}`, estado === 'PELIGRO' ? 'err' : 'warn'), 1600);
  setTimeout(() => consolePrint('>>> Proceso terminado (codigo 0)', 'warn'), 1800);
  setTimeout(() => drawPythonCanvas(hVal, LVal, DVal, r, A, eta), 1900);
});

document.getElementById('py-copy').addEventListener('click', () => {
  navigator.clipboard.writeText(codeArea.value).then(() => {
    const btn = document.getElementById('py-copy');
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
    setTimeout(() => btn.innerHTML = old, 1500);
  });
});

document.getElementById('py-reset').addEventListener('click', () => {
  codeArea.value = defaultPython;
  updateLineNumbers();
});

/* ===== Lienzo de graficos Python (sim. matplotlib) ===== */
const pyCanvas = document.getElementById('python-canvas');
const pyCtx = pyCanvas.getContext('2d');

function drawPythonCanvas(hVal = 15, LVal = 20, DVal = 12, r = 0, A = 0, eta = 0) {
  const ratio = window.devicePixelRatio || 1;
  const rect = pyCanvas.getBoundingClientRect();
  pyCanvas.width = rect.width * ratio;
  pyCanvas.height = rect.height * ratio;
  pyCtx.setTransform(1, 0, 0, 1, 0, 0);
  pyCtx.scale(ratio, ratio);

  const W = rect.width, H = rect.height;
  pyCtx.clearRect(0, 0, W, H);

  pyCtx.fillStyle = '#03060f';
  pyCtx.fillRect(0, 0, W, H);

  // ===== Panel izquierdo: vista superior del solapamiento =====
  const plotW = W * 0.62;
  const plotH = H;
  const padding = 30;
  const plotX0 = padding, plotY0 = padding;
  const plotX1 = plotW - padding, plotY1 = plotH - padding;
  const plotCx = (plotX0 + plotX1) / 2;
  const plotCy = (plotY0 + plotY1) / 2;

  // Escala: el mayor entre r y D + zona
  const maxRange = Math.max(r, DVal + 16) * 1.2;
  const scale = Math.min(plotX1 - plotX0, plotY1 - plotY0) / (2 * maxRange);

  // Ejes
  pyCtx.strokeStyle = 'rgba(159,180,216,0.2)';
  pyCtx.lineWidth = 1;
  pyCtx.beginPath();
  pyCtx.moveTo(plotX0, plotCy); pyCtx.lineTo(plotX1, plotCy);
  pyCtx.moveTo(plotCx, plotY0); pyCtx.lineTo(plotCx, plotY1);
  pyCtx.stroke();

  // Zona de exclusion (rectangulo)
  const zoneL = 16, zoneW = 10;
  const zx0 = plotCx + DVal * scale;
  const zx1 = plotCx + (DVal + zoneL) * scale;
  const zy0 = plotCy - (zoneW / 2) * scale;
  const zy1 = plotCy + (zoneW / 2) * scale;

  pyCtx.fillStyle = 'rgba(255,94,148,0.12)';
  pyCtx.fillRect(zx0, zy0, zx1 - zx0, zy1 - zy0);
  pyCtx.strokeStyle = '#ff5e94';
  pyCtx.lineWidth = 2;
  pyCtx.strokeRect(zx0, zy0, zx1 - zx0, zy1 - zy0);
  pyCtx.fillStyle = '#ff5e94';
  pyCtx.font = '10px Inter';
  pyCtx.fillText('Zona Exclusión', zx0 + 4, zy0 - 4);

  // Círculo de Borneo
  pyCtx.strokeStyle = '#39e0ff';
  pyCtx.lineWidth = 2;
  pyCtx.shadowColor = '#39e0ff';
  pyCtx.shadowBlur = 8;
  pyCtx.beginPath();
  pyCtx.arc(plotCx, plotCy, r * scale, 0, Math.PI * 2);
  pyCtx.stroke();
  pyCtx.shadowBlur = 0;

  // Area de solapamiento (segmento circular)
  if (r > DVal) {
    pyCtx.fillStyle = 'rgba(255,209,102,0.35)';
    pyCtx.beginPath();
    pyCtx.moveTo(plotCx, plotCy);
    const segs = 64;
    const aStart = -Math.acos(DVal / r);
    const aEnd = Math.acos(DVal / r);
    for (let i = 0; i <= segs; i++) {
      const a = aStart + (aEnd - aStart) * (i / segs);
      const px = plotCx + r * scale * Math.cos(a);
      const py = plotCy - r * scale * Math.sin(a);
      pyCtx.lineTo(px, py);
    }
    pyCtx.closePath();
    pyCtx.fill();
    pyCtx.strokeStyle = '#ffd166';
    pyCtx.lineWidth = 1.5;
    pyCtx.stroke();
  }

  // Ancla (centro)
  pyCtx.fillStyle = '#b388ff';
  pyCtx.beginPath();
  pyCtx.arc(plotCx, plotCy, 4, 0, Math.PI * 2);
  pyCtx.fill();
  pyCtx.fillStyle = '#b388ff';
  pyCtx.font = '9px Inter';
  pyCtx.fillText('Ancla', plotCx + 6, plotCy + 12);

  // Boya (punto en el circulo)
  const boyAngle = (Date.now() * 0.001) % (Math.PI * 2);
  const bx = plotCx + r * scale * Math.cos(boyAngle);
  const by = plotCy - r * scale * Math.sin(boyAngle);
  pyCtx.fillStyle = '#7cffb0';
  pyCtx.beginPath();
  pyCtx.arc(bx, by, 4, 0, Math.PI * 2);
  pyCtx.fill();

  // Titulo
  pyCtx.fillStyle = '#9fb4d8';
  pyCtx.font = '11px Orbitron';
  pyCtx.fillText(`Vista Superior — r=${r.toFixed(2)}m, D=${DVal}m`, plotX0, 16);

  // Etiqueta de overlap
  if (r > DVal) {
    pyCtx.fillStyle = '#ffd166';
    pyCtx.font = '10px Inter';
    pyCtx.fillText(`A_overlap=${A.toFixed(2)} m²`, plotX1 - 130, 16);
  }

  // ===== Panel derecho: barras comparativas =====
  const barX = plotW + 20;
  const barW = W - barX - 20;
  pyCtx.strokeStyle = 'rgba(159,180,216,0.2)';
  pyCtx.beginPath();
  pyCtx.moveTo(barX, 30); pyCtx.lineTo(barX, H - 30);
  pyCtx.lineTo(barX + barW, H - 30);
  pyCtx.stroke();

  const labels = ['r (m)', 'D (m)', 'A (m²)', 'η (%)'];
  const values = [r, DVal, A, eta * 100];
  const maxV = Math.max(...values, 1);
  const barWidth = (barW - 30) / 4;
  const colors = ['#39e0ff', '#ff5e94', '#ffd166', '#7cffb0'];

  pyCtx.fillStyle = '#9fb4d8';
  pyCtx.font = '11px Orbitron';
  pyCtx.fillText('Métricas', barX, 18);

  values.forEach((v, i) => {
    const h = (v / maxV) * (H - 80);
    const x = barX + 8 + i * barWidth;
    const y = H - 30 - h;
    const grad = pyCtx.createLinearGradient(0, y, 0, H - 30);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(1, colors[i] + '44');
    pyCtx.fillStyle = grad;
    pyCtx.fillRect(x, y, barWidth - 8, h);
    pyCtx.fillStyle = colors[i];
    pyCtx.font = '9px Inter';
    pyCtx.fillText(v.toFixed(2), x, y - 4);
    pyCtx.fillStyle = '#9fb4d8';
    pyCtx.font = '8px Inter';
    pyCtx.fillText(labels[i], x + 2, H - 16);
  });
}

/* =====================================================
   INICIALIZACIÓN
   ===================================================== */
window.addEventListener('load', () => {
  initThree();
  initGUI();
  renderKeplerFormula();
  setupBlackboard();
  renderSolver();
  renderGgbCommands();
  updateLineNumbers();
  drawPythonCanvas();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
});

window.addEventListener('resize', () => {
  drawPythonCanvas();
});

/* =====================================================
   PESTAÑA 5 — PITCH SHARK TANK
   ===================================================== */
const pitchSegments = [
  { time: '0:00 – 1:30', title: 'APERTURA — GANCHO EMOCIONAL',
    text: 'Señor inversionista: imagine usted está parado en el muelle del Puerto de La Libertad. Un buque cisterna de 80.000 toneladas se acerca para transferir hidrocarburos. A 50 metros, una boya de fondeo oscila describiendo un círculo sobre el agua. Si ese círculo, llamado círculo de Borneo, invade la zona de exclusión portuaria, tendremos una colisión que costará millones y un derrame de petróleo. Hoy le mostramos cómo la geometría plana nos da la solución: una fórmula de 2000 años de antigüedad que protege operaciones offshore modernas.' },
  { time: '1:30 – 3:30', title: 'EL PROBLEMA — ¿Por qué importa la geometría?',
    text: 'Una boya marítima anclada mediante cadena describe, por acción del oleaje y las corrientes, una trayectoria circular en superficie. El radio máximo de ese círculo depende de dos parámetros: la profundidad h del mar y la longitud L de la cadena. Cuando ese radio supera la distancia D a la zona de exclusión rectangular, existe riesgo de colisión con buques cisterna. En el Puerto de La Libertad se registran oleajes de hasta 2 metros y corrientes de 1.5 nudos que obligan a modelar con precisión este fenómeno.' },
  { time: '3:30 – 5:30', title: 'LA GEOMETRÍA — Pitágoras y el triángulo del anclaje',
    text: 'La cadena, la profundidad y el desplazamiento horizontal forman un triángulo rectángulo. La cadena es la hipotenusa, la profundidad el cateto vertical y el radio de Borneo el cateto horizontal. Aplicando el teorema de Pitágoras: L cuadrado igual a h cuadrado más r cuadrado. Despejando r obtenemos la fórmula clave del proyecto: r igual a raíz cuadrada de L al cuadrado menos h al cuadrado. Para h igual a 15 metros y L igual a 20 metros, obtenemos un radio de borneo de 13 punto 23 metros.' },
  { time: '5:30 – 7:30', title: 'LA SOLUCIÓN — Radio crítico y tangencia',
    text: 'Definimos el radio crítico como aquel en que el círculo de Borneo toca tangencialmente el borde de la zona de exclusión. La condición es simple: el radio crítico igual a la distancia D. Si se conoce la profundidad h y la distancia D fijas, podemos calcular la longitud máxima de cadena admisible con L máximo igual a raíz cuadrada de h al cuadrado más D al cuadrado. Esta es la fórmula de diseño que asegura cero riesgo de colisión.' },
  { time: '7:30 – 9:00', title: 'ANÁLISIS DE SOLAPAMIENTO — Segmento circular',
    text: 'Cuando el radio excede D, el círculo invade la zona rectangular. El área de solapamiento es un segmento circular cuya fórmula es: A igual a r al cuadrado por arcocoseno de D sobre r, menos D por raíz cuadrada de r al cuadrado menos D al cuadrado. La razón métrica eta, definida como el cociente entre el área de solapamiento y el área total del círculo, cuantifica la fracción de la zona de movimiento que invade la zona de exclusión. Para nuestros parámetros base obtenemos un eta de 4.6 por ciento, aparentemente bajo, pero que representa 25 metros cuadrados de zona crítica.' },
  { time: '9:00 – 10:00', title: 'CIERRE — Recomendación al inversionista',
    text: 'Recomendamos implementar un sistema de monitoreo continuo del radio de borneo mediante GPS diferencial en cada boya, con alertas automáticas cuando r supere el 85 por ciento de D. Adicionalmente, proponemos limitar la longitud de cadena a L máximo igual a raíz de h cuadrado más D cuadrado para garantizar margen de seguridad. La inversión en este modelado geométrico es mínima comparada con los costos de un derrame. Geometría plana aplicada: 2000 años de teoría protegiendo operaciones offshore del siglo XXI. Gracias, inversionista, por su atención.' }
];

function renderPitchSegments() {
  const container = document.getElementById('pitch-segments');
  const markers = document.getElementById('pitch-segment-markers');
  container.innerHTML = '';
  markers.innerHTML = '';
  pitchSegments.forEach((seg, i) => {
    const div = document.createElement('div');
    div.className = 'pitch-segment';
    div.dataset.idx = i;
    div.innerHTML = `
      <div class="pitch-time-label">⏱ ${seg.time}<strong>Seg ${i+1}/6</strong></div>
      <div class="pitch-segment-body">
        <h4>${seg.title}</h4>
        <p>${seg.text}</p>
      </div>
    `;
    container.appendChild(div);
    const marker = document.createElement('span');
    markers.appendChild(marker);
  });
}

let pitchTimer = null;
let pitchCurrentSeg = 0;
let pitchStartTime = 0;
const PITCH_TOTAL = 600; // 10 min en segundos

function pitchPlay() {
  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no soporta la API de voz.');
    return;
  }
  window.speechSynthesis.cancel();
  pitchCurrentSeg = 0;
  pitchStartTime = Date.now();
  document.querySelectorAll('.pitch-segment').forEach(s => s.classList.remove('active','completed'));
  speakNextSegment();
}

function speakNextSegment() {
  if (pitchCurrentSeg >= pitchSegments.length) {
    pitchStop();
    return;
  }
  const segs = document.querySelectorAll('.pitch-segment');
  segs.forEach((s, i) => {
    s.classList.remove('active');
    if (i < pitchCurrentSeg) s.classList.add('completed');
  });
  segs[pitchCurrentSeg].classList.add('active');

  const seg = pitchSegments[pitchCurrentSeg];
  const utter = new SpeechSynthesisUtterance(seg.text);
  utter.lang = 'es-ES';
  utter.rate = 0.95;
  utter.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es'));
  if (esVoice) utter.voice = esVoice;
  utter.onend = () => {
    pitchCurrentSeg++;
    if (pitchCurrentSeg < pitchSegments.length) {
      setTimeout(speakNextSegment, 300);
    } else {
      pitchStop();
    }
  };
  window.speechSynthesis.speak(utter);

  // Barra de progreso
  if (pitchTimer) clearInterval(pitchTimer);
  pitchTimer = setInterval(() => {
    const elapsed = (Date.now() - pitchStartTime) / 1000;
    const pct = Math.min(100, (elapsed / PITCH_TOTAL) * 100);
    document.getElementById('pitch-progress-fill').style.width = pct + '%';
    const m = Math.floor(elapsed / 60);
    const s = Math.floor(elapsed % 60);
    document.getElementById('pitch-time').textContent = `${m}:${String(s).padStart(2,'0')} / 10:00`;
  }, 250);
}

function pitchStop() {
  window.speechSynthesis.cancel();
  if (pitchTimer) { clearInterval(pitchTimer); pitchTimer = null; }
  document.querySelectorAll('.pitch-segment').forEach(s => s.classList.remove('active'));
}

document.getElementById('pitch-play').addEventListener('click', pitchPlay);
document.getElementById('pitch-stop').addEventListener('click', pitchStop);

/* =====================================================
   PESTAÑA 6 — ESCENARIOS
   ===================================================== */
const escenarios = {
  calma: {
    nombre: 'Mar en Calma', icono: 'fa-sun',
    h: 15, L: 18, D: 12, v: '5 nudos', o: '0.3 m',
    recomendacion: 'Condiciones ideales. El radio de borneo se mantiene dentro de límites seguros. Se recomienda continuar operaciones normales de transferencia de hidrocarburos.'
  },
  normal: {
    nombre: 'Oleaje Normal', icono: 'fa-water',
    h: 15, L: 20, D: 12, v: '15 nudos', o: '1.2 m',
    recomendacion: 'Condiciones típicas del Puerto de La Libertad. El radio de borneo supera la distancia de seguridad. Se recomienda monitoreo continuo y restricción de buques en zona de exclusión.'
  },
  tormenta: {
    nombre: 'Tormenta', icono: 'fa-cloud-showers-heavy',
    h: 15, L: 24, D: 12, v: '35 nudos', o: '3.5 m',
    recomendacion: 'Condiciones de tormenta. El solapamiento es crítico. Se debe suspender operaciones de transferencia y reubicar buques cisterna a zona de refugio. Reducir longitud de cadena a 19 m.'
  },
  huracan: {
    nombre: 'Huracán', icono: 'fa-tornado',
    h: 15, L: 28, D: 12, v: '65 nudos', o: '6.0 m',
    recomendacion: 'ALERTA MÁXIMA. Solapamiento extremo con riesgo inminente de colisión. Suspender todas las operaciones. Recoger boyas a posición de refugio o cortar anclas y remover a zona protegida.'
  }
};

let currentEscenario = 'calma';

function calcEscenario(esc) {
  const r = (esc.L > esc.h) ? Math.sqrt(esc.L*esc.L - esc.h*esc.h) : 0;
  const A = (r > esc.D) ? r*r*Math.acos(esc.D/r) - esc.D*Math.sqrt(r*r - esc.D*esc.D) : 0;
  const eta = (r > 0) ? A / (Math.PI * r * r) : 0;
  const estado = r > esc.D ? 'PELIGRO' : (r > esc.D * 0.85 ? 'ALERTA' : 'SEGURO');
  return { r, A, eta, estado };
}

function showEscenario(key) {
  currentEscenario = key;
  const esc = escenarios[key];
  const calc = calcEscenario(esc);

  document.getElementById('esc-nombre').textContent = esc.nombre;
  document.getElementById('esc-icono').innerHTML = `<i class="fa-solid ${esc.icono}"></i>`;
  document.getElementById('esc-h').textContent = esc.h + ' m';
  document.getElementById('esc-L').textContent = esc.L + ' m';
  document.getElementById('esc-D').textContent = esc.D + ' m';
  document.getElementById('esc-v').textContent = esc.v;
  document.getElementById('esc-o').textContent = esc.o;
  document.getElementById('esc-r').textContent = calc.r.toFixed(2) + ' m';

  const estadoEl = document.getElementById('esc-estado');
  estadoEl.textContent = calc.estado;
  estadoEl.className = 'result-val estado-' + calc.estado.toLowerCase();

  document.getElementById('esc-area').textContent = calc.A.toFixed(2) + ' m²';
  document.getElementById('esc-eta').textContent = calc.eta.toFixed(4);

  document.getElementById('escenario-recomendacion').textContent = esc.recomendacion;

  drawEscenarioCanvas(esc, calc);
  renderEscenarioTable();
}

function drawEscenarioCanvas(esc, calc) {
  const canvas = document.getElementById('escenario-canvas');
  const ctx = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = 280 * ratio;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(ratio, ratio);

  const W = rect.width, H = 280;
  ctx.fillStyle = '#03060f';
  ctx.fillRect(0,0,W,H);

  const maxRange = Math.max(calc.r, esc.D + 16) * 1.3;
  const scale = Math.min(W, H) / (2 * maxRange);
  const cx = W/2, cy = H/2;

  // Ejes
  ctx.strokeStyle = 'rgba(159,180,216,0.2)';
  ctx.beginPath();
  ctx.moveTo(0,cy); ctx.lineTo(W,cy);
  ctx.moveTo(cx,0); ctx.lineTo(cx,H);
  ctx.stroke();

  // Zona de exclusión
  const zoneL = 16, zoneW = 10;
  const zx0 = cx + esc.D*scale, zx1 = cx + (esc.D+zoneL)*scale;
  const zy0 = cy - (zoneW/2)*scale, zy1 = cy + (zoneW/2)*scale;
  ctx.fillStyle = 'rgba(255,94,148,0.15)';
  ctx.fillRect(zx0, zy0, zx1-zx0, zy1-zy0);
  ctx.strokeStyle = '#ff5e94';
  ctx.lineWidth = 2;
  ctx.strokeRect(zx0, zy0, zx1-zx0, zy1-zy0);

  // Círculo de borneo
  ctx.strokeStyle = '#39e0ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#39e0ff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, calc.r*scale, 0, Math.PI*2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Solapamiento
  if (calc.r > esc.D) {
    ctx.fillStyle = 'rgba(255,209,102,0.4)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const segs = 64;
    const aStart = -Math.acos(esc.D/calc.r);
    const aEnd = Math.acos(esc.D/calc.r);
    for (let i = 0; i <= segs; i++) {
      const a = aStart + (aEnd-aStart)*(i/segs);
      ctx.lineTo(cx + calc.r*scale*Math.cos(a), cy - calc.r*scale*Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  // Ancla
  ctx.fillStyle = '#b388ff';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI*2);
  ctx.fill();

  // Boya animada
  const t = Date.now()*0.001;
  const bx = cx + calc.r*scale*Math.cos(t);
  const by = cy - calc.r*scale*Math.sin(t);
  ctx.fillStyle = '#7cffb0';
  ctx.beginPath();
  ctx.arc(bx, by, 5, 0, Math.PI*2);
  ctx.fill();

  // Título
  ctx.fillStyle = '#9fb4d8';
  ctx.font = '11px Orbitron';
  ctx.fillText(`r=${calc.r.toFixed(2)}m · D=${esc.D}m · ${calc.estado}`, 10, 16);
}

function renderEscenarioTable() {
  const tbody = document.getElementById('escenario-tbody');
  tbody.innerHTML = '';
  Object.keys(escenarios).forEach(key => {
    const esc = escenarios[key];
    const calc = calcEscenario(esc);
    const tr = document.createElement('tr');
    if (key === currentEscenario) tr.classList.add('active');
    const estadoClass = 'estado-' + calc.estado.toLowerCase();
    tr.innerHTML = `
      <td>${esc.nombre}</td>
      <td>${calc.r.toFixed(2)}</td>
      <td><span class="${estadoClass}">${calc.estado}</span></td>
      <td>${calc.A.toFixed(2)}</td>
      <td>${calc.eta.toFixed(4)}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.querySelectorAll('.escenario-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.escenario-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    showEscenario(t.dataset.esc);
  });
});

// Animación continua del canvas de escenarios
function animateEscenarioCanvas() {
  if (currentEscenario) {
    const esc = escenarios[currentEscenario];
    const calc = calcEscenario(esc);
    drawEscenarioCanvas(esc, calc);
  }
  requestAnimationFrame(animateEscenarioCanvas);
}

/* =====================================================
   PESTAÑA 7 — TUTOR IA (MathosAI style)
   ===================================================== */
function tutorSolve() {
  const h = parseFloat(document.getElementById('tutor-h').value);
  const L = parseFloat(document.getElementById('tutor-L').value);
  const D = parseFloat(document.getElementById('tutor-D').value);
  const screen = document.getElementById('tutor-screen');
  const progressBar = document.getElementById('tutor-progress-bar');
  screen.innerHTML = '';

  const steps = [];
  // Validación
  if (L <= h) {
    steps.push({
      num: '01', title: 'Validación de parámetros',
      text: `Con los valores ingresados (h=${h}, L=${L}), la cadena es más corta que la profundidad. Esto es físicamente inviable: la boya quedaría sumergida.`,
      formula: String.raw`L > h \;\text{(obligatorio)}`,
      result: `❌ CONFIGURACIÓN INVÁLIDA`,
      warn: 'Aumente L o disminuya h.'
    });
  } else {
    const r = Math.sqrt(L*L - h*h);
    const A_circ = Math.PI * r * r;
    const A_zone = 16 * 10; // zona rectangular 16x10
    const A_solap = (r > D) ? r*r*Math.acos(D/r) - D*Math.sqrt(r*r - D*D) : 0;
    const eta = (r > 0) ? A_solap / A_circ : 0;
    const r_crit = D;
    const L_max = Math.sqrt(h*h + D*D);
    const estado = r > D ? 'PELIGRO' : (r > D*0.85 ? 'ALERTA' : 'SEGURO');

    steps.push({
      num: '01', title: 'Identificación del sistema',
      text: `Analizamos un sistema de anclaje compuesto por una boya en superficie, una cadena de longitud L y un ancla en el fondo marino. La profundidad es h y la distancia a la zona de exclusión es D.`,
      formula: String.raw`h = ${h}\ \text{m},\quad L = ${L}\ \text{m},\quad D = ${D}\ \text{m}`,
      result: `✓ Parámetros válidos: L > h`
    });
    steps.push({
      num: '02', title: 'Triángulo rectángulo del anclaje',
      text: `Cuando el oleaje desplaza la boya, la cadena forma un triángulo rectángulo. La hipotenusa es L, el cateto vertical es h y el cateto horizontal r es el radio de Borneo.`,
      formula: String.raw`L^2 = h^2 + r^2`
    });
    steps.push({
      num: '03', title: 'Despeje del radio r',
      text: `Aplicamos el teorema de Pitágoras y despejamos r, el radio del círculo de Borneo.`,
      formula: String.raw`r = \sqrt{L^2 - h^2} = \sqrt{${L}^2 - ${h}^2}`,
      result: `r = ${r.toFixed(4)} m`
    });
    steps.push({
      num: '04', title: 'Cálculo del área del círculo de Borneo',
      text: `El área total del círculo descrito por la boya es:`,
      formula: String.raw`A_{\text{circ}} = \pi r^2 = \pi (${r.toFixed(2)})^2`,
      result: `A_circ = ${A_circ.toFixed(2)} m²`
    });
    steps.push({
      num: '05', title: 'Verificación de condición de solapamiento',
      text: `Comparamos r con D. Si r > D, el círculo invade la zona de exclusión.`,
      formula: String.raw`r ${r > D ? '>' : '\\leq'} D \;\Rightarrow\; ${r > D ? '\\text{SOLAPAMIENTO}' : '\\text{SIN SOLAPAMIENTO}'}`,
      result: `${r > D ? '⚠ Existe invasión de zona' : '✓ No hay invasión'}`
    });
    if (r > D) {
      steps.push({
        num: '06', title: 'Cálculo del área de solapamiento',
        text: `El área de solapamiento corresponde a un segmento circular. Su fórmula es:`,
        formula: String.raw`A_{\text{solap}} = r^2 \arccos\!\left(\frac{D}{r}\right) - D\sqrt{r^2 - D^2}`,
        result: `A_solap = ${A_solap.toFixed(4)} m²`
      });
      steps.push({
        num: '07', title: 'Razón métrica del solapamiento',
        text: `La razón eta cuantifica la fracción del círculo que invade la zona de exclusión:`,
        formula: String.raw`\eta = \frac{A_{\text{solap}}}{\pi r^2}`,
        result: `η = ${eta.toFixed(4)} (${(eta*100).toFixed(2)}%)`
      });
    }
    steps.push({
      num: '08', title: 'Radio crítico de tangencia',
      text: `El radio crítico es aquel en que el círculo toca tangencialmente el borde de la zona de exclusión:`,
      formula: String.raw`r_{\text{crit}} = D = ${D}\ \text{m}`,
      result: `r_crit = ${r_crit.toFixed(2)} m`
    });
    steps.push({
      num: '09', title: 'Longitud máxima de cadena admisible',
      text: `Para garantizar seguridad, calculamos la longitud máxima de cadena que mantiene r ≤ D:`,
      formula: String.raw`L_{\text{max}} = \sqrt{h^2 + D^2} = \sqrt{${h}^2 + ${D}^2}`,
      result: `L_max = ${L_max.toFixed(4)} m`
    });
    steps.push({
      num: '10', title: 'Diagnóstico final',
      text: `Con los parámetros actuales, el estado del sistema es: ${estado}. ${estado==='PELIGRO'?'Se debe reducir L a '+L_max.toFixed(2)+' m o aumentar D.':estado==='ALERTA'?'Monitoreo continuo recomendado.':'Configuración segura.'}`,
      formula: String.raw`\text{Estado: } \boxed{${estado}}`,
      result: estado === 'PELIGRO' ? `❌ PELIGRO — Ajustar L ≤ ${L_max.toFixed(2)} m` :
              estado === 'ALERTA' ? `⚠ ALERTA — Monitorear` :
              `✓ SEGURO — Operación normal`
    });
  }

  // Renderizar pasos con retardo
  let i = 0;
  function nextStep() {
    if (i >= steps.length) return;
    const s = steps[i];
    const div = document.createElement('div');
    div.className = 'tutor-step';
    div.innerHTML = `<span class="tutor-step-num">PASO ${s.num}</span>`;
    if (s.title) {
      const h4 = document.createElement('h4');
      h4.textContent = s.title;
      div.appendChild(h4);
    }
    if (s.text) {
      const p = document.createElement('p');
      p.textContent = s.text;
      div.appendChild(p);
    }
    if (s.formula) {
      const f = document.createElement('div');
      f.className = 'formula-block';
      div.appendChild(f);
      setTimeout(() => katex.render(s.formula, f, { throwOnError: false, displayMode: true }), 50);
    }
    if (s.result) {
      const r = document.createElement('div');
      r.className = 'result-line';
      r.textContent = s.result;
      div.appendChild(r);
    }
    if (s.warn) {
      const w = document.createElement('div');
      w.className = 'warn-line';
      w.textContent = s.warn;
      div.appendChild(w);
    }
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
    progressBar.style.width = ((i+1)/steps.length*100) + '%';
    i++;
    setTimeout(nextStep, 700);
  }
  nextStep();
}

document.getElementById('tutor-solve').addEventListener('click', tutorSolve);

/* =====================================================
   PESTAÑA 8 — GEOJSON & SIG
   ===================================================== */
function metersToDeg(meters, lat) {
  // Aproximación: 1 grado lat ≈ 111000 m; 1 grado lng ≈ 111000*cos(lat)
  return meters / 111000;
}

function generateGeoJSON() {
  const lat = parseFloat(document.getElementById('gj-lat').value);
  const lng = parseFloat(document.getElementById('gj-lng').value);
  const h = parseFloat(document.getElementById('gj-h').value);
  const L = parseFloat(document.getElementById('gj-L').value);
  const D = parseFloat(document.getElementById('gj-D').value);
  const orient = parseFloat(document.getElementById('gj-orient').value) * Math.PI / 180;

  const r = (L > h) ? Math.sqrt(L*L - h*h) : 0;
  const A_borneo = Math.PI * r * r;
  const A_zona = 16 * 10;
  const A_solap = (r > D) ? r*r*Math.acos(D/r) - D*Math.sqrt(r*r - D*D) : 0;
  const estado = r > D ? 'PELIGRO' : (r > D*0.85 ? 'ALERTA' : 'SEGURO');

  // Mostrar resultados
  document.getElementById('gj-results').style.display = 'block';
  document.getElementById('gj-r').textContent = r.toFixed(4) + ' m';
  document.getElementById('gj-area-borneo').textContent = A_borneo.toFixed(2) + ' m²';
  document.getElementById('gj-area-zona').textContent = A_zona.toFixed(2) + ' m²';
  document.getElementById('gj-area-solap').textContent = A_solap.toFixed(2) + ' m²';
  const estadoEl = document.getElementById('gj-estado');
  estadoEl.textContent = estado;
  estadoEl.className = 'estado-' + estado.toLowerCase();
  estadoEl.style.color = estado === 'PELIGRO' ? 'var(--neon-pink)' :
                          estado === 'ALERTA' ? 'var(--neon-gold)' : 'var(--neon-green)';

  // Generar círculo de borneo (64 puntos)
  const circleCoords = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i/64) * Math.PI * 2;
    const dx = metersToDeg(r * Math.cos(a), lat);
    const dy = metersToDeg(r * Math.sin(a), lat);
    circleCoords.push([lng + dx, lat + dy]);
  }

  // Generar zona de exclusión rectangular (16x10 m, orientada)
  const zoneL = 16, zoneW = 10;
  const corners = [
    [D, -zoneW/2], [D+zoneL, -zoneW/2], [D+zoneL, zoneW/2], [D, zoneW/2], [D, -zoneW/2]
  ];
  const zoneCoords = corners.map(([x,y]) => {
    // Rotar por orient
    const rx = x*Math.cos(orient) - y*Math.sin(orient);
    const ry = x*Math.sin(orient) + y*Math.cos(orient);
    return [lng + metersToDeg(rx, lat), lat + metersToDeg(ry, lat)];
  });

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Ancla", marker: "anchor", depth: h },
        geometry: { type: "Point", coordinates: [lng, lat] }
      },
      {
        type: "Feature",
        properties: { name: "Círculo de Borneo", radius_m: parseFloat(r.toFixed(2)), chain_L: L },
        geometry: { type: "Polygon", coordinates: [circleCoords] }
      },
      {
        type: "Feature",
        properties: { name: "Zona de Exclusión", largo_m: zoneL, ancho_m: zoneW, distancia_D: D },
        geometry: { type: "Polygon", coordinates: [zoneCoords] }
      }
    ]
  };

  document.getElementById('gj-output').value = JSON.stringify(geojson, null, 2);

  // Actualizar enlace a geojson.io con datos codificados
  const encoded = encodeURIComponent(JSON.stringify(geojson));
  document.getElementById('gj-geojson-io').href = 'https://geojson.io/#data=data:application/json,' + encoded;
}

document.getElementById('gj-generate').addEventListener('click', generateGeoJSON);

document.getElementById('gj-copy').addEventListener('click', () => {
  const ta = document.getElementById('gj-output');
  ta.select();
  navigator.clipboard.writeText(ta.value).then(() => {
    const btn = document.getElementById('gj-copy');
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
    setTimeout(() => btn.innerHTML = old, 1500);
  });
});

document.getElementById('gj-download-geo').addEventListener('click', () => {
  const data = document.getElementById('gj-output').value;
  if (!data) return;
  const blob = new Blob([data], { type: 'application/geo+json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'borneo-puerto-la-libertad.geojson';
  link.click();
});

document.getElementById('gj-download-csv').addEventListener('click', () => {
  const lat = parseFloat(document.getElementById('gj-lat').value);
  const lng = parseFloat(document.getElementById('gj-lng').value);
  const h = parseFloat(document.getElementById('gj-h').value);
  const L = parseFloat(document.getElementById('gj-L').value);
  const D = parseFloat(document.getElementById('gj-D').value);
  const r = (L > h) ? Math.sqrt(L*L - h*h) : 0;
  const A_solap = (r > D) ? r*r*Math.acos(D/r) - D*Math.sqrt(r*r - D*D) : 0;
  const eta = (r > 0) ? A_solap / (Math.PI*r*r) : 0;
  const estado = r > D ? 'PELIGRO' : (r > D*0.85 ? 'ALERTA' : 'SEGURO');
  const csv = [
    'parametro,valor,unidad',
    `latitud,${lat},grados`,
    `longitud,${lng},grados`,
    `profundidad_h,${h},m`,
    `longitud_cadena_L,${L},m`,
    `distancia_zona_D,${D},m`,
    `radio_borneo_r,${r.toFixed(4)},m`,
    `area_borneo,${(Math.PI*r*r).toFixed(2)},m2`,
    `area_solapamiento,${A_solap.toFixed(4)},m2`,
    `razon_metrica_eta,${eta.toFixed(4)},`,
    `estado,${estado},`,
    `L_max_admisible,${Math.sqrt(h*h+D*D).toFixed(4)},m`
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'borneo-parametros.csv';
  link.click();
});

/* =====================================================
   PESTAÑA 9 — MEMORIA DE CÁLCULO
   ===================================================== */
const memoriaParts = {
  1: {
    title: 'Parte 1 — Geometría del Anclaje',
    html: `
      <h3>1.1 Descripción del Sistema</h3>
      <p>El sistema de fondeo marítimo está compuesto por tres elementos geométricos fundamentales: la boya flotante en superficie, la cadena que la conecta al fondo marino, y el ancla fija en el lecho marino. Cuando la boya es desplazada por el oleaje y las corrientes, la cadena describe un triángulo rectángulo en el plano vertical que contiene al ancla, la boya y la proyección vertical de la boya sobre el fondo.</p>
      <h4>Parámetros geométricos</h4>
      <ul>
        <li><strong>h</strong> — Profundidad del mar en el punto de anclaje (cateto vertical)</li>
        <li><strong>L</strong> — Longitud total de la cadena (hipotenusa)</li>
        <li><strong>r</strong> — Radio horizontal de Borneo (cateto horizontal)</li>
        <li><strong>D</strong> — Distancia mínima desde el ancla al borde de la zona de exclusión</li>
      </ul>

      <h3>1.2 Teorema de Pitágoras Aplicado</h3>
      <p>La geometría del anclaje obedece al teorema de Pitágoras. La cadena, al tensarse, forma la hipotenusa de un triángulo rectángulo cuyo ángulo recto se localiza en la proyección vertical de la boya sobre el fondo marino. Esta es la hipótesis fundamental del modelo, válida cuando la cadena permanece tensa durante toda la oscilación de la boya.</p>
      <div class="formula-block" id="mem-f1"></div>
      <p>Donde L representa la longitud total de la cadena desde el ancla hasta la boya, h es la profundidad del mar medida verticalmente desde la superficie hasta el fondo, y r es el radio horizontal del círculo de Borneo descrito por la boya en la superficie.</p>

      <h3>1.3 Despeje del Radio de Borneo</h3>
      <p>Despejando r de la ecuación pitagórica obtenemos la fórmula central del proyecto, que permite calcular el radio máximo del círculo de Borneo a partir de los parámetros geométricos del anclaje:</p>
      <div class="formula-block" id="mem-f2"></div>
      <p>Esta fórmula es válida únicamente cuando L > h. En el caso límite L = h, el radio se anula y la boya queda directamente sobre el ancla. Cuando L < h, el sistema es físicamente inviable pues la cadena no alcanzaría la superficie.</p>

      <h3>1.4 Cálculo Numérico de Referencia</h3>
      <p>Para el Puerto de La Libertad, consideramos los siguientes parámetros típicos de operación: profundidad h = 15 m, longitud de cadena L = 20 m, y distancia a zona de exclusión D = 12 m.</p>
      <div class="formula-block" id="mem-f3"></div>
      <p>El radio de Borneo resultante de 13.23 metros excede la distancia D = 12 m a la zona de exclusión, lo que indica una condición de solapamiento crítico que se analiza en la Parte 2.</p>

      <h3>1.5 Restricciones de Validez</h3>
      <p>El modelo geométrico pitagórico asume las siguientes hipótesis simplificadoras que deben verificarse en la práctica: (1) la cadena es inextensible y permanece tensa, (2) el ancla es un punto fijo sin desplazamiento, (3) la boya oscila en un plano horizontal paralelo a la superficie del mar, y (4) no se consideran efectos elásticos ni deformaciones de la cadena bajo carga. Para profundidades superiores a 30 m o cadenas de más de 40 m, debe considerarse el peso propio de la cadena y la catenaria que describe.</p>
    `
  },
  2: {
    title: 'Parte 2 — Área de Solapamiento',
    html: `
      <h3>2.1 Definición del Problema de Solapamiento</h3>
      <p>Cuando el radio de Borneo r supera la distancia D desde el ancla al borde más cercano de la zona de exclusión rectangular, el círculo descrito por la boya invade parcialmente la zona protegida. Esta invasión se denomina área de solapamiento crítica y su cuantificación es esencial para evaluar el riesgo de colisión con buques cisterna durante operaciones de transferencia de hidrocarburos.</p>

      <h4>Geometría del solapamiento</h4>
      <ul>
        <li>El círculo de Borneo está centrado en la proyección del ancla sobre la superficie.</li>
        <li>La zona de exclusión es un rectángulo adyacente al círculo.</li>
        <li>El solapamiento corresponde a un segmento circular delimitado por la cuerda recta del borde de la zona.</li>
      </ul>

      <h3>2.2 Fórmula del Segmento Circular</h3>
      <p>El área de solapamiento entre el círculo de radio r y el semiplano definido por la zona de exclusión (cuyo borde está a distancia D del centro) se calcula mediante la fórmula del segmento circular:</p>
      <div class="formula-block" id="mem-f4"></div>
      <p>Esta fórmula surge de la diferencia entre el área del sector circular (definido por el ángulo 2·arccos(D/r)) y el área del triángulo isósceles de base 2·√(r²−D²) y altura D. El resultado es el área de la región comprendida entre la cuerda y el arco del círculo.</p>

      <h3>2.3 Razón Métrica del Solapamiento</h3>
      <p>Para comparar configuraciones con diferentes radios, definimos la razón métrica η como el cociente entre el área de solapamiento y el área total del círculo de Borneo:</p>
      <div class="formula-block" id="mem-f5"></div>
      <p>Esta razón adimensional permite evaluar la severidad relativa del solapamiento independientemente del tamaño absoluto del círculo. Un valor η = 0 indica ausencia de invasión, mientras que η = 0.5 indicaría que la mitad del círculo invade la zona de exclusión.</p>

      <h3>2.4 Cálculo Numérico</h3>
      <p>Para los parámetros de referencia del Puerto de La Libertad (h=15 m, L=20 m, D=12 m):</p>
      <table class="data-table">
        <thead><tr><th>Variable</th><th>Fórmula</th><th>Valor</th></tr></thead>
        <tbody>
          <tr><td>Radio de Borneo r</td><td>√(L²−h²)</td><td>13.23 m</td></tr>
          <tr><td>Área círculo borneo</td><td>π·r²</td><td>550.30 m²</td></tr>
          <tr><td>Área zona exclusión</td><td>16 × 10</td><td>160.00 m²</td></tr>
          <tr><td>Área solapamiento</td><td>r²·arccos(D/r) − D·√(r²−D²)</td><td>25.62 m²</td></tr>
          <tr><td>Razón métrica η</td><td>A_solap / (π·r²)</td><td>0.0466 (4.66%)</td></tr>
        </tbody>
      </table>

      <h3>2.5 Análisis de Sensibilidad</h3>
      <p>El solapamiento es altamente sensible a variaciones pequeñas de la longitud de cadena L. Reducir L de 20 m a 19 m disminuye el radio a 11.62 m, eliminando el solapamiento (r < D). Por el contrario, aumentar L a 22 m eleva el radio a 16.09 m y multiplica el área de solapamiento por 4. Este comportamiento justifica la importancia de un control estricto de la longitud de cadena en operaciones críticas.</p>
    `
  },
  3: {
    title: 'Parte 3 — Diseño de Seguridad',
    html: `
      <h3>3.1 Condición de Tangencia — Radio Crítico</h3>
      <p>El radio crítico de Borneo se define como el valor de r para el cual el círculo toca tangencialmente el borde de la zona de exclusión, sin invadirla. Esta condición representa el límite de seguridad operativo del sistema de fondeo.</p>
      <div class="formula-block" id="mem-f6"></div>
      <p>Cuando r = r_crítico, el área de solapamiento se anula y la boya puede oscilar libremente sin riesgo de invadir la zona de exclusión. Cualquier incremento adicional de r generará un solapamiento que crece rápidamente.</p>

      <h3>3.2 Longitud Máxima de Cadena Admisible</h3>
      <p>Sustituyendo la condición de tangencia en la fórmula del radio de Borneo y despejando L, obtenemos la longitud máxima de cadena que garantiza seguridad:</p>
      <div class="formula-block" id="mem-f7"></div>
      <p>Para el Puerto de La Libertad (h=15 m, D=12 m): L_max = √(15² + 12²) = √369 ≈ 19.21 m. Esta es la longitud máxima recomendada para garantizar margen de seguridad nulo.</p>

      <h3>3.3 Factor de Seguridad Recomendado</h3>
      <p>En ingeniería portuaria se recomienda aplicar un factor de seguridad FS = 1.2 al cálculo teórico, de modo que la longitud operativa de cadena sea:</p>
      <div class="formula-block" id="mem-f8"></div>
      <p>Con FS = 1.2, obtenemos L_op = 19.21 / 1.2 ≈ 16.01 m. Con esta longitud, el radio de borneo resulta r = √(16.01² − 15²) ≈ 5.58 m, muy por debajo del radio crítico de 12 m.</p>

      <h3>3.4 Protocolo Operativo Recomendado</h3>
      <h4>Niveles de alerta</h4>
      <table class="data-table">
        <thead><tr><th>Estado</th><th>Condición</th><th>Acción</th></tr></thead>
        <tbody>
          <tr><td>SEGURO</td><td>r ≤ 0.85·D</td><td>Operación normal de transferencia</td></tr>
          <tr><td>ALERTA</td><td>0.85·D < r ≤ D</td><td>Monitoreo continuo, restricción de buques</td></tr>
          <tr><td>PELIGRO</td><td>r > D</td><td>Suspender operaciones, reubicar buque</td></tr>
        </tbody>
      </table>

      <h3>3.5 Recomendaciones de Diseño</h3>
      <ul>
        <li><strong>Monitoreo GPS diferencial</strong> en cada boya con transmisión en tiempo real al centro de control portuario.</li>
        <li><strong>Alertas automáticas</strong> cuando r supere el 85% de D, con protocolo de notificación al capitán del buque cisterna.</li>
        <li><strong>Inspección periódica</strong> de la longitud efectiva de cadena, considerando elongación por carga y desgaste.</li>
        <li><strong>Modelado actualizado</strong> de la batimetría portuaria para mantener el valor de h preciso en el cálculo.</li>
        <li><strong>Plan de contingencia</strong> para escenarios de tormenta, incluyendo opción de recogida de boyas a posición de refugio.</li>
      </ul>

      <h3>3.6 Conclusión</h3>
      <p>El modelado geométrico del radio de Borneo mediante el teorema de Pitágoras y el análisis del segmento circular de solapamiento proporciona una herramienta rigurosa y de bajo costo computacional para la gestión de seguridad portuaria en operaciones offshore. La aplicación de la fórmula L_max = √(h² + D²), combinada con un factor de seguridad adecuado y un protocolo operativo escalonado, permite garantizar la integridad de las operaciones de transferencia de hidrocarburos en el Puerto de La Libertad.</p>
    `
  }
};

let currentMemoria = 1;

function renderMemoria() {
  const content = document.getElementById('memoria-content');
  content.innerHTML = memoriaParts[currentMemoria].html;

  // Renderizar fórmulas KaTeX
  const formulas = {
    'mem-f1': String.raw`L^2 = h^2 + r^2`,
    'mem-f2': String.raw`r = \sqrt{L^2 - h^2}`,
    'mem-f3': String.raw`r = \sqrt{20^2 - 15^2} = \sqrt{175} \approx 13.23\ \text{m}`,
    'mem-f4': String.raw`A_{\text{solap}} = r^2 \arccos\!\left(\frac{D}{r}\right) - D\,\sqrt{r^2 - D^2}`,
    'mem-f5': String.raw`\eta = \frac{A_{\text{solap}}}{\pi r^2} = \frac{\arccos(D/r)}{\pi} - \frac{D\,\sqrt{r^2 - D^2}}{\pi r^2}`,
    'mem-f6': String.raw`r_{\text{crit}} = D`,
    'mem-f7': String.raw`L_{\text{max}} = \sqrt{h^2 + D^2}`,
    'mem-f8': String.raw`L_{\text{op}} = \frac{L_{\text{max}}}{FS} = \frac{\sqrt{h^2 + D^2}}{FS}`
  };
  setTimeout(() => {
    Object.keys(formulas).forEach(id => {
      const el = document.getElementById(id);
      if (el && window.katex) {
        katex.render(formulas[id], el, { throwOnError: false, displayMode: true });
      }
    });
  }, 50);
}

document.querySelectorAll('.memoria-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.memoria-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentMemoria = parseInt(t.dataset.mem, 10);
    renderMemoria();
  });
});

document.getElementById('memoria-print').addEventListener('click', () => {
  window.print();
});

/* =====================================================
   INICIALIZACIÓN DE NUEVAS PESTAÑAS
   ===================================================== */
window.addEventListener('load', () => {
  renderPitchSegments();
  showEscenario('calma');
  animateEscenarioCanvas();
  generateGeoJSON();
  renderMemoria();
});
