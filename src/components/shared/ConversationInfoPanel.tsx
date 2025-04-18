import { Button } from "@/components/ui/button";
import { XOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

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
        <div className="w-[360px] bg-white shadow-lg border-l h-full overflow-y-auto absolute right-0 top-0 z-40 flex flex-col">
            {/* Header */}
            <div className="relative min-h-[69px] border-b shadow-md flex items-center justify-center font-semibold text-[17px]">
                <XOutlined
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-lg cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={onClose}
                />
                Thông tin hội thoại
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center mt-5 px-4 border-b-4  pb-5">
                <Avatar size={80} src="https://randomuser.me/api/portraits/women/1.jpg" />
                <div className="mt-3 text-[16px] font-medium">Nghĩa</div>

                <div className="grid grid-cols-3 gap-4 mt-5 text-center text-sm">
                    <div className="flex flex-col items-center text-gray-600">
                        <span className="text-xl">🔕</span>
                        <span className="">Tắt thông báo</span>
                    </div>
                    <div className="flex flex-col items-center text-blue-600">
                        <span className="text-xl">📌</span>
                        <span>Ghim hội thoại</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <span className="text-xl">👥</span>
                        <span>Tạo nhóm trò chuyện</span>
                    </div>
                </div>
            </div>

            {/* Info List */}
            <div className="mt-6 px-4 space-y-4 text-sm text-gray-700 border-b-4 pb-5">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🕒</span>
                    <span>Danh sách nhắc hẹn</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span>
                    <span>7 nhóm chung</span>
                </div>
            </div>

            {/* Media Section */}
            <div className="mt-6 px-4 border-b-4 pb-5">
                <div className="font-semibold text-sm mb-2 text-gray-800">Ảnh/Video</div>
                <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt="media"
                            className="w-full h-20 object-cover rounded-md border"
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

            {/* Files Section */}
            <div className="mt-6 pb-6">
                <div className="font-semibold text-sm mb-2 text-gray-800">File</div>
                <div className="flex flex-col gap-3 rounded-md cursor-pointer ">
                    <div className="flex items-center hover:bg-gray-200 transition py-3 px-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
                            alt="doc"
                            className="w-8 h-8"
                        />
                        <span className="text-sm text-gray-700 truncate">CNM_Tuan2.docx</span>
                    </div>
                    <div className="flex items-center hover:bg-gray-200 transition py-3 px-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
                            alt="doc"
                            className="w-8 h-8"
                        />
                        <span className="text-sm text-gray-700 truncate">CNM_Tuan2.docx</span>
                    </div>
                    <div className="flex items-center hover:bg-gray-200 transition py-3 px-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
                            alt="doc"
                            className="w-8 h-8"
                        />
                        <span className="text-sm text-gray-700 truncate">CNM_Tuan2.docx</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationInfoPanel;
