const Contact = require('../model/contact');

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
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
    }
};

module.exports = {
    getAllContact,
    getContactById,
    createContact,
};
