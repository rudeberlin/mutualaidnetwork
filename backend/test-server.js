import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

const server = app.listen(PORT, () => {
  console.log(`✨ Test Server running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
