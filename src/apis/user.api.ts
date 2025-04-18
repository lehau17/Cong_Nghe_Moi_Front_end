import http from "@/lib/http";
import { UserProfile, UserUpdateProfile } from "@/types/user.type";
import { SuccessResponse } from "@/types/utils.type";


export const getUserProfile = () => http.get<SuccessResponse<UserProfile>>("/user/me");
export const updateUserProfile = (data: UserUpdateProfile) => http.patch<SuccessResponse<UserProfile>>("/user/me", data);

export const searchUserByPhone = async (phone: string) => {
    const res = await http.get<SuccessResponse<UserProfile>>(`/user/search?phone=${phone}`);
    return res
};
