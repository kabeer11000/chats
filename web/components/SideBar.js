import {Fragment, memo, useContext, useEffect, useState} from 'react';
import {ChatContext, DrawerContext} from "../Contexts";
import {useRouter} from "next/router";
import {auth} from "firebase-config";
import useTheme from "@mui/material/styles/useTheme"
import dynamic from "next/dynamic";
import {ThemeSchemeContext} from "../styles/theme";
import {Code, Home, Logout, Settings} from "@mui/icons-material";
import {useConfirm} from "material-ui-confirm";
import {useConversations} from "../zustand/Home";

const ChatList = dynamic(() => import("./ChatList"))
const Version = dynamic(() => import("./Version").then(({Version}) => Version))

const Divider = dynamic(() => import("@mui/material/Divider"))
const Fab = dynamic(() => import("@mui/material/Fab"))
const Zoom = dynamic(() => import("@mui/material/Zoom"))
const Drawer = dynamic(() => import("@mui/material/Drawer"))
const List = dynamic(() => import("@mui/material/List"))
const ListItem = dynamic(() => import("@mui/material/ListItem"))
const ListItemButton = dynamic(() => import("@mui/material/ListItemButton"))
const ListItemIcon = dynamic(() => import("@mui/material/ListItemIcon"))
const ListItemText = dynamic(() => import("@mui/material/ListItemText"))
const Toolbar = dynamic(() => import("@mui/material/Toolbar"))
const Chat = dynamic(() => import("./Chat"))
const Close = dynamic(() => import("@mui/icons-material/Close"))
const Email = dynamic(() => import("@mui/icons-material/Email"))
const Fullscreen = dynamic(() => import("@mui/icons-material/Fullscreen"))
const People = dynamic(() => import("@mui/icons-material/People"))
const QrCode = dynamic(() => import("@mui/icons-material/QrCode"))
const Scanner = dynamic(() => import("@mui/icons-material/Scanner"))
const ColorLensOutlined = dynamic(() => import("@mui/icons-material/ColorLensOutlined"))
const Twitter = dynamic(() => import("@mui/icons-material/Twitter"))
const Web = dynamic(() => import("@mui/icons-material/Web"))
const OpenInNew = dynamic(() => import("@mui/icons-material/OpenInNew"))
const Add = dynamic(() => import("@mui/icons-material/Add"))
const AppBar = dynamic(() => import("@mui/material/AppBar"))
const Avatar = dynamic(() => import("@mui/material/Avatar"))
const Badge = dynamic(() => import("@mui/material/Badge"))
const Button = dynamic(() => import("@mui/material/Button"))
const ButtonBase = dynamic(() => import("@mui/material/ButtonBase"))
const Dialog = dynamic(() => import("@mui/material/Dialog"))
const DialogContent = dynamic(() => import("@mui/material/DialogContent"))
const IconButton = dynamic(() => import("@mui/material/IconButton"))
const Paper = dynamic(() => import("@mui/material/Paper"))
const Typography = dynamic(() => import("@mui/material/Typography"))
const QRCodeDisplay = dynamic(() => import("react-qr-code"))
const QrReader = dynamic(() => import("react-qr-scanner"))

function ResponsiveDrawer() {
    const {mobileOpen, isDesktop, drawerWidth, toggle, type} = useContext(DrawerContext);
    const {createChat} = useContext(ChatContext);
    const router = useRouter();
    const confirm = useConfirm();
    const [qrCodeOpen, setQrCodeOpen] = useState(false);
    const [qrCodeScanner, setQrCodeScanner] = useState(false);
    const {generateThemeScheme} = useContext(ThemeSchemeContext);
    const drawer = (
        <div onClick={toggle}>
            <List>
                <ListItem onClick={() => router.push("/account")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <People/>
                        </ListItemIcon>
                        <ListItemText primary={"Switch Account"} secondary={"Switch to another account"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem style={{display: 'flex'}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Badge>
                                <Avatar imgProps={{referrerPolicy: "no-referrer"}}
                                        src={auth.currentUser.photoURL}/>
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={auth.currentUser.displayName}
                                      secondary={<div style={{
                                          direction: "rtl",
                                          textAlign: "left",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis"
                                      }}>Signed in as {auth.currentUser.email}</div>}/>
                    </ListItemButton>
                    <div>
                        <IconButton onClick={async () => {
                            confirm({title: 'Sign Out', description: 'Signing out will remove your account and all associated data with this device', confirmationText: 'Sign Out'}).then(() => auth.signOut().then(() => router.push("/"))).catch()
                        }} variant={'contained'}><Logout/></IconButton>
                    </div>
                </ListItem>
                <ListItem onClick={() => setQrCodeOpen(true)}>
                    <ListItemButton>
                        <ListItemIcon>
                            <QrCode/>
                        </ListItemIcon>
                        <ListItemText primary={"Share Your Code"} secondary={"Share as " + auth.currentUser.email}/>
                    </ListItemButton>
                </ListItem>
                {!isDesktop && <ListItem onClick={() => setQrCodeScanner(true)}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Scanner/>
                        </ListItemIcon>
                        <ListItemText primary={"Scan Your Friends Code"} secondary={"Add Your Friend"}/>
                    </ListItemButton>
                </ListItem>}
                <br/>
                <ListItem onClick={() => router.push('/settings')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Settings/>
                        </ListItemIcon>
                        <ListItemText primary={"Settings"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => generateThemeScheme("#000000".replace(/0/g, function () {
                        return (~~(Math.random() * 16)).toString(16);
                    }))}>
                        <ListItemIcon>
                            <ColorLensOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={"Customise Color"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem component={"a"} href={"https://kabeersnetwork.tk"} target={"_blank"}>
                    <ListItemButton>
                        <ListItemIcon>
                            <OpenInNew/>
                        </ListItemIcon>
                        <ListItemText primary={"Kabeer's Network"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem component={"a"} href={"mailto://support@kabeersnetwork.tk"} target={"_blank"}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Email/>
                        </ListItemIcon>
                        <ListItemText primary={"Support"}/>
                    </ListItemButton>
                </ListItem>
                <br/>
                <ListItem>
                    <ListItemText
                        secondary={<>Copyright {(new Date()).getFullYear()} Kabeer's Network - Chats v<Version/></>}/>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => router.push("/_config")}>
                        <ListItemIcon>
                            <Code/>
                        </ListItemIcon>
                        <ListItemText primary={'Developer Settings'}
                                      secondary={'Settings intended for developers, things may break'}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
    // const {snapshots: {chats}} = useContext(ChatContext);
    const theme = useTheme();
    const chats = useConversations(state => state.conversations);
    const [email, setEmail] = useState("");
    // const [resizing, setResizing] = useState(false);
    // const resizeFunc = ({target}) => {
    //     if (!resizing) return ;
    //     console.log(target.clientWidth);
    //     // setDrawerWidth(target.clientWidth);
    // }//, []);
    useEffect(() => {
        if (qrCodeScanner) confirm({title: "Unstable Feature", hideCancelButton: true, cancellationButtonProps: {style: {display: 'none'}}, confirmationText: "Got it", description: "This Feature is in early development and not tested. \n it may be unstable and buggy"});
    }, [qrCodeScanner]);
    return (
        <Fragment>
            <Drawer disableDiscovery disableBackdropTransition swipeAreaWidth={50} hysteresis={40}
                    minFlingVelocity={400} onOpen={() => toggle()} onClose={() => toggle(false)}
                    open={isDesktop ? true : mobileOpen}
                    PaperProps={{
                        variant: "outlined",
                        style: {width: drawerWidth, minWidth: "10vw", resize: "none", outline: "1px black"},
                    }} variant={type}>
                <Toolbar>
                    <Avatar src={"/images/icon-192.png"} style={{marginRight: "1rem"}}/>
                    <Typography variant={"h6"}>Chats</Typography>
                </Toolbar>
                <List>
                    <ListItem onClick={async () => {
                        const ref = await createChat(null, {isGc: false});
                        if (!ref) return; // user cancelled
                        await router.push("/chat/" + ref.id)
                    }} button={false}>
                        <Fab variant={"extended"} size="medium" color="tertiary" elevation={0} style={{width: "100%"}}>
                            {"New Chat".toUpperCase()}
                        </Fab>
                    </ListItem>
                </List>
                {(!isDesktop && router.pathname !== '/') && <ListItem>
                    <ListItemButton onClick={() => router.push("/")}>
                        <ListItemIcon>
                            <Home/>
                        </ListItemIcon>
                        <ListItemText primary={'Home'}/>
                    </ListItemButton>
                </ListItem>}
                {isDesktop && <ChatList expanded={false} chatsSnapshot={chats}/>}
                {drawer}
            </Drawer>
            <Dialog open={!!qrCodeOpen} onClose={() => setQrCodeOpen(false)}>
                <Paper style={{padding: "2rem"}}>
                    <QRCodeDisplay bgColor={theme.palette.background.paper}
                                   fgColor={theme.palette.mode === "dark" ? "white" : theme.palette.primary.main}
                                   value={auth.currentUser.email}/>
                </Paper>
            </Dialog>
            <Dialog open={!!qrCodeScanner} keepMounted={false} fullScreen onClose={() => setQrCodeScanner(false)}>
                <div style={{
                    width: `calc(100% - ${isDesktop ? drawerWidth : 0}px`,
                    marginLeft: isDesktop ? drawerWidth : 0
                }}>
                    <AppBar position={"static"}>
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                                onClick={() => setQrCodeScanner(false)}
                            >
                                <Close/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Scan Code
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <DialogContent
                        style={{
                            display: "flex",
                            padding: 0, margin: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column"
                        }}>
                        <Paper elevation={0} style={{position: "relative"}}>
                            <ButtonBase disabled={!!!email}>
                                <div style={{width: "100%", height: "100%", flex: 1}}/>
                                {!email && <QrReader
                                    delay={100}
                                    constraints={{video: {facingMode: 'environment'}}}
                                    style={{width: "100%", minWidth: "100vw", marginTop: "-2rem", height: "100vh", padding: 0, margin: 0, objectFit: "cover"}}
                                    onError={() => {}}
                                    onScan={setEmail}
                                />}</ButtonBase>
                            <Fullscreen style={{
                                zIndex: 99,
                                color: "white",
                                left: 0,
                                top: 0,
                                fontWeight: "lighter",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}/>
                        </Paper>
                        {!!email ? <Button onClick={() => {
                            const ref = createChat(email);
                            router.push("/chat/" + ref.id);
                        }} variant={"contained"} style={{
                            width: "100%",
                            marginTop: "1rem"
                        }}>{"Add " + email.text + "?"}</Button> : null}
                    </DialogContent>
                </div>
            </Dialog>
            {/*<Backdrop style={{zIndex: "9999"}} open={resizing}/>*/}
        </Fragment>

    );
}

export default memo(ResponsiveDrawer);
