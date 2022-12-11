import {memo, useContext} from "react";
import {RootContext} from "./Context";
// @ts-ignore
import dynamic from "next/dynamic";
import {DrawerContext} from "root-contexts";
import {Feedback} from "@mui/icons-material";
import {Empty} from "@/components/Empty";
// @ts-ignore for some reason ref's weren't working with the dynamic import
// import Box from "@mui/material/Box";
// import {useScrollTrigger} from "@mui/material";
// import InfiniteScroll from 'react-infinite-scroller';
// @ts-ignore
const Message = dynamic(() => import("./Message"), {
    ssr: false
});
// @ts-ignore
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));
// @ts-ignore
const Delayed = dynamic(() => import("../Delayed"));
// const Slide = dynamic(() => import("@mui/material/Grow"));
// @ts-ignore
const Typography = dynamic(() => import("@mui/material/Typography"));

function Messages({scrollContainerRef}) {
    // const {inputFocused, text} = useContext(InputContext)
    const {messages, chat} = useContext(RootContext);
    // @ts-ignore
    // const {isDesktop, drawerWidth} = useContext(DrawerContext);
    return (
        <div className={"messages-container"} ref={scrollContainerRef}
             style={{
                 padding: "0.5rem",
                 paddingTop: "3rem",
                 paddingBottom: "3rem",
                 height: '100%',
             }}>
            <div>
                {
                    // @ts-ignore
                    (!messages.loading && messages.data) && (
                        // @ts-ignore
                        messages.data.map((message, index) => {
                            // @ts-ignore
                            const reply = message.replyingTo ? messages.data.find(doc => doc.id === message.replyingTo) : null;
                            const replyingTo = message.replyingTo && reply ? reply : null;
                            return (
                                <Message
                                    key={message.id}
                                    replyingTo={replyingTo}
                                    continued={messages.data[index - 1] ? messages.data[index - 1].user === message.user : false}
                                    message={message}
                                />
                            );
                        })
                    )
                }
            </div>
            {(messages.loading && !chat.loading) && <Delayed waitBeforeShow={200}><div style={{
                display: "flex",
                minHeight: '100%',
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }}>
                <CircularProgress/>
            </div></Delayed>}
            {/* @ts-ignore */}
            {(!messages.loading && !messages.data?.length && !chat.loading) ? (
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
            <div className={'jimmy'} style={{height: "0rem", scrollSnapAlign: "center"}} id="jimmyjohnson"/>
        </div>
    )
}

export default memo(Messages);