import { fetchAcceptFriendRequests, fetchPendingFriendRequests } from "@/apis/friend-request.api";
import http from "@/lib/http";
import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePendingFriendRequests = () => {
    return useQuery({
        queryKey: ["friend-requests", "pending"],
        queryFn: fetchPendingFriendRequests,
    });
};

export const useAcceptedFriendRequests = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["friend-requests", "accepted"],
        queryFn: fetchAcceptFriendRequests,
        enabled
    });
};


export const useAcceptFriendRequest = (options?: UseMutationOptions<any, unknown, string>) => {
    return useMutation({
        mutationFn: (id: string) => http.put(`/friend-request/accept/${id}`),
        onSuccess: () => { toast.info("Bạn đã chấp nhận lời mời kết bạn.") },
        ...options,
    });
};

export const useRejectFriendRequest = (options?: UseMutationOptions<any, unknown, string>) => {
    return useMutation({
        mutationFn: (id: string) => http.put(`/friend-request/reject/${id}`),
        onSuccess: () => { toast.info("Huỷ lời mời kết bạn thành công.") },
        ...options,
    });
};
