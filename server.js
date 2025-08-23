// simple-db-test.js
const mysql = require('mysql2');

// MySQL connection using your Railway URL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

// Connect to the database
db.connect(err => {
  if (err) return console.error("❌ Connection error:", err);
  console.log("✅ Connected to MySQL Database");

  // Test query: fetch first 5 users
  db.query("SELECT * FROM users LIMIT 5", (err, results) => {
    if (err) return console.error("❌ Query error:", err);
    console.log("✅ Fetched users:", results);

    // Close connection
    db.end();
  });
});
