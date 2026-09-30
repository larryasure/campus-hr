import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }

    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required",
      );
    }

    await mongoose.connect(uri);

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "HR_ADMIN";
      existingAdmin.employmentStatus = "ACTIVE";

      await existingAdmin.save();

      console.log("HR Admin password reset successfully.");
      console.log(`Email: ${email}`);

      await mongoose.disconnect();
      return;
    }

    await User.create({
      staffId: "HR001",
      fullName: "HR Administrator",
      email,
      password: hashedPassword,
      role: "HR_ADMIN",
      employmentStatus: "ACTIVE",
    });

    console.log("HR Admin created successfully.");
    console.log(`Email: ${email}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }
};

createAdmin();