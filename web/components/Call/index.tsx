import {useRouter} from "next/router";
import {useContext, useEffect} from "react";
import DynamicSidebarContent from "@/styles/containers/DynamicSidebarContent";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "firebase-config";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {Avatar, CircularProgress, ListItemText} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {CallEnd, Mic, VolumeUp} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {ActiveContext} from "root-contexts";
import {CreatePeer} from "@/rtc/v1";
import md5 from "@/utils/md5";
import Head from "next/head";
import Typography from "@mui/material/Typography";
import {converter} from "@/components/v2/Conversation/utils";

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

const AnimatedBackground = () => {
    // const [state, setState] = useState(0.);
    // useEffect(() => {
    //     const i = setInterval(() => setState(randomNumber(0.1, 1)), 1000);
    //     return () => clearInterval(i);
    // }, [])
    const theme = useTheme();
    return (
        //  brightness(${state})
        <div style={{
            height: '100vh',
            width: '100vw',
            backgroundSize: '600% 600%',
            pointerEvents: "none",
            position: 'fixed',
            background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.tertiary.main}, ${theme.palette.tertiary.main})`,
            animation: 'gradient 10s ease infinite'
        }}/>
        // <img src={'https://gifimage.net/wp-content/uploads/2018/06/tumblr-background-gif-8.gif'} style={{ pointerEvents:"none", transitionDuration: '1s', animationDelay: '1s', height: "100vh", width: '100vw', opacity: 0.4, filter:`blur(2px)`, position: 'absolute'}}/>
    )
}
export default function Call() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const theme = useTheme();
    const [chat, chatLoading] = useDocumentData(router.isReady ? db.collection("chats").doc(router.query.id) : null);
    const [members, membersLoading] = useCollectionData((!chatLoading && chat) ? db.collection("users").where("email", "in", chat.users).withConverter(converter) : null); //
    // const [subscriptions, setSubscriptions] = useState([]);
    console.log('updated', router.isReady);
    useEffect(() => {
        if (membersLoading || !members.length || !user || !members.filter(({id}) => id !== user.uid)) return;
        // alert(`Call ${members.filter(({id}) => id !== user.uid).map(({email}) => email).join(", ")} ?`);
        const audio = new Audio('/files/call_tune.mp3');
        // audio.onloadeddata = () => audio.play();
        audio.loop = true;
        window.document.body.append(audio);
        return () => {
            // audio.pause();
            window.document.body.removeChild(audio);
        }
    }, [members, user]);
    useEffect(() => {
        if (membersLoading || !members.length || !user || !members.filter(({id}) => id !== user.uid)) return;
        // console.log('My Peer ID: ', `${user.uid}`);
        const myId = md5(`${router.query.id}:${router.query.room}:${user.uid}`);
        const remoteId = md5(`${router.query.id}:${router.query.room}:${members.filter(({id}) => id !== user.uid)?.[0]?.id}`);
        CreatePeer(myId).then(async peer => {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: false, audio: {
                    autoGainControl: false,
                    channelCount: 2,
                    echoCancellation: false,
                    latency: 0,
                    noiseSuppression: false,
                    sampleRate: 48000,
                    sampleSize: 16
                }
            });
            if (router.query.answer) {
                peer.on('connection', (conn) => {
                    conn.on('data', (d) => {
                        if (d.type === 'latency_test') console.log('Latency on connection channel: ', Date.now() - d.d);
                    })
                    console.log('peer found');
                    peer.on("call", (call) => {
                        console.log('incoming call, answering');
                        // Answer the call, providing our mediaStream
                        call.answer(mediaStream);
                        // call.answer();
                        call.on('stream', stream => {
                            console.log('connected to peer')
                            const audio = new Audio();
                            audio.autoplay = true;
                            audio.srcObject = stream;
                        });
                    });
                })
            } else {
                const conn = peer.connect(remoteId, {
                    reliable: true
                });
                conn.on('open', () => {
                    conn.send({type: 'latency_test', d: Date.now()});
                    console.log('calling peer: ', remoteId)
                    const call = peer.call(remoteId, mediaStream);
                    call.on('stream', stream => {
                        console.log('connected to peer')
                        const audio = new Audio();
                        audio.autoplay = true;
                        audio.srcObject = stream;
                        audio.play();
                    })
                })
            }
            console.log('Finding Peer with ID: ', remoteId);
        });
        // window.addEventListener("blur", () => window.close());
    }, [user, router.isReady, members])
    const {isDev} = useContext(ActiveContext);
    return (
        <DynamicSidebarContent>
            {(!(chatLoading || membersLoading) && (chat && members)) && <div style={{
                display: 'flex',
                backgroundSize: '600% 600%',
                background: `linear-gradient(-45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark}, ${theme.palette.tertiary.dark}, ${theme.palette.tertiary.dark})`,
                animation: 'gradient 10s ease infinite',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <Head>
                    <title>{(members.filter(({id}) => id !== user.uid).length > 1) ? (chat.name ?? ('Group calling ' + members?.filter(({id}) => id !== user.uid).map(({email}) => email).join(", "))) : ('Calling ' + members?.filter(({id}) => id !== user.uid).map(({email}) => email).join(", "))} -
                        Kabeer Chats</title>
                </Head>
                {isDev && <div>
                    <button onClick={window.location.reload}>reload</button>
                </div>}
                <div style={{flex: 6, paddingTop: '20%', textAlign: 'center'}}>
                    <div style={{
                        display: 'flex',
                        padding: '1rem',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {members.filter(({id}) => id !== user.uid).map((user) => (
                            <IconButton key={user.id}>
                                <Avatar variant={'circular'} style={{width: '5rem', height: '5rem'}}
                                        src={user.photoURL}/>
                            </IconButton>
                        ))}
                    </div>
                    <ListItemText secondary={'Calling...'}
                                  primary={<Typography variant={"h6"}>{(members.filter(({id}) => id !== user.uid).length > 1) ? (chat.name ?? (/* GC */ members?.filter(({id}) => id !== user.uid).map(({email}) => email).join(", "))) : (/* Calling */  members?.filter(({id}) => id !== user.uid).map(({email}) => email).join(", "))}</Typography>}/>
                </div>
                <Paper elevation={5} style={{
                    paddingLeft: '5rem',
                    borderRadius: '2rem 2rem 0 0',
                    paddingTop: '2.5rem',
                    paddingRight: '5rem',
                    flex: 1,
                    bottom: 0,
                    position: 'sticky'
                }}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <IconButton size={'medium'} style={{
                            width: '3.5rem',
                            height: '3.5rem',
                        }}>
                            <Mic scale={40}/>
                        </IconButton>
                        <IconButton size={'medium'} style={{
                            width: '3.5rem',
                            height: '3.5rem',
                        }}>
                            <VolumeUp scale={40}/>
                        </IconButton>
                        <IconButton size={'medium'} style={{
                            width: '3.5rem',
                            height: '3.5rem',
                            backgroundColor: '#E4361D'
                        }}>
                            <CallEnd scale={40} style={{color: 'white'}}/>
                        </IconButton>
                    </div>
                </Paper>
            </div>}
            {((membersLoading || chatLoading) && (!members || !chat)) && <div
                style={{flex: 1, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress/>
            </div>}
            {/*<AnimatedBackground/>*/}
        </DynamicSidebarContent>
    );
};
