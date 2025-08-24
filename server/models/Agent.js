// server/routes/agentRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// GET agents
router.get("/", async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).sort({ createdAt: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD agent
router.post("/add", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Agent with this email already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "agent",
    });

    await agent.save();
    res.json({ message: "✅ Agent created successfully", agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// QUICK SEED: create 5 agents if not present
router.post("/seed", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "agent" });
    if (count >= 5) return res.json({ message: "Already have 5+ agents" });

    const base = count + 1;
    const toCreate = [];
    for (let i = base; i <= 5; i++) {
      toCreate.push({
        name: `Agent ${i}`,
        email: `agent${i}@test.com`,
        mobile: `99999999${i}`,
        role: "agent",
        password: await bcrypt.hash("pass", 10),
      });
    }
    const created = await User.insertMany(toCreate);
    res.json({ message: "Seeded agents", created });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
