// Suba a VERSION toda vez que editar qualquer arquivo, senão o celular
// continua servindo a versão antiga do cache.
const VERSION = 'reino-v4.1.0';

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/estilo.css',
  './js/main.js',
  './js/config.js',
  './js/estado.js',
  './js/audio.js',
  './js/cenario.js',
  './js/festa.js',
  './js/icones.js',
  './js/princesa.js',
  './js/roupas.js',
  './js/guarda-roupa.js',
  './js/unicornio.js',
  './js/util.js',
  './js/jogos/cores.js',
  './js/jogos/contar.js',
  './js/jogos/memoria.js',
  './icones/icone.svg'
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(chaves.filter(c => c !== VERSION).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

// Cache primeiro: o jogo tem que abrir no avião, no carro, sem sinal.
self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;
  evento.respondWith(
    caches.match(req).then(achado => achado || fetch(req).then(resp => {
      if (resp && resp.ok && new URL(req.url).origin === location.origin) {
        const copia = resp.clone();
        caches.open(VERSION).then(c => c.put(req, copia));
      }
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
