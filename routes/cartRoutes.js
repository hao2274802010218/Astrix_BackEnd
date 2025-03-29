const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.get('/:userId', cartController.getCart);
router.post("/", cartController.addToCart);
router.put('/', cartController.updateCartItem);
router.delete("/:userId/:productId", cartController.removeFromCart);
router.delete('/:userId', cartController.clearCart);

module.exports = router;
