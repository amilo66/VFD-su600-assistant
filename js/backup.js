async function mostrarBackup() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "💾 Copia de Seguridad";
    contenido.appendChild(titulo);

    const info = document.createElement("p");
    info.textContent = "Guarda o restaura TODOS los datos de la app (instalaciones, favoritos, notas, configuración IA) en un solo archivo.";
    info.className = "instalacion-info";
    contenido.appendChild(info);

    // 1. Botón Exportar
    const tarjetaExportar = document.createElement("div");
    tarjetaExportar.className = "tarjeta";
    tarjetaExportar.innerHTML = `
        <h3>📤 Exportar Copia de Seguridad</h3>
        <p>Descarga un archivo JSON con todos tus datos actuales. Guárdalo en un lugar seguro (Dropbox, USB, etc.).</p>
        <button id="btn-exportar-backup" class="btn-exportar-backup">💾 Descargar Copia de Seguridad</button>
    `;
    contenido.appendChild(tarjetaExportar);

    // 2. Botón Importar
    const tarjetaImportar = document.createElement("div");
    tarjetaImportar.className = "tarjeta";
    tarjetaImportar.innerHTML = `
        <h3> Restaurar Copia de Seguridad</h3>
        <p>⚠️ <strong>Atención:</strong> Esto sobrescribirá todos los datos actuales de la app con los del archivo que selecciones.</p>
        <button id="btn-importar-backup" class="btn-importar-backup">📂 Seleccionar archivo para restaurar</button>
        <input type="file" id="input-importar-backup" accept=".json" style="display: none;">
    `;
    contenido.appendChild(tarjetaImportar);

    // 3. Botón Borrar Todo (Zona peligrosa)
    const tarjetaBorrar = document.createElement("div");
    tarjetaBorrar.className = "tarjeta tarjeta-peligro";
    tarjetaBorrar.innerHTML = `
        <h3>🗑️ Borrar Todos los Datos</h3>
        <p>Elimina todas las instalaciones, favoritos, notas y configuración. La app volverá a su estado inicial.</p>
        <button id="btn-borrar-todo" class="btn-borrar-todo"> Borrar Todo y Reiniciar</button>
    `;
    contenido.appendChild(tarjetaBorrar);

    // --- Lógica de Exportar ---
    document.getElementById('btn-exportar-backup').onclick = () => {
        const backup = {
            version: "1.0",
            fecha: new Date().toISOString(),
            datos: {}
        };

        // Recopilar todas las claves de localStorage que empiecen por 'su600_'
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('su600_')) {
                backup.datos[key] = localStorage.getItem(key);
            }
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        const fechaStr = new Date().toISOString().split('T')[0];
        downloadAnchorNode.setAttribute("download", `SU600_Backup_Completo_${fechaStr}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // --- Lógica de Importar ---
    const btnImportar = document.getElementById('btn-importar-backup');
    const inputImportar = document.getElementById('input-importar-backup');

    btnImportar.onclick = () => inputImportar.click();

    inputImportar.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!confirm('⚠️ ¿Seguro que quieres restaurar esta copia? Se borrarán los datos actuales y se reemplazarán por los del archivo.')) {
            inputImportar.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                if (!backup.datos) throw new Error('Formato de archivo inválido.');

                // Borrar datos antiguos de la app
                const clavesABorrar = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('su600_')) {
                        clavesABorrar.push(key);
                    }
                }
                clavesABorrar.forEach(key => localStorage.removeItem(key));

                // Restaurar datos del backup
                for (const [key, value] of Object.entries(backup.datos)) {
                    localStorage.setItem(key, value);
                }

                alert('✅ Copia de seguridad restaurada correctamente. La página se recargará.');
                location.reload();

            } catch (err) {
                alert('❌ Error al importar: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    // --- Lógica de Borrar Todo ---
    document.getElementById('btn-borrar-todo').onclick = () => {
        if (confirm(' ¿ESTÁS SEGURO? Esto borrará TODAS tus instalaciones, favoritos y notas. Esta acción no se puede deshacer.')) {
            if (confirm('Última confirmación: ¿Realmente quieres borrar todo?')) {
                const clavesABorrar = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('su600_')) {
                        clavesABorrar.push(key);
                    }
                }
                clavesABorrar.forEach(key => localStorage.removeItem(key));
                alert('Datos borrados. Recargando...');
                location.reload();
            }
        }
    };
}

window.mostrarBackup = mostrarBackup;
