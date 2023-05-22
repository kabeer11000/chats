// @ts-ignore
import dynamic from "next/dynamic";
import {useContext, useEffect} from "react";
import {DrawerContext} from "root-contexts";
// @ts-ignore
import {useRouter} from "next/router";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Options from "@/components/v2/Conversation/Options";
import Head from "next/head";
import {useConversationState} from "@/zustand/v2/Conversation";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "firebase-config";

const AppBar = dynamic(() => import("@mui/material/AppBar"));
const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const ArrowBack = dynamic(() => import("@mui/icons-material/ArrowBack"));
export default function OptionsPage({}) {
    // @ts-ignore
    const {drawerWidth, isDesktop} = useContext(DrawerContext);
    if (isDesktop) return
    const router = useRouter();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window : undefined,
    });
    const [user, userLoading] = useAuthState(auth);
    useEffect(() => {
        if (userLoading && !user) return ;
        useConversationState.getState().subscribe(router.query.id.toString(), user);
        return () => {
            useConversationState.getState().unsubscribe()
        }
    }, [userLoading]);
    return (
        <div style={{
            width: isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%",
            marginLeft: isDesktop ? drawerWidth : 0
        }}>
            <Head>
                <title>Conversation Options - Chats</title>
            </Head>
            <AppBar color={trigger ? 'primary' : 'default'} position="fixed" style={{
                width: isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%",
                marginLeft: isDesktop ? drawerWidth : 0
            }} elevation={trigger ? 2 : 0}>
                <Toolbar>
                    <IconButton color={'inherit'} onClick={() => router.back()} style={{marginRight: "1rem"}}>
                        <ArrowBack/>
                    </IconButton>
                    <Typography variant={"body1"}><strong>Conversation Options</strong></Typography>
                </Toolbar>
            </AppBar>
            <div style={{marginTop: "4rem"}}>
                <Options embedded={true}/>
            </div>
        </div>
    )
}