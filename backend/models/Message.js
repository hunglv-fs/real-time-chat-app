const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true }, // Thuộc về cuộc trò chuyện nào
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người gửi
    text: { type: String, required: true }, // Nội dung tin nhắn
    attachments: [{ type: String }], // Danh sách file đính kèm (nếu có)
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
