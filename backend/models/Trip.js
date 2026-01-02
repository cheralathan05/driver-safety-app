const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startLocation: {
      type: String,
      required: true,
    },

    endLocation: {
      type: String,
      required: true,
    },

    distance: {
      type: Number, // km
      required: true,
    },

    duration: {
      type: Number, // minutes
      required: true,
    },

    safetyScore: {
      type: Number, // 0–100
      required: true,
    },

    alerts: {
      type: Number,
      default: 0,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    endedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
