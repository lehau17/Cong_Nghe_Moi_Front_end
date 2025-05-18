import { revokeEmojiApi, sendEmojiApi } from "@/apis/message.api";
import { toast } from "react-toastify";

const emojis = ["👍", "❤️", "😂", "😢", "😡"];

const EmojiDropdown = ({ msg, currentUserId }: { msg: any, currentUserId: string }) => {

    const handleEmojiClick = async (emoji: string) => {
        const reacted = msg.emoji?.[emoji]?.includes(currentUserId);

        try {
            const apiCall = reacted ? revokeEmojiApi : sendEmojiApi;
            await apiCall(msg._id, emoji);

            if (reacted) {
                toast.success(`Bạn đã gỡ ${emoji}`);
            } else {
                toast.success(`Bạn đã thả ${emoji}`);
            }
        } catch {
            toast.error("❌ Thao tác thất bại");
        }
    };

    return (
        <div className="absolute left-0 top-6 hidden group-hover:flex gap-1 p-1 bg-white rounded-lg shadow-md">
            {emojis.map((emoji) => (
                <span
                    key={emoji}
                    className="text-xs cursor-pointer hover:scale-110 transition-all p-1"
                    onClick={() => handleEmojiClick(emoji)}
                >
                    {emoji}
                </span>
            ))}
        </div>
    );
};

export default EmojiDropdown;
