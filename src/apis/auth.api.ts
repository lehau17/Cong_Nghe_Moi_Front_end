import http from "@/lib/http"
import { loginType } from "@/schemas/login"
import { RegisterType } from "@/schemas/register"
import { AuthResponse, RegisterRequestOtpResponse } from "@/types/auth.type"
import {SuccessResponse} from "@/types/utils.type.ts";

export const URL_LOGIN = '/auth/log-in'
export const URL_REGISTER = '/auth/sign-up/request-otp'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

const authApi = {
    registerAccount(body: RegisterType) {
        return http.post<RegisterRequestOtpResponse>(URL_REGISTER, body)
    },
    login(body: loginType) {
        return http.post<AuthResponse>(URL_LOGIN, {
            phoneNumber: body.phoneNumber,
            passWord: body.password
        })
    },
    logout() {
        return http.post(URL_LOGOUT)
    },


    //refresh token
    refreshToken(refreshToken:string): Promise<SuccessResponse<any>> {
        return http.post(URL_REFRESH_TOKEN, {
            refresh_token: refreshToken
        })
    }
}

export default authApi
