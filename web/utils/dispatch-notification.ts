import {NotificationTypes} from "./notifications";

const notifsServer = 'https://solar-victorious-powder.glitch.me/v2/dispatch' || 'http://localhost:5001/v2/dispatch' || `https://solar-victorious-powder.glitch.me/send-message-notification` || "/api/send-message-notification";
/**
 *
 * @param chatId
 * @param image
 * @param recipientSubscriptions
 * @param userUID
 * @param userDisplayName
 * @param message
 * @param userPhotoURL
 * @returns {Promise<Response>}
 * @constructor
 */
export const SendNotification = ({
                                     chatId, image, recipientSubscriptions, userUID, userDisplayName,
                                     message, userPhotoURL
                                 }) => {
    fetch(notifsServer, {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            subscriptions: recipientSubscriptions,
            type: NotificationTypes["Conversation.Message"],
            payload: {
                user: {
                    name: userDisplayName,
                    photo: userPhotoURL,
                    id: userUID
                },
                chat: {
                    id: chatId,
                    url: `https://chats.kabeersnetwork.tk/chat/${chatId}`
                },
                data: {
                    message: message,
                    previewImage: image
                }
            }
        })
    });
}
type INotificationTypes =
    "kn.chats.conversation.text.notification"
    | "kn.chats.conversation.call.notification"
    | "kn.chats.general.notification"
    | "kn.chats.action.notification";

interface ITextNotificationProps {
    user: {
        name: string,
        photo: string,
        id: string
    },
    chat: {
        id: string,
        url: `https://chats.kabeersnetwork.tk/chat/${string}`
    },
    data: {
        message: string,
        previewImage?: string
    }
}

interface ICallNotificationProps {
    user: {
        name: string,
        photo: string,
        id: string
    },
    call: {
        session: string
    },
    chat: {
        id: string,
        url: string
    },
}

export class Notification {
    private readonly config: ITextNotificationProps | ICallNotificationProps;
    private readonly type: INotificationTypes;
    private readonly prod = process.env.NODE_ENV === "production"
    private readonly PushV2Server = this.prod ? 'https://solar-victorious-powder.glitch.me' : 'http://192.168.40.50:5001'

    constructor(type: INotificationTypes, config: ITextNotificationProps | ICallNotificationProps) {
        this.type = type;
        this.config = config;
    }

    private async _call(subscriptions: Array<object>) {
        if (!("call" in this.config)) throw new Error("Call Session Id Undefined");
        const response = await fetch(this.PushV2Server + "/v2/call/dispatch", {
            method: "POST", cache: "no-cache", headers: {"content-type": "application/json"},
            body: JSON.stringify({
                subscriptions, payload: {
                    "user": {
                        "name": this.config.user.name,
                        "photo": this.config.user.photo,
                        "id": this.config.user.id
                    },
                    "chat": {"id": this.config.chat.id, "url": this.config.chat.url},
                    session: {id: this.config.call.session}
                },
                "notification": {
                    "title": `${this.config.user.name} Incoming Call`,
                    "body": "",
                    "tag": `${this.config.chat.id}/${this.config.call.session}`
                },
                "openWindowSupport": {
                    "open": false, // TODO
                    "url": `${window.location.protocol}//${window.location.host}/chat/${this.config.chat.id}/call/${this.config.call.session}`,
                    "parameters": {
                        "ui": "v1"
                    }
                },
                "provider": {
                    "url": this.PushV2Server,
                    "version": "kn.chats.notification.service.v2",
                    "key": "kn.string.v2"
                }

            })
        });
        return response.ok;
    }

    private async _text(subscriptions: Array<object>) {
        if (!("data" in this.config)) throw new Error("Data Undefined");
        const response = await fetch(this.PushV2Server + "/v2/text/dispatch", {
            method: "POST", cache: "no-cache", headers: {"content-type": "application/json"}, body: JSON.stringify({
                subscriptions, "type": "kn.chats.conversation.text.notification",
                payload: {
                    user: {name: this.config.user.name, photo: this.config.user.photo, id: this.config.user.id},
                    chat: {id: this.config.chat.id, url: this.config.chat.id},
                    data: {message: this.config.data.message, previewImage: this.config.data.previewImage}
                }
            })
        });
        return response.ok;
    }

    async dispatch(subscriptions: Array<object>) {
        if (this.type === "kn.chats.conversation.text.notification") return this._text(subscriptions);
        if (this.type === "kn.chats.conversation.call.notification") return this._call(subscriptions);
    }
}