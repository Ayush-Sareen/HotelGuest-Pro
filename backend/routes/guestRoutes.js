// routes/guestRoutes.js
import express from "express";
import multer from "multer";
import Guest from "../models/Guest.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { storage } from "../utils/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// Add guest
router.post("/", authMiddleware, upload.single("aadharImage"), async (req, res) => {
  try {
    const guest = new Guest({
      userId: req.user._id,
      ...req.body,
      checkIn: req.body.checkIn ? new Date(req.body.checkIn) : null,
      checkOut: req.body.checkOut ? new Date(req.body.checkOut) : null,
      aadharImage: req.file?.secure_url || req.file?.path || '', // ✅ Fixed
    });
    await guest.save();
    res.json({ message: "Guest added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding guest" });
  }
});

// Get all guests
router.get("/", authMiddleware, async (req, res) => {
  const guests = await Guest.find({ userId: req.user._id });
  res.json(guests);
});

// Filter guests
router.get("/filter", authMiddleware, async (req, res) => {
  const { name, city, date, month } = req.query;
  let query = { userId: req.user._id };

  if (name) query.name = new RegExp(name, "i");
  if (city) query.city = new RegExp(city, "i");

  if (date) {
    const target = new Date(date);
    const nextDay = new Date(target);
    nextDay.setDate(target.getDate() + 1);
    query.checkIn = { $gte: target, $lt: nextDay };
  }

  if (month) {
    const [year, m] = month.split("-");
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    query.checkIn = { $gte: start, $lte: end };
  }

  const filtered = await Guest.find(query);
  res.json(filtered);
});

// Delete guest
router.delete("/:id", authMiddleware, async (req, res) => {
  const result = await Guest.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json(result);
});

// Update guest
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      checkIn: req.body.checkIn ? new Date(req.body.checkIn) : undefined,
      checkOut: req.body.checkOut ? new Date(req.body.checkOut) : undefined,
    };
    const update = await Guest.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating guest" });
  }
});

// Get current user's hotel name
router.get("/user/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ hotelName: user.hotelName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching hotel name" });
  }
});

export default router;
