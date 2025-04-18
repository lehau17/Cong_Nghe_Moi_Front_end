import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RightOutlined } from "@ant-design/icons";
export default function SettingFastMessagePage() {
    return (
        <div className="max-w-full p-4 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
            {/* Fast Message */}
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center border-b-2 pb-5">
                        <p className="font-medium">Tin nhắn nhanh</p>
                        <Switch defaultChecked />

                    </div>
                </CardContent>
                <CardContent className="flex justify-between ">
                    <p>Quản lý tin nhắn nhanh</p>
                    <RightOutlined />

                </CardContent>
            </Card>

            {/* Hidden Chat PIN */}
            <Card>
                <CardHeader>
                    <CardTitle>Thiết lập ẩn trò chuyện</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center border-b-2 pb-5">
                        <p className="font-medium">Mã Pin</p>
                        <Switch defaultChecked />

                    </div>
                    <div className="flex items-center justify-between w-full border-b-2 py-5">
                        <p>Đổi mã pin</p>
                        <RightOutlined />
                    </div>
                    <div className="flex items-center justify-between w-full  py-5">
                        <p>Xoá mã pin</p>
                        <RightOutlined />

                    </div>
                </CardContent>
            </Card>
            {/* Other Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Other Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Double-click message area to reply</span>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Show typing indicator</span>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
