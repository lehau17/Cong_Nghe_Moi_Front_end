import { fetchPendingFriendRequests } from "@/apis/friend-request.api";
import http from "@/lib/http";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePendingFriendRequests = () => {
    return useQuery({
        queryKey: ["friend-requests", "pending"],
        queryFn: fetchPendingFriendRequests,
    });
};

import { UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
