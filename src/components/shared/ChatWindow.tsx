import { sendMessage } from "@/apis/conversation.api";
import { getMessageByConversation, recallMessage } from "@/apis/message.api";
import { Button } from "@/components/ui/button";
import { useCallContext } from "@/context/CallContext";
import { useChatContext } from "@/context/ChatContext";
import { SocketContext } from "@/context/SocketContext";
import http from "@/lib/http";
import { useUploadAudioMessage, useUploadMultiFileMessage, useUploadMultiImageMessage } from "@/queries/upload.query";
import { agoraService } from "@/services/agoraService";
import {
    AudioOutlined,
    MoreOutlined, PaperClipOutlined, PictureOutlined, SendOutlined, ShareAltOutlined, SmileOutlined
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Dropdown, Menu, Tooltip } from "antd";
import EmojiPicker from "emoji-picker-react";
import { Reply } from "lucide-react";
import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { IoCallOutline, IoSearchOutline, IoVideocamOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useClickAway } from "react-use";
import ConversationInfoPanel from "./ConversationInfoPanel";
import { FilePreview } from "./FilePreview";
import ForwardModal from "./ForwardModal";
import ImageModal from "./ImageModal";
const pulseBars = Array.from({ length: 5 });


const MessageItem = forwardRef(({
    msg, isLast, isMine, setReplyTo, scrollToMessage, isShowAvatar,
    onForward, refetch
}: {
    msg: any;
    isLast: boolean;
    isMine: boolean;
    setReplyTo: (msg: any) => void;
    scrollToMessage: (id: string) => void;
    isShowAvatar: boolean;
    refetch: () => void,
    isSelected: boolean;
    onToggleSelected: () => void;
    onForward: (msg: any) => void;

}, ref: React.Ref<HTMLDivElement>) => {
    const [showMeta, setShowMeta] = useState(false);
    const isAudio = msg.type === "audio";
    const isImage = msg.type === "image";
    const [previewImage, setPreviewImage] = useState<string | null>(null);


    const recallMutation = useMutation({
        mutationFn: () => recallMessage(msg._id),
        onSuccess: () => {
            toast.success("🗑️ Thu hồi thành công")
            refetch
        },
        onError: () => toast.error("❌ Thu hồi thất bại"),
    });
    const moreMenu = (
        <Menu>
            <Menu.Item key="recall" onClick={() => recallMutation.mutate()}>
                🗑️ Thu hồi tin nhắn
            </Menu.Item>
        </Menu>
    );
    return (
        <div ref={ref} className={`group flex flex-col relative mb-1 ${isMine ? "items-end pr-3" : "items-start pl-3"}`}>
            <div className={`flex items-center ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {!isMine && isShowAvatar && (
                    <div className="mr-2">
                        <Avatar
                            src={msg.sender.avatar || undefined}
                            alt={msg.sender.fullName}
                            size={40}
                            className="mr-2 bg-blue-500 text-white font-semibold"
                        >
                            {!msg.sender.avatar && msg.sender.fullName ? msg.sender.fullName.split(" ").slice(0, 2).map((word: any) => word[0]).join("").toUpperCase() : null}
                        </Avatar>
                    </div>
                )}
                <div
                    onClick={() => setShowMeta(!showMeta)}
                    className={`px-4 py-2 rounded-sm break-words relative cursor-pointer ${isMine ? "bg-[#dbebff] text-black" : "bg-gray-200 text-black"}`}
                >
                    {msg.replyTo && (
                        <div
                            className="text-sm text-gray-500 italic mb-1 border-l-2 pl-2 border-blue-400 cursor-pointer"
                            onClick={() => scrollToMessage(msg.replyTo._id)}
                        >
                            Trả lời: {msg.replyTo.type === "text" ? msg.replyTo.content : msg.replyTo.type === "image" ? "[Hình ảnh]" : msg.replyTo.type === "audio" ? "[Âm thanh]" : msg.replyTo.type === "file" ? "file" : "Tin nhắn"}
                        </div>
                    )}
                    {msg.type === "file" && msg.fileMeta?.length ? (
                        <div className="space-y-2 w-80">
                            {msg.fileMeta.map((file: any, idx: number) => (
                                <div key={idx} className="relative">
                                    <FilePreview file={file} />

                                    {msg.isPending && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-sm">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        ""
                    )}

                    {isAudio ? (
                        <audio controls src={msg.content} className="rounded" />
                    ) : isImage ? (
                        <div className={`grid gap-2 ${msg.fileMeta?.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                            {msg.fileMeta?.map((file: any, idx: number) => (
                                <div key={idx} className="relative w-40 h-40">
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        onClick={() => setPreviewImage(file.url)}
                                        className={`w-full h-full object-cover rounded-sm transition ${msg.isPending ? "opacity-50 grayscale" : ""}`}
                                    />
                                    {msg.isPending && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-sm">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>


                    ) : (
                        msg.content
                    )}
                </div>
                <div className="hidden group-hover:flex items-center gap-1 mx-2">
                    <Tooltip title="Trả lời">
                        <div className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-200 cursor-pointer" onClick={() => setReplyTo(msg)}>
                            <Reply className="text-sm" />
                        </div>
                    </Tooltip>
                    <Tooltip title="Chia sẻ">
                        <div className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-200 cursor-pointer" onClick={() => onForward(msg)}>
                            <ShareAltOutlined className="text-sm" />
                        </div>
                    </Tooltip>
                    {isMine && <Dropdown overlay={moreMenu} trigger={['click']}>
                        <div className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                            <MoreOutlined className="text-sm" />
                        </div>
                    </Dropdown>}
                </div>
            </div>
            {(isLast || showMeta) && (
                <div className={`text-xs mt-1 text-gray-500 ${isMine ? "text-right" : "text-left"}`}>
                    {msg.error
                        ? "Gửi thất bại"
                        : msg.isPending
                            ? (
                                <span className="flex items-center gap-1">
                                    <span>Đang gửi...</span>
                                    <span className="w-2 h-2 animate-spin border-2 border-t-transparent border-gray-400 rounded-full" />
                                </span>
                            )
                            : msg.readAt
                                ? "Đã xem"
                                : msg.isRead
                                    ? "Đã nhận"
                                    : "Đã gửi"}
                </div>
            )}
            <ImageModal open={!!previewImage} onClose={() => setPreviewImage(null)} src={previewImage || ""} />
        </div>
    );
});





const ChatWindow = () => {
    const { activeUser, conversationId, messages, setMessages } = useChatContext();
    const [isComposing, setIsComposing] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [replyTo, setReplyTo] = useState<any>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
    const [forwardMessage, setForwardMessage] = useState<any>(null);
    const fileOtherInputRef = useRef<HTMLInputElement>(null);
    const [pendingMessage, setPendingMessage] = useState<any | null>(null);
    const [pendingImages, setPendingImages] = useState<any[]>([]);
    const [pendingFiles, setPendingFiles] = useState<any[]>([]);
    const uploadMultiFileMutation = useUploadMultiFileMessage(conversationId as string);
    const socket = useContext(SocketContext)
    const { setShowCallUI } = useCallContext();

    const handlePickOtherFiles = () => {
        fileOtherInputRef.current?.click();
    };



    // Trong render:

    const toggleSelectedMessage = (msg: any) => {
        setSelectedMessages(prev => {
            const exists = prev.find((m) => m._id === msg._id);
            if (exists) return prev.filter((m) => m._id !== msg._id);
            return [...prev, msg];
        });
    };


    const uploadAudioMessageMutation = useUploadAudioMessage(conversationId as string);
    const useUploadMulti = useUploadMultiImageMessage(conversationId as string)
    const handlePickImages = () => {
        fileInputRef.current?.click();
    };
    const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length || !conversationId) return;

        if (files.length > 20) {
            return toast.error("Chỉ được chọn tối đa 20 ảnh!");
        }

        const dataTemp = {
            _id: `img-${Date.now()}`,
            type: "image",
            sender: { _id: currentUserId },
            createdAt: new Date().toISOString(),
            isPending: true,
            fileMeta: [] as any
        }

        // ⛳️ 1. Tạo tin nhắn pending cho mỗi ảnh
        const pending = files.map((file) => ({

            name: file.name,
            size: file.size,
            mimeType: file.type,
            url: URL.createObjectURL(file)

        }));
        dataTemp.fileMeta = [...pending as any]

        setPendingImages((prev: any) => [...prev, dataTemp]);

        // ⛳️ 2. Gọi API upload ảnh như cũ
        useUploadMulti.mutate(files, {
            onSuccess: () => {
                // xoá pending khi thành công
                setPendingImages([]);
            },
            onError: () => {
                // gắn cờ lỗi cho ảnh
                setPendingImages(prev =>
                    prev.map(img => ({ ...img, error: true, isPending: false }))
                );
            }
        });
    };

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);

    useClickAway(emojiRef, () => setShowEmojiPicker(false));

    const scrollToMessage = (messageId: string) => {
        const el = messageRefs.current[messageId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("bg-yellow-100");
            setTimeout(() => {
                el.classList.remove("bg-yellow-100");
            }, 2000);
        }
    };

    const [input, setInput] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const endRef = useRef<HTMLDivElement | null>(null);
    const currentUserId = JSON.parse(localStorage.getItem("profile") as string)?._id;

    const handleEmojiClick = (emojiData: any) => {
        const emoji = emojiData.emoji;
        const cursorPos = inputRef.current?.selectionStart || 0;
        const newText = input.slice(0, cursorPos) + emoji + input.slice(cursorPos);
        setInput(newText);

        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
        }, 0);
    };

    const handleOtherFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length || !conversationId) return;

        const tempMsg = {
            _id: `file-${Date.now()}`,
            type: "file",
            sender: { _id: currentUserId },
            createdAt: new Date().toISOString(),
            isPending: true,
            fileMeta: files.map((file) => ({
                name: file.name,
                size: file.size,
                mimeType: file.type,
                url: URL.createObjectURL(file),
            }))
        };

        setPendingFiles((prev) => [...prev, tempMsg]);

        uploadMultiFileMutation.mutate(files, {
            onSuccess: () => {
                setPendingFiles([]);
            },
            onError: () => {
                setPendingFiles(prev => prev.map(file => ({ ...file, error: true, isPending: false })));
            }
        });
    };



    const {
        data: conversationDetail,
        isLoading,
        isSuccess,
        refetch
    } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => getMessageByConversation(conversationId as string),
        enabled: !!conversationId,
    });

    useEffect(() => {
        if (isSuccess && conversationDetail?.data?.data) {
            setMessages(conversationDetail.data.data);
        }
    }, [conversationId, conversationDetail]);



    const sendMessageMutation = useMutation({
        mutationFn: ({ content, msg }: { content: string, msg: any }) => {
            setPendingMessage(msg); // 👈 set vào
            return sendMessage({
                conversationId: conversationId as string,
                content,
                type: "text",
                replyTo: replyTo?._id,
            })
        },

        onSuccess: () => {
            setInput("");
            setReplyTo(null);
            setPendingMessage(null); // 👈 clear khi xong
        },
        onError: () => {
            if (pendingMessage) {
                setPendingMessage({ ...pendingMessage, error: true });
            }
        },
    });
    const handleStartCall = async () => {
        if (!conversationId || !currentUserId || !activeUser) return;

        try {
            const tokenRes = await http.get(`/agora/token?channel=${conversationId}&uid=${currentUserId}`);
            const { token } = tokenRes.data;
            const { videoTrack } = await agoraService.joinChannel(conversationId, token, currentUserId);
            socket.emit("call-user", {
                to: activeUser._id,
                from: currentUserId,
                conversationId,
                token,
            });

            setShowCallUI(true);
            videoTrack.play("video-container");
        } catch (err) {
            toast.error("Không thể bắt đầu cuộc gọi");
            console.error("Call error", err);
        }
    };



    const handleSend = () => {
        if (!input.trim() || !conversationId) return;
        sendMessageMutation.mutate({
            content: input.trim(), msg: {
                _id: `temp-${Date.now()}`,
                content: input.trim(),
                type: "text",
                sender: { _id: currentUserId },
                createdAt: new Date().toISOString(),
                isPending: true,
            }
        });
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const file = new File([blob], "voice-message.webm", { type: "audio/webm" });
            uploadAudioMessageMutation.mutate(file);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setRecording(false);
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, pendingMessage, pendingImages, pendingFiles]);


    const allMessages = [...messages];
    if (pendingMessage) allMessages.push(pendingMessage);
    if (pendingImages.length) allMessages.push(...pendingImages);
    if (pendingFiles.length) allMessages.push(...pendingFiles); // 👈 thêm dòng này

    if (!activeUser) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                👉 Chọn 1 cuộc trò chuyện để bắt đầu!
            </div>
        );
    }



    return (
        <div className="flex flex-col h-screen bg-[#f0f2f5]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full   border-1 border-black bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-base">
                        {activeUser.avatar && activeUser.avatar !== "" ? (
                            <img src={activeUser.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            activeUser.fullName
                                ?.split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                        )}
                    </div>


                    <div className="ml-3">
                        <div className="font-semibold text-[16px]">{activeUser.fullName}</div>
                        <div className="text-sm text-gray-500 text-start">Đang hoạt động</div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-xl text-gray-600">
                    <IoCallOutline className="cursor-pointer" onClick={handleStartCall} />

                    <IoVideocamOutline className="cursor-pointer" />
                    <IoSearchOutline className="cursor-pointer" />
                    <MoreOutlined className="cursor-pointer" onClick={() => setShowInfo(!showInfo)} />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto space-y-2" onClick={() => showInfo && setShowInfo(false)}>
                {isLoading ? (
                    <div className="text-gray-500 italic">Đang tải tin nhắn...</div>
                ) : (

                    allMessages.map((msg: any, index: number) => {
                        const isMine = msg.sender._id === currentUserId;
                        const isLast = index === allMessages.length - 1;
                        const prevMsg = messages[index - 1];
                        const isShowAvatar =
                            !isMine &&
                            (!prevMsg || prevMsg.sender._id !== msg.sender._id); // avatar nếu khác sender trước đó

                        return (
                            <div key={msg._id} className="relative group">

                                <MessageItem
                                    ref={(el) => { messageRefs.current[msg._id] = el; }} // ✅ Không return gì cả
                                    // 👈 Gắn đúng ref ở đây
                                    key={msg._id}
                                    msg={msg}
                                    isLast={isLast}
                                    isMine={isMine}
                                    setReplyTo={setReplyTo}
                                    scrollToMessage={scrollToMessage}
                                    isShowAvatar={isShowAvatar}
                                    refetch={refetch}
                                    onForward={(msg) => setForwardMessage(msg)}
                                    isSelected={!!selectedMessages.find(m => m._id === msg._id)}
                                    onToggleSelected={() => toggleSelectedMessage(msg)}
                                />

                            </div>


                        )
                    })
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            {replyTo && (
                <div className="px-3 py-2 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-600 max-w-[80%] truncate">
                        <span className="font-semibold mr-1">Trả lời:</span>
                        {replyTo.type === "text" ? replyTo.content
                            : replyTo.type === "image" ? "[Hình ảnh]"
                                : replyTo.type === "audio" ? "[Âm thanh]"
                                    : "[Tin nhắn]"}
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-red-500 text-lg">×</button>
                </div>
            )}
            <div className="border-t bg-white px-3 py-2">
                <div className="flex items-center gap-2 relative">
                    <div className="relative" ref={emojiRef}>
                        <SmileOutlined
                            className="text-xl cursor-pointer"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 z-50">
                                <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
                            </div>
                        )}
                    </div>
                    <PaperClipOutlined className="text-xl cursor-pointer" onClick={handlePickOtherFiles} />
                    <input
                        type="file"
                        multiple
                        accept="audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/*,application/zip,application/json"

                        hidden
                        ref={fileOtherInputRef}
                        onChange={handleOtherFilesSelected}
                    />

                    <PictureOutlined className="text-xl cursor-pointer" onClick={handlePickImages} />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={handleImagesSelected}
                    />

                    <div className="relative flex items-center">
                        <AudioOutlined
                            className={`text-xl cursor-pointer ${recording ? "text-red-500" : ""}`}
                            onClick={recording ? stopRecording : startRecording}
                        />
                        {recording && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-[4px]">
                                {pulseBars.map((_, i) => {
                                    const randomDelay = Math.random() * 0.3;
                                    const randomDuration = 0.8 + Math.random() * 0.6; // từ 0.8s → 1.4s
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                width: 5,
                                                height: 12,
                                                backgroundColor: "#22c55e",
                                                borderRadius: 2,
                                                animation: `waveAnim ${randomDuration}s ease-in-out infinite`,
                                                animationDelay: `${randomDelay}s`,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}

                    </div>

                    <div className="flex-1">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onCompositionStart={() => setIsComposing(true)}
                            onCompositionEnd={() => setIsComposing(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isComposing) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={`Nhập @, tin nhắn tới ${activeUser.fullName}`}
                            className="w-full bg-gray-100 p-2 rounded-xl border border-gray-300 outline-none"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleSend}>
                        <SendOutlined />
                    </Button>
                </div>
            </div>
            {forwardMessage && (
                <ForwardModal
                    open={!!forwardMessage}
                    messageToForward={forwardMessage} // chỉ 1 tin nhắn được chọn
                    onClose={() => setForwardMessage(null)}
                />
            )}



            {showInfo && <ConversationInfoPanel onClose={() => setShowInfo(false)} />}
        </div>
    );
};

export default ChatWindow;
