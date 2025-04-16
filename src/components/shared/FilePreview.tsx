import { DownloadOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";
import mammoth from "mammoth";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import * as XLSX from "xlsx";

interface Props {
    file: {
        url: string;
        name: string;
        mimeType?: string;
    };
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const FilePreview = ({ file }: Props) => {
    const [preview, setPreview] = useState<string>("Đang tải nội dung...");
    const [isPdf, setIsPdf] = useState<boolean>(false);
    const [_, setNumPages] = useState<number | null>(null);

    const mimeType = file.mimeType || "";
    const extension = file.name.split(".").pop()?.toLowerCase();

    useEffect(() => {
        const loadPreview = async () => {
            try {
                const res = await fetch(file.url);
                const blob = await res.blob();

                if (mimeType.includes("pdf")) {
                    setIsPdf(true);
                    return;
                }

                if (mimeType.includes("word") || extension === "docx") {
                    const arrayBuffer = await blob.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    setPreview(result.value.slice(0, 300) + "...");
                }

                else if (mimeType.includes("json") || extension === "json") {
                    const text = await blob.text();
                    setPreview(`<pre>${text.slice(0, 300)}</pre>`);
                }

                else if (extension === "csv" || mimeType.includes("csv")) {
                    const text = await blob.text();
                    setPreview(`<pre>${text.slice(0, 300)}</pre>`);
                }

                else if (extension === "xlsx") {
                    const arrayBuffer = await blob.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const csv = XLSX.utils.sheet_to_csv(sheet);
                    setPreview(`<pre>${csv.slice(0, 300)}</pre>`);
                }

                else if (extension === "pptx") {
                    setPreview("Xem trước file PowerPoint chưa được hỗ trợ. Vui lòng tải về.");
                }

                else if (mimeType.includes("video")) {
                    const videoURL = URL.createObjectURL(blob);
                    setPreview(`<video src="${videoURL}" controls class="w-full rounded" />`);
                }

                else {
                    setPreview("Không hỗ trợ xem trước loại file này.");
                }
            } catch (err) {
                setPreview("Không đọc được nội dung file.");
            }
        };

        loadPreview();
    }, [file.url, mimeType]);

    const icon = mimeType.includes("pdf") ? <FilePdfOutlined className="text-red-500" /> :
        mimeType.includes("word") ? <FileWordOutlined className="text-blue-500" /> :
            <FileOutlined className="text-gray-500" />;

    return (
        <div className="border rounded-md bg-white p-2 shadow-sm">
            <div className="text-sm text-gray-800 max-h-60 overflow-auto border-2 p-2">
                {isPdf ? (
                    <Document
                        file={file.url}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading="Đang tải PDF..."
                        error="Không đọc được file PDF"
                    >
                        <Page pageNumber={1} width={300} />
                    </Document>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: preview }} />
                )}
            </div>

            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 font-medium truncate">
                    {icon}
                    {file.name}
                </div>
                <a href={file.url} download>
                    <DownloadOutlined className="text-lg cursor-pointer hover:text-blue-500" />
                </a>
            </div>
        </div>
    );
};
