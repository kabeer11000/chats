// @ts-ignore
import dynamic from "next/dynamic";
import {Fragment, memo, useContext, useRef} from "react";
import {DrawerContext} from "root-contexts";
import {CallProvider, RootContext} from "./Context";
import {useTheme} from "@mui/material/styles";
import {Grow} from "@mui/material";

const Messages = dynamic(() => import("./Messages"));
const AudioMessageSheet = dynamic(() => import("./AudioMessageSheet"));
// @ts-ignore
const Skeleton = dynamic(() => import("@mui/material/Skeleton"));
const Header = dynamic(() => import("./Header"), {
    loading: loadingProps => <div/>//<Skeleton width={'100%'} style={{zIndex: 999, margin: 0, padding: 0}} height={'5rem'}/>
});
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
const Options = dynamic(() => import("./Options"));

const Conversation = () => {
    // @ts-ignore
    const {type: drawerType, drawerWidth, isDesktop} = useContext(DrawerContext);
    const {Files, chat} = useContext(RootContext);
    const scrollContainerRef = useRef()
    const theme = useTheme();
    return (
        <Fragment>
            <div style={{
                marginLeft: drawerType === "permanent" ? drawerWidth : 0,
                transitionDuration: '.15s',
                position: 'relative', overflowX: 'hidden',
                display: 'flex', flex: 1, flexGrow: 1, height: '100%',
                flexDirection: 'row',
                width: isDesktop ? `calc(100vw - (${drawerWidth}px)` : '100vw',
            }}>
                <div style={{
                    flex: 2, flexGrow: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <CallProvider>
                        <div style={{zIndex: 999}}>
                            <Header scrollContainerRef={scrollContainerRef}/>
                        </div>
                    </CallProvider>
                    <div style={{flex: 1, position: 'relative', overflowX: 'hidden', overflowY: "scroll", flexGrow: 1}}>
                        {/** in Working condition, for chat background feature **/}
                        <div style={{overflow: 'hidden', zIndex: -1, position: 'absolute', height: '100%', width: '100%'}}>{(chat.data && chat.data?.background?.name) && <img style={{position: 'relative', width: '150%', height: '150%', animation: 'fadein 1s', filter: `blur(${chat.data.background.blur ? '20' : '0'}px) brightness(${theme.palette.mode === "dark" ? .3 : 1.1})`}} src={`https://docs.kabeercloud.tk/static/chats/backgrounds/images/${chat.data.background.name}`}/>}</div>
                        <Messages scrollContainerRef={scrollContainerRef}/>
                    </div>
                    <div style={{marginTop: "auto"}}><Input/></div>
                </div>
                {/*<Divider variant={'fullWidth'} orientation={'vertical'}/>*/}
                {isDesktop && <div style={{flex: 1, maxWidth: drawerWidth, height: 'auto'}}>
                    <div style={{marginTop: '3rem'}}><Options/></div>
                </div>}
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
