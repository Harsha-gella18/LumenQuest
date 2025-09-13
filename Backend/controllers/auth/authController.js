const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};

// Helper: sign JWT
const signToken = (user, expiresIn = '15m') =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn }
  );

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, preferences, profilePic } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const user = new User({
      fullName, email, phone, passwordHash, preferences, profilePic,
      isVerified: false,
      otp,
      otpExpires
    });
    await user.save();
    // Send OTP email (real)
    await sendEmail(email, 'Your FiberConnectTV OTP', `Your OTP is: ${otp}`);
    res.status(201).json({
      message: 'Signup successful, OTP sent to email. Please verify to activate your account.',
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Please signup again.' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully. You can now login.' });
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
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
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

    // Send reset email (real)
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