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

export default function Settings() {
    const {drawerWidth, isDesktop} = useContext(DrawerContext);
    const {isDev} = useContext(ActiveContext);
    const router = useRouter();
    const [t, sT] = useState('')
    return (
        <div style={{
            width: `calc(100% - ${isDesktop ? drawerWidth : 0}px`,
            marginLeft: isDesktop ? drawerWidth : 0,
            display: "flex", flexDirection: 'column'
        }}>
            <AppBar position={"sticky"} elevation={5}>
                <Toolbar>
                    <IconButton onClick={router.back}
                                style={{marginRight: "1rem", display: isDesktop ? "none" : "block", color: "inherit"}}>
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
                    <style>{`.config-ul li {padding-top: 1rem; padding-bottom: 1rem; border-top: 1px solid grey`}</style>
                    <ul className={'config-ul'} style={{padding: 0, listStyle: "none"}}>
                        <li style={{display: "flex"}} onClick={() => {
                            if (!!localStorage.getItem("kn.chats.devmode")) localStorage.removeItem("kn.chats.devmode");
                            else localStorage.setItem("kn.chats.devmode", "1");
                            alert("settings change refresh page to see changes");
                        }}>
                            <div style={{marginRight: "1rem"}}><input type={"checkbox"} checked={isDev}/></div>
                            <div>Development Mode</div>
                        </li>
                        <li>
                            <button onClick={() => window.location.reload()}>Refresh Page</button>
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
                            Send call notification: {'  '}
                            <button onClick={async () => {
                                const notif = new Notification("kn.chats.conversation.call.notification", {
                                    user: {
                                        name: 'TEST USER',
                                        photo: 'https://www.pngkey.com/png/full/133-1338704_384x384-warning-icon-material-design.png',
                                        id: 'kn.chats.test.user.id'
                                    },
                                    call: {
                                        session: `TEST-CALLID:${Math.random()}`
                                    },
                                    chat: {
                                        id: 'TEST-CONVERSATION',
                                        url: `https://chats.kabeersnetwork.tk/chat/TEST-CONVERSATION`
                                    },
                                });
                                await notif.dispatch([
                                    {
                                        "endpoint": "https://wns2-pn1p.notify.windows.com/w/?token=BQYAAAAVGwXLAfrQwlneWxXHCTb68vN2b1XGeFfg6go6PNB6mgYGeVIxI6Vls4Uc93MWKd%2fj%2b%2bW3Y4ccOUjapHLG4C90931yw1ceRUA%2fy3AU2SDhq%2flD9PQXFc%2fymkhxu79U6bZpTnisFqLSMnjjHxfXjeCexE66%2fsTj6KNMj8IOD1%2bC1%2fAOhTWmEO214on7e1ii85NXio7U4FjAx0Owt5fLW2hX7a%2b%2f5pJzpluZDUUAcbNL4v60Z7e7kEplSAo7OdAw0EExHnbs4abwho9R9x%2f1mhHuJyAlL4CO1w7mJn1o9SrkMA5WRdeBrJeR3OU5AU1Dt04%3d",
                                        "expirationTime": null,
                                        "keys": {
                                            "p256dh": "BGpLFhslMIsmapcC7VxkNviYicfSVln8VdA1plfpDMJo4N16to9LF2WkW1yeQFaxt6iErDhcMRvFeiHXXbdDyJ8",
                                            "auth": "7V-_cemm3B7sMg2zJV0H3A"
                                        }
                                    }
                                ])
                            }}>Send Call
                            </button>
                        </li>
                        <li>
                            <div>
                                <textarea placeholder={'paste subscriptions \\n here'} value={t}
                                          style={{width: '100%', height: '20rem'}}
                                          onChange={({target: {value}}) => sT(value)}/>
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