const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
// const path = require("path");
const tradeRout = require('./routes/tradRout');
const prisma = require("./prisma");

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
// app.use(cookieParser());
app.use(express.json());


app.use('/trade', tradeRout)




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