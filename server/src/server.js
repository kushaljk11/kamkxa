require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Create HTTP server
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`GoTaskManager server running on port ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  const handleShutdown = async () => {
    console.log('\n[GoTaskManager] Gracefully shutting down...');
    server.close(() => {
      console.log('[GoTaskManager] HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();
