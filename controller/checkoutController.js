const mongoose = require("mongoose");
const Order = require("../model/order");
const nodemailer = require("nodemailer");


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
            note: note || "",
            paymentMethod,
        });

        const savedOrder = await newOrder.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "astrixalwayswithyou@gmail.com",
                pass: "qnxc dufh wybx tmsc",
            },
        });


        const cartItemsHtml = cart.map(item => `
            <tr style="background-color: #f9f9f9; text-align: center;">
                <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.name}</td>
                <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.size}</td>
                <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.price.toLocaleString()} VND</td>
                <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.quantity}</td>
                <td style="padding: 12px; color: #e74c3c;border: 1px solid #ddd; font-weight: bold;">
                    ${(item.price * item.quantity).toLocaleString()} VND
                </td>
            </tr>
        `).join("");

        const info = await transporter.sendMail({
            from: '"Astrix - Luôn đồng hành cùng bạn" <astrixalwayswithyou@gmail.com>',
            to: email,
            subject: "Xác nhận đơn hàng từ Astrix",
            text: `Xin chào ${username},\n\nCảm ơn bạn đã đặt hàng tại Astrix. Dưới đây là chi tiết đơn hàng của bạn:\n\nTổng tiền: ${total.toLocaleString()} VND\n\nTrân trọng,\nĐội ngũ Astrix`,
            html: `
            <div style="margin-top: 50px; margin-bottom: 40px;">
                <div style="font-family: 'Arial', sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; background-color: #f4f7f9; border-radius: 10px; border: 1px solid #dcdcdc;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h2 style="color: black; margin: 0; font-size: 24px;">Xác Nhận Đơn Hàng</h2>
                        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Cảm ơn bạn đã tin tưởng và mua sắm tại Astrix</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                        <h3 style="color:rgb(0, 0, 0); margin: 0 0 15px 0; font-size: 18px;">Kính gửi <span style="font-weight: bold;">${username}</span>,</h3>
                        <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được ghi nhận thành công. Dưới đây là thông tin chi tiết:</p>
                        <div style="margin: 20px 0; font-size: 14px;">
                            <p style="color: black" ><strong>Khách hàng:</strong> ${username}</p>
                            <p style="color: black"><strong>Số điện thoại:</strong> ${phone}</p>
                            <p style="color: black"><strong>Email:</strong> ${email}</p>
                            <p style="color: black"><strong>Địa chỉ giao hàng:</strong> ${address}</p>
                            <p style="color: black"><strong>Ghi chú:</strong> ${note || "Không có"}</p>
                            <p style="color: black"><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
                            <p style="color: black"><strong>Ngày đặt hàng:</strong> ${new Date(savedOrder.createdAt).toLocaleString('vi-VN')}</p>
                            <p style="color: black"><strong>Trạng thái:</strong> ${savedOrder.status}</p>
                        </div>
                        <h4 style="color: black; font-size: 16px; font-weight: bold; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin: 30px 0 20px;">Chi Tiết Sản Phẩm</h4>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #ecf0f1; text-align: center; color:#333; border-bottom: 1px solid #ddd;">
                                    <th style="padding: 12px; font-weight: bold; border-right: 1px solid #ddd;">Sản phẩm</th>
                                    <th style="padding: 12px; font-weight: bold; border-right: 1px solid #ddd;">Kích cỡ</th>
                                    <th style="padding: 12px; font-weight: bold; border-right: 1px solid #ddd;">Đơn giá</th>
                                    <th style="padding: 12px; font-weight: bold; border-right: 1px solid #ddd;">Số lượng</th>
                                    <th style="padding: 12px; font-weight: bold;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cartItemsHtml}
                            </tbody>
                        </table>
                        <div style="text-align: right; padding-top: 10px;">
                            <h4 style="color: #e74c3c; font-size: 18px; font-weight: bold; margin: 0;">Tổng cộng: ${total.toLocaleString()} VND</h4>
                        </div>
                        <p style="color: #555; line-height: 1.6; margin: 20px 0 0 0;">Đơn hàng của bạn sẽ được xử lý trong thời gian sớm nhất. Nếu có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                    </div>
                    <div style="text-align: center; padding-top: 10px; color: #7f8c8d; font-size: 12px;">
                        <p style="margin: 0;">Trân trọng,</p>
                        <p style="font-weight: bold; color: #2c3e50; margin: 5px 0;">Đội ngũ Astrix</p>
                        <p style="margin: 0;">Hỗ trợ: <a href="mailto:astrixalwayswithyou@gmail.com" style="color: #3498db; text-decoration: none;">astrixalwayswithyou@gmail.com</a></p>
                    </div>
                </div>
            </div>
            `,
        });


        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "An error occurred while processing your order", error: error.message });
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