// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db'); // Import connectDB from db.js
const captchaRoutes = require('./routes/captchaRoutes');

dotenv.config();

// Call the connectDB function to initiate the connection
connectDB();

// Create Express app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Use routes
app.use('/api', captchaRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
