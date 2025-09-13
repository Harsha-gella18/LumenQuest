const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Helper: sign JWT
const signToken = (user, expiresIn = '15m') =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn }
  );

// Helper: send dummy email (replace with real email logic)
const sendEmail = async (to, subject, text) => {
  console.log(`Email to ${to}: ${subject} - ${text}`);
};

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, preferences, profilePic } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      fullName, email, phone, passwordHash, preferences, profilePic
    });
    await user.save();

    // Send verification email (dummy)
    await sendEmail(email, 'Verify your account', 'Verification link (dummy)');

    res.status(201).json({
      message: 'Signup successful, verification email sent',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        preferences: user.preferences,
        profilePic: user.profilePic,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();

    const accessToken = signToken(user, '15m');
    const refreshToken = signToken(user, '7d');

    res.json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/refresh
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
    jwt.verify(refreshToken, process.env.JWT_SECRET || 'devsecret', (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid refresh token' });
      const accessToken = signToken(decoded, '15m');
      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/logout
exports.logout = async (req, res) => {
  // For stateless JWT, just respond OK (implement blacklist if needed)
  res.json({ message: 'Logged out successfully' });
};

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'Reset password link sent to email' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 hour
    await user.save();

    // Send reset email (dummy)
    await sendEmail(email, 'Reset Password', `Reset link: http://localhost:3000/reset-password/${token}`);

    res.json({ message: 'Reset password link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};