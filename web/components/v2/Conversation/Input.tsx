import {auth} from "firebase-config";
import {Fragment, useContext, useEffect, useRef, useState} from "react";
import {DrawerContext} from "root-contexts";
import dynamic from "next/dynamic";
import useNetwork from "@/hooks/useNetwork"
import InputBase from "@mui/material/InputBase"
import useTheme from "@mui/material/styles/useTheme";
import {useAuthState} from "react-firebase-hooks/auth";
import {debounce} from "@/utils/debounce";
import {Grow, Popover} from "@mui/material";
import {EmojiEmotions} from "@mui/icons-material";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Portal from '@mui/base/Portal';
import {useAudioMessageSheetState, useInput} from "@/zustand/v2/Conversation";
import {DropZoneContext} from "@/components/v2/Conversation/Conversation";
import {SendMessage} from "@/components/v2/Conversation/utils";

const ButtonBase = dynamic(() => import("@mui/material/ButtonBase"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const Paper = dynamic(() => import("@mui/material/Paper"));
const Slide = dynamic(() => import("@mui/material/Slide"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const Close = dynamic(() => import("@mui/icons-material/Close"));
const Image = dynamic(() => import("@mui/icons-material/Image"));
const Send = dynamic(() => import("@mui/icons-material/Send"));
const Mic = dynamic(() => import("@mui/icons-material/Mic"));
const VoiceMessage = dynamic(() => import("./VoiceMessage"), {
    ssr: false // Doesn't work when Server Side Rendered
});
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
    ssr: false // Doesn't work when Server Side Rendered
});

const InputEmojiButton = () => {
    const setText = useInput(state => state.setText);
    const text = useInput(state => state.state.text);
    const focused = useInput(state => state.state.focused);
    const {isDesktop} = useContext(DrawerContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);
    useEffect(() => {
        if (focused) handleClose()
    }, [focused]);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <Fragment>
            {(isDesktop && !focused) &&
                <IconButton color={"inherit"} aria-describedby={id}
                            onClick={(e) => open ? handleClose() : handleClick(e)}>
                    <EmojiEmotions/>
                </IconButton>}
            {isDesktop ? <Popover
                id={id}
                marginThreshold={70}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <div>
                    <EmojiPicker
                        onEmojiClick={({emoji}) => setText((text ?? "") + emoji)}/>
                </div>
            </Popover> : (
                <ClickAwayListener onClickAway={handleClose}>
                    <Fragment>
                        <Portal>
                            <Grow in={open} mountOnEnter unmountOnExit>
                                <div style={{
                                    position: 'absolute',
                                    width: '100vw',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    bottom: '5.2rem'
                                }}>
                                    <div style={{justifySelf: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                        <EmojiPicker
                                            width={"96vw"} height={"81vh"}
                                            onEmojiClick={({emoji}) => setText((text ?? "") + emoji)}/>
                                    </div>
                                </div>
                            </Grow>
                        </Portal>
                        {(!focused) &&
                            <IconButton color={"inherit"} aria-describedby={id}
                                        onClick={(e) => open ? handleClose() : handleClick(e)}>
                                <EmojiEmotions/>
                            </IconButton>}
                    </Fragment>
                </ClickAwayListener>
            )}
        </Fragment>
    );
}

function ChatInput() {
    const {isDesktop} = useContext(DrawerContext);
    const theme = useTheme();
    const [user] = useAuthState(auth);
    const input = useInput();
    const audioMessageSheetStateToggle = useAudioMessageSheetState(state => state.toggle);
    const {getInputProps} = useContext(DropZoneContext);
    const online = useNetwork();
    const inputRef = useRef();
    const onSend = (async () => {
        await SendMessage();
        // @ts-ignore
        if (inputRef.current) inputRef.current?.focus();
    });
    const isSafari = navigator ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;
    useEffect(() => {
        if (isSafari && !isDesktop) window?._KN_CHATS_DEV_KEYBOARD_TOGGLE?.(input.state.focused)
    }, [input.state.focused]);
    return (
        <Fragment>
            <div style={{position: 'fixed', top: 0}}><input type={'text'} hidden/></div>
            <Paper elevation={2} style={{
                backgroundColor: theme.palette.background.default,
                borderRadius: 0, display: "flex", flexDirection: "column",
                width: "100%", paddingLeft: "1rem", paddingRight: "1rem",
                position: "static", bottom: 0, paddingBottom: isDesktop ? '0.3rem' : "1.5rem", paddingTop: "0.3rem"
            }}>
                <Slide in={!!input.state.reply} direction={"up"}>
                    <div className={"reply-slide-up"}>{!!input.state.reply ? <div>
                        <Typography variant={"caption"} style={{paddingLeft: "0.5rem", color: "grey"}}>
                            Replying {' '}
                            to {(input.state.reply.user) === user.email ? "yourself" : input.state.reply.user}
                        </Typography>
                        <div style={{display: "flex", alignItems: "center", marginBottom: "0.25rem"}}>
                            <div>
                                {input.state.reply?.files?.length ? input.state.reply.files.map((file, index) => {
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
                                    {input.state.reply?.message}
                                </Typography>
                            </div>
                            <div style={{flex: 1}}/>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <IconButton onClick={() => input.setReply(null)}>
                                    <Close/>
                                </IconButton>
                            </div>
                        </div>
                    </div> : null}</div>
                </Slide>
                <Slide in={!!(input.state.files?.length)} direction={"up"}>
                    <div hidden={!input.state.files?.length} className={"files-preview-slide-up"}>
                        <div style={{
                            display: "flex",
                            marginBottom: "0.25rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            paddingTop: "0.5rem",
                            paddingBottom: "0.5rem"
                        }}>
                            <div>
                                {input.state.files?.length ? input.state.files.map((file, index) => {
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
                                <IconButton onClick={() => input.setFiles([])}>
                                    <Close/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Slide>
                <div style={{display: "flex", transitionDuration: ".4s"}}>
                    {(!!!input.state.files.length && !input.state.focused) &&
                        <IconButton color={"inherit"} disabled={!online} hidden={!!input.state.files.length}>
                            <label style={{padding: 0, margin: 0, height: "80%"}}>
                                <Image/>
                                <input {...getInputProps()} hidden/>
                            </label>
                        </IconButton>}
                    {(!!!input.state.files.length && !input.state.focused) &&
                        <IconButton color={"inherit"} disabled={!online} onClick={() => audioMessageSheetStateToggle()}>
                            <Mic/>
                        </IconButton>}
                    <InputEmojiButton/>
                    <InputBase
                        onBlur={() => {
                            input.setFocus(false);
                            console.log("focus lost", input.state)
                        }}
                        onFocus={() => {
                            input.setFocus(true);
                            console.log("focus gained")
                        }}
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
                            marginLeft: input.state.focused ? 0 : "1rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            borderRadius: ".5rem",
                            marginTop: "0.15rem",
                            marginBottom: "0.15rem",
                            transitionDuration: ".1s"
                        }}
                        value={input.state.text}
                        onKeyDown={debounce(e => e.keyCode === 13 ? onSend() : null)}
                        onChange={((e) => input.setText(e.target.value))}
                    />
                    {/* @ts-ignore */}
                    {/*<input type="text" style={{display: "none"}}/>*/}
                    <IconButton color={"inherit"} onClick={onSend} style={{marginLeft: "1rem"}}><Send/></IconButton>
                </div>
            </Paper>
        </Fragment>
    )
}

export default (ChatInput);