import {useContext, useEffect} from "react";
import {ChatContext} from "../../Contexts";
import {useRouter} from "next/router";
import {CircularProgress} from "@mui/material";

export default function AddUserByLink() {
    const {createChat} = useContext(ChatContext);
    const router = useRouter();
    useEffect(() => {
        const c = new URLSearchParams(window.location.search);
        if (c.get("u")) {
            createChat(c.get('u')).then(id => {
                router.push("/chat/" + id);
            });
        }
        else router.push("/")
    }, [])
    return (
        <CircularProgress/>
    )
}