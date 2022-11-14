import {db} from "../../firebaseconfig";
import {Avatar, Box, Button, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import Header from "../../components/Header";
import {useContext} from "react";
import {ChatContext, DrawerContext} from "../../Contexts";
import TimeAgo from "timeago-react"

export default function Profile({user}) {
    console.log(user);
    const {drawerWidth, type, isDesktop} = useContext(DrawerContext);
    const {createChat} = useContext(ChatContext)
    return (
        <div>
            <Box
                component="main"
                style={{marginLeft: type === "permanent" ? drawerWidth : 0}}>
                <Header/>
                <Container maxWidth={"md"} style={{marginTop: "1rem"}}>
                    {user ?
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "flex", justifyContent: "center", flex: 1}}>
                                <Avatar src={user.photoURL} style={{width: "5rem", height: "5rem"}}/>
                            </div>
                            <List>
                                <ListItem>
                                    <ListItemText primary={user.email} secondary={<TimeAgo
                                        datetime={new Date(user.lastActive.seconds * 1000)}/>}/>
                                </ListItem>
                                <List>
                                    <Button onClick={() => createChat(user.email)}
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
// if (process.env.BUILD_TYPE !== "native") {
export const _getServerSideProps = async ({query}) => {
    const user = await (db.collection('users').where('email', '==', query.id).limit(1).get());
    return ({
        props: {
            user: user.docs.length ? JSON.parse(JSON.stringify(user.docs[0].data())) : null
        }
    })
}
// }