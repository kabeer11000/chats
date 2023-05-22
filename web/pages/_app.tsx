import {Suspense, useContext, useEffect, useState} from 'react';
// @ts-ignore
import {useAuthState} from 'react-firebase-hooks/auth';
// @ts-ignore
import firebase from 'firebase/app';
// @ts-ignore
import "firebase/firestore";
// import 'react-virtualized/styles.css'; // only needs to be imported once
import {analytics, auth, db} from 'firebase-config';
import {ActiveContext, CapabilitiesProvider, DrawerContext, DrawerProvider} from "../Contexts";
import {v4} from "uuid";
import {registerNotifications} from "@/utils/notifications";
// import serviceWorker from "../worker";
// @ts-ignore
import dynamic from 'next/dynamic';
import '../styles/globals.css';
import useDevMode from "../hooks/useDevMode";
import {simpleHash} from "@/utils/thirdparty/simpleHash";
import NoSSR from "@/components/NoSSR";
// import convert from "../reg-to-dynamic";
// import {getThemedComponents} from "../styles/theme";
// @ts-ignore
import createTheme from "@mui/material/styles/createTheme";
// @ts-ignore
import useMediaQuery from "@mui/material/useMediaQuery";
// @ts-ignore
import {unstable_ClassNameGenerator as ClassNameGenerator} from "@mui/material/className";
import {useTheme} from "@mui/material/styles";
import InstallPrompt from "@/components/InstallationPrompt";
import Head from "next/head";
import {ConfirmProvider, useConfirm} from "material-ui-confirm";
import {OfflinePrompt} from "@/components/OfflinePrompt";
import {ConversationsProvider} from "../zustand/Home";
import ChatsBottomNavigation from "@/components/BottomNavigation";
import {useRouter} from "next/router";
import DynamicSidebarContent from "@/styles/containers/DynamicSidebarContent";
import '@splidejs/react-splide/css';
// import {enableIndexedDbPersistence} from "@firebase/firestore";

// @ts-ignore
const Skeleton = dynamic(() => import('@mui/material/Skeleton'))
// @ts-ignore
const CircularProgress = dynamic(() => import('@mui/material/CircularProgress'))
// @ts-ignore
// const ThemeProvider = dynamic(() => import('@mui/material/styles/ThemeProvider'))
// @ts-ignore
// const CssBaseline = dynamic(() => import('@mui/material/CssBaseline'))
// @ts-ignore
const Script = dynamic(() => import('next/script'))
// @ts-ignore
const Login = dynamic(() => import('./account'))
const ErrorBoundary = dynamic(() => import("../components/ErrorBoundary"));
const CreateGC = dynamic(() => import("../components/CreateGC"));
const ThemeModeProvider = dynamic(() => import('../styles/theme/context/ThemeModeContext'))
const ThemeSchemeProvider = dynamic(() => import('../styles/theme/context/ThemeSchemeContext'))
const M3ThemeProvider = dynamic(() => import('../styles/theme/m3/M3ThemeProvider'))
// import ThemeModeProvider from '../styles/theme/context/ThemeModeContext';
// import ThemeSchemeProvider from '../styles/theme/context/ThemeSchemeContext';
// import M3ThemeProvider from '../styles/theme/m3/M3ThemeProvider';

ClassNameGenerator.configure((componentName) => simpleHash(componentName));
const SideBar = dynamic(() => import('@/components/SideBar'), {
    loading: () => {
        // @ts-ignore
        const {isDesktop, drawerWidth} = useContext(DrawerContext);
        return <Skeleton variant="rectangular" style={{position: "fixed", left: 0, top: 0}}
                         width={isDesktop ? drawerWidth : 0} height={"100vh"}/>
    }
});
const VirtualKeyBoardDEV = ({isDev}) => {
    const [open, setOpen] = useState(false);
    const toggle = (c) => {
        setOpen((typeof c) === 'boolean' ? c : !open);
        console.log('keyboard ' + (((typeof c) === 'boolean' ? c : !open) ? 'opened' : 'closed') + ', is Dev: ' + isDev)
    }
    useEffect(() => {
        window._KN_CHATS_DEV_KEYBOARD_TOGGLE = toggle;
    }, []);
    return (
        <div style={{
            width: '100%',
            bottom: 0,
            backgroundColor: isDev ? 'orange' : 'transparent',
            height: open ? '35vh' : '0'
        }}/>
    )
}
// @ts-ignore
const NextNProgress = dynamic(() => import('nextjs-progressbar'));
const variants = {
    hidden: {opacity: 0, x: -200, y: 0},
    enter: {opacity: 1, x: 0, y: 0},
    exit: {opacity: 0, x: 0, y: -100},
}
const NotificationComponent = () => {
    const [user] = useAuthState(auth);
    const confirmDialog = useConfirm();
    const registerServiceWorker = async (notif?: boolean) => {
        if (localStorage.getItem("kn.support.alert.noServiceWorkerSupport") && !("serviceWorker" in navigator)) return;
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/./serviceWorker.js").then((registration) => {
                console.log("Service Worker registration successful with scope: ", registration.scope);
                if (notif && !('pushManager' in registration) || !("Notification" in window)) return confirmDialog({
                    title: "Notification Error",
                    description: "Push notifications are not supported in your browser. switch to chromium or safari, or update your browser and try again"
                });
                if ((registration.active?.state === "activated") && notif) Notification.requestPermission().then((status) => {
                    sessionStorage.setItem('kn.chats.notifications.status', status);
                    if (status === "granted") registerNotifications(registration, user);
                    else console.log("Permissions refused");
                }).catch(console.log);
            }, (err) => console.log("Service Worker registration failed: ", err));
        } else {
            if (localStorage.getItem("kn.support.alert.noServiceWorkerSupport")) return;
            await confirmDialog({
                title: "Unsupported Browser",
                description: "Your browser doesn't support modern web standards, features like notifications, and offline will be unavailable"
            });
            localStorage.setItem("kn.support.alert.noServiceWorkerSupport", "1");
        }
    }
    useEffect(() => {
        console.log("%c Re-registered service worker", 'background-color: orange; color: white');
        if (!user) return;
        db.collection('users').doc(user.uid).set({
            email: user.email, lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL, user: user.toJSON()
        }, {merge: true});
        if (("Notification" in window) && (Notification.permission === "default") && (sessionStorage.getItem('kn.chats.notifications.status') !== "denied")) confirmDialog({
            title: 'Never miss a message',
            confirmationText: 'Accept and Allow',
            description: 'Allow notifications to receive messages and calls alerts right on your home screen'
        }).then(() => registerServiceWorker(true)).catch(null);
        else registerServiceWorker(false).then(() => console.log('notifications already granted'));
        console.log(navigator.serviceWorker.ready)
    }, [user]);
    return <></>;//<div style={{zIndex: 999999, position: 'fixed', top: 0}}><button onClick={() => loadConversations(user)}>Load Conversations again</button></div>;
}
export default function App({Component, pageProps}) {
    const [isDev, setIsDev] = useState(false);
    const [user, loading] = useAuthState(auth);
    const theme = useTheme();
    const [persisting, setPersisting] = useState(false);
    const router = useRouter();

    const setupFirestorePersistence = async () => {
        if (!localStorage.getItem("kn.firestore.SDK_VERSION") || localStorage.getItem("kn.firestore.SDK_VERSION") !== firebase.SDK_VERSION) {
            // localStorage.clear();
            // const databases = await indexedDB.databases();
            // for (const database of databases) await indexedDB.deleteDatabase(database.name);
        }
        if (!!localStorage.getItem("kn.firestore.persisting")) db.enablePersistence({synchronizeTabs: false}).then(() => {
            console.log("offline persistence enabled");
            localStorage.setItem("kn.firestore.persisting", "1");
            localStorage.setItem("kn.firestore.SDK_VERSION", firebase.SDK_VERSION);
            setPersisting(true);
        });
    }
    useEffect(() => {
        setupFirestorePersistence().catch(console.log);
        setIsDev(useDevMode());
        if (!window.localStorage.getItem("push.device")) window.localStorage.setItem("push.device", v4());
        analytics().setCurrentScreen("kn.chats.pages.home:_app");
        window.addEventListener('beforeinstallprompt', async (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
        });
    }, []);
    return (
        <ErrorBoundary>
            {/*<Partytown debug={true} forward={['dataLayer.push']}/>*/}
            {/*<RecoilRoot>*/}
            <ThemeModeProvider>
                <ThemeSchemeProvider>
                    <M3ThemeProvider>
                        <ConfirmProvider defaultOptions={{confirmationButtonProps: {autoFocus: true}}}>
                            <NotificationComponent/>
                            <Head>
                                <meta name="viewport"
                                      content="width=device-width, height=device-height, initial-scale=1.0, interactive-widget=resizes-content"/>
                                <title>Chats</title>
                            </Head>
                            <NoSSR><InstallPrompt/></NoSSR>
                            {/*<Script defer src={"https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"}/>*/}
                            {isDev && <>
                                <Script defer src={"/_dev/stats.js"}/>
                                <Script defer src="//console.re/connector.js" data-channel="kabeerchats-dev"
                                        id="consolerescript"></Script>
                                <div style={{position: 'fixed', top: 0, zIndex: 9999, left: 0}}>
                                    <button onClick={() => {
                                        window._KN_VALUES_VIRTUAL_KEYBOARD = !window._KN_VALUES_VIRTUAL_KEYBOARD;
                                        window._KN_CHATS_DEV_KEYBOARD_TOGGLE(window._KN_VALUES_VIRTUAL_KEYBOARD ?? true);
                                    }}>openVirtualKeyBoard
                                    </button>
                                </div>
                            </>}
                            {/*<Script>{` */}
                            {/*    document.oncontextmenu = new Function("return false;")*/}
                            {/*    document.onselectstart = new Function("return false;")*/}
                            {/*`}</Script>*/}
                            <NextNProgress options={{isRequired: true, showSpinner: false}} showOnShallow={true}
                                           color={theme.palette.secondary.main} height={3}/>
                            {loading ? (
                                <div style={{flexGrow: 1}}>
                                    <CircularProgress size={"xl"}/>
                                </div>
                            ) : user ? (
                                <DrawerProvider>
                                    <ConversationsProvider>
                                        {/* @ts-ignore */}
                                        <ActiveContext.Provider value={{visible: true, active: true, isDev: isDev}}>
                                            <CapabilitiesProvider>
                                                <SideBar/>
                                                <div style={{
                                                    display: 'flex', position: 'relative',
                                                    flexDirection: 'column', scrollSnapType: "y mandatory",
                                                    height: '100%', maxHeight: '100vh'
                                                }}>
                                                    <div style={{height: "0rem", scrollSnapAlign: "start"}}/>
                                                    <Suspense fallback={'loading...'}>
                                                        <Component {...pageProps} />
                                                    </Suspense>
                                                    <VirtualKeyBoardDEV isDev={isDev}/>
                                                    <OfflinePrompt/>
                                                    {(['/home', '/', '/feed', '/profile'].includes(router.pathname)) &&
                                                        <DynamicSidebarContent><ChatsBottomNavigation/></DynamicSidebarContent>}
                                                </div>
                                            </CapabilitiesProvider>
                                        </ActiveContext.Provider>
                                    </ConversationsProvider>
                                </DrawerProvider>
                            ) : (
                                <Login/>
                            )}
                        </ConfirmProvider>
                    </M3ThemeProvider>
                </ThemeSchemeProvider>
            </ThemeModeProvider>
            {/*</RecoilRoot>*/}
        </ErrorBoundary>
    )
}