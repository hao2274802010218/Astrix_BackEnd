const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "Không tìm thấy người dùng!" });
            }
            next();
        } catch (error) {
            console.error("Lỗi xác thực token:", error.message);
            return res.status(401).json({ message: "Token không hợp lệ!" });
        }
    } else {
        return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });
    }
};


// Middleware phân quyền admin
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Bạn không có quyền truy cập vào trang này!" });
    }
};


