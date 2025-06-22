import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { hotelName, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ hotelName, email, password: hashed });
  await user.save();
  res.json({ message: "Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;
