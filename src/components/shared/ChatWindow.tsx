import { sendMessage } from "@/apis/conversation.api";
import { getMessageByConversation } from "@/apis/message.api";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";
import { useUploadAudioMessage, useUploadMultiImageMessage } from "@/queries/upload.query";
import { AudioOutlined, MoreOutlined, PaperClipOutlined, PictureOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import 'react-h5-audio-player/lib/styles.css';
import { IoCallOutline, IoSearchOutline, IoVideocamOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useClickAway } from "react-use";
import ConversationInfoPanel from "./ConversationInfoPanel";
const pulseBars = Array.from({ length: 5 });



const MessageItem = ({ msg, isLast, isMine }: { msg: any, isLast: boolean, isMine: boolean }) => {
    const [showMeta, setShowMeta] = useState(false);
    const isAudio = msg.type === "audio";
    const isImage = msg.type === "image";

    return (
        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} relative mb-4`}>
            <div
                onClick={() => setShowMeta(!showMeta)}
                className={`px-4 py-2 rounded-xl max-w-[70%] break-words relative cursor-pointer
                    ${isMine ? "bg-[#dbebff] text-black self-end" : "bg-gray-200 text-black self-start"}`}
            >
                {isAudio ? (
                    <audio
                        controls
                        src={msg.content}
                        style={{
                            background: 'transparent',
                            borderRadius: 10,
                            outline: 'none',
                        }}
                    />
                ) : isImage ? (
                    <div className="grid grid-cols-2 gap-2">
                        {msg.fileMeta?.map((file: any, idx: number) => (
                            <img
                                key={idx}
                                src={file.url}
                                alt={file.name}
                                className="w-40 h-40 object-cover rounded-md hover:brightness-90 transition"
                            />
                        ))}
                    </div>
                ) : (
                    msg.content
                )}
            </div>

            {(isLast || showMeta) && (
                <div className={`text-xs mt-1 text-gray-500 ${isMine ? "text-right" : "text-left"}`}>
                    {msg.readAt ? "Đã xem" : msg.isRead ? "Đã nhận" : "Đã gửi"}
                </div>
            )}
        </div>
    );
};



const ChatWindow = () => {
    const { activeUser, conversationId, messages, setMessages } = useChatContext();
    const [isComposing, setIsComposing] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);



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

        useUploadMulti.mutate(files);
    };
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);

    useClickAway(emojiRef, () => setShowEmojiPicker(false));

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

    const {
        data: conversationDetail,
        isLoading,
        isSuccess
    } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => getMessageByConversation(conversationId as string),
        enabled: !!conversationId,
    });

    useEffect(() => {
        if (isSuccess) {
            setMessages(conversationDetail.data.data);
        }
    }, [isSuccess]);

    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => sendMessage({ conversationId: conversationId as string, content, type: "text" }),
        onSuccess: () => setInput("")
    });

    const handleSend = () => {
        if (!input.trim() || !conversationId) return;
        sendMessageMutation.mutate(input.trim());
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
    }, [messages]);

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
                    <Avatar size="large" src={activeUser.avatar} />
                    <div className="ml-3">
                        <div className="font-semibold text-[16px]">{activeUser.fullName}</div>
                        <div className="text-sm text-gray-500 text-start">Đang hoạt động</div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-xl text-gray-600">
                    <IoCallOutline className="cursor-pointer" />
                    <IoVideocamOutline className="cursor-pointer" />
                    <IoSearchOutline className="cursor-pointer" />
                    <MoreOutlined className="cursor-pointer" onClick={() => setShowInfo(!showInfo)} />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-4 space-y-2" onClick={() => showInfo && setShowInfo(false)}>
                {isLoading ? (
                    <div className="text-gray-500 italic">Đang tải tin nhắn...</div>
                ) : (
                    messages.map((msg: any, index: number) => {
                        const isMine = msg.sender._id === currentUserId;
                        const isLast = index === messages.length - 1;
                        return (
                            <MessageItem key={index} msg={msg} isLast={isLast} isMine={isMine} />
                        );
                    })
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
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
                    <PaperClipOutlined className="text-xl cursor-pointer" />
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

            {showInfo && <ConversationInfoPanel onClose={() => setShowInfo(false)} />}
        </div>
    );
};

export default ChatWindow;
