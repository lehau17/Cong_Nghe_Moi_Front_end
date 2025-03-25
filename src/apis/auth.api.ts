import http from "@/lib/http"
import { loginType } from "@/schemas/login"
import { AuthResponse } from "@/types/auth.type"

export const URL_LOGIN = '/auth/log-in'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'


const authApi = {
    registerAccount(body: { email: string; password: string }) {
        return http.post<AuthResponse>(URL_REGISTER, body)
    },
    login(body: loginType) {
        return http.post<AuthResponse>(URL_LOGIN, {
            phoneNumber: body.phoneNumber,
            passWord: body.password
        })
    },
    logout() {
        return http.post(URL_LOGOUT)
    }
}

export default authApi
