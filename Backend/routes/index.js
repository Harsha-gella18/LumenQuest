const express = require('express');
const router = express.Router();

const userRoutes = require('./users/user.js');
const authRoutes = require('./auth/auth.js');
const adminRoutes = require('./admin/admin.js'); // <-- Add this line

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes); // <-- Add this line

module.exports = router;