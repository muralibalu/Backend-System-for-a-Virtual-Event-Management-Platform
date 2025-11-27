const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const users = require("../data/users");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const BCRYPT_SALT_ROUNDS = 10;

async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "name, email and password required" });
  const existing = users.find((u) => u.email === email.toLowerCase());
  if (existing) return res.status(409).json({ error: "User already exists" });
  const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = {
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    passwordHash: hash,
    role: role === "organizer" ? "organizer" : "attendee",
  };
  users.push(user);
  return res
    .status(201)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email & password required" });
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  return res.json({ token });
}

module.exports = { register, login };
