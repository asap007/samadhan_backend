// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adviceRoutes = require('./routes/adviceRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/advice', adviceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});