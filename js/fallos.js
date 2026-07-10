let listaFallos = [];

async function cargarFallos() {
    if (listaFallos.length > 0) return listaFallos;
    try {
        const res = await fetch('data/su600/fallos.json');
        if (res.ok) {
            listaFallos = await res.json();
            return listaFallos;
        }
    } catch (e) {
        console.error('Error cargando fallos:', e);
    }
    return [];
}

async function mostrarFallos() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando fallos...</p>";

    await cargarFallos();

    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "⚠️ Alarmas y Fallos";
    contenido.appendChild(titulo);

    const info = document.createElement("p");
    info.textContent = "Pulsa sobre un código para ver causas, soluciones y consultar a la IA.";
    info.className = "instalacion-info";
    contenido.appendChild(info);

    // Buscador de fallos
    const buscador = document.createElement("input");
    buscador.type = "text";
    buscador.placeholder = "🔍 Buscar fallo (ej: ESC1, sobretensión...)";
    buscador.className = "buscador-fallos";
    buscador.id = "buscador-fallos";
    contenido.appendChild(buscador);

    const lista = document.createElement("div");
    lista.id = "lista-fallos";
    contenido.appendChild(lista);

    const renderizarLista = (filtro = "") => {
        lista.innerHTML = "";
        const textoFiltro = filtro.toLowerCase();
        
        const fallosFiltrados = listaFallos.filter(f => 
            f.codigo.toLowerCase().includes(textoFiltro) || 
            f.nombre.toLowerCase().includes(textoFiltro)
        );

        if (fallosFiltrados.length === 0) {
            lista.innerHTML = '<p class="aviso">No se encontraron fallos con ese nombre.</p>';
            return;
        }

        fallosFiltrados.forEach(fallo => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta fallo-item";
            tarjeta.innerHTML = `
                <h3 class="fallo-codigo">${fallo.codigo}</h3>
                <p class="fallo-nombre">${fallo.nombre}</p>
            `;
            tarjeta.onclick = () => mostrarDetalleFallo(fallo);
            lista.appendChild(tarjeta);
        });
    };

    renderizarLista();

    buscador.addEventListener('input', (e) => {
        renderizarLista(e.target.value);
    });
}

async function mostrarDetalleFallo(fallo) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const volver = document.createElement("button");
    volver.textContent = "← Volver a la lista";
    volver.onclick = mostrarFallos;
    contenido.appendChild(volver);

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    let html = `
        <h2 class="fallo-codigo-grande">${fallo.codigo}</h2>
        <h3>${fallo.nombre}</h3>

        <div class="fallo-seccion causa">
            <h4> Posibles causas:</h4>
            <ul>
                ${fallo.causas.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>

        <div class="fallo-seccion solucion">
            <h4>🛠️ Soluciones del manual:</h4>
            <ul>
                ${fallo.soluciones.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>

        <div class="param-acciones">
            <button id="btnChatIA" class="btn-chat">🤖 Diagnosticar con IA</button>
        </div>

        <div id="chat-ia-container" class="chat-ia-container" style="display: none;">
            <div class="chat-header">
                <h4> Asistente de diagnóstico para ${fallo.codigo}</h4>
                <button id="btn-cerrar-chat" class="btn-cerrar-chat">✕</button>
            </div>
            <div id="chat-mensajes" class="chat-mensajes">
                <div class="chat-mensaje ia">Hola. Veo que tienes el fallo <strong>${fallo.codigo}</strong>. ¿Qué síntomas observas o qué estabas haciendo cuando ocurrió?</div>
            </div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Describe el problema..." class="chat-input">
                <button id="btn-enviar-chat" class="btn-enviar-chat">Enviar</button>
            </div>
        </div>
    `;

    tarjeta.innerHTML = html;
    contenido.appendChild(tarjeta);

    // Conectar botón de chat
    const btnChatIA = document.getElementById('btnChatIA');
    const chatContainer = document.getElementById('chat-ia-container');
    const btnCerrarChat = document.getElementById('btn-cerrar-chat');
    
    if (btnChatIA && chatContainer) {
        btnChatIA.onclick = () => {
            chatContainer.style.display = 'block';
            chatContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
    }
    
    if (btnCerrarChat && chatContainer) {
        btnCerrarChat.onclick = () => {
            chatContainer.style.display = 'none';
        };
    }

    // Lógica del chat de diagnóstico
    const btnEnviarChat = document.getElementById('btn-enviar-chat');
    const chatInput = document.getElementById('chat-input');
    
    if (btnEnviarChat && chatInput) {
        const enviarMensaje = async () => {
            const pregunta = chatInput.value.trim();
            if (!pregunta) return;
            
            const apiKey = typeof obtenerApiKey === 'function' ? obtenerApiKey() : '';
            if (!apiKey) {
                alert('Primero configura tu API key de Groq en "🤖 Configuración IA"');
                return;
            }
            
            const mensajesDiv = document.getElementById('chat-mensajes');
            mensajesDiv.innerHTML += `<div class="chat-mensaje usuario">${pregunta}</div>`;
            chatInput.value = '';
            mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
            
            // Contexto específico para diagnóstico de fallos
            const contexto = `
FALLO: ${fallo.codigo} - ${fallo.nombre}

CAUSAS POSIBLES SEGÚN EL MANUAL:
${fallo.causas.map((c, i) => `${i+1}. ${c}`).join('\n')}

SOLUCIONES OFICIALES DEL MANUAL:
${fallo.soluciones.map((s, i) => `${i+1}. ${s}`).join('\n')}
            `.trim();
            
            chatInput.disabled = true;
            btnEnviarChat.disabled = true;
            btnEnviarChat.textContent = '';
            
            const indicador = document.createElement('div');
            indicador.className = 'chat-mensaje ia escribiendo';
            indicador.innerHTML = '<em>Analizando fallo...</em>';
            mensajesDiv.appendChild(indicador);
            mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
            
            try {
                // Usamos una función específica para diagnóstico
                const respuesta = await pedirDiagnosticoIA(pregunta, contexto);
                indicador.remove();
                mensajesDiv.innerHTML += `<div class="chat-mensaje ia">${respuesta.replace(/\n/g, '<br>')}</div>`;
            } catch (e) {
                indicador.remove();
                mensajesDiv.innerHTML += `<div class="chat-mensaje error">Error: ${e.message}</div>`;
            }
            
            chatInput.disabled = false;
            btnEnviarChat.disabled = false;
            btnEnviarChat.textContent = 'Enviar';
            chatInput.focus();
            mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
        };
        
        btnEnviarChat.onclick = enviarMensaje;
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensaje();
        });
    }
}

// Función específica para diagnóstico de fallos
async function pedirDiagnosticoIA(pregunta, contexto) {
    const apiKey = obtenerApiKey();
    if (!apiKey) throw new Error('No hay API key');

    const prompt = `Eres un técnico experto en variadores de frecuencia SU-600. Estás ayudando a un usuario a diagnosticar un fallo.

DATOS DEL FALLO:
${contexto}

PREGUNTA/OBSERVACIÓN DEL USUARIO: ${pregunta}

INSTRUCCIONES:
1. Basándote SOLO en las causas y soluciones del manual proporcionadas arriba.
2. Dale una respuesta clara, práctica y paso a paso sobre cómo diagnosticar y solucionar el problema.
3. Si el usuario menciona síntomas específicos, indícale cuál de las causas del manual es la más probable.
4. Recuérdale las precauciones de seguridad (esperar 5-8 minutos tras cortar la alimentación).
5. Máximo 150 palabras.`;

    // Reutilizamos la función de Groq con reintentos
    if (typeof llamarGroqConReintentos === 'function') {
        return await llamarGroqConReintentos(apiKey, [{ role: 'user', content: prompt }]);
    } else {
        // Fallback si la función no está cargada
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.5, max_tokens: 300 })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No se pudo obtener respuesta';
    }
}

window.mostrarFallos = mostrarFallos;
