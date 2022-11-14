import {memo, useCallback, useContext, useEffect, useState} from "react";
// @ts-ignore
import dynamic from "next/dynamic";
import {getAudioContext} from "../../utils/audio";
import {InputContext} from "./Context";
import {useTheme} from "@mui/material/styles";
// @ts-ignore
const Check = dynamic(() => import("@mui/icons-material/Check"));
// @ts-ignore
const Mic = dynamic(() => import("@mui/icons-material/Mic"));
// @ts-ignore
const Pause = dynamic(() => import("@mui/icons-material/Pause"));
// @ts-ignore
const PlayArrow = dynamic(() => import("@mui/icons-material/PlayArrow"));
// @ts-ignore
const Replay = dynamic(() => import("@mui/icons-material/Replay"));
// @ts-ignore
const Save = dynamic(() => import("@mui/icons-material/Save"));
// @ts-ignore
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));
// @ts-ignore
const Drawer = dynamic(() => import("@mui/material/Drawer"));
// @ts-ignore
const ListItem = dynamic(() => import("@mui/material/ListItem"));
// @ts-ignore
const ListItemIcon = dynamic(() => import("@mui/material/ListItemIcon"));
// @ts-ignore
const ListItemSecondaryAction = dynamic(() => import("@mui/material/ListItemSecondaryAction"));
// @ts-ignore
const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
// @ts-ignore
const IconButton = dynamic(() => import("@mui/material/IconButton"));
// @ts-ignore
const Backdrop = dynamic(() => import("@mui/material/Backdrop"));
// @ts-ignore
const List = dynamic(() => import("@mui/material/List"));

export const AudioMessageSheet = () => {
    const [playback, setPlayback] = useState({
        playing: false,
        audioEl: null
    });
    const {voiceMessage, files, setFiles} = useContext(InputContext);
    const [saving, setSaving] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioSrc, setAudioSrc] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [width, setWidth] = useState(0);
    const getMediaStream = () => navigator.mediaDevices
        .getUserMedia({audio: true, video: false});
    const recordAudio = useCallback(async () => {
        const stream = await getMediaStream();
        const audioCtx = getAudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 32;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        let animId = null;
        // source.connect(audioCtx.destination);
        const draw = async () => {
            const array = new Uint8Array(analyser.frequencyBinCount); // item value of array: 0 - 255
            analyser.getByteFrequencyData(array);
            setWidth(array.reduce((p, c) => p + c) / array.length)
            mediaRecorder.state === ("recording" || "active") ? (animId = requestAnimationFrame(draw)) : cancelAnimationFrame(animId);
        }
        animId = requestAnimationFrame(draw);
        const options = {mimeType: 'audio/webm'};
        const recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.addEventListener('dataavailable', function (e) {
            if (e.data.size > 0) recordedChunks.push(e.data);
        });
        mediaRecorder.addEventListener('stop', function () {
            console.log("media recording stopped");
            const blob = new Blob(recordedChunks);
            setAudioSrc(URL.createObjectURL(blob));
            setAudioBlob(blob)
            analyser.disconnect();
            source.disconnect();
            audioCtx.close();
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            cancelAnimationFrame(animId);
        });
        mediaRecorder.start();
        setMediaRecorder(mediaRecorder);
    }, []);
    const playAudio = useCallback(() => {
        const audioEl = new Audio(audioSrc);
        audioEl.onloadeddata = () => audioEl.play().then(() => setPlayback({
            audioEl, playing: true
        }));
        audioEl.onended = () => {
            setPlayback({...playback, playing: false});
        }
    }, []);
    const theme = useTheme();
    useEffect(() => {
        if (voiceMessage.sheetOpen) {
            console.log("media recording started")
            recordAudio().then();
        }
        return () => {
            if ((mediaRecorder && mediaRecorder.state === ("recording" || "active"))) mediaRecorder.stop();
        }
    }, [voiceMessage.sheetOpen]);
    useEffect(() => {
        return () => {
            playback.audioEl?.pause();
        }
    }, [])
    return (
        <div>
            <Backdrop style={{zIndex: "9999"}} open={saving}>
                <CircularProgress>
                    <Save/>
                </CircularProgress>
            </Backdrop>
            <Drawer variant={"temporary"} onClose={async () => {
                if ((mediaRecorder && mediaRecorder.state === ("recording" || "active"))) return mediaRecorder.stop();
                if (!audioBlob) return voiceMessage.toggleSheet();
                setSaving(true);
                voiceMessage.toggleSheet();
                const formData = new FormData();
                const file = new File([audioBlob], "audio.webm", {
                    type: "audio/webm"
                })
                formData.append("file", file, file.name);
                const res = await fetch("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/upload.php?branch=vms-emulated", {
                    method: 'POST',
                    body: formData,
                    redirect: 'follow'
                }).then(r => r.json());
                setFiles([...files, {url: res.file.url, type: "kn.chats.AUDIO"}]);
                setSaving(false);
            }} open={voiceMessage.sheetOpen} anchor={"bottom"} PaperProps={{
                style: {
                    alignSelf: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: "30rem",
                    borderTopLeftRadius: "1rem",
                    borderTopRightRadius: "1rem",
                }
            }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            {(mediaRecorder && mediaRecorder.state === ("recording" || "active")) &&
                                <IconButton style={{
                                    margin: "1rem",
                                    outlineColor: theme.palette.primary.dark,
                                    outlineWidth: ((mediaRecorder && mediaRecorder.state === ("recording" || "active")) ? (width / 10) : 0) || "0rem",
                                    outlineStyle: "solid"
                                }}><Mic/></IconButton>}
                            {!(mediaRecorder && mediaRecorder.state === ("recording" || "active")) &&
                                (playback.playing ? <IconButton onClick={() => {
                                    playback.audioEl.pause();
                                    setPlayback({...playback, playing: false})
                                }} style={{
                                    margin: "1rem",
                                }}><Pause/></IconButton> : <IconButton onClick={playAudio} style={{
                                    margin: "1rem",
                                }}><PlayArrow/></IconButton>)}
                        </ListItemIcon>
                        <ListItemText style={{marginLeft: "1rem", width: "100%"}}
                                      primary={(mediaRecorder && mediaRecorder.state === ("recording" || "active")) ? "Recording..." : "Voice message recorded"}
                                      secondary={""}/>
                        <ListItemSecondaryAction>
                            {(audioSrc && !(mediaRecorder && mediaRecorder.state === ("recording" || "active"))) &&
                                <IconButton onClick={recordAudio}>
                                    <Replay/>
                                </IconButton>}
                            {(mediaRecorder && mediaRecorder.state === ("recording" || "active")) &&
                                <IconButton onClick={() => mediaRecorder.stop()}>
                                    <Check/>
                                </IconButton>}
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}
export default memo(AudioMessageSheet);