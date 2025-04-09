import http from "@/lib/http";
import { UserProfile, UserUpdateProfile } from "@/types/user.type";
import { SuccessResponse } from "@/types/utils.type";


export const getUserProfile = () => http.get<SuccessResponse<UserProfile>>("/user/me");
export const updateUserProfile = (data: UserUpdateProfile) => http.patch<SuccessResponse<UserProfile>>("/user/me", data);
