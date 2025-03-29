const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../model/Product");

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu ảnh vào thư mục uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, description, sizes, content } = req.body;
        const pic = req.file ? `/uploads/${req.file.filename}` : undefined; // Đường dẫn tương đối

        const productData = {
            name,
            price,
            category,
            description,
            sizes: sizes.split(",").map(size => size.trim()), // Chuyển chuỗi sizes thành mảng
            content,
            pic,
        };

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({
            message: "Không thể tạo sản phẩm",
            error: err.message,
        });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, category, description, sizes, content } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const pic = req.file ? `/uploads/${req.file.filename}` : product.pic;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                price,
                category,
                description,
                sizes: sizes.split(",").map(size => size.trim()), // Chuyển chuỗi sizes thành mảng
                pic,
                content,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Xóa sản phẩm (thêm logic xóa ảnh nếu cần)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Xóa ảnh từ thư mục uploads nếu tồn tại (tùy chọn)
        if (product.pic) {
            const imagePath = path.join(__dirname, "../", product.pic);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// Các hàm khác giữ nguyên
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.upload = upload;