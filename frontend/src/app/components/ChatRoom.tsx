import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { conversationId } = useParams();

  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
      console.log(`✅ Đã tham gia cuộc trò chuyện: ${conversationId}`);
    }

    return () => {
      socket.emit("leave_conversation", conversationId);
      console.log(`🚪 Rời khỏi cuộc trò chuyện: ${conversationId}`);
    };
  }, [conversationId]);

  return <h2>Cuộc trò chuyện: {conversationId}</h2>;
};

export default ChatRoom;
