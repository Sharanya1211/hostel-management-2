const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String },

    location: {
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String },
      coordinates: {
        type:        { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },  // [longitude, latitude]
      },
    },

    type:           { type: String, enum: ["boys", "girls", "mixed"], required: true },
    totalRooms:     { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    pricePerMonth:  { type: Number, required: true },
    amenities:      [{ type: String }],
    rating:         { type: Number, default: 0 },
    isActive:       { type: Boolean, default: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Required for $near and $geoWithin queries
hostelSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Hostel", hostelSchema);