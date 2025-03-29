const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    cart: [
        {
            pic: { type: String, required: true },
            name: { type: String, required: true },
            size: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    note: { type: String, default: "" },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash on Delivery", "Zalo Pay", "Momo", "Payos"],
    },

    status: { type: String, default: "Đang xử lý" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);