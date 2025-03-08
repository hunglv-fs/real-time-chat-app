"use client"
import { useState, useEffect } from "react";
import socket from "../utils/socket";

interface Message {
  sender: string;
  text: string;
  attachments: string;
  conversationId: string;
}

interface ChatProps {
  conversationId: string;
}

const Chat: React.FC<ChatProps> = ({ conversationId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("Guest");
  

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // Chạy chỉ một lần sau khi mount

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      console.log('@@@receive_message', data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const data = { sender: username, text: message, attachments: null, conversationId: conversationId}
      socket.emit("send_message", data);
      console.log('@@@socket', socket);
      setMessages((prev) => [...prev, data]);
      setMessage("");
    }
  };

  return (
    <div>
      <h3>Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong> {msg.text}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." />
      <button onClick={sendMessage}>Gửi</button>
    </div>
  );
};

export default Chat;
