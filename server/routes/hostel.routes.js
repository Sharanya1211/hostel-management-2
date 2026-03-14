const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const { getAllHostels, getNearbyHostels, createHostel, updateHostel ,deleteHostel} = require("../controllers/hostel.controller");

router.get("/nearby", protect, getNearbyHostels);
router.get("/", protect, getAllHostels);
router.post("/", protect, authorize("admin"), createHostel);
router.put("/:id", protect, authorize("admin"), updateHostel);
router.delete("/:id",   authorize("admin"), deleteHostel);
module.exports = router;