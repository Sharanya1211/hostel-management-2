const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ── Basic ──────────────────────────────────────
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["student", "admin"], default: "student" },
    isActive: { type: Boolean, default: true },

    // ── New student fields ─────────────────────────
    username:         { type: String, unique: true, sparse: true, trim: true },
    phone:            { type: String, trim: true },
    aadharNumber:     { type: String, trim: true },
    permanentAddress: { type: String, trim: true },
    studentId:        { type: String, trim: true },
    course:           { type: String, trim: true },
  },
  { timestamps: true }
);

// Hash password before saving (only if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);