const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { email, password, username, phone, address } = req.body;

        if (!email || !password || !username || !phone) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin: email, password và username."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Định dạng email không hợp lệ." });
        }

        if (password.length < 3) {
            return res.status(400).json({
                message: "Mật khẩu phải có ít nhất 6 ký tự."
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email đã được sử dụng." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            phone,
            address,
            role: "user",
        });

        await newUser.save();

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: {
                email: newUser.email,
                username: newUser.username,
                phone: newUser.phone,
                address: newUser.address,
                role: newUser.role,
            }
        });
    } catch (error) {
        console.error("Error in register API:", error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }
        res.status(500).json({
            message: "Đã xảy ra lỗi trong quá trình đăng ký.",
            error: error.message
        });
    }
};


// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Không tìm thấy user với email:", email);
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Mật khẩu không đúng cho email:", email);
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const redirectURL = user.role === "admin" ? "/admin" : "/client";

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            redirectURL,
            role: user.role,
            username: user.username,
            id: user._id,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Lỗi trong login:", error.stack);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
};


exports.checkAuth = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "Đã xác thực",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(401).json({ message: "Không được xác thực!" });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    try {
        if (!["user", "admin", "stranger"].includes(role)) {
            return res.status(400).json({ message: "Invalid role provided." });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User role updated successfully.",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
};


exports.updateUserInformation = async (req, res) => {
    const { username, email, phone, address, role } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
    }

    if (!username || !email) {
        return res.status(400).json({ message: "Tên người dùng và email là bắt buộc!" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật thông tin này!" });
        }

        user.username = username;
        user.email = email;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        if (role) {
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({ message: "Vai trò không hợp lệ!" });
            }
            user.role = role;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            message: "Thông tin người dùng đã được cập nhật thành công.",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

