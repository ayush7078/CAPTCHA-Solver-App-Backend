// config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Create MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as necessary
  queueLimit: 0
});

// Export the pool to be used in other parts of the application
module.exports = pool;
