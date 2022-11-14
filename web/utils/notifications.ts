import vapid from "../creds/vapid.json";
import {db} from "firebase-config";

export function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
}

export const NotificationTypes = {
    "Conversation.Message": "kn.chats.conversation.text.notification",
    "Conversation.Call": "kn.chats.conversation.call.notification",
    "General": "kn.chats.general.notification",
    "Action": "kn.chats.action.notification",
}
export const registerNotifications = async (registration, user) => {
    if (!registration.active || !('pushManager' in registration)) return console.log("failed to register notifications");
    const subscription = (await registration.pushManager.getSubscription()) ?? (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid.public_key)
    }));
    localStorage.setItem("push.subscription", JSON.stringify(subscription.toJSON()));
    const batch = db.batch();
    const otherUsersWithTheSameSub = await db.collection("users").where("subscriptions", "array-contains", subscription.toJSON()).get({});
    console.log(otherUsersWithTheSameSub.docs)
    for (const doc of otherUsersWithTheSameSub.docs) batch.delete(db.collection("users").doc(doc.id).collection("subscriptions").doc(localStorage.getItem("push.device")));
    batch.set(db.collection("users").doc(user.uid).collection("subscriptions").doc(localStorage.getItem("push.device")), subscription.toJSON());
    await batch.commit();
    console.log("notification registered");
}