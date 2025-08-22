const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// MySQL connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) console.error("❌ MySQL connection error:", err);
  else console.log("✅ Connected to MySQL Database");
});

// Serve registration form
app.get("/register", (req, res) => {
  res.send(`
    <h2>Register</h2>
    <form method="POST" action="/register">
      <input type="text" name="name" placeholder="Name" required /><br><br>
      <input type="email" name="email" placeholder="Email" required /><br><br>
      <input type="password" name="password" placeholder="Password" required /><br><br>
      <button type="submit">Register</button>
    </form>
  `);
});

// Handle registration
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.send("All fields are required.");

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.send("Database error!");
    res.send("User registered successfully ✅ <br><a href='/login'>Go to Login</a>");
  });
});

// Serve login form
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input type="email" name="email" placeholder="Email" required /><br><br>
      <input type="password" name="password" placeholder="Password" required /><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.send("All fields are required.");

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.send("Database error!");
    if (results.length === 0) return res.send("Invalid credentials ❌");
    res.send(`Login successful ✅ <br>Welcome, ${results[0].name} <br><a href='/jobs'>View Jobs</a>`);
  });
});

// Serve job listing
app.get("/jobs", (req, res) => {
  const sql = `
    SELECT j.id, j.title, j.company, j.description, j.posted_at, u.name AS posted_by_name
    FROM jobs j
    LEFT JOIN users u ON j.posted_by = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.send("Database error!");
    let html = "<h2>Job Listings</h2><ul>";
    results.forEach(job => {
      html += `<li><strong>${job.title}</strong> at ${job.company || "N/A"} (Posted by: ${job.posted_by_name})</li>`;
    });
    html += "</ul><a href='/login'>Add Job</a>";
    res.send(html);
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
