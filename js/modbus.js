/* ============================================================
 S U600_WEB - Modbus RTU            *
 ============================================================ */

async function mostrarModbus() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando información Modbus...</p>";

    try {
        const respuesta = await fetch("data/su600/modbus.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar modbus.json");
        const datos = await respuesta.json();

        contenido.innerHTML = "";

        const titulo = document.createElement("h1");
        titulo.textContent = "🔌 Modbus RTU";
        contenido.appendChild(titulo);

        // ===== AÑADIR BOTÓN Y CHAT DE IA AL FINAL DE LA VISTA MODBUS =====
        const contenedorPrincipal = document.getElementById("contenido");

        // 1. Crear el botón
        const btnChatModbus = document.createElement("button");
        btnChatModbus.className = "btn-chat";
        btnChatModbus.textContent = " Preguntar a la IA sobre Modbus";
        btnChatModbus.style.marginTop = "20px";
        btnChatModbus.style.width = "100%";
        contenedorPrincipal.appendChild(btnChatModbus);

        // 2. Crear el contenedor del chat (oculto)
        const chatContainer = document.createElement("div");
        chatContainer.className = "chat-ia-container";
        chatContainer.style.display = "none";
        chatContainer.innerHTML = `
        <div class="chat-header">
        <h4>🤖 Asistente Modbus RTU</h4>
        <button class="btn-cerrar-chat">✕</button>
        </div>
        <div class="chat-mensajes" id="chat-mensajes-modbus">
        <div class="chat-mensaje ia">Hola. Soy experto en Modbus del SU-600. ¿Necesitas que te calcule una trama, te explique un registro o te ayude a leer la frecuencia?</div>
        </div>
        <div class="chat-input-container">
        <input type="text" id="chat-input-modbus" placeholder="Ej: ¿Qué trama envío para arrancar el motor?" class="chat-input">
        <button id="btn-enviar-modbus" class="btn-enviar-chat">Enviar</button>
        </div>
        `;
        contenedorPrincipal.appendChild(chatContainer);

        // 3. Lógica para abrir/cerrar
        btnChatModbus.onclick = () => {
            chatContainer.style.display = 'block';
            chatContainer.scrollIntoView({ behavior: 'smooth' });
        };
        chatContainer.querySelector('.btn-cerrar-chat').onclick = () => {
            chatContainer.style.display = 'none';
        };

        // 4. Lógica para enviar mensajes
        const inputModbus = document.getElementById('chat-input-modbus');
        const btnEnviarModbus = document.getElementById('btn-enviar-modbus');
        const mensajesModbus = document.getElementById('chat-mensajes-modbus');

        const enviarMensajeModbus = async () => {
            const pregunta = inputModbus.value.trim();
            if (!pregunta) return;

            const apiKey = typeof obtenerApiKey === 'function' ? obtenerApiKey() : '';
            if (!apiKey) {
                alert('Primero configura tu API key de Groq en "🤖 Configuración IA"');
                return;
            }

            mensajesModbus.innerHTML += `<div class="chat-mensaje usuario">${pregunta}</div>`;
            inputModbus.value = '';
            mensajesModbus.scrollTop = mensajesModbus.scrollHeight;

            inputModbus.disabled = true;
            btnEnviarModbus.disabled = true;
            btnEnviarModbus.textContent = '...';

            const indicador = document.createElement('div');
            indicador.className = 'chat-mensaje ia escribiendo';
            indicador.innerHTML = '<em>Calculando trama...</em>';
            mensajesModbus.appendChild(indicador);

            try {
                const respuesta = await pedirConsultaModbusIA(pregunta);
                indicador.remove();
                // Usamos innerHTML para que si la IA devuelve código hex, se vea bien
                mensajesModbus.innerHTML += `<div class="chat-mensaje ia">${respuesta.replace(/\n/g, '<br>')}</div>`;
            } catch (e) {
                indicador.remove();
                mensajesModbus.innerHTML += `<div class="chat-mensaje error">Error: ${e.message}</div>`;
            }

            inputModbus.disabled = false;
            btnEnviarModbus.disabled = false;
            btnEnviarModbus.textContent = 'Enviar';
            inputModbus.focus();
            mensajesModbus.scrollTop = mensajesModbus.scrollHeight;
        };

        btnEnviarModbus.onclick = enviarMensajeModbus;
        inputModbus.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensajeModbus();
        });

        // Protocolo
        const proto = document.createElement("div");
        proto.className = "tarjeta modbus-info";
        proto.innerHTML = `
        <h3>📡 Protocolo</h3>
        <p><strong>${datos.protocolo}</strong></p>
        <p>Baudrates: ${datos.baudrates.join(", ")}</p>
        <p>Formato: ${datos.formato}</p>
        `;
        contenido.appendChild(proto);

        // Funciones
        const funcs = document.createElement("div");
        funcs.className = "tarjeta modbus-info";
        funcs.innerHTML = `
        <h3>🔧 Códigos de función</h3>
        ${datos.funciones.map(f => `
            <div class="funcion-item">
            <strong>${f.codigo}</strong> - ${f.nombre}
            <p>${f.descripcion}</p>
            </div>
            `).join('')}
            `;
            contenido.appendChild(funcs);

            // Registros
            const regs = document.createElement("div");
            regs.className = "tarjeta modbus-registros";
            regs.innerHTML = `
            <h3>📊 Registros principales</h3>
            <div class="registros-grid">
            ${datos.registros.map(r => `
                <div class="registro-item">
                <div class="registro-direccion">${r.direccion}</div>
                <div class="registro-nombre">${r.nombre}</div>
                <div class="registro-tipo">${r.tipo}</div>
                <div class="registro-desc">${r.descripcion}</div>
                </div>
                `).join('')}
                </div>
                `;
                contenido.appendChild(regs);

                // Parámetros
                const params = document.createElement("div");
                params.className = "tarjeta modbus-info";
                params.innerHTML = `
                <h3>⚙️ Parámetros accesibles</h3>
                ${datos.parametros.map(p => `
                    <div class="param-item">
                    <strong>${p.rango}</strong> → ${p.direccion_base}
                    <p>${p.descripcion}</p>
                    </div>
                    `).join('')}
                    `;
                    contenido.appendChild(params);

                    // Botón manual
                    const acciones = document.createElement("div");
                    acciones.className = "modbus-acciones";
                    acciones.innerHTML = `
                    <button onclick="abrirPdfPagina(${datos.pagina_pdf})">
                    📖 Ver en manual (pág. ${datos.pagina_pdf})
                    </button>
                    `;
                    contenido.appendChild(acciones);

    } catch (error) {
        console.error(error);
        contenido.innerHTML = `
        <div class="tarjeta">
        <h2>Error</h2>
        <p>No se pudo cargar la información Modbus.</p>
        </div>
        `;
    }
}

window.mostrarModbus = mostrarModbus;
