/* ============================================================
   SU600_WEB - Favoritos (guarda en localStorage)
   ============================================================ */

const FAVORITOS_KEY = 'su600_favoritos';

function obtenerFavoritos() {
    try {
        const data = localStorage.getItem(FAVORITOS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error leyendo favoritos:', e);
        return [];
    }
}

function guardarFavoritos(lista) {
    try {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
    } catch (e) {
        console.error('Error guardando favoritos:', e);
    }
}

function esFavorito(codigo) {
    return obtenerFavoritos().some(f => f.codigo === codigo);
}

function toggleFavorito(codigo, texto) {
    let lista = obtenerFavoritos();
    const index = lista.findIndex(f => f.codigo === codigo);

    if (index >= 0) {
        // Ya existe → quitar
        lista.splice(index, 1);
        console.log('⭐ Quitado de favoritos:', codigo);
    } else {
        // No existe → añadir
        lista.push({
            codigo: codigo,
            texto: texto,
            fecha: new Date().toISOString()
        });
        console.log('⭐ Añadido a favoritos:', codigo);
    }

    guardarFavoritos(lista);
    return index < 0; // true si se añadió, false si se quitó
}

function mostrarFavoritos() {
    const contenido = document.getElementById("contenido");
    const lista = obtenerFavoritos();

    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "⭐ Favoritos";
    contenido.appendChild(titulo);

    if (lista.length === 0) {
        contenido.innerHTML += `
            <div class="tarjeta">
                <p>No tienes parámetros favoritos todavía.</p>
                <p>Ve a <strong>Parámetros</strong> y pulsa ⭐ en los que quieras guardar.</p>
            </div>
        `;
        return;
    }

    const contador = document.createElement("p");
    contador.textContent = `${lista.length} parámetro(s) guardado(s)`;
    contenido.appendChild(contador);

    lista.forEach(fav => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta favorito-item";
        tarjeta.innerHTML = `
            <h3>${fav.codigo}</h3>
            <p>${fav.texto ? fav.texto.substring(0, 100) + '...' : ''}</p>
            <div class="favorito-acciones">
                <button class="btn-quitar" data-codigo="${fav.codigo}">❌ Quitar</button>
            </div>
        `;
        contenido.appendChild(tarjeta);
    });

    // Delegación de eventos para los botones "Quitar"
    contenido.querySelectorAll('.btn-quitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const codigo = btn.dataset.codigo;
            toggleFavorito(codigo, '');
            mostrarFavoritos(); // Refrescar la lista
        });
    });
}

// Exponer funciones globales
window.toggleFavorito = toggleFavorito;
window.esFavorito = esFavorito;
window.mostrarFavoritos = mostrarFavoritos;
