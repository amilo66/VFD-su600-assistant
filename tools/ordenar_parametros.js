const fs = require('fs');
const path = require('path');

const PARAMS_DIR = path.join(__dirname, '..', 'data', 'su600', 'parametros');

function normalizarCodigo(codigo) {
    // Convierte F0.1 en F0.01, F0.10 se queda en F0.10
    const match = codigo.match(/^(F\d+)\.(\d+)$/);
    if (match) {
        const grupo = match[1];
        const num = match[2].padStart(2, '0');
        return `${grupo}.${num}`;
    }
    return codigo;
}

function obtenerValorNumerico(codigo) {
    const norm = normalizarCodigo(codigo);
    return parseFloat(norm.replace('F', ''));
}

const archivos = fs.readdirSync(PARAMS_DIR).filter(f => f.endsWith('.json'));

for (const archivo of archivos) {
    const ruta = path.join(PARAMS_DIR, archivo);
    const data = JSON.parse(fs.readFileSync(ruta, 'utf8'));

    // 1. Normalizar códigos (añadir ceros a la izquierda si falta)
    data.forEach(p => {
        p.codigo = normalizarCodigo(p.codigo);
    });

    // 2. Ordenar numéricamente (0.01, 0.02, ... 0.10)
    data.sort((a, b) => obtenerValorNumerico(a.codigo) - obtenerValorNumerico(b.codigo));

    // 3. Guardar el archivo formateado
    fs.writeFileSync(ruta, JSON.stringify(data, null, 4));
    console.log(`✅ Ordenado y corregido: ${archivo} (${data.length} parámetros)`);
}

console.log('\n🎉 Todos los parámetros están ordenados numéricamente.');
