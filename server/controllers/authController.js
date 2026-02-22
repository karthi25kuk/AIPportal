const User = require('../models/User');
const jwt = require('jsonwebtoken');


// ================= JWT =================

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};



// ================= REGISTER =================
// Student → auto approved
// Industry → pending approval
// College/Admin → NOT allowed from UI

const registerUser = async (req, res) => {
    const { name, email, password, role, studentDetails, industryDetails } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ success: false, message: 'User already exists' });

        // 🚫 Block college/admin registration
        if (role === 'college' || role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "This role cannot register"
            });
        }

        let status = "pending";

        // ✅ Students auto-approved
        if (role === "student") {
            status = "approved";
            // Ensure collegeName is set
            if (!studentDetails) {
                req.body.studentDetails = {};
            }
            req.body.studentDetails.collegeName = "Bannari Amman Institute of Technology";
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            status,
            ...(role === 'student' && { studentDetails: req.body.studentDetails }),
            ...(role === 'industry' && { industryDetails })
        });

        // ✅ Student auto-login
        if (role === "student") {
            return res.status(201).json({
                success: true,
                data: {
                    token: generateToken(user._id),
                    id: user._id,
                    role: user.role,
                    name: user.name,
                    collegeName: user.studentDetails.collegeName
                }
            });
        }

        // ✅ Industry wait approval
        res.status(201).json({
            success: true,
            message: "Registered. Wait for admin approval"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};



// ================= LOGIN =================

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user)
            return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);

        if (!isMatch)
            return res.status(400).json({ success: false, message: 'Invalid credentials' });

        // ✅ Approval check
        if (
            (user.role === 'industry') &&
            user.status !== 'approved'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Account pending admin approval'
            });
        }

        res.json({
            success: true,
            data: {
                token: generateToken(user._id),
                id: user._id,
                role: user.role,
                name: user.name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};



// ================= GET ME =================

const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
        success: true,
        data: user
    });
};



module.exports = {
    registerUser,
    loginUser,
    getMe
};
