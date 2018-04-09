const webPush = require('web-push');
const pushServerKeys = require('./pushServerKeys');
const pushClientSubscription = require('./pushClientSubscription');

console.log(pushServerKeys, pushClientSubscription);

webPush.setVapidDetails('mailto:mickael.lehoux@gmail.com', pushServerKeys.publicKey, pushServerKeys.privateKey);

const subscription = {
    endpoint: pushClientSubscription.endpoint,
    keys:{
        auth: pushClientSubscription.keys.auth,
        p256dh: pushClientSubscription.keys.p256dh
    }
}
webPush.sendNotification(subscription, "notification send from push node server :-)")
        .then(res => console.log("push notification was sent", res))
        .catch(err => console.error);