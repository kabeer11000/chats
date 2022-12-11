/** Kabeer's Network Authors, chats-serviceworker v 2.4.0:1 **/
const isLocalhost = true // self.location.host.split(":")[0] === "localhost";
importScripts("/binaries/svg2png-wasm@1.3.4/dist/index.min.js");
const NotificationTypes = {
    "Conversation.Message": "kn.chats.conversation.text.notification",
    "Conversation.Call": "kn.chats.conversation.call.notification",
    "General": "kn.chats.general.notification",
    "Action": "kn.chats.action.notification",
};
const VERSION = `2.4.0`;
const Log = (...args) => console.log(`[Chats Service Worker] @ ${VERSION} \n`, ...args);
const assetManifest = {
    "cache": {
        "version": "2.4.0",
        "key": "kn.chats.webcache." + "2.4.0:2",
        "files": ["/files/call_tune.mp3", "https://cdn.glitch.global/77b4c993-589e-4e39-8500-f03fc9765209/5c2f93a6-9329-426a-806b-587ddcf6a517.notification-badge.png?v=1663437251523", "/images/icon-512-maskable.png", "/images/icon-512.png", "/favicon.ico", "/images/broken-image.jpeg", "/_offline", "/binaries/svg2png_wasm_bg.wasm", "/binaries/svg2png-wasm@1.3.4/dist/index.min.js"]
    }
};
self.addEventListener("install", async function (event) {
    Log("Service Worker up and running: installation ID: 🤙", event);
    event.waitUntil((async () => {
        const expired = (await caches.keys())
        for (const cache of expired) await caches.delete(cache);
        Log(`%c [Cache Manager] Deleted All Cached Data: ${expired.length}`, 'background: #222; color: white')
        Log('[Cache Manager] Refreshing caches');
        const cache = await caches.open(assetManifest.cache.key);
        // const chunks = await fetch("/api/assets");
        await cache.addAll(assetManifest.cache.files);
    })());
    self.skipWaiting();
});

self.addEventListener("activate", (event) => event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ("navigationPreload" in self.registration) await self.registration.navigationPreload.enable();
    // Tell the active service worker to take control of the page immediately.
    await self.clients.claim();
})()));

const isClientFocused = () => self.clients.matchAll({type: 'window', includeUncontrolled: true})
    .then((windowClients) => {
        let clientIsFocused = false;
        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.focused) {
                clientIsFocused = true;
                break;
            }
        }
        return clientIsFocused;
    });

self.addEventListener("fetch", (e) => {
    const allowedDomains = [self.location.host, "mrdoob.github.io", "cdn.glitch.global", "console.re", "kabeers-papers-pdf2image.000webhostapp.com"];
    const url = new URL(e.request.url);
    const intercept = async () => {
        const r = await caches.match(e.request);
        Log(`[Request Interceptor]: Fetching resource: ${e.request.url}`);
        if (r) {
            Log(`[Request Interceptor]: Serving from cache`);
            return r;
        }
        if (!["http:", "https:"].includes(url.protocol)) return;
        const response = await fetch(e.request);
        const cache = await caches.open(assetManifest.cache.key);
        Log(`[Request Interceptor]: Caching new resource: ${e.request.url}`);
        await cache.put(e.request, response.clone());
        return response;
    }
    if (url.host === self.location.host && url.pathname === "/internal-sw-version-info") return e.respondWith(new Response(JSON.stringify(assetManifest)));
    if (url.host === self.location.host && url.pathname === "/internal-sw-delete-cache") return e.respondWith(caches.delete(assetManifest.cache.key).then(() => new Response("complete")));
    if (!isLocalhost && allowedDomains.includes(url.host) && !(["cors"].includes(e.request.mode)) && (e.request.method === "GET")) {
        Log("[Request Interceptor]: Intercepted Request");
        e.respondWith(intercept());
    }
    // If our "if()" condition is false, then this fetch handler won't
    // intercept the request. If there are any other fetch handlers
    // registered, they will get a chance to call event.respondWith().
    // If no fetch handlers call event.respondWith(), the request
    // will be handled by the browser as if there were no service
    // worker involvement.
});
const wasmPromise = svg2pngWasm.initialize(fetch('/binaries/svg2png_wasm_bg.wasm'))
const uploadFile = async (blob) => {
    const file = new File([blob], "image.png")
    const formdata = new FormData();
    formdata.append("file", file, file.name);
    return await fetch("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/upload.php?branch=icon-badges", {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    }).then(r => r.json());
}
const blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => reader.onloadend = () => resolve(reader.result));
};

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = _e => resolve(reader.result);
        reader.onerror = _e => reject(reader.error);
        reader.onabort = _e => reject(new Error("Read aborted"));
        reader.readAsDataURL(blob);
    });
}

async function makeBadge(imageURL) {
    const imageBase64Url = await blobToBase64(await (await fetch(imageURL)).blob());
    const svg = `
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z" fill="url(#pattern0)"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M150 200C177.614 200 200 177.614 200 150C200 122.386 177.614 100 150 100C122.386 100 100 122.386 100 150C100 177.614 122.386 200 150 200Z" fill="url(#pattern1)"/>
            <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_203_29" transform="scale(0.015625)"/>
                </pattern>
                <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image1_203_29" transform="scale(0.00520833)"/>
                </pattern>
                <image id="image0_203_29" class="avatar-image" width="64" height="64" xlink:href="data:${imageBase64Url}"/>
                <image id="image1_203_29" width="192" height="192" xlink:href="data:image/png;base64,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"/>
            </defs>
        </svg>`;
    await wasmPromise;
    const svg2png = svg2pngWasm.createSvg2png();
    const blob = new Blob([await svg2png(svg, {scale: 1})], {type: 'image/png'});
    return blobToDataURL(blob);
    // TODO No Need to Upload Image Files to Show Notifications;
    // const {file} = await uploadFile(blob);
    // return file.url;
}

/**
 * @param notification {{subscriptions: *, payload: {data: {message: string, previewImage: *}, chat: {id: *, url: string}, user: {name: *, photo: *, id: *}}, type: string}}
 */
const MessageNotificationHandler = async (notification) => {
    const {user, chat, data} = notification.payload;// {tag: chat.id}
    const notifications = (await self.registration.getNotifications({tag: chat.id})).reverse(); // .filter(({data: {chat: {id}}}) => id === chat.id)
    Log("Text Notification Received")
    if (await isClientFocused()) return Log("Notification rejected, client is focused");
    await self.registration.showNotification(
        notifications.length ? `${notifications[0].data.c + 1} new messages from ${user.name}` : user.name, {
            body: (notifications.length ? data.message + "\n" + notifications.map(({body}) => body).join("\n") : data.message),
            image: data.previewImage,
            icon: !user.photo ? await makeBadge("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/proxy.php?u=" + user.photo) : "https://cdn.glitch.global/e66aa76e-76bf-44ef-a0a7-b573e6473e08/icon-192.png?v=1662298996142", // icon
            // Don't mess with the badge
            // badge: "https://cdn.glitch.global/77b4c993-589e-4e39-8500-f03fc9765209/5c2f93a6-9329-426a-806b-587ddcf6a517.notification-badge.png?v=1663437251523", // badge
            tag: chat.id,
            requireInteraction: true,
            actions: [{action: "open_url$" + chat.url, title: "Reply"}],
            data: {...notification.payload, c: (notifications.length ? notifications[0].data.c + 1 : 1)}
        });
}
const GeneralNotificationHandler = (notification) => self.registration.showNotification(notification.title,
    {
        body: notification.body, //the body of the push notification
        image: notification.data.large_image,
        icon: "https://cdn.glitch.global/e66aa76e-76bf-44ef-a0a7-b573e6473e08/icon-192.png?v=1662298996142", // icon
        // Don't mess with the badge
        badge: "https://cdn.glitch.global/77b4c993-589e-4e39-8500-f03fc9765209/5c2f93a6-9329-426a-806b-587ddcf6a517.notification-badge.png?v=1663437251523", // badge
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        actions: [
            {action: "open_url$" + notification.data.url, title: "Reply"}
        ]
    }
);
const ActionHandler = async (action) => {
    switch (action["action_type"]) {
        case "clear-cache":
            const expired = (await caches.keys())
            for (const cache of expired) await caches.delete(cache);
            console.log(`%c [Cache Manager] Deleted All Cached Data: ${expired.length}`, 'background: #222; color: white')
            break;
    }
}

/**
 * @param notification {
 * payload: {
 *     "type": "kn.chats.conversation.call.notification",
 *     "payload": {
 *         "user": {
 *             "name": string,
 *             "photo": string,
 *             "id": string
 *         },
 *         "chat": {
 *             "id": string,
 *             "url": string
 *         },
 *         "data": {
 *             notification: {
 *                 title: string,
 *                 body: string,
 *                 tag: string | undefined
 *             },
 *             openWindowSupport: {
 *                 open: boolean,
 *                 url: string,
 *                 parameters: {
 *                     cache: boolean,
 *                 },
 *             },
 *             provider: {
 *                 url: string,
 *                 version: "kn.chats.notification.service.v1",
 *                 key: `kn.${string}`
 *             }
 *         }
 *     }
 *   }
 * }
 */
const CallHandler = async (notification) => {
    const {payload: {user, chat}, ...data} = notification;
    Log('Call notification received');
    // const metadata
    try {
        if (data.openWindowSupport.open && self.clients.openWindow) await self.clients.openWindow(data.openWindowSupport.url);
        else {
            const availabeClients = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
            const focusedClient = availabeClients.find(({focused, visibilityState}) => (focused || visibilityState));
            console.log(availabeClients)
            if (focusedClient) await focusedClient.navigate(data.openWindowSupport.url)
        }
    } catch (e) {
        Log("[Call Manager]: cannot open window: ", e);
    }
    await self.registration.showNotification(
        data.notification.title, {
            body: data.notification.body,
            icon: !user.photo ? await makeBadge("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/proxy.php?u=" + user.photo) : "https://cdn.glitch.global/e66aa76e-76bf-44ef-a0a7-b573e6473e08/icon-192.png?v=1662298996142", // icon
            // Don't mess with the badge
            badge: "https://cdn.glitch.global/77b4c993-589e-4e39-8500-f03fc9765209/5c2f93a6-9329-426a-806b-587ddcf6a517.notification-badge.png?v=1663437251523", // badge
            tag: data.notification.tag,
            requireInteraction: true, silent: false, data: {type: data.type, url: data.openWindowSupport.url}
        });
}
self.addEventListener("push", async e => {
    try {
        Log(`Push Notification Received`);
        const push = await e.data.json();
        switch (push.type) {
            case NotificationTypes["Conversation.Message"]:
                await MessageNotificationHandler(push);
                break;
            case NotificationTypes.General:
                await GeneralNotificationHandler(push);
                break;
            case NotificationTypes["Conversation.Call"]:
                await CallHandler(push);
                break;
            case NotificationTypes.Action:
                await ActionHandler(push);
                break;
        }
    } catch (e) {
        Log("push event error: ", e);
    }
});
self.addEventListener('notificationclick', async function (event) {
    console.log(event)
    if (event.notification.data.type === NotificationTypes["Conversation.Call"]) {
        await self.clients.openWindow(event.notification.data.url);
        return event.notification.close()
    }
    switch (event.action.split("$")[0]) {
        case 'open_url':
            await self.clients.openWindow(event.action.split("$").pop()); //which we got from above
            break;
    }
});