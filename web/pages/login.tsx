import Head from 'next/head';
// import firebase from "firebase/app"
// import "firebase/auth"
import {analytics, auth, githubProvider, provider} from 'firebase-config';
import {useRouter} from "next/router";
import {useContext, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {DrawerContext} from "../Contexts";
import dynamic from "next/dynamic";
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
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    const signIn = (provider) => {
        // console.log(((Capacitor.getPlatform() === "web") ? auth.signInWithPopup : auth.signInWithRedirect), (provider))
        // auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() =>
        auth.signInWithPopup(provider).catch(alert).then(() => {
            router.push("/");
            analytics().logEvent("logged_in", {
                user: auth.currentUser.toJSON()
            });
        })//).catch(e => console.log("ERROR: error persisting session"));
    };

    return (
        <div style={{
            width: user ? (isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%") : "100%",
            marginLeft: user ? (isDesktop ? `${drawerWidth}px` : "0") : "0"
        }}>
            <img src={"/images/bg-vector.svg"} style={{position: "fixed", top: 0, width: "120vw", height: "5rem"}}/>
            <Head>
                <title>Login to Kabeer Chats</title>
            </Head>
            <Container maxWidth={"sm"}
                       style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30vh"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{marginBottom: "5rem"}}>
                        <Box
                            style={{
                                padding: 2,
                                display: "flex",
                                // flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <img src={"/images/icon-512.png"}
                                 style={{marginRight: "1rem", width: "4rem", height: "4rem"}}/>
                            <Typography variant={"h3"}>Sign in to Kabeer Chats</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                        <Button style={{width: '100%', height: "3rem"}} variant={"outlined"}
                                onClick={() => signIn(provider)}>
                            <img src={"/images/super-g.webp"}
                                 style={{width: "2rem", height: "auto", marginRight: "1rem"}}/> Sign in with Google
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                        <Button style={{width: '100%', height: "3rem"}} variant={"outlined"}
                                onClick={() => signIn(githubProvider)}>
                            <img src={"/images/github.png"}
                                 style={{
                                     width: "1.5rem",
                                     borderRadius: "5rem",
                                     height: "auto",
                                     marginRight: "1rem"
                                 }}/> Sign in with Github
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Login;
