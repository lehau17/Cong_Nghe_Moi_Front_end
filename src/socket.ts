import { io } from "socket.io-client";

const URL = "https://be.haudev.io.vn:5000"
export const socket = io(URL, {
    autoConnect: false,
});
