// server/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // every task belongs to an agent for this assignment
    },
    firstName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
