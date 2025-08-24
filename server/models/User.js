// server/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["admin", "agent", "user"], default: "user" },
    password: { type: String }, // if you use auth
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
