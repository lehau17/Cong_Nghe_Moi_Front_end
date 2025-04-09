import { getUserProfile } from "@/apis/user.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CaretLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import EditProfileForm from "./EditProfileForm";
import ProfileView from "./ProfileView";
const ProfileModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
    const { data, refetch } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: open, // chỉ fetch khi open
    });
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (open) refetch();
    }, [open, refetch]);

    const profile = data?.data?.data;




    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg p-0 rounded-sm">
                <DialogHeader className="relative">
                    <DialogTitle className="p-4 text-lg font-semibold">
                        {isEditing ? <div onClick={() => setIsEditing(false)} className="absolute left-4 top-4">
                            <CaretLeftOutlined className="cursor-pointer" />
                            <span>Cập nhật thông tin tài khoản</span>
                        </div> : "Thông tin tài khoản"}
                    </DialogTitle>
                </DialogHeader>

                {isEditing ? (
                    <EditProfileForm profile={profile} onBack={() => setIsEditing(false)} setIsEdit={setIsEditing} />
                ) : (
                    <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
                )}
            </DialogContent>

        </Dialog>
    );
};

export default ProfileModal;
