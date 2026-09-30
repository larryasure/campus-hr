import User from "../models/User.js";
export const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching profile",
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { fullName, email, phone, faculty, department, academicRank, dateOfEmployment, profilePhoto, } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Not a lecturer",
            });
        }
        if (email && email.toLowerCase() !== user.email) {
            const existingEmail = await User.findOne({
                email: email.toLowerCase(),
                _id: { $ne: user._id },
            });
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already in use",
                });
            }
            user.email = email.toLowerCase();
        }
        if (fullName !== undefined)
            user.fullName = fullName;
        if (phone !== undefined)
            user.phone = phone;
        if (faculty !== undefined)
            user.faculty = faculty;
        if (department !== undefined)
            user.department = department;
        if (academicRank !== undefined)
            user.academicRank = academicRank;
        if (dateOfEmployment !== undefined) {
            user.dateOfEmployment = dateOfEmployment;
        }
        if (profilePhoto !== undefined) {
            user.profilePhoto = profilePhoto;
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                staffId: user.staffId,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                faculty: user.faculty,
                department: user.department,
                academicRank: user.academicRank,
                dateOfEmployment: user.dateOfEmployment,
                employmentStatus: user.employmentStatus,
                profilePhoto: user.profilePhoto,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating profile",
        });
    }
};
export const getAllLecturers = async (req, res) => {
    try {
        const { search = "", faculty = "", department = "", academicRank = "", } = req.query;
        const filter = {
            role: "LECTURER",
        };
        if (search) {
            const searchRegex = new RegExp(String(search), "i");
            filter.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { staffId: searchRegex },
            ];
        }
        if (faculty) {
            filter.faculty = String(faculty);
        }
        if (department) {
            filter.department = String(department);
        }
        if (academicRank) {
            filter.academicRank = String(academicRank);
        }
        const lecturers = await User.find(filter)
            .select("-password")
            .sort({ fullName: 1 })
            .lean();
        return res.status(200).json({
            success: true,
            data: lecturers,
        });
    }
    catch (error) {
        console.error("Get all lecturers error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching lecturers",
        });
    }
};
