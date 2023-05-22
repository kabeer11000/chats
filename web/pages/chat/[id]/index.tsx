import {analytics, auth} from 'firebase-config';
// @ts-ignore
import {useRouter} from "next/router";
import {useEffect} from "react";
// @ts-ignore
import dynamic from "next/dynamic";
// @ts-ignore
import Skeleton from "@mui/material/Skeleton";
import shallow from "zustand/shallow";
import {useConversationState, useMessagesState} from "@/zustand/v2/Conversation";
import {useAuthState} from "react-firebase-hooks/auth";

const Conversation = dynamic(() => import("@/components/v2/Conversation/Conversation"), {
    loading: () => <Skeleton variant="rectangular" width={`100%`} height={"100vh"}/>
})
export const getServerSideProps = async ({params}) => {
    return ({props: {exists: true /*(await db.collection("chats").doc(params.id).get()).exists */}});
}
export default function Chat({exists}) {
    const router = useRouter();
    const [subscribeToMessages, unSubscribeToMessages] = useMessagesState(state => [state.subscribe, state.unsubscribe], shallow);
    const [user] = useAuthState(auth);
    useEffect(() => {
        analytics().setCurrentScreen("kn.chats.pages.chat");
        if (!router.query.id) return;
        if (!exists) {
            router.push("/").then();
            return;
        }
        useConversationState.getState().subscribe(router.query.id.toString(), user);
        subscribeToMessages(router.query.id.toString())
        return () => {
            useConversationState.getState().unsubscribe();
            useConversationState.getState().unsubscribeToMemberData();
            unSubscribeToMessages();
        }
    }, [router.query.id]);
    return (
        <Conversation props={undefined}/>
    );
};