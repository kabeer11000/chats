import {Fragment, memo} from "react";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("./Chat"));
function replicate(arr, times) {
    for (const parts = []; times > 0; times >>= 1) {
        if (times & 1)
            parts.push(arr);
        arr = arr.concat(arr);
    }
    return Array.prototype.concat.apply([], parts);
}
export const ChatList = ({chatsSnapshot, expanded}) => (
    <Fragment>{(chatsSnapshot)?.map((chat) => (
        <Chat expanded={expanded} key={chat.id} id={chat.id} data={chat}/>
    ))}</Fragment>
)
export const ChatListPure = ({chatsSnapshot, chatProps, expanded}) => (
    <Fragment>{(chatsSnapshot)?.map((chat) => (
        <Chat {...chatProps} expanded={expanded} key={chat.id} id={chat.id} data={chat}/>
    ))}</Fragment>
)
export default memo(ChatList)