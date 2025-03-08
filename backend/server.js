const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

// Kết nối MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

io.on("connection", (socket) => {
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} đã tham gia cuộc trò chuyện ${conversationId}`);
    });

    console.log("User connected:", socket.id);
  
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, sender, text, attachments } = data;
        console.log("Tin nhắn nhận được:", data);
  
        // Kiểm tra xem cuộc trò chuyện có tồn tại không
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit("error", { message: "Cuộc trò chuyện không tồn tại." });
        }
  
        // Tạo tin nhắn mới
        const message = new Message({
          conversation: conversationId,
          sender,
          text,
          attachments: attachments || [],
        });
  
        // Lưu tin nhắn vào MongoDB
        await message.save();
  
        // Cập nhật lastMessage trong Conversation
        conversation.lastMessage = message._id;
        await conversation.save();
  
        // Gửi tin nhắn cho tất cả người trong cuộc trò chuyện
        io.to(conversationId).emit("receive_message", {
          _id: message._id,
          conversation: conversationId,
          sender,
          text,
          attachments: attachments || [],
          createdAt: message.createdAt,
        });
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        socket.emit("error", { message: "Có lỗi xảy ra khi gửi tin nhắn." });
      }
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
  

io.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} đã tham gia cuộc trò chuyện ${conversationId}`);
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
