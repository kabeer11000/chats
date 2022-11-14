import {useContext} from "react";
import {DrawerContext} from "../Contexts";
import {Container, ListItemText} from "@mui/material";
import {OfflineBolt} from "@mui/icons-material";
import Button from "@mui/material/Button";

export default function ErrorPage() {
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    return <div
        style={{marginLeft: isDesktop ? drawerWidth : 0, width: isDesktop ? `calc(100% - ${drawerWidth}px` : "100%"}}>
        <Container maxWidth={"md"}
                   style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <div style={{textAlign: "center"}}>
                <OfflineBolt fontSize={"large"}/>
                <br/>
                <ListItemText primary={"Application Error Occurred"}
                              secondary={"An application error occurred, our developers have been notified"}/>
                <br/>
                <Button onClick={() => window.location.href = "/"}>Retry</Button>
            </div>
        </Container>
    </div>
}