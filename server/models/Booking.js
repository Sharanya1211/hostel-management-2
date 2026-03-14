const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostelId:      { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    roomNumber:    { type: String },
    checkInDate:   { type: Date, required: true },
    checkOutDate:  { type: Date, required: true },
    totalAmount:   { type: Number },
    status:        { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    cancelledAt:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);