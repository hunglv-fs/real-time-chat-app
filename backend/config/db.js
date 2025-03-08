const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/chat_app");
    console.log("✅ Đã kết nối MongoDB");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB; // ✅ Dùng module.exports trong CommonJS

