import Head from 'next/head';
// import firebase from "firebase/app"
// import "firebase/auth"
import {analytics, auth} from 'firebase-config';
import {useContext, useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import dynamic from "next/dynamic";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import DynamicSidebarContent from "@/styles/containers/DynamicSidebarContent";
import {Splide, SplideSlide} from '@splidejs/react-splide';
import Paper from "@mui/material/Paper";
import {Avatar, Grow, List, ListItem, Slider, Zoom} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {ArrowBack, Favorite, VolumeUp} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {DrawerContext} from "root-contexts";
// import {Capacitor} from "@capacitor/core";
import {VideoPlayer} from "@/components/VerticalVideo/VideoPlayer";
import {usePlayerState, useVideo} from "../zustand/VerticalVideo";
import {ThemeModeContext} from "@/styles/theme";
import {useConfirm} from "material-ui-confirm";

const Box = dynamic(() => import("@mui/material/Box"))
const Button = dynamic(() => import("@mui/material/Button"))
const Container = dynamic(() => import("@mui/material/Container"))
const Grid = dynamic(() => import("@mui/material/Grid"))
const Typography = dynamic(() => import("@mui/material/Typography"));

const sampleVideos = [
    'https://www.youtube.com/shorts/bABklp0y-lE',
    'https://www.youtube.com/shorts/Rl5Uwd4qvFQ',
    'https://www.youtube.com/shorts/La_KmOKq06g',
    'https://www.youtube.com/shorts/La_KmOKq06g',
    'https://www.youtube.com/shorts/h1be2tBFo6Q',
    'https://www.youtube.com/shorts/PI9JeUz80lw'
];
const TransparentBackground = {
    dark: {background: 'transparent', '-webkit-backdrop-filter': 'blur(6px) brightness(0.5)', backdropFilter: 'blur(6px) brightness(0.5)'},
    light: {background: 'transparent', '-webkit-backdrop-filter': 'blur(6px) brightness(0.5)', backdropFilter: 'blur(6px) brightness(2)'},
}
export const PlayerSlider = () => {
    const sliderState = usePlayerState(state => ({
        "playback.duration": state["playback.duration"],
        "playback.played": state["playback.played"]
    }))
    return (
        <Slider
            sx={{
                padding: 0, margin: 0,
                "& .MuiSlider-thumb": {
                    display: 'none'
                },
                "& .MuiSlider-valueLabelLabel": {
                    display: 'none'
                }
            }} style={{width: '100%'}}
            size="small" orientation={"horizontal"} value={sliderState["playback.played"] ?? 0}
            max={sliderState["playback.duration"] ?? 0}/>
    )
}
export const Feed = () => {
    useEffect(() => {
        analytics().setCurrentScreen("feed_screen");
    }, []);
    const [user] = useAuthState(auth);
    const playerState = usePlayerState(state => ({
        // duration: state["playback.duration"],
        // played: state["playback.played"],
        updatePlaybackPlayed: state.updatePlaybackPlayed,
        updatePlaybackDuration: state.updatePlaybackDuration
    }))
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    const [timeout, setTransitionTimeout] = useState(0);
    const theme = useTheme();
    const video = useVideo()
    const [state, setState] = useState(0);
    const confirm = useConfirm();
    const {toggleThemeMode} = useContext(ThemeModeContext);
    useEffect(() => {
        if (!localStorage.getItem('kn.chats.minis.experimental-prompt')) confirm({cancellationButtonProps: {style: {display: 'none'}}, confirmationText: 'Got It', title: 'Experimental Feed', description: <>Mini's are a experiment, they're currently static 5 videos while we're testing. <br/>This will hopefully be a fun feed in the future <br/><br/>Leave your feedback at <a href={"mailto:kabeer@kabeers.network"}>kabeer@kabeers.network</a></>}).then(() => {
            localStorage.setItem('kn.chats.minis.experimental-prompt', 1);
        });
        toggleThemeMode();
        return () => toggleThemeMode();
    }, []);
    useEffect(() => {
        video.updateLikedState(false);
    }, [state]);
    return (
        <DynamicSidebarContent>
            <div style={{position: 'relative', height: 'calc(100vh - 45px)'}}>
                <Head>
                    <title>Feed - {user.displayName}</title>
                </Head>
                <AppBar elevation={6} position={'fixed'} style={{
                    ...TransparentBackground[theme.palette.mode],
                    width: `calc(100vw - ${isDesktop ? drawerWidth : 0}px)`,
                    background: theme.palette.mode === 'dark' ? 'linear-gradient(to top, transparent 0%, black 80%)' : 'linear-gradient(to top, transparent 0%, black 70%)'
                }}>
                    <Toolbar>
                        {!isDesktop && <IconButton>
                            <ArrowBack style={{color: 'white'}}/>
                        </IconButton>}
                        <Typography sx={{ml: '1rem'}} style={{color: 'white'}} variant={'h6'}
                                    color={'inherit'}>Minis</Typography>
                        <div style={{flexGrow: '1'}}/>
                        <IconButton>
                            <VolumeUp style={{color: 'white'}}/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: '100%', overflowY: 'hidden',
                    }}>
                    {/* @ts-ignore */}
                    <Splide onMoved={(e, newIndex) => {
                        playerState.updatePlaybackPlayed(-1);
                        // playerState.updatePlaybackDuration(0);
                        setState(newIndex);
                    }} options={{
                        snap: true,
                        height: `calc(100vh - ${!isDesktop ? 45 : 0}px)`,
                        arrows: false,
                        autoWidth: true,
                        drag: true,
                        pagination: false,
                        padding: 0,
                        direction: "ttb",
                    }}>
                        {sampleVideos.map((v, index) => (
                            <SplideSlide onDoubleClick={() => {
                                setTransitionTimeout(1)
                                video.updateLikedState();
                                setTimeout(() => setTransitionTimeout(0), 400);
                            }} style={{height: `calc(100vh - ${!isDesktop ? 45 : 0}px)`, position: 'relative'}} key={index}>
                                <VideoPlayer playing={state === index} url={v}/>
                                <div style={{
                                    position: "absolute",
                                    zIndex: 999,
                                    right: 0,
                                    bottom: isDesktop ? '0rem' : '.5rem',
                                    width: '100%', // `calc(100vw - ${isDesktop ? drawerWidth : 0}px)`,
                                    paddingLeft: '0rem',
                                    paddingRight: '0rem'
                                }}>
                                    <PlayerSlider/>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minWidth: `100%`,
                                    position: 'absolute',
                                    zIndex: 999,
                                    top: 0,
                                    right: 0,
                                    minHeight: `calc(100vh - ${!isDesktop ? 45 : 0}px)`,
                                }}>
                                    <Grow in={!!(video.metadata.liked && timeout)} className={'chats-feed-just-liked'}>
                                        <Favorite style={{fontSize: '7rem', color: 'red'}}/>
                                    </Grow>
                                </div>
                            </SplideSlide>
                        ))}
                    </Splide>
                    <Paper elevation={6} style={{
                        position: "fixed", right: '1rem',
                        bottom: '30vh', ...TransparentBackground[theme.palette.mode]
                    }}>
                        <List>
                            <ListItem>
                                <IconButton>
                                    <Avatar
                                        src={'https://raw.githubusercontent.com/Splidejs/react-splide/HEAD/images/logo.svg'}/>
                                </IconButton>
                            </ListItem>
                            <ListItem>
                                <IconButton>
                                    <Favorite style={{color: video.metadata.liked ? "red" : "white"}}
                                              fontSize={"large"}/>
                                </IconButton>
                            </ListItem>
                        </List>
                    </Paper>
                </div>
            </div>
        </DynamicSidebarContent>
    );
};

export default Feed;
