import { Button } from "antd";
import { Pencil } from "lucide-react";

const ProfileView = ({ profile, onEdit }: { profile: any; onEdit: () => void }) => {
    return (
        <>
            {/* Avatar + Cover */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={profile?.background || "https://images.unsplash.com/..."}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative flex items-center -mt-12 m-4">
                <img
                    src={
                        profile?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "User")}&background=random&size=128`
                    }
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="mt-8 ml-3 text-lg font-bold flex items-center gap-5">
                    {profile?.fullName}
                    <Pencil size={18} className="cursor-pointer" onClick={onEdit} />
                </div>
            </div>

            <div className="p-3">
                <h2 className="border-t-4 py-3 font-semibold">Thông tin cá nhân</h2>
                <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Giới tính</span><span>{profile?.gender}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Ngày sinh</span><span>{profile?.dob}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Điện thoại</span><span>{profile?.phoneNumber}</span></div>
                </div>
            </div>

            <div className="p-4">
                <Button variant="outlined" className="w-full flex gap-2" onClick={onEdit}>
                    <Pencil size={18} />
                    Cập nhật
                </Button>
            </div>
        </>
    );
};

export default ProfileView
