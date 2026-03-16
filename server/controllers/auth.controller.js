const User = require("../models/User");
const jwt  = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const userResponse = (user) => ({
  _id:              user._id,
  name:             user.name,
  email:            user.email,
  role:             user.role,
  username:         user.username,
  phone:            user.phone,
  aadharNumber:     user.aadharNumber,
  permanentAddress: user.permanentAddress,
  studentId:        user.studentId,
  course:           user.course,
});

// ── Register ───────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, role,
      username, phone, aadharNumber,
      permanentAddress, studentId, course,
    } = req.body;

    // Check email
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ success: false, message: "Email already registered" });

    // Check username
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername)
        return res.status(400).json({ success: false, message: "Username already taken" });
    }

    // Create user
    // Password is hashed automatically by the pre save hook in User model
    // Do NOT hash manually here — that would cause double hashing
    const user = await User.create({
  name,
  email,
  password,
  role:             role || "student",
  username:         username || undefined,
  phone:            phone    || undefined,
  aadharNumber:     aadharNumber     || undefined,
  permanentAddress: permanentAddress || undefined,
  studentId:        studentId        || undefined,
  course:           course           || undefined,
});

    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user: userResponse(user) });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Login ──────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    // Use the matchPassword method defined in User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = signToken(user._id);
    res.status(200).json({ success: true, token, user: userResponse(user) });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get current user ───────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user: userResponse(user) });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};