
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

export default function LoginPage() {
  const [isQR, setIsQR] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 w-[100%]">
      <h1 className="text-4xl font-bold text-blue-600">Zalo</h1>
      <p className="text-gray-600">Đăng nhập tài khoản Zalo để kết nối với ứng dụng Zalo Web</p>

      <Card className="w-96 mt-6 p-4 relative">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">
            {isQR ? "Đăng nhập qua mã QR" : "Đăng nhập với mật khẩu"}
          </h2>
          <Menu className="cursor-pointer" size={20} />

        </div>
        <CardContent className="mt-4 flex flex-col items-center">
          {isQR ? (
            <QRCodeCanvas value="https://zalo.me/qr-login" size={180} />
          ) : (
            <div className="space-y-4 w-full">
              <Input placeholder="Số điện thoại" type="text" className="w-full" />
              <Input placeholder="Mật khẩu" type="password" className="w-full" />
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Đăng nhập với mật khẩu
              </Button>
              <p className="text-center text-blue-500 cursor-pointer">Quên mật khẩu</p>
            </div>
          )}
          <p
            className="mt-4 text-blue-500 cursor-pointer"
            onClick={() => setIsQR(!isQR)}
          >
            {isQR ? "Đăng nhập với mật khẩu" : "Đăng nhập qua mã QR"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
