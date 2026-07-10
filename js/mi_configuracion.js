/*============================================================
 SU600_WEB* - Mi Configuración (parámetros en español)
 ============================================================ */

async function mostrarMiConfiguracion() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando configuración...</p>";

    if (typeof listaParametrosCompleta === 'undefined') {
        contenido.innerHTML = '<p class="aviso">Error: No se pudo cargar la configuración.</p>';
        return;
    }

    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "⚙️ Mi Configuración";
    contenido.appendChild(titulo);

    const grupos = {};
    listaParametrosCompleta.forEach(param => {
        const grupoId = param.codigo.substring(0, 3);
        if (!grupos[grupoId]) grupos[grupoId] = [];
        grupos[grupoId].push(param);
    });

    Object.keys(grupos).sort().forEach(grupoId => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta grupo-config";
        tarjeta.innerHTML = `
        <h2>${grupoId}</h2>
        <p>${grupos[grupoId].length} parámetros</p>
        `;
        tarjeta.onclick = () => mostrarGrupoConfig(grupoId, grupos[grupoId]);
        contenido.appendChild(tarjeta);
    });
}

function mostrarGrupoConfig(grupoId, parametros) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const volver = document.createElement("button");
    volver.textContent = "← Volver";
    volver.onclick = mostrarMiConfiguracion;
    contenido.appendChild(volver);

    const titulo = document.createElement("h1");
    titulo.textContent = `Grupo ${grupoId}`;
    contenido.appendChild(titulo);

    parametros.forEach(param => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta parametro-config";
        tarjeta.innerHTML = `
        <h3>${param.codigo}</h3>
        <p class="nombre-param">${param.nombre}</p>
        <div class="valores">
        <div class="valor-item">
        <span class="label">Tu valor:</span>
        <strong class="tu-valor">${param.tu_valor}</strong>
        </div>
        <div class="valor-item">
        <span class="label">Fábrica:</span>
        <span>${param.defecto}</span>
        </div>
        </div>
        `;
        tarjeta.onclick = () => mostrarDetalleConfig(param);
        contenido.appendChild(tarjeta);
    });
}

function mostrarDetalleConfig(param) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const volver = document.createElement("button");
    volver.textContent = "← Volver";
    volver.onclick = () => {
        const grupoId = param.codigo.substring(0, 3);
        const parametros = listaParametrosCompleta.filter(p => p.codigo.startsWith(grupoId));
        mostrarGrupoConfig(grupoId, parametros);
    };
    contenido.appendChild(volver);

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta detalle-config";
    tarjeta.innerHTML = `
    <h2>${param.codigo}</h2>
    <h3>${param.nombre}</h3>

    <div class="detalle-seccion">
    <div class="detalle-item">
    <span class="label">Tu valor:</span>
    <strong class="tu-valor">${param.tu_valor}</strong>
    </div>
    <div class="detalle-item">
    <span class="label">Valor de fábrica:</span>
    <span>${param.defecto}</span>
    </div>
    <div class="detalle-item">
    <span class="label">Rango permitido:</span>
    <span>${param.rango}</span>
    </div>
    </div>

    ${param.notas ? `
        <div class="detalle-seccion notas">
        <h4>📝 Notas:</h4>
        <p>${param.notas}</p>
        </div>
        ` : ''}

        <div class="detalle-acciones">
        <button onclick="abrirPdfPagina(${param.pagina_pdf})">
        📖 Ver en manual (pág. ${param.pagina_pdf})
        </button>
        </div>
        `;
        contenido.appendChild(tarjeta);
}

window.mostrarMiConfiguracion = mostrarMiConfiguracion;
