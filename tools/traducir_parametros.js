const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PARAMS_DIR = path.join(__dirname, '..', 'data', 'su600', 'parametros');
const TRADUCCIONES_FILE = path.join(__dirname, '..', 'data', 'su600', 'traducciones.json');
const KEY_FILE = path.join(__dirname, 'groq_key.txt');

// Leer o pedir API key
async function obtenerApiKey() {
    if (fs.existsSync(KEY_FILE)) {
        return fs.readFileSync(KEY_FILE, 'utf8').trim();
    }
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise(resolve => {
        rl.question('Introduce tu API key de Groq (gsk_...): ', key => {
            rl.close();
            fs.writeFileSync(KEY_FILE, key.trim());
            console.log('✅ API key guardada en tools/groq_key.txt');
            resolve(key.trim());
        });
    });
}

// Cargar traducciones existentes
function cargarTraducciones() {
    if (fs.existsSync(TRADUCCIONES_FILE)) {
        return JSON.parse(fs.readFileSync(TRADUCCIONES_FILE, 'utf8'));
    }
    return {};
}

// Guardar traducciones
function guardarTraducciones(traducciones) {
    fs.writeFileSync(TRADUCCIONES_FILE, JSON.stringify(traducciones, null, 4));
}

// Llamar a Groq API
async function traducirConGroq(apiKey, codigo, textoOriginal) {
    const prompt = `Traduce al español este parámetro de un variador de frecuencia SU-600.

Código: ${codigo}
Texto original (inglés): ${textoOriginal}

Responde SOLO con un JSON válido en este formato exacto, sin markdown ni explicaciones adicionales:
{"nombre_es": "nombre corto en español", "explicacion_es": "explicación clara y práctica en 1-2 frases"}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 150
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const texto = data.choices?.[0]?.message?.content || '';
    
    // Extraer JSON del texto
    const match = texto.match(/\{[^}]+\}/);
    if (!match) {
        throw new Error('Respuesta no válida');
    }
    
    return JSON.parse(match[0]);
}

// Retraso para rate limits
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('🚀 Iniciando traducción de parámetros...\n');
    
    const apiKey = await obtenerApiKey();
    const traducciones = cargarTraducciones();
    
    // Leer todos los archivos F0.json a F9.json
    const archivos = [];
    for (let i = 0; i <= 9; i++) {
        const archivo = path.join(PARAMS_DIR, `F${i}.json`);
        if (fs.existsSync(archivo)) {
            archivos.push(archivo);
        }
    }
    
    console.log(`📁 Encontrados ${archivos.length} archivos de parámetros\n`);
    
    let total = 0;
    let traducidos = 0;
    let errores = 0;
    
    for (const archivo of archivos) {
        const parametros = JSON.parse(fs.readFileSync(archivo, 'utf8'));
        const grupo = path.basename(archivo, '.json');
        
        console.log(`\n📂 Procesando ${grupo}...`);
        
        for (const param of parametros) {
            total++;
            const codigo = param.codigo;
            
            // Saltar si ya está traducido
            if (traducciones[codigo]) {
                process.stdout.write('⏭️ ');
                continue;
            }
            
            try {
                const traduccion = await traducirConGroq(apiKey, codigo, param.texto);
                traducciones[codigo] = traduccion;
                traducidos++;
                process.stdout.write('✅ ');
                
                // Guardar cada 5 traducciones
                if (traducidos % 5 === 0) {
                    guardarTraducciones(traducciones);
                }
                
                // Rate limit: 2 segundos entre llamadas
                await delay(2000);
                
            } catch (e) {
                errores++;
                process.stdout.write('❌ ');
                console.error(`\n   Error en ${codigo}: ${e.message}`);
                
                // Si es rate limit, esperar más
                if (e.message.includes('429')) {
                    console.log('   ⏳ Rate limit, esperando 10 segundos...');
                    await delay(10000);
                }
            }
        }
    }
    
    // Guardar al final
    guardarTraducciones(traducciones);
    
    console.log('\n\n═══════════════════════════════════════');
    console.log(`✅ Traducción completada`);
    console.log(`   Total: ${total}`);
    console.log(`   Nuevos: ${traducidos}`);
    console.log(`   Errores: ${errores}`);
    console.log(`   Ya existían: ${total - traducidos - errores}`);
    console.log('═══════════════════════════════════════\n');
}

main().catch(e => {
    console.error('Error fatal:', e);
    process.exit(1);
});
