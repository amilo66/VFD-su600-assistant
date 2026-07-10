/* ============================================================
 S U600_WEB - Macros                *
 ============================================================ */

async function mostrarMacros() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando macros...</p>";

    try {
        const respuesta = await fetch("data/su600/macros.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar macros.json");
        const macros = await respuesta.json();

        contenido.innerHTML = "";

        const titulo = document.createElement("h1");
        titulo.textContent = "📋 Macros";
        contenido.appendChild(titulo);

        const intro = document.createElement("p");
        intro.textContent = "Configuraciones predefinidas para aplicaciones típicas. Pulsa sobre una macro para ver los parámetros que configura.";
        intro.style.color = "#666";
        contenido.appendChild(intro);

        macros.forEach(macro => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta macro-item";
            tarjeta.innerHTML = `
            <h3>${macro.nombre}</h3>
            <p class="macro-aplicacion">🎯 ${macro.aplicacion}</p>
            <p class="macro-desc">${macro.descripcion}</p>
            `;
            tarjeta.onclick = () => mostrarDetalleMacro(macro);
            contenido.appendChild(tarjeta);
        });

    } catch (error) {
        console.error(error);
        contenido.innerHTML = `
        <div class="tarjeta">
        <h2>Error</h2>
        <p>No se pudo cargar la lista de macros.</p>
        </div>
        `;
    }
}

function mostrarDetalleMacro(macro) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const volver = document.createElement("button");
    volver.textContent = "← Volver";
    volver.onclick = mostrarMacros;
    contenido.appendChild(volver);

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta macro-detalle";
    tarjeta.innerHTML = `
    <h2>${macro.nombre}</h2>
    <p class="macro-aplicacion">🎯 ${macro.aplicacion}</p>
    <p>${macro.descripcion}</p>

    <h3>⚙️ Parámetros configurados:</h3>
    <div class="macro-parametros">
    ${macro.parametros.map(p => `
        <div class="macro-param-item">
        <span class="macro-codigo">${p.codigo}</span>
        <span class="macro-valor">= ${p.valor}</span>
        <span class="macro-nota">— ${p.nota}</span>
        </div>
        `).join('')}
        </div>

        <div class="macro-acciones">
        <button onclick="abrirPdfPagina(${macro.pagina})">
        📖 Ver en manual (pág. ${macro.pagina})
        </button>
        </div>
        `;
        contenido.appendChild(tarjeta);
}

window.mostrarMacros = mostrarMacros;
