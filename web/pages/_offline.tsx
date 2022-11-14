import {useContext, useEffect} from "react";
import {DrawerContext} from "../Contexts";
import {Container, ListItemText} from "@mui/material";
import {OfflineBolt} from "@mui/icons-material";
import Button from "@mui/material/Button";

export default function OfflinePage() {
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    useEffect(() => {
        // Listen to changes in the network state, reload when online.
        // This handles the case when the device is completely offline.
        window.addEventListener('online', () => {
            window.location.reload();
        });

        // Check if the server is responding and reload the page if it is.
        // This handles the case when the device is online, but the server
        // is offline or misbehaving.
        async function checkNetworkAndReload() {
            try {
                const response = await fetch('.');
                // Verify we get a valid response from the server
                if (response.status >= 200 && response.status < 500) {
                    window.location.reload();
                    return;
                }
            } catch {
                // Unable to connect to the server, ignore.
            }
            window.setTimeout(checkNetworkAndReload, 2500);
        }

        checkNetworkAndReload();
    }, [])
    return <div
        style={{marginLeft: isDesktop ? drawerWidth : 0, width: isDesktop ? `calc(100% - ${drawerWidth}px` : "100%"}}>
        <Container maxWidth={"md"}
                   style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <div style={{textAlign: "center"}}>
                <OfflineBolt fontSize={"large"}/>
                <br/>
                <ListItemText primary={"You're Offline :("}
                              secondary={"Page you're trying to view cannot be loaded beacause you're not connected to the internet"}/>
                <br/>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        </Container>
    </div>
}