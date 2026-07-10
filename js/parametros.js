let traduccionesCache = null;

async function cargarTraducciones() {
    if (traduccionesCache) return traduccionesCache;
    try {
        const res = await fetch('data/su600/traducciones.json');
        if (res.ok) {
            traduccionesCache = await res.json();
            return traduccionesCache;
        }
    } catch (e) {
        console.error('Error cargando traducciones:', e);
    }
    return {};
}

function obtenerTraduccion(codigo) {
    return traduccionesCache?.[codigo] || null;
}

function abrirPdfPagina(pagina) {
    if (pagina) {
        window.open(`data/su600/manual.pdf#page=${pagina}`, '_blank');
    } else {
        alert('No hay página disponible para este parámetro');
    }
}

async function mostrarParametros() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando...</p>";

    await cargarTraducciones();

    const respuesta = await fetch("data/su600/grupos/grupos.json");
    const grupos = await respuesta.json();

    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "️ Parámetros";
    contenido.appendChild(titulo);

    grupos.forEach(grupo => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        tarjeta.innerHTML = `
            <h2>${grupo.id}</h2>
            <strong>${grupo.titulo}</strong>
            <p>${grupo.descripcion}</p>
        `;

        tarjeta.onclick = () => cargarGrupo(grupo.id);
        contenido.appendChild(tarjeta);
    });
}

async function cargarGrupo(idGrupo) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando parámetros...</p>";

    await cargarTraducciones();

    const respuesta = await fetch(`data/su600/parametros/${idGrupo}.json`);
    const parametros = await respuesta.json();

    contenido.innerHTML = "";

    const volver = document.createElement("button");
    volver.textContent = "← Volver";
    volver.onclick = mostrarParametros;
    contenido.appendChild(volver);

    const titulo = document.createElement("h1");
    titulo.textContent = idGrupo;
    contenido.appendChild(titulo);

    parametros.forEach(parametro => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        const trad = obtenerTraduccion(parametro.codigo);
        const nombreMostrar = trad ? trad.nombre_es : (parametro.nombre || parametro.codigo);
        const tieneTraduccion = !!trad;

        tarjeta.innerHTML = `
            <h3>${nombreMostrar} ${tieneTraduccion ? '<span class="badge-trad">ES</span>' : ''}</h3>
            <p class="codigo-original">${parametro.codigo}</p>
            <p class="nombre-en">${parametro.nombre || ''}</p>
        `;

        tarjeta.onclick = () => mostrarParametro(idGrupo, parametro);
        contenido.appendChild(tarjeta);
    });
}

async function mostrarParametro(idGrupo, parametro) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    await cargarTraducciones();

    const volver = document.createElement("button");
    volver.textContent = "← Volver";
    volver.onclick = () => cargarGrupo(idGrupo);
    contenido.appendChild(volver);

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    const trad = obtenerTraduccion(parametro.codigo);
    const esFav = typeof esFavorito === 'function' ? esFavorito(parametro.codigo) : false;
    const textoBotonFav = esFav ? '⭐️ Quitar favorito' : '⭐ Añadir a favoritos';
    const tieneNota = typeof obtenerNota === 'function' ? obtenerNota(parametro.codigo) : '';
    const textoBotonNota = tieneNota ? `📝 Editar nota (${tieneNota.length} chars)` : '📝 Añadir nota';

    const explicacionCache = typeof obtenerExplicacionCache === 'function' ? obtenerExplicacionCache(parametro.codigo) : null;

    let html = `<h2>${parametro.codigo}</h2>`;

    // Mostrar traducción si existe
    if (trad) {
        html += `
            <div class="param-bilingue">
                <div class="param-es">
                    <h3 class="param-nombre-es">${trad.nombre_es}</h3>
                    <p class="param-explicacion-es">${trad.explicacion_es}</p>
                </div>
                <details class="param-en">
                    <summary>Ver texto original en inglés</summary>
                    <p class="nombre-en-original">${parametro.nombre || ''}</p>
                </details>
            </div>
        `;
    } else {
        html += `<h3 class="nombre-en">${parametro.nombre || ''}</h3>`;
    }

    // Mostrar rango y valor de fábrica
    if (parametro.rango || parametro.fabrica) {
        html += `<div class="param-info">`;
        if (parametro.rango) {
            html += `<div class="info-item"><span class="label">Rango:</span> <strong>${parametro.rango}</strong></div>`;
        }
        if (parametro.fabrica) {
            html += `<div class="info-item"><span class="label">Fábrica:</span> <strong>${parametro.fabrica}</strong></div>`;
        }
        html += `</div>`;
    }

    // Mostrar opciones si existen
    if (parametro.opciones && parametro.opciones.length > 0) {
        html += `
            <div class="opciones-container">
                <h4>Opciones:</h4>
                <table class="opciones-tabla">
                    <thead>
                        <tr>
                            <th>Valor</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        parametro.opciones.forEach(op => {
            html += `
                <tr>
                    <td class="opcion-valor">${op.valor}</td>
                    <td class="opcion-desc">${op.descripcion}</td>
                </tr>
            `;
        });
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }

    // Mostrar nota si existe
    if (tieneNota) {
        html += `
            <div class="nota-preview">
                <strong>📝 Tu nota:</strong>
                <p>${tieneNota}</p>
            </div>
        `;
    }

    // Mostrar explicación IA si está en caché
    if (explicacionCache) {
        html += `
            <div class="explicacion-ia">
                <strong>🤖 Explicación de la IA:</strong>
                <p>${explicacionCache.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    // Botones de acción
    html += `
        <div class="param-acciones">
            <button id="btnFavorito">${textoBotonFav}</button>
            <button id="btnNota">${textoBotonNota}</button>
            <button id="btnIA" class="btn-ia">🤖 Explicar con IA</button>
            <button id="btnManual" class="btn-manual">📖 Ver en manual (pág. ${parametro.pagina_pdf || '?'})</button>
            <button id="btnChatIA" class="btn-chat">💬 Preguntar a la IA</button>
        </div>
    `;

    // Contenedor del chat (oculto por defecto)
    html += `
        <div id="chat-ia-container" class="chat-ia-container" style="display: none;">
            <div class="chat-header">
                <h4>💬 Chat con IA sobre ${parametro.codigo}</h4>
                <button id="btn-cerrar-chat" class="btn-cerrar-chat">✕</button>
            </div>
            <div id="chat-mensajes" class="chat-mensajes">
                <div class="chat-mensaje ia">Hola, soy tu asistente del variador SU-600. ¿Qué quieres saber sobre ${parametro.codigo}?</div>
            </div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Escribe tu pregunta..." class="chat-input">
                <button id="btn-enviar-chat" class="btn-enviar-chat">Enviar</button>
            </div>
        </div>
    `;

    tarjeta.innerHTML = html;
    contenido.appendChild(tarjeta);

    // ===== Conectar botones =====

    // Botón Favorito
    const btnFav = document.getElementById('btnFavorito');
    if (btnFav) {
        btnFav.onclick = () => {
            if (typeof toggleFavorito === 'function') {
                toggleFavorito(parametro.codigo, parametro.nombre || parametro.texto);
                mostrarParametro(idGrupo, parametro);
            }
        };
    }

    // Botón Nota
    const btnNota = document.getElementById('btnNota');
    if (btnNota) {
        btnNota.onclick = () => {
            if (typeof editarNota === 'function') {
                editarNota(parametro.codigo);
            }
        };
    }

    // Botón Explicar con IA
    const btnIA = document.getElementById('btnIA');
    if (btnIA && typeof pedirExplicacionIA === 'function') {
        btnIA.onclick = async () => {
            const apiKey = typeof obtenerApiKey === 'function' ? obtenerApiKey() : '';
            if (!apiKey) {
                alert('Primero configura tu API key de Groq en " Configuración IA"');
                return;
            }

            btnIA.disabled = true;
            btnIA.textContent = '⏳ Consultando IA...';

            try {
                // Construir contexto completo
                let contexto = `CÓDIGO: ${parametro.codigo}\n`;
                contexto += `NOMBRE: ${parametro.nombre || 'N/A'}\n`;
                if (trad) {
                    contexto += `TRADUCCIÓN: ${trad.nombre_es}\n`;
                    contexto += `EXPLICACIÓN: ${trad.explicacion_es}\n`;
                }
                if (parametro.rango) contexto += `RANGO: ${parametro.rango}\n`;
                if (parametro.fabrica) contexto += `VALOR DE FÁBRICA: ${parametro.fabrica}\n`;
                if (parametro.opciones && parametro.opciones.length > 0) {
                    contexto += `\nOPCIONES DISPONIBLES:\n`;
                    parametro.opciones.forEach(op => {
                        contexto += `  - Valor ${op.valor}: ${op.descripcion}\n`;
                    });
                }

                await pedirExplicacionIA(parametro.codigo, parametro.nombre || parametro.texto, contexto);
                mostrarParametro(idGrupo, parametro);
            } catch (e) {
                alert('Error: ' + e.message);
                btnIA.disabled = false;
                btnIA.textContent = '🤖 Explicar con IA';
            }
        };
    } else if (btnIA) {
        btnIA.style.display = 'none';
    }

    // Botón Ver en manual
    const btnManual = document.getElementById('btnManual');
    if (btnManual) {
        btnManual.onclick = () => {
            abrirPdfPagina(parametro.pagina_pdf);
        };
    }

    // Botón Preguntar a la IA (abre el chat)
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

    // Chat: enviar mensaje
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
            
            // Construir contexto completo del parámetro
            let contexto = `CÓDIGO: ${parametro.codigo}\n`;
            contexto += `NOMBRE: ${parametro.nombre || 'N/A'}\n`;
            if (trad) {
                contexto += `TRADUCCIÓN: ${trad.nombre_es}\n`;
                contexto += `EXPLICACIÓN: ${trad.explicacion_es}\n`;
            }
            if (parametro.rango) contexto += `RANGO: ${parametro.rango}\n`;
            if (parametro.fabrica) contexto += `VALOR DE FÁBRICA: ${parametro.fabrica}\n`;
            if (parametro.opciones && parametro.opciones.length > 0) {
                contexto += `\nOPCIONES DISPONIBLES:\n`;
                parametro.opciones.forEach(op => {
                    contexto += `  - Valor ${op.valor}: ${op.descripcion}\n`;
                });
            }
            
            // Deshabilitar input mientras espera
            chatInput.disabled = true;
            btnEnviarChat.disabled = true;
            btnEnviarChat.textContent = '';
            
            // Indicador de "escribiendo..."
            const indicador = document.createElement('div');
            indicador.className = 'chat-mensaje ia escribiendo';
            indicador.innerHTML = '<em>Escribiendo...</em>';
            mensajesDiv.appendChild(indicador);
            mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
            
            try {
                const respuesta = await pedirExplicacionIAChat(pregunta, contexto);
                indicador.remove();
                mensajesDiv.innerHTML += `<div class="chat-mensaje ia">${respuesta.replace(/\n/g, '<br>')}</div>`;
            } catch (e) {
                indicador.remove();
                mensajesDiv.innerHTML += `<div class="chat-mensaje error">Error: ${e.message}</div>`;
            }
            
            // Rehabilitar input
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
