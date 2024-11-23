const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const captchaRoutes = require('./routes/captchaRoutes');

dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use('/api', captchaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




