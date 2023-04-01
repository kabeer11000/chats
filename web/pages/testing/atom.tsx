import {atom, selector, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {useRenderCount} from "../../hooks/useRenderCount";
import {db} from "firebase-config";
// import {converter} from "@/components/Conversation/Context";
import {useEffect} from "react";
import Converter from "@/utils/firestoreConverter";

const dataAtom = atom({
    key: 'data.atom', default: {
        user: 'Test User', input: 'Test Input', chats: [],
    }
})
const dataInputSelector = selector({
    key: 'data.input.selector',
    get: ({get}) => {
        const data = get(dataAtom);
        return data.input
    },
    set: ({set}, input: string) => {
        set(dataAtom, (prev) => ({...prev, input: input}))
    }
});

const dataUserSelector = selector({
    key: 'data.user.selector',
    get: ({get}) => {
        const data = get(dataAtom);
        return data.user
    },
    set: ({set}, user: string) => {
        set(dataAtom, (prev) => ({...prev, user: user}))
    }
});
const UserController = () => {
    const renderCount = useRenderCount();
    const [user, setUser] = useRecoilState(dataUserSelector);
    return (
        <div>
            <div>User Rendered: {renderCount.current}</div>
            <div>User: {user}</div>
            <button onClick={() => setUser((Math.random() + 1).toString(36).substring(7))}>Change User</button>
        </div>
    )
}
const InputController = () => {
    const renderCount = useRenderCount();
    const [input, setInput] = useRecoilState(dataInputSelector);
    return (
        <div>
            <div>Input Rendered: {renderCount.current}</div>
            <div>Input Value {input}</div>
            <input type={'text'} onChange={(e) => setInput(e.target.value)}/>
        </div>
    )
}
const dataChatsSelector = selector({
    key: 'data.chats.selector',
    get: ({get}) => get(dataAtom).chats,
    set: ({set}, newValue: Array<Object>) => set(dataAtom, prevValue => ({...prevValue, chats: newValue}))
});

const ChatsConsumer = () => {
    const chats = useRecoilValue(dataChatsSelector);
    const renderCount = useRenderCount();
    return <div>
        <div>Chats.Consumer Rendered: {renderCount.current}</div>
        <hr/>
        {chats?.map(({user}) => `Chat: ${user}`)}
    </div>
}
const ChatsController = () => {
    const renderCount = useRenderCount();
    const setChats = useSetRecoilState(dataChatsSelector);
    useEffect(() => {
        // const unsubscribe = db.collection('chats').where('users', 'array-contains', 'kabeer11000@gmail.com').withConverter(Converter).onSnapshot(data => {
            // setChats(data.docs);
            // console.log(data.docs[0].data())//.map(doc => doc.data()))
        // });
        // return () => unsubscribe()
    }, [])
    return (
        <div>
            <div>Chats.Controller Rendered: {renderCount.current}</div>
            <hr/>
            <ChatsConsumer/>
        </div>
    )
}

export default function PopupPage() {
    const renderCount = useRenderCount();
    return (
        <div>
            <div>Root Rendered: {renderCount.current}</div>
            <hr/>
            <UserController/>
            <hr/>
            <InputController/>
            <hr/>
            <ChatsController/>
        </div>
    );
}
