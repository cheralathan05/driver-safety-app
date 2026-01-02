const Trip = require("../models/Trip");

const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const trips = await Trip.find({ user: userId })
      .sort({ startedAt: -1 })
      .select("-__v");

    return res.status(200).json(trips);
  } catch (error) {
    console.error("GET /api/history error:", error);
    return res.status(500).json({ message: "Failed to fetch trip history" });
  }
};

module.exports = {
  getHistory,
};
