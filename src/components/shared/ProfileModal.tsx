import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Pencil } from "lucide-react";

const ProfileModal = ({ open, setOpen }:{open :any , setOpen :any}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 rounded-sm">
        {/* Header */}
        <DialogHeader className="relative">
          <DialogTitle className="p-4 text-lg font-semibold">Thông tin tài khoản</DialogTitle>
          {/* <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setOpen(false)}>
            <X size={20} />
          </Button> */}
        </DialogHeader>

        {/* Ảnh nền */}
        <div className="relative h-48 w-full overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1549138144-42ff3cdd2bf8?q=80&w=2904&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Cover"
                className="w-full h-full object-cover"
            />
        </div>


        {/* Avatar */}
            <div className="flex">
                <div className="relative flex flex-col items-center -mt-12 m-4">
                    <div className="w-24 h-24 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold border-4 border-white shadow-md">
                        LH
                    </div>
                    <Button size="icon" className="absolute right-[7%] bottom-0 bg-white shadow-md">
                        <Camera size={18} className="text-gray-700" />
                    </Button>
                  </div>
                  <>
                      <div className="flex justify-start">
                      <span className="font-semibold">
                        Lê Trung Hậu
                      </span>
                    <Pencil size={16} className="cursor-pointer text-gray-500 mt-1 mx-2" />
                      </div>
                    </>

            </div>


        {/* Thông tin cá nhân */}
              <div className="p-3">
          <div className="flex items-center justify-center gap-2">
          </div>
          <h2 className = "border-t-4 py-3 font-semibold">Thông tin cá nhân </h2>
          <div className="space-y-2">
            <div className="flex p-2 justify-between">
              <span className="text-gray-500">Giới tính</span>
              <span>Nam</span>
            </div>
            <div className="flex p-2 justify-between">
              <span className="text-gray-500">Ngày sinh</span>
              <span>17 tháng 12, 2003</span>
            </div>
            <div className="flex p-2 justify-between">
              <span className="text-gray-500">Điện thoại</span>
              <span>+84 977 917 160</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
                Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
          </p>
        </div>

        {/* Nút cập nhật */}
        <div className="p-4">
          <Button variant="outline" className="w-full flex gap-2">
            <Pencil size={18} />
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
