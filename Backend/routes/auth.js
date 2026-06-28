import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";


const router = express.Router();

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false, // set true only when you deploy with https
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const signToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email and password are all required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });

        const token = signToken(user._id);
        res.cookie("token", token, COOKIE_OPTIONS);
        res.status(201).json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = signToken(user._id);
        res.cookie("token", token, COOKIE_OPTIONS);
        res.json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to log in" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({ success: true });
});
router.get("/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        res.json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch current user" });
    }
});

export default router;