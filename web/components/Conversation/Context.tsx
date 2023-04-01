import {createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
// @ts-ignore
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
// @ts-ignore
import {useRouter} from "next/router";
// @ts-ignore
import {auth, db} from "firebase-config";
// @ts-ignore
import {useDropzone} from "react-dropzone";
import ActionBackdrop from "./ActionBackdrop";
// @ts-ignore
import firebase from 'firebase/app';
import "firebase/firestore";

// @ts-ignore
import {useAuthState} from "react-firebase-hooks/auth";
// @ts-ignore
import {compressImage} from "@/utils/compression/image";

import {Notification} from "@/utils/dispatch-notification";
import {v4} from "uuid";
import {useActionBackdrop, useInput} from "../../zustand/Conversation";
import shallow from "zustand/shallow";
import firestore = firebase.firestore;

const fileTypeResolver = (mime: string) => {
    switch (mime.split("/")[0]) {
        case "image":
            return "kn.chats.IMAGE";
        case "audio":
            return "kn.chats.AUDIO"
    }
}

/**
 * InputContext -> RootContext -> (Conversation -> Messages|Input|Header|Options)
 **/
export const InputContext = createContext<{
    text: string, inputFocused: boolean, setInputFocused: Dispatch<SetStateAction<boolean>>, voiceMessage: {
        sheetOpen: boolean,
        toggleSheet: () => void,
    }, files: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>, setText: Dispatch<SetStateAction<string>>, setFiles: Dispatch<SetStateAction<Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>>>
} | undefined>(undefined);
export const InputProvider = ({children}) => {
    const [text, setText] = useState<string>("");
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [inputFocused, setInputFocused] = useState<boolean>(true);
    const [files, setFiles] = useState<Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>>([]);
    return <InputContext.Provider value={{
        text, files, inputFocused, setInputFocused,
        voiceMessage: {sheetOpen, toggleSheet: () => setSheetOpen(!sheetOpen)}, setFiles, setText
    }}>{children}</InputContext.Provider>
}

export const converter = {
    toFirestore: (post) => ({...post}), fromFirestore: (snapshot, options) => ({
        id: snapshot.id,
        ref: snapshot.ref,
        ...(snapshot.data(options))
    })
}
export const RootContext = createContext<{
    chat: { data: null | { ref: firestore.DocumentReference, [x: string]: any }, loading: boolean },
    messages: { data: null | object, loading: boolean, loadMore: () => void },
    members: { data: null | object, loading: boolean },
    methods: { SendMessage: () => Promise<void>, DeleteMessage: (message: any) => Promise<void>, onReply: (message: object) => Promise<void> },
    reply: { data: { message: null | object } },
    subscriptions: { data: Array<any> },
    activity: { actionBackdrop: { open: boolean, cancel: () => void, toggle: () => void } },
    Files: {
        Dropzone: { getRootProps: () => object, getInputProps: () => object, isDragActive: boolean },
        Upload: ({file}: { file: File }) => Promise<{ url: string, type: ("kn.chats.IMAGE" | "kn.chats.AUDIO") }>,
    }
} | undefined>(undefined);
const loadMessageLength = 5//100;
export const RootProvider = (({children}) => {
    const router = useRouter();
    const [loadedMessages, setLoadedMessages] = useState(loadMessageLength);
    const [user] = useAuthState(auth);
    // @ts-ignore
    const [chat, chatLoading] = useDocumentData(router.isReady ? db.collection("chats").doc(router.query.id.toString()).withConverter(converter) : null); //
    const [messages, messagesLoading] = useCollectionData(chat ? db.collection("chats").doc(chat.id).collection("messages").orderBy("timestamp", "asc").limitToLast(loadedMessages).withConverter(converter) : undefined); //
    const [members, membersLoading] =  /*[[], false]*/ useCollectionData(chat ? db.collection("users").where("email", "in", chat.users).withConverter(converter) : null); //
    const [reply, setReply] = useState<{ message: null | object }>({message: null});
    const [subscriptions, setSubscriptions] = useState([]);
    const actionBackdrop = useActionBackdrop();

    console.count("[Conversation] Context Updated");
    useEffect(() => {
        // console.log('root context updated')
        console.count('chat changed');
    }, [chat])
    const input = useInput(state => ({setFiles: state.setFiles, setText: state.setText}), shallow);
    const onDrop = useCallback(async acceptedFiles => {
        try {
            const updatedFiles = [];
            actionBackdrop.create(); // Automatically opens
            // @ts-ignore
            for (const file of acceptedFiles) updatedFiles.push(await Files.Upload({
                file: await compressImage(file),
                // actionBackdrop: false
            }));
            input.setFiles([...useInput.getState().state.files, ...updatedFiles]);
            actionBackdrop.destroy();
        } catch (e) {
            console.log(e);
            alert("Error occurred uploading the file");
            actionBackdrop.error();
        }
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        // @ts-ignore
        onDrop, accept: "image/*", noClick: true, multiple: false
    });
    const onReply = useCallback(async (message: any) => setReply({message: message}), []);
    const SendMessage = async () => {
        const inputState = useInput.getState().state;
        if (!inputState.files.length && inputState.text.trim() === '') return;
        // leaving promises hanging
        const batch = db.batch()
        // batch.set(db.collection('users').doc(user.uid), {lastActive: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});
        // TODO creates 2 unnecessary updates
        // batch.set(db.collection('chats').doc(router.query.id.toString()), {lastSent: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});
        batch.set(db.collection('chats').doc(router.query.id.toString()).collection('messages').doc(), {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: inputState.text.trim(),
            user: user.email,
            photoURL: user.photoURL,
            files: inputState.files,
            seen: false,
            // @ts-ignore
            replyingTo: reply.message ? reply.message.id : null
        });
        batch.commit();
        // db.collection('chats').doc(router.query.id.toString()).collection('messages').add({
        //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        //     message: inputState.text.trim(),
        //     user: user.email,
        //     photoURL: user.photoURL,
        //     files: inputState.files,
        //     seen: false,
        //     // @ts-ignore
        //     replyingTo: reply.message ? reply.message.id : null
        // });
        input.setFiles([]);
        input.setText('');
        setReply({message: null});
        // console.log(members, membersLoading, subscriptions);
        if (members && !membersLoading && subscriptions.length) {
            if (navigator.onLine) { // TODO Offline Queue Notifications
                console.log(subscriptions)
                const notif = new Notification("kn.chats.conversation.text.notification", {
                    call: {session: ""},
                    data: {
                        message: inputState.text,
                        previewImage: inputState.files.find(({type}) => type === "kn.chats.IMAGE")?.url
                    },
                    user: {id: user.uid, name: user.displayName, photo: user.photoURL},
                    chat: {
                        id: router.query.id.toString(),
                        url: `https://chats.kabeers.network/chat/${router.query.id.toString()}`
                    }
                });
                await notif.dispatch(subscriptions).catch(() => {
                    console.log("error sending notifications");
                });
            }
        }
    };
    const DeleteMessage = useCallback(async (message: any) => {
    }, []);
    const Files = {
        Dropzone: {getRootProps, getInputProps, isDragActive},
        async Upload({
                         file, /* actionBackdrop: _actionBackdrop */
                     }: { file: File, actionBackdrop?: boolean }): Promise<{ url: string, type: ("kn.chats.IMAGE" | "kn.chats.AUDIO") }> {
            try {
                // if (_actionBackdrop) actionBackdrop.create();
                const formData = new FormData();
                formData.append("file", file, file.name);
                const res: { file: { url: string }, u: boolean, served_from_cache?: boolean } = await fetch("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/upload.php?branch=vms-emulated", {
                    method: 'POST',
                    body: formData,
                    redirect: 'follow'
                }).then(r => r.json());
                // Upload Logic Here
                // if (_actionBackdrop) actionBackdrop.destroy();
                return ({url: res.file.url, type: fileTypeResolver(file.type)});
            } catch (e) {
                // Upload Logic Here
                // if (_actionBackdrop) actionBackdrop.error();
                throw new Error("Error occurred uploading file");
            }

        }
    }
    const _fetchMemberSubs = async () => {
        // console.log(members.filter(({email}) => email !== user.email))
        // @ts-ignore
        for (const member of members.filter(({email}) => email !== user.email)) {
            const subs = await member.ref.collection("subscriptions").get();
            // console.log("member: ", member)
            for (const sub of subs.docs) {
                // console.log("subs: ", [...subscriptions, await sub.data()].length)
                await setSubscriptions([...subscriptions, await sub.data()]);
            }
        }
    }
    useEffect(() => {
        if (!membersLoading && members) _fetchMemberSubs().catch()
    }, [members, membersLoading]);
    useEffect(() => {
        // Chat does not exist
        if (!chatLoading && !chat) router.push("/");
    }, [chat, chatLoading]);
    return (
        <RootContext.Provider value={{
            // @ts-ignore, it's there I just can't figure out how to fix this in typescript
            chat: {data: chat, loading: chatLoading},
            messages: {
                data: messages, loading: messagesLoading,
                loadMore: () => setLoadedMessages(loadedMessages + loadMessageLength)
            },
            reply: {data: reply},
            members: {data: members, loading: membersLoading},
            subscriptions: {data: subscriptions},
            methods: {SendMessage, DeleteMessage, onReply}, Files,
        }}>{children}<ActionBackdrop/></RootContext.Provider>
    )
});

export const CallContext = createContext<{ calling: boolean, Create: () => any }>({
    Create(): any {
    }, calling: false
});
export const CallProvider = ({children}) => {
    const {chat, members, subscriptions} = useContext(RootContext);
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