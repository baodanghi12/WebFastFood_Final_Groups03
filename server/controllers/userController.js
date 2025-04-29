import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  console.log("req.userId:", req.userId);
  try {
    const user = await userModel.findById(req.userId).select("-password");
    console.log("user:", user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData: user });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
