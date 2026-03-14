const mongoose = require("mongoose");

const waitingListSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    position: { type: Number },
    status:   { type: String, enum: ["waiting", "assigned", "expired"], default: "waiting" },
  },
  { timestamps: true }
);

waitingListSchema.index({ userId: 1, hostelId: 1 }, { unique: true });

module.exports = mongoose.model("WaitingList", waitingListSchema);