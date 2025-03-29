const express = require("express");
const { getTopProducts } = require("../controller/homeController");


const router = express.Router();

// Route: Lấy 4 sản phẩm giá cao nhất
router.get("/top", getTopProducts);

module.exports = router;
