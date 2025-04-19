import { getUserProfileById } from "@/apis/user.api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";

interface Props {
    open: boolean;
    onClose: () => void;
    user: any; // 👈 Thêm prop user (tạm thời chưa dùng)
}

export default function ProfileModal({ open, onClose, user }: Props) {
    // Tạm thời vẫn dùng mockUser, sau này sẽ thay bằng `user` từ props
    const { data } = useQuery({
        queryKey: ["getuserbyid", user],
        queryFn: () => getUserProfileById(user),
        enabled: open
    })

    const mockUser = data?.data.data



    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[500px] rounded-sm p-0 overflow-hidden">
                <DialogTitle className=" w-full h-full pt-3 pl-3 font-bold">
                    Thông tin người dùng
                </DialogTitle>
                <div className="relative">
                    <img src={"https://dailong.asia/page/download/phong-nen-tim-voi-duong-line-abstract-background-purple-curved-lines-decoration-abpcl-TcElgy.jpg"} alt="cover" className="w-full h-40 object-cover" />
                    <div className="absolute bottom-[-40px] left-[20px] w-25 h-25 rounded-full mr-2 border-1 border-black  bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                        {mockUser?.avatar && mockUser?.avatar !== "" ? (
                            <img src={mockUser?.avatar} className="w-full h-full object-cover rounded-full" alt="avatar" />
                        ) : (
                            mockUser?.fullName
                                ?.split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                        )}
                    </div>
                </div>

                <div className="mt-12 ">
                    <div className="text-xl font-semibold mb-2 px-4 ">{mockUser?.fullName}</div>
                    <div className="flex gap-2 border-b-4 shadow-sm justify-between p-4">
                        <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 w-[48%] cursor-pointer">Gọi điện</button>
                        <button className="px-4 py-2 rounded-md bg-blue-100 text-blue-600 font-medium w-[48%] cursor-pointer">Nhắn tin</button>
                    </div>

                    <div className="mt-4 px-4 border-b-3 shadow-sm pb-4">
                        <h3 className="text-sm font-bold text-gray-600 mb-1 ">Thông tin cá nhân</h3>
                        <div className="text-sm text-gray-800 space-y-1">
                            <div className="flex flex">
                                <span className="font-thin text-[gray] w-[30%]">Giới tính</span>
                                <p>{mockUser?.gender}</p>
                            </div>
                            <div className="flex flex">
                                <span className="font-thin text-[gray] w-[30%]">Ngày sinh</span>
                                <p>{mockUser?.dob}</p>
                            </div>
                            <div className="flex flex">
                                <span className="font-thin text-[gray] w-[30%]">Điện thoại</span>
                                <p>{mockUser?.phoneNumber}</p>
                            </div>

                        </div>
                    </div>

                    <div className="mt-4 px-4 border-b-4">
                        <h3 className="text-sm text-gray-600 mb-1 font-bold">Hình ảnh</h3>
                        {/* {mockUser?.sharedImages.length === 0 ? ( */}
                        <p className="text-sm italic text-gray-400 p-8 text-center">Chưa có ảnh nào được chia sẻ</p>
                        {/* ) : ( */}
                        {/* <div className="grid grid-cols-3 gap-2">
                                {mockUser?.sharedImages.map((url, idx) => (
                                    <img key={idx} src={url} className="w-full h-24 object-cover rounded-md" />
                                ))}
                            </div>
                        )} */}
                    </div>

                    {/* <div className="mt-4 border-t pt-3 text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-xl">👥</span> Nhóm chung ({mockUser.sharedGroups})
                    </div> */}
                </div>
            </DialogContent>
        </Dialog >
    );
}
