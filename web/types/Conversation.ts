import firebase from "firebase";
import DocumentReference = firebase.firestore.DocumentReference;
import Timestamp = firebase.firestore.Timestamp;
import UserInfo = firebase.auth.UserMetadata;

export interface IConversation {
    "id": string,
    "ref": DocumentReference,
    "lastSent": Timestamp | {
        "seconds": number,
        "nanoseconds": number
    },
    name?: string,
    "users": Array<string>,
    "background": undefined | null | {
        name?: string,
        hash?: string,
        blur?: undefined | null | boolean,
        ambient?: {
            main: [number, number, number],
            name: string,
            hash: string,
            blur: undefined | null | boolean,
        }
    }
}
export interface IUser {
    email: string, lastActive: Timestamp | string, photoURL: string, user?: UserInfo
}
export interface IMessage {
    message: string | null,
    photoURL: string,
    replyingTo: string | null,
    seen?: boolean,
    timestamp: Timestamp | string,
    user: string,
    files: Array<{
        type: "kn.chats.IMAGE" | "kn.chats.AUDIO",
        url: string
    }>
}
export interface IMessageWithConverter extends IMessage {
    id: string
    "ref": DocumentReference,
}