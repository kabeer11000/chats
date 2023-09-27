import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import Paper from "@mui/material/Paper";
import {ChatBubble, Explore} from "@mui/icons-material";
import {useRouter} from "next/router";
import {useContext} from "react";
import {DrawerContext} from "root-contexts";
import Link from "next/link";

const ChatsBottomNavigation = () => {
    const index = {
        '/': 0,
        '/feed': 1,
        '/profile': 2,
        '/music': 3
    }
    const {isDesktop} = useContext(DrawerContext);
    const router = useRouter();
    return (
        !isDesktop && (<div>
            <div style={{height: '4rem'}}/>
            <Paper elevation={3} style={{
                position: 'fixed',
                paddingBottom: isDesktop ? '0.3rem' : "1.5rem",
                bottom: 0,
                left: 0,
                width: `100vw`
            }}>
                <BottomNavigation
                    showLabels value={index[router.pathname]}>
                    <BottomNavigationAction component={Link} href={'/'} label="Chats" icon={<ChatBubble/>}/>
                    <div hidden={router.pathname !== '/'} style={{width: '5rem'}}/>
                    <BottomNavigationAction component={Link} href={'/feed'} label="Minis" icon={<Explore/>}/>
                    {/*<BottomNavigationAction component={Link} href={'/music'} label="Music" icon={<MusicNote/>}/>*/}
                    {/*<BottomNavigationAction component={Link} href={'/profile'} label="Profile" icon={<Person/>}/>*/}
                </BottomNavigation>
            </Paper></div>)
    )
}
export default ChatsBottomNavigation;