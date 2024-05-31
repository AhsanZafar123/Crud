const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./users'); // Import user routes
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://192.168.18.16:3000',
  credentials: true // If you're sending cookies or other credentials with your request
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase'; // Updated MongoDB connection string
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes); // Mount user routes under /api

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
