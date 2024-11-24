const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const captchaRoutes = require('./routes/captchaRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json'); 

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use routes
app.use('/api', captchaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
