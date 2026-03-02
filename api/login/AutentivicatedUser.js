import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

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

export default router;