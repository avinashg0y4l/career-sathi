require('dotenv').config();

const mysql = require("mysql2");

// Replace with your Railway environment variables
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) return console.error("❌ MySQL connection error:", err);
  console.log("✅ Connected to MySQL Database");

  // Test insertion
  const testUser = { name: "Test User", email: "test@example.com", password: "12345" };
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [testUser.name, testUser.email, testUser.password],
    (err, result) => {
      if (err) return console.error("❌ Insert error:", err);
      console.log("✅ Inserted test user with ID:", result.insertId);

      // Test retrieval
      db.query("SELECT * FROM users WHERE email = ?", [testUser.email], (err, results) => {
        if (err) return console.error("❌ Select error:", err);
        console.log("✅ Fetched user:", results);
        db.end(); // Close connection
      });
    }
  );
});
