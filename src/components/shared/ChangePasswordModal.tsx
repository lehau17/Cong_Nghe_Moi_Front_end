import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import http from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z
    .object({
        oldPassword: z.string().min(6, "Mật khẩu cũ không hợp lệ"),
        newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof schema>;

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (data: { oldPassword: string; newPassword: string, confirmPassword: string }) =>
            http.post("/auth/change-password", data),
        onSuccess: () => {
            toast.success("Đổi mật khẩu thành công", { autoClose: 2000 });
            onClose();
        },
        onError: (err: any) => {
            toast.success(err?.response?.data?.message || "❌ Lỗi đổi mật khẩu", { autoClose: 2000 });

        },
    });

    const onSubmit = (data: FormData) => {
        mutation.mutate({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        });
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogDescription>
                        Hãy nhập mật khẩu cũ và mật khẩu mới để thay đổi.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <div>
                        <label className="text-sm">Mật khẩu cũ</label>
                        <Input type="password" {...register("oldPassword")} />
                        {errors.oldPassword && (
                            <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">Mật khẩu mới</label>
                        <Input type="password" {...register("newPassword")} />
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">Xác nhận mật khẩu</label>
                        <Input type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Đang xử lý..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordModal;
