import { XOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
interface Props {
    onClose: () => void;
}

const ConversationInfoPanel = ({ onClose }: Props) => {
    return (
        <div className="w-[360px] bg-white shadow-lg border-l h-full p-4 overflow-y-auto absolute right-0 top-0 z-40">
            <div className="flex justify-end mb-2">
                <XOutlined className="text-lg cursor-pointer text-gray-500 hover:text-red-500" onClick={onClose} />
            </div>
            <h2 className="text-lg font-semibold text-center mb-4">Thông tin hội thoại</h2>
            <div className="flex flex-col items-center space-y-2">
                <Avatar size={64} src="https://randomuser.me/api/portraits/women/1.jpg" />
                <div className="font-semibold text-lg">ục ằng oan inh êu</div>
                <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-gray-500">🔕</span>
                        <span>Tắt thông báo</span>
                    </div>
                    <div className="flex flex-col items-center text-blue-600">
                        <span>📌</span>
                        <span>Bỏ ghim</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span>👥</span>
                        <span>Tạo nhóm</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-2">
                <div className="font-medium">🕒 Danh sách nhắc hẹn</div>
                <div className="font-medium">👥 16 nhóm chung</div>
            </div>

            <div className="mt-6">
                <div className="font-semibold mb-2">Ảnh/Video</div>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, idx) => (
                        <img
                            key={idx}
                            src="https://i.imgur.com/5MZocC4.png"
                            className="w-full h-20 object-cover rounded-md"
                            alt="media"
                        />
                    ))}
                </div>
                <button className="w-full mt-3 py-2 rounded-md text-blue-600 font-semibold hover:bg-gray-100">
                    Xem tất cả
                </button>
            </div>

            <div className="mt-6">
                <div className="font-semibold mb-2">File</div>
                <div className="bg-gray-50 border p-2 rounded-md flex items-center justify-between">
                    <span>📄 microservices-app.zip</span>
                    <span className="text-green-500">⬇️</span>
                </div>
            </div>
        </div>
    );
};


export default ConversationInfoPanel
