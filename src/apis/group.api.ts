import http from "@/lib/http"

export const groupApi = {
    getMyGroups: () => {
        return http.get("/conversationGroup/me")
    }
}
