import http from "@/lib/http";
import { MesageType } from "@/schemas/message";
import { SuccessResponse } from "@/types/utils.type";

export const getMessageByConversation = (converId: string) => http.get<SuccessResponse<MesageType[]>>(`/message/${converId}`);


export const forwardMessage = (payload: {
    messageId: string;
    targetConversationIds: string[];
}) => {
    return http.post("/message/forward-many", payload);
};


export const recallMessage = (messageId: string) => {
    return http.put(`/message/recall/${messageId}`);
};
