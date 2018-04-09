const technosDiv = document.querySelector('#technos');

function loadTechnologies() {
    fetch('https://nodetestapi-thyrrtzgdz.now.sh/technos')
        .then(response => response.json())
        .then(technos => {
            console.log('response from loadTechnologies', technos);
            // mongodb is unreachable by node is, so cache is not used when on localhost
            if (technos.keys().count === 0) {
                allTechnos = ['Serveur accessible mais MongoDB inacessible'];
            }
            const allTechnos = technos.map(t => `<div class="ml-3"><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
                .join('');

            technosDiv.innerHTML = allTechnos;
        })
        .catch (err => console.error);
}

loadTechnologies();

if (navigator.serviceWorker) {
    navigator.serviceWorker.register("sw.js")
        .then(registration => {
            //Public vapid key generated with web-push
            const publicKey = "BAewYTIsBvSZwtMpZegwmd_AXqi3p0GWl27X_USr9-NHpT_wE4yngtIYoqqwcpwdPWrRr7JS3qtO6ugBqtotvkQ";
            registration.pushManager.getSubscription().then(subscription => {
                if (subscription) {
                    console.log('subscription : ', subscription);
                    extractKeysFromArrayBuffer(subscription);
                    return subscription;
                } else {
                    //ask to subscribe to FCM
                    const convertedKey = urlBase64ToUint8Array(publicKey);
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedKey
                    })
                        .then(newSubscription => {
                            console.log("new subcription : ", newSubscription);
                            extractKeysFromArrayBuffer(subscription);
                            return subscription;
                        })
                }
            })
        })
        .catch(err => console.error);

}

function extractKeysFromArrayBuffer(subscription) {
    // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
    const keyArrayBuffer = subscription.getKey('p256dh');
    const authArrayBuffer = subscription.getKey('auth');
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
    console.log('p256dh key : ', keyArrayBuffer, p256dh);
    console.log('auth key : ', authArrayBuffer, auth);
}

//Webpush key converter
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/*
//Non persistante notification
if(window.Notification && window.Notification !== "denied"){
    Notification.requestPermission(perm => {
        if(perm === "granted"){
            const options = {
                body: "je suis le body de la notif",
                icon: "images/icons/icon-72x72.png"
            };
            const notif = new Notification("Hello notification", options);
        } else {
            console.log("autorisation de recevoir des notifications  a été refusée.")
        }
    });
}*/