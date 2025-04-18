import http from "@/lib/http";
import { Conversation, MessageCreateBody } from "@/types/conversation";
import { SuccessResponse } from "@/types/utils.type";

export const getMyConversations = () => {
    return http.get<SuccessResponse<Conversation[]>>("/conversation/me");
};


export const sendMessage = (content: MessageCreateBody) => {
    return http.post("/message/send", content)
}


export const getConversationDetailOrCreate = (toUserId: string) => {
    return http.post("/conversation/detail", { to: toUserId });
};
