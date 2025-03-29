const Product = require("../model/Product");

// Lấy 4 sản phẩm có giá cao nhất
exports.getTopProducts = async (req, res) => {
    try {
        const topProducts = await Product.find().sort({ price: -1 }).limit(4);
        res.status(200).json(topProducts);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
