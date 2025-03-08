const express = require("express");
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// Gửi tin nhắn
router.post("/send", protect, async (req, res) => {
  try {
    const { text } = req.body;
    const message = new Message({ user: req.user._id, text });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Lấy danh sách tin nhắn
router.get("/", protect, async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "username avatar");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
