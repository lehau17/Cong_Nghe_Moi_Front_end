import authApi from "@/apis/auth.api";
import { loginType } from "@/schemas/login";
import { useMutation } from "@tanstack/react-query";

export const useLoginQuery = () => {
    return useMutation({
        mutationFn: (body: loginType) =>
            authApi.login(body)
    })
}


