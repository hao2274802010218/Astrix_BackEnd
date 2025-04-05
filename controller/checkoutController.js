const mongoose = require("mongoose");
const Order = require("../model/order");
const nodemailer = require("nodemailer");
const PayOS = require("@payos/node");


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
            service: 'Gmail',
            auth: {
                user: "astrixalwayswithyou@gmail.com",
                pass: "qnxc dufh wybx tmsc",
            },
        });


        const cartItemsHtml = cart.map(item => `
            <tr style="background-color:rgb(255, 255, 255); text-align: center;">
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
            <div style="margin-top: 30px; margin-bottom: 40px;">
                <div style="font-family: 'Arial', sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; background-color: #f4f7f9; border-radius: 10px; border: 1px solid #dcdcdc;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h2 style="color: black; margin: 0; font-size: 24px;">Xác Nhận Đơn Hàng</h2>
                        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">Cảm ơn bạn đã tin tưởng và mua sắm tại Astrix</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                        <h3 style="color:rgb(0, 0, 0); margin: 0 0 15px 0; font-size: 18px;">Xin chào <span style="font-weight: bold;">${username}</span></h3>
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
                        <div style="font-size: 16px; color: #34495e;text-align: end;">
                        <strong>Tổng tiền:</strong> 
                        <span style="color: #e74c3c; font-weight: bold;"> ${total.toLocaleString()} VND</span>
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        if (!status || typeof status !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Status is required and must be a string",
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "astrixalwayswithyou@gmail.com",
                pass: "qnxc dufh wybx tmsc",
            },
        });

        const cartItemsHtml = updatedOrder.cart.map(item => `
            <tr style="background-color:rgb(255, 255, 255); text-align: center;">
                <td style="padding: 12px; color: #333; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 12px; color: #333; border: 1px solid #ddd;">${item.size}</td>
                <td style="padding: 12px; color: #333; border: 1px solid #ddd;">${item.price.toLocaleString()} VND</td>
                <td style="padding: 12px; color: #333; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 12px; color: #e74c3c; border: 1px solid #ddd; font-weight: bold;">
                    ${(item.price * item.quantity).toLocaleString()} VND
                </td>
            </tr>
        `).join("");

        const mailOptions = {
            from: '"Astrix - Luôn đồng hành cùng bạn" <astrixalwayswithyou@gmail.com>',
            to: updatedOrder.email,
            subject: `Cập nhật trạng thái đơn hàng #${updatedOrder._id} - Astrix`,
            text: `Xin chào ${updatedOrder.username || 'Khách hàng thân mến'}, Đơn hàng của bạn đã được cập nhật trạng thái`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Xin chào ${updatedOrder.username || 'Khách hàng thân mến'}</h2>
                    <p style="color: #34495e;">
                        Chúng tôi xin thông báo rằng đơn hàng của bạn <strong>đã thay đổi trạng thái</strong> thành 
                        <strong style="color: #e74c3c;">${status}</strong> vào lúc 
                        <em>${new Date().toLocaleString('vi-VN')}</em>.
                    </p>
                    <h3 style="color: #2c3e50; margin-top: 20px;">Chi tiết đơn hàng</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; border: 1px solid #ddd;">
                        <thead>
                            <tr style="background-color:rgb(230, 230, 230); text-align: center; color: #333; border-bottom: 1px solid #ddd;">
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
                    <p style="font-size: 16px; color: #34495e;">
                        <strong>Tổng tiền:</strong> 
                        <span style="color: #e74c3c; font-weight: bold;">
                            ${updatedOrder.total?.toLocaleString() || 0} VND
                        </span>
                    </p>
                    <p style="color: #7f8c8d; margin-top: 20px;">
                        Cảm ơn bạn đã tin tưởng và ủng hộ <strong>Astrix</strong>. Nếu có bất kỳ thắc mắc nào, 
                        xin vui lòng liên hệ với chúng tôi qua email này hoặc số hotline của Astrix.
                    </p>
                    <p style="color: #7f8c8d; font-style: italic;">
                        Trân trọng,<br/>
                        <strong>Đội ngũ Astrix</strong>
                    </p>
                </div>

            `,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // Trả về response thành công
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully and email sent",
            order: updatedOrder,
        });

    } catch (error) {
        console.error(`Error updating order status for order ${req.params.id}:`, error);

        if (error.code === 'EENVELOPE' && error.message.includes('No recipients defined')) {
            return res.status(400).json({
                success: false,
                message: "Cannot send email: No recipient defined",
            });
        }

        if (error.name === 'MongoNetworkError') {
            return res.status(503).json({
                success: false,
                message: "Database connection error",
            });
        }

        if (error.code === 'EAUTH') {
            return res.status(500).json({
                success: false,
                message: "Email authentication failed",
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while updating order status or sending email",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing User ID",
            });
        }

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: {
                orders,
                total: orders.length
            }
        });

    } catch (error) {
        console.error(`Error fetching orders for user ${req.params.userId}:`, error);

        if (error.name === 'MongoNetworkError') {
            return res.status(503).json({
                success: false,
                message: "Database connection error",
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving orders",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const payos = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

exports.payos = async (req, res) => {
    try {
        const { id, total, paymentMethod, userId, cart, username, phone, email, address, note } = req.body;

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
            status: "Đang chờ thanh toán",
        });

        const savedOrder = await newOrder.save();

        const order = {
            amount: total,
            description: `Thanh toán đơn hàng ${savedOrder._id} bằng ${paymentMethod}`,
            orderCode: parseInt(Date.now().toString().slice(-6)),
            returnUrl: "http://localhost:3000/checkout/success",
            cancelUrl: "http://localhost:3000/checkout/cancel",
        };

        const paymentLink = await payos.createPaymentLink(order);
        res.status(200).json({
            checkoutUrl: paymentLink.checkoutUrl,
            orderId: savedOrder._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi tạo link thanh toán Payos",
            error: error.message,
        });
    }
};
exports.handlePayosReturn = async (req, res) => {
    try {
        const { orderCode } = req.query; // Lấy orderCode từ PayOS

        // Kiểm tra trạng thái thanh toán với PayOS
        const paymentInfo = await payos.getPaymentLinkInformation(orderCode);
        if (paymentInfo.status === "PAID") {
            // Tìm đơn hàng tương ứng
            const order = await Order.findOne({ total: paymentInfo.amount });
            if (order) {
                // Cập nhật trạng thái đơn hàng
                order.status = "Đã thanh toán";
                await order.save();

                // Xóa giỏ hàng
                await fetch(`http://localhost:5000/api/cart/${order.userId}`, {
                    method: "DELETE",
                });

                // Gửi email xác nhận
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "astrixalwayswithyou@gmail.com",
                        pass: "qnxc dufh wybx tmsc",
                    },
                });

                const cartItemsHtml = order.cart
                    .map(
                        (item) => `
              <tr style="background-color:rgb(255, 255, 255); text-align: center;">
                  <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.name}</td>
                  <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.size}</td>
                  <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.price.toLocaleString()} VND</td>
                  <td style="padding: 12px; color: #333;border: 1px solid #ddd">${item.quantity}</td>
                  <td style="padding: 12px; color: #e74c3c;border: 1px solid #ddd; font-weight: bold;">
                      ${(item.price * item.quantity).toLocaleString()} VND
                  </td>
              </tr>
          `
                    )
                    .join("");

                await transporter.sendMail({
                    from: '"Astrix - Luôn đồng hành cùng bạn" <astrixalwayswithyou@gmail.com>',
                    to: order.email,
                    subject: "Xác nhận thanh toán đơn hàng từ Astrix",
                    html: `
              <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px;">
                <h2>Xin chào ${order.username}</h2>
                <p>Đơn hàng của bạn đã được thanh toán thành công qua PayOS.</p>
                <h4>Chi tiết đơn hàng:</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #ecf0f1;">
                      <th>Sản phẩm</th><th>Kích cỡ</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>${cartItemsHtml}</tbody>
                </table>
                <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString()} VND</p>
                <p>Cảm ơn bạn đã mua sắm tại Astrix!</p>
              </div>
            `,
                });

                res.redirect("/cart?payment=success");
            } else {
                res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }
        } else {
            res.redirect("/cart?payment=failed");
        }
    } catch (error) {
        console.error("Error handling PayOS return:", error);
        res.status(500).json({ message: "Lỗi xử lý thanh toán" });
    }
};