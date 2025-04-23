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
    fileMeta?: {
        name: string,
        size: string,
        mimeType: string,
        duration?: string
    } | {
        name: string
        size: number
        mimeType: string
        duration?: string | number | undefined
        url?: string | undefined
    }[],
    updatedAt: string;
};

export type MessageCreateBody = {
    type: MessageType;
    conversationId: string;
    content?: string;
    replyTo?: string
    fileMeta?: {
        name: string
        size: number
        mimeType: string
        duration?: string | number | undefined
        url?: string | undefined
    }[]
}


export type Conversation = {
    _id: string;
    type?: string
    name?: string
    avatar?: string
    participants: UserProfile[];
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
};
