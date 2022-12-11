import Head from 'next/head';
// import firebase from "firebase/app"
// import "firebase/auth"
import {analytics, auth, facebookProvider, githubProvider, provider} from 'firebase-config';
import {useRouter} from "next/router";
import {useContext, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {DrawerContext} from "../Contexts";
import dynamic from "next/dynamic";
import IconButton from "@mui/material/IconButton";
import {Menu} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import {Capacitor} from "@capacitor/core";

const Box = dynamic(() => import("@mui/material/Box"))
const Button = dynamic(() => import("@mui/material/Button"))
const Container = dynamic(() => import("@mui/material/Container"))
const Grid = dynamic(() => import("@mui/material/Grid"))
const Typography = dynamic(() => import("@mui/material/Typography"));

const Login = () => {
    const router = useRouter();
    useEffect(() => {
        analytics().setCurrentScreen("login_screen");
    }, []);
    const [user] = useAuthState(auth);
    const {isDesktop, drawerWidth, toggle} = useContext(DrawerContext);
    const signIn = (provider) => {
        // console.log(((Capacitor.getPlatform() === "web") ? auth.signInWithPopup : auth.signInWithRedirect), (provider))
        // auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() =>
        auth.signInWithPopup(provider).then(() => {
            router.push("/");
            analytics().logEvent("logged_in", {
                user: auth.currentUser.toJSON()
            });
        }).catch(({code, message}) => {
            alert(message);
            // if (code ==="auth/account-exists-with-different-credential")
        })//).catch(e => console.log("ERROR: error persisting session"));
    };

    return (
        <div style={{
            width: user ? (isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%") : "100%",
            marginLeft: user ? (isDesktop ? `${drawerWidth}px` : "0") : "0"
        }}>
            <img src={"/images/bg-vector.svg"} style={{position: "fixed", zIndex: -1, top: 0, width: "120vw", height: "5rem"}}/>
            <Head>
                <title>{user ? 'Switch Account - Chats' : 'Start using Chats'}</title>
            </Head>
            <AppBar elevation={0} position={'fixed'} style={{backgroundColor: 'transparent'}}>
                <Toolbar>{(user) && <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggle}
                    sx={{mr: 2, display: isDesktop ? "none" : "block"}}>
                    <Menu/>
                </IconButton>}</Toolbar>
            </AppBar>
            <Container maxWidth={"sm"}
                       style={{
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                           minHeight: '100%', overflowY: 'hidden',
                           marginTop: isDesktop ? "10%" : '40%'
                       }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} p={2} style={{marginBottom: "5rem"}}>
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center"
                            }}
                        >
                            <img src={"/images/icon-512.png"}
                                 style={{marginRight: "1rem", width: "4rem", height: "4rem"}}/>
                            <div>
                                <Typography
                                    variant={"h4"}>{user ? 'Switch Account' : 'Sign in to Kabeer Chats'}</Typography>
                                <Typography>{user ? 'Switch account you\'re using with chats' : 'Add any social account to use with chats'}</Typography>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                        <Button variant={'outlined'} style={{width: '100%', height: "3rem"}}
                                onClick={() => signIn(provider)}>
                            <img src={"/images/super-g.webp"}
                                 style={{width: "2rem", height: "auto", marginRight: "0.5rem"}}/> Sign in with Google
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                        <Button variant={'outlined'} style={{width: '100%', height: "3rem"}}
                                onClick={() => signIn(githubProvider)}>
                            <img src={"/images/github.png"}
                                 style={{
                                     width: "1.5rem",
                                     borderRadius: "5rem",
                                     height: "auto",
                                     marginRight: "0.5rem"
                                 }}/> Sign in with Github
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                        <Button variant={'outlined'} style={{width: '100%', height: "3rem"}}
                                onClick={() => signIn(facebookProvider)}>
                            <img src={"/images/facebook.webp"}
                                 style={{
                                     width: "1.5rem",
                                     borderRadius: "5rem",
                                     height: "auto",
                                     marginRight: "0.5rem"
                                 }}/> Sign in with Facebook
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Login;
