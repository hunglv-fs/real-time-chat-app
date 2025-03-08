const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false }, // Xác định nhóm hay không
    name: { type: String, required: function () { return this.isGroup; } }, // Tên nhóm (bắt buộc nếu là nhóm)
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách user trong cuộc trò chuyện
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Tin nhắn cuối cùng
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
