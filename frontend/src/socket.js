import { io } from "socket.io-client";

// In production, uses VITE_SOCKET_URL (Render backend URL). In local dev, defaults to localhost:5000.
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const createSocketConnection = () => {
  return io(SOCKET_URL, {
    withCredentials: true,
  });
};
