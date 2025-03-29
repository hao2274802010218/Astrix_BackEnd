const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    pic: { type: String, required: false },
    content: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    sizes: { type: [String], required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
