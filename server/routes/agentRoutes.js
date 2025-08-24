// server/routes/agentRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET agents
router.get("/", async (req, res) => {
  const agents = await User.find({ role: "agent" }).sort({ createdAt: 1 });
  res.json(agents);
});

// QUICK SEED: create 5 agents if not present
router.post("/seed", async (req, res) => {
  const count = await User.countDocuments({ role: "agent" });
  if (count >= 5) return res.json({ message: "Already have 5+ agents" });

  const base = count + 1;
  const toCreate = [];
  for (let i = base; i <= 5; i++) {
    toCreate.push({
      name: `Agent ${i}`,
      email: `agent${i}@test.com`,
      role: "agent",
      password: "pass", // optional for your auth
    });
  }
  const created = await User.insertMany(toCreate);
  res.json({ message: "Seeded agents", created });
});

module.exports = router;
