const Category = require('../model/category');

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy một danh mục theo ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Tạo một danh mục mới
exports.createCategory = async (req, res) => {
    const { name, valuename } = req.body;
    try {
        const newCategory = new Category({ name, valuename });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
    }
};

// Cập nhật một danh mục
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, valuename } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, valuename },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
    }
};

// Xóa một danh mục
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

