import authApi from "@/apis/auth.api";
import { loginType } from "@/schemas/login";
import { AuthResponse } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export const useLoginQuery = () => {
    return useMutation<AxiosResponse<AuthResponse, any>, AxiosError<{ isSuccess: boolean, message: string, dataError: any }>, loginType, unknown>({
        mutationFn: (body: loginType) =>
            authApi.login(body)
    })
}


