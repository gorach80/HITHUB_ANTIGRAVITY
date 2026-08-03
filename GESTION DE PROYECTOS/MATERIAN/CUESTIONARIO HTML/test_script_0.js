
/* ==================================================================
   DATOS COMPLETOS DE LA EVALUACIÓN
   ================================================================== */

/* --- SECCIÓN 1: V/F — Diseño del Producto (10 preguntas) --- */
const S1=[
{id:1,text:"El Despliegue de la Función de Calidad (QFD) utiliza la matriz denominada \"Casa de la Calidad\" para traducir la Voz del Cliente (VoC) en Características Críticas para la Calidad (CTQ).",answer:true,expl:"El QFD es una metodología de diseño sistemática que captura la VoC y la mapea estructuradamente mediante la Casa de la Calidad para obtener parámetros críticos CTQ."},
{id:2,text:"En la fórmula del cálculo del QFD \\(A_j = \\sum_{i=1}^{n} (d_i \\cdot W_{ij})\\), el término \\(d_i\\) representa la matriz de ponderación y \\(W_{ij}\\) representa la importancia relativa de los requerimientos.",answer:false,expl:"Es al revés: \\(d_i\\) representa el vector de importancia relativa asignado por el mercado a cada requerimiento, y \\(W_{ij}\\) es la matriz de ponderación."},
{id:3,text:"La Norma ISO 128 rige la estandarización del dibujo técnico, estableciendo que las líneas continuas gruesas representan contornos vistos y las líneas de trazo/punto representan ejes de simetría.",answer:true,expl:"La norma ISO 128 estandariza los tipos de líneas en planos técnicos, asignando líneas gruesas a las aristas y contornos visibles, y líneas de trazo y punto para ejes y centros de simetría."},
{id:4,text:"La Ingeniería de Valor (VE) define el valor del producto como la proporción inversa entre el costo y la función, expresada matemáticamente como \\(V = C / F\\).",answer:false,expl:"La Ingeniería de Valor define el valor como la proporción directa entre la función y el costo, es decir, \\(V = F / C\\)."},
{id:5,text:"El índice de capacidad del proceso \\(C_p\\) toma en cuenta el centrado de la media del proceso con respecto a los límites de especificación superior (USL) e inferior (LSL).",answer:false,expl:"El índice \\(C_p\\) solo evalúa la dispersión total (ancho) del proceso frente al rango de especificaciones. El índice que considera el centrado de la media es el \\(C_{pk}\\)."},
{id:6,text:"Para calcular la velocidad del husillo \\(n\\) en un torno CNC, se utiliza la fórmula \\(n = \\frac{v_c \\cdot 1000}{\\pi \\cdot D_0}\\), donde \\(v_c\\) es la velocidad de corte y \\(D_0\\) es el diámetro de la pieza.",answer:true,expl:"Esta es la fórmula metalúrgica estándar para convertir la velocidad de corte lineal (m/min) a velocidad de rotación angular del husillo (RPM), compensando el diámetro en milímetros."},
{id:7,text:"La eficiencia global de una línea de producción \\(E\\) se calcula como la sumatoria de los tiempos de todas las tareas dividida por el producto del número de estaciones \\(K\\) y el tiempo de ciclo \\(T_c\\).",answer:true,expl:"La fórmula matemática es \\(E = \\frac{\\sum t_i}{K \\cdot T_c} \\times 100\\%\\), donde se compara la suma del tiempo neto de trabajo contra el tiempo total asignado a todas las estaciones de trabajo."},
{id:8,text:"En el método de la Ruta Crítica (CPM), las actividades críticas son aquellas que poseen una holgura total positiva (\\(H > 0\\)).",answer:false,expl:"Las actividades críticas son aquellas que tienen una holgura total igual a cero (\\(H = 0\\)), lo que significa que cualquier retraso en ellas retrasará todo el proyecto."},
{id:9,text:"El Valor Actual Neto (VAN) se define como la sumatoria de los flujos netos de caja futuros descontados a una tasa de costo de oportunidad, sin restar la inversión inicial.",answer:false,expl:"El cálculo del VAN requiere restar explícitamente la inversión inicial (\\(I_0\\)) en el año cero, tal como se expresa en la ecuación: \\(VAN = -I_0 + \\sum \\frac{F_t}{(1+k)^t}\\)."},
{id:10,text:"La Tasa Interna de Retorno (TIR) es la tasa de descuento que hace que el Valor Actual Neto (VAN) de un proyecto sea exactamente igual a cero.",answer:true,expl:"Por definición, la TIR es la tasa de rendimiento de la inversión que satisface la condición matemática de igualar la suma de los flujos de caja descontados con la inversión inicial, haciendo que el VAN sea cero."}
];

/* --- SECCIÓN 2: Selección única — Localización (20 preguntas) --- */
const S2=[
{id:11,text:"¿Cuál es el objetivo principal del estudio de localización?",opts:["Determinar el presupuesto total","Identificar el lugar geográfico óptimo para el proyecto","Definir el tamaño de la planta","Establecer el cronograma"],c:1,expl:"El estudio de localización busca determinar la ubicación geográfica más conveniente considerando múltiples factores de viabilidad y rentabilidad."},
{id:12,text:"¿Qué tipo de factores incluye costos de mano de obra, terrenos, transporte y energía?",opts:["Factores sociales","Factores políticos","Factores económicos o cuantificables","Factores ambientales"],c:2,expl:"Los factores económicos son aquellos expresables en términos monetarios: mano de obra, terrenos, energía, transporte, materias primas."},
{id:13,text:"En el método de factores ponderados, ¿qué representa el peso asignado a cada factor?",opts:["El costo monetario","La importancia relativa del factor","El número de ubicaciones que cumplen","La calificación máxima"],c:1,expl:"El peso refleja la importancia relativa de cada factor frente a los demás, permitiendo priorizar los más críticos."},
{id:14,text:"¿Cuál es la diferencia entre macrolocalización y microlocalización?",opts:["Macro analiza costos, micro analiza leyes","Macro determina la región general, micro el sitio específico","Macro es para servicios, micro para industria","Son sinónimos"],c:1,expl:"Macrolocalización define la región/zona amplia; microlocalización identifica el sitio exacto, manzana o lote dentro de esa región."},
{id:15,text:"¿Qué método utiliza coordenadas geográficas y volúmenes para minimizar costos de transporte?",opts:["Factores ponderados","Punto de equilibrio","Centro de gravedad","Modelo de asignación"],c:2,expl:"El método del centro de gravedad calcula un punto óptimo usando coordenadas ponderadas por volúmenes de flujo."},
{id:16,text:"En el análisis de punto de equilibrio por localización, ¿qué se compara?",opts:["Calidad de vida","Costos fijos y variables para diferentes niveles de producción","Regulaciones ambientales","Disponibilidad de mano de obra"],c:1,expl:"Compara costos fijos y variables de cada ubicación para diferentes volúmenes, identificando rangos donde cada alternativa es más económica."},
{id:17,text:"¿Cuál NO es un factor típico de localización industrial?",opts:["Disponibilidad de materias primas","Cercanía a mercados","Diseño organizacional de la empresa","Infraestructura de transporte"],c:2,expl:"El diseño organizacional es una decisión interna que no depende de la ubicación geográfica."},
{id:18,text:"En localización de servicios, ¿cuál es el factor predominante?",opts:["Costo del terreno","Cercanía y accesibilidad para los usuarios","Disponibilidad de materias primas","Cercanía a puertos"],c:1,expl:"En servicios, el factor predominante es la cercanía al usuario final, ya que el cliente acude al servicio."},
{id:19,text:"¿Qué son los costos hundidos en localización?",opts:["Costos que se recuperan al vender el terreno","Costos ya incurridos no recuperables al cambiar de ubicación","Costos de transporte","Costos variables que aumentan con la producción"],c:1,expl:"Los costos hundidos son inversiones ya realizadas que no pueden recuperarse independientemente de la decisión futura."},
{id:20,text:"¿Qué ventaja representa la aglomeración industrial (clusters)?",opts:["Reduce la competencia","Permite compartir infraestructura y servicios especializados","Elimina necesidad de estudios","Garantiza menores costos de mano de obra"],c:1,expl:"Los clusters permiten compartir infraestructura, servicios, mano de obra especializada y redes de proveedores."},
{id:21,text:"¿Qué técnica matemática usa el método de transporte para minimizar costos?",opts:["Regresión lineal","Programación lineal","Análisis de componentes principales","Simulación de Montecarlo"],c:1,expl:"El método de transporte usa programación lineal para la asignación óptima que minimiza costos totales de distribución."},
{id:22,text:"¿Qué rol juegan los incentivos fiscales y zonas francas?",opts:["No tienen impacto","Son factores gubernamentales que reducen costos operativos","Determinan la viabilidad legal exclusivamente","Solo aplican a tecnología de punta"],c:1,expl:"Los incentivos fiscales pueden reducir significativamente costos operativos, haciendo atractiva una ubicación."},
{id:23,text:"¿Cuál es la primera etapa del estudio de localización?",opts:["Evaluar alternativas cuantitativamente","Definir requisitos y factores de localización","Seleccionar el sitio exacto","Análisis de punto de equilibrio"],c:1,expl:"Primero se definen los requisitos del proyecto y factores relevantes, base para preseleccionar y evaluar ubicaciones."},
{id:24,text:"Una industria orientada al mercado se localiza cerca de:",opts:["Fuentes de materias primas","Centros de consumo o demanda","Zonas rurales de bajo costo","Puertos marítimos exclusivamente"],c:1,expl:"La industria orientada al mercado se ubica cerca de los centros de consumo porque el costo de transportar el producto terminado es mayor."},
{id:25,text:"Un índice de localización menor a 1 indica:",opts:["La región es ideal","Concentración del sector menor a la nacional, potencial de desarrollo","La región está saturada","No puede ser menor a 1"],c:1,expl:"Índice < 1 indica subrepresentación del sector en la región, lo que puede señalar potencial de desarrollo."},
{id:26,text:"¿Qué factor ganó relevancia por los acuerdos comerciales internacionales?",opts:["El clima","Cercanía a puertos y fronteras para comercio exterior","El color de edificaciones","Número de universidades"],c:1,expl:"La globalización aumentó la importancia de cercanía a puertos, fronteras y corredores logísticos internacionales."},
{id:27,text:"¿Qué se entiende por 'factores cualitativos'?",opts:["Medibles en dinero","No expresables directamente en términos monetarios","De calidad del producto","Solo importantes en microlocalización"],c:1,expl:"Son factores como calidad de vida, clima, actitud comunitaria, estabilidad política, que no se expresan fácilmente en dinero."},
{id:28,text:"¿Cuál es la limitación principal del método del centro de gravedad?",opts:["Solo funciona para un proveedor","Solo considera costo de transporte","Requiere cálculo diferencial avanzado","Solo aplica a servicios"],c:1,expl:"Su limitación es que solo minimiza costos de transporte sin considerar otros factores importantes."},
{id:29,text:"El 'nearshoring' se refiere a:",opts:["Localizar en el país de origen","Localizar en países cercanos al mercado objetivo","Cerrar y subcontratar todo","Localizar donde impuestos son más bajos"],c:1,expl:"Nearshoring es localizar operaciones en países cercanos geográficamente al mercado objetivo."},
{id:30,text:"¿Por qué es importante la Evaluación de Impacto Ambiental (EIA)?",opts:["Es trámite burocrático sin consecuencias","Determina si el proyecto puede desarrollarse legalmente y mitigar daños","Solo mejora imagen pública","Reemplaza todos los demás factores"],c:1,expl:"La EIA es fundamental porque puede determinar la viabilidad legal de la ubicación e identificar impactos a mitigar."}
];

/* --- SECCIÓN 3: Ordenamiento — Requerimientos Tecnológicos (2 items) --- */
const S3=[
{id:'A',title:'Proceso de Determinación de Requerimientos Tecnológicos',
sentences:[
"El primer paso es identificar las necesidades tecnológicas del proyecto comparando el estado actual con el estado deseado.",
"Se realiza un análisis de brechas (Gap Analysis) calculando Brecha_i = ED_i - EA_i para cada requerimiento identificado.",
"Si la brecha resultante es mayor a cero, existe un déficit tecnológico que requiere inversión en equipamiento o infraestructura.",
"Se elabora la especificación técnica incluyendo parámetros de desempeño, condiciones de operación y normativas aplicables.",
"Se cuantifica el Costo Total de Propiedad (TCO) considerando adquisición, instalación, operación, mantenimiento y desecho.",
"Se calculan los indicadores de confiabilidad: tasa de fallos (lambda), MTBF, MTTR y disponibilidad del equipo candidato.",
"Se evalúa la inversión con ROI, NPV y análisis costo-beneficio para justificar económicamente el requerimiento.",
"Se construye una matriz de evaluación ponderada comparando alternativas tecnológicas según criterios definidos.",
"Se verifica el cumplimiento de normativas como IEC 61511 para niveles de integridad de seguridad SIL.",
"Se integran criterios de redundancia y respaldo en el diseño final antes de la adquisición y puesta en marcha."
]},
{id:'B',title:'Dimensionamiento de Servicios Industriales',
sentences:[
"Se identifican todos los equipos y sistemas que requieren servicios industriales: eléctrico, agua, aire comprimido y vapor.",
"Se calcula la potencia instalada total sumando las potencias nominales de todos los equipos eléctricos del proyecto.",
"Se determina la demanda máxima multiplicando la potencia instalada por el factor de demanda, típicamente entre 0.6 y 0.8.",
"Se dimensiona el transformador con reserva dividiendo la demanda entre 0.8 y multiplicando por un factor de 1.25.",
"Se calcula el caudal de agua contra incendios según NFPA 15 como el producto del área por la densidad de aplicación.",
"Se determina el volumen de reserva de agua como Q por T_descarga multiplicado por 1.1 como margen de seguridad.",
"Se calcula el caudal de aire libre (FAD) requerido sumando consumos de cada equipo dividido por la eficiencia de red.",
"Se determina la potencia del compresor usando la fórmula isotérmica con presiones de succión y descarga.",
"Se dimensionan los sistemas HVAC considerando ventilación, presurización de áreas clasificadas y aire acondicionado.",
"Se integran todos los servicios en el plan de infraestructura verificando capacidad y redundancia del sistema completo."
]}
];

/* --- SECCIÓN 4: Completamiento — Planificación Productiva y Logística (2 items × 10) --- */
const S4=[
{id:'A',title:'Planificación de la Producción y Capacidad Productiva',
questions:[
{parts:["La planificación "," tiene un horizonte de 1 a 5 años y define la capacidad instalada y las inversiones en planta."],answer:"estratégica",alts:["estrategica"],expl:"La planificación estratégica es de largo plazo (1-5 años) y define capacidad instalada, inversiones y nuevos productos."},
{parts:["El Programa Maestro de Producción (MPS) despliega el plan agregado en productos individuales con "," y fechas específicas."],answer:"cantidades",alts:["cantidad"],expl:"El MPS convierte el plan agregado en cantidades específicas de productos individuales con fechas definidas."},
{parts:["En la lógica MRP, para la ecuación \(RN_t = \max\{0, GB_t - IH_{t-1} - \text{RR}_t\}\), el término de recepciones programadas es ","."],answer:"RR_t",alts:["rr_t","recepciones programadas","recepcion"],expl:"RR_t son las recepciones programadas del período t, que se restan del requerimiento bruto junto con el inventario inicial."},
{parts:["La capacidad de diseño se calcula como \(C_{\text{diseño}} = n \times T \times r\), donde la variable de tasa de producción por equipo es ","."],answer:"r",alts:["tasa","tasa de produccion","produccion"],expl:"r es la tasa de producción por equipo (unidades/hora), el tercer factor de la fórmula de capacidad de diseño."},
{parts:["La capacidad efectiva es igual a la capacidad de diseño multiplicada por la utilización y el "," (eficiencia del proceso)."],answer:"rendimiento",alts:["eficiencia","eta rendimiento","η_rendimiento"],expl:"Los dos factores que reducen la capacidad de diseño a capacidad efectiva son la utilización y el rendimiento."},
{parts:["Operar sistemáticamente por encima del ","% de capacidad efectiva incrementa la probabilidad de fallos y errores humanos."],answer:"85",alts:["85%"],expl:"El umbral de riesgo es 85%. Por encima de este valor, hay poca flexibilidad, estrés en equipos y mayor probabilidad de incidentes."},
{parts:["El OEE se calcula como \(\text{OEE} = A \times P \times Q\), donde la letra que representa el factor de Calidad es ","."],answer:"Q",alts:["calidad","q","factor de calidad"],expl:"OEE = Disponibilidad × Rendimiento × Calidad. La Q representa el factor de calidad."},
{parts:["La disponibilidad en el OEE es \(A = \frac{T_{\text{planificado}} - T_{\text{paradas}}}{T_{\text{planificado}}}\), donde la variable del denominador es ","."],answer:"T_planificado",alts:["t_planificado","tiempo planificado","tp"],expl:"La disponibilidad es el tiempo de producción dividido entre el tiempo planificado de operación."},
{parts:["En el balanceo de líneas, el tiempo de ciclo objetivo es \(C = \frac{T_{\text{disponible}}}{D_{\text{requerida}}}\), donde la variable del denominador es ","."],answer:"D_requerida",alts:["d_requerida","demanda requerida","demanda","d"],expl:"El tiempo de ciclo objetivo es el tiempo disponible dividido por la demanda requerida en el mismo período."},
{parts:["La holgura de balanceo \(H = N_{\text{real}} \times C_{\max} - \sum t_i\) calcula la diferencia restando la "," de todos los tiempos de tarea."],answer:"suma",alts:["sumatoria","total","σ","sum"],expl:"La holgura es la diferencia entre el tiempo total asignado y la suma de los tiempos de todas las tareas."}
]},
{id:'B',title:'Logística y Gestión de Inventarios',
questions:[
{parts:["El EOQ se calcula como \(Q^* = \sqrt{\frac{2 \cdot D \cdot S}{H}}\), donde la variable del costo de almacenamiento en el denominador es ","."],answer:"H",alts:["h","costo de mantenimiento","ch"],expl:"H es el costo de mantener una unidad por año ($/unidad·año), el denominador de la fórmula del EOQ."},
{parts:["Si se conoce el costo unitario \(C\) y la tasa de mantenimiento \(h\), entonces \(H = h \times\) ","."],answer:"C",alts:["c","costo unitario","costo"],expl:"H se calcula multiplicando la tasa de mantenimiento por el costo unitario del artículo."},
{parts:["El número de pedidos por año se calcula como \(N = \frac{D}{Q^*}\), donde la variable de demanda anual en el numerador es ","."],answer:"D",alts:["d","demanda","demanda anual"],expl:"Se divide la demanda anual D entre la cantidad económica de pedido Q*."},
{parts:["El tiempo entre pedidos (TBO) se calcula como \(\text{TBO} = \frac{Q^*}{D} \times\) "," \(\text{días.}\)"],answer:"365",alts:["365 dias","365d","trescientos sesenta y cinco"],expl:"El TBO convierte la fracción Q*/D (proporción del año) a días multiplicando por 365."},
{parts:["El punto de reorden determinístico es \(\text{ROP} = d \times L\), donde la variable que representa el lead time es ","."],answer:"L",alts:["l","lead time","tiempo de entrega","lt"],expl:"L es el lead time (tiempo de reposición) en días. ROP = demanda diaria × lead time."},
{parts:["El punto de reorden con stock de seguridad es \(\text{ROP} = \bar{d} \times L +\) ","."],answer:"SS",alts:["ss","stock de seguridad","stock seguridad"],expl:"SS es el stock de seguridad, que se suma al producto de la demanda promedio por el lead time."},
{parts:["El stock de seguridad se calcula como \(\text{SS} = Z \cdot \sigma_d \cdot \sqrt{L}\), donde la variable dentro de la raíz es ","."],answer:"L",alts:["l","lead time","lt"],expl:"La fórmula del stock de seguridad multiplica Z por la desviación estándar de la demanda por la raíz cuadrada del lead time."},
{parts:["Para materiales de seguridad como EPP, se requiere un nivel de servicio del ","% o superior, con \(Z = 2.33\)."],answer:"99",alts:["99%","noventa y nueve"],expl:"Los EPP y materiales de seguridad requieren nivel de servicio de 99% o superior según normativa de seguridad industrial."},
{parts:["Cuando la demanda y el lead time son variables, \(\text{SS} = Z \cdot \sqrt{L \cdot \sigma_d^2 + \bar{d}^2 \cdot \sigma_L^2}\), donde la varianza del lead time es ","."],answer:"σ_L²",alts:["sigma_l²","varianza del lead time","varianza lt","sigma_l al cuadrado"],expl:"Se agrega el término de la varianza del lead time (σ_L²) ponderado por la demanda promedio al cuadrado."},
{parts:["En el EOQ con descuentos por volumen, se evalúa el costo total \(\text{CT}\) para cada rango de "," y se selecciona el de menor costo."],answer:"precio",alts:["precios","c_j","costo","costos","precio c_j"],expl:"Se evalúa el costo total para cada rango de precio (C_j) y se elige el rango que minimiza el costo total."}
]}
];

/* --- SECCIÓN 5: Unir Columnas — Indicadores Financieros (2 items) --- */
const S5=[
{
    id:'A',
    title:'Ítem A: Conceptos y Criterios del Tema 5.4',
    leftItems:[
        {id:1, text:"Valor Actual Neto (VAN)"},
        {id:2, text:"Tasa Interna de Retorno (TIR)"},
        {id:3, text:"Periodo de Recuperación Simple (PRI)"},
        {id:4, text:"Periodo de Recuperación Descontado (PRID)"},
        {id:5, text:"Tasa Mínima Aceptable de Rendimiento (TMAR)"},
        {id:6, text:"Apalancamiento Financiero"},
        {id:7, text:"Costo de Oportunidad del Capital"},
        {id:8, text:"Prima por Riesgo"},
        {id:9, text:"Curva de Perfil del VAN"},
        {id:10, text:"Decisión Viable de Inversión"}
    ],
    rightItems:[
        {val:"A", text:"Mide la ganancia neta en valor presente de hoy, descontando flujos a la TMAR y restando la inversión inicial."},
        {val:"B", text:"Tasa de descuento que iguala el VAN exactamente a cero, representando la rentabilidad del proyecto."},
        {val:"C", text:"Tiempo necesario para recuperar la inversión inicial sin considerar el costo del dinero en el tiempo."},
        {val:"D", text:"Tiempo de recuperación obtenido aplicando la tasa de descuento a cada flujo de caja futuro."},
        {val:"E", text:"Tasa mínima que exige el inversionista para cubrir inflación, riesgo y costo de oportunidad."},
        {val:"F", text:"Efecto de financiamiento que incrementa la TIR del inversionista frente a la del proyecto."},
        {val:"G", text:"Rendimiento que se obtendría en la mejor alternativa de inversión con riesgo equivalente."},
        {val:"H", text:"Compensación exigida por la incertidumbre y complejidad asociada al proyecto de ingeniería."},
        {val:"I", text:"Línea gráfica que muestra la sensibilidad del VAN frente a variaciones de la tasa de descuento."},
        {val:"J", text:"Condición de aceptación donde VAN > 0, TIR > TMAR y el PRI está dentro del horizonte útil del proyecto."}
    ]
},
{
    id:'B',
    title:'Ítem B: Fórmulas y Ecuaciones del Tema 5.4',
    leftItems:[
        {id:1, text:"Valor Presente de un Flujo Futuro"},
        {id:2, text:"Ecuación General del VAN"},
        {id:3, text:"Condición de Frontera para la TIR"},
        {id:4, text:"Fórmula de Interpolación Lineal para TIR"},
        {id:5, text:"Cálculo de la Cuerda para el PRI Simple"},
        {id:6, text:"Fórmula Teórica de la TMAR"},
        {id:7, text:"Factor de Descuento (FD)"},
        {id:8, text:"Flujo Acumulado Descontado"},
        {id:9, text:"Criterio de Viabilidad del VAN"},
        {id:10, text:"Ecuación de la Proporción de Valor (VE)"}
    ],
    rightItems:[
        {val:"A", text:"\\(VP(F_t) = \\frac{F_t}{(1+i)^t}\\)"},
        {val:"B", text:"\\(VAN = -I_0 + \\sum_{t=1}^{n} \\frac{F_t}{(1+i)^t}\\)"},
        {val:"C", text:"\\(VAN(TIR) = 0\\)"},
        {val:"D", text:"\\(TIR = i_1 + \\frac{VAN_1}{VAN_1 - VAN_2} \\times (i_2 - i_1)\\)"},
        {val:"E", text:"\\(PRI = t^{-} + \\frac{|FA_{t^{-}}|}{FNP_{t^{+}}}\\)"},
        {val:"F", text:"\\(TMAR = i_o + \\pi + r_p\\)"},
        {val:"G", text:"\\(FD_t = \\frac{1}{(1+i)^t}\\)"},
        {val:"H", text:"\\(FA_{\\text{desc},t} = \\sum_{k=0}^{t} \\frac{FNP_k}{(1+i)^k}\\)"},
        {val:"I", text:"\\(VAN > 0\\)"},
        {val:"J", text:"\\(V = \\frac{F}{C}\\)"}
    ]
}
];

/* ==================================================================
   ESTADO GLOBAL
   ================================================================== */

    // WIPE PREVIOUS REGISTERS ON START
    try {
        localStorage.removeItem('evalH_v6');
        localStorage.removeItem('evalH_v5');
        localStorage.removeItem('evalH_v4');
        localStorage.removeItem('evalH_v3');
    } catch(e){}
    
let CU=null, curSec=1, curQ=0, answers=[], timerInt=null, timeRem=0, s5Shuffled=[];
let secScores={s1:null,s2:null,s3:null,s4:null,s5:null};
let cheatWarnings=0;
const MAX_WARNINGS=3;
const EXAM_START_TIME=new Date('2026-08-02T15:00:00-05:00');
const EXAM_DEADLINE=new Date('2026-08-03T10:00:00-05:00');
let examActive=false;
let infractionDebounce=false;
const SEC_TIME=[0,25*60,20*60,12*60,15*60,18*60]; // 5 secciones
const SEC_TOTAL=[0,5,10,5,10,10]; // puntos por sección
const SEC_START=[0,0,10,30,32,34]; // índice inicial en allQ
const SEC_END=[0,10,30,32,34,36]; // índice final en allQ

function initS5Shuffled(){
    s5Shuffled = [];
    S5.forEach((item) => {
        let pool = item.rightItems.map((ri) => ({originalVal: ri.val, text: ri.text}));
        // Mezclar el pool
        for(let j=pool.length-1; j>0; j--){
            let k = Math.floor(Math.random()*(j+1));
            [pool[j], pool[k]] = [pool[k], pool[j]];
        }
        // Asignar letras A-J en el orden mezclado
        const letters = ['A','B','C','D','E','F','G','H','I','J'];
        let choices = pool.map((el, idx) => ({
            letter: letters[idx],
            originalVal: el.originalVal,
            text: el.text
        }));
        s5Shuffled.push(choices);
    });
}

function initAnswers(){
    answers=[];
    S1.forEach(()=>answers.push({type:'vf',sel:null,just:''}));
    S2.forEach(()=>answers.push({type:'mc',sel:null}));
    S3.forEach((item)=>{
        let order=[];
        for(let j=0;j<item.sentences.length;j++) order.push(j);
        // Mezclar
        for(let j=order.length-1;j>0;j--){let k=Math.floor(Math.random()*(j+1));[order[j],order[k]]=[order[k],order[j]];}
        answers.push({type:'ord',order:order,checked:false,score:0});
    });
    S4.forEach(item=>{
        let qs=[];
        item.questions.forEach(()=>qs.push(''));
        answers.push({type:'fill',responses:qs});
    });
    initS5Shuffled();
    S5.forEach(()=>{
        answers.push({type:'match',selections: Array(10).fill('')});
    });
}

/* ==================================================================
   PARTÍCULAS Y UTILIDADES
   ================================================================== */
(function(){const c=document.getElementById('particles');for(let i=0;i<20;i++){const p=document.createElement('div');p.className='particle';p.style.left=Math.random()*100+'%';const s=(2+Math.random()*3)+'px';p.style.width=s;p.style.height=s;p.style.animationDuration=(12+Math.random()*18)+'s';p.style.animationDelay=(Math.random()*15)+'s';c.appendChild(p);}})();

function toast(m,t='success'){const c=document.getElementById('toastC');const e=document.createElement('div');e.className=`toast ${t}`;const ic={success:'fa-check-circle',warning:'fa-exclamation-circle',error:'fa-times-circle'};e.innerHTML=`<i class="fas ${ic[t]}"></i><span>${m}</span>`;c.appendChild(e);setTimeout(()=>{e.classList.add('to');setTimeout(()=>e.remove(),300);},3500);}
function showModal(t,fn){document.getElementById('modalTxt').textContent=t;document.getElementById('modal').classList.add('active');document.getElementById('modalConf').onclick=fn;}
function closeModal(){document.getElementById('modal').classList.remove('active');}
function showScr(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function norm(s){return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[_\-\s]+/g,' ').trim();}

/* ==================================================================
   LOGIN MICROSOFT Y MANUAL
   ================================================================== */
function msLogin() {
    const accounts = [
        { name: "María Fernanda López", email: "maria.lopez@upse.edu.ec" },
        { name: "Carlos Andrés Rodríguez", email: "carlos.rodriguez@upse.edu.ec" },
        { name: "Juan Pablo Hernández", email: "juan.hernandez@upse.edu.ec" },
        { name: "Ana Sofía Torres", email: "ana.torres@upse.edu.ec" }
    ];
    const container = document.getElementById('microsoftAccountsList');
    container.innerHTML = '';
    accounts.forEach(acc => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '12px';
        div.style.padding = '12px';
        div.style.border = '1px solid #e0e0e0';
        div.style.borderRadius = '6px';
        div.style.background = '#fcfcfc';
        div.style.cursor = 'pointer';
        div.style.transition = 'all 0.15s';
        div.onmouseover = () => { div.style.borderColor = '#0078d4'; div.style.background = '#f3f2f1'; };
        div.onmouseout = () => { div.style.borderColor = '#e0e0e0'; div.style.background = '#fcfcfc'; };
        div.onclick = () => selectMsAcc(acc);
        
        const avatar = document.createElement('div');
        avatar.className = 'uav';
        avatar.style.width = '32px';
        avatar.style.height = '32px';
        avatar.style.fontSize = '13px';
        avatar.style.background = '#0078d4';
        avatar.style.color = '#ffffff';
        avatar.textContent = acc.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
        
        const info = document.createElement('div');
        info.style.textAlign = 'left';
        info.innerHTML = `<div style="font-weight:600; font-size:13px; color:#242424;">${acc.name}</div><div style="font-size:11px; color:#616161;">${acc.email}</div>`;
        
        div.appendChild(avatar);
        div.appendChild(info);
        container.appendChild(div);
    });
    
    // Usar otra cuenta
    const otherDiv = document.createElement('div');
    otherDiv.style.display = 'flex';
    otherDiv.style.alignItems = 'center';
    otherDiv.style.gap = '12px';
    otherDiv.style.padding = '12px';
    otherDiv.style.border = '1px dashed #cccccc';
    otherDiv.style.borderRadius = '6px';
    otherDiv.style.cursor = 'pointer';
    otherDiv.style.transition = 'all 0.15s';
    otherDiv.onmouseover = () => { otherDiv.style.borderColor = '#0078d4'; otherDiv.style.background = '#f3f2f1'; };
    otherDiv.onmouseout = () => { otherDiv.style.borderColor = '#cccccc'; otherDiv.style.background = '#ffffff'; };
    otherDiv.onclick = () => { closeMsModal(); toast('Ingrese sus datos en el formulario inferior.', 'warning'); };
    otherDiv.innerHTML = `<div class="uav" style="width:32px; height:32px; font-size:13px; background:#f3f2f1; color:#0078d4;"><i class="fas fa-user-plus"></i></div><div style="font-weight:500; font-size:13px; color:#616161; text-align:left;">Usar otra cuenta</div>`;
    container.appendChild(otherDiv);
    
    document.getElementById('microsoftModal').style.display = 'flex';
}
function closeMsModal() {
    document.getElementById('microsoftModal').style.display = 'none';
}
function selectMsAcc(acc) {
    closeMsModal();
    acc.career = document.getElementById('mCarrera').value;
    const c = document.getElementById('mC').value.trim();
    acc.cedula = c || '0900000000';
    verifyRegistration(acc, () => {
        CU = acc;
        setupInstr();
        showScr('sInstr');
        toast(`Conexión exitosa. Bienvenido, ${acc.name.split(' ')[0]}`, 'success');
    });
}

function mLogin(){
    const n=document.getElementById('mN').value.trim(),c=document.getElementById('mC').value.trim(),e=document.getElementById('mE').value.trim(),er=document.getElementById('lErr');
    if(!n||n.length<3){er.textContent='Ingresa tu nombre completo.';er.style.display='block';return;}
    if(!c||c.length<8){er.textContent='Ingresa tu número de cédula de identidad válido (mín. 8 dígitos).';er.style.display='block';return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){er.textContent='Ingresa un correo válido.';er.style.display='block';return;}
    er.style.display='none';
    
    const acc = {name:n, cedula:c, email:e, career: document.getElementById('mCarrera').value};
    verifyRegistration(acc, () => {
        CU = acc;
        setupInstr();
        showScr('sInstr');
        toast(`Bienvenido/a, ${n.split(' ')[0]}`,'success');
    });
}

/* --- CONTROL DE DUPLICADOS (LOCAL Y EN LA NUBE) --- */
function verifyRegistration(acc, onAllowed) {
    const email = acc.email.trim().toLowerCase();
    if (email === 'lpalate5942@upse.edu.ec' || email === 'luis.palate@upse.edu.ec') {
        onAllowed();
        return;
    }
    const er = document.getElementById('lErr');
    if (er) er.style.display = 'none';

    // Verificación de Fecha y Hora Límite (Hasta el 03/08/2026 10:00 AM)
    if (new Date() > EXAM_DEADLINE) {
        toast('Evaluación cerrada: El tiempo límite expiró.', 'error');
        if (er) {
            er.textContent = 'Acceso denegado: El periodo de evaluación finalizó a las 10:00 AM del 03/08/2026.';
            er.style.display = 'block';
        }
        showModal('<strong>EVALUACIÓN CERRADA</strong><br><br>El plazo para rendir esta evaluación concluyó el <strong>03/08/2026 a las 10:00 AM</strong>.<br><br>Ya no es posible ingresar o rendir el examen.');
        return;
    }

    // 1. Verificación en Local (Historial de este navegador)
    const localHistory = JSON.parse(localStorage.getItem('evalH_v6') || '[]');
    const alreadyTakenLocal = localHistory.some(entry => entry.user && entry.user.email.trim().toLowerCase() === email);
    
    if (alreadyTakenLocal) {
        toast('Acceso denegado: Esta cuenta ya completó la evaluación.', 'error');
        if (er) {
            er.textContent = 'Acceso denegado: Esta cuenta ya completó la evaluación.';
            er.style.display = 'block';
        }
        return;
    }
    
    // 2. Verificación en la Nube (Google Apps Script)
    const urlParams = new URLSearchParams(window.location.search);
    let endpointUrl = urlParams.get('backup') || localStorage.getItem('backup_endpoint_url') || 'YOUR_APPS_SCRIPT_WEBAPP_URL_HERE';
    
    if (endpointUrl === 'YOUR_APPS_SCRIPT_WEBAPP_URL_HERE') {
        // Si no hay nube configurada, permitimos pasar con el control local
        onAllowed();
        return;
    }
    
    toast('Verificando estado de evaluación en la nube...', 'warning');
    
    fetch(`${endpointUrl}?checkEmail=${encodeURIComponent(email)}`)
    .then(r => r.json())
    .then(res => {
        if (res && res.exists) {
            toast('Acceso denegado: Ya has realizado esta evaluación.', 'error');
            if (er) {
                er.textContent = 'Acceso denegado: Ya has realizado esta evaluación (Verificado en la nube).';
                er.style.display = 'block';
            }
        } else {
            onAllowed();
        }
    })
    .catch(err => {
        console.warn('No se pudo verificar en la nube (CORS o Red). Usando control local:', err);
        // Fallback: Si falla el script de Google, dejamos pasar para no trabar la clase
        onAllowed();
    });
}
function updateCareerSub(val) {
    const subLabel = `Gestión de Proyectos — UPSE · ${val} (7mo Semestre)`;
    document.querySelector('#sLogin .lsub').textContent = subLabel;
}
function setupInstr(){
    document.getElementById('uNm').textContent=CU.name;
    document.getElementById('uEm').textContent=CU.email;
    document.getElementById('uAv').textContent=CU.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    const car = CU.career || 'Ingeniería Industrial';
    document.querySelector('#sInstr .isub').textContent = `5 secciones — 40 puntos totales — ${car}`;
}
document.getElementById('mE').addEventListener('keydown',e=>{if(e.key==='Enter')mLogin();});
document.getElementById('mN').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('mE').focus();});

/* --- CONFIGURACIÓN DE BACKUP ENDPOINT --- */
function openConfigModal() {
    document.getElementById('cfgBackupUrl').value = localStorage.getItem('backup_endpoint_url') || '';
    document.getElementById('configModal').classList.add('active');
}
function closeConfigModal() {
    document.getElementById('configModal').classList.remove('active');
}
function saveConfig() {
    const url = document.getElementById('cfgBackupUrl').value.trim();
    if (url && !url.startsWith('https://script.google.com/')) {
        toast('URL no válida. Debe ser de Google Apps Script.', 'error');
        return;
    }
    localStorage.setItem('backup_endpoint_url', url);
    closeConfigModal();
    toast('Endpoint de respaldo configurado.', 'success');
}
function loginAsDocente() {
    sessionStorage.setItem('docente_auth', 'true');
    CU = {
        name: "Ing. Luis A Palate G. Mg",
        email: "lpalate5942@upse.edu.ec",
        isDocente: true,
        career: document.getElementById('mCarrera').value
    };
    closeConfigModal();
    setupInstr();
    showScr('sInstr');
    toast('Acceso docente concedido (Modo Auditoría).', 'success');
}
function updateExamHeader(label) {
    const el = document.getElementById('eLbl');
    if (CU && CU.isDocente) {
        el.innerHTML = `${label} <span style="font-size:11px; background:var(--ac); color:#000; padding:2px 6px; border-radius:4px; margin-left:8px; font-weight:bold; vertical-align:middle; text-transform:uppercase;">Modo Auditoría Docente</span>`;
    } else {
        el.textContent = label;
    }
}

/* ==================================================================
   SISTEMA ANTI-TRAMPA (SEGURIDAD DE PANTALLA COMPLETA Y FOCO)
   ================================================================== */

/* --- Audio: Síntesis de Voz para Honestidad Académica --- */
function speakText(text, rate = 1.0) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.rate = rate;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Intentar usar una voz en español
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utter.voice = esVoice;
    window.speechSynthesis.speak(utter);
}

function playHonestyAudio() {
    const msg = 'Protocolo de Honestidad Académica. ' +
        'Estimado estudiante, esta evaluación cuenta con un sistema de monitoreo de seguridad activo. ' +
        'Es obligatorio permanecer en modo de pantalla completa durante toda la evaluación. ' +
        'Está prohibido cambiar de pestaña, minimizar el navegador, o abrir otras aplicaciones. ' +
        'El sistema detectará automáticamente cualquier intento de salir de la ventana del examen. ' +
        'Cada infracción será registrada como una advertencia de seguridad. ' +
        'Al acumular 3 advertencias, su examen será entregado y bloqueado de forma automática e irrevocable. ' +
        'Recuerde que el plazo límite para rendir esta evaluación es hasta las 10 de la mañana del lunes 3 de agosto de 2026. ' +
        'Cualquier acto de deshonestidad académica será sancionado según la normativa vigente de la Universidad Estatal Península de Santa Elena. ' +
        'Le deseamos éxito en su evaluación.';
    speakText(msg, 0.95);
}

function speakWarning(warningNum, maxWarnings, reason) {
    const msg = warningNum >= maxWarnings
        ? 'Atención. Su examen ha sido entregado automáticamente por acumular el límite de advertencias de seguridad.'
        : `Advertencia de seguridad número ${warningNum} de ${maxWarnings}. Motivo: ${reason}. ` +
          `Si acumula ${maxWarnings} advertencias, su evaluación se entregará de forma automática.`;
    speakText(msg, 1.05);
}

// Precargar voces del navegador
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
}

// Auto-reproducir protocolo en la primera interacción del usuario
// (Los navegadores bloquean audio sin interacción previa)
let honestyAutoPlayed = false;
function autoPlayHonesty() {
    if (honestyAutoPlayed) return;
    honestyAutoPlayed = true;
    playHonestyAudio();
    document.removeEventListener('click', autoPlayHonesty);
    document.removeEventListener('keydown', autoPlayHonesty);
    document.removeEventListener('touchstart', autoPlayHonesty);
}
document.addEventListener('click', autoPlayHonesty, { once: false });
document.addEventListener('keydown', autoPlayHonesty, { once: false });
document.addEventListener('touchstart', autoPlayHonesty, { once: false });

function reEnterFullscreen() {
    document.documentElement.requestFullscreen()
    .then(() => {
        document.getElementById('fullscreenBlocker').classList.remove('active');
    })
    .catch(err => {
        toast('Error al activar pantalla completa. Inténtalo de nuevo.', 'error');
    });
}
function showFullscreenBlocker() {
    document.getElementById('fullscreenBlocker').classList.add('active');
}
function handleInfraction(reason) {
    if (!examActive || (CU && CU.isDocente)) return;
    if (infractionDebounce) return;
    infractionDebounce = true;
    setTimeout(() => { infractionDebounce = false; }, 1500); // Debounce de 1.5s

    cheatWarnings++;
    speakWarning(cheatWarnings, MAX_WARNINGS, reason);
    if (cheatWarnings >= MAX_WARNINGS) {
        examActive = false;
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(()=>{});
        }
        document.getElementById('fullscreenBlocker').classList.remove('active');
        submitExam();
        showModal(`Tu examen ha sido entregado automáticamente por acumular el límite de ${MAX_WARNINGS} advertencias de seguridad (intentos de cambiar de pestaña, minimizar o perder el foco).`, () => {});
    } else {
        showModal(`<strong>¡ADVERTENCIA DE SEGURIDAD!</strong><br><br>Has salido de la pantalla del examen (${cheatWarnings}/${MAX_WARNINGS} advertencias).<br><br><strong>Motivo detectado:</strong> ${reason}.<br><br>Al acumular ${MAX_WARNINGS} advertencias, tu evaluación se entregará y bloqueará automáticamente de forma irrevocable.`, () => {
            if (!document.fullscreenElement) {
                showFullscreenBlocker();
            }
        });
    }
}

// Listeners de Monitoreo
document.addEventListener('fullscreenchange', () => {
    if (examActive && !document.fullscreenElement) {
        handleInfraction('Salir del modo Pantalla Completa');
    }
});
document.addEventListener('visibilitychange', () => {
    if (examActive && document.hidden) {
        handleInfraction('Cambio de pestaña o minimización del navegador');
    }
});
window.addEventListener('blur', () => {
    // Breve retraso para evitar falsos positivos si el foco se mueve a un modal del propio navegador
    setTimeout(() => {
        if (examActive && !document.hasFocus()) {
            handleInfraction('Pérdida de foco del navegador (cambio de ventana o aplicación)');
        }
    }, 100);
});
let gearClicks = 0, gearTimeout;
function handleGearClick(e) {
    gearClicks++;
    clearTimeout(gearTimeout);
    gearTimeout = setTimeout(() => { gearClicks = 0; }, 1000);
    if (gearClicks === 3) {
        gearClicks = 0;
        const pw = prompt("Ingrese la clave de seguridad docente para acceder:");
        if (pw === "1980") {
            openConfigModal();
        } else {
            toast("Clave incorrecta. Acceso denegado.", "error");
        }
    }
}

/* ==================================================================
   INICIAR EXAMEN Y SECCIONES
   ================================================================== */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startExam(){
    if (new Date() > EXAM_DEADLINE && (!CU || !CU.isDocente)) {
        showModal('<strong>TIEMPO LÍMITE ALCANZADO</strong><br><br>El plazo para rendir la evaluación finalizó el <strong>03/08/2026 a las 10:00 AM</strong>.<br><br>Ya no es posible iniciar el examen.');
        return;
    }
    shuffleArray(S1);
    shuffleArray(S2);
    S2.forEach(q => {
        if (q.opts && q.opts.length > 0) {
            const correctOptText = q.opts[q.c];
            shuffleArray(q.opts);
            q.c = q.opts.indexOf(correctOptText);
        }
    });
    shuffleArray(S4[0].questions);
    shuffleArray(S4[1].questions);
    
    initAnswers();
    curSec=1;
    curQ=0;
    secScores={s1:null,s2:null,s3:null,s4:null,s5:null};
    timeRem=SEC_TIME[1];
    buildMap();
    buildQs();
    showQ(0);
    
    cheatWarnings = 0;
    
    if (CU && CU.isDocente) {
        examActive = true;
        startTimer();
        updateExamHeader('Sección 1 — Verdadero / Falso');
        showScr('sExam');
    } else {
        document.documentElement.requestFullscreen()
        .then(() => {
            examActive = true;
            startTimer();
            updateExamHeader('Sección 1 — Verdadero / Falso');
            showScr('sExam');
        })
        .catch(err => {
            console.warn('Fullscreen request failed:', err);
            examActive = true;
            startTimer();
            updateExamHeader('Sección 1 — Verdadero / Falso');
            showScr('sExam');
            showFullscreenBlocker();
        });
    }
}

function finishSection(){
    clearInterval(timerInt);document.querySelector('.etimer').style.color='';
    const si=curSec-1;
    const scores=['s1','s2','s3','s4','s5'];
    secScores[scores[si]]=calcSecScore(curSec);
    showTransition(curSec);
}

function showTransition(sec){
    const t=document.getElementById('transTitle'),s=document.getElementById('transSub'),sm=document.getElementById('transSum'),b=document.getElementById('transBtn');
    if(sec===1){t.textContent='Sección 1 completada';s.textContent='Has finalizado Verdadero / Falso. Resumen:';const r=secScores.s1;sm.innerHTML=`<div class="sst sok"><div class="sv">${r.correct}</div><div class="sl">Correctas</div></div><div class="sst sbad"><div class="sv">${r.incorrect}</div><div class="sl">Incorrectas</div></div><div class="sst semp"><div class="sv">${r.empty}</div><div class="sl">Sin responder</div></div>`;b.innerHTML='<i class="fas fa-arrow-right"></i> Continuar a Sección 2 — Selección única';}
    else if(sec===2){t.textContent='Sección 2 completada';s.textContent='Has finalizado Selección única. Resumen:';const r=secScores.s2;sm.innerHTML=`<div class="sst sok"><div class="sv">${r.correct}</div><div class="sl">Correctas</div></div><div class="sst sbad"><div class="sv">${r.incorrect}</div><div class="sl">Incorrectas</div></div><div class="sst semp"><div class="sv">${r.empty}</div><div class="sl">Sin responder</div></div>`;b.innerHTML='<i class="fas fa-arrow-right"></i> Continuar a Sección 3 — Ordenamiento';}
    else if(sec===3){t.textContent='Sección 3 completada';s.textContent='Has finalizado Ordenamiento. Resumen:';const r=secScores.s3;sm.innerHTML=`<div class="sst ssc"><div class="sv">${r.score}</div><div class="sl">Puntos (de 5)</div></div><div class="sst sok"><div class="sv">${r.correct}</div><div class="sl">Posiciones correctas</div></div><div class="sst sbad"><div class="sv">${r.incorrect}</div><div class="sl">Posiciones incorrectas</div></div>`;b.innerHTML='<i class="fas fa-arrow-right"></i> Continuar a Sección 4 — Completamiento';}
    else if(sec===4){t.textContent='Sección 4 completada';s.textContent='Has finalizado Completamiento. Resumen:';const r=secScores.s4;sm.innerHTML=`<div class="sst ssc"><div class="sv">${r.score}</div><div class="sl">Puntos (de 10)</div></div><div class="sst sok"><div class="sv">${r.correct}</div><div class="sl">Respuestas OK</div></div><div class="sst sbad"><div class="sv">${r.incorrect}</div><div class="sl">Incorrectas</div></div>`;b.innerHTML='<i class="fas fa-arrow-right"></i> Continuar a Sección 5 — Unir Columnas';}
    else if(sec===5){submitExam();return;}
    showScr('sTrans');
}

function nextSection(){
    curSec++;timeRem=SEC_TIME[curSec];
    const labels=['','Sección 1 — Verdadero / Falso','Sección 2 — Selección única','Sección 3 — Ordenamiento','Sección 4 — Completamiento','Sección 5 — Unir las Columnas'];
    updateExamHeader(labels[curSec]);
    curQ=SEC_START[curSec];buildMap();buildQs();showQ(curQ);startTimer();showScr('sExam');
}

/* ==================================================================
   TIMER
   ================================================================== */
function startTimer(){
    updateTimerD();
    timerInt=setInterval(()=>{
        if (new Date() > EXAM_DEADLINE && (!CU || !CU.isDocente)) {
            clearInterval(timerInt);
            examActive = false;
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(()=>{});
            }
            document.getElementById('fullscreenBlocker').classList.remove('active');
            submitExam();
            showModal('<strong>TIEMPO LÍMITE DE LA EVALUACIÓN ALCANZADO</strong><br><br>Se ha alcanzado la fecha y hora límite de cierre (03/08/2026 10:00 AM). Tu examen ha sido entregado automáticamente con las respuestas guardadas.');
            return;
        }
        timeRem--;
        updateTimerD();
        if(timeRem<=0){
            clearInterval(timerInt);
            if(curSec<5){toast('Tiempo agotado.','warning');finishSection();}
            else{toast('Tiempo agotado. Entregando...','warning');setTimeout(submitExam,1000);}
        }
        const te=document.querySelector('.etimer');
        if(timeRem<=120)te.style.color='var(--dn)';
        else if(timeRem<=300)te.style.color='var(--wn)';
    },1000);
}
function updateTimerD(){const m=Math.floor(timeRem/60),s=timeRem%60;document.getElementById('eTim').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}

/* ==================================================================
   MAPA DE PREGUNTAS
   ================================================================== */
function buildMap(){const m=document.getElementById('qMap');m.innerHTML='';const s=SEC_START[curSec],e=SEC_END[curSec];
if(curSec===3||curSec===4||curSec===5){
    const items_cnt = curSec===3? S3.length: curSec===4? S4.length : S5.length;
    for(let i=0; i<items_cnt; i++){
        const d=document.createElement('div');d.className='qmd';d.textContent=String.fromCharCode(65+i);d.style.width='60px';d.setAttribute('data-idx',s+i);d.onclick=()=>showQ(s+i);m.appendChild(d);
    }
    return;
}
for(let i=s;i<e;i++){const d=document.createElement('div');d.className='qmd';d.textContent=i+1;d.setAttribute('data-idx',i);d.onclick=()=>showQ(i);m.appendChild(d);}}
function updateMap(){document.querySelectorAll('.qmd').forEach(d=>{const i=parseInt(d.getAttribute('data-idx'));d.className='qmd';if(i===curQ)d.classList.add('cur');else if(isComplete(i))d.classList.add('don');else if(isPartial(i))d.classList.add('par');});}
function isComplete(i){const a=answers[i];if(!a)return false;if(a.type==='vf')return a.sel!==null&&a.just.trim().length>10;if(a.type==='mc')return a.sel!==null;if(a.type==='ord')return a.checked;if(a.type==='fill')return a.responses.every(r=>r.trim().length>0);if(a.type==='match')return a.selections.every(s=>s!=='');return false;}
function isPartial(i){const a=answers[i];if(!a)return false;if(a.type==='vf')return a.sel!==null||a.just.trim().length>0;if(a.type==='match')return a.selections.some(s=>s!=='');return false;}
function updateProg(){const s=SEC_START[curSec],e=SEC_END[curSec];let c=0;for(let i=s;i<e;i++)if(isComplete(i))c++;document.getElementById('eProg').style.width=(c/(e-s)*100)+'%';}

/* ==================================================================
   CONSTRUIR PREGUNTAS
   ================================================================== */
function buildQs(){const c=document.getElementById('qCont');c.innerHTML='';
    const isDocente = CU && CU.isDocente;
    // S1: V/F
    S1.forEach((q,i)=>{const card=document.createElement('div');card.className='qcard';card.id='q-'+i;card.style.display='none';
        let hintHtml = '';
        if (isDocente) {
            hintHtml = `<div class="docente-hint" style="margin-top:16px; padding:12px; background:rgba(16,185,129,0.1); border-left:4px solid var(--ac); border-radius:8px; font-size:13px; color:var(--fg); line-height:1.4;">
                <strong style="color:var(--ac);"><i class="fas fa-user-shield"></i> Docente - Respuesta Correcta:</strong> <strong>${q.answer ? 'Verdadero' : 'Falso'}</strong>.<br>
                <span style="font-size:12px; color:var(--fg2);"><strong>Explicación:</strong> ${q.expl}</span><br>
                <a href="#" onclick="autoSolveS1(${i}); return false;" style="color:var(--ac); text-decoration:underline; font-weight:bold; display:inline-block; margin-top:6px;"><i class="fas fa-magic"></i> Resolver y Justificar</a>
            </div>`;
        }
        const a = answers[i];
        const isVfSel = a && a.sel !== null;
        const vClass = (isVfSel && a.sel === true) ? 'st' : '';
        const fClass = (isVfSel && a.sel === false) ? 'vfsf' : '';
        const jVis = isVfSel ? 'vis' : '';
        const jVal = (a && a.just) ? escapeHtml(a.just) : '';
        card.innerHTML=`<div class="qnum">${i+1}</div><div class="qtxt">${q.text}</div><div class="vfops"><div class="vfop ${vClass}" data-q="${i}" data-v="true" onclick="selVF(${i},true)"><i class="fas fa-check"></i> Verdadero</div><div class="vfop ${fClass}" data-q="${i}" data-v="false" onclick="selVF(${i},false)"><i class="fas fa-times"></i> Falso</div></div><div class="jarea ${jVis}" id="ja-${i}"><div class="jlbl"><i class="fas fa-pen-nib"></i> Justifica tu respuesta</div><textarea class="jtxt" id="jt-${i}" placeholder="Explica por qué..." oninput="updJust(${i})">${jVal}</textarea></div><div class="qst" id="qs-${i}"><i class="fas fa-info-circle"></i><span></span></div>${hintHtml}`;
        c.appendChild(card);
    });
    // S2: MC
    S2.forEach((q,i)=>{const gi=i+10;const card=document.createElement('div');card.className='qcard';card.id='q-'+gi;card.style.display='none';let oh='<div class="mcopts">';const lt=['A','B','C','D'];const a = answers[gi];
        q.opts.forEach((o,oi)=>{
            const isSel = (a && a.sel === oi) ? 'sel' : '';
            oh+=`<div class="mcop ${isSel}" data-q="${gi}" data-o="${oi}" onclick="selMC(${gi},${oi})"><span class="mclt">${lt[oi]}</span><span class="mctx">${o}</span></div>`;
        });
        oh+='</div>';
        let hintHtml = '';
        if (isDocente) {
            hintHtml = `<div class="docente-hint" style="margin-top:16px; padding:12px; background:rgba(16,185,129,0.1); border-left:4px solid var(--ac); border-radius:8px; font-size:13px; color:var(--fg); line-height:1.4;">
                <strong style="color:var(--ac);"><i class="fas fa-user-shield"></i> Docente - Respuesta Correcta:</strong> <strong>${lt[q.c]}. ${q.opts[q.c]}</strong>.<br>
                <span style="font-size:12px; color:var(--fg2);"><strong>Explicación:</strong> ${q.expl}</span><br>
                <a href="#" onclick="autoSolveS2(${i}); return false;" style="color:var(--ac); text-decoration:underline; font-weight:bold; display:inline-block; margin-top:6px;"><i class="fas fa-magic"></i> Seleccionar Correcta</a>
            </div>`;
        }
        card.innerHTML=`<div class="qnum">${gi+1}</div><div class="qtxt">${q.text}</div>${oh}${hintHtml}`;c.appendChild(card);});
    // S3: Ordenamiento
    const s3i=SEC_START[3];S3.forEach((item,ii)=>{const card=document.createElement('div');card.className='qcard';card.id='q-'+(s3i+ii);card.style.display='none';let sh=`<div class="qnum">${String.fromCharCode(65+ii)}</div><div class="ord-item-label"><i class="fas fa-sort-amount-down"></i> ${item.title}</div><div class="ord-pool" id="ordpool-${ii}">`;const order=answers[s3i+ii].order;order.forEach((si,pi)=>{sh+=`<div class="ord-sentence" draggable="true" data-ii="${ii}" data-pi="${pi}" id="ords-${ii}-${pi}"><span class="ord-nums">${pi+1}</span><span>${item.sentences[si]}</span><div class="ord-arrows"><button onclick="moveOrd(${ii},${pi},-1)" title="Subir"><i class="fas fa-chevron-up"></i></button><button onclick="moveOrd(${ii},${pi},1)" title="Bajar"><i class="fas fa-chevron-down"></i></button></div></div>`;});sh+=`</div><div class="ord-result" id="ordres-${ii}"></div><button class="ord-check" id="ordchk-${ii}" onclick="checkOrd(${ii})"><i class="fas fa-check"></i> Verificar orden</button>`;
        if (isDocente) {
            sh += `<div class="docente-hint" style="margin-top:16px; padding:12px; background:rgba(16,185,129,0.1); border-left:4px solid var(--ac); border-radius:8px; font-size:13px; color:var(--fg); line-height:1.4;">
                <strong style="color:var(--ac);"><i class="fas fa-user-shield"></i> Docente - Guía de Ordenamiento:</strong><br>
                <span style="font-size:12px; color:var(--fg2);">El orden correcto es la secuencia original en el código (1 al 10).</span><br>
                <a href="#" onclick="autoSolveS3(${ii}); return false;" style="color:var(--ac); text-decoration:underline; font-weight:bold; display:inline-block; margin-top:6px;"><i class="fas fa-magic"></i> Autocompletar Orden Correcto</a>
            </div>`;
        }
        card.innerHTML=sh;c.appendChild(card);});
    // S4: Completamiento
    const s4i=SEC_START[4];S4.forEach((item,ii)=>{const card=document.createElement('div');card.className='qcard';card.id='q-'+(s4i+ii);card.style.display='none';let sh=`<div class="qnum">${String.fromCharCode(65+ii)}</div><div class="ord-item-label"><i class="fas fa-pen"></i> ${item.title}</div>`;
        const a = answers[s4i+ii];
        item.questions.forEach((q,qi)=>{sh+=`<div style="margin-bottom:18px">`;let sent='';for(let p=0;p<q.parts.length;p++){if(p>0){
            const curVal = (a && a.responses && a.responses[qi]) ? escapeHtml(a.responses[qi]) : '';
            sent+=`<input class="fill-input" id="fi-${ii}-${qi}-${p}" type="text" value="${curVal}" autocomplete="off" oninput="updFill(${ii},${qi},${p})">`;
        }sent+=q.parts[p];}sh+=`<div class="fill-sentence">${sent}</div></div>`;});
        if (isDocente) {
            sh += `<div class="docente-hint" style="margin-top:16px; padding:12px; background:rgba(16,185,129,0.1); border-left:4px solid var(--ac); border-radius:8px; font-size:13px; color:var(--fg); line-height:1.4;">
                <strong style="color:var(--ac);"><i class="fas fa-user-shield"></i> Docente - Respuestas de Completamiento:</strong><br>
                <span style="font-size:12px; color:var(--fg2);">${item.questions.map((q, qi) => `<strong>P${qi+1}:</strong> "${q.answer}"`).join(', ')}</span><br>
                <a href="#" onclick="autoSolveS4(${ii}); return false;" style="color:var(--ac); text-decoration:underline; font-weight:bold; display:inline-block; margin-top:6px;"><i class="fas fa-magic"></i> Autocompletar Respuestas</a>
            </div>`;
        }
        card.innerHTML=sh;c.appendChild(card);});
    // S5: Unir Columnas
    const s5i=SEC_START[5];S5.forEach((item,ii)=>{const card=document.createElement('div');card.className='qcard';card.id='q-'+(s5i+ii);card.style.display='none';
    let sh=`<div class="qnum">${String.fromCharCode(65+ii)}</div><div class="ord-item-label"><i class="fas fa-exchange-alt"></i> ${item.title}</div><div class="match-grp">`;
    const a = answers[s5i+ii];
    item.leftItems.forEach((li,pi)=>{
        const curSel = (a && a.selections && a.selections[pi]) ? a.selections[pi] : '';
        sh+=`<div class="match-row"><div class="match-left">${li.id}. ${li.text}</div><div><select class="match-select" id="ms-${ii}-${pi}" onchange="updMatch(${ii},${pi})"><option value="">Selecciona correspondencia...</option>`;
        const letters = ['A','B','C','D','E','F','G','H','I','J'];
        letters.forEach(l=>{
            const isSel = (curSel === l) ? 'selected' : '';
            sh+=`<option value="${l}" ${isSel}>${l}</option>`;
        });
        sh+=`</select></div></div>`;
    });
    sh+=`</div><div class="match-col-right"><div class="match-col-right-title">Opciones de correspondencia</div>`;
    s5Shuffled[ii].forEach(ch=>{sh+=`<div class="match-option-desc"><strong>[${ch.letter}]</strong> ${ch.text}</div>`;});
    sh+=`</div>`;
        if (isDocente) {
            sh += `<div class="docente-hint" style="margin-top:16px; width:100%; clear:both; padding:12px; background:rgba(16,185,129,0.1); border-left:4px solid var(--ac); border-radius:8px; font-size:13px; color:var(--fg); line-height:1.4;">
                <strong style="color:var(--ac);"><i class="fas fa-user-shield"></i> Docente - Correspondencias de Emparejamiento:</strong><br>
                <span style="font-size:12px; color:var(--fg2);">${item.leftItems.map((li, pi) => {
                    const expectedLetter = String.fromCharCode(65 + pi);
                    const matched = s5Shuffled[ii].find(ch => ch.originalVal === expectedLetter);
                    return `<strong>${li.id}</strong> ➔ <strong>${matched ? matched.letter : '?'}</strong>`;
                }).join(' | ')}</span><br>
                <a href="#" onclick="autoSolveS5(${ii}); return false;" style="color:var(--ac); text-decoration:underline; font-weight:bold; display:inline-block; margin-top:6px;"><i class="fas fa-magic"></i> Autocompletar Correspondencias</a>
            </div>`;
        }
    card.innerHTML=sh;c.appendChild(card);});
    setTimeout(()=>rK(c), 50);
}

/* ==================================================================
   FUNCIONES DE AUTOCOMPLETADO (DOCENTE)
   ================================================================== */
function autoSolveS1(i) {
    const q = S1[i];
    selVF(i, q.answer);
    const txt = document.getElementById(`jt-${i}`);
    if (txt) {
        txt.value = q.expl;
        updJust(i);
    }
    toast(`Pregunta ${i+1} resuelta y justificada.`, 'success');
}
function autoSolveS2(i) {
    const q = S2[i];
    const gi = i + 10;
    selMC(gi, q.c);
    toast(`Pregunta ${gi+1} resuelta.`, 'success');
}
function autoSolveS3(ii) {
    const s3i = SEC_START[3];
    answers[s3i+ii].order = [0,1,2,3,4,5,6,7,8,9];
    renderOrd(ii);
    toast('Orden original restaurado para auditoría.', 'success');
}
function autoSolveS4(ii) {
    const item = S4[ii];
    item.questions.forEach((q, qi) => {
        const inp = document.getElementById(`fi-${ii}-${qi}-1`);
        if (inp) {
            inp.value = q.answer;
            updFill(ii, qi, 1);
        }
    });
    toast('Campos de completamiento autocompletados.', 'success');
}
function autoSolveS5(ii) {
    const item = S5[ii];
    item.leftItems.forEach((li, pi) => {
        const expectedLetter = String.fromCharCode(65 + pi);
        const matched = s5Shuffled[ii].find(ch => ch.originalVal === expectedLetter);
        if (matched) {
            const sel = document.getElementById(`ms-${ii}-${pi}`);
            if (sel) {
                sel.value = matched.letter;
                updMatch(ii, pi);
            }
        }
    });
    toast('Correspondencias autocompletadas.', 'success');
}

/* ==================================================================
   INTERACCIONES
   ================================================================== */
function selVF(qi,v){answers[qi].sel=v;document.querySelectorAll(`.vfop[data-q="${qi}"]`).forEach(o=>{o.classList.remove('st','vfsf');if(o.getAttribute('data-v')===String(v))o.classList.add(v?'st':'vfsf');});document.getElementById('ja-'+qi).classList.add('vis');setTimeout(()=>document.getElementById('jt-'+qi).focus(),100);updVFSt(qi);updateProg();updateMap();}
function updJust(qi){answers[qi].just=document.getElementById('jt-'+qi).value;updVFSt(qi);updateProg();updateMap();}
function updVFSt(qi){const el=document.getElementById('qs-'+qi),sp=el.querySelector('span');el.classList.remove('vis','cok','cinc');const hs=answers[qi].sel!==null,hj=answers[qi].just.trim().length>10;if(hs&&hj){sp.textContent='Respuesta completa';el.classList.add('vis','cok');}else if(hs||answers[qi].just.trim().length>0){sp.textContent='Falta '+(hs?'justificar (mín. 10 caracteres)':'seleccionar V/F');el.classList.add('vis','cinc');}}
function selMC(qi,oi){answers[qi].sel=oi;document.querySelectorAll(`.mcop[data-q="${qi}"]`).forEach(o=>{o.classList.remove('sel');if(parseInt(o.getAttribute('data-o'))===oi)o.classList.add('sel');});updateProg();updateMap();}

/* Ordenamiento */
function moveOrd(ii,pi,dir){const a=answers[SEC_START[3]+ii];const ni=pi+dir;if(ni<0||ni>=a.order.length)return;[a.order[pi],a.order[ni]]=[a.order[ni],a.order[pi]];renderOrd(ii);}
function renderOrd(ii){const pool=document.getElementById('ordpool-'+ii);const a=answers[SEC_START[3]+ii];const item=S3[ii];pool.innerHTML='';a.order.forEach((si,pi)=>{pool.innerHTML+=`<div class="ord-sentence" draggable="true" data-ii="${ii}" data-pi="${pi}" id="ords-${ii}-${pi}"><span class="ord-nums">${pi+1}</span><span>${item.sentences[si]}</span><div class="ord-arrows"><button onclick="moveOrd(${ii},${pi},-1)"><i class="fas fa-chevron-up"></i></button><button onclick="moveOrd(${ii},${pi},1)"><i class="fas fa-chevron-down"></i></button></div></div>`;});initDrag(ii);rK(pool);}
function initDrag(ii){document.querySelectorAll(`.ord-sentence[data-ii="${ii}"]`).forEach(el=>{el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',el.getAttribute('data-pi'));el.classList.add('dragging');});el.addEventListener('dragend',()=>el.classList.remove('dragging'));el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drag-over');});el.addEventListener('dragleave',()=>el.classList.remove('drag-over'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drag-over');const fi=parseInt(e.dataTransfer.getData('text/plain'));const ti=parseInt(el.getAttribute('data-pi'));if(fi!==ti){const a=answers[SEC_START[3]+ii];const v=a.order[fi];a.order.splice(fi,1);a.order.splice(ti,0,v);renderOrd(ii);}});});}
function checkOrd(ii){const a=answers[SEC_START[3]+ii];const item=S3[ii];let correct=0;const pool=document.getElementById('ordpool-'+ii);pool.querySelectorAll('.ord-sentence').forEach((el,pi)=>{el.classList.remove('correct-pos','incorrect-pos');if(a.order[pi]===pi){el.classList.add('correct-pos');correct++;}else{el.classList.add('incorrect-pos');}});a.checked=true;a.score=correct*0.25;const res=document.getElementById('ordres-'+ii);res.className='ord-result vis '+(correct===10?'ok':'bad');res.innerHTML=`<i class="fas fa-${correct===10?'check-circle':'times-circle'}"></i> ${correct}/10 posiciones correctas — ${correct*0.25} puntos`;document.getElementById('ordchk-'+ii).disabled=true;updateProg();updateMap();}

/* Completamiento */
function updFill(ii,qi,pi){const inp=document.getElementById(`fi-${ii}-${qi}-${pi}`);answers[SEC_START[4]+ii].responses[qi]=inp.value;updateProg();updateMap();}

/* Unir Columnas */
function updMatch(ii,pi){const sel=document.getElementById(`ms-${ii}-${pi}`).value;answers[SEC_START[5]+ii].selections[pi]=sel;updateProg();updateMap();}

/* ==================================================================
   MOSTRAR PREGUNTA
   ================================================================== */
function showQ(idx){document.querySelectorAll('.qcard').forEach(c=>c.style.display='none');curQ=idx;const el=document.getElementById('q-'+idx);if(el){el.style.display='block';rK(el);}
const s=SEC_START[curSec],e=SEC_END[curSec];document.getElementById('bPrev').disabled=idx===s;const bn=document.getElementById('bNext');
if(curSec===3||curSec===4||curSec===5){
    const maxI=curSec===3?S3.length-1: curSec===4?S4.length-1 : S5.length-1;
    const ci=idx-s;
    if(ci>=maxI){
        if(curSec < 5){
            bn.className='nbtn cont';
            bn.innerHTML='<i class="fas fa-arrow-right"></i> Terminar sección';
            bn.onclick=finishSection;
        } else {
            bn.className='nbtn fin';
            bn.innerHTML='<i class="fas fa-flag-checkered"></i> Entregar evaluación';
            bn.onclick=trySubmit;
        }
    } else {
        bn.className='nbtn nxt';
        bn.innerHTML='Siguiente <i class="fas fa-arrow-right"></i>';
        bn.onclick=()=>navQ(1);
    }
}else{if(idx>=e-1){bn.className=curSec<5?'nbtn cont':'nbtn fin';bn.innerHTML=curSec<5?'<i class="fas fa-arrow-right"></i> Terminar sección':'<i class="fas fa-flag-checkered"></i> Entregar evaluación';bn.onclick=curSec<5?finishSection:trySubmit;}else{bn.className='nbtn nxt';bn.innerHTML='Siguiente <i class="fas fa-arrow-right"></i>';bn.onclick=()=>navQ(1);}}
updateMap();if(answers[idx]&&answers[idx].type==='vf')updVFSt(idx);if(curSec===3){const ii=idx-s;setTimeout(()=>initDrag(ii),50);}}
function navQ(d){const s=SEC_START[curSec],e=SEC_END[curSec];const ni=curQ+d;if(ni>=s&&ni<e)showQ(ni);}

/* ==================================================================
   CÁLCULOS DE PUNTUACIÓN
   ================================================================== */
function calcSecScore(sec){let correct=0,incorrect=0,empty=0,score=0,details=[];
if(sec===1){S1.forEach((q,i)=>{const a=answers[i];const ic=a.sel===q.answer;const hj=a.just.trim().length>10;let qs=0,st='empty';if(a.sel===null){empty++;st='empty';}else if(ic&&hj){correct++;qs=0.5;score+=0.5;st='correct';}else if(ic&&!hj){correct++;qs=0.25;score+=0.25;st='partial';}else{incorrect++;st='incorrect';}details.push({q,a,ic,hj,qs,st,type:'vf'});});}
else if(sec===2){S2.forEach((q,i)=>{const gi=i+10;const a=answers[gi];const ic=a.sel===q.c;let qs=0,st='empty';if(a.sel===null){empty++;st='empty';}else if(ic){correct++;qs=0.5;score+=0.5;st='correct';}else{incorrect++;st='incorrect';}details.push({q,a,ic,qs,st,type:'mc'});});}
else if(sec===3){S3.forEach((item,ii)=>{const ai=SEC_START[3]+ii;const a=answers[ai];let cor=0;const posDetails=[];a.order.forEach((si,pi)=>{const ok=si===pi;if(ok)cor++;posDetails.push({userPos:pi,correctPos:si,isCorrect:ok});});correct=cor;incorrect=10-cor;score+=a.score;details.push({item,a,correct:cor,score:a.score,posDetails,type:'ord'});});}
else if(sec===4){S4.forEach((item,ii)=>{const ai=SEC_START[4]+ii;const a=answers[ai];let cor=0;const qDetails=[];item.questions.forEach((q,qi)=>{const userAns=a.responses[qi]||'';const nu=norm(userAns);let isOk=false;const allAns=[q.answer,...q.alts];for(const ca of allAns){if(nu===norm(ca)){isOk=true;break;}}if(isOk)cor++;qDetails.push({q,userAns,isOk,correctAns:q.answer});});correct=cor;incorrect=10-cor;score+=cor*0.5;details.push({item,qDetails,correct:cor,score:cor*0.5,type:'fill'});});}
else if(sec===5){S5.forEach((item,ii)=>{const ai=SEC_START[5]+ii;const a=answers[ai];let cor=0;const matchDetails=[];
    a.selections.forEach((sel,pi)=>{
        const expectedLetter = String.fromCharCode(65 + pi); // A=65, B=66, etc.
        const selectedChoice = s5Shuffled[ii].find(ch=>ch.letter===sel);
        const ok = selectedChoice && selectedChoice.originalVal === expectedLetter;
        if(ok) cor++;
        matchDetails.push({
            leftItem: item.leftItems[pi],
            userSel: sel,
            isCorrect: ok,
            correctLetter: s5Shuffled[ii].find(ch=>ch.originalVal===expectedLetter)?.letter || ''
        });
    });
    correct=cor;incorrect=10-cor;score+=cor*0.5;
    details.push({item,matchDetails,correct:cor,score:cor*0.5,type:'match'});
});}
return{score,correct,incorrect,empty,details,count:SEC_END[sec]-SEC_START[sec]};}

/* ==================================================================
   ENTREGAR Y RESULTADOS
   ================================================================== */
function trySubmit(){let ua=0;
if(curSec===5){S5.forEach((item,ii)=>{const a=answers[SEC_START[5]+ii];a.selections.forEach(sel=>{if(!sel)ua++;});});}
else if(curSec===4){S4.forEach((item,ii)=>{const a=answers[SEC_START[4]+ii];item.questions.forEach((_,qi)=>{if(!(a.responses[qi]||'').trim())ua++;});});}
else{for(let i=SEC_START[curSec];i<SEC_END[curSec];i++){if(answers[i].type==='mc'&&answers[i].sel===null)ua++;if(answers[i].type==='vf'&&answers[i].sel===null)ua++;}}
if(ua>0)showModal(`Tienes ${ua} campo(s) sin completar. ¿Deseas entregar de todas formas?`,submitExam);else submitExam();}

function submitExam(){
    examActive = false;
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(()=>{});
    }
    closeModal();clearInterval(timerInt);
if(!secScores.s1)secScores.s1=calcSecScore(1);
if(!secScores.s2)secScores.s2=calcSecScore(2);
if(!secScores.s3)secScores.s3=calcSecScore(3);
if(!secScores.s4)secScores.s4=calcSecScore(4);
if(!secScores.s5)secScores.s5=calcSecScore(5);
const total=secScores.s1.score+secScores.s2.score+secScores.s3.score+secScores.s4.score+secScores.s5.score;saveRes(total);showRes(total);showScr('sRes');
sendBackupData({user:CU,date:new Date().toISOString(),s1:secScores.s1.score,s2:secScores.s2.score,s3:secScores.s3.score,s4:secScores.s4.score,s5:secScores.s5.score,total,max:40,cheatWarnings:cheatWarnings,details:secScores});
setTimeout(()=>{if(CU&&CU.email&&!CU.isDocente){sendEmail();}},1200);}

function saveRes(total){const h=JSON.parse(localStorage.getItem('evalH_v6')||'[]');h.push({user:CU,date:new Date().toISOString(),s1:secScores.s1.score,s2:secScores.s2.score,s3:secScores.s3.score,s4:secScores.s4.score,s5:secScores.s5.score,total,max:40,cheatWarnings:cheatWarnings,details:secScores});localStorage.setItem('evalH_v6',JSON.stringify(h));toast('Resultados guardados localmente.','success');}

function clearAllLocalRecords(){
    if(confirm("¿Deseas borrar TODOS los registros locales de evaluaciones de estudiantes? Esto permitirá que todos puedan rendir la evaluación nuevamente.")){
        localStorage.removeItem('evalH_v6');
        localStorage.removeItem('evalH_v5');
        localStorage.removeItem('evalH_v4');
        toast("Registros locales purgados. Los estudiantes pueden rendir nuevamente.","success");
    }
}

function showRes(total){
const ring=document.getElementById('rRing');ring.classList.remove('low','mid');const pct=total/40;if(pct<.4)ring.classList.add('low');else if(pct<.7)ring.classList.add('mid');const circ=2*Math.PI*70;setTimeout(()=>{ring.style.strokeDashoffset=circ-pct*circ;},100);
const sn=document.getElementById('rNum');let cur=0;const st=total/40;const iv=setInterval(()=>{cur+=st/50;if(cur>=st){cur=st;clearInterval(iv);}sn.textContent=cur%1===0?cur:cur.toFixed(1);},25);
document.getElementById('rLbl').textContent='de 40 puntos';

const btnRetry = document.getElementById('btnRetry');
if (btnRetry) {
    if (CU && CU.isDocente) {
        btnRetry.style.display = 'flex';
    } else {
        btnRetry.style.display = 'none';
    }
}
const tt=document.getElementById('rTit'),ts=document.getElementById('rSub');
if(pct>=.9){tt.textContent='Excelente desempeño';ts.textContent='Dominas los temas de las 5 secciones evaluadas.';}else if(pct>=.7){tt.textContent='Buen resultado';ts.textContent='Buena comprensión general con áreas de mejora.';}else if(pct>=.5){tt.textContent='Resultado aceptable';ts.textContent='Necesitas reforzar varios conceptos. Revisa el material.';}else{tt.textContent='Necesitas estudiar más';ts.textContent='Se recomienda revisar a fondo todos los temas.';}

const sc=document.getElementById('rStats');
sc.innerHTML=`<div class="strow"><div class="stbx ssc"><div class="stv">${total}</div><div class="stl">Puntaje total</div></div><div class="stbx sok"><div class="stv">${secScores.s1.correct+secScores.s2.correct+secScores.s3.correct+secScores.s4.correct+secScores.s5.correct}</div><div class="stl">Correctas / correspondencias ok</div></div></div>
<div class="sdiv">Sección 1 — V/F</div><div class="strow"><div class="stbx ssc"><div class="stv">${secScores.s1.score}/5</div><div class="stl">Puntaje</div></div><div class="stbx sok"><div class="stv">${secScores.s1.correct}</div><div class="stl">Correctas</div></div><div class="stbx sbad"><div class="stv">${secScores.s1.incorrect}</div><div class="stl">Incorrectas</div></div><div class="stbx semp"><div class="stv">${secScores.s1.empty}</div><div class="stl">Sin responder</div></div></div>
<div class="sdiv">Sección 2 — Selección única</div><div class="strow"><div class="stbx ssc"><div class="stv">${secScores.s2.score}/10</div><div class="stl">Puntaje</div></div><div class="stbx sok"><div class="stv">${secScores.s2.correct}</div><div class="stl">Correctas</div></div><div class="stbx sbad"><div class="stv">${secScores.s2.incorrect}</div><div class="stl">Incorrectas</div></div><div class="stbx semp"><div class="stv">${secScores.s2.empty}</div><div class="stl">Sin responder</div></div></div>
<div class="sdiv">Sección 3 — Ordenamiento</div><div class="strow"><div class="stbx ssc"><div class="stv">${secScores.s3.score}/5</div><div class="stl">Puntaje</div></div><div class="stbx sok"><div class="stv">${secScores.s3.correct}/20</div><div class="stl">Posiciones correctas</div></div><div class="stbx sbad"><div class="stv">${secScores.s3.incorrect}/20</div><div class="stl">Posiciones incorrectas</div></div></div>
<div class="sdiv">Sección 4 — Completamiento</div><div class="strow"><div class="stbx ssc"><div class="stv">${secScores.s4.score}/10</div><div class="stl">Puntaje</div></div><div class="stbx sok"><div class="stv">${secScores.s4.correct}/20</div><div class="stl">Correctas</div></div><div class="stbx sbad"><div class="stv">${secScores.s4.incorrect}/20</div><div class="stl">Incorrectas</div></div></div>
<div class="sdiv">Sección 5 — Unir Columnas</div><div class="strow"><div class="stbx ssc"><div class="stv">${secScores.s5.score}/10</div><div class="stl">Puntaje</div></div><div class="stbx sok"><div class="stv">${secScores.s5.correct}/20</div><div class="stl">Correspondencias OK</div></div><div class="stbx sbad"><div class="stv">${secScores.s5.incorrect}/20</div><div class="stl">Incorrectas</div></div></div>`;

// Revisión detallada
const rc=document.getElementById('rRev');rc.innerHTML='';
// S1
secScores.s1.details.forEach((d,i)=>{const el=document.createElement('div');let bc='remp',bg='<span class="ribadge bemp">Sin responder</span>';if(d.st==='correct'){bc='rok';bg='<span class="ribadge bok">Correcta (0.5 pt)</span>';}else if(d.st==='partial'){bc='rok';bg='<span class="ribadge bpar">Parcial (0.25 pt)</span>';}else if(d.st==='incorrect'){bc='rbad';bg='<span class="ribadge bbad">Incorrecta (0.0 pt)</span>';}
const at=d.a.sel===null?'No respondida':(d.a.sel?'Verdadero':'Falso');const ct=d.q.answer?'Verdadero':'Falso';let al=`<span class="ubad">${at}</span>`;if(d.st==='incorrect')al+=` — Correcta: <span class="cok">${ct}</span>`;
el.className=`ritem ${bc}`;el.innerHTML=`<div class="rihead"><span class="rinum">P${i+1} [V/F]</span>${bg}</div><div class="ritxt">${d.q.text}</div><div class="rians"><strong>Tu respuesta:</strong> ${al}</div><div class="rijust"><strong>Tu justificación:</strong><br>${d.a.just.trim()||'<em style="color:var(--fg3)">Sin justificación</em>'}</div>${d.st==='incorrect'?`<div class="riexpl"><strong>Explicación:</strong><br>${d.q.expl}</div>`:''}`;rc.appendChild(el);});
// S2
secScores.s2.details.forEach((d,i)=>{const el=document.createElement('div');const gi=i+10;let bc='remp',bg='<span class="ribadge bemp">Sin responder</span>';if(d.st==='correct'){bc='rok';bg='<span class="ribadge bok">Correcta (0.5 pt)</span>';}else if(d.st==='incorrect'){bc='rbad';bg='<span class="ribadge bbad">Incorrecta (0.0 pt)</span>';}
const lt=['A','B','C','D'];const at=d.a.sel===null?'No respondida':`${lt[d.a.sel]}. ${d.q.opts[d.a.sel]}`;const ct=`${lt[d.q.c]}. ${d.q.opts[d.q.c]}`;let al=`<span class="ubad">${at}</span>`;if(d.st==='incorrect')al+=`<br>Correcta: <span class="cok">${ct}</span>`;
el.className=`ritem ${bc}`;el.innerHTML=`<div class="rihead"><span class="rinum">P${gi+1} [MC]</span>${bg}</div><div class="ritxt">${d.q.text}</div><div class="rians"><strong>Tu respuesta:</strong> ${al}</div>${d.st==='incorrect'?`<div class="riexpl"><strong>Explicación:</strong><br>${d.q.expl}</div>`:''}`;rc.appendChild(el);});
// S3
secScores.s3.details.forEach((d,ii)=>{const el=document.createElement('div');el.className='ritem';el.style.borderLeftColor=d.score>=2.0?'var(--ok)':d.score>=1.0?'var(--wn)':'var(--fl)';let h=`<div class="rihead"><span class="rinum">Ítem ${String.fromCharCode(65+ii)} [Ord.]</span><span class="ribadge ${d.score>=2.0?'bok':d.score>=1.0?'bpar':'bbad'}">${d.correct}/10 posiciones — ${d.score} pt</span></div><div class="ritxt">${d.item.title}</div>`;d.posDetails.forEach((pd,pi)=>{const col=pd.isCorrect?'var(--ok)':'var(--fl)';h+=`<div style="font-size:13px;color:var(--fg2);margin:4px 0 4px 12px"><span style="color:${col};font-weight:700">Pos ${pi+1}:</span> ${pd.isCorrect?'<i class="fas fa-check" style="color:var(--ok)"></i>':'<i class="fas fa-times" style="color:var(--fl)"></i> Colocaste: "'+d.item.sentences[d.a.order[pi]].substring(0,60)+'..."'} ${!pd.isCorrect?'— Correcta en pos '+(pd.correctPos+1):''}</div>`;});el.innerHTML=h;rc.appendChild(el);});
// S4
secScores.s4.details.forEach((d,ii)=>{const el=document.createElement('div');el.className='ritem';el.style.borderLeftColor=d.score>=4.0?'var(--ok)':d.score>=2.0?'var(--wn)':'var(--fl)';let h=`<div class="rihead"><span class="rinum">Ítem ${String.fromCharCode(65+ii)} [Compl.]</span><span class="ribadge ${d.score>=4.0?'bok':d.score>=2.0?'bpar':'bbad'}">${d.correct}/10 — ${d.score} pt</span></div><div class="ritxt">${d.item.title}</div>`;d.qDetails.forEach((qd,qi)=>{const col=qd.isOk?'var(--ok)':'var(--fl)';const ico=qd.isOk?'fa-check':'fa-times';h+=`<div style="font-size:13px;color:var(--fg2);margin:6px 0 6px 12px;padding:8px 10px;background:var(--card);border-radius:6px;border-left:3px solid ${col}"><i class="fas ${ico}" style="color:${col};margin-right:6px"></i><strong>P${qi+1}:</strong> Tu respuesta: "<span style="color:${qd.isOk?'var(--ok)':'var(--fl)'};font-weight:600">${qd.userAns||'(vacío)'}</span>" ${!qd.isOk?'— Correcta: <span style="color:var(--ok);font-weight:600">'+qd.correctAns+'</span>':''}<br><span style="font-size:12px;color:var(--fg3)">${qd.q.expl}</span></div>`;});el.innerHTML=h;rc.appendChild(el);});
// S5
secScores.s5.details.forEach((d,ii)=>{const el=document.createElement('div');el.className='ritem';el.style.borderLeftColor=d.score>=4?'var(--ok)':d.score>=2.5?'var(--wn)':'var(--fl)';
let h=`<div class="rihead"><span class="rinum">Ítem ${String.fromCharCode(65+ii)} [Unir]</span><span class="ribadge ${d.score>=4?'bok':d.score>=2.5?'bpar':'bbad'}">${d.correct}/10 — ${d.score} pt</span></div><div class="ritxt">${d.item.title}</div>`;
d.matchDetails.forEach((md,pi)=>{
    const col=md.isCorrect?'var(--ok)':'var(--fl)';
    const ico=md.isCorrect?'fa-check':'fa-times';
    h+=`<div style="font-size:13px;color:var(--fg2);margin:6px 0 6px 12px;padding:8px 10px;background:var(--card);border-radius:6px;border-left:3px solid ${col}">
    <i class="fas ${ico}" style="color:${col};margin-right:6px"></i>
    <strong>${pi+1}. ${md.leftItem.text}:</strong> 
    Tu opción: "<span style="color:${md.isCorrect?'var(--ok)':'var(--fl)'};font-weight:600">${md.userSel||'(sin seleccionar)'}</span>" 
    ${!md.isCorrect?' — Correcta: <span style="color:var(--ok);font-weight:600">'+md.correctLetter+'</span>':''}
    </div>`;
});
el.innerHTML=h;rc.appendChild(el);});

setTimeout(()=>rK(document.getElementById('rRev')),100);
}

function sendEmail(){const t=secScores.s1.score+secScores.s2.score+secScores.s3.score+secScores.s4.score+secScores.s5.score;let b=`EVALUACION DEL SEGUNDO PARCIAL — GESTION DE PROYECTOS\n${'='.repeat(55)}\n\nEstudiante: ${CU.name}\nCorreo: ${CU.email}\nFecha: ${new Date().toLocaleString('es-ES')}\n\n${'─'.repeat(55)}\nRESULTADO: ${t}/40 puntos\nS1 (V/F): ${secScores.s1.score}/5 | S2 (MC): ${secScores.s2.score}/10\nS3 (Ord): ${secScores.s3.score}/5 | S4 (Compl): ${secScores.s4.score}/10\nS5 (Unir): ${secScores.s5.score}/10\n${'─'.repeat(55)}\n\n`;
b+=`=== SECCION 1: V/F ===\n\n`;secScores.s1.details.forEach((d,i)=>{const a=d.a.sel===null?'—':(d.a.sel?'V':'F');const c=d.q.answer?'V':'F';b+=`P${i+1}. ${a} ${d.ic?'[OK]':'[X]'} (Correcta: ${c}) — ${d.qs} pt\nJust: ${d.a.just.trim().substring(0,80)||'Sin just.'}\n${!d.ic?'Expl: '+d.q.expl.substring(0,100)+'\n':''}\n`;});
b+=`\n=== SECCION 2: SELECCION ===\n\n`;const lt=['A','B','C','D'];secScores.s2.details.forEach((d,i)=>{const a=d.a.sel===null?'—':lt[d.a.sel];const c=lt[d.q.c];b+=`P${i+11}. ${a} ${d.ic?'[OK]':'[X]'} (Correcta: ${c}) — ${d.qs} pt\n${!d.ic?'Expl: '+d.q.expl.substring(0,100)+'\n':''}\n`;});
b+=`\n=== SECCION 3: ORDENAMIENTO ===\n\n`;secScores.s3.details.forEach((d,ii)=>{b+=`Item ${String.fromCharCode(65+ii)}: ${d.correct}/10 posiciones — ${d.score} pt\n`;});
b+=`\n=== SECCION 4: COMPLETAMIENTO ===\n\n`;secScores.s4.details.forEach((d,ii)=>{b+=`Item ${String.fromCharCode(65+ii)}: ${d.correct}/10 — ${d.score} pt\n`;d.qDetails.forEach((qd,qi)=>{b+=`  P${qi+1}: "${qd.userAns||'(vacio)'}" ${qd.isOk?'[OK]':'[X] Correcta: '+qd.correctAns}\n`;});});
b+=`\n=== SECCION 5: UNIR COLUMNAS ===\n\n`;secScores.s5.details.forEach((d,ii)=>{b+=`Item ${String.fromCharCode(65+ii)}: ${d.correct}/10 correspondencias — ${d.score} pt\n`;d.matchDetails.forEach((md,qi)=>{b+=`  ${qi+1}. ${md.leftItem.text}: "${md.userSel||'(sin sel)'}" ${md.isCorrect?'[OK]':'[X] Correcta: '+md.correctLetter}\n`;});});
window.location.href=`mailto:${CU.email}?subject=${encodeURIComponent(`Resultado Evaluacion U3-U4-U5 - ${CU.name} - ${t}/40`)}&body=${encodeURIComponent(b)}`;toast('Abriendo cliente de correo...','success');}

/* ==================================================================
   FIRMA ELECTRÓNICA Y CÓDIGO QR DE VERIFICACIÓN
   ================================================================== */
let sigCanvas, sigCtx, isDrawingSig = false, sigHasDraw = false;

function initSigCanvas() {
    sigCanvas = document.getElementById('sigCanvas');
    if (!sigCanvas) return;
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.strokeStyle = '#002749';

    function getPos(e) {
        const rect = sigCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (sigCanvas.width / rect.width),
            y: (clientY - rect.top) * (sigCanvas.height / rect.height)
        };
    }

    function startDraw(e) {
        isDrawingSig = true;
        sigHasDraw = true;
        const p = getPos(e);
        sigCtx.beginPath();
        sigCtx.moveTo(p.x, p.y);
        e.preventDefault();
    }

    function moveDraw(e) {
        if (!isDrawingSig) return;
        const p = getPos(e);
        sigCtx.lineTo(p.x, p.y);
        sigCtx.stroke();
        e.preventDefault();
    }

    function endDraw() {
        isDrawingSig = false;
    }

    sigCanvas.onmousedown = startDraw;
    sigCanvas.onmousemove = moveDraw;
    sigCanvas.onmouseup = endDraw;
    sigCanvas.ontouchstart = startDraw;
    sigCanvas.ontouchmove = moveDraw;
    sigCanvas.ontouchend = endDraw;
}

function clearSignature() {
    if (!sigCtx) return;
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    sigHasDraw = false;
}

function openSignatureModal() {
    document.getElementById('modalSignature').style.display = 'flex';
    setTimeout(initSigCanvas, 100);
}

function closeSignatureModal() {
    document.getElementById('modalSignature').style.display = 'none';
}

function generateQRCodeDataUrl(text) {
    return new Promise((resolve) => {
        try {
            const container = document.getElementById('qrHiddenContainer');
            if (container && typeof QRCode !== 'undefined') {
                container.innerHTML = '';
                new QRCode(container, {
                    text: text,
                    width: 300,
                    height: 300,
                    correctLevel: QRCode.CorrectLevel.L
                });
                setTimeout(() => {
                    const img = container.querySelector('img');
                    const cvs = container.querySelector('canvas');
                    if (img && img.src && img.src.length > 50) resolve(img.src);
                    else if (cvs) resolve(cvs.toDataURL());
                    else resolve(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`);
                }, 150);
            } else {
                resolve(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`);
            }
        } catch (err) {
            console.error('Error al generar QR:', err);
            resolve(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`);
        }
    });
}

let pdfGenerated = false;

function enablePrintButton() {
    const btnPrint = document.getElementById('btnPrintPDF');
    if (btnPrint) {
        btnPrint.disabled = false;
        btnPrint.style.opacity = '1';
        btnPrint.style.cursor = 'pointer';
        btnPrint.style.filter = 'none';
        btnPrint.classList.remove('disabled');
        btnPrint.title = 'Imprimir informe oficial de la evaluación';
    }
}

function disablePrintButton() {
    const btnPrint = document.getElementById('btnPrintPDF');
    if (btnPrint) {
        btnPrint.disabled = true;
        btnPrint.style.opacity = '0.45';
        btnPrint.style.cursor = 'not-allowed';
        btnPrint.style.filter = 'grayscale(0.7)';
        btnPrint.classList.add('disabled');
        btnPrint.title = 'Primero debes presionar "Guardar como PDF" y firmar la evaluación.';
    }
}

function printPDF() {
    if (!pdfGenerated) {
        toast('Primero debes firmar y generar el PDF con tu firma electrónica.', 'warning');
        openSignatureModal();
        return;
    }
    doExportPDF();
}

function confirmSignatureAndExport() {
    if (CU) {
        CU.sigDataUrl = sigHasDraw ? sigCanvas.toDataURL('image/png') : '';
        CU.sigTimestamp = new Date();
    }
    closeSignatureModal();
    pdfGenerated = true;
    enablePrintButton();
    doExportPDF();
    setTimeout(() => {
        if (CU && CU.email && !CU.isDocente) {
            sendEmail();
        }
    }, 1500);
}

async function generateBlankPDF() {
    toast('Generando PDF en blanco...', 'info');
    
    // Abrimos ventana de carga
    const w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html><head><title>Cargando Documento UPSE...<\\/title><\\/head><body style="font-family:sans-serif; text-align:center; padding-top:80px; color:#002749;"><h2>Generando evaluación física UPSE...<\\/h2><p>Por favor espera un momento...<\\/p><\\/body><\\/html>');
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ format: 'a4', unit: 'mm' });
        
        // --- IMAGE FETCHING LOGIC ---
        const getBase64ImageFromURL = (url) => {
            return new Promise((resolve, reject) => {
                var img = new Image();
                img.setAttribute("crossOrigin", "anonymous");
                img.onload = () => {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    resolve({ dataURL: canvas.toDataURL("image/jpeg"), width: img.width, height: img.height });
                };
                img.onerror = error => reject(error);
                img.src = url;
            });
        };

        const c = localStorage.getItem("carrera") || "Ingeniería Industrial";
        let headerImgName = "ENCABEZADO INDUSTRIAL.jpg";
        if (c === "Ingeniería en Seguridad Industrial") headerImgName = "ENCABEZADO SEGURIDAD.jpg";

        const headerImg = await getBase64ImageFromURL(headerImgName).catch(() => null);
        const footerImg = await getBase64ImageFromURL("PIE DE PAGINA.jpg").catch(() => null);

        const headerH = headerImg ? (210 * headerImg.height / headerImg.width) : 25;
        const footerH = footerImg ? (210 * footerImg.height / footerImg.width) : 15;

        function drawDecorations() {
            if (headerImg) {
                doc.addImage(headerImg.dataURL, 'JPEG', 0, 0, 210, headerH);
            } else {
                doc.setFillColor(0, 39, 73);
                doc.rect(0, 0, 210, 25, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.text("UNIVERSIDAD ESTATAL PENÍNSULA DE SANTA ELENA", 105, 12, { align: 'center' });
                doc.setFontSize(10);
                doc.text("EVALUACIÓN DE GESTIÓN DE PROYECTOS - MODALIDAD FÍSICA", 105, 18, { align: 'center' });
                doc.setTextColor(0, 0, 0);
            }
            if (footerImg) {
                doc.addImage(footerImg.dataURL, 'JPEG', 0, 297 - footerH, 210, footerH);
            }
        }
        // -----------------------------
        
        drawDecorations();
        let y = headerH + 8;
        
        function cleanLaTeX(str) {
            if (typeof str !== 'string') return str;
            return str
                .replace(/\\\(\s*/g, '')
                .replace(/\s*\\\)/g, '')
                .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, 'SUM($1...$2)')
                .replace(/\\sum_\{([^}]+)\}/g, 'SUM($1)')
                .replace(/\\sum/g, 'SUM')
                .replace(/\\cdot/g, '·')
                .replace(/\\times/g, '×')
                .replace(/\\pi/g, 'π')
                .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                .replace(/_\{([^}]+)\}/g, '_$1')
                .replace(/\\text\{([^}]+)\}/g, '$1')
                .replace(/\\max/g, 'max')
                .replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
        }

        function drawText(text, x, currentY, size = 10, isBold = false, align = 'left', maxWidth = 180) {
            text = cleanLaTeX(text);
            const pageBottom = 297 - footerH - 10;
            if (currentY > pageBottom) { 
                doc.addPage(); 
                drawDecorations();
                currentY = headerH + 8; 
            }
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            doc.setFontSize(size);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, currentY, { align: align });
            return currentY + (lines.length * (size * 0.4)) + 2;
        }

        // Bloque de datos del estudiante
        doc.setDrawColor(0, 39, 73);
        doc.setLineWidth(0.5);
        doc.rect(15, y, 180, 25);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("DATOS DEL ESTUDIANTE", 20, y + 6);
        doc.setFont("helvetica", "normal");
        doc.text("Nombre Completo: _________________________________________________________", 20, y + 14);
        doc.text("Cédula: ________________________   Fecha: ________________________", 20, y + 21);
        y += 35;

        // SECCIÓN 1
        y = drawText("SECCIÓN 1: VERDADERO Y FALSO (5 pts)", 15, y, 12, true);
        y += 2;
        S1.forEach((q, i) => {
            y = drawText(`${i+1}. ${q.text}`, 15, y, 10, false, 'left', 175);
            y = drawText("[   ] VERDADERO        [   ] FALSO", 20, y, 10, true);
            y = drawText("Justificación: __________________________________________________________________________________", 20, y, 10);
            y = drawText("________________________________________________________________________________________________", 20, y, 10);
            y += 4;
        });

        // SECCIÓN 2
        y += 5;
        y = drawText("SECCIÓN 2: SELECCIÓN MÚLTIPLE (10 pts)", 15, y, 12, true);
        y += 2;
        S2.forEach((q, i) => {
            y = drawText(`${i+1}. ${q.text}`, 15, y, 10, false, 'left', 175);
            q.opts.forEach((opt, oi) => {
                const letter = String.fromCharCode(65 + oi);
                y = drawText(`[   ] ${letter}) ${opt}`, 20, y, 10, false, 'left', 170);
            });
            y += 4;
        });

        // SECCIÓN 3
        y += 5;
        y = drawText("SECCIÓN 3: ORDENAMIENTO (5 pts)", 15, y, 12, true);
        y += 2;
        S3.forEach((q, i) => {
            y = drawText(`${i+1}. ${q.title}`, 15, y, 10, false, 'left', 175);
            y = drawText("Escriba el número de orden (1, 2, 3...) dentro de cada corchete:", 20, y, 9, false);
            q.sentences.forEach((sent, si) => {
                y = drawText(`[   ] ${sent}`, 20, y, 10, false, 'left', 170);
            });
            y += 4;
        });

        // SECCIÓN 4
        y += 5;
        y = drawText("SECCIÓN 4: COMPLETAMIENTO (10 pts)", 15, y, 12, true);
        y += 2;
        S4.forEach((cat, i) => {
            y = drawText(`${i+1}. ${cat.title}`, 15, y, 10, true, 'left', 175);
            cat.questions.forEach((q, qi) => {
                let paragraph = `${qi+1}) `;
                q.parts.forEach((p, pi) => {
                    paragraph += p;
                    if (pi < q.parts.length - 1) {
                        paragraph += " ________________________ ";
                    }
                });
                y = drawText(paragraph, 20, y, 10, false, 'left', 170);
                y += 2;
            });
            y += 4;
        });

        // SECCIÓN 5
        y += 5;
        y = drawText("SECCIÓN 5: UNIR CON LÍNEAS / CORRESPONDENCIA (10 pts)", 15, y, 12, true);
        y += 2;
        y = drawText("Escriba la letra de la columna derecha dentro del corchete correspondiente en la columna izquierda.", 15, y, 9, false);
        S5.forEach((q, i) => {
            const pageBottom = 297 - footerH - 10;
            if (y > pageBottom - 40) { doc.addPage(); drawDecorations(); y = headerH + 8; }
            y = drawText(`${i+1}. ${q.title}`, 15, y, 10, true, 'left', 175);
            
            // Generar letras para opciones barajadas
            const shuffledOptions = [...q.rightItems].sort(() => Math.random() - 0.5);
            
            let tableBody = [];
            for (let j = 0; j < Math.max(q.leftItems.length, shuffledOptions.length); j++) {
                const left = q.leftItems[j] ? `[   ] ${cleanLaTeX(q.leftItems[j].text)}` : "";
                const letter = String.fromCharCode(65 + j);
                const right = shuffledOptions[j] ? `${letter}) ${cleanLaTeX(shuffledOptions[j].text)}` : "";
                tableBody.push([left, right]);
            }
            
            doc.autoTable({
                startY: y,
                head: [['Conceptos', 'Definiciones']],
                body: tableBody,
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 3, valign: 'middle' },
                headStyles: { fillColor: [0, 39, 73], textColor: 255 },
                columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } },
                margin: { left: 15, bottom: footerH + 10 }
            });
            y = doc.lastAutoTable.finalY + 8;
        });
        
        // Firmas al final
        const pageBottom = 297 - footerH - 10;
        if (y > pageBottom - 30) { doc.addPage(); drawDecorations(); y = headerH + 8; }
        y += 20;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(65, y, 145, y);
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.text("Firma del Estudiante", 105, y, { align: 'center' });
        
        // Descargar PDF
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        w.location.href = pdfUrl;
        
    } catch (e) {
        console.error("Error generando PDF en blanco: ", e);
        w.document.write('<div style="color:red;text-align:center;margin-top:50px;">Error al generar el PDF: <br>' + e.message + '<br>' + (e.stack || '').replace(/\n/g, '<br>') + '<\\/div>');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==================================================================
   REINTENTAR
   ================================================================== */
function retry(){pdfGenerated=false;disablePrintButton();curSec=1;curQ=0;secScores={s1:null,s2:null,s3:null,s4:null,s5:null};initAnswers();document.getElementById('rRing').style.strokeDashoffset=440;document.getElementById('rRing').classList.remove('low','mid');document.querySelector('.etimer').style.color='';showScr('sInstr');toast('Evaluación reiniciada.','success');}

/* ==================================================================
   KATEX RENDER HELPER
   ================================================================== */
function rK(el){if(typeof renderMathInElement==='function')renderMathInElement(el||document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}],throwOnError:false})}

/* ==================================================================
   RESPALDO SEGURO (GOOGLE APPS SCRIPT WEB APP ENDPOINT)
   ================================================================== */
function sendBackupData(results) {
    // Si necesitas sobreescribir la URL por parámetro de URL, por ejemplo: index.html?backup=https://...
    const urlParams = new URLSearchParams(window.location.search);
    let endpointUrl = urlParams.get('backup') || localStorage.getItem('backup_endpoint_url') || 'https://script.google.com/macros/s/AKfycbzEqJIHol0SZ5FOVvbtpPz3grG5-64Y_Ab35twJEE-1PuRxC7vzmTaVAO4obaJuYrKEBg/exec';
    
    if (endpointUrl === 'https://script.google.com/macros/s/AKfycbzEqJIHol0SZ5FOVvbtpPz3grG5-64Y_Ab35twJEE-1PuRxC7vzmTaVAO4obaJuYrKEBg/exec') {
        console.warn('Endpoint de respaldo en la nube no configurado.');
        return;
    }
    
    toast('Enviando respaldo de resultados...', 'warning');
    
    fetch(endpointUrl, {
        method: 'POST',
        mode: 'no-cors', // Permite cruzar políticas de CORS de Google Apps Script de forma segura
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(results)
    })
    .then(() => {
        console.log('Respaldo en la nube enviado correctamente.');
        toast('Resultados respaldados en la nube con éxito.', 'success');
    })
    .catch(err => {
        console.error('Error al realizar el respaldo:', err);
        toast('Error al respaldar en la nube. Se mantiene guardado en local.', 'error');
    });
}
