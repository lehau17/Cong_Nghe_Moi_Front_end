import http from "@/lib/http"

export const groupApi = {
    getMyGroups: () => {
        return http.get("/conversationGroup/me")
    },
    search: (keyword: string | null | undefined) => {
        return http.get("/conversationGroup/search/by-name", {
            params: {
                keyword
            }
        })
    }
}



