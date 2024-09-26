let CACHE_NAME = "appV1";
const cachedResources = [
  '/index.html',
  '/static/css/main.7065dd3d.css ',
  '/static/js/main.a776e038.js',
  'https://mediasea.net/',
  '/manifest.json',
  '/favicon.ico',
  '/userBooks',
  'https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Languages.svg',
  'https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Books.svg',
  'https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Interactive.svg',
  'https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Customized+Profiles.svg',
  'https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Enhanced+Learning+Tools.svg',
  'https://redsea-books-assets.s3.eu-central-1.amazonaws.com/redsea-02.png',
  ]
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(cachedResources);
    })
  );
});


self.addEventListener("message", (event) => {
  if (event.data && event.data.action === 'addResourceToCache') {
    const { url } = event.data;
    caches.open(CACHE_NAME).then((cache) => {
      fetch(url).then((response) => {
        cache.put(url, response);
      });
    });
  }
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Fetch the resource from the network
        return fetch(event.request)
          .then(networkResponse => {
            // Check if the network response is valid (status 200) and the content is different from the cached response
            if (networkResponse.status === 200 && networkResponse !== cachedResponse) {
              // Cache the updated response
              const clonedResponse = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, clonedResponse);
                });
            }
            // Return the network response
            return networkResponse;
          })
          .catch(() => {
            // If fetching from the network fails, return the cached response
            return cachedResponse || caches.match('/offline.html');
          });
      })
  );
});