require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const connectDB  = require("./config/db");
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const hostelRoutes = require('./routes/hostel.routes');
const waitingListRoutes = require('./routes/waitingList.routes');

const app = express();
console.log("authRoutes:", typeof authRoutes);
console.log("bookingRoutes:", typeof bookingRoutes);
console.log("hostelRoutes:", typeof hostelRoutes);
console.log("waitingListRoutes:", typeof waitingListRoutes);

// ── Connect DB ──────────────────────────────────────
connectDB();

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────
app.use("/api/auth",         require("./routes/auth.routes"));
app.use("/api/hostels",      require("./routes/hostel.routes"));
app.use("/api/bookings",     require("./routes/booking.routes"));
app.use("/api/waiting-list", require("./routes/waitingList.routes"));

// ── Health check ────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── 404 handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));