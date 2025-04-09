import { upload } from "@/apis/upload.api";
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

