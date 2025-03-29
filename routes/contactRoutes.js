const express = require('express');
const router = express.Router();
const {
    getAllContact,
    getContactById,
    createContact,
} = require('../controller/contactController');

// Lấy tất cả danh mục
router.get('/', getAllContact);

// Lấy một danh mục theo ID
router.get('/:id', getContactById);

// Tạo một danh mục mới
router.post('/', createContact);

module.exports = router;
