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
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/users", userRoutes);
app.use('/api/excel', excelRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch((err) => console.log(err));