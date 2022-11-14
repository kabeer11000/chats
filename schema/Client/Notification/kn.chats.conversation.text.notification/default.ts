export interface Default {
    "type": "kn.chats.conversation.text.notification",
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
            "message": string
        }
    }
}