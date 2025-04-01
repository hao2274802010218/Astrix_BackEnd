const mongoose = require("mongoose"); // Đảm bảo đã import mongoose
const Cart = require("../model/cart");

// Lấy giỏ hàng của một user
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(200).json({ total: 0, cart: { items: [] } });
        }

        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.json({ total, cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, pic, name, size, price, quantity } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, pic, name, size, price, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng." });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID không hợp lệ!" });
        }

        // Tìm giỏ hàng của user
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });

        // Lọc bỏ sản phẩm có productId trùng với ID cần xóa
        const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);

        // Kiểm tra nếu không có sản phẩm nào trong giỏ hàng -> Xóa luôn giỏ hàng
        if (updatedItems.length === 0) {
            await Cart.findOneAndDelete({ userId });
            return res.json({ message: "Giỏ hàng đã bị xóa!" });
        }

        // Cập nhật giỏ hàng
        cart.items = updatedItems;
        await cart.save();
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.json({ message: "Xóa sản phẩm thành công!", total, cart });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const deletedCart = await Cart.findOneAndDelete({ userId });
        if (!deletedCart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });
        }
        res.status(200).json({ message: "Giỏ hàng đã được xóa thành công!" });
    } catch (error) {
        console.error("Error deleting cart:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ khi xóa giỏ hàng!" });
    }
};
