/**
 * @type {
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
 * }
 */
export interface Default {
    "type": "kn.chats.conversation.call.notification",
    "payload": {
        "user": {
            "name": string,
            "photo": string,
            "id": string
        },
        "chat": {
            "id": string,
            "url": string
        },
        "data": {
            notification: {
                title: string,
                body: string,
                tag: string | undefined
            },
            openWindowSupport: {
                open: boolean,
                url: string,
                parameters: {
                    cache: boolean,
                },
            },
            provider: {
                url: string,
                version: "kn.chats.notification.service.v1",
                key: `kn.${string}`
            }
        }
    }
}