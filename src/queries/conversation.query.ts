import { disbandGroup, getFriendsNotInGroup } from "@/apis/conversation-group.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";


export const useFriendsNotInGroup = (groupId: string, keyword: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["friendsNotInGroup", groupId, keyword],
        queryFn: () => getFriendsNotInGroup(groupId, keyword),
        enabled,
    });
};


export const useDisbandGroup = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: (groupId: string) => disbandGroup(groupId),
        onSuccess: () => {
            onSuccess?.();
        },
        onError: () => {
            toast.error("❌ Không thể giải tán nhóm.");
        },
    });
};




