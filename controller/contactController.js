const Contact = require('../model/contact');
const nodemailer = require("nodemailer");

// Lấy tất cả liên hệ
exports.getAllContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy một liên hệ
exports.getContactById = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Tạo một liên hệ
exports.createContact = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "astrixalwayswithyou@gmail.com",
                pass: "qnxc dufh wybx tmsc",
            },
        });

        const info = await transporter.sendMail({
            from: '"Astrix - Luôn đồng hành cùng bạn" <astrixalwayswithyou@gmail.com>',
            to: email,
            subject: "Cảm ơn bạn đã liên hệ",
            text: `Xin chào ${name},\n\nChúng tôi đã nhận được tin nhắn của bạn: "${message}"`,
            html: `
                <div style="margin-top: 30px; margin-bottom: 50px;">
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                        <div style="text-align: center; padding-bottom: 20px;">
                            <h2 style="color: #2c3e50; margin: 0;">Astrix Team</h2>
                            <p style="color: #7f8c8d; font-size: 14px;">Luôn đồng hành cùng bạn</p>
                        </div>
                        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                            <h3 style="color:rgb(0, 0, 0); margin-top: 0;">Xin chào ${name}</h3>
                            <p style="color: #555; line-height: 1.6;">Chúng tôi rất vui khi nhận được tin nhắn của bạn:</p>
                            <blockquote style="border-left: 3px solid #3498db; padding-left: 15px; color: #666; font-style: italic;">
                                "${message}"
                            </blockquote>
                            <p style="color: #555; line-height: 1.6;">Đội ngũ của chúng tôi sẽ xem xét và phản hồi bạn trong thời gian sớm nhất. Cảm ơn bạn đã liên hệ với chúng tôi!</p>
                        </div>
                        <div style="text-align: center; padding-top: 20px; color: #7f8c8d; font-size: 12px;">
                            <p>Trân trọng,</p>
                            <p style="font-weight: bold; color: #2c3e50;">Đội ngũ Astrix</p>
                            <p>Nếu bạn cần hỗ trợ ngay, vui lòng liên hệ: <a href="mailto:astrixalwayswithyou@gmail.com" style="color: #3498db; text-decoration: none;">astrixalwayswithyou@gmail.com</a></p>
                        </div>
                    </div>
                </div>
            `,
        });

        res.status(201).json({
            message: "Thông tin đã được gửi thành công!",
            contact: newContact
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Có lỗi xảy ra khi gửi thông tin",
            error: error.message
        });
    }
};

// Phản hồi liên hệ
exports.replyContact = async (req, res) => {
    try {
        const { contactId, replyMessage } = req.body;

        if (!contactId || !replyMessage) {
            return res.status(400).json({
                success: false,
                message: "Contact ID and reply message are required",
            });
        }

        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "astrixalwayswithyou@gmail.com",
                pass: "qnxc dufh wybx tmsc",
            },
        });

        // Nội dung email
        const mailOptions = {
            from: '"Astrix - Luôn đồng hành cùng bạn" <astrixalwayswithyou@gmail.com>',
            to: contact.email,
            subject: `Phản hồi từ Astrix về yêu cầu của bạn`,
            text: `Xin chào ${contact.name || 'Khách hàng thân mến'},

                    Chúng tôi đã nhận được tin nhắn của bạn: "${contact.message}"
                    Dưới đây là phản hồi từ đội ngũ Astrix:

                    "${replyMessage}"

                    Cảm ơn bạn đã liên hệ với chúng tôi. Nếu có thêm câu hỏi, xin vui lòng trả lời email này.

                    Trân trọng,
                    Đội ngũ Astrix`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Xin chào ${contact.name || 'Khách hàng thân mến'},</h2>
                    <p style="color: #34495e;">Chúng tôi đã nhận được tin nhắn của bạn:</p>
                    <blockquote style="border-left: 3px solid #e74c3c; padding-left: 10px; color: #7f8c8d;">
                        ${contact.message}
                    </blockquote>
                    <p style="color: #34495e;">Dưới đây là phản hồi từ đội ngũ Astrix:</p>
                    <p style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; color: #333;">
                        ${replyMessage}
                    </p>
                    <p style="color: #7f8c8d;">Cảm ơn bạn đã liên hệ với chúng tôi. Nếu có thêm câu hỏi, xin vui lòng trả lời email này.</p>
                    <p style="color: #7f8c8d; font-style: italic;">
                        Trân trọng,<br/>
                        <strong>Đội ngũ Astrix</strong>
                    </p>
                </div>
            `,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Reply sent successfully",
        });
    } catch (error) {
        console.error(`Error sending reply for contact ${req.body.contactId}:`, error);
        return res.status(500).json({
            success: false,
            message: "Failed to send reply",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};


//astrix12345 qnxc dufh wybx tmsc