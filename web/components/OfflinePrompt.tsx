import useNetwork from "../hooks/useNetwork";
import {Slide} from "@mui/material";
import Typography from "@mui/material/Typography";
import DynamicSidebarContent from "@/styles/containers/DynamicSidebarContent";
import Paper from "@mui/material/Paper";

export const OfflinePrompt = () => {
    const isOnline = useNetwork();
    return (
        <DynamicSidebarContent>
            <Slide mountOnEnter unmountOnExit direction={"up"} in={!isOnline}>
                <Paper style={{width: '100%', textAlign: 'center'}}>
                    <Typography variant={"caption"}>You are offline</Typography>
                </Paper>
            </Slide>
        </DynamicSidebarContent>
    )
}