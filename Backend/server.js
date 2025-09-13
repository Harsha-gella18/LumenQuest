const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');

const app = express();
require('dotenv').config();
// Import models
require('./models/User');
require('./models/Plan');
require('./models/Subscription');
require('./models/Payment');
require('./models/Offer');
require('./models/AuditLog');
// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiberconnecttv';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Example base route
app.get('/', (req, res) => {
  res.send('FiberConnectTV API is running');
});

// Use unified API routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});