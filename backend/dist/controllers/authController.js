import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendRegistrationEmail, sendPasswordChangedEmail, sendPasswordResetEmail, } from "../services/emailService.js";
export const register = async (req, res) => {
    try {
        const { staffId, fullName, email, password, phone, faculty, department, academicRank, dateOfEmployment, } = req.body;
        if (!staffId || !fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Staff ID, full name, email and password are required",
            });
        }
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { staffId }],
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email or staff ID already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            staffId,
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            faculty,
            department,
            academicRank,
            dateOfEmployment,
            role: "LECTURER",
        });
        await sendRegistrationEmail(user.email, user.fullName, user.staffId);
        return res.status(201).json({
            success: true,
            message: "Lecturer registered successfully",
            user: {
                id: user._id,
                staffId: user.staffId,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const user = await User.findOne({
            email: email.toLowerCase(),
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign({
            userId: user._id.toString(),
            role: user.role,
        }, jwtSecret, {
            expiresIn: "1d",
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                staffId: user.staffId,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};
export const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters",
            });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        await sendPasswordChangedEmail(user.email, user.fullName);
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while changing password",
        });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const user = await User.findOne({
            email: email.toLowerCase(),
        });
        // Always return the same response whether the account exists or not.
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent.",
            });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.passwordResetToken = hashedResetToken;
        user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        await sendPasswordResetEmail(user.email, resetToken);
        return res.status(200).json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent.",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while requesting password reset",
        });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required",
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters",
            });
        }
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: new Date(),
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset token is invalid or has expired",
            });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        await sendPasswordChangedEmail(user.email, user.fullName);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while resetting password",
        });
    }
};
