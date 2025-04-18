import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForgotPasswordRequestOtp } from "@/queries/auth.query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Buffer } from "buffer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
    phoneNumber: z
        .string()
        .min(10, "Số điện thoại phải có ít nhất 10 số")
        .max(11, "Số điện thoại không hợp lệ")
        .regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const requestOtp = useForgotPasswordRequestOtp();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        requestOtp.mutate(
            { phoneNumber: data.phoneNumber },
            {
                onSuccess: () => {
                    toast.success("Đã gửi OTP tới số điện thoại!");
                    const encodedPhone = Buffer.from(data.phoneNumber).toString("base64");
                    navigate(`/verify-otp?phone=${encodedPhone}&type=forgot-password`);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || "Gửi OTP thất bại");
                },
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 ">
            <h1 className="text-3xl font-bold text-blue-600">Quên mật khẩu</h1>
            <p className="text-gray-700 mt-2">Nhập số điện thoại để nhận mã OTP</p>

            <Card className="w-96 mt-6 p-4 pt-10 relative min-w-[400px]">
                <CardContent className="flex flex-col items-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <Input
                            placeholder="Số điện thoại"
                            {...register("phoneNumber")}
                            className="w-full"
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm text-left w-full">
                                {errors.phoneNumber.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Gửi mã OTP
                        </Button>
                    </form>

                    <p
                        className="mt-4 text-blue-500 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Quay lại đăng nhập
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
