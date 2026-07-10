async function mostrarInstalaciones() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "🏭 Mis Instalaciones";
    contenido.appendChild(titulo);

    const info = document.createElement("p");
    info.textContent = "Gestiona tus variadores y motores. Cada instalación tiene sus propios favoritos y notas.";
    info.className = "instalacion-info";
    contenido.appendChild(info);

    const instalacionActiva = getInstalacionActiva();
    const lista = typeof obtenerListaInstalaciones === 'function' ? obtenerListaInstalaciones() : [];

    // Botón para crear nueva
    const btnCrear = document.createElement("button");
    btnCrear.textContent = " Crear nueva instalación";
    btnCrear.className = "btn-crear";
    btnCrear.onclick = () => mostrarFormularioCrear(contenido);
    contenido.appendChild(btnCrear);

    // Botón para importar
    const btnImportar = document.createElement("button");
    btnImportar.textContent = "📥 Importar desde archivo";
    btnImportar.className = "btn-importar";
    btnImportar.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => importarInstalacion(e.target.files[0]);
        input.click();
    };
    contenido.appendChild(btnImportar);

    // Lista de instalaciones
    const grid = document.createElement("div");
    grid.className = "grid-instalaciones";

    lista.forEach(inst => {
        const esActiva = inst.id === instalacionActiva.id;
        const tarjeta = document.createElement("div");
        tarjeta.className = `tarjeta-instalacion ${esActiva ? 'activa' : ''}`;
        
        tarjeta.innerHTML = `
            <div class="cabecera-inst">
                <h3>${inst.nombre}</h3>
                ${esActiva ? '<span class="badge-activa">ACTIVA</span>' : ''}
            </div>
            <div class="datos-motor">
                <p><strong>Motor:</strong> ${inst.motor.potencia || '?'} kW | ${inst.motor.voltaje || '?'} V</p>
                <p><strong>Corriente:</strong> ${inst.motor.corriente || '?'} A | ${inst.motor.rpm || '?'} RPM</p>
            </div>
            <div class="acciones-inst">
                ${!esActiva ? `<button class="btn-activar" data-id="${inst.id}">Activar</button>` : ''}
                <button class="btn-exportar" data-id="${inst.id}">📤 Exportar</button>
                <button class="btn-eliminar" data-id="${inst.id}">🗑️ Borrar</button>
            </div>
        `;
        grid.appendChild(tarjeta);
    });

    contenido.appendChild(grid);

    // Conectar botones dinámicos
    document.querySelectorAll('.btn-activar').forEach(btn => {
        btn.onclick = () => cambiarInstalacion(btn.dataset.id);
    });
    document.querySelectorAll('.btn-exportar').forEach(btn => {
        btn.onclick = () => exportarInstalacion(btn.dataset.id);
    });
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.onclick = () => eliminarInstalacion(btn.dataset.id);
    });
}

function mostrarFormularioCrear(contenedor) {
    contenedor.innerHTML = "";
    
    const volver = document.createElement("button");
    volver.textContent = "← Volver";
    volver.onclick = mostrarInstalaciones;
    contenedor.appendChild(volver);

    const titulo = document.createElement("h2");
    titulo.textContent = "Nueva Instalación";
    contenedor.appendChild(titulo);

    const form = document.createElement("div");
    form.className = "tarjeta formulario-inst";
    form.innerHTML = `
        <div class="campo">
            <label>Nombre de la instalación (ej: Bomba Nave 1)</label>
            <input type="text" id="inst-nombre" placeholder="Mi Variador">
        </div>
        <h4>Datos del Motor (Opcional, para referencia)</h4>
        <div class="grid-campos">
            <div class="campo">
                <label>Potencia (kW)</label>
                <input type="number" id="inst-potencia" step="0.1">
            </div>
            <div class="campo">
                <label>Voltaje (V)</label>
                <input type="number" id="inst-voltaje">
            </div>
            <div class="campo">
                <label>Corriente (A)</label>
                <input type="number" id="inst-corriente" step="0.1">
            </div>
            <div class="campo">
                <label>Velocidad (RPM)</label>
                <input type="number" id="inst-rpm">
            </div>
        </div>
        <button id="btn-guardar-inst" class="btn-guardar">💾 Guardar y Activar</button>
    `;
    contenedor.appendChild(form);

    document.getElementById('btn-guardar-inst').onclick = () => {
        const nombre = document.getElementById('inst-nombre').value.trim();
        if (!nombre) { alert('Ponle un nombre a la instalación'); return; }
        
        const datosMotor = {
            potencia: document.getElementById('inst-potencia').value,
            voltaje: document.getElementById('inst-voltaje').value,
            corriente: document.getElementById('inst-corriente').value,
            rpm: document.getElementById('inst-rpm').value
        };
        
        crearInstalacion(nombre, datosMotor);
    };
}

window.mostrarInstalaciones = mostrarInstalaciones;
