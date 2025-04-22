const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
