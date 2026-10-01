import { Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

/**
 * GET /api/lecturers/profile
 * Get the currently authenticated lecturer's profile
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.userId).select(
      "-password -passwordResetToken -passwordResetExpires",
    );

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
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

/**
 * PUT /api/lecturers/profile
 * Update the currently authenticated lecturer's profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      fullName,
      email,
      phone,
      faculty,
      department,
      academicRank,
      dateOfEmployment,
      profilePhoto,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
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

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (faculty !== undefined) user.faculty = faculty;
    if (department !== undefined) user.department = department;
    if (academicRank !== undefined) user.academicRank = academicRank;

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
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

/**
 * GET /api/admin/lecturers
 * Get all lecturers
 */
export const getAllLecturers = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const {
      search,
      faculty,
      department,
      academicRank,
    } = req.query;

    const filter: Record<string, unknown> = {
      role: "LECTURER",
    };

    if (faculty) {
      filter.faculty = faculty;
    }

    if (department) {
      filter.department = department;
    }

    if (academicRank) {
      filter.academicRank = academicRank;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), "i");

      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { staffId: searchRegex },
      ];
    }

    const lecturers = await User.find(filter)
      .select(
        "-password -passwordResetToken -passwordResetExpires",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: lecturers,
    });
  } catch (error) {
    console.error("Get all lecturers error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching lecturers",
    });
  }
};

/**
 * POST /api/admin/lecturers
 * Create a lecturer
 */
export const createLecturer = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const {
      staffId,
      fullName,
      email,
      password,
      phone,
      faculty,
      department,
      academicRank,
      dateOfEmployment,
      employmentStatus,
      profilePhoto,
    } = req.body;

    if (!staffId || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Staff ID, full name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingStaffId = await User.findOne({
      staffId: staffId.trim(),
    });

    if (existingStaffId) {
      return res.status(409).json({
        success: false,
        message: "Staff ID is already in use",
      });
    }

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lecturer = await User.create({
      staffId: staffId.trim(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      faculty,
      department,
      academicRank,
      dateOfEmployment,
      employmentStatus: employmentStatus || "ACTIVE",
      profilePhoto,
      role: "LECTURER",
    });

    const lecturerData = lecturer.toObject();

    const {
      password: _password,
      passwordResetToken: _passwordResetToken,
      passwordResetExpires: _passwordResetExpires,
      ...safeLecturer
    } = lecturerData;

    return res.status(201).json({
      success: true,
      message: "Lecturer created successfully",
      data: safeLecturer,
    });
  } catch (error) {
    console.error("Create lecturer error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating lecturer",
    });
  }
};

/**
 * PUT /api/admin/lecturers/:id
 * Update a lecturer
 */
export const updateLecturer = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const {
      staffId,
      fullName,
      email,
      password,
      phone,
      faculty,
      department,
      academicRank,
      dateOfEmployment,
      employmentStatus,
      profilePhoto,
    } = req.body;

    const lecturer = await User.findOne({
      _id: id,
      role: "LECTURER",
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    if (staffId !== undefined) {
      const normalizedStaffId = staffId.trim();

      if (normalizedStaffId !== lecturer.staffId) {
        const existingStaffId = await User.findOne({
          staffId: normalizedStaffId,
          _id: { $ne: lecturer._id },
        });

        if (existingStaffId) {
          return res.status(409).json({
            success: false,
            message: "Staff ID is already in use",
          });
        }

        lecturer.staffId = normalizedStaffId;
      }
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      if (normalizedEmail !== lecturer.email) {
        const existingEmail = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: lecturer._id },
        });

        if (existingEmail) {
          return res.status(409).json({
            success: false,
            message: "Email is already in use",
          });
        }

        lecturer.email = normalizedEmail;
      }
    }

    if (fullName !== undefined) {
      lecturer.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      lecturer.phone = phone;
    }

    if (faculty !== undefined) {
      lecturer.faculty = faculty;
    }

    if (department !== undefined) {
      lecturer.department = department;
    }

    if (academicRank !== undefined) {
      lecturer.academicRank = academicRank;
    }

    if (dateOfEmployment !== undefined) {
      lecturer.dateOfEmployment = dateOfEmployment;
    }

    if (employmentStatus !== undefined) {
      lecturer.employmentStatus = employmentStatus;
    }

    if (profilePhoto !== undefined) {
      lecturer.profilePhoto = profilePhoto;
    }

    if (password) {
      lecturer.password = await bcrypt.hash(password, 10);
    }

    await lecturer.save();

    const lecturerData = lecturer.toObject();

    const {
      password: _password,
      passwordResetToken: _passwordResetToken,
      passwordResetExpires: _passwordResetExpires,
      ...safeLecturer
    } = lecturerData;

    return res.status(200).json({
      success: true,
      message: "Lecturer updated successfully",
      data: safeLecturer,
    });
  } catch (error) {
    console.error("Update lecturer error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating lecturer",
    });
  }
};

/**
 * DELETE /api/admin/lecturers/:id
 * Delete a lecturer
 */
export const deleteLecturer = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const lecturer = await User.findOne({
      _id: id,
      role: "LECTURER",
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    await User.deleteOne({
      _id: lecturer._id,
      role: "LECTURER",
    });

    return res.status(200).json({
      success: true,
      message: "Lecturer deleted successfully",
    });
  } catch (error) {
    console.error("Delete lecturer error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting lecturer",
    });
  }
};