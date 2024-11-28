import express from "express";
import db from "../db.js";

const router = express.Router();
router.post("/addSchool", (req, res) => {
  // console.log(req.body);
  const { name, address, latitude, longitude } = req.body;

  if (
    !name ||
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const schoolTable =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(schoolTable, [name, address, latitude, longitude], (err, result) => {
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

// distance formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371; // Radius of Earth

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get("/listSchools", (req, res) => {
  // console.log("Requesting query",req.query);
  const { latitude, longitude } = req.query;

  if (typeof latitude === "undefined" || typeof longitude === "undefined") {
    console.log("This is latitude", latitude);
    console.log("This is longitude", longitude);
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  console.log("this is userLat", userLat);
  console.log("this is userLon", userLon);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: "Invalid latitude or longitude" });
  }

  const query = "SELECT id, name, address, latitude, longitude FROM schools";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    // console.log(results);
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

    console.log(schoolsWithDistance);
    res.json(schoolsWithDistance);
  });
});

export default router;
