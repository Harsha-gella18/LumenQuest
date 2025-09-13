const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fiberconnecttv', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Import models
require('./models/User');
require('./models/Plan');
require('./models/Subscription');
require('./models/Payment');
require('./models/Offer');

// Example route
app.get('/', (req, res) => {
  res.send('FiberConnectTV API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});