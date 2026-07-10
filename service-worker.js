const CACHE_NAME = 'su600-cache-v1';
const urlsToCache = [
    './',
'./index.html',
'./manifest.json',
'./css/variables.css',
'./css/style.css',
'./js/app.js',
'./js/router.js',
'./js/backup.js',
'./js/manual_datos.js',
'./js/mi_configuracion.js',
'./js/instalaciones.js',
'./js/vista_instalaciones.js',
'./js/favoritos.js',
'./js/fallos.js',
'./js/terminales.js',
'./js/modbus.js',
'./js/macros.js',
'./js/instalacion.js',
'./js/ia.js',
'./js/parametros.js',
'./js/buscador.js',
'./js/notas.js',
'./js/pdf.js',
'./js/ui.js',
'./data/menu.json'
];

// 1. Instalación: Guardar archivos en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Archivos cacheados');
            return cache.addAll(urlsToCache);
        })
    );
});

// 2. Peticiones: Responder desde caché si no hay internet
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Si está en caché, lo devuelve. Si no, lo pide a la red y lo guarda.
            if (response) {
                return response;
            }
            return fetch(event.request).then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});

// 3. Activación: Borrar cachés viejas si actualizamos la app
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
