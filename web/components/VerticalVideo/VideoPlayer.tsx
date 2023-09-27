import {usePlayerState} from "../../zustand/VerticalVideo";
import ReactPlayer from "react-player";
import {Replay} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Delayed from "@/components/Delayed";
import {useContext, useEffect} from "react";
import {DrawerContext} from "root-contexts";

const TransparentBackground = {
    dark: {backgroundColor: 'transparent', backdropFilter: 'blur(6px) brightness(0.5)'},
    light: {backgroundColor: 'transparent', backdropFilter: 'blur(6px) brightness(2)'},
}
export const VideoPlayer = ({playing, url}) => {
    const playerState = usePlayerState();
    const {isDesktop} = useContext(DrawerContext)
    useEffect(() => {
        console.log(playerState["playback.played"], playerState["playback.duration"])
    }, [playerState["playback.duration"], playerState["playback.played"]])
    return (
        <div style={{position: 'relative', overflowY: "hidden"}}>
            <ReactPlayer playing={playing} config={{
                youtube: {playerVars: {modestbranding: 1, preload: true}}
            }} muted onDuration={d => playerState.updatePlaybackDuration(d)} onProgress={(t) => {
                playerState.updatePlaybackPlayed(t.played * playerState["playback.duration"]);
            }} controls={false} playsinline={false} stopOnUnmount height={`calc(100vh - ${!isDesktop ? 45 : 0}px)`}
                         style={{objectFit: 'cover', scale: 1., pointerEvents: 'none'}} url={url}/>
            {((playerState["playback.played"] && playerState["playback.duration"]) && (playerState["playback.played"] === playerState["playback.duration"])) &&
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: `100%`,
                    position: 'absolute',
                    zIndex: 999,
                    top: 0,
                    right: 0,
                    minHeight: '100vh',
                    background: 'black'
                }}>
                    <Button variant={'outlined'}>Watch Again <Replay sx={{ml: 2}}/></Button>
                </div>}
        </div>
    )
}