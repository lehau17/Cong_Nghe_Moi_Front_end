import { io } from "socket.io-client";
import config from "./constants/config";

const URL = config.baseUrl || "localhost:5000"
export const socket = io(URL, {
    autoConnect: false,
});
