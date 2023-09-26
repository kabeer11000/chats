import {createContext, useState} from "react";
// @ts-ignore
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
// @ts-ignore
import {useRouter} from "next/router";
// @ts-ignore
import {auth, db} from "firebase-config";
// @ts-ignore
import {useDropzone} from "react-dropzone";
// @ts-ignore
import firebase from 'firebase/app';
import "firebase/firestore";

// @ts-ignore
import {useAuthState} from "react-firebase-hooks/auth";
// @ts-ignore
import {compressImage} from "@/utils/compression/image";

import {Notification} from "@/utils/dispatch-notification";
import {v4} from "uuid";
import {useConversationState} from "@/zustand/v2/Conversation";

export const CallContext = createContext<{ calling: boolean, Create: () => any }>({
    Create(): any {
    }, calling: false
});
export const CallProvider = ({children}) => {
    const {chat, members} = useConversationState(state => ({
        chat: {data: state.state, loading: state.loading},
        members: {data: state.members, loading: state.membersLoading}
    }))
    // const {chat, members, subscriptions} = useContext(RootContext);
    const subscriptions = [];
    const [user, userLoading] = useAuthState(auth);
    const router = useRouter();
    const [state, setState] = useState({
        calling: false,
        call: null
    });
    const Create = async () => {
        if (!chat.data || chat.loading) return console.log("Chat Not Loaded");
        if (!router.query.id) throw new Error("Chat id undefined");
        if (!userLoading && !user) return console.log("user undefined");
        if (userLoading) return console.log("userLoading");
        // const filteredMembers = ((members.loading) || !members.data) ? [] : members.data?.filter($u => $u.email !== user.email)
        const callObject = {
            host: user.email, id: v4(),
            connection: {
                service: "kn.chats.call.v1",
                config: {audio: true, video: false}
            }
        }
        await db.collection("chats").doc(router.query.id.toString()).set({call: callObject}, {merge: true});
        setState({calling: true, call: callObject});
        const windowId = v4();
        const uri = `/chat/${router.query.id}/call/${callObject.id}/?ui=v1&window=${windowId}`;
        const notif = new Notification("kn.chats.conversation.call.notification", {
            user: {
                name: user.email,
                photo: user.photoURL,
                id: user.uid
            },
            call: {
                session: callObject.id
            },
            chat: {
                id: router.query.id.toString(),
                url: `https://chats.kabeersnetwork.tk/chat/${router.query.id}`
            },
        });
        notif.dispatch(subscriptions.data).catch(); // leave the promise hanging
        if (window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/iPhone/i)) return router.push(uri);
        else window.open(uri, 'pop', `title=On Call,scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=440,height=900`);
        // await router.push(`/chat/${router.query.id}/call/${callObject.id}/?ui=v1`);
    }
    return (
        <CallContext.Provider value={{
            Create, calling: false
        }}>{children}</CallContext.Provider>
    )
}