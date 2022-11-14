import {useContext, useEffect, useState} from "react";
import {ActiveContext, DrawerContext} from "../Contexts";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";
import {db} from "firebase-config";
import {Notification} from "@/utils/dispatch-notification";
import {atom, useRecoilState} from "recoil";

const SwVersion = () => {
    const [s, S] = useState({raw: "Loading..."});
    useEffect(() => {
        fetch("/internal-sw-version-info").then(r => r.text()).then((d) => S({
            raw: d,
            parsed: JSON.parse(d)
        })).catch(() => S({raw: "Error Loading"}));
    }, []);
    return <span><strong>{s.parsed && s.parsed?.cache?.version}</strong><br/><pre
        style={{
            marginLeft: "1rem",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap"
        }}>{s.parsed ? JSON.stringify(JSON.parse(s.raw), null, 2) : s.raw}</pre></span>
}
const textAreaAtom = atom({
    key: "textarea-atom",
    default: ''
});

export default function Settings() {
    const {drawerWidth, isDesktop} = useContext(DrawerContext);
    const {isDev} = useContext(ActiveContext);
    const router = useRouter();
    const [t, sT] = useRecoilState(textAreaAtom)
    return (
        <div style={{
            width: `calc(100% - ${isDesktop ? drawerWidth : 0}px`,
            marginLeft: isDesktop ? drawerWidth : 0,
            display: "flex", flexDirection: 'column'
        }}>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton onClick={router.back}
                                style={{marginRight: "1rem", display: isDesktop ? "none" : "block", color: "white"}}>
                        <ArrowBack/>
                    </IconButton>
                    <h3 style={{marginRight: "1rem"}}>Settings</h3>
                    <div style={{flex: 1, flexGrow: "1 1 auto"}}/>
                </Toolbar>
            </AppBar>
            <div>
                <div style={{padding: "1rem"}}>
                    <h2>App Settings</h2>
                    <br/>
                    <style>{`.config-ul li {padding-top: 1rem; padding-bottom: 1rem; border-top: 1px solid lightgrey}`}</style>
                    <ul className={'config-ul'} style={{padding: 0, listStyle: "none"}}>
                        <li style={{display: "flex"}} onClick={() => {
                            if (!!localStorage.getItem("kn.chats.devmode")) localStorage.removeItem("kn.chats.devmode");
                            else localStorage.setItem("kn.chats.devmode", "1");
                            alert("settings change refresh page to see changes");
                        }}>
                            <div style={{marginRight: "1rem"}}><input type={"checkbox"} checked={isDev}/></div>
                            <div>Development Mode</div>
                        </li>
                        <li style={{display: "flex"}} onClick={async () => {
                            await db.clearPersistence();
                            alert("settings change refresh page to see changes");
                        }}>
                            <div style={{marginRight: "1rem"}}><input type={"checkbox"} checked={true}/></div>
                            <div>Clear Firestore persistence</div>
                        </li>
                        <li>
                            <div>Service Worker Version: <SwVersion/></div>
                        </li>
                        <li>
                            <div>
                                <button onClick={() => fetch("/internal-sw-delete-cache").then(alert)}>Clear Cache
                                </button>
                            </div>
                        </li>
                        <li>
                            <div>
                                <textarea value={t} style={{width: '100%', height: '20rem'}}
                                          onChange={({target: {value}}) => sT(value)}></textarea>
                                <br/>
                                <button onClick={async () => {
                                    return console.log(t.split('\n\n'))
                                    const notif = new Notification("kn.chats.conversation.text.notification", {
                                        data: {
                                            message: "Test Notification: " + Math.floor(Math.round(Math.random())),
                                        },
                                        user: {
                                            id: 'test-user-id',
                                            name: 'test user',
                                            photo: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
                                        },
                                        chat: {
                                            id: Math.random(),
                                            url: `https://chats.kabeersnetwork.tk/_config#notificaton`
                                        }
                                    });
                                    await notif.dispatch([]).catch(() => {
                                        console.log("error sending notifications");
                                    });
                                }}>Send text notification
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}