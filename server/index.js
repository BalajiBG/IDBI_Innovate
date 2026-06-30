require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const dataRoutes = require('./routes/data');
const avatarRoutes = require('./routes/avatar');
const helpRoutes = require('./routes/help');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/help', helpRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'WealthSeva AI Backend', timestamp: new Date().toISOString() });
});

// Serve React frontend in production
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Kuch gadbad ho gayi. Please try again.', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 WealthSeva AI server running on port ${PORT}`);
});
