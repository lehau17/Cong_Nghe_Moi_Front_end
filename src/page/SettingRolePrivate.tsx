import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RightOutlined } from "@ant-design/icons";
export default function SettingRolePrivatePage() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Hiện ngày sinh</span>
            <Select defaultValue="hidden">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hidden">Không hiện</SelectItem>
                <SelectItem value="show">Hiển thị</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <span>Hiển thị trạng thái truy cập</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Tin nhắn và cuộc gọi */}
      <Card>
        <CardHeader>
          <CardTitle>Tin nhắn và cuộc gọi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Hiện trạng thái "Đã xem"</span>
            <Switch />
          </div>

          <div className="flex justify-between items-center">
            <span>Cho phép nhắn tin</span>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mọi người</SelectItem>
                <SelectItem value="friends">Chỉ bạn bè</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <span>Cho phép gọi điện</span>
            <Select defaultValue="friends-contacts">
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friends">Chỉ bạn bè</SelectItem>
                <SelectItem value="friends-contacts">Bạn bè và người lạ từng liên hệ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chặn tin nhắn */}
      <Card>
        <CardHeader>
          <CardTitle>Chặn tin nhắn</CardTitle>
        </CardHeader>
        <CardContent>
                  <div className="flex justify-between">
                      <span>Danh Sách Chặn</span>
                      <span><RightOutlined /></span>
          </div>
        </CardContent>
      </Card>

      {/* Nguồn tìm kiếm */}
      <Card>
        <CardHeader>
          <CardTitle>Nguồn tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <span>
            Cho phép người lạ tìm thấy và kết bạn qua số điện thoại <strong>+84 977917160</strong>
          </span>
          <Switch defaultChecked />
        </CardContent>
      </Card>
    </div>
  );
}
