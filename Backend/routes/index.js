const express = require('express');
const router = express.Router();

const userRoutes = require('./users/user..js');
const authRoutes = require('./auth/auth.js');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;