async function mostrarTerminales() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "🔌 Terminales y Cableado";
    contenido.appendChild(titulo);

    const instalacion = typeof getInstalacionActiva === 'function' ? getInstalacionActiva() : null;
    if (instalacion) {
        const info = document.createElement("p");
        info.textContent = `Cableado para: ${instalacion.nombre}`;
        info.className = "instalacion-info";
        contenido.appendChild(info);
    }

    // 1. Bloque de Control
    const tarjetaControl = document.createElement("div");
    tarjetaControl.className = "tarjeta";
    tarjetaControl.innerHTML = `
        <h3>️ Bloque de Control</h3>
        <div class="terminal-grid">
            <div class="terminal-item"><span class="t-label">10V</span><span class="t-desc">Alim. Potenciómetro</span></div>
            <div class="terminal-item"><span class="t-label">GND</span><span class="t-desc">Tierra Analógica</span></div>
            <div class="terminal-item"><span class="t-label">AI</span><span class="t-desc">Entrada Analógica</span></div>
            <div class="terminal-item"><span class="t-label">AO</span><span class="t-desc">Salida Analógica</span></div>
            <div class="terminal-item"><span class="t-label">485+</span><span class="t-desc">RS485 (A)</span></div>
            <div class="terminal-item"><span class="t-label">485-</span><span class="t-desc">RS485 (B)</span></div>
            <div class="terminal-item"><span class="t-label">X1</span><span class="t-desc">Entrada Dig. 1</span></div>
            <div class="terminal-item"><span class="t-label">X2</span><span class="t-desc">Entrada Dig. 2</span></div>
            <div class="terminal-item"><span class="t-label">X3</span><span class="t-desc">Entrada Dig. 3</span></div>
            <div class="terminal-item"><span class="t-label">X4</span><span class="t-desc">Entrada Dig. 4</span></div>
            <div class="terminal-item"><span class="t-label">COM</span><span class="t-desc">Común Entradas</span></div>
            <div class="terminal-item"><span class="t-label">TA / TC</span><span class="t-desc">Relé Salida</span></div>
        </div>
    `;
    contenido.appendChild(tarjetaControl);

    // 2. Jumpers
    const tarjetaJumpers = document.createElement("div");
    tarjetaJumpers.className = "tarjeta";
    tarjetaJumpers.innerHTML = `
        <h3>🔧 Configuración de Jumpers</h3>
        <p class="aviso">⚠️ Configurar SIEMPRE con la alimentación cortada.</p>
        <div class="jumper-list">
            <div class="jumper-item">
                <div class="jumper-name">J1 (Tierra Panel)</div>
                <div class="jumper-desc">ON: Tierra activada | OFF: Desconectado (Defecto)</div>
            </div>
            <div class="jumper-item">
                <div class="jumper-name">J2 (Salida AO)</div>
                <div class="jumper-desc">ON (AVO): 0-10V | OFF (ACO): 0-20mA</div>
            </div>
            <div class="jumper-item">
                <div class="jumper-name">J4 (Potenciómetro)</div>
                <div class="jumper-desc">ON (P-I): Interno (Teclado) | OFF (P-E): Externo (10V-AI-GND)</div>
            </div>
            <div class="jumper-item">
                <div class="jumper-name">J5 (Entrada AI)</div>
                <div class="jumper-desc">ON (AVI): 0-10V | OFF (ACI): 0-20mA</div>
            </div>
        </div>
    `;
    contenido.appendChild(tarjetaJumpers);

    // 3. Bloque de Potencia
    const tarjetaPotencia = document.createElement("div");
    tarjetaPotencia.className = "tarjeta";
    tarjetaPotencia.innerHTML = `
        <h3> Bloque de Potencia</h3>
        <div class="terminal-grid">
            <div class="terminal-item potencia"><span class="t-label">R / S / T</span><span class="t-desc">Entrada Red</span></div>
            <div class="terminal-item potencia"><span class="t-label">U / V / W</span><span class="t-desc">Salida Motor</span></div>
            <div class="terminal-item potencia"><span class="t-label">P+ / PB</span><span class="t-desc">Resistencia Frenado</span></div>
            <div class="terminal-item potencia"><span class="t-label">PE / G</span><span class="t-desc">Tierra de Protección</span></div>
        </div>
        <p class="nota-seguridad">🚫 NUNCA conectar la red eléctrica en U, V, W. Esperar 5-8 min tras cortar la luz.</p>
    `;
    contenido.appendChild(tarjetaPotencia);

    // 4. Notas de Cableado
    const codigoNota = "CABLEADO_NOTA";
    const notaGuardada = typeof obtenerNota === 'function' ? obtenerNota(codigoNota) : '';
    const textoBotonNota = notaGuardada ? `📝 Editar mi cableado (${notaGuardada.length} chars)` : '📝 Apuntar mi cableado';

    const tarjetaNotas = document.createElement("div");
    tarjetaNotas.className = "tarjeta";
    tarjetaNotas.innerHTML = `
        <h3>📝 Notas de mi Instalación</h3>
        ${notaGuardada ? `<div class="nota-preview"><p>${notaGuardada}</p></div>` : '<p style="color: var(--color-gris-500); font-style: italic;">Aún no has guardado notas. Apunta aquí qué has conectado en X1, X2, AI, etc.</p>'}
        <button id="btnNotaCableado" style="margin-top: 10px;">${textoBotonNota}</button>
    `;
    contenido.appendChild(tarjetaNotas);

    // 5. Botón y Chat IA
    const btnChatCableado = document.createElement("button");
    btnChatCableado.className = "btn-chat";
    btnChatCableado.textContent = "🤖 Preguntar a la IA sobre Cableado";
    btnChatCableado.style.marginTop = "20px";
    btnChatCableado.style.width = "100%";
    contenido.appendChild(btnChatCableado);

    const chatContainer = document.createElement("div");
    chatContainer.className = "chat-ia-container";
    chatContainer.style.display = "none";
    chatContainer.innerHTML = `
        <div class="chat-header">
            <h4>🤖 Asistente de Cableado</h4>
            <button class="btn-cerrar-chat">✕</button>
        </div>
        <div class="chat-mensajes" id="chat-mensajes-cableado">
            <div class="chat-mensaje ia">Hola. ¿Necesitas ayuda para conectar un sensor, configurar un jumper o cablear el RS485?</div>
        </div>
        <div class="chat-input-container">
            <input type="text" id="chat-input-cableado" placeholder="Ej: ¿Cómo conecto un sensor de 4-20mA?" class="chat-input">
            <button id="btn-enviar-cableado" class="btn-enviar-chat">Enviar</button>
        </div>
    `;
    contenido.appendChild(chatContainer);

    // --- LÓGICA DE EVENTOS ---

    // Notas
    const btnNotaCableado = document.getElementById('btnNotaCableado');
    if (btnNotaCableado) {
        btnNotaCableado.onclick = () => {
            if (typeof editarNota === 'function') {
                editarNota(codigoNota);
                setTimeout(() => mostrarTerminales(), 500); 
            }
        };
    }

    // Chat Abrir/Cerrar
    btnChatCableado.onclick = () => {
        chatContainer.style.display = 'block';
        chatContainer.scrollIntoView({ behavior: 'smooth' });
    };
    chatContainer.querySelector('.btn-cerrar-chat').onclick = () => {
        chatContainer.style.display = 'none';
    };

    // Chat Enviar
    const inputCableado = document.getElementById('chat-input-cableado');
    const btnEnviarCableado = document.getElementById('btn-enviar-cableado');
    const mensajesCableado = document.getElementById('chat-mensajes-cableado');

    const enviarMensajeCableado = async () => {
        const pregunta = inputCableado.value.trim();
        if (!pregunta) return;
        
        const apiKey = typeof obtenerApiKey === 'function' ? obtenerApiKey() : '';
        if (!apiKey) { alert('Configura tu API key de Groq primero.'); return; }
        
        mensajesCableado.innerHTML += `<div class="chat-mensaje usuario">${pregunta}</div>`;
        inputCableado.value = '';
        mensajesCableado.scrollTop = mensajesCableado.scrollHeight;
        
        inputCableado.disabled = true;
        btnEnviarCableado.disabled = true;
        btnEnviarCableado.textContent = '...';
        
        const indicador = document.createElement('div');
        indicador.className = 'chat-mensaje ia escribiendo';
        indicador.innerHTML = '<em>Revisando manual...</em>';
        mensajesCableado.appendChild(indicador);
        
        try {
            const respuesta = await pedirConsultaCableadoIA(pregunta);
            indicador.remove();
            mensajesCableado.innerHTML += `<div class="chat-mensaje ia">${respuesta.replace(/\n/g, '<br>')}</div>`;
        } catch (e) {
            indicador.remove();
            mensajesCableado.innerHTML += `<div class="chat-mensaje error">Error: ${e.message}</div>`;
        }
        
        inputCableado.disabled = false;
        btnEnviarCableado.disabled = false;
        btnEnviarCableado.textContent = 'Enviar';
        inputCableado.focus();
        mensajesCableado.scrollTop = mensajesCableado.scrollHeight;
    };

    btnEnviarCableado.onclick = enviarMensajeCableado;
    inputCableado.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensajeCableado();
    });
}

window.mostrarTerminales = mostrarTerminales;
