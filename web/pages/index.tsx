import Head from 'next/head';
import {ChatContext, DrawerContext} from "../Contexts";
import {Fragment, useContext, useEffect} from "react";
import {analytics} from "firebase-config";
import Skeleton from "@mui/material/Skeleton";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {Empty} from "@/components/Empty";
import {Feedback} from "@mui/icons-material";
import {Avatar, CircularProgress} from "@mui/material";

const Header = dynamic(() => import("../components/Header"))
const Box = dynamic(() => import("@mui/material/Box"))
const List = dynamic(() => import("@mui/material/List"))
const SpeedDial = dynamic(() => import("@mui/material/SpeedDial"))
const SpeedDialAction = dynamic(() => import("@mui/material/SpeedDialAction"))
const Fab = dynamic(() => import("@mui/material/Fab"))
const Zoom = dynamic(() => import("@mui/material/Zoom"))
const Add = dynamic(() => import("@mui/icons-material/Add"))
const AddComment = dynamic(() => import("@mui/icons-material/AddComment"))
const GroupAdd = dynamic(() => import("@mui/icons-material/GroupAdd"))
const ChatList = dynamic(() => import("../components/ChatList"), {
    loading: () => {
        const {isDesktop, drawerWidth} = useContext(DrawerContext);
        return <Skeleton variant={"rectangular"} width={isDesktop ? `calc(100% - ${drawerWidth}px)` : '100vw'}
                         style={{flex: 1}} height={"calc(100vh - 56px)"}/>
    }
})

export default function Home() {
    // @ts-ignore
    const {type, drawerWidth, mobileOpen, isDesktop} = useContext(DrawerContext);
    // @ts-ignore
    const {createChat, snapshots: {chats}, chatSnapshotLoading} = useContext(ChatContext);
    const router = useRouter();
    useEffect(() => {
        analytics().setCurrentScreen("kn.chats.scripts.index");
    }, []);
    return (
        <Fragment>
            <Head>
                <title>Chats</title>
            </Head>
            <div
                style={{marginLeft: type === "permanent" ? drawerWidth : 0, display: 'flex', flexDirection: "column", flex: 1, flexGrow: 1}}>
                <Header/>
                {!chats.loading && (
                    <Fragment>
                        {isDesktop && (
                            chats.data?.length ? <Empty variant={{
                                title: 'Welcome to Chats',
                                icon: () => <Avatar
                                                    src={"/images/icon-192.png"}/>,
                                description: 'Conversations will open here',
                                actions: [],
                            }}/> : <Empty variant={{
                                title: 'Chats you create will appear here',
                                icon: Feedback,
                                description: 'You currently have no chats. Create a new chat and it will appear here',
                                actions: [{
                                    title: 'Create Chat', onClick: async () => {
                                        const ref = await createChat();
                                        if (!ref) return; // user cancelled
                                        await router.push("/chat/" + ref.id)
                                    }
                                }],
                            }}/>
                        )}
                        {!isDesktop && (
                            chats.data?.length ? <List><ChatList expanded={true} chatsSnapshot={chats.data}/></List> : <Empty variant={{
                                title: 'Chats you create will appear here',
                                icon: Feedback,
                                description: 'You currently have no chats. Create a new chat and it will appear here',
                                actions: [{
                                    title: 'Create Chat', onClick: async () => {
                                        const ref = await createChat();
                                        if (!ref) return; // user cancelled
                                        await router.push("/chat/" + ref.id)
                                    }
                                }],
                            }}/>
                        )}
                    </Fragment>
                )}
                {chats.loading && <div style={{
                    display: "flex",
                    height: '100%',
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                }}>
                    <CircularProgress/>
                </div>}
            </div>
            <div style={{position: "fixed", bottom: "2rem", right: "1rem"}}>
                <Zoom in={(isDesktop ? true : !mobileOpen) && (!chatSnapshotLoading && chats)}>
                    <div>
                        <SpeedDial icon={<Add/>} color="tertiary" ariaLabel={"Create"}>
                            <SpeedDialAction
                                onClick={async () => {
                                    const ref = await createChat();
                                    if (!ref) return; // user cancelled
                                    await router.push("/chat/" + ref.id)
                                }}
                                icon={<AddComment/>}
                                tooltipTitle={"Create Chat"}
                            />
                            <SpeedDialAction
                                onClick={async () => {
                                    const ref = await createChat(undefined, {isGc: true});
                                    if (!ref) return; // user cancelled
                                    await router.push("/chat/" + ref.id)
                                }}
                                icon={<GroupAdd/>}
                                tooltipTitle={"Create Group Chat"}
                            />
                        </SpeedDial>
                    </div>
                </Zoom>
            </div>
        </Fragment>
    );
}
