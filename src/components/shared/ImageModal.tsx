// components/ImageModal.tsx
import { Modal } from "antd";

const ImageModal = ({
    open,
    onClose,
    src,
}: {
    open: boolean;
    onClose: () => void;
    src: string;
}) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width="auto"
            style={{ textAlign: "center" }}
        >
            <img
                src={src}
                alt="Preview"
                className="max-h-[80vh] max-w-full object-contain rounded-md"
            />
        </Modal>
    );
};

export default ImageModal;
