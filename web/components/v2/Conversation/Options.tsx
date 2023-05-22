import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {db} from "firebase-config";
import {Avatar, Checkbox, Grid, IconButton, ListSubheader, Skeleton} from "@mui/material";
import {Fragment, memo, useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import {useTheme} from "@mui/material/styles";
import {useConfirm} from "material-ui-confirm";
import {getDominantColor} from "@/utils/colored/colortheif";
import {useConversationState} from "@/zustand/v2/Conversation";
import shallow from "zustand/shallow";

const Delete = dynamic(() => import("@mui/icons-material/Delete"));
const List = dynamic(() => import("@mui/material/List"));
const Button = dynamic(() => import("@mui/material/Button"));
const ListItem = dynamic(() => import("@mui/material/ListItem"));
const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
const ListItemIcon = dynamic(() => import("@mui/material/ListItemIcon"));
const ListItemButton = dynamic(() => import("@mui/material/ListItemButton"));

export const Options = (({embedded}) => {
    const router = useRouter();
    const [backgrounds, setBackgrounds] = useState(null);
    const [images, setImages] = useState([]);
    const chat = useConversationState(state => ({data: state.state, loading: state.loading}), shallow);
    useEffect(() => {
        fetch('https://docs.cloud.kabeers.network/static/chats/backgrounds/index.json').then(res => res.json()).then(backgrounds => {
            setBackgrounds(backgrounds);
            setImages(Object.entries(backgrounds).slice(0, 10))
        });
    }, []);
    const theme = useTheme();
    const confirm = useConfirm();
    return (
        <div style={{maxHeight: '100vh', overflowY: "scroll"}}>
            {!embedded && <ListSubheader>Conversation Options</ListSubheader>}
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={async () => {
                        confirm({
                            title: 'Delete Conversation',
                            confirmationText: "Delete",
                            description: 'Are you sure you want to delete this Conversation? (you cannot undo this action)'
                        }).then(() => {
                            db.collection("chats").doc(router.query?.id?.toString()).delete();
                            router.push("/");
                        }).catch()
                    }}>
                        <ListItemIcon color={'inherit'}>
                            <Delete/>
                        </ListItemIcon>
                        <ListItemText primary={"Delete Conversation"}/>
                    </ListItemButton>
                </ListItem>
                {backgrounds && <Fragment>
                    <br/>
                    <ListItem>
                        <ListItemText primary={'Chat Background'} secondary={'Select chat background'}/>
                    </ListItem>
                    <ListItem style={{width: '100%'}}>
                        <div style={{paddingLeft: "0.5rem", paddingTop: '1rem'}}>
                            {chat.loading && (<Skeleton variant={'rectangular'} width={'100%'} height={'10rem'}/>)}
                            {(!chat.loading && chat.data) && <Grid container spacing={2}>
                                <Grid item>
                                    <IconButton
                                        onClick={() => db.collection("chats").doc(chat.data.id).set({background: null}, {merge: true})}
                                        disabled={!chat.data.background}>
                                        <Avatar
                                            component={Paper}
                                            variant={'rounded'}
                                            src={`https://docs.cloud.kabeers.network/static/chats/backgrounds/default/${theme.palette.mode === 'dark' ? 'black.jpeg' : 'white.png'}`}/>
                                    </IconButton>
                                </Grid>
                                {images.map(([hash, {name}]) => (
                                    <Grid key={hash} item>
                                        <IconButton
                                            onClick={async () => db.collection("chats").doc(chat.data.id).set({
                                                background: {
                                                    ...chat.data.background ? {} : chat.data.background,
                                                    hash: hash,
                                                    name,
                                                    ambient: {
                                                        main: await getDominantColor(`https://docs.cloud.kabeers.network/static/chats/backgrounds/images/${name}`)
                                                    }
                                                }
                                            }, {merge: true})}
                                            disabled={chat.data?.background ? (chat.data?.background?.hash === hash) : false}>
                                            <Avatar
                                                imgProps={{loading: 'lazy'}}
                                                component={Paper}
                                                variant={'rounded'}
                                                src={`https://docs.cloud.kabeers.network/static/chats/backgrounds/images/${name}`}/>
                                        </IconButton>
                                    </Grid>
                                ))}
                                {(images.length < Object.keys(backgrounds).length) &&
                                    <Grid item xs={12}><Button onClick={() => {
                                        setImages(Object.entries(backgrounds).slice(0, images.length + 10))
                                    }}>Load More</Button></Grid>}
                            </Grid>}
                        </div>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={'Conversation Background Blurring'}
                                      secondary={'Enable Conversation background blurring'}/>
                        <Checkbox checked={!!(chat.data?.background?.blur)}
                                  onClick={() => db.collection("chats").doc(chat.data.id).set({
                                      'background': {
                                          ...chat.data.background ? {} : chat.data.background,
                                          blur: !!!(chat.data?.background?.blur)
                                      }
                                  }, {merge: true})}/>
                    </ListItem>
                </Fragment>}
            </List>
        </div>
    )
});
export default memo(Options)