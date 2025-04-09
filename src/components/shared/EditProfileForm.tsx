import { Button } from "@/components/ui/button";
import http from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    fullName: z.string().min(1, "Tên không được để trống"),
    gender: z.enum(["male", "female"]),
    dobDay: z.string().min(1),
    dobMonth: z.string().min(1),
    dobYear: z.string().min(4),
});

type FormData = z.infer<typeof schema>;

const EditProfileForm = ({
    profile,
    onBack,
    setIsEdit,
}: {
    profile: any;
    onBack: () => void;
    setIsEdit: (val: boolean) => void;
}) => {
    const dob = new Date(profile?.dob || new Date());

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: profile?.fullName || "",
            gender: profile?.gender || "male",
            dobDay: dob.getDate().toString(),
            dobMonth: (dob.getMonth() + 1).toString(),
            dobYear: dob.getFullYear().toString(),
        },
    });

    const updateProfile = useMutation({
        mutationFn: (data: any) => http.patch("/user/me", data),
        onSuccess: () => {
            console.log("✅ Cập nhật thành công");
            setIsEdit(false); // quay về trang trước
        },
        onError: (err) => {
            console.error("❌ Lỗi cập nhật", err);
        },
    });

    const onSubmit = (data: FormData) => {
        const finalDob = new Date(
            parseInt(data.dobYear),
            parseInt(data.dobMonth) - 1,
            parseInt(data.dobDay)
        );

        const body = {
            fullName: data.fullName,
            gender: data.gender,
            dob: finalDob.toISOString(),
        };

        updateProfile.mutate(body);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 min-h-48">
            <label className="block font-medium">Tên hiển thị</label>
            <input {...register("fullName")} className="w-full border p-2 rounded" />
            {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}

            <div className="font-medium mt-4">Thông tin cá nhân</div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        value="male"
                        {...register("gender")}
                        defaultChecked={profile?.gender === "male"}
                    />
                    Nam
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        value="female"
                        {...register("gender")}
                        defaultChecked={profile?.gender === "female"}
                    />
                    Nữ
                </label>
            </div>

            <div>
                <label className="block font-medium mb-1">Ngày sinh</label>
                <div className="grid grid-cols-3 gap-2">
                    <select {...register("dobDay")} className="border rounded p-2 text-center">
                        {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <select {...register("dobMonth")} className="border rounded p-2 text-center">
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </option>
                        ))}
                    </select>
                    <select {...register("dobYear")} className="border rounded p-2 text-center">
                        {[...Array(100)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white"
                    disabled={updateProfile.isPending}
                >
                    {updateProfile.isPending ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
            </div>
        </form>
    );
};

export default EditProfileForm;
