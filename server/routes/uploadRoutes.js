const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const ExcelJS = require("exceljs");
const upload = require("../middleware/upload");
const User = require("../models/User");
const Task = require("../models/Task");

const router = express.Router();

// POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = req.file.originalname.split(".").pop().toLowerCase();

    let rows = [];

    // --- Parse CSV ---
    if (ext === "csv") {
      rows = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => {
            results.push({
              firstName: (data.FirstName || data.firstname || "").trim(),
              phone: (data.Phone || data.phone || "").toString().trim(),
              notes: (data.Notes || data.notes || "").trim(),
            });
          })
          .on("end", () => resolve(results))
          .on("error", reject);
      });
    }

    // --- Parse XLS / XLSX ---
    else if (ext === "xlsx" || ext === "xls") {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const ws = workbook.worksheets[0];
      ws.eachRow((row, rowNum) => {
        if (rowNum === 1) return; // Skip header
        rows.push({
          firstName: (row.getCell(1).value || "").toString().trim(),
          phone: (row.getCell(2).value || "").toString().trim(),
          notes: (row.getCell(3).value || "").toString().trim(),
        });
      });
    }

    // --- Invalid File ---
    else {
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json({ message: "Invalid file type. Only CSV/XLSX/XLS allowed." });
    }

    // cleanup temp file
    fs.unlinkSync(filePath);

    if (!rows.length) {
      return res.status(400).json({ message: "File is empty or invalid" });
    }

    // --- Validate ---
    const valid = rows.every(
      (r) => r.firstName && r.phone && r.notes
    );
    if (!valid) {
      return res.status(400).json({
        message: "Invalid file format. Must contain FirstName, Phone, Notes.",
      });
    }

    // --- Ensure 5 Agents Exist ---
    const agents = await User.find({ role: "agent" })
      .sort({ createdAt: 1 })
      .limit(5);

    if (agents.length < 5) {
      return res.status(400).json({
        message: "At least 5 agents required. Run POST /api/agents/seed first.",
      });
    }

    // --- Clear old tasks before inserting ---
    await Task.deleteMany({});

    // --- Distribute Tasks Round-Robin ---
    const docs = rows.map((row, i) => ({
      firstName: row.firstName,
      phone: row.phone,
      notes: row.notes,
      agentId: agents[i % 5]._id,
    }));

    await Task.insertMany(docs);

    res.json({
      message: "✅ Tasks uploaded & distributed successfully",
      total: docs.length,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
