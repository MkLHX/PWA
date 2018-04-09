const cacheName = "veille-techno-1.2";
self.addEventListener("install", evt => {
    console.log(`sw installed at ${new Date().toLocaleTimeString()}`);
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            "index.html",
            "main.js",
            "vendors/bootstrap4.min.css",
            'style.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
            .then(console.log('cache initialized!'))
            .catch(console.err);
    });

    evt.waitUntil(cachePromise);

});
self.addEventListener("activate", evt => {
    console.log("activate evt", evt);
    let cacheCleanedPromise = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        })
    });
    evt.waitUntil(cacheCleanedPromise);
});
self.addEventListener("fetch", evt => {
    /*     if (!navigator.onLine) {
            const headers = { headers: { "Content-Type": "text/html; charset=utf-8" } };
            evt.respondWith(new Response("<h1>No internet connection</h1>", headers));
        } */

    //Strategy cache first and network fallback
    /*     evt.respondWith(
            caches.match(evt.request).then(res => {
                if (res) {
                    console.log('fetching url from cache '+evt.request.url, res);
                    return res;
                }
                return fetch(evt.request).then(newResponse => {
                    console.log('fetching url on network and caching '+evt.request.url, newResponse);
                    caches.open(cacheName).then(cache => cache.put(evt.request, newResponse));
                    return newResponse.clone();
                })
            })
        ); */

    //Strategy network first and cache fallback
    evt.respondWith(
        fetch(evt.request).then(res => {
            console.log(evt.request.url + ' fetch from network');
            caches.open(cacheName).then(cache => cache.put(evt.request, res));
            return res.clone();
        }).catch(err => {
            console.log(evt.request.url + ' fetch from cache');
            return caches.match(evt.request);
        })
    );
});
/*
//Persistante notification from SW
self.registration.showNotification("Persist notification", {
    body: "i'm a persistante notification from sw",
    actions: [
        {action: "accept", title: "accept"},
        {action: "refuse", title:"refus"}
    ]
});

//Listen notification close event
self.addEventListener("notificationclose", evt => {
    console.log ("notification fermée", evt);
});

//Listen click events on notification
self.addEventListener("notificationclick", evt => {
    if(evt.action === "accept"){
        console.log("accept clicked!");
    } else if (evt.action === "refuse"){
        console.log("refuse clicked!");
    } else {
        console.log("notification clicked!");
    }
    evt.notification.close();
});*/

//Push interception from server push
self.addEventListener("push", evt => {
    console.log("push event", evt);
    console.log("push text : ", evt.data.text());
    const title = evt.data.text();
    const options = { body: "hello world", image: "images/icons/icon-128x128.png" };
    evt.waitUntil(self.registration.showNotification(title, options));
});