/* ============================================================
 S U600_WEB - Mi instalación                  *
 ============================================================ */

const INSTALACION_KEY = 'su600_instalacion';

function obtenerInstalacion() {
    try {
        const data = localStorage.getItem(INSTALACION_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error leyendo instalación:', e);
        return null;
    }
}

function guardarInstalacion(datos) {
    try {
        localStorage.setItem(INSTALACION_KEY, JSON.stringify(datos));
    } catch (e) {
        console.error('Error guardando instalación:', e);
    }
}

async function mostrarInstalacion() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando instalación...</p>";

    let datos = obtenerInstalacion();

    if (!datos) {
        try {
            const respuesta = await fetch("data/su600/instalacion.json");
            if (respuesta.ok) {
                datos = await respuesta.json();
            } else {
                throw new Error("No se pudo cargar la plantilla");
            }
        } catch (e) {
            console.error(e);
            contenido.innerHTML = `
            <div class="tarjeta">
            <h2>Error</h2>
            <p>No se pudo cargar la plantilla de instalación.</p>
            </div>
            `;
            return;
        }
    }

    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "🏠 Mi Instalación";
    contenido.appendChild(titulo);

    const info = document.createElement("p");
    info.className = "instalacion-info";
    info.textContent = "Guarda los datos de tu motor, bomba y variador para tenerlos siempre a mano.";
    contenido.appendChild(info);

    const form = document.createElement("form");
    form.className = "instalacion-form";
    form.id = "form-instalacion";

    form.innerHTML = `
        <fieldset>
        <legend>⚡ Motor</legend>
        <div class="form-grid">
        <div class="form-field">
        <label>Potencia (kW):</label>
        <input type="text" name="motor.potencia_kw" value="${datos.motor.potencia_kw || ''}" placeholder="Ej: 2.2">
        </div>
        <div class="form-field">
        <label>Potencia (CV):</label>
        <input type="text" name="motor.potencia_cv" value="${datos.motor.potencia_cv || ''}" placeholder="Ej: 3">
        </div>
        <div class="form-field">
        <label>Voltaje (V):</label>
        <input type="text" name="motor.voltaje_v" value="${datos.motor.voltaje_v || ''}" placeholder="Ej: 400">
        </div>
        <div class="form-field">
        <label>Corriente (A):</label>
        <input type="text" name="motor.corriente_a" value="${datos.motor.corriente_a || ''}" placeholder="Ej: 5.7">
        </div>
        <div class="form-field">
        <label>RPM:</label>
        <input type="text" name="motor.rpm" value="${datos.motor.rpm || ''}" placeholder="Ej: 1450">
        </div>
        <div class="form-field">
        <label>Frecuencia (Hz):</label>
        <input type="text" name="motor.frecuencia_hz" value="${datos.motor.frecuencia_hz || '50'}" placeholder="50">
        </div>
        <div class="form-field">
        <label>Factor de potencia (cos φ):</label>
        <input type="text" name="motor.factor_potencia" value="${datos.motor.factor_potencia || ''}" placeholder="Ej: 0.85">
        </div>
        <div class="form-field full-width">
        <label>Tipo de motor:</label>
        <input type="text" name="motor.tipo" value="${datos.motor.tipo || ''}" placeholder="Ej: Trifásico jaula ardilla">
        </div>
        </div>
        </fieldset>

        <fieldset>
        <legend>🔧 Bomba / Carga</legend>
        <div class="form-grid">
        <div class="form-field">
        <label>Tipo:</label>
        <input type="text" name="bomba.tipo" value="${datos.bomba.tipo || ''}" placeholder="Ej: Centrífuga">
        </div>
        <div class="form-field">
        <label>Caudal (m³/h):</label>
        <input type="text" name="bomba.caudal_m3h" value="${datos.bomba.caudal_m3h || ''}" placeholder="Ej: 15">
        </div>
        <div class="form-field">
        <label>Altura manométrica (m):</label>
        <input type="text" name="bomba.altura_m" value="${datos.bomba.altura_m || ''}" placeholder="Ej: 25">
        </div>
        <div class="form-field">
        <label>Presión (bar):</label>
        <input type="text" name="bomba.presion_bar" value="${datos.bomba.presion_bar || ''}" placeholder="Ej: 2.5">
        </div>
        <div class="form-field full-width">
        <label>Notas:</label>
        <textarea name="bomba.notas" rows="3">${datos.bomba.notas || ''}</textarea>
        </div>
        </div>
        </fieldset>

        <fieldset>
        <legend>🎛️ Variador</legend>
        <div class="form-grid">
        <div class="form-field">
        <label>Modelo:</label>
        <input type="text" name="variador.modelo" value="${datos.variador.modelo || 'SU-600'}" placeholder="SU-600">
        </div>
        <div class="form-field">
        <label>Potencia (kW):</label>
        <input type="text" name="variador.potencia_kw" value="${datos.variador.potencia_kw || ''}" placeholder="Ej: 2.2">
        </div>
        <div class="form-field">
        <label>Voltaje entrada (V):</label>
        <input type="text" name="variador.voltaje_entrada_v" value="${datos.variador.voltaje_entrada_v || ''}" placeholder="Ej: 230">
        </div>
        <div class="form-field">
        <label>Ubicación:</label>
        <input type="text" name="variador.ubicacion" value="${datos.variador.ubicacion || ''}" placeholder="Ej: Cuadro eléctrico nave 1">
        </div>
        <div class="form-field">
        <label>Fecha de instalación:</label>
        <input type="date" name="variador.fecha_instalacion" value="${datos.variador.fecha_instalacion || ''}">
        </div>
        <div class="form-field full-width">
        <label>Notas:</label>
        <textarea name="variador.notas" rows="3">${datos.variador.notas || ''}</textarea>
        </div>
        </div>
        </fieldset>

        <fieldset>
        <legend>📋 Información general</legend>
        <div class="form-grid">
        <div class="form-field">
        <label>Cliente:</label>
        <input type="text" name="general.cliente" value="${datos.general.cliente || ''}" placeholder="Ej: Talleres Martínez">
        </div>
        <div class="form-field">
        <label>Proyecto:</label>
        <input type="text" name="general.proyecto" value="${datos.general.proyecto || ''}" placeholder="Ej: Bomba pozo">
        </div>
        <div class="form-field full-width">
        <label>Notas generales:</label>
        <textarea name="general.notas" rows="4">${datos.general.notas || ''}</textarea>
        </div>
        </div>
        </fieldset>

        <div class="instalacion-acciones">
        <button type="submit" class="btn-guardar">💾 Guardar todo</button>
        <button type="button" class="btn-limpiar" id="btn-limpiar">🗑️ Borrar todo</button>
        </div>
        `;

        contenido.appendChild(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const nuevosDatos = {
                motor: {},
                bomba: {},
                variador: {},
                general: {}
            };

            formData.forEach((valor, clave) => {
                const [seccion, campo] = clave.split('.');
                nuevosDatos[seccion][campo] = valor;
            });

            guardarInstalacion(nuevosDatos);

            const mensaje = document.createElement("div");
            mensaje.className = "mensaje-exito";
            mensaje.textContent = "✅ Datos guardados correctamente";
            contenido.insertBefore(mensaje, form);

            setTimeout(() => mensaje.remove(), 3000);
            console.log('💾 Instalación guardada:', nuevosDatos);
        });

        document.getElementById('btn-limpiar').onclick = () => {
            if (confirm('¿Seguro que quieres borrar todos los datos de la instalación?')) {
                localStorage.removeItem(INSTALACION_KEY);
                mostrarInstalacion();
            }
        };
}

window.mostrarInstalacion = mostrarInstalacion;
