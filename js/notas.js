/* ============================================================
   SU600_WEB - Gestión de Notas (Multi-instalación)
   ============================================================ */

function obtenerNota(codigo) {
    const notas = typeof getNotas === 'function' ? getNotas() : {};
    return notas[codigo] || '';
}

function guardarNota(codigo, texto) {
    let notas = typeof getNotas === 'function' ? getNotas() : {};
    
    if (texto.trim() === '') {
        delete notas[codigo];
    } else {
        notas[codigo] = texto;
    }
    
    if (typeof guardarNotas === 'function') {
        guardarNotas(notas);
    }
}

function editarNota(codigo) {
    const notaActual = obtenerNota(codigo);
    const nuevaNota = prompt(`Editar nota para ${codigo}:`, notaActual);
    
    if (nuevaNota !== null) {
        guardarNota(codigo, nuevaNota);
        // Recargar la vista actual para reflejar los cambios
        if (typeof mostrarParametro === 'function') {
            // Intentamos recargar si estamos en un parámetro, sino recarga general
            location.reload(); 
        } else {
            location.reload();
        }
    }
}

function mostrarNotas() {
    const contenido = document.getElementById("contenido");
    const notas = typeof getNotas === 'function' ? getNotas() : {};
    const instalacion = typeof getInstalacionActiva === 'function' ? getInstalacionActiva() : null;
    const codigos = Object.keys(notas);

    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "📝 Mis Notas";
    contenido.appendChild(titulo);

    if (instalacion) {
        const info = document.createElement("p");
        info.textContent = `Mostrando notas de: ${instalacion.nombre}`;
        info.className = "instalacion-info";
        contenido.appendChild(info);
    }

    if (codigos.length === 0) {
        contenido.innerHTML += "<p>No tienes notas guardadas en esta instalación.</p>";
        return;
    }

    const lista = document.createElement("div");
    
    codigos.forEach(codigo => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        tarjeta.innerHTML = `
            <h3>${codigo}</h3>
            <p>${notas[codigo]}</p>
            <button onclick="editarNota('${codigo}')">📝 Editar</button>
            <button onclick="guardarNota('${codigo}', ''); location.reload();" style="background: var(--color-peligro); color: white;">🗑️ Borrar</button>
        `;
        lista.appendChild(tarjeta);
    });

    contenido.appendChild(lista);
}

window.obtenerNota = obtenerNota;
window.guardarNota = guardarNota;
window.editarNota = editarNota;
window.mostrarNotas = mostrarNotas;
