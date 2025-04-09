import { getUserProfile } from "@/apis/user.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUploadAvatar } from "@/queries/upload.query";
import { useQuery } from "@tanstack/react-query";
import { Camera, Pencil } from "lucide-react";
import { useEffect } from "react";

const ProfileModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: open, // chỉ fetch khi open
    });
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (open) refetch();
    }, [open, refetch]);

    const profile = data?.data?.data;


    const { mutate: uploadAvatar, isPending, data: dataUpload } = useUploadAvatar();

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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg p-0 rounded-sm">
                <DialogHeader className="relative">
                    <DialogTitle className="p-4 text-lg font-semibold">
                        {isEditing ? "Cập nhật thông tin cá nhân" : "Thông tin tài khoản"}
                    </DialogTitle>
                </DialogHeader>

                {isEditing ? (
                    <EditProfileForm profile={profile} onBack={() => setIsEditing(false)} />
                ) : (
                    <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
                )}
            </DialogContent>

        </Dialog>
    );
};

export default ProfileModal;
