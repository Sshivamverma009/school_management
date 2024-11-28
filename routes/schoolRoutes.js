import express from "express";
import db from "../db.js";

const router = express.Router();
// Add School API
router.post("/addSchool", (req, res) => {
    console.log(req.body);
  const { name, address, latitude, longitude } = req.body;

  // Validate input
  if (
    !name ||
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  });
});

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// List Schools API
router.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;

  if (typeof latitude === "undefined" || typeof longitude === "undefined") {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: "Invalid latitude or longitude" });
  }

  const query = "SELECT id, name, address, latitude, longitude FROM schools";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    const schoolsWithDistance = results.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
});

export default router
