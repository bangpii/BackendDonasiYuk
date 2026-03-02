import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import admin from "../../config/firebase.js";

const router = express.Router();

// 🔥 LOGIN ROUTE
router.post("/", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // 1️⃣ cek user ada
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                message: "User tidak ditemukan"
            });
        }

        // 2️⃣ cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Password salah"
            });
        }

        // 3️⃣ buat token
        const token = jwt.sign({
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// 🔥 GOOGLE LOGIN
router.post("/google", async (req, res) => {
    try {
        const {
            idToken
        } = req.body;

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const {
            email,
            name
        } = decodedToken;

        let user = await User.findOne({
            email
        });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: "google-login",
                role: "user",
            });
        }

        const token = jwt.sign({
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Google berhasil",
            token,
            user: {
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(401).json({
            message: "Google token tidak valid"
        });
    }
});


// Manual Registrasi Cuy
// 🔥 REGISTER MANUAL
router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email sudah digunakan"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        res.json({
            message: "Register berhasil"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

export default router;