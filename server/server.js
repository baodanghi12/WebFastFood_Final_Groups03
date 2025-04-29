import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS setup
app.use(cors({
  origin: "http://localhost:3000", // front-end domain
  credentials: true,               // allow cookies to be sent
}));

// Middlewares
app.use(express.json({ limit: "10mb" })); // body parser
app.use(cookieParser());

// Public folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/foods", foodRoutes);

// Server start
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
