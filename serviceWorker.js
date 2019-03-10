const cache_name = "photoshop-lite-cache";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cache_name)
      .then(cache => {
        cache.addAll([
          "/editor.html",
          "/assets/scripts/workers/brightness.js",
          "/assets/scripts/workers/edge.js",
          "/assets/scripts/workers/blur.js",
          "/assets/scripts/workers/toGray.js",
          "/assets/scripts/workers/invert.js",
          "/assets/scripts/index.js",
          "/assets/scripts/accordion.js",
          "/assets/scripts/listeners.js",
          "/assets/scripts/toast.js",
          "/assets/styles/index.css",
          "/favicon.ico"
        ]);
      })
      .catch(err => {
        console.log("Error while adding files to cache!!");
      })
  )
});

self.addEventListener("activate", e => {
  console.log("activated service worker!!...");
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