// src/apis/conversation-group.api.ts
import http from "@/lib/http";

export const createGroup = (data: { name: string; avatar: string | undefined | null; members: string[] }) => {
    return http.post("/conversationGroup", data);
};


export const getFriendsNotInGroup = async (groupId: string, keyword = "") => {
    const res = await http.get(`/conversationGroup/${groupId}/friends-not-in-group`, {
        params: { keyword }
    });
    return res
};



export const addMembersToGroup = (groupId: string, userIds: string[]) => {
    return http.post(`/conversationGroup/${groupId}/add-members`, { userIds });
};


export const removeMemberFromGroup = (groupId: string, userId: string) => {
    return http.post(`/conversationGroup/${groupId}/remove-member`, { userId });
};



export const updateGroupInfo = (groupId: string, body: { avatar?: string, name?: string }) => {
    return http.put(`/conversationGroup/${groupId}/update-info`, body);
};



export const disbandGroup = (groupId: string) => {
    return http.delete(`/conversationGroup/${groupId}`);
};


export const updateGroupMemberRole = async (
    groupId: string,
    userId: string,
    newRole: "member" | "admin"
) => {
    return await http.post(`/conversationGroup/${groupId}/change-role`, {
        userId,
        newRole,
    });
};



export const leaveGroup = async (groupId: string) => {
    return await http.post(`/conversationGroup/${groupId}/leave`);
};


export const updateRequireApproval = async (groupId: string) => {
    return await http.post(`/conversationGroup/${groupId}/toggle-require-approval`);
};





export const getInvitesByGroup = async (groupId: string) => {
    return await http.get(`/pendingGroupInvite/${groupId}/`);
};



export const acceptInvite = async (inviteId: string) => {
    return await http.post(`/pendingGroupInvite/${inviteId}/accept`);
};

export const rejectInvite = async (inviteId: string) => {

    return await http.post(`/pendingGroupInvite/${inviteId}/reject`);
};
