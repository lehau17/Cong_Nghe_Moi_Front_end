import { UserProfile } from "./user.type";

export type UserProfileConversation = {
    _id: string;
    fullName: string;
    avatar: string;
    phoneNumber?: string;
    label: string

};

export type MessageType = "text" | "emoji" | "image" | "video" | "file" | "audio";

export type Message = {
    _id: string;
    conversationId: string;
    sender: UserProfileConversation;
    type: MessageType;
    content: string;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type Conversation = {
    _id: string;
    participants: UserProfile[];
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
};
