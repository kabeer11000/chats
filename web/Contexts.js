import {createContext, Fragment, useContext, useEffect, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "firebase-config";
import {useCollectionData} from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
import firebase from 'firebase/app';
import "firebase/firestore";
import {getAudioContext} from "./utils/audio";
import {converter} from "./components/Conversation/Context";

export const DrawerContext = createContext({
    mobileOpen: false,
    isDesktop: true
});
export const DrawerProvider = ({children}) => {
    const [drawerWidth, setDrawerWidth] = useState(340)
    const matches = useMediaQuery('(min-width:600px)');
    const [state, setState] = useState({
        mobileOpen: false,
    });
    const [cgcd, scgcd] = useState(false);
    return (
        <DrawerContext.Provider value={{
            ...state,
            type: matches ? "permanent" : "temporary",
            isDesktop: matches,
            createGCDialog: {open: cgcd, toggle: () => scgcd(!cgcd)},
            drawerWidth: drawerWidth,
            setDrawerWidth,
            toggle: (a) => setState({...state, mobileOpen: a === undefined ? !state.mobileOpen : a})
        }}>{children}</DrawerContext.Provider>
    )
}
export const ChatContext = createContext({});
const isArrayEqual = (array, comp) => {
    return array.length === comp.length && array.every((this_i, i) => this_i === array[i])
}

function arraysEqual(a1, a2) {
    return a1 === a2 || (
        a1 !== null && a2 !== null &&
        a1.length === a2.length &&
        a1
            .map(function (val, idx) {
                return val === a2[idx];
            })
            .reduce(function (prev, cur) {
                return prev && cur;
            }, true)
    );
}

export const ChatProvider = ({children}) => {
    const [user] = useAuthState(auth);
    const [_chatsSnapshot, _chatSnapshotLoading] = useCollectionData((user) ? db.collection('chats').where('users', 'array-contains', user.email).withConverter(converter) : null)
    // const [chatsSnapshot, chatSnapshotLoading] = useCollection((user) ? db.collection('chats').where('users', 'array-contains', user.email) : null);
    const isExistingChat = (recipient) => !!_chatsSnapshot.filter(chat => (chat.users.includes(recipient) && (chat.users.filter(user => user !== user.email) === 1))).length;
    const isExistingGroupChat = (recipients) => !!_chatsSnapshot.find(({users}) => {
        console.log(arraysEqual(users, [...recipients, user.email]), users, [...recipients, user.email])
        return arraysEqual(users, [...recipients, user.email]);
    });

    const createChat = async (input, {isGc} = {isGc: false}) => {
        if (!input) input = prompt(isGc ? 'Enter space seperated email addresses of new chat recipients' : 'Enter recipients email address');
        if (!input?.trim()) return null;
        input = input.trim()
        if (isGc ? ([...new Set(input.split(" "))].includes(user.email)) : input === user.email) return alert("You cannot chat with yourself");
        if (isGc) {
            for (const email of [...new Set(input.split(" "))]) if (!EmailValidator.validate(email)) return alert("Invalid Email: " + email);
            if (isExistingGroupChat([...new Set(input.split(" "))])) return alert("Group chat already exists");
            const ref = await db.collection('chats').add({
                users: [user.email, ...[...new Set(input.split(" "))]],
                lastSent: firebase.firestore.FieldValue.serverTimestamp(),
                isGC: [...new Set(input.split(" "))].length > 1
            });
            for (const email of [...new Set(input.split(" "))]) await fetch(`/api/send-mail?guest=${email}&u=${user.email}`);
            return ref;
        } else if (EmailValidator.validate(input) && input !== user.email && !isExistingChat(input)) {
            const ref = await db.collection('chats').add({
                users: [user.email, input],
                lastSent: firebase.firestore.FieldValue.serverTimestamp(),
            });
            await fetch(`/api/send-mail?guest=${input}&u=${user.email}`)
            return ref;
        }
    };

    return (
        <ChatContext.Provider value={{
            createChat,
            isExistingChat,
            snapshots: {chats: {data: _chatsSnapshot, loading: _chatSnapshotLoading}},
        }}>
            <Fragment>{children}</Fragment>
        </ChatContext.Provider>
    )
}
export const ActiveContext = createContext({
    active: true,
    visible: true
});
export const VoiceMessageContext = createContext({
    stream: null,
    audioContext: null
});
export const VoiceMessageProvider = ({children}) => {
    const capabilities = useContext(CapabilitiesContext);
    const getMediaStream = () => navigator.mediaDevices
        .getUserMedia({audio: true, video: false});
    const getMediaStreamSource = async (stream) => {
        if (capabilities.available.WEB_AUDIO) {
            const audioCtx = getAudioContext();
            const analyser = audioCtx.createAnalyser();
            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 2048;
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            source.connect(audioCtx.destination);
            return [audioCtx, stream, source];
        }
    };
    return <VoiceMessageContext.Provider
        value={{getMediaStreamSource, getMediaStream}}>{children}</VoiceMessageContext.Provider>
}
export const CapabilitiesContext = createContext({
    available: {
        WEB_AUDIO: false,
        SERVICEWORKER: false,
        VIRTUAL_KEYBOARD: false,
    }
});
export const CapabilitiesProvider = ({children}) => {
    const [state, setState] = useState({
        available: {
            WEB_AUDIO: false,
            SERVICEWORKER: false,
            VIRTUAL_KEYBOARD: false,
        }
    });
    useEffect(() => {
        setState({
            available: {
                VIRTUAL_KEYBOARD: 'virtualKeyboard' in navigator,
                WEB_AUDIO: !!(window.AudioContext ||
                    window.webkitAudioContext ||
                    window.mozAudioContext ||
                    window.oAudioContext ||
                    window.msAudioContext),
                SERVICEWORKER: "serviceWorker" in navigator,
            }
        });
    }, []);
    return <CapabilitiesContext.Provider value={state}>{children}</CapabilitiesContext.Provider>
}