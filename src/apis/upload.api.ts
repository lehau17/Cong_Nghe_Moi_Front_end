import http from "@/lib/http";
import { SuccessResponse } from "@/types/utils.type";

export const upload = (formData: FormData) => http.post<SuccessResponse<{
    key: string;
    url: string;
}>>("/upload", formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});
