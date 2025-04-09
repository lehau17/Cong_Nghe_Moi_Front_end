import { getUserProfile } from "@/apis/user.api";
import { Button } from "@/components/ui/button";
import { useUploadAvatar } from "@/queries/upload.query";
import { useQuery } from "@tanstack/react-query";
import { Camera, Pencil } from "lucide-react";
const ProfileView = ({ profile, onEdit }: { profile: any; onEdit: () => void }) => {
    const { mutate: uploadAvatar, isPending } = useUploadAvatar();
    const { refetch } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
    });
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        uploadAvatar(file, {
            onSuccess: () => {
                refetch()
            },

            onError: (err) => {
                console.error("Upload error:", err);
            },
        });
    };
    return (
        <>
            {/* Ảnh nền */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={profile?.background || "https://images.unsplash.com/photo-1549138144-42ff3cdd2bf8?q=80&w=2904&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Avatar */}
            <div className="relative flex items-center -mt-12 m-4">
                <img
                    src={
                        profile?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "User")}&background=random&size=128`
                    }
                    alt="Avatar"
                    className=" w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                />

                {/* Upload Button */}
                <div>
                    <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 left-1  bg-white rounded-full p-1 shadow-md cursor-pointer"
                    >
                        {isPending ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera size={20} className="text-gray-700" />
                        )}
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                    /></div>
                <div className="mt-8 ml-3 text-lg font-bold flex items-center gap-5">{profile?.fullName}
                    <Pencil size={18} className="cursor-pointer" />

                </div>

            </div>

            {/* Thông tin cá nhân */}
            <div className="p-3">
                <h2 className="border-t-4 py-3 font-semibold">Thông tin cá nhân</h2>
                <div className="space-y-2">
                    <div className="flex p-2 justify-between">
                        <span className="text-gray-500">Giới tính</span>
                        <span>
                            {profile?.gender === "male"
                                ? "Nam"
                                : profile?.gender === "female"
                                    ? "Nữ"
                                    : "Khác"}
                        </span>
                    </div>
                    <div className="flex p-2 justify-between">
                        <span className="text-gray-500">Ngày sinh</span>
                        <span>
                            {profile?.dob
                                ? new Date(profile.dob).toLocaleDateString("vi-VN")
                                : "Chưa cập nhật"}
                        </span>
                    </div>
                    <div className="flex p-2 justify-between">
                        <span className="text-gray-500">Điện thoại</span>
                        <span>{profile?.phoneNumber}</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500">
                    Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
                </p>
            </div>

            {/* Nút cập nhật */}
            <div className="p-4">
                <Button variant="outline" className="w-full flex gap-2" onClick={onEdit}>
                    <Pencil size={18} />
                    Cập nhật
                </Button>
            </div>
        </>
    );
};

export default ProfileView
