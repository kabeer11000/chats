import useMediaQuery from "@mui/material/useMediaQuery";
import {useRecoilState} from "recoil";
import {InstallPromptAtom} from "../../Atoms";
import {useContext, useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import {CapabilitiesContext} from "../../Contexts";
import {Dialog} from "@mui/material";
import Button from "@mui/material/Button";
export default function InstallPrompt() {
    // TODO !
    const installed = useMediaQuery('(display-mode: standalone)');
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const [open, setOpen] = useState((ua.includes("iPhone") || ua.includes("Android")) ? localStorage.getItem("kn.chats.install.dialog.shown") ? false : !installed : false);
    const capabilities = useContext(CapabilitiesContext);
    useEffect(() => {
        // console.log(installAtom, installed)
    }, []);
    return (
        <div>
            <Dialog onClose={() => {
                setOpen(false);
                localStorage.setItem("kn.chats.install.dialog.shown", '1')
            }} PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    // boxShadow: 'none',
                    overflow: 'hidden', borderRadius: 10, display: 'flex',
                    padding: 0
                },
            }} open={open}>
                <img
                    src={ua.includes("Android") ? "/prompts/Android.Prompt.svg" : ua.includes("iPhone") ? "/prompts/IOS.Prompt.svg" : ''}
                    style={{flex: 1, margin: 0, padding: 0}}/>
            </Dialog>
            <Paper hidden elevation={0} style={{
                position: "fixed",
                background: 'white',
                backdropFilter: 'blur(1px)',
                // pointerEvents: "none",
                opacity: .8,
                top: '3.5rem',
                zIndex: 99999,
                width: "100%"
            }}>
                <Button onClick={() => {
                    localStorage.removeItem("kn.chats.install.dialog.shown");
                    window.location.reload()
                }}> Delete Dialog</Button>

                <Button onClick={() => {
                    // localStorage.removeItem("kn.chats.install.dialog.shown");
                    window.location.reload()
                }}> Reload</Button>

                <ul style={{listStyle: 'none'}}>
                    <li>INSTALLED: {"" + installed}</li>
                    {Object.entries(capabilities.available).map(([key, value]) => (
                        <li key={Math.random()}>{key.replaceAll('_', ' ')}: {"" + value}</li>))}
                </ul>
            </Paper>
        </div>
    )
}