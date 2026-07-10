// Este script lee dinámicamente la base de datos cargada desde 'js/parametros.js'

document.addEventListener("DOMContentLoaded", () => {

    const inputBuscar = document.getElementById("buscar");

    if (!inputBuscar) return;

    inputBuscar.addEventListener("input", async (evento) => {

        const texto = evento.target.value.trim().toLowerCase();

        if (texto.length < 2) return;

        console.log("Buscar:", texto);

    });

});

    // Escuchamos en tiempo real lo que tecleas en el input de búsqueda con id "buscar"
    const inputBuscar = document.getElementById("buscar");
    if (inputBuscar) {
        inputBuscar.addEventListener("input", (evento) => {
            const textoBusqueda = evento.target.value.toLowerCase().trim();

            // Filtramos la lista buscando coincidencias en códigos (ej: P00) o en el texto explicativo
            const filtrados = listaParametrosCompleta.filter(parametro => {
                return parametro.codigo.toLowerCase().includes(textoBusqueda) ||
                parametro.nombre.toLowerCase().includes(textoBusqueda);
            });

            mostrarResultados(filtrados);
        });
    }
});

// Función para pintar las tarjetas visuales dentro del contenedor <main id="contenido">
function mostrarResultados(parametros) {
    const contenedor = document.getElementById("contenido");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (parametros.length === 0) {
        contenedor.innerHTML = `
        <div style="text-align:center; padding:40px; color:#777; font-size:16px; font-family:sans-serif;">
        🔍 No se encontró ningún parámetro que coincida con la búsqueda.
        </div>`;
        return;
    }

    parametros.forEach(param => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        // Estilos limpios aplicados directamente para asegurar visibilidad óptima
        tarjeta.style.borderLeft = "5px solid #1565c0";
        tarjeta.style.padding = "15px";
        tarjeta.style.marginBottom = "15px";
        tarjeta.style.background = "#ffffff";
        tarjeta.style.borderRadius = "8px";
        tarjeta.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";

        tarjeta.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-family:sans-serif;">
        <strong style="color:#1565c0; font-size:20px;">🟢 ${param.codigo}</strong>
        <span style="font-size:12px; background:#e0e0e0; padding:4px 8px; border-radius:12px; font-weight:bold; color:#444;">Manual pág. ${param.pagina_pdf}</span>
        </div>
        <div style="font-weight:bold; margin-bottom:12px; font-size:16px; color:#222; line-height:1.4; font-family:sans-serif;">${param.nombre}</div>

        <div style="font-size:13px; background:#f9f9f9; padding:10px; border-radius:6px; margin-bottom:10px; line-height: 1.5; border: 1px solid #eee; font-family:sans-serif;">
        <strong>Opciones / Rango:</strong> <span style="color:#444;">${param.rango}</span><br>
        <strong style="margin-top:4px; display:inline-block;">Por defecto de fábrica:</strong> <span style="color:#666;">${param.defecto}</span>
        </div>

        <div style="font-size:14px; background:#e3f2fd; padding:10px; border-radius:6px; border:1px dashed #1565c0; margin-bottom:10px; font-family:sans-serif;">
        <strong>Tu valor configurado:</strong> <span style="color:#0d47a1; font-weight:bold; font-size:15px;">${param.tu_valor}</span>
        </div>

        <div style="font-size:13px; color:#555; font-style:italic; background:#fffde7; padding:8px; border-radius:4px; border-left:3px solid #fbc02d; font-family:sans-serif;">
        📝 <strong>Notas técnicas:</strong> ${param.notas}
        </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}
