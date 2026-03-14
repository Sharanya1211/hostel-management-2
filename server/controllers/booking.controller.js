const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const WaitingList = require("../models/WaitingList");

exports.getBookings = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("hostelId", "name location pricePerMonth")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { hostelId, checkInDate, checkOutDate } = req.body;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    if (hostel.availableRooms <= 0) {
      const existing = await WaitingList.findOne({ userId: req.user._id, hostelId, status: "waiting" });
      if (existing) return res.status(400).json({ success: false, message: "Already in waiting list" });
      const last = await WaitingList.findOne({ hostelId, status: "waiting" }).sort({ position: -1 });
      const position = last ? last.position + 1 : 1;
      const entry = await WaitingList.create({ userId: req.user._id, hostelId, position });
      return res.status(200).json({ success: true, message: "Added to waiting list", waitingList: entry });
    }

    const booking = await Booking.create({ userId: req.user._id, hostelId, checkInDate, checkOutDate, status: "confirmed" });
    await Hostel.findByIdAndUpdate(hostelId, { $inc: { availableRooms: -1 } });
    res.status(201).json({ success: true, message: "Booking confirmed!", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (req.user.role === "student" && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    await Hostel.findByIdAndUpdate(booking.hostelId, { $inc: { availableRooms: 1 } });

    // Auto-assign to first in waiting list
    const first = await WaitingList.findOne({ hostelId: booking.hostelId, status: "waiting" }).sort({ position: 1 });
    if (first) {
      await Booking.create({ userId: first.userId, hostelId: booking.hostelId, checkInDate: new Date(), checkOutDate: new Date(Date.now() + 1000*60*60*24*180), status: "confirmed" });
      await Hostel.findByIdAndUpdate(booking.hostelId, { $inc: { availableRooms: -1 } });
      await WaitingList.findByIdAndUpdate(first._id, { status: "assigned" });
    }

    res.status(200).json({ success: true, message: "Booking cancelled", autoAssigned: !!first });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};