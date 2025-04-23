


export type MessageResponse = {
    role: string
    messages: MesageType[]
}


export type MesageType = {
    _id: string;
    conversationId: string;
    sender: {
        _id: string,
        fullName: string
        avatar: string
    };
    type: string;
    content: string;
    isRead: boolean;
    readAt: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
