const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const existing = db.findByEmail(email.toLowerCase());
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name: name.trim(), email: email.toLowerCase(), password: hashed };
    db.addUser(user);
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const user = db.findByEmail(email.toLowerCase());
    if (!user) return res.status(400).json({ error: "No account found for this email" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "Unauthorized" });
  const parts = h.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(parts[1], process.env.JWT_SECRET || "secret");
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
}
app.get("/api/me", auth, async (req, res) => {
  const { id, name, email } = req.user;
  res.json({ id, name, email });
});
app.listen(PORT, () => console.log("server listening on", PORT));
