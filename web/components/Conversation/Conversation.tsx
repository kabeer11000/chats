// @ts-ignore
import dynamic from "next/dynamic";
import {Fragment, memo, useContext, useRef} from "react";
import {DrawerContext} from "../../Contexts";
import {CallProvider, RootContext} from "./Context";

const Messages = dynamic(() => import("./Messages"));
const AudioMessageSheet = dynamic(() => import("./AudioMessageSheet"));
const Header = dynamic(() => import("./Header"));
const Input = dynamic(() => import("./Input"));
// @ts-ignore
// const AppBar = dynamic(() => import("@mui/material/AppBar"));
// @ts-ignore
// const Avatar = dynamic(() => import("@mui/material/Avatar"));
// @ts-ignore
const Backdrop = dynamic(() => import("@mui/material/Backdrop"));
// @ts-ignore
const Box = dynamic(() => import("@mui/material/Box"));
// @ts-ignore
// const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));
// @ts-ignore
// const IconButton = dynamic(() => import("@mui/material/IconButton"));
// @ts-ignore
// const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
// @ts-ignore
const Typography = dynamic(() => import("@mui/material/Typography"));
// @ts-ignore
// const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
// @ts-ignore
// const ArrowBack = dynamic(() => import("@mui/icons-material/ArrowBack"));
// @ts-ignore
// const Options = dynamic(() => import("./Options"));

const Conversation = () => {
    // @ts-ignore
    const {type: drawerType, drawerWidth, isDesktop} = useContext(DrawerContext);
    const {Files} = useContext(RootContext);
    const scrollContainerRef = useRef()
    return (
        <Fragment>
            <div style={{marginLeft: drawerType === "permanent" ? drawerWidth : 0, height: '100vh'}}>
                <CallProvider>
                    <Header scrollContainerRef={scrollContainerRef}/>
                </CallProvider>
                <Messages scrollContainerRef={scrollContainerRef}/>
                <Input/>
            </div>
            <AudioMessageSheet/>
            <Backdrop style={{marginLeft: isDesktop ? `calc(100% - ${drawerWidth})` : 0}}
                      open={Files.Dropzone.isDragActive}>
                <Typography>Drop Files Here</Typography>
            </Backdrop>
        </Fragment>
    );
};

export default memo(Conversation);
