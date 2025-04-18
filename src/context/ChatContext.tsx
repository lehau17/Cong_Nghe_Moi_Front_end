// context/ChatContext.tsx
import { Conversation } from "@/types/conversation";
import { UserProfile } from "@/types/user.type";
import { createContext, useContext, useState } from "react";

interface ChatContextType {
    activeUser: UserProfile | null;
    setActiveUser: (user: UserProfile | null) => void;
    conversationId: string | null;
    setConversationId: (id: string | null) => void;
    setMessages: (messages: any[]) => void;
    messages: any[];
    appendMessage: (msg: any) => void;
    conversationList: Conversation[];
    setConversationList: (list: Conversation[]) => void;
    updateConversationList: (updatedConv: Conversation) => void
    updateChatList: (chat: any) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [conversationList, setConversationList] = useState<Conversation[]>([]);

    const appendMessage = (msg: any) => setMessages(prev => [...prev, msg]);
    const updateConversationList = (updatedConv: Conversation) => {
        setConversationList(prev => {
            const index = prev.findIndex(conv => conv._id === updatedConv._id);
            if (index !== -1) {
                const newList = [...prev];
                newList.splice(index, 1);
                return [updatedConv, ...newList];
            } else {
                return [updatedConv, ...prev];
            }
        });
    };

    const updateChatList = (chat: any) => {
        setMessages(prev => {
            const index = prev.findIndex(chatPrev => chatPrev._id === chat._id);
            if (index !== -1) {
                const newChatList = [...prev]
                newChatList[index] = chat
                return newChatList
            }
            return [...prev]
        })
    }
    return (
        <ChatContext.Provider
            value={{
                activeUser,
                setActiveUser,
                conversationId,
                setConversationId,
                messages,
                setMessages,
                appendMessage,
                conversationList,
                setConversationList,
                updateConversationList,
                updateChatList
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChatContext must be used within ChatProvider");
    return context;
};
