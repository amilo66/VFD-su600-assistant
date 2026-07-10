/* ============================================================
   SU600_WEB - Integración con IA (Groq - gratuito y rápido)
   ============================================================ */

const IA_KEY = 'su600_groq_api_key';
const IA_CACHE_KEY = 'su600_ia_cache';

function obtenerApiKey() {
    return localStorage.getItem(IA_KEY) || '';
}

function guardarApiKey(key) {
    localStorage.setItem(IA_KEY, key);
}

function obtenerCacheIA() {
    try {
        const data = localStorage.getItem(IA_CACHE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
}

function guardarCacheIA(cache) {
    try {
        localStorage.setItem(IA_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.error('Error guardando caché IA:', e);
    }
}

function obtenerExplicacionCache(codigo) {
    const cache = obtenerCacheIA();
    return cache[codigo] || null;
}

function guardarExplicacionCache(codigo, explicacion) {
    const cache = obtenerCacheIA();
    cache[codigo] = explicacion;
    guardarCacheIA(cache);
}

// Función con reintentos
async function llamarGroqConReintentos(apiKey, messages, maxReintentos = 3) {
    for (let i = 0; i < maxReintentos; i++) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: messages,
                    temperature: 0.5,
                    max_tokens: 400
                })
            });

            if (response.status === 429) {
                // Rate limit - esperar y reintentar
                const espera = Math.pow(2, i) * 2000; // 2s, 4s, 8s
                console.log(`Rate limit, esperando ${espera}ms...`);
                await new Promise(r => setTimeout(r, espera));
                continue;
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || 'No se pudo obtener respuesta';
            
        } catch (e) {
            if (i === maxReintentos - 1) throw e;
            const espera = Math.pow(2, i) * 1000;
            console.log(`Error, reintentando en ${espera}ms...`);
            await new Promise(r => setTimeout(r, espera));
        }
    }
}

async function pedirExplicacionIA(codigo, textoOriginal, contextoCompleto = '') {
    const apiKey = obtenerApiKey();
    if (!apiKey) {
        throw new Error('No hay API key configurada');
    }

    const prompt = `Eres un experto en variadores de frecuencia SU-600. Explica en español sencillo qué hace este parámetro.

DATOS OFICIALES DEL PARÁMETRO ${codigo}:
${contextoCompleto || textoOriginal}

Da una explicación clara y práctica de:
1. Qué hace este parámetro (basándote SOLO en los datos oficiales)
2. Para qué sirve en la práctica
3. Cuándo necesitas ajustarlo
4. Valores típicos o recomendados

IMPORTANTE: Usa SOLO la información oficial proporcionada. No inventes datos.
Máximo 150 palabras.`;

    const texto = await llamarGroqConReintentos(apiKey, [
        { role: 'user', content: prompt }
    ]);
    
    guardarExplicacionCache(codigo, texto);
    return texto;
}

async function pedirExplicacionIAChat(pregunta, contextoCompleto) {
    const apiKey = obtenerApiKey();
    if (!apiKey) {
        throw new Error('No hay API key configurada');
    }

    const prompt = `Eres un experto en variadores de frecuencia SU-600. Responde en español de forma clara y práctica.

INFORMACIÓN OFICIAL DEL PARÁMETRO:
${contextoCompleto}

PREGUNTA DEL USUARIO: ${pregunta}

INSTRUCCIONES IMPORTANTES:
- Responde SOLO basándote en la información oficial proporcionada arriba
- Si la pregunta no está relacionada con el parámetro, dilo amablemente
- Sé conciso (máximo 100 palabras)
- Si mencionas valores específicos, usa EXACTAMENTE los del manual`;

    return await llamarGroqConReintentos(apiKey, [
        { role: 'user', content: prompt }
    ]);
}

function mostrarConfiguracionIA() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "🤖 Configuración de IA";
    contenido.appendChild(titulo);

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    
    const apiKey = obtenerApiKey();
    
    tarjeta.innerHTML = `
        <h3>API Key de Groq</h3>
        <p>Para usar la explicación con IA, necesitas una API key gratuita de Groq.</p>
        <ol>
            <li>Ve a <a href="https://console.groq.com/keys" target="_blank">Groq Console</a></li>
            <li>Inicia sesión o crea una cuenta</li>
            <li>Pulsa "Create API Key"</li>
            <li>Copia la clave y pégala aquí</li>
        </ol>
        
        <div class="form-field" style="margin-top: 20px;">
            <label>API Key:</label>
            <input type="password" id="api-key-input" value="${apiKey}" placeholder="gsk_...">
        </div>
        
        <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="btn-guardar-key">💾 Guardar</button>
            <button id="btn-probar-key">🧪 Probar conexión</button>
            <button id="btn-borrar-cache">🗑️ Borrar caché de explicaciones</button>
        </div>
        
        <div id="resultado-ia" style="margin-top: 15px;"></div>
    `;
    
    contenido.appendChild(tarjeta);
    
    document.getElementById('btn-guardar-key').onclick = () => {
        const key = document.getElementById('api-key-input').value.trim();
        guardarApiKey(key);
        const resultado = document.getElementById('resultado-ia');
        resultado.innerHTML = '<p style="color: #16a34a;">✅ API key guardada</p>';
    };
    
    document.getElementById('btn-probar-key').onclick = async () => {
        const key = document.getElementById('api-key-input').value.trim();
        if (!key) {
            alert('Primero guarda la API key');
            return;
        }
        
        const resultado = document.getElementById('resultado-ia');
        resultado.innerHTML = '<p>Probando conexión...</p>';
        
        try {
            guardarApiKey(key);
            await pedirExplicacionIA('P00.01', 'Control mode selection', 'P00.01: Modo de control. 0=V/F, 1=Vector Control.');
            resultado.innerHTML = '<p style="color: #16a34a;">✅ Conexión exitosa con Groq</p>';
        } catch (e) {
            resultado.innerHTML = `<p style="color: #dc2626;">❌ Error: ${e.message}</p>`;
        }
    };
    
    document.getElementById('btn-borrar-cache').onclick = () => {
        if (confirm('¿Borrar todas las explicaciones guardadas?')) {
            localStorage.removeItem(IA_CACHE_KEY);
            const resultado = document.getElementById('resultado-ia');
            resultado.innerHTML = '<p style="color: #16a34a;">✅ Caché borrado</p>';
        }
    };
}

// Función específica para consultas de Modbus
async function pedirConsultaModbusIA(pregunta) {
    const apiKey = obtenerApiKey();
    if (!apiKey) throw new Error('No hay API key');

    const contextoModbus = `
    Eres un experto en el protocolo Modbus RTU del variador SU-600.
    MAPA DE REGISTROS PRINCIPAL:
    - 2000H: Comando de control (0001H=Parar, 0012H=Marcha adelante, 0022H=Marcha atrás, 0002H=Reset fallo).
    - 2001H: Frecuencia de comunicación (-10000 a 10000, donde 10000 = 100% de F0.04).
    - 2102H: Frecuencia ajustada (Lectura).
    - 2103H: Frecuencia de salida (Lectura).
    - 2104H: Corriente de salida (Lectura).
    - 2105H: Tensión del bus DC (Lectura).
    - 2100H: Código de fallo actual (00=Sin fallo, 01=Módulo, 02=Sobretensión, 10=Sobrecorriente aceleración, etc.).
    - 0000H a 0806H: Parámetros de usuario (F0.00 es 0000H, F0.01 es 0001H... F1.00 es 0100H, F2.13 es 0213H).

    FUNCIONES SOPORTADAS:
    - 03H: Leer registros.
    - 06H: Escribir un registro.

    FORMATO TRAMA RTU: [Dirección esclavo] [Función] [Dirección registro Alta] [Dirección registro Baja] [Dato Alta] [Dato Baja] [CRC Bajo] [CRC Alto].
    Dirección por defecto del variador: 01H.

    PREGUNTA DEL USUARIO: ${pregunta}

    INSTRUCCIONES:
    1. Responde en español, de forma clara y técnica.
    2. Si te pide una trama (ej: "arrancar motor"), dame el string hexadecimal exacto byte a byte.
    3. Si te pregunta por un registro, dime su dirección y qué valores acepta.
    4. Máximo 150 palabras.`;

    return await llamarGroqConReintentos(apiKey, [{ role: 'user', content: contextoModbus }]);
}

// Función específica para consultas de Cableado y Terminales
async function pedirConsultaCableadoIA(pregunta) {
    const apiKey = obtenerApiKey();
    if (!apiKey) throw new Error('No hay API key');

    const contextoCableado = `
    Eres un experto en el cableado y la instalación del variador SU-600.

    BLOQUE DE CONTROL (Terminales):
    - 10V: Alimentación para potenciómetro externo.
    - GND: Tierra común para señales analógicas y digitales.
    - AI: Entrada analógica (0-10V o 0-20mA según J5).
    - AO: Salida analógica (0-10V o 0-20mA según J2).
    - 485+ / 485-: Comunicación RS485 (Modbus).
    - X1, X2, X3, X4: Entradas digitales multifunción (Configurables en F2.13 a F2.16).
    - COM: Común de las entradas digitales.
    - TA / TC: Contacto del relé de salida (Normalmente abierto / Común).

    JUMPERS (Configuración hardware):
    - J1: ON = Tierra del panel de control. OFF = Desconectado (Por defecto).
    - J2: ON (AVO) = Salida AO en voltaje (0-10V). OFF (ACO) = Salida AO en corriente (0-20mA).
    - J4: ON (P-I) = Potenciómetro INTERNO del teclado (Por defecto). OFF (P-E) = Potenciómetro EXTERNO (conectar en 10V, AI, GND).
    - J5: ON (AVI) = Entrada AI en voltaje (0-10V). OFF (ACI) = Entrada AI en corriente (0-20mA).

    BLOQUE DE POTENCIA:
    - R, S, T (o R/L1, S/L2, T/L3): Entrada de red trifásica o monofásica.
    - U, V, W: Salida hacia el motor (NUNCA conectar red aquí).
    - P+, PB: Para conectar resistencia de frenado (P+ y P+PB en modelos >3.7KW).

    REGLAS DE ORO:
    1. Esperar 5-8 minutos tras cortar la alimentación antes de tocar los bornes.
    2. Cable de señal (X1-X4, AI) apantallado y separado de los cables de potencia.
    3. Tierra (G/PE) obligatoria y con impedancia < 100 ohmios.

    PREGUNTA DEL USUARIO: ${pregunta}

    INSTRUCCIONES:
    1. Responde en español, de forma clara y técnica.
    2. Indica EXACTAMENTE el nombre del borne o jumper a usar.
    3. Si es un jumper, di si debe estar en ON o OFF.
    4. Máximo 150 palabras.`;

    return await llamarGroqConReintentos(apiKey, [{ role: 'user', content: contextoCableado }]);
}

window.obtenerApiKey = obtenerApiKey;
window.guardarApiKey = guardarApiKey;
window.obtenerExplicacionCache = obtenerExplicacionCache;
window.pedirExplicacionIA = pedirExplicacionIA;
window.pedirExplicacionIAChat = pedirExplicacionIAChat;
window.mostrarConfiguracionIA = mostrarConfiguracionIA;
window.pedirConsultaModbusIA = pedirConsultaModbusIA;
window.pedirConsultaCableadoIA = pedirConsultaCableadoIA;
