import {ReactNode, Ref, useEffect, useState} from "react";
// @ts-ignore
import dynamic from "next/dynamic";
// @ts-ignore for some reason ref's weren't working with the dynamic import
// import Box from "@mui/material/Box";
// import {useScrollTrigger} from "@mui/material";
import {Empty} from "@/components/Empty";
import {Feedback} from "@mui/icons-material";
import {debounce} from "@/utils/debounce";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "firebase-config";
import {useConversationState, useMessagesState} from "@/zustand/v2/Conversation";
import shallow from "zustand/shallow";
// @ts-ignore
const Message = dynamic(() => import("./Message"), {
    ssr: false
});
// @ts-ignore
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));
// @ts-ignore
const Delayed = dynamic(() => import("../../Delayed"));
// const Slide = dynamic(() => import("@mui/material/Grow"));
// @ts-ignore
const Typography = dynamic(() => import("@mui/material/Typography"));

export interface IMessagesProps {
    scrollContainerRef: Ref<ReactNode>
}

function Messages({scrollContainerRef}) {
    const [currentUser] = useAuthState(auth);
    const conversationLoading = useConversationState(state => state.loading);
    const loading = useMessagesState(state => state.loading);
    const messages = useMessagesState(state => state.state, shallow);
    const [loader, setLoader] = useState({loaded: false, height: null, scroll: null});
    // const onScroll = async (e) => {
    //     if (scrollContainerRef?.current && !loader.loaded && (e.target.scrollTop <= 100)) {
    //         setLoader({
    //             loaded: true,
    //             height: scrollContainerRef?.current.scrollHeight,
    //             scroll: scrollContainerRef?.current.scrollTop
    //         })
    //         // messages.loadMore();
    //     }
    //     if (loader.loaded && (e.target.scrollTop > 100)) setLoader({loaded: false, height: null, scroll: null})
    // }
    useEffect(() => {
        console.count("updated messages")
    })
    // useEffect(() => {
    //     if (loader.loaded) {
    //         // console.log((scrollContainerRef.current.scrollHeight - loader.height) + loader.scroll, loader.scroll, scrollContainerRef.current.scrollHeight, loader.height);
    //         scrollContainerRef.current.scroll({
    //             top: (scrollContainerRef.current?.scrollHeight - loader.height) + loader.scroll,
    //             behavior: 'auto'
    //         });
    //     }
    // }, [loading]);
    useEffect(() => {
        console.log(messages)
    }, [messages])
    return (
        <div className={"messages-container"} style={{
            padding: "0.5rem",
            paddingTop: "3rem",
            paddingBottom: "3rem",
            height: '100%',
        }} ref={scrollContainerRef}>
            <div style={{display: 'flex', flexDirection: "column"}}>
                {
                    // @ts-ignore TODO Impure function,
                    messages?.map((message, index) => {
                        // @ts-ignore
                        const reply = message.replyingTo ? messages.find(doc => doc.id === message.replyingTo) : null;
                        const replyingTo = message.replyingTo && reply ? reply : null;
                        return (
                            <Message
                                key={message.id}
                                replyingTo={replyingTo}
                                continued={messages[index - 1] ? messages[index - 1].user === message.user : false}
                                message={message}
                                currentUser={currentUser}
                            />
                        );
                    })
                }
            </div>
            {(loading && !conversationLoading) && <Delayed waitBeforeShow={200}>
                <div style={{
                    display: "flex",
                    minHeight: '100%',
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                }}>
                    <CircularProgress/>
                </div>
            </Delayed>}
            {(!loading && !messages?.length && !conversationLoading) ? (
                <Delayed waitBeforeShow={300}>
                    <div className={'no-messages-container'} style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                    }}>
                        <Empty variant={{
                            title: 'No Conversation',
                            icon: Feedback,
                            description: 'Messages you send will appear here!',
                            actions: [],
                        }}/>
                    </div>
                </Delayed>
            ) : null}
            {/* scroll target empty div @ts-ignore */}
            {<div className={'jimmy'} style={{height: "0rem", scrollSnapAlign: "center"}} id="jimmyjohnson"/>}
        </div>
    )
}

export default Messages;