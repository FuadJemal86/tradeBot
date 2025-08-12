const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/admin", adminRouter);



const prisma = require("./prisma/prisma");

// Test database connection
prisma
    .$connect()
    .then(() => {
        console.log("✅ Connected to database via Prisma!");
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
    });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});