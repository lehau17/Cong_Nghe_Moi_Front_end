import { revokeEmojiApi, sendEmojiApi } from "@/apis/message.api";
import { Button, Dropdown, Menu } from "antd";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";

const emojis = ["👍", "❤️", "😂", "😢", "😡"];

const LikeButton = ({ msg, currentUserId }: { msg: any, currentUserId: string }) => {
    const handleEmojiClick = async (emoji: string) => {
        const reacted = msg.emoji?.[emoji]?.includes(currentUserId);

        try {
            const apiCall = reacted ? revokeEmojiApi : sendEmojiApi;
            await apiCall(msg._id, emoji);
            toast.success(reacted ? "🗑️ Đã gỡ cảm xúc" : `✨ Đã thả ${emoji}`);
        } catch {
            toast.error("❌ Thao tác thất bại");
        }
    };

    // Menu của Emoji
    const emojiMenu = (
        <Menu>
            {emojis.map((emoji) => (
                <Menu.Item key={emoji} onClick={() => handleEmojiClick(emoji)}>
                    <span className="text-lg">{emoji}</span>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={emojiMenu} trigger={['click']} placement="top">
            <Button
                type="default"
                icon={<ThumbsUp size={16} />}
                className="flex items-center justify-center"
            />
        </Dropdown>
    );
};

export default LikeButton;
