import {useInput} from "@/zustand/v2/Conversation";
import {auth, db} from "firebase-config";
import firebase from "firebase";
import Router from "next/router";

export const fileTypeResolver = (mime: string) => {
    switch (mime.split("/")[0]) {
        case "image":
            return "kn.chats.IMAGE";
        case "audio":
            return "kn.chats.AUDIO"
    }
}
export const converter = {
    toFirestore: (post) => ({...post}), fromFirestore: (snapshot, options) => ({
        id: snapshot.id,
        ref: snapshot.ref,
        ...(snapshot.data(options))
    })
}

export const SendMessage = () => {
    if (!auth.currentUser) return console.error("[Conversation]: SendMessage() failed, as auth.currentUser is: ", typeof auth.currentUser);
    const inputState = useInput.getState().state;
    if (!inputState.files.length && inputState.text.trim() === '') return;
    const batch = db.batch();
    batch.set(db.collection('users').doc(auth.currentUser.uid), {lastActive: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});
    batch.set(db.collection('chats').doc(Router.query.id.toString()), {lastSent: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});
    batch.set(db.collection('chats').doc(Router.query.id.toString()).collection('messages').doc(), {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: inputState.text.trim(),
        user: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
        files: inputState.files,
        seen: false,
        replyingTo: inputState.reply ? inputState.reply.id : null
    });
    batch.commit().catch();
    const state = useInput.getState();
    state.clear();
}