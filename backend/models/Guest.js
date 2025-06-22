import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  numberOfGuests: Number,
  phone: String,
  city: String,
  state: String,
  price: Number,
  aadharImage: String,
  checkIn: { type: Date },     
  checkOut: { type: Date },    
  roomNumber: String,
}, { timestamps: true });

export default mongoose.model('Guest', guestSchema);
