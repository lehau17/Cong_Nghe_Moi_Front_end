import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Buffer } from "buffer"; // thêm ở đầu file
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
export default function VerifyOTPPage() {
    const [searchParams] = useSearchParams();
    const encodedPhone = searchParams.get("phone");
    const phoneNumber = encodedPhone ? Buffer.from(encodedPhone, "base64").toString("utf-8") : "";


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ otp: string }>();

    const onSubmit = (data: { otp: string }) => {
        console.log("OTP submitted:", data.otp);
        toast.success("Xác minh thành công!");
        // TODO: Call API xác minh OTP ở đây
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
            <h1 className="text-3xl font-bold text-blue-600">Xác minh OTP</h1>
            <p className="text-gray-700 mt-2">Vui lòng nhập mã OTP gửi đến {phoneNumber}</p>

            <Card className="w-96 mt-6 p-4 relative min-w-[400px]">
                <CardHeader className="text-center font-bold border-b flex justify-center items-center p-0 mb-0">
                    Nhập mã OTP
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <Input
                            placeholder="Nhập mã OTP"
                            {...register("otp", { required: "Vui lòng nhập mã OTP" })}
                        />
                        {errors.otp && (
                            <p className="text-red-500 text-sm text-left w-full">{errors.otp.message}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Xác minh
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
