// src/services/agoraService.ts
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ILocalAudioTrack,
    ILocalVideoTrack,
    IRemoteAudioTrack,
    IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";

const appId = "51038d71efc141db91ecaf95382b4493"; // 👉 Replace with ENV for production

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let micTrack: ILocalAudioTrack | null = null;
let camTrack: ILocalVideoTrack | null = null;

export let localVideoTrack: ILocalVideoTrack | null = null;

// Handle remote user published
client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
        const containerId = `remote-video-${user.uid}`;
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement("div");
            container.id = containerId;
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.position = "absolute";
            container.style.top = "0";
            container.style.left = "0";
            container.style.zIndex = "10";
            const target = document.getElementById("remote-video-container") || document.body;
            target.appendChild(container);
        }
        (user.videoTrack as IRemoteVideoTrack)?.play(container);
    }

    if (mediaType === "audio") {
        (user.audioTrack as IRemoteAudioTrack)?.play();
    }
});

// Handle remote user unpublish
client.on("user-unpublished", (user) => {
    const container = document.getElementById(`remote-video-${user.uid}`);
    if (container) container.remove();
});

export const agoraService = {
    async joinChannel(channel: string, _: string | null, uid: string | number) {
        await client.join(appId, channel, null, uid);

        micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        camTrack = await AgoraRTC.createCameraVideoTrack();
        localVideoTrack = camTrack;

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

        client.remoteUsers.forEach((user) => {
            client.unsubscribe(user);
            const container = document.getElementById(`remote-video-${user.uid}`);
            if (container) container.remove();
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
