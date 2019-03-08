const cache_name = "photoshop-lite-cache";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cache_name)
      .then(cache => {
        cache.addAll([
          "/scripts/workers/brightness.js",
          "/scripts/workers/edge.js",
          "/scripts/workers/mask.js",
          "/scripts/workers/toGray.js",
          "/scripts/workers/invert.js",
          "/styles/index.css",
          "/styles/slider.css",
          "/styles/checkbox.css",
          "/styles/accordion.css",
          "/scripts/index.js",
          "/scripts/accordion.js",
          "/scripts/listeners.js",
          "/scripts/toast.js"
        ]);
      })
      .catch(err => {
        console.log("Error while adding files to cache");
      })
  )
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches
    .match(e.request)
    .then(resp => {
      if(!resp)
        return fetch(e.request);
      return resp;
    })
  );
});