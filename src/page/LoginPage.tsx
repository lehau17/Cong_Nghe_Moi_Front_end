import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoginQuery } from "@/queries/auth.query";
import { loginType } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Menu } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
// Schema kiểm tra form
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không hợp lệ")
    .regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(20, "Mật khẩu tối đa 20 ký tự"),
});



export default function LoginPage() {
  const [isQR, setIsQR] = useState(false);
    const navigate = useNavigate()
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginType>({
    resolver: zodResolver(loginSchema),
  });

  // Sử dụng useLoginQuery để gọi API
  const loginMutation = useLoginQuery();

  const onSubmit = (data: loginType) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
            toast.success("Đăng nhập thành công!", { autoClose: 3000 });
            setTimeout(() => {
                navigate("/chat");
              }, 1000);

      },
      onError: (error: any) => {
        toast.error(error.message, { autoClose: 3000 });
      },
    });
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
              {/* Input số điện thoại */}
              <Input
                placeholder="Số điện thoại"
                type="text"
                {...register("phoneNumber")}
                className="w-full"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm text-start">{errors.phoneNumber.message}</p>
              )}

              {/* Input mật khẩu */}
              <Input
                placeholder="Mật khẩu"
                type="password"
                {...register("password")}
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm text-start">{errors.password.message}</p>
              )}

              {/* Nút đăng nhập */}
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={loginMutation.isPending} // Disabled khi đang gửi request
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập với mật khẩu"}
              </Button>

              {loginMutation.isError && (
                <p className="text-red-500 text-sm text-center">
                  {(loginMutation.error as any).response?.data?.error || "Đăng nhập thất bại"}
                </p>
              )}

              <p className="text-center text-blue-500 cursor-pointer">Quên mật khẩu</p>
            </form>
          )}

          {/* Chuyển đổi giữa mã QR và mật khẩu */}
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
