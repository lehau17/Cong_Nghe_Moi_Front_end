import { io } from "socket.io-client";

const URL = "https://be.haudev.io.vn"
// const URL = "http://localhost:5000"
export const socket = io(URL, {
    autoConnect: false,
});
