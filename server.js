const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // ✅ Serve HTML, CSS, JS from public

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) console.error("❌ MySQL connection error:", err);
  else console.log("✅ Connected to MySQL Database");
});

// Redirect root to main page
app.get("/", (req, res) => res.redirect("/jobs.html"));

// POST /register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ message: "User registered successfully ✅", userId: result.insertId });
  });
});

// POST /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    res.status(200).json({ message: "Login successful ✅", user: results[0] });
  });
});

// POST /jobs
app.post("/jobs", (req, res) => {
  const { title, company, description, posted_by } = req.body;
  if (!title || !posted_by)
    return res.status(400).json({ error: "Title and posted_by are required" });

  const sql = "INSERT INTO jobs (title, company, description, posted_by) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, company, description, posted_by], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ message: "Job added successfully ✅", jobId: result.insertId });
  });
});

// GET /jobs
app.get("/jobs", (req, res) => {
  const sql = `
    SELECT j.id, j.title, j.company, j.description, j.posted_at, u.name AS posted_by_name
    FROM jobs j
    LEFT JOIN users u ON j.posted_by = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
