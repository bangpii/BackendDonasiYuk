import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/service.js";

// 🔥 TAMBAHAN
import loginRoute from "./login/AutentivicatedUser.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 REGISTER ROUTE LOGIN
app.use("/login", loginRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Donasi Backend Running 🚀"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    });
});

export default app;