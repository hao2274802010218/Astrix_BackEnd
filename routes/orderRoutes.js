const express = require("express");
const {
    order,
    getCheckoutById,
    getAllCheckouts,
    updateOrderStatus,
    getOrdersByUserId,
} = require("../controller/checkoutController");
const validateCheckoutData = require("../middlewares/validateCheckoutData");

const router = express.Router();

router.post("/order", validateCheckoutData, order);
router.get("/order/:id", getCheckoutById);
router.get("/order", getAllCheckouts);
router.put("/order/:id/status", updateOrderStatus);
router.get("/order/user/:userId", getOrdersByUserId);

module.exports = router;