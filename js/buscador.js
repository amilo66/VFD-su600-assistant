/* ============================================================
 S U600_WEB - Buscador con filtros*
 ============================================================ */

const BuscadorState = {
    parametros: [],
    manual: [],
    ultimoTermino: '',
    ultimoResultados: { parametros: [], manual: [] },
    cargado: { parametros: false, manual: false },
    filtros: {
        grupo: 'todos',          // 'todos', 'F0', 'F1', ..., 'F9'
        paginaMin: null,          // número de página mínimo (manual)
        paginaMax: null,          // número de página máximo (manual)
        soloNotas: false,
        soloFavoritos: false
    }
};

/* ---------- Utilidades ---------- */

function crearRegex(termino) {
    if (!termino) return null;
    const patron = termino.split('').map(c => {
        if (/[.*+?^${}()|[\]\\]/.test(c)) return '\\' + c;
        return c;
    }).join('\\s*');
    return new RegExp(patron, 'gi');
}

function escaparHtml(s) {
    return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resaltar(texto, termino) {
    if (!texto || !termino) return escaparHtml(texto || '');
    const escaped = escaparHtml(texto);
    const regex = crearRegex(termino);
    return escaped.replace(regex, '<mark>$&</mark>');
}

function obtenerFragmento(texto, termino) {
    if (!texto || !termino) return texto ? texto.substring(0, 250) : '';
    const regex = crearRegex(termino);
    const match = regex.exec(texto);
    const TAM = 250;
    const mitad = Math.floor(TAM / 2);
    let inicio, fin;
    if (!match) {
        inicio = 0;
        fin = Math.min(TAM, texto.length);
    } else {
        inicio = Math.max(0, match.index - mitad);
        fin = Math.min(texto.length, match.index + match[0].length + mitad);
    }
    let frag = texto.substring(inicio, fin).trim();
    if (inicio > 0) frag = '…' + frag;
    if (fin < texto.length) frag = frag + '…';
    return frag;
}

/* ---------- Carga de datos ---------- */

async function cargarParametros() {
    if (BuscadorState.cargado.parametros) return;
    const archivos = [];
    for (let i = 0; i <= 9; i++) {
        archivos.push(`data/su600/parametros/F${i}.json`);
    }
    const resultados = await Promise.all(
        archivos.map(async (url) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return [];
                const data = await res.json();
                const lista = Array.isArray(data) ? data : (data.parametros || []);
                // Detectar grupo desde la ruta: "data/.../F3.json" -> "F3"
                const match = url.match(/\/(F\d+)\.json$/);
                const grupo = match ? match[1] : '';
                return lista.map(p => ({
                    codigo: p.codigo || '',
                    texto: p.texto || p.nombre || p.descripcion || '',
                    grupo: p.grupo || grupo,
                    archivo: url
                }));
            } catch (e) {
                return [];
            }
        })
    );
    BuscadorState.parametros = resultados.flat();
    BuscadorState.cargado.parametros = true;
    console.log('✅ Parámetros cargados:', BuscadorState.parametros.length);
}

async function cargarManual() {
    if (BuscadorState.cargado.manual) return;
    try {
        const res = await fetch('tools/output/db/manual_index.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const paginas = data.paginas || [];
        BuscadorState.manual = paginas.map(p => ({
            pagina: p.pagina,
            texto: p.texto || ''
        }));
        BuscadorState.cargado.manual = true;
        console.log('✅ Manual cargado:', BuscadorState.manual.length, 'páginas');
    } catch (e) {
        console.error('Error cargando manual:', e);
        BuscadorState.manual = [];
        BuscadorState.cargado.manual = true;
    }
}

/* ---------- Búsqueda ---------- */

async function buscar(termino) {
    termino = (termino || '').trim();
    BuscadorState.ultimoTermino = termino;
    await Promise.all([cargarParametros(), cargarManual()]);
    const regex = crearRegex(termino);

    const resParam = termino
    ? BuscadorState.parametros.filter(p => {
        regex.lastIndex = 0;
        return regex.test(p.codigo) || regex.test(p.texto);
    })
    : [];

    const resManual = termino
    ? BuscadorState.manual
    .filter(p => {
        regex.lastIndex = 0;
        return regex.test(p.texto);
    })
    .map(p => ({
        pagina: p.pagina,
        texto: p.texto,
        fragmento: obtenerFragmento(p.texto, termino)
    }))
    : [];

    BuscadorState.ultimoResultados = {
        parametros: resParam,
        manual: resManual
    };
    return BuscadorState.ultimoResultados;
}

/* ---------- Filtros ---------- */

function actualizarFiltro(nombre, valor) {
    BuscadorState.filtros[nombre] = valor;
    // Refrescar la vista del tab activo
    const tabActivo = document.querySelector('.tab-activo');
    if (tabActivo?.id === 'tab-manual') {
        mostrarResultadosManual();
    } else {
        mostrarResultadosParametros();
    }
}

function aplicarFiltrosParametros(lista) {
    const f = BuscadorState.filtros;
    return lista.filter(p => {
        // Filtro de grupo
        if (f.grupo !== 'todos' && p.grupo !== f.grupo) return false;

        // Filtro "Solo notas": requiere obtenerNota
        if (f.soloNotas) {
            if (typeof obtenerNota === 'function' && !obtenerNota(p.codigo)) return false;
        }

        // Filtro "Solo favoritos": requiere esFavorito
        if (f.soloFavoritos) {
            if (typeof esFavorito === 'function' && !esFavorito(p.codigo)) return false;
        }

        return true;
    });
}

function aplicarFiltrosManual(lista) {
    const f = BuscadorState.filtros;
    return lista.filter(p => {
        // Filtro de rango de páginas
        if (f.paginaMin !== null && p.pagina < f.paginaMin) return false;
        if (f.paginaMax !== null && p.pagina > f.paginaMax) return false;
        return true;
    });
}

/* ---------- Render ---------- */

function mostrarResultadosParametros() {
    const contenedor = document.getElementById('resultados-buscador');
    if (!contenedor) return;
    const term = BuscadorState.ultimoTermino;
    const listaCompleta = BuscadorState.ultimoResultados.parametros;
    const lista = aplicarFiltrosParametros(listaCompleta);

    document.getElementById('tab-parametros')?.classList.add('tab-activo');
    document.getElementById('tab-manual')?.classList.remove('tab-activo');

    if (!term) {
        contenedor.innerHTML = '<p class="aviso">Escribe algo para buscar...</p>';
        return;
    }
    if (lista.length === 0) {
        const filtroActivo = listaCompleta.length > 0;
        contenedor.innerHTML = filtroActivo
        ? `<p class="aviso">Hay <b>${listaCompleta.length}</b> resultados, pero los filtros actuales no muestran ninguno. <button class="btn-reset-filtros" onclick="resetFiltros()">🔄 Quitar filtros</button></p>`
        : `<p class="aviso">Sin resultados en parámetros para "<b>${escaparHtml(term)}</b>".</p>`;
        return;
    }
    const html = lista.map(p => `
    <div class="resultado parametro">
    <div class="codigo">${resaltar(p.codigo, term)} <span class="grupo-tag">${p.grupo}</span></div>
    <div class="descripcion">${resaltar(p.texto, term)}</div>
    </div>
    `).join('');

    const info = listaCompleta.length !== lista.length
    ? `<p class="info-filtro">Mostrando <b>${lista.length}</b> de ${listaCompleta.length} resultados</p>`
    : '';

    contenedor.innerHTML = `<h3>Parámetros (${lista.length})</h3>${info}<div class="lista-resultados">${html}</div>`;
}

function mostrarResultadosManual() {
    const contenedor = document.getElementById('resultados-buscador');
    if (!contenedor) return;
    const term = BuscadorState.ultimoTermino;
    const listaCompleta = BuscadorState.ultimoResultados.manual;
    const lista = aplicarFiltrosManual(listaCompleta);

    document.getElementById('tab-manual')?.classList.add('tab-activo');
    document.getElementById('tab-parametros')?.classList.remove('tab-activo');

    if (!term) {
        contenedor.innerHTML = '<p class="aviso">Escribe algo para buscar...</p>';
        return;
    }
    if (lista.length === 0) {
        const filtroActivo = listaCompleta.length > 0;
        contenedor.innerHTML = filtroActivo
        ? `<p class="aviso">Hay <b>${listaCompleta.length}</b> resultados, pero los filtros actuales no muestran ninguno. <button class="btn-reset-filtros" onclick="resetFiltros()">🔄 Quitar filtros</button></p>`
        : `<p class="aviso">Sin resultados en el manual para "<b>${escaparHtml(term)}</b>".</p>`;
        return;
    }
    const html = lista.map(r => `
    <div class="resultado manual" data-pagina="${r.pagina}" role="button" tabindex="0">
    <div class="pagina">Página ${r.pagina}</div>
    <div class="fragmento">${resaltar(r.fragmento, term)}</div>
    </div>
    `).join('');

    const info = listaCompleta.length !== lista.length
    ? `<p class="info-filtro">Mostrando <b>${lista.length}</b> de ${listaCompleta.length} resultados</p>`
    : '';

    contenedor.innerHTML = `<h3>Manual (${lista.length})</h3>${info}<div class="lista-resultados">${html}</div>`;

    contenedor.querySelectorAll('.resultado.manual').forEach(el => {
        el.addEventListener('click', () => abrirPdfPagina(el.dataset.pagina));
    });
}

function resetFiltros() {
    BuscadorState.filtros = {
        grupo: 'todos',
        paginaMin: null,
        paginaMax: null,
        soloNotas: false,
        soloFavoritos: false
    };
    // Resetear los controles del HTML si existen
    const select = document.getElementById('filtro-grupo');
    if (select) select.value = 'todos';
    const min = document.getElementById('filtro-pagina-min');
    if (min) min.value = '';
    const max = document.getElementById('filtro-pagina-max');
    if (max) max.value = '';
    const notas = document.getElementById('filtro-notas');
    if (notas) notas.checked = false;
    const favs = document.getElementById('filtro-favoritos');
    if (favs) favs.checked = false;

    const tabActivo = document.querySelector('.tab-activo');
    if (tabActivo?.id === 'tab-manual') {
        mostrarResultadosManual();
    } else {
        mostrarResultadosParametros();
    }
}

function abrirPdfPagina(numPagina) {
    const url = `manual/VARIADOR DE FRECUENCIA SU-600.pdf#page=${numPagina}`;
    window.open(url, '_blank');
}

/* ---------- Inicialización ---------- */

function iniciarBuscador() {
    document.addEventListener('input', async (e) => {
        if (e.target.id === 'buscador') {
            clearTimeout(window._buscadorTimer);
            window._buscadorTimer = setTimeout(async () => {
                await buscar(e.target.value);
                const tabActivo = document.querySelector('.tab-activo');
                if (tabActivo?.id === 'tab-manual') {
                    mostrarResultadosManual();
                } else {
                    mostrarResultadosParametros();
                }
            }, 200);
        }
    });
    cargarParametros();
    cargarManual();
}

window.iniciarBuscador = iniciarBuscador;
window.buscar = buscar;
window.mostrarResultadosParametros = mostrarResultadosParametros;
window.mostrarResultadosManual = mostrarResultadosManual;
window.abrirPdfPagina = abrirPdfPagina;
window.actualizarFiltro = actualizarFiltro;
window.resetFiltros = resetFiltros;
