const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware    
app.use(cors());
app.use(bodyParser.json());

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/authDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully!');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Enhanced User Schema with additional fields
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false }, // Optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Test Endpoint
app.get('/api/test', (req, res) => {
  console.log("✅ Test endpoint hit!");
  res.send("Backend is working! 🎉");
});

// Request logger middleware
app.use((req, res, next) => {
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); 
});

// Registration Route - Updated with new fields
app.post('/api/register', async (req, res) => {
  try {
    console.log("Registration request:", req.body);
    
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    
    // Validate required fields
    if (!firstName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const user = new User({ 
      firstName,
      lastName,
      email, 
      password, // Note: In production, hash passwords with bcrypt
      phoneNumber
    });
    
    const savedUser = await user.save();
    
    // Return success response with user data (excluding password)
    const userResponse = {
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      phoneNumber: savedUser.phoneNumber,
      _id: savedUser._id
    };
    
    res.status(201).json({
      success: true,
      user: userResponse
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(400).json({ 
      success: false,
      error: error.message
    });
  }
});

// Login Route - Updated with proper response format
app.post('/api/login', async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Verify password (in production, use bcrypt.compare())
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Return user data (excluding password)
    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      _id: user._id
    };
    
    res.json({
      success: true,
      user: userResponse
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});