import {InputBase, List, ListItem, ListItemText} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {db} from "../firebaseconfig";
import {ChatListPure} from "./ChatList";
import {useCollectionData, useCollectionDataOnce} from "react-firebase-hooks/firestore";
import {ChatContext} from "../Contexts";

export const UsersSearch = () => {
    // const [users, usersLoading] = useCollectionDataOnce(db.collection("users"));
    const {snapshots: {chats}} = useContext(ChatContext);
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div>
                <InputBase/>
            </div>
            <div>
                <ChatListPure expanded={true} chatProps={{openChat: (id, data) => console.log(id, data)}} chatsSnapshot={chats.data?.filter(({users}) => !(users.length > 2))}/>
            </div>
        </div>
    )
}