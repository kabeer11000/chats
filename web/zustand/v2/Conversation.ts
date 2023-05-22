import create from "zustand";
import {v4} from "uuid";
import {db} from "firebase-config";
import {converter} from "@/components/v2/Conversation/utils";
import {IConversation, IMessageWithConverter, IUser} from "../../types/Conversation";

export interface IActionBackdropState {
    open: boolean,
    task: null | {
        id: string
    },
    state: {
        error: boolean
    },
    destroy: () => void,
    toggle: () => void,
    create: () => void,
    error: () => void,

    [x: string]: any
}

export const useActionBackdrop = create<IActionBackdropState>((set, get) => ({
    open: false,
    state: {
        error: false,
    },
    task: null,
    create: (open = true) => set({open: open, task: {id: v4()}}),
    destroy: () => set({open: false, task: null}),
    toggle: () => set({open: !get().open}),
    error: () => set(({state: {error: true}})),
}))


export interface IInputProps {
    state: {
        text: null | string,
        files: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>,
        focused: boolean,
        reply: IMessageWithConverter | null
    },
    setText: (x: string | null) => void,
    setFiles: (x: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>) => void,
    setFocus: (x: boolean) => void,
    setReply: (x: IMessageWithConverter | null) => void,
    clear: () => any
}

export const useInput = create<IInputProps>((set) => ({
    state: {
        text: '',
        files: [],
        focused: true,
        reply: null
    },
    setReply: (x) => set((prevState) => ({state: {...prevState.state, reply: x}})),
    setText: (x) => set(state => ({state: {...state.state, text: x}})),
    setFiles: (x) => set(state => ({
        state: {
            ...state.state,
            files: x
        }
    })),
    setFocus: (x: boolean) => set(state => ({state: {...state.state, focused: x}})),
    clear: () => set({
        state: {
            text: '',
            files: [],
            focused: true,
            reply: null
        }
    })
}));


export interface IAudioMessageSheetProps {
    open: boolean,
    toggle: (option?: boolean) => any
}

export const useAudioMessageSheetState = create<IAudioMessageSheetProps>((set) => ({
    open: false,
    toggle: (option?: boolean) => set(state => ({open: typeof option === "boolean" ? option : !state.open}))
}));


/** Added in Chat Version 2.5.0 **/
export interface IUseConversationState {
    state: IConversation | null,
    members: null | Array<IUser>
    loading: boolean,
    membersLoading: boolean,
    subscribeToMemberData: (users: Array<string>) => any,
    unsubscribeToMemberData: () => any,
    I: {
        memberDataSnapshotListener: null | Function,
        chatSnapshotListener: null | Function
    },
    subscribe: (id: string, user: IUser) => any,
    unsubscribe: () => any
}

// db.collection("users").where("email", "in", chat.users).withConverter(converter)
/** Hooks for Firestore, Chat data **/
export const useConversationState = create<IUseConversationState>((set, get) => ({
    state: null,
    loading: false,
    members: null,
    membersLoading: false,
    I: {
        chatSnapshotListener: null,
        memberDataSnapshotListener: null
    },
    unsubscribeToMemberData: () => get().I?.memberDataSnapshotListener?.(), // No Cleanup
    subscribeToMemberData: (users: Array<string>) => {
        set(prevState => ({
            ...prevState,
            membersLoading: true,
            I: {
                ...prevState.I,
                memberDataSnapshotListener: db.collection("users").where("email", "in", users).withConverter(converter)
                    .onSnapshot({includeMetadataChanges: true}, (snapshot) => {
                        if (!snapshot.metadata.hasPendingWrites) set(({
                            members: snapshot.docs.map(document => document.data()),
                            membersLoading: false
                        }));
                    })
            }
        }))
    },
    subscribe: (id: string, user: IUser) => set(prevState => ({
        ...prevState,
        loading: true,
        I: {
            ...prevState.I,
            chatSnapshotListener: db.collection("chats")
                .doc(id).withConverter(converter)
                .onSnapshot({includeMetadataChanges: true}, (snapshot) => {
                    if (snapshot.metadata.hasPendingWrites) return;
                    const data = snapshot.data();
                    if ((prevState.I.memberDataSnapshotListener === null) && data?.users) prevState.subscribeToMemberData(data.users);
                    set(({
                        state: data,
                        loading: false
                    }))
                })
        }
    })),
    unsubscribe: () => get().I.chatSnapshotListener(),
}));

/** Messages **/
export interface IUseMessagesState {
    state: Array<IMessageWithConverter> | null,
    loading: boolean,
    defaults: {
        batchSize: number,
    },
    I: {
        loadedCount: 0,
        messagesSnapshotListener: null | Function
    },
    subscribe: (id: string) => any,
    unsubscribe: () => any
}

/** Hooks for Firestore, Messages data **/
export const useMessagesState = create<IUseMessagesState>((set, get) => ({
    state: null,
    loading: false,
    I: {
        loadedCount: 0,
        messagesSnapshotListener: null
    },
    defaults: {
        batchSize: 20,
    },
    subscribe: (conversationId: string, limit?: number) => {
        const config = get();
        // Just making sure
        // if (typeof config.I.messagesSnapshotListener === "function") config.I?.messagesSnapshotListener?.();
        set(prevState => ({
            ...prevState,
            loading: true,
            I: {
                ...prevState.I,
                messagesSnapshotListener: db.collection("chats").doc(conversationId)
                    .collection("messages")
                    .orderBy("timestamp", "asc")
                    .limitToLast(typeof limit === "number" ? limit : config.defaults.batchSize)
                    .withConverter(converter)
                    .onSnapshot({includeMetadataChanges: true}, (snapshot) => {
                        console.log("Got Messages: ", snapshot.docs.length);
                        if (!snapshot.metadata.hasPendingWrites) set({
                            state: snapshot.docs.map(document => document.data()),
                            loading: false
                        })
                    })
            }
        }))
    },
    unsubscribe: () => get().I?.messagesSnapshotListener?.()
}));


/** Dropzone **/
export interface IUseDropZone {
}

export const useDropZone = create<IUseDropZone>((set) => ({}))
