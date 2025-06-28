import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  price: { type: Number, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  roomNumber: { type: String }, // ✅ optional field for room no.
  aadharImage: {
    type: String, // ✅ this will store the Cloudinary image URL
    required: true,
  },
}, {
  timestamps: true,
});

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
