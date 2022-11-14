// @ts-ignore
import dynamic from "next/dynamic";
import {useContext} from "react";
import {DrawerContext} from "../../../Contexts";
// @ts-ignore
import {useRouter} from "next/router";
import {db} from "../../../firebaseconfig";
import useScrollTrigger from "@mui/material/useScrollTrigger";
// @ts-ignore
const AppBar = dynamic(() => import("@mui/material/AppBar"));
// @ts-ignore
const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
// @ts-ignore
const Typography = dynamic(() => import("@mui/material/Typography"));
// @ts-ignore
const IconButton = dynamic(() => import("@mui/material/IconButton"));
// @ts-ignore
const ArrowBack = dynamic(() => import("@mui/icons-material/ArrowBack"));
// @ts-ignore
const Delete = dynamic(() => import("@mui/icons-material/Delete"));
// @ts-ignore
const List = dynamic(() => import("@mui/material/List"));
// @ts-ignore
const ListItem = dynamic(() => import("@mui/material/ListItem"));
// @ts-ignore
const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
// @ts-ignore
const ListItemIcon = dynamic(() => import("@mui/material/ListItemIcon"));
export default function Options({}) {
    // @ts-ignore
    const {drawerWidth, isDesktop} = useContext(DrawerContext);
    const router = useRouter();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window : undefined,
    });
    return (
        <div style={{width: isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%", marginLeft: isDesktop ? drawerWidth : 0}}>
            <AppBar color={trigger ? 'primary' : 'default'} position="fixed" style={{width: isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%", marginLeft: isDesktop ? drawerWidth : 0}} elevation={trigger ? 2 : 0}>
                <Toolbar>
                    <IconButton color={'inherit'} onClick={() => router.back()} style={{marginRight: "1rem"}}>
                        <ArrowBack/>
                    </IconButton>
                    <Typography variant={"h6"}>Chat Options</Typography>
                </Toolbar>
            </AppBar>
            <div style={{marginTop: "4rem"}}>
                <List>
                    <ListItem button onClick={async () => {
                        const sure = prompt("Are you sure you want to delete this chat? type in \"yes\" to confirm (you cannot undo this action)");
                        if (sure !== "yes") return;
                        await db.collection("chats").doc(router.query.id).delete();
                        await router.push("/");
                    }}>
                        <ListItemIcon color={'inherit'}>
                            <Delete/>
                        </ListItemIcon>
                        <ListItemText primary={"Delete Chat"}/>
                    </ListItem>
                </List>
            </div>
        </div>
    )
}