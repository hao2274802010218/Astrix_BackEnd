const mongoose = require("mongoose");
const Order = require("../model/order");

exports.getCheckoutById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ID đơn hàng không hợp lệ",
            });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng với ID này",
            });
        }
        res.status(200).json({
            message: "Lấy đơn hàng thành công",
            order,
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            message: "Lỗi khi lấy đơn hàng",
            error: error.message,
        });
    }
};

exports.order = async (req, res) => {
    try {
        const { userId, username, phone, email, address, cart, total, note, paymentMethod } = req.body;

        const newOrder = new Order({
            userId,
            username,
            phone,
            email,
            address,
            cart,
            total,
            note,
            paymentMethod,
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "An error occurred while processing your order" });
    }
};

exports.getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await Order.find();

        if (checkouts.length === 0) {
            return res.status(404).json({
                message: "No checkouts found",
            });
        }
        res.status(200).json({
            message: "Checkouts retrieved successfully",
            checkouts,
        });
    } catch (error) {
        console.error("Error fetching checkouts:", error);
        res.status(500).json({
            message: "An error occurred while retrieving the checkouts",
            error: error.message,
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "An error occurred while updating the order status" });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID format",
            });
        }

        const orders = await Order.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({
                message: "No orders found for the given user ID",
            });
        }

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders by user ID:", error);
        res.status(500).json({
            message: "An error occurred while retrieving the orders",
            error: error.message,
        });
    }
};