import create from "zustand";
import {Log} from "@/utils/Log";
import firebase from "firebase";
import {devtools} from "zustand/middleware";
import {IConversation} from "../types/Conversation";
import {Fragment, useEffect} from "react";
import {auth, db} from "firebase-config";
import Converter from "@/utils/firestoreConverter";
import {useAuthState} from "react-firebase-hooks/auth";


interface IConversationState {
    conversations: Array<IConversation> | null,
    loading: boolean,

    [x: string]: any
}

export const useConversations = create<IConversationState>()(devtools((set) => ({
    conversations: null,
    loading: false,
    _config: {initialLoad: false, unsubscribe: null},
    toggleLoading: () => set(state => ({loading: !state.loading})),
    set: (snapshot) => {
        set(({conversations: snapshot.docs.map(doc => doc.data()), loading: false}));
        // Log.chats(snapshot.metadata);
    }
})));
export const ConversationsProvider = ({children}) => {
    const [user] = useAuthState(auth);
    // const toggleLoading = useConversations(state => state.toggleLoading);
    const setConversations = useConversations(state => state.set);
    useEffect(() => {
        if (!user) return;
        const unsubscribe = db.collection('chats').where('users', 'array-contains', user.email).withConverter(Converter).onSnapshot(setConversations);
        return () => unsubscribe();
    }, [user])

    return (<Fragment>{children}</Fragment>);
}