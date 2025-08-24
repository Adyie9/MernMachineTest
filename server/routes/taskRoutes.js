const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

// GET /api/tasks/grouped
router.get("/grouped", async (req, res) => {
  try {
    // Always fetch the same 5 agents
    const agents = await User.find({ role: "agent" })
      .sort({ createdAt: 1 })
      .limit(5);

    const grouped = {};
    agents.forEach((a, idx) => {
      grouped[`Agent ${idx + 1}`] = [];
    });

    const tasks = await Task.find({}).select("firstName phone notes agentId");

    tasks.forEach((t) => {
      const idx = agents.findIndex(
        (a) => a._id.toString() === t.agentId?.toString()
      );
      if (idx !== -1) {
        grouped[`Agent ${idx + 1}`].push({
          firstName: t.firstName,
          phone: t.phone,
          notes: t.notes,
        });
      }
    });

    return res.json(grouped);
  } catch (err) {
    console.error("Grouped tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/tasks/agent -> tasks for logged-in agent
router.get("/agent", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "agent")
      return res.status(403).json({ message: "Not an agent" });

    const tasks = await Task.find({ agentId: req.user._id }).select(
      "firstName phone notes"
    );
    res.json(tasks);
  } catch (err) {
    console.error("Agent tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
