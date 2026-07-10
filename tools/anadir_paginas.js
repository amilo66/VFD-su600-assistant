const fs = require('fs');
const path = require('path');

const PARAMS_DIR = path.join(__dirname, '..', 'data', 'su600', 'parametros');

// Páginas correctas según el manual
const paginasPorGrupo = {
    'F0': 17,   // F0 group - Basic running parameters (pág 17)
    'F1': 18,   // F1 group - Auxiliary running parameters (pág 18-19)
    'F2': 20,   // F2 group - Analog and digital I/O (pág 20-21)
    'F3': 22,   // F3 group - PID parameters (pág 22)
    'F4': 23,   // F4 group - Advanced parameters (pág 23-24)
    'F5': 25,   // F5 group - Protection parameters (pág 25)
    'F6': 26,   // F6 group - Communication parameters (pág 26)
    'F7': 26,   // F7 group - Supplementary parameters (pág 26)
    'F8': 27,   // F8 group - Management parameters (pág 27)
    'F9': 27    // F9 group - Manufacturer parameters (pág 27)
};

const archivos = fs.readdirSync(PARAMS_DIR).filter(f => f.endsWith('.json'));

for (const archivo of archivos) {
    const ruta = path.join(PARAMS_DIR, archivo);
    const data = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    const grupo = archivo.replace('.json', '');
    const pagina = paginasPorGrupo[grupo] || 17;
    
    data.forEach(param => {
        param.pagina_pdf = pagina;
    });
    
    fs.writeFileSync(ruta, JSON.stringify(data, null, 4));
    console.log(`✅ ${archivo}: página ${pagina} (${data.length} parámetros)`);
}

console.log('\n🎉 Páginas actualizadas correctamente.');
