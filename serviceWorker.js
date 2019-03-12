const cache_name = "photoshop-lite-cache-v10";

self.addEventListener("install", e => {
  e.waitUntil(
    caches
      .open(cache_name)
      .then(cache => {
        cache.addAll([
          "/editor.html",
          "/index.html",
          "/assets/photos/d1.png",
          "/assets/photos/d2.png",
          "/favicon.ico",
          "/assets/styles/index.css",
          "/assets/scripts/workers/contrast.js",
          "/assets/scripts/workers/brightness.js",
          "/assets/scripts/workers/edge.js",
          "/assets/scripts/workers/blur.js",
          "/assets/scripts/workers/toGray.js",
          "/assets/scripts/workers/invert.js",
          "/assets/scripts/workers/allowOnly.js",
          "/assets/scripts/workers/toBinaryImage.js",
          "/assets/scripts/index.js",
          "/assets/scripts/accordion.js",
          "/assets/scripts/listeners.js",
          "/assets/scripts/toast.js"
        ]);
      })
      .catch(err => {
        console.log("Error while adding files to cache!!");
      })
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.indexOf(cache_name) === -1)
              return caches.delete(cacheName);
          })
        );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response)
        return response;

      return fetch(event.request)
      .then(function(response) {

        if (
          !response 
          || response.status !== 200 
          || response.type !== "basic"
        )
          return response;

        const responseToCache = response.clone();

        caches.open(cache_name).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
