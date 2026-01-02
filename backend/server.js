const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Configs
require("./config/passport");
const connectDB = require("./config/db");

// Routes & Controllers
const userRoutes = require("./routes/user.routes");
const { googleCallbackController } = require("./controllers/authController");

const app = express();
connectDB();

/* ===================== MIDDLEWARE ===================== */
// 1. CORS: Allow Frontend to send cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Use env for safety
    credentials: true,
  })
);

// 2. Parsers & Auth
app.use(express.json());
app.use(cookieParser()); // Parses cookies attached to the client request object
app.use(passport.initialize());

/* ===================== GOOGLE AUTH ROUTES ===================== */

// 1. Start Google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google callback → Issues JWT & stores in httpOnly cookie
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackController
);

/* ===================== API ROUTES ===================== */

// User Routes (Protected routes inside here)
app.use("/api/user", userRoutes);

// Logout Route
app.post("/api/auth/logout", (req, res) => {
  // CRITICAL: Ensure this matches the cookie name in your authController ('token' vs 'jwt')
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax", // Must match the setting used when creating the cookie
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

/* ===================== SERVER ===================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const historyRoutes = require("./routes/history.routes");

app.use("/api/history", historyRoutes);
