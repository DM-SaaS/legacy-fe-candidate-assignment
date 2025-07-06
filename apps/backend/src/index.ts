import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Web3 Message Signer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
