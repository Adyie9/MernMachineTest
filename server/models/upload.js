import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import xlsx from "xlsx";
import fs from "fs";
import Agent from "../models/Agent.js";
import Task from "../models/Task.js";

const router = express.Router();

// Multer storage
const upload = multer({ dest: "uploads/" });

// @route POST /api/upload
// @desc Upload and distribute CSV/XLSX tasks
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = req.file.originalname.split(".").pop();

    let records = [];

    if (ext === "csv") {
      // Parse CSV
      records = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", reject);
      });
    } else if (ext === "xlsx" || ext === "xls") {
      // Parse Excel
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = xlsx.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Validate format
    const isValid = records.every(
      (row) => row.FirstName && row.Phone && row.Notes
    );
    if (!isValid) {
      return res.status(400).json({ error: "Invalid file format" });
    }

    // Fetch agents
    const agents = await Agent.find();
    if (agents.length < 1) {
      return res.status(400).json({ error: "No agents available" });
    }

    // Distribute tasks equally
    let i = 0;
    for (const record of records) {
      const agent = agents[i % agents.length];
      await Task.create({
        agentId: agent._id,
        firstName: record.FirstName,
        phone: record.Phone,
        notes: record.Notes,
      });
      i++;
    }

    res.json({ message: "Tasks distributed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
