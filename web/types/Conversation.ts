import firebase from "firebase";
import DocumentReference = firebase.firestore.DocumentReference;

export interface IConversation {
    "id": string,
    "ref": DocumentReference,
    "lastSent": {
        "seconds": number,
        "nanoseconds": number
    },
    "users": Array<string>,
    "background":  undefined | null | {
        "name": string,
        "hash": string,
        blur: undefined | null | boolean
    }
}