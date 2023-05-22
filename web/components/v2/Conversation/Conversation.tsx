import dynamic from "next/dynamic";
import {createContext, Fragment, useCallback, useContext, useEffect, useRef} from "react";
import {DrawerContext} from "root-contexts";
import {CallProvider} from "./Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import {ThemeSchemeContext} from "@/styles/theme";
import {useActionBackdrop, useConversationState, useInput} from "@/zustand/v2/Conversation";
import shallow from "zustand/shallow";
import {compressImage} from "@/utils/compression/image";
import {useDropzone} from "react-dropzone";
import {rgbToHex} from "@/utils/colored/colortheif";
import {UploadFileToKCSBucket} from "@/3pa/kcs/files";
import {useTheme} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const Messages = dynamic(() => import("./Messages"));
const AudioMessageSheet = dynamic(() => import("./AudioMessageSheet"));
const Skeleton = dynamic(() => import("@mui/material/Skeleton"));
const Input = dynamic(() => import("./Input"));
const Backdrop = dynamic(() => import("@mui/material/Backdrop"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const Options = dynamic(() => import("./Options"));
const Header = dynamic(() => import("./Header"), {
    loading: () => <Skeleton width={'100%'} style={{zIndex: 999, margin: 0, padding: 0}} height={'5rem'}/>
});

/** Dropzone Context **/
export interface IDropZoneContext {
    getRootProps: () => object,
    getInputProps: () => object,
    isDragActive: boolean
}

export const DropZoneContext = createContext<IDropZoneContext>({
    getRootProps: () => undefined,
    getInputProps: () => undefined,
    isDragActive: false
});
export const DropZoneProvider = ({children}) => {
    // Would stop un-needed triggers
    const actionBackdrop = useActionBackdrop(state => ({
        create: state.create,
        destroy: state.destroy,
        error: state.error
    }), shallow);
    const input = useInput(state => ({setFiles: state.setFiles, setText: state.setText}), shallow);
    const onDrop = useCallback(async files => {
        try {
            const updatedFiles = [];
            actionBackdrop.create();
            for (const file of files) updatedFiles.push(await UploadFileToKCSBucket({
                file: await compressImage(file),
                actionBackdrop: false
            }));
            input.setFiles([...useInput.getState().state.files, ...updatedFiles]);
            actionBackdrop.destroy();
        } catch (e) {
            actionBackdrop.error();
        }
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        // @ts-ignore
        onDrop, accept: "image/*", noClick: true, multiple: false
    });
    return <DropZoneContext.Provider
        value={{getRootProps, getInputProps, isDragActive}}>{children}</DropZoneContext.Provider>
}
const Conversation = () => {
    const scrollContainerRef = useRef();
    const matches = useMediaQuery('(min-width:800px)');
    const {drawerWidth, isDesktop, type: drawerType} = useContext(DrawerContext);
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
                        <Messages scrollContainerRef={scrollContainerRef}/>
                        <DynamicBackground/>
                    </div>
                    <div style={{marginTop: "auto"}}>
                        <Input/>
                    </div>
                </div>
                {(matches) && <Box sx={{
                    backgroundColor: theme.palette.background.default
                }} style={{flex: 1,borderRadius:0, maxWidth: drawerWidth, height: 'auto'}}>
                    <div style={{marginTop: '3rem'}}><Options embedded={false}/></div>
                </Box>}
            </div>
            <AudioMessageSheet/>
            <BackdropComponent/>
        </Fragment>
    );
};
const DynamicBackground = () => {
    const conversationBackground = useConversationState(state => state.state?.background);
    const {generateThemeScheme, setThemeScheme, themeScheme} = useContext(ThemeSchemeContext);
    const theme = useTheme();
    useEffect(() => {
        if (conversationBackground?.name && !!conversationBackground.ambient?.main) {
            generateThemeScheme(rgbToHex(...conversationBackground.ambient?.main));
        } else setThemeScheme(JSON.parse(localStorage.getItem("theme-scheme-og")));
    }, [conversationBackground?.name, conversationBackground?.ambient?.main]);
    useEffect(() => {
        const themeSchemeOg = themeScheme;
        localStorage.setItem("theme-scheme-og", JSON.stringify(themeScheme));
        return () => setThemeScheme(themeSchemeOg);
    }, []);
    return (
        (conversationBackground?.name) && <div style={{
            overflow: 'hidden',
            zIndex: -1,
            top: 0,
            position: 'fixed',
            // backgroundColor: "black",
            height: '100vh',
            width: '100vw',

            animation: 'fadein 1s',
            filter: `blur(${conversationBackground.blur ? '20' : '0'}px) brightness(${theme.palette.mode === "dark" ? .3 : 1.1})`,
            background: `url('https://docs.cloud.kabeers.network/static/chats/backgrounds/images/${conversationBackground.name}')`

        }}/>
    )
}
const BackdropComponent = () => {
    const {isDragActive} = useContext(DropZoneContext);
    const {drawerWidth, isDesktop} = useContext(DrawerContext);
    return (
        <Backdrop style={{marginLeft: isDesktop ? `calc(100% - ${drawerWidth})` : 0}}
                  open={isDragActive}>
            <Typography>Drop Files Here</Typography>
        </Backdrop>
    )
}
export default ({props}) => <DropZoneProvider><Conversation {...props}/></DropZoneProvider>;