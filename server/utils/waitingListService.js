const waitingListService = `
const WaitingList = require("../models/WaitingList");
const Hostel = require("../models/Hostel");
const Booking = require("../models/Booking");
 
/**
 * Add student to waiting list when hostel is full
 */
const addToWaitingList = async (userId, hostelId) => {
  // Check if already in waiting list
  const existing = await WaitingList.findOne({ userId, hostelId, status: "waiting" });
  if (existing) throw new Error("Already in waiting list for this hostel");
 
  // Calculate position (last in queue)
  const lastEntry = await WaitingList.findOne({ hostelId, status: "waiting" })
    .sort({ position: -1 });
 
  const position = lastEntry ? lastEntry.position + 1 : 1;
 
  return await WaitingList.create({ userId, hostelId, position });
};
 
/**
 * AUTO-ASSIGN: When a booking is cancelled, assign room to first waiting student
 * This is called automatically inside booking.controller.js cancelBooking()
 */
const autoAssignFromWaitingList = async (hostelId, session) => {
  // Get the first student waiting (lowest position)
  const firstInQueue = await WaitingList.findOne({ hostelId, status: "waiting" })
    .sort({ position: 1 })
    .populate("userId");
 
  if (!firstInQueue) return null;  // No one waiting, nothing to do
 
  // Create booking for the waiting student
  const hostel = await Hostel.findById(hostelId).session(session);
  if (!hostel || hostel.availableRooms < 1) return null;
 
  const booking = await Booking.create([{
    userId: firstInQueue.userId._id,
    hostelId,
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180), // 6 months default
    status: "confirmed",
    paymentStatus: "unpaid",
  }], { session });
 
  // Update hostel available rooms
  await Hostel.findByIdAndUpdate(hostelId, { $inc: { availableRooms: -1 } }, { session });
 
  // Mark waiting list entry as assigned
  await WaitingList.findByIdAndUpdate(firstInQueue._id, {
    status: "assigned",
    assignedAt: new Date(),
  }, { session });
 
  // Re-number positions for remaining entries
  const remaining = await WaitingList.find({ hostelId, status: "waiting" }).sort({ position: 1 });
  await Promise.all(
    remaining.map((entry, index) =>
      WaitingList.findByIdAndUpdate(entry._id, { position: index + 1 })
    )
  );
 
  return { booking: booking[0], assignedTo: firstInQueue.userId };
};
 
module.exports = { addToWaitingList, autoAssignFromWaitingList };
`;