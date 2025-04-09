export type User = {
    phoneNumber: string
}


export type UserProfile = {
    _id: string;
    fullName: string;
    userName: string;
    phoneNumber: string;
    email: string;
    gender: "male" | "female" | "other";
    dob?: string | null; // Date ISO string hoặc null nếu chưa có
    avatar: string;
    background: string;
    status: "active" | "deactive" | "verify-register-otp";
    is_twofa_enabled: boolean;
    twofa_method: "OTP_EMAIL";
    is_visible_dob: "ONLY_DAY_MONTH" | "FULL" | "NO_VISIBLE";
    allow_message: "EVERY_ONE" | "FRIEND";
    allow_search_by_phone: boolean;
    enable_fast_message: boolean;
    list_fast_message: string[]; // có thể là object[] nếu mỗi message có thêm field
    createdAt: string; // hoặc Date nếu bạn convert
    updatedAt: string; // tương tự
};



export type UserUpdateProfile = Partial<UserProfile>
