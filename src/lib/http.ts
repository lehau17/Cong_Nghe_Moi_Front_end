import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from "@/apis/auth.api"
import config from '@/constants/config'
import HttpStatusCode from '@/constants/httpStatusCode.enum'
import {
    clearLS,
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS,
    setRefreshTokenToLS
} from '@/lib/auth'
import axios, { type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'


class Http {
    instance: AxiosInstance
    private accessToken: string
    private refreshToken: string
    private refreshTokenRequest: Promise<string> | null
    constructor() {
        this.accessToken = getAccessTokenFromLS()
        this.refreshToken = getRefreshTokenFromLS()
        this.refreshTokenRequest = null
        this.instance = axios.create({
            baseURL: config.baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken && config.headers) {
                    config.headers.authorization = "Bearer " + this.accessToken
                    return config
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        // Add a response interceptor
        this.instance.interceptors.response.use(
            (response) => {
                const { url } = response.config
                if (url === URL_LOGIN || url === URL_REGISTER) {
                    const data = response.data as any // auth
                    this.accessToken = data.data.access_token
                    this.refreshToken = data.data.refresh_token
                    setAccessTokenToLS(this.accessToken)
                    setRefreshTokenToLS(this.refreshToken)
                    setProfileToLS(data.data.user)
                } else if (url === URL_LOGOUT) {
                    this.accessToken = ''
                    this.refreshToken = ''
                    clearLS()
                }
                return response
            },
            (error: any) => {
                // Chỉ toast lỗi không phải 422 và 401
                if (
                    ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized, HttpStatusCode.BadRequest].includes(error.response?.status as number)
                ) {
                    console.log("Toast loi o HTTP")
                    const data: any | undefined = error.response?.data
                    const message = data?.message || error.message
                    toast.error(message)
                }
                if (isAxiosUnauthorizedError(error)) {
                    const config = error.response?.config || {} as any
                    const { url } = config as any
                    if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
                        // Hạn chế gọi 2 lần handleRefreshToken
                        this.refreshTokenRequest = this.refreshTokenRequest
                            ? this.refreshTokenRequest
                            : this.handleRefreshToken().finally(() => {
                                // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                                setTimeout(() => {
                                    this.refreshTokenRequest = null
                                }, 10000)
                            })
                        return this.refreshTokenRequest.then((access_token) => {
                            // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                            return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
                        })
                    }



                    clearLS()
                    this.accessToken = ''
                    this.refreshToken = ''

                }
                return Promise.reject(error)
            }
        )
    }
    private handleRefreshToken() {
        return this.instance
            .post(URL_REFRESH_TOKEN, {
                refresh_token: this.refreshToken
            })
            .then((res) => {
                const { access_token } = res.data.data
                setAccessTokenToLS(access_token)
                this.accessToken = access_token
                return access_token
            })
            .catch((error) => {
                clearLS()
                this.accessToken = ''
                this.refreshToken = ''
                throw error
            })
    }
}
const http = new Http().instance
export default http
