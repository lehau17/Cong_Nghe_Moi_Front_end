import http from "@/lib/http";
import { MesageType } from "@/schemas/message";
import { SuccessResponse } from "@/types/utils.type";

export const getMessageByConversation = (converId: string) => http.get<SuccessResponse<MesageType[]>>(`/message/${converId}`);
