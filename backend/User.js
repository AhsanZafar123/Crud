const mongoose = require('mongoose');

// Define the schema for user data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create a Mongoose model from the schema and export it
module.exports = mongoose.model('User', userSchema);
