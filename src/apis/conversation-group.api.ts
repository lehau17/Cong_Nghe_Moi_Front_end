// src/apis/conversation-group.api.ts
import http from "@/lib/http";

export const createGroup = (data: { name: string; avatar?: string; members: string[] }) => {
    return http.post("/conversationGroup", data);
};
