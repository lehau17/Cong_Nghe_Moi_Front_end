import { sendMessage } from "@/apis/conversation.api";
import { upload, uploadMulti } from "@/apis/upload.api";
import { updateUserProfile } from "@/apis/user.api";
import { useMutation } from "@tanstack/react-query";

export const useUploadAvatar = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const data = await upload(formData)
            const result = await updateUserProfile({ avatar: data.data.data.url });
            return result
        },
    });
};



export const useUploadAudioMessage = (conversationId: string) => {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await upload(formData);
            const url = uploadRes.data.data.url;

            const audio = new Audio(URL.createObjectURL(file));
            await new Promise((resolve) => {
                audio.onloadedmetadata = () => resolve(true);
            });

            return sendMessage({
                type: "audio",
                conversationId,
                content: url,
                fileMeta: [{
                    name: file.name,
                    size: file.size,
                    mimeType: file.type,
                    duration: Math.round(audio.duration),
                }],
            });
        },
    });
};


export const useUploadMultiImageMessage = (conversationId: string) => {
    return useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            // Call multi-upload API
            const res = await uploadMulti(formData)

            const urls = res.data.data; // assuming this format
            return sendMessage({
                type: "image",
                conversationId,
                content: undefined,
                fileMeta: urls.map((url, index) => {
                    return {
                        name: files[index].name,
                        size: files[index].size,
                        mimeType: files[index].type,
                        duration: undefined,
                        url: url.url
                    }
                })
            });
        },
    });
};




export const useUploadMultiFileMessage = (conversationId: string) => {
    return useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const res = await uploadMulti(formData);
            const uploadedUrls = res.data.data; // mỗi item: { url }

            const fileMeta = uploadedUrls.map((file, index) => {
                const original = files[index];
                return {
                    name: original.name,
                    size: original.size,
                    mimeType: original.type,
                    duration: undefined,
                    url: file.url,
                };
            });

            return sendMessage({
                conversationId,
                type: "file",
                content: undefined,
                fileMeta,
            });
        },
    });
};
