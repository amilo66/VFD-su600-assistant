document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
    try {
        const respuesta = await fetch("data/menu.json");
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar menu.json");
        }
        const menu = await respuesta.json();
        crearMenu(menu);

        // ✅ NUEVO: Iniciar el buscador
        if (typeof iniciarBuscador === 'function') {
            iniciarBuscador();
        }
    } catch (error) {
        console.error(error);
        document.getElementById("contenido").innerHTML = `
        <div class="tarjeta">
        <h2>Error</h2>
        <p>No se pudo cargar el menú.</p>
        </div>
        `;
    }
}

function crearMenu(menu) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    menu.forEach(item => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        tarjeta.innerHTML = `
        <div class="icono">${item.icono}</div>
        <h2>${item.titulo}</h2>
        <p>${item.descripcion}</p>
        `;
        tarjeta.addEventListener("click", () => {
            console.log("ID pulsado:", item.id);
            abrirSeccion(item.id);
        });
        contenido.appendChild(tarjeta);
    });
}

// Activar botón Atrás del navegador
document.addEventListener('click', function(e) {
    const tarjeta = e.target.closest('.tarjeta');
    if (tarjeta && tarjeta.dataset.id) {
        const id = tarjeta.dataset.id;
        // Guardamos en el historial sin recargar
        history.pushState({ vista: id }, '', '#' + id);
    }
});

// Escuchar cuando el usuario pulsa el botón Atrás del navegador
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.vista) {
        // Si hay una vista guardada, cargamos esa
        if (typeof navegarA === 'function') navegarA(event.state.vista);
        else if (typeof router === 'function') router(event.state.vista);
    } else {
        // Si no hay estado, volvemos al inicio
        if (typeof mostrarInicio === 'function') mostrarInicio();
    }
});
