const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

// Route to create a new user
router.post('/register', async (req, res) => {
  try {
    console.log("New user request received", req.body); 
    const { name, username, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating new user:", err); 
    res.status(400).json({ message: err.message });
  }
});

// Route to authenticate a user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error authenticating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route to get all users
router.get('/getUsers', async (req, res) => {
  try {
    console.log("Fetching all users");
    const users = await User.find({}, '_id name username');
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route to update a user
router.put('/updateUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a user
router.delete('/deleteUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(deletedUser);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;