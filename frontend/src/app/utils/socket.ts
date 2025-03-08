import { io } from "socket.io-client";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket = io("http://localhost:5000", {
  auth: { token }, // Gửi token khi kết nối
});

export default socket;