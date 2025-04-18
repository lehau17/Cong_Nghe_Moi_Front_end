import { DownloadOutlined, FileWordOutlined } from "@ant-design/icons";
import mammoth from "mammoth";
import { useEffect, useState } from "react";

interface Props {
    file: {
        url: string;
        name: string;
    };
}

export const DocxPreview = ({ file }: Props) => {
    const [preview, setPreview] = useState<string>("Đang tải nội dung...");

    useEffect(() => {
        console.log(file)
        const loadPreview = async () => {
            try {
                const res = await fetch(file.url);

                const blob = await res.blob();
                const arrayBuffer = await blob.arrayBuffer();

                const result = await mammoth.convertToHtml({ arrayBuffer });
                setPreview(result.value.slice(0, 300) + "...");
            } catch (error) {
                setPreview("Không đọc được nội dung file");
            }
        };

        loadPreview();
    }, [file.url]);


    return (
        <div className="border rounded-md bg-white p-2 shadow-sm">
            <div
                className="text-sm text-gray-800 max-h-40 overflow-hidden border-2 p-2"
                dangerouslySetInnerHTML={{ __html: preview }}
            />
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <FileWordOutlined />
                    {file.name}
                </div>
                <a href={file.url} download>
                    <DownloadOutlined className="text-lg cursor-pointer hover:text-blue-500" />
                </a>
            </div>
        </div>
    );
};
