const cache_name = "photoshop-lite-cache";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cache_name)
      .then(cache => {
        cache.addAll([
          "/editor.html",
          "/scripts/workers/brightness.js",
          "/scripts/workers/edge.js",
          "/scripts/workers/mask.js",
          "/scripts/workers/toGray.js",
          "/scripts/workers/invert.js",
          "/scripts/index.js",
          "/scripts/accordion.js",
          "/scripts/listeners.js",
          "/scripts/toast.js",
          "/styles/index.css",
        ]);
      })
      .catch(err => {
        console.log("Error while adding files to cache!!");
      })
  )
});

self.addEventListener("activate", e => {
  console.log("activated!!...");
  console.log(e);
})

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