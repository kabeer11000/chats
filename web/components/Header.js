import {Fragment, useContext} from "react";
import {DrawerContext} from "../Contexts";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import dynamic from "next/dynamic";

const AppBar = dynamic(() => import("@mui/material/AppBar"))
const Avatar = dynamic(() => import("@mui/material/Avatar"))
const IconButton = dynamic(() => import("@mui/material/IconButton"))
const Typography = dynamic(() => import("@mui/material/Typography"))
const Toolbar = dynamic(() => import("@mui/material/Toolbar"))
const InputBase = dynamic(() => import("@mui/material/InputBase"))
const Paper = dynamic(() => import("@mui/material/Paper"))
const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"))
const SearchIcon = dynamic(() => import("@mui/icons-material/Search"))
export default function Header() {
    const {toggle, drawerWidth, isDesktop} = useContext(DrawerContext);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window : undefined,
    });
    return (
        <Fragment>
            <Paper
                color={"primary"}
                elevation={0}
                component="form"
                sx={{
                    p: '2px 4px',
                    position: "fixed",
                    marginX: "1rem",
                    mt: "1rem",
                    display: 'flex',
                    alignItems: 'center',
                    width: `calc(100% - ${isDesktop ? drawerWidth : 0}px - 2rem)`
                }}
                style={{display: "none"}}>
                <IconButton sx={{p: '10px'}} aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                {!isDesktop && <Avatar src={"/images/icon-192.png"} sx={{mr: 2}}
                                       style={{marginRight: "1rem", height: "2rem", width: "2rem"}}/>}
                <InputBase
                    sx={{ml: 1, flex: 1}}
                    placeholder="Chats"
                    inputProps={{'aria-label': 'search google maps'}}
                />
                <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                    <SearchIcon/>
                </IconButton>
            </Paper>

            <AppBar style={{display: "block", width: `calc(100% - ${isDesktop ? drawerWidth : 0}px)`}}
                    color={trigger ? 'primary' : 'default'} position="fixed" elevation={trigger ? 2 : 0}>
                <Toolbar style={{paddingTop: ".3rem", paddingBottom: ".3rem"}}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggle}
                            sx={{mr: 2, display: isDesktop ? "none" : "block"}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        {!isDesktop &&
                            <Avatar src={"/images/icon-192.png"} sx={{mr: 2}} style={{marginRight: "1rem", display: 'none'}}/>}
                        <Typography
                            hidden={isDesktop}
                            variant="h6"
                            component="div"
                        >
                            Chats
                        </Typography>
                    </Toolbar>
                </Toolbar>
            </AppBar>
            <div style={{height: "3.5rem", width: "100%"}}/>
        </Fragment>
    )
}