// src/services/agoraService.ts
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";

const appId = "51038d71efc141db91ecaf95382b4493"; // 🔒 lấy từ dashboard
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let micTrack: ILocalAudioTrack | null = null;
let camTrack: ILocalVideoTrack | null = null;


export const agoraService = {
    async joinChannel(channel: string, token: string | null, uid: string | number) {
        console.log(token)
        await client.join(appId, channel, null, uid);

        micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        camTrack = await AgoraRTC.createCameraVideoTrack();

        await client.publish([micTrack, camTrack]);

        return { audioTrack: micTrack, videoTrack: camTrack };
    },

    async leaveChannel() {
        if (micTrack) {
            micTrack.stop();
            micTrack.close();
            micTrack = null;
        }

        if (camTrack) {
            camTrack.stop();
            camTrack.close();
            camTrack = null;
        }

        client.remoteUsers.forEach(user => {
            client.unsubscribe(user);
        });

        await client.leave();
    },

    async toggleMic(enable: boolean) {
        if (micTrack) await micTrack.setEnabled(enable);
    },

    async toggleCam(enable: boolean) {
        if (camTrack) await camTrack.setEnabled(enable);
    },

    client,
};
