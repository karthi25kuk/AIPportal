const User = require('../models/User');
const jwt = require('jsonwebtoken');


// ================= JWT =================
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};



// ================= REGISTER =================
const registerUser = async (req, res) => {

    const { name, email, password, role } = req.body;

    try {

        // ✅ Only allow student & industry
        if (!['student', 'industry'].includes(role)) {
            return res.status(403).json({
                success: false,
                message: "Invalid role"
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists)
            return res.status(400).json({ success: false, message: 'User already exists' });

        let newUserData = {
            name,
            email,
            password,
            role
        };

        // ================= STUDENT =================
        if (role === "student") {

            newUserData.status = "approved";

            newUserData.studentDetails = {
                rollNumber: req.body.studentDetails?.rollNumber || "",
                collegeName: "Bannari Amman Institute of Technology",
                skills: []
            };
        }

        // ================= INDUSTRY =================
        if (role === "industry") {

            newUserData.status = "pending";

            newUserData.industryDetails = {
                companyName: req.body.industryDetails?.companyName || "",
                website: req.body.industryDetails?.website || "",
                address: req.body.industryDetails?.address || "",
                industryType: ""
            };
        }

        const user = await User.create(newUserData);

        // ✅ Student auto login
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

        // ✅ Industry waits approval
        res.status(201).json({
            success: true,
            message: "Registered. Wait for admin approval"
        });

    } catch (error) {
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

        // 🔒 Industry must be approved
        if (user.role === 'industry' && user.status !== 'approved') {
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