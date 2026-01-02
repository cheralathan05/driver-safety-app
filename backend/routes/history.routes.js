const express = require("express");
const router = express.Router();

// 👇 CRITICAL FIX: Destructure { protect } so you get the function
const { protect } = require("../middleware/auth");

const { getHistory } = require("../controllers/history.controller");

// Use 'protect' instead of 'authMiddleware'
router.get("/", protect, getHistory);

module.exports = router;