const validateCheckoutData = (req, res, next) => {
    const { username, phone, email, address, cart, total, paymentMethod } = req.body;

    if (!username || !phone || !email || !address || !cart || !total || !paymentMethod) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: "Cart cannot be empty" });
    }

    for (const item of cart) {
        if (!item.pic || !item.name || !item.size || !item.price || !item.quantity) {
            return res.status(400).json({ message: "Each cart item must include pic, name, size, price, and quantity" });
        }
    }

    const validPaymentMethods = ["Cash on Delivery", "Zalo Pay", "Momo", "Payos"];
    if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
    }

    next();
};

module.exports = validateCheckoutData;