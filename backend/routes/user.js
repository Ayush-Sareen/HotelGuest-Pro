import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Get the current logged-in user info (hotelName, email)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("hotelName email");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

export default router;
