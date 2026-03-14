const Hostel = require("../models/Hostel");

// ── Get All Hostels (with filters) ────────────────────────
exports.getAllHostels = async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice } = req.query;

    const filter = { isActive: true };

    if (type && type !== "all")
      filter.type = type;

    if (city)
      filter["location.city"] = { $regex: city.trim(), $options: "i" };

    if (minPrice || maxPrice) {
      filter.pricePerMonth = {};
      if (minPrice) filter.pricePerMonth.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerMonth.$lte = Number(maxPrice);
    }

    const hostels = await Hostel.find(filter).populate("createdBy", "name email");
    res.status(200).json({ success: true, count: hostels.length, hostels });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Nearby Hostels (GPS based) ────────────────────────
exports.getNearbyHostels = async (req, res) => {
  try {
    const { lat, lng, radius = 5, type } = req.query;

    if (!lat || !lng)
      return res.status(400).json({ success: false, message: "lat and lng are required" });

    const filter = {
      isActive: true,
      "location.coordinates": {
        $near: {
          $geometry: {
            type:        "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000,
        },
      },
    };

    if (type && type !== "all") filter.type = type;

    const hostels = await Hostel.find(filter).populate("createdBy", "name email");

    // Attach calculated distance in km to each hostel
    const hostelsWithDistance = hostels.map((h) => {
      const obj  = h.toObject();
      const hLat = h.location?.coordinates?.coordinates?.[1];
      const hLng = h.location?.coordinates?.coordinates?.[0];

      if (hLat && hLng) {
        const R    = 6371;
        const dLat = ((hLat - parseFloat(lat)) * Math.PI) / 180;
        const dLon = ((hLng - parseFloat(lng)) * Math.PI) / 180;
        const a    =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((parseFloat(lat) * Math.PI) / 180) *
          Math.cos((hLat          * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
        obj.distance = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
      } else {
        obj.distance = null;
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      count:   hostelsWithDistance.length,
      hostels: hostelsWithDistance,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Hostel ──────────────────────────────────────
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate("createdBy", "name email");
    if (!hostel)
      return res.status(404).json({ success: false, message: "Hostel not found" });

    res.status(200).json({ success: true, hostel });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Create Hostel ──────────────────────────────────────────
exports.createHostel = async (req, res) => {
  try {
    const {
      name, description, address, city, state,
      lat, lng, type, totalRooms,
      pricePerMonth, amenities,
    } = req.body;

    if (!lat || !lng)
      return res.status(400).json({ success: false, message: "GPS coordinates (lat, lng) are required" });

    const hostel = await Hostel.create({
      name,
      description,
      type,
      totalRooms:     Number(totalRooms),
      availableRooms: Number(totalRooms),
      pricePerMonth:  Number(pricePerMonth),
      amenities:      amenities || [],
      createdBy:      req.user._id,
      location: {
        address,
        city,
        state,
        coordinates: {
          type:        "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
      },
    });

    res.status(201).json({ success: true, hostel });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Hostel ──────────────────────────────────────────
exports.updateHostel = async (req, res) => {
  try {
    const {
      name, description, address, city, state,
      lat, lng, type, totalRooms,
      pricePerMonth, amenities,
    } = req.body;

    const hostel = await Hostel.findById(req.params.id);
    if (!hostel)
      return res.status(404).json({ success: false, message: "Hostel not found" });

    if (name)          hostel.name          = name;
    if (description)   hostel.description   = description;
    if (type)          hostel.type          = type;
    if (pricePerMonth) hostel.pricePerMonth = Number(pricePerMonth);
    if (amenities)     hostel.amenities     = amenities;

    // Adjust availableRooms by difference when totalRooms changes
    if (totalRooms) {
      const diff            = Number(totalRooms) - hostel.totalRooms;
      hostel.totalRooms     = Number(totalRooms);
      hostel.availableRooms = Math.max(0, hostel.availableRooms + diff);
    }

    if (address) hostel.location.address = address;
    if (city)    hostel.location.city    = city;
    if (state)   hostel.location.state   = state;

    if (lat && lng) {
      hostel.location.coordinates = {
        type:        "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    await hostel.save();
    res.status(200).json({ success: true, hostel });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Hostel (soft delete) ────────────────────────────
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel)
      return res.status(404).json({ success: false, message: "Hostel not found" });

    hostel.isActive = false;
    await hostel.save();

    res.status(200).json({ success: true, message: "Hostel deactivated successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};