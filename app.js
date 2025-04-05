require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const homeRoutes = require("./routes/homRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contactRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const payosRoutes = require("./routes/payosRoutes");
const path = require("path");
const app = express();
const PORT = process.env.PORT;

// Kết nối MongoDB
connectDB();

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// Phục vụ file tĩnh từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cấu hình CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


// Routes
app.use("/api/products", productRoutes);
app.use("/api/home", homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", orderRoutes);
app.use("/api/payos", payosRoutes);

// Start server
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));