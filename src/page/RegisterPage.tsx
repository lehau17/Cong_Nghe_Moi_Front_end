import authApi from "@/apis/auth.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RegisterRequestOtpResponse } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Buffer } from "buffer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const registerSchema = z.object({
    fullName: z.string().min(2, "Tên không được để trống"),
    userName: z.string().min(3, "Username quá ngắn"),
    phoneNumber: z.string().regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
    gender: z.enum(["male", "female", "other"], {
        required_error: "Vui lòng chọn giới tính",
    }),
    passWord: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

type RegisterType = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm<RegisterType>({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation<
        AxiosResponse<RegisterRequestOtpResponse>,
        AxiosError<{ message: string, dataError: any }>,
        RegisterType
    >({
        mutationFn: (body) => authApi.registerAccount(body),
        onSuccess: (_, variables) => {
            toast.success("Đăng ký thành công!");
            const encodedPhone = Buffer.from(variables.phoneNumber).toString("base64");
            navigate(`/verify-otp?phone=${encodedPhone}`);
        },
        onError: (error) => {
            const apiError = error.response?.data;
            toast.error(apiError?.message || "Đăng ký thất bại");
            if (Array.isArray(apiError?.dataError)) {
                apiError.dataError.forEach((errObj: Record<string, string>) => {
                    Object.entries(errObj).forEach(([field, message]) => {
                        setError(field as keyof RegisterType, {
                            type: "server",
                            message,
                        });
                    });
                });
            }
        },
    });

    const onSubmit = (data: RegisterType) => {
        registerMutation.mutate(data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
            <h1 className="text-4xl font-bold text-blue-600">Zalo</h1>
            <p className="text-gray-600">Tạo tài khoản Zalo mới để sử dụng dịch vụ</p>

            <Card className="w-96 mt-6 p-4 relative min-w-[500px]">
                <CardHeader className="text-center font-bold border-b flex justify-center items-center p-0 mb-0">Đăng ký tài khoản</CardHeader>
                <CardContent className="flex flex-col items-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <div>
                            <Input placeholder="Họ và tên" {...register("fullName")} />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm text-left w-full">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <Input placeholder="Tên người dùng" {...register("userName")} />
                            {errors.userName && (
                                <p className="text-red-500 text-sm text-left w-full">{errors.userName.message}</p>
                            )}
                        </div>

                        <div>
                            <Input placeholder="Số điện thoại" {...register("phoneNumber")} />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm text-left w-full">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        <div>
                            <Input placeholder="Email" {...register("email")} />
                            {errors.email && (
                                <p className="text-red-500 text-sm text-left w-full">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Select onValueChange={(val) => setValue("gender", val as any)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Nam</SelectItem>
                                    <SelectItem value="female">Nữ</SelectItem>
                                    <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm text-left w-full">{errors.gender.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                placeholder="Mật khẩu"
                                type="password"
                                {...register("passWord")}
                            />
                            {errors.passWord && (
                                <p className="text-red-500 text-sm text-left w-full">{errors.passWord.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white hover:bg-blue-600"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>
                    </form>

                    <p
                        className="mt-4 text-blue-500 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Đã có tài khoản? Đăng nhập
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
