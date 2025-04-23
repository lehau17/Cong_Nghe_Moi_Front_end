
import { updateGroupInfo } from "@/apis/conversation-group.api";
import { upload } from "@/apis/upload.api";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-toastify";
export const useUpdateGroupAvatar = (
    groupId: string,
    onAvatarUpdated: (newAvatar: string) => void
) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await upload(formData);
            const avatarUrl = uploadRes.data.data.url;

            await updateGroupInfo(groupId, { avatar: avatarUrl });
            return { avatar: avatarUrl };
        },
        onSuccess: ({ avatar }) => {
            toast.success("✅ Cập nhật ảnh đại diện thành công!");
            onAvatarUpdated(avatar); // 🟢 Gọi callback để cập nhật avatar ngoài hook
        },
        onError: () => {
            toast.error("❌ Upload hoặc cập nhật avatar thất bại!");
        },
    });

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            mutation.mutate(file);
        }
    };

    return {
        handleClick,
        inputRef,
        handleChange,
        isLoading: mutation.isPending,
    };
};





export const useUpdateGroupName = (
    groupId: string,
    onSuccessUpdate?: (newName: string) => void
) => {
    const mutation = useMutation({
        mutationFn: async (newName: string) => {
            const response = await updateGroupInfo(groupId, { name: newName });
            console.log(response)
            return response.data?.data?.name
        },
        onSuccess: (newName) => {
            console.log(newName)

            toast.success("✅ Tên nhóm đã được cập nhật");
            if (onSuccessUpdate) onSuccessUpdate(newName);
        },
        onError: () => {
            toast.error("❌ Cập nhật tên nhóm thất bại");
        },
    });

    return {
        updateName: mutation.mutate,
        isLoading: mutation.isPending,
    };
};
