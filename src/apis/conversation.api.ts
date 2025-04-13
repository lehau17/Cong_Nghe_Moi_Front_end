import http from "@/lib/http";
import { Conversation } from "@/types/conversation";
import { SuccessResponse } from "@/types/utils.type";

export const getMyConversations = () => {
    return http.get<SuccessResponse<Conversation[]>>("/conversation/me");
};


export const sendMessage = (conversationId: string, content: string) => {
    return http.post("/message/send", { conversationId, content })
}


export const getConversationDetailOrCreate = (toUserId: string) => {
    return http.post("/conversation/detail", { to: toUserId });
};
