import http from "@/lib/http";

export const sendFriendRequest = (to: string) => {
    return http.post("/friend-request/send", { to });
};
