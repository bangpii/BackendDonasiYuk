import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("123456", 10);

await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "admin"
});

console.log("Admin created");
process.exit();