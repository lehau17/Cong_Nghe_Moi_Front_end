import http from "@/lib/http";
import { MessageResponse } from "@/schemas/message";
import { SuccessResponse } from "@/types/utils.type";

export const getMessageByConversation = (converId: string) => http.get<SuccessResponse<MessageResponse>>(`/message/${converId}`);


export const forwardMessage = (payload: {
    messageId: string;
    targetConversationIds: string[];
}) => {
    return http.post("/message/forward-many", payload);
};


export const recallMessage = (messageId: string) => {
    return http.put(`/message/recall/${messageId}`);
};



export const sendEmojiApi = (messageId: string, typeEmoji: string) =>
    http.post(`/message/${messageId}/emoji`, { typeEmoji });

export const revokeEmojiApi = (messageId: string, typeEmoji: string) =>
    http.delete(`/message/${messageId}/emoji`, { data: { typeEmoji } });
