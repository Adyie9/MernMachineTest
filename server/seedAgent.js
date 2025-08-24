const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("MongoDB Connected");

  const agents = [];
  const salt = await bcrypt.genSalt(10);

  for (let i = 1; i <= 5; i++) {
    const hashedPassword = await bcrypt.hash("password123", salt);
    agents.push({
      name: `Agent ${i}`,
      email: `agent${i}@test.com`,
      mobile: `99999999${i}`,
      password: hashedPassword,
      role: "agent",
    });
  }

  await User.insertMany(agents);
  console.log("✅ 5 Agents Seeded");
  process.exit();
});
