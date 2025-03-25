

export interface SuccessResponse<Data> {
    message: string
    data: Data
    status: number
    isSuccess: boolean
}
export interface ErrorResponse<Data> {
    message: string
    data?: Data
}

// cú pháp `-?` sẽ loại bỏ undefiend của key optional

export type NoUndefinedField<T> = {
    [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
