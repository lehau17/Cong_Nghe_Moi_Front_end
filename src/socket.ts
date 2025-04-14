import { io } from "socket.io-client";
import config from "./constants/config";

const URL = "https://be.haudev.io.vn:5000"
export const socket = io(URL, {
    autoConnect: false,
});
