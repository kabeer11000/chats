import {auth} from "firebase-config";
import {Fragment, memo, useContext, useEffect, useRef} from "react";
import {DrawerContext} from "root-contexts";
// @ts-ignore
import dynamic from "next/dynamic";
import {InputContext, RootContext} from "./Context";
import useNetwork from "../../hooks/useNetwork"
// @ts-ignore for some reason ref's weren't working with the dynamic import
import InputBase from "@mui/material/InputBase"
// @ts-ignore
import useTheme from "@mui/material/styles/useTheme";
// @ts-ignore
import {useAuthState} from "react-firebase-hooks/auth";
// import {debounce} from "../../utils/debounce";
// import AppBar from "@mui/material/AppBar";
// @ts-ignore
const ButtonBase = dynamic(() => import("@mui/material/ButtonBase"));
// @ts-ignore
const VoiceMessage = dynamic(() => import("./VoiceMessage"), {
    ssr: false
});
// @ts-ignore
// const InputBase = dynamic(() => import("@mui/material/InputBase"), {
//     ssr: false
// });
// @ts-ignore
const Divider = dynamic(() => import("@mui/material/Divider"));
// @ts-ignore
const IconButton = dynamic(() => import("@mui/material/IconButton"));
// @ts-ignore
const Paper = dynamic(() => import("@mui/material/Paper"));
// @ts-ignore
const Slide = dynamic(() => import("@mui/material/Slide"));
// @ts-ignore
const Typography = dynamic(() => import("@mui/material/Typography"));
// @ts-ignore
const Close = dynamic(() => import("@mui/icons-material/Close"));
// @ts-ignore
const Image = dynamic(() => import("@mui/icons-material/Image"));
// @ts-ignore
const Send = dynamic(() => import("@mui/icons-material/Send"));
// @ts-ignore
const Mic = dynamic(() => import("@mui/icons-material/Mic"));

function ChatInput() {
    // @ts-ignore
    const {drawerWidth, isDesktop} = useContext(DrawerContext);
    const theme = useTheme();
    const [user] = useAuthState(auth);
    const {text, inputFocused, setInputFocused, setFiles, files, setText, voiceMessage} = useContext(InputContext);
    const {reply, methods: {onReply, SendMessage}, Files: fileContext} = useContext(RootContext);
    const inputRef = useRef();
    const online = useNetwork()
    const onSend = (async () => {
        await SendMessage()
        // @ts-ignore
        if (inputRef.current) inputRef.current?.focus();
    });
    const isSafari = navigator ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;
    useEffect(() => {
        console.log('isSafari and !isDesktop', (isSafari && !isDesktop))
        if (isSafari && !isDesktop) window._KN_CHATS_DEV_KEYBOARD_TOGGLE(inputFocused)
    }, [inputFocused])
    return (
        <Fragment>
            <div style={{position: 'fixed', top: 0}}><input type={'text'} hidden/></div>
            <Paper elevation={2} style={{
                backgroundColor: theme.palette.background.default,
                borderRadius: 0, display: "flex", flexDirection: "column",
                width: "100%", paddingLeft: "1rem", paddingRight: "1rem",
                position: "static", bottom: 0, paddingBottom: isDesktop ? '0.3rem' : "1.5rem", paddingTop: "0.3rem"
            }}>
                <Slide in={!!reply.data.message} direction={"up"}>
                    <div className={"reply-slide-up"}>{!!reply.data.message ? <div>
                        <Typography variant={"caption"} style={{paddingLeft: "0.5rem", color: "grey"}}>
                            Replying {' '}
                            {/* @ts-ignore */}
                            to {(reply.data.message.user) === user.email ? "yourself" : reply.data.message.user}
                        </Typography>
                        <div style={{display: "flex", alignItems: "center", marginBottom: "0.25rem"}}>
                            <div>
                                {/* @ts-ignore */}
                                {reply.data.message?.files?.length ? reply.data.message.files.map((file, index) => {
                                    switch (file.type) {
                                        case "kn.chats.IMAGE":
                                            return (
                                                <ButtonBase key={index} style={{padding: "0.5rem"}}>
                                                    <img alt={"image"}
                                                         style={{width: "4rem", height: "auto", borderRadius: "0.5rem"}}
                                                        /* @ts-ignore */
                                                         src={file.url}/>
                                                </ButtonBase>
                                            );
                                        case "kn.chats.AUDIO":
                                            return (
                                                <ButtonBase key={index} disabled style={{padding: "0.5rem"}}>
                                                    {/* @ts-ignore */}
                                                    <VoiceMessage paper={true} url={file.url}/>
                                                </ButtonBase>
                                            )
                                    }
                                }) : null}
                                <Typography style={{
                                    paddingLeft: "0.5rem", whiteSpace: "nowrap",
                                    width: "100%", overflowX: "hidden", textOverflow: "ellipsis"
                                }}>
                                    {/* @ts-ignore */}
                                    {reply.data.message?.message}
                                </Typography>
                            </div>
                            <div style={{flex: 1}}/>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <IconButton onClick={() => onReply(null)}>
                                    <Close/>
                                </IconButton>
                            </div>
                        </div>
                    </div> : null}</div>
                </Slide>
                <Slide in={!!(files?.length)} direction={"up"}>
                    <div hidden={!files?.length} className={"files-preview-slide-up"}>
                        <div style={{
                            display: "flex",
                            marginBottom: "0.25rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            paddingTop: "0.5rem",
                            paddingBottom: "0.5rem"
                        }}>
                            <div>
                                {files?.length ? files.map((file, index) => {
                                    switch (file.type) {
                                        case "kn.chats.IMAGE":
                                            return (
                                                <ButtonBase key={index}>
                                                    <img alt={"image"}
                                                         style={{width: "4rem", height: "auto", borderRadius: "0.5rem"}}
                                                        /* @ts-ignore */
                                                         src={file.url}/>
                                                </ButtonBase>
                                            );
                                        case "kn.chats.AUDIO":
                                            return (
                                                <ButtonBase key={index}>
                                                    <VoiceMessage paper={true} width={isDesktop ? "30vw" : "70vw"}
                                                                  url={file.url} noMargin={undefined}/>
                                                </ButtonBase>
                                            )
                                    }
                                }) : null}
                            </div>
                            <div style={{flex: 1}}/>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <IconButton onClick={() => setFiles([])}>
                                    <Close/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Slide>
                <div style={{display: "flex", transitionDuration: ".4s"}}>
                    {(!!!files.length && !inputFocused) &&
                        <IconButton color={"inherit"} disabled={!online} hidden={!!files.length}>
                            <label style={{padding: 0, margin: 0, height: "80%"}}>
                                <Image/>
                                <input {...fileContext.Dropzone.getInputProps()} hidden/>
                            </label>
                        </IconButton>}
                    {(!!!files.length && !inputFocused) &&
                        <IconButton color={"inherit"} disabled={!online} onClick={voiceMessage.toggleSheet}>
                            <Mic/>
                        </IconButton>}
                    <InputBase
                        onBlur={() => setInputFocused(false)}
                        onFocus={() => setInputFocused(true)}
                        autoFocus={true}
                        ref={inputRef}
                        autoComplete={"off"}
                        type={"text"}
                        placeholder={"Message..."}
                        style={{
                            inputSecurity: "none",
                            backgroundColor: (theme?.mode ?? theme.palette.mode) === "dark" ? "rgba(236, 236, 236, 0.1)" : "rgba(236, 236, 236, 0.7)",
                            flex: 1,
                            height: 40.5,
                            marginLeft: inputFocused ? 0 : "1rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            borderRadius: ".5rem",
                            marginTop: "0.15rem",
                            marginBottom: "0.15rem",
                            transitionDuration: ".1s"
                        }}
                        value={text}
                        onKeyDown={e => e.keyCode === 13 ? onSend() : null}
                        onChange={(e) => setText(e.target.value)}
                    />
                    {/* @ts-ignore */}
                    <input type="text" style={{display: "none"}}/>
                    <IconButton color={"inherit"} onClick={onSend} style={{marginLeft: "1rem"}}><Send/></IconButton>
                </div>
            </Paper>
        </Fragment>
    )
}

export default memo(ChatInput);