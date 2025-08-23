// simple-db-test.js
const mysql = require('mysql2');

// MySQL connection using your Railway URL
const db = mysql.createConnection('mysql://root:JAOrhoKSQTKBthERdPNVFPYAwlPDvlSr@mysql.railway.internal:3306/railway');

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
