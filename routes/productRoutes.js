const express = require("express");
const {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    upload,
} = require("../controller/productController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.post("/", upload.single("pic"), createProduct);
router.put("/:id", upload.single("pic"), updateProduct);

module.exports = router;