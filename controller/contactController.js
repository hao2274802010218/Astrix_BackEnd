const Contact = require('../model/contact');
const nodemailer = require("nodemailer");

// Lấy tất cả liên hệ
const getAllContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy một liên hệ
const getContactById = async (req, res) => {
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
const createContact = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "astrixalwayswithyou@gmail.com",
                pass: "qnxc dufh wybx tmsc",
            },
        });

        const info = await transporter.sendMail({
            from: '"Astrix Always With You" <astrixalwayswithyou@gmail.com>',
            to: email,
            subject: "Cảm ơn bạn đã liên hệ",
            text: `Xin chào ${name},\n\nChúng tôi đã nhận được tin nhắn của bạn: "${message}"`,
            html: `
                <div style="margin-top: 50px; margin-bottom: 50px;">
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                        <div style="text-align: center; padding-bottom: 20px;">
                            <h2 style="color: #2c3e50; margin: 0;">Astrix Team</h2>
                            <p style="color: #7f8c8d; font-size: 14px;">Luôn đồng hành cùng bạn</p>
                        </div>
                        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                            <h3 style="color:rgb(0, 0, 0); margin-top: 0;">Xin chào ${name},</h3>
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

module.exports = {
    getAllContact,
    getContactById,
    createContact,
};

//astrix12345 qnxc dufh wybx tmsc