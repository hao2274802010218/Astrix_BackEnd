const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, updateUserRole, getUserById, updateUserInformation, checkAuth } = require("../controller/authController");
const { protect } = require("../middlewares/authMiddleware");



router.post("/register", register);

router.post("/login", login);

router.get("/check-auth", protect, checkAuth);

router.get("/alluser", getAllUsers)

router.put("/:id", updateUserRole)

router.get("/:id", getUserById);

router.put("/update/:id", protect, updateUserInformation);

module.exports = router;
