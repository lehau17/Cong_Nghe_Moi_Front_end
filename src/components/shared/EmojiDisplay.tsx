import { UserProfile } from "@/types/user.type";
import { Tooltip } from "antd";

const EmojiDisplay = ({ msg, userList }: { msg: any, userList: UserProfile[] }) => {
    const getUserNames = (userIds: any[]) => {
        return userList
            .filter((user) => userIds.includes(user._id))
            .map((user) => user.fullName)
            .join(", ");
    };

    return (
        <div className="flex items-center gap-1">
            {Object.entries(msg.emoji || {}).map(([emoji, users]) => (
                (users as any).length > 0 && (
                    <Tooltip title={getUserNames(users as any[])} key={emoji}>
                        <div
                            className="flex items-center gap-0.5 bg-gray-100 px-1 py-0.5 rounded-full cursor-pointer hover:bg-gray-200"
                        >
                            <span className="text-xs">{emoji}</span>
                            <span className="text-xs text-gray-500">{(users as any).length}</span>
                        </div>
                    </Tooltip>
                )
            ))}
        </div>
    );
};

export default EmojiDisplay;
