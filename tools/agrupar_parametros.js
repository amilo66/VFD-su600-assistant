const fs = require('fs');
const path = require('path');

const PARAMS_DIR = path.join(__dirname, '..', 'data', 'su600', 'parametros');
const TRADUCCIONES_FILE = path.join(__dirname, '..', 'data', 'su600', 'traducciones.json');

// Cargar traducciones existentes
let traducciones = {};
if (fs.existsSync(TRADUCCIONES_FILE)) {
    traducciones = JSON.parse(fs.readFileSync(TRADUCCIONES_FILE, 'utf8'));
}

function normalizarCodigo(codigo) {
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
    
    // Agrupar por código
    const agrupados = {};
    
    for (const item of data) {
        const codigo = normalizarCodigo(item.codigo);
        
        if (!agrupados[codigo]) {
            agrupados[codigo] = {
                codigo: codigo,
                texto: item.texto || '',
                opciones: []
            };
        } else {
            // Combinar textos si es diferente
            if (item.texto && !agrupados[codigo].texto.includes(item.texto)) {
                agrupados[codigo].texto += '\n' + item.texto;
            }
        }
        
        // Extraer opciones (líneas que empiezan con número:)
        if (item.texto) {
            const lineas = item.texto.split('\n');
            for (const linea of lineas) {
                const match = linea.match(/^(\d+):\s*(.+)$/);
                if (match) {
                    const existe = agrupados[codigo].opciones.find(o => o.valor === match[1]);
                    if (!existe) {
                        agrupados[codigo].opciones.push({
                            valor: match[1],
                            descripcion: match[2].trim()
                        });
                    }
                }
            }
        }
    }
    
    // Convertir a array y ordenar
    const resultado = Object.values(agrupados).sort((a, b) => 
        obtenerValorNumerico(a.codigo) - obtenerValorNumerico(b.codigo)
    );
    
    // Guardar
    fs.writeFileSync(ruta, JSON.stringify(resultado, null, 4));
    console.log(`✅ ${archivo}: ${resultado.length} parámetros agrupados`);
}

console.log('\n🎉 Todos los parámetros están agrupados y ordenados.');
