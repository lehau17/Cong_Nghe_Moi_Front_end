import ChangePasswordModal from "@/components/shared/ChangePasswordModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function GeneralPageSetting() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cài đặt chung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Thay đổi mật khẩu</span>
                        <Button variant="outline" onClick={() => setShowModal(true)}>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            {showModal && (
                <ChangePasswordModal onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}
