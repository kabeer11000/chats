// @ts-ignore
import {useAuthState} from 'react-firebase-hooks/auth';
// @ts-ignore
import {auth} from 'firebase-config';
import {Fragment, useCallback, useContext, useEffect, useState} from "react";
// @ts-ignore
import Linkify from '@kabeersnetwork/material-ui-linkify';
// @ts-ignore
import {DrawerContext} from "root-contexts";
// @ts-ignore
import useTheme from "@mui/material/styles/useTheme";
// @ts-ignore
import dynamic from "next/dynamic";
import {useInput} from "@/zustand/v2/Conversation";
// @ts-ignore
const VoiceMessage = dynamic(() => import("./VoiceMessage"));
// @ts-ignore
const Draggable = dynamic(() => import("react-draggable"));
// @ts-ignore
const Avatar = dynamic(() => import("@mui/material/Avatar"));
// @ts-ignore
const Box = dynamic(() => import("@mui/material/Box"));
// @ts-ignore
const ButtonBase = dynamic(() => import("@mui/material/ButtonBase"));
// @ts-ignore
const IconButton = dynamic(() => import("@mui/material/IconButton"));
// @ts-ignore
const Paper = dynamic(() => import("@mui/material/Paper"));
// @ts-ignore
const Typography = dynamic(() => import("@mui/material/Typography"));
// @ts-ignore
// const Delete = dynamic(() => import("@mui/icons-material/Delete"));
// @ts-ignore
const Reply = dynamic(() => import("@mui/icons-material/Reply"));

const Message = ({message, continued, replyingTo, currentUser}) => {
    const [options, setOptions] = useState(false);
    const theme = useTheme();
    const onReply = useInput(state => state.setReply);
    const messageType = message.user === currentUser.email ? 'sender' : 'receiver';
    const {isDesktop} = useContext(DrawerContext);
    const MessageOptionsSender = useCallback(() => <div
        style={{display: "flex", marginLeft: "1rem", marginRight: "1rem"}}>
        {/*<IconButton color={"inherit"} onClick={() => DeleteMessage(message)}><Delete scale={5}/></IconButton>*/}
        <IconButton color={"inherit"} onClick={() => onReply(message)}><Reply scale={5}/></IconButton>
    </div>, [message]);
    const MessageOptionsReceiver = useCallback(() => <div
        style={{display: "flex", marginLeft: "1rem", marginRight: "1rem"}}>
        <IconButton color={"inherit"} onClick={() => onReply(message)}><Reply scale={5}/></IconButton>
    </div>, [message]);
    const desktopOptionsProps = isDesktop ? {
        onMouseOver: async () => setOptions(true),
        onMouseOut: async () => setOptions(false)
    } : {};
    const [reply, setReply] = useState({
        dragging: false,
        message: null,
        disabled: !isDesktop,
        replied: false
    });
    useEffect(() => {
        if (reply.message && !reply.dragging) onReply(reply.message);
    }, [reply]);
    const isImage = message?.files?.find(({type}) => type === "kn.chats.IMAGE");
    const isAudio = message?.files?.find(({type}) => type === "kn.chats.AUDIO");
    return (
        <div {...desktopOptionsProps}
             style={{display: "flex", position: "relative", width: "100%", padding: "0.25rem", alignItems: "center"}}>
            {messageType === "sender" && <div style={{flexGrow: "1 1 auto", flex: 2}}/>}
            {(messageType === "receiver" && !continued) &&
                <Avatar imgProps={{referrerPolicy: "no-referrer"}} src={message.photoURL} title={message.email}
                        style={{width: "2rem", height: "2rem", marginRight: "0.5rem"}}/>}
            {options && messageType === "sender" && <div><MessageOptionsSender/></div>}
            {continued && <div style={{width: "2.5rem"}}/>}
            <Draggable
                enableUserSelectHack={true}
                axis="x"
                handle=".message-swipe-to-reply-handle"
                defaultPosition={{x: 0, y: 0}}
                position={!reply.dragging ? {x: 0, y: 0} : null}
                grid={[.1, .1]}
                cancel={".reply-cancel-element"}
                bounds={{
                    left: messageType === "sender" ? null : 0,
                    right: messageType === "receiver" ? null : 0
                }}
                scale={2}
                disabled={isDesktop || !message.message}
                onStart={() => setReply({...reply, dragging: true})}
                onDrag={async (a, {x}) => {
                    if (!reply.replied && messageType === "sender" && x <= -200) setReply({
                        ...reply,
                        replied: true,
                        dragging: false,
                        message: message
                    })
                    if (!reply.replied && messageType === "receiver" && x >= 200) setReply({
                        ...reply,
                        replied: true,
                        dragging: false,
                        message: message
                    })
                }}
                onStop={() => setReply({...reply, replied: false, dragging: false})}>
                <div
                    style={{
                        justifyContent: "center",
                        maxWidth: isDesktop ? "60%" : "80%",
                        flexDirection: "column",
                        display: "flex",
                    }}>
                    <div className={"reply"} style={{position: "relative"}}>
                        {replyingTo ? <div style={{
                            display: "flex",
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            opacity: ".5",
                            alignItems: "center",
                            paddingLeft: messageType === "sender" ? "3rem" : 0,
                            paddingRight: messageType === "receiver" ? "3rem" : 0
                        }}>
                            {replyingTo.files?.length ? replyingTo.files.map((file, index) => {
                                switch (file.type) {
                                    case "kn.chats.IMAGE":
                                        return (
                                            <ButtonBase key={index} disabled style={{padding: "0.5rem"}}>
                                                <img
                                                    alt={"nah u blind bitches can go fuck your self"}
                                                    loading={"lazy"}
                                                    // @ts-ignore
                                                    onError={(e) => (e.target.onerror = null, e.target.src = "/images/broken-image.jpeg")}
                                                    src={file.url} style={{
                                                    width: "100%",
                                                    maxWidth: "5rem",
                                                    height: "auto",
                                                    objectFit: "cover",
                                                    marginRight: "1rem",
                                                    borderTopLeftRadius: "1rem",
                                                    borderTopRightRadius: "1rem",
                                                    borderRadius: replyingTo.message.length ? "1rem" : "1rem"
                                                }}/>
                                            </ButtonBase>
                                        );
                                    case "kn.chats.AUDIO":
                                        return (
                                            <div key={index} style={{padding: "0.5rem", width: "10rem"}}>
                                                {/* @ts-ignore */}
                                                <VoiceMessage width={"10rem"} paper={true} url={file.url}/>
                                            </div>
                                        )
                                }
                            }) : null}
                            <Typography style={{paddingLeft: "0.5rem"}}
                                        variant={"body2"}>{replyingTo.message}</Typography>
                        </div> : null}
                    </div>
                    {isImage && <Fragment>
                        <ButtonBase onClick={() => window.open(isImage.url)}
                                    style={{borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem"}}>
                            <img
                                alt={"nah"}
                                // @ts-ignore
                                onError={(e) => (e.target.onerror = null, e.target.src = "/images/broken-image.jpeg")}
                                src={isImage.url} loading={"lazy"}
                                style={{
                                    width: "100%",
                                    maxWidth: "30rem",
                                    height: "auto",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "0.5rem",
                                    borderTopRightRadius: "0.5rem",
                                    borderRadius: message.message.length ? "inherit" : "1rem"
                                }}/>
                        </ButtonBase>
                    </Fragment>}
                    {isAudio && <div style={{
                        ...message.message.length ? {} : {borderRadius: "0.5rem"},
                        borderTopLeftRadius: "0.5rem!important",
                        borderTopRightRadius: "0.5rem!important",
                        width: "100%",
                        minWidth: isDesktop ? "25rem" : "15rem"
                    }}>
                        <VoiceMessage paper={!!!message.message.length} width={"100%"} url={isAudio.url}/>
                    </div>}
                    <Paper className={"message-swipe-to-reply-handle"} hidden={!!!message.message.length} style={{
                        backgroundColor: messageType === "sender" ? theme.palette.primary[theme.palette.mode === "dark" ? "dark" : "main"] : theme.palette.mode === "dark" ? theme.palette.grey["800"] : theme.palette.grey["200"],
                        padding: "0.5rem 1rem",
                        borderRadius: message?.files?.length ? "0 0 1rem  1rem" : "1rem",
                        // "&:hover": {backgroundColor: 'rgb(7, 177, 77, 0.42)'}
                    }} elevation={0}>
                        <Linkify
                            LinkProps={{target: '_blank', style: {fontWeight: "bold"}}}>
                            <Typography
                                style={{
                                    // filter: "brightness(2)",
                                    color: theme.palette.getContrastText(messageType === "sender" ? theme.palette.primary[theme.palette.mode === "dark" ? "dark" : "main"] : theme.palette.mode === "dark" ? theme.palette.grey["800"] : theme.palette.grey["200"]),
                                    wordBreak: "break-all"
                                }}>
                                {message.message}
                            </Typography>
                        </Linkify>
                    </Paper>
                </div>
            </Draggable>
            {options && messageType === "receiver" && <div><MessageOptionsReceiver/></div>}
            {/*{options && messageType === "receiver" && <div><MessageOptions/></div>}*/}
            {messageType === "receiver" && <div style={{flexGrow: "1 1 auto", flex: 1}}/>}
            {/*<div className={"message-swipe-to-reply-handle"} style={{backgroundColor: "red", left: messageType === "receiver" ? 0 : "80%", height: "50%", width: "30%", alignSelf: "center", position: "absolute"}}/>*/}
        </div>
    );
};
export default (Message);
