import { XOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { Button } from "@/components/ui/button";

interface Props {
    onClose: () => void;
}

const images = [
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
];



const ConversationInfoPanel = ({ onClose }: Props) => {
    return (
        <div className="w-[360px] bg-white shadow-lg border-l h-full overflow-y-auto absolute right-0 top-0 z-40">
            <div className="flex justify-end mb-4 m-5">
                <XOutlined
                    className="text-lg cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={onClose}
                />
                <div className="border-b w-full ">Thông tin hộp thoại</div>

            </div>

            <div className="flex flex-col items-center space-y-2">
                <Avatar
                    size={80}
                    src="https://randomuser.me/api/portraits/women/1.jpg"
                />
                <div className="font-semibold text-lg">ục ằng oan inh êu</div>

                <div className="flex justify-center gap-6 mt-3">
                    <div className="flex flex-col items-center text-sm">
                        <span>🔕</span>
                        <span className="text-gray-600 mt-1">Tắt thông báo</span>
                    </div>
                    <div className="flex flex-col items-center text-sm">
                        <span className="text-blue-600">📌</span>
                        <span className="text-blue-600 mt-1">Bỏ ghim hội thoại</span>
                    </div>
                    <div className="flex flex-col items-center text-sm">
                        <span>👥</span>
                        <span className="text-gray-600 mt-1">Tạo nhóm trò chuyện</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center gap-2">
                    <span>🕒</span>
                    <span>Danh sách nhắc hẹn</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>16 nhóm chung</span>
                </div>
            </div>

            <div className="mt-6">
                <div className="font-semibold text-sm mb-2">Ảnh/Video</div>
                <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt="media"
                            className="w-full h-20 object-cover rounded-md"
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    className="w-full mt-3 text-blue-600 font-semibold hover:bg-gray-100"
                >
                    Xem tất cả
                </Button>
            </div>
        </div>
    );
};

export default ConversationInfoPanel;
