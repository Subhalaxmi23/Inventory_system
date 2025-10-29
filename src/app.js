const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockRoutes = require("./routes/stockRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");


dotenv.config();
connectDB();

const app = express();
// Middleware
app.use(
  cors({
    origin: "*", // allows all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ✅ Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("IMS API running ✅");
});


module.exports = app;
