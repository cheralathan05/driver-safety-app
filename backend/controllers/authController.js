const User = require("../models/User");
const { signToken } = require("../utils/jwt");

const googleCallbackController = async (req, res) => {
  try {
    const googleUser = req.user; // injected by Passport

    const CLIENT_URL =
      process.env.CLIENT_URL || "http://localhost:3000";

    if (!googleUser) {
      return res.redirect(`${CLIENT_URL}/login?error=NoGoogleUser`);
    }

    // 1️⃣ Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        googleId: googleUser.id,
        name: googleUser.displyName,
        email: googleUser.email,
        avatar: googleUser.photos?.[0]?.value,
      });
    }

    // 2️⃣ Sign JWT  ✅ FIXED (use id)
    const token = signToken({ id: user._id.toString() });

    // 3️⃣ Store JWT in httpOnly cookie ✅ FIXED
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // MUST be false on localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 4️⃣ Redirect to dashboard
    return res.redirect(`${CLIENT_URL}/dashboard`);

  } catch (err) {
    console.error("Google OAuth Error:", err);
    return res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=OAuthFailed`
    );
  }
};

module.exports = {
  googleCallbackController,
};
