import {memo, useContext} from "react";
import {RootContext} from "./Context";
// @ts-ignore
import dynamic from "next/dynamic";
import {DrawerContext} from "../../Contexts";
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
const Typography = dynamic(() => import("@mui/material/Typography"));

function Messages({scrollContainerRef}) {
    // const {inputFocused, text} = useContext(InputContext)
    const {messages} = useContext(RootContext);
    // @ts-ignore
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    return (
        <div className={"messages-container"} ref={scrollContainerRef}
             style={{
                 padding: "0.5rem",
                 paddingTop: "4rem",
                 paddingBottom: "5rem",
                 overflowX: "hidden",
                 overflowY: "scroll",
                 height: '100%'
                 // height: "calc(100vh - 7.5rem)"
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
            {messages.loading && <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                minWidth: `calc(100vw - ${isDesktop ? drawerWidth : 0}px`,
                position: "fixed",
                top: 0
            }}>
                <CircularProgress/>
            </div>}
            {/* @ts-ignore */}
            {!messages.loading && !messages.data?.length ? (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: "30vh"
                }}>
                    <img src={"/images/icon-512.png"}
                         style={{width: "100%", maxWidth: "10rem", height: "auto", opacity: "50%"}} alt={"logo"}/>
                    <Typography variant={"body2"} style={{flex: 1, alignSelf: "center", marginTop: "2rem"}}>
                        No Conversation
                    </Typography>
                </div>
            ) : null}
            {/* scroll target empty div @ts-ignore */}
            <p style={{height: "0rem", scrollSnapAlign: "center"}} id="jimmyjohnson"/>
        </div>
    )
}

export default memo(Messages);