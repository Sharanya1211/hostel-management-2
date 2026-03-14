const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const { getBookings, createBooking, cancelBooking } = require("../controllers/booking.controller");

router.get("/", protect, getBookings);
router.post("/", protect, authorize("student"), createBooking);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;