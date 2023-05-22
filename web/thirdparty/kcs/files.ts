import {fileTypeResolver} from "@/components/v2/Conversation/utils";

interface IUploadFileResponse {
    url: string,
    type: ("kn.chats.IMAGE" | "kn.chats.AUDIO")
}

type IUploadFileParams = { file: File, actionBackdrop?: boolean }
export const UploadFileToKCSBucket = async ({file}: IUploadFileParams): Promise<IUploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const res: { file: { url: string }, u: boolean, served_from_cache?: boolean } = await fetch("https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/upload.php?branch=vms-emulated", {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    }).then(r => r.json());
    return ({url: res.file.url, type: fileTypeResolver(file.type)});
}