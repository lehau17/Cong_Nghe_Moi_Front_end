import authApi from "@/apis/auth.api";
import http from "@/lib/http";
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




export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (data: { phoneNumber: string; otp: string }) =>
            http.post("/auth/sign-up/verify-otp", data),
    });
};


// 🔐 Request gửi OTP tới số điện thoại
export const useForgotPasswordRequestOtp = () =>
    useMutation({
        mutationFn: (data: { phoneNumber: string }) =>
            http.post("/auth/forgot-password", data),
    });

// ✅ Verify OTP
export const useForgotPasswordVerifyOtp = () =>
    useMutation({
        mutationFn: (data: { phoneNumber: string; otp: string }) =>
            http.post("/auth/forgot-password/verify-otp", data),
    });

