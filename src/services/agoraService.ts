// src/services/agoraService.ts
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

const appId = "3894b68cb3094d6baa13e88cc3bda5f7"; // 🔒 lấy từ dashboard
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const agoraService = {
    async joinChannel(channel: string, token: string, uid: string | number) {
        await client.join(appId, channel, token, uid);
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const camTrack = await AgoraRTC.createCameraVideoTrack();

        await client.publish([micTrack, camTrack]);
        // await client.publish([audioTrack, videoTrack]);
        return { audioTrack: micTrack, videoTrack: camTrack };
    },

    async leaveChannel() {
        client.remoteUsers.forEach(user => {
            client.unsubscribe(user);
        });
        await client.leave();
    },

    client,
};
