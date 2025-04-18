import http from "@/lib/http";
import { SuccessResponse } from "@/types/utils.type";

export const sendFriendRequest = (to: string) => {
    return http.post("/friend-request/send", { to });
};



export const fetchPendingFriendRequests = async () => {
    const response = await http.get<SuccessResponse<any[]>>("friend-request?status=pending");
    return response
};


export const fetchAcceptFriendRequests = async () => {
    const response = await http.get<SuccessResponse<any[]>>("friend-request/friends");
    return response
};
