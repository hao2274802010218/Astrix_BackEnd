const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controller/categoryController');

// Lấy tất cả danh mục
router.get('/', getAllCategories);

// Lấy một danh mục theo ID
router.get('/:id', getCategoryById);

// Tạo một danh mục mới
router.post('/', createCategory);

// Cập nhật một danh mục
router.put('/:id', updateCategory);

// Xóa một danh mục
router.delete('/:id', deleteCategory);

module.exports = router;
