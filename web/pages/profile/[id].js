import {db} from "../../firebaseconfig";
import {Avatar, Box, Button, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import Header from "../../components/Header";
import {useContext} from "react";
import {ChatContext, DrawerContext} from "root-contexts";
import TimeAgo from "timeago-react"
import {useDocumentData} from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";
import {converter} from "../../components/v2/Conversation/utils";

export default function Profile() {
    const router = useRouter();
    const [owner, ownerLoading] = useDocumentData(db.collection('users').doc(router.query.id).withConverter(converter));
    const {drawerWidth, type} = useContext(DrawerContext);
    const {createChat} = useContext(ChatContext)
    return (
        <div>
            <Box
                component="main"
                style={{marginLeft: type === "permanent" ? drawerWidth : 0}}>
                <Header/>
                <Container maxWidth={"md"} style={{marginTop: "1rem"}}>
                    {owner ?
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "flex", justifyContent: "center", flex: 1}}>
                                <Avatar src={owner.photoURL} style={{width: "5rem", height: "5rem"}}/>
                            </div>
                            <List>
                                <ListItem>
                                    <ListItemText primary={owner.email} secondary={<TimeAgo
                                        datetime={new Date(owner.lastActive.seconds * 1000)}/>}/>
                                </ListItem>
                                <List>
                                    <Button onClick={() => createChat(owner.email)}
                                            style={{width: "100%", marginTop: "1rem"}} variant={"contained"}>
                                        Add to chat
                                    </Button>
                                </List>
                            </List>
                        </div> : <div>
                            <Typography>User Not Found</Typography>
                        </div>}
                </Container>
            </Box>
        </div>
    )
}