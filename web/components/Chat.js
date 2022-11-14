import {Fragment, memo} from "react";
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../firebaseconfig';
import {useCollection, useCollectionData} from 'react-firebase-hooks/firestore';
import {useRouter} from 'next/router';

import styled from "@mui/material/styles/styled";
import dynamic from "next/dynamic";

const Avatar = dynamic(() => import("@mui/material/Avatar"))
const IconButton = dynamic(() => import("@mui/material/IconButton"))
const ListItem = dynamic(() => import("@mui/material/ListItem"))
const ListItemAvatar = dynamic(() => import("@mui/material/ListItemAvatar"))
const ListItemButton = dynamic(() => import("@mui/material/ListItemButton"))
const ListItemSecondaryAction = dynamic(() => import("@mui/material/ListItemSecondaryAction"))
const ListItemText = dynamic(() => import("@mui/material/ListItemText"))
const TimeAgo = dynamic(() => import("timeago-react"))
const Delete = dynamic(() => import("@mui/icons-material/Delete"))
const Badge = dynamic(() => import("@mui/material/Badge"))
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"))

const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
}));
const Chat = ({id, expanded, openChat: _openChat, data}) => {
    const router = useRouter();
    const [user, userLoading] = useAuthState(auth);
    if (userLoading) return <CircularProgress/>;
    const [recipientSnapshot] = useCollectionData(
        user ? db.collection('users').where('email', 'in', data.users.filter(($user) => $user !== user.email)).limit(2) : null
    );
    const openChat = async () => {
        if (_openChat) _openChat(id, data);
        await router.push(`/chat/${id}`);
    };
    const recipientEmails = data.users.filter(($user) => $user !== user.email);
    const [messagesSnapshot] = useCollection(
        // .where("user", "==", recipientEmail)
        db.collection('chats').doc(id).collection('messages').orderBy("timestamp", "desc").limit(1)
    );
    const lastMessageData = messagesSnapshot?.docs?.[0]?.data?.()
    return (
        <ListItem disablePadding={expanded} onClick={openChat}>
            <ListItemButton selected={router.query.id === id}>
                <ListItemAvatar>
                    {recipientSnapshot?.length ? <>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            badgeContent={
                                recipientSnapshot?.[1] ?
                                    <SmallAvatar src={recipientSnapshot?.[1].photoURL}/> : null
                            }
                        >
                            <Avatar imgProps={{referrerPolicy: "no-referrer"}} src={recipientSnapshot?.[0].photoURL}
                                    label={recipientSnapshot?.[0].email.slice(0, 2)}/>
                        </Badge>
                    </> : <Avatar/>}
                </ListItemAvatar>
                <ListItemText
                    primary={<div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{recipientEmails.length > 1 ? `${data?.name ?? recipientEmails.join(", ")}` : recipientEmails[0]}</div>}
                    secondary={
                        <div style={{direction: "rtl", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}><strong style={{wordWrap: "no-wrap", whiteSpace: "nowrap", textOverflow: "ellipsis", overflowX: "hidden"}}>{(lastMessageData?.message?.length ? lastMessageData?.message : null) ?? (lastMessageData?.files?.length ? "Sent an attachment" : "new message(s)")}</strong> - {" "}
                            {recipientSnapshot?.length > 1 ? <Fragment>
                                {data.lastSent?.toDate() ? (
                                    <TimeAgo datetime={data?.lastSent?.toDate()}/>
                                ) : (
                                    'Unavailable'
                                )}
                            </Fragment> : <Fragment>
                                {recipientSnapshot?.[0]?.lastActive?.toDate() ? (
                                    <TimeAgo datetime={recipientSnapshot[0]?.lastActive?.toDate()}/>
                                ) : (
                                    'Unavailable'
                                )}
                            </Fragment>}</div>}/>
                <ListItemSecondaryAction hidden>
                    <IconButton>
                        <Delete/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItemButton>
        </ListItem>
    )
};

export default memo(Chat);
