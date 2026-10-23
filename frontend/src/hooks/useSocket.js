import { useEffect, useRef } from "react";
import { createSocketConnection } from "../socket";

// Socket.io connection hook
const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Socket.io server se connect karo
    socketRef.current = createSocketConnection();

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};

export default useSocket;

