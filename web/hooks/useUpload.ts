import {useEffect, useState} from "react";

export default function useUpload(blob) {
    const [state, setState] = useState({
        loading: false,
        file: null,
        response: null
    })
    useEffect(() => {
        if (!blob) return;
        const formData = new FormData();
        const file = new File([blob], "audio.webm", {
            type: "audio/webm"
        })
        formData.append("file", file, file.name);
        setState({...state, file: file, loading: true});
        fetch("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/upload.php", {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        }).then(r => r.json()).then(res => {
            setState({...state, response: res, loading: true});
        });
    }, [blob]);
    return state
}