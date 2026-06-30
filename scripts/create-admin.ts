import connectDB from "../src/lib/mongodb";
import User from "../src/models/User";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: npm run create-admin -- <email> <password> [name]");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error(`User with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: "admin",
  });

  console.log(`Admin user created: ${user.email}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
