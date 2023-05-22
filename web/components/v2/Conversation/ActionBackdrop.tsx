import {useContext} from "react";
import {DrawerContext} from "root-contexts";
// @ts-ignore
import dynamic from "next/dynamic";
import Delayed from "@/components/Delayed";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useActionBackdrop} from "../../zustand/Conversation";
// @ts-ignore
const Backdrop = dynamic(() => import("@mui/material/Backdrop"));
// @ts-ignore
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));

export default function ActionBackdrop() {
    // @ts-ignore
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    // const {activity} = useContext(RootContext);
    const {open, task} = useActionBackdrop();
    return (
        <Backdrop style={{marginLeft: isDesktop ? `calc(100% - ${drawerWidth})` : 0, zIndex: "99999"}}
                  open={open}>
            {open && (
                <>
                    <div style={{
                        alignItems: 'center',
                        justifyContent: "center",
                        justifyItems: "center",
                        textAlign: "center"
                    }}>
                        <CircularProgress/>
                        <Delayed waitBeforeShow={5000}>
                            <Typography sx={{mt: 2}}>This action is taking unusually long</Typography>
                            <div><Button>Close</Button></div>
                        </Delayed>
                    </div>
                    <div style={{position: 'fixed', bottom: "1rem"}}>
                        <Typography variant={"caption"} color={"grey"}>{task?.id}</Typography>
                    </div>
                </>
            )}
        </Backdrop>
    )
}