import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
    open: boolean;
    onClose: () => void;
    user: any; // 👈 Thêm prop user (tạm thời chưa dùng)
}

export default function ProfileModal({ open, onClose, user: _ }: Props) {
    // Tạm thời vẫn dùng mockUser, sau này sẽ thay bằng `user` từ props
    const mockUser = {
        name: "ục àng oan inh êu",
        phone: "+84 815 014 744",
        gender: "Nữ",
        birthday: "06/05",
        avatar: "https://i.pravatar.cc/100?img=65",
        cover: "https://i.imgur.com/qrb9X6p.jpg",
        sharedImages: [],
        sharedGroups: 16,
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[500px] rounded-sm p-0 overflow-hidden">
                <DialogTitle className=" w-full h-full pt-3 pl-3 font-bold">
                    Thông tin người dùng
                </DialogTitle>
                <div className="relative">
                    <img src={mockUser.cover} alt="cover" className="w-full h-40 object-cover" />
                    <div className="absolute -bottom-10 left-4">
                        <img
                            src={mockUser.avatar}
                            alt="avatar"
                            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
                        />
                    </div>
                </div>

                <div className="mt-12 ">
                    <div className="text-xl font-semibold mb-2 px-4 ">{mockUser.name}</div>
                    <div className="flex gap-2 border-b-4 shadow-sm justify-between p-4">
                        <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 w-[48%] cursor-pointer">Gọi điện</button>
                        <button className="px-4 py-2 rounded-md bg-blue-100 text-blue-600 font-medium w-[48%] cursor-pointer">Nhắn tin</button>
                    </div>

                    <div className="mt-4 px-4 border-b-3 shadow-sm pb-4">
                        <h3 className="text-sm font-bold text-gray-600 mb-1 ">Thông tin cá nhân</h3>
                        <div className="text-sm text-gray-800 space-y-1">
                            <div className="flex flex">
                                <span className="font-thin text-[gray] w-[30%]">Giới tính</span>
                                <p>{mockUser.gender}</p>
                            </div>
                            <div className="flex flex">
                                <span className="font-thin text-[gray] w-[30%]">Ngày sinh</span>
                                <p>{mockUser.birthday}</p>
                            </div>
                            <div className="flex flex">
                                <span className="font-thin text-[gray] w-[30%]">Điện thoại</span>
                                <p>{mockUser.phone}</p>
                            </div>

                        </div>
                    </div>

                    <div className="mt-4 px-4 border-b-4">
                        <h3 className="text-sm text-gray-600 mb-1 font-bold">Hình ảnh</h3>
                        {mockUser.sharedImages.length === 0 ? (
                            <p className="text-sm italic text-gray-400 p-8 text-center">Chưa có ảnh nào được chia sẻ</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {mockUser.sharedImages.map((url, idx) => (
                                    <img key={idx} src={url} className="w-full h-24 object-cover rounded-md" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* <div className="mt-4 border-t pt-3 text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-xl">👥</span> Nhóm chung ({mockUser.sharedGroups})
                    </div> */}
                </div>
            </DialogContent>
        </Dialog >
    );
}
