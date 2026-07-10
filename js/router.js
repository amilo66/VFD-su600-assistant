// ============================================================
// Sistema de Navegación Global
// ============================================================

let historialVistas = ['inicio'];

function navegarA(id) {
    if (id !== 'inicio') {
        historialVistas.push(id);
        history.pushState({ vista: id }, '', '#' + id);
    } else {
        historialVistas = ['inicio'];
        history.pushState({ vista: 'inicio' }, '', '#inicio');
    }
    abrirSeccion(id);
}

function volverAtras() {
    if (historialVistas.length > 1) {
        historialVistas.pop();
        const vistaAnterior = historialVistas[historialVistas.length - 1];
        history.pushState({ vista: vistaAnterior }, '', '#' + vistaAnterior);
        abrirSeccion(vistaAnterior);
    } else {
        historialVistas = ['inicio'];
        history.pushState({ vista: 'inicio' }, '', '#inicio');
        mostrarInicio();
    }
}

function crearBotonVolver(contenedor) {
    const btn = document.createElement('button');
    btn.className = 'btn-volver-global';
    btn.innerHTML = '← Volver';
    btn.onclick = () => volverAtras();
    contenedor.insertBefore(btn, contenedor.firstChild);
}

window.addEventListener('popstate', (event) => {
    const vista = event.state?.vista || 'inicio';
    if (vista === 'inicio') {
        historialVistas = ['inicio'];
    }
    abrirSeccion(vista);
});

// ============================================================
// Router Principal
// ============================================================

function abrirSeccion(id) {
    console.log("Router recibe: ", id);
    const contenido = document.getElementById("contenido");

    switch (id) {
        case "inicio":
            mostrarInicio();
            break;
        case "buscar":
        case "buscador":
            mostrarBuscador();
            crearBotonVolver(contenido);
            break;
        case "parametros":
            mostrarParametros();
            crearBotonVolver(contenido);
            break;
        case "monitoring":
            alert("📊 Monitoring");
            crearBotonVolver(contenido);
            break;
        case "fallos":
        case "alarmas":
            mostrarFallos();
            crearBotonVolver(contenido);
            break;
        case "terminales":
            if (typeof mostrarTerminales === 'function') {
                mostrarTerminales();
            } else {
                alert("Sección de terminales no disponible");
            }
            crearBotonVolver(contenido);
            break;
        case "modbus":
            if (typeof mostrarModbus === 'function') {
                mostrarModbus();
            } else {
                alert("Sección de modbus no disponible");
            }
            crearBotonVolver(contenido);
            break;
        case "macros":
            if (typeof mostrarMacros === 'function') {
                mostrarMacros();
            } else {
                alert("Sección de macros no disponible");
            }
            crearBotonVolver(contenido);
            break;
        case "favoritos":
            mostrarFavoritos();
            crearBotonVolver(contenido);
            break;
        case "notas":
            mostrarNotas();
            crearBotonVolver(contenido);
            break;
        case "config_ia":
            mostrarConfiguracionIA();
            crearBotonVolver(contenido);
            break;
        case "mi_configuracion":
            if (typeof mostrarMiConfiguracion === 'function') {
                mostrarMiConfiguracion();
            } else {
                alert("Sección de configuración no disponible");
            }
            crearBotonVolver(contenido);
            break;
        case "instalacion":
        case "instalaciones":
            if (typeof mostrarInstalaciones === 'function') {
                mostrarInstalaciones();
            } else {
                alert("Sección de instalaciones no disponible");
            }
            crearBotonVolver(contenido);
            break;
        case "backup":
            if (typeof mostrarBackup === 'function') {
                mostrarBackup();
            } else {
                alert("Sección de backup no disponible");
            }
            crearBotonVolver(contenido);
            break;
        case "manual":
            window.open('manual/VARIADOR DE FRECUENCIA SU-600.pdf', '_blank');
            break;
        default:
            alert("Sección no implementada: " + id);
    }
}

// ============================================================
// Mostrar Menú Principal (Inicio)
// ============================================================

async function mostrarInicio() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando...</p>";
    try {
        const respuesta = await fetch("data/menu.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar menu.json");
        const menu = await respuesta.json();
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
                navegarA(item.id);
            });
            contenido.appendChild(tarjeta);
        });
    } catch (error) {
        console.error(error);
        contenido.innerHTML = `
        <div class="tarjeta">
        <h2>Error</h2>
        <p>No se pudo cargar el menú.</p>
        </div>
        `;
    }
}

// ============================================================
// Mostrar Buscador
// ============================================================

function mostrarBuscador() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
    <h1>🔍 Buscar</h1>
    <div class="buscador-container">
    <input
    type="search"
    id="buscador"
    placeholder="Buscar parámetro o texto del manual..."
    autocomplete="off"
    >
    <div id="resultados-buscador">
    <p class="aviso">Escribe algo para buscar...</p>
    </div>
    </div>
    `;
    const input = document.getElementById("buscador");
    if (input) {
        input.focus();
        if (input.value.trim()) {
            buscar(input.value);
        }
    }
}

// ============================================================
// Exportar funciones globales
// ============================================================

window.navegarA = navegarA;
window.volverAtras = volverAtras;
window.crearBotonVolver = crearBotonVolver;
window.abrirSeccion = abrirSeccion;
window.mostrarInicio = mostrarInicio;
