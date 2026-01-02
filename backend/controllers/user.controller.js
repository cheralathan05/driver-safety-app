const User = require("../models/User");

/**
 * GET /api/user/me
 * Returns the currently authenticated user
 */
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("GET /api/user/me error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/user/update
 * Update driver profile & settings
 */
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("PUT /api/user/update error:", error);
    return res.status(500).json({
      message: "Failed to update user",
    });
  }
};
