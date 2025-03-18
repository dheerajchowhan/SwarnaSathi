const User = require('../models/UserSchema.js');
const BlacklistedToken = require('../models/BlacklistedToken');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Validate email and password input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }
  
      try {
        // Find user by email with password
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
  
        // Check password match
        const isMatch = await user.matchPasswords(password);
  
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
  
        // Generate token
        const token = generateToken(user._id);

        await user.addToken(token);
        // Send response
        res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        console.error('Login error:', error); // Add this for debugging
        res.status(500).json({
          success: false,
          message: 'Error finding user',
          error: error.message
        });
      }
    } catch (error) {
      console.error('Server error:', error); // Add this for debugging
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  

// Logout user
exports.logout = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Remove token from user's tokens array
    await BlacklistedToken.create({ token: token});
    await req.user.removeToken(token);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};