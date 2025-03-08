"use client"
// import { useRouter } from "next/router";
import { useParams  } from 'next/navigation'
import { useEffect } from "react";
import { io } from "socket.io-client";
import Chat from "../../components/Chat";

const socket = io("http://localhost:5000"); // Đổi thành URL backend của bạn

const ChatRoom = () => {
  // const router = useRouter();
  const params   = useParams<{ id: string }>();
  console.log("@@@query:", params );
  const conversationId = params.id;

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

  return <div>
    <h2>Cuộc trò chuyện: {conversationId}</h2>
    <Chat conversationId={conversationId} />
    </div>;
};

export default ChatRoom;
