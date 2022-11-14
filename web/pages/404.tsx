import {useRouter} from "next/router";
import {useContext} from "react";
import {DrawerContext} from "../Contexts";
import dynamic from "next/dynamic";

const Container = dynamic(() => import("@mui/material/Container"))
const ListItemText = dynamic(() => import("@mui/material/ListItemText"))
const OfflineBolt = dynamic(() => import("@mui/icons-material/OfflineBolt"))
export default function FourOFourPage () {
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    const router = useRouter();
    return <div style={{marginLeft: isDesktop ? drawerWidth : 0, width: isDesktop ? `calc(100% - ${drawerWidth}px` : "100%"}}>
        <Container maxWidth={"md"} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <div style={{textAlign: "center"}}>
                <OfflineBolt fontSize={"large"}/>
                <br/>
                <ListItemText primary={"Page not found"} secondary={"Page you're trying to view is not on the server"}/>
            </div>
        </Container>
    </div>
}