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

import {Notification, SendNotification} from "@/utils/dispatch-notification";
import firestore = firebase.firestore;
import {v4} from "uuid";

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
    activity: { actionBackdrop: { open: boolean, toggle: () => void } },
    Files: {
        Dropzone: { getRootProps: () => object, getInputProps: () => object, isDragActive: boolean },
        Upload: ({file}: { file: File }) => Promise<{ url: string, type: ("kn.chats.IMAGE" | "kn.chats.AUDIO") }>,
    }
} | undefined>(undefined);
const loadMessageLength = 100
export const RootProvider = (({children}) => {
    const router = useRouter();
    const [loadedMessages, setLoadedMessages] = useState(loadMessageLength);
    const [user] = useAuthState(auth);
    const [chat, chatLoading] = useDocumentData(db.collection("chats").doc(router.query.id)); //
    const [messages, messagesLoading] = useCollectionData(chat ? db.collection("chats").doc(router.query.id).collection("messages").orderBy("timestamp", "asc").limitToLast(loadedMessages).withConverter(converter) : undefined); //
    const [members, membersLoading] = useCollectionData(chat ? db.collection("users").where("email", "in", chat.users).withConverter(converter) : null); //
    const {setFiles, text, setText, files} = useContext(InputContext);
    const [reply, setReply] = useState<{ message: null | object }>({message: null});
    const [subscriptions, setSubscriptions] = useState([]);
    const [actionBackdrop, setActionBackdrop] = useState(false);
    const onDrop = useCallback(async acceptedFiles => {
        try {
            const updatedFiles = [];
            setActionBackdrop(true);
            // @ts-ignore
            for (const file of acceptedFiles) updatedFiles.push(await Files.Upload({
                file: await compressImage(file),
                actionBackdrop: false
            }));
            setFiles([...files, ...updatedFiles]);
        } catch (e) {
            console.log(e);
            alert("Error occurred uploading the file")
        }
        setActionBackdrop(false);
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop, accept: "image/*", noClick: true, multiple: false
    });
    const onReply = useCallback(async (message: any) => setReply({message: message}), []);
    const SendMessage = useCallback(async () => {
        if (!files.length && text.trim() === '') return;
        // leaving promises hanging
        db.collection('users').doc(user.uid).set({lastActive: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true}).then();
        db.collection('chats').doc(router.query.id).set({lastSent: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true}).then();
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: text.trim(),
            user: user.email,
            photoURL: user.photoURL,
            files: files,
            seen: false,
            // @ts-ignore
            replyingTo: reply.message ? reply.message.id : null
        });
        setFiles([]);
        setText('');
        setReply({message: null});
        console.log(members, membersLoading, subscriptions);
        if (members && !membersLoading && subscriptions.length) {
            if (navigator.onLine) {
                console.log(subscriptions)
                const notif = new Notification("kn.chats.conversation.text.notification", {
                    data: {message: text, previewImage: files.find(({type}) => type === "kn.chats.IMAGE")?.url}, user: {id: user.uid, name: user.displayName, photo: user.photoURL},
                    chat: {id: router.query.id.toString(), url: `https://chats.kabeersnetwork.tk/chat/${router.query.id.toString()}`}
                });
                await notif.dispatch(subscriptions).catch(() => {
                    console.log("error sending notifications");
                });
            }
        }
    }, [files, subscriptions, text, router.query.id, user, chat, members]);
    const DeleteMessage = useCallback(async (message: any) => {
    }, []);
    const Files = {
        Dropzone: {getRootProps, getInputProps, isDragActive},
        async Upload({
                         file, actionBackdrop
                     }: { file: File, actionBackdrop?: boolean }): Promise<{ url: string, type: ("kn.chats.IMAGE" | "kn.chats.AUDIO") }> {
            try {
                if (actionBackdrop) setActionBackdrop(true);
                const formData = new FormData();
                formData.append("file", file, file.name);
                const res: { file: { url: string }, u: boolean, served_from_cache?: boolean } = await fetch("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/upload.php?branch=vms-emulated", {
                    method: 'POST',
                    body: formData,
                    redirect: 'follow'
                }).then(r => r.json());
                // Upload Logic Here
                if (actionBackdrop) setActionBackdrop(false);
                return ({url: res.file.url, type: fileTypeResolver(file.type)});
            } catch (e) {
                // Upload Logic Here
                if (actionBackdrop) setActionBackdrop(false);
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
    console.count("[Conversation] Context Updated");
    return (
        <RootContext.Provider value={{
            chat: {data: chat, loading: chatLoading},
            messages: {
                data: messages, loading: messagesLoading,
                loadMore: () => setLoadedMessages(loadedMessages + loadMessageLength)
            },
            reply: {data: reply},
            members: {data: members, loading: membersLoading},
            subscriptions: {data: subscriptions},
            activity: {actionBackdrop: {open: actionBackdrop, toggle: () => setActionBackdrop(!actionBackdrop)}},
            methods: {SendMessage, DeleteMessage, onReply}, Files,
        }}>{children}<ActionBackdrop/></RootContext.Provider>
    )
});

export const CallContext = createContext<{ calling: boolean, Create: () => any }>({calling: false});
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
        await db.collection("chats").doc(router.query.id).set({call: callObject}, {merge: true});
        setState({calling: true, call: callObject});
        await router.push(`/chat/${router.query.id}/call/${callObject.id}/?ui=v1`);
    }
    return (
        <CallContext.Provider value={{
            Create, calling: false
        }}>{children}</CallContext.Provider>
    )
}