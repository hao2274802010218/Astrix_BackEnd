const express = require("express");
const { payos, handlePayosReturn } = require("../controller/checkoutController");

const router = express.Router();

router.post("/create-payment-link", payos);


router.get("/return", handlePayosReturn);

module.exports = router;