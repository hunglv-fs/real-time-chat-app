const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

// Cấu hình upload avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Hàm tạo JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "secret_key", { expiresIn: "30d" });
};

// Đăng ký user
router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, avatar: avatarUrl });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công", token: generateToken(newUser._id) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Đăng nhập user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ token: generateToken(user._id), user });
    } else {
      res.status(401).json({ message: "Thông tin đăng nhập không hợp lệ" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
module.exports = router; // ✅ Dùng module.exports trong CommonJS

