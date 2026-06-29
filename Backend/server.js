import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);


// Debug
console.log("=== Environment Debug ===");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("=========================");

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI is missing in .env file");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected with Database!");
    } catch (err) {
        console.error("❌ Failed to connect with Db:", err.message);
    }
};