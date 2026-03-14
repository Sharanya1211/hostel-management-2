const express  = require("express");
const router   = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const {
  getAllWaiting,
  getMyWaiting,
  manualAssign,
  removeFromWaiting,
} = require("../controllers/waitingList.controller");

router.use(protect);

router.get("/",           authorize("admin"), getAllWaiting);
router.get("/mine",                           getMyWaiting);
router.put("/:id/assign", authorize("admin"), manualAssign);
router.delete("/:id",                         removeFromWaiting);

module.exports = router;