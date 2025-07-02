import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import userRoutes from "./routes/user.js"; 
import excelRoute from './routes/excel.js';


dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors({ origin: "https://hotelguest-pro.netlify.app" }));
app.use(express.json());
// app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/users", userRoutes);
app.use('/api/excel', excelRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.log(err));
