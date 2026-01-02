const express = require("express");
const router = express.Router();

const {
  getMe,
  updateUser,
} = require("../controllers/user.controller");

const { protect } = require("../middleware/auth");

/**
 * 🔐 Get current logged-in user
 * GET /api/user/me
 */
router.get("/me", protect, getMe);

/**
 * ✏️ Update logged-in user profile/settings
 * PUT /api/user/update
 */
router.put("/update", protect, updateUser);

module.exports = router;
