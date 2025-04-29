import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email,
      password: hashPassword,
      name,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // localhost thì false, lên server thật thì true
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // cần None nếu cross-origin HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // ✅ Gửi email nhưng bắt lỗi riêng
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to FastFoods",
      text: `Hello ${name},\n\nThank you for registering with us!`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Lỗi gửi email:", error.message);
    }

    // ✅ Trả response thành công dù gửi mail lỗi hay không
    return res.status(200).json({ success: true, message: "Registration successful!" });

  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // localhost thì false, lên server thật thì true
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // cần None nếu cross-origin HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending verify OTP:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    if (user.verifyOtp !== otp || user.verifyOtpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpire = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error checking authentication:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset your password",
      text: `Your OTP for resetting password is ${otp}. It is valid for 15 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending reset OTP:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    if (user.resetOtp !== otp || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpire = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
