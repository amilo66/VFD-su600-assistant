/* ============================================================
   SU600_WEB - Sistema de Múltiples Instalaciones
   ============================================================ */

const KEY_INSTALACIONES = 'su600_instalaciones';
const KEY_INSTALACION_ACTIVA = 'su600_instalacion_activa';

// 1. Inicialización y Migración (se ejecuta al cargar la app)
function inicializarSistemaInstalaciones() {
    let instalaciones = obtenerListaInstalaciones();
    let idActiva = localStorage.getItem(KEY_INSTALACION_ACTIVA);

    // Si no hay ninguna instalación, creamos la "Por Defecto" y migramos datos antiguos
    if (instalaciones.length === 0) {
        const nuevaInstalacion = {
            id: 'default_' + Date.now(),
            nombre: 'Instalación Principal',
            motor: { potencia: '', voltaje: '', corriente: '', rpm: '' },
            fechaCreacion: new Date().toISOString()
        };
        instalaciones.push(nuevaInstalacion);
        idActiva = nuevaInstalacion.id;
        
        // Migrar favoritos y notas antiguos si existen
        migrarDatosAntiguos(nuevaInstalacion.id);
        
        guardarListaInstalaciones(instalaciones);
        localStorage.setItem(KEY_INSTALACION_ACTIVA, idActiva);
    }

    // Si no hay activa pero sí hay instalaciones, activar la primera
    if (!idActiva && instalaciones.length > 0) {
        idActiva = instalaciones[0].id;
        localStorage.setItem(KEY_INSTALACION_ACTIVA, idActiva);
    }

    console.log('✅ Sistema de instalaciones inicializado. Activa:', getInstalacionActiva()?.nombre);
}

function migrarDatosAntiguos(idInstalacion) {
    const favAntiguos = localStorage.getItem('su600_favoritos');
    if (favAntiguos) {
        localStorage.setItem(`su600_favoritos_${idInstalacion}`, favAntiguos);
        // No borramos los antiguos por seguridad, pero la app usará los nuevos
    }
    const notasAntiguas = localStorage.getItem('su600_notas');
    if (notasAntiguas) {
        localStorage.setItem(`su600_notas_${idInstalacion}`, notasAntiguas);
    }
}

// 2. Funciones de Gestión
function obtenerListaInstalaciones() {
    try {
        return JSON.parse(localStorage.getItem(KEY_INSTALACIONES)) || [];
    } catch (e) { return []; }
}

function guardarListaInstalaciones(lista) {
    localStorage.setItem(KEY_INSTALACIONES, JSON.stringify(lista));
}

function getInstalacionActiva() {
    const idActiva = localStorage.getItem(KEY_INSTALACION_ACTIVA);
    const lista = obtenerListaInstalaciones();
    return lista.find(i => i.id === idActiva) || lista[0] || null;
}

function cambiarInstalacion(id) {
    localStorage.setItem(KEY_INSTALACION_ACTIVA, id);
    console.log('🔄 Instalación cambiada a:', getInstalacionActiva().nombre);
    // Recargar la vista actual para reflejar los nuevos favoritos/notas
    if (typeof mostrarInicio === 'function') mostrarInicio(); 
    else location.reload(); 
}

function crearInstalacion(nombre, datosMotor) {
    const lista = obtenerListaInstalaciones();
    const nueva = {
        id: 'inst_' + Date.now(),
        nombre: nombre,
        motor: datosMotor,
        fechaCreacion: new Date().toISOString()
    };
    lista.push(nueva);
    guardarListaInstalaciones(lista);
    cambiarInstalacion(nueva.id);
}

function eliminarInstalacion(id) {
    if (id === getInstalacionActiva().id) {
        alert('No puedes eliminar la instalación que estás usando actualmente.');
        return;
    }
    if (!confirm('¿Seguro que quieres borrar esta instalación y todos sus datos?')) return;
    
    let lista = obtenerListaInstalaciones();
    lista = lista.filter(i => i.id !== id);
    guardarListaInstalaciones(lista);
    
    // Limpiar sus datos
    localStorage.removeItem(`su600_favoritos_${id}`);
    localStorage.removeItem(`su600_notas_${id}`);
    
    mostrarInstalaciones(); // Refrescar vista
}

function exportarInstalacion(id) {
    const instalacion = obtenerListaInstalaciones().find(i => i.id === id);
    if (!instalacion) return;
    
    const datos = {
        instalacion: instalacion,
        favoritos: JSON.parse(localStorage.getItem(`su600_favoritos_${id}`) || '[]'),
        notas: JSON.parse(localStorage.getItem(`su600_notas_${id}`) || '{}')
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datos, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `SU600_${instalacion.nombre.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importarInstalacion(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const datos = JSON.parse(e.target.result);
            if (!datos.instalacion || !datos.instalacion.id) throw new Error('Formato inválido');
            
            const lista = obtenerListaInstalaciones();
            // Evitar duplicados por ID
            const existe = lista.find(i => i.id === datos.instalacion.id);
            if (existe) {
                if (!confirm(`Ya existe "${existe.nombre}". ¿Sobrescribir con los datos importados?`)) return;
                lista.filter(i => i.id !== datos.instalacion.id);
            }
            
            datos.instalacion.nombre += ' (Importada)';
            lista.push(datos.instalacion);
            guardarListaInstalaciones(lista);
            
            localStorage.setItem(`su600_favoritos_${datos.instalacion.id}`, JSON.stringify(datos.favoritos || []));
            localStorage.setItem(`su600_notas_${datos.instalacion.id}`, JSON.stringify(datos.notas || {}));
            
            alert('✅ Instalación importada correctamente.');
            mostrarInstalaciones();
        } catch (err) {
            alert('❌ Error al importar: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// 3. Helpers para Favoritos y Notas (Multi-instalación)
function getFavoritos() {
    const id = getInstalacionActiva().id;
    try { return JSON.parse(localStorage.getItem(`su600_favoritos_${id}`)) || []; } 
    catch (e) { return []; }
}

function guardarFavoritos(lista) {
    const id = getInstalacionActiva().id;
    localStorage.setItem(`su600_favoritos_${id}`, JSON.stringify(lista));
}

function getNotas() {
    const id = getInstalacionActiva().id;
    try { return JSON.parse(localStorage.getItem(`su600_notas_${id}`)) || {}; } 
    catch (e) { return {}; }
}

function guardarNotas(obj) {
    const id = getInstalacionActiva().id;
    localStorage.setItem(`su600_notas_${id}`, JSON.stringify(obj));
}

// Inicializar al cargar el script
inicializarSistemaInstalaciones();

// Exponer funciones globales
window.getInstalacionActiva = getInstalacionActiva;
window.cambiarInstalacion = cambiarInstalacion;
window.crearInstalacion = crearInstalacion;
window.eliminarInstalacion = eliminarInstalacion;
window.exportarInstalacion = exportarInstalacion;
window.importarInstalacion = importarInstalacion;
window.getFavoritos = getFavoritos;
window.guardarFavoritos = guardarFavoritos;
window.getNotas = getNotas;
window.guardarNotas = guardarNotas;
