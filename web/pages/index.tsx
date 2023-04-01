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
import {useConversations} from "../zustand/Home";
import ChatsBottomNavigation from "@/components/BottomNavigation";

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
    const {createChat} = useContext(ChatContext);
    const conversations = useConversations(state => state.conversations);
    const loading = useConversations(state => state.loading);
    // console.log('useConversations convos updated: ', _chats)
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
                {!loading && (
                    <Fragment>
                        {isDesktop && (
                            conversations?.length ? <Empty variant={{
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
                            conversations?.length ? <List><ChatList expanded={true} chatsSnapshot={conversations}/></List> : <Empty variant={{
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
                {loading && <div style={{
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
            <div style={{
                position: 'fixed',
                zIndex: 1,
                bottom: 30,
                left:  isDesktop ? undefined : 0,
                right: isDesktop ? '1rem' : 0,
                margin: isDesktop ? '0 auto' : undefined,
            }}>
                <Zoom in={(isDesktop ? true : !mobileOpen) && (!loading && conversations)}>
                    <div>
                        <SpeedDial icon={<Add color={"inherit"}/>} color="tertiary" ariaLabel={"Create"}>
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
