const WaitingList = require("../models/WaitingList");
const Hostel      = require("../models/Hostel");
const Booking     = require("../models/Booking");

// GET all — Admin
exports.getAllWaiting = async (req, res) => {
  try {
    const list = await WaitingList.find()
      .populate("userId",   "name email")
      .populate("hostelId", "name location pricePerMonth availableRooms")
      .sort({ hostelId: 1, position: 1 });
    res.status(200).json({ success: true, count: list.length, waitingList: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET mine — Student
exports.getMyWaiting = async (req, res) => {
  try {
    const list = await WaitingList.find({ userId: req.user._id })
      .populate("hostelId", "name location pricePerMonth")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, waitingList: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT assign — Admin manual override
exports.manualAssign = async (req, res) => {
  try {
    const entry = await WaitingList.findById(req.params.id).populate("hostelId");
    if (!entry)
      return res.status(404).json({ success: false, message: "Entry not found" });
    if (entry.status !== "waiting")
      return res.status(400).json({ success: false, message: "Student is not waiting" });

    const hostel = entry.hostelId;
    if (!hostel || hostel.availableRooms < 1)
      return res.status(400).json({ success: false, message: "No rooms available" });

    // Create confirmed booking
    await Booking.create({
      userId:       entry.userId,
      hostelId:     hostel._id,
      checkInDate:  new Date(),
      checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
      status:       "confirmed",
      paymentStatus: "unpaid",
    });

    // Decrease available rooms
    await Hostel.findByIdAndUpdate(hostel._id, { $inc: { availableRooms: -1 } });

    // Mark entry as assigned
    entry.status     = "assigned";
    entry.assignedAt = new Date();
    await entry.save();

    // Re-number remaining queue positions
    const remaining = await WaitingList.find({
      hostelId: hostel._id,
      status:   "waiting",
    }).sort({ position: 1 });

    await Promise.all(
      remaining.map((e, i) =>
        WaitingList.findByIdAndUpdate(e._id, { position: i + 1 })
      )
    );

    res.status(200).json({ success: true, message: "Room assigned successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE remove — Admin or own Student
exports.removeFromWaiting = async (req, res) => {
  try {
    const entry = await WaitingList.findById(req.params.id);
    if (!entry)
      return res.status(404).json({ success: false, message: "Entry not found" });

    // Students can only remove themselves
    if (
      req.user.role === "student" &&
      entry.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { hostelId, position } = entry;
    await entry.deleteOne();

    // Shift everyone behind this position up by 1
    const remaining = await WaitingList.find({
      hostelId,
      status:   "waiting",
      position: { $gt: position },
    });

    await Promise.all(
      remaining.map((e) =>
        WaitingList.findByIdAndUpdate(e._id, { $inc: { position: -1 } })
      )
    );

    res.status(200).json({ success: true, message: "Removed from waiting list" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};