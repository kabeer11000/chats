import {useContext} from "react";
import {DrawerContext} from "../../Contexts";
import {RootContext} from "./Context";
// @ts-ignore
import dynamic from "next/dynamic";

// @ts-ignore
const Backdrop = dynamic(() => import("@mui/material/Backdrop"));
// @ts-ignore
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));

export default function ActionBackdrop() {
    // @ts-ignore
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    const {activity} = useContext(RootContext);
    return (
        <Backdrop style={{marginLeft: isDesktop ? `calc(100% - ${drawerWidth})` : 0, zIndex: "99999"}}
                  open={activity.actionBackdrop.open}>
            <CircularProgress/>
        </Backdrop>
    )
}