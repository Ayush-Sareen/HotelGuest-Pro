// ✅ Updated Mongoose Model (models/Guest.js)
import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sno: Number,
  arrivalDate: String,
  arrivalTime: String,
  roomNumber: String,
  name: String,
  fatherName: String,
  age: Number,
  accompanyingNames: String,
  accompanyingRelations: String,
  nationality: String,
  purposeOfVisit: String,
  occupation: String,
  comingFrom: String,
  goingTo: String,
  fullAddress: String,
  numberOfPersons: {
    male: Number,
    female: Number,
    boys: Number,
    girls: Number,
  },
  departureDate: String,
  departureTime: String,
  aadharImages: [String], // multiple image URLs
  phone: String,
  vehicleNumber: String,
}, { timestamps: true });

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;


