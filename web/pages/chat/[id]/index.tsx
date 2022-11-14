import {analytics} from '../../../firebaseconfig';
// @ts-ignore
import {useRouter} from "next/router";
import {useEffect} from "react";
// @ts-ignore
import dynamic from "next/dynamic";
import {InputProvider, RootProvider} from "../../../components/Conversation/Context";
// @ts-ignore
import Skeleton from "@mui/material/Skeleton";

const Conversation = dynamic(() => import("../../../components/Conversation/Conversation"), {
    loading: () => <Skeleton variant="rectangular" width={`100%`} height={"100vh"}/>
})
export default function Chat() {
    const router = useRouter();
    useEffect(() => {
        analytics().setCurrentScreen("kn.chats.pages.chat");
    }, [router.query.id]);
    return (
        <InputProvider>
            <RootProvider>
                <Conversation/>
            </RootProvider>
        </InputProvider>
    );
};