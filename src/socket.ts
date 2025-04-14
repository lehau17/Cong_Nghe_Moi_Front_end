import { io } from "socket.io-client";

const URL = "https://be.haudev.io.vn"
export const socket = io(URL, {
    autoConnect: false,
});
